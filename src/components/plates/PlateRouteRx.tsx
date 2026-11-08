import React, { useState } from 'react';

export type RouteRxTab = 'isochrones' | 'deserts' | 'latency';

interface ClinicHub {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'hospital' | 'community';
}

const CLINIC_HUBS: ClinicHub[] = [
  { id: 'stormont', name: 'Stormont Vail Regional Hospital', x: 260, y: 140, type: 'hospital' },
  { id: 'va', name: 'Colmery-O’Neil VA Medical Center', x: 130, y: 90, type: 'hospital' },
  { id: 'shawnee-east', name: 'East Topeka Health Clinic', x: 390, y: 170, type: 'community' },
];

export const PlateRouteRx: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RouteRxTab>('isochrones');
  const [selectedHub, setSelectedHub] = useState<string>('stormont');
  const [activeCatchment, setActiveCatchment] = useState<'all' | '5min' | '15min' | '30min'>('all');

  const currentHub = CLINIC_HUBS.find((h) => h.id === selectedHub) || CLINIC_HUBS[0];

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col justify-between select-none">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#82B7FF]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-[#82B7FF] font-semibold tracking-wider">PLATE 03 · GEOSPATIAL ISOCHRONE MAP</span>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#101B30] p-1 rounded-[2px] border border-[#F3EFE7]/10">
          <button
            type="button"
            onClick={() => setActiveTab('isochrones')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'isochrones'
                ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            Catchment Isochrones
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deserts')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'deserts'
                ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            Transit Deserts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('latency')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'latency'
                ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            Routing Latency
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        {/* TAB 1: Geospatial Catchment Isochrones Map */}
        {activeTab === 'isochrones' && (
          <div className="w-full h-full flex flex-col justify-between space-y-3">
            {/* SVG Shawnee County Map Stage */}
            <div className="relative w-full aspect-[16/9] bg-[#070B12] border border-[#F3EFE7]/15 rounded-[2px] p-4 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 540 260" className="w-full h-full overflow-visible">
                <defs>
                  {/* Subtle Map Grid */}
                  <pattern id="streetGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(130, 183, 255, 0.05)" strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(130, 183, 255, 0.05)" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="540" height="260" fill="url(#streetGrid)" />

                {/* Kansas River Waterway Boundary */}
                <path
                  d="M 20 50 Q 140 70 240 45 T 420 55 T 520 40"
                  stroke="#1E3A5F"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />

                {/* 30-Minute Catchment Polygon (Outer Cyan #82B7FF) */}
                {(activeCatchment === 'all' || activeCatchment === '30min') && (
                  <polygon
                    points={`${currentHub.x - 170},${currentHub.y - 70} ${currentHub.x - 80},${currentHub.y - 110} ${currentHub.x + 90},${currentHub.y - 95} ${currentHub.x + 180},${currentHub.y - 30} ${currentHub.x + 160},${currentHub.y + 80} ${currentHub.x + 60},${currentHub.y + 110} ${currentHub.x - 110},${currentHub.y + 90} ${currentHub.x - 160},${currentHub.y + 20}`}
                    fill="#82B7FF"
                    fillOpacity="0.08"
                    stroke="#82B7FF"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                )}

                {/* 15-Minute Catchment Polygon (Mid Gold #F5D998) */}
                {(activeCatchment === 'all' || activeCatchment === '15min') && (
                  <polygon
                    points={`${currentHub.x - 105},${currentHub.y - 45} ${currentHub.x - 40},${currentHub.y - 70} ${currentHub.x + 65},${currentHub.y - 60} ${currentHub.x + 110},${currentHub.y - 15} ${currentHub.x + 95},${currentHub.y + 55} ${currentHub.x + 35},${currentHub.y + 70} ${currentHub.x - 65},${currentHub.y + 55} ${currentHub.x - 100},${currentHub.y + 10}`}
                    fill="#F5D998"
                    fillOpacity="0.12"
                    stroke="#F5D998"
                    strokeWidth="1.4"
                  />
                )}

                {/* 5-Minute Catchment Polygon (Core Orange #FF6B35) */}
                {(activeCatchment === 'all' || activeCatchment === '5min') && (
                  <polygon
                    points={`${currentHub.x - 50},${currentHub.y - 25} ${currentHub.x - 15},${currentHub.y - 38} ${currentHub.x + 35},${currentHub.y - 30} ${currentHub.x + 55},${currentHub.y - 5} ${currentHub.x + 45},${currentHub.y + 28} ${currentHub.x + 15},${currentHub.y + 35} ${currentHub.x - 30},${currentHub.y + 28} ${currentHub.x - 48},${currentHub.y + 5}`}
                    fill="#FF6B35"
                    fillOpacity="0.22"
                    stroke="#FF6B35"
                    strokeWidth="1.8"
                  />
                )}

                {/* Routing Vectors connecting patients to Hub */}
                {[
                  { px: currentHub.x - 120, py: currentHub.y - 55, label: 'Block 201' },
                  { px: currentHub.x + 140, py: currentHub.y + 60, label: 'Block 108' },
                  { px: currentHub.x - 70, py: currentHub.y + 80, label: 'Block 314' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <line
                      x1={currentHub.x}
                      y1={currentHub.y}
                      x2={pt.px}
                      y2={pt.py}
                      stroke="#FF6B35"
                      strokeWidth="1.2"
                      strokeDasharray="2 3"
                    />
                    <circle cx={pt.px} cy={pt.py} r="3" fill="#F5D998" />
                    <text
                      x={pt.px + 6}
                      y={pt.py - 4}
                      fill="#A7B2C3"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}

                {/* Hospital / Clinic Hubs */}
                {CLINIC_HUBS.map((hub) => {
                  const isSelected = selectedHub === hub.id;
                  return (
                    <g
                      key={hub.id}
                      transform={`translate(${hub.x}, ${hub.y})`}
                      className="cursor-pointer"
                      onClick={() => setSelectedHub(hub.id)}
                    >
                      {isSelected && (
                        <circle r="14" fill="none" stroke="#FF6B35" strokeWidth="1" className="animate-ping" />
                      )}
                      <circle
                        r="6"
                        fill={isSelected ? '#FF6B35' : '#101B30'}
                        stroke={isSelected ? '#FFFFFF' : '#82B7FF'}
                        strokeWidth="1.5"
                      />
                      <text
                        x="10"
                        y="4"
                        fill={isSelected ? '#F3EFE7' : '#A7B2C3'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {hub.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Isochrone Legend Pill */}
              <div className="absolute top-3 right-3 bg-[#070B12]/90 border border-[#F3EFE7]/15 p-2 rounded-[2px] text-[10px] font-mono flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveCatchment('5min')}
                  className="flex items-center gap-1.5 text-[#FF6B35] hover:underline"
                >
                  <span className="w-2.5 h-2.5 bg-[#FF6B35]/40 border border-[#FF6B35] rounded-full" />
                  <span>5-min</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCatchment('15min')}
                  className="flex items-center gap-1.5 text-[#F5D998] hover:underline"
                >
                  <span className="w-2.5 h-2.5 bg-[#F5D998]/40 border border-[#F5D998] rounded-full" />
                  <span>15-min</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCatchment('30min')}
                  className="flex items-center gap-1.5 text-[#82B7FF] hover:underline"
                >
                  <span className="w-2.5 h-2.5 bg-[#82B7FF]/40 border border-[#82B7FF] rounded-full" />
                  <span>30-min</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCatchment('all')}
                  className="text-[#A7B2C3] hover:text-white"
                >
                  [All]
                </button>
              </div>
            </div>

            {/* Bottom Hub Picker Strip */}
            <div className="flex items-center justify-between text-xs font-mono bg-[#101B30] p-2.5 rounded-[2px] border border-[#F3EFE7]/10">
              <span className="text-[#A7B2C3]">SELECTED CLINIC:</span>
              <span className="text-[#FF6B35] font-bold">{currentHub.name}</span>
              <span className="text-[#4CC38A]">OSRM: 11.4ms query</span>
            </div>
          </div>
        )}

        {/* TAB 2: Transit Deserts Breakdown */}
        {activeTab === 'deserts' && (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#101B30] border border-[#F87171]/40 rounded-[2px]">
                <div className="text-[10px] text-[#F87171]">TRANSIT ISOLATED</div>
                <div className="text-base font-bold text-[#F3EFE7] mt-1">North Topeka</div>
                <div className="text-[10px] text-[#A7B2C3] mt-0.5">Wait time: 58m → 18m</div>
              </div>
              <div className="p-3 bg-[#101B30] border border-[#F5D998]/40 rounded-[2px]">
                <div className="text-[10px] text-[#F5D998]">HIGH VULNERABILITY</div>
                <div className="text-base font-bold text-[#F3EFE7] mt-1">Central / East</div>
                <div className="text-[10px] text-[#A7B2C3] mt-0.5">Wait time: 45m → 12m</div>
              </div>
              <div className="p-3 bg-[#101B30] border border-[#82B7FF]/40 rounded-[2px]">
                <div className="text-[10px] text-[#82B7FF]">DISCHARGE CORRIDOR</div>
                <div className="text-base font-bold text-[#F3EFE7] mt-1">SW Residential</div>
                <div className="text-[10px] text-[#A7B2C3] mt-0.5">Wait time: 65m → 22m</div>
              </div>
            </div>

            <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/10 rounded-[2px] text-[#A7B2C3] leading-relaxed">
              Bi-directional multi-modal routing couples fixed Topeka Metro timetables with dynamic on-demand health shuttles, eliminating a 42.3% transit access gap across 141 census blocks.
            </div>
          </div>
        )}

        {/* TAB 3: Routing Latency Readout */}
        {activeTab === 'latency' && (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#101B30] border border-[#4CC38A]/30 rounded-[2px]">
                <span className="text-[#A7B2C3] text-[10px]">OSRM MATRIX LATENCY</span>
                <div className="text-2xl font-bold text-[#4CC38A] mt-1">11.4 ms</div>
                <div className="text-[10px] text-[#7A889B] mt-1">141x141 distance table compute</div>
              </div>
              <div className="p-4 bg-[#101B30] border border-[#FF6B35]/30 rounded-[2px]">
                <span className="text-[#A7B2C3] text-[10px]">ASA DATAFEST AWARD</span>
                <div className="text-2xl font-bold text-[#FF6B35] mt-1">1st Place</div>
                <div className="text-[10px] text-[#7A889B] mt-1">Best Use of External Data (2026)</div>
              </div>
            </div>

            <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/10 rounded-[2px] text-[#A7B2C3] leading-relaxed">
              Synthesized OpenStreetMap graph networks, CDC Social Vulnerability Indexes, and municipal transit GTFS schedules into sub-15ms client isochrones.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="pt-3 border-t border-[#82B7FF]/20 flex items-center justify-between text-[11px] font-mono text-[#7A889B]">
        <span>REGION: Shawnee County, KS (141 Census Blocks)</span>
        <span className="text-[#4CC38A]">11.4ms OSRM Latency</span>
      </div>
    </div>
  );
};

export default PlateRouteRx;
