import React, { useEffect, useRef } from 'react';
import { useCanvasStage, type CanvasStageDraw } from '../hooks/useCanvasStage';
import { useMotionPreference } from './MotionPreference';

/**
 * AntigravityParticles
 * A refined, subtle ambient background particle canvas with Google Antigravity fluid curl.
 * Layered at z-0 strictly in the background beneath all modals, cards, and editorial text.
 *
 * Characteristics:
 * - Subtle ambient presence: calibrated 56px staggered grid spacing (70px on mobile)
 * - Layered at z-0 pointer-events-none strictly behind page content and modals
 * - Refined, de-sloppified palette (resting alpha ~0.06 in titanium-slate, warming up to ~0.28 amber under cursor)
 * - Gentle Google Antigravity fluid curl: radial deflection, tangential vortex curl, and soft velocity slipstream
 * - Slender, crisp micro-filaments aligned to kinetic velocity (no oversized glowing coronas)
 * - Whisper-thin, faint constellation filaments under cursor excitation
 * - Full reduced-motion compliance and background tab throttling
 */
interface AntigravityParticlesProps {
  className?: string;
}

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export const AntigravityParticles: React.FC<AntigravityParticlesProps> = ({ className = '' }) => {
  const { isReduced } = useMotionPreference();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawRef = useRef<CanvasStageDraw>(() => {});
  // The loop sleeps once the field settles and wakes on pointer input.
  const { invalidate } = useCanvasStage(canvasRef, canvasRef, (ctx, stage) => drawRef.current(ctx, stage), { animate: !isReduced });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;


    let width = 0;
    let height = 0;


    // Resting background tint (Brushed Titanium / Machined Silver #7E8B9B)
    const baseColor: ColorRGB = { r: 126, g: 139, b: 155 };

    // V4.0 Sharp Reddish-Orange (#FF2800) & Machined Silver (#C8D2E0)
    const colorRedOrange: ColorRGB = { r: 255, g: 40, b: 0 }; // Sharp Reddish-Orange
    const colorSilver: ColorRGB = { r: 200, g: 210, b: 224 }; // Machined Silver

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      active: false,
      radius: 180, // Comfortable, refined interaction radius
    };

    let SPACING = 56;
    let lastInputAt = performance.now();

    class Particle {
      x0: number;
      y0: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      dotRadius: number;
      excitation: number;
      proximity: number;
      seed: number;

      constructor(x: number, y: number) {
        this.x0 = x;
        this.y0 = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = (Math.random() - 0.5) * 0.4;
        this.dotRadius = 0.85 + Math.random() * 0.45; // 0.85px to 1.3px crisp architectural dots
        this.excitation = 0;
        this.proximity = 0;
        this.seed = Math.random() * 1000;
      }

      update(time: number) {
        this.proximity = 0;

        // Interactive cursor repulsion, vortex swirl & slipstream wake
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0.001) {
            // Smooth quadratic falloff
            const factor = Math.pow(1 - dist / mouse.radius, 1.5);
            this.proximity = factor;

            const normX = dx / dist;
            const normY = dy / dist;

            // Gentle radial deflection (antigravity repulsion)
            const repelForce = factor * 1.35;
            this.vx += normX * repelForce;
            this.vy += normY * repelForce;

            // Tangential vortex swirl (fluid Google Antigravity vortex curl)
            const swirlForce = factor * 0.85;
            this.vx += -normY * swirlForce;
            this.vy += normX * swirlForce;

            // Subtle fluid slipstream from cursor velocity
            this.vx += mouse.vx * factor * 0.04;
            this.vy += mouse.vy * factor * 0.04;

            // Excitation accumulation
            this.excitation = Math.min(1, this.excitation + factor * 0.5);
          }
        }

        // Calibrated elastic spring return to anchor
        const springK = 0.035;
        const damping = 0.88;

        // Ambient breathing drift (subtle 0.35px)
        const idleX = this.x0 + Math.sin(time * 0.0006 + this.seed) * 0.35;
        const idleY = this.y0 + Math.cos(time * 0.0007 + this.seed) * 0.35;

        const ax = (idleX - this.x) * springK;
        const ay = (idleY - this.y) * springK;

        this.vx = (this.vx + ax) * damping;
        this.vy = (this.vy + ay) * damping;

        this.x += this.vx;
        this.y += this.vy;

        // Smooth dissipation of excitation
        this.excitation *= 0.93;

        // Dynamic orientation alignment to velocity vector
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.06) {
          const targetAngle = Math.atan2(this.vy, this.vx);
          let diff = targetAngle - this.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          this.angle += diff * 0.14;
        }
      }

      applyImpulse(ix: number, iy: number, power: number) {
        const dx = this.x - ix;
        const dy = this.y - iy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260 && dist > 0.001) {
          const factor = Math.pow(1 - dist / 260, 1.4);
          const normX = dx / dist;
          const normY = dy / dist;
          this.vx += normX * factor * power * 1.5;
          this.vy += normY * factor * power * 1.5;
          this.excitation = Math.min(1, this.excitation + factor * 0.6);
        }
      }

      draw(context: CanvasRenderingContext2D) {
        const activeLevel = Math.max(this.proximity, this.excitation);

        // Quiet, subtle resting alpha (0.06), scaling up to a gentle 0.28 under cursor
        let alpha = 0.06 + activeLevel * 0.22;
        alpha = Math.min(0.28, alpha);

        // Subtle color shift along the muted warm amber palette
        let r = baseColor.r;
        let g = baseColor.g;
        let b = baseColor.b;

        if (activeLevel > 0.03) {
          if (activeLevel < 0.45) {
            const t = activeLevel / 0.45;
            r = Math.round(baseColor.r + (colorSilver.r - baseColor.r) * t);
            g = Math.round(baseColor.g + (colorSilver.g - baseColor.g) * t);
            b = Math.round(baseColor.b + (colorSilver.b - baseColor.b) * t);
          } else {
            const t = (activeLevel - 0.45) / 0.55;
            r = Math.round(colorSilver.r + (colorRedOrange.r - colorSilver.r) * t);
            g = Math.round(colorSilver.g + (colorRedOrange.g - colorSilver.g) * t);
            b = Math.round(colorSilver.b + (colorRedOrange.b - colorSilver.b) * t);
          }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        // When moving actively under cursor wake, render as a clean, slender micro-filament
        if (speed > 0.12 && activeLevel > 0.08) {
          const filamentLen = Math.min(10, 2.5 + speed * 2.2);
          const halfLen = filamentLen * 0.5;

          context.save();
          context.translate(this.x, this.y);
          context.rotate(this.angle);

          // Kinetic filament body - clean and slender, zero blurry halo
          context.beginPath();
          context.moveTo(-halfLen, 0);
          context.lineTo(halfLen, 0);
          context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
          context.lineWidth = 1.1;
          context.lineCap = 'round';
          context.stroke();

          context.restore();
        } else {
          // Render as a crisp, quiet dot (no oversized glow corona)
          const curRadius = this.dotRadius + activeLevel * 0.4;

          context.beginPath();
          context.arc(this.x, this.y, curRadius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          context.fill();
        }
      }
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const xOffset = j % 2 === 0 ? 0 : SPACING * 0.5;
          const x = i * SPACING + xOffset - SPACING * 0.5;
          const y = j * SPACING - SPACING * 0.5;
          particles.push(new Particle(x, y));
        }
      }
    };

    // Track pointer movement with smooth velocity
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let currentX = 0;
      let currentY = 0;

      if ('clientX' in e) {
        currentX = e.clientX;
        currentY = e.clientY;
      } else if (e.touches && e.touches.length > 0 && e.touches[0]) {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        return;
      }

      lastInputAt = performance.now();
      invalidate();

      if (!mouse.active) {
        mouse.x = currentX;
        mouse.y = currentY;
        mouse.prevX = currentX;
        mouse.prevY = currentY;
        mouse.active = true;
      } else {
        mouse.vx = currentX - mouse.prevX;
        mouse.vy = currentY - mouse.prevY;
        mouse.prevX = currentX;
        mouse.prevY = currentY;
        mouse.x = currentX;
        mouse.y = currentY;
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let currentX = 0;
      let currentY = 0;

      if ('clientX' in e) {
        currentX = e.clientX;
        currentY = e.clientY;
      } else if (e.touches && e.touches.length > 0 && e.touches[0]) {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      }

      // Gentle, subtle shockwave impulse on click or tap
      particles.forEach((p) => p.applyImpulse(currentX, currentY, 1.4));
      lastInputAt = performance.now();
      invalidate();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
      lastInputAt = performance.now();
      invalidate();
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });

    drawRef.current = (ctx, stage) => {
      if (width !== stage.width || height !== stage.height) {
        width = stage.width;
        height = stage.height;
        SPACING = width < 768 ? 70 : 56;
        mouse.radius = width < 768 ? 140 : 180;
        initParticles();
      }
      const time = stage.time;
      if (isReduced) { ctx.clearRect(0, 0, width, height); return; }
      mouse.vx *= 0.76;
      mouse.vy *= 0.76;

      ctx.clearRect(0, 0, width, height);

      const len = particles.length;
      const activeParticles: Particle[] = [];
      let maxSpeed = 0;
      let maxExcitationDelta = 0;

      for (let i = 0; i < len; i++) {
        const p = particles[i];
        if (p) {
          const prevExcitation = p.excitation;
          p.update(time);
          maxSpeed = Math.max(maxSpeed, Math.abs(p.vx) + Math.abs(p.vy));
          maxExcitationDelta = Math.max(maxExcitationDelta, Math.abs(p.excitation - prevExcitation));
          if (p.proximity > 0.2 || p.excitation > 0.25) {
            activeParticles.push(p);
          }
          p.draw(ctx);
        }
      }

      // Draw very delicate, whisper-thin constellation linkages between active cluster particles
      const activeCount = activeParticles.length;
      if (activeCount > 1 && activeCount < 35) {
        ctx.lineWidth = 0.5;
        const maxDist = SPACING * 1.4;
        for (let i = 0; i < activeCount; i++) {
          const p1 = activeParticles[i];
          if (!p1) continue;
          for (let j = i + 1; j < activeCount; j++) {
            const p2 = activeParticles[j];
            if (!p2) continue;
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const linkFactor = (1 - dist / maxDist) * Math.min(p1.proximity, p2.proximity);
              if (linkFactor > 0.05) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 40, 0, ${(linkFactor * 0.16).toFixed(3)})`;
                ctx.stroke();
              }
            }
          }
        }
      }

      // Sleep once the field has settled: no input for a beat, no motion, no fading colour.
      const settled = performance.now() - lastInputAt > 1200 && maxSpeed < 0.02 && maxExcitationDelta < 0.002;
      return !settled;
    };

    return () => {
      drawRef.current = () => {};
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handleMouseLeave);
    };
  }, [isReduced, invalidate]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
};

export default AntigravityParticles;
