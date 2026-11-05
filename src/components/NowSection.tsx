import React from 'react';
import { SectionContainer } from './ui/SectionContainer';
import { GridCrosshair } from './ui/EditorialPrimitives';

export const NowSection: React.FC = () => {
  return (
    <SectionContainer
      id="now"
      variant="editorial"
      bgMode="clean"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Current focus and editorial field log"
    >
      {/* Section Intro */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 sm:mb-20">
        <div className="space-y-4 max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
            Field Notes
          </h2>
          <p className="text-base sm:text-lg font-sans text-[#A7B2C3] leading-relaxed">
            Active engineering focus, research investigations, and personal inquiry in Columbus, OH.
          </p>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono text-[#A7B2C3] px-3 py-1.5 bg-[#101B30] border border-[#F3EFE7]/10 rounded-[2px]">
          <span className="w-2 h-2 rounded-full bg-[#4CC38A] animate-pulse" />
          <span>Active Inquiries · November 2026</span>
        </div>
      </div>

      {/* 7.17 ASYMMETRIC DISPATCH LAYOUT: 60% Featured Building / 40% Supporting Research & Exploring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* 60% Featured Primary Card: BUILDING */}
        <div className="lg:col-span-7 bg-[#070B12] border border-[#F3EFE7]/[0.12] rounded-[2px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 relative overflow-hidden shadow-[0_8px_32px_rgba(7,11,18,0.8)]">
          <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
          <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#82B7FF]" />

          <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#FF6B35] via-[#F5D998] to-transparent" />

          <div className="space-y-6">
            <div className="text-xs font-mono tracking-wider text-[#FF6B35] font-medium">
              Active Build
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F3EFE7] leading-snug">
              High-concurrency Web Worker simulation runtimes.
            </h3>

            <p className="text-[16px] sm:text-[17px] font-sans text-[#A7B2C3] leading-[1.72]">
              Architecting multi-threaded browser simulation engines with offscreen HTML5 Canvas contexts and SharedArrayBuffer channels. Focusing on deterministic 60fps physics execution that locks frame times strictly within a sub-16ms budget regardless of main-thread UI operations.
            </p>
          </div>

          <div className="pt-6 border-t border-[#F3EFE7]/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[#7A889B]">Objective:</span>
            <span className="text-[#4CC38A] font-medium">Sub-16ms deterministic frame budget verified on client runtimes</span>
          </div>
        </div>

        {/* 40% Supporting Stacked Column: RESEARCHING & EXPLORING */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          
          {/* RESEARCHING Module */}
          <div className="bg-[#070B12] border border-[#F3EFE7]/[0.1] rounded-[2px] p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between hover:bg-[#0C1729] transition-colors duration-180 relative group">
            <GridCrosshair className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity text-[#82B7FF]" />
            <div className="space-y-3">
              <div className="text-xs font-mono tracking-wider text-[#82B7FF] font-medium">
                Research
              </div>
              <h4 className="text-xl font-serif text-[#F3EFE7]">
                Spatial tissue coordinate modeling &amp; TILs
              </h4>
              <p className="text-sm font-sans text-[#A7B2C3] leading-relaxed">
                Investigating spatial graph algorithms for cellular micro-environment modeling at Ohio State, segmenting tumor-infiltrating lymphocytes (TILs) beyond traditional pixel grids.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#7A889B] pt-2 border-t border-[#F3EFE7]/[0.06]">
              Digital Pathology &amp; Spatial Tissue Graphs
            </div>
          </div>

          {/* EXPLORING Module */}
          <div className="bg-[#070B12] border border-[#F3EFE7]/[0.1] rounded-[2px] p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between hover:bg-[#0C1729] transition-colors duration-180 relative group">
            <GridCrosshair className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity text-[#F5D998]" />
            <div className="space-y-3">
              <div className="text-xs font-mono tracking-wider text-[#F5D998] font-medium">
                Inquiry
              </div>
              <h4 className="text-xl font-serif text-[#F3EFE7]">
                Motorsport vehicle dynamics &amp; endurance
              </h4>
              <p className="text-sm font-sans text-[#A7B2C3] leading-relaxed">
                Analyzing real-time motorsport vehicle telemetry streams and tire wear degradation, experimenting with color grading in DaVinci Resolve, and training for 10-mile endurance runs.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#7A889B] pt-2 border-t border-[#F3EFE7]/[0.06]">
              Weekly founder deep dives + 10-mile road sessions
            </div>
          </div>

        </div>

      </div>
    </SectionContainer>
  );
};

export default NowSection;
