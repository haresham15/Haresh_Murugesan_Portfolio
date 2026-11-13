/**
 * Pure-logic checks for the Recognition orbit.
 * Run: node --experimental-strip-types src/v7/recognition/orbit.test.ts
 */
import assert from 'node:assert/strict';
// @ts-ignore -- node needs the extension; the app resolves without it.
import * as o from './orbit.ts';
// @ts-ignore -- node needs the extension; the app resolves without it.
import { brushTerm, makeLight } from './shade.ts';

const near = (a: number, b: number, eps = 1e-9, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} expected ${b}, got ${a}`);

let passed = 0;
const test = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};

test('geometry: active min(72vh, 52vw), ellipse 46vw x 6vh', () => {
  const g = o.geometry(1440, 900);
  assert.equal(g.d, Math.round(Math.min(648, 748.8)));
  near(g.a, 331.2, 1e-9);
  near(g.b, 27, 1e-9);
  assert.equal(o.geometry(390, 844).d, Math.round(390 * 0.52));
});

test('orbit positions: N medals spaced 2pi/N, front at z=0', () => {
  for (const n of [2, 3, 5]) {
    const g = { a: 100, b: 10 };
    const front = o.slot(0, 0, n, g);
    near(front.x, 0, 1e-9);
    near(front.y, 10, 1e-9);
    near(front.z, 0, 1e-9);
    let zs = 0;
    for (let i = 0; i < n; i++) zs += o.slot(i, 0, n, g).z;
    near(zs, n / 2, 1e-9, `mean depth n=${n}`); // cosines sum to 0 for n >= 2
    // s = 1 brings medal 1 to the front.
    near(o.slot(1, 1, n, g).z, 0, 1e-9);
  }
  // N = 3: back medals at +-120 degrees.
  const g = { a: 100, b: 10 };
  near(o.slot(1, 0, 3, g).x, 100 * Math.sin((2 * Math.PI) / 3), 1e-9);
  near(o.slot(1, 0, 3, g).z, 0.75, 1e-9);
  near(o.slot(2, 0, 3, g).x, -100 * Math.sin((2 * Math.PI) / 3), 1e-9);
  // N = 2: the other medal is straight behind.
  near(o.slot(1, 0, 2, g).z, 1, 1e-9);
  near(o.slot(1, 0, 2, g).y, -10, 1e-9);
});

test('depth -> scale 1-0.55z, blur 8z, brightness 1-0.5z', () => {
  assert.deepEqual(o.depthLook(0), { scale: 1, blur: 0, brightness: 1 });
  const back = o.depthLook(1);
  near(back.scale, 0.45);
  near(back.blur, 8);
  near(back.brightness, 0.5);
  const mid = o.depthLook(0.75);
  near(mid.scale, 1 - 0.4125);
  near(mid.blur, 6);
  near(mid.brightness, 0.625);
});

test('level crossfade weights are continuous in z', () => {
  assert.deepEqual(o.levelOpacities(0), [1, 0, 0]);
  assert.deepEqual(o.levelOpacities(0.5), [1, 1, 0]);
  assert.deepEqual(o.levelOpacities(0.75), [0, 1, 0.5]);
  assert.deepEqual(o.levelOpacities(1), [0, 1, 1]);
  // Just either side of 0.5: the visible result (top layer over opaque bottom) matches.
  const a = o.levelOpacities(0.5 - 1e-9);
  const b = o.levelOpacities(0.5 + 1e-9);
  near(a[1], 1, 1e-6);
  near(b[2], 0, 1e-6);
});

test('spin: one full turn per position, 0 at rest', () => {
  near(o.spinDeg(0), 0);
  near(o.spinDeg(3), 0);
  near(o.spinDeg(0.25), -90);
  near(o.spinDeg(1.5), -180);
  near(o.spinDeg(-0.25), -270); // same visual as +90
});

test('shortest delta wraps both ways', () => {
  assert.equal(o.shortestDelta(0, 2, 3), -1);
  assert.equal(o.shortestDelta(2, 0, 3), 1);
  assert.equal(o.shortestDelta(0, 1, 3), 1);
  assert.equal(o.shortestDelta(1, 4, 5), -2);
  assert.equal(o.mod(-1, 3), 2);
});

test('spring (90, 16): overshoot under 1 degree of orbit, settles', () => {
  for (const n of [2, 3, 5]) {
    const st = { x: 0, v: 0 };
    let peak = 0;
    let t = 0;
    let settledAt = -1;
    for (; t < 3000; t += 16.67) {
      o.springStep(st, 1, 16.67);
      peak = Math.max(peak, st.x);
      if (settledAt < 0 && o.settled(st, 1)) settledAt = t;
    }
    const overshootDeg = (peak - 1) * (360 / n);
    assert.ok(overshootDeg > 0 && overshootDeg < 1, `n=${n} overshoot ${overshootDeg.toFixed(3)} deg`);
    assert.ok(settledAt > 0 && settledAt < 1200, `n=${n} settled at ${settledAt}`);
  }
  // Within the 120-640 ms window the orbit is visually there (within 3% of a step).
  const st = { x: 0, v: 0 };
  for (let t = 0; t < 520; t += 16.67) o.springStep(st, 1, 16.67);
  assert.ok(Math.abs(1 - st.x) < 0.03, `at 520 ms x=${st.x}`);
  // dt is clamped to 1/30 s.
  const a = { x: 0, v: 0 };
  const b = { x: 0, v: 0 };
  o.springStep(a, 1, 500);
  o.springStep(b, 1, 1000 / 30);
  assert.deepEqual(a, b);
});

test('step timeline: 0-120 unseat, 120-640 orbit, 560-900 seat, sweep 420 ms', () => {
  const at = (t: number) => o.stepFrame(t);
  assert.equal(at(0).text, 'exit');
  assert.equal(at(0).orbit, false);
  near(at(0).unseat, 0);
  near(at(120).unseat, 1);
  assert.equal(at(119).orbit, false);
  assert.equal(at(120).orbit, true);
  assert.equal(at(300).text, 'hidden');
  assert.equal(at(560).text, 'reveal');
  assert.equal(at(559).sweep, null);
  near(at(560).sweep as number, 0);
  near(at(770).sweep as number, 0.5);
  assert.equal(at(980).sweep, null);
  assert.equal(at(979).done, false);
  assert.equal(at(980).done, true);
  near(at(900).seat, 1);
  // Live shader: fades out while unseating, off in orbit, back during the seat.
  near(at(0).live, 1);
  near(at(300).live, 0);
  near(at(720).live, 1);
});

test('seat factors: 1 -> 0.96 out, 1.02 -> 1 in', () => {
  const f = o.stepFrame;
  near(o.seatFactor(f(0), true, false), 1);
  near(o.seatFactor(f(120), true, false), 0.96);
  near(o.seatFactor(f(900), true, false), 1);
  near(o.seatFactor(f(120), false, true), 1);
  near(o.seatFactor(f(560), false, true), 1.02);
  near(o.seatFactor(f(900), false, true), 1);
  near(o.seatFactor(f(300), false, false), 1);
  // Released back onto the same medal: 0.96 grows through 1.02 and seats.
  near(o.seatFactor(f(120), true, true), 0.96);
  near(o.seatFactor(f(560), true, true), 1.02);
  // Continuous across the 560 ms hand-off.
  near(o.seatFactor(f(559.999), false, true), o.seatFactor(f(560), false, true), 1e-4);
});

test('light sweep: 140 degrees in 420 ms, ending on the pointer', () => {
  near(o.sweepOffset(0), (-140 * Math.PI) / 180);
  near(o.sweepOffset(1), 0);
  near(o.sweepOffset(null), 0);
  near(o.sweepBoost(0.5), 1);
  near(o.sweepBoost(null), 0);
});

test('drag release uses projected velocity, like the wheel', () => {
  assert.equal(o.releaseTarget(0.4, 0, 3, 0), 0);
  assert.equal(o.releaseTarget(0.6, 0, 3, 0), 1);
  assert.equal(o.releaseTarget(0.2, 3, 3, 0), 1); // 0.2 + 0.54 -> 1
  assert.equal(o.releaseTarget(0.2, -4, 3, 0), -1); // 0.2 - 0.72 -> -1
  assert.equal(o.releaseTarget(0.2, 40, 3, 0), 2); // clamped to N - 1
  assert.equal(o.releaseTarget(0.2, 40, 5, 0), 4);
  assert.equal(o.releaseTarget(1.2, -40, 3, 1), -1);
  const samples = [
    { t: 0, s: 0 },
    { t: 50, s: 0.1 },
    { t: 100, s: 0.2 },
    { t: 150, s: 0.3 },
  ];
  near(o.sampleVelocity(samples), 2, 1e-9);
  near(o.sampleVelocity([{ t: 0, s: 0 }]), 0);
  // One to one at the front: a drag of pxPerPosition moves exactly one medal.
  const g = o.geometry(1440, 900);
  const px = o.pxPerPosition(g.a, 3);
  near(o.slot(0, px / o.pxPerPosition(g.a, 3), 3, g).z, o.slot(0, 1, 3, g).z);
  // Small drags track the finger at the front: dx/ds = a * 2pi/N.
  const ds = 1e-5;
  near((o.slot(1, 1 - ds, 3, g).x - o.slot(1, 1, 3, g).x) / ds, px, 1e-2);
});

test('radial brushing is cos(2(phi - phi_light))^24', () => {
  near(brushTerm(1, 0, 1, 0), 1);
  near(brushTerm(-1, 0, 1, 0), 1); // bow tie: both sides of the centre
  near(brushTerm(0, 1, 1, 0), 1); // cos(pi)^24 = 1 at 90 degrees
  near(brushTerm(Math.SQRT1_2, Math.SQRT1_2, 1, 0), 0, 1e-12); // 45 degrees: dark
  const phi = 0.2;
  near(brushTerm(Math.cos(phi), Math.sin(phi), 1, 0), Math.pow(Math.cos(2 * phi), 24), 1e-12);
  const L = makeLight(0.6, 0, 0);
  near(Math.hypot(L.x, L.y, L.z), 1, 1e-12);
  near(L.ax, 1);
  const R = makeLight(0.6, 0, Math.PI / 2);
  near(R.ax, 0, 1e-12);
  near(R.ay, 1, 1e-12);
});

console.log(`\n${passed} passed`);
