import React, { useCallback, useEffect, useRef, useState } from 'react';
import AsciiDnaLightbulbCanvas from '@/components/AsciiDnaLightbulbCanvas';
import { useMotionPreference } from '@/components/MotionPreference';
import { useCanvasStage, type CanvasStage } from '@/hooks/useCanvasStage';
import { podcastPillars, podcastReach, podcastSite, podcastSummary } from '@/content/podcast';
import {
  BOB_AMPLITUDE,
  BOB_HZ,
  BOTTOM_PAD,
  BULB_GAP_PX,
  BULB_PX,
  CROSSFADE_MS,
  DARK_PALETTE,
  LIGHT_PALETTE,
  TOP_PAD,
  breath,
  colorRamp,
  edgeAlpha,
  exitAmplitude,
  lit,
  parseColor,
  pocketMask,
  scrollBoost,
  settle,
  sigmaFor,
  slotCount,
  slotZone,
  springStep,
  tiltDeg,
  zoneAtFraction,
  zoneLayout,
  zonePeaks,
  type RGB,
  type WavePalette,
} from './model';

/** Bulb box top: 40px above the tallest bar, which reaches TOP_PAD. */
const BULB_TOP = TOP_PAD - BULB_GAP_PX - BULB_PX;
/** Baseline in CSS: TOP_PAD + (H - TOP_PAD - BOTTOM_PAD) / 2 = H/2 + this. */
const BASELINE_OFFSET = (TOP_PAD - BOTTOM_PAD) / 2;
const BODY_STYLE: React.CSSProperties = {
  fontWeight: 'var(--mat-body-weight)',
  letterSpacing: 'var(--mat-tracking)',
};

interface Sim {
  zone: number;
  /** Reduced motion: zone the light crossfades from, and when it started. */
  fromZone: number;
  fadeStart: number;
  spring: { x: number; v: number };
  width: number;
  scrollY: number;
  scrollV: number;
  palette: WavePalette;
  ramp: string[];
  baseline: { w: number; fill: CanvasGradient | null };
}

