// data-pm-price-builder: the +/− price builder. Items come from the Price items
// CMS list; everything reads from the markup, so the owner edits prices in the CMS.
//
// On each item ([data-pm-price-item]), from child hooks or root data-* overrides:
//   name   [data-pm-price-name]            or data-pm-name
//   price  [data-pm-price-value]           or data-pm-price
//   max    [data-pm-price-max] (optional)  or data-pm-price-max
//   from   [data-pm-price-from] present and visible, or data-pm-from="true"
//   type   [data-pm-price-type] "Toggle" | "Quantity", or data-pm-type
//   group  data-pm-price-group on the item or a parent: "base" | "addon" | "monthly"
// Controls: [data-pm-price-toggle] (or the item itself when it is a link/button),
//   [data-pm-price-dec] [data-pm-price-inc] [data-pm-price-qty] for quantities.
// Outputs inside the builder: [data-pm-price-total] [data-pm-price-monthly]
//   [data-pm-price-summary] (a list). [data-pm-price-field] (a textarea anywhere
//   on the page) mirrors the quote until the visitor edits it, and
//   [data-pm-price-send] moves to that field's form.
// Base items act like radios (one at a time); [data-pm-price-default] starts selected.
import { reducedMotion } from '../utils/env.js';
import { loadGsap } from '../utils/gsap.js';
import { track } from '../utils/analytics.js';
import { getLenis } from '../core/lenis.js';
import { $$ } from '../utils/dom.js';

const money = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });
const fmt = (n) => money.format(n).replace('A$', '$');
const num = (s) => parseFloat(String(s ?? '').replace(/[^0-9.]/g, '')) || 0;
const hidden = (el) => !el || el.classList.contains('w-condition-invisible') || el.hidden;

function read(el) {
  const q = (sel) => el.querySelector(sel);
  const ds = el.dataset;
  const maxEl = q('[data-pm-price-max]');
  const group = ds.pmPriceGroup || el.closest('[data-pm-price-group]')?.dataset.pmPriceGroup || 'addon';
  const type = (ds.pmType || q('[data-pm-price-type]')?.textContent || 'toggle').trim().toLowerCase();
  return {
    el,
    key: ds.pmName || q('[data-pm-price-name]')?.textContent.trim() || el.textContent.trim(),
    name: ds.pmName || q('[data-pm-price-name]')?.textContent.trim() || el.textContent.trim(),
    price: num(ds.pmPrice ?? q('[data-pm-price-value]')?.textContent),
    max: num(ds.pmPriceMax ?? (hidden(maxEl) ? '' : maxEl?.textContent)),
    from: ds.pmFrom === 'true' || !hidden(q('[data-pm-price-from]')),
    group,
    quantity: type.startsWith('q'),
    qty: 0,
  };
}

