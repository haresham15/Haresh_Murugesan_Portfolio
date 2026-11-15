import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ThemeSection, Reveal } from './ThemeSection';
import { useMotionPreference } from './MotionPreference';
import { profile } from '../content/profile';
import { NOTEBOOK } from '../content/notebook';

const MotionDiv = motion.div;

const CHAMFER = 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)';

/* ---------------------------------------------------------------------------
   Plate figure: a seeded, illustrative tissue tile. Nuclei are placed by
   Poisson-disc style rejection sampling so they never overlap; a subset gets
   a segmentation contour and the saliency field is a 2D Gaussian mixture.
--------------------------------------------------------------------------- */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Nucleus {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rot: number;
  heat: number;
  segmented: boolean;
}

const buildTile = (): Nucleus[] => {
  const rand = mulberry32(20260601);
  const hot = [
    { x: 150, y: 120, s: 70 },
    { x: 250, y: 230, s: 55 },
  ];
  const out: Nucleus[] = [];
  let attempts = 0;
  while (out.length < 70 && attempts < 4000) {
    attempts++;
    const x = 14 + rand() * 332;
    const y = 14 + rand() * 292;
    const rx = 5 + rand() * 6;
    if (out.some((n) => Math.hypot(n.x - x, n.y - y) < n.rx + rx + 7)) continue;
    const heat = Math.min(
      1,
      hot.reduce((acc, h) => acc + Math.exp(-((x - h.x) ** 2 + (y - h.y) ** 2) / (2 * h.s * h.s)), 0),
    );
    out.push({ x, y, rx, ry: rx * (0.62 + rand() * 0.3), rot: rand() * 180, heat, segmented: heat > 0.42 });
  }
  return out;
};

