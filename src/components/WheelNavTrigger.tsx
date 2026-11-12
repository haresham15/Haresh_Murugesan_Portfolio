import React, { useState, useRef, useCallback } from 'react';
import { useCanvasStage } from '../hooks/useCanvasStage';
import { useMotionPreference } from './MotionPreference';

interface WheelNavTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  /** Lets the nav overlay return focus to the trigger on close. */
  buttonRef?: React.Ref<HTMLButtonElement>;
  /** id of the element this button opens. */
  controls?: string;
}

// ---------------------------------------------------------------------------
// Geometry (viewBox 0 0 100 100, centre 50,50; angles in degrees, 0° = +x, clockwise)
// ---------------------------------------------------------------------------
const C = 50;
const rad = (deg: number) => (deg * Math.PI) / 180;
const px = (r: number, deg: number) => +(C + r * Math.cos(rad(deg))).toFixed(3);
const py = (r: number, deg: number) => +(C + r * Math.sin(rad(deg))).toFixed(3);
const pt = (r: number, deg: number) => `${px(r, deg)} ${py(r, deg)}`;

/** Annular sector between radii r0 < r1 from a0 to a1 (a1 > a0). */
function annulus(r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${pt(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)} L ${pt(r0, a1)} A ${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)} Z`;
}

/** Arc stroke path on radius r from a0 to a1. */
function arc(r: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${pt(r, a0)} A ${r} ${r} 0 ${large} 1 ${pt(r, a1)}`;
}

/** Tapered bar from polar (r0,a0) to (r1,a1), widths w0 → w1. */
function bar(r0: number, a0: number, r1: number, a1: number, w0: number, w1: number) {
  const x0 = C + r0 * Math.cos(rad(a0));
  const y0 = C + r0 * Math.sin(rad(a0));
  const x1 = C + r1 * Math.cos(rad(a1));
  const y1 = C + r1 * Math.sin(rad(a1));
  const len = Math.hypot(x1 - x0, y1 - y0) || 1;
  const nx = -(y1 - y0) / len;
  const ny = (x1 - x0) / len;
  const f = (n: number) => n.toFixed(3);
  return `M ${f(x0 + nx * w0 / 2)} ${f(y0 + ny * w0 / 2)} L ${f(x1 + nx * w1 / 2)} ${f(y1 + ny * w1 / 2)} L ${f(x1 - nx * w1 / 2)} ${f(y1 - ny * w1 / 2)} L ${f(x0 - nx * w0 / 2)} ${f(y0 - ny * w0 / 2)} Z`;
}

const SPOKES = [0, 60, 120, 180, 240, 300].map((d) => d - 90); // first spoke straight up
const BRANCH_R = 22;
const MESH_R = 37.5;
const ARM_SPLAY = 11; // degrees each arm diverges from the stem at the rim
const MESH_R0 = 29.5;

/** Split-Y spoke + its share of the diamond mesh, as one path (built for a given width scale). */
function spokePath(phi: number, s: number) {
  return [
    bar(8.6, phi, BRANCH_R + 0.6, phi, 3.4 * s, 2.7 * s), // stem
    bar(BRANCH_R, phi, MESH_R + 0.4, phi - ARM_SPLAY, 1.9 * s, 1.5 * s), // left arm
    bar(BRANCH_R, phi, MESH_R + 0.4, phi + ARM_SPLAY, 1.9 * s, 1.5 * s), // right arm
    // diamond lattice: struts leave the arms and meet the neighbours' at mid-bay on the rim
    bar(MESH_R0, phi + ARM_SPLAY * 0.62, MESH_R + 0.4, phi + 30, 1.05 * s, 0.95 * s),
    bar(MESH_R0, phi - ARM_SPLAY * 0.62, MESH_R + 0.4, phi - 30, 1.05 * s, 0.95 * s),
  ].join(' ');
}

const SPOKE_CHAMFER = SPOKES.map((phi) => spokePath(phi, 1.32)).join(' ');
const SPOKE_FACE = SPOKES.map((phi) => spokePath(phi, 0.86)).join(' ');
const SPOKE_RIDGE = SPOKES.map((phi) => `M ${pt(9.4, phi)} L ${pt(BRANCH_R - 0.4, phi)}`).join(' ');

