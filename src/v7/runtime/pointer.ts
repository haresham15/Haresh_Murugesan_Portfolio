/**
 * One eased pointer for the whole site. CarbonField, the medallion shader, the tool wall
 * and the cursor all read it, so the light feels like one lamp.
 *
 * Coordinates are viewport CSS px. nx / ny run -1..1 across the viewport.
 * The eased position follows the raw one with a 90 ms time constant.
 */
import { register, type TaskHandle } from './scheduler';

export type PointerKind = 'mouse' | 'pen' | 'touch' | 'none';

export interface PointerState {
  /** Eased position, viewport px. */
  x: number;
  y: number;
  /** Eased position normalised to -1..1. */
  nx: number;
  ny: number;
  /** Eased velocity, px / s. */
  vx: number;
  vy: number;
  /** Latest raw position, viewport px. */
  rawX: number;
  rawY: number;
  /** False until the first move, and after the pointer leaves the window. */
  inside: boolean;
  kind: PointerKind;
  /** performance.now() of the last raw move; 0 if never. */
  lastMoveAt: number;
}

export const POINTER_TAU_MS = 90;

type Listener = (state: Readonly<PointerState>) => void;

const state: PointerState = {
  x: 0, y: 0, nx: 0, ny: 0, vx: 0, vy: 0, rawX: 0, rawY: 0,
  inside: false, kind: 'none', lastMoveAt: 0,
};
const listeners = new Set<Listener>();
let task: TaskHandle | null = null;
let started = false;

function normalise() {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  state.nx = (state.x / w) * 2 - 1;
  state.ny = (state.y / h) * 2 - 1;
}

function emit() {
  for (const l of listeners) l(state);
}

function step({ dt }: { dt: number }): boolean {
  const k = dt > 0 ? 1 - Math.exp(-dt / POINTER_TAU_MS) : 1;
  const px = state.x;
  const py = state.y;
  state.x += (state.rawX - state.x) * k;
  state.y += (state.rawY - state.y) * k;
  if (dt > 0) {
    state.vx = ((state.x - px) / dt) * 1000;
    state.vy = ((state.y - py) / dt) * 1000;
  }
  const settled = Math.abs(state.rawX - state.x) < 0.1 && Math.abs(state.rawY - state.y) < 0.1;
  if (settled) {
    state.x = state.rawX;
    state.y = state.rawY;
    state.vx = 0;
    state.vy = 0;
  }
  normalise();
  emit();
  return !settled;
}

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  state.rawX = state.x = window.innerWidth / 2;
  state.rawY = state.y = window.innerHeight / 2;
  normalise();
  task = register(step, { budgeted: false, wakeOnVisible: false });
  task.sleep();
  const onMove = (e: PointerEvent) => {
    state.rawX = e.clientX;
    state.rawY = e.clientY;
    state.kind = (e.pointerType as PointerKind) || 'mouse';
    state.lastMoveAt = performance.now();
    if (!state.inside) {
      state.inside = true;
      // First contact: jump instead of sweeping in from the centre.
      state.x = state.rawX;
      state.y = state.rawY;
    }
    task?.wake();
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    state.inside = false;
    emit();
  });
}

export function getPointer(): Readonly<PointerState> {
  start();
  return state;
}

/** Called on every eased step and when the pointer leaves. Returns an unsubscribe. */
export function subscribePointer(listener: Listener): () => void {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}
