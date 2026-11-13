/**
 * Recognition: monumental medallions on an orbit (docs/v7-blueprint.md section 7).
 *
 * One live WebGL2 shader lights the seated medallion. Every other view of a medal is a
 * bitmap baked once from the same lighting model at three depths (blur and brightness
 * baked in); the orbit only moves transforms and crossfades opacity between depths.
 * Tiers: full = live shader + light sweep, lite = live shader at DPR 1 without the
 * sweep, static / reduced motion = bitmaps only and no WebGL context.
 */
import React, { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { awards, awardsHeadline } from '@/content/awards';
import { useMotionPreference } from '@/components/MotionPreference';
import { register, type FrameInfo, type TaskHandle } from '@/v7/runtime/scheduler';
import { getPointer, subscribePointer } from '@/v7/runtime/pointer';
import { useQualityTier, type QualityTier } from '@/v7/runtime/tier';
import {
  T_END,
  T_UNSEAT,
  T_SEAT,
  depthLook,
  geometry,
  idleLight,
  levelOpacities,
  mod,
  pxPerPosition,
  releaseTarget,
  sampleVelocity,
  seatFactor,
  settled,
  shortestDelta,
  slot,
  spinDeg,
  springStep,
  stepFrame,
  sweepBoost,
  sweepOffset,
  type Geometry,
  type TextPhase,
} from './orbit';
import { LEVEL_PAD, bakeAll, enamelOf, revoke, type MedalBitmaps } from './bake';
import { MedalLight } from './live';
import { makeLight } from './shade';
import type { HeightMap } from './heightmap';

const N = awards.length;
const DPR_CAP = 1.5;
const DRAG_SLOP = 6;
/** Same timebase as the scheduler's rAF timestamps. Only ever called from input handlers. */
const clock = () => performance.now();

/* ------------------------------------------------------------------ viewport */

let viewCache: Geometry | null = null;
let viewW = 0;
let viewH = 0;
/** Width changes always count; height only past 100 px, so a mobile URL bar never resizes the medal. */
function readView(): Geometry {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!viewCache || w !== viewW || Math.abs(h - viewH) >= 100) {
    viewW = w;
    viewH = h;
    viewCache = geometry(w, h);
  }
  return viewCache;
}
function subscribeView(cb: () => void) {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
}

/* ------------------------------------------------------------------ static styles */

