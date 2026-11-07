import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSection } from './ThemeSection';

const MotionDiv = motion.div as any;

interface MedallionRecord {
  id: string;
  number: string;
  shortTag: string;
  title: string;
  year: string;
  systemName: string;
  scope: string;
  collaborators?: string;
  metrics: { label: string; value: string }[];
  citation: string;
  materialTheme: {
    rimGradient: string;
    discBg: string;
    innerRing: string;
    accentColor: string;
    reliefText: string;
    glowShadow: string;
  };
  linkTarget?: string;
}

const MEDALLIONS: MedallionRecord[] = [
  {
    id: 'datafest-2026',
    number: '01',
    shortTag: 'ASA DATAFEST 2026 · 1ST PLACE',
    title: '1st Place — Best Use of External Data',
    year: '2026',
    systemName: 'RouteRx / Careline',
    scope: 'Bi-directional healthcare transit optimization across 141 Topeka, KS census blocks.',
    collaborators: 'Built with Samay Patel, Harsha Kalivarapu, Sudhish Gopalakrishnan',
    metrics: [
      { label: 'Isochrone Latency', value: '< 15 ms' },
      { label: 'Census Blocks', value: '141 Blocks' },
      { label: 'Transit Gap Solved', value: '42.3%' },
    ],
    citation:
      'Awarded by the American Statistical Association (ASA) for mathematical rigor in synthesizing OpenStreetMap road networks, CDC social vulnerability indexes, and bus timetables into sub-15ms multi-modal transit accessibility isochrones.',
    materialTheme: {
      rimGradient: 'linear-gradient(135deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)',
      discBg: 'radial-gradient(circle at 35% 30%, #2A1D0B 0%, #0A0805 100%)',
      innerRing: '#F59E0B',
      accentColor: '#D97706',
      reliefText: 'ASA 2026',
      glowShadow: '0 25px 60px rgba(245, 158, 11, 0.35)',
    },
    linkTarget: '/projects/routerx-careline-hub',
  },
  {
    id: 'datafest-2025',
    number: '02',
    shortTag: 'ASA DATAFEST 2025 · 1ST PLACE',
    title: '1st Place — Best Use of External Data',
    year: '2025',
    systemName: 'Hack to the Future',
    scope: 'Macroeconomic & corporate tax spatial location modeling across multi-state commercial corridors.',
    collaborators: 'Collegiate Competitive Team',
    metrics: [
      { label: 'Data Points Modeled', value: '500,000+' },
      { label: 'Spatial Corridor', value: 'Multi-State' },
      { label: 'Evaluation Tier', value: '1st in Region' },
    ],
    citation:
      'Awarded by ASA judges for geospatial regression modeling determining how municipal corporate incentives alter distribution footprint clustering across transportation hubs.',
    materialTheme: {
      rimGradient: 'linear-gradient(135deg, #FFFFFF 0%, #C4D1D9 50%, #8FA3B0 100%)',
      discBg: 'radial-gradient(circle at 35% 30%, #1A2228 0%, #0B0E11 100%)',
      innerRing: '#94A3B8',
      accentColor: '#64748B',
      reliefText: 'ASA 2025',
      glowShadow: '0 25px 60px rgba(148, 163, 184, 0.35)',
    },
    linkTarget: '#projects',
  },
  {
    id: 'ibm-watsonx-2026',
    number: '03',
    shortTag: 'IBM SKILLSBUILD AI HACKATHON · 2026',
    title: 'IBM SkillsBuild AI in Education Showcase',
    year: '2026',
    systemName: 'Vantage Platform',
    scope: 'Architected AI educational navigation system powered by IBM watsonx and IBM Cloud.',
    collaborators: 'IBM SkillsBuild National Showcase',
    metrics: [
      { label: 'Backbone', value: 'watsonx.ai' },
      { label: 'Latency Gate', value: '< 250 ms' },
      { label: 'Curriculum Depth', value: 'K-16 Adaptive' },
    ],
    citation:
      'Recognized for developing zero-shot curriculum adaptation trees that guide non-traditional students through personalized computer science pathways without prompt drift.',
    materialTheme: {
      rimGradient: 'linear-gradient(135deg, #A5B4FC 0%, #38BDF8 50%, #1D4ED8 100%)',
      discBg: 'radial-gradient(circle at 35% 30%, #0D1B36 0%, #050A14 100%)',
      innerRing: '#38BDF8',
      accentColor: '#2563EB',
      reliefText: 'IBM AI',
      glowShadow: '0 25px 60px rgba(56, 189, 248, 0.35)',
    },
    linkTarget: '#projects',
  },
  {
    id: 'benchmarks-2026',
    number: '04',
    shortTag: 'DATA I/O & BENCHMARK DISTINCTIONS · 2026',
    title: '94.2% Hit@5 Retrieval & Data I/O Geospatial Engine',
    year: '2026',
    systemName: 'TamilTrove & NYC OS Market Physics Engine v2.0',
    scope: '120-query hybrid search benchmark & 6-model Deck.GL 3D urban market simulation.',
    collaborators: 'Independent Engineering Syndicate',
    metrics: [
      { label: 'TamilTrove Hit@5', value: '94.2%' },
      { label: 'Transactions Modeled', value: '1,000,000+' },
      { label: 'Physics Visualizer', value: 'Deck.GL 3D' },
    ],
    citation:
      'Benchmarked TamilTrove against 120 transliterated search queries yielding a verified 94.2% Hit@5 retrieval rate; paired with NYC OS Market Physics Engine parsing 1M+ transactions via vectorized clustering.',
    materialTheme: {
      rimGradient: 'linear-gradient(135deg, #FCA5A5 0%, #E11D48 50%, #881337 100%)',
      discBg: 'radial-gradient(circle at 35% 30%, #2A0D14 0%, #0C0305 100%)',
      innerRing: '#FB7185',
      accentColor: '#E11D48',
      reliefText: 'BENCH 2026',
      glowShadow: '0 25px 60px rgba(225, 29, 72, 0.35)',
    },
    linkTarget: '/projects/tamiltrove',
  },
  {
    id: 'leadership-2026',
    number: '05',
    shortTag: 'COLLEGIATE LEADERSHIP & INNOVATION · 2026',
    title: 'NSLS Nominee & OSU Innovation Analyst',
    year: '2026',
    systemName: 'Philocracy & OSU Center for Innovation Strategies',
    scope: 'Nominated to OSU NSLS Chapter; serving as Co-CEO of Philocracy and Innovation Analyst at OSU CIS.',
    collaborators: 'The Ohio State University',
    metrics: [
      { label: 'Society', value: 'NSLS' },
      { label: 'Venture Roadmap', value: 'Co-CEO' },
      { label: 'Industry Liaison', value: 'Honda 99P Labs' },
    ],
    citation:
      'Nominated to the National Society of Leadership and Success (NSLS) Ohio State Chapter for academic and executive integrity; co-leading Philocracy and directing corporate connected-mobility research at the OSU Center for Innovation Strategies.',
    materialTheme: {
      rimGradient: 'linear-gradient(135deg, #FDE68A 0%, #D97706 50%, #78350F 100%)',
      discBg: 'radial-gradient(circle at 35% 30%, #291807 0%, #0A0602 100%)',
      innerRing: '#F59E0B',
      accentColor: '#B45309',
      reliefText: 'LEAD 2026',
      glowShadow: '0 25px 60px rgba(180, 83, 9, 0.35)',
    },
    linkTarget: '#experience',
  },
];

