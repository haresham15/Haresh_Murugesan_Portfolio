import React from 'react';

/*
 * The seven-layer rim motif from src/components/WheelNavTrigger.tsx, so the Works wheel and
 * the nav trigger read as the same machined part. Geometry is copied, not imported, because
 * the trigger keeps it private; if it is ever extracted to a shared module, use that here.
 * viewBox units: 0 0 100 100, centre 50,50, 0° = +x, clockwise.
 */

const C = 50;
const rad = (deg: number) => (deg * Math.PI) / 180;
const px = (r: number, deg: number) => +(C + r * Math.cos(rad(deg))).toFixed(3);
const py = (r: number, deg: number) => +(C + r * Math.sin(rad(deg))).toFixed(3);

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

const SPOKES = [0, 60, 120, 180, 240, 300].map((d) => d - 90);
const BRANCH_R = 22;
const MESH_R = 37.5;
const ARM_SPLAY = 11;
const MESH_R0 = 29.5;

function spokePath(phi: number, s: number) {
  return [
    bar(8.6, phi, BRANCH_R + 0.6, phi, 3.4 * s, 2.7 * s),
    bar(BRANCH_R, phi, MESH_R + 0.4, phi - ARM_SPLAY, 1.9 * s, 1.5 * s),
    bar(BRANCH_R, phi, MESH_R + 0.4, phi + ARM_SPLAY, 1.9 * s, 1.5 * s),
    bar(MESH_R0, phi + ARM_SPLAY * 0.62, MESH_R + 0.4, phi + 30, 1.05 * s, 0.95 * s),
    bar(MESH_R0, phi - ARM_SPLAY * 0.62, MESH_R + 0.4, phi - 30, 1.05 * s, 0.95 * s),
  ].join(' ');
}

const SPOKE_CHAMFER = SPOKES.map((phi) => spokePath(phi, 1.32)).join(' ');
const SPOKE_FACE = SPOKES.map((phi) => spokePath(phi, 0.86)).join(' ');
const SPOKE_RIDGE = SPOKES.map((phi) => `M ${px(9.4, phi)} ${py(9.4, phi)} L ${px(BRANCH_R - 0.4, phi)} ${py(BRANCH_R - 0.4, phi)}`).join(' ');
const ROTOR_HOLES = [24.6, 27.6, 30.6].flatMap((r, ring) =>
  Array.from({ length: 12 }, (_, i) => ({ x: px(r, i * 30 + ring * 10), y: py(r, i * 30 + ring * 10) })),
);
const LUGS = SPOKES.map((phi) => ({ x: px(11, phi + 30), y: py(11, phi + 30) }));

/** Rotor, lip, fenestration ring, split-Y spokes, lug wells and centre cap. */
export const RimHub: React.FC = () => (
  <>
    <defs>
      <radialGradient id="sw-rotor" cx="50" cy="50" r="33" gradientUnits="userSpaceOnUse">
        <stop offset="0.4" stopColor="#060A12" />
        <stop offset="0.72" stopColor="#1A2333" />
        <stop offset="0.86" stopColor="#2A3445" />
        <stop offset="1" stopColor="#111827" />
      </radialGradient>
      <linearGradient id="sw-lip" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E6ECF5" />
        <stop offset="0.5" stopColor="#C8D2E0" />
        <stop offset="1" stopColor="#7E8B9B" />
      </linearGradient>
      <radialGradient id="sw-cap" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#F4F6F9" />
        <stop offset="0.45" stopColor="#C8D2E0" />
        <stop offset="1" stopColor="#475569" />
      </radialGradient>
      <radialGradient id="sw-bolt" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#E6ECF5" />
        <stop offset="1" stopColor="#475569" />
      </radialGradient>
    </defs>

    {/* Cross-drilled rotor behind the spokes */}
    <circle cx="50" cy="50" r="33" fill="url(#sw-rotor)" />
    {[25.9, 29.1, 32.1].map((r) => (
      <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#C8D2E0" strokeOpacity="0.07" strokeWidth="0.35" />
    ))}
    {ROTOR_HOLES.map((h, i) => (
      <circle key={i} cx={h.x} cy={h.y} r="0.72" fill="#020308" />
    ))}
    <circle cx="50" cy="50" r="16" fill="#03050A" stroke="#1E293B" strokeWidth="0.6" />

    {/* Chrome lip */}
    <circle cx="50" cy="50" r="44.5" fill="none" stroke="url(#sw-lip)" strokeWidth="2.4" />
    <circle cx="50" cy="50" r="43.25" fill="none" stroke="#475569" strokeWidth="0.35" />

    {/* 36-pocket fenestration ring */}
    <circle cx="50" cy="50" r="40.5" fill="none" stroke="#03050A" strokeWidth="5.2" />
    <circle cx="50" cy="50" r="40.5" fill="none" stroke="#0B1322" strokeWidth="5.2" pathLength={360} strokeDasharray="4.4 5.6" strokeDashoffset="-0.2" />
    <circle cx="50" cy="50" r="40.5" fill="none" stroke="#475569" strokeWidth="5" pathLength={360} strokeDasharray="3.2 6.8" strokeDashoffset="0.35" />
    <circle cx="50" cy="50" r="40.5" fill="none" stroke="#C8D2E0" strokeWidth="5" pathLength={360} strokeDasharray="2.2 7.8" />
    <circle cx="50" cy="50" r="37.5" fill="none" stroke="#C8D2E0" strokeWidth="1.1" />
    <circle cx="50" cy="50" r="36.9" fill="none" stroke="#03050A" strokeOpacity="0.7" strokeWidth="0.3" />

    {/* Split-Y spokes into a diamond mesh */}
    <path d={SPOKE_CHAMFER} fill="#475569" />
    <path d={SPOKE_FACE} fill="#E6ECF5" />
    <path d={SPOKE_RIDGE} fill="none" stroke="#7E8B9B" strokeWidth="0.45" strokeLinecap="round" />

    {/* Lug wells */}
    {LUGS.map((l, i) => (
      <g key={i}>
        <circle cx={l.x} cy={l.y} r="2.1" fill="#03050A" stroke="#475569" strokeWidth="0.5" />
        <circle cx={l.x} cy={l.y} r="1.15" fill="url(#sw-bolt)" />
      </g>
    ))}

    {/* Centre cap with slot */}
    <circle cx="50" cy="50" r="7.2" fill="url(#sw-cap)" stroke="#475569" strokeWidth="0.7" />
    <rect x="45" y="48.9" width="10" height="2.2" rx="0.6" fill="#03050A" />
    <rect x="45.9" y="49.55" width="8.2" height="0.9" rx="0.45" fill="#FF2800" />
  </>
);
