import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SectionContainer } from './ui/SectionContainer';
import { GridCrosshair } from './ui/EditorialPrimitives';
import SystemsCodeGraph from './SystemsCodeGraph';

// ===========================================================================
// PLATE 01: HEALIOS V2 (Interactive 3D Topographical Wound Mesh & Grad-CAM)
// ===========================================================================
const HealiosBlueprintPlate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'elevation' | 'xai' | 'arch'>('elevation');
  const [scanZ, setScanZ] = useState<number>(45);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isHover: boolean }>({
    x: 300,
    y: 170,
    isHover: false,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(600, ((e.clientX - rect.left) / rect.width) * 600));
    const y = Math.max(0, Math.min(340, ((e.clientY - rect.top) / rect.height) * 340));
    setMousePos({ x, y, isHover: true });
    setScanZ(Math.round(((y / 340) * 80) + 10));
  };

  return (
    <div
      className="relative w-full min-h-[500px] lg:min-h-[560px] bg-[#07090D] hover:bg-[#0C1729] transition-colors duration-200 border border-[#F3EFE7]/[0.12] rounded-[2px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden group select-none shadow-[0_12px_40px_rgba(7,9,13,0.7)]"
      aria-label="Healios V2 3D LiDAR and Grad-CAM Technical Blueprint Visual"
    >
      {/* Precision Blueprint Corner Fiducials */}
      <GridCrosshair className="absolute top-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-3 right-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 right-3 z-20 opacity-50 text-[#82B7FF]" />

      {/* Top Hairline Amber Glow */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#FF6B35]/60 via-[#F5D998]/40 to-transparent" />

      {/* Plate Header: Minimal Technical Telemetry & Underline Mode Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3EFE7]/[0.08]">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4CC38A] animate-pulse" />
          <span className="text-[#F3EFE7] font-medium tracking-wide">
            PLATE 01 // HEALIOS V2 · STEREO LIDAR &amp; GRAD-CAM
          </span>
          <span className="text-[#A7B2C3]/60 hidden sm:inline">|</span>
          <span className="text-[#82B7FF] hidden sm:inline">0.1mm Z-Axis Mesh</span>
        </div>

        {/* Minimal Underline Mode Switcher (Zero Heavy Orange Box) */}
        <div className="flex items-center gap-4 text-xs font-mono" role="tablist" aria-label="Healios View Modes">
          {(['elevation', 'xai', 'arch'] as const).map((tab) => {
            const labels = {
              elevation: '3D Elevation',
              xai: 'Grad-CAM XAI',
              arch: 'C4 Architecture',
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#F5D998] border-b-2 border-[#FF6B35] font-semibold'
                    : 'text-[#A7B2C3]/70 hover:text-[#F3EFE7] border-b-2 border-transparent'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Centerpiece Canvas (Full 62% Width — Scaled 2.5x with Zero Sub-Boxes) */}
      <div className="relative z-10 my-auto py-4 flex items-center justify-center min-h-[340px]">
        {activeTab === 'elevation' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <svg
              viewBox="0 0 600 340"
              className="w-full h-[320px] sm:h-[350px] cursor-crosshair overflow-visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos((p) => ({ ...p, isHover: false }))}
            >
              <defs>
                <radialGradient id="woundCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE9AE" stopOpacity="0.95" />
                  <stop offset="35%" stopColor="#FF6B35" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#C8321E" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#101B30" stopOpacity="0" />
                </radialGradient>
                <pattern id="blueprintGrid01" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F3EFE7" strokeWidth="0.5" strokeOpacity="0.05" />
                </pattern>
              </defs>

              {/* Background Coordinate Blueprint Mesh */}
              <rect width="600" height="340" fill="url(#blueprintGrid01)" />

              {/* Sub-surface Depth Axis Lines */}
              <line x1="60" y1="280" x2="540" y2="280" stroke="#82B7FF" strokeWidth="1" strokeOpacity="0.25" />
              <line x1="300" y1="40" x2="300" y2="300" stroke="#82B7FF" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.2" />

              {/* Topographical Contour Ring 1 (Outer Healthy Tissue Bed) */}
              <path
                d="M 80 180 C 100 80, 220 50, 320 65 C 440 80, 520 120, 510 200 C 500 270, 380 300, 280 295 C 160 290, 60 250, 80 180 Z"
                fill="#101B30"
                fillOpacity="0.3"
                stroke="#17243A"
                strokeWidth="2"
              />

              {/* Topographical Contour Ring 2 (LiDAR Depth Margin Perimeter) */}
              <path
                d="M 130 180 C 145 105, 240 85, 320 95 C 410 110, 460 145, 450 205 C 440 255, 360 270, 280 265 C 190 260, 115 230, 130 180 Z"
                fill="#17243A"
                fillOpacity="0.4"
                stroke="#82B7FF"
                strokeWidth="1.4"
                strokeDasharray="4 2"
              />

              {/* Topographical Contour Ring 3 (Erythema Infiltration Zone) */}
              <path
                d="M 180 180 C 195 130, 260 115, 320 125 C 380 135, 410 165, 400 210 C 390 245, 330 250, 275 245 C 215 240, 165 215, 180 180 Z"
                fill="#C8321E"
                fillOpacity="0.2"
                stroke="#FF6B35"
                strokeWidth="1.6"
              />

              {/* Topographical Contour Ring 4 (Core Wound Granulation Bed) */}
              <path
                d="M 230 180 C 240 148, 280 140, 320 148 C 360 155, 375 178, 368 208 C 360 230, 325 235, 285 230 C 245 225, 220 205, 230 180 Z"
                fill="url(#woundCoreGlow)"
                stroke="#FFE9AE"
                strokeWidth="1.2"
              />

              {/* Central Saliency Focal Core */}
              <circle cx="300" cy="185" r="14" fill="#FF6B35" fillOpacity="0.9" />
              <circle cx="300" cy="185" r="5" fill="#FFE9AE" />

              {/* Dynamic Laser Elevation Scan Line */}
              <line
                x1="60"
                y1={mousePos.y}
                x2="540"
                y2={mousePos.y}
                stroke="#FF6B35"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity={mousePos.isHover ? 0.85 : 0.45}
              />
              <line
                x1={mousePos.x}
                y1="40"
                x2={mousePos.x}
                y2="300"
                stroke="#82B7FF"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity={mousePos.isHover ? 0.85 : 0.45}
              />
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r="6"
                fill="none"
                stroke="#FFE9AE"
                strokeWidth="1.5"
                opacity={mousePos.isHover ? 1 : 0.6}
              />

              {/* Hairline Dimension Callout 1: 0.1mm Z-Axis Resolution */}
              <g transform="translate(420, 75)">
                <line x1="0" y1="0" x2="-70" y2="35" stroke="#82B7FF" strokeWidth="0.8" strokeOpacity="0.6" />
                <circle cx="-70" cy="35" r="2.5" fill="#82B7FF" />
                <text x="5" y="4" fill="#82B7FF" fontSize="10" fontFamily="monospace" fontWeight="500">
                  0.1mm Z-Axis Resolution
                </text>
                <text x="5" y="16" fill="#A7B2C3" fontSize="8.5" fontFamily="monospace">
                  ±0.08mm Depth Margin
                </text>
              </g>

              {/* Hairline Dimension Callout 2: <35ms Blur Gate */}
              <g transform="translate(60, 100)">
                <line x1="0" y1="0" x2="65" y2="45" stroke="#4CC38A" strokeWidth="0.8" strokeOpacity="0.6" />
                <circle cx="65" cy="45" r="2.5" fill="#4CC38A" />
                <text x="0" y="-8" fill="#4CC38A" fontSize="10" fontFamily="monospace" fontWeight="500">
                  &lt;35ms Blur Gate
                </text>
                <text x="0" y="4" fill="#A7B2C3" fontSize="8.5" fontFamily="monospace">
                  Laplacian Edge Kernel
                </text>
              </g>

              {/* Hairline Dimension Callout 3: Dynamic Scanning Coordinates */}
              <g transform="translate(60, 310)">
                <text x="0" y="0" fill="#F5D998" fontSize="10" fontFamily="monospace">
                  SCAN COORD: X:{mousePos.x.toFixed(1)}mm · Y:{mousePos.y.toFixed(1)}mm · Z:{(scanZ * 0.05).toFixed(2)}mm
                </text>
                <text x="0" y="14" fill="#A7B2C3" fontSize="8.5" fontFamily="monospace">
                  Wound Bed Area: 14.82cm² · Stereoscopic Point Cloud: 48,200 pts
                </text>
              </g>

              {/* Bottom Scale Marker */}
              <line x1="440" y1="315" x2="540" y2="315" stroke="#F3EFE7" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="440" y1="310" x2="440" y2="320" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.7" />
              <line x1="540" y1="310" x2="540" y2="320" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.7" />
              <text x="490" y="328" fill="#F3EFE7" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                10mm SCALE
              </text>
            </svg>
          </div>
        )}

        {activeTab === 'xai' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <svg viewBox="0 0 600 340" className="w-full h-[320px] sm:h-[350px]">
              <defs>
                <linearGradient id="jetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#101B30" stopOpacity="0.8" />
                  <stop offset="25%" stopColor="#17243A" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#82B7FF" stopOpacity="0.6" />
                  <stop offset="75%" stopColor="#FF6B35" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#FFE9AE" stopOpacity="1" />
                </linearGradient>
              </defs>

              <rect width="600" height="340" fill="#07090D" />
              {/* Tensor Grid Cells */}
              {Array.from({ length: 12 }).map((_, r) =>
                Array.from({ length: 20 }).map((_, c) => {
                  const dist = Math.hypot(c - 10, r - 6);
                  const heat = Math.max(0, 1 - dist / 7.5);
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={c * 28 + 20}
                      y={r * 26 + 15}
                      width="26"
                      height="24"
                      fill={heat > 0.6 ? '#FF6B35' : heat > 0.3 ? '#82B7FF' : '#101B30'}
                      fillOpacity={0.15 + heat * 0.75}
                      stroke="#F3EFE7"
                      strokeWidth="0.5"
                      strokeOpacity="0.08"
                    />
                  );
                })
              )}

              {/* Saliency Gradient Contours */}
              <ellipse cx="300" cy="170" rx="140" ry="85" fill="none" stroke="#82B7FF" strokeWidth="1.2" strokeDasharray="3 3" />
              <ellipse cx="300" cy="170" rx="90" ry="55" fill="rgba(200, 50, 30, 0.3)" stroke="#FF6B35" strokeWidth="1.6" />
              <circle cx="300" cy="170" r="28" fill="#FF6B35" fillOpacity="0.85" />
              <circle cx="300" cy="170" r="10" fill="#FFE9AE" />

              {/* XAI Benchmark Data Overlays */}
              <g transform="translate(30, 40)">
                <text x="0" y="0" fill="#F5D998" fontSize="11" fontFamily="monospace" fontWeight="600">
                  GRAD-CAM CLASS ACTIVATION MAP (8.09ms)
                </text>
                <text x="0" y="18" fill="#A7B2C3" fontSize="9.5" fontFamily="monospace">
                  ∇A_k = 0.942 Erythema Saliency · Vectorized NumPy Jet
                </text>
              </g>

              <g transform="translate(30, 310)">
                <text x="0" y="0" fill="#4CC38A" fontSize="9.5" fontFamily="monospace">
                  ERAS PROTOCOL RETRIEVAL: 0.14ms In-Memory BM25+TF-IDF
                </text>
              </g>
              <g transform="translate(420, 310)">
                <text x="0" y="0" fill="#82B7FF" fontSize="9.5" fontFamily="monospace">
                  HSV SEGMENTATION: 2.00ms
                </text>
              </g>
            </svg>
          </div>
        )}

        {activeTab === 'arch' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-2 sm:p-6">
            <svg viewBox="0 0 600 320" className="w-full h-[300px]">
              {/* C4 Architecture Blueprint Pipeline without nested heavy SaaS boxes */}
              <g transform="translate(20, 110)">
                <rect x="0" y="0" width="150" height="90" fill="none" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="0" y1="0" x2="150" y2="0" stroke="#4CC38A" strokeWidth="2" />
                <text x="14" y="24" fill="#4CC38A" fontSize="10" fontFamily="monospace" fontWeight="600">
                  1. CLIENT EDGE
                </text>
                <text x="14" y="44" fill="#F3EFE7" fontSize="11" fontFamily="sans-serif" fontWeight="500">
                  HTML5 Canvas Gate
                </text>
                <text x="14" y="62" fill="#A7B2C3" fontSize="9" fontFamily="monospace">
                  &lt;35ms Laplacian Rejection
                </text>
                <text x="14" y="76" fill="#82B7FF" fontSize="8.5" fontFamily="monospace">
                  Zero cloud cost pre-check
                </text>
              </g>

              <line x1="170" y1="155" x2="225" y2="155" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="4 3" />
              <polygon points="225,155 217,151 217,159" fill="#FF6B35" />
              <text x="197" y="145" fill="#FF6B35" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Valid Tensor
              </text>

              <g transform="translate(225, 110)">
                <rect x="0" y="0" width="150" height="90" fill="none" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="0" y1="0" x2="150" y2="0" stroke="#FF6B35" strokeWidth="2" />
                <text x="14" y="24" fill="#FF6B35" fontSize="10" fontFamily="monospace" fontWeight="600">
                  2. FASTAPI GATEWAY
                </text>
                <text x="14" y="44" fill="#F3EFE7" fontSize="11" fontFamily="sans-serif" fontWeight="500">
                  NumPy Grad-CAM Core
                </text>
                <text x="14" y="62" fill="#A7B2C3" fontSize="9" fontFamily="monospace">
                  8.09ms Execution Time
                </text>
                <text x="14" y="76" fill="#F5D998" fontSize="8.5" fontFamily="monospace">
                  HSV Morphology (2.00ms)
                </text>
              </g>

              <line x1="375" y1="155" x2="430" y2="155" stroke="#82B7FF" strokeWidth="1.5" strokeDasharray="4 3" />
              <polygon points="430,155 422,151 422,159" fill="#82B7FF" />
              <text x="402" y="145" fill="#82B7FF" fontSize="8" fontFamily="monospace" textAnchor="middle">
                Saliency Map
              </text>

              <g transform="translate(430, 110)">
                <rect x="0" y="0" width="150" height="90" fill="none" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="0" y1="0" x2="150" y2="0" stroke="#82B7FF" strokeWidth="2" />
                <text x="14" y="24" fill="#82B7FF" fontSize="10" fontFamily="monospace" fontWeight="600">
                  3. CLINICAL VIEW
                </text>
                <text x="14" y="44" fill="#F3EFE7" fontSize="11" fontFamily="sans-serif" fontWeight="500">
                  Three.js 3D LiDAR
                </text>
                <text x="14" y="62" fill="#A7B2C3" fontSize="9" fontFamily="monospace">
                  ±0.08mm Depth Margin
                </text>
                <text x="14" y="76" fill="#4CC38A" fontSize="8.5" fontFamily="monospace">
                  ERAS Protocol RAG (0.14ms)
                </text>
              </g>

              <text x="300" y="260" fill="#A7B2C3" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
                AIR-GAPPED CLINICAL AUDIT TRAIL · HIPAA-ALIGNED DATA ISOLATION
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Technical Gutter */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A7B2C3]/80 border-t border-[#F3EFE7]/[0.08] pt-3">
        <span>STATUS: VERIFIED ON IN-VIVO CALIBRATION TARGETS</span>
        <span className="text-[#FF6B35] font-semibold tabular-nums">
          8.09ms (Vectorized NumPy Tensor) · ±0.08mm Margin
        </span>
      </div>
    </div>
  );
};

// ===========================================================================
// PLATE 02: APEXIS TELEMETRY ENGINE (Live 60 FPS Multi-Car Delta & Sector Trace)
// ===========================================================================
const ApexisBlueprintPlate: React.FC = () => {
  const [scrubPos, setScrubPos] = useState<number>(62); // 0 to 100 percentage
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setScrubPos(pct);
    setIsHover(true);
  };

  // Dynamic values based on scrub
  const speed = Math.round(284 + Math.sin(scrubPos * 0.12) * 42);
  const gear = Math.min(8, Math.max(3, Math.round(4 + scrubPos * 0.038)));
  const rpm = Math.round(10800 + Math.sin(scrubPos * 0.15) * 1600);
  const delta = (Math.sin(scrubPos * 0.08) * 0.38 + 0.11);

  // SVG coordinates for scrub head (640 width)
  const scrubX = (scrubPos / 100) * 640;
  // Curve height calculation at scrubX
  const curveY = 140 - Math.sin((scrubX / 640) * Math.PI * 3.5) * 45;

  return (
    <div
      className="relative w-full min-h-[500px] lg:min-h-[560px] bg-[#07090D] hover:bg-[#0C1729] transition-colors duration-200 border border-[#F3EFE7]/[0.12] rounded-[2px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden group select-none shadow-[0_12px_40px_rgba(7,9,13,0.7)]"
      aria-label="Apexis Motorsport Telemetry Simulation Blueprint Visual"
    >
      <GridCrosshair className="absolute top-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-3 right-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 right-3 z-20 opacity-50 text-[#82B7FF]" />

      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#82B7FF]/60 via-[#FF6B35]/50 to-transparent" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3EFE7]/[0.08]">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-[#F3EFE7] font-medium tracking-wide">
            PLATE 02 // APEXIS ENGINE · WEB WORKER SIMULATION CORE
          </span>
          <span className="text-[#A7B2C3]/60 hidden sm:inline">|</span>
          <span className="text-[#4CC38A] hidden sm:inline">LOCKED 60 FPS</span>
        </div>

        {/* Real-Time Frame Budget Badge */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A7B2C3]">COMPUTE BUDGET:</span>
          <span className="px-2 py-0.5 bg-[#4CC38A]/10 border border-[#4CC38A]/30 text-[#4CC38A] font-semibold tabular-nums">
            16.6ms SPIKE-FREE
          </span>
        </div>
      </div>

      {/* Centerpiece Canvas: Expansive Dual-Wave Sector Delta Telemetry Trace */}
      <div className="relative z-10 my-auto py-4 flex flex-col justify-center min-h-[340px]">
        {/* Track Sector Demarcation Bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono border-b border-[#F3EFE7]/[0.08] pb-3 mb-2">
          <div className="flex items-center justify-between px-2 sm:px-4">
            <span className="text-[#A7B2C3]/70 text-[10px]">SECTOR 1</span>
            <span className="text-[#4CC38A] font-medium tabular-nums">28.412s</span>
          </div>
          <div className="flex items-center justify-between px-2 sm:px-4 border-x border-[#F3EFE7]/[0.08]">
            <span className="text-[#A7B2C3]/70 text-[10px]">SECTOR 2</span>
            <span className="text-[#F5D998] font-medium tabular-nums">39.804s</span>
          </div>
          <div className="flex items-center justify-between px-2 sm:px-4">
            <span className="text-[#A7B2C3]/70 text-[10px]">SECTOR 3</span>
            <span className="text-[#82B7FF] font-medium tabular-nums">22.115s</span>
          </div>
        </div>

        {/* Telemetry Waveform Interactive Canvas */}
        <div className="relative w-full">
          <svg
            viewBox="0 0 640 220"
            className="w-full h-[220px] sm:h-[240px] cursor-ew-resize overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsHover(false)}
          >
            <defs>
              <linearGradient id="apexisTraceFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Zero-Delta Centerline */}
            <line x1="0" y1="140" x2="640" y2="140" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="4 4" />
            <text x="8" y="134" fill="#A7B2C3" fontSize="8" fontFamily="monospace" opacity="0.6">
              0.000s BASELINE
            </text>

            {/* Sector Boundary Hairlines */}
            <line x1="213" y1="20" x2="213" y2="200" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="2 3" />
            <line x1="426" y1="20" x2="426" y2="200" stroke="#F3EFE7" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="2 3" />

            {/* Reference Car Trace (Cyan #82B7FF, Dashed) */}
            <path
              d="M 10 140 Q 60 175, 120 135 T 220 155 T 320 115 T 420 160 T 520 120 T 630 140"
              fill="none"
              stroke="#82B7FF"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.75"
            />

            {/* Primary Car Telemetry Waveform (Orange #FF6B35) with Gradient Area */}
            <path
              d="M 10 140 Q 60 95, 120 145 T 220 110 T 320 165 T 420 105 T 520 155 T 630 140"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="2.2"
            />

            {/* Interactive Scrub Head Hairline */}
            <line
              x1={scrubX}
              y1="20"
              x2={scrubX}
              y2="200"
              stroke="#FFE9AE"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              opacity={isHover ? 0.95 : 0.6}
            />

            {/* Scrub Head Point Markers */}
            <circle cx={scrubX} cy={curveY} r="5" fill="#FF6B35" stroke="#FFE9AE" strokeWidth="1.5" />

            {/* Scrub Tooltip Delta Callout */}
            <g transform={`translate(${Math.max(60, Math.min(570, scrubX))}, ${Math.max(40, curveY - 24)})`}>
              <rect x="-38" y="-14" width="76" height="20" fill="#07090D" stroke="#FFE9AE" strokeWidth="1" rx="1" />
              <text x="0" y="0" fill="#FFE9AE" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="600">
                {delta > 0 ? `+${delta.toFixed(3)}s` : `${delta.toFixed(3)}s`} Δ
              </text>
            </g>

            {/* Calibration Labels */}
            <text x="632" y="30" fill="#FF6B35" fontSize="8.5" fontFamily="monospace" textAnchor="end">
              CAR 01 // TELEMETRY DELTA
            </text>
            <text x="632" y="44" fill="#82B7FF" fontSize="8.5" fontFamily="monospace" textAnchor="end">
              CAR 02 // VIRTUAL REFERENCE
            </text>
          </svg>
        </div>

        {/* Live Scrub Telemetry Parameters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-[#F3EFE7]/[0.08] text-xs font-mono">
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">SPEED</span>
            <span className="text-[#F3EFE7] font-semibold tabular-nums text-sm">{speed} km/h</span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">GEAR &amp; RPM</span>
            <span className="text-[#F5D998] font-semibold tabular-nums text-sm">G{gear} · {rpm}</span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">TIME DELTA</span>
            <span className="text-[#FF6B35] font-semibold tabular-nums text-sm">
              {delta > 0 ? `+${delta.toFixed(3)}s` : `${delta.toFixed(3)}s`}
            </span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">THROTTLE / BRAKE</span>
            <span className="text-[#4CC38A] font-semibold tabular-nums text-sm">100% / 0%</span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">SQLITE LATENCY</span>
            <span className="text-[#82B7FF] font-semibold tabular-nums text-sm">&lt;12ms Query</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Gutter */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A7B2C3]/80 border-t border-[#F3EFE7]/[0.08] pt-3">
        <span>THREAD ARCHITECTURE: simulator.worker.ts (OFF-SCREEN COMPUTATION)</span>
        <span className="text-[#4CC38A] font-semibold tabular-nums">
          Zero Main-Thread JANK · Tesseract.js WASM OCR
        </span>
      </div>
    </div>
  );
};

// ===========================================================================
// PLATE 03: ROUTERX / CARELINE (Interactive Spatial Isochrone & Transit Desert Map)
// ===========================================================================
const RouteRxBlueprintPlate: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<number>(1);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = [
    {
      id: 1,
      name: 'Topeka East Micro-Cluster',
      x: 160,
      y: 110,
      censusBlocks: 14,
      busStops: 0,
      distance: '6.8 km',
      eta: '11.4 min',
      tvi: 0.94,
      status: 'Critical Transit Desert',
    },
    {
      id: 2,
      name: 'Highland Park Hub',
      x: 480,
      y: 90,
      censusBlocks: 18,
      busStops: 1,
      distance: '8.4 km',
      eta: '14.2 min',
      tvi: 0.88,
      status: 'High Vulnerability Centroid',
    },
    {
      id: 3,
      name: 'Shawnee South District',
      x: 460,
      y: 230,
      censusBlocks: 9,
      busStops: 0,
      distance: '10.2 km',
      eta: '16.8 min',
      tvi: 0.79,
      status: 'Discharge Return Route',
    },
    {
      id: 4,
      name: 'Oakland Corridor',
      x: 180,
      y: 220,
      censusBlocks: 12,
      busStops: 0,
      distance: '5.2 km',
      eta: '8.9 min',
      tvi: 0.86,
      status: 'Preventative Morning Pickup',
    },
  ];

  const active = nodes.find((n) => n.id === (hoveredNode || selectedNode)) || nodes[0];

  return (
    <div
      className="relative w-full min-h-[500px] lg:min-h-[560px] bg-[#07090D] hover:bg-[#0C1729] transition-colors duration-200 border border-[#F3EFE7]/[0.12] rounded-[2px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden group select-none shadow-[0_12px_40px_rgba(7,9,13,0.7)]"
      aria-label="RouteRx Spatial Isochrone Optimization Blueprint Visual"
    >
      <GridCrosshair className="absolute top-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-3 right-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 right-3 z-20 opacity-50 text-[#82B7FF]" />

      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#FF6B35]/60 via-[#FFE9AE]/50 to-transparent" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3EFE7]/[0.08]">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#FFE9AE] animate-pulse" />
          <span className="text-[#F3EFE7] font-medium tracking-wide">
            PLATE 03 // ROUTERX · SPATIAL ISOCHRONE ENGINE
          </span>
          <span className="text-[#A7B2C3]/60 hidden sm:inline">|</span>
          <span className="text-[#FF6B35] font-semibold hidden sm:inline">
            1ST PLACE ASA DATAFEST 2026
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A7B2C3]">OSRM QUERY LATENCY:</span>
          <span className="text-[#4CC38A] font-semibold tabular-nums">&lt;15ms MATRIX</span>
        </div>
      </div>

      {/* Centerpiece Canvas: Expansive Geometric Vector Map with Isochrones */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center min-h-[340px]">
        <svg viewBox="0 0 640 300" className="w-full h-[280px] sm:h-[320px] overflow-visible">
          <defs>
            <radialGradient id="hospitalRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#FF6B35" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#101B30" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Coordinate Hairlines */}
          <line x1="40" y1="160" x2="600" y2="160" stroke="#F3EFE7" strokeWidth="0.8" strokeOpacity="0.08" />
          <line x1="320" y1="20" x2="320" y2="280" stroke="#F3EFE7" strokeWidth="0.8" strokeOpacity="0.08" />

          {/* 30-Minute Catchment Isochrone Polygon (Outer Cyan #82B7FF) */}
          <polygon
            points="60,150 140,50 340,30 540,65 590,165 520,265 310,285 100,250"
            fill="#101B30"
            fillOpacity="0.25"
            stroke="#82B7FF"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />

          {/* 15-Minute Catchment Isochrone Polygon (Middle Amber #F5D998) */}
          <polygon
            points="120,155 180,85 330,75 470,95 510,165 450,235 300,245 150,220"
            fill="#17243A"
            fillOpacity="0.35"
            stroke="#F5D998"
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />

          {/* 5-Minute Core Isochrone Polygon (Inner Red/Orange #FF6B35) */}
          <polygon
            points="220,160 260,115 350,110 410,135 420,175 375,205 285,210 240,190"
            fill="url(#hospitalRadarGlow)"
            stroke="#FF6B35"
            strokeWidth="1.8"
          />

          {/* OSRM Bi-Directional Transit Paths connecting to Nodes */}
          {nodes.map((node) => {
            const isSelected = active.id === node.id;
            return (
              <g key={`path-${node.id}`}>
                <line
                  x1="320"
                  y1="160"
                  x2={node.x}
                  y2={node.y}
                  stroke={isSelected ? '#FFE9AE' : '#FF6B35'}
                  strokeWidth={isSelected ? 2 : 1.2}
                  strokeDasharray="4 4"
                  opacity={isSelected ? 0.95 : 0.55}
                />
              </g>
            );
          })}

          {/* Central Destination Hub: Stormont Vail Health Regional Center */}
          <g transform="translate(320, 160)">
            <circle cx="0" cy="0" r="22" fill="#FF6B35" fillOpacity="0.15" />
            <circle cx="0" cy="0" r="14" fill="#FF6B35" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="6" fill="#FF6B35" />
            <circle cx="0" cy="0" r="2.5" fill="#FFE9AE" />
            <text x="0" y="-18" fill="#FFE9AE" fontSize="9.5" fontFamily="monospace" textAnchor="middle" fontWeight="600">
              STORMONT VAIL REGIONAL HUB
            </text>
            <text x="0" y="28" fill="#A7B2C3" fontSize="8" fontFamily="monospace" textAnchor="middle">
              39.0558° N, 95.6890° W
            </text>
          </g>

          {/* Patient Pickup Centroid Nodes */}
          {nodes.map((node) => {
            const isSelected = active.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 16 : 10}
                  fill={isSelected ? '#4CC38A' : '#17243A'}
                  fillOpacity={isSelected ? 0.35 : 0.5}
                  stroke={isSelected ? '#4CC38A' : '#82B7FF'}
                  strokeWidth="1.2"
                />
                <circle cx="0" cy="0" r={isSelected ? 6 : 4} fill={isSelected ? '#4CC38A' : '#82B7FF'} />
                <text
                  x="0"
                  y={node.y > 160 ? 18 : -14}
                  fill={isSelected ? '#F3EFE7' : '#A7B2C3'}
                  fontSize="8.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight={isSelected ? '600' : '400'}
                >
                  NODE 0{node.id}
                </text>
              </g>
            );
          })}

          {/* Isochrone Legend */}
          <g transform="translate(480, 260)">
            <line x1="0" y1="0" x2="20" y2="0" stroke="#FF6B35" strokeWidth="1.8" />
            <text x="26" y="3" fill="#FF6B35" fontSize="8" fontFamily="monospace">
              5m Catchment
            </text>
            <line x1="0" y1="12" x2="20" y2="12" stroke="#F5D998" strokeWidth="1.4" strokeDasharray="3 3" />
            <text x="26" y="15" fill="#F5D998" fontSize="8" fontFamily="monospace">
              15m Isochrone
            </text>
            <line x1="0" y1="24" x2="20" y2="24" stroke="#82B7FF" strokeWidth="1.2" strokeDasharray="4 4" />
            <text x="26" y="27" fill="#82B7FF" fontSize="8" fontFamily="monospace">
              30m Isochrone
            </text>
          </g>
        </svg>

        {/* Dynamic Route Telemetry Bar */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F3EFE7]/[0.08] text-xs font-mono">
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">SELECTED CENTROID</span>
            <span className="text-[#F3EFE7] font-semibold text-sm truncate block">{active.name}</span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">OSRM ROUTE ETA</span>
            <span className="text-[#F5D998] font-semibold text-sm tabular-nums">
              {active.distance} · {active.eta}
            </span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">TRANSIT GAP STATUS</span>
            <span className="text-[#FF6B35] font-semibold text-sm truncate block">{active.status}</span>
          </div>
          <div>
            <span className="text-[#A7B2C3]/70 block text-[10px]">FLEET COST SAVINGS</span>
            <span className="text-[#4CC38A] font-semibold text-sm tabular-nums">~40% Bi-Directional</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Gutter */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A7B2C3]/80 border-t border-[#F3EFE7]/[0.08] pt-3">
        <span>DATA PIPELINE: Tigercensus · OpenStreetMap · GTFS Bus Transit Feed</span>
        <span className="text-[#FFE9AE] font-semibold tabular-nums">
          DBSCAN Density Clustering + OSRM Matrix Engine
        </span>
      </div>
    </div>
  );
};

