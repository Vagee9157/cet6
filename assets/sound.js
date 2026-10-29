/* 声音统一入口（window.CET6Sound）：英文朗读（Web Speech）+ 各播放器（HTMLAudioElement）在 iPad / iPhone Safari 上能稳定出声。
 * iOS 的几条限制和对应做法：
 * 1. 第一次发声必须发生在用户手势里 → 页面上第一次点按 / 按键时「解锁」：念一句空的朗读、把登记过的播放器静音播一下再停。
 *    解锁之后，程序自己触发的朗读（小游戏自动朗读）和「载完音频再播」都不会再被拦。
 * 2. cancel() 之后立刻 speak() 常被吞掉 → 只有正在念时才 cancel，并隔 80ms 再念。
 * 3. 朗读对象可能在开口前被回收 → 保留引用到念完。
 * 4. 念不出来时给一条提示（静音 / 没装英语语音），不再无声无息。 */
(() => {
  'use strict';
  const SS = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const audios = new Set();
  let unlocked = false, keep = null, warned = false;

  function toast(msg) {
    let el = document.getElementById('sndToast');
    if (!el) { el = document.createElement('div'); el.id = 'sndToast'; el.className = 'snd-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 5200);
  }
  // 0.05 秒的静音 WAV（运行时生成，用来给还没设音源的播放器解锁）
  let SILENT = null;
  function silentURL() {
    if (SILENT) return SILENT;
    const rate = 8000, n = 400, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    SILENT = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    return SILENT;
  }

  function unlockAudio(a) {
    try {
      const had = a.getAttribute('src');
      a.muted = true;
      if (!had) a.src = silentURL();
      const p = a.play();
      const done = () => { a.pause(); a.muted = false; if (!had && a.getAttribute('src') === SILENT) { a.removeAttribute('src'); try { a.load(); } catch (e) { /* ignore */ } } };
      if (p && p.then) p.then(done, () => { a.muted = false; }); else done();
    } catch (e) { a.muted = false; }
  }
  function unlock() {
    if (unlocked) return; unlocked = true;
    if (SS) { try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; u.lang = 'en-US'; SS.speak(u); } catch (e) { /* ignore */ } }
    audios.forEach(unlockAudio);
  }
  ['pointerdown', 'touchend', 'keydown'].forEach((ev) => document.addEventListener(ev, unlock, { capture: true, passive: true }));

  // 新建的播放器登记一下；页面已解锁就立刻给它解锁
  function register(a) { if (!a || audios.has(a)) return a; audios.add(a); if (unlocked) unlockAudio(a); return a; }

  // 选声音：用户在「我的 · 朗读声音」里选过就用那个；否则按自然度打分挑最好的英语声音。
  // 神经网络 / 高级声音（Apple「高级 / Premium / 增强」、Edge「Natural / Online」、Google）明显更像真人，排在前面；
  // macOS 的玩具声音（Bubbles、Zarvox…）排除。
  const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Deranged|Hysterical|Pipe Organ|Fred|Junior|Ralph|Kathy|Grandma|Grandpa|Eddy|Flo|Reed|Rocko|Sandy|Shelley/i;
  function score(v) {
    if (!/^en[-_]/i.test(v.lang) || NOVELTY.test(v.name)) return -1;
    let s = /en[-_]US/i.test(v.lang) ? 30 : /en[-_](GB|AU|CA|IE|NZ)/i.test(v.lang) ? 22 : 10;
    if (/Premium|高级|優質/i.test(v.name)) s += 60;
    else if (/Natural|Neural|Online/i.test(v.name)) s += 55;
    else if (/Enhanced|增强|強化/i.test(v.name)) s += 45;
    else if (/^Google/i.test(v.name)) s += 2;   // Chrome 的 Google 声音走网络，偶尔不出声，排在本机声音后面
    if (/Ava|Zoe|Evan|Nathan|Allison|Samantha|Susan|Tom|Aria|Jenny|Guy|Emma|Brian|Andrew|Michelle/i.test(v.name)) s += 5;
    if (v.localService) s += 1;
    return s;
  }
  function voices() { return SS ? SS.getVoices().filter((v) => score(v) >= 0).sort((a, b) => score(b) - score(a)) : []; }
  const chosen = () => { try { return (window.CET6 && window.CET6.S && window.CET6.S.voice) || ''; } catch (e) { return ''; } };
  function pickVoice() {
    const vs = voices(); if (!vs.length) return null;
    const want = chosen();
    return (want && vs.find((v) => v.voiceURI === want)) || vs[0];
  }
  // 当前声音是不是「自然」档（给设置页提示用）
  const natural = (v) => !!v && score(v) >= 75;
  if (SS && 'onvoiceschanged' in SS) SS.onvoiceschanged = () => { pickVoice(); document.dispatchEvent(new Event('cet6-voices')); };

  // 预生成的单词 / 例句朗读（Kokoro 神经网络语音，data-vocab-audio.js）：文本对得上就播录音片段，对不上再用设备朗读
  let CLIPS = null, clipT = 0;
  const CLIP = new Audio(); CLIP.preload = 'auto'; register(CLIP);
  const norm = (t) => String(t || '').trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
  function clipOf(text) {
    if (typeof VOCAB_AUDIO === 'undefined') return null;
    if (!CLIPS) {
      CLIPS = {};
      for (const [w, [src, segs]] of Object.entries(VOCAB_AUDIO)) {
        CLIPS[norm(w)] = [src, segs[0]];
        const ex = typeof VOCAB_EX !== 'undefined' && VOCAB_EX[w] || [];
        ex.forEach(([en], i) => { if (segs[i + 1] && !CLIPS[norm(en)]) CLIPS[norm(en)] = [src, segs[i + 1]]; });
      }
    }
    return CLIPS[norm(text)] || null;
  }
  function playClip(c, text, rate) {
    const [src, [a, b]] = c;
    clearTimeout(clipT);
    try { if (SS && (SS.speaking || SS.pending)) SS.cancel(); } catch (e) { /* ignore */ }
    CLIP.pause(); CLIP.muted = false;
    CLIP.src = `${src}#t=${a},${b + 0.15}`;
    CLIP.playbackRate = 1;
    const fail = () => { clearTimeout(clipT); ttsSpeak(text, rate); };
    const p = CLIP.play(); if (p && p.catch) p.catch((e) => { if (e && e.name !== 'AbortError') fail(); });
    CLIP.onerror = fail;
    // 停表从真正开始出声算（加载慢时不会提前截断），timeupdate 再兜一道
    CLIP.onplaying = () => { clearTimeout(clipT); clipT = setTimeout(() => CLIP.pause(), Math.max(0.3, b + 0.3 - CLIP.currentTime) * 1000); };
    CLIP.ontimeupdate = () => { if (CLIP.currentTime > b + 0.35) CLIP.pause(); };
    return CLIP;
  }
  function speak(text, rate) {
    unlock();
    const c = clipOf(text); if (c) return playClip(c, text, rate);
    return ttsSpeak(text, rate);
  }
  function ttsSpeak(text, rate) {
    clearTimeout(clipT); try { CLIP.pause(); } catch (e) { /* ignore */ }
    if (!SS) { toast('这个浏览器不支持英文朗读。'); return null; }
    text = String(text || '').trim(); if (!text) return null;
    unlock();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if (v) u.voice = v;
    u.lang = v ? v.lang : 'en-US'; u.rate = rate || 1; u.volume = 1; u.pitch = 1;
    keep = u; // 念完前保留引用，避免被回收
    u.onend = () => { if (keep === u) keep = null; };
    u.onerror = (e) => {
      if (keep === u) keep = null;
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
      if (!warned) { warned = true; toast('没念出来：请确认设备没静音、音量已打开；iPad 可在「设置 › 辅助功能 › 朗读内容 › 声音」里下载英语语音。'); }
    };
    // 看门狗：1.5 秒还没开口（选中的声音不可用、网络声音失败等），换系统默认声音再念一次
    let started = false; u.onstart = () => { started = true; };
    const retry = setTimeout(() => {
      if (started || keep !== u) return;
      try { SS.cancel(); } catch (e) { /* ignore */ }
      const u2 = new SpeechSynthesisUtterance(text); u2.lang = 'en-US'; u2.rate = u.rate; keep = u2;
      u2.onend = () => { if (keep === u2) keep = null; }; u2.onerror = u.onerror;
      let ok2 = false; u2.onstart = () => { ok2 = true; };
      setTimeout(() => SS.speak(u2), 60);
      // 默认声音也不开口：浏览器的朗读引擎卡死了（Chrome 偶发，整个浏览器都念不出来），只能重开浏览器
      setTimeout(() => { if (!ok2 && keep === u2) { try { SS.cancel(); } catch (e) { /* ignore */ } toast('浏览器的朗读功能卡住了：请完全退出浏览器（Mac 按 ⌘Q）再打开。已配录音的单词和例句不受影响。'); } }, 1800);
    }, 1500);
    u.addEventListener('end', () => clearTimeout(retry));
    try { if (SS.paused) SS.resume(); } catch (e) { /* ignore */ }
    if (SS.speaking || SS.pending) { SS.cancel(); setTimeout(() => SS.speak(u), 80); }
    else SS.speak(u);
    return u;
  }
  function stop() { clearTimeout(clipT); try { CLIP.pause(); } catch (e) { /* ignore */ } try { if (SS && (SS.speaking || SS.pending)) SS.cancel(); } catch (e) { /* ignore */ } }

  window.CET6Sound = { speak, stop, register, unlock, toast, voices, pickVoice, natural, score, clipOf, _clip: CLIP };
})();
