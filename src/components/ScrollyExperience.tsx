import React from 'react';
import Link from 'next/link';
import { VerticalGrandPrixTrack } from './experience/VerticalGrandPrixTrack';

export const ScrollyExperience: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative w-screen max-w-none overflow-hidden py-24 sm:py-32 select-none"
      aria-label="Engineering & Systems Experience Circuit"
    >
      <div className="w-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw]">
        
        {/* Editorial Heading (Unboxed & De-Vibecoded) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#18458B]/20">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Experience.
            </h2>
            <p className="text-base sm:text-xl font-sans text-[#7E8B9B] leading-relaxed">
              Production software engineering, clinical computer vision research, and executive technical leadership.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#C8D2E0] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
            <span className="text-[#FF2800] font-semibold">5 VERIFIED SECTORS</span>
            <span className="text-[#7E8B9B]">· Click apex to navigate</span>
          </div>
        </div>

        {/* Grand Open-Canvas Top-to-Bottom Motorsport Circuit */}
        <VerticalGrandPrixTrack />

        {/* Seamless Forward Link to Selected Works */}
        <div className="w-full pt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#18458B]/20 text-xs font-mono">
          <span className="text-[#7E8B9B] uppercase tracking-wider">
            Systems &amp; Production Architecture
          </span>
          <Link
            href="#projects"
            className="text-[#FF2800] hover:text-[#C8D2E0] transition-colors inline-flex items-center gap-2 uppercase font-semibold"
          >
            <span>Explore Selected Works</span>
            <span>↓</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ScrollyExperience;
