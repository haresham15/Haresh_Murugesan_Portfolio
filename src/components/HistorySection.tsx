import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { GridCrosshair } from './ui/GridCrosshair';

const MotionDiv = motion.div as any;

interface Milestone {
  year: string;
  title: string;
  reflection: string;
  tag: string;
  link?: string;
  detail: string;
}

const milestones: Milestone[] = [
  {
    year: '2023',
    title: 'Syntinuum Launch',
    reflection: 'Started an engineering podcast to understand how chief architects navigate the gap between textbook algorithms and live production fires.',
    tag: 'Podcast & Systems Journalism',
    detail: '10+ Founder Dialogues · 100K+ Reach',
    link: '#podcast',
  },
  {
    year: '2024',
    title: 'Recursive Schemas',
    reflection: 'Directed engineering for Philocracy debate platform. Designed recursive tree schemas in TypeScript to model premises with zero cycle bugs.',
    tag: 'Domain Modeling & Schemas',
    detail: 'TypeScript Tree Schemas · Next.js',
  },
  {
    year: '2025',
    title: 'DataFest & Mobility',
    reflection: 'Won 1st Place at ASA DataFest for external data modeling under 48-hour deadline. Joined Honda 99P Labs evaluating 1,000+ vehicle models.',
    tag: 'Spatial Data & Telematics',
    detail: '1st Place ASA DataFest · Honda 99P',
    link: '#achievements',
  },
  {
    year: '2026',
    title: 'High-Performance Web',
    reflection: 'Shipped Healios V2 (8.09ms Grad-CAM & 3D LiDAR), Apexis (60fps multi-threaded Web Worker race simulator), and Tempo. High reliability systems.',
    tag: 'High-Performance Client Web',
    detail: 'Healios V2 · Apexis · Tempo · OSU Research',
    link: '#projects',
  },
];

export const HistorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  return (
    <section
      id="history"
      ref={containerRef}
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="Trajectory and formative milestones"
    >
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* SECTION HEADER BAR */}
      <div className="p-6 sm:p-8 lg:p-12 border-b border-[#F4EFE6]/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
            <span className="text-[#FFB86C] font-semibold">07 // TRAJECTORY</span>
            <span>FORMATIVE MILESTONES // 08.1</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F4EFE6] leading-none tracking-tight">
            Formative Milestones
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#B0BCCB] max-w-2xl leading-relaxed">
            Inflection points that shaped my technical perspective, system intuition, and commitment to high-reliability software.
          </p>
        </div>

        <div className="text-xs font-mono text-[#8A99AD]">
          4-YEAR ARC // 2023 → 2026
        </div>
      </div>

      {/* CONTINUOUS SCROLL-DRAWN PROGRESS FILAMENT */}
      <div className="w-full h-[2px] bg-[#F4EFE6]/10 relative overflow-hidden">
        <MotionDiv
          style={{ scaleX, transformOrigin: '0%' }}
          className="h-full bg-gradient-to-r from-[#C8321E] via-[#FF6B2B] to-[#FFE9AE] shadow-[0_0_8px_#FF6B2B]"
        />
      </div>

      {/* 4-COLUMN ARCHITECTURAL SEQUENCE SHARING VERTICAL 1PX WALLS */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#F4EFE6]/10 relative">
        {milestones.map((m) => (
          <div
            key={m.year}
            className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-8 hover:bg-[#0C1729]/30 transition-colors group"
          >
            <div className="space-y-4">
              {/* Year Stamp */}
              <div className="text-4xl sm:text-5xl font-serif text-[#FFB86C] font-normal tabular-nums">
                {m.year}
              </div>

              <div className="text-xs font-mono text-[#70A5FF] uppercase tracking-wider">
                {m.tag}
              </div>

              <h3 className="text-xl font-serif text-[#F4EFE6] group-hover:text-[#FFB86C] transition-colors leading-snug">
                {m.title}
              </h3>

              <p className="text-sm font-sans text-[#9BA8B8] leading-relaxed">
                {m.reflection}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F4EFE6]/10 flex items-center justify-between text-xs font-mono text-[#8A99AD]">
              <span className="truncate max-w-[180px]">{m.detail}</span>
              {m.link && (
                <a href={m.link} className="text-[#FFB86C] hover:text-[#FFE9AE] shrink-0 transition-colors">
                  View ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistorySection;
