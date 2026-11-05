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
  curbD: string;
  calloutPlacement: 'above' | 'below';
  calloutX: number;
  calloutY: number;
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
      const calculatedWidth = Math.max(w < 768 ? 960 : w, 960);
      setContainerWidth(calculatedWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const trackHeight = 290;
  const Y_mid = 145;
  const count = items.length;

  // 1. Generate Silky-Smooth Continuous Chicane Curves
  const { trackPathD, chicanesGeo } = useMemo(() => {
    const W = containerWidth;
    const margin = Math.max(80, W * 0.06);
    const usableW = W - 2 * margin;
    const slotW = usableW / count;
    const dy = 52; // Vertical deflection of chicane apex

    const geos: ChicaneGeometry[] = [];
    let pathD = `M 0 ${Y_mid} L ${margin} ${Y_mid}`;

    for (let i = 0; i < count; i++) {
      const slotStart = margin + i * slotW;
      const slotCenter = slotStart + slotW * 0.5;
      const curveSpan = slotW * 0.74; // Broad, sweeping horizontal runway
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

      // Curb path hugging the inside crown of the apex curve
      const curbY = isUp ? yApex - 14 : yApex + 14;
      const curbD = `M ${xApex - 38} ${isUp ? curbY + 4 : curbY - 4} Q ${xApex} ${curbY} ${xApex + 38} ${isUp ? curbY + 4 : curbY - 4}`;

      // Callout placement alternating above vs below with generous breathing room
      const calloutPlacement = isUp ? 'below' : 'above';
      const calloutY = isUp ? 220 : 28;

      geos.push({
        id: items[i].id,
        index: i,
        xStart,
        xApex,
        xEnd,
        yApex,
        curbD,
        calloutPlacement,
        calloutX: xApex,
        calloutY,
        nodeX: xApex,
        nodeY: yApex,
      });
    }

    // Straight exit off the far-right screen edge
    pathD += ` L ${W} ${Y_mid}`;

    return { trackPathD: pathD, chicanesGeo: geos };
  }, [containerWidth, count, items]);

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
  const { isMoving, boost } = useChicaneCircuitKinematics({
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
    if (window.innerWidth < 768 && scrollWrapperRef.current && chicanesGeo[activeIndex]) {
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
      {/* Scroll Wrapper for Mobile Viewports */}
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
                <stop offset="0%" stopColor="#82B7FF" stopOpacity="0.3" />
                <stop offset="45%" stopColor="#FF6B35" stopOpacity="1" />
                <stop offset="75%" stopColor="#F5D998" stopOpacity="1" />
                <stop offset="100%" stopColor="#82B7FF" stopOpacity="0.3" />
              </linearGradient>

              {/* Active apex curb ambient glow filter */}
              <filter id="curb-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* LAYER 1: OUTER TRACK BOUNDARIES / RUN-OFF
                30px outer border stroke with 28px inner asphalt ribbon creates crisp 1px flanking rails */}
            <path
              d={trackPathD}
              stroke="rgba(167, 178, 195, 0.22)"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d={trackPathD}
              stroke="#0C1322"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* LAYER 2: THE IDEAL RACING LINE (Continuous 2px Spline) */}
            <path
              ref={setPathElement}
              d={trackPathD}
              stroke="rgba(130, 183, 255, 0.28)"
              strokeWidth="2"
              strokeDasharray="9 7"
              fill="none"
            />

            {/* Active Racing Line Accent Overlay */}
            <path
              ref={activeLineRef}
              d={trackPathD}
              stroke="url(#active-racing-line-grad)"
              strokeWidth="2.5"
              strokeDasharray="80 280"
              strokeDashoffset="0"
              fill="none"
              opacity="0.85"
            />

            {/* LAYER 3: AUTHENTIC MOTORSPORT APEX CURBS (Rumble Strips) */}
            {chicanesGeo.map((geo) => {
              const isActive = activeIndex === geo.index;
              const isHovered = hoveredIndex === geo.index;
              const isHighlighted = isActive || isHovered;

              return (
                <g key={`curbs-${geo.id}`} className="transition-all duration-300">
                  {/* Base Curb Block */}
                  <path
                    d={geo.curbD}
                    stroke={isHighlighted ? '#FF6B35' : '#334155'}
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    filter={isHighlighted ? 'url(#curb-glow)' : undefined}
                    className="transition-colors duration-250"
                  />
                  {/* Alternating Ivory Dashes on Top */}
                  <path
                    d={geo.curbD}
                    stroke="#F3EFE7"
                    strokeWidth="5"
                    strokeDasharray="7 5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              );
            })}

            {/* LAYER 4: INTERACTIVE APEX NODES & FIDUCIAL CROSSHAIRS */}
            {chicanesGeo.map((geo) => {
              const isActive = activeIndex === geo.index;
              const isHovered = hoveredIndex === geo.index;

              return (
                <g key={`node-${geo.id}`} className="cursor-pointer">
                  {/* Connecting Hairline from Apex Node to Callout */}
                  <line
                    x1={geo.nodeX}
                    y1={geo.calloutPlacement === 'above' ? geo.calloutY + 34 : geo.nodeY}
                    x2={geo.nodeX}
                    y2={geo.calloutPlacement === 'above' ? geo.nodeY : geo.calloutY - 8}
                    stroke={isActive ? '#FF6B35' : 'rgba(243, 239, 231, 0.14)'}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    className="transition-colors duration-200"
                  />

                  {/* Outer Pulsing Target Halo when Active */}
                  {isActive && (
                    <circle
                      cx={geo.nodeX}
                      cy={geo.nodeY}
                      r="18"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      className="animate-spin-slow origin-center opacity-70"
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

                  {/* Apex Core Center Dot */}
                  <circle
                    cx={geo.nodeX}
                    cy={geo.nodeY}
                    r={isActive ? '3.5' : '2'}
                    fill={isActive ? '#FF6B35' : isHovered ? '#F5D998' : '#82B7FF'}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* LAYER 5: TOP-DOWN DNA-CORE AERO PROTOTYPE VEHICLE
                Direct DOM hardware-accelerated transform via GSAP and vehicleRef (Zero React re-render lag) */}
            <g ref={vehicleRef} style={{ willChange: 'transform' }}>
              <TrackAeroPod isMoving={isMoving} boost={boost} />
            </g>
          </svg>

          {/* LAYER 6: INTERACTIVE CHICANE APEX NODES & CLEAN ROLE CALLOUTS */}
          {chicanesGeo.map((geo) => {
            const item = items[geo.index];
            const isActive = activeIndex === geo.index;
            const isHovered = hoveredIndex === geo.index;

            return (
              <div
                key={`callout-${geo.id}`}
                className="absolute transform -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group"
                style={{
                  left: `${geo.calloutX}px`,
                  top: `${geo.calloutY}px`,
                  width: '230px',
                }}
                onClick={() => handleChicaneClick(geo.index)}
                onMouseEnter={() => setHoveredIndex(geo.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${item.company} chicane`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleChicaneClick(geo.index);
                  }
                }}
              >
                {/* 44x44px Clickable Hit Target overlaying Apex Node */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-11 h-11 pointer-events-auto"
                  style={{
                    top: geo.calloutPlacement === 'above' ? `${geo.nodeY - geo.calloutY - 22}px` : `${geo.nodeY - geo.calloutY - 22}px`,
                  }}
                  title={`Apex ${geo.index + 1}: ${item.company}`}
                />

                {/* Organization & Role Callout: Clean Typography, Zero Decorative Jargon */}
                <div
                  className={`text-center px-2 py-1 transition-all duration-200 ${
                    isActive ? 'scale-[1.03]' : 'group-hover:scale-[1.01]'
                  }`}
                >
                  {/* Organization Name (Clean Serif, 18px-20px) */}
                  <h3
                    className={`font-serif text-[17px] sm:text-[19px] leading-snug tracking-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-[#F3EFE7] font-medium'
                        : isHovered
                        ? 'text-[#F5D998]'
                        : 'text-[#A7B2C3]'
                    }`}
                  >
                    {item.company}
                  </h3>

                  {/* Role Title & Timeframe (12px Monospace, #FF6B35 active, #64748B idle) */}
                  <div
                    className={`text-[11px] sm:text-[12px] font-mono mt-0.5 tracking-tight transition-colors duration-200 line-clamp-1 ${
                      isActive
                        ? 'text-[#FF6B35] font-semibold'
                        : isHovered
                        ? 'text-[#FF6B35]/80'
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
