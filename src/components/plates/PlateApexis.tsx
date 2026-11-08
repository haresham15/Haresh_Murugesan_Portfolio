import React, { useState, useEffect, useRef } from 'react';

export type ApexisTab = 'sectors' | 'oscilloscope' | 'worker';

export const PlateApexis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ApexisTab>('sectors');
  const [scrubT, setScrubT] = useState<number>(0.42); // 0.0 to 1.0 along the lap
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
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
  const currentDelta = +(0.248 + Math.sin(scrubT * Math.PI * 4) * 0.045).toFixed(3);

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

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col justify-between select-none">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#2563EB]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[#2563EB] font-semibold tracking-wider">PLATE 02 · 60 FPS TELEMETRY OSCILLOSCOPE</span>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#060A12]/80 p-1 rounded-[2px] border border-[#F4F6F9]/10">
          <button
            type="button"
            onClick={() => setActiveTab('sectors')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'sectors'
                ? 'bg-[#FF2800] text-[#070B12] font-semibold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Track Sector Map
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('oscilloscope')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'oscilloscope'
                ? 'bg-[#FF2800] text-[#070B12] font-semibold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Oscilloscope Traces
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('worker')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'worker'
                ? 'bg-[#FF2800] text-[#070B12] font-semibold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Web Worker State
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        {/* TAB 1: Track Sector Map & Real-Time Scrubber */}
        {activeTab === 'sectors' && (
          <div className="w-full h-full flex flex-col justify-between space-y-4">
            {/* Top Multi-Car Live Readout Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-[#060A12]/80 border border-[#3671C6]/40 rounded-[2px]">
                <div className="flex items-center justify-between text-[#7E8B9B]">
                  <span>VER (P1)</span>
                  <span className="text-[#3671C6] font-bold">{verSpeed} km/h</span>
                </div>
                <div className="text-[10px] text-[#4CC38A] mt-1">Leader (+0.000s)</div>
              </div>
              <div className="p-2.5 bg-[#060A12]/80 border border-[#FF8000]/40 rounded-[2px]">
                <div className="flex items-center justify-between text-[#7E8B9B]">
                  <span>NOR (P2)</span>
                  <span className="text-[#FF8000] font-bold">{norSpeed} km/h</span>
                </div>
                <div className="text-[10px] text-[#FFB86C] mt-1">+{currentDelta}s Δ</div>
              </div>
              <div className="p-2.5 bg-[#060A12]/80 border border-[#E80020]/40 rounded-[2px]">
                <div className="flex items-center justify-between text-[#7E8B9B]">
                  <span>LEC (P3)</span>
                  <span className="text-[#E80020] font-bold">{lecSpeed} km/h</span>
                </div>
                <div className="text-[10px] text-[#7E8B9B] mt-1">+1.182s Δ</div>
              </div>
            </div>

            {/* SVG Track Sector Map with Scrubbing Position */}
            <div className="relative w-full aspect-[21/9] bg-transparent border border-[#F4F6F9]/15 rounded-[2px] p-4 flex items-center justify-center">
              <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
                {/* Sector 1 (0 to 200) */}
                <path
                  d="M 40 160 C 100 40, 160 40, 200 90"
                  stroke={currentSector === 1 ? '#FF2800' : '#334155'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Sector 2 (200 to 400) */}
                <path
                  d="M 200 90 C 240 140, 320 200, 380 140"
                  stroke={currentSector === 2 ? '#FF2800' : '#334155'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Sector 3 (400 to 560) */}
                <path
                  d="M 380 140 C 440 80, 520 80, 560 160"
                  stroke={currentSector === 3 ? '#FF2800' : '#334155'}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Return Straight */}
                <path
                  d="M 560 160 L 40 160"
                  stroke="rgba(167, 178, 195, 0.25)"
                  strokeWidth="4"
                  strokeDasharray="4 4"
                  fill="none"
                />

                {/* Sector Divider Ticks */}
                <circle cx="200" cy="90" r="4" fill="#C8D2E0" />
                <text x="180" y="70" fill="#C8D2E0" fontSize="10" fontFamily="monospace">
                  S1 / S2
                </text>
                <circle cx="380" cy="140" r="4" fill="#C8D2E0" />
                <text x="360" y="170" fill="#C8D2E0" fontSize="10" fontFamily="monospace">
                  S2 / S3
                </text>

                {/* Animated Vehicle Cursor Node (Scrubbed along track) */}
                {(() => {
                  const carX = 40 + scrubT * 520;
                  const carY =
                    scrubT < 0.33
                      ? 160 - Math.sin((scrubT / 0.33) * Math.PI) * 110
                      : scrubT < 0.66
                      ? 90 + Math.sin(((scrubT - 0.33) / 0.33) * Math.PI) * 70
                      : 140 - Math.sin(((scrubT - 0.66) / 0.34) * Math.PI) * 60;
                  return (
                    <g transform={`translate(${carX}, ${carY})`}>
                      <circle r="9" fill="#FF2800" opacity="0.3" className="animate-ping" />
                      <circle r="5" fill="#FF2800" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  );
                })()}
              </svg>

              {/* Sector Indicator Badge */}
              <div className="absolute bottom-3 left-3 bg-[#060A12]/80 border border-[#FF2800]/40 px-2.5 py-1 text-[10px] font-mono text-[#C8D2E0]">
                ACTIVE: SECTOR {currentSector} // LAP {Math.round(scrubT * 100)}%
              </div>
            </div>

            {/* Scrubbing Slider & Play/Pause */}
            <div className="flex items-center gap-4 bg-[#060A12]/80 p-3 rounded-[2px] border border-[#F4F6F9]/10">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 bg-[#FF2800] text-[#070B12] text-xs font-mono font-bold rounded-[2px] cursor-pointer"
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={scrubT}
                onChange={(e) => {
                  setIsPlaying(false);
                  setScrubT(Number(e.target.value));
                }}
                className="flex-1 accent-[#FF2800] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#7E8B9B] min-w-[70px] text-right">
                {(scrubT * 84.2).toFixed(1)}s / 84.2s
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: Oscilloscope Traces (Throttle, Brake, Gear) */}
        {activeTab === 'oscilloscope' && (
          <div className="w-full h-full flex flex-col justify-between space-y-4 text-xs font-mono">
            <div className="p-4 bg-transparent border border-[#F4F6F9]/15 rounded-[2px] space-y-4">
              {/* Throttle Trace */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[11px]">
                  <span className="text-[#4CC38A]">THROTTLE TRACE (100% WOT)</span>
                  <span className="text-[#4CC38A] font-bold">{Math.round(throttleVal * 100)}%</span>
                </div>
                <div className="w-full h-4 bg-[#060A12]/80 rounded-[2px] overflow-hidden">
                  <div
                    className="h-full bg-[#4CC38A] transition-all duration-75"
                    style={{ width: `${throttleVal * 100}%` }}
                  />
                </div>
              </div>

              {/* Brake Pressure Trace */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-[11px]">
                  <span className="text-[#F87171]">BRAKE PRESSURE (120 BAR PEAK)</span>
                  <span className="text-[#F87171] font-bold">{Math.round(brakeVal * 100)}%</span>
                </div>
                <div className="w-full h-4 bg-[#060A12]/80 rounded-[2px] overflow-hidden">
                  <div
                    className="h-full bg-[#F87171] transition-all duration-75"
                    style={{ width: `${brakeVal * 100}%` }}
                  />
                </div>
              </div>

              {/* Frame Delta */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F4F6F9]/10">
                <div className="p-3 bg-[#060A12]/80 rounded-[2px]">
                  <span className="text-[#7E8B9B] text-[10px]">VER vs NOR DELTA</span>
                  <div className="text-base font-bold text-[#C8D2E0] mt-1">+{currentDelta}s Δ</div>
                </div>
                <div className="p-3 bg-[#060A12]/80 rounded-[2px]">
                  <span className="text-[#7E8B9B] text-[10px]">FRAME TIME BUDGET</span>
                  <div className="text-base font-bold text-[#4CC38A] mt-1">16.6ms (60 FPS)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Web Worker State */}
        {activeTab === 'worker' && (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#060A12]/80 border border-[#4CC38A]/30 rounded-[2px]">
                <div className="text-[10px] text-[#7E8B9B]">WORKER LATENCY</div>
                <div className="text-lg font-bold text-[#4CC38A] mt-1">0.18 ms</div>
                <div className="text-[10px] text-[#7A889B] mt-0.5">Off-main-thread compute</div>
              </div>
              <div className="p-3.5 bg-[#060A12]/80 border border-[#2563EB]/30 rounded-[2px]">
                <div className="text-[10px] text-[#7E8B9B]">SIMULATION RATE</div>
                <div className="text-lg font-bold text-[#2563EB] mt-1">60.0 FPS</div>
                <div className="text-[10px] text-[#7A889B] mt-0.5">Zero main-thread jank</div>
              </div>
              <div className="p-3.5 bg-[#060A12]/80 border border-[#FF2800]/30 rounded-[2px]">
                <div className="text-[10px] text-[#7E8B9B]">HISTORICAL SQLITE</div>
                <div className="text-lg font-bold text-[#FF2800] mt-1">&lt; 12 ms</div>
                <div className="text-[10px] text-[#7A889B] mt-0.5">1950–Present indexed</div>
              </div>
            </div>

            <div className="p-4 bg-transparent border border-[#F4F6F9]/10 rounded-[2px] text-[#7E8B9B] leading-relaxed">
              Worker thread continuously solves 5-car vehicle dynamics, tire degradation, and delta telemetry asynchronously, streaming Float64Array packets into React via zero-copy structured clones.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-[11px] font-mono text-[#7A889B]">
        <span>RUNTIME: Web Worker Thread (60 FPS)</span>
        <span className="text-[#4CC38A]">&lt; 12ms SQLite Lookup</span>
      </div>
    </div>
  );
};

export default PlateApexis;
