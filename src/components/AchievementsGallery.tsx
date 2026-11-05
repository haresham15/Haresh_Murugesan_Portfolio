import React from 'react';
import Link from 'next/link';
import { SectionContainer } from './ui/SectionContainer';
import { GridCrosshair } from './ui/EditorialPrimitives';

interface SecondaryAchievement {
  id: string;
  number: string;
  title: string;
  organization: string;
  date: string;
  classification: 'Competitive Award' | 'Algorithmic Credential' | 'Infrastructure Credential';
  description: string;
  pdfUrl?: string;
}

const secondaryAchievements: SecondaryAchievement[] = [
  {
    id: 'hack-future-2026',
    number: '01',
    title: 'Top Data Science Distinction — Hack To The Future',
    organization: 'Hack To The Future Collegiate Hackathon',
    date: '2026',
    classification: 'Competitive Award',
    description: 'Awarded for NYC OS Market Physics Engine parsing 1M+ transaction records using K-Means clustering and vector field simulation models visualized with Deck.GL.',
  },
  {
    id: 'cs50-algorithms',
    number: '02',
    title: 'CS50 Introduction to Computer Science & Algorithms',
    organization: 'Harvard University',
    date: 'July 2025',
    classification: 'Algorithmic Credential',
    description: 'Completed rigorous computation curriculum spanning heuristic graph search (A*), minimax adversarial game engines, probabilistic Bayesian inference, and C memory management.',
    pdfUrl: '/cs50.pdf',
  },
  {
    id: 'aws-cloud',
    number: '03',
    title: 'AWS Cloud Foundations Architecture Credential',
    organization: 'Amazon Web Services (AWS)',
    date: '2025',
    classification: 'Infrastructure Credential',
    description: 'Validated competency in serverless AWS architecture, S3/DynamoDB event topologies, IAM least-privilege security policies, and CloudWatch performance monitoring.',
    pdfUrl: '/aws-badge.png',
  },
];

export const AchievementsGallery: React.FC = () => {
  return (
    <SectionContainer
      id="achievements"
      variant="editorial"
      bgMode="clean"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Distinctions and certifications"
    >
      {/* Section Intro */}
      <div className="max-w-3xl mb-16 space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono text-[#A7B2C3]">
          <span className="text-[#FF6B35] font-semibold">06</span>
          <span className="text-[#F3EFE7]/30">/</span>
          <span className="tracking-widest uppercase">Recognition &amp; Distinctions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
          Recognition &amp; Distinctions
        </h2>
        <p className="text-base sm:text-lg font-sans text-[#A7B2C3] leading-relaxed">
          Competitive hackathon victories, foundational algorithmic credentials, and cloud architecture validations.
        </p>
      </div>

      {/* FEATURED RECOGNITION BLOCK: Consecutive DataFest Victories (40/60 Balanced Spread) */}
      <div className="bg-[#070B12] border border-[#F3EFE7]/[0.12] rounded-[2px] p-8 sm:p-12 lg:p-16 relative overflow-hidden mb-16 sm:mb-20 shadow-[0_8px_32px_rgba(7,11,18,0.8)]">
        {/* Precision Blueprint Corner Fiducials */}
        <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />
        <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />
        <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />
        <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-40 text-[#82B7FF] pointer-events-none" />

        <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-[#FF6B35]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* 40% Left: Oversized Stat Podium */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-[4.75rem] sm:text-[6.25rem] lg:text-[7.5rem] font-raleway font-extrabold leading-none tabular-nums tracking-tighter text-[#F3EFE7]">
              2× 1st
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 bg-[#101B30] text-[#FF6B35] border border-[#FF6B35]/30 rounded-[2px] font-semibold">
                CHAMPION 2026
              </span>
              <span className="px-3 py-1 bg-[#101B30] text-[#F5D998] border border-[#F5D998]/30 rounded-[2px] font-semibold">
                CHAMPION 2025
              </span>
            </div>

            <div className="text-xs font-mono text-[#7A889B] pt-1">
              American Statistical Association (ASA) · Best Use of External Data
            </div>
          </div>

          {/* 60% Right: 2026 RouteRx Breakdown + 2025 Hack to the Future */}
          <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-[#F3EFE7]/[0.08] lg:pl-12">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F3EFE7] leading-snug">
                American Statistical Association DataFest Champion
              </h3>
              <div className="text-xs font-mono text-[#82B7FF]">
                Consecutive 1st Place Honors · 48-Hour High-Consequence Sprints
              </div>
            </div>

            {/* Structured Breakdown per Prompt */}
            <div className="space-y-4 text-xs font-sans text-[#A7B2C3] leading-relaxed">
              <div className="p-3.5 bg-[#101B30]/60 border border-[#F3EFE7]/[0.06] rounded-[2px] space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#FF6B35] font-semibold">2026 · Careline / RouteRx</span>
                  <span className="text-[#4CC38A]">1st Place Winner</span>
                </div>
                <p className="text-[13.5px] text-[#F3EFE7]/90 leading-relaxed font-normal">
                  Engineered bi-directional transit routing engine resolving acute patient healthcare transit deserts in Shawnee County, KS using OSRM sub-15ms isochrone matrices.
                </p>
              </div>

              <div className="p-3.5 bg-[#101B30]/60 border border-[#F3EFE7]/[0.06] rounded-[2px] space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F5D998] font-semibold">2025 · External Data Modeling</span>
                  <span className="text-[#4CC38A]">1st Place Winner</span>
                </div>
                <p className="text-[13.5px] text-[#F3EFE7]/90 leading-relaxed font-normal">
                  Synthesized multi-source demographic distributions and spatial predictive regressions under intense 48-hour competitive deadlines.
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/projects/routerx-careline-hub"
                className="bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-semibold text-xs font-mono py-3 px-5 inline-flex items-center gap-2 transition-colors select-none rounded-[2px]"
              >
                <span>Explore RouteRx Case Study</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* SECONDARY RECOGNITION INDEX: Clean Borderless Editorial Rows */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-[#7A889B] tracking-wider px-2">
          COMPETITIVE AWARDS &amp; ACCREDITATIONS
        </div>

        <div className="border border-[#F3EFE7]/[0.08] divide-y divide-[#F3EFE7]/[0.08] bg-[#070B12] rounded-[2px] overflow-hidden">
          {secondaryAchievements.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 flex flex-col md:flex-row md:items-baseline justify-between gap-4 hover:bg-[#101B30]/40 transition-colors group"
            >
              <div className="flex items-baseline gap-4 md:gap-6 md:w-2/5">
                <span className="font-mono text-xs font-semibold text-[#FF6B35] tabular-nums select-none">
                  {item.number}
                </span>
                <div>
                  <h4 className="text-lg font-serif text-[#F3EFE7] group-hover:text-[#F5D998] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <div className="text-xs font-mono text-[#7A889B] mt-0.5">
                    {item.organization} · {item.date}
                  </div>
                </div>
              </div>

              <div className="md:w-3/5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <p className="text-sm font-sans text-[#A7B2C3] leading-relaxed max-w-[55ch]">
                  {item.description}
                </p>
                {item.pdfUrl && (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#82B7FF] hover:text-[#FF6B35] transition-colors inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Credential</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default AchievementsGallery;
