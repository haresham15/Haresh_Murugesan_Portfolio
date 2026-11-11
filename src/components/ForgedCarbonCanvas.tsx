import React, { useEffect, useRef } from 'react';

interface CarbonFlake {
  x: number;
  y: number;
  radius: number;
  angle: number; // fiber orientation θ ∈ [0, π]
  sides: number;
  vertices: { x: number; y: number }[];
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
    let flakes: CarbonFlake[] = [];
    let animId: number | null = null;
    let mouse = { x: 0.5, y: 0.35, rawX: 0, rawY: 0 };
    let scrollOffset = 0;
    let isTicking = false;

    // Strict Dark Clamp: Base flake fill colors MUST stay between #04070E and #080E1A (never grey!)
    const DARK_FLAKE_PALETTE = [
      '#04070E',
      '#050811',
      '#060913',
      '#060A15',
      '#070B17',
      '#070C19',
      '#080E1A',
    ];

    const generateFlakes = (w: number, h: number) => {
      const flakeList: CarbonFlake[] = [];
      // 180 overlapping, sharp-edged angular polygons (20px–70px across)
      const count = Math.max(180, Math.floor((w * h) / 7500));

      // Deterministic PRNG to avoid layout shift between renders
      let seed = 1337;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let i = 0; i < count; i++) {
        const x = rnd() * w;
        const y = rnd() * h;
        const radius = 20 + rnd() * 50; // 20px–70px across
        const angle = rnd() * Math.PI; // θ_i ∈ [0, π]
        const sides = 4 + Math.floor(rnd() * 3); // 4-to-6-sided Voronoi/tow flake
        const baseColor = DARK_FLAKE_PALETTE[Math.floor(rnd() * DARK_FLAKE_PALETTE.length)];

        // Generate sharp angular polygon vertices
        const vertices: { x: number; y: number }[] = [];
        for (let s = 0; s < sides; s++) {
          const vAngle = (s / sides) * Math.PI * 2 + (rnd() - 0.5) * 0.45;
          const r = radius * (0.75 + rnd() * 0.5);
          vertices.push({
            x: x + Math.cos(vAngle) * r,
            y: y + Math.sin(vAngle) * r,
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

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      flakes = generateFlakes(width, height);
      render();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.rawX = e.clientX;
      mouse.rawY = e.clientY;
      mouse.x = e.clientX / Math.max(1, width);
      mouse.y = e.clientY / Math.max(1, height);
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

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      // 1. BASE LAYER: Solid #03050A (Midnight Obsidian)
      ctx.fillStyle = '#03050A';
      ctx.fillRect(0, 0, width, height);

      // Scroll-derived rotation component
      const scrollAlpha = scrollOffset * 0.002;

      // 2. RENDER 180 ANGULAR FORGED CARBON-TOW FACETS
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        if (f.vertices.length < 3) continue;

        // Virtual light angle α (slowly shifting with scroll window.scrollY * 0.002 and cursor)
        const dx = (mouse.rawX || width * 0.5) - f.x;
        const dy = (mouse.rawY || height * 0.35) - f.y;
        const cursorAngle = Math.atan2(dy, dx);
        const alpha = cursorAngle + scrollAlpha;

        // Anisotropic Specular Factor: Math.pow(Math.abs(Math.cos(θ_i - α)), 14)
        const cosDiff = Math.cos(f.angle - alpha);
        const spec = Math.pow(Math.abs(cosDiff), 14);

        // Path for Polygon Flake
        ctx.beginPath();
        ctx.moveTo(f.vertices[0].x, f.vertices[0].y);
        for (let v = 1; v < f.vertices.length; v++) {
          ctx.lineTo(f.vertices[v].x, f.vertices[v].y);
        }
        ctx.closePath();

        // Base Flake Fill (Dark clamp #04070E to #080E1A)
        ctx.fillStyle = f.baseColor;
        ctx.fill();

        // Internal Parallel 1px Micro-Striations along θ_i
        ctx.save();
        ctx.clip();

        const cosA = Math.cos(f.angle);
        const sinA = Math.sin(f.angle);
        const perpX = -sinA;
        const perpY = cosA;

        ctx.strokeStyle = `rgba(200, 210, 224, ${(0.03 + spec * 0.04).toFixed(3)})`;
        ctx.lineWidth = 1;

        for (let line = -f.radius; line <= f.radius; line += 6) {
          ctx.beginPath();
          ctx.moveTo(
            f.x + perpX * line - cosA * f.radius,
            f.y + perpY * line - sinA * f.radius
          );
          ctx.lineTo(
            f.x + perpX * line + cosA * f.radius,
            f.y + perpY * line + sinA * f.radius
          );
          ctx.stroke();
        }

        // Anisotropic Cobalt & Silver Specular Sheen:
        // Dark Cobalt (rgba(21, 56, 117, spec * 0.22)) + Machined Silver (rgba(200, 210, 224, spec * 0.07))
        if (spec > 0.02) {
          const cobaltAlpha = Math.min(0.22, spec * 0.22);
          ctx.fillStyle = `rgba(21, 56, 117, ${cobaltAlpha.toFixed(3)})`;
          ctx.fill();

          const silverAlpha = Math.min(0.07, spec * 0.07);
          ctx.fillStyle = `rgba(200, 210, 224, ${silverAlpha.toFixed(3)})`;
          ctx.fill();
        }

        ctx.restore();

        // 0.5px Edge Bevel: rgba(200, 210, 224, spec * 0.12)
        const bevelAlpha = Math.max(0.02, Math.min(0.12, spec * 0.12));
        ctx.strokeStyle = `rgba(200, 210, 224, ${bevelAlpha.toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 3. AMBIENT DEPTH VIGNETTE:
      // radial-gradient(circle at 50% 30%, rgba(11, 30, 64, 0.24), rgba(3, 5, 10, 0.88) 75%)
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        Math.min(width, height) * 0.12,
        width * 0.5,
        height * 0.3,
        Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, 'rgba(11, 30, 64, 0.24)');
      vignette.addColorStop(0.5, 'rgba(3, 5, 10, 0.55)');
      vignette.addColorStop(0.75, 'rgba(3, 5, 10, 0.88)');
      vignette.addColorStop(1, '#03050A');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const animateStep = () => {
      render();
      isTicking = false;
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
      className="fixed inset-0 -z-10 pointer-events-none w-screen h-screen block"
      style={{ background: '#03050A' }}
      aria-hidden="true"
    />
  );
};

export default ForgedCarbonCanvas;
