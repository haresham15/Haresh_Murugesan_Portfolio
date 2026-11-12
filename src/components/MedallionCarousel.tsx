import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useSpring, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { useMotionPreference } from './MotionPreference';
import { getEvidence } from '../content/evidence';

export interface MedallionData {
  id: string;
  number: string;
  title: string;
  orgAndYear: string;
  project: string;
  summary: string;
  link: string;
  linkLabel: string;
  inscription: string;
  centerBadge: string;
  accentColor: string;
}

const tamil = getEvidence('tamiltrove-hit5');
const healios = getEvidence('healios-xai-saliency');
const datafest25 = getEvidence('datafest-2025-first-place');
const routerx = getEvidence('routerx-careline-transit-gap');

/** Every entry below is sourced from src/content (projects.ts / evidence.ts). */
export const MEDALLIONS: MedallionData[] = [
  {
    id: 'datafest-2026',
    number: '01',
    title: '1st Place, Best Use of External Data',
    orgAndYear: 'ASA DataFest 2026',
    project: 'RouteRx (Careline)',
    summary: `Bi-directional shuttle optimization for Stormont Vail Health patients facing transit barriers. The spatial analysis flagged ${routerx?.value ?? '43 of 141 blocks'} in Topeka, KS as transit-isolated.`,
    link: '/projects/routerx-careline',
    linkLabel: 'Read the case study',
    inscription: 'AMERICAN STATISTICAL ASSOCIATION · DATAFEST 2026 · BEST USE OF EXTERNAL DATA · ',
    centerBadge: '1st',
    accentColor: '#FF2800',
  },
  {
    id: 'datafest-2025',
    number: '02',
    title: '1st Place, Best Use of External Data',
    orgAndYear: 'ASA DataFest 2025',
    project: 'The Ohio State University',
    summary: `${datafest25?.methodology ?? ''} Field: ${datafest25?.sampleSize ?? ''}`.trim(),
    link: '/datafest-2025.pdf',
    linkLabel: 'View the award (PDF)',
    inscription: 'AMERICAN STATISTICAL ASSOCIATION · DATAFEST 2025 · BEST USE OF EXTERNAL DATA · ',
    centerBadge: '1st',
    accentColor: '#FF4419',
  },
  {
    id: 'hack-to-the-future',
    number: '03',
    title: 'Top Project, Data Science Track',
    orgAndYear: 'Hack To The Future',
    project: 'NYC Housing Market AI (NYC OS)',
    summary:
      'K-Means clustering and a spatial gravity vector field over 1M+ NYC Department of Finance sales records, showing how capital density pulls valuations across the boroughs.',
    link: '/projects/nyc-housing-market-ai',
    linkLabel: 'Read the case study',
    inscription: 'HACK TO THE FUTURE · DATA SCIENCE TRACK · TOP PROJECT · NYC OS · ',
    centerBadge: 'Top',
    accentColor: '#2563EB',
  },
  {
    id: 'tamiltrove-benchmark',
    number: '04',
    title: `${tamil?.value ?? '94.2% Hit@5'} Hybrid Retrieval`,
    orgAndYear: 'Benchmark · TamilTrove',
    project: 'TamilTrove',
    summary: `${tamil?.methodology ?? ''} ${tamil?.sampleSize ?? ''}`.trim(),
    link: '/projects/tamiltrove',
    linkLabel: 'Read the case study',
    inscription: 'TAMILTROVE · HYBRID LEXICAL AND DENSE RETRIEVAL · 94.2% HIT@5 · ',
    centerBadge: '94.2',
    accentColor: '#C8D2E0',
  },
  {
    id: 'healios-benchmark',
    number: '05',
    title: `${healios?.value ?? '8.09 ms'} Grad-CAM Saliency`,
    orgAndYear: 'Benchmark · Healios V2',
    project: 'Healios V2',
    summary: `${healios?.methodology ?? ''} Measured over ${healios?.sampleSize ?? ''}`.trim(),
    link: '/projects/healios',
    linkLabel: 'Read the case study',
    inscription: 'HEALIOS V2 · EXPLAINABLE VISION · GRAD-CAM SALIENCY · 8.09 MS · ',
    centerBadge: '8.09',
    accentColor: '#FF2800',
  },
];

