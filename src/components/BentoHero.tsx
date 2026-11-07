import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BlurText } from './ui/ReactBitsControls';
import { ThemeSection } from './ThemeSection';

const AsciiDnaLightbulbCanvas = dynamic(
  () => import('./AsciiDnaLightbulbCanvas').then((mod) => mod.AsciiDnaLightbulbCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 w-full h-full bg-[#060608] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 25% 42%, rgba(232, 93, 4, 0.20) 0%, transparent 60%), radial-gradient(ellipse at 74% 35%, rgba(244, 162, 97, 0.12) 0%, transparent 65%)',
        }}
      />
    ),
  }
);

export const BentoHero: React.FC = () => {
  return (
    <ThemeSection
      id="hero"
      theme="obsidian"
      minHeight="min-h-[115dvh]"
      className="p-0 overflow-hidden flex flex-col justify-between"
      aria-label="Ballistic ASCII DNA-Lightbulb Stage and Introduction"
    >
      {/* Ambient Architectural Atmospheric Gradient: Left Radiant Filament Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[12%] -left-[10%] w-[70vw] h-[105vh] sm:w-[58vw] sm:h-[115vh] opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 28% 42%, rgba(232, 93, 4, 0.22) 0%, rgba(244, 162, 97, 0.13) 32%, rgba(254, 217, 152, 0.05) 58%, transparent 80%)',
          }}
        />
        <div
          className="absolute bottom-[2%] left-[8%] w-[48vw] h-[48vh] opacity-80"
          style={{
            background:
              'radial-gradient(circle at 35% 65%, rgba(232, 93, 4, 0.18) 0%, rgba(254, 217, 152, 0.05) 45%, transparent 75%)',
          }}
        />
      </div>

      {/* 1. Interactive 45° Ballistic ASCII DNA-Lightbulb Canvas */}
      <div className="absolute inset-0 z-0">
        <AsciiDnaLightbulbCanvas />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#060608] via-[#060608]/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Top Spacer to accommodate floating clean Header */}
      <div className="w-full pt-24 sm:pt-28 pointer-events-none" />

      {/* 3. Hero Main Stage: Full-window fluid horizontal architecture */}
      <div className="relative z-20 w-full px-[4vw] md:px-[6vw] xl:px-[7vw] my-auto flex flex-col justify-center pointer-events-none">
        
        {/* Primary Statement */}
        <div id="hero-headline-block" className="max-w-4xl pointer-events-auto">
          <h1 className="text-[#F5F3EF] text-[2.75rem] sm:text-[4.25rem] md:text-[5.25rem] lg:text-[6.5rem] leading-[1.02] tracking-[-0.035em]">
            <span className="block font-raleway font-bold text-[#F5F3EF] drop-shadow-[0_8px_24px_rgba(6,6,8,0.9)]">
              <BlurText text="Curious about intelligence." />
            </span>
            <span className="block font-serif italic font-normal text-[#F4A261] mt-2.5 sm:mt-5 pl-0 sm:pl-8 md:pl-12 drop-shadow-[0_12px_32px_rgba(6,6,8,0.95)]">
              <BlurText text="Obsessed with making it work." delay={0.06} />
            </span>
          </h1>
        </div>

        {/* Concise Sub-Module */}
        <div id="hero-subcopy-block" className="w-full max-w-[560px] mt-10 sm:mt-14 lg:mt-16 pointer-events-auto">
          <div className="space-y-4">
            <p className="text-[16.5px] sm:text-[18.5px] text-[#8E8D94] font-sans leading-[1.65] font-normal max-w-[48ch]">
              Building high-speed computational systems where machine intelligence meets physical reality.
            </p>

            <div className="pt-2">
              <Link
                href="/#projects"
                className="group inline-flex items-center gap-3 text-sm font-mono text-[#F5F3EF] hover:text-[#F4A261] transition-colors py-1 select-none"
              >
                <span className="border-b border-[#E85D04] pb-0.5 font-medium tracking-wide">
                  Explore Work
                </span>
                <span className="text-base text-[#E85D04] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Restrained Exit Transition */}
      <div className="relative z-20 w-full px-[4vw] md:px-[6vw] xl:px-[7vw] pb-8 pt-2 flex items-center justify-end text-xs font-mono text-[#8E8D94] pointer-events-none">
        <div className="flex items-center gap-2 text-[#8E8D94] pointer-events-auto">
          <Link href="#about" className="hover:text-[#F5F3EF] transition-colors inline-flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-[#E85D04] animate-bounce">↓</span>
          </Link>
        </div>
      </div>
    </ThemeSection>
  );
};

export default BentoHero;
