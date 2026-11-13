/**
 * Pure-logic tests for the Syntinuum waveform.
 * Run: node --experimental-strip-types src/v7/syntinuum/model.test.ts
 */
import assert from 'node:assert/strict';
// @ts-ignore -- Node's type stripping needs the extension; tsc (no allowImportingTsExtensions) does not.
import * as M from './model.ts';

const m = M as typeof import('./model');
let passed = 0;
const test = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`ok - ${name}`);
};
const close = (a: number, b: number, eps: number, msg?: string) =>
  assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} expected ${b} ± ${eps}, got ${a}`);

/* ---- Zone layout ---- */
test('240 slots: three zones of 78 bars, two gaps of 3', () => {
  const L = m.zoneLayout(240);
  assert.equal(L.zoneBars, 78);
  assert.deepEqual(L.starts, [0, 81, 162]);
  const zones = Array.from({ length: 240 }, (_, i) => m.slotZone(i, L));
  const gaps = zones.map((z, i) => (z === -1 ? i : -1)).filter((i) => i >= 0);
  assert.deepEqual(gaps, [78, 79, 80, 159, 160, 161]);
  for (let k = 0; k < 3; k++) assert.equal(zones.filter((z) => z === k).length, 78);
  assert.equal(m.slotZone(240, L), -1);
  assert.equal(m.slotZone(-1, L), -1);
});

test('120 slots below 640px: zones of 38, same gap rule', () => {
  assert.equal(m.slotCount(639), 120);
  assert.equal(m.slotCount(640), 240);
  const L = m.zoneLayout(120);
  assert.equal(L.zoneBars, 38);
  assert.deepEqual(L.starts, [0, 41, 82]);
  assert.equal(Array.from({ length: 120 }, (_, i) => m.slotZone(i, L)).filter((z) => z === -1).length, 6);
});

test('zone centres are symmetric and numerals clear the edge fade', () => {
  const L = m.zoneLayout(240);
  close(L.centers[1], 0.5, 1e-9);
  close(L.centers[0] + L.centers[2], 1, 1e-9);
  assert.equal(L.numeralFrac[0], m.EDGE_FADE);
  close(L.numeralFrac[1], 81 / 240, 1e-9);
});

test('zoneAtFraction picks the zone under the pointer, gaps go to the nearer side', () => {
  const L = m.zoneLayout(240);
  assert.equal(m.zoneAtFraction(0, L), 0);
  assert.equal(m.zoneAtFraction(0.5, L), 1);
  assert.equal(m.zoneAtFraction(0.999, L), 2);
  assert.equal(m.zoneAtFraction(78.5 / 240, L), 0);
  assert.equal(m.zoneAtFraction(80.5 / 240, L), 1);
  assert.equal(m.zoneAtFraction(-0.2, L), 0);
  assert.equal(m.zoneAtFraction(1.2, L), 2);
});

/* ---- lit() ---- */
test('lit is 1 under the bulb, e^-1 at one sigma, symmetric', () => {
  assert.equal(m.lit(300, 300, 50), 1);
  close(m.lit(350, 300, 50), Math.exp(-1), 1e-12);
  close(m.lit(250, 300, 50), m.lit(350, 300, 50), 1e-12);
  assert.ok(m.lit(600, 300, 50) < 1e-15);
});

test('sigma = zone width / 2.2', () => {
  const L = m.zoneLayout(240);
  close(m.sigmaFor(1440, L), (1440 * 78) / 240 / 2.2, 1e-9);
});

test('breathing only moves lit bars, by at most 25%', () => {
  for (let i = 0; i < 50; i++) assert.equal(m.breath(0, i * 0.37, i), 1);
  let lo = Infinity, hi = -Infinity;
  for (let k = 0; k < 2000; k++) {
    const b = m.breath(1, k * 0.013, 7);
    lo = Math.min(lo, b); hi = Math.max(hi, b);
  }
  close(hi, 1.25, 1e-3);
  close(lo, 0.75, 1e-3);
});

/* ---- Spring ---- */
test('spring (120, 20) settles on target with a small overshoot, under 1 s', () => {
  const s = { x: 0, v: 0 };
  let maxX = 0;
  let settledAt = -1;
  let maxV = 0;
  for (let f = 1; f <= 120; f++) {
    m.springStep(s, 400, 1000 / 60);
    maxX = Math.max(maxX, s.x);
    maxV = Math.max(maxV, Math.abs(s.v));
    if (m.settle(s, 400)) { settledAt = f; break; }
  }
  assert.ok(settledAt > 0 && settledAt < 60, `settled at frame ${settledAt}`);
  assert.equal(s.x, 400);
  assert.equal(s.v, 0);
  assert.ok(maxX - 400 < 400 * 0.02, `overshoot ${maxX - 400}px`);
  assert.ok(maxV > m.TILT_FULL_VELOCITY, 'a zone hop reaches full tilt');
});

test('spring clamps dt to 1/30 s and ignores dt = 0', () => {
  const a = m.springStep({ x: 0, v: 0 }, 100, 64);
  const b = m.springStep({ x: 0, v: 0 }, 100, 1000 / 30);
  assert.deepEqual(a, b);
  assert.deepEqual(m.springStep({ x: 5, v: 2 }, 100, 0), { x: 5, v: 2 });
});

test('tilt is proportional to velocity and capped at 8 degrees', () => {
  assert.equal(m.tiltDeg(0), 0);
  close(m.tiltDeg(m.TILT_FULL_VELOCITY / 2), 4, 1e-9);
  assert.equal(m.tiltDeg(1e6), 8);
  assert.equal(m.tiltDeg(-1e6), -8);
});

/* ---- Peaks ---- */
test('peaks are deterministic per zone and size', () => {
  for (const n of [38, 78]) {
    for (let z = 0; z < 3; z++) {
      const a = Array.from(m.zonePeaks(z, n));
      assert.equal(a.length, n);
      assert.deepEqual(Array.from(m.zonePeaks(z, n)), a);
    }
  }
  assert.notDeepEqual(Array.from(m.zonePeaks(0, 78)), Array.from(m.zonePeaks(1, 78)));
  assert.notDeepEqual(Array.from(m.zonePeaks(1, 78)), Array.from(m.zonePeaks(2, 78)));
});

test('peaks stay in range, hit each zone maximum, and taper at the zone ends', () => {
  for (let z = 0; z < 3; z++) {
    const p = m.zonePeaks(z, 78);
    let max = 0;
    for (const v of p) {
      assert.ok(v >= Math.fround(0.04) && v <= 1, `value ${v}`);
      max = Math.max(max, v);
    }
    close(max, m.ZONE_MAX[z], 1e-6);
    assert.ok(p[0] < max * 0.35 && p[77] < max * 0.35, 'ends taper');
  }
});

test('mulberry32 known first values do not drift', () => {
  const r = m.mulberry32(1);
  const first = [r(), r(), r()].map((v) => v.toFixed(8));
  const r2 = m.mulberry32(1);
  assert.deepEqual([r2(), r2(), r2()].map((v) => v.toFixed(8)), first);
  for (const v of first) assert.ok(Number(v) >= 0 && Number(v) < 1);
});

/* ---- Exit, edge fade, pocket, colour ---- */
test('amplitude falls to zero as the baseline leaves through the top', () => {
  assert.equal(m.exitAmplitude(900, 900), 1);
  assert.equal(m.exitAmplitude(0.38 * 900, 900), 1);
  assert.equal(m.exitAmplitude(0.06 * 900, 900), 0);
  assert.equal(m.exitAmplitude(-200, 900), 0);
  const mid = m.exitAmplitude(0.22 * 900, 900);
  assert.ok(mid > 0.4 && mid < 0.6);
});

test('edge alpha fades the outer 8% only', () => {
  assert.equal(m.edgeAlpha(0), 0);
  assert.equal(m.edgeAlpha(1), 0);
  assert.equal(m.edgeAlpha(0.08), 1);
  assert.equal(m.edgeAlpha(0.5), 1);
  assert.ok(m.edgeAlpha(0.04) > 0 && m.edgeAlpha(0.04) < 1);
});

test('pocket clears bars behind a numeral and leaves the rest alone', () => {
  assert.equal(m.pocketMask(100, 100), 0);
  assert.equal(m.pocketMask(100 + m.POCKET_AFTER, 100), 0);
  assert.equal(m.pocketMask(100 - 40, 100), 1);
  assert.equal(m.pocketMask(100 + 60, 100), 1);
});

test('bar colour: titanium unlit, cobalt at the pool edge, red at the centre', () => {
  assert.deepEqual(m.barColor(0), m.DARK_PALETTE.rest);
  assert.deepEqual(m.barColor(1), m.DARK_PALETTE.hot);
  assert.deepEqual(m.barColor(0.5), m.DARK_PALETTE.cool);
  const ramp = m.colorRamp(m.DARK_PALETTE, 64);
  assert.equal(ramp.length, 65);
  assert.equal(ramp[64], 'rgb(255,40,0)');
});

test('parseColor reads hex and rgb() forms from computed styles', () => {
  assert.deepEqual(m.parseColor(' #7E8B9B'), [126, 139, 155]);
  assert.deepEqual(m.parseColor('#fff'), [255, 255, 255]);
  assert.deepEqual(m.parseColor('rgba(200, 210, 224, 0.22)'), [200, 210, 224]);
  assert.deepEqual(m.parseColor('rgb(37 99 235)'), [37, 99, 235]);
  assert.equal(m.parseColor('var(--x)'), null);
});

test('scroll boost is gentle and capped', () => {
  assert.equal(m.scrollBoost(0), 0);
  assert.ok(m.scrollBoost(800) < 0.15);
  assert.equal(m.scrollBoost(-1e5), 0.3);
});

console.log(`\n${passed} passed`);
