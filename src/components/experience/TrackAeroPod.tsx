import React from 'react';

export interface TrackAeroPodProps {
  isMoving: boolean;
  boost?: 'normal' | 'high';
  isBraking?: boolean;
  className?: string;
}

/**
 * Top-Down DNA-Core Aero Prototype Vehicle (56px length x 26px width)
 *
 * Cinematic Le Mans / F1 Prototype Anatomy:
 * 1. 60px Conical Headlight Beam projecting forward ahead of the nose along the track tangent.
 * 2. Sculpted carbon bodywork with multi-tier front wing and orange endplates.
 * 3. 4 Low-profile slick tires with machined metallic rims and front brake-disc glow (#FF6B35).
 * 4. Tapered sidepods with radiator louvers and aerodynamic bargeboards.
 * 5. Double-helix DNA engine spine glowing incandescently in the cockpit canopy (#FF6B35 / #F5D998).
 * 6. Rear dual-element aerodynamic downforce wing, diffuser, and central pulsing FIA rain-light.
 * 7. Active dual vortex slipstream ribbons and elongated exhaust flame plume during acceleration.
 */
export const TrackAeroPod: React.FC<TrackAeroPodProps> = ({
  isMoving,
  boost = 'normal',
  isBraking = false,
  className = '',
}) => {
  const isHighBoost = boost === 'high';

  return (
    <g className={`select-none pointer-events-none ${className}`}>
      <defs>
        {/* Conical Headlight Beam Gradient (Nose is at x = +28, projecting forward to x = +88) */}
        <radialGradient id="headlight-beam-glow" cx="0%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#F3EFE7" stopOpacity="0.28" />
          <stop offset="35%" stopColor="#F5D998" stopOpacity="0.14" />
          <stop offset="70%" stopColor="#82B7FF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#070B12" stopOpacity="0" />
        </radialGradient>

        {/* Soft Asphalt Underglow Gradient */}
        <radialGradient id="aero-underglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity={isMoving ? 0.5 : 0.75} />
          <stop offset="50%" stopColor="#FF6B35" stopOpacity={isMoving ? 0.2 : 0.3} />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>

        {/* DNA Double-Helix Filament Gradient */}
        <linearGradient id="dna-spine-filament" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="45%" stopColor="#F5D998" />
          <stop offset="75%" stopColor="#FFE9AE" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>

        {/* Carbon Chassis Gradient */}
        <linearGradient id="carbon-chassis" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B1322" />
          <stop offset="35%" stopColor="#1E293B" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#F3EFE7" />
        </linearGradient>

        {/* Exhaust Flame Gradient */}
        <linearGradient id="exhaust-plume" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFE9AE" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#FF6B35" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#C8321E" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#C8321E" stopOpacity="0" />
        </linearGradient>

        {/* Slipstream Vortex Trails */}
        <linearGradient id="vortex-upper" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#82B7FF" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#82B7FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#82B7FF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="vortex-lower" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 1. CONICAL HEADLIGHT BEAM (60px length ahead of front splitter) */}
      <path
        d="M 27 -5 L 86 -22 L 86 22 L 27 5 Z"
        fill="url(#headlight-beam-glow)"
        className="transition-opacity duration-300"
        opacity={isMoving ? 0.95 : 0.65}
      />

      {/* 2. SOFT ASPHALT UNDERGLOW */}
      <ellipse
        cx="0"
        cy="0"
        rx={isMoving ? 32 : 30}
        ry={isMoving ? 16 : 18}
        fill="url(#aero-underglow)"
      />

      {/* 3. DYNAMIC EXHAUST & AERO VORTEX WAKE (Active during motion) */}
      {isMoving && (
        <g className="transition-opacity duration-200">
          {/* Dual Vortex Trails Streaming from Rear Wing Endplates */}
          <path
            d={
              isHighBoost
                ? 'M -28 -13 C -42 -15, -60 -17, -80 -14'
                : 'M -28 -13 C -40 -14.5, -52 -15, -66 -13'
            }
            stroke="url(#vortex-upper)"
            strokeWidth={isHighBoost ? 2.2 : 1.6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={
              isHighBoost
                ? 'M -28 13 C -42 15, -60 17, -80 14'
                : 'M -28 13 C -40 14.5, -52 15, -66 13'
            }
            stroke="url(#vortex-lower)"
            strokeWidth={isHighBoost ? 2.2 : 1.6}
            fill="none"
            strokeLinecap="round"
          />

          {/* Central Exhaust Flame Plume */}
          <path
            d={
              isHighBoost
                ? 'M -27 0 Q -38 -5, -54 0 Q -38 5, -27 0 Z'
                : 'M -27 0 Q -34 -3.5, -44 0 Q -34 3.5, -27 0 Z'
            }
            fill="url(#exhaust-plume)"
          />
          {/* Incandescent Core Sparkle */}
          <circle
            cx="-29"
            cy="0"
            r={isHighBoost ? 2.5 : 1.6}
            fill="#FFE9AE"
            filter="drop-shadow(0 0 3px #FF6B35)"
          />
        </g>
      )}

      {/* 4. SUSPENSION WISHBONES */}
      <g stroke="#64748B" strokeWidth="0.85" strokeLinecap="round" opacity="0.9">
        {/* Front Left */}
        <line x1="17" y1="-10" x2="11" y2="-5" />
        <line x1="21" y1="-10" x2="15" y2="-5" />
        {/* Front Right */}
        <line x1="17" y1="10" x2="11" y2="5" />
        <line x1="21" y1="10" x2="15" y2="5" />
        {/* Rear Left */}
        <line x1="-19" y1="-9" x2="-12" y2="-5" />
        <line x1="-15" y1="-9" x2="-8" y2="-5" />
        {/* Rear Right */}
        <line x1="-19" y1="9" x2="-12" y2="5" />
        <line x1="-15" y1="9" x2="-8" y2="5" />
      </g>

      {/* 5. 4 LOW-PROFILE SLICK TIRES & MACHINED RIMS */}
      {/* Front Left Tire (x: 14 to 24, y: -13 to -8) */}
      <rect x="14" y="-13" width="10" height="5" rx="1.5" fill="#070B12" stroke="#1E293B" strokeWidth="0.8" />
      <circle cx="19" cy="-10.5" r="1.3" fill="#94A3B8" />
      {(isBraking || isMoving) && (
        <circle cx="19" cy="-10.5" r="2.2" fill="none" stroke="#FF6B35" strokeWidth="0.8" opacity="0.8" />
      )}

      {/* Front Right Tire (x: 14 to 24, y: 8 to 13) */}
      <rect x="14" y="8" width="10" height="5" rx="1.5" fill="#070B12" stroke="#1E293B" strokeWidth="0.8" />
      <circle cx="19" cy="10.5" r="1.3" fill="#94A3B8" />
      {(isBraking || isMoving) && (
        <circle cx="19" cy="10.5" r="2.2" fill="none" stroke="#FF6B35" strokeWidth="0.8" opacity="0.8" />
      )}

      {/* Rear Left Tire (x: -21 to -9, y: -13.5 to -8) */}
      <rect x="-21" y="-13.5" width="12" height="5.5" rx="1.5" fill="#070B12" stroke="#1E293B" strokeWidth="0.8" />
      <circle cx="-15" cy="-10.75" r="1.4" fill="#94A3B8" />

      {/* Rear Right Tire (x: -21 to -9, y: 8 to 13.5) */}
      <rect x="-21" y="8" width="12" height="5.5" rx="1.5" fill="#070B12" stroke="#1E293B" strokeWidth="0.8" />
      <circle cx="-15" cy="10.75" r="1.4" fill="#94A3B8" />

      {/* 6. SCULPTED CARBON MONOCOQUE CHASSIS & SIDEPODS */}
      <path
        d="M 27 0
           C 25 -2.5, 21 -4.2, 17 -4.8
           L 11 -5.2
           L 6 -9
           C 0 -9.5, -8 -9.5, -14 -8.5
           L -20 -8.5
           L -26 -11
           L -26 11
           L -20 8.5
           L -14 8.5
           C -8 9.5, 0 9.5, 6 9
           L 11 5.2
           L 17 4.8
           C 21 4.2, 25 2.5, 27 0 Z"
        fill="url(#carbon-chassis)"
        stroke="#475569"
        strokeWidth="0.6"
      />

      {/* Sidepod Radiator Louvers */}
      <g stroke="#0F172A" strokeWidth="0.6" opacity="0.8">
        <line x1="-3" y1="-8" x2="3" y2="-8" />
        <line x1="-5" y1="-6.5" x2="2" y2="-6.5" />
        <line x1="-3" y1="8" x2="3" y2="8" />
        <line x1="-5" y1="6.5" x2="2" y2="6.5" />
      </g>

      {/* 7. FRONT WING SPLITTER & ORANGE ENDPLATES */}
      <path
        d="M 23 -12 L 28 -12 L 28 -6 L 27 0 L 28 6 L 28 12 L 23 12"
        stroke="#FF6B35"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Front Wing Endplates */}
      <line x1="22" y1="-12" x2="28" y2="-12" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="22" y1="12" x2="28" y2="12" stroke="#FF6B35" strokeWidth="2.2" strokeLinecap="round" />

      {/* 8. REAR DUAL-ELEMENT DOWNFORCE WING & DIFFUSER */}
      {/* Diffuser Tunnels */}
      <path d="M -26 -5 L -29 -6.5 L -29 6.5 L -26 5 Z" fill="#070B12" stroke="#334155" strokeWidth="0.6" />
      {/* Rear Main Wing Blade */}
      <line x1="-27" y1="-12.5" x2="-27" y2="12.5" stroke="#F3EFE7" strokeWidth="2" strokeLinecap="round" />
      <line x1="-29" y1="-11" x2="-29" y2="11" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
      {/* Rear Wing Endplates */}
      <line x1="-26" y1="-13" x2="-30" y2="-13" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="-26" y1="13" x2="-30" y2="13" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" />

      {/* 9. COCKPIT CANOPY WITH EXPOSED GLOWING DOUBLE-HELIX DNA SPINE */}
      <ellipse cx="2" cy="0" rx="14" ry="4.2" fill="#070B12" stroke="#334155" strokeWidth="0.7" />

      {/* DNA Helix Strand 1 (Orange #FF6B35) */}
      <path
        d="M -9 0 Q -5 -3, 0 0 Q 5 3, 9 0 Q 13 -3, 16 0"
        stroke="url(#dna-spine-filament)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* DNA Helix Strand 2 (Warm Gold #F5D998) */}
      <path
        d="M -9 0 Q -5 3, 0 0 Q 5 -3, 9 0 Q 13 3, 16 0"
        stroke="#F5D998"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Base Pair Rungs connecting the strands */}
      <g stroke="#FFE9AE" strokeWidth="0.8" opacity="0.85">
        <line x1="-6" y1="-1.8" x2="-6" y2="1.8" />
        <line x1="-2" y1="-1.6" x2="-2" y2="1.6" />
        <line x1="3" y1="-1.6" x2="3" y2="1.6" />
        <line x1="7" y1="-1.8" x2="7" y2="1.8" />
        <line x1="12" y1="-1.4" x2="12" y2="1.4" />
      </g>

      {/* Central DNA Core Sparkle */}
      <circle cx="2" cy="0" r="1.5" fill="#FFE9AE" filter="drop-shadow(0 0 2px #FF6B35)" />

      {/* 10. REAR FIA RAIN-LIGHT (Center Red/Orange LED) */}
      <circle
        cx="-27"
        cy="0"
        r={isMoving ? 1.6 : 1.2}
        fill="#FF6B35"
        stroke="#FFE9AE"
        strokeWidth="0.4"
        className={isMoving ? 'animate-pulse' : ''}
      />
    </g>
  );
};

export default TrackAeroPod;
