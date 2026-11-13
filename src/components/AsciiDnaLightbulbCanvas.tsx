import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionPreference } from './MotionPreference';
import { useCanvasStage, type CanvasStage } from '../hooks/useCanvasStage';

/*
 * ASCII lightbulb shader.
 *
 * Everything in the figure is evaluated in a local (u, v) frame measured in
 * bulb radii R:  +v runs along the 45° nose axis (screen up-right),
 *                +u runs across it (screen down-right).
 * Screen <-> local:  v = (dx - dy)/√2,  u = (dx + dy)/√2,
 *                    dx = (u + v)/√2,   dy = (u - v)/√2.
 *
 * The background (grid, rings, streamlines, bow shock, glass underpaint) is
 * baked into an offscreen layer on resize; each frame only blits it and
 * shades the ASCII cells, batched into one fillStyle per colour/alpha bucket.
 */

const SQ = Math.SQRT1_2;
const TAU = Math.PI * 2;
const RAMP = ' .·:-=+*#%@';

// Palette (rgb triplets) and quantised alpha levels -> fillStyle buckets.
const RGB = [
  '255,255,255', // 0 white
  '230,236,245', // 1 chrome
  '200,210,224', // 2 silver
  '126,139,155', // 3 titanium
  '37,99,235', //   4 cobalt bright
  '21,56,117', //   5 cobalt mid
  '255,40,0', //    6 red-orange
  '255,68,25', //   7 crimson
  '24,69,139', //   8 turbulent wake
];
const WHITE = 0, CHROME = 1, SILVER = 2, TITANIUM = 3, COBALT = 4, COBALT_MID = 5, ORANGE = 6, CRIMSON = 7, WAKE = 8;
const ALPHAS = [1, 0.78, 0.56, 0.38, 0.22, 0.11];
const STYLES = RGB.flatMap((c) => ALPHAS.map((a) => `rgba(${c},${a})`));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((b) => (b + 0.5) / 16);

const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const glyph = (lum: number) => RAMP[clamp(Math.round(lum * 10), 1, 10)];

// Polynomial smooth min / max (Quilez).
const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

// Pear envelope. The dome sphere alone (r 0.88 at v 0.18) is still 0.49 wide
// where the 0.30 screw base starts, so it is intersected with a concave neck
// profile; the result is one continuous A-shape with a real waist.
const DOME_C = 0.18;
const DOME_R = 0.88;
const neckHW = (v: number) => {
  const t = Math.max(0, v + 0.55);
  return 0.3 + 0.25 * t + 1.3 * t * t;
};
const glassSdf = (u: number, v: number) => {
  const dome = Math.hypot(u, v - DOME_C) - DOME_R;
  const t = Math.max(0, v + 0.55);
  const slope = 0.25 + 2.6 * t;
  const neck = (Math.abs(u) - neckHW(v)) / Math.sqrt(1 + slope * slope);
  const body = smax(dome, neck, 0.12);
  return smax(body, -0.58 - v, 0.04);
};
// Local silhouette half-width: used as the curvature radius for the pseudo-normal.
const halfWidth = (v: number) => {
  const dv = v - DOME_C;
  const sphere = Math.sqrt(Math.max(0, DOME_R * DOME_R - dv * dv));
  return Math.max(0.28, Math.min(sphere, neckHW(v)));
};

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const vnoise = (x: number, y: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
};

// DNA helix constants.
const HELIX_V0 = -0.34; // lead-in wires occupy v ∈ [-0.56, -0.34]
const HELIX_V1 = 0.8;
const HELIX_K = 10; // rad per R  -> ~2 full turns
const HELIX_W = 1.7; // rad / s
const RUNGS_PER_TURN = 4;
const helixAmp = (v: number) =>
  0.28 * (0.3 + 0.7 * smoothstep(HELIX_V0, -0.08, v)) * (1 - 0.25 * smoothstep(0.5, HELIX_V1, v));

// Mach diamonds: standing shocks downstream of the nozzle exit.
const NOZZLE_V = -1.08;
const DIAMOND_PV = [0.15, 0.45, 0.75, 1.05];

interface Rect { l: number; t: number; r: number; b: number }
interface Streamline { xs: Float32Array; ys: Float32Array; tc: Float32Array; total: number; inner: boolean }
interface Spring { x: number; v: number }

interface HeroState {
  w: number; h: number; dpr: number; version: number;
  /** Embedded: the bulb alone, centred, transparent (Syntinuum). */
  embedded: boolean;
  cx: number; cy: number; R: number; ox: number; oy: number;
  cellW: number; cellH: number; mobile: boolean;
  rects: Rect[]; pad: number;
  layer: HTMLCanvasElement | null;
  lines: Streamline[];
  mouse: { x: number; y: number; active: boolean };
  lightU: Spring; lightV: Spring; marker: Spring;
  bx: number[][]; by: number[][]; bc: string[][];
}

