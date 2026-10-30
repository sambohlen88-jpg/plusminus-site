// data-pm-reveal: content that animates in as it enters the viewport.
//   lines    SplitText lines rise from a mask (0.8s power3.out, 0.08s stagger)
//   fade     the element fades and rises 24px
//   stagger  the element's children fade and rise one after another
//   clip     the element unmasks upward while its image settles from 1.12x
//   data-pm-reveal-after="field"  play on load, after the ± field intro
//   data-pm-reveal-delay="0.2"    extra delay in seconds
// Elements stay visible without JS. The page hides them only while html has
// .pm-js, and reduced motion shows them straight away.
import { reducedMotion } from '../utils/env.js';
import { loadGsap } from '../utils/gsap.js';
import { $$ } from '../utils/dom.js';

const show = (el) => { el.style.visibility = 'visible'; };
const EASE = 'power3.out';

function afterField() {
  if ('pmFieldReady' in document.documentElement.dataset) return Promise.resolve();
  return new Promise((resolve) => {
    document.addEventListener('pm:field-ready', resolve, { once: true });
    setTimeout(resolve, 2500); // never hold text hostage to the canvas
  });
}

function animate(gsap, el, splits, scrollTrigger) {
  const type = el.dataset.pmReveal;
  const delay = parseFloat(el.dataset.pmRevealDelay || '0');
  const base = { delay, ease: EASE, scrollTrigger };
  show(el);
  if (type === 'lines') {
    const split = new window.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'pm-line' });
    splits.push(split);
    gsap.from(split.lines, { ...base, yPercent: 110, duration: 0.8, stagger: 0.08 });
  } else if (type === 'stagger') {
    gsap.from(el.children, { ...base, autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.08 });
  } else if (type === 'clip') {
    const img = el.querySelector('img');
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' },
      { ...base, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.out' });
    if (img) gsap.fromTo(img, { scale: 1.12 }, { ...base, scale: 1, duration: 1.4, ease: 'power3.out' });
  } else {
    gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { ...base, autoAlpha: 1, y: 0, duration: 0.8 });
  }
}

export function init(root) {
  const els = $$('[data-pm-reveal]', root);
  if (!els.length) return () => {};
  if (reducedMotion()) {
    els.forEach(show);
    return () => {};
  }

  let ctx, splits = [], cancelled = false;
  const hero = els.filter((el) => el.dataset.pmRevealAfter === 'field');
  const rest = els.filter((el) => !hero.includes(el));

  loadGsap('SplitText', 'ScrollTrigger')
    .then(async (gsap) => {
      await document.fonts?.ready; // split lines with the real font metrics
      if (cancelled) return;
      ctx = gsap.context(() => {});
      ctx.add(() => {
        rest.forEach((el) => animate(gsap, el, splits, { trigger: el, start: 'top 88%', once: true }));
      });
      for (const el of hero) {
        await afterField();
        if (cancelled) return;
        ctx.add(() => animate(gsap, el, splits));
      }
    })
    .catch((err) => {
      console.warn(err);
      els.forEach(show);
    });

  return () => {
    cancelled = true;
    ctx?.revert();
    splits.forEach((s) => s.revert());
  };
}
