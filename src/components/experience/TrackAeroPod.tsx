import React from 'react';

export interface TrackAeroPodProps {
  isMoving: boolean;
  boost?: 'normal' | 'high';
  className?: string;
}

/**
 * Top-Down DNA-Core Aero Prototype Vehicle (54px length x 26px width)
 *
 * Cinematic Visual Anatomy:
 * 1. Top-down Le Mans / Formula 1 prototype silhouette with sculpted carbon bodywork,
 *    multi-tier front wing with orange endplates, sidepod undercuts, low-profile slick tires with machined rims,
 *    and wide rear downforce diffuser/wing.
 * 2. Exposed glowing double-helix DNA-filament canopy in incandescent orange (#FF6B35) & warm gold (#F5D998),
 *    linking directly to the portfolio's Hero DNA lightbulb motif.
 * 3. Dynamic exhaust flame and dual aerodynamic vortex trails streaming along the track tangent in motion.
 * 4. Harmonic pulse & soft asphalt underglow when parked/idling.
 */
export const TrackAeroPod: React.FC<TrackAeroPodProps> = ({
  isMoving,
  boost = 'normal',
  className = '',
}) => {
  const isHighBoost = boost === 'high';

  return (
    <g className={`select-none pointer-events-none ${className}`}>
      <defs>
        {/* Soft Asphalt Underglow Gradient */}
        <radialGradient id="aero-underglow-cinematic" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity={isMoving ? 0.45 : 0.75} />
          <stop offset="50%" stopColor="#FF6B35" stopOpacity={isMoving ? 0.18 : 0.3} />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>

        {/* DNA Filament Core Linear Gradient */}
        <linearGradient id="dna-filament-grad-cinematic" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="45%" stopColor="#F5D998" />
          <stop offset="70%" stopColor="#FFE9AE" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>

        {/* Carbon Bodywork Gradient */}
        <linearGradient id="chassis-carbon-cinematic" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0B1322" />
          <stop offset="35%" stopColor="#1E293B" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#F3EFE7" />
        </linearGradient>

        {/* Exhaust Flame Gradient */}
        <linearGradient id="exhaust-flame-cinematic" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFE9AE" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#FF6B35" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#C8321E" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#C8321E" stopOpacity="0" />
        </linearGradient>

        {/* Aerodynamic Vortex Trail Gradient (Upper & Lower) */}
        <linearGradient id="vortex-upper-cinematic" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#82B7FF" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#82B7FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#82B7FF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="vortex-lower-cinematic" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#FF6B35" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </linearGradient>

        {/* Enhanced Glow Filter for DNA Filament */}
        <filter id="dna-glow-cinematic" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. SOFT ASPHALT UNDERGLOW */}
      <ellipse
        cx="0"
        cy="0"
        rx={isMoving ? 30 : 32}
        ry={isMoving ? 15 : 18}
        fill="url(#aero-underglow-cinematic)"
      />

      {/* 2. DYNAMIC EXHAUST & AERO VORTEX WAKE (Active during motion) */}
      {isMoving && (
        <g className="transition-opacity duration-200">
          {/* Dual Vortex Wake Streaming from Rear Wing Endplates */}
          <path
            d={
              isHighBoost
                ? 'M -27 -12 C -40 -13.5, -55 -15, -72 -13'
                : 'M -27 -12 C -38 -13, -48 -13.5, -60 -12.5'
            }
            stroke="url(#vortex-upper-cinematic)"
            strokeWidth={isHighBoost ? 2 : 1.5}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={
              isHighBoost
                ? 'M -27 12 C -40 13.5, -55 15, -72 13'
                : 'M -27 12 C -38 13, -48 13.5, -60 12.5'
            }
            stroke="url(#vortex-lower-cinematic)"
            strokeWidth={isHighBoost ? 2 : 1.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* Central Exhaust Flame Plume */}
          <path
            d={
              isHighBoost
                ? 'M -26 0 Q -34 -4, -48 0 Q -34 4, -26 0 Z'
                : 'M -26 0 Q -32 -3, -40 0 Q -32 3, -26 0 Z'
            }
            fill="url(#exhaust-flame-cinematic)"
          />
          {/* Incandescent Core Sparkle */}
          <circle
            cx="-28"
            cy="0"
            r={isHighBoost ? 2.4 : 1.6}
            fill="#FFE9AE"
            filter="drop-shadow(0 0 3px #FF6B35)"
          />
        </g>
      )}

      {/* 3. SUSPENSION WISHBONES (Carbon rods connecting hubs to tub) */}
      <g stroke="#64748B" strokeWidth="0.85" strokeLinecap="round" opacity="0.9">
        {/* Front Left Wishbones */}
        <line x1="16" y1="-10" x2="10" y2="-5" />
        <line x1="20" y1="-10" x2="14" y2="-5" />
        {/* Front Right Wishbones */}
        <line x1="16" y1="10" x2="10" y2="5" />
        <line x1="20" y1="10" x2="14" y2="5" />
        {/* Rear Left Wishbones */}
        <line x1="-18" y1="-9" x2="-11" y2="-5" />
        <line x1="-14" y1="-9" x2="-7" y2="-5" />
        {/* Rear Right Wishbones */}
        <line x1="-18" y1="9" x2="-11" y2="5" />
        <line x1="-14" y1="9" x2="-7" y2="5" />
      </g>

      {/* 4. TIRES (Low-profile dark prototype slicks with machined rim accents) */}
      <g>
        {/* Front Left Tire */}
        <rect x="12" y="-13.5" width="11" height="4.5" rx="1.5" fill="#070B12" stroke="#475569" strokeWidth="0.8" />
        <line x1="17.5" y1="-13" x2="17.5" y2="-9.5" stroke="#CBD5E1" strokeWidth="0.6" />

        {/* Front Right Tire */}
        <rect x="12" y="9" width="11" height="4.5" rx="1.5" fill="#070B12" stroke="#475569" strokeWidth="0.8" />
        <line x1="17.5" y1="9.5" x2="17.5" y2="13" stroke="#CBD5E1" strokeWidth="0.6" />

        {/* Rear Left Tire (Wide Prototype Slick) */}
        <rect x="-23" y="-13.8" width="13.5" height="5.5" rx="1.8" fill="#070B12" stroke="#475569" strokeWidth="0.8" />
        <line x1="-16.25" y1="-13" x2="-16.25" y2="-9" stroke="#CBD5E1" strokeWidth="0.6" />

        {/* Rear Right Tire (Wide Prototype Slick) */}
        <rect x="-23" y="8.3" width="13.5" height="5.5" rx="1.8" fill="#070B12" stroke="#475569" strokeWidth="0.8" />
        <line x1="-16.25" y1="9" x2="-16.25" y2="13" stroke="#CBD5E1" strokeWidth="0.6" />
      </g>

      {/* 5. AERO UNDERFLOOR & REAR DIFFUSER */}
      <path
        d="M -25 -7.5 L -21 -8.5 L 10 -8.5 L 15 -5 L 15 5 L 10 8.5 L -21 8.5 L -25 7.5 Z"
        fill="#070B12"
        stroke="#1E293B"
        strokeWidth="0.6"
      />
      {/* Diffuser vertical strakes */}
      <line x1="-26" y1="-4" x2="-21" y2="-4" stroke="#475569" strokeWidth="0.9" />
      <line x1="-26" y1="0" x2="-21" y2="0" stroke="#FF6B35" strokeWidth="1" />
      <line x1="-26" y1="4" x2="-21" y2="4" stroke="#475569" strokeWidth="0.9" />

      {/* 6. MAIN CHASSIS / MONOCOQUE SILHOUETTE */}
      <path
        d="
          M 26 0
          C 22 -2.2, 15 -4.8, 8 -5
          C 4 -5.5, -5 -8, -15 -8
          C -19 -8, -23 -7, -25 -5.5
          L -25 5.5
          C -23 7, -19 8, -15 8
          C -5 8, 4 5.5, 8 5
          C 15 4.8, 22 2.2, 26 0
          Z
        "
        fill="url(#chassis-carbon-cinematic)"
        stroke="#64748B"
        strokeWidth="0.75"
      />

      {/* Sidepod Radiator Air Intakes & Louver Slits */}
      <path d="M 5 -6 L -5 -7.5 L -9 -6.5 L 3 -5.2 Z" fill="#070B12" />
      <path d="M 5 6 L -5 7.5 L -9 6.5 L 3 5.2 Z" fill="#070B12" />

      {/* 7. FRONT WING (Multi-element aero wing with endplates) */}
      <g>
        {/* Main Wing Element */}
        <path
          d="M 22 -12 C 25 -11.5, 26.5 -6, 27 0 C 26.5 6, 25 11.5, 22 12 L 24 12 C 26.5 6, 27.5 2, 27.5 0 C 27.5 -2, 26.5 -6, 24 -12 Z"
          fill="#F3EFE7"
          stroke="#94A3B8"
          strokeWidth="0.5"
        />
        {/* Left Endplate */}
        <rect x="21.5" y="-13" width="5.5" height="1.3" rx="0.6" fill="#FF6B35" />
        {/* Right Endplate */}
        <rect x="21.5" y="11.7" width="5.5" height="1.3" rx="0.6" fill="#FF6B35" />
      </g>

      {/* 8. REAR WING (Wide high-downforce airfoil with endplates) */}
      <g>
        {/* Rear Wing Airfoil */}
        <rect x="-26.5" y="-12" width="3" height="24" rx="0.6" fill="#F3EFE7" stroke="#64748B" strokeWidth="0.5" />
        <line x1="-25" y1="-11" x2="-25" y2="11" stroke="#070B12" strokeWidth="0.8" />
        {/* Rear Wing Endplates */}
        <rect x="-27.5" y="-13" width="5.5" height="1.4" rx="0.6" fill="#FF6B35" />
        <rect x="-27.5" y="11.6" width="5.5" height="1.4" rx="0.6" fill="#FF6B35" />
      </g>

      {/* 9. EXPOSED DNA-FILAMENT ENGINE CANOPY (The Signature Lightbulb Tie-In) */}
      <g filter="url(#dna-glow-cinematic)">
        {/* Cockpit Canopy Glass Outline */}
        <ellipse cx="1" cy="0" rx="11" ry="4" fill="#070B12" stroke="rgba(243, 239, 231, 0.6)" strokeWidth="0.75" />

        {/* Double-Helix Filament Core */}
        {/* Strand Alpha (Sine Wave) */}
        <path
          d="
            M -8 0
            Q -5 -2.5, -2 0
            Q 1 2.5, 4 0
            Q 7 -2.5, 10 0
          "
          stroke="url(#dna-filament-grad-cinematic)"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Strand Beta (Opposing Sine Wave) */}
        <path
          d="
            M -8 0
            Q -5 2.5, -2 0
            Q 1 -2.5, 4 0
            Q 7 2.5, 10 0
          "
          stroke="#F5D998"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />

        {/* Base-Pair Cross Rungs */}
        <line x1="-4.5" y1="-1.6" x2="-4.5" y2="1.6" stroke="#F5D998" strokeWidth="0.75" opacity="0.85" />
        <line x1="-0.5" y1="-1.8" x2="-0.5" y2="1.8" stroke="#FF6B35" strokeWidth="0.8" opacity="0.9" />
        <line x1="3.5" y1="-1.6" x2="3.5" y2="1.6" stroke="#F5D998" strokeWidth="0.75" opacity="0.85" />
        <line x1="7.5" y1="-1.2" x2="7.5" y2="1.2" stroke="#FF6B35" strokeWidth="0.75" opacity="0.85" />

        {/* Center Photon Sparkle Node */}
        <circle cx="1" cy="0" r="1.6" fill="#FFE9AE" />
      </g>

      {/* 10. DRIVER HELMET / COCKPIT APEX */}
      <circle cx="2.5" cy="0" r="1.9" fill="#F3EFE7" stroke="#070B12" strokeWidth="0.6" />
      {/* Helmet Visor */}
      <path d="M 3 -1.3 Q 4.2 0, 3 1.3" stroke="#FF6B35" strokeWidth="0.7" fill="none" />
    </g>
  );
};

export default TrackAeroPod;