const DARK_RAMP = colorRamp(DARK_PALETTE);
const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`;

function readPalette(el: HTMLElement): WavePalette {
  const light = el.closest('[data-material]')?.getAttribute('data-material') === 'light';
  const base = light ? LIGHT_PALETTE : DARK_PALETTE;
  const cs = getComputedStyle(el);
  const get = (name: string) => cs.getPropertyValue(name).trim();
  return {
    rest: parseColor(get('--mat-muted')) ?? base.rest,
    cool: parseColor(get('--mat-cobalt')) ?? base.cool,
    hot: parseColor(get('--mat-accent-mark')) ?? base.hot,
    rule: get('--mat-rule-strong') || base.rule,
    ink: parseColor(get('--mat-ink')) ?? base.ink,
  };
}

export const SyntinuumSection: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [committed, setCommitted] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [slots, setSlots] = useState(240);
  const shown = preview ?? committed;

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bulbRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sim = useRef<Sim>({
    zone: 0,
    fromZone: 0,
    fadeStart: -Infinity,
    spring: { x: NaN, v: 0 },
    width: 0,
    scrollY: NaN,
    scrollV: 0,
    palette: DARK_PALETTE,
    ramp: DARK_RAMP,
    baseline: { w: 0, fill: null },
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, { width: w, height: h, time, deltaTime }: CanvasStage) => {
      const s = sim.current;
      const root = rootRef.current;
      const bulb = bulbRef.current;
      const L = zoneLayout(slotCount(w));
      const pitch = w / L.slots;
      const hMax = Math.max(8, (h - TOP_PAD - BOTTOM_PAD) / 2);
      const baseY = TOP_PAD + hMax;
      const sigma = sigmaFor(w, L);
      const target = L.centers[s.zone] * w;
      const t = time / 1000;

      // Keep the bulb where it was, proportionally, across a resize.
      if (s.width !== w) {
        if (s.width > 0 && Number.isFinite(s.spring.x)) s.spring.x *= w / s.width;
        s.width = w;
      }
      if (!Number.isFinite(s.spring.x) || isReduced) {
        s.spring.x = target;
        s.spring.v = 0;
      }

      // Scroll: amplitude follows scroll velocity, and falls to zero on the way out.
      let amp = 1;
      let scrolling = false;
      if (!isReduced && root) {
        const y = window.scrollY;
        if (deltaTime > 0 && Number.isFinite(s.scrollY)) {
          const v = ((y - s.scrollY) / deltaTime) * 1000;
          s.scrollV += (v - s.scrollV) * (1 - Math.exp(-deltaTime / 150));
          if (Math.abs(s.scrollV) < 5) s.scrollV = 0;
        }
        s.scrollY = y;
        scrolling = s.scrollV !== 0;
        const exit = exitAmplitude(root.getBoundingClientRect().top + baseY, window.innerHeight);
        amp = exit * (1 + scrollBoost(s.scrollV));
      }

      // Bulb position, tilt, bob; reduced motion crossfades instead.
      let settled = true;
      let bulbX = s.spring.x;
      let bulbAlpha = 1;
      let fade = 1;
      let fromX = target;
      let tilt = 0;
      let bob = 0;
      if (isReduced) {
        fade = Math.min(1, Math.max(0, (performance.now() - s.fadeStart) / CROSSFADE_MS));
        fromX = L.centers[s.fromZone] * w;
        bulbX = fade < 0.5 ? fromX : target;
        bulbAlpha = fade < 0.5 ? 1 - 2 * fade : 2 * fade - 1;
      } else {
        springStep(s.spring, target, deltaTime);
        settled = settle(s.spring, target);
        bulbX = s.spring.x;
        tilt = tiltDeg(s.spring.v);
        const rest = 1 - Math.min(1, Math.abs(s.spring.v) / 300);
        bob = rest * BOB_AMPLITUDE * Math.sin(2 * Math.PI * BOB_HZ * t);
        bulbAlpha = Math.min(1, amp);
      }

      if (bulb) {
        bulb.style.transform = `translate3d(${(bulbX - BULB_PX / 2).toFixed(2)}px, ${bob.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
        bulb.style.opacity = bulbAlpha.toFixed(3);
        // Hidden bulbs leave the layout so their canvas stops drawing.
        const display = bulbAlpha < 0.01 && !isReduced ? 'none' : '';
        if (bulb.style.display !== display) bulb.style.display = display;
      }

      const p = s.palette;
      ctx.clearRect(0, 0, w, h);

      // Cone of light from the bulb onto the bars, tilting with it.
      const coneAlpha = bulbAlpha * Math.min(1, amp);
      if (coneAlpha > 0.01) {
        const apexY = BULB_TOP + BULB_PX / 2 + bob;
        const len = baseY - apexY;
        ctx.save();
        ctx.translate(bulbX, apexY);
        ctx.rotate((tilt * Math.PI) / 180);
        const grad = ctx.createLinearGradient(0, 0, 0, len);
        grad.addColorStop(0, rgba(p.ink, 0.05 * coneAlpha));
        grad.addColorStop(1, rgba(p.ink, 0.012 * coneAlpha));
        ctx.fillStyle = grad;
        for (const spread of [0.45, 0.7, 0.95, 1.2]) {
          const half = sigma * spread;
          ctx.beginPath();
          ctx.moveTo(-4, 0);
          ctx.lineTo(4, 0);
          ctx.lineTo(half, len);
          ctx.lineTo(-half, len);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        ctx.save();
        ctx.translate(bulbX, baseY);
        ctx.scale(sigma * 1.3, Math.max(12, hMax * 0.9));
        const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        pool.addColorStop(0, rgba(p.hot, 0.09 * coneAlpha));
        pool.addColorStop(0.5, rgba(p.hot, 0.025 * coneAlpha));
        pool.addColorStop(1, rgba(p.hot, 0));
        ctx.fillStyle = pool;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
      }

      // Baseline: stays when the bars flatten, and hands off to the Index's first rule.
      if (s.baseline.w !== w || !s.baseline.fill) {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(0.08, p.rule);
        g.addColorStop(0.92, p.rule);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        s.baseline = { w, fill: g };
      }
      ctx.fillStyle = s.baseline.fill;
      ctx.fillRect(0, Math.round(baseY) - 0.5, w, 1);

      // Bars, mirrored about the baseline.
      const barW = Math.max(1, pitch * 0.42);
      const breathe = !isReduced;
      for (let i = 0; i < L.slots; i++) {
        const z = slotZone(i, L);
        if (z < 0) continue;
        const x = (i + 0.5) * pitch;
        const ea = edgeAlpha(x / w);
        if (ea <= 0) continue;
        const l = isReduced
          ? (1 - fade) * lit(x, fromX, sigma) + fade * lit(x, target, sigma)
          : lit(x, bulbX, sigma);
        const peak = zonePeaks(z, L.zoneBars)[i - L.starts[z]];
        const hh = peak * hMax * amp * pocketMask(x, L.numeralFrac[z] * w) * (breathe ? breath(l, t, i) : 1);
        if (hh < 0.5) continue;
        const a = ea * (0.6 + 0.4 * l);
        ctx.fillStyle = s.ramp[Math.round(l * 64)];
        ctx.globalAlpha = a;
        ctx.fillRect(x - barW / 2, baseY - hh, barW, hh);
        ctx.globalAlpha = a * 0.55;
        ctx.fillRect(x - barW / 2, baseY, barW, hh);
      }
      ctx.globalAlpha = 1;

      if (isReduced) return fade < 1;
      // Lit bars breathe and the bulb bobs while there is a waveform to light.
      return amp > 0.001 || !settled || scrolling;
    },
    [isReduced],
  );

  const { invalidate } = useCanvasStage(rootRef, canvasRef, draw);

  // Palette from the material tokens, and the bar count for the numerals.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const palette = readPalette(root);
    sim.current.palette = palette;
    sim.current.ramp = colorRamp(palette);
    sim.current.baseline = { w: 0, fill: null };
    const ro = new ResizeObserver(([entry]) => setSlots(slotCount(entry.contentRect.width)));
    ro.observe(root);
    invalidate();
    return () => ro.disconnect();
  }, [invalidate]);

  // Scrolling changes amplitude.
  useEffect(() => {
    if (isReduced) return;
    const onScroll = () => invalidate();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isReduced, invalidate]);

  // The bulb and the light follow the shown zone (preview, else committed).
  useEffect(() => {
    const s = sim.current;
    if (s.zone === shown) return;
    s.fromZone = s.zone;
    s.fadeStart = performance.now();
    s.zone = shown;
    invalidate();
  }, [shown, invalidate]);

  const layout = zoneLayout(slots);

  const zoneFromEvent = (e: React.PointerEvent | React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return zoneAtFraction((e.clientX - r.left) / (r.width || 1), layout);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const z = zoneFromEvent(e);
    if (z !== preview) setPreview(z);
  };
  const onPointerLeave = () => setPreview(null);
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('[role="tab"]')) return;
    setCommitted(zoneFromEvent(e));
    setPreview(null);
  };

  const commit = (i: number) => {
    setCommitted(i);
    setPreview(null);
  };
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = podcastPillars.length;
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    commit(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="podcast" aria-labelledby="syntinuum-title" className="relative w-full">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <h2
          id="syntinuum-title"
          className="font-serif font-normal text-[length:var(--display-size)] leading-[0.95] tracking-[-0.02em] text-[var(--mat-ink)]"
        >
          Syntinuum
        </h2>
        <p className="mt-6 max-w-[58ch] text-base sm:text-lg leading-relaxed text-[var(--mat-body)]" style={BODY_STYLE}>
          {podcastSummary}
        </p>
      </div>

      {/* Edge-to-edge waveform. The numerals on the baseline are the tabs. */}
      <div
        ref={rootRef}
        data-cursor="hairline"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerCancel={onPointerLeave}
        onClick={onClick}
        className="relative mt-12 sm:mt-16 w-full h-[248px] md:h-[296px] select-none"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
        <div
          ref={bulbRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 will-change-transform"
          style={{ top: BULB_TOP, width: BULB_PX, height: BULB_PX, transformOrigin: '50% 50%' }}
        >
          <AsciiDnaLightbulbCanvas variant="embedded" />
        </div>

        <p id="syntinuum-hint" className="sr-only-v7">
          Hover a zone of the waveform to preview a pillar and click to choose it, or use the left and right arrow keys on the numbered tabs.
        </p>
        <div role="tablist" aria-label="Syntinuum pillars" aria-describedby="syntinuum-hint" className="pointer-events-none absolute inset-0">
          {podcastPillars.map((pillar, i) => {
            const selected = i === committed;
            const color = selected ? 'var(--mat-accent-text)' : i === shown ? 'var(--mat-ink)' : 'var(--mat-muted)';
            return (
              <button
                key={pillar.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`syntinuum-tab-${pillar.id}`}
                aria-selected={selected}
                aria-controls={`syntinuum-panel-${pillar.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => commit(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className="pointer-events-auto absolute flex h-11 min-w-11 -translate-y-full items-end pb-1 font-mono text-[length:var(--label-size)] leading-none tabular-nums outline-none transition-colors duration-200 hover:!text-[var(--mat-ink)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--mat-ink)]"
                style={{ left: `${layout.numeralFrac[i] * 100}%`, top: `calc(50% + ${BASELINE_OFFSET}px)`, color }}
              >
                {pillar.numeral}
                <span className="sr-only-v7"> {pillar.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* One panel for the shown zone. Panels share one grid cell, so nothing shifts. */}
        <div className="mt-10 sm:mt-14 grid">
          {podcastPillars.map((pillar, i) => {
            const active = i === shown;
            return (
              <div
                key={pillar.id}
                role="tabpanel"
                id={`syntinuum-panel-${pillar.id}`}
                aria-labelledby={`syntinuum-tab-${pillar.id}`}
                aria-hidden={!active}
                inert={!active}
                tabIndex={active ? 0 : -1}
                className="rm-crossfade grid grid-cols-1 gap-6 outline-none lg:grid-cols-12 lg:gap-16 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--mat-rule-strong)]"
                style={{
                  gridArea: '1 / 1',
                  opacity: active ? 1 : 0,
                  transform: active || isReduced ? 'none' : 'translateY(8px)',
                  visibility: active ? 'visible' : 'hidden',
                  transition: `opacity ${isReduced ? CROSSFADE_MS : 320}ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear ${active ? 0 : isReduced ? CROSSFADE_MS : 320}ms`,
                }}
              >
                <h3 className="lg:col-span-5 font-serif font-normal text-[clamp(2.25rem,4.5vw,4rem)] leading-[1] tracking-[-0.015em] text-[var(--mat-ink)]">
                  {pillar.name}
                </h3>
                <div className="lg:col-span-7">
                  <p className="max-w-[48ch] text-lg sm:text-xl leading-snug text-[var(--mat-ink)]" style={BODY_STYLE}>
                    {pillar.line}
                  </p>
                  <ul className="mt-6 space-y-2 text-base leading-relaxed" style={BODY_STYLE}>
                    {pillar.guests.map((g) => (
                      <li key={g.name}>
                        <span className="text-[var(--mat-body)]">{g.name}</span>
                        <span className="text-[var(--mat-muted)]"> · {g.company}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 flex flex-wrap items-center gap-x-3 text-sm text-[var(--mat-muted)]" style={BODY_STYLE}>
          <span>{podcastReach}</span>
          <span aria-hidden="true">·</span>
          <a
            href={podcastSite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[var(--mat-accent-text)] transition-colors hover:text-[var(--mat-ink)] focus-visible:text-[var(--mat-ink)]"
          >
            syntinuumpodcast.com <span aria-hidden="true">↗</span>
          </a>
        </p>
      </div>
    </section>
  );
};

export default SyntinuumSection;
