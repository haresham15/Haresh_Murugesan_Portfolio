import {
  clamp, hexRgb, drawGrid, drawVignette, easeOutCubic, fbm, glow, hash2, isoSegments, label, phosphor, rgba, smoothstep,
  strokeSegments, type PlateDefinition, type PlateScene, type PlatePalette, type StageFrame,
} from './stageKit';

/* ============================================================
 * Synthetic city model. Generic geography, not a real map.
 * The block count (141) and desert count (43 within an 800 m
 * walk radius) mirror the RouteRx case study; positions are invented.
 * ============================================================ */

const ASPECT = 1.5;
const MAP_H = 1 / ASPECT;
const NX = 16;
const NY = 11;
const LOCAL_SPEED = 1 / 55; // map-widths per minute
const ARTERIAL_SPEED = 1 / 22;
const ACCESS_SPEED = 1 / 90;
const RX = 96;
const RY = 64;
const LEVELS = [5, 15, 30] as const;

interface Edge { a: number; b: number; len: number; art: boolean }
interface City {
  nx: Float32Array;
  ny: Float32Array;
  edges: Edge[];
  adj: { to: number; w: number }[][];
  clinics: { node: number; name: string }[];
  nodeTime: Float32Array;
  raster: Float32Array;
  rasterNearest: Uint8Array;
  iso: { level: number; segs: Float32Array }[];
  bands: Map<PlatePalette, HTMLCanvasElement>;
  stops: [number, number][];
  lines: number[][];
  blocks: { x: number; y: number; d: number; desert: boolean; tvi: number; clinic: number; stop: number }[];
  metresPerUnit: number;
  clusters: { x: number; y: number; node: number; size: number }[];
}

const nodeId = (i: number, j: number) => j * NX + i;

function dijkstra(adj: { to: number; w: number }[][], sources: number[]) {
  const n = adj.length;
  const dist = new Float32Array(n).fill(Infinity);
  const prev = new Int32Array(n).fill(-1);
  const src = new Int32Array(n).fill(-1);
  const done = new Uint8Array(n);
  sources.forEach((s, k) => { dist[s] = 0; src[s] = k; });
  for (let it = 0; it < n; it++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) if (!done[i] && dist[i] < best) { best = dist[i]; u = i; }
    if (u < 0) break;
    done[u] = 1;
    for (const { to, w } of adj[u]) {
      const nd = dist[u] + w;
      if (nd < dist[to]) { dist[to] = nd; prev[to] = u; src[to] = src[u]; }
    }
  }
  return { dist, prev, src };
}

