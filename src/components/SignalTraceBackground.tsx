import React from 'react';

export const SignalTraceBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* 1. Deep Obsidian to Midnight Prussian Base */}
      <div className="absolute inset-0 bg-[#07090D]" />

      {/* 2. Architectural Cobalt Radial Lighting Troughs */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 80% 0%, #162B4C 0%, #102038 40%, transparent 75%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(circle at 10% 90%, #102038 0%, transparent 60%)',
        }}
      />

      {/* 3. 35mm Analog Film Grain Overlay */}
      <div className="film-grain-overlay" />
    </div>
  );
};

export default SignalTraceBackground;
