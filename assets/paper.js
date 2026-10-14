/* 一键组卷：从题库随机抽题拼成完整六级模拟卷。
 * 结构照真题：Part I 写作 / Part II 听力（长对话 2 + 篇章 2 + 讲座 3）/ Part III 阅读（选词填空 1 + 段落匹配 1 + 仔细阅读 2）/ Part IV 翻译。
 * 题库不够时按已有数量抽，并在卷首注明。seed 写在 URL 里，同一卷号出同一套卷。 */
(() => {
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const K = ['A', 'B', 'C', 'D'];
  let seed = +(new URL(location.href).searchParams.get('seed')) || (Date.now() % 100000);
  const rnd = (() => { let s = seed; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; })();
  const pick = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, Math.min(n, a.length)); };

  // 抽题
  const W = pick(WRITING, 1)[0];
  // 篇章 2 篇合计 7 题、讲座 3 篇合计 10 题，照真题题量；凑不出就退回随机
  const pickSum = (arr, n, total) => { let best = null; for (let t = 0; t < 40; t++) { const c = pick(arr, n); const sum = c.reduce((a, s) => a + s.questions.length, 0); if (sum === total) return c; if (!best) best = c; } return best; };
  const conv = pick(LISTENING.filter((s) => s.type === 'conv'), 2), pas = pickSum(LISTENING.filter((s) => s.type === 'passage'), 2, 7), lec = pickSum(LISTENING.filter((s) => s.type === 'lecture'), 3, 10);
  const cloze = pick(READING.cloze, 1)[0], match = pick(READING.match, 1)[0], mc = pick(READING.mc, 2);
  const T = pick(TRANSLATION, 1)[0];
  const short = (conv.length < 2 || pas.length < 2 || lec.length < 3 || mc.length < 2) ? '（题库仍在扩充，本卷听力 / 阅读题量少于真题的 25 / 30 题）' : '';

  // 连续题号
  let n = 0; const num = () => ++n;
  const numbered = []; // {n, ans, part}
  const mcq = (qs, part) => `<ol class="q">${qs.map((q) => { const i = num(); numbered.push({ n: i, ans: K[q.a], part, exp: q.exp, letters: K }); return `<li><div class="stem n" data-n="${i}">${esc(q.q)}</div><div class="opts">${q.opts.map((o, k) => `<div>${K[k]}) ${esc(o)}</div>`).join('')}</div></li>`; }).join('')}</ol>`;
  const listenBlock = (sets, label) => sets.map((s, i) => `<h3>${label} ${i + 1}</h3><p class="dir">Questions ${n + 1} to ${n + s.questions.length} are based on the ${s.type === 'conv' ? 'conversation' : s.type === 'passage' ? 'passage' : 'recording'} you have just heard.</p>${mcq(s.questions, 'listen')}`).join('');

  const pages = [];
  // 封面 + 写作
  pages.push(`<h1>大学英语六级考试 模拟试卷</h1><div class="sub">College English Test Band Six · Mock Paper · 卷号 ${seed}${short}</div>
    <div class="info"><span>姓名：</span><span>日期：</span><span>用时：　　／130 分钟</span></div>
    <h2>Part I　Writing<small>30 minutes · 15%</small></h2>
    <p class="dir">${esc(W.prompt)}</p>
    <div class="lines"></div>`);
  // 听力
  const L1 = `<h2>Part II　Listening Comprehension<small>25 minutes · 35%</small></h2>
    <p class="dir">Directions: In this section, you will hear ${conv.length} long conversation${conv.length > 1 ? 's' : ''}, ${pas.length} passage${pas.length > 1 ? 's' : ''} and ${lec.length} recording${lec.length > 1 ? 's' : ''} of lectures or talks. Each will be played only once. After you hear a question, you must choose the best answer from the four choices marked A), B), C) and D). Then mark the corresponding letter on Answer Sheet 1 with a single line through the centre.</p>
    <p class="lect">本站无音频：由同伴朗读卷尾"听力原文"，或在主站"听读"页用语音合成播放对应篇目。</p>
    <h3>Section A</h3>${listenBlock(conv, 'Conversation')}<h3>Section B</h3>${listenBlock(pas, 'Passage')}<h3>Section C</h3>${listenBlock(lec, 'Recording')}`;
  pages.push(L1);
  // 阅读
  const clozeStart = n + 1; const clozeNums = cloze.answers.map(() => num());
  cloze.answers.forEach((a, i) => numbered.push({ n: clozeNums[i], ans: a, part: 'read', exp: cloze.exp[i], letters: cloze.bank.map((b) => b[0]) }));
  const clozeText = esc(cloze.text).replace(/\[(\d+)\]/g, (m, i) => `<span class="blank">${clozeNums[+i - 1]}</span>`);
  const R1 = `<h2>Part III　Reading Comprehension<small>40 minutes · 35%</small></h2>
    <h3>Section A</h3><p class="dir">Directions: In this section, there is a passage with ten blanks. You are required to select one word for each blank from a list of choices given in a word bank following the passage. Read the passage through carefully before making your choices. Each choice in the bank is identified by a letter. Please mark the corresponding letter for each item on Answer Sheet 2 with a single line through the centre. You may not use any of the words in the bank more than once.</p>
    <p class="dir">Questions ${clozeStart} to ${n} are based on the following passage.</p>
    <div class="passage">${clozeText.split('\n').map((p) => `<p>${p}</p>`).join('')}</div>
    <div class="bank">${cloze.bank.map((b) => `<div>${esc(b)}</div>`).join('')}</div>`;
  pages.push(R1);
  const mStart = n + 1; const mNums = match.items.map(() => num());
  match.items.forEach((it, i) => numbered.push({ n: mNums[i], ans: it.a, part: 'read', exp: '', letters: match.paras.map(([l]) => l) }));
  const R2 = `<h3>Section B</h3><p class="dir">Directions: In this section, you are going to read a passage with ten statements attached to it. Each statement contains information given in one of the paragraphs. Identify the paragraph from which the information is derived. You may choose a paragraph more than once. Each paragraph is marked with a letter. Answer the questions by marking the corresponding letter on Answer Sheet 2.</p>
    <p class="dir"><b>${esc(match.title.replace(/^[^·]+·\s*/, ''))}</b></p>
    <div class="passage">${match.paras.map(([l, p]) => `<p><span class="pl">${l}.</span>${esc(p)}</p>`).join('')}</div>
    <ol class="q">${match.items.map((it, i) => `<li><div class="stem n" data-n="${mNums[i]}" style="font-weight:400">${esc(it.s)}</div></li>`).join('')}</ol>`;
  pages.push(R2);
  const R3 = `<h3>Section C</h3><p class="dir">Directions: There are ${mc.length} passage${mc.length > 1 ? 's' : ''} in this section. Each passage is followed by some questions or unfinished statements. For each of them there are four choices marked A), B), C) and D). You should decide on the best choice and mark the corresponding letter on Answer Sheet 2 with a single line through the centre.</p>
    ${mc.map((s, i) => `<p class="dir"><b>Passage ${['One', 'Two'][i]}</b> · Questions ${n + 1} to ${n + s.questions.length} are based on the following passage.</p><div class="passage">${s.text.split('\n').map((p) => `<p>${esc(p)}</p>`).join('')}</div>${mcq(s.questions, 'read')}`).join('')}`;
  pages.push(R3);
  // 翻译
  pages.push(`<h2>Part IV　Translation<small>30 minutes · 15%</small></h2>
    <p class="dir">Directions: For this part, you are allowed 30 minutes to translate a passage from Chinese into English. You should write your answer on Answer Sheet 2.</p>
    <p class="zh">${esc(T.zh)}</p><div class="lines short"></div>`);
  // 答题卡
  const nListen = numbered.filter((x) => x.part === 'listen').length;
  const row = (x) => `<div><span class="no">${x.n}</span><span class="bub">${x.letters.map((l) => `<i>${l}</i>`).join('')}</span></div>`;
  const grp = (title, xs, wide) => xs.length ? `<h3>${title}</h3><div class="sheet${wide ? ' wide' : ''}">${xs.map(row).join('')}</div>` : '';
  const isWide = (x) => x.letters.length > 4;
  const sheet = `<h2>Answer Sheet<small>答题卡 · 客观题</small></h2><p class="dir">用 2B 铅笔涂黑。第 1–${nListen} 题为听力（答题卡 1），其余为阅读（答题卡 2）。</p>
    ${grp('Part II 听力', numbered.filter((x) => x.part === 'listen'), false)}
    ${grp('Part III Section A 选词填空 / Section B 段落匹配', numbered.filter((x) => x.part === 'read' && isWide(x)), true)}
    ${grp('Part III Section C 仔细阅读', numbered.filter((x) => x.part === 'read' && !isWide(x)), false)}`;
  // 答案与原文
  const key = `<h2>Key<small>参考答案</small></h2><div class="key">${numbered.map((x) => `<div><b>${x.n}.</b> ${x.ans}</div>`).join('')}</div>
    <h3>解析</h3>${numbered.filter((x) => x.exp).map((x) => `<p class="exp"><b>${x.n}.</b> ${esc(x.exp)}</p>`).join('')}
    <h3>写作范文</h3><div class="script">${esc(W.sample)}</div>
    <h3>翻译参考译文</h3><div class="script">${esc(T.en)}</div>
    <h2>Listening Scripts<small>听力原文</small></h2>${[...conv, ...pas, ...lec].map((s, i) => `<h3>${i + 1}. ${esc(s.title)}</h3><div class="script">${esc(s.script)}</div>`).join('')}`;

  function render() {
    const withKey = document.getElementById('withKey').checked, withSheet = document.getElementById('withSheet').checked;
    const all = [...pages, ...(withSheet ? [sheet] : []), ...(withKey ? [key] : [])];
    document.getElementById('paper').innerHTML = all.map((p, i) => `<div class="page">${p}<div class="pn">六级模拟卷 · 卷号 ${seed} · 第 ${i + 1} 页</div></div>`).join('');
    document.getElementById('seedLab').textContent = seed;
    history.replaceState(null, '', '?seed=' + seed);
    document.title = `六级模拟卷 ${seed}`;
  }
  document.getElementById('withKey').onchange = render;
  document.getElementById('withSheet').onchange = render;
  document.getElementById('regen').onclick = () => { location.href = 'paper.html?seed=' + (Math.floor(Math.random() * 90000) + 10000); };
  document.getElementById('print').onclick = () => window.print();
  render();
})();
