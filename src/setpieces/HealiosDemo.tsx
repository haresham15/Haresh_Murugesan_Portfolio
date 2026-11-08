import React, { useState } from 'react';
import { analytics } from '@/lib/analytics';

export type PipelineStage = 'raw' | 'preprocessing' | 'prediction' | 'gradcam';

export const HealiosDemo: React.FC = () => {
  const [activeStage, setActiveStage] = useState<PipelineStage>('gradcam');
  const [lensPosition, setLensPosition] = useState<number>(50); // percentage slider
  const [isHoveringLens, setIsHoveringLens] = useState<boolean>(false);

  const stages: { id: PipelineStage; label: string; latency: string; description: string }[] = [
    {
      id: 'raw',
      label: '1. Edge Quality Gate',
      latency: '< 35 ms',
      description: 'In-browser HTML5 Canvas Laplacian blur and luminance check filters unreadable photos before upload.',
    },
    {
      id: 'preprocessing',
      label: '2. HSV Tissue Bed',
      latency: '2.00 ms',
      description: 'Vectorized OpenCV/NumPy HSV morphology separating granulation (red), slough (yellow), and necrosis.',
    },
    {
      id: 'prediction',
      label: '3. CNN Classification',
      latency: '14.2 ms',
      description: 'Deep convolutional backbone computes surgical site risk scores across feature feature activation maps.',
    },
    {
      id: 'gradcam',
      label: '4. Grad-CAM Saliency',
      latency: '8.09 ms',
      description: 'Vectorized NumPy linear Jet colormap generates explainable diagnostic heatmaps without matplotlib GUI locks.',
    },
  ];

  const handleStageSelect = (stage: PipelineStage) => {
    setActiveStage(stage);
    analytics.track('demo_interaction', 'healios_stage_select', { stage });
  };

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLensPosition(Number(e.target.value));
  };

  return (
    <div className="w-full rounded-[2px] bg-[#060A12] border border-[#F4F6F9]/10 p-5 sm:p-7 shadow-[0_4px_24px_rgba(7,11,18,0.7)] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#F4F6F9]/10 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C8D2E0]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF2800] font-semibold">
              Explainable AI (XAI) Architecture
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-raleway font-bold text-[#F4F6F9] tracking-tight">
            Healios V2: 8.09ms Grad-CAM Saliency Lens
          </h3>
        </div>

        {/* Verified Pipeline Latency Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#0B1E40] border border-[#F4F6F9]/10 text-xs font-mono text-[#7E8B9B]">
          <span>Pipeline Latency:</span>
          <strong className="text-[#4CC38A]">8.09 ms Saliency</strong>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center mb-6">
        
        {/* LEFT: Interactive Comparison Lens (7 cols) */}
        <div className="xl:col-span-7 relative w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[#060A12] border border-[#F4F6F9]/10 select-none group">
          
          {/* Base Layer: Synthetic Surface Simulation (Simulated Granulation/Slough) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#2D1B1B] via-[#4A2020] to-[#1E1414] flex items-center justify-center">
            {/* Synthetic tissue bed canvas pattern */}
            <svg viewBox="0 0 400 300" className="w-full h-full opacity-60">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" />
                <feColorMatrix type="saturate" values="0.3" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" fill="#8B4545" opacity="0.35" />
              {/* Simulated incision margin line */}
              <path
                d="M 120 70 Q 200 150 260 230"
                stroke="#E57373"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M 120 70 Q 200 150 260 230"
                stroke="#FFCDD2"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Granulation bed nodes */}
              <circle cx="180" cy="130" r="28" fill="#C62828" opacity="0.6" />
              <circle cx="210" cy="160" r="34" fill="#D32F2F" opacity="0.5" />
              <circle cx="240" cy="190" r="22" fill="#FBC02D" opacity="0.4" />
            </svg>
          </div>

          {/* Saliency Heatmap Layer (Clipped by Lens Slider) */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-75"
            style={{
              clipPath: `polygon(0 0, ${lensPosition}% 0, ${lensPosition}% 100%, 0 100%)`,
            }}
          >
            {/* Simulated Vectorized Jet Colormap Saliency */}
            <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-90">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <radialGradient id="gradcam-heat" cx="50%" cy="50%" r="45%">
                    <stop offset="0%" stopColor="#FF0000" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#FF7700" stopOpacity="0.8" />
                    <stop offset="65%" stopColor="#FFFF00" stopOpacity="0.65" />
                    <stop offset="85%" stopColor="#00FFCC" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0000FF" stopOpacity="0.0" />
                  </radialGradient>
                </defs>
                {/* Focused Grad-CAM activation centroid along margin */}
                <ellipse cx="200" cy="150" rx="95" ry="80" fill="url(#gradcam-heat)" />
                {/* Secondary activation peak */}
                <ellipse cx="235" cy="180" rx="50" ry="40" fill="url(#gradcam-heat)" opacity="0.8" />
              </svg>
            </div>

            {/* Stage-specific diagnostic HUD tags */}
            <div className="absolute top-3 left-3 bg-[#060A12]/90 border border-[#82B7FF]/40 px-2.5 py-1.5 rounded-[2px] text-[10px] font-mono text-[#82B7FF]">
              Grad-CAM Piecewise Jet (Active)
            </div>
          </div>

          {/* Vertical Lens Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
            style={{ left: `${lensPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white text-[#060A12] flex items-center justify-center text-[10px] font-bold shadow-lg">
              ↔
            </div>
          </div>

          {/* Bottom Labels */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] font-mono pointer-events-none">
            <span className="bg-[#060A12]/80 px-2 py-1 rounded-[2px] text-[#82B7FF] border border-[#F4F6F9]/10">
              ← Saliency Heatmap ({lensPosition}%)
            </span>
            <span className="bg-[#060A12]/80 px-2 py-1 rounded-[2px] text-[#F4F6F9] border border-[#F4F6F9]/10">
              Raw Image Overlay →
            </span>
          </div>

          {/* Interactive Range Slider (Overlay covering whole canvas for drag) */}
          <input
            id="healios-lens-slider"
            name="healios-lens-slider"
            type="range"
            min="0"
            max="100"
            value={lensPosition}
            onChange={handleSliderMove}
            aria-label="Grad-CAM Saliency Comparison Lens Slider"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>

        {/* RIGHT: Pipeline Stages & Live Timing Breakdown (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-widest text-[#7E8B9B]">
              Vectorized Pipeline Inspection
            </p>

            {stages.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageSelect(stage.id)}
                  className={`w-full text-left p-3 rounded-[2px] border transition-all ${
                    isSelected
                      ? 'bg-[#0B1E40] border-[#FF2800] shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-sans font-bold ${isSelected ? 'text-[#F4F6F9]' : 'text-[#7E8B9B]'}`}>
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-mono text-[#4CC38A] font-semibold">
                      {stage.latency}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-[#7E8B9B] leading-relaxed">
                    {stage.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Live Timing Ledger */}
          <div className="p-3.5 rounded-[2px] bg-[#060A12] border border-[#F4F6F9]/10 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F4F6F9]/10 text-[11px]">
              <span className="text-[#7E8B9B]">Grad-CAM Saliency Compute</span>
              <span className="text-[#82B7FF] font-bold">8.09 ms</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#7E8B9B]">Memory Footprint Reduction</span>
              <span className="text-[#4CC38A] font-bold">120 MB+ Saved</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#A6ADB8]/70 pt-2 mt-2 border-t border-white/5">
              <span>Pure NumPy Linear Interpolation</span>
              <span>Zero Matplotlib Overhead</span>
            </div>
          </div>

        </div>

      </div>

      {/* Methodology Disclaimer */}
      <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#A6ADB8] gap-2">
        <span>Synthetic test patch · Evaluated on 224x224 RGB tensor input</span>
        <span className="text-[#FBBF24]">Academic/Research prototype — No clinical diagnosis claims</span>
      </div>

    </div>
  );
};

export default HealiosDemo;
