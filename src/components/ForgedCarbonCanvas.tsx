import React, { useEffect, useRef } from 'react';

interface CarbonFlake {
  x: number;
  y: number;
  radius: number;
  angle: number; // fiber orientation θ ∈ [0, π]
  sides: number;
  vertices: { x: number; y: number }[]; // offsets relative to center
  baseColor: string;
}

export const ForgedCarbonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId: number | null = null;
    let mouse = { rawX: undefined as number | undefined, rawY: undefined as number | undefined };
    let scrollOffset = 0;
    let isTicking = false;

    // Contract: 512px repeating procedural tile, 160 facets
    const TILE_SIZE = 512;
    const FACET_COUNT = 160;

    // Contract: Base facet colors strictly clamped between #04070D, #060B14, and #080F1C
    const DARK_FLAKE_PALETTE = [
      '#04070D',
      '#050910',
      '#060B14',
      '#070D18',
      '#080F1C',
    ];

    // Offscreen canvas for the 512x512 repeating procedural tile
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = TILE_SIZE;
    tileCanvas.height = TILE_SIZE;
    const tileCtx = tileCanvas.getContext('2d', { alpha: false });

    // Generate 160 angular 4-6-vertex facets (22px-64px wide) deterministically
    const generateTileFlakes = (): CarbonFlake[] => {
      const flakeList: CarbonFlake[] = [];
      let seed = 421337;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let i = 0; i < FACET_COUNT; i++) {
        const x = rnd() * TILE_SIZE;
        const y = rnd() * TILE_SIZE;
        // 22px-64px wide (radius = 11px-32px)
        const radius = 11 + rnd() * 21;
        const angle = rnd() * Math.PI; // theta in [0, pi]
        const sides = 4 + Math.floor(rnd() * 3); // 4, 5, or 6 vertices
        const baseColor = DARK_FLAKE_PALETTE[Math.floor(rnd() * DARK_FLAKE_PALETTE.length)];

        // Generate sharp angular polygon vertices (offsets relative to 0,0)
        const vertices: { x: number; y: number }[] = [];
        for (let s = 0; s < sides; s++) {
          const vAngle = (s / sides) * Math.PI * 2 + (rnd() - 0.5) * 0.45;
          const r = radius * (0.8 + rnd() * 0.4);
          vertices.push({
            x: Math.cos(vAngle) * r,
            y: Math.sin(vAngle) * r,
          });
        }

        flakeList.push({
          x,
          y,
          radius,
          angle,
          sides,
          vertices,
          baseColor,
        });
      }

      return flakeList;
    };

    const flakes = generateTileFlakes();

    const renderTile = (lightAngle: number) => {
      if (!tileCtx) return;

      // 1. Base Layer: Solid #03050A (Midnight Obsidian)
      tileCtx.fillStyle = '#03050A';
      tileCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

      // 2. Render 160 Angular Facets with Periodic Boundary Condition (Toroidal Wrapping)
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        if (f.vertices.length < 3) continue;

        // Contract: Directional glints using Math.pow(Math.abs(Math.cos(theta - lightAngle)), 16)
        const theta = f.angle;
        const glint = Math.pow(Math.abs(Math.cos(theta - lightAngle)), 16);

        // Periodic wrapping offsets to eliminate seams across the 512px tile boundaries
        const r = f.radius;
        const wrapX = [0];
        if (f.x - r < 0) wrapX.push(TILE_SIZE);
        if (f.x + r > TILE_SIZE) wrapX.push(-TILE_SIZE);

        const wrapY = [0];
        if (f.y - r < 0) wrapY.push(TILE_SIZE);
        if (f.y + r > TILE_SIZE) wrapY.push(-TILE_SIZE);

        for (const ox of wrapX) {
          for (const oy of wrapY) {
            const cx = f.x + ox;
            const cy = f.y + oy;

            // Path for polygon facet
            tileCtx.beginPath();
            tileCtx.moveTo(cx + f.vertices[0].x, cy + f.vertices[0].y);
            for (let v = 1; v < f.vertices.length; v++) {
              tileCtx.lineTo(cx + f.vertices[v].x, cy + f.vertices[v].y);
            }
            tileCtx.closePath();

            // Base facet fill (strictly clamped between #04070D, #060B14, and #080F1C)
            tileCtx.fillStyle = f.baseColor;
            tileCtx.fill();

            // Striations and highlights inside the polygon
            tileCtx.save();
            tileCtx.clip();

            const cosA = Math.cos(theta);
            const sinA = Math.sin(theta);
            const perpX = -sinA;
            const perpY = cosA;

            // 1px micro-striations along fiber angle theta
            tileCtx.strokeStyle = 'rgba(200, 210, 224, ' + (0.02 + glint * 0.04).toFixed(3) + ')';
            tileCtx.lineWidth = 1;

            for (let line = -r; line <= r; line += 5) {
              tileCtx.beginPath();
              tileCtx.moveTo(
                cx + perpX * line - cosA * r,
                cy + perpY * line - sinA * r
              );
              tileCtx.lineTo(
                cx + perpX * line + cosA * r,
                cy + perpY * line + sinA * r
              );
              tileCtx.stroke();
            }

            // Restrained cobalt and silver highlights
            if (glint > 0.015) {
              // Deep cobalt sheen
              const cobaltAlpha = Math.min(0.20, glint * 0.20);
              tileCtx.fillStyle = 'rgba(21, 56, 117, ' + cobaltAlpha.toFixed(3) + ')';
              tileCtx.fill();

              // Bright cobalt highlight
              const electricAlpha = Math.min(0.12, glint * 0.12);
              tileCtx.fillStyle = 'rgba(37, 99, 235, ' + electricAlpha.toFixed(3) + ')';
              tileCtx.fill();

              // Machined silver highlight
              const silverAlpha = Math.min(0.08, glint * 0.08);
              tileCtx.fillStyle = 'rgba(200, 210, 224, ' + silverAlpha.toFixed(3) + ')';
              tileCtx.fill();
            }

            tileCtx.restore();

            // 0.5px edge bevel
            const bevelAlpha = Math.max(0.02, Math.min(0.10, glint * 0.10));
            tileCtx.strokeStyle = 'rgba(200, 210, 224, ' + bevelAlpha.toFixed(3) + ')';
            tileCtx.lineWidth = 0.5;
            tileCtx.stroke();
          }
        }
      }
    };

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      // Directional light angle derived from cursor and scroll
      const mx = mouse.rawX !== undefined ? mouse.rawX : width * 0.65;
      const my = mouse.rawY !== undefined ? mouse.rawY : height * 0.35;
      const lightAngle = Math.atan2(my - height * 0.5, mx - width * 0.5) + scrollOffset * 0.002;

      // 1. Render the 512px repeating procedural tile
      renderTile(lightAngle);

      // 2. Tile the 512px procedural pattern across the viewport
      const pattern = ctx.createPattern(tileCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#03050A';
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Ambient depth vignette
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        Math.min(width, height) * 0.15,
        width * 0.5,
        height * 0.35,
        Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, 'rgba(11, 30, 64, 0.22)');
      vignette.addColorStop(0.5, 'rgba(3, 5, 10, 0.52)');
      vignette.addColorStop(0.8, 'rgba(3, 5, 10, 0.85)');
      vignette.addColorStop(1, '#03050A');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const animateStep = () => {
      render();
      isTicking = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      render();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.rawX = e.clientX;
      mouse.rawY = e.clientY;
      if (!isTicking) {
        isTicking = true;
        animId = requestAnimationFrame(animateStep);
      }
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY;
      if (!isTicking) {
        isTicking = true;
        animId = requestAnimationFrame(animateStep);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none w-full h-full block"
      style={{ background: '#03050A' }}
      aria-hidden="true"
    />
  );
};

export default ForgedCarbonCanvas;
