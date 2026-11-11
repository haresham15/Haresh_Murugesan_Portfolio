import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

const MotionDiv = motion.div as any;

export interface MedallionData {
  id: string;
  number: string;
  title: string;
  orgAndYear: string;
  project: string;
  summary: string;
  link: string;
  inscription: string;
  centerBadge: string;
  accentColor: string;
}

export const MEDALLIONS: MedallionData[] = [
  {
    id: 'datafest-2026',
    number: '01',
    title: '1st Place — Best Use of External Data',
    orgAndYear: 'American Statistical Association · 2026',
    project: 'RouteRx / Careline',
    summary:
      'Synthesized OpenStreetMap road networks, CDC social vulnerability indexes, and municipal bus timetables into sub-15ms multi-modal transit isochrones, identifying healthcare deserts across 141 Topeka census blocks.',
    link: '/projects/routerx-careline-hub',
    inscription: 'AMERICAN STATISTICAL ASSOCIATION · DATAFEST 2026 · BEST USE OF EXTERNAL DATA ·',
    centerBadge: '1ST',
    accentColor: '#FF2800',
  },
  {
    id: 'datafest-2025',
    number: '02',
    title: '1st Place — Best Use of External Data',
    orgAndYear: 'American Statistical Association · 2025',
    project: 'Hack to the Future (2× Consecutive Winner)',
    summary:
      'Constructed spatial econometric regression models across 500,000+ data points to evaluate how municipal corporate tax incentives alter commercial distribution footprint clustering.',
    link: '#projects',
    inscription: 'AMERICAN STATISTICAL ASSOCIATION · DATAFEST 2025 · 1ST PLACE CHAMPION ·',
    centerBadge: '2×',
    accentColor: '#FF4419',
  },
  {
    id: 'ibm-skillsbuild',
    number: '03',
    title: 'IBM SkillsBuild AI in Education Showcase',
    orgAndYear: 'IBM SkillsBuild & watsonx.ai · 2026',
    project: 'Vantage Platform',
    summary:
      'Architected zero-shot curriculum adaptation trees that guide non-traditional students through personalized computer science pathways with <250ms latency using IBM watsonx.ai.',
    link: '#projects',
    inscription: 'IBM SKILLSBUILD AI HACKATHON · NATIONAL SHOWCASE · IBM WATSONX ·',
    centerBadge: 'AI',
    accentColor: '#2563EB',
  },
  {
    id: 'tamiltrove-benchmark',
    number: '04',
    title: '94.2% Hit@5 Vector Search & 3D Urban Physics',
    orgAndYear: 'TamilTrove & NYC OS Market Engine · 2026',
    project: 'TamilTrove & NYC OS Market',
    summary:
      'Benchmarked TamilTrove against 120 transliterated search queries yielding a verified 94.2% Hit@5 retrieval rate; paired with NYC OS Market Engine modeling 1M+ transactions via Deck.GL 3D.',
    link: '/projects/tamiltrove',
    inscription: 'BENCHMARK DISTINCTION · 94.2% HIT@5 · HYBRID RETRIEVAL ·',
    centerBadge: '94%',
    accentColor: '#C8D2E0',
  },
  {
    id: 'nsls-osu',
    number: '05',
    title: 'NSLS & Ohio State Research Distinction',
    orgAndYear: 'The Ohio State University & NSLS · 2026',
    project: 'AI/ML Digital Pathology & Academic Leadership',
    summary:
      'Recognized for computational pathology research contributions at OSU and nominated to the National Society of Leadership and Success (NSLS) for academic and executive leadership.',
    link: '#experience',
    inscription: 'NATIONAL SOCIETY OF LEADERSHIP AND SUCCESS · OSU RESEARCH DISTINCTION ·',
    centerBadge: 'OSU',
    accentColor: '#FF2800',
  },
];