// Cross-drilled rotor: three staggered rings of 12 holes.
const ROTOR_HOLES = [24.6, 27.6, 30.6].flatMap((r, ring) =>
  Array.from({ length: 12 }, (_, i) => ({ x: px(r, i * 30 + ring * 10), y: py(r, i * 30 + ring * 10) })),
);

// Caliper: fixed at 135°–195° (lower-left to left), straddling the rotor edge.
const CALIPER_A0 = 135;
const CALIPER_A1 = 195;
const CALIPER_BODY = annulus(25.2, 35.2, CALIPER_A0, CALIPER_A1);
const CALIPER_WINDOW = annulus(28.4, 32.2, CALIPER_A0 + 9, CALIPER_A1 - 9);
const CALIPER_EDGE = arc(34.8, CALIPER_A0 + 2, CALIPER_A1 - 2);

const LUGS = SPOKES.map((phi) => ({ x: px(11, phi + 30), y: py(11, phi + 30) }));

// ---------------------------------------------------------------------------
// Burnout smoke (canvas, 200 × 200 CSS px, centred on the wheel)
// ---------------------------------------------------------------------------
const SMOKE_SIZE = 200;
const PUFFS = 32;

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r0: number;
  r1: number;
  alpha: number;
  age: number; // seconds; negative = not yet emitted
  life: number;
  seed: number;
  tone: 0 | 1 | 2; // chrome, silver, cobalt
}

const TONES: [number, number, number][] = [
  [230, 236, 245],
  [200, 210, 224],
  [21, 56, 117],
];

/**
 * Divergence-free curl field from the stream function
 * ψ = sin(kx·x + t) · cos(ky·y − 0.7t) + 0.5 · sin(0.6·kx·y − 1.3t + seed)
 * velocity = (∂ψ/∂y, −∂ψ/∂x)
 */
function curl(x: number, y: number, t: number, seed: number): [number, number] {
  const kx = 0.045;
  const ky = 0.038;
  const a = kx * x + t;
  const b = ky * y - 0.7 * t;
  const c = 0.6 * kx * y - 1.3 * t + seed;
  const dPsiDy = -Math.sin(a) * Math.sin(b) * ky + 0.5 * Math.cos(c) * 0.6 * kx;
  const dPsiDx = Math.cos(a) * kx * Math.cos(b);
  return [dPsiDy, -dPsiDx];
}

