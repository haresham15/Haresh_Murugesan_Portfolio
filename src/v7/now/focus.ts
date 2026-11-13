/**
 * Pure focus-pull maths for the Now viewfinder. No DOM, so it runs under
 * `node --experimental-strip-types focus.test.ts`.
 *
 * Focus is continuous: 0 = near (0.5 m), 1 = middle (3 m), 2 = far (∞).
 */

export const STOPS = 3;
/** Dead band around each boundary between stops, in scroll-progress units. */
export const DEAD_BAND = 0.08;
/** Seconds of release velocity projected forward before snapping (same as the Works wheel). */
export const PROJECTION_S = 0.18;
/** Peak scene scale during a rack: 1 → 1.03 → 1. */
export const BREATH_SCALE = 0.03;
/** Opacity of each copy at full weight: sharp, 6 px, 12 px. Defocused type reads lighter. */
export const COPY_ALPHA: readonly [number, number, number] = [1, 0.82, 0.62];
/** Rack spring, critically damped (ζ ≈ 1.0), settles in about 500 ms. */
export const SPRING = { k: 120, c: 22, m: 1 } as const;
/** Settle thresholds: focus units and focus units per second. */
export const SETTLE_X = 0.002;
export const SETTLE_V = 0.02;

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/**
 * Scroll progress (0..1 across the pinned runway) → stop index, with hysteresis.
 * Stop i owns [i/n, (i+1)/n). Crossing a boundary needs `band` of extra travel past it,
 * so a visitor resting near a boundary never sees the stop flutter.
 * `prev` null means no history: take the raw stop.
 */
export function stopFromProgress(p: number, prev: number | null, n = STOPS, band = DEAD_BAND): number {
  const q = clamp(p, 0, 1);
  if (prev === null) return clamp(Math.floor(q * n), 0, n - 1);
  let s = clamp(prev, 0, n - 1);
  while (s < n - 1 && q >= (s + 1) / n + band) s++;
  while (s > 0 && q <= s / n - band) s--;
  return s;
}

/** Scroll progress at the centre of stop i: where a click or key parks the page. */
export function progressForStop(i: number, n = STOPS): number {
  return (clamp(i, 0, n - 1) + 0.5) / n;
}

/**
 * Linear weights of the three copies (sharp, 6 px, 12 px) for a subject whose
 * distance from the focal plane is d (0..2). Always sums to 1.
 */
export function copyWeights(d: number): [number, number, number] {
  const x = clamp(Math.abs(d), 0, 2);
  if (x <= 1) return [1 - x, x, 0];
  return [0, 2 - x, x - 1];
}

/**
 * Copy opacities. Two stacked translucent copies cover less than either alone
 * (0.5 over 0.5 is 0.75), so the crossfade is equal-power, then scaled by COPY_ALPHA.
 */
export function copyOpacities(d: number): [number, number, number] {
  const w = copyWeights(d);
  return [
    Math.sin((w[0] * Math.PI) / 2) * COPY_ALPHA[0],
    Math.sin((w[1] * Math.PI) / 2) * COPY_ALPHA[1],
    Math.sin((w[2] * Math.PI) / 2) * COPY_ALPHA[2],
  ];
}

/** 0 at a stop, 1 halfway between two stops. Drives focus breathing. */
export function breath(focus: number): number {
  const f = focus - Math.floor(focus);
  return Math.sin(Math.PI * f);
}

/** Scene scale for a focus value: 1 at a stop, 1 + BREATH_SCALE mid-rack. */
export function sceneScale(focus: number): number {
  return 1 + BREATH_SCALE * breath(focus);
}

/** Release target: project the velocity (focus units / s) forward, round, clamp. */
export function snapStop(focus: number, velocity: number, n = STOPS, projection = PROJECTION_S): number {
  return clamp(Math.round(focus + velocity * projection), 0, n - 1);
}

/**
 * Horizontal drag on the ring → focus. Dragging right turns the ring right,
 * which brings the nearer marks to the index, so focus falls.
 */
export function focusFromDrag(startFocus: number, dx: number, spacingPx: number, n = STOPS): number {
  return clamp(startFocus - dx / Math.max(1, spacingPx), 0, n - 1);
}

export interface SpringState {
  x: number;
  v: number;
}

/**
 * One semi-implicit Euler step toward `target`. dt in ms, clamped to 1/30 s.
 * Returns true once settled (and snaps x to target, v to 0).
 */
export function springStep(s: SpringState, target: number, dtMs: number): boolean {
  const h = Math.min(Math.max(dtMs, 0) / 1000, 1 / 30);
  if (h > 0) {
    const a = (SPRING.k * (target - s.x) - SPRING.c * s.v) / SPRING.m;
    s.v += a * h;
    s.x += s.v * h;
  }
  if (Math.abs(target - s.x) < SETTLE_X && Math.abs(s.v) < SETTLE_V) {
    s.x = target;
    s.v = 0;
    return true;
  }
  return false;
}
