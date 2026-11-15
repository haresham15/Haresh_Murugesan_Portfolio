import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { profile } from '@/content/profile';

// The canvas measures every [data-hero-protect] rect in this section and keeps
// the plume, streamlines and background clear of them.
const AsciiDnaLightbulbCanvas = dynamic(() => import('./AsciiDnaLightbulbCanvas'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 71% 38%, rgba(37, 99, 235, 0.18) 0%, transparent 60%)',
      }}
    />
  ),
});

const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]';

const PROOFS = [
  { label: 'AI and software intern, CAS', href: '#experience' },
  { label: '2× 1st place, ASA DataFest', href: '#achievements' },
];

export const BentoHero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full h-dvh min-h-[700px] overflow-hidden flex items-end md:items-center px-6 md:px-16 lg:px-24 select-none"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 w-full h-full z-[1] pointer-events-none">
        <AsciiDnaLightbulbCanvas />
      </div>

      <div className="relative z-20 w-full max-w-[680px] flex flex-col pb-20 md:pb-0 pointer-events-none">
        <h1 className="font-serif font-normal text-[#F4F6F9] text-[clamp(3rem,min(7vw,9vh),7rem)] leading-[0.92] tracking-[-0.035em] pointer-events-auto">
          <span data-hero-protect>{profile.name}</span>
        </h1>

        <p className="mt-4 font-serif italic text-[clamp(1.5rem,min(2.6vw,4vh),2.25rem)] leading-tight text-[#C8D2E0] pointer-events-auto">
          <span data-hero-protect>{profile.tagline}</span>
        </p>

        <p className="mt-3 font-sans text-[15px] sm:text-[17px] leading-snug text-[#C8D2E0]/85 pointer-events-auto">
          <span data-hero-protect>{profile.focus}</span>
        </p>

        {/* The résumé facts a recruiter scans for first: degree, graduation, role and season. */}
        <p className="mt-6 sm:mt-8 max-w-[52ch] font-sans text-[15px] sm:text-base leading-snug text-[#C8D2E0] pointer-events-auto">
          {/* One sentence per line, so a web-font swap can't move words between lines (layout shift). */}
          <span data-hero-protect className="block">
            {profile.education.shortDegree} at Ohio State, graduating {profile.education.expectedGraduation}.
          </span>{' '}
          <span data-hero-protect className="block text-[#F4F6F9]">
            Seeking {profile.availability.targetSeason} {profile.availability.seeking}.
          </span>
        </p>


        {/* Two proof points, each a link to its section further down. */}
        <ul
          aria-label="Highlights"
          className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline gap-x-3 gap-y-2 font-sans text-[15px] text-[#F4F6F9] pointer-events-auto"
        >
          {PROOFS.map((proof, i) => (
            <li key={proof.href} className="flex items-baseline gap-x-3">
              {i > 0 && (
                <span aria-hidden="true" className="hidden sm:inline text-[#7E8B9B]">
                  ·
                </span>
              )}
              <a
                href={proof.href}
                data-hero-protect
                className="underline decoration-[#FF2800]/60 decoration-1 underline-offset-[5px] hover:text-[#FF4419] hover:decoration-[#FF4419] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4419]"
              >
                {proof.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-5 pointer-events-auto">
          <a
            href={profile.contacts.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-hero-protect
            data-track="resume_click"
            className={`group inline-flex items-center gap-2.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] px-7 py-3.5 font-mono text-xs uppercase tracking-[0.16em] font-semibold rounded-[2px] shadow-[0_0_24px_rgba(255,40,0,0.32)] transition-[background-color,transform] duration-500 ${SPRING} hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF4419]`}
          >
            <span>Résumé (PDF)</span>
            <span aria-hidden="true" className={`transition-transform duration-500 ${SPRING} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
              ↗
            </span>
          </a>

          <Link
            href="/#projects"
            data-hero-protect
            className="group inline-flex items-center gap-2 text-xs font-mono text-[#F4F6F9] hover:text-[#FF4419] bg-[#060A12] border border-[#153875] hover:border-[#FF2800]/60 px-5 py-3.5 rounded-[2px] transition-colors duration-300 uppercase tracking-[0.16em] font-semibold"
          >
            <span>Explore work</span>
            <span aria-hidden="true" className="text-[#FF2800] transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

    </section>
  );
};

export default BentoHero;
