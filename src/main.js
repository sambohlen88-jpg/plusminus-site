// PlusMinus Studios: boot.
// Every module exports init(root) and returns destroy(). Modules only start
// when their data-pm-* hook is on the page; content stays in the Webflow DOM.
import { inWebflowEditor, reducedMotion } from './utils/env.js';
import * as clock from './modules/clock.js';
import * as field from './modules/pm-field.js';
import * as reveal from './modules/reveal.js';

const MODULES = [clock, field, reveal];
// Added per milestone: lenis, cursor, loader, transitions (core);
// marquee, subtraction, work-gallery, price-builder (modules).

let destroyers = [];

export function mount(root = document) {
  destroyers = MODULES.map((m) => m.init(root));
}

export function unmount() {
  destroyers.forEach((d) => d && d());
  destroyers = [];
}

function boot() {
  if (inWebflowEditor()) return;
  document.documentElement.classList.add('pm-js');
  if (reducedMotion()) document.documentElement.classList.add('pm-reduced-motion');
  mount();
  window.PM = { mount, unmount, version: __PM_VERSION__ };
  console.info(`[pm] v${__PM_VERSION__} booted`);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
