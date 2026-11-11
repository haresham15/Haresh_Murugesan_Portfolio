import React, { useState, useEffect, useRef } from 'react';
import { useMotionPreference } from '../MotionPreference';

export type ApexisTab = 'oscilloscope' | 'sectors' | 'worker';

export const PlateApexis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ApexisTab>('oscilloscope');
  const [scrubT, setScrubT] = useState<number>(0.48); // 0.0 to 1.0 along the lap
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedSector, setSelectedSector] = useState<number | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const { isReduced } = useMotionPreference();

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
    if (!isPlaying || isReduced) return;
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
  }, [isPlaying, isReduced]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const t = x / rect.width;
    setScrubT(t);
  };

  return (
    <div className="w-full flex flex-col justify-between select-none">
      {/* ROW 1: HTML Controls (clean underline mode tabs, toggles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2563EB]/20 text-xs font-mono">
        {/* Left: Mode Underline Tabs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
              aria-pressed={activeTab === tab.id}
              className={`pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider min-h-[36px] flex items-center ${
                activeTab === tab.id
                  ? 'text-[#F4F6F9] border-b-2 border-[#FF2800] font-semibold'
                  : 'text-[#7E8B9B] hover:text-[#C8D2E0] border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Contextual HTML Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="px-2.5 py-1 min-h-[32px] bg-[#0B1E40] hover:bg-[#153875] text-[#F4F6F9] border border-[#2563EB]/30 rounded-[2px] transition-colors cursor-pointer text-[11px]"
          >
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>

          <label className="flex items-center gap-2 text-[#7E8B9B] text-[11px]">
            <span>Lap:</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={Math.round(scrubT * 1000)}
              onChange={(e) => {
                setIsPlaying(false);
                setScrubT(Number(e.target.value) / 1000);
              }}
              aria-label="Lap Position Scrubber"
              className="w-20 sm:w-28 accent-[#FF2800] cursor-ew-resize"
            />
          </label>
        </div>
      </div>

      {/* ROW 2: Flexible canvas/drawing container (min-height: 0, height ~460px on desktop, ~280px on mobile) */}
      <div className="relative w-full min-h-0 h-[280px] sm:h-[360px] lg:h-[460px] flex items-center justify-center my-3 overflow-hidden bg-[#03050A]/80 border border-[#2563EB]/15">
        {/* TAB 1: Oscilloscope Traces with Live Mouse Scrubbing */}
        {activeTab === 'oscilloscope' && (
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
            className="relative w-full h-full flex flex-col justify-between cursor-ew-resize p-3 sm:p-4"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 640 320" className="w-full h-full max-h-[420px] overflow-visible">
                <defs>
                  <linearGradient id="apexisTraceGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF2800" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FF2800" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Speed Reference Guidelines */}
                <line x1="0" y1="50" x2="640" y2="50" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="640" y2="120" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="190" x2="640" y2="190" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />
                <line x1="0" y1="260" x2="640" y2="260" stroke="rgba(200, 210, 224, 0.08)" strokeDasharray="3 3" />

                <text x="10" y="46" fill="#7E8B9B" fontSize="9" fontFamily="monospace">320 km/h</text>
                <text x="10" y="116" fill="#7E8B9B" fontSize="9" fontFamily="monospace">240 km/h</text>
                <text x="10" y="186" fill="#7E8B9B" fontSize="9" fontFamily="monospace">160 km/h</text>
                <text x="10" y="256" fill="#7E8B9B" fontSize="9" fontFamily="monospace">80 km/h</text>

                {/* Sector 1/2/3 Vertical Divisions */}
                <line x1="213" y1="20" x2="213" y2="290" stroke="rgba(37, 99, 235, 0.3)" strokeDasharray="4 4" />
                <line x1="426" y1="20" x2="426" y2="290" stroke="rgba(37, 99, 235, 0.3)" strokeDasharray="4 4" />
                <text x="100" y="32" fill="#7E8B9B" fontSize="10" fontFamily="monospace" textAnchor="middle">SECTOR 1 (SPEED TRAP)</text>
                <text x="320" y="32" fill="#7E8B9B" fontSize="10" fontFamily="monospace" textAnchor="middle">SECTOR 2 (TECHNICAL)</text>
                <text x="533" y="32" fill="#7E8B9B" fontSize="10" fontFamily="monospace" textAnchor="middle">SECTOR 3 (FULL ACCEL)</text>

                {/* Lead Car (VER) Speed Trace (#FF2800) */}
                <path
                  d="M 0 70 C 70 50, 140 75, 213 60 C 270 170, 330 210, 426 150 C 490 70, 560 48, 640 55"
                  fill="none"
                  stroke="#FF2800"
                  strokeWidth="2.8"
                />

                {/* Chasing Car 1 (NOR) Speed Trace (#2563EB) */}
                <path
                  d="M 0 78 C 70 60, 140 82, 213 68 C 270 178, 330 218, 426 158 C 490 78, 560 56, 640 64"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />

                {/* Chasing Car 2 (LEC) Speed Trace (#C8D2E0) */}
                <path
                  d="M 0 86 C 70 68, 140 90, 213 76 C 270 186, 330 226, 426 166 C 490 86, 560 64, 640 72"
                  fill="none"
                  stroke="#C8D2E0"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                  opacity="0.75"
                />

                {/* Interactive Scrubber Cursor Line */}
                <line
                  x1={scrubT * 640}
                  y1="20"
                  x2={scrubT * 640}
                  y2="295"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />

                {/* Active Vehicle Intersection Node */}
                <circle
                  cx={scrubT * 640}
                  cy={
                    currentSector === 1
                      ? 68 + Math.sin(scrubT * Math.PI * 6) * 12
                      : currentSector === 2
                      ? 165 - Math.sin(scrubT * Math.PI * 6) * 35
                      : 55
                  }
                  r="5"
                  fill="#FF2800"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  className="shadow-[0_0_10px_rgba(255,40,0,0.8)]"
                />

                {/* Real-time floating telemetry tag next to scrubber */}
                <rect
                  x={Math.min(scrubT * 640 + 8, 520)}
                  y="60"
                  width="110"
                  height="34"
                  fill="#03050A"
                  stroke="#FF2800"
                  strokeWidth="1"
                />
                <text x={Math.min(scrubT * 640 + 14, 526)} y="74" fill="#F4F6F9" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  VER {verSpeed} km/h
                </text>
                <text x={Math.min(scrubT * 640 + 14, 526)} y="88" fill="#2563EB" fontSize="9" fontFamily="monospace">
                  ΔNOR +{sectorDelta}s
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* TAB 2: Sector Delta Map (Full 2D Grand Prix Circuit Track SVG) */}
        {activeTab === 'sectors' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 640 320" className="w-full h-full max-h-[420px] overflow-visible">
              {/* Circuit Grid Coordinate Pattern */}
              <defs>
                <pattern id="apexisTrackGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(37, 99, 235, 0.05)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="640" height="320" fill="url(#apexisTrackGrid)" />

              {/* F1 Circuit Track Geometry divided into 3 Sectors */}
              {/* Sector 1: Reddish-Orange (#FF2800) */}
              <path
                d="M 120 70 L 460 70 C 530 70, 560 110, 560 150"
                fill="none"
                stroke="#FF2800"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Sector 2: Electric Cobalt (#2563EB) */}
              <path
                d="M 560 150 C 560 210, 480 250, 400 230 C 350 215, 330 250, 270 250"
                fill="none"
                stroke="#2563EB"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Sector 3: Green / Silver (#4CC38A) */}
              <path
                d="M 270 250 C 180 250, 100 230, 80 170 C 60 110, 80 70, 120 70"
                fill="none"
                stroke="#4CC38A"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Track Centerline Guide */}
              <path
                d="M 120 70 L 460 70 C 530 70, 560 110, 560 150 C 560 210, 480 250, 400 230 C 350 215, 330 250, 270 250 C 180 250, 100 230, 80 170 C 60 110, 80 70, 120 70"
                fill="none"
                stroke="#F4F6F9"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.8"
              />

              {/* Sector 1 Callout */}
              <g transform="translate(280, 45)">
                <rect x="-80" y="-12" width="160" height="24" fill="#03050A" stroke="#FF2800" strokeWidth="1" />
                <text x="0" y="4" fill="#FF2800" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  S1: SPEED TRAP 324.8 km/h (-0.112s)
                </text>
              </g>

              {/* Sector 2 Callout */}
              <g transform="translate(480, 275)">
                <rect x="-80" y="-12" width="160" height="24" fill="#03050A" stroke="#2563EB" strokeWidth="1" />
                <text x="0" y="4" fill="#2563EB" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  S2: CHICANE 118.4 km/h (+0.045s)
                </text>
              </g>

              {/* Sector 3 Callout */}
              <g transform="translate(150, 280)">
                <rect x="-80" y="-12" width="160" height="24" fill="#03050A" stroke="#4CC38A" strokeWidth="1" />
                <text x="0" y="4" fill="#4CC38A" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  S3: ACCEL 310.2 km/h (-0.081s)
                </text>
              </g>

              {/* Animated / Scrubbed Car Position on Circuit */}
              {(() => {
                // Approximate coordinate mapping along the circuit path
                let cx = 120;
                let cy = 70;
                if (scrubT < 0.33) {
                  const t = scrubT / 0.33;
                  cx = 120 + t * 440;
                  cy = 70 + t * 40;
                } else if (scrubT < 0.66) {
                  const t = (scrubT - 0.33) / 0.33;
                  cx = 560 - t * 290;
                  cy = 150 + t * 100;
                } else {
                  const t = (scrubT - 0.66) / 0.34;
                  cx = 270 - t * 150;
                  cy = 250 - t * 180;
                }
                return (
                  <g transform={`translate(${cx}, ${cy})`}>
                    <circle r="9" fill="#FF2800" className="animate-ping opacity-75" />
                    <circle r="6" fill="#FF2800" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="12" y="4" fill="#F4F6F9" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      CAR 01
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        )}

        {/* TAB 3: Web Worker Frame Budget (Visualized 16.6ms Execution Breakdown SVG) */}
        {activeTab === 'worker' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 640 320" className="w-full h-full max-h-[420px] overflow-visible">
              {/* Title Header */}
              <text x="30" y="40" fill="#F4F6F9" fontSize="14" fontFamily="sans-serif" fontWeight="bold">
                DEDICATED WEB WORKER FRAME BUDGET (16.67ms @ 60 FPS)
              </text>
              <text x="30" y="58" fill="#7E8B9B" fontSize="10" fontFamily="monospace">
                Total Budget: 16.67ms | Parallel Execution: Off-Main-Thread Web Workers | Zero UI Jank
              </text>

              {/* 16.67ms Total Frame Window Boundary */}
              <rect x="30" y="80" width="580" height="42" fill="#060A12" stroke="#2563EB" strokeWidth="1" />

              {/* Segment 1: Physics Engine Worker (5.4ms / 32.4% -> 188px) */}
              <rect x="30" y="80" width="188" height="42" fill="#2563EB" opacity="0.85" />
              <text x="40" y="105" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Kinetic Physics (5.4ms)
              </text>

              {/* Segment 2: Aerodynamics & Tire Decay (3.8ms / 22.8% -> 132px) */}
              <rect x="218" y="80" width="132" height="42" fill="#153875" />
              <text x="228" y="105" fill="#F4F6F9" fontSize="10" fontFamily="sans-serif">
                Aero &amp; Tires (3.8ms)
              </text>

              {/* Segment 3: Tesseract.js Broadcast OCR (4.6ms / 27.6% -> 160px) */}
              <rect x="350" y="80" width="160" height="42" fill="#FF2800" opacity="0.9" />
              <text x="360" y="105" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Broadcast OCR (4.6ms)
              </text>

              {/* Segment 4: SQLite WASM Historical Lookups (1.9ms / 11.4% -> 66px) */}
              <rect x="510" y="80" width="66" height="42" fill="#C8D2E0" />
              <text x="515" y="105" fill="#03050A" fontSize="9" fontFamily="monospace" fontWeight="bold">
                SQLite (1.9ms)
              </text>

              {/* Main UI Thread Dispatch (Only 0.97ms -> 34px) */}
              <rect x="576" y="80" width="34" height="42" fill="#4CC38A" />

              {/* 16.67ms Deadline Line */}
              <line x1="610" y1="70" x2="610" y2="135" stroke="#FF2800" strokeWidth="2" strokeDasharray="3 3" />
              <text x="610" y="65" fill="#FF2800" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
                16.67ms HARD CAP
              </text>

              {/* Main Thread Headroom Visualization */}
              <rect x="30" y="150" width="580" height="32" fill="#060A12" stroke="rgba(200, 210, 224, 0.15)" />
              <rect x="30" y="150" width="34" height="32" fill="#4CC38A" />
              <text x="40" y="171" fill="#03050A" fontSize="10" fontFamily="monospace" fontWeight="bold">
                0.97ms
              </text>
              <text x="80" y="171" fill="#7E8B9B" fontSize="11" fontFamily="sans-serif">
                Main Thread Render Dispatch (15.70ms Idle Headroom — 94.2% Free)
              </text>

              {/* Comparative Feature Matrix */}
              <line x1="30" y1="205" x2="610" y2="205" stroke="rgba(37, 99, 235, 0.25)" />
              <g transform="translate(30, 230)">
                <text x="0" y="0" fill="#7E8B9B" fontSize="10" fontFamily="monospace">OFF-THREAD WORKER:</text>
                <text x="0" y="18" fill="#F4F6F9" fontSize="12" fontFamily="sans-serif" fontWeight="bold">60.0 FPS Locked</text>
                <text x="0" y="34" fill="#4CC38A" fontSize="10" fontFamily="monospace">0 Dropped Frames</text>
              </g>

              <g transform="translate(230, 230)">
                <text x="0" y="0" fill="#7E8B9B" fontSize="10" fontFamily="monospace">HISTORICAL ARCHIVE:</text>
                <text x="0" y="18" fill="#F4F6F9" fontSize="12" fontFamily="sans-serif" fontWeight="bold">1950–Present F1</text>
                <text x="0" y="34" fill="#4CC38A" fontSize="10" fontFamily="monospace">&lt; 12ms Query Latency</text>
              </g>

              <g transform="translate(430, 230)">
                <text x="0" y="0" fill="#7E8B9B" fontSize="10" fontFamily="monospace">VIDEO STREAM OCR:</text>
                <text x="0" y="18" fill="#F4F6F9" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Tesseract.js WASM</text>
                <text x="0" y="34" fill="#FF2800" fontSize="10" fontFamily="monospace">Zero Thread Jitter</text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* ROW 3: HTML Telemetry footer (outside drawing canvas; never overlaying or clipping artwork) */}
      <div className="pt-3 border-t border-[#2563EB]/20 w-full min-w-0 text-xs font-mono">
        {/* Real-time Telemetry Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-[#2563EB]/15 text-[#7E8B9B]">
          <div>
            <span className="text-[10px] block uppercase tracking-wider">Active Sector</span>
            <span className="text-sm font-bold text-[#FF2800]">Sector 0{currentSector}</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">VER Speed</span>
            <span className="text-sm font-bold text-[#F4F6F9]">{verSpeed} km/h</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">NOR Lap Delta</span>
            <span className="text-sm font-bold text-[#2563EB]">+{sectorDelta}s</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">Worker Budget</span>
            <span className="text-sm font-bold text-[#4CC38A]">16.6ms Locked (60 FPS)</span>
          </div>
        </div>

        {/* Throttle & Brake Bar Indicators */}
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
    </div>
  );
};

export default PlateApexis;
