import {
  C, bez, clamp, drawGrid, drawVignette, easeInOutCubic, easeOutCubic, glow, label, phosphor, ramp, rgba, rng,
  type PlateDefinition, type PlateScene, type StageFrame,
} from './stageKit';

/* ============================================================
 * Tempo: drafts pass a deterministic safety gate, get triaged by
 * priority, and settle in a zero-destination ring buffer (nothing
 * leaves). Timings are slowed for display; the measured gate
 * latency (0.20 ms) is quoted in the deck, not simulated here.
 * ============================================================ */

type Priority = 0 | 1 | 2; // high, medium, low
interface Draft {
  id: number;
  crisis: boolean;
  pri: Priority;
  phase: 'approach' | 'queued' | 'routed' | 'stored' | 'support';
  x: number;
  y: number;
  t: number; // phase progress 0..1
  born: number;
  slot: number;
}

const SLOTS = 16;
const SERVICE_S = 0.16;
const PRI_COLORS = [C.red, C.silver, C.cobalt] as const;
const PRI_NAMES = ['high', 'medium', 'low'] as const;

function createGateScene(): PlateScene {
  const rand = rng(7);
  const drafts: Draft[] = [];
  const ring: (Draft | null)[] = Array(SLOTS).fill(null);
  let head = 0;
  let nextId = 1;
  let spawnAcc = 0;
  let serviceAcc = 0;
  let passed = 0;
  let intercepted = 0;
  let pendingBurst = 0;
  let burstAcc = 0;
  const geo = { gx: 0, gy: 0, rx: 0, ry: 0, rr: 0, sinkX: 0, sinkY: 0, w: 0, h: 0 };
  const layout = (f: StageFrame) => {
    geo.w = f.width;
    geo.h = f.height;
    geo.gx = f.width * 0.36;
    geo.gy = f.height * 0.46;
    geo.rr = Math.min(f.width * 0.2, f.height * 0.3);
    geo.rx = f.width - geo.rr - Math.max(28, f.width * 0.06);
    geo.ry = f.height * 0.46;
    geo.sinkX = f.width * 0.5;
    geo.sinkY = f.height - 34;
  };
  const spawn = (now: number) => {
    const crisis = rand() < 0.07;
    const r = rand();
    drafts.push({
      id: nextId++, crisis, pri: (r < 0.25 ? 0 : r < 0.65 ? 1 : 2) as Priority,
      phase: 'approach', x: -10, y: geo.gy + (rand() - 0.5) * geo.h * 0.5, t: 0, born: now, slot: -1,
    });
  };
  const slotPos = (s: number, r = geo.rr) => {
    const a = -Math.PI / 2 + (s / SLOTS) * Math.PI * 2;
    return [geo.rx + Math.cos(a) * r, geo.ry + Math.sin(a) * r] as const;
  };
  // pre-seed a full ring so the buffer reads as already in use
  for (let s = 0; s < SLOTS; s++) {
    ring[s] = { id: nextId++, crisis: false, pri: (s % 3) as Priority, phase: 'stored', x: 0, y: 0, t: 1, born: -1, slot: s };
  }
  passed = SLOTS;

  return {
    idle(f) {
      layout(f);
      const a = f.time * 0.5;
      const [x, y] = slotPos(Math.floor(((a / (Math.PI * 2)) % 1) * SLOTS));
      return [x, y];
    },
    action(id) {
      if (id === 'burst') pendingBurst += 18;
    },
    draw(ctx, f) {
      layout(f);
      const { width: w, height: h, dt, time } = f;
      drawVignette(ctx, w, h, geo.rx, geo.ry);
      drawGrid(ctx, w, h, 28, 0.035);
      const intro = easeOutCubic(f.age / 0.8);

      if (f.reduced && pendingBurst > 0) {
        // no animation: settle the burst immediately
        for (; pendingBurst > 0; pendingBurst--) {
          const crisis = rand() < 0.07;
          if (crisis) { intercepted++; continue; }
          const r = rand();
          ring[head] = { id: nextId++, crisis, pri: (r < 0.25 ? 0 : r < 0.65 ? 1 : 2) as Priority, phase: 'stored', x: 0, y: 0, t: 1, born: time, slot: head };
          head = (head + 1) % SLOTS;
          passed++;
        }
      }

      spawnAcc += dt;
      if (spawnAcc > 0.85) { spawnAcc = 0; spawn(time); }
      if (pendingBurst > 0) {
        burstAcc += dt;
        while (burstAcc > 0.035 && pendingBurst > 0) { burstAcc -= 0.035; pendingBurst--; spawn(time); }
      }

      // queue at the gate
      const queue = drafts.filter((d) => d.phase === 'queued' || d.phase === 'approach');
      const queued = drafts.filter((d) => d.phase === 'queued');
      serviceAcc += dt;
      if (serviceAcc >= SERVICE_S) {
        serviceAcc = 0;
        const next = queued.find((d) => Math.abs(d.x - (geo.gx - 18)) < 6);
        if (next) {
          next.phase = next.crisis ? 'support' : 'routed';
          next.t = 0;
          if (next.crisis) intercepted++;
          else {
            next.slot = head;
            head = (head + 1) % SLOTS;
            passed++;
          }
        }
      }

      // lanes: gate -> ring slot, eased Bezier per priority
      const laneY = (p: Priority) => geo.gy + (p - 1) * Math.min(56, h * 0.13);
      ctx.save();
      ctx.lineWidth = 0.5;
      for (const p of [0, 1, 2] as Priority[]) {
        ctx.strokeStyle = rgba(PRI_COLORS[p], 0.35 * intro);
        ctx.beginPath();
        ctx.moveTo(geo.gx + 16, geo.gy);
        ctx.bezierCurveTo(geo.gx + 70, laneY(p), geo.rx - geo.rr - 70, laneY(p), geo.rx - geo.rr - 8, geo.ry);
        ctx.stroke();
        label(ctx, PRI_NAMES[p], geo.gx + 72, laneY(p) - 5, rgba(PRI_COLORS[p], 0.8), 9);
      }
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = rgba(C.crimson, 0.4 * intro);
      ctx.beginPath();
      ctx.moveTo(geo.gx, geo.gy + 16);
      ctx.bezierCurveTo(geo.gx, geo.sinkY - 10, geo.sinkX - 60, geo.sinkY, geo.sinkX - 8, geo.sinkY);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'crisis resources', geo.sinkX, geo.sinkY + 4, C.crimson, 10);

      // inbound guide
      ctx.save();
      const g = ctx.createLinearGradient(0, 0, geo.gx, 0);
      g.addColorStop(0, rgba(C.silver, 0));
      g.addColorStop(1, rgba(C.silver, 0.25));
      ctx.strokeStyle = g;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, geo.gy);
      ctx.lineTo(geo.gx - 16, geo.gy);
      ctx.stroke();
      ctx.restore();

      // move drafts
      let qIndex = 0;
      for (const d of drafts) {
        if (d.phase === 'approach' || d.phase === 'queued') {
          const qx = geo.gx - 18 - qIndex * 7;
          qIndex++;
          const k = 1 - Math.exp(-dt * 8);
          d.x += (qx - d.x) * k;
          d.y += (geo.gy - d.y) * k;
          if (Math.abs(d.x - qx) < 4) d.phase = 'queued';
        } else if (d.phase === 'routed') {
          d.t = Math.min(1, d.t + dt / 1.1);
          const e = easeInOutCubic(d.t);
          const [sx, sy] = slotPos(d.slot, geo.rr);
          const ly = laneY(d.pri);
          if (e < 0.75) {
            const u = e / 0.75;
            d.x = bez(geo.gx + 16, geo.gx + 70, geo.rx - geo.rr - 70, geo.rx - geo.rr - 8, u);
            d.y = bez(geo.gy, ly, ly, geo.ry, u);
          } else {
            const u = (e - 0.75) / 0.25;
            const ax = geo.rx - geo.rr - 8;
            d.x = ax + (sx - ax) * u;
            d.y = geo.ry + (sy - geo.ry) * u;
          }
          if (d.t >= 1) { d.phase = 'stored'; ring[d.slot] = d; }
        } else if (d.phase === 'support') {
          d.t = Math.min(1, d.t + dt / 1.2);
          const e = easeInOutCubic(d.t);
          d.x = bez(geo.gx, geo.gx, geo.sinkX - 60, geo.sinkX - 8, e);
          d.y = bez(geo.gy + 16, geo.sinkY - 10, geo.sinkY, geo.sinkY, e);
        }
      }
      for (let i = drafts.length - 1; i >= 0; i--) {
        const d = drafts[i];
        if (d.phase === 'stored' || (d.phase === 'support' && d.t >= 1)) drafts.splice(i, 1);
      }

      // ring buffer
      const hoverSlot = (() => {
        const a = Math.atan2(f.pointer.y - geo.ry, f.pointer.x - geo.rx);
        const r = Math.hypot(f.pointer.x - geo.rx, f.pointer.y - geo.ry);
        if (r < geo.rr * 0.6 || r > geo.rr * 1.35) return -1;
        return Math.round((((a + Math.PI / 2) / (Math.PI * 2)) % 1 + 1) % 1 * SLOTS) % SLOTS;
      })();
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = rgba(C.silver, 0.2);
      ctx.beginPath();
      ctx.arc(geo.rx, geo.ry, geo.rr * 1.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(geo.rx, geo.ry, geo.rr * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      for (let s = 0; s < SLOTS; s++) {
        const a0 = -Math.PI / 2 + ((s - 0.42) / SLOTS) * Math.PI * 2;
        const a1 = -Math.PI / 2 + ((s + 0.42) / SLOTS) * Math.PI * 2;
        const item = ring[s];
        const age = (head - 1 - s + SLOTS) % SLOTS;
        const fresh = item && item.born >= 0 ? clamp(1 - (time - item.born - 1) / 3, 0, 1) : 0;
        ctx.beginPath();
        ctx.arc(geo.rx, geo.ry, geo.rr * 1.14, a0, a1);
        ctx.arc(geo.rx, geo.ry, geo.rr * 0.82, a1, a0, true);
        ctx.closePath();
        if (item) {
          const col = PRI_COLORS[item.pri];
          const gr = ctx.createRadialGradient(geo.rx, geo.ry, geo.rr * 0.8, geo.rx, geo.ry, geo.rr * 1.16);
          const alpha = (0.18 + (1 - age / SLOTS) * 0.42 + fresh * 0.3) * intro;
          gr.addColorStop(0, rgba(col, alpha * 0.4));
          gr.addColorStop(1, rgba(col, alpha));
          ctx.fillStyle = gr;
          ctx.fill();
        }
        ctx.lineWidth = s === hoverSlot ? 1 : 0.5;
        ctx.strokeStyle = s === hoverSlot ? C.alabaster : rgba(C.silver, 0.3);
        ctx.stroke();
        if (fresh > 0 && item) {
          const [fx, fy] = slotPos(s, geo.rr * 0.98);
          glow(ctx, fx, fy, 22, PRI_COLORS[item.pri], fresh * 0.6);
        }
      }
      // write head
      const [hx, hy] = slotPos(head - 0.5, geo.rr * 1.3);
      const [hx0, hy0] = slotPos(head - 0.5, geo.rr * 0.7);
      ctx.beginPath();
      ctx.moveTo(hx0, hy0);
      ctx.lineTo(hx, hy);
      phosphor(ctx, C.red, 0.75, 0.12);
      label(ctx, 'zero-destination buffer', geo.rx, geo.ry - 4, C.silver, 10, 'center');
      label(ctx, 'no outbound path', geo.rx, geo.ry + 11, C.titanium, 9, 'center');

      // gate (diamond)
      const busy = queued.length > 0 ? 1 : 0;
      glow(ctx, geo.gx, geo.gy, 34 + queue.length * 1.5, busy ? C.red : C.cobalt, 0.35 + Math.min(0.4, queue.length * 0.03));
      ctx.save();
      ctx.translate(geo.gx, geo.gy);
      ctx.rotate(Math.PI / 4);
      const gs = 20;
      const gg = ctx.createLinearGradient(-gs, -gs, gs, gs);
      gg.addColorStop(0, rgba(C.cobaltMid, 0.9));
      gg.addColorStop(1, rgba(C.midnight, 0.9));
      ctx.fillStyle = gg;
      ctx.fillRect(-gs / 2, -gs / 2, gs, gs);
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = C.alabaster;
      ctx.strokeRect(-gs / 2, -gs / 2, gs, gs);
      ctx.restore();
      label(ctx, 'safety gate', geo.gx, geo.gy - 24, C.alabaster, 10, 'center');
      label(ctx, `queue ${queue.length}`, geo.gx, geo.gy + 32, queue.length > 4 ? C.red : C.titanium, 9, 'center');

      // drafts
      for (const d of drafts) {
        const col = d.phase === 'support' ? C.crimson : d.phase === 'routed' ? PRI_COLORS[d.pri] : C.alabaster;
        glow(ctx, d.x, d.y, 8, col, 0.45);
        ctx.fillStyle = col;
        ctx.fillRect(d.x - 1.5, d.y - 1.5, 3, 3);
      }
      label(ctx, 'drafts in', 14, geo.gy - 10, C.titanium, 9);

      const hs = hoverSlot >= 0 ? hoverSlot : (head - 1 + SLOTS) % SLOTS;
      const it = ring[hs];
      return `queue ${queue.length} · stored ${passed} · intercepted ${intercepted} · slot ${String(hs).padStart(2, '0')} ${it ? PRI_NAMES[it.pri] : 'empty'} · head ${String(head).padStart(2, '0')}`;
    },
  };
}