const createState = (): HeroState => ({
  w: 0, h: 0, dpr: 0, version: -1, embedded: false,
  cx: 0, cy: 0, R: 1, ox: 0, oy: 0, cellW: 8, cellH: 10, mobile: false,
  rects: [], pad: 24, layer: null, lines: [],
  mouse: { x: 0, y: 0, active: false },
  lightU: { x: -0.86, v: 0 }, lightV: { x: 0.42, v: 0 }, marker: { x: -1, v: 0 },
  bx: STYLES.map(() => []), by: STYLES.map(() => []), bc: STYLES.map(() => []),
});

const toScreen = (s: HeroState, u: number, v: number): [number, number] => [
  s.cx + s.R * (u + v) * SQ,
  s.cy + s.R * (u - v) * SQ,
];

const springTo = (s: Spring, target: number, omega: number, dt: number) => {
  // Critically damped spring, semi-implicit Euler.
  const a = omega * omega * (target - s.x) - 2 * omega * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};

function protectAt(s: HeroState, x: number, y: number) {
  let m = Infinity;
  for (const r of s.rects) {
    const dx = Math.max(r.l - x, 0, x - r.r);
    const dy = Math.max(r.t - y, 0, y - r.b);
    const d = dx * dx + dy * dy;
    if (d < m) m = d;
  }
  return m === Infinity ? 1 : smoothstep(0, s.pad, Math.sqrt(m));
}

function layout(s: HeroState, canvas: HTMLCanvasElement, w: number, h: number) {
  const mobile = w < 768;
  const tablet = !mobile && w < 1024;
  const m = Math.min(w, h);
  s.mobile = mobile;
  if (s.embedded) {
    // Figure spans about 3R on each axis once the plume is dropped.
    s.R = m / 3.1;
    s.cx = w / 2;
    s.cy = h / 2;
  } else if (mobile) {
    s.R = m * 0.17;
    s.cx = w * 0.7;
    s.cy = Math.max(h * 0.16, s.R * 1.9);
  } else if (tablet) {
    s.R = m * 0.19;
    s.cx = w * 0.74;
    s.cy = h * 0.36;
  } else {
    s.R = m * 0.21;
    s.cx = w * 0.71;
    s.cy = h * 0.38;
  }
  // Launch origin sits on the 45° axis, at 80% height, so corridor -> plume -> bulb read as one line.
  s.oy = h * 0.8;
  s.ox = s.cx - (s.oy - s.cy);
  s.cellH = clamp(Math.round(s.R / 19), 6, 12);
  s.cellW = Math.max(5, Math.round(s.cellH * 0.8));
  s.pad = Math.max(20, s.cellH * 2.5);

  const box = canvas.getBoundingClientRect();
  const root = s.embedded ? null : canvas.closest('section');
  s.rects = [];
  root?.querySelectorAll('[data-hero-protect]').forEach((el) => {
    for (const r of Array.from(el.getClientRects())) {
      if (r.width < 1 || r.height < 1) continue;
      s.rects.push({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top });
    }
  });
  // Bridge the leading between stacked lines so nothing renders in the gaps of the copy block.
  const n = s.rects.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const a = s.rects[i], b = s.rects[j];
      const gap = b.t - a.b;
      const l = Math.max(a.l, b.l), r = Math.min(a.r, b.r);
      if (gap > 0 && gap < 56 && r > l) s.rects.push({ l, t: a.b, r, b: b.t });
    }
  }
}

function buildStreamlines(s: HeroState, w: number, h: number) {
  // Potential flow past a cylinder (radius A, centred on the bulb) with the
  // free stream running down the -v axis. Streamfunction ψ = y(1 - A²/r²):
  // each line keeps ψ = y0, solved for y by bisection at every station x.
  const A = 1.3;
  const VC = 0.2;
  const diag = Math.hypot(w, h) / s.R + 2;
  const lines: Streamline[] = [];
  const N = 150;
  const PER_SIDE = 12;
  for (let i = 0; i < PER_SIDE * 2; i++) {
    const side = i < PER_SIDE ? -1 : 1;
    const j = i % PER_SIDE;
    const y0 = 0.16 + Math.pow(j / (PER_SIDE - 1), 1.5) * diag;
    const xs = new Float32Array(N), ys = new Float32Array(N), tc = new Float32Array(N);
    let total = 0;
    for (let n = 0; n < N; n++) {
      const tau = (n / (N - 1)) * 2 - 1;
      const x = Math.sign(tau) * Math.pow(Math.abs(tau), 1.7) * diag; // downstream coordinate
      let lo = y0, hi = y0 + A;
      for (let it = 0; it < 28; it++) {
        const mid = (lo + hi) * 0.5;
        const g = mid - (A * A * mid) / (x * x + mid * mid) - y0;
        if (g > 0) hi = mid; else lo = mid;
      }
      const y = (lo + hi) * 0.5;
      // flow coords -> local: v = VC - x, u = side*y
      const [px, py] = toScreen(s, side * y, VC - x);
      xs[n] = px; ys[n] = py;
      // |W|/U = |1 - A²/z²|: particles speed up over the shoulders.
      const zr = x * x - y * y, zi = 2 * x * y, z2 = zr * zr + zi * zi;
      const sp = Math.hypot(1 - (A * A * zr) / z2, (A * A * zi) / z2);
      if (n > 0) total += Math.hypot(px - xs[n - 1], py - ys[n - 1]) / (Math.max(0.25, sp) * s.R * 0.55);
      tc[n] = total;
    }
    lines.push({ xs, ys, tc, total, inner: j < 3 });
  }
  s.lines = lines;
}

