import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ThemeSection } from './ThemeSection';

const MotionDiv = motion.div as any;

interface CurvyMilestone {
  id: string;
  year: string;
  phase: string;
  title: string;
  reflection: string;
  tag: string;
  detail: string;
  link?: string;
  side: 'left' | 'right';
  curvePercent: number;
}

const CURVY_MILESTONES: CurvyMilestone[] = [
  {
    id: 'm-2023',
    year: '2023',
    phase: '01 · Origin & Technical Inquiry',
    title: 'Syntinuum Launch & Systems Journalism',
    reflection:
      'Founded an engineering podcast to investigate the gap between textbook algorithms and live production fires. Interviewed founders across healthcare, aerospace, and software, generating 100K+ impressions and building a discipline of technical inquiry.',
    tag: 'Technical Journalism · Audio Engineering',
    detail: '10+ Founder Dialogues · 100K+ Impressions',
    link: '#podcast',
    side: 'left',
    curvePercent: 12,
  },
  {
    id: 'm-2024',
    year: '2024',
    phase: '02 · Computational Modeling',
    title: 'Recursive Graph Schemas & Philocracy',
    reflection:
      'Directed engineering architecture for the Philocracy deliberation platform. Designed cycle-free recursive graph schemas in TypeScript to model complex philosophical premises with mathematical rigor, guaranteeing zero dependency deadlock in debate trees.',
    tag: 'Domain Modeling · TypeScript Schemas',
    detail: 'Recursive Argument Trees · Next.js Engine',
    link: '#projects',
    side: 'right',
    curvePercent: 38,
  },
  {
    id: 'm-2025',
    year: '2025',
    phase: '03 · Competitive Pressure & Telematics',
    title: 'DataFest Champion & Connected Mobility',
    reflection:
      'Won 1st Place at ASA DataFest for predictive external data modeling under an intense 48-hour competitive deadline. Joined Honda 99P Labs as an Innovation Analyst, analyzing 1,000+ vehicle telemetry models to evaluate urban route efficiency and EV battery depletion.',
    tag: 'Spatial Telematics · Statistical Data',
    detail: '1st Place ASA DataFest · Honda 99P Labs',
    link: '#achievements',
    side: 'left',
    curvePercent: 64,
  },
  {
    id: 'm-2026',
    year: '2026',
    phase: '04 · Deterministic Hardware & Vision',
    title: 'Clinical Computer Vision & Deterministic Physics',
    reflection:
      'Shipped Healios V2 uniting 3D LiDAR point-clouds with an 8.09ms vectorized Grad-CAM tensor pipeline. Built Apexis locking 60 FPS deterministic multi-car simulation in dedicated Web Workers with zero main-thread lag. Defended 1st Place at ASA DataFest 2026 with RouteRx.',
    tag: 'Computer Vision · Web Workers · C4 Architecture',
    detail: 'Healios V2 · Apexis · Tempo · RouteRx',
    link: '#projects',
    side: 'right',
    curvePercent: 90,
  },
];

