---
name: v7-motion
description: Portfolio V7 motion runtime. Use before writing any animation, canvas loop, drag, spring, pinned scroll, or pointer-reactive effect in this repo. Covers the shared requestAnimationFrame scheduler, the eased pointer store, quality tiers, spring constants, the reduced-motion contract and the performance budget.
---

# V7 motion

Spec: `docs/v7-blueprint.md`. No GSAP, Lenis, three.js or smooth-scroll library. Native scroll only. `framer-motion` is already on the page; prefer CSS transitions and the scheduler for anything per-frame.

## One scheduler — `src/v7/runtime/scheduler.ts`

Never call `requestAnimationFrame` yourself.

```ts
import { register } from '@/v7/runtime/scheduler';
const task = register(({ now, dt }) => {
  // dt: ms since this task last ran (0 on the first frame after waking, max 64)
  step(dt);
  return stillMoving; // true = run next frame; anything else = sleep until task.wake()
}, { element: sectionEl, budgeted: true });
task.wake();      // after input, prop change, resize
task.dispose();   // in the effect cleanup
```

- `element`: observed by one shared IntersectionObserver. Off screen, the task does not run; it wakes when it scrolls back in (`wakeOnVisible`, default true).
- `budgeted` (default true): counts toward **MAX_ANIMATING = 2**. When more budgeted tasks are awake and visible, the two with the largest visible area run; the rest wait. Every canvas is budgeted. Pointer easing, CarbonField and scroll-driven SVG are not.
- Sleep whenever you are settled. A still canvas costs nothing.
- 2D canvases: use `useCanvasStage(containerRef, canvasRef, draw, { animate })` from `src/hooks/useCanvasStage.ts`; it already registers with the scheduler. Return `false` from `draw` to sleep; call the returned `invalidate()` to wake.

## One pointer — `src/v7/runtime/pointer.ts`

The visitor is the light. Every light-reactive effect reads the same eased pointer.

```ts
import { getPointer, subscribePointer } from '@/v7/runtime/pointer';
const p = getPointer();          // { x, y, nx, ny, vx, vy, rawX, rawY, inside, kind, lastMoveAt }
const off = subscribePointer((p) => task.wake()); // fires on every eased step
```

Viewport CSS px; `nx`/`ny` run −1..1; 90 ms easing time constant. Use `rawX/rawY` only for direct manipulation (drag); use `x/y` for light. When `inside` is false (or `kind === 'touch'`), fall back to an idle path (for example a slow figure-eight).

## Quality tiers — `src/v7/runtime/tier.ts`

`useQualityTier()` returns `'full' | 'lite' | 'static' | null` (null until the 500 ms probe finishes).

| Tier | Meaning |
|---|---|
| full | shaders at DPR ≤ 1.5, glints and specular sweeps on |
| lite | shaders at DPR 1, no glints |
| static | no WebGL; CSS materials; still images for shader-made objects |

Reduced motion always returns `'static'`. `?tier=full|lite|static` overrides the probe for tests. Cap DPR at 1.5 for every canvas.

## Springs

Integrate with semi-implicit Euler at `dt/1000`, clamped to 1/30 s. `x'' = (k(target − x) − c·x') / m`.

| Mechanism | k | c | m | Notes |
|---|---|---|---|---|
| Works wheel θ | 220 | 26 | 1 | ζ ≈ 0.88, settles ~450 ms; detent torque −A·sin(8θ) while dragging; release target round((θ + 0.18ω)/45°)·45° |
| Syntinuum bulb x | 120 | 20 | 1 | tilt ≤ 8° ∝ velocity; 4px bob at 0.5 Hz at rest |
| Recognition orbit | 90 | 16 | 1 | overshoot < 1° |
| Pointer easing | — | — | — | exponential, τ = 90 ms (store does it) |

Settle when |x − target| and |v| are both below a visible threshold, snap, and sleep.

## Reduced motion — a complete path, not a degraded one

Read `useMotionPreference().isReduced` from `src/components/MotionPreference.tsx` (honours the OS setting and the site toggle; adds `html.reduced-motion`).

- **No pins.** Pinned sections render as normal flow; scroll-driven stops become ordinary click/key controls.
- **No shutters, irises, orbits, racks, springs or parallax.** State changes are 200 ms opacity crossfades only.
- The global CSS kills transitions under reduced motion. Add `.rm-crossfade` to an element to keep a 200 ms crossfade.
- Every mechanism stays fully usable by click, touch and keyboard.

## Inputs

Every mechanism works by pointer, touch and keyboard. Use Pointer Events with `setPointerCapture` for drags, `touch-action` set on the drag surface only (never block page scroll elsewhere), and real controls (`role="tablist"` + `role="tab"`, arrow keys, Home/End) for keyboard. Mechanisms set `data-cursor="rotate|hairline|grab|focus"` on their root so the cursor dot changes shape.

## Pinned scroll

Use `position: sticky` inside a tall section (as `ExperienceCircuit` does). Progress = `−rect.top / (rect.height − viewportHeight)`. Use a ±8% dead band around stop midpoints so the state never flutters. At most three pinned sections on the page (Works, Experience, Now). Show a visible progress cue while pinned.

## Performance budget

- 60 fps on a mid-range laptop; no main-thread task over 50 ms during scroll at 4× CPU throttle.
- LCP < 2.5 s, CLS < 0.05, INP < 200 ms.
- < 60 KB gzipped of new JS across all of V7. Lazy-load section code with `next/dynamic` where it is below the fold.
- Never animate `filter: blur()` or layout properties per frame. Animate `transform` and `opacity`; pre-render blurred copies.
- Rasterise once, cache bitmaps, reuse them. One live shader per mechanism at most.
- Static export: no runtime server, no API routes. Everything resolves at build time.