function buildLayer(s: HeroState, w: number, h: number, dpr: number) {
  const layer = s.layer ?? document.createElement('canvas');
  layer.width = Math.max(1, Math.floor(w * dpr));
  layer.height = Math.max(1, Math.floor(h * dpr));
  const g = layer.getContext('2d');
  s.layer = layer;
  if (!g) return;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  const { cx, cy, R } = s;

  // Ambient wells.
  const halo = g.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 3.2);
  halo.addColorStop(0, 'rgba(37,99,235,0.15)');
  halo.addColorStop(0.4, 'rgba(21,56,117,0.08)');
  halo.addColorStop(1, 'rgba(11,30,64,0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, w, h);
  const well = g.createRadialGradient(s.ox, s.oy, 0, s.ox, s.oy, R * 1.6);
  well.addColorStop(0, 'rgba(255,40,0,0.10)');
  well.addColorStop(1, 'rgba(255,40,0,0)');
  g.fillStyle = well;
  g.fillRect(0, 0, w, h);

  // 40px blueprint grid + 160px crosshairs.
  g.beginPath();
  for (let x = 40; x < w; x += 40) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); }
  for (let y = 40; y < h; y += 40) { g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); }
  g.strokeStyle = 'rgba(37,99,235,0.045)';
  g.lineWidth = 1;
  g.stroke();
  g.beginPath();
  for (let x = 160; x < w; x += 160) {
    for (let y = 160; y < h; y += 160) {
      g.moveTo(x - 5, y + 0.5); g.lineTo(x + 6, y + 0.5);
      g.moveTo(x + 0.5, y - 5); g.lineTo(x + 0.5, y + 6);
    }
  }
  g.strokeStyle = 'rgba(200,210,224,0.16)';
  g.stroke();

  // Orbital rings with a 5°/15° protractor on the 2.0R ring.
  [0.8, 1.35, 2.0, 2.9].forEach((k, i) => {
    g.beginPath();
    g.arc(cx, cy, k * R, 0, TAU);
    g.strokeStyle = i % 2 ? 'rgba(200,210,224,0.10)' : 'rgba(37,99,235,0.20)';
    g.lineWidth = 1;
    g.stroke();
  });
  const tickR = 2.0 * R;
  for (let deg = 0; deg < 360; deg += 5) {
    const a = (deg * Math.PI) / 180;
    const major = deg % 15 === 0;
    const len = major ? Math.max(6, R * 0.045) : Math.max(3, R * 0.02);
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * (tickR - len), cy + Math.sin(a) * (tickR - len));
    g.lineTo(cx + Math.cos(a) * tickR, cy + Math.sin(a) * tickR);
    g.strokeStyle = major ? 'rgba(255,40,0,0.38)' : 'rgba(200,210,224,0.18)';
    g.lineWidth = major ? 1.1 : 0.8;
    g.stroke();
  }

  // Launch corridor: two rails at u = ±0.62 from the origin reticle up to the nozzle, with stations.
  const vOrigin = -Math.SQRT2 * (s.oy - s.cy) / R;
  const vEnd = NOZZLE_V - 0.05;
  [-0.62, 0.62].forEach((ru) => {
    const [x1, y1] = toScreen(s, ru, vOrigin - 0.4);
    const [x2, y2] = toScreen(s, ru, vEnd);
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.strokeStyle = 'rgba(37,99,235,0.20)';
    g.lineWidth = 1;
    g.stroke();
    g.beginPath();
    for (let v = vEnd; v > vOrigin - 0.4; v -= 0.25) {
      const [ax, ay] = toScreen(s, ru - 0.035, v);
      const [bx, by] = toScreen(s, ru + 0.035, v);
      g.moveTo(ax, ay);
      g.lineTo(bx, by);
    }
    g.strokeStyle = 'rgba(200,210,224,0.24)';
    g.lineWidth = 0.8;
    g.stroke();
  });
  {
    const [x1, y1] = toScreen(s, 0, vOrigin - 0.6);
    const [x2, y2] = toScreen(s, 0, vEnd);
    g.setLineDash([6, 6]);
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.strokeStyle = 'rgba(255,40,0,0.28)';
    g.stroke();
    g.setLineDash([]);
  }
  const r1 = Math.max(16, R * 0.12), r2 = Math.max(32, R * 0.26);
  g.beginPath(); g.arc(s.ox, s.oy, r1, 0, TAU);
  g.strokeStyle = 'rgba(37,99,235,0.38)'; g.lineWidth = 1; g.stroke();
  g.beginPath(); g.arc(s.ox, s.oy, r2, 0, TAU);
  g.strokeStyle = 'rgba(200,210,224,0.18)'; g.lineWidth = 0.8; g.stroke();
  g.beginPath(); g.arc(s.ox, s.oy, (r1 + r2) / 2, -Math.PI / 4, 0);
  g.strokeStyle = 'rgba(255,40,0,0.5)'; g.lineWidth = 1.2; g.stroke();
  g.beginPath();
  g.moveTo(s.ox - r2 - 6, s.oy + 0.5); g.lineTo(s.ox - r1 + 4, s.oy + 0.5);
  g.moveTo(s.ox + r1 - 4, s.oy + 0.5); g.lineTo(s.ox + r2 + 6, s.oy + 0.5);
  g.moveTo(s.ox + 0.5, s.oy - r2 - 6); g.lineTo(s.ox + 0.5, s.oy - r1 + 4);
  g.moveTo(s.ox + 0.5, s.oy + r1 - 4); g.lineTo(s.ox + 0.5, s.oy + r2 + 6);
  g.strokeStyle = 'rgba(200,210,224,0.28)'; g.lineWidth = 1; g.stroke();

  // Elevation ruler at x = 24 (desktop/tablet only; the column gutter is 24px on phones).
  if (!s.mobile) {
    g.beginPath();
    g.moveTo(24.5, 40); g.lineTo(24.5, h - 40);
    g.strokeStyle = 'rgba(200,210,224,0.15)'; g.lineWidth = 1; g.stroke();
    for (let y = 50; y < h - 40; y += 20) {
      const major = (y - 50) % 100 === 0;
      g.beginPath();
      g.moveTo(24, y + 0.5); g.lineTo(24 + (major ? 10 : 4), y + 0.5);
      g.strokeStyle = major ? 'rgba(255,40,0,0.38)' : 'rgba(200,210,224,0.18)';
      g.lineWidth = 0.8; g.stroke();
    }
  }

  // Streamlines.
  buildStreamlines(s, w, h);
  for (const ln of s.lines) {
    g.beginPath();
    g.moveTo(ln.xs[0], ln.ys[0]);
    for (let n = 1; n < ln.xs.length; n++) g.lineTo(ln.xs[n], ln.ys[n]);
    g.strokeStyle = ln.inner ? 'rgba(37,99,235,0.22)' : 'rgba(200,210,224,0.07)';
    g.lineWidth = ln.inner ? 1 : 0.8;
    g.stroke();
  }

  // Double-parabolic bow shock ahead of the nose: v = va - u²/(2ρ), alpha fading along the wings.
  const shocks = [
    { va: 1.36, rho: 0.8, rgb: '37,99,235', a: 0.8, lw: 1.6 },
    { va: 1.5, rho: 0.95, rgb: '230,236,245', a: 0.5, lw: 1 },
  ];
  for (const sh of shocks) {
    for (const pass of [0, 1]) {
      let prev: [number, number] | null = null;
      for (let i = -60; i <= 60; i++) {
        const u = (i / 60) * 2.5;
        const p = toScreen(s, u, sh.va - (u * u) / (2 * sh.rho));
        if (prev) {
          const fade = 1 - Math.pow(Math.abs(u) / 2.5, 1.6);
          g.beginPath();
          g.moveTo(prev[0], prev[1]);
          g.lineTo(p[0], p[1]);
          g.strokeStyle = `rgba(${sh.rgb},${(pass ? sh.a : sh.a * 0.18) * fade})`;
          g.lineWidth = pass ? sh.lw : sh.lw * 5;
          g.stroke();
        }
        prev = p;
      }
    }
  }

  // Glass + base underpaint: a per-pixel pass of the same SDF, so the bulb is
  // a dark, cobalt-tinted volume rather than an outline over the rings.
  {
    const ext = 1.6 * R;
    const [ncx, ncy] = toScreen(s, 0, -0.05);
    const x0 = Math.floor(ncx - ext), y0 = Math.floor(ncy - ext);
    const size = Math.ceil(ext * 2);
    const scale = size > 520 ? 0.5 : 1;
    const ps = Math.max(1, Math.round(size * scale));
    const off = document.createElement('canvas');
    off.width = ps; off.height = ps;
    const og = off.getContext('2d');
    if (og) {
      const img = og.createImageData(ps, ps);
      const data = img.data;
      for (let j = 0; j < ps; j++) {
        for (let i = 0; i < ps; i++) {
          const dx = (x0 + (i + 0.5) / scale - cx) / R;
          const dy = (y0 + (j + 0.5) / scale - cy) / R;
          const v = (dx - dy) * SQ, u = (dx + dy) * SQ;
          let r = 0, gg = 0, b = 0, a = 0;
          if (v >= -1.02 && v < -0.56 && Math.abs(u) < 0.31) {
            r = 7; gg = 16; b = 34; a = 0.92;
          } else if (v > -0.6) {
            const d = glassSdf(u, v);
            if (d < 0.01) {
              const q = clamp(1 + d / halfWidth(v), 0, 1);
              const fres = Math.pow(1 - Math.sqrt(1 - q * q), 1.6);
              const lit = clamp(0.5 - 0.5 * u, 0, 1);
              r = 5 + 12 * fres; gg = 9 + 40 * fres * (0.6 + 0.4 * lit); b = 18 + 100 * fres;
              a = smoothstep(0.01, -0.01, d) * 0.9;
            }
          }
          const o = (j * ps + i) * 4;
          data[o] = r; data[o + 1] = gg; data[o + 2] = b; data[o + 3] = a * 255;
        }
      }
      og.putImageData(img, 0, 0);
      g.drawImage(off, x0, y0, size, size);
    }
  }

  // Additive glow under the standing Mach diamonds.
  g.globalCompositeOperation = 'lighter';
  DIAMOND_PV.forEach((pv, k) => {
    const [dx, dy] = toScreen(s, 0, NOZZLE_V - pv);
    const rad = R * (0.3 - k * 0.03);
    const gr = g.createRadialGradient(dx, dy, 0, dx, dy, rad);
    gr.addColorStop(0, `rgba(255,120,80,${0.16 - k * 0.03})`);
    gr.addColorStop(0.45, `rgba(255,40,0,${0.08 - k * 0.015})`);
    gr.addColorStop(1, 'rgba(255,40,0,0)');
    g.fillStyle = gr;
    g.fillRect(dx - rad, dy - rad, rad * 2, rad * 2);
  });
  g.globalCompositeOperation = 'source-over';

  // Elliptical text-protection mask behind the copy column.
  if (s.rects.length) {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const rc of s.rects) { l = Math.min(l, rc.l); t = Math.min(t, rc.t); r = Math.max(r, rc.r); b = Math.max(b, rc.b); }
    const ex = (l + r) / 2, ey = (t + b) / 2;
    const rx = (r - l) / 2 + 90, ry = (b - t) / 2 + 70;
    g.save();
    g.translate(ex, ey);
    g.scale(rx / ry, 1);
    const mask = g.createRadialGradient(0, 0, 0, 0, 0, ry);
    mask.addColorStop(0, 'rgba(3,5,10,0.94)');
    mask.addColorStop(0.62, 'rgba(3,5,10,0.82)');
    mask.addColorStop(1, 'rgba(3,5,10,0)');
    g.fillStyle = mask;
    g.fillRect(-ry, -ry, ry * 2, ry * 2);
    g.restore();
  }
}

