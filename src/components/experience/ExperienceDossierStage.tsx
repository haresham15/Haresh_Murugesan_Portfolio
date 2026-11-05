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
      className={`w-full max-w-[1140px] mx-auto border border-[#F3EFE7]/[0.1] bg-[#070B12] rounded-[2px] overflow-hidden relative shadow-[0_12px_40px_rgba(0,0,0,0.5)] ${className}`}
      aria-live="polite"
    >
      {/* Precision Crosshair Fiducials at Swiss Grid Corners */}
      <GridCrosshair className="absolute top-2 left-2 opacity-35 text-[#82B7FF] pointer-events-none" />
      <GridCrosshair className="absolute top-2 right-2 opacity-35 text-[#82B7FF] pointer-events-none" />
      <GridCrosshair className="absolute bottom-2 left-2 opacity-35 text-[#82B7FF] pointer-events-none" />
      <GridCrosshair className="absolute bottom-2 right-2 opacity-35 text-[#82B7FF] pointer-events-none" />

      {/* Top Telemetry Control Strip */}
      <div className="px-5 sm:px-7 py-3 border-b border-[#F3EFE7]/[0.08] bg-[#0A101C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-[#F3EFE7] font-semibold uppercase tracking-wider">
            PIT-WALL TELEMETRY DOSSIER
          </span>
          <span className="text-[#7A889B]">|</span>
          <span className="text-[#82B7FF]">SECTOR {String(currentIndex + 1).padStart(2, '0')} OF {String(totalCount).padStart(2, '0')}</span>
        </div>

        {/* Previous Sector / Next Sector Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="px-3 py-1 text-xs font-mono text-[#F3EFE7] bg-[#101B30] hover:bg-[#17243A] hover:text-[#FF6B35] border border-[#F3EFE7]/15 rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
            aria-label="Previous Sector"
          >
            <span>←</span>
            <span>Previous Sector</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-3 py-1 text-xs font-mono text-[#F3EFE7] bg-[#101B30] hover:bg-[#17243A] hover:text-[#FF6B35] border border-[#F3EFE7]/15 rounded-[2px] transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
            aria-label="Next Sector"
          >
            <span>Next Sector</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <MotionDiv
          key={record.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#F3EFE7]/[0.08]"
        >
          {/* =========================================================================
              LEFT COLUMN (40% Width — Organization, Role, Period & Stack)
              ========================================================================= */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#070B12]/90">
            <div className="space-y-4">
              
              {/* Year & Period Header */}
              <div className="flex items-center justify-between border-b border-[#F3EFE7]/[0.06] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-serif text-[#FF6B35] tabular-nums font-normal">
                    {record.year}
                  </span>
                  <span className="text-xs font-mono text-[#7A889B] tracking-wider uppercase">
                    / {record.period}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#A7B2C3] uppercase tracking-wider">
                  {record.location}
                </span>
              </div>

              {/* Organization Heading & Role */}
              <div className="space-y-1.5">
                <h3 className="text-2xl sm:text-[27px] font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
                  {record.company}
                </h3>
                <p className="text-sm sm:text-base font-sans font-medium text-[#FF6B35] leading-snug">
                  {record.role}
                </p>
                {record.teamOrDivision && (
                  <p className="text-xs font-mono text-[#82B7FF] tracking-wide pt-0.5">
                    {record.teamOrDivision}
                  </p>
                )}
              </div>

              {/* Classification Tag */}
              <div className="inline-block px-2.5 py-1 bg-[#101B30] text-[10.5px] font-mono text-[#82B7FF] uppercase tracking-wider rounded-[2px] border border-[#F3EFE7]/10">
                {record.classification}
              </div>

              {/* Core Stack / Technologies Demonstrated */}
              <div className="pt-2 border-t border-[#F3EFE7]/[0.06]">
                <div className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider mb-1.5">
                  Verified Tech Stack:
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#C4CDD8] font-sans">
                  {record.skillsDemonstrated.map((tech, idx, arr) => (
                    <React.Fragment key={tech}>
                      <span className="text-[#F3EFE7] font-medium">{tech}</span>
                      {idx < arr.length - 1 && <span className="text-[#7A889B] select-none">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Sector Progress Bar */}
            <div className="pt-4 border-t border-[#F3EFE7]/[0.06] flex items-center justify-between text-xs font-mono text-[#7A889B]">
              <span>PROGRESSION</span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalCount }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-[#FF6B35]'
                        : idx < currentIndex
                        ? 'w-2 bg-[#F5D998]'
                        : 'w-2 bg-[#F3EFE7]/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (60% Width — Narrative Summary & Measurable Deliverables)
              ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Lead Context Summary */}
              <p className="text-[15px] sm:text-[16px] font-sans text-[#F3EFE7] leading-[1.68] font-normal">
                {record.leadSummary}
              </p>

              {/* Measurable Contributions / Bullet Points */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[10px] font-mono text-[#7A889B] uppercase tracking-wider">
                  Measurable Engineering Outcomes:
                </div>
                <ul className="space-y-2.5">
                  {record.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] font-sans text-[#A7B2C3] leading-relaxed">
                      <span className="text-[#FF6B35] select-none font-mono text-xs shrink-0 pt-0.5">―</span>
                      <span className="max-w-[64ch]">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Proof Section: Verified Outcome + Case Study Cross-Links */}
            <div className="pt-4 border-t border-[#F3EFE7]/[0.08] space-y-2.5">
              {record.verifiedOutcome && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 text-xs font-mono">
                  <span className="text-[#4CC38A] font-semibold shrink-0">VERIFIED OUTCOME:</span>
                  <span className="text-[#F3EFE7]/90 text-[12px] sm:text-xs font-sans">{record.verifiedOutcome}</span>
                </div>
              )}

              {/* Cross-Link Chips (Zero-Box Swiss style) */}
              {record.projectSlugs && record.projectSlugs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-[#7A889B]">
                  <span className="text-[#F5D998] text-[11px]">Related Case Studies:</span>
                  {record.projectSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/projects/${slug}`}
                      className="px-2.5 py-0.5 bg-[#101B30] text-[#82B7FF] hover:text-[#FF6B35] hover:border-[#FF6B35]/30 border border-[#F3EFE7]/15 rounded-[2px] transition-colors text-[11px]"
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
