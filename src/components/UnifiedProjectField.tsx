import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlateHealios } from './plates/PlateHealios';
import { PlateApexis } from './plates/PlateApexis';
import { PlateRouteRx } from './plates/PlateRouteRx';
import { PlateTempo } from './plates/PlateTempo';

interface FlagshipExhibitionItem {
  index: string;
  domain: string;
  title: string;
  thesis: string;
  paragraph: string;
  metric1: { value: string; label: string };
  metric2: { value: string; label: string };
  stack: string;
  slug: string;
  github: string;
  liveId: string;
  plateComponent: React.ReactNode;
}

const EXHIBITION_PROJECTS: FlagshipExhibitionItem[] = [
  {
    index: '01',
    domain: 'CLINICAL COMPUTER VISION & 3D LIDAR',
    title: 'Healios V2',
    thesis: 'Multimodal Post-Operative Wound Diagnostic Engine',
    paragraph:
      'Uniting mobile 3D LiDAR point-cloud elevation topography with an 8.09ms explainable deep learning pipeline. Eliminates Matplotlib GUI locks through vectorized NumPy linear Jet colormapping, delivering millimeter-level tissue margin tracking without cloud GPU latency.',
    metric1: {
      value: '8.09 ms',
      label: 'Vectorized Grad-CAM Saliency',
    },
    metric2: {
      value: '±0.08 mm',
      label: 'LiDAR Elevation Accuracy Margin',
    },
    stack: 'Swift · ARKit · Metal · FastAPI · Three.js · NumPy',
    slug: 'healios',
    github: 'https://github.com/HareshMurugesan/Healios-V2',
    liveId: '01 // HEALIOS_V2',
    plateComponent: <PlateHealios />,
  },
  {
    index: '02',
    domain: 'MOTORSPORT TELEMETRY & MULTI-CAR SIMULATION',
    title: 'Apexis Telemetry Engine',
    thesis: 'Real-Time Multi-Car Simulation & Deterministic Race Analytics',
    paragraph:
      'Deterministic 60 FPS multi-car race simulation Web Worker, client-side broadcast OCR, and sub-12ms historical SQLite lookups. Runs intensive kinetic physics and fuel-flow calculations in off-main-thread workers with zero UI thread jank across 1950–present Formula 1 telemetry archives.',
    metric1: {
      value: '60 FPS Locked',
      label: '16.6ms Dedicated Worker Budget',
    },
    metric2: {
      value: '< 12 ms',
      label: 'Indexed SQLite Telemetry Lookup',
    },
    stack: 'Next.js · TypeScript · Web Workers · SQLite · Canvas · Tesseract.js',
    slug: 'apexis',
    github: 'https://github.com/HareshMurugesan/Apexis-F1-Telemetry',
    liveId: '02 // APEXIS_ENGINE',
    plateComponent: <PlateApexis />,
  },
  {
    index: '03',
    domain: 'SPATIAL ISOCHRONE ENGINE · 1ST PLACE ASA DATAFEST',
    title: 'RouteRx (Careline)',
    thesis: 'Transit Desert Accessibility & Healthcare Routing Architecture',
    paragraph:
      'Sub-15ms OSRM isochrone routing engine identifying patient healthcare transit deserts across 141 Shawnee County census blocks. Synthesized OpenStreetMap road networks, CDC vulnerability indexes, and municipal bus timetables, winning 1st Place at ASA DataFest 2026.',
    metric1: {
      value: '1st Place',
      label: 'ASA DataFest 2026 Winner',
    },
    metric2: {
      value: '< 15 ms',
      label: 'OSRM Isochrone Matrix',
    },
    stack: 'Python · RStudio · OSRM · Folium · GeoPandas · Spatial Isochrones',
    slug: 'routerx-careline-hub',
    github: 'https://github.com/HareshMurugesan/RouteRx-Careline',
    liveId: '03 // ROUTERX_CARELINE',
    plateComponent: <PlateRouteRx />,
  },
  {
    index: '04',
    domain: 'AIR-GAPPED LOCAL-FIRST STATE MACHINE',
    title: 'Tempo Task Suite',
    thesis: 'Air-Gapped Cognitive Buffer & Encrypted SQLite Persistence',
    paragraph:
      'Air-gapped communication buffer with pgvector emotional memory, 100% crisis recall, and dual-provider active-passive failover. Routes incoming communications through deterministic 0.20ms regex circuit breakers before cognitive display, storing sensitive telemetry exclusively in encrypted local SQLite.',
    metric1: {
      value: '0.0 KB',
      label: 'Network Exfiltration (Air-Gapped)',
    },
    metric2: {
      value: '100% Local',
      label: 'AES-256 SQLite Persistence',
    },
    stack: 'Electron · React · TypeScript · SQLite · IndexedDB · Tailwind CSS',
    slug: 'tempo',
    github: 'https://github.com/HareshMurugesan/Tempo-Cognitive-Suite',
    liveId: '04 // TEMPO_SUITE',
    plateComponent: <PlateTempo />,
  },
];

