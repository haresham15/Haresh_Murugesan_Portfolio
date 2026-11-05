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
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE7] leading-tight tracking-tight">
          <span className="font-raleway font-bold">Recognition</span> &amp; <span className="font-serif italic font-normal text-[#F5D998]">Distinctions.</span>
        </h2>
        <p className="text-base sm:text-lg font-sans text-[#A7B2C3] leading-relaxed">
          Competitive hackathon victories, foundational algorithmic credentials, and cloud architecture validations.
        </p>
      </div>

      {/* 7.6 FEATURED RECOGNITION BLOCK: Consecutive DataFest Victories (Swiss Zero-Box Plate) */}
      <div className="bg-[#070B12] border border-[#F3EFE7]/[0.12] rounded-[2px] p-8 sm:p-12 lg:p-16 relative overflow-hidden mb-16 sm:mb-20 shadow-[0_8px_32px_rgba(7,11,18,0.8)]">
        {/* Precision Blueprint Corner Fiducials */}
        <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
        <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#82B7FF]" />
        <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
        <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-40 text-[#82B7FF]" />

        <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#F5D998] via-[#FF6B35] to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Oversized Stat Podium with 2025 & 2026 Markers */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="text-[4.5rem] sm:text-[6rem] lg:text-[7rem] font-raleway font-extrabold leading-none tabular-nums tracking-tighter"
              style={{
                background: 'linear-gradient(180deg, #FFE9AE 0%, #F5D998 40%, #FF6B35 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              2× 1st
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 bg-[#101B30] text-[#FF6B35] border border-[#F3EFE7]/15 rounded-[2px] font-semibold">
                CHAMPION 2026
              </span>
              <span className="px-3 py-1 bg-[#101B30] text-[#F5D998] border border-[#F3EFE7]/15 rounded-[2px] font-semibold">
                CHAMPION 2025
              </span>
            </div>
          </div>

          {/* Contextual Narrative & Project Case Study Connection */}
          <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-[#F3EFE7]/[0.08] lg:pl-12">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F3EFE7] leading-snug">
                American Statistical Association DataFest
              </h3>
              <div className="text-xs font-mono text-[#82B7FF]">
                Best Use of External Data · 48-Hour Competitive Data Hackathon
              </div>
            </div>

            <p className="text-[15px] sm:text-[16px] font-sans text-[#A7B2C3] leading-[1.7]">
              Back-to-back 1st place victories recognized for advanced demographic integration, spatial transit modeling, and building high-consequence data engines under 48-hour competitive sprint deadlines. In 2026, engineered RouteRx/Careline integrating sub-15ms OSRM isochrone matrices to identify transit deserts for healthcare patients in Shawnee County, KS.
            </p>

            <div className="pt-2">
              <Link
                href="/projects/routerx-careline-hub"
                className="bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-semibold text-xs font-mono py-3.5 px-6 inline-flex items-center gap-2 transition-colors select-none rounded-[2px]"
              >
                <span>Explore RouteRx Case Study</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 7.7 SECONDARY RECOGNITION INDEX: Clean editorial rows below feature */}
      <div className="space-y-4">
        <div className="text-xs font-mono text-[#7A889B] tracking-wider px-2">
          Competitive Awards &amp; Accreditations
        </div>

        <div className="border border-[#F3EFE7]/[0.08] divide-y divide-[#F3EFE7]/[0.08] bg-[#070B12] rounded-[2px] overflow-hidden">
          {secondaryAchievements.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 flex flex-col md:flex-row md:items-baseline justify-between gap-4 hover:bg-[#101B30]/40 transition-colors group"
            >
              <div className="flex items-baseline gap-4 md:gap-6 md:w-2/5">
                <span className="font-mono text-xs font-semibold text-[#FF6B35] tabular-nums select-none">
                  {item.number}
                </span>
                <div className="space-y-1">
                  <h4 className="text-lg font-serif text-[#F3EFE7] group-hover:text-[#F5D998] transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-xs font-mono text-[#82B7FF]">
                    {item.organization}
                  </div>
                </div>
              </div>

              <div className="md:w-3/5 space-y-2">
                <p className="text-[14px] sm:text-[15px] font-sans text-[#A7B2C3] leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-[#7A889B]">
                  <span className="px-2 py-0.5 bg-[#101B30] text-[#A7B2C3] text-[11px]">
                    {item.classification}
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </SectionContainer>
  );
};

export default AchievementsGallery;
