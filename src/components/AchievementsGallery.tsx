import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeSection } from './ThemeSection';
import { GridCrosshair } from './ui/EditorialPrimitives';

const MotionDiv = motion.div as any;

interface SecondaryAward {
  id: string;
  number: string;
  year: string;
  title: string;
  system: string;
  scope: string;
  metric: string;
  link: string;
}

const SECONDARY_AWARDS: SecondaryAward[] = [
  {
    id: 'ibm-watsonx',
    number: '03',
    year: '2026',
    title: 'IBM SkillsBuild AI Showcase',
    system: 'Vantage Platform',
    scope: 'Zero-shot curriculum adaptation trees powered by IBM watsonx.ai and IBM Cloud runtimes.',
    metric: '< 250 ms latency · K-16 Adaptive',
    link: '#projects',
  },
  {
    id: 'benchmarks',
    number: '04',
    year: '2026',
    title: '94.2% Hit@5 Retrieval & Market Physics',
    system: 'TamilTrove & NYC OS Market Engine',
    scope: '120-query hybrid dense/sparse vector benchmark paired with 1M+ transaction Deck.GL 3D simulation.',
    metric: '94.2% Hit@5 · 1M+ Transactions',
    link: '/projects/tamiltrove',
  },
  {
    id: 'leadership',
    number: '05',
    year: '2026',
    title: 'NSLS Nominee & OSU Innovation Analyst',
    system: 'Philocracy & Honda 99P Labs',
    scope: 'Nominated to National Society of Leadership and Success; directing connected-mobility research at OSU CIS.',
    metric: 'Co-CEO · Connected Mobility Liaison',
    link: '#experience',
  },
];

