import React from 'react';
import { ThemeSection, Reveal } from './ThemeSection';

const SIDE_NOTES = [
  {
    label: 'Research inquiry',
    labelColor: 'text-[#2563EB]',
    title: 'Spatial tissue coordinate modeling & TILs',
    body: 'Investigating spatial graph algorithms for cellular micro-environment modeling at Ohio State, segmenting tumor-infiltrating lymphocytes (TILs) beyond traditional pixel grids.',
    tag: 'Digital pathology · Spatial tissue graphs',
  },
  {
    label: 'Current reading',
    labelColor: 'text-[#C8D2E0]',
    title: 'Distributed systems & low-latency consensus',
    body: 'Studying Raft log compaction, lock-free ring buffers, and edge database replication strategies for disconnected mobile clients.',
    tag: 'Distributed systems architecture',
  },
];

export const NowSection: React.FC = () => {
  return (
    <ThemeSection
      id="now"
      theme="obsidian"
      aria-label="Now"
      className="border-b border-[#18458B]/20 py-24 lg:py-36"
    >
      <div className="w-full flex flex-col">
        <Reveal className="pb-12 sm:pb-16 border-b border-[#C8D2E0]/10">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal text-[#F4F6F9] leading-[0.95] tracking-[-0.02em]">
            Now
          </h2>
          <p className="mt-6 max-w-[58ch] text-base sm:text-lg font-sans text-[#C8D2E0]/85 leading-relaxed">
            Field notes from Columbus, OH: what is on the bench, what is under the microscope, and what is on the desk.
          </p>
        </Reveal>

        {/* Asymmetric dispatch: a wide lead story, two narrow side notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 pt-12 sm:pt-16">
          <Reveal className="lg:col-span-7 lg:pr-16 lg:border-r border-[#C8D2E0]/10">
            <p className="font-mono text-xs text-[#FF2800]">Active build</p>
            <h3 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F4F6F9] leading-[1.08] tracking-[-0.01em] max-w-[20ch]">
              High-concurrency Web Worker simulation runtimes.
            </h3>
            <p className="mt-6 max-w-[60ch] font-sans text-base sm:text-lg text-[#C8D2E0]/80 leading-relaxed">
              Architecting multi-threaded browser simulation engines with offscreen HTML5 Canvas contexts and
              SharedArrayBuffer channels. The focus is deterministic 60 fps physics that holds its frame time inside
              a sub-16 ms budget regardless of what the main thread is doing.
            </p>
            <dl className="mt-10 pt-5 border-t border-[#C8D2E0]/10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-xs">
              <dt className="text-[#7E8B9B]">Target</dt>
              <dd className="text-[#F4F6F9]">Sub-16 ms deterministic frame budget on client runtimes</dd>
            </dl>
          </Reveal>

          <div className="lg:col-span-5 lg:pl-16 flex flex-col">
            {SIDE_NOTES.map((n, i) => (
              <Reveal
                key={n.title}
                delay={0.08 + i * 0.06}
                className={`${i > 0 ? 'mt-10 pt-10 border-t border-[#C8D2E0]/10' : 'lg:pt-1'}`}
              >
                <p className={`font-mono text-xs ${n.labelColor}`}>{n.label}</p>
                <h4 className="mt-4 font-serif text-2xl sm:text-[28px] text-[#F4F6F9] leading-snug">{n.title}</h4>
                <p className="mt-3 max-w-[52ch] font-sans text-sm sm:text-base text-[#7E8B9B] leading-relaxed">{n.body}</p>
                <p className="mt-4 font-mono text-[11px] text-[#C8D2E0]/80">{n.tag}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </ThemeSection>
  );
};

export default NowSection;
