import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMotionPreference } from '../MotionPreference';
import { experiences } from '../../content/experience';
import { register } from '@/v7/runtime/scheduler';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------------- */
/* Stations: every fact comes from src/content/experience.ts                  */
/* ------------------------------------------------------------------------- */

// HUD labels only (abbreviations of the content's company names).
const SHORT_LABEL: Record<string, string> = {
  'cas-2026': 'CAS',
  'osu-pathology-research': 'OSU',
  'cis-honda-99p': 'CIS',
  'philocracy-leadership': 'Philocracy',
  'syntinuum-podcast': 'Syntinuum',
};

export interface CircuitStation {
  id: string;
  numeral: string;
  short: string;
  period: string;
  company: string;
  team?: string;
  role: string;
  point: string;
  stack: string[];
  lane: 'upper' | 'lower';
}

export const STATIONS: CircuitStation[] = experiences.map((e, i) => ({
  id: e.id,
  numeral: String(i + 1).padStart(2, '0'),
  short: SHORT_LABEL[e.id] ?? e.company.split(' ')[0],
  period: e.period,
  company: e.company,
  team: e.teamOrDivision,
  role: e.role,
  point: e.bullets[0] ?? '',
  stack: e.skillsDemonstrated.slice(0, 5),
  lane: i % 2 === 0 ? 'upper' : 'lower',
}));

/* ------------------------------------------------------------------------- */
/* Track geometry in design units (x: 0..6000, lanes at y 300 / 740)         */
/* ------------------------------------------------------------------------- */

const ENTRY_X = 830; // vertical entry straight
const CORNER_IN_Y = 290; // where turn 1 begins
const XA = 1080; // turn 1 exit: start of the horizontal phase
const YA = 540;
const FIRST_APEX = 1500;
const APEX_SPACING = 880;
const UPPER_Y = 300;
const LOWER_Y = 740;
const EXIT_X_OFFSET = 580; // last apex -> exit straight
const EXIT_Y = 800;
// Pull some apexes toward the centre line so no two corners repeat.
const APEX_TWEAK = [0, 22, 12, 30, 8, 18, 4];

type Knot = { x: number; y: number; m: number };

// Transition shapes between apexes. Each one is a different corner character:
// a late, steep plunge with compression (Eau Rouge), a long esses flick, a
// fast kink, and a progressive climb. Fractions are of the apex-to-apex span.
const TRANSITIONS = [
  { f1: 0.26, e1: 0.06, fm: 0.47, ym: 0.58, sm: 1.9, f2: 0.63, e2: 0.14 },
  { f1: 0.2, e1: 0.1, fm: 0.42, ym: 0.46, sm: 1.45, f2: 0.72, e2: 0.07 },
  { f1: 0.3, e1: 0.05, fm: 0.5, ym: 0.54, sm: 1.75, f2: 0.68, e2: 0.1 },
  { f1: 0.22, e1: 0.09, fm: 0.4, ym: 0.42, sm: 1.35, f2: 0.66, e2: 0.12 },
];

function apexY(i: number) {
  const lane = i % 2 === 0 ? UPPER_Y : LOWER_Y;
  const tweak = APEX_TWEAK[i % APEX_TWEAK.length];
  return lane === UPPER_Y ? lane + tweak : lane - tweak;
}

function transitionKnots(ax: number, ay: number, bx: number, by: number, v: number): Knot[] {
  const s = TRANSITIONS[v % TRANSITIONS.length];
  const dx = bx - ax;
  const dy = by - ay;
  const g = dy / dx;
  const midSlope = (s.sm * dy * (1 - s.e1 - s.e2)) / (dx * (s.f2 - s.f1));
  return [
    { x: ax + s.f1 * dx, y: ay + s.e1 * dy, m: g * 0.45 },
    { x: ax + s.fm * dx, y: ay + s.ym * dy, m: midSlope },
    { x: ax + s.f2 * dx, y: by - s.e2 * dy, m: g * 0.4 },
  ];
}

function buildKnots(n: number) {
  const knots: Knot[] = [{ x: XA, y: YA, m: 0 }];
  const apexIdx: number[] = [];
  // Lead-in from turn 1 into the first apex (short, punchy climb).
  let px = XA;
  let py = YA;
  for (let i = 0; i < n; i++) {
    const ax = FIRST_APEX + i * APEX_SPACING;
    const ay = apexY(i);
    knots.push(...transitionKnots(px, py, ax, ay, i === 0 ? 3 : i - 1));
    apexIdx.push(knots.length);
    knots.push({ x: ax, y: ay, m: 0 });
    px = ax;
    py = ay;
  }
  // Turn 6 entry: the track leaves the last apex already falling away.
  const lastUpper = (n - 1) % 2 === 0;
  const xb = px + 280;
  const yb = lastUpper ? py + 90 : py - 40;
  knots.push({ x: xb, y: yb, m: lastUpper ? 0.55 : -0.15 });
  return { knots, apexIdx, xb, yb, exitX: px + EXIT_X_OFFSET };
}

const TRACK = buildKnots(STATIONS.length);

/* ------------------------------------------------------------------------- */
/* Layout: geometry mapped to pixels with uniform stroke + car scale          */
/* ------------------------------------------------------------------------- */

