// PlusMinus Studios: boot.
// Every module exports init(root) and returns destroy(). Modules only start
// when their data-pm-* hook is on the page; content stays in the Webflow DOM.
import { inWebflowEditor, reducedMotion } from './utils/env.js';
import * as clock from './modules/clock.js';
import * as field from './modules/pm-field.js';
import * as reveal from './modules/reveal.js';
import * as workGallery from './modules/work-gallery.js';
import * as marquee from './modules/marquee.js';
import * as lenis from './core/lenis.js';
import * as cursor from './core/cursor.js';

const MODULES = [lenis, cursor, clock, field, reveal, marquee, workGallery];
// Still to come: loader + transitions (core, with the page transitions milestone);
// subtraction (waits for the owner's mockup), price-builder (modules).

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
