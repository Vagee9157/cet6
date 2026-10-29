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

  function pickVoice() {
    if (!SS) return null;
    const vs = SS.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
    const us = vs.filter((v) => /en[-_]US/i.test(v.lang));
    return us.find((v) => /Samantha|Google US|Aria|Jenny|Ava|Allison/i.test(v.name)) || us.find((v) => v.localService) || us[0] || vs[0] || null;
  }
  if (SS && 'onvoiceschanged' in SS) SS.onvoiceschanged = () => pickVoice();

  function speak(text, rate) {
    if (!SS) { toast('这个浏览器不支持英文朗读。'); return null; }
    text = String(text || '').trim(); if (!text) return null;
    unlock();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate || 1; u.volume = 1;
    const v = pickVoice(); if (v) u.voice = v;
    keep = u; // 念完前保留引用，避免被回收
    u.onend = () => { if (keep === u) keep = null; };
    u.onerror = (e) => {
      if (keep === u) keep = null;
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
      if (!warned) { warned = true; toast('没念出来：请确认设备没静音、音量已打开；iPad 可在「设置 › 辅助功能 › 朗读内容 › 声音」里下载英语语音。'); }
    };
    try { if (SS.paused) SS.resume(); } catch (e) { /* ignore */ }
    if (SS.speaking || SS.pending) { SS.cancel(); setTimeout(() => SS.speak(u), 80); }
    else SS.speak(u);
    return u;
  }
  function stop() { try { if (SS && (SS.speaking || SS.pending)) SS.cancel(); } catch (e) { /* ignore */ } }

  window.CET6Sound = { speak, stop, register, unlock, toast };
})();