interface Layout {
  vw: number;
  H: number;
  docked: boolean;
  kx: number;
  ox: number;
  ya: number;
  yb: number;
  W: number;
  M: number;
  r: number;
  xaPx: number;
  xbPx: number;
  sw: number;
  scale: number;
  hudBottom: number;
  footerTop: number;
  d: string;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const fmt = (n: number) => n.toFixed(1);

function computeLayout(vw: number, H: number, hudBottom: number, footerTop: number): Layout {
  const docked = vw < 820 || H > vw * 1.15;
  const sw = docked ? Math.min(vw - 48, 420) : clamp(vw * 0.3, 280, 440);
  const scale = docked ? 0.62 : 1;
  const kx = docked ? Math.max((sw + 40) / APEX_SPACING, (vw * 4.2) / 6000) : (vw * 4.2) / 6000;
  const aS = (docked ? 0.86 : 0.66) * vw; // car screen x when the pan starts
  const aE = (docked ? 0.42 : 0.5) * vw; // car screen x when the pan ends
  const ox = aS - XA * kx;
  const X = (x: number) => ox + x * kx;
  const xaPx = X(XA);
  const xbPx = X(TRACK.xb);
  const M = Math.max(1, xbPx - aE);
  const W = M + vw;

  const half = 37 * scale;
  const upperPx = hudBottom + half + (docked ? 22 : 26);
  const lowerPx = docked
    ? upperPx + clamp(H * 0.24, 150, 240)
    : Math.max(upperPx + 200, Math.min(footerTop - half - 28, upperPx + H * 0.52));
  const yb = (lowerPx - upperPx) / (LOWER_Y - UPPER_Y);
  const ya = upperPx - UPPER_Y * yb;
  const Y = (y: number) => ya + y * yb;

  // Turn 1: vertical entry from above the viewport into a 90deg bank.
  const ex = X(ENTRY_X);
  const ciy = Y(CORNER_IN_Y);
  const ax = X(XA);
  const ay = Y(YA);
  const parts: string[] = [
    `M ${fmt(ex)} -80`,
    `L ${fmt(ex)} ${fmt(ciy)}`,
    `C ${fmt(ex)} ${fmt(ciy + 0.56 * (ay - ciy))} ${fmt(ax - 0.56 * (ax - ex))} ${fmt(ay)} ${fmt(ax)} ${fmt(ay)}`,
  ];
  // Horizontal phase: x-monotone cubic Hermite segments.
  const k = TRACK.knots;
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i];
    const b = k[i + 1];
    const dx = b.x - a.x;
    const c1x = X(a.x + dx / 3);
    const c1y = Y(a.y + (a.m * dx) / 3);
    const c2x = X(b.x - dx / 3);
    const c2y = Y(b.y - (b.m * dx) / 3);
    parts.push(`C ${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(X(b.x))} ${fmt(Y(b.y))}`);
  }
  // Turn 6: right-to-down exit, then straight out the bottom.
  const bx = X(TRACK.xb);
  const by = Y(TRACK.yb);
  const last = k[k.length - 1];
  const xx = X(TRACK.exitX);
  const xy = Y(EXIT_Y);
  // Leave turn-6 entry along the last knot's tangent (converted to pixel space).
  const lead = 0.5 * (xx - bx);
  const tdx = kx;
  const tdy = last.m * yb;
  const tlen = Math.hypot(tdx, tdy);
  parts.push(
    `C ${fmt(bx + (lead * tdx) / tlen)} ${fmt(by + (lead * tdy) / tlen)} ${fmt(xx)} ${fmt(xy - 0.5 * (xy - by))} ${fmt(xx)} ${fmt(xy)}`,
    `L ${fmt(xx)} ${fmt(H + 80)}`
  );

  return { vw, H, docked, kx, ox, ya, yb, W, M, r: (docked ? 0.03 : 0.06) * vw, xaPx, xbPx, sw, scale, hudBottom, footerTop, d: parts.join(' ') };
}

// C1 soft clamp of x into [0, M]: quadratic ease in/out of width 2r at both ends.
function softClamp(x: number, M: number, r: number) {
  const f = (y: number) => (y <= 0 ? 0 : y < 2 * r ? (y * y) / (4 * r) : y - r);
  return f(x) - f(x - M);
}

// Monotone cubic Hermite (Fritsch-Butland tangents), with per-knot tangent scale.
function monotoneSpline(xs: number[], ys: number[], tScale: number[]) {
  const n = xs.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m: number[] = new Array(n);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    m[i] = d[i - 1] * d[i] <= 0 ? 0 : 2 / (1 / d[i - 1] + 1 / d[i]);
  }
  for (let i = 0; i < n; i++) m[i] *= tScale[i] ?? 1;
  return (x: number) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (i < n - 2 && x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
}

interface Geo {
  L: number;
  apexS: number[];
  apexP: number[];
  sOfP: (p: number) => number;
  cameraOfX: (x: number) => number;
  layout: Layout;
}

const P_ENTRY = 0.08;
const P_EXIT = 0.92;

function scrollToY(y: number, instant: boolean) {
  const lenis = (window as unknown as { __singleClock?: { getLenis?: () => { scrollTo: (y: number, o: object) => void } | null } })
    .__singleClock?.getLenis?.();
  if (lenis) lenis.scrollTo(y, { immediate: instant });
  else window.scrollTo({ top: y, behavior: instant ? 'instant' : 'smooth' });
}

/* ------------------------------------------------------------------------- */
/* Animated circuit                                                           */
/* ------------------------------------------------------------------------- */

