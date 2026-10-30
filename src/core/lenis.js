// Smooth scroll. Lenis runs on GSAP's ticker so ScrollTrigger stays in sync.
// Off for reduced motion; touch devices keep native scrolling (Lenis default).
import Lenis from 'lenis';
import { reducedMotion } from '../utils/env.js';
import { loadGsap } from '../utils/gsap.js';

const CSS = 'html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}' +
  '.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-stopped{overflow:hidden}';

let lenis = null;
export const getLenis = () => lenis;

export function init() {
  if (reducedMotion()) return () => {};
  let cancelled = false, tick, style;
  loadGsap('ScrollTrigger')
    .then((gsap) => {
      if (cancelled) return;
      style = Object.assign(document.createElement('style'), { textContent: CSS });
      document.head.appendChild(style);
      lenis = new Lenis({ duration: 1.1, anchors: true, autoRaf: false });
      lenis.on('scroll', window.ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    })
    .catch((err) => console.warn(err));

  return () => {
    cancelled = true;
    if (tick) window.gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
    style?.remove();
  };
}
