import React, { useState } from 'react';
import { useMotionPreference } from './MotionPreference';

interface WheelNavTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const WheelNavTrigger: React.FC<WheelNavTriggerProps> = ({ isOpen, onToggle }) => {
  const { isReduced } = useMotionPreference();
  const [isHovered, setIsHovered] = useState(false);

  // 6 Primary Twin Y-Spoke Angles
  const spokeAngles = [0, 60, 120, 180, 240, 300];

  // 12 Outer Perimeter Tick Mark Angles (every 30°)
  const tickAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  // Smooth, instantaneous rotation calculation
  const getRotationStyle = () => {
    if (isReduced) return {};
    const angle = isOpen ? 90 : isHovered ? 20 : 0;
    return {
      transform: `rotate(${angle}deg)`,
      transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'transform',
    };
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Precision Engineered Wheel Rim Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative z-10 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full p-0 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#FF6B35] focus-visible:outline-offset-4 select-none"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        {/* Soft Ambient Specular Halo on Hover / Open */}
        <div
          className={`absolute inset-[-4px] rounded-full transition-opacity duration-300 pointer-events-none ${
            isOpen || isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(255, 107, 53, 0.24) 0%, rgba(245, 217, 152, 0.08) 50%, transparent 72%)',
          }}
        />

        {/* Scalable High-Precision SVG Turbofan Alloy Wheel */}
        <svg
          viewBox="-100 -100 200 200"
          className="w-full h-full shadow-[0_4px_16px_rgba(7,11,18,0.8)] group-hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] rounded-full"
          style={getRotationStyle()}
          aria-hidden="true"
        >
          <defs>
            {/* Outer Rim Bezel Gradient */}
            <linearGradient id="wheelRimBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#253243" />
              <stop offset="50%" stopColor="#101724" />
              <stop offset="100%" stopColor="#080C14" />
            </linearGradient>

            {/* Brushed Silver Face Gradient */}
            <linearGradient id="wheelSilverFace" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Chamfer Depth Gradient */}
            <linearGradient id="wheelChamferDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Hub Cavity Gradient */}
            <radialGradient id="wheelHubRotor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#070B12" />
              <stop offset="65%" stopColor="#101927" />
              <stop offset="100%" stopColor="#1A2638" />
            </radialGradient>
          </defs>

          {/* 1. Low-Profile Tire Sidewall & Outer Bezel */}
          <circle r="98" fill="url(#wheelRimBezel)" stroke="#1A2536" strokeWidth="1" />
          <circle r="93" fill="none" stroke="#2D3B4E" strokeWidth="0.8" />
          <circle r="90" fill="#070B12" />

          {/* 2. 12 Precision Perimeter Datum Ticks */}
          {tickAngles.map((deg) => {
            const isCardinal = deg % 90 === 0;
            return (
              <g key={deg} transform={`rotate(${deg})`}>
                <line
                  x1="0"
                  y1={isCardinal ? '82' : '85'}
                  x2="0"
                  y2="89"
                  stroke={isCardinal ? '#FF6B35' : 'rgba(243, 239, 231, 0.22)'}
                  strokeWidth={isCardinal ? '1.2' : '0.8'}
                />
              </g>
            );
          })}

          {/* 3. Deep Rotor Disk Cavity */}
          <circle r="81" fill="#090D15" stroke="rgba(243, 239, 231, 0.12)" strokeWidth="0.8" />
          <circle r="60" fill="none" stroke="#131D2C" strokeWidth="14" opacity="0.8" />

          {/* 4. 6 Aerodynamic Slotted Spoke Vanes */}
          {spokeAngles.map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              {/* Spoke Chamfered Relief */}
              <path
                d="M -7 26 L -9 45 L -16 66 L -9 80 L -6 80 L -11 65 L -3 45 L 0 45 L 3 45 L 11 65 L 6 80 L 9 80 L 16 66 L 9 45 L 7 26 Z"
                fill="url(#wheelChamferDepth)"
              />
              <path
                d="M -16 66 L -26 66 L -21 80 L -17 80 Z"
                fill="url(#wheelChamferDepth)"
              />
              <path
                d="M 16 66 L 26 66 L 21 80 L 17 80 Z"
                fill="url(#wheelChamferDepth)"
              />

              {/* Brushed Metallic Spoke Face */}
              <path
                d="M -5.5 26 L -7 44 L -14 65 L -8 79.5 L -5.5 79.5 L -10 64 L -2.5 44 L 0 44 L 2.5 44 L 10 64 L 5.5 79.5 L 8 79.5 L 14 65 L 7 44 L 5.5 26 Z"
                fill="url(#wheelSilverFace)"
                stroke="#FFFFFF"
                strokeWidth="0.4"
                strokeOpacity="0.85"
              />
              <path
                d="M -14 65 L -23.5 65 L -19.5 79.5 L -17 79.5 Z"
                fill="url(#wheelSilverFace)"
                stroke="#FFFFFF"
                strokeWidth="0.3"
                strokeOpacity="0.75"
              />
              <path
                d="M 14 65 L 23.5 65 L 19.5 79.5 L 17 79.5 Z"
                fill="url(#wheelSilverFace)"
                stroke="#FFFFFF"
                strokeWidth="0.3"
                strokeOpacity="0.75"
              />

              {/* Recessed Milling Line */}
              <line x1="0" y1="28" x2="0" y2="44" stroke="#475569" strokeWidth="0.9" strokeLinecap="round" />
            </g>
          ))}

          {/* 5. Center Hub Collar Assembly */}
          <circle r="27" fill="url(#wheelHubRotor)" stroke="#475569" strokeWidth="1" />
          <circle r="25" fill="none" stroke="rgba(243, 239, 231, 0.15)" strokeWidth="0.6" />

          {/* 6 Lug Bolts */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <g key={deg} transform={`rotate(${deg + 30})`}>
              <circle cx="18" cy="0" r="3.2" fill="#0C131D" stroke="#64748B" strokeWidth="0.5" />
              <circle cx="18" cy="0" r="1.5" fill="#CBD5E1" />
            </g>
          ))}

          {/* 6. Center Cap Dynamic Status Morph (HM <-> Close Cross) */}
          <circle
            r="12.5"
            fill={isOpen ? '#0B0F17' : '#141D2B'}
            stroke={isOpen ? '#FF6B35' : 'rgba(243, 239, 231, 0.35)'}
            strokeWidth={isOpen ? '1.5' : '1'}
            className="transition-colors duration-200"
          />

          {isOpen ? (
            /* Razor-Sharp Close Crosshair (✕) */
            <g className="text-[#FF6B35]">
              <line x1="-4.5" y1="-4.5" x2="4.5" y2="4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="4.5" y1="-4.5" x2="-4.5" y2="4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ) : (
            /* Precision Monospace Monogram */
            <text
              x="0"
              y="2.3"
              textAnchor="middle"
              fill="#F3EFE7"
              fontSize="4.2"
              fontFamily="'Geist Mono', monospace"
              fontWeight="600"
              letterSpacing="0.06em"
              className="group-hover:fill-[#F5D998] transition-colors"
            >
              HM
            </text>
          )}
        </svg>

        {/* Monospace MENU / CLOSE Sub-Label */}
        <span
          className={`absolute -bottom-5 text-[9.5px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 pointer-events-none select-none ${
            isOpen ? 'text-[#FF6B35] font-semibold' : 'text-[#A7B2C3] group-hover:text-[#F3EFE7]'
          }`}
        >
          {isOpen ? 'CLOSE' : 'MENU'}
        </span>
      </button>
    </div>
  );
};

export default WheelNavTrigger;