export const WheelNavTrigger: React.FC<WheelNavTriggerProps> = ({ isOpen, onToggle, buttonRef, controls }) => {
  const { isReduced } = useMotionPreference();
  const [isHovered, setIsHovered] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const smokeRef = useRef<SmokePuff[]>([]);
  const smokeClock = useRef(0);
  const [smoking, setSmoking] = useState(false);

  const triggerBurnoutSmoke = useCallback(() => {
    if (isReduced) return;
    const cx = SMOKE_SIZE / 2;
    const cy = SMOKE_SIZE / 2;
    // Contact patch: bottom of the 64px tyre (r = 48 in a 100-unit box → 30.7px).
    const patchY = cy + 30;
    const puffs: SmokePuff[] = [];
    for (let i = 0; i < PUFFS; i++) {
      // The rim spins clockwise, so the patch throws smoke back to the left and up the sidewall.
      const dir = Math.PI * (0.94 + (Math.random() - 0.5) * 0.42);
      const speed = 55 + Math.random() * 85; // px/s
      const roll = Math.random();
      puffs.push({
        x: cx + (Math.random() - 0.5) * 14,
        y: patchY + (Math.random() - 0.5) * 6,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed - 20,
        r0: 6 + Math.random() * 5,
        r1: 30 + Math.random() * 26,
        alpha: 0.5 + Math.random() * 0.22,
        age: -Math.random() * 0.24, // staggered emission over ~240ms
        life: 0.85 + Math.random() * 0.55,
        seed: Math.random() * Math.PI * 2,
        tone: roll < 0.42 ? 0 : roll < 0.78 ? 1 : 2,
      });
    }
    smokeRef.current = puffs;
    smokeClock.current = 0;
    setSmoking(true);
  }, [isReduced]);

  useCanvasStage(smokeCanvasRef, smokeCanvasRef, (ctx, { width, height, deltaTime }) => {
    ctx.clearRect(0, 0, width, height);
    if (isReduced) return;
    ctx.scale(width / SMOKE_SIZE, height / SMOKE_SIZE);
    const dt = deltaTime / 1000;
    smokeClock.current += dt;
    const t = smokeClock.current * 2.2;
    const hubX = SMOKE_SIZE / 2;
    const hubY = SMOKE_SIZE / 2;
    let alive = 0;

    for (const p of smokeRef.current) {
      p.age += dt;
      if (p.age >= p.life) continue;
      alive++;
      if (p.age < 0) continue;

      // Curl turbulence + a vortex shed around the spinning rim + buoyancy, with drag.
      const [cxv, cyv] = curl(p.x, p.y, t, p.seed);
      const dx = p.x - hubX;
      const dy = p.y - hubY;
      const d2 = dx * dx + dy * dy + 400;
      const swirl = 5200 / d2; // clockwise, falls off with distance
      p.vx += (cxv * 900 + -dy * swirl) * dt;
      p.vy += (cyv * 900 + dx * swirl - 42) * dt;
      const drag = Math.exp(-2.6 * dt);
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const k = p.age / p.life;
      const grow = 1 - Math.pow(1 - k, 3); // ease-out cubic expansion
      const r = p.r0 + (p.r1 - p.r0) * grow;
      const fadeIn = Math.min(1, p.age / 0.08);
      const a = p.alpha * fadeIn * Math.pow(1 - k, 1.6);
      const [cr, cg, cb] = TONES[p.tone];
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${(0.4 * a).toFixed(3)})`);
      g.addColorStop(0.45, `rgba(${cr}, ${cg}, ${cb}, ${(0.18 * a).toFixed(3)})`);
      g.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (alive === 0 && smoking) setSmoking(false);
  }, { animate: smoking && !isReduced });

  const handleClick = () => {
    if (!isReduced) {
      setRotationDeg((prev) => prev + 1080);
      setSpinCount((n) => n + 1);
      triggerBurnoutSmoke();
    }
    onToggle();
  };

  const hoverAngle = !isOpen && isHovered ? 25 : 0;
  const totalAngle = rotationDeg + (isOpen ? 90 : 0) + hoverAngle;
  const rotationStyle: React.CSSProperties = isReduced
    ? {}
    : {
        transform: `rotate(${totalAngle}deg)`,
        transformOrigin: '50px 50px',
        transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      };

  return (
    <div className="relative flex items-center justify-center">
      {/* Burnout smoke, centred on the rim so it never drifts with layout */}
      <canvas
        ref={smokeCanvasRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{ width: `${SMOKE_SIZE}px`, height: `${SMOKE_SIZE}px` }}
        aria-hidden="true"
      />

      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative z-10 w-[64px] h-[64px] rounded-full p-0 flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out-expo active:scale-95 select-none"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls={controls}
      >
        {/* Brake-heat bloom on hover / open */}
        <span
          aria-hidden="true"
          className={`absolute inset-[-6px] rounded-full transition-opacity duration-300 ease-out-expo pointer-events-none ${
            isOpen || isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(255, 40, 0, 0.22) 0%, rgba(21, 56, 117, 0.16) 50%, transparent 72%)',
          }}
        />

        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full rounded-full drop-shadow-[0_6px_14px_rgba(3,5,10,0.9)]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="wnt-tyre" cx="50" cy="50" r="48" gradientUnits="userSpaceOnUse">
              <stop offset="0.88" stopColor="#020308" />
              <stop offset="0.95" stopColor="#0A101B" />
              <stop offset="1" stopColor="#04070E" />
            </radialGradient>
            <radialGradient id="wnt-rotor" cx="50" cy="50" r="33" gradientUnits="userSpaceOnUse">
              <stop offset="0.4" stopColor="#060A12" />
              <stop offset="0.72" stopColor="#1A2333" />
              <stop offset="0.86" stopColor="#2A3445" />
              <stop offset="1" stopColor="#111827" />
            </radialGradient>
            <linearGradient id="wnt-caliper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF4419" />
              <stop offset="0.5" stopColor="#FF2800" />
              <stop offset="1" stopColor="#A81A00" />
            </linearGradient>
            <linearGradient id="wnt-lip" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E6ECF5" />
              <stop offset="0.5" stopColor="#C8D2E0" />
              <stop offset="1" stopColor="#7E8B9B" />
            </linearGradient>
            <radialGradient id="wnt-cap" cx="0.38" cy="0.32" r="0.8">
              <stop offset="0" stopColor="#F4F6F9" />
              <stop offset="0.45" stopColor="#C8D2E0" />
              <stop offset="1" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="wnt-bolt" cx="0.35" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#E6ECF5" />
              <stop offset="1" stopColor="#475569" />
            </radialGradient>
            {/* Fixed studio key light from the upper left; does not spin with the wheel */}
            <radialGradient id="wnt-key" cx="33" cy="27" r="46" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#F4F6F9" stopOpacity="0.2" />
              <stop offset="0.45" stopColor="#F4F6F9" stopOpacity="0.05" />
              <stop offset="1" stopColor="#F4F6F9" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wnt-occlusion" cx="70" cy="76" r="52" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#03050A" stopOpacity="0.5" />
              <stop offset="0.6" stopColor="#03050A" stopOpacity="0.16" />
              <stop offset="1" stopColor="#03050A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wnt-spec" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="wnt-blur" cx="50" cy="50" r="38" gradientUnits="userSpaceOnUse">
              <stop offset="0.2" stopColor="#7E8B9B" stopOpacity="0.9" />
              <stop offset="0.55" stopColor="#C8D2E0" stopOpacity="0.55" />
              <stop offset="0.9" stopColor="#7E8B9B" stopOpacity="0.7" />
              <stop offset="1" stopColor="#475569" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1 · Tyre, with sidewall bevel */}
          <circle cx="50" cy="50" r="48" fill="url(#wnt-tyre)" />
          <circle cx="50" cy="50" r="47.4" fill="none" stroke="#1E293B" strokeWidth="0.5" />
          <path d={arc(47.3, 190, 290)} fill="none" stroke="#C8D2E0" strokeOpacity="0.32" strokeWidth="0.6" strokeLinecap="round" />
          <path d={arc(45.6, 20, 110)} fill="none" stroke="#000000" strokeOpacity="0.6" strokeWidth="1" />

          {/* 2 · Stationary cross-drilled rotor and caliper (spokes sweep over these) */}
          <g>
            <circle cx="50" cy="50" r="33" fill="url(#wnt-rotor)" />
            {[25.9, 29.1, 32.1].map((r) => (
              <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#C8D2E0" strokeOpacity="0.07" strokeWidth="0.35" />
            ))}
            {ROTOR_HOLES.map((h, i) => (
              <g key={i}>
                <circle cx={h.x} cy={h.y} r="0.72" fill="#020308" />
                <circle cx={h.x + 0.18} cy={h.y + 0.22} r="0.72" fill="none" stroke="#7E8B9B" strokeOpacity="0.35" strokeWidth="0.22" />
              </g>
            ))}
            <circle cx="50" cy="50" r="16" fill="#03050A" stroke="#1E293B" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="33" fill="none" stroke="#475569" strokeWidth="0.5" />

            <path d={CALIPER_BODY} fill="#5C1200" transform="translate(0.6 0.9)" />
            <path d={CALIPER_BODY} fill="url(#wnt-caliper)" stroke="#FF4419" strokeWidth="0.45" strokeLinejoin="round" />
            <path d={CALIPER_WINDOW} fill="#A81A00" fillOpacity="0.55" />
            <path d={CALIPER_EDGE} fill="none" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="0.55" strokeLinecap="round" />
            {[CALIPER_A0 + 7, CALIPER_A1 - 7].map((a) => (
              <circle key={a} cx={px(30.2, a)} cy={py(30.2, a)} r="1.15" fill="#03050A" stroke="#C8D2E0" strokeWidth="0.4" />
            ))}
          </g>

          {/* 3–7 · Rotating assembly */}
          <g style={rotationStyle}>
            {/* 3 · Chrome lip */}
            <circle cx="50" cy="50" r="44.5" fill="none" stroke="url(#wnt-lip)" strokeWidth="2.4" />
            <circle cx="50" cy="50" r="43.25" fill="none" stroke="#475569" strokeWidth="0.35" />

            {/* 4 · 36-pocket fenestration ring */}
            <circle cx="50" cy="50" r="40.5" fill="none" stroke="#03050A" strokeWidth="5.2" />
            <circle cx="50" cy="50" r="40.5" fill="none" stroke="#0B1322" strokeWidth="5.2" pathLength={360} strokeDasharray="4.4 5.6" strokeDashoffset="-0.2" />
            <circle cx="50" cy="50" r="40.5" fill="none" stroke="#475569" strokeWidth="5" pathLength={360} strokeDasharray="3.2 6.8" strokeDashoffset="0.35" />
            <circle cx="50" cy="50" r="40.5" fill="none" stroke="#C8D2E0" strokeWidth="5" pathLength={360} strokeDasharray="2.2 7.8" />
            <circle cx="50" cy="50" r="37.5" fill="none" stroke="#C8D2E0" strokeWidth="1.1" />
            <circle cx="50" cy="50" r="36.9" fill="none" stroke="#03050A" strokeOpacity="0.7" strokeWidth="0.3" />

            {/* 5 · Split-Y spokes into a diamond mesh: gunmetal chamfer pass, then chrome face */}
            <path d={SPOKE_CHAMFER} fill="#475569" />
            <path d={SPOKE_FACE} fill="#E6ECF5" />
            <path d={SPOKE_RIDGE} fill="none" stroke="#7E8B9B" strokeWidth="0.45" strokeLinecap="round" />

            {/* 6 · Lug wells */}
            {LUGS.map((l, i) => (
              <g key={i}>
                <circle cx={l.x} cy={l.y} r="2.1" fill="#03050A" stroke="#475569" strokeWidth="0.5" />
                <circle cx={l.x} cy={l.y} r="1.15" fill="url(#wnt-bolt)" />
              </g>
            ))}

            {/* 7 · Centre cap with horizontal slot */}
            <circle cx="50" cy="50" r="7.2" fill="url(#wnt-cap)" stroke="#475569" strokeWidth="0.7" />
            <rect x="45" y="48.9" width="10" height="2.2" rx="0.6" fill="#03050A" />
            <rect
              x="45.9"
              y="49.55"
              width="8.2"
              height="0.9"
              rx="0.45"
              fill={isOpen ? '#FF2800' : '#C8D2E0'}
              style={{ transition: 'fill 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </g>

          {/* Motion-blur disc: fades in only for the fastest part of a spin, hides strobing */}
          {spinCount > 0 && !isReduced && (
            <circle
              key={spinCount}
              cx="50"
              cy="50"
              r="38"
              fill="url(#wnt-blur)"
              className="wheel-spin-blur"
            />
          )}

          {/* Fixed lighting over the rotating parts, so highlights stay put while the rim turns */}
          <circle cx="50" cy="50" r="45.7" fill="url(#wnt-key)" pointerEvents="none" />
          <circle cx="50" cy="50" r="45.7" fill="url(#wnt-occlusion)" pointerEvents="none" />
          <path d={arc(44.5, 196, 284)} fill="none" stroke="url(#wnt-spec)" strokeWidth="0.9" strokeLinecap="round" />
          <path d={arc(44.5, 22, 96)} fill="none" stroke="#03050A" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round" />
          <path d={arc(37.5, 205, 265)} fill="none" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.45" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default WheelNavTrigger;
