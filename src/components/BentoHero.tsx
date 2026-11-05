import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BlurText } from './ui/ReactBitsControls';

const AsciiDnaLightbulbCanvas = dynamic(
  () => import('./AsciiDnaLightbulbCanvas').then((mod) => mod.AsciiDnaLightbulbCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 w-full h-full bg-[#070B12] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 25% 42%, rgba(255, 107, 53, 0.20) 0%, transparent 60%), radial-gradient(ellipse at 74% 35%, rgba(255, 107, 53, 0.12) 0%, transparent 65%)',
        }}
      />
    ),
  }
);

export const BentoHero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#070B12] text-[#F3EFE7]"
      aria-label="Ballistic ASCII DNA-Lightbulb Stage and Introduction"
    >
      {/* Ambient Architectural Atmospheric Gradient: Left Orange Radiant Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Left-Side Radiant Orange Atmosphere */}
        <div
          className="absolute -top-[12%] -left-[10%] w-[70vw] h-[105vh] sm:w-[58vw] sm:h-[115vh] opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 28% 42%, rgba(255, 107, 53, 0.22) 0%, rgba(255, 138, 72, 0.13) 32%, rgba(245, 217, 152, 0.05) 58%, transparent 80%)',
          }}
        />
        {/* Secondary Lower-Left Ignition Launch Origin Warm Bloom */}
        <div
          className="absolute bottom-[2%] left-[8%] w-[48vw] h-[48vh] opacity-80"
          style={{
            background:
              'radial-gradient(circle at 35% 65%, rgba(255, 107, 53, 0.18) 0%, rgba(245, 217, 152, 0.05) 45%, transparent 75%)',
          }}
        />
      </div>

      {/* 1. Interactive 45° Ballistic ASCII DNA-Lightbulb & Concept D CFD Wind-Tunnel Canvas */}
      <div className="absolute inset-0 z-0">
        <AsciiDnaLightbulbCanvas />
        {/* Soft bottom dissipation mask into next section */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070B12] via-[#070B12]/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Top Spacer to accommodate floating clean Header */}
      <div className="w-full pt-20 sm:pt-24 pointer-events-none" />

      {/* 3. Hero Main Stage: Concise Monumental Serif Headline + Clean Lower-Left Editorial Module */}
      <div className="relative z-20 w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 my-auto flex flex-col justify-center pointer-events-none">
        
        {/* Primary Statement (Left Safe Zone strictly clear of 45° thrust line) */}
        <div id="hero-headline-block" className="max-w-3xl pointer-events-auto">
          <h1 className="text-[#F3EFE7] text-[2.75rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.25rem] leading-[1.02] tracking-[-0.03em]">
            <span className="block font-raleway font-bold text-[#F3EFE7] drop-shadow-[0_8px_24px_rgba(7,11,18,0.9)]">
              <BlurText text="Curious about intelligence." />
            </span>
            <span className="block font-serif italic font-normal text-[#F5D998] mt-2.5 sm:mt-5 pl-0 sm:pl-8 md:pl-12 drop-shadow-[0_12px_32px_rgba(7,11,18,0.95)]">
              <BlurText text="Obsessed with making it work." delay={0.06} />
            </span>
          </h1>
        </div>

        {/* Concise Sub-Module (Lower-Left / Editorial Alignment: Borderless, zero box clutter) */}
        <div id="hero-subcopy-block" className="w-full max-w-[540px] mt-10 sm:mt-14 lg:mt-16 pointer-events-auto">
          <div className="space-y-4">
            {/* Concise Lead (17px-18px, max 46ch, #A7B2C3) */}
            <p className="text-[16px] sm:text-[17.5px] text-[#A7B2C3] font-sans leading-[1.6] font-normal max-w-[46ch]">
              Building high-speed computational systems where machine intelligence meets physical reality.
            </p>

            {/* Single Primary Editorial CTA */}
            <div className="pt-2">
              <Link
                href="/#projects"
                className="group inline-flex items-center gap-3 text-sm font-mono text-[#F3EFE7] hover:text-[#F5D998] transition-colors py-1 select-none"
              >
                <span className="border-b border-[#FF6B35] pb-0.5 font-medium tracking-wide">
                  Explore Work
                </span>
                <span className="text-base text-[#FF6B35] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Restrained Exit Transition (Clean scroll prompt) */}
      <div className="relative z-20 w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 pb-6 pt-2 flex items-center justify-end text-xs font-mono text-[#7A889B] pointer-events-none">
        <div className="flex items-center gap-2 text-[#A7B2C3] pointer-events-auto">
          <Link href="#about" className="hover:text-[#F3EFE7] transition-colors inline-flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-[#FF6B35] animate-bounce">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
