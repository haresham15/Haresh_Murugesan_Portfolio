import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { SectionContainer } from './ui/SectionContainer';

const MotionDiv = motion.div as any;

interface FormativeMilestone {
  year: string;
  theme: string;
  title: string;
  reflection: string;
  tag: string;
  detail: string;
  link?: string;
}

const milestones: FormativeMilestone[] = [
  {
    year: '2023',
    theme: 'Origin',
    title: 'Syntinuum Launch & Systems Journalism',
    reflection: 'Started an engineering podcast to understand how chief architects navigate the gap between textbook algorithms and live production fires. Interviewed founders across healthcare, aerospace, and software, generating 100K+ impressions and building a discipline of technical inquiry.',
    tag: 'Technical Journalism · Audio Engineering',
    detail: '10+ Founder Dialogues · 100K+ Reach',
    link: '#podcast',
  },
  {
    year: '2024',
    theme: 'Systems Thinking',
    title: 'Recursive Graph Schemas & Product Governance',
    reflection: 'Directed engineering for the Philocracy structured deliberation platform. Designed cycle-free recursive graph schemas in TypeScript to model complex philosophical premises with mathematical rigor, guaranteeing zero dependency deadlock in debate trees.',
    tag: 'Domain Modeling · TypeScript Schemas',
    detail: 'Recursive Argument Trees · Next.js Engine',
  },
  {
    year: '2025',
    theme: 'Applied Modeling',
    title: 'DataFest Champion & Connected Mobility',
    reflection: 'Won 1st Place at ASA DataFest for predictive external data modeling under an intense 48-hour competitive deadline. Joined Honda 99P Labs as an Innovation Analyst, analyzing 1,000+ vehicle telemetry models to evaluate urban route efficiency and EV battery depletion.',
    tag: 'Spatial Telematics · Statistical Data',
    detail: '1st Place ASA DataFest · Honda 99P Labs',
    link: '#achievements',
  },
  {
    year: '2026',
    theme: 'High-Performance Engineering',
    title: 'Clinical Computer Vision & Deterministic Physics',
    reflection: 'Shipped Healios V2 uniting 3D LiDAR point-clouds with an 8.09ms vectorized Grad-CAM tensor pipeline. Built Apexis locking 60 FPS deterministic multi-car simulation in dedicated Web Workers with zero main-thread lag. Defended 1st Place at ASA DataFest 2026 with RouteRx.',
    tag: 'Computer Vision · Web Workers · C4 Architecture',
    detail: 'Healios V2 · Apexis · Tempo · RouteRx',
    link: '#projects',
  },
];

export const HistorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  return (
    <SectionContainer
      id="history"
      ref={containerRef as any}
      variant="editorial"
      bgMode="clean"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Trajectory and formative milestones"
    >
      {/* Section Intro */}
      <div className="max-w-3xl mb-16 sm:mb-20 space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
          Formative Milestones &amp; <span className="italic text-[#F5D998]">Systems Arc.</span>
        </h2>
        <p className="text-base sm:text-lg font-sans text-[#A7B2C3] leading-relaxed">
          Inflection points that shaped my technical perspective, system intuition, and commitment to high-reliability software.
        </p>
      </div>

      {/* 7.14 SPACIOUS EDITORIAL CHRONOLOGY: Vertical Progressive Timeline */}
      <div className="relative pl-6 sm:pl-10 md:pl-12 space-y-16 sm:space-y-24">
        
        {/* Continuous Animated Vertical Timeline Spine */}
        <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-[#F3EFE7]/[0.08] overflow-hidden">
          <MotionDiv
            style={{ scaleY, transformOrigin: 'top' }}
            className="w-full h-full bg-gradient-to-b from-[#FF6B35] via-[#F5D998] to-[#FFE9AE] shadow-[0_0_8px_#FF6B35]"
          />
        </div>

        {milestones.map((m) => (
          <div
            key={m.year}
            className="relative space-y-6 group"
          >
            {/* Timeline Node Bead */}
            <div className="absolute -left-[30px] sm:-left-[46px] md:-left-[54px] top-2 w-3.5 h-3.5 bg-[#070B12] border-2 border-[#FF6B35] rounded-full group-hover:bg-[#F5D998] transition-colors" />

            {/* Year Stamp & Narrative Theme */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FF6B35] font-normal tabular-nums leading-none">
                {m.year}
              </span>
              <span className="text-lg sm:text-xl font-serif text-[#F5D998] italic">
                — {m.theme}
              </span>
            </div>

            {/* Title & Tag */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif text-[#F3EFE7] group-hover:text-[#F5D998] transition-colors leading-snug">
                {m.title}
              </h3>
              <div className="text-xs font-mono text-[#82B7FF] uppercase tracking-wider">
                {m.tag}
              </div>
            </div>

            {/* Readable Uncompressed Narrative (Zero truncation) */}
            <p className="max-w-[70ch] text-[15px] sm:text-[16px] font-sans text-[#A7B2C3] leading-[1.72]">
              {m.reflection}
            </p>

            {/* Detail & Link Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#7A889B] border-t border-[#F3EFE7]/[0.06] max-w-[70ch]">
              <span>{m.detail}</span>
              {m.link && (
                <a
                  href={m.link}
                  className="text-[#FF6B35] hover:text-[#F5D998] transition-colors inline-flex items-center gap-1 uppercase font-semibold"
                >
                  <span>Explore Associated Work</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        ))}

      </div>
    </SectionContainer>
  );
};

export default HistorySection;