/* ---------- 2. active-passive failover state machine ---------- */

interface Token { path: number[]; seg: number; t: number; col: string }

function createFailoverScene(): PlateScene {
  // states from the Tempo C4 model
  const states = [
    { name: 'Draft', x: 0.08, y: 0.5 },
    { name: 'Safety gate', x: 0.27, y: 0.5 },
    { name: 'Crisis resources', x: 0.27, y: 0.86 },
    { name: 'pgvector recall', x: 0.47, y: 0.5 },
    { name: 'Primary · DeepSeek V3', x: 0.68, y: 0.3 },
    { name: 'Zod self-correct', x: 0.68, y: 0.08 },
    { name: 'Fallback · Gemini', x: 0.68, y: 0.74 },
    { name: 'Reframe ready', x: 0.9, y: 0.5 },
  ];
  const edges: [number, number, string][] = [
    [0, 1, ''], [1, 2, 'crisis match'], [1, 3, 'clear'], [3, 4, ''], [4, 5, 'schema error'], [5, 4, 'retry once'],
    [4, 6, 'timeout > 1,200 ms'], [4, 7, 'valid JSON'], [6, 7, ''],
  ];
  const rand = rng(11);
  const tokens: Token[] = [];
  const counts = new Array(states.length).fill(0);
  let acc = 0;
  let pending = 0;
  const route = (): Token => {
    const r = rand();
    if (r < 0.06) return { path: [0, 1, 2], seg: 0, t: 0, col: C.crimson };
    const r2 = rand();
    if (r2 < 0.16) return { path: [0, 1, 3, 4, 5, 4, 7], seg: 0, t: 0, col: C.silver };
    if (r2 < 0.3) return { path: [0, 1, 3, 4, 6, 7], seg: 0, t: 0, col: C.cobalt };
    return { path: [0, 1, 3, 4, 7], seg: 0, t: 0, col: C.red };
  };
  const pos = (f: StageFrame, i: number) => {
    const padX = 60;
    return [padX + states[i].x * (f.width - padX * 2) + (i === 0 ? -10 : 0), 34 + states[i].y * (f.height - 84)] as const;
  };
  const ctrl = (f: StageFrame, a: number, b: number) => {
    const [x0, y0] = pos(f, a);
    const [x1, y1] = pos(f, b);
    const back = a === 5 && b === 4;
    const bend = back ? 36 : a === 4 && b === 5 ? -36 : 0;
    return [x0, y0, (x0 + x1) / 2 + bend, (y0 + y1) / 2, x1, y1] as const;
  };
  const quad = (p0: number, p1: number, p2: number, t: number) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  // prewarm: 40 earlier requests so the counters read as a running system
  for (let i = 0; i < 40; i++) route().path.forEach((s) => counts[s]++);

  return {
    action(id) { if (id === 'burst') pending += 10; },
    idle(f) {
      const i = [1, 4, 6, 7][Math.floor(f.time / 2.4) % 4];
      return pos(f, i) as unknown as [number, number];
    },
    draw(ctx, f) {
      drawVignette(ctx, f.width, f.height);
      drawGrid(ctx, f.width, f.height, 28, 0.035);
      const intro = easeOutCubic(f.age / 0.8);
      acc += f.dt;
      if (acc > 1.1) { acc = 0; tokens.push(route()); }
      if (pending > 0 && rand() < 0.35) { pending--; tokens.push(route()); }
      if (f.reduced && pending > 0) {
        for (; pending > 0; pending--) { const tk = route(); tk.path.forEach((s) => counts[s]++); }
      }

      let hover = -1;
      let hd = Infinity;
      states.forEach((_, i) => {
        const [x, y] = pos(f, i);
        const d = Math.hypot(x - f.pointer.x, y - f.pointer.y);
        if (d < hd) { hd = d; hover = i; }
      });
      if (hd > 70) hover = -1;

      edges.forEach(([a, b, txt]) => {
        const [x0, y0, cx, cy, x1, y1] = ctrl(f, a, b);
        const hot = hover === a || hover === b;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(cx, cy, x1, y1);
        if (hot) phosphor(ctx, C.silver, 0.75, 0.1);
        else {
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = rgba(b === 2 ? C.crimson : C.cobalt, 0.55 * intro);
          ctx.stroke();
        }
        // arrowhead at 88%
        const t = 0.88;
        const ax = quad(x0, cx, x1, t);
        const ay = quad(y0, cy, y1, t);
        const tx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
        const ty = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
        const l = Math.hypot(tx, ty) || 1;
        const ux = tx / l;
        const uy = ty / l;
        ctx.strokeStyle = rgba(C.silver, hot ? 0.9 : 0.5);
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(ax - ux * 5 - uy * 3, ay - uy * 5 + ux * 3);
        ctx.lineTo(ax, ay);
        ctx.lineTo(ax - ux * 5 + uy * 3, ay - uy * 5 - ux * 3);
        ctx.stroke();
        if (txt && f.width > 520) label(ctx, txt, quad(x0, cx, x1, 0.5) + 6, quad(y0, cy, y1, 0.5) - 6, hot ? C.silver : C.titanium, 9);
      });

      // tokens
      for (let i = tokens.length - 1; i >= 0; i--) {
        const tk = tokens[i];
        tk.t += f.dt / 0.7;
        if (tk.t >= 1) {
          counts[tk.path[tk.seg + 1]]++;
          tk.seg++;
          tk.t = 0;
          if (tk.seg >= tk.path.length - 1) { tokens.splice(i, 1); continue; }
        }
        const [x0, y0, cx, cy, x1, y1] = ctrl(f, tk.path[tk.seg], tk.path[tk.seg + 1]);
        const e = easeInOutCubic(tk.t);
        const x = quad(x0, cx, x1, e);
        const y = quad(y0, cy, y1, e);
        glow(ctx, x, y, 12, tk.col, 0.6);
        ctx.fillStyle = C.alabaster;
        ctx.fillRect(x - 1.25, y - 1.25, 2.5, 2.5);
      }

      // states
      const small = f.width < 520;
      states.forEach((s, i) => {
        const [x, y] = pos(f, i);
        const hot = hover === i;
        const r = i === 2 ? 5 : 7;
        glow(ctx, x, y, hot ? 30 : 18, i === 2 ? C.crimson : i === 7 ? C.red : C.cobalt, hot ? 0.55 : 0.3);
        ctx.fillStyle = C.midnight;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = hot ? 1.2 : 0.75;
        ctx.strokeStyle = hot ? C.alabaster : rgba(C.silver, 0.7);
        ctx.stroke();
        const name = small ? s.name.split(' · ')[0] : s.name;
        label(ctx, name, x, y + 20, hot ? C.alabaster : C.silver, small ? 9 : 10, 'center');
        label(ctx, String(counts[i]), x, y - 13, hot ? C.red : C.titanium, 9, 'center');
      });

      label(ctx, 'request paths · counts per state', 16, 18, C.titanium, 9);
      if (hover >= 0) return `${states[hover].name} · ${counts[hover]} visits · primary ${counts[4]} · self-corrected ${counts[5]} · failover ${counts[6]} · intercepted ${counts[2]}`;
      return `in flight ${tokens.length} · primary ${counts[4]} · self-corrected ${counts[5]} · failover ${counts[6]} · intercepted ${counts[2]}`;
    },
  };
}

