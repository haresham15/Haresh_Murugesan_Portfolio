/**
 * Syntinuum waveform model. Pure functions only (no DOM, no imports) so the
 * logic runs under `node --experimental-strip-types` in model.test.ts.
 *
 * Geometry: `slots` bar positions across the full width. Three equal zones,
 * separated by two gaps of GAP missing bars. Zone k occupies slots
 * [k * (zoneBars + GAP), k * (zoneBars + GAP) + zoneBars).
 */

export const ZONES = 3;
export const GAP = 3;
/** Outer fraction of the width on each side that fades out by alpha. */
export const EDGE_FADE = 0.08;
/** Below this width the waveform uses half the bars so each stays visible. */
export const NARROW_PX = 640;

/** Vertical layout of the waveform canvas, CSS px. */
export const BULB_PX = 96;
export const BULB_GAP_PX = 40;
/** Room above the tallest bar: bulb + 40px gap + 8px for bob and tilt. */
export const TOP_PAD = BULB_PX + BULB_GAP_PX + 8;
export const BOTTOM_PAD = 12;
/** Silence pocket around each numeral, px relative to the numeral's left edge. */
export const POCKET_BEFORE = 6;
export const POCKET_AFTER = 28;

/** Bulb spring (v7-motion: Syntinuum bulb x). */
export const SPRING_K = 120;
export const SPRING_C = 20;
export const SPRING_M = 1;
export const MAX_TILT_DEG = 8;
/** Velocity (px/s) at which the tilt reaches MAX_TILT_DEG. */
export const TILT_FULL_VELOCITY = 1500;
/** Bob: 4px of travel (±2px) at 0.5 Hz. */
export const BOB_AMPLITUDE = 2;
export const BOB_HZ = 0.5;
/** Reduced motion: zone change is a crossfade of this length, ms. */
export const CROSSFADE_MS = 200;

export interface ZoneLayout {
  slots: number;
  zoneBars: number;
  /** Slot index of each zone's first bar. */
  starts: number[];
  /** Zone centres as a fraction of the width. */
  centers: number[];
  /** Zone width as a fraction of the width. */
  zoneFrac: number;
  /** Left edge of each zone's numeral as a fraction of the width. */
  numeralFrac: number[];
}

export function slotCount(width: number): number {
  return width < NARROW_PX ? 120 : 240;
}

export function zoneLayout(slots: number): ZoneLayout {
  const zoneBars = Math.floor((slots - GAP * (ZONES - 1)) / ZONES);
  const starts: number[] = [];
  const centers: number[] = [];
  const numeralFrac: number[] = [];
  for (let k = 0; k < ZONES; k++) {
    const start = k * (zoneBars + GAP);
    starts.push(start);
    centers.push((start + zoneBars / 2) / slots);
    numeralFrac.push(Math.max(start / slots, EDGE_FADE));
  }
  return { slots, zoneBars, starts, centers, zoneFrac: zoneBars / slots, numeralFrac };
}

/** Zone that owns slot i, or -1 for a gap (or out of range). */
export function slotZone(i: number, layout: ZoneLayout): number {
  if (i < 0 || i >= layout.slots) return -1;
  const step = layout.zoneBars + GAP;
  const k = Math.floor(i / step);
  if (k >= ZONES) return -1;
  return i - k * step < layout.zoneBars ? k : -1;
}

/** Zone under a horizontal fraction of the width; a gap belongs to the nearer zone. */
export function zoneAtFraction(f: number, layout: ZoneLayout): number {
  let best = 0;
  let bestD = Infinity;
  for (let k = 0; k < ZONES; k++) {
    const lo = layout.starts[k] / layout.slots;
    const hi = (layout.starts[k] + layout.zoneBars) / layout.slots;
    const d = f < lo ? lo - f : f > hi ? f - hi : 0;
    if (d < bestD) { bestD = d; best = k; }
  }
  return best;
}

/** Light pool: lit(x) = exp(-((x - bulbX) / sigma)^2). */
export function lit(x: number, bulbX: number, sigma: number): number {
  const d = (x - bulbX) / sigma;
  return Math.exp(-d * d);
}

/** sigma = zone width / 2.2 (px). */
export function sigmaFor(width: number, layout: ZoneLayout): number {
  return (layout.zoneFrac * width) / 2.2;
}

/** Lit bars breathe: h * (1 + 0.25 * lit * sin(2t + 0.35i)), t in seconds. */
export function breath(litValue: number, tSeconds: number, i: number): number {
  return 1 + 0.25 * litValue * Math.sin(2 * tSeconds + 0.35 * i);
}

export interface SpringState { x: number; v: number }

/** Semi-implicit Euler at dt clamped to 1/30 s. Mutates and returns s. */
export function springStep(
  s: SpringState,
  target: number,
  dtMs: number,
  k = SPRING_K,
  c = SPRING_C,
  m = SPRING_M,
): SpringState {
  const dt = Math.min(Math.max(dtMs, 0) / 1000, 1 / 30);
  if (dt === 0) return s;
  const a = (k * (target - s.x) - c * s.v) / m;
  s.v += a * dt;
  s.x += s.v * dt;
  return s;
}

/** Snaps and returns true once position and velocity are below visible thresholds. */
export function settle(s: SpringState, target: number, posEps = 0.4, velEps = 4): boolean {
  if (Math.abs(target - s.x) < posEps && Math.abs(s.v) < velEps) {
    s.x = target;
    s.v = 0;
    return true;
  }
  return false;
}

