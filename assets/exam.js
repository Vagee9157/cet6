/* 在线模考：网页上做一整套六级卷，和打印版 paper.html 同结构同题量（抽题共用 assets/draw.js，同一卷号同一套题）。
 * 四部分：Part I 写作 30′ / Part II 听力 30′（各段录音按顺序各放一遍，带题目播报和作答停顿）/ Part III 阅读 40′ / Part IV 翻译 30′。
 * 两种顺序：自由顺序（默认，顶部标签随时切换、交卷前可回改；每部分自己的倒计时只在停留时走，用完锁定该部分）
 *   和按真考顺序（e.order='strict'：一部分一部分做，交了不能回改，到点自动进下一部分）。
 * 两种范围：完整模考（mode 'full'）和自选模块（'custom'，sel 勾选到题型：写作 / 长对话 / 篇章 / 讲座 / 选词 / 匹配 / 仔细 / 翻译；
 *   抽题照样用 draw.js 同卷号同一套，只是不展示没选的；时间按所选估算，可 ±5 分钟）。
 * 进行中的模考存在 S.exam（卷号、题目 id、范围、顺序、当前部分、各部分时限与剩余秒数、锁定、作答、听力播放位置），刷新 / 关页后可继续；
 * 倒计时只在模考页开着时走（页面切到后台且没在放录音时暂停）。旧记录没有 mode / order / sel，按完整模考 + 真考顺序处理。
 * 交卷后听力、阅读自动判分，写作、翻译用 assets/grade.js 规则估分（可手动改档，以手动为准），按官方结构折成 710 分（自选按得分率折算）；
 *   成绩存 S.exams（mode / sel / order / parts / ag 自动估分 / self 手动档 / used 用时），各篇记进 S.sets / S.hist / S.wrong。
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
  const G = () => window.CET6Grade;
  const W_BANDS = window.CET6Grade.W_BANDS, T_BANDS = window.CET6Grade.T_BANDS;
  // 自选模块：题型键 → 所属部分
  const SECS = { listen: ['conv', 'pas', 'lec'], read: ['cloze', 'match', 'mc'] };
  const SEL_KEYS = ['write', 'conv', 'pas', 'lec', 'cloze', 'match', 'mc', 'trans'];
  const SEL_NAME = { write: '写作', conv: '长对话', pas: '听力篇章', lec: '讲座', cloze: '选词填空', match: '段落匹配', mc: '仔细阅读', trans: '翻译' };
  const allSel = () => SEL_KEYS.reduce((o, k) => ((o[k] = true), o), {});
  const partOn = (sel, k) => (SECS[k] ? SECS[k].some((x) => sel[x]) : !!sel[k]);
  const selIdx = (sel) => PARTS.map((p, i) => i).filter((i) => partOn(sel, PARTS[i].k));
  const isAll = (sel) => SEL_KEYS.every((k) => sel[k]);
  // 模块标签：完整模考 / 听力+阅读 / 听力(讲座)+阅读(仔细阅读)
  function tagOf(x) {
    if (x && x.diag) return '诊断';
    if (!x || x.mode !== 'custom') return '完整模考';
    const sel = x.sel || {};
    return PARTS.filter((p) => partOn(sel, p.k)).map((p) => { const ks = SECS[p.k]; if (!ks || ks.every((k) => sel[k])) return p.n; return `${p.n}(${ks.filter((k) => sel[k]).map((k) => SEL_NAME[k]).join('·')})`; }).join('+');
  }
  // 兼容旧数据：缺 mode / order / sel / lim / locked 的按完整模考 + 真考顺序
  function norm(e) {
    if (!e) return e;
    if (!e.sel || typeof e.sel !== 'object') e.sel = allSel();
    if (e.mode !== 'custom') e.mode = 'full';
    if (e.order !== 'free') e.order = 'strict';
    if (!Array.isArray(e.lim) || e.lim.length !== 4) e.lim = PARTS.map((p) => p.min * 60);
    if (!Array.isArray(e.locked) || e.locked.length !== 4) e.locked = [0, 0, 0, 0];
    if (!Array.isArray(e.left) || e.left.length !== 4) e.left = e.lim.slice();
    e.ans = e.ans || {}; e.ans.L = e.ans.L || {}; e.ans.R = e.ans.R || {}; e.ans.write = e.ans.write || ''; e.ans.trans = e.ans.trans || '';
    if (!e.self) e.self = { write: null, trans: null };
    return e;
  }
  const fmt1 = (v) => String(Math.round(v * 10) / 10);
  const clock = (s) => { s = Math.max(0, Math.ceil(s)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const hclock = (s) => { s = Math.max(0, Math.ceil(s)); return s >= 3600 ? `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` : clock(s); };
  const mss = (x) => { x = Math.max(0, Math.floor(x || 0)); return `${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`; };

  let mode = 'home', repTs = 0, presetSeed = 0, nextSeed = 0, nextKey = '', homeReplay = false, P = null, pKey = '';
  let tickId = 0, lastTick = 0, saveAt = 0, taT = 0, clozeActive = -1, repY = 0;
  const partY = {};

  // sel[k] 可以是数字：只取这一题型抽到的前 n 篇（诊断用：讲座 1 / 长对话 1 / 仔细阅读 1）
  const take = (sel, k, xs) => (typeof sel[k] === 'number' ? xs.slice(0, sel[k]) : xs);
  // 诊断：讲座 1 篇 + 长对话 1 篇 + 仔细阅读 1 篇 + 段落匹配 1 篇 + 翻译（自由顺序，时间按估算）
  const DIAG_SEL = { write: false, conv: 1, pas: false, lec: 1, cloze: false, match: true, mc: 1, trans: true };

  /* ---------- 卷面：题号 / 分节（只排所选题型，题号连续） ---------- */
  function build(ids, sel) {
    const d = CET6Draw.fromIds(ids); if (!d) return null;
    sel = sel || allSel();
    let n = 0; const L = [];
    [['conv', d.conv], ['pas', d.pas], ['lec', d.lec]].forEach(([sec, xs]) => { if (sel[sec]) take(sel, sec, xs).forEach((set) => { L.push({ sec, set, n0: n + 1 }); n += set.questions.length; }); });
    const nL = n, R = [];
    const addR = (key, kind, set, t, lab) => { R.push({ key, kind, set, t, n0: n + 1, lab }); n += t; };
    if (sel.cloze) addR('cloze', 'cloze', d.cloze, d.cloze.answers.length, ['Section A', '选词填空']);
    if (sel.match) addR('match', 'match', d.match, d.match.items.length, ['Section B', '段落匹配']);
    if (sel.mc) take(sel, 'mc', d.mc).forEach((s, i) => addR('mc' + i, 'mc', s, s.questions.length, ['Section C', `仔细阅读 ${['One', 'Two', 'Three'][i]}`]));
    const shown = [...(sel.write ? [d.W.id] : []), ...L.map((x) => x.set.id), ...R.map((x) => x.set.id), ...(sel.trans ? [d.T.id] : [])];
    return { d, L, nL, R, nR: n - nL, sel, shown };
  }
  const selKey = (sel) => SEL_KEYS.map((k) => (sel && typeof sel[k] === 'number' ? 'n' + sel[k] : sel && sel[k] ? 1 : 0)).join('');
  const paper = (ids, sel) => { const k = ids.join(',') + '|' + selKey(sel || allSel()); if (k !== pKey) { P = build(ids, sel); pKey = k; } return P; };
  const marks = (kind, set, ans) => C().marksOf({ kind, set, ans: ans || {} });
  // 写作 / 翻译自动估分（只存分数和档，分项建议报告里现算）
  function agOf(Pp, ans, sel) {
    const pick = (r) => ({ score: r.score, band: r.band });
    return { write: sel.write ? pick(G().writing(ans.write, Pp.d.W)) : null, trans: sel.trans ? pick(G().translation(ans.trans, Pp.d.T)) : null };
  }
  // 写译用分：手动档优先，否则自动估分
  const wtScore = (self, ag, k) => (self && self[k] != null ? self[k] : ag && ag[k] ? ag[k].score : 0);
  // 各题型对错与 710 分换算；自选模块只算所选部分，另给得分率 × 710 的折算
  function scoreOf(Pp, ans, self, ag) {
    const sel = Pp.sel, sec = {};
    const add = (k, ms) => { const v = sec[k] || (sec[k] = { r: 0, t: 0 }); v.r += ms.filter(Boolean).length; v.t += ms.length; };
    Pp.L.forEach((x, si) => add(x.sec, marks('listen', x.set, ans.L[si])));
    Pp.R.forEach((x) => add(x.kind, marks(x.kind, x.set, ans.R[x.key])));
    Object.entries(sec).forEach(([k, v]) => { const st = STD[k]; v.max = st.n * st.pt; v.pts = v.t ? v.max * v.r / v.t : 0; v.per = v.t ? v.max / v.t : 0; v.odd = v.t !== st.n; });
    const sum = (ks) => ks.reduce((a, k) => a + (sec[k] ? sec[k].pts : 0), 0);
    const smax = (ks) => ks.reduce((a, k) => a + (sec[k] ? sec[k].max : 0), 0);
    const parts = {}, pmax = {};
    if (sel.write) { parts.write = wtScore(self, ag, 'write') * 7.1; pmax.write = 106.5; }
    if (partOn(sel, 'listen')) { parts.listen = sum(SECS.listen); pmax.listen = smax(SECS.listen); }
    if (partOn(sel, 'read')) { parts.read = sum(SECS.read); pmax.read = smax(SECS.read); }
    if (sel.trans) { parts.trans = wtScore(self, ag, 'trans') * 7.1; pmax.trans = 106.5; }
    Object.keys(parts).forEach((k) => { parts[k] = Math.round(parts[k] * 10) / 10; pmax[k] = Math.round(pmax[k] * 10) / 10; });
    const raw = Object.values(parts).reduce((a, b) => a + b, 0), max = Object.values(pmax).reduce((a, b) => a + b, 0);
    const full = isAll(sel), rate = max ? raw / max : 0;
    return { sec, parts, pmax, total: Math.round(raw), max: Math.round(max * 10) / 10, rate, scaled: full ? Math.round(raw) : Math.round(rate * 710), full };
  }
  const applySc = (rec, sc) => { rec.total = sc.total; rec.parts = sc.parts; rec.max = sc.max; rec.rate = Math.round(sc.rate * 1000) / 1000; rec.scaled = sc.scaled; };
  // 旧记录补齐：mode / sel / order、自动估分、折算分（只补一次）
  function migrate(rec) {
    if (!rec || rec.v === 2) return false;
    norm(rec);
    const Pp = build(rec.ids, rec.sel);
    if (Pp) { if (!rec.ag) rec.ag = agOf(Pp, rec.ans, rec.sel); applySc(rec, scoreOf(Pp, rec.ans, rec.self, rec.ag)); }
    else { rec.max = rec.max || 710; rec.scaled = rec.scaled != null ? rec.scaled : rec.total; rec.rate = rec.rate != null ? rec.rate : (rec.total || 0) / 710; }
    rec.v = 2; return true;
  }
  function migrateAll() { let ch = false; (C().S.exams || []).forEach((r) => { if (migrate(r)) ch = true; }); if (ch) C().save(); }
  // 历史行用：分数（完整 = 总分，自选 = 折算）、标签、得分率
  function meta(x) { migrate(x); return { v: x.mode === 'custom' ? x.scaled : x.total, tag: tagOf(x), rate: Math.round((x.rate || 0) * 100), custom: x.mode === 'custom' }; }

  /* ---------- 时间估算：写作 30、翻译 30；听力 = 所选各段考试节奏录音时长合计 + 2 分钟；阅读 选词 7 / 匹配 15 / 仔细每篇 9 ---------- */
  const audDur = (set) => { const m = C().AUD(set.id); return m && m.dur ? m.dur : words(set.script || '') / 150 * 60 + set.questions.length * 15 + 10; };
  function estimate(d, sel) {
    const lis = [...(sel.conv ? take(sel, 'conv', d.conv) : []), ...(sel.pas ? take(sel, 'pas', d.pas) : []), ...(sel.lec ? take(sel, 'lec', d.lec) : [])];
    const lsec = lis.reduce((a, s) => a + audDur(s), 0);
    return [sel.write ? 30 : 0, lis.length ? Math.ceil((lsec + 120) / 60) : 0, (sel.cloze ? 7 : 0) + (sel.match ? 15 : 0) + (sel.mc ? 9 * take(sel, 'mc', d.mc).length : 0), sel.trans ? 30 : 0];
  }
  // 各部分时限（秒）：完整模考固定 30/30/40/30；自选按估算，±adj 分钟按比例摊到各部分
  function limits(d, sel, adj, full) {
    if (full) return PARTS.map((p) => p.min * 60);
    const m = estimate(d, sel), tot = m.reduce((a, b) => a + b, 0); if (!tot) return [0, 0, 0, 0];
    const k = Math.max(1, tot + (adj || 0)) / tot;
    return m.map((x) => Math.round(x * 60 * k / 10) * 10);
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
    if (e.lis.done || e.locked[1]) return;
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
      if (mode !== 'exam' || !E() || E().part !== 1 || E().locked[1] || $('#view-exam').hidden) return;
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
    if (e.locked[1]) return { ttl: '听力时间到，已锁定（可查看，不能再作答）', si: -1 };
    if (e.lis.done) return { ttl: e.order === 'free' ? '录音已全部播完，检查答案后去做别的部分' : '录音已全部播完，检查答案后交本部分', si: -1 };
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
    if (e.locked[e.part]) return;
    if (dt > 5 && AX.paused) dt = 1;
    e.left[e.part] = Math.max(0, e.left[e.part] - dt);
    paintClock();
    if (now - saveAt > 5000) { saveAt = now; C().save(); }
    if (e.left[e.part] <= 0) { if (e.order === 'free') lockPart(e.part); else advance(true); }
  }
  // 自由顺序：本部分时间到 → 锁定（可查看不可改），其他部分不受影响；全部锁定就交卷
  function lockPart(i) {
    const e = E(); if (!e) return; const p = PARTS[i];
    e.locked[i] = 1; e.left[i] = 0;
    if (p.k === 'listen') { clearTimeout(axNextT); AX.pause(); axReplay = false; }
    if (selIdx(e.sel).every((j) => e.locked[j])) return finish(true);
    e.note = `Part ${p.no} ${p.n}：本部分时间到，已锁定（可以查看，不能再改）。其他部分不受影响。`;
    C().save(); const y = window.scrollY; renderExam(); window.scrollTo(0, y);
  }
  const totalLeft = (e) => selIdx(e.sel).reduce((a, i) => a + (e.locked[i] ? 0 : e.left[i]), 0);
  function paintClock() {
    const e = E(); const el = $('#exClock'); if (!e || !el) return;
    const s = e.left[e.part], lk = e.locked[e.part];
    el.textContent = lk ? '时间到' : clock(s); el.classList.toggle('warn', !lk && s <= 300 && s > 60); el.classList.toggle('end', lk || s <= 60);
    const pg = $('#exProg'); if (pg) pg.innerHTML = e.order === 'free' ? `总剩余 <b>${hclock(totalLeft(e))}</b>` : progHTML(e);
    if (e.order === 'free') document.querySelectorAll('#exam-box .ex-ptab').forEach((b) => { const i = +b.dataset.expart; const st = b.querySelector('.s'); if (st) st.innerHTML = tabStat(e, i); });
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
  // 标签上的小字：已答数 / 字数 · 剩余时间
  function tabStat(e, i) {
    const k = PARTS[i].k;
    const a = k === 'listen' ? `${cntL(e)}/${P.nL}` : k === 'read' ? `${cntR(e)}/${P.nR}` : `${words(e.ans[k])} 词`;
    return `<b>${a}</b><em>${e.locked[i] ? '时间到' : clock(e.left[i])}</em>`;
  }
  // 交卷前列出还没答的
  function todoText(e) {
    const xs = [];
    if (e.sel.write && !e.ans.write.trim()) xs.push('作文没写');
    if (partOn(e.sel, 'listen')) { const n = P.nL - cntL(e); if (n) xs.push(`听力 ${n} 题没答`); }
    if (partOn(e.sel, 'read')) { const n = P.nR - cntR(e); if (n) xs.push(`阅读 ${n} 题没答`); }
    if (e.sel.trans && !e.ans.trans.trim()) xs.push('翻译没写');
    return xs.join('、');
  }

  /* ---------- 开考设置（记在 S.examPref） ---------- */
  function pref() {
    const p = C().S.examPref && typeof C().S.examPref === 'object' ? C().S.examPref : {};
    return { mode: p.mode === 'custom' ? 'custom' : 'full', sel: Object.assign(allSel(), p.sel || {}), adj: Math.max(-5, Math.min(5, Math.round(+p.adj || 0))), strict: !!p.strict };
  }
  function setPref(ch) { C().S.examPref = Object.assign(pref(), ch); C().save(); }
  const prefSel = (pf) => (pf.mode === 'full' ? allSel() : pf.sel);

  /* ---------- 开始 / 换部分 / 交卷 ---------- */
  function newExam(seed, opt) {
    const diag = !!(opt && opt.diag);
    const S = C().S; const fresh = S.drawFresh !== false, pf = pref(), full = !diag && pf.mode === 'full';
    const sel = diag ? Object.assign({}, DIAG_SEL) : full ? allSel() : Object.assign({}, pf.sel);
    const p = CET6Draw.paperOf(seed, S, fresh);
    const lim = limits(p.d, sel, diag ? 0 : pf.adj, full);
    const Pp = build(p.ids, sel);
    S.exam = { diag, seed: +seed, ids: p.ids, fresh: p.fresh, d: C().lday(), ts: Date.now(), mode: full ? 'full' : 'custom', sel, order: pf.strict && !diag ? 'strict' : 'free', part: selIdx(sel)[0], lim, left: lim.slice(), locked: [0, 0, 0, 0], ans: { write: '', trans: '', L: {}, R: {} }, lis: { i: 0, t: 0, played: [], started: false, done: false }, replay: diag ? false : homeReplay, stem: false, rsec: Pp && Pp.R[0] ? Pp.R[0].key : 'cloze', note: '' };
    presetSeed = 0; nextSeed = 0; axSi = -1; axReplay = false; AX.pause(); AX.removeAttribute('src');
    Object.keys(partY).forEach((k) => delete partY[k]);
    C().save(); mode = 'exam'; render(); window.scrollTo(0, 0);
  }
  const stopLis = () => { clearTimeout(axNextT); AX.pause(); axReplay = false; };
  // 自由顺序：切到第 i 部分（离开听力时录音暂停，回来接着放）
  function goPart(i) {
    const e = E(); if (!e || i === e.part || !partOn(e.sel, PARTS[i].k)) return;
    if (PARTS[e.part].k === 'listen') stopLis();
    partY[e.part] = window.scrollY;
    e.part = i; e.note = ''; clozeActive = -1; C().save(); renderExam(); window.scrollTo(0, partY[i] || 0);
  }
  // 按真考顺序：交本部分进下一个所选部分
  function advance(auto) {
    const e = E(); if (!e) return; const p = PARTS[e.part];
    if (p.k === 'listen') stopLis();
    const nx = selIdx(e.sel).find((i) => i > e.part);
    if (nx == null) return finish(auto);
    e.part = nx; const q = PARTS[e.part];
    e.note = auto ? `Part ${p.no} ${p.n}时间到，已自动进入 Part ${q.no} ${q.n}。` : '';
    C().save(); render(); window.scrollTo(0, 0);
  }
  function finish(auto) {
    const S = C().S, e = S.exam; if (!e) return;
    norm(e);
    clearTimeout(axNextT); AX.pause(); clearInterval(tickId);
    const Pp = build(e.ids, e.sel);
    if (!Pp) { delete S.exam; C().save(); mode = 'home'; return render(); }
    // 听力 / 阅读各篇：记进 S.sets（做过）、S.hist（练习记录）、S.wrong（错题，格式与练习交卷一致）
    const via = e.diag ? 'diag' : 'exam';
    const rec1 = (kind, set, ans) => { const ms = marks(kind, set, ans); const { wrongs, rights } = C().wrongsOf(kind, set, ans || {}); wrongs.forEach((w) => { w.exam = e.seed; }); C().recordSet(set.id, ms.filter(Boolean).length, ms.length, wrongs, rights, undefined, via); };
    Pp.L.forEach((x, si) => rec1('listen', x.set, e.ans.L[si]));
    Pp.R.forEach((x) => rec1(x.kind, x.set, e.ans.R[x.key]));
    // 作文 / 译文：写译页对应题目还空着就存进去（写译页也算写过）
    S.wt = S.wt || {};
    if (e.sel.write && e.ans.write.trim() && !(S.wt[Pp.d.W.id] || '').trim()) S.wt[Pp.d.W.id] = e.ans.write;
    if (e.sel.trans && e.ans.trans.trim() && !(S.wt[Pp.d.T.id] || '').trim()) S.wt[Pp.d.T.id] = e.ans.trans;
    const rec = { v: 2, diag: !!e.diag, seed: e.seed, d: C().lday(), ts: Date.now(), start: e.ts, ids: e.ids.slice(), shown: Pp.shown, fresh: e.fresh, mode: e.mode, sel: Object.assign({}, e.sel), order: e.order, ans: e.ans, self: { write: null, trans: null }, lim: e.lim.slice(), used: PARTS.map((p, i) => Math.round(e.lim[i] - e.left[i])), auto: !!auto };
    rec.ag = agOf(Pp, rec.ans, rec.sel);
    applySc(rec, scoreOf(Pp, rec.ans, rec.self, rec.ag));
    // 写译估分记进 S.wtScore（同 ts，报告里手动改档会同步过去）；没写的不记
    const LN = window.CET6Learn;
    if (LN) { if (rec.sel.write && rec.ans.write.trim()) LN.logWt('write', Pp.d.W.id, G().writing(rec.ans.write, Pp.d.W), via, rec.ts); if (rec.sel.trans && rec.ans.trans.trim()) LN.logWt('trans', Pp.d.T.id, G().translation(rec.ans.trans, Pp.d.T), via, rec.ts); }
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
  // 最近 10 次总分（自选为折算分）走势：纯 SVG，颜色走主题变量
  function trendHTML(list) {
    const xs = list.slice(-10); if (xs.length < 2) return '';
    const W = 320, H = 132, l = 26, r = 6, t = 16, b = 20, bw = (W - l - r) / xs.length;
    const y = (v) => t + (H - t - b) * (1 - Math.max(0, Math.min(710, v)) / 710);
    const ms = xs.map(meta);
    const grid = [[425, 'g425'], [500, 'g500']].map(([v, c]) => `<line class="${c}" x1="${l}" x2="${W - r}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text class="gl" x="${l - 3}" y="${(y(v) + 3).toFixed(1)}" text-anchor="end">${v}</text>`).join('');
    const bars = ms.map((m, i) => { const x = l + i * bw + bw * 0.18, w = bw * 0.64, yy = y(m.v); return `<rect class="bar${m.custom ? ' cu' : ''}" x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${w.toFixed(1)}" height="${(H - b - yy).toFixed(1)}" rx="3"><title>${esc(xs[i].d)} · ${esc(m.tag)} · ${m.custom ? '折算 ' : ''}${m.v}</title></rect><text class="bv" x="${(x + w / 2).toFixed(1)}" y="${(yy - 4).toFixed(1)}" text-anchor="middle">${m.v}</text><text class="bx" x="${(x + w / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${esc(String(xs[i].d).slice(5))}</text>`; }).join('');
    const line = `<polyline class="pl" points="${ms.map((m, i) => `${(l + i * bw + bw / 2).toFixed(1)},${y(m.v).toFixed(1)}`).join(' ')}"/>`;
    return `<div class="card ex-trend"><div class="ex-trh"><b>最近 ${xs.length} 次</b><span><i class="k"></i>完整模考 <i class="k cu"></i>自选（折算 710）</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="最近 ${xs.length} 次模考分数走势">${grid}<line class="ax" x1="${l}" x2="${W - r}" y1="${H - b}" y2="${H - b}"/>${bars}${line}</svg></div>`;
  }
  // 开考设置卡：完整 / 自选、模块勾选、时间估算与 ±5 分钟、顺序
  function setupHTML(seed) {
    const S = C().S, pf = pref(), full = pf.mode === 'full', sel = prefSel(pf);
    const d = CET6Draw.paperOf(seed, S, S.drawFresh !== false).d;
    const est = full ? PARTS.map((p) => p.min) : estimate(d, sel), lim = limits(d, sel, pf.adj, full);
    const tot = Math.round(lim.reduce((a, b) => a + b, 0) / 60), estTot = est.reduce((a, b) => a + b, 0);
    const none = !full && !SEL_KEYS.some((k) => sel[k]);
    const cb = (k) => `<label class="ex-ck"><input type="checkbox" data-exsel="${k}" ${sel[k] ? 'checked' : ''}><span>${SEL_NAME[k]}${k === 'mc' ? ` · ${d.mc.length} 篇` : ''}</span></label>`;
    const grp = (pk, name, mod) => { const ks = SECS[pk], on = ks.filter((k) => sel[k]).length; return `<div class="ex-mg ${mod}"><label class="ex-ck ex-ckp"><input type="checkbox" data-exgrp="${pk}" ${on === ks.length ? 'checked' : ''} ${on && on < ks.length ? 'data-ind="1"' : ''}><span>${name}</span></label><div class="ex-sub">${ks.map(cb).join('')}</div></div>`; };
    const mods = full ? '' : `<div class="ex-mods">
        <div class="ex-mg m-write">${cb('write').replace('ex-ck', 'ex-ck ex-ckp')}</div>
        ${grp('listen', '听力', 'm-listen')}${grp('read', '阅读', 'm-read')}
        <div class="ex-mg m-trans">${cb('trans').replace('ex-ck', 'ex-ck ex-ckp')}</div></div>`;
    const detail = PARTS.map((p, i) => (lim[i] ? `${p.n} ${Math.round(lim[i] / 60)}` : '')).filter(Boolean).join(' · ');
    const estLine = none ? `<div class="ex-est none">至少勾一个模块。</div>` : `<div class="ex-est"><div class="tx"><span>${full ? '考试时间' : '预计用时'}</span><b>${tot} 分钟</b><small>${esc(detail)}${full ? '' : `（估算 ${estTot} 分钟${pf.adj ? `，已${pf.adj > 0 ? '加' : '减'} ${Math.abs(pf.adj)}` : ''}${lim[1] ? '；听力按所选录音实际时长 + 2' : ''}）`}</small></div>
        ${full ? '' : `<div class="ex-adj" role="group" aria-label="调整时间"><button class="btn" data-exadj="-1" ${pf.adj <= -5 ? 'disabled' : ''} aria-label="少 1 分钟">−</button><span>${pf.adj > 0 ? '+' : ''}${pf.adj} 分</span><button class="btn" data-exadj="1" ${pf.adj >= 5 ? 'disabled' : ''} aria-label="多 1 分钟">+</button></div>`}</div>`;
    return `<div class="ex-mode" role="group" aria-label="模考范围"><button class="chip" data-exmode="full" aria-pressed="${full}">完整模考</button><button class="chip" data-exmode="custom" aria-pressed="${!full}">自选模块</button></div>${mods}${estLine}`;
  }
  function renderHome() {
    const S = C().S; migrateAll();
    const e = norm(S.exam), exams = (S.exams || []).slice().reverse();
    if (e) paper(e.ids, e.sel);
    const nx = getNext(), seed = presetSeed || nx, pf = pref(), none = pf.mode === 'custom' && !SEL_KEYS.some((k) => pf.sel[k]);
    const tiles = PARTS.map((p, i) => `<div class="ex-tile ${p.mod}"><span class="no">Part ${p.no}</span><b>${p.n}</b><span>${p.min} 分钟 · ${['1 篇 · 106.5', '25 题 · 248.5', '30 题 · 248.5', '1 段 · 106.5'][i]}</span></div>`).join('');
    const cont = e ? `<div class="ex-cont card m-exam"><div class="tx"><span class="kind">进行中的模考 · ${esc(tagOf(e))} · ${e.order === 'free' ? '自由顺序' : '真考顺序'}</span><b>卷号 ${esc(e.seed)} · Part ${PARTS[e.part].no} ${PARTS[e.part].n}</b><span>${e.order === 'free' ? `总剩余 ${hclock(totalLeft(e))}` : `本部分还剩 ${clock(e.left[e.part])}`} · 开始于 ${esc(e.d)}</span></div>
      <div class="acts"><button class="btn primary" data-excont>${ic('i-play')}继续上次模考</button><a class="btn ghost" href="paper.html?seed=${encodeURIComponent(e.seed)}">${ic('i-pen')}打印这套</a><button class="btn ghost" data-exquit>${ic('i-x')}放弃</button></div></div>` : '';
    const best = exams.length ? Math.max(...exams.map((x) => meta(x).v)) : 0;
    const box = $('#exam-box');
    box.innerHTML = `<div class="ex-wrap ex-home">
      <div class="sec-h" style="margin-top:4px"><span class="ico m-exam">${ic('i-clip')}</span><h2>在线模考</h2><span class="more">${exams.length ? `做过 ${exams.length} 套` : '130 分钟 · 710 分'}</span></div>
      <div class="card ex-intro m-exam">
        <p>和真题、打印版同结构同题量。默认自由顺序：顶部标签随时切换四个部分、交卷前可以回去改；也可以只练其中几个模块。</p>
        <div class="ex-tiles">${tiles}</div>
        <ul class="ex-rules">
          <li><b>计时</b>每部分有自己的倒计时，只在停留在该部分时走；某部分用完就锁定（能看不能改），不影响其他部分。勾「按真考顺序」则一部分一部分做、交了不能回改。</li>
          <li><b>听力</b>每段录音按顺序只放一遍，原文后按真题格式播报题目、每题留 12 秒作答（可开「练习模式」允许重听）。</li>
          <li><b>计分</b>听力、阅读自动判分，按官方题型分值折算；写作、翻译交卷后按规则自动估分（可手动改档）。自选模块按得分率折算 710（估算）。</li>
          <li><b>保存</b>作答实时存在本机，刷新、关掉页面后点「继续上次模考」接着做（离开模考页时倒计时暂停）。</li>
        </ul>
      </div>
      ${cont}
      ${diagCard()}
      <div class="card ex-start">
        <div class="ex-start-h"><div><b>${e ? '开一套新的' : '开始一套新模考'}</b><span>卷号 <code>${esc(seed)}</code>${presetSeed ? '（打印版带过来的）' : exams.length || e ? '（和上一套零重合）' : ''} · <a href="paper.html?seed=${encodeURIComponent(seed)}">打印这套</a></span></div>
          <button class="btn ghost ex-swap" data-exswap="${esc(seed)}">${ic('i-redo')}换一套</button></div>
        <div id="exSetup">${setupHTML(seed)}</div>
        <div class="ex-opts">
          <label><input type="checkbox" data-exstrict ${pf.strict ? 'checked' : ''}> 按真考顺序（交了不能回改）</label>
          <label><input type="checkbox" data-exfresh ${S.drawFresh !== false ? 'checked' : ''}> 优先抽没做过的题</label>
          <label><input type="checkbox" data-exhreplay ${homeReplay ? 'checked' : ''}> 练习模式：听力允许重听</label>
        </div>
        <div class="ex-go"><button class="btn primary" data-exnew="${esc(seed)}" ${none ? 'disabled' : ''}>${ic('i-clip')}${e ? '放弃进行中的，开始新模考' : pf.mode === 'custom' ? '开始自选模考' : '开始新模考'}</button></div>
        <div class="ex-seed"><label for="exSeed">按卷号做</label><input id="exSeed" class="search" inputmode="numeric" maxlength="8" placeholder="输入卷号，如打印版上的试卷代号" value="${presetSeed ? esc(presetSeed) : ''}"><button class="btn" data-exseed ${none ? 'disabled' : ''}>开始</button></div>
        <p class="ex-tip" id="exTip"></p>
      </div>
      <div class="sec-h"><span class="ico m-exam">${ic('i-timer')}</span><h2>历次模考成绩</h2>${exams.length ? `<span class="more">最高 ${best}</span>` : ''}</div>
      ${trendHTML(exams.slice().reverse())}
      ${exams.length ? `<div class="ex-hlist">${exams.map((x) => { const m = meta(x); const ps = PARTS.filter((p) => x.parts && x.parts[p.k] != null).map((p) => `${p.n} ${fmt1(x.parts[p.k])}`).join(' · '); return `<button class="ex-hrow card" data-exrep="${x.ts}"><span class="ex-ht"><b>${m.v}</b><small>${m.custom ? '折算' : '/710'}</small></span><span class="ex-hm"><b>${esc(x.d)} · 卷号 ${esc(x.seed)}</b><span class="ex-tags"><span class="ex-tag${m.custom ? ' cu' : ''}">${esc(m.tag)}</span><span>得分率 ${m.rate}%</span></span><span>${esc(ps)}</span></span><span class="ex-hgo">查看报告${ic('i-chev-r')}</span></button>`; }).join('')}</div>`
        : `<div class="empty">${ic('i-party')}还没做过模考。留出完整 130 分钟，或先自选一两个模块练手。</div>`}
    </div>`;
    box.querySelectorAll('[data-ind]').forEach((x) => { x.indeterminate = true; });
    box.onclick = (ev) => {
      const t = ev.target;
      if (t.closest('[data-excont]')) { const ee = C().S.exam; if (ee) { delete ee.paused; C().save(); } mode = 'exam'; render(); window.scrollTo(0, 0); return; }
      const qb = t.closest('[data-exquit]'); if (qb) { if (twoStep(qb, '再点一次放弃（作答会清掉）')) { stopLis(); delete C().S.exam; C().save(); nextSeed = 0; render(); } return; }
      const nb = t.closest('[data-exnew]'); if (nb) { if (!C().S.exam || twoStep(nb, '再点一次确认放弃进行中的')) newExam(+nb.dataset.exnew); return; }
      const md = t.closest('[data-exmode]'); if (md) { setPref({ mode: md.dataset.exmode }); keepY(render); return; }
      const ad = t.closest('[data-exadj]'); if (ad) { setPref({ adj: pref().adj + +ad.dataset.exadj }); keepY(render); return; }
      // 换一套：随机换卷号，和当前显示的这套零重合
      const sw = t.closest('[data-exswap]'); if (sw) {
        const S = C().S, fresh = S.drawFresh !== false, cur = +sw.dataset.exswap;
        const avoid = CET6Draw.paperOf(cur, S, fresh).ids;
        getNext(); nextSeed = CET6Draw.pickSeed(avoid, S, fresh, cur) || nextSeed; presetSeed = 0; keepY(render); return;
      }
      if (t.closest('[data-exseed]')) {
        const v = $('#exSeed').value.trim(); const tip = $('#exTip');
        if (!/^\d{1,8}$/.test(v) || !+v) { tip.textContent = '卷号是 1–8 位数字。'; return; }
        if (C().S.exam && !twoStep(t.closest('[data-exseed]'), '再点放弃进行中的')) return;
        newExam(+v); return;
      }
      const dg = t.closest('[data-exdiag]'); if (dg) { if (!C().S.exam || twoStep(dg, '再点一次放弃进行中的，开始诊断')) newExam(getNext(), { diag: true }); return; }
      const rp = t.closest('[data-exrep]'); if (rp) { openReport(+rp.dataset.exrep); }
    };
    box.onchange = (ev) => {
      const t = ev.target;
      if (t.matches('[data-exfresh]')) { C().S.drawFresh = t.checked; C().save(); nextSeed = 0; presetSeed = 0; keepY(render); }
      if (t.matches('[data-exhreplay]')) homeReplay = t.checked;
      if (t.matches('[data-exstrict]')) setPref({ strict: t.checked });
      if (t.matches('[data-exsel]')) { const sel = pref().sel; sel[t.dataset.exsel] = t.checked; setPref({ sel }); keepY(render); }
      if (t.matches('[data-exgrp]')) { const sel = pref().sel, ks = SECS[t.dataset.exgrp], on = !ks.every((k) => sel[k]); ks.forEach((k) => { sel[k] = on; }); setPref({ sel }); keepY(render); }
    };
  }
  const keepY = (fn) => { const y = window.scrollY; fn(); window.scrollTo(0, y); };
  // 两步确认：第一次点按钮换成提示文字，4 秒内再点才执行
  function twoStep(btn, txt) {
    if (btn.dataset.armed && Date.now() - +btn.dataset.armed < 4000) return true;
    btn.dataset.armed = Date.now(); const old = btn.innerHTML; btn.innerHTML = esc(txt); btn.classList.add('armed');
    setTimeout(() => { if (btn.isConnected) { btn.innerHTML = old; btn.classList.remove('armed'); delete btn.dataset.armed; } }, 4000);
    return false;
  }

  /* ---------- 诊断：入口卡 / 时长 / 从首页开始 ---------- */
  let diagMinCache = null;
  function diagMinutes() {
    const S = C().S, seed = getNext(); if (!seed) return 60;
    if (diagMinCache && diagMinCache[0] === seed) return diagMinCache[1];
    const d = CET6Draw.paperOf(seed, S, S.drawFresh !== false).d;
    const m = Math.round(limits(d, DIAG_SEL, 0, false).reduce((a, b) => a + b, 0) / 60);
    diagMinCache = [seed, m]; return m;
  }
  function diagCard() {
    const xs = (C().S.exams || []).filter((x) => x && x.diag), last = xs[xs.length - 1];
    return `<div class="card ex-diag m-exam"><div class="tx"><span class="kind">诊断 · 约 ${diagMinutes()} 分钟</span><b>${last ? '再做一次诊断' : '先做一次诊断'}</b><span>讲座 1 篇 + 长对话 1 篇 + 仔细阅读 1 篇 + 段落匹配 1 篇 + 翻译，测完给出各题型水平、预测分和提分重点，首页每日计划按它排。${last ? `上次 ${esc(last.d)}。` : ''}</span></div>
      <button class="btn primary" data-exdiag>${ic('i-target')}${last ? '重做诊断' : '开始诊断'}</button></div>`;
  }
  // 首页「做一次诊断」：有进行中的模考就停在模考首页（让用户自己选继续还是放弃）
  function startDiag() {
    if (C().S.exam) { mode = 'home'; C().show('exam'); const t = $('#exTip'); if (t) t.textContent = '有一套进行中的模考：继续做完，或在上面「诊断」卡片里放弃它再开始诊断。'; return; }
    C().show('exam', true); newExam(getNext(), { diag: true });
  }

  /* ---------- 考试页 ---------- */
  function renderExam() {
    const e = norm(E()); const Pp = paper(e.ids, e.sel);
    if (!Pp) { delete C().S.exam; C().save(); mode = 'home'; return render(); }
    if (!partOn(e.sel, PARTS[e.part].k)) e.part = selIdx(e.sel)[0];
    if (Pp.R.length && !Pp.R.some((x) => x.key === e.rsec)) e.rsec = Pp.R[0].key;
    const p = PARTS[e.part], free = e.order === 'free', idx = selIdx(e.sel), lk = !!e.locked[e.part];
    const last = idx[idx.length - 1] === e.part;
    let bar;
    if (free) {
      bar = `<div class="ex-bar ${p.mod}" id="exBar"><div class="ex-bar-in">
        <div class="ex-pt"><span class="ex-pno">Part ${p.no} · ${esc(tagOf(e) === '完整模考' ? '自由顺序' : tagOf(e))}</span><b>${p.n}</b></div>
        <div class="ex-cl"><span class="ex-clock" id="exClock">${lk ? '时间到' : clock(e.left[e.part])}</span><span class="ex-prog" id="exProg">总剩余 <b>${hclock(totalLeft(e))}</b></span></div>
        <button class="btn ghost ex-pause" data-expause>${ic('i-pause')}<span>暂停</span><span class="x">并返回</span></button><button class="btn tone ex-next m-exam" data-exfin>交卷</button></div></div>`;
    } else {
      bar = `<div class="ex-bar ${p.mod}" id="exBar"><div class="ex-bar-in">
        <div class="ex-pt"><span class="ex-pno">Part ${p.no} · ${idx.indexOf(e.part) + 1}/${idx.length}</span><b>${p.n}</b></div>
        <div class="ex-cl"><span class="ex-clock" id="exClock">${clock(e.left[e.part])}</span><span class="ex-prog" id="exProg">${progHTML(e)}</span></div>
        <button class="btn ghost ex-pause" data-expause>${ic('i-pause')}<span>暂停</span><span class="x">并返回</span></button><button class="btn tone ex-next" data-exnext>${last ? '交卷' : '交本部分'}</button></div>
        <div class="ex-steps" aria-hidden="true" style="grid-template-columns:repeat(${idx.length},1fr)">${idx.map((i) => `<i class="${i < e.part ? 'done' : i === e.part ? 'on' : ''}"></i>`).join('')}</div></div>`;
    }
    const note = e.note ? `<div class="ex-note">${ic('i-timer')}<span>${esc(e.note)}</span><button class="x" data-exnote aria-label="知道了">${ic('i-x')}</button></div>` : '';
    const lockBar = lk && !e.note ? `<div class="ex-note ex-lk">${ic('i-timer')}<span>本部分时间到，已锁定：可以查看，不能再改。</span></div>` : '';
    let body = '';
    if (p.k === 'write') body = writeHTML(e, Pp, lk);
    else if (p.k === 'listen') body = listenHTML(e, Pp);
    else if (p.k === 'read') body = `<div id="exRd">${readHTML(e, Pp)}</div>`;
    else body = transHTML(e, Pp, lk);
    let foot;
    if (free) {
      const nx = idx.slice(idx.indexOf(e.part) + 1).concat(idx.slice(0, idx.indexOf(e.part))).find((i) => !e.locked[i]);
      const td = todoText(e);
      foot = `<div class="ex-foot"><span>${td ? `可以随时切到别的部分、回来再改。交卷前检查：${esc(td)}。` : '全部答完了，检查一遍就可以交卷。'}</span><div class="acts">${nx != null ? `<button class="btn soft ${PARTS[nx].mod}" data-expart="${nx}">去 Part ${PARTS[nx].no} ${PARTS[nx].n}${ic('i-chev-r')}</button>` : ''}<button class="btn tone m-exam" data-exfin>交卷${ic('i-check')}</button></div></div>`;
    } else {
      const nxi = idx.find((i) => i > e.part);
      foot = `<div class="ex-foot"><span>${last ? '最后一部分，写完就交卷：听力、阅读自动判分，写作、翻译自动估分。' : `做完可以提前交本部分，进入 Part ${PARTS[nxi].no} ${PARTS[nxi].n}；交了不能回头改。`}</span><button class="btn tone ${p.mod}" data-exnext>${last ? '交卷' : '交本部分，进入下一部分'}${ic('i-chev-r')}</button></div>`;
    }
    // 左侧（宽屏）/ 顶部（手机）导航：各部分 + 阅读的小节；真考顺序下只显示进度，不能点
    const ptabs = `<div class="ex-ptabs" role="tablist" style="--n:${idx.length}">${idx.map((i) => { const q = PARTS[i]; const st = free ? '' : i < e.part ? ' done' : ''; return `<button class="ex-ptab ${q.mod}${i === e.part ? ' on' : ''}${e.locked[i] ? ' lock' : ''}${st}" role="tab" ${free ? `data-expart="${i}"` : 'disabled'} aria-selected="${i === e.part}"><span class="t"><i>${q.no}</i>${q.n}</span><span class="s">${tabStat(e, i)}</span></button>`; }).join('')}</div>`;
    // 平板（≥768px）左侧导航可收成窄条（S.exRail = 'min'），手机上导航在顶部、没有这个按钮
    const side = `<aside class="ex-side"><button class="ex-rail-t" data-exrail aria-label="${C().S.exRail === 'min' ? '展开导航' : '收起导航'}" aria-expanded="${C().S.exRail !== 'min'}">${ic(C().S.exRail === 'min' ? 'i-chev-r' : 'i-chev-l')}<span>收起</span></button>${ptabs}${p.k === 'read' && Pp.R.length ? `<div class="ex-side-r" id="exSideR">${rtabsHTML(e, Pp)}</div>` : ''}</aside>`;
    const box = $('#exam-box');
    document.body.classList.add('ex-focus');
    box.innerHTML = `<div class="ex-wrap ex-on ex-p-${p.k}${lk ? ' ex-lockd' : ''}${C().S.exRail === 'min' ? ' ex-rail-min' : ''}">${bar}<div class="ex-layout">${side}<div class="ex-main">${note}${lockBar}${body}${foot}</div></div></div>`;
    box.onclick = onExamClick; box.oninput = onExamInput; box.onchange = null;
    sizeBar(); startTick();
    if (p.k === 'listen') { if (!lk && !e.lis.done && axSi !== e.lis.i && !axReplay) axLoad(e.lis.i, e.lis.t); paintLis(); }
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
  function writeHTML(e, Pp, lk) {
    const W = Pp.d.W;
    return `<div class="ex-col">
      <div class="prompt m-write"><div class="lab">Part I · Writing（${Math.round(e.lim[0] / 60)} 分钟）</div>${promptEn(W.prompt)}${W.chart && window.writingChart ? window.writingChart(W.chart) : ''}</div>
      <div class="wt-ans m-write"><div class="wt-bar"><span class="lab">我的作文</span></div>
        <textarea class="wt-ta" data-exta="write" rows="14" spellcheck="false" autocapitalize="sentences" placeholder="先花 3–5 分钟列提纲，再写 150–200 词……"${lk ? ' readonly' : ''}>${esc(e.ans.write)}</textarea>
        <div class="wt-count" id="exCount">${countHTML(e.ans.write, true)}</div></div></div>`;
  }
  function transHTML(e, Pp, lk) {
    const T = Pp.d.T;
    return `<div class="ex-col">
      <div class="prompt m-trans"><div class="lab">Part IV · Translation（${Math.round(e.lim[3] / 60)} 分钟）</div><p class="ex-dirr"><b>Directions:</b> For this part, you are allowed ${Math.round(e.lim[3] / 60)} minutes to translate a passage from Chinese into English.</p><span class="zh">${esc(T.zh)}</span></div>
      <div class="wt-ans m-trans"><div class="wt-bar"><span class="lab">我的译文</span></div>
        <textarea class="wt-ta" data-exta="trans" rows="12" spellcheck="false" autocapitalize="sentences" placeholder="长句拆短、意思译全，在这里写译文……"${lk ? ' readonly' : ''}>${esc(e.ans.trans)}</textarea>
        <div class="wt-count" id="exCount">${countHTML(e.ans.trans, false)}</div></div></div>`;
  }
  function listenHTML(e, Pp) {
    const total = Pp.L.reduce((a, x) => a + ((audOf(Pp.L.indexOf(x)) || {}).dur || 0), 0);
    const player = `<div class="player au ex-player">
      <button class="play" id="exAuBtn" data-explay aria-label="播放 / 暂停"${e.locked[1] ? ' disabled' : ''}>${ic(AX.paused ? 'i-play' : 'i-pause')}</button>
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
  function rtabsHTML(e, Pp) {
    const cur = Pp.R.find((x) => x.key === e.rsec) || Pp.R[0];
    return `<div class="ex-rtabs">${Pp.R.map((x) => { const n = Object.keys(e.ans.R[x.key] || {}).length; return `<button class="chip m-read${n >= x.t ? ' full' : ''}" data-exrsec="${x.key}" aria-pressed="${x.key === cur.key}"><span class="s">${x.lab[0]}</span>${esc(x.lab[1])}<span class="c">${n}/${x.t}</span></button>`; }).join('')}</div>`;
  }
  function readHTML(e, Pp) {
    const cur = Pp.R.find((x) => x.key === e.rsec) || Pp.R[0];
    const ans = e.ans.R[cur.key] || {};
    const tabs = rtabsHTML(e, Pp);
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
    const nav = `<div class="ex-rnav">${nx ? `<button class="btn soft m-read" data-exrsec="${nx.key}">下一节：${esc(nx.lab[1])}${ic('i-chev-r')}</button>` : `<span>这是阅读最后一节。${e.order === 'free' ? '' : '检查完点「交本部分」。'}</span>`}</div>`;
    return tabs + body + nav;
  }
  function paintRead(keepY) {
    const y = window.scrollY; const box = $('#exRd'); if (!box) return;
    box.innerHTML = readHTML(E(), P); const sr = $('#exSideR'); if (sr) sr.innerHTML = rtabsHTML(E(), P); paintClock();
    if (keepY) window.scrollTo(0, y);
  }
  function onExamClick(ev) {
    const t = ev.target, e = E(); if (!e) return;
    const rl = t.closest('[data-exrail]'); if (rl) { const S0 = C().S; S0.exRail = S0.exRail === 'min' ? '' : 'min'; C().save(); const min = S0.exRail === 'min'; const w = $('#exam-box .ex-wrap'); if (w) w.classList.toggle('ex-rail-min', min); rl.setAttribute('aria-expanded', !min); rl.setAttribute('aria-label', min ? '展开导航' : '收起导航'); rl.innerHTML = `${ic(min ? 'i-chev-r' : 'i-chev-l')}<span>收起</span>`; return; }
    // 暂停并返回：停表、停录音、存好作答和各部分剩余时间，回模考首页（首页点「继续上次模考」接着做）
    if (t.closest('[data-expause]')) { leave(); e.paused = Date.now(); C().save(); mode = 'home'; render(); window.scrollTo(0, 0); return; }
    const nb = t.closest('[data-exnext]'); if (nb) {
      const k = PARTS[e.part].k, idx = selIdx(e.sel), last = idx[idx.length - 1] === e.part;
      const left = k === 'listen' ? P.nL - cntL(e) : k === 'read' ? P.nR - cntR(e) : 0;
      if (twoStep(nb, `${left ? `还有 ${left} 题没答，` : ''}再点一次确认${last ? '交卷' : '交本部分'}`)) advance(false);
      return;
    }
    // 自由顺序：交整卷（两步确认，先列出没答的）
    const fb = t.closest('[data-exfin]'); if (fb) { const td = todoText(e), inBar = !!fb.closest('.ex-bar'); if (twoStep(fb, td ? (inBar ? '有没答完的，再点交卷' : `${td}，再点一次交整卷`) : '再点一次交整卷')) finish(false); return; }
    const pt = t.closest('[data-expart]'); if (pt) { goPart(+pt.dataset.expart); return; }
    if (t.closest('[data-exnote]')) { e.note = ''; C().save(); const n = $('.ex-note'); if (n) n.remove(); renderExam(); return; }
    if (e.locked[e.part] && t.closest('[data-explay],[data-explayset],[data-exl],[data-exblank],[data-exbank],[data-exm],[data-exmc]')) return;
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
    const k = ev.target.dataset.exta; if (!k) return; const e = E(); if (!e || e.locked[e.part]) return;
    e.ans[k] = ev.target.value;
    const c = $('#exCount'); if (c) c.innerHTML = countHTML(e.ans[k], k === 'write');
    paintClock();
    clearTimeout(taT); taT = setTimeout(() => C().save(), 400);
  }

  /* ---------- 报告 ---------- */
  function openReport(ts) { if (!repOf(ts)) return; mode = 'report'; repTs = ts; if ($('#view-exam').hidden) C().show('exam'); else render(); window.scrollTo(0, 0); }
  const bandsHTML = (k, val, bands) => `<div class="ex-bands">${bands.map(([b, rg, txt]) => `<div class="ex-band${val != null && rg.includes(val) ? ' on' : ''}"><div class="bh"><b>${b} 分档</b><span>${esc(txt)}</span></div><div class="bs">${rg.map((v) => `<button class="chip" data-exself="${k}:${v}" aria-pressed="${val === v}">${v}</button>`).join('')}</div></div>`).join('')}
    <div class="ex-band${val === 0 ? ' on' : ''}"><div class="bh"><b>0 分</b><span>白卷、离题，或只抄了题目</span></div><div class="bs"><button class="chip" data-exself="${k}:0" aria-pressed="${val === 0}">0</button></div></div></div>`;
  function verdict(sc) {
    const v = sc.scaled;
    const s = v >= 500 ? `达到 500 目标，稳住。` : v >= 425 ? `过了 425 线，离 500 还差 ${500 - v} 分。` : `离 425 线还差 ${425 - v} 分。`;
    return sc.full ? s : `所选部分得分率 ${Math.round(sc.rate * 100)}%，按比例折算约 ${v} 分（估算）。${s}`;
  }
  const cause = (key, kind) => (window.CET6Learn ? window.CET6Learn.causeHTML(key, kind) : '');
  // 诊断报告顶部：本次各题型得分率 + 预测分 + 建议重点（assets/learn.js diagHTML）
  function diagBlock(rec, sc) {
    if (!rec.diag || !window.CET6Learn) return '';
    const lv = {}; const map = { conv: 'conv', pas: 'passage', lec: 'lecture', mc: 'mc', match: 'match', cloze: 'cloze' };
    Object.entries(sc.sec).forEach(([k, v]) => { if (v.t) lv[map[k]] = v.r / v.t; });
    if (rec.sel.trans) lv.trans = wtScore(rec.self, rec.ag, 'trans') / 15;
    if (rec.sel.write) lv.write = wtScore(rec.self, rec.ag, 'write') / 15;
    return window.CET6Learn.diagHTML(lv);
  }
  function renderReport() {
    const rec = repOf(repTs); migrate(rec); const Pp = build(rec.ids, rec.sel);
    const box = $('#exam-box');
    const delBtn = `<button class="btn ghost ex-del" data-exdel>${ic('i-trash')}删除这条记录</button>`;
    if (!Pp) {
      box.innerHTML = `<div class="ex-wrap"><div class="prac-head"><button class="btn ghost" data-exhome>${ic('i-chev-l')}模考首页</button><h2>模考报告</h2></div><div class="empty">这套卷的部分题目已不在题库里，只能看总分：${rec.total}/710。</div><div class="ex-foot">${delBtn}</div></div>`;
      box.onclick = (ev) => { if (ev.target.closest('[data-exhome]')) { mode = 'home'; render(); } const d = ev.target.closest('[data-exdel]'); if (d && twoStep(d, '再点一次删除（不能恢复）')) delRec(rec); }; return;
    }
    const sc = scoreOf(Pp, rec.ans, rec.self, rec.ag), sel = rec.sel;
    const prow = (n, mod, v, max, sub) => `<div class="ex-prow ${mod}"><span class="pn">${n}</span><span class="bar"><i style="width:${max ? Math.min(100, v / max * 100) : 0}%"></i></span><span class="pv"><b>${fmt1(v)}</b>/${fmt1(max)}</span>${sub ? `<span class="ps">${sub}</span>` : ''}</div>`;
    const secSub = (ks) => ks.filter((k) => sc.sec[k]).map((k) => `${STD[k].name} ${sc.sec[k].r}/${sc.sec[k].t}`).join(' · ');
    const odd = Object.entries(sc.sec).filter(([, v]) => v.odd).map(([k, v]) => `${STD[k].name}本卷 ${v.t} 题（标准 ${STD[k].n} 题），满分仍按 ${fmt1(v.max)} 计，每题 ${fmt1(v.per)} 分`);
    const used = rec.used ? rec.used.reduce((a, b) => a + b, 0) : 0;
    const qd = (n, ok, line, exp) => `<details class="ex-qd ${ok ? 'ok' : 'bad'}"><summary><span class="n">${n}</span><i>${ok ? '✓' : '✗'}</i><span class="ex-qa">${line}</span>${ic('i-chev-r')}</summary><div class="exp">${exp}</div></details>`;
    const mine = (p, f) => p === undefined || p === null ? '未作答' : '你选 ' + f(p);
    const lisHTML = Pp.L.map((x, si) => {
      const a = rec.ans.L[si] || {}, ms = marks('listen', x.set, a);
      return `<div class="ex-rset m-listen"><div class="ex-rsh"><span class="kind">${SEC_L[x.sec][0]} · ${SEC_L[x.sec][1]}</span><b>${esc(x.set.title.replace(/^[^·]+·\s*/, ''))}</b><span class="sc">${ms.filter(Boolean).length}/${ms.length}</span><button class="btn soft m-listen" data-exrev="L:${si}">${ic('i-play')}原文 · 听这句</button></div>
        <div class="ex-qds">${x.set.questions.map((q, qi) => qd(x.n0 + qi, ms[qi], ms[qi] ? `答对 ${K[q.a]}` : `${mine(a[qi], (v) => K[v])} · 答案 ${K[q.a]}`, `<b>${esc(q.q)}</b><br>${K[q.a]}) ${esc(q.opts[q.a])}<br>${esc(q.exp)}${ms[qi] ? '' : cause(x.set.id + ':' + qi, 'listen')}`)).join('')}</div></div>`;
    }).join('');
    const rdHTML = Pp.R.map((x) => {
      const a = rec.ans.R[x.key] || {}, ms = marks(x.kind, x.set, a), s = x.set;
      const rows = ms.map((ok, i) => {
        const cz = ok ? '' : cause(s.id + ':' + i, x.kind);
        if (x.kind === 'cloze') { const ans = s.answers[i]; return qd(x.n0 + i, ok, ok ? `答对 ${ans} ${esc(clozeWord(s, ans))}` : `${a[i] ? '你填 ' + a[i] + ' ' + esc(clozeWord(s, a[i])) : '未作答'} · 答案 ${ans} ${esc(clozeWord(s, ans))}`, esc(s.exp[i] || '') + cz); }
        if (x.kind === 'match') { const it = s.items[i]; return qd(x.n0 + i, ok, ok ? `答对 ${esc(it.a)} 段` : `${a[i] ? '你选 ' + esc(a[i]) + ' 段' : '未作答'} · 答案 ${esc(it.a)} 段`, `<b>${esc(it.s)}</b>${it.exp ? '<br>' + esc(it.exp) : ''}${cz}`); }
        const q = s.questions[i]; return qd(x.n0 + i, ok, ok ? `答对 ${K[q.a]}` : `${mine(a[i], (v) => K[v])} · 答案 ${K[q.a]}`, `<b>${esc(q.q)}</b><br>${K[q.a]}) ${esc(q.opts[q.a])}<br>${esc(q.exp)}${cz}`);
      }).join('');
      return `<div class="ex-rset m-read"><div class="ex-rsh"><span class="kind">${x.lab[0]} · ${esc(x.lab[1])}</span><b>${esc(s.title.replace(/^[^·]+·\s*/, ''))}</b><span class="sc">${ms.filter(Boolean).length}/${ms.length}</span><button class="btn soft m-read" data-exrev="R:${x.key}">${ic('i-target')}原文 · 定位</button></div><div class="ex-qds">${rows}</div></div>`;
    }).join('');
    const W = Pp.d.W, T = Pp.d.T;
    const agFull = { write: sel.write ? G().writing(rec.ans.write, W) : null, trans: sel.trans ? G().translation(rec.ans.trans, T) : null };
    const wtSub = (k) => { const a = rec.ag && rec.ag[k] ? rec.ag[k].score : 0, m = rec.self[k]; return m == null ? `自动估分 ${a} 分` : `手动 ${m} 分（自动估 ${a}）`; };
    const selfCard = (k, mod, title, text, ref, bands, isW) => {
      const a = rec.ag && rec.ag[k] ? rec.ag[k].score : 0, m = rec.self[k];
      return `<div class="ex-self ${mod}"><div class="sec-h"><span class="ico ${mod}">${ic(isW ? 'i-pen' : 'i-swap')}</span><h2>${title}</h2><span class="more">${m == null ? `自动估分 ${a} 分` : `手动 ${m} 分`} × 7.1 = ${fmt1((m == null ? a : m) * 7.1)}</span></div>
      <div class="ex-cmp"><div class="card"><div class="lab">${isW ? '我的作文' : '我的译文'} · ${words(text)} 词</div><div class="ex-mine">${text.trim() ? esc(text) : '<i>（没写）</i>'}</div></div>
      <div class="card"><div class="lab">${isW ? '范文' : '参考译文'}</div><div class="sample ${mod}">${ref}</div></div></div>
      <div class="card ex-ag" data-grk="${k}">${G().panelHTML(agFull[k], { ai: true, manual: true, aiIcon: ic('i-clip') })}${C().openWTItem && text.trim() ? `<div class="ex-rw"><button class="btn soft ${mod}" data-exrewrite="${k}">${ic('i-pen')}去写译页改写这篇</button><span>带上这篇${isW ? '作文' : '译文'}，按最弱一项改一处再估分</span></div>` : ''}</div>
      <div class="ex-mbar"><span>${m == null ? `现在按<b>自动估分 ${a} 分</b>计。对照范文觉得不准，就在下面手动改档（以手动为准）。` : `自动估 <b>${a}</b> 分 · 手动 <b>${m}</b> 分，按手动计。`}</span>${m != null ? `<button class="chip" data-exselfclr="${k}">${ic('i-redo')}改回自动估分</button>` : ''}</div>
      ${bandsHTML(k, m, bands)}</div>`;
    };
    const full = sc.full;
    box.innerHTML = `<div class="ex-wrap ex-rep">
      <div class="prac-head"><button class="btn ghost" data-exhome>${ic('i-chev-l')}模考首页</button><h2>模考报告 · 卷号 ${esc(rec.seed)}</h2></div>
      <div class="result m-exam"><div class="ex-rtag"><span class="ex-tag${full ? '' : ' cu'}">${esc(tagOf(rec))}</span><span class="ex-tag">${rec.order === 'free' ? '自由顺序' : '真考顺序'}</span></div>
        <div class="score">${full ? sc.total : sc.scaled}<small> / 710${full ? '' : ' 折算'}</small></div>
        ${full ? '' : `<p class="ex-raw">所选部分 <b>${fmt1(Object.values(sc.parts).reduce((a, b) => a + b, 0))}</b> / ${fmt1(sc.max)} · 得分率 ${Math.round(sc.rate * 100)}%（折算 = 得分率 × 710，仅为估算）</p>`}
        <p>${esc(verdict(sc))}</p>
        <p class="res-time">${ic('i-timer')}${esc(rec.d)} · 用时 ${Math.round(used / 60)} 分钟${rec.auto ? ' · 到点自动交卷' : ''}</p>
        <div class="ex-lines"><span class="${sc.scaled >= 425 ? 'ok' : ''}">425 ${sc.scaled >= 425 ? '✓' : ''}</span><span class="${sc.scaled >= 500 ? 'ok' : ''}">500 ${sc.scaled >= 500 ? '✓' : ''}</span></div></div>
      ${diagBlock(rec, sc)}
      <div class="card ex-parts">
        ${sc.parts.write != null ? prow('写作', 'm-write', sc.parts.write, sc.pmax.write, wtSub('write')) : ''}
        ${sc.parts.listen != null ? prow('听力', 'm-listen', sc.parts.listen, sc.pmax.listen, secSub(SECS.listen)) : ''}
        ${sc.parts.read != null ? prow('阅读', 'm-read', sc.parts.read, sc.pmax.read, secSub(SECS.read)) : ''}
        ${sc.parts.trans != null ? prow('翻译', 'm-trans', sc.parts.trans, sc.pmax.trans, wtSub('trans')) : ''}
        <p class="ex-calc">按官方结构折算：听力 长对话 / 篇章每题 7.1、讲座每题 14.2；阅读 选词填空每题 3.55、段落匹配 7.1、仔细阅读 14.2；写作、翻译 档分 × 7.1（规则估分，可手动改档）。${odd.length ? `<br>${odd.map(esc).join('；')}。` : ''}${full ? '' : '<br>自选模块只给所选部分打分，710 是按得分率折算的估算。'}正式成绩是常模参照的等值分，这里只是估算。</p>
      </div>
      ${sel.write ? selfCard('write', 'm-write', '写作 · 估分', rec.ans.write, C().hl(W.sample, W.hl), W_BANDS, true) : ''}
      ${sel.trans ? selfCard('trans', 'm-trans', '翻译 · 估分', rec.ans.trans, esc(T.en), T_BANDS, false) : ''}
      ${Pp.L.length ? `<div class="sec-h"><span class="ico m-listen">${ic('i-ear')}</span><h2>听力 · 逐题</h2></div>
      <p class="lead">点题号看解析；「原文 · 听这句」在听读页打开这一段（带你的作答），解析里的引文可以点着定位、重听。</p>
      ${lisHTML}` : ''}
      ${Pp.R.length ? `<div class="sec-h"><span class="ico m-read">${ic('i-book')}</span><h2>阅读 · 逐题</h2></div>
      ${rdHTML}` : ''}
      <div class="ex-foot"><span>${Pp.L.length || Pp.R.length ? '错题已收进「我的 · 错题本」，这几篇也记进了练习记录。' : '作文 / 译文已存进写译页对应题目（原来空着的话）。'}</span><div class="acts">${delBtn}<a class="btn" href="paper.html?seed=${encodeURIComponent(rec.seed)}">${ic('i-pen')}打印这套</a><button class="btn primary" data-exhome>${ic('i-clip')}再来一套</button></div></div>
    </div>`;
    box.oninput = null; box.onchange = null;
    box.onclick = (ev) => {
      const t = ev.target;
      if (t.closest('[data-exhome]')) { mode = 'home'; render(); window.scrollTo(0, 0); return; }
      if (t.closest('[data-dghome]')) { mode = 'home'; C().show('home'); return; }
      const dl = t.closest('[data-exdel]'); if (dl) { if (twoStep(dl, '再点一次删除（不能恢复）')) delRec(rec); return; }
      const sf = t.closest('[data-exself]'), sc0 = t.closest('[data-exselfclr]'); if (sf || sc0) {
        if (sf) { const [k, v] = sf.dataset.exself.split(':'); rec.self[k] = +v; } else rec.self[sc0.dataset.exselfclr] = null;
        if (window.CET6Learn) ['write', 'trans'].forEach((k) => { if (rec.sel[k]) window.CET6Learn.setWtManual(k === 'write' ? W.id : T.id, rec.ts, rec.self[k]); });
        applySc(rec, scoreOf(Pp, rec.ans, rec.self, rec.ag)); C().save();
        keepY(renderReport); return;
      }
      const rw = t.closest('[data-exrewrite]'); if (rw) { const k = rw.dataset.exrewrite; C().openWTItem(k, k === 'write' ? W.id : T.id, rec.ans[k]); return; }
      const ai = t.closest('[data-graicopy]'); if (ai) {
        const k = ai.closest('[data-grk]').dataset.grk, el = ai.closest('[data-grk]');
        G().copyText(G().aiPrompt(k, k === 'write' ? W : T, rec.ans[k]), (ok) => { const st = el.querySelector('.gr-cp'); if (st) st.textContent = ok ? '已复制，粘贴给任意 AI 即可' : ''; });
        return;
      }
      const rv = t.closest('[data-exrev]'); if (rv) {
        const [w, k] = rv.dataset.exrev.split(':'); repY = window.scrollY;
        const back = () => { C().show('exam'); window.scrollTo(0, repY); };
        if (w === 'L') C().reviewSet(Pp.L[+k].set.id, rec.ans.L[+k] || {}, back);
        else { const x = Pp.R.find((r) => r.key === k); C().reviewSet(x.set.id, rec.ans.R[k] || {}, back); }
      }
    };
  }
  function delRec(rec) { const S = C().S; S.exams = (S.exams || []).filter((x) => x !== rec); C().save(); mode = 'home'; nextSeed = 0; render(); window.scrollTo(0, 0); }

  /* ---------- 入口 ---------- */
  function render() {
    const S = C().S;
    if (mode === 'exam' && !S.exam) mode = 'home';
    if (mode === 'report' && !repOf(repTs)) mode = 'home';
    if (mode !== 'exam') { clearInterval(tickId); document.body.classList.remove('ex-focus'); }
    if (mode === 'exam') renderExam(); else if (mode === 'report') renderReport(); else renderHome();
  }
  // 离开模考页：录音暂停、倒计时停（作答已实时保存）
  function leave() { document.body.classList.remove('ex-focus'); clearTimeout(axNextT); if (!AX.paused) AX.pause(); clearInterval(tickId); if (C() && C().S.exam) C().save(); }
  const flush = () => { if (window.CET6 && C().S.exam) C().save(); };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); else lastTick = Date.now(); });
  window.addEventListener('pagehide', flush);
  // 刷新 / 重开页面：有进行中且不是主动暂停的模考，直接回到考试界面
  try { const S0 = JSON.parse(localStorage.getItem('cet6.v1') || '{}'); if (S0.exam && !S0.exam.paused) mode = 'exam'; } catch {}
  // 首页「模考还没做完」横幅：直接进考试
  const resume = () => { const ee = C().S.exam; if (!ee) return; delete ee.paused; C().save(); mode = 'exam'; render(); window.scrollTo(0, 0); };
  window.CET6Exam = { resume, render, leave, openReport, audio: AX, preset: (seed) => { presetSeed = seed; mode = 'home'; }, meta, tagOf, startDiag, diagMinutes, DIAG_SEL };
})();
