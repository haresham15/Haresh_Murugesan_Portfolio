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
  { id: 'stormont', name: 'Stormont Vail Regional Hospital', x: 260, y: 135, type: 'hospital' },
  { id: 'va', name: 'Colmery-O’Neil VA Medical Center', x: 140, y: 85, type: 'hospital' },
  { id: 'shawnee-east', name: 'East Topeka Health Clinic', x: 400, y: 165, type: 'community' },
];

export const PlateRouteRx: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RouteRxTab>('isochrones');
  const [selectedHub, setSelectedHub] = useState<string>('stormont');

  const currentHub = CLINIC_HUBS.find((h) => h.id === selectedHub) || CLINIC_HUBS[0];

  return (
    <div className="w-full h-full min-h-[460px] flex flex-col justify-between select-none">
      {/* Clean Underline Mode Tabs Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-[#2563EB]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
          <span className="text-[#C8D2E0] font-semibold tracking-wider">
            SHAWNEE COUNTY SPATIAL ISOCHRONE MAP
          </span>
        </div>

        {/* Clean Underline Tabs */}
        <div className="flex items-center gap-6 pt-2 sm:pt-0">
          {(
            [
              { id: 'isochrones', label: 'Catchment Isochrones' },
              { id: 'deserts', label: 'Transit Deserts' },
              { id: 'latency', label: 'OSRM Routing Matrix' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider ${
                activeTab === tab.id
                  ? 'text-[#F4F6F9] border-b-2 border-[#FF2800] font-semibold'
                  : 'text-[#7E8B9B] hover:text-[#C8D2E0] border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full min-h-[400px] flex items-center justify-center p-2">
        {/* TAB 1: Spatial Catchment Isochrones */}
        {activeTab === 'isochrones' && (
          <div className="relative w-full h-full min-h-[390px] flex flex-col justify-between">
            {/* SVG Interactive Map Stage */}
            <div className="relative w-full aspect-[16/9] max-h-[310px] my-auto">
              <svg viewBox="0 0 540 260" className="w-full h-full overflow-visible">
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="streetGridV4" width="24" height="24" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="24" y2="0" stroke="rgba(37, 99, 235, 0.06)" strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="0" y2="24" stroke="rgba(37, 99, 235, 0.06)" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="540" height="260" fill="url(#streetGridV4)" />

                {/* Kansas River Waterway Ribbon */}
                <path
                  d="M 20 50 Q 140 70 240 45 T 420 55 T 520 40"
                  stroke="#0B1E40"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Major Arterial Roads / Highway 75 & I-70 */}
                <path d="M 40 135 L 500 135" stroke="rgba(200, 210, 224, 0.15)" strokeWidth="1.5" />
                <path d="M 260 20 L 260 240" stroke="rgba(200, 210, 224, 0.15)" strokeWidth="1.5" />
                <path d="M 120 40 L 460 220" stroke="rgba(37, 99, 235, 0.15)" strokeWidth="1" strokeDasharray="3 3" />

                {/* Pulsing Isochrone Catchment Polygons (#FF2800, #2563EB, #C8D2E0) */}
                {/* 30-Minute Catchment (Machined Silver) */}
                <path
                  d={`M ${currentHub.x} ${currentHub.y - 85} C ${currentHub.x + 95} ${currentHub.y - 75}, ${currentHub.x + 130} ${currentHub.y + 45}, ${currentHub.x + 45} ${currentHub.y + 90} C ${currentHub.x - 65} ${currentHub.y + 95}, ${currentHub.x - 120} ${currentHub.y + 25}, ${currentHub.x - 90} ${currentHub.y - 65} Z`}
                  fill="rgba(200, 210, 224, 0.07)"
                  stroke="#C8D2E0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* 15-Minute Catchment (Electric Cobalt) */}
                <path
                  d={`M ${currentHub.x} ${currentHub.y - 55} C ${currentHub.x + 65} ${currentHub.y - 45}, ${currentHub.x + 85} ${currentHub.y + 30}, ${currentHub.x + 30} ${currentHub.y + 60} C ${currentHub.x - 45} ${currentHub.y + 65}, ${currentHub.x - 80} ${currentHub.y + 15}, ${currentHub.x - 60} ${currentHub.y - 45} Z`}
                  fill="rgba(37, 99, 235, 0.15)"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                />

                {/* 5-Minute Catchment (Pulsing Reddish-Orange) */}
                <path
                  d={`M ${currentHub.x} ${currentHub.y - 28} C ${currentHub.x + 35} ${currentHub.y - 22}, ${currentHub.x + 45} ${currentHub.y + 15}, ${currentHub.x + 15} ${currentHub.y + 30} C ${currentHub.x - 25} ${currentHub.y + 32}, ${currentHub.x - 42} ${currentHub.y + 8}, ${currentHub.x - 30} ${currentHub.y - 22} Z`}
                  fill="rgba(255, 40, 0, 0.25)"
                  stroke="#FF2800"
                  strokeWidth="2"
                  className="animate-pulse"
                />

                {/* Animated Transit Routing Vectors */}
                <path
                  d={`M 80 180 Q ${currentHub.x - 50} 180 ${currentHub.x} ${currentHub.y}`}
                  stroke="#FF2800"
                  strokeWidth="1.8"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <path
                  d={`M 460 70 Q ${currentHub.x + 60} 70 ${currentHub.x} ${currentHub.y}`}
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  strokeDasharray="6 4"
                  fill="none"
                />

                {/* Clinic Hub Nodes */}
                {CLINIC_HUBS.map((hub) => {
                  const isSelected = hub.id === selectedHub;
                  return (
                    <g
                      key={hub.id}
                      onClick={() => setSelectedHub(hub.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isSelected ? 8 : 5}
                        fill={isSelected ? '#FF2800' : '#0B1E40'}
                        stroke={isSelected ? '#F4F6F9' : '#2563EB'}
                        strokeWidth="1.5"
                      />
                      <text
                        x={hub.x}
                        y={hub.y + 18}
                        fill={isSelected ? '#F4F6F9' : '#7E8B9B'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {hub.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hub Selector Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2563EB]/20 text-xs font-mono">
              <span className="text-[#7E8B9B]">ACTIVE MEDICAL HUB:</span>
              <div className="flex items-center gap-4">
                {CLINIC_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedHub(hub.id)}
                    className={`cursor-pointer transition-colors ${
                      hub.id === selectedHub
                        ? 'text-[#FF2800] font-bold border-b border-[#FF2800]'
                        : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                    }`}
                  >
                    {hub.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Transit Deserts */}
        {activeTab === 'deserts' && (
          <div className="w-full h-full flex flex-col justify-between py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="pb-3 border-b border-[#FF2800]">
                <span className="text-[10px] text-[#7E8B9B]">ACUTE DESERT ZONES</span>
                <div className="text-lg font-serif text-[#F4F6F9] mt-1">28 Census Blocks</div>
                <span className="text-[#FF2800] text-[11px] font-bold">&gt; 45min Transit Time</span>
              </div>
              <div className="pb-3 border-b border-[#2563EB]">
                <span className="text-[10px] text-[#7E8B9B]">VULNERABLE POPULATION</span>
                <div className="text-lg font-serif text-[#F4F6F9] mt-1">14,200 Residents</div>
                <span className="text-[#2563EB] text-[11px] font-bold">CDC SVI &gt; 0.75</span>
              </div>
              <div className="pb-3 border-b border-[#C8D2E0]">
                <span className="text-[10px] text-[#7E8B9B]">OPTIMIZED BUS ROUTING</span>
                <div className="text-lg font-serif text-[#F4F6F9] mt-1">-32.4% Travel Delta</div>
                <span className="text-[#4CC38A] text-[11px] font-bold">1st Place ASA DataFest</span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Cross-referenced Topeka Metro transit schedules with census vulnerability scores to model micro-transit shuttle routes that close acute medical deserts without requiring additional municipal fleet purchases.
            </p>
          </div>
        )}

        {/* TAB 3: Routing Latency */}
        {activeTab === 'latency' && (
          <div className="w-full h-full flex flex-col justify-center space-y-6 text-xs font-mono py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="pb-3 border-b border-[#2563EB]/30">
                <span className="text-[10px] text-[#7E8B9B]">OSRM MATRIX LATENCY</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">&lt; 15ms Query</div>
                <span className="text-[#4CC38A] text-[11px]">141 Census Blocks</span>
              </div>
              <div className="pb-3 border-b border-[#2563EB]/30">
                <span className="text-[10px] text-[#7E8B9B]">NETWORK GRAPH</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">OSM Road Topologies</div>
                <span className="text-[#4CC38A] text-[11px]">Dijkstra Shortest Path</span>
              </div>
              <div className="pb-3 border-b border-[#FF2800]">
                <span className="text-[10px] text-[#FF2800]">ASA DATAFEST 2026</span>
                <div className="text-sm font-bold text-[#F4F6F9] mt-1">1st Place Winner</div>
                <span className="text-[#FF2800] text-[11px]">Best Use of External Data</span>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Vectorized spatial distance calculations run against high-throughput OpenStreetMap road network segments in Python and R, computing real-time multi-modal patient catchments.
            </p>
          </div>
        )}
      </div>

      {/* Clean Bottom Status Line */}
      <div className="pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]">
        <span>ENGINE: Python · OSRM · GeoPandas · Folium</span>
        <span className="text-[#4CC38A]">1st Place ASA DataFest 2026</span>
      </div>
    </div>
  );
};

export default PlateRouteRx;
