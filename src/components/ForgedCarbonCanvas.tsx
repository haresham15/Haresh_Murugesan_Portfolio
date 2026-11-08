import React, { useEffect, useRef } from 'react';

interface CarbonFlake {
  x: number;
  y: number;
  radius: number;
  angle: number; // fiber orientation θ
  sides: number;
  vertices: { x: number; y: number }[];
  baseColor: string;
  isCobaltTint: boolean;
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
    let targetMouse = { x: 0.5, y: 0.35 };
    let currentMouse = { x: 0.5, y: 0.35 };
    let isTicking = false;

    // Pitch-black matrix shades (Strict dark luminance clamp: #04070E, #070C17, #0A1222)
    const DARK_PALETTES = [
      '#04070E',
      '#050912',
      '#070C17',
      '#080E1C',
      '#060B15',
      '#03060C',
      '#0A1222',
    ];

    const generateFlakes = (w: number, h: number) => {
      const flakeList: CarbonFlake[] = [];
      // Approximate 180-220 flakes per large screen
      const area = w * h;
      const count = Math.min(260, Math.max(120, Math.floor(area / 9000)));

      // Deterministic pseudo-random seed generator
      let seed = 42;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };

      for (let i = 0; i < count; i++) {
        const x = rnd() * w;
        const y = rnd() * h;
        const radius = 22 + rnd() * 45; // 22px to 67px
        const angle = rnd() * Math.PI; // θ in [0, π]
        const sides = 4 + Math.floor(rnd() * 3); // 4, 5, or 6 sides
        const baseColor = DARK_PALETTES[Math.floor(rnd() * DARK_PALETTES.length)];
        const isCobaltTint = rnd() > 0.6;

        // Generate irregular polygon vertices
        const vertices: { x: number; y: number }[] = [];
        for (let s = 0; s < sides; s++) {
          const vertexAngle = (s / sides) * Math.PI * 2 + (rnd() - 0.5) * 0.45;
          const r = radius * (0.75 + rnd() * 0.5);
          vertices.push({
            x: x + Math.cos(vertexAngle) * r,
            y: y + Math.sin(vertexAngle) * r,
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
          isCobaltTint,
        });
      }

      return flakeList;
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      flakes = generateFlakes(width, height);
      render();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / Math.max(1, width);
      targetMouse.y = e.clientY / Math.max(1, height);
      if (!isTicking) {
        isTicking = true;
        animId = requestAnimationFrame(animateLoop);
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      targetMouse.y = ((scrollY * 0.15) % height) / height;
      if (!isTicking) {
        isTicking = true;
        animId = requestAnimationFrame(animateLoop);
      }
    };

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      // 1. Pitch-Black Matrix Base (#03050A)
      ctx.fillStyle = '#03050A';
      ctx.fillRect(0, 0, width, height);

      // Light source vector in pixel space
      const lightX = currentMouse.x * width;
      const lightY = currentMouse.y * height;

      // 2. Render each chopped carbon-tow facet
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        if (f.vertices.length < 3) continue;

        // Angle from flake to light source
        const dx = lightX - f.x;
        const dy = lightY - f.y;
        const lightAngle = Math.atan2(dy, dx);

        // Anisotropic glint: peaks when flake orientation aligns with light vector
        // Math.pow(Math.abs(Math.cos(θ - lightAngle)), 12)
        const dot = Math.abs(Math.cos(f.angle - lightAngle));
        const glint = Math.pow(dot, 12);

        // Draw Polygon Flake
        ctx.beginPath();
        ctx.moveTo(f.vertices[0].x, f.vertices[0].y);
        for (let v = 1; v < f.vertices.length; v++) {
          ctx.lineTo(f.vertices[v].x, f.vertices[v].y);
        }
        ctx.closePath();

        // Base Flake Fill
        ctx.fillStyle = f.baseColor;
        ctx.fill();

        // Flake Border (micro-edge relief)
        ctx.strokeStyle = 'rgba(24, 69, 139, 0.08)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Internal Parallel Micro-Striations (unidirectional carbon filaments)
        ctx.save();
        ctx.clip();

        ctx.strokeStyle = 'rgba(200, 210, 224, 0.04)';
        ctx.lineWidth = 0.5;
        const cosA = Math.cos(f.angle);
        const sinA = Math.sin(f.angle);
        const perpX = -sinA;
        const perpY = cosA;

        // Draw 4-6 parallel striation lines inside the flake
        for (let line = -f.radius; line <= f.radius; line += 8) {
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

        // Anisotropic Sheen Overlay
        if (glint > 0.04) {
          if (f.isCobaltTint) {
            ctx.fillStyle = `rgba(24, 69, 139, ${Math.min(0.24, glint * 0.28)})`;
          } else {
            ctx.fillStyle = `rgba(200, 210, 224, ${Math.min(0.12, glint * 0.16)})`;
          }
          ctx.fill();
        }

        ctx.restore();
      }

      // 3. Studio Lighting Radial Vignette
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        Math.min(width, height) * 0.1,
        width * 0.5,
        height * 0.35,
        Math.max(width, height) * 0.9
      );
      vignette.addColorStop(0, 'rgba(11, 30, 64, 0.28)');
      vignette.addColorStop(0.5, 'rgba(3, 5, 10, 0.45)');
      vignette.addColorStop(0.85, '#03050A');
      vignette.addColorStop(1, '#03050A');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const animateLoop = () => {
      // Lerp mouse
      const dx = targetMouse.x - currentMouse.x;
      const dy = targetMouse.y - currentMouse.y;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        currentMouse.x += dx * 0.08;
        currentMouse.y += dy * 0.08;
        render();
        animId = requestAnimationFrame(animateLoop);
      } else {
        isTicking = false;
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