function lineAt(ln: Streamline, time: number): [number, number] {
  const t = ((time % ln.total) + ln.total) % ln.total;
  let lo = 0, hi = ln.tc.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (ln.tc[mid] < t) lo = mid; else hi = mid;
  }
  const span = ln.tc[hi] - ln.tc[lo] || 1;
  const f = (t - ln.tc[lo]) / span;
  return [ln.xs[lo] + (ln.xs[hi] - ln.xs[lo]) * f, ln.ys[lo] + (ln.ys[hi] - ln.ys[lo]) * f];
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  stage: CanvasStage,
  s: HeroState,
  reduced: boolean,
  version: number,
) {
  const { width: w, height: h, dpr } = stage;
  if (w !== s.w || h !== s.h || dpr !== s.dpr || version !== s.version) {
    layout(s, ctx.canvas, w, h);
    if (s.embedded) { s.layer = null; s.lines = []; } else buildLayer(s, w, h, dpr);
    s.w = w; s.h = h; s.dpr = dpr; s.version = version;
    s.marker.x = s.cy;
  }
  const t = reduced ? 1.15 : stage.time / 1000;
  const dt = Math.min(stage.deltaTime / 1000, 1 / 30);
  const { cx, cy, R, cellW, cellH } = s;

  ctx.clearRect(0, 0, w, h);
  if (s.layer) ctx.drawImage(s.layer, 0, 0, w, h);

  // --- Light follows the cursor through a critically damped spring.
  let tu = -0.86, tv = 0.42;
  if (s.mouse.active && !reduced) {
    const mx = (s.mouse.x - cx) / (R * 3), my = (s.mouse.y - cy) / (R * 3);
    const ml = Math.min(1, Math.hypot(mx, my)) / (Math.hypot(mx, my) || 1);
    tu += 0.5 * (mx + my) * SQ * ml;
    tv += 0.5 * (mx - my) * SQ * ml;
  }
  if (reduced) { s.lightU.x = tu; s.lightV.x = tv; }
  else { springTo(s.lightU, tu, 5, dt); springTo(s.lightV, tv, 5, dt); }
  const pl = Math.hypot(s.lightU.x, s.lightV.x) || 1;
  const Lpu = s.lightU.x / pl, Lpv = s.lightV.x / pl;
  const ln = Math.hypot(Lpu, Lpv, 0.95);
  const Lu = Lpu / ln, Lv = Lpv / ln, Lz = 0.95 / ln;
  const hn = Math.hypot(Lu, Lv, Lz + 1);
  const Hu = Lu / hn, Hv = Lv / hn, Hz = (Lz + 1) / hn;
  const ribbonAng = Math.atan2(Lpv, -Lpu);

  // --- Streamline particles (comets), timed by the local flow speed.
  if (!reduced && !s.embedded) {
    ctx.lineCap = 'round';
    for (const pass of [0, 1]) {
      ctx.beginPath();
      s.lines.forEach((line, i) => {
        if (line.inner !== (pass === 1)) return;
        for (let k = 0; k < 2; k++) {
          const tt = t * 1.0 + line.total * ((i * 0.37 + k * 0.5) % 1);
          const [hx, hy] = lineAt(line, tt);
          if (hx < -20 || hy < -20 || hx > w + 20 || hy > h + 20) continue;
          if (protectAt(s, hx, hy) < 0.6) continue;
          const [qx, qy] = lineAt(line, tt - 0.22);
          ctx.moveTo(qx, qy);
          ctx.lineTo(hx, hy);
        }
      });
      ctx.strokeStyle = pass ? 'rgba(96,140,245,0.55)' : 'rgba(230,236,245,0.28)';
      ctx.lineWidth = pass ? 1.4 : 1;
      ctx.stroke();
    }
  }

  // --- Cursor-tracking diamond on the elevation ruler.
  if (!s.mobile && !s.embedded) {
    const target = s.mouse.active ? clamp(s.mouse.y, 50, h - 50) : cy;
    if (reduced) s.marker.x = target; else springTo(s.marker, target, 9, dt);
    const my = clamp(s.marker.x, 50, h - 50);
    ctx.beginPath();
    ctx.moveTo(24.5, my - 5); ctx.lineTo(30.5, my); ctx.lineTo(24.5, my + 5); ctx.lineTo(18.5, my);
    ctx.closePath();
    ctx.fillStyle = '#FF2800';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(34, my + 0.5); ctx.lineTo(46, my + 0.5);
    ctx.strokeStyle = 'rgba(255,40,0,0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // --- ASCII cells.
  const { bx, by, bc } = s;
  for (let i = 0; i < bx.length; i++) { bx[i].length = 0; by[i].length = 0; bc[i].length = 0; }
  let prot = 1;
  let ccx = 0, ccy = 0;
  const emit = (ch: string, color: number, alpha: number) => {
    const a = alpha * prot;
    if (a < 0.07) return;
    const lvl = a > 0.89 ? 0 : a > 0.67 ? 1 : a > 0.47 ? 2 : a > 0.3 ? 3 : a > 0.16 ? 4 : 5;
    const k = color * 6 + lvl;
    bx[k].push(ccx); by[k].push(ccy); bc[k].push(ch);
  };

  const invR = 1 / R;
  const cellDiag = Math.hypot(cellW, cellH) * invR;
  const hs = Math.max(0.045, 0.62 * cellDiag); // strand half-thickness: always ≥ one cell diagonal wide
  const hr = Math.max(0.022, 0.4 * cellDiag); // rung half-thickness
  const hwire = Math.max(0.02, 0.38 * cellDiag);
  const rungStep = TAU / RUNGS_PER_TURN;
  const helixU0 = helixAmp(HELIX_V0) * Math.sin(HELIX_K * HELIX_V0 - HELIX_W * t);
  const wires: [number, number, number, number][] = [
    [-0.075, -0.57, helixU0, HELIX_V0],
    [0.075, -0.57, -helixU0, HELIX_V0],
  ];
  const ext = 2.75 * R;
  const [fcx, fcy] = toScreen(s, 0, -0.8);
  const x0 = Math.floor((fcx - ext) / cellW) * cellW + cellW / 2;
  const y0 = Math.floor((fcy - ext) / cellH) * cellH + cellH / 2;
  const x1 = fcx + ext, y1 = fcy + ext;

  for (let py = y0, row = Math.round(y0 / cellH); py <= y1; py += cellH, row++) {
    if (py < -cellH || py > h + cellH) continue;
    for (let px = x0, col = Math.round(x0 / cellW); px <= x1; px += cellW, col++) {
      if (px < -cellW || px > w + cellW) continue;
      const dx = (px - cx) * invR, dy = (py - cy) * invR;
      const v = (dx - dy) * SQ, u = (dx + dy) * SQ;
      if (v < -2.8 || v > 1.12 || u < -1.0 || u > 1.0) continue;
      prot = protectAt(s, px, py);
      if (prot < 0.07) continue;
      ccx = px; ccy = py;
      const au = Math.abs(u);

      // ---- Exhaust plume with 4 standing Mach diamonds.
      if (v < NOZZLE_V) {
        if (s.embedded) continue;
        const pv = NOZZLE_V - v;
        const barrel = 0.15 + 0.035 * Math.abs(Math.sin((Math.PI * pv) / 0.3)) + Math.max(0, pv - 1.2) * 0.6;
        if (au > barrel + 0.07) continue;
        const n = vnoise(u * 9 + 3.1, pv * 6 - t * 7);
        let heat = 0.5 * Math.exp(-2.2 * (au / barrel) ** 2) * Math.max(0, 1 - pv / 1.7);
        for (let k = 0; k < 4; k++) {
          const m = Math.abs(pv - DIAMOND_PV[k]) / 0.11 + au / (0.13 - k * 0.015);
          if (m < 1) heat = Math.max(heat, 0.18 + (1 - 0.17 * k) * Math.pow(1 - m, 0.7));
        }
        const wake = smoothstep(0.95, 1.6, pv);
        heat += (n - 0.5) * (0.18 + 0.35 * wake);
        if (au > barrel) heat *= 1 - (au - barrel) / 0.07;
        if (heat < 0.08 + 0.12 * wake) continue;
        if (wake > 0.55 || heat < 0.22) emit(n > 0.6 ? '~' : glyph(heat * 0.8), WAKE, 0.4 + heat * (1 - 0.5 * wake));
        else if (heat > 0.72) emit(glyph(heat), WHITE, 1);
        else if (heat > 0.42) emit(glyph(heat), ORANGE, 0.95);
        else emit(glyph(heat), CRIMSON, 0.6 + heat * 0.6);
        continue;
      }

      // ---- Contact nub and dark cobalt collar.
      if (v < -1.02) {
        if (au < 0.12) emit(u < 0 ? '@' : '#', u < 0 ? SILVER : TITANIUM, 0.9);
        continue;
      }
      if (v < -0.92) {
        const hw = 0.24 + (v + 1.02) * 0.5;
        if (au <= hw) {
          const lit = clamp(0.5 - 0.6 * (u / hw), 0, 1);
          emit(lit > 0.6 ? '#' : '=', lit > 0.75 ? COBALT : COBALT_MID, 0.55 + 0.45 * lit);
        }
        continue;
      }

      // ---- Edison screw: 4 helical threads on a lit cylinder.
      if (v < -0.55) {
        const phase = TAU * 4 * ((v + 0.92) / 0.37) + u * 2.2;
        const ridge = Math.sin(phase);
        const hw = 0.285 + 0.028 * ridge;
        if (au <= hw) {
          const nu = u / hw;
          const nz = Math.sqrt(Math.max(0, 1 - nu * nu));
          const diff = Math.max(0, -nu * 0.62 + nz * 0.78);
          const rs = 0.5 + 0.5 * ridge;
          const spec = Math.max(0, 1 - Math.abs(nu + 0.42) / 0.2) ** 2 * rs;
          const lum = clamp(0.1 + 0.62 * diff * (0.3 + 0.7 * rs) + 0.55 * spec, 0, 1);
          const col = lum > 0.8 ? WHITE : lum > 0.56 ? CHROME : lum > 0.36 ? SILVER : lum > 0.2 ? TITANIUM : COBALT_MID;
          emit(rs < 0.25 ? '\\' : glyph(Math.max(0.35, lum)), col, 0.55 + 0.45 * lum);
        }
        continue;
      }

      // ---- Glass envelope.
      const d = glassSdf(u, v);
      if (d > 0) continue;
      const e = 0.012;
      let gx = glassSdf(u + e, v) - glassSdf(u - e, v);
      let gy = glassSdf(u, v + e) - glassSdf(u, v - e);
      const gl = Math.hypot(gx, gy) || 1;
      gx /= gl; gy /= gl;
      const q = clamp(1 + d / halfWidth(v), 0, 1);
      const nz = Math.sqrt(1 - q * q); // pseudo-normal: 1 at the core, 0 at the silhouette
      const nx = gx * q, ny = gy * q;
      const ndl = nx * Lu + ny * Lv + nz * Lz;
      const ndh = Math.max(0, nx * Hu + ny * Hv + nz * Hz);
      const fres = Math.pow(1 - nz, 2.2);
      const side = gx * Lpu + gy * Lpv;

      // Specular: Blinn-Phong hot spot plus a reflected-window ribbon across the lit dome.
      let spec = Math.pow(ndh, 70);
      const rho = Math.hypot(u, v - DOME_C);
      if (v > -0.1) {
        let ang = Math.atan2(v - DOME_C, -u) - ribbonAng;
        if (ang > Math.PI) ang -= TAU;
        if (ang < -Math.PI) ang += TAU;
        const along = (ang + 0.95) / 1.75;
        if (along > 0 && along < 1) {
          const width = 0.06 * Math.sin(Math.PI * along);
          const off = Math.abs(rho - 0.67);
          if (off < width + 0.02) spec = Math.max(spec, (1 - off / (width + 0.02)) * (0.6 + 0.4 * Math.sin(Math.PI * along)));
        }
      }
      if (spec > 0.42) { emit(glyph(0.55 + spec * 0.45), WHITE, 0.75 + 0.25 * spec); continue; }

      // DNA double helix.
      let drew = false;
      if (v >= HELIX_V0 && v <= HELIX_V1) {
        const A = helixAmp(v);
        const ph = HELIX_K * v - HELIX_W * t;
        const sn = Math.sin(ph), cs = Math.cos(ph);
        const u1 = A * sn, z1 = cs; // strand 2: u2 = -u1, z2 = -z1
        const slope = A * HELIX_K * cs;
        const inv = 1 / Math.sqrt(1 + slope * slope); // horizontal -> perpendicular distance
        const d1 = Math.abs(u - u1) * inv, d2 = Math.abs(u + u1) * inv;
        const hit1 = d1 < hs, hit2 = d2 < hs;
        if (hit1 || hit2) {
          const use1 = hit1 && (!hit2 || z1 >= -z1);
          const z = use1 ? z1 : -z1;
          const core = 1 - (use1 ? d1 : d2) / hs;
          if (z > 0) {
            const lum = (0.55 + 0.45 * z) * (0.65 + 0.35 * core);
            emit(glyph(lum), lum > 0.8 ? WHITE : CHROME, 0.8 + 0.2 * z);
          } else {
            const lum = (0.55 + 0.35 * -z) * (0.55 + 0.45 * core);
            emit(glyph(lum * 0.9), ORANGE, 0.95 - 0.4 * -z);
          }
          continue;
        }
        // Base-pair rungs, carried by the backbone phase so they rotate with it.
        const rp = ph / rungStep;
        const m = Math.round(rp);
        const dvR = Math.abs((rp - m) * rungStep) / HELIX_K;
        const span = Math.abs(u1);
        if (dvR < hr && span > hs * 1.6 && au < span - hs * 0.4) {
          const nearStrand1 = u * u1 > 0;
          const cobalt = (m & 1) === 0 ? nearStrand1 : !nearStrand1;
          const zr = (u / (u1 || 1)) * z1;
          emit(dvR < hr * 0.5 ? '=' : '-', cobalt ? COBALT : CRIMSON, 0.55 + 0.4 * (0.5 + 0.5 * zr));
          drew = true;
        } else {
          const near = Math.min(z1 > 0.2 ? d1 : 9, -z1 > 0.2 ? d2 : 9);
          if (near < hs * 2.1) {
            emit('·', ORANGE, 0.42 * (1 - near / (hs * 2.1)) + 0.12);
            drew = true;
          }
        }
      }
      // Lead-in wires from the stem to the helix ends.
      if (!drew && v < HELIX_V0 + 0.02) {
        for (const [ax, ay, bxw, byw] of wires) {
          const wx = bxw - ax, wy = byw - ay;
          const tt = clamp(((u - ax) * wx + (v - ay) * wy) / (wx * wx + wy * wy), 0, 1);
          const dd = Math.hypot(u - ax - wx * tt, v - ay - wy * tt);
          if (dd < hwire) { emit('/', SILVER, 0.9); drew = true; break; }
        }
      }
      if (drew && fres < 0.35) continue;

      // Fresnel rim: chrome on the lit upper-left edge, cobalt on the lower-right.
      if (fres > 0.16) {
        const rim = clamp(fres * 1.25, 0, 1) * (0.5 + 0.5 * (0.5 + 0.5 * side));
        const lum = clamp(0.3 + rim, 0, 1);
        const col = side > 0.2 ? (lum > 0.86 ? WHITE : CHROME) : side < -0.25 ? COBALT : side > -0.05 ? SILVER : TITANIUM;
        emit(glyph(lum), col, 0.4 + 0.6 * clamp(fres * 1.4, 0, 1));
        continue;
      }
      if (drew) continue;

      // Sparse glass interior: ordered dither keeps the pattern stable frame to frame.
      const lumI = 0.05 + 0.2 * Math.max(0, ndl) * (1 - nz * 0.5) + 0.35 * fres;
      if (lumI * 2.6 > BAYER[(row & 3) * 4 + (col & 3)]) {
        emit(lumI > 0.18 ? '·' : '.', side > 0 ? SILVER : COBALT, 0.26 + lumI);
      }
    }
  }

  ctx.font = `${cellH}px "Geist Mono", "JetBrains Mono", ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let k = 0; k < STYLES.length; k++) {
    const xs = bx[k];
    if (!xs.length) continue;
    const ys = by[k], cs = bc[k];
    ctx.fillStyle = STYLES[k];
    for (let i = 0; i < xs.length; i++) ctx.fillText(cs[i], xs[i], ys[i]);
  }
}

export interface AsciiDnaLightbulbCanvasProps {
  /**
   * 'hero' (default): full hero scene. 'embedded': the bulb and helix filament only,
   * centred in a transparent container; size it with the parent (about 96px in Syntinuum).
   */
  variant?: 'hero' | 'embedded';
  /** Stop animating (the canvas keeps its last frame and sleeps). */
  paused?: boolean;
}

export const AsciiDnaLightbulbCanvas: React.FC<AsciiDnaLightbulbCanvasProps> = ({ variant = 'hero', paused = false }) => {
  const { isReduced } = useMotionPreference();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<HeroState | null>(null);
  const [layoutVersion, setLayoutVersion] = useState(0);

  // Pointer drives the ruler marker and the light direction.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const s = stateRef.current;
      const c = canvasRef.current;
      if (!s || !c) return;
      const r = c.getBoundingClientRect();
      s.mouse.x = e.clientX - r.left;
      s.mouse.y = e.clientY - r.top;
      s.mouse.active = e.pointerType === 'mouse' && s.mouse.y > -40 && s.mouse.y < r.height + 40;
    };
    const onLeave = () => { if (stateRef.current) stateRef.current.mouse.active = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Text rects move once web fonts land; re-measure the protection mask then.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) setLayoutVersion((n) => n + 1); });
    return () => { alive = false; };
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, stage: CanvasStage) => {
      if (!stateRef.current) stateRef.current = createState();
      if (stateRef.current.embedded !== (variant === 'embedded')) {
        stateRef.current.embedded = variant === 'embedded';
        stateRef.current.version = -1;
      }
      renderFrame(ctx, stage, stateRef.current, isReduced, layoutVersion);
    },
    [isReduced, layoutVersion, variant],
  );

  useCanvasStage(containerRef, canvasRef, draw, { animate: !isReduced && !paused });

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" aria-hidden="true" />
    </div>
  );
};

export default AsciiDnaLightbulbCanvas;
