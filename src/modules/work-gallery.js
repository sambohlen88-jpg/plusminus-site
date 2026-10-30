// data-pm-gallery: the Selected work slider. The track scrolls natively (swipe,
// trackpad, scroll-snap); the arrows step one card at a time and the counter
// shows the first visible card. Without JS the track still scrolls.
//   data-pm-gallery          the scrolling list (Webflow Collection List)
//   data-pm-gallery-prev     previous button   } looked up inside the same
//   data-pm-gallery-next     next button       } section as the list
//   data-pm-gallery-count    "01 / 04" text
import { reducedMotion } from '../utils/env.js';
import { $$ } from '../utils/dom.js';

const pad = (n) => String(n).padStart(2, '0');

function setup(track) {
  const scope = track.closest('section') || track.parentElement;
  const prev = scope.querySelector('[data-pm-gallery-prev]');
  const next = scope.querySelector('[data-pm-gallery-next]');
  const count = scope.querySelector('[data-pm-gallery-count]');
  const items = () => [...track.children];

  const index = () => {
    const left = track.getBoundingClientRect().left;
    let best = 0, dist = Infinity;
    items().forEach((el, i) => {
      const d = Math.abs(el.getBoundingClientRect().left - left);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  };

  const atStart = () => track.scrollLeft <= 2;
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

  const update = () => {
    const total = items().length;
    if (count) count.textContent = `${pad(Math.min(index() + 1, total))} / ${pad(total)}`;
    for (const [btn, off] of [[prev, atStart()], [next, atEnd()]]) {
      if (!btn) continue;
      btn.setAttribute('aria-disabled', String(off));
      btn.classList.toggle('is-disabled', off);
    }
  };

  const go = (dir) => {
    const list = items();
    const target = list[Math.max(0, Math.min(list.length - 1, index() + dir))];
    if (!target) return;
    const left = target.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollBy({ left, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  const onPrev = (e) => { e.preventDefault(); go(-1); };
  const onNext = (e) => { e.preventDefault(); go(1); };
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };
  let raf = 0;
  const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };

  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  track.addEventListener('keydown', onKey);
  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (!track.hasAttribute('tabindex')) track.setAttribute('tabindex', '0');
  if (!track.hasAttribute('aria-label')) track.setAttribute('aria-label', 'Selected work. Use the arrow keys to move between projects.');
  update();

  return () => {
    cancelAnimationFrame(raf);
    prev?.removeEventListener('click', onPrev);
    next?.removeEventListener('click', onNext);
    track.removeEventListener('keydown', onKey);
    track.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}

export function init(root) {
  const destroyers = $$('[data-pm-gallery]', root).map(setup);
  return () => destroyers.forEach((d) => d());
}
