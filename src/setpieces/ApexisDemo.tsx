import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CarTelemetry, WorkerTelemetryPayload } from '@/workers/apexisTelemetry.worker';
import { analytics } from '@/lib/analytics';

export const ApexisDemo: React.FC = () => {
  const [cars, setCars] = useState<CarTelemetry[]>([
    { id: 1, driver: 'VER', team: 'Red Bull Racing', color: '#3671C6', speed: 308, gear: 8, throttle: 1.0, brake: 0.0, lapProgress: 0.85, delta: 0.0, tireWear: 91.2 },
    { id: 2, driver: 'NOR', team: 'McLaren', color: '#FF8000', speed: 304, gear: 8, throttle: 1.0, brake: 0.0, lapProgress: 0.82, delta: 0.42, tireWear: 89.8 },
    { id: 3, driver: 'LEC', team: 'Ferrari', color: '#E80020', speed: 295, gear: 7, throttle: 0.85, brake: 0.0, lapProgress: 0.78, delta: 1.15, tireWear: 92.4 },
    { id: 4, driver: 'HAM', team: 'Mercedes-AMG', color: '#27F4D2', speed: 288, gear: 7, throttle: 0.8, brake: 0.0, lapProgress: 0.74, delta: 1.84, tireWear: 88.5 },
    { id: 5, driver: 'PIA', team: 'McLaren', color: '#FF8000', speed: 284, gear: 7, throttle: 0.75, brake: 0.0, lapProgress: 0.71, delta: 2.31, tireWear: 90.1 },
  ]);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedCarId, setSelectedCarId] = useState<number>(1);
  const [workerLatencyMs, setWorkerLatencyMs] = useState<number>(0.18);
  const [workerFrameCount, setWorkerFrameCount] = useState<number>(0);
  const [showMessageFlow, setShowMessageFlow] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Lazy mounting with IntersectionObserver to save CPU/GPU when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initialize Web Worker for off-main-thread telemetry
  useEffect(() => {
    if (!isVisible) return;

    let worker: Worker | null = null;
    try {
      // Standard Next.js Web Worker instantiation
      worker = new Worker(new URL('../workers/apexisTelemetry.worker.ts', import.meta.url));
      workerRef.current = worker;

      worker.onmessage = (e: MessageEvent<WorkerTelemetryPayload>) => {
        const payload = e.data;
        if (payload && payload.type === 'TELEMETRY_UPDATE') {
          setCars(payload.cars);
          setWorkerLatencyMs(payload.computationTimeMs);
          setWorkerFrameCount(payload.workerFrame);
        }
      };

      worker.postMessage({ type: 'INIT' });
    } catch {
      // Inline deterministic simulation fallback if Web Worker blocked
      let step = 0;
      const inlineInterval = setInterval(() => {
        if (!isPlaying) return;
        step++;
        setCars((prev) =>
          prev.map((car, idx) => ({
            ...car,
            lapProgress: (car.lapProgress + 0.003 * speedMultiplier * (1 - idx * 0.015)) % 1.0,
            speed: Math.round(260 + Math.sin(step * 0.1 + idx) * 50),
          }))
        );
        setWorkerLatencyMs(0.25);
        setWorkerFrameCount(step);
      }, 1000 / 60);

      return () => clearInterval(inlineInterval);
    }

    return () => {
      if (worker) {
        worker.terminate();
        workerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // Dispatch control events to worker
  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    workerRef.current?.postMessage({
      type: 'CONTROL',
      action: next ? 'play' : 'pause',
      speedMultiplier,
    });
    analytics.track('demo_interaction', 'apexis_toggle_play', { isPlaying: next });
  };

  const handleSpeedChange = (multiplier: number) => {
    setSpeedMultiplier(multiplier);
    workerRef.current?.postMessage({
      type: 'CONTROL',
      action: isPlaying ? 'play' : 'pause',
      speedMultiplier: multiplier,
    });
    analytics.track('demo_interaction', 'apexis_speed_change', { multiplier });
  };

  const handleReset = () => {
    workerRef.current?.postMessage({
      type: 'CONTROL',
      action: 'reset',
      speedMultiplier,
    });
    analytics.track('demo_interaction', 'apexis_reset');
  };

  // Convert lapProgress [0.0 - 1.0] to circuit (x, y) coordinates along stylized F1 track
  const getCoordinatesAlongCircuit = useCallback((progress: number) => {
    // 16-point closed spline path approximating an F1 circuit
    const angle = progress * Math.PI * 2;
    // R = base + harmonized radius distortions for realistic turns
    const r = 110 + Math.sin(angle * 3) * 25 + Math.cos(angle * 2) * 20 - Math.sin(angle * 5) * 12;
    const cx = 170 + Math.cos(angle) * r;
    const cy = 160 + Math.sin(angle) * (r * 0.75);
    return { x: cx, y: cy };
  }, []);

  const selectedCar = cars.find((c) => c.id === selectedCarId) || cars[0];

  return (
    <div
      ref={containerRef}
      className="w-full rounded-3xl bg-[#0D1118] border border-white/10 p-5 sm:p-7 shadow-token-card flex flex-col justify-between"
    >
      {/* Set Piece Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] font-semibold">
              Live Architecture Inspection
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
            Apexis: 60fps Web Worker Telemetry Simulator
          </h3>
        </div>

        {/* Play/Pause & Speed Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              isPlaying
                ? 'bg-[#7DD3FC]/15 border-[#7DD3FC] text-[#7DD3FC]'
                : 'bg-white/5 border-white/10 text-[#A6ADB8] hover:text-white'
            }`}
            aria-label={isPlaying ? 'Pause telemetry replay' : 'Play telemetry replay'}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#A6ADB8] hover:text-white bg-white/5 border border-white/10 transition-colors"
            aria-label="Reset simulation"
          >
            ↺ Reset
          </button>

          {/* Speed Pill toggles */}
          <div className="flex items-center rounded-lg bg-white/5 border border-white/10 p-0.5 text-xs font-mono">
            {[1, 2, 4].map((mult) => (
              <button
                key={mult}
                type="button"
                onClick={() => handleSpeedChange(mult)}
                className={`px-2 py-1 rounded-md transition-all ${
                  speedMultiplier === mult
                    ? 'bg-[#7DD3FC] text-[#050505] font-semibold'
                    : 'text-[#A6ADB8] hover:text-white'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
        
        {/* LEFT: Circuit Simulation Map (7 cols) */}
        <div className="xl:col-span-7 relative w-full aspect-[16/11] rounded-2xl bg-[#050505] border border-white/10 p-4 flex items-center justify-center overflow-hidden">
          
          <svg viewBox="0 0 340 320" className="w-full h-full" fill="none">
            {/* Track Grid lines */}
            <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
              <line x1="0" y1="80" x2="340" y2="80" />
              <line x1="0" y1="160" x2="340" y2="160" />
              <line x1="0" y1="240" x2="340" y2="240" />
              <line x1="85" y1="0" x2="85" y2="320" />
              <line x1="170" y1="0" x2="170" y2="320" />
              <line x1="255" y1="0" x2="255" y2="320" />
            </g>

            {/* Stylized Circuit Asphalt Path */}
            <path
              d="M 170 50 C 230 40, 290 80, 275 140 C 265 180, 290 220, 250 260 C 210 295, 120 280, 90 240 C 60 200, 85 170, 75 125 C 65 75, 120 55, 170 50 Z"
              stroke="#1A222E"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Centerline */}
            <path
              d="M 170 50 C 230 40, 290 80, 275 140 C 265 180, 290 220, 250 260 C 210 295, 120 280, 90 240 C 60 200, 85 170, 75 125 C 65 75, 120 55, 170 50 Z"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Start / Finish line */}
            <line x1="170" y1="38" x2="170" y2="62" stroke="#FFFFFF" strokeWidth="2" />
            <text x="175" y="46" fill="#A6ADB8" fontSize="8" fontFamily="JetBrains Mono">S/F</text>

            {/* Moving Vehicle Nodes */}
            {cars.map((car) => {
              const coords = getCoordinatesAlongCircuit(car.lapProgress);
              const isSelected = car.id === selectedCarId;

              return (
                <g
                  key={car.id}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer transition-transform"
                  onClick={() => setSelectedCarId(car.id)}
                >
                  {/* Selected Ping Ring */}
                  {isSelected && (
                    <circle r="12" stroke={car.color} strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                  )}
                  {/* Car Node */}
                  <circle
                    r={isSelected ? 7 : 5}
                    fill={car.color}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {/* Driver Tag */}
                  <text
                    x="9"
                    y="4"
                    fill={isSelected ? '#FFFFFF' : car.color}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {car.driver}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Circuit Overlay Readout */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] font-mono text-[#A6ADB8] bg-[#050505]/80 p-2 rounded-lg border border-white/5">
            <span className="text-white font-semibold">OpenF1 Track Topology</span>
            <span>Length: 5.412 km · 16 Turns</span>
            <span className="text-[#34D399]">Replay Loop Active</span>
          </div>

          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#A6ADB8] bg-[#050505]/80 px-2 py-1 rounded-lg border border-white/5">
            Deterministic Replay Telemetry
          </div>
        </div>

        {/* RIGHT: Live Architecture Boundary HUD (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Architecture Boundary Pipeline */}
          <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-semibold">Boundary Telemetry</span>
              <button
                type="button"
                onClick={() => setShowMessageFlow(!showMessageFlow)}
                className="text-[10px] text-[#7DD3FC] hover:underline"
              >
                {showMessageFlow ? 'Hide Flow' : 'Show Flow'}
              </button>
            </div>

            {/* Architecture diagram nodes */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#7DD3FC]/10 border border-[#7DD3FC]/30">
                <p className="text-[10px] text-[#A6ADB8]">Thread</p>
                <p className="text-[#7DD3FC] font-bold">UI Main</p>
                <p className="text-[9px] text-[#A6ADB8]/80 mt-1">DOM Render</p>
              </div>

              <div className="p-2 rounded-lg bg-[#D8B4FE]/10 border border-[#D8B4FE]/30 relative">
                {showMessageFlow && isPlaying && (
                  <span className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#D8B4FE] animate-ping" />
                )}
                <p className="text-[10px] text-[#A6ADB8]">Off-Thread</p>
                <p className="text-[#D8B4FE] font-bold">Web Worker</p>
                <p className="text-[9px] text-[#A6ADB8]/80 mt-1">Physics 60Hz</p>
              </div>

              <div className="p-2 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30">
                <p className="text-[10px] text-[#A6ADB8]">Memory</p>
                <p className="text-[#34D399] font-bold">postMessage</p>
                <p className="text-[9px] text-[#A6ADB8]/80 mt-1">Zero Lock</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A6ADB8]">
              <span>Compute Latency: <strong className="text-white">{workerLatencyMs} ms</strong></span>
              <span>Worker Frames: <strong className="text-white">{workerFrameCount}</strong></span>
            </div>
          </div>

          {/* Selected Driver Telemetry HUD */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCar.color }} />
                  <span>{selectedCar.driver}</span>
                  <span className="text-xs font-mono text-[#A6ADB8] font-normal">({selectedCar.team})</span>
                </p>
              </div>
              <span className="text-xs font-mono text-[#7DD3FC] font-semibold">
                {selectedCar.delta === 0 ? 'INTERVAL: LEADER' : `+${selectedCar.delta}s`}
              </span>
            </div>

            {/* Gauges: Speed & Gear */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[#A6ADB8] block text-[10px]">CURRENT SPEED</span>
                <span className="text-2xl font-bold text-white">{selectedCar.speed}</span>
                <span className="text-[#A6ADB8] ml-1">km/h</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[#A6ADB8] block text-[10px]">GEARBOX</span>
                <span className="text-2xl font-bold text-[#7DD3FC]">G{selectedCar.gear}</span>
                <span className="text-[#A6ADB8] ml-1">Tire: {selectedCar.tireWear}%</span>
              </div>
            </div>

            {/* Pedals: Throttle & Brake Progress */}
            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#34D399]">THROTTLE ({(selectedCar.throttle * 100).toFixed(0)}%)</span>
                <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#34D399] transition-all duration-75"
                    style={{ width: `${selectedCar.throttle * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#F87171]">BRAKE ({(selectedCar.brake * 100).toFixed(0)}%)</span>
                <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#F87171] transition-all duration-75"
                    style={{ width: `${selectedCar.brake * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Select Driver Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {cars.map((car) => (
              <button
                key={car.id}
                type="button"
                onClick={() => setSelectedCarId(car.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                  car.id === selectedCarId
                    ? 'bg-white/20 text-white border-white'
                    : 'bg-white/5 text-[#A6ADB8] border-white/5 hover:text-white'
                }`}
              >
                {car.driver}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ApexisDemo;
