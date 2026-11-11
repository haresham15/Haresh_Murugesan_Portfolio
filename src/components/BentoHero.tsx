import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import with SSR disabled for high-performance canvas engine
const AsciiDnaLightbulbCanvas = dynamic(
  () => import('./AsciiDnaLightbulbCanvas'),
  {
    ssr: false,
    loading: () => (
      <div
        className="absolute inset-0 w-full h-full bg-[#03050A] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 71% 38%, rgba(37, 99, 235, 0.22) 0%, transparent 65%), radial-gradient(ellipse at 25% 42%, rgba(255, 40, 0, 0.14) 0%, transparent 60%)',
        }}
      />
    ),
  }
);

export const BentoHero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full h-dvh overflow-hidden flex items-center m-0 p-0 select-none bg-[#03050A]"
      aria-label="Ballistic 45° ASCII DNA-Lightbulb Stage and Introduction"
    >
      {/* 1. Full-Bleed 100% x 100dvh Concept D Hybrid Wind-Tunnel & 45° ASCII Lightbulb Canvas */}
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
        <AsciiDnaLightbulbCanvas />
      </div>

      {/* 2. Left-Side Editorial Column (Centered Vertically with >48px clearance above bottom) */}
      <div className="relative z-[10] pl-5 sm:pl-8 md:pl-16 lg:pl-24 pr-5 sm:pr-8 max-w-[780px] w-full flex flex-col justify-center my-auto pointer-events-none pt-8 pb-16 md:pb-20">
        
        {/* Recruiter Context Eyebrow (Degrees & Institutions) */}
        <div className="mb-3 sm:mb-5 text-[11px] sm:text-xs font-mono tracking-widest uppercase font-semibold flex flex-wrap items-center gap-x-2.5 gap-y-1 pointer-events-auto">
          <span className="text-[#FF2800]">THE OHIO STATE UNIVERSITY</span>
          <span className="text-[#7E8B9B]">·</span>
          <span className="text-[#C8D2E0]">B.S. CSE (AI SPECIALIZATION)</span>
        </div>

        {/* Headline Block */}
        <div id="hero-headline-block" className="pointer-events-auto">
          <h1 className="leading-[1.02] sm:leading-[0.96] tracking-[-0.035em]">
            <span className="block font-serif font-normal text-[#F4F6F9] text-[clamp(2.35rem,5.6vw,6.75rem)] drop-shadow-[0_8px_32px_rgba(3,5,10,0.95)]">
              Curious about intelligence.
            </span>
            <span className="block font-serif italic font-normal text-[clamp(2.35rem,5.6vw,6.75rem)] mt-1.5 md:mt-2 md:pl-8 bg-gradient-to-r from-[#C8D2E0] via-[#F4F6F9] to-[#C8D2E0] bg-clip-text text-transparent drop-shadow-[0_12px_40px_rgba(3,5,10,0.98)]">
              Obsessed with making it work.
            </span>
          </h1>
        </div>

        {/* Lead Sentence */}
        <div id="hero-subcopy-block" className="mt-5 sm:mt-6 md:mt-8 max-w-[46ch] pointer-events-auto">
          <p className="text-[15px] sm:text-[18px] md:text-[20px] text-[#C8D2E0] font-sans leading-relaxed font-normal">
            Building high-speed computational systems where machine intelligence meets physical reality.
          </p>
        </div>

        {/* Primary Recruiter CTA Row */}
        <div className="mt-6 md:mt-8 pointer-events-auto flex flex-wrap items-center gap-3 sm:gap-6">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2.5 bg-[#FF2800] text-[#F4F6F9] hover:bg-[#FF4419] px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-mono tracking-wider uppercase transition-transform duration-200 hover:translate-x-1 rounded-[2px] font-semibold shadow-[0_0_24px_rgba(255,40,0,0.38)]"
          >
            <span>Explore Work</span>
            <span className="text-base group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>

          <a
            href="/Haresh_Murugesan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#F4F6F9] hover:text-[#FF2800] bg-[#060A12] border border-[#18458B]/40 hover:border-[#FF2800]/50 px-5 py-3 rounded-[2px] transition-colors uppercase tracking-wider font-semibold"
          >
            <span>Résumé (PDF)</span>
            <span className="text-[#FF2800]">↗</span>
          </a>

          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-xs font-mono text-[#7E8B9B] hover:text-[#F4F6F9] transition-colors py-2 uppercase tracking-wider"
          >
            <span>Browse 18 Systems</span>
            <span className="text-[#FF2800]">↓</span>
          </Link>
        </div>

      </div>

      {/* 3. Bottom Hairline Datum & Coordinate Reticle */}
      <div className="absolute bottom-4 left-6 md:left-12 right-6 md:right-12 z-[10] flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]/70 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800] animate-pulse" />
          <span>40.00° N, 83.03° W · COLUMBUS, OH</span>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