let cityCache: City | null = null;
function city(): City {
  if (cityCache) return cityCache;
  const nx = new Float32Array(NX * NY);
  const ny = new Float32Array(NX * NY);
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const k = nodeId(i, j);
      nx[k] = (i + 0.5 + (hash2(i, j + 40) - 0.5) * 0.45) / NX;
      ny[k] = ((j + 0.5 + (hash2(i + 70, j) - 0.5) * 0.45) / NY) * MAP_H;
    }
  }
  const isArtRow = (j: number) => j === 5;
  const isArtCol = (i: number) => i === 7;
  const edges: Edge[] = [];
  const add = (a: number, b: number, art: boolean) => {
    edges.push({ a, b, art, len: Math.hypot(nx[a] - nx[b], ny[a] - ny[b]) });
  };
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      if (i < NX - 1) {
        const art = isArtRow(j);
        if (art || hash2(i * 3, j * 7) > 0.12) add(nodeId(i, j), nodeId(i + 1, j), art);
      }
      if (j < NY - 1) {
        const art = isArtCol(i);
        if (art || hash2(i * 5 + 1, j * 11) > 0.12) add(nodeId(i, j), nodeId(i, j + 1), art);
      }
    }
  }
  // diagonal arterial
  for (let s = 0; s < 9; s++) add(nodeId(2 + s, 1 + s), nodeId(3 + s, 2 + s), true);

  const adj: { to: number; w: number }[][] = Array.from({ length: NX * NY }, () => []);
  for (const e of edges) {
    const w = e.len / (e.art ? ARTERIAL_SPEED : LOCAL_SPEED);
    adj[e.a].push({ to: e.b, w });
    adj[e.b].push({ to: e.a, w });
  }
  const clinics = [
    { node: nodeId(7, 5), name: 'Hospital' },
    { node: nodeId(3, 2), name: 'Clinic A' },
    { node: nodeId(12, 8), name: 'Clinic B' },
  ];
  const { dist: nodeTime, src } = dijkstra(adj, clinics.map((c) => c.node));

  // travel-time raster: drive on the network, then access off-network
  const raster = new Float32Array(RX * RY);
  const rasterNearest = new Uint8Array(RX * RY);
  for (let j = 0; j < RY; j++) {
    for (let i = 0; i < RX; i++) {
      const x = (i / (RX - 1));
      const y = (j / (RY - 1)) * MAP_H;
      let best = Infinity;
      let who = 0;
      for (let k = 0; k < nx.length; k++) {
        if (!Number.isFinite(nodeTime[k])) continue;
        const t = nodeTime[k] + Math.hypot(nx[k] - x, ny[k] - y) / ACCESS_SPEED;
        if (t < best) { best = t; who = src[k]; }
      }
      raster[j * RX + i] = best;
      rasterNearest[j * RX + i] = who;
    }
  }
  const iso = LEVELS.map((level) => ({ level, segs: isoSegments(raster, RX, RY, level) }));

  // bus lines and stops
  const lineNodes = [
    Array.from({ length: NX }, (_, i) => nodeId(i, 5)),
    Array.from({ length: NY }, (_, j) => nodeId(7, j)),
    Array.from({ length: 10 }, (_, i) => nodeId(i + 3, 2)),
  ];
  const lines = lineNodes;
  const stops: [number, number][] = [];
  lineNodes.forEach((ln) => ln.forEach((k, idx) => { if (idx % 2 === 0) stops.push([nx[k], ny[k]]); }));

  // 141 blocks on a jittered 13x11 lattice minus two corners
  const blocks: City['blocks'] = [];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 13; c++) {
      if ((r === 0 && c === 0) || (r === 10 && c === 12)) continue;
      const x = (c + 0.5 + (hash2(c + 200, r) - 0.5) * 0.6) / 13;
      const y = ((r + 0.5 + (hash2(c, r + 300) - 0.5) * 0.6) / 11) * MAP_H;
      let d = Infinity;
      let stop = 0;
      stops.forEach(([sx, sy], si) => {
        const dd = Math.hypot(sx - x, sy - y);
        if (dd < d) { d = dd; stop = si; }
      });
      const ri = clamp(Math.round(x * (RX - 1)), 0, RX - 1);
      const rj = clamp(Math.round((y / MAP_H) * (RY - 1)), 0, RY - 1);
      blocks.push({ x, y, d, desert: false, tvi: fbm(x * 5 + 2, y * 5 + 9, 3), clinic: rasterNearest[rj * RX + ri], stop });
    }
  }
  const sorted = blocks.map((b) => b.d).sort((a, b) => b - a);
  const threshold = (sorted[42] + sorted[43]) / 2;
  blocks.forEach((b) => { b.desert = b.d > threshold; });
  const metresPerUnit = 800 / threshold;

  // DBSCAN over desert blocks
  const deserts = blocks.filter((b) => b.desert);
  const eps = 0.11;
  const minPts = 3;
  const labels = new Int32Array(deserts.length).fill(-2); // -2 unvisited, -1 noise
  let cluster = 0;
  const region = (p: number) => deserts.map((_, q) => q).filter((q) => Math.hypot(deserts[q].x - deserts[p].x, deserts[q].y - deserts[p].y) <= eps);
  for (let p = 0; p < deserts.length; p++) {
    if (labels[p] !== -2) continue;
    const nb = region(p);
    if (nb.length < minPts) { labels[p] = -1; continue; }
    labels[p] = cluster;
    const queue = nb.filter((q) => q !== p);
    while (queue.length) {
      const q = queue.shift()!;
      if (labels[q] === -1) labels[q] = cluster;
      if (labels[q] !== -2) continue;
      labels[q] = cluster;
      const nq = region(q);
      if (nq.length >= minPts) queue.push(...nq);
    }
    cluster++;
  }
  const clusters: City['clusters'] = [];
  for (let c = 0; c < cluster; c++) {
    const pts = deserts.filter((_, i) => labels[i] === c);
    const x = pts.reduce((s, b) => s + b.x, 0) / pts.length;
    const y = pts.reduce((s, b) => s + b.y, 0) / pts.length;
    let node = 0;
    let bd = Infinity;
    for (let k = 0; k < nx.length; k++) {
      const d = Math.hypot(nx[k] - x, ny[k] - y);
      if (d < bd) { bd = d; node = k; }
    }
    clusters.push({ x, y, node, size: pts.length });
  }

  cityCache = { nx, ny, edges, adj, clinics, nodeTime, raster, rasterNearest, iso, bands: new Map(), stops, lines, blocks, metresPerUnit, clusters };
  return cityCache;
}

