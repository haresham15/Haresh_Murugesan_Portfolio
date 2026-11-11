import React, { useState, useRef, useCallback } from 'react';
import { useCanvasStage } from '../hooks/useCanvasStage';
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
  colorType: 0 | 1 | 2; // 0: White-Silver, 1: Machined Silver, 2: Dark Cobalt
}

export const WheelNavTrigger: React.FC<WheelNavTriggerProps> = ({ isOpen, onToggle }) => {
  const { isReduced } = useMotionPreference();
  const [isHovered, setIsHovered] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const smokeParticlesRef = useRef<SmokeParticle[]>([]);
  const [smoking, setSmoking] = useState(false);

  // Volumetric Smoke Particle Emitter: spawns 30 turbulent radial-gradient smoke puffs
  const triggerBurnoutSmoke = useCallback(() => {
    if (isReduced) return;
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;


    // Contact patch origin relative to 180x180 canvas (bottom-left of wheel hub at (75, 115))
    const originX = 75;
    const originY = 115;

    const newParticles: SmokeParticle[] = [];
    for (let i = 0; i < 30; i++) {
      const angle = Math.PI * 0.72 + (Math.random() - 0.5) * 1.25; // down-left turbulent plume
      const speed = 1.2 + Math.random() * 3.4;
      const colorRand = Math.random();
      const colorType: 0 | 1 | 2 = colorRand < 0.45 ? 0 : colorRand < 0.75 ? 1 : 2;

      newParticles.push({
        x: originX + (Math.random() - 0.5) * 16,
        y: originY + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 10 + Math.random() * 6,
        maxRadius: 50 + Math.random() * 20,
        alpha: 0.42 + Math.random() * 0.18,
        life: 0,
        maxLife: 45 + Math.floor(Math.random() * 15), // ~750ms at 60fps
        curlFreq: 0.07 + Math.random() * 0.14,
        curlAmp: 0.6 + Math.random() * 0.7,
        colorType,
      });
    }

    smokeParticlesRef.current = newParticles;

    setSmoking(true);
  }, [isReduced]);

  useCanvasStage(smokeCanvasRef, smokeCanvasRef, (ctx, { width, height, deltaTime }) => {
      ctx.clearRect(0, 0, width, height);
      if (isReduced) return;
      ctx.scale(width / 180, height / 180);
      const particles = smokeParticlesRef.current;
      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += deltaTime / (1000 / 60);
        if (p.life >= p.maxLife) continue;
        activeCount++;

        const progress = p.life / p.maxLife;
        // Turbulent curl velocity & thermal buoyancy
        p.vx += Math.sin(p.life * p.curlFreq) * p.curlAmp;
        p.vy += Math.cos(p.life * p.curlFreq) * (p.curlAmp * 0.45) - 0.09;
        p.x += p.vx;
        p.y += p.vy;

        const currentR = p.radius + (p.maxRadius - p.radius) * Math.pow(progress, 0.62);
        const currentAlpha = p.alpha * (1 - progress);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentR);
        if (p.colorType === 0) {
          // White-Silver specular puff
          grad.addColorStop(0, `rgba(230, 236, 245, ${(0.42 * currentAlpha).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(200, 210, 224, ${(0.22 * currentAlpha).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(200, 210, 224, 0)');
        } else if (p.colorType === 1) {
          // Machined Silver smoke
          grad.addColorStop(0, `rgba(200, 210, 224, ${(0.32 * currentAlpha).toFixed(3)})`);
          grad.addColorStop(0.55, `rgba(126, 139, 155, ${(0.16 * currentAlpha).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(126, 139, 155, 0)');
        } else {
          // Dark Cobalt shadow vapor
          grad.addColorStop(0, `rgba(24, 69, 139, ${(0.25 * currentAlpha).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(11, 30, 64, ${(0.15 * currentAlpha).toFixed(3)})`);
          grad.addColorStop(1, 'rgba(11, 30, 64, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (activeCount === 0 && smoking) setSmoking(false);
  }, { animate: smoking && !isReduced });

  const handleClick = () => {
    if (!isReduced) {
      // Spin rotating wheel group by +1080deg over 650ms
      setRotationDeg((prev) => prev + 1080);
      triggerBurnoutSmoke();
    }
    onToggle();
  };

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
      {/* 180px x 180px Overlaid HTML5 Canvas for Burnout Smoke Burst */}
      <canvas
        ref={smokeCanvasRef}
        width={180}
        height={180}
        className="absolute pointer-events-none z-0"
        style={{
          width: '180px',
          height: '180px',
          left: '-58px',
          top: '-24px',
        }}
        aria-hidden="true"
      />

      {/* 64px x 64px Precision Engineered Wheel Rim Trigger Button */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative z-10 w-[64px] h-[64px] rounded-full p-0 flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#FF2800] focus-visible:outline-offset-4 select-none"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        {/* Anisotropic Specular Halo on Hover / Open */}
        <div
          className={`absolute inset-[-6px] rounded-full transition-opacity duration-300 pointer-events-none ${
            isOpen || isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(255, 40, 0, 0.25) 0%, rgba(21, 56, 117, 0.18) 50%, transparent 72%)',
          }}
        />

        {/* 7-LAYER PARAMETRIC MOTORSPORT WHEEL SVG (viewBox="0 0 100 100") */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full shadow-[0_6px_24px_rgba(3,5,10,0.92)] group-hover:shadow-[0_0_28px_rgba(255,40,0,0.4)] rounded-full"
          aria-hidden="true"
        >
          <defs>
            {/* Brushed Chrome Outer Barrel Gradient */}
            <linearGradient id="chromeRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E6ECF5" />
              <stop offset="60%" stopColor="#C8D2E0" />
              <stop offset="85%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Machined Silver Spoke Face Gradient */}
            <linearGradient id="silverSpokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#E6ECF5" />
              <stop offset="70%" stopColor="#C8D2E0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Reddish-Orange Brembo Caliper Gradient */}
            <linearGradient id="bremboCaliperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4419" />
              <stop offset="55%" stopColor="#FF2800" />
              <stop offset="100%" stopColor="#D92000" />
            </linearGradient>

            <filter id="rotorShadow">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* LAYER 1: Low-Profile Performance Tire Ring */}
          <circle cx="50" cy="50" r="48" fill="#05080F" stroke="#0F172A" strokeWidth="3.5" />

          {/* LAYER 2: Stationary Brake Rotor & Reddish-Orange Caliper (Does NOT Rotate With Wheel) */}
          <g id="stationary-brake-rotor">
            {/* Cross-drilled dark steel rotor disc */}
            <circle cx="50" cy="50" r="33" fill="#0B1322" stroke="#1E293B" strokeWidth="1" filter="url(#rotorShadow)" />
            {/* Concentric friction grooves */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.35" />
            <circle cx="50" cy="50" r="27" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.35" />

            {/* Curved Reddish-Orange (#FF2800) Brake Caliper at 10 o'clock (135°–195°, r=24..32) */}
            <path
              d="M 27.37 72.63 A 32 32 0 0 1 19.09 41.72 L 24.87 43.26 A 25 25 0 0 0 31.61 68.39 Z"
              fill="url(#bremboCaliperGrad)"
              stroke="#FF4419"
              strokeWidth="0.8"
            />
            {/* Dual machined caliper pistons */}
            <circle cx="23" cy="54" r="2.2" fill="#03050A" stroke="#C8D2E0" strokeWidth="0.6" />
            <circle cx="27" cy="63" r="2.2" fill="#03050A" stroke="#C8D2E0" strokeWidth="0.6" />
            <line x1="20.5" y1="46" x2="24.5" y2="47" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* ROTATING WHEEL ASSEMBLY (Layers 3 through 7) */}
          <g style={getRotationStyle()}>
            {/* LAYER 3: Brushed Chrome Outer Barrel */}
            <circle cx="50" cy="50" r="44.5" fill="none" stroke="url(#chromeRimGrad)" strokeWidth="2.2" />

            {/* LAYER 4: 36-Pocket Slotted Aero Fenestration Ring */}
            {/* Dark pocket bed */}
            <circle cx="50" cy="50" r="40.5" fill="none" stroke="#03050A" strokeWidth="5.2" />
            {/* 36 machined silver ribs */}
            <circle
              cx="50"
              cy="50"
              r="40.5"
              fill="none"
              stroke="url(#silverSpokeGrad)"
              strokeWidth="5.2"
              strokeDasharray="2.1 4.88"
            />
            {/* Inner aero lip */}
            <circle cx="50" cy="50" r="37.5" fill="none" stroke="#C8D2E0" strokeWidth="1.1" />

            {/* LAYER 5: 6 Split-Y Spokes + Interlaced Diamond Mesh Lattice */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 50 50)`}>
                {/* Pass 1: Gunmetal chamfer shadow (#64748B) */}
                <path
                  d="M 50 36.5 L 46 27.5 L 39.5 13.5 L 43.5 13 L 47.8 25 L 49.2 25 L 50 28 L 50.8 25 L 52.2 25 L 56.5 13 L 60.5 13.5 L 54 27.5 L 50 36.5 Z"
                  fill="#64748B"
                  opacity="0.95"
                />
                {/* Pass 2: Bright brushed silver face (#E6ECF5 / url(#silverSpokeGrad)) */}
                <path
                  d="M 50 35.5 L 46.8 27.2 L 41 13.5 L 43.8 13 L 48.2 25.2 L 50 28.5 L 51.8 25.2 L 56.2 13 L 59 13.5 L 53.2 27.2 L 50 35.5 Z"
                  fill="url(#silverSpokeGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="0.35"
                />
                {/* Center spoke fluting line */}
                <line x1="50" y1="36" x2="50" y2="28.5" stroke="#1E293B" strokeWidth="0.65" />
              </g>
            ))}

            {/* LAYER 6: 6 Recessed Dark Lug Wells (r = 11, angle = i * 60° + 30°, r_well = 2.1) */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = ((deg + 30) * Math.PI) / 180;
              const lx = 50 + 11 * Math.cos(rad);
              const ly = 50 + 11 * Math.sin(rad);
              return (
                <circle
                  key={deg}
                  cx={lx}
                  cy={ly}
                  r="2.1"
                  fill="#03050A"
                  stroke="#94A3B8"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* LAYER 7: Brushed Center Cap & Horizontal Emblem Bar */}
            <circle cx="50" cy="50" r="7.2" fill="url(#chromeRimGrad)" stroke="#475569" strokeWidth="0.9" />
            <rect x="44.5" y="48.8" width="11" height="2.4" rx="1" fill="#03050A" />
            <rect
              x="45.5"
              y="49.5"
              width="9"
              height="1"
              rx="0.5"
              fill={isOpen ? '#FF2800' : '#C8D2E0'}
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default WheelNavTrigger;
