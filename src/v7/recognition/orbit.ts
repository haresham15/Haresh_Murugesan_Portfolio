/**
 * Recognition orbit: pure maths, no DOM. Tested by orbit.test.ts.
 *
 * The orbit state is one number `s`, measured in medal positions. Medal i sits at angle
 * alpha_i = 2*pi*(i - s)/N on an ellipse, so integer s puts medal (s mod N) at the front.
 * Increasing s brings the medal on the right to the front.
 */

/* ---------------------------------------------------------------- geometry */

/** Ellipse 46vw wide and 6vh tall, as semi-axes. */
export const ORBIT_W_VW = 0.46;
export const ORBIT_H_VH = 0.06;

export interface Geometry {
  /** Active medallion diameter, px: min(72vh, 52vw). */
  d: number;
  /** Ellipse semi-axes, px. */
  a: number;
  b: number;
}

export function geometry(vw: number, vh: number): Geometry {
  return {
    d: Math.round(Math.min(0.72 * vh, 0.52 * vw)),
    a: (ORBIT_W_VW * vw) / 2,
    b: (ORBIT_H_VH * vh) / 2,
  };
}

export interface Slot {
  /** Offset from the ellipse centre, px. Front is below centre, back above. */
  x: number;
  y: number;
  /** Depth: 0 at the front, 1 at the back. */
  z: number;
}

export function slot(i: number, s: number, n: number, g: Pick<Geometry, 'a' | 'b'>): Slot {
  const alpha = (2 * Math.PI * (i - s)) / n;
  return {
    x: g.a * Math.sin(alpha),
    y: g.b * Math.cos(alpha),
    z: (1 - Math.cos(alpha)) / 2,
  };
}

/** Scale 1 - 0.55z, blur 8px * z, brightness 1 - 0.5z. */
export function depthLook(z: number): { scale: number; blur: number; brightness: number } {
  return { scale: 1 - 0.55 * z, blur: 8 * z, brightness: 1 - 0.5 * z };
}

/**
 * Background medals are pre-rendered at three depths (z = 0, 0.5, 1) with blur and
 * brightness baked in. A medal at depth z shows the shallower level opaque and the
 * deeper one on top at partial opacity, so blur and brightness follow depth
 * continuously while only opacity animates.
 */
export const LEVEL_Z = [0, 0.5, 1] as const;

export function levelOpacities(z: number): [number, number, number] {
  const c = Math.min(1, Math.max(0, z));
  if (c <= 0.5) return [1, c / 0.5, 0];
  return [0, 1, (c - 0.5) / 0.5];
}

/** Turn about the vertical axis, degrees: one full turn per position travelled. */
export function spinDeg(s: number): number {
  const f = s - Math.floor(s);
  return f === 0 ? 0 : -360 * f;
}

export const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Signed shortest number of positions from medal `from` to medal `to`. */
export function shortestDelta(from: number, to: number, n: number): number {
  let d = mod(to - from, n);
  if (d > n / 2) d -= n;
  return d;
}

/* ---------------------------------------------------------------- spring */

/** Recognition orbit spring: heavy, overshoot under 1 degree. */
export const SPRING = { k: 90, c: 16, m: 1 } as const;

export interface SpringState {
  x: number;
  v: number;
}

/** Semi-implicit Euler, dt in ms, clamped to 1/30 s. Mutates and returns `st`. */
export function springStep(st: SpringState, target: number, dtMs: number): SpringState {
  const h = Math.min(dtMs / 1000, 1 / 30);
  const a = (SPRING.k * (target - st.x) - SPRING.c * st.v) / SPRING.m;
  st.v += a * h;
  st.x += st.v * h;
  return st;
}

export const SETTLE_X = 0.0005;
export const SETTLE_V = 0.005;

export function settled(st: SpringState, target: number): boolean {
  return Math.abs(target - st.x) < SETTLE_X && Math.abs(st.v) < SETTLE_V;
}

/* ---------------------------------------------------------------- drag */

/** Pixels of horizontal drag per orbit position: the front medal follows the finger. */
export function pxPerPosition(a: number, n: number): number {
  return (a * 2 * Math.PI) / n;
}