export function tiltDeg(velocity: number): number {
  const t = velocity / TILT_FULL_VELOCITY;
  return MAX_TILT_DEG * (t < -1 ? -1 : t > 1 ? 1 : t);
}

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Alpha falloff over the outer EDGE_FADE of the width on each side. */
export function edgeAlpha(f: number): number {
  return smoothstep(0, EDGE_FADE, f) * smoothstep(0, EDGE_FADE, 1 - f);
}

/** Height multiplier that clears a pocket of silence for a numeral at numeralX. */
export function pocketMask(x: number, numeralX: number): number {
  const d = x - numeralX;
  if (d < -POCKET_BEFORE - 10 || d > POCKET_AFTER + 10) return 1;
  return 1 - smoothstep(-POCKET_BEFORE - 10, -POCKET_BEFORE, d) * (1 - smoothstep(POCKET_AFTER, POCKET_AFTER + 10, d));
}

/**
 * Exit transition into the light Index: amplitude falls to zero as the baseline
 * rises out through the top of the viewport, leaving the flat baseline.
 * Full amplitude while the baseline sits below 38% of the viewport height.
 */
export function exitAmplitude(baselineViewportY: number, viewportHeight: number): number {
  if (viewportHeight <= 0) return 1;
  return smoothstep(0.06, 0.38, baselineViewportY / viewportHeight);
}

/** Scroll velocity (px/s) -> gentle amplitude boost, 0..0.3. */
export function scrollBoost(velocity: number): number {
  return Math.min(0.3, Math.abs(velocity) / 8000);
}

/* ---------------------------------------------------------------- Peaks --- */

/** Deterministic PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One seed per zone. No episode audio is in the repo, so peaks are procedural. */
export const ZONE_SEEDS = [0x5f1a7e01, 0x2c9d4b17, 0x7ae36d29];
/** Peak height of each zone relative to the tallest bar on the page. */
export const ZONE_MAX = [0.92, 1, 0.88];

const peakCache = new Map<string, Float32Array>();

/**
 * Speech-like peaks for one zone: a few phrase envelopes, per-bar texture,
 * occasional pauses, tapered ends. Values in [0.04, ZONE_MAX[zone]].
 */
export function zonePeaks(zone: number, n: number): Float32Array {
  const key = `${zone}:${n}`;
  const hit = peakCache.get(key);
  if (hit) return hit;
  const rand = mulberry32(ZONE_SEEDS[zone % ZONE_SEEDS.length]);
  const phrases = 4 + Math.floor(rand() * 3);
  const bumps: [number, number, number][] = [];
  for (let p = 0; p < phrases; p++) {
    bumps.push([(p + 0.2 + rand() * 0.6) / phrases, 0.05 + rand() * 0.09, 0.35 + rand() * 0.65]);
  }
  const out = new Float32Array(n);
  let prev = rand();
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n;
    let env = 0.18;
    for (const [c, w, h] of bumps) {
      const d = (u - c) / w;
      env += h * Math.exp(-d * d);
    }
    const r = rand();
    const texture = 0.45 + 0.55 * (0.6 * r + 0.4 * prev);
    prev = r;
    const pause = rand() < 0.06 ? 0.3 : 1;
    const taper = smoothstep(0, 0.06, u) * smoothstep(0, 0.06, 1 - u);
    out[i] = env * texture * pause * (0.15 + 0.85 * taper);
  }
  let max = 0;
  for (let i = 0; i < n; i++) if (out[i] > max) max = out[i];
  const scale = max > 0 ? ZONE_MAX[zone % ZONE_MAX.length] / max : 0;
  for (let i = 0; i < n; i++) out[i] = Math.max(0.04, out[i] * scale);
  peakCache.set(key, out);
  return out;
}

/* --------------------------------------------------------------- Colour --- */

export type RGB = [number, number, number];

export interface WavePalette {
  /** Unlit bars. */
  rest: RGB;
  /** Edge of the light pool. */
  cool: RGB;
  /** Centre of the light pool. */
  hot: RGB;
  /** Baseline and cone tint. */
  rule: string;
  ink: RGB;
}

export const DARK_PALETTE: WavePalette = {
  rest: [126, 139, 155], // #7E8B9B titanium
  cool: [37, 99, 235], // #2563EB
  hot: [255, 40, 0], // #FF2800
  rule: 'rgba(200, 210, 224, 0.22)',
  ink: [244, 246, 249],
};

export const LIGHT_PALETTE: WavePalette = {
  rest: [71, 85, 105], // #475569
  cool: [21, 56, 117], // #153875
  hot: [255, 40, 0],
  rule: 'rgba(5, 8, 17, 0.28)',
  ink: [5, 8, 17],
};

/** Parses #rgb, #rrggbb, rgb() and rgba(). Returns null when it cannot. */
export function parseColor(input: string): RGB | null {
  const s = input.trim();
  const hex = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/**
 * Titanium -> accent by lit, where the accent runs cobalt at the pool's edge to
 * red at its centre. The cobalt-to-red crossover is kept short (lit 0.6 to 0.8)
 * so the pool never reads as a purple gradient.
 */
export function barColor(litValue: number, p: WavePalette = DARK_PALETTE): RGB {
  const accent = mix(p.cool, p.hot, smoothstep(0.6, 0.8, litValue));
  return mix(p.rest, accent, smoothstep(0.04, 0.45, litValue));
}

/** Pre-rendered colour strings for lit quantised to `steps` levels. */
export function colorRamp(p: WavePalette, steps = 64): string[] {
  const out: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const [r, g, b] = barColor(i / steps, p);
    out.push(`rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`);
  }
  return out;
}
