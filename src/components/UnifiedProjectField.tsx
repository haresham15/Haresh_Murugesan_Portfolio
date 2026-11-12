import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { archiveProjects, flagshipProjects, getProjectBySlug } from '../content/projects';
import { useMotionPreference } from './MotionPreference';
import { PlateStage } from './plates/PlateStage';
import { healiosPlate } from './plates/PlateHealios';
import { apexisPlate } from './plates/PlateApexis';
import { routeRxPlate } from './plates/PlateRouteRx';
import { tempoPlate } from './plates/PlateTempo';
import type { PlateDefinition } from './plates/stageKit';

interface Benchmark { value: string; label: string }
interface FlagshipSystem {
  key: string;
  index: string;
  slug: string;
  title: string;
  domain: string;
  thesis: string;
  narrative: string;
  bench: [Benchmark, Benchmark];
  stack: string;
  plate: PlateDefinition;
}

/* Copy and figures are drawn from src/content/projects.ts and evidence.ts. */
const SYSTEMS: FlagshipSystem[] = [
  {
    key: 'healios',
    index: '01',
    slug: 'healios',
    title: 'Healios V2',
    domain: 'Clinical computer vision · explainable AI',
    thesis: 'Wound monitoring that shows surgeons the reasoning, not just a score.',
    narrative:
      'The patient app runs a Laplacian blur check in the browser in under 35 ms, so unusable photos never upload. On the FastAPI side, tissue beds are segmented in 2.00 ms and a Grad-CAM overlay renders in 8.09 ms with vectorized NumPy, so surgeons see what drove each classification.',
    bench: [
      { value: '8.09 ms', label: 'Grad-CAM saliency' },
      { value: '2.00 ms', label: 'HSV tissue segmentation' },
    ],
    stack: 'Next.js · TypeScript · Python 3.11 · FastAPI · TensorFlow/Keras · OpenCV',
    plate: healiosPlate,
  },
  {
    key: 'apexis',
    index: '02',
    slug: 'apexis',
    title: 'Apexis',
    domain: 'Motorsport telemetry · web workers',
    thesis: 'Multi-series race telemetry in one tab, with the heavy math off the main thread.',
    narrative:
      'A dedicated simulator worker computes 2D car positions against OpenF1 track coordinates at 60 fps, and a Tesseract.js worker reads broadcast timing graphics in the browser. An embedded SQLite database answers historical queries back to 1950 in under 12 ms.',
    bench: [
      { value: '60 fps', label: 'Worker sim · 16.7 ms frame' },
      { value: '< 12 ms', label: 'Indexed SQLite lookup' },
    ],
    stack: 'Next.js 14 · React · TypeScript · TensorFlow.js · Tesseract.js · SQLite',
    plate: apexisPlate,
  },
  {
    key: 'routerx',
    index: '03',
    slug: 'routerx-careline',
    title: 'RouteRx (Careline)',
    domain: 'Spatial logistics · healthcare access',
    thesis: 'One shuttle fleet that handles both patient pickups and discharge returns.',
    narrative:
      'Built for Stormont Vail Health in Topeka, KS. Census, OpenStreetMap and GTFS data feed a Transit Vulnerability Index; 43 of 141 census blocks had no bus stop within 800 m. DBSCAN finds pickup clusters and OSRM routes a single fleet in both directions.',
    bench: [
      { value: '1st Place', label: 'ASA DataFest 2026' },
      { value: '43 of 141', label: 'Blocks with no stop in 800 m' },
    ],
    stack: 'RStudio · Python · Tigercensus · OpenStreetMap · GTFS · OSRM · React',
    plate: routeRxPlate,
  },
  {
    key: 'tempo',
    index: '04',
    slug: 'tempo',
    title: 'Tempo',
    domain: 'Communication safety · state machines',
    thesis: 'A zero-destination buffer for drafting through rejection-sensitive moments.',
    narrative:
      'There is no send button by design, so drafts stay in the sandbox. A deterministic regex gate runs in 0.20 ms before any model call, pgvector recall surfaces how similar moments were resolved, and DeepSeek V3 fails over to Gemini on a timeout or a broken schema.',
    bench: [
      { value: '100% (5/5)', label: 'Crisis recall' },
      { value: '0.20 ms', label: 'Safety gate latency' },
    ],
    stack: 'Next.js 15 · React 19 · TypeScript · PostgreSQL (pgvector) · Supabase',
    plate: tempoPlate,
  },
];

const SPRING = { type: 'spring' as const, stiffness: 210, damping: 30, mass: 0.9 };
const FOCUS_RING = 'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#FF2800] focus-visible:-outline-offset-1';