/* ---------- 3. pgvector cosine recall ---------- */

const DIM = 8;
function createMemoryScene(): PlateScene {
  const rand = rng(23);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
  const centers = Array.from({ length: 5 }, () => Array.from({ length: DIM }, gauss));
  const vecs: number[][] = [];
  const cluster: number[] = [];
  for (let i = 0; i < 120; i++) {
    const c = i % 5;
    const v = centers[c].map((x) => x + gauss() * 0.55);
    const n = Math.hypot(...v);
    vecs.push(v.map((x) => x / n));
    cluster.push(c);
  }
  // 2-D view via two orthonormalised random axes (the view distorts; cosine is computed in 8-D)
  const ax1 = Array.from({ length: DIM }, gauss);
  const n1 = Math.hypot(...ax1);
  for (let k = 0; k < DIM; k++) ax1[k] /= n1;
  const ax2 = Array.from({ length: DIM }, gauss);
  const d12 = ax2.reduce((s, x, k) => s + x * ax1[k], 0);
  for (let k = 0; k < DIM; k++) ax2[k] -= d12 * ax1[k];
  const n2 = Math.hypot(...ax2);
  for (let k = 0; k < DIM; k++) ax2[k] /= n2;
  const P = vecs.map((v) => [v.reduce((s, x, k) => s + x * ax1[k], 0), v.reduce((s, x, k) => s + x * ax2[k], 0)]);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of P) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const cos = (a: number[], b: number[]) => a.reduce((s, x, k) => s + x * b[k], 0);
  const screen = (f: StageFrame, i: number) => {
    const pad = 40;
    const w = f.width - pad * 2;
    const h = f.height - pad * 2 - 10;
    return [pad + ((P[i][0] - minX) / (maxX - minX)) * w, pad + 10 + ((P[i][1] - minY) / (maxY - minY)) * h] as const;
  };
  const sims = new Float32Array(vecs.length);
  const shown = new Float32Array(vecs.length);

  return {
    idle(f) {
      const i = (Math.floor(f.time / 2.5) * 37) % vecs.length;
      return screen(f, i) as unknown as [number, number];
    },
    draw(ctx, f) {
      drawVignette(ctx, f.width, f.height);
      drawGrid(ctx, f.width, f.height, 32, 0.035);
      const intro = easeOutCubic(f.age / 0.9);
      let q = 0;
      let qd = Infinity;
      for (let i = 0; i < vecs.length; i++) {
        const [x, y] = screen(f, i);
        const d = (x - f.pointer.x) ** 2 + (y - f.pointer.y) ** 2;
        if (d < qd) { qd = d; q = i; }
      }
      for (let i = 0; i < vecs.length; i++) sims[i] = cos(vecs[q], vecs[i]);
      const order = Array.from(sims.keys()).filter((i) => i !== q).sort((a, b) => sims[b] - sims[a]);
      const top = order.slice(0, 5);
      const k = f.reduced ? 1 : 1 - Math.exp(-f.dt * 8);
      for (let i = 0; i < vecs.length; i++) shown[i] += (sims[i] - shown[i]) * k;

      const [qx, qy] = screen(f, q);
      top.forEach((i, rank) => {
        const [x, y] = screen(f, i);
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(qx + (x - qx) * intro, qy + (y - qy) * intro);
        phosphor(ctx, C.red, 0.6, 0.06 + (5 - rank) * 0.02);
        label(ctx, sims[i].toFixed(3), x + 7, y - 6, C.alabaster, 9);
      });

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < vecs.length; i++) {
        const [x, y] = screen(f, i);
        const s = clamp((shown[i] + 1) / 2, 0, 1);
        const [r, g, b] = ramp([C.cobaltDeep, C.cobalt, C.silver, C.red], s ** 2);
        const rad = 1.4 + s * s * 2.2;
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(0.35 + s * 0.65) * intro})`;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      glow(ctx, qx, qy, 26, C.red, 0.7);
      ctx.strokeStyle = C.alabaster;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(qx, qy, 6, 0, Math.PI * 2);
      ctx.stroke();

      label(ctx, 'synthetic 8-d embeddings · 2-d projection · cosine computed in 8-d', 16, 18, C.titanium, 9);
      return `query #${String(q).padStart(3, '0')} · top-5 cosine ${top.map((i) => sims[i].toFixed(2)).join(' / ')}`;
    },
  };
}

export const tempoPlate: PlateDefinition = {
  modes: [
    { id: 'gate', label: 'Triage gate', description: 'Drafts queue at a deterministic safety gate. Crisis matches divert to support; the rest are triaged by priority into a ring buffer with no outbound path.' },
    { id: 'failover', label: 'Failover', description: 'State machine of a request: safety gate, pgvector recall, primary model, one schema self-correction, and failover to the fallback model on timeout.' },
    { id: 'memory', label: 'Cosine recall', description: 'Synthetic embedding cloud. The point nearest the cursor is the query and its five nearest neighbours by cosine similarity are linked.' },
  ],
  actions: [{ id: 'burst', label: 'Inject burst', modes: ['gate', 'failover'] }],
  createScene(modeId) {
    if (modeId === 'failover') return createFailoverScene();
    if (modeId === 'memory') return createMemoryScene();
    return createGateScene();
  },
};

export default tempoPlate;