export const UnifiedProjectField: React.FC = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const activeProject = EXHIBITION_PROJECTS[activeProjectIndex];

  const handlePrev = useCallback(() => {
    setActiveProjectIndex((prev) => (prev === 0 ? EXHIBITION_PROJECTS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveProjectIndex((prev) => (prev === EXHIBITION_PROJECTS.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation: ArrowUp/ArrowDown cycle through projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not focused on input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section
      id="projects"
      className="relative w-full py-16 sm:py-24 select-none bg-transparent overflow-hidden"
      aria-label="Selected Works & Architectural Systems Exhibition"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Unboxed Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#C8D2E0]/10">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#F4F6F9] leading-tight tracking-tight">
              Selected Works.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg font-sans text-[#7E8B9B] leading-relaxed max-w-2xl">
              Four flagship production architectures across clinical computer vision, 60 FPS multi-car simulations, and spatial graph algorithms.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono text-[#7E8B9B] shrink-0">
            <div className="px-3 py-1.5 border border-[#2563EB]/25 bg-[#0B1E40]/30 text-[#C8D2E0] rounded-[2px] tracking-wider uppercase">
              01 — 04 ACTIVE SYSTEMS · SELECT TO INSPECT
            </div>
            <Link
              href="/#archive"
              className="text-[#FF2800] hover:text-[#F4F6F9] transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider font-semibold"
            >
              <span>Explore Archive Graph</span>
              <span>↓</span>
            </Link>
          </div>
        </div>

        {/* SINGLE-VIEWPORT SPLIT-STAGE TELEMETRY CONSOLE (max-w-[1400px], ~740px height on lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch min-h-[640px] lg:h-[740px]">
          {/* LEFT 5 COLUMNS: Interactive 4-System Accordion Rail */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-[#C8D2E0]/15 bg-[#03050A]/70 backdrop-blur-sm rounded-[2px] overflow-hidden">
            {/* Top Micro-Bar */}
            <div className="px-4 py-2.5 bg-[#060A12] border-b border-[#C8D2E0]/10 flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]">
              <span className="uppercase tracking-wider text-[#C8D2E0]">System Navigation Index</span>
              <span className="text-[#FF2800] font-semibold">{activeProject.index} / 04 ACTIVE</span>
            </div>

            {/* Accordion Stack Container */}
            <div className="flex-1 flex flex-col divide-y divide-[#C8D2E0]/10 min-h-0 overflow-y-auto">
              {EXHIBITION_PROJECTS.map((project, idx) => {
                const isActive = idx === activeProjectIndex;

                if (!isActive) {
                  {/* Collapsed Inactive Row (Crisp 54px strip) */}
                  return (
                    <button
                      key={project.index}
                      type="button"
                      onClick={() => setActiveProjectIndex(idx)}
                      className="w-full text-left px-4 sm:px-5 py-3.5 flex items-center justify-between transition-colors duration-200 hover:bg-[#C8D2E0]/[0.04] group cursor-pointer focus:outline-none focus:bg-[#C8D2E0]/[0.06]"
                      aria-label={`Expand ${project.title}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="font-mono text-xs sm:text-sm font-semibold text-[#FF2800] shrink-0">
                          [{project.index}]
                        </span>
                        <span className="font-serif text-[15px] sm:text-[16px] text-[#F4F6F9] group-hover:text-white transition-colors truncate">
                          {project.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span className="text-[10px] sm:text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider hidden sm:inline-block">
                          {project.metric1.value}
                        </span>
                        <span className="font-mono text-sm text-[#FF2800] font-bold group-hover:scale-125 transition-transform">
                          +
                        </span>
                      </div>
                    </button>
                  );
                }

                {/* Expanded Active Drawer */}
                return (
                  <div
                    key={project.index}
                    className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-[#C8D2E0]/[0.02] border-l-2 border-[#FF2800] space-y-4 sm:space-y-5 transition-all duration-300 overflow-y-auto"
                  >
                    {/* Header Row: Index Numeral + Monospace Domain */}
                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-baseline gap-3">
                          <span className="font-serif text-[32px] sm:text-[38px] leading-none text-[#FF2800] font-normal">
                            {project.index}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#C8D2E0] uppercase font-semibold">
                            // {project.domain}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#4CC38A] uppercase tracking-wider bg-[#4CC38A]/10 px-2 py-0.5 rounded-[2px] shrink-0">
                          ENGAGED
                        </span>
                      </div>

                      {/* Title & Italic Thesis */}
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl lg:text-[28px] font-serif text-[#F4F6F9] leading-tight tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-sm sm:text-[15px] font-serif italic text-[#C8D2E0] leading-snug">
                          {project.thesis}
                        </p>
                      </div>
                    </div>

                    {/* Single Concise Prose Paragraph */}
                    <p className="text-xs sm:text-[13.5px] font-sans text-[#7E8B9B] leading-[1.68]">
                      {project.paragraph}
                    </p>

                    {/* 2-Column Architectural Metric Grid (Border-y hairlines) */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#C8D2E0]/15">
                      <div className="space-y-0.5">
                        <div className="font-mono text-lg sm:text-xl font-bold text-[#F4F6F9]">
                          {project.metric1.value}
                        </div>
                        <div className="text-[10px] font-mono text-[#7E8B9B] uppercase tracking-wider leading-tight">
                          {project.metric1.label}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-mono text-lg sm:text-xl font-bold text-[#4CC38A]">
                          {project.metric2.value}
                        </div>
                        <div className="text-[10px] font-mono text-[#7E8B9B] uppercase tracking-wider leading-tight">
                          {project.metric2.label}
                        </div>
                      </div>
                    </div>

                    {/* Tech Stack & Action CTAs */}
                    <div className="space-y-4 pt-1">
                      <div className="text-[11px] font-mono text-[#2563EB] tracking-wide leading-relaxed">
                        {project.stack}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="px-5 py-2.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-semibold rounded-[2px] transition-colors inline-flex items-center justify-center gap-2 select-none shadow-[0_0_16px_rgba(255,40,0,0.35)] text-center min-h-[40px]"
                        >
                          <span>Read Case Study</span>
                          <span>→</span>
                        </Link>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-transparent hover:bg-[#0B1E40]/40 text-[#F4F6F9] border border-[#2563EB]/30 rounded-[2px] transition-colors inline-flex items-center justify-center gap-2 select-none text-center min-h-[40px]"
                        >
                          <span>Source Code</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: Stationary High-Craft Blueprint Stage */}
          <div className="lg:col-span-7 relative flex flex-col justify-between min-w-0 p-3 sm:p-5 border border-[#2563EB]/25 bg-[#03050A]/80 rounded-[2px] overflow-hidden shadow-[0_0_40px_rgba(3,5,10,0.8)]">
            {/* 32px Technical Blueprint Grid Background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(37, 99, 235, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 99, 235, 0.05) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
              aria-hidden="true"
            />

            {/* 4 Corner L-Shaped Registration Brackets (12px x 12px, 1px solid #2563EB) */}
            <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none border-t border-l border-[#2563EB]" />
            <div className="absolute top-0 right-0 w-3 h-3 pointer-events-none border-t border-r border-[#2563EB]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 pointer-events-none border-b border-l border-[#2563EB]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none border-b border-r border-[#2563EB]" />

            {/* Blueprint Stage Top Bar: Live Identifier + Step Arrow Controls */}
            <div className="relative z-20 flex items-center justify-between pb-3 sm:pb-4 border-b border-[#2563EB]/20 mb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs sm:text-[13px] text-[#C8D2E0] uppercase tracking-wider font-semibold">
                  {activeProject.liveId}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#4CC38A]/10 text-[#4CC38A] font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CC38A] animate-pulse" />
                  LIVE BLUEPRINT STAGE
                </span>
              </div>

              {/* Prev / Next Cycle Controls */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-2.5 py-1 bg-[#0B1E40]/40 hover:bg-[#2563EB]/30 text-[#F4F6F9] border border-[#2563EB]/30 rounded-[2px] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Previous System Blueprint"
                >
                  ←
                </button>
                <span className="px-2 text-[11px] text-[#7E8B9B]">
                  {activeProject.index} / 04
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-2.5 py-1 bg-[#0B1E40]/40 hover:bg-[#2563EB]/30 text-[#F4F6F9] border border-[#2563EB]/30 rounded-[2px] transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Next System Blueprint"
                >
                  →
                </button>
              </div>
            </div>

            {/* Interactive Blueprint Stage Content with Smooth Keyed Morph */}
            <div className="relative z-10 w-full flex-1 flex flex-col justify-center min-w-0 py-2">
              <div key={activeProject.slug} className="w-full h-full transition-opacity duration-300">
                {activeProject.plateComponent}
              </div>
            </div>

            {/* Blueprint Stage Footer Bar: Verification Metadata */}
            <div className="relative z-20 pt-3 border-t border-[#2563EB]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#7E8B9B]">
              <div className="flex items-center gap-2">
                <span className="text-[#2563EB]">●</span>
                <span>STAGE VERIFIED: 60 FPS DETERMINISTIC CANVAS · CLIENT WORKER THREADS</span>
              </div>
              <div className="text-[#C8D2E0]/60">
                HOTKEYS: [↑ / ↓] SWITCH SYSTEM
              </div>
            </div>
          </div>
        </div>

        {/* Closing Forward Link to Full Constellation */}
        <div className="pt-8 pb-4 border-t border-[#C8D2E0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-serif text-[#F4F6F9]">
              Archive Systems Constellation
            </h4>
            <p className="text-xs font-mono text-[#7E8B9B]">
              18 production repositories suspended across 2 architectural cores and 6 domains.
            </p>
          </div>
          <Link
            href="/#archive"
            className="px-5 py-2.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-mono text-xs font-semibold rounded-[2px] transition-colors shrink-0 inline-flex items-center gap-2 shadow-[0_0_16px_rgba(255,40,0,0.35)]"
          >
            <span>Explore Constellation Below</span>
            <span>↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnifiedProjectField;
