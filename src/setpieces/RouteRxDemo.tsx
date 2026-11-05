import React, { useState } from 'react';
import { analytics } from '@/lib/analytics';

export type TransitMode = 'baseline' | 'routerx';

export const RouteRxDemo: React.FC = () => {
  const [transitMode, setTransitMode] = useState<TransitMode>('routerx');
  const [selectedZone, setSelectedZone] = useState<string>('zone-central');

  const zoneData = [
    { id: 'zone-north', name: 'North Topeka (Kansas River Margin)', blocks: 14, unservedRatio: '64%', baselineWait: '58 min', optimizedWait: '18 min', status: 'Transit Isolated' },
    { id: 'zone-central', name: 'Central / East Topeka (Stormont Vail)', blocks: 18, unservedRatio: '42%', baselineWait: '45 min', optimizedWait: '12 min', status: 'High Vulnerability' },
    { id: 'zone-south', name: 'Southwest Residential Corridor', blocks: 11, unservedRatio: '55%', baselineWait: '65 min', optimizedWait: '22 min', status: 'Discharge Bottleneck' },
  ];

  const handleModeToggle = (mode: TransitMode) => {
    setTransitMode(mode);
    analytics.track('demo_interaction', 'routerx_mode_toggle', { mode });
  };

  const currentZone = zoneData.find((z) => z.id === selectedZone) || zoneData[1];

  return (
    <div className="w-full rounded-[2px] bg-[#070B12] border border-[#F3EFE7]/10 p-5 sm:p-7 shadow-[0_4px_24px_rgba(7,11,18,0.7)] flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#F3EFE7]/10 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#82B7FF]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold">
              ASA DataFest 2026 1st Place Platform
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-raleway font-bold text-[#F3EFE7] tracking-tight">
            RouteRx (Careline): Healthcare Transit Desert Optimizer
          </h3>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex items-center rounded-[2px] bg-[#101B30] border border-[#F3EFE7]/10 p-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleModeToggle('baseline')}
            className={`px-3 py-1.5 rounded-[2px] transition-all ${
              transitMode === 'baseline'
                ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40 font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            Baseline GTFS Bus
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle('routerx')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              transitMode === 'routerx'
                ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 font-semibold'
                : 'text-[#A6ADB8] hover:text-white'
            }`}
          >
            RouteRx Bi-Directional
          </button>
        </div>
      </div>

      {/* Main Interactive Map & Routing Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center mb-6">
        
        {/* LEFT: Stylized Spatial Map of Topeka, KS (7 cols) */}
        <div className="xl:col-span-7 relative w-full aspect-[16/11] rounded-[2px] bg-[#070B12] border border-[#F3EFE7]/10 p-4 overflow-hidden">
          
          <svg viewBox="0 0 360 260" className="w-full h-full" fill="none">
            {/* Base Geographic Mesh (Shawnee County Bounding Box) */}
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
              <rect x="20" y="20" width="320" height="220" rx="12" />
              <line x1="20" y1="130" x2="340" y2="130" strokeDasharray="3 3" />
              <line x1="180" y1="20" x2="180" y2="240" strokeDasharray="3 3" />
            </g>

            {/* Kansas River Vector Ribbon */}
            <path
              d="M 20 90 Q 100 120 180 85 T 340 100"
              stroke="#0284C7"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.35"
            />
            <text x="35" y="85" fill="#0284C7" fontSize="8" fontFamily="JetBrains Mono">Kansas River</text>

            {/* 43 Transit-Desert Census Tract Polygons */}
            <polygon
              points="60,40 120,45 130,100 50,95"
              fill={transitMode === 'baseline' ? 'rgba(248, 113, 113, 0.25)' : 'rgba(52, 211, 153, 0.15)'}
              stroke={transitMode === 'baseline' ? '#F87171' : '#34D399'}
              strokeWidth="1.2"
              className="cursor-pointer"
              onClick={() => setSelectedZone('zone-north')}
            />
            <polygon
              points="140,110 230,105 240,190 135,175"
              fill={transitMode === 'baseline' ? 'rgba(248, 113, 113, 0.35)' : 'rgba(52, 211, 153, 0.25)'}
              stroke={transitMode === 'baseline' ? '#F87171' : '#34D399'}
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => setSelectedZone('zone-central')}
            />
            <polygon
              points="65,145 125,140 130,225 55,215"
              fill={transitMode === 'baseline' ? 'rgba(248, 113, 113, 0.25)' : 'rgba(52, 211, 153, 0.15)'}
              stroke={transitMode === 'baseline' ? '#F87171' : '#34D399'}
              strokeWidth="1.2"
              className="cursor-pointer"
              onClick={() => setSelectedZone('zone-south')}
            />

            {/* Stormont Vail Health Central Hospital Landmark */}
            <g transform="translate(180, 140)">
              <circle r="10" fill="#E0E0E0" stroke="#7DD3FC" strokeWidth="2" />
              <rect x="-4" y="-1.5" width="8" height="3" fill="#050505" />
              <rect x="-1.5" y="-4" width="3" height="8" fill="#050505" />
              <text x="14" y="4" fill="#FFFFFF" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                Stormont Vail Health
              </text>
            </g>

            {/* Dynamic Shuttle Light Trails (Visible in RouteRx mode) */}
            {transitMode === 'routerx' ? (
              <g stroke="#34D399" strokeWidth="2" strokeDasharray="4 3" className="animate-pulse">
                {/* Route North */}
                <path d="M 180 140 L 100 70" />
                {/* Route Central */}
                <path d="M 180 140 L 195 155" />
                {/* Route South */}
                <path d="M 180 140 L 95 180" />
                {/* Moving Shuttle marker */}
                <circle cx="140" cy="105" r="3.5" fill="#34D399" />
                <circle cx="138" cy="160" r="3.5" fill="#34D399" />
              </g>
            ) : (
              /* Disconnected GTFS bus route: misses isolated blocks */
              <g stroke="#F87171" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6">
                <line x1="20" y1="200" x2="340" y2="200" />
                <text x="25" y="195" fill="#F87171" fontSize="8" fontFamily="JetBrains Mono">
                  Single Peripheral Bus Line (&gt;800m walk)
                </text>
              </g>
            )}
          </svg>

          {/* Map Status Badge */}
          <div className="absolute top-3 left-3 text-[10px] font-mono bg-[#070B12]/85 p-2 rounded-[2px] border border-[#F3EFE7]/10 flex flex-col gap-0.5">
            <span className="text-[#F3EFE7] font-semibold">Topeka, KS Geographic Canvas</span>
            <span>Shawnee County Census Blocks: 141</span>
            <span className={transitMode === 'routerx' ? 'text-[#34D399]' : 'text-[#F87171]'}>
              {transitMode === 'routerx' ? 'Bi-Directional Fleet: Active' : 'Transit Deserts: 43 Isolated Blocks'}
            </span>
          </div>
        </div>

        {/* RIGHT: Zone Metrics & Optimization Breakdown (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Zone Selector */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#A6ADB8]">
              Inspect Vulnerability Zone
            </p>
            <div className="grid grid-cols-1 gap-2">
              {zoneData.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-3 rounded-[2px] text-left border transition-all ${
                    zone.id === selectedZone
                      ? 'bg-white/10 border-[#F3EFE7] text-[#F3EFE7]'
                      : 'bg-white/[0.02] border-white/5 text-[#A7B2C3] hover:border-white/15 hover:text-[#F3EFE7]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold">{zone.name}</span>
                    <span className="text-[10px] font-mono text-[#FF6B35]">{zone.status}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#A7B2C3]">
                    {zone.blocks} Census Blocks · {zone.unservedRatio} unserved by bus
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Metric Comparison Card */}
          <div className="p-4 rounded-[2px] bg-[#070B12] border border-[#F3EFE7]/10 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3EFE7]/10">
              <span className="text-[#A7B2C3]">Average Patient Transit Wait:</span>
              <span className={transitMode === 'routerx' ? 'text-[#4CC38A] font-bold text-sm' : 'text-[#F87171] font-bold text-sm'}>
                {transitMode === 'routerx' ? currentZone.optimizedWait : currentZone.baselineWait}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#A7B2C3]">Fleet Budget Utilization:</span>
              <span className="text-[#82B7FF] font-bold">~40% Cost Reduction</span>
            </div>

            <div className="pt-2 border-t border-[#F3EFE7]/10 flex items-center justify-between text-[11px]">
              <span className="text-[#A7B2C3]">Inpatient Bed Turnaround:</span>
              <span className="text-[#F3EFE7] font-semibold">Immediate Discharge Route</span>
            </div>
          </div>

        </div>

      </div>

      {/* Accessible Zone Facts HTML Table */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A6ADB8]/70 mb-3">
          Census Tract Accessibility Ledger (ASA DataFest 2026 Evaluation)
        </p>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#A6ADB8]">
                <th className="pb-2">Zone Name</th>
                <th className="pb-2">Census Blocks</th>
                <th className="pb-2">Transit Desert Ratio</th>
                <th className="pb-2">Baseline Bus Wait</th>
                <th className="pb-2 text-[#34D399]">RouteRx ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#E0E0E0]">
              {zoneData.map((row) => (
                <tr key={row.id}>
                  <td className="py-2 font-sans font-medium text-white">{row.name}</td>
                  <td className="py-2">{row.blocks} blocks</td>
                  <td className="py-2 text-[#F87171]">{row.unservedRatio}</td>
                  <td className="py-2">{row.baselineWait}</td>
                  <td className="py-2 text-[#34D399] font-bold">{row.optimizedWait}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RouteRxDemo;