function bandsImage(c: City, P: PlatePalette): HTMLCanvasElement {
  const hit = c.bands.get(P);
  if (hit) return hit;
  const cv = document.createElement('canvas');
  cv.width = RX;
  cv.height = RY;
  const ctx = cv.getContext('2d');
  if (ctx) {
    const img = ctx.createImageData(RX, RY);
    const red = hexRgb(P.red);
    const silver = hexRgb(P.paper ? P.titanium : P.silver);
    const cobalt = hexRgb(P.cobalt);
    for (let k = 0; k < RX * RY; k++) {
      const t = c.raster[k];
      const b5 = 1 - smoothstep(4.2, 5.8, t);
      const b15 = 1 - smoothstep(14, 16, t);
      const b30 = 1 - smoothstep(28.5, 31.5, t);
      const col = b5 > 0.5 ? red : b15 > 0.5 ? silver : cobalt;
      const a = b5 * 0.2 + b15 * 0.07 + b30 * 0.1;
      img.data[k * 4] = col[0];
      img.data[k * 4 + 1] = col[1];
      img.data[k * 4 + 2] = col[2];
      img.data[k * 4 + 3] = Math.round(a * 255);
    }
    ctx.putImageData(img, 0, 0);
  }
  c.bands.set(P, cv);
  return cv;
}

/* ---------- shared map frame ---------- */

function mapFrame(f: StageFrame) {
  const padX = 18;
  const padTop = 30;
  const padBottom = 26;
  const w = Math.min(f.width - padX * 2, (f.height - padTop - padBottom) * ASPECT);
  const h = w / ASPECT;
  const ox = (f.width - w) / 2;
  const oy = padTop + (f.height - padTop - padBottom - h) / 2;
  return { ox, oy, k: w, w, h };
}
type MapFrame = ReturnType<typeof mapFrame>;

function drawRoads(ctx: CanvasRenderingContext2D, P: PlatePalette, c: City, m: MapFrame, alpha: number) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = rgba(P.silver, 0.16 * alpha);
  ctx.beginPath();
  for (const e of c.edges) {
    if (e.art) continue;
    ctx.moveTo(m.ox + c.nx[e.a] * m.k, m.oy + c.ny[e.a] * m.k);
    ctx.lineTo(m.ox + c.nx[e.b] * m.k, m.oy + c.ny[e.b] * m.k);
  }
  ctx.stroke();
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = rgba(P.silver, 0.28 * alpha);
  ctx.beginPath();
  for (const e of c.edges) {
    if (!e.art) continue;
    ctx.moveTo(m.ox + c.nx[e.a] * m.k, m.oy + c.ny[e.a] * m.k);
    ctx.lineTo(m.ox + c.nx[e.b] * m.k, m.oy + c.ny[e.b] * m.k);
  }
  ctx.stroke();
  ctx.restore();
}

