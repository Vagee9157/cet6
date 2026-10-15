/* 在线模考：网页上做一整套六级卷，和打印版 paper.html 同结构同题量（抽题共用 assets/draw.js，同一卷号同一套题）。
 * 流程照真考：Part I 写作 30 分钟 → Part II 听力 30 分钟（各段录音按顺序各放一遍，带题目播报和作答停顿）→ Part III 阅读 40 分钟 → Part IV 翻译 30 分钟。
 * 进行中的模考存在 S.exam（卷号、题目 id、当前部分、各部分剩余秒数、作答、听力播放位置），刷新 / 关页后可继续；
 * 倒计时只在模考页开着时走（页面切到后台且没在放录音时暂停）。
 * 交卷后听力、阅读自动判分，写作、翻译看范文自评档次，按官方结构折成 710 分；成绩存 S.exams，各篇记进 S.sets / S.hist / S.wrong。
 * 用到 app.js 的工具函数都经 window.CET6（app.js 末尾暴露），本文件在 app.js 之前加载，只在运行时取用。 */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const C = () => window.CET6;
  const esc = (t) => C().esc(t), ic = (n) => C().ic(n);
  const K = ['A', 'B', 'C', 'D'];
  const PARTS = [
    { k: 'write', no: 'I', n: '写作', en: 'Writing', min: 30, mod: 'm-write' },
    { k: 'listen', no: 'II', n: '听力', en: 'Listening Comprehension', min: 30, mod: 'm-listen' },
    { k: 'read', no: 'III', n: '阅读', en: 'Reading Comprehension', min: 40, mod: 'm-read' },
    { k: 'trans', no: 'IV', n: '翻译', en: 'Translation', min: 30, mod: 'm-trans' },
  ];
  // 710 分换算：标准题量 × 每题分值（听力 长对话 8×7.1 / 篇章 7×7.1 / 讲座 10×14.2；阅读 选词 10×3.55 / 匹配 10×7.1 / 仔细 10×14.2）
  // 抽到的题量和标准不同时，该题型满分不变，按答对比例折算
  const STD = { conv: { n: 8, pt: 7.1, name: '长对话' }, pas: { n: 7, pt: 7.1, name: '听力篇章' }, lec: { n: 10, pt: 14.2, name: '讲座 / 讲话' }, cloze: { n: 10, pt: 3.55, name: '选词填空' }, match: { n: 10, pt: 7.1, name: '段落匹配' }, mc: { n: 10, pt: 14.2, name: '仔细阅读' } };
  const SEC_L = { conv: ['Section A', '长对话'], pas: ['Section B', '听力篇章'], lec: ['Section C', '讲座 / 讲话'] };
  const W_BANDS = [
    [14, [13, 14, 15], '切题；思想表达清楚，文字通顺、连贯，基本无语言错误，仅有个别小错'],
    [11, [10, 11, 12], '切题；思想表达清楚，文字较连贯，但有少量语言错误'],
    [8, [7, 8, 9], '基本切题；有些地方表达不够清楚，文字勉强连贯；语言错误相当多，其中有一些严重错误'],
    [5, [4, 5, 6], '基本切题；表达思想不清楚，连贯性差；有较多严重语言错误'],
    [2, [1, 2, 3], '条理不清，思路紊乱；语言支离破碎，或大部分句子有错且多为严重错误'],
  ];
  const T_BANDS = [
    [14, [13, 14, 15], '准确表达原文意思；用词贴切，行文流畅，基本无语言错误，仅有个别小错'],
    [11, [10, 11, 12], '基本表达原文意思；结构较清晰，语言较通顺，但有少量语言错误'],
    [8, [7, 8, 9], '勉强表达原文意思；用词欠准确，语言错误相当多，其中有一些严重错误'],
    [5, [4, 5, 6], '仅表达了一小部分原文意思；用词不准确，有相当多的严重语言错误'],
    [2, [1, 2, 3], '译文支离破碎；除个别词句外，绝大部分没有表达原文意思'],
  ];
  const fmt1 = (v) => String(Math.round(v * 10) / 10);
  const clock = (s) => { s = Math.max(0, Math.ceil(s)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const mss = (x) => { x = Math.max(0, Math.floor(x || 0)); return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`; };

  let mode = 'home', repTs = 0, presetSeed = 0, nextSeed = 0, nextKey = '', homeReplay = false, P = null, pKey = '';
  let tickId = 0, lastTick = 0, saveAt = 0, taT = 0, confirmAt = 0, confirmT = 0, clozeActive = -1, repY = 0;

  /* ---------- 卷面：题号 / 分节 ---------- */
  function build(ids) {
    const d = CET6Draw.fromIds(ids); if (!d) return null;
    let n = 0; const L = [];
    [['conv', d.conv], ['pas', d.pas], ['lec', d.lec]].forEach(([sec, xs]) => xs.forEach((set) => { L.push({ sec, set, n0: n + 1 }); n += set.questions.length; }));
    const nL = n, R = [];
    const addR = (key, kind, set, t, lab) => { R.push({ key, kind, set, t, n0: n + 1, lab }); n += t; };
    addR('cloze', 'cloze', d.cloze, d.cloze.answers.length, ['Section A', '选词填空']);
    addR('match', 'match', d.match, d.match.items.length, ['Section B', '段落匹配']);
    d.mc.forEach((s, i) => addR('mc' + i, 'mc', s, s.questions.length, ['Section C', `仔细阅读 ${['One', 'Two', 'Three'][i]}`]));
    return { d, L, nL, R, nR: n - nL };
  }
  const paper = (ids) => { const k = ids.join(','); if (k !== pKey) { P = build(ids); pKey = k; } return P; };
  const marks = (kind, set, ans) => C().marksOf({ kind, set, ans: ans || {} });
  // 各题型对错与 710 分换算
  function scoreOf(Pp, ans, self) {
    const sec = {};
    const add = (k, ms) => { const v = sec[k] || (sec[k] = { r: 0, t: 0 }); v.r += ms.filter(Boolean).length; v.t += ms.length; };
    Pp.L.forEach((x, si) => add(x.sec, marks('listen', x.set, ans.L[si])));
    Pp.R.forEach((x) => add(x.kind, marks(x.kind, x.set, ans.R[x.key])));
    Object.entries(sec).forEach(([k, v]) => { const st = STD[k]; v.max = st.n * st.pt; v.pts = v.t ? v.max * v.r / v.t : 0; v.per = v.t ? v.max / v.t : 0; v.odd = v.t !== st.n; });
    const sum = (ks) => ks.reduce((a, k) => a + (sec[k] ? sec[k].pts : 0), 0);
    const parts = { listen: sum(['conv', 'pas', 'lec']), read: sum(['cloze', 'match', 'mc']), write: (self.write || 0) * 7.1, trans: (self.trans || 0) * 7.1 };
    Object.keys(parts).forEach((k) => { parts[k] = Math.round(parts[k] * 10) / 10; });
    return { sec, parts, total: Math.round(parts.listen + parts.read + parts.write + parts.trans) };
  }

  /* ---------- 听力录音：每段整条文件（原文 + 题目播报 + 每题 12 秒停顿），按顺序各放一遍 ---------- */
  const AX = new Audio(); AX.preload = 'auto';
  let axSi = -1, axReplay = false, axNextT = 0;
  const E = () => C().S.exam;
  const audOf = (si) => P && P.L[si] && C().AUD(P.L[si].set.id);
  // 整个文件取下来再播（同听读页）：离线缓存能存住，刷新后能跳回上次的位置继续
  let axUrl = null, axLoadN = 0, axPending = null;
  function axLoad(si, t) { axPending = axLoad0(si, t); const p = axPending; p.then(() => { if (axPending === p) axPending = null; }); return p; }
  async function axLoad0(si, t) {
    const m = audOf(si); axSi = si; if (!m) return false;
    const n = ++axLoadN; AX.pause();
    if (axUrl) { URL.revokeObjectURL(axUrl); axUrl = null; }
    let src = m.src;
    try { const r = await fetch(m.src); if (!r.ok) throw 0; const u = URL.createObjectURL(await r.blob()); if (n !== axLoadN) { URL.revokeObjectURL(u); return false; } axUrl = src = u; } catch {}
    if (n !== axLoadN) return false;
    AX.src = src; AX.playbackRate = 1;
    if (t > 0.5) await new Promise((res) => { AX.addEventListener('loadedmetadata', () => { try { AX.currentTime = t; } catch {} res(); }, { once: true }); setTimeout(res, 4000); });
    return n === axLoadN;
  }
  function firstUnplayed(from) { const e = E(); for (let i = from; i < P.L.length; i++) if (!e.lis.played[i]) return i; return -1; }
  async function axPlay() {
    const e = E(); if (!e) return;
    clearTimeout(axNextT);
    if (!AX.paused) { AX.pause(); return; }
    if (axReplay && AX.src && AX.currentTime > 0 && !AX.ended) { AX.play().catch(() => {}); return; }
    if (e.lis.done) return;
    axReplay = false; e.lis.started = true; paintLis();
    // 进入听力部分时已预载当前段，这里同步 play（iOS 要求在点击里直接播放）；还没载完就等它载完
    if (axSi === e.lis.i && axPending) { if (!(await axPending)) return; }
    else if (axSi !== e.lis.i || !AX.src) { const si = e.lis.i; if (!audOf(si)) { e.lis.played[si] = 1; axSi = si; return axEnded(); } if (!(await axLoad(si, e.lis.t))) return; }
    AX.play().catch(() => {});
  }
  async function axReplaySet(si) { const e = E(); if (!e || !e.replay) return; clearTimeout(axNextT); AX.pause(); axReplay = true; paintLis(); if (await axLoad(si, 0)) AX.play().catch(() => {}); }
  function axEnded() {
    const e = E(); if (!e || !P) return;
    if (axReplay) { axReplay = false; axSi = -1; paintLis(); return; }
    e.lis.played[axSi] = 1; e.lis.t = 0;
    const nx = firstUnplayed(axSi + 1);
    if (nx < 0) { e.lis.done = true; e.lis.i = P.L.length; C().save(); paintLis(); return; }
    e.lis.i = nx; C().save(); paintLis();
    // 段与段之间停 2 秒，再自动放下一段
    axNextT = setTimeout(async () => {
      if (mode !== 'exam' || !E() || E().part !== 1 || $('#view-exam').hidden) return;
      if (!audOf(nx)) { e.lis.played[nx] = 1; axSi = nx; axEnded(); return; }
      const b = $('#exL' + nx); if (b) b.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (await axLoad(nx, 0) && mode === 'exam' && E() && E().part === 1 && !$('#view-exam').hidden) AX.play().catch(() => {});
    }, 2000);
  }
  AX.addEventListener('ended', axEnded);
  AX.addEventListener('timeupdate', () => { const e = E(); if (!e || axReplay) { paintLis(); return; } if (axSi === e.lis.i) e.lis.t = AX.currentTime; paintLis(); });
  ['play', 'pause', 'loadedmetadata'].forEach((ev) => AX.addEventListener(ev, paintLis));
  function lisState() {
    const e = E(); const n = P.L.length;
    if (axReplay) return { ttl: `${AX.paused ? '已暂停' : '重听'} · 第 ${axSi + 1} 段`, si: axSi };
    if (e.lis.done) return { ttl: '录音已全部播完，检查答案后交本部分', si: -1 };
    const i = e.lis.i, x = P.L[i];
    if (!e.lis.started) return { ttl: `点这里开始播放听力（共 ${n} 段）`, si: i };
    return { ttl: `${AX.paused ? '已暂停 · ' : ''}第 ${i + 1}/${n} 段 · ${SEC_L[x.sec][0]} ${SEC_L[x.sec][1]}`, si: i };
  }
  function paintLis() {
    const e = E(); if (!e || !P || mode !== 'exam' || e.part !== 1) return;
    const st = lisState();
    const b = $('#exAuBtn'); if (b) b.innerHTML = ic(AX.paused ? 'i-play' : 'i-pause');
    const tt = $('#exAuTtl'); if (tt) tt.textContent = st.ttl;
    const dur = AX.duration || (audOf(st.si) || {}).dur || 0, cur = axSi === st.si ? AX.currentTime : (e.lis.t || 0);
    const tm = $('#exAuTm'); if (tm) tm.textContent = st.si >= 0 && dur ? `${mss(cur)} / ${mss(dur)}` : '';
    const bar = $('#exAuBar'); if (bar) bar.style.width = (st.si >= 0 && dur ? Math.min(100, cur / dur * 100) : e.lis.done ? 100 : 0) + '%';
    document.querySelectorAll('#exam-box .ex-lset').forEach((el) => {
      const si = +el.dataset.si, on = si === st.si && (e.lis.started || axReplay);
      el.classList.toggle('on', on);
      const s = el.querySelector('.ex-lst'); if (s) s.textContent = on && !AX.paused ? '正在播放' : on ? '当前' : e.lis.played[si] ? '已播放' : '未播放';
    });
  }

  /* ---------- 计时 ---------- */
  function startTick() { clearInterval(tickId); lastTick = Date.now(); tickId = setInterval(onTick, 1000); }
  function onTick() {
    const e = E(), now = Date.now(); let dt = (now - lastTick) / 1000; lastTick = now;
    if (!e || mode !== 'exam' || $('#view-exam').hidden) return;
    if (document.visibilityState === 'hidden' && AX.paused) return;
    if (dt > 5 && AX.paused) dt = 1;
    e.left[e.part] = Math.max(0, e.left[e.part] - dt);
    paintClock();
    if (now - saveAt > 5000) { saveAt = now; C().save(); }
    if (e.left[e.part] <= 0) advance(true);
  }
  function paintClock() {
    const e = E(); const el = $('#exClock'); if (!e || !el) return;
    const s = e.left[e.part]; el.textContent = clock(s); el.classList.toggle('warn', s <= 300 && s > 60); el.classList.toggle('end', s <= 60);
    const pg = $('#exProg'); if (pg) pg.innerHTML = progHTML(e);
  }
  const words = (t) => C().enWords(t);
  const cntL = (e) => P.L.reduce((n, x, si) => n + Object.keys(e.ans.L[si] || {}).length, 0);
  const cntR = (e) => P.R.reduce((n, x) => n + Object.keys(e.ans.R[x.key] || {}).length, 0);
  function progHTML(e) {
    const k = PARTS[e.part].k;
    if (k === 'listen') return `已答 <b>${cntL(e)}</b>/${P.nL}`;
    if (k === 'read') return `已答 <b>${cntR(e)}</b>/${P.nR}`;
    return `<b>${words(e.ans[k])}</b> 词`;
  }

  /* ---------- 开始 / 换部分 / 交卷 ---------- */
  function newExam(seed) {
    const S = C().S; const fresh = S.drawFresh !== false;
    const p = CET6Draw.paperOf(seed, S, fresh);
    S.exam = { seed: +seed, ids: p.ids, fresh: p.fresh, d: C().lday(), ts: Date.now(), part: 0, left: PARTS.map((x) => x.min * 60), ans: { write: '', trans: '', L: {}, R: {} }, lis: { i: 0, t: 0, played: [], started: false, done: false }, replay: homeReplay, stem: false, rsec: 'cloze', note: '' };
    presetSeed = 0; nextSeed = 0; axSi = -1; axReplay = false; AX.pause(); AX.removeAttribute('src');
    C().save(); mode = 'exam'; render(); window.scrollTo(0, 0);
  }
  function advance(auto) {
    const e = E(); if (!e) return; const p = PARTS[e.part];
    if (p.k === 'listen') { clearTimeout(axNextT); AX.pause(); axReplay = false; }
    if (e.part === 3) return finish(auto);
    e.part++; const q = PARTS[e.part];
    e.note = auto ? `Part ${p.no} ${p.n}时间到，已自动进入 Part ${q.no} ${q.n}。` : '';
    C().save(); render(); window.scrollTo(0, 0);
  }
  function finish(auto) {
    const S = C().S, e = S.exam; if (!e) return;
    clearTimeout(axNextT); AX.pause(); clearInterval(tickId);
    const Pp = build(e.ids);
    if (!Pp) { delete S.exam; C().save(); mode = 'home'; return render(); }
    // 听力 / 阅读各篇：记进 S.sets（做过）、S.hist（练习记录）、S.wrong（错题，格式与练习交卷一致）
    const rec1 = (kind, set, ans) => { const ms = marks(kind, set, ans); const { wrongs, rights } = C().wrongsOf(kind, set, ans || {}); wrongs.forEach((w) => { w.exam = e.seed; }); C().recordSet(set.id, ms.filter(Boolean).length, ms.length, wrongs, rights); };
    Pp.L.forEach((x, si) => rec1('listen', x.set, e.ans.L[si]));
    Pp.R.forEach((x) => rec1(x.kind, x.set, e.ans.R[x.key]));
    // 作文 / 译文：写译页对应题目还空着就存进去（写译页也算写过）
    S.wt = S.wt || {};
    if (e.ans.write.trim() && !(S.wt[Pp.d.W.id] || '').trim()) S.wt[Pp.d.W.id] = e.ans.write;
    if (e.ans.trans.trim() && !(S.wt[Pp.d.T.id] || '').trim()) S.wt[Pp.d.T.id] = e.ans.trans;
    const rec = { seed: e.seed, d: C().lday(), ts: Date.now(), start: e.ts, ids: e.ids.slice(), fresh: e.fresh, ans: e.ans, self: { write: null, trans: null }, used: PARTS.map((p, i) => Math.round(p.min * 60 - e.left[i])), auto: !!auto };
    const sc = scoreOf(Pp, rec.ans, rec.self); rec.total = sc.total; rec.parts = sc.parts;
    S.exams = Array.isArray(S.exams) ? S.exams : []; S.exams.push(rec); if (S.exams.length > 60) S.exams = S.exams.slice(-60);
    CET6Draw.recordPaper(e.seed, 'online', e.ids, e.fresh, S);
    delete S.exam; C().save();
    mode = 'report'; repTs = rec.ts; nextSeed = 0; render(); window.scrollTo(0, 0);
  }
  const repOf = (ts) => (C().S.exams || []).find((x) => x.ts === ts);

  /* ---------- 模考首页 ---------- */
  function lastIds() { const S = C().S; if (S.exam) return S.exam.ids; const xs = S.exams || []; return xs.length ? xs[xs.length - 1].ids : []; }
  function getNext() {
    const S = C().S, fresh = S.drawFresh !== false, k = (fresh ? 1 : 0) + ':' + lastIds().join(',') + ':' + Object.keys(S.sets).length;
    if (!nextSeed || k !== nextKey) { nextSeed = CET6Draw.pickSeed(lastIds(), S, fresh); nextKey = k; }
    return nextSeed;
  }
  function renderHome() {
    const S = C().S, e = S.exam, exams = (S.exams || []).slice().reverse();
    if (e) paper(e.ids);
    const nx = getNext();
    const tiles = PARTS.map((p, i) => `<div class="ex-tile ${p.mod}"><span class="no">Part ${p.no}</span><b>${p.n}</b><span>${p.min} 分钟 · ${['1 篇 · 106.5', '25 题 · 248.5', '30 题 · 248.5', '1 段 · 106.5'][i]}</span></div>`).join('');
    const cont = e ? `<div class="ex-cont card m-exam"><div class="tx"><span class="kind">进行中的模考</span><b>卷号 ${esc(e.seed)} · Part ${PARTS[e.part].no} ${PARTS[e.part].n}</b><span>本部分还剩 ${clock(e.left[e.part])} · 开始于 ${esc(e.d)}</span></div>
      <div class="acts"><button class="btn primary" data-excont>${ic('i-play')}继续上次模考</button><a class="btn ghost" href="paper.html?seed=${encodeURIComponent(e.seed)}">${ic('i-pen')}打印这套</a><button class="btn ghost" data-exquit>${ic('i-x')}放弃</button></div></div>` : '';
    const box = $('#exam-box');
    box.innerHTML = `<div class="ex-wrap ex-home">
      <div class="sec-h" style="margin-top:4px"><span class="ico m-exam">${ic('i-clip')}</span><h2>在线模考</h2><span class="more">${exams.length ? `做过 ${exams.length} 套` : '130 分钟 · 710 分'}</span></div>
      <div class="card ex-intro m-exam">
        <p>和真题、打印版同结构同题量，按真考顺序一部分一部分做，每部分单独倒计时，到点自动进入下一部分。</p>
        <div class="ex-tiles">${tiles}</div>
        <ul class="ex-rules">
          <li><b>听力</b>每段录音按顺序只放一遍，原文后按真题格式播报题目、每题留 12 秒作答（可开「练习模式」允许重听）。</li>
          <li><b>计分</b>听力、阅读自动判分，按官方题型分值折算（讲座、仔细阅读每题 14.2，长对话、篇章、段落匹配 7.1，选词填空 3.55）；写作、翻译交卷后对照范文自评档次（15 分制 × 7.1）。</li>
          <li><b>保存</b>作答实时存在本机，刷新、关掉页面后点「继续上次模考」接着做（离开模考页时倒计时暂停）。</li>
        </ul>
      </div>
      ${cont}
      <div class="card ex-start">
        <div class="ex-start-h"><div><b>${e ? '开一套新的' : '开始一套新模考'}</b><span>卷号 <code>${esc(presetSeed || nx)}</code>${presetSeed ? '（打印版带过来的）' : exams.length || e ? '（和上一套零重合）' : ''} · <a href="paper.html?seed=${encodeURIComponent(presetSeed || nx)}">打印这套</a></span></div>
          <button class="btn primary" data-exnew="${esc(presetSeed || nx)}">${ic('i-clip')}${e ? '放弃进行中的，开始新模考' : '开始新模考'}</button></div>
        <div class="ex-opts">
          <label><input type="checkbox" data-exfresh ${S.drawFresh !== false ? 'checked' : ''}> 优先抽没做过的题</label>
          <label><input type="checkbox" data-exhreplay ${homeReplay ? 'checked' : ''}> 练习模式：听力允许重听</label>
        </div>
        <div class="ex-seed"><label for="exSeed">按卷号做</label><input id="exSeed" class="search" inputmode="numeric" maxlength="8" placeholder="输入卷号，如打印版上的试卷代号" value="${presetSeed ? esc(presetSeed) : ''}"><button class="btn" data-exseed>开始</button></div>
        <p class="ex-tip" id="exTip"></p>
      </div>
      <div class="sec-h"><span class="ico m-exam">${ic('i-timer')}</span><h2>历次模考成绩</h2>${exams.length ? `<span class="more">最高 ${Math.max(...exams.map((x) => x.total))}</span>` : ''}</div>
      ${exams.length ? `<div class="ex-hlist">${exams.map((x) => `<button class="ex-hrow card" data-exrep="${x.ts}"><span class="ex-ht"><b>${x.total}</b><small>/710</small></span><span class="ex-hm"><b>${esc(x.d)} · 卷号 ${esc(x.seed)}</b><span>听力 ${fmt1(x.parts.listen)} · 阅读 ${fmt1(x.parts.read)} · 写作 ${x.self.write == null ? '待自评' : fmt1(x.parts.write)} · 翻译 ${x.self.trans == null ? '待自评' : fmt1(x.parts.trans)}</span></span><span class="ex-hgo">查看报告${ic('i-chev-r')}</span></button>`).join('')}</div>`
        : `<div class="empty">${ic('i-party')}还没做过模考。留出完整 130 分钟，戴上耳机开始吧。</div>`}
    </div>`;
    box.onclick = (ev) => {
      const t = ev.target;
      if (t.closest('[data-excont]')) { mode = 'exam'; render(); window.scrollTo(0, 0); return; }
      const qb = t.closest('[data-exquit]'); if (qb) { if (twoStep(qb, '再点一次放弃（作答会清掉）')) { delete C().S.exam; C().save(); nextSeed = 0; render(); } return; }
      const nb = t.closest('[data-exnew]'); if (nb) { if (!C().S.exam || twoStep(nb, '再点一次确认放弃进行中的')) newExam(+nb.dataset.exnew); return; }
      if (t.closest('[data-exseed]')) {
        const v = $('#exSeed').value.trim(); const tip = $('#exTip');
        if (!/^\d{1,8}$/.test(v) || !+v) { tip.textContent = '卷号是 1–8 位数字。'; return; }
        if (C().S.exam && !twoStep(t.closest('[data-exseed]'), '再点放弃进行中的')) return;
        newExam(+v); return;
      }
      const rp = t.closest('[data-exrep]'); if (rp) { openReport(+rp.dataset.exrep); }
    };
    box.onchange = (ev) => {
      if (ev.target.matches('[data-exfresh]')) { C().S.drawFresh = ev.target.checked; C().save(); nextSeed = 0; presetSeed = 0; render(); }
      if (ev.target.matches('[data-exhreplay]')) homeReplay = ev.target.checked;
    };
  }
  // 两步确认：第一次点按钮换成提示文字，4 秒内再点才执行
  function twoStep(btn, txt) {
    if (btn.dataset.armed && Date.now() - +btn.dataset.armed < 4000) return true;
    btn.dataset.armed = Date.now(); const old = btn.innerHTML; btn.innerHTML = esc(txt); btn.classList.add('armed');
    setTimeout(() => { if (btn.isConnected) { btn.innerHTML = old; btn.classList.remove('armed'); delete btn.dataset.armed; } }, 4000);
    return false;
  }

  /* ---------- 考试页 ---------- */
  function renderExam() {
    const e = E(); const Pp = paper(e.ids);
    if (!Pp) { delete C().S.exam; C().save(); mode = 'home'; return render(); }
    const p = PARTS[e.part];
    const last = e.part === 3;
    const bar = `<div class="ex-bar ${p.mod}" id="exBar"><div class="ex-bar-in">
        <div class="ex-pt"><span class="ex-pno">Part ${p.no} · ${e.part + 1}/4</span><b>${p.n}</b></div>
        <div class="ex-cl"><span class="ex-clock" id="exClock">${clock(e.left[e.part])}</span><span class="ex-prog" id="exProg">${progHTML(e)}</span></div>
        <button class="btn tone ex-next" data-exnext>${last ? '交卷' : '交本部分'}</button></div>
        <div class="ex-steps" aria-hidden="true">${PARTS.map((x, i) => `<i class="${i < e.part ? 'done' : i === e.part ? 'on' : ''}"></i>`).join('')}</div></div>`;
    const note = e.note ? `<div class="ex-note">${ic('i-timer')}<span>${esc(e.note)}</span><button class="x" data-exnote aria-label="知道了">${ic('i-x')}</button></div>` : '';
    let body = '';
    if (p.k === 'write') body = writeHTML(e, Pp);
    else if (p.k === 'listen') body = listenHTML(e, Pp);
    else if (p.k === 'read') body = `<div id="exRd">${readHTML(e, Pp)}</div>`;
    else body = transHTML(e, Pp);
    const foot = `<div class="ex-foot"><span>${last ? '翻译写完就交卷：听力、阅读自动判分，写作、翻译对照范文自评。' : `做完可以提前交本部分，进入 Part ${PARTS[e.part + 1].no} ${PARTS[e.part + 1].n}；交了不能回头改。`}</span><button class="btn tone ${p.mod}" data-exnext>${last ? '交卷' : '交本部分，进入下一部分'}${ic('i-chev-r')}</button></div>`;
    const box = $('#exam-box');
    box.innerHTML = `<div class="ex-wrap ex-on ex-p-${p.k}">${bar}${note}${body}${foot}</div>`;
    box.onclick = onExamClick; box.oninput = onExamInput; box.onchange = null;
    sizeBar(); startTick();
    if (p.k === 'listen') { if (!e.lis.done && axSi !== e.lis.i && !axReplay) axLoad(e.lis.i, e.lis.t); paintLis(); }
  }
  // 吸顶条高度写进 CSS 变量，选词填空的词库、宽屏阅读的文章栏贴在它下面
  function sizeBar() { const b = $('#exBar'), w = $('#exam-box .ex-wrap'); if (b && w) w.style.setProperty('--exbar', b.offsetHeight + 'px'); }
  window.addEventListener('resize', () => { if (mode === 'exam') sizeBar(); });

  const dirP = (zh) => `<p class="lead ex-dir">${zh}</p>`;
  const promptEn = (t) => esc(t).replace(/^Directions:/, '<b>Directions:</b>');
  function countHTML(text, isW) {
    const n = words(text);
    if (!isW) return `<b>${n}</b> 词`;
    const st = !n ? '' : n < 150 ? 'lo' : n > 200 ? 'hi' : 'ok';
    return `<b class="${st}">${n}</b> 词<span class="wt-hint">${st === 'ok' ? '已在 150–200 词区间' : st === 'hi' ? '超过 200 词' : n ? `还差 ${150 - n} 词到 150` : '要求 150–200 词'}</span>`;
  }
  function writeHTML(e, Pp) {
    const W = Pp.d.W;
    return `<div class="ex-col">
      <div class="prompt m-write"><div class="lab">Part I · Writing（30 分钟）</div>${promptEn(W.prompt)}${W.chart && window.writingChart ? window.writingChart(W.chart) : ''}</div>
      <div class="wt-ans m-write"><div class="wt-bar"><span class="lab">我的作文</span></div>
        <textarea class="wt-ta" data-exta="write" rows="14" spellcheck="false" autocapitalize="sentences" placeholder="先花 3–5 分钟列提纲，再写 150–200 词……">${esc(e.ans.write)}</textarea>
        <div class="wt-count" id="exCount">${countHTML(e.ans.write, true)}</div></div></div>`;
  }
  function transHTML(e, Pp) {
    const T = Pp.d.T;
    return `<div class="ex-col">
      <div class="prompt m-trans"><div class="lab">Part IV · Translation（30 分钟）</div><p class="ex-dirr"><b>Directions:</b> For this part, you are allowed 30 minutes to translate a passage from Chinese into English.</p><span class="zh">${esc(T.zh)}</span></div>
      <div class="wt-ans m-trans"><div class="wt-bar"><span class="lab">我的译文</span></div>
        <textarea class="wt-ta" data-exta="trans" rows="12" spellcheck="false" autocapitalize="sentences" placeholder="长句拆短、意思译全，在这里写译文……">${esc(e.ans.trans)}</textarea>
        <div class="wt-count" id="exCount">${countHTML(e.ans.trans, false)}</div></div></div>`;
  }
  function listenHTML(e, Pp) {
    const total = Pp.L.reduce((a, x) => a + ((audOf(Pp.L.indexOf(x)) || {}).dur || 0), 0);
    const player = `<div class="player au ex-player">
      <button class="play" id="exAuBtn" data-explay aria-label="播放 / 暂停">${ic(AX.paused ? 'i-play' : 'i-pause')}</button>
      <div class="ttl"><span id="exAuTtl"></span><span class="tm" id="exAuTm"></span></div>
      <div class="seek${e.replay ? '' : ' locked'}"${e.replay ? ' data-exseek' : ''}><i id="exAuBar"></i></div>
      <div class="ctl"><button class="chip" data-exreplay aria-pressed="${!!e.replay}">练习模式：允许重听</button><button class="chip" data-exstem aria-pressed="${!!e.stem}">显示题干</button></div>
      <div class="note">共 ${Pp.L.length} 段、${Pp.nL} 题，录音约 ${Math.round(total / 60)} 分钟。每段只放一遍，原文后播报题目、每题停 12 秒，段与段之间自动接着放；可以暂停，不能拖动和重听${e.replay ? '（已开练习模式：可拖动、可重听）' : ''}。录音里每段的题号从 Question 1 数起，对应本卷题号见各段标题。</div></div>`;
    let lastSec = '', html = '';
    Pp.L.forEach((x, si) => {
      if (x.sec !== lastSec) {
        lastSec = x.sec; const xs = Pp.L.filter((y) => y.sec === x.sec); const nq = xs.reduce((a, y) => a + y.set.questions.length, 0);
        const dz = { conv: `${xs.length} 段长对话，每段后播报 ${[...new Set(xs.map((y) => y.set.questions.length))].join(' / ')} 道题`, pas: `${xs.length} 篇短文，每篇后播报 ${[...new Set(xs.map((y) => y.set.questions.length))].join(' / ')} 道题`, lec: `${xs.length} 段讲座 / 讲话，每段后播报 ${[...new Set(xs.map((y) => y.set.questions.length))].join(' / ')} 道题` }[x.sec];
        html += `<div class="sec-h ex-lsec"><span class="ico m-listen">${ic('i-ear')}</span><h2>${SEC_L[x.sec][0]}</h2><span class="more">${SEC_L[x.sec][1]} · ${nq} 题</span></div>${dirP(`${dz}。听到题目后从 A、B、C、D 中选出最佳答案。`)}`;
      }
      const qs = x.set.questions, n1 = x.n0 + qs.length - 1, a = e.ans.L[si] || {};
      html += `<div class="ex-lset" id="exL${si}" data-si="${si}"><div class="ex-lh"><b>Questions ${x.n0}–${n1}</b><span class="ex-lsub">第 ${si + 1} 段</span><span class="ex-lst"></span>${e.replay ? `<button class="chip" data-explayset="${si}">${ic('i-redo')}重听这段</button>` : ''}</div>
        <div class="q-list">${qs.map((q, qi) => `<div class="q m-listen"><div class="qt"><span class="n">${x.n0 + qi}</span><span>${e.stem ? esc(q.q) : `<span class="ex-qno">录音 Question ${qi + 1}</span>`}</span></div><div class="opts">${q.opts.map((o, k) => `<button class="opt${a[qi] === k ? ' picked' : ''}" data-exl="${si}:${qi}" data-k="${k}"><span class="k">${K[k]}</span><span>${esc(o)}</span></button>`).join('')}</div></div>`).join('')}</div></div>`;
    });
    return `<div class="ex-col ex-lis">${player}${html}</div>`;
  }
  const clozeWord = (set, L) => C().clozeWord(set, L);
  function readHTML(e, Pp) {
    const cur = Pp.R.find((x) => x.key === e.rsec) || Pp.R[0];
    const ans = e.ans.R[cur.key] || {};
    const tabs = `<div class="ex-rtabs">${Pp.R.map((x) => { const n = Object.keys(e.ans.R[x.key] || {}).length; return `<button class="chip m-read${n >= x.t ? ' full' : ''}" data-exrsec="${x.key}" aria-pressed="${x.key === cur.key}"><span class="s">${x.lab[0]}</span>${esc(x.lab[1])}<span class="c">${n}/${x.t}</span></button>`; }).join('')}</div>`;
    const qb = `<p class="qb">Questions ${cur.n0}–${cur.n0 + cur.t - 1}</p>`;
    let body = '';
    if (cur.kind === 'cloze') {
      const set = cur.set; const used = new Set(Object.values(ans));
      if (clozeActive < 0 || clozeActive >= cur.t) { clozeActive = 0; while (clozeActive < cur.t - 1 && ans[clozeActive]) clozeActive++; }
      const html = esc(set.text).replace(/\[(\d+)\]/g, (m, i) => { i = +i - 1; const p = ans[i]; const cls = 'blank' + (clozeActive === i ? ' active' : p ? ' filled' : ''); return `<button class="${cls}" data-exblank="${i}">${cur.n0 + i}${p ? ' · ' + p + ' ' + esc(clozeWord(set, p)) : ''}</button>`; });
      body = `${dirP('选词填空：先点空格，再点词库里的词；点已填的空可以改。每个词最多用一次。')}${qb}
        <div class="bank">${set.bank.map((b) => `<button class="chip ${used.has(b[0]) ? 'used' : ''}" data-exbank="${b[0]}">${esc(b)}</button>`).join('')}</div>
        <div class="passage">${html.split('\n').filter((x) => x.trim()).map((x) => `<p>${x}</p>`).join('')}</div>`;
    } else if (cur.kind === 'match') {
      const set = cur.set;
      body = `${dirP('段落匹配：每句话的信息出自哪一段，点段落字母；同一段可以选多次。')}${qb}<div class="ex-rd split">
        <div class="passage">${set.paras.map(([l, x]) => `<p><span class="pl">${esc(l)}</span>${esc(x)}</p>`).join('')}</div>
        <div class="q-list">${set.items.map((it, i) => `<div class="q m-read"><div class="qt"><span class="n">${cur.n0 + i}</span><span>${esc(it.s)}</span></div><div class="letters">${set.paras.map(([l]) => `<button class="${ans[i] === l ? 'picked' : ''}" data-exm="${i}" data-l="${esc(l)}">${esc(l)}</button>`).join('')}</div></div>`).join('')}</div></div>`;
    } else {
      const set = cur.set;
      body = `${dirP('仔细阅读：读文章，每题选出最佳答案。')}${qb}<div class="ex-rd split">
        <div class="passage">${set.text.split('\n').filter((x) => x.trim()).map((x) => `<p>${esc(x)}</p>`).join('')}</div>
        <div class="q-list">${set.questions.map((q, i) => `<div class="q m-read"><div class="qt"><span class="n">${cur.n0 + i}</span><span>${esc(q.q)}</span></div><div class="opts">${q.opts.map((o, k) => `<button class="opt${ans[i] === k ? ' picked' : ''}" data-exmc="${i}" data-k="${k}"><span class="k">${K[k]}</span><span>${esc(o)}</span></button>`).join('')}</div></div>`).join('')}</div></div>`;
    }
    const i = Pp.R.indexOf(cur), nx = Pp.R[i + 1];
    const nav = `<div class="ex-rnav">${nx ? `<button class="btn soft m-read" data-exrsec="${nx.key}">下一节：${esc(nx.lab[1])}${ic('i-chev-r')}</button>` : `<span>这是阅读最后一节。检查完点「交本部分」进入翻译。</span>`}</div>`;
    return tabs + body + nav;
  }
  function paintRead(keepY) {
    const y = window.scrollY; const box = $('#exRd'); if (!box) return;
    box.innerHTML = readHTML(E(), P); paintClock();
    if (keepY) window.scrollTo(0, y);
  }
  function onExamClick(ev) {
    const t = ev.target, e = E(); if (!e) return;
    const nb = t.closest('[data-exnext]'); if (nb) {
      const k = PARTS[e.part].k;
      const left = k === 'listen' ? P.nL - cntL(e) : k === 'read' ? P.nR - cntR(e) : 0;
      if (twoStep(nb, `${left ? `还有 ${left} 题没答，` : ''}再点一次确认${e.part === 3 ? '交卷' : '交本部分'}`)) advance(false);
      return;
    }
    if (t.closest('[data-exnote]')) { e.note = ''; C().save(); const n = $('.ex-note'); if (n) n.remove(); sizeBar(); return; }
    // 听力
    if (t.closest('[data-explay]')) { axPlay(); return; }
    const ps = t.closest('[data-explayset]'); if (ps) { axReplaySet(+ps.dataset.explayset); return; }
    if (t.closest('[data-exreplay]')) { e.replay = !e.replay; C().save(); const y = window.scrollY; renderExam(); window.scrollTo(0, y); return; }
    if (t.closest('[data-exstem]')) { e.stem = !e.stem; C().save(); const y = window.scrollY; renderExam(); window.scrollTo(0, y); return; }
    const sk = t.closest('[data-exseek]'); if (sk && e.replay && AX.src && AX.duration) { const r = sk.getBoundingClientRect(); AX.currentTime = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * AX.duration; return; }
    const lo = t.closest('[data-exl]'); if (lo) {
      const [si, qi] = lo.dataset.exl.split(':').map(Number); const a = e.ans.L[si] || (e.ans.L[si] = {});
      a[qi] = +lo.dataset.k; C().save();
      lo.parentNode.querySelectorAll('.opt').forEach((b) => b.classList.toggle('picked', b === lo)); paintClock(); return;
    }
    // 阅读
    const rs = t.closest('[data-exrsec]'); if (rs) { e.rsec = rs.dataset.exrsec; clozeActive = -1; C().save(); paintRead(false); const rd = $('#exRd'); if (rd) { const top = rd.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle($('.ex-wrap')).getPropertyValue('--exbar')) || 0) - 70; window.scrollTo(0, Math.max(0, top)); } return; }
    const ra = () => e.ans.R[e.rsec] || (e.ans.R[e.rsec] = {});
    const bl = t.closest('[data-exblank]'); if (bl) { clozeActive = +bl.dataset.exblank; paintRead(true); return; }
    const bk = t.closest('[data-exbank]'); if (bk && clozeActive >= 0) {
      const a = ra(); Object.keys(a).forEach((k) => { if (a[k] === bk.dataset.exbank) delete a[k]; });
      a[clozeActive] = bk.dataset.exbank; const cur = P.R.find((x) => x.key === e.rsec); clozeActive = Math.min(clozeActive + 1, cur.t - 1); C().save(); paintRead(true); return;
    }
    const m = t.closest('[data-exm]'); if (m) { ra()[+m.dataset.exm] = m.dataset.l; C().save(); m.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('picked', b === m)); repaintTabs(); return; }
    const mc = t.closest('[data-exmc]'); if (mc) { ra()[+mc.dataset.exmc] = +mc.dataset.k; C().save(); mc.parentNode.querySelectorAll('.opt').forEach((b) => b.classList.toggle('picked', b === mc)); repaintTabs(); }
  }
  function repaintTabs() {
    const e = E(); paintClock();
    document.querySelectorAll('#exam-box [data-exrsec] .c').forEach((c) => { const x = P.R.find((r) => r.key === c.parentNode.dataset.exrsec); const n = Object.keys(e.ans.R[x.key] || {}).length; c.textContent = `${n}/${x.t}`; c.parentNode.classList.toggle('full', n >= x.t); });
  }
  function onExamInput(ev) {
    const k = ev.target.dataset.exta; if (!k) return; const e = E(); if (!e) return;
    e.ans[k] = ev.target.value;
    const c = $('#exCount'); if (c) c.innerHTML = countHTML(e.ans[k], k === 'write');
    const pg = $('#exProg'); if (pg) pg.innerHTML = progHTML(e);
    clearTimeout(taT); taT = setTimeout(() => C().save(), 400);
  }

  /* ---------- 报告 ---------- */
  function openReport(ts) { if (!repOf(ts)) return; mode = 'report'; repTs = ts; if ($('#view-exam').hidden) C().show('exam'); else render(); window.scrollTo(0, 0); }
  const bandsHTML = (k, val, bands) => `<div class="ex-bands">${bands.map(([b, rg, txt]) => `<div class="ex-band${val != null && rg.includes(val) ? ' on' : ''}"><div class="bh"><b>${b} 分档</b><span>${esc(txt)}</span></div><div class="bs">${rg.map((v) => `<button class="chip" data-exself="${k}:${v}" aria-pressed="${val === v}">${v}</button>`).join('')}</div></div>`).join('')}
    <div class="ex-band${val === 0 ? ' on' : ''}"><div class="bh"><b>0 分</b><span>白卷、离题，或只抄了题目</span></div><div class="bs"><button class="chip" data-exself="${k}:0" aria-pressed="${val === 0}">0</button></div></div></div>`;
  function verdict(total, pending) {
    const s = total >= 500 ? `达到 500 目标，稳住。` : total >= 425 ? `过了 425 线，离 500 还差 ${500 - total} 分。` : `离 425 线还差 ${425 - total} 分。`;
    return pending ? `写作、翻译还没自评，暂按 0 分计（各满分 106.5）。自评后总分会更新。` : s;
  }
  function renderReport() {
    const rec = repOf(repTs); const Pp = build(rec.ids);
    const box = $('#exam-box');
    if (!Pp) { box.innerHTML = `<div class="ex-wrap"><div class="prac-head"><button class="btn ghost" data-exhome>${ic('i-chev-l')}模考首页</button><h2>模考报告</h2></div><div class="empty">这套卷的部分题目已不在题库里，只能看总分：${rec.total}/710。</div></div>`; box.onclick = (ev) => { if (ev.target.closest('[data-exhome]')) { mode = 'home'; render(); } }; return; }
    const sc = scoreOf(Pp, rec.ans, rec.self);
    const pending = rec.self.write == null || rec.self.trans == null;
    const prow = (n, mod, v, max, sub) => `<div class="ex-prow ${mod}"><span class="pn">${n}</span><span class="bar"><i style="width:${Math.min(100, v / max * 100)}%"></i></span><span class="pv"><b>${fmt1(v)}</b>/${max}</span>${sub ? `<span class="ps">${sub}</span>` : ''}</div>`;
    const secSub = (ks) => ks.filter((k) => sc.sec[k]).map((k) => `${STD[k].name} ${sc.sec[k].r}/${sc.sec[k].t}`).join(' · ');
    const odd = Object.entries(sc.sec).filter(([, v]) => v.odd).map(([k, v]) => `${STD[k].name}本卷 ${v.t} 题（标准 ${STD[k].n} 题），满分仍按 ${fmt1(v.max)} 计，每题 ${fmt1(v.per)} 分`);
    const used = rec.used ? rec.used.reduce((a, b) => a + b, 0) : 0;
    const qd = (n, ok, line, exp) => `<details class="ex-qd ${ok ? 'ok' : 'bad'}"><summary><span class="n">${n}</span><i>${ok ? '✓' : '✗'}</i><span class="ex-qa">${line}</span>${ic('i-chev-r')}</summary><div class="exp">${exp}</div></details>`;
    const mine = (p, f) => p === undefined || p === null ? '未作答' : '你选 ' + f(p);
    const lisHTML = Pp.L.map((x, si) => {
      const a = rec.ans.L[si] || {}, ms = marks('listen', x.set, a);
      return `<div class="ex-rset m-listen"><div class="ex-rsh"><span class="kind">${SEC_L[x.sec][0]} · ${SEC_L[x.sec][1]}</span><b>${esc(x.set.title.replace(/^[^·]+·\s*/, ''))}</b><span class="sc">${ms.filter(Boolean).length}/${ms.length}</span><button class="btn soft m-listen" data-exrev="L:${si}">${ic('i-play')}原文 · 听这句</button></div>
        <div class="ex-qds">${x.set.questions.map((q, qi) => qd(x.n0 + qi, ms[qi], ms[qi] ? `答对 ${K[q.a]}` : `${mine(a[qi], (v) => K[v])} · 答案 ${K[q.a]}`, `<b>${esc(q.q)}</b><br>${K[q.a]}) ${esc(q.opts[q.a])}<br>${esc(q.exp)}`)).join('')}</div></div>`;
    }).join('');
    const rdHTML = Pp.R.map((x) => {
      const a = rec.ans.R[x.key] || {}, ms = marks(x.kind, x.set, a), s = x.set;
      const rows = ms.map((ok, i) => {
        if (x.kind === 'cloze') { const ans = s.answers[i]; return qd(x.n0 + i, ok, ok ? `答对 ${ans} ${esc(clozeWord(s, ans))}` : `${a[i] ? '你填 ' + a[i] + ' ' + esc(clozeWord(s, a[i])) : '未作答'} · 答案 ${ans} ${esc(clozeWord(s, ans))}`, esc(s.exp[i] || '')); }
        if (x.kind === 'match') { const it = s.items[i]; return qd(x.n0 + i, ok, ok ? `答对 ${esc(it.a)} 段` : `${a[i] ? '你选 ' + esc(a[i]) + ' 段' : '未作答'} · 答案 ${esc(it.a)} 段`, `<b>${esc(it.s)}</b>${it.exp ? '<br>' + esc(it.exp) : ''}`); }
        const q = s.questions[i]; return qd(x.n0 + i, ok, ok ? `答对 ${K[q.a]}` : `${mine(a[i], (v) => K[v])} · 答案 ${K[q.a]}`, `<b>${esc(q.q)}</b><br>${K[q.a]}) ${esc(q.opts[q.a])}<br>${esc(q.exp)}`);
      }).join('');
      return `<div class="ex-rset m-read"><div class="ex-rsh"><span class="kind">${x.lab[0]} · ${esc(x.lab[1])}</span><b>${esc(s.title.replace(/^[^·]+·\s*/, ''))}</b><span class="sc">${ms.filter(Boolean).length}/${ms.length}</span><button class="btn soft m-read" data-exrev="R:${x.key}">${ic('i-target')}原文 · 定位</button></div><div class="ex-qds">${rows}</div></div>`;
    }).join('');
    const W = Pp.d.W, T = Pp.d.T;
    const selfCard = (k, mod, title, text, ref, bands, isW) => `<div class="ex-self ${mod}"><div class="sec-h"><span class="ico ${mod}">${ic(isW ? 'i-pen' : 'i-swap')}</span><h2>${title}</h2><span class="more">${rec.self[k] == null ? '待自评' : `${rec.self[k]} 分 × 7.1 = ${fmt1(rec.self[k] * 7.1)}`}</span></div>
      <div class="ex-cmp"><div class="card"><div class="lab">${isW ? '我的作文' : '我的译文'} · ${words(text)} 词</div><div class="ex-mine">${text.trim() ? esc(text) : '<i>（没写）</i>'}</div></div>
      <div class="card"><div class="lab">${isW ? '范文' : '参考译文'}</div><div class="sample ${mod}">${ref}</div></div></div>
      <p class="lead">对照范文，按下面的档次给自己打分（15 分制，先定档，再按语言质量在档内加减 1 分；可以随时改）：</p>${bandsHTML(k, rec.self[k], bands)}</div>`;
    box.innerHTML = `<div class="ex-wrap ex-rep">
      <div class="prac-head"><button class="btn ghost" data-exhome>${ic('i-chev-l')}模考首页</button><h2>模考报告 · 卷号 ${esc(rec.seed)}</h2></div>
      <div class="result m-exam"><div class="score">${sc.total}<small> / 710</small></div><p>${esc(verdict(sc.total, pending))}</p>
        <p class="res-time">${ic('i-timer')}${esc(rec.d)} · 用时 ${Math.round(used / 60)} 分钟${rec.auto ? ' · 到点自动交卷' : ''}</p>
        <div class="ex-lines"><span class="${sc.total >= 425 ? 'ok' : ''}">425 ${sc.total >= 425 ? '✓' : ''}</span><span class="${sc.total >= 500 ? 'ok' : ''}">500 ${sc.total >= 500 ? '✓' : ''}</span></div></div>
      <div class="card ex-parts">
        ${prow('听力', 'm-listen', sc.parts.listen, 248.5, secSub(['conv', 'pas', 'lec']))}
        ${prow('阅读', 'm-read', sc.parts.read, 248.5, secSub(['cloze', 'match', 'mc']))}
        ${prow('写作', 'm-write', sc.parts.write, 106.5, rec.self.write == null ? '待自评' : `自评 ${rec.self.write} 分`)}
        ${prow('翻译', 'm-trans', sc.parts.trans, 106.5, rec.self.trans == null ? '待自评' : `自评 ${rec.self.trans} 分`)}
        <p class="ex-calc">按官方结构折算：听力 长对话 / 篇章每题 7.1、讲座每题 14.2；阅读 选词填空每题 3.55、段落匹配 7.1、仔细阅读 14.2；写作、翻译 档分 × 7.1。${odd.length ? `<br>${odd.map(esc).join('；')}。` : ''}正式成绩是常模参照的等值分，这里只是估算。</p>
      </div>
      ${selfCard('write', 'm-write', '写作 · 自评', rec.ans.write, C().hl(W.sample, W.hl), W_BANDS, true)}
      ${selfCard('trans', 'm-trans', '翻译 · 自评', rec.ans.trans, esc(T.en), T_BANDS, false)}
      <div class="sec-h"><span class="ico m-listen">${ic('i-ear')}</span><h2>听力 · 逐题</h2></div>
      <p class="lead">点题号看解析；「原文 · 听这句」在听读页打开这一段（带你的作答），解析里的引文可以点着定位、重听。</p>
      ${lisHTML}
      <div class="sec-h"><span class="ico m-read">${ic('i-book')}</span><h2>阅读 · 逐题</h2></div>
      ${rdHTML}
      <div class="ex-foot"><span>错题已收进「我的 · 错题本」，这几篇也记进了练习记录。</span><div class="acts"><a class="btn" href="paper.html?seed=${encodeURIComponent(rec.seed)}">${ic('i-pen')}打印这套</a><button class="btn primary" data-exhome>${ic('i-clip')}再来一套</button></div></div>
    </div>`;
    box.oninput = null; box.onchange = null;
    box.onclick = (ev) => {
      const t = ev.target;
      if (t.closest('[data-exhome]')) { mode = 'home'; render(); window.scrollTo(0, 0); return; }
      const sf = t.closest('[data-exself]'); if (sf) {
        const [k, v] = sf.dataset.exself.split(':'); rec.self[k] = +v;
        const s2 = scoreOf(Pp, rec.ans, rec.self); rec.total = s2.total; rec.parts = s2.parts; C().save();
        const y = window.scrollY; renderReport(); window.scrollTo(0, y); return;
      }
      const rv = t.closest('[data-exrev]'); if (rv) {
        const [w, k] = rv.dataset.exrev.split(':'); repY = window.scrollY;
        const back = () => { C().show('exam'); window.scrollTo(0, repY); };
        if (w === 'L') C().reviewSet(Pp.L[+k].set.id, rec.ans.L[+k] || {}, back);
        else { const x = Pp.R.find((r) => r.key === k); C().reviewSet(x.set.id, rec.ans.R[k] || {}, back); }
      }
    };
  }

  /* ---------- 入口 ---------- */
  function render() {
    const S = C().S;
    if (mode === 'exam' && !S.exam) mode = 'home';
    if (mode === 'report' && !repOf(repTs)) mode = 'home';
    if (mode !== 'exam') { clearInterval(tickId); }
    if (mode === 'exam') renderExam(); else if (mode === 'report') renderReport(); else renderHome();
  }
  // 离开模考页：录音暂停、倒计时停（作答已实时保存）
  function leave() { clearTimeout(axNextT); if (!AX.paused) AX.pause(); clearInterval(tickId); if (C() && C().S.exam) C().save(); }
  const flush = () => { if (window.CET6 && C().S.exam) C().save(); };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); else lastTick = Date.now(); });
  window.addEventListener('pagehide', flush);
  window.CET6Exam = { render, leave, openReport, audio: AX, preset: (seed) => { presetSeed = seed; mode = 'home'; } };
})();
