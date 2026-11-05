import React from 'react';

export const SignalTraceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* 1. Deep Obsidian Base */}
      <div className="absolute inset-0 bg-[#070B12]" />

      {/* 2. Concept D Architectural Drafting Blueprint Grid (Subtle 45° & Orthogonal Guidelines) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="arch-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#F3EFE7" strokeWidth="0.75" />
            <circle cx="80" cy="80" r="1" fill="#82B7FF" />
          </pattern>
          <pattern id="diag-datum" width="160" height="160" patternUnits="userSpaceOnUse">
            <line x1="0" y1="160" x2="160" y2="0" stroke="#82B7FF" strokeWidth="0.5" strokeDasharray="4 8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arch-grid)" />
        <rect width="100%" height="100%" fill="url(#diag-datum)" opacity="0.6" />
      </svg>

      {/* 3. Longitudinal Swiss Architectural Chassis Hairlines (Framing max-w-[1360px]) */}
      <div className="absolute inset-0 max-w-[1360px] mx-auto border-x border-[#F3EFE7]/[0.045] pointer-events-none">
        {/* Subtle Vertical Station Ticks */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#82B7FF]/10 via-transparent to-[#FF6B35]/10" />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#82B7FF]/10 via-transparent to-[#FF6B35]/10" />
      </div>

      {/* 4. Architectural Cobalt Radial Lighting Troughs */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 85% 15%, #162B4C 0%, #102038 35%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 10% 85%, #102038 0%, transparent 60%)',
        }}
      />

      {/* 5. 35mm Analog Film Grain Overlay */}
      <div className="film-grain-overlay" />
    </div>
  );
};

export default SignalTraceBackground;
