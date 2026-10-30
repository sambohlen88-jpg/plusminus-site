// data-pm-field: canvas grid of + marks (the ± field hero).
//   Near the pointer, marks collapse into − (the vertical arm shrinks), then ease back.
//   data-pm-field-logo="intro" (default): marks converge into the ± logo, then disperse.
//   data-pm-field-logo="hold": the ± logo stays formed as the hero object.
//   data-pm-field-align="center" (default) | "right": where the logo sits on wide screens.
// Fires "pm:field-ready" on document when the headline can reveal.
// Reduced motion: a static grid (logo drawn in place when held). Touch: a slow ambient wave.
import { reducedMotion, isTouch } from '../utils/env.js';

const SPACING = 40;
const RADIUS = 140;
const ARM = 5;
const LINE = 1.25;

// ± in a 9 x 14 dot matrix: plus (arm thickness 3) over a minus bar, 2 rows apart.
const LOGO = (() => {
  const pts = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) if ((c >= 3 && c <= 5) || (r >= 3 && r <= 5)) pts.push([c, r, 0]);
  for (let r = 11; r < 14; r++) for (let c = 0; c < 9; c++) pts.push([c, r, 1]);
  return pts; // [col, row, isMinus]
})();

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

function signalColour() {
  const probe = document.createElement('span');
  probe.className = 'pm-mark';
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c && c !== 'rgba(0, 0, 0, 0)' ? c : '#d4ff3a';
}

