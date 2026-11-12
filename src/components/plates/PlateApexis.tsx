import {
  C, clamp, drawGrid, drawVignette, easeOutCubic, glow, label, lerp, phosphor, ramp, rgba,
  type PlateDefinition, type PlateScene, type StageFrame,
} from './stageKit';

/* ============================================================
 * Lap model: closed centripetal Catmull-Rom circuit, curvature-limited
 * speed with forward (traction) and backward (braking) passes.
 * Two cars with different grip/power envelopes produce real deltas.
 * Everything here is a simulation, not recorded telemetry.
 * ============================================================ */

const N = 720;
const LAP_M = 5000;
const PLAYBACK = 5; // sim seconds per wall second

const CONTROL: [number, number][] = [
  [0.1, 0.62], [0.17, 0.3], [0.32, 0.17], [0.55, 0.2], [0.7, 0.11], [0.88, 0.2], [0.9, 0.42],
  [0.76, 0.52], [0.81, 0.74], [0.63, 0.87], [0.46, 0.72], [0.3, 0.87], [0.14, 0.84],
];

interface Car { aLat: number; aAcc: number; aBrk: number; vTop: number }
const CAR_A: Car = { aLat: 39, aAcc: 13.5, aBrk: 44, vTop: 91 };
const CAR_B: Car = { aLat: 37.6, aAcc: 14.2, aBrk: 42.5, vTop: 92.2 };

interface CarTrace { v: Float32Array; thr: Float32Array; brk: Float32Array; t: Float32Array; lap: number }
interface Lap {
  x: Float32Array; // normalized track coords
  y: Float32Array;
  ds: number; // metres per sample
  a: CarTrace;
  b: CarTrace;
  delta: Float32Array; // tB - tA at each sample
  sectorIdx: [number, number, number];
  sectorDelta: [number, number, number];
}

function catmull(points: [number, number][], samplesPer: number) {
  const out: [number, number][] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const d = (a: [number, number], b: [number, number]) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4;
    const t0 = 0;
    const t1 = t0 + d(p0, p1);
    const t2 = t1 + d(p1, p2);
    const t3 = t2 + d(p2, p3);
    for (let s = 0; s < samplesPer; s++) {
      const t = t1 + ((t2 - t1) * s) / samplesPer;
      const pt: [number, number] = [0, 0];
      for (let k = 0; k < 2; k++) {
        const A1 = ((t1 - t) / (t1 - t0)) * p0[k] + ((t - t0) / (t1 - t0)) * p1[k];
        const A2 = ((t2 - t) / (t2 - t1)) * p1[k] + ((t - t1) / (t2 - t1)) * p2[k];
        const A3 = ((t3 - t) / (t3 - t2)) * p2[k] + ((t - t2) / (t3 - t2)) * p3[k];
        const B1 = ((t2 - t) / (t2 - t0)) * A1 + ((t - t0) / (t2 - t0)) * A2;
        const B2 = ((t3 - t) / (t3 - t1)) * A2 + ((t - t1) / (t3 - t1)) * A3;
        pt[k] = ((t2 - t) / (t2 - t1)) * B1 + ((t - t1) / (t2 - t1)) * B2;
      }
      out.push(pt);
    }
  }
  return out;
}

function simulate(kappa: Float32Array, ds: number, car: Car): CarTrace {
  const vmax = new Float32Array(N);
  for (let i = 0; i < N; i++) vmax[i] = Math.min(car.vTop, Math.sqrt(car.aLat / Math.max(Math.abs(kappa[i]), 1e-6)));
  const v = new Float32Array(N);
  // forward pass, two laps so the start converges on a periodic solution
  let cur = vmax[0];
  for (let k = 1; k < 2 * N; k++) {
    const i = k % N;
    const acc = car.aAcc * Math.max(0, 1 - cur / car.vTop) + 0.4;
    cur = Math.min(vmax[i], Math.sqrt(cur * cur + 2 * acc * ds));
    if (k >= N) v[i] = cur;
  }
  v[0] = Math.min(v[0] || cur, vmax[0]);
  // backward pass
  for (let pass = 0; pass < 2; pass++) {
    for (let k = N - 1; k >= 0; k--) {
      const nxt = v[(k + 1) % N];
      v[k] = Math.min(v[k], Math.sqrt(nxt * nxt + 2 * car.aBrk * ds));
    }
  }
  const thr = new Float32Array(N);
  const brk = new Float32Array(N);
  const t = new Float32Array(N);
  let time = 0;
  for (let i = 0; i < N; i++) {
    const v0 = v[i];
    const v1 = v[(i + 1) % N];
    const aLong = (v1 * v1 - v0 * v0) / (2 * ds);
    if (aLong < -2) {
      brk[i] = clamp(-aLong / car.aBrk, 0, 1);
      thr[i] = 0;
    } else if (aLong > 0.6) {
      thr[i] = clamp(0.55 + aLong / (car.aAcc * 0.8), 0, 1);
    } else {
      thr[i] = 0.3 + 0.7 * (v0 / car.vTop) ** 2;
    }
    t[i] = time;
    time += ds / ((v0 + v1) / 2);
  }
  return { v, thr, brk, t, lap: time };
}

