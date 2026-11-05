import React, { useState, useEffect } from 'react';
import { SectionContainer } from './ui/SectionContainer';
import { GridCrosshair } from './ui/EditorialPrimitives';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

export interface PodcastItem {
  id: string;
  indexTag: string;
  chapterTitle: string;
  title: string;
  guest: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
  insight: string;
  metrics: { label: string; value: string }[];
  spotifyUrl: string;
  youtubeUrl: string;
  tags: string[];
}

export const podcastItems: PodcastItem[] = [
  {
    id: 'ep01-kaicker',
    indexTag: '01',
    chapterTitle: 'Episode 01 · Computational Geometry',
    title: 'Parametric Topology & Algorithm-Assisted Spatial Design',
    guest: 'Mr. Arjun Kaicker',
    role: 'Head of Analytics',
    organization: 'Zaha Hadid Architects',
    duration: '48 min',
    description:
      'Arjun Kaicker breaks down the computational mathematics powering Zaha Hadid Architects. We dissect how generative algorithms, finite-element pedestrian simulations, and ergonomic topology optimization turn architectural design from an aesthetic hunch into a mathematically verifiable spatial discipline.',
    insight: 'Generative algorithms turn architectural form into a verifiable simulation loop rather than a stylistic hunch.',
    metrics: [
      { label: 'Algorithmic Domain', value: 'Parametric CFD' },
      { label: 'Runtime', value: '48 min' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['Zaha Hadid', 'Parametric Architecture', 'Generative Algorithms'],
  },
  {
    id: 'ep02-wszalek',
    indexTag: '02',
    chapterTitle: 'Episode 02 · Neuromorphic Systems',
    title: 'Cognitive Neurobiology & Machine Decision Boundaries',
    guest: 'Dr. Joseph Wszalek',
    role: 'Cognitive Neuroscientist & Legal Scholar',
    organization: 'University of Wisconsin–Madison',
    duration: '54 min',
    description:
      'Dr. Joseph Wszalek unpacks the cognitive mechanisms of human judgment under acute physiological stress and where modern transformer architectures fail to replicate neurobiological heuristic safety. We explore neuromorphic computing, legal responsibility in autonomous agents, and biological feedback circuits.',
    insight: 'Transformer architectures lack the biological feedback circuits that enforce heuristic safety under acute stress.',
    metrics: [
      { label: 'Research Focus', value: 'Neurobiology' },
      { label: 'Runtime', value: '54 min' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['Neuroscience', 'Machine Perception', 'Cognitive Heuristics'],
  },
  {
    id: 'ep03-mcfetridge',
    indexTag: '03',
    chapterTitle: 'Episode 03 · Distributed Telemetry',
    title: 'Smart Stormwater Grids & Real-Time Meteorological IoT',
    guest: 'Mrs. Alisha McFetridge',
    role: 'Co-Founder & CEO',
    organization: 'RainGrid Inc.',
    duration: '42 min',
    description:
      'Alisha McFetridge details the engineering challenges of managing decentralized stormwater infrastructure across municipal geographies. We dissect edge microcontrollers, predictive radar precipitation modeling, and the firmware fail-safes required when civil infrastructure IoT operates through extreme weather volatility.',
    insight: 'Decentralized municipal IoT requires zero-cloud local failover valve controllers to survive infrastructure grid failures.',
    metrics: [
      { label: 'System Topology', value: 'Decentralized IoT' },
      { label: 'Runtime', value: '42 min' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['IoT Telemetry', 'Municipal Grids', 'Edge Computing'],
  },
  {
    id: 'ep04-hykes',
    indexTag: '04',
    chapterTitle: 'Episode 04 · Clinical Commercialization',
    title: 'Navigating FDA Software Gates & Clinical Hardware Systems',
    guest: 'Mr. Kevin Hykes',
    role: 'President & CEO',
    organization: 'Medical Device Ventures',
    duration: '50 min',
    description:
      'Kevin Hykes shares a playbook honed over decades leading medical technology enterprises. We explore Class II and III FDA clearance pathways for software-as-a-medical-device (SaMD), hardware-in-the-loop surgical validation, and the technical discipline required to take life-saving diagnostic systems from lab bench to hospital OR.',
    insight: 'Class III medical software clearance requires absolute deterministic traceability in hardware-in-the-loop validation.',
    metrics: [
      { label: 'Regulatory Scope', value: 'Class II / III FDA' },
      { label: 'Runtime', value: '50 min' },
    ],
    spotifyUrl: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
    youtubeUrl: 'https://www.youtube.com/@syntinuum',
    tags: ['FDA Clearance', 'Medical Devices', 'SaMD Verification'],
  },
];

export const PodcastSection: React.FC = () => {
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(38); // 0-100%
  const [waveSeed, setWaveSeed] = useState(0);

  const featuredEp = podcastItems[selectedEpisodeIdx];
  const totalCount = podcastItems.length;

  const handlePrev = () => {
    setSelectedEpisodeIdx((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  };

  const handleNext = () => {
    setSelectedEpisodeIdx((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  };

  // Subtle wave motion animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveSeed((s) => (s + 1) % 100);
      setScrubPosition((p) => (p >= 99 ? 0 : p + 0.3));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <SectionContainer
      id="podcast"
      variant="editorial"
      bgMode="clean"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Syntinuum technical journalism podcast"
    >
      {/* Publication-Inspired Magazine Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-mono text-[#A7B2C3]">
            <span className="text-[#FF6B35] font-semibold">04</span>
            <span className="text-[#F3EFE7]/30">/</span>
            <span className="tracking-widest uppercase">Publication &amp; Audio Archive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
            Syntinuum
          </h2>
          <p className="text-base sm:text-lg font-sans text-[#A7B2C3] leading-relaxed">
            Long-form dialogues with engineering founders, research scientists, and technology executives exploring the seam between textbook algorithms and live production fires.
          </p>
        </div>

        {/* Global Platform Links */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
          <a
            href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] inline-flex items-center gap-2 transition-colors font-medium cursor-pointer"
          >
            <span>Spotify Show</span>
            <span className="text-[#4CC38A]">↗</span>
          </a>
          <a
            href="https://www.youtube.com/@syntinuum"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] inline-flex items-center gap-2 transition-colors font-medium cursor-pointer"
          >
            <span>YouTube Channel</span>
            <span className="text-[#FF6B35]">↗</span>
          </a>
        </div>
      </div>

      {/* =====================================================================
          INTERACTIVE AUDIO WAVEFORM & DNA-LIGHTBULB EPISODE CYCLER STAGE
          ===================================================================== */}
      <div className="bg-[#070B12] border border-[#F3EFE7]/[0.12] rounded-[2px] p-6 sm:p-10 lg:p-14 mb-14 relative overflow-hidden shadow-[0_12px_44px_rgba(7,11,18,0.85)]">
        {/* Precision Blueprint Corner Fiducials */}
        <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />
        <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />
        <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />
        <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />

        <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#F5D998] via-[#FF6B35] to-[#82B7FF]" />

        {/* Top Cycler & Telemetry Bar */}
        <div className="pb-6 mb-8 border-b border-[#F3EFE7]/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* DNA Lightbulb Visual Motif + Cycler Controls */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#101B30] border border-[#FF6B35]/40 rounded-[2px] flex items-center justify-center text-[#FF6B35] shrink-0">
              {/* Stylized DNA-Bulb vector mark */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
                <path d="M9 21h6" />
                <path d="M10 9l4 4M14 9l-4 4" stroke="#F5D998" strokeWidth="1.4" />
              </svg>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[#FF6B35] uppercase tracking-wider font-semibold">
                SYNTINUUM WAVEFORM CYCLER
              </div>
              <div className="text-xs font-mono text-[#A7B2C3]">
                Episode {featuredEp.indexTag} / 0{totalCount} · 48kHz Master Audio
              </div>
            </div>
          </div>

          {/* Episode Cycler Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1.5 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] hover:text-[#FF6B35] border border-[#F3EFE7]/15 rounded-[2px] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Previous Episode"
            >
              <span>←</span>
              <span>Prev Episode</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] hover:text-[#FF6B35] border border-[#F3EFE7]/15 rounded-[2px] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Next Episode"
            >
              <span>Next Episode</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Interactive Audio Waveform Spectrum Bar */}
        <div className="mb-10 bg-[#0A101C] border border-[#F3EFE7]/[0.08] p-4 sm:p-5 rounded-[2px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#7A889B] mb-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-0.5 bg-[#FF6B35] text-[#070B12] font-semibold rounded-[2px] cursor-pointer hover:bg-[#FF8547] transition-colors"
              >
                {isPlaying ? 'PAUSE ❚❚' : 'SIMULATE PLAY ▶'}
              </button>
              <span className="text-[#A7B2C3]">OPUS 128kbps</span>
            </div>
            <div className="tabular-nums text-[#F5D998]">
              {Math.floor((scrubPosition / 100) * 48)}:
              {String(Math.floor(((scrubPosition / 100) * 48 * 60) % 60)).padStart(2, '0')} / {featuredEp.duration}
            </div>
          </div>

          {/* 36 Waveform Frequency Bars (Clickable Scrub Bar) */}
          <div
            className="w-full h-12 flex items-end gap-1 cursor-ew-resize py-1 select-none"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
              setScrubPosition(pct);
            }}
            title="Click or drag to scrub episode waveform"
          >
            {Array.from({ length: 48 }).map((_, i) => {
              const pct = (i / 47) * 100;
              const isPast = pct <= scrubPosition;
              // Generate organic frequency height based on index and seed
              const baseHeight = 12 + Math.abs(Math.sin((i + waveSeed * 0.1) * 0.45) * 28) + Math.cos(i * 0.8) * 8;
              const clampedHeight = Math.round(Math.max(8, Math.min(44, baseHeight)));

              return (
                <div
                  key={i}
                  className="flex-1 rounded-[1px] transition-all duration-150"
                  style={{
                    height: `${clampedHeight}px`,
                    backgroundColor: isPast ? '#FF6B35' : 'rgba(167, 178, 195, 0.22)',
                    boxShadow: isPast && i === Math.floor((scrubPosition / 100) * 47) ? '0 0 8px #FF6B35' : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Episode Content Spread */}
        <AnimatePresence mode="wait">
          <MotionDiv
            key={featuredEp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
          >
            {/* Left Column (Cols 1–5): Episode Meta, Speaker & Editorial Insight */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#FF6B35] uppercase tracking-wider block font-semibold">
                  {featuredEp.chapterTitle}
                </span>
                <div className="text-2xl sm:text-3xl font-serif text-[#F3EFE7] font-normal leading-snug">
                  {featuredEp.guest}
                </div>
                <div className="text-sm font-sans text-[#F5D998] font-medium">
                  {featuredEp.role} · {featuredEp.organization}
                </div>
              </div>

              {/* Editorial Key Perspective */}
              <div className="pt-4 border-t border-[#F3EFE7]/[0.08] space-y-2">
                <span className="text-[11px] font-mono text-[#82B7FF] tracking-wider block">
                  Core Engineering Perspective:
                </span>
                <p className="text-[15px] font-serif italic text-[#F3EFE7] leading-relaxed">
                  "{featuredEp.insight}"
                </p>
              </div>

              {/* Metrics Chips */}
              <div className="flex items-center gap-3 text-xs font-mono text-[#A7B2C3] pt-1">
                {featuredEp.metrics.map((m) => (
                  <div key={m.label} className="px-3 py-1.5 bg-[#101B30] border border-[#F3EFE7]/[0.1] rounded-[2px]">
                    <span className="text-[#7A889B]">{m.label}: </span>
                    <span className="text-[#F3EFE7] font-semibold">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (Cols 6–12): Title, Deep Narrative & Action CTAs */}
            <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-[#F3EFE7]/[0.08] lg:pl-12">
              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-serif text-[#F3EFE7] leading-tight font-normal">
                {featuredEp.title}
              </h3>

              <p className="text-[15px] sm:text-[16px] font-sans text-[#A7B2C3] leading-[1.74]">
                {featuredEp.description}
              </p>

              <div className="text-xs font-mono text-[#7A889B]">
                <span className="text-[#F5D998]">Explored Topics: </span>
                <span>{featuredEp.tags.join(' · ')}</span>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                <a
                  href={featuredEp.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-semibold px-6 py-3.5 text-xs font-mono inline-flex items-center gap-2 transition-colors select-none rounded-[2px] shadow-[0_0_15px_rgba(255,107,53,0.25)]"
                >
                  <span>Play Conversation on Spotify</span>
                  <span>↗</span>
                </a>
                <a
                  href={featuredEp.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 px-5 py-3.5 text-xs font-mono inline-flex items-center gap-2 transition-colors select-none font-medium rounded-[2px]"
                >
                  <span>Watch on YouTube</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </MotionDiv>
        </AnimatePresence>
      </div>

      {/* Supporting Episode Archive Browser */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-[#7A889B] uppercase tracking-wider px-2">
          SELECT FROM CONVERSATION ARCHIVE
        </div>

        <div className="border border-[#F3EFE7]/[0.08] divide-y divide-[#F3EFE7]/[0.08] bg-[#070B12] rounded-[2px] overflow-hidden">
          {podcastItems.map((ep, idx) => {
            const isSelected = selectedEpisodeIdx === idx;
            return (
              <button
                key={ep.id}
                onClick={() => setSelectedEpisodeIdx(idx)}
                type="button"
                className={`w-full p-5 sm:p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#101B30]' : 'hover:bg-[#101B30]/40'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className={`font-mono text-xs font-semibold tabular-nums ${isSelected ? 'text-[#FF6B35]' : 'text-[#7A889B]'}`}>
                    {ep.indexTag}
                  </span>
                  <div>
                    <span className={`text-base font-serif block transition-colors ${isSelected ? 'text-[#F5D998]' : 'text-[#F3EFE7]'}`}>
                      {ep.guest} — <span className="font-sans font-normal text-sm text-[#A7B2C3]">{ep.title}</span>
                    </span>
                    <span className="text-xs font-mono text-[#7A889B] block mt-0.5">
                      {ep.organization}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-[#7A889B] shrink-0">
                  <span>{ep.duration}</span>
                  <span className={isSelected ? 'text-[#FF6B35] font-semibold' : 'text-[#7A889B]'}>
                    {isSelected ? '● ACTIVE' : 'LOAD EPISODE →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};

export default PodcastSection;
