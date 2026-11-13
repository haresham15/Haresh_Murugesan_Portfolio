/**
 * Run: node --experimental-strip-types src/v7/works/wheelMath.test.ts
 * Pure-logic checks for the wheel spring, detent torque, release target and scroll stops.
 */
import assert from 'node:assert/strict';

type M = typeof import('./wheelMath');
type T = typeof import('./textState');

let failures = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    failures++;
    console.log(`FAIL ${name}\n     ${(err as Error).message}`);
  }
}

async function main() {
  // Dynamic import with an explicit extension so Node can resolve the .ts file directly.
  const m: M = await import('./wheelMath' + '.ts');
  const ts: T = await import('./textState' + '.ts');

  test('spring constants give a damping ratio near 0.88', () => {
    const zeta = m.SPRING.c / (2 * Math.sqrt(m.SPRING.k * m.SPRING.m));
    assert.ok(Math.abs(zeta - 0.88) < 0.01, `zeta ${zeta}`);
  });

  test('a 45° step settles in about 450 ms with one small overshoot', () => {
    const s = { theta: 0, omega: 0 };
    const target = -45;
    let t = 0;
    let minTheta = 0;
    let crossings = 0;
    let prevSign = Math.sign(target - s.theta);
    while (m.stepWheel(s, target, 1 / 60, false) && t < 3) {
      t += 1 / 60;
      minTheta = Math.min(minTheta, s.theta);
      const sign = Math.sign(target - s.theta);
      if (sign !== 0 && sign !== prevSign) { crossings++; prevSign = sign; }
    }
    const overshoot = target - minTheta;
    assert.equal(s.theta, target, 'snaps exactly to target');
    assert.ok(t > 0.3 && t < 0.75, `settled at ${(t * 1000).toFixed(0)} ms`);
    // ζ ≈ 0.88 overshoots by about 0.3% (0.15° on 45°); the settle snap may land first.
    assert.ok(overshoot > -0.06 && overshoot < 2, `overshoot ${overshoot.toFixed(3)}°`);
    assert.ok(crossings <= 2, `crossed the target ${crossings} times`);
    console.log(`     settle ${(t * 1000).toFixed(0)} ms, overshoot ${overshoot.toFixed(2)}°`);
  });

  test('the spring is stable at the clamped frame time', () => {
    const s = { theta: 0, omega: 0 };
    for (let i = 0; i < 200; i++) m.stepWheel(s, 90, 0.2, false); // dt clamps to 1/30
    assert.equal(s.theta, 90);
  });

  test('detent torque: stable notches at multiples of 45°, unstable halfway', () => {
    for (const a of [0, 45, 90, -135, 315]) assert.ok(Math.abs(m.detentTorque(a)) < 1e-6, `zero at ${a}`);
    assert.ok(m.detentTorque(5) < 0 && m.detentTorque(-5) > 0, 'restoring around 0°');
    assert.ok(m.detentTorque(40) > 0 && m.detentTorque(50) < 0, 'restoring around 45°');
    assert.ok(Math.abs(m.detentTorque(22.5)) < 1e-6 && m.detentTorque(23) > 0 && m.detentTorque(22) < 0, 'unstable at 22.5°');
  });

  test('dragging cogs: the wheel follows a slow hand monotonically, within ~6° of it', () => {
    const s = { theta: 0, omega: 0 };
    let hand = 0;
    let prev = 0;
    let maxLag = 0;
    let lead = 0;
    for (let i = 0; i < 600; i++) {
      hand += 0.15; // 9°/s at 60 fps
      for (let k = 0; k < 4; k++) m.stepWheel(s, hand, 1 / 240, true);
      assert.ok(s.theta >= prev - 1e-6, `went backwards at hand ${hand.toFixed(2)}`);
      prev = s.theta;
      maxLag = Math.max(maxLag, Math.abs(hand - s.theta));
      // near a notch the wheel should sit closer to the notch than the hand does
      if (Math.abs(m.angleDelta(hand, 45)) < 3) lead = Math.max(lead, Math.abs(hand - s.theta));
    }
    assert.ok(maxLag < 7, `max offset ${maxLag.toFixed(2)}°`);
    assert.ok(lead > 0.5, `notch pull ${lead.toFixed(2)}°`);
    console.log(`     max hand offset ${maxLag.toFixed(2)}°`);
  });

  test('release target projects 0.18 s of velocity and rounds to 45°', () => {
    assert.equal(m.releaseTarget(10, 0), 0);
    assert.equal(m.releaseTarget(30, 0), 45);
    assert.equal(m.releaseTarget(0, 300), 45); // 54° → 45
    assert.equal(m.releaseTarget(0, -700), -135); // −126° → −135, three projects
    assert.equal(m.releaseTarget(-90, 520), 0); // −90 + 93.6 → 0
  });

  test('sector and project at the apex', () => {
    assert.equal(m.sectorAt(0), 0);
    assert.equal(m.sectorAt(-45), 1);
    assert.equal(m.sectorAt(45), 7);
    assert.equal(m.projectAt(45), 3);
    assert.equal(m.projectAt(-180), 0);
    assert.equal(m.projectAt(-225), 1);
    assert.equal(m.projectAt(-21), 0);
    assert.equal(m.projectAt(-24), 1);
  });

  test('clicking a project takes the shortest way round', () => {
    assert.equal(m.angleForProject(0, 1), -45);
    assert.equal(m.angleForProject(0, 3), 45);
    assert.equal(Math.abs(m.angleForProject(0, 2)), 90);
    assert.equal(m.angleForProject(-720, 0), -720);
    assert.equal(m.angleForProject(-675, 0), -720 + 0 * 45 + 45 - 45 * 2 + 45 - 0); // sector 7 (project 3) → next is project 0 at −720
    for (let theta = -1000; theta <= 1000; theta += 45) {
      for (let p = 0; p < 4; p++) {
        const a = m.angleForProject(theta, p);
        assert.equal(m.projectAt(a), p, `θ ${theta} → project ${p}`);
        assert.ok(Math.abs(a - theta) <= 90, `θ ${theta} → ${a} is more than 90°`);
      }
    }
  });

  test('scroll stops hold inside the ±8% dead band', () => {
    assert.equal(m.scrollStop(0.5, 0), 0);
    assert.equal(m.scrollStop(1.05, 0), 0, 'inside the band past the boundary');
    assert.equal(m.scrollStop(1.09, 0), 1, 'past the band');
    assert.equal(m.scrollStop(0.95, 1), 1, 'coming back, still inside the band');
    assert.equal(m.scrollStop(0.91, 1), 0);
    assert.equal(m.scrollStop(3.9, 0), 3, 'a jump lands on the right stop');
    assert.equal(m.scrollStop(4, 3), 3);
    assert.equal(m.scrollStop(-0.5, 2), 0);
    // no flutter: oscillating ±5% around a boundary never changes the stop
    let stop = 1;
    for (let i = 0; i < 50; i++) stop = m.scrollStop(2 + 0.05 * Math.sin(i), stop);
    assert.equal(stop, 1);
  });

  test('pin progress', () => {
    assert.equal(m.pinProgress(0, 3000, 1000), 0);
    assert.equal(m.pinProgress(-1000, 3000, 1000), 0.5);
    assert.equal(m.pinProgress(-5000, 3000, 1000), 1);
    assert.equal(m.pinProgress(200, 3000, 1000), 0);
    assert.equal(m.pinProgress(0, 800, 1000), 0);
  });

  test('angleDelta wraps', () => {
    assert.equal(m.angleDelta(10, 350), 20);
    assert.equal(m.angleDelta(350, 10), -20);
    assert.equal(m.angleDelta(180, 0), 180);
  });

  test('copy gears with the apex sector and keeps one leaving layer', () => {
    let s = { apexSector: 0, shown: 0, leaving: null, dir: -1, seq: 0 } as ReturnType<T['textReducer']>;
    s = ts.textReducer(s, { type: 'apex', sector: 1, dir: -1, animate: true });
    assert.equal(s.shown, 1);
    assert.deepEqual(s.leaving, { project: 0, dir: -1, id: 1 });
    assert.equal(s.seq, 1);
    s = ts.textReducer(s, { type: 'apex', sector: 1, dir: -1, animate: true });
    assert.equal(s.seq, 1, 'same sector is a no-op');
    s = ts.textReducer(s, { type: 'apex', sector: 2, dir: -1, animate: true });
    assert.deepEqual(s.leaving, { project: 1, dir: -1, id: 2 }, 'a fast spin replaces the leaving layer');
    s = ts.textReducer(s, { type: 'settled', id: 1 });
    assert.ok(s.leaving, 'a stale settle is ignored');
    s = ts.textReducer(s, { type: 'settled', id: 2 });
    assert.equal(s.leaving, null);
    s = ts.textReducer(s, { type: 'apex', sector: 6, dir: 1, animate: true });
    assert.equal(s.shown, 2, 'sector 6 carries project 03 again: no turn');
    assert.equal(s.seq, 2);
    s = ts.textReducer(s, { type: 'apex', sector: 0, dir: 1, animate: false });
    assert.equal(s.shown, 0);
    assert.equal(s.leaving, null, 'landing on a scroll stop does not animate');
  });

  if (failures) {
    console.log(`\n${failures} failing`);
    process.exit(1);
  }
  console.log('\nall passing');
}

void main();
