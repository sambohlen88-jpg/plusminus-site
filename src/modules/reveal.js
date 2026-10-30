// data-pm-reveal="lines" | "fade": text that rises into place.
//   lines: SplitText lines rise from a mask, 0.8s power3.out, 0.08s stagger.
//   fade: the element fades and rises 24px.
//   data-pm-reveal-after="field": wait for the ± field intro ("pm:field-ready").
//   data-pm-reveal-delay="0.2": extra delay in seconds.
// Elements stay visible without JS. The page hides them only while html has .pm-js,
// and reduced motion shows them straight away.
import { reducedMotion } from '../utils/env.js';
import { loadGsap } from '../utils/gsap.js';

const show = (el) => { el.style.visibility = 'visible'; };

function afterField() {
  if ('pmFieldReady' in document.documentElement.dataset) return Promise.resolve();
  return new Promise((resolve) => {
    document.addEventListener('pm:field-ready', resolve, { once: true });
    setTimeout(resolve, 2500); // never hold text hostage to the canvas
  });
}

export function init(root) {
  const els = [...root.querySelectorAll('[data-pm-reveal]')];
  if (!els.length) return () => {};
  if (reducedMotion()) {
    els.forEach(show);
    return () => {};
  }

  let ctx, splits = [], cancelled = false;
  loadGsap()
    .then(async (gsap) => {
      if (cancelled) return;
      ctx = gsap.context(() => {});
      for (const el of els) {
        if (el.dataset.pmRevealAfter === 'field') await afterField();
        if (cancelled) return;
        const delay = parseFloat(el.dataset.pmRevealDelay || '0');
        ctx.add(() => {
          if (el.dataset.pmReveal === 'lines') {
            const split = new window.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'pm-line' });
            splits.push(split);
            show(el);
            gsap.from(split.lines, { yPercent: 110, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay });
          } else {
            gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', delay });
          }
        });
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
