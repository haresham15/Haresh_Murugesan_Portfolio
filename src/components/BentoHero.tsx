import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// The canvas measures every [data-hero-protect] rect in this section and keeps
// the plume, streamlines and background clear of them.
const AsciiDnaLightbulbCanvas = dynamic(() => import('./AsciiDnaLightbulbCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 w-full h-full bg-[#03050A] pointer-events-none"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 71% 38%, rgba(37, 99, 235, 0.18) 0%, transparent 60%)',
      }}
    />
  ),
});

const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]';

export const BentoHero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full h-dvh min-h-[700px] overflow-hidden flex items-end md:items-center px-6 md:px-16 lg:px-24 select-none bg-[#03050A]"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
        <AsciiDnaLightbulbCanvas />
      </div>

      <div className="relative z-20 w-full max-w-[680px] flex flex-col pb-20 md:pb-0 pointer-events-none">
        <p className="mb-4 sm:mb-6 text-[11px] sm:text-xs font-mono tracking-widest uppercase font-semibold flex flex-wrap items-center gap-x-2.5 gap-y-1 pointer-events-auto">
          <span data-hero-protect className="text-[#FF2800]">The Ohio State University</span>
          <span className="text-[#7E8B9B]" aria-hidden="true">·</span>
          <span data-hero-protect className="text-[#C8D2E0]">B.S. CSE (AI Specialization)</span>
        </p>

        <h1 className="font-serif font-normal text-[clamp(3.4rem,6vw,6.5rem)] leading-[0.95] tracking-[-0.035em] pointer-events-auto">
          <span className="block text-[#F4F6F9]">
            <span data-hero-protect>Curious about intelligence.</span>
          </span>
          <span className="block italic mt-2 md:pl-6">
            <span
              data-hero-protect
              className="pr-[0.08em] bg-gradient-to-r from-[#F4F6F9] via-[#C8D2E0] to-[#FF2800] bg-clip-text text-transparent"
            >
              Obsessed with making it work.
            </span>
          </span>
        </h1>

        <p className="mt-6 max-w-[45ch] text-[18px] leading-relaxed text-[#C8D2E0]/85 font-sans pointer-events-auto">
          <span data-hero-protect>
            Building high-speed computational systems where machine intelligence meets physical reality.
          </span>
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-5 pointer-events-auto">
          <Link
            href="/#projects"
            data-hero-protect
            className={`group inline-flex items-center gap-2.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] px-7 py-3.5 font-mono text-xs uppercase tracking-[0.16em] font-semibold rounded-[2px] shadow-[0_0_24px_rgba(255,40,0,0.32)] transition-[background-color,transform] duration-500 ${SPRING} hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4419]`}
          >
            <span>Explore Work</span>
            <span aria-hidden="true" className={`transition-transform duration-500 ${SPRING} group-hover:translate-x-1`}>
              →
            </span>
          </Link>

          <a
            href="/Haresh_Murugesan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-hero-protect
            className="inline-flex items-center gap-2 text-xs font-mono text-[#F4F6F9] hover:text-[#FF4419] bg-[#060A12] border border-[#153875] hover:border-[#FF2800]/60 px-5 py-3.5 rounded-[2px] transition-colors duration-300 uppercase tracking-[0.16em] font-semibold"
          >
            <span>Résumé (PDF)</span>
            <span aria-hidden="true" className="text-[#FF2800]">↗</span>
          </a>

          <Link
            href="/projects"
            data-hero-protect
            className="hidden md:inline-flex items-center gap-2 text-xs font-mono text-[#7E8B9B] hover:text-[#F4F6F9] transition-colors duration-300 py-2 uppercase tracking-[0.16em]"
          >
            <span>Browse 18 Systems</span>
            <span aria-hidden="true" className="text-[#FF2800]">↓</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 md:left-12 right-6 md:right-12 z-[10] flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]/70 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800] motion-safe:animate-pulse" />
          <span>40.00° N, 83.03° W · Columbus, OH</span>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
