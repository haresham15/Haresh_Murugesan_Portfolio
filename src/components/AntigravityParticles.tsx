import React, { useEffect, useRef } from 'react';
import { useMotionPreference } from './MotionPreference';

/**
 * AntigravityParticles
 * A tactile, prominent, and highly responsive cursor antigravity particle canvas.
 *
 * Characteristics:
 * - Prominent, crystalline presence: calibrated 44px staggered grid spacing (56px on mobile)
 * - Layered at z-20 pointer-events-none so particles float over the deep canvas with zero click obstruction
 * - Signature 3-Stop Glowing Orange & Amber Palette:
 *     - Deep Vermilion (#D73C23) -> Core Slipstream Orange (#FF6B2B) -> Warm Peach-Gold (#FFB86C) -> Hot Specular Core (#FFEEBE)
 * - Refined resting state (alpha ~0.15, soft titanium-slate) so particles are clearly perceptible at all times
 * - Dynamic Google Antigravity fluid curl: radial deflection, tangential vortex curl, and mouse slipstream wake
 * - Dynamic velocity-aligned micro-filaments with soft incandescent thermal glow
 * - Inter-particle glowing constellation linkages under cursor excitation
 * - Click & touch shockwave impulse propagation
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Resting background tint (Soft Titanium / Prussian Slate)
    const baseColor: ColorRGB = { r: 160, g: 180, b: 215 };

    // 3-Stop Glowing Orange Palette
    const colorVermilion: ColorRGB = { r: 215, g: 60, b: 35 };   // #D73C23 (Thermal Halo)
    const colorOrange: ColorRGB = { r: 255, g: 107, b: 43 };     // #FF6B2B (Core Incandescent Slipstream)
    const colorAmber: ColorRGB = { r: 255, g: 184, b: 108 };     // #FFB86C (Warm Peach-Gold)
    const colorHotCenter: ColorRGB = { r: 255, g: 238, b: 190 }; // #FFEEBE (Hot Specular Core)

    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      active: false,
      radius: 230, // Generous, prominent gravitational field
    };

    // Responsive grid spacing (44px on desktop, 56px on mobile for performance)
    let SPACING = 44;

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
        this.dotRadius = 1.15 + Math.random() * 0.7; // 1.15px to 1.85px
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
            const factor = Math.pow(1 - dist / mouse.radius, 1.45);
            this.proximity = factor;

            const normX = dx / dist;
            const normY = dy / dist;

            // Prominent radial deflection (antigravity repulsion)
            const repelForce = factor * 2.3;
            this.vx += normX * repelForce;
            this.vy += normY * repelForce;

            // Tangential vortex swirl (fluid Google Antigravity vortex curl)
            const swirlForce = factor * 1.45;
            this.vx += -normY * swirlForce;
            this.vy += normX * swirlForce;

            // Fluid slipstream from cursor velocity
            this.vx += mouse.vx * factor * 0.09;
            this.vy += mouse.vy * factor * 0.09;

            // Excitation accumulation
            this.excitation = Math.min(1, this.excitation + factor * 0.7);
          }
        }

        // Calibrated elastic spring return to anchor
        const springK = 0.038;
        const damping = 0.86;

        // Ambient breathing drift (0.6px)
        const idleX = this.x0 + Math.sin(time * 0.0008 + this.seed) * 0.6;
        const idleY = this.y0 + Math.cos(time * 0.0009 + this.seed) * 0.6;

        const ax = (idleX - this.x) * springK;
        const ay = (idleY - this.y) * springK;

        this.vx = (this.vx + ax) * damping;
        this.vy = (this.vy + ay) * damping;

        this.x += this.vx;
        this.y += this.vy;

        // Smooth dissipation of excitation
        this.excitation *= 0.94;

        // Dynamic orientation alignment to velocity vector
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.06) {
          const targetAngle = Math.atan2(this.vy, this.vx);
          let diff = targetAngle - this.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          this.angle += diff * 0.16;
        }
      }

      applyImpulse(ix: number, iy: number, power: number) {
        const dx = this.x - ix;
        const dy = this.y - iy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 340 && dist > 0.001) {
          const factor = Math.pow(1 - dist / 340, 1.4);
          const normX = dx / dist;
          const normY = dy / dist;
          this.vx += normX * factor * power * 2.4;
          this.vy += normY * factor * power * 2.4;
          this.excitation = Math.min(1, this.excitation + factor * 0.95);
        }
      }

      draw(context: CanvasRenderingContext2D) {
        const activeLevel = Math.max(this.proximity, this.excitation);

        // Resting alpha ~0.15 so particles are clearly perceptible across dark canvas,
        // scaling up to 0.95 under active cursor interaction
        let alpha = 0.15 + activeLevel * 0.8;
        alpha = Math.min(0.95, alpha);

        // Color interpolation along the 3-stop self-illuminated glowing orange ramp
        let r = baseColor.r;
        let g = baseColor.g;
        let b = baseColor.b;

        if (activeLevel > 0.02) {
          if (activeLevel < 0.28) {
            // Blend from base slate to vermilion (#D73C23)
            const t = activeLevel / 0.28;
            r = Math.round(baseColor.r + (colorVermilion.r - baseColor.r) * t);
            g = Math.round(baseColor.g + (colorVermilion.g - baseColor.g) * t);
            b = Math.round(baseColor.b + (colorVermilion.b - baseColor.b) * t);
          } else if (activeLevel < 0.62) {
            // Blend from vermilion (#D73C23) to core orange (#FF6B2B)
            const t = (activeLevel - 0.28) / 0.34;
            r = Math.round(colorVermilion.r + (colorOrange.r - colorVermilion.r) * t);
            g = Math.round(colorVermilion.g + (colorOrange.g - colorVermilion.g) * t);
            b = Math.round(colorVermilion.b + (colorOrange.b - colorVermilion.b) * t);
          } else if (activeLevel < 0.86) {
            // Blend from core orange (#FF6B2B) to peach-gold (#FFB86C)
            const t = (activeLevel - 0.62) / 0.24;
            r = Math.round(colorOrange.r + (colorAmber.r - colorOrange.r) * t);
            g = Math.round(colorOrange.g + (colorAmber.g - colorOrange.g) * t);
            b = Math.round(colorOrange.b + (colorAmber.b - colorOrange.b) * t);
          } else {
            // Peak excitation: Peach-gold to hot center (#FFEEBE)
            const t = (activeLevel - 0.86) / 0.14;
            r = Math.round(colorAmber.r + (colorHotCenter.r - colorAmber.r) * t);
            g = Math.round(colorAmber.g + (colorHotCenter.g - colorAmber.g) * t);
            b = Math.round(colorAmber.b + (colorHotCenter.b - colorAmber.b) * t);
          }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        // If moving actively under cursor wake, render as a sleek velocity-aligned micro-filament
        if (speed > 0.11 && activeLevel > 0.07) {
          const filamentLen = Math.min(15, 3.2 + speed * 3.2);
          const halfLen = filamentLen * 0.5;

          context.save();
          context.translate(this.x, this.y);
          context.rotate(this.angle);

          // Thermal halo around filament
          context.beginPath();
          context.moveTo(-halfLen * 1.25, 0);
          context.lineTo(halfLen * 1.25, 0);
          context.strokeStyle = `rgba(${colorOrange.r}, ${colorOrange.g}, ${colorOrange.b}, ${alpha * 0.38})`;
          context.lineWidth = 3.4;
          context.lineCap = 'round';
          context.stroke();

          // Main kinetic filament body
          context.beginPath();
          context.moveTo(-halfLen, 0);
          context.lineTo(halfLen, 0);
          context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          context.lineWidth = 1.6 + activeLevel * 0.9;
          context.lineCap = 'round';
          context.stroke();

          // Hot specular center core on high excitation
          if (activeLevel > 0.45) {
            context.beginPath();
            context.moveTo(-halfLen * 0.45, 0);
            context.lineTo(halfLen * 0.45, 0);
            context.strokeStyle = `rgba(255, 238, 190, ${alpha * 0.92})`;
            context.lineWidth = 1.4;
            context.stroke();
          }

          context.restore();
        } else {
          // Render as a crisp glowing dot with soft outer corona
          const curRadius = this.dotRadius + activeLevel * 1.15;

          // Outer luminous glow corona
          if (activeLevel > 0.14) {
            context.beginPath();
            context.arc(this.x, this.y, curRadius * 3.4, 0, Math.PI * 2);
            context.fillStyle = `rgba(${colorOrange.r}, ${colorOrange.g}, ${colorOrange.b}, ${alpha * 0.3})`;
            context.fill();
          }

          // Core dot
          context.beginPath();
          context.arc(this.x, this.y, curRadius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          context.fill();

          // Specular white-hot center pip for high excitation
          if (activeLevel > 0.55) {
            context.beginPath();
            context.arc(this.x, this.y, curRadius * 0.45, 0, Math.PI * 2);
            context.fillStyle = `rgba(255, 250, 235, ${alpha * 0.96})`;
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

      // Adjust spacing: 56px on mobile screens, 44px on desktop
      SPACING = width < 768 ? 56 : 44;

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

      // Tactile gentle shockwave impulse on click or tap
      particles.forEach((p) => p.applyImpulse(currentX, currentY, 3.4));
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
      const activeParticles: Particle[] = [];

      for (let i = 0; i < len; i++) {
        const p = particles[i];
        if (p) {
          p.update(time);
          if (p.proximity > 0.16 || p.excitation > 0.2) {
            activeParticles.push(p);
          }
          p.draw(ctx);
        }
      }

      // Draw subtle luminous constellation filaments between active cluster particles
      const activeCount = activeParticles.length;
      if (activeCount > 1 && activeCount < 45) {
        ctx.lineWidth = 0.8;
        const maxDist = SPACING * 1.55;
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
              if (linkFactor > 0.03) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 107, 43, ${linkFactor * 0.45})`;
                ctx.stroke();
              }
            }
          }
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
      className={`fixed inset-0 pointer-events-none z-20 ${className}`}
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
};

export default AntigravityParticles;