const CircuitStage: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);
  const curbRefs = useRef<(SVGPathElement | null)[]>([]);
  const leaderRefs = useRef<(SVGLineElement | null)[]>([]);
  const leaderDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carRef = useRef<SVGGElement>(null);
  const flameOuterRef = useRef<SVGPathElement>(null);
  const flameInnerRef = useRef<SVGPathElement>(null);
  const brakeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const vortexRefs = useRef<(SVGLineElement | null)[]>([]);

  const [layout, setLayout] = useState<Layout | null>(null);
  const [fontsVersion, setFontsVersion] = useState(0);
  // Sampling the track is expensive (getPointAtLength walks the whole path each call);
  // build it only once the section is within 1.5 viewports, not at page load.
  const [near, setNear] = useState(false);
  const [activeSector, setActiveSector] = useState(0);
  const geoRef = useRef<Geo | null>(null);

  const kin = useRef({
    init: false,
    p: 0,
    s: 0,
    sPrev: 0,
    v: 0,
    angle: 0,
    flame: 0,
    brake: 0,
    accel: 0,
    cam: 0,
    camV: 0,
    spring: false,
    lastT: 0,
    active: 0,
    wrap: null as null | { t0: number; dur: number; sStart: number; sTarget: number; pTarget: number },
  });

  /* ---- measure viewport + HUD, derive pixel layout ---- */
  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const hud = hudRef.current;
    const footer = footerRef.current;
    if (!vp || !hud || !footer) return;
    const vr = vp.getBoundingClientRect();
    const vw = Math.round(vr.width);
    const H = Math.round(vr.height);
    if (vw < 10 || H < 10) return;
    const hudBottom = Math.round(hud.getBoundingClientRect().bottom - vr.top);
    const footerTop = Math.round(footer.getBoundingClientRect().top - vr.top);
    setLayout((prev) =>
      prev && prev.vw === vw && prev.H === H && prev.hudBottom === hudBottom && prev.footerTop === footerTop
        ? prev
        : computeLayout(vw, H, hudBottom, footerTop)
    );
  }, []);

  useEffect(() => {
    measure();
    const vp = viewportRef.current;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    if (vp) ro.observe(vp);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      measure();
      setFontsVersion((v) => v + 1);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || near) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: '150% 0px 150% 0px' });
    io.observe(section);
    return () => io.disconnect();
  }, [near]);

  /* ---- sample the real path, place curbs + stations from its geometry ---- */
  useIsoLayoutEffect(() => {
    const path = pathRef.current;
    if (!layout || !path || !near) return;
    const { kx, ox, ya, yb, sw, scale, docked, hudBottom, footerTop, M, r, xaPx, xbPx, vw } = layout;
    const X = (x: number) => ox + x * kx;
    const Y = (y: number) => ya + y * yb;

    const L = path.getTotalLength();
    const step = 8;
    const n = Math.ceil(L / step) + 1;
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const q = path.getPointAtLength(Math.min(L, i * step));
      xs[i] = q.x;
      ys[i] = q.y;
    }
    const nearestS = (px: number, py: number, from = 0, to = n - 1) => {
      let best = from;
      let bd = Infinity;
      for (let i = from; i <= to; i++) {
        const dd = (xs[i] - px) ** 2 + (ys[i] - py) ** 2;
        if (dd < bd) {
          bd = dd;
          best = i;
        }
      }
      return best;
    };
    const heading = (i: number) => {
      const a = Math.max(0, i - 1);
      const b = Math.min(n - 1, i + 1);
      return Math.atan2(ys[b] - ys[a], xs[b] - xs[a]);
    };

    const iA = nearestS(X(XA), Y(YA));
    const iB = nearestS(X(TRACK.xb), Y(TRACK.yb), iA);
    const iExit = nearestS(X(TRACK.exitX), Y(EXIT_Y), iB);
    const apexI = TRACK.apexIdx.map((ki) => nearestS(X(TRACK.knots[ki].x), Y(TRACK.knots[ki].y), iA, iB));
    const apexS = apexI.map((i) => i * step);
    const sA = iA * step;
    const sB = iB * step;

    // Scroll -> arc length. Phase 2 time is split by arc length plus a dwell
    // bonus per apex; tangents at apexes are cut so the car brakes in and
    // accelerates out instead of moving at constant speed.
    const segS = [sA, ...apexS, sB];
    const lens = segS.slice(1).map((s, i) => s - segS[i]);
    const dwell = 0.3 * (lens.reduce((a, b) => a + b, 0) / lens.length);
    const weights = lens.map((len, i) => len + dwell * ((i > 0 ? 1 : 0) + (i < lens.length - 1 ? 1 : 0)));
    const wSum = weights.reduce((a, b) => a + b, 0);
    const pK = [0, P_ENTRY];
    let acc = P_ENTRY;
    weights.forEach((w) => {
      acc += (w / wSum) * (P_EXIT - P_ENTRY);
      pK.push(acc);
    });
    pK[pK.length - 1] = P_EXIT;
    pK.push(1);
    const sK = [0, ...segS, L];
    const tScale = sK.map((_, i) => (i >= 2 && i < sK.length - 2 ? 0.45 : 1));
    const sOfP = monotoneSpline(pK, sK, tScale);
    const apexP = pK.slice(2, 2 + apexS.length);

    const kf = (M + 2 * r) / Math.max(1, xbPx - xaPx);
    const cameraOfX = (x: number) => softClamp((x - xaPx) * kf, M, r);

    // Apex curbs on the inside of each corner, as offset sub-paths.
    const curbApexes: { i: number; reach: number }[] = [];
    {
      let best = 0;
      let bd = Infinity;
      for (let i = 0; i <= iA; i++) {
        const d = Math.abs(heading(i) - Math.PI / 4);
        if (ys[i] > 0 && d < bd) {
          bd = d;
          best = i;
        }
      }
      curbApexes.push({ i: best, reach: 95 * scale });
    }
    apexI.forEach((i) => curbApexes.push({ i, reach: 70 * scale }));
    {
      const target = (heading(iB) + Math.PI / 2) / 2;
      let best = iB;
      let bd = Infinity;
      for (let i = iB; i <= iExit; i++) {
        const d = Math.abs(heading(i) - target);
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      curbApexes.push({ i: best, reach: 95 * scale });
    }
    const curbOffset = 27 * scale;
    curbApexes.forEach(({ i, reach }, ci) => {
      const span = Math.round(reach / step);
      const a = Math.max(1, i - span);
      const b = Math.min(n - 2, i + span);
      let turn = heading(b) - heading(a);
      while (turn > Math.PI) turn -= 2 * Math.PI;
      while (turn < -Math.PI) turn += 2 * Math.PI;
      const side = turn >= 0 ? 1 : -1;
      const pts: string[] = [];
      for (let j = a; j <= b; j++) {
        const h = heading(j);
        const nx = -Math.sin(h) * side;
        const ny = Math.cos(h) * side;
        pts.push(`${fmt(xs[j] + nx * curbOffset)} ${fmt(ys[j] + ny * curbOffset)}`);
      }
      const d = `M ${pts.join(' L ')}`;
      [curbRefs.current[ci * 2], curbRefs.current[ci * 2 + 1]].forEach((el) => el?.setAttribute('d', d));
    });

    // Stations: width first, then height, then position from the sampled track
    // (min/max track y across the station's horizontal span, plus the halo).
    const halfHalo = 37 * scale;
    const clear = halfHalo + (docked ? 16 : 18);
    const spanAt = (left: number) => {
      let lo = Infinity;
      let hi = -Infinity;
      for (let i = 0; i < n; i++) {
        if (xs[i] > left - halfHalo - 10 && xs[i] < left + sw + halfHalo + 10) {
          lo = Math.min(lo, ys[i]);
          hi = Math.max(hi, ys[i]);
        }
      }
      return { left, lo, hi };
    };
    const spans = STATIONS.map((st, idx) => {
      const apexX = xs[apexI[idx]];
      if (docked) return spanAt(cameraOfX(apexX) + (vw - sw) / 2);
      // Slide the station around its apex to where the track leaves most room.
      const below = st.lane === 'upper';
      let best = spanAt(apexX - sw / 2);
      let bestScore = Infinity;
      for (const f of [0.5, 0.38, 0.62, 0.26, 0.74]) {
        const sp = spanAt(apexX - sw * f);
        const score = (below ? sp.hi : -sp.lo) + Math.abs(f - 0.5) * 120;
        if (score < bestScore) {
          bestScore = score;
          best = sp;
        }
      }
      return best;
    });
    // Docked (phone / portrait): one shared baseline so stations don't hop.
    const dockedHi = Math.max(...spans.map((sp) => sp.hi));
    STATIONS.forEach((st, idx) => {
      const el = stationRefs.current[idx];
      if (!el) return;
      const apexX = xs[apexI[idx]];
      const apexYpx = ys[apexI[idx]];
      const below = docked || st.lane === 'upper';
      const { left, lo } = spans[idx];
      const hi = docked ? dockedHi : spans[idx].hi;
      el.style.width = `${sw}px`;
      el.style.left = `${fmt(left)}px`;

      const place = () => {
        const h = el.offsetHeight;
        return { h, top: below ? hi + clear : lo - clear - h };
      };
      el.dataset.compact = 'false';
      let { h, top } = place();
      const fits = (t: number, hh: number) => (below ? t + hh <= footerTop - 8 : t >= hudBottom + 8);
      if (!fits(top, h)) {
        el.dataset.compact = 'true';
        ({ h, top } = place());
      }
      el.style.top = `${fmt(top)}px`;
      el.dataset.dir = below ? '1' : '-1';

      // Leader from the track edge to the station edge, at the apex.
      const line = leaderRefs.current[idx];
      const dot = leaderDotRefs.current[idx];
      const inSpan = apexX > left + 6 && apexX < left + sw - 6;
      const y1 = below ? apexYpx + 37 * scale + 4 : apexYpx - 37 * scale - 4;
      const y2 = below ? top - 6 : top + h + 6;
      if (line) {
        line.setAttribute('x1', fmt(apexX));
        line.setAttribute('x2', fmt(apexX));
        line.setAttribute('y1', fmt(y1));
        line.setAttribute('y2', fmt(y2));
        line.style.display = inSpan && (below ? y2 > y1 : y2 < y1) ? '' : 'none';
      }
      if (dot) {
        dot.setAttribute('cx', fmt(apexX));
        dot.setAttribute('cy', fmt(y1));
        dot.style.display = inSpan ? '' : 'none';
      }
    });

    trailRefs.current.forEach((el) => {
      if (!el) return;
      el.style.strokeDasharray = `${L} ${L + 20}`;
      el.style.strokeDashoffset = `${L}`;
    });
    path.setAttribute('data-half', fmt(37 * scale));

    geoRef.current = { L, apexS, apexP, sOfP, cameraOfX, layout };
    kin.current.init = false;
  }, [layout, fontsVersion, near]);

  /* ---- frame loop (paused offscreen) ---- */
  useEffect(() => {
    const tick = (now: number) => {
      const k = kin.current;
      const geo = geoRef.current;
      const section = sectionRef.current;
      const path = pathRef.current;
      const world = worldRef.current;
      const car = carRef.current;
      if (!geo || !section || !path || !world || !car) return;
      const { layout: lay, L } = geo;

      const dt = k.lastT ? clamp((now - k.lastT) / 1000, 1 / 240, 0.1) : 1 / 60;
      k.lastT = now;

      const rect = section.getBoundingClientRect();
      const runway = Math.max(1, rect.height - lay.H);
      const raw = clamp(-rect.top / runway, 0, 1);

      // The sector bar belongs to the pinned stage: fade it out as the pin releases,
      // so it never rides up over the next section.
      const footerEl = footerRef.current;
      if (footerEl) {
        const vh = window.innerHeight;
        const hudOpacity = clamp((rect.bottom - vh) / (0.12 * vh), 0, 1) * clamp((vh - rect.top) / (0.12 * vh), 0, 1);
        footerEl.style.opacity = hudOpacity.toFixed(3);
        footerEl.style.visibility = hudOpacity < 0.01 ? 'hidden' : 'visible';
      }

      if (!k.init) {
        k.init = true;
        k.p = raw;
        k.s = geo.sOfP(raw);
        k.sPrev = k.s;
        k.cam = geo.cameraOfX(path.getPointAtLength(k.s).x);
        k.angle = NaN;
      }

      // Frame-rate independent damping: 1 - (1 - 0.11)^(dt * 60)
      const alpha = 1 - Math.pow(1 - 0.11, dt * 60);
      let s: number;
      let wrapping = false;
      if (k.wrap) {
        const w = k.wrap;
        const gap = 0.35 * lay.vw; // off-screen distance between laps
        const total = L - w.sStart + gap + w.sTarget;
        const u = clamp((now - w.t0) / w.dur, 0, 1);
        const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const dist = e * total;
        if (dist < L - w.sStart) s = w.sStart + dist;
        else if (dist < L - w.sStart + gap) s = L;
        else s = dist - (L - w.sStart + gap);
        wrapping = true;
        if (u >= 1) {
          k.wrap = null;
          k.p = w.pTarget;
          s = w.sTarget;
        }
      } else {
        k.p += (raw - k.p) * alpha;
        if (Math.abs(raw - k.p) < 1e-5) k.p = raw;
        s = geo.sOfP(k.p);
      }

      // Arc-length velocity (px/s), ignoring the lap seam.
      const ds = s - k.sPrev;
      const vInst = Math.abs(ds) > L / 2 ? k.v : ds / dt;
      const vPrev = k.v;
      k.v += (vInst - k.v) * (1 - Math.exp(-dt * 10));
      k.accel += ((k.v - vPrev) / dt - k.accel) * (1 - Math.exp(-dt * 8));
      k.sPrev = s;
      k.s = s;

      const pt = path.getPointAtLength(s);
      const pa = path.getPointAtLength(Math.max(0, s - 3));
      const pb = path.getPointAtLength(Math.min(L, s + 3));
      const raw0 = (Math.atan2(pb.y - pa.y, pb.x - pa.x) * 180) / Math.PI;
      if (Number.isNaN(k.angle)) k.angle = raw0;
      let dA = raw0 - k.angle;
      while (dA > 180) dA -= 360;
      while (dA < -180) dA += 360;
      k.angle += dA;

      // Camera: follows the car x; springs only to absorb the lap seam.
      const camTarget = geo.cameraOfX(pt.x);
      if (wrapping) k.spring = true;
      if (k.spring) {
        const w0 = 11;
        const a = w0 * w0 * (camTarget - k.cam) - 2 * w0 * k.camV;
        k.camV += a * dt;
        k.cam += k.camV * dt;
        if (!wrapping && Math.abs(camTarget - k.cam) < 0.5 && Math.abs(k.camV) < 2) {
          k.spring = false;
          k.camV = 0;
        }
      } else {
        k.cam = camTarget;
      }
      world.style.transform = `translate3d(${(-k.cam).toFixed(2)}px,0,0)`;
      if (gridRef.current) gridRef.current.style.transform = `translate3d(${(-k.cam * 0.3).toFixed(2)}px,0,0)`;

      const cs = 1.07 * (lay.docked ? 0.72 : 1);
      car.setAttribute('transform', `translate(${fmt(pt.x)} ${fmt(pt.y)}) rotate(${k.angle.toFixed(2)}) scale(${cs})`);
      car.style.opacity = s >= L - 1 ? '0' : '1';

      const off = `${(L - s).toFixed(1)}`;
      trailRefs.current.forEach((el) => {
        if (el) el.style.strokeDashoffset = off;
      });

      // Afterburner length from scroll velocity, with a little flicker.
      const vRef = lay.docked ? 1500 : 2300;
      const speedN = clamp(Math.abs(k.v) / vRef, 0, 1);
      k.flame += (speedN - k.flame) * (1 - Math.exp(-dt * 14));
      const flick = 1 + 0.07 * Math.sin(now * 0.047) + 0.05 * Math.sin(now * 0.083);
      const fl = (5 + 46 * Math.pow(k.flame, 0.8)) * flick;
      flameOuterRef.current?.setAttribute('d', `M -29 -4.6 Q ${fmt(-29 - fl * 0.45)} -3.2 ${fmt(-29 - fl)} 0 Q ${fmt(-29 - fl * 0.45)} 3.2 -29 4.6 Z`);
      const fi = fl * 0.55;
      flameInnerRef.current?.setAttribute('d', `M -29 -2.2 Q ${fmt(-29 - fi * 0.5)} -1.4 ${fmt(-29 - fi)} 0 Q ${fmt(-29 - fi * 0.5)} 1.4 -29 2.2 Z`);
      const flameOp = (0.3 + 0.7 * clamp(k.flame * 4, 0, 1)).toFixed(3);
      if (flameOuterRef.current) flameOuterRef.current.style.opacity = flameOp;
      if (flameInnerRef.current) flameInnerRef.current.style.opacity = flameOp;
      const vort = clamp((k.flame - 0.2) / 0.6, 0, 1);
      vortexRefs.current.forEach((el) => {
        if (!el) return;
        el.setAttribute('x2', fmt(-33 - 60 * vort));
        el.style.opacity = (0.65 * vort).toFixed(3);
      });

      // Brake rotors glow on apex entry while the car is still carrying speed.
      const zone = 280 * lay.scale + 0.12 * lay.vw;
      let prox = 0;
      for (const a of geo.apexS) {
        const ahead = a - s;
        if (ahead > -20 && ahead < zone) prox = Math.max(prox, ahead <= 0 ? 1 : 1 - ahead / zone);
      }
      // Full glow while decelerating into the apex, dimmer if still on throttle.
      const decel = k.accel < 0 ? 1 : 0.35;
      const braking = k.v > 0 ? prox * decel * smoothstep(0.02, 0.2, speedN) : 0;
      k.brake += (braking - k.brake) * (1 - Math.exp(-dt * (braking > k.brake ? 18 : 4)));
      brakeRefs.current.forEach((el) => {
        if (el) el.style.opacity = (0.12 + 0.88 * k.brake).toFixed(3);
      });

      // Station focus + active sector.
      let active = 0;
      let bestD = Infinity;
      geo.apexS.forEach((a, idx) => {
        const d = Math.abs(a - s);
        if (d < bestD) {
          bestD = d;
          active = idx;
        }
        const focus = 1 - smoothstep(0.1 * lay.vw, (lay.docked ? 0.45 : 0.6) * lay.vw, d);
        const el = stationRefs.current[idx];
        if (el) {
          // Readable or hidden, never parked at a dim opacity that fails 4.5:1 contrast.
          const shown = focus > 0.45 ? '1' : '0';
          if (el.style.opacity !== shown) {
            el.style.transition = 'opacity 260ms ease';
            el.style.opacity = shown;
          }
          const dir = Number(el.dataset.dir || 1);
          el.style.transform = `translate3d(0, ${((1 - focus) * 10 * dir).toFixed(2)}px, 0)`;
        }
        const line = leaderRefs.current[idx];
        if (line) line.style.opacity = (0.15 + 0.85 * focus).toFixed(3);
      });
      if (active !== k.active) {
        k.active = active;
        setActiveSector(active);
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${(wrapping ? s / L : k.p).toFixed(4)})`;
    };

    // Site-wide scheduler; paused while the section is off screen.
    const section = sectionRef.current;
    if (!section) return;
    const task = register(({ now, dt }) => {
      if (dt === 0) kin.current.lastT = 0;
      tick(now);
      return true;
    }, { element: section, budgeted: false });
    return () => task.dispose();
  }, []);

  /* ---- sector navigation (forward-only) ---- */
  const handleSelectSector = useCallback((idx: number) => {
    const geo = geoRef.current;
    const section = sectionRef.current;
    if (!geo || !section) return;
    const k = kin.current;
    const rect = section.getBoundingClientRect();
    const runway = Math.max(1, rect.height - geo.layout.H);
    const pTarget = geo.apexP[idx];
    const top = window.scrollY + rect.top + pTarget * runway;
    const sTarget = geo.apexS[idx];

    if (sTarget < k.s - 4 && !k.wrap) {
      // Never reverse: run out through turn 6, re-enter at turn 1, stop at the apex.
      const distance = geo.L - k.s + sTarget;
      k.wrap = { t0: performance.now(), dur: clamp(900 + distance * 0.09, 1100, 1900), sStart: k.s, sTarget, pTarget };
      scrollToY(top, true);
    } else {
      scrollToY(top, false);
    }
  }, []);

  const lay = layout;
  const scale = lay?.scale ?? 1;

  return (
    <section
      id="experience"
      ref={sectionRef}
      data-experience-circuit="true"
      className="relative w-full h-[460vh]"
      aria-label="Experience"
    >
      <div ref={viewportRef} className="sticky top-0 w-full h-dvh overflow-hidden">
        {/* Parallax blueprint field: moves at 0.3x the camera */}
        <div
          ref={gridRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 pointer-events-none will-change-transform"
          style={{
            width: lay ? lay.vw + lay.M * 0.3 + 40 : '100%',
            backgroundImage:
              // Printed track map: a faint ink grid on the weave, no glow.
              'linear-gradient(rgba(5,8,17,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(5,8,17,0.05) 1px, transparent 1px)',
            backgroundSize: '64px 64px, 64px 64px',
          }}
        />

        {/* Horizontal world */}
        <div
          ref={worldRef}
          data-experience-track="true"
          className="absolute inset-y-0 left-0 will-change-transform pointer-events-none"
          style={{ width: lay ? lay.W : '420vw' }}
        >
          {lay && (
            <>
              <svg
                width={lay.W}
                height={lay.H}
                viewBox={`0 0 ${lay.W} ${lay.H}`}
                className="absolute inset-0 overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="expBarrier" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={lay.H}>
                    <stop offset="0" stopColor="#050811" stopOpacity="0.92" />
                    <stop offset="1" stopColor="#050811" stopOpacity="0.92" />
                  </linearGradient>
                  <linearGradient id="expHalo" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={lay.W} y2="0">
                    <stop offset="0" stopColor="#153875" stopOpacity="0.05" />
                    <stop offset="1" stopColor="#153875" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path d={lay.d} fill="none" stroke="url(#expHalo)" strokeWidth={74 * scale} strokeLinejoin="round" />
                <path d={lay.d} fill="none" stroke="url(#expBarrier)" strokeWidth={62 * scale} strokeLinejoin="round" />
                {/* Ink kerbs, paper surface, cobalt lane lines: the circuit as a printed map */}
                <path d={lay.d} fill="none" stroke="#F4F6F9" strokeWidth={56 * scale} strokeLinejoin="round" />
                <path d={lay.d} fill="none" stroke="rgba(21,56,117,0.10)" strokeWidth={40 * scale} strokeLinejoin="round" />
                <path d={lay.d} fill="none" stroke="#F4F6F9" strokeWidth={30 * scale} strokeLinejoin="round" />
                <path
                  d={lay.d}
                  fill="none"
                  stroke="rgba(5,8,17,0.40)"
                  strokeWidth={1}
                  strokeDasharray="14 18"
                />
                {Array.from({ length: STATIONS.length + 2 }).map((_, ci) => (
                  <g key={ci}>
                    <path
                      ref={(el) => {
                        curbRefs.current[ci * 2] = el;
                      }}
                      fill="none"
                      stroke="#FF2800"
                      strokeWidth={8 * scale}
                      strokeDasharray={`${11 * scale} ${11 * scale}`}
                    />
                    <path
                      ref={(el) => {
                        curbRefs.current[ci * 2 + 1] = el;
                      }}
                      fill="none"
                      stroke="#050811"
                      strokeWidth={8 * scale}
                      strokeDasharray={`${11 * scale} ${11 * scale}`}
                      strokeDashoffset={11 * scale}
                    />
                  </g>
                ))}
                <path
                  ref={pathRef}
                  data-experience-path="true"
                  d={lay.d}
                  fill="none"
                  stroke="none"
                />
              </svg>

              {/* Dynamic layer kept separate so the static track never repaints */}
              <svg
                width={lay.W}
                height={lay.H}
                viewBox={`0 0 ${lay.W} ${lay.H}`}
                className="absolute inset-0 overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="expFlame" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0" stopColor="#FF4419" stopOpacity="1" />
                    <stop offset="0.55" stopColor="#FF2800" stopOpacity="0.75" />
                    <stop offset="1" stopColor="#FF2800" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="expRotor">
                    <stop offset="0" stopColor="#FFE2D6" />
                    <stop offset="0.35" stopColor="#FF4419" />
                    <stop offset="1" stopColor="#FF2800" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {[
                  { w: 12, c: '#FF2800', o: 0.1 },
                  { w: 6, c: '#FF2800', o: 0.28 },
                  { w: 2.4, c: '#FF4419', o: 1 },
                ].map((t, i) => (
                  <path
                    key={i}
                    ref={(el) => {
                      trailRefs.current[i] = el;
                    }}
                    d={lay.d}
                    fill="none"
                    stroke={t.c}
                    strokeOpacity={t.o}
                    strokeWidth={t.w * (lay.docked ? 0.8 : 1)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {STATIONS.map((st, idx) => (
                  <g key={st.id}>
                    <line
                      ref={(el) => {
                        leaderRefs.current[idx] = el;
                      }}
                      stroke="#FF2800"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                    />
                    <circle
                      ref={(el) => {
                        leaderDotRefs.current[idx] = el;
                      }}
                      r="2.5"
                      fill="#FF2800"
                    />
                  </g>
                ))}

                {/* Top-down car, 76 x 36 at desktop scale */}
                <g ref={carRef} data-experience-car="true">
                  <ellipse cx="2" cy="3" rx="36" ry="17" fill="#000" opacity="0.45" />
                  <line ref={(el) => { vortexRefs.current[0] = el; }} x1="-33" y1="-16" x2="-33" y2="-16" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="3 3" opacity="0" />
                  <line ref={(el) => { vortexRefs.current[1] = el; }} x1="-33" y1="16" x2="-33" y2="16" stroke="#2563EB" strokeWidth="1.2" strokeDasharray="3 3" opacity="0" />
                  <path ref={flameOuterRef} fill="url(#expFlame)" />
                  <path ref={flameInnerRef} fill="#E6ECF5" />
                  <path
                    d="M 34 0 L 26 -8 L 12 -12 L -14 -12 L -24 -10 L -28 -6 L -28 6 L -24 10 L -14 12 L 12 12 L 26 8 Z"
                    fill="#070C16"
                    stroke="#C8D2E0"
                    strokeWidth="1"
                  />
                  <path d="M 32 -15 L 36 -15 L 38 0 L 36 15 L 32 15 Z" fill="#FF2800" />
                  <rect x="18" y="-17" width="8" height="4" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />
                  <rect x="18" y="13" width="8" height="4" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />
                  <circle ref={(el) => { brakeRefs.current[0] = el; }} cx="22" cy="-15" r="4.5" fill="url(#expRotor)" opacity="0.12" />
                  <circle ref={(el) => { brakeRefs.current[1] = el; }} cx="22" cy="15" r="4.5" fill="url(#expRotor)" opacity="0.12" />
                  <rect x="-20" y="-18" width="9" height="5" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />
                  <rect x="-20" y="13" width="9" height="5" rx="1" fill="#151A24" stroke="#7E8B9B" strokeWidth="0.5" />
                  <path d="M 6 -11 L 14 -11 L 12 -8 L 6 -8 Z" fill="#0B1E40" />
                  <path d="M 6 11 L 14 11 L 12 8 L 6 8 Z" fill="#0B1E40" />
                  <line x1="-30" y1="-16" x2="-30" y2="16" stroke="#E6ECF5" strokeWidth="2.5" />
                  <rect x="-33" y="-17" width="5" height="2" fill="#FF2800" />
                  <rect x="-33" y="15" width="5" height="2" fill="#FF2800" />
                  <path d="M 20 0 L 16 -5 L -2 -5 L -8 0 L -2 5 L 16 5 Z" fill="rgba(11,30,64,0.92)" stroke="#2563EB" strokeWidth="0.8" />
                  <path d="M -4 -2 Q 2 3, 8 -2 T 16 0" fill="none" stroke="#2563EB" strokeWidth="0.9" />
                  <path d="M -4 2 Q 2 -3, 8 2 T 16 0" fill="none" stroke="#FF2800" strokeWidth="0.9" />
                  <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#E6ECF5" strokeWidth="0.6" />
                  <line x1="5" y1="-2" x2="5" y2="2" stroke="#E6ECF5" strokeWidth="0.6" />
                  <line x1="10" y1="-1.5" x2="10" y2="1.5" stroke="#E6ECF5" strokeWidth="0.6" />
                </g>
              </svg>
            </>
          )}

          {/* Stations: unboxed, positioned from the sampled track geometry */}
          {STATIONS.map((st, idx) => (
            <article
              key={st.id}
              data-experience-station={idx}
              ref={(el) => {
                stationRefs.current[idx] = el as HTMLDivElement | null;
              }}
              className="group absolute pointer-events-auto will-change-transform"
              style={{ left: 0, top: 0, width: 320, opacity: 0 }}
            >
              <div className="flex items-baseline gap-2.5">
                <span className="text-4xl lg:text-5xl font-serif text-[#FF2800] leading-none">{st.numeral}</span>
                <span className="text-[#2563EB] font-mono text-sm select-none" aria-hidden="true">·</span>
                <span className="text-xs font-mono tracking-wide text-[#C8D2E0]">{st.period}</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-serif font-normal text-[#F4F6F9] mt-2 tracking-tight leading-[1.12]">
                {st.company}
              </h3>
              <p className="text-sm font-sans font-medium text-[#FF4419] mt-1.5 leading-snug">{st.role}</p>
              {st.team && <p className="text-xs font-sans text-[#7E8B9B] mt-0.5 leading-snug">{st.team}</p>}
              <p className="text-sm font-sans text-[#C8D2E0]/90 leading-relaxed mt-2.5 group-data-[compact=true]:line-clamp-3">
                {st.point}
              </p>
              <p className="text-xs font-mono text-[#C8D2E0]/70 mt-3 leading-relaxed group-data-[compact=true]:hidden">
                {st.stack.map((s, i) => (
                  <React.Fragment key={s}>
                    {i > 0 && <span className="text-[#2563EB] px-1.5" aria-hidden="true">·</span>}
                    {s}
                  </React.Fragment>
                ))}
              </p>
            </article>
          ))}
        </div>

        {/* Top HUD: title only, kept clear of the entry straight */}
        <div
          ref={hudRef}
          className="absolute top-0 left-0 z-30 px-6 sm:px-12 md:px-16 pt-[84px] md:pt-24 pointer-events-none"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
            Experience.
          </h2>
          <p className="hidden md:block mt-2 max-w-[22rem] text-sm font-sans text-[#7E8B9B] leading-relaxed">
            Production software, clinical computer vision research, and technical leadership.
          </p>
        </div>

        {/* Bottom HUD: sector nav + progress */}
        <div ref={footerRef} className="absolute bottom-0 left-0 z-30 w-full">
          <div className="h-px w-full bg-[#153875]/40">
            <div ref={progressRef} className="h-px w-full origin-left bg-[#FF2800]" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="px-6 sm:px-12 md:px-16 py-3 md:py-4 flex items-center justify-between gap-4 bg-gradient-to-t from-[#F4F6F9] via-[rgba(244,246,249,0.85)] to-transparent">
            <nav aria-label="Experience sectors" className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
              {STATIONS.map((st, idx) => {
                const isActive = activeSector === idx;
                return (
                  <React.Fragment key={st.id}>
                    {idx > 0 && (
                      <span className="text-[#153875] select-none" aria-hidden="true">
                        —
                      </span>
                    )}
                    <button
                      type="button"
                      data-experience-sector={idx}
                      onClick={() => handleSelectSector(idx)}
                      aria-current={isActive ? 'step' : undefined}
                      aria-label={`${st.numeral} ${st.company}`}
                      className={`py-2 px-1 transition-colors duration-200 focus:outline-none focus-visible:underline ${
                        isActive ? 'text-[#FF2800]' : 'text-[#7E8B9B] hover:text-[#E6ECF5]'
                      }`}
                    >
                      {st.numeral}
                      <span className={isActive ? 'ml-1.5' : 'hidden lg:inline ml-1.5'}>{st.short}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
            <Link
              href="#projects"
              className="shrink-0 text-xs font-mono text-[#7E8B9B] hover:text-[#FF2800] transition-colors focus:outline-none focus-visible:underline"
            >
              <span className="hidden sm:inline">Selected works </span>↓
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------------- */
/* Reduced motion: static, readable list                                      */
/* ------------------------------------------------------------------------- */

const StaticExperience: React.FC = () => (
  <section id="experience" data-experience-circuit="static" className="relative w-full px-6 sm:px-12 md:px-16 py-24 md:py-32" aria-label="Experience">
    <h2 className="text-4xl md:text-5xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">Experience.</h2>
    <p className="mt-2 max-w-[28rem] text-sm text-[#7E8B9B] leading-relaxed">
      Production software, clinical computer vision research, and technical leadership.
    </p>
    <ol className="mt-12 max-w-5xl">
      {STATIONS.map((st) => (
        <li key={st.id} data-experience-station={st.numeral} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-10 gap-y-2 py-8 border-t border-[#153875]/50">
          <div className="flex md:flex-col items-baseline gap-3 md:gap-2">
            <span className="text-4xl font-serif text-[#FF2800] leading-none">{st.numeral}</span>
            <span className="text-xs font-mono text-[#C8D2E0]">{st.period}</span>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-normal text-[#F4F6F9] tracking-tight">{st.company}</h3>
            <p className="text-sm font-medium text-[#FF4419] mt-1.5">{st.role}</p>
            {st.team && <p className="text-xs text-[#7E8B9B] mt-0.5">{st.team}</p>}
            <p className="text-sm text-[#C8D2E0]/90 leading-relaxed mt-3 max-w-2xl">{st.point}</p>
            <p className="text-xs font-mono text-[#C8D2E0]/70 mt-3">{st.stack.join(' · ')}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export const ExperienceCircuit: React.FC = () => {
  const { isReduced } = useMotionPreference();
  return isReduced ? <StaticExperience /> : <CircuitStage />;
};

export default ExperienceCircuit;
