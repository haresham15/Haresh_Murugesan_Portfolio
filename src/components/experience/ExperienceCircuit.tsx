import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useMotionPreference } from '../MotionPreference';

export interface SectorData {
  id: string;
  index: number;
  numeral: string;
  period: string;
  company: string;
  role: string;
  points: string;
  stack: string[];
  apexX: number;
  apexY: number;
  position: 'top' | 'bottom';
  p: number; // Normalized scroll progress at this sector
  t: number; // Spline path progress [0, 1]
}

export const SECTORS: SectorData[] = [
  {
    id: 'cas',
    index: 0,
    numeral: '01',
    period: 'SUMMER 2026',
    company: 'Chemical Abstracts Service (CAS)',
    role: 'AI & Software Development Intern — Data Analytics & Insights (ACE Team)',
    points:
      'Serverless AWS web applications, Model Context Protocol (MCP) agentic workflows, and fine-tuned LLM / RAG pipelines across 12 enterprise use cases.',
    stack: ['AWS Lambda', 'DynamoDB', 'S3', 'Python', 'TypeScript', 'MCP'],
    apexX: 1220,
    apexY: 340,
    position: 'bottom',
    p: 0.16,
    t: 0.199,
  },
  {
    id: 'osu-pathology',
    index: 1,
    numeral: '02',
    period: 'AUG 2026 – PRESENT',
    company: 'The Ohio State University',
    role: 'Undergraduate AI & Machine Learning Researcher — Digital Pathology',
    points:
      'Deep learning computer vision and automated spatial histopathology pipelines in Python and MATLAB for gigapixel Whole Slide Images.',
    stack: ['Python', 'PyTorch', 'OpenCV', 'MATLAB', 'Scikit-Image'],
    apexX: 2120,
    apexY: 680,
    position: 'top',
    p: 0.34,
    t: 0.362,
  },
  {
    id: 'cis-99p',
    index: 2,
    numeral: '03',
    period: 'FEB 2026 – PRESENT',
    company: 'Center for Innovation Strategies at OSU',
    role: 'Innovation Analyst (Onramp / 99P Labs)',
    points:
      'Campus mobility telemetry modeling, student survey analytics, and cross-disciplinary venture strategy.',
    stack: ['Python', 'R', 'GIS', 'Spatial Telemetry', 'Data Modeling'],
    apexX: 3020,
    apexY: 310,
    position: 'bottom',
    p: 0.51,
    t: 0.517,
  },
  {
    id: 'philocracy',
    index: 3,
    numeral: '04',
    period: 'DEC 2025 – PRESENT',
    company: 'Philocracy',
    role: 'Co-CEO & Technical Lead',
    points:
      'Leading executive strategy, community operations, and digital platform engineering for a student-led 501(c)(3) non-profit organization.',
    stack: ['Next.js', 'TypeScript', 'E-Commerce', 'Executive Strategy'],
    apexX: 3920,
    apexY: 690,
    position: 'top',
    p: 0.68,
    t: 0.671,
  },
  {
    id: 'syntinuum-vector',
    index: 4,
    numeral: '05',
    period: 'DEC 2025 – PRESENT',
    company: 'Syntinuum & VECTOR',
    role: 'Founder, Podcast Host & Engineering Syndicate Lead',
    points:
      'Producing interviews with startup CEOs and AI innovators on Syntinuum (100K+ impressions) and leading technical engineering cohorts through VECTOR.',
    stack: ['Next.js', 'Audio Engineering', 'Systems Architecture', 'Leadership'],
    apexX: 4820,
    apexY: 330,
    position: 'bottom',
    p: 0.85,
    t: 0.825,
  },
];

// Continuous Cubic-Bézier Spline Geometry (0 to 6000 World Units)
export const TRACK_PATH_D =
  'M 420 -40 L 420 220 C 420 440, 560 520, 820 520 L 980 520 C 1080 520, 1120 340, 1220 340 C 1320 340, 1380 580, 1480 580 C 1550 580, 1590 520, 1650 520 L 1850 520 C 1960 520, 2010 680, 2120 680 C 2230 680, 2400 520, 2550 520 L 2750 520 C 2860 520, 2910 310, 3020 310 C 3130 310, 3300 520, 3450 520 L 3650 520 C 3760 520, 3810 690, 3920 690 C 4030 690, 4200 520, 4350 520 L 4550 520 C 4660 520, 4710 330, 4820 330 C 4930 330, 5080 520, 5200 520 C 5420 520, 5520 640, 5520 840 L 5520 1040';

