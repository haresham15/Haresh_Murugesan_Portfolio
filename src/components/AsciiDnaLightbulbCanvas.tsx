import React, { useRef, useEffect, useState } from 'react';
import { useMotionPreference } from './MotionPreference';

export const AsciiDnaLightbulbCanvas: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, clientY: 300 });

  // Pause rendering when canvas is scrolled off-screen
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

  // Track mouse coordinates for interactive elevation ruler and anisotropic wind perturbation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
        clientY: e.clientY,
      };
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const invSqrt2 = Math.SQRT1_2;
    const dirX = invSqrt2;
    const dirY = -invSqrt2;
    const perpX = invSqrt2;
    const perpY = invSqrt2;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Polynomial smooth-minimum for pear-shaped dome/neck SDF (blending without step-gap)
    const smin = (a: number, b: number, k: number): number => {
      const h = Math.max(k - Math.abs(a - b), 0.0) / k;
      return Math.min(a, b) - h * h * k * 0.25;
    };

    // Pre-calculate 22 continuous curved streamline ribbons
    const STREAMLINE_COUNT = 22;
    const streamlineOffsets = Array.from({ length: STREAMLINE_COUNT }, (_, i) => {
      return -520 + (i * 1080) / (STREAMLINE_COUNT - 1);
    });

    let startTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const animTime = isReduced ? 0 : (now - startTime) * 0.001;
      const isMobile = w < 768;

      // Positioning: Bulb center cx = 0.72 * W, cy = 0.37 * H
      const bulbCx = isMobile ? w * 0.78 : w * 0.72;
      const bulbCy = isMobile ? h * 0.38 : h * 0.37;
      const R = Math.min(w, h) * (isMobile ? 0.21 : 0.195);

      // Trajectory Launch Origin: ox = 0.34 * W, oy = 0.78 * H
      const ox = isMobile ? w * 0.28 : w * 0.34;
      const oy = isMobile ? h * 0.82 : h * 0.78;

      // =======================================================================
      // 1. CONCEPT D HYBRID WIND-TUNNEL & ORBITAL BLUEPRINT
      // =======================================================================

      // A. Ambient Volumetric Glow Wells (Cobalt & Incandescent Red-Orange)
      const apexHalo = ctx.createRadialGradient(bulbCx, bulbCy, 20, bulbCx, bulbCy, R * 3.2);
      apexHalo.addColorStop(0, 'rgba(37, 99, 235, 0.16)');
      apexHalo.addColorStop(0.35, 'rgba(21, 56, 117, 0.12)');
      apexHalo.addColorStop(0.7, 'rgba(11, 30, 64, 0.06)');
      apexHalo.addColorStop(1, 'transparent');
      ctx.fillStyle = apexHalo;
      ctx.fillRect(0, 0, w, h);

      // Warm launch well behind lower-left origin
      const originGlow = ctx.createRadialGradient(ox, oy, 10, ox, oy, 260);
      originGlow.addColorStop(0, 'rgba(255, 40, 0, 0.14)');
      originGlow.addColorStop(0.4, 'rgba(21, 56, 117, 0.08)');
      originGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = originGlow;
      ctx.fillRect(0, 0, w, h);

      // B. Concentric Orbital Protractor Rings (Centered on Bulb: r = 150, 245, 375, 560px)
      const ringRadii = [150, 245, 375, 560];
      ringRadii.forEach((rad, idx) => {
        const ringRad = rad * (isMobile ? 0.7 : 1.0);
        ctx.beginPath();
        ctx.arc(bulbCx, bulbCy, ringRad, 0, Math.PI * 2);
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(37, 99, 235, 0.22)' : 'rgba(200, 210, 224, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 5° minor ticks & 15° major ticks on the r = 245px ring
        if (idx === 1 && !isMobile) {
          for (let deg = 0; deg < 360; deg += 5) {
            const radAngle = (deg * Math.PI) / 180;
            const isMajor = deg % 15 === 0;
            const tickLen = isMajor ? 9 : 4;
            const rIn = ringRad - tickLen;
            const rOut = ringRad;
            const x1 = bulbCx + Math.cos(radAngle) * rIn;
            const y1 = bulbCy + Math.sin(radAngle) * rIn;
            const x2 = bulbCx + Math.cos(radAngle) * rOut;
            const y2 = bulbCy + Math.sin(radAngle) * rOut;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = isMajor ? 'rgba(255, 40, 0, 0.45)' : 'rgba(200, 210, 224, 0.22)';
            ctx.lineWidth = isMajor ? 1.2 : 0.8;
            ctx.stroke();
          }
        }
      });

      // C. 45.0° Launch Corridor & Lower-Left Origin Reticle
      // Primary 45.0° Trajectory Axis Line
      const axisLen = Math.max(w, h) * 1.6;
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(ox - dirX * 120, oy - dirY * 120);
      ctx.lineTo(ox + dirX * axisLen, oy + dirY * axisLen);
      ctx.strokeStyle = 'rgba(255, 40, 0, 0.30)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Parallel Corridor Rails (±130px) with perpendicular ticks every 64px
      [-130, 130].forEach((offset) => {
        const railOffset = offset * (isMobile ? 0.65 : 1.0);
        const rx1 = ox + perpX * railOffset - dirX * 80;
        const ry1 = oy + perpY * railOffset - dirY * 80;
        const rx2 = ox + perpX * railOffset + dirX * axisLen;
        const ry2 = oy + perpY * railOffset + dirY * axisLen;

        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Perpendicular station ticks every 64px
        for (let s = 0; s < axisLen; s += 64) {
          const tx = rx1 + dirX * s;
          const ty = ry1 + dirY * s;
          ctx.beginPath();
          ctx.moveTo(tx - perpX * 4, ty - perpY * 4);
          ctx.lineTo(tx + perpX * 4, ty + perpY * 4);
          ctx.strokeStyle = 'rgba(200, 210, 224, 0.25)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Concentric Origin Circles (r = 24, 52px) and 45° Protractor Arc (Zero Text Strings!)
      ctx.beginPath();
      ctx.arc(ox, oy, 24, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ox, oy, 52, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 210, 224, 0.20)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 45° Protractor Arc
      ctx.beginPath();
      ctx.arc(ox, oy, 38, -Math.PI * 0.25, 0);
      ctx.strokeStyle = 'rgba(255, 40, 0, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // D. Far-Left Vertical Elevation Ruler (x = 24px)
      if (!isMobile) {
        const rulerX = 24;
        ctx.beginPath();
        ctx.moveTo(rulerX, 40);
        ctx.lineTo(rulerX, h - 40);
        ctx.strokeStyle = 'rgba(200, 210, 224, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let y = 50; y < h - 40; y += 20) {
          const isMajor = (y - 50) % 60 === 0;
          ctx.beginPath();
          ctx.moveTo(rulerX, y);
          ctx.lineTo(rulerX + (isMajor ? 10 : 4), y);
          ctx.strokeStyle = isMajor ? 'rgba(255, 40, 0, 0.35)' : 'rgba(200, 210, 224, 0.18)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Interactive #FF2800 diamond marker tracking clientY
        const markerY = Math.max(50, Math.min(h - 50, mouseRef.current.clientY || 300));
        ctx.beginPath();
        ctx.moveTo(rulerX, markerY - 5);
        ctx.lineTo(rulerX + 6, markerY);
        ctx.lineTo(rulerX, markerY + 5);
        ctx.lineTo(rulerX - 6, markerY);
        ctx.closePath();
        ctx.fillStyle = '#FF2800';
        ctx.fill();
      }

      // E. Continuous Aerodynamic CFD Streamlines & Parabolic Mach Bow-Shockwave
      // 22 Streamline Ribbons flowing from top-right to bottom-left (-45°)
      ctx.font = '8px monospace';
      streamlineOffsets.forEach((off, idx) => {
        // Streamline baseline along -45° flow
        const startX = bulbCx + perpX * off + dirX * 600;
        const startY = bulbCy + perpY * off + dirY * 600;
        const endX = bulbCx + perpX * off - dirX * 900;
        const endY = bulbCy + perpY * off - dirY * 900;

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        // Smooth deflection around Mach cone
        const steps = 30;
        for (let s = 1; s <= steps; s++) {
          const st = s / steps;
          const currX = startX + (endX - startX) * st;
          const currY = startY + (endY - startY) * st;

          // Distance to bulb center
          const distToBulb = Math.hypot(currX - bulbCx, currY - bulbCy);
          const deflect = distToBulb < R * 1.5 ? Math.sin((1 - distToBulb / (R * 1.5)) * Math.PI) * 22 : 0;
          const defX = currX + perpX * (off > 0 ? deflect : -deflect);
          const defY = currY + perpY * (off > 0 ? deflect : -deflect);

          ctx.lineTo(defX, defY);
        }

        ctx.strokeStyle = idx % 3 === 0 ? 'rgba(37, 99, 235, 0.16)' : 'rgba(200, 210, 224, 0.08)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Pulse particles (·, :, -)
        if (!isReduced) {
          const pulsePhase = (animTime * 1.2 + idx * 0.18) % 1;
          const px = startX + (endX - startX) * pulsePhase;
          const py = startY + (endY - startY) * pulsePhase;
          const glyph = idx % 2 === 0 ? '·' : ':';
          ctx.fillStyle = idx % 3 === 0 ? '#2563EB' : '#C8D2E0';
          ctx.fillText(glyph, px, py);
        }
      });

      // Ahead of bulb dome (v = +0.92): Double Parabolic Mach Bow-Shockwave (38° cone angle)
      // Cone apex at bulbCx + dirX * (R * 0.95), bulbCy + dirY * (R * 0.95)
      const shockApexX = bulbCx + dirX * (R * 1.05);
      const shockApexY = bulbCy + dirY * (R * 1.05);

      [0, 18].forEach((offsetDist, shockIdx) => {
        ctx.beginPath();
        const shockSteps = 24;
        const span = 420;
        for (let i = -shockSteps; i <= shockSteps; i++) {
          const tNorm = i / shockSteps;
          const perpDist = tNorm * span;
          // Parabolic curve opening back along -dir
          const backDist = offsetDist + Math.pow(Math.abs(tNorm), 1.6) * 180;
          const sx = shockApexX + perpX * perpDist - dirX * backDist;
          const sy = shockApexY + perpY * perpDist - dirY * backDist;
          if (i === -shockSteps) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = shockIdx === 0 ? 'rgba(37, 99, 235, 0.75)' : 'rgba(230, 236, 245, 0.55)';
        ctx.lineWidth = shockIdx === 0 ? 1.8 : 1.0;
        ctx.stroke();
      });

      // =======================================================================
      // 2. 8px x 10px MICRO-ASCII 3D PEAR LIGHTBULB & CONTINUOUS BRAIDED DNA
      // =======================================================================
      const cellW = 8;
      const cellH = 10;
      ctx.font = `${cellH}px "Geist Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Scan bounding box around bulb
      const halfBox = R * 2.6;
      const minX = Math.floor((bulbCx - halfBox) / cellW) * cellW;
      const maxX = Math.ceil((bulbCx + halfBox) / cellW) * cellW;
      const minY = Math.floor((bulbCy - halfBox) / cellH) * cellH;
      const maxY = Math.ceil((bulbCy + halfBox) / cellH) * cellH;

      for (let py = minY; py <= maxY; py += cellH) {
        for (let px = minX; px <= maxX; px += cellW) {
          const dx = px - bulbCx;
          const dy = py - bulbCy;

          // Normalized coordinates
          const normDx = dx / R;
          const normDy = dy / R;

          // Rotated 45° coordinates:
          // v runs along 45° launch axis (+v is dome, -v is Edison base)
          // u runs perpendicular (u < 0 lit upper-left, u > 0 shadow lower-right)
          const v = (normDx - normDy) * invSqrt2;
          const u = (normDx + normDy) * invSqrt2;

          // -------------------------------------------------------------------
          // A. SUPERSONIC -45° THRUST PLUME & 4 MACH SHOCK DIAMONDS (v < -0.95)
          // -------------------------------------------------------------------
          if (v < -0.92 && v > -2.2) {
            const plumeWidth = 0.28 + Math.abs(v + 0.92) * 0.12;
            if (Math.abs(u) <= plumeWidth) {
              // 4 Mach shock diamonds along plume
              const diamondPhase = Math.sin((v + animTime * 3.5) * 14);
              const isDiamond = Math.abs(diamondPhase) > 0.65;
              const char = isDiamond ? '@' : (Math.abs(u) < 0.1 ? '#' : '%');
              const color = isDiamond ? '#FFFFFF' : (Math.abs(u) < 0.12 ? '#FF2800' : '#153875');
              ctx.fillStyle = color;
              ctx.fillText(char, px, py);
              continue;
            }
          }

          // -------------------------------------------------------------------
          // B. EDISON SCREW BASE & CERAMIC COLLAR (v ∈ [-0.92, -0.55])
          // -------------------------------------------------------------------
          if (v >= -0.92 && v < -0.55) {
            const threadWidth = 0.35 + 0.04 * Math.sin(v * 36);
            if (Math.abs(u) <= threadWidth) {
              const isRidge = Math.sin(v * 36) > 0;
              const char = isRidge ? (u < 0 ? '@' : '#') : (u < 0 ? '=' : '-');
              const color = u < 0 ? '#E6ECF5' : '#64748B';
              ctx.fillStyle = color;
              ctx.fillText(char, px, py);
              continue;
            }
          }

          // Ceramic collar at base of threads
          if (v >= -1.02 && v < -0.92 && Math.abs(u) <= 0.29) {
            ctx.fillStyle = '#0B1E40';
            ctx.fillText('#', px, py);
            continue;
          }

          // -------------------------------------------------------------------
          // C. TRUE ANATOMICAL SMOOTH-MIN PEAR-SHAPED ENVELOPE SDF
          // -------------------------------------------------------------------
          // Upper sphere dome centered at v = 0.18, radius = 0.88
          const dDome = Math.hypot(u, v - 0.18) - 0.88;
          // Tapered neck from v = -0.55 to v = 0.05
          const neckT = Math.max(0, Math.min(1, (v + 0.55) / 0.60));
          const neckHalfWidth = 0.36 + 0.38 * neckT;
          const dNeck = Math.max(Math.abs(u) - neckHalfWidth, Math.abs(v + 0.25) - 0.32);
          // Seamless polynomial smooth minimum blend eliminating all step-gaps / C-rings
          const dGlass = smin(dDome, dNeck, 0.35);

          if (dGlass <= 0) {
            const edge = Math.abs(dGlass);

            // 1. CONTINUOUS 3D BRAIDED DOUBLE-HELIX DNA (Inside Envelope: v ∈ [-0.50, 0.80])
            let drewFilament = false;
            if (v >= -0.50 && v <= 0.80) {
              const helixFreq = 7.5;
              const helixAmp = 0.34 * (1 - 0.22 * Math.pow(Math.max(0, (-0.1 - v) / 0.45), 2));
              const phase1 = v * helixFreq - animTime * 2.8;
              const phase2 = phase1 + Math.PI;

              const u1 = helixAmp * Math.sin(phase1);
              const z1 = Math.cos(phase1);
              const u2 = helixAmp * Math.sin(phase2);
              const z2 = Math.cos(phase2);

              const dist1 = Math.abs(u - u1);
              const dist2 = Math.abs(u - u2);

              // Render Unbroken Sinusoidal Ribbons
              if (dist1 < 0.085 || dist2 < 0.085) {
                const isStrand1 = dist1 < dist2;
                const z = isStrand1 ? z1 : z2;
                const distToBackbone = isStrand1 ? dist1 : dist2;

                if (z > 0) {
                  // Foreground Strand: Blazing Chrome Silver & White (#FFFFFF, #E6ECF5) with #FF2800 outer glow
                  const char = distToBackbone < 0.035 ? '@' : (distToBackbone < 0.065 ? '#' : '$');
                  const color = z > 0.4 ? '#FFFFFF' : '#E6ECF5';
                  ctx.fillStyle = color;
                  ctx.fillText(char, px, py);
                } else {
                  // Background Strand: Sharp Reddish-Orange (#FF2800) using %, *, +
                  const char = distToBackbone < 0.035 ? '%' : (distToBackbone < 0.065 ? '*' : '+');
                  ctx.fillStyle = '#FF2800';
                  ctx.fillText(char, px, py);
                }
                drewFilament = true;
                continue;
              }

              // Horizontal Base-Pair Rungs (A═T, C≡G) bridging u1 and u2 in #2563EB and #FF4419
              if (
                Math.abs(Math.sin(v * helixFreq * 2)) < 0.28 &&
                u > Math.min(u1, u2) &&
                u < Math.max(u1, u2)
              ) {
                const minU = Math.min(u1, u2);
                const maxU = Math.max(u1, u2);
                const span = Math.max(0.001, maxU - minU);
                const rungT = (u - minU) / span;

                let rungChar = '═';
                let rungColor = '#2563EB';

                if (rungT > 0.35 && rungT < 0.65) {
                  rungChar = '═';
                  rungColor = '#2563EB';
                } else if (rungT <= 0.35) {
                  rungChar = 'A';
                  rungColor = '#FF4419';
                } else {
                  rungChar = 'T';
                  rungColor = '#2563EB';
                }

                ctx.fillStyle = rungColor;
                ctx.fillText(rungChar, px, py);
                drewFilament = true;
                continue;
              }
            }

            if (drewFilament) continue;

            // 2. GLASS ENVELOPE SURFACE SHADING & SPECULAR HIGHLIGHT
            // Specular highlight arc on upper-left dome
            if (u >= -0.65 && u <= -0.42 && v >= 0.45 && v <= 0.78) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillText('@', px, py);
              continue;
            }

            // Outer 1-cell Fresnel Rim (edge < 0.11)
            if (edge < 0.11) {
              const char = edge < 0.05 ? '@' : (edge < 0.08 ? '#' : '%');
              // Upper-left lit edge: bright #F4F6F9 / #C8D2E0; lower-right shadow: #2563EB
              const color = u < 0 ? '#F4F6F9' : '#2563EB';
              ctx.fillStyle = color;
              ctx.fillText(char, px, py);
              continue;
            }

            // Soft inner bevel (0.11 <= edge < 0.22)
            if (edge < 0.22) {
              const char = edge < 0.16 ? ':' : '.';
              ctx.fillStyle = 'rgba(200, 210, 224, 0.30)';
              ctx.fillText(char, px, py);
              continue;
            }

            // Interior glass sheen (0.07 alpha)
            if (Math.random() < 0.06) {
              ctx.fillStyle = 'rgba(37, 99, 235, 0.12)';
              ctx.fillText('.', px, py);
            }
          }
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, isReduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};

export default AsciiDnaLightbulbCanvas;
