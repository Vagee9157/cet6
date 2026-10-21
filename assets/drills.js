/* 技巧专项训练（window.CET6Drills）：阅读「定位训练」「同义替换」、听力「逐句听写」，
 * 以及练习页听力的「先读选项预判」（考试节奏模式开播前 30 秒）和「倍速爬坡」（同一篇第 2 次 1.1×、第 3 次 1.2×）。
 * 数据：S.drill[日期] = {locate:{n,ok}, para:{n,ok}, dict:{n,ok,w,wok}, pre:{n,ok}}（保留 60 天）；
 *       S.myWords = [{w, d, src, ctx}] 听写收的词库外生词；S.dictBad = [{id, k, t, acc, d, n}] 听写错得多的句子（供后续统一复习）；
 *       S.dictPos[题目 id] = 下一句序号，S.dictG 听写素材组，S.dictRate 听写语速，S.rampOff 关闭倍速爬坡。
 * 同义替换做错进 S.wrong（kind 'para'，key 'para:<题目 id>:<哈希>'），由 CET6Learn 的延迟重测调 rtItem() 渲染。
 * 本文件在 app.js 之前加载，app.js 的工具函数运行时经 window.CET6 取用。 */
(() => {
  'use strict';
  const C = () => window.CET6;
  const St = () => C().S;
  const esc = (t) => C().esc(t), ic = (n) => C().ic(n);
  const $ = (s, el = document) => el.querySelector(s);
  const today = () => C().lday();
  const wc = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;
  const FUNC = new Set('a an the of to in on at by for with from up out off into about and or but so as it its is are was were be been being am do does did has have had i you he she we they me him her us them my your his our their this that these those there here not no yes if then than just very also too can could will would shall should may might must what which who whom whose when where why how all any some each one ones s t ll ve re d m oh okay ok well right yeah uh um like really'.split(' '));
  const KEEP_DAYS = 60, ROUND = 10;

  /* ---------- 记录 ---------- */
  function rec() {
    const s = St(); if (!s.drill || typeof s.drill !== 'object' || Array.isArray(s.drill)) s.drill = {};
    const d = today();
    if (!s.drill[d]) { s.drill[d] = {}; const ks = Object.keys(s.drill).sort(); if (ks.length > KEEP_DAYS) ks.slice(0, ks.length - KEEP_DAYS).forEach((k) => delete s.drill[k]); }
    return s.drill[d];
  }
  function bump(k, ok, extra) {
    const r = rec(), x = r[k] || (r[k] = { n: 0, ok: 0 });
    x.n++; if (ok) x.ok++;
    Object.entries(extra || {}).forEach(([a, v]) => { x[a] = (x[a] || 0) + v; });
    C().save();
  }
  const todayOf = (k) => { const s = St(), r = s.drill && s.drill[today()]; return Object.assign({ n: 0, ok: 0 }, r && r[k]); };

  /* ---------- 句子切分（与 app.js sentRange 同一断句规则，跳过 Mr. / U.S. 这类缩写） ---------- */
  const ABBR = /(?:\b(?:Mr|Mrs|Ms|Dr|Prof|St|Jr|Sr|vs|etc|e\.g|i\.e|U\.S|U\.K|No)|\b[A-Z])$/;
  function sentsOf(t) {
    const out = [], re = /[.!?]+["”’)]*\s+/g; let a = 0, m;
    while ((m = re.exec(t))) {
      if (m[0][0] === '.' && ABBR.test(t.slice(Math.max(0, m.index - 6), m.index))) continue;
      if (/^[a-z]/.test(t.slice(m.index + m[0].length))) continue;
      out.push([a, m.index + m[0].trimEnd().length]); a = m.index + m[0].length;
    }
    if (a < t.length) out.push([a, t.length]);
    return out.filter(([x, y]) => t.slice(x, y).trim());
  }

  /* ---------- 定位训练 ---------- */
  // 题库预处理：解析引号里的英文用 app.js 的 tokIndex / findQuote 在原文里找到，扩到整句；找不到或命中超过 3 句的题不进题池
  let LOCP = null;
  function locPool() {
    if (LOCP) return LOCP; LOCP = [];
    const add = (kind, set, i, stem, exp, opts) => {
      const units = kind === 'mc' ? set.text.split('\n').map((t, k) => ({ t, k })) : set.paras.map(([l, t]) => ({ t, k: l }));
      const toks = C().tokIndex(units), hits = new Set(), re = /["“]([^"”]{6,})["”]/g; let m;
      const mark = (ui, s, e) => sentsOf(units[ui].t).forEach(([a, b], si) => { if (a < e && b > s) hits.add(ui + ':' + si); });
      while ((m = re.exec(exp || ''))) {
        const h = C().findQuote(toks, m[1]); if (!h) continue;
        if (h.a.ui === h.b.ui) mark(h.a.ui, h.a.s, h.b.e); else { mark(h.a.ui, h.a.s, h.a.e); mark(h.b.ui, h.b.s, h.b.e); }
      }
      if (hits.size && hits.size <= 3) LOCP.push({ kind, id: set.id, i, stem, exp, opts, hits: [...hits] });
    };
    READING.mc.forEach((s) => s.questions.forEach((q, i) => add('mc', s, i, q.q, q.exp, q.opts)));
    READING.match.forEach((s) => s.items.forEach((it, i) => add('match', s, i, it.s, it.exp)));
    return LOCP;
  }
  let L = null, lTimer = null;
  const secs = (ms) => Math.max(0, Math.round(ms / 1000));
  function locStart() {
    const pool = locPool(), seen = new Set((St().locSeen || []));
    const fresh = C().shuffle(pool.filter((x) => !seen.has(x.id + ':' + x.i))), rest = C().shuffle(pool.filter((x) => seen.has(x.id + ':' + x.i)));
    L = { q: fresh.concat(rest).slice(0, ROUND), i: 0, t0: Date.now(), qt0: Date.now(), res: [] };
    clearInterval(lTimer); lTimer = setInterval(() => { const el = $('#dlTime'); if (!el || !L) { clearInterval(lTimer); return; } el.textContent = C().mmss(secs(Date.now() - L.t0)); }, 1000);
    locRender();
  }
  function locPara(it) {
    const set = C().findSet(it.id).set;
    const paras = it.kind === 'mc' ? set.text.split('\n').map((t) => ['', t]) : set.paras;
    const r = L.res[L.i];
    return paras.map(([l, t], ui) => `<p>${l ? `<span class="pl">${esc(l)}</span>` : ''}${sentsOf(t).map(([a, b], si) => {
      const k = ui + ':' + si; let cls = 'dl-s';
      if (r) { if (it.hits.includes(k)) cls += ' ans'; if (r.pick === k) cls += r.ok ? ' ok' : ' bad'; }
      return `<span class="${cls}" data-s="${k}"${r ? '' : ' role="button" tabindex="0"'}>${esc(t.slice(a, b))}</span>`;
    }).join(' ')}</p>`).join('');
  }
  function locRender() {
    const box = $('#practice-box'); if (!L) return;
    const head = `<div class="prac-head"><button class="btn ghost" data-dback>${ic('i-chev-l')}返回</button><h2>定位训练</h2><span class="timer"><small>本轮</small><b id="dlTime">${C().mmss(secs(Date.now() - L.t0))}</b></span></div>`;
    if (L.i >= L.q.length) {
      const ok = L.res.filter((r) => r.ok).length, tot = L.res.reduce((a, r) => a + r.sec, 0);
      clearInterval(lTimer);
      box.innerHTML = `${head}<div class="result m-read"><div class="score">${ok}<small> / ${L.q.length}</small></div><p>${ok >= 8 ? '定位很准。保持「先圈题干定位词，再回原文扫」的习惯。' : '定位错的题，对照标绿的句子看看题干里哪个词是定位词（人名、数字、专有名词、少见的实词）。'}</p><p class="res-time">${ic('i-timer')}共 ${C().mmss(tot)} · 平均每题 ${Math.round(tot / Math.max(1, L.q.length))} 秒</p></div>
        <div class="dr-list">${L.q.map((it, i) => { const r = L.res[i]; return `<div class="dr-row ${r.ok ? 'ok' : 'bad'}"><b>${r.ok ? '✓' : '✗'}</b><span>${esc(it.stem)}</span><small>${r.sec}s</small></div>`; }).join('')}</div>
        <div class="submit-bar done-bar"><button class="btn primary" data-dagain="locate">${ic('i-redo')}再来一轮</button><button class="btn" data-dback>回听读</button></div>`;
      return;
    }
    const it = L.q[L.i], f = C().findSet(it.id), r = L.res[L.i];
    const kind = it.kind === 'mc' ? '仔细阅读' : '段落匹配';
    const where = r ? [...new Set(it.hits.map((k) => +k.split(':')[0]))].map((ui) => it.kind === 'mc' ? `第 ${ui + 1} 段` : `${f.set.paras[ui][0]} 段`).join('、') : '';
    const fb = r ? `<div class="dl-fb ${r.ok ? 'ok' : 'bad'}"><b class="vd ${r.ok ? 'ok' : 'bad'}">${r.ok ? '✓ 定位正确' : '✗ 不是这句'}</b><span>${r.sec} 秒 · 答案依据在 ${esc(where)}，已标出</span><details><summary>看解析</summary><p>${esc(it.exp)}</p></details></div>` : '<p class="dl-tip">在原文里点出答案依据所在的那一句</p>';
    box.innerHTML = `${head}<div class="dl-prog"><span>第 ${L.i + 1} / ${L.q.length} 题</span><span class="bar"><i style="width:${L.i / L.q.length * 100}%"></i></span></div>
      <div class="dl-stem card m-read"><span class="kind">${kind} · ${esc(f.set.title.replace(/^[^·]+·\s*/, ''))}</span><div class="qt">${esc(it.stem)}</div>
        ${it.opts ? `<details class="dl-opts"><summary>看选项</summary><ol type="A">${it.opts.map((o) => `<li>${esc(o)}</li>`).join('')}</ol></details>` : ''}${fb}</div>
      <div class="passage dl-pass m-read">${locPara(it)}</div>
      ${r ? `<div class="submit-bar"><button class="btn primary" data-dlnext>${L.i + 1 < L.q.length ? '下一题' : '看本轮结果'}${ic('i-chev-r')}</button></div>` : ''}`;
  }
  function locPick(k) {
    const it = L.q[L.i]; if (L.res[L.i]) return;
    const ok = it.hits.includes(k), sec = secs(Date.now() - L.qt0);
    L.res[L.i] = { pick: k, ok, sec };
    const s = St(); s.locSeen = (s.locSeen || []).filter((x) => x !== it.id + ':' + it.i).concat(it.id + ':' + it.i).slice(-300);
    bump('locate', ok);
    const y = window.scrollY; locRender(); window.scrollTo(0, y);
    if (!ok) { const el = $('#practice-box .dl-s.ans'); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }

  /* ---------- 同义替换 ---------- */
  const hash = (t) => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return h.toString(36); };
  const paraKey = (p) => 'para:' + p.src + ':' + hash(p.a.toLowerCase() + '|' + p.b.toLowerCase());
  const PARAS = () => (typeof PARA !== 'undefined' ? PARA.filter((p) => C().findSet(p.src)) : []);
  let PKEY = null;
  const paraByKey = (k) => { if (!PKEY) { PKEY = {}; PARAS().forEach((p) => { PKEY[paraKey(p)] = p; }); } return PKEY[k]; };
  function srcText(id) {
    const f = C().findSet(id); if (!f) return '';
    const s = f.set;
    if (f.kind === 'mc') return s.text; if (f.kind === 'match') return s.paras.map((p) => p[1]).join(' ');
    if (f.kind === 'cloze') return '';
    return String(s.script || '').replace(/^\s*[MW]:\s*/gm, '');
  }
  const cw = (t) => String(t).toLowerCase().match(/[a-z]+/g) || [];
  // 干扰项：同篇其他原文短语 → 同篇原文里长度相近的片段 → 别篇原文短语
  function distractors(p) {
    const lo = (t) => t.toLowerCase(), used = new Set([lo(p.b)]), out = [];
    const bad = new Set(cw(p.a + ' ' + p.b).filter((w) => !FUNC.has(w) && w.length > 2));
    const okC = (t) => { const l = lo(t); if (used.has(l) || l.includes(lo(p.b)) || lo(p.b).includes(l)) return false; return !cw(t).some((w) => bad.has(w)); };
    const push = (t) => { if (out.length < 3 && okC(t)) { out.push(t); used.add(lo(t)); } };
    C().shuffle(PARAS().filter((x) => x.src === p.src)).forEach((x) => push(x.b));
    const words = srcText(p.src).split(/\s+/).filter(Boolean), n = wc(p.b);
    for (let tries = 0; out.length < 3 && tries < 200 && words.length > n + 2; tries++) {
      const len = Math.max(1, n + (tries % 3) - 1), i = Math.floor(Math.random() * (words.length - len));
      const seg = words.slice(i, i + len);
      if (seg.slice(0, -1).some((w) => /[.!?;:]["”’)]*$/.test(w))) continue;
      const t = seg.join(' ').replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9%]+$/g, '').replace(/["“”]/g, '');
      const ws = cw(t); if (!ws.length || FUNC.has(ws[0]) && ws.length === 1 || ws.every((w) => FUNC.has(w)) || (len === 1 && t.length < 4)) continue;
      push(t);
    }
    C().shuffle(PARAS().filter((x) => x.src !== p.src)).forEach((x) => push(x.b));
    return out;
  }
  let P = null;
  function paraStart() {
    const all = PARAS(); const seen = new Set(St().paraSeen || []);
    const fresh = C().shuffle(all.filter((p) => !seen.has(paraKey(p)))), rest = C().shuffle(all.filter((p) => seen.has(paraKey(p))));
    P = { q: fresh.concat(rest).slice(0, ROUND).map((p) => ({ p, opts: C().shuffle([p.b, ...distractors(p)]) })), i: 0, pick: null, res: [] };
    paraRender();
  }
  const markExp = (p) => C().hl(p.exp, [p.a, p.b]);
  function paraQHTML(q, done, pick, attr) {
    const f = C().findSet(q.p.src);
    return `<p class="dp-hint">题干 / 选项里的说法</p><div class="dp-a serif">${esc(q.p.a)}</div><p class="dp-hint">在原文里对应哪个说法？${f ? `<span class="dp-src">出自 ${esc(f.set.title.replace(/^[^·]+·\s*/, ''))}</span>` : ''}</p>
      <div class="opts">${q.opts.map((o, k) => { const cls = done ? (o === q.p.b ? ' right' : o === pick ? ' wrong' : '') : ''; return `<button class="opt${cls}" ${attr}="${esc(o)}" ${done ? 'disabled' : ''}><span class="k">${'ABCD'[k]}</span><span class="serif">${esc(o)}</span></button>`; }).join('')}</div>`;
  }
  function paraRender() {
    const box = $('#practice-box'); if (!P) return;
    const head = `<div class="prac-head"><button class="btn ghost" data-dback>${ic('i-chev-l')}返回</button><h2>同义替换</h2></div>`;
    if (!P.q.length) { box.innerHTML = `${head}<div class="empty">${ic('i-x')}题库里还没有抽到同义替换短语。</div>`; return; }
    if (P.i >= P.q.length) {
      const ok = P.res.filter(Boolean).length;
      box.innerHTML = `${head}<div class="result m-read"><div class="score">${ok}<small> / ${P.q.length}</small></div><p>${ok >= 8 ? '同义替换认得很准。' : '错的几组已进错题本，明天起按 1 / 3 / 7 天单题重测。'}</p></div>
        <div class="dr-list">${P.q.map((q, i) => `<div class="dr-row ${P.res[i] ? 'ok' : 'bad'}"><b>${P.res[i] ? '✓' : '✗'}</b><span><span class="serif">${esc(q.p.a)}</span> ≈ <span class="serif">${esc(q.p.b)}</span></span></div>`).join('')}</div>
        <div class="submit-bar done-bar"><button class="btn primary" data-dagain="para">${ic('i-redo')}再来一轮</button><button class="btn" data-dback>回听读</button></div>`;
      return;
    }
    const q = P.q[P.i], done = P.pick !== null;
    box.innerHTML = `${head}<div class="dl-prog"><span>${P.i + 1} / ${P.q.length}</span><span class="bar"><i style="width:${P.i / P.q.length * 100}%"></i></span></div>
      <div class="card dp-card m-read">${paraQHTML(q, done, P.pick, 'data-dppick')}
      ${done ? `<div class="exp"><b class="vd ${P.pick === q.p.b ? 'ok' : 'bad'}">${P.pick === q.p.b ? '✓ 答对' : '✗ 答错，已进错题本'}</b> · 原解析：${markExp(q.p)}</div>` : ''}</div>
      ${done ? `<div class="submit-bar"><button class="btn primary" data-dpnext>${P.i + 1 < P.q.length ? '下一组' : '看本轮结果'}${ic('i-chev-r')}</button></div>` : ''}`;
  }
  function paraWrong(p, mine) {
    const f = C().findSet(p.src);
    return { key: paraKey(p), kind: 'para', sub: 'para', setId: p.src, src: '同义替换 · ' + (f ? f.set.title.replace(/^[^·]+·\s*/, '') : p.src), at: today(), q: `「${p.a}」在原文里对应哪个说法？`, a: p.b, e: p.exp, mine: mine || '未作答' };
  }
  function paraPick(v) {
    const q = P.q[P.i]; if (P.pick !== null) return;
    P.pick = v; const ok = v === q.p.b; P.res[P.i] = ok;
    const s = St(), k = paraKey(q.p); s.paraSeen = (s.paraSeen || []).filter((x) => x !== k).concat(k).slice(-400);
    const Lr = window.CET6Learn;
    if (Lr) { if (ok) Lr.applyResult([], [k]); else Lr.applyResult([paraWrong(q.p, v)], []); }
    else if (!ok) s.wrong[k] = paraWrong(q.p, v);
    bump('para', ok);
    const y = window.scrollY; paraRender(); window.scrollTo(0, y);
  }
  // 错题重测（learn.js prep 调）：返回带 ext() 的重测项
  function rtItem(key, w) {
    const p = paraByKey(key); if (!p) return null;
    const f = C().findSet(p.src); if (!f) return null;
    const q = { p, opts: C().shuffle([p.b, ...distractors(p)]) };
    return {
      key, w, kind: 'para', set: f.set, i: 0, ans: p.b, stem: p.a, exp: p.exp, srcLabel: w.src || '同义替换', ansLabel: esc(p.b),
      ext: (done, pick) => ({ ctx: '', choices: `<div class="dp-card">${paraQHTML(q, done, pick, 'data-rtpick')}</div>` }),
    };
  }

  /* ---------- 逐句听写 ---------- */
  // 素材：六级题型听力（AUDIO 逐句时间，跳过题目播报）+ 常速真人（官方逐段时间；超过 30 词的长段按句拆开、时间按字数估算）
  let DPOOL = null;
  function splitSeg(g, si) {
    const t = g[3], ss = sentsOf(t), out = []; let cur = null;
    const flush = () => { if (cur && wc(t.slice(cur[0], cur[1])) >= 4) out.push(cur); cur = null; };
    ss.forEach(([a, b]) => {
      const n = wc(t.slice(a, b)); if (n > 30) { flush(); return; }
      if (cur && wc(t.slice(cur[0], b)) <= 25) cur[1] = b; else { flush(); cur = [a, b]; }
      if (wc(t.slice(cur[0], cur[1])) >= 8) flush();
    });
    flush();
    const len = t.length, dur = g[1] - g[0];
    return out.map(([a, b], j) => ({ t: t.slice(a, b).trim(), a: Math.max(0, g[0] + a / len * dur - 0.4), b: g[0] + b / len * dur + 0.4, k: si + '.' + j, est: true }));
  }
  function dictPool() {
    if (DPOOL) return DPOOL; DPOOL = { cet: [], real: [] };
    LISTENING.forEach((s) => {
      const m = C().AUD(s.id); if (!m || m.real || !m.segs) return;
      const ch = m.segs.map((g, i) => ({ t: g[3], a: Math.max(0, g[0] - 0.1), b: g[1] + 0.15, k: String(i), spk: g[2] })).filter((x) => x.spk !== 'Q' && wc(x.t) >= 4 && wc(x.t) <= 30);
      if (ch.length) DPOOL.cet.push({ set: s, ch });
    });
    (typeof REAL !== 'undefined' ? REAL : []).filter((r) => r.org && Array.isArray(r.segs) && r.questions && r.questions.length).forEach((r) => {
      const ch = [];
      r.segs.forEach((g, i) => { const n = wc(g[3]); if (n >= 4 && n <= 30) ch.push({ t: g[3], a: Math.max(0, g[0] - 0.1), b: g[1] + 0.2, k: String(i) }); else if (n > 30) splitSeg(g, i).forEach((x) => ch.push(x)); });
      if (ch.length) DPOOL.real.push({ set: r, ch });
    });
    return DPOOL;
  }
  const DA = new Audio(); DA.preload = 'auto';
  let Dd = null, daRange = null;
  DA.addEventListener('timeupdate', () => { if (daRange && DA.currentTime >= daRange[1]) DA.pause(); });
  ['play', 'pause', 'ended'].forEach((ev) => DA.addEventListener(ev, () => { const b = $('#ddPlay'); if (b) b.innerHTML = `${ic(DA.paused ? 'i-play' : 'i-pause')}${DA.paused ? '播放这句' : '暂停'}`; }));
  function daPlay() {
    if (!Dd) return; const c = Dd.e.ch[Dd.k], m = C().AUD(Dd.e.set.id); if (!c || !m) return;
    if (!DA.paused) { DA.pause(); return; }
    C().stopAudio(); daRange = [c.a, c.b];
    const go = () => { try { DA.currentTime = c.a; } catch {} DA.defaultPlaybackRate = DA.playbackRate = St().dictRate || 1; DA.play().catch(() => {}); };
    if (DA.dataset.src !== m.src) { DA.dataset.src = m.src; DA.src = m.src; DA.addEventListener('loadedmetadata', go, { once: true }); DA.load(); } else go();
  }
  const stopDA = () => { DA.pause(); daRange = null; };
  function dictPick(g, avoid) {
    const s = St(), pool = dictPool()[g] || []; if (!pool.length) return null;
    const pos = s.dictPos || {};
    const open = pool.filter((e) => (pos[e.set.id] || 0) < e.ch.length && e.set.id !== avoid);
    const cand = open.length ? open : pool.filter((e) => e.set.id !== avoid);
    const e = cand.find((x) => pos[x.set.id] > 0 && pos[x.set.id] < x.ch.length) || cand[Math.floor(Math.random() * cand.length)] || pool[0];
    return e;
  }
  function dictStart(g, avoid) {
    const s = St(); g = g || s.dictG || 'cet'; if (!(dictPool()[g] || []).length) g = 'cet';
    s.dictG = g; s.dictPos = s.dictPos || {};
    const last = !avoid && s.dictLast && (dictPool()[g] || []).find((e) => e.set.id === s.dictLast && (s.dictPos[e.set.id] || 0) < e.ch.length);
    const e = last || dictPick(g, avoid); if (!e) return;
    let k = s.dictPos[e.set.id] || 0; if (k >= e.ch.length) k = 0;
    s.dictLast = e.set.id; C().save();
    Dd = { g, e, k, res: null, typed: '', added: {} }; stopDA(); dictRender();
  }
  const normT = (w) => w.toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '').replace(/^'+|'+$/g, '');
  // 词级对比：LCS 对齐；两个对齐点之间原文没对上的词 = 漏听，同一空档里你写的词 = 错听
  function diff(orig, typed) {
    const O = orig.split(/\s+/).filter(Boolean).map((w) => ({ w, n: normT(w) })).filter((x) => x.n);
    const T = typed.split(/\s+/).map(normT).filter(Boolean);
    const n = O.length, m = T.length, dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = O[i].n === T[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const ops = []; let i = 0, j = 0, gapO = [], gapT = [];
    const flush = () => {
      gapO.forEach((o, x) => ops.push(x < gapT.length ? { t: 'sub', w: o.w, n: o.n, y: gapT[x] } : { t: 'miss', w: o.w, n: o.n }));
      gapT.slice(gapO.length).forEach((y) => ops.push({ t: 'extra', y })); gapO = []; gapT = [];
    };
    while (i < n || j < m) {
      if (i < n && j < m && O[i].n === T[j]) { flush(); ops.push({ t: 'ok', w: O[i].w }); i++; j++; }
      else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) { gapT.push(T[j]); j++; }
      else { gapO.push(O[i]); i++; }
    }
    flush();
    const ok = ops.filter((o) => o.t === 'ok').length;
    return { ops, ok, total: n, acc: n ? ok / n : 0 };
  }
  // 漏听 / 错听的实词 → 可加入生词本；在词库（ALLWORDS）里的标「不认识」，否则存 S.myWords
  let WMAP = null;
  function wordId(w) {
    if (!WMAP) { WMAP = {}; C().ALLWORDS.forEach((x) => { const k = x.w.toLowerCase(); if (/^[a-z-]+$/.test(k) && !WMAP[k]) WMAP[k] = x.id; }); }
    const c = [w];
    if (/ies$/.test(w)) c.push(w.slice(0, -3) + 'y'); if (/ied$/.test(w)) c.push(w.slice(0, -3) + 'y');
    if (/es$/.test(w)) c.push(w.slice(0, -2)); if (/s$/.test(w)) c.push(w.slice(0, -1));
    if (/ed$/.test(w)) c.push(w.slice(0, -2), w.slice(0, -1)); if (/ing$/.test(w)) c.push(w.slice(0, -3), w.slice(0, -3) + 'e');
    if (/(.)\1(ed|ing)$/.test(w)) c.push(w.replace(/(.)\1(ed|ing)$/, '$1'));
    if (/ly$/.test(w)) c.push(w.slice(0, -2));
    const hit = c.find((x) => WMAP[x]); return hit ? WMAP[hit] : null;
  }
  const isInBook = (w) => { const s = St(), id = wordId(w); if (id) return s.vocab && (s.vocab[id] === 0 || s.vocab[id] === 1); return (s.myWords || []).some((x) => x && x.w === w); };
  function addWord(w) {
    const s = St(), id = wordId(w);
    if (id) { C().gameMark(id, false); return 'vocab'; }
    s.myWords = Array.isArray(s.myWords) ? s.myWords : [];
    if (!s.myWords.some((x) => x && x.w === w)) { s.myWords.push({ w, d: today(), src: Dd ? Dd.e.set.id : '', ctx: Dd ? Dd.e.ch[Dd.k].t : '' }); if (s.myWords.length > 500) s.myWords = s.myWords.slice(-500); }
    C().save(); return 'my';
  }
  function dictCheck() {
    const inp = $('#ddIn'); if (!Dd || Dd.res) return;
    const typed = inp ? inp.value : ''; const c = Dd.e.ch[Dd.k];
    const r = diff(c.t, typed); Dd.res = r; Dd.typed = typed;
    const s = St(); s.dictPos = s.dictPos || {}; s.dictPos[Dd.e.set.id] = Dd.k + 1;
    s.dictBad = Array.isArray(s.dictBad) ? s.dictBad : [];
    const old = s.dictBad.find((x) => x && x.id === Dd.e.set.id && x.k === c.k);
    if (r.acc < 0.8) {
      // 错句：明天起进「今日复习」重听重写（due / st 见 dictGrade）
      if (old) { old.acc = Math.round(r.acc * 100) / 100; old.d = today(); old.n = (old.n || 1) + 1; old.st = 0; old.due = addDays(today(), DGAPS[0]); }
      else { s.dictBad.push({ id: Dd.e.set.id, k: c.k, t: c.t, acc: Math.round(r.acc * 100) / 100, d: today(), n: 1, st: 0, due: addDays(today(), DGAPS[0]) }); if (s.dictBad.length > 200) s.dictBad = s.dictBad.slice(-200); }
    } else if (old) s.dictBad = s.dictBad.filter((x) => x !== old);   // 重写对了 ≥80%，移出错句
    bump('dict', r.acc >= 0.9, { w: r.total, wok: r.ok });
    dictRender();
  }
  function dictRender() {
    const box = $('#practice-box'); if (!Dd) return;
    const s = St(), e = Dd.e, c = e.ch[Dd.k], td = todayOf('dict'), rate = s.dictRate || 1;
    const head = `<div class="prac-head"><button class="btn ghost" data-dback>${ic('i-chev-l')}返回</button><h2>逐句听写</h2><span class="timer"><small>今日</small><b>${td.n} 句</b></span></div>`;
    const pool = dictPool();
    const pick = `<div class="dd-pick"><div class="rp-opts">${[['cet', '六级题型'], ['real', '真人常速']].filter(([k]) => pool[k].length).map(([k, n]) => `<button class="chip" data-ddg="${k}" aria-pressed="${Dd.g === k}">${n}</button>`).join('')}</div>
      <div class="dd-set"><span><b>${esc(e.set.title.replace(/^[^·]+·\s*/, ''))}</b> · 第 ${Dd.k + 1} / ${e.ch.length} 句</span><button class="btn ghost" data-ddswap>${ic('i-redo')}换一篇</button></div></div>`;
    let body;
    if (!c) {
      body = `<div class="card dd-card m-listen"><p>这篇听写完了。</p><div class="dd-acts"><button class="btn primary" data-ddswap>${ic('i-redo')}换一篇</button><button class="btn" data-ddrestart>从头再写一遍</button></div></div>`;
    } else {
      const r = Dd.res;
      const words = r ? (() => {
        const seen = new Set(); return r.ops.filter((o) => (o.t === 'miss' || o.t === 'sub') && /^[a-z][a-z-]{2,}$/.test(o.n) && !FUNC.has(o.n)).map((o) => o.n).filter((w) => !seen.has(w) && seen.add(w));
      })() : [];
      const diffHTML = r ? r.ops.map((o) => o.t === 'ok' ? `<span class="dd-w ok">${esc(o.w)}</span>` : o.t === 'miss' ? `<span class="dd-w miss" title="漏听">${esc(o.w)}</span>` : o.t === 'sub' ? `<span class="dd-w sub" title="错听">${esc(o.w)}<small>${esc(o.y)}</small></span>` : `<span class="dd-x" title="多写">+${esc(o.y)}</span>`).join(' ') : '';
      body = `<div class="card dd-card m-listen">
        <div class="dd-ctl"><button class="btn tone m-listen" id="ddPlay" data-ddplay>${ic(DA.paused ? 'i-play' : 'i-pause')}${DA.paused ? '播放这句' : '暂停'}</button><span class="dd-rate">语速 ${[0.8, 1].map((v) => `<button class="chip" data-ddrate="${v}" aria-pressed="${rate === v}">${v.toFixed(1)}×</button>`).join('')}</span></div>
        ${c.est ? '<p class="dd-note">这句截自真人长段，起止按字数估算，开头结尾可能带到相邻句的一两个词，只写中间这句。</p>' : ''}
        <textarea id="ddIn" class="dd-in serif" rows="3" placeholder="听到什么就写什么，不确定的词也写上…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${r ? 'readonly' : ''}>${esc(Dd.typed)}</textarea>
        ${r ? `<div class="dd-res"><div class="dd-acc"><b>${Math.round(r.acc * 100)}%</b><span>对了 ${r.ok} / ${r.total} 词${r.acc < 0.8 ? ' · 已记下这句，之后统一复习' : ''}</span></div>
          <div class="dd-diff serif">${diffHTML}</div>
          <p class="dd-legend"><span class="dd-w miss">漏听</span><span class="dd-w sub">错听<small>你写的</small></span><span class="dd-x">+多写</span></p>
          ${words.length ? `<div class="dd-words"><span>没听出来的词</span>${words.map((w) => { const inB = Dd.added[w] || isInBook(w); return `<button class="chip" data-ddword="${esc(w)}" ${inB ? 'disabled aria-pressed="true"' : ''}>${inB ? ic('i-check') : '+'} ${esc(w)}${wordId(w) ? '' : ' <small>词库外</small>'}</button>`; }).join('')}<small class="dd-wtip">点一下加入生词本</small></div>` : ''}</div>` : ''}
        <div class="dd-acts">${r ? `<button class="btn primary" data-ddnext>下一句${ic('i-chev-r')}</button><button class="btn" data-ddplay2>${ic('i-redo')}再听一遍</button>` : `<button class="btn primary" data-ddcheck>检查</button><button class="btn ghost" data-ddskip>跳过这句</button>`}</div>
        <p class="dd-kbd">电脑：Enter 检查 / 下一句，Shift+Enter 换行，Esc 重播</p></div>`;
    }
    box.innerHTML = head + pick + body;
  }
  function dictNext() { if (!Dd) return; stopDA(); Dd.k++; Dd.res = null; Dd.typed = ''; dictRender(); const i = $('#ddIn'); if (i && !C().isPhone()) i.focus(); }
  document.addEventListener('keydown', (e) => {
    if (!Dd || !$('#ddIn') || $('#view-practice').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); stopDA(); daPlay(); return; }
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && (e.target.id === 'ddIn' || e.target === document.body)) { e.preventDefault(); if (Dd.res) dictNext(); else dictCheck(); }
  });

  /* ---------- 听写错句复习（今日复习流程 assets/review.js 用） ----------
     S.dictBad[i] 新增 due（到期日）/ st（复习仍没过的次数）。旧记录没有 due：按 d + 1 天算。
     重写正确率 ≥80% 移出；仍 <80% 的 st+1，按 DGAPS = [1, 3, 7] 天逐次拉开（同一句卡住不天天出现，7 天封顶） */
  const DGAPS = [1, 3, 7];
  const isDay = (x) => typeof x === 'string' && /^\d{4}-\d\d-\d\d$/.test(x);
  function addDays(ds, n) { const [y, m, d] = ds.split('-').map(Number); return C().lday(new Date(y, m - 1, d + n)); }
  const dictDueOf = (x) => (isDay(x.due) ? x.due : addDays(isDay(x.d) ? x.d : today(), DGAPS[0]));
  function dictFind(id, k) { const P = dictPool(); for (const g of ['cet', 'real']) { const e = P[g].find((x) => x.set.id === id); if (e) { const c = e.ch.find((x) => x.k === k); if (c) return { e, c }; } } return null; }
  // 到期的错句：[{x: 记录, due, key}]
  function dictDue() { const t = today(); return (Array.isArray(St().dictBad) ? St().dictBad : []).filter((x) => x && x.id && x.k != null && dictDueOf(x) <= t && dictFind(x.id, x.k)).map((x) => ({ x, due: dictDueOf(x), key: 'dict:' + x.id + ':' + x.k })); }
  function dictGrade(x, acc) {
    const s = St(), arr = Array.isArray(s.dictBad) ? s.dictBad : [];
    const it = arr.find((y) => y && y.id === x.id && y.k === x.k); if (!it) return 'none';
    if (acc >= 0.8) { s.dictBad = arr.filter((y) => y !== it); C().save(); return 'clear'; }
    it.st = (it.st || 0) + 1; it.acc = Math.round(acc * 100) / 100; it.n = (it.n || 1) + 1; it.d = today();
    it.due = addDays(today(), DGAPS[Math.min(it.st, DGAPS.length - 1)]); C().save(); return 'next';
  }
  // 在 el 里重听重写一句，点「下一项」/ 跳过回调 onDone(正确率 / null)
  let RV = null;
  function dictReview(el, key, onDone) {
    const hit = dictDue().find((y) => y.key === key); if (!hit) return false;
    const f = dictFind(hit.x.id, hit.x.k), m = C().AUD(f.e.set.id); if (!m) return false;
    RV = { el, x: hit.x, e: f.e, c: f.c, m, res: null, typed: '', res2: '', onDone };
    const play = () => {
      if (!DA.paused) { DA.pause(); return; }
      C().stopAudio(); daRange = [RV.c.a, RV.c.b];
      const go = () => { try { DA.currentTime = RV.c.a; } catch {} DA.defaultPlaybackRate = DA.playbackRate = St().dictRate || 1; DA.play().catch(() => {}); };
      if (DA.dataset.src !== RV.m.src) { DA.dataset.src = RV.m.src; DA.src = RV.m.src; DA.addEventListener('loadedmetadata', go, { once: true }); DA.load(); } else go();
    };
    const paint = () => {
      const r = RV.res, rate = St().dictRate || 1, x = RV.x;
      const diffHTML = r ? r.ops.map((o) => o.t === 'ok' ? `<span class="dd-w ok">${esc(o.w)}</span>` : o.t === 'miss' ? `<span class="dd-w miss" title="漏听">${esc(o.w)}</span>` : o.t === 'sub' ? `<span class="dd-w sub" title="错听">${esc(o.w)}<small>${esc(o.y)}</small></span>` : `<span class="dd-x" title="多写">+${esc(o.y)}</span>`).join(' ') : '';
      const sched = RV.res2 === 'clear' ? '≥80%，已移出听写错句。' : RV.res2 === 'next' ? `还没到 80%，${esc((St().dictBad || []).find((y) => y.id === x.id && y.k === x.k)?.due?.slice(5) || '')} 再听一次。` : '';
      el.innerHTML = `<div class="card dd-card m-listen">
        <p class="dd-note">${esc(RV.e.set.title.replace(/^[^·]+·\s*/, ''))} · 上次听写 ${Math.round((x.acc || 0) * 100)}%${x.n > 1 ? ` · 第 ${x.n} 次` : ''}</p>
        <div class="dd-ctl"><button class="btn tone m-listen" id="ddPlay" data-rvdplay>${ic(DA.paused ? 'i-play' : 'i-pause')}${DA.paused ? '播放这句' : '暂停'}</button><span class="dd-rate">语速 ${[0.8, 1].map((v) => `<button class="chip" data-rvdrate="${v}" aria-pressed="${rate === v}">${v.toFixed(1)}×</button>`).join('')}</span></div>
        ${RV.c.est ? '<p class="dd-note">这句截自真人长段，起止按字数估算，只写中间这句。</p>' : ''}
        <textarea id="rvdIn" class="dd-in serif" rows="3" placeholder="重听这句，写下听到的…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ${r ? 'readonly' : ''}>${esc(RV.typed)}</textarea>
        ${r ? `<div class="dd-res"><div class="dd-acc"><b>${Math.round(r.acc * 100)}%</b><span>对了 ${r.ok} / ${r.total} 词 · ${sched}</span></div><div class="dd-diff serif">${diffHTML}</div>
          <p class="dd-legend"><span class="dd-w miss">漏听</span><span class="dd-w sub">错听<small>你写的</small></span><span class="dd-x">+多写</span></p></div>` : ''}
        <div class="dd-acts">${r ? `<button class="btn primary" data-rvdnext>下一项${ic('i-chev-r')}</button><button class="btn" data-rvdplay>${ic('i-redo')}再听一遍</button>` : `<button class="btn primary" data-rvdcheck>检查</button><button class="btn ghost" data-rvdskip>跳过这句</button>`}</div></div>`;
    };
    const check = () => {
      if (RV.res) return; const inp = el.querySelector('#rvdIn'); const typed = inp ? inp.value : '';
      if (!typed.trim()) { if (inp) inp.focus(); return; }
      RV.typed = typed; RV.res = diff(RV.c.t, typed); RV.res2 = dictGrade(RV.x, RV.res.acc); paint();
    };
    const end = (v) => { stopDA(); const cb = RV.onDone; RV = null; cb(v); };
    el.onclick = (e) => {
      if (!RV) return;
      if (e.target.closest('[data-rvdplay]')) { if (e.target.closest('.dd-acts')) stopDA(); play(); return; }
      const rt = e.target.closest('[data-rvdrate]'); if (rt) { St().dictRate = +rt.dataset.rvdrate; C().save(); DA.playbackRate = St().dictRate; el.querySelectorAll('[data-rvdrate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.rvdrate === St().dictRate)); return; }
      if (e.target.closest('[data-rvdcheck]')) { check(); return; }
      if (e.target.closest('[data-rvdnext]')) { end(RV.res ? RV.res.acc : null); return; }
      if (e.target.closest('[data-rvdskip]')) end(null);
    };
    el.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.target.id === 'rvdIn' && RV && !RV.res) { e.preventDefault(); check(); } };
    paint(); return true;
  }

  /* ---------- 入口 / 分发 ---------- */
  const DRILLS = {
    locate: { n: '定位训练', d: '给题干，在原文里点出答案所在的句子', mod: 'm-read', unit: '题', start: locStart },
    para: { n: '同义替换', d: '题干说法 ↔ 原文说法，四选一', mod: 'm-read', unit: '组', start: paraStart },
    dict: { n: '逐句听写', d: '按句播放，写下听到的，逐词对比', mod: 'm-listen', unit: '句', start: () => dictStart() },
  };
  let active = null;
  function leave() { stopDA(); clearInterval(lTimer); L = null; P = null; Dd = null; active = null; }
  function open(k) { if (!DRILLS[k]) return; leave(); active = k; const box = $('#practice-box'); box.onclick = click; DRILLS[k].start(); }
  function click(e) {
    if (e.target.closest('[data-dback]')) { leave(); C().practiceHome(); return; }
    const ag = e.target.closest('[data-dagain]'); if (ag) { open(ag.dataset.dagain); window.scrollTo(0, 0); return; }
    if (active === 'locate') {
      const sEl = e.target.closest('.dl-s[data-s]'); if (sEl && L && !L.res[L.i]) { locPick(sEl.dataset.s); return; }
      if (e.target.closest('[data-dlnext]')) { L.i++; L.qt0 = Date.now(); locRender(); window.scrollTo(0, 0); return; }
    }
    if (active === 'para') {
      const p = e.target.closest('[data-dppick]'); if (p) { paraPick(p.dataset.dppick); return; }
      if (e.target.closest('[data-dpnext]')) { P.i++; P.pick = null; paraRender(); window.scrollTo(0, 0); return; }
    }
    if (active === 'dict') {
      if (e.target.closest('[data-ddplay]')) { daPlay(); return; }
      if (e.target.closest('[data-ddplay2]')) { stopDA(); daPlay(); return; }
      const rt = e.target.closest('[data-ddrate]'); if (rt) { St().dictRate = +rt.dataset.ddrate; C().save(); DA.playbackRate = St().dictRate; document.querySelectorAll('[data-ddrate]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.ddrate === St().dictRate)); return; }
      if (e.target.closest('[data-ddcheck]')) { dictCheck(); return; }
      if (e.target.closest('[data-ddskip]') || e.target.closest('[data-ddnext]')) { dictNext(); return; }
      const g = e.target.closest('[data-ddg]'); if (g) { const typed = $('#ddIn'); if (typed) Dd.typed = typed.value; dictStart(g.dataset.ddg); return; }
      if (e.target.closest('[data-ddswap]')) { dictStart(Dd.g, Dd.e.set.id); return; }
      if (e.target.closest('[data-ddrestart]')) { St().dictPos[Dd.e.set.id] = 0; C().save(); dictStart(Dd.g); return; }
      const w = e.target.closest('[data-ddword]'); if (w && !w.disabled) { const r = addWord(w.dataset.ddword); Dd.added[w.dataset.ddword] = 1; w.disabled = true; w.setAttribute('aria-pressed', 'true'); w.innerHTML = `${ic('i-check')} ${esc(w.dataset.ddword)} <small>${r === 'vocab' ? '已标不认识' : '已存生词本'}</small>`; }
    }
  }
  // 切 tab 时停掉听写录音、计时
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('nav.tabs') && active) leave(); }, true);

  // 听读页顶部「专项训练」卡：三项入口 + 今日完成量
  function entryHTML() {
    return `<div class="drill-card card"><div class="rp-h">${ic('i-target')}<b>专项训练</b><span>练技巧，不用做整篇</span></div>
      <div class="drill-grid">${Object.entries(DRILLS).map(([k, x]) => { const t = todayOf(k); return `<button class="drill ${x.mod}" data-drill="${k}"><b>${x.n}</b><span class="d">${x.d}</span><span class="t">${t.n ? `今日 ${t.n} ${x.unit} · 对 ${t.ok}` : '今日还没练'}</span></button>`; }).join('')}</div></div>`;
  }

  /* ---------- 今日计划（learn.js buildPlan 专项阶段调）：按近两周头号错因 / 提分排行挑一项 ---------- */
  function planTask(pr) {
    const s = St(), lim = (() => { const d = new Date(); d.setDate(d.getDate() - 14); return C().lday(d); })();
    const cs = {}; Object.values(s.causeLog || {}).forEach((x) => { if (x && x.d >= lim) cs[x.c] = (cs[x.c] || 0) + 1; });
    const top = Object.entries(cs).filter(([c]) => ['syn', 'loc', 'ear'].includes(c)).sort((a, b) => b[1] - a[1])[0];
    let sub = top ? { syn: 'para', loc: 'locate', ear: 'dict' }[top[0]] : null;
    if (!sub) { const obj = ((pr && pr.rank) || []).filter((x) => !x.wt)[0]; sub = obj && obj.part === 'listen' ? 'dict' : (+today().slice(-2) % 2 ? 'para' : 'locate'); }
    return { k: 'drill', sub, min: sub === 'dict' ? 12 : 10 };
  }
  function taskStatus(t) {
    const x = DRILLS[t.sub] || DRILLS.locate, n = todayOf(t.sub).n;
    return { done: n >= ROUND, f: Math.min(1, n / ROUND), title: `专项：${x.n} ${ROUND} ${x.unit}`, p: `今天 ${Math.min(n, 999)}/${ROUND}`, mod: x.mod };
  }

  /* ---------- 先读选项预判（练习页 · 六级题型听力 · 考试节奏模式） ---------- */
  const PRE = [['detail', '细节'], ['why', '原因'], ['att', '态度'], ['adv', '建议'], ['num', '数字']];
  const PRE_N = Object.fromEntries(PRE);
  function qType(q) {
    const t = String(q || '');
    if (/\bhow (many|much|long|old|often|far)\b|\bwhen\b|\bwhat (year|time|percentage|number|proportion)\b|\bpercent|\bhow soon\b/i.test(t)) return 'num';
    if (/\bwhy\b|\breason|\bbecause\b|\bwhat (caused|led|made|prompted|motivated)\b|\bresult(ed)? in\b/i.test(t)) return 'why';
    if (/\b(suggest|advise|advice|recommend|should|propose|urge|tips?)\b/i.test(t)) return 'adv';
    if (/\b(attitude|opinion|feel|feels|felt|think of|think about|view|views|believe|impression|regard|stance|concern(ed)?)\b/i.test(t)) return 'att';
    return 'detail';
  }
  const preOn = (cur) => !!(cur && cur.kind === 'listen' && !cur.back && St().auMode === 'exam' && C().AUD(cur.set.id) && !C().AUD(cur.set.id).real);
  let preTimer = null;
  function preEnd(cur, go) {
    clearInterval(preTimer); preTimer = null; if (!cur.pre || cur.pre.st !== 'run') return;
    cur.pre.st = 'done'; C().rerenderSet(); if (go) go();
  }
  // 按播放：考试节奏下第一次播放前先进 30 秒读选项；返回 true = 已拦下（读完 / 跳过后自动开播）
  function preGate(cur, pos, go) {
    if (!preOn(cur) || cur.done) return false;
    const p = cur.pre || (cur.pre = { st: 'idle', picks: {} });
    if (p.st === 'run') return true; if (p.st === 'done' || pos > 1) return false;
    p.st = 'run'; p.left = 30; p.go = go; C().rerenderSet();
    clearInterval(preTimer);
    preTimer = setInterval(() => {
      const el = $('#preLeft'); if (!el) { clearInterval(preTimer); preTimer = null; if (p.st === 'run') p.st = 'idle'; return; }
      p.left--; el.textContent = '00:' + String(Math.max(0, p.left)).padStart(2, '0');
      if (p.left <= 0) preEnd(cur, go);
    }, 1000);
    return true;
  }
  function preBarHTML(cur) {
    if (!preOn(cur) || cur.done) return '';
    const p = cur.pre || { st: 'idle', picks: {} };
    if (p.st === 'run') return `<div class="pre-bar run m-listen"><span class="pre-t"><b id="preLeft">00:${String(p.left).padStart(2, '0')}</b><small>读选项</small></span><span class="pre-tx">先扫一遍选项，给每题选一个预计考点</span><button class="btn tone m-listen" data-preskip>跳过，开始播放</button></div>`;
    if (p.st === 'done') { const n = Object.keys(p.picks).length; return `<div class="pre-bar m-listen"><span class="pre-tx">${n ? `已预判 ${n} 题，交卷后对照命中情况` : '这次没做预判'}</span></div>`; }
    return `<div class="pre-bar m-listen"><span class="pre-tx">${ic('i-eye')}考试节奏：按播放后先有 <b>30 秒读选项</b>，可给每题预判考点（可跳过）</span></div>`;
  }
  function preQHTML(cur, i) {
    const p = cur.pre; if (!preOn(cur) || cur.done || !p || p.st === 'idle') return '';
    const lock = p.st !== 'run';
    if (lock && !p.picks[i]) return '';
    return `<div class="pre-row"><span>预计考点</span>${PRE.map(([k, n]) => `<button class="chip" type="button" data-prek="${k}" data-preq="${i}" aria-pressed="${p.picks[i] === k}" ${lock ? 'disabled' : ''}>${n}</button>`).join('')}</div>`;
  }
  function preClick(e, cur) {
    if (e.target.closest('[data-preskip]')) { preEnd(cur, cur.pre && cur.pre.go); return true; }
    const b = e.target.closest('[data-prek]'); if (!b) return false;
    const p = cur.pre; if (!p || p.st !== 'run') return true;
    const i = +b.dataset.preq; p.picks[i] = p.picks[i] === b.dataset.prek ? undefined : b.dataset.prek; if (!p.picks[i]) delete p.picks[i];
    b.parentNode.querySelectorAll('[data-prek]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.prek === p.picks[i]));
    return true;
  }
  function preExpHTML(cur, i) {
    const p = cur.pre; if (!cur.done || !p || !Object.keys(p.picks).length) return '';
    const a = qType(cur.set.questions[i].q), m = p.picks[i];
    return `<div class="pre-res ${m ? (m === a ? 'ok' : 'bad') : ''}">${m ? `预判 <b>${PRE_N[m]}</b> · ` : '没预判 · '}题干考点 <b>${PRE_N[a]}</b>${m ? (m === a ? ' ✓' : ' ✗') : ''}</div>`;
  }
  function preSumHTML(cur) {
    const p = cur.pre; if (!cur.done || !p) return '';
    const ks = Object.keys(p.picks); if (!ks.length) return '';
    const hit = ks.filter((i) => p.picks[i] === qType(cur.set.questions[+i].q)).length;
    if (!p.logged) { p.logged = 1; const r = rec(), x = r.pre || (r.pre = { n: 0, ok: 0 }); x.n += ks.length; x.ok += hit; C().save(); }
    return `<p class="pre-sum">${ic('i-eye')}考点预判命中 <b>${hit}/${ks.length}</b>（按题干关键词粗分：细节 / 原因 / 态度 / 建议 / 数字）</p>`;
  }

  /* ---------- 倍速爬坡：同一篇第 2 次 1.1×、第 3 次起 1.2×（慢速 VOA 在默认上 +0.1 / +0.2，最多 1.4×） ---------- */
  function rampOf(id, base, slow) {
    const s = St(), n = (s.hist || []).filter((h) => h && h.id === id).length || (s.sets && s.sets[id] ? 1 : 0), k = n + 1;
    if (k < 2) return { r: base, src: 'first', k };
    if (s.rampOff) return { r: base, src: 'off', k };
    const tgt = slow ? Math.min(1.4, base + (k >= 3 ? 0.2 : 0.1)) : (k >= 3 ? 1.2 : 1.1);
    const r = Math.max(base, Math.round(tgt * 10) / 10);
    return { r, src: r > base ? 'ramp' : 'user', k };
  }
  function rateSrcHTML(ramp, manual, r) {
    const R = `<b>${r}×</b>`;
    let t;
    if (manual) t = `当前 ${R} · 你手动选的`;
    else if (!ramp || ramp.src === 'first') t = `当前 ${R} · 你的默认语速（同一篇第 2 次自动 1.1×、第 3 次 1.2×）`;
    else if (ramp.src === 'ramp') t = `当前 ${R} · 第 ${ramp.k} 次做这篇，自动提速 <button class="lnk" data-ramp="off">关掉自动提速</button>`;
    else if (ramp.src === 'off') t = `当前 ${R} · 你的默认语速（自动提速已关）<button class="lnk" data-ramp="on">打开</button>`;
    else t = `当前 ${R} · 你的默认语速已不低于第 ${ramp.k} 次的提速档`;
    return `<div class="rate-src" id="rateSrc">${t}</div>`;
  }

  /* ---------- 生词本：听写收的词库外生词 ---------- */
  function myWordsHTML() {
    const xs = (Array.isArray(St().myWords) ? St().myWords : []).filter((x) => x && x.w).slice().reverse();
    if (!xs.length) return '';
    return `<div class="my-words"><div class="mw-h">听写收的词（不在单词库）<span>${xs.length}</span></div><div class="mw-list">${xs.map((x) => `<span class="mw"><b>${esc(x.w)}</b>${x.ctx ? `<small title="${esc(x.ctx)}">${esc(x.ctx.length > 48 ? x.ctx.slice(0, 48) + '…' : x.ctx)}</small>` : ''}<button data-mwdel="${esc(x.w)}" aria-label="从生词本移除 ${esc(x.w)}">${ic('i-x')}</button></span>`).join('')}</div></div>`;
  }
  function delMyWord(w) { const s = St(); s.myWords = (s.myWords || []).filter((x) => x && x.w !== w); C().save(); }

  window.CET6Drills = {
    open, leave, entryHTML, todayOf, planTask, taskStatus, rtItem, paraKey, dictDue, dictReview, dictGrade, stopDict: stopDA,
    preGate, preBarHTML, preQHTML, preClick, preExpHTML, preSumHTML, qType,
    rampOf, rateSrcHTML, myWordsHTML, delMyWord,
    _diff: diff, _locPool: locPool, _dictPool: dictPool, _wordId: wordId,
  };
})();
