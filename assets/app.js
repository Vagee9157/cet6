(() => {
  'use strict';
  /* ---------- 存储 ---------- */
  const KEY = 'cet6.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const S = Object.assign({ mastered: {}, vocab: {}, sets: {}, wrong: {}, theme: '', plan: {}, rate: 1 }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
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
  const VIEWS = ['home', 'vocab', 'practice', 'wt', 'me'];
  const R = { home: renderHome, vocab: renderVocab, practice: renderPracticeHome, wt: renderWT, me: renderMe };
  function show(v, keep) {
    if (v !== 'practice' && typeof stopAudio === 'function') stopAudio();
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
  let splitSel = 'read';
  const splitInfo = (sp) => `<div class="k">${sp.pts}</div><div><b>${sp.n}</b> 满分 ${sp.pts} 分</div><div>${sp.tip}</div>`;
  // 今天的四件事：按真实行为判定完成，点卡片只负责跳转
  // 单词 = 今日队列刷完；听力 / 阅读 = 当天有该类型交卷记录（S.sets[id].d，旧记录退回 at）；范文 = 当天展开过「对照范文 / 参考译文」（写译页打点 S.plan[日期].wt）
  function planStatus() {
    const d = lday(), p = dailyPlan();
    const kinds = new Set(Object.entries(S.sets).filter(([, s]) => s && (s.d || s.at) === d).map(([id]) => { const f = findSet(id); return f ? (f.kind === 'listen' ? 'listen' : 'read') : ''; }));
    const vDone = p.order.filter((id) => S.vseen[id] === d).length;
    return { vDone, vTot: p.order.length, vocab: p.order.length > 0 && vDone >= p.order.length, listen: kinds.has('listen'), read: kinds.has('read'), wt: !!(S.plan[d] && S.plan[d].wt) };
  }
  const chDone = (c) => c.points.filter((p, i) => S.mastered[ptKey(c, i)]).length;
  function renderHome() {
    const st = stats(); const ps = planStatus();
    const plan = [
      { id: 'vocab', mod: 'vocab', t: `背 ${S.vnew} 个新词 + 复习`, s: ps.vocab ? '今日单词已刷完' : `今日单词 ${ps.vDone}/${ps.vTot}，生词隔天再刷`, view: 'vocab' },
      { id: 'listen', mod: 'listen', t: '做 1 篇听力', s: '长对话或讲座，交卷后对着原文精听', view: 'practice', sub: 'listen' },
      { id: 'read', mod: 'read', t: '做 1 篇阅读', s: '仔细阅读优先，12 分钟计时，错题看解析', view: 'practice', sub: 'read' },
      { id: 'wt', mod: 'write', t: '读 1 篇范文', s: '打开写译页，把高亮句抄进自己的模板', view: 'wt' },
    ];
    const nDone = plan.filter((p) => ps[p.id]).length;
    const sp = SPLIT.find((s) => s.k === splitSel);
    const wide = matchMedia('(min-width:720px)').matches;
    $('#home-box').innerHTML = `
      <div class="hero">
        <div class="hero-main">
          <h1>目标 <b>500</b>，按分值分配精力</h1>
          <p>六级满分 710，听力和阅读各占 35%。先把单题分值最高的仔细阅读和讲座练稳，写作翻译用模板保底、再靠加分句式抬一档，500 分留足了过 425 的余量。</p>
          <div class="acts"><button class="btn w" data-go="practice">${ic('i-ear')}开始练习</button><button class="btn" data-go="vocab">${ic('i-abc')}背单词</button><button class="btn" data-go="outline">${ic('i-target')}看考点</button><a class="btn" href="paper.html">${ic('i-pen')}生成模拟卷</a></div>
        </div>
        <div class="hero-side">
          <div class="stat-tiles">
            <div class="tile m-vocab"><div class="v">${st.known}<small>/ ${ALLWORDS.length}</small></div><div class="l">认识的词</div></div>
            <div class="tile m-read"><div class="v">${st.setsDone}</div><div class="l">做过的练习</div></div>
            <div class="tile m-listen"><div class="v">${st.acc === null ? '—' : st.acc + '<small>%</small>'}</div><div class="l">正确率</div></div>
          </div>
          <details class="score-split"${wide ? ' open' : ''}>
            <summary><h3>${ic('i-target')}710 分怎么拆<small>点一段看策略</small><span class="caret">${ic('i-chev-r')}</span></h3></summary>
            <div class="split-bar">${SPLIT.map((s) => `<button class="${MOD[s.k]}" style="--w:${s.w}" data-split="${s.k}" aria-pressed="${s.k === splitSel}">${s.n} ${s.w}%</button>`).join('')}</div>
            <div class="split-info ${MOD[sp.k]}">${splitInfo(sp)}</div>
          </details>
        </div>
        <div class="home-plan">
          <div class="sec-h"><span class="ico m-exam">${ic('i-flame')}</span><h2>今天的四件事</h2><span class="more">${nDone}/4 完成</span></div>
          <div class="plan">${plan.map((p, i) => `<button class="card ${MOD[p.mod]} ${ps[p.id] ? 'done' : ''}" data-plan="${p.id}" data-go="${p.view}" data-sub="${p.sub || ''}"><span class="n">${ps[p.id] ? ic('i-check') : i + 1}</span><span><b>${esc(p.t)}</b><span>${esc(p.s)}</span></span></button>`).join('')}</div>
        </div>
      </div>

      <div class="sec-h"><span class="ico">${ic('i-book')}</span><h2>考点与策略</h2><span class="more" id="ptCount">${st.m}/${totalPts} 已掌握</span></div>
      <div class="mod-grid">${CHAPTERS.map((c) => `<button class="mod ${MOD[c.id]}" data-go="outline" data-ch="${c.id}"><span class="ico">${c.icon}</span><b>${esc(c.name)}</b><span>${esc(c.intro)}</span><div class="bar"><i data-chbar="${c.id}" style="width:${chDone(c) / c.points.length * 100}%"></i></div></button>`).join('')}</div>
      ${typeof PAST !== 'undefined' && PAST.length ? `<div class="sec-h"><span class="ico m-exam">${ic('i-timer')}</span><h2>近十年真题回顾</h2><span class="more">${PAST.length} 套 · ${PAST[PAST.length - 1].y}–${PAST[0].y}</span></div>
      <p class="lead">只收每套的作文题、翻译主题和阅读 / 听力话题（原卷受版权保护，不收原文）。看规律、对着练，比盲刷更有用。</p>
      <button class="btn primary" data-go="past">${ic('i-timer')}打开真题索引</button>` : ''}
      <div id="outline-anchor"></div>
      <div id="outline-box" hidden></div>
      <div id="past-box" hidden></div>`;
    $('#home-box').onclick = (e) => {
      // 分值条：只换说明，不重绘整页（手机上折叠面板保持展开）
      const sb = e.target.closest('[data-split]'); if (sb) { splitSel = sb.dataset.split; const s2 = SPLIT.find((s) => s.k === splitSel); document.querySelectorAll('[data-split]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.split === splitSel)); const info = $('.split-info'); info.className = 'split-info ' + MOD[s2.k]; info.innerHTML = splitInfo(s2); return; }
      const g = e.target.closest('[data-go]'); if (!g) return;
      if (g.dataset.plan === 'vocab' && S.vsrc !== 'daily') { S.vsrc = 'daily'; save(); vq = []; }
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
          <div class="pt-body"><div class="tbl-scroll">${p.body}</div><div class="pt-foot"><label class="master"><input type="checkbox" data-master="${k}" ${m ? 'checked' : ''}> 这条我记住了</label></div></div>
        </details>`; }).join('')}</div>
      ${c.id === 'exam' ? `<div class="sec-h"><span class="ico m-exam">${ic('i-target')}</span><h2>关键数字</h2></div>${NUMBERS.map((g) => `<p class="lead" style="margin:8px 0 8px;font-weight:700;color:var(--ink)">${esc(g.g)}</p><div class="num-grid">${g.rows.map(([l, v]) => `<div class="num m-exam"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>`).join('')}` : ''}`;
    $('#outline-box').onclick = (e) => { const b = e.target.closest('[data-ch]'); if (b) { chSel = b.dataset.ch; renderOutline(); } };
    // 勾「这条我记住了」：只局部更新标签和进度数字，不重绘、不收起其他卡片、不跳滚动
    $('#outline-box').onchange = (e) => {
      const k = e.target.dataset.master; if (!k) return;
      if (e.target.checked) S.mastered[k] = 1; else delete S.mastered[k]; save();
      const tt = e.target.closest('details.pt').querySelector('.pt-title'), tg = tt.querySelector('.tag.mst');
      if (e.target.checked && !tg) tt.insertAdjacentHTML('beforeend', MASTER_TAG); else if (!e.target.checked && tg) tg.remove();
      const cc = $('#chCount'); if (cc) cc.textContent = `${chDone(c)}/${c.points.length} 已掌握`;
      const pc = $('#ptCount'); if (pc) pc.textContent = `${stats().m}/${totalPts} 已掌握`;
      const bar = document.querySelector(`[data-chbar="${c.id}"]`); if (bar) bar.style.width = chDone(c) / c.points.length * 100 + '%';
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
  S.vseen = S.vseen || {}; S.vsrc = S.vsrc || 'daily'; S.vnew = S.vnew || 20; S.vstage = S.vstage || {};
  const isWrong = (id) => S.vocab[id] === 0 || S.vocab[id] === 1;
  const wordOf = (id) => ALLWORDS.find((x) => x.id === id);
  // 到期规则：不认识隔 1 天、模糊隔 2 天；认识的按 S.vstage（连续认识次数）第 1 次后 7 天、第 2 次后 21 天再抽查，第 3 次认识后不再出现
  // 旧数据只有 S.vseen 没有 S.vstage：按第 1 次认识算（7 天后抽查一次）
  const KNOWN_GAP = [0, 7, 21];
  function isDue(id, d) {
    const m = S.vocab[id], seen = S.vseen[id];
    if (m === 0 || m === 1) return !seen || (seen < d && dayDiff(seen, d) >= (m === 0 ? 1 : 2));
    if (m === 2) { const st = S.vstage[id] || 1; return !!seen && st < KNOWN_GAP.length && dayDiff(seen, d) >= KNOWN_GAP[st]; }
    return false;
  }
  function dailyPlan(extra) {
    const d = lday();
    if (S.daily && S.daily.d === d && S.daily.n === S.vnew && !extra) return S.daily;
    const rnd = seeded('cet6-' + d + '-' + (extra ? Date.now() : ''));
    const due = ALLWORDS.filter((w) => isDue(w.id, d))
      .sort((a, b) => (S.vseen[a.id] || '').localeCompare(S.vseen[b.id] || '')).slice(0, 30).map((w) => w.id);
    const keep = S.daily && S.daily.d === d ? S.daily : null;
    const taken = new Set(keep ? [...keep.fresh, ...keep.review] : []);
    const pool = shufBy(ALLWORDS.filter((w) => S.vocab[w.id] === undefined && !taken.has(w.id)), rnd).map((w) => w.id);
    const fresh = keep ? [...keep.fresh, ...pool.slice(0, extra ? 10 : Math.max(0, S.vnew - keep.fresh.length))] : pool.slice(0, S.vnew);
    const review = keep ? keep.review : due.filter((id) => !fresh.includes(id));
    S.daily = { d, n: S.vnew, fresh, review, order: shufBy([...fresh, ...review], rnd) }; save();
    return S.daily;
  }
  function buildQueue() {
    vi = 0; flipped = false;
    if (S.vsrc === 'daily') { const p = dailyPlan(); const d = lday(); vq = p.order.filter((id) => S.vseen[id] !== d).map(wordOf).filter(Boolean); return; }
    // 生词本：全部「不认识 + 模糊」，最近标记的排前面，同一天内随机
    if (S.vsrc === 'wrong') { vq = shuffle(ALLWORDS.filter((w) => isWrong(w.id))).sort((a, b) => (S.vseen[b.id] || '').localeCompare(S.vseen[a.id] || '')); return; }
    const words = VOCAB[vg].words.map((w, wi) => wordOf(vg + ':' + wi));
    const unknown = words.filter((w) => isWrong(w.id));
    const fresh = words.filter((w) => S.vocab[w.id] === undefined);
    vq = vmode === 'review' ? unknown : [...fresh, ...unknown];
  }
  // 标记：0 不认识 / 1 模糊 / 2 认识。「再过一遍」模式只更新认识程度，不改今天的已刷记录（S.vseen / S.vstage）
  function vmark(k) {
    const w = vq[vi]; if (!w) return; const d = lday();
    vhist.push({ id: w.id, v: S.vocab[w.id], s: S.vseen[w.id], st: S.vstage[w.id] }); if (vhist.length > 50) vhist.shift();
    if (!vagain) {
      if (k === 2) { if (!(S.vocab[w.id] === 2 && S.vseen[w.id] === d)) S.vstage[w.id] = (S.vstage[w.id] || 0) + 1; } else delete S.vstage[w.id];
      S.vseen[w.id] = d;
    }
    S.vocab[w.id] = k; save(); vi++; flipped = false; renderVocab();
  }
  // 撤销上一个：恢复那个词标记前的状态，并把它放回当前卡片
  function vundo() {
    const h = vhist.pop(); if (!h) return;
    const put = (o, k, v) => { if (v === undefined) delete o[k]; else o[k] = v; };
    put(S.vocab, h.id, h.v); put(S.vseen, h.id, h.s); put(S.vstage, h.id, h.st); save();
    if (vi > 0 && vq[vi - 1] && vq[vi - 1].id === h.id) vi--; else vq.splice(Math.min(vi, vq.length), 0, wordOf(h.id));
    flipped = false; renderVocab();
  }
  function renderVocab() {
    const st = stats();
    const grp = VOCAB[vg];
    const gDone = grp.words.filter((w, wi) => S.vocab[vg + ':' + wi] === 2).length;
    const src = S.vsrc, daily = src === 'daily', wrong = src === 'wrong';
    // 生词本一轮刷完停在完成页（不自动重排）；其他模式队列空了就重建
    if (!vq.length || vi >= vq.length) { if (!(wrong && vq.length && vi >= vq.length)) { vagain = false; buildQueue(); } }
    const w = vq[vi];
    const plan = daily ? dailyPlan() : null, dd = lday();
    const pDone = plan ? plan.order.filter((id) => S.vseen[id] === dd).length : 0, pTot = plan ? plan.order.length : 0;
    const againN = plan ? plan.order.filter(isWrong).length : 0;
    const wrongN = ALLWORDS.filter((x) => isWrong(x.id)).length;
    const hint = `<span class="fm-hint">${ic('i-flip')}点卡片看释义</span>`;
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
      <div class="sec-h" style="margin-top:4px"><span class="ico m-vocab">${ic('i-abc')}</span><h2>高频词汇</h2><span class="more">认识 ${st.known} · 生词 ${st.unknown}</span></div>
      <div class="vsrc seg2" role="tablist"><button role="tab" data-vsrc="daily" aria-selected="${daily}">今日单词</button><button role="tab" data-vsrc="topic" aria-selected="${src === 'topic'}">按主题</button><button role="tab" data-vsrc="wrong" aria-selected="${wrong}">生词本 ${wrongN}</button></div>
      ${daily ? `<div class="vday card"><div class="vday-top"><div><b>今天 ${plan.fresh.length} 个新词 + ${plan.review.length} 个复习</b><span>新词随机抽取、当天固定；「不认识」明天再出现，「模糊」隔一天，「认识」7 天、21 天后各抽查一次</span></div><div class="vday-n">${pDone}<small>/${pTot}</small></div></div>
        <div class="bar"><i style="width:${pTot ? Math.round(pDone / pTot * 100) : 0}%"></i></div>
        <div class="ctl">每日新词 ${[10, 20, 30].map((n) => `<button class="chip" data-vnew="${n}" aria-pressed="${S.vnew === n}">${n}</button>`).join('')}</div></div>` : ''}
      ${wrong ? `<div class="vday card"><div class="vday-top"><div><b>生词本 ${wrongN} 个</b><span>点「不认识」「模糊」的词都在这里，最近标记的排在前面；点「认识」就移出生词本</span></div></div></div>` : ''}
      <div class="vt m-vocab${src !== 'topic' ? ' hide' : ''} ${vtOpen ? 'open' : ''}"><button class="vt-cur" id="vtToggle" aria-expanded="${vtOpen}"><span class="vt-lab">当前主题</span><b>${esc(grp.g)}</b><span class="vt-n">${gDone}/${grp.words.length}</span><span class="vt-sw">${vtOpen ? '收起' : '切换主题'}</span>${ic('i-chev-r')}</button>
        <div class="vt-grid">${VOCAB.map((g, i) => { const d = g.words.filter((x, wi) => S.vocab[i + ':' + wi] === 2).length; return `<button class="vt-tile" data-vg="${i}" aria-pressed="${i === vg}"><span class="nm">${esc(g.g)}</span><span class="ct">${d}/${g.words.length}</span><span class="bar"><i style="width:${Math.round(d / g.words.length * 100)}%"></i></span></button>`; }).join('')}</div></div>
      <div class="flash-wrap">
        <div class="flash-meta">${meta}</div>
        ${w ? `
        <div class="flash ${flipped ? 'flipped' : ''}" id="flash"><div class="inner">
          <div class="face front"><button class="spk" data-say="${esc(w.w)}" aria-label="朗读">${ic('i-vol')}</button><div class="w">${esc(w.w)}</div><span class="pos">${esc(w.p)}</span></div>
          <div class="face back"><div class="bk-hd"><span class="bw">${esc(w.w)}</span><span class="pos">${esc(w.p)}</span></div><div class="cn">${esc(w.c)}</div><ol class="exs">${exOf(w).map(([en, zh]) => `<li><button class="spk sm" data-say="${esc(en)}" aria-label="朗读例句">${ic('i-vol')}</button><div class="ex">${hlWord(esc(en), w.w)}</div><div class="zh">${esc(zh)}</div></li>`).join('')}</ol></div>
        </div></div>
        <div class="flash-acts"><button class="btn no" data-mark="0">${ic('i-x')}不认识</button><button class="btn so" data-mark="1">模糊</button><button class="btn ok" data-mark="2">${ic('i-check')}认识</button></div>`
        : empty}
        <div class="flash-sub"><button class="btn ghost" data-undo ${vhist.length ? '' : 'disabled'}>${ic('i-redo')}撤销上一个</button><span class="kbd-hint">空格 翻面 · 1 / 2 / 3 标记 · S 朗读 · Z 撤销</span></div>
      </div>
      <div class="sec-h"><h2 style="font-size:16px">${daily ? '今日单词表' : wrong ? '生词表' : '本组单词表'}</h2></div>
      <div class="vocab-list">${listRows.map((x) => { const s = S.vocab[x.id]; return `<button class="vw ${s === 0 || s === 1 ? 'unknown' : s === 2 ? 'known' : ''}${daily && S.vseen[x.id] === dd ? ' done' : ''}${w && w.id === x.id ? ' cur' : ''}" data-vw="${x.id}"><span class="hd"><span class="w">${esc(x.w)}</span><span class="pos">${esc(x.p)}</span></span><span class="cn">${esc(x.c)}</span></button>`; }).join('')}</div>`;
    $('#vocab-box').onclick = (e) => {
      // 点单词表里的词：卡片切到这个词（不在当前队列就插到当前位置），滚回卡片
      const vw = e.target.closest('[data-vw]'); if (vw) { const id = vw.dataset.vw; const k = vq.findIndex((x, i) => i >= vi && x.id === id); if (k === -1) vq.splice(vi, 0, wordOf(id)); else if (k > vi) { const [x] = vq.splice(k, 1); vq.splice(vi, 0, x); } flipped = false; renderVocab(); $('.flash-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const vs = e.target.closest('[data-vsrc]'); if (vs) { S.vsrc = vs.dataset.vsrc; save(); vq = []; vhist = []; renderVocab(); return; }
      const vn = e.target.closest('[data-vnew]'); if (vn) { S.vnew = +vn.dataset.vnew; save(); vq = []; renderVocab(); return; }
      if (e.target.closest('[data-vmore]')) { dailyPlan(true); vq = []; renderVocab(); return; }
      if (e.target.closest('[data-vagain]')) { const ids = dailyPlan().order.filter(isWrong); vq = shuffle(ids.map(wordOf).filter(Boolean)); vi = 0; flipped = false; vagain = true; renderVocab(); return; }
      if (e.target.closest('[data-vround]')) { vq = []; renderVocab(); return; }
      if (e.target.closest('[data-undo]')) { vundo(); return; }
      const g = e.target.closest('[data-vg]'); if (g) { vg = +g.dataset.vg; vq = []; vtOpen = false; renderVocab(); return; }
      if (e.target.closest('#vtToggle')) { vtOpen = !vtOpen; $('.vt').classList.toggle('open', vtOpen); e.target.closest('#vtToggle').setAttribute('aria-expanded', vtOpen); $('.vt-sw').textContent = vtOpen ? '收起' : '切换主题'; return; }
      if (e.target.closest('#vmode')) { vmode = vmode === 'review' ? 'flash' : 'review'; vq = []; renderVocab(); return; }
      const sp = e.target.closest('[data-say]'); if (sp) { e.stopPropagation(); speak(sp.dataset.say, 0.9); return; }
      const mk = e.target.closest('[data-mark]'); if (mk) { vmark(+mk.dataset.mark); return; }
      if (e.target.closest('#flash')) { flipped = !flipped; $('#flash').classList.toggle('flipped', flipped); }
    };
  }
  // 电脑键盘：空格翻面，1/2/3 = 不认识/模糊/认识，S 朗读，Z 撤销（只在单词页、焦点不在输入框时生效）
  document.addEventListener('keydown', (e) => {
    if ($('#view-vocab').hidden || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const k = e.key.toLowerCase(), fl = $('#flash');
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
    AU.playbackRate = m.real ? realRateOf(m) : (S.rate || 1);
  }
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
  function auToggle() { if (AU.paused) { if (AU.currentTime >= auEnd() - 0.6) AU.currentTime = 0; AU.play().catch(() => {}); } else AU.pause(); }
  function auSeek(t) { const m = auMeta(); if (!m) return; AU.currentTime = Math.max(0, Math.min(auEnd() - 0.1, t)); if (auLoop >= 0) { const i = segAt(m, AU.currentTime); if (i >= 0) auLoop = i; } syncPlayer(); }
  // 精听控制：−5s / +5s / 单句循环（真人和录音播放器共用）
  const fineHTML = () => `<div class="ctl au-fine"><button class="chip" data-skip="-5" aria-label="后退 5 秒">−5s</button><button class="chip" data-skip="5" aria-label="前进 5 秒">+5s</button><button class="chip" data-loop aria-pressed="${auLoop >= 0}">${ic('i-redo')}单句循环</button><span class="kbd-tip">键盘：空格 播放/暂停，← → 跳 5 秒</span></div>`;
  const miniHTML = () => `<div class="mini-au" id="miniAu" hidden><button class="play" id="miniBtn" data-au aria-label="播放 / 暂停">${ic(AU.paused ? 'i-play' : 'i-pause')}</button><div class="mtx"><span id="miniTxt">0:00</span><div class="seek" data-seek><i id="miniBar"></i></div></div><button class="chip" data-skip="-5" aria-label="后退 5 秒">−5s</button><button class="chip" data-skip="5" aria-label="前进 5 秒">+5s</button></div>`;
  function playerHTML(set) {
    const m = AUD(set.id);
    if (m && m.real) { const rr = realRateOf(m); const rates = m.slow ? [1, 1.1, 1.2, 1.3, 1.4] : [0.8, 0.9, 1, 1.1, 1.2]; return `<div class="player au"><button class="play" id="auBtn" data-au>${ic(AU.paused ? 'i-play' : 'i-pause')}</button>
      <div class="ttl"><span id="auTtl">点击播放录音</span><span class="tm" id="auTime">0:00 / ${fmt(m.dur)}</span></div>
      <div class="seek" data-seek><i id="auBar"></i></div>
      ${fineHTML()}
      <div class="ctl">语速 ${rates.map((r) => `<button class="chip" data-rrate="${r}" aria-pressed="${rr === r}">${r}×</button>`).join('')}</div>
      <div class="note">${m.slow ? '真人朗读，来自美国之音学英语频道（VOA Learning English，公有领域）。原速约每分钟 100 词，比六级慢；默认 1.2 倍接近考试语速，练熟后可调到 1.3–1.4 倍。题目是本站按六级讲座题型自编的。' : `真人原声，截自${esc(set.show || set.org)}（美国政府作品，公有领域），原速约每分钟 ${Math.round(set.words / set.dur * 60)} 词，跟六级真题语速相当，建议 1.0 倍直接听。题目是本站按六级${set.type === 'lecture' ? '讲座' : '长对话'}题型自编的。`}</div></div>`; }
    if (!m) return `<div class="player"><button class="play" data-play>${ic(cur.playing ? 'i-pause' : 'i-play')}</button><div class="ttl">${cur.playing ? '正在朗读…' : '点击播放录音（浏览器朗读）'}</div><div class="ctl">语速 ${[0.9, 1, 1.1, 1.2].map((r) => `<button class="chip" data-rate="${r}" aria-pressed="${(S.rate || 1) === r}">${r}×</button>`).join('')}</div><div class="note">这篇还没有录音，暂用浏览器朗读。</div></div>`;
    return `<div class="player au"><button class="play" id="auBtn" data-au>${ic(AU.paused ? 'i-play' : 'i-pause')}</button>
      <div class="ttl"><span id="auTtl">点击播放录音</span><span class="tm" id="auTime">0:00 / ${fmt(auEnd())}</span></div>
      <div class="seek" data-seek><i id="auBar"></i></div>
      ${fineHTML()}
      <div class="ctl">语速 ${[0.9, 1, 1.1, 1.2].map((r) => `<button class="chip" data-rate="${r}" aria-pressed="${(S.rate || 1) === r}">${r}×</button>`).join('')}</div>
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
      <a class="set m-exam" href="paper.html" style="margin-bottom:14px;text-decoration:none;color:inherit;display:flex"><span class="kind">整卷模拟 · A4 可打印</span><b>一键生成一份完整六级模拟卷</b><span class="meta">写作 + 听力 + 阅读 + 翻译，附答题卡、答案和听力原文</span></a>
      ${psub === 'listen' ? `
        <p class="lead">全部配录音：六级题型练习用神经网络语音分角色录制，另有 NASA / NOAA / VOA 的真人原声。答完再对着原文精听。</p>
        ${listen}`
      : `
        <p class="lead">仔细阅读分最高先做；段落匹配找定位词；选词填空最后兜底。标「真实原文」的是美国政府机构的公有领域文章，只按篇幅删节。</p>
        ${rsec('仔细阅读', `每题 2% · ${Rd.mc.length} 篇`)}<div class="set-grid">${Rd.mc.map((s) => rcard(s, '仔细阅读', '5 题')).join('')}</div>
        ${rsec('长篇阅读（段落匹配）', `每题 1% · ${Rd.match.length} 篇`)}<div class="set-grid">${Rd.match.map((s) => rcard(s, '段落匹配', '10 题')).join('')}</div>
        ${rsec('选词填空', `15 选 10 · 每题 0.5% · ${Rd.cloze.length} 篇`)}<div class="set-grid">${Rd.cloze.map((s) => rcard(s, '选词填空', '10 空')).join('')}</div>`}`;
    box.onclick = (e) => {
      const t = e.target.closest('[data-sub]'); if (t) return renderPracticeHome(t.dataset.sub);
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
  function tickTimer() { const el = $('#timer'); if (!el || !cur) return; const s = cur.done && cur.sec !== undefined ? cur.sec : elapsed(); const v = $('#timerVal'); if (v) v.textContent = mmss(s); el.classList.toggle('over', !!(cur.set.minutes && s > cur.set.minutes * 60)); }
  function startTimer(from) { clearInterval(timerId); t0 = Date.now() - (from || 0); timerId = setInterval(tickTimer, 1000); }

  /* ---------- 未交卷暂存 ---------- */
  function stashDraft() {
    if (!cur || cur.done) return; const id = cur.set.id;
    if (Object.keys(cur.ans).length) S.drafts[id] = { ans: cur.ans, el: Date.now() - t0, at: today() }; else delete S.drafts[id];
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
    startTimer(d ? d.el : 0); renderSet(); jumpTop(0);
  }
  function recordSet(id, r, t, wrongs, rights, sec) {
    S.sets[id] = { r, t, at: today(), d: lday(), sec };
    rights.forEach((k) => { delete S.wrong[k]; }); wrongs.forEach((w) => { S.wrong[w.key] = w; });
    delete S.drafts[id]; save();
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

  /* ---------- 做题页 ---------- */
  function renderSet() {
    const { kind, set, ans, done } = cur; const mod = kind === 'listen' ? 'm-listen' : 'm-read';
    const box = $('#practice-box');
    const total = kind === 'cloze' ? set.answers.length : kind === 'match' ? set.items.length : set.questions.length;
    const answered = Object.keys(ans).length;
    const back = `<div class="prac-head"><button class="btn ghost" data-back>${ic('i-chev-l')}返回</button><h2>${esc(set.title)}</h2>${kind === 'listen' ? '' : `<span class="timer" id="timer"><small>已用</small><b id="timerVal">00:00</b>${set.minutes ? `<small>/ 建议 ${set.minutes} 分钟</small>` : ''}</span>`}</div>`;
    const K = ['A', 'B', 'C', 'D'];
    // 交卷后：手机上原文收进 <details>，先看到对错；选词填空的对错就在原文里，不收
    const fold = done && isPhone() && kind !== 'cloze';
    const foldWrap = (inner, label) => fold ? `<details class="src-fold ${mod}"><summary>${ic('i-eye')}<b>${label}</b><span>展开</span>${ic('i-chev-r')}</summary>${inner}</details>` : inner;
    cur.locs = [];
    const units = done ? srcUnits(kind, set) : [];
    const ctx = done ? { kind, units, toks: tokIndex(units) } : null;
    const vd = (ok, p) => `<b class="vd ${ok ? 'ok' : 'bad'}">${ok ? '✓ 答对' : p === undefined ? '✗ 未作答' : '✗ 答错'}</b>`;
    const qcls = (ok) => done ? (ok ? ' is-right' : ' is-wrong') : '';
    const mcq = (qs) => `<div class="q-list">${qs.map((q, i) => { const p = ans[i]; return `<div class="q ${mod}${qcls(p === q.a)}" id="q-${i}"><div class="qt"><span class="n">${i + 1}</span><span>${esc(q.q)}</span></div><div class="opts">${q.opts.map((o, k) => { let cls = 'opt'; if (done) { if (k === q.a) cls += ' right'; else if (k === p) cls += ' wrong'; } else if (k === p) cls += ' picked'; return `<button class="${cls}" data-q="${i}" data-k="${k}" ${done ? 'disabled' : ''}><span class="k">${K[k]}</span><span>${esc(o)}</span></button>`; }).join('')}</div>${done ? `<div class="exp">${vd(p === q.a, p)} · 正确答案 ${K[q.a]}。${expHTML(q.exp, ctx)}</div>` : ''}</div>`; }).join('')}</div>`;
    let body = '';
    if (kind === 'listen') {
      if (AUD(set.id)) loadAudio(set.id);
      const trHead = `<div class="sec-h"><span class="ico m-listen">${ic('i-eye')}</span><h2>原文</h2><span class="more">点句子从那里重听</span>${done ? '' : `<button class="btn ghost" data-tr style="margin-left:8px">${ic('i-x')}收起</button>`}</div>`;
      if (done) body = `${playerHTML(set)}<div class="lr-split"><div class="lr-src">${fold ? foldWrap(transcriptHTML(set), '原文（点句子重听）') : trHead + transcriptHTML(set)}</div><div class="lr-qs">${mcq(set.questions)}</div></div>`;
      else body = `${playerHTML(set)}
        ${cur.showTr ? `${trHead}<p class="lead">提示：先盲听做题再看原文，练习效果最好。</p>${transcriptHTML(set)}` : `<div class="tr-toggle"><button class="btn soft m-listen" data-tr>${ic('i-eye')}查看原文</button><span>建议先盲听做题，卡住了再打开</span></div>`}${mcq(set.questions)}`;
      if (AUD(set.id)) body += miniHTML();
    } else if (kind === 'mc') {
      body = `${foldWrap(`<div class="passage">${set.text.split('\n').map((p, i) => `<p data-pk="${i}">${esc(p)}</p>`).join('')}</div>`, '原文')}${mcq(set.questions)}`;
    } else if (kind === 'match') {
      body = `${foldWrap(`<div class="passage">${set.paras.map(([l, p]) => `<p data-pk="${l}"><span class="pl">${l}</span>${esc(p)}</p>`).join('')}</div>`, '原文')}
        <div class="q-list">${set.items.map((it, i) => { const p = ans[i]; return `<div class="q m-read${qcls(p === it.a)}" id="q-${i}"><div class="qt"><span class="n">${i + 1}</span><span>${esc(it.s)}</span></div><div class="letters">${set.paras.map(([l]) => { let cls = ''; if (done) { if (l === it.a) cls = 'right'; else if (l === p) cls = 'wrong'; } else if (l === p) cls = 'picked'; return `<button class="${cls}" data-q="${i}" data-l="${l}" ${done ? 'disabled' : ''}>${l}</button>`; }).join('')}</div>${done ? `<div class="exp">${vd(p === it.a, p)} · 答案 <b>${it.a}</b> 段${p !== undefined && p !== it.a ? `（你选 ${p}）` : ''}。${it.exp ? expHTML(it.exp, ctx) : ''} <button class="loc-btn" data-para="${it.a}">${ic('i-target')}定位到 ${it.a} 段</button></div>` : ''}</div>`; }).join('')}</div>`;
    } else if (kind === 'cloze') {
      const used = new Set(Object.values(ans));
      const W = (L) => esc(clozeWord(set, L));
      const html = esc(set.text).replace(/\[(\d+)\]/g, (m, i) => { i = +i; const p = ans[i - 1], a = set.answers[i - 1]; let cls = 'blank'; if (done) cls += p === a ? ' right' : ' wrong'; else if (cur.active === i - 1) cls += ' active'; else if (p) cls += ' filled';
        const inner = done ? `<span class="bn">${i}</span>${p === a ? W(a) : `<s>${p ? `${p} ${W(p)}` : '空'}</s> → ${a} ${W(a)}`}` : `${i}${p ? ' · ' + p : ''}`;
        return `<button class="${cls}" data-blank="${i - 1}" ${done ? 'disabled' : ''}>${inner}</button>`; });
      body = `<div class="bank${done ? ' done' : ''}">${set.bank.map((b) => { const L = b[0]; return `<button class="chip ${used.has(L) ? 'used' : ''}" data-bank="${L}" ${done ? 'disabled' : ''}>${esc(b)}</button>`; }).join('')}</div>
        ${done ? '' : '<p class="lead">先点空格，再点上面的词；点已填的空可以改。</p>'}
        <div class="passage">${html.split('\n').map((p) => `<p>${p}</p>`).join('')}</div>
        ${done ? `<div class="q-list cloze-exp">${set.exp.map((e, i) => { const ok = ans[i] === set.answers[i]; return `<div class="exp${qcls(ok)}" id="q-${i}x">${vd(ok, ans[i])} · <b>${i + 1}. ${set.answers[i]} ${W(set.answers[i])}</b>${ok || ans[i] === undefined ? '' : `（你填 ${ans[i]} ${W(ans[i])}）`}　${esc(e)}</div>`; }).join('')}</div>` : ''}`;
    }
    // 真实原文（美国政府机构公有领域文章）注明出处
    if (set.url && kind !== 'listen') body += `<p class="lead src-note">原文：<a href="${esc(set.url)}" target="_blank" rel="noopener">${esc(set.source || set.org)}</a>（美国政府作品，公有领域；仅按篇幅删节，未改写句子）</p>`;
    let resHtml = '';
    if (done) {
      const r = cur.r, marks = marksOf(cur);
      resHtml = `<div class="result ${mod}"><div class="score">${r}<small> / ${total}</small></div><p>${r === total ? '全对，稳。' : r >= total * 0.7 ? '达标了，看看错的那几题的解析。' : '把错题的定位句和选项改写对照着看一遍。'}</p>
        ${cur.sec !== undefined ? `<p class="res-time">${ic('i-timer')}用时 ${mmss(cur.sec)}${kind !== 'listen' && set.minutes ? ` · 建议 ${set.minutes} 分钟${cur.sec > set.minutes * 60 ? '，超时了' : ''}` : ''}</p>` : ''}
        <div class="res-nums">${marks.map((ok, i) => `<button class="${ok ? 'ok' : 'bad'}" data-jump="${i}" aria-label="第 ${i + 1} 题${ok ? '答对' : '答错'}">${i + 1}<i>${ok ? '✓' : '✗'}</i></button>`).join('')}</div>
        ${r < total ? `<label class="ow-sw"><input type="checkbox" data-onlywrong ${cur.onlyWrong ? 'checked' : ''}>只看错题</label>` : ''}</div>`;
    }
    const restore = cur.restored && !done ? `<div class="restore-note">${ic('i-redo')}<span>已恢复上次未交卷的作答（${answered}/${total}）</span><button class="btn ghost" data-redo>清空重做</button></div>` : '';
    const next = done && nextOf(cur);
    const bar = done ? `<div class="submit-bar done-bar"><button class="btn" data-redo>${ic('i-redo')}重做</button>${next ? `<button class="btn primary" data-next="${next.id}">下一篇${ic('i-chev-r')}</button>` : ''}<button class="btn" data-back>回列表</button></div>`
      : `<div class="submit-bar"><button class="btn primary" data-submit ${answered ? '' : 'disabled'}>交卷（${answered}/${total}）</button></div>`;
    box.innerHTML = back + restore + resHtml + body + bar;
    box.classList.toggle('only-wrong', !!(done && cur.onlyWrong));
    box.onclick = (e) => {
      if (e.target.closest('[data-back]')) { stashDraft(); return renderPracticeHome(null, true); }
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
      const rr = e.target.closest('[data-rrate]'); if (rr) { const v = +rr.dataset.rrate; const mm = auMeta(); if (mm && !mm.slow) S.normRate = v; else S.realRate = v; AU.playbackRate = v; save(); document.querySelectorAll('[data-rrate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.rrate === v)); return; }
      const am = e.target.closest('[data-aumode]'); if (am) { S.auMode = am.dataset.aumode; save(); document.querySelectorAll('[data-aumode]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.aumode === S.auMode)); syncPlayer(); return; }
      if (e.target.closest('[data-tr]')) { cur.showTr = !cur.showTr; renderSet(); return; }
      const sg = e.target.closest('.seg[data-t]'); if (sg) { if (auLoop >= 0) auLoop = +sg.dataset.i; AU.currentTime = +sg.dataset.t; AU.play().catch(() => {}); return; }
      const pl = e.target.closest('[data-play]'); if (pl) { if (cur.playing) { speechSynthesis.cancel(); cur.playing = false; } else { const u = speak(set.script.replace(/^\s*[MW]:\s*/gm, '')); cur.playing = true; if (u) u.onend = () => { cur.playing = false; const b = $('[data-play]'); if (b) { b.innerHTML = ic('i-play'); $('.player .ttl').textContent = '再听一遍'; } }; } $('[data-play]').innerHTML = ic(cur.playing ? 'i-pause' : 'i-play'); $('.player .ttl').textContent = cur.playing ? '正在朗读…' : '点击播放录音'; return; }
      const rt = e.target.closest('[data-rate]'); if (rt) { S.rate = +rt.dataset.rate; AU.playbackRate = S.rate; save(); document.querySelectorAll('[data-rate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.rate === S.rate)); return; }
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
  function submitSet() {
    const { kind, set, ans } = cur; const K = ['A', 'B', 'C', 'D'];
    const marks = marksOf(cur); const r = marks.filter(Boolean).length; const total = marks.length;
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
    cur.done = true; cur.r = r; cur.sec = elapsed(); clearInterval(timerId);
    recordSet(set.id, r, total, wrongs, rights, cur.sec); renderSet(); jumpTop(0);
  }

  /* ================= 写译 ================= */
  // 先写再对照：作答存在 S.wt[题目 id]（自动保存），范文 / 参考译文默认收起；可选 30 分钟倒计时（只在本次打开期间有效）
  let wsub = 'write', wsel = 0, tsel = 0, reveal = {}, wtClock = null, wtTick = 0, wtSaveT = 0;
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
      </div>`;
  }
  // 从首页真题卡点「练写作 / 练翻译」会带 S.wtHint 过来：10 分钟内有效，顶部提示这套真题的题目，并预选最接近的一篇（每个 hint 只预选一次）
  let wtHintDone = 0;
  const wtHintFresh = () => S.wtHint && Date.now() - (S.wtHint.at || 0) < 10 * 60 * 1000 ? S.wtHint : null;
  function wtWriteKind(type) { const t = String(type || ''); return /名言|谚语/.test(t) ? /名言/ : /图|表|漫画/.test(t) ? /图表/ : /应用|信|演讲|通知|倡议/.test(t) ? /应用文/ : /现象/.test(t) ? /现象/ : /问题|解决/.test(t) ? /问题/ : /议论|观点/; }
  function applyWtHint(h) {
    if (wtHintDone === h.at) return; wtHintDone = h.at;
    if (h.writing) { const re = wtWriteKind(h.writing.type); const i = WRITING.findIndex((w) => re.test(w.title.split('·')[0])); if (i >= 0) wsel = i; }
    if (h.translation) { const th = String(h.translation.theme || ''), zh = String(h.translation.zh || ''); let i = TRANSLATION.findIndex((t) => zh.includes(t.title)); if (i < 0) i = TRANSLATION.findIndex((t) => t.theme === th); if (i < 0) i = TRANSLATION.findIndex((t) => th && (th.includes(t.theme) || t.theme.includes(th) || th.includes(t.title))); if (i >= 0) tsel = i; }
  }
  function wtHintBar(h) {
    const parts = [h.writing && h.writing.zh ? `<span><b>作文</b> ${esc(h.writing.zh)}</span>` : '', h.translation && h.translation.zh ? `<span><b>翻译</b> ${esc(h.translation.zh)}${h.translation.theme ? `（${esc(h.translation.theme)}）` : ''}</span>` : ''].filter(Boolean);
    return `<div class="wt-hintbar m-exam"><div class="tx"><div class="hd">这套真题${h.label ? `（${esc(h.label)}）` : ''}</div>${parts.join('')}<div class="ft">下面已选好同类型的一篇，照着练。</div></div><button class="x" data-hintx aria-label="关闭提示">${ic('i-x')}</button></div>`;
  }
  function renderWT(sub) {
    if (sub) { wsub = sub; window.scrollTo(0, 0); }
    const hint = wtHintFresh(); if (hint) applyWtHint(hint);
    const tabs = `<div class="wt-tabs"><button class="chip m-write" data-wsub="write" aria-pressed="${wsub === 'write'}"><span class="dot"></span>写作</button><button class="chip m-trans" data-wsub="trans" aria-pressed="${wsub === 'trans'}"><span class="dot"></span>翻译</button></div>`;
    const done = (id) => wrote(id) ? `<span class="wt-done" title="写过">${ic('i-check')}</span>` : '';
    let body = '';
    if (wsub === 'write') {
      const w = WRITING[wsel]; const shown = !!reveal[w.id];
      body = `<div class="vocab-top wt-sel">${WRITING.map((x, i) => `<button class="chip m-write" data-wsel="${i}" aria-pressed="${i === wsel}">${esc(x.tag || x.title.split('·')[0].trim())}${done(x.id)}</button>`).join('')}</div>
        <div class="prompt m-write"><div class="lab">题目 · ${esc(w.title.split('·')[0].trim())}</div>${esc(w.prompt)}${w.chart && window.writingChart ? window.writingChart(w.chart) : ''}</div>
        ${answerBox(w.id, true)}
        <details class="wt-outline m-write"><summary>${ic('i-target')}卡住了？看提纲</summary>
          <div class="steps m-write">${w.outline.map((o, i) => `<div class="st"><span class="n">${i + 1}</span><span>${esc(o)}</span></div>`).join('')}</div></details>
        <div class="reveal"><button class="btn tone m-write" data-reveal="${w.id}" aria-expanded="${shown}">${ic('i-eye')}${shown ? '收起范文' : '对照范文'}</button></div>
        ${shown ? `<div class="sec-h"><span class="ico m-write">${ic('i-eye')}</span><h2 style="font-size:16px">范文</h2><span class="more">高亮 = 可以抄进模板的句式</span></div>
        <div class="sample m-write">${hl(w.sample, w.hl)}</div>
        <div class="notes m-write">${w.notes.map((n) => `<div class="nt">${ic('i-bulb')}<span>${esc(n)}</span></div>`).join('')}</div>` : ''}`;
    } else {
      const t = TRANSLATION[tsel]; const shown = !!reveal[t.id];
      body = `<div class="vocab-top wt-sel">${TRANSLATION.map((x, i) => `<button class="chip m-trans" data-tsel="${i}" aria-pressed="${i === tsel}">${esc(x.title)}${done(x.id)}</button>`).join('')}</div>
        <div class="prompt m-trans"><div class="lab">汉译英 · ${esc(t.theme)}</div><span class="zh" style="font-family:var(--ui);line-height:1.9">${esc(t.zh)}</span></div>
        <div class="sec-h"><span class="ico m-trans">${ic('i-abc')}</span><h2 style="font-size:16px">关键词</h2></div>
        <div class="keys">${t.keys.map((k) => { const m = k.match(/^(.*?)\s+([A-Za-z(].*)$/); const zh = m ? m[1] : '', en = m ? m[2] : k; return `<span class="chip">${esc(en)}${zh ? `<i>${esc(zh)}</i>` : ''}</span>`; }).join('')}</div>
        ${answerBox(t.id, false, enWords(t.en))}
        <div class="reveal"><button class="btn tone m-trans" data-reveal="${t.id}" aria-expanded="${shown}">${ic('i-eye')}${shown ? '收起参考译文' : '对照参考译文'}</button></div>
        ${shown ? `<div class="sample m-trans">${esc(t.en)}</div><div class="notes m-trans">${t.notes.map((n) => `<div class="nt">${ic('i-bulb')}<span>${esc(n)}</span></div>`).join('')}</div>` : ''}`;
    }
    $('#wt-box').innerHTML = `<div class="wt-body">${hint ? wtHintBar(hint) : ''}${tabs + body}</div>`;
    clearInterval(wtTick); syncClock(); if (wtClock) wtTick = setInterval(syncClock, 1000);
    $('#wt-box').onclick = (e) => {
      const s = e.target.closest('[data-wsub]'); if (s) return renderWT(s.dataset.wsub);
      const a = e.target.closest('[data-wsel]'); if (a) { wsel = +a.dataset.wsel; return renderWT(); }
      const b = e.target.closest('[data-tsel]'); if (b) { tsel = +b.dataset.tsel; return renderWT(); }
      if (e.target.closest('[data-hintx]')) { delete S.wtHint; save(); return renderWT(); }
      // 展开范文 / 参考译文才算完成首页的「读 1 篇范文」
      const r = e.target.closest('[data-reveal]'); if (r) { reveal[r.dataset.reveal] = !reveal[r.dataset.reveal]; if (reveal[r.dataset.reveal]) { const d = lday(); S.plan[d] = Object.assign(S.plan[d] || {}, { wt: 1 }); save(); } renderWT(); if (reveal[r.dataset.reveal]) { const sm = $('#wt-box .sample'); if (sm) sm.scrollIntoView({ behavior: 'smooth', block: 'start' }); } return; }
      const c = e.target.closest('[data-wtclock]'); if (c) { const id = c.dataset.wtclock; wtClock = wtClock && wtClock.id === id ? null : { id, end: Date.now() + 30 * 60 * 1000 }; clearInterval(wtTick); syncClock(); if (wtClock) wtTick = setInterval(syncClock, 1000); }
    };
    $('#wt-box').oninput = (e) => {
      const id = e.target.dataset.wtid; if (!id) return;
      const had = wrote(id); S.wt[id] = e.target.value; if (!S.wt[id]) delete S.wt[id];
      const isW = wsub === 'write'; $('#wtCount').innerHTML = wtCountHTML(id, isW, isW ? 0 : enWords(TRANSLATION[tsel].en));
      if (had !== wrote(id)) { const chip = $(`#wt-box [aria-pressed="true"][data-${isW ? 'wsel' : 'tsel'}]`); if (chip) { const m = chip.querySelector('.wt-done'); if (m) m.remove(); else chip.insertAdjacentHTML('beforeend', `<span class="wt-done" title="写过">${ic('i-check')}</span>`); } }
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
  const WK = { listen: '听力', mc: '仔细阅读', match: '段落匹配', cloze: '选词填空' };
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
      <div class="wi-act">${can ? `<button class="btn soft" data-wgo="${esc(wrongSet(w))}">${ic('i-redo')}回原题</button>` : ''}<button class="btn ghost" data-wdel="${esc(w.key)}">${ic('i-check')}已掌握</button></div>
    </div>`;
  }
  let meVocabAll = false;
  // 从别处直接打开某套题：切到听读 tab（对应听力 / 阅读子页），再打开这一套
  function goSet(id) { const f = findSet(id); if (!f) return false; psub = f.kind === 'listen' ? 'listen' : 'read'; show('practice'); openSet(id); return true; }
  function renderMe() {
    const st = stats(); const wrongs = Object.values(S.wrong).reverse(); // 新的在前（按加入顺序倒序）
    const unknownWords = ALLWORDS.filter((w) => S.vocab[w.id] === 0 || S.vocab[w.id] === 1);
    const groups = Object.keys(WK).map((k) => [k, wrongs.filter((w) => wrongKind(w) === k)]).filter(([, xs]) => xs.length);
    const VN = 20, vShow = meVocabAll ? unknownWords : unknownWords.slice(0, VN);
    $('#me-box').innerHTML = `
      <div class="me-grid">
        <div class="num m-vocab"><div class="v">${st.known}</div><div class="l">认识的词</div></div>
        <div class="num m-vocab" style="--brand:var(--red)"><div class="v" style="color:var(--red)">${unknownWords.length}</div><div class="l">生词本</div></div>
        <div class="num m-read" style="--brand:var(--red)"><div class="v" style="color:var(--red)">${wrongs.length}</div><div class="l">错题</div></div>
        <div class="num m-read"><div class="v">${st.setsDone}</div><div class="l">做过的练习</div></div>
        <div class="num m-listen"><div class="v">${st.acc === null ? '—' : st.acc + '%'}</div><div class="l">练习正确率</div></div>
        <div class="num m-exam"><div class="v">${st.m}/${totalPts}</div><div class="l">考点已掌握</div></div>
      </div>
      <div class="sec-h"><span class="ico m-read">${ic('i-x')}</span><h2>错题本</h2>${wrongs.length ? `<button class="more" data-clear>清空</button>` : ''}</div>
      ${wrongs.length ? groups.map(([k, xs]) => `<div class="wrong-grp"><div class="wg-h">${WK[k]}<span>${xs.length}</span></div>${xs.map(wrongHTML).join('')}</div>`).join('') : `<div class="empty">${ic('i-party')}还没有错题。</div>`}
      <div class="sec-h"><span class="ico m-vocab">${ic('i-abc')}</span><h2>生词本</h2>${unknownWords.length ? `<button class="more" data-go-vocab>去复习 ${ic('i-chev-r')}</button>` : ''}</div>
      ${unknownWords.length ? `<div class="me-vtags">${vShow.map((w) => `<div class="mv"><b>${esc(w.w)}</b><span>${esc(w.c)}</span></div>`).join('')}</div>
        ${unknownWords.length > VN ? `<div class="reveal" style="margin-top:10px"><button class="btn ghost" data-vall>${meVocabAll ? '收起' : `展开全部 ${unknownWords.length} 个`}</button></div>` : ''}` : `<div class="empty">${ic('i-party')}还没有生词。去"单词"页刷闪卡，点"不认识"的会收进来。</div>`}
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
        Object.assign(S, data.state); save(); location.reload();
      } catch { alert('不是本站的备份文件。'); }
    };
    $('#me-box').onclick = (e) => {
      if (e.target.closest('[data-export]')) {
        const blob = new Blob([JSON.stringify({ app: 'cet6', at: Date.now(), state: S })], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `cet6-backup-${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); return;
      }
      if (e.target.closest('#files-box')) return;
      if (e.target.closest('[data-go-vocab]')) { S.vsrc = 'wrong'; save(); vq = []; show('vocab'); }
      if (e.target.closest('[data-clear]') && confirm('清空错题本？')) { S.wrong = {}; save(); renderMe(); }
      const wg = e.target.closest('[data-wgo]'); if (wg) { goSet(wg.dataset.wgo); return; }
      const wd = e.target.closest('[data-wdel]'); if (wd) { delete S.wrong[wd.dataset.wdel]; save(); const y = window.scrollY; renderMe(); window.scrollTo(0, y); return; }
      if (e.target.closest('[data-vall]')) { meVocabAll = !meVocabAll; const y = window.scrollY; renderMe(); window.scrollTo(0, y); }
    };
  }

  /* ---------- 启动 ---------- */
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  const start = location.hash.slice(1);
  // #set=<id>：直接打开某套听力 / 阅读（模拟卷 Part II 的篇目链接用）
  const setM = start.match(/^set=([\w-]+)$/);
  if (!(setM && goSet(setM[1]))) show(VIEWS.includes(start) ? start : 'home');
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
