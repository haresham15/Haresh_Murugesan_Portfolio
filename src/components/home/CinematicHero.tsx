import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { profile } from '@/content/profile';
import { HeroPoster } from './HeroPoster';
import { SceneBoundary } from '@/components/layout/SceneBoundary';

export const CinematicHero: React.FC = () => {
  return (
    <section className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 lg:pb-24">
      
      {/* 12-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT 5 COLUMNS: Identity, Role, Proof Chips, Actions */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          
          {/* Availability & Mode Shortcut Pill */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#F3EFE7]/10 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="text-xs font-mono text-[#E0E0E0] tracking-wide">
                {profile.availability.status} · {profile.availability.targetSeason}
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.02] border border-[#F3EFE7]/[0.08] text-[11px] font-mono text-[#A6ADB8]">
              <span>Key:</span>
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-[#F3EFE7] font-semibold">[R]</kbd>
              <span>Recruiter Scan</span>
            </span>
          </div>

          {/* Profile Name & Picture Header */}
          <div className="flex items-center gap-4 sm:gap-5 mb-5">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[2px] overflow-hidden border border-[#F3EFE7]/15 shadow-lg shrink-0">
              <Image
                src="/profile.jpeg"
                alt="Haresh Murugesan"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#F3EFE7] tracking-tight leading-tight">
                {profile.name}
              </h1>
              <p className="text-xs font-mono text-[#7DD3FC] tracking-wider uppercase mt-0.5">
                Full-Stack Systems & AI/ML
              </p>
            </div>
          </div>

          {/* Headline & Role Line */}
          <p className="text-lg sm:text-xl font-heading font-medium text-[#E0E0E0] leading-snug mb-3">
            {profile.headline}
          </p>
          <p className="text-sm font-sans text-[#A6ADB8] leading-relaxed mb-8 max-w-xl">
            {profile.roleLine}
          </p>

          {/* Proof Chips (3) */}
          <div className="flex flex-col gap-2.5 mb-8">
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#A6ADB8]/70">
              Verified Technical Milestones
            </p>
            {profile.proofChips.map((chip) => (
              <Link
                key={chip.id}
                href={chip.href}
                className="group flex items-center justify-between p-3 rounded-[2px] bg-white/[0.02] hover:bg-white/[0.06] border border-[#F3EFE7]/10 hover:border-[#7DD3FC]/40 transition-all text-left"
              >
                <div>
                  <p className="text-xs sm:text-sm font-sans font-semibold text-[#F3EFE7] group-hover:text-[#7DD3FC] transition-colors">
                    {chip.label}
                  </p>
                  <p className="text-[11px] font-mono text-[#A6ADB8]">
                    {chip.sublabel}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#7DD3FC] opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                  ↗
                </span>
              </Link>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              data-magnetic
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] text-sm font-sans font-semibold text-[#050505] bg-[#7DD3FC] hover:bg-white transition-all shadow-[0_2px_12px_rgba(125,211,252,0.3)]"
            >
              <span>Explore my work</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </a>

            <Link
              href="/resume"
              data-magnetic
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] text-sm font-sans font-medium text-[#E0E0E0] bg-white/5 hover:bg-white/10 border border-[#F3EFE7]/10 hover:border-white/20 transition-all"
            >
              <span>View résumé</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#A6ADB8]">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>

        </div>

        {/* RIGHT 7 COLUMNS: Signal-to-System Scene Container */}
        <div className="lg:col-span-7 w-full flex items-center justify-center">
          <SceneBoundary sceneName="SignalToSystemHero">
            <HeroPoster />
          </SceneBoundary>
        </div>

      </div>

    </section>
  );
};

export default CinematicHero;

