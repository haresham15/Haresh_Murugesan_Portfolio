import React, { useEffect, useRef } from 'react';
import { useMotionPreference } from './MotionPreference';

/**
 * AntigravityParticles
 * A subtle, tactile, and responsive cursor antigravity particle canvas.
 *
 * Characteristics:
 * - Subtle, airy presence: 58px hexagonal grid spacing, keeping the canvas spacious and breathable
 * - Signature 3-Stop Glowing Orange:
 *     - Deep Vermilion (#C8321E) -> Core Slipstream Orange (#FF6B2B) -> Warm Peach-Gold (#FFB86C) -> Hot Specular Core (#FFE9AE)
 * - Near-invisible at rest (alpha ~0.03, tinted Prussian slate) so typography and cards retain maximum contrast
 * - Damped Google Antigravity fluid curl: radial deflection, tangential vortex curl, and mouse slipstream wake
 * - Dynamic velocity-aligned micro-filaments with soft incandescent thermal glow
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

  useEffect(() => {
    // Maximize phone performance: disable background particle loop on touch mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768 && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Resting background tint (Prussian Slate / Deep Obsidian #0B1424)
    const baseColor: ColorRGB = { r: 18, g: 32, b: 54 };

    // 3-Stop Glowing Orange Palette
    const colorVermilion: ColorRGB = { r: 200, g: 50, b: 30 };   // #C8321E (Thermal Halo)
    const colorOrange: ColorRGB = { r: 255, g: 107, b: 43 };     // #FF6B2B (Core Incandescent Slipstream)
    const colorAmber: ColorRGB = { r: 255, g: 184, b: 108 };     // #FFB86C (Warm Peach-Gold)
    const colorHotCenter: ColorRGB = { r: 255, g: 233, b: 174 }; // #FFE9AE (Hot Specular Core)

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      active: false,
      radius: 175, // Generous, soft interaction radius
    };

    // Breathable hexagonal staggered grid spacing
    const SPACING = 58;

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
        this.dotRadius = 0.85 + Math.random() * 0.35;
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
            const factor = Math.pow(1 - dist / mouse.radius, 1.8);
            this.proximity = factor;

            const normX = dx / dist;
            const normY = dy / dist;

            // Soft radial deflection (antigravity repulsion)
            const repelForce = factor * 1.15;
            this.vx += normX * repelForce;
            this.vy += normY * repelForce;

            // Subtle tangential vortex curl (organic Google Antigravity feel)
            const swirlForce = factor * 0.75;
            this.vx += -normY * swirlForce;
            this.vy += normX * swirlForce;

            // Fluid slipstream from cursor velocity
            this.vx += mouse.vx * factor * 0.045;
            this.vy += mouse.vy * factor * 0.045;

            // Smooth excitation accumulation
            this.excitation = Math.min(1, this.excitation + factor * 0.5);
          }
        }

        // Calibrated elastic spring return to anchor
        const springK = 0.034;
        const damping = 0.85;

        // Subtle ambient breathing drift (0.4px)
        const idleX = this.x0 + Math.sin(time * 0.0006 + this.seed) * 0.4;
        const idleY = this.y0 + Math.cos(time * 0.0007 + this.seed) * 0.4;

        const ax = (idleX - this.x) * springK;
        const ay = (idleY - this.y) * springK;

        this.vx = (this.vx + ax) * damping;
        this.vy = (this.vy + ay) * damping;

        this.x += this.vx;
        this.y += this.vy;

        // Smooth dissipation of excitation
        this.excitation *= 0.925;

        // Dynamic orientation alignment to velocity vector
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.08) {
          const targetAngle = Math.atan2(this.vy, this.vx);
          let diff = targetAngle - this.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          this.angle += diff * 0.12;
        }
      }

      applyImpulse(ix: number, iy: number, power: number) {
        const dx = this.x - ix;
        const dy = this.y - iy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 240 && dist > 0.001) {
          const factor = Math.pow(1 - dist / 240, 1.6);
          const normX = dx / dist;
          const normY = dy / dist;
          this.vx += normX * factor * power;
          this.vy += normY * factor * power;
          this.excitation = Math.min(1, this.excitation + factor * 0.7);
        }
      }

      draw(context: CanvasRenderingContext2D) {
        const activeLevel = Math.max(this.proximity, this.excitation);

        // Near-invisible when completely resting (alpha ~0.03, non-distracting)
        let alpha = 0.032 + activeLevel * 0.42;
        alpha = Math.min(0.48, alpha);

        // Color interpolation along the 3-stop self-illuminated glowing orange ramp
        let r = baseColor.r;
        let g = baseColor.g;
        let b = baseColor.b;

        if (activeLevel > 0.01) {
          if (activeLevel < 0.35) {
            // Blend from base slate to vermilion (#C8321E)
            const t = activeLevel / 0.35;
            r = Math.round(baseColor.r + (colorVermilion.r - baseColor.r) * t);
            g = Math.round(baseColor.g + (colorVermilion.g - baseColor.g) * t);
            b = Math.round(baseColor.b + (colorVermilion.b - baseColor.b) * t);
          } else if (activeLevel < 0.7) {
            // Blend from vermilion (#C8321E) to core orange (#FF6B2B)
            const t = (activeLevel - 0.35) / 0.35;
            r = Math.round(colorVermilion.r + (colorOrange.r - colorVermilion.r) * t);
            g = Math.round(colorVermilion.g + (colorOrange.g - colorVermilion.g) * t);
            b = Math.round(colorVermilion.b + (colorOrange.b - colorVermilion.b) * t);
          } else if (activeLevel < 0.9) {
            // Blend from core orange (#FF6B2B) to peach-gold (#FFB86C)
            const t = (activeLevel - 0.7) / 0.2;
            r = Math.round(colorOrange.r + (colorAmber.r - colorOrange.r) * t);
            g = Math.round(colorOrange.g + (colorAmber.g - colorOrange.g) * t);
            b = Math.round(colorOrange.b + (colorAmber.b - colorOrange.b) * t);
          } else {
            // Peak excitation: Peach-gold to hot center (#FFE9AE)
            const t = (activeLevel - 0.9) / 0.1;
            r = Math.round(colorAmber.r + (colorHotCenter.r - colorAmber.r) * t);
            g = Math.round(colorAmber.g + (colorHotCenter.g - colorAmber.g) * t);
            b = Math.round(colorAmber.b + (colorHotCenter.b - colorAmber.b) * t);
          }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        // If moving actively under cursor wake, render as a sleek velocity-aligned micro-filament
        if (speed > 0.18 && activeLevel > 0.12) {
          const filamentLen = Math.min(8.5, 2.5 + speed * 2.2);
          const halfLen = filamentLen * 0.5;

          context.save();
          context.translate(this.x, this.y);
          context.rotate(this.angle);

          // Subtle thermal filament body
          context.beginPath();
          context.moveTo(-halfLen, 0);
          context.lineTo(halfLen, 0);
          context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          context.lineWidth = 1.0 + activeLevel * 0.5;
          context.lineCap = 'round';
          context.stroke();

          // Hot specular center on highest excitation
          if (activeLevel > 0.6) {
            context.beginPath();
            context.moveTo(-halfLen * 0.4, 0);
            context.lineTo(halfLen * 0.4, 0);
            context.strokeStyle = `rgba(255, 233, 174, ${alpha * 0.7})`;
            context.lineWidth = 1.2;
            context.stroke();
          }

          context.restore();
        } else {
          // Render as a soft glowing dot
          const curRadius = this.dotRadius + activeLevel * 0.65;

          context.beginPath();
          context.arc(this.x, this.y, curRadius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          context.fill();

          // Soft thermal glow halo under active cursor influence
          if (activeLevel > 0.28) {
            context.beginPath();
            context.arc(this.x, this.y, curRadius * 2.6, 0, Math.PI * 2);
            context.fillStyle = `rgba(${colorOrange.r}, ${colorOrange.g}, ${colorOrange.b}, ${alpha * 0.22})`;
            context.fill();
          }
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

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();

      if (isReduced) {
        ctx.clearRect(0, 0, width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse / pointer movement with gentle smoothing
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

      // Tactile gentle impulse on click
      particles.forEach((p) => p.applyImpulse(currentX, currentY, 2.0));
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });

    // 60fps render loop with battery saving
    let isRunning = !isReduced;
    const render = (time: number) => {
      if (!isRunning) return;

      mouse.vx *= 0.74;
      mouse.vy *= 0.74;

      ctx.clearRect(0, 0, width, height);

      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        if (p) {
          p.update(time);
          p.draw(ctx);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    if (!isReduced) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const handleVisibilityChange = () => {
      if (document.hidden || isReduced) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isRunning = true;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchend', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReduced]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
};

export default AntigravityParticles;
