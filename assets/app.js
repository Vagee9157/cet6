(() => {
  'use strict';
  /* ---------- 存储 ---------- */
  const KEY = 'cet6.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const S = Object.assign({ mastered: {}, vocab: {}, sets: {}, wrong: {}, theme: '', plan: {}, rate: 1 }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  // 练习记录：每次交卷一条（同一篇多次也保留），S.rpick 记住随机抽题选的类型，S.papers 记生成过的模拟卷
  S.hist = S.hist || []; S.rpick = S.rpick || {}; S.papers = S.papers || [];
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ic = (n) => `<svg class="i"><use href="#${n}"/></svg>`;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const today = () => lday(); // 本地日期（lday 定义在单词区，运行时才调用）
  const CHMAP = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
  const MOD = { exam: 'm-exam', listen: 'm-listen', read: 'm-read', write: 'm-write', trans: 'm-trans', vocab: 'm-vocab' };
  const ptKey = (c, i) => c.id + ':' + i;
  const totalPts = CHAPTERS.reduce((n, c) => n + c.points.length, 0);
  const ALLWORDS = VOCAB.flatMap((g, gi) => g.words.map((w, wi) => ({ id: gi + ':' + wi, g: g.g, w: w[0], p: w[1], c: w[2], e: w[3] })));
  // 单词例句：VOCAB_EX（data-vocab-ex.js）每词 3 句带中文；缺数据时退回原例句
  const exOf = (w) => (typeof VOCAB_EX !== 'undefined' && VOCAB_EX[w.w]) || [[w.e, '']];
  // 高亮目标词：易混词按 " / " 拆开逐个高亮；短语去掉开头的 be，逐词匹配、词间允许夹 1–2 个词（take sth into account）；
  // 动词首词按规则变形 + 不规则变形表（came / ran / laid …）匹配；单词先精确匹配词形，找不到再退回词干
  const IRR = { come: 'came', run: 'ran', go: 'went|gone|goes', wear: 'wore|worn', bring: 'brought', take: 'took|taken', give: 'gave|given', make: 'made', have: 'had|has|having', hold: 'held', keep: 'kept', lay: 'laid', lie: 'lay|lain|lying', seek: 'sought', bear: 'bore|borne|born', get: 'got|gotten', stand: 'stood', find: 'found', think: 'thought', catch: 'caught', teach: 'taught', buy: 'bought', fight: 'fought', sell: 'sold', tell: 'told', say: 'said', pay: 'paid', mean: 'meant', send: 'sent', spend: 'spent', build: 'built', lend: 'lent', lose: 'lost', leave: 'left', feel: 'felt', deal: 'dealt', dwell: 'dwelt', meet: 'met', lead: 'led', feed: 'fed', flee: 'fled', win: 'won', hang: 'hung', bind: 'bound', strike: 'struck', stick: 'stuck', rise: 'rose|risen', arise: 'arose|arisen', write: 'wrote|written', drive: 'drove|driven', ride: 'rode|ridden', break: 'broke|broken', speak: 'spoke|spoken', choose: 'chose|chosen', freeze: 'froze|frozen', steal: 'stole|stolen', forget: 'forgot|forgotten', fall: 'fell|fallen', grow: 'grew|grown', know: 'knew|known', throw: 'threw|thrown', draw: 'drew|drawn', withdraw: 'withdrew|withdrawn', see: 'saw|seen', foresee: 'foresaw|foreseen', begin: 'began|begun', drink: 'drank|drunk', sink: 'sank|sunk', shrink: 'shrank|shrunk', swim: 'swam|swum', eat: 'ate|eaten', hide: 'hid|hidden', forbid: 'forbade|forbidden', shake: 'shook|shaken', undertake: 'undertook|undertaken', overcome: 'overcame', become: 'became', understand: 'understood', withstand: 'withstood', undergo: 'underwent|undergone', strive: 'strove|striven', light: 'lit', shed: 'shed', put: 'put', set: 'set', cut: 'cut', let: 'let', spread: 'spread', cast: 'cast', cost: 'cost', hurt: 'hurt', quit: 'quit', split: 'split', upset: 'upset', burst: 'burst' };
  const FUNC = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'up', 'out', 'off', 'down', 'into', 'about', 'and', 'or', 'as', 'it', 'sb', 'sth', 'one', "one's", 'oneself']);
  const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 规则变形：-s/-es/-ed/-ing；去 e；y→i；重读闭音节双写（run→running, drop→dropped）
  const inflRe = (w) => {
    const l = w.toLowerCase(), e = reEsc(w), alts = [];
    if (IRR[l]) alts.push(IRR[l]);
    if (/[^aeiou]y$/.test(l)) alts.push(reEsc(w.slice(0, -1)) + '(?:y|ies|ied|ying)');
    else if (/e$/.test(l)) alts.push(reEsc(w.slice(0, -1)) + '(?:e|es|ed|ing)');
    else { alts.push(e + '(?:s|es|ed|ing)?'); if (/[^aeiou][aeiou][bdgklmnprt]$/.test(l)) alts.push(e + w.slice(-1) + '(?:ed|ing)'); }
    return '(?:' + alts.join('|') + ')';
  };
  const tokRe = (t, i, n) => { if (FUNC.has(t.toLowerCase()) || /\d/.test(t)) return reEsc(t); if (i === 0) return inflRe(t); if (i === n - 1) return reEsc(t) + '(?:s|es)?'; return reEsc(t); };
  // 只替换第一处、跳过已高亮的 <em>
  const hlOnce = (html, src) => { let hit = false; const out = html.replace(new RegExp('(<em>[\\s\\S]*?</em>)|' + src, 'gi'), (m, skip, ...g) => { if (skip || hit) return m; hit = true; const caps = g.slice(0, -2); return caps.length ? caps.map((c, k) => (k % 2 ? c : `<em>${c}</em>`)).join('').replace(/<\/em>(\s+)<em>/g, '$1') : `<em>${m}</em>`; }); return hit ? out : null; };
  const hlOne = (html, word, exactOnly) => {
    const toks = word.trim().split(/\s+/); if (toks.length > 1 && toks[0].toLowerCase() === 'be') toks.shift();
    if (toks.length > 1) {
      const GAP = '((?:\\s+[^\\s<]+){0,2}?\\s+)';
      const src = '\\b' + toks.map((t, i) => '(' + tokRe(t, i, toks.length) + ')').join(GAP) + '\\b';
      const r = hlOnce(html, src); if (r) return r;
      const main = toks.filter((t) => !FUNC.has(t.toLowerCase())).sort((a, b) => b.length - a.length)[0];
      return main ? hlOne(html, main) : html;
    }
    const t = toks[0]; if (!t) return html;
    if (/-/.test(t)) return hlOnce(html, '\\b' + reEsc(t) + '[a-z]*') || html;
    const exact = hlOnce(html, '\\b' + inflRe(t) + '\\b'); if (exact || exactOnly) return exact || html;
    const h = t.replace(/[^a-z]/gi, ''); const stem = h.length > 6 ? h.slice(0, h.length - 2) : h.length > 4 ? h.slice(0, 4) : h;
    return (stem && hlOnce(html, '\\b' + stem + '[a-z]*')) || html;
  };
  const hlWord = (html, word) => { const parts = word.split(/\s+\/\s+/); if (parts.length < 2) return hlOne(html, word); const h = parts.reduce((x, p) => hlOne(x, p, true), html); return h !== html ? h : parts.reduce((x, p) => hlOne(x, p), html); };

  /* ---------- 主题 ---------- */
  const isDark = () => (S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  const applyTheme = () => { if (S.theme) document.documentElement.dataset.theme = S.theme; else delete document.documentElement.dataset.theme; $('#themeBtn use').setAttribute('href', isDark() ? '#i-sun' : '#i-moon'); };
  applyTheme();
  $('#themeBtn').onclick = () => { S.theme = isDark() ? 'light' : 'dark'; applyTheme(); save(); };

  /* ---------- 导航 ---------- */
  const VIEWS = ['home', 'vocab', 'practice', 'wt', 'exam', 'me'];
  // 模考页逻辑在 assets/exam.js（window.CET6Exam），通过 window.CET6 用本文件的工具函数
  const R = { home: renderHome, vocab: renderVocab, practice: renderPracticeHome, wt: renderWT, exam: () => window.CET6Exam && window.CET6Exam.render(), me: renderMe };
  function show(v, keep) {
    if (v !== 'practice' && typeof stopAudio === 'function') stopAudio();
    if (v !== 'exam' && window.CET6Exam) window.CET6Exam.leave();
    if (v !== 'vocab' && window.CET6Game) window.CET6Game.leave();
    VIEWS.forEach((x) => { $('#view-' + x).hidden = x !== v; });
    document.querySelectorAll('nav.tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.view === v));
    if (!keep) R[v]();
    if (location.hash.slice(1) !== v) history.replaceState(null, '', '#' + v);
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('nav.tabs button').forEach((b) => { b.onclick = () => show(b.dataset.view); });
  window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (VIEWS.includes(v)) show(v); });

  /* ---------- 统计 ---------- */
  function stats() {
    const known = Object.values(S.vocab).filter((v) => v === 2).length;
    const unknown = Object.values(S.vocab).filter((v) => v === 0 || v === 1).length; // 生词 = 不认识 + 模糊，与生词本同口径
    const seen = Object.keys(S.vocab).length;
    const setsDone = Object.keys(S.sets).length;
    const m = Object.keys(S.mastered).length;
    let r = 0, t = 0; Object.values(S.sets).forEach((s) => { r += s.r; t += s.t; });
    return { known, unknown, seen, setsDone, m, acc: t ? Math.round(r / t * 100) : null };
  }
  function speak(text, rate) {
    if (!('speechSynthesis' in window)) return alert('这个浏览器不支持语音朗读');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate || S.rate || 1;
    const vs = speechSynthesis.getVoices().filter((v) => /en[-_]US/i.test(v.lang));
    const pref = vs.find((v) => /Samantha|Google US|Aria|Jenny/i.test(v.name)) || vs[0]; if (pref) u.voice = pref;
    speechSynthesis.speak(u); return u;
  }

  /* ================= 首页 ================= */
  const SPLIT = [
    { k: 'listen', n: '听力', w: 35, pts: 248.5, tip: '25 题，讲座 10 题占 20%。冲 500 要做对 20 题 ≈ 185 分，讲座拿 8 个。' },
    { k: 'read', n: '阅读', w: 35, pts: 248.5, tip: '仔细阅读每题 2%，先做；选词填空每题 0.5%，最后做。冲 500 要做对 23/30 ≈ 185 分，仔细阅读 9 个。' },
    { k: 'write', n: '写作', w: 15, pts: 106.5, tip: '三段式 + 零低级错误 + 3 个加分句式，进 12 分档 ≈ 80 分。' },
    { k: 'trans', n: '翻译', w: 15, pts: 106.5, tip: '意思译全、句子完整、长句拆短，11 分档 ≈ 75 分。' },
  ];
  let splitSel = '';
  const splitInfo = (sp) => `<b>${sp.n} · ${sp.pts} 分</b><span>${sp.tip}</span>`;
  const chDone = (c) => c.points.filter((p, i) => S.mastered[ptKey(c, i)]).length;
  // 首页：hero 显示预测分（assets/learn.js predict）、今日计划（planToday，按考试日期分阶段 + 提分排行生成，完成按真实数据判定）、上周周报、提分排行
  function renderHome() {
    const st = stats(), L = window.CET6Learn;
    const hi = L.heroInfo(), pr = hi.pr, sk = hi.streak;
    const pl = L.planToday(), nextI = pl.tasks.findIndex((t) => !t.done);
    const dMin = window.CET6Exam && window.CET6Exam.diagMinutes ? window.CET6Exam.diagMinutes() : 60;
    const exams = Array.isArray(S.exams) ? S.exams : [];
    const lastEx = exams.length ? exams[exams.length - 1] : null;
    const sp = SPLIT.find((s) => s.k === splitSel);
    const stat = (cls, v, l, unit) => `<div class="hs-cell ${cls}"><div class="v">${v}${unit ? `<small>${unit}</small>` : ''}</div><div class="l">${l}</div></div>`;
    const meta = [hi.days >= 0 ? `距考试 <b>${hi.days}</b> 天` : '', sk.n ? `连续学习 <b>${sk.n}</b> 天${sk.todayOn ? '' : '（今天还没学）'}` : ''].filter(Boolean).join(' · ');
    const heroTx = pr.ready
      ? `<h1 class="hm-pred">预测 <b>${pr.total}</b><small> / 710</small></h1><p>${pr.gap500 ? `离 500 还差 <b>${pr.gap500}</b> 分` : '预测已过 500，保持住'}${meta ? ' · ' + meta : ''}</p>`
      : `<h1>目标 <b>500</b>，先测一下现在几分</h1><p>做一次约 ${dMin} 分钟的诊断（讲座、长对话、仔细阅读、段落匹配、翻译各一篇），测完给出预测分、提分重点和每日计划。${meta ? '<br>' + meta : ''}</p>`;
    const acts = pr.ready
      ? `${nextI >= 0 ? `<button class="btn w" data-lgo="${nextI}">${ic('i-flame')}继续今天的计划</button>` : `<button class="btn w" data-go="practice">${ic('i-ear')}今天完成了，加练一篇</button>`}<button class="btn" data-go="exam">${ic('i-clip')}在线模考</button>`
      : `<button class="btn w" data-diag>${ic('i-target')}做一次诊断（约 ${dMin} 分钟）</button><button class="btn" data-go="exam">${ic('i-clip')}在线模考</button>`;
    // 有暂停 / 进行中的模考：首页顶部提示一条，点了直接回到考试
    const exOn = S.exam && S.exam.seed ? `<button class="hm-exam-on card m-exam" data-go-exam>${ic('i-clip')}<span><b>${S.exam.diag ? '诊断' : '模考'}还没做完</b>${S.exam.paused ? '已暂停，' : ''}点这里接着做（剩余时间已保存）</span>${ic('i-chev-r')}</button>` : '';
    $('#home-box').innerHTML = `${exOn}
      <section class="hm-hero">
        <div class="hm-hero-tx">${heroTx}</div>
        <div class="hm-hero-acts">${acts}</div>
        <div class="hm-quick"><span>快捷入口</span><button data-go="vocab">${ic('i-abc')}背单词</button><button data-go="outline">${ic('i-target')}看考点</button>${pr.ready ? `<button data-diag>${ic('i-redo')}重做诊断</button>` : `<a href="paper.html">${ic('i-pen')}打印模拟卷</a>`}</div>
      </section>
      ${L.weekHTML()}
      ${L.planHTML()}

      <div class="sec-h hm-h"><span class="ico m-read">${ic('i-target')}</span><h2>我的进度</h2></div>
      ${L.rankHTML(pr)}
      <div class="hm-stats">
        ${stat('m-vocab', st.known, '认识的词', '/' + ALLWORDS.length)}
        ${stat('m-read', st.setsDone, '做过的练习')}
        ${stat('m-listen', st.acc === null ? '—' : st.acc, '正确率', st.acc === null ? '' : '%')}
        ${stat('m-write', `<span id="stM">${st.m}</span>`, '考点掌握', '/' + totalPts)}
        ${(() => { const mm = lastEx && window.CET6Exam && window.CET6Exam.meta ? window.CET6Exam.meta(lastEx) : null; const v = mm && mm.v != null ? mm.v : lastEx ? lastEx.total : null; const cu = lastEx && lastEx.mode === 'custom'; return stat('m-exam', v != null ? Math.round(v) : '—', cu ? '模考（折算）' : '最近模考', lastEx ? '/710' : ''); })()}
      </div>
      <div class="hm-split">
        <div class="hm-split-h"><b>710 分怎么拆</b><small>点一段看策略</small></div>
        <div class="split-bar">${SPLIT.map((s) => `<button class="${MOD[s.k]}" style="--w:${s.w}" data-split="${s.k}" aria-pressed="${s.k === splitSel}">${s.n}<span class="pct"> ${s.w}%</span></button>`).join('')}</div>
        <div class="hm-split-info ${sp ? MOD[sp.k] : ''}"${sp ? '' : ' hidden'}>${sp ? splitInfo(sp) : ''}</div>
      </div>

      <div class="sec-h hm-h"><span class="ico">${ic('i-book')}</span><h2>考点与策略</h2><span class="more" id="ptCount">${st.m}/${totalPts} 已掌握</span></div>
      <div class="hm-mods">${CHAPTERS.map((c) => `<button class="hm-mod ${MOD[c.id]}" data-go="outline" data-ch="${c.id}"><span class="ico">${c.icon}</span><b>${esc(c.name)}</b><span class="d">${esc(c.intro)}</span><span class="pg"><span class="bar"><i data-chbar="${c.id}" style="width:${chDone(c) / c.points.length * 100}%"></i></span><span class="tx" data-chct="${c.id}">${chDone(c)}/${c.points.length}</span></span></button>`).join('')}</div>
      ${typeof PAST !== 'undefined' && PAST.length ? `<div class="sec-h hm-h"><span class="ico m-exam">${ic('i-timer')}</span><h2>近十年真题回顾</h2><span class="more">${PAST.length} 套 · ${PAST[PAST.length - 1].y}–${PAST[0].y}</span></div>
      <div class="hm-past"><p>作文题、翻译主题和阅读 / 听力话题索引，看规律、对着练。</p><button class="btn primary" data-go="past">${ic('i-timer')}打开真题索引</button></div>` : ''}
      <div id="outline-anchor"></div>
      <div id="outline-box" hidden></div>
      <div id="past-box" hidden></div>`;
    $('#home-box').onchange = (e) => { L.homeChange(e); };
    $('#home-box').onclick = (e) => {
      if (e.target.closest('[data-go-exam]')) { const ex = S.exam; if (ex) { delete ex.paused; save(); } show('exam'); if (window.CET6Exam && window.CET6Exam.resume) window.CET6Exam.resume(); return; }
      if (e.target.closest('#outline-box,#past-box') ) { /* 考点 / 真题索引有自己的处理 */ } else if (L.homeClick(e)) return;
      // 分值条：只换说明，不重绘整页（手机上折叠面板保持展开）
      // 再点同一段收起说明
      const sb = e.target.closest('[data-split]'); if (sb) { splitSel = splitSel === sb.dataset.split ? '' : sb.dataset.split; const s2 = SPLIT.find((s) => s.k === splitSel); document.querySelectorAll('[data-split]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.split === splitSel)); const info = $('.hm-split-info'); info.hidden = !s2; info.className = 'hm-split-info ' + (s2 ? MOD[s2.k] : ''); info.innerHTML = s2 ? splitInfo(s2) : ''; return; }
      const g = e.target.closest('[data-go]'); if (!g) return;
      if (g.dataset.plan === 'vocab') { if (S.vgame) S.vgame.on = false; if (S.vsrc !== 'daily') { S.vsrc = 'daily'; vq = []; } save(); }
      if (g.dataset.go === 'outline') return openOutline(g.dataset.ch);
      if (g.dataset.go === 'past') { $('#outline-box').hidden = true; renderPast(); $('#past-box').hidden = false; $('#past-box').scrollIntoView({ behavior: 'smooth' }); return; }
      if (g.dataset.go === 'practice' && g.dataset.sub) { show('practice', true); renderPracticeHome(g.dataset.sub); return; }
      show(g.dataset.go);
    };
  }

  /* ---------- 考点（挂在首页下方） ---------- */
  let chSel = 'exam';
  function openOutline(ch) {
    if (ch) chSel = ch;
    const box = $('#outline-box'); box.hidden = false; $('#past-box').hidden = true; renderOutline();
    $('#outline-anchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const MASTER_TAG = `<span class="tag mst" style="--cs:var(--ok-soft);--c:var(--ok)">${ic('i-check')}已掌握</span>`;
  function renderOutline() {
    const c = CHMAP[chSel];
    $('#outline-box').innerHTML = `
      <div class="sec-h" style="margin-top:28px"><span class="ico ${MOD[c.id]}">${c.icon}</span><h2>${esc(c.name)}</h2><span class="more" id="chCount">${chDone(c)}/${c.points.length} 已掌握</span></div>
      <div class="ch-nav">${CHAPTERS.map((x) => `<button class="chip ${MOD[x.id]}" data-ch="${x.id}" aria-pressed="${x.id === chSel}"><span class="dot"></span>${esc(x.name)}</button>`).join('')}</div>
      <p class="lead">${esc(c.intro)}</p>
      <div class="pt-grid">${c.points.map((p, i) => { const k = ptKey(c, i), m = !!S.mastered[k]; return `
        <details class="pt ${MOD[c.id]}" data-k="${k}">
          <summary><div class="pt-title">${esc(p.t)} ${p.hot === 2 ? '<span class="tag hot">必考</span>' : p.hot === 1 ? '<span class="tag warm">常考</span>' : ''}${m ? MASTER_TAG : ''}</div><span class="caret">${ic('i-chev-r')}</span><div class="pt-tip">${esc(p.tip)}</div></summary>
          <div class="pt-body"><div class="tbl-scroll">${p.body}</div><div class="pt-foot"><label class="master"><input type="checkbox" data-master="${k}" ${m ? 'checked' : ''}> ${c.id === 'exam' ? '这条我记住了' : '记住了 → 练一题'}</label></div></div>
        </details>`; }).join('')}</div>
      ${c.id === 'exam' ? `<div class="sec-h"><span class="ico m-exam">${ic('i-target')}</span><h2>关键数字</h2></div>${NUMBERS.map((g) => `<p class="lead" style="margin:8px 0 8px;font-weight:700;color:var(--ink)">${esc(g.g)}</p><div class="num-grid">${g.rows.map(([l, v]) => `<div class="num m-exam"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>`).join('')}` : ''}`;
    $('#outline-box').onclick = (e) => {
      const tr = e.target.closest('[data-otry]'); if (tr) { if (window.CET6Review) window.CET6Review.outlineGo(tr.dataset.otry); return; }
      const b = e.target.closest('[data-ch]'); if (b) { chSel = b.dataset.ch; renderOutline(); }
    };
    // 勾「这条我记住了」：只局部更新标签和进度数字，不重绘、不收起其他卡片、不跳滚动
    $('#outline-box').onchange = (e) => {
      const k = e.target.dataset.master; if (!k) return;
      if (e.target.checked) S.mastered[k] = lday(); else delete S.mastered[k]; save();
      const tt = e.target.closest('details.pt').querySelector('.pt-title'), tg = tt.querySelector('.tag.mst');
      if (e.target.checked && !tg) tt.insertAdjacentHTML('beforeend', MASTER_TAG); else if (!e.target.checked && tg) tg.remove();
      // 勾上后给一道相关练习的入口（assets/review.js outlineTry；考试结构类考点没有对应练习，只记勾选）
      const foot = e.target.closest('.pt-foot'), old = foot.querySelector('.ot-try'); if (old) old.remove();
      if (e.target.checked && window.CET6Review) { const [cid, pi] = k.split(':'); foot.insertAdjacentHTML('beforeend', window.CET6Review.outlineTry(cid, +pi)); }
      const cc = $('#chCount'); if (cc) cc.textContent = `${chDone(c)}/${c.points.length} 已掌握`;
      const pc = $('#ptCount'); if (pc) pc.textContent = `${stats().m}/${totalPts} 已掌握`;
      const bar = document.querySelector(`[data-chbar="${c.id}"]`); if (bar) bar.style.width = chDone(c) / c.points.length * 100 + '%';
      const ct = document.querySelector(`[data-chct="${c.id}"]`); if (ct) ct.textContent = `${chDone(c)}/${c.points.length}`;
      const sm = $('#stM'); if (sm) sm.textContent = stats().m;
    };
  }

  /* ---------- 近十年真题索引 ---------- */
  let pastYear = 'all';
  const pastKey = (p) => `${p.y}-${p.m}-${p.set}`;
  function renderPast() {
    const list = PAST.slice().sort((a, b) => (b.y - a.y) || (b.m - a.m) || (a.set - b.set));
    const years = [...new Set(list.map((p) => p.y))].sort((a, b) => b - a);
    const count = (arr) => { const m = {}; arr.forEach((k) => { if (k) m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
    const wt = count(list.map((p) => p.writing && p.writing.type)), tt = count(list.map((p) => p.translation && p.translation.theme));
    const bars = (rows, cls) => `<div class="q-list" style="gap:6px">${rows.map(([k, n]) => `<div class="${cls} dist-row"><b>${esc(k)}</b><div class="bar" style="height:10px"><i style="width:${n / list.length * 100}%"></i></div><span class="tabular">${n} 套</span></div>`).join('')}</div>`;
    const rows = list.filter((p) => pastYear === 'all' || p.y === pastYear);
    $('#past-box').innerHTML = `
      <div class="sec-h" style="margin-top:28px"><span class="ico m-exam">${ic('i-timer')}</span><h2>近十年真题索引</h2><span class="more">${list.length} 套</span></div>
      <div class="pt-grid" style="margin-bottom:16px">
        <div class="card m-write"><h3 style="font-size:15px;margin-bottom:10px">作文题型分布</h3>${bars(wt, 'm-write')}</div>
        <div class="card m-trans"><h3 style="font-size:15px;margin-bottom:10px">翻译主题分布</h3>${bars(tt, 'm-trans')}</div>
      </div>
      <div class="ch-nav"><button class="chip m-exam" data-py="all" aria-pressed="${pastYear === 'all'}">全部</button>${years.map((y) => `<button class="chip m-exam" data-py="${y}" aria-pressed="${pastYear === y}">${y}</button>`).join('')}</div>
      <div class="q-list">${rows.map((p) => `<details class="pt m-exam" style="border-left-color:var(--exam)"><summary><div class="pt-title"><span class="tag">${p.y}.${String(p.m).padStart(2, '0')} 第 ${p.set} 套</span>${p.writing ? esc(p.writing.zh) : ''}${p.sure === false ? '<span class="tag warm">待核</span>' : ''}</div><span class="caret">${ic('i-chev-r')}</span><div class="pt-tip no-mark" style="background:var(--paper-2)">翻译：${p.translation ? esc(p.translation.zh) + '（' + esc(p.translation.theme) + '）' : '—'}</div></summary>
        <div class="pt-body"><ul>
          ${p.writing ? `<li><b>作文</b>（${esc(p.writing.type)}）${esc(p.writing.zh)}${p.writing.en ? ` · <i style="font-family:var(--serif)">${esc(p.writing.en)}</i>` : ''}</li>` : ''}
          ${p.reading && (p.reading.cloze || p.reading.match || (p.reading.mc && p.reading.mc.length)) ? `<li><b>阅读</b> 选词填空：${esc(p.reading.cloze || '—')}；段落匹配：${esc(p.reading.match || '—')}；仔细阅读：${(p.reading.mc || []).filter(Boolean).map(esc).join(' / ') || '—'}</li>` : ''}
          ${p.listening && p.listening.length ? `<li><b>听力</b> ${p.listening.filter(Boolean).map(esc).join(' / ')}</li>` : ''}
          <li class="btn-row"><button class="btn soft m-write" data-pgo="write" data-pk="${pastKey(p)}" style="margin:4px 6px 0 0">${ic('i-pen')}练写作</button><button class="btn soft m-trans" data-pgo="trans" data-pk="${pastKey(p)}" style="margin-top:4px">${ic('i-swap')}练翻译</button></li>
          ${p.src && p.src.length ? `<li class="note" style="font-size:12.5px;color:var(--ink-mute)">来源：${p.src.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\//, '').split('/')[0])}</a>`).join('、')}</li>` : ''}
        </ul></div></details>`).join('')}</div>
      <p class="lead" style="margin-top:14px">原卷去哪儿做：学校图书馆和各大书店的正版真题集（外研社、新东方等），或各省教育考试院认可的官方练习平台。</p>`;
    $('#past-box').onclick = (e) => {
      const b = e.target.closest('[data-py]'); if (b) { pastYear = b.dataset.py === 'all' ? 'all' : +b.dataset.py; renderPast(); return; }
      // 练写作 / 练翻译：把这套题的作文题和翻译主题交给写译页（S.wtHint），由写译页显示提示并优先选同题型 / 同主题范文
      const g = e.target.closest('[data-pgo]'); if (g) {
        const p = PAST.find((x) => pastKey(x) === g.dataset.pk);
        if (p) { S.wtHint = { sub: g.dataset.pgo, label: `${p.y}.${String(p.m).padStart(2, '0')} 第 ${p.set} 套`, writing: p.writing ? { type: p.writing.type || '', zh: p.writing.zh || '', en: p.writing.en || '' } : null, translation: p.translation ? { theme: p.translation.theme || '', zh: p.translation.zh || '' } : null, at: Date.now() }; save(); }
        show('wt', true); renderWT(g.dataset.pgo);
      }
    };
  }

  /* ================= 单词 ================= */
  let vg = 0, vq = [], vi = 0, flipped = false, vmode = 'flash', vtOpen = false, vagain = false, vhist = [];
  // 今日单词：每天随机抽 N 个新词（默认 20，可选 10/20/30）+ 到期复习词，当天固定、顺序打乱
  const lday = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const dayDiff = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
  const seeded = (str) => { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; };
  const shufBy = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // S.vnewAuto：每日新词「按建议」（随倒计时和未学词数自动算）。新用户（存档里没有 vnew）默认开，老用户保持原来的手动档
  if (typeof S.vnewAuto !== 'boolean') S.vnewAuto = S.vnew === undefined;
  S.vseen = S.vseen || {}; S.vsrc = S.vsrc || 'daily'; S.vnew = S.vnew || 20; S.vstage = S.vstage || {};
  const isWrong = (id) => S.vocab[id] === 0 || S.vocab[id] === 1;
  const wordOf = (id) => ALLWORDS.find((x) => x.id === id);
  // 到期规则：不认识隔 1 天、模糊隔 2 天；认识的按 S.vstage（连续答对 / 认识次数）取 VGAP：第 1 次后 3 天、再 7 / 14 / 30 / 60 天，第 6 次后不再出现
  // 到期日不超过考试日期：考前 3 天内的到期提前到考前第 3 天（CET6Recall.capDue）
  const VGAP = [1, 3, 7, 14, 30, 60];
  // 旧数据（S.vsv 缺省）按旧间隔 7 / 21 天记的阶段：1 → 2（7 天）、2 → 3（14 天）、≥3（已毕业）→ 5（60 天后考前再查一次）；只有 S.vseen 没有阶段的认识词按 1 → 2
  if (S.vsv !== 2) { Object.keys(S.vocab).forEach((id) => { if (S.vocab[id] === 2) { const st = S.vstage[id] || 1; S.vstage[id] = st >= 3 ? 5 : st + 1; } }); S.vsv = 2; save(); }
  const addDay = (d, n) => { const [y, m, dd] = d.split('-').map(Number); return lday(new Date(y, m - 1, dd + n)); };
  function vdueDay(id) {
    const m = S.vocab[id], seen = S.vseen[id]; if (!seen) return null;
    const gap = m === 0 ? 1 : m === 1 ? 2 : m === 2 ? VGAP[S.vstage[id] || 1] : undefined;
    if (!gap) return null;
    const raw = addDay(seen, gap);
    return window.CET6Recall ? window.CET6Recall.capDue(seen, raw) : raw;
  }
  function isDue(id, d) {
    const m = S.vocab[id], seen = S.vseen[id];
    if ((m === 0 || m === 1) && !seen) return true;
    if (m !== 0 && m !== 1 && m !== 2) return false;
    if (m !== 2 && !(seen < d)) return false;
    const due = vdueDay(id); return !!due && due <= d;
  }
  // 建议每天新词数 = (未学基础 + 核心词 + 0.5 × 未学高频词) / max(1, 剩余天数 − 14)，夹在 10–40；留出考前两周只复习不加新词。当天固定（考试日期改了重算）
  const isHi = (w) => /^高频 ·/.test(w.g);
  function vnewSug() {
    const d = lday(), L = window.CET6Learn, ex = L ? L.examDate() : '', key = d + '|' + ex + '|' + S.dailyMin;
    if (S.vsug && S.vsug.key === key) return S.vsug;
    const left = ALLWORDS.filter((w) => S.vocab[w.id] === undefined), hi = left.filter(isHi).length, core = left.length - hi;
    const days = L ? L.daysLeft() : 180, raw = (core + 0.5 * hi) / Math.max(1, days - 14);
    // 考前两周只复习不加新词；上限跟每天可用时间走（每个新词约 0.5 分钟，最多占一半时间）
    const dm = [30, 60, 90].includes(S.dailyMin) ? S.dailyMin : 60, top = Math.min(40, Math.round(dm * 0.5 / 0.5 * 0.6));
    S.vsug = { key, n: days <= 14 ? 0 : Math.max(Math.min(10, top), Math.min(top, Math.round(raw))), core, hi, days }; save();
    return S.vsug;
  }
  const vnewN = () => (S.vnewAuto ? vnewSug().n : S.vnew);
  function dailyPlan(extra) {
    const d = lday();
    if (S.daily && S.daily.d === d && S.daily.n === vnewN() && !extra) return S.daily;
    const rnd = seeded('cet6-' + d + '-' + (extra ? Date.now() : ''));
    const due = ALLWORDS.filter((w) => isDue(w.id, d))
      .sort((a, b) => (S.vseen[a.id] || '').localeCompare(S.vseen[b.id] || '')).slice(0, 30).map((w) => w.id);
    const keep = S.daily && S.daily.d === d ? S.daily : null;
    const taken = new Set(keep ? [...keep.fresh, ...keep.review] : []);
    // 新词先抽「基础 + 核心」，抽完再进「高频」（组名以「高频 ·」开头的是高频档）
    const fresh0 = shufBy(ALLWORDS.filter((w) => S.vocab[w.id] === undefined && !taken.has(w.id)), rnd);
    const pool = [...fresh0.filter((w) => !/^高频 ·/.test(w.g)), ...fresh0.filter((w) => /^高频 ·/.test(w.g))].map((w) => w.id);
    // 当天改小「每日新词」：保留已刷过的，未刷的按新数量裁掉；改大则补新词
    const N = vnewN();
    const kept = keep ? (extra || N >= keep.fresh.length ? keep.fresh : (() => { const seen = keep.fresh.filter((id) => S.vseen[id] === d); return [...seen, ...keep.fresh.filter((id) => S.vseen[id] !== d)].slice(0, Math.max(N, seen.length)); })()) : [];
    const fresh = keep ? [...kept, ...pool.slice(0, extra ? 10 : Math.max(0, N - kept.length))] : pool.slice(0, N);
    const review = keep ? keep.review : due.filter((id) => !fresh.includes(id));
    S.daily = { d, n: N, fresh, review, order: shufBy([...fresh, ...review], rnd) }; save();
    return S.daily;
  }
  function buildQueue() {
    vi = 0; flipped = false; vqz = null;
    if (S.vsrc === 'daily') { const p = dailyPlan(); const d = lday(); vq = p.order.filter((id) => S.vseen[id] !== d).map(wordOf).filter(Boolean); return; }
    // 生词本：全部「不认识 + 模糊」，最近标记的排前面，同一天内随机
    if (S.vsrc === 'wrong') { vq = shuffle(ALLWORDS.filter((w) => isWrong(w.id))).sort((a, b) => (S.vseen[b.id] || '').localeCompare(S.vseen[a.id] || '')); return; }
    const words = VOCAB[vg].words.map((w, wi) => wordOf(vg + ':' + wi));
    const unknown = words.filter((w) => isWrong(w.id));
    const fresh = words.filter((w) => S.vocab[w.id] === undefined);
    vq = vmode === 'review' ? unknown : [...fresh, ...unknown];
  }
  // 标记：0 不认识 / 1 模糊 / 2 认识。「再过一遍」模式只更新认识程度，不改今天的已刷记录（S.vseen / S.vstage）
  function vapply(w, k) {
    const d = lday();
    vhist.push({ id: w.id, v: S.vocab[w.id], s: S.vseen[w.id], st: S.vstage[w.id] }); if (vhist.length > 50) vhist.shift();
    if (!vagain) {
      // 按天计数（周报 / 打卡）：之前见过的算复习，第一次见算新词；同一天第二次标记不重复计
      if (S.vseen[w.id] !== d && window.CET6Learn && window.CET6Learn.logAct) window.CET6Learn.logAct(S.vseen[w.id] ? 'vr' : 'vn');
      if (k === 2) { if (!(S.vocab[w.id] === 2 && S.vseen[w.id] === d)) S.vstage[w.id] = (S.vstage[w.id] || 0) + 1; } else delete S.vstage[w.id];
      S.vseen[w.id] = d;
    }
    S.vocab[w.id] = k; save();
  }
  function vmark(k) {
    const w = vq[vi]; if (!w) return;
    vapply(w, k); vi++; flipped = false; vqz = null; renderVocab();
  }
  /* ---------- 复习词的提取测试：到期复习词先过一道判定题，再看卡片 ----------
     今日单词的复习词（不是第一次见的新词）、生词本里的词：英→中四选一（干扰项复用小游戏的近义排除），
     生词本默认改为看中文拼英文（S.vqk = 'spell' / 'mc'，易混词和长短语仍用四选一）。答对 = 认识（升一级），答错 = 不认识（阶段清零、明天再来）；
     新词第一次见仍用自评三档；「再过一遍」不出判定题 */
  let vqz = null;
  const canSpell = (w) => !/\s\/\s/.test(w.w) && w.w.length <= 24;
  function needQuiz(w) {
    if (!w || vagain) return false;
    if (S.vsrc === 'daily') { const p = dailyPlan(); return p.review.includes(w.id) && S.vseen[w.id] !== lday(); }
    return S.vsrc === 'wrong';
  }
  function makeQuiz(w) {
    const spell = S.vsrc === 'wrong' && (S.vqk || 'spell') === 'spell' && canSpell(w);
    if (spell) return { id: w.id, kind: 'spell', res: null };
    const G = window.CET6Game, ds = G && G.distractors ? G.distractors(w, 3) : shuffle(ALLWORDS.filter((x) => x.id !== w.id && x.c !== w.c)).slice(0, 3);
    const opts = shuffle([w, ...ds]);
    return { id: w.id, kind: 'mc', opts: opts.map((x) => x.c), a: opts.indexOf(w), res: null };
  }
  // 拼写判定：大小写、首尾空格、弯引号不计较；短语开头的 be 可省
  const spellNorm = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().replace(/^be /, '');
  function quizAnswer(ok, pick, input) {
    const w = vq[vi]; if (!w || !vqz || vqz.res) return;
    vqz.res = ok ? 'ok' : 'bad'; vqz.pick = pick; vqz.input = input;
    vapply(w, ok ? 2 : 0); flipped = true; renderVocab();
    const nx = $('[data-vqnext]'); if (nx) nx.focus({ preventScroll: true });
  }
  function quizHTML(w) {
    const q = vqz;
    if (!q.res) {
      const head = q.kind === 'mc'
        ? `<div class="vq-lab">复习判定 · 选出中文意思</div><div class="vq-w">${esc(w.w)}<button class="spk sm" data-say="${esc(w.w)}" aria-label="朗读">${ic('i-vol')}</button></div><span class="pos">${esc(w.p)}</span>`
        : `<div class="vq-lab">复习判定 · 看中文拼英文</div><div class="vq-cn">${esc(w.c)}</div><span class="pos">${esc(w.p)}</span><div class="vq-hint">首字母 <b>${esc(w.w[0])}</b> · ${w.w.replace(/[^A-Za-z]/g, '').length} 个字母${/\s/.test(w.w) ? ` · ${w.w.trim().split(/\s+/).length} 个词` : ''}</div>`;
      const body = q.kind === 'mc'
        ? `<div class="vq-opts">${q.opts.map((c, i) => `<button class="vq-opt" data-vqpick="${i}"><span class="k">${i + 1}</span><span>${esc(c)}</span></button>`).join('')}</div>`
        : `<form class="vq-form" data-vqform><input class="vq-in" name="a" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="拼出这个词" aria-label="拼写"><button class="btn primary" type="submit">${ic('i-check')}提交</button></form>`;
      return `<div class="vq card">${head}${body}<div class="vq-sub"><button class="btn ghost" data-vqskip>不认识，看答案</button>${S.vsrc === 'wrong' && canSpell(w) ? `<button class="btn ghost" data-vqk>${q.kind === 'spell' ? '改成四选一' : '改成拼写'}</button>` : ''}</div></div>`;
    }
    const ok = q.res === 'ok';
    const mine = q.kind === 'mc' ? (q.pick != null && q.pick !== q.a ? `你选：${esc(q.opts[q.pick])}` : '') : q.input ? `你写：${esc(q.input)}` : '';
    return `<div class="vq-res ${ok ? 'ok' : 'bad'}" role="status"><b>${ok ? `${ic('i-check')}答对了，升一级` : `${ic('i-x')}${q.pick == null && !q.input ? '记为不认识' : '答错了，记为不认识'}`}</b><span>${mine}</span><span class="nx">${ok ? `下次 ${esc(vdueDay(w.id) || '')} 再查` : '阶段清零，明天再来'}</span></div>`;
  }
  const quizNext = () => `<div class="vq-next"><button class="btn primary" data-vqnext>${ic('i-chev-r')}下一个</button>${vqz.res === 'ok' ? '<button class="btn ghost" data-vqfuzzy>蒙对的，记模糊</button>' : ''}</div>`;
  // 撤销上一个：恢复那个词标记前的状态，并把它放回当前卡片
  function vundo() {
    const h = vhist.pop(); if (!h) return;
    const put = (o, k, v) => { if (v === undefined) delete o[k]; else o[k] = v; };
    put(S.vocab, h.id, h.v); put(S.vseen, h.id, h.s); put(S.vstage, h.id, h.st); save();
    if (vq[vi] && vq[vi].id === h.id) { /* 判定题答完还没点下一个：留在这张，重新出题 */ }
    else if (vi > 0 && vq[vi - 1] && vq[vi - 1].id === h.id) vi--; else vq.splice(Math.min(vi, vq.length), 0, wordOf(h.id));
    flipped = false; vqz = null; renderVocab();
  }
  // 单词页分段控件：今日单词 / 按主题 / 生词本 / 小游戏（小游戏用 S.vgame.on，不占 S.vsrc；逻辑在 assets/vgame.js）
  const vsegHtml = (src, wrongN, gm) => `<div class="vsrc seg2" role="tablist"><button role="tab" data-vsrc="daily" aria-selected="${!gm && src === 'daily'}">今日单词</button><button role="tab" data-vsrc="topic" aria-selected="${!gm && src === 'topic'}">按主题</button><button role="tab" data-vsrc="wrong" aria-selected="${!gm && src === 'wrong'}">生词本 ${wrongN}</button>${window.CET6Game ? `<button role="tab" data-vgame aria-selected="${gm}">小游戏</button>` : ''}</div>`;
  function renderVgame() {
    const st = stats(), wrongN = ALLWORDS.filter((x) => isWrong(x.id)).length;
    $('#vocab-box').innerHTML = `
      <div class="sec-h" style="margin-top:4px"><span class="ico m-vocab">${ic('i-abc')}</span><h2>六级词汇</h2><span class="more">认识 ${st.known} · 生词 ${st.unknown}</span></div>
      ${vsegHtml(S.vsrc, wrongN, true)}<div id="vgame-box"></div>`;
    $('#vocab-box').onclick = (e) => {
      if (e.target.closest('#vgame-box')) return;
      const vs = e.target.closest('[data-vsrc]'); if (vs) { S.vgame.on = false; S.vsrc = vs.dataset.vsrc; save(); vq = []; vhist = []; renderVocab(); }
    };
    window.CET6Game.render($('#vgame-box'));
  }
  function renderVocab() {
    if (S.vgame && S.vgame.on && window.CET6Game) { renderVgame(); return; }
    const st = stats();
    const grp = VOCAB[vg];
    const gDone = grp.words.filter((w, wi) => S.vocab[vg + ':' + wi] === 2).length;
    const src = S.vsrc, daily = src === 'daily', wrong = src === 'wrong';
    // 生词本一轮刷完停在完成页（不自动重排）；其他模式队列空了就重建
    if (!vq.length || vi >= vq.length) { if (!(wrong && vq.length && vi >= vq.length)) { vagain = false; buildQueue(); } }
    const w = vq[vi];
    // 复习判定题：同一张卡答完前后都保留 vqz（答完 S.vseen 已是今天，不能再用 needQuiz 判断）
    if (!w) vqz = null; else if (!(vqz && vqz.id === w.id)) vqz = needQuiz(w) ? makeQuiz(w) : null;
    const quizing = !!(vqz && !vqz.res); if (quizing) flipped = false;
    const plan = daily ? dailyPlan() : null, dd = lday();
    const pDone = plan ? plan.order.filter((id) => S.vseen[id] === dd).length : 0, pTot = plan ? plan.order.length : 0;
    const againN = plan ? plan.order.filter(isWrong).length : 0;
    const wrongN = ALLWORDS.filter((x) => isWrong(x.id)).length;
    const hint = quizing ? '<span class="fm-hint">先答题再看卡片</span>' : `<span class="fm-hint">${ic('i-flip')}点卡片看释义</span>`;
    const meta = daily
      ? `<span>${w ? `${esc(w.g)} · ${vagain ? '<b class="tag-rev">再过一遍</b>' : plan.review.includes(w.id) ? '<b class="tag-rev">复习</b>' : '新词'}` : ''}</span>${w ? hint : ''}<span>${vq.length ? `剩 ${vq.length - vi}` : ''}</span>`
      : wrong
        ? `<span>${w ? `${esc(w.g)} · <b class="tag-rev">${S.vocab[w.id] === 0 ? '不认识' : '模糊'}</b>` : ''}</span>${w ? hint : ''}<span>${vq.length ? `${Math.min(vi + 1, vq.length)} / ${vq.length}` : ''}</span>`
        : `<span>${esc(grp.g)} · 本组认识 ${gDone}/${grp.words.length}</span>${w ? hint : ''}<span>${vq.length ? `${vi + 1} / ${vq.length}` : ''}<button class="chip" style="margin-left:8px" id="vmode">${vmode === 'review' ? '只刷生词' : '全部'}</button></span>`;
    const empty = daily
      ? `<div class="empty">${ic('i-party')}今天的 ${pTot} 个词都过完了。<div class="empty-acts">${againN ? `<button class="btn soft m-vocab" data-vagain>${ic('i-redo')}把今天不认识的再过一遍（${againN} 个）</button>` : ''}<button class="btn primary" data-vmore>${ic('i-abc')}再来 10 个新词</button></div></div>`
      : wrong
        ? (vq.length ? `<div class="empty">${ic('i-party')}生词本这一轮 ${vq.length} 个过完了，还剩 ${wrongN} 个生词。${wrongN ? `<div class="empty-acts"><button class="btn primary" data-vround>${ic('i-redo')}再过一轮</button></div>` : ''}</div>`
          : `<div class="empty">${ic('i-party')}生词本是空的。刷闪卡时点「不认识」或「模糊」的词会收进来。</div>`)
        : `<div class="empty">${ic('i-party')}这一组都认识了。换一组，或点"只刷生词"复习。</div>`;
    const listRows = daily ? plan.order.map(wordOf).filter(Boolean) : wrong ? (vq.length ? vq : ALLWORDS.filter((x) => isWrong(x.id))) : grp.words.map((x, wi) => wordOf(vg + ':' + wi));
    $('#vocab-box').innerHTML = `
      <div class="sec-h" style="margin-top:4px"><span class="ico m-vocab">${ic('i-abc')}</span><h2>六级词汇</h2><span class="more">认识 ${st.known} · 生词 ${st.unknown}</span></div>
      ${vsegHtml(src, wrongN, false)}
      ${daily ? `<div class="vday card"><div class="vday-top"><div><b>今天 ${plan.fresh.length} 个新词 + ${plan.review.length} 个复习</b><span>新词自评三档；复习词先做一道判定题，答对按 3 / 7 / 14 / 30 / 60 天拉长间隔，答错明天再来；考前 3 天内的到期会提前</span></div><div class="vday-n">${pDone}<small>/${pTot}</small></div></div>
        <div class="bar"><i style="width:${pTot ? Math.round(pDone / pTot * 100) : 0}%"></i></div>
        ${(() => { const sg = vnewSug(); return `<div class="ctl vnew-ctl">每日新词 <button class="chip" data-vnewauto aria-pressed="${!!S.vnewAuto}">按建议 ${sg.n}</button>${[10, 20, 30].map((n) => `<button class="chip" data-vnew="${n}" aria-pressed="${!S.vnewAuto && S.vnew === n}">${n}</button>`).join('')}</div>
        <p class="vnew-sug">建议 <b>${sg.n}</b> 个：还没学的基础 + 核心词 ${sg.core} 个、高频词 ${sg.hi} 个（按半数算），${sg.days > 14 ? `距考试 ${sg.days} 天，留出考前 14 天只复习` : '离考试不到两周，按最少量安排'}，限 10–40 个。${S.vnewAuto ? '' : '现在按手动选的数量。'}</p>`; })()}</div>` : ''}
      ${wrong ? `<div class="vday card"><div class="vday-top"><div><b>生词本 ${wrongN} 个</b><span>点「不认识」「模糊」的词都在这里，最近标记的排在前面；每个词先${(S.vqk || 'spell') === 'spell' ? '看中文拼英文' : '做四选一'}，答对就移出生词本</span></div></div></div>` : ''}
      <div class="vt m-vocab${src !== 'topic' ? ' hide' : ''} ${vtOpen ? 'open' : ''}"><button class="vt-cur" id="vtToggle" aria-expanded="${vtOpen}"><span class="vt-lab">当前主题</span><b>${esc(grp.g)}</b><span class="vt-n">${gDone}/${grp.words.length}</span><span class="vt-sw">${vtOpen ? '收起' : '切换主题'}</span>${ic('i-chev-r')}</button>
        ${(() => { const tile = (g, i) => { const d = g.words.filter((x, wi) => S.vocab[i + ':' + wi] === 2).length; return `<button class="vt-tile" data-vg="${i}" aria-pressed="${i === vg}"><span class="nm">${esc(g.g.replace(/^(核心|高频) · /, ''))}</span><span class="ct">${d}/${g.words.length}</span><span class="bar"><i style="width:${Math.round(d / g.words.length * 100)}%"></i></span></button>`; };
          // 主题按档分区：基础（原 20 组）/ 核心 / 高频
          const tiers = [['基础', (g) => !/^(核心|高频) ·/.test(g.g)], ['核心词', (g) => /^核心 ·/.test(g.g)], ['高频词', (g) => /^高频 ·/.test(g.g)]];
          return tiers.map(([n, f]) => { const ix = VOCAB.map((g, i) => [g, i]).filter(([g]) => f(g)); if (!ix.length) return ''; const tot = ix.reduce((a, [g]) => a + g.words.length, 0), kn = ix.reduce((a, [g, i]) => a + g.words.filter((x, wi) => S.vocab[i + ':' + wi] === 2).length, 0); return `<div class="vt-sec"><div class="vt-sh"><b>${n}</b><span>${ix.length} 组 · 认识 ${kn}/${tot}</span></div><div class="vt-grid">${ix.map(([g, i]) => tile(g, i)).join('')}</div></div>`; }).join(''); })()}</div>
      <div class="v-split">
      <div class="flash-wrap">
        <div class="flash-meta">${meta}</div>
        ${w && quizing ? quizHTML(w) : w ? `${vqz ? quizHTML(w) : ''}
        <div class="flash ${flipped ? 'flipped' : ''}" id="flash"><div class="inner">
          <div class="face front"><button class="spk" data-say="${esc(w.w)}" aria-label="朗读">${ic('i-vol')}</button><div class="w">${esc(w.w)}</div><span class="pos">${esc(w.p)}</span></div>
          <div class="face back"><div class="bk-hd"><span class="bw">${esc(w.w)}</span><span class="pos">${esc(w.p)}</span></div><div class="cn">${esc(w.c)}</div><ol class="exs">${exOf(w).map(([en, zh]) => `<li><button class="spk sm" data-say="${esc(en)}" aria-label="朗读例句">${ic('i-vol')}</button><div class="ex">${hlWord(esc(en), w.w)}</div><div class="zh">${esc(zh)}</div></li>`).join('')}</ol></div>
        </div></div>
        ${vqz ? quizNext() : `<div class="flash-acts"><button class="btn no" data-mark="0">${ic('i-x')}不认识</button><button class="btn so" data-mark="1">模糊</button><button class="btn ok" data-mark="2">${ic('i-check')}认识</button></div>`}`
        : empty}
        <div class="flash-sub"><button class="btn ghost" data-undo ${vhist.length ? '' : 'disabled'}>${ic('i-redo')}撤销上一个</button><span class="kbd-hint">${quizing ? (vqz.kind === 'mc' ? '1–4 选择 · Z 撤销' : '回车 提交 · Z 撤销') : vqz ? '回车 下一个 · Z 撤销' : '空格 翻面 · 1 / 2 / 3 标记 · S 朗读 · Z 撤销'}</span></div>
      </div>
      <div class="v-list"><div class="sec-h"><h2 style="font-size:16px">${daily ? '今日单词表' : wrong ? '生词表' : '本组单词表'}</h2></div>
      <div class="vocab-list">${listRows.map((x) => { const s = S.vocab[x.id]; return `<button class="vw ${s === 0 || s === 1 ? 'unknown' : s === 2 ? 'known' : ''}${daily && S.vseen[x.id] === dd ? ' done' : ''}${w && w.id === x.id ? ' cur' : ''}" data-vw="${x.id}"><span class="hd"><span class="w">${esc(x.w)}</span><span class="pos">${esc(x.p)}</span></span><span class="cn">${esc(x.c)}</span></button>`; }).join('')}</div></div></div>`;
    $('#vocab-box').onclick = (e) => {
      // 点单词表里的词：卡片切到这个词（不在当前队列就插到当前位置），滚回卡片
      const vw = e.target.closest('[data-vw]'); if (vw) { const id = vw.dataset.vw; const k = vq.findIndex((x, i) => i >= vi && x.id === id); if (k === -1) vq.splice(vi, 0, wordOf(id)); else if (k > vi) { const [x] = vq.splice(k, 1); vq.splice(vi, 0, x); } flipped = false; renderVocab(); const fw = $('.flash-wrap'), ft = fw.getBoundingClientRect().top; if (ft < 50 || ft > innerHeight * 0.45) fw.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const vs = e.target.closest('[data-vsrc]'); if (vs) { S.vsrc = vs.dataset.vsrc; save(); vq = []; vhist = []; renderVocab(); return; }
      if (e.target.closest('[data-vgame]')) { S.vgame = Object.assign(S.vgame || {}, { on: true }); save(); renderVocab(); return; }
      const vn = e.target.closest('[data-vnew]'); if (vn) { S.vnew = +vn.dataset.vnew; S.vnewAuto = false; save(); vq = []; renderVocab(); return; }
      if (e.target.closest('[data-vnewauto]')) { S.vnewAuto = true; save(); vq = []; renderVocab(); return; }
      if (e.target.closest('[data-vmore]')) { dailyPlan(true); vq = []; renderVocab(); return; }
      if (e.target.closest('[data-vagain]')) { const ids = dailyPlan().order.filter(isWrong); vq = shuffle(ids.map(wordOf).filter(Boolean)); vi = 0; flipped = false; vagain = true; renderVocab(); return; }
      if (e.target.closest('[data-vround]')) { vq = []; renderVocab(); return; }
      if (e.target.closest('[data-undo]')) { vundo(); return; }
      const g = e.target.closest('[data-vg]'); if (g) { vg = +g.dataset.vg; vq = []; vtOpen = false; renderVocab(); return; }
      if (e.target.closest('#vtToggle')) { vtOpen = !vtOpen; $('.vt').classList.toggle('open', vtOpen); e.target.closest('#vtToggle').setAttribute('aria-expanded', vtOpen); $('.vt-sw').textContent = vtOpen ? '收起' : '切换主题'; return; }
      if (e.target.closest('#vmode')) { vmode = vmode === 'review' ? 'flash' : 'review'; vq = []; renderVocab(); return; }
      const sp = e.target.closest('[data-say]'); if (sp) { e.stopPropagation(); speak(sp.dataset.say, 0.9); return; }
      const mk = e.target.closest('[data-mark]'); if (mk) { vmark(+mk.dataset.mark); return; }
      const qp = e.target.closest('[data-vqpick]'); if (qp && vqz) { const i = +qp.dataset.vqpick; quizAnswer(i === vqz.a, i); return; }
      if (e.target.closest('[data-vqskip]')) { quizAnswer(false, null, ''); return; }
      if (e.target.closest('[data-vqk]')) { S.vqk = (S.vqk || 'spell') === 'spell' ? 'mc' : 'spell'; save(); vqz = null; renderVocab(); return; }
      if (e.target.closest('[data-vqnext]')) { vi++; flipped = false; vqz = null; renderVocab(); return; }
      if (e.target.closest('[data-vqfuzzy]')) { const w0 = vq[vi]; if (w0) { S.vocab[w0.id] = 1; delete S.vstage[w0.id]; save(); } vi++; flipped = false; vqz = null; renderVocab(); return; }
      if (e.target.closest('#flash')) { flipped = !flipped; $('#flash').classList.toggle('flipped', flipped); }
    };
    $('#vocab-box').onsubmit = (e) => {
      const f = e.target.closest('[data-vqform]'); if (!f) return; e.preventDefault();
      const w0 = vq[vi], v = f.elements.a.value; if (!w0 || !v.trim()) return;
      quizAnswer(spellNorm(v) === spellNorm(w0.w), null, v.trim());
    };
    const qi = $('.vq-in'); if (qi && matchMedia('(hover:hover) and (pointer:fine)').matches) qi.focus({ preventScroll: true });
  }
  // 电脑键盘：空格翻面，1/2/3 = 不认识/模糊/认识，S 朗读，Z 撤销（只在单词页、焦点不在输入框时生效）
  document.addEventListener('keydown', (e) => {
    if ($('#view-vocab').hidden || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (S.vgame && S.vgame.on) return; // 小游戏有自己的按键（assets/vgame.js）
    if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const k = e.key.toLowerCase(), fl = $('#flash');
    if (vqz && vq[vi] && vqz.id === vq[vi].id) {   // 判定题：1–4 选择，答完回车 / 空格进下一个
      if (k === 'z') { e.preventDefault(); vundo(); return; }
      if (!vqz.res) { if (vqz.kind === 'mc' && /^[1-4]$/.test(k)) { e.preventDefault(); quizAnswer(+k - 1 === vqz.a, +k - 1); } return; }
      if ((k === 'enter' || k === ' ') && !(e.target.closest && e.target.closest('button'))) { e.preventDefault(); vi++; flipped = false; vqz = null; renderVocab(); }
      if (k === 's') speak(vq[vi].w, 0.9);
      return;
    }
    if (k === ' ') { if (!fl) return; e.preventDefault(); flipped = !flipped; fl.classList.toggle('flipped', flipped); return; }
    if (k === '1' || k === '2' || k === '3') { if (!vq[vi] || !fl) return; e.preventDefault(); vmark(+k - 1); return; }
    if (k === 's') { if (vq[vi] && fl) speak(vq[vi].w, 0.9); return; }
    if (k === 'z') { e.preventDefault(); vundo(); }
  });

  /* ================= 听读练习 ================= */
  let psub = 'listen', cur = null;
  // 未交卷的作答暂存（按 setId）、听力列表分区折叠状态；旧数据没有这两个字段
  S.drafts = S.drafts || {}; S.lcol = S.lcol || {};
  const listY = { listen: 0, read: 0 };
  const ORG_ZH = { NIA: '美国国家老龄化研究所', NIST: '国家标准与技术研究院', NASA: '航天局', NOAA: '海洋与大气管理局', EPA: '环保署', NPS: '国家公园管理局', Census: '人口普查局' };
  const orgLabel = (o) => (o ? o + (ORG_ZH[o] ? ' ' + ORG_ZH[o] : '') : '');
  const isPhone = () => matchMedia('(max-width:719px)').matches;
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const jumpTop = (y) => { try { window.scrollTo({ top: y || 0, behavior: 'instant' }); } catch { window.scrollTo(0, y || 0); } };
  // 列表卡片右下角：做过显示「已做 · 得分」，有暂存显示「未交卷」
  const setTag = (id) => { const s = S.sets[id]; if (S.drafts[id]) return '<span class="score st-draft">未交卷</span>'; return s ? `<span class="score st-done">${ic('i-check')}已做 · ${s.r}/${s.t}</span>` : ''; };
  /* ---------- 真人感音频：预生成的神经网络语音 + 逐句时间轴（assets/data-audio.js） ---------- */
  const HAS_AUDIO = typeof AUDIO !== 'undefined';
  const REALS = typeof REAL !== 'undefined' ? REAL.filter((r) => r.questions && r.questions.length) : [];
  // 常速真人（NASA / NOAA 访谈，带 org 字段、逐段时间已对齐）与慢速 VOA 分开处理
  const realSlow = (r) => !r.org;
  const realRateOf = (m) => m.slow ? (S.realRate || 1.2) : (S.normRate || 1);
  const realSegs = (r) => { if (r.segs) return r.segs;  const ps = r.script.split('\n').filter(Boolean); const n = ps.map((p) => p.split(/\s+/).length); const tot = n.reduce((a, b) => a + b, 0) || 1; let acc = 0; return ps.map((p, i) => { const st = acc / tot * r.dur; acc += n[i]; return [Math.round(st * 10) / 10, Math.round(acc / tot * r.dur * 10) / 10, '', p]; }); };
  const REALMAP = Object.fromEntries(REALS.map((r) => [r.id, { src: r.src, dur: r.dur, q: r.dur, segs: realSegs(r), real: true, slow: realSlow(r) }]));
  const AUD = (id) => (HAS_AUDIO && AUDIO[id]) || REALMAP[id] || null;
  const AU = new Audio(); AU.preload = 'auto';
  let auId = null, auUrl = null, auIdx = -1, auLoop = -1;
  const fmt = (x) => { x = Math.max(0, Math.floor(x || 0)); return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`; };
  const auMeta = () => (auId ? AUD(auId) : null);
  const auEnd = () => { const m = auMeta(); return !m ? 0 : (S.auMode === 'exam' || m.real) ? m.dur : m.q; };
  const segAt = (m, t) => { let idx = -1; m.segs.forEach((sg, i) => { if (t >= sg[0] - 0.05 && t < sg[1] + 0.25) idx = i; }); return idx; };
  async function loadAudio(id) {
    if (auId === id) return; AU.pause(); auId = id; auLoop = -1; auIdx = -1;
    if (auUrl) { URL.revokeObjectURL(auUrl); auUrl = null; }
    const m = AUD(id);
    // 整个文件取下来再播：离线缓存能存住，拖动进度也不受网络影响
    try { const r = await fetch(m.src); if (!r.ok) throw 0; auUrl = URL.createObjectURL(await r.blob()); if (auId === id) AU.src = auUrl; }
    catch { if (auId === id) AU.src = m.src; }
    applyRate(m);
  }
  // 实际语速：倍速爬坡（assets/drills.js rampOf，同一篇第 2 次 1.1×、第 3 次 1.2×）优先，手动点过语速就按手动
  const baseRate = (m) => (m.real ? realRateOf(m) : (S.rate || 1));
  const effRate = (m) => (cur && cur.ramp && !cur.rampManual && cur.set && AUD(cur.set.id) === m ? cur.ramp.r : baseRate(m));
  function applyRate(m) { if (!m) return; const r = effRate(m); AU.defaultPlaybackRate = r; AU.playbackRate = r; }
  const rateSrc = (m) => (window.CET6Drills && cur && !cur.back ? window.CET6Drills.rateSrcHTML(cur.ramp, cur.rampManual, effRate(m)) : '');
  function syncPlayer() {
    const m = auMeta(); if (!m) return;
    const icon = ic(AU.paused ? 'i-play' : 'i-pause');
    const b = $('#auBtn'); if (b) b.innerHTML = icon;
    const mb = $('#miniBtn'); if (mb) mb.innerHTML = icon;
    const end = auEnd(); const tt = Math.min(AU.currentTime, end);
    const bar = $('#auBar'); if (bar) bar.style.width = (tt / end * 100) + '%';
    const mbar = $('#miniBar'); if (mbar) mbar.style.width = (tt / end * 100) + '%';
    const tm = $('#auTime'); if (tm) tm.textContent = `${fmt(tt)} / ${fmt(end)}`;
    const ttl = $('#auTtl'); if (ttl) ttl.textContent = AU.paused ? (tt > 0.5 ? '已暂停' : '点击播放录音') : (AU.currentTime >= m.q ? '题目播报中…' : '正在播放…');
    const idx = segAt(m, AU.currentTime); auIdx = idx;
    const mt = $('#miniTxt'); if (mt) mt.textContent = idx >= 0 ? m.segs[idx][3] : `${fmt(tt)} / ${fmt(end)}`;
    document.querySelectorAll('.seg.on').forEach((e) => { if (+e.dataset.i !== idx) e.classList.remove('on'); });
    document.querySelectorAll('.seg.loop').forEach((e) => { if (+e.dataset.i !== auLoop) e.classList.remove('loop'); });
    if (auLoop >= 0) { const le = document.querySelector(`.seg[data-i="${auLoop}"]`); if (le) le.classList.add('loop'); }
    const cur = idx >= 0 && document.querySelector(`.seg[data-i="${idx}"]`);
    if (cur && !cur.classList.contains('on')) { cur.classList.add('on'); if (!AU.paused && !cur.closest('details:not([open])')) cur.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }
  AU.addEventListener('timeupdate', () => {
    const m = auMeta();
    // 单句循环：播到当前段结尾就跳回段首
    if (m && auLoop >= 0 && m.segs[auLoop] && !AU.paused && AU.currentTime >= m.segs[auLoop][1] + 0.05) AU.currentTime = m.segs[auLoop][0];
    else if (m && !m.real && S.auMode !== 'exam' && AU.currentTime >= m.q - 0.4 && !AU.paused) { AU.pause(); }
    syncPlayer();
  });
  ['play', 'pause', 'ended', 'loadedmetadata'].forEach((ev) => AU.addEventListener(ev, syncPlayer));
  function stopAudio() { AU.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); }
  function auToggle() { if (AU.paused && cur && !cur.done && window.CET6Drills && window.CET6Drills.preGate(cur, AU.currentTime, auToggle)) return; if (AU.paused) { if (AU.currentTime >= auEnd() - 0.6) AU.currentTime = 0; AU.play().catch(() => {}); } else AU.pause(); }
  function auSeek(t) { const m = auMeta(); if (!m) return; AU.currentTime = Math.max(0, Math.min(auEnd() - 0.1, t)); if (auLoop >= 0) { const i = segAt(m, AU.currentTime); if (i >= 0) auLoop = i; } syncPlayer(); }
  // 精听控制：−5s / +5s / 单句循环（真人和录音播放器共用）
  const fineHTML = () => `<div class="ctl au-fine"><button class="chip" data-skip="-5" aria-label="后退 5 秒">−5s</button><button class="chip" data-skip="5" aria-label="前进 5 秒">+5s</button><button class="chip" data-loop aria-pressed="${auLoop >= 0}">${ic('i-redo')}单句循环</button><span class="kbd-tip">键盘：空格 播放/暂停，← → 跳 5 秒</span></div>`;
  const miniHTML = () => `<div class="mini-au" id="miniAu" hidden><button class="play" id="miniBtn" data-au aria-label="播放 / 暂停">${ic(AU.paused ? 'i-play' : 'i-pause')}</button><div class="mtx"><span id="miniTxt">0:00</span><div class="seek" data-seek><i id="miniBar"></i></div></div><button class="chip" data-skip="-5" aria-label="后退 5 秒">−5s</button><button class="chip" data-skip="5" aria-label="前进 5 秒">+5s</button></div>`;
  function playerHTML(set) {
    const m = AUD(set.id);
    if (m && m.real) { const rr = effRate(m); const rates = m.slow ? [1, 1.1, 1.2, 1.3, 1.4] : [0.8, 0.9, 1, 1.1, 1.2]; return `<div class="player au"><button class="play" id="auBtn" data-au>${ic(AU.paused ? 'i-play' : 'i-pause')}</button>
      <div class="ttl"><span id="auTtl">点击播放录音</span><span class="tm" id="auTime">0:00 / ${fmt(m.dur)}</span></div>
      <div class="seek" data-seek><i id="auBar"></i></div>
      ${fineHTML()}
      <div class="ctl">语速 ${rates.map((r) => `<button class="chip" data-rrate="${r}" aria-pressed="${rr === r}">${r}×</button>`).join('')}</div>${rateSrc(m)}
      <div class="note">${m.slow ? '真人朗读，来自美国之音学英语频道（VOA Learning English，公有领域）。原速约每分钟 100 词，比六级慢；默认 1.2 倍接近考试语速，练熟后可调到 1.3–1.4 倍。题目是本站按六级讲座题型自编的。' : `真人原声，截自${esc(set.show || set.org)}（美国政府作品，公有领域），原速约每分钟 ${Math.round(set.words / set.dur * 60)} 词，跟六级真题语速相当，建议 1.0 倍直接听。题目是本站按六级${set.type === 'lecture' ? '讲座' : '长对话'}题型自编的。`}</div></div>`; }
    if (!m) return `<div class="player"><button class="play" data-play>${ic(cur.playing ? 'i-pause' : 'i-play')}</button><div class="ttl">${cur.playing ? '正在朗读…' : '点击播放录音（浏览器朗读）'}</div><div class="ctl">语速 ${[0.9, 1, 1.1, 1.2].map((r) => `<button class="chip" data-rate="${r}" aria-pressed="${(S.rate || 1) === r}">${r}×</button>`).join('')}</div><div class="note">这篇还没有录音，暂用浏览器朗读。</div></div>`;
    return `<div class="player au"><button class="play" id="auBtn" data-au>${ic(AU.paused ? 'i-play' : 'i-pause')}</button>
      <div class="ttl"><span id="auTtl">点击播放录音</span><span class="tm" id="auTime">0:00 / ${fmt(auEnd())}</span></div>
      <div class="seek" data-seek><i id="auBar"></i></div>
      ${fineHTML()}
      <div class="ctl">语速 ${[0.9, 1, 1.1, 1.2].map((r) => `<button class="chip" data-rate="${r}" aria-pressed="${effRate(m) === r}">${r}×</button>`).join('')}</div>${rateSrc(m)}
      <div class="ctl">${[['text', '只听原文'], ['exam', '考试节奏（含题目播报）']].map(([k, l]) => `<button class="chip" data-aumode="${k}" aria-pressed="${(S.auMode || 'text') === k}">${l}</button>`).join('')}</div>
      <div class="note">真题每段只放一遍。考试节奏会在原文后按真题格式播报题目、每题留 12 秒作答。交卷后可以点原文任意一句从那里重听。</div></div>`;
  }
  function transcriptHTML(set) {
    const m = AUD(set.id);
    if (m && m.real) return `<div class="script tr">${m.segs.map((sg, i) => `<p>${sg[2] && (i === 0 || m.segs[i - 1][2] !== sg[2]) ? `<b class="who">${esc(sg[2])}</b>` : ''}<span class="seg" data-i="${i}" data-t="${sg[0]}">${esc(sg[3])}</span></p>`).join('')}</div><p class="lead">${m.slow ? '段落高亮按字数估算，位置是大致的。' : '段落时间按录音逐词对齐，点段落跳到那句重听。'}出处：<a href="${esc(set.url)}" target="_blank" rel="noopener">${m.slow ? 'VOA Learning English' : esc(set.show || set.org)} · ${esc(set.episode || set.title)}</a>（${esc(set.date)}，公有领域）</p>`;
    if (!m) return `<div class="script">${esc(set.script)}</div>`;
    const rows = []; let lastSpk = null;
    m.segs.forEach((sg, i) => {
      if (sg[2] === 'Q') return;
      if (sg[2] && sg[2] !== lastSpk) { rows.push(`</p><p class="turn"><span class="spk ${sg[2] === 'M' ? 'm' : 'w'}">${sg[2] === 'M' ? '男' : '女'}</span>`); lastSpk = sg[2]; }
      rows.push(`<span class="seg" data-i="${i}" data-t="${sg[0]}">${esc(sg[3])}</span> `);
    });
    return `<div class="script tr"><p>${rows.join('')}</p></div>`;
  }

  /* ---------- 听读列表 ---------- */
  const TRANK = { conv: 0, passage: 1, lecture: 2 };
  const LKIND = { conv: '长对话', passage: '听力篇章', lecture: '讲座 / 讲话' };
  const lgroups = () => [
    { k: 'cet', n: '六级题型练习', list: LISTENING, more: '神经网络语音分角色录制', lead: '按真题题型自编，神经网络语音分角色录制，可选考试节奏（原文后播报题目、留作答时间）。' },
    { k: 'slow', n: '慢速真人听力', list: REALS.filter(realSlow), more: 'VOA 真人朗读', lead: '美国之音学英语频道的真人录音（公有领域），语速偏慢，默认 1.2 倍，适合入门热身。' },
    { k: 'norm', n: '常速真人听力', list: REALS.filter((r) => r.org), more: 'NASA / NOAA 访谈', lead: '美国航天局、海洋与大气管理局自制播客里截取的真人对谈，录音棚音质、正常语速（每分钟约 150 词，跟六级真题相当），按六级长对话 / 讲座题型配题。' },
  ].filter((g) => g.list.length);
  // 推荐下一篇：有未交卷的先接着做；否则按 六级题型（对话→篇章→讲座）→ 慢速 → 常速 找第一篇没做过的；全做过就重做得分率最低的
  function recommendListen() {
    const gs = lgroups();
    for (const g of gs) { const s = g.list.find((x) => S.drafts[x.id]); if (s) return { s, g, why: '接着做上次没交卷的这篇' }; }
    const WHY = { cet: '按难度递进：先把六级题型（对话 → 篇章 → 讲座）过一遍', slow: '六级题型都做过了，换真人慢速原声', norm: '进阶：常速真人原声，语速和真题相当' };
    for (const g of gs) { const ord = g.k === 'cet' ? g.list.slice().sort((a, b) => TRANK[a.type] - TRANK[b.type]) : g.list; const s = ord.find((x) => !S.sets[x.id]); if (s) return { s, g, why: WHY[g.k] }; }
    let best = null; gs.forEach((g) => g.list.forEach((s) => { const r = S.sets[s.id]; const v = r ? r.r / r.t : 1; if (!best || v < best.v) best = { s, g, v }; }));
    return best && { ...best, why: '全部做过了，重做得分最低的一篇' };
  }
  function lcard(g, s) {
    const kind = g.k === 'cet' ? LKIND[s.type] : g.k === 'slow' ? '真人朗读 · VOA' : `${s.type === 'lecture' ? '讲座' : '长对话'} · ${esc(orgLabel(s.org))}`;
    const meta = g.k === 'cet' ? `约 ${s.minutes} 分钟 · ${s.questions.length} 题` : `${fmt(s.dur)} · ${s.questions.length} 题`;
    return `<button class="set m-listen" data-open="${s.id}"><span class="kind">${kind}</span><b>${esc(g.k === 'cet' ? s.title.replace(/^[^·]+·\s*/, '') : s.title)}</b><span class="meta">${ic('i-timer')}${meta}${setTag(s.id)}</span></button>`;
  }
  /* ---------- 随机来一篇：只抽没做过的；全做过就从得分率最低的几篇里抽 ---------- */
  const RPICK = {
    listen: [
      { k: 'conv', n: '短 · 长对话', d: '约 4 分钟，两人对话 4 题', pool: () => LISTENING.filter((s) => s.type === 'conv') },
      { k: 'passage', n: '中 · 听力篇章', d: '约 3 分钟短文 3–4 题', pool: () => LISTENING.filter((s) => s.type === 'passage') },
      { k: 'lecture', n: '长 · 讲座', d: '约 4–5 分钟讲座 3–4 题', pool: () => LISTENING.filter((s) => s.type === 'lecture') },
      { k: 'norm', n: '真人常速', d: 'NASA / NOAA 访谈，3–4.5 分钟', pool: () => REALS.filter((r) => r.org) },
      { k: 'slow', n: '真人慢速', d: 'VOA 慢速朗读，热身用', pool: () => REALS.filter(realSlow) },
      { k: 'any', n: '随便来', d: '所有听力里随机', pool: () => [...LISTENING, ...REALS] },
    ],
    read: [
      { k: 'cloze', n: '短篇 · 选词填空', d: '约 250 词，15 选 10', pool: () => READING.cloze },
      { k: 'mc', n: '中篇 · 仔细阅读', d: '约 450 词，5 题', pool: () => READING.mc },
      { k: 'match', n: '长篇 · 段落匹配', d: '约 1300 词，10 题', pool: () => READING.match },
      { k: 'any', n: '随便来', d: '所有阅读里随机', pool: () => [...READING.mc, ...READING.match, ...READING.cloze] },
    ],
  };
  const rate = (id) => { const r = S.sets[id]; return r ? r.r / r.t : 1; };
  function randomFrom(pool, avoid) {
    const fresh = pool.filter((s) => !S.sets[s.id]);
    if (fresh.length) { const c = fresh.filter((s) => s.id !== avoid); const a = c.length ? c : fresh; return { s: a[Math.floor(Math.random() * a.length)], redo: false, left: fresh.length }; }
    const worst = pool.slice().sort((a, b) => rate(a.id) - rate(b.id)).slice(0, Math.max(3, Math.ceil(pool.length / 4))).filter((s) => s.id !== avoid);
    return worst.length ? { s: worst[Math.floor(Math.random() * worst.length)], redo: true, left: 0 } : null;
  }
  function rpickHTML(area) {
    const opts = RPICK[area], k = S.rpick[area] && opts.some((o) => o.k === S.rpick[area]) ? S.rpick[area] : opts[0].k, o = opts.find((x) => x.k === k);
    const pool = o.pool(), done = pool.filter((s) => S.sets[s.id]).length;
    const mod = area === 'listen' ? 'm-listen' : 'm-read';
    return `<div class="rpick card ${mod}"><div class="rp-h">${ic('i-redo')}<b>随机来一篇</b><span>只抽没做过的，做过的自动跳过</span></div>
      <div class="rp-opts">${opts.map((x) => `<button class="chip" data-rpk="${x.k}" aria-pressed="${x.k === k}">${esc(x.n)}</button>`).join('')}</div>
      <div class="rp-foot"><span class="rp-d">${esc(o.d)} · 已做 <b>${done}</b>/${pool.length}${done >= pool.length && pool.length ? '（全做过了，会从得分最低的里抽）' : ''}</span><button class="btn primary" data-rpgo="${area}">${ic('i-redo')}随机来一篇</button></div></div>`;
  }
  function rpickGo(area) {
    const opts = RPICK[area], k = S.rpick[area] || opts[0].k, o = opts.find((x) => x.k === k) || opts[0];
    const r = randomFrom(o.pool(), S.rpick[area + 'Last']); if (!r) return;
    S.rpick[area + 'Last'] = r.s.id; save(); openSet(r.s.id);
  }
  let miniIO = null;
  function renderPracticeHome(sub, keepY) {
    if (cur && !cur.done) stashDraft();
    if (sub) psub = sub; cur = null; stopAudio(); clearInterval(timerId);
    if (miniIO) { miniIO.disconnect(); miniIO = null; }
    const box = $('#practice-box'); box.classList.remove('only-wrong');
    const Rd = READING;
    const rcard = (s, kind, n) => `<button class="set m-read" data-open="${s.id}"><span class="kind">${kind}${s.org ? ` · 真实原文 · ${esc(orgLabel(s.org))}` : ''}</span><b>${esc(s.title.replace(/^[^·]+·\s*/, ''))}</b><span class="meta">${ic('i-timer')}约 ${s.minutes} 分钟 · ${n}${setTag(s.id)}</span></button>`;
    const rsec = (n, more) => `<div class="sec-h"><span class="ico m-read">${ic('i-book')}</span><h2>${n}</h2><span class="more">${more}</span></div>`;
    let listen = '';
    if (psub === 'listen') {
      const rec = recommendListen();
      listen = `${rec ? `<button class="rec-card m-listen" data-open="${rec.s.id}"><span class="rec-lab">${ic('i-target')}推荐下一篇</span><b>${esc(rec.s.title)}</b><span class="rec-why">${esc(rec.why)}</span><span class="rec-go">${S.drafts[rec.s.id] ? '继续' : '开始'}${ic('i-chev-r')}</span></button>` : ''}
        ${lgroups().map((g) => { const dn = g.list.filter((s) => S.sets[s.id]).length; return `<details class="lsec m-listen" data-sec="${g.k}"${S.lcol[g.k] ? '' : ' open'}><summary class="sec-h"><span class="ico m-listen">${ic('i-ear')}</span><h2>${g.n}</h2><span class="more"><span class="m-src">${g.more} · </span>已做 ${dn}/${g.list.length}</span><span class="caret">${ic('i-chev-r')}</span></summary><p class="lead">${g.lead}</p><div class="set-grid">${g.list.map((s) => lcard(g, s)).join('')}</div></details>`; }).join('')}`;
    }
    box.innerHTML = `
      <div class="wt-tabs"><button class="chip m-listen" data-sub="listen" aria-pressed="${psub === 'listen'}"><span class="dot"></span>听力</button><button class="chip m-read" data-sub="read" aria-pressed="${psub === 'read'}"><span class="dot"></span>阅读</button></div>
      ${window.CET6Drills ? window.CET6Drills.entryHTML() : ''}
      <div class="ex-entry m-exam"><div class="tx"><span class="kind">整卷模拟 · 130 分钟</span><b>完整六级模拟卷</b><span class="meta">写作 + 听力 + 阅读 + 翻译，和真题同结构同题量，按 710 分换算</span></div><div class="acts"><button class="btn tone" data-goexam>${ic('i-clip')}在线模考</button><a class="btn" href="paper.html">${ic('i-pen')}打印版</a></div></div>
      ${psub === 'listen' ? `
        <p class="lead">全部配录音：六级题型练习用神经网络语音分角色录制，另有 NASA / NOAA / VOA 的真人原声。答完再对着原文精听。</p>
        ${rpickHTML('listen')}
        ${listen}`
      : `
        <p class="lead">仔细阅读分最高先做；段落匹配找定位词；选词填空最后兜底。标「真实原文」的是美国政府机构的公有领域文章，只按篇幅删节。</p>
        ${rpickHTML('read')}
        ${window.CET6RT ? window.CET6RT.readHomeHTML() : ''}
        ${rsec('仔细阅读', `每题 2% · ${Rd.mc.length} 篇`)}<div class="set-grid">${Rd.mc.map((s) => rcard(s, '仔细阅读', '5 题')).join('')}</div>
        ${rsec('长篇阅读（段落匹配）', `每题 1% · ${Rd.match.length} 篇`)}<div class="set-grid">${Rd.match.map((s) => rcard(s, '段落匹配', '10 题')).join('')}</div>
        ${rsec('选词填空', `15 选 10 · 每题 0.5% · ${Rd.cloze.length} 篇`)}<div class="set-grid">${Rd.cloze.map((s) => rcard(s, '选词填空', '10 空')).join('')}</div>`}`;
    box.onclick = (e) => {
      const t = e.target.closest('[data-sub]'); if (t) return renderPracticeHome(t.dataset.sub);
      if (e.target.closest('[data-goexam]')) return show('exam');
      const dr = e.target.closest('[data-drill]'); if (dr) return openDrill(dr.dataset.drill);
      if (window.CET6RT && window.CET6RT.homeClick(e)) return;
      const rk = e.target.closest('[data-rpk]'); if (rk) { S.rpick[psub] = rk.dataset.rpk; save(); const y = window.scrollY; renderPracticeHome(); window.scrollTo(0, y); return; }
      const rg = e.target.closest('[data-rpgo]'); if (rg) return rpickGo(rg.dataset.rpgo);
      const o = e.target.closest('[data-open]'); if (o) openSet(o.dataset.open);
    };
    jumpTop(keepY ? listY[psub] : 0);
  }
  // 分区折叠状态：toggle 不冒泡，用捕获监听一次
  $('#practice-box').addEventListener('toggle', (e) => { const d = e.target; if (!d.dataset || !d.dataset.sec) return; if (d.open) delete S.lcol[d.dataset.sec]; else S.lcol[d.dataset.sec] = 1; save(); }, true);
  function findSet(id) {
    const l = LISTENING.find((s) => s.id === id) || REALS.find((s) => s.id === id); if (l) return { kind: 'listen', set: l };
    for (const k of ['mc', 'match', 'cloze']) { const s = READING[k].find((x) => x.id === id); if (s) return { kind: k, set: s }; }
  }
  // 同类列表（下一篇用）
  function groupOf(kind, set) { if (kind !== 'listen') return READING[kind]; if (LISTENING.includes(set)) return LISTENING; return set.org ? REALS.filter((r) => r.org) : REALS.filter(realSlow); }
  const nextOf = (c) => { const g = groupOf(c.kind, c.set); const i = g.indexOf(c.set); return g.length > 1 ? g[(i + 1) % g.length] : null; };
  const marksOf = ({ kind, set, ans }) => kind === 'cloze' ? set.answers.map((a, i) => ans[i] === a) : kind === 'match' ? set.items.map((it, i) => ans[i] === it.a) : set.questions.map((q, i) => ans[i] === q.a);

  /* ---------- 计时 ---------- */
  let timerId = null, t0 = 0;
  const elapsed = () => Math.floor((Date.now() - t0) / 1000);
  // 限时模式（assets/readtools.js）：显示倒计时，到 0 自动交卷（cur.to 标记）
  function tickTimer() {
    const el = $('#timer'); if (!el || !cur) return; const s = cur.done && cur.sec !== undefined ? cur.sec : elapsed(); const v = $('#timerVal');
    const lim = window.CET6RT ? window.CET6RT.limitOf(cur) : 0;
    if (lim) { const left = Math.max(0, lim - s); if (v) v.textContent = mmss(left); el.classList.toggle('warn', left <= 60); if (!left && !cur.done) { cur.to = true; submitSet(); } return; }
    if (v) v.textContent = mmss(s); el.classList.toggle('over', !!(cur.set.minutes && s > cur.set.minutes * 60));
  }
  function startTimer(from) { clearInterval(timerId); t0 = Date.now() - (from || 0); timerId = setInterval(tickTimer, 1000); }

  /* ---------- 未交卷暂存 ---------- */
  function stashDraft() {
    if (!cur || cur.done) return; const id = cur.set.id;
    if (Object.keys(cur.ans).length) { S.drafts[id] = { ans: cur.ans, el: Date.now() - t0, at: today() }; if (cur.pos && Object.keys(cur.pos).length) S.drafts[id].pos = cur.pos; } else delete S.drafts[id];
    save();
  }
  // 切到别的底栏 tab / 切后台 / 关页面时也暂存
  document.querySelector('nav.tabs').addEventListener('click', () => { if (cur && !cur.done) { stashDraft(); clearInterval(timerId); cur = null; } }, true);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') stashDraft(); });
  window.addEventListener('pagehide', stashDraft);

  function openSet(id, fresh) {
    const f = findSet(id); if (!f) return;
    if (!cur) listY[psub] = window.scrollY;
    if (fresh) { delete S.drafts[id]; save(); }
    const d = !fresh && S.drafts[id];
    cur = { ...f, ans: d ? { ...d.ans } : {}, done: false, playing: false, restored: !!(d && Object.keys(d.ans || {}).length) };
    if (f.kind === 'cloze') { let a = 0; while (a < f.set.answers.length - 1 && cur.ans[a]) a++; cur.active = a; }
    if (window.CET6RT) window.CET6RT.initCur(cur, d);   // 限时开关、两步作答的词性选择
    const am = f.kind === 'listen' && AUD(id); if (am && window.CET6Drills) cur.ramp = window.CET6Drills.rampOf(id, baseRate(am), !!am.slow);
    startTimer(d ? d.el : 0); renderSet(); jumpTop(0);
  }
  // sub = 题型细分（assets/learn.js subOf），via = 'exam' / 'diag'（模考 / 诊断交卷）；错题的 due / streak / 错因由 CET6Learn.applyResult 维护
  function recordSet(id, r, t, wrongs, rights, sec, via) {
    const L = window.CET6Learn, sub = L ? L.subOf(id) : '';
    S.sets[id] = { r, t, at: today(), d: lday(), sec, sub };
    const f = findSet(id); if (f) { const h = { id, kind: f.kind, sub, title: f.set.title, r, t, sec, d: lday(), ts: Date.now() }; if (via) h.via = via; S.hist.push(h); if (S.hist.length > 600) S.hist = S.hist.slice(-600); }
    if (L) L.applyResult(wrongs, rights); else { rights.forEach((k) => { delete S.wrong[k]; }); wrongs.forEach((w) => { S.wrong[w.key] = w; }); }
    delete S.drafts[id]; save();
  }
  // 模考报告里「看解析 / 定位原文 / 听这句」：在听读页按交卷状态打开这一篇（带模考里的作答），返回键回模考报告
  function reviewSet(id, ans, back) {
    const f = findSet(id); if (!f) return;
    psub = f.kind === 'listen' ? 'listen' : 'read'; show('practice', true);
    cur = { ...f, ans: { ...ans }, done: true, playing: false, back };
    cur.r = marksOf(cur).filter(Boolean).length; t0 = Date.now(); clearInterval(timerId);
    renderSet(); jumpTop(0);
  }

  /* ---------- 解析 ↔ 原文定位 ---------- */
  // 原文拆成单元（段落 / 录音段），逐词归一化（小写、去撇号和标点），用引号里的前 6–8 个词去找，省略号两边分开试
  const TOK = /[A-Za-z0-9]+(?:['’][A-Za-z]+)*/g;
  const normW = (w) => w.toLowerCase().replace(/['’]/g, '');
  function srcUnits(kind, set) {
    if (kind === 'mc') return set.text.split('\n').map((t, i) => ({ t, k: i }));
    if (kind === 'match') return set.paras.map(([l, t]) => ({ t, k: l }));
    if (kind === 'listen') { const m = AUD(set.id); if (!m || !m.segs) return []; return m.segs.map((sg, i) => ({ t: sg[3], k: i, q: sg[2] === 'Q' })).filter((u) => !u.q); }
    return [];
  }
  function tokIndex(units) { const toks = []; units.forEach((u, ui) => { const re = new RegExp(TOK.source, 'g'); let mm; while ((mm = re.exec(u.t))) toks.push({ w: normW(mm[0]), ui, s: mm.index, e: mm.index + mm[0].length }); }); return toks; }
  function findQuote(toks, quote) {
    const parts = quote.split(/\.{3}|…/).map((p) => (p.match(TOK) || []).map(normW)).filter((p) => p.length >= 3);
    for (const ws of parts) {
      for (let off = 0; off <= Math.min(3, ws.length - 3); off++) {
        for (const n of [8, 7, 6, 5, 4, 3]) {
          if (off + n > ws.length || (n < 4 && ws.length > 3)) continue;
          for (let i = 0; i + n <= toks.length; i++) {
            let ok = true; for (let j = 0; j < n; j++) if (toks[i + j].w !== ws[off + j]) { ok = false; break; }
            if (!ok) continue;
            let k = n; while (off + k < ws.length && i + k < toks.length && toks[i + k].w === ws[off + k]) k++;
            return { a: toks[i], b: toks[i + k - 1] };
          }
        }
      }
    }
    return null;
  }
  // 把命中范围扩到整句
  function sentRange(t, s, e) { const re = /[.!?]+["”’)]*\s+/g; let a = 0, b = t.length, mm; while ((mm = re.exec(t))) { const end = mm.index + mm[0].length; if (end <= s) a = end; else if (mm.index >= e) { b = mm.index + mm[0].trimEnd().length; break; } } return [a, b]; }
  function expHTML(text, ctx) {
    if (!ctx || !ctx.toks.length) return esc(text);
    let out = '', last = 0, first = -1, mm; const re = /["“]([^"”]{6,})["”]/g;
    while ((mm = re.exec(text))) {
      const hit = findQuote(ctx.toks, mm[1]); if (!hit) continue;
      const u = ctx.units[hit.a.ui];
      const k = cur.locs.push({ k: u.k, s: hit.a.s, e: hit.a.ui === hit.b.ui ? hit.b.e : u.t.length }) - 1; if (first < 0) first = k;
      out += esc(text.slice(last, mm.index)) + `<span class="qref" data-loc="${k}" title="点击定位原文">${esc(mm[0])}</span>`; last = mm.index + mm[0].length;
    }
    out += esc(text.slice(last));
    if (first >= 0) out += ` <button class="loc-btn" data-loc="${first}">${ctx.kind === 'listen' ? ic('i-play') + '听这句' : ic('i-target') + '定位原文'}</button>`;
    return out;
  }
  const paraText = (k) => cur.kind === 'mc' ? cur.set.text.split('\n')[k] : (cur.set.paras.find((x) => x[0] === k) || [])[1] || '';
  const paraInner = (k, hl) => { const t = paraText(k); return (cur.kind === 'match' ? `<span class="pl">${k}</span>` : '') + (hl ? esc(t.slice(0, hl[0])) + '<mark class="loc">' + esc(t.slice(hl[0], hl[1])) + '</mark>' + esc(t.slice(hl[1])) : esc(t)); };
  const openFold = () => { const d = $('#practice-box .src-fold'); if (d) d.open = true; };
  function locate(k) {
    const L = cur.locs[k]; if (!L) return;
    openFold();
    if (cur.kind === 'listen') { const m = AUD(cur.set.id); if (!m) return; if (auLoop >= 0) auLoop = L.k; AU.currentTime = m.segs[L.k][0]; AU.play().catch(() => {}); const el = document.querySelector(`.seg[data-i="${L.k}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    document.querySelectorAll('#practice-box .passage p[data-pk]').forEach((p) => { if (p.querySelector('mark.loc')) p.innerHTML = paraInner(cur.kind === 'mc' ? +p.dataset.pk : p.dataset.pk, null); p.classList.remove('hl-para'); });
    const p = document.querySelector(`#practice-box .passage p[data-pk="${L.k}"]`); if (!p) return;
    p.innerHTML = paraInner(L.k, sentRange(paraText(L.k), L.s, L.e));
    p.querySelector('mark.loc').scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function locatePara(l) {
    openFold();
    document.querySelectorAll('#practice-box .passage p.hl-para').forEach((p) => p.classList.remove('hl-para'));
    const p = document.querySelector(`#practice-box .passage p[data-pk="${l}"]`); if (!p) return;
    p.classList.add('hl-para'); p.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
  // 选词填空：词库里的词（去掉 "B) " 前缀）
  const clozeWord = (set, L) => { const b = set.bank.find((x) => x[0] === L); return b ? b.replace(/^[A-Z]\)\s*/, '') : ''; };
  // 空格所在的整句：本空写成 ____，同句其他空填正确答案
  function clozeCtx(set, i) {
    const para = set.text.split('\n').find((p) => p.includes(`[${i + 1}]`)) || '';
    const sents = para.match(/[^.!?]+(?:[.!?]+["”’)]*|$)\s*/g) || [para];
    const s = (sents.find((x) => x.includes(`[${i + 1}]`)) || para).trim();
    return s.replace(/\[(\d+)\]/g, (m, n) => (+n === i + 1 ? '____' : clozeWord(set, set.answers[+n - 1]))).replace(/\s+([,.;:!?])/g, '$1');
  }

  // 错题下面一排错因（单选，assets/learn.js 统一处理点击）
  const causeRow = (key, kind) => (window.CET6Learn ? window.CET6Learn.causeHTML(key, kind) : '');
  // 解析里引用的原文位置（错题重测定位段落 / 录音片段用）：返回 { units, hits: [单元 k] }
  function qLoc(kind, set, i) {
    const units = srcUnits(kind, set); if (!units.length) return null;
    const toks = tokIndex(units), exp = kind === 'match' ? (set.items[i] && set.items[i].exp) || '' : (set.questions[i] && set.questions[i].exp) || '';
    const re = /["“]([^"”]{6,})["”]/g; const hits = []; let mm;
    while ((mm = re.exec(exp))) { const h = findQuote(toks, mm[1]); if (h) { hits.push(units[h.a.ui].k); if (h.b.ui !== h.a.ui) hits.push(units[h.b.ui].k); } }
    return { units, hits };
  }

  /* ---------- 做题页 ---------- */
  function renderSet() {
    const { kind, set, ans, done } = cur; const mod = kind === 'listen' ? 'm-listen' : 'm-read';
    const box = $('#practice-box');
    const total = kind === 'cloze' ? set.answers.length : kind === 'match' ? set.items.length : set.questions.length;
    const answered = Object.keys(ans).length;
    const RT = window.CET6RT, tlim = RT ? RT.limitOf(cur) : 0;
    const back = `<div class="prac-head"><button class="btn ghost" data-back>${ic('i-chev-l')}返回</button><h2>${esc(set.title)}</h2>${kind === 'listen' || cur.back ? '' : `<span class="timer${tlim ? ' cd' : ''}" id="timer"><small>${tlim ? '剩余' : '已用'}</small><b id="timerVal">00:00</b>${tlim ? `<small>/ 限时 ${tlim / 60} 分钟</small>` : set.minutes ? `<small>/ 建议 ${set.minutes} 分钟</small>` : ''}</span>`}</div>${RT ? RT.toolsHTML(cur) : ''}`;
    const K = ['A', 'B', 'C', 'D'], DR = window.CET6Drills;
    // 交卷后：手机上原文收进 <details>，先看到对错；选词填空的对错就在原文里，不收
    const fold = done && isPhone() && kind !== 'cloze';
    const foldWrap = (inner, label) => fold ? `<details class="src-fold ${mod}"><summary>${ic('i-eye')}<b>${label}</b><span>展开</span>${ic('i-chev-r')}</summary>${inner}</details>` : inner;
    cur.locs = [];
    const units = done ? srcUnits(kind, set) : [];
    const ctx = done ? { kind, units, toks: tokIndex(units) } : null;
    const vd = (ok, p) => `<b class="vd ${ok ? 'ok' : 'bad'}">${ok ? '✓ 答对' : p === undefined ? '✗ 未作答' : '✗ 答错'}</b>`;
    const qcls = (ok) => done ? (ok ? ' is-right' : ' is-wrong') : '';
    const mcq = (qs) => `<div class="q-list">${qs.map((q, i) => { const p = ans[i]; return `<div class="q ${mod}${qcls(p === q.a)}" id="q-${i}"><div class="qt"><span class="n">${i + 1}</span><span>${esc(q.q)}</span></div>${DR && kind === 'listen' ? DR.preQHTML(cur, i) : ''}<div class="opts">${q.opts.map((o, k) => { let cls = 'opt'; if (done) { if (k === q.a) cls += ' right'; else if (k === p) cls += ' wrong'; } else if (k === p) cls += ' picked'; return `<button class="${cls}" data-q="${i}" data-k="${k}" ${done ? 'disabled' : ''}><span class="k">${K[k]}</span><span>${esc(o)}</span></button>`; }).join('')}</div>${done ? `<div class="exp">${vd(p === q.a, p)} · 正确答案 ${K[q.a]}。${expHTML(q.exp, ctx)}${DR && kind === 'listen' ? DR.preExpHTML(cur, i) : ''}${p !== q.a ? causeRow(set.id + ':' + i, kind) : ''}</div>` : ''}</div>`; }).join('')}</div>`;
    let body = '';
    if (kind === 'listen') {
      if (AUD(set.id)) { loadAudio(set.id); applyRate(AUD(set.id)); }
      const trHead = `<div class="sec-h"><span class="ico m-listen">${ic('i-eye')}</span><h2>原文</h2><span class="more">点句子从那里重听</span>${done ? '' : `<button class="btn ghost" data-tr style="margin-left:8px">${ic('i-x')}收起</button>`}</div>`;
      if (done) body = `${playerHTML(set)}<div class="lr-split"><div class="lr-src">${fold ? foldWrap(transcriptHTML(set), '原文（点句子重听）') : trHead + transcriptHTML(set)}</div><div class="lr-qs">${mcq(set.questions)}</div></div>`;
      else body = `${playerHTML(set)}
        ${cur.showTr ? `${trHead}<p class="lead">提示：先盲听做题再看原文，练习效果最好。</p>${transcriptHTML(set)}` : `<div class="tr-toggle"><button class="btn soft m-listen" data-tr>${ic('i-eye')}查看原文</button><span>建议先盲听做题，卡住了再打开</span></div>`}${DR ? DR.preBarHTML(cur) : ''}${mcq(set.questions)}`;
      if (AUD(set.id)) body += miniHTML();
    } else if (kind === 'mc') {
      body = `${foldWrap(`<div class="passage">${set.text.split('\n').map((p, i) => `<p data-pk="${i}">${esc(p)}</p>`).join('')}</div>`, '原文')}${mcq(set.questions)}`;
    } else if (kind === 'match') {
      body = `${foldWrap(`<div class="passage">${set.paras.map(([l, p]) => `<p data-pk="${l}"><span class="pl">${l}</span>${esc(p)}</p>`).join('')}</div>`, '原文')}
        <div class="q-list">${set.items.map((it, i) => { const p = ans[i]; return `<div class="q m-read${qcls(p === it.a)}" id="q-${i}"><div class="qt"><span class="n">${i + 1}</span><span>${esc(it.s)}</span></div><div class="letters">${set.paras.map(([l]) => { let cls = ''; if (done) { if (l === it.a) cls = 'right'; else if (l === p) cls = 'wrong'; } else if (l === p) cls = 'picked'; return `<button class="${cls}" data-q="${i}" data-l="${l}" ${done ? 'disabled' : ''}>${l}</button>`; }).join('')}</div>${done ? `<div class="exp">${vd(p === it.a, p)} · 答案 <b>${it.a}</b> 段${p !== undefined && p !== it.a ? `（你选 ${p}）` : ''}。${it.exp ? expHTML(it.exp, ctx) : ''} <button class="loc-btn" data-para="${it.a}">${ic('i-target')}定位到 ${it.a} 段</button>${p !== it.a ? causeRow(set.id + ':' + i, kind) : ''}</div>` : ''}</div>`; }).join('')}</div>`;
    } else if (kind === 'cloze') {
      const used = new Set(Object.values(ans));
      const W = (L) => esc(clozeWord(set, L));
      const html = esc(set.text).replace(/\[(\d+)\]/g, (m, i) => { i = +i; const p = ans[i - 1], a = set.answers[i - 1]; let cls = 'blank'; if (done) cls += p === a ? ' right' : ' wrong'; else if (cur.active === i - 1) cls += ' active'; else if (p) cls += ' filled';
        const inner = done ? `<span class="bn">${i}</span>${p === a ? W(a) : `<s>${p ? `${p} ${W(p)}` : '空'}</s> → ${a} ${W(a)}`}` : `${i}${p ? ' · ' + p : RT ? RT.blankTag(cur, i - 1) : ''}`;
        return `<button class="${cls}" data-blank="${i - 1}" ${done ? 'disabled' : ''}>${inner}</button>`; });
      // 两步作答（assets/readtools.js）：没判词性时词库区换成词性选择，判了之后同词性的词亮起
      const stepBank = RT ? RT.clozeBankHTML(cur, used) : '';
      body = `${stepBank || `<div class="bank${done ? ' done' : ''}">${set.bank.map((b) => { const L = b[0]; return `<button class="chip ${used.has(L) ? 'used' : ''}" data-bank="${L}" ${done ? 'disabled' : ''}>${esc(b)}</button>`; }).join('')}</div>`}
        ${done ? '' : (RT && RT.clozeLead(cur)) || '<p class="lead">先点空格，再点上面的词；点已填的空可以改。</p>'}
        <div class="passage">${html.split('\n').map((p) => `<p>${p}</p>`).join('')}</div>
        ${done ? `<div class="q-list cloze-exp">${set.exp.map((e, i) => { const ok = ans[i] === set.answers[i]; return `<div class="exp${qcls(ok)}" id="q-${i}x">${vd(ok, ans[i])} · <b>${i + 1}. ${set.answers[i]} ${W(set.answers[i])}</b>${ok || ans[i] === undefined ? '' : `（你填 ${ans[i]} ${W(ans[i])}）`}　${esc(e)}${RT ? RT.clozeExpHTML(cur, i) : ''}${ok ? '' : causeRow(set.id + ':' + i, kind)}</div>`; }).join('')}</div>` : ''}`;
    }
    // 真实原文（美国政府机构公有领域文章）注明出处
    if (set.url && kind !== 'listen') body += `<p class="lead src-note">原文：<a href="${esc(set.url)}" target="_blank" rel="noopener">${esc(set.source || set.org)}</a>（美国政府作品，公有领域；仅按篇幅删节，未改写句子）</p>`;
    let resHtml = '';
    if (done) {
      const r = cur.r, marks = marksOf(cur);
      resHtml = `<div class="result ${mod}"><div class="score">${r}<small> / ${total}</small></div><p>${r === total ? '全对，稳。' : r >= total * 0.7 ? '达标了，看看错的那几题的解析。' : '把错题的定位句和选项改写对照着看一遍。'}</p>
        ${cur.sec !== undefined ? `<p class="res-time">${ic('i-timer')}用时 ${mmss(cur.sec)}${cur.tl ? ` · 限时 ${cur.tl} 分钟` : kind !== 'listen' && set.minutes ? ` · 建议 ${set.minutes} 分钟${cur.sec > set.minutes * 60 ? '，超时了' : ''}` : ''}</p>` : ''}
        ${RT ? RT.resultHTML(cur) : ''}
        <div class="res-nums">${marks.map((ok, i) => `<button class="${ok ? 'ok' : 'bad'}" data-jump="${i}" aria-label="第 ${i + 1} 题${ok ? '答对' : '答错'}">${i + 1}<i>${ok ? '✓' : '✗'}</i></button>`).join('')}</div>
        ${DR && kind === 'listen' ? DR.preSumHTML(cur) : ''}
        ${r < total ? `<label class="ow-sw"><input type="checkbox" data-onlywrong ${cur.onlyWrong ? 'checked' : ''}>只看错题</label>` : ''}</div>`;
    }
    const restore = cur.restored && !done ? `<div class="restore-note">${ic('i-redo')}<span>已恢复上次未交卷的作答（${answered}/${total}）</span><button class="btn ghost" data-redo>清空重做</button></div>` : '';
    const next = done && nextOf(cur);
    const bar = done ? `<div class="submit-bar done-bar"><button class="btn" data-redo>${ic('i-redo')}重做</button>${next ? `<button class="btn primary" data-next="${next.id}">下一篇${ic('i-chev-r')}</button>` : ''}<button class="btn" data-back>回列表</button></div>`
      : `<div class="submit-bar"><button class="btn primary" data-submit ${answered ? '' : 'disabled'}>交卷（${answered}/${total}）</button></div>`;
    box.innerHTML = back + restore + resHtml + body + bar;
    box.classList.toggle('only-wrong', !!(done && cur.onlyWrong));
    box.onclick = (e) => {
      if (RT && RT.click(e, cur)) return;
      if (DR && DR.preClick(e, cur)) return;
      const rpb = e.target.closest('[data-ramp]'); if (rpb) { S.rampOff = rpb.dataset.ramp === 'off'; save(); const m0 = AUD(set.id); cur.ramp = DR.rampOf(set.id, baseRate(m0), !!m0.slow); cur.rampManual = false; applyRate(m0); return renderSet(); }
      if (e.target.closest('[data-back]')) { if (cur.back) { const b = cur.back; cur = null; return b(); } stashDraft(); return renderPracticeHome(null, true); }
      if (e.target.closest('[data-redo]')) return openSet(set.id, true);
      const nx = e.target.closest('[data-next]'); if (nx) return openSet(nx.dataset.next);
      const jp = e.target.closest('[data-jump]'); if (jp) { const i = +jp.dataset.jump; const el = kind === 'cloze' ? box.querySelector(`[data-blank="${i}"]`) : $('#q-' + i); if (el) { if (cur.onlyWrong && el.closest('.is-right')) { cur.onlyWrong = false; box.classList.remove('only-wrong'); const c = $('[data-onlywrong]'); if (c) c.checked = false; } el.scrollIntoView({ block: kind === 'cloze' ? 'center' : 'start', behavior: 'smooth' }); } return; }
      const ow = e.target.closest('[data-onlywrong]'); if (ow) { cur.onlyWrong = ow.checked; box.classList.toggle('only-wrong', cur.onlyWrong); return; }
      const lc = e.target.closest('[data-loc]'); if (lc) return locate(+lc.dataset.loc);
      const lp = e.target.closest('[data-para]'); if (lp) return locatePara(lp.dataset.para);
      if (e.target.closest('[data-au]')) { auToggle(); return; }
      const sk = e.target.closest('[data-seek]'); if (sk) { const r = sk.getBoundingClientRect(); auSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * auEnd()); return; }
      const sp = e.target.closest('[data-skip]'); if (sp) { auSeek(AU.currentTime + +sp.dataset.skip); return; }
      if (e.target.closest('[data-loop]')) { const m = auMeta(); if (!m) return; auLoop = auLoop >= 0 ? -1 : (auIdx >= 0 ? auIdx : Math.max(0, m.segs.findIndex((g) => g[2] !== 'Q'))); document.querySelectorAll('[data-loop]').forEach((b) => b.setAttribute('aria-pressed', auLoop >= 0)); syncPlayer(); return; }
      const rr = e.target.closest('[data-rrate]'); if (rr) { const v = +rr.dataset.rrate; const mm = auMeta(); if (mm && !mm.slow) S.normRate = v; else S.realRate = v; cur.rampManual = true; AU.defaultPlaybackRate = AU.playbackRate = v; save(); updRateSrc(); document.querySelectorAll('[data-rrate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.rrate === v)); return; }
      const am = e.target.closest('[data-aumode]'); if (am) { S.auMode = am.dataset.aumode; save(); document.querySelectorAll('[data-aumode]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.aumode === S.auMode)); syncPlayer(); return; }
      if (e.target.closest('[data-tr]')) { cur.showTr = !cur.showTr; renderSet(); return; }
      const sg = e.target.closest('.seg[data-t]'); if (sg) { if (auLoop >= 0) auLoop = +sg.dataset.i; AU.currentTime = +sg.dataset.t; AU.play().catch(() => {}); return; }
      const pl = e.target.closest('[data-play]'); if (pl) { if (cur.playing) { speechSynthesis.cancel(); cur.playing = false; } else { const u = speak(set.script.replace(/^\s*[MW]:\s*/gm, '')); cur.playing = true; if (u) u.onend = () => { cur.playing = false; const b = $('[data-play]'); if (b) { b.innerHTML = ic('i-play'); $('.player .ttl').textContent = '再听一遍'; } }; } $('[data-play]').innerHTML = ic(cur.playing ? 'i-pause' : 'i-play'); $('.player .ttl').textContent = cur.playing ? '正在朗读…' : '点击播放录音'; return; }
      const rt = e.target.closest('[data-rate]'); if (rt) { S.rate = +rt.dataset.rate; cur.rampManual = true; AU.defaultPlaybackRate = AU.playbackRate = S.rate; save(); updRateSrc(); document.querySelectorAll('[data-rate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.rate === S.rate)); return; }
      if (done) return;
      const o = e.target.closest('.opt[data-q]'); if (o) { ans[+o.dataset.q] = +o.dataset.k; return renderSet(); }
      const l = e.target.closest('.letters button[data-q]'); if (l) { ans[+l.dataset.q] = l.dataset.l; return renderSet(); }
      const bl = e.target.closest('[data-blank]'); if (bl) { cur.active = +bl.dataset.blank; return renderSet(); }
      const bk = e.target.closest('[data-bank]'); if (bk && cur.active !== undefined) { Object.keys(ans).forEach((k) => { if (ans[k] === bk.dataset.bank) delete ans[k]; }); ans[cur.active] = bk.dataset.bank; cur.active = Math.min(cur.active + 1, total - 1); return renderSet(); }
      if (e.target.closest('[data-submit]')) submitSet();
    };
    tickTimer();
    if (done) clearInterval(timerId);
    if (kind === 'listen') { syncPlayer(); watchMini(); }
  }
  const updRateSrc = () => { const el = $('#rateSrc'), m = cur && AUD(cur.set.id); if (el && m) el.outerHTML = rateSrc(m); };
  // 专项训练（assets/drills.js）：在听读页里打开，返回键回列表
  function openDrill(k) {
    if (!window.CET6Drills) return;
    if (cur && !cur.done) stashDraft();
    if (!cur && !$('#view-practice').hidden) listY[psub] = window.scrollY;
    cur = null; stopAudio(); clearInterval(timerId);
    if (miniIO) { miniIO.disconnect(); miniIO = null; }
    $('#practice-box').classList.remove('only-wrong');
    window.CET6Drills.open(k); jumpTop(0);
  }
  // 播放器滚出视口时显示吸顶迷你播放条
  function watchMini() {
    if (miniIO) { miniIO.disconnect(); miniIO = null; }
    const pl = $('#practice-box .player.au'), mini = $('#miniAu'); if (!pl || !mini || !('IntersectionObserver' in window)) return;
    miniIO = new IntersectionObserver(([en]) => { mini.hidden = en.isIntersecting || en.boundingClientRect.top > 0; }, { rootMargin: `-${isPhone() ? 56 : 62}px 0px 0px 0px` });
    miniIO.observe(pl);
  }
  // 电脑键盘：空格播放/暂停（焦点不在输入框、也不在用键盘选中的按钮上），← → 跳 5 秒
  document.addEventListener('keydown', (e) => {
    if (!cur || cur.kind !== 'listen' || $('#view-practice').hidden || !AUD(cur.set.id) || auId !== cur.set.id) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target; if (t && t.closest && t.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    if (e.key === ' ' || e.code === 'Space') { if (t && t.closest && t.closest('button,a,summary') && t.matches(':focus-visible')) return; e.preventDefault(); auToggle(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); auSeek(AU.currentTime + (e.key === 'ArrowLeft' ? -5 : 5)); }
  });
  // 错题记录（练习交卷和模考交卷共用）：返回 { wrongs, rights }
  function wrongsOf(kind, set, ans) {
    const K = ['A', 'B', 'C', 'D']; const marks = marksOf({ kind, set, ans });
    // 来源：set.title 本身已带「选词填空 · 」这类前缀时不再重复
    const pre = kind === 'listen' ? (REALMAP[set.id] ? '真人听力' : '听力') : { mc: '仔细阅读', match: '段落匹配', cloze: '选词填空' }[kind];
    const src = set.title.startsWith(pre) ? set.title : pre + ' · ' + set.title;
    const wrongs = [], rights = [];
    marks.forEach((ok, i) => {
      const key = set.id + ':' + i; if (ok) { rights.push(key); return; }
      const p = ans[i]; let w;
      if (kind === 'cloze') { const a = set.answers[i]; w = { q: `空格 ${i + 1}`, a: `${a} ${clozeWord(set, a)}`, e: set.exp[i] || '', mine: p ? `${p} ${clozeWord(set, p)}` : '未作答', ctx: clozeCtx(set, i) }; }
      else if (kind === 'match') { const it = set.items[i]; const para = set.paras.find((x) => x[0] === it.a); const pt = para ? para[1] : ''; w = { q: it.s, a: it.a + ' 段', e: it.exp || '', mine: p ? p + ' 段' : '未作答', ctx: pt.length > 120 ? pt.slice(0, 120) + '…' : pt }; }
      else { const q = set.questions[i]; w = { q: q.q, a: K[q.a] + ' ' + q.opts[q.a], e: q.exp, mine: p === undefined ? '未作答' : K[p] + ' ' + q.opts[p] }; }
      wrongs.push({ key, src, setId: set.id, kind, at: today(), ...w });
    });
    return { wrongs, rights };
  }
  function submitSet() {
    const { kind, set, ans } = cur;
    const marks = marksOf(cur); const r = marks.filter(Boolean).length; const total = marks.length;
    const { wrongs, rights } = wrongsOf(kind, set, ans);
    cur.done = true; cur.r = r; cur.sec = elapsed(); clearInterval(timerId);
    recordSet(set.id, r, total, wrongs, rights, cur.sec); if (window.CET6RT) window.CET6RT.afterSubmit(cur); renderSet(); jumpTop(0);
  }

  /* ================= 写译 ================= */
  // 先写再对照：作答存在 S.wt[题目 id]（自动保存），范文 / 参考译文默认收起；可选 30 分钟倒计时（只在本次打开期间有效）
  let wsub = 'write', wsel = 0, tsel = 0, reveal = {}, wtClock = null, wtTick = 0, wtSaveT = 0;
  // 选题面板：题多了（写作 81 / 翻译 85）不再整排铺开，按来源（真题 / 本站）和文体 / 主题筛选
  const wtPick = { open: false, src: 'all', kind: 'all' };
  const WKIND = [['议论', /议论|观点/], ['名言', /名言/], ['图表', /图表/], ['应用文', /应用/], ['现象', /现象/], ['问题', /问题/]];
  const wtKindOf = (x, isW) => isW ? ((WKIND.find(([, re]) => re.test(x.title.split('·')[0])) || ['其他'])[0]) : (x.theme || '其他');
  function wtPickHTML(isW) {
    const list = isW ? WRITING : TRANSLATION, ci = isW ? wsel : tsel, curX = list[ci], m = isW ? 'm-write' : 'm-trans';
    const name = (x) => isW ? (x.tag || x.title.split('·')[0].trim()) : x.title;
    const kinds = [...new Set(list.map((x) => wtKindOf(x, isW)))];
    const shown = list.map((x, i) => [x, i]).filter(([x]) => (wtPick.src === 'all' || (wtPick.src === 'past' ? !!x.past : !x.past)) && (wtPick.kind === 'all' || wtKindOf(x, isW) === wtPick.kind));
    const left = list.filter((x) => !wrote(x.id)).length;
    const chip = (attr, v, label, on) => `<button class="chip" ${attr}="${esc(v)}" aria-pressed="${on}">${esc(label)}</button>`;
    return `<div class="wt-pick ${m}${wtPick.open ? ' open' : ''}">
      <div class="wt-pbar"><button class="wt-cur" data-wpick aria-expanded="${wtPick.open}"><span class="lab">当前题目</span><b>${esc(name(curX))}</b>${curX.past ? `<span class="past">真题 ${esc(curX.past)}</span>` : ''}<span class="sw">${wtPick.open ? '收起' : '选题'}</span>${ic('i-chev-r')}</button>
        <button class="btn tone ${m}" data-wrand>${ic('i-redo')}随机一题</button></div>
      <p class="wt-left">${left ? `共 ${list.length} 题，没写过的还有 ${left} 题；随机只从没写过的里抽` : `${list.length} 题都写过了，随机抽一题再练`}</p>
      ${wtPick.open ? `<div class="wt-panel">
        <div class="wt-filt"><span>来源</span>${chip('data-wsrc', 'all', '全部', wtPick.src === 'all')}${chip('data-wsrc', 'past', '近十年真题', wtPick.src === 'past')}${chip('data-wsrc', 'own', '本站练习', wtPick.src === 'own')}</div>
        <div class="wt-filt"><span>${isW ? '文体' : '主题'}</span>${chip('data-wkind', 'all', '全部', wtPick.kind === 'all')}${kinds.map((k) => chip('data-wkind', k, k, wtPick.kind === k)).join('')}</div>
        <div class="wt-list">${shown.map(([x, i]) => `<button class="wt-item${i === ci ? ' on' : ''}" ${isW ? 'data-wsel' : 'data-tsel'}="${i}"><b>${esc(name(x))}</b><span>${x.past ? `真题 ${esc(x.past)}` : '本站练习'} · ${esc(wtKindOf(x, isW))}</span>${wrote(x.id) ? `<i class="ok">${ic('i-check')}</i>` : ''}</button>`).join('') || '<p class="lead">没有符合条件的题目。</p>'}</div>
      </div>` : ''}</div>`;
  }
  S.wt = S.wt || {};
  // 高亮：每篇数据自带 hl（范文原文片段），长的先替换，避免短语嵌套
  function hl(text, phrases) { let h = esc(text); (phrases || []).slice().sort((a, b) => b.length - a.length).forEach((p) => { h = h.split(esc(p)).join(`<mark>${esc(p)}</mark>`); }); return h; }
  const enWords = (t) => (String(t || '').match(/[A-Za-z0-9]+(?:['’\-][A-Za-z0-9]+)*/g) || []).length;
  const wrote = (id) => !!(S.wt[id] && S.wt[id].trim());
  const fmtClock = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  function wtCountHTML(id, isW, ref) {
    const n = enWords(S.wt[id]);
    if (!isW) return `<b>${n}</b> 词<span class="wt-hint">参考译文约 ${ref} 词</span>`;
    const st = !n ? '' : n < 150 ? 'lo' : n > 200 ? 'hi' : 'ok';
    return `<b class="${st}">${n}</b> 词<span class="wt-hint">${st === 'ok' ? '已在 150–200 词区间' : st === 'hi' ? '超过 200 词，删一点' : n ? `还差 ${150 - n} 词到 150` : '要求 150–200 词'}</span>`;
  }
  function syncClock() {
    const el = $('#wtClock'), btn = $('[data-wtclock]'); if (!el || !btn) { clearInterval(wtTick); return; }
    const on = wtClock && wtClock.id === btn.dataset.wtclock;
    if (!on) { el.textContent = ''; btn.innerHTML = `${ic('i-timer')}计时 30 分钟`; return; }
    const left = Math.max(0, Math.round((wtClock.end - Date.now()) / 1000));
    el.textContent = left ? fmtClock(left) : '时间到'; el.classList.toggle('end', !left); el.classList.toggle('warn', left > 0 && left <= 300);
    btn.innerHTML = `${ic('i-x')}停止计时`;
    if (!left) clearInterval(wtTick);
  }
  function answerBox(id, isW, ref) {
    return `<div class="wt-ans ${isW ? 'm-write' : 'm-trans'}">
        <div class="wt-bar"><span class="lab">${isW ? '我的作文' : '我的译文'}</span><span class="wt-clock" id="wtClock"></span><button class="chip" data-wtclock="${id}">${ic('i-timer')}计时 30 分钟</button></div>
        <textarea class="wt-ta" data-wtid="${id}" rows="${isW ? 12 : 9}" spellcheck="false" autocapitalize="sentences" placeholder="${isW ? '先列提纲再动笔，在这里写 150–200 词……' : '先自己译，再对照参考译文……'}">${esc(S.wt[id] || '')}</textarea>
        <div class="wt-count" id="wtCount">${wtCountHTML(id, isW, ref)}</div>
        ${window.CET6Grade ? `<div class="wt-grade"><button class="btn soft" data-wtgrade="${id}">${ic('i-target')}估分</button><span>规则估分：字数、切题、词汇、句式等，可复制给 AI 细评；每次估分都记进预测分</span></div><div class="wt-gres" id="wtGrade"></div>` : ''}
        ${window.CET6Recall ? `<div class="wt-trend" id="wtTrend">${window.CET6Recall.trendHTML(id)}</div>` : ''}
      </div>`;
  }
  // 从首页真题卡点「练写作 / 练翻译」会带 S.wtHint 过来：10 分钟内有效，顶部提示这套真题的题目，并预选最接近的一篇（每个 hint 只预选一次）
  let wtHintDone = 0;
  const wtHintFresh = () => S.wtHint && Date.now() - (S.wtHint.at || 0) < 10 * 60 * 1000 ? S.wtHint : null;
  function wtWriteKind(type) { const t = String(type || ''); return /名言|谚语/.test(t) ? /名言/ : /图|表|漫画/.test(t) ? /图表/ : /应用|信|演讲|通知|倡议/.test(t) ? /应用文/ : /现象/.test(t) ? /现象/ : /问题|解决/.test(t) ? /问题/ : /议论|观点/; }
  function applyWtHint(h) {
    if (wtHintDone === h.at) return; wtHintDone = h.at;
    // 先找同一套真题出的题（past 字段），没有再按文体 / 主题近似匹配
    if (h.writing) { let i = WRITING.findIndex((w) => w.past === h.label); if (i < 0) { const re = wtWriteKind(h.writing.type); i = WRITING.findIndex((w) => re.test(w.title.split('·')[0])); } if (i >= 0) wsel = i; }
    if (h.translation) { const th = String(h.translation.theme || ''), zh = String(h.translation.zh || ''); let i = TRANSLATION.findIndex((t) => t.past === h.label); if (i < 0) i = TRANSLATION.findIndex((t) => zh.includes(t.title)); if (i < 0) i = TRANSLATION.findIndex((t) => t.theme === th); if (i < 0) i = TRANSLATION.findIndex((t) => th && (th.includes(t.theme) || t.theme.includes(th) || th.includes(t.title))); if (i >= 0) tsel = i; }
  }
  function wtHintBar(h) {
    const parts = [h.writing && h.writing.zh ? `<span><b>作文</b> ${esc(h.writing.zh)}</span>` : '', h.translation && h.translation.zh ? `<span><b>翻译</b> ${esc(h.translation.zh)}${h.translation.theme ? `（${esc(h.translation.theme)}）` : ''}</span>` : ''].filter(Boolean);
    return `<div class="wt-hintbar m-exam"><div class="tx"><div class="hd">这套真题${h.label ? `（${esc(h.label)}）` : ''}</div>${parts.join('')}<div class="ft">下面已选好同类型的一篇，照着练。</div></div><button class="x" data-hintx aria-label="关闭提示">${ic('i-x')}</button></div>`;
  }
  // 关键词卡 / 模板句：assets/recall.js（window.CET6Recall），标签上是今日待做（到期 + 新卡额度）
  function wtTabsHTML() {
    const RC = window.CET6Recall, cdN = (k) => { const c = RC.counts(k); return c.left ? `<b class="cd-badge">${c.left}</b>` : ''; };
    return `<div class="wt-tabs"><button class="chip m-write" data-wsub="write" aria-pressed="${wsub === 'write'}"><span class="dot"></span>写作</button><button class="chip m-trans" data-wsub="trans" aria-pressed="${wsub === 'trans'}"><span class="dot"></span>翻译</button>${RC ? `<button class="chip m-trans" data-wsub="tk" aria-pressed="${wsub === 'tk'}">${ic('i-abc')}关键词卡${cdN('tk')}</button><button class="chip m-write" data-wsub="hl" aria-pressed="${wsub === 'hl'}">${ic('i-pen')}模板句${cdN('hl')}</button>` : ''}</div>`;
  }
  // 估分：assets/grade.js 规则估分（同模考报告），结果显示在作答框下；log=false 只显示不记录（从模考报告跳过来时，那次估分已经记过）
  // 下面接 CET6Recall：历次估分「初稿 → 最近」趋势、标出最低一项、给一条改写任务
  function wtGradeNow(id, log) {
    const isW = wsub === 'write', item = isW ? WRITING[wsel] : TRANSLATION[tsel], kind = isW ? 'write' : 'trans', text = S.wt[id] || '';
    const gr = window.CET6Grade.mount($('#wtGrade'), kind, item, text, { aiIcon: ic('i-clip'), getText: () => S.wt[id] || '' });
    if (log && gr && text.trim() && window.CET6Learn) window.CET6Learn.logWt(kind, id, gr, 'wt');
    const R = window.CET6Recall, tr = $('#wtTrend');
    if (R && gr && tr) { R.markLow($('#wtGrade'), gr); delete tr.dataset.stale; tr.innerHTML = text.trim() ? R.trendHTML(id, { gr, kind, item, text }) : R.trendHTML(id); }
    return gr;
  }
  // 从模考报告「去写译页改写这篇」：选中这道题；写译页这题空着就填入模考作答，有别的作答先问；直接显示估分和改写任务
  function openWTItem(kind, id, text) {
    const list = kind === 'write' ? WRITING : TRANSLATION, i = list.findIndex((x) => x.id === id); if (i < 0) return false;
    if (kind === 'write') wsel = i; else tsel = i;
    const t = String(text || '');
    if (t.trim() && (S.wt[id] || '').trim() !== t.trim()) { if (!(S.wt[id] || '').trim() || confirm('写译页这道题已有另一份作答，用模考这篇替换吗？（取消则保留写译页原来的）')) { S.wt[id] = t; save(); } }
    delete S.wtHint; show('wt', true); renderWT(kind);
    if ((S.wt[id] || '').trim() && window.CET6Grade) wtGradeNow(id, false);
    const ta = $('#wt-box .wt-ans'); if (ta) ta.scrollIntoView({ block: 'start' });
    return true;
  }
  function renderWT(sub) {
    if (sub) { wsub = sub; window.scrollTo(0, 0); }
    const hint = wtHintFresh(); if (hint) applyWtHint(hint);
    if (!window.CET6Recall && (wsub === 'tk' || wsub === 'hl')) wsub = 'write';
    const RC = window.CET6Recall, tabs = wtTabsHTML();
    let body = '';
    if (wsub === 'tk' || wsub === 'hl') body = '<div id="cdBox"></div>';
    else if (wsub === 'write') {
      const w = WRITING[wsel]; const shown = !!reveal[w.id];
      body = `${wtPickHTML(true)}<div class="wt-split"><div class="wt-l">
        <div class="prompt m-write"><div class="lab">题目 · ${esc(w.title.split('·')[0].trim())}</div>${esc(w.prompt)}${w.chart && window.writingChart ? window.writingChart(w.chart) : ''}</div>
        <details class="wt-outline m-write"><summary>${ic('i-target')}卡住了？看提纲</summary>
          <div class="steps m-write">${w.outline.map((o, i) => `<div class="st"><span class="n">${i + 1}</span><span>${esc(o)}</span></div>`).join('')}</div></details>
        <div class="reveal"><button class="btn tone m-write" data-reveal="${w.id}" aria-expanded="${shown}">${ic('i-eye')}${shown ? '收起范文' : '对照范文'}</button></div>
        ${shown ? `<div class="sec-h"><span class="ico m-write">${ic('i-eye')}</span><h2 style="font-size:16px">范文</h2><span class="more">高亮 = 可以抄进模板的句式</span></div>
        <div class="sample m-write">${hl(w.sample, w.hl)}</div>
        <div class="notes m-write">${w.notes.map((n) => `<div class="nt">${ic('i-bulb')}<span>${esc(n)}</span></div>`).join('')}</div>` : ''}</div>
        <div class="wt-r">${answerBox(w.id, true)}</div></div>`;
    } else {
      const t = TRANSLATION[tsel]; const shown = !!reveal[t.id];
      body = `${wtPickHTML(false)}
        <div class="wt-split"><div class="wt-l"><div class="prompt m-trans"><div class="lab">汉译英 · ${esc(t.theme)}</div><span class="zh" style="font-family:var(--ui);line-height:1.9">${esc(t.zh)}</span></div>
        <div class="sec-h"><span class="ico m-trans">${ic('i-abc')}</span><h2 style="font-size:16px">关键词</h2></div>
        <div class="keys">${t.keys.map((k) => { const m = k.match(/^(.*?)\s+([A-Za-z(].*)$/); const zh = m ? m[1] : '', en = m ? m[2] : k; return `<span class="chip">${esc(en)}${zh ? `<i>${esc(zh)}</i>` : ''}</span>`; }).join('')}</div>
        <div class="reveal"><button class="btn tone m-trans" data-reveal="${t.id}" aria-expanded="${shown}">${ic('i-eye')}${shown ? '收起参考译文' : '对照参考译文'}</button></div>
        ${shown ? `<div class="sample m-trans">${esc(t.en)}</div><div class="notes m-trans">${t.notes.map((n) => `<div class="nt">${ic('i-bulb')}<span>${esc(n)}</span></div>`).join('')}</div>` : ''}</div>
        <div class="wt-r">${answerBox(t.id, false, enWords(t.en))}</div></div>`;
    }
    $('#wt-box').innerHTML = `<div class="wt-body">${hint && wsub !== 'tk' && wsub !== 'hl' ? wtHintBar(hint) : ''}${tabs + body}</div>`;
    if ($('#cdBox')) RC.mount($('#cdBox'), wsub, () => { const t = $('#wt-box .wt-tabs'); if (t) t.outerHTML = wtTabsHTML(); });
    clearInterval(wtTick); syncClock(); if (wtClock) wtTick = setInterval(syncClock, 1000);
    $('#wt-box').onclick = (e) => {
      const s = e.target.closest('[data-wsub]'); if (s) { wtPick.kind = 'all'; wtPick.src = 'all'; return renderWT(s.dataset.wsub); }
      const a = e.target.closest('[data-wsel]'); if (a) { wsel = +a.dataset.wsel; wtPick.open = false; return renderWT(); }
      const b = e.target.closest('[data-tsel]'); if (b) { tsel = +b.dataset.tsel; wtPick.open = false; return renderWT(); }
      if (e.target.closest('[data-wpick]')) { wtPick.open = !wtPick.open; return renderWT(); }
      const fs = e.target.closest('[data-wsrc]'); if (fs) { wtPick.src = fs.dataset.wsrc; return renderWT(); }
      const fk = e.target.closest('[data-wkind]'); if (fk) { wtPick.kind = fk.dataset.wkind; return renderWT(); }
      if (e.target.closest('[data-hintx]')) { delete S.wtHint; save(); return renderWT(); }
      if (e.target.closest('[data-wrand]')) {
        const isW = wsub === 'write', list = isW ? WRITING : TRANSLATION, curI = isW ? wsel : tsel;
        let idx = list.map((x, i) => i).filter((i) => !wrote(list[i].id) && i !== curI); if (!idx.length) idx = list.map((x, i) => i).filter((i) => i !== curI);
        const i = idx[Math.floor(Math.random() * idx.length)]; if (isW) wsel = i; else tsel = i; return renderWT();
      }
      // 展开范文 / 参考译文才算完成首页的「读 1 篇范文」
      const r = e.target.closest('[data-reveal]'); if (r) { reveal[r.dataset.reveal] = !reveal[r.dataset.reveal]; if (reveal[r.dataset.reveal]) { const d = lday(); S.plan[d] = Object.assign(S.plan[d] || {}, { wt: 1 }); save(); } renderWT(); if (reveal[r.dataset.reveal]) { const sm = $('#wt-box .sample'); if (sm) sm.scrollIntoView({ behavior: 'smooth', block: 'start' }); } return; }
      // 估分：assets/grade.js 规则估分（同模考报告），结果显示在作答框下
      const gb = e.target.closest('[data-wtgrade]'); if (gb && window.CET6Grade) { wtGradeNow(gb.dataset.wtgrade, true); return; }
      const c = e.target.closest('[data-wtclock]'); if (c) { const id = c.dataset.wtclock; wtClock = wtClock && wtClock.id === id ? null : { id, end: Date.now() + 30 * 60 * 1000 }; clearInterval(wtTick); syncClock(); if (wtClock) wtTick = setInterval(syncClock, 1000); }
    };
    $('#wt-box').oninput = (e) => {
      const id = e.target.dataset.wtid; if (!id) return;
      const had = wrote(id); S.wt[id] = e.target.value; if (!S.wt[id]) delete S.wt[id];
      const isW = wsub === 'write'; $('#wtCount').innerHTML = wtCountHTML(id, isW, isW ? 0 : enWords(TRANSLATION[tsel].en));
      if (had !== wrote(id)) { const chip = $(`#wt-box [aria-pressed="true"][data-${isW ? 'wsel' : 'tsel'}]`); if (chip) { const m = chip.querySelector('.wt-done'); if (m) m.remove(); else chip.insertAdjacentHTML('beforeend', `<span class="wt-done" title="写过">${ic('i-check')}</span>`); } }
      const gr = $('#wtGrade'); if (gr && gr.innerHTML) gr.innerHTML = '';   // 改了作答，旧估分作废（S.wtScore 历史保留）
      const tr = $('#wtTrend'); if (tr && tr.innerHTML && !tr.dataset.stale && window.CET6Recall) { tr.dataset.stale = '1'; tr.innerHTML = window.CET6Recall.trendHTML(id, { stale: true }); }
      clearTimeout(wtSaveT); wtSaveT = setTimeout(save, 400);
    };
  }

  /* ---------- 我的真题库：文件只存本机 IndexedDB ---------- */
  const DB = { name: 'cet6-files', store: 'files' };
  function idb() { return new Promise((res, rej) => { const r = indexedDB.open(DB.name, 1); r.onupgradeneeded = () => r.result.createObjectStore(DB.store, { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
  async function fAll() { const d = await idb(); return new Promise((res) => { const q = d.transaction(DB.store).objectStore(DB.store).getAll(); q.onsuccess = () => res(q.result.sort((a, b) => b.at - a.at)); }); }
  async function fPut(rec) { const d = await idb(); return new Promise((res) => { const t = d.transaction(DB.store, 'readwrite'); t.objectStore(DB.store).put(rec); t.oncomplete = res; }); }
  async function fDel(id) { const d = await idb(); return new Promise((res) => { const t = d.transaction(DB.store, 'readwrite'); t.objectStore(DB.store).delete(id); t.oncomplete = res; }); }
  const fmtSize = (n) => n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.round(n / 1e3) + ' KB';
  let viewing = null;
  async function renderFiles() {
    const box = $('#files-box'); if (!box) return;
    if (!('indexedDB' in window)) { box.innerHTML = '<div class="empty">这个浏览器不支持本地文件库。</div>'; return; }
    const files = await fAll();
    const labels = (typeof PAST !== 'undefined' ? PAST : []).map((p) => `${p.y}.${String(p.m).padStart(2, '0')} 第 ${p.set} 套`);
    box.innerHTML = `
      <div class="card m-exam" style="margin-bottom:12px">
        <p class="lead" style="margin:0 0 10px">把自己买的 / 学校发的真题 PDF、扫描图或文本放进来，<b>只存在这台设备的浏览器里</b>，不上传、不同步。支持 PDF / 图片 / TXT / 音频（真题听力 MP3），可多选。</p>
        <label class="btn primary" style="cursor:pointer">${ic('i-pen')}选择文件<input type="file" id="fileIn" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.mp3,.m4a,.wav,.aac,application/pdf,image/*,text/plain,audio/*" hidden></label>
        <datalist id="paperLabels">${labels.map((l) => `<option value="${esc(l)}">`).join('')}</datalist>
      </div>
      ${viewing ? `<div class="card" style="padding:10px;margin-bottom:12px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><b style="flex:1">${esc(viewing.name)}</b><button class="btn ghost" data-fclose>${ic('i-x')}关闭</button></div>${viewing.type.startsWith('audio/') ? `<audio controls src="${viewing.url}" style="width:100%"></audio>` : viewing.type.startsWith('image/') ? `<img src="${viewing.url}" style="width:100%;border-radius:10px">` : viewing.type === 'text/plain' ? `<pre class="script" style="white-space:pre-wrap">${esc(viewing.text || '')}</pre>` : `<iframe src="${viewing.url}" style="width:100%;height:75vh;border:0;border-radius:10px"></iframe><p class="lead" style="margin:8px 0 0">手机上 PDF 显示不全的话，点"新窗口打开"。<a href="${viewing.url}" target="_blank" rel="noopener">新窗口打开</a></p>`}</div>` : ''}
      ${files.length ? `<div class="q-list">${files.map((f) => `<div class="q m-exam" style="display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:center">
          <div><b>${esc(f.name)}</b><div style="font-size:12.5px;color:var(--ink-dim)">${f.type.split('/')[1] || f.type} · ${fmtSize(f.size)} · ${new Date(f.at).toLocaleDateString()}</div></div>
          <div style="display:flex;gap:6px"><button class="btn soft" data-fopen="${f.id}">${ic('i-eye')}打开</button><button class="btn ghost" data-fdel="${f.id}">${ic('i-trash')}</button></div>
          <input class="search" list="paperLabels" placeholder="挂到哪一套？如 2024.12 第 1 套" value="${esc(f.label || '')}" data-flabel="${f.id}" style="grid-column:1/3;padding:8px 12px;font-size:13px;box-shadow:none;background:var(--paper-2)">
        </div>`).join('')}</div>` : `<div class="empty">${ic('i-party')}还没有导入文件。</div>`}`;
    $('#fileIn').onchange = async (e) => {
      for (const file of e.target.files) {
        const rec = { id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), name: file.name, type: file.type || 'application/octet-stream', size: file.size, at: Date.now(), blob: file, label: '' };
        if (file.type === 'text/plain') rec.text = await file.text();
        await fPut(rec);
      }
      renderFiles();
    };
    box.onclick = async (e) => {
      const o = e.target.closest('[data-fopen]'); if (o) { const f = files.find((x) => x.id === o.dataset.fopen); if (viewing && viewing.url) URL.revokeObjectURL(viewing.url); viewing = { name: f.name, type: f.type, url: URL.createObjectURL(f.blob), text: f.text }; renderFiles(); return; }
      if (e.target.closest('[data-fclose]')) { if (viewing && viewing.url) URL.revokeObjectURL(viewing.url); viewing = null; renderFiles(); return; }
      const d = e.target.closest('[data-fdel]'); if (d && confirm('删除这个文件？只从本机删除。')) { await fDel(d.dataset.fdel); renderFiles(); }
    };
    box.onchange = async (e) => { const l = e.target.dataset.flabel; if (!l) return; const f = files.find((x) => x.id === l); f.label = e.target.value; await fPut(f); };
  }

  /* ================= 我的 ================= */
  // 错题：新数据带 {key, src, q, a, e, mine, setId, kind, ctx}；旧数据只有 key/src/q/a/e，setId / kind 从 key、src 推出来
  const WK = { listen: '听力', mc: '仔细阅读', match: '段落匹配', cloze: '选词填空', para: '同义替换' };
  const wrongKind = (w) => w.kind && WK[w.kind] ? w.kind : /听力/.test(w.src || '') ? 'listen' : /选词/.test(w.src || '') ? 'cloze' : /匹配/.test(w.src || '') ? 'match' : 'mc';
  const wrongSet = (w) => w.setId || String(w.key || '').split(':')[0];
  function wrongHTML(w) {
    const gap = (t) => esc(t).replace(/_{2,}/g, '<b class="gap" aria-label="空格">&nbsp;</b>');
    const can = !!findSet(wrongSet(w));
    const mine = w.mine === undefined ? '' : `<div class="wi-mine"><span>你的答案</span><b>${w.mine === null || w.mine === '' ? '未作答' : esc(w.mine)}</b></div>`;
    return `<div class="wrong-item ${wrongKind(w) === 'listen' ? 'm-listen' : 'm-read'}">
      <div class="src">${esc(String(w.src || '').replace(/^([^·]+?)\s*·\s*\1\s*·\s*/, '$1 · '))}</div>
      ${w.q ? `<div class="wq">${esc(w.q)}</div>` : ''}
      ${w.ctx ? `<div class="ctx">${gap(w.ctx)}</div>` : ''}
      <div class="wi-ans">${mine}<div class="wi-right"><span>正确答案</span><b>${esc(w.a)}</b></div></div>
      ${w.e ? `<div class="e">${esc(w.e)}</div>` : ''}
      ${window.CET6Learn ? window.CET6Learn.wrongExtraHTML(w) : ''}
      <div class="wi-act">${can ? `<button class="btn soft" data-wgo="${esc(wrongSet(w))}">${ic('i-redo')}回原题</button>` : ''}<button class="btn ghost" data-wdel="${esc(w.key)}">${ic('i-check')}已掌握</button></div>
    </div>`;
  }
  let meVocabAll = false;
  // 从别处直接打开某套题：切到听读 tab（对应听力 / 阅读子页），再打开这一套
  function goSet(id) { const f = findSet(id); if (!f) return false; psub = f.kind === 'listen' ? 'listen' : 'read'; show('practice'); openSet(id); return true; }
  // 练习记录：各类型进度 + 按日期倒序的交卷记录（旧数据没有 S.hist 时用 S.sets 补一条）
  let histAll = false;
  function histHTML() {
    const rows = [
      ['六级题型听力', 'm-listen', LISTENING], ['真人常速听力', 'm-listen', REALS.filter((r) => r.org)], ['真人慢速听力', 'm-listen', REALS.filter(realSlow)],
      ['仔细阅读', 'm-read', READING.mc], ['段落匹配', 'm-read', READING.match], ['选词填空', 'm-read', READING.cloze],
      ['作文', 'm-write', WRITING], ['翻译', 'm-trans', TRANSLATION],
    ].map(([n, m, list]) => { const dn = list.filter((x) => (m === 'm-write' || m === 'm-trans') ? wrote(x.id) : S.sets[x.id]).length; return `<div class="hp ${m}"><span class="hp-n">${n}</span><span class="bar"><i style="width:${list.length ? Math.round(dn / list.length * 100) : 0}%"></i></span><span class="hp-v">${dn}/${list.length}</span></div>`; }).join('');
    const seen = new Set(S.hist.map((h) => h.id));
    const legacy = Object.entries(S.sets).filter(([id]) => !seen.has(id)).map(([id, r]) => { const f = findSet(id); return f && { id, kind: f.kind, title: f.set.title, r: r.r, t: r.t, sec: r.sec, d: r.d || r.at || '', ts: 0 }; }).filter(Boolean);
    const all = [...legacy, ...S.hist].sort((a, b) => (b.d || '').localeCompare(a.d || '') || b.ts - a.ts);
    const papers = S.papers.slice().reverse();
    const exams = (S.exams || []).slice().reverse();
    const KN = { listen: '听力', mc: '仔细阅读', match: '段落匹配', cloze: '选词填空' };
    const shown = histAll ? all : all.slice(0, 15);
    let lastD = '';
    const list = shown.map((h) => { const day = h.d !== lastD ? `<div class="hl-d">${esc(h.d || '更早')}</div>` : ''; lastD = h.d; const pct = h.t ? Math.round(h.r / h.t * 100) : 0;
      return `${day}<div class="hl"><span class="hl-k">${KN[h.kind] || ''}</span><span class="hl-t">${esc(String(h.title).replace(/^[^·]+·\s*/, ''))}</span><span class="hl-s ${pct >= 80 ? 'good' : pct < 60 ? 'bad' : ''}">${h.r}/${h.t}</span>${h.sec ? `<span class="hl-m">${mmss(h.sec)}</span>` : ''}<button class="chip" data-wgo="${h.id}">再做</button></div>`; }).join('');
    return `<div class="sec-h"><span class="ico m-listen">${ic('i-timer')}</span><h2>练习记录</h2><span class="more">共 ${all.length} 次${papers.length ? ` · 模拟卷 ${papers.length} 套` : ''}</span></div>
      <div class="card hist">${exams.length ? `<div class="hl-d" style="margin-top:0">模考成绩</div><div class="ex-hist">${exams.slice(0, 5).map((x) => { const m = window.CET6Exam ? window.CET6Exam.meta(x) : { v: x.total, tag: '完整模考', rate: Math.round((x.total || 0) / 7.1), custom: false }; return `<button class="ex-hrow" data-exrep="${x.ts}"><span class="ex-ht"><b>${m.v}</b><small>${m.custom ? '折算' : '/710'}</small></span><span class="ex-hm"><span class="ex-tags"><span class="ex-tag${m.custom ? ' cu' : ''}">${esc(m.tag)}</span><span>得分率 ${m.rate}%</span></span>${esc(x.d)} · 卷号 ${esc(x.seed)}</span>${ic('i-chev-r')}</button>`; }).join('')}</div>` : ''}<div class="hp-grid">${rows}</div>
        ${window.CET6RT ? window.CET6RT.speedHTML() : ''}
        ${all.length ? `<div class="hl-list">${list}</div>${all.length > 15 ? `<div class="reveal" style="margin-top:8px"><button class="btn ghost" data-hall>${histAll ? '收起' : `显示全部 ${all.length} 条`}</button></div>` : ''}` : `<p class="lead" style="margin:12px 0 0">还没有交卷记录。去「听读」点「随机来一篇」开始吧。</p>`}
        ${papers.length ? `<div class="hl-d">生成过的模拟卷</div><div class="hl-papers">${papers.slice(0, 12).map((p) => `<a class="chip" href="paper.html?seed=${encodeURIComponent(p.seed)}">${p.mode === 'online' ? '在线' : '打印'} · 卷号 ${esc(p.seed)} · ${esc(p.d)}</a>`).join('')}</div>` : ''}</div>`;
  }
  function renderMe() {
    const st = stats(); const wrongs = Object.values(S.wrong).reverse(); // 新的在前（按加入顺序倒序）
    const unknownWords = ALLWORDS.filter((w) => S.vocab[w.id] === 0 || S.vocab[w.id] === 1);
    const groups = Object.keys(WK).map((k) => [k, wrongs.filter((w) => wrongKind(w) === k)]).filter(([, xs]) => xs.length);
    const VN = 20, vShow = meVocabAll ? unknownWords : unknownWords.slice(0, VN);
    const myWordsH = window.CET6Drills ? window.CET6Drills.myWordsHTML() : ''; // 逐句听写收的词库外生词（S.myWords）
    $('#me-box').innerHTML = `
      <div class="me-grid">
        <div class="num m-vocab"><div class="v">${st.known}</div><div class="l">认识的词</div></div>
        <div class="num m-vocab" style="--brand:var(--red)"><div class="v" style="color:var(--red)">${unknownWords.length}</div><div class="l">生词本${Array.isArray(S.myWords) && S.myWords.length ? ` · 另收藏 ${S.myWords.length}` : ''}</div></div>
        <div class="num m-read" style="--brand:var(--red)"><div class="v" style="color:var(--red)">${wrongs.length}</div><div class="l">错题</div></div>
        <div class="num m-read"><div class="v">${st.setsDone}</div><div class="l">做过的练习</div></div>
        <div class="num m-listen"><div class="v">${st.acc === null ? '—' : st.acc + '%'}</div><div class="l">练习正确率</div></div>
        <div class="num m-exam"><div class="v">${st.m}/${totalPts}</div><div class="l">考点已掌握</div></div>
      </div>
      <div class="sec-h"><span class="ico m-read">${ic('i-x')}</span><h2>错题本</h2>${wrongs.length ? `<button class="more" data-clear>清空</button>` : ''}</div>
      ${window.CET6Learn ? window.CET6Learn.meTopHTML() + window.CET6Learn.causeChartHTML() : ''}
      ${wrongs.length ? groups.map(([k, xs]) => `<div class="wrong-grp"><div class="wg-h">${WK[k]}<span>${xs.length}</span></div>${xs.map(wrongHTML).join('')}</div>`).join('') : `<div class="empty">${ic('i-party')}还没有错题。</div>`}
      ${histHTML()}
      <div class="sec-h"><span class="ico m-vocab">${ic('i-abc')}</span><h2>生词本</h2>${unknownWords.length ? `<button class="more" data-go-vocab>去复习 ${ic('i-chev-r')}</button>` : ''}</div>
      ${unknownWords.length ? `<div class="me-vtags">${vShow.map((w) => `<div class="mv"><b>${esc(w.w)}</b><span>${esc(w.c)}</span></div>`).join('')}</div>
        ${unknownWords.length > VN ? `<div class="reveal" style="margin-top:10px"><button class="btn ghost" data-vall>${meVocabAll ? '收起' : `展开全部 ${unknownWords.length} 个`}</button></div>` : ''}` : myWordsH ? '' : `<div class="empty">${ic('i-party')}还没有生词。去"单词"页刷闪卡，点"不认识"的会收进来。</div>`}
      ${myWordsH}
      <div class="sec-h"><span class="ico m-vocab">${ic('i-redo')}</span><h2>数据与备份</h2></div>
      <div class="card" style="margin-bottom:12px">
        <p class="lead" style="margin:0 0 10px" id="storageLine">正在读取存储状态…</p>
        <p class="lead" style="margin:0 0 12px">所有数据只在这台设备的浏览器里：换浏览器、换手机、清站点数据都会丢。把本站<b>添加到主屏幕</b>后，系统会按 App 对待，不会在长期不用时清掉。换设备前先导出备份。</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-export>${ic('i-pen')}导出备份（进度 / 生词 / 错题 / 作文）</button><label class="btn" style="cursor:pointer">${ic('i-redo')}导入备份<input type="file" id="importIn" accept=".json,application/json" hidden></label></div>
      </div>
      <div class="sec-h"><span class="ico m-exam">${ic('i-timer')}</span><h2>我的真题库</h2><span class="more">仅本机</span></div>
      <div id="files-box"></div>`;
    renderFiles();
    (async () => {
      const el = $('#storageLine'); if (!el) return;
      try {
        const est = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null;
        const persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : null;
        const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
        el.innerHTML = `${est ? `已用 <b>${fmtSize(est.usage || 0)}</b>（浏览器配额约 ${fmtSize(est.quota || 0)}）· ` : ''}持久化：<b>${persisted === null ? '不支持' : persisted ? '已开启' : '未开启（添加到主屏幕后再打开一次通常会批准）'}</b> · ${standalone ? '当前以 App 方式运行' : '当前在浏览器里运行'}`;
      } catch { el.textContent = '读不到存储状态。'; }
    })();
    $('#importIn').onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { const data = JSON.parse(await f.text()); if (!data || data.app !== 'cet6') throw 0;
        if (!confirm(`导入 ${data.at ? new Date(data.at).toLocaleString() : ''} 的备份？会覆盖当前的进度、生词和错题。`)) return;
        Object.keys(S).forEach((k) => delete S[k]); Object.assign(S, data.state); save(); location.reload();
      } catch { alert('不是本站的备份文件。'); }
    };
    $('#me-box').onclick = (e) => {
      if (e.target.closest('[data-export]')) {
        const blob = new Blob([JSON.stringify({ app: 'cet6', at: Date.now(), state: S })], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `cet6-backup-${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); return;
      }
      if (e.target.closest('#files-box')) return;
      if (window.CET6RT && window.CET6RT.meClick(e)) return;
      if (e.target.closest('[data-rtgo]') && window.CET6Learn) { window.CET6Learn.openRetest(); return; }
      if (e.target.closest('[data-go-vocab]')) { if (S.vgame) S.vgame.on = false; S.vsrc = 'wrong'; save(); vq = []; show('vocab'); }
      if (e.target.closest('[data-clear]') && confirm('清空错题本？')) { S.wrong = {}; save(); renderMe(); }
      const wg = e.target.closest('[data-wgo]'); if (wg) { goSet(wg.dataset.wgo); return; }
      const xr = e.target.closest('[data-exrep]'); if (xr && window.CET6Exam) { show('exam', true); window.CET6Exam.openReport(+xr.dataset.exrep); return; }
      const mw = e.target.closest('[data-mwdel]'); if (mw && window.CET6Drills) { window.CET6Drills.delMyWord(mw.dataset.mwdel); const y = window.scrollY; renderMe(); window.scrollTo(0, y); return; }
      const wd = e.target.closest('[data-wdel]'); if (wd) { delete S.wrong[wd.dataset.wdel]; save(); const y = window.scrollY; renderMe(); window.scrollTo(0, y); return; }
      if (e.target.closest('[data-hall]')) { histAll = !histAll; const y = window.scrollY; renderMe(); window.scrollTo(0, y); return; }
      if (e.target.closest('[data-vall]')) { meVocabAll = !meVocabAll; const y = window.scrollY; renderMe(); window.scrollTo(0, y); }
    };
  }

  /* ---------- 给模考页（assets/exam.js）用的最小接口 ---------- */
  window.CET6 = { S, save, esc, ic, lday, today, show, findSet, marksOf, wrongsOf, recordSet, reviewSet, clozeWord, enWords, hl, AUD, stopAudio, mmss, isPhone };
  /* ---------- 给学习闭环（assets/learn.js）用的接口 ---------- */
  Object.assign(window.CET6, {
    qLoc, clozeCtx, goSet, renderHome, openOutline: (ch) => { show('home'); openOutline(ch); },
    openVocabDaily: () => { if (S.vgame) S.vgame.on = false; if (S.vsrc !== 'daily') { S.vsrc = 'daily'; vq = []; } save(); show('vocab'); },
    openWT: (sub) => { show('wt', true); renderWT(sub); }, openWTItem,
  });
  /* ---------- 给专项训练（assets/drills.js）用的接口 ---------- */
  Object.assign(window.CET6, {
    tokIndex, findQuote, practiceHome: () => renderPracticeHome(null, true), rerenderSet: () => { if (cur) renderSet(); },
    startTimer, curSet: () => (cur && cur.set ? cur.set.id : ''),   // 限时模式重新计时 / 点词收藏记来源（assets/readtools.js）
    openDrill: (k) => { psub = k === 'dict' ? 'listen' : 'read'; show('practice', true); openDrill(k); },
  });
  /* ---------- 给单词小游戏（assets/vgame.js）用的接口 ---------- */
  // 游戏标记：答错 → 不认识（今天刷过、清掉认识阶段）；答对且原来是「不认识」→ 升为「模糊」，不直接标认识
  const gameMark = (id, ok) => {
    // 不写 S.vseen：游戏里答错的词今天仍会出现在「今日单词」闪卡里，能看到完整例句
    if (!ok) { S.vocab[id] = 0; delete S.vstage[id]; }
    else if (S.vocab[id] === 0) { S.vocab[id] = 1; }
    save();
  };
  Object.assign(window.CET6, { VOCAB, ALLWORDS, exOf, hlWord, speak, dailyPlan, isWrong, wordOf, shuffle, gameMark, renderVocab });
  /* ---------- 给今日复习流程（assets/review.js）用的接口 ---------- */
  // vreview：复习判定题作答（与单词页判定题同一套规则：答对 = 认识升一级，答错 = 不认识、阶段清零）；vfuzzy：「蒙对的，记模糊」
  Object.assign(window.CET6, {
    vdueDay, canSpell,
    vreview: (id, ok) => { const w = wordOf(id); if (!w) return; const ag = vagain; vagain = false; vapply(w, ok ? 2 : 0); vagain = ag; vhist.pop(); vq = []; },
    vfuzzy: (id) => { S.vocab[id] = 1; delete S.vstage[id]; save(); },
    vnewSug,
  });

  /* ---------- 启动 ---------- */
  if (window.CET6Learn) window.CET6Learn.init();   // 旧记录补 sub、错题补 due / streak（幂等）
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  const start = location.hash.slice(1);
  // #set=<id>：直接打开某套听力 / 阅读（模拟卷 Part II 的篇目链接用）
  const setM = start.match(/^set=([\w-]+)$/);
  // #exam=<卷号>：打印版「在线做这套」，到模考页并填好卷号
  const exM = start.match(/^exam=(\d+)$/);
  // #wt=<题目 id>：写译页直接打开这道题
  const wtM = start.match(/^wt=([\w-]+)$/), wtK = wtM ? (WRITING.some((x) => x.id === wtM[1]) ? 'write' : TRANSLATION.some((x) => x.id === wtM[1]) ? 'trans' : '') : '';
  if (wtK) openWTItem(wtK, wtM[1]);
  else if (exM && window.CET6Exam) { window.CET6Exam.preset(+exM[1]); show('exam'); }
  else if (!(setM && goSet(setM[1]))) show(VIEWS.includes(start) ? start : 'home');
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
