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
  curvePercent: number; // 0 to 100% along the curvy path
}

const CURVY_MILESTONES: CurvyMilestone[] = [
  {
    id: 'm-2023',
    year: '2023',
    phase: '01  Origin & Technical Inquiry',
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
    phase: '02  Computational Modeling',
    title: 'Recursive Graph Schemas & Philocracy',
    reflection:
      'Directed engineering architecture for the Philocracy deliberation platform. Designed cycle-free recursive graph schemas in TypeScript to model complex philosophical premises with mathematical rigor, guaranteeing zero dependency deadlock in debate trees.',
    tag: 'Domain Modeling · TypeScript Schemas',
    detail: 'Recursive Argument Trees · Next.js Engine',
    link: '#projects',
    side: 'right',
    curvePercent: 35,
  },
  {
    id: 'm-2025',
    year: '2025',
    phase: '03  Competitive Pressure & Telematics',
    title: 'DataFest Champion & Connected Mobility',
    reflection:
      'Won 1st Place at ASA DataFest for predictive external data modeling under an intense 48-hour competitive deadline. Joined Honda 99P Labs as an Innovation Analyst, analyzing 1,000+ vehicle telemetry models to evaluate urban route efficiency and EV battery depletion.',
    tag: 'Spatial Telematics · Statistical Data',
    detail: '1st Place ASA DataFest · Honda 99P Labs',
    link: '#achievements',
    side: 'left',
    curvePercent: 58,
  },
  {
    id: 'm-2026',
    year: '2026',
    phase: '04  Deterministic Hardware & Vision',
    title: 'Clinical Computer Vision & Deterministic Physics',
    reflection:
      'Shipped Healios V2 uniting 3D LiDAR point-clouds with an 8.09ms vectorized Grad-CAM tensor pipeline. Built Apexis locking 60 FPS deterministic multi-car simulation in dedicated Web Workers with zero main-thread lag. Defended 1st Place at ASA DataFest 2026 with RouteRx.',
    tag: 'Computer Vision · Web Workers · C4 Architecture',
    detail: 'Healios V2 · Apexis · Tempo · RouteRx',
    link: '#projects',
    side: 'right',
    curvePercent: 82,
  },
  {
    id: 'm-2027',
    year: '2027+',
    phase: '05  The Trajectory Vector',
    title: 'High-Concurrency Systems & Spatial Intelligence',
    reflection:
      'Scaling distributed autonomous agent workflows, low-latency spatial indexing, and hardware-accelerated simulation runtimes. Seeking high-impact software engineering and machine learning roles where computational speed directly impacts human operators.',
    tag: 'Autonomous Systems · Distributed Runtimes',
    detail: 'Summer 2027 Software Engineering & AI',
    link: '#contact',
    side: 'left',
    curvePercent: 96,
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

  // Track glowing bead along the curvy winding SVG path
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
      aria-label="Trajectory and formative curvy milestones"
      className="border-b border-[#F4F6F9]/10 flex flex-col justify-between py-24 lg:py-36"
    >
      <div ref={containerRef} className="w-full relative my-auto space-y-12 sm:space-y-16">
        
        {/* Section Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#FF2800]">
              <span className="w-6 h-px bg-[#FF2800]" />
              <span>05  Trajectory &amp; Curvilinear Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Trajectory &amp; Curvy Milestones
            </h2>
            <p className="text-base sm:text-lg font-sans text-[#7E8B9B] leading-relaxed">
              A winding, non-linear progression of technical breakthroughs, collegiate leadership, and competitive hackathon victories.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#7E8B9B] shrink-0">
            <span className="px-3 py-1.5 bg-[#060A12] border border-[#FF2800]/30 rounded-[2px] text-[#C8D2E0]">
              ● 5-YEAR CHRONOLOGICAL EXPANSION
            </span>
          </div>
        </div>

        {/* =====================================================================
            WINDING CURVY BEZIER RIBBON SPINE ACROSS FULL VIEWPORT
            ===================================================================== */}
        <div className="relative w-full">
          
          {/* Sweeping Curvy SVG Spine */}
          <svg
            viewBox="0 0 1440 2000"
            className="w-full h-auto absolute inset-0 pointer-events-none overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="curvySpineGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF2800" stopOpacity="0.85" />
                <stop offset="30%" stopColor="#C8D2E0" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#10B981" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#FFB86C" stopOpacity="1" />
              </linearGradient>

              {/* Anisotropic Carbon Fiber Texture Filter for Spine Backplate */}
              <filter id="spineNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" />
                <feColorMatrix type="saturate" values="0.1" />
              </filter>
            </defs>

            {/* Inactive Curvy Ribbon Bed (Sweeping S-Bends between 320 and 1120) */}
            <path
              d="M 720 50 C 420 180, 240 280, 320 440 C 400 600, 1200 640, 1120 840 C 1040 1040, 260 1100, 320 1300 C 380 1500, 1220 1560, 1120 1740 C 1020 1920, 620 1960, 720 2000"
              fill="none"
              stroke="rgba(244, 241, 234, 0.07)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Curving Contour Ribs at intervals */}
            {[
              { x: 320, y: 440, angle: -25 },
              { x: 1120, y: 840, angle: 25 },
              { x: 320, y: 1300, angle: -25 },
              { x: 1120, y: 1740, angle: 25 },
            ].map((rib, idx) => (
              <g key={idx} transform={`translate(${rib.x}, ${rib.y}) rotate(${rib.angle})`}>
                <line x1="-35" y1="0" x2="35" y2="0" stroke="#FF2800" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="0" cy="0" r="14" fill="#03050A" stroke="#C8D2E0" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4" fill="#FF2800" />
              </g>
            ))}

            {/* Animated Active Glowing Serpentine Path */}
            <path
              ref={pathRef}
              d="M 720 50 C 420 180, 240 280, 320 440 C 400 600, 1200 640, 1120 840 C 1040 1040, 260 1100, 320 1300 C 380 1500, 1220 1560, 1120 1740 C 1020 1920, 620 1960, 720 2000"
              fill="none"
              stroke="url(#curvySpineGlow)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Traveling Chronological Node Bead */}
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r="12"
              fill="#FF2800"
              className="animate-ping"
              opacity="0.65"
            />
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r="7"
              fill="#F4F6F9"
              stroke="#FF2800"
              strokeWidth="3"
            />
          </svg>

          {/* =====================================================================
              CURVY MILESTONE DOSSIER CARDS (Interleaved on curves)
              ===================================================================== */}
          <div className="relative z-10 space-y-24 sm:space-y-36 pt-12 pb-20">
            {CURVY_MILESTONES.map((m) => {
              const isSelected = activeMilestoneId === m.id;
              const isLeft = m.side === 'left';

              return (
                <div
                  key={m.id}
                  id={m.id}
                  className={`w-full flex ${isLeft ? 'justify-start lg:pl-8 xl:pl-12' : 'justify-end lg:pr-8 xl:pr-12'}`}
                >
                  <MotionDiv
                    onClick={() => setActiveMilestoneId(m.id)}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45 }}
                    className={`w-full max-w-xl p-6 sm:p-8 lg:p-10 rounded-[2px] border transition-all duration-300 shadow-2xl cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#060A12] border-[#FF2800] shadow-[0_12px_45px_rgba(232,93,4,0.22)]'
                        : 'bg-[#060A12]/95 border-[#F4F6F9]/10 hover:border-[#FF2800]/40'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F4F6F9]/10 text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#FF6B35] animate-pulse' : 'bg-[#7E8B9B]'}`} />
                        <span className="font-serif text-3xl sm:text-4xl text-[#FF6B35] font-normal leading-none">
                          {m.year}
                        </span>
                      </div>
                      <span className="text-[#C8D2E0] font-medium tracking-wider">
                        {m.phase}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#F4F6F9] mb-3">
                      {m.title}
                    </h3>

                    {/* Reflection */}
                    <p className="text-sm sm:text-base font-sans text-[#7E8B9B] leading-relaxed mb-6">
                      {m.reflection}
                    </p>

                    {/* Bottom Specs */}
                    <div className="pt-4 border-t border-[#F4F6F9]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                      <span className="text-[#64748B]">{m.detail}</span>
                      {m.link && (
                        <Link
                          href={m.link}
                          className="text-[#FF2800] hover:text-[#C8D2E0] transition-colors inline-flex items-center gap-1 font-semibold uppercase"
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
