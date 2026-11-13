/**
 * The material field: which material sits under every viewport pixel.
 *
 * Sections declare `data-material="dark|light"`. Seams (`data-seam`) sit between them,
 * 70vh tall, and own the transition. This module turns document layout into a short
 * list of viewport bands for the CarbonField shader, and answers `materialAt(x, y)`
 * for the header, nav rim and cursor using the same mask maths as the shader.
 */
export type Material = 'dark' | 'light';
export type SeamKind =
  | 'shutter'
  | 'iris-open'
  | 'iris-close'
  | 'horizon'
  | 'turn-in'
  | 'turn-out'
  | 'baseline'
  | 'exposure';

export const SEAM_KINDS: SeamKind[] = ['shutter', 'iris-open', 'iris-close', 'horizon', 'turn-in', 'turn-out', 'baseline', 'exposure'];
/** Shader ids. 0 is a solid band. */
export const KIND_ID: Record<'solid' | SeamKind, number> = {
  solid: 0, shutter: 1, 'iris-open': 2, 'iris-close': 3, horizon: 4, 'turn-in': 5, 'turn-out': 6, baseline: 7, exposure: 8,
};

export interface Band {
  /** Viewport CSS px. */
  top: number;
  bottom: number;
  kind: 'solid' | SeamKind;
  /** Material above (a) and below (b). Solid bands use a only. */
  a: Material;
  b: Material;
  /** Seam progress 0..1 as the seam crosses the viewport. */
  p: number;
}

export interface FieldSnapshot {
  bands: Band[];
  /** Progress through the section under the viewport centre, 0..1. */
  sectionProgress: number;
  /** Solid-section index + progress through it; continuous over the whole page. */
  lightProgress: number;
  vw: number;
  vh: number;
  scrollY: number;
}

interface Region {
  el: HTMLElement;
  docTop: number;
  height: number;
  kind: 'solid' | SeamKind;
  a: Material;
  b: Material;
}

let regions: Region[] = [];
let dirtyLayout = true;
let ro: ResizeObserver | null = null;
const observed = new Set<Element>();
const observedHeight = new WeakMap<Element, number>();
const layoutListeners = new Set<() => void>();

function asMaterial(v: string | undefined, fallback: Material): Material {
  return v === 'light' || v === 'dark' ? v : fallback;
}

function measure() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-material-region]'));
  const sy = window.scrollY;
  regions = els.map((el) => {
    const r = el.getBoundingClientRect();
    const seam = el.dataset.seam as SeamKind | undefined;
    if (seam) {
      return {
        el,
        docTop: r.top + sy,
        height: r.height,
        kind: SEAM_KINDS.includes(seam) ? seam : 'horizon',
        a: asMaterial(el.dataset.from, 'dark'),
        b: asMaterial(el.dataset.to, 'light'),
      };
    }
    const m = asMaterial(el.dataset.material, 'dark');
    return { el, docTop: r.top + sy, height: r.height, kind: 'solid' as const, a: m, b: m };
  });
  dirtyLayout = false;
  if (!ro && typeof ResizeObserver !== 'undefined') {
    // Only a real height change invalidates layout. Observing an element fires one
    // callback immediately; comparing against the last seen size ignores it.
    ro = new ResizeObserver((entries) => {
      let changed = false;
      for (const e of entries) {
        const h = e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height;
        if (observedHeight.get(e.target) !== h) {
          if (observedHeight.has(e.target)) changed = true;
          observedHeight.set(e.target, h);
        }
      }
      if (changed) invalidateLayout();
    });
  }
  if (ro) {
    // Observe each region once; never disconnect and re-observe (that loops).
    const current = new Set<Element>(regions.map((r) => r.el));
    for (const el of observed) {
      if (!current.has(el)) {
        ro.unobserve(el);
        observed.delete(el);
        observedHeight.delete(el);
      }
    }
    for (const el of current) {
      if (!observed.has(el)) {
        observed.add(el);
        ro.observe(el);
      }
    }
  }
}

/** Mark document layout stale (resize, section height change, route change). */
export function invalidateLayout() {
  dirtyLayout = true;
  for (const l of layoutListeners) l();
}

export function onLayoutChange(fn: () => void): () => void {
  layoutListeners.add(fn);
  return () => layoutListeners.delete(fn);
}

