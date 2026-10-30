// data-pm-marquee: an endless row. The track holds two identical groups and
// slides by one group width, then wraps. Scrolling speeds it up and sets its
// direction. Reduced motion leaves it as a static row.
import { reducedMotion } from '../utils/env.js';
import { $$ } from '../utils/dom.js';

const BASE = 40;      // px per second at rest
const BOOST = 0.6;    // extra px/s per px/s of page scroll
const MAX = 900;

function setup(track) {
  const [a, b] = track.children;
  if (!a || !b) return () => {};
  let x = 0, dir = 1, boost = 0, last = performance.now(), lastY = window.scrollY, raf = 0, visible = true;

  const width = () => b.offsetLeft - a.offsetLeft;
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const dy = window.scrollY - lastY;
    lastY = window.scrollY;
    if (dy) dir = dy > 0 ? 1 : -1;
    const target = Math.min(Math.abs(dy) / Math.max(dt, 0.001) * BOOST, MAX);
    boost += (target - boost) * 0.1;
    const w = width();
    x -= dir * (BASE + boost) * dt;
    if (w) x = ((x % w) - w) % w; // keep x in (-w, 0]
    track.style.transform = `translate3d(${x}px,0,0)`;
    if (visible) raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) { last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(frame); }
  });
  io.observe(track);
  track.style.willChange = 'transform';

  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
    track.style.transform = '';
    track.style.willChange = '';
  };
}

export function init(root) {
  if (reducedMotion()) return () => {};
  const destroyers = $$('[data-pm-marquee]', root).map(setup);
  return () => destroyers.forEach((d) => d());
}
