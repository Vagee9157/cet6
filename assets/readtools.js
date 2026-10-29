/* 听读做题页工具（window.CET6RT）：
 *  - 限时模式：阅读做题页「限时」开关（S.timed），按真考节奏倒计时（S.timeLim 分钟，缺省 仔细阅读 8 / 段落匹配 15 / 选词填空 5），到 0 自动交卷，结果卡标「限时交卷」
 *  - 速度追踪：「我的 · 练习记录」按题型给平均用时 vs 考场时限、正确率和一句提示（数据 S.hist 的 sec / sub）
 *  - 选词填空「两步作答」（S.clozeStep）：点空格先判这一空要的词性（可加单复数 / 时态提示），再选词；交卷后对照「词性判断 ✓/✗」（词性表 assets/data-cloze-pos.js）
 *  - 原文点词：阅读原文、听力原文里双击（电脑）/ 长按 300ms（手机）/「点词」模式单击一个词，弹出释义气泡，可加入生词本
 * 数据：S.hist[i].tl 限时分钟 / .to 时间到自动交卷 / .pos {n, ok} 两步作答词性判断；S.drafts[id].pos 未交卷的词性选择；S.tapWord 点词模式；新词存 S.myWords [{w, d, src, ctx}]
 * 本文件在 app.js 之前加载，app.js 的工具函数运行时经 window.CET6 取用。 */
