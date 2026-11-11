import React from 'react';
import { ThemeSection } from './ThemeSection';

export const NowSection: React.FC = () => {
  return (
    <ThemeSection
      id="now"
      theme="obsidian"
      aria-label="Current focus and editorial field log"
      className="border-b border-[#18458B]/20 flex flex-col justify-between"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        {/* Section Intro (Unboxed & De-Vibecoded) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#18458B]/20">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Field Notes.
            </h2>
            <p className="text-base sm:text-xl font-sans text-[#7E8B9B] leading-relaxed">
              Active engineering focus, research investigations, and personal inquiry in Columbus, OH.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono text-[#C8D2E0] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
            <span className="text-[#FF2800] font-semibold">ACTIVE INQUIRIES</span>
            <span className="text-[#7E8B9B]">· Columbus, OH</span>
          </div>
        </div>

        {/* 12-Col Asymmetric Spread: 7 Cols Primary Build / 5 Cols Research & Inquiry (Unboxed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Primary Build (7 Cols, Unboxed) */}
          <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#18458B]/20 flex flex-col justify-between space-y-8 relative">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF2800] font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
                <span>Active Production Build</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F4F6F9] leading-snug">
                High-concurrency Web Worker simulation runtimes.
              </h3>

              <p className="text-base sm:text-lg font-sans text-[#7E8B9B] leading-relaxed">
                Architecting multi-threaded browser simulation engines with offscreen HTML5 Canvas contexts and SharedArrayBuffer channels. Focusing on deterministic 60fps physics execution that locks frame times strictly within a sub-16ms budget regardless of main-thread UI operations.
              </p>
            </div>

            <div className="pt-6 border-t border-[#18458B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[#7E8B9B]">Benchmark Target:</span>
              <span className="text-[#FF2800] font-medium">Sub-16ms deterministic frame budget verified on client runtimes</span>
            </div>
          </div>

          {/* Research & Exploration (5 Cols, Unboxed with Hairline Rules) */}
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[#18458B]/20">
            
            {/* Research Module */}
            <div className="pb-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-mono tracking-wider text-[#2563EB] font-semibold uppercase">
                  Research Inquiry
                </div>
                <h4 className="text-xl sm:text-2xl font-serif text-[#F4F6F9]">
                  Spatial tissue coordinate modeling &amp; TILs
                </h4>
                <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed">
                  Investigating spatial graph algorithms for cellular micro-environment modeling at Ohio State, segmenting tumor-infiltrating lymphocytes (TILs) beyond traditional pixel grids.
                </p>
              </div>
              <div className="text-xs font-mono text-[#C8D2E0] pt-2">
                Digital Pathology &amp; Spatial Tissue Graphs
              </div>
            </div>

            {/* Reading & Media Module */}
            <div className="pt-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-mono tracking-wider text-[#C8D2E0] font-semibold uppercase">
                  Current Reading
                </div>
                <h4 className="text-xl sm:text-2xl font-serif text-[#F4F6F9]">
                  Distributed Systems &amp; Low-Latency Consensus
                </h4>
                <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed">
                  Studying Raft log compaction, lock-free ring buffers, and edge database replication strategies for disconnected mobile clients.
                </p>
              </div>
              <div className="text-xs font-mono text-[#C8D2E0] pt-2">
                Distributed Systems Architecture
              </div>
            </div>

          </div>

        </div>
      </div>
    </ThemeSection>
  );
};

export default NowSection;
