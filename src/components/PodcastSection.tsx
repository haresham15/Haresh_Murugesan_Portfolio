import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridCrosshair } from './ui/GridCrosshair';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export interface PodcastItem {
  id: string;
  indexTag: string;
  badge: string;
  chapterTitle: string;
  title: string;
  guest?: string;
  role?: string;
  organization?: string;
  duration?: string;
  description: string;
  metrics: { label: string; value: string; detail: string }[];
  spotifyUrl: string;
  youtubeUrl?: string;
  tags: string[];
}

export const podcastItems: PodcastItem[] = [
  {
    id: 'thesis',
    indexTag: '00',
    badge: 'SERIES FOUNDATION // THESIS & IMPACT',
    chapterTitle: '00 THESIS',
    title: 'Syntropy + Continuum: Decoding How Builders Make What Comes Next',
    guest: 'Syntinuum Audio Network',
    role: 'Created & Hosted by Haresh Murugesan',
    organization: '3+ Years · 10+ Technical Founder Dialogues',
    duration: '100K+ Impressions',
    description:
      'Syntinuum was launched from a conviction that the most consequential engineering decisions happen at the messy seams between textbook computer science and live production constraints. Over 3 years, the series has produced deep, architecture-first discussions with biotech founders, principal architects, and research leaders.',
    metrics: [
      { label: 'Short-Form Reach', value: '126.4K+', detail: 'Verified organic reach across YouTube & Spotify' },
      { label: 'Long-Form Video Views', value: '10.5K+', detail: 'In-depth multi-camera engineering interviews' },
      { label: 'Dialogues Produced', value: '10+ Founders', detail: 'Healthcare, aerospace, robotics & AI leaders' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['Systems Architecture', 'Founder Dialogues', 'Technical Journalism', 'Biotech & Robotics'],
  },
  {
    id: 'ep01-kaicker',
    indexTag: '01',
    badge: 'EPISODE 01 // COMPUTATIONAL GEOMETRY',
    chapterTitle: '01 KAICKER',
    title: 'Parametric Topology & Algorithm-Assisted Spatial Design',
    guest: 'Mr. Arjun Kaicker',
    role: 'Head of Analytics',
    organization: 'Zaha Hadid Architects',
    duration: '48 min',
    description:
      'Arjun Kaicker breaks down the computational mathematics powering Zaha Hadid Architects. We dissect how generative algorithms, finite-element pedestrian simulations, and ergonomic topology optimization turn architectural design from an aesthetic hunch into a mathematically verifiable spatial discipline.',
    metrics: [
      { label: 'Algorithmic Domain', value: 'Parametric CFD', detail: 'Real-time spatial airflow & ergonomics' },
      { label: 'Episode Runtime', value: '48 min', detail: 'Deep algorithmic & architectural breakdown' },
      { label: 'Key Finding', value: 'Generative Seams', detail: 'Simulation-in-the-loop geometric generation' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['Zaha Hadid', 'Parametric Architecture', 'Generative Algorithms', 'Ergonomic Data'],
  },
  {
    id: 'ep02-wszalek',
    indexTag: '02',
    badge: 'EPISODE 02 // NEUROMORPHIC SYSTEMS',
    chapterTitle: '02 WSZALEK',
    title: 'Cognitive Neurobiology & Machine Decision Boundaries',
    guest: 'Dr. Joseph Wszalek',
    role: 'Cognitive Neuroscientist & Legal Scholar',
    organization: 'University of Wisconsin–Madison',
    duration: '54 min',
    description:
      'Dr. Joseph Wszalek unpacks the cognitive mechanisms of human judgment under acute physiological stress and where modern transformer architectures fail to replicate neurobiological heuristic safety. We explore neuromorphic computing, legal responsibility in autonomous agents, and biological feedback circuits.',
    metrics: [
      { label: 'Research Focus', value: 'Neurobiology', detail: 'Cognitive heuristics under extreme stress' },
      { label: 'Episode Runtime', value: '54 min', detail: 'Uncut academic & philosophical inquiry' },
      { label: 'Key Finding', value: 'Safety Circuits', detail: 'Neuromorphic feedback loops in autonomy' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['Neuroscience', 'Machine Perception', 'Cognitive Heuristics', 'Decision Architecture'],
  },
  {
    id: 'ep03-mcfetridge',
    indexTag: '03',
    badge: 'EPISODE 03 // DISTRIBUTED TELEMETRY',
    chapterTitle: '03 MCFETRIDGE',
    title: 'Smart Stormwater Grids & Real-Time Meteorological IoT',
    guest: 'Mrs. Alisha McFetridge',
    role: 'Co-Founder & CEO',
    organization: 'RainGrid Inc.',
    duration: '42 min',
    description:
      'Alisha McFetridge details the engineering challenges of managing decentralized stormwater infrastructure across municipal geographies. We dissect edge microcontrollers, predictive radar precipitation modeling, and the firmware fail-safes required when civil infrastructure IoT operates through extreme weather volatility.',
    metrics: [
      { label: 'System Topology', value: 'Decentralized IoT', detail: 'Edge telemetry grid across urban basins' },
      { label: 'Episode Runtime', value: '42 min', detail: 'Municipal infrastructure & firmware design' },
      { label: 'Key Finding', value: 'Edge Resilience', detail: 'Zero-cloud local failover valve controllers' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['IoT Telemetry', 'Municipal Grids', 'Edge Computing', 'Predictive Weather'],
  },
  {
    id: 'ep04-hykes',
    indexTag: '04',
    badge: 'EPISODE 04 // CLINICAL COMMERCIALIZATION',
    chapterTitle: '04 HYKES',
    title: 'Navigating FDA Software Gates & Clinical Hardware Systems',
    guest: 'Mr. Kevin Hykes',
    role: 'President & CEO',
    organization: 'Medical Device Ventures',
    duration: '50 min',
    description:
      'Kevin Hykes shares a playbook honed over decades leading medical technology enterprises. We explore Class II and III FDA clearance pathways for software-as-a-medical-device (SaMD), hardware-in-the-loop surgical validation, and the technical discipline required to take life-saving diagnostic systems from lab bench to hospital OR.',
    metrics: [
      { label: 'Regulatory Scope', value: 'Class II / III FDA', detail: 'Deterministic verification protocols' },
      { label: 'Episode Runtime', value: '50 min', detail: 'Executive med-tech commercialization' },
      { label: 'Key Finding', value: 'Traceability', detail: 'Audit-ready hardware-in-the-loop loops' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['FDA Clearance', 'Medical Devices', 'SaMD Verification', 'Biotech Leadership'],
  },
];

export const PodcastSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [bulbRotation, setBulbRotation] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  const activeItem = podcastItems[activeIndex];

  const handleCycleNext = () => {
    setActiveIndex((prev) => (prev + 1) % podcastItems.length);
    setBulbRotation((prev) => prev + 180);
  };

  const handleCyclePrev = () => {
    setActiveIndex((prev) => (prev - 1 + podcastItems.length) % podcastItems.length);
    setBulbRotation((prev) => prev - 180);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) return;
      if (e.key === 'ArrowRight') handleCycleNext();
      if (e.key === 'ArrowLeft') handleCyclePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalBars = 52;
  const barsPerChapter = totalBars / podcastItems.length;

  return (
    <section
      id="podcast"
      ref={sectionRef}
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#0A1424]"
      aria-label="Syntinuum: Endless Evolutions Podcast"
    >
      {/* Precision Corner Crosshair */}
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* ------------------------------------------------------------------ */}
      {/* TOP DECK: SECTION HEADING + FREQUENCY CYCLE BUTTONS                */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
            <span className="text-[#FFB86C] font-semibold">03 // ARCHITECTURAL DIALOGUES</span>
            <span>INDEX // 04.1</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F4EFE6] leading-none tracking-tight">
            Syntinuum: Endless Evolutions
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#B0BCCB] max-w-2xl leading-relaxed">
            In-depth engineering dialogues exploring system architecture, mathematical modeling, and production trade-offs with founders, research scientists, and CEOs.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#8A99AD] hidden sm:inline">
            FREQUENCY {activeItem.indexTag} / 04
          </span>
          <div className="flex items-center border border-[#F4EFE6]/15 divide-x divide-[#F4EFE6]/15">
            <button
              onClick={handleCyclePrev}
              className="px-4 py-2 hover:bg-[#162B4C] text-[#F4EFE6] transition-colors cursor-pointer"
              aria-label="Previous episode"
            >
              ←
            </button>
            <button
              onClick={handleCycleNext}
              className="px-4 py-2 hover:bg-[#162B4C] text-[#F4EFE6] transition-colors cursor-pointer"
              aria-label="Next episode"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CONSOLE CONTROL DECK: 88px ROTARY DIAL + 52-BAR WAVEFORM ARRAY     */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 bg-[#07090D]/50">
        
        {/* The 88px Interactive DNA-Filament Lightbulb Rotary Clicker */}
        <div className="flex flex-col items-center text-center shrink-0">
          <MotionButton
            onClick={handleCycleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative w-20 h-20 sm:w-22 sm:h-22 bg-[#0C1729] border border-[#FFB86C]/50 hover:border-[#FFB86C] flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,107,43,0.3)] group transition-all"
            aria-label="Click DNA-Lightbulb to cycle frequency"
          >
            <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
            <GridCrosshair className="absolute -bottom-[4.5px] -right-[4.5px]" />

            {/* Lightbulb Contour with DNA Double-Helix Filament */}
            <svg viewBox="0 0 44 44" className="w-12 h-12" fill="none">
              <path
                d="M 14 30 L 30 30 M 16 34 L 28 34 M 19 38 L 25 38"
                stroke="#9BA8B8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M 14 26 C 11 23 9 19 9 14 C 9 6.8 14.8 1 22 1 C 29.2 1 35 6.8 35 14 C 35 19 33 23 30 26 Z"
                stroke="#70A5FF"
                strokeWidth="1.8"
                className="group-hover:stroke-[#FFB86C] transition-colors"
              />
              <g style={{ transformOrigin: '22px 14px', transform: `rotate(${bulbRotation}deg)`, transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <path d="M 16 7 C 20 9 20 12 16 14 C 12 16 12 19 16 21" stroke="#FF6B2B" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 28 7 C 24 9 24 12 28 14 C 32 16 32 19 28 21" stroke="#FFE9AE" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="18" y1="9" x2="26" y2="9" stroke="#FFB86C" strokeWidth="1.2" />
              </g>
            </svg>
          </MotionButton>

          <span className="text-[10px] font-mono text-[#8A99AD] mt-2 tracking-wider">
            CYCLE FREQUENCY
          </span>
        </div>

        {/* The 52-Bar Sculpted Waveform Visualizer */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
            <span>ACOUSTIC FREQUENCY SPECTRUM</span>
            <span className="text-[#FFB86C] font-semibold">{activeItem.badge}</span>
          </div>

          {/* Waveform Bar Track */}
          <div
            className="relative h-24 sm:h-28 bg-[#07090D] border border-[#F4EFE6]/10 p-3 flex items-end justify-between gap-1 overflow-hidden"
            onMouseLeave={() => setHoveredBar(null)}
          >
            {Array.from({ length: totalBars }).map((_, barIdx) => {
              const chapterIdx = Math.min(podcastItems.length - 1, Math.floor(barIdx / barsPerChapter));
              const isCurrentChapter = chapterIdx === activeIndex;
              const subIdx = barIdx % barsPerChapter;
              const bell = Math.sin((subIdx / barsPerChapter) * Math.PI);
              let baseHeightPct = 20 + bell * 60 + Math.sin(barIdx * 1.4) * 12;

              if (hoveredBar !== null) {
                const dist = Math.abs(barIdx - hoveredBar);
                if (dist < 6) {
                  const boost = Math.exp(-(dist * dist) / 8) * 35;
                  baseHeightPct = Math.min(98, baseHeightPct + boost);
                }
              }

              return (
                <button
                  key={barIdx}
                  onClick={() => setActiveIndex(chapterIdx)}
                  onMouseEnter={() => setHoveredBar(barIdx)}
                  className="relative flex-1 h-full flex items-end justify-center cursor-pointer focus:outline-none"
                  aria-label={`Select ${podcastItems[chapterIdx].badge}`}
                >
                  <MotionDiv
                    animate={{
                      height: `${baseHeightPct}%`,
                      backgroundColor: isCurrentChapter ? '#FF6B2B' : '#162B4C',
                    }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full transition-all ${
                      isCurrentChapter
                        ? 'bg-gradient-to-t from-[#C8321E] via-[#FF6B2B] to-[#FFE9AE] shadow-[0_0_8px_#FF6B2B]'
                        : 'bg-[#183158] hover:bg-[#70A5FF]/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Chapter Baseline Ticks */}
          <div className="grid grid-cols-5 text-center text-xs font-mono text-[#8A99AD] pt-1">
            {podcastItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`transition-colors cursor-pointer text-left sm:text-center ${
                  activeIndex === idx ? 'text-[#FFB86C] font-semibold' : 'text-[#8A99AD] hover:text-[#F4EFE6]'
                }`}
              >
                <span>{item.chapterTitle}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LOWER DECK: 8-COL ACTIVE TITLE/NARRATIVE + 4-COL TABULAR METRICS   */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeItem.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#F4EFE6]/10"
        >
          {/* Cols 1–8: Narrative and Credentials */}
          <div className="lg:col-span-8 p-6 sm:p-8 lg:p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
              <span className="text-[#FFB86C] font-semibold tracking-wider">
                {activeItem.badge}
              </span>
              {activeItem.duration && (
                <span className="text-[#8A99AD]">
                  {'// RUNTIME: '}{activeItem.duration}
                </span>
              )}
              {activeItem.role && (
                <span className="text-[#70A5FF] font-sans">
                  {'// '}{activeItem.role} {activeItem.organization ? `· ${activeItem.organization}` : ''}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-serif font-normal text-[#F4EFE6] leading-[1.08] tracking-tight">
              {activeItem.title}
            </h3>

            <p className="text-[17px] sm:text-[18px] font-sans text-[#C4CDD8] leading-[1.7]">
              {activeItem.description}
            </p>

            {/* Middle-Dot Topics List (BAN Cramped Pills) */}
            <div className="pt-4 border-t border-[#F4EFE6]/10 text-xs font-mono text-[#8A99AD] flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-[#FF6B2B] font-semibold uppercase tracking-wider text-[11px]">TOPICS //</span>
              {activeItem.tags.map((tag, tIdx) => (
                <React.Fragment key={tIdx}>
                  <span className="hover:text-[#F4EFE6] transition-colors">{tag}</span>
                  {tIdx < activeItem.tags.length - 1 && <span className="text-[#F4EFE6]/25 select-none">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Cols 9–12: 3 Borderless Tabular Takeaways + Flush Action Strips */}
          <div className="lg:col-span-4 p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-8 bg-[#07090D]/30">
            <div className="space-y-6">
              <span className="text-xs font-mono text-[#8A99AD] uppercase tracking-wider block">
                KEY FINDINGS &amp; TELEMETRY
              </span>

              <div className="divide-y divide-[#F4EFE6]/10">
                {activeItem.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="py-4 space-y-1 first:pt-0 last:pb-0">
                    <span className="text-[11px] font-mono text-[#8A99AD] uppercase block">
                      {m.label}
                    </span>
                    <div className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] tabular-nums font-normal">
                      {m.value}
                    </div>
                    <p className="text-xs font-sans text-[#70A5FF]">
                      {m.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Flush Full-Width Action Cells */}
            <div className="pt-6 border-t border-[#F4EFE6]/10 flex flex-col gap-3 text-xs font-mono">
              <a
                href={activeItem.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold px-6 py-4 flex items-center justify-between transition-colors select-none"
              >
                <span>Listen on Spotify</span>
                <span>↗</span>
              </a>
              <button
                onClick={handleCycleNext}
                className="w-full bg-[#0C1729] hover:bg-[#132542] text-[#F4EFE6] border border-[#F4EFE6]/15 px-6 py-3.5 flex items-center justify-between transition-colors cursor-pointer select-none"
              >
                <span>Next Frequency</span>
                <span className="text-[#FFB86C]">→</span>
              </button>
            </div>

          </div>
        </MotionDiv>
      </AnimatePresence>
    </section>
  );
};

export default PodcastSection;
