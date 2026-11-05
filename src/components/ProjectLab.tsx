import React, { useState } from 'react';
import Link from 'next/link';
import { archiveProjects } from '../content/projects';
import { GridCrosshair } from './ui/GridCrosshair';

// ---------------------------------------------------------------------------
// Highlight Visual 1: Healios 3D LiDAR & Explainable CV Pipeline (0px Swiss Stage)
// ---------------------------------------------------------------------------
const HealiosCenterpieceVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lidar' | 'xai' | 'arch'>('lidar');

  return (
    <div className="relative w-full min-h-[440px] bg-[#0A1424] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 border-[#F4EFE6]/10 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#FFB86C] via-[#FF6B2B] to-transparent" />

      {/* Top Telemetry Header & Tab Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#8A99AD] border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4CC38A]" />
          <span className="text-[#F4EFE6] font-medium tracking-wide">
            Healios V2 · Clinical CV &amp; LiDAR Runtime
          </span>
        </div>

        {/* View Modes */}
        <div className="flex items-center border border-[#F4EFE6]/15 divide-x divide-[#F4EFE6]/15">
          <button
            onClick={() => setActiveTab('lidar')}
            className={`px-3 py-1 text-[11px] transition-colors cursor-pointer ${
              activeTab === 'lidar' ? 'bg-[#FF6B2B] text-[#07090D] font-semibold' : 'text-[#8A99AD] hover:text-[#F4EFE6]'
            }`}
          >
            3D Elevation
          </button>
          <button
            onClick={() => setActiveTab('xai')}
            className={`px-3 py-1 text-[11px] transition-colors cursor-pointer ${
              activeTab === 'xai' ? 'bg-[#FF6B2B] text-[#07090D] font-semibold' : 'text-[#8A99AD] hover:text-[#F4EFE6]'
            }`}
          >
            Grad-CAM XAI
          </button>
          <button
            onClick={() => setActiveTab('arch')}
            className={`px-3 py-1 text-[11px] transition-colors cursor-pointer ${
              activeTab === 'arch' ? 'bg-[#FF6B2B] text-[#07090D] font-semibold' : 'text-[#8A99AD] hover:text-[#F4EFE6]'
            }`}
          >
            C4 Architecture
          </button>
        </div>
      </div>

      {/* Dynamic Stage */}
      <div className="relative z-10 my-auto py-6">
        {activeTab === 'lidar' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="bg-[#07090D] border border-white/[0.08] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
                <span className="text-[#F4EFE6]">Topographical Wound Bed</span>
                <span className="text-[#4CC38A]">0.1mm resolution</span>
              </div>
              <div className="h-36 flex items-center justify-center">
                <svg viewBox="0 0 160 110" className="w-full h-full">
                  <path d="M 20 60 Q 40 18 80 28 T 140 60 T 115 95 T 35 90 Z" fill="#102038" stroke="#162B4C" strokeWidth="2" />
                  <path d="M 38 60 Q 55 30 80 38 T 122 62 T 100 85 Z" fill="#162B4C" stroke="#70A5FF" strokeWidth="1.2" />
                  <path d="M 55 60 Q 70 42 85 45 T 105 64 T 88 78 Z" fill="#C8321E" fillOpacity="0.35" stroke="#FF6B2B" strokeWidth="1.2" strokeDasharray="3 3" />
                  <circle cx="82" cy="58" r="14" fill="#FF6B2B" fillOpacity="0.75" />
                  <circle cx="82" cy="58" r="5" fill="#FFE9AE" />
                  <line x1="20" y1="102" x2="140" y2="102" stroke="#70A5FF" strokeWidth="1" opacity="0.6" />
                  <text x="80" y="108" fill="#9BA8B8" fontSize="6.5" fontFamily="monospace" textAnchor="middle">0.1mm Elevation Axis</text>
                </svg>
              </div>
              <div className="text-[11px] font-mono text-[#8A99AD] flex justify-between border-t border-white/[0.06] pt-2">
                <span>HSV Bed Granulation</span>
                <span className="text-[#F4EFE6] tabular-nums">2.00ms execution</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-[#07090D] border border-white/[0.08] p-4 space-y-2">
                <span className="text-[#FFB86C] block uppercase">LiDAR Depth Metric</span>
                <p className="text-sm font-sans text-[#F4EFE6]">
                  Stereoscopic depth point-cloud filtered with bilateral mesh smoothing.
                </p>
                <div className="text-[11px] text-[#4CC38A]">
                  Verified elevation margin: ±0.08mm on calibration targets.
                </div>
              </div>
              <div className="bg-[#07090D] border border-white/[0.08] p-4 space-y-2">
                <span className="text-[#70A5FF] block uppercase">Laplacian Blur Rejection</span>
                <p className="text-sm font-sans text-[#F4EFE6]">
                  Pre-flight edge Canvas kernel gates camera blur in &lt;35ms before upload.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'xai' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="bg-[#07090D] border border-white/[0.08] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
                <span className="text-[#F4EFE6]">Grad-CAM Saliency Overlay</span>
                <span className="text-[#FFB86C]">8.09ms execution</span>
              </div>
              <div className="h-36 flex items-center justify-center">
                <svg viewBox="0 0 160 110" className="w-full h-full">
                  <ellipse cx="80" cy="55" rx="58" ry="36" fill="none" stroke="#162B4C" strokeWidth="1.8" />
                  <ellipse cx="80" cy="55" rx="38" ry="24" fill="rgba(200, 50, 30, 0.28)" stroke="#FF6B2B" strokeWidth="1.2" strokeDasharray="3 3" />
                  <circle cx="80" cy="55" r="14" fill="#FF6B2B" opacity="0.85" />
                  <circle cx="80" cy="55" r="5" fill="#FFE9AE" />
                  <line x1="80" y1="12" x2="80" y2="98" stroke="#4C8DFF" strokeWidth="0.8" opacity="0.35" />
                  <line x1="16" y1="55" x2="144" y2="55" stroke="#4C8DFF" strokeWidth="0.8" opacity="0.35" />
                </svg>
              </div>
              <div className="text-[11px] font-mono text-[#8A99AD] flex justify-between border-t border-white/[0.06] pt-2">
                <span>Piecewise Jet Colormap</span>
                <span className="text-[#4CC38A]">Vectorized NumPy</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-[#07090D] border border-white/[0.08] p-4 space-y-2">
                <span className="text-[#FFB86C] block uppercase">Explainable Saliency</span>
                <p className="text-sm font-sans text-[#F4EFE6]">
                  Surgeons inspect spatial gradient heatmaps highlighting erythema margins rather than accepting black-box scores.
                </p>
              </div>
              <div className="bg-[#07090D] border border-white/[0.08] p-4 space-y-2">
                <span className="text-[#4CC38A] block uppercase">ERAS Surgical Protocol RAG</span>
                <p className="text-sm font-sans text-[#F4EFE6]">
                  In-memory BM25 retrieval delivers verified clinical recovery guidelines in 0.14ms.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arch' && (
          <div className="bg-[#07090D] border border-white/[0.08] p-5 space-y-4 text-xs font-mono">
            <span className="text-[#70A5FF] block uppercase tracking-wider">C4 Architecture Flow</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-[#102038] p-3 border border-white/[0.08]">
                <span className="text-[#FFB86C] block font-semibold">1. Client Edge</span>
                <span className="text-[11px] text-[#8A99AD] block mt-1">HTML5 Canvas Laplacian blur gate (&lt;35ms)</span>
              </div>
              <div className="bg-[#102038] p-3 border border-white/[0.08]">
                <span className="text-[#FF6B2B] block font-semibold">2. FastAPI Gateway</span>
                <span className="text-[11px] text-[#8A99AD] block mt-1">NumPy Grad-CAM (8.09ms) &amp; HSV segmentation</span>
              </div>
              <div className="bg-[#102038] p-3 border border-white/[0.08]">
                <span className="text-[#FFE9AE] block font-semibold">3. Clinical Dashboard</span>
                <span className="text-[11px] text-[#8A99AD] block mt-1">Three.js LiDAR elevation point-cloud</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-t border-white/[0.08] pt-3">
        <span>BENCHMARK // GRAD-CAM SALIENCY</span>
        <span className="text-[#FFB86C] font-semibold tabular-nums">8.09ms (Vectorized NumPy)</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Highlight Visual 2: Apexis Telemetry Simulation Stage
// ---------------------------------------------------------------------------
const ApexisMotorsportVisual: React.FC = () => {
  return (
    <div className="relative w-full min-h-[440px] bg-[#0A1424] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 border-[#F4EFE6]/10 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#70A5FF] via-[#FF6B2B] to-transparent" />

      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FF6B2B]" />
          <span className="text-[#F4EFE6] font-medium">Apexis · Web Worker Simulation Core</span>
        </div>
        <span className="text-[#4CC38A]">LOCKED 60 FPS</span>
      </div>

      <div className="relative z-10 my-auto py-6 space-y-6">
        <div className="bg-[#07090D] border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
            <span>SECTOR DELTA TELEMETRY TRACE</span>
            <span className="text-[#70A5FF]">Spike-free 16.6ms budget</span>
          </div>

          <div className="h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <line x1="0" y1="40" x2="200" y2="40" stroke="#162B4C" strokeWidth="1" strokeDasharray="4 4" />
              <path
                d="M 10 40 Q 35 15, 60 38 T 110 42 T 160 20 T 190 40"
                fill="none"
                stroke="#FF6B2B"
                strokeWidth="2"
              />
              <path
                d="M 10 40 Q 40 55, 75 35 T 120 48 T 165 42 T 190 40"
                fill="none"
                stroke="#70A5FF"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx="160" cy="20" r="4" fill="#FFE9AE" />
              <text x="160" y="12" fill="#FFE9AE" fontSize="6" fontFamily="monospace" textAnchor="middle">-0.248s Δ</text>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono border-t border-white/[0.06] pt-3">
            <div>
              <span className="text-[#8A99AD] block text-[10px]">SECTOR 1</span>
              <span className="text-[#4CC38A] tabular-nums">28.412s</span>
            </div>
            <div>
              <span className="text-[#8A99AD] block text-[10px]">SECTOR 2</span>
              <span className="text-[#FFB86C] tabular-nums">39.804s</span>
            </div>
            <div>
              <span className="text-[#8A99AD] block text-[10px]">SECTOR 3</span>
              <span className="text-[#70A5FF] tabular-nums">22.115s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-t border-white/[0.08] pt-3">
        <span>WORKER THREAD // SIMULATOR.WORKER.TS</span>
        <span className="text-[#4CC38A] font-semibold tabular-nums">Zero Main-Thread Block</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Highlight Visual 3: Tempo State-Machine Safety Stage
// ---------------------------------------------------------------------------
const TempoSafetyVisual: React.FC = () => {
  return (
    <div className="relative w-full min-h-[440px] bg-[#0A1424] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 border-[#F4EFE6]/10 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#4CC38A] via-[#FFB86C] to-transparent" />

      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4CC38A]" />
          <span className="text-[#F4EFE6] font-medium">Tempo · Air-Gapped Cognitive Buffer</span>
        </div>
        <span className="text-[#FFB86C]">OFFLINE-FIRST</span>
      </div>

      <div className="relative z-10 my-auto py-6 space-y-4 text-xs font-mono">
        <div className="bg-[#07090D] border border-white/[0.08] p-5 space-y-3">
          <span className="text-[#70A5FF] uppercase block">DETERMINISTIC QUEUE TRIAGE ENGINE</span>
          <p className="text-sm font-sans text-[#F4EFE6]">
            Structured state machine enforcing zero data exfiltration during peak cognitive overload.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#102038] p-3 border border-white/[0.06]">
              <span className="text-[#4CC38A] block font-semibold">IndexedDB Local Queue</span>
              <span className="text-[11px] text-[#8A99AD] block mt-1">100% offline persistence</span>
            </div>
            <div className="bg-[#102038] p-3 border border-white/[0.06]">
              <span className="text-[#FFB86C] block font-semibold">Heuristic Triage Filter</span>
              <span className="text-[11px] text-[#8A99AD] block mt-1">Strict priority thresholds</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-t border-white/[0.08] pt-3">
        <span>STORAGE // ZERO NETWORK EXTRUSION</span>
        <span className="text-[#4CC38A] font-semibold">Local SQLite / IndexedDB</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Highlight Visual 4: Careline / RouteRx Geospatial Transit Visual
// ---------------------------------------------------------------------------
const CarelineTransitVisual: React.FC = () => {
  return (
    <div className="relative w-full min-h-[440px] bg-[#0A1424] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 border-[#F4EFE6]/10 overflow-hidden">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#FF6B2B] via-[#FFE9AE] to-transparent" />

      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FF6B2B]" />
          <span className="text-[#F4EFE6] font-medium">RouteRx · Spatial Isochrone Optimization</span>
        </div>
        <span className="text-[#FFB86C]">1ST PLACE ASA DATAFEST</span>
      </div>

      <div className="relative z-10 my-auto py-6 space-y-4">
        <div className="bg-[#07090D] border border-white/[0.08] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
            <span>TRANSIT GAP ISOCHRONE MAP</span>
            <span className="text-[#4CC38A]">&lt;15ms query latency</span>
          </div>

          <div className="h-32 flex items-center justify-center">
            <svg viewBox="0 0 180 80" className="w-full h-full">
              <polygon points="20,40 50,15 130,20 160,50 120,70 40,65" fill="#102038" stroke="#162B4C" strokeWidth="1.5" />
              <polygon points="50,42 70,28 115,32 135,48 105,60 55,58" fill="#162B4C" stroke="#70A5FF" strokeWidth="1.2" />
              <circle cx="95" cy="42" r="4" fill="#FF6B2B" />
              <circle cx="45" cy="30" r="3" fill="#4CC38A" />
              <circle cx="140" cy="55" r="3" fill="#FFE9AE" />
              <line x1="95" y1="42" x2="45" y2="30" stroke="#FF6B2B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="95" y1="42" x2="140" y2="55" stroke="#FFE9AE" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD] border-t border-white/[0.06] pt-2">
            <span>Shawnee County Healthcare Routing</span>
            <span className="text-[#FFB86C]">Sub-15ms OSRM Matrix</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#8A99AD] border-t border-white/[0.08] pt-3">
        <span>DATA // AMERICAN STATISTICAL ASSOC.</span>
        <span className="text-[#FFB86C] font-semibold">1st Place External Data</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Export: ProjectLab (0px Swiss Architectural Blueprint Bands)
// ---------------------------------------------------------------------------
export const ProjectLab: React.FC = () => {
  return (
    <section
      id="projects"
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="Selected engineering projects and systems archive gateway"
    >
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION HEADER BAR                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-b border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
            <span className="text-[#FFB86C] font-semibold">04 // SELECTED WORKS</span>
            <span>INDEX // 05.1</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F4EFE6] leading-none tracking-tight">
            Selected Works
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#B0BCCB] max-w-2xl leading-relaxed">
            High-reliability systems, explainable computer vision pipelines, and real-time telemetry architectures built with verifiable proof.
          </p>
        </div>

        <Link
          href="/projects"
          className="px-6 py-3 bg-[#0C1729] hover:bg-[#132542] text-[#F4EFE6] border border-[#F4EFE6]/15 text-xs font-mono transition-colors inline-flex items-center gap-2 shrink-0 select-none"
        >
          <span>Open Dedicated Systems Hub</span>
          <span className="text-[#FFB86C]">→</span>
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4 FLAGSHIP BLUEPRINT BANDS (FULL-WIDTH 12-COL ALTERNATING SPREADS) */}
      {/* ------------------------------------------------------------------ */}
      <div>
        {/* WORK 1: HEALIOS V2 (7 Cols Media Left / 5 Cols Spec Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#F4EFE6]/10 relative group">
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10">
            <HealiosCenterpieceVisual />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#07090D]">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#FFB86C] uppercase tracking-wider block">
                01 // COMPUTER VISION &amp; 3D LIDAR
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] tracking-tight">
                Healios V2
              </h3>
              <p className="text-[16px] font-sans text-[#C4CDD8] leading-[1.65]">
                Post-operative surgical wound monitoring pipeline uniting 3D LiDAR elevation topography with sub-10ms explainable deep learning (Grad-CAM).
              </p>
              <div className="pt-2 text-xs font-mono text-[#8A99AD] space-y-1">
                <span className="text-[#70A5FF] uppercase block">CONTRIBUTION //</span>
                <p className="text-[14px] font-sans text-[#9BA8B8] leading-relaxed">
                  Vectorized NumPy Grad-CAM tensor pipeline (8.09ms), engineered HTML5 Canvas Laplacian blur gate (&lt;35ms), and built iOS RGB/LiDAR point-cloud pipeline.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F4EFE6]/10">
              <div className="text-xs font-mono text-[#8A99AD] flex flex-wrap items-center gap-2">
                <span className="text-[#FFB86C] font-semibold">STACK //</span>
                <span>Swift · ARKit · Metal · CoreML · NumPy · FastAPI · Three.js</span>
              </div>
              <div className="flex items-stretch border border-[#F4EFE6]/15 divide-x divide-[#F4EFE6]/15 text-xs font-mono">
                <Link
                  href="/projects/healios"
                  className="flex-1 bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold py-3.5 px-4 text-center transition-colors select-none"
                >
                  Read Case Study →
                </Link>
                <a
                  href="https://github.com/haresham15/HealiosPostSurgery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 hover:bg-[#162B4C] text-[#F4EFE6] transition-colors select-none text-center"
                >
                  Source ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* WORK 2: APEXIS (5 Cols Spec Left / 7 Cols Media Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#F4EFE6]/10 relative group">
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#07090D] border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#70A5FF] uppercase tracking-wider block">
                02 // MOTORSPORT TELEMETRY SIMULATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] tracking-tight">
                Apexis Telemetry Engine
              </h3>
              <p className="text-[16px] font-sans text-[#C4CDD8] leading-[1.65]">
                Deterministic multi-car race simulation running at a guaranteed 60 FPS via dedicated background Web Workers. Features zero main-thread jank and live sector delta calculations.
              </p>
              <div className="pt-2 text-xs font-mono text-[#8A99AD] space-y-1">
                <span className="text-[#FFB86C] uppercase block">CONTRIBUTION //</span>
                <p className="text-[14px] font-sans text-[#9BA8B8] leading-relaxed">
                  Segregated physics compute into Web Workers and live TV OCR into an in-browser Tesseract.js worker, eliminating server streaming latency.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F4EFE6]/10">
              <div className="text-xs font-mono text-[#8A99AD] flex flex-wrap items-center gap-2">
                <span className="text-[#FFB86C] font-semibold">STACK //</span>
                <span>TypeScript · Web Workers · SQLite · HTML5 Canvas · SharedArrayBuffer</span>
              </div>
              <div className="flex items-stretch border border-[#F4EFE6]/15 divide-x divide-[#F4EFE6]/15 text-xs font-mono">
                <Link
                  href="/projects/apexis"
                  className="flex-1 bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold py-3.5 px-4 text-center transition-colors select-none"
                >
                  Read Case Study →
                </Link>
                <a
                  href="https://github.com/haresham15/AIMotorsportsHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 hover:bg-[#162B4C] text-[#F4EFE6] transition-colors select-none text-center"
                >
                  Source ↗
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <ApexisMotorsportVisual />
          </div>
        </div>

        {/* WORK 3: TEMPO (7 Cols Media Left / 5 Cols Spec Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#F4EFE6]/10 relative group">
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10">
            <TempoSafetyVisual />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#07090D]">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#4CC38A] uppercase tracking-wider block">
                03 // COGNITIVE WORKSPACE &amp; AIR-GAPPED BUFFERS
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] tracking-tight">
                Tempo Task Suite
              </h3>
              <p className="text-[16px] font-sans text-[#C4CDD8] leading-[1.65]">
                Air-gapped task triage suite with local SQLite encryption, deterministic queue priority ordering, and zero background analytics exfiltration.
              </p>
              <div className="pt-2 text-xs font-mono text-[#8A99AD] space-y-1">
                <span className="text-[#4CC38A] uppercase block">CONTRIBUTION //</span>
                <p className="text-[14px] font-sans text-[#9BA8B8] leading-relaxed">
                  Engineered zero-extrusion IPC bridge and local state synchronization engine with crash-safe journal recovery.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F4EFE6]/10">
              <div className="text-xs font-mono text-[#8A99AD] flex flex-wrap items-center gap-2">
                <span className="text-[#FFB86C] font-semibold">STACK //</span>
                <span>Electron · React · TypeScript · SQLite · Tailwind CSS</span>
              </div>
              <div className="flex items-stretch border border-[#F4EFE6]/15 divide-x divide-[#F4EFE6]/15 text-xs font-mono">
                <Link
                  href="/projects/tempo"
                  className="flex-1 bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold py-3.5 px-4 text-center transition-colors select-none"
                >
                  Read Case Study →
                </Link>
                <a
                  href="https://github.com/haresham15/tempo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 hover:bg-[#162B4C] text-[#F4EFE6] transition-colors select-none text-center"
                >
                  Source ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* WORK 4: CARELINE (5 Cols Spec Left / 7 Cols Media Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#F4EFE6]/10 relative group">
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#07090D] border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#FFE9AE] uppercase tracking-wider block">
                04 // SPATIAL TRANSIT MODELING (ASA DATAFEST 1ST)
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] tracking-tight">
                RouteRx / Careline
              </h3>
              <p className="text-[16px] font-sans text-[#C4CDD8] leading-[1.65]">
                Bi-directional transit routing engine resolving healthcare transit deserts in Shawnee County, KS for Stormont Vail Health. Sub-15ms query latency.
              </p>
              <div className="pt-2 text-xs font-mono text-[#8A99AD] space-y-1">
                <span className="text-[#FFB86C] uppercase block">CONTRIBUTION //</span>
                <p className="text-[14px] font-sans text-[#9BA8B8] leading-relaxed">
                  Integrated Open Source Routing Machine (OSRM) with demographic spatial buffers, presenting findings directly to ASA DataFest evaluation panel.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F4EFE6]/10">
              <div className="text-xs font-mono text-[#8A99AD] flex flex-wrap items-center gap-2">
                <span className="text-[#FFB86C] font-semibold">STACK //</span>
                <span>Python · OSRM · Folium · GeoPandas · Spatial Isochrones</span>
              </div>
              <div className="flex items-stretch border border-[#F4EFE6]/15 divide-x divide-[#F4EFE6]/15 text-xs font-mono">
                <Link
                  href="/projects/routerx-careline-hub"
                  className="flex-1 bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold py-3.5 px-4 text-center transition-colors select-none"
                >
                  Read Case Study →
                </Link>
                <a
                  href="https://github.com/haresham15/Careline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 hover:bg-[#162B4C] text-[#F4EFE6] transition-colors select-none text-center"
                >
                  Source ↗
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <CarelineTransitVisual />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* GATEWAY TO DEDICATED PROJECT ARCHIVE (0px Swiss Architectural Bay) */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-6 sm:p-8 lg:p-12 border-t border-[#F4EFE6]/10 space-y-8 bg-[#07090D] relative">
        <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
        <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#F4EFE6]/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
              <span className="text-[#FFB86C] font-semibold">03.5 // COMPLETE REPOSITORY LEDGER</span>
              <span>18 ARCHIVED SYSTEMS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F4EFE6] tracking-tight">
              Engineering Systems Archive
            </h3>
            <p className="text-sm sm:text-base font-sans text-[#A6ADB8] max-w-2xl leading-relaxed">
              Explore the dedicated timing sheet archive featuring all 18 production systems, AI pipelines, and collegiate research prototypes with interactive keyword search, domain filters, and benchmark telemetry.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/projects"
              className="px-6 py-4 bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] text-xs font-mono font-semibold transition-colors flex items-center justify-between sm:justify-center gap-3 select-none group"
            >
              <span>Explore Complete Archive (18)</span>
              <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* 3 Streamlined Preview Rows with Direct Jump to Full Archive */}
        <div className="border border-[#F4EFE6]/10 divide-y divide-[#F4EFE6]/10">
          <div className="hidden lg:grid grid-cols-12 gap-4 py-2.5 px-6 text-[11px] font-mono text-[#8A99AD] uppercase tracking-wider bg-[#0C1729]/60">
            <div className="col-span-1">INDEX</div>
            <div className="col-span-4">FEATURED ARCHIVE SYSTEM</div>
            <div className="col-span-4">STACK &amp; DOMAIN</div>
            <div className="col-span-3 text-right">TELEMETRY</div>
          </div>

          {archiveProjects.slice(0, 3).map((proj, idx) => (
            <Link
              key={proj.slug}
              href={`/projects/${proj.slug}`}
              className="py-3.5 px-6 hover:bg-[#0C1729] transition-all group flex flex-col lg:grid lg:grid-cols-12 gap-2 lg:gap-4 items-start lg:items-center relative"
            >
              <div className="lg:col-span-1 text-xs font-mono text-[#FFB86C] tabular-nums">
                {(idx + 5).toString().padStart(2, '0')}{' '}
                <span className="text-[#8A99AD] text-[10px]">/{proj.year}</span>
              </div>
              <div className="lg:col-span-4">
                <span className="text-base font-serif text-[#F4EFE6] group-hover:text-[#FFB86C] transition-colors">
                  {proj.title}
                </span>
              </div>
              <div className="lg:col-span-4 text-xs font-mono text-[#70A5FF] truncate">
                {proj.stack}
              </div>
              <div className="lg:col-span-3 lg:text-right text-xs font-mono text-[#FFE9AE]">
                <span>{proj.highlight || proj.statusBadge} ↗</span>
              </div>
            </Link>
          ))}

          <div className="py-3.5 px-6 bg-[#0C1729]/30 flex items-center justify-between text-xs font-mono">
            <span className="text-[#8A99AD]">
              + 11 additional systems in the dedicated archive
            </span>
            <Link
              href="/projects"
              className="text-[#FFB86C] hover:text-[#FFE9AE] inline-flex items-center gap-1.5 font-medium transition-colors"
            >
              <span>View All 18 Systems in Archive Ledger</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectLab;
