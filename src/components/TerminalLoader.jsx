import React, { useState, useEffect } from 'react';

const TerminalLoader = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      { delay: 400, action: () => setStep(1) }, // type npm install
      { delay: 1000, action: () => setStep(2) }, // show fetching
      { delay: 1800, action: () => setStep(3) }, // show installed
      { delay: 2400, action: () => setStep(4) }, // type npm run dev
      { delay: 3000, action: () => setStep(5) }, // show server running
    ];

    let timer;
    let currentDelay = 0;
    
    sequence.forEach(({ delay, action }) => {
      timer = setTimeout(action, delay);
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-mono text-sm md:text-base w-full max-w-2xl bg-[#0a0a0a] rounded-xl p-6 border border-white/10 shadow-2xl">
      <div className="flex gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      
      <div className="space-y-2 text-light-gray">
        <p><span className="text-neon-purple">haresh@dev-rig</span>:<span className="text-blue-400">~/portfolio</span>$ {step >= 1 && "npm install neural-engine"}</p>
        {step >= 2 && <p className="text-gray-500">fetchMetadata: sill resolveWithNewModule @react-three/fiber</p>}
        {step >= 3 && <p className="text-green-400">added 142 packages, and audited 143 packages in 2s</p>}
        
        {step >= 4 && (
          <p className="mt-4"><span className="text-neon-purple">haresh@dev-rig</span>:<span className="text-blue-400">~/portfolio</span>$ npm run dev</p>
        )}
        {step >= 5 && (
          <>
            <p className="text-yellow-400">&gt; portfolio@1.0.0 dev</p>
            <p className="text-yellow-400">&gt; next dev</p>
            <p className="text-neon-cyan mt-2">ready - started server on 0.0.0.0:3000, url: http://localhost:3000</p>
            <p className="text-green-400 animate-pulse mt-2">Initializing WebGL rendering context...</p>
          </>
        )}
        
        {step < 5 && (
          <p><span className="animate-pulse font-bold text-neon-cyan">_</span></p>
        )}
      </div>
    </div>
  );
};

export default TerminalLoader;