(() => {
  'use strict';
  const C = () => window.CET6;
  const St = () => C().S;
  const esc = (t) => C().esc(t), ic = (n) => C().ic(n);
  const $ = (s, el = document) => el.querySelector(s);
  const READK = ['mc', 'match', 'cloze'];
  const KN = { mc: '仔细阅读', match: '段落匹配', cloze: '选词填空' };
  const EXAM_LIM = { mc: 8, match: 15, cloze: 5 };   // 考场节奏（分钟）：仔细阅读每篇 8、段落匹配 15、选词填空 5
  const LIM_MIN = 2, LIM_MAX = 30;

  /* ================= 限时模式 ================= */
  const limMin = (k) => { const v = St().timeLim && +St().timeLim[k]; return v >= LIM_MIN && v <= LIM_MAX ? v : EXAM_LIM[k]; };
  // 做题页打开时调用：带上限时开关、恢复两步作答的词性选择
  function initCur(cur, draft) {
    cur.timed = !!St().timed && READK.includes(cur.kind) && !cur.back;
    cur.pos = draft && draft.pos && typeof draft.pos === 'object' ? { ...draft.pos } : {};
  }
  const limitOf = (cur) => (cur && cur.timed && !cur.done && !cur.back && READK.includes(cur.kind) ? limMin(cur.kind) * 60 : 0);
  // 交卷后：给刚写进 S.hist 的那条补上限时 / 词性判断
  function afterSubmit(cur) {
    const s = St(), h = s.hist && s.hist[s.hist.length - 1]; if (!h || h.id !== cur.set.id) return;
    if (cur.timed) { cur.tl = limMin(cur.kind); h.tl = cur.tl; if (cur.to) h.to = 1; }
    const ps = posStats(cur); if (ps) h.pos = ps;
    C().save();
  }
  // 结果卡：限时交卷标签 + 两步作答词性判断汇总
  function resultHTML(cur) {
    const out = [];
    if (cur.tl) out.push(cur.to ? `<span class="rt-tag to">${ic('i-timer')}限时交卷 · ${cur.tl} 分钟到，自动交卷</span>` : `<span class="rt-tag in">${ic('i-check')}限时 ${cur.tl} 分钟内完成</span>`);
    const ps = posStats(cur); if (ps) out.push(`<span class="rt-tag pos">词性判断 ${ps.ok}/${ps.n}</span>`);
    return out.length ? `<div class="rt-tags">${out.join('')}</div>` : '';
  }

  /* ---------- 做题页工具条：限时 / 两步作答 / 点词 ---------- */
  const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches;
  function toolsHTML(cur) {
    if (!cur || cur.back) return '';
    const read = READK.includes(cur.kind), s = St(), chips = [];
    if (read && !cur.done) chips.push(`<button class="chip rt-sw" data-rt-timed aria-pressed="${!!cur.timed}">${ic('i-timer')}限时 ${limMin(cur.kind)} 分钟</button>`);
    if (cur.kind === 'cloze' && !cur.done) chips.push(`<button class="chip rt-sw" data-rt-step aria-pressed="${!!s.clozeStep}">两步作答：先判词性</button>`);
    const hasText = read || (cur.kind === 'listen' && (cur.done || cur.showTr));
    if (hasText) chips.push(`<button class="chip rt-sw" data-rt-tap aria-pressed="${!!s.tapWord}">点词${s.tapWord ? '中' : ''}</button>`);
    if (!chips.length) return '';
    const tip = s.tapWord ? '点原文里任意单词看释义、收进生词本' : fine() ? '双击原文单词查词' : '长按原文单词查词';
    const tnote = cur.timed && !cur.done ? `考场节奏，到点自动交卷（时长在阅读列表「限时设置」里调）` : '';
    return `<div class="rt-tools">${chips.join('')}<span class="rt-tip">${[tnote, tip].filter(Boolean).join(' · ')}</span></div>`;
  }

  /* ================= 选词填空两步作答 ================= */
  const POS = ['n.', 'v.', 'adj.', 'adv.'];
  const POSZH = { 'n.': '名词', 'v.': '动词', 'adj.': '形容词', 'adv.': '副词' };
  const FORMS = { 'n.': [['sg', '单数'], ['pl', '复数']], 'v.': [['base', '原形'], ['s', '三单 -s'], ['ed', '过去式 / 分词'], ['ing', '-ing']] };
  const FORMZH = { sg: '单数', pl: '复数', base: '原形', s: '三单 -s', ed: '过去式 / 分词', ing: '-ing' };
  const posOf = (setId, L) => (typeof CLOZE_POS !== 'undefined' && CLOZE_POS[setId] && CLOZE_POS[setId][L]) || null;
  // 答案词的形式（按词形）：动词 -ed / -en 分词、-ing、-s；名词 -s 复数
  function formOf(pos, w) {
    w = String(w || '').toLowerCase();
    if (pos === 'v.') return /ed$|een$/.test(w) ? 'ed' : /ing$/.test(w) ? 'ing' : /[^s]s$/.test(w) ? 's' : 'base';
    if (pos === 'n.') return /[^su]s$/.test(w) ? 'pl' : 'sg';
    return null;
  }
  const stepOn = (cur) => !!(cur && cur.kind === 'cloze' && St().clozeStep && !cur.back);
  // 词库区：没判词性 → 词性选择；判了 → 词库（同词性的亮、其他淡），最前面是「第 N 空 · adj. · 改」
  function clozeBankHTML(cur, used) {
    if (!stepOn(cur) || cur.done || cur.active === undefined) return '';
    const i = cur.active, p = cur.pos[i] || {}, set = cur.set;
    if (!p.p || p.open) {
      const fr = p.p && FORMS[p.p] ? `<div class="rt-prow"><span>${p.p === 'v.' ? '时态 / 形式' : '单复数'}（可选）</span>${FORMS[p.p].map(([k, l]) => `<button class="chip" data-rt-form="${k}" aria-pressed="${p.f === k}">${l}</button>`).join('')}<button class="chip go" data-rt-go>${p.f ? '去选词' : '跳过，去选词'}${ic('i-chev-r')}</button></div>` : '';
      return `<div class="bank rt-pick"><div class="rt-prow"><b>第 ${i + 1} 空要什么词？</b>${POS.map((x) => `<button class="chip" data-rt-pos="${x}" aria-pressed="${p.p === x}">${x}<i>${POSZH[x]}</i></button>`).join('')}</div>${fr}</div>`;
    }
    return `<div class="bank rt-bank"><button class="chip rt-cur" data-rt-repos title="改这一空的词性判断"><b>第 ${i + 1} 空</b> ${esc(p.p)}${p.f ? ' · ' + esc(FORMZH[p.f]) : ''}<i>改</i></button>${set.bank.map((b) => { const L = b[0], hit = posOf(set.id, L) === p.p; return `<button class="chip ${used.has(L) ? 'used' : ''} ${hit ? 'pos-hit' : 'pos-dim'}" data-bank="${L}">${esc(b)}</button>`; }).join('')}</div>`;
  }
  const clozeLead = (cur) => (stepOn(cur) ? '<p class="lead">两步作答：点空格 → 先判这一空要的词性（名词还可选单复数、动词可选时态）→ 词库里同词性的词会亮起，再选词。</p>' : '');
  // 空格上：判了词性还没填词时显示「· adj.」
  const blankTag = (cur, i) => (stepOn(cur) && cur.pos[i] && cur.pos[i].p ? ` · <i class="rt-bp">${esc(cur.pos[i].p)}</i>` : '');
  function posStats(cur) {
    if (!cur || cur.kind !== 'cloze' || !cur.pos) return null;
    let n = 0, ok = 0;
    Object.entries(cur.pos).forEach(([i, p]) => { const a = posOf(cur.set.id, cur.set.answers[+i]); if (!p || !p.p || !a) return; n++; if (p.p === a) ok++; });
    return n ? { n, ok } : null;
  }
  // 交卷后每空：词性判断 ✓/✗（+ 形式）
  function clozeExpHTML(cur, i) {
    const p = cur.pos && cur.pos[i]; if (!p || !p.p) return '';
    const L = cur.set.answers[i], a = posOf(cur.set.id, L); if (!a) return '';
    const ok = p.p === a, w = C().clozeWord(cur.set, L), fa = formOf(a, w);
    const fm = p.f && ok && fa ? `；形式 ${p.f === fa ? '✓' : `✗（应为${esc(FORMZH[fa])}）`}` : '';
    return `<div class="rt-pj ${ok ? 'ok' : 'bad'}">词性判断 ${ok ? '✓' : '✗'} 你判 ${esc(p.p)}${p.f ? ' ' + esc(FORMZH[p.f]) : ''}${ok ? '' : `，${esc(w)} 是 ${esc(a)}（${POSZH[a]}）`}${fm}</div>`;
  }

  /* ---------- 做题页点击（app.js renderSet 最先调，返回 true 表示已处理） ---------- */
  function click(e, cur) {
    if (!cur) return false;
    const s = St(), rer = () => C().rerenderSet();
    if (e.target.closest('[data-rt-timed]')) {
      s.timed = !cur.timed; C().save(); cur.timed = s.timed && READK.includes(cur.kind);
      if (cur.timed) C().startTimer(0);   // 打开限时：从现在起倒计时满额
      rer(); return true;
    }
    if (e.target.closest('[data-rt-step]')) { s.clozeStep = !s.clozeStep; C().save(); rer(); return true; }
    if (e.target.closest('[data-rt-tap]')) { s.tapWord = !s.tapWord; C().save(); hidePop(); rer(); return true; }
    if (cur.done || !stepOn(cur)) return false;
    const i = cur.active; if (i === undefined) return false;
    const ps = e.target.closest('[data-rt-pos]');
    if (ps) { const v = ps.dataset.rtPos, old = cur.pos[i] || {}; cur.pos[i] = { p: v, f: old.p === v ? old.f : undefined, open: !!FORMS[v] }; if (!cur.pos[i].f) delete cur.pos[i].f; rer(); return true; }
    const fm = e.target.closest('[data-rt-form]');
    if (fm && cur.pos[i]) { cur.pos[i].f = fm.dataset.rtForm; delete cur.pos[i].open; rer(); return true; }
    if (e.target.closest('[data-rt-go]') && cur.pos[i]) { delete cur.pos[i].open; rer(); return true; }
    if (e.target.closest('[data-rt-repos]') && cur.pos[i]) { cur.pos[i].open = true; rer(); return true; }
    return false;
  }

  /* ---------- 阅读列表：限时设置 ---------- */
  function readHomeHTML() {
    const s = St();
    return `<div class="rt-set card m-read"><div class="rp-h">${ic('i-timer')}<b>限时设置</b><span>按真考节奏练，到点自动交卷</span><button class="chip rt-sw" data-rt-timed-home aria-pressed="${!!s.timed}">${s.timed ? '限时已开' : '限时已关'}</button></div>
      <div class="rt-lims">${READK.map((k) => `<div class="rt-lim"><span class="n">${KN[k]}</span><button class="chip" data-rt-lim="${k}" data-d="-1" aria-label="${KN[k]}减 1 分钟" ${limMin(k) <= LIM_MIN ? 'disabled' : ''}>−</button><b>${limMin(k)}<small> 分钟</small></b><button class="chip" data-rt-lim="${k}" data-d="1" aria-label="${KN[k]}加 1 分钟" ${limMin(k) >= LIM_MAX ? 'disabled' : ''}>+</button><span class="ex">${limMin(k) === EXAM_LIM[k] ? '考场节奏' : `考场 ${EXAM_LIM[k]}`}</span></div>`).join('')}</div></div>`;
  }
  function homeClick(e) {
    const s = St();
    if (e.target.closest('[data-rt-timed-home]')) { s.timed = !s.timed; C().save(); repaintSet(); return true; }
    const b = e.target.closest('[data-rt-lim]'); if (b) { const k = b.dataset.rtLim; s.timeLim = Object.assign({}, s.timeLim); s.timeLim[k] = Math.max(LIM_MIN, Math.min(LIM_MAX, limMin(k) + +b.dataset.d)); C().save(); repaintSet(); return true; }
    return false;
  }
  const repaintSet = () => { const el = $('#practice-box .rt-set'); if (el) el.outerHTML = readHomeHTML(); };

  /* ================= 速度追踪（我的 · 练习记录） ================= */
  const mins = (sec) => { const m = Math.floor(sec / 60), s = Math.round(sec % 60); return s ? `${m}′${String(s).padStart(2, '0')}″` : `${m}′`; };
  function speedStats() {
    const hist = Array.isArray(St().hist) ? St().hist : [];
    return READK.map((k) => {
      const xs = hist.filter((h) => h && h.sub === k && !h.via && h.sec > 0 && h.t > 0).slice(-10);
      const n = xs.length, sec = n ? xs.reduce((a, h) => a + h.sec, 0) / n : 0;
      const r = xs.reduce((a, h) => a + h.r, 0), t = xs.reduce((a, h) => a + h.t, 0);
      return { k, n, sec, lim: EXAM_LIM[k] * 60, acc: t ? Math.round(r / t * 100) : null, over: n ? sec / (EXAM_LIM[k] * 60) : 0 };
    });
  }
  function speedTip(st) {
    const has = st.filter((x) => x.n);
    if (!has.length) return { t: '做几篇阅读交卷后，这里按题型对比你的平均用时和考场时限。' };
    const slow = has.filter((x) => x.over > 1.1).sort((a, b) => b.over - a.over)[0];
    if (slow) {
      const m = Math.round(slow.sec / 60);
      if (slow.k === 'match') return { t: `段落匹配平均 ${m} 分钟，考场只有 15 分钟，先练定位训练`, b: `<button class="btn soft m-read" data-rt-drill="locate">${ic('i-target')}去练定位训练</button>` };
      if (slow.k === 'mc') return { t: `仔细阅读平均 ${m} 分钟一篇，考场每篇只有 8 分钟，先练定位训练（带着题干回原文找句子）`, b: `<button class="btn soft m-read" data-rt-drill="locate">${ic('i-target')}去练定位训练</button>` };
      return { t: `选词填空平均 ${m} 分钟，考场只有 5 分钟，先判词性再选词能少来回试`, b: `<button class="btn soft m-read" data-rt-cloze>${ic('i-pen')}两步作答练一篇</button>` };
    }
    const weak = has.filter((x) => x.n >= 2 && x.acc !== null && x.acc < 60).sort((a, b) => a.acc - b.acc)[0];
    if (weak) return { t: `${KN[weak.k]}时间够用，但正确率只有 ${weak.acc}%，先求准：练同义替换`, b: `<button class="btn soft m-read" data-rt-drill="para">${ic('i-swap')}去练同义替换</button>` };
    return { t: '做过的题型都在考场时限内，开「限时」模式保持这个节奏。' };
  }
  function speedHTML() {
    const st = speedStats(), tip = speedTip(st);
    const row = (x) => {
      if (!x.n) return `<div class="sp-row none"><span class="sp-n">${KN[x.k]}</span><span class="sp-v">还没做过</span></div>`;
      const w = Math.min(100, x.sec / (x.lim * 1.6) * 100), lm = 1 / 1.6 * 100, over = x.sec > x.lim;
      return `<div class="sp-row${over ? ' over' : ''}"><span class="sp-n">${KN[x.k]}</span><span class="sp-bar" aria-hidden="true"><i style="width:${w.toFixed(1)}%"></i><em style="left:${lm.toFixed(1)}%"></em></span><span class="sp-v"><b>${mins(x.sec)}</b> / 考场 ${x.lim / 60}′</span><span class="sp-a ${x.acc >= 80 ? 'good' : x.acc < 60 ? 'bad' : ''}">${x.acc}%</span><span class="sp-c">${x.n} 篇</span></div>`;
    };
    return `<div class="sp-card"><div class="hl-d" style="margin-top:0">做题速度<small>最近 10 篇平均用时 vs 考场时限 · 正确率</small></div>${st.map(row).join('')}<div class="sp-tip">${ic('i-bulb')}<span>${esc(tip.t)}</span>${tip.b || ''}</div></div>`;
  }
  // 我的页点击：提示里的跳转
  function meClick(e) {
    const d = e.target.closest('[data-rt-drill]'); if (d) { C().openDrill(d.dataset.rtDrill); return true; }
    if (e.target.closest('[data-rt-cloze]')) {
      const s = St(); s.clozeStep = true; C().save();
      const pool = READING.cloze, fresh = pool.filter((x) => !s.sets[x.id]);
      const pick = (fresh.length ? fresh : pool.slice().sort((a, b) => (s.sets[a.id].r / s.sets[a.id].t) - (s.sets[b.id].r / s.sets[b.id].t)))[0];
      if (pick) C().goSet(pick.id); return true;
    }
    return false;
  }

  /* ================= 原文点词 ================= */
  const AREA = '#practice-box .passage, #practice-box .script, .wtap';
  // .wtap：单词卡 / 复习卡 / 小游戏词卡里的例句，单击就查词（句子短、没有点句重听）
  const TAP = '.wtap';
  const WCH = /[A-Za-z'’-]/;
  function caretAt(x, y) {
    if (document.caretPositionFromPoint) { const p = document.caretPositionFromPoint(x, y); return p && { node: p.offsetNode, off: p.offset }; }
    if (document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(x, y); return r && { node: r.startContainer, off: r.startOffset }; }
    return null;
  }
  // 坐标处的单词 + 所在句子
  function wordAt(x, y) {
    const c = caretAt(x, y); if (!c || !c.node || c.node.nodeType !== 3) return null;
    const area = c.node.parentElement && c.node.parentElement.closest(AREA); if (!area) return null;
    if (c.node.parentElement.closest('button,.pl,.who,.spk')) return null;
    const t = c.node.data; let a = c.off, b = c.off;
    if (a >= t.length || !WCH.test(t[a])) { if (a > 0 && WCH.test(t[a - 1])) a = b = a - 1; else return null; }
    while (a > 0 && WCH.test(t[a - 1])) a--; while (b < t.length && WCH.test(t[b])) b++;
    // 点在单词外很远（行尾空白）时 caret 会落到最近的词，用字符矩形再核一次
    try { const rg = document.createRange(); rg.setStart(c.node, a); rg.setEnd(c.node, b); const rc = rg.getBoundingClientRect(); if (rc.width && (x < rc.left - 6 || x > rc.right + 6 || y < rc.top - 6 || y > rc.bottom + 6)) return null; } catch {}
    let w = t.slice(a, b).replace(/^['’-]+|['’-]+$/g, '').replace(/['’]s$/i, '');
    if (w.length < 2 || !/[A-Za-z]/.test(w)) return null;
    const host = c.node.parentElement.closest('.seg, p, .wtap') || area;
    let pre = 0; try { const r = document.createRange(); r.setStart(host, 0); r.setEnd(c.node, a); pre = r.toString().length; } catch {}
    return { w, ctx: sentenceOf(host.textContent || '', pre), x, y };
  }
  function sentenceOf(text, at) {
    const re = /[.!?]+["”’)]*\s+/g; let s = 0, e = text.length, m;
    while ((m = re.exec(text))) { const end = m.index + m[0].length; if (end <= at) s = end; else { e = m.index + m[0].trimEnd().length; break; } }
    const out = text.slice(s, e).replace(/\s+/g, ' ').trim();
    return out.length > 260 ? out.slice(0, 257) + '…' : out;
  }
  // 词库查词：单词库（含 -s / -ed / -ing / -ly 还原，复用 drills.js wordId）
  let WMAP = null;
  function lookup(w) {
    const lw = w.toLowerCase(), D = window.CET6Drills;
    let id = D && D._wordId ? D._wordId(lw) : null;
    if (!id) {
      if (!WMAP) { WMAP = {}; C().ALLWORDS.forEach((x) => { const k = x.w.toLowerCase(); if (/^[a-z-]+$/.test(k) && !WMAP[k]) WMAP[k] = x.id; }); }
      id = WMAP[lw] || null;
    }
    return id ? C().wordOf(id) : null;
  }
  // 单词库以外的词：例句小词典 VOCAB_GLOSS（data-vocab-gloss.js，按词形查）
  // 词族反查：派生词（consistently）→「consistent 的词族  adv. 一贯地」
  let FAM = null;
  const famOf = (k) => { if (typeof VOCAB_MORPH === 'undefined') return ''; if (!FAM) { FAM = {}; for (const [base, m] of Object.entries(VOCAB_MORPH)) for (const [p, x, c] of m.f || []) { const xk = x.toLowerCase(); if (!FAM[xk]) FAM[xk] = `${base} 的词族  ${p} ${c}`; } } return FAM[k] || ''; };
  const glossOf = (w) => { const fam = famOf(w.toLowerCase().replace(/’/g, "'")); if (fam) return fam; if (typeof VOCAB_GLOSS === 'undefined') return ''; const k = w.toLowerCase().replace(/’/g, "'"); const tries = [k, k.replace(/'s$/, ''), k.replace(/s$/, ''), k.replace(/es$/, ''), k.replace(/ies$/, 'y'), k.replace(/ed$/, ''), k.replace(/d$/, ''), k.replace(/ing$/, ''), k.replace(/ing$/, 'e')]; for (const t of tries) if (VOCAB_GLOSS[t]) return t === k ? VOCAB_GLOSS[t] : `${t}（原形）  ${VOCAB_GLOSS[t]}`; return ''; };
  const curSetId = () => (C().curSet ? C().curSet() : '');
  let pop = null, popW = null;
  function hidePop() { if (pop) pop.hidden = true; popW = null; }
  function popHTML(info) {
    const s = St(), v = lookup(info.w), gl = v ? '' : glossOf(info.w);
    const inMy = !v && (s.myWords || []).some((x) => x && x.w.toLowerCase() === info.w.toLowerCase());
    const st = v ? s.vocab[v.id] : undefined, inBook = v ? st === 0 || st === 1 : inMy;
    const ctx = info.ctx ? esc(info.ctx).replace(new RegExp(`\\b(${info.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i'), '<mark>$1</mark>') : '';
    return `<div class="wp-h"><b class="wp-w">${esc(info.w)}</b><button class="wp-ic" data-wp-say aria-label="朗读">${ic('i-vol')}</button><button class="wp-ic wp-x" data-wp-x aria-label="关闭">${ic('i-x')}</button></div>
      ${v ? `<div class="wp-d">${v.w.toLowerCase() !== info.w.toLowerCase() ? `<span class="wp-base">原形 <b>${esc(v.w)}</b></span>` : ''}${C().sensesHTML ? C().sensesHTML(v) : `<span class="pos">${esc(v.p)}</span> ${esc(v.c)}`}</div>${st === 2 ? '<div class="wp-st">单词库里已标「认识」</div>' : ''}`
        : gl ? `<div class="wp-d wp-gl">${gl.split(/\s{2,}/).map(esc).join('<br>')}</div><div class="wp-d dim">不在单词库里，加入生词本会连同这句原文一起存下。</div>`
        : `<div class="wp-d dim">单词库里没有这个词。加入生词本会连同这句原文一起存下，「我的 · 生词本」里能看到。</div>`}
      ${ctx ? `<div class="wp-ctx">${ctx}</div>` : ''}
      <div class="wp-acts">${inBook ? `<button class="btn soft m-vocab" disabled>${ic('i-check')}已在生词本</button>` : `<button class="btn primary" data-wp-add>${ic('i-abc')}加入生词本</button>`}</div>`;
  }
  function showPop(info) {
    if (!pop) {
      pop = document.createElement('div'); pop.className = 'wpop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', '查词'); pop.hidden = true; document.body.appendChild(pop);
      pop.addEventListener('click', (e) => {
        if (e.target.closest('[data-wp-x]')) { hidePop(); return; }
        if (e.target.closest('[data-wp-say]') && popW) { C().speak(popW.w, 0.9); return; }
        if (e.target.closest('[data-wp-add]') && popW) { addWord(popW); const sy = popW.sy; pop.innerHTML = popHTML(popW); popW.sy = sy; const b = pop.querySelector('.wp-acts'); if (b) b.insertAdjacentHTML('beforeend', `<span class="wp-ok">${lookup(popW.w) ? '已标「不认识」，进单词生词本' : '已存进生词本'}</span>`); }
      });
    }
    info.sy = window.scrollY; popW = info; pop.innerHTML = popHTML(info); pop.hidden = false;
    const vw = document.documentElement.clientWidth, vh = window.innerHeight, r = pop.getBoundingClientRect();
    const left = Math.max(8, Math.min(vw - r.width - 8, info.x - r.width / 2));
    const top = info.y + 18 + r.height <= vh - 8 ? info.y + 18 : Math.max(8, info.y - r.height - 18);
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }
  // 加入生词本：单词库里有 → 标「不认识」（同听写收词）；没有 → S.myWords {w, d, src, ctx}
  function addWord(info) {
    const s = St(), v = lookup(info.w);
    if (v) { C().gameMark(v.id, false); return 'vocab'; }
    s.myWords = Array.isArray(s.myWords) ? s.myWords : [];
    const w = /^[A-Z][a-z]/.test(info.w) && !/^I$/.test(info.w) ? info.w.toLowerCase() : info.w;
    if (!s.myWords.some((x) => x && x.w.toLowerCase() === w.toLowerCase())) { s.myWords.push({ w, d: C().lday(), src: curSetId() || '', ctx: info.ctx || '' }); if (s.myWords.length > 500) s.myWords = s.myWords.slice(-500); }
    C().save(); return 'my';
  }
  const pick = (x, y) => { const info = wordAt(x, y); if (!info) return false; try { getSelection().removeAllRanges(); } catch {} showPop(info); return true; };
  // 电脑：双击
  document.addEventListener('dblclick', (e) => { if (!e.target.closest || !e.target.closest(AREA)) return; if (pick(e.clientX, e.clientY)) e.preventDefault(); });
  // 手机：长按 300ms（移动超过 10px = 滚动，取消）；触发后吞掉随后的 click / contextmenu，不触发点句重听
  let lp = null, swallow = 0;
  document.addEventListener('pointerdown', (e) => {
    if (pop && !pop.hidden && !e.target.closest('.wpop')) hidePop();
    if (e.pointerType === 'mouse' || !e.target.closest || !e.target.closest(AREA) || e.target.closest(TAP) || St().tapWord) return;
    const x = e.clientX, y = e.clientY;
    lp = { x, y, id: e.pointerId, t: setTimeout(() => { lp = null; if (pick(x, y)) { swallow = Date.now(); if (navigator.vibrate) try { navigator.vibrate(10); } catch {} } }, 300) };
  }, true);
  const cancelLp = () => { if (lp) { clearTimeout(lp.t); lp = null; } };
  document.addEventListener('pointermove', (e) => { if (lp && e.pointerId === lp.id && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) cancelLp(); }, true);
  ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, cancelLp, true));
  document.addEventListener('contextmenu', (e) => { if (Date.now() - swallow < 1500 && e.target.closest && e.target.closest(AREA)) e.preventDefault(); }, true);
  document.addEventListener('selectionchange', () => { if (Date.now() - swallow < 900) try { getSelection().removeAllRanges(); } catch {} });
  // 点词模式：单击查词（捕获阶段拦下，不触发原文点句重听）；长按之后的那次 click 也吞掉
  document.addEventListener('click', (e) => {
    if (!e.target.closest) return;
    if (Date.now() - swallow < 700 && e.target.closest(AREA)) { e.preventDefault(); e.stopPropagation(); return; }
    if (!(St().tapWord || e.target.closest(TAP)) || !e.target.closest(AREA) || e.target.closest('button')) return;
    if (pick(e.clientX, e.clientY)) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePop(); });
  window.addEventListener('scroll', () => { if (pop && !pop.hidden && popW && Math.abs(window.scrollY - popW.sy) > 80) hidePop(); }, { passive: true });
  window.addEventListener('hashchange', hidePop);
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('nav.tabs')) hidePop(); }, true);

  window.CET6RT = {
    EXAM_LIM, limMin, initCur, limitOf, afterSubmit, resultHTML, toolsHTML,
    clozeBankHTML, clozeLead, blankTag, clozeExpHTML, posOf, formOf,
    click, readHomeHTML, homeClick, speedStats, speedHTML, meClick,
    _wordAt: wordAt, _lookup: lookup, _addWord: addWord, hidePop,
  };
})();
