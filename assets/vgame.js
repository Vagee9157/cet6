/* 单词小游戏：配对消消乐 / 快问快答 / 拼写挑战（window.CET6Game）
   通过 window.CET6（app.js 末尾暴露）拿单词数据和工具函数；状态：S.vgame（开关与偏好）、S.vgameLog（最近 50 局） */
(() => {
  'use strict';
  const C = () => window.CET6;
  const $ = (s, el = document) => el.querySelector(s);
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAMES = {
    match: { n: '配对消消乐', d: '英文卡和中文卡配成一对，越快越准星越多', ico: 'i-vg-grid' },
    quiz: { n: '快问快答', d: '8 秒内选出中文意思，连击翻倍得分', ico: 'i-vg-bolt' },
    spell: { n: '拼写挑战', d: '看释义和例句，拼出这个单词', ico: 'i-vg-key' }
  };
  const SRCS = [['daily', '今日单词'], ['wrong', '生词本'], ['topic', '某个主题'], ['rand', '随机 20 个']];
  const QUIZ_MS = 8000;
  // 选项长（如易混词「值得尊敬的 / 恭敬的」）多给 4 秒阅读时间；得分仍按 8 秒算
  const qms = (q) => q && q.opts && q.opts.some((o) => String(o.c).length > 9) ? QUIZ_MS + 4000 : QUIZ_MS;

  // 图标：追加到页面已有的 SVG sprite（不改 index.html 的图标区）
  const sprite = document.querySelector('body > svg');
  if (sprite && !document.getElementById('i-vg-grid')) sprite.insertAdjacentHTML('beforeend',
    '<symbol id="i-vg-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></symbol>' +
    '<symbol id="i-vg-bolt" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></symbol>' +
    '<symbol id="i-vg-key" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></symbol>' +
    '<symbol id="i-vg-star" viewBox="0 0 24 24"><path d="m12 2.5 2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></symbol>');

  let box = null, G = null, quizTimer = 0, barTick = 0, matchTick = 0, advTimer = 0, popId = null;

  const cfg = () => { const S = C().S; S.vgame = Object.assign({ on: false, src: 'daily', g: 0, speak: true }, S.vgame || {}); S.vgameLog = S.vgameLog || []; return S.vgame; };
  const mult = (combo) => (combo >= 6 ? 3 : combo >= 3 ? 2 : 1);
  const visible = () => box && box.isConnected && !box.closest('.view').hidden;
  const firstPart = (t) => t.split(/\s*\/\s*/)[0].trim();
  const posKey = (p) => (p || '').split(/[\/,\s]/)[0];
  const norm = (t) => String(t).toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const stars = (n) => `<span class="vg-stars" aria-label="${n} 星">${[0, 1, 2].map((i) => `<svg class="i${i < n ? ' on' : ''}" style="--d:${i * 0.18}s"><use href="#i-vg-star"/></svg>`).join('')}</span>`;
  const sayAuto = (t) => { if (cfg().speak && 'speechSynthesis' in window) try { C().speak(t, 0.9); } catch {} };
  const sayBtn = (t, lab) => `<button class="vg-spk" data-say="${C().esc(t)}" aria-label="${lab || '朗读'}">${C().ic('i-vol')}</button>`;

  /* ---------- 词源 ---------- */
  function poolOf(src, g) {
    const { ALLWORDS, VOCAB, dailyPlan, isWrong, wordOf, shuffle } = C();
    if (src === 'daily') return dailyPlan().order.map(wordOf).filter(Boolean);
    if (src === 'wrong') return ALLWORDS.filter((w) => isWrong(w.id));
    if (src === 'topic') return VOCAB[g] ? VOCAB[g].words.map((x, wi) => wordOf(g + ':' + wi)).filter(Boolean) : [];
    return shuffle(ALLWORDS).slice(0, 20);
  }
  // 干扰项：先同主题同词性，再同词性，最后随便；中文释义不能重复
  // 释义拆成义项（按 ，、；/ 分），两个词有任一义项相同就算近义，不能同时出现
  const senses = (c) => String(c).split(/[，、；;,/（）()]+/).map((x) => x.replace(/[的地得了]$/, '').trim()).filter((x) => x.length >= 2);
  const overlap = (a, b) => { const A = senses(a); return senses(b).some((x) => A.some((y) => y === x || (x.length >= 2 && (y.includes(x) || x.includes(y))))); };
  function distractors(w, n) {
    const { ALLWORDS, shuffle } = C(), pk = posKey(w.p), seen = new Set([w.c]), out = [];
    const tiers = [(x) => x.g === w.g && posKey(x.p) === pk, (x) => posKey(x.p) === pk, (x) => x.g === w.g, () => true];
    for (const t of tiers) {
      for (const x of shuffle(ALLWORDS.filter((x) => x.id !== w.id && t(x)))) { if (out.length >= n) break; if (!seen.has(x.c) && !overlap(x.c, w.c) && !out.some((o) => overlap(o.c, x.c))) { seen.add(x.c); out.push(x); } }
      if (out.length >= n) break;
    }
    return out;
  }
  // 例句挖空：用 app.js 的 hlWord 找到目标词（含变形），把高亮处换成 ____
  function blankEx(w, target) {
    const { exOf, hlWord, esc } = C();
    const others = /\s\/\s/.test(w.w) ? w.w.split(/\s\/\s/).slice(1).map((x) => x.trim().toLowerCase()) : [];
    const B = '<span class="vg-blank">____</span>';
    for (const [en, zh] of exOf(w)) {
      // 易混词组：例句里出现了另一个词就会泄露答案，跳过
      if (others.some((o) => new RegExp('\\b' + o.slice(0, Math.max(4, o.length - 2)), 'i').test(en))) continue;
      const e = esc(en), t = target.replace(/^be /, '');
      // 短语：原句里能整段找到就整段挖掉
      if (/\s/.test(t)) { const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'i'); if (re.test(e)) return { html: e.replace(re, B), zh, en }; }
      const h = hlWord(e, target);
      if (h.includes('<em>')) { const html = h.replace(/<em>[\s\S]*?<\/em>/g, B); if (/\s/.test(t) && t.split(/\s+/).some((x) => x.length > 3 && new RegExp('\\b' + x + '\\b', 'i').test(html.replace(/<[^>]+>/g, '')))) continue; return { html, zh, en }; }
    }
    return null;
  }

  /* ---------- 开局 ---------- */
  function start(kind) {
    const v = cfg(), { shuffle } = C();
    let pool = shuffle(poolOf(v.src, v.g));
    stopTimers();
    if (kind === 'match') {
      const words = [], cs = new Set();
      for (const w of pool) { if (words.length >= 12) break; if (!cs.has(w.c) && !words.some((o) => overlap(o.c, w.c))) { cs.add(w.c); words.push(w); } }
      const per = innerWidth < 700 ? 6 : 12, nb = Math.ceil(words.length / per), size = Math.ceil(words.length / nb);
      const boards = []; for (let i = 0; i < words.length; i += size) boards.push(words.slice(i, i + size));
      G = { kind, words, boards, bi: 0, sec: 0, moves: 0, miss: 0, combo: 0, maxCombo: 0, score: 0, wrong: new Set(), right: new Set(), sel: null };
      dealBoard();
    } else if (kind === 'quiz') {
      const words = pool.slice(0, 10);
      G = { kind, words, qi: 0, score: 0, combo: 0, maxCombo: 0, wrong: new Set(), right: new Set(),
        qs: words.map((w) => { const opts = shuffle([w, ...distractors(w, 3)]); return { w, opts, a: opts.indexOf(w) }; }) };
    } else {
      // 拼写：单词优先，不够再补短语；易混词组只考第一个
      const single = pool.filter((w) => !/\s/.test(firstPart(w.w))), multi = pool.filter((w) => /\s/.test(firstPart(w.w)));
      const words = [...single, ...multi].slice(0, 10);
      G = { kind, words, qi: 0, score: 0, combo: 0, maxCombo: 0, wrong: new Set(), right: new Set(),
        qs: words.map((w) => { const ans = firstPart(w.w), cn = /\s\/\s/.test(w.w) ? firstPart(w.c) : w.c; return { w, ans, cn, pos: /\s\/\s/.test(w.w) ? String(w.p).split(/\s*\/\s*/)[0] : w.p, ex: blankEx(w, ans), shown: 0, tries: 0 }; }) };
    }
    G.phase = 'play'; G.src = v.src; G.t0 = Date.now(); G.done = false;
    render(box);
  }
  function dealBoard() {
    const { shuffle } = C(), ws = G.boards[G.bi];
    G.cards = shuffle([...ws.map((w) => ({ k: 'en', id: w.id, t: w.w })), ...ws.map((w) => ({ k: 'zh', id: w.id, t: w.c }))]);
    G.gone = new Set(); G.sel = null; G.deal = true;
  }

  /* ---------- 结束 / 记录 ---------- */
  function finish() {
    stopTimers();
    const S = C().S, n = G.words.length;
    let acc, st;
    if (G.kind === 'match') {
      acc = G.moves ? Math.round(G.words.length / G.moves * 100) : 0;
      G.score += Math.max(0, Math.round(n * 6 - G.sec));
      st = acc >= 90 && G.sec <= n * 6 ? 3 : acc >= 70 ? 2 : 1;
    } else {
      acc = n ? Math.round(G.right.size / n * 100) : 0;
      st = acc >= 90 ? 3 : acc >= 70 ? 2 : acc >= 40 ? 1 : 0;
    }
    G.acc = acc; G.stars = st; G.phase = 'result'; G.newBest = false;
    const prev = S.vgameLog.filter((r) => r.g === G.kind).reduce((m, r) => Math.max(m, r.score), 0);
    G.newBest = S.vgameLog.some((r) => r.g === G.kind) && G.score > prev;
    S.vgameLog.unshift({ d: C().lday(), t: Date.now(), g: G.kind, src: G.src, n, score: G.score, acc, combo: G.maxCombo, sec: G.kind === 'match' ? G.sec : Math.round((Date.now() - G.t0) / 1000) });
    S.vgameLog = S.vgameLog.slice(0, 50); C().save();
    refresh();
  }
  function markWord(id, ok) {
    if (ok) { if (G.wrong.has(id) || G.right.has(id)) return; G.right.add(id); C().gameMark(id, true); }
    else { G.right.delete(id); if (G.wrong.has(id)) return; G.wrong.add(id); C().gameMark(id, false); }
  }
  function hit(ok) {
    if (ok) { G.combo++; G.maxCombo = Math.max(G.maxCombo, G.combo); } else G.combo = 0;
    return mult(G.combo);
  }
  // 整个单词页重绘（顶部「认识 / 生词」和「生词本 N」跟着更新），游戏区按当前状态画
  function refresh() { if (C().renderVocab && visible()) C().renderVocab(); else render(box); }
  function stopTimers() { clearTimeout(quizTimer); clearInterval(barTick); clearInterval(matchTick); clearTimeout(advTimer); quizTimer = matchTick = advTimer = 0; }

  /* ---------- 渲染 ---------- */
  function render(el) {
    box = el; if (!box) return;
    const v = cfg(), vb = box.closest('#vocab-box');
    if (vb) vb.classList.toggle('vg-playing', !!(G && G.phase === 'play' && !G.paused));
    if (!G || G.phase === 'menu' || G.paused) return renderMenu(v);
    if (G.phase === 'result') return renderResult();
    if (G.kind === 'match') return renderMatch();
    if (G.kind === 'quiz') return renderQuiz();
    return renderSpell();
  }
  function renderMenu(v) {
    const { esc, ic, VOCAB, S, isWrong, ALLWORDS, dailyPlan } = C();
    const cnt = { daily: dailyPlan().order.length, wrong: ALLWORDS.filter((w) => isWrong(w.id)).length, topic: VOCAB[v.g] ? VOCAB[v.g].words.length : 0, rand: 20 };
    const n = cnt[v.src] || 0, low = n < 4;
    const best = (k) => S.vgameLog.filter((r) => r.g === k).reduce((m, r) => Math.max(m, r.score), 0);
    const plays = (k) => S.vgameLog.filter((r) => r.g === k).length;
    const paused = G && G.paused && G.phase === 'play';
    const log = S.vgameLog.slice(0, 6);
    box.innerHTML = `<div class="vg m-vocab">
      ${paused ? `<div class="vg-resume card"><div><b>继续上一局</b><span>${GAMES[G.kind].n} · ${G.kind === 'match' ? `已配 ${G.right.size + G.wrong.size}/${G.words.length}` : `第 ${G.qi + 1}/${G.qs.length} 题`}</span></div><button class="btn primary" data-vg-resume>${ic('i-play')}继续</button><button class="btn ghost" data-vg-drop>放弃</button></div>` : ''}
      <div class="vg-src card">
        <div class="vg-lab">词从哪来</div>
        <div class="vg-chips">${SRCS.map(([k, t]) => `<button class="chip" data-vg-src="${k}" aria-pressed="${v.src === k}">${t}${k === 'daily' || k === 'wrong' ? ` <small>${cnt[k]}</small>` : ''}</button>`).join('')}</div>
        ${v.src === 'topic' ? `<label class="vg-sel"><span>主题</span><select data-vg-topic>${VOCAB.map((g, i) => `<option value="${i}"${i === v.g ? ' selected' : ''}>${esc(g.g)}（${g.words.length}）</option>`).join('')}</select></label>` : ''}
        <p class="vg-note">${low ? `${v.src === 'wrong' ? '生词本' : '这里'}只有 ${n} 个词，至少要 4 个才能开局，换个词源吧。` : `每局抽 10–12 个词。答错的词自动进生词本（标「不认识」），生词答对升为「模糊」。`}</p>
      </div>
      <div class="vg-games">${Object.entries(GAMES).map(([k, g]) => `<button class="vg-game" data-vg-start="${k}" ${low ? 'disabled' : ''}>
        <span class="gi">${ic(g.ico)}</span><span class="gt"><b>${g.n}</b><span>${g.d}</span><small>${plays(k) ? `最高 ${best(k)} 分 · 玩过 ${plays(k)} 局` : '还没玩过'}</small></span>${ic('i-chev-r')}</button>`).join('')}</div>
      <label class="vg-tog"><input type="checkbox" data-vg-speak ${v.speak ? 'checked' : ''}><span>出题时自动朗读单词</span></label>
      ${log.length ? `<div class="vg-log"><div class="vg-lab">最近战绩</div>${log.map((r) => `<div class="vg-lr"><span class="g">${GAMES[r.g] ? GAMES[r.g].n : r.g}</span><span class="d">${esc(r.d.slice(5))}</span><b>${r.score} 分</b><span class="a">${r.acc}%</span></div>`).join('')}</div>` : ''}
    </div>`;
  }
  function head(prog, extra) {
    const { ic } = C();
    return `<div class="vg-head"><button class="vg-x" data-vg-quit aria-label="退出这局">${ic('i-x')}</button><div class="vg-prog"><b>${GAMES[G.kind].n}</b><span>${prog}</span></div>${extra}<div class="vg-score"><small>得分</small><b id="vgScore">${G.score}</b></div></div>
      <div class="vg-combo-slot" aria-live="polite"><span class="vg-cb${G.combo >= 2 ? ' on' : ''}" id="vgCombo">${G.combo >= 2 ? `${G.combo} 连击${mult(G.combo) > 1 ? ` · ×${mult(G.combo)}` : ''}` : ''}</span></div>`;
  }
  function popCombo(anchor, text) {
    const cb = $('#vgCombo', box);
    if (cb) { cb.textContent = G.combo >= 2 ? `${G.combo} 连击${mult(G.combo) > 1 ? ` · ×${mult(G.combo)}` : ''}` : ''; cb.classList.toggle('on', G.combo >= 2); cb.classList.remove('bump'); void cb.offsetWidth; if (G.combo >= 2) cb.classList.add('bump'); }
    const sc = $('#vgScore', box); if (sc) sc.textContent = G.score;
    if (!anchor || !text || RM()) return;
    const p = document.createElement('span'); p.className = 'vg-float'; p.textContent = text; anchor.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }

  /* --- 配对消消乐 --- */
  function renderMatch() {
    const { esc } = C(), left = G.boards[G.bi].length - G.gone.size / 2;
    const prog = `${G.boards.length > 1 ? `第 ${G.bi + 1}/${G.boards.length} 盘 · ` : ''}剩 <i id="vgLeft">${left}</i> 对`;
    box.innerHTML = `<div class="vg vg-play m-vocab">${head(prog, `<div class="vg-stat"><span>${C().ic('i-timer')}<i id="vgTime">${mmss(G.sec)}</i></span><span>步数 <i id="vgMoves">${G.moves}</i></span></div>`)}
      <div class="vg-grid${G.deal ? ' deal' : ''}">${G.cards.map((c, i) => `<button class="mc ${c.k}${G.gone.has(i) ? ' gone' : ''}${G.sel === i ? ' sel' : ''}" data-mc="${i}" style="--i:${i}"><span>${esc(c.t)}</span></button>`).join('')}</div>
      <p class="vg-tip">点一张英文、再点它的中文意思；配错的卡会抖一下。</p></div>`;
    G.deal = false;
    clearInterval(matchTick);
    matchTick = setInterval(() => { if (!visible() || document.hidden || !G || G.phase !== 'play') return; G.sec++; const t = $('#vgTime', box); if (t) t.textContent = mmss(G.sec); }, 1000);
  }
  function clickCard(i) {
    if (G.gone.has(i) || G.lock) return;
    const el = (k) => $(`[data-mc="${k}"]`, box);
    if (G.sel === null || G.sel === i) { if (G.sel === i) { G.sel = null; el(i).classList.remove('sel'); } else { G.sel = i; el(i).classList.add('sel'); } return; }
    const a = G.cards[G.sel], b = G.cards[i];
    if (a.k === b.k) { el(G.sel).classList.remove('sel'); G.sel = i; el(i).classList.add('sel'); return; }
    const ai = G.sel; G.sel = null; G.moves++; $('#vgMoves', box).textContent = G.moves;
    const ea = el(ai), eb = el(i);
    if (a.id === b.id) {
      const m = hit(true), pts = 10 * m; G.score += pts; G.gone.add(ai); G.gone.add(i);
      markWord(a.id, !G.wrong.has(a.id) && !(G.miss1 && G.miss1[a.id]));
      [ea, eb].forEach((e) => { e.classList.remove('sel'); e.classList.add('ok'); });
      setTimeout(() => [ea, eb].forEach((e) => e.classList.add('gone')), RM() ? 120 : 520);
      popCombo(eb, `+${pts}`);
      $('#vgLeft', box).textContent = G.boards[G.bi].length - G.gone.size / 2;
      if (G.gone.size === G.cards.length) {
        G.lock = true;
        advTimer = setTimeout(() => { G.lock = false; if (G.bi + 1 < G.boards.length) { G.bi++; dealBoard(); renderMatch(); } else finish(); }, RM() ? 250 : 700);
      }
    } else {
      hit(false); G.miss++; G.score = Math.max(0, G.score - 2);
      G.miss1 = G.miss1 || {}; if (G.miss1[a.id]) markWord(a.id, false); else G.miss1[a.id] = 1; // 同一个词第二次配错才记「不认识」，手滑一次不算
      [ea, eb].forEach((e) => { e.classList.remove('sel', 'bad'); void e.offsetWidth; e.classList.add('bad'); });
      setTimeout(() => [ea, eb].forEach((e) => e.classList.remove('bad')), 450);
      popCombo(null);
    }
  }

  /* --- 快问快答 --- */
  function renderQuiz() {
    const { esc, ic } = C(), q = G.qs[G.qi];
    G.answered = false;
    box.innerHTML = `<div class="vg vg-play m-vocab">${head(`第 ${G.qi + 1}/${G.qs.length} 题`, '')}
      <div class="vg-timer"><i id="vgBar"></i></div>
      <div class="vg-q card"><div class="qw">${esc(q.w.w)}</div><div class="qp"><span class="pos">${esc(q.w.p)}</span>${sayBtn(q.w.w)}</div></div>
      <div class="vg-opts">${q.opts.map((o, i) => `<button class="vg-opt" data-vo="${i}"><span class="k">${i + 1}</span><span class="t">${esc(o.c)}</span></button>`).join('')}</div>
      <div id="vgFb"></div>
      <label class="vg-tog sm"><input type="checkbox" data-vg-speak ${cfg().speak ? 'checked' : ''}><span>自动朗读</span></label></div>`;
    sayAuto(q.w.w);
    const bar = $('#vgBar', box); bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; void bar.offsetWidth;
    G.qt0 = Date.now(); clearTimeout(quizTimer); clearInterval(barTick);
    // 减少动效时不用过渡，改成每 0.25 秒跳一格（全局 reduced-motion 规则会关掉 transition）
    if (RM()) barTick = setInterval(() => { if (!bar.isConnected || G.answered) return clearInterval(barTick); bar.style.transform = `scaleX(${Math.max(0, 1 - (Date.now() - G.qt0) / qms(q))})`; }, 250);
    else { bar.style.transition = `transform ${qms(q)}ms linear`; bar.style.transform = 'scaleX(0)'; }
    quizTimer = setTimeout(() => { if (G && G.kind === 'quiz' && !G.answered && visible() && !document.hidden) answerQuiz(-1); }, qms(q));
  }
  function answerQuiz(i) {
    if (G.answered) return; G.answered = true; clearTimeout(quizTimer); clearInterval(barTick);
    const { esc, ic, exOf, hlWord } = C(), q = G.qs[G.qi], ok = i === q.a;
    const bar = $('#vgBar', box); if (bar) { const r = bar.getBoundingClientRect().width / bar.parentNode.getBoundingClientRect().width; bar.style.transition = 'none'; bar.style.transform = `scaleX(${r})`; }
    const btns = box.querySelectorAll('[data-vo]'); btns.forEach((b) => (b.disabled = true));
    btns[q.a].classList.add('right'); if (!ok && i >= 0) btns[i].classList.add('wrong');
    markWord(q.w.id, ok);
    if (ok) {
      const left = Math.max(0, Math.ceil((8000 - Math.max(0, Date.now() - G.qt0 - (qms(q) - 8000))) / 1000)), m = hit(true), pts = (10 + left) * m;
      G.score += pts; popCombo(btns[q.a], `+${pts}`);
      const [en0, zh0] = exOf(q.w)[0] || [];
      if (en0) $('#vgFb', box).innerHTML = `<div class="vg-fb ok card"><div class="fx"><div><div class="en">${hlWord(esc(en0), q.w.w)}</div>${zh0 ? `<div class="zh">${esc(zh0)}</div>` : ''}</div></div></div>`;
      advTimer = setTimeout(nextQ, RM() ? 900 : 1800);
    } else {
      hit(false); popCombo(null);
      const [en, zh] = exOf(q.w)[0];
      $('#vgFb', box).innerHTML = `<div class="vg-fb card"><div class="fh">${i < 0 ? '时间到' : '选错了'} · 正确答案：<b>${esc(q.w.w)}</b> ${esc(q.w.c)}</div>${i >= 0 ? `<div class="fo">你选的「${esc(q.opts[i].c)}」是 <b>${esc(q.opts[i].w)}</b></div>` : ''}
        <div class="fx">${sayBtn(en, '朗读例句')}<div><div class="en">${hlWord(esc(en), q.w.w)}</div>${zh ? `<div class="zh">${esc(zh)}</div>` : ''}</div></div>
        <button class="btn primary vg-next" data-vg-next>下一题 ${ic('i-chev-r')}</button></div>`;
      const fb = $('.vg-fb', box); if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: RM() ? 'auto' : 'smooth' });
      const nb = $('[data-vg-next]', box); if (nb && matchMedia('(pointer:fine)').matches) nb.focus({ preventScroll: true });
    }
  }
  function nextQ() {
    clearTimeout(advTimer); advTimer = 0;
    if (!G || G.phase !== 'play') return;
    G.qi++; if (G.qi >= G.qs.length) return finish();
    G.kind === 'quiz' ? renderQuiz() : renderSpell();
  }

  /* --- 拼写挑战 --- */
  function slots(q) {
    return [...q.ans].map((ch, i) => (ch === ' ' ? '<i class="sp"></i>' : `<i class="${i < q.shown ? 'on' : ''}">${i < q.shown ? C().esc(ch) : ''}</i>`)).join('');
  }
  function renderSpell() {
    const { esc, ic } = C(), q = G.qs[G.qi];
    G.answered = false;
    box.innerHTML = `<div class="vg vg-play m-vocab">${head(`第 ${G.qi + 1}/${G.qs.length} 题`, '')}
      <div class="vg-sp card"><div class="cn"><span class="pos">${esc(q.pos || q.w.p)}</span>${esc(q.cn)}</div>
        ${q.ex ? `<div class="ex">${q.ex.html}</div>${q.ex.zh ? `<div class="zh">${esc(q.ex.zh)}</div>` : ''}` : ''}
        <div class="vg-slots" id="vgSlots" aria-label="${q.ans.length} 个字母">${slots(q)}</div></div>
      <form class="vg-in" id="vgForm" autocomplete="off"><input id="vgInput" type="text" inputmode="text" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="输入单词，回车提交" aria-label="输入单词"><button class="btn primary" type="submit">提交</button></form>
      <div class="vg-acts">${sayBtn(q.ans, '听发音')}<button class="btn soft" data-vg-hint>${ic('i-bulb')}提示一个字母 <small>−3</small></button><button class="btn ghost" data-vg-give>不会，看答案</button></div>
      <div id="vgFb"></div></div>`;
    const inp = $('#vgInput', box); setTimeout(() => { if (visible() && document.activeElement !== inp) inp.focus({ preventScroll: true }); }, 30);
  }
  function submitSpell() {
    if (G.answered) return;
    const q = G.qs[G.qi], inp = $('#vgInput', box), val = norm(inp.value);
    if (!val) { inp.focus(); return; }
    const ans = norm(q.ans), ok = val === ans || val === ans.replace(/^be /, '') || ('be ' + val) === ans;
    if (ok) {
      G.answered = true; inp.disabled = true; inp.classList.add('right');
      const m = hit(true), base = Math.max(2, 10 - 3 * q.shown), pts = Math.round(base * (q.tries ? 0.5 : 1)) * m;
      G.score += pts; if (!q.tries) markWord(q.w.id, true); popCombo($('#vgForm', box), `+${pts}`);
      q.shown = q.ans.length; $('#vgSlots', box).innerHTML = slots(q); $('#vgSlots', box).classList.add('ok');
      sayAuto(q.ans);
      advTimer = setTimeout(nextQ, RM() ? 600 : 1000);
    } else if (!q.tries) {
      q.tries = 1; hit(false); popCombo(null);
      inp.classList.remove('bad'); void inp.offsetWidth; inp.classList.add('bad');
      $('#vgFb', box).innerHTML = `<p class="vg-retry">不对，再试一次（第二次答对得一半分）</p>`;
      inp.select();
    } else reveal();
  }
  function reveal() {
    const { esc, ic } = C(), q = G.qs[G.qi];
    G.answered = true; hit(false); popCombo(null); markWord(q.w.id, false);
    const inp = $('#vgInput', box); inp.disabled = true; inp.classList.add('wrong');
    q.shown = q.ans.length; $('#vgSlots', box).innerHTML = slots(q); $('#vgSlots', box).classList.add('no');
    $('#vgFb', box).innerHTML = `<div class="vg-fb card"><div class="fh">正确答案：<b>${esc(q.ans)}</b>${sayBtn(q.ans)}</div>
      ${q.ex ? `<div class="fx"><div><div class="en">${C().hlWord(esc(q.ex.en), q.ans)}</div>${q.ex.zh ? `<div class="zh">${esc(q.ex.zh)}</div>` : ''}</div></div>` : ''}
      <button class="btn primary vg-next" data-vg-next>下一题 ${ic('i-chev-r')}</button></div>`;
    const fb = $('.vg-fb', box); if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: RM() ? 'auto' : 'smooth' });
    const nb = $('[data-vg-next]', box); if (nb) nb.focus({ preventScroll: true });
  }
  function hint() {
    const q = G.qs[G.qi]; if (G.answered) return;
    q.shown++; while (q.ans[q.shown - 1] === ' ') q.shown++;
    $('#vgSlots', box).innerHTML = slots(q);
    if (q.shown >= q.ans.length) return reveal();
    const inp = $('#vgInput', box); if (!inp.value || q.ans.toLowerCase().startsWith(inp.value.toLowerCase())) inp.value = q.ans.slice(0, q.shown);
    inp.focus({ preventScroll: true });
  }

  /* --- 结算 --- */
  function renderResult() {
    const { esc, ic, isWrong, ALLWORDS } = C(), byId = (id) => ALLWORDS.find((x) => x.id === id);
    const wrong = [...G.wrong].map(byId).filter(Boolean), right = G.words.filter((w) => !G.wrong.has(w.id));
    const allIn = wrong.every((w) => isWrong(w.id));
    const sec = G.kind === 'match' ? G.sec : Math.round((Date.now() - G.t0) / 1000);
    const wl = (arr, cls) => arr.map((w) => `<button class="vg-w ${cls}" data-vg-card="${w.id}"><b>${esc(w.w)}</b><span>${esc(w.c)}</span></button>`).join('');
    box.innerHTML = `<div class="vg vg-res m-vocab">
      <div class="vg-sum card">
        <div class="vg-sum-top">${stars(G.stars)}<div class="big"><b>${G.score}</b><small>分</small></div><div class="gname">${GAMES[G.kind].n}${G.newBest ? ' · <em>新纪录</em>' : ''}</div></div>
        <div class="vg-nums"><div><b>${G.acc}%</b><span>正确率</span></div><div><b>${G.maxCombo}</b><span>最长连击</span></div><div><b>${mmss(sec)}</b><span>用时</span></div>${G.kind === 'match' ? `<div><b>${G.moves}</b><span>步数</span></div>` : `<div><b>${G.right.size}/${G.words.length}</b><span>答对</span></div>`}</div>
        <div class="vg-again"><button class="btn primary" data-vg-start="${G.kind}">${ic('i-redo')}再来一局</button><button class="btn soft" data-vg-menu>换个游戏</button></div>
      </div>
      <div class="vg-lab">错词 ${wrong.length} 个${wrong.length ? ' · 已自动标为「不认识」' : ''}</div>
      ${wrong.length ? `<div class="vg-wl">${wl(wrong, 'bad')}</div>${allIn ? '' : `<button class="btn tone vg-add" data-vg-addall>${ic('i-abc')}重新加入生词本</button>`}` : `<p class="vg-note">全对，漂亮！</p>`}
      ${right.length ? `<details class="vg-rd"><summary>${ic('i-chev-r')}答对的词 ${right.length} 个</summary><div class="vg-wl">${wl(right, 'ok')}</div></details>` : ''}
    </div>`;
  }
  function openCard(id) {
    const { esc, ic, ALLWORDS, exOf, hlWord, sensesHTML, morphHTML, S } = C(), w = ALLWORDS.find((x) => x.id === id); if (!w) return;
    closeCard();
    const st = S.vocab[id], stT = st === 0 ? '不认识' : st === 1 ? '模糊' : st === 2 ? '认识' : '未标记';
    const el = document.createElement('div'); el.className = 'vg-pop'; el.id = 'vgPop';
    el.innerHTML = `<div class="vg-card card" role="dialog" aria-modal="true" aria-label="${esc(w.w)}"><button class="vg-x" data-vg-close aria-label="关闭">${ic('i-x')}</button>
      <div class="hd"><b>${esc(w.w)}</b>${sayBtn(w.w)}</div>${sensesHTML(w)}${morphHTML(w)}<div class="st">${esc(w.g)} · ${stT}</div>
      <ol>${exOf(w).map(([en, zh]) => `<li>${sayBtn(en, '朗读例句')}<div><div class="en wtap">${hlWord(esc(en), w.w)}</div>${zh ? `<div class="zh">${esc(zh)}</div>` : ''}</div></li>`).join('')}</ol></div>`;
    el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-vg-close]')) return closeCard(); const sp = e.target.closest('[data-say]'); if (sp) C().speak(sp.dataset.say, 0.9); });
    document.body.appendChild(el); popId = id; $('[data-vg-close]', el).focus({ preventScroll: true });
  }
  function closeCard() { const p = $('#vgPop'); if (p) p.remove(); popId = null; }

  /* ---------- 事件 ---------- */
  // 切到别的应用 / 锁屏：进行中的局自动暂停（回来点「继续上一局」）
  document.addEventListener('visibilitychange', () => { if (document.hidden && G && G.phase === 'play' && !G.paused) { stopTimers(); G.paused = true; render(box); } });
  document.addEventListener('click', (e) => {
    if (!box || !box.contains(e.target)) return;
    const t = (s) => e.target.closest(s), v = cfg(), S = C().S;
    const sp = t('[data-say]'); if (sp) { C().speak(sp.dataset.say, 0.9); return; }
    const s = t('[data-vg-src]'); if (s) { v.src = s.dataset.vgSrc; C().save(); renderMenu(v); return; }
    const st = t('[data-vg-start]'); if (st) { start(st.dataset.vgStart); window.scrollTo(0, box.closest('#vocab-box').offsetTop - 70); return; }
    if (t('[data-vg-resume]')) {
      G.paused = false;
      if (G.kind === 'match' && G.cards && G.gone.size === G.cards.length) { G.lock = false; if (G.bi + 1 < G.boards.length) { G.bi++; dealBoard(); render(box); } else finish(); return; }
      if (G.kind !== 'match' && G.answered) nextQ(); else render(box); return;
    }
    if (t('[data-vg-drop]')) { G = null; render(box); return; }
    if (t('[data-vg-menu]')) { G = null; render(box); return; }
    if (t('[data-vg-quit]')) { stopTimers(); G.paused = true; render(box); return; }
    const mc = t('[data-mc]'); if (mc) { clickCard(+mc.dataset.mc); return; }
    const vo = t('[data-vo]'); if (vo) { answerQuiz(+vo.dataset.vo); return; }
    if (t('[data-vg-next]')) { nextQ(); return; }
    if (t('[data-vg-hint]')) { hint(); return; }
    if (t('[data-vg-give]')) { if (!G.answered) reveal(); return; }
    const cd = t('[data-vg-card]'); if (cd) { openCard(cd.dataset.vgCard); return; }
    if (t('[data-vg-addall]')) {
      G.wrong.forEach((id) => { if (!C().isWrong(id)) { S.vocab[id] = 0; S.vseen[id] = C().lday(); delete S.vstage[id]; } }); C().save();
      refresh(); return;
    }
  });
  document.addEventListener('change', (e) => {
    if (!box || !box.contains(e.target)) return;
    const v = cfg();
    if (e.target.matches('[data-vg-topic]')) { v.g = +e.target.value; C().save(); renderMenu(v); }
    if (e.target.matches('[data-vg-speak]')) { v.speak = e.target.checked; C().save(); }
  });
  document.addEventListener('submit', (e) => {
    if (!box || !box.contains(e.target) || e.target.id !== 'vgForm') return;
    e.preventDefault(); submitSpell();
  });
  // 键盘：1–4 选项，回车下一题；Esc 关卡片
  document.addEventListener('keydown', (e) => {
    if (popId && e.key === 'Escape') { closeCard(); return; }
    if (!G || G.phase !== 'play' || G.paused || !visible() || popId || e.metaKey || e.ctrlKey || e.altKey) return;
    const inInput = e.target.closest && e.target.closest('input,textarea,select');
    if (G.kind === 'quiz' && !inInput && /^[1-4]$/.test(e.key) && !G.answered) { e.preventDefault(); answerQuiz(+e.key - 1); return; }
    if (e.key === 'Enter' && G.answered && !e.repeat && (G.kind === 'quiz' || G.kind === 'spell') && $('[data-vg-next]', box)) { e.preventDefault(); nextQ(); }
  });

  window.CET6Game = {
    render,
    // 单词复习判定题（app.js）复用：干扰项与近义排除
    distractors, overlap,
    // 离开单词页：停计时、暂停当前局，退出小游戏模式（下次点「小游戏」可以继续）
    leave() {
      closeCard();
      const vb = document.getElementById('vocab-box'); if (vb) vb.classList.remove('vg-playing');
      if (!G && !(C() && C().S.vgame && C().S.vgame.on)) return;
      stopTimers();
      if (G && G.phase === 'play') G.paused = true;
      if (G && G.phase === 'result') G = null;
      const S = C().S; if (S.vgame && S.vgame.on) { S.vgame.on = false; C().save(); }
    },
    // 自动化测试用：读当前题目的正确答案
    _debug() {
      if (!G) return null;
      const o = { phase: G.phase, kind: G.kind, score: G.score, combo: G.combo, maxCombo: G.maxCombo, wrong: [...G.wrong], right: [...G.right], paused: !!G.paused };
      if (G.kind === 'match' && G.cards) o.cards = G.cards.map((c, i) => ({ i, k: c.k, id: c.id, gone: G.gone.has(i) }));
      if (G.kind === 'quiz' && G.qs) Object.assign(o, { qi: G.qi, a: G.qs[G.qi] && G.qs[G.qi].a, answered: G.answered });
      if (G.kind === 'spell' && G.qs) Object.assign(o, { qi: G.qi, ans: G.qs[G.qi] && G.qs[G.qi].ans, answered: G.answered });
      return o;
    }
  };
})();