// ===========================================================================
// PLATE 04: TEMPO TASK SUITE (Deterministic State-Machine & Cognitive Buffer Flow)
// ===========================================================================
const TempoBlueprintPlate: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [simulatedPulse, setSimulatedPulse] = useState<boolean>(false);

  const triggerSimulation = () => {
    setSimulatedPulse(true);
    setTimeout(() => setSimulatedPulse(false), 2400);
  };

  return (
    <div
      className="relative w-full min-h-[500px] lg:min-h-[560px] bg-[#07090D] hover:bg-[#0C1729] transition-colors duration-200 border border-[#F3EFE7]/[0.12] rounded-[2px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden group select-none shadow-[0_12px_40px_rgba(7,9,13,0.7)]"
      aria-label="Tempo Air-Gapped State Machine Blueprint Visual"
    >
      <GridCrosshair className="absolute top-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute top-3 right-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 left-3 z-20 opacity-50 text-[#82B7FF]" />
      <GridCrosshair className="absolute bottom-3 right-3 z-20 opacity-50 text-[#82B7FF]" />

      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#4CC38A]/60 via-[#F5D998]/50 to-transparent" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3EFE7]/[0.08]">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4CC38A] animate-pulse" />
          <span className="text-[#F3EFE7] font-medium tracking-wide">
            PLATE 04 // TEMPO SUITE · DETERMINISTIC STATE MACHINE
          </span>
          <span className="text-[#A7B2C3]/60 hidden sm:inline">|</span>
          <span className="text-[#4CC38A] hidden sm:inline">OFFLINE-FIRST AIR-GAP</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A7B2C3]">EXTERNAL EXFILTRATION:</span>
          <span className="px-2 py-0.5 bg-[#4CC38A]/10 border border-[#4CC38A]/30 text-[#4CC38A] font-semibold tabular-nums">
            0.0 KB (SOCKETS BLOCKED)
          </span>
        </div>
      </div>

      {/* Centerpiece Canvas: Open-Canvas State-Machine & Cognitive Flow Diagram */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center min-h-[340px]">
        <svg viewBox="0 0 640 280" className="w-full h-[260px] sm:h-[300px] overflow-visible">
          {/* Electromagnetic Air-Gap Perimeter Enclosure */}
          <rect
            x="200"
            y="25"
            width="420"
            height="210"
            fill="none"
            stroke="#4CC38A"
            strokeWidth="1.2"
            strokeDasharray="6 4"
            opacity="0.45"
            rx="2"
          />
          <text x="215" y="44" fill="#4CC38A" fontSize="8.5" fontFamily="monospace" fontWeight="600">
            AIR-GAP PERIMETER SHIELD // ZERO-DESTINATION BOUNDARY (0.0 KB EGRESS)
          </text>

          {/* Node 1: Unregulated Cognitive Input */}
          <g transform="translate(30, 95)" className="cursor-pointer" onClick={() => setActiveStep(0)}>
            <rect
              x="0"
              y="0"
              width="130"
              height="80"
              fill="none"
              stroke={activeStep === 0 ? '#FFE9AE' : '#F3EFE7'}
              strokeWidth="1"
              strokeOpacity={activeStep === 0 ? 0.9 : 0.25}
            />
            <line x1="0" y1="0" x2="130" y2="0" stroke="#FF6B35" strokeWidth="2" />
            <text x="12" y="24" fill="#FF6B35" fontSize="9" fontFamily="monospace" fontWeight="600">
              1. RAW INPUT
            </text>
            <text x="12" y="44" fill="#F3EFE7" fontSize="10.5" fontFamily="sans-serif" fontWeight="500">
              Cognitive Draft
            </text>
            <text x="12" y="62" fill="#A7B2C3" fontSize="8" fontFamily="monospace">
              Distress vector token
            </text>
          </g>

          {/* Flow Connector Line 1 to 2 */}
          <line x1="160" y1="135" x2="220" y2="135" stroke="#FF6B35" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="220,135 212,131 212,139" fill="#FF6B35" />

          {/* Node 2: 0.2ms Deterministic Regex Circuit Breaker Gate */}
          <g transform="translate(220, 95)" className="cursor-pointer" onClick={() => setActiveStep(1)}>
            <rect
              x="0"
              y="0"
              width="125"
              height="80"
              fill="none"
              stroke={activeStep === 1 ? '#FFE9AE' : '#F3EFE7'}
              strokeWidth="1"
              strokeOpacity={activeStep === 1 ? 0.9 : 0.25}
            />
            <line x1="0" y1="0" x2="125" y2="0" stroke="#FFE9AE" strokeWidth="2" />
            <text x="10" y="24" fill="#FFE9AE" fontSize="9" fontFamily="monospace" fontWeight="600">
              2. SAFETY GATE
            </text>
            <text x="10" y="44" fill="#F3EFE7" fontSize="10.5" fontFamily="sans-serif" fontWeight="500">
              0.2ms Regex Intercept
            </text>
            <text x="10" y="62" fill="#4CC38A" fontSize="8" fontFamily="monospace">
              100% Crisis Recall
            </text>
          </g>

          {/* Flow Connector Line 2 to 3 */}
          <line x1="345" y1="135" x2="385" y2="135" stroke="#F5D998" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="385,135 377,131 377,139" fill="#F5D998" />

          {/* Node 3: Heuristic Priority Triage Engine */}
          <g transform="translate(385, 95)" className="cursor-pointer" onClick={() => setActiveStep(2)}>
            <rect
              x="0"
              y="0"
              width="115"
              height="80"
              fill="none"
              stroke={activeStep === 2 ? '#FFE9AE' : '#F3EFE7'}
              strokeWidth="1"
              strokeOpacity={activeStep === 2 ? 0.9 : 0.25}
            />
            <line x1="0" y1="0" x2="115" y2="0" stroke="#F5D998" strokeWidth="2" />
            <text x="10" y="24" fill="#F5D998" fontSize="9" fontFamily="monospace" fontWeight="600">
              3. TRIAGE CORE
            </text>
            <text x="10" y="44" fill="#F3EFE7" fontSize="10.5" fontFamily="sans-serif" fontWeight="500">
              Failover Machine
            </text>
            <text x="10" y="62" fill="#82B7FF" fontSize="8" fontFamily="monospace">
              Zod Self-Correction
            </text>
          </g>

          {/* Flow Connector Line 3 to 4 */}
          <line x1="500" y1="135" x2="525" y2="135" stroke="#4CC38A" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="525,135 517,131 517,139" fill="#4CC38A" />

          {/* Node 4: Encrypted Local Ring Buffer & pgvector */}
          <g transform="translate(525, 95)" className="cursor-pointer" onClick={() => setActiveStep(3)}>
            <rect
              x="0"
              y="0"
              width="85"
              height="80"
              fill="none"
              stroke={activeStep === 3 ? '#FFE9AE' : '#F3EFE7'}
              strokeWidth="1"
              strokeOpacity={activeStep === 3 ? 0.9 : 0.25}
            />
            <line x1="0" y1="0" x2="85" y2="0" stroke="#4CC38A" strokeWidth="2" />
            <text x="8" y="24" fill="#4CC38A" fontSize="9" fontFamily="monospace" fontWeight="600">
              4. STORAGE
            </text>
            <text x="8" y="44" fill="#F3EFE7" fontSize="10.5" fontFamily="sans-serif" fontWeight="500">
              Local SQLite
            </text>
            <text x="8" y="62" fill="#A7B2C3" fontSize="8" fontFamily="monospace">
              pgvector 768d
            </text>
          </g>

          {/* Animated Pulse Token on Trigger */}
          {simulatedPulse && (
            <circle cx="280" cy="135" r="5" fill="#FFE9AE" className="animate-ping" />
          )}

          {/* Bottom Diagnostic Annotation */}
          <text x="320" y="260" fill="#A7B2C3" fontSize="9.5" fontFamily="monospace" textAnchor="middle">
            CLICK STEPS OR DISPATCH TEST PACKET TO EXERCISE REGEX INTERCEPTION
          </text>
        </svg>

        {/* Dynamic State Machine Telemetry Readout */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F3EFE7]/[0.08] text-xs font-mono">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[#A7B2C3]/70 block text-[10px]">CRISIS RECALL</span>
              <span className="text-[#4CC38A] font-semibold text-sm tabular-nums">100.0% (5/5 Caught)</span>
            </div>
            <div>
              <span className="text-[#A7B2C3]/70 block text-[10px]">FALSE ALARM RATE</span>
              <span className="text-[#F5D998] font-semibold text-sm tabular-nums">0.0% (Zero Spurious)</span>
            </div>
            <div>
              <span className="text-[#A7B2C3]/70 block text-[10px]">PRE-FLIGHT GATE</span>
              <span className="text-[#82B7FF] font-semibold text-sm tabular-nums">0.20ms Regex</span>
            </div>
          </div>

          <button
            onClick={triggerSimulation}
            className="px-4 py-2 bg-[#17243A] hover:bg-[#20304D] text-[#FFE9AE] border border-[#FFE9AE]/30 text-xs font-mono transition-colors cursor-pointer rounded-[2px]"
          >
            {simulatedPulse ? 'Testing Interception...' : 'Test Circuit Breaker ➔'}
          </button>
        </div>
      </div>

      {/* Bottom Technical Gutter */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A7B2C3]/80 border-t border-[#F3EFE7]/[0.08] pt-3">
        <span>PERSISTENCE: Local SQLite + Supabase pgvector IVFFlat Cosine (768-dim)</span>
        <span className="text-[#4CC38A] font-semibold tabular-nums">
          100% Offline Capable · Zero-Destination Sandbox
        </span>
      </div>
    </div>
  );
};

