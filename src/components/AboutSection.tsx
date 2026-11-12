import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ThemeSection, Reveal } from './ThemeSection';
import { useMotionPreference } from './MotionPreference';
import { profile } from '../content/profile';
import { experiences } from '../content/experience';
import { getEvidence } from '../content/evidence';

const MotionDiv = motion.div;

const CHAMFER = 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)';

const research = experiences.find((e) => e.id === 'osu-pathology-research');
const saliency = getEvidence('healios-xai-saliency');
const aws = getEvidence('cas-aws-scale');
const sim = getEvidence('apexis-60fps-sim');

const ANCHORS = [
  { value: saliency?.value ?? '8.09 ms', label: 'Grad-CAM saliency pipeline', source: 'Healios V2', href: '/projects/healios' },
  { value: aws?.value.replace(' Internal Use Cases', '') ?? '12', label: 'AWS use cases shipped', source: 'Chemical Abstracts Service', href: '/#experience' },
  { value: sim?.value ?? '60 fps', label: 'Off-main-thread race simulation', source: 'Apexis', href: '/projects/apexis' },
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

const PathologyFigure: React.FC = () => {
  const nuclei = useMemo(buildTile, []);
  return (
    <svg viewBox="0 0 360 320" className="w-full h-auto block" role="img" aria-label="Illustrative schematic of segmented cell nuclei under a saliency overlay">
      <defs>
        <radialGradient id="about-heat-a" cx="150" cy="120" r="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF2800" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#FF4419" stopOpacity="0.12" />
          <stop offset="1" stopColor="#FF2800" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="about-heat-b" cx="250" cy="230" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF2800" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FF2800" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="about-field" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B1E40" />
          <stop offset="1" stopColor="#03050A" />
        </linearGradient>
        <pattern id="about-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#C8D2E0" strokeOpacity="0.06" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="360" height="320" fill="url(#about-field)" />
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
            fill="#2563EB"
            fillOpacity={0.18 + n.heat * 0.3}
            stroke="#C8D2E0"
            strokeOpacity={0.35}
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
      <rect x="0.5" y="0.5" width="359" height="319" fill="none" stroke="#C8D2E0" strokeOpacity="0.18" />
    </svg>
  );
};

export const AboutSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();

  // Spring-damped ±4deg portrait tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 160, damping: 20, mass: 0.6 });
  const rotateY = useSpring(mouseX, { stiffness: 160, damping: 20, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isReduced) return;
    const rect = cardRef.current.getBoundingClientRect();
    const ox = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const oy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    mouseX.set(ox * 4);
    mouseY.set(-oy * 4);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
      className="border-b border-[#18458B]/20 py-24 lg:py-36"
    >
      <div className="w-full flex flex-col">
        {/* 40 / 60 spread */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20 items-center">
          <Reveal className="relative">
            <MotionDiv
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px] mx-auto lg:mx-0 select-none group"
            >
              <div className="relative aspect-[4/5]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-2 translate-y-2 border border-[#FF2800]/40 pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:translate-y-3"
                  style={{ clipPath: CHAMFER }}
                />
                <div
                  className="relative w-full h-full bg-[#060A12] overflow-hidden shadow-[0_24px_60px_rgba(3,5,10,0.85)]"
                  style={{ clipPath: CHAMFER }}
                >
                  <Image
                    src="/profile.jpeg"
                    alt={`Portrait of ${profile.name}`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 460px"
                    className="object-cover object-top grayscale contrast-[1.08] group-hover:grayscale-0 group-hover:scale-[1.03] transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-tr from-[#0B1E40]/40 via-transparent to-transparent pointer-events-none"
                  />
                </div>
              </div>
              <p className="mt-5 font-mono text-[11px] leading-relaxed text-[#7E8B9B]">
                <span className="text-[#F4F6F9]">{profile.name}</span> · {profile.education.location} ·{' '}
                {profile.education.degree}, {profile.education.university}
              </p>
            </MotionDiv>
          </Reveal>

          <Reveal delay={0.08} className="max-w-[640px]">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F6F9] leading-[1.06] tracking-[-0.02em]">
              I build software where <span className="italic text-[#FF2800]">computational speed</span> meets
              real-world physical and human systems.
            </h2>
            <p className="mt-8 max-w-[60ch] text-base sm:text-lg font-sans text-[#C8D2E0]/85 leading-relaxed">
              My work sits between deterministic data pipelines, explainable deep learning and low-latency client
              architecture: the pieces that keep clinicians, analysts and operators in control of what the
              software is doing.
            </p>
            <p className="mt-5 max-w-[60ch] text-base font-sans text-[#7E8B9B] leading-relaxed">
              {profile.education.degree} at {profile.education.university}, expected {profile.education.expectedGraduation}.
              Seeking {profile.availability.targetSeason} {profile.availability.seeking.toLowerCase()}.
            </p>

            <ul className="mt-10 border-t border-[#C8D2E0]/10">
              {ANCHORS.map((a) => (
                <li key={a.label} className="border-b border-[#C8D2E0]/10">
                  <a
                    href={a.href}
                    onClick={a.href.startsWith('/#') ? scrollToAnchor(a.href.slice(2)) : undefined}
                    className="group grid grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[8rem_1fr_auto] items-baseline gap-4 py-4 min-h-[44px]"
                  >
                    <span className="font-serif text-2xl sm:text-3xl text-[#F4F6F9] tracking-tight tabular-nums">{a.value}</span>
                    <span className="font-sans text-sm text-[#C8D2E0] leading-snug">
                      {a.label} <span className="text-[#7E8B9B]">· {a.source}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs text-[#7E8B9B] group-hover:text-[#FF2800] group-hover:translate-x-1 transition-[color,transform] duration-300"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 font-mono text-xs">
              <a
                href="#experience"
                onClick={scrollToAnchor('experience')}
                className="px-6 py-3.5 min-h-[44px] bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] font-semibold rounded-[2px] transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Follow the experience</span>
                <span aria-hidden="true">↓</span>
              </a>
              <Link
                href="/about"
                className="min-h-[44px] inline-flex items-center justify-center sm:justify-start gap-2 text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors"
              >
                <span className="border-b border-current pb-0.5">Full profile</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Standalone research artifact plate: 112px below the spread */}
        <Reveal className="mt-28 pt-12 border-t border-[#C8D2E0]/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <figure className="lg:col-span-5">
              <PathologyFigure />
              <figcaption className="mt-3 font-mono text-[11px] text-[#7E8B9B] leading-relaxed">
                Fig. 01 · Illustrative schematic of nucleus segmentation under a saliency overlay. Not patient data.
              </figcaption>
            </figure>

            <div className="lg:col-span-7">
              <p className="font-mono text-xs text-[#FF2800]">
                {research?.company ?? 'The Ohio State University'} · {research?.period ?? 'Summer 2026 – Present'}
              </p>
              <h3 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F4F6F9] leading-[1.08] tracking-[-0.01em]">
                Digital pathology, made explainable.
              </h3>
              <p className="mt-4 font-sans text-sm text-[#7E8B9B]">
                {research?.role ?? 'Undergraduate AI/ML Researcher'} · {research?.teamOrDivision ?? 'Digital Pathology AI/ML Research'}
              </p>

              <ol className="mt-8 border-t border-[#C8D2E0]/10">
                {(research?.bullets ?? []).map((b, i) => (
                  <li key={i} className="grid grid-cols-[2rem_1fr] gap-3 py-4 border-b border-[#C8D2E0]/10">
                    <span className="font-mono text-[11px] text-[#2563EB] pt-1 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="max-w-[62ch] font-sans text-sm sm:text-base text-[#C8D2E0]/85 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 font-mono text-xs text-[#7E8B9B] leading-relaxed">
                {(research?.skillsDemonstrated ?? []).slice(0, 5).join(' · ')}
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs">
                <Link
                  href="/projects/cv-allergy-wheal"
                  className="min-h-[44px] inline-flex items-center gap-2 text-[#FF2800] hover:text-[#F4F6F9] transition-colors"
                >
                  <span className="border-b border-current pb-0.5">Related: wheal quantification pipeline</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/projects/healios"
                  className="min-h-[44px] inline-flex items-center gap-2 text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors"
                >
                  <span className="border-b border-current pb-0.5">Grad-CAM saliency in Healios V2</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </ThemeSection>
  );
};

export default AboutSection;
