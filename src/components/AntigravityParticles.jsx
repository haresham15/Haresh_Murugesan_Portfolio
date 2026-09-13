import React, { useEffect, useRef } from 'react';

/**
 * AntigravityParticles
 * A refined, ultra-subtle, and clean interactive particle system
 * inspired by Google Antigravity.
 *
 * Characteristics:
 * - Minimal, quiet presence at rest (alpha ~0.04) that never distracts from typography or content
 * - Intimate influence radius (110px) with gentle fluid deflection and soft curl
 * - Cohesive, restrained palette (slate-white, subtle cine-teal, and soft lavender)
 * - Calibrated decay returning particles smoothly to rest without jitter or harsh flashes
 * - Completely eliminated intrusive glitter/sparkles for an understated, premium feel
 */
const AntigravityParticles = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Matching Website Blue Palette: Cine-Teal Sky Blue (#7dd3fc), Electric Azure (#38bdf8), Deep Cyan (#0ea5e9), Soft Lavender (#d8b4fe)
    const palette = [
      { r: 125, g: 211, b: 252 }, // Signature Cine-Teal / Sky Blue (#7dd3fc)
      { r: 56, g: 189, b: 248 },  // Electric Azure Blue (#38bdf8)
      { r: 14, g: 165, b: 233 },  // Deep Cyan Blue (#0ea5e9)
      { r: 186, g: 230, b: 253 }, // Luminous Ice Blue (#bae6fd)
      { r: 216, g: 180, b: 254 }, // Soft Cine-Lavender Accent (#d8b4fe)
    ];

    // Mouse state with boosted interactive radius
    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      active: false,
      radius: 155, // Boosted interactive presence (155px radius)
    };

    let particles = [];

    const SPACING = 46; // Balanced honeycomb grid spacing

    class Particle {
      constructor(x, y) {
        this.x0 = x;
        this.y0 = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = (Math.random() - 0.5) * 0.3;
        this.baseLength = 3.0 + Math.random() * 1.6; // Clear, crisp dashes
        this.thickness = 1.2; // Defined hairline thickness
        this.excitation = 0; // 0 (idle) to 1 (excited)
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.seed = Math.random() * 1000;
      }

      update(time) {
        // 1. Responsive cursor deflection with matching blue excitation
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0.001) {
            const factor = Math.pow(1 - dist / mouse.radius, 1.4);
            const normX = dx / dist;
            const normY = dy / dist;

            // Noticeable, satisfying radial push
            const repelForce = factor * 1.7;
            this.vx += normX * repelForce;
            this.vy += normY * repelForce;

            // Fluid Google Antigravity vortex curl
            const swirlForce = factor * 1.5;
            this.vx += -normY * swirlForce;
            this.vy += normX * swirlForce;

            // Slipstream from mouse velocity
            this.vx += mouse.vx * factor * 0.06;
            this.vy += mouse.vy * factor * 0.06;

            // Responsive excitation
            this.excitation = Math.min(1, this.excitation + factor * 0.45);
          }
        }

        // 2. Smooth spring return to resting anchor
        const springK = 0.040;
        const damping = 0.84;

        // Gentle ambient drift (0.6px)
        const idleX = this.x0 + Math.sin(time * 0.0008 + this.seed) * 0.6;
        const idleY = this.y0 + Math.cos(time * 0.0009 + this.seed) * 0.6;

        const ax = (idleX - this.x) * springK;
        const ay = (idleY - this.y) * springK;

        this.vx = (this.vx + ax) * damping;
        this.vy = (this.vy + ay) * damping;

        this.x += this.vx;
        this.y += this.vy;

        // Smooth dissipation of excitation back to idle
        this.excitation *= 0.93;

        // 3. Dynamic orientation alignment
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.09) {
          const targetAngle = Math.atan2(this.vy, this.vx);
          let diff = targetAngle - this.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          this.angle += diff * 0.22;
        } else {
          // Relax smoothly to baseline angle
          this.angle += (Math.sin(time * 0.0005 + this.seed) * 0.15 - this.angle) * 0.03;
        }
      }

      draw(context) {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const dynamicLength = this.baseLength + speed * 0.7 + this.excitation * 2.6;
        const halfLen = dynamicLength / 2;

        // Ambient opacity (0.08) scaling up to a luminous, satisfying blue glow (0.50 max)
        const alpha = 0.08 + this.excitation * 0.42;
        const { r, g, b } = this.color;

        // Cool slate-blue resting base
        const neutralR = 140, neutralG = 175, neutralB = 215;
        const curR = Math.round(neutralR + (r - neutralR) * (this.excitation * 0.9 + 0.1));
        const curG = Math.round(neutralG + (g - neutralG) * (this.excitation * 0.9 + 0.1));
        const curB = Math.round(neutralB + (b - neutralB) * (this.excitation * 0.9 + 0.1));

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);

        context.beginPath();
        context.moveTo(-halfLen, 0);
        context.lineTo(halfLen, 0);

        context.strokeStyle = `rgba(${curR}, ${curG}, ${curB}, ${alpha})`;
        context.lineWidth = this.thickness + this.excitation * 0.4;
        context.lineCap = 'round';
        context.stroke();

        context.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const xOffset = (j % 2 === 0) ? 0 : SPACING * 0.5;
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
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse with smoothing
    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

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

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Rendering loop
    let isRunning = true;
    const render = (time) => {
      if (!isRunning) return;

      // Mouse velocity decay
      mouse.vx *= 0.75;
      mouse.vy *= 0.75;

      ctx.clearRect(0, 0, width, height);

      // Update and draw grid particles
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        p.update(time);
        p.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Save battery when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
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
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
