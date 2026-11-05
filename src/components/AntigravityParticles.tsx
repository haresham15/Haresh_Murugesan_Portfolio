import React, { useEffect, useRef } from 'react';
import { useMotionPreference } from './MotionPreference';

/**
 * AntigravityParticles
 * A gentle, refined ambient background particle canvas.
 * Layered at z-0 strictly behind content, with quiet resting opacity
 * and soft, localized cursor deflection.
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Soft Prussian Slate resting tint
    const baseColor: ColorRGB = { r: 130, g: 155, b: 195 };

    // Toned-down subtle warm amber/orange accent
    const colorOrange: ColorRGB = { r: 255, g: 107, b: 53 };
    const colorAmber: ColorRGB = { r: 245, g: 217, b: 152 };

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      active: false,
      radius: 140, // Localized, restrained field
    };

    // Spacious airy grid spacing (72px desktop, 88px mobile)
    let SPACING = 72;

    class Particle {
      x0: number;
      y0: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
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
        this.dotRadius = 0.8 + Math.random() * 0.5; // Fine 0.8px to 1.3px
        this.excitation = 0;
        this.proximity = 0;
        this.seed = Math.random() * 1000;
      }

      update(time: number) {
        this.proximity = 0;

        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0.001) {
            const factor = Math.pow(1 - dist / mouse.radius, 1.6);
            this.proximity = factor;

            const normX = dx / dist;
            const normY = dy / dist;

            // Restrained gentle radial deflection
            const repelForce = factor * 0.75;
            this.vx += normX * repelForce;
            this.vy += normY * repelForce;

            // Gentle tangential drift
            const swirlForce = factor * 0.35;
            this.vx += -normY * swirlForce;
            this.vy += normX * swirlForce;

            this.excitation = Math.min(1, this.excitation + factor * 0.4);
          }
        }

        // Calibrated gentle spring return
        const springK = 0.032;
        const damping = 0.88;

        const idleX = this.x0 + Math.sin(time * 0.0006 + this.seed) * 0.4;
        const idleY = this.y0 + Math.cos(time * 0.0007 + this.seed) * 0.4;

        const ax = (idleX - this.x) * springK;
        const ay = (idleY - this.y) * springK;

        this.vx = (this.vx + ax) * damping;
        this.vy = (this.vy + ay) * damping;

        this.x += this.vx;
        this.y += this.vy;

        this.excitation *= 0.92;
      }

      draw(context: CanvasRenderingContext2D) {
        const activeLevel = Math.max(this.proximity, this.excitation);

        // Very quiet resting opacity (0.04), warming up to 0.28 under mouse
        let alpha = 0.04 + activeLevel * 0.24;
        alpha = Math.min(0.28, alpha);

        // Soft subtle color shift
        let r = baseColor.r;
        let g = baseColor.g;
        let b = baseColor.b;

        if (activeLevel > 0.05) {
          const t = Math.min(1, activeLevel * 1.5);
          r = Math.round(baseColor.r + (colorOrange.r - baseColor.r) * t);
          g = Math.round(baseColor.g + (colorOrange.g - baseColor.g) * t);
          b = Math.round(baseColor.b + (colorOrange.b - baseColor.b) * t);
        }

        const curRadius = this.dotRadius + activeLevel * 0.4;

        // Subtle soft corona only on direct proximity
        if (activeLevel > 0.3) {
          context.beginPath();
          context.arc(this.x, this.y, curRadius * 2.2, 0, Math.PI * 2);
          context.fillStyle = `rgba(${colorAmber.r}, ${colorAmber.g}, ${colorAmber.b}, ${alpha * 0.35})`;
          context.fill();
        }

        // Clean micro dot
        context.beginPath();
        context.arc(this.x, this.y, curRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        context.fill();
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

      SPACING = width < 768 ? 88 : 72;

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
        mouse.vx = (currentX - mouse.prevX) * 0.5;
        mouse.vy = (currentY - mouse.prevY) * 0.5;
        mouse.prevX = currentX;
        mouse.prevY = currentY;
        mouse.x = currentX;
        mouse.y = currentY;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });

    let isRunning = !isReduced;
    const render = (time: number) => {
      if (!isRunning) return;

      mouse.vx *= 0.8;
      mouse.vy *= 0.8;

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
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handlePointerMove);
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