export function readField(): FieldSnapshot {
  if (dirtyLayout) measure();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const bands: Band[] = [];
  let sectionProgress = 0;
  let lightProgress = 0;
  let solidIndex = -1;
  const mid = vh / 2;
  for (const r of regions) {
    const top = r.docTop - sy;
    const bottom = top + r.height;
    if (r.kind === 'solid') solidIndex++;
    if (top <= mid && bottom > mid) {
      if (r.kind === 'solid') {
        sectionProgress = clamp01((mid - top) / Math.max(1, r.height));
        lightProgress = solidIndex + sectionProgress;
      } else {
        lightProgress = solidIndex + 1; // held across the seam so the light never jumps
      }
    }
    if (bottom <= 0 || top >= vh) continue;
    const p = r.kind === 'solid' ? 0 : clamp01((vh - top) / (vh + r.height));
    bands.push({ top, bottom, kind: r.kind, a: r.a, b: r.b, p });
  }
  return { bands, sectionProgress, lightProgress, vw, vh, scrollY: sy };
}

/* ------------------------------------------------------------------------- */
/* Mask maths. Mirrors the GLSL in carbon/shader.ts; keep the two in step.    */
/* Returns the weight of material b at a point inside a seam band (0..1).     */
/* x, y: viewport px; band in viewport px.                                     */
/* ------------------------------------------------------------------------- */

export const SLAT_PX = 96;
export const IRIS_BLADES = 7;
export const HORIZON_VH = 0.3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (e0: number, e1: number, v: number) => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Shutter slat opening: spec is smoothstep(0,1, 2.2p - 0.06i); k grows so the last slat finishes by p = 1. */
export function shutterGain(vw: number, h: number) {
  const iMax = Math.floor((vw + h) / SLAT_PX);
  return Math.max(2.2, 1 + 0.06 * iMax);
}

export function irisRadius(theta: number, R: number, p: number) {
  const seg = (2 * Math.PI) / IRIS_BLADES;
  let m = (theta + 0.4 * p) % seg;
  if (m < 0) m += seg;
  return (R * Math.cos(Math.PI / IRIS_BLADES)) / Math.cos(m - Math.PI / IRIS_BLADES);
}

export function seamMask(band: Band, x: number, y: number, vw: number, vh: number): number {
  const h = band.bottom - band.top;
  const yb = y - band.top; // 0 at the top of the seam
  const up = h - yb; // distance above the bottom edge
  const p = band.p;
  switch (band.kind) {
    case 'solid':
      return 0;
    case 'shutter': {
      const u = x + up;
      const i = Math.floor(u / SLAT_PX);
      const f = u / SLAT_PX - i;
      const open = smoothstep(0, 1, shutterGain(vw, h) * p - 0.06 * i);
      return f < open ? 1 : 0;
    }
    case 'iris-open':
    case 'iris-close': {
      const opening = band.kind === 'iris-open';
      // Opening grows up from the next section (bottom edge); closing shrinks into the previous one (top edge).
      const dx = x - vw / 2;
      const dy = yb - (opening ? h : 0);
      const Rmax = (Math.hypot(vw / 2, h) / Math.cos(Math.PI / IRIS_BLADES)) * 1.02;
      const R = (opening ? p : 1 - p) * Rmax;
      const inside = Math.hypot(dx, dy) < irisRadius(Math.atan2(dy, dx), R, p);
      return opening ? (inside ? 1 : 0) : inside ? 0 : 1;
    }
    case 'horizon': {
      const band30 = HORIZON_VH * vh;
      return smoothstep(0, 1, (yb - (h - band30) / 2) / band30);
    }
    case 'turn-in':
    case 'turn-out': {
      // A hand pivoting 90 degrees about a bottom corner sweeps material b in.
      const px = band.kind === 'turn-in' ? x : vw - x;
      const ang = Math.atan2(up, px); // 0 along the bottom edge, PI/2 up the side
      const sweep = smoothstep(0.1, 0.9, p) * (Math.PI / 2) * 1.001;
      return ang <= sweep ? 1 : 0;
    }
    case 'baseline':
      return yb >= h / 2 ? 1 : 0;
    case 'exposure': {
      const t = yb / h;
      return smoothstep(0.15, 0.85, t + (p - 0.5) * 0.6);
    }
  }
}

/** Material under a viewport point. Uses the same bands and masks as the shader. */
export function materialAt(x: number, y: number, snapshot: FieldSnapshot = readField()): Material {
  for (const b of snapshot.bands) {
    if (y < b.top || y >= b.bottom) continue;
    if (b.kind === 'solid') return b.a;
    return seamMask(b, x, y, snapshot.vw, snapshot.vh) >= 0.5 ? b.b : b.a;
  }
  return 'dark';
}
