import React, { useState } from 'react';
import { analytics } from '@/lib/analytics';

export interface BenchmarkNode {
  id: string;
  label: string;
  category: 'normal' | 'burnout' | 'crisis';
  x2d: number;
  y2d: number;
  x3d: number;
  y3d: number;
  cosineScore: number;
  routing: string;
}

const BENCHMARK_NODES: BenchmarkNode[] = [
  // Crisis Cluster (Caught deterministically by 0.2ms Regex circuit breaker)
  { id: 'c1', label: 'Self-harm ideation explicit trigger', category: 'crisis', x2d: 40, y2d: 45, x3d: 35, y3d: 40, cosineScore: 0.942, routing: 'Safety Intercept (0.2ms) -> 988 Lifeline Direct' },
  { id: 'c2', label: 'Severe hopelessness spiral', category: 'crisis', x2d: 55, y2d: 50, x3d: 50, y3d: 45, cosineScore: 0.915, routing: 'Safety Intercept (0.2ms) -> Emergency Protocol' },
  { id: 'c3', label: 'Despair emergency phrasing', category: 'crisis', x2d: 45, y2d: 60, x3d: 42, y3d: 55, cosineScore: 0.898, routing: 'Safety Intercept (0.2ms) -> Crisis Resource HUD' },
  { id: 'c4', label: 'Acute panic paralysis alarm', category: 'crisis', x2d: 65, y2d: 40, x3d: 60, y3d: 35, cosineScore: 0.884, routing: 'Safety Intercept (0.2ms) -> Zero-Destination Buffer' },
  { id: 'c5', label: 'Extremity distress trigger statement', category: 'crisis', x2d: 50, y2d: 70, x3d: 48, y3d: 65, cosineScore: 0.871, routing: 'Safety Intercept (0.2ms) -> Vagal Grounding Pulse' },

  // Burnout & RSD High-Arousal Cluster (pgvector RAG semantic reframing)
  { id: 'b1', label: 'Manager sent tersely worded "Can we talk?"', category: 'burnout', x2d: 140, y2d: 120, x3d: 135, y3d: 110, cosineScore: 0.824, routing: 'pgvector RAG -> Cognitive Reframe (DeepSeek V3)' },
  { id: 'b2', label: 'Team lead ignored PR feedback for 3 days', category: 'burnout', x2d: 160, y2d: 140, x3d: 155, y3d: 135, cosineScore: 0.812, routing: 'pgvector RAG -> Rejection Sensitivity Circuit Breaker' },
  { id: 'b3', label: 'Impostor syndrome during sprint demo', category: 'burnout', x2d: 130, y2d: 155, x3d: 125, y3d: 150, cosineScore: 0.795, routing: 'pgvector RAG -> Past Resolution Retrieval' },
  { id: 'b4', label: 'Overloaded schedule & missed deadline', category: 'burnout', x2d: 180, y2d: 115, x3d: 175, y3d: 105, cosineScore: 0.788, routing: 'pgvector RAG -> Micro-Task Chunker (Spatial CV)' },
  { id: 'b5', label: 'Unread email anxiety freeze', category: 'burnout', x2d: 150, y2d: 170, x3d: 145, y3d: 165, cosineScore: 0.772, routing: 'pgvector RAG -> Brownian Noise Generator' },

  // Normal Task / Work Queries (Standard Zero-Destination Drafting)
  { id: 'n1', label: 'Drafting routine client status update', category: 'normal', x2d: 260, y2d: 200, x3d: 250, y3d: 190, cosineScore: 0.612, routing: 'Zero-Destination Drafting -> Neutral Buffer' },
  { id: 'n2', label: 'Refactoring database schema migration notes', category: 'normal', x2d: 290, y2d: 230, x3d: 280, y3d: 220, cosineScore: 0.540, routing: 'Zero-Destination Drafting -> Neutral Buffer' },
  { id: 'n3', label: 'Writing technical API documentation RFC', category: 'normal', x2d: 240, y2d: 240, x3d: 235, y3d: 230, cosineScore: 0.525, routing: 'Zero-Destination Drafting -> Neutral Buffer' },
  { id: 'n4', label: 'Preparing weekly engineering meeting agenda', category: 'normal', x2d: 280, y2d: 180, x3d: 275, y3d: 170, cosineScore: 0.490, routing: 'Zero-Destination Drafting -> Neutral Buffer' },
  { id: 'n5', label: 'Composing polite meeting reschedule request', category: 'normal', x2d: 310, y2d: 210, x3d: 300, y3d: 205, cosineScore: 0.465, routing: 'Zero-Destination Drafting -> Neutral Buffer' },
];

