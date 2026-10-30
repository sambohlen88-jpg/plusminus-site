// A small + that follows the pointer with a little lag.
//   links, buttons, labels      it grows into an outline ring
//   data-pm-cursor="view"       it becomes a lime "− View" pill
//   data-pm-cursor="close"      it turns 45° into ×
//   text fields                 it hides so the text caret shows
// Only on fine pointers with hover, and never with reduced motion.
import { reducedMotion } from '../utils/env.js';

const CSS = `
html.pm-cursor-on, html.pm-cursor-on * { cursor: none !important; }
html.pm-cursor-on input, html.pm-cursor-on textarea, html.pm-cursor-on select, html.pm-cursor-on [contenteditable] { cursor: auto !important; }
.pm-cursor { position: fixed; top: 0; left: 0; z-index: 10000; pointer-events: none; opacity: 0; transition: opacity .2s; }
.pm-cursor.is-visible { opacity: 1; }
.pm-cursor_body { position: absolute; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; margin: -10px 0 0 -10px; border-radius: 999px; color: #f2f0eb; mix-blend-mode: difference; transition: transform .35s cubic-bezier(.215,.61,.355,1), box-shadow .35s, height .35s cubic-bezier(.215,.61,.355,1), width .35s cubic-bezier(.215,.61,.355,1), margin .35s cubic-bezier(.215,.61,.355,1), background-color .25s, color .25s; }
.pm-cursor_mark { position: relative; width: 14px; height: 14px; flex: none; }
.pm-cursor_mark i { position: absolute; left: 50%; top: 50%; background: currentColor; transform: translate(-50%,-50%); transition: transform .35s cubic-bezier(.215,.61,.355,1); }
.pm-cursor_mark i:first-child { width: 14px; height: 1.5px; }
.pm-cursor_mark i:last-child { width: 1.5px; height: 14px; }
.pm-cursor_label { overflow: hidden; max-width: 0; white-space: nowrap; font: 500 13px/1 "DM Sans Variable", "DM Sans", system-ui, sans-serif; transition: max-width .35s cubic-bezier(.215,.61,.355,1), margin .35s; }
.pm-cursor[data-state="link"] .pm-cursor_body { width: 44px; height: 44px; margin: -22px 0 0 -22px; box-shadow: inset 0 0 0 1px currentColor; }
.pm-cursor[data-state="link"] .pm-cursor_mark { transform: scale(0); }
.pm-cursor_mark { transition: transform .35s cubic-bezier(.215,.61,.355,1); }
.pm-cursor[data-state="close"] .pm-cursor_body { transform: rotate(45deg) scale(1.6); }
.pm-cursor[data-state="view"] .pm-cursor_body { width: 92px; height: 40px; margin: -20px 0 0 -46px; background: #d4ff3a; color: #0e0e0e; mix-blend-mode: normal; }
.pm-cursor[data-state="view"] .pm-cursor_mark i:last-child { transform: translate(-50%,-50%) scaleY(0); }
.pm-cursor[data-state="view"] .pm-cursor_label { max-width: 60px; margin-left: 8px; }
.pm-cursor[data-state="text"] { opacity: 0; }
`;

const LINKS = 'a, button, [role="button"], label, summary';
const TEXT = 'input:not([type="submit"]):not([type="button"]), textarea, select, [contenteditable]';

export function init() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine || reducedMotion()) return () => {};

  const style = Object.assign(document.createElement('style'), { textContent: CSS });
  const el = document.createElement('div');
  el.className = 'pm-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="pm-cursor_body"><span class="pm-cursor_mark"><i></i><i></i></span><span class="pm-cursor_label">View</span></div>';
  document.head.appendChild(style);
  document.body.appendChild(el);
  document.documentElement.classList.add('pm-cursor-on');

  let tx = -100, ty = -100, x = tx, y = ty, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
    raf = requestAnimationFrame(loop);
  };

  const state = (target) => {
    const hook = target.closest?.('[data-pm-cursor]');
    if (hook) return hook.dataset.pmCursor;
    if (target.closest?.(TEXT)) return 'text';
    if (target.closest?.(LINKS)) return 'link';
    return '';
  };

  const onMove = (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!el.classList.contains('is-visible')) { x = tx; y = ty; el.classList.add('is-visible'); }
  };
  const onOver = (e) => { el.dataset.state = state(e.target); };
  const onLeave = () => el.classList.remove('is-visible');

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver);
  document.documentElement.addEventListener('pointerleave', onLeave);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    document.documentElement.classList.remove('pm-cursor-on');
    el.remove();
    style.remove();
  };
}
