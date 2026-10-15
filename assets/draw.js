/* 组卷抽题：打印版 paper.html 和主站在线模考共用，保证同一卷号抽出同一套题。
 * 结构照真题：写作 1 / 听力 长对话 2 + 篇章 2（合计 7 题）+ 讲座 3（合计 10 题）/ 阅读 选词填空 1 + 段落匹配 1 + 仔细阅读 2 / 翻译 1。
 * 「优先抽没做过的」：各池先在没做过的里抽，不够再用做过的补（做过 = 交过卷 S.sets / 写过 S.wt / 出现在以前的模考里；自选模块的模考只算展示过的题）。
 *   打开时它依赖本机做题记录，所以每套卷生成后把题目 id 记进 S.papers / S.exams，同一卷号以后都按记录还原，打印版和在线版一致。
 *   关掉它就是纯按卷号抽（与本机记录无关，换设备也一样）。
 * 读写的是主站同源 localStorage 'cet6.v1'；主站页面里传入内存中的 S，打印版页面读-改-写 localStorage。 */
(function (g) {
  'use strict';
  const KEY = 'cet6.v1';
  const readS = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const lday = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // 随机数用 splitmix32（先把卷号打散），相邻卷号也会抽出完全不同的题
  function rng(sd) {
    let h = (sd ^ 0x9e3779b9) >>> 0;
    return () => { h = (h + 0x9e3779b9) >>> 0; let z = h; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b); z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35); return ((z ^ (z >>> 16)) >>> 0) / 4294967296; };
  }
  // 做过的题 id 集合
  function doneSet(S) {
    S = S || {};
    const s = new Set(Object.keys(S.sets || {}));
    Object.entries(S.wt || {}).forEach(([k, v]) => { if (v && String(v).trim()) s.add(k); });
    (S.exams || []).forEach((e) => (e.shown || e.ids || []).forEach((id) => s.add(id)));   // 自选模块只算展示过的题（shown）
    return s;
  }
  // opt.done：做过的 id 集合（传了就优先抽没做过的）。不传时与旧版抽法逐位一致，老卷号抽出的题不变
  function draw(sd, opt) {
    const done = opt && opt.done;
    const rnd = rng(sd);
    const order = (arr) => {
      const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return done ? [...a.filter((x) => !done.has(x.id)), ...a.filter((x) => done.has(x.id))] : a;
    };
    const pick = (arr, n) => order(arr).slice(0, Math.min(n, arr.length));
    // 篇章 2 篇合计 7 题、讲座 3 篇合计 10 题，照真题题量；凑不出就用第一次抽到的（题量和真题略有出入，计分按比例换算）。
    // 优先抽没做过的时，没做过的够数就只在没做过的里凑，宁可题量略有出入也不拿做过的
    const pickSum = (arr, n, total) => {
      let best = null;
      for (let t = 0; t < 40; t++) {
        const c = pick(arr, n); const sum = c.reduce((a, x) => a + x.questions.length, 0);
        if (sum === total) return c;
        if (!best) best = c;
      }
      return best;
    };
    const W = pick(WRITING, 1)[0];
    const conv = pick(LISTENING.filter((x) => x.type === 'conv'), 2), pas = pickSum(LISTENING.filter((x) => x.type === 'passage'), 2, 7), lec = pickSum(LISTENING.filter((x) => x.type === 'lecture'), 3, 10);
    const cloze = pick(READING.cloze, 1)[0], match = pick(READING.match, 1)[0], mc = pick(READING.mc, 2);
    const T = pick(TRANSLATION, 1)[0];
    return { W, conv, pas, lec, cloze, match, mc, T };
  }
  const idsOf = (d) => [d.W, ...d.conv, ...d.pas, ...d.lec, d.cloze, d.match, ...d.mc, d.T].map((x) => x.id);
  // 按记录的题目 id 还原一套卷；有题已从题库删掉就返回 null
  function fromIds(ids) {
    if (!Array.isArray(ids) || !ids.length) return null;
    const by = (arr, id) => arr.find((x) => x.id === id);
    const L = ids.map((id) => by(LISTENING, id)).filter(Boolean);
    const d = {
      W: ids.map((id) => by(WRITING, id)).find(Boolean), T: ids.map((id) => by(TRANSLATION, id)).find(Boolean),
      conv: L.filter((x) => x.type === 'conv'), pas: L.filter((x) => x.type === 'passage'), lec: L.filter((x) => x.type === 'lecture'),
      cloze: ids.map((id) => by(READING.cloze, id)).find(Boolean), match: ids.map((id) => by(READING.match, id)).find(Boolean),
      mc: ids.map((id) => by(READING.mc, id)).filter(Boolean),
    };
    if (!d.W || !d.T || !d.cloze || !d.match || !d.mc.length || !L.length) return null;
    return idsOf(d).length === ids.length ? d : null;
  }
  // 这个卷号以前生成过（进行中的模考 / 交过的模考 / 打印过），按记录还原
  function recordOf(S, seed) {
    S = S || {}; seed = +seed;
    const xs = [S.exam, ...(S.exams || []).slice().reverse(), ...(S.papers || []).slice().reverse()];
    return xs.find((r) => r && +r.seed === seed && Array.isArray(r.ids) && fromIds(r.ids)) || null;
  }
  // 取一套卷：有记录按记录，没有就按当前选项抽
  function paperOf(seed, S, fresh) {
    const rec = recordOf(S, seed);
    if (rec) return { d: fromIds(rec.ids), ids: rec.ids.slice(), fresh: rec.fresh !== false, rec: true };
    const d = draw(seed, fresh ? { done: doneSet(S) } : null);
    return { d, ids: idsOf(d), fresh: !!fresh, rec: false };
  }
  // 挑新卷号：试 300 个候选，挑和 avoid（上一套的题目 id）重复最少的，通常一篇不重；有记录的卷号跳过
  function pickSeed(avoid, S, fresh, cur) {
    const av = new Set(avoid || []); const done = fresh ? doneSet(S) : null;
    let best = null, bestN = 1e9;
    for (let t = 0; t < 300; t++) {
      const c = Math.floor(Math.random() * 90000) + 10000; if (c === +cur || recordOf(S, c)) continue;
      const n = idsOf(draw(c, done ? { done } : null)).filter((id) => av.has(id)).length;
      if (n < bestN) { best = c; bestN = n; if (!n) break; }
    }
    return best;
  }
  // 记一条生成记录：{seed, d, mode, ids, fresh}，同卷号同日同方式只留一条。传 S 就改内存里的（主站），不传就读-改-写 localStorage（打印版）
  function recordPaper(seed, mode, ids, fresh, S) {
    const rmw = !S; if (rmw) S = readS();
    S.papers = Array.isArray(S.papers) ? S.papers : [];
    const d = lday(), rec = { seed: +seed, d, mode, ids: ids.slice(), fresh: !!fresh };
    S.papers = S.papers.filter((p) => !(+p.seed === +seed && p.d === d && (p.mode || 'print') === mode));
    S.papers.push(rec); if (S.papers.length > 200) S.papers = S.papers.slice(-200);
    if (rmw) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
    return S;
  }
  g.CET6Draw = { draw, idsOf, fromIds, doneSet, recordOf, paperOf, pickSeed, recordPaper, readS, lday };
})(window);
