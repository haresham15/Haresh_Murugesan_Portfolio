/**
 * Shared drawing kit for the flagship telemetry deck.
 * Every scene draws in CSS pixels; PlateStage applies the DPR transform.
 */

export const C = {
  midnight: '#03050A',
  obsidian: '#060A12',
  cobaltDeep: '#0B1E40',
  cobaltMid: '#153875',
  cobalt: '#2563EB',
  red: '#FF2800',
  crimson: '#FF4419',
  silver: '#C8D2E0',
  chrome: '#E6ECF5',
  titanium: '#7E8B9B',
  alabaster: '#F4F6F9',
} as const;

export const MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

const rgbCache = new Map<string, [number, number, number]>();
export function hexRgb(hex: string): [number, number, number] {
  let v = rgbCache.get(hex);
  if (!v) {
    const n = parseInt(hex.slice(1), 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    rgbCache.set(hex, v);
  }
  return v;
}

export function rgba(hex: string, a: number): string {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${a < 0 ? 0 : a > 1 ? 1 : a})`;
}

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
export const easeInOutCubic = (t: number) => {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/** Piecewise-linear ramp through palette stops, t in [0,1]. Returns [r,g,b]. */
export function ramp(stops: readonly string[], t: number): [number, number, number] {
  const x = clamp(t, 0, 1) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = hexRgb(stops[i]);
  const b = hexRgb(stops[i + 1]);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

/* ---------- deterministic noise ---------- */

export function hash2(x: number, y: number): number {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    freq *= 2;
    amp *= 0.5;
  }
  return sum;
}

/** Seeded PRNG (mulberry32). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- marching squares ---------- */

/**
 * Iso-line segments of a scalar field sampled on a (cols x rows) grid.
 * Returns flat [x1,y1,x2,y2,...] in grid units with linear edge interpolation.
 */
export function isoSegments(field: Float32Array, cols: number, rows: number, level: number): Float32Array {
  const out: number[] = [];
  const at = (i: number, j: number) => field[j * cols + i];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const c = at(i + 1, j + 1);
      const d = at(i, j + 1);
      const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const top = () => [i + (level - a) / (b - a), j];
      const right = () => [i + 1, j + (level - b) / (c - b)];
      const bottom = () => [i + (level - d) / (c - d), j + 1];
      const left = () => [i, j + (level - a) / (d - a)];
      const seg = (p: number[], q: number[]) => out.push(p[0], p[1], q[0], q[1]);
      switch (idx) {
        case 1: case 14: seg(left(), bottom()); break;
        case 2: case 13: seg(bottom(), right()); break;
        case 3: case 12: seg(left(), right()); break;
        case 4: case 11: seg(top(), right()); break;
        case 6: case 9: seg(top(), bottom()); break;
        case 7: case 8: seg(left(), top()); break;
        case 5: {
          const center = (a + b + c + d) / 4;
          if (center > level) { seg(left(), top()); seg(bottom(), right()); }
          else { seg(left(), bottom()); seg(top(), right()); }
          break;
        }
        case 10: {
          const center = (a + b + c + d) / 4;
          if (center > level) { seg(left(), bottom()); seg(top(), right()); }
          else { seg(left(), top()); seg(bottom(), right()); }
          break;
        }
      }
    }
  }
  return new Float32Array(out);
}

export function strokeSegments(
  ctx: CanvasRenderingContext2D,
  segs: Float32Array,
  sx: number,
  sy: number,
  ox: number,
  oy: number,
) {
  ctx.beginPath();
  for (let k = 0; k < segs.length; k += 4) {
    ctx.moveTo(ox + segs[k] * sx, oy + segs[k + 1] * sy);
    ctx.lineTo(ox + segs[k + 2] * sx, oy + segs[k + 3] * sy);
  }
  ctx.stroke();
}

/* ---------- drawing helpers ---------- */

/** Hairline blueprint grid aligned to device pixels. */
export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, alpha = 0.06) {
  ctx.save();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = rgba(C.cobalt, alpha);
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(Math.round(x) + 0.25, 0);
    ctx.lineTo(Math.round(x) + 0.25, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, Math.round(y) + 0.25);
    ctx.lineTo(w, Math.round(y) + 0.25);
  }
  ctx.stroke();
  ctx.restore();
}

/** Soft radial vignette so the stage reads as depth rather than a flat fill. */
export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number, cx = w / 2, cy = h / 2) {
  const r = Math.hypot(w, h) * 0.62;
  const g = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
  g.addColorStop(0, rgba(C.cobaltDeep, 0.28));
  g.addColorStop(0.55, rgba(C.cobaltDeep, 0.08));
  g.addColorStop(1, rgba(C.midnight, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** Additive radial glow. Caller sets nothing; composite is restored. */
export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, a: number) {
  if (a <= 0.002 || r <= 0) return;
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(0.4, rgba(color, a * 0.35));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalCompositeOperation = prev;
}

/** Phosphor stroke: wide additive halo + crisp core. Path must already be built. */
export function phosphor(ctx: CanvasRenderingContext2D, color: string, core = 1, halo = 0.16) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba(color, halo);
  ctx.lineWidth = core * 5;
  ctx.stroke();
  ctx.strokeStyle = rgba(color, halo * 1.6);
  ctx.lineWidth = core * 2.4;
  ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = color;
  ctx.lineWidth = core;
  ctx.stroke();
  ctx.restore();
}

export function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string = C.titanium,
  size = 10,
  align: CanvasTextAlign = 'left',
  baseline: CanvasTextBaseline = 'alphabetic',
) {
  ctx.font = `${size}px ${MONO}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
}

/** Cubic Bezier point. */
export function bez(p0: number, p1: number, p2: number, p3: number, t: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

/* ---------- scene contract ---------- */

export interface StagePointer {
  /** damped position, CSS px */
  x: number;
  y: number;
  /** raw target, CSS px */
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  /** true while a real pointer is over the stage */
  active: boolean;
  /** 0..1 eased presence of the real pointer */
  presence: number;
}

export interface StageFrame {
  width: number;
  height: number;
  /** seconds since the scene was created (frozen under reduced motion) */
  age: number;
  /** seconds, monotonic stage clock (frozen under reduced motion) */
  time: number;
  dt: number;
  pointer: StagePointer;
  reduced: boolean;
}

export interface PlateScene {
  /** Draw a full frame. Return the live readout for the telemetry strip. */
  draw(ctx: CanvasRenderingContext2D, f: StageFrame): string;
  /** Where the damped cursor drifts when no real pointer is present (CSS px). */
  idle?(f: StageFrame): [number, number];
  onPointerDown?(f: StageFrame): void;
  action?(id: string): void;
}

export interface PlateMode {
  id: string;
  label: string;
  /** accessible description of the visualization */
  description: string;
}

export interface PlateDefinition {
  modes: PlateMode[];
  actions?: { id: string; label: string; modes?: string[] }[];
  createScene(modeId: string): PlateScene;
}
