import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GridCrosshair } from '../ui/EditorialPrimitives';

const MotionDiv = motion.div as any;

export interface DetailedExperienceRecord {
  id: string;
  year: string;
  period: string;
  role: string;
  company: string;
  teamOrDivision?: string;
  location: string;
  classification: string;
  leadSummary: string;
  bullets: string[];
  skillsDemonstrated: string[];
  verifiedOutcome?: string;
  projectSlugs?: string[];
  evidenceIds?: string[];
}

export interface ExperienceDossierStageProps {
  record: DetailedExperienceRecord;
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const ExperienceDossierStage: React.FC<ExperienceDossierStageProps> = ({
  record,
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  className = '',
}) => {
  return (
    <div
      className={`w-full max-w-[1140px] mx-auto border border-[#F3EFE7]/[0.08] bg-[#070B12] rounded-[2px] overflow-hidden relative shadow-[0_12px_32px_rgba(0,0,0,0.4)] ${className}`}
      aria-live="polite"
    >
      {/* Precision Crosshair Fiducials at Swiss Grid Corners */}
      <GridCrosshair className="absolute top-2 left-2 opacity-30 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-2 right-2 opacity-30 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-2 left-2 opacity-30 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-2 right-2 opacity-30 text-[#82B7FF]" />

      <AnimatePresence mode="wait">
        <MotionDiv
          key={record.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#F3EFE7]/[0.08]"
        >
          {/* =========================================================================
              LEFT COLUMN (38% Width — Role Identity & Context)
              ========================================================================= */}
          <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-5 bg-[#070B12]/80">
            <div className="space-y-4">
              {/* Year & Period Header */}
              <div className="flex items-center justify-between border-b border-[#F3EFE7]/[0.06] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-serif text-[#FF6B35] tabular-nums font-normal">
                    {record.year}
                  </span>
                  <span className="text-[11px] font-mono text-[#7A889B] tracking-wider uppercase">
                    / {record.period}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#A7B2C3] uppercase tracking-wider">
                  {record.location}
                </span>
              </div>

              {/* Organization Heading & Subtitles */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl lg:text-[25px] font-serif font-normal text-[#F3EFE7] leading-snug tracking-tight">
                  {record.company}
                </h3>
                <p className="text-sm sm:text-[15px] font-sans font-medium text-[#FF6B35] leading-snug">
                  {record.role}
                </p>
                {record.teamOrDivision && (
                  <p className="text-[11px] font-mono text-[#82B7FF] tracking-wide pt-0.5">
                    {record.teamOrDivision}
                  </p>
                )}
              </div>

              {/* Classification Tag */}
              <div className="inline-block px-2 py-0.5 bg-[#101B30] text-[10px] font-mono text-[#82B7FF] uppercase tracking-wider rounded-[2px] border border-[#F3EFE7]/10">
                {record.classification}
              </div>

              {/* Core Stack / Technologies Demonstrated */}
              <div className="pt-1">
                <div className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider mb-1">
                  Stack:
                </div>
                <div className="text-xs font-mono text-[#A7B2C3] leading-relaxed">
                  {record.skillsDemonstrated.join(' · ')}
                </div>
              </div>
            </div>

            {/* Prev / Next Controls (Machined Buttons) */}
            <div className="pt-4 border-t border-[#F3EFE7]/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrev}
                  className="px-2.5 py-1 text-xs font-mono text-[#F3EFE7] bg-[#101B30] hover:bg-[#17243A] hover:text-[#FF6B35] border border-[#F3EFE7]/10 rounded-[2px] transition-colors flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  aria-label="Previous chicane (triggers forward wrap-around lap)"
                >
                  <span>←</span>
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="px-2.5 py-1 text-xs font-mono text-[#F3EFE7] bg-[#101B30] hover:bg-[#17243A] hover:text-[#FF6B35] border border-[#F3EFE7]/10 rounded-[2px] transition-colors flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  aria-label="Next chicane"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>

              {/* Chicane Index Counter */}
              <div className="text-xs font-mono text-[#7A889B] tabular-nums">
                <span className="text-[#FF6B35] font-semibold">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span> / </span>
                <span>{String(totalCount).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (62% Width — Scope, Ownership & Measurable Outcomes)
              ========================================================================= */}
          <div className="lg:col-span-7 p-5 sm:p-6 lg:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Lead Context Summary */}
              <p className="text-[14px] sm:text-[15.5px] font-sans text-[#F3EFE7] leading-[1.62] font-normal">
                {record.leadSummary}
              </p>

              {/* Measurable Contributions / Bullet Points */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider">
                  Scope &amp; Deliverables:
                </div>
                <ul className="space-y-2">
                  {record.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[12.5px] sm:text-[13.5px] font-sans text-[#A7B2C3] leading-relaxed">
                      <span className="text-[#FF6B35] select-none font-mono text-xs shrink-0 pt-0.5">―</span>
                      <span className="max-w-[62ch]">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Proof Section: Verified Outcome + Case Study Cross-Links */}
            <div className="pt-4 border-t border-[#F3EFE7]/[0.08] space-y-2">
              {record.verifiedOutcome && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 text-xs font-mono">
                  <span className="text-[#4CC38A] font-semibold shrink-0">VERIFIED OUTCOME:</span>
                  <span className="text-[#F3EFE7]/90 text-[11.5px] sm:text-xs">{record.verifiedOutcome}</span>
                </div>
              )}

              {/* Cross-Link Chips (Zero-Box Swiss style) */}
              {record.projectSlugs && record.projectSlugs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-mono text-[#7A889B]">
                  <span className="text-[#F5D998] text-[11px]">Case Studies:</span>
                  {record.projectSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/projects/${slug}`}
                      className="px-2 py-0.5 bg-[#101B30] text-[#82B7FF] hover:text-[#FF6B35] hover:border-[#FF6B35]/30 border border-[#F3EFE7]/10 rounded-[2px] transition-colors text-[11px]"
                    >
                      /{slug} →
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
};

export default ExperienceDossierStage;
