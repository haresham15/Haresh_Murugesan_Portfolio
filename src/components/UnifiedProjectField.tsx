import React from 'react';
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
    plateComponent: <PlateTempo />,
  },
];

export const UnifiedProjectField: React.FC = () => {
  return (
    <section
      id="projects"
      className="relative w-screen max-w-none py-24 select-none bg-transparent"
      aria-label="Selected Works & Architectural Systems Exhibition"
    >
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Unboxed Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-[#C8D2E0]/10">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#F4F6F9] leading-tight tracking-tight">
              Selected Works.
            </h2>
            <p className="text-base sm:text-xl font-sans text-[#7E8B9B] leading-relaxed max-w-2xl">
              Production architectures uniting clinical computer vision, 60 FPS multi-car simulations, and spatial graph algorithms.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#7E8B9B]">
            <Link
              href="/projects"
              className="text-[#FF2800] hover:text-[#F4F6F9] transition-colors inline-flex items-center gap-2 uppercase tracking-wider font-semibold"
            >
              <span>Explore All 18 Systems in Archive Graph</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 12-Column Architectural Exhibition Spreads (01–04) */}
        <div className="space-y-24 divide-y divide-[#C8D2E0]/10">
          {EXHIBITION_PROJECTS.map((project, idx) => (
            <article
              key={project.index}
              id={`project-${project.slug}`}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch ${
                idx > 0 ? 'pt-24' : ''
              }`}
            >
              {/* LEFT 38%: Editorial Spec Sheet (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                {/* Header Row: 44px Serif Index Numeral + Monospace Domain */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-[44px] leading-none text-[#FF2800] font-normal">
                      {project.index}
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-[#C8D2E0] uppercase font-semibold">
                      {project.domain}
                    </span>
                  </div>

                  {/* Title & Italic Thesis */}
                  <div className="space-y-2">
                    <h3 className="text-3xl sm:text-[40px] font-serif text-[#F4F6F9] leading-tight tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-[19px] font-serif italic text-[#C8D2E0] leading-snug">
                      {project.thesis}
                    </p>
                  </div>
                </div>

                {/* Single Concise Prose Paragraph */}
                <p className="text-[16px] font-sans text-[#7E8B9B] leading-[1.72]">
                  {project.paragraph}
                </p>

                {/* 2-Column Architectural Metric Grid (Border-y hairlines) */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#C8D2E0]/15">
                  <div className="space-y-1">
                    <div className="font-mono text-xl sm:text-2xl font-bold text-[#F4F6F9]">
                      {project.metric1.value}
                    </div>
                    <div className="text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider">
                      {project.metric1.label}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-mono text-xl sm:text-2xl font-bold text-[#4CC38A]">
                      {project.metric2.value}
                    </div>
                    <div className="text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider">
                      {project.metric2.label}
                    </div>
                  </div>
                </div>

                {/* Tech Stack & Clean CTA Buttons */}
                <div className="space-y-5 pt-2">
                  <div className="text-xs font-mono text-[#2563EB] tracking-wide leading-relaxed">
                    {project.stack}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="px-6 py-3.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-semibold rounded-[2px] transition-colors inline-flex items-center gap-2 select-none shadow-[0_0_20px_rgba(255,40,0,0.35)]"
                    >
                      <span>Read Case Study</span>
                      <span>→</span>
                    </Link>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-transparent hover:bg-[#0B1E40]/40 text-[#F4F6F9] border border-[#2563EB]/30 rounded-[2px] transition-colors inline-flex items-center gap-2 select-none"
                    >
                      <span>Source Code</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT 62%: High-Craft Open Blueprint Stage (7 Cols, min-h-[460px]) */}
              <div className="lg:col-span-7 relative flex flex-col min-h-[460px] p-2 sm:p-4 bg-transparent">
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

                {/* Interactive Blueprint Stage Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  {project.plateComponent}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Closing Forward Link to Full Archive */}
        <div className="pt-12 pb-6 border-t border-[#C8D2E0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h4 className="text-2xl font-serif text-[#F4F6F9]">
              18 Engineered Systems in Archive Graph
            </h4>
            <p className="text-xs font-mono text-[#7E8B9B]">
              Linear camera progression across Computer Vision, Vector Search, Spatial Econometrics, and Telemetry Runtimes.
            </p>
          </div>
          <Link
            href="/projects"
            className="px-6 py-3.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-mono text-xs font-semibold rounded-[2px] transition-colors shrink-0 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(255,40,0,0.35)]"
          >
            <span>Open Systems CodeGraph</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnifiedProjectField;
