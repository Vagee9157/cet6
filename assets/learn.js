/* 学习闭环：测 → 诊断 → 排优先级 → 延迟重测（window.CET6Learn）。数据格式见 README「学习闭环（数据）」。
 * - 题型细分：每条练习记录带 sub（conv / passage / lecture / slowreal / cloze / match / mc），写译估分存 S.wtScore。
 * - predict()：各题型最近几次得分率指数加权（样本少向 60% 收缩），乘官方 710 分结构得分项与总预测分，并给「提分排行」。
 * - 今日计划：按考试日期分阶段（打基础 / 专项 / 冲刺）+ 提分排行 + 每天可用时间，生成 3–5 项任务（当天固定，完成按真实数据判定）。
 * - 错题：错因标签（单选）+ 延迟单题重测（1 / 3 / 7 天间隔，隔天以上连对 2 次移出）；每周错因统计。
 * - 打卡与周报：由练习 / 单词 / 写译估分 / 模考 / 重测记录推算每天学没学。
 * 本文件在 app.js 之前加载，app.js 的工具函数运行时经 window.CET6 取用；入口 init() 由 app.js 启动时调用（做一次幂等迁移）。 */
(() => {
  'use strict';
  const C = () => window.CET6;
  const St = () => C().S;
  const esc = (t) => C().esc(t), ic = (n) => C().ic(n);
  const $ = (s, el = document) => el.querySelector(s);
  const today = () => C().lday();
  const dOf = (ts) => C().lday(new Date(ts));
  const isDay = (x) => typeof x === 'string' && /^\d{4}-\d\d-\d\d$/.test(x);
  const addDays = (ds, n) => { const [y, m, d] = ds.split('-').map(Number); return C().lday(new Date(y, m - 1, d + n)); };
  const dayDiff = (a, b) => { const p = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 864e5); };
  const r1 = (v) => Math.round(v * 10) / 10;
  const fmtPt = (v) => String(r1(v));

  /* ---------- 题型与官方 710 结构 ---------- */
  // n = 标准题量（写译为 15 档分），pt = 每题 / 每档分值；满分 = n × pt
  const TYPES = [
    { k: 'conv', name: '长对话', n: 8, pt: 7.1, part: 'listen', mod: 'm-listen' },
    { k: 'passage', name: '听力篇章', n: 7, pt: 7.1, part: 'listen', mod: 'm-listen' },
    { k: 'lecture', name: '讲座', n: 10, pt: 14.2, part: 'listen', mod: 'm-listen' },
    { k: 'cloze', name: '选词填空', n: 10, pt: 3.55, part: 'read', mod: 'm-read' },
    { k: 'match', name: '段落匹配', n: 10, pt: 7.1, part: 'read', mod: 'm-read' },
    { k: 'mc', name: '仔细阅读', n: 10, pt: 14.2, part: 'read', mod: 'm-read' },
    { k: 'write', name: '写作', n: 15, pt: 7.1, part: 'write', mod: 'm-write', wt: true },
    { k: 'trans', name: '翻译', n: 15, pt: 7.1, part: 'trans', mod: 'm-trans', wt: true },
  ];
  const TMAP = Object.fromEntries(TYPES.map((t) => [t.k, t]));
  const SUB_NAME = { conv: '长对话', passage: '听力篇章', lecture: '讲座', slowreal: '慢速真人', cloze: '选词填空', match: '段落匹配', mc: '仔细阅读', write: '写作', trans: '翻译' };
  const PRIOR = 0.6, K_OBJ = 4, K_WT = 0.5, DECAY = 0.8, N_OBJ = 8, N_WT = 5;

  // 题目 id → sub。真人常速听力用 r.type（conv / lecture）；慢速 VOA 记 'slowreal'（语速约 100 词/分，明显慢于考试，不计入预测）
  let SUBMAP = null;
  function subOf(id) {
    if (!SUBMAP) {
      SUBMAP = {};
      (typeof LISTENING !== 'undefined' ? LISTENING : []).forEach((s) => { SUBMAP[s.id] = s.type; });
      (typeof REAL !== 'undefined' ? REAL : []).forEach((r) => { SUBMAP[r.id] = r.org ? (r.type === 'lecture' ? 'lecture' : 'conv') : 'slowreal'; });
      if (typeof READING !== 'undefined') ['mc', 'match', 'cloze'].forEach((k) => READING[k].forEach((s) => { SUBMAP[s.id] = k; }));
    }
    return SUBMAP[id] || '';
  }
  const kindOfSub = (sub) => (sub === 'conv' || sub === 'passage' || sub === 'lecture' || sub === 'slowreal' ? 'listen' : sub);

  /* ---------- 一次性迁移（幂等）：旧记录补 sub、错题补 due / streak、补容器字段 ---------- */
  function migrate() {
    const s = St(); let ch = false;
    if (!s.wtScore || typeof s.wtScore !== 'object' || Array.isArray(s.wtScore)) { s.wtScore = {}; ch = true; }
    if (!s.causeLog || typeof s.causeLog !== 'object' || Array.isArray(s.causeLog)) { s.causeLog = {}; ch = true; }
    if (!Array.isArray(s.rt)) { s.rt = []; ch = true; }
    (s.hist || []).forEach((h) => { if (h && !h.sub) { const k = subOf(h.id); if (k) { h.sub = k; ch = true; } } });
    Object.entries(s.sets || {}).forEach(([id, r]) => { if (r && !r.sub) { const k = subOf(id); if (k) { r.sub = k; ch = true; } } });
    const t = today();
    Object.values(s.wrong || {}).forEach((w) => {
      if (!w || typeof w !== 'object') return;
      if (!w.sub) { const k = subOf(w.setId || String(w.key || '').split(':')[0]); if (k) { w.sub = k; ch = true; } }
      if (!isDay(w.due)) { w.due = addDays(isDay(w.at) ? w.at : t, 1); ch = true; }
      if (typeof w.streak !== 'number') { w.streak = 0; ch = true; }
    });
    if (ch) C().save();
  }

  /* ---------- 写译估分记录：S.wtScore[题目 id] = [{ts, kind, score, band, via, items, manual?}]，每题最多 10 条 ---------- */
  function logWt(kind, id, r, via, ts) {
    if (!r || !id) return null;
    const s = St(); s.wtScore = s.wtScore || {};
    const arr = Array.isArray(s.wtScore[id]) ? s.wtScore[id] : (s.wtScore[id] = []);
    const x = { ts: ts || Date.now(), kind, score: r.score, band: r.band, via: via || 'wt', items: (r.items || []).map((it) => [it.name, it.pts]) };
    const i = arr.findIndex((y) => y && y.ts === x.ts);
    if (i >= 0) { if (arr[i].manual != null) x.manual = arr[i].manual; arr[i] = x; } else arr.push(x);
    if (arr.length > 10) arr.splice(0, arr.length - 10);
    C().save(); return x;
  }
  // 模考报告里手动改档：同一条（ts 相同）记 manual，predict 以手动为准；null 清掉
  function setWtManual(id, ts, v) {
    const arr = St().wtScore && St().wtScore[id]; if (!Array.isArray(arr)) return;
    const x = arr.find((y) => y && y.ts === ts); if (!x) return;
    if (v == null) delete x.manual; else x.manual = v; C().save();
  }
  const wtVal = (x) => (x.manual != null ? x.manual : x.score);

  /* ---------- 预测分 ---------- */
  // opt.asOf：只用这个时间戳之前的记录（周报算「上周 vs 上上周」用）
  function predict(opt) {
    const s = St(), asOf = (opt && opt.asOf) || Infinity;
    const types = {}; let withData = 0;
    TYPES.forEach((T) => {
      let rate, n, low;
      if (T.wt) {
        const xs = [];
        Object.values(s.wtScore || {}).forEach((arr) => (Array.isArray(arr) ? arr : []).forEach((x) => { if (x && x.kind === T.k && x.ts <= asOf) xs.push(x); }));
        xs.sort((a, b) => b.ts - a.ts);
        let sw = 0, sr = 0;
        xs.slice(0, N_WT).forEach((x, i) => { const w = Math.pow(DECAY, i); sw += w; sr += w * Math.max(0, Math.min(15, wtVal(x))) / 15; });
        rate = (sr + K_WT * PRIOR) / (sw + K_WT); n = xs.length; low = n < 2;
      } else {
        const xs = (s.hist || []).filter((h) => h && h.sub === T.k && h.t > 0 && (h.ts || 0) <= asOf).sort((a, b) => (b.ts || 0) - (a.ts || 0));
        let sw = 0, sr = 0;
        xs.slice(0, N_OBJ).forEach((h, i) => { const w = Math.pow(DECAY, i); sw += w * h.t; sr += w * h.r; });
        n = xs.reduce((a, h) => a + h.t, 0);
        rate = (sr + K_OBJ * PRIOR) / (sw + K_OBJ); low = n < 8;
      }
      if (n) withData++;
      const max = T.n * T.pt, pts = max * rate;
      types[T.k] = { k: T.k, name: T.name, part: T.part, mod: T.mod, wt: !!T.wt, pt: T.pt, max, pts, rate, n, low, room: max - pts, key: T.pt * (1 - rate) };
    });
    const total = Math.round(Object.values(types).reduce((a, x) => a + x.pts, 0));
    const parts = {}; Object.values(types).forEach((x) => { parts[x.part] = (parts[x.part] || 0) + x.pts; });
    Object.keys(parts).forEach((k) => { parts[k] = r1(parts[k]); });
    const hasDiag = (s.exams || []).some((x) => x && x.diag && (x.ts || 0) <= asOf);
    const rank = Object.values(types).sort((a, b) => b.key - a.key || b.room - a.room);
    return { total, parts, types, rank, ready: hasDiag || withData >= 4, hasDiag, withData, gap500: Math.max(0, 500 - total), low: Object.values(types).filter((x) => x.low).map((x) => x.name) };
  }
  const rankText = (x) => (x.wt ? `${x.name}每多 1 分 +${fmtPt(x.pt)}` : `${x.name}每多对 1 题 +${fmtPt(x.pt)}`);

  /* ---------- 错题：错因 + 延迟重测 ---------- */
  const CAUSES = { loc: '定位错', syn: '同义替换没认出', vocab: '生词卡住', trap: '被干扰项骗', ear: '没听清', time: '时间不够' };
  const CAUSE_BY = { listen: ['ear', 'vocab', 'trap', 'time'], mc: ['loc', 'syn', 'vocab', 'trap', 'time'], match: ['loc', 'syn', 'vocab', 'time'], cloze: ['vocab', 'syn', 'trap', 'time'] };
  const CAUSE_TIP = { loc: '先圈题干定位词（人名、数字、专有名词）再回原文找', syn: '对照解析把「题干 / 选项 ↔ 原文」的同义改写记下来', vocab: '把卡住的词收进生词本，背单词时一起复习', trap: '选项里出现原文原词的多半是干扰，先排除绝对化、偷换主体的', ear: '错题片段单句循环精听，跟读到能复述', time: '限时做：仔细阅读 1 篇 9 分钟内、匹配 15 分钟内' };
  const GAPS = [1, 3, 7], CLEAR_AT = 2;
  const wrongKind = (w) => (w.kind && CAUSE_BY[w.kind] ? w.kind : kindOfSub(w.sub) || 'mc');
  const wrongSetId = (w) => w.setId || String(w.key || '').split(':')[0];
  // 交卷（练习 / 模考）写错题：新错或再错 → streak 清零、明天再测，保留之前选的错因；答对 → 隔天以上才计一次 streak，连对 2 次移出
  function applyResult(wrongs, rights) {
    const s = St(), t = today();
    (rights || []).forEach((k) => { if (s.wrong[k]) gotRight(k, t); });
    (wrongs || []).forEach((w) => {
      const prev = s.wrong[w.key];
      const x = Object.assign({}, w, { sub: w.sub || subOf(w.setId), streak: 0, last: t, due: addDays(t, GAPS[0]) });
      if (prev && prev.cause) { x.cause = prev.cause; x.cd = prev.cd; }
      s.wrong[w.key] = x;
    });
  }
  function gotRight(key, t) {
    const s = St(), w = s.wrong[key]; if (!w) return 'none';
    const last = isDay(w.last) ? w.last : isDay(w.at) ? w.at : '';
    if (last && dayDiff(last, t) < 1) return 'same';
    w.streak = (w.streak || 0) + 1; w.last = t;
    if (w.streak >= CLEAR_AT) { delete s.wrong[key]; return 'clear'; }
    w.due = addDays(t, GAPS[Math.min(w.streak, GAPS.length - 1)]); return 'next';
  }
  // 重测答完：记 S.rt（打卡 / 周报用），答对按上面规则，答错重置为 1 天
  function retestAnswer(key, ok) {
    const s = St(), w = s.wrong[key]; if (!w) return 'none'; const t = today();
    s.rt.push({ d: t, ts: Date.now(), key, ok: ok ? 1 : 0, sub: w.sub || '' }); if (s.rt.length > 600) s.rt = s.rt.slice(-600);
    let res;
    if (ok) { res = gotRight(key, t); if (res === 'same') { w.due = addDays(t, GAPS[Math.min(w.streak || 0, GAPS.length - 1)] || 1); res = 'next'; } }
    else { w.streak = 0; w.last = t; w.due = addDays(t, GAPS[0]); res = 'reset'; }
    C().save(); return res;
  }
  function dueList() {
    const t = today();
    return Object.values(St().wrong || {}).filter((w) => w && isDay(w.due) && w.due <= t && C().findSet(wrongSetId(w)))
      .sort((a, b) => a.due.localeCompare(b.due) || String(a.at || '').localeCompare(String(b.at || '')));
  }
  const rtToday = () => (St().rt || []).filter((x) => x.d === today()).length;
  function setCause(key, c) {
    const s = St(), w = s.wrong[key]; if (!w) return;
    s.causeLog = s.causeLog || {};
    if (!c || w.cause === c) { delete w.cause; delete w.cd; delete s.causeLog[key]; }
    else { w.cause = c; w.cd = today(); s.causeLog[key] = { c, d: w.cd, sub: w.sub || '' }; }
    const ks = Object.keys(s.causeLog); if (ks.length > 500) ks.sort((a, b) => s.causeLog[a].d.localeCompare(s.causeLog[b].d)).slice(0, ks.length - 500).forEach((k) => delete s.causeLog[k]);
    C().save();
  }
  function causeHTML(key, kind) {
    const w = St().wrong[key]; if (!w) return '';
    const opts = CAUSE_BY[kind] || CAUSE_BY[wrongKind(w)] || CAUSE_BY.mc;
    return `<div class="cause-row" data-ckey="${esc(key)}"><span class="lab">错因</span>${opts.map((c) => `<button class="chip" type="button" data-cause="${c}" aria-pressed="${w.cause === c}">${CAUSES[c]}</button>`).join('')}</div>`;
  }
  // 错因按钮：全站委托（练习结果页、模考报告、错题本、重测都用），捕获阶段处理，不让外层面板的点击逻辑再处理一次
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-cause]'); if (!b) return;
    const row = b.closest('[data-ckey]'); if (!row || !window.CET6) return;
    e.stopPropagation(); e.preventDefault();
    setCause(row.dataset.ckey, b.dataset.cause);
    const cur = (St().wrong[row.dataset.ckey] || {}).cause;
    row.querySelectorAll('[data-cause]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.cause === cur));
  }, true);
  // 错题本每条下面：错因 + 下次重测时间
  function wrongExtraHTML(w) {
    const t = today(), due = isDay(w.due) ? w.due : t;
    const st = due <= t ? '<b class="due">今天该重测</b>' : `下次重测 ${esc(due.slice(5))}（${dayDiff(t, due)} 天后）`;
    return `${causeHTML(w.key, wrongKind(w))}<div class="wi-due">${ic('i-redo')}<span>${st}${w.streak ? ` · 已隔天连对 ${w.streak} 次，再对 ${CLEAR_AT - w.streak} 次移出` : ''}</span></div>`;
  }

  /* ---------- 打卡：哪些天学过 ---------- */
  function studyDays() {
    const s = St(), set = new Set();
    (s.hist || []).forEach((h) => { if (h && isDay(h.d)) set.add(h.d); });
    Object.values(s.sets || {}).forEach((r) => { if (r && isDay(r.d)) set.add(r.d); });
    Object.values(s.vseen || {}).forEach((d) => { if (isDay(d)) set.add(d); });
    Object.values(s.wtScore || {}).forEach((arr) => (Array.isArray(arr) ? arr : []).forEach((x) => { if (x && x.ts) set.add(dOf(x.ts)); }));
    (s.exams || []).forEach((x) => { if (x && isDay(x.d)) set.add(x.d); });
    (s.rt || []).forEach((x) => { if (x && isDay(x.d)) set.add(x.d); });
    Object.values(s.mastered || {}).forEach((v) => { if (isDay(v)) set.add(v); });
    Object.values(s.cards || {}).forEach((c) => { if (c && isDay(c.last)) set.add(c.last); });   // 关键词卡 / 模板句
    return set;
  }
  // 连续学习天数：今天还没学时从昨天往回数（今天学了就 +1）
  function streak() {
    const set = studyDays(); let d = today(); const todayOn = set.has(d);
    if (!todayOn) d = addDays(d, -1);
    let n = 0; while (set.has(d)) { n++; d = addDays(d, -1); }
    return { n, todayOn };
  }

  /* ---------- 考试日期与每日时间 ---------- */
  // 默认：今天之后最近的 6 月或 12 月第二个周六
  function defaultExamDate() {
    const t = today(), y = +t.slice(0, 4);
    const sat2 = (yy, m) => { const d1 = new Date(yy, m, 1); const add = (6 - d1.getDay() + 7) % 7; return C().lday(new Date(yy, m, 1 + add + 7)); };
    return [sat2(y, 5), sat2(y, 11), sat2(y + 1, 5)].find((d) => d >= t);
  }
  const examDate = () => (isDay(St().examDate) ? St().examDate : defaultExamDate());
  const dailyMin = () => ([30, 60, 90].includes(St().dailyMin) ? St().dailyMin : 60);
  const daysLeft = () => dayDiff(today(), examDate());
  function phase() { const n = daysLeft(); return n > 60 ? { k: 'base', name: '打基础', tip: '词汇 + 技巧，每天听读各一篇' } : n >= 21 ? { k: 'focus', name: '专项提分', tip: '按提分排行加量练分值最高、错得最多的题型' } : { k: 'sprint', name: '考前冲刺', tip: '每周 1–2 套模考，写译每天各产出 1 篇' }; }

  /* ---------- 今日计划 ---------- */
  const LIST_POOL = (sub) => {
    const real = (typeof REAL !== 'undefined' ? REAL : []).filter((r) => r.org && r.questions && r.questions.length && (sub === 'lecture' ? r.type === 'lecture' : r.type !== 'lecture'));
    if (sub === 'conv' || sub === 'passage' || sub === 'lecture') return [...LISTENING.filter((x) => x.type === sub), ...(sub === 'passage' ? [] : real)];
    return READING[sub] || [];
  };
  // 推荐一篇：没做过的优先（按题库顺序），全做过就挑得分率最低的
  function pickSet(sub) {
    const s = St(), pool = LIST_POOL(sub); if (!pool.length) return null;
    const fresh = pool.find((x) => !s.sets[x.id] && !(s.drafts && s.drafts[x.id]));
    if (fresh) return fresh;
    const draft = pool.find((x) => s.drafts && s.drafts[x.id]); if (draft) return draft;
    return pool.slice().sort((a, b) => (s.sets[a.id].r / s.sets[a.id].t) - (s.sets[b.id].r / s.sets[b.id].t))[0];
  }
  // 预计分钟：阅读 set.minutes；听力 时长/60 + 题数 × 0.3；单词 新词 × 0.5 + 复习 × 0.2；写作 / 翻译 30
  function setMin(set) {
    if (!set) return 10;
    if (set.questions && (set.script || set.src)) { const m = C().AUD(set.id); const dur = m ? m.dur : (set.minutes || 4) * 60; return Math.max(3, Math.round(dur / 60 + set.questions.length * 0.3)); }
    return set.minutes || 10;
  }
  const RT_CAP = 10;
  function buildPlan() {
    const s = St(), pr = predict(), ph = phase(), budget = dailyMin(), d = today();
    const cand = [];
    const due = dueList().length;
    if (due) cand.push({ k: 'retest', min: Math.ceil(Math.min(due, RT_CAP) * 1.5), must: 1 });
    const vp = C().dailyPlan();
    const vocab = { k: 'vocab', min: Math.max(3, Math.round(vp.fresh.length * 0.5 + vp.review.length * 0.2)), must: ph.k !== 'sprint' ? 1 : 0 };
    const setTask = (sub) => { const set = pickSet(sub); return set ? { k: 'set', sub, id: set.id, min: setMin(set) } : null; };
    const wtDay = +d.slice(-2) % 2 ? 'trans' : 'write';
    const wtTask = (k) => ({ k: 'wt', sub: k, min: 30 });
    // 关键词卡 / 模板句（assets/recall.js）：今天有到期或新卡额度就排。打基础期有到期复习才往前放；专项期跟在写译后；冲刺期必做
    const ci = window.CET6Recall ? window.CET6Recall.planInfo() : null;
    const cards = (must) => (ci && ci.left ? { k: 'cards', sub: ci.sub, min: ci.min, must: must ? 1 : 0 } : null);
    const objRank = pr.rank.filter((x) => !x.wt);
    const topL = objRank.find((x) => x.part === 'listen'), topR = objRank.find((x) => x.part === 'read');
    if (ph.k === 'base') {
      cand.push(vocab, ci && ci.due ? cards() : null, setTask(topL ? topL.k : 'conv'), setTask(topR ? topR.k : 'mc'), outlineTask(pr), wtTask(wtDay), cards());
    } else if (ph.k === 'focus') {
      const tops = pr.rank.slice(0, 3).map((x) => (x.wt ? wtTask(x.k) : setTask(x.k)));
      cand.push(tops[0], tops[1], vocab, wtTask(wtDay), cards(), tops[2]);
    } else {
      const lastFull = (s.exams || []).filter((x) => x && x.mode === 'full').map((x) => x.d).filter(isDay).sort().pop();
      if (!lastFull || dayDiff(lastFull, d) >= 4) cand.push({ k: 'exam', min: 130, must: 1 });
      cand.push(wtTask('write'), wtTask('trans'), cards(true), setTask(objRank[0].k), vocab);
    }
    const tasks = []; let tot = 0; const seen = new Set();
    cand.filter(Boolean).forEach((c) => {
      const id = c.k + ':' + (c.sub || '') + ':' + (c.id || ''); if (seen.has(id) || tasks.length >= 5) return;
      if (c.must || tasks.length < 3 || tot + c.min <= budget * 1.1) { tasks.push(c); tot += c.min; seen.add(id); }
    });
    return tasks;
  }
  function outlineTask(pr) {
    const parts = pr.rank.map((x) => x.part).filter((p, i, a) => a.indexOf(p) === i).concat(['vocab', 'exam']);
    const ch = parts.map((p) => CHAPTERS.find((c) => c.id === p)).find((c) => c && c.points.some((p, i) => !St().mastered[c.id + ':' + i])) || CHAPTERS[0];
    return { k: 'outline', ch: ch.id, min: 10 };
  }
  // 当天固定一份（考试日期 / 每日时间改了就重排）；完成状态每次按真实数据现算
  function planToday() {
    const s = St(), d = today(), key = `${d}|${dailyMin()}|${examDate()}`;
    if (!s.dayPlan || s.dayPlan.key !== key || !Array.isArray(s.dayPlan.tasks)) { s.dayPlan = { key, d, tasks: buildPlan() }; C().save(); }
    const tasks = s.dayPlan.tasks.map((t) => Object.assign({}, t, taskStatus(t)));
    return { tasks, total: tasks.reduce((a, t) => a + t.min, 0), done: tasks.filter((t) => t.done).length, budget: dailyMin(), phase: phase(), days: daysLeft(), date: examDate() };
  }
  function taskStatus(t) {
    const s = St(), d = today();
    if (t.k === 'retest') {
      const left = dueList().length, did = rtToday(), n = Math.min(left, RT_CAP);
      return { done: !left && did > 0, f: did + left ? did / (did + Math.min(left, RT_CAP)) : 1, title: left ? `错题重测 ${n} 道${left > RT_CAP ? `（共 ${left}）` : ''}` : '错题重测', p: left ? `今天已测 ${did}` : did ? `已测 ${did} 道` : '今天没有到期的', mod: 'm-read' };
    }
    if (t.k === 'vocab') {
      const vp = C().dailyPlan(), vd = vp.order.filter((id) => s.vseen[id] === d).length, tot = vp.order.length;
      return { done: tot > 0 && vd >= tot, f: tot ? vd / tot : 1, title: `背 ${vp.fresh.length} 个新词 + 复习`, p: tot ? `${vd}/${tot}` : '今日无词', mod: 'm-vocab' };
    }
    if (t.k === 'set') {
      const f = C().findSet(t.id), done = (s.hist || []).some((h) => h && h.d === d && h.sub === t.sub);
      return { done, f: done ? 1 : 0, title: `${SUB_NAME[t.sub]} 1 篇`, p: f ? f.set.title.replace(/^[^·]+·\s*/, '') : '', mod: kindOfSub(t.sub) === 'listen' ? 'm-listen' : 'm-read' };
    }
    if (t.k === 'wt') {
      const done = Object.values(s.wtScore || {}).some((arr) => (Array.isArray(arr) ? arr : []).some((x) => x && x.kind === t.sub && dOf(x.ts) === d));
      return { done, f: done ? 1 : 0, title: t.sub === 'write' ? '写 1 篇作文并估分' : '译 1 段并估分', p: '写完点「估分」', mod: t.sub === 'write' ? 'm-write' : 'm-trans' };
    }
    if (t.k === 'cards') {
      const ci = window.CET6Recall ? window.CET6Recall.planInfo() : null; if (!ci) return { done: false, f: 0, title: '关键词卡 / 模板句', p: '', mod: 'm-trans' };
      const n = Math.min(ci.left, 40);
      return { done: !ci.left && ci.did > 0, f: ci.did + ci.left ? ci.did / (ci.did + n) : 1, title: ci.left ? `关键词卡 / 模板句 ${ci.left} 张` : '关键词卡 / 模板句', p: ci.left ? `到期 ${ci.due} · 新卡 ${ci.left - ci.due}${ci.did ? ` · 今天已练 ${ci.did}` : ''}` : ci.did ? `今天已练 ${ci.did} 张` : '今天没有到期的', mod: t.sub === 'hl' ? 'm-write' : 'm-trans' };
    }
    if (t.k === 'outline') {
      const c = CHAPTERS.find((x) => x.id === t.ch) || CHAPTERS[0], n = Object.keys(s.mastered || {}).filter((k) => k.startsWith(c.id + ':') && s.mastered[k] === d).length;
      return { done: n >= 2, f: Math.min(1, n / 2), title: `看考点：${c.name}`, p: `今天勾了 ${n}/2 条`, mod: 'm-exam' };
    }
    if (t.k === 'exam') {
      const done = (s.exams || []).some((x) => x && x.d === d && x.mode === 'full');
      return { done, f: done ? 1 : 0, title: '完整模考 1 套', p: '冲刺期每周 1–2 套', mod: 'm-exam' };
    }
    return { done: false, f: 0, title: '', p: '', mod: '' };
  }
  function planHTML() {
    const pl = planToday();
    const tasks = pl.tasks.map((t, i) => `<button class="hm-task lp-task ${t.mod} ${t.done ? 'done' : ''}" data-lgo="${i}"><span class="n">${t.done ? ic('i-check') : i + 1}</span><span class="lp-tt"><b>${esc(t.title)}</b><span class="lp-sub">${esc(t.p)}</span></span><span class="lp-min">${t.min}′</span><span class="pg"><span class="bar"><i style="width:${Math.round(t.f * 100)}%"></i></span><span class="tx">${t.done ? '已完成' : Math.round(t.f * 100) + '%'}</span></span></button>`).join('');
    return `<div class="sec-h hm-h"><span class="ico m-exam">${ic('i-flame')}</span><h2>今日计划</h2><span class="more">${pl.done}/${pl.tasks.length} 完成 · 约 ${pl.total} 分钟</span><button class="chip lp-set-btn" data-lset aria-expanded="${setOpen}">${ic('i-timer')}设置</button></div>
      <div class="lp-phase"><b>${esc(pl.phase.name)}</b><span>${pl.days >= 0 ? `距考试 ${pl.days} 天（${esc(pl.date)}）` : '考试日期已过，点「设置」改一下'} · ${esc(pl.phase.tip)}</span></div>
      ${setOpen ? settingsHTML() : ''}
      <div class="hm-plan lp-plan">${tasks}</div>`;
  }
  let setOpen = false;
  function settingsHTML() {
    return `<div class="card lp-settings"><label class="lp-row"><span>考试日期</span><input type="date" data-lexam value="${esc(examDate())}"><button class="btn ghost" data-lexamreset ${isDay(St().examDate) ? '' : 'disabled'}>恢复默认</button></label>
      <div class="lp-row"><span>每天可用</span>${[30, 60, 90].map((m) => `<button class="chip" data-lmin="${m}" aria-pressed="${dailyMin() === m}">${m} 分钟</button>`).join('')}</div>
      <p class="lp-note">默认考试日期是最近的 6 月 / 12 月第二个周六，以准考证为准。计划按剩余天数分阶段：60 天以上打基础，21–60 天专项提分，21 天内冲刺。</p></div>`;
  }
  // 首页点击：返回 true 表示已处理
  function homeClick(e) {
    if (e.target.closest('[data-lset]')) { setOpen = !setOpen; C().renderHome(); return true; }
    const mn = e.target.closest('[data-lmin]'); if (mn) { St().dailyMin = +mn.dataset.lmin; C().save(); C().renderHome(); return true; }
    if (e.target.closest('[data-lexamreset]')) { delete St().examDate; C().save(); C().renderHome(); return true; }
    if (e.target.closest('[data-weekx]')) { St().weekSeen = weekStart(); C().save(); const el = $('.lw-card'); if (el) el.remove(); return true; }
    if (e.target.closest('[data-diag]')) { if (window.CET6Exam) window.CET6Exam.startDiag(); return true; }
    if (e.target.closest('[data-rtgo]')) { openRetest(); return true; }
    const g = e.target.closest('[data-lgo]'); if (!g) return false;
    const t = (St().dayPlan.tasks || [])[+g.dataset.lgo]; if (!t) return true;
    goTask(t); return true;
  }
  function goTask(t) {
    if (t.k === 'retest') return openRetest();
    if (t.k === 'vocab') return C().openVocabDaily();
    if (t.k === 'set') { const st = St(); const id = st.sets[t.id] && taskStatus(t).done ? t.id : (pickSet(t.sub) || {}).id || t.id; return C().goSet(id); }
    if (t.k === 'wt') return C().openWT(t.sub);
    if (t.k === 'cards') { const ci = window.CET6Recall && window.CET6Recall.planInfo(); return C().openWT(ci ? (ci.tk.left || !ci.hl.left ? 'tk' : 'hl') : 'tk'); }
    if (t.k === 'outline') return C().openOutline(t.ch);
    if (t.k === 'exam') return C().show('exam');
  }
  function homeChange(e) {
    const x = e.target.closest('[data-lexam]'); if (!x) return false;
    if (isDay(x.value)) { St().examDate = x.value; C().save(); C().renderHome(); }
    return true;
  }

  /* ---------- 首页 hero / 提分排行 ---------- */
  function heroInfo() { const pr = predict(), sk = streak(); return { pr, streak: sk, days: daysLeft(), date: examDate() }; }
  function rankHTML(pr) {
    const top = pr.rank.slice(0, 3);
    return `<div class="card lr-card"><div class="lr-h"><b>提分排行</b><span>按单题分值 × 当前错误率排，${pr.ready ? '越靠前越值得练' : '先做诊断才准'}</span></div>
      <ol class="lr-list">${top.map((x, i) => `<li class="${x.mod}"><span class="no">${i + 1}</span><span class="nm"><b>${esc(rankText(x))}</b><span>当前 ${Math.round(x.rate * 100)}%${x.low ? ' · <i>数据不足</i>' : ''} · 可提 ${Math.round(x.room)} 分</span></span><span class="pt">${Math.round(x.pts)}<small>/${Math.round(x.max)}</small></span></li>`).join('')}</ol>
      ${pr.low.length && pr.ready ? `<p class="lr-note">${esc(pr.low.join('、'))}数据不足，暂按 60% 估。</p>` : ''}</div>`;
  }

  /* ---------- 周报 ---------- */
  function weekStart(ds) { ds = ds || today(); const [y, m, d] = ds.split('-').map(Number); const dt = new Date(y, m - 1, d); const k = (dt.getDay() + 6) % 7; return C().lday(new Date(y, m - 1, d - k)); }
  function weekStats(mon) {
    const s = St(), end = addDays(mon, 6), inW = (d) => isDay(d) && d >= mon && d <= end;
    const days = [...studyDays()].filter(inW).length;
    const qs = (s.hist || []).filter((h) => h && inW(h.d)).reduce((a, h) => a + (h.t || 0), 0) + (s.rt || []).filter((x) => inW(x.d)).length;
    const cs = {}; Object.values(s.causeLog || {}).forEach((x) => { if (x && inW(x.d)) cs[x.c] = (cs[x.c] || 0) + 1; });
    return { days, qs, causes: cs };
  }
  function weekReport() {
    const mon = weekStart(), s = St();
    if (s.weekSeen === mon) return null;
    const lastMon = addDays(mon, -7), w = weekStats(lastMon);
    if (!w.days) return null;
    const endTs = (ds) => { const [y, m, d] = ds.split('-').map(Number); return new Date(y, m - 1, d + 1).getTime() - 1; };
    const a = predict({ asOf: endTs(addDays(mon, -1)) }), b = predict({ asOf: endTs(addDays(lastMon, -1)) });
    const topC = Object.entries(w.causes).sort((x, y) => y[1] - x[1])[0];
    const now = predict();
    return { mon, lastMon, days: w.days, qs: w.qs, pred: a.ready ? a.total : null, delta: a.ready && b.ready ? a.total - b.total : null, cause: topC ? { c: topC[0], n: topC[1] } : null, focus: now.rank[0] };
  }
  function weekHTML() {
    const r = weekReport(); if (!r) return '';
    const dl = r.delta == null ? '' : r.delta > 0 ? `<b class="up">+${r.delta}</b>` : r.delta < 0 ? `<b class="down">${r.delta}</b>` : '<b>持平</b>';
    return `<div class="card lw-card m-exam"><div class="lw-h"><b>上周周报</b><span>${esc(r.lastMon.slice(5))} – ${esc(addDays(r.lastMon, 6).slice(5))}</span><button class="x" data-weekx aria-label="关闭周报">${ic('i-x')}</button></div>
      <div class="lw-nums"><div><b>${r.days}<small>/7</small></b><span>学习天数</span></div><div><b>${r.qs}</b><span>做题量</span></div><div><b>${r.pred == null ? '—' : r.pred}</b><span>周末预测 ${dl}</span></div></div>
      <ul class="lw-tips">${r.cause ? `<li><b>头号错因</b>${esc(CAUSES[r.cause.c])}（${r.cause.n} 次）：${esc(CAUSE_TIP[r.cause.c])}</li>` : '<li><b>头号错因</b>上周没标错因。交卷后在错题下面点一下错因，周报才能帮你找规律。</li>'}
        ${r.focus ? `<li><b>下周重点</b>${esc(r.focus.name)}（当前 ${Math.round(r.focus.rate * 100)}%，${esc(rankText(r.focus))}）</li>` : ''}</ul></div>`;
  }

  /* ---------- 我的页：待重测 + 每周错因小图 ---------- */
  function meTopHTML() {
    const n = dueList().length, did = rtToday();
    return `<div class="card lm-rt m-read"><div class="tx"><b>${n ? `${n} 道错题到期待重测` : did ? `今天已重测 ${did} 道` : '今天没有到期的错题'}</b><span>错题隔 1 / 3 / 7 天单题重测，隔天以上连续答对 2 次才移出错题本。</span></div>${n ? `<button class="btn primary" data-rtgo>${ic('i-redo')}开始重测</button>` : ''}</div>`;
  }
  function causeChartHTML() {
    const mon = weekStart(), cur = weekStats(mon).causes, prev = weekStats(addDays(mon, -7)).causes;
    const ks = Object.keys(CAUSES).filter((k) => cur[k] || prev[k]);
    if (!ks.length) return `<div class="card lc-card"><div class="lc-h"><b>本周错因</b><span>交卷后在错题下点错因，这里按周统计</span></div></div>`;
    const mx = Math.max(1, ...ks.map((k) => Math.max(cur[k] || 0, prev[k] || 0)));
    return `<div class="card lc-card"><div class="lc-h"><b>本周错因</b><span><i class="k"></i>本周 <i class="k pv"></i>上周</span></div>
      <div class="lc-rows">${ks.sort((a, b) => (cur[b] || 0) - (cur[a] || 0)).map((k) => `<div class="lc-row"><span class="nm">${CAUSES[k]}</span><span class="bars"><i style="width:${(cur[k] || 0) / mx * 100}%"></i><i class="pv" style="width:${(prev[k] || 0) / mx * 100}%"></i></span><span class="v">${cur[k] || 0}<small> / ${prev[k] || 0}</small></span></div>`).join('')}</div></div>`;
  }

  /* ---------- 错题重测：单题渲染、作答即判 ---------- */
  const RA = new Audio(); RA.preload = 'auto';
  let rt = null, raRange = null;
  RA.addEventListener('timeupdate', () => { if (raRange && RA.currentTime >= raRange[1]) RA.pause(); paintRA(); });
  ['play', 'pause', 'ended'].forEach((ev) => RA.addEventListener(ev, paintRA));
  function paintRA() { const b = $('#rtAu'); if (b) b.innerHTML = `${ic(RA.paused ? 'i-play' : 'i-pause')}${RA.paused ? '播放相关片段' : '暂停'}`; }
  function raPlay(m, a, b) {
    if (!RA.paused && raRange && raRange[0] === a) { RA.pause(); return; }
    C().stopAudio(); raRange = [a, b];
    const s = St(); const rate = m.real ? (m.slow ? s.realRate || 1.2 : s.normRate || 1) : s.rate || 1;
    const go = () => { try { RA.currentTime = a; } catch {} RA.playbackRate = rate; RA.play().catch(() => {}); };
    if (RA.dataset.src !== m.src) { RA.dataset.src = m.src; RA.src = m.src; RA.addEventListener('loadedmetadata', go, { once: true }); RA.load(); } else go();
  }
  const stopRA = () => { RA.pause(); raRange = null; };
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('nav.tabs')) { stopRA(); rt = null; } }, true);

  function openRetest() {
    const q = dueList().slice(0, RT_CAP).map((w) => w.key);
    rt = { q, i: 0, pick: null, res: null, ok: 0, items: {} };
    C().show('me', true); renderRetest(); window.scrollTo(0, 0);
  }
  // 准备一道：题型、题干、选项、上下文
  function prep(key) {
    if (rt.items[key]) return rt.items[key];
    const w = St().wrong[key]; if (!w) return null;
    const f = C().findSet(wrongSetId(w)); if (!f) return null;
    const i = +String(key).split(':').pop(), set = f.set, kind = f.kind;
    const it = { key, w, kind, set, i };
    if (kind === 'cloze') { it.ans = set.answers[i]; it.ctx = w.ctx || C().clozeCtx(set, i); it.opts = set.bank.map((b) => [b[0], b]); }
    else if (kind === 'match') {
      const item = set.items[i]; it.ans = item.a; it.stem = item.s; it.exp = item.exp || '';
      const L = set.paras.map((p) => p[0]); const mine = String(w.mine || '').replace(/\s*段$/, '');
      const pool = [item.a]; if (L.includes(mine) && mine !== item.a) pool.push(mine);
      const rest = C().shuffle(L.filter((l) => !pool.includes(l))); while (pool.length < 3 && rest.length) pool.push(rest.shift());
      it.paras = set.paras.filter((p) => pool.includes(p[0]));
    } else {
      const q = set.questions[i]; it.ans = q.a; it.stem = q.q; it.exp = q.exp; it.opts = q.opts.map((o, k) => [k, `${'ABCD'[k]}  ${o}`]);
      const loc = C().qLoc(kind, set, i);
      if (kind === 'mc') it.paraIdx = loc && loc.hits.length ? [...new Set(loc.hits)].sort((a, b) => a - b) : null;
      else {
        const m = C().AUD(set.id); it.m = m;
        if (m && loc && loc.hits.length) {
          const segs = m.segs; let a = Math.min(...loc.hits), b = Math.max(...loc.hits);
          const okSeg = (j) => segs[j] && segs[j][2] !== 'Q';
          while (segs[b][1] - segs[a][0] < 15 && (okSeg(a - 1) || okSeg(b + 1))) { if (okSeg(a - 1)) a--; if (segs[b][1] - segs[a][0] < 15 && okSeg(b + 1)) b++; }
          it.range = [Math.max(0, segs[a][0] - 0.3), segs[b][1] + 0.3]; it.segIdx = [a, b];
        }
      }
    }
    rt.items[key] = it; return it;
  }
  function renderRetest() {
    const box = $('#me-box'); if (!rt) return;
    const head = (n) => `<div class="prac-head"><button class="btn ghost" data-rtback>${ic('i-chev-l')}错题本</button><h2>错题重测</h2>${n || ''}</div>`;
    while (rt.i < rt.q.length && !prep(rt.q[rt.i])) rt.i++;
    if (rt.i >= rt.q.length) {
      const left = dueList().length;
      box.innerHTML = `<div class="rt-wrap">${head()}<div class="result m-read"><div class="score">${rt.ok}<small> / ${rt.q.length}</small></div><p>${rt.q.length ? '这一轮重测完了。答对的按 3 / 7 天间隔再测，答错的明天再来。' : '今天没有到期的错题。'}</p></div>
        <div class="submit-bar done-bar">${left ? `<button class="btn primary" data-rtmore>${ic('i-redo')}再测 ${Math.min(left, RT_CAP)} 道（还有 ${left}）</button>` : ''}<button class="btn" data-rtback>回错题本</button><button class="btn" data-rthome>回首页</button></div></div>`;
      box.onclick = rtClick; return;
    }
    const it = prep(rt.q[rt.i]), done = rt.res !== null, kind = it.kind;
    const mod = kind === 'listen' ? 'm-listen' : 'm-read';
    const src = `${esc(String(it.w.src || '').replace(/^([^·]+?)\s*·\s*\1\s*·\s*/, '$1 · '))} · 第 ${it.i + 1} ${kind === 'cloze' ? '空' : '题'}`;
    let ctx = '', choices = '';
    const btn = (v, label, cls) => `<button class="opt${cls}" data-rtpick="${esc(String(v))}" ${done ? 'disabled' : ''}>${label}</button>`;
    const cls = (v) => (done ? (v === it.ans ? ' right' : v === rt.pick ? ' wrong' : '') : '');
    if (kind === 'cloze') {
      ctx = `<div class="rt-ctx serif">${esc(it.ctx).replace(/_{2,}/g, '<b class="gap">&nbsp;</b>')}</div>`;
      choices = `<div class="bank rt-bank">${it.opts.map(([v, l]) => `<button class="chip${done ? (v === it.ans ? ' rt-right' : v === rt.pick ? ' rt-wrong' : '') : ''}" data-rtpick="${esc(v)}" ${done ? 'disabled' : ''}>${esc(l)}</button>`).join('')}</div>`;
    } else if (kind === 'match') {
      ctx = `<p class="rt-hint">信息出自下面哪一段？（从原文 ${it.set.paras.length} 段里挑了 3 段）</p><div class="passage rt-pass">${it.paras.map(([l, t]) => `<p><span class="pl">${esc(l)}</span>${esc(t)}</p>`).join('')}</div>`;
      choices = `<div class="q m-read"><div class="qt"><span class="n">?</span><span>${esc(it.stem)}</span></div><div class="letters">${it.paras.map(([l]) => `<button class="${done ? (l === it.ans ? 'right' : l === rt.pick ? 'wrong' : '') : ''}" data-rtpick="${esc(l)}" ${done ? 'disabled' : ''}>${esc(l)}</button>`).join('')}</div></div>`;
    } else if (kind === 'mc') {
      const ps = it.set.text.split('\n');
      ctx = it.paraIdx ? `<p class="rt-hint">原文相关段落</p><div class="passage rt-pass">${it.paraIdx.map((k) => `<p>${esc(ps[k] || '')}</p>`).join('')}</div>`
        : `<details class="src-fold m-read"${done ? ' open' : ''}><summary>${ic('i-eye')}<b>原文</b><span>没定位到具体段落，展开全文</span>${ic('i-chev-r')}</summary><div class="passage">${ps.map((p) => `<p>${esc(p)}</p>`).join('')}</div></details>`;
      choices = `<div class="q m-read"><div class="qt"><span class="n">?</span><span>${esc(it.stem)}</span></div><div class="opts">${it.opts.map(([v, l]) => btn(v, `<span class="k">${'ABCD'[v]}</span><span>${esc(l.slice(3))}</span>`, cls(v))).join('')}</div></div>`;
    } else {
      const m = it.m;
      if (m && it.range) {
        const tr = m.segs.slice(it.segIdx[0], it.segIdx[1] + 1).map((sg) => esc(sg[3])).join(' ');
        ctx = `<div class="rt-au"><button class="btn tone m-listen" id="rtAu" data-rtau>${ic('i-play')}播放相关片段</button><span>${C().mmss(Math.floor(it.range[0]))}–${C().mmss(Math.ceil(it.range[1]))} · 约 ${Math.round(it.range[1] - it.range[0])} 秒</span></div>
          <details class="src-fold m-listen"${done ? ' open' : ''}><summary>${ic('i-eye')}<b>这段原文</b><span>先听再看</span>${ic('i-chev-r')}</summary><div class="script">${tr}</div></details>`;
      } else {
        const text = m && m.segs ? m.segs.filter((sg) => sg[2] !== 'Q').map((sg) => sg[3]).join(' ') : String(it.set.script || '');
        ctx = `<details class="src-fold m-listen" open><summary>${ic('i-eye')}<b>原文</b><span>这题没有对齐的录音片段，读原文作答</span>${ic('i-chev-r')}</summary><div class="script">${esc(text)}</div></details>`;
      }
      choices = `<div class="q m-listen"><div class="qt"><span class="n">?</span><span>${esc(it.stem)}</span></div><div class="opts">${it.opts.map(([v, l]) => btn(v, `<span class="k">${'ABCD'[v]}</span><span>${esc(l.slice(3))}</span>`, cls(v))).join('')}</div></div>`;
    }
    const ansLabel = kind === 'cloze' ? `${it.ans} ${esc(C().clozeWord(it.set, it.ans))}` : kind === 'match' ? `${esc(it.ans)} 段` : `${'ABCD'[it.ans]}`;
    const RES = { clear: '隔天以上连对 2 次，已移出错题本。', next: `答对了，${it.w.streak || 1} 次连对，${esc((St().wrong[it.key] || {}).due ? St().wrong[it.key].due.slice(5) : '')} 再测一次。`, reset: '答错了，明天再测。', none: '' };
    const expT = kind === 'cloze' ? (it.set.exp[it.i] || '') : it.exp || '';
    const res = done ? `<div class="exp rt-res ${rt.res === 'reset' ? 'bad' : 'ok'}"><b class="vd ${rt.res === 'reset' ? 'bad' : 'ok'}">${rt.res === 'reset' ? '✗ 答错' : '✓ 答对'}</b> · 正确答案 ${ansLabel}。${esc(expT)}<div class="rt-sched">${RES[rt.res] || ''}</div>${rt.res === 'reset' ? causeHTML(it.key, kind) : ''}</div>` : '';
    box.innerHTML = `<div class="rt-wrap">${head(`<span class="rt-n tabular">${rt.i + 1} / ${rt.q.length}</span>`)}
      <div class="rt-card card ${mod}"><div class="src">${src}</div>${ctx}${choices}${res}</div>
      <div class="submit-bar">${done ? `<button class="btn primary" data-rtnext>${rt.i + 1 < rt.q.length ? '下一道' : '看结果'}${ic('i-chev-r')}</button>` : `<button class="btn ghost" data-rtskip>跳过这道</button>`}</div></div>`;
    box.onclick = rtClick;
  }
  function rtClick(e) {
    if (e.target.closest('[data-rtback]')) { stopRA(); rt = null; C().show('me'); return; }
    if (e.target.closest('[data-rthome]')) { stopRA(); rt = null; C().show('home'); return; }
    if (e.target.closest('[data-rtmore]')) { openRetest(); return; }
    if (e.target.closest('[data-rtnext]') || e.target.closest('[data-rtskip]')) { stopRA(); rt.i++; rt.pick = null; rt.res = null; renderRetest(); window.scrollTo(0, 0); return; }
    if (e.target.closest('[data-rtau]')) { const it = prep(rt.q[rt.i]); if (it && it.m && it.range) raPlay(it.m, it.range[0], it.range[1]); return; }
    const p = e.target.closest('[data-rtpick]'); if (!p || rt.res !== null) return;
    const it = prep(rt.q[rt.i]); const v = it.kind === 'mc' || it.kind === 'listen' ? +p.dataset.rtpick : p.dataset.rtpick;
    rt.pick = v; const ok = v === it.ans; if (ok) rt.ok++;
    rt.res = retestAnswer(it.key, ok);
    const y = window.scrollY; renderRetest(); window.scrollTo(0, y);
  }

  /* ---------- 诊断报告结论（exam.js 报告顶部用） ---------- */
  // lv：{k: 得分率 0–1}（本次诊断各题型）
  function diagHTML(lv) {
    const pr = predict();
    const lab = (r) => (r >= 0.8 ? ['稳', 'ok'] : r >= 0.6 ? ['一般', 'mid'] : ['要补', 'bad']);
    const rows = Object.entries(lv).map(([k, r]) => { const [t, c] = lab(r); return `<div class="dg-row ${TMAP[k].mod}"><span class="nm">${esc(TMAP[k].name)}</span><span class="bar"><i style="width:${Math.round(r * 100)}%"></i></span><span class="v">${Math.round(r * 100)}%</span><span class="lv ${c}">${t}</span></div>`; }).join('');
    const top = pr.rank.slice(0, 3);
    return `<div class="card dg-card m-exam"><div class="dg-h"><b>诊断结论</b><span>预测 <b class="big">${pr.total}</b> / 710${pr.gap500 ? ` · 离 500 还差 ${pr.gap500} 分` : ' · 已到 500'}</span></div>
      <div class="dg-rows">${rows}</div>
      <p class="dg-sum"><b>建议重点</b>${top.map((x, i) => `${i + 1}. ${esc(x.name)}（${esc(rankText(x))}）`).join('；')}。今日计划已按这个排好，回首页就能看到。没测到的题型（${esc(pr.low.join('、') || '无')}）先按 60% 估，做几篇后会自动更新。</p>
      <div class="dg-acts"><button class="btn primary" data-dghome>${ic('i-flame')}看今日计划</button></div></div>`;
  }

  window.CET6Learn = {
    TYPES, SUB_NAME, CAUSES, CAUSE_BY, GAPS, CLEAR_AT,
    init: migrate, migrate, subOf, predict, rankText, logWt, setWtManual,
    applyResult, retestAnswer, dueList, setCause, causeHTML, wrongExtraHTML,
    studyDays, streak, examDate, defaultExamDate, dailyMin, daysLeft, phase,
    planToday, planHTML, homeClick, homeChange, heroInfo, rankHTML, weekReport, weekHTML, weekStart,
    meTopHTML, causeChartHTML, openRetest, diagHTML,
  };
})();
