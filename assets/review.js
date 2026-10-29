/* 今日复习（window.CET6Review）：把各模块到期的复习项合成一个队列，在首页里一项接一项连续做完。
 * - 来源：到期单词（今日单词的复习词，app.js dailyPlan().review 里今天还没刷的）、错题单题重测（CET6Learn.dueList，含同义替换错题）、
 *   关键词卡 / 模板句（CET6Recall.dueAll）、听写错句（CET6Drills.dictDue，S.dictBad 到期的句子重听重写）。
 * - 排序：(过期天数 + 1) × 权重，大的在前。权重：错题按题型单题分值（CET6Learn.TMAP[sub].pt，同义替换错题按出处题型），单词 / 卡 / 听写句按 1。
 * - 每项用各自已有的渲染与判定：单词 = 单词页同一套判定题规则（CET6.vreview）、错题 = CET6Learn.retestOne、卡 = CET6Recall.mountOne、听写 = CET6Drills.dictReview。
 * - 进度：做完的项自然不再到期，所以中途退出后重新打开就是剩下的；跳过的记在 S.rvq.skip（当天），排到最后。
 * - S.rvLog[日期] = {n 当天到期总数, left 最后一次看到还剩几项, done = n − left}：首页 / 流程 / 页面隐藏时更新，周报算「复习完成率」。
 * 另含考点「记住了 → 练一题」的映射（outlineTry / outlineGo）。
 * 本文件在 app.js 之前加载，运行时经 window.CET6 / CET6Learn / CET6Recall / CET6Drills 取用。 */
