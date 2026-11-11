import React from 'react';
import Link from 'next/link';
import { VerticalGrandPrixTrack } from './experience/VerticalGrandPrixTrack';

export const ScrollyExperience: React.FC = () => {
  return (
    <section
      id="experience"
      className="relative w-full overflow-hidden py-16 sm:py-24 lg:py-32 select-none"
      aria-label="Engineering & Systems Experience Circuit"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Editorial Heading (Zero HUD / Zero Slop) */}
        <div className="pb-8 border-b border-[#18458B]/20">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Experience.
            </h2>
            <p className="text-base sm:text-xl font-sans text-[#7E8B9B] leading-relaxed">
              Production software engineering, clinical computer vision research, and executive technical leadership.
            </p>
          </div>
        </div>

        {/* Grand Open-Canvas Top-to-Bottom Motorsport Circuit */}
        <VerticalGrandPrixTrack />

        {/* Forward Link to Selected Works */}
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
