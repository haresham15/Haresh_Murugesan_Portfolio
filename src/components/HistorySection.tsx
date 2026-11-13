import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ThemeSection, Reveal } from './ThemeSection';
import { useMotionPreference } from './MotionPreference';

interface Milestone {
  id: string;
  year: string;
  phase: string;
  title: string;
  reflection: string;
  detail: string[];
  link: { href: string; label: string };
}

/** Facts and years follow src/content (experience.ts, projects.ts, evidence.ts). */
const MILESTONES: Milestone[] = [
  {
    id: 'm-2023',
    year: '2023',
    phase: 'Origin',
    title: 'A podcast as a way of asking better questions',
    reflection:
      'Started the show that became Syntinuum (formerly Adapt: Implementing Innovations) to ask founders, researchers and executives how ideas survive contact with production.',
    detail: ['Long-form technical dialogues', '100K+ combined impressions'],
    link: { href: '#podcast', label: 'Listen to Syntinuum' },
  },
  {
    id: 'm-2024',
    year: '2024',
    phase: 'Systems Thinking',
    title: 'Contracts, invariants and data structures',
    reflection:
      'Ohio State’s Software 1 and 2 sequence: Java object-oriented design under formal contracts, then custom collections, memory management and recursive tree invariants verified with JUnit.',
    detail: ['Java', 'JUnit', 'Formal contracts'],
    link: { href: '/projects/software-2-projects', label: 'Software 2 projects' },
  },
  {
    id: 'm-2025',
    year: '2025',
    phase: 'Applied Modeling',
    title: 'Models that had to hold up under judging',
    reflection:
      'Won Best Use of External Data at ASA DataFest 2025, a 48-hour hackathon against 40+ collegiate teams. Built Philocracy’s recursive argument trees and implemented classical AI algorithms from first principles for CS50 AI.',
    detail: ['ASA DataFest 2025', 'Philocracy', 'CS50 AI'],
    link: { href: '#achievements', label: 'See the recognition' },
  },
  {
    id: 'm-2026',
    year: '2026',
    phase: 'High-Performance Engineering',
    title: 'Latency budgets, worker threads and clinical vision',
    reflection:
      'Shipped the Grad-CAM saliency pipeline in Healios V2 and the off-main-thread race simulation in Apexis. Won DataFest again with RouteRx, joined Honda 99P Labs as an Innovation Analyst, and interned at CAS on serverless AWS.',
    detail: ['Healios V2', 'Apexis', 'RouteRx', 'CAS', 'Honda 99P Labs'],
    link: { href: '#projects', label: 'Explore the projects' },
  },
];

export const HistorySection: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const nodeFractions = useRef<number[]>([]);
  const [litCount, setLitCount] = useState(0);
  const { isReduced } = useMotionPreference();

  // Progress reaches the tip of the line exactly at 60% of the viewport height.
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.6', 'end 0.6'] });
  const drawn = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4, restDelta: 0.0005 });
  const beadTop = useTransform(drawn, (p) => `${Math.min(1, Math.max(0, p)) * 100}%`);

  // Node positions are measured, never hardcoded, so they stay aligned on resize.
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      if (box.height <= 0) return;
      nodeFractions.current = nodeRefs.current.map((n) => {
        if (!n) return 1;
        const r = n.getBoundingClientRect();
        return (r.top + r.height / 2 - box.top) / box.height;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const update = (p: number) => {
      const count = nodeFractions.current.filter((f) => p >= f - 0.002).length;
      setLitCount((c) => (c === count ? c : count));
    };
    update(isReduced ? 1 : drawn.get());
    if (isReduced) return;
    return drawn.on('change', update);
  }, [drawn, isReduced]);

  return (
    <ThemeSection
      id="history"
      theme="obsidian"
      aria-label="Milestones"
      className="border-b border-[#18458B]/20 py-24 lg:py-36"
    >
      <div className="w-full flex flex-col">
        <Reveal className="pb-12 sm:pb-16 border-b border-[#C8D2E0]/10">
          <h2 className="text-[length:var(--display-size)] font-serif font-normal text-[#F4F6F9] leading-[0.95] tracking-[-0.02em]">
            Milestones
          </h2>
          <p className="mt-6 max-w-[58ch] text-base sm:text-lg font-sans text-[#C8D2E0]/85 leading-relaxed">
            Four years, each with a different question: how to ask, how to structure, how to model, and how to make
            it fast.
          </p>
        </Reveal>

        <div ref={timelineRef} className="relative mt-16 sm:mt-20">
          {/* Datum line: faint track, scroll-drawn stroke, travelling bead */}
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] lg:left-1/2 w-px -translate-x-1/2 pointer-events-none">
            <div className="absolute inset-0 bg-[#C8D2E0]/10" />
            <motion.div
              className="absolute inset-0 origin-top bg-gradient-to-b from-[#FF2800] via-[#C8D2E0] to-[#2563EB]"
              style={{ scaleY: isReduced ? 1 : drawn }}
            />
            {!isReduced && (
              <motion.span
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-[#F4F6F9] shadow-[0_0_0_3px_rgba(255,40,0,0.35),0_0_18px_rgba(255,40,0,0.6)]"
                style={{ top: beadTop }}
              />
            )}
          </div>

          <ol className="relative">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              const lit = i < litCount;
              return (
                <li
                  key={m.id}
                  id={m.id}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 lg:gap-32 ${i > 0 ? 'mt-20 sm:mt-24 lg:-mt-16' : ''}`}
                >
                  {/* Node sits on the datum, aligned to the numeral */}
                  <span
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="absolute top-[30px] left-[7px] lg:left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15px] h-[15px] rounded-full border bg-[#03050A] transition-[border-color,box-shadow] duration-500"
                    style={{
                      borderColor: lit ? '#FF2800' : 'rgba(200,210,224,0.35)',
                      boxShadow: lit ? '0 0 0 4px rgba(255,40,0,0.12)' : 'none',
                    }}
                  >
                    <motion.span
                      className="absolute inset-[4px] rounded-full bg-[#FF2800]"
                      initial={false}
                      animate={{ scale: lit ? 1 : 0 }}
                      transition={isReduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 22 }}
                    />
                  </span>

                  <Reveal
                    y={isReduced ? 0 : 32}
                    className={`pl-10 lg:pl-0 ${isLeft ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-2'}`}
                  >
                    <article className={`max-w-[34rem] ${isLeft ? 'lg:ml-auto' : ''}`}>
                      <div className={`flex items-baseline gap-4 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
                        <span
                          className="font-serif text-[64px] leading-none tracking-[-0.03em] tabular-nums transition-colors duration-500"
                          style={{ color: lit ? '#F4F6F9' : '#7E8B9B' }}
                        >
                          {m.year}
                        </span>
                        <span className="font-mono text-xs text-[#FF2800]">{m.phase}</span>
                      </div>
                      <h3 className="mt-6 font-serif text-2xl sm:text-3xl text-[#F4F6F9] leading-snug tracking-[-0.01em]">
                        {m.title}
                      </h3>
                      <p className="mt-4 font-sans text-sm sm:text-base text-[#C8D2E0]/80 leading-relaxed">{m.reflection}</p>
                      <p className="mt-5 font-mono text-xs text-[#7E8B9B] leading-relaxed">{m.detail.join(' · ')}</p>
                      <Link
                        href={m.link.href}
                        className="mt-3 min-h-[44px] inline-flex items-center gap-2 font-mono text-xs text-[#FF2800] hover:text-[#F4F6F9] transition-colors"
                      >
                        <span className="border-b border-current pb-0.5">{m.link.label}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </ThemeSection>
  );
};

export default HistorySection;

