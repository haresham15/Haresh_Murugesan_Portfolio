import { getProjectBySlug } from '../../content/projects';
import {
  DARK_PALETTE, cornerTicks, MONO, bez, clamp, drawGrid, drawVignette, easeOutCubic, fbm, glow, hexRgb, isoSegments, label, phosphor, ramp,
  rgba, smoothstep, strokeSegments, type PlateDefinition, type PlateScene, type PlatePalette, type StageFrame,
} from './stageKit';

/* ============================================================
 * 1. Depth cloud: synthetic wound surface, rotating, sliced by cursor
 * ============================================================ */

const A = 28; // wound semi-axis (model mm)
const B = 18;
const DMAX = 6; // floor depth (model mm)
const EXTENT = 1.5; // sampled radius as multiple of A
const ELEV = 0.58; // camera elevation (rad)
const Z_EXAG = 2.2;

function surfaceZ(X: number, Y: number): number {
  const re = Math.sqrt((X / A) ** 2 + (Y / B) ** 2);
  const grain = fbm(X * 0.18 + 11, Y * 0.18 + 3, 3) - 0.5;
  if (re < 1) {
    const bowl = Math.pow(1 - re * re, 1.35);
    return -DMAX * bowl * (0.86 + 0.28 * fbm(X * 0.06, Y * 0.06, 2)) + grain * 0.7 * bowl;
  }
  return 0.9 * Math.exp(-(((re - 1) / 0.16) ** 2)) + grain * 0.35;
}

interface CloudData {
  X: Float32Array;
  Y: Float32Array;
  Z: Float32Array;
  bucket: Uint8Array;
  iso: { level: number; segs: Float32Array }[];
  gridStep: number;
  gridN: number;
}

let cloudCache: CloudData | null = null;
function cloud(): CloudData {
  if (cloudCache) return cloudCache;
  const N = 66;
  const R = EXTENT * A;
  const step = (2 * R) / (N - 1);
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];
  const field = new Float32Array(N * N);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const X = -R + i * step;
      const Y = -R + j * step;
      const z = surfaceZ(X, Y);
      field[j * N + i] = z;
      if (X * X + Y * Y > R * R) continue;
      // jitter so the cloud reads as a scan, not a lattice
      const jx = (fbm(i * 1.7, j * 2.3, 1) - 0.5) * step * 0.7;
      const jy = (fbm(j * 1.3, i * 2.9, 1) - 0.5) * step * 0.7;
      xs.push(X + jx);
      ys.push(Y + jy);
      zs.push(surfaceZ(X + jx, Y + jy));
    }
  }
  const Z = new Float32Array(zs);
  const bucket = new Uint8Array(Z.length);
  for (let k = 0; k < Z.length; k++) bucket[k] = Math.min(7, Math.max(0, Math.floor(((1 - Z[k]) / (DMAX + 1)) * 8)));
  const iso = [-1, -2, -3, -4, -5].map((level) => ({ level, segs: isoSegments(field, N, N, level) }));
  cloudCache = { X: new Float32Array(xs), Y: new Float32Array(ys), Z, bucket, iso, gridStep: step, gridN: N };
  return cloudCache;
}

const depthStops = (P: PlatePalette) => [P.cobalt, P.silver, P.silver, P.crimson, P.red] as const;

