import React from 'react';
import { ThemeSection } from './ThemeSection';

export const NowSection: React.FC = () => {
  return (
    <ThemeSection
      id="now"
      theme="obsidian"
      aria-label="Current focus and editorial field log"
      className="border-b border-[#F4F1EA]/10 flex flex-col justify-between"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        {/* Section Intro */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#E85D04]">
              <span className="w-6 h-px bg-[#E85D04]" />
              <span>06 // ACTIVE RESEARCH &amp; CURRENT VECTOR</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F1EA] leading-tight tracking-tight">
              Field Notes
            </h2>
            <p className="text-base sm:text-lg font-sans text-[#8E8D94] leading-relaxed">
              Active engineering focus, research investigations, and personal inquiry in Columbus, OH.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono text-[#8E8D94] px-4 py-2 bg-[#0C0F17] border border-[#F4F1EA]/10 rounded-[2px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Active Inquiries · November 2026</span>
          </div>
        </div>

        {/* 12-Col Asymmetric Spread: 7 Cols Primary Build / 5 Cols Research & Inquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Primary Build (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0C0F17] border border-[#F4F1EA]/12 rounded-[2px] p-8 sm:p-12 flex flex-col justify-between space-y-8 shadow-2xl relative">
            <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E85D04] via-[#F4A261] to-transparent" />

            <div className="space-y-6">
              <div className="text-xs font-mono tracking-wider text-[#E85D04] font-medium uppercase">
                Active Build
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F4F1EA] leading-snug">
                High-concurrency Web Worker simulation runtimes.
              </h3>

              <p className="text-[16px] sm:text-[18px] font-sans text-[#8E8D94] leading-[1.72]">
                Architecting multi-threaded browser simulation engines with offscreen HTML5 Canvas contexts and SharedArrayBuffer channels. Focusing on deterministic 60fps physics execution that locks frame times strictly within a sub-16ms budget regardless of main-thread UI operations.
              </p>
            </div>

            <div className="pt-6 border-t border-[#F4F1EA]/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <span className="text-[#64748B]">Benchmark Target:</span>
              <span className="text-[#10B981] font-medium">Sub-16ms deterministic frame budget verified on client runtimes</span>
            </div>
          </div>

          {/* Research & Exploration (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Research Module */}
            <div className="bg-[#0C0F17] border border-[#F4F1EA]/10 rounded-[2px] p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between hover:bg-[#121724] transition-colors">
              <div className="space-y-3">
                <div className="text-xs font-mono tracking-wider text-[#38BDF8] font-medium uppercase">
                  Research Inquiry
                </div>
                <h4 className="text-xl font-serif text-[#F4F1EA]">
                  Spatial tissue coordinate modeling &amp; TILs
                </h4>
                <p className="text-sm font-sans text-[#8E8D94] leading-relaxed">
                  Investigating spatial graph algorithms for cellular micro-environment modeling at Ohio State, segmenting tumor-infiltrating lymphocytes (TILs) beyond traditional pixel grids.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#F4F1EA]/[0.06]">
                Digital Pathology &amp; Spatial Tissue Graphs
              </div>
            </div>

            {/* Reading & Media Module */}
            <div className="bg-[#0C0F17] border border-[#F4F1EA]/10 rounded-[2px] p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between hover:bg-[#121724] transition-colors">
              <div className="space-y-3">
                <div className="text-xs font-mono tracking-wider text-[#F59E0B] font-medium uppercase">
                  Current Reading
                </div>
                <h4 className="text-xl font-serif text-[#F4F1EA]">
                  Distributed Systems &amp; Low-Latency Consensus
                </h4>
                <p className="text-sm font-sans text-[#8E8D94] leading-relaxed">
                  Studying Raft log compaction, lock-free ring buffers, and edge database replication strategies for disconnected mobile clients.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#F4F1EA]/[0.06]">
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
