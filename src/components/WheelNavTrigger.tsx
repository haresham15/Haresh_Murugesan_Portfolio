import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMotionPreference } from './MotionPreference';

interface WheelNavTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;
  maxLife: number;
  curlFreq: number;
  curlAmp: number;
}

export const WheelNavTrigger: React.FC<WheelNavTriggerProps> = ({ isOpen, onToggle }) => {
  const { isReduced } = useMotionPreference();
  const [isHovered, setIsHovered] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const smokeParticlesRef = useRef<SmokeParticle[]>([]);
  const smokeAnimRef = useRef<number | null>(null);

  // Spawn and animate 28 turbulent canvas smoke particles at bottom-left contact patch
  const triggerBurnoutSmoke = useCallback(() => {
    if (isReduced) return;
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Contact patch origin relative to canvas
    const originX = 55;
    const originY = 65;

    const newParticles: SmokeParticle[] = [];
    for (let i = 0; i < 28; i++) {
      const angle = Math.PI * 0.75 + (Math.random() - 0.5) * 1.1; // down-left drift
      const speed = 1.0 + Math.random() * 2.8;
      newParticles.push({
        x: originX + (Math.random() - 0.5) * 14,
        y: originY + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 8 + Math.random() * 4,
        maxRadius: 45 + Math.random() * 15,
        alpha: 0.35 + Math.random() * 0.15,
        life: 0,
        maxLife: 40 + Math.floor(Math.random() * 15), // ~750ms
        curlFreq: 0.08 + Math.random() * 0.12,
        curlAmp: 0.5 + Math.random() * 0.6,
      });
    }

    smokeParticlesRef.current = newParticles;

    if (smokeAnimRef.current) {
      cancelAnimationFrame(smokeAnimRef.current);
    }

    const renderSmoke = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = smokeParticlesRef.current;
      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) continue;
        activeCount++;

        const progress = p.life / p.maxLife;
        // Turbulent curl velocity
        p.vx += Math.sin(p.life * p.curlFreq) * p.curlAmp;
        p.vy += Math.cos(p.life * p.curlFreq) * (p.curlAmp * 0.5) - 0.08; // subtle buoyancy
        p.x += p.vx;
        p.y += p.vy;

        const currentR = p.radius + (p.maxRadius - p.radius) * Math.pow(progress, 0.65);
        const currentAlpha = p.alpha * (1 - progress);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR);
        grad.addColorStop(0, `rgba(243, 239, 231, ${(0.35 * currentAlpha).toFixed(3)})`);
        grad.addColorStop(0.45, `rgba(148, 163, 184, ${(0.18 * currentAlpha).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(148, 163, 184, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (activeCount > 0) {
        smokeAnimRef.current = requestAnimationFrame(renderSmoke);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        smokeAnimRef.current = null;
      }
    };

    smokeAnimRef.current = requestAnimationFrame(renderSmoke);
  }, [isReduced]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (smokeAnimRef.current) cancelAnimationFrame(smokeAnimRef.current);
    };
  }, []);

  const handleClick = () => {
    if (!isReduced) {
      setRotationDeg((prev) => prev + 1080);
      triggerBurnoutSmoke();
    }
    onToggle();
  };

  // Rotation style for wheel assembly (Layer 3-7)
  const getRotationStyle = () => {
    if (isReduced) return {};
    const hoverAngle = !isOpen && isHovered ? 25 : 0;
    const totalAngle = rotationDeg + (isOpen ? 90 : 0) + hoverAngle;
    return {
      transform: `rotate(${totalAngle}deg)`,
      transformOrigin: '50px 50px',
      transition: 'transform 650ms cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'transform',
    };
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* High-Resolution HTML5 Canvas for Burnout Smoke Burst */}
      <canvas
        ref={smokeCanvasRef}
        width={140}
        height={140}
        className="absolute pointer-events-none z-0"
        style={{
          width: '140px',
          height: '140px',
          left: '-48px',
          top: '-12px',
        }}
        aria-hidden="true"
      />

      {/* 60px x 60px Precision Engineered Wheel Rim Trigger Button */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative z-10 w-[54px] h-[54px] sm:w-[60px] sm:h-[60px] rounded-full p-0 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#FF6B35] focus-visible:outline-offset-4 select-none"
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
              'radial-gradient(circle, rgba(255, 107, 53, 0.28) 0%, rgba(245, 217, 152, 0.1) 50%, transparent 72%)',
          }}
        />

        {/* 7-LAYER PARAMETRIC MOTORSPORT WHEEL SVG (viewBox 0 0 100 100) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full shadow-[0_4px_16px_rgba(7,11,18,0.85)] group-hover:shadow-[0_0_24px_rgba(255,107,53,0.35)] rounded-full"
          aria-hidden="true"
        >
          <defs>
            {/* Outer Rim Chrome Gradient */}
            <linearGradient id="wheelChromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#CBD5E1" />
              <stop offset="60%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Brushed Silver Face Gradient */}
            <linearGradient id="wheelSilverFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="80%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            {/* Orange Brembo Caliper Gradient */}
            <linearGradient id="wheelBremboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8547" />
              <stop offset="55%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#D94814" />
            </linearGradient>

            <filter id="rotorShadow">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* LAYER 1: Performance Tire Ring */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="#0F141D" strokeWidth="4" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="#1E293B" strokeWidth="0.8" opacity="0.6" />

          {/* LAYER 2: Stationary Brake Rotor & Orange Brembo Caliper (Does NOT Rotate With Wheel) */}
          <g id="stationary-brake-rotor">
            {/* Steel brake rotor disc */}
            <circle cx="50" cy="50" r="32" fill="#1E293B" stroke="#334155" strokeWidth="1" filter="url(#rotorShadow)" />
            {/* Concentric friction grooves */}
            <circle cx="50" cy="50" r="29" fill="none" stroke="#2D3B4E" strokeWidth="0.6" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="#2D3B4E" strokeWidth="0.6" strokeDasharray="4 3" />

            {/* Orange Brembo Caliper positioned between 135° and 195° (top-left/left side) */}
            <path
              d="M 27.37 72.63 A 32 32 0 0 1 19.09 41.72 L 24.87 43.26 A 26 26 0 0 0 31.61 68.39 Z"
              fill="url(#wheelBremboGrad)"
              stroke="#FF9565"
              strokeWidth="0.75"
            />
            {/* Caliper machined pistons & detail */}
            <circle cx="23" cy="54" r="2.2" fill="#1E293B" stroke="#FFD8BE" strokeWidth="0.6" />
            <circle cx="27" cy="63" r="2.2" fill="#1E293B" stroke="#FFD8BE" strokeWidth="0.6" />
            <line x1="21" y1="46" x2="25" y2="47" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* ROTATING WHEEL ASSEMBLY (Layers 3 through 7) */}
          <g style={getRotationStyle()}>
            {/* LAYER 3: Outer Brushed Barrel */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#wheelChromeGrad)" strokeWidth="2.5" />

            {/* LAYER 4: The 36-Pocket Slotted Aero Fenestration Ring */}
            {/* Dark recessed pocket ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#090D14" strokeWidth="5.5" />
            {/* 36 machined silver aero ribs: strokeDasharray 2.2 4.78 (36 * 6.98 = 251.3 ~ 2*PI*40) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#wheelSilverFace)"
              strokeWidth="5.5"
              strokeDasharray="2.2 4.78"
            />
            {/* Inner aero boundary ring */}
            <circle cx="50" cy="50" r="37" fill="none" stroke="#CBD5E1" strokeWidth="1.2" />

            {/* LAYER 5: 12 Interlaced Split-Y & Mesh Spokes (6 Primary Spokes) */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 50 50)`}>
                {/* Gunmetal depth shadow pass */}
                <path
                  d="M 50 36 L 46 27 L 40 14 L 43.5 13.5 L 47.8 25 L 49.2 25 L 50 28 L 50.8 25 L 52.2 25 L 56.5 13.5 L 60 14 L 54 27 L 50 36 Z"
                  fill="#475569"
                  opacity="0.95"
                />
                {/* Machined silver face pass */}
                <path
                  d="M 50 35 L 46.8 27 L 41.5 14 L 44 13.5 L 48.2 25.2 L 50 28.5 L 51.8 25.2 L 56 13.5 L 58.5 14 L 53.2 27 L 50 35 Z"
                  fill="url(#wheelSilverFace)"
                  stroke="#FFFFFF"
                  strokeWidth="0.3"
                />
                {/* Center spoke fluting line */}
                <line x1="50" y1="36" x2="50" y2="28.5" stroke="#1E293B" strokeWidth="0.6" />
              </g>
            ))}

            {/* LAYER 6: 6 Recessed Lug Nut Wells (angle = i*60 + 30 deg at r = 11.5) */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = ((deg + 30) * Math.PI) / 180;
              const lx = 50 + 11.5 * Math.cos(rad);
              const ly = 50 + 11.5 * Math.sin(rad);
              return (
                <circle
                  key={deg}
                  cx={lx}
                  cy={ly}
                  r="2.2"
                  fill="#070B12"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* LAYER 7: Center Cap & Monogram Bar */}
            <circle cx="50" cy="50" r="7.5" fill="url(#wheelChromeGrad)" stroke="#475569" strokeWidth="1" />
            {/* Crisp horizontal dark emblem slot */}
            <rect x="44.5" y="48.8" width="11" height="2.4" rx="1" fill="#070B12" />
            <rect
              x="45.5"
              y="49.5"
              width="9"
              height="1"
              rx="0.5"
              fill={isOpen ? '#FF6B35' : '#F5D998'}
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default WheelNavTrigger;
