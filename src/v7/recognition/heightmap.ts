/**
 * One greyscale height map per award: white is raised, black is cut.
 *
 * Radii are fractions of the face radius R:
 *   0.93-1.00  knurled bezel, 120 notches
 *   0.905-0.93 groove
 *   0.86-0.905 enamel ring (G channel)
 *   0.85       raised wire
 *   0.70-0.84  ring lettering on a circular path, raised from a sunken band
 *   0.685      rim beading
 *   0-0.665    domed field, 24 dial ticks, central mark in display serif
 *
 * Drawn with Canvas 2D rather than an SVG <img>, because an SVG rasterised through an
 * image cannot use the page's web fonts. The geometry is the same an SVG would carry.
 */
import type { Award } from '@/content/awards';

const SERIF = '"Geist Serif", "Newsreader", Georgia, serif';
const MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

export const FONT_LOADS = [`italic 400 64px ${SERIF}`, `600 32px ${MONO}`];

const grey = (v: number) => {
  const c = Math.round(Math.min(1, Math.max(0, v)) * 255);
  return `rgb(${c},${c},${c})`;
};

function ring(ctx: CanvasRenderingContext2D, c: number, r0: number, r1: number, v: number) {
  ctx.beginPath();
  ctx.arc(c, c, r1, 0, Math.PI * 2);
  ctx.arc(c, c, r0, 0, Math.PI * 2, true);
  ctx.fillStyle = grey(v);
  ctx.fill('evenodd');
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, v: number) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = grey(v);
  ctx.fill();
}

/** Raised type with a rounded profile: wide dim strokes under a bright fill. */
function pillowText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, top: number) {
  ctx.lineJoin = 'round';
  const passes: Array<[number, number]> = [
    [w * 2, top - 0.3],
    [w, top - 0.16],
  ];
  for (const [lw, v] of passes) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = grey(v);
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = grey(top);
  ctx.fillText(text, x, y);
}

function drawHeight(ctx: CanvasRenderingContext2D, award: Award, size: number, R: number) {
  const c = size / 2;
  ctx.fillStyle = grey(0);
  ctx.fillRect(0, 0, size, size);

  // Domed central field, then the bands from the outside in.
  const dome = ctx.createRadialGradient(c, c, 0, c, c, R * 0.665);
  dome.addColorStop(0, grey(0.56));
  dome.addColorStop(1, grey(0.47));
  ctx.fillStyle = dome;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.fill();

  // Knurled bezel with a chamfered outer lip.
  ring(ctx, c, R * 0.93, R, 0.8);
  ctx.save();
  ctx.translate(c, c);
  const notchW = ((2 * Math.PI * R) / 120) * 0.42;
  ctx.fillStyle = grey(0.44);
  for (let k = 0; k < 120; k++) {
    ctx.rotate((2 * Math.PI) / 120);
    ctx.fillRect(-notchW / 2, -R, notchW, R * 0.06);
  }
  ctx.restore();
  ring(ctx, c, R * 0.985, R, 0.62);
  ring(ctx, c, R * 0.905, R * 0.93, 0.2);
  ring(ctx, c, R * 0.86, R * 0.905, 0.52);
  ring(ctx, c, R * 0.844, R * 0.858, 0.86);

  // Sunken lettering band, lettering raised from it.
  ring(ctx, c, R * 0.7, R * 0.84, 0.38);
  const text = award.inscription;
  const n = text.length;
  const rText = R * 0.77;
  const advance = (2 * Math.PI * rText) / n;
  const fontPx = Math.min(R * 0.082, advance / 0.62);
  ctx.font = `600 ${fontPx}px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    if (ch === ' ') continue;
    const th = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / n;
    ctx.save();
    ctx.translate(c + rText * Math.cos(th), c + rText * Math.sin(th));
    ctx.rotate(th + Math.PI / 2);
    pillowText(ctx, ch, 0, 0, fontPx * 0.06, 0.92);
    ctx.restore();
  }

  // Rim beading and the inner wire.
  ring(ctx, c, R * 0.658, R * 0.672, 0.8);
  const beads = 72;
  for (let k = 0; k < beads; k++) {
    const th = (k * 2 * Math.PI) / beads;
    const x = c + R * 0.686 * Math.cos(th);
    const y = c + R * 0.686 * Math.sin(th);
    circle(ctx, x, y, R * 0.0105, 0.7);
    circle(ctx, x, y, R * 0.0068, 0.95);
  }

  // Dial ticks.
  ctx.save();
  ctx.translate(c, c);
  ctx.lineCap = 'round';
  for (let k = 0; k < 24; k++) {
    const major = k % 6 === 0;
    ctx.strokeStyle = grey(major ? 0.82 : 0.72);
    ctx.lineWidth = R * (major ? 0.009 : 0.006);
    ctx.beginPath();
    ctx.moveTo(0, -R * 0.615);
    ctx.lineTo(0, -R * (major ? 0.53 : 0.565));
    ctx.stroke();
    ctx.rotate((2 * Math.PI) / 24);
  }
  ctx.restore();

  // Central mark.
  const mark = award.centerMark;
  const markPx = R * (mark.length > 3 ? 0.36 : 0.44);
  ctx.font = `italic 400 ${markPx}px ${SERIF}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const m = ctx.measureText(mark);
  const asc = m.actualBoundingBoxAscent || markPx * 0.7;
  const desc = m.actualBoundingBoxDescent || 0;
  pillowText(ctx, mark, c, c + (asc - desc) / 2, markPx * 0.025, 1);
}

function drawEnamel(ctx: CanvasRenderingContext2D, size: number, R: number) {
  const c = size / 2;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  ring(ctx, c, R * 0.862, R * 0.903, 1);
}

export interface HeightMap {
  res: number;
  /** Packed RGBA8: R height, G enamel, B coverage, A 255. */
  data: Uint8ClampedArray;
}

/** Face radius as a fraction of half the map: a small margin keeps the edge antialiased. */
export const FACE_FRACTION = 0.985;

export function buildHeightMap(award: Award, res: number): HeightMap {
  const R = (res / 2) * FACE_FRACTION;
  const cv = document.createElement('canvas');
  cv.width = cv.height = res;
  const ctx = cv.getContext('2d', { willReadFrequently: true })!;
  drawHeight(ctx, award, res, R);
  const height = ctx.getImageData(0, 0, res, res).data;
  drawEnamel(ctx, res, R);
  const enamel = ctx.getImageData(0, 0, res, res).data;
  cv.width = cv.height = 0;

  const data = new Uint8ClampedArray(res * res * 4);
  const c = (res - 1) / 2;
  for (let y = 0; y < res; y++) {
    for (let x = 0; x < res; x++) {
      const i = (y * res + x) * 4;
      const cov = Math.min(1, Math.max(0, R - Math.hypot(x - c, y - c) + 0.5));
      data[i] = height[i];
      data[i + 1] = enamel[i];
      data[i + 2] = cov * 255;
      data[i + 3] = 255;
    }
  }
  return { res, data };
}

/** Wait for the fonts the map uses, but never longer than `ms`. */
export async function fontsReady(ms = 1500): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  const loads = Promise.all(FONT_LOADS.map((f) => document.fonts.load(f).catch(() => [])));
  await Promise.race([loads, new Promise((r) => setTimeout(r, ms))]);
}
