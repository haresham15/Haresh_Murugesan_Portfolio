import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { nowIntro, nowSubjects } from '@/content/now';
import { useMotionPreference } from '@/components/MotionPreference';
import { register, type TaskHandle } from '@/v7/runtime/scheduler';
import {
  STOPS,
  clamp,
  copyOpacities,
  focusFromDrag,
  progressForStop,
  sceneScale,
  snapStop,
  springStep,
  stopFromProgress,
} from './focus';
import styles from './now.module.css';

/**
 * Now: a viewfinder with three subjects at three distances. The visitor racks focus
 * between them by scroll (pinned, three stops of 60vh), by dragging the lens ring,
 * by clicking a subject, or with arrow keys on the ring. Blur is three pre-rendered
 * copies per subject crossfaded by opacity; filter never changes per frame.
 * Spec: docs/v7-blueprint.md §8.
 */

/** Per-depth type and offset. Near is largest and lowest; far is small, near the horizon. */
const DEPTH = [
  { offset: '0px', verb: 'min(var(--display-size), 13vh)', title: 'clamp(1.0625rem, 1.7vw, 1.625rem)' },
  { offset: 'clamp(1.75rem, 15vw, 17rem)', verb: 'min(clamp(2.125rem, 4.4vw, 4.5rem), 8.5vh)', title: 'clamp(0.9375rem, 1.25vw, 1.25rem)' },
  { offset: 'clamp(3.5rem, 34vw, 34rem)', verb: 'min(clamp(1.625rem, 2.7vw, 2.75rem), 6vh)', title: 'clamp(0.875rem, 1vw, 1.0625rem)' },
] as const;

const RING_H = 'clamp(84px, 13vh, 124px)';
/** Pinned runway: one viewport plus three stops of 60vh. */
const SECTION_H = 'calc(100vh + 180vh)';
const DRAG_SLOP_PX = 4;

interface RingGeo {
  w: number;
  h: number;
  r: number;
  cx: number;
  cy: number;
  top: number;
  /** Arc length between two marks, px. Also the drag distance for one stop. */
  spacing: number;
  /** Angle between two marks, rad. */
  dTheta: number;
}

function ringGeometry(w: number, h: number): RingGeo {
  const r = Math.max(w * 1.15, 640);
  const top = Math.round(h * 0.36);
  const spacing = clamp(w * 0.24, 112, 300);
  return { w, h, r, cx: w / 2, cy: top + r, top, spacing, dTheta: spacing / r };
}

const polar = (g: RingGeo, theta: number, radius: number) =>
  [g.cx + radius * Math.sin(theta), g.cy - radius * Math.cos(theta)] as const;