function drawClinics(ctx: CanvasRenderingContext2D, P: PlatePalette, c: City, m: MapFrame, time: number, hot: number) {
  c.clinics.forEach((cl, i) => {
    const x = m.ox + c.nx[cl.node] * m.k;
    const y = m.oy + c.ny[cl.node] * m.k;
    const pulse = (time * 0.6 + i * 0.33) % 1;
    ctx.save();
    ctx.strokeStyle = rgba(P.red, (1 - pulse) * 0.7);
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(x, y, 4 + pulse * 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    glow(ctx, P, x, y, i === hot ? 26 : 16, P.red, i === hot ? 0.8 : 0.55);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = P.alabaster;
    const s = i === 0 ? 4.5 : 3.5;
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.restore();
    label(ctx, cl.name, x + 9, y - 8, i === hot ? P.alabaster : P.silver, 10);
  });
}

function sampleRaster(c: City, u: number, v: number) {
  const i = clamp(u, 0, 1) * (RX - 1);
  const j = clamp(v / MAP_H, 0, 1) * (RY - 1);
  const i0 = Math.min(RX - 2, Math.floor(i));
  const j0 = Math.min(RY - 2, Math.floor(j));
  const fx = i - i0;
  const fy = j - j0;
  const r = c.raster;
  const t =
    r[j0 * RX + i0] * (1 - fx) * (1 - fy) + r[j0 * RX + i0 + 1] * fx * (1 - fy) +
    r[(j0 + 1) * RX + i0] * (1 - fx) * fy + r[(j0 + 1) * RX + i0 + 1] * fx * fy;
  return { t, clinic: c.rasterNearest[Math.round(j) * RX + Math.round(i)] };
}

function drawDemandVectors(ctx: CanvasRenderingContext2D, P: PlatePalette, c: City, m: MapFrame, time: number, alpha: number) {
  ctx.save();
  ctx.lineWidth = 0.75;
  for (const b of c.blocks) {
    if (!b.desert) continue;
    const cl = c.clinics[b.clinic];
    const x0 = m.ox + b.x * m.k;
    const y0 = m.oy + b.y * m.k;
    const tx = m.ox + c.nx[cl.node] * m.k;
    const ty = m.oy + c.ny[cl.node] * m.k;
    const d = Math.hypot(tx - x0, ty - y0) || 1;
    const len = Math.min(d * 0.45, 10 + b.tvi * 34);
    const ux = (tx - x0) / d;
    const uy = (ty - y0) / d;
    const g = ctx.createLinearGradient(x0, y0, x0 + ux * len, y0 + uy * len);
    g.addColorStop(0, rgba(P.red, 0));
    g.addColorStop(1, rgba(P.red, 0.85 * alpha));
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + ux * len, y0 + uy * len);
    ctx.stroke();
    // flowing bead
    const p = (time * 0.5 + b.tvi * 3) % 1;
    ctx.fillStyle = rgba(P.alabaster, (1 - p) * 0.8 * alpha);
    ctx.fillRect(x0 + ux * len * p - 0.75, y0 + uy * len * p - 0.75, 1.5, 1.5);
    // arrow head
    const hx = x0 + ux * len;
    const hy = y0 + uy * len;
    ctx.strokeStyle = rgba(P.red, 0.85 * alpha);
    ctx.beginPath();
    ctx.moveTo(hx - ux * 4 - uy * 2.5, hy - uy * 4 + ux * 2.5);
    ctx.lineTo(hx, hy);
    ctx.lineTo(hx - ux * 4 + uy * 2.5, hy - uy * 4 - ux * 2.5);
    ctx.stroke();
  }
  ctx.restore();
}

/* ---------- 1. isochrones ---------- */