const MEDAL_BOX: CSSProperties = {
  width: 'var(--rec-d)',
  height: 'var(--rec-d)',
  margin: 'calc(var(--rec-d) / -2) 0 0 calc(var(--rec-d) / -2)',
};
const FRONT: CSSProperties = { backfaceVisibility: 'hidden', transform: 'translateZ(calc(var(--rec-t) / 2))' };
const BACK: CSSProperties = { backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(calc(var(--rec-t) / 2))' };
const EDGE: CSSProperties = {
  left: '50%',
  width: 'var(--rec-t)',
  marginLeft: 'calc(var(--rec-t) / -2)',
  transform: 'rotateY(90deg)',
  opacity: 0,
};
const pct = (x: number) => `${(x * 100).toFixed(3)}%`;
const LAYER: CSSProperties[] = [
  { left: 0, top: 0, width: '100%', height: '100%', opacity: 0, visibility: 'hidden' },
  { left: pct(-LEVEL_PAD), top: pct(-LEVEL_PAD), width: pct(1 + 2 * LEVEL_PAD), height: pct(1 + 2 * LEVEL_PAD), opacity: 0, visibility: 'hidden' },
];
const layerStyle = (k: number) => LAYER[k === 0 ? 0 : 1];

function Bitmap({ src, style, layer }: { src: string; style: CSSProperties; layer?: boolean }) {
  return (
    // Object URLs of baked bitmaps: next/image has nothing to optimise here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      data-layer={layer ? '' : undefined}
      className="absolute block max-w-none pointer-events-none select-none"
      style={style}
    />
  );
}

function lineStyle(phase: TextPhase, i: number, reduced: boolean): CSSProperties {
  if (reduced) return {};
  if (phase === 'exit') return { transform: 'translateY(-110%)', transition: `transform 100ms cubic-bezier(0.4,0,1,1) ${i * 20}ms` };
  if (phase === 'hidden') return { transform: 'translateY(110%)', transition: 'none' };
  return { transform: 'translateY(0)', transition: `transform 420ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms` };
}

function Line({ phase, i, reduced, children }: { phase: TextPhase; i: number; reduced: boolean; children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <span className="block" style={lineStyle(phase, i, reduced)}>
        {children}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ motion state */

interface Motion {
  spring: { x: number; v: number };
  target: number;
  /** Target applied once the unseat finishes (t >= 120 ms). */
  pending: number | null;
  stepStart: number;
  outgoing: number;
  incoming: number;
  shown: number;
  phase: TextPhase;
  drag: null | { id: number; x0: number; y0: number; s0: number; from: number; active: boolean; samples: { t: number; s: number }[] };
  suppressClick: boolean;
  lastKey: string;
}

const newMotion = (): Motion => ({
  spring: { x: 0, v: 0 },
  target: 0,
  pending: null,
  stepStart: -Infinity,
  outgoing: 0,
  incoming: 0,
  shown: 0,
  phase: 'shown',
  drag: null,
  suppressClick: false,
  lastKey: '',
});

interface MedalDom {
  spin: HTMLElement | null;
  layers: HTMLElement[];
  edge: HTMLElement | null;
}

/* ------------------------------------------------------------------ section */

export default function RecognitionSection() {
  const router = useRouter();
  const tier = useQualityTier();
  const { isReduced } = useMotionPreference();
  const geom = useSyncExternalStore(subscribeView, readView, () => null);

  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<TextPhase>('shown');
  const [medals, setMedals] = useState<(MedalBitmaps | null)[]>(() => awards.map(() => null));
  const [edge, setEdge] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const liveWrapRef = useRef<HTMLDivElement | null>(null);
  const liveSpinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const medalEls = useRef<(HTMLButtonElement | null)[]>([]);
  const domCache = useRef<(MedalDom | null)[]>([]);
  const mapsRef = useRef<(HeightMap | null)[]>(awards.map(() => null));
  const liveRef = useRef<MedalLight | null>(null);
  const taskRef = useRef<TaskHandle | null>(null);
  const motion = useRef<Motion>(newMotion());
  const cfg = useRef<{ geom: Geometry | null; tier: QualityTier | null; reduced: boolean }>({ geom: null, tier: null, reduced: false });

  const liveAllowed = (tier === 'full' || tier === 'lite') && !isReduced;

  useEffect(() => {
    cfg.current = { geom, tier, reduced: isReduced };
    taskRef.current?.wake();
  }, [geom, tier, isReduced]);

  useEffect(() => {
    domCache.current = [];
    taskRef.current?.wake();
  }, [medals, edge, isReduced]);

  /* ---------------- frame task: orbit spring, choreography, live light */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const dom = (i: number): MedalDom | null => {
      const cached = domCache.current[i];
      if (cached) return cached;
      const root = medalEls.current[i];
      if (!root) return null;
      const d: MedalDom = {
        spin: root.querySelector<HTMLElement>('[data-spin]'),
        layers: Array.from(root.querySelectorAll<HTMLElement>('[data-layer]')),
        edge: root.querySelector<HTMLElement>('[data-edge]'),
      };
      domCache.current[i] = d;
      return d;
    };

    // Bitmaps for medal i are in the DOM once its layers exist.
    const layersReady = (i: number) => (dom(i)?.layers.length ?? 0) > 0;

    const frame = ({ now, dt }: FrameInfo): boolean => {
      const { geom: g, tier: tr, reduced } = cfg.current;
      if (!g) return false;
      const rect = stage.getBoundingClientRect();
      const st = motion.current;
      const sp = st.spring;

      let t = now - st.stepStart;
      if (st.drag?.active) t = Math.min(t, T_UNSEAT - 1);
      const stepping = !reduced && t < T_END;
      const f = stepFrame(stepping ? t : Infinity);

      if (st.pending !== null && (!stepping || f.orbit)) {
        st.target = st.pending;
        st.pending = null;
      }
      let moving = false;
      if (!st.drag?.active) {
        if (reduced) {
          sp.x = st.target;
          sp.v = 0;
        } else if (st.pending === null) {
          if (settled(sp, st.target)) {
            sp.x = st.target;
            sp.v = 0;
          } else {
            springStep(sp, st.target, dt);
            moving = true;
          }
        }
      }

      const s = sp.x;
      const spin = `perspective(${(g.d * 3).toFixed(0)}px) rotateY(${(reduced ? 0 : spinDeg(s)).toFixed(2)}deg)`;
      const transformOf = (i: number) => {
        const sl = slot(i, s, N, g);
        const fac = stepping ? seatFactor(f, i === st.outgoing, i === st.incoming) : 1;
        return {
          sl,
          css: `translate3d(${sl.x.toFixed(2)}px, ${sl.y.toFixed(2)}px, 0) scale(${(depthLook(sl.z).scale * fac).toFixed(4)})`,
        };
      };

      for (let i = 0; i < N; i++) {
        const el = medalEls.current[i];
        if (!el) continue;
        const { sl, css } = transformOf(i);
        el.style.transform = css;
        el.style.zIndex = String(1 + Math.round((1 - sl.z) * 100));
        const parts = dom(i);
        if (!parts) continue;
        if (parts.spin) parts.spin.style.transform = spin;
        const ops = levelOpacities(sl.z);
        parts.layers.forEach((layer, k) => {
          const o = ops[k % 3];
          layer.style.opacity = o.toFixed(3);
          layer.style.visibility = o > 0.002 ? 'visible' : 'hidden';
        });
        if (parts.edge) parts.edge.style.opacity = depthLook(sl.z).brightness.toFixed(3);
      }

      let keep = moving || !!st.drag?.active || stepping;

      // The live shader sits over whichever medal is seated (or unseating).
      const live = liveRef.current;
      const wrap = liveWrapRef.current;
      if (live && wrap && !live.lost) {
        const idx = stepping && t < T_UNSEAT ? st.outgoing : mod(Math.round(st.target), N);
        let op = st.drag?.active ? 0 : stepping ? f.live : 1;
        if (!live.has(idx) || !layersReady(idx)) op = 0;
        wrap.style.opacity = op.toFixed(3);
        if (op > 0) {
          const { sl, css } = transformOf(idx);
          wrap.style.transform = css;
          if (liveSpinRef.current) liveSpinRef.current.style.transform = spin;
          live.resize(g.d, tr === 'full' ? Math.min(window.devicePixelRatio || 1, DPR_CAP) : 1);
          const p = getPointer();
          const idle = !p.inside || p.kind === 'touch';
          const half = g.d / 2;
          const planar = idle
            ? idleLight(now)
            : { x: (p.x - (rect.left + rect.width / 2 + sl.x)) / half, y: -(p.y - (rect.top + rect.height / 2 + sl.y)) / half };
          const u = tr === 'full' && stepping ? f.sweep : null;
          const L = makeLight(planar.x, planar.y, sweepOffset(u));
          const key = `${idx}|${L.x.toFixed(3)}|${L.y.toFixed(3)}|${u === null ? '-' : u.toFixed(3)}|${g.d}`;
          if (key !== st.lastKey) {
            live.draw({ index: idx, light: L, boost: sweepBoost(u), enamel: enamelOf(awards[idx]) });
            st.lastKey = key;
          }
          if (idle) keep = true;
        }
      }

      // Text: exit, swap, reveal.
      const ph: TextPhase = stepping ? f.text : 'shown';
      if (ph !== st.phase) {
        st.phase = ph;
        setPhase(ph);
      }
      const want = stepping ? (ph === 'hidden' || ph === 'reveal' ? st.incoming : st.shown) : st.drag?.active ? st.shown : mod(Math.round(st.target), N);
      if (want >= 0 && want !== st.shown) {
        st.shown = want;
        setShown(want);
      }
      return keep;
    };

    const task = register(frame, { element: stage, budgeted: true });
    taskRef.current = task;
    return () => {
      task.dispose();
      taskRef.current = null;
    };
  }, []);

  /* ---------------- bake: once, shortly before the section scrolls in */
  const hasGeom = geom !== null;
  useEffect(() => {
    const section = sectionRef.current;
    if (!hasGeom || !section) return;
    let alive = true;
    const urls: MedalBitmaps[] = [];
    let edgeUrl: string | undefined;
    const start = () => {
      const g = cfg.current.geom ?? readView();
      bakeAll({
        awards,
        d: g.d,
        dpr: window.devicePixelRatio || 1,
        isAlive: () => alive,
        onMedal: (i, m, map) => {
          urls.push(m);
          mapsRef.current[i] = map;
          liveRef.current?.upload(i, map);
          setMedals((prev) => prev.map((x, j) => (j === i ? m : x)));
        },
      })
        .then((r) => {
          if (!r) return;
          edgeUrl = r.edge;
          setEdge(r.edge);
        })
        .catch((err) => console.warn('[Recognition] bake failed', err));
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '150% 0px 150% 0px' },
    );
    io.observe(section);
    return () => {
      alive = false;
      io.disconnect();
      revoke({ medals: urls, edge: edgeUrl });
      mapsRef.current = awards.map(() => null);
      setMedals(awards.map(() => null));
      setEdge(null);
    };
  }, [hasGeom]);

  /* ---------------- live shader: full and lite tiers only */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!liveAllowed || !canvas) return;
    let live: MedalLight;
    try {
      live = new MedalLight(canvas, () => {
        liveRef.current = null;
      });
    } catch (err) {
      console.warn('[Recognition] WebGL2 unavailable, using baked bitmaps', err);
      return;
    }
    liveRef.current = live;
    mapsRef.current.forEach((m, i) => m && live.upload(i, m));
    motion.current.lastKey = '';
    const wake = () => taskRef.current?.wake();
    const off = subscribePointer(wake);
    window.addEventListener('scroll', wake, { passive: true });
    wake();
    return () => {
      off();
      window.removeEventListener('scroll', wake);
      live.dispose();
      liveRef.current = null;
    };
  }, [liveAllowed]);

  /* ---------------- focus follows selection inside the tablist */
  useEffect(() => {
    const stage = stageRef.current;
    if (stage && stage.contains(document.activeElement)) medalEls.current[active]?.focus({ preventScroll: true });
  }, [active]);

  /* ---------------- input */
  const go = (delta: number) => {
    const st = motion.current;
    if (delta === 0 || st.drag?.active) return;
    const now = clock();
    const base = st.pending ?? st.target;
    const next = base + delta;
    const idx = mod(next, N);
    if (cfg.current.reduced) {
      st.target = next;
      st.spring.x = next;
      st.spring.v = 0;
      st.incoming = idx;
    } else {
      const t = now - st.stepStart;
      if (t >= T_END || t >= T_SEAT) {
        st.outgoing = mod(Math.round(st.target), N);
        st.stepStart = now;
        st.pending = next;
      } else if (t < T_UNSEAT) {
        st.pending = next;
      } else {
        st.pending = null;
        st.target = next;
        st.stepStart = now - T_UNSEAT;
      }
      st.incoming = idx;
    }
    setActive(idx);
    taskRef.current?.wake();
  };

  const goTo = (j: number) => {
    const st = motion.current;
    go(shortestDelta(mod(Math.round(st.pending ?? st.target), N), j, N));
  };

  const open = (href: string) => {
    if (href.endsWith('.pdf')) window.open(href, '_blank', 'noopener,noreferrer');
    else void router.push(href);
  };

  const onMedalClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) goTo(i);
    else if (e.detail > 0) open(awards[i].href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const keys: Record<string, () => void> = {
      ArrowRight: () => go(1),
      ArrowLeft: () => go(-1),
      Home: () => goTo(0),
      End: () => goTo(N - 1),
    };
    const fn = keys[e.key];
    if (!fn) return;
    e.preventDefault();
    fn();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const st = motion.current;
    st.suppressClick = false;
    st.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, s0: st.spring.x, from: 0, active: false, samples: [] };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = motion.current;
    const d = st.drag;
    const g = cfg.current.geom;
    if (!d || d.id !== e.pointerId || !g || cfg.current.reduced) return;
    const dx = e.clientX - d.x0;
    if (!d.active) {
      if (Math.abs(dx) < DRAG_SLOP || Math.abs(dx) < Math.abs(e.clientY - d.y0)) return;
      d.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      st.outgoing = mod(Math.round(st.spring.x), N);
      st.incoming = -1;
      st.pending = null;
      st.spring.v = 0;
      st.stepStart = clock();
      d.s0 = st.spring.x;
      d.from = Math.round(st.spring.x);
      d.x0 = e.clientX;
    }
    st.spring.x = d.s0 - (e.clientX - d.x0) / pxPerPosition(g.a, N);
    d.samples.push({ t: clock(), s: st.spring.x });
    if (d.samples.length > 12) d.samples.shift();
    taskRef.current?.wake();
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = motion.current;
    const d = st.drag;
    if (!d || d.id !== e.pointerId) return;
    st.drag = null;
    if (cfg.current.reduced) {
      const dx = e.clientX - d.x0;
      if (e.type === 'pointerup' && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - d.y0)) {
        st.suppressClick = true;
        go(dx < 0 ? 1 : -1);
      }
      return;
    }
    if (!d.active) return;
    st.suppressClick = true;
    const v = sampleVelocity(d.samples);
    const target = releaseTarget(st.spring.x, v, N, d.from);
    st.spring.v = v;
    st.target = target;
    st.incoming = mod(target, N);
    st.stepStart = clock() - T_UNSEAT;
    setActive(st.incoming);
    taskRef.current?.wake();
  };

  const onClickCapture = (e: React.MouseEvent) => {
    const st = motion.current;
    if (!st.suppressClick) return;
    st.suppressClick = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /* ---------------- render */
  const [h2x, h1st] = splitHeadline(awardsHeadline);
  const stageVars = {
    '--rec-d': geom ? `${geom.d}px` : 'min(72vh, 52vw)',
    '--rec-t': 'calc(var(--rec-d) * 0.05)',
    height: geom ? `${Math.round(geom.d * 1.04 + geom.b * 2)}px` : 'calc(min(72vh, 52vw) * 1.04 + 6vh)',
  } as CSSProperties;
  const bodyType: CSSProperties = { fontWeight: 'var(--mat-body-weight)' as CSSProperties['fontWeight'], letterSpacing: 'var(--mat-tracking)' };

  return (
    <section id="achievements" ref={sectionRef} aria-labelledby="recognition-title" className="relative w-full overflow-x-clip">
      <header className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <h2 id="recognition-title" className="font-mono text-[length:var(--label-size)] text-[var(--mat-muted)]">
          Recognition
        </h2>
        <p
          className="mt-4 font-serif font-normal leading-[0.95] tracking-[-0.02em] text-[var(--mat-ink)]"
          style={{ fontSize: 'var(--display-size)' }}
        >
          {h2x} <span className="italic text-[var(--mat-accent-mark)]">{h1st}</span>
        </p>
      </header>

      <span id="recognition-hint" className="sr-only-v7">
        Left and right arrow keys move between awards. Activate the award title to open it.
      </span>

      <div
        ref={stageRef}
        role="tablist"
        aria-label="Awards"
        aria-orientation="horizontal"
        aria-describedby="recognition-hint"
        data-cursor="grab"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        className="relative mt-10 w-full select-none touch-pan-y sm:mt-14"
        style={stageVars}
      >
        {awards.map((a, i) => {
          const m = medals[i];
          const on = i === active;
          return (
            <button
              key={a.id}
              ref={(el) => {
                medalEls.current[i] = el;
              }}
              id={`rec-tab-${a.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="recognition-panel"
              aria-label={`${a.title}, ${a.year}`}
              tabIndex={on ? 0 : -1}
              onClick={(e) => onMedalClick(i, e)}
              className="absolute left-1/2 top-1/2 block cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--mat-accent-mark)]"
              style={MEDAL_BOX}
            >
              {m && !isReduced && (
                <span data-spin="" className="absolute inset-0 block" style={{ transformStyle: 'preserve-3d' }}>
                  <span className="absolute inset-0 block" style={FRONT}>
                    {m.levels.map((src, k) => (
                      <Bitmap key={k} src={src} style={layerStyle(k)} layer />
                    ))}
                  </span>
                  <span className="absolute inset-0 block" style={BACK}>
                    {m.levels.map((src, k) => (
                      <Bitmap key={k} src={src} style={layerStyle(k)} layer />
                    ))}
                  </span>
                  {edge && (
                    <span data-edge="" className="absolute top-0 block h-full" style={EDGE}>
                      <Bitmap src={edge} style={{ inset: 0, width: '100%', height: '100%' }} />
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}

        {isReduced && geom && <ReducedOrbit geom={geom} active={active} medals={medals} />}

        {liveAllowed && (
          <div
            ref={liveWrapRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{ ...MEDAL_BOX, zIndex: 200, opacity: 0 }}
          >
            <div ref={liveSpinRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" style={FRONT} />
            </div>
          </div>
        )}
      </div>

      <div
        id="recognition-panel"
        role="tabpanel"
        aria-labelledby={`rec-tab-${awards[active].id}`}
        className="mx-auto mt-8 grid w-full max-w-[60rem] px-4 text-center sm:mt-10"
      >
        {awards.map((a, j) => {
          const on = j === shown;
          const ph = on ? phase : 'hidden';
          const pdf = a.href.endsWith('.pdf');
          return (
            <div
              key={a.id}
              aria-hidden={!on}
              className={isReduced ? 'rm-crossfade' : undefined}
              style={{
                gridArea: '1 / 1',
                opacity: on ? 1 : 0,
                visibility: on ? 'visible' : 'hidden',
                transition: isReduced ? `opacity 200ms linear, visibility 0s linear ${on ? '0s' : '200ms'}` : undefined,
              }}
            >
              <h3
                className="font-serif font-normal leading-[1.08] tracking-[-0.01em] text-[var(--mat-ink)]"
                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 3rem)' }}
              >
                <Line phase={ph} i={0} reduced={isReduced}>
                  <Link
                    href={a.href}
                    tabIndex={on ? 0 : -1}
                    {...(pdf ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="transition-colors hover:text-[var(--mat-accent-mark)] focus-visible:text-[var(--mat-accent-mark)] focus-visible:outline-none"
                  >
                    {a.title}
                  </Link>
                </Line>
              </h3>
              <p className="mx-auto mt-4 max-w-[56ch] text-base leading-relaxed text-[var(--mat-body)] sm:text-lg" style={bodyType}>
                <Line phase={ph} i={1} reduced={isReduced}>
                  {a.context}
                </Line>
              </p>
              <p className="mt-2 text-sm tabular-nums text-[var(--mat-muted)]" style={bodyType}>
                <Line phase={ph} i={2} reduced={isReduced}>
                  {a.year}
                </Line>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function splitHeadline(h: string): [string, string] {
  const i = h.lastIndexOf(' ');
  return i < 0 ? ['', h] : [h.slice(0, i), h.slice(i + 1)];
}

/**
 * Reduced motion: no orbit. Each slot holds every award's bitmap and crossfades to the
 * one now sitting there in 200 ms. The tab buttons above stay the hit targets.
 */
function ReducedOrbit({ geom, active, medals }: { geom: Geometry; active: number; medals: (MedalBitmaps | null)[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: N }, (_, k) => {
        const sl = slot(k, 0, N, geom);
        const ops = levelOpacities(sl.z);
        return (
          <div
            key={k}
            className="absolute left-1/2 top-1/2"
            style={{
              ...MEDAL_BOX,
              transform: `translate3d(${sl.x.toFixed(2)}px, ${sl.y.toFixed(2)}px, 0) scale(${depthLook(sl.z).scale.toFixed(4)})`,
              zIndex: 1 + Math.round((1 - sl.z) * 100),
            }}
          >
            {medals.map((m, j) =>
              m ? (
                <div
                  key={j}
                  className="rm-crossfade absolute inset-0"
                  style={{ opacity: mod(active + k, N) === j ? 1 : 0, transition: 'opacity 200ms linear' }}
                >
                  {m.levels.map((src, lv) =>
                    ops[lv] > 0.002 ? <Bitmap key={lv} src={src} style={{ ...layerStyle(lv), opacity: ops[lv], visibility: 'visible' }} /> : null,
                  )}
                </div>
              ) : null,
            )}
          </div>
        );
      })}
    </div>
  );
}
