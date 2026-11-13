import React from 'react';
import { RimHub } from './RimHub';
import { DETENT, SECTORS } from './wheelMath';
import styles from './works.module.css';

/*
 * Inline SVG wheel. Units: the wheel is centred at 0,0 with radius 100, viewBox −100…100.
 * Everything inside `rotorRef` turns with θ; the overlay (index mark, specular arc,
 * focus outline) is fixed to the page.
 */

const RING_IN = 60;
const RING_OUT = 100;

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => `${(r * Math.cos(rad(deg))).toFixed(3)} ${(r * Math.sin(rad(deg))).toFixed(3)}`;

function annulus(r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${pt(r1, a0)} A ${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)} L ${pt(r0, a1)} A ${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)} Z`;
}

function arc(r: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${pt(r, a0)} A ${r} ${r} 0 ${large} 1 ${pt(r, a1)}`;
}

// Label paths: radial on desktop (reads level at 3 o'clock), an arc on phones (level at 12).
const LABEL_ARC_R = 81;
const LABEL_ARC_HALF = 21;
const LABEL_RADIAL = RING_OUT - 1 - (RING_IN + 2);
const LABEL_ARC = (LABEL_ARC_R * 2 * LABEL_ARC_HALF * Math.PI) / 180;

const SECTOR_ANGLES = Array.from({ length: SECTORS }, (_, k) => k * DETENT);
const SEPARATORS = SECTOR_ANGLES.map((a) => `M ${pt(RING_IN, a + DETENT / 2)} L ${pt(RING_OUT, a + DETENT / 2)}`).join(' ');

export interface WheelLabel {
  index: string;
  tab: string;
}

interface WheelProps {
  /** Radius in CSS px; sets type and weave to true pixel sizes. */
  radius: number;
  mobile: boolean;
  /** Screen angle of the apex: 0 (3 o'clock) on desktop, −90 (12 o'clock) under 768 px. */
  apex: number;
  labels: WheelLabel[];
  activeSector: number;
  focusVisible: boolean;
  showSpecular: boolean;
  rotorRef: React.Ref<HTMLDivElement>;
  specRef: React.Ref<SVGGElement>;
}

/** 2×2 twill in near-black: warp on top where (i + j) mod 4 < 2, a 4×4 tow repeat. */
function Twill({ tow }: { tow: number }) {
  const cells: React.ReactNode[] = [];
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const warp = (i + j) % 4 < 2;
      cells.push(
        <rect key={`${i}-${j}`} x={i * tow} y={j * tow} width={tow} height={tow} fill={warp ? 'url(#sw-warp)' : 'url(#sw-weft)'} />,
      );
    }
  }
  return (
    <>
      <linearGradient id="sw-warp" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#030409" />
        <stop offset="0.5" stopColor="#111722" />
        <stop offset="1" stopColor="#030409" />
      </linearGradient>
      <linearGradient id="sw-weft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#020307" />
        <stop offset="0.5" stopColor="#0B0F18" />
        <stop offset="1" stopColor="#020307" />
      </linearGradient>
      <pattern id="sw-twill" patternUnits="userSpaceOnUse" width={tow * 4} height={tow * 4}>
        {cells}
      </pattern>
    </>
  );
}

export const Wheel: React.FC<WheelProps> = ({
  radius, mobile, apex, labels, activeSector, focusVisible, showSpecular, rotorRef, specRef,
}) => {
  const unit = 100 / Math.max(radius, 1); // viewBox units per CSS px
  const fontSize = 12 * unit;
  const hair = unit;
  const tow = 6 * unit;
  // Geist Mono advances 0.6em; with 0.08em tracking. Squeeze only if a label would overrun its path.
  const room = (mobile ? LABEL_ARC : LABEL_RADIAL) - 4 * unit;
  const fit = (label: string) => {
    const width = label.length * fontSize * 0.68;
    return width > room ? { textLength: room, lengthAdjust: 'spacingAndGlyphs' as const } : {};
  };

  return (
    <>
      <div ref={rotorRef} className={styles.rotor}>
        <svg className={styles.fill} viewBox="-100 -100 200 200" aria-hidden="true">
          <defs>
            <Twill tow={tow} />
            {SECTOR_ANGLES.map((a, k) => (
              <path
                key={k}
                id={`sw-label-${k}`}
                d={mobile ? arc(LABEL_ARC_R, a - LABEL_ARC_HALF, a + LABEL_ARC_HALF) : `M ${pt(RING_IN + 2, a)} L ${pt(RING_OUT - 1, a)}`}
              />
            ))}
          </defs>
          <circle r={RING_OUT} fill="url(#sw-twill)" />
          <circle r={RING_OUT - hair / 2} fill="none" stroke="#1E293B" strokeWidth={hair} />
          <circle r={RING_IN} fill="none" stroke="#C8D2E0" strokeOpacity="0.14" strokeWidth={hair} />
          <path d={SEPARATORS} stroke="#C8D2E0" strokeOpacity="0.16" strokeWidth={hair} />
          {SECTOR_ANGLES.map((a, k) => {
            const w = labels[k % labels.length];
            const active = k === activeSector;
            return (
              <g key={k} data-sector={k} className={styles.tab}>
                <path d={annulus(RING_IN, RING_OUT, a - DETENT / 2, a + DETENT / 2)} fill="#000" fillOpacity="0" />
                <text
                  className="font-mono"
                  fontSize={fontSize}
                  letterSpacing={fontSize * 0.08}
                  dominantBaseline="central"
                  style={{ fill: active ? 'var(--mat-accent-mark)' : 'var(--mat-muted)', transition: 'fill 180ms linear' }}
                >
                  <textPath
                    href={`#sw-label-${k}`}
                    startOffset={mobile ? '50%' : '0'}
                    textAnchor={mobile ? 'middle' : 'start'}
                    {...fit(`${w.index} ${w.tab}`)}
                  >
                    {`${w.index} ${w.tab.toUpperCase()}`}
                  </textPath>
                </text>
              </g>
            );
          })}
        </svg>
        <div className={styles.lip} />
        <svg className={styles.hub} viewBox="0 0 100 100" aria-hidden="true">
          <RimHub />
        </svg>
      </div>

      {/* Fixed to the page: does not turn with the wheel */}
      <svg className={styles.overlay} viewBox="-100 -100 200 200" overflow="visible" aria-hidden="true">
        <defs>
          <linearGradient id="sw-spec" gradientUnits="userSpaceOnUse" x1="0" y1="-42" x2="0" y2="42">
            <stop offset="0" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="0.5" stopColor="#2563EB" stopOpacity="0.42" />
            <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        {showSpecular && (
          <g ref={specRef} className={styles.spec}>
            <path d={arc(96, -25, 25)} fill="none" stroke="url(#sw-spec)" strokeWidth={3 * hair} strokeLinecap="round" />
          </g>
        )}
        {focusVisible && (
          <path
            d={annulus(RING_IN, RING_OUT, apex - DETENT / 2, apex + DETENT / 2)}
            fill="none"
            stroke="var(--mat-ink)"
            strokeWidth={1.5 * hair}
          />
        )}
        {/* Index mark on the page, pointing at the apex */}
        <path
          d={`M ${pt(RING_OUT + 4 * unit, apex)} L ${pt(RING_OUT + 16 * unit, apex - (6 * unit * 180) / (Math.PI * (RING_OUT + 16 * unit)))} L ${pt(RING_OUT + 16 * unit, apex + (6 * unit * 180) / (Math.PI * (RING_OUT + 16 * unit)))} Z`}
          fill="#FF2800"
        />
      </svg>
    </>
  );
};
