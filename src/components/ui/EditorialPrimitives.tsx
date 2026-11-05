import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface GridCrosshairProps {
  className?: string;
  size?: number;
}

export const GridCrosshair: React.FC<GridCrosshairProps> = ({
  className = '',
  size = 9,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#F3EFE7]/30 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <line x1="4.5" y1="0" x2="4.5" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

export interface SectionEyebrowProps {
  index?: string;
  category: string;
  metadata?: string;
  datum?: string;
  className?: string;
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({
  index,
  category,
  metadata,
  datum,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center justify-between text-xs font-mono uppercase tracking-[0.16em] text-[#A7B2C3] select-none ${className}`}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="text-[#FF6B35] font-semibold tracking-wider tabular-nums">
            {index}
          </span>
        )}
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/70" />
        <span className="text-[#F3EFE7] tracking-wider font-medium">
          {category}
        </span>
      </div>

      {/* Center Dashed Datum Wire on wide viewports */}
      <div className="hidden lg:flex flex-1 mx-8 items-center">
        <div className="w-full h-px border-b border-dashed border-[#F3EFE7]/[0.08]" />
      </div>

      <div className="flex items-center gap-4">
        {datum && (
          <span className="text-[#82B7FF] hidden md:inline text-[11px] tracking-widest tabular-nums">
            {datum}
          </span>
        )}
        {metadata && (
          <span className="text-[#7A889B] hidden sm:inline tabular-nums">
            {metadata}
          </span>
        )}
      </div>
    </div>
  );
};

export interface EditorialDividerProps {
  className?: string;
}

export const EditorialDivider: React.FC<EditorialDividerProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`w-full h-px bg-[#F3EFE7]/[0.08] my-8 sm:my-12 ${className}`}
      role="separator"
      aria-hidden="true"
    />
  );
};

export interface TechnicalMetadataProps {
  items: string[];
  label?: string;
  className?: string;
}

export const TechnicalMetadata: React.FC<TechnicalMetadataProps> = ({
  items,
  label = 'STACK',
  className = '',
}) => {
  return (
    <div className={`text-xs font-mono text-[#A7B2C3] flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      {label && <span className="text-[#F5D998] font-medium">{label}:</span>}
      <span>{items.join(' · ')}</span>
    </div>
  );
};

export interface ResearchArtifactProps {
  title: string;
  figureNumber?: string;
  metricLabel: string;
  metricValue: string;
  caption: string;
  explanation: string;
  imageSrc: string;
  imageAlt: string;
  projectHref?: string;
  className?: string;
}

export const ResearchArtifact: React.FC<ResearchArtifactProps> = ({
  title,
  figureNumber = 'FIG 01.1',
  metricLabel,
  metricValue,
  caption,
  explanation,
  imageSrc,
  imageAlt,
  projectHref,
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-[#070B12] border border-[#F3EFE7]/[0.1] rounded-[2px] p-6 sm:p-8 lg:p-10 space-y-6 relative transition-colors duration-200 hover:border-[#F3EFE7]/20 ${className}`}
    >
      {/* 4 Precision Blueprint Corner Fiducials */}
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />
      <GridCrosshair className="absolute -bottom-[4.5px] -left-[4.5px]" />
      <GridCrosshair className="absolute -bottom-[4.5px] -right-[4.5px]" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#A7B2C3] border-b border-[#F3EFE7]/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#FF6B35] font-semibold tabular-nums">{figureNumber}</span>
          <span className="text-[#F3EFE7] uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#7A889B]">{metricLabel}:</span>
          <span className="text-[#FF6B35] font-medium tabular-nums px-2.5 py-0.5 bg-[#101B30] border border-[#F3EFE7]/[0.12] rounded-[2px]">
            {metricValue}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] bg-[#070B12] border border-[#F3EFE7]/[0.08] rounded-[2px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover object-center filter contrast-[1.03]"
        />
        <div className="absolute top-3 right-3 bg-[#070B12]/95 backdrop-blur-sm px-3 py-1.5 text-[11px] font-mono text-[#F5D998] border border-[#F3EFE7]/[0.15] rounded-[2px]">
          <span>{metricValue} verified benchmark</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#A7B2C3] pt-1">
        <span className="font-sans text-sm text-[#A7B2C3] leading-relaxed">
          {caption} — <span className="text-[#F3EFE7]">{explanation}</span>
        </span>
        {projectHref && (
          <Link
            href={projectHref}
            className="text-[#FF6B35] hover:text-[#F5D998] transition-colors shrink-0 inline-flex items-center gap-1.5 font-mono text-xs uppercase"
          >
            <span>View Architecture</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
};
