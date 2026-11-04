import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePortfolioStore, HeroLayer } from '@/store/usePortfolioStore';

const HeroSignalCube = dynamic(
  () => import('@/setpieces/HeroSignalCube'),
  { ssr: false }
);

export const HeroPoster: React.FC = () => {
  const { activeHeroLayer, setActiveHeroLayer, mode, webglFailed } = usePortfolioStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const show3D = mounted && mode === 'cinematic' && !webglFailed;

  const layers: {
    id: HeroLayer;
    label: string;
    proof: string;
    linkText: string;
    href: string;
    color: string;
  }[] = [
    {
      id: 'all',
      label: 'All Layers',
      proof: 'Full-stack engineering unifying deep learning models, high-concurrency systems, and geospatial analysis.',
      linkText: 'Explore selected work below',
      href: '#projects',
      color: '#E0E0E0',
    },
    {
      id: 'ai-ml',
      label: 'AI / ML',
      proof: '8.09ms Grad-CAM Explainable AI & HSV tissue morphology in Healios V2, plus digital pathology research at OSU.',
      linkText: 'Inspect Healios V2 Case Study →',
      href: '/projects/healios',
      color: '#D8B4FE',
    },
    {
      id: 'systems',
      label: 'Software Systems',
      proof: '60fps off-main-thread Web Worker race simulation in Apexis & zero-destination pgvector buffer in Tempo.',
      linkText: 'Inspect Apexis Case Study →',
      href: '/projects/apexis',
      color: '#7DD3FC',
    },
    {
      id: 'research',
      label: 'Research & Data',
      proof: '1st Place ASA DataFest 2026 bi-directional transit optimization analyzing Shawnee County transit deserts.',
      linkText: 'Inspect RouteRx (Careline) →',
      href: '/projects/routerx-careline',
      color: '#34D399',
    },
  ];

  const currentLayer = layers.find((l) => l.id === activeHeroLayer) || layers[0];

  const isAimActive = activeHeroLayer === 'all' || activeHeroLayer === 'ai-ml';
  const isSysActive = activeHeroLayer === 'all' || activeHeroLayer === 'systems';
  const isResActive = activeHeroLayer === 'all' || activeHeroLayer === 'research';

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0D1118]/80 border border-white/10 rounded-3xl shadow-token-card relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${currentLayer.color} 0%, transparent 70%)`,
        }}
      />

      {/* Header telemetry badge */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-white/5 text-[11px] font-mono text-[#A6ADB8] relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7DD3FC] animate-ping" />
          <span className="uppercase tracking-widest text-[#E0E0E0]">Signal-to-System Architecture</span>
        </div>
        <span className="text-[#A6ADB8]/70">P0 Isometric Schema</span>
      </div>

      {/* SVG Isometric Signal-to-System Cube / Dynamic 3D WebGL Canvas */}
      <div className="w-full max-w-[380px] aspect-square relative flex items-center justify-center z-10 py-2">
        <svg
          viewBox="0 0 320 320"
          className={`w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)] transition-opacity duration-700 ${
            show3D ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS & GRADIENTS */}
          <defs>
            <linearGradient id="grad-aiml" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="grad-sys" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="grad-res" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* AXIS PROJECTION GUIDES */}
          <g stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3">
            <line x1="160" y1="40" x2="160" y2="280" />
            <line x1="60" y1="95" x2="260" y2="215" />
            <line x1="260" y1="95" x2="60" y2="215" />
          </g>

          {/* LAYER 3: RESEARCH & DATA (BASE PLATFORM) */}
          <g
            className="transition-all duration-300 cursor-pointer"
            onClick={() => setActiveHeroLayer('research')}
            opacity={isResActive ? 1 : 0.25}
          >
            {/* Top Face */}
            <polygon
              points="160,205 240,245 160,285 80,245"
              fill={isResActive ? 'url(#grad-res)' : 'rgba(255,255,255,0.02)'}
              stroke="#34D399"
              strokeWidth={activeHeroLayer === 'research' ? 2 : 1}
            />
            {/* Left Face */}
            <polygon
              points="80,245 160,285 160,295 80,255"
              fill="rgba(52, 211, 153, 0.15)"
              stroke="#34D399"
              strokeWidth={0.8}
            />
            {/* Right Face */}
            <polygon
              points="160,285 240,245 240,255 160,295"
              fill="rgba(52, 211, 153, 0.08)"
              stroke="#34D399"
              strokeWidth={0.8}
            />
            {/* Text Annotation */}
            <text x="160" y="250" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
              LAYER 01: RESEARCH & GEOSPATIAL DATA
            </text>
          </g>

          {/* CONNECTOR VERTICAL STRUTS: BASE TO MID */}
          <g stroke="rgba(125,211,252,0.3)" strokeWidth="1" strokeDasharray="2 2">
            <line x1="80" y1="245" x2="80" y2="175" />
            <line x1="240" y1="245" x2="240" y2="175" />
            <line x1="160" y1="285" x2="160" y2="215" />
          </g>

          {/* LAYER 2: SOFTWARE SYSTEMS (MIDDLE TIER) */}
          <g
            className="transition-all duration-300 cursor-pointer"
            onClick={() => setActiveHeroLayer('systems')}
            opacity={isSysActive ? 1 : 0.25}
          >
            {/* Top Face */}
            <polygon
              points="160,135 240,175 160,215 80,175"
              fill={isSysActive ? 'url(#grad-sys)' : 'rgba(255,255,255,0.02)'}
              stroke="#7DD3FC"
              strokeWidth={activeHeroLayer === 'systems' ? 2 : 1}
            />
            {/* Left Face */}
            <polygon
              points="80,175 160,215 160,225 80,185"
              fill="rgba(125, 211, 252, 0.15)"
              stroke="#7DD3FC"
              strokeWidth={0.8}
            />
            {/* Right Face */}
            <polygon
              points="160,215 240,175 240,185 160,225"
              fill="rgba(125, 211, 252, 0.08)"
              stroke="#7DD3FC"
              strokeWidth={0.8}
            />
            {/* Text Annotation */}
            <text x="160" y="180" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
              LAYER 02: HIGH-CONCURRENCY SYSTEMS
            </text>
          </g>

          {/* CONNECTOR VERTICAL STRUTS: MID TO TOP */}
          <g stroke="rgba(216,180,254,0.3)" strokeWidth="1" strokeDasharray="2 2">
            <line x1="80" y1="175" x2="80" y2="105" />
            <line x1="240" y1="175" x2="240" y2="105" />
            <line x1="160" y1="215" x2="160" y2="145" />
          </g>

          {/* LAYER 1: AI / COMPUTER VISION (TOP EMITTER) */}
          <g
            className="transition-all duration-300 cursor-pointer"
            onClick={() => setActiveHeroLayer('ai-ml')}
            opacity={isAimActive ? 1 : 0.25}
          >
            {/* Top Face */}
            <polygon
              points="160,65 240,105 160,145 80,105"
              fill={isAimActive ? 'url(#grad-aiml)' : 'rgba(255,255,255,0.02)'}
              stroke="#D8B4FE"
              strokeWidth={activeHeroLayer === 'ai-ml' ? 2 : 1}
            />
            {/* Left Face */}
            <polygon
              points="80,105 160,145 160,155 80,115"
              fill="rgba(216, 180, 254, 0.2)"
              stroke="#D8B4FE"
              strokeWidth={0.8}
            />
            {/* Right Face */}
            <polygon
              points="160,145 240,105 240,115 160,155"
              fill="rgba(216, 180, 254, 0.1)"
              stroke="#D8B4FE"
              strokeWidth={0.8}
            />
            {/* Apex Signal Node */}
            <circle cx="160" cy="65" r="4" fill="#D8B4FE" />
            <circle cx="160" cy="65" r="8" stroke="#D8B4FE" strokeWidth="0.8" opacity="0.6" />
            {/* Text Annotation */}
            <text x="160" y="110" textAnchor="middle" fill="#D8B4FE" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
              LAYER 03: AI & EXPLAINABLE VISION
            </text>
          </g>
        </svg>

        {show3D && (
          <div className="absolute inset-0 w-full h-full pointer-events-auto">
            <HeroSignalCube />
          </div>
        )}
      </div>

      {/* Interactive Layer Toggle Buttons */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 my-4 relative z-10 flex-wrap">
        {layers.map((layer) => {
          const isSelected = activeHeroLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveHeroLayer(layer.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                isSelected
                  ? 'bg-white/10 text-white border-[#7DD3FC] shadow-[0_0_12px_rgba(125,211,252,0.25)]'
                  : 'bg-white/[0.02] text-[#A6ADB8] border-white/5 hover:border-white/15 hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Semantic Technical Proof readout */}
      <div className="w-full mt-2 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <p className="text-xs sm:text-sm font-sans text-[#E0E0E0] leading-relaxed max-w-lg">
          {currentLayer.proof}
        </p>
        <Link
          href={currentLayer.href}
          className="text-xs font-mono text-[#7DD3FC] hover:text-white transition-colors shrink-0 font-medium"
        >
          {currentLayer.linkText}
        </Link>
      </div>

    </div>
  );
};

export default HeroPoster;

