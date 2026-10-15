/* 一键组卷：从题库随机抽题拼成完整六级模拟卷，版式仿真题试题册。
 * 结构照真题：Part I 写作 / Part II 听力（长对话 2 + 篇章 2 + 讲座 3）/ Part III 阅读（选词填空 1 + 段落匹配 1 + 仔细阅读 2）/ Part IV 翻译。
 * 之后是答题卡 1（写作 + 听力）、答题卡 2（阅读 + 翻译），最后是教师用答案页（答案 / 解析 / 范文 / 听力原文）。
 * 题库不够时按已有数量抽，并在卷首注明。seed 写在 URL 里，同一卷号出同一套卷。
 * 分页：把内容拆成块，按 A4 实际排版高度装页（题目和选项不跨页、标题不落页尾，文章可按段跨页），屏幕和打印一致。 */
(() => {
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const K = ['A', 'B', 'C', 'D'];
  let seed = +(new URL(location.href).searchParams.get('seed')) || (Date.now() % 100000);
  // 抽题在 draw.js（与主站在线模考共用）。这个卷号以前生成过（打印 / 在线模考）就按记录还原；
  // 否则按「优先抽没做过的」勾选抽题（默认开，记在 S.drawFresh），并把题目 id 记进 S.papers
  const S0 = CET6Draw.readS();
  const freshBox = document.getElementById('fresh');
  let W, conv, pas, lec, cloze, match, mc, T, short, listenSets, ids;
  function setup(redraw) {
    const S = CET6Draw.readS();
    const p = redraw ? (() => { const d = CET6Draw.draw(seed, freshBox.checked ? { done: CET6Draw.doneSet(S) } : null); return { d, ids: CET6Draw.idsOf(d), fresh: freshBox.checked }; })() : CET6Draw.paperOf(seed, S, freshBox.checked);
    ({ W, conv, pas, lec, cloze, match, mc, T } = p.d); ids = p.ids; freshBox.checked = p.fresh;
    short = (conv.length < 2 || pas.length < 2 || lec.length < 3 || mc.length < 2) ? '题库仍在扩充，本卷听力 / 阅读题量少于真题的 25 / 30 题。' : '';
    listenSets = [...conv, ...pas, ...lec];
    CET6Draw.recordPaper(seed, 'print', ids, p.fresh);
  }
  freshBox.checked = S0.drawFresh !== false;
  setup(false);

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
  const numbered = []; // {n, ans, part, sec, exp, letters}；sec = conv / pas / lec / cloze / match / mc，用于答案页的分值换算
  const listenQs = []; // 听力：每题对应的篇目与题干（放进教师用原文）
  const mcItems = (qs, part, withStem, sec) => qs.map((q) => {
    const i = num();
    numbered.push({ n: i, ans: K[q.a], part, sec, exp: q.exp, letters: K });
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
    // Part I 写作：单独起一页，题目加框放大；图表作文附图
    B.push(blk(partHtml(1, 'Writing', 30), { keep: true, brk: true }));
    B.push(blk(`<p class="part-note">（请于开考后 30 分钟内在答题卡 1 上完成写作，之后进入听力部分）</p>`, { keep: true }));
    B.push(blk(`<div class="wbox"><p>${esc(W.prompt).replace(/^Directions:/, '<b>Directions:</b>')}</p>${W.chart && window.writingChart ? window.writingChart(W.chart) : ''}</div>`));

    // Part II 听力
    B.push(blk(partHtml(2, 'Listening Comprehension', 30), { keep: true, brk: true }));
    // 篇目做成链接：点了回主站直接打开这一套（index.html#set=<id>，由 app.js 启动时识别）
    B.push(blk(`<div class="note">录音：本站「听读」按顺序播放 ${listenSets.map((x, k) => `<a class="slink" href="index.html#set=${encodeURIComponent(x.id)}" target="_blank" rel="noopener">${k + 1}. ${esc(cleanTitle(x.title))}</a>`).join('；')}。</div>`, { keep: true }));
    const listenSec = (sets, sec, dir, label, key) => {
      if (!sets.length) return;
      B.push(blk(`<div class="sec">Section ${sec}</div>`, { keep: true }));
      B.push(blk(dirHtml(dir), { keep: true }));
      sets.forEach((s) => {
        const a = n + 1, b = n + s.questions.length;
        B.push(blk(`<p class="qb">Questions ${a} ${b > a ? `to ${b} are` : 'is'} based on the ${label} you have just heard.</p>`, { keep: true }));
        B.push(...mcItems(s.questions, 'listen', withStem, key));
      });
    };
    listenSec(conv, 'A', `In this section, you will hear ${plural(conv.length, 'long conversation')}. At the end of each conversation, you will hear ${qCountPhrase(conv)} questions. Both the conversation and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.`, 'conversation', 'conv');
    listenSec(pas, 'B', `In this section, you will hear ${plural(pas.length, 'passage')}. At the end of each passage, you will hear ${qCountPhrase(pas)} questions. Both the passage and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.`, 'passage', 'pas');
    listenSec(lec, 'C', `In this section, you will hear ${plural(lec.length, 'recording')} of lectures or talks followed by ${qCountPhrase(lec)} questions. The recordings will be played only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.`, 'recording', 'lec');

    // Part III 阅读 · Section A 选词填空
    B.push(blk(partHtml(3, 'Reading Comprehension', 40), { keep: true, brk: true }));
    const clozeNums = cloze.answers.map(() => num());
    cloze.answers.forEach((a, i) => numbered.push({ n: clozeNums[i], ans: a, part: 'read', sec: 'cloze', exp: cloze.exp[i], letters: cloze.bank.map((b) => b[0]) }));
    B.push(blk(`<div class="sec">Section A</div>`, { keep: true }));
    B.push(blk(dirHtml(`In this section, there is a passage with ${word(clozeNums.length)} blanks. You are required to select one word for each blank from a list of choices given in a word bank following the passage. Read the passage through carefully before making your choices. Each choice in the bank is identified by a letter. Please mark the corresponding letter for each item on Answer Sheet 2 with a single line through the centre. You may not use any of the words in the bank more than once.`), { keep: true }));
    B.push(blk(`<p class="qb">Questions ${clozeNums[0]} to ${clozeNums[clozeNums.length - 1]} are based on the following passage.</p>`, { keep: true }));
    const clozeText = esc(cloze.text).replace(/\[(\d+)\]/g, (m, i) => `<span class="blank">${clozeNums[+i - 1]}</span>`);
    clozeText.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="pp">${p}</p>`)));
    B.push(blk(`<div class="bank">${cloze.bank.map((b) => `<div>${esc(b)}</div>`).join('')}</div>`));

    // Section B 段落匹配
    const mNums = match.items.map(() => num());
    // 段落匹配解析：题库有 exp 就用，没有就给定位段
    match.items.forEach((it, i) => numbered.push({ n: mNums[i], ans: it.a, part: 'read', sec: 'match', exp: it.exp || `定位：${it.a} 段`, letters: match.paras.map(([l]) => l) }));
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
      B.push(...mcItems(s.questions, 'read', false, 'mc'));
    });

    // Part IV 翻译
    B.push(blk(partHtml(4, 'Translation', 30), { keep: true, brk: true })); // 翻译单独成页
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

  // 实线横格，放不下的被裁掉。写作区按每行约 10 词，在第 5/10/15/20 行旁标 50/100/150/200 词参考刻度
  const lines = (n, ticks) => `<div class="lines${ticks ? ' ticks' : ''}">${Array.from({ length: n }, (_, i) => `<div>${ticks && (i + 1) % 5 === 0 ? `<span class="tk">${(i + 1) * 10}</span>` : ''}</div>`).join('')}</div>`;
  function cards() {
    const L = numbered.filter((x) => x.part === 'listen');
    const R = numbered.filter((x) => x.part === 'read');
    const RA = R.filter((x) => x.letters.length > 4 && x.letters.length >= 13);
    const RB = R.filter((x) => x.letters.length > 4 && x.letters.length < 13);
    const RC = R.filter((x) => x.letters.length <= 4);
    const card1 = `<div class="card">${cardHead(1, 'Answer Sheet 1 · 写作与听力理解', true)}
      <div class="cardsec write"><div class="cs">Part I　Writing<small>（30 分钟，在下列横线上作答）</small></div>
        <p class="prompt">${esc(W.prompt).replace(/^Directions:/, '<b>Directions:</b>')}</p>${lines(22, true)}</div>
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
      <div class="cardsec write" style="margin-bottom:0"><div class="cs">Part IV　Translation<small>（30 分钟，将试题册上的中文段落译成英文）</small></div>${lines(30)}</div>
    </div>`;
    return [card1, card2];
  }

  // ---------- 教师用答案页 ----------
  // 710 分换算：分值占比照 data-outline「卷面结构与分值」（听力 长对话 8% / 篇章 7% / 讲座 20%，阅读 选词 5% / 匹配 10% / 仔细 20%，写作、翻译各 15%）
  // 按真题题量折成每题分值：710 × 占比 ÷ 题数；写作、翻译 15 分制档分 × 7.1（106.5 ÷ 15）
  const SEC_PTS = [
    ['conv', '听力', '长对话', 7.1], ['pas', '听力', '听力篇章', 7.1], ['lec', '听力', '讲座 / 讲话', 14.2],
    ['cloze', '阅读', '选词填空', 3.55], ['match', '阅读', '段落匹配', 7.1], ['mc', '阅读', '仔细阅读', 14.2],
  ];
  const W_BANDS = [
    ['14 分档', '13–15', '切题；思想表达清楚，文字通顺、连贯，基本无语言错误，仅有个别小错'],
    ['11 分档', '10–12', '切题；思想表达清楚，文字较连贯，但有少量语言错误'],
    ['8 分档', '7–9', '基本切题；有些地方表达不够清楚，文字勉强连贯；语言错误相当多，其中有一些严重错误'],
    ['5 分档', '4–6', '基本切题；表达思想不清楚，连贯性差；有较多严重语言错误'],
    ['2 分档', '1–3', '条理不清，思路紊乱；语言支离破碎，或大部分句子有错且多为严重错误'],
  ];
  const fmtPt = (v) => String(+v.toFixed(2));
  function scoreTable() {
    let full = 0;
    const rows = SEC_PTS.map(([k, part, name, pt]) => { const c = numbered.filter((x) => x.sec === k).length; if (!c) return ''; full += c * pt; return `<tr><td>${part}</td><td>${name}</td><td>${c}</td><td>${fmtPt(pt)}</td><td>${fmtPt(c * pt)}</td><td class="blankc">对 ____ 题</td><td class="blankc"></td></tr>`; }).join('');
    full += 106.5 * 2;
    return `<table class="score"><tr><th>部分</th><th>题型</th><th>题数</th><th>每题分值</th><th>满分</th><th>自评</th><th>得分</th></tr>${rows}
      <tr><td>写作</td><td>短文写作</td><td>1</td><td>档分 × 7.1</td><td>106.5</td><td class="blankc">____ / 15</td><td class="blankc"></td></tr>
      <tr><td>翻译</td><td>汉译英</td><td>1</td><td>档分 × 7.1</td><td>106.5</td><td class="blankc">____ / 15</td><td class="blankc"></td></tr>
      <tr class="tot"><td colspan="4">合计</td><td>${fmtPt(full)}</td><td></td><td class="blankc"></td></tr></table>
      <p class="exp" style="padding-left:0;text-indent:0">算法：自评总分 ≈ 7.1 ×（长对话 + 篇章 + 段落匹配 答对题数）+ 14.2 ×（讲座 + 仔细阅读 答对题数）+ 3.55 × 选词填空答对题数 + 7.1 ×（写作档分 + 翻译档分）。听力、阅读各满分 248.5，写作、翻译各 106.5。正式成绩是常模参照、等值换算后的报道分，这里只是估算；425 是多数单位的认可线，本站目标 500。${full < 709.9 ? '本卷题量少于真题，满分按实际题数计。' : ''}</p>`;
  }
  function keyBlocks() {
    const B = [];
    B.push(blk(`<div class="kband"><b>教师用 · 答案页</b><div>参考答案 / 解析 / 写作范文 / 翻译参考译文 / 听力原文。打印考试用卷时可在工具条取消勾选「附答案与听力原文」，或只打印前面的试题册和答题卡页码。</div></div>`, { keep: true }));
    B.push(blk(`<div class="kh">一、参考答案</div>`, { keep: true }));
    const tab = (xs) => `<div class="ktab">${xs.map((x) => `<div><b>${x.n}.</b>${esc(x.ans)}</div>`).join('')}</div>`;
    const L = numbered.filter((x) => x.part === 'listen'), R = numbered.filter((x) => x.part === 'read');
    if (L.length) { B.push(blk(`<div class="kh3">Part II　Listening Comprehension（${L[0].n}–${L[L.length - 1].n}）</div>`, { keep: true })); B.push(blk(tab(L))); }
    if (R.length) { B.push(blk(`<div class="kh3">Part III　Reading Comprehension（${R[0].n}–${R[R.length - 1].n}）</div>`, { keep: true })); B.push(blk(tab(R))); }
    B.push(blk(`<div class="kh">二、710 分换算（自评总分）</div>`, { keep: true }));
    B.push(blk(scoreTable()));
    const ex = numbered.filter((x) => x.exp);
    if (ex.length) {
      B.push(blk(`<div class="kh">三、答案解析</div>`, { keep: true }));
      ex.forEach((x) => B.push(blk(`<p class="exp"><b>${x.n}. ${esc(x.ans)}</b>　${esc(x.exp)}</p>`)));
    }
    B.push(blk(`<div class="kh">四、写作：提纲 / 范文 / 评分档次</div>`, { keep: true }));
    B.push(blk(`<p class="kh3" style="font-weight:400">${esc(cleanTitle(W.title))}</p>`, { keep: true }));
    if (W.outline && W.outline.length) { B.push(blk(`<div class="kh3">提纲</div>`, { keep: true })); B.push(blk(`<ol class="kol">${W.outline.map((o) => `<li>${esc(o)}</li>`).join('')}</ol>`)); }
    B.push(blk(`<div class="kh3">范文</div>`, { keep: true }));
    W.sample.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="ref">${esc(p)}</p>`)));
    B.push(blk(`<div class="kh3">评分档次（15 分制，按总体印象给分；得分 × 7.1 折成 710 分制）</div>`, { keep: true }));
    B.push(blk(`<table class="rub"><tr><th>档</th><th>分</th><th>特征</th></tr>${W_BANDS.map(([b, r, t]) => `<tr><td>${b}</td><td>${r}</td><td>${esc(t)}</td></tr>`).join('')}</table><p class="exp" style="padding-left:0;text-indent:0">先定档，再按语言质量在档内加减 1 分；少于 120 词酌情扣分；白卷、只写与题目无关内容或只抄题目得 0 分。</p>`));
    B.push(blk(`<div class="kh">五、翻译：参考译文 / 关键词</div>`, { keep: true }));
    T.en.split('\n').filter((p) => p.trim()).forEach((p) => B.push(blk(`<p class="ref">${esc(p)}</p>`)));
    if (T.keys && T.keys.length) {
      B.push(blk(`<div class="kh3">关键词</div>`, { keep: true }));
      B.push(blk(`<div class="kkeys">${T.keys.map((k) => { const m = k.match(/^(.*?)\s+([A-Za-z(].*)$/); return m ? `<div><span class="zh">${esc(m[1])}</span>${esc(m[2])}</div>` : `<div>${esc(k)}</div>`; }).join('')}</div>`));
    }
    B.push(blk(`<p class="exp" style="padding-left:0;text-indent:0;margin-top:1.5mm">翻译同样按 15 分制定档：13–15 准确流畅、基本无错；10–12 基本达意、无重大错误；7–9 勉强达意、错误较多；4–6 仅译出小部分意思。</p>`));
    B.push(blk(`<div class="kh">六、听力原文（Listening Scripts）</div>`, { keep: true }));
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

  // 手机（≤719px）上不整体缩放：CSS 把 A4 页改成按屏宽流式排版；分页仍按 A4 计算（排版时临时加 .measuring 强制 A4），打印照旧精确分页
  const narrow = () => matchMedia('screen and (max-width: 719px)').matches;
  function fit() {
    const pw = 210 * 96 / 25.4;
    const w = document.documentElement.clientWidth;
    if (narrow()) { root.style.zoom = ''; return; }
    const z = Math.min(1, (w - 16) / pw);
    root.style.zoom = z < 0.999 ? z.toFixed(4) : '';
  }

  function render() {
    const withKey = document.getElementById('withKey').checked;
    const withSheet = document.getElementById('withSheet').checked;
    const withStem = document.getElementById('withStem').checked;
    root.style.zoom = '';
    root.innerHTML = '';
    root.classList.add('measuring');
    const bk = flow(booklet(withStem), 'exam');
    bk.forEach((p, i) => { p.pf.textContent = `六级 · 第 ${i + 1} 页（共 ${bk.length} 页）`; });
    let total = bk.length;
    if (withSheet) cards().forEach((h, i) => { const p = newPage('sheet'); p.body.innerHTML = h; p.pf.textContent = `答题卡 ${i + 1}　·　试卷代号 ${seed}`; total++; });
    if (withKey) { const kp = flow(keyBlocks(), 'key'); kp.forEach((p, i) => { p.pf.textContent = `教师用 · 答案页 第 ${i + 1} 页（共 ${kp.length} 页）`; }); total += kp.length; }
    root.classList.remove('measuring');
    document.getElementById('seedLab').textContent = seed;
    document.getElementById('online').href = 'index.html#exam=' + seed;
    document.getElementById('stat').textContent = `试题册 ${bk.length} 页${withSheet ? ' + 答题卡 2 页' : ''}${withKey ? ` + 教师用答案页 ${total - bk.length - (withSheet ? 2 : 0)} 页` : ''}，共 ${total} 张 A4。`;
    history.replaceState(null, '', '?seed=' + seed);
    document.title = `六级模拟卷 ${seed}`;
    fit();
  }

  ['withKey', 'withSheet', 'withStem'].forEach((id) => { document.getElementById(id).onchange = render; });
  // 切换「优先抽没做过的」：记住选项，并按新选项重抽这个卷号
  freshBox.onchange = () => { const S = CET6Draw.readS(); S.drawFresh = freshBox.checked; try { localStorage.setItem('cet6.v1', JSON.stringify(S)); } catch {} setup(true); render(); };
  // 换一套：试 300 个候选卷号，挑和当前这套重复篇目最少的（通常一篇不重）
  document.getElementById('regen').onclick = () => {
    location.href = 'paper.html?seed=' + CET6Draw.pickSeed(ids, CET6Draw.readS(), freshBox.checked, seed);
  };
  document.getElementById('print').onclick = () => window.print();
  window.addEventListener('resize', fit);
  render();
  // 字体加载完成后按真实字形重新分页（Noto Serif SC 按需分片加载）
  let t = 0; const again = () => { clearTimeout(t); t = setTimeout(render, 120); };
  if (document.fonts) { document.fonts.ready.then(again); document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', again); }
})();
