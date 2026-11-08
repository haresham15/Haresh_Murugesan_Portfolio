import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BlurText } from './reactbits/BlurText';

// Dynamic import with SSR disabled to safely mount WebGL/Canvas on the client
const AsciiDnaLightbulbCanvas = dynamic(
  () => import('./AsciiDnaLightbulbCanvas'),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 w-full h-full bg-[#03050A] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 25% 42%, rgba(255, 40, 0, 0.18) 0%, transparent 60%), radial-gradient(ellipse at 74% 35%, rgba(11, 30, 64, 0.25) 0%, transparent 65%)',
        }}
      />
    ),
  }
);

export const BentoHero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-screen h-dvh min-h-[100svh] max-w-none overflow-hidden flex items-center p-0 select-none"
      aria-label="Ballistic ASCII DNA-Lightbulb Stage and Introduction"
    >
      {/* Ambient Architectural Atmospheric Gradient: Left Radiant Filament Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[12%] -left-[10%] w-[70vw] h-[105vh] sm:w-[58vw] sm:h-[115vh] opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 28% 42%, rgba(255, 40, 0, 0.16) 0%, rgba(24, 69, 139, 0.12) 35%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-[2%] left-[8%] w-[48vw] h-[48vh] opacity-80"
          style={{
            background:
              'radial-gradient(circle at 35% 65%, rgba(255, 40, 0, 0.14) 0%, rgba(11, 30, 64, 0.12) 45%, transparent 75%)',
          }}
        />
      </div>

      {/* 1. Interactive 45° Ballistic ASCII DNA-Lightbulb Canvas */}
      <div className="absolute inset-0 z-0">
        <AsciiDnaLightbulbCanvas />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#03050A] via-[#03050A]/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Top Spacer to accommodate floating clean Header */}
      <div className="w-full pt-24 sm:pt-28 pointer-events-none" />

      {/* 3. Hero Main Stage: Full-window fluid horizontal architecture */}
      <div className="relative z-20 w-full px-[4vw] md:px-[6vw] xl:px-[7vw] my-auto flex flex-col justify-center pointer-events-none">
        
        {/* Primary Statement */}
        <div id="hero-headline-block" className="max-w-4xl pointer-events-auto">
          <h1 className="text-[#F4F6F9] text-[clamp(3.75rem,6.8vw,7.25rem)] leading-[0.96] tracking-[-0.035em]">
            <span className="block font-sans font-bold text-[#F4F6F9] drop-shadow-[0_8px_32px_rgba(3,5,10,0.95)]">
              <BlurText text="Curious about intelligence." />
            </span>
            <span className="block font-serif italic font-normal text-[#C8D2E0] mt-2 sm:mt-4 pl-0 sm:pl-6 md:pl-10 drop-shadow-[0_12px_40px_rgba(3,5,10,0.98)]">
              <BlurText text="Obsessed with making it work." delay={0.06} />
            </span>
          </h1>
        </div>

        {/* Concise Sub-Module */}
        <div id="hero-subcopy-block" className="w-full max-w-[560px] mt-10 sm:mt-14 lg:mt-16 pointer-events-auto">
          <div className="space-y-4">
            <p className="text-[16.5px] sm:text-[18.5px] text-[#7E8B9B] font-sans leading-[1.65] font-normal max-w-[48ch]">
              Building high-speed computational systems where machine intelligence meets physical reality.
            </p>

            <div className="pt-2">
              <Link
                href="/#projects"
                className="group inline-flex items-center gap-3 text-sm font-mono text-[#F4F6F9] hover:text-[#FF4419] transition-colors py-1 select-none"
              >
                <span className="border-b border-[#FF2800] pb-0.5 font-medium tracking-wide">
                  Explore Work
                </span>
                <span className="text-base text-[#FF2800] group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Restrained Exit Transition */}
      <div className="relative z-20 w-full px-[4vw] md:px-[6vw] xl:px-[7vw] pb-8 pt-2 flex items-center justify-end text-xs font-mono text-[#7E8B9B] pointer-events-none">
        <div className="flex items-center gap-2 text-[#7E8B9B] pointer-events-auto">
          <Link href="#about" className="hover:text-[#F4F6F9] transition-colors inline-flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-[#FF2800] animate-bounce">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
