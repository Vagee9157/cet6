/* 提取练习与写译估分闭环（window.CET6Recall）
 * - 关键词卡：TRANSLATION 每段的 keys（「中文 english / alt」）→ 看中文打英文，宽松比对（大小写、冠词、斜杠备选、be 省略、词形）
 * - 模板句卡：WRITING 每篇的 hl（范文高分表达）→ 范文原句挖空，补全；提示用范文讲解里的中文，没有就看前后文
 * - 两种卡共用间隔复习：S.cards[id] = {due, stage, last, wrongN, n}，id = 'tk:<transId>:<i>' / 'hl:<writeId>:<i>'
 *   答对 stage+1，间隔按 stage 取 GAPS = [1, 3, 7, 14, 30]（答错 stage=0、明天再来）；到期日不超过考试日期，考前 3 天内的到期提前到考前第 3 天
 * - 写译估分趋势：S.wtScore 的「初稿 → 最近」小趋势 + 最低分项的具体改写任务
 * 依赖：window.CET6（app.js）、window.CET6Learn（learn.js，取考试日期）、window.CET6Grade（grade.js，词干与关键词拆分）；运行时才取，加载顺序无要求 */
(() => {
  'use strict';
  const C = () => window.CET6;
  const G = () => window.CET6Grade;
  const St = () => C().S;
  const esc = (t) => C().esc(t);
  const ic = (n) => C().ic(n);
  const today = () => C().lday();
  const isDay = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
  const addDays = (d, n) => { const [y, m, dd] = d.split('-').map(Number); return C().lday(new Date(y, m - 1, dd + n)); };
  const GAPS = [1, 3, 7, 14, 30];
  const NEW_PER_DAY = { tk: 10, hl: 5 };
  const KIND = { tk: { name: '关键词卡', mod: 'm-trans', unit: '个关键词' }, hl: { name: '模板句', mod: 'm-write', unit: '句模板句' } };

  /* ---------- 到期日：不超过考试日期，考前 3 天内的到期提前 ---------- */
  // last = 这次作答日期，raw = 按间隔算出的到期日。考试日期已过就不管
  function capDue(last, raw) {
    const L = window.CET6Learn, ex = L && L.examDate ? L.examDate() : null;
    if (!isDay(ex) || ex < today()) return raw;
    const lim = addDays(ex, -3); if (raw <= lim) return raw;
    if (last < lim) return lim;
    const top = addDays(ex, -1), lo = addDays(last, 1), r = raw < top ? raw : top;
    return r > lo ? r : lo;
  }

  /* ---------- 宽松比对 ---------- */
  const ART = new Set(['a', 'an', 'the']);
  const FUNCW = new Set("of to in on at by for with from and or as it its is are be was were been sb sth one oneself one's someone something that this into than up".split(' '));
  const stem = (w) => (G() && G().stem ? G().stem(w) : String(w).toLowerCase());
  const toks = (s) => String(s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/\.\.\.|…/g, ' ').replace(/\((?:s|es|ed|d|ing)\)/g, '').match(/[a-z0-9]+(?:['\-][a-z0-9]+)*/g) || [];
  const core = (s) => { let t = toks(s).filter((x) => !ART.has(x)); if (t[0] === 'be' && t.length > 1) t = t.slice(1); return t; };
  // 返回 {ok, level: exact / near / bad / empty, alt, miss: 漏掉的词}
  function judge(input, alts) {
    const a = core(input); if (!a.length) return { ok: false, level: 'empty', alt: alts[0], miss: [] };
    const as = a.map(stem), setA = new Set(as.filter((x, i) => !FUNCW.has(a[i])));
    let best = null;
    for (const alt of alts) {
      const b = core(alt); if (!b.length) continue;
      const bs = b.map(stem);
      if (as.join(' ') === bs.join(' ')) return { ok: true, level: 'exact', alt, miss: [] };
      const cb = bs.filter((x, i) => !FUNCW.has(b[i])), setB = new Set(cb);
      if (!cb.length) { if (a.join(' ') === b.join(' ')) return { ok: true, level: 'exact', alt, miss: [] }; continue; }
      const hit = cb.filter((x) => setA.has(x)).length, extra = [...setA].filter((x) => !setB.has(x)).length, rec = hit / cb.length;
      const miss = b.filter((x, i) => !FUNCW.has(x) && !setA.has(bs[i]));
      if ((rec === 1 && extra <= 1) || (cb.length >= 5 && rec >= 0.8 && extra <= 2)) return { ok: true, level: 'near', alt, miss };
      if (!best || rec > best.rec) best = { ok: false, level: 'bad', alt, rec, miss };
    }
    return best || { ok: false, level: 'bad', alt: alts[0], miss: [] };
  }

  /* ---------- 卡片数据 ---------- */
  let TK = null, HL = null, THEMES = null;
  // 翻译主题顺序：按真题索引 PAST 里翻译主题出现次数从多到少，没出现过的排后面
  function themes() {
    if (THEMES) return THEMES;
    const past = {}, own = {};
    (typeof PAST !== 'undefined' ? PAST : []).forEach((p) => { const t = p.translation && p.translation.theme; if (t) past[t] = (past[t] || 0) + 1; });
    (typeof TRANSLATION !== 'undefined' ? TRANSLATION : []).forEach((t) => { const k = t.theme || '其他'; own[k] = (own[k] || 0) + 1; });
    THEMES = Object.keys(own).sort((a, b) => (past[b] || 0) - (past[a] || 0) || own[b] - own[a]).map((k) => ({ k, past: past[k] || 0 }));
    return THEMES;
  }
  function tkCards() {
    if (TK) return TK;
    const rank = Object.fromEntries(themes().map((t, i) => [t.k, i]));
    TK = [];
    (typeof TRANSLATION !== 'undefined' ? TRANSLATION : []).forEach((t) => (t.keys || []).forEach((k, i) => {
      const x = G().keyAlts(k); if (!x.zh || !x.alts.length) return;
      TK.push({ id: `tk:${t.id}:${i}`, kind: 'tk', zh: x.zh, en: x.en, alts: x.alts, theme: t.theme || '其他', src: t });
    }));
    TK.sort((a, b) => rank[a.theme] - rank[b.theme]);   // 稳定排序：同主题内保持题库顺序
    return TK;
  }
  // 范文讲解里带引号的英文后面跟着的中文（如 "at one's own pace" 按自己的节奏）当提示
  function zhHint(w, h) {
    const hs = new Set(core(h).filter((x) => !FUNCW.has(x)).map(stem)); if (!hs.size) return '';
    for (const n of w.notes || []) {
      const re = /["“]([^"”]+)["”]\s*([^"“]*)/g; let m;
      while ((m = re.exec(n))) {
        const q = core(m[1]).filter((x) => !FUNCW.has(x)).map(stem); if (!q.length) continue;
        const hit = q.filter((x) => hs.has(x)).length;
        if (hit / Math.max(q.length, hs.size) < 0.7) continue;
        const zh = (m[2].match(/^[（(]?([一-龥][^，。；;、"“（(]*)/) || [])[1];
        if (zh && zh.length >= 2 && zh.length <= 16) return zh.trim();
      }
    }
    return '';
  }
  function hlCards() {
    if (HL) return HL;
    HL = [];
    (typeof WRITING !== 'undefined' ? WRITING : []).forEach((w) => {
      const paras = String(w.sample || '').split(/\n\s*\n/);
      (w.hl || []).forEach((h, i) => {
        let off = 0, pi = -1, pos = -1;
        for (let k = 0; k < paras.length; k++) { const j = paras[k].indexOf(h); if (j >= 0) { pi = k; pos = j; break; } off += paras[k].length; }
        if (pi < 0) return;
        const p = paras[pi], ss = []; const re = /[^.!?]+(?:[.!?]+["”’)]*|$)\s*/g; let m;
        while ((m = re.exec(p)) && m[0]) ss.push([m.index, m.index + m[0].length]);
        const a = ss.findIndex(([s, e]) => pos >= s && pos < e), b = ss.findIndex(([s, e]) => pos + h.length > s && pos + h.length <= e);
        const s0 = ss[a < 0 ? 0 : a][0], e0 = ss[b < 0 ? ss.length - 1 : b][1];
        HL.push({ id: `hl:${w.id}:${i}`, kind: 'hl', ans: h, w, pi, pn: paras.length,
          before: p.slice(s0, pos), after: p.slice(pos + h.length, e0).trimEnd(),
          prev: a > 0 ? p.slice(ss[a - 1][0], ss[a - 1][1]).trim() : '', next: b >= 0 && b < ss.length - 1 ? p.slice(ss[b + 1][0], ss[b + 1][1]).trim() : '',
          zh: zhHint(w, h), nw: toks(h).length });
      });
    });
    return HL;
  }
  const cardsOf = (kind) => (kind === 'tk' ? tkCards() : hlCards());
  const byId = (id) => cardsOf(id.slice(0, 2)).find((c) => c.id === id);

  /* ---------- 状态与调度 ---------- */
  const box = () => { const s = St(); if (!s.cards || typeof s.cards !== 'object' || Array.isArray(s.cards)) s.cards = {}; return s.cards; };
  const extra = { tk: 0, hl: 0 };   // 当天手动加的新卡（不持久化）
  const newToday = (kind) => Object.entries(box()).filter(([id, c]) => id.startsWith(kind + ':') && c && c.n === today()).length;
  const newLeft = (kind) => Math.max(0, NEW_PER_DAY[kind] + extra[kind] - newToday(kind));
  const isDue = (c) => c && isDay(c.due) && c.due <= today();
  function dueCards(kind, theme) { const b = box(); return cardsOf(kind).filter((c) => (!theme || c.theme === theme) && isDue(b[c.id])).sort((x, y) => b[x.id].due.localeCompare(b[y.id].due)); }
  function freshCards(kind, theme, n) { const b = box(); return cardsOf(kind).filter((c) => (!theme || c.theme === theme) && !b[c.id]).slice(0, n); }
  // 今日待做：到期 + 还能学的新卡
  function counts(kind) {
    const due = dueCards(kind).length, fresh = Math.min(newLeft(kind), freshCards(kind, '', 999).length);
    const did = Object.entries(box()).filter(([id, c]) => id.startsWith(kind + ':') && c && c.last === today()).length;
    return { due, fresh, left: due + fresh, did };
  }
  // 作答：答对 stage+1、按 GAPS 拉长；答错 stage 归 0、明天再来；同一天第二次作答（本轮重来）不改调度
  function grade(id, ok) {
    const b = box(), t = today(), c = b[id] ? Object.assign({}, b[id]) : { stage: 0, wrongN: 0, n: t };
    if (ok) { c.stage = (c.last ? (c.stage || 0) : 0) + 1; c.due = capDue(t, addDays(t, GAPS[Math.min(c.stage, GAPS.length - 1)])); }
    else { c.stage = 0; c.wrongN = (c.wrongN || 0) + 1; c.due = capDue(t, addDays(t, 1)); }
    c.last = t; b[id] = c; C().save(); return c;
  }

  /* ---------- 卡片练习界面（写译页「关键词卡 / 模板句」） ---------- */
  let ses = null, host = null, onRerender = null, curKind = 'tk';
  const theme = { tk: '' };
  function newSession(kind) {
    const th = kind === 'tk' ? theme.tk : '';
    const q = [...dueCards(kind, th), ...freshCards(kind, th, newLeft(kind))].map((c) => ({ id: c.id }));
    ses = { kind, th, q, i: 0, res: null, right: 0, wrong: 0, first: q.length };
  }
  function themeChips() {
    const b = box();
    const chip = (k, label, sub) => `<button class="chip" data-cdth="${esc(k)}" aria-pressed="${theme.tk === k}">${esc(label)}${sub ? `<small>${sub}</small>` : ''}</button>`;
    const all = tkCards();
    return `<div class="cd-themes"><span>主题 · 按真题出现次数</span>${chip('', '全部')}${themes().map((t) => { const cs = all.filter((c) => c.theme === t.k), d = cs.filter((c) => isDue(b[c.id])).length, l = cs.filter((c) => b[c.id]).length; return chip(t.k, t.k, `${t.past ? `考过 ${t.past} 次 · ` : ''}${l}/${cs.length}${d ? ` · 到期 ${d}` : ''}`); }).join('')}</div>`;
  }
  function blankHTML(c) {
    return `${esc(c.before)}<span class="cd-blank" aria-label="空格，${c.nw} 个词">${'＿'.repeat(Math.min(10, Math.max(3, c.nw * 2)))}<small>${c.nw} 词</small></span>${esc(c.after)}`;
  }
  function cardHTML(c, r) {
    const st = box()[c.id];
    const tag = !st ? '<span class="tag">新卡</span>' : st.stage ? `<span class="tag">第 ${st.stage + 1} 轮</span>` : '<span class="tag hot">上次答错</span>';
    let q = '';
    if (c.kind === 'tk') q = `<div class="cd-lab">${tag}<span>中文 → 英文 · 出自《${esc(c.src.title)}》· ${esc(c.theme)}</span></div><div class="cd-zh">${esc(c.zh)}</div>`;
    else q = `<div class="cd-lab">${tag}<span>补全模板句 · ${esc(c.w.tag || c.w.title.split('·')[0].trim())} · 第 ${c.pi + 1}/${c.pn} 段</span></div>
      ${c.zh ? `<div class="cd-hint">${ic('i-bulb')}<span>提示：${esc(c.zh)}</span></div>` : ''}
      <div class="cd-ctx">${c.prev ? `<span class="dim">${esc(c.prev)}</span> ` : ''}<span class="cur">${r ? `${esc(c.before)}<mark>${esc(c.ans)}</mark>${esc(c.after)}` : blankHTML(c)}</span>${c.next ? ` <span class="dim">${esc(c.next)}</span>` : ''}</div>`;
    const form = r ? '' : `<form class="cd-form" data-cdform><input class="cd-in" name="a" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${c.kind === 'tk' ? '输入英文' : '补全划线部分'}" aria-label="${c.kind === 'tk' ? '英文' : '补全内容'}"><button class="btn primary" type="submit">${ic('i-check')}提交</button></form>
      <div class="cd-sub"><button class="btn ghost" type="button" data-cdskip>不会，看答案</button>${c.kind === 'hl' && c.nw > 1 ? `<button class="btn ghost" type="button" data-cdfirst>看首词</button><span class="cd-first" hidden>首词：<b>${esc(c.ans.split(/\s+/)[0])}</b></span>` : ''}</div>`;
    let res = '';
    if (r) {
      const ans = c.kind === 'tk' ? c.alts.join(' / ') : c.ans;
      const head = r.ok ? (r.level === 'exact' ? `${ic('i-check')}正确` : `${ic('i-check')}基本对`) : r.level === 'empty' ? `${ic('i-x')}不会` : `${ic('i-x')}不对`;
      const note = r.ok && r.level === 'near' ? `<p class="cd-note">${r.miss.length ? `漏了 ${r.miss.map(esc).join('、')}，` : ''}注意介词、冠词和词形，考场上按参考写。</p>` : '';
      res = `<div class="cd-res ${r.ok ? 'ok' : 'bad'}" role="status"><b>${head}</b>${r.input ? `<span class="mine">你写：${esc(r.input)}</span>` : ''}
        <div class="cd-ans"><span>参考</span><b>${esc(ans)}</b></div>${note}
        <p class="cd-sched">${r.again ? '本轮重来，不改复习安排' : r.ok ? `下次复习 ${esc(box()[c.id].due)}` : '明天再来；本轮末尾还会再出一次'}</p></div>
        <div class="cd-next"><button class="btn primary" data-cdnext>${ses.i + 1 >= ses.q.length ? '完成' : '下一张'}${ic('i-chev-r')}</button>${!r.ok && !r.again && r.level !== 'empty' ? '<button class="btn ghost" data-cdok>其实我写对了</button>' : ''}</div>`;
    }
    return `<div class="card cd-card">${q}${res}${form}</div>`;
  }
  function doneHTML(kind) {
    const b = box(), t1 = addDays(today(), 1), tm = Object.entries(b).filter(([id, c]) => id.startsWith(kind + ':') && c && c.due === t1).length;
    const fresh = freshCards(kind, kind === 'tk' ? theme.tk : '', 1).length;
    const learned = cardsOf(kind).filter((c) => b[c.id]).length;
    return `<div class="empty cd-empty">${ic('i-party')}${ses && ses.first ? `这一轮 ${ses.first} 张，一次答对 ${ses.right} 张。` : ''}今天${kind === 'tk' && theme.tk ? `「${esc(theme.tk)}」` : ''}没有到期的${KIND[kind].name}了。
      <span class="cd-stat">已学 ${learned}/${cardsOf(kind).length} · 明天到期 ${tm} 张</span>
      ${fresh ? `<div class="empty-acts"><button class="btn primary" data-cdmore>${ic('i-redo')}再学 ${kind === 'tk' ? 10 : 5} 张新卡</button></div>` : ''}</div>`;
  }
  function html(kind) {
    if (!ses || ses.kind !== kind || (kind === 'tk' && ses.th !== theme.tk)) newSession(kind);
    const k = KIND[kind], cn = counts(kind), cur = ses.q[ses.i];
    const top = `<div class="cd-top ${k.mod}"><div class="cd-th"><b>${k.name}</b><span class="cd-n"><b>${cn.due}</b> 到期 · <b>${cn.fresh}</b> 新卡</span></div>
      <p>${kind === 'tk' ? `${TRANSLATION.length} 段翻译的关键词 ${tkCards().length} 个，看中文打英文；大小写、冠词、斜杠备选、be 都不计较` : `${WRITING.length} 篇范文的高分表达 ${hlCards().length} 句，原句挖空补全`}。答对按 1 / 3 / 7 / 14 / 30 天拉长间隔，答错明天再来，考前 3 天内的到期会提前。</p></div>`;
    const prog = ses.q.length ? `<div class="cd-prog ${k.mod}"><span>${Math.min(ses.i + (ses.res ? 1 : 0), ses.q.length)} / ${ses.q.length}</span><span class="bar"><i style="width:${Math.round(Math.min(ses.i + (ses.res ? 1 : 0), ses.q.length) / ses.q.length * 100)}%"></i></span><span>对 ${ses.right} · 错 ${ses.wrong}</span></div>` : '';
    const body = cur ? prog + cardHTML(byId(cur.id), ses.res) : doneHTML(kind);
    return `<div class="cd ${k.mod}">${top}${kind === 'tk' ? themeChips() : ''}${body}</div>`;
  }
  function paint() {
    if (!host || !host.isConnected) return;
    host.innerHTML = html(curKind);
    const inp = host.querySelector('.cd-in'), nx = host.querySelector('[data-cdnext]');
    // 只在键盘设备上自动聚焦输入框，手机不自动弹键盘挡住题目
    if (inp && matchMedia('(hover:hover) and (pointer:fine)').matches) inp.focus({ preventScroll: true });
    else if (nx) nx.focus({ preventScroll: true });
  }
  function answer(input, giveUp) {
    const cur = ses.q[ses.i]; if (!cur || ses.res) return;
    const c = byId(cur.id), r = giveUp ? { ok: false, level: 'empty', miss: [] } : judge(input, c.kind === 'tk' ? c.alts : [c.ans]);
    r.input = giveUp ? '' : String(input || '').trim(); r.again = !!cur.again;
    if (!cur.again) { cur.snap = box()[c.id] ? Object.assign({}, box()[c.id]) : null; grade(c.id, r.ok); if (r.ok) ses.right++; else ses.wrong++; }
    if (!r.ok && !cur.again) ses.q.push({ id: c.id, again: true });   // 答错的本轮末尾再来一次
    ses.res = r; paint(); if (onRerender) onRerender();
  }
  function mount(el, kind, rerender) {
    host = el; onRerender = rerender; curKind = kind;
    if (!ses || ses.kind !== kind) ses = null;
    paint();
    el.onsubmit = (e) => { e.preventDefault(); const f = e.target.closest('[data-cdform]'); if (f) answer(f.elements.a.value); };
    el.onclick = (e) => {
      const th = e.target.closest('[data-cdth]'); if (th) { theme.tk = th.dataset.cdth; ses = null; paint(); return; }
      if (e.target.closest('[data-cdskip]')) { answer('', true); return; }
      const fw = e.target.closest('[data-cdfirst]'); if (fw) { const s = host.querySelector('.cd-first'); if (s) s.hidden = false; fw.remove(); const inp = host.querySelector('.cd-in'); if (inp) inp.focus(); return; }
      if (e.target.closest('[data-cdnext]')) { ses.i++; ses.res = null; paint(); return; }
      if (e.target.closest('[data-cdok]')) {
        // 判错了：撤回这次「答错」，按答对重排，并去掉本轮的重来
        const cur = ses.q[ses.i]; const b = box(); if (cur.snap) b[cur.id] = cur.snap; else delete b[cur.id];
        grade(cur.id, true); ses.wrong--; ses.right++;
        const j = ses.q.findIndex((x, k) => k > ses.i && x.id === cur.id && x.again); if (j >= 0) ses.q.splice(j, 1);
        ses.res = Object.assign({}, ses.res, { ok: true, level: 'near', miss: [] }); paint(); if (onRerender) onRerender(); return;
      }
      if (e.target.closest('[data-cdmore]')) { extra[curKind] += curKind === 'tk' ? 10 : 5; ses = null; paint(); if (onRerender) onRerender(); return; }
    };
  }

  /* ---------- 首页今日计划用 ---------- */
  // 合计两种卡：left 今日还剩（到期 + 新卡额度），did 今天已练；sub = 到期多的那种
  function planInfo() {
    if (typeof TRANSLATION === 'undefined' || typeof WRITING === 'undefined' || !G()) return null;
    const a = counts('tk'), b = counts('hl');
    const left = a.left + b.left, due = a.due + b.due;
    return { left, due, did: a.did + b.did, sub: a.left >= b.left ? 'tk' : 'hl', min: Math.max(3, Math.round(due * 0.4 + (a.fresh + b.fresh) * 0.6)), tk: a, hl: b };
  }

  /* ---------- 写译估分趋势 + 改写任务 ---------- */
  const wtVal = (x) => (x.manual != null ? x.manual : x.score);
  function wtHist(id) { const arr = (St().wtScore || {})[id]; return Array.isArray(arr) ? arr.filter((x) => x && typeof x.score === 'number').sort((a, b) => a.ts - b.ts) : []; }
  const VIA = { wt: '写译页', exam: '模考', diag: '诊断' };
  const PLAIN = [['important', 'crucial / vital'], ['good', 'beneficial / favorable'], ['bad', 'detrimental / harmful'], ['very', 'remarkably / extremely'], ['many', 'numerous / a large number of'], ['big', 'considerable / substantial'], ['think', 'hold the view / am convinced'], ['help', 'facilitate / contribute to'], ['show', 'demonstrate / reveal'], ['get', 'acquire / obtain'], ['use', 'utilize / make use of'], ['so', 'therefore / consequently'], ['but', 'however / nevertheless'], ['also', 'moreover / furthermore'], ['need', 'be in urgent need of'], ['a lot of', 'a great deal of / plenty of'], ['more and more', 'an increasing number of']];
  const ord = (n) => `第 ${n} 段`;
  const cut = (s, n) => { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  function lowItem(gr) {
    if (!gr || !gr.items || !gr.items.length) return -1;
    let k = 0; gr.items.forEach((x, i) => { if (x.pts < gr.items[k].pts || (x.pts === gr.items[k].pts && x.w > gr.items[k].w)) k = i; });
    return gr.items[k].pts >= 9 ? -1 : k;
  }
  // 最低分项 → 一条能马上动手的改写任务
  function rewriteTask(kind, item, text, gr) {
    const k = lowItem(gr); if (k < 0) return null;
    const it = gr.items[k], g = G(), ps = g.paras(text), np = ps.length, n = gr.n || g.enCount(text);
    const body = np >= 3 ? 2 : Math.max(1, np);
    const sents = (p) => (ps[p - 1] ? g.sentences(ps[p - 1]) : []);
    let task = '';
    if (kind === 'write') {
      if (it.k === 'sen') { const s = sents(body)[0]; task = `句式单一：把${ord(body)}任意一句改成倒装句（Only by … can we …）或强调句（It is … that …），再用 which / although 把两个短句并成一句。${s ? `比如这句：「${cut(s, 70)}」` : ''}`; }
      else if (it.k === 'voc') {
        const low = text.toLowerCase(), hits = PLAIN.filter(([w]) => new RegExp(`\\b${w}\\b`).test(low)).slice(0, 2);
        const where = (w) => { const i = ps.findIndex((p) => new RegExp(`\\b${w}\\b`, 'i').test(p)); return i >= 0 ? ord(i + 1) : ''; };
        task = hits.length ? `词汇偏基础：${hits.map(([w, r]) => `把${where(w)}的「${w}」换成 ${r}`).join('；')}。` : `词汇偏基础：在${ord(body)}加两个高级表达，比如 foster、indispensable、What is more。`;
      } else if (it.k === 'len') {
        if (n < 150) task = `字数只有 ${n} 词：在${ord(body)}的理由后面补一个具体例子（For instance, …），写到 150 词以上。`;
        else { const li = ps.map((p) => g.enCount(p)).reduce((m, c, i, a) => (c > a[m] ? i : m), 0); task = `超过 200 词（${n} 词）：删掉${ord(li + 1)}最长的一句，或把两句并成一句。`; }
      } else if (it.k === 'rel') { const t = (item.title || '').split('·').slice(1).join('·').trim(); task = `切题度低：${ord(1)}第一句直接写出题目关键词${t ? `「${t}」` : ''}，每段首句都回扣题目。`; }
      else if (it.k === 'str') task = np < 3 ? `结构只有 ${np} 段：分成三段——开头点题 → 理由 + 例子 → 总结，段间空一行。` : /总结|结尾/.test(it.tip) ? `结尾不完整：在${ord(np)}加一句总结，用 In conclusion, … 或 Only by … can we …。` : `开头没点题：${ord(1)}第一句直接亮观点，用 When it comes to …, I believe …。`;
      else task = `基础规范：${it.tip}`;
    } else {
      if (it.k === 'key') {
        const mine = new Set(core(text).map(stem));
        const miss = (item.keys || []).map(g.keyAlts).filter((x) => !x.alts.some((a) => { const c = core(a).filter((w) => !FUNCW.has(w)).map(stem); return c.length && c.every((s) => mine.has(s)); })).slice(0, 2);
        task = miss.length ? `关键词漏译：${miss.map((x) => `「${x.zh}」用 ${x.alts[0]}`).join('；')}，放回对应的句子里。` : `关键词：${it.tip}`;
      } else if (it.k === 'ov') task = `意思没译全：对照原文逐句检查，${it.tip.replace(/^和参考译文/, '与参考译文')}`;
      else if (it.k === 'len') task = `长度：${it.tip}`;
      else task = `基础规范：${it.tip}`;
    }
    return { k, name: it.name, pts: it.pts, task };
  }
  // 写译页作答框下：历次估分的小趋势 + 改写任务。opt.gr 本次估分结果；opt.stale 作答已改、估分作废
  const taskMemo = {};
  function trendHTML(id, opt) {
    opt = opt || {};
    const h = wtHist(id); if (!h.length && !opt.gr) return '';
    if (opt.gr) taskMemo[id] = rewriteTask(opt.kind, opt.item, opt.text, opt.gr);
    const tk = taskMemo[id];
    let line = '';
    if (h.length) {
      const a = wtVal(h[0]), z = wtVal(h[h.length - 1]), d = z - a;
      const bars = h.map((x, i) => `<i class="${i === h.length - 1 ? 'last' : ''}" style="height:${Math.max(8, Math.round(wtVal(x) / 15 * 100))}%" title="${esc(VIA[x.via] || '')} ${wtVal(x)} 分"></i>`).join('');
      line = `<div class="wt-tr"><span class="spark" aria-hidden="true">${bars}</span><span class="tx"><span class="ln">${h.length > 1 ? `初稿 <b>${a}</b> 分 → 最近 <b>${z}</b> 分<em class="${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '+' + d : d < 0 ? d : '持平'}</em>` : `第 1 次估分 <b>${z}</b> 分，按下面的任务改一处再估，看分数变化`}</span><small>共 ${h.length} 次估分${h.some((x) => x.via !== 'wt') ? '（含模考 / 诊断）' : ''}</small></span></div>`;
    }
    const stale = opt.stale ? `<p class="wt-stale">${ic('i-pen')}作答已改动，上面的估分作废（历史记录保留），改完点「再估一次」。</p>` : '';
    const task = tk ? `<div class="wt-task"><div class="hd"><span class="tag hot">最弱 · ${esc(tk.name)} ${tk.pts}/10</span><b>改写任务</b></div><p>${esc(tk.task)}</p></div>` : '';
    const btn = (tk || opt.stale) ? `<button class="btn soft" data-wtgrade="${esc(id)}">${ic('i-redo')}${opt.stale ? '再估一次' : '改好了，再估一次'}</button>` : '';
    return `${line}${stale}${task}${btn ? `<div class="wt-tacts">${btn}</div>` : ''}`;
  }
  // 估分面板里把最低的一项标出来
  function markLow(el, gr) { const k = lowItem(gr); if (!el || k < 0) return; const rows = el.querySelectorAll('.gr-it'); if (rows[k]) rows[k].classList.add('low'); }

  window.CET6Recall = { GAPS, NEW_PER_DAY, capDue, judge, tkCards, hlCards, themes, counts, grade, mount, planInfo, trendHTML, markLow, rewriteTask, wtHist,
    _debug: () => ses && { kind: ses.kind, i: ses.i, n: ses.q.length, cur: ses.q[ses.i] && byId(ses.q[ses.i].id), res: ses.res } };
})();
