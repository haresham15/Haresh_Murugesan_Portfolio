/**
 * The medallion lighting model. The live fragment shader (shader.ts) is generated from
 * these constants and `shadeTexel` is the same function in TypeScript, used to bake the
 * background bitmaps (and every bitmap on the static tier, which opens no WebGL context).
 *
 * Height map packing (RGBA8): R = height (white raised, black cut), G = enamel mask,
 * B = coverage (the disc, antialiased), A = 255.
 */

export const SILVER: readonly [number, number, number] = [0.784, 0.824, 0.878]; // #C8D2E0
export const ENAMEL_ACCENT: readonly [number, number, number] = [1.0, 0.157, 0.0]; // #FF2800
export const ENAMEL_COBALT: readonly [number, number, number] = [0.145, 0.388, 0.922]; // #2563EB

export const AMBIENT = 0.1;
export const DIFFUSE = 0.62;
export const SPEC = 0.85;
export const SPEC_POW = 48;
export const BRUSH = 0.5;
export const ENAMEL_SPEC_POW = 96;
/** Relief depth in texels at 1024 px; scales with resolution. */
export const DEPTH_1024 = 9;
/** Light elevation term: planar pointer offset is divided against this. */
export const LIGHT_Z = 0.85;
/** Fixed light for baked bitmaps: upper left. */
export const BAKE_LIGHT = { x: -0.62, y: 0.55 };

/** Sobel sample distance in texels for a map of `res` px. */
export const sobelStep = (res: number) => Math.max(1, (1.25 * res) / 1024);
/** Normal strength for a map of `res` px with Sobel step `d`. */
export const normalScale = (res: number, d: number) => (DEPTH_1024 * (res / 1024)) / (8 * d);

/** Radial brushing: cos(2(phi - phi_light))^24, from unit 2D directions. */
export function brushTerm(px: number, py: number, lx: number, ly: number): number {
  const c = px * lx + py * ly; // cos(delta)
  const c2 = 2 * c * c - 1; // cos(2 delta)
  const p2 = c2 * c2;
  const p4 = p2 * p2;
  const p8 = p4 * p4;
  return p8 * p8 * p8; // ^24
}

export interface Light {
  /** Normalised 3D light direction, y up, z toward the viewer. */
  x: number;
  y: number;
  z: number;
  /** Planar azimuth as a unit vector, and how planar the light is (0..1). */
  ax: number;
  ay: number;
  planar: number;
}

/** Planar offset (-1.6..1.6, y up) to a light, with an optional azimuth rotation. */
export function makeLight(px: number, py: number, rotate = 0): Light {
  let len = Math.hypot(px, py);
  if (len > 1.6) {
    px *= 1.6 / len;
    py *= 1.6 / len;
    len = 1.6;
  }
  if (rotate !== 0) {
    const c = Math.cos(rotate);
    const s = Math.sin(rotate);
    const rx = px * c - py * s;
    py = px * s + py * c;
    px = rx;
  }
  const n = Math.hypot(px, py, LIGHT_Z);
  const ax = len > 1e-4 ? px / len : 1;
  const ay = len > 1e-4 ? py / len : 0;
  return { x: px / n, y: py / n, z: LIGHT_Z / n, ax, ay, planar: Math.min(1, len / 0.6) };
}

/**
 * Shade one texel. Inputs are the height samples needed for Sobel, already scaled.
 * Writes straight (not premultiplied) RGB, 0..1, into `out` and returns it.
 */