function createField(el) {
  const mode = el.dataset.pmFieldLogo || 'intro';
  const align = el.dataset.pmFieldAlign || 'center';
  const still = reducedMotion();
  const touch = isTouch();

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  el.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const base = getComputedStyle(el).color;
  const signal = signalColour();
  const bone = getComputedStyle(document.body).getPropertyValue('--_colour---color--bone').trim() || '#f2f0eb';

  let w = 0, h = 0, n = 0;
  let hx, hy, x, y, t, tt, lx, ly, isLogo, logoMinus, delay, covered;
  let logoScale = 1.6;
  let pointer = { x: -9999, y: -9999, active: false };
  let start = 0, raf = 0, visible = true, readyFired = false;
  let dim = 1; // alpha for non-logo marks
  let soft = false; // touch wave: draw active marks quietly instead of in the signal colour

  function layout() {
    const r = el.getBoundingClientRect();
    w = r.width; h = r.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Grid centred on the field so it lines up with the CSS fallback tile.
    const cols = Math.ceil(w / 2 / SPACING) + 1, rows = Math.ceil(h / 2 / SPACING) + 1;
    const pts = [];
    for (let j = -rows; j <= rows; j++)
      for (let i = -cols; i <= cols; i++) {
        const px = w / 2 + i * SPACING, py = h / 2 + j * SPACING;
        if (px > -ARM && px < w + ARM && py > -ARM && py < h + ARM) pts.push(px, py);
      }
    n = pts.length / 2;
    hx = new Float32Array(n); hy = new Float32Array(n);
    x = new Float32Array(n); y = new Float32Array(n);
    t = new Float32Array(n); tt = new Float32Array(n);
    lx = new Float32Array(n); ly = new Float32Array(n);
    isLogo = new Uint8Array(n); logoMinus = new Uint8Array(n); delay = new Float32Array(n);
    for (let k = 0; k < n; k++) { hx[k] = x[k] = pts[2 * k]; hy[k] = y[k] = pts[2 * k + 1]; }

    // Logo placement: centred, or in the right half on wide screens.
    const wide = w >= 768;
    const vh = Math.min(h, window.innerHeight); // the hero can be taller than the screen on mobile
    const share = mode === 'hold' ? (wide ? 0.62 : 0.34) : 0.5;
    const step = Math.max(10, Math.min(mode === 'hold' ? 34 : 30, (vh * share) / 14));
    logoScale = step / 16;
    const cx = align === 'right' && wide ? w * 0.75 : w / 2;
    const cy = align === 'right' && !wide ? vh * 0.26 : Math.min(h, vh) / 2;
    const ox = cx - (8 * step) / 2, oy = cy - (13 * step) / 2;

    // Random marks fly in from across the field.
    const order = Array.from({ length: n }, (_, k) => k);
    for (let k = n - 1; k > 0; k--) { const r2 = (Math.random() * (k + 1)) | 0; [order[k], order[r2]] = [order[r2], order[k]]; }
    LOGO.forEach(([c, r, minus], i) => {
      const k = order[i % n];
      isLogo[k] = 1; logoMinus[k] = minus;
      lx[k] = ox + c * step; ly[k] = oy + r * step;
      delay[k] = Math.random() * 0.3;
    });

    // Grid marks behind a held logo are hidden so the two don't overlap.
    covered = new Uint8Array(n);
    if (mode === 'hold') {
      const pad = step * 0.6;
      for (let k = 0; k < n; k++)
        if (!isLogo[k] && hx[k] > ox - pad && hx[k] < ox + 8 * step + pad && hy[k] > oy - pad && hy[k] < oy + 13 * step + pad) covered[k] = 1;
    }
  }

  function markPath(path, px, py, s, tk) {
    const a = ARM * s * (1 + 0.4 * tk), b = ARM * s * (1 - tk);
    path.moveTo(px - a, py); path.lineTo(px + a, py);
    if (b > 0.05) { path.moveTo(px, py - b); path.lineTo(px, py + b); }
  }

  // Logo progress p: 0 = home grid, 1 = formed ±.
  function logoProgress(time) {
    if (mode === 'hold') return still ? 1 : clamp01((time - 0.1) / 1.1);
    if (still) return 0;
    if (time < 1.2) return clamp01((time - 0.1) / 1.1);
    if (time < 1.7) return 1;
    return 1 - clamp01((time - 1.7) / 0.9);
  }

  function frame(now) {
    const time = (now - start) / 1000;
    const p = logoProgress(time);
    dim = mode === 'hold' ? 1 - 0.55 * p : 1 - 0.7 * p;

    const readyAt = mode === 'hold' ? 0.6 : 1.6;
    if (!readyFired && (still || time > readyAt)) {
      readyFired = true;
      document.documentElement.dataset.pmFieldReady = '';
      document.dispatchEvent(new CustomEvent('pm:field-ready'));
    }

    const wave = touch && !still;
    soft = wave;
    let moving = !still && (mode === 'intro' ? time < 2.7 : time < 1.3);
    for (let k = 0; k < n; k++) {
      let target = 0;
      if (isLogo[k]) {
        const q = easeInOut(clamp01((p * 1.3 - delay[k]) / 1));
        x[k] = hx[k] + (lx[k] - hx[k]) * q;
        y[k] = hy[k] + (ly[k] - hy[k]) * q;
        if (logoMinus[k]) target = q;
      }
      if (pointer.active) {
        const dx = x[k] - pointer.x, dy = y[k] - pointer.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS) {
          const f = 1 - d / RADIUS;
          target = Math.max(target, f * f * (3 - 2 * f));
          if (mode === 'hold' && isLogo[k] && d > 0.1) {
            const push = 22 * f * f;
            x[k] += (dx / d) * push; y[k] += (dy / d) * push;
          }
        }
      } else if (wave) {
        const s = Math.sin(hx[k] * 0.012 + hy[k] * 0.008 - time * 0.9);
        target = Math.max(target, s > 0.92 ? (s - 0.92) / 0.08 : 0);
      }
      tt[k] = target;
      const diff = target - t[k];
      // Snap on fast, ease off over ~0.6s.
      t[k] += diff * (diff > 0 ? 0.35 : 0.08);
      if (Math.abs(diff) > 0.002) moving = true;
    }

    draw();
    if ((moving || pointer.active || wave) && visible) raf = requestAnimationFrame(frame);
    else raf = 0;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = LINE;
    ctx.lineCap = 'square';
    const plain = new Path2D(), logo = new Path2D(), lit = new Path2D(), quiet = new Path2D();
    const formed = mode === 'hold' || dim < 0.99;
    for (let k = 0; k < n; k++) {
      const tk = t[k];
      if (isLogo[k] && formed) {
        const s = 1 + (logoScale - 1) * (1 - dim) / (mode === 'hold' ? 0.55 : 0.7);
        markPath(tk > 0.5 && !logoMinus[k] ? lit : logo, x[k], y[k], s, tk);
      } else if (!(covered[k] && dim < 0.75)) {
        markPath(tk > 0.5 ? (soft ? quiet : lit) : plain, x[k], y[k], 1 + 0.6 * tk, tk);
      }
    }
    ctx.globalAlpha = dim; ctx.strokeStyle = base; ctx.stroke(plain);
    ctx.globalAlpha = 1; ctx.strokeStyle = bone; ctx.stroke(logo);
    ctx.strokeStyle = signal; ctx.stroke(lit);
    ctx.globalAlpha = 0.4; ctx.strokeStyle = bone; ctx.stroke(quiet); ctx.globalAlpha = 1;
  }

  function kick() { if (!raf && visible && !still) raf = requestAnimationFrame(frame); }

  function onMove(e) {
    if (touch || still) return;
    const r = el.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    pointer.active = pointer.x > -RADIUS && pointer.x < w + RADIUS && pointer.y > -RADIUS && pointer.y < h + RADIUS;
    kick();
  }
  function onLeave() { pointer.active = false; kick(); }

  // Rebuild on real size changes only (the observer also fires once on observe).
  const ro = new ResizeObserver(() => {
    const r = el.getBoundingClientRect();
    if (Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 1) return;
    layout();
    start = performance.now() - 10000; // skip the intro after a resize
    cancelAnimationFrame(raf);
    frame(performance.now());
  });
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick(); });

  layout();
  el.style.backgroundImage = 'none'; // canvas replaces the CSS fallback grid
  start = performance.now();
  frame(start);
  ro.observe(el);
  io.observe(el);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    canvas.remove();
    el.style.backgroundImage = '';
  };
}

export function init(root) {
  const destroyers = [...root.querySelectorAll('[data-pm-field]')].map(createField);
  return () => destroyers.forEach((d) => d());
}
