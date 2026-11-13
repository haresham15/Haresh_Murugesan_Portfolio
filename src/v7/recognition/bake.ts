/**
 * Rasterise once, reuse forever: each award becomes three bitmaps (depth z = 0, 0.5, 1)
 * with blur and brightness baked in, plus one reeded-edge strip shared by every medal.
 * The DOM only ever crossfades their opacity; it never animates a filter.
 */
import type { Award } from '@/content/awards';
import { buildHeightMap, fontsReady, type HeightMap } from './heightmap';
import { BAKE_LIGHT, ENAMEL_ACCENT, ENAMEL_COBALT, SILVER, makeLight, shadeRows } from './shade';
import { LEVEL_Z, depthLook } from './orbit';

export interface MedalBitmaps {
  /** Object URLs for depth levels 0, 0.5 and 1. */
  levels: [string, string, string];
}

export interface BakeResult {
  maps: HeightMap[];
  medals: MedalBitmaps[];
  edge: string;
}

export const enamelOf = (a: Award) => (a.enamel === 'accent' ? ENAMEL_ACCENT : ENAMEL_COBALT);

/** Map resolution for an active medallion of `d` CSS px. */
export const bakeRes = (d: number, dpr: number) =>
  Math.min(1024, Math.max(512, Math.ceil((d * Math.min(dpr, 1.5)) / 64) * 64));

const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));

function canvas(w: number, h: number) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  return cv;
}

function toUrl(cv: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    cv.toBlob((b) => (b ? resolve(URL.createObjectURL(b)) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

let filterOk: boolean | null = null;
function canFilter(ctx: CanvasRenderingContext2D) {
  if (filterOk === null) {
    ctx.filter = 'blur(2px)';
    filterOk = ctx.filter === 'blur(2px)';
    ctx.filter = 'none';
  }
  return filterOk;
}

/** Blurred levels carry this much transparent margin on each side, as a fraction of the face. */
export const LEVEL_PAD = 0.08;

/**
 * One depth level: downsized, blurred by 8px * z at its display size, and darkened to
 * brightness 1 - 0.5z. The blur needs room to spread, so the bitmap is padded by
 * LEVEL_PAD on every side and the DOM places it with a matching negative inset.
 * Falls back to a down-up resample blur where ctx.filter is unsupported.
 */
function level(src: HTMLCanvasElement, z: number, d: number): HTMLCanvasElement {
  const { scale, blur, brightness } = depthLook(z);
  const inner = Math.max(128, Math.round(src.width * (z >= 1 ? 0.375 : 0.5)));
  const pad = Math.round(inner * LEVEL_PAD);
  const total = inner + 2 * pad;
  // Blur in this level's pixels: CSS blur over the displayed size d * scale.
  const px = (blur * inner) / Math.max(1, d * scale);
  const out = canvas(total, total);
  const ctx = out.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  if (canFilter(ctx)) {
    ctx.filter = `blur(${px.toFixed(2)}px)`;
    ctx.drawImage(src, pad, pad, inner, inner);
    ctx.filter = 'none';
  } else {
    const k = Math.max(1, px * 1.6);
    const sw = Math.max(8, Math.round(total / k));
    const small = canvas(sw, sw);
    const sctx = small.getContext('2d')!;
    sctx.imageSmoothingQuality = 'high';
    const f = sw / total;
    sctx.drawImage(src, pad * f, pad * f, inner * f, inner * f);
    ctx.drawImage(small, 0, 0, total, total);
  }
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = `rgba(3,5,10,${(1 - brightness).toFixed(3)})`;
  ctx.fillRect(0, 0, total, total);
  return out;
}

/**
 * Reeded edge seen edge-on: a strip `thick` wide and `d` tall. Reeds sit at even angles
 * around the rim, so they crowd toward the top and bottom where the rim turns away.
 */
async function edgeStrip(res: number): Promise<string> {
  const h = res;
  const w = Math.max(8, Math.round(res * 0.05));
  const cv = canvas(w, h);
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  const reeds = 180;
  for (let y = 0; y < h; y++) {
    const s = ((y + 0.5) / h) * 2 - 1; // -1..1 down the rim
    const th = Math.asin(Math.max(-1, Math.min(1, s)));
    const facing = Math.cos(th);
    const reed = 0.5 + 0.5 * Math.cos(th * reeds);
    for (let x = 0; x < w; x++) {
      const u = ((x + 0.5) / w) * 2 - 1; // across the thickness
      const bevel = 1 - Math.pow(Math.abs(u), 6) * 0.6;
      const lum = (0.18 + 0.7 * facing * (0.55 + 0.45 * reed)) * bevel;
      const i = (y * w + x) * 4;
      img.data[i] = SILVER[0] * lum * 255;
      img.data[i + 1] = SILVER[1] * lum * 255;
      img.data[i + 2] = SILVER[2] * lum * 255;
      img.data[i + 3] = Math.min(1, facing * 6) * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return toUrl(cv);
}

export interface BakeOptions {
  awards: Award[];
  /** Active medallion diameter, CSS px. */
  d: number;
  dpr: number;
  /** Called as each medal finishes, so the orbit fills in progressively. */
  onMedal?: (index: number, medal: MedalBitmaps, map: HeightMap) => void;
  isAlive: () => boolean;
}

/** Bake every medal, yielding to the main thread between row bands (~4 ms each). */
export async function bakeAll(opts: BakeOptions): Promise<BakeResult | null> {
  await fontsReady();
  const res = bakeRes(opts.d, opts.dpr);
  const light = makeLight(BAKE_LIGHT.x, BAKE_LIGHT.y);
  const maps: HeightMap[] = [];
  const medals: MedalBitmaps[] = [];
  const band = Math.max(16, Math.round(65536 / res));
  for (let i = 0; i < opts.awards.length; i++) {
    if (!opts.isAlive()) return null;
    const map = buildHeightMap(opts.awards[i], res);
    await yieldToMain();
    const img = new ImageData(res, res);
    for (let y = 0; y < res; y += band) {
      if (!opts.isAlive()) return null;
      shadeRows(map.data, img.data, res, y, Math.min(res, y + band), light, enamelOf(opts.awards[i]));
      await yieldToMain();
    }
    const sharp = canvas(res, res);
    sharp.getContext('2d')!.putImageData(img, 0, 0);
    const urls = await Promise.all([
      toUrl(sharp),
      toUrl(level(sharp, LEVEL_Z[1], opts.d)),
      toUrl(level(sharp, LEVEL_Z[2], opts.d)),
    ]);
    const medal: MedalBitmaps = { levels: [urls[0], urls[1], urls[2]] };
    if (!opts.isAlive()) {
      urls.forEach((u) => URL.revokeObjectURL(u));
      return null;
    }
    maps.push(map);
    medals.push(medal);
    opts.onMedal?.(i, medal, map);
  }
  const edge = await edgeStrip(res);
  return { maps, medals, edge };
}

export function revoke(r: Pick<BakeResult, 'medals'> & { edge?: string }) {
  for (const m of r.medals) m.levels.forEach((u) => URL.revokeObjectURL(u));
  if (r.edge) URL.revokeObjectURL(r.edge);
}