/** Ink and heat on paper: the figure sits directly on the weave, no field, no frame. */
const PathologyFigure: React.FC = () => {
  const nuclei = useMemo(() => buildTile(), []);
  return (
    <svg viewBox="0 0 360 320" className="w-full h-auto block overflow-visible" role="img" aria-label="Illustrative schematic of segmented cell nuclei under a saliency overlay">
      <defs>
        <radialGradient id="about-heat-a" cx="150" cy="120" r="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF2800" stopOpacity="0.30" />
          <stop offset="0.5" stopColor="#FF4419" stopOpacity="0.10" />
          <stop offset="1" stopColor="#FF2800" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="about-heat-b" cx="250" cy="230" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF2800" stopOpacity="0.24" />
          <stop offset="1" stopColor="#FF2800" stopOpacity="0" />
        </radialGradient>
        <pattern id="about-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--mat-ink)" strokeOpacity="0.08" strokeWidth="0.5" />
        </pattern>
        {/* Edges fade in the drawing itself, so the figure ends where its marks end */}
        <radialGradient id="about-fade" cx="0.5" cy="0.5" r="0.62">
          <stop offset="0.6" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="about-fade-mask">
          <rect width="360" height="320" fill="url(#about-fade)" />
        </mask>
      </defs>
      <g mask="url(#about-fade-mask)">
        <rect width="360" height="320" fill="url(#about-grid)" />
        <rect width="360" height="320" fill="url(#about-heat-a)" />
        <rect width="360" height="320" fill="url(#about-heat-b)" />
        {nuclei.map((n, i) => (
          <g key={i} transform={`rotate(${n.rot.toFixed(1)} ${n.x.toFixed(1)} ${n.y.toFixed(1)})`}>
            <ellipse
              cx={n.x}
              cy={n.y}
              rx={n.rx}
              ry={n.ry}
              fill="#153875"
              fillOpacity={0.10 + n.heat * 0.22}
              stroke="var(--mat-ink)"
              strokeOpacity={0.55}
              strokeWidth={0.6}
            />
            {n.segmented && (
              <ellipse
                cx={n.x}
                cy={n.y}
                rx={n.rx + 3.5}
                ry={n.ry + 3.5}
                fill="none"
                stroke="#FF2800"
                strokeWidth={0.9}
                strokeDasharray="2.5 2"
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
};

export const AboutSection: React.FC = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();

  // Portrait parallax: 6% of its height across the time it is on screen.
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], isReduced ? ['0%', '0%'] : ['-3%', '3%']);

  const scrollToAnchor = (anchorId: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth' });
  };

  return (
    <ThemeSection
      id="about"
      theme="obsidian"
      aria-label="About"
      className="py-24 lg:py-36"
    >
      <div className="w-full flex flex-col">
        {/* 40 / 60 spread */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-center">
          <Reveal className="relative">
            <div ref={portraitRef} className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px] mx-auto lg:mx-0 select-none">
              <div className="relative aspect-[4/5] overflow-hidden" style={{ clipPath: CHAMFER }}>
                <MotionDiv className="absolute -inset-y-[4%] inset-x-0" style={{ y: parallaxY }}>
                  <Image
                    src="/profile.jpeg"
                    alt={`Portrait of ${profile.name}`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 460px"
                    className="object-cover object-top"
                  />
                </MotionDiv>
              </div>
              <p className="mt-5 font-mono text-[12px] leading-relaxed text-[var(--mat-muted)]">
                <span className="text-[var(--mat-ink)]">{profile.name}</span> · {profile.education.location} ·{' '}
                {profile.education.degree}, {profile.education.university}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="max-w-[640px]">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[var(--mat-ink)] leading-[1.06] tracking-[-0.02em]">
              I like building the thing that <span className="italic text-[var(--mat-accent-mark)]">doesn’t exist yet</span>,
              then proving it works.
            </h2>
            <p className="mt-8 max-w-[60ch] text-base sm:text-lg font-sans text-[var(--mat-body)] leading-relaxed [font-weight:var(--mat-body-weight)] [letter-spacing:var(--mat-tracking)]">
              I study {profile.education.shortDegree} at Ohio State. Right now I’m an innovation analyst intern at
              Honda Research Institute’s 99P Labs and an undergraduate researcher in digital pathology. This
              summer I built agentic AI tools as a software intern at CAS.
            </p>
            <p className="mt-5 max-w-[60ch] text-base font-sans text-[var(--mat-muted)] leading-relaxed [font-weight:var(--mat-body-weight)]">
              Most of what I make starts as a problem that won’t leave me alone. I get a first version running
              fast, then benchmark it until I know exactly where it breaks.
            </p>

            <div className="mt-10 font-sans text-sm">
              <Link
                href="/about"
                className="min-h-[44px] inline-flex items-center gap-2 text-[var(--mat-ink)] hover:text-[var(--mat-accent-text)] transition-colors"
              >
                <span className="border-b border-current pb-0.5">Full profile</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* The notebook: builds and research Selected Works doesn't show. Works follows directly below. */}
        <div className="mt-24 lg:mt-32">
          <Reveal className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-8">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--mat-ink)] leading-[1.08] tracking-[-0.01em]">
              From the notebook
            </h3>
            <p className="font-sans text-sm text-[var(--mat-muted)] [font-weight:var(--mat-body-weight)]">
              Side builds and research.{' '}
              <a
                href="#projects"
                onClick={scrollToAnchor('projects')}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-[var(--mat-ink)] hover:text-[var(--mat-accent-text)] transition-colors"
              >
                <span className="border-b border-current pb-0.5">The four I’d show first are next</span>
                <span aria-hidden="true">↓</span>
              </a>
            </p>
          </Reveal>

          <ol className="mt-8 border-t border-[var(--mat-rule)]">
            {NOTEBOOK.map((entry, i) => (
              <Reveal as="li" key={entry.slug} delay={0.04 * i} className="border-b border-[var(--mat-rule)]">
                <Link
                  href={`/projects/${entry.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)_13rem_1.25rem] gap-x-8 gap-y-3 py-8 lg:py-10 items-start"
                >
                  <span className="font-serif italic text-lg text-[var(--mat-muted)] group-hover:text-[var(--mat-accent-text)] transition-colors tabular-nums">
                    Fig. {entry.fig}
                  </span>

                  <span className="flex flex-col gap-2">
                    <span className="font-serif text-2xl sm:text-3xl text-[var(--mat-ink)] leading-tight tracking-[-0.01em]">
                      {entry.name}
                    </span>
                    <span className="font-serif italic text-base text-[var(--mat-muted)] leading-snug">
                      {entry.problem}
                    </span>
                  </span>

                  <span className="font-sans text-[15px] text-[var(--mat-body)] leading-relaxed [font-weight:var(--mat-body-weight)] [letter-spacing:var(--mat-tracking)]">
                    {entry.idea}
                  </span>

                  {entry.metric ? (
                    <span className="flex items-baseline gap-3 lg:flex-col lg:items-end lg:gap-1 lg:text-right">
                      <span className="font-serif text-3xl lg:text-4xl text-[var(--mat-ink)] tracking-tight tabular-nums whitespace-nowrap">
                        {entry.metric.value}
                      </span>
                      <span className="font-sans text-[13px] text-[var(--mat-muted)] [font-weight:var(--mat-body-weight)]">
                        {entry.metric.label}
                      </span>
                      {/* Drawing-sheet call-out: a leader under the number */}
                      <span
                        aria-hidden="true"
                        className="hidden lg:block w-full border-b border-dotted border-[var(--mat-rule-strong)] group-hover:border-[var(--mat-accent-mark)] transition-colors"
                      />
                    </span>
                  ) : (
                    <figure className="w-full max-w-[220px] lg:justify-self-end">
                      <PathologyFigure />
                      <figcaption className="mt-2 font-sans text-[12px] text-[var(--mat-muted)] leading-snug [font-weight:var(--mat-body-weight)]">
                        Illustrative schematic. Not patient data.
                      </figcaption>
                    </figure>
                  )}

                  <span
                    aria-hidden="true"
                    className="hidden lg:block font-sans text-sm text-[var(--mat-muted)] group-hover:text-[var(--mat-accent-text)] group-hover:translate-x-1 transition-[color,transform] duration-300"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </ThemeSection>
  );
};

export default AboutSection;