function createDepthScene(): PlateScene {
  const data = cloud();
  const n = data.X.length;
  const sx = new Float32Array(n);
  const sy = new Float32Array(n);
  const sd = new Float32Array(n);
  const view = { cx: 0, cy: 0, k: 1, theta: 0 };

  const project = (X: number, Y: number, Z: number, out: number[]) => {
    const c = Math.cos(view.theta);
    const s = Math.sin(view.theta);
    const x1 = X * c - Y * s;
    const y1 = X * s + Y * c;
    out[0] = view.cx + x1 * view.k;
    out[1] = view.cy + (y1 * Math.sin(ELEV) - Z * Z_EXAG * Math.cos(ELEV)) * view.k;
    out[2] = y1; // depth (toward viewer is +)
  };

  return {
    idle: (f) => [f.width / 2 + Math.sin(f.time * 0.45) * Math.min(f.width, f.height) * 0.3, f.height * 0.45],
    draw(ctx, f) {
      const P = f.palette;
      const { width: w, height: h } = f;
      drawVignette(ctx, P, w, h, w / 2, h * 0.42);
      drawGrid(ctx, P, w, h, 32, 0.045);

      const plotH = Math.max(64, h * 0.2);
      view.cx = w / 2;
      view.cy = (h - plotH) * 0.5 + 6;
      view.k = Math.min(w * 0.86, (h - plotH) * 1.45) / (2 * EXTENT * A);
      view.theta = f.time * 0.2 + 0.6;
      const intro = easeOutCubic(f.age / 0.9);

      const tmp = [0, 0, 0];
      for (let k = 0; k < n; k++) {
        project(data.X[k], data.Y[k], data.Z[k] * intro, tmp);
        sx[k] = tmp[0];
        sy[k] = tmp[1];
        sd[k] = tmp[2];
      }

      // slicing plane in view space, from the damped cursor
      const sliceView = clamp((f.pointer.x - view.cx) / view.k, -EXTENT * A, EXTENT * A);

      // iso-depth contours projected through the same camera
      ctx.save();
      ctx.lineWidth = 0.5;
      const p0 = [0, 0, 0];
      const p1 = [0, 0, 0];
      const R = EXTENT * A;
      for (const { level, segs } of data.iso) {
        const t = -level / DMAX;
        const [r, g, b] = ramp(depthStops(P), 0.15 + t * 0.85);
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.35 * intro})`;
        ctx.beginPath();
        for (let q = 0; q < segs.length; q += 4) {
          project(-R + segs[q] * data.gridStep, -R + segs[q + 1] * data.gridStep, level * intro, p0);
          project(-R + segs[q + 2] * data.gridStep, -R + segs[q + 3] * data.gridStep, level * intro, p1);
          ctx.moveTo(p0[0], p0[1]);
          ctx.lineTo(p1[0], p1[1]);
        }
        ctx.stroke();
      }
      ctx.restore();

      // point cloud: additive, batched by depth bucket and fog band
      ctx.save();
      ctx.globalCompositeOperation = P.add;
      const c = Math.cos(view.theta);
      const s = Math.sin(view.theta);
      for (let fog = 0; fog < 3; fog++) {
        for (let bk = 0; bk < 8; bk++) {
          ctx.beginPath();
          let any = false;
          for (let k = 0; k < n; k++) {
            if (data.bucket[k] !== bk) continue;
            const band = sd[k] > R * 0.33 ? 2 : sd[k] > -R * 0.33 ? 1 : 0;
            if (band !== fog) continue;
            const x1 = data.X[k] * c - data.Y[k] * s;
            if (Math.abs(x1 - sliceView) < 0.9) continue; // drawn in the slice pass
            ctx.rect(sx[k] - 0.6, sy[k] - 0.6, 1.2, 1.2);
            any = true;
          }
          if (!any) continue;
          const [r, g, b] = ramp(depthStops(P), bk / 7);
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${(0.32 + fog * 0.24) * intro})`;
          ctx.fill();
        }
      }
      ctx.restore();

      // exact cross-section: sample the analytic surface along the plane
      const SAMPLES = 160;
      const prof: number[] = [];
      let floor = 0;
      let floorT = 0;
      let openFrom = Infinity;
      let openTo = -Infinity;
      const half = Math.sqrt(Math.max(0, R * R - sliceView * sliceView));
      for (let i = 0; i <= SAMPLES; i++) {
        const t = -half + (2 * half * i) / SAMPLES;
        const X = sliceView * c + t * s;
        const Y = -sliceView * s + t * c;
        const z = surfaceZ(X, Y) * intro;
        prof.push(t, z);
        if (z < floor) { floor = z; floorT = t; }
        if (z < -0.25) { openFrom = Math.min(openFrom, t); openTo = Math.max(openTo, t); }
      }

      // slice ribbon in 3D
      if (half > 0) {
        ctx.beginPath();
        for (let i = 0; i < prof.length; i += 2) {
          const t = prof[i];
          project(sliceView * c + t * s, -sliceView * s + t * c, prof[i + 1], tmp);
          if (i === 0) ctx.moveTo(tmp[0], tmp[1]);
          else ctx.lineTo(tmp[0], tmp[1]);
        }
        phosphor(ctx, P, P.red, 1, 0.14 * f.pointer.presence + 0.08);
        // slice plane trace
        project(sliceView * c - R * s, -sliceView * s - R * c, 0, p0);
        project(sliceView * c + R * s, -sliceView * s + R * c, 0, p1);
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = rgba(P.silver, 0.45);
        ctx.beginPath();
        ctx.moveTo(p0[0], p0[1]);
        ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
        ctx.restore();
        project(sliceView * c + floorT * s, -sliceView * s + floorT * c, floor, tmp);
        glow(ctx, P, tmp[0], tmp[1], 18, P.red, 0.55);
        ctx.fillStyle = P.alabaster;
        ctx.beginPath();
        ctx.arc(tmp[0], tmp[1], 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2D profile plot
      const px0 = 24;
      const px1 = w - 24;
      const py0 = h - plotH + 8;
      const py1 = h - 14;
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = rgba(P.silver, 0.12);
      ctx.beginPath();
      ctx.moveTo(px0, py0 - 4);
      ctx.lineTo(px1, py0 - 4);
      ctx.stroke();
      const zTop = 1.2;
      const zBot = -DMAX - 0.6;
      const mapX = (t: number) => px0 + ((t + R) / (2 * R)) * (px1 - px0);
      const mapY = (z: number) => py0 + ((zTop - z) / (zTop - zBot)) * (py1 - py0);
      // depth ticks
      for (let z = 0; z >= -DMAX; z -= 2) {
        const y = mapY(z);
        ctx.strokeStyle = rgba(P.cobalt, z === 0 ? 0.35 : 0.14);
        ctx.beginPath();
        ctx.moveTo(px0, y);
        ctx.lineTo(px1, y);
        ctx.stroke();
        label(ctx, `${z === 0 ? ' 0' : z} mm`, px0, y - 3, P.titanium, 9);
      }
      if (half > 0) {
        const grad = ctx.createLinearGradient(0, mapY(0), 0, mapY(-DMAX));
        grad.addColorStop(0, rgba(P.cobalt, 0.0));
        grad.addColorStop(1, rgba(P.red, 0.28));
        ctx.beginPath();
        ctx.moveTo(mapX(prof[0]), mapY(0));
        for (let i = 0; i < prof.length; i += 2) ctx.lineTo(mapX(prof[i]), mapY(Math.min(0, prof[i + 1])));
        ctx.lineTo(mapX(prof[prof.length - 2]), mapY(0));
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        for (let i = 0; i < prof.length; i += 2) {
          const x = mapX(prof[i]);
          const y = mapY(prof[i + 1]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        phosphor(ctx, P, P.silver, 0.75, 0.1);
        const fx = mapX(floorT);
        const fy = mapY(floor);
        glow(ctx, P, fx, fy, 14, P.red, 0.6);
        label(ctx, `${floor.toFixed(2)} mm`, Math.min(fx + 8, px1 - 60), fy + 12, P.alabaster, 10);
      }
      ctx.restore();

      label(ctx, 'synthetic wound surface · model units', 16, 22, P.titanium, 10);

      const open = openTo > openFrom ? (openTo - openFrom).toFixed(1) : '0.0';
      return `slice ${sliceView >= 0 ? '+' : ''}${sliceView.toFixed(1)} mm · floor ${floor.toFixed(2)} mm · open ${open} mm`;
    },
  };
}

/* ============================================================
 * 2. Grad-CAM saliency: procedural tissue + saliency field,
 *    marching-squares isocontours, cursor lens
 * ============================================================ */

const GW = 96;
const GH = 72;

interface SaliencyData {
  field: Float32Array;
  tissue: HTMLCanvasElement;
  heat: HTMLCanvasElement;
  iso: { level: number; segs: Float32Array }[];
  peak: [number, number, number];
}

const salCache = new Map<PlatePalette, SaliencyData>();
function saliency(P: PlatePalette): SaliencyData {
  const hit = salCache.get(P);
  if (hit) return hit;
  const field = new Float32Array(GW * GH);
  const blobs = [
    { x: 0.44, y: 0.46, sx: 0.11, sy: 0.08, a: 1.0, rot: 0.5 },
    { x: 0.6, y: 0.56, sx: 0.07, sy: 0.05, a: 0.72, rot: -0.3 },
    { x: 0.34, y: 0.62, sx: 0.06, sy: 0.04, a: 0.45, rot: 0.9 },
  ];
  let max = 0;
  let peak: [number, number, number] = [0, 0, 0];
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const u = i / (GW - 1);
      const v = j / (GH - 1);
      let s = 0;
      for (const b of blobs) {
        const dx = u - b.x;
        const dy = (v - b.y) * 0.75;
        const rx = dx * Math.cos(b.rot) + dy * Math.sin(b.rot);
        const ry = -dx * Math.sin(b.rot) + dy * Math.cos(b.rot);
        s += b.a * Math.exp(-0.5 * ((rx / b.sx) ** 2 + (ry / b.sy) ** 2));
      }
      s *= 0.85 + 0.3 * fbm(u * 7, v * 7, 3);
      field[j * GW + i] = s;
      if (s > max) { max = s; peak = [u, v, s]; }
    }
  }
  for (let k = 0; k < field.length; k++) field[k] /= max;
  peak[2] = 1;

  const make = (fn: (u: number, v: number, s: number) => [number, number, number, number]) => {
    const cv = document.createElement('canvas');
    const W = 288;
    const H = 216;
    cv.width = W;
    cv.height = H;
    const cx = cv.getContext('2d');
    if (!cx) return cv;
    const img = cx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const u = x / (W - 1);
        const v = y / (H - 1);
        const gi = u * (GW - 1);
        const gj = v * (GH - 1);
        const i0 = Math.min(GW - 2, Math.floor(gi));
        const j0 = Math.min(GH - 2, Math.floor(gj));
        const fx = gi - i0;
        const fy = gj - j0;
        const s =
          field[j0 * GW + i0] * (1 - fx) * (1 - fy) +
          field[j0 * GW + i0 + 1] * fx * (1 - fy) +
          field[(j0 + 1) * GW + i0] * (1 - fx) * fy +
          field[(j0 + 1) * GW + i0 + 1] * fx * fy;
        const [r, g, b, a] = fn(u, v, s);
        const o = (y * W + x) * 4;
        img.data[o] = r;
        img.data[o + 1] = g;
        img.data[o + 2] = b;
        img.data[o + 3] = a;
      }
    }
    cx.putImageData(img, 0, 0);
    return cv;
  };

  const skin = hexRgb(P.titanium);
  const bed = hexRgb(P.crimson);
  const ink = hexRgb(P.alabaster);
  const tissue = make((u, v) => {
    const dx = (u - 0.48) / 0.3;
    const dy = (v - 0.53) / 0.22;
    const re = Math.sqrt(dx * dx + dy * dy) + (fbm(u * 6, v * 6, 3) - 0.5) * 0.35;
    const inBed = 1 - smoothstep(0.85, 1.05, re);
    const tex = fbm(u * 26, v * 26, 4);
    const pores = fbm(u * 60 + 4, v * 60, 2);
    if (P.paper) {
      // Ink wash on paper: density, not light. The figure fades to nothing at its own edge.
      const edge = smoothstep(0, 0.12, Math.min(u, v, 1 - u, 1 - v));
      const d = ((1 - inBed) * (0.05 + tex * 0.16 + pores * 0.05) + inBed * (0.14 + tex * 0.26)) * edge;
      const r = ink[0] * (1 - inBed) + bed[0] * inBed * 0.55 + ink[0] * inBed * 0.45;
      const g = ink[1] * (1 - inBed) + bed[1] * inBed * 0.55 + ink[1] * inBed * 0.45;
      const b = ink[2] * (1 - inBed) + bed[2] * inBed * 0.55 + ink[2] * inBed * 0.45;
      return [r, g, b, Math.round(255 * d)];
    }
    const lum = 0.1 + tex * 0.16 + pores * 0.05;
    const r = skin[0] * lum * (1 - inBed) + bed[0] * (0.16 + tex * 0.32) * inBed;
    const g = skin[1] * lum * (1 - inBed) + bed[1] * (0.1 + tex * 0.2) * inBed;
    const b = skin[2] * lum * (1 - inBed) + bed[2] * (0.1 + tex * 0.18) * inBed;
    return [r, g, b, 255];
  });
  const heat = make((_u, _v, s) => {
    const [r, g, b] = ramp(P.heatRamp, s);
    return [r, g, b, Math.round(255 * smoothstep(0.06, 0.38, s))];
  });
  const iso = [0.2, 0.4, 0.6, 0.8].map((level) => ({ level, segs: isoSegments(field, GW, GH, level) }));
  const data = { field, tissue, heat, iso, peak };
  salCache.set(P, data);
  return data;
}