export function shadeTexel(
  h: number,
  gx: number,
  gyUp: number,
  enamel: number,
  dirX: number,
  dirY: number,
  L: Light,
  enamelRgb: readonly [number, number, number],
  boost: number,
  out: [number, number, number],
): [number, number, number] {
  // Normal from the Sobel gradient.
  let nx = -gx;
  let ny = -gyUp;
  let nz = 1;
  const nl = Math.hypot(nx, ny, nz);
  nx /= nl;
  ny /= nl;
  nz /= nl;
  // Blinn half-vector with V = (0, 0, 1).
  let hx = L.x;
  let hy = L.y;
  let hz = L.z + 1;
  const hl = Math.hypot(hx, hy, hz);
  hx /= hl;
  hy /= hl;
  hz /= hl;
  const ndl = Math.max(0, nx * L.x + ny * L.y + nz * L.z);
  const ndh = Math.max(0, nx * hx + ny * hy + nz * hz);
  const ao = 0.5 + 0.5 * h;

  // Machined silver.
  const flat = Math.pow(nz, 8);
  const brush = BRUSH * (1 + 1.4 * boost) * L.planar * flat * brushTerm(dirX, dirY, L.ax, L.ay);
  const spec = SPEC * (1 + 0.8 * boost) * Math.pow(ndh, SPEC_POW);
  const diff = (AMBIENT + DIFFUSE * ndl) * ao;
  let r = SILVER[0] * (diff + brush) + spec * (0.7 * SILVER[0] + 0.3);
  let g = SILVER[1] * (diff + brush) + spec * (0.7 * SILVER[1] + 0.3);
  let b = SILVER[2] * (diff + brush) + spec * (0.7 * SILVER[2] + 0.3);

  // Glassy enamel.
  if (enamel > 0) {
    const ed = 0.2 + 0.72 * ndl;
    const es = 0.6 * Math.pow(ndh, ENAMEL_SPEC_POW) * (1 + boost);
    r += (enamelRgb[0] * ed + es - r) * enamel;
    g += (enamelRgb[1] * ed + es - g) * enamel;
    b += (enamelRgb[2] * ed + es - b) * enamel;
  }
  out[0] = Math.min(1, r);
  out[1] = Math.min(1, g);
  out[2] = Math.min(1, b);
  return out;
}

/**
 * Shade rows [y0, y1) of a packed height map into `dst` (straight RGBA8 for ImageData,
 * alpha = coverage). Split into row bands so the bake can yield between them.
 */
export function shadeRows(
  src: Uint8ClampedArray,
  dst: Uint8ClampedArray,
  res: number,
  y0: number,
  y1: number,
  L: Light,
  enamelRgb: readonly [number, number, number],
): void {
  const d = Math.max(1, Math.round(sobelStep(res)));
  const k = normalScale(res, d) / 255;
  const c = (res - 1) / 2;
  const out: [number, number, number] = [0, 0, 0];
  const H = (x: number, y: number) => {
    const xi = x < 0 ? 0 : x >= res ? res - 1 : x;
    const yi = y < 0 ? 0 : y >= res ? res - 1 : y;
    return src[(yi * res + xi) * 4];
  };
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < res; x++) {
      const i = (y * res + x) * 4;
      const cov = src[i + 2];
      if (cov === 0) {
        dst[i] = dst[i + 1] = dst[i + 2] = dst[i + 3] = 0;
        continue;
      }
      const tl = H(x - d, y - d), t = H(x, y - d), tr = H(x + d, y - d);
      const l = H(x - d, y), r = H(x + d, y);
      const bl = H(x - d, y + d), b = H(x, y + d), br = H(x + d, y + d);
      const gx = (tr + 2 * r + br - (tl + 2 * l + bl)) * k;
      const gyImg = (bl + 2 * b + br - (tl + 2 * t + tr)) * k;
      const px = x - c;
      const py = c - y;
      const pl = Math.hypot(px, py) || 1;
      shadeTexel(src[i] / 255, gx, -gyImg, src[i + 1] / 255, px / pl, py / pl, L, enamelRgb, 0, out);
      dst[i] = out[0] * 255;
      dst[i + 1] = out[1] * 255;
      dst[i + 2] = out[2] * 255;
      dst[i + 3] = cov;
    }
  }
}
