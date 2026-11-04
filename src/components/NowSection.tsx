import React from 'react';
import { GridCrosshair } from './ui/GridCrosshair';

interface DispatchItem {
  number: string;
  verb: string;
  pulseColor: 'emerald' | 'amber';
  update: string;
  subnote: string;
}

const dispatchLogs: DispatchItem[] = [
  {
    number: '01',
    verb: 'BUILDING //',
    pulseColor: 'amber',
    update: 'High-concurrency Web Worker simulation architectures with off-screen Canvas contexts and SharedArrayBuffer channels, locking a 60fps deterministic physics loop.',
    subnote: 'Target: Sub-16ms frame budget on consumer browser runtimes',
  },
  {
    number: '02',
    verb: 'RESEARCHING //',
    pulseColor: 'emerald',
    update: 'Spatial coordinate algorithms and computational vision for cellular micro-environment modeling at Ohio State, segmenting tumor-infiltrating lymphocytes (TILs) beyond traditional pixel grids.',
    subnote: 'Focus: Digital Pathology & Spatial Tissue Graphs',
  },
  {
    number: '03',
    verb: 'EXPLORING //',
    pulseColor: 'emerald',
    update: 'Real-time motorsport telemetry streams and vehicle chassis dynamics, experimenting with color grading in DaVinci Resolve, and producing founder dialogues for Syntinuum.',
    subnote: 'Habit: Weekly founder deep dives + 10-mile endurance runs',
  },
];

export const NowSection: React.FC = () => {
  return (
    <section
      id="now"
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="Current focus and editorial field log"
    >
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* SECTION HEADER BAR */}
      <div className="p-6 sm:p-8 lg:p-12 border-b border-[#F4EFE6]/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
            <span className="text-[#FFB86C] font-semibold">08 // FIELD NOTES</span>
            <span>DISPATCH STATUS // 09.1</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F4EFE6] leading-none tracking-tight">
            Now
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#B0BCCB] max-w-2xl leading-relaxed">
            Active engineering focus, research investigations, and personal inquiry.
          </p>
        </div>

        <div className="text-xs font-mono text-[#8A99AD] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4CC38A] animate-pulse" />
          <span className="text-[#FFB86C] font-semibold">DISPATCH //</span>
          <span>NOVEMBER 2026</span>
        </div>
      </div>

      {/* 3 FLUSH HORIZONTAL DISPATCH ROWS */}
      <div className="divide-y divide-[#F4EFE6]/10">
        {dispatchLogs.map((log) => (
          <div
            key={log.number}
            className="p-6 sm:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-baseline hover:bg-[#0C1729]/30 transition-colors"
          >
            {/* Cols 1–4: Number & Verb */}
            <div className="md:col-span-4 flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  log.pulseColor === 'amber' ? 'bg-[#FF6B2B] shadow-[0_0_8px_#FF6B2B]' : 'bg-[#4CC38A] shadow-[0_0_8px_#4CC38A]'
                }`}
                aria-hidden="true"
              />
              <span className="text-xl sm:text-2xl font-serif text-[#FFB86C] tracking-tight">
                {log.number} / {log.verb}
              </span>
            </div>

            {/* Cols 5–12: Articulate Update & Subnote */}
            <div className="md:col-span-8 space-y-2">
              <p className="text-[17px] sm:text-[18px] font-sans text-[#F4EFE6] leading-[1.68]">
                {log.update}
              </p>
              <div className="text-xs font-mono text-[#8A99AD] pt-1">
                {log.subnote}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NowSection;