(() => {
  'use strict';
  const C = () => window.CET6, St = () => C().S;
  const Lr = () => window.CET6Learn, Rc = () => window.CET6Recall, Dr = () => window.CET6Drills;
  const esc = (t) => C().esc(t), ic = (n) => C().ic(n);
  const $ = (s, el = document) => el.querySelector(s);
  const today = () => C().lday();
  const isDay = (x) => typeof x === 'string' && /^\d{4}-\d\d-\d\d$/.test(x);
  const dayDiff = (a, b) => { const p = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / 864e5); };
  const KIND = {
    rt: { n: '错题重测', mod: 'm-read', min: 1.5, ord: 0 },
    dict: { n: '听写错句', mod: 'm-listen', min: 1, ord: 1 },
    card: { n: '关键词卡 / 模板句', mod: 'm-trans', min: 0.4, ord: 2 },
    word: { n: '单词', mod: 'm-vocab', min: 0.3, ord: 3 },
  };
  const ptOf = (sub) => { const T = Lr() && Lr().TMAP[sub]; return T ? T.pt : 7.1; };   // slowreal 等不在官方结构里的听力按 7.1

  /* ---------- 队列 ---------- */
  function queue() {
    const t = today(), s = St(), out = [];
    const add = (x) => { const due = isDay(x.due) && x.due < t ? x.due : t; const od = dayDiff(due, t); out.push(Object.assign(x, { due, od, score: (od + 1) * x.w })); };
    try {
      const plan = C().dailyPlan();
      (plan.review || []).forEach((id) => { if (s.vseen[id] !== t && C().wordOf(id)) add({ t: 'word', key: 'w:' + id, id, due: C().vdueDay(id) || t, w: 1 }); });
    } catch (e) { /* 单词数据缺失时跳过 */ }
    if (Lr()) Lr().dueList().forEach((w) => { const sub = w.kind === 'para' ? Lr().subOf(w.setId) : w.sub; add({ t: 'rt', key: 'r:' + w.key, id: w.key, due: w.due, w: ptOf(sub), sub: w.kind === 'para' ? 'para' : sub }); });
    if (Rc() && Rc().dueAll) Rc().dueAll().forEach((c) => add({ t: 'card', key: 'c:' + c.id, id: c.id, ck: c.kind, due: c.due, w: 1 }));
    if (Dr() && Dr().dictDue) Dr().dictDue().forEach((d) => add({ t: 'dict', key: d.key, id: d.key, due: d.due, w: 1 }));
    return out.sort((a, b) => b.score - a.score || KIND[a.t].ord - KIND[b.t].ord || a.due.localeCompare(b.due));
  }
  // 每天的复习量封顶：按优先级取到约「每天可用时间」的一半（至少 10 项），积压多的往后几天慢慢消化；做完可以再加一批
  function capOf(full) {
    const q = sess(), budget = [30, 60, 90].includes(St().dailyMin) ? St().dailyMin : 60, lim = budget * 0.5;
    if (typeof q.cap === 'number' && q.capB === budget) return q.cap; // 每天可用时间改了就重算
    q.capB = budget;
    let n = 0, m = 0; const minN = budget <= 30 ? 6 : 10; for (const x of full) { if (n >= minN && m + KIND[x.t].min > lim) break; m += KIND[x.t].min; n++; }
    q.cap = n + (q.done || 0); C().save(); return q.cap;
  }
  function todayQ() { const full = queue(); const left = Math.max(0, capOf(full) - sess().done); return { q: full.slice(0, left), full: full.length }; }
  const minOf = (q) => (q.length ? Math.max(1, Math.round(q.reduce((a, x) => a + KIND[x.t].min, 0))) : 0);
  function observe(left) {
    const s = St(); if (!s.rvLog || typeof s.rvLog !== 'object' || Array.isArray(s.rvLog)) s.rvLog = {};
    const d = today(); let r = s.rvLog[d], ch = false;
    if (!r) { r = s.rvLog[d] = { n: left, left, done: 0 }; ch = true; }
    else if (left !== r.left) { if (left > r.left) r.n += left - r.left; r.left = left; r.done = r.n - r.left; ch = true; }
    const ks = Object.keys(s.rvLog).sort(); if (ks.length > 60) { ks.slice(0, ks.length - 60).forEach((k) => delete s.rvLog[k]); ch = true; }
    if (ch) C().save();
    return r;
  }
  function info() {
    const { q, full } = todayQ(), by = { word: 0, rt: 0, card: 0, dict: 0 };
    q.forEach((x) => { by[x.t]++; });
    const r = observe(q.length);
    // 已做 / 总数按今天实际作答算（rvLog 只给周报用），封顶后不会出现「已做」比到期还多的情况
    const dn = sess().done;
    return { n: q.length, min: minOf(q), by, q, total: dn + q.length, done: dn, full };
  }
  const byText = (by) => [['word', '单词'], ['rt', '错题'], ['card', '卡片'], ['dict', '听写']].filter(([k]) => by[k]).map(([k, n]) => `${n} ${by[k]}`).join(' · ');
  // 首页今日计划第一项
  function taskStatus(t) {
    const x = info();
    return {
      done: !x.n, f: x.total ? x.done / x.total : 1, min: x.n ? x.min : t.min,
      title: x.n ? `今日复习 ${x.n} 项 · 约 ${x.min} 分钟` : '今日复习',
      p: x.n ? `${byText(x.by)}${x.done ? ` · 已做 ${x.done}` : ''}${x.full > x.n ? ` · 共 ${x.full} 项到期，按优先级今天先做这些` : ''}` : x.done ? `今天复习了 ${x.done} 项` : '今天没有到期的', mod: 'm-vocab',
    };
  }

  /* ---------- 连续流程 ---------- */
  let F = null;
  function sess() { const s = St(), t = today(); if (!s.rvq || s.rvq.d !== t || !Array.isArray(s.rvq.skip)) s.rvq = { d: t, skip: [], done: 0, ok: 0 }; return s.rvq; }
  function build() {
    const q = todayQ().q, sk = new Set(sess().skip);
    F = { list: [...q.filter((x) => !sk.has(x.key)), ...q.filter((x) => sk.has(x.key))], i: 0, ok: 0, n: 0, kb: null };
  }
  function open() {
    cleanup(); C().show('home', true); build(); paint(); window.scrollTo(0, 0);
  }
  function cleanup() { if (Dr() && Dr().stopDict) Dr().stopDict(); if (Lr() && Lr().stopRetest) Lr().stopRetest(); if (window.speechSynthesis) speechSynthesis.cancel(); }
  function exit(to) { cleanup(); F = null; C().show(to || 'home'); }
  function paint() {
    const box = $('#home-box'); if (!F || !box) return;
    const live = new Set(todayQ().q.map((x) => x.key));
    while (F.i < F.list.length && !live.has(F.list[F.i].key)) F.i++;
    observe(live.size); const done = sess().done, r = { n: done + live.size };
    const head = `<div class="prac-head rv-head"><button class="btn ghost" data-rvx>${ic('i-chev-l')}先退出</button><h2>今日复习</h2><span class="rv-n tabular">${done} / ${r.n}</span></div>
      <div class="rv-prog"><span class="bar"><i style="width:${r.n ? Math.round(done / r.n * 100) : 100}%"></i></span><span class="tx">${live.size ? `还剩 ${live.size} 项 · 约 ${minOf(todayQ().q)} 分钟 · 进度自动保存` : '全部完成'}</span></div>`;
    box.onchange = null;
    if (F.i >= F.list.length) {
      const left = live.size;
      box.innerHTML = `<div class="rv-wrap">${head}<div class="result m-vocab"><div class="score">${F.ok}<small> / ${F.n}</small></div><p>${left ? `这一轮做完了，还有 ${left} 项是跳过的。` : F.n ? '今天到期的复习全部做完。答对的按各自的间隔往后排，答错的明天再来。' : '今天没有到期的复习。'}</p></div>
        <div class="submit-bar done-bar">${left ? `<button class="btn primary" data-rvagain>${ic('i-redo')}做跳过的 ${left} 项</button>` : ''}${!left && queue().length ? `<button class="btn primary" data-rvmore>${ic('i-redo')}再复习一批（还有 ${queue().length} 项到期）</button>` : ''}<button class="btn${left ? '' : ' primary'}" data-rvhome>回首页</button></div></div>`;
      box.onclick = click; F.kb = null; return;
    }
    const it = F.list[F.i], K = KIND[it.t];
    const due = it.od > 0 ? `<span class="rv-od">过期 ${it.od} 天</span>` : '<span>今天到期</span>';
    const wt = it.t === 'rt' ? `<span>${esc(it.sub === 'para' ? '同义替换' : (Lr().SUB_NAME[it.sub] || ''))} · 每题 ${it.w} 分</span>` : '';
    box.innerHTML = `<div class="rv-wrap">${head}<div class="rv-meta ${K.mod}"><span class="tag">${K.n}</span>${wt}${due}</div><div id="rvBody" class="rv-body"></div></div>`;
    box.onclick = click;
    const body = $('#rvBody'), next = (res) => after(it, res);
    F.kb = null;
    let ok = false;
    if (it.t === 'word') ok = wordItem(body, it.id, next);
    else if (it.t === 'rt') ok = Lr().retestOne(body, it.id, (res) => next(res === null ? null : res !== 'reset'));
    else if (it.t === 'card') ok = Rc().mountOne(body, it.id, next);
    else if (it.t === 'dict') ok = Dr().dictReview(body, it.id, (acc) => next(acc === null ? null : acc >= 0.8));
    if (!ok) { F.i++; paint(); }
  }
  // res：true 答对 / false 答错 / null 跳过
  function after(it, res) {
    const q = sess();
    if (res === null) { if (!q.skip.includes(it.key)) q.skip.push(it.key); }
    else { q.done++; F.n++; if (res) { q.ok++; F.ok++; } q.skip = q.skip.filter((k) => k !== it.key); }
    C().save(); F.i++; paint(); window.scrollTo(0, 0);
  }
  function click(e) {
    if (e.target.closest('[data-rvx]') || e.target.closest('[data-rvhome]')) { exit('home'); return; }
    if (e.target.closest('[data-rvmore]')) { const q = sess(); q.cap = (q.cap || 0) + 10; C().save(); build(); paint(); window.scrollTo(0, 0); return; }
    if (e.target.closest('[data-rvagain]')) { sess().skip = []; C().save(); build(); paint(); window.scrollTo(0, 0); }
  }
  // 切 tab：停掉音频、退出流程（进度已在各自数据里）
  document.addEventListener('click', (e) => { if (F && e.target.closest && e.target.closest('nav.tabs, .logo')) { cleanup(); F = null; } }, true);
  document.addEventListener('keydown', (e) => {
    if (!F || !F.kb || $('#view-home').hidden || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (e.target.closest && e.target.closest('input,textarea,select')) return;
    F.kb(e);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && window.CET6) { try { observe(todayQ().q.length); } catch (e) { /* 忽略 */ } } });

  /* ---------- 单词判定题（规则与单词页一致：英→中四选一；生词本里的词默认看中文拼英文） ---------- */
  const spellNorm = (t) => String(t || '').toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().replace(/^be /, '');
  function wordItem(el, id, done) {
    const c = C(), w = c.wordOf(id); if (!w) return false;
    const spell = c.isWrong(id) && (St().vqk || 'spell') === 'spell' && c.canSpell(w);
    let q;
    if (spell) q = { kind: 'spell' };
    else {
      const G = window.CET6Game, ds = G && G.distractors ? G.distractors(w, 3) : c.shuffle(c.ALLWORDS.filter((x) => x.id !== w.id && x.c !== w.c)).slice(0, 3);
      const opts = c.shuffle([w, ...ds]); q = { kind: 'mc', opts: opts.map((x) => x.c), a: opts.indexOf(w) };
    }
    q.res = null;
    const answer = (ok, pick, input) => { if (q.res) return; q.res = ok ? 'ok' : 'bad'; q.pick = pick; q.input = input; c.vreview(id, ok); paintW(); const nx = el.querySelector('[data-rvwnext]'); if (nx) nx.focus({ preventScroll: true }); };
    const paintW = () => {
      if (!q.res) {
        const head = q.kind === 'mc'
          ? `<div class="vq-lab">复习判定 · 选出中文意思</div><div class="vq-w">${esc(w.w)}<button class="spk sm" data-say="${esc(w.w)}" aria-label="朗读">${ic('i-vol')}</button></div><span class="pos">${esc(w.p)}</span>`
          : `<div class="vq-lab">复习判定 · 看中文拼英文（生词本）</div><div class="vq-cn">${esc(w.c)}</div><span class="pos">${esc(w.p)}</span><div class="vq-hint">首字母 <b>${esc(w.w[0])}</b> · ${w.w.replace(/[^A-Za-z]/g, '').length} 个字母${/\s/.test(w.w) ? ` · ${w.w.trim().split(/\s+/).length} 个词` : ''}</div>`;
        const body = q.kind === 'mc'
          ? `<div class="vq-opts">${q.opts.map((t, i) => `<button class="vq-opt" data-rvwpick="${i}"><span class="k">${i + 1}</span><span>${esc(t)}</span></button>`).join('')}</div>`
          : `<form class="vq-form" data-rvwform><input class="vq-in" name="a" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="拼出这个词" aria-label="拼写"><button class="btn primary" type="submit">${ic('i-check')}提交</button></form>`;
        el.innerHTML = `<div class="vq card m-vocab">${head}${body}<div class="vq-sub"><button class="btn ghost" data-rvwskip>不认识，看答案</button><button class="btn ghost" data-rvwpass>跳过</button></div></div>`;
        const inp = el.querySelector('.vq-in'); if (inp && matchMedia('(hover:hover) and (pointer:fine)').matches) inp.focus({ preventScroll: true });
        return;
      }
      const ok = q.res === 'ok';
      const mine = q.kind === 'mc' ? (q.pick != null && q.pick !== q.a ? `你选：${esc(q.opts[q.pick])}` : '') : q.input ? `你写：${esc(q.input)}` : '';
      const ex = (c.exOf(w) || []).slice(0, 2);
      el.innerHTML = `<div class="vq-res ${ok ? 'ok' : 'bad'}" role="status"><b>${ok ? `${ic('i-check')}答对了，升一级` : `${ic('i-x')}${q.pick == null && !q.input ? '记为不认识' : '答错了，记为不认识'}`}</b><span>${mine}</span><span class="nx">${ok ? `下次 ${esc(c.vdueDay(id) || '')} 再查` : '阶段清零，明天再来'}</span></div>
        <div class="card rv-wcard m-vocab"><div class="bk-hd"><span class="bw">${esc(w.w)}</span><button class="spk sm" data-say="${esc(w.w)}" aria-label="朗读">${ic('i-vol')}</button></div>${c.sensesHTML ? c.sensesHTML(w) : `<div class="cn">${esc(w.c)}</div>`}${c.morphHTML ? c.morphHTML(w) : ''}
          <ol class="exs">${ex.map(([en, zh]) => `<li><div class="ex wtap">${c.hlWord(esc(en), w.w)}</div>${zh ? `<div class="zh">${esc(zh)}</div>` : ''}</li>`).join('')}</ol></div>
        <div class="vq-next"><button class="btn primary" data-rvwnext>下一项${ic('i-chev-r')}</button>${ok ? '<button class="btn ghost" data-rvwfuzzy>蒙对的，记模糊</button>' : ''}</div>`;
    };
    el.onclick = (e) => {
      const sp = e.target.closest('[data-say]'); if (sp) { c.speak(sp.dataset.say, 0.9); return; }
      const p = e.target.closest('[data-rvwpick]'); if (p) { const i = +p.dataset.rvwpick; answer(i === q.a, i); return; }
      if (e.target.closest('[data-rvwskip]')) { answer(false, null, ''); return; }
      if (e.target.closest('[data-rvwpass]')) { done(null); return; }
      if (e.target.closest('[data-rvwnext]')) { done(q.res === 'ok'); return; }
      if (e.target.closest('[data-rvwfuzzy]')) { c.vfuzzy(id); done(false); }
    };
    el.onsubmit = (e) => { const f = e.target.closest('[data-rvwform]'); if (!f) return; e.preventDefault(); const v = f.elements.a.value; if (!v.trim()) return; answer(spellNorm(v) === spellNorm(w.w), null, v.trim()); };
    F.kb = (e) => {
      const k = e.key.toLowerCase();
      if (!q.res) { if (q.kind === 'mc' && /^[1-4]$/.test(k)) { e.preventDefault(); answer(+k - 1 === q.a, +k - 1); } return; }
      if ((k === 'enter' || k === ' ') && !(e.target.closest && e.target.closest('button'))) { e.preventDefault(); done(q.res === 'ok'); }
    };
    paintW(); return true;
  }

  /* ---------- 考点「记住了 → 练一题」 ----------
     data-outline.js 的考点没有配套题，不硬造：按考点内容映射到已有练习（一篇对应题型 / 专项训练 / 写译卡），给一个入口。
     考试结构类（exam 章）没有合理的练习对应，只保留勾选。 */
  const OT = {
    listen: ['rank', 'set:conv', 'set:lecture', 'drill:para', 'drill:dict'],   // 题型套路 → 提分排行最靠前的听力题型；读选项 → 长对话；信号词 → 讲座；同义替换 / 每天怎么练 → 专项
    read: ['set:mc', 'set:match', 'set:cloze', 'drill:para'],
    write: ['wt:write', 'wt:write', 'wt:hl', 'wt:hl', 'wt:write'],
    trans: ['wt:trans', 'wt:tk', 'wt:trans', 'wt:trans'],
    vocab: ['vocab', 'set:cloze'],
  };
  const MODS = { listen: 'm-listen', read: 'm-read', write: 'm-write', trans: 'm-trans', vocab: 'm-vocab' };
  function resolve(ch, i) {
    let a = (OT[ch] || [])[i]; if (!a) return null;
    if (a === 'rank') { const top = Lr().predict().rank.find((x) => x.part === 'listen'); a = 'set:' + (top ? top.k : 'lecture'); }
    if (a.startsWith('set:')) {
      const sub = a.slice(4), set = Lr().pickSet(sub); if (!set) return null;
      return { go: 'set:' + set.id, label: `${Lr().SUB_NAME[sub]} 1 篇`, sub: set.title.replace(/^[^·]+·\s*/, '') };
    }
    if (a === 'drill:para') return { go: a, label: '同义替换专项 10 组', sub: '题干说法 ↔ 原文说法' };
    if (a === 'drill:dict') return { go: a, label: '逐句听写', sub: '按句听写、逐词对比' };
    if (a === 'wt:write') return { go: a, label: '写 1 篇作文并估分', sub: '' };
    if (a === 'wt:trans') return { go: a, label: '译 1 段并估分', sub: '' };
    if (a === 'wt:hl') return { go: a, label: '模板句卡', sub: '范文高分表达挖空补全' };
    if (a === 'wt:tk') return { go: a, label: '关键词卡', sub: '看中文打英文' };
    if (a === 'vocab') return { go: a, label: '今日单词', sub: '复习词先做判定题' };
    return null;
  }
  function outlineTry(ch, i) {
    const r = resolve(ch, i); if (!r) return '';
    return `<div class="ot-try ${MODS[ch] || ''}"><span class="lab">记住了，趁热练一下</span><span class="what"><b>${esc(r.label)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</span><button class="btn soft" type="button" data-otry="${esc(r.go)}">去做${ic('i-chev-r')}</button></div>`;
  }
  function outlineGo(a) {
    const c = C();
    if (a.startsWith('set:')) return c.goSet(a.slice(4));
    if (a.startsWith('drill:')) return c.openDrill(a.slice(6));
    if (a.startsWith('wt:')) return c.openWT(a.slice(3));
    if (a === 'vocab') return c.openVocabDaily();
  }

  window.CET6Review = { queue, info, observe, taskStatus, open, exit, outlineTry, outlineGo, KIND };
})();