// ===========================================================================
// MAIN COMPONENT: ProjectLab (Architectural Blueprint Exhibition Overhaul)
// ===========================================================================
export const ProjectLab: React.FC = () => {
  // Curated Exhibition Projects Sequence (01 to 04)
  const exhibitionProjects = [
    {
      index: '01',
      plateLabel: 'PLATE 01 // CLINICAL COMPUTER VISION & 3D LIDAR',
      domain: 'COMPUTER VISION · 3D LIDAR',
      title: 'Healios V2',
      thesis: 'Clinical computer vision and 3D LiDAR point-cloud pipeline with 8.09ms explainable deep learning.',
      narrative:
        'Post-operative surgical site complications often develop undetected between clinical visits, while surgeons rightfully reject opaque black-box neural scores. Healios pairs stereoscopic iOS RGB/LiDAR point-cloud topography with a vectorized NumPy Grad-CAM tensor pipeline to illuminate erythema margins with verified ±0.08mm elevation accuracy and sub-10ms explainability.',
      metric1: {
        value: '8.09ms',
        label: 'Vectorized Grad-CAM',
      },
      metric2: {
        value: '±0.08mm',
        label: 'LiDAR Depth Margin',
      },
      stack: 'Swift · ARKit · Metal · FastAPI · Three.js',
      caseStudyUrl: '/projects/healios',
      sourceUrl: 'https://github.com/haresham15/HealiosPostSurgery',
      visualPlate: <HealiosBlueprintPlate />,
    },
    {
      index: '02',
      plateLabel: 'PLATE 02 // MOTORSPORT TELEMETRY & 60 FPS SIMULATION',
      domain: 'MOTORSPORT TELEMETRY',
      title: 'Apexis Telemetry Engine',
      thesis: 'Deterministic 60 FPS multi-car race simulation and live broadcast OCR via off-main-thread Web Workers.',
      narrative:
        'Browser-based race simulation notoriously stutters when intensive physics math contends with DOM updates. Apexis isolates all multi-car coordinate calculations and Tesseract.js broadcast OCR into dedicated background Web Workers. This architecture eliminates main-thread contention, delivering a locked 16.6ms compute budget and sub-12ms historical lookups across 70+ years of telemetry.',
      metric1: {
        value: '60 FPS',
        label: 'Deterministic Physics',
      },
      metric2: {
        value: '<12ms',
        label: 'Historical SQLite Latency',
      },
      stack: 'TypeScript · Web Workers · SQLite · Canvas · OpenF1',
      caseStudyUrl: '/projects/apexis',
      sourceUrl: 'https://github.com/haresham15/AIMotorsportsHub',
      visualPlate: <ApexisBlueprintPlate />,
    },
    {
      index: '03',
      plateLabel: 'PLATE 03 // SPATIAL TRANSIT MODELING & 1ST PLACE ASA DATAFEST',
      domain: 'SPATIAL OPTIMIZATION · 1ST PLACE ASA DATAFEST',
      title: 'RouteRx / Careline',
      thesis: 'Bi-directional healthcare transit logistics engine resolving patient transit deserts with sub-15ms isochrones.',
      narrative:
        'In Topeka, Kansas, 43 of 141 census blocks lacked access to public transit within 800 meters, stranding vulnerable patients and locking acute inpatient hospital beds. RouteRx unifies preventative morning clinic pickups with afternoon discharge returns on a single shared fleet. Using Tigercensus data, DBSCAN spatial clustering, and OSRM isochrone routing, the engine eliminated transit gaps while reducing simulated logistics costs by ~40%.',
      metric1: {
        value: '<15ms',
        label: 'OSRM Matrix Latency',
      },
      metric2: {
        value: '1st Place',
        label: 'ASA DataFest 2026',
      },
      stack: 'Python · OSRM · Folium · GeoPandas · DBSCAN · React',
      caseStudyUrl: '/projects/routerx-careline-hub',
      sourceUrl: 'https://github.com/haresham15/Careline',
      visualPlate: <RouteRxBlueprintPlate />,
    },
    {
      index: '04',
      plateLabel: 'PLATE 04 // LOCAL-FIRST ARCHITECTURE & AIR-GAPPED STATE MACHINE',
      domain: 'LOCAL-FIRST ARCHITECTURE',
      title: 'Tempo Task Suite',
      thesis: 'Air-gapped executive regulation buffer with deterministic safety gates and encrypted SQLite storage.',
      narrative:
        'Acute emotional distress and rejection sensitivity often cause catastrophic communication errors before executive function can re-engage. Tempo creates a zero-destination sandboxed cognitive buffer: drafts are intercepted by a deterministic 0.2ms regex circuit breaker, passed through an in-memory priority triage gate, and persisted into an encrypted local SQLite/IndexedDB ring buffer with complete air-gapped immunity against background exfiltration.',
      metric1: {
        value: '100.0%',
        label: 'Crisis Recall (0% False Neg)',
      },
      metric2: {
        value: '0.0 KB',
        label: 'Data Exfiltration',
      },
      stack: 'Electron · React 19 · pgvector · SQLite · TypeScript',
      caseStudyUrl: '/projects/tempo',
      sourceUrl: 'https://github.com/haresham15/TempoADHDAssist',
      visualPlate: <TempoBlueprintPlate />,
    },
  ];

  return (
    <SectionContainer
      id="projects"
      variant="wide"
      bgMode="clean"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Selected engineering systems exhibition"
    >
      {/* SECTION 1.1: CLEAN SECTION INTRODUCTION */}
      <div className="max-w-[1360px] mx-auto mb-20 sm:mb-28">
        <div className="border-b border-[#F3EFE7]/[0.1] pb-8">
          <div className="flex items-center gap-3 mb-4 text-xs font-mono uppercase tracking-[0.2em] text-[#A7B2C3]">
            <span className="text-[#FF6B35] font-semibold">01 // EXHIBITION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            <span>ARCHITECTURAL BLUEPRINT EXHIBITION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl text-[#F3EFE7] leading-[1.1] tracking-tight">
            <span className="font-raleway font-bold">Selected Works</span> &amp; <span className="font-serif italic font-normal text-[#F5D998]">Engineered Systems.</span>
          </h2>
          <p className="text-base sm:text-lg font-sans text-[#A7B2C3] max-w-2xl leading-relaxed pt-4">
            High-reliability systems, explainable computer vision pipelines, and real-time telemetry architectures built with verifiable benchmarks.
          </p>
        </div>
      </div>

      {/* SECTION 2: UNIFIED ARCHITECTURAL EXHIBITION LAYOUT */}
      {/* Continuous Architectural Datum Spine & Exhibition Spreads */}
      <div className="relative max-w-[1360px] mx-auto space-y-36 sm:space-y-40 lg:space-y-44">
        {/* Continuous Left Architectural Datum Line (Gutter Spine) */}
        <div
          className="absolute left-[-24px] lg:left-[-32px] top-4 bottom-4 w-[1px] bg-[#A7B2C3]/[0.14] pointer-events-none hidden xl:block"
          aria-hidden="true"
        />

        {exhibitionProjects.map((project) => (
          <article
            key={project.index}
            className="relative group focus-within:ring-1 focus-within:ring-[#FF6B35]/40"
            aria-labelledby={`project-heading-${project.index}`}
          >
            {/* Chapter Index & Exhibition Plate Header */}
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <GridCrosshair className="text-[#82B7FF] opacity-60 shrink-0" />
              <span className="font-serif text-5xl sm:text-6xl font-light text-[#F5D998] group-hover:text-[#FF6B35] transition-colors duration-200 tracking-tight tabular-nums select-none">
                {project.index}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#A7B2C3]/20 via-[#A7B2C3]/10 to-transparent" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#A7B2C3]/70 hidden sm:inline-block">
                {project.plateLabel}
              </span>
            </div>

            {/* Asymmetric 38% Narrative / 62% Open-Canvas Blueprint Plate Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column (38% Width — Clean Editorial Narrative) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                {/* 1. Domain Line (No Bullet Dots) */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#FF6B35] tracking-widest uppercase font-medium">
                    {project.domain}
                  </span>
                </div>

                {/* 2. Project Title */}
                <h3
                  id={`project-heading-${project.index}`}
                  className="text-3xl sm:text-4xl lg:text-5xl font-raleway font-bold text-[#F3EFE7] tracking-tight leading-tight"
                >
                  {project.title}
                </h3>

                {/* 3. One-Sentence Italic Thesis */}
                <p className="text-xl sm:text-[22px] font-serif italic text-[#F5D998] leading-snug">
                  {project.thesis}
                </p>

                {/* 4. Concise Engineering Narrative */}
                <p className="text-[16px] sm:text-[17px] font-sans text-[#A7B2C3] leading-[1.68] max-w-[58ch]">
                  {project.narrative}
                </p>

                {/* 5. Clean Architectural Benchmark Strip (Replaces the 3 Colored Bullet Points) */}
                <div className="pt-2 border-t border-[#F3EFE7]/[0.08] space-y-4">
                  {/* Metric 1 + Metric 2 Readouts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[22px] font-mono font-medium text-[#F3EFE7] block tabular-nums">
                        {project.metric1.value}
                      </span>
                      <span className="text-[11px] font-mono uppercase text-[#A7B2C3] tracking-wider block mt-0.5">
                        {project.metric1.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-[22px] font-mono font-medium text-[#F5D998] block tabular-nums">
                        {project.metric2.value}
                      </span>
                      <span className="text-[11px] font-mono uppercase text-[#A7B2C3] tracking-wider block mt-0.5">
                        {project.metric2.label}
                      </span>
                    </div>
                  </div>

                  {/* Clean Tech Stack Line with Subtle Hover Interactivity */}
                  <div className="text-[12px] font-mono text-[#82B7FF] tracking-wide pt-1 hover:text-[#FFE9AE] transition-colors">
                    {project.stack}
                  </div>
                </div>

                {/* 6. Unified Action Row (Identical Across All 4 Projects) */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Link
                    href={project.caseStudyUrl}
                    className="bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-semibold py-3.5 px-6 text-xs font-mono transition-colors select-none inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Read Case Study</span>
                    <span>→</span>
                  </Link>
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 bg-transparent hover:bg-[#F3EFE7]/[0.06] text-[#F3EFE7] border border-[#F3EFE7]/20 hover:border-[#F3EFE7]/40 text-xs font-mono transition-colors select-none font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Source Code</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* Right Column (62% Width — Open-Canvas Interactive Blueprint Plate) */}
              <div className="lg:col-span-7 w-full">
                {project.visualPlate}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* SECTION 02: INTERACTIVE CODEGRAPH & VECTOR TOPOLOGY EXPLORER */}
      <div id="archive" className="mt-32 sm:mt-40 max-w-[1360px] mx-auto border-t border-[#F3EFE7]/[0.1] pt-16 sm:pt-20 space-y-8 scroll-mt-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-raleway font-bold text-[#F3EFE7] tracking-tight">
              Engineering Systems Archive
            </h3>
            <p className="text-sm sm:text-base font-sans text-[#A7B2C3] max-w-3xl leading-relaxed">
              Interactive hierarchical vector graph and embedding topology indexing all 18 production systems, experimental algorithms, and clinical research prototypes.
            </p>
          </div>

          <Link
            href="/projects"
            className="px-5 py-3 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] text-xs font-mono transition-colors inline-flex items-center gap-2 select-none self-start lg:self-auto font-medium cursor-pointer"
          >
            <span>Tabular Ledger Index</span>
            <span className="text-[#FF6B35]">→</span>
          </Link>
        </div>

        {/* Interactive Hierarchical CodeGraph & Vector Database Explorer */}
        <SystemsCodeGraph />
      </div>
    </SectionContainer>
  );
};

export default ProjectLab;