export const AchievementsGallery: React.FC = () => {
  return (
    <ThemeSection
      id="achievements"
      theme="titanium-ivory"
      aria-label="Distinctions, competitive victories and credentials"
      className="border-b border-[#0D0D11]/10 flex flex-col justify-between py-24 lg:py-36"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        
        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#0D0D11]/10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#B45309]">
              <span className="w-6 h-px bg-[#B45309]" />
              <span>04  Competitive Awards &amp; Distinctions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#0D0D11] leading-tight tracking-tight">
              Recognition &amp; Distinctions
            </h2>
            <p className="text-base sm:text-lg font-sans text-[#575760] leading-relaxed">
              Consecutive American Statistical Association championships, algorithmic benchmark records, and executive research appointments.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#575760] shrink-0">
            <span className="px-3 py-1.5 bg-[#0D0D11] text-[#ECE9E1] rounded-[2px] font-semibold">
              ASA DataFest 2× Champion
            </span>
          </div>
        </div>

        {/* =====================================================================
            EXPANSIVE 40/60 EDITORIAL CENTERPIECE: 2025 & 2026 DATAFEST
            ===================================================================== */}
        <div className="relative w-full bg-[#E8E3D7] border border-[#0D0D11]/15 rounded-[2px] overflow-hidden shadow-sm">
          {/* Precision Architectural Crosshair Fiducials */}
          <GridCrosshair className="absolute top-2 left-2 z-20 opacity-30 text-[#0D0D11]" />
          <GridCrosshair className="absolute top-2 right-2 z-20 opacity-30 text-[#0D0D11]" />
          <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-30 text-[#0D0D11]" />
          <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-30 text-[#0D0D11]" />

          {/* Top Hairline Amber Highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#0D0D11]/12">
            
            {/* LEFT 40% (5 Cols): Monumental 96px Serif "2× 1st" Pillar */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-[#EFEBE0]/60">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D0D11] text-[#F3EFE7] rounded-[2px] text-xs font-mono tracking-wider uppercase font-semibold">
                  <span className="text-[#F59E0B]">★</span>
                  <span>ASA Consecutive Champion</span>
                </div>

                {/* Monumental 96px Serif Numeral */}
                <div className="pt-2">
                  <div className="text-7xl sm:text-8xl lg:text-9xl font-serif text-[#0D0D11] leading-none tracking-tight font-normal">
                    2× 1st
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-[#0D0D11] mt-2 font-medium">
                    ASA DataFest Champion
                  </h3>
                </div>

                <p className="text-sm sm:text-base font-sans text-[#3C3C43] leading-relaxed pt-2">
                  Awarded consecutive 1st Place honors by the American Statistical Association (ASA) for mathematical rigor in synthesizing open data pipelines, geospatial regression modeling, and multi-modal transit graphs under 48-hour competitive hackathon deadlines.
                </p>
              </div>

              <div className="pt-6 border-t border-[#0D0D11]/10 flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="text-[#73737C]">EVALUATION TIER:</span>
                <span className="text-[#0D0D11] font-bold">1st Place — Best Use of External Data</span>
              </div>
            </div>

            {/* RIGHT 60% (7 Cols): Side-by-Side 2026 & 2025 Technical Breakdowns */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#0D0D11]/12 bg-[#ECE7DC]/40">
              
              {/* 2026 Championship Breakdown */}
              <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 bg-[#B45309] text-white rounded-[2px] font-semibold">
                      2026 CHAMPION
                    </span>
                    <span className="text-[#575760]">Topeka, KS</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-serif text-[#0D0D11] leading-tight">
                      RouteRx / Careline
                    </h4>
                    <p className="text-xs font-mono text-[#B45309] mt-1">
                      1st Place — Best Use of External Data
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] font-sans text-[#4A4A52] leading-relaxed">
                    Synthesized OpenStreetMap road graphs, CDC Social Vulnerability Indexes, and municipal bus timetables into sub-15ms multi-modal transit isochrones, identifying healthcare deserts across 141 census blocks.
                  </p>

                  <div className="p-4 bg-[#DFD9CD] rounded-[2px] border border-[#0D0D11]/10 space-y-2 font-mono text-xs">
                    <div className="text-[10px] text-[#575760] uppercase tracking-wider">
                      VERIFIED TELEMETRY:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[#0D0D11]">
                      <div>
                        <div className="text-[10px] text-[#73737C]">Latency:</div>
                        <div className="font-bold">&lt; 15 ms</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#73737C]">Census Blocks:</div>
                        <div className="font-bold">141 Blocks</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] text-[#73737C]">Transit Gap Solved:</div>
                        <div className="font-bold text-[#B45309]">42.3% Efficiency Gain</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0D0D11]/10">
                  <Link
                    href="/projects/routerx-careline-hub"
                    className="text-xs font-mono text-[#B45309] hover:text-[#0D0D11] font-semibold inline-flex items-center gap-1.5 transition-colors uppercase"
                  >
                    <span>View RouteRx Architecture</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* 2025 Championship Breakdown */}
              <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 bg-[#575760] text-white rounded-[2px] font-semibold">
                      2025 CHAMPION
                    </span>
                    <span className="text-[#575760]">Multi-State</span>
                  </div>

                  <div>
                    <h4 className="text-xl font-serif text-[#0D0D11] leading-tight">
                      Hack to the Future
                    </h4>
                    <p className="text-xs font-mono text-[#575760] mt-1">
                      1st Place — Best Use of External Data
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] font-sans text-[#4A4A52] leading-relaxed">
                    Constructed spatial econometric regression models evaluating how municipal corporate tax breaks and transportation infrastructure alter commercial distribution footprint clustering across 500,000+ data points.
                  </p>

                  <div className="p-4 bg-[#DFD9CD] rounded-[2px] border border-[#0D0D11]/10 space-y-2 font-mono text-xs">
                    <div className="text-[10px] text-[#575760] uppercase tracking-wider">
                      VERIFIED TELEMETRY:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[#0D0D11]">
                      <div>
                        <div className="text-[10px] text-[#73737C]">Modeled Points:</div>
                        <div className="font-bold">500,000+</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#73737C]">Corridor:</div>
                        <div className="font-bold">Multi-State</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] text-[#73737C]">Evaluation Tier:</div>
                        <div className="font-bold text-[#0D0D11]">1st in Region</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0D0D11]/10">
                  <Link
                    href="#projects"
                    className="text-xs font-mono text-[#575760] hover:text-[#0D0D11] font-semibold inline-flex items-center gap-1.5 transition-colors uppercase"
                  >
                    <span>View System In Index</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =====================================================================
            SECONDARY DISTINCTIONS: CLEAN BORDERLESS EDITORIAL INDEX ROWS
            ===================================================================== */}
        <div className="space-y-4 pt-4">
          <div className="text-xs font-mono text-[#73737C] uppercase tracking-wider pb-2 border-b border-[#0D0D11]/10">
            ADDITIONAL HONORS &amp; ALGORITHMIC DISTINCTIONS
          </div>

          <div className="divide-y divide-[#0D0D11]/10">
            {SECONDARY_AWARDS.map((award) => (
              <div
                key={award.id}
                className="py-5 px-3 sm:px-6 hover:bg-[#EFEBE0]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group rounded-[2px]"
              >
                <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                  <span className="font-mono text-sm font-bold text-[#B45309] shrink-0 pt-0.5 sm:pt-0">
                    {award.number}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#575760]">
                      <span className="text-[#0D0D11] font-semibold">{award.year}</span>
                      <span>·</span>
                      <span className="text-[#B45309]">{award.system}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-serif text-[#0D0D11] group-hover:text-[#B45309] transition-colors leading-snug">
                      {award.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-sans text-[#575760] mt-0.5 max-w-3xl">
                      {award.scope}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0">
                  <span className="text-xs font-mono text-[#73737C] bg-[#DFD9CD] px-2.5 py-1 rounded-[2px]">
                    {award.metric}
                  </span>
                  <Link
                    href={award.link}
                    className="text-xs font-mono text-[#B45309] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold"
                  >
                    <span>Inspect</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ThemeSection>
  );
};

export default AchievementsGallery;
