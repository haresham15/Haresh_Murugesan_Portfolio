import React, { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { useMotionPreference } from '@/components/MotionPreference';
import { PlateStage } from '@/components/plates/PlateStage';
import { LIGHT_PALETTE } from '@/components/plates/stageKit';
import { register, type TaskHandle } from '@/v7/runtime/scheduler';
import { getPointer, subscribePointer } from '@/v7/runtime/pointer';
import { useQualityTier } from '@/v7/runtime/tier';
import { WORKS, type Work } from './content';
import { soundEngine } from '@/lib/soundEngine';
import { TelemetryMetric } from '@/components/ui/TelemetryMetric';
import { viewTransitionStyle } from '@/lib/viewTransitions';
import { Wheel } from './Wheel';
import {
  DETENT, PROJECTS, angleDelta, angleForProject, detentIndex, pinProgress, projectAt, releaseTarget, scrollStop,
  sectorAt, stepWheel, type WheelState,
} from './wheelMath';
import { textReducer } from './textState';
import styles from './works.module.css';

/*
 * Selected Works: a black forged-carbon wheel on the white weave. One angle θ drives
 * everything; see wheelMath.ts for the spring, detent torque, release target and scroll stops.
 */

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const TEXT_TILT = 12; // degrees about the wheel centre
const TEXT_STAGGER = 30; // ms between lines
const TEXT_MS = 520;
const PLATE_FADE_MS = 450;
const RM_FADE_MS = 200;
const DRAG_SLOP = 4; // px before a press becomes a drag
const VELOCITY_WINDOW = 90; // ms of samples used for release velocity
const FOCUS_RING = 'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--mat-accent-mark)]';

/** The lines that turn with the wheel. Each direct child of the column is one line. */
const Lines: React.FC<{ work: Work; ghost?: boolean }> = ({ work, ghost }) => {
  const tab = ghost ? -1 : undefined;
  return (
    <>
      <h3
        className={`m-0 font-serif text-[clamp(2rem,3.4vw,3.5rem)] font-normal leading-[1.02] tracking-tight text-[var(--mat-ink)]`}
        style={viewTransitionStyle(`project-title-${work.slug}`)}
      >
        {work.title}
      </h3>
      <p className={`mt-3 font-serif text-[clamp(1.05rem,1.35vw,1.3rem)] italic leading-snug text-[var(--mat-body)]`}>
        {work.thesis}
      </p>
      {work.role && (
        <p className="mt-2 font-sans text-[13px] leading-snug text-[var(--mat-muted)]">
          <span className="sr-only-v7">Role: </span>
          {work.role}
        </p>
      )}
      <p
        className={`${styles.wide} mt-4 font-sans text-[15px] leading-[1.65] text-[var(--mat-body)]`}
        style={{ fontWeight: 'var(--mat-body-weight)', letterSpacing: 'var(--mat-tracking)' }}
      >
        {work.narrative}
      </p>
      <dl className={`mt-5 grid grid-cols-2 gap-5 border-t border-[var(--mat-rule)] pt-4`}>
        {work.stats.map((s, i) => (
          <div key={s.label} className="min-w-0">
            <dt className="sr-only-v7">{s.label}</dt>
            <dd
              className={`m-0 font-serif text-[28px] leading-none tabular-nums ${i === 0 ? 'text-[var(--mat-accent-mark)]' : 'text-[var(--mat-ink)]'}`}
              style={i === 0 ? viewTransitionStyle(`project-metric-${work.slug}`) : undefined}
            >
              <TelemetryMetric value={s.value} />
            </dd>
            <dd aria-hidden="true" className="m-0 mt-2 font-sans text-[13px] leading-snug text-[var(--mat-muted)]">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
      <p className={`${styles.wide} mt-4 font-sans text-[13px] leading-relaxed text-[var(--mat-muted)]`}>
        {work.stack}
      </p>
      <div className={`mt-3 flex flex-wrap items-center gap-x-6 font-sans text-[14px]`}>
        <Link
          href={`/projects/${work.slug}`}
          tabIndex={tab}
          className={`inline-flex min-h-11 items-center gap-2 text-[var(--mat-accent-text)] transition-colors hover:text-[var(--mat-ink)] ${FOCUS_RING}`}
        >
          Case study <span aria-hidden="true">→</span>
        </Link>
        {work.github && (
          <a
            href={work.github}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tab}
            className={`inline-flex min-h-11 items-center gap-2 text-[var(--mat-muted)] transition-colors hover:text-[var(--mat-ink)] ${FOCUS_RING}`}
          >
            Source <span aria-hidden="true">↗</span>
          </a>
        )}
        {work.live && (
          <a
            href={work.live}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tab}
            className={`inline-flex min-h-11 items-center gap-2 text-[var(--mat-muted)] transition-colors hover:text-[var(--mat-ink)] ${FOCUS_RING}`}
          >
            Live <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </>
  );
};

export const WorksSection: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const tier = useQualityTier();
  const showSpecular = tier === 'full';

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<SVGGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const wheel = useRef<WheelState>({ theta: 0, omega: 0 });
  const target = useRef(0);
  const hand = useRef(0);
  const dragging = useRef(false);
  const lastDetent = useRef(0);
  const lastSector = useRef(0);
  const inputKind = useRef<'touch' | 'other'>('other');
  const stopRef = useRef(0);
  // Set by the pin effect: scroll the page to a project's stop so scroll and wheel agree.
  const syncScrollRef = useRef<((project: number) => void) | null>(null);
  const taskRef = useRef<TaskHandle | null>(null);
  const apexRef = useRef(0);
  const reducedRef = useRef(isReduced);
  const press = useRef<{
    id: number; x: number; y: number; sector: number | null; moved: boolean; last: number;
    samples: { t: number; a: number }[];
  } | null>(null);

  const [radius, setRadius] = useState(400);
  const [mobile, setMobile] = useState(false);
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState<number[]>([0]);
  const [focusVisible, setFocusVisible] = useState(false);
  const [text, dispatch] = useReducer(textReducer, { apexSector: 0, shown: 0, leaving: null, dir: -1, seq: 0 });
  const [activeModes, setActiveModes] = useState<Record<string, string>>(() =>
    Object.fromEntries(WORKS.map((w) => [w.key, w.mode])),
  );
  const actionRefs = useRef<Record<string, { current: ((id: string) => void) | null }>>({});

  const getActionRef = useCallback((key: string) => {
    if (!actionRefs.current[key]) {
      actionRefs.current[key] = { current: null };
    }
    return actionRefs.current[key];
  }, []);

  const setModeForProject = useCallback((projectKey: string, modeId: string) => {
    setActiveModes((prev) => (prev[projectKey] === modeId ? prev : { ...prev, [projectKey]: modeId }));
  }, []);

  const onModeTabKey = useCallback(
    (e: React.KeyboardEvent, modes: { id: string }[], projectKey: string) => {
      const current = activeModes[projectKey] || modes[0].id;
      const idx = modes.findIndex((m) => m.id === current);
      let nextIdx: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIdx = (idx + 1) % modes.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIdx = (idx - 1 + modes.length) % modes.length;
      }
      if (nextIdx !== null) {
        e.preventDefault();
        const nextMode = modes[nextIdx].id;
        setModeForProject(projectKey, nextMode);
        const el = document.getElementById(`mode-tab-${projectKey}-${nextMode}`);
        el?.focus();
      }
    },
    [activeModes, setModeForProject],
  );

  const apex = mobile ? -90 : 0;
  useEffect(() => {
    apexRef.current = apex;
    reducedRef.current = isReduced;
  }, [apex, isReduced]);

  /* ---------- θ → DOM ---------- */

  const apply = useCallback((theta: number) => {
    const el = rotorRef.current;
    if (el) el.style.transform = `rotate(${(apexRef.current + theta).toFixed(3)}deg)`;
  }, []);

  /** Haptics on each notch, and the geared text when the apex sector changes. */
  const afterMove = useCallback((theta: number, dir: number) => {
    const d = detentIndex(theta);
    if (d !== lastDetent.current) {
      lastDetent.current = d;
      if (inputKind.current === 'touch' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(8); } catch { /* not allowed without a gesture */ }
      }
    }
    const sector = sectorAt(theta);
    if (sector !== lastSector.current) {
      lastSector.current = sector;
      dispatch({ type: 'apex', sector, dir: dir || -1, animate: true });
    }
  }, []);

  const goTo = useCallback((next: number, fromScroll = false) => {
    const from = wheel.current.theta;
    target.current = next;
    const project = projectAt(next);
    if (!fromScroll) syncScrollRef.current?.(project);
    setSelected(project);
    setMounted((m) => (m.includes(project) ? m : [...m, project]));
    if (reducedRef.current) {
      wheel.current = { theta: next, omega: 0 };
      apply(next);
      afterMove(next, Math.sign(next - from));
    } else {
      taskRef.current?.wake();
    }
  }, [apply, afterMove]);

  /* ---------- frame loop: one unbudgeted task, asleep when settled ---------- */

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const task = register(({ dt }) => {
      const s = wheel.current;
      const moving = stepWheel(s, dragging.current ? hand.current : target.current, dt / 1000, dragging.current);
      apply(s.theta);
      afterMove(s.theta, Math.sign(s.omega) || Math.sign(target.current - s.theta));
      return moving || dragging.current;
    }, { element: stage, budgeted: false, wakeOnVisible: false });
    taskRef.current = task;
    return () => {
      task.dispose();
      taskRef.current = null;
    };
  }, [apply, afterMove]);

  // Re-apply after the apex moves (phone ↔ desktop) or the motion mode changes.
  useEffect(() => {
    if (isReduced) {
      wheel.current = { theta: target.current, omega: 0 };
      dragging.current = false;
    }
    apply(wheel.current.theta);
  }, [apex, isReduced, apply]);

  /* ---------- layout: radius and breakpoint ---------- */

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect.width / 2;
      if (r > 0) setRadius(r);
    });
    ro.observe(el);
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => setMobile(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', onMq);
    };
  }, []);

  /* ---------- pinned scroll: four stops, ±8% dead band ---------- */

  useEffect(() => {
    if (isReduced) return;
    const read = () => {
      const sec = sectionRef.current;
      const stage = stageRef.current;
      if (!sec || !stage) return null;
      const r = sec.getBoundingClientRect();
      return pinProgress(r.top, r.height, stage.offsetHeight);
    };
    // Land on the stop the page is already at, without spinning.
    const p0 = read() ?? 0;
    const first = Math.min(PROJECTS - 1, Math.floor(p0 * PROJECTS));
    stopRef.current = first;
    if (first !== projectAt(target.current)) {
      const a = angleForProject(target.current, first);
      target.current = a;
      wheel.current = { theta: a, omega: 0 };
      lastDetent.current = detentIndex(a);
      lastSector.current = sectorAt(a);
      apply(a);
      dispatch({ type: 'apex', sector: sectorAt(a), dir: -1, animate: false });
      setSelected(first);
      setMounted((m) => (m.includes(first) ? m : [...m, first]));
    }
    // Scroll wakes a scheduler task: the rect is read in the measure phase, styles are
    // written in the frame, so this never forces a layout between other tasks' writes.
    let measured: number | null = null;
    const onFrame = () => {
      const p = measured;
      measured = null;
      if (p === null) return false;
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      const next = scrollStop(p * PROJECTS, stopRef.current);
      if (next !== stopRef.current) {
        stopRef.current = next;
        if (!dragging.current) {
          inputKind.current = 'other';
          goTo(angleForProject(target.current, next), true);
        }
      }
      return false;
    };
    syncScrollRef.current = (project: number) => {
      const sec = sectionRef.current;
      const stage = stageRef.current;
      if (!sec || !stage) return;
      const r = sec.getBoundingClientRect();
      const runway = r.height - stage.offsetHeight;
      // Only while pinned; outside the pin a choice must not move the page.
      if (runway <= 0 || r.top > 0.5 || r.top < -runway - 0.5) return;
      stopRef.current = project;
      const y = window.scrollY + r.top + ((project + 0.5) / PROJECTS) * runway;
      window.scrollTo({ top: Math.round(y), behavior: 'instant' });
    };
    const scrollTask = register(onFrame, {
      element: sectionRef.current,
      budgeted: false,
      wakeOnVisible: false,
      measure: () => { measured = read(); },
    });
    const onScroll = () => scrollTask.wake();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      scrollTask.dispose();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isReduced, apply, goTo]);

  /* ---------- specular arc follows the pointer angle (full tier only) ---------- */

  useEffect(() => {
    if (!showSpecular) return;
    const el = wheelRef.current;
    if (!el) return;
    // Pointer steps wake a task: the wheel rect is read in the measure phase, never
    // between other tasks' style writes.
    let rect: DOMRect | null = null;
    const task = register(() => {
      const g = specRef.current;
      const r = rect;
      rect = null;
      if (!g || !r) return false;
      const p = getPointer();
      const live = p.inside && p.kind !== 'touch';
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Idle: the key light sits above the apex, as on the nav rim.
      const phi = live ? (Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI : apexRef.current - 40;
      g.setAttribute('transform', `rotate(${phi.toFixed(2)})`);
      g.style.opacity = live ? '1' : '0.5';
      return false;
    }, { element: el, budgeted: false, measure: () => { rect = el.getBoundingClientRect(); } });
    const off = subscribePointer(() => task.wake());
    return () => {
      off();
      task.dispose();
    };
  }, [showSpecular]);

  /* ---------- pointer: click a tab, or drag by angle about the centre ---------- */

  const pointerAngle = (e: React.PointerEvent) => {
    const r = wheelRef.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const hit = (e.target as Element).closest('[data-sector]');
    press.current = {
      id: e.pointerId, x: e.clientX, y: e.clientY, sector: hit ? Number(hit.getAttribute('data-sector')) : null,
      moved: false, last: pointerAngle(e), samples: [],
    };
    inputKind.current = e.pointerType === 'touch' ? 'touch' : 'other';
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const pr = press.current;
    if (!pr || pr.id !== e.pointerId) return;
    if (!pr.moved) {
      if (Math.hypot(e.clientX - pr.x, e.clientY - pr.y) < DRAG_SLOP) return;
      pr.moved = true;
      dragging.current = true;
      hand.current = wheel.current.theta;
    }
    const a = pointerAngle(e);
    hand.current += angleDelta(a, pr.last);
    pr.last = a;
    pr.samples.push({ t: e.timeStamp, a: hand.current });
    while (pr.samples.length > 2 && e.timeStamp - pr.samples[0].t > VELOCITY_WINDOW) pr.samples.shift();
    if (reducedRef.current) {
      wheel.current = { theta: hand.current, omega: 0 };
      apply(hand.current);
      afterMove(hand.current, -1);
    } else {
      taskRef.current?.wake();
    }
  };

  const release = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const pr = press.current;
    if (!pr || pr.id !== e.pointerId) return;
    press.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!pr.moved) {
      if (!cancelled && pr.sector !== null) goTo(angleForProject(target.current, pr.sector % PROJECTS));
      return;
    }
    dragging.current = false;
    let omega = 0;
    const recent = pr.samples.filter((s) => e.timeStamp - s.t <= VELOCITY_WINDOW);
    if (!cancelled && !reducedRef.current && recent.length >= 2) {
      const a = recent[0];
      const b = recent[recent.length - 1];
      if (b.t > a.t) omega = ((b.a - a.a) / (b.t - a.t)) * 1000;
    }
    goTo(releaseTarget(wheel.current.theta, omega));
  };

  /* ---------- keys on the tablist ---------- */

  // preventScroll: the tabs are visually hidden; focusing must not scroll the pinned page.
  const focusTab = (project: number) => tabRefs.current[project]?.focus({ preventScroll: true });
  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = target.current - DETENT;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = target.current + DETENT;
    else if (e.key === 'Home') next = angleForProject(target.current, 0);
    else if (e.key === 'End') next = angleForProject(target.current, PROJECTS - 1);
    if (next === null) return;
    e.preventDefault();
    inputKind.current = 'other';
    goTo(next);
    focusTab(projectAt(next));
  };

  /* ---------- text turns about the wheel centre ---------- */

  useLayoutEffect(() => {
    if (text.seq === 0) return;
    const el = wheelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pivot = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    const reduced = reducedRef.current;
    // Read every line box before writing any style, so the turn costs one layout, not one per line.
    const measure = (root: HTMLElement | null) =>
      root ? Array.from(root.children).map((node) => ({ line: node as HTMLElement, box: node.getBoundingClientRect() })) : [];
    const incomingLines = measure(columnRef.current);
    const outgoingLines = text.leaving ? measure(ghostRef.current) : [];
    const run = (items: { line: HTMLElement; box: DOMRect }[], entering: boolean, dir: number) => {
      return items.map(({ line, box }, i) => {
        line.style.transformOrigin = `${(pivot.x - box.left).toFixed(1)}px ${(pivot.y - box.top).toFixed(1)}px`;
        const turned = `rotate(${(entering ? -TEXT_TILT : TEXT_TILT) * dir}deg)`;
        const frames: Keyframe[] = reduced
          ? [{ opacity: entering ? 0 : 1 }, { opacity: entering ? 1 : 0 }]
          : entering
            ? // Incoming copy stays clear until the outgoing lines have mostly faded.
              [{ transform: turned, opacity: 0 }, { opacity: 0, offset: 0.3 }, { transform: 'rotate(0deg)', opacity: 1 }]
            : [{ transform: 'rotate(0deg)', opacity: 1 }, { opacity: 0, offset: 0.4 }, { transform: turned, opacity: 0 }];
        return line.animate(frames, {
          duration: reduced ? RM_FADE_MS : TEXT_MS,
          delay: reduced ? 0 : i * TEXT_STAGGER,
          easing: reduced ? 'linear' : EASE,
          fill: entering ? 'backwards' : 'forwards',
        });
      });
    };
    const incoming = run(incomingLines, true, text.dir);
    const leaving = text.leaving;
    const outgoing = leaving ? run(outgoingLines, false, leaving.dir) : [];
    const last = outgoing[outgoing.length - 1];
    let alive = true;
    if (last && leaving) last.finished.then(() => { if (alive) dispatch({ type: 'settled', id: leaving.id }); }, () => {});
    return () => {
      alive = false;
      incoming.forEach((a) => a.cancel());
      outgoing.forEach((a) => a.cancel());
    };
    // Runs once per turn of the copy; clearing `leaving` afterwards must not replay it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text.seq]);

  const shownWork = WORKS[text.shown];
  const leavingWork = text.leaving ? WORKS[text.leaving.project] : null;
  const fade = isReduced ? RM_FADE_MS : PLATE_FADE_MS;

  useEffect(() => {
    soundEngine.playMechanicalTick();
  }, [text.shown]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="works-heading"
      className={`${styles.section} ${isReduced ? '' : styles.pinned}`}
    >
      <div ref={stageRef} className={styles.stage}>
        <h2 id="works-heading" className="sr-only-v7">Selected Works</h2>
        <p className="sr-only-v7">
          Four flagship projects on a wheel. Choose a project tab and use the arrow keys, Home and End, or drag the wheel or scroll to turn it.
        </p>

        {/* Tactile Keycap HUD Bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none flex items-center gap-2 mb-3 text-[11px] font-mono text-[var(--mat-muted)]"
        >
          <span className="px-1.5 py-0.5 text-[10px] font-mono border border-[var(--mat-rule-strong,rgba(200,210,224,0.20))] text-[var(--mat-ink)] rounded-[2px] bg-[var(--mat-surface,#060A12)]/50">
            [←]
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-mono border border-[var(--mat-rule-strong,rgba(200,210,224,0.20))] text-[var(--mat-ink)] rounded-[2px] bg-[var(--mat-surface,#060A12)]/50">
            [→]
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono border border-[var(--mat-rule-strong,rgba(200,210,224,0.18))] text-[var(--mat-muted)] rounded-[2px] bg-[var(--mat-surface,#060A12)]/50">
            [DRAG · TURN]
          </span>
        </div>

        <div
          ref={wheelRef}
          className={styles.wheel}
          data-material="dark"
          data-cursor="wheel"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => release(e, false)}
          onPointerCancel={(e) => release(e, true)}
          onLostPointerCapture={(e) => release(e, true)}
        >
          <Wheel
            radius={radius}
            mobile={mobile}
            apex={apex}
            labels={WORKS}
            activeSector={text.apexSector}
            focusVisible={focusVisible}
            showSpecular={showSpecular}
            rotorRef={rotorRef}
            specRef={specRef}
          />
        </div>

        <div role="tablist" aria-label="Selected works" aria-orientation={mobile ? 'horizontal' : 'vertical'} className="sr-only-v7" onKeyDown={onTabKey}>
          {WORKS.map((w, i) => (
            <button
              key={w.key}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`works-tab-${w.key}`}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-controls="works-panel"
              tabIndex={i === selected ? 0 : -1}
              onClick={() => { inputKind.current = 'other'; goTo(angleForProject(target.current, i)); }}
              onFocus={(e) => setFocusVisible(e.currentTarget.matches(':focus-visible'))}
              onBlur={() => setFocusVisible(false)}
            >
              {w.index} {w.title}
            </button>
          ))}
        </div>

        <div id="works-panel" role="tabpanel" aria-labelledby={`works-tab-${WORKS[selected].key}`}>
          <div className={styles.details}>
            <div ref={columnRef} key={`shown-${text.shown}-${text.seq}`} className={styles.column}>
              <Lines work={shownWork} />
            </div>
            {leavingWork && text.leaving && (
              <div ref={ghostRef} key={`ghost-${text.leaving.id}`} className={styles.ghost} aria-hidden="true" inert>
                <Lines work={leavingWork} ghost />
              </div>
            )}
          </div>

          <div className={styles.plate}>
            {WORKS.map((w, i) => {
              if (!mounted.includes(i)) return null;
              const on = i === selected;
              const currentMode = activeModes[w.key] || w.mode;
              const currentActionRef = getActionRef(w.key);

              return (
                <div
                  key={w.key}
                  className={`${styles.plateLayer} rm-crossfade`}
                  style={{ opacity: on ? 1 : 0, transitionDuration: `${fade}ms`, pointerEvents: on ? 'auto' : 'none' }}
                  aria-hidden={!on}
                >
                  <div className={styles.modelBar}>
                    <div
                      role="tablist"
                      aria-label={`${w.title} simulation models`}
                      className={styles.modelTabs}
                    >
                      {w.plate.modes.map((m) => {
                        const isCurrent = m.id === currentMode;
                        return (
                          <button
                            key={m.id}
                            id={`mode-tab-${w.key}-${m.id}`}
                            type="button"
                            role="tab"
                            aria-selected={isCurrent}
                            aria-controls={`plate-stage-${w.key}`}
                            tabIndex={on ? (isCurrent ? 0 : -1) : -1}
                            onClick={() => setModeForProject(w.key, m.id)}
                            onKeyDown={(e) => onModeTabKey(e, w.plate.modes, w.key)}
                            className={`${styles.modelTab} ${isCurrent ? styles.modelTabActive : ''} ${FOCUS_RING}`}
                          >
                            <span>{m.label}</span>
                            {isCurrent && (
                              <span className={styles.modelTabIndicator} aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {w.plate.actions?.map((a) => {
                      if (a.modes && !a.modes.includes(currentMode)) return null;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          tabIndex={on ? 0 : -1}
                          onClick={() => currentActionRef.current?.(a.id)}
                          className={`${styles.modelAction} ${FOCUS_RING}`}
                        >
                          {a.label}
                        </button>
                      );
                    })}
                  </div>

                  <PlateStage
                    definition={w.plate}
                    systemKey={w.key}
                    modeId={currentMode}
                    reduced={isReduced}
                    palette={LIGHT_PALETTE}
                    active={on}
                    introRate={1.8}
                    role="tabpanel"
                    panelId={`plate-stage-${w.key}`}
                    labelledBy={`mode-tab-${w.key}-${currentMode}`}
                    actionRef={currentActionRef}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {!isReduced && (
          <div className={styles.progress} aria-hidden="true">
            <div ref={progressRef} className={styles.progressFill} />
          </div>
        )}
      </div>
    </section>
  );
};

export default WorksSection;