export const HistorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m-2026');
  const [beadPos, setBeadPos] = useState<{ x: number; y: number }>({ x: 720, y: 50 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });

  // Track glowing bead along the central datum path
  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      const path = pathRef.current;
      if (!path) return;
      const totalLen = path.getTotalLength();
      const currentLen = Math.max(0, Math.min(totalLen, latest * totalLen));
      const pt = path.getPointAtLength(currentLen);
      setBeadPos({ x: pt.x, y: pt.y });

      const progressPercent = latest * 100;
      let closest = CURVY_MILESTONES[0];
      let minDiff = 999;
      CURVY_MILESTONES.forEach((m) => {
        const diff = Math.abs(m.curvePercent - progressPercent);
        if (diff < minDiff) {
          minDiff = diff;
          closest = m;
        }
      });
      setActiveMilestoneId(closest.id);
    });
  }, [smoothProgress]);

  return (
    <ThemeSection
      id="history"
      theme="obsidian"
      carbonType="forged"
      carbonOpacity={0.28}
      aria-label="Trajectory and formative milestones"
      className="border-b border-[#18458B]/20 flex flex-col justify-between py-16 sm:py-24 lg:py-36"
    >
      <div ref={containerRef} className="w-full relative my-auto space-y-10 sm:space-y-16">
        
        {/* Section Intro (Clean Editorial Heading) */}
        <div className="pb-8 border-b border-[#18458B]/20">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Trajectory.
            </h2>
            <p className="text-base sm:text-xl font-sans text-[#7E8B9B] leading-relaxed">
              A winding, non-linear progression of technical breakthroughs, collegiate leadership, and competitive hackathon victories.
            </p>
          </div>
        </div>

        {/* =====================================================================
            CENTRAL DATUM LINE (Does not cross text cards)
            ===================================================================== */}
        <div className="relative w-full">
          
          {/* Central Datum Line Spine across Viewport (Stays in center gutter; does not cross text) */}
          <svg
            viewBox="0 0 1440 2000"
            className="hidden lg:block w-full h-full absolute inset-0 pointer-events-none overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="datumSpineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF2800" stopOpacity="0.85" />
                <stop offset="33%" stopColor="#C8D2E0" stopOpacity="0.95" />
                <stop offset="66%" stopColor="#2563EB" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FF2800" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Inactive Central Datum Guideline (Strictly in center corridor X = 720) */}
            <path
              d="M 720 50 C 735 300, 705 500, 720 700 C 735 950, 705 1100, 720 1200 C 735 1450, 705 1600, 720 1700 L 720 1950"
              fill="none"
              stroke="rgba(24, 69, 139, 0.25)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Precision Datum Nodes at Milestones */}
            {[
              { y: 220 },
              { y: 720 },
              { y: 1220 },
              { y: 1720 },
            ].map((node, idx) => (
              <g key={idx} transform={`translate(720, ${node.y})`}>
                <line x1="-20" y1="0" x2="20" y2="0" stroke="#FF2800" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="0" cy="0" r="10" fill="#03050A" stroke="#C8D2E0" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="3" fill="#FF2800" />
              </g>
            ))}

            {/* Active Glowing Datum Path */}
            <path
              ref={pathRef}
              d="M 720 50 C 735 300, 705 500, 720 700 C 735 950, 705 1100, 720 1200 C 735 1450, 705 1600, 720 1700 L 720 1950"
              fill="none"
              stroke="url(#datumSpineGlow)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Traveling Chronological Datum Bead */}
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r="10"
              fill="#FF2800"
              className="animate-ping"
              opacity="0.65"
            />
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r="5"
              fill="#F4F6F9"
              stroke="#FF2800"
              strokeWidth="2.5"
            />
          </svg>

          {/* =====================================================================
              UNBOXED STAGGERED EDITORIAL CHRONOLOGY (4 Canonical Entries)
              ===================================================================== */}
          <div className="relative z-10 space-y-16 sm:space-y-24 lg:space-y-36 pt-6 sm:pt-12 pb-12 sm:pb-20">
            {CURVY_MILESTONES.map((m) => {
              const isSelected = activeMilestoneId === m.id;
              const isLeft = m.side === 'left';

              return (
                <div
                  key={m.id}
                  id={m.id}
                  className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                >
                  <MotionDiv
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45 }}
                    className={`w-full lg:w-[44%] max-w-xl transition-all duration-300 pb-6 border-b border-[#18458B]/25 ${
                      isLeft ? 'lg:pr-8 text-left' : 'lg:pl-8 text-left'
                    }`}
                  >
                    {/* Oversized 64px Serif Year Numeral & Phase Row */}
                    <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 mb-4 border-b border-[#18458B]/20 text-xs font-mono">
                      <div className="flex items-baseline gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#FF2800] animate-pulse' : 'bg-[#7E8B9B]'}`} />
                        <span className="font-serif text-5xl sm:text-6xl text-[#F4F6F9] font-normal leading-none">
                          {m.year}
                        </span>
                      </div>
                      <span className="text-[#FF2800] font-semibold tracking-wider uppercase text-[11px]">
                        {m.phase}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-serif text-[#F4F6F9] mb-3 leading-snug">
                      {m.title}
                    </h3>

                    {/* Reflection */}
                    <p className="text-sm sm:text-base font-sans text-[#7E8B9B] leading-relaxed mb-6">
                      {m.reflection}
                    </p>

                    {/* Bottom Specs */}
                    <div className="pt-4 border-t border-[#18458B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                      <span className="text-[#C8D2E0]">{m.detail}</span>
                      {m.link && (
                        <Link
                          href={m.link}
                          className="min-h-[44px] flex items-center text-[#FF2800] hover:text-[#C8D2E0] transition-colors gap-1 font-semibold uppercase"
                        >
                          <span>Explore System Link</span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  </MotionDiv>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </ThemeSection>
  );
};

export default HistorySection;