const arcPath = (g: RingGeo, radius: number, half: number) => {
  const [x0, y0] = polar(g, -half, radius);
  const [x1, y1] = polar(g, half, radius);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${radius} ${radius} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/** The engraved lens barrel. Static geometry; only the inner group's rotation changes. */
const LensRing: React.FC<{
  geo: RingGeo;
  stop: number;
  maskId: string;
  rotRef: React.RefObject<SVGGElement | null>;
}> = ({ geo, stop, maskId, rotRef }) => {
  const { w, h, r, top, dTheta } = geo;
  const band = Math.min(38, h * 0.4);
  const visible = Math.asin(Math.min(1, w / 2 / r));
  const step = dTheta / 10;
  const n = Math.ceil((visible + dTheta) / step) + 2;
  let minor = '';
  for (let i = -n; i <= n; i++) {
    if (i % 10 === 0 && Math.abs(i) <= 10) continue; // distance marks are drawn separately
    const len = i % 5 === 0 ? 9 : 5;
    const [x0, y0] = polar(geo, i * step, r);
    const [x1, y1] = polar(geo, i * step, r - len);
    minor += `M${x0.toFixed(1)} ${y0.toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  const half = visible + 0.02;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="block overflow-visible">
      <defs>
        <linearGradient id={`${maskId}-g`} x1="0" x2={w} y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.16" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.84" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="-20" width={w} height={h + 20}>
          <rect x="0" y="-20" width={w} height={h + 20} fill={`url(#${maskId}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`} fill="none">
        <path d={arcPath(geo, r, half)} stroke="var(--mat-rule-strong)" strokeWidth="1" />
        <path d={arcPath(geo, r - band, half)} stroke="var(--mat-rule)" strokeWidth="1" />
        <path
          className={styles.focusArc}
          d={arcPath(geo, r + 7, Math.min(half, (geo.spacing * 1.4) / r))}
          stroke="var(--mat-cobalt)"
          strokeWidth="2"
        />
        <g ref={rotRef}>
          <path d={minor} stroke="var(--mat-muted)" strokeWidth="1" opacity="0.7" />
          {nowSubjects.map((s, i) => {
            const theta = (i - 1) * dTheta;
            const [x0, y0] = polar(geo, theta, r);
            const [x1, y1] = polar(geo, theta, r - 13);
            const [tx, ty] = polar(geo, theta, r - 26);
            const deg = (theta * 180) / Math.PI;
            const active = i === stop;
            return (
              <g key={s.id}>
                <path d={`M${x0} ${y0}L${x1} ${y1}`} stroke={active ? 'var(--mat-ink)' : 'var(--mat-muted)'} strokeWidth="1.5" />
                <text
                  x={tx}
                  y={ty}
                  transform={`rotate(${deg.toFixed(3)} ${tx} ${ty})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono"
                  fontSize="12"
                  fill={active ? 'var(--mat-ink)' : 'var(--mat-muted)'}
                  stroke="none"
                >
                  {s.distance}
                </text>
              </g>
            );
          })}
        </g>
        {/* Fixed index mark: the ring turns beneath it */}
        <path d={`M${geo.cx} ${top - 10}L${geo.cx} ${top + 7}`} stroke="var(--mat-accent-mark)" strokeWidth="1.5" />
      </g>
    </svg>
  );
};

export const NowSection: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const titleId = `now-title-${uid}`;
  const hintId = `now-hint-${uid}`;
  const maskId = `now-ring-${uid}`;

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const rotRef = useRef<SVGGElement | null>(null);
  const subjectRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** copyRefs[subject][copy] */
  const copyRefs = useRef<(HTMLSpanElement | null)[][]>(nowSubjects.map(() => [null, null, null]));
  const taskRef = useRef<TaskHandle | null>(null);

  const [stop, setStop] = useState(0);
  const [geo, setGeo] = useState<RingGeo>(() => ringGeometry(1200, 104));

  // Mutable motion state, read by the scheduler task and the input handlers.
  const m = useRef({
    x: 0,
    v: 0,
    target: 0,
    reduced: false,
    dragging: false,
    lock: 0,
    scrollStop: null as number | null,
    fit: 1,
    stageH: 0,
    geo: ringGeometry(1200, 104),
    opacity: nowSubjects.map(() => [-1, -1, -1]),
    drag: null as null | { id: number; x0: number; f0: number; lastX: number; lastT: number; vel: number; moved: boolean },
  });

  /* ---- writing the frame ---- */
  const apply = useCallback((f: number) => {
    const s = m.current;
    for (let i = 0; i < nowSubjects.length; i++) {
      const ops = copyOpacities(i - f);
      for (let k = 0; k < 3; k++) {
        const el = copyRefs.current[i][k];
        if (!el || Math.abs(s.opacity[i][k] - ops[k]) < 0.003) continue;
        s.opacity[i][k] = ops[k];
        el.style.opacity = ops[k].toFixed(3);
      }
    }
    const scene = sceneRef.current;
    if (scene) {
      const scale = s.fit * (s.reduced ? 1 : sceneScale(f));
      scene.style.transform = scale === 1 ? '' : `scale(${scale.toFixed(4)})`;
    }
    const g = rotRef.current;
    if (g) {
      const deg = (-(f - 1) * s.geo.dTheta * 180) / Math.PI;
      g.setAttribute('transform', `rotate(${deg.toFixed(3)} ${s.geo.cx} ${s.geo.cy})`);
    }
  }, []);

  const setLock = useCallback((i: number) => {
    const s = m.current;
    if (s.lock === i) return;
    s.lock = i;
    subjectRefs.current.forEach((el, k) => {
      if (el) el.dataset.lock = String(k === i);
    });
  }, []);

  /* ---- scroll ↔ stop ---- */
  const pinState = useCallback(() => {
    const section = sectionRef.current;
    const s = m.current;
    if (!section || s.reduced) return null;
    const rect = section.getBoundingClientRect();
    const runway = rect.height - s.stageH;
    if (runway <= 1) return null;
    return { rect, runway, pinned: rect.top <= 1 && rect.bottom >= s.stageH - 1 };
  }, []);

  const commit = useCallback((i: number, source: 'scroll' | 'click' | 'key' | 'drag') => {
    const s = m.current;
    const next = clamp(i, 0, STOPS - 1);
    s.target = next;
    setStop(next);
    if (s.reduced) {
      s.x = next;
      s.v = 0;
    }
    if (source !== 'scroll') {
      // Keep the page where the chosen stop lives, so the next scroll does not undo the choice.
      const pin = pinState();
      if (pin?.pinned) {
        s.scrollStop = next;
        const y = window.scrollY + pin.rect.top + progressForStop(next) * pin.runway;
        window.scrollTo({ top: y, behavior: 'instant' });
      }
    }
    taskRef.current?.wake();
  }, [pinState]);

  const readScroll = useCallback(() => {
    const s = m.current;
    const pin = pinState();
    if (!pin) return;
    const p = -pin.rect.top / pin.runway;
    const prev = s.scrollStop;
    const next = stopFromProgress(p, prev);
    if (next === prev) return;
    s.scrollStop = next;
    if (prev === null) {
      // First reading: start at the stop the page is on, without a rack.
      s.x = next;
      s.v = 0;
      s.target = next;
      setStop(next);
      return;
    }
    if (!s.dragging) commit(next, 'scroll');
  }, [commit, pinState]);

  /* ---- one scheduler task ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const task = register(({ dt }) => {
      const s = m.current;
      readScroll();
      if (s.dragging) {
        setLock(-1);
        apply(s.x);
        return false; // pointer moves wake it
      }
      const settled = springStep(s, s.target, dt);
      apply(s.x);
      setLock(settled ? s.target : -1);
      return !settled;
    }, { element: section, budgeted: false });
    taskRef.current = task;
    return () => {
      task.dispose();
      taskRef.current = null;
    };
  }, [apply, readScroll, setLock]);

  // Scroll and resize wake the task; it sleeps whenever focus is settled.
  useEffect(() => {
    if (isReduced) return;
    const wake = () => taskRef.current?.wake();
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake, { passive: true });
    return () => {
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
    };
  }, [isReduced]);

  // Mode change: reduced motion drops the pin, so forget the scroll history and settle at once.
  useEffect(() => {
    const s = m.current;
    s.reduced = isReduced;
    s.scrollStop = null;
    if (isReduced) {
      s.x = s.target;
      s.v = 0;
    }
    taskRef.current?.wake();
  }, [isReduced]);

  // Measure: ring geometry, stage height, and a fit scale so short screens never clip type.
  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    const inner = innerRef.current;
    const ring = ringRef.current;
    if (!stage || !scene || !inner || !ring || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const s = m.current;
      s.stageH = stage.offsetHeight;
      const avail = scene.clientHeight;
      const need = inner.offsetHeight;
      s.fit = need > 0 && avail > 0 ? Math.min(1, avail / need) : 1;
      const w = Math.round(ring.clientWidth);
      const h = Math.round(ring.clientHeight);
      if (w > 0 && h > 0 && (w !== s.geo.w || h !== s.geo.h)) {
        s.geo = ringGeometry(w, h);
        setGeo(s.geo);
      }
      apply(s.x);
      taskRef.current?.wake();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(scene);
    ro.observe(inner);
    ro.observe(ring);
    measure();
    return () => ro.disconnect();
  }, [apply]);

  // Geometry re-rendered the ring: put its rotation back.
  useEffect(() => {
    apply(m.current.x);
  }, [geo, apply]);

  // The camera confirms focus each time the viewfinder comes into view.
  useEffect(() => {
    const stage = stageRef.current;
    setLock(-1);
    taskRef.current?.wake();
    if (!stage || typeof IntersectionObserver === 'undefined') return;
    let inView = false;
    const io = new IntersectionObserver(([entry]) => {
      const now = entry.intersectionRatio >= 0.6;
      if (now && !inView && !m.current.reduced && !m.current.dragging) {
        setLock(-1);
        void stage.offsetWidth; // commit the unlocked style so the contraction transitions
        taskRef.current?.wake();
      }
      inView = now;
    }, { threshold: [0, 0.6] });
    io.observe(stage);
    return () => io.disconnect();
  }, [setLock]);

  /* ---- ring input: drag, tap a mark, keys ---- */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    m.current.drag = { id: e.pointerId, x0: e.clientX, f0: m.current.x, lastX: e.clientX, lastT: e.timeStamp, vel: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = m.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    if (!d.moved) {
      if (Math.abs(e.clientX - d.x0) < DRAG_SLOP_PX) return;
      d.moved = true;
      d.x0 = e.clientX;
      d.f0 = s.x;
      s.dragging = true;
      s.v = 0;
    }
    const prevF = s.x;
    s.x = focusFromDrag(d.f0, e.clientX - d.x0, s.geo.spacing);
    const dts = (e.timeStamp - d.lastT) / 1000;
    if (dts > 0) d.vel = d.vel * 0.6 + ((s.x - prevF) / dts) * 0.4;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    taskRef.current?.wake();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const s = m.current;
    const d = s.drag;
    if (!d || d.id !== e.pointerId) return;
    s.drag = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (d.moved) {
      s.dragging = false;
      const vel = e.timeStamp - d.lastT > 90 ? 0 : clamp(d.vel, -12, 12);
      s.v = vel;
      commit(snapStop(s.x, vel), 'drag');
      return;
    }
    if (cancelled) return;
    // A tap: rack to the nearest engraved mark under the pointer.
    const g = s.geo;
    const box = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - box.left;
    const rot = -(s.x - 1) * g.dTheta;
    let best = -1;
    let bestDist = g.spacing / 2;
    for (let i = 0; i < STOPS; i++) {
      const mx = g.cx + g.r * Math.sin((i - 1) * g.dTheta + rot);
      const dist = Math.abs(mx - px);
      if (dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    }
    if (best >= 0) commit(best, 'click');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const t = m.current.target;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageUp') next = t + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'PageDown') next = t - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = STOPS - 1;
    if (next === null) return;
    e.preventDefault();
    commit(next, 'key');
  };

  const current = nowSubjects[stop];
  const rmFade = isReduced ? ' rm-crossfade' : '';

  return (
    <section
      id="now"
      ref={sectionRef}
      aria-labelledby={titleId}
      className={`relative w-full ${isReduced ? styles.reduced : ''}`}
      style={isReduced ? undefined : { height: SECTION_H }}
    >
      <h2 id={titleId} className="sr-only-v7">Now</h2>
      <p className="sr-only-v7">{nowIntro}</p>

      <div
        ref={stageRef}
        data-cursor="focus"
        className={`${isReduced ? 'relative min-h-[100svh]' : 'sticky top-0 h-dvh'} w-full overflow-hidden`}
      >
        <div
          ref={sceneRef}
          className="absolute inset-x-0 top-0 flex items-center px-4 md:px-[6vw] pt-[clamp(3.5rem,9vh,6rem)]"
          style={{ bottom: RING_H, transformOrigin: '50% 55%', willChange: isReduced ? undefined : 'transform' }}
        >
          {/* Bottom to top: near, middle, far. DOM order stays near → far for reading. */}
          <div ref={innerRef} className="flex w-full flex-col-reverse gap-[clamp(1rem,3vh,2.25rem)]">
            {nowSubjects.map((s, i) => {
              const d = DEPTH[i];
              const ops = copyOpacities(i);
              const copy = (
                <>
                  <span
                    className="block font-serif font-normal leading-[0.95] tracking-[-0.02em]"
                    style={{ fontSize: d.verb, color: 'var(--mat-ink)' }}
                  >
                    {s.verb}
                  </span>
                  <span
                    className="mt-[0.45em] block max-w-[26ch] font-serif font-normal leading-snug"
                    style={{ fontSize: d.title, color: 'var(--mat-body)' }}
                  >
                    {s.title}
                  </span>
                </>
              );
              return (
                <div
                  key={s.id}
                  ref={(el) => { subjectRefs.current[i] = el; }}
                  className={`${styles.subject} min-w-0`}
                  style={{ marginLeft: d.offset }}
                  data-lock={i === 0 ? 'true' : 'false'}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-current={stop === i ? 'true' : undefined}
                    onClick={() => commit(i, 'click')}
                    className={`${styles.subjectButton} relative grid w-fit max-w-full cursor-pointer text-left`}
                  >
                    <span ref={(el) => { copyRefs.current[i][0] = el; }} className={`${styles.copy}${rmFade}`} style={{ opacity: ops[0] }}>
                      {copy}
                    </span>
                    <span
                      ref={(el) => { copyRefs.current[i][1] = el; }}
                      aria-hidden="true"
                      className={`${styles.copy} ${styles.blur6}${rmFade}`}
                      style={{ opacity: ops[1] }}
                    >
                      {copy}
                    </span>
                    <span
                      ref={(el) => { copyRefs.current[i][2] = el; }}
                      aria-hidden="true"
                      className={`${styles.copy} ${styles.blur12}${rmFade}`}
                      style={{ opacity: ops[2] }}
                    >
                      {copy}
                    </span>
                    <span aria-hidden="true" className={`${styles.ticks}${rmFade}`}>
                      <span className={`${styles.tick} ${styles.tl}`} />
                      <span className={`${styles.tick} ${styles.tr}`} />
                      <span className={`${styles.tick} ${styles.bl}`} />
                      <span className={`${styles.tick} ${styles.br}`} />
                    </span>
                  </button>
                  <div
                    aria-hidden={stop === i ? undefined : 'true'}
                    className={`${styles.details}${rmFade} mt-[clamp(0.75rem,1.8vh,1.25rem)] max-w-[46ch] font-sans text-[0.875rem] leading-[1.5] sm:text-[0.9375rem]`}
                    style={{ color: 'var(--mat-body)', fontWeight: 'var(--mat-body-weight)', letterSpacing: 'var(--mat-tracking)' }}
                  >
                    <p>{s.detail[0]}</p>
                    <p>{s.detail[1]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          ref={ringRef}
          role="slider"
          tabIndex={0}
          aria-label="Focus distance"
          aria-describedby={hintId}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={STOPS - 1}
          aria-valuenow={stop}
          aria-valuetext={`${current.verb}: ${current.title} ${current.distance}`}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => endDrag(e, false)}
          onPointerCancel={(e) => endDrag(e, true)}
          className={`${styles.ring} absolute inset-x-0 bottom-0 cursor-grab active:cursor-grabbing`}
          style={{ height: RING_H, touchAction: 'pan-y' }}
        >
          <LensRing geo={geo} stop={stop} maskId={maskId} rotRef={rotRef} />
        </div>
        <p id={hintId} className="sr-only-v7">
          Left and right arrow keys rack focus between building, researching and exploring. Home and End jump to the nearest and farthest.
        </p>
      </div>
    </section>
  );
};

export default NowSection;
