/**
 * Run: node --experimental-strip-types src/v7/now/focus.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error -- Node's type stripping needs the .ts extension; the app's tsconfig does not allow it.
import * as F from './focus.ts';

const { stopFromProgress, progressForStop, copyWeights, copyOpacities, breath, sceneScale, snapStop, focusFromDrag, springStep } =
  F as typeof import('./focus');

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('scroll progress → stop: raw stop with no history', () => {
  assert.equal(stopFromProgress(0, null), 0);
  assert.equal(stopFromProgress(0.32, null), 0);
  assert.equal(stopFromProgress(0.34, null), 1);
  assert.equal(stopFromProgress(0.7, null), 2);
  assert.equal(stopFromProgress(1, null), 2);
  assert.equal(stopFromProgress(-0.4, null), 0);
  assert.equal(stopFromProgress(1.4, null), 2);
});

test('scroll progress → stop: ±8% dead band around each boundary', () => {
  // Leaving stop 0 needs 1/3 + 0.08
  assert.equal(stopFromProgress(0.36, 0), 0);
  assert.equal(stopFromProgress(0.41, 0), 0);
  assert.equal(stopFromProgress(0.414, 0), 1);
  // Coming back from stop 1 needs 1/3 - 0.08
  assert.equal(stopFromProgress(0.30, 1), 1);
  assert.equal(stopFromProgress(0.26, 1), 1);
  assert.equal(stopFromProgress(0.25, 1), 0);
  // Upper boundary at 2/3
  assert.equal(stopFromProgress(0.74, 1), 1);
  assert.equal(stopFromProgress(0.75, 1), 2);
  assert.equal(stopFromProgress(0.6, 2), 2);
  assert.equal(stopFromProgress(0.58, 2), 1);
  // A jump crosses several boundaries at once
  assert.equal(stopFromProgress(1, 0), 2);
  assert.equal(stopFromProgress(0, 2), 0);
});

test('scroll progress → stop: jittering across a boundary never flutters', () => {
  let s = 0;
  const seen = new Set<number>();
  for (let i = 0; i < 400; i++) {
    const p = 1 / 3 + Math.sin(i * 1.7) * 0.07; // ±7% around the boundary
    s = stopFromProgress(p, s);
    seen.add(s);
  }
  assert.deepEqual([...seen], [0]);
});

test('a stop centre maps back to that stop from any history', () => {
  for (let i = 0; i < 3; i++) {
    for (const prev of [null, 0, 1, 2]) assert.equal(stopFromProgress(progressForStop(i), prev), i);
  }
  near(progressForStop(1), 0.5);
});

test('copy weights sum to 1 and hit the pure copies at 0, 1, 2', () => {
  assert.deepEqual(copyWeights(0), [1, 0, 0]);
  assert.deepEqual(copyWeights(1), [0, 1, 0]);
  assert.deepEqual(copyWeights(2), [0, 0, 1]);
  assert.deepEqual(copyWeights(-1), [0, 1, 0]);
  assert.deepEqual(copyWeights(3), [0, 0, 1]);
  for (let d = 0; d <= 2; d += 0.05) {
    const w = copyWeights(d);
    near(w[0] + w[1] + w[2], 1);
    assert.ok(w.every((x) => x >= 0 && x <= 1));
    assert.ok(w[0] === 0 || w[2] === 0, 'never mixes sharp with 12 px');
  }
  const mid = copyWeights(0.5);
  near(mid[0], 0.5);
  near(mid[1], 0.5);
});

test('copy opacities: sharp at the focal plane, equal-power in between', () => {
  const [s, b6, b12] = copyOpacities(0);
  near(s, 1);
  near(b6, 0);
  near(b12, 0);
  // Mid-rack coverage of two stacked copies stays well above a linear crossfade's 0.75
  const [a, b] = copyOpacities(0.5).map((o, i) => o / [1, 0.82, 0.62][i]);
  assert.ok(1 - (1 - a) * (1 - b) > 0.9);
  near(copyOpacities(2)[2], 0.62);
  near(copyOpacities(1)[1], 0.82);
});

test('focus breathing: 1 at stops, 1.03 halfway', () => {
  near(sceneScale(0), 1);
  near(sceneScale(1), 1);
  near(sceneScale(2), 1);
  near(sceneScale(0.5), 1.03);
  near(sceneScale(1.5), 1.03);
  near(breath(0.25), Math.sin(Math.PI / 4));
});

test('snap with velocity projection', () => {
  assert.equal(snapStop(0.4, 0), 0);
  assert.equal(snapStop(0.6, 0), 1);
  // A flick toward far carries past the nearest stop
  assert.equal(snapStop(0.4, 1), 1); // 0.4 + 0.18
  assert.equal(snapStop(0.9, 4), 2); // 0.9 + 0.72
  assert.equal(snapStop(1.2, -4), 0); // 1.2 - 0.72
  // Clamped to the three stops
  assert.equal(snapStop(1.9, 50), 2);
  assert.equal(snapStop(0.1, -50), 0);
});

test('drag maps pixels to focus, right turns the ring toward near', () => {
  near(focusFromDrag(1, 0, 300), 1);
  near(focusFromDrag(1, 150, 300), 0.5);
  near(focusFromDrag(1, -300, 300), 2);
  near(focusFromDrag(1, -900, 300), 2);
  near(focusFromDrag(0, 900, 300), 0);
});

test('rack spring settles without visible overshoot in about half a second', () => {
  const s = { x: 0, v: 0 };
  let t = 0;
  let max = 0;
  while (!springStep(s, 1, 16.67) && t < 3000) {
    t += 16.67;
    max = Math.max(max, s.x);
  }
  assert.equal(s.x, 1);
  assert.equal(s.v, 0);
  assert.ok(max < 1.01, `overshoot ${max}`);
  assert.ok(t > 300 && t < 1000, `settled in ${t} ms`);
  // A zero-dt step (first frame after waking) does not move it
  const z = { x: 0.3, v: 0 };
  springStep(z, 1, 0);
  near(z.x, 0.3);
});
