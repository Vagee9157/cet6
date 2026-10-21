/* iPad / 平板体验的小补丁（不碰学习数据）：
 * 1. 外接键盘：按过键（不在输入框里）就给 <html> 加 .kbd，显示快捷键提示；手指点屏幕再收起。
 *    iPadOS 是 (hover:none)，原来快捷键提示一直藏着。
 * 2. 长按查词（assets/readtools.js 300ms 触发）：按住原文 250ms 后临时关掉原生选字（html.rt-hold），
 *    避免 iPadOS 500ms 时弹出选择手柄 / 放大镜跟查词浮层抢手势；松手后恢复，正常选字复制不受影响。
 * 3. standalone（加到主屏幕）时给 <html> 加 .standalone，样式里可按需处理安全区。 */
(() => {
  'use strict';
  const root = document.documentElement;
  const MOD = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Fn']);
  document.addEventListener('keydown', (e) => {
    if (MOD.has(e.key)) return;
    const t = e.target; if (t && t.closest && t.closest('input,textarea,select,[contenteditable="true"]')) return;
    root.classList.add('kbd');
  }, true);
  document.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') root.classList.remove('kbd'); }, true);

  const AREA = '#practice-box .passage, #practice-box .script';
  let hold = null;
  const release = () => { if (!hold) return; clearTimeout(hold.t); hold = null; setTimeout(() => { if (!hold) root.classList.remove('rt-hold'); }, 120); };
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || !e.target.closest || !e.target.closest(AREA)) return;
    const x = e.clientX, y = e.clientY;
    hold = { x, y, id: e.pointerId, t: setTimeout(() => root.classList.add('rt-hold'), 250) };
  }, true);
  document.addEventListener('pointermove', (e) => { if (hold && e.pointerId === hold.id && Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > 10) release(); }, true);
  ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, release, true));

  const sa = window.matchMedia && matchMedia('(display-mode: standalone)').matches;
  if (sa || navigator.standalone) root.classList.add('standalone');
})();