function createIsoScene(): PlateScene {
  const c = city();
  return {
    idle(f) {
      const m = mapFrame(f);
      const a = f.time * 0.3;
      return [m.ox + m.w * (0.5 + Math.cos(a) * 0.3), m.oy + m.h * (0.5 + Math.sin(a * 1.3) * 0.32)];
    },
    draw(ctx, f) {
      const P = f.palette;
      const m = mapFrame(f);
      drawVignette(ctx, P, f.width, f.height);
      drawGrid(ctx, P, f.width, f.height, 32, 0.035);
      const intro = easeOutCubic(f.age / 1.1);

      ctx.save();
      ctx.beginPath();
      ctx.rect(m.ox, m.oy, m.w, m.h);
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = intro;
      ctx.drawImage(bandsImage(c, P), m.ox, m.oy, m.w, m.h);
      ctx.globalAlpha = 1;
      drawRoads(ctx, P, c, m, 0.8);

      const sx = m.w / (RX - 1);
      const sy = m.h / (RY - 1);
      // travelling wavefront from all clinics
      const front = ((f.time * 7) % 38) * intro;
      if (front > 0.5) {
        const segs = isoSegments(c.raster, RX, RY, front);
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = rgba(P.alabaster, 0.45 * (1 - front / 38));
        strokeSegments(ctx, segs, sx, sy, m.ox, m.oy);
      }
      // the three isochrones, breathing as the wavefront passes
      const cols = [P.red, P.silver, P.cobalt];
      c.iso.forEach(({ level, segs }, i) => {
        const near = 1 - smoothstep(0, 3, Math.abs(front - level));
        ctx.lineWidth = 0.75 + near * 1.2;
        ctx.strokeStyle = rgba(cols[i], (0.55 + near * 0.45) * intro);
        strokeSegments(ctx, segs, sx, sy, m.ox, m.oy);
      });
      ctx.restore();

      drawDemandVectors(ctx, P, c, m, f.time, 0.55 * intro);

      const u = (f.pointer.x - m.ox) / m.k;
      const v = (f.pointer.y - m.oy) / m.k;
      const inside = u >= 0 && u <= 1 && v >= 0 && v <= MAP_H;
      const s = sampleRaster(c, u, v);
      drawClinics(ctx, P, c, m, f.time, inside ? s.clinic : -1);

      if (inside) {
        const cl = c.clinics[s.clinic];
        const cx = m.ox + c.nx[cl.node] * m.k;
        const cy = m.oy + c.ny[cl.node] * m.k;
        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = rgba(P.alabaster, 0.6);
        ctx.beginPath();
        ctx.moveTo(f.pointer.x, f.pointer.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.restore();
        ctx.strokeStyle = P.alabaster;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(f.pointer.x, f.pointer.y, 5, 0, Math.PI * 2);
        ctx.stroke();
        const right = f.pointer.x < f.width - 110;
        label(ctx, `${s.t.toFixed(1)} min`, f.pointer.x + (right ? 10 : -10), f.pointer.y + 14, P.alabaster, 10, right ? 'left' : 'right');
      }

      // legend drawn in the top margin
      let lx = m.ox;
      LEVELS.forEach((lv, i) => {
        ctx.fillStyle = cols[i];
        ctx.fillRect(lx, 14, 10, 1.5);
        label(ctx, `${lv} min`, lx + 14, 18, P.silver, 10);
        lx += 66;
      });
      label(ctx, 'synthetic network · generic sites', m.ox + m.w, 18, P.titanium, 9, 'right');

      if (!inside) return 'isochrones 5 · 15 · 30 min';
      const band = s.t <= 5 ? 'inside 5 min' : s.t <= 15 ? 'inside 15 min' : s.t <= 30 ? 'inside 30 min' : 'beyond 30 min';
      return `${s.t.toFixed(1)} min to ${c.clinics[s.clinic].name} · ${band}`;
    },
  };
}

/* ---------- 2. transit deserts ---------- */

function createDesertScene(): PlateScene {
  const c = city();
  return {
    idle(f) {
      const m = mapFrame(f);
      const ds = c.blocks.filter((b) => b.desert);
      const b = ds[Math.floor(f.time / 2.2) % ds.length];
      return [m.ox + b.x * m.k, m.oy + b.y * m.k];
    },
    draw(ctx, f) {
      const P = f.palette;
      const m = mapFrame(f);
      drawVignette(ctx, P, f.width, f.height);
      drawGrid(ctx, P, f.width, f.height, 32, 0.035);
      const intro = easeOutCubic(f.age / 1.0);
      drawRoads(ctx, P, c, m, 0.6);

      // 800 m walk catchments around stops
      const r800 = (800 / c.metresPerUnit) * m.k;
      ctx.save();
      ctx.globalCompositeOperation = P.add;
      for (const [sx, sy] of c.stops) {
        const x = m.ox + sx * m.k;
        const y = m.oy + sy * m.k;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r800 * intro);
        g.addColorStop(0, rgba(P.cobalt, 0.12));
        g.addColorStop(0.92, rgba(P.cobalt, 0.05));
        g.addColorStop(1, rgba(P.cobalt, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r800 * intro, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // bus lines
      ctx.save();
      for (const ln of c.lines) {
        ctx.beginPath();
        ln.forEach((k, i) => {
          const x = m.ox + c.nx[k] * m.k;
          const y = m.oy + c.ny[k] * m.k;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        phosphor(ctx, P, P.cobalt, 1, 0.1);
      }
      ctx.restore();
      for (const [sx, sy] of c.stops) {
        ctx.fillStyle = P.alabaster;
        ctx.fillRect(m.ox + sx * m.k - 1.5, m.oy + sy * m.k - 1.5, 3, 3);
      }

      drawDemandVectors(ctx, P, c, m, f.time, intro);

      // blocks
      let hover = -1;
      let hd = Infinity;
      c.blocks.forEach((b, i) => {
        const x = m.ox + b.x * m.k;
        const y = m.oy + b.y * m.k;
        const d = Math.hypot(x - f.pointer.x, y - f.pointer.y);
        if (d < hd) { hd = d; hover = i; }
      });
      if (hd > 40) hover = -1;
      c.blocks.forEach((b, i) => {
        const x = m.ox + b.x * m.k;
        const y = m.oy + b.y * m.k;
        const appear = clamp(intro * 1.6 - (b.x + b.y) * 0.5, 0, 1);
        if (b.desert) {
          glow(ctx, P, x, y, 9, P.red, 0.35 * appear);
          ctx.strokeStyle = rgba(P.red, appear);
          ctx.lineWidth = i === hover ? 1.2 : 0.75;
          const s = i === hover ? 8 : 5;
          ctx.strokeRect(x - s / 2, y - s / 2, s, s);
        } else {
          ctx.fillStyle = rgba(P.silver, 0.45 * appear);
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      });

      drawClinics(ctx, P, c, m, f.time, -1);

      let readout = '43 of 141 blocks beyond 800 m of a stop';
      if (hover >= 0) {
        const b = c.blocks[hover];
        const x = m.ox + b.x * m.k;
        const y = m.oy + b.y * m.k;
        const [sx, sy] = c.stops[b.stop];
        const stx = m.ox + sx * m.k;
        const sty = m.oy + sy * m.k;
        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = rgba(P.alabaster, 0.75);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(stx, sty);
        ctx.stroke();
        ctx.restore();
        const metres = Math.round(b.d * c.metresPerUnit);
        const right = x < f.width - 120;
        label(ctx, `${metres.toLocaleString('en-US')} m`, x + (right ? 10 : -10), y - 8, b.desert ? P.heatText : P.silver, 10, right ? 'left' : 'right');
        readout = `block ${String(hover + 1).padStart(3, '0')} · nearest stop ${metres.toLocaleString('en-US')} m · ${b.desert ? 'transit desert' : 'served'}`;
      }

      let lx = m.ox;
      const legend: [string, string][] = [[P.red, 'desert block'], [P.silver, 'served block'], [P.cobalt, 'bus line · 800 m walk']];
      for (const [col, txt] of legend) {
        ctx.fillStyle = col;
        ctx.fillRect(lx, 13, 6, 6);
        label(ctx, txt, lx + 11, 19, P.silver, 10);
        lx += ctx.measureText(txt).width + 30;
      }
      return readout;
    },
  };
}

/* ---------- 3. live routing ---------- */

function createRouteScene(): PlateScene {
  const c = city();
  const hospital = c.clinics[0].node;
  const tree = dijkstra(c.adj, [hospital]);
  const pathTo = (node: number) => {
    const out: number[] = [];
    for (let k = node; k >= 0; k = tree.prev[k]) out.push(k);
    return out.reverse();
  };
  let target = -1;
  let path: number[] = [];
  let pathLen = 0;
  let changedAt = 0;

  return {
    idle(f) {
      const m = mapFrame(f);
      if (!c.clusters.length) return [f.width / 2, f.height / 2];
      const cl = c.clusters[Math.floor(f.time / 3) % c.clusters.length];
      return [m.ox + c.nx[cl.node] * m.k, m.oy + c.ny[cl.node] * m.k];
    },
    draw(ctx, f) {
      const P = f.palette;
      const m = mapFrame(f);
      drawVignette(ctx, P, f.width, f.height);
      drawGrid(ctx, P, f.width, f.height, 32, 0.035);
      drawRoads(ctx, P, c, m, 1);
      const intro = easeOutCubic(f.age / 0.8);

      // nearest road node to the damped cursor
      let best = 0;
      let bd = Infinity;
      for (let k = 0; k < c.nx.length; k++) {
        const d = (m.ox + c.nx[k] * m.k - f.pointer.x) ** 2 + (m.oy + c.ny[k] * m.k - f.pointer.y) ** 2;
        if (d < bd && Number.isFinite(tree.dist[k])) { bd = d; best = k; }
      }
      if (best !== target) {
        target = best;
        path = pathTo(best);
        pathLen = 0;
        for (let i = 1; i < path.length; i++) pathLen += Math.hypot(c.nx[path[i]] - c.nx[path[i - 1]], c.ny[path[i]] - c.ny[path[i - 1]]);
        changedAt = f.time;
      }

      // pickup clusters
      c.clusters.forEach((cl, i) => {
        const x = m.ox + cl.x * m.k;
        const y = m.oy + cl.y * m.k;
        const r = (6 + cl.size * 2.2) * intro;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(P.red, 0.22));
        g.addColorStop(1, rgba(P.red, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = rgba(P.red, 0.7);
        ctx.stroke();
        const px = m.ox + c.nx[cl.node] * m.k;
        const py = m.oy + c.ny[cl.node] * m.k;
        ctx.fillStyle = P.red;
        ctx.fillRect(px - 2, py - 2, 4, 4);
        label(ctx, `pickup ${i + 1}`, px + 7, py + 12, P.silver, 9);
      });

      // route draw-on after each change
      const grow = f.reduced ? 1 : easeOutCubic((f.time - changedAt) / 0.5);
      const pts = path.map((k) => [m.ox + c.nx[k] * m.k, m.oy + c.ny[k] * m.k] as const);
      const seg: number[] = [0];
      for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const total = seg[seg.length - 1] || 1;
      const at = (d: number): [number, number] => {
        let i = 1;
        while (i < seg.length - 1 && seg[i] < d) i++;
        const t = clamp((d - seg[i - 1]) / ((seg[i] - seg[i - 1]) || 1), 0, 1);
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
      };
      if (pts.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          if (seg[i] > total * grow) {
            const [x, y] = at(total * grow);
            ctx.lineTo(x, y);
            break;
          }
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        phosphor(ctx, P, P.red, 1.4, 0.16);
        // shuttle shuttles out and back: bi-directional
        if (grow >= 1) {
          const cyc = (f.time * 0.22) % 2;
          const d = (cyc < 1 ? cyc : 2 - cyc) * total;
          const [sx, sy] = at(d);
          glow(ctx, P, sx, sy, 16, P.alabaster, 0.6);
          ctx.fillStyle = P.alabaster;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawClinics(ctx, P, c, m, f.time, 0);
      const tx = m.ox + c.nx[target] * m.k;
      const ty = m.oy + c.ny[target] * m.k;
      ctx.strokeStyle = P.alabaster;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.stroke();

      label(ctx, 'shortest path from the hospital', m.ox, 18, P.titanium, 10);
      const minutes = tree.dist[target];
      const km = (pathLen * c.metresPerUnit) / 1000;
      return `route ${Math.max(0, path.length - 1)} segments · ${km.toFixed(1)} km · ${minutes.toFixed(1)} min one way · ${c.clusters.length} pickup clusters`;
    },
  };
}

export const routeRxPlate: PlateDefinition = {
  modes: [
    { id: 'iso', label: 'Isochrones', description: 'Synthetic street network with 5, 15 and 30 minute travel-time isochrones around three generic clinics, plus demand vectors from transit-desert blocks.' },
    { id: 'deserts', label: 'Transit deserts', description: '141 synthetic census blocks; the 43 farthest from any bus stop fall outside an 800 metre walk and are marked as deserts.' },
    { id: 'route', label: 'Routing', description: 'Shortest-path shuttle routing from the hospital to a pickup point chosen by the cursor, with DBSCAN pickup clusters.' },
  ],
  createScene(modeId) {
    if (modeId === 'deserts') return createDesertScene();
    if (modeId === 'route') return createRouteScene();
    return createIsoScene();
  },
};

export default routeRxPlate;