export const UnifiedProjectField: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [active, setActive] = useState(0);
  const [modes, setModes] = useState<Record<string, string>>(() =>
    Object.fromEntries(SYSTEMS.map((s) => [s.key, s.plate.modes[0].id])),
  );
  const headRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const actionRef = useRef<((id: string) => void) | null>(null);

  const system = SYSTEMS[active];
  const modeId = modes[system.key];
  const actions = (system.plate.actions ?? []).filter((a) => !a.modes || a.modes.includes(modeId));
  const transition = isReduced ? { duration: 0 } : SPRING;

  const select = useCallback((i: number, focus = false) => {
    const n = SYSTEMS.length;
    const next = ((i % n) + n) % n;
    setActive(next);
    if (focus) headRefs.current[next]?.focus();
  }, []);

  const onRailKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = headRefs.current.findIndex((el) => el === e.target);
    if (idx < 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); select(idx + 1, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(idx - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    else if (e.key === 'End') { e.preventDefault(); select(SYSTEMS.length - 1, true); }
  };

  const setMode = (id: string) => setModes((m) => ({ ...m, [system.key]: id }));
  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = system.plate.modes;
    const idx = list.findIndex((m) => m.id === modeId);
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % list.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + list.length) % list.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setMode(list[next].id);
    tabRefs.current[next]?.focus();
  };

  const repoCount = flagshipProjects.length + archiveProjects.length;

  return (
    <section id="projects" className="relative w-full bg-transparent" aria-labelledby="flagship-heading">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-[#C8D2E0]/12 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-3">
            <h2 id="flagship-heading" className="font-serif text-4xl leading-tight tracking-tight text-[#F4F6F9] sm:text-5xl lg:text-6xl">
              Selected Works.
            </h2>
            <p className="font-sans text-base leading-relaxed text-[#7E8B9B] lg:text-lg">
              Four flagship systems across clinical computer vision, motorsport telemetry, spatial logistics and
              safety-first state machines. Each view on the right is live and follows your cursor.
            </p>
          </div>
          <Link
            href="/#archive"
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[13px] text-[#FF2800] transition-colors hover:text-[#F4F6F9] ${FOCUS_RING}`}
          >
            <span>Explore the archive</span>
            <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Accordion rail */}
          <div className="lg:col-span-5" onKeyDown={onRailKey}>
            <p className="sr-only">Use the up and down arrow keys to move between systems.</p>
            {SYSTEMS.map((s, i) => {
              const open = i === active;
              const headId = `flagship-head-${s.key}`;
              const drawerId = `flagship-drawer-${s.key}`;
              const p = getProjectBySlug(s.slug);
              return (
                <div key={s.key} className="border-b border-[#C8D2E0]/12 first:border-t">
                  <h3 className="m-0">
                    <button
                      ref={(el) => { headRefs.current[i] = el; }}
                      id={headId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={drawerId}
                      onClick={() => select(i)}
                      className={`group relative flex h-[54px] w-full items-center gap-4 text-left ${FOCUS_RING}`}
                    >
                      <span className={`w-6 shrink-0 font-mono text-[12px] tabular-nums transition-colors duration-300 ${open ? 'text-[#FF2800]' : 'text-[#7E8B9B] group-hover:text-[#C8D2E0]'}`}>
                        {s.index}
                      </span>
                      <span className="relative h-full min-w-0 flex-1">
                        <motion.span
                          aria-hidden={open}
                          initial={false}
                          animate={{ opacity: open ? 0 : 1, y: open ? -10 : 0 }}
                          transition={transition}
                          className="absolute inset-0 flex items-center gap-3"
                        >
                          <span className="truncate font-serif text-[17px] text-[#F4F6F9]">{s.title}</span>
                          <span className="ml-auto hidden shrink-0 font-mono text-[12px] text-[#7E8B9B] sm:inline">{s.bench[0].value}</span>
                        </motion.span>
                        <motion.span
                          aria-hidden={!open}
                          initial={false}
                          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
                          transition={transition}
                          className="absolute inset-0 flex items-center truncate font-mono text-[12px] text-[#C8D2E0]"
                        >
                          {s.domain}
                        </motion.span>
                      </span>
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={transition}
                        className="flex h-11 w-11 shrink-0 items-center justify-center font-mono text-lg text-[#FF2800]"
                      >
                        +
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="drawer"
                        id={drawerId}
                        role="region"
                        aria-labelledby={headId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={isReduced ? { duration: 0 } : { height: SPRING, opacity: { duration: 0.25 } }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col pb-5 pl-10 lg:h-[406px]">
                          <p className="font-serif text-[34px] leading-[1.1] tracking-tight text-[#F4F6F9]">{s.title}</p>
                          <p className="mt-2 font-serif text-[16.5px] italic leading-snug text-[#C8D2E0]">{s.thesis}</p>
                          <p className="mt-3 font-sans text-[14.5px] leading-[1.65] text-[#7E8B9B] lg:line-clamp-4 xl:line-clamp-none">
                            {s.narrative}
                          </p>
                          <dl className="my-3 grid grid-cols-2 gap-4 border-y border-[#C8D2E0]/12 py-3">
                            {s.bench.map((b) => (
                              <div key={b.label} className="min-w-0">
                                <dt className="sr-only">{b.label}</dt>
                                <dd className="font-mono text-[20px] leading-tight text-[#F4F6F9]">{b.value}</dd>
                                <dd className="mt-1 font-mono text-[11px] leading-snug text-[#7E8B9B]">{b.label}</dd>
                              </div>
                            ))}
                          </dl>
                          <p className="font-mono text-[11.5px] leading-relaxed text-[#C8D2E0]/80">{s.stack}</p>
                          <div className="mt-auto flex flex-wrap items-center gap-x-6 pt-3 font-mono text-[13px]">
                            <Link
                              href={`/projects/${s.slug}`}
                              className={`inline-flex min-h-11 items-center gap-2 text-[#FF2800] transition-colors hover:text-[#FF4419] ${FOCUS_RING}`}
                            >
                              Read Case Study <span aria-hidden="true">→</span>
                            </Link>
                            {p?.github && (
                              <a
                                href={p.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex min-h-11 items-center gap-2 text-[#C8D2E0] transition-colors hover:text-[#F4F6F9] ${FOCUS_RING}`}
                              >
                                Source Code <span aria-hidden="true">↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Stage: mode bar, canvas, telemetry strip */}
          <div className="flex h-[500px] min-w-0 flex-col sm:h-[560px] lg:col-span-7 lg:h-[622px]">
            <div className="flex h-11 shrink-0 items-stretch border-b border-[#C8D2E0]/12 lg:h-10">
              <button
                type="button"
                onClick={() => select(active - 1)}
                aria-label="Previous system"
                className={`flex w-11 shrink-0 items-center justify-center font-mono text-[#C8D2E0] transition-colors hover:text-[#FF2800] lg:w-10 ${FOCUS_RING}`}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => select(active + 1)}
                aria-label="Next system"
                className={`flex w-11 shrink-0 items-center justify-center font-mono text-[#C8D2E0] transition-colors hover:text-[#FF2800] lg:w-10 ${FOCUS_RING}`}
              >
                →
              </button>
              <span className="hidden items-center pl-2 pr-3 font-mono text-[12px] tabular-nums text-[#7E8B9B] sm:flex">
                {system.index} / 0{SYSTEMS.length}
              </span>
              <div
                role="tablist"
                aria-label={`${system.title} views`}
                onKeyDown={onTabKey}
                className="flex min-w-0 items-stretch overflow-x-auto"
                style={{ scrollbarWidth: 'none' }}
              >
                {system.plate.modes.map((m, i) => {
                  const selected = m.id === modeId;
                  return (
                    <button
                      key={`${system.key}-${m.id}`}
                      ref={(el) => { tabRefs.current[i] = el; }}
                      id={`flagship-tab-${system.key}-${m.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="flagship-stage"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setMode(m.id)}
                      className={`relative flex shrink-0 items-center whitespace-nowrap px-3 font-mono text-[12px] transition-colors ${selected ? 'text-[#F4F6F9]' : 'text-[#7E8B9B] hover:text-[#C8D2E0]'} ${FOCUS_RING}`}
                    >
                      {m.label}
                      {selected && (
                        <motion.span
                          layoutId="flagship-tab-rule"
                          transition={transition}
                          className="absolute inset-x-3 bottom-0 h-px bg-[#FF2800]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {actions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => actionRef.current?.(a.id)}
                  className={`ml-auto flex shrink-0 items-center whitespace-nowrap px-3 font-mono text-[12px] text-[#FF2800] transition-colors hover:text-[#F4F6F9] ${FOCUS_RING}`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <PlateStage
              definition={system.plate}
              systemKey={system.key}
              modeId={modeId}
              reduced={isReduced}
              panelId="flagship-stage"
              labelledBy={`flagship-tab-${system.key}-${modeId}`}
              coordsRef={coordsRef}
              readoutRef={readoutRef}
              actionRef={actionRef}
            />

            <div className="flex h-8 shrink-0 items-center gap-4 overflow-hidden border-t border-[#C8D2E0]/12 font-mono text-[11px] tabular-nums text-[#7E8B9B]">
              <span ref={coordsRef} className="hidden w-[132px] shrink-0 sm:inline">cursor idle</span>
              <span ref={readoutRef} className="min-w-0 flex-1 truncate text-[#C8D2E0]" />
              <span className="hidden shrink-0 text-[#F4F6F9] md:inline">
                {system.bench[0].value} <span className="text-[#7E8B9B]">{system.bench[0].label}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-[#C8D2E0]/12 pt-8 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h4 className="font-serif text-xl text-[#F4F6F9]">The rest of the work</h4>
            <p className="font-mono text-[12px] text-[#7E8B9B]">
              {repoCount} repositories, mapped by stack and domain in the archive below.
            </p>
          </div>
          <Link
            href="/#archive"
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 font-mono text-[13px] text-[#FF2800] transition-colors hover:text-[#F4F6F9] ${FOCUS_RING}`}
          >
            <span>Open the archive</span>
            <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UnifiedProjectField;
