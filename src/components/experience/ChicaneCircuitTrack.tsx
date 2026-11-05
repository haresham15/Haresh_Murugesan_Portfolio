import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { TrackAeroPod } from './TrackAeroPod';
import { useChicaneCircuitKinematics, ChicaneTarget } from './useChicaneCircuitKinematics';
import { useMotionPreference } from '../MotionPreference';

export interface ChicaneItemData {
  id: string;
  role: string;
  company: string;
  period: string;
  year?: string;
}

export interface ChicaneCircuitTrackProps {
  items: ChicaneItemData[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  className?: string;
}

interface ChicaneGeometry {
  id: string;
  index: number;
  xStart: number;
  xApex: number;
  xEnd: number;
  yApex: number;
  entryCurbD: string;
  exitCurbD: string;
  pylonX: number;
  pylonY: number;
  nodeX: number;
  nodeY: number;
}

export const ChicaneCircuitTrack: React.FC<ChicaneCircuitTrackProps> = ({
  items,
  activeIndex,
  onSelectIndex,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<SVGGElement>(null);
  const activeLineRef = useRef<SVGPathElement>(null);
  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(1440);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { isReduced } = useMotionPreference();

  // Responsive width listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateWidth = () => {
      const w = window.innerWidth;
      const calculatedWidth = Math.max(w < 768 ? 1040 : w, 1140);
      setContainerWidth(calculatedWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const trackHeight = 320;
  const Y_mid = 215; // Track centerline positioned in lower half so pylons sit cleanly in upper gantry
  const count = items.length;

  // 1. Generate Silky-Smooth Continuous Chicane S-Curves
  const { trackPathD, chicanesGeo } = useMemo(() => {
    const W = containerWidth;
    const margin = Math.max(80, W * 0.06);
    const usableW = W - 2 * margin;
    const slotW = usableW / count;
    const dy = 42; // Vertical deflection of chicane apex

    const geos: ChicaneGeometry[] = [];
    let pathD = `M 0 ${Y_mid} L ${margin} ${Y_mid}`;

    for (let i = 0; i < count; i++) {
      const slotStart = margin + i * slotW;
      const slotCenter = slotStart + slotW * 0.5;
      const curveSpan = slotW * 0.74; // Sweeping horizontal runway
      const xStart = slotCenter - curveSpan * 0.5;
      const xApex = slotCenter;
      const xEnd = slotCenter + curveSpan * 0.5;

      // Invert vertical deflection alternately (UP, DOWN, UP, DOWN, UP)
      const isUp = i % 2 === 0;
      const yApex = isUp ? Y_mid - dy : Y_mid + dy;

      // Straight acceleration into chicane curve
      pathD += ` L ${xStart} ${Y_mid}`;

      // Smooth C1-continuous sweeping curve into apex
      const dx1 = xApex - xStart;
      const cp1x = xStart + dx1 * 0.48;
      const cp1y = Y_mid;
      const cp2x = xApex - dx1 * 0.48;
      const cp2y = yApex;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${xApex} ${yApex}`;

      // Smooth C1-continuous sweeping curve recovering back to centerline
      const dx2 = xEnd - xApex;
      const cp3x = xApex + dx2 * 0.48;
      const cp3y = yApex;
      const cp4x = xEnd - dx2 * 0.48;
      const cp4y = Y_mid;
      pathD += ` C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${xEnd} ${Y_mid}`;

      // Inside entry apex curb and exit apex curb
      const curbY = isUp ? yApex - 16 : yApex + 16;
      const entryCurbD = `M ${xApex - 42} ${isUp ? curbY + 6 : curbY - 6} Q ${xApex - 20} ${curbY} ${xApex} ${curbY}`;
      const exitCurbD = `M ${xApex} ${curbY} Q ${xApex + 20} ${curbY} ${xApex + 42} ${isUp ? curbY + 6 : curbY - 6}`;

      // Sector Pylon position elevated in upper gantry zone (y: 16px)
      const pylonY = 16;

      geos.push({
        id: items[i].id,
        index: i,
        xStart,
        xApex,
        xEnd,
        yApex,
        entryCurbD,
        exitCurbD,
        pylonX: xApex,
        pylonY,
        nodeX: xApex,
        nodeY: yApex,
      });
    }

    // Straight exit off the far-right screen edge
    pathD += ` L ${W} ${Y_mid}`;

    return { trackPathD: pathD, chicanesGeo: geos };
  }, [containerWidth, count, items, Y_mid]);

  // 2. Compute exact normalized parameter t for each chicane apex along SVG path
  const [targets, setTargets] = useState<ChicaneTarget[]>([]);

  useEffect(() => {
    if (!pathElement || chicanesGeo.length === 0) return;

    try {
      const totalLen = pathElement.getTotalLength();
      if (totalLen <= 0) return;

      const computedTargets: ChicaneTarget[] = chicanesGeo.map((geo) => {
        let low = 0;
        let high = totalLen;
        for (let step = 0; step < 18; step++) {
          const mid = (low + high) / 2;
          const pt = pathElement.getPointAtLength(mid);
          if (pt.x < geo.nodeX) {
            low = mid;
          } else {
            high = mid;
          }
        }
        const bestLength = (low + high) / 2;
        const normT = bestLength / totalLen;
        const finalPt = pathElement.getPointAtLength(bestLength);

        return {
          id: geo.id,
          index: geo.index,
          t: normT,
          apexX: finalPt.x,
          apexY: finalPt.y,
        };
      });

      setTargets(computedTargets);
    } catch {
      setTargets(
        chicanesGeo.map((geo, idx) => ({
          id: geo.id,
          index: geo.index,
          t: (idx + 0.5) / count,
          apexX: geo.nodeX,
          apexY: geo.nodeY,
        }))
      );
    }
  }, [chicanesGeo, count, pathElement]);

  // 3. Cinematic Kinematics Hook (Direct DOM Hardware-Accelerated Animation)
  const { isMoving, boost, isBraking } = useChicaneCircuitKinematics({
    pathElement,
    vehicleRef,
    activeLineRef,
    chicanes: targets,
    activeIndex,
    isReducedMotion: isReduced,
  });

  // Mobile auto-scroll to keep active chicane centered
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 1024 && scrollWrapperRef.current && chicanesGeo[activeIndex]) {
      const targetX = chicanesGeo[activeIndex].nodeX;
      const scrollLeft = targetX - window.innerWidth / 2;
      scrollWrapperRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth',
      });
    }
  }, [activeIndex, chicanesGeo]);

  const handleChicaneClick = useCallback(
    (index: number) => {
      onSelectIndex(index);
    },
    [onSelectIndex]
  );

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden relative select-none ${className}`}
      aria-label="Grand Prix Chicane Experience Circuit"
    >
      {/* Scroll Wrapper for Mobile & Smaller Viewports */}
      <div
        ref={scrollWrapperRef}
        className="w-full overflow-x-auto scrollbar-none touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="relative mx-auto"
          style={{ width: `${containerWidth}px`, height: `${trackHeight}px` }}
        >
          <svg
            width={containerWidth}
            height={trackHeight}
            viewBox={`0 0 ${containerWidth} ${trackHeight}`}
            className="w-full h-full block overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* Active racing line illuminated gradient */}
              <linearGradient id="active-racing-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#82B7FF" stopOpacity="0.2" />
                <stop offset="35%" stopColor="#FF6B35" stopOpacity="1" />
                <stop offset="70%" stopColor="#F5D998" stopOpacity="1" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>

              {/* Active apex curb ambient glow filter */}
              <filter id="curb-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Track Bed Outer Shadow */}
              <filter id="track-shadow" x="-5%" y="-20%" width="110%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* LAYER 1: TRACK BED & RUN-OFF APRON (44px wide dark tarmac ribbon #0B1220 with 1px outer barrier walls) */}
            <path
              d={trackPathD}
              stroke="rgba(167, 178, 195, 0.28)"
              strokeWidth="44"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#track-shadow)"
            />
            <path
              d={trackPathD}
              stroke="#0B1220"
              strokeWidth="42"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* LAYER 2: INNER ASPHALT SURFACE (30px wide deep obsidian asphalt #070B12 with longitudinal track grain) */}
            <path
              d={trackPathD}
              stroke="#070B12"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Subtle longitudinal asphalt grain */}
            <path
              d={trackPathD}
              stroke="rgba(243, 239, 231, 0.05)"
              strokeWidth="1"
              strokeDasharray="2 4"
              fill="none"
            />

            {/* LAYER 3: HIGH-CONTRAST FIA CHICANE RUMBLE CURBS (Entry + Exit Apexes) */}
            {chicanesGeo.map((geo) => {
              const isActive = activeIndex === geo.index;
              const isHovered = hoveredIndex === geo.index;
              const isHighlighted = isActive || isHovered;

              const activeCurbsD = `${geo.entryCurbD} ${geo.exitCurbD}`;

              return (
                <g key={`curbs-${geo.id}`} className="transition-all duration-300">
                  {/* Base Curb Block (8px wide) */}
                  <path
                    d={activeCurbsD}
                    stroke={isHighlighted ? '#FF6B35' : '#334155'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    filter={isHighlighted ? 'url(#curb-glow)' : undefined}
                    className="transition-colors duration-250"
                  />
                  {/* Alternating Serrated FIA Blocks (Ivory on active, Slate on inactive) */}
                  <path
                    d={activeCurbsD}
                    stroke={isHighlighted ? '#F3EFE7' : '#94A3B8'}
                    strokeWidth="8"
                    strokeDasharray="9 7"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              );
            })}

            {/* LAYER 4: DYNAMIC ILLUMINATED RACING LINE (2.5px Continuous Ideal Line + Wake) */}
            <path
              ref={setPathElement}
              d={trackPathD}
              stroke="rgba(130, 183, 255, 0.3)"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              fill="none"
            />

            {/* Trailing Telemetry Wake (280px illuminating gradient behind the car) */}
            <path
              ref={activeLineRef}
              d={trackPathD}
              stroke="url(#active-racing-line-grad)"
              strokeWidth="3"
              strokeDasharray="280 1400"
              strokeDashoffset="0"
              fill="none"
              opacity="0.9"
            />

            {/* APEX NODES & INTERACTIVE LEADER LINES */}
            {chicanesGeo.map((geo) => {
              const isActive = activeIndex === geo.index;
              const isHovered = hoveredIndex === geo.index;

              return (
                <g key={`node-${geo.id}`} className="cursor-pointer">
                  {/* 1px Vertical Leader Line connecting Chicane Apex to Sector Pylon */}
                  <line
                    x1={geo.nodeX}
                    y1={geo.pylonY + 84}
                    x2={geo.nodeX}
                    y2={geo.nodeY}
                    stroke={isActive ? '#FF6B35' : 'rgba(243, 239, 231, 0.16)'}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    className="transition-colors duration-200"
                  />

                  {/* Pulsing Target Reticle around Active Apex */}
                  {isActive && (
                    <circle
                      cx={geo.nodeX}
                      cy={geo.nodeY}
                      r="18"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                      className="animate-spin-slow origin-center opacity-85"
                      style={{ transformOrigin: `${geo.nodeX}px ${geo.nodeY}px` }}
                    />
                  )}

                  {/* Apex Ring */}
                  <circle
                    cx={geo.nodeX}
                    cy={geo.nodeY}
                    r="9"
                    fill="#070B12"
                    stroke={isActive ? '#FF6B35' : isHovered ? '#F5D998' : 'rgba(130, 183, 255, 0.45)'}
                    strokeWidth={isActive ? '2' : '1.2'}
                    className="transition-all duration-200"
                  />

                  {/* Apex Core Dot */}
                  <circle
                    cx={geo.nodeX}
                    cy={geo.nodeY}
                    r={isActive ? '4' : '2.5'}
                    fill={isActive ? '#FF6B35' : isHovered ? '#F5D998' : '#82B7FF'}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* LAYER 5: TOP-DOWN DNA-CORE AERO PROTOTYPE VEHICLE */}
            <g ref={vehicleRef} style={{ willChange: 'transform' }}>
              <TrackAeroPod isMoving={isMoving} boost={boost} isBraking={isBraking} />
            </g>
          </svg>

          {/* ===================================================================
              INTERACTIVE SECTOR PYLONS ABOVE EVERY CHICANE (Fixing Discoverability)
              =================================================================== */}
          {chicanesGeo.map((geo) => {
            const item = items[geo.index];
            const isActive = activeIndex === geo.index;
            const isHovered = hoveredIndex === geo.index;

            return (
              <div
                key={`pylon-${geo.id}`}
                className="absolute transform -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group"
                style={{
                  left: `${geo.pylonX}px`,
                  top: `${geo.pylonY}px`,
                  width: '240px',
                }}
                onClick={() => handleChicaneClick(geo.index)}
                onMouseEnter={() => setHoveredIndex(geo.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                role="button"
                tabIndex={0}
                aria-label={`Select Sector ${geo.index + 1}: ${item.company}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleChicaneClick(geo.index);
                  }
                }}
              >
                {/* 44x44px Clickable Hit Target overlaying Apex Node below */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-12 h-12 pointer-events-auto"
                  style={{
                    top: `${geo.nodeY - geo.pylonY - 24}px`,
                  }}
                  title={`Apex ${geo.index + 1}: ${item.company}`}
                />

                {/* Sector Pylon Card */}
                <div
                  className={`text-center p-2.5 rounded-[2px] transition-all duration-200 ${
                    isActive
                      ? 'bg-[#101B30]/95 border border-[#FF6B35]/40 shadow-[0_0_20px_rgba(255,107,53,0.2)]'
                      : isHovered
                      ? 'bg-[#101B30]/60 border border-[#F3EFE7]/15'
                      : 'bg-[#101B30]/30 border border-[#F3EFE7]/[0.08]'
                  }`}
                >
                  {/* Sector Badge Pill */}
                  <div className="inline-block mb-1.5">
                    <span
                      className={`text-[10px] font-mono tracking-widest px-2.5 py-0.5 rounded-full uppercase font-bold transition-colors ${
                        isActive
                          ? 'bg-[#FF6B35] text-[#070B12]'
                          : isHovered
                          ? 'bg-[#101B30] text-[#F5D998] border border-[#F5D998]/40'
                          : 'bg-[#101B30] text-[#7A889B] border border-[#F3EFE7]/10'
                      }`}
                    >
                      SECTOR {String(geo.index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Organization Title (Bold 17px–19px Serif) */}
                  <h3
                    className={`font-serif text-[16px] sm:text-[18px] leading-snug tracking-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-[#F3EFE7] font-medium'
                        : isHovered
                        ? 'text-[#F5D998]'
                        : 'text-[#A7B2C3]'
                    }`}
                  >
                    {item.company}
                  </h3>

                  {/* Role Title & Timeframe (12px Monospace) */}
                  <div
                    className={`text-[11px] sm:text-[12px] font-mono mt-0.5 tracking-tight transition-colors duration-200 truncate ${
                      isActive
                        ? 'text-[#FF6B35] font-semibold'
                        : isHovered
                        ? 'text-[#A7B2C3]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    <span>{item.period}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChicaneCircuitTrack;