/* Geometry (SVG user units, viewBox 0 0 320 320, centre 160,160) */
const C = 160;
const R_BEZEL = 156;
const NOTCHES = 72; // one notch every 5 degrees
const R_TEXT = 128;
const TEXT_LEN = 2 * Math.PI * R_TEXT; // exact 360 degree wrap
const notchAngles = Array.from({ length: NOTCHES }, (_, k) => (k * 360) / NOTCHES);
const hexPoints = (r: number) =>
  Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return `${(C + r * Math.cos(a)).toFixed(2)},${(C + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
const dialTicks = Array.from({ length: 24 }, (_, k) => (k * 360) / 24);

const TILT = 15;

/** Anisotropic (turned-metal) glare: a conic "bow-tie" highlight whose axis follows the tilt vector. */
const useGlare = (tiltX: MotionValue<number>, tiltY: MotionValue<number>) => {
  const bezel = useTransform([tiltX, tiltY], ([rx, ry]: number[]) => {
    const mag = Math.min(1, Math.hypot(rx, ry) / TILT);
    const angle = (Math.atan2(rx, ry) * 180) / Math.PI + 90;
    const a = (0.18 + 0.5 * mag).toFixed(3);
    return `conic-gradient(from ${angle.toFixed(1)}deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(255,255,255,${a}) 16deg, rgba(255,255,255,0) 42deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,${a}) 196deg, rgba(255,255,255,0) 222deg, rgba(255,255,255,0) 360deg)`;
  });
  const core = useTransform([tiltX, tiltY], ([rx, ry]: number[]) => {
    const x = 50 - (ry / TILT) * 22;
    const y = 50 + (rx / TILT) * 22;
    return `radial-gradient(ellipse 60% 38% at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(200,210,224,0.20), rgba(200,210,224,0) 70%)`;
  });
  return { bezel, core };
};

const BEZEL_MASK = 'radial-gradient(circle closest-side, transparent 86.5%, #000 87.5%, #000 97%, transparent 97.6%)';
const CORE_MASK = 'radial-gradient(circle closest-side, #000 69%, transparent 70%)';

export const MedallionCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const { isReduced } = useMotionPreference();

  // Pointer tilt for the active medallion (±15deg), spring-damped
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseY, { stiffness: 180, damping: 18, mass: 0.6 });
  const tiltY = useSpring(mouseX, { stiffness: 180, damping: 18, mass: 0.6 });
  const glare = useGlare(tiltX, tiltY);

  const [containerWidth, setContainerWidth] = useState<number>(1200);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Sizes derive from the measured container so the outermost medallion always stays inside it.
  const W = containerWidth;
  let medalSize: number;
  let spacing: number;
  if (W < 640) {
    medalSize = Math.min(190, Math.max(140, W * 0.42));
    spacing = Math.min(110, Math.max(46, (W * 0.48 - (medalSize * 0.64) / 2) / 2));
  } else if (W < 1024) {
    medalSize = Math.min(250, Math.max(190, W * 0.3));
    spacing = Math.min(180, Math.max(110, (W * 0.48 - (medalSize * 0.64) / 2) / 2));
  } else {
    medalSize = 300;
    spacing = Math.min(270, Math.max(190, W * 0.18));
  }
  const stageHeight = Math.round(medalSize * 1.32);

  const total = MEDALLIONS.length;
  const handlePrev = useCallback(() => setActiveIndex((p) => (p - 1 + total) % total), [total]);
  const handleNext = useCallback(() => setActiveIndex((p) => (p + 1) % total), [total]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReduced || e.pointerType === 'touch' || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const half = medalSize * 0.9;
    const nx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / half));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / half));
    mouseX.set(nx * TILT);
    mouseY.set(-ny * TILT);
  };
  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const active = MEDALLIONS[activeIndex];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Recognition"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative w-full flex flex-col items-center select-none outline-none focus-visible:outline-1 focus-visible:outline-[#2563EB]/50"
    >
      {/* Unboxed editorial header */}
      <div className="w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-end pb-10 border-b border-[#C8D2E0]/10">
        <div className="md:col-span-9 space-y-5">
          <h2 className="font-mono text-xs text-[#7E8B9B]">Recognition</h2>
          <p className="font-serif font-normal text-[#F4F6F9] tracking-[-0.02em] leading-[0.95]">
            <span className="text-6xl sm:text-8xl lg:text-9xl">
              2× <span className="italic text-[#FF2800]">1st</span>
            </span>
            <span className="block mt-4 text-2xl sm:text-3xl lg:text-4xl tracking-[-0.01em] leading-tight text-[#C8D2E0]">
              American Statistical Association DataFest{' '}
              <span className="text-[#7E8B9B] whitespace-nowrap">(2025 &amp; 2026)</span>
            </span>
          </p>
        </div>

        <div className="md:col-span-3 flex items-center md:justify-end gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handlePrev}
            className="w-11 h-11 rounded-[2px] border border-[#C8D2E0]/15 hover:border-[#FF2800] text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Previous distinction"
          >
            ←
          </button>
          <span className="text-[#7E8B9B] min-w-[56px] text-center tabular-nums" aria-live="polite">
            {active.number} / {String(total).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="w-11 h-11 rounded-[2px] border border-[#C8D2E0]/15 hover:border-[#FF2800] text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            aria-label="Next distinction"
          >
            →
          </button>
        </div>
      </div>

      {/* 3D orbital stage (perspective 1500px) */}
      <div
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative w-full flex items-center justify-center overflow-visible my-10 sm:my-14 touch-pan-y"
        style={{ height: stageHeight, perspective: '1500px', transformStyle: 'preserve-3d' }}
      >
        {MEDALLIONS.map((m, idx) => {
          const offset = ((idx - activeIndex + total + 2) % total) - 2;
          const isCenter = offset === 0;
          const x = offset * spacing;
          const z = -Math.abs(offset) * 180;
          const rotateY = offset * -28;
          const scale = isCenter ? 1.06 : 1 - Math.abs(offset) * 0.18;
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.62 : 0.28;

          return (
            <motion.button
              type="button"
              key={m.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`${m.title}, ${m.orgAndYear}`}
              aria-pressed={isCenter}
              tabIndex={isCenter ? 0 : -1}
              initial={false}
              animate={{ x, z, rotateY, scale }}
              style={{
                width: medalSize,
                height: medalSize,
                zIndex: 30 - Math.abs(offset) * 10,
                transformStyle: 'preserve-3d',
              }}
              transition={isReduced ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 26, mass: 0.9 }}
              className="absolute p-0 border-0 bg-transparent rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF2800] cursor-pointer"
            >
              <motion.div
                animate={{ opacity }}
                transition={isReduced ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transformStyle: 'preserve-3d',
                  ...(isCenter && !isReduced ? { rotateX: tiltX, rotateY: tiltY } : {}),
                }}
                className="w-full h-full relative"
              >
                <svg
                  viewBox="0 0 320 320"
                  className="w-full h-full block drop-shadow-[0_24px_40px_rgba(0,0,0,0.85)]"
                  aria-hidden="true"
                >
                  <defs>
                    {/* Brushed silver: many narrow bands read as anisotropic metal */}
                    <linearGradient id={`bezel-${m.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#E6ECF5" />
                      <stop offset="0.18" stopColor="#7E8B9B" />
                      <stop offset="0.32" stopColor="#C8D2E0" />
                      <stop offset="0.5" stopColor="#5B6676" />
                      <stop offset="0.66" stopColor="#C8D2E0" />
                      <stop offset="0.82" stopColor="#7E8B9B" />
                      <stop offset="1" stopColor="#3C4552" />
                    </linearGradient>
                    <radialGradient id={`core-${m.id}`} cx="0.42" cy="0.36" r="0.75">
                      <stop offset="0" stopColor="#153875" />
                      <stop offset="0.45" stopColor="#0B1E40" />
                      <stop offset="1" stopColor="#03050A" />
                    </radialGradient>
                    {/* Inner shadow lip makes the core read as recessed */}
                    <radialGradient id={`lip-${m.id}`} cx="0.5" cy="0.5" r="0.5">
                      <stop offset="0.86" stopColor="#03050A" stopOpacity="0" />
                      <stop offset="1" stopColor="#03050A" stopOpacity="0.9" />
                    </radialGradient>
                    <path
                      id={`ring-${m.id}`}
                      d={`M ${C} ${C - R_TEXT} a ${R_TEXT} ${R_TEXT} 0 1 1 0 ${2 * R_TEXT} a ${R_TEXT} ${R_TEXT} 0 1 1 0 ${-2 * R_TEXT}`}
                      fill="none"
                    />
                  </defs>

                  {/* Knurled bezel: 72 notches at 5 degree pitch */}
                  <circle cx={C} cy={C} r={R_BEZEL} fill={`url(#bezel-${m.id})`} />
                  <g>
                    {notchAngles.map((a) => (
                      <g key={a} transform={`rotate(${a} ${C} ${C})`}>
                        <rect x={C - 1.5} y={C - R_BEZEL} width={3} height={9} fill="#03050A" opacity={0.62} />
                        <rect x={C + 1.5} y={C - R_BEZEL} width={0.8} height={9} fill="#F4F6F9" opacity={0.35} />
                      </g>
                    ))}
                  </g>
                  <circle cx={C} cy={C} r={R_BEZEL - 0.5} fill="none" stroke="#E6ECF5" strokeOpacity={0.5} strokeWidth={1} />

                  {/* Anodized inner ring */}
                  <circle cx={C} cy={C} r={144} fill="#060A12" />
                  <circle
                    cx={C}
                    cy={C}
                    r={143}
                    fill="none"
                    stroke={isCenter ? '#FF2800' : '#153875'}
                    strokeWidth={isCenter ? 3.5 : 1.5}
                  />
                  <circle cx={C} cy={C} r={140.5} fill="none" stroke="#03050A" strokeWidth={1} />

                  {/* 360 degree mono engraving, length-fitted to the exact circumference */}
                  <text
                    fontSize="8"
                    fontFamily="ui-monospace, 'JetBrains Mono', 'Geist Mono', monospace"
                    fontWeight={600}
                    fill={isCenter ? '#E6ECF5' : '#7E8B9B'}
                    opacity={isCenter ? 0.92 : 0.6}
                  >
                    <textPath href={`#ring-${m.id}`} textLength={TEXT_LEN - 4} lengthAdjust="spacing">
                      {m.inscription}
                    </textPath>
                  </text>

                  {/* Recessed cobalt core */}
                  <circle cx={C} cy={C} r={112} fill={`url(#core-${m.id})`} />
                  <circle cx={C} cy={C} r={112} fill={`url(#lip-${m.id})`} />
                  <circle cx={C} cy={C} r={112} fill="none" stroke={isCenter ? m.accentColor : '#153875'} strokeOpacity={0.7} strokeWidth={1} />

                  {/* Geometric crest */}
                  <g opacity={isCenter ? 1 : 0.7}>
                    {dialTicks.map((a) => (
                      <line
                        key={a}
                        x1={C}
                        y1={C - 100}
                        x2={C}
                        y2={C - (a % 90 === 0 ? 90 : 95)}
                        stroke="#C8D2E0"
                        strokeOpacity={a % 90 === 0 ? 0.6 : 0.25}
                        strokeWidth={1}
                        transform={`rotate(${a} ${C} ${C})`}
                      />
                    ))}
                    <polygon points={hexPoints(72)} fill="none" stroke="#2563EB" strokeOpacity={0.55} strokeWidth={1} />
                    <polygon
                      points={hexPoints(72)}
                      fill="none"
                      stroke="#C8D2E0"
                      strokeOpacity={0.18}
                      strokeWidth={1}
                      transform={`rotate(30 ${C} ${C})`}
                    />
                    <circle cx={C} cy={C} r={52} fill="none" stroke="#C8D2E0" strokeOpacity={0.2} strokeWidth={0.75} />
                    <text
                      x={C}
                      y={C + 11}
                      textAnchor="middle"
                      fill={isCenter ? '#F4F6F9' : '#C8D2E0'}
                      fontSize={m.centerBadge.length > 3 ? 30 : 38}
                      fontFamily="'Geist Serif', 'Newsreader', Georgia, serif"
                      fontStyle="italic"
                    >
                      {m.centerBadge}
                    </text>
                    <text
                      x={C}
                      y={C + 34}
                      textAnchor="middle"
                      fill={m.accentColor}
                      fontSize="8"
                      fontFamily="ui-monospace, monospace"
                      letterSpacing="1.6"
                    >
                      No. {m.number}
                    </text>
                  </g>
                </svg>

                {/* Tilt-following glare (active medallion only) */}
                {isCenter && !isReduced && (
                  <>
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
                      style={{ backgroundImage: glare.bezel, WebkitMaskImage: BEZEL_MASK, maskImage: BEZEL_MASK }}
                    />
                    <motion.div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
                      style={{ backgroundImage: glare.core, WebkitMaskImage: CORE_MASK, maskImage: CORE_MASK }}
                    />
                  </>
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Plinth: all entries share one grid cell, so the tallest reserves the height (no layout shift) */}
      <div className="w-full max-w-[760px] px-4 text-center grid">
        {MEDALLIONS.map((m, index) => {
          const on = index === activeIndex;
          return (
            <div
              key={m.id}
              aria-hidden={!on}
              style={{
                gridArea: '1 / 1',
                opacity: on ? 1 : 0,
                transform: on || isReduced ? 'none' : 'translateY(8px)',
                visibility: on ? 'visible' : 'hidden',
                transition: isReduced
                  ? 'none'
                  : `opacity 480ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1), visibility 0s linear ${on ? '0s' : '480ms'}`,
              }}
              className="flex flex-col items-center"
            >
              <div className="font-mono text-xs text-[#FF2800]">
                {m.orgAndYear} <span className="text-[#7E8B9B]">· {m.project}</span>
              </div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F4F6F9] leading-snug tracking-[-0.01em]">
                {m.title}
              </h3>
              <p className="mt-4 font-sans text-sm sm:text-base text-[#C8D2E0]/85 leading-relaxed max-w-[62ch]">
                {m.summary}
              </p>
              <Link
                href={m.link}
                tabIndex={on ? 0 : -1}
                {...(m.link.endsWith('.pdf') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="mt-5 min-h-[44px] inline-flex items-center gap-2 font-mono text-xs text-[#FF2800] hover:text-[#F4F6F9] transition-colors"
              >
                <span className="border-b border-current pb-0.5">{m.linkLabel}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedallionCarousel;
