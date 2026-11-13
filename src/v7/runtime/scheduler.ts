/**
 * One requestAnimationFrame loop for the whole site.
 *
 * Every animated thing registers a task. A task runs only while it is awake and its
 * element (if any) intersects the viewport. Returning `true` from the frame callback
 * keeps it awake; anything else puts it to sleep until `wake()`.
 *
 * Budget: at most MAX_ANIMATING budgeted tasks (canvases) run in one frame. When more
 * are awake and visible, the ones with the largest visible area win; the rest wait.
 * Unbudgeted tasks (pointer easing, the CarbonField redraw, scroll-driven SVG) always run.
 */

export const MAX_ANIMATING = 2;

export interface FrameInfo {
  /** rAF timestamp, ms. */
  now: number;
  /** ms since this task last ran, clamped to 64. 0 on the first frame after waking. */
  dt: number;
}

export type FrameFn = (frame: FrameInfo) => boolean | void;

export interface TaskOptions {
  /** Observed with IntersectionObserver; the task pauses while it is off screen. */
  element?: Element | null;
  /** Counts toward MAX_ANIMATING. Default true. */
  budgeted?: boolean;
  /** Wake automatically when the element scrolls back into view. Default true. */
  wakeOnVisible?: boolean;
  /** Ties in the budget go to the higher priority. Default 0. */
  priority?: number;
}

export interface TaskHandle {
  wake(): void;
  sleep(): void;
  dispose(): void;
  isVisible(): boolean;
}

interface Task {
  fn: FrameFn;
  element: Element | null;
  budgeted: boolean;
  wakeOnVisible: boolean;
  priority: number;
  awake: boolean;
  visible: boolean;
  ratio: number;
  last: number;
  disposed: boolean;
}

const tasks = new Set<Task>();
const byElement = new Map<Element, Set<Task>>();
let raf = 0;
let io: IntersectionObserver | null = null;
let listening = false;

const THRESHOLDS = [0, 0.01, 0.1, 0.25, 0.5, 0.75, 1];

function observer(): IntersectionObserver | null {
  if (io || typeof IntersectionObserver === 'undefined') return io;
  io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const set = byElement.get(entry.target);
      if (!set) continue;
      for (const t of set) {
        const was = t.visible;
        t.visible = entry.isIntersecting && entry.intersectionRatio > 0;
        t.ratio = entry.intersectionRatio;
        if (t.visible && !was && t.wakeOnVisible) t.awake = true;
      }
    }
    request();
  }, { threshold: THRESHOLDS });
  return io;
}

function listen() {
  if (listening || typeof document === 'undefined') return;
  listening = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      for (const t of tasks) t.last = 0;
    } else {
      request();
    }
  });
}

function request() {
  if (raf || typeof window === 'undefined' || document.hidden) return;
  raf = requestAnimationFrame(loop);
}

function loop(now: number) {
  raf = 0;
  const free: Task[] = [];
  const budgeted: Task[] = [];
  for (const t of tasks) {
    if (!t.awake || !t.visible) continue;
    (t.budgeted ? budgeted : free).push(t);
  }
  if (budgeted.length > MAX_ANIMATING) {
    budgeted.sort((a, b) => b.ratio - a.ratio || b.priority - a.priority);
    for (let i = MAX_ANIMATING; i < budgeted.length; i++) budgeted[i].last = 0;
    budgeted.length = MAX_ANIMATING;
  }
  let again = false;
  for (const t of [...free, ...budgeted]) {
    const dt = t.last ? Math.min(now - t.last, 64) : 0;
    t.last = now;
    let keep: boolean | void = false;
    try {
      keep = t.fn({ now, dt });
    } catch (err) {
      console.error('[scheduler] task threw; it has been put to sleep', err);
      keep = false;
    }
    if (t.disposed) continue;
    if (keep === true) again = true;
    else { t.awake = false; t.last = 0; }
  }
  // Tasks starved by the budget are still awake: keep the loop alive for them.
  for (const t of tasks) if (t.awake && t.visible) again = true;
  if (again) request();
}

export function register(fn: FrameFn, options: TaskOptions = {}): TaskHandle {
  listen();
  const element = options.element ?? null;
  const task: Task = {
    fn,
    element,
    budgeted: options.budgeted ?? true,
    wakeOnVisible: options.wakeOnVisible ?? true,
    priority: options.priority ?? 0,
    awake: true,
    visible: element === null || typeof IntersectionObserver === 'undefined',
    ratio: element === null ? 1 : 0,
    last: 0,
    disposed: false,
  };
  tasks.add(task);
  if (element) {
    let set = byElement.get(element);
    if (!set) {
      set = new Set();
      byElement.set(element, set);
      observer()?.observe(element);
    }
    set.add(task);
  }
  request();
  return {
    wake() {
      if (task.disposed) return;
      task.awake = true;
      request();
    },
    sleep() {
      task.awake = false;
      task.last = 0;
    },
    dispose() {
      task.disposed = true;
      tasks.delete(task);
      if (element) {
        const set = byElement.get(element);
        set?.delete(task);
        if (set && set.size === 0) {
          byElement.delete(element);
          io?.unobserve(element);
        }
      }
    },
    isVisible: () => task.visible,
  };
}

/** Number of tasks currently registered; for tests and the debug overlay. */
export function taskCount(): number {
  return tasks.size;
}