export const MedallionCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Mouse Tilt physics for active center medallion (±14deg)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseY, { stiffness: 220, damping: 20 });
  const tiltY = useSpring(mouseX, { stiffness: 220, damping: 20 });

  const total = MEDALLIONS.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    mouseX.set(nx * 15);
    mouseY.set(-ny * 15);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePrev, handleNext]);

  const active = MEDALLIONS[activeIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex flex-col items-center select-none py-6"
    >
      {/* Editorial Header Bar (Unboxed & Monumental) */}
      <div className="w-full max-w-[1440px] px-[4vw] md:px-[6vw] xl:px-[7vw] flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#18458B]/20">
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-4">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-serif font-normal text-[#F4F6F9] tracking-tight leading-none">
              2× <span className="text-[#FF2800]">1st</span>
            </span>
            <div className="flex flex-col text-xs sm:text-sm font-mono text-[#C8D2E0]">
              <span className="text-[#F4F6F9] font-semibold">American Statistical Association DataFest</span>
              <span className="text-[#7E8B9B]">2025 &amp; 2026 Consecutive Winner · Best Use of External Data</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F4F6F9] tracking-tight">
            Recognition.
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-[2px] bg-[#060A12] border border-[#18458B]/30 hover:border-[#FF2800] text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Previous Medallion"
          >
            ←
          </button>
          <span className="text-[#7E8B9B]">
            {activeIndex + 1} / {total}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-[2px] bg-[#060A12] border border-[#18458B]/30 hover:border-[#FF2800] text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Next Medallion"
          >
            →
          </button>
        </div>
      </div>

      {/* =====================================================================
          3D PERSPECTIVE MEDALLION ORBITAL CAROUSEL (perspective: 1500px)
          ===================================================================== */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center overflow-visible my-8"
        style={{ perspective: '1500px' }}
      >
        {MEDALLIONS.map((m, idx) => {
          const offset = (idx - activeIndex + total) % total;
          let rel = offset;
          if (rel > total / 2) rel -= total;

          const isCenter = rel === 0;
          const isVisible = Math.abs(rel) <= 2;
          if (!isVisible) return null;

          const x = rel * 270;
          const z = -Math.abs(rel) * 180;
          const rotateY = rel * -28;
          const scale = isCenter ? 1.08 : 0.82;
          const opacity = isCenter ? 1 : Math.abs(rel) === 1 ? 0.6 : 0.25;

          return (
            <MotionDiv
              key={m.id}
              onClick={() => setActiveIndex(idx)}
              animate={{
                x,
                z,
                rotateY,
                scale,
                opacity,
              }}
              style={
                isCenter
                  ? {
                      rotateX: tiltX,
                      rotateY: tiltY,
                      transformPerspective: 1200,
                      transformStyle: 'preserve-3d',
                    }
                  : { transformStyle: 'preserve-3d' }
              }
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="absolute w-[310px] h-[310px] rounded-full flex items-center justify-center cursor-pointer transition-shadow duration-300"
            >
              {/* SVG 3D Machined Medallion Disc */}
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full block filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
                aria-hidden="true"
              >
                <defs>
                  {/* Outer Bezel Knurling Metallic Gradient */}
                  <linearGradient id={`bezel-grad-${m.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C8D2E0" />
                    <stop offset="35%" stopColor="#7E8B9B" />
                    <stop offset="70%" stopColor="#C8D2E0" />
                    <stop offset="100%" stopColor="#4A5568" />
                  </linearGradient>

                  {/* Recessed Dark Cobalt Center Well */}
                  <radialGradient id={`core-grad-${m.id}`} cx="40%" cy="35%" r="75%">
                    <stop offset="0%" stopColor="#0B1E40" />
                    <stop offset="50%" stopColor="#060A12" />
                    <stop offset="100%" stopColor="#03050A" />
                  </radialGradient>

                  {/* Circular Text Inscription Path */}
                  <path
                    id={`text-path-${m.id}`}
                    d="M 160 30 A 130 130 0 1 1 159.9 30"
                    fill="none"
                  />
                </defs>

                {/* 1. Outer Knurled Bezel (72 Micro-Notches) */}
                <circle
                  cx="160"
                  cy="160"
                  r="156"
                  fill={`url(#bezel-grad-${m.id})`}
                  stroke="#C8D2E0"
                  strokeWidth="2"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="154"
                  fill="none"
                  stroke="#03050A"
                  strokeWidth="3.5"
                  strokeDasharray="4 9.4"
                />

                {/* 2. Anodized Inner Ring (Glowing Red-Orange on Active) */}
                <circle
                  cx="160"
                  cy="160"
                  r="144"
                  fill="none"
                  stroke={isCenter ? '#FF2800' : '#18458B'}
                  strokeWidth={isCenter ? '3' : '1.5'}
                  style={isCenter ? { filter: 'drop-shadow(0 0 10px rgba(255,40,0,0.85))' } : undefined}
                />

                {/* 3. Circular Perimeter Inscription (360° textPath) */}
                <text
                  fontSize="7.8"
                  fontFamily="monospace"
                  fontWeight="600"
                  letterSpacing="2.2"
                  fill={isCenter ? '#F4F6F9' : '#7E8B9B'}
                  opacity={isCenter ? '0.95' : '0.6'}
                >
                  <textPath href={`#text-path-${m.id}`} startOffset="0%">
                    {m.inscription}
                  </textPath>
                </text>

                {/* 4. Recessed Dark Cobalt Center Well */}
                <circle
                  cx="160"
                  cy="160"
                  r="112"
                  fill={`url(#core-grad-${m.id})`}
                  stroke={isCenter ? m.accentColor : '#18458B'}
                  strokeWidth="1.5"
                />

                {/* Precision Concentric Drafting Coordinate Lines */}
                <circle cx="160" cy="160" r="92" fill="none" stroke="#18458B" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.4" />
                <circle cx="160" cy="160" r="72" fill="none" stroke="#C8D2E0" strokeWidth="0.6" strokeDasharray="3 5" opacity="0.25" />

                {/* 5. Center Embossed Numeral & Vector Crest */}
                <g transform="translate(160, 160)">
                  {/* Decorative Diagonal Vector Crosshairs */}
                  <line x1="-30" y1="-30" x2="30" y2="30" stroke="#18458B" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                  <line x1="30" y1="-30" x2="-30" y2="30" stroke="#18458B" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                  {/* Embossed Center Numeral */}
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill={isCenter ? '#F4F6F9' : '#C8D2E0'}
                    stroke="#03050A"
                    strokeWidth="2"
                    style={{ paintOrder: 'stroke fill' }}
                    fontSize="36"
                    fontFamily="Geist Serif, serif"
                    fontWeight="600"
                  >
                    {m.centerBadge}
                  </text>

                  {/* Record Index */}
                  <text
                    x="0"
                    y="36"
                    textAnchor="middle"
                    fill={m.accentColor}
                    fontSize="9"
                    fontFamily="monospace"
                    letterSpacing="1.5"
                    fontWeight="700"
                  >
                    RECORD {m.number}
                  </text>
                </g>

                {/* 6. Dynamic Specular Sheen Arc */}
                <path
                  d="M 60 90 A 110 110 0 0 1 260 90"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </MotionDiv>
          );
        })}
      </div>

      {/* =====================================================================
          UNBOXED EDITORIAL PLINTH BELOW THE ACTIVE MEDALLION
          ===================================================================== */}
      <div className="w-full max-w-[840px] px-4 text-center my-6">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={active.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Issuing Org & Year */}
            <div className="text-xs font-mono text-[#FF2800] uppercase tracking-wider font-semibold">
              {active.orgAndYear} · {active.project}
            </div>

            {/* Award Title (36px Serif #F4F6F9) */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F4F6F9] leading-snug">
              {active.title}
            </h3>

            {/* Concise 2-Sentence Summary */}
            <p className="text-sm sm:text-base font-sans text-[#C8D2E0] leading-relaxed max-w-2xl mx-auto">
              {active.summary}
            </p>

            {/* Link to Case Study */}
            <div className="pt-2">
              <Link
                href={active.link}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF2800] hover:text-[#F4F6F9] transition-colors uppercase border-b border-[#FF2800] pb-0.5"
              >
                <span>Explore Case Study</span>
                <span>→</span>
              </Link>
            </div>
          </MotionDiv>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedallionCarousel;
