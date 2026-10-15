/* 一键组卷：从题库随机抽题拼成完整六级模拟卷，版式仿真题试题册。
 * 结构照真题：Part I 写作 / Part II 听力（长对话 2 + 篇章 2 + 讲座 3）/ Part III 阅读（选词填空 1 + 段落匹配 1 + 仔细阅读 2）/ Part IV 翻译。
 * 之后是答题卡 1（写作 + 听力）、答题卡 2（阅读 + 翻译），最后是教师用答案页（答案 / 解析 / 范文 / 听力原文）。
 * 题库不够时按已有数量抽，并在卷首注明。seed 写在 URL 里，同一卷号出同一套卷。
 * 分页：把内容拆成块，按 A4 实际排版高度装页（题目和选项不跨页、标题不落页尾，文章可按段跨页），屏幕和打印一致。 */
(() => {
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const K = ['A', 'B', 'C', 'D'];
  let seed = +(new URL(location.href).searchParams.get('seed')) || (Date.now() % 100000);
  // 抽题：给定卷号确定性地抽一套。随机数用 splitmix32（先把卷号打散），相邻卷号也会抽出完全不同的题。
  // 旧版线性同余在 JS 浮点下丢精度，卷号相近时抽出的题高度重合，「换一套」常常内容不变。
  const draw = (sd) => {
    let h = (sd ^ 0x9e3779b9) >>> 0;
    const rnd = () => { h = (h + 0x9e3779b9) >>> 0; let z = h; z = Math.imul(z ^ (z >>> 16), 0x85ebca6b); z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35); return ((z ^ (z >>> 16)) >>> 0) / 4294967296; };
    const pick = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, Math.min(n, a.length)); };
    // 篇章 2 篇合计 7 题、讲座 3 篇合计 10 题，照真题题量；凑不出就退回随机
    const pickSum = (arr, n, total) => { let best = null; for (let t = 0; t < 40; t++) { const c = pick(arr, n); const sum = c.reduce((a, x) => a + x.questions.length, 0); if (sum === total) return c; if (!best) best = c; } return best; };
    const W = pick(WRITING, 1)[0];
    const conv = pick(LISTENING.filter((x) => x.type === 'conv'), 2), pas = pickSum(LISTENING.filter((x) => x.type === 'passage'), 2, 7), lec = pickSum(LISTENING.filter((x) => x.type === 'lecture'), 3, 10);
    const cloze = pick(READING.cloze, 1)[0], match = pick(READING.match, 1)[0], mc = pick(READING.mc, 2);
    const T = pick(TRANSLATION, 1)[0];
    return { W, conv, pas, lec, cloze, match, mc, T };
  };
  const idsOf = (d) => [d.W, ...d.conv, ...d.pas, ...d.lec, d.cloze, d.match, ...d.mc, d.T].map((x) => x.id);
  const { W, conv, pas, lec, cloze, match, mc, T } = draw(seed);
  const short = (conv.length < 2 || pas.length < 2 || lec.length < 3 || mc.length < 2) ? '题库仍在扩充，本卷听力 / 阅读题量少于真题的 25 / 30 题。' : '';
  const listenSets = [...conv, ...pas, ...lec];

  // ---------- 工具 ----------
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];
  const word = (k) => WORDS[k] || String(k);
  const plural = (k, s, p) => `${word(k)} ${k === 1 ? s : (p || s + 's')}`;
  const qCountPhrase = (sets) => { const u = [...new Set(sets.map((s) => s.questions.length))].sort((a, b) => a - b); return u.length === 1 ? word(u[0]) : u.slice(0, -1).map(word).join(', ') + ' or ' + word(u[u.length - 1]); };
  const cleanTitle = (t) => t.replace(/^[^·]+·\s*/, '');
  const dirHtml = (text) => `<p class="dir"><b>Directions:</b> ${esc(text)}</p>`;
  // 选项排法照真题：短选项一行 4 个，中等一行 2 个，长选项每行 1 个
  const optCols = (opts) => { const m = Math.max(...opts.map((o) => String(o).length)); return m <= 20 ? 'c4' : m <= 44 ? 'c2' : 'c1'; };
  const optsHtml = (opts) => `<div class="opts ${optCols(opts)}">${opts.map((o, k) => `<div>${K[k]}) ${esc(o)}</div>`).join('')}</div>`;
  const ROMAN = ['', 'I', 'II', 'III', 'IV'];
  const partHtml = (no, title, mins) => `<div class="part"><span class="pno">Part ${ROMAN[no]}</span><span class="pt">${title}</span><span class="pm">(${mins} minutes)</span></div>`;

  // 块：h = html，keep = 与下一块同页（标题 / 说明），brk = 另起一页
  const blk = (h, o = {}) => ({ h, keep: !!o.keep, brk: !!o.brk });

  // ---------- 连续题号 ----------
  let n = 0; const num = () => ++n;
  const numbered = []; // {n, ans, part, exp, letters}
  const listenQs = []; // 听力：每题对应的篇目与题干（放进教师用原文）
  const mcItems = (qs, part, withStem) => qs.map((q) => {
    const i = num();
    numbered.push({ n: i, ans: K[q.a], part, exp: q.exp, letters: K });
    if (part === 'listen') listenQs.push({ n: i, q: q.q });
    const stem = (part === 'read' || withStem) ? `<div class="stem">${esc(q.q)}</div>` : '';
    return blk(`<div class="q"><span class="qn">${i}.</span><div>${stem}${optsHtml(q.opts)}</div></div>`);
  });

  // ---------- 试题册（依赖勾选“听力印题干”，所以做成函数） ----------
  function booklet(withStem) {
    n = 0; numbered.length = 0; listenQs.length = 0;
    const B = [];
    // 封面 + Part I
    B.push(blk(`<div class="cover">
      <div class="cv-top"><span>模拟★自测用</span><span class="code">试卷代号 <b>${seed}</b></span></div>
      <div class="cv-title">大学英语六级考试</div>
      <div class="cv-en">COLLEGE ENGLISH TEST</div>
      <div class="cv-band">— Band Six —</div>
      <div><span class="cv-book">试题册</span></div>
      <div class="cv-info"><span>姓名 <span class="fill"></span></span><span>准考证号 <span class="boxes">${'<i></i>'.repeat(15)}</span></span></div>
      <div class="notice"><div class="nt">注意事项</div>
        <p>一、将自己的姓名、准考证号写在答题卡 1 和答题卡 2 的指定位置上，并在答题卡上填写试卷代号（本卷的卷号即试卷代号）。</p>
        <p>二、全卷考试时间 130 分钟：写作 30 分钟，听力理解 30 分钟，阅读理解 40 分钟，翻译 30 分钟。满分 710 分。</p>
        <p>三、所有答案必须写或涂在答题卡上，答在试题册上无效。写作与听力答在答题卡 1 上；阅读与翻译答在答题卡 2 上。</p>
        <p>四、选择题用 2B 铅笔在答题卡上将对应字母涂黑，每题只涂一个，改动时用橡皮擦净；写作和翻译用黑色字迹的签字笔书写。</p>
        <p>五、听力录音每段只播放一遍。自测时请在本站「听读」中按 Part II 所列篇目顺序播放，选「考试节奏」即带题目播报和作答停顿。</p>
        <p>六、答题卡 1 在听力结束后收回；考试结束后对照卷末「教师用 · 答案页」自行评分。</p>
      </div>
      ${short ? `<div class="short">${esc(short)}</div>` : ''}
    </div>`));
    B.push(blk(partHtml(1, 'Writing', 30), { keep: true }));
    B.push(blk(`<p class="part-note">（请于开考后 30 分钟内在答题卡 1 上完成写作，之后进入听力部分）</p>`, { keep: true }));
    B.push(blk(`<p class="dir">${esc(W.prompt).replace(/^Directions:/, '<b>Directions:</b>')}</p>`));

    // Part II 听力
    B.push(blk(partHtml(2, 'Listening Comprehension', 30), { keep: true, brk: true }));
    B.push(blk(`<div class="note">录音：本站「听读」按顺序播放 ${listenSets.map((x, k) => `${k + 1}. ${esc(cleanTitle(x.title))}`).join('；')}。</div>`, { keep: true }));
    const listenSec = (sets, sec, dir, label) => {
      if (!sets.length) return;
      B.push(blk(`<div class="sec">Section ${sec}</div>`, { keep: true }));
      B.push(blk(dirHtml(dir), { keep: true }));
      sets.forEach((s) => {
        const a = n + 1, b = n + s.questions.length;
        B.push(blk(`<p class="qb">Questions ${a} ${b > a ? `to ${b} are` : 'is'} based on the ${label} you have just heard.</p>`, { keep: true }));
        B.push(...mcItems(s.questions, 'listen', withStem));
      });
    };
    listenSec(conv, 'A', `In this section, you will hear ${plural(conv.length, 'long conversation')}. At the end of each conversation, you will hear ${qCountPhrase(conv)} questions. Both the conversation and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.`, 'conversation');
    listenSec(pas, 'B', `In this section, you will hear ${plural(pas.length, 'passage')}. At the end of each passage, you will hear ${qCountPhrase(pas)} questions. Both the passage and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.`, 'passage');
    listenSec(lec, 'C', `In this section, you will hear ${plural(lec.length, 'recording')} of lectures or talks followed by ${qCountPhrase(lec)} questions. The recordings will be played only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.`, 'recording');

    // Part III 阅读 · Section A 选词填空
    B.push(blk(partHtml(3, 'Reading Comprehension', 40), { keep: true, brk: true }));
    const clozeNums = cloze.answers.map(() => num());
    cloze.answers.forEach((a, i) => numbered.push({ n: clozeNums[i], ans: a, part: 'read', exp: cloze.exp[i], letters: cloze.bank.map((b) => b[0]) }));
    B.push(blk(`<div class="sec">Section A</div>`, { keep: true }));
    B.push(blk(dirHtml(`In this section, there is a passage with ${word(clozeNums.length)} blanks. You are required to select one word for each blank from a list of choices given in a word bank following the passage. Read the passage through carefully before making your choices. Each choice in the bank is identified by a letter. Please mark the corresponding letter for each item on Answer Sheet 2 with a single line through the centre. You may not use any of the words in the bank more than once.`), { keep: true }));
    B.push(blk(`<p class="qb">Questions ${clozeNums[0]} to ${clozeNums[clozeNums.length - 1]} are based on the following passage.</p>`, { keep: true }));
    const clozeText = esc(cloze.text).replace(/\[(\d+)\]/g, (m, i) => `<span class="blank">${clozeNums[+i - 1]}</span>`);
    clozeText.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="pp">${p}</p>`)));
    B.push(blk(`<div class="bank">${cloze.bank.map((b) => `<div>${esc(b)}</div>`).join('')}</div>`));

    // Section B 段落匹配
    const mNums = match.items.map(() => num());
    match.items.forEach((it, i) => numbered.push({ n: mNums[i], ans: it.a, part: 'read', exp: '', letters: match.paras.map(([l]) => l) }));
    B.push(blk(`<div class="sec">Section B</div>`, { keep: true }));
    B.push(blk(dirHtml(`In this section, you are going to read a passage with ${word(mNums.length)} statements attached to it. Each statement contains information given in one of the paragraphs. Identify the paragraph from which the information is derived. You may choose a paragraph more than once. Each paragraph is marked with a letter. Answer the questions by marking the corresponding letter on Answer Sheet 2.`), { keep: true }));
    match.paras.forEach(([l, p]) => B.push(blk(`<p class="pp lab"><span class="pl">${esc(l)})</span>${esc(p)}</p>`)));
    match.items.forEach((it, i) => B.push(blk(`<div class="stm"><span class="qn">${mNums[i]}.</span><span>${esc(it.s)}</span></div>`)));

    // Section C 仔细阅读
    B.push(blk(`<div class="sec">Section C</div>`, { keep: true }));
    B.push(blk(dirHtml(`There ${mc.length === 1 ? 'is one passage' : `are ${word(mc.length)} passages`} in this section. Each passage is followed by some questions or unfinished statements. For each of them there are four choices marked A), B), C) and D). You should decide on the best choice and mark the corresponding letter on Answer Sheet 2 with a single line through the centre.`), { keep: true }));
    mc.forEach((s, i) => {
      B.push(blk(`<div class="sec">Passage ${['One', 'Two', 'Three'][i]}</div>`, { keep: true }));
      B.push(blk(`<p class="qb">Questions ${n + 1} to ${n + s.questions.length} are based on the following passage.</p>`, { keep: true }));
      s.text.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="pp">${esc(p)}</p>`)));
      B.push(...mcItems(s.questions, 'read'));
    });

    // Part IV 翻译
    B.push(blk(partHtml(4, 'Translation', 30), { keep: true }));
    B.push(blk(dirHtml('For this part, you are allowed 30 minutes to translate a passage from Chinese into English. You should write your answer on Answer Sheet 2.'), { keep: true }));
    T.zh.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="zh">${esc(p)}</p>`)));
    return B;
  }

  // ---------- 答题卡（固定一页一张） ----------
  const brow = (x) => `<div class="brow"><span class="no">${x.n}</span>${x.letters.map((l) => `<i>[${esc(l)}]</i>`).join('')}</div>`;
  const bcols = (xs, per) => { const cols = []; for (let i = 0; i < xs.length; i += per) cols.push(`<div class="bcol">${xs.slice(i, i + per).map(brow).join('')}</div>`); return cols.join(''); };
  const zkzGrid = () => `<div class="zkz"><div class="lab">准 考 证 号</div><table><tr class="box">${'<td></td>'.repeat(15)}</tr>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<tr>${`<td>[${d}]</td>`.repeat(15)}</tr>`).join('')}</table></div>`;
  const cardHead = (no, sub, grid) => `<div class="ct">大学英语六级考试　答题卡 ${no}<small>${sub}</small></div>
    <div class="hd"><div>
      <div class="row">姓　　名 <span class="fill"></span></div>
      ${grid ? '' : `<div class="row">准考证号 <span class="boxes">${'<i></i>'.repeat(15)}</span></div>`}
      <div class="row">试卷代号 <b style="font-family:var(--en);font-size:10.5pt;margin-left:1mm">${seed}</b></div>
      <div class="tips"><b>注意事项</b>：1. 用 2B 铅笔填涂，正确填涂示例<span class="mark"></span>，每题只涂一个选项；2. 写作、翻译用黑色签字笔在规定区域内作答，超出区域无效；3. 保持卡面整洁，不得折叠、不得使用涂改液。</div>
    </div>${grid ? zkzGrid() : `<div class="zkz" style="align-self:end;font-family:var(--zh);font-size:8pt;text-align:right">缺考标记 □<br>（考生禁填）</div>`}</div>`;

  const LINES = `<div class="lines">${'<div></div>'.repeat(40)}</div>`; // 实线横格，多出的被裁掉
  function cards() {
    const L = numbered.filter((x) => x.part === 'listen');
    const R = numbered.filter((x) => x.part === 'read');
    const RA = R.filter((x) => x.letters.length > 4 && x.letters.length >= 13);
    const RB = R.filter((x) => x.letters.length > 4 && x.letters.length < 13);
    const RC = R.filter((x) => x.letters.length <= 4);
    const card1 = `<div class="card">${cardHead(1, 'Answer Sheet 1 · 写作与听力理解', true)}
      <div class="cardsec write"><div class="cs">Part I　Writing<small>（30 分钟，在下列横线上作答）</small></div>
        <p class="prompt">${esc(W.prompt).replace(/^Directions:/, '<b>Directions:</b>')}</p>${LINES}</div>
      ${L.length ? `<div class="cardsec" style="margin-bottom:0"><div class="cs">Part II　Listening Comprehension<small>（听力选择题，2B 铅笔填涂）</small></div><div class="bgrid">${bcols(L, 5)}</div></div>` : ''}
    </div>`;
    const card2 = `<div class="card">${cardHead(2, 'Answer Sheet 2 · 阅读理解与翻译', false)}
      <div class="cardsec"><div class="cs">Part III　Reading Comprehension<small>（2B 铅笔填涂）</small></div>
        <div class="bgrid">
          ${RA.length ? `<div class="bcol"><div class="lab">Section A</div>${RA.map(brow).join('')}</div>` : ''}
          ${RB.length ? `<div class="bcol"><div class="lab">Section B</div>${RB.map(brow).join('')}</div>` : ''}
        </div>
        ${RC.length ? `<div class="bgrid" style="justify-content:flex-start;gap:12mm;margin-top:2mm"><div class="bcol"><div class="lab">Section C</div>${RC.slice(0, Math.ceil(RC.length / 2)).map(brow).join('')}</div><div class="bcol"><div class="lab">&nbsp;</div>${RC.slice(Math.ceil(RC.length / 2)).map(brow).join('')}</div></div>` : ''}
      </div>
      <div class="cardsec write" style="margin-bottom:0"><div class="cs">Part IV　Translation<small>（30 分钟，将试题册上的中文段落译成英文）</small></div>${LINES}</div>
    </div>`;
    return [card1, card2];
  }

  // ---------- 教师用答案页 ----------
  function keyBlocks() {
    const B = [];
    B.push(blk(`<div class="kband"><b>教师用 · 答案页</b><div>参考答案 / 解析 / 写作范文 / 翻译参考译文 / 听力原文。打印考试用卷时可在工具条取消勾选「附答案与听力原文」，或只打印前面的试题册和答题卡页码。</div></div>`, { keep: true }));
    B.push(blk(`<div class="kh">一、参考答案</div>`, { keep: true }));
    const tab = (xs) => `<div class="ktab">${xs.map((x) => `<div><b>${x.n}.</b>${esc(x.ans)}</div>`).join('')}</div>`;
    const L = numbered.filter((x) => x.part === 'listen'), R = numbered.filter((x) => x.part === 'read');
    if (L.length) { B.push(blk(`<div class="kh3">Part II　Listening Comprehension（${L[0].n}–${L[L.length - 1].n}）</div>`, { keep: true })); B.push(blk(tab(L))); }
    if (R.length) { B.push(blk(`<div class="kh3">Part III　Reading Comprehension（${R[0].n}–${R[R.length - 1].n}）</div>`, { keep: true })); B.push(blk(tab(R))); }
    const ex = numbered.filter((x) => x.exp);
    if (ex.length) {
      B.push(blk(`<div class="kh">二、答案解析</div>`, { keep: true }));
      ex.forEach((x) => B.push(blk(`<p class="exp"><b>${x.n}. ${esc(x.ans)}</b>　${esc(x.exp)}</p>`)));
    }
    B.push(blk(`<div class="kh">三、写作范文</div>`, { keep: true }));
    B.push(blk(`<p class="kh3" style="font-weight:400">${esc(cleanTitle(W.title))}</p>`, { keep: true }));
    W.sample.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="ref">${esc(p)}</p>`)));
    B.push(blk(`<div class="kh">四、翻译参考译文</div>`, { keep: true }));
    T.en.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="ref">${esc(p)}</p>`)));
    B.push(blk(`<div class="kh">五、听力原文（Listening Scripts）</div>`, { keep: true }));
    let qi = 0;
    listenSets.forEach((s, i) => {
      const sec = i < conv.length ? 'Section A' : i < conv.length + pas.length ? 'Section B' : 'Section C';
      B.push(blk(`<div class="kh3">${sec} · ${i + 1}. ${esc(s.title)}</div>`, { keep: true }));
      s.script.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="sc">${esc(p)}</p>`)));
      const qs = listenQs.slice(qi, qi + s.questions.length); qi += s.questions.length;
      if (qs.length) B.push(blk(`<p class="sc"><b>Questions ${qs[0].n} to ${qs[qs.length - 1].n} are based on the ${i < conv.length ? 'conversation' : i < conv.length + pas.length ? 'passage' : 'recording'} you have just heard.</b></p>`, { keep: true }));
      qs.forEach((q) => B.push(blk(`<p class="sc sq">${q.n}. ${esc(q.q)}</p>`)));
    });
    return B;
  }

  // ---------- 分页 ----------
  const root = document.getElementById('paper');
  function newPage(kind) {
    const pg = document.createElement('div'); pg.className = 'page ' + kind;
    const body = document.createElement('div'); body.className = 'body';
    const pf = document.createElement('div'); pf.className = 'pf';
    pg.append(body, pf);
    if (kind === 'key') { const ph = document.createElement('div'); ph.className = 'ph'; ph.innerHTML = `<span>教师用 · 答案页</span><span>卷号 ${seed}</span>`; pg.append(ph); }
    root.appendChild(pg);
    return { pg, body, pf };
  }
  const over = (body) => { const l = body.lastElementChild; return body.scrollHeight > body.clientHeight || (l && l.offsetTop + l.offsetHeight > body.clientHeight - 3); };
  const toEl = (b) => { const t = document.createElement('template'); t.innerHTML = `<div class="blk">${b.h}</div>`; const el = t.content.firstElementChild; if (b.keep) el.dataset.keep = '1'; return el; };
  function flow(blocks, kind) {
    const pages = []; let cur = newPage(kind); pages.push(cur);
    for (const b of blocks) {
      if (b.brk && cur.body.childElementCount) { cur = newPage(kind); pages.push(cur); }
      const el = toEl(b); cur.body.appendChild(el);
      if (!over(cur.body)) continue;
      cur.body.removeChild(el);
      // 页尾的标题 / 说明随下一块一起换页，避免孤立标题
      const carry = [];
      while (cur.body.childElementCount > 1 && cur.body.lastElementChild.dataset.keep) carry.unshift(cur.body.removeChild(cur.body.lastElementChild));
      if (!cur.body.childElementCount) { cur.body.appendChild(el); continue; } // 单块超过一页：只能放着
      cur = newPage(kind); pages.push(cur);
      carry.forEach((c) => cur.body.appendChild(c)); cur.body.appendChild(el);
    }
    return pages;
  }

  function fit() {
    const pw = 210 * 96 / 25.4;
    const w = document.documentElement.clientWidth;
    const z = Math.min(1, (w - 16) / pw);
    root.style.zoom = z < 0.999 ? z.toFixed(4) : '';
  }

  function render() {
    const withKey = document.getElementById('withKey').checked;
    const withSheet = document.getElementById('withSheet').checked;
    const withStem = document.getElementById('withStem').checked;
    root.style.zoom = '';
    root.innerHTML = '';
    const bk = flow(booklet(withStem), 'exam');
    bk.forEach((p, i) => { p.pf.textContent = `六级 · 第 ${i + 1} 页（共 ${bk.length} 页）`; });
    let total = bk.length;
    if (withSheet) cards().forEach((h, i) => { const p = newPage('sheet'); p.body.innerHTML = h; p.pf.textContent = `答题卡 ${i + 1}　·　试卷代号 ${seed}`; total++; });
    if (withKey) { const kp = flow(keyBlocks(), 'key'); kp.forEach((p, i) => { p.pf.textContent = `教师用 · 答案页 第 ${i + 1} 页（共 ${kp.length} 页）`; }); total += kp.length; }
    document.getElementById('seedLab').textContent = seed;
    document.getElementById('stat').textContent = `试题册 ${bk.length} 页${withSheet ? ' + 答题卡 2 页' : ''}${withKey ? ` + 教师用答案页 ${total - bk.length - (withSheet ? 2 : 0)} 页` : ''}，共 ${total} 张 A4。`;
    history.replaceState(null, '', '?seed=' + seed);
    document.title = `六级模拟卷 ${seed}`;
    fit();
  }

  ['withKey', 'withSheet', 'withStem'].forEach((id) => { document.getElementById(id).onchange = render; });
  // 换一套：试 300 个候选卷号，挑和当前这套重复篇目最少的（通常一篇不重）
  document.getElementById('regen').onclick = () => {
    const cur = new Set(idsOf(draw(seed))); let best = null, bestN = 1e9;
    for (let t = 0; t < 300; t++) { const c = Math.floor(Math.random() * 90000) + 10000; if (c === seed) continue; const n = idsOf(draw(c)).filter((id) => cur.has(id)).length; if (n < bestN) { best = c; bestN = n; if (!n) break; } }
    location.href = 'paper.html?seed=' + best;
  };
  document.getElementById('print').onclick = () => window.print();
  window.addEventListener('resize', fit);
  render();
  // 字体加载完成后按真实字形重新分页（Noto Serif SC 按需分片加载）
  let t = 0; const again = () => { clearTimeout(t); t = setTimeout(render, 120); };
  if (document.fonts) { document.fonts.ready.then(again); document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', again); }
})();
