import React, { useState, useEffect, useRef } from 'react';

export type ApexisTab = 'oscilloscope' | 'sectors' | 'worker';

export const PlateApexis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ApexisTab>('oscilloscope');
  const [scrubT, setScrubT] = useState<number>(0.48); // 0.0 to 1.0 along the lap
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic telemetry metrics computed continuously from scrubT
  // Sector 1: [0.0 - 0.33], Sector 2: [0.33 - 0.66], Sector 3: [0.66 - 1.0]
  const currentSector = scrubT < 0.33 ? 1 : scrubT < 0.66 ? 2 : 3;

  // Real-time speed trace modeling: fast straights (312 km/h), heavy braking into chicanes (118 km/h)
  const baseSpeed =
    currentSector === 1
      ? 285 + Math.sin(scrubT * Math.PI * 6) * 32
      : currentSector === 2
      ? 195 + Math.sin(scrubT * Math.PI * 6) * 75
      : 308 - Math.sin((scrubT - 0.66) * Math.PI * 4) * 45;

  const verSpeed = Math.round(baseSpeed);
  const norSpeed = Math.round(baseSpeed * 0.985 - 2);
  const lecSpeed = Math.round(baseSpeed * 0.97 - 5);

  const throttleVal = Math.max(0, Math.min(1, Math.sin(scrubT * Math.PI * 8) * 0.6 + 0.5));
  const brakeVal = throttleVal < 0.25 ? (0.25 - throttleVal) * 4 : 0;
  const sectorDelta = +(0.248 + Math.sin(scrubT * Math.PI * 4) * 0.045).toFixed(3);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setScrubT((prev) => (prev + dt * 0.065) % 1.0);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const t = x / rect.width;
    setScrubT(t);
  };

  return (
    <div className="w-full h-full min-h-[460px] flex flex-col justify-between select-none">
      {/* Clean Underline Mode Tabs Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-[#2563EB]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
          <span className="text-[#C8D2E0] font-semibold tracking-wider">
            60 FPS MULTI-CAR SECTOR DELTA OSCILLOSCOPE
          </span>
        </div>

        {/* Clean Underline Tabs */}
        <div className="flex items-center gap-6 pt-2 sm:pt-0">
          {(
            [
              { id: 'oscilloscope', label: 'Oscilloscope Traces' },
              { id: 'sectors', label: 'Sector Delta Map' },
              { id: 'worker', label: 'Worker Frame Budget' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider ${
                activeTab === tab.id
                  ? 'text-[#F4F6F9] border-b-2 border-[#FF2800] font-semibold'
                  : 'text-[#7E8B9B] hover:text-[#C8D2E0] border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full min-h-[400px] flex items-center justify-center p-2">
        {/* TAB 1: Oscilloscope Traces with Live Mouse Scrubbing */}
        {activeTab === 'oscilloscope' && (
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
            className="relative w-full h-full min-h-[390px] flex flex-col justify-between cursor-ew-resize py-2"
          >
            {/* Real-time Telemetry Data Readout Strip */}
            <div className="grid grid-cols-4 gap-4 pb-3 border-b border-[#2563EB]/20 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#7E8B9B] block">ACTIVE SECTOR</span>
                <span className="text-sm font-bold text-[#FF2800]">Sector 0{currentSector}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#7E8B9B] block">VER SPEED</span>
                <span className="text-sm font-bold text-[#FF2800]">{verSpeed} km/h</span>
              </div>
              <div>
                <span className="text-[10px] text-[#7E8B9B] block">NOR DELTA</span>
                <span className="text-sm font-bold text-[#2563EB]">+{sectorDelta}s</span>
              </div>
              <div>
                <span className="text-[10px] text-[#7E8B9B] block">FRAME BUDGET</span>
                <span className="text-sm font-bold text-[#4CC38A]">16.6ms Locked</span>
              </div>
            </div>

            {/* SVG Speed & Throttle Oscilloscope Canvas */}
            <div className="relative w-full aspect-[16/9] max-h-[280px] my-auto">
              <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="apexisTraceRed" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF2800" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF2800" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />

                {/* Sector 1/2/3 Vertical Divisions */}
                <line x1="200" y1="10" x2="200" y2="230" stroke="rgba(37, 99, 235, 0.25)" strokeDasharray="4 4" />
                <line x1="400" y1="10" x2="400" y2="230" stroke="rgba(37, 99, 235, 0.25)" strokeDasharray="4 4" />
                <text x="90" y="25" fill="#7E8B9B" fontSize="10" fontFamily="monospace">SECTOR 1</text>
                <text x="290" y="25" fill="#7E8B9B" fontSize="10" fontFamily="monospace">SECTOR 2</text>
                <text x="490" y="25" fill="#7E8B9B" fontSize="10" fontFamily="monospace">SECTOR 3</text>

                {/* Lead Car (VER) Speed Trace (#FF2800) */}
                <path
                  d="M 0 60 C 60 50, 120 70, 180 55 C 240 150, 280 180, 340 140 C 400 65, 480 45, 600 50"
                  fill="none"
                  stroke="#FF2800"
                  strokeWidth="2.5"
                />

                {/* Chasing Car (NOR) Speed Trace (#2563EB) */}
                <path
                  d="M 0 68 C 60 58, 120 76, 180 62 C 240 158, 280 188, 340 148 C 400 72, 480 52, 600 58"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  strokeDasharray="5 3"
                />

                {/* Chasing Car (LEC) Speed Trace (#C8D2E0) */}
                <path
                  d="M 0 75 C 60 65, 120 82, 180 70 C 240 165, 280 195, 340 155 C 400 80, 480 60, 600 65"
                  fill="none"
                  stroke="#C8D2E0"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                  opacity="0.7"
                />

                {/* Interactive Scrubber Cursor Hairline */}
                <line
                  x1={scrubT * 600}
                  y1="10"
                  x2={scrubT * 600}
                  y2="230"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <circle
                  cx={scrubT * 600}
                  cy={
                    currentSector === 1
                      ? 58 + Math.sin(scrubT * Math.PI * 6) * 12
                      : currentSector === 2
                      ? 150 - Math.sin(scrubT * Math.PI * 6) * 25
                      : 50
                  }
                  r="5"
                  fill="#FF2800"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Throttle & Brake Bar */}
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="text-[#7E8B9B]">THROTTLE TELEMETRY</span>
                  <span className="text-[#4CC38A] font-bold">{Math.round(throttleVal * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#060A12] overflow-hidden">
                  <div
                    className="h-full bg-[#4CC38A] transition-all duration-75"
                    style={{ width: `${throttleVal * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1">
                  <span className="text-[#7E8B9B]">BRAKE PRESSURE</span>
                  <span className="text-[#FF2800] font-bold">{Math.round(brakeVal * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#060A12] overflow-hidden">
                  <div
                    className="h-full bg-[#FF2800] transition-all duration-75"
                    style={{ width: `${brakeVal * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Sector Delta Map */}
        {activeTab === 'sectors' && (
          <div className="w-full h-full flex flex-col justify-between py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="pb-3 border-b border-[#FF2800]">
                <span className="text-[10px] text-[#7E8B9B]">SECTOR 1 (SPEED TRAP)</span>
                <div className="text-lg font-serif text-[#F4F6F9] mt-1">324.8 km/h</div>
                <span className="text-[#FF2800] text-[11px] font-bold">Purple Sector (-0.112s)</span>
              </div>
              <div className="pb-3 border-b border-[#2563EB]">
                <span className="text-[10px] text-[#7E8B9B]">SECTOR 2 (TECHNICAL CHICANE)</span>
                <div className="text-lg font-serif text-[#F4F6F9] mt-1">118.4 km/h</div>
                <span className="text-[#2563EB] text-[11px] font-bold">Yellow Sector (+0.045s)</span>
              </div>
              <div className="pb-3 border-b border-[#C8D2E0]">
                <span className="text-[10px] text-[#7E8B9B]">SECTOR 3 (FULL ACCELERATION)</span>
                <div className="text-lg font-serif text-[#F4F6F9] mt-1">310.2 km/h</div>
                <span className="text-[#4CC38A] text-[11px] font-bold">Green Sector (-0.081s)</span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Calculates rolling sector deltas against historical telemetry benchmarks stored in client-side SQLite WASM with sub-12ms query execution.
            </p>
          </div>
        )}

        {/* TAB 3: Web Worker Frame Budget */}
        {activeTab === 'worker' && (
          <div className="w-full h-full flex flex-col justify-center space-y-6 text-xs font-mono py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="pb-3 border-b border-[#2563EB]/30">
                <span className="text-[10px] text-[#7E8B9B]">PHYSICS ENGINE</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">Dedicated Worker</div>
                <span className="text-[#4CC38A] text-[11px]">16.6ms Locked Budget</span>
              </div>
              <div className="pb-3 border-b border-[#2563EB]/30">
                <span className="text-[10px] text-[#7E8B9B]">STORAGE KERNEL</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">SQLite WASM</div>
                <span className="text-[#4CC38A] text-[11px]">&lt; 12ms Index Lookup</span>
              </div>
              <div className="pb-3 border-b border-[#FF2800]">
                <span className="text-[10px] text-[#FF2800]">BROADCAST OCR</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">Tesseract.js Worker</div>
                <span className="text-[#FF2800] text-[11px]">Zero Main-Thread Lag</span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Offloads aerodynamic simulation, tire degradation decay curves, and video stream telemetry OCR entirely to background Web Workers, guaranteeing 60 FPS UI rendering.
            </p>
          </div>
        )}
      </div>

      {/* Clean Bottom Status Line */}
      <div className="pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]">
        <span>ENGINE: Dedicated simulator.worker.ts + SQLite WASM</span>
        <span className="text-[#4CC38A]">60 FPS Locked · Zero Main-Thread Jitter</span>
      </div>
    </div>
  );
};

export default PlateApexis;