function setup(root, gsap, Flip) {
  const items = $$('[data-pm-price-item]', root).map(read);
  if (!items.length) return () => {};
  const totals = $$('[data-pm-price-total]', root);
  const monthlies = $$('[data-pm-price-monthly]', root);
  const summary = root.querySelector('[data-pm-price-summary]');
  const sends = $$('[data-pm-price-send]', root);
  const field = document.querySelector('[data-pm-price-field]');
  const motion = !reducedMotion() && !!gsap;
  const offs = [];
  const on = (el, type, fn) => { el.addEventListener(type, fn); offs.push(() => el.removeEventListener(type, fn)); };

  const bases = items.filter((i) => i.group === 'base');
  const start = bases.find((i) => 'pmPriceDefault' in i.el.dataset) || bases[0];
  items.forEach((i) => (i.qty = i === start || 'pmPriceDefault' in i.el.dataset ? 1 : 0));

  // Show the right control for each item and format the printed prices.
  items.forEach((i) => {
    const toggle = i.el.querySelector('[data-pm-price-toggle]');
    const stepper = i.el.querySelector('[data-pm-price-dec]')?.parentElement;
    // inline display beats the class's display (the hidden attribute doesn't)
    if (i.quantity && toggle && stepper) toggle.style.display = 'none';
    if (!i.quantity && stepper && stepper !== i.el) stepper.style.display = 'none';
    $$('[data-pm-price-value], [data-pm-price-max]', i.el).forEach((el) => {
      if (!el.dataset.pmFormatted) { el.textContent = fmt(num(el.textContent)).replace('$', ''); el.dataset.pmFormatted = ''; }
    });
  });

  const totalFor = () => {
    const once = items.filter((i) => i.group !== 'monthly' && i.qty);
    const lo = once.reduce((s, i) => s + i.price * i.qty, 0);
    const hi = once.reduce((s, i) => s + (i.max || i.price) * i.qty, 0);
    const from = once.some((i) => i.from);
    const monthly = items.filter((i) => i.group === 'monthly' && i.qty).reduce((s, i) => s + i.price * i.qty, 0);
    return { lo, hi, from, monthly };
  };

  const shown = { lo: 0, hi: 0 };
  let tween;
  const paint = (t) => {
    const text = (t.from ? 'from ' : '') + fmt(Math.round(shown.lo)) + (t.hi > t.lo ? `–${fmt(Math.round(shown.hi))}` : '');
    totals.forEach((el) => (el.textContent = text));
  };

  const lines = () => items.filter((i) => i.qty).map((i) => {
    const label = i.quantity && i.qty > 1 ? `${i.name} × ${i.qty}` : i.name;
    const each = i.price * i.qty;
    const price = (i.from ? 'from ' : '') + fmt(each) + (i.max ? `–${fmt(i.max * i.qty)}` : '') + (i.group === 'monthly' ? '/mo' : '');
    return { key: i.key, mark: i.group === 'base' ? '±' : '+', label, price };
  });

  let flip, enter;
  const renderSummary = () => {
    if (!summary) return;
    flip?.progress(1).kill(); // finish the last move before measuring again
    enter?.progress(1).kill();
    const state = Flip && motion ? Flip.getState(summary.children) : null;
    const existing = new Map([...summary.children].map((li) => [li.dataset.key, li]));
    const next = lines();
    const entered = [];
    next.forEach((l) => {
      let li = existing.get(l.key);
      if (!li) {
        li = document.createElement('li');
        li.className = 'builder_line';
        li.dataset.key = l.key;
        li.innerHTML = '<span class="builder_line-mark" aria-hidden="true"></span><span class="builder_line-label"></span><span class="builder_line-price"></span>';
        entered.push(li);
      }
      li.children[0].textContent = l.mark;
      li.children[1].textContent = l.label;
      li.children[2].textContent = l.price;
      summary.appendChild(li); // appending keeps the order of `next`
      existing.delete(l.key);
    });
    existing.forEach((li) => li.remove());
    if (state) {
      flip = Flip.from(state, { duration: 0.45, ease: 'power3.inOut' });
      if (entered.length) enter = gsap.fromTo(entered, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' });
    }
  };

  const update = (first = false) => {
    const t = totalFor();
    items.forEach((i) => {
      const active = i.qty > 0;
      i.el.classList.toggle('is-selected', active);
      const toggle = i.el.querySelector('[data-pm-price-toggle]') || (i.el.matches('a, button') ? i.el : null);
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(active));
        const mark = toggle.querySelector('[data-pm-price-mark]');
        if (mark) mark.textContent = active ? '−' : '+';
        else if (i.group !== 'base' && toggle !== i.el) toggle.textContent = active ? '−' : '+';
        toggle.classList.toggle('is-on', active);
      }
      const qty = i.el.querySelector('[data-pm-price-qty]');
      if (qty) qty.textContent = i.qty;
      const dec = i.el.querySelector('[data-pm-price-dec]');
      if (dec) dec.setAttribute('aria-disabled', String(i.qty === 0));
    });
    monthlies.forEach((el) => (el.textContent = t.monthly ? `+ ${fmt(t.monthly)}/mo` : ''));
    renderSummary();
    if (field && !('pmEdited' in field.dataset)) field.value = quoteText();
    tween?.kill();
    if (first || !motion) { shown.lo = t.lo; shown.hi = t.hi; paint(t); return; }
    tween = gsap.to(shown, { lo: t.lo, hi: t.hi, duration: 0.6, ease: 'power3.out', onUpdate: () => paint(t) });
  };

  const change = (i, action) => {
    update();
    track('price_builder_change', { item: i.name, action, quantity: i.qty, value: totalFor().lo, currency: 'AUD' });
  };

  items.forEach((i) => {
    const control = i.el.querySelector('[data-pm-price-toggle]') || (i.el.matches('a, button') ? i.el : null);
    if (control) {
      if (control.tagName === 'A') { control.setAttribute('role', 'button'); control.removeAttribute('href'); control.tabIndex = 0; }
      const press = (e) => {
        e.preventDefault();
        if (i.group === 'base') {
          if (i.qty) return; // a package is always selected
          bases.forEach((b) => (b.qty = 0));
          i.qty = 1;
          change(i, 'select');
        } else {
          i.qty = i.qty ? 0 : 1;
          change(i, i.qty ? 'add' : 'remove');
        }
      };
      on(control, 'click', press);
      if (control.tagName === 'A') on(control, 'keydown', (e) => (e.key === ' ' || e.key === 'Enter') && press(e));
    }
    const dec = i.el.querySelector('[data-pm-price-dec]');
    const inc = i.el.querySelector('[data-pm-price-inc]');
    if (dec) on(dec, 'click', (e) => { e.preventDefault(); if (i.qty) { i.qty -= 1; change(i, 'remove'); } });
    if (inc) on(inc, 'click', (e) => { e.preventDefault(); if (i.qty < 50) { i.qty += 1; change(i, 'add'); } });
  });

  const quoteText = () => {
    const t = totalFor();
    return lines().map((l) => `${l.mark} ${l.label}: ${l.price}`).join('\n') +
      `\nEstimate: ${t.from ? 'from ' : ''}${fmt(t.lo)}${t.hi > t.lo ? `–${fmt(t.hi)}` : ''} ex GST` +
      (t.monthly ? ` + ${fmt(t.monthly)}/mo` : '');
  };
  if (field) on(field, 'input', () => (field.dataset.pmEdited = ''));

  sends.forEach((send) => on(send, 'click', (e) => {
    track('price_builder_quote', { value: totalFor().lo, currency: 'AUD' });
    if (!field) return; // the button's own link (e.g. to /contact) takes over
    e.preventDefault();
    if (!('pmEdited' in field.dataset)) field.value = quoteText();
    const form = field.closest('form');
    const target = form?.closest('section') || form;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -80 });
    else target?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
    const first = form?.querySelector('input:not([type="hidden"]):not([readonly])');
    setTimeout(() => first?.focus({ preventScroll: true }), motion ? 900 : 0);
  }));

  update(true);
  return () => offs.forEach((off) => off());
}

export function init(root) {
  const builders = $$('[data-pm-price-builder]', root);
  if (!builders.length) return () => {};
  let destroyers = [], cancelled = false;
  const go = (gsap, Flip) => { if (!cancelled) destroyers = builders.map((b) => setup(b, gsap, Flip)); };
  if (reducedMotion()) go(null, null);
  else loadGsap('Flip').then((gsap) => go(gsap, window.Flip)).catch((err) => { console.warn(err); go(null, null); });
  return () => { cancelled = true; destroyers.forEach((d) => d()); };
}