export const TempoDemo: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('b1');
  const [is3DProjection, setIs3DProjection] = useState<boolean>(false);

  const activeNode = BENCHMARK_NODES.find((n) => n.id === selectedNodeId) || BENCHMARK_NODES[5];

  const handleSelectPreset = (id: string) => {
    setSelectedNodeId(id);
    analytics.track('demo_interaction', 'tempo_preset_select', { id });
  };

  return (
    <div className="w-full rounded-3xl bg-[#0D1118] border border-white/10 p-5 sm:p-7 shadow-token-card flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#34D399] font-semibold">
              pgvector RAG & Crisis Circuit Breaker
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
            Tempo: Vector Embedding Space & Crisis Interceptor
          </h3>
        </div>

        {/* 2D / 3D Projection Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIs3DProjection(!is3DProjection)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#7DD3FC] hover:text-white transition-colors"
          >
            {is3DProjection ? 'View: 3D UMAP' : 'View: 2D PCA'}
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center mb-6">
        
        {/* LEFT: Scatter Vector Space Projection (7 cols) */}
        <div className="xl:col-span-7 relative w-full aspect-[4/3] rounded-2xl bg-[#050505] border border-white/10 p-4 overflow-hidden">
          
          <svg viewBox="0 0 360 280" className="w-full h-full" fill="none">
            {/* Coordinate grid lines */}
            <g stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3">
              <line x1="180" y1="0" x2="180" y2="280" />
              <line x1="0" y1="140" x2="360" y2="140" />
            </g>

            {/* Semantic Link Lines between active node and neighbors */}
            {BENCHMARK_NODES.map((node) => {
              if (node.id === activeNode.id) return null;
              const isSameCluster = node.category === activeNode.category;
              if (!isSameCluster) return null;

              const x1 = is3DProjection ? activeNode.x3d : activeNode.x2d;
              const y1 = is3DProjection ? activeNode.y3d : activeNode.y2d;
              const x2 = is3DProjection ? node.x3d : node.x2d;
              const y2 = is3DProjection ? node.y3d : node.y2d;

              return (
                <line
                  key={node.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={activeNode.category === 'crisis' ? '#F87171' : activeNode.category === 'burnout' ? '#D8B4FE' : '#7DD3FC'}
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
              );
            })}

            {/* Benchmark Query Nodes */}
            {BENCHMARK_NODES.map((node) => {
              const x = is3DProjection ? node.x3d : node.x2d;
              const y = is3DProjection ? node.y3d : node.y2d;
              const isSelected = node.id === activeNode.id;

              const fillColor =
                node.category === 'crisis'
                  ? '#F87171'
                  : node.category === 'burnout'
                  ? '#D8B4FE'
                  : '#7DD3FC';

              return (
                <g
                  key={node.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => handleSelectPreset(node.id)}
                >
                  {isSelected && (
                    <circle r="12" stroke={fillColor} strokeWidth="1.5" opacity="0.8" className="animate-ping" />
                  )}
                  <circle
                    r={isSelected ? 6 : 4}
                    fill={fillColor}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {isSelected && (
                    <text
                      x="10"
                      y="4"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {node.category.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Cluster Legend Overlay */}
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-3 text-[10px] font-mono bg-[#050505]/85 p-2 rounded-lg border border-white/5">
            <span className="flex items-center gap-1.5 text-[#F87171]">
              <span className="w-2 h-2 rounded-full bg-[#F87171]" />
              Crisis (100% Intercept)
            </span>
            <span className="flex items-center gap-1.5 text-[#D8B4FE]">
              <span className="w-2 h-2 rounded-full bg-[#D8B4FE]" />
              RSD/Burnout (pgvector RAG)
            </span>
            <span className="flex items-center gap-1.5 text-[#7DD3FC]">
              <span className="w-2 h-2 rounded-full bg-[#7DD3FC]" />
              Normal Drafting
            </span>
          </div>

          <div className="absolute top-3 right-3 text-[10px] font-mono text-[#A6ADB8] bg-[#050505]/80 px-2 py-1 rounded-lg border border-white/5">
            30-Case Benchmark Projection
          </div>
        </div>

        {/* RIGHT: Architecture Readout & Presets (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Preset Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#A6ADB8]">
              Select Benchmark Scenario
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('b1')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeNode.id === 'b1'
                    ? 'bg-[#D8B4FE]/10 border-[#D8B4FE]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-xs font-bold text-white block mb-0.5">RSD Trigger: Ambiguous Manager Message</span>
                <span className="text-[11px] font-mono text-[#D8B4FE]">pgvector Cosine 0.824</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('b4')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeNode.id === 'b4'
                    ? 'bg-[#D8B4FE]/10 border-[#D8B4FE]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-xs font-bold text-white block mb-0.5">Task Freeze: Overloaded Schedule</span>
                <span className="text-[11px] font-mono text-[#D8B4FE]">Spatial CV Chunker Trigger</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('c1')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeNode.id === 'c1'
                    ? 'bg-[#F87171]/10 border-[#F87171]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-xs font-bold text-[#F87171] block mb-0.5">Safety Boundary Test: Crisis Language</span>
                <span className="text-[11px] font-mono text-[#F87171]">0.2ms Regex Circuit Breaker Intercept</span>
              </button>
            </div>
          </div>

          {/* Active Node Routing Ledger */}
          <div className="p-4 rounded-2xl bg-[#050505] border border-white/10 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-[#A6ADB8]">Active Query:</span>
              <span className="text-white font-bold truncate max-w-[200px]">{activeNode.label}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A6ADB8]">Cosine Similarity:</span>
              <span className="text-[#7DD3FC] font-bold">{activeNode.cosineScore}</span>
            </div>

            <div className="pt-2 border-t border-white/5">
              <span className="text-[#A6ADB8] block text-[10px] mb-1">ARCHITECTURAL ROUTING:</span>
              <span className={`font-sans text-xs font-semibold ${
                activeNode.category === 'crisis' ? 'text-[#F87171]' : 'text-[#34D399]'
              }`}>
                {activeNode.routing}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Safety Bounds Disclaimer */}
      <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#A6ADB8] gap-2">
        <span>Evaluated on 30-case benchmark dataset (5/5 crisis recall)</span>
        <span className="text-[#A6ADB8]/70">Zero-Destination Sandbox · Does not claim clinical diagnosis</span>
      </div>

    </div>
  );
};

export default TempoDemo;