export const CURB_PATHS = [
  // Turn 01 inside curve (vertical to horizontal)
  { id: 'turn-01', d: 'M 444 260 C 444 420, 560 496, 780 496' },
  // Apex 01 curb (CAS)
  { id: 'apex-01', d: 'M 1140 324 C 1180 314, 1260 314, 1300 324' },
  // Apex 02 curb (OSU)
  { id: 'apex-02', d: 'M 2040 696 C 2080 706, 2160 706, 2200 696' },
  // Apex 03 curb (CIS)
  { id: 'apex-03', d: 'M 2940 294 C 2980 284, 3060 284, 3100 294' },
  // Apex 04 curb (Philocracy)
  { id: 'apex-04', d: 'M 3840 706 C 3880 716, 3960 716, 4000 706' },
  // Apex 05 curb (Syntinuum)
  { id: 'apex-05', d: 'M 4740 314 C 4780 304, 4860 304, 4900 314' },
  // Turn 06 inside curve (horizontal to downward)
  { id: 'turn-06', d: 'M 5240 544 C 5400 544, 5496 660, 5496 820' },
];

export const ExperienceCircuit: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const wakeLineRef = useRef<SVGPathElement>(null);
  const flameOuterRef = useRef<SVGPolygonElement>(null);
  const flameInnerRef = useRef<SVGPolygonElement>(null);
  const brakeLeftRef = useRef<SVGCircleElement>(null);
  const brakeRightRef = useRef<SVGCircleElement>(null);
  const vortexLeftRef = useRef<SVGLineElement>(null);
  const vortexRightRef = useRef<SVGLineElement>(null);

  // References to the 5 HTML stations and SVG leader lines
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leaderLineRefs = useRef<(SVGLineElement | null)[]>([]);

  const [activeSector, setActiveSector] = useState<number>(0);
  const [telemetry, setTelemetry] = useState({ progressPct: 0, speed: 0 });
  const { isReduced } = useMotionPreference();

  // Internal mutable state for 60fps RAF loop
  const kinematicsRef = useRef({
    smoothProgress: 0,
    rawProgress: 0,
    carT: 0,
    carX: 420,
    carY: -40,
    angle: 90,
    velocity: 0,
    prevVelocity: 0,
    totalPathLength: 6567,
    worldWidthPx: 0,
    wrapAround: null as {
      startTime: number;
      startT: number;
      targetT: number;
      targetP: number;
    } | null,
  });

  // Calculate world width on resize
  const updateWorldWidth = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    // 420vw on desktop (>=768px), 480vw on mobile (<768px)
    const multiplier = w < 768 ? 4.8 : 4.2;
    kinematicsRef.current.worldWidthPx = w * multiplier;
  }, []);

  // Set up path measurement and resize handlers
  useEffect(() => {
    if (typeof window === 'undefined') return;
    updateWorldWidth();
    window.addEventListener('resize', updateWorldWidth);

    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) {
          kinematicsRef.current.totalPathLength = len;
          if (wakeLineRef.current) {
            wakeLineRef.current.style.strokeDasharray = `${len}`;
            wakeLineRef.current.style.strokeDashoffset = `${len}`;
          }
        }
      } catch {
        // Fallback length already set
      }
    }

    return () => {
      window.removeEventListener('resize', updateWorldWidth);
    };
  }, [updateWorldWidth]);

  // Main 60fps / 120fps RAF Kinematics Loop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animFrameId: number;
    let lastActiveSector = 0;
    let lastProgressPct = -1;

    const tick = () => {
      const k = kinematicsRef.current;
      const section = sectionRef.current;
      const path = pathRef.current;
      const world = worldRef.current;
      const car = carRef.current;

      if (!section || !path || !world || !car) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const windowW = window.innerWidth;
      const scrollableDistance = Math.max(1, rect.height - windowH);

      // 1. Calculate raw normalized vertical scroll progress p in [0, 1]
      const raw = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
      k.rawProgress = raw;

      // 2. Smooth Lerp Progress Damping (or instant if prefers-reduced-motion)
      if (isReduced) {
        k.smoothProgress = raw;
        k.velocity = 0;
      } else {
        const diff = raw - k.smoothProgress;
        k.smoothProgress += diff * 0.11;
        k.velocity = Math.abs(diff);
      }

      const p = k.smoothProgress;
      const worldW = k.worldWidthPx > 0 ? k.worldWidthPx : windowW * 4.2;
      const maxCameraX = -(worldW - windowW);

      let cameraX = 0;
      let targetCarT = 0;

      // 3. Forward Wrap-Around Override or Normal Scroll Mapping
      if (k.wrapAround) {
        const { startTime, startT, targetT, targetP } = k.wrapAround;
        const now = performance.now();
        const elapsed = now - startTime;
        const totalDuration = 1250;

        if (elapsed < 500) {
          // Phase A: Blast forward off Turn 06 exit
          const progA = elapsed / 500;
          // Cubic ease-in surge
          const easeA = progA * progA;
          targetCarT = startT + easeA * (1.04 - startT);
          k.velocity = 0.045;
        } else if (elapsed < totalDuration) {
          // Phase B: Dive back in through Turn 01 into target apex
          const progB = (elapsed - 500) / (totalDuration - 500);
          // Cubic ease-out deceleration
          const easeB = 1 - Math.pow(1 - progB, 3);
          targetCarT = -0.04 + easeB * (targetT - (-0.04));
          k.velocity = Math.max(0.005, 0.04 * (1 - easeB));
        } else {
          // Wrap-around complete
          targetCarT = targetT;
          k.wrapAround = null;
        }

        // Keep camera tracking toward the target's cameraX
        const targetHProg = Math.max(0, Math.min(1, (targetP - 0.08) / 0.84));
        cameraX = -targetHProg * (worldW - windowW);
      } else {
        // Normal 3-Phase Perpendicular-Z Path Mapping
        if (p < 0.08) {
          // Phase 1: Vertical Drop & 90° Entry Turn (p in [0.00, 0.08])
          // Camera holds at x = 0
          cameraX = 0;
          const p1 = Math.max(0, p / 0.08);
          // Spline: t from 0.00 to 0.127 (Turn 01 exit at 820, 520)
          targetCarT = p1 * 0.127;
        } else if (p <= 0.92) {
          // Phase 2: Horizontal Grand Prix Pan (p in [0.08, 0.92])
          const hProg = (p - 0.08) / 0.84;
          cameraX = -hProg * (worldW - windowW);
          // Spline: t from 0.127 (Turn 01 exit) to 0.891 (Turn 06 entry at 5200, 520)
          targetCarT = 0.127 + hProg * (0.891 - 0.127);
        } else {
          // Phase 3: 90° Downward Exit Turn & Release (p in [0.92, 1.00])
          cameraX = maxCameraX;
          const p3 = Math.min(1, (p - 0.92) / 0.08);
          // Spline: t from 0.891 to 1.000 (Turn 06 downward exit at 5520, 1040)
          targetCarT = 0.891 + p3 * (1.000 - 0.891);
        }
      }

      k.carT = targetCarT;

      // 4. Sample (x, y) and tangent heading θ along <path id="zCircuitPath">
      const totalLen = k.totalPathLength;
      const clampedT = Math.max(0, Math.min(1, targetCarT));
      const dist = clampedT * totalLen;

      try {
        const pt = path.getPointAtLength(dist);
        const ptNext = path.getPointAtLength(Math.min(totalLen, dist + 2));
        const ptPrev = path.getPointAtLength(Math.max(0, dist - 2));

        k.carX = pt.x;
        k.carY = pt.y;

        // Compute tangent angle with atan2
        const rawAngle = (Math.atan2(ptNext.y - ptPrev.y, ptNext.x - ptPrev.x) * 180) / Math.PI;

        // Continuous unwrapping to avoid 360-degree rotation flips
        let angleDiff = rawAngle - k.angle;
        while (angleDiff < -180) angleDiff += 360;
        while (angleDiff > 180) angleDiff -= 360;
        k.angle += angleDiff;

        // 5. Apply GPU-accelerated transforms
        world.style.transform = `translate3d(${cameraX}px, 0, 0)`;
        car.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${k.angle}deg)`;
        car.setAttribute('data-progress', clampedT.toFixed(4));

        // 6. Dynamic racing wake slipstream
        if (wakeLineRef.current) {
          const wakeOffset = Math.max(0, totalLen * (1 - clampedT));
          wakeLineRef.current.style.strokeDashoffset = `${wakeOffset}`;
        }

        // 7. Deceleration & Apex Braking Glow Physics
        const nearestApexDist = Math.min(...SECTORS.map((s) => Math.abs(pt.x - s.apexX)));
        const isDecelerating = k.velocity < k.prevVelocity && k.velocity > 0.0002;
        const isBraking = isDecelerating && nearestApexDist < 360;
        k.prevVelocity = k.velocity;

        const brakeOpacity = isBraking ? '1' : '0.12';
        if (brakeLeftRef.current) brakeLeftRef.current.style.opacity = brakeOpacity;
        if (brakeRightRef.current) brakeRightRef.current.style.opacity = brakeOpacity;

        // 8. Afterburner Flame and Wingtip Vortex Physics
        const flameLength = Math.min(56, Math.max(8, k.velocity * 480));
        const flamePointsOuter = `-28,-4 ${-28 - flameLength},0 -28,4`;
        const flamePointsInner = `-28,-2 ${-28 - flameLength * 0.6},0 -28,2`;

        if (flameOuterRef.current) {
          flameOuterRef.current.setAttribute('points', flamePointsOuter);
          flameOuterRef.current.style.opacity = k.velocity > 0.0004 ? '1' : '0.2';
        }
        if (flameInnerRef.current) {
          flameInnerRef.current.setAttribute('points', flamePointsInner);
          flameInnerRef.current.style.opacity = k.velocity > 0.0004 ? '1' : '0.2';
        }

        const vortexLength = Math.min(75, k.velocity * 700);
        if (vortexLeftRef.current) {
          vortexLeftRef.current.setAttribute('x2', `${-32 - vortexLength}`);
          vortexLeftRef.current.style.opacity = k.velocity > 0.001 ? '0.7' : '0';
        }
        if (vortexRightRef.current) {
          vortexRightRef.current.setAttribute('x2', `${-32 - vortexLength}`);
          vortexRightRef.current.style.opacity = k.velocity > 0.001 ? '0.7' : '0';
        }

        // 9. Station Proximity Reveal & Leader Line Illumination (±0.10 normalized distance)
        let activeIdx = 0;
        let minApexDist = Infinity;

        SECTORS.forEach((sec, idx) => {
          const distToApex = Math.abs(pt.x - sec.apexX);
          if (distToApex < minApexDist) {
            minApexDist = distToApex;
            activeIdx = idx;
          }

          const isFocused = distToApex <= 500;
          const stationEl = stationRefs.current[idx];
          const lineEl = leaderLineRefs.current[idx];

          if (stationEl) {
            stationEl.style.opacity = isFocused ? '1' : '0.40';
            stationEl.style.transform = isFocused
              ? 'translateY(0px) scale(1)'
              : 'translateY(4px) scale(0.97)';
          }

          if (lineEl) {
            lineEl.style.opacity = isFocused ? '1' : '0.15';
            lineEl.setAttribute('stroke', isFocused ? '#FF2800' : 'rgba(200, 210, 224, 0.25)');
          }
        });

        // Update React state when active sector changes
        if (activeIdx !== lastActiveSector) {
          lastActiveSector = activeIdx;
          setActiveSector(activeIdx);
        }

        // Throttled telemetry updates
        const curPct = Math.round(p * 100);
        if (curPct !== lastProgressPct) {
          lastProgressPct = curPct;
          const approxKmh = Math.min(342, Math.round(180 + k.velocity * 2400));
          setTelemetry({ progressPct: curPct, speed: approxKmh });
        }
      } catch {
        // Safe catch for detached SVG
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [isReduced]);

  // Click-to-Sector Jump + Non-Reversing Forward Wrap-Around Override
  const handleSelectSector = useCallback(
    (targetIndex: number) => {
      if (typeof window === 'undefined' || !sectionRef.current) return;

      const targetSector = SECTORS[targetIndex];
      if (!targetSector) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const targetScrollY = window.scrollY + rect.top + targetSector.p * scrollableDistance;

      if (targetIndex < activeSector || targetSector.t < kinematicsRef.current.carT) {
        // Target is an earlier sector: trigger Non-Reversing Forward Wrap-Around Lap!
        kinematicsRef.current.wrapAround = {
          startTime: performance.now(),
          startT: kinematicsRef.current.carT,
          targetT: targetSector.t,
          targetP: targetSector.p,
        };
      }

      // Smooth scroll the document to the target sector's position
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    },
    [activeSector]
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      data-experience-circuit="true"
      className="relative w-full h-[460vh] select-none"
      aria-label="Engineering & Systems Experience Circuit"
    >
      {/* Inner Sticky Camera Viewport: Locks to screen while scrolling through the 460vh runway */}
      <div className="sticky top-0 left-0 w-full h-dvh overflow-hidden flex flex-col justify-between">
        
        {/* PERSISTENT MINIMAL STICKY HUD BAR (TOP) */}
        <div className="relative z-30 w-full px-6 sm:px-12 md:px-16 pt-8 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pointer-events-none">
          <div className="space-y-3 pointer-events-auto max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Experience.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7E8B9B] leading-relaxed hidden sm:block">
              Production software systems, clinical computer vision research, and technical leadership.
            </p>

            {/* Z-Scroll Progress Bar (Clickable Sector Navigation) */}
            <nav aria-label="Experience Sectors" className="pt-2 flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-mono">
              {SECTORS.map((sec, idx) => {
                const isActive = activeSector === idx;
                return (
                  <React.Fragment key={sec.id}>
                    <button
                      type="button"
                      data-experience-sector={idx}
                      onClick={() => handleSelectSector(idx)}
                      className={`transition-colors duration-200 cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:underline ${
                        isActive
                          ? 'text-[#FF2800] font-semibold'
                          : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <span>{sec.numeral}</span>
                      <span className="hidden md:inline">{sec.company.split(' ')[0]}</span>
                    </button>
                    {idx < SECTORS.length - 1 && (
                      <span className="text-[#18458B]/30 select-none">——</span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Minimal Telemetry Metadata */}
          <div className="hidden sm:block text-right font-mono text-[11px] text-[#7E8B9B] space-y-1">
            <div className="text-[#C8D2E0] uppercase tracking-wider">
              CIRCUIT // 420VW ORTHOGONAL Z-ENGINE
            </div>
            <div>
              SECTOR <span className="text-[#FF2800]">0{activeSector + 1}</span> OF 05
            </div>
            <div>
              VELOCITY: <span className="text-[#F4F6F9]">{telemetry.speed} KM/H</span>
            </div>
            <div>
              Z-PROGRESS: <span className="text-[#2563EB]">{telemetry.progressPct}%</span>
            </div>
          </div>
        </div>

        {/* TRANSLATING HORIZONTAL WORLD CONTAINER (420vw Desktop / 480vw Mobile) */}
        <div
          ref={worldRef}
          data-experience-track="true"
          className="absolute top-0 left-0 h-full w-[480vw] md:w-[420vw] will-change-transform pointer-events-none"
        >
          {/* THE 6000x1000 SVG MOTORSPORT TRACK WORLD */}
          <svg
            viewBox="0 0 6000 1000"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* Slipstream Racing Line Gradient */}
              <linearGradient id="racingWakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#FF2800" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF4419" stopOpacity="1" />
              </linearGradient>

              {/* Brake Disc Deceleration Glow Filter */}
              <filter id="brakeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Car Drop Shadow Filter */}
              <filter id="carDropShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.75" />
              </filter>
            </defs>

            {/* LAYER 1: Cobalt Atmospheric Halo & Machined-Silver Outer Barrier Rails */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="rgba(11, 30, 64, 0.52)"
              strokeWidth="74"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="rgba(200, 210, 224, 0.22)"
              strokeWidth="62"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* LAYER 2: Obsidian Tarmac Bed & Internal Track Hairline */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="#04070E"
              strokeWidth="56"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="rgba(24, 69, 139, 0.24)"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* LAYER 3: Serrated Reddish-Orange & Silver FIA Rumble Curbs */}
            {CURB_PATHS.map((curb) => (
              <g key={curb.id}>
                {/* Reddish-Orange teeth */}
                <path
                  d={curb.d}
                  fill="none"
                  stroke="#FF2800"
                  strokeWidth="10"
                  strokeDasharray="16 16"
                  strokeDashoffset="0"
                  strokeLinecap="butt"
                />
                {/* Machined-Silver teeth */}
                <path
                  d={curb.d}
                  fill="none"
                  stroke="#E6ECF5"
                  strokeWidth="10"
                  strokeDasharray="16 16"
                  strokeDashoffset="16"
                  strokeLinecap="butt"
                />
              </g>
            ))}

            {/* LAYER 4: Dynamic Illuminated Racing Line (Base + Live Slipstream Wake) */}
            <path
              d={TRACK_PATH_D}
              fill="none"
              stroke="rgba(37, 99, 235, 0.35)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              ref={wakeLineRef}
              d={TRACK_PATH_D}
              fill="none"
              stroke="url(#racingWakeGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Master Track Spline (Measured by SVG DOM API for Car Tangent Kinematics) */}
            <path
              id="zCircuitPath"
              ref={pathRef}
              data-experience-path="true"
              d={TRACK_PATH_D}
              fill="none"
              stroke="transparent"
              strokeWidth="1"
            />

            {/* Apex Ground Crosshairs & 1px Dashed Datum Leader Lines */}
            {SECTORS.map((sec, idx) => {
              const y1 = sec.position === 'bottom' ? sec.apexY + 12 : sec.apexY - 12;
              const y2 = sec.position === 'bottom' ? 540 : 360;
              return (
                <g key={`marker-${sec.id}`}>
                  {/* Subtle 9x9 Crosshair Fiducial at Apex */}
                  <line
                    x1={sec.apexX - 8}
                    y1={sec.apexY}
                    x2={sec.apexX + 8}
                    y2={sec.apexY}
                    stroke="#C8D2E0"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />
                  <line
                    x1={sec.apexX}
                    y1={sec.apexY - 8}
                    x2={sec.apexX}
                    y2={sec.apexY + 8}
                    stroke="#C8D2E0"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                  />

                  {/* 1px Dashed Leader Line connecting Apex Curb to Station Header */}
                  <line
                    ref={(el) => {
                      leaderLineRefs.current[idx] = el;
                    }}
                    x1={sec.apexX}
                    y1={y1}
                    x2={sec.apexX}
                    y2={y2}
                    stroke="#FF2800"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.2"
                    style={{ transition: 'opacity 0.25s ease, stroke 0.25s ease' }}
                  />
                </g>
              );
            })}

            {/* TOP-DOWN DNA-CORE AERO PROTOTYPE CAR (72px x 34px) */}
            <g
              id="aeroPrototypeCar"
              ref={carRef}
              data-experience-car="true"
              filter="url(#carDropShadow)"
              style={{ willChange: 'transform' }}
            >
              {/* Afterburner Exhaust Flame (Elongates when scrolling fast) */}
              <polygon
                ref={flameOuterRef}
                points="-28,-4 -44,0 -28,4"
                fill="#FF2800"
                opacity="0.8"
              />
              <polygon
                ref={flameInnerRef}
                points="-28,-2 -36,0 -28,2"
                fill="#E6ECF5"
                opacity="0.9"
              />

              {/* Wingtip Vortex Trails */}
              <line
                ref={vortexLeftRef}
                x1="-32"
                y1="-16"
                x2="-60"
                y2="-16"
                stroke="#2563EB"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0"
              />
              <line
                ref={vortexRightRef}
                x1="-32"
                y1="16"
                x2="-60"
                y2="16"
                stroke="#2563EB"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                opacity="0"
              />

              {/* Main Carbon Monocoque Chassis Tub */}
              <path
                d="M 34 0 L 26 -8 L 12 -12 L -14 -12 L -24 -10 L -28 -6 L -28 6 L -24 10 L -14 12 L 12 12 L 26 8 Z"
                fill="#070C16"
                stroke="#C8D2E0"
                strokeWidth="1"
              />

              {/* Front Aerodynamic Splitter Lip */}
              <path
                d="M 32 -15 L 36 -15 L 38 0 L 36 15 L 32 15 Z"
                fill="#FF2800"
              />

              {/* Front Wheels & Brake Discs */}
              <rect x="18" y="-17" width="8" height="4" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />
              <rect x="18" y="13" width="8" height="4" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />

              {/* Glowing Carbon-Ceramic Brake Discs (Illuminate during deceleration) */}
              <circle
                ref={brakeLeftRef}
                cx="22"
                cy="-15"
                r="2.5"
                fill="#FF2800"
                filter="url(#brakeGlow)"
                opacity="0.1"
              />
              <circle
                ref={brakeRightRef}
                cx="22"
                cy="15"
                r="2.5"
                fill="#FF2800"
                filter="url(#brakeGlow)"
                opacity="0.1"
              />

              {/* Rear Wheels */}
              <rect x="-20" y="-18" width="9" height="5" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />
              <rect x="-20" y="13" width="9" height="5" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />

              {/* Side Air Intakes */}
              <path d="M 6 -11 L 14 -11 L 12 -8 L 6 -8 Z" fill="#0B1E40" />
              <path d="M 6 11 L 14 11 L 12 8 L 6 8 Z" fill="#0B1E40" />

              {/* High-Downforce Rear Wing and Endplates */}
              <line x1="-30" y1="-16" x2="-30" y2="16" stroke="#E6ECF5" strokeWidth="2.5" />
              <rect x="-33" y="-17" width="5" height="2" fill="#FF2800" />
              <rect x="-33" y="15" width="5" height="2" fill="#FF2800" />

              {/* Glass Cockpit Canopy with Illuminated DNA Double-Helix Core */}
              <path
                d="M 20 0 L 16 -5 L -2 -5 L -8 0 L -2 5 L 16 5 Z"
                fill="rgba(11, 30, 64, 0.92)"
                stroke="#2563EB"
                strokeWidth="0.8"
              />

              {/* Glowing Miniature DNA Double Helix under Cockpit Glass */}
              <path
                d="M -4 -2 Q 2 3, 8 -2 T 16 0"
                fill="none"
                stroke="#2563EB"
                strokeWidth="0.9"
              />
              <path
                d="M -4 2 Q 2 -3, 8 2 T 16 0"
                fill="none"
                stroke="#FF2800"
                strokeWidth="0.9"
              />
              {/* DNA Base-Pair Rungs */}
              <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#E6ECF5" strokeWidth="0.6" />
              <line x1="5" y1="-2" x2="5" y2="2" stroke="#E6ECF5" strokeWidth="0.6" />
              <line x1="10" y1="-1.5" x2="10" y2="1.5" stroke="#E6ECF5" strokeWidth="0.6" />
            </g>
          </svg>

          {/* 5 UNBOXED EDITORIAL EXPERIENCE STATIONS (HTML/CSS) */}
          {SECTORS.map((sec, idx) => {
            const isTop = sec.position === 'top';
            return (
              <div
                key={sec.id}
                data-experience-station={idx}
                ref={(el) => {
                  stationRefs.current[idx] = el;
                }}
                className={`absolute pointer-events-auto transition-all duration-300 max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] ${
                  isTop
                    ? 'top-[12%] sm:top-[14%]'
                    : 'top-[52%] sm:top-[54%]'
                }`}
                style={{
                  left: `${(sec.apexX / 6000) * 100}%`,
                  transform: 'translateX(-24px)',
                }}
              >
                {/* Station Editorial Header: Numeral · Period */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-5xl font-serif text-[#FF2800] leading-none">
                    {sec.numeral}
                  </span>
                  <span className="text-[#18458B]/40 font-mono text-sm select-none">·</span>
                  <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#C8D2E0] uppercase">
                    {sec.period}
                  </span>
                </div>

                {/* Organization / Company */}
                <h3 className="text-xl sm:text-3xl font-serif font-normal text-[#F4F6F9] mt-2 tracking-tight">
                  {sec.company}
                </h3>

                {/* Role */}
                <p className="text-xs sm:text-sm font-sans font-medium text-[#FF4419] mt-1 leading-snug">
                  {sec.role}
                </p>

                {/* Concise Impact Points */}
                <p className="text-xs sm:text-sm font-sans text-[#C8D2E0]/90 leading-relaxed mt-2.5">
                  {sec.points}
                </p>

                {/* Unboxed Tech Stack Line (Separated by middle dots) */}
                <div className="text-[10px] sm:text-[11px] font-mono text-[#2563EB] mt-3 tracking-wide">
                  {sec.stack.join(' · ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* PERSISTENT MINIMAL STICKY HUD BAR (BOTTOM) */}
        <div className="relative z-30 w-full px-6 sm:px-12 md:px-16 pb-8 pt-4 flex items-end justify-between pointer-events-none border-t border-[#18458B]/10">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[#7E8B9B]">
            {telemetry.progressPct < 90 ? (
              <span className="flex items-center gap-2">
                <span>↓</span>
                <span>Scroll to navigate along Grand Prix chicanes</span>
              </span>
            ) : (
              <span className="flex items-center gap-2 text-[#FF2800]">
                <span>Sector 05 cleared · Proceed to Selected Works</span>
                <span>↓</span>
              </span>
            )}
          </div>

          <Link
            href="#projects"
            className="pointer-events-auto text-[11px] font-mono uppercase text-[#FF2800] hover:text-[#C8D2E0] transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:underline"
          >
            <span>Selected Works</span>
            <span>↓</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ExperienceCircuit;
