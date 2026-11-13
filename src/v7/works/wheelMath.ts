/**
 * Selected Works wheel: pure maths, no DOM. Angles are degrees.
 *
 * θ is the wheel's rotation. Sector k (0..7) sits at local angle k·45°, so its screen angle
 * is apex + k·45° + θ, and the sector at the apex is k = round(−θ / 45) mod 8.
 * Sectors carry projects 0..3 twice, so project = k mod 4.
 */

export const DETENT = 45;
export const SECTORS = 8;
export const PROJECTS = 4;

/** Free spring (blueprint §4): ζ ≈ 0.88, one small overshoot, settles in about 450 ms. */
export const SPRING = { k: 220, c: 26, m: 1 } as const;

/**
 * While dragging the pointer drives θ "directly": a stiff hand spring that tracks the pointer
 * within a few frames, plus the detent torque −A·sin(8θ). A / HAND.k ≈ 5° is how far the wheel
 * leads or lags the hand between notches; A·8·π/180 < HAND.k keeps the follow monotonic,
 * so it cogs without ever jumping.
 */
export const HAND = { k: 1800, c: 76, m: 1 } as const;
export const DETENT_TORQUE = 9000;

/** Release projection, seconds: target = round((θ + 0.18·ω) / 45°) · 45°. */
export const RELEASE_PROJECTION = 0.18;

/** Settle thresholds: below both, snap to the target and sleep. */
export const SETTLE_ANGLE = 0.05;
export const SETTLE_VELOCITY = 2;

/** Pinned scroll: four stops of 70vh, ±8% dead band around each boundary. */
export const STOP_VH = 70;
export const DEAD_BAND = 0.08;

const MAX_DT = 1 / 30;
const SUB_DT = 1 / 240;

export const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Sector at the apex for a given θ. */
export function sectorAt(theta: number): number {
  return mod(Math.round(-theta / DETENT), SECTORS);
}

/** Project (0..3) at the apex for a given θ. */
export function projectAt(theta: number): number {
  return sectorAt(theta) % PROJECTS;
}

/** Index of the detent nearest θ (not wrapped): used to detect crossings. */
export function detentIndex(theta: number): number {
  return Math.round(theta / DETENT);
}

/**
 * The resting angle that brings `project` to the apex with the least rotation from `theta`.
 * The project repeats every 180°, so the move is never more than 90°.
 */
export function angleForProject(theta: number, project: number): number {
  const base = Math.round(theta / DETENT) * DETENT;
  const current = projectAt(base);
  // Moving to the next project turns the wheel by −45°.
  let steps = mod(project - current, PROJECTS);
  if (steps > PROJECTS / 2) steps -= PROJECTS;
  return base - steps * DETENT;
}

/** Rest angle chosen on release from position and release velocity (deg/s). */
export function releaseTarget(theta: number, omega: number): number {
  return Math.round((theta + RELEASE_PROJECTION * omega) / DETENT) * DETENT;
}

/** Detent torque at θ (deg/s² per unit mass). Stable notches at multiples of 45°. */
export function detentTorque(theta: number, amplitude = DETENT_TORQUE): number {
  return -amplitude * Math.sin((8 * theta * Math.PI) / 180);
}

export interface WheelState {
  theta: number;
  omega: number;
}

/**
 * Advance the wheel by dt seconds toward `target` with semi-implicit Euler,
 * sub-stepped for stability and clamped to 1/30 s.
 * `dragging` switches to the hand spring and adds the detent torque.
 * Returns true while still moving.
 */
export function stepWheel(s: WheelState, target: number, dtSeconds: number, dragging: boolean): boolean {
  const dt = Math.min(Math.max(dtSeconds, 0), MAX_DT);
  const { k, c, m } = dragging ? HAND : SPRING;
  const steps = Math.max(1, Math.ceil(dt / SUB_DT));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    let force = k * (target - s.theta) - c * s.omega;
    if (dragging) force += detentTorque(s.theta);
    s.omega += (force / m) * h;
    s.theta += s.omega * h;
  }
  if (!dragging && Math.abs(target - s.theta) < SETTLE_ANGLE && Math.abs(s.omega) < SETTLE_VELOCITY) {
    s.theta = target;
    s.omega = 0;
    return false;
  }
  return true;
}

/** Signed smallest difference a − b in degrees, in (−180, 180]. */
export function angleDelta(a: number, b: number): number {
  const d = mod(a - b + 180, 360) - 180;
  return d === -180 ? 180 : d;
}

/**
 * Scroll progress → stop, with hysteresis. `x` is progress in stop units (0..n);
 * the current stop holds until x leaves [current − band, current + 1 + band].
 */
export function scrollStop(x: number, current: number, n = PROJECTS, band = DEAD_BAND): number {
  if (x >= current - band && x <= current + 1 + band) return current;
  return Math.min(n - 1, Math.max(0, Math.floor(x)));
}

/** Pinned-section progress 0..1 from its bounding rect. */
export function pinProgress(rectTop: number, rectHeight: number, viewportHeight: number): number {
  const travel = rectHeight - viewportHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, -rectTop / travel));
}
