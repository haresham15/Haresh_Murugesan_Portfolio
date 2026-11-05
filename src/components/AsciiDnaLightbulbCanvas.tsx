import React, { useRef, useEffect, useState } from 'react';
import { useMotionPreference } from './MotionPreference';

// ---------------------------------------------------------------------------
// 1. Character Ramps for Devault-Inspired Micro-ASCII Engine
// ---------------------------------------------------------------------------
const RAMP_DENSITY = ['@', 'W', '#', '$', '%', '*', '+', '=', ':', '-', '.', '·', ' '];
const RAMP_DNA_BASES = ['A', 'T', 'C', 'G'] as const;
const RAMP_EXHAUST = ['@', '#', '%', '&', '1', '0', '*', '+', '=', ':', '-', '.', '·'];

export const AsciiDnaLightbulbCanvas: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, vx: 0, vy: 0 });
  const launchStartTimeRef = useRef<number>(0);
  const rulerCursorYRef = useRef<number>(0);
  const textMaskBoundsRef = useRef({
    centerAX: 400,
    centerAY: 340,
    rxA: 340,
    ryA: 175,
    centerBX: 300,
    centerBY: 620,
    rxB: 260,
    ryB: 70,
    subcopyRight: 500,
    subcopyMidY: 620,
    midGapY: 520,
  });

  // Pause rendering when off-screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Track mouse coordinates & velocity for aerodynamic probe perturbation
  useEffect(() => {
    let lastX = -1000;
    let lastY = -1000;
    let lastTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);

      mouseRef.current = {
        x: currentX,
        y: currentY,
        active: true,
        vx: (currentX - lastX) / dt,
        vy: (currentY - lastY) / dt,
      };

      lastX = currentX;
      lastY = currentY;
      lastTime = now;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. High-Density Micro-ASCII + CFD Flow-Field + Blueprint Drafting Engine
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    launchStartTimeRef.current = performance.now();

    // 45.0-degree unit vectors (Launch: up-right dx>0, dy<0; Perpendicular: dx>0, dy>0)
    const invSqrt2 = Math.SQRT1_2;
    const dirX = invSqrt2;
    const dirY = -invSqrt2;
    const perpX = invSqrt2;
    const perpY = invSqrt2;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Safe positive modulo helper
    const safeMod = (n: number, m: number): number => {
      return ((Math.floor(n) % m) + m) % m;
    };

    // Easing curve: cubic-bezier(0.16, 1, 0.3, 1)
    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    // -------------------------------------------------------------------------
    // True Anatomical Pear-Shaped Bulb Profile Function R(v)
    // -------------------------------------------------------------------------
    // Returns normalized radius R_norm in [0, 1] relative to base dome radius R_bulb
    // v_norm is normalized longitudinal position along 45° launch axis:
    //   v_norm = +1.0  => glass crown tip
    //   v_norm =  0.0  => dome equator
    //   v_norm = -0.1  => dome lower boundary
    //   v_norm = -0.75 => smooth concave inflection neck
    //   v_norm = -1.10 => metallic screw base
    //   v_norm = -1.22 => ceramic insulator & ignition tip
    const getPearProfile = (vNorm: number): { rNorm: number; zone: 'dome' | 'neck' | 'screw' | 'nozzle' | 'none' } => {
      if (vNorm > 1.0 || vNorm < -1.22) {
        return { rNorm: 0, zone: 'none' };
      }

      // 1. Upper Hemisphere Dome (vNorm from -0.1 to +1.0)
      if (vNorm >= -0.1) {
        const radSqr = 1.0 - vNorm * vNorm;
        return { rNorm: radSqr > 0 ? Math.sqrt(radSqr) : 0, zone: 'dome' };
      }

      // 2. Smooth Concave Inflection Neck (vNorm from -0.75 to -0.1)
      if (vNorm >= -0.75) {
        const t = (vNorm - (-0.75)) / (-0.1 - (-0.75)); // 0 at neck, 1 at dome base
        const neckRadius = 0.42;
        const domeBaseRadius = Math.sqrt(1.0 - 0.01); // ~0.995
        // Smooth cosine S-curve transition
        const smoothT = (1.0 - Math.cos(t * Math.PI)) * 0.5;
        const rNorm = neckRadius + (domeBaseRadius - neckRadius) * smoothT;
        return { rNorm, zone: 'neck' };
      }

      // 3. Machined Edison Screw Threads (5 distinct sinusoidal ridges)
      if (vNorm >= -1.10) {
        const threadFreq = 5.0 * Math.PI * 2.0; // 5 full ridges
        const threadT = (vNorm - (-1.10)) / (-0.75 - (-1.10));
        const threadMod = Math.sin(threadT * threadFreq) * 0.040;
        const screwRadius = 0.38 + threadMod;
        return { rNorm: screwRadius, zone: 'screw' };
      }

      // 4. Ceramic Insulator Collar & White-Hot Ignition Contact Tip
      if (vNorm >= -1.22) {
        const collarT = (vNorm - (-1.22)) / (-1.10 - (-1.22));
        const nozzleRadius = 0.22 + (0.36 - 0.22) * collarT;
        return { rNorm: nozzleRadius, zone: 'nozzle' };
      }

      return { rNorm: 0, zone: 'none' };
    };

    // Pre-calculate continuous streamline ribbon offsets (20 streamline ribbons)
    const STREAMLINE_COUNT = 20;
    const streamlineOffsets = Array.from({ length: STREAMLINE_COUNT }, (_, i) => {
      return -560 + (i * 1180) / (STREAMLINE_COUNT - 1);
    });

    // Update dynamic text-masking boundaries based on DOM elements (with robust fallback)
    const updateTextMaskBounds = (canvasW: number, canvasH: number) => {
      const headEl = typeof document !== 'undefined' ? document.getElementById('hero-headline-block') : null;
      const subEl = typeof document !== 'undefined' ? document.getElementById('hero-subcopy-block') : null;
      const canvasRect = canvas?.getBoundingClientRect();
      const offsetLeft = canvasRect ? canvasRect.left : 0;
      const offsetTop = canvasRect ? canvasRect.top : 0;

      let cAX = Math.min(canvasW * 0.30, 420);
      let cAY = canvasH * 0.40;
      let rxA = 340;
      let ryA = 175;
      let headBottom = canvasH * 0.48;

      if (headEl) {
        const r = headEl.getBoundingClientRect();
        cAX = r.left - offsetLeft + r.width * 0.48;
        cAY = r.top - offsetTop + r.height * 0.50;
        rxA = Math.max(340, r.width * 0.52);
        ryA = Math.max(175, r.height * 0.58);
        headBottom = r.bottom - offsetTop;
      }

      let cBX = Math.min(canvasW * 0.22, 320);
      let cBY = canvasH * 0.68;
      let rxB = 260;
      let ryB = 70;
      let subRight = Math.min(canvasW * 0.38, 540);
      let subMidY = canvasH * 0.72;
      let subTop = canvasH * 0.62;

      if (subEl) {
        const r = subEl.getBoundingClientRect();
        cBX = r.left - offsetLeft + r.width * 0.50;
        cBY = r.top - offsetTop + r.height * 0.50;
        rxB = Math.max(260, r.width * 0.55);
        ryB = Math.max(70, r.height * 0.65);
        subRight = r.right - offsetLeft;
        subMidY = r.top - offsetTop + r.height * 0.45;
        subTop = r.top - offsetTop;
      }

      const midGapY = (headBottom + subTop) * 0.5;

      textMaskBoundsRef.current = {
        centerAX: cAX,
        centerAY: cAY,
        rxA,
        ryA,
        centerBX: cBX,
        centerBY: cBY,
        rxB,
        ryB,
        subcopyRight: subRight,
        subcopyMidY: subMidY,
        midGapY,
      };
    };

    // Calculate attenuation factor in [0.15, 1.0] for any coordinate (px, py)
    const getMaskAttenuation = (px: number, py: number): number => {
      const { centerAX, centerAY, rxA, ryA, centerBX, centerBY, rxB, ryB } = textMaskBoundsRef.current;

      // Mask A (Headline Zone)
      const dxA = (px - centerAX) / rxA;
      const dyA = (py - centerAY) / ryA;
      const dSqrA = dxA * dxA + dyA * dyA;
      let attenA = 1.0;
      if (dSqrA < 1.0) {
        const distA = Math.sqrt(dSqrA);
        attenA = 0.15 + 0.85 * (distA * distA);
      }

      // Mask B (Sub-copy Zone)
      const dxB = (px - centerBX) / rxB;
      const dyB = (py - centerBY) / ryB;
      const dSqrB = dxB * dxB + dyB * dyB;
      let attenB = 1.0;
      if (dSqrB < 1.0) {
        const distB = Math.sqrt(dSqrB);
        attenB = 0.15 + 0.85 * (distB * distB);
      }

      return Math.min(attenA, attenB);
    };

    let frameCount = 0;

    // Main animation frame render function
    const render = (now: number) => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      if (frameCount % 60 === 0) {
        updateTextMaskBounds(w, h);
      }
      frameCount++;

      const isMobile = w < 768;
      // High-Density Micro-Cell Monospace Grid: 6px x 8px on desktop, 8px x 10px on mobile
      const cellW = isMobile ? 8 : 6;
      const cellH = isMobile ? 10 : 8;
      const scale = isMobile ? 0.58 : 1.0;
      const bulbRadius = 175 * scale; // Macro scale: 350px diameter on desktop, ~203px on mobile

      // Shifted Safe Focal Coordinate (x = 73% vw, y = 38% vh on desktop; 82%, 15% on mobile)
      const targetX = isMobile ? w * 0.82 : w * 0.73;
      const targetY = isMobile ? h * 0.15 : h * 0.38;

      // Ballistic Launch Progress
      const elapsed = (now - launchStartTimeRef.current) * 0.001;
      const launchDuration = 1.1;
      const rawLaunchT = Math.min(1.0, elapsed / launchDuration);
      const launchProgress = isReduced ? 1.0 : easeOutQuart(rawLaunchT);

      // 45° Launch vector from lower-left (900px distance) to target position
      const launchDistance = isMobile ? 550 : 900;
      const startX = targetX - launchDistance * dirX;
      const startY = targetY - launchDistance * dirY;

      let bulbCenterX = startX + (targetX - startX) * launchProgress;
      let bulbCenterY = startY + (targetY - startY) * launchProgress;

      // Harmonic Hover Motion (±4px along 45° axis)
      if (launchProgress >= 0.99 && !isReduced) {
        const hoverT = elapsed * 1.6;
        const hoverDisp = Math.sin(hoverT) * 4.0;
        bulbCenterX += hoverDisp * dirX;
        bulbCenterY += hoverDisp * dirY;
      }

      const mouse = mouseRef.current;
      const animTime = isReduced ? 1.4 : elapsed;

      // Extract text mask bounds and negative-space coordinates
      const {
        centerAX,
        centerAY,
        rxA,
        ryA,
        centerBX,
        centerBY,
        rxB,
        ryB,
        subcopyRight,
        subcopyMidY,
        midGapY,
      } = textMaskBoundsRef.current;

      // Ignition Origin Anchor Point (calculated early for volumetric glow & reticle geometry)
      const originX = isMobile
        ? w * 0.36
        : Math.min(bulbCenterX - 220 * scale, Math.max(w * 0.34, subcopyRight + 85));
      const originY = isMobile
        ? h * 0.85
        : Math.max(h * 0.68, Math.min(h * 0.80, subcopyMidY));

      // =========================================================================
      // LAYER 1: ATMOSPHERIC DEPTH & VOLUMETRIC LIGHT WELLS
      // =========================================================================

      // 1. Primary Trajectory Volumetric Glow Corridor
      const corridorGrad = ctx.createLinearGradient(
        bulbCenterX - 500 * dirX,
        bulbCenterY - 500 * dirY,
        bulbCenterX + 400 * dirX,
        bulbCenterY + 400 * dirY
      );
      corridorGrad.addColorStop(0, 'rgba(16, 30, 54, 0.0)');
      corridorGrad.addColorStop(0.4, 'rgba(16, 30, 54, 0.65)');
      corridorGrad.addColorStop(0.7, 'rgba(255, 107, 53, 0.11)');
      corridorGrad.addColorStop(1, 'rgba(130, 183, 255, 0.08)');

      ctx.fillStyle = corridorGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Upper-Right Apex Halo Bloom behind Lightbulb Dome
      const apexHalo = ctx.createRadialGradient(
        bulbCenterX,
        bulbCenterY,
        40,
        bulbCenterX,
        bulbCenterY,
        580 * scale
      );
      apexHalo.addColorStop(0, 'rgba(130, 183, 255, 0.15)');
      apexHalo.addColorStop(0.45, 'rgba(255, 107, 53, 0.09)');
      apexHalo.addColorStop(0.8, 'rgba(16, 30, 54, 0.05)');
      apexHalo.addColorStop(1, 'rgba(7, 11, 18, 0.0)');

      ctx.fillStyle = apexHalo;
      ctx.beginPath();
      ctx.arc(bulbCenterX, bulbCenterY, 580 * scale, 0, Math.PI * 2);
      ctx.fill();

      // =========================================================================
      // LAYER 1 (EXTENDED): AMBIENT ORANGE GRADIENT, FULL-WIDTH GRID & TEXT MASKS
      // =========================================================================

      // 3. Vibrant Left-Side Radiant Orange Atmosphere (to balance supersonic lightbulb and make everything pop)
      const leftAtmosphereRadius = Math.max(w, h) * (isMobile ? 0.70 : 0.62);
      const leftAtmosphereGlow = ctx.createRadialGradient(
        w * 0.20,
        h * 0.42,
        20,
        w * 0.20,
        h * 0.42,
        leftAtmosphereRadius
      );
      leftAtmosphereGlow.addColorStop(0, 'rgba(255, 107, 53, 0.24)');
      leftAtmosphereGlow.addColorStop(0.24, 'rgba(255, 138, 72, 0.16)');
      leftAtmosphereGlow.addColorStop(0.50, 'rgba(245, 217, 152, 0.08)');
      leftAtmosphereGlow.addColorStop(0.75, 'rgba(16, 30, 54, 0.03)');
      leftAtmosphereGlow.addColorStop(1, 'rgba(7, 11, 18, 0.0)');

      ctx.fillStyle = leftAtmosphereGlow;
      ctx.beginPath();
      ctx.arc(w * 0.20, h * 0.42, leftAtmosphereRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3b. Lower-Left Ignition Launch Origin Warm Bloom
      const originBloomRadius = isMobile ? 180 : 260 * scale;
      const originBloom = ctx.createRadialGradient(
        originX,
        originY,
        15,
        originX,
        originY,
        originBloomRadius
      );
      originBloom.addColorStop(0, 'rgba(255, 107, 53, 0.22)');
      originBloom.addColorStop(0.35, 'rgba(255, 107, 53, 0.12)');
      originBloom.addColorStop(0.70, 'rgba(245, 217, 152, 0.04)');
      originBloom.addColorStop(1, 'rgba(7, 11, 18, 0.0)');

      ctx.fillStyle = originBloom;
      ctx.beginPath();
      ctx.arc(originX, originY, originBloomRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3c. Upper-Left Tangent Glow (subtle ambient highlight above headline)
      const upperLeftRadius = 300 * scale;
      const upperLeftGlow = ctx.createRadialGradient(
        w * 0.24,
        h * 0.16,
        15,
        w * 0.24,
        h * 0.16,
        upperLeftRadius
      );
      upperLeftGlow.addColorStop(0, 'rgba(255, 138, 72, 0.12)');
      upperLeftGlow.addColorStop(0.50, 'rgba(255, 107, 53, 0.05)');
      upperLeftGlow.addColorStop(1, 'rgba(7, 11, 18, 0.0)');

      ctx.fillStyle = upperLeftGlow;
      ctx.beginPath();
      ctx.arc(w * 0.24, h * 0.16, upperLeftRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Full-Width Architectural Grid Continuity across 100% of Viewport (Section 2.1.1)
      if (!isMobile) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(130, 183, 255, 0.04)';
        ctx.beginPath();
        for (let gx = 0; gx < w; gx += 40) {
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
        }
        for (let gy = 0; gy < h; gy += 40) {
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
        }
        ctx.stroke();

        // 160px Major Crosshairs with Interactive Proximity Glow (Section 2.4.3)
        for (let gx = 0; gx < w; gx += 160) {
          for (let gy = 40; gy < h; gy += 160) {
            const atten = getMaskAttenuation(gx, gy);
            let armLen = 4;
            let crosshairColor = `rgba(243, 239, 231, ${(0.14 * atten).toFixed(3)})`;
            let drawCenterDot = false;

            if (mouse.active) {
              const distToMouse = Math.hypot(gx - mouse.x, gy - mouse.y);
              if (distToMouse < 140) {
                const prox = Math.pow(1.0 - distToMouse / 140, 1.4);
                armLen = 4 + 3.5 * prox;
                const r = Math.round(255 * prox + 243 * (1 - prox));
                const g = Math.round(107 * prox + 239 * (1 - prox));
                const b = Math.round(53 * prox + 231 * (1 - prox));
                const alpha = Math.min(0.65, (0.14 + 0.45 * prox) * atten);
                crosshairColor = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
                if (prox > 0.4) drawCenterDot = true;
              }
            }

            ctx.strokeStyle = crosshairColor;
            ctx.beginPath();
            ctx.moveTo(gx - armLen, gy);
            ctx.lineTo(gx + armLen, gy);
            ctx.moveTo(gx, gy - armLen);
            ctx.lineTo(gx, gy + armLen);
            ctx.stroke();

            if (drawCenterDot) {
              ctx.fillStyle = crosshairColor;
              ctx.beginPath();
              ctx.arc(gx, gy, 1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 5. Tight Elliptical Text-Protection Attenuation Masks (Section 2.1.2)
      // Softly attenuate grid & streamlines behind headline & subcopy while allowing warm ambient orange light to filter through
      // Mask A (Headline Zone)
      ctx.save();
      ctx.translate(centerAX, centerAY);
      ctx.scale(1, ryA / rxA);
      const gradMaskA = ctx.createRadialGradient(0, 0, 0, 0, 0, rxA);
      gradMaskA.addColorStop(0, 'rgba(7, 11, 18, 0.55)');
      gradMaskA.addColorStop(0.55, 'rgba(7, 11, 18, 0.35)');
      gradMaskA.addColorStop(0.85, 'rgba(7, 11, 18, 0.10)');
      gradMaskA.addColorStop(1, 'rgba(7, 11, 18, 0.0)');
      ctx.fillStyle = gradMaskA;
      ctx.beginPath();
      ctx.arc(0, 0, rxA, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Mask B (Sub-copy Zone)
      ctx.save();
      ctx.translate(centerBX, centerBY);
      ctx.scale(1, ryB / rxB);
      const gradMaskB = ctx.createRadialGradient(0, 0, 0, 0, 0, rxB);
      gradMaskB.addColorStop(0, 'rgba(7, 11, 18, 0.55)');
      gradMaskB.addColorStop(0.60, 'rgba(7, 11, 18, 0.30)');
      gradMaskB.addColorStop(0.85, 'rgba(7, 11, 18, 0.08)');
      gradMaskB.addColorStop(1, 'rgba(7, 11, 18, 0.0)');
      ctx.fillStyle = gradMaskB;
      ctx.beginPath();
      ctx.arc(0, 0, rxB, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // =========================================================================
      // LAYER 2: HIGH-CONTRAST ARCHITECTURAL DRAFTING & ORBITAL BLUEPRINT
      // (Elevated Alphas 0.18–0.45 for True Concept D Prominence)
      // =========================================================================
      ctx.lineWidth = 1;

      // 1. 45.0° Ballistic Trajectory Centerline (Dashed-dot line in amber #FF6B35)
      const datumDiagLen = Math.hypot(w, h) * 1.5;
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.38)';
      ctx.setLineDash([12, 4, 3, 4]);
      ctx.beginPath();
      ctx.moveTo(bulbCenterX - datumDiagLen * dirX, bulbCenterY - datumDiagLen * dirY);
      ctx.lineTo(bulbCenterX + datumDiagLen * dirX, bulbCenterY + datumDiagLen * dirY);
      ctx.stroke();

      // 2. Parallel Launch Corridor Rails (Offset ±180px, technical blue #82B7FF)
      const corridorOffset = 180 * scale;
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.24)';
      ctx.setLineDash([8, 6]);

      // Left Rail
      ctx.beginPath();
      ctx.moveTo(bulbCenterX - corridorOffset * perpX - datumDiagLen * dirX, bulbCenterY - corridorOffset * perpY - datumDiagLen * dirY);
      ctx.lineTo(bulbCenterX - corridorOffset * perpX + datumDiagLen * dirX, bulbCenterY - corridorOffset * perpY + datumDiagLen * dirY);
      ctx.stroke();

      // Right Rail
      ctx.beginPath();
      ctx.moveTo(bulbCenterX + corridorOffset * perpX - datumDiagLen * dirX, bulbCenterY + corridorOffset * perpY - datumDiagLen * dirY);
      ctx.lineTo(bulbCenterX + corridorOffset * perpX + datumDiagLen * dirX, bulbCenterY + corridorOffset * perpY + datumDiagLen * dirY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Perpendicular Distance Station Ticks extending into lower-left quadrant (Section 2.3.1)
      for (let s = -960; s <= 420; s += 60) {
        const tickX = bulbCenterX + s * dirX * scale;
        const tickY = bulbCenterY + s * dirY * scale;
        if (tickX < 0 || tickX > w || tickY < 0 || tickY > h) continue;

        const atten = getMaskAttenuation(tickX, tickY);
        ctx.strokeStyle = `rgba(130, 183, 255, ${(0.20 * atten).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(tickX - corridorOffset * perpX, tickY - corridorOffset * perpY);
        ctx.lineTo(tickX - (corridorOffset - 12) * perpX, tickY - (corridorOffset - 12) * perpY);
        ctx.moveTo(tickX + corridorOffset * perpX, tickY + corridorOffset * perpY);
        ctx.lineTo(tickX + (corridorOffset - 12) * perpX, tickY + (corridorOffset - 12) * perpY);
        ctx.stroke();
      }

      // 3. Three Concentric Orbital Telemetry Rings (Proportionally Scaled for 350px Bulb)
      // Inner Ring (r = 210px): Solid 1px technical blue
      const rInner = 210 * scale;
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.32)';
      ctx.beginPath();
      ctx.arc(bulbCenterX, bulbCenterY, rInner, 0, Math.PI * 2);
      ctx.stroke();

      // 4 Cardinal Notch Ticks on Inner Ring
      for (let a = 0; a < 4; a++) {
        const rad = (a * Math.PI) / 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(bulbCenterX + Math.cos(rad) * (rInner - 8), bulbCenterY + Math.sin(rad) * (rInner - 8));
        ctx.lineTo(bulbCenterX + Math.cos(rad) * (rInner + 8), bulbCenterY + Math.sin(rad) * (rInner + 8));
        ctx.stroke();
      }

      // Middle Protractor Ring (r = 340px): Dashed ring with 5° and 15° degree ticks
      const rMiddle = 340 * scale;
      ctx.strokeStyle = 'rgba(243, 239, 231, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(bulbCenterX, bulbCenterY, rMiddle, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Radial Degree Ticks on Middle Protractor Ring
      for (let deg = -120; deg <= 30; deg += 5) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 15 === 0;
        const tickLen = isMajor ? 14 : 6;
        const p1x = bulbCenterX + Math.cos(rad) * rMiddle;
        const p1y = bulbCenterY + Math.sin(rad) * rMiddle;
        const p2x = bulbCenterX + Math.cos(rad) * (rMiddle + tickLen);
        const p2y = bulbCenterY + Math.sin(rad) * (rMiddle + tickLen);

        ctx.strokeStyle = isMajor ? 'rgba(255, 107, 53, 0.45)' : 'rgba(243, 239, 231, 0.18)';
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      // Outer Range Ring (r = 500px): Fine geometric arc with degree callouts
      const rOuter = 500 * scale;
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.20)';
      ctx.beginPath();
      ctx.arc(bulbCenterX, bulbCenterY, rOuter, -Math.PI * 0.7, Math.PI * 0.2);
      ctx.stroke();

      // 4. Upper-Left Orbital Tangent Arc above SYSTEMS PHILOSOPHY (Section 2.3.3)
      const rCelestial = 640 * scale;
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.14)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(bulbCenterX, bulbCenterY, rCelestial, -Math.PI * 0.94, -Math.PI * 0.61);
      ctx.stroke();
      ctx.setLineDash([]);

      // Degree ticks along celestial arc
      for (let deg = -168; deg <= -110; deg += 3) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 15 === 0;
        const tickLen = isMajor ? 8 : 4;
        const p1x = bulbCenterX + Math.cos(rad) * (rCelestial - tickLen);
        const p1y = bulbCenterY + Math.sin(rad) * (rCelestial - tickLen);
        const p2x = bulbCenterX + Math.cos(rad) * rCelestial;
        const p2y = bulbCenterY + Math.sin(rad) * rCelestial;

        ctx.strokeStyle = isMajor ? 'rgba(255, 107, 53, 0.38)' : 'rgba(130, 183, 255, 0.14)';
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      // 5. Ignition Origin Reticle (Section 2.3.2)
      // Placed strictly in the open negative-space pocket to the right of the lower sub-copy
      const rOrigInner = isMobile ? 18 : 28;
      const rOrigOuter = isMobile ? 40 : 58;
      const rOrigArc = isMobile ? 26 : 38;

      // Central + crosshair
      ctx.strokeStyle = 'rgba(243, 239, 231, 0.30)';
      ctx.beginPath();
      ctx.moveTo(originX - 10, originY);
      ctx.lineTo(originX + 10, originY);
      ctx.moveTo(originX, originY - 10);
      ctx.lineTo(originX, originY + 10);
      ctx.stroke();

      // Inner circle: solid rgba(255, 107, 53, 0.22)
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.22)';
      ctx.beginPath();
      ctx.arc(originX, originY, rOrigInner, 0, Math.PI * 2);
      ctx.stroke();

      // Outer circle: dashed rgba(130, 183, 255, 0.16)
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.16)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(originX, originY, rOrigOuter, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Horizontal baseline datum
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.18)';
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + (isMobile ? 45 : 68), originY);
      ctx.stroke();

      // 45.0° launch vector extending from origin
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.32)';
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX + (isMobile ? 45 : 68) * dirX, originY + (isMobile ? 45 : 68) * dirY);
      ctx.stroke();

      // 45.0° angle arc bridging horizontal baseline to 45° launch vector
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.40)';
      ctx.beginPath();
      ctx.arc(originX, originY, rOrigArc, -Math.PI / 4, 0, false);
      ctx.stroke();

      // 6. Far-Left Architectural Elevation Scale / Telemetry Gutter (Section 2.2)
      if (!isMobile) {
        const rulerX = 24;
        const rulerYStart = h * 0.14;
        const rulerYEnd = h * 0.86;
        const rulerHeight = rulerYEnd - rulerYStart;
        const rulerYMid = (rulerYStart + rulerYEnd) / 2;

        // Hairline vertical axis
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(167, 178, 195, 0.12)';
        ctx.beginPath();
        ctx.moveTo(rulerX, rulerYStart);
        ctx.lineTo(rulerX, rulerYEnd);
        ctx.stroke();

        // Minor ticks (4px every 20px) and Major ticks (10px every 100px)
        const numSteps = Math.floor(rulerHeight / 20);
        for (let i = 0; i <= numSteps; i++) {
          const ty = rulerYStart + i * 20;
          if (ty > rulerYEnd + 0.5) break;

          const distFromStart = i * 20;
          const isMajor = distFromStart % 100 === 0;

          if (isMajor) {
            ctx.strokeStyle = 'rgba(130, 183, 255, 0.22)';
            ctx.beginPath();
            ctx.moveTo(rulerX, ty);
            ctx.lineTo(rulerX + 10, ty);
            ctx.stroke();
          } else {
            ctx.strokeStyle = 'rgba(167, 178, 195, 0.12)';
            ctx.beginPath();
            ctx.moveTo(rulerX, ty);
            ctx.lineTo(rulerX + 4, ty);
            ctx.stroke();
          }
        }

        // Interactive Cursor Follower
        const targetCursorY = mouse.active
          ? Math.max(rulerYStart, Math.min(rulerYEnd, mouse.y))
          : rulerYMid;

        if (isReduced) {
          rulerCursorYRef.current = targetCursorY;
        } else {
          if (rulerCursorYRef.current === 0) rulerCursorYRef.current = rulerYMid;
          rulerCursorYRef.current += (targetCursorY - rulerCursorYRef.current) * 0.12;
        }
        const currentRulerY = rulerCursorYRef.current;

        // Diamond marker (6px total size, r = 3px)
        const dSize = 3;
        ctx.fillStyle = mouse.active ? '#FF6B35' : 'rgba(130, 183, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(rulerX, currentRulerY - dSize);
        ctx.lineTo(rulerX + dSize, currentRulerY);
        ctx.lineTo(rulerX, currentRulerY + dSize);
        ctx.lineTo(rulerX - dSize, currentRulerY);
        ctx.closePath();
        ctx.fill();

        // Subtle crosshair tick
        ctx.strokeStyle = mouse.active ? 'rgba(255, 107, 53, 0.75)' : 'rgba(130, 183, 255, 0.35)';
        ctx.beginPath();
        ctx.moveTo(rulerX - 4, currentRulerY);
        ctx.lineTo(rulerX + 6, currentRulerY);
        ctx.stroke();
      }

      // =========================================================================
      // LAYER 3: SUPERSONIC MACH BOW-SHOCKWAVE & LAMINAR INFLOW STREAMLINES
      // =========================================================================

      // 1. Slow Laminar Wind-Tunnel Streamlines across the Left (Section 2.4.1)
      const laminarStreamlines = [
        // Stratospheric streamline passing well above SYSTEMS PHILOSOPHY
        { startY: h * 0.11, c1x: w * 0.18, c1y: h * 0.11, c2x: w * 0.38, c2y: h * 0.15, endX: w * 0.58, endY: h * 0.20, speed: 0.10, offset: 0.10 },
        // High streamline passing above "Curious about"
        { startY: h * 0.21, c1x: w * 0.22, c1y: h * 0.22, c2x: w * 0.42, c2y: h * 0.25, endX: w * 0.62, endY: h * 0.28, speed: 0.12, offset: 0.35 },
        // Clear mid-gap streamline 1 between "making it work." and "AI/ML"
        { startY: midGapY - 18, c1x: w * 0.20, c1y: midGapY - 18, c2x: w * 0.36, c2y: midGapY - 24, endX: w * 0.54, endY: midGapY - 32, speed: 0.14, offset: 0.65 },
        // Lower mid-gap streamline 2 passing towards 45° launch corridor
        { startY: midGapY + 18, c1x: w * 0.24, c1y: midGapY + 18, c2x: w * 0.40, c2y: midGapY + 12, endX: w * 0.58, endY: midGapY + 4, speed: 0.13, offset: 0.85 },
        // Origin feeding streamline curving towards ignition reticle
        { startY: h * 0.66, c1x: w * 0.18, c1y: h * 0.68, c2x: w * 0.32, c2y: h * 0.72, endX: originX + 24, endY: originY - 12, speed: 0.11, offset: 0.45 },
      ];

      laminarStreamlines.forEach((stream) => {
        const steps = 48;
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          const invT = 1 - t;
          const px =
            invT * invT * invT * 0 +
            3 * invT * invT * t * stream.c1x +
            3 * invT * t * t * stream.c2x +
            t * t * t * stream.endX;
          const py =
            invT * invT * invT * stream.startY +
            3 * invT * invT * t * stream.c1y +
            3 * invT * t * t * stream.c2y +
            t * t * t * stream.endY;

          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.strokeStyle = 'rgba(130, 183, 255, 0.11)';
        ctx.stroke();

        // Slow-moving ASCII pulse dot that gently accelerates as pulled rightward
        const pulseT = (animTime * stream.speed + stream.offset) % 1.0;
        const easedT = pulseT * pulseT * 0.45 + pulseT * 0.55;
        const invPt = 1 - easedT;
        const pulseX =
          invPt * invPt * invPt * 0 +
          3 * invPt * invPt * easedT * stream.c1x +
          3 * invPt * easedT * easedT * stream.c2x +
          easedT * easedT * easedT * stream.endX;
        const pulseY =
          invPt * invPt * invPt * stream.startY +
          3 * invPt * invPt * easedT * stream.c1y +
          3 * invPt * easedT * easedT * stream.c2y +
          easedT * easedT * easedT * stream.endY;

        const pAtten = getMaskAttenuation(pulseX, pulseY);
        if (pAtten > 0.15 && pulseX > 10 && pulseX < w && pulseY > 0 && pulseY < h) {
          const glyph = easedT < 0.35 ? '·' : (easedT < 0.70 ? ':' : '-');
          ctx.font = "8px 'Geist Mono', monospace";
          ctx.fillStyle = `rgba(130, 183, 255, ${(0.48 * pAtten).toFixed(3)})`;
          ctx.fillText(glyph, pulseX, pulseY);
        }
      });

      // 2. Continuous Flowing Wind-Tunnel Streamlines (20 Streamline Ribbons)
      ctx.lineWidth = 1;
      streamlineOffsets.forEach((offset, idx) => {
        ctx.beginPath();
        const steps = 60;
        let drawn = false;

        for (let s = 0; s <= steps; s++) {
          const tDist = -650 + (s * 1300) / steps;
          let px = bulbCenterX + offset * perpX - tDist * dirX;
          let py = bulbCenterY + offset * perpY - tDist * dirY;

          // Compute local distance to bulb center
          const ldx = px - bulbCenterX;
          const ldy = py - bulbCenterY;
          const lu = ldx * dirX + ldy * dirY;
          const lv = ldx * perpX + ldy * perpY;

          // Parabolic Mach Shockwave deflection: deflect streamline outward around bulb
          const noseU = 175 * scale + 36 * scale;
          const shockFrontU = noseU - (0.0028 / scale) * (lv * lv);

          if (lu < noseU + 80 * scale && lu > -280 * scale) {
            const distToShock = Math.abs(lu - shockFrontU);
            if (distToShock < 100 * scale) {
              const deflection = Math.exp(-distToShock / (45 * scale)) * 38 * scale * Math.sign(lv || 1);
              px += deflection * perpX;
              py += deflection * perpY;
            }
          }

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
          drawn = true;
        }

        if (drawn) {
          ctx.strokeStyle = idx % 3 === 0 ? 'rgba(130, 183, 255, 0.26)' : 'rgba(167, 178, 195, 0.14)';
          ctx.stroke();

          // Animated particle pulse traveling along this streamline
          const pulseT = ((animTime * 0.45 + idx * 0.08) % 1.0);
          const pulseDist = -650 + pulseT * 1300;
          let pulseX = bulbCenterX + offset * perpX - pulseDist * dirX;
          let pulseY = bulbCenterY + offset * perpY - pulseDist * dirY;

          const pAtten = getMaskAttenuation(pulseX, pulseY);
          if (pulseX > 0 && pulseX < w && pulseY > 0 && pulseY < h && pAtten > 0.15) {
            ctx.font = "8px 'Geist Mono', monospace";
            ctx.fillStyle = `rgba(130, 183, 255, ${(0.55 * pAtten).toFixed(3)})`;
            ctx.fillText('·', pulseX, pulseY);
          }
        }
      });

      // 2. Glowing Parabolic Mach Bow-Shockwave (Primary Background Feature)
      // Leading edge shockwave wrapping around the crown of the enlarged glass dome
      const shockCrownU = 175 * scale + 36 * scale;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.65)';
      ctx.beginPath();
      for (let vStep = -300 * scale; vStep <= 300 * scale; vStep += 8) {
        const uStep = shockCrownU - (0.0028 / scale) * (vStep * vStep);
        const sx = bulbCenterX + uStep * dirX + vStep * perpX;
        const sy = bulbCenterY + uStep * dirY + vStep * perpY;
        if (vStep === -300 * scale) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Secondary Compression Shockwave (28px behind)
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(130, 183, 255, 0.32)';
      ctx.beginPath();
      for (let vStep = -280 * scale; vStep <= 280 * scale; vStep += 10) {
        const uStep = shockCrownU - 28 * scale - (0.0028 / scale) * (vStep * vStep);
        const sx = bulbCenterX + uStep * dirX + vStep * perpX;
        const sy = bulbCenterY + uStep * dirY + vStep * perpY;
        if (vStep === -280 * scale) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Shimmering ASCII shock glyphs along the leading shockwave
      ctx.font = "9px 'Geist Mono', monospace";
      for (let vStep = -240 * scale; vStep <= 240 * scale; vStep += 16) {
        const uStep = shockCrownU - (0.0028 / scale) * (vStep * vStep);
        const sx = bulbCenterX + uStep * dirX + vStep * perpX;
        const sy = bulbCenterY + uStep * dirY + vStep * perpY;

        const shockRipple = Math.sin(Math.abs(vStep) * 0.05 - animTime * 6.0);
        const shockAlpha = (0.55 + shockRipple * 0.25).toFixed(2);
        const glyph = vStep < 0 ? '\\' : (vStep > 0 ? '/' : '|');

        ctx.fillStyle = Math.random() > 0.4 ? `rgba(243, 239, 231, ${shockAlpha})` : `rgba(130, 183, 255, ${shockAlpha})`;
        ctx.fillText(glyph, sx, sy);
      }

      // =========================================================================
      // LAYER 4: 10X RESOLUTION 3D VOLUMETRIC PEAR-SHAPED ASCII LIGHTBULB + DNA
      // =========================================================================

      // Dedicated Internal Incandescent Filament Glow Chamber (Expanded for 350px Bulb)
      // Backlights the DNA double-helix with radiant amber, gold, and cyan energy
      const dnaGlowU = 0.10 * bulbRadius;
      const dnaGlowX = bulbCenterX + dnaGlowU * dirX;
      const dnaGlowY = bulbCenterY + dnaGlowU * dirY;
      const dnaGlowRadius = 145 * scale;

      const filamentGlow = ctx.createRadialGradient(
        dnaGlowX,
        dnaGlowY,
        12 * scale,
        dnaGlowX,
        dnaGlowY,
        dnaGlowRadius
      );
      filamentGlow.addColorStop(0, 'rgba(255, 133, 71, 0.35)');
      filamentGlow.addColorStop(0.35, 'rgba(245, 217, 152, 0.22)');
      filamentGlow.addColorStop(0.70, 'rgba(130, 183, 255, 0.10)');
      filamentGlow.addColorStop(1, 'rgba(7, 11, 18, 0.0)');

      ctx.fillStyle = filamentGlow;
      ctx.beginPath();
      ctx.arc(dnaGlowX, dnaGlowY, dnaGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `${cellH - 1}px 'Geist Mono', 'JetBrains Mono', 'Courier New', monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      // 3D DNA Double-Helix Parameters (Biological B-DNA Asymmetry & High Amplitude)
      const helixCycle = animTime * 2.8;
      // Expanded amplitude: 62px scale (124px-130px wide double helix - bold, unmistakable!)
      const baseHelixAmp = 62 * scale;
      const strandWaveLen = 210 * scale;
      const strandK = (3.2 * Math.PI * 2.0) / strandWaveLen; // 3.2 full helical turns
      const rungSpacing = 13.5 * scale; // Spacing along axial u for base-pair rungs (~20 rungs!)

      // Scan Bounding Grid of Enlarged Bulb and Collimated Exhaust Wake
      const minX = Math.max(0, Math.floor((bulbCenterX - (isMobile ? 320 : 640)) / cellW) * cellW);
      const maxX = Math.min(w, Math.ceil((bulbCenterX + 280 * scale) / cellW) * cellW);
      const minY = Math.max(0, Math.floor((bulbCenterY - 280 * scale) / cellH) * cellH);
      const maxY = Math.min(h, Math.ceil((bulbCenterY + (isMobile ? 420 : 680)) / cellH) * cellH);

      for (let py = minY; py <= maxY; py += cellH) {
        for (let px = minX; px <= maxX; px += cellW) {
          // Zero-Collision Guards on Mobile
          // Protect top-right wheel menu trigger
          if (isMobile && px > w - 85 && py < 95) {
            continue;
          }
          // Protect headline text block
          if (isMobile && px < w * 0.62 && py > h * 0.22) {
            continue;
          }

          // Transform (px, py) to bulb local coordinates (u, v)
          const dx = px - bulbCenterX;
          const dy = py - bulbCenterY;
          const u = dx * dirX + dy * dirY;
          const v = dx * perpX + dy * perpY;

          // Mouse perturbation factor
          let perturbation = 0;
          if (mouse.active) {
            const mDist = Math.hypot(px - mouse.x, py - mouse.y);
            if (mDist < 90) {
              perturbation = Math.exp(-mDist / 40);
            }
          }

          // -------------------------------------------------------------------
          // A. FOCUSED SUPERSONIC EXHAUST PLUME (u < -1.22 * bulbRadius)
          // Tightly collimated near base: clears left text by >175px!
          // -------------------------------------------------------------------
          const nozzleU = -1.22 * bulbRadius;
          if (u < nozzleU) {
            const exhaustDist = nozzleU - u;
            const maxExhaust = isMobile ? 240 : 360; // Focused, tight exhaust plume

            if (exhaustDist < maxExhaust) {
              // Collimated Plume Cone
              const plumeWidth = (22 + 0.15 * exhaustDist + Math.sqrt(exhaustDist) * 2.6) * scale;

              if (Math.abs(v) < plumeWidth) {
                // Standing Mach Shock Diamonds (4 Periodic Compression Nodes)
                const shockNodeDist = exhaustDist / (40 * scale);
                const isMachDiamond = Math.abs(Math.sin(shockNodeDist * Math.PI)) < 0.26 && exhaustDist < 200 * scale;

                // High-velocity advecting exhaust flow
                const flowOffset = exhaustDist - animTime * 380;
                const turbulence =
                  Math.sin(flowOffset * 0.06 + v * 0.10) *
                  Math.cos(flowOffset * 0.04 - v * 0.08);

                const radialFactor = 1.0 - Math.abs(v) / plumeWidth;
                const distDecay = Math.exp(-exhaustDist / (isMobile ? 150 : 230));
                const intensity = Math.max(0, radialFactor * distDecay + turbulence * 0.15 * distDecay);

                if (intensity > 0.03 || isMachDiamond || perturbation > 0.08) {
                  let char = '.';
                  let color = 'rgba(167, 178, 195, 0.25)';

                  if (perturbation > 0.08) {
                    char = RAMP_DNA_BASES[safeMod(animTime * 15 + px + py, 4)];
                    color = '#F5D998';
                  } else if (isMachDiamond && Math.abs(v) < 16 * scale) {
                    // Standing Mach Shock Diamond (Blazing White-Gold)
                    char = '@';
                    color = '#FFFFFF';
                  } else if (exhaustDist < 85 * scale) {
                    // Near-Nozzle Core
                    const coreIdx = Math.floor((1 - intensity) * (RAMP_EXHAUST.length - 1));
                    char = RAMP_EXHAUST[Math.max(0, Math.min(RAMP_EXHAUST.length - 1, coreIdx))];
                    color = intensity > 0.65 ? '#F5D998' : '#FF6B35';
                  } else if (exhaustDist < 210 * scale) {
                    // Mid Stream
                    const midIdx = Math.floor((1 - intensity) * (RAMP_EXHAUST.length - 1));
                    char = RAMP_EXHAUST[Math.max(0, Math.min(RAMP_EXHAUST.length - 1, midIdx))];
                    color = intensity > 0.4 ? '#FF8547' : 'rgba(255, 107, 53, 0.75)';
                  } else {
                    // Dissipating Ember Sparks
                    char = intensity > 0.14 ? '+' : (intensity > 0.06 ? ':' : '·');
                    const alpha = Math.min(0.48, intensity * 0.9).toFixed(2);
                    color = `rgba(167, 178, 195, ${alpha})`;
                  }

                  ctx.fillStyle = color;
                  ctx.fillText(char, px, py);
                  continue;
                }
              }
            }
          }

          // -------------------------------------------------------------------
          // B. ANATOMICALLY ACCURATE PEAR-SHAPED BULB & CONTINUOUS 3D DNA HELIX
          // -------------------------------------------------------------------
          const vNorm = u / bulbRadius;
          const { rNorm, zone } = getPearProfile(vNorm);

          if (rNorm > 0) {
            const actualHalfW = rNorm * bulbRadius;
            const rCellNorm = Math.abs(v) / actualHalfW;

            // 1. Machined Edison Screw Base & Ceramic Nozzle Collar
            if (zone === 'screw' || zone === 'nozzle') {
              if (rCellNorm <= 1.05) {
                const isBaseEdge = rCellNorm >= 0.88;
                let char = '=';
                let color = '#94A3B8';

                if (perturbation > 0.1) {
                  char = RAMP_DNA_BASES[safeMod(animTime * 12 + px, 4)];
                  color = '#F5D998';
                } else if (zone === 'nozzle') {
                  char = '@';
                  color = '#FFFFFF';
                } else if (isBaseEdge) {
                  char = v < 0 ? '@' : '#';
                  color = v < 0 ? '#CBD5E1' : '#64748B'; // Specular highlight on left lit side
                } else {
                  // Corrugated thread ridge fluting (5 distinct thread ridges)
                  const threadPhase = Math.sin(((vNorm + 1.10) / 0.35) * 10.0 * Math.PI);
                  char = threadPhase > 0 ? '%' : '=';
                  color = threadPhase > 0 ? '#E2E8F0' : '#475569';
                }

                ctx.fillStyle = color;
                ctx.fillText(char, px, py);
                continue;
              }
            }

            // 2. Continuous 3D Braided DNA Double-Helix Filament (Inside Glass Dome/Neck)
            let drewFilament = false;
            if ((zone === 'dome' || zone === 'neck') && vNorm >= -0.74 && vNorm <= 0.84 && rCellNorm < 0.90) {
              // Lead-In Nickel/Molybdenum Support Wires rising from Edison stem
              if (vNorm < -0.52) {
                const wireV = 22 * scale;
                if (Math.abs(v - wireV) < 3.6 || Math.abs(v + wireV) < 3.6) {
                  const isHook = vNorm >= -0.55 && vNorm <= -0.52;
                  ctx.fillStyle = isHook ? '#F5D998' : '#94A3B8';
                  ctx.fillText(isHook ? 'o' : '│', px, py);
                  continue;
                }
              }

              // Responsive amplitude tailored to bulb envelope (slight taper in neck)
              const localAmp = baseHelixAmp * (zone === 'dome' ? 1.05 : 0.85);

              // Two Continuous, Unbroken Helical Strands with Biological B-DNA Asymmetry
              const thetaStrand1 = (u + 0.65 * bulbRadius) * strandK - helixCycle;
              const vStrand1 = Math.sin(thetaStrand1) * localAmp;
              const zStrand1 = Math.cos(thetaStrand1); // +z = front, -z = rear

              // Biological B-DNA major/minor groove phase shift (major groove ~240°, minor groove ~120°)
              const thetaStrand2 = thetaStrand1 + Math.PI + 0.32 * Math.sin(thetaStrand1);
              const vStrand2 = Math.sin(thetaStrand2) * localAmp;
              const zStrand2 = Math.cos(thetaStrand2);

              const dist1 = Math.abs(v - vStrand1);
              const dist2 = Math.abs(v - vStrand2);

              // Continuous 3-layer glowing backbone ribbon (up to 7.8px half-width)
              const strandThreshold = 7.8 * scale;
              if (dist1 < strandThreshold || dist2 < strandThreshold) {
                const isStrand1 = dist1 < dist2;
                const zDepth = isStrand1 ? zStrand1 : zStrand2;
                const distToBackbone = isStrand1 ? dist1 : dist2;

                let char = '@';
                let color = '#FFFFFF';

                if (perturbation > 0.05) {
                  char = RAMP_DNA_BASES[safeMod(animTime * 18 + px, 4)];
                  color = '#F5D998';
                } else if (zDepth > 0.10) {
                  // FRONT-FACING STRAND: 3-Layer Incandescent White-Gold Core
                  if (distToBackbone < 2.6 * scale) {
                    char = zDepth > 0.6 ? '@' : '8';
                    color = '#FFFFFF';
                  } else if (distToBackbone < 5.2 * scale) {
                    char = '#';
                    color = '#FFF2B2';
                  } else {
                    char = '%';
                    color = '#F5D998';
                  }
                } else {
                  // REAR-FACING STRAND: 3-Layer Saturated Flame Orange & Tangerine
                  if (distToBackbone < 2.6 * scale) {
                    char = zDepth < -0.5 ? '$' : 'S';
                    color = '#FF6B35';
                  } else if (distToBackbone < 5.2 * scale) {
                    char = '&';
                    color = '#FF8547';
                  } else {
                    char = '+';
                    color = 'rgba(255, 107, 53, 0.85)';
                  }
                }

                ctx.fillStyle = color;
                ctx.fillText(char, px, py);
                drewFilament = true;
                continue;
              }

              // Base-Pair Rungs with Hydrogen Bonds (A═T, C≡G, T═A, G≡C)
              // Analytical spacing ensures EVERY rung across the height is rendered continuously (~20-22 rungs!)
              const nearestRungIdx = Math.round(u / rungSpacing);
              const rungU = nearestRungIdx * rungSpacing;
              const distToRungAxial = Math.abs(u - rungU);

              // Active range for rungs along the double helix
              if (distToRungAxial < 5.4 * scale && u > -0.54 * bulbRadius && u < 0.82 * bulbRadius) {
                const minV = Math.min(vStrand1, vStrand2);
                const maxV = Math.max(vStrand1, vStrand2);
                const rungSpan = maxV - minV;

                // Only render rung if between the two helical backbones
                if (v >= minV - 1.2 && v <= maxV + 1.2 && rungSpan > 10.0 * scale) {
                  const rungFrac = (v - minV) / rungSpan;
                  const pairIdx = safeMod(nearestRungIdx, 4);

                  let rungChar = '═';
                  let rungColor = '#82B7FF';

                  // Base assignment based on pair index:
                  // 0: A ═ T
                  // 1: C ≡ G
                  // 2: T ═ A
                  // 3: G ≡ C
                  if (rungFrac < 0.28) {
                    // Left base
                    if (pairIdx === 0) { rungChar = 'A'; rungColor = '#F5D998'; }
                    else if (pairIdx === 1) { rungChar = 'C'; rungColor = '#FF8547'; }
                    else if (pairIdx === 2) { rungChar = 'T'; rungColor = '#82B7FF'; }
                    else { rungChar = 'G'; rungColor = '#34D399'; }
                  } else if (rungFrac >= 0.28 && rungFrac < 0.40) {
                    // Left connector
                    rungChar = '-';
                    rungColor = pairIdx % 2 === 0 ? '#F5D998' : '#FF8547';
                  } else if (rungFrac > 0.72) {
                    // Right complementary base
                    if (pairIdx === 0) { rungChar = 'T'; rungColor = '#82B7FF'; }
                    else if (pairIdx === 1) { rungChar = 'G'; rungColor = '#34D399'; }
                    else if (pairIdx === 2) { rungChar = 'A'; rungColor = '#F5D998'; }
                    else { rungChar = 'C'; rungColor = '#FF8547'; }
                  } else if (rungFrac > 0.60 && rungFrac <= 0.72) {
                    // Right connector
                    rungChar = '-';
                    rungColor = pairIdx % 2 === 0 ? '#82B7FF' : '#34D399';
                  } else {
                    // Central Hydrogen Bond (double bond for A-T, triple bond for C-G)
                    // Animated electron resonance pulse
                    const bondPulse = Math.sin(animTime * 8.0 + nearestRungIdx * 1.5);
                    if (bondPulse > 0.75) {
                      rungChar = '•';
                      rungColor = '#FFFFFF';
                    } else if (pairIdx === 0 || pairIdx === 2) {
                      rungChar = '═';
                      rungColor = '#F5D998';
                    } else {
                      rungChar = '≡';
                      rungColor = '#82B7FF';
                    }
                  }

                  ctx.fillStyle = rungColor;
                  ctx.fillText(rungChar, px, py);
                  drewFilament = true;
                  continue;
                }
              }

              if (drewFilament) continue;

              // Quantum Energy Spark Field & Vacuum Radiance around the helix
              const distToHelixCenter = Math.hypot(v, (u - 0.1 * bulbRadius) * 0.32);
              if (distToHelixCenter < 80 * scale) {
                const radianceT = 1.0 - distToHelixCenter / (80 * scale);
                // Quantum photon spark
                const sparkSeed = Math.sin(px * 12.9898 + py * 78.233 + animTime * 4.0);
                if (sparkSeed > 0.88) {
                  const sparkChar = sparkSeed > 0.96 ? '*' : (sparkSeed > 0.92 ? '+' : '·');
                  const sparkColor = sparkSeed > 0.94 ? '#F5D998' : 'rgba(130, 183, 255, 0.75)';
                  ctx.fillStyle = sparkColor;
                  ctx.fillText(sparkChar, px, py);
                  continue;
                }

                if (Math.random() > 0.82) {
                  const glowColor = Math.random() > 0.40
                    ? `rgba(255, 107, 53, ${(0.22 * radianceT).toFixed(3)})`
                    : `rgba(130, 183, 255, ${(0.18 * radianceT).toFixed(3)})`;
                  ctx.fillStyle = glowColor;
                  ctx.fillText('·', px, py);
                  continue;
                }
              }
            }

            // 3. Delicate Multi-Graded Glass Envelope Shading
            if (rCellNorm <= 1.02) {
              // Outer 1-cell crisp specular rim (rCellNorm 0.93 - 1.02)
              if (rCellNorm >= 0.93) {
                let char = '#';
                let color = '#F3EFE7';

                if (perturbation > 0.1) {
                  char = RAMP_DENSITY[safeMod(perturbation * 8, RAMP_DENSITY.length)];
                  color = '#F5D998';
                } else if (v < 0) {
                  // Upper-left lit side: high contrast specular ivory
                  char = rCellNorm > 0.97 ? '@' : '%';
                  color = '#F3EFE7';
                } else {
                  // Lower-right shadow side: technical blue / silver
                  char = rCellNorm > 0.97 ? '*' : '+';
                  color = '#82B7FF';
                }

                ctx.fillStyle = color;
                ctx.fillText(char, px, py);
                continue;
              }

              // Inner bevel transition (rCellNorm 0.85 - 0.93)
              if (rCellNorm >= 0.85) {
                ctx.fillStyle = 'rgba(243, 239, 231, 0.25)';
                ctx.fillText(rCellNorm > 0.90 ? ':' : '.', px, py);
                continue;
              }

              // Delicate Crescent Specular Highlight Ribbon along upper-left perimeter curve
              // Refined to NOT collide with internal DNA filament!
              const isCrescentSpecular =
                vNorm >= 0.35 && vNorm <= 0.85 && (v / actualHalfW) >= -0.85 && (v / actualHalfW) <= -0.74;

              if (isCrescentSpecular) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
                ctx.fillText('"', px, py);
                continue;
              }

              // Interior Glass Sheen (rCellNorm < 0.85)
              // Subtle curved glass feel without obstructing internal DNA filament
              const glassSheen = Math.sin(px * 0.25 + py * 0.25 + animTime * 0.3);
              if (glassSheen > 0.90) {
                ctx.fillStyle = 'rgba(167, 178, 195, 0.08)';
                ctx.fillText('·', px, py);
              }
            }
          }
        }
      }

      ctx.restore();

      if (!isReduced) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, isReduced]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0">
      {/* Full-Bleed High-Density Micro-ASCII + CFD Flow-Field + Blueprint Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        aria-label="High-Visibility Concept D Hybrid CFD Wind-Tunnel, Mach Bow-Shockwave, and 3D Volumetric ASCII DNA Lightbulb Engine"
      />
    </div>
  );
};

export default AsciiDnaLightbulbCanvas;