let lapCache: Lap | null = null;
function lap(): Lap {
  if (lapCache) return lapCache;
  const dense = catmull(CONTROL, 60);
  const cum = [0];
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1];
    const b = dense[i % dense.length];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = cum[cum.length - 1];
  const x = new Float32Array(N);
  const y = new Float32Array(N);
  let j = 0;
  for (let i = 0; i < N; i++) {
    const s = (total * i) / N;
    while (cum[j + 1] < s) j++;
    const f = (s - cum[j]) / (cum[j + 1] - cum[j]);
    const a = dense[j];
    const b = dense[(j + 1) % dense.length];
    x[i] = lerp(a[0], b[0], f);
    y[i] = lerp(a[1], b[1], f);
  }
  const ds = LAP_M / N;
  const head = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const k = (i + 1) % N;
    head[i] = Math.atan2(y[k] - y[i], x[k] - x[i]);
  }
  const raw = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let d = head[i] - head[(i - 1 + N) % N];
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    raw[i] = d / ds;
  }
  const kappa = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let k = -3; k <= 3; k++) s += raw[(i + k + N) % N];
    kappa[i] = s / 7;
  }
  const a = simulate(kappa, ds, CAR_A);
  const b = simulate(kappa, ds, CAR_B);
  const delta = new Float32Array(N);
  for (let i = 0; i < N; i++) delta[i] = b.t[i] - a.t[i];
  const s1 = Math.round(N / 3);
  const s2 = Math.round((2 * N) / 3);
  const end = (tr: CarTrace, i: number) => (i >= N ? tr.lap : tr.t[i]);
  const sec = (i0: number, i1: number) => end(b, i1) - b.t[i0] - (end(a, i1) - a.t[i0]);
  lapCache = {
    x, y, ds, a, b, delta,
    sectorIdx: [0, s1, s2],
    sectorDelta: [sec(0, s1), sec(s1, s2), sec(s2, N)],
  };
  return lapCache;
}