function sampleField(field: Float32Array, u: number, v: number): number {
  if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  const gi = u * (GW - 1);
  const gj = v * (GH - 1);
  const i0 = Math.min(GW - 2, Math.floor(gi));
  const j0 = Math.min(GH - 2, Math.floor(gj));
  const fx = gi - i0;
  const fy = gj - j0;
  return (
    field[j0 * GW + i0] * (1 - fx) * (1 - fy) +
    field[j0 * GW + i0 + 1] * fx * (1 - fy) +
    field[(j0 + 1) * GW + i0] * (1 - fx) * fy +
    field[(j0 + 1) * GW + i0 + 1] * fx * fy
  );
}

function createSaliencyScene(P: PlatePalette): PlateScene {
  const data = saliency(P);
  const rect = { x: 0, y: 0, w: 1, h: 1 };
  const fit = (f: StageFrame) => {
    const pad = 20;
    const barW = 46;
    const availW = f.width - pad * 2 - barW;
    const availH = f.height - pad * 2 - 14;
    const w = Math.min(availW, (availH * 4) / 3);
    const h = (w * 3) / 4;
    rect.x = pad + (availW - w) / 2;
    rect.y = pad + 14 + (availH - h) / 2;
    rect.w = w;
    rect.h = h;
  };
  return {
    idle(f) {
      fit(f);
      const t = f.time * 0.35;
      return [
        rect.x + rect.w * (data.peak[0] + Math.sin(t) * 0.22),
        rect.y + rect.h * (data.peak[1] + Math.sin(t * 1.7 + 1) * 0.16),
      ];
    },
    draw(ctx, f) {
      const P = f.palette;
      fit(f);
      const { x, y, w, h } = rect;
      const intro = easeOutCubic(f.age / 0.8);
      drawVignette(ctx, P, f.width, f.height);

      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(data.tissue, x, y, w, h);
      // faint global saliency so the heat reads outside the lens
      ctx.globalAlpha = 0.22 * intro;
      ctx.drawImage(data.heat, x, y, w, h);
      ctx.restore();

      // lens: full saliency inside a circle around the damped cursor
      const lr = Math.min(w, h) * 0.24;
      const lx = clamp(f.pointer.x, x, x + w);
      const ly = clamp(f.pointer.y, y, y + h);
      ctx.save();
      ctx.beginPath();
      ctx.arc(lx, ly, lr * intro, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = 0.92;
      ctx.drawImage(data.heat, x, y, w, h);
      ctx.globalCompositeOperation = P.add;
      ctx.globalAlpha = 0.25;
      ctx.drawImage(data.heat, x, y, w, h);
      ctx.restore();

      // isocontours
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const sxs = w / (GW - 1);
      const sys = h / (GH - 1);
      for (const { level, segs } of data.iso) {
        const [r, g, b] = ramp([P.cobalt, P.silver, P.crimson, P.red], (level - 0.2) / 0.6);
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${0.75 * intro})`;
        ctx.lineWidth = level >= 0.8 ? 1 : 0.5;
        ctx.setLineDash(level === 0.2 ? [3, 3] : []);
        strokeSegments(ctx, segs, sxs, sys, x, y);
      }
      ctx.restore();

      // lens rim
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = rgba(P.alabaster, 0.7);
      ctx.beginPath();
      ctx.arc(lx, ly, lr * intro, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = rgba(P.red, 0.35);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(lx, ly, lr * intro + 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // peak crosshair
      const pkx = x + data.peak[0] * w;
      const pky = y + data.peak[1] * h;
      glow(ctx, P, pkx, pky, 22, P.red, 0.5 * intro);
      ctx.save();
      ctx.strokeStyle = P.alabaster;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(pkx - 9, pky); ctx.lineTo(pkx - 3, pky);
      ctx.moveTo(pkx + 3, pky); ctx.lineTo(pkx + 9, pky);
      ctx.moveTo(pkx, pky - 9); ctx.lineTo(pkx, pky - 3);
      ctx.moveTo(pkx, pky + 3); ctx.lineTo(pkx, pky + 9);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'peak 1.000', pkx + 12, pky - 8, P.alabaster, 10);

      // frame: corner ticks on paper, a hairline on carbon
      if (P.paper) {
        cornerTicks(ctx, rgba(P.silver, 0.5), x, y, w, h);
      } else {
        ctx.save();
        ctx.strokeStyle = rgba(P.silver, 0.18);
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 0.25, y + 0.25, w - 0.5, h - 0.5);
        ctx.restore();
      }
      label(ctx, 'grad-cam activation over tissue bed · illustrative input', x, y - 8, P.titanium, 10);

      // colour bar
      const bx = x + w + 18;
      const by0 = y;
      const by1 = y + h;
      const steps = 48;
      for (let i = 0; i < steps; i++) {
        const [r, g, b] = ramp(P.heatRamp, 1 - i / steps);
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx.fillRect(bx, by0 + ((by1 - by0) * i) / steps, 6, (by1 - by0) / steps + 0.5);
      }
      const a = sampleField(data.field, (f.pointer.x - x) / w, (f.pointer.y - y) / h);
      const ay = by1 - a * (by1 - by0);
      ctx.fillStyle = P.alabaster;
      ctx.beginPath();
      ctx.moveTo(bx - 2, ay);
      ctx.lineTo(bx - 7, ay - 4);
      ctx.lineTo(bx - 7, ay + 4);
      ctx.closePath();
      ctx.fill();
      label(ctx, '1.0', bx + 10, by0 + 8, P.titanium, 9);
      label(ctx, '0.0', bx + 10, by1, P.titanium, 9);

      return `activation ${a.toFixed(3)} at cursor · isolines 0.2 / 0.4 / 0.6 / 0.8`;
    },
  };
}

/* ============================================================
 * 3. Pipeline: the Healios C4 container graph from content
 * ============================================================ */

interface DagNode { id: string; label: string; sub: string; desc: string; x: number; y: number; w: number; h: number }

function createPipelineScene(): PlateScene {
  const c4 = getProjectBySlug('healios')?.caseStudy.c4Diagram;
  const srcNodes = c4?.nodes ?? [];
  const edges = c4?.edges ?? [];
  const nodes: DagNode[] = srcNodes.map((nd) => ({ id: nd.id, label: nd.label, sub: nd.sublabel ?? '', desc: nd.description ?? '', x: 0, y: 0, w: 0, h: 0 }));
  const byId = new Map(nodes.map((nd) => [nd.id, nd]));
  // column = longest path depth from the sources
  const depth = new Map<string, number>();
  nodes.forEach((nd) => depth.set(nd.id, 0));
  for (let pass = 0; pass < nodes.length; pass++) {
    for (const e of edges) depth.set(e.to, Math.max(depth.get(e.to) ?? 0, (depth.get(e.from) ?? 0) + 1));
  }
  const cols = Math.max(0, ...Array.from(depth.values())) + 1;
  let hovered: DagNode | null = null;

  const layout = (f: StageFrame) => {
    const top = 34;
    const bottom = f.height - 74;
    const colW = f.width / cols;
    const nw = Math.min(200, colW * 0.84);
    const nh = f.width < 520 ? 40 : 46;
    for (let c = 0; c < cols; c++) {
      const col = nodes.filter((nd) => depth.get(nd.id) === c);
      const gap = (bottom - top) / col.length;
      col.forEach((nd, i) => {
        nd.w = nw;
        nd.h = nh;
        nd.x = colW * c + (colW - nw) / 2;
        nd.y = top + gap * i + (gap - nh) / 2;
      });
    }
  };

  const fitText = (ctx: CanvasRenderingContext2D, text: string, max: number) => {
    if (ctx.measureText(text).width <= max) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > max) t = t.slice(0, -1);
    return t + '…';
  };

  return {
    idle(f) {
      layout(f);
      if (!nodes.length) return [f.width / 2, f.height / 2];
      const nd = nodes[Math.floor(f.time / 2.6) % nodes.length];
      return [nd.x + nd.w / 2, nd.y + nd.h / 2];
    },
    draw(ctx, f) {
      const P = f.palette;
      layout(f);
      drawVignette(ctx, P, f.width, f.height);
      drawGrid(ctx, P, f.width, f.height, 24, 0.04);
      const intro = easeOutCubic(f.age / 0.9);
      const px = f.pointer.x;
      const py = f.pointer.y;
      hovered = nodes.find((nd) => px >= nd.x - 6 && px <= nd.x + nd.w + 6 && py >= nd.y - 6 && py <= nd.y + nd.h + 6) ?? hovered ?? nodes[0] ?? null;

      // edges
      edges.forEach((e, ei) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return;
        const x0 = a.x + a.w;
        const y0 = a.y + a.h / 2;
        const x3 = b.x;
        const y3 = b.y + b.h / 2;
        const dx = (x3 - x0) * 0.5;
        const hot = hovered && (hovered.id === e.from || hovered.id === e.to);
        const reveal = clamp(intro * 1.4 - ei * 0.08, 0, 1);
        ctx.beginPath();
        const N = 32;
        for (let i = 0; i <= N * reveal; i++) {
          const t = i / N;
          const x = bez(x0, x0 + dx, x3 - dx, x3, t);
          const y = bez(y0, y0, y3, y3, t);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (hot) phosphor(ctx, P, P.red, 0.9, 0.12);
        else {
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = rgba(P.cobalt, 0.6);
          ctx.stroke();
        }
        // packets with trailing samples
        if (reveal >= 1) {
          for (let k = 0; k < 2; k++) {
            const head = (f.time * 0.32 + k * 0.5 + ei * 0.17) % 1;
            for (let tr = 0; tr < 7; tr++) {
              const t = head - tr * 0.018;
              if (t < 0) continue;
              const x = bez(x0, x0 + dx, x3 - dx, x3, t);
              const y = bez(y0, y0, y3, y3, t);
              const al = (1 - tr / 7) * (hot ? 0.95 : 0.6);
              ctx.fillStyle = rgba(hot ? P.red : P.silver, al);
              ctx.fillRect(x - 1, y - 1, 2, 2);
            }
            const x = bez(x0, x0 + dx, x3 - dx, x3, head);
            const y = bez(y0, y0, y3, y3, head);
            glow(ctx, P, x, y, hot ? 12 : 8, hot ? P.red : P.cobalt, hot ? 0.6 : 0.35);
          }
        }
      });

      // nodes
      const small = f.width < 520;
      nodes.forEach((nd, i) => {
        const appear = clamp(intro * 1.5 - i * 0.06, 0, 1);
        if (appear <= 0) return;
        const isHot = hovered?.id === nd.id;
        ctx.save();
        ctx.globalAlpha = appear;
        const g = ctx.createLinearGradient(nd.x, nd.y, nd.x, nd.y + nd.h);
        g.addColorStop(0, rgba(isHot ? P.cobaltMid : P.cobaltDeep, isHot ? 0.55 : 0.4));
        g.addColorStop(1, rgba(P.midnight, 0.6));
        ctx.fillStyle = g;
        if (!P.paper) ctx.fillRect(nd.x, nd.y, nd.w, nd.h);
        ctx.lineWidth = isHot ? 1 : 0.5;
        ctx.strokeStyle = isHot ? P.red : rgba(P.silver, 0.35);
        ctx.strokeRect(nd.x + 0.25, nd.y + 0.25, nd.w - 0.5, nd.h - 0.5);
        if (isHot) glow(ctx, P, nd.x + nd.w / 2, nd.y + nd.h / 2, nd.w * 0.6, P.red, 0.12);
        ctx.font = `${small ? 10 : 11.5}px ${MONO}`;
        ctx.fillStyle = P.alabaster;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(fitText(ctx, nd.label, nd.w - 16), nd.x + 8, nd.y + (small ? 17 : 19));
        ctx.font = `${small ? 9 : 10}px ${MONO}`;
        ctx.fillStyle = isHot ? P.silver : P.titanium;
        ctx.fillText(fitText(ctx, nd.sub, nd.w - 16), nd.x + 8, nd.y + (small ? 31 : 35));
        ctx.restore();
      });

      // detail line under the graph
      if (hovered) {
        ctx.save();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = rgba(P.silver, 0.12);
        ctx.beginPath();
        ctx.moveTo(20, f.height - 58);
        ctx.lineTo(f.width - 20, f.height - 58);
        ctx.stroke();
        ctx.restore();
        label(ctx, hovered.label, 20, f.height - 38, P.heatText, 11);
        ctx.font = `${small ? 10 : 11}px ${MONO}`;
        ctx.fillStyle = P.silver;
        ctx.textAlign = 'left';
        ctx.fillText(fitText(ctx, hovered.desc, f.width - 40), 20, f.height - 20);
      }

      const out = hovered ? edges.filter((e) => e.from === hovered!.id || e.to === hovered!.id) : [];
      return hovered
        ? `${hovered.label} · ${out.length} link${out.length === 1 ? '' : 's'}${out[0]?.protocol ? ` · ${out[0].protocol}` : ''}`
        : 'pipeline';
    },
  };
}

export const healiosPlate: PlateDefinition = {
  modes: [
    { id: 'depth', label: 'Depth cloud', description: 'Rotating point cloud of a synthetic wound surface. Moving the cursor slices it and plots the depth profile.' },
    { id: 'saliency', label: 'Grad-CAM', description: 'Grad-CAM saliency heatmap with isocontours. A lens follows the cursor and reads the activation under it.' },
    { id: 'pipeline', label: 'Pipeline', description: 'The Healios container diagram: patient app, FastAPI gateway, Grad-CAM engine, tissue analyzer, protocol retrieval and EHR store.' },
  ],
  createScene(modeId, palette = DARK_PALETTE) {
    if (modeId === 'saliency') return createSaliencyScene(palette);
    if (modeId === 'pipeline') return createPipelineScene();
    return createDepthScene();
  },
};

export default healiosPlate;
