import React from 'react';
import Link from 'next/link';
import { GridCrosshair } from './ui/GridCrosshair';

interface Achievement {
  id: string;
  number: string;
  title: string;
  organization: string;
  date: string;
  distinction: string;
  attribution: string;
  pdfUrl?: string;
  isFlagship?: boolean;
}

const achievements: Achievement[] = [
  {
    id: 'datafest-2026',
    number: '01',
    title: '1st Place — Best Use of External Data',
    organization: 'American Statistical Association (ASA DataFest 2026)',
    date: 'March 2026',
    distinction: 'Top Data Science & Spatial Optimization Distinction',
    attribution: 'Awarded for Careline / RouterX healthcare transit platform combining OSRM sub-15ms routing with multi-modal transit gap identification.',
    pdfUrl: '/datafest-2026.pdf',
    isFlagship: true,
  },
  {
    id: 'datafest-2025',
    number: '02',
    title: '1st Place — Best Use of External Data',
    organization: 'American Statistical Association (ASA DataFest 2025)',
    date: 'March 2025',
    distinction: 'Top External Data Modeling Award',
    attribution: 'Recognized for advanced statistical modeling, external demographic dataset integration, and predictive spatial analysis under a 48-hour competitive sprint.',
    pdfUrl: '/datafest-2025.pdf',
  },
  {
    id: 'hack-future-2026',
    number: '03',
    title: 'Top Data Science Award — Hack To The Future',
    organization: 'Hack To The Future 2026',
    date: '2026',
    distinction: 'Spatial Physics & Housing Valuation Modeling',
    attribution: 'Awarded for NYC OS Market Physics Engine parsing 1M+ transaction records using K-Means clustering and vector field simulation models visualized with Deck.GL.',
  },
  {
    id: 'cs50-algorithms',
    number: '04',
    title: 'CS50 Introduction to Computer Science & Algorithms',
    organization: 'Harvard University',
    date: 'July 2025',
    distinction: 'Algorithmic Foundations & Computation Certificate',
    attribution: 'Completed rigorous curriculum spanning heuristic graph search (A*), minimax adversarial game engines, probabilistic Bayesian inference, and computational data structures.',
    pdfUrl: '/cs50.pdf',
  },
  {
    id: 'aws-cloud',
    number: '05',
    title: 'AWS Cloud Foundations',
    organization: 'Amazon Web Services (AWS)',
    date: '2025',
    distinction: 'Cloud Infrastructure Architecture Credential',
    attribution: 'Validated competency in AWS architecture (Lambda, S3, DynamoDB, VPC networking, IAM security policies, and CloudWatch telemetry).',
    pdfUrl: '/aws-badge.png',
  },
];

export const AchievementsGallery: React.FC = () => {
  return (
    <section
      id="achievements"
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="Distinctions and certifications"
    >
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* 12-Column Blueprint Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Cols 1–5: Unboxed Monumental Podium (Zero Heavy Box Containers) */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-8 bg-[#0C1729]/30">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
              <span className="text-[#FFB86C] font-semibold">06 // RECOGNITION</span>
              <span>INDEX // 07.1</span>
            </div>

            {/* Monumental 2x 1st in Geist Serif Triangle */}
            <div
              className="text-[4rem] sm:text-[5.5rem] lg:text-[6.5rem] font-serif font-normal leading-none tabular-nums"
              style={{
                background: 'linear-gradient(180deg, #FFE9AE 0%, #FFB86C 45%, #FF6B2B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              2× 1st
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] leading-snug">
                American Statistical Association DataFest
              </h3>
              <div className="text-xs font-mono text-[#70A5FF]">
                2025 &amp; 2026 Champion · Best Use of External Data
              </div>
              <p className="text-[15px] sm:text-[16px] font-sans text-[#B0BCCB] leading-relaxed pt-2">
                Back-to-back 1st place victories recognized for advanced demographic integration, spatial transit modeling, and building high-consequence data engines under 48-hour competitive deadlines.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F4EFE6]/10">
            <Link
              href="/projects/routerx-careline-hub"
              className="w-full bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold text-xs font-mono py-4 px-6 flex items-center justify-between transition-colors select-none"
            >
              <span>Explore RouteRx Case Study</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Cols 6–12: Numbered Recognition Ledger (Rows 01–05) */}
        <div className="lg:col-span-7 divide-y divide-[#F4EFE6]/10">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-6 sm:p-8 flex items-start gap-6 hover:bg-[#0C1729]/40 transition-colors group"
            >
              <span className="font-mono text-sm font-semibold text-[#FF6B2B] pt-0.5 tabular-nums select-none">
                {ach.number}
              </span>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="text-lg sm:text-xl font-serif text-[#F4EFE6] group-hover:text-[#FFB86C] transition-colors">
                    {ach.title}
                  </h4>
                  <span className="text-xs font-mono text-[#8A99AD] sm:text-right shrink-0">
                    {ach.date}
                  </span>
                </div>
                <div className="text-xs font-sans text-[#70A5FF]">
                  {ach.organization}
                </div>
                <p className="text-[14px] sm:text-[15px] font-sans text-[#9BA8B8] leading-relaxed pt-1">
                  {ach.attribution}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AchievementsGallery;