/** Index at which a car has covered `tau` seconds of its lap. */
function indexAtTime(tr: CarTrace, tau: number): number {
  const t = ((tau % tr.lap) + tr.lap) % tr.lap;
  let lo = 0;
  let hi = N - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (tr.t[mid] <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

const kmh = (ms: number) => Math.round(ms * 3.6);
const signed = (s: number, d = 3) => `${s >= 0 ? '+' : '−'}${Math.abs(s).toFixed(d)}`;
const sectorOf = (i: number, L: Lap) => (i < L.sectorIdx[1] ? 0 : i < L.sectorIdx[2] ? 1 : 2);

/* ---------- 1. oscilloscope ---------- */

function createScopeScene(): PlateScene {
  const L = lap();
  const box = { x0: 0, x1: 0 };
  const geo = (f: StageFrame) => {
    box.x0 = 50;
    box.x1 = f.width - 18;
  };
  const xOf = (i: number) => box.x0 + (i / (N - 1)) * (box.x1 - box.x0);

  return {
    idle(f) {
      geo(f);
      return [xOf(indexAtTime(L.a, f.time * PLAYBACK)), f.height * 0.5];
    },
    draw(ctx, f) {
      geo(f);
      const { width: w, height: h } = f;
      drawVignette(ctx, w, h);
      const intro = easeOutCubic(f.age / 0.7);
      const top = 34;
      const avail = h - top - 12;
      const ch = [
        { key: 'speed', h: 0.44, lo: 0, hi: 100 },
        { key: 'thr', h: 0.15, lo: 0, hi: 1 },
        { key: 'brk', h: 0.15, lo: 0, hi: 1 },
        { key: 'delta', h: 0.18, lo: 0, hi: 0 },
      ];
      let maxD = 0;
      for (let i = 0; i < N; i++) maxD = Math.max(maxD, Math.abs(L.delta[i]));
      ch[3].lo = -maxD * 1.15;
      ch[3].hi = maxD * 1.15;
      const gap = 8;
      const usable = avail - gap * (ch.length - 1);
      let yCursor = top;
      const rows = ch.map((c) => {
        const r = { ...c, y0: yCursor, y1: yCursor + usable * c.h / 0.92 };
        yCursor = r.y1 + gap;
        return r;
      });

      const idx = clamp(Math.round(((f.pointer.x - box.x0) / (box.x1 - box.x0)) * (N - 1)), 0, N - 1);
      const sec = sectorOf(idx, L);

      // sector bands
      for (let s = 0; s < 3; s++) {
        const i0 = L.sectorIdx[s];
        const i1 = s === 2 ? N - 1 : L.sectorIdx[s + 1];
        const x0 = xOf(i0);
        const x1 = xOf(i1);
        if (s === sec) {
          const g = ctx.createLinearGradient(0, top, 0, h);
          g.addColorStop(0, rgba(C.cobalt, 0.09));
          g.addColorStop(1, rgba(C.cobalt, 0.0));
          ctx.fillStyle = g;
          ctx.fillRect(x0, top - 18, x1 - x0, h - top + 18);
        }
        if (s > 0) {
          ctx.save();
          ctx.setLineDash([2, 4]);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = rgba(C.silver, 0.3);
          ctx.beginPath();
          ctx.moveTo(x0 + 0.25, top - 18);
          ctx.lineTo(x0 + 0.25, h - 10);
          ctx.stroke();
          ctx.restore();
        }
        const d = L.sectorDelta[s];
        label(ctx, `S${s + 1}`, x0 + 6, top - 8, s === sec ? C.alabaster : C.titanium, 10);
        label(ctx, `${signed(d)} s`, x0 + 26, top - 8, d >= 0 ? C.red : C.cobalt, 10);
      }

      const seriesY = (r: (typeof rows)[number], v: number) => r.y1 - ((v - r.lo) / (r.hi - r.lo)) * (r.y1 - r.y0);
      const reveal = Math.floor((N - 1) * intro);

      const trace = (r: (typeof rows)[number], arr: Float32Array, scale: number, color: string, core: number, halo: number) => {
        ctx.beginPath();
        for (let i = 0; i <= reveal; i++) {
          const x = xOf(i);
          const y = seriesY(r, arr[i] * scale);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        phosphor(ctx, color, core, halo);
      };

      rows.forEach((r, ri) => {
        // channel frame + gridlines
        ctx.save();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = rgba(C.silver, 0.1);
        ctx.beginPath();
        ctx.moveTo(box.x0, r.y1 + 0.25);
        ctx.lineTo(box.x1, r.y1 + 0.25);
        if (r.key === 'speed') {
          for (const kv of [100, 200, 300]) {
            const y = seriesY(r, kv / 3.6);
            ctx.moveTo(box.x0, y);
            ctx.lineTo(box.x1, y);
          }
        }
        if (r.key === 'delta') {
          const y = seriesY(r, 0);
          ctx.moveTo(box.x0, y);
          ctx.lineTo(box.x1, y);
        }
        ctx.stroke();
        ctx.restore();
        const name = ['speed', 'throttle', 'brake', 'gap'][ri];
        label(ctx, name, 8, r.y0 + 10, C.titanium, 9);
        if (r.key === 'speed') {
          for (const kv of [100, 200, 300]) label(ctx, String(kv), box.x0 - 6, seriesY(r, kv / 3.6) + 3, rgba(C.titanium, 0.8), 9, 'right');
        }

        if (r.key === 'speed') {
          // area under car A for depth
          const g = ctx.createLinearGradient(0, r.y0, 0, r.y1);
          g.addColorStop(0, rgba(C.red, 0.16));
          g.addColorStop(1, rgba(C.red, 0));
          ctx.beginPath();
          ctx.moveTo(xOf(0), r.y1);
          for (let i = 0; i <= reveal; i++) ctx.lineTo(xOf(i), seriesY(r, L.a.v[i]));
          ctx.lineTo(xOf(reveal), r.y1);
          ctx.closePath();
          ctx.fillStyle = g;
          ctx.fill();
          trace(r, L.b.v, 1, C.cobalt, 0.75, 0.1);
          trace(r, L.a.v, 1, C.red, 1, 0.12);
        } else if (r.key === 'thr') {
          trace(r, L.b.thr, 1, C.cobalt, 0.5, 0.06);
          trace(r, L.a.thr, 1, C.silver, 0.75, 0.08);
        } else if (r.key === 'brk') {
          trace(r, L.b.brk, 1, C.cobalt, 0.5, 0.06);
          trace(r, L.a.brk, 1, C.red, 0.75, 0.1);
        } else {
          // gap: fill red where car B is behind, cobalt where ahead
          const zero = seriesY(r, 0);
          for (const sign of [1, -1]) {
            ctx.beginPath();
            ctx.moveTo(xOf(0), zero);
            for (let i = 0; i <= reveal; i++) {
              const d = L.delta[i];
              ctx.lineTo(xOf(i), seriesY(r, sign > 0 ? Math.max(0, d) : Math.min(0, d)));
            }
            ctx.lineTo(xOf(reveal), zero);
            ctx.closePath();
            ctx.fillStyle = rgba(sign > 0 ? C.red : C.cobalt, 0.22);
            ctx.fill();
          }
          trace(r, L.delta, 1, C.silver, 0.5, 0.06);
        }
      });

      // persistence sweep: bright window behind the playhead
      const span = 70;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < span; k += 2) {
        const i = idx - k;
        if (i < 1) break;
        const al = (1 - k / span) * 0.5;
        const r0 = rows[0];
        ctx.strokeStyle = rgba(C.red, al);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xOf(i - 2), seriesY(r0, L.a.v[i - 2] ?? L.a.v[i]));
        ctx.lineTo(xOf(i), seriesY(r0, L.a.v[i]));
        ctx.stroke();
      }
      ctx.restore();

      // scrub line
      const sx = xOf(idx);
      ctx.save();
      const g = ctx.createLinearGradient(0, top - 18, 0, h);
      g.addColorStop(0, rgba(C.alabaster, 0));
      g.addColorStop(0.15, rgba(C.alabaster, 0.75));
      g.addColorStop(1, rgba(C.alabaster, 0.15));
      ctx.strokeStyle = g;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(sx + 0.25, top - 18);
      ctx.lineTo(sx + 0.25, h - 8);
      ctx.stroke();
      ctx.restore();
      const dots: [number, string][] = [
        [seriesY(rows[0], L.a.v[idx]), C.red],
        [seriesY(rows[0], L.b.v[idx]), C.cobalt],
        [seriesY(rows[1], L.a.thr[idx]), C.silver],
        [seriesY(rows[2], L.a.brk[idx]), C.red],
        [seriesY(rows[3], L.delta[idx]), C.silver],
      ];
      for (const [y, col] of dots) {
        glow(ctx, sx, y, 10, col, 0.55);
        ctx.fillStyle = C.alabaster;
        ctx.beginPath();
        ctx.arc(sx, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      const tagX = sx + 8 > w - 120 ? sx - 8 : sx + 8;
      const align: CanvasTextAlign = sx + 8 > w - 120 ? 'right' : 'left';
      label(ctx, `A ${kmh(L.a.v[idx])}`, tagX, rows[0].y0 + 12, C.red, 10, align);
      label(ctx, `B ${kmh(L.b.v[idx])}`, tagX, rows[0].y0 + 25, C.cobalt, 10, align);

      label(ctx, 'simulated lap · car A vs car B', w - 18, 14, C.titanium, 9, 'right');

      return `S${sec + 1} · ${((idx * L.ds) / 1000).toFixed(2)} km · A ${kmh(L.a.v[idx])} · B ${kmh(L.b.v[idx])} km/h · gap ${signed(L.delta[idx])} s`;
    },
  };
}

/* ---------- 2. track map with sector deltas ---------- */

function createTrackScene(): PlateScene {
  const L = lap();
  const map = { ox: 0, oy: 0, k: 1 };
  const fit = (f: StageFrame) => {
    // circuit spans x 0.10–0.90, y 0.11–0.87 in control space
    const pad = 44;
    map.k = Math.min((f.width - pad * 2) / 0.8, (f.height - pad * 2 - 16) / 0.76);
    map.ox = f.width / 2 - 0.5 * map.k;
    map.oy = f.height / 2 - 0.49 * map.k - 4;
  };
  const px = (i: number) => map.ox + L.x[i] * map.k;
  const py = (i: number) => map.oy + L.y[i] * map.k;
  // d(gap)/ds: where car B loses (+) or gains (−) time
  const rate = new Float32Array(N);
  let maxRate = 0;
  for (let i = 0; i < N; i++) {
    rate[i] = L.delta[(i + 1) % N] - L.delta[i] + (i === N - 1 ? L.b.lap - L.a.lap : 0);
    maxRate = Math.max(maxRate, Math.abs(rate[i]));
  }
  const trail: number[] = [];

  return {
    idle(f) {
      fit(f);
      const i = indexAtTime(L.a, f.time * PLAYBACK);
      return [px(i), py(i)];
    },
    draw(ctx, f) {
      fit(f);
      const { width: w, height: h } = f;
      drawVignette(ctx, w, h);
      drawGrid(ctx, w, h, 28, 0.04);
      const intro = easeOutCubic(f.age / 0.9);
      const reveal = Math.floor(N * intro);

      // asphalt ribbon
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= reveal; i++) {
        const j = i % N;
        if (i === 0) ctx.moveTo(px(j), py(j));
        else ctx.lineTo(px(j), py(j));
      }
      ctx.strokeStyle = rgba(C.cobaltDeep, 0.9);
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.strokeStyle = rgba(C.silver, 0.08);
      ctx.lineWidth = 13;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.stroke();
      ctx.restore();

      // delta-coloured racing line
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (let i = 0; i < reveal; i++) {
        const j = (i + 1) % N;
        const r = rate[i] / (maxRate || 1);
        const col = r >= 0 ? C.red : C.cobalt;
        ctx.strokeStyle = rgba(col, 0.25 + Math.abs(r) * 0.75);
        ctx.lineWidth = 1 + Math.abs(r) * 2.2;
        ctx.beginPath();
        ctx.moveTo(px(i), py(i));
        ctx.lineTo(px(j), py(j));
        ctx.stroke();
      }
      ctx.restore();

      // sector gates
      for (let s = 0; s < 3; s++) {
        const i = L.sectorIdx[s];
        const j = (i + 1) % N;
        const tx = px(j) - px(i);
        const ty = py(j) - py(i);
        const len = Math.hypot(tx, ty) || 1;
        const nx = -ty / len;
        const ny = tx / len;
        ctx.save();
        ctx.strokeStyle = s === 0 ? C.alabaster : rgba(C.silver, 0.7);
        ctx.lineWidth = s === 0 ? 1.2 : 0.75;
        ctx.beginPath();
        ctx.moveTo(px(i) - nx * 10, py(i) - ny * 10);
        ctx.lineTo(px(i) + nx * 10, py(i) + ny * 10);
        ctx.stroke();
        ctx.restore();
        const lx = px(i) + nx * 24;
        const ly = py(i) + ny * 24;
        const d = L.sectorDelta[s];
        label(ctx, `S${s + 1}`, lx, ly, C.alabaster, 10, 'center');
        label(ctx, `${signed(d)} s`, lx, ly + 13, d >= 0 ? C.red : C.cobalt, 10, 'center');
      }

      // cars
      const tau = f.time * PLAYBACK;
      const ia = indexAtTime(L.a, tau);
      const ib = indexAtTime(L.b, tau);
      trail.push(ia);
      if (trail.length > 40) trail.shift();
      for (let k = 1; k < trail.length; k++) {
        const i0 = trail[k - 1];
        const i1 = trail[k];
        if (Math.abs(i1 - i0) > N / 2) continue;
        ctx.strokeStyle = rgba(C.red, (k / trail.length) * 0.8);
        ctx.lineWidth = 2.5 * (k / trail.length);
        ctx.beginPath();
        ctx.moveTo(px(i0), py(i0));
        ctx.lineTo(px(i1), py(i1));
        ctx.stroke();
      }
      for (const [i, col] of [[ib, C.cobalt], [ia, C.red]] as const) {
        glow(ctx, px(i), py(i), 18, col, 0.7);
        ctx.fillStyle = C.alabaster;
        ctx.beginPath();
        ctx.arc(px(i), py(i), 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // cursor snaps to nearest racing-line sample
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < N; i += 2) {
        const d = (px(i) - f.pointer.x) ** 2 + (py(i) - f.pointer.y) ** 2;
        if (d < bestD) { bestD = d; best = i; }
      }
      const near = Math.sqrt(bestD) < 60;
      if (near && f.pointer.presence > 0.05) {
        const x = px(best);
        const y = py(best);
        ctx.save();
        ctx.globalAlpha = f.pointer.presence;
        ctx.strokeStyle = C.alabaster;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.stroke();
        const right = x < w - 130;
        label(ctx, `A ${kmh(L.a.v[best])}  B ${kmh(L.b.v[best])}`, x + (right ? 12 : -12), y - 6, C.alabaster, 10, right ? 'left' : 'right');
        label(ctx, `gap ${signed(L.delta[best])} s`, x + (right ? 12 : -12), y + 8, C.silver, 10, right ? 'left' : 'right');
        ctx.restore();
      }

      label(ctx, 'red: car B losing time · blue: car B gaining', 16, h - 14, C.titanium, 9);
      const i = near ? best : ia;
      return `S${sectorOf(i, L) + 1} · lap A ${L.a.lap.toFixed(3)} s · B ${L.b.lap.toFixed(3)} s · ${kmh(L.a.v[i])} / ${kmh(L.b.v[i])} km/h`;
    },
  };
}

/* ---------- 3. ring buffer ---------- */

const SLOTS = 256;
const READ_LAG = 12;

function createRingScene(): PlateScene {
  const L = lap();
  const speed = new Float32Array(SLOTS);
  const thr = new Float32Array(SLOTS);
  const brk = new Float32Array(SLOTS);
  const seq = new Uint32Array(SLOTS);
  let written = 0;
  let acc = 0;
  let frameMs = 0;
  const push = (simTime: number) => {
    const i = indexAtTime(L.a, simTime);
    const slot = written % SLOTS;
    speed[slot] = L.a.v[i];
    thr[slot] = L.a.thr[i];
    brk[slot] = L.a.brk[i];
    seq[slot] = written;
    written++;
  };
  // pre-fill a full ring so it wraps immediately
  for (let k = 0; k < SLOTS; k++) push((k * PLAYBACK) / 60);
  const geo = { cx: 0, cy: 0, r0: 0, r1: 0 };

  return {
    idle(f) {
      const a = f.time * 0.6;
      return [geo.cx + Math.cos(a) * (geo.r0 + geo.r1) * 0.5, geo.cy + Math.sin(a) * (geo.r0 + geo.r1) * 0.5];
    },
    draw(ctx, f) {
      const { width: w, height: h } = f;
      drawVignette(ctx, w, h);
      geo.cx = w / 2;
      geo.cy = h / 2 + 4;
      const R = Math.min(w, h) * 0.44;
      geo.r1 = R;
      geo.r0 = R * 0.52;
      const intro = easeOutCubic(f.age / 0.8);

      // 60 Hz producer, frame-rate independent
      if (f.dt > 0) {
        acc += f.dt;
        while (acc >= 1 / 60) {
          acc -= 1 / 60;
          push(((written) * PLAYBACK) / 60);
        }
        frameMs = frameMs ? lerp(frameMs, f.dt * 1000, 0.08) : f.dt * 1000;
      }

      const head = (written - 1) % SLOTS;
      const ang = (slot: number) => -Math.PI / 2 + (slot / SLOTS) * Math.PI * 2;

      // guide rings
      ctx.save();
      ctx.lineWidth = 0.5;
      for (const [r, a] of [[geo.r0, 0.25], [geo.r1, 0.12], [geo.r0 - 10, 0.1]] as const) {
        ctx.strokeStyle = rgba(C.silver, a);
        ctx.beginPath();
        ctx.arc(geo.cx, geo.cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // pointer -> slot
      const pa = Math.atan2(f.pointer.y - geo.cy, f.pointer.x - geo.cx);
      const pr = Math.hypot(f.pointer.x - geo.cx, f.pointer.y - geo.cy);
      let hoverSlot = Math.round((((pa + Math.PI / 2) / (Math.PI * 2)) % 1 + 1) % 1 * SLOTS) % SLOTS;
      const onRing = pr > geo.r0 * 0.7 && pr < geo.r1 * 1.15;
      if (!onRing && f.pointer.active) hoverSlot = -1;

      // slots
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let s = 0; s < SLOTS; s++) {
        const age = (head - s + SLOTS) % SLOTS; // 0 = newest
        const recency = 1 - age / SLOTS;
        const a = ang(s);
        const len = (speed[s] / 95) * (geo.r1 - geo.r0) * intro;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const [r, g, b] = ramp([C.titanium, C.cobalt, C.silver, C.red], recency ** 1.5);
        const al = 0.18 + recency * 0.72;
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${s === hoverSlot ? 1 : al})`;
        ctx.lineWidth = s === hoverSlot ? 2 : 1.1;
        ctx.beginPath();
        ctx.moveTo(geo.cx + cos * geo.r0, geo.cy + sin * geo.r0);
        ctx.lineTo(geo.cx + cos * (geo.r0 + len), geo.cy + sin * (geo.r0 + len));
        ctx.stroke();
        // inner channel: brake (red) / throttle (silver) ticks
        const inner = geo.r0 - 10;
        const v = brk[s] > 0.02 ? brk[s] : thr[s];
        ctx.strokeStyle = rgba(brk[s] > 0.02 ? C.red : C.silver, (0.15 + recency * 0.6) * v);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(geo.cx + cos * (inner - 8 * v), geo.cy + sin * (inner - 8 * v));
        ctx.lineTo(geo.cx + cos * inner, geo.cy + sin * inner);
        ctx.stroke();
      }
      ctx.restore();

      // heads
      const drawHead = (slot: number, col: string, txt: string, out: number) => {
        const a = ang(slot);
        const x0 = geo.cx + Math.cos(a) * (geo.r0 - 22);
        const y0 = geo.cy + Math.sin(a) * (geo.r0 - 22);
        const x1 = geo.cx + Math.cos(a) * (geo.r1 + out);
        const y1 = geo.cy + Math.sin(a) * (geo.r1 + out);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        phosphor(ctx, col, 0.75, 0.12);
        glow(ctx, x1, y1, 10, col, 0.6);
        const lx = geo.cx + Math.cos(a) * (geo.r1 + out + 12);
        const ly = geo.cy + Math.sin(a) * (geo.r1 + out + 12);
        label(ctx, txt, lx, ly + 3, col, 10, Math.cos(a) >= 0 ? 'left' : 'right');
      };
      drawHead((head + 1) % SLOTS, C.red, 'write', 6);
      drawHead((head - READ_LAG + SLOTS) % SLOTS, C.cobalt, 'read', 0);

      // centre readout
      const big = Math.max(18, Math.min(30, geo.r0 * 0.28));
      ctx.font = `${big}px "Geist Mono", ui-monospace, monospace`;
      ctx.fillStyle = C.alabaster;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(String(written).padStart(6, '0'), geo.cx, geo.cy + big * 0.1);
      label(ctx, 'samples written', geo.cx, geo.cy + big * 0.1 + 16, C.titanium, 10, 'center');
      label(ctx, `${SLOTS} slots · 60 Hz producer`, geo.cx, geo.cy - big * 0.9, C.titanium, 9, 'center');

      const s = hoverSlot >= 0 ? hoverSlot : head;
      const frame = frameMs ? `${frameMs.toFixed(1)} ms frame` : 'paused';
      return `slot ${String(s).padStart(3, '0')} · seq ${seq[s]} · ${kmh(speed[s])} km/h · thr ${Math.round(thr[s] * 100)}% · brk ${Math.round(brk[s] * 100)}% · ${frame}`;
    },
  };
}

export const apexisPlate: PlateDefinition = {
  modes: [
    { id: 'scope', label: 'Oscilloscope', description: 'Simulated two-car lap: speed, throttle, brake and gap traces across sectors 1 to 3. The cursor scrubs along the lap.' },
    { id: 'track', label: 'Sector map', description: 'Circuit map coloured by where car B gains or loses time, with sector deltas and both cars running in real time.' },
    { id: 'ring', label: 'Ring buffer', description: 'A 256-slot telemetry ring buffer filled at 60 Hz, showing write and read heads. Hovering a slot reads its sample.' },
  ],
  createScene(modeId) {
    if (modeId === 'track') return createTrackScene();
    if (modeId === 'ring') return createRingScene();
    return createScopeScene();
  },
};

export default apexisPlate;