/** Same projection as the Works wheel: round(s + 0.18 * v), v in positions per second. */
export const PROJECT_S = 0.18;

export function releaseTarget(s: number, v: number, n: number, from: number): number {
  const raw = Math.round(s + PROJECT_S * v);
  const lim = Math.max(1, n - 1);
  return Math.min(from + lim, Math.max(from - lim, raw));
}

/** Velocity over the last ~100 ms of samples {t ms, s}. */
export function sampleVelocity(samples: ReadonlyArray<{ t: number; s: number }>): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  let first = samples[0];
  for (const p of samples) {
    if (last.t - p.t <= 100) {
      first = p;
      break;
    }
  }
  const dt = last.t - first.t;
  return dt > 0 ? ((last.s - first.s) / dt) * 1000 : 0;
}

/* ---------------------------------------------------------------- one step, 900 ms */

export const T_UNSEAT = 120;
export const T_SEAT = 560;
export const T_SEAT_END = 900;
export const SWEEP_MS = 420;
export const SWEEP_DEG = 140;
export const T_END = T_SEAT + SWEEP_MS; // 980: the sweep outlasts the seat by 80 ms

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const easeInOut = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export type TextPhase = 'shown' | 'exit' | 'hidden' | 'reveal';

export interface StepFrame {
  /** 0..1 over 0-120 ms. */
  unseat: number;
  /** 0..1 over 120-560 ms: the incoming medal grows toward 1.02 on approach. */
  arrive: number;
  /** 0..1 over 560-900 ms: 1.02 settles to 1. */
  seat: number;
  /** null outside 560-980 ms, else 0..1 through the 140 degree sweep. */
  sweep: number | null;
  /** Live shader opacity over the seated medal. */
  live: number;
  text: TextPhase;
  /** Whether the orbit spring may move yet. */
  orbit: boolean;
  done: boolean;
}

export function stepFrame(t: number): StepFrame {
  const unseat = easeOut(t / T_UNSEAT);
  const arrive = easeInOut((t - T_UNSEAT) / (T_SEAT - T_UNSEAT));
  const seat = easeOut((t - T_SEAT) / (T_SEAT_END - T_SEAT));
  const sweep = t >= T_SEAT && t < T_END ? (t - T_SEAT) / SWEEP_MS : null;
  let live = 0;
  if (t < T_UNSEAT) live = 1 - unseat;
  else if (t >= T_SEAT) live = easeOut((t - T_SEAT) / 160);
  let text: TextPhase = 'shown';
  if (t < T_UNSEAT) text = 'exit';
  else if (t < T_SEAT) text = 'hidden';
  else if (t < T_END) text = 'reveal';
  return { unseat, arrive, seat, sweep, live, text, orbit: t >= T_UNSEAT, done: t >= T_END };
}

/**
 * Extra scale on top of depth for one medal. The outgoing medal unseats to 0.96 and
 * recovers once it is in the back; the incoming one swells to 1.02 on approach and
 * seats to 1.
 */
export function seatFactor(f: StepFrame, outgoing: boolean, incoming: boolean): number {
  if (incoming) {
    const from = outgoing ? 1 - 0.04 * f.unseat : 1;
    if (f.seat > 0) return 1.02 - 0.02 * f.seat;
    return from + (1.02 - from) * f.arrive;
  }
  if (outgoing) return 1 - 0.04 * f.unseat * (1 - f.seat);
  return 1;
}

/** Light azimuth offset during the sweep, radians: from -140 degrees back to the pointer. */
export function sweepOffset(u: number | null): number {
  if (u === null) return 0;
  return (-SWEEP_DEG * Math.PI) / 180 * (1 - easeInOut(u));
}

/** Brightness boost of the band while it crosses the engraving. */
export function sweepBoost(u: number | null): number {
  return u === null ? 0 : Math.sin(Math.PI * clamp01(u));
}

/** Slow figure-eight for the light when there is no pointer. Returns planar light -1..1. */
export function idleLight(nowMs: number): { x: number; y: number } {
  const w = (2 * Math.PI) / 14000;
  return { x: 0.9 * Math.sin(w * nowMs), y: 0.45 * Math.sin(2 * w * nowMs) };
}