export const AchievementsGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);

  const totalCount = MEDALLIONS.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  }, [totalCount]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  }, [totalCount]);

  // Pointer drag gesture for orbital carousel
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diff = e.clientX - dragStartXRef.current;
    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
  };

  // Keyboard navigation when active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const activeRecord = MEDALLIONS[activeIndex];

  return (
    <ThemeSection
      id="achievements"
      theme="titanium-ivory"
      aria-label="Distinctions, competitive victories and credentials"
      className="border-b border-[#0D0D11]/10 flex flex-col justify-between"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#B45309]">
              <span className="w-6 h-px bg-[#B45309]" />
              <span>04 // COMPETITIVE AWARDS &amp; DISTINCTIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#0D0D11] leading-tight tracking-tight">
              Recognition &amp; Distinctions
            </h2>
            <p className="text-base sm:text-lg font-sans text-[#575760] leading-relaxed">
              Consecutive American Statistical Association hackathon championships, algorithmic honors, and executive research nominations.
            </p>
          </div>

          {/* Carousel Next / Prev Controls */}
          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Medallion"
              className="w-12 h-12 rounded-[2px] bg-[#DFD9CD] hover:bg-[#D4CCBF] border border-[#0D0D11]/20 flex items-center justify-center text-[#0D0D11] transition-colors cursor-pointer select-none"
            >
              ←
            </button>
            <span className="px-3 text-[#575760]">
              {activeIndex + 1} / {totalCount}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next Medallion"
              className="w-12 h-12 rounded-[2px] bg-[#DFD9CD] hover:bg-[#D4CCBF] border border-[#0D0D11]/20 flex items-center justify-center text-[#0D0D11] transition-colors cursor-pointer select-none"
            >
              →
            </button>
          </div>
        </div>

        {/* =====================================================================
            3D PERSPECTIVE MEDALLION ORBITAL CAROUSEL
            ===================================================================== */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
          style={{ perspective: '1200px' }}
        >
          {MEDALLIONS.map((m, idx) => {
            const offset = (idx - activeIndex + totalCount) % totalCount;
            // Map offset to symmetrical visual positions: 0 is center, 1 is right, -1 is left
            let relativePos = offset;
            if (relativePos > totalCount / 2) relativePos -= totalCount;

            const isCenter = relativePos === 0;
            const isVisible = Math.abs(relativePos) <= 2;

            if (!isVisible) return null;

            const xTranslate = relativePos * 260; // horizontal spacing
            const zTranslate = -Math.abs(relativePos) * 160; // depth recess
            const yRotate = relativePos * -25; // face toward viewer
            const scale = isCenter ? 1.08 : 0.85;
            const opacity = isCenter ? 1 : Math.abs(relativePos) === 1 ? 0.6 : 0.25;

            return (
              <MotionDiv
                key={m.id}
                onClick={() => setActiveIndex(idx)}
                animate={{
                  x: xTranslate,
                  z: zTranslate,
                  rotateY: yRotate,
                  scale,
                  opacity,
                }}
                transition={{ type: 'spring', stiffness: 240, damping: 25 }}
                className="absolute w-[220px] sm:w-[260px] aspect-square rounded-full flex items-center justify-center cursor-pointer transition-shadow duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: isCenter ? m.materialTheme.glowShadow : 'none',
                }}
              >
                {/* Outer Beveled Metallic Rim */}
                <div
                  className="absolute inset-0 rounded-full p-2.5 shadow-2xl"
                  style={{
                    background: m.materialTheme.rimGradient,
                  }}
                >
                  {/* Subtle Bevel Shadow Step */}
                  <div
                    className="w-full h-full rounded-full p-2 border border-white/40 shadow-inner flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: m.materialTheme.discBg,
                    }}
                  >
                    {/* Concentric Precision Dial Rings */}
                    <div
                      className="absolute inset-3 rounded-full border border-dashed opacity-40 pointer-events-none"
                      style={{ borderColor: m.materialTheme.innerRing }}
                    />
                    <div
                      className="absolute inset-6 rounded-full border opacity-30 pointer-events-none"
                      style={{ borderColor: m.materialTheme.innerRing }}
                    />

                    {/* Dynamic Specular Sheen Highlight */}
                    <div className="absolute -top-[40%] -left-[40%] w-[180%] h-[180%] bg-gradient-to-br from-white/25 via-transparent to-transparent pointer-events-none transform -rotate-45" />

                    {/* Embossed Relief Iconography & Number */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                      <span className="text-[10px] font-mono tracking-widest text-white/60 mb-1">
                        RECORD {m.number}
                      </span>
                      <div
                        className="text-lg sm:text-xl font-raleway font-black tracking-tight"
                        style={{ color: m.materialTheme.innerRing }}
                      >
                        {m.materialTheme.reliefText}
                      </div>
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mt-1">
                        {m.year}
                      </span>
                    </div>

                    {/* Bottom Status Ticker on Disc */}
                    <div className="absolute bottom-3 text-[9px] font-mono text-white/50 tracking-wider">
                      VERIFIED MEDAL
                    </div>
                  </div>
                </div>
              </MotionDiv>
            );
          })}
        </div>

        {/* =====================================================================
            SYNCHRONIZED EDITORIAL INSPECTION PEDESTAL PLINTH
            ===================================================================== */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <MotionDiv
              key={activeRecord.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-12 bg-[#E4DFC2]/40 border border-[#0D0D11]/15 rounded-[2px] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Title & Citation (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-0.5 bg-[#0D0D11] text-[#ECE9E1] rounded-[2px] font-semibold">
                    {activeRecord.shortTag}
                  </span>
                  <span className="text-[#575760]">{activeRecord.systemName}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-[#0D0D11] leading-snug">
                  {activeRecord.title}
                </h3>

                <p className="text-sm sm:text-base font-sans text-[#2B2B30] leading-relaxed">
                  {activeRecord.citation}
                </p>

                {activeRecord.collaborators && (
                  <div className="text-xs font-mono text-[#575760] pt-1">
                    COLLABORATION: {activeRecord.collaborators}
                  </div>
                )}

                <div className="pt-3">
                  <Link
                    href={activeRecord.linkTarget || '#projects'}
                    className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#B45309] hover:text-[#0D0D11] border-b border-[#B45309] pb-0.5 transition-colors uppercase"
                  >
                    <span>View Winning Architecture in System Field</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Quantitative Impact Metrics (5 Cols) */}
              <div className="lg:col-span-5 bg-[#ECE9E1] p-6 rounded-[2px] border border-[#0D0D11]/15 space-y-4">
                <div className="text-xs font-mono text-[#B45309] uppercase tracking-wider pb-2 border-b border-[#0D0D11]/10">
                  VERIFIED IMPACT METRICS
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {activeRecord.metrics.map((met, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="text-[11px] font-mono text-[#575760]">{met.label}</div>
                      <div className="text-base sm:text-lg font-mono font-bold text-[#0D0D11]">
                        {met.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </MotionDiv>
          </AnimatePresence>
        </div>

      </div>
    </ThemeSection>
  );
};

export default AchievementsGallery;
