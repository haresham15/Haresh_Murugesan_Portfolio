import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCanvasStage, type CanvasStage } from '../hooks/useCanvasStage';
import { useMotionPreference } from './MotionPreference';
import { ThemeSection, Reveal } from './ThemeSection';
import { podcastGuests } from '../content/experience';

const PODCAST_LINKS = {
  site: 'https://www.syntinuumpodcast.com/',
  youtube: 'https://www.youtube.com/@syntinuum',
  spotify: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
};

/** Episode notes already published on this section, keyed by guest name. */
const EPISODE_NOTES: Record<string, { focus: string; runtime: string }> = {
  'Dhaval Patel': {
    focus: 'Democratizing data science, machine learning education, and scalable curriculum architecture.',
    runtime: '58 min',
  },
  'Steve Wang': {
    focus: 'Hardware scaling, deep-tech venture development, and semiconductor / AI infrastructure.',
    runtime: '49 min',
  },
  'Paul Shapiro': {
    focus: 'Bioreactor fermentation economics, food-tech scaling dilemmas, and industrial microbiology.',
    runtime: '46 min',
  },
  'Andrea Jacobs': {
    focus: 'Algorithmic accountability, AI governance frameworks, and civil liberties in machine learning.',
    runtime: '52 min',
  },
  'Adam Geller': {
    focus: 'Video-based AI coaching pipelines, classroom NLP analysis, and educational venture engineering.',
    runtime: '44 min',
  },
};

interface FeaturedGuest {
  name: string;
  role: string;
  company: string;
  topic: string;
  runtime: string;
  topics: string[];
}

const splitFocus = (focus: string) =>
  focus
    .replace(/\.$/, '')
    .split(/,\s*(?:and\s+)?/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));

const FEATURED: FeaturedGuest[] = podcastGuests
  .filter((g) => EPISODE_NOTES[g.name])
  .map((g) => ({
    name: g.name,
    role: g.role,
    company: g.company,
    topic: g.topic ?? '',
    runtime: EPISODE_NOTES[g.name].runtime,
    topics: splitFocus(EPISODE_NOTES[g.name].focus),
  }));

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* ---------------------------------------------------------------------------
   Waveform model: one spring-damped amplitude per band column.
   Each guest owns a spectral signature (two carrier frequencies + phase), so
   switching guests re-shapes the envelope and the springs carry the morph.
--------------------------------------------------------------------------- */
const BAND_STEP = 6; // CSS px between band columns
const SPRING_K = 170; // stiffness
const SPRING_ZETA = 0.52; // damping ratio (slightly under-damped: a single soft overshoot)
const SPRING_C = 2 * Math.sqrt(SPRING_K) * SPRING_ZETA;

