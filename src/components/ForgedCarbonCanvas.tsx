import React, { useEffect, useRef } from 'react';
import { useMotionPreference } from './MotionPreference';

/**
 * Forged carbon backdrop.
 *
 * Two cached layers, one compositor:
 *  - base tile (once per DPR): ~180 chopped-tow facets, clamped obsidian fills,
 *    clipped 0.75px filament striations along each facet's fiber angle θi.
 *  - sheen pass (only when the light angle α moves): facets whose anisotropic
 *    specular term |cos(θi − α)|^16 clears 0.35 get a cobalt roll, a silver
 *    roll and a 0.5px bevel. Everything else is a blit of the cached tile.
 * α = scrollY·0.0018 + cursor term, driven through a critically damped spring,
 * and the rAF loop sleeps as soon as the spring settles.
 */

const TILE = 600; // CSS px
const FACET_COUNT = 180;
const BASE_FILLS = ['#03050A', '#050811', '#080E1B'];
const SPEC_THRESHOLD = 0.35;
const RECOMPOSITE_EPSILON = 0.0025; // rad
const SPRING_OMEGA = 5.5; // rad/s, critically damped

interface Facet {
  x: number;
  y: number;
  theta: number;
  extent: number; // bounding radius for wrap tests
  pts: Float32Array; // vertex offsets, xy pairs
  halfWidth: number; // half extent across the fiber
  fill: string;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Chopped tow: an elongated, sharply cut flake whose long axis is the fiber direction. */
function generateFacets(): Facet[] {
  const rnd = mulberry32(0x5eed42);
  const facets: Facet[] = [];
  for (let i = 0; i < FACET_COUNT; i++) {
    const length = 20 + rnd() * 48; // 20–68px along the fiber
    const width = length * (0.32 + rnd() * 0.38);
    const theta = rnd() * Math.PI;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const sides = 4 + Math.floor(rnd() * 3);
    const pts = new Float32Array(sides * 2);
    let extent = 0;
    let halfWidth = 0;
    for (let s = 0; s < sides; s++) {
      // Angular cut: jittered vertices on an ellipse in fiber space, then rotated to θ.
      const a = (s / sides) * Math.PI * 2 + (rnd() - 0.5) * (Math.PI / sides) * 0.9;
      const u = Math.cos(a) * length * 0.5 * (0.82 + rnd() * 0.3);
      const v = Math.sin(a) * width * 0.5 * (0.75 + rnd() * 0.4);
      pts[s * 2] = u * cos - v * sin;
      pts[s * 2 + 1] = u * sin + v * cos;
      extent = Math.max(extent, Math.hypot(u, v));
      halfWidth = Math.max(halfWidth, Math.abs(v));
    }
    facets.push({
      x: rnd() * TILE,
      y: rnd() * TILE,
      theta,
      extent,
      pts,
      halfWidth,
      fill: BASE_FILLS[Math.floor(rnd() * BASE_FILLS.length)],
    });
  }
  return facets;
}

/** Offsets at which a facet must be repeated so the tile wraps seamlessly. */
function wrapOffsets(f: Facet): [number, number][] {
  const xs = [0];
  const ys = [0];
  if (f.x - f.extent < 0) xs.push(TILE);
  if (f.x + f.extent > TILE) xs.push(-TILE);
  if (f.y - f.extent < 0) ys.push(TILE);
  if (f.y + f.extent > TILE) ys.push(-TILE);
  const out: [number, number][] = [];
  for (const ox of xs) for (const oy of ys) out.push([ox, oy]);
  return out;
}

function tracePath(ctx: CanvasRenderingContext2D, f: Facet, cx: number, cy: number) {
  ctx.beginPath();
  ctx.moveTo(cx + f.pts[0], cy + f.pts[1]);
  for (let k = 2; k < f.pts.length; k += 2) ctx.lineTo(cx + f.pts[k], cy + f.pts[k + 1]);
  ctx.closePath();
}

function renderBaseTile(ctx: CanvasRenderingContext2D, facets: Facet[], dpr: number) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#03050A';
  ctx.fillRect(0, 0, TILE, TILE);
  ctx.lineWidth = 0.75;
  ctx.strokeStyle = 'rgba(200, 210, 224, 0.022)';
  for (const f of facets) {
    const cos = Math.cos(f.theta);
    const sin = Math.sin(f.theta);
    const r = f.extent;
    for (const [ox, oy] of wrapOffsets(f)) {
      const cx = f.x + ox;
      const cy = f.y + oy;
      tracePath(ctx, f, cx, cy);
      ctx.fillStyle = f.fill;
      ctx.fill();
      ctx.save();
      ctx.clip();
      // Parallel filaments along θ, stacked across the tow width.
      ctx.beginPath();
      for (let d = -r; d <= r; d += 2.25) {
        const px = cx - sin * d;
        const py = cy + cos * d;
        ctx.moveTo(px - cos * r, py - sin * r);
        ctx.lineTo(px + cos * r, py + sin * r);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
}

function renderSheen(
  ctx: CanvasRenderingContext2D,
  base: HTMLCanvasElement,
  facets: Facet[],
  dpr: number,
  alpha: number,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(base, 0, 0);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineWidth = 0.5;
  for (const f of facets) {
    const spec = Math.pow(Math.abs(Math.cos(f.theta - alpha)), 16);
    if (spec <= SPEC_THRESHOLD) continue;
    // Anisotropic roll: the highlight band slides across the tow as α sweeps past θ.
    const nx = -Math.sin(f.theta);
    const ny = Math.cos(f.theta);
    const shift = Math.sin(f.theta - alpha) * 2.2; // about ±0.77 inside the lit window
    const w = f.halfWidth;
    const cobalt = spec * 0.22;
    const silver = spec * 0.075;
    for (const [ox, oy] of wrapOffsets(f)) {
      const cx = f.x + ox;
      const cy = f.y + oy;
      const g = ctx.createLinearGradient(cx - nx * w, cy - ny * w, cx + nx * w, cy + ny * w);
      const mid = Math.min(0.85, Math.max(0.15, 0.5 + shift * 0.5));
      g.addColorStop(0, `rgba(21, 56, 117, ${(cobalt * 0.35).toFixed(4)})`);
      g.addColorStop(mid, `rgba(21, 56, 117, ${cobalt.toFixed(4)})`);
      g.addColorStop(1, `rgba(21, 56, 117, ${(cobalt * 0.35).toFixed(4)})`);
      tracePath(ctx, f, cx, cy);
      ctx.fillStyle = g;
      ctx.fill();
      const s = ctx.createLinearGradient(cx - nx * w, cy - ny * w, cx + nx * w, cy + ny * w);
      s.addColorStop(Math.max(0, mid - 0.22), 'rgba(230, 236, 245, 0)');
      s.addColorStop(mid, `rgba(230, 236, 245, ${silver.toFixed(4)})`);
      s.addColorStop(Math.min(1, mid + 0.22), 'rgba(230, 236, 245, 0)');
      ctx.fillStyle = s;
      ctx.fill();
      ctx.strokeStyle = `rgba(200, 210, 224, ${(spec * 0.14).toFixed(4)})`;
      ctx.stroke();
    }
  }
}

export const ForgedCarbonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isReduced } = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const facets = generateFacets();
    const base = document.createElement('canvas');
    const lit = document.createElement('canvas');
    const baseCtx = base.getContext('2d', { alpha: false });
    const litCtx = lit.getContext('2d', { alpha: false });
    if (!baseCtx || !litCtx) return;

    let dpr = 0;
    let pattern: CanvasPattern | null = null;
    let pixelW = 0;
    let pixelH = 0;
    let raf = 0;
    let lastPrev = 0;
    let composedAlpha = Number.NaN;

    // Light state: α is a damped spring chasing (scroll term + cursor term).
    let cursorTarget = 0;
    let alpha = window.scrollY * 0.0018;
    let velocity = 0;

    const targetAlpha = () => window.scrollY * 0.0018 + cursorTarget;

    const ensureTile = () => {
      const next = Math.min(window.devicePixelRatio || 1, 2);
      if (next === dpr) return;
      dpr = next;
      const px = Math.round(TILE * dpr);
      base.width = base.height = px;
      lit.width = lit.height = px;
      renderBaseTile(baseCtx, facets, dpr);
      composedAlpha = Number.NaN;
    };

    const composite = () => {
      if (!pixelW || !pixelH) return;
      if (!(Math.abs(alpha - composedAlpha) < RECOMPOSITE_EPSILON)) {
        renderSheen(litCtx, base, facets, dpr, alpha);
        pattern = ctx.createPattern(lit, 'repeat');
        composedAlpha = alpha;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = pattern ?? '#03050A';
      ctx.fillRect(0, 0, pixelW, pixelH);
    };

    const step = (now: number) => {
      raf = 0;
      const dt = lastPrev ? Math.min((now - lastPrev) / 1000, 0.05) : 1 / 60;
      lastPrev = now;
      const target = targetAlpha();
      if (isReduced) {
        alpha = target;
        velocity = 0;
      } else {
        // Critically damped spring (semi-implicit Euler).
        const k = SPRING_OMEGA * SPRING_OMEGA;
        const c = 2 * SPRING_OMEGA;
        velocity += (k * (target - alpha) - c * velocity) * dt;
        alpha += velocity * dt;
      }
      composite();
      const settled = Math.abs(target - alpha) < 0.0008 && Math.abs(velocity) < 0.002;
      if (!settled && !document.hidden) raf = requestAnimationFrame(step);
      else lastPrev = 0;
    };

    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(step);
    };

    const resize = () => {
      ensureTile();
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (w !== pixelW || h !== pixelH) {
        pixelW = canvas.width = w;
        pixelH = canvas.height = h;
      }
      composite();
    };

    const onPointer = (e: PointerEvent) => {
      if (isReduced || e.pointerType === 'touch') return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Cursor sweeps ±0.55 rad horizontally, ±0.2 rad vertically.
      cursorTarget = (e.clientX / w - 0.5) * 1.1 + (e.clientY / h - 0.5) * 0.4;
      wake();
    };

    const onVisibility = () => { if (!document.hidden) wake(); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    const dprQuery = window.matchMedia(`(resolution: ${dpr}dppx)`);
    dprQuery.addEventListener?.('change', resize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', wake);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      dprQuery.removeEventListener?.('change', resize);
    };
  }, [isReduced]);

  return (
    <div
      data-forged-carbon=""
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: '#03050A' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 32%, rgba(11, 30, 64, 0.26), rgba(3, 5, 10, 0.90) 78%)',
        }}
      />
    </div>
  );
};

export default ForgedCarbonCanvas;
