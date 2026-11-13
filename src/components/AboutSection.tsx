import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ThemeSection, Reveal } from './ThemeSection';
import { useMotionPreference } from './MotionPreference';
import { profile } from '../content/profile';
import { getEvidence } from '../content/evidence';

const MotionDiv = motion.div;

const CHAMFER = 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)';

const aws = getEvidence('cas-aws-scale');

const ANCHORS = [
  { value: aws?.value.replace(' Internal Use Cases', '') ?? '12', label: 'AWS use cases shipped', source: 'Chemical Abstracts Service', href: '/#experience' },
];

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
                    className="object-cover object-top grayscale contrast-[1.08]"
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
              I build software where <span className="italic text-[var(--mat-accent-mark)]">computational speed</span> meets
              real-world physical and human systems.
            </h2>
            <p className="mt-8 max-w-[60ch] text-base sm:text-lg font-sans text-[var(--mat-body)] leading-relaxed [font-weight:var(--mat-body-weight)] [letter-spacing:var(--mat-tracking)]">
              My work sits between deterministic data pipelines, explainable deep learning and low-latency client
              architecture: the pieces that keep clinicians, analysts and operators in control of what the
              software is doing.
            </p>
            <p className="mt-5 max-w-[60ch] text-base font-sans text-[var(--mat-muted)] leading-relaxed [font-weight:var(--mat-body-weight)]">
              {profile.education.degree} at {profile.education.university}, expected {profile.education.expectedGraduation}.
              Seeking {profile.availability.targetSeason} {profile.availability.seeking.toLowerCase()}.
            </p>

            <ul className="mt-10 border-t border-[var(--mat-rule)]">
              {ANCHORS.map((a) => (
                <li key={a.label} className="border-b border-[var(--mat-rule)]">
                  <a
                    href={a.href}
                    onClick={a.href.startsWith('/#') ? scrollToAnchor(a.href.slice(2)) : undefined}
                    className="group grid grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[8rem_1fr_auto] items-baseline gap-4 py-4 min-h-[44px]"
                  >
                    <span className="font-serif text-2xl sm:text-3xl text-[var(--mat-ink)] tracking-tight tabular-nums">{a.value}</span>
                    <span className="font-sans text-sm text-[var(--mat-body)] leading-snug [font-weight:var(--mat-body-weight)]">
                      {a.label} <span className="text-[var(--mat-muted)]">· {a.source}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-sans text-sm text-[var(--mat-muted)] group-hover:text-[var(--mat-accent-text)] group-hover:translate-x-1 transition-[color,transform] duration-300"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 font-sans text-sm">
              <a
                href="#experience"
                onClick={scrollToAnchor('experience')}
                className="px-6 py-3.5 min-h-[44px] bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] font-semibold rounded-[2px] transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>See the experience</span>
                <span aria-hidden="true">↑</span>
              </a>
              <Link
                href="/about"
                className="min-h-[44px] inline-flex items-center justify-center sm:justify-start gap-2 text-[var(--mat-ink)] hover:text-[var(--mat-accent-text)] transition-colors"
              >
                <span className="border-b border-current pb-0.5">Full profile</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Research figure. The role and its bullets live in Experience (entry 02); only the figure stays here. */}
        <Reveal className="mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <figure className="lg:col-span-5">
            <PathologyFigure />
            <figcaption className="mt-3 font-sans text-sm text-[var(--mat-muted)] leading-relaxed [font-weight:var(--mat-body-weight)]">
              Illustrative schematic of nucleus segmentation under a saliency overlay. Not patient data.
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--mat-ink)] leading-[1.08] tracking-[-0.01em]">
              Digital pathology, made explainable.
            </h3>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-sans text-sm [font-weight:var(--mat-body-weight)]">
              <Link
                href="/projects/cv-allergy-wheal"
                className="min-h-[44px] inline-flex items-center gap-2 text-[var(--mat-accent-text)] hover:text-[var(--mat-ink)] transition-colors"
              >
                <span className="border-b border-current pb-0.5">Related: wheal quantification pipeline</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/projects/healios"
                className="min-h-[44px] inline-flex items-center gap-2 text-[var(--mat-body)] hover:text-[var(--mat-ink)] transition-colors"
              >
                <span className="border-b border-current pb-0.5">Grad-CAM saliency in Healios V2</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </ThemeSection>
  );
};

export default AboutSection;
