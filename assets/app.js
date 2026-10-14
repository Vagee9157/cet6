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
  const today = () => new Date().toISOString().slice(0, 10);
  const CHMAP = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
  const MOD = { exam: 'm-exam', listen: 'm-listen', read: 'm-read', write: 'm-write', trans: 'm-trans', vocab: 'm-vocab' };
  const ptKey = (c, i) => c.id + ':' + i;
  const totalPts = CHAPTERS.reduce((n, c) => n + c.points.length, 0);
  const ALLWORDS = VOCAB.flatMap((g, gi) => g.words.map((w, wi) => ({ id: gi + ':' + wi, g: g.g, w: w[0], p: w[1], c: w[2], e: w[3] })));

  /* ---------- 主题 ---------- */
  const isDark = () => (S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  const applyTheme = () => { if (S.theme) document.documentElement.dataset.theme = S.theme; else delete document.documentElement.dataset.theme; $('#themeBtn use').setAttribute('href', isDark() ? '#i-sun' : '#i-moon'); };
  applyTheme();
  $('#themeBtn').onclick = () => { S.theme = isDark() ? 'light' : 'dark'; applyTheme(); save(); };

  /* ---------- 导航 ---------- */
  const VIEWS = ['home', 'vocab', 'practice', 'wt', 'me'];
  const R = { home: renderHome, vocab: renderVocab, practice: renderPracticeHome, wt: renderWT, me: renderMe };
  function show(v, keep) {
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
    const unknown = Object.values(S.vocab).filter((v) => v === 0).length;
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
    { k: 'listen', n: '听力', w: 35, pts: 248.5, tip: '25 题，讲座 10 题占 20%。目标做对 18 题 ≈ 165 分。' },
    { k: 'read', n: '阅读', w: 35, pts: 248.5, tip: '仔细阅读每题 2%，先做；选词填空每题 0.5%，最后做。目标 21/30 ≈ 170 分。' },
    { k: 'write', n: '写作', w: 15, pts: 106.5, tip: '三段式 + 零低级错误，稳进 11 分档 ≈ 75 分。' },
    { k: 'trans', n: '翻译', w: 15, pts: 106.5, tip: '意思译全、句子完整，不空着，10 分档 ≈ 70 分。' },
  ];
  let splitSel = 'read';
  function renderHome() {
    const st = stats();
    const plan = [
      { id: 'vocab', mod: 'vocab', t: '背 40 个高频词', s: '闪卡模式，不认识的进生词本', view: 'vocab' },
      { id: 'listen', mod: 'listen', t: '做 1 篇听力', s: '长对话或讲座，答完看原文精听', view: 'practice', sub: 'listen' },
      { id: 'read', mod: 'read', t: '做 1 篇仔细阅读', s: '12 分钟计时，错题看解析', view: 'practice', sub: 'read' },
      { id: 'wt', mod: 'write', t: '读 1 篇范文', s: '把高亮句抄进自己的模板', view: 'wt' },
    ];
    const day = today(); const done = S.plan[day] || {};
    const sp = SPLIT.find((s) => s.k === splitSel);
    $('#home-box').innerHTML = `
      <div class="hero">
        <div class="hero-main">
          <h1>目标 <b>425</b>，按分值分配精力</h1>
          <p>六级满分 710，听力和阅读各占 35%。先把单题分值最高的仔细阅读和讲座练稳，写作翻译用模板保底，425 就是自然结果。</p>
          <div class="acts"><button class="btn w" data-go="practice">${ic('i-ear')}开始练习</button><button class="btn" data-go="vocab">${ic('i-abc')}背单词</button><button class="btn" data-go="outline">${ic('i-target')}看考点</button><a class="btn" href="paper.html">${ic('i-pen')}生成模拟卷</a></div>
        </div>
        <div class="hero-side">
          <div class="stat-tiles">
            <div class="tile m-vocab"><div class="v">${st.known}<small>/ ${ALLWORDS.length}</small></div><div class="l">认识的词</div></div>
            <div class="tile m-read"><div class="v">${st.setsDone}</div><div class="l">做过的练习</div></div>
            <div class="tile m-listen"><div class="v">${st.acc === null ? '—' : st.acc + '<small>%</small>'}</div><div class="l">正确率</div></div>
          </div>
          <div class="score-split">
            <h3>${ic('i-target')}710 分怎么拆<small>点一段看策略</small></h3>
            <div class="split-bar">${SPLIT.map((s) => `<button class="${MOD[s.k]}" style="--w:${s.w}" data-split="${s.k}" aria-pressed="${s.k === splitSel}">${s.n} ${s.w}%</button>`).join('')}</div>
            <div class="split-info ${MOD[sp.k]}"><div class="k">${sp.pts}</div><div><b>${sp.n}</b> 满分 ${sp.pts} 分</div><div>${sp.tip}</div></div>
          </div>
        </div>
      </div>

      <div class="sec-h"><span class="ico m-exam">${ic('i-flame')}</span><h2>今天的四件事</h2><span class="more">${Object.keys(done).length}/4 完成</span></div>
      <div class="plan">${plan.map((p, i) => `<button class="card ${MOD[p.mod]} ${done[p.id] ? 'done' : ''}" data-plan="${p.id}" data-go="${p.view}" data-sub="${p.sub || ''}"><span class="n">${done[p.id] ? ic('i-check') : i + 1}</span><span><b>${p.t}</b><span>${p.s}</span></span></button>`).join('')}</div>

      <div class="sec-h"><span class="ico">${ic('i-book')}</span><h2>考点与策略</h2><span class="more">${st.m}/${totalPts} 已掌握</span></div>
      <div class="mod-grid">${CHAPTERS.map((c) => { const d = c.points.filter((p, i) => S.mastered[ptKey(c, i)]).length; return `<button class="mod ${MOD[c.id]}" data-go="outline" data-ch="${c.id}"><span class="ico">${c.icon}</span><b>${esc(c.name)}</b><span>${esc(c.intro)}</span><div class="bar"><i style="width:${d / c.points.length * 100}%"></i></div></button>`; }).join('')}</div>
      <div id="outline-anchor"></div>
      <div id="outline-box" hidden></div>`;
    $('#home-box').onclick = (e) => {
      const sb = e.target.closest('[data-split]'); if (sb) { splitSel = sb.dataset.split; renderHome(); return; }
      const g = e.target.closest('[data-go]'); if (!g) return;
      if (g.dataset.plan && !done[g.dataset.plan]) { done[g.dataset.plan] = 1; S.plan[day] = done; save(); }
      if (g.dataset.go === 'outline') return openOutline(g.dataset.ch);
      if (g.dataset.go === 'practice' && g.dataset.sub) { show('practice', true); renderPracticeHome(g.dataset.sub); return; }
      show(g.dataset.go);
    };
  }

  /* ---------- 考点（挂在首页下方） ---------- */
  let chSel = 'exam';
  function openOutline(ch) {
    if (ch) chSel = ch;
    const box = $('#outline-box'); box.hidden = false; renderOutline();
    $('#outline-anchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function renderOutline() {
    const c = CHMAP[chSel];
    $('#outline-box').innerHTML = `
      <div class="sec-h" style="margin-top:28px"><span class="ico ${MOD[c.id]}">${c.icon}</span><h2>${esc(c.name)}</h2></div>
      <div class="ch-nav">${CHAPTERS.map((x) => `<button class="chip ${MOD[x.id]}" data-ch="${x.id}" aria-pressed="${x.id === chSel}"><span class="dot"></span>${esc(x.name)}</button>`).join('')}</div>
      <p class="lead">${esc(c.intro)}</p>
      <div class="pt-grid">${c.points.map((p, i) => { const k = ptKey(c, i), m = !!S.mastered[k]; return `
        <details class="pt ${MOD[c.id]}" data-k="${k}">
          <summary><div class="pt-title">${esc(p.t)} ${p.hot === 2 ? '<span class="tag hot">必考</span>' : p.hot === 1 ? '<span class="tag warm">常考</span>' : ''}${m ? `<span class="tag" style="--cs:var(--ok-soft);--c:var(--ok)">${ic('i-check')}已掌握</span>` : ''}</div><span class="caret">${ic('i-chev-r')}</span><div class="pt-tip">${esc(p.tip)}</div></summary>
          <div class="pt-body"><div class="tbl-scroll">${p.body}</div><div class="pt-foot"><label class="master"><input type="checkbox" data-master="${k}" ${m ? 'checked' : ''}> 这条我记住了</label></div></div>
        </details>`; }).join('')}</div>
      ${c.id === 'exam' ? `<div class="sec-h"><span class="ico m-exam">${ic('i-target')}</span><h2>关键数字</h2></div>${NUMBERS.map((g) => `<p class="lead" style="margin:8px 0 8px;font-weight:700;color:var(--ink)">${esc(g.g)}</p><div class="num-grid">${g.rows.map(([l, v]) => `<div class="num m-exam"><div class="v">${esc(v)}</div><div class="l">${esc(l)}</div></div>`).join('')}</div>`).join('')}` : ''}`;
    $('#outline-box').onclick = (e) => { const b = e.target.closest('[data-ch]'); if (b) { chSel = b.dataset.ch; renderOutline(); } };
    $('#outline-box').onchange = (e) => { const k = e.target.dataset.master; if (!k) return; if (e.target.checked) S.mastered[k] = 1; else delete S.mastered[k]; save(); renderOutline(); };
  }

  /* ================= 单词 ================= */
  let vg = 0, vq = [], vi = 0, flipped = false, vmode = 'flash';
  function buildQueue() {
    const words = VOCAB[vg].words.map((w, wi) => ALLWORDS.find((x) => x.id === vg + ':' + wi));
    const unknown = words.filter((w) => S.vocab[w.id] === 0 || S.vocab[w.id] === 1);
    const fresh = words.filter((w) => S.vocab[w.id] === undefined);
    vq = vmode === 'review' ? unknown : [...fresh, ...unknown]; vi = 0; flipped = false;
  }
  function renderVocab() {
    const st = stats();
    const grp = VOCAB[vg];
    const gDone = grp.words.filter((w, wi) => S.vocab[vg + ':' + wi] === 2).length;
    if (!vq.length || vi >= vq.length) buildQueue();
    const w = vq[vi];
    $('#vocab-box').innerHTML = `
      <div class="sec-h" style="margin-top:4px"><span class="ico m-vocab">${ic('i-abc')}</span><h2>高频词汇</h2><span class="more">认识 ${st.known} · 生词 ${st.unknown}</span></div>
      <div class="vocab-top">${VOCAB.map((g, i) => { const d = g.words.filter((x, wi) => S.vocab[i + ':' + wi] === 2).length; return `<button class="chip m-vocab" data-vg="${i}" aria-pressed="${i === vg}"><span class="dot"></span>${esc(g.g)} <span style="opacity:.7">${d}/${g.words.length}</span></button>`; }).join('')}</div>
      <div class="flash-wrap">
        <div class="flash-meta"><span>${esc(grp.g)} · 本组认识 ${gDone}/${grp.words.length}</span><span>${vq.length ? `${vi + 1} / ${vq.length}` : ''}<button class="chip" style="margin-left:8px" id="vmode">${vmode === 'review' ? '只刷生词' : '全部'}</button></span></div>
        ${w ? `
        <div class="flash ${flipped ? 'flipped' : ''}" id="flash"><div class="inner">
          <div class="face front"><button class="spk" data-say="${esc(w.w)}" aria-label="朗读">${ic('i-vol')}</button><div class="w">${esc(w.w)}</div><span class="pos">${esc(w.p)}</span><div class="hint">${ic('i-flip')}点卡片看释义</div></div>
          <div class="face back"><button class="spk" data-say="${esc(w.e)}" aria-label="朗读例句">${ic('i-vol')}</button><div class="cn">${esc(w.c)}</div><div class="ex">${esc(w.e).replace(new RegExp('(' + w.w.split(' ')[0].replace(/[^a-z]/gi, '') + '\\w*)', 'i'), '<em>$1</em>')}</div></div>
        </div></div>
        <div class="flash-acts"><button class="btn no" data-mark="0">${ic('i-x')}不认识</button><button class="btn so" data-mark="1">模糊</button><button class="btn ok" data-mark="2">${ic('i-check')}认识</button></div>`
        : `<div class="empty">${ic('i-party')}这一组都认识了。换一组，或点"只刷生词"复习。</div>`}
      </div>
      <div class="sec-h"><h2 style="font-size:16px">本组单词表</h2></div>
      <div class="vocab-list">${grp.words.map((x, wi) => { const s = S.vocab[vg + ':' + wi]; return `<div class="vw ${s === 0 || s === 1 ? 'unknown' : s === 2 ? 'known' : ''}"><span class="w">${esc(x[0])}</span><span class="pos">${esc(x[1])}</span><span class="cn">${esc(x[2])}</span></div>`; }).join('')}</div>`;
    $('#vocab-box').onclick = (e) => {
      const g = e.target.closest('[data-vg]'); if (g) { vg = +g.dataset.vg; vq = []; renderVocab(); return; }
      if (e.target.closest('#vmode')) { vmode = vmode === 'review' ? 'flash' : 'review'; vq = []; renderVocab(); return; }
      const sp = e.target.closest('[data-say]'); if (sp) { e.stopPropagation(); speak(sp.dataset.say, 0.9); return; }
      const mk = e.target.closest('[data-mark]'); if (mk) { S.vocab[w.id] = +mk.dataset.mark; save(); vi++; flipped = false; renderVocab(); return; }
      if (e.target.closest('#flash')) { flipped = !flipped; $('#flash').classList.toggle('flipped', flipped); }
    };
  }

  /* ================= 听读练习 ================= */
  let psub = 'listen', cur = null;
  function setScore(id) { const s = S.sets[id]; return s ? `${s.r}/${s.t}` : ''; }
  function renderPracticeHome(sub) {
    if (sub) psub = sub; cur = null; if (window.speechSynthesis) speechSynthesis.cancel(); window.scrollTo(0, 0);
    const L = LISTENING, Rd = READING;
    const card = (mod, kind, s, extra) => `<button class="set ${mod}" data-open="${s.id}"><span class="kind">${kind}</span><b>${esc(s.title.replace(/^[^·]+·\s*/, ''))}</b><span class="meta">${ic('i-timer')}约 ${s.minutes} 分钟 ${extra || ''}<span class="score">${setScore(s.id)}</span></span></button>`;
    $('#practice-box').innerHTML = `
      <div class="wt-tabs"><button class="chip m-listen" data-sub="listen" aria-pressed="${psub === 'listen'}"><span class="dot"></span>听力</button><button class="chip m-read" data-sub="read" aria-pressed="${psub === 'read'}"><span class="dot"></span>阅读</button></div>
      <a class="set m-exam" href="paper.html" style="margin-bottom:14px;text-decoration:none;color:inherit;display:flex"><span class="kind">整卷模拟 · A4 可打印</span><b>一键生成一份完整六级模拟卷</b><span class="meta">写作 + 听力 + 阅读 + 翻译，附答题卡、答案和听力原文</span></a>
      ${psub === 'listen' ? `
        <p class="lead">按真题顺序：长对话 2 篇、篇章 2 篇、讲座 3 篇。录音用浏览器朗读，答完再看原文精听。</p>
        <div class="set-grid">${L.map((s) => card('m-listen', { conv: '长对话', passage: '听力篇章', lecture: '讲座 / 讲话' }[s.type], s, `· ${s.questions.length} 题`)).join('')}</div>`
      : `
        <p class="lead">仔细阅读分最高先做；段落匹配找定位词；选词填空最后兜底。</p>
        <div class="sec-h"><span class="ico m-read">${ic('i-book')}</span><h2>仔细阅读</h2></div><div class="set-grid">${Rd.mc.map((s) => card('m-read', '仔细阅读 · 每题 2%', s, '· 5 题')).join('')}</div>
        <div class="sec-h"><span class="ico m-read">${ic('i-book')}</span><h2>长篇阅读（段落匹配）</h2></div><div class="set-grid">${Rd.match.map((s) => card('m-read', '段落匹配 · 每题 1%', s, '· 10 题')).join('')}</div>
        <div class="sec-h"><span class="ico m-read">${ic('i-book')}</span><h2>选词填空</h2></div><div class="set-grid">${Rd.cloze.map((s) => card('m-read', '15 选 10 · 每题 0.5%', s, '· 10 空')).join('')}</div>`}`;
    $('#practice-box').onclick = (e) => {
      const t = e.target.closest('[data-sub]'); if (t) return renderPracticeHome(t.dataset.sub);
      const o = e.target.closest('[data-open]'); if (o) openSet(o.dataset.open);
    };
  }
  function findSet(id) {
    const l = LISTENING.find((s) => s.id === id); if (l) return { kind: 'listen', set: l };
    for (const k of ['mc', 'match', 'cloze']) { const s = READING[k].find((x) => x.id === id); if (s) return { kind: k, set: s }; }
  }
  let timerId = null, t0 = 0;
  function startTimer() { clearInterval(timerId); t0 = Date.now(); timerId = setInterval(() => { const el = $('#timer'); if (!el) return clearInterval(timerId); const s = Math.floor((Date.now() - t0) / 1000); el.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }, 1000); }
  function openSet(id) {
    const f = findSet(id); if (!f) return;
    cur = { ...f, ans: {}, done: false, playing: false }; renderSet(); startTimer(); window.scrollTo(0, 0);
  }
  function recordSet(id, r, t, wrongs) {
    S.sets[id] = { r, t, at: today() }; wrongs.forEach((w) => { S.wrong[w.key] = w; }); save();
  }
  function renderSet() {
    const { kind, set, ans, done } = cur; const mod = kind === 'listen' ? 'm-listen' : 'm-read';
    const back = `<div class="prac-head"><button class="btn ghost" data-back>${ic('i-chev-l')}返回</button><h2>${esc(set.title)}</h2><span class="timer" id="timer">00:00</span></div>`;
    const K = ['A', 'B', 'C', 'D'];
    const mcq = (qs) => `<div class="q-list">${qs.map((q, i) => { const p = ans[i]; return `<div class="q ${mod}"><div class="qt"><span class="n">${i + 1}</span><span>${esc(q.q)}</span></div><div class="opts">${q.opts.map((o, k) => { let cls = 'opt'; if (done) { if (k === q.a) cls += ' right'; else if (k === p) cls += ' wrong'; } else if (k === p) cls += ' picked'; return `<button class="${cls}" data-q="${i}" data-k="${k}" ${done ? 'disabled' : ''}><span class="k">${K[k]}</span><span>${esc(o)}</span></button>`; }).join('')}</div>${done ? `<div class="exp"><b>${p === q.a ? '✓ 答对' : '✗ 答错'}</b> · 正确答案 ${K[q.a]}。${esc(q.exp)}</div>` : ''}</div>`; }).join('')}</div>`;
    let body = '';
    if (kind === 'listen') {
      body = `<div class="player"><button class="play" data-play>${ic(cur.playing ? 'i-pause' : 'i-play')}</button><div class="ttl">${cur.playing ? '正在朗读…' : '点击播放录音'}</div><div class="ctl">语速 ${[0.9, 1, 1.1, 1.2].map((r) => `<button class="chip" data-rate="${r}" aria-pressed="${(S.rate || 1) === r}">${r}×</button>`).join('')}</div><div class="note">真题只放一遍。建议先听一遍答题，交卷后再对着原文精听。</div></div>
        ${done ? `<div class="sec-h"><span class="ico m-listen">${ic('i-eye')}</span><h2>原文</h2></div><div class="script">${esc(set.script)}</div>` : ''}${mcq(set.questions)}`;
    } else if (kind === 'mc') {
      body = `<div class="passage">${set.text.split('\n').map((p) => `<p>${esc(p)}</p>`).join('')}</div>${mcq(set.questions)}`;
    } else if (kind === 'match') {
      body = `<div class="passage">${set.paras.map(([l, p]) => `<p><span class="pl">${l}</span>${esc(p)}</p>`).join('')}</div>
        <div class="q-list">${set.items.map((it, i) => { const p = ans[i]; return `<div class="q m-read"><div class="qt"><span class="n">${i + 1}</span><span>${esc(it.s)}</span></div><div class="letters">${set.paras.map(([l]) => { let cls = ''; if (done) { if (l === it.a) cls = 'right'; else if (l === p) cls = 'wrong'; } else if (l === p) cls = 'picked'; return `<button class="${cls}" data-q="${i}" data-l="${l}" ${done ? 'disabled' : ''}>${l}</button>`; }).join('')}</div>${done && p !== it.a ? `<div class="exp">答案 <b>${it.a}</b> 段。</div>` : ''}</div>`; }).join('')}</div>`;
    } else if (kind === 'cloze') {
      const used = new Set(Object.values(ans));
      let n = 0;
      const html = esc(set.text).replace(/\[(\d+)\]/g, (m, i) => { i = +i; const p = ans[i - 1]; let cls = 'blank'; if (done) cls += p === set.answers[i - 1] ? ' right' : ' wrong'; else if (cur.active === i - 1) cls += ' active'; else if (p) cls += ' filled'; return `<button class="${cls}" data-blank="${i - 1}" ${done ? 'disabled' : ''}>${i}${p ? ' · ' + p : ''}${done && p !== set.answers[i - 1] ? ' → ' + set.answers[i - 1] : ''}</button>`; });
      body = `<div class="bank">${set.bank.map((b) => { const L = b[0]; return `<button class="chip ${used.has(L) ? 'used' : ''}" data-bank="${L}" ${done ? 'disabled' : ''}>${esc(b)}</button>`; }).join('')}</div>
        <p class="lead">先点空格，再点上面的词；点已填的空可以改。</p>
        <div class="passage">${html.split('\n').map((p) => `<p>${p}</p>`).join('')}</div>
        ${done ? `<div class="q-list">${set.exp.map((e, i) => `<div class="exp"><b>${i + 1}. ${set.answers[i]}</b> ${esc(e)}</div>`).join('')}</div>` : ''}`;
    }
    const total = kind === 'cloze' ? set.answers.length : kind === 'match' ? set.items.length : set.questions.length;
    const answered = Object.keys(ans).length;
    let resHtml = '';
    if (done) { const r = cur.r; resHtml = `<div class="result ${mod}"><div class="score">${r}<small> / ${total}</small></div><p>${r === total ? '全对，稳。' : r >= total * 0.7 ? '达标了，看看错的那几题的解析。' : '把错题的定位句和选项改写对照着看一遍。'}</p></div>`; }
    $('#practice-box').innerHTML = back + resHtml + body + (done ? `<div class="submit-bar"><button class="btn primary" data-back>${ic('i-chev-l')}回到列表</button></div>` : `<div class="submit-bar"><button class="btn primary" data-submit ${answered ? '' : 'disabled'}>交卷（${answered}/${total}）</button></div>`);
    $('#practice-box').onclick = (e) => {
      if (e.target.closest('[data-back]')) return renderPracticeHome();
      const pl = e.target.closest('[data-play]'); if (pl) { if (cur.playing) { speechSynthesis.cancel(); cur.playing = false; } else { const u = speak(set.script); cur.playing = true; if (u) u.onend = () => { cur.playing = false; const b = $('[data-play]'); if (b) { b.innerHTML = ic('i-play'); $('.player .ttl').textContent = '再听一遍'; } }; } $('[data-play]').innerHTML = ic(cur.playing ? 'i-pause' : 'i-play'); $('.player .ttl').textContent = cur.playing ? '正在朗读…' : '点击播放录音'; return; }
      const rt = e.target.closest('[data-rate]'); if (rt) { S.rate = +rt.dataset.rate; save(); document.querySelectorAll('[data-rate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.rate === S.rate)); return; }
      if (done) return;
      const o = e.target.closest('.opt[data-q]'); if (o) { ans[+o.dataset.q] = +o.dataset.k; return renderSet(); }
      const l = e.target.closest('.letters button[data-q]'); if (l) { ans[+l.dataset.q] = l.dataset.l; return renderSet(); }
      const bl = e.target.closest('[data-blank]'); if (bl) { cur.active = +bl.dataset.blank; return renderSet(); }
      const bk = e.target.closest('[data-bank]'); if (bk && cur.active !== undefined) { Object.keys(ans).forEach((k) => { if (ans[k] === bk.dataset.bank) delete ans[k]; }); ans[cur.active] = bk.dataset.bank; cur.active = Math.min(cur.active + 1, total - 1); return renderSet(); }
      if (e.target.closest('[data-submit]')) submitSet();
    };
    const t = $('#timer'); if (t && t0) { const s = Math.floor((Date.now() - t0) / 1000); t.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
    if (done) clearInterval(timerId);
  }
  function submitSet() {
    const { kind, set, ans } = cur; let r = 0; const wrongs = [];
    if (kind === 'cloze') set.answers.forEach((a, i) => { if (ans[i] === a) r++; else wrongs.push({ key: set.id + ':' + i, src: '选词填空 · ' + set.title, q: `空格 ${i + 1}`, a: a + ' ' + set.exp[i], e: '' }); });
    else if (kind === 'match') set.items.forEach((it, i) => { if (ans[i] === it.a) r++; else wrongs.push({ key: set.id + ':' + i, src: '段落匹配 · ' + set.title, q: it.s, a: it.a + ' 段', e: '' }); });
    else set.questions.forEach((q, i) => { if (ans[i] === q.a) r++; else wrongs.push({ key: set.id + ':' + i, src: (kind === 'listen' ? '听力' : '仔细阅读') + ' · ' + set.title, q: q.q, a: ['A', 'B', 'C', 'D'][q.a] + ' ' + q.opts[q.a], e: q.exp }); });
    const total = kind === 'cloze' ? set.answers.length : kind === 'match' ? set.items.length : set.questions.length;
    cur.done = true; cur.r = r; recordSet(set.id, r, total, wrongs); renderSet(); window.scrollTo(0, 0);
  }

  /* ================= 写译 ================= */
  let wsub = 'write', wsel = 0, tsel = 0, reveal = {};
  function hl(text, phrases) { let h = esc(text); phrases.forEach((p) => { h = h.split(esc(p)).join(`<mark>${esc(p)}</mark>`); }); return h; }
  const HL_W = ['From my perspective', 'To begin with', 'What is more', 'Admittedly', 'Nevertheless', 'Only by weighing both sides carefully can we', 'conveys a profound message', 'There is no denying that', 'by contrast', 'It was their kindness, courage and sense of responsibility that moved people', 'Therefore', 'Only when we are beautiful inside can we', 'I am writing to', 'I would suggest', 'it would be worthwhile to', 'I look forward to your reply'];
  function renderWT(sub) {
    if (sub) { wsub = sub; window.scrollTo(0, 0); }
    const tabs = `<div class="wt-tabs"><button class="chip m-write" data-wsub="write" aria-pressed="${wsub === 'write'}"><span class="dot"></span>写作</button><button class="chip m-trans" data-wsub="trans" aria-pressed="${wsub === 'trans'}"><span class="dot"></span>翻译</button></div>`;
    let body = '';
    if (wsub === 'write') {
      const w = WRITING[wsel];
      body = `<div class="vocab-top">${WRITING.map((x, i) => `<button class="chip m-write" data-wsel="${i}" aria-pressed="${i === wsel}">${esc(x.title.split('·')[0].trim())}</button>`).join('')}</div>
        <div class="prompt m-write"><div class="lab">题目</div>${esc(w.prompt)}</div>
        <div class="sec-h"><span class="ico m-write">${ic('i-target')}</span><h2 style="font-size:16px">提纲</h2></div>
        <div class="steps m-write">${w.outline.map((o, i) => `<div class="st"><span class="n">${i + 1}</span><span>${esc(o)}</span></div>`).join('')}</div>
        <div class="sec-h"><span class="ico m-write">${ic('i-eye')}</span><h2 style="font-size:16px">范文</h2><span class="more">高亮 = 可以抄进模板的句式</span></div>
        <div class="sample m-write">${hl(w.sample, HL_W)}</div>
        <div class="notes m-write">${w.notes.map((n) => `<div class="nt">${ic('i-bulb')}<span>${esc(n)}</span></div>`).join('')}</div>`;
    } else {
      const t = TRANSLATION[tsel]; const shown = !!reveal[t.id];
      body = `<div class="vocab-top">${TRANSLATION.map((x, i) => `<button class="chip m-trans" data-tsel="${i}" aria-pressed="${i === tsel}">${esc(x.title)}</button>`).join('')}</div>
        <div class="prompt m-trans"><div class="lab">汉译英 · ${esc(t.theme)}</div><span class="zh" style="font-family:var(--ui);line-height:1.9">${esc(t.zh)}</span></div>
        <div class="sec-h"><span class="ico m-trans">${ic('i-abc')}</span><h2 style="font-size:16px">关键词</h2></div>
        <div class="keys">${t.keys.map((k) => { const [zh, en] = k.split(/\s(?=[A-Za-z(])/); return `<span class="chip">${esc(en || k)}<i>${esc(zh)}</i></span>`; }).join('')}</div>
        <p class="lead">先自己在纸上译一遍（25 分钟内），再看参考译文。</p>
        <div class="reveal"><button class="btn tone m-trans" data-reveal="${t.id}">${ic('i-eye')}${shown ? '收起参考译文' : '看参考译文'}</button></div>
        ${shown ? `<div class="sample m-trans">${esc(t.en)}</div><div class="notes m-trans">${t.notes.map((n) => `<div class="nt">${ic('i-bulb')}<span>${esc(n)}</span></div>`).join('')}</div>` : ''}`;
    }
    $('#wt-box').innerHTML = tabs + body;
    $('#wt-box').onclick = (e) => {
      const s = e.target.closest('[data-wsub]'); if (s) return renderWT(s.dataset.wsub);
      const a = e.target.closest('[data-wsel]'); if (a) { wsel = +a.dataset.wsel; return renderWT(); }
      const b = e.target.closest('[data-tsel]'); if (b) { tsel = +b.dataset.tsel; return renderWT(); }
      const r = e.target.closest('[data-reveal]'); if (r) { reveal[r.dataset.reveal] = !reveal[r.dataset.reveal]; return renderWT(); }
    };
  }

  /* ================= 我的 ================= */
  function renderMe() {
    const st = stats(); const wrongs = Object.values(S.wrong);
    const unknownWords = ALLWORDS.filter((w) => S.vocab[w.id] === 0 || S.vocab[w.id] === 1);
    $('#me-box').innerHTML = `
      <div class="me-grid">
        <div class="num m-vocab"><div class="v">${st.known}</div><div class="l">认识的词</div></div>
        <div class="num m-vocab" style="--brand:var(--red)"><div class="v" style="color:var(--red)">${unknownWords.length}</div><div class="l">生词本</div></div>
        <div class="num m-read"><div class="v">${st.setsDone}</div><div class="l">做过的练习</div></div>
        <div class="num m-listen"><div class="v">${st.acc === null ? '—' : st.acc + '%'}</div><div class="l">练习正确率</div></div>
        <div class="num m-exam"><div class="v">${st.m}/${totalPts}</div><div class="l">考点已掌握</div></div>
      </div>
      <div class="sec-h"><span class="ico m-vocab">${ic('i-abc')}</span><h2>生词本</h2>${unknownWords.length ? `<button class="more" data-go-vocab>去复习 ${ic('i-chev-r')}</button>` : ''}</div>
      ${unknownWords.length ? `<div class="vocab-list">${unknownWords.map((w) => `<div class="vw unknown"><span class="w">${esc(w.w)}</span><span class="pos">${esc(w.p)}</span><span class="cn">${esc(w.c)}</span></div>`).join('')}</div>` : `<div class="empty">${ic('i-party')}还没有生词。去"单词"页刷闪卡，点"不认识"的会收进来。</div>`}
      <div class="sec-h"><span class="ico m-read">${ic('i-x')}</span><h2>错题本</h2>${wrongs.length ? `<button class="more" data-clear>清空</button>` : ''}</div>
      ${wrongs.length ? wrongs.map((w) => `<div class="wrong-item"><div class="src">${esc(w.src)}</div><div class="q">${esc(w.q)}</div><div class="a">答案：${esc(w.a)}</div>${w.e ? `<div class="e">${esc(w.e)}</div>` : ''}</div>`).join('') : `<div class="empty">${ic('i-party')}还没有错题。</div>`}`;
    $('#me-box').onclick = (e) => {
      if (e.target.closest('[data-go-vocab]')) { vmode = 'review'; vq = []; show('vocab'); }
      if (e.target.closest('[data-clear]') && confirm('清空错题本？')) { S.wrong = {}; save(); renderMe(); }
    };
  }

  /* ---------- 启动 ---------- */
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  const start = location.hash.slice(1); show(VIEWS.includes(start) ? start : 'home');
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
