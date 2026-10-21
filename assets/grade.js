/* 写作 / 翻译规则估分（纯前端，不调用任何外部服务）：window.CET6Grade
 * 写作六项：字数、切题、词汇、句式、结构、基础规范；翻译四项：关键词、与参考译文重合、长度、基础规范。
 * 每项 0–10 分 + 一句具体建议，加权折成 15 分制档分（14 / 11 / 8 / 5 / 2 / 0 档）。只是规则估分，仅供参考。
 * 模考报告（assets/exam.js）和写译页（assets/app.js 作答框下「估分」）共用这一套；另带「复制给 AI 评分」的提示词拼装与复制。
 * 依赖：VOCAB（data-vocab*.js，可缺）；本文件在 app.js 之前加载，不依赖 window.CET6。 */
(function (g) {
  'use strict';
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
  const bandOf = (s) => (s >= 13 ? 14 : s >= 10 ? 11 : s >= 7 ? 8 : s >= 4 ? 5 : s >= 1 ? 2 : 0);
  const bandDesc = (kind, s) => { const b = bandOf(s); const x = (kind === 'write' ? W_BANDS : T_BANDS).find((r) => r[0] === b); return x ? x[2] : '白卷、离题，或只抄了题目'; };

  /* ---------- 文本工具 ---------- */
  const STOP = new Set(('a an the and or but nor so yet for of to in on at by with from into onto over under about above below up down out off as than then too very can could will would shall should may might must do does did done doing be is am are was were been being have has had having it its it\'s this that these those there here i me my mine we us our ours you your yours he him his she her hers they them their theirs what which who whom whose when where why how all any both each few more most other some such no not only own same just also even still again ever never one ones s t don now if because while although though since unless until whether not get got make made let lets many much lot lots way ways thing things people person really quite rather well good bad'
  ).split(/\s+/));
  // 写作题目 Directions 里的套话，不算切题关键词
  const PROMPT_BOILER = new Set('directions part allowed minutes write writing essay words word least more than should based below above comment commenting saying cite examples example illustrate point points view views state give reasons reason support opinion suppose sign own name use instead letter speech chart shows show question describe analyze suggest possible solutions following topic title'.split(' '));
  const ADV = new Set(('crucial essential significant indispensable inevitable remarkable considerable substantial profound fundamental comprehensive sustainable vital enhance foster cultivate facilitate promote contribute undermine alleviate tackle overcome pursue acquire perspective phenomenon consequence approach initiative motivation ambition competence potential controversial beneficial detrimental advocate emphasize demonstrate highlight acknowledge admittedly nevertheless nonetheless consequently furthermore moreover thereby whereas meanwhile ultimately notably particularly increasingly inevitably undoubtedly accordingly flourish thrive strive endeavor accomplish dedication perseverance resilience integrity diversity accessible efficient innovative innovation versatile obstacle prosperity hence thus genuine genuinely solid valuable invaluable distinct distinctive vivid vigorous diligent persistent consistent proficiency equip equipped indispensable enrich enormous tremendous excessive moderate rational objective subjective prevalent prevail cherish inspire inspiring inspiration aspiration determination commitment responsibility independence awareness confidence sophisticated adequate abundant intensify deteriorate tendency trend unprecedented phenomenal concerning regarding albeit despite notwithstanding nowadays merely solely primarily essentially virtually exceedingly remarkably particularly simultaneously').split(/\s+/));
  const CLAUSE = ['although', 'though', 'which', 'who', 'whom', 'whose', 'whereas', 'while', 'because', 'since', 'unless', 'if', 'when', 'where', 'whether', 'once', 'as long as', 'so that', 'even if', 'now that'];
  const CONN = ['however', 'moreover', 'furthermore', 'therefore', 'nevertheless', 'nonetheless', 'consequently', 'besides', 'meanwhile', 'what is more', 'in addition', 'on the other hand', 'for example', 'for instance', 'to begin with', 'first of all', 'firstly', 'secondly', 'thirdly', 'finally', 'in conclusion', 'to sum up', 'all in all', 'as a result', 'admittedly', 'not only', 'only by', 'in short', 'above all', 'last but not least', 'in a word', 'to conclude', 'thus', 'hence', 'instead', 'otherwise', 'similarly', 'likewise', 'in fact', 'indeed'];
  const OPEN = /^(nowadays|recently|in recent (years|decades)|with the|as (is|we all) (known|know)|it is (widely|generally|commonly)|there is no denying|when it comes to|currently|at present|today|these days|as the saying goes|an old saying|it goes without saying|according to|as (is shown|can be seen|shown)|the (bar|line|pie)? ?chart|dear|ladies and gentlemen|good (morning|afternoon)|hello|in today's|in the|it is|many people|more and more|an increasing number)/i;
  const CLOSE = /(in conclusion|to sum up|all in all|in a word|in short|to conclude|taking .{0,30}into (account|consideration)|only (by|when|if|through)|therefore|thus|hence|for these reasons|from what has been discussed|in my opinion|i believe|i am convinced|i firmly believe|let us|let's|we should|we must|yours sincerely|sincerely|best wishes|thank you)/i;

  const lc = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'");
  const toks = (t) => (lc(t).match(/[a-z0-9]+(?:['\-][a-z0-9]+)*/g) || []);
  const enCount = (t) => toks(t).length;
  const zhCount = (t) => (String(t || '').match(/[一-龥]/g) || []).length;
  function stem(w) {
    w = lc(w).replace(/'s$/, '');
    if (w.length > 4) {
      if (/ies$/.test(w)) w = w.slice(0, -3) + 'y';
      else if (/(ss|us|is)$/.test(w)) { /* keep */ }
      else if (/(ches|shes|xes|sses|zes)$/.test(w)) w = w.slice(0, -2);
      else if (/s$/.test(w)) w = w.slice(0, -1);
    }
    if (w.length > 5 && /ing$/.test(w)) w = w.slice(0, -3);
    else if (w.length > 4 && /ied$/.test(w)) w = w.slice(0, -3) + 'y';
    else if (w.length > 4 && /ed$/.test(w)) w = w.slice(0, -2);
    if (w.length > 5 && /ly$/.test(w)) w = w.slice(0, -2);
    if (/([bdgmnprt])\1$/.test(w)) w = w.slice(0, -1);
    if (w.length > 4 && /e$/.test(w)) w = w.slice(0, -1);
    return w.length > 6 ? w.slice(0, 6) : w;
  }
  const content = (t) => toks(t).filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
  const stems = (t) => content(t).map(stem);
  const has = (t, phrase) => new RegExp('\\b' + phrase.replace(/\s+/g, '\\s+') + '\\b', 'i').test(t);
  const countPh = (t, phrase) => (lc(t).match(new RegExp('\\b' + phrase.replace(/\s+/g, '\\s+') + '\\b', 'g')) || []).length;
  function sentences(t) {
    return String(t || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=["'“A-Za-z0-9])/).map((s) => s.trim()).filter((s) => enCount(s) > 0);
  }
  const paras = (t) => String(t || '').split(/\n\s*\n|\n(?=\s{2,}|\t)|\n/).map((p) => p.trim()).filter((p) => enCount(p) >= 3);
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const r10 = (x) => Math.round(clamp(x) * 10);
  let VSET = null;
  function vocabSet() {
    if (VSET) return VSET; VSET = new Set();
    try { if (typeof VOCAB !== 'undefined') VOCAB.forEach((gp) => gp.words.forEach((w) => { const k = lc(w[0]); if (!/\s/.test(k) && k.length > 3) VSET.add(stem(k)); })); } catch {}
    return VSET;
  }

  /* 基础规范：句首大写、句末标点、连写重复词、过长句、小写 i、夹中文 */
  function mechanics(text) {
    const ss = sentences(text); const issues = []; let pen = 0;
    const lowStart = ss.filter((s) => /^[a-z]/.test(s)).length;
    if (lowStart) { pen += Math.min(0.35, lowStart * 0.08); issues.push(`${lowStart} 句句首没大写`); }
    const t = String(text || '').trim();
    if (t && !/[.!?"”)]$/.test(t)) { pen += 0.1; issues.push('最后一句缺句末标点'); }
    const dup = (lc(text).match(/\b([a-z]+)\s+\1\b/g) || []).filter((m) => !/^(that that|had had)$/.test(m));
    if (dup.length) { pen += Math.min(0.3, dup.length * 0.1); issues.push(`连写重复词「${dup[0]}」`); }
    const long = ss.filter((s) => enCount(s) > 40).length;
    if (long) { pen += Math.min(0.3, long * 0.1); issues.push(`${long} 句超过 40 词，容易出语法错误，拆成两句`); }
    const li = (String(text || '').match(/(^|\s)i(\s|'|$)/g) || []).length;
    if (li) { pen += Math.min(0.2, li * 0.05); issues.push('代词 I 要大写'); }
    const zh = zhCount(text);
    if (zh) { pen += Math.min(0.5, 0.15 + zh * 0.01); issues.push('夹了中文'); }
    const noSpace = (String(text || '').match(/[a-z][,.;][A-Za-z]/g) || []).length;
    if (noSpace) { pen += Math.min(0.15, noSpace * 0.05); issues.push('标点后缺空格'); }
    return { s: clamp(1 - pen), tip: issues.length ? issues.slice(0, 2).join('；') + '。' : '大小写、标点、句长都没发现明显问题。' };
  }
  const lenFactor = (n, need, ex) => (n >= need ? 1 : Math.pow(Math.max(0, n) / need, ex || 1));

  /* ---------- 写作 ---------- */
  function writing(text, W) {
    W = W || {}; text = String(text || '');
    const n = enCount(text), zh = zhCount(text);
    const items = [];
    const res = (score, items2, flag) => ({ kind: 'write', score, band: bandOf(score), n, items: items2, flag: flag || '' });
    if (!text.trim() || (n < 5 && !zh)) return res(0, [], '白卷或几乎没写，按 0 分计。');
    if (zh > n * 1.2 || n < 10) {
      const s = n >= 10 ? 1 : 0;
      return res(zh > n * 1.2 && n >= 10 ? 1 : s, [], zh > n * 1.2 ? '主要是中文，作文要用英文写，最多给 1 分。' : '英文不足 10 词，按 0 分计。');
    }
    // 照抄题目
    const pw = toks(W.prompt || ''); const pset = new Set(pw);
    const copied = toks(text).filter((w) => pset.has(w)).length / Math.max(1, n);
    if (n < 80 && copied > 0.7) return res(0, [], '基本是照抄题目，按 0 分计。');

    // 1 字数
    let sLen, tLen;
    if (n >= 150 && n <= 200) { sLen = 1; tLen = `${n} 词，在 150–200 词区间。`; }
    else if (n > 200) { sLen = n <= 230 ? 0.85 : 0.65; tLen = `${n} 词，超过 200 词，删掉重复的例子或空话。`; }
    else if (n >= 120) { sLen = 0.6 + 0.4 * (n - 120) / 30; tLen = `${n} 词，还差 ${150 - n} 词到 150，补一个具体例子。`; }
    else { sLen = 0.45 * n / 120; tLen = `只有 ${n} 词，不到 120 词会被重扣，至少写满三段、150 词。`; }
    items.push({ k: 'len', name: '字数', s: sLen, w: 0.15, tip: tLen });

    // 2 切题：题目关键词 + 范文高频实词
    const mine = new Set(stems(text));
    const pk = [...new Set(content(W.prompt || '').filter((w) => !PROMPT_BOILER.has(w)).map(stem))];
    const freq = {}; stems(W.sample || '').forEach((s) => { freq[s] = (freq[s] || 0) + 1; });
    const top = Object.entries(freq).filter(([s, c]) => c >= 2 && !pk.includes(s)).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([s]) => s);
    const pHit = pk.filter((s) => mine.has(s)), tHit = top.filter((s) => mine.has(s));
    const pr = pk.length ? pHit.length / pk.length : 1, tr = top.length ? tHit.length / top.length : 1;
    const sRel = clamp((pr / 0.6) * 0.6 + (tr / 0.45) * 0.4);
    const pMiss = content(W.prompt || '').filter((w) => !PROMPT_BOILER.has(w) && !mine.has(stem(w)));
    const tRel = sRel >= 0.85 ? '紧扣题目，题目关键词和这类话题的常用实词都用到了。'
      : pr < 0.5 ? `题目关键词用得少，缺：${[...new Set(pMiss)].slice(0, 4).join('、') || '—'}；首段直接复述题目观点。`
      : `话题词偏少，可以用上 ${Object.entries(freq).filter(([s]) => !mine.has(s) && !pk.includes(s)).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => (content(W.sample).find((w) => stem(w) === s) || s)).join('、')} 这类实词展开。`;
    items.push({ k: 'rel', name: '切题度', s: sRel, w: 0.25, tip: tRel });

    // 3 词汇：站内词库 / 范文高分表达 / 常见六级高级词 + 词汇多样性
    const cw = content(text), V = vocabSet();
    const advSet = new Set(cw.filter((w) => ADV.has(w) || V.has(stem(w))));
    const hlHit = (W.hl || []).filter((p) => has(text, p.replace(/[^A-Za-z' ]/g, ' ').trim().split(/\s+/).slice(0, 4).join(' ')));
    const ttr = cw.length ? new Set(cw.map(stem)).size / cw.length : 0;
    const advN = advSet.size + hlHit.length * 2;
    const sVoc = clamp(0.65 * clamp(advN / 10) + 0.35 * clamp((ttr - 0.45) / 0.25));
    const tVoc = advN >= 10 && ttr >= 0.62 ? `高级词 / 加分表达 ${advN} 处，用词有变化。`
      : advN < 5 ? `高级词只有 ${advN} 个，把 important / good 换成 crucial / beneficial，用上 What is more、Admittedly 这类表达。`
      : ttr < 0.55 ? `同一个词反复出现（词汇多样性 ${Math.round(ttr * 100)}%），换同义词：important → vital / essential。`
      : `高级词 ${advN} 处，再加两三个，比如 indispensable、foster、profound。`;
    items.push({ k: 'voc', name: '词汇', s: sVoc, w: 0.2, tip: tVoc });

    // 4 句式：平均句长、长短句变化、从句、连接词
    const ss = sentences(text), lens = ss.map(enCount);
    const avg = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length);
    const sd = Math.sqrt(lens.reduce((a, b) => a + (b - avg) ** 2, 0) / Math.max(1, lens.length));
    const cl = CLAUSE.reduce((a, p) => a + countPh(text, p), 0), cn = CONN.reduce((a, p) => a + countPh(text, p), 0);
    const sAvg = avg >= 13 && avg <= 26 ? 1 : avg < 13 ? clamp(avg / 13) : clamp(1 - (avg - 26) / 20);
    const sSen = clamp(0.25 * sAvg + 0.2 * clamp(sd / 5) + 0.3 * clamp(cl / 5) + 0.25 * clamp(cn / 4));
    const tSen = cl < 3 ? `只有 ${cl} 个从句，试试用 which / although / whereas 把两句连起来。`
      : cn < 3 ? `连接词只有 ${cn} 个，段内用 What is more、However、As a result 理顺逻辑。`
      : avg < 12 ? `平均每句 ${Math.round(avg)} 词，短句太多，合并成复合句。`
      : sd < 4 ? '句子长短太平均，穿插一两句短句强调观点。'
      : `从句 ${cl} 个、连接词 ${cn} 个，平均句长 ${Math.round(avg)} 词，长短有变化。`;
    items.push({ k: 'sen', name: '句式', s: sSen, w: 0.15, tip: tSen });

    // 5 结构：段落数、开头、结尾
    const ps = paras(text); const np = ps.length;
    const open = ps.length && (OPEN.test(ps[0]) || sentences(ps[0]).length >= 2);
    const lastP = ps.length > 1 ? ps[ps.length - 1] : (ss[ss.length - 1] || '');
    const close = !!lastP && CLOSE.test(lastP);
    const sStr = clamp((np >= 3 ? 0.55 : np === 2 ? 0.3 : 0.1) + (open ? 0.2 : 0) + (close ? 0.25 : 0));
    const tStr = np < 3 ? `只有 ${np} 段，按「提出观点 → 理由 + 例子 → 总结」分成三段，段间空一行。`
      : !close ? '结尾段缺总结句，用 In conclusion / Only by … can we … 收尾。'
      : !open ? '开头段直接点题，用 Nowadays … / When it comes to … 引出观点。'
      : `${np} 段，开头点题、结尾总结，结构完整。`;
    items.push({ k: 'str', name: '结构', s: sStr, w: 0.1, tip: tStr });

    // 6 基础规范
    const m = mechanics(text);
    items.push({ k: 'mec', name: '基础规范', s: m.s, w: 0.15, tip: m.tip });

    let raw = items.reduce((a, x) => a + x.s * x.w, 0);
    raw *= lenFactor(n, 120, 1.5);           // 不到 120 词重扣
    if (sRel < 0.25) raw *= 0.6;           // 基本离题
    const score = Math.max(n >= 10 ? 1 : 0, Math.min(14, Math.round(Math.pow(raw, 1.3) * 15.2)));   // 规则看不出语法和论证质量，最高给 14
    items.forEach((x) => { x.pts = r10(x.s); });
    return res(score, items);
  }

  /* ---------- 翻译 ---------- */
  // 关键词表 "中文 english / alt"：取英文部分，按 / 拆成备选
  function keyAlts(k) {
    const m = String(k).match(/^(.*?)\s+([A-Za-z(].*)$/); const zh = m ? m[1] : '', en = m ? m[2] : k;
    return { zh, en, alts: en.split(/\s*\/\s*/).map((a) => a.replace(/\.\.\.|…|\(s\)|\(es\)/g, ' ').trim()).filter(Boolean) };
  }
  function keyHit(text, alt, mineSet) {
    const core = content(alt).map(stem).filter((s) => !['sth', 'sb', 'one'].includes(s));
    if (!core.length) return has(text, alt);
    const hit = core.filter((s) => mineSet.has(s)).length;
    return core.length === 1 ? hit === 1 : hit / core.length >= 0.6;
  }
  function translation(text, T) {
    T = T || {}; text = String(text || '');
    const n = enCount(text), zh = zhCount(text), ref = String(T.en || ''), rn = enCount(ref) || 1;
    const res = (score, items2, flag) => ({ kind: 'trans', score, band: bandOf(score), n, items: items2, flag: flag || '' });
    if (!text.trim() || (n < 5 && !zh)) return res(0, [], '白卷或几乎没写，按 0 分计。');
    if (zh > n * 1.2) return res(n >= 10 ? 1 : 0, [], '主要是中文，没有译成英文，最多给 1 分。');
    if (n < 10) return res(0, [], '英文不足 10 词，按 0 分计。');
    const items = [];
    const mineSet = new Set(stems(text).concat(toks(text).map(stem)));
    // 1 关键词覆盖
    const ks = (T.keys || []).map(keyAlts);
    const hitK = ks.filter((k) => k.alts.some((a) => keyHit(text, a, mineSet)));
    const missK = ks.filter((k) => !hitK.includes(k));
    const kr = ks.length ? hitK.length / ks.length : 1;
    const sKey = clamp(kr / 0.85);
    const tKey = !missK.length ? `关键词 ${ks.length} 个全部译到。` : `关键词覆盖 ${hitK.length}/${ks.length}，缺少：${missK.slice(0, 3).map((k) => k.alts[0].replace(/\s+/g, ' ')).join('、')}${missK.length > 3 ? ' 等' : ''}。`;
    items.push({ k: 'key', name: '关键词', s: sKey, w: 0.35, tip: tKey });
    // 2 与参考译文实词重合（词干 unigram 召回 + bigram）
    const rs = [...new Set(stems(ref))], ms = new Set(stems(text));
    const uni = rs.length ? rs.filter((s) => ms.has(s)).length / rs.length : 0;
    const bg = (t) => { const a = toks(t).map(stem); const out = new Set(); for (let i = 0; i < a.length - 1; i++) out.add(a[i] + ' ' + a[i + 1]); return out; };
    const rb = bg(ref), mb = bg(text); const bi = rb.size ? [...rb].filter((x) => mb.has(x)).length / rb.size : 0;
    const sOv = clamp((0.7 * uni + 0.3 * bi) / 0.7);
    const refW = ref.match(/[A-Za-z]+(?:['\-][A-Za-z]+)*/g) || [];
    const miss = rs.filter((s) => !ms.has(s)).slice(0, 4).map((s) => refW.find((w) => stem(w) === s) || s);
    const tOv = sOv >= 0.85 ? '意思基本译全，和参考译文用词高度一致。' : `和参考译文实词重合 ${Math.round(uni * 100)}%，可能漏译了：${miss.join('、')}。`;
    items.push({ k: 'ov', name: '意思完整度', s: sOv, w: 0.35, tip: tOv });
    // 3 长度
    const ratio = n / rn;
    const sL = ratio >= 0.7 && ratio <= 1.3 ? 1 : ratio < 0.7 ? clamp(ratio / 0.7) ** 1.3 : clamp(1 - (ratio - 1.3) / 0.7);
    const tL = sL === 1 ? `${n} 词，是参考译文的 ${Math.round(ratio * 100)}%，长度合适。` : ratio < 0.7 ? `${n} 词，只有参考译文的 ${Math.round(ratio * 100)}%，可能整句漏译。` : `${n} 词，比参考译文长 ${Math.round((ratio - 1) * 100)}%，有啰嗦或重复。`;
    items.push({ k: 'len', name: '长度', s: sL, w: 0.15, tip: tL });
    // 4 基础规范
    const m = mechanics(text);
    items.push({ k: 'mec', name: '基础规范', s: m.s, w: 0.15, tip: m.tip });
    let raw = items.reduce((a, x) => a + x.s * x.w, 0);
    raw *= lenFactor(ratio, 0.75, 1);
    if (kr < 0.25 && uni < 0.35) raw *= 0.5;   // 和原文对不上，基本没译这段
    const score = Math.max(1, Math.min(14, Math.round(Math.pow(raw, 1.3) * 15.2)));
    items.forEach((x) => { x.pts = r10(x.s); });
    return res(score, items);
  }

  /* ---------- 展示 ---------- */
  const e = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // 估分面板：总分 + 分项（0–10）+ 建议
  function panelHTML(r, opt) {
    opt = opt || {};
    const head = `<div class="gr-h"><span class="gr-sc"><b>${r.score}</b><small>/15</small></span><span class="gr-bd"><b>规则估分 · ${r.band ? r.band + ' 分档' : '0 分'}</b><span>${e(bandDesc(r.kind, r.score))}</span></span></div>`;
    const flag = r.flag ? `<p class="gr-flag">${e(r.flag)}</p>` : '';
    const rows = r.items.map((x) => `<div class="gr-it"><span class="gr-n">${e(x.name)}</span><span class="gr-bar"><i style="width:${x.pts * 10}%"></i></span><span class="gr-p"><b>${x.pts}</b>/10</span><span class="gr-tip">${e(x.tip)}</span></div>`).join('');
    const note = `<p class="gr-note">规则估分（字数、关键词、句式等可数的指标），看不出语法对错和论证质量，仅供参考${opt.manual ? '，可在下面手动改档' : ''}。</p>`;
    const ai = opt.ai ? `<div class="gr-acts"><button class="btn soft" type="button" data-graicopy>${opt.aiIcon || ''}复制给 AI 评分</button><span class="gr-cp" aria-live="polite"></span></div>` : '';
    return `<div class="gr-panel">${head}${flag}${rows ? `<div class="gr-items">${rows}</div>` : ''}${note}${ai}</div>`;
  }
  // 复制给 AI 评分的提示词
  function aiPrompt(kind, item, text) {
    const isW = kind === 'write'; const bands = isW ? W_BANDS : T_BANDS;
    const std = bands.map(([b, rg, d]) => `- ${b} 分档（${rg[0]}–${rg[2]} 分）：${d}`).join('\n') + '\n- 0 分：白卷、离题，或只抄了题目';
    const q = isW ? `【作文题目】\n${item.prompt || ''}` : `【翻译原文】\n${item.zh || ''}`;
    const ref = isW ? '' : `\n\n【参考译文（仅供你对照，不要求逐字一致）】\n${item.en || ''}`;
    return `你是大学英语六级（CET-6）${isW ? '写作' : '翻译'}阅卷老师。请按六级官方评分标准给下面这份${isW ? '作文' : '译文'}评分并逐句指导。

${q}${ref}

【我的${isW ? '作文' : '译文'}】
${String(text || '').trim() || '（空）'}

【六级${isW ? '写作' : '翻译'}评分标准（满分 15 分，先定档再在档内加减 1 分）】
${std}

【请按以下格式回答（用中文讲解，英文例句保留英文）】
1. 档次和分数：给出所在分档和具体分数（0–15），用两三句话说明理由${isW ? '（切题、内容、结构、语言）' : '（意思是否译全、用词、语法）'}。
2. 逐句修改建议：按原文顺序逐句列出——原句 → 问题（语法 / 用词 / 搭配 / 逻辑${isW ? '' : ' / 漏译错译'}）→ 改法；没问题的句子标「OK」。
3. 改写一版：在保留我原意的基础上，给出一版能拿 13–14 分的${isW ? '作文（150–200 词）' : '译文'}，并标出你用到的加分表达。`;
  }
  // 复制：navigator.clipboard，失败时弹出可全选的文本框
  function copyText(text, onDone) {
    const fallback = () => {
      const old = document.querySelector('.gr-modal'); if (old) old.remove();
      const m = document.createElement('div'); m.className = 'gr-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', '复制提示词');
      m.innerHTML = `<div class="gr-mbox"><div class="gr-mh"><b>复制下面的提示词，粘贴给 AI</b><button class="btn ghost" type="button" data-grclose>关闭</button></div><textarea readonly spellcheck="false"></textarea><p>长按或 Ctrl / ⌘ + A 全选后复制。</p></div>`;
      m.querySelector('textarea').value = text; document.body.appendChild(m);
      const ta = m.querySelector('textarea'); ta.focus(); ta.select();
      m.addEventListener('click', (ev) => { if (ev.target === m || ev.target.closest('[data-grclose]')) m.remove(); });
      if (onDone) onDone(false);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => onDone && onDone(true), fallback);
      else fallback();
    } catch { fallback(); }
  }
  // 写译页用：把估分面板渲染进 el，并接好「复制给 AI 评分」
  function mount(el, kind, item, text, opt) {
    if (!el) return null;
    const r = kind === 'write' ? writing(text, item) : translation(text, item);
    el.innerHTML = panelHTML(r, Object.assign({ ai: true }, opt || {}));
    el.onclick = (ev) => {
      const b = ev.target.closest('[data-graicopy]'); if (!b) return;
      const cur = (opt && opt.getText) ? opt.getText() : text;
      copyText(aiPrompt(kind, item, cur), (ok) => { const s = el.querySelector('.gr-cp'); if (s) s.textContent = ok ? '已复制，粘贴给任意 AI 即可' : ''; });
    };
    return r;
  }
  g.CET6Grade = { writing, translation, bandOf, bandDesc, panelHTML, aiPrompt, copyText, mount, W_BANDS, T_BANDS, keyAlts, enCount, stem, sentences, paras };
})(window);