const signature = (g: number) => ({
  f1: 1.3 + ((g * 0.618) % 1) * 1.6,
  f2: 3.1 + ((g * 0.382) % 1) * 2.4,
  phase: g * 1.7,
});

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export const PodcastSection: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const sim = useRef({
    amp: new Float32Array(0),
    vel: new Float32Array(0),
    pointerX: -1, // CSS px within the stage, -1 when absent
    cursorU: 0.5, // spring-smoothed cursor position (0..1)
    presence: 0, // eased 0..1 cursor influence
    impulse: 0, // energy injected on guest change
    guest: 0,
  });

  const shownIndex = hoverIndex ?? activeIndex;

  useEffect(() => {
    sim.current.guest = shownIndex;
    sim.current.impulse = 1;
  }, [shownIndex]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, { width, height, time, deltaTime }: CanvasStage) => {
      const s = sim.current;
      const n = Math.max(8, Math.floor(width / BAND_STEP));
      if (s.amp.length !== n) {
        s.amp = new Float32Array(n);
        s.vel = new Float32Array(n);
      }
      const t = isReduced ? 0 : time / 1000;
      const dt = Math.min(deltaTime / 1000, 1 / 30);

      // Cursor easing (frame-rate independent exponential smoothing)
      const hasPointer = s.pointerX >= 0 && !isReduced;
      const targetU = hasPointer ? s.pointerX / width : s.cursorU;
      const follow = 1 - Math.exp(-dt * 14);
      s.cursorU += (targetU - s.cursorU) * follow;
      s.presence += ((hasPointer ? 1 : 0) - s.presence) * (1 - Math.exp(-dt * 6));
      s.impulse *= Math.exp(-dt * 2.4);

      const { f1, f2, phase } = signature(s.guest);
      const sigma = 0.055;
      const cy = height / 2;
      const maxH = height * 0.44;

      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n;
        const taper = Math.pow(Math.sin(Math.PI * u), 0.55);
        const carrier =
          (0.5 + 0.5 * Math.sin(2 * Math.PI * u * f1 + t * 0.85 + phase)) *
          (0.55 + 0.45 * Math.sin(2 * Math.PI * u * f2 - t * 1.25 + phase * 0.5));
        const grain = 0.5 + 0.5 * Math.sin(2 * Math.PI * u * 41 + t * 3.3) * Math.sin(2 * Math.PI * u * 13 - t * 1.9);
        const du = u - s.cursorU;
        const bump = Math.exp(-(du * du) / (2 * sigma * sigma)) * s.presence;
        let target = 0.08 + 0.52 * carrier + 0.16 * grain;
        target += bump * (0.55 + 0.25 * Math.sin(t * 9 + i * 0.7));
        target += s.impulse * 0.35 * Math.sin(Math.PI * u) * (0.5 + 0.5 * Math.sin(i * 0.9 + t * 6));
        target *= taper;

        if (isReduced || dt === 0) {
          if (isReduced || s.amp[i] === 0) s.amp[i] = target;
        } else {
          // Semi-implicit Euler damped spring
          const acc = SPRING_K * (target - s.amp[i]) - SPRING_C * s.vel[i];
          s.vel[i] += acc * dt;
          s.amp[i] += s.vel[i] * dt;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Datum line
      ctx.fillStyle = 'rgba(200, 210, 224, 0.12)';
      ctx.fillRect(0, Math.round(cy) - 0.5, width, 1);

      const step = width / n;

      // LOW BAND (cobalt): neighbour-averaged envelope, filled & mirrored
      const low = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        let acc = 0;
        let w = 0;
        for (let k = -4; k <= 4; k++) {
          const j = i + k;
          if (j < 0 || j >= n) continue;
          const wk = 5 - Math.abs(k);
          acc += s.amp[j] * wk;
          w += wk;
        }
        low[i] = (acc / w) * 1.18;
      }
      const lowGrad = ctx.createLinearGradient(0, cy - maxH, 0, cy + maxH);
      lowGrad.addColorStop(0, 'rgba(37, 99, 235, 0)');
      lowGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.22)');
      lowGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.beginPath();
      ctx.moveTo(0, cy);
      for (let i = 0; i < n; i++) ctx.lineTo((i + 0.5) * step, cy - low[i] * maxH);
      ctx.lineTo(width, cy);
      for (let i = n - 1; i >= 0; i--) ctx.lineTo((i + 0.5) * step, cy + low[i] * maxH);
      ctx.closePath();
      ctx.fillStyle = lowGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.75)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * step;
        const y = cy - low[i] * maxH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // MID BAND (red-orange): mirrored bars, brighter near the cursor
      const barW = Math.max(1.5, step * 0.38);
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * step - barW / 2;
        const h = Math.max(1, s.amp[i] * maxH * 0.92);
        const du = (i + 0.5) / n - s.cursorU;
        const near = Math.exp(-(du * du) / (2 * 0.08 * 0.08)) * s.presence;
        const alpha = 0.42 + 0.58 * Math.max(near, smoothstep(0.25, 0.75, s.amp[i]));
        ctx.fillStyle = `rgba(255, 40, 0, ${alpha.toFixed(3)})`;
        ctx.fillRect(x, cy - h, barW, h * 2);
      }

      // HIGH BAND (silver): fine harmonic filament riding the envelope
      ctx.strokeStyle = 'rgba(200, 210, 224, 0.55)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n;
        const x = (i + 0.5) * step;
        const y = cy + Math.sin(2 * Math.PI * u * 29 + t * 4.2 + phase) * s.amp[i] * maxH * 0.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Cursor scan line
      if (s.presence > 0.02) {
        const cx = s.cursorU * width;
        const g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, 'rgba(244, 246, 249, 0)');
        g.addColorStop(0.5, `rgba(244, 246, 249, ${(0.45 * s.presence).toFixed(3)})`);
        g.addColorStop(1, 'rgba(244, 246, 249, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(Math.round(cx) - 0.5, 0, 1, height);
      }
    },
    [isReduced],
  );

  useCanvasStage(stageRef, canvasRef, draw, { animate: !isReduced });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    sim.current.pointerX = e.clientX - rect.left;
  };
  const handlePointerLeave = () => {
    sim.current.pointerX = -1;
  };

  const select = (i: number) => {
    setActiveIndex(i);
    setHoverIndex(null);
  };

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % FEATURED.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + FEATURED.length) % FEATURED.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = FEATURED.length - 1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
    tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const markerTransition = isReduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };

  return (
    <ThemeSection
      id="podcast"
      theme="obsidian"
      aria-label="Syntinuum podcast"
      className="border-b border-[#18458B]/20 py-24 lg:py-36"
    >
      <div className="w-full flex flex-col">
        {/* Masthead */}
        <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-12 sm:pb-16">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal text-[#F4F6F9] leading-[0.95] tracking-[-0.02em]">
              Syntinuum
              <span className="block italic text-[#C8D2E0] text-3xl sm:text-4xl lg:text-5xl mt-3 tracking-[-0.01em]">
                Endless Evolutions
              </span>
            </h2>
            <p className="max-w-[58ch] text-base sm:text-lg font-sans text-[#C8D2E0]/85 leading-relaxed">
              An engineering leadership podcast on system architecture, scaling dilemmas and technical tradeoffs,
              recorded with startup founders, researchers and executives. Formerly{' '}
              <em className="text-[#F4F6F9]">Adapt: Implementing Innovations</em>.
            </p>
          </div>
          <dl className="lg:col-span-5 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#C8D2E0]/10 pt-6 font-mono text-xs">
            <div>
              <dt className="text-[#7E8B9B]">Impressions</dt>
              <dd className="mt-1 font-serif text-3xl sm:text-4xl text-[#F4F6F9] tracking-tight">100K+</dd>
            </div>
            <div>
              <dt className="text-[#7E8B9B]">Guests on record</dt>
              <dd className="mt-1 font-serif text-3xl sm:text-4xl text-[#F4F6F9] tracking-tight">{podcastGuests.length}</dd>
            </div>
            <dd className="col-span-2 text-[#7E8B9B] leading-relaxed">
              Host &amp; producer, Season 3 · Spotify · Apple Podcasts · YouTube
            </dd>
          </dl>
        </Reveal>

        {/* Full-bleed waveform */}
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
          className="relative left-1/2 w-screen -translate-x-1/2 h-[200px] sm:h-[260px] lg:h-[300px] border-y border-[#C8D2E0]/[0.08] select-none touch-pan-y"
          aria-hidden="true"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>

        {/* Episode selector */}
        <div
          role="tablist"
          aria-label="Featured Syntinuum guests"
          className="relative flex lg:grid lg:grid-cols-5 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-[#C8D2E0]/10"
          onMouseLeave={() => setHoverIndex(null)}
        >
          {FEATURED.map((g, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={g.name}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`syntinuum-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`syntinuum-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => select(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onFocus={() => setHoverIndex(null)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className="relative shrink-0 w-[68%] sm:w-[40%] lg:w-auto snap-start text-left pt-6 pb-6 pr-6 cursor-pointer group outline-none focus-visible:bg-[#0B1E40]/40"
              >
                {isActive && (
                  <motion.span
                    layoutId="syntinuum-marker"
                    transition={markerTransition}
                    className="absolute -top-px left-0 right-6 h-[2px] bg-[#FF2800]"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`block font-mono text-[11px] transition-colors duration-300 ${
                    isActive ? 'text-[#FF2800]' : 'text-[#7E8B9B] group-hover:text-[#C8D2E0]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')} · {g.runtime}
                </span>
                <span
                  className={`mt-2 block font-serif text-xl sm:text-2xl leading-tight transition-colors duration-300 ${
                    isActive ? 'text-[#F4F6F9]' : 'text-[#C8D2E0]/70 group-hover:text-[#F4F6F9]'
                  }`}
                >
                  {g.name}
                </span>
                <span className="mt-1 block font-sans text-xs text-[#7E8B9B] leading-snug">{g.company}</span>
              </button>
            );
          })}
        </div>

        {/* Crossfading episode panels (stacked in one grid cell: no layout shift) */}
        <div className="grid pt-12 sm:pt-16">
          {FEATURED.map((g, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={g.name}
                role="tabpanel"
                id={`syntinuum-panel-${i}`}
                aria-labelledby={`syntinuum-tab-${i}`}
                aria-hidden={!isActive}
                style={{
                  gridArea: '1 / 1',
                  opacity: isActive ? 1 : 0,
                  transform: isActive || isReduced ? 'none' : 'translateY(10px)',
                  visibility: isActive ? 'visible' : 'hidden',
                  transition: isReduced
                    ? 'none'
                    : `opacity 520ms ${EASE_OUT}, transform 640ms ${EASE_OUT}, visibility 0s linear ${isActive ? '0s' : '520ms'}`,
                }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
              >
                <div className="lg:col-span-7">
                  <p className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F4F6F9] leading-[1.1] tracking-[-0.01em] max-w-[22ch]">
                    {g.topic}
                  </p>
                  <p className="mt-6 font-mono text-xs text-[#7E8B9B]">
                    <span className="text-[#F4F6F9]">{g.name}</span> · {g.role}, {g.company}
                  </p>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-8">
                  <ol className="divide-y divide-[#C8D2E0]/10 border-y border-[#C8D2E0]/10">
                    {g.topics.map((topic, k) => (
                      <li key={topic} className="flex items-baseline gap-4 py-3.5">
                        <span className="font-mono text-[11px] text-[#2563EB] tabular-nums">{String(k + 1).padStart(2, '0')}</span>
                        <span className="font-sans text-sm sm:text-base text-[#C8D2E0] leading-snug">{topic}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
                    <a
                      href={PODCAST_LINKS.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isActive ? 0 : -1}
                      className="min-h-[44px] inline-flex items-center gap-2 text-[#FF2800] hover:text-[#F4F6F9] transition-colors"
                    >
                      syntinuumpodcast.com <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      href={PODCAST_LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isActive ? 0 : -1}
                      className="min-h-[44px] inline-flex items-center gap-2 text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors"
                    >
                      YouTube <span aria-hidden="true">↗</span>
                    </a>
                    <a
                      href={PODCAST_LINKS.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isActive ? 0 : -1}
                      className="min-h-[44px] inline-flex items-center gap-2 text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors"
                    >
                      Spotify <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ThemeSection>
  );
};

export default PodcastSection;
