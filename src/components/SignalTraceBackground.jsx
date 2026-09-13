import React, { useEffect, useState } from 'react';
import AntigravityParticles from './AntigravityParticles';

const SignalTraceBackground = () => {
 const [traces, setTraces] = useState([]);

 useEffect(() => {
  // Generate random traces for the background
  const newTraces = Array.from({ length: 5 }).map((_, i) => ({
   id: i,
   top: `${Math.random() * 80 + 10}%`,
   opacity: Math.random() * 0.15 + 0.05,
   duration: Math.random() * 20 + 20,
   delay: Math.random() * 10,
   width: `${Math.random() * 40 + 60}%`,
  }));
  setTraces(newTraces);
 }, []);

 return (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
   {/* Grid Texture */}
   <div 
    className="absolute inset-0 opacity-[0.03]" 
    style={{
     backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
     backgroundSize: '40px 40px'
    }}
   />

   {/* Signal Traces */}
   {traces.map((trace) => (
    <div
     key={trace.id}
     className="absolute h-[1px] bg-gradient-to-r from-transparent via-cine-teal to-transparent"
     style={{
      top: trace.top,
      width: trace.width,
      opacity: trace.opacity,
      animation: `traceSweep ${trace.duration}s linear ${trace.delay}s infinite`,
      transform: 'translateX(-100%)'
     }}
    />
   ))}

   {/* Vertical Data Stream */}
   <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-gradient-to-b from-transparent via-cine-lavender/10 to-transparent" />
   <div className="absolute top-0 bottom-0 right-[25%] w-[1px] bg-gradient-to-b from-transparent via-cine-teal/10 to-transparent" />

   {/* Google Antigravity Interactive Particle Field */}
   <AntigravityParticles />

   {/* Vignette */}
   <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#050505] opacity-75 pointer-events-none" />

   <style jsx>{`
    @keyframes traceSweep {
     0% { transform: translateX(-100%); }
     100% { transform: translateX(200vw); }
    }
    .bg-radial-gradient {
     background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 60%, var(--tw-gradient-to) 100%);
    }
   `}</style>
  </div>
 );
};

export default SignalTraceBackground;
