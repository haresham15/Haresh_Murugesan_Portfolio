import React, { useState } from 'react';

export type RouteRxTab = 'isochrones' | 'deserts' | 'matrix';

interface ClinicHub {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'hospital' | 'community';
  catchment5m: string;
  catchment15m: string;
  catchment30m: string;
}

const CLINIC_HUBS: ClinicHub[] = [
  {
    id: 'stormont',
    name: 'Stormont Vail Regional Hospital',
    x: 270,
    y: 135,
    type: 'hospital',
    catchment5m: '8,420',
    catchment15m: '42,600',
    catchment30m: '118,500',
  },
  {
    id: 'va',
    name: 'Colmery-O’Neil VA Medical Center',
    x: 150,
    y: 95,
    type: 'hospital',
    catchment5m: '4,180',
    catchment15m: '28,400',
    catchment30m: '86,200',
  },
  {
    id: 'shawnee-east',
    name: 'East Topeka Health Clinic',
    x: 420,
    y: 175,
    type: 'community',
    catchment5m: '6,890',
    catchment15m: '31,500',
    catchment30m: '74,100',
  },
];

export const PlateRouteRx: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RouteRxTab>('isochrones');
  const [selectedHub, setSelectedHub] = useState<string>('stormont');
  const [desertFilter, setDesertFilter] = useState<'all' | 'acute' | 'shuttle'>('all');
  const [matrixRunning, setMatrixRunning] = useState<boolean>(false);
  const [matrixStep, setMatrixStep] = useState<number>(141);

  const currentHub = CLINIC_HUBS.find((h) => h.id === selectedHub) || CLINIC_HUBS[0];

  const handleRunMatrixBenchmark = () => {
    setMatrixRunning(true);
    setMatrixStep(0);
    const interval = setInterval(() => {
      setMatrixStep((prev) => {
        if (prev >= 141) {
          clearInterval(interval);
          setMatrixRunning(false);
          return 141;
        }
        return prev + 18;
      });
    }, 45);
  };

  return (
    <div className="w-full flex flex-col justify-between select-none">
      {/* ROW 1: HTML Controls (clean underline mode tabs, toggles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2563EB]/20 text-xs font-mono">
        {/* Left: Mode Underline Tabs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(
            [
              { id: 'isochrones', label: 'Catchment Isochrones' },
              { id: 'deserts', label: 'Transit Deserts' },
              { id: 'matrix', label: 'OSRM Routing Matrix' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`min-h-[36px] flex items-center pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider ${
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
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'isochrones' && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#7E8B9B] mr-1">Hub:</span>
              {CLINIC_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setSelectedHub(hub.id)}
                  className={`min-h-[32px] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer flex items-center ${
                    hub.id === selectedHub
                      ? 'bg-[#FF2800] text-[#F4F6F9] font-bold'
                      : 'bg-[#0B1E40]/60 text-[#7E8B9B] hover:text-[#F4F6F9]'
                  }`}
                >
                  {hub.name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'deserts' && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#7E8B9B] mr-1">Layer:</span>
              <button
                type="button"
                onClick={() => setDesertFilter('all')}
                className={`min-h-[32px] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer flex items-center ${
                  desertFilter === 'all'
                    ? 'bg-[#2563EB] text-[#F4F6F9] font-bold'
                    : 'bg-[#0B1E40]/60 text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                141 Tracts
              </button>
              <button
                type="button"
                onClick={() => setDesertFilter('acute')}
                className={`min-h-[32px] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer flex items-center ${
                  desertFilter === 'acute'
                    ? 'bg-[#FF2800] text-[#F4F6F9] font-bold'
                    : 'bg-[#0B1E40]/60 text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                Acute Deserts (SVI&gt;0.75)
              </button>
              <button
                type="button"
                onClick={() => setDesertFilter('shuttle')}
                className={`min-h-[32px] px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer flex items-center ${
                  desertFilter === 'shuttle'
                    ? 'bg-[#4CC38A] text-[#03050A] font-bold'
                    : 'bg-[#0B1E40]/60 text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                Shuttles (-32%)
              </button>
            </div>
          )}

          {activeTab === 'matrix' && (
            <button
              type="button"
              onClick={handleRunMatrixBenchmark}
              disabled={matrixRunning}
              className="min-h-[36px] px-3 py-1.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-semibold rounded-[2px] transition-colors cursor-pointer text-[11px] disabled:opacity-50 flex items-center"
            >
              {matrixRunning ? 'Calculating Matrix...' : '▶ Recalculate Matrix (<15ms)'}
            </button>
          )}
        </div>
      </div>

      {/* ROW 2: Flexible canvas/drawing container (min-height: 0, height ~460px on desktop) */}
      <div className="relative w-full min-h-0 h-[280px] sm:h-[360px] lg:h-[460px] flex items-center justify-center my-3 overflow-hidden bg-[#03050A]/80 border border-[#2563EB]/15">
        {/* TAB 1: Spatial Catchment Isochrones Map SVG */}
        {activeTab === 'isochrones' && (
          <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 580 300" className="w-full h-full max-h-[420px] overflow-visible">
              <defs>
                <pattern id="streetGridRx" width="24" height="24" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="24" y2="0" stroke="rgba(37, 99, 235, 0.06)" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="0" y2="24" stroke="rgba(37, 99, 235, 0.06)" strokeWidth="0.5" />
                </pattern>
              </defs>

              <rect width="580" height="300" fill="url(#streetGridRx)" />

              {/* Kansas River Waterway Ribbon */}
              <path
                d="M 20 60 Q 140 80 250 55 T 440 65 T 560 50"
                stroke="#0B1E40"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />

              {/* Major Highway Arterials (US-75 & I-70) */}
              <path d="M 40 135 L 540 135" stroke="rgba(200, 210, 224, 0.15)" strokeWidth="1.5" />
              <path d="M 270 20 L 270 280" stroke="rgba(200, 210, 224, 0.15)" strokeWidth="1.5" />
              <path d="M 120 40 L 480 260" stroke="rgba(37, 99, 235, 0.18)" strokeWidth="1.2" strokeDasharray="4 4" />

              {/* 30-Minute Catchment Polygon (Machined Silver) */}
              <path
                d={`M ${currentHub.x} ${currentHub.y - 95} C ${currentHub.x + 110} ${currentHub.y - 85}, ${currentHub.x + 145} ${currentHub.y + 55}, ${currentHub.x + 55} ${currentHub.y + 105} C ${currentHub.x - 75} ${currentHub.y + 110}, ${currentHub.x - 135} ${currentHub.y + 35}, ${currentHub.x - 105} ${currentHub.y - 75} Z`}
                fill="rgba(200, 210, 224, 0.08)"
                stroke="#C8D2E0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* 15-Minute Catchment Polygon (Electric Cobalt) */}
              <path
                d={`M ${currentHub.x} ${currentHub.y - 65} C ${currentHub.x + 75} ${currentHub.y - 55}, ${currentHub.x + 95} ${currentHub.y + 35}, ${currentHub.x + 35} ${currentHub.y + 70} C ${currentHub.x - 55} ${currentHub.y + 75}, ${currentHub.x - 90} ${currentHub.y + 20}, ${currentHub.x - 70} ${currentHub.y - 55} Z`}
                fill="rgba(37, 99, 235, 0.16)"
                stroke="#2563EB"
                strokeWidth="1.8"
              />

              {/* 5-Minute Catchment Polygon (Pulsing Reddish-Orange) */}
              <path
                d={`M ${currentHub.x} ${currentHub.y - 32} C ${currentHub.x + 40} ${currentHub.y - 25}, ${currentHub.x + 52} ${currentHub.y + 18}, ${currentHub.x + 18} ${currentHub.y + 35} C ${currentHub.x - 30} ${currentHub.y + 38}, ${currentHub.x - 48} ${currentHub.y + 10}, ${currentHub.x - 35} ${currentHub.y - 25} Z`}
                fill="rgba(255, 40, 0, 0.28)"
                stroke="#FF2800"
                strokeWidth="2.2"
                className="animate-pulse"
              />

              {/* Animated Transit Routing Vectors Streaming In */}
              <path
                d={`M 80 200 Q ${currentHub.x - 60} 200 ${currentHub.x} ${currentHub.y}`}
                stroke="#FF2800"
                strokeWidth="1.8"
                strokeDasharray="6 4"
                fill="none"
              />
              <path
                d={`M 500 80 Q ${currentHub.x + 70} 80 ${currentHub.x} ${currentHub.y}`}
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
                    role="button"
                    tabIndex={0}
                    aria-label={hub.name}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedHub(hub.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedHub(hub.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle cx={hub.x} cy={hub.y} r="14" fill="none" stroke="#FF2800" strokeWidth="1" className="animate-ping" />
                    )}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? 9 : 6}
                      fill={isSelected ? '#FF2800' : '#0B1E40'}
                      stroke={isSelected ? '#F4F6F9' : '#2563EB'}
                      strokeWidth={isSelected ? '2' : '1.5'}
                    />
                    <text
                      x={hub.x}
                      y={hub.y + 20}
                      fill={isSelected ? '#F4F6F9' : '#7E8B9B'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {hub.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Isochrone Legend */}
              <g transform="translate(20, 240)">
                <rect width="180" height="48" fill="#03050A" stroke="rgba(37, 99, 235, 0.25)" strokeWidth="1" />
                <circle cx="16" cy="16" r="4" fill="#FF2800" />
                <text x="28" y="19" fill="#F4F6F9" fontSize="9" fontFamily="monospace">5-Min Isochrone (Walk/Transit)</text>
                <circle cx="16" cy="32" r="4" fill="#2563EB" />
                <text x="28" y="35" fill="#C8D2E0" fontSize="9" fontFamily="monospace">15-Min &amp; 30-Min Catchment</text>
              </g>
            </svg>
          </div>
        )}

        {/* TAB 2: Transit Deserts (Census Tract Choropleth & Micro-Transit Shuttles) */}
        {activeTab === 'deserts' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 580 300" className="w-full h-full max-h-[420px] overflow-visible">
              <text x="20" y="30" fill="#F4F6F9" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                SHAWNEE COUNTY TRANSIT DESERT CHOROPLETH (141 CENSUS TRACTS)
              </text>
              <text x="20" y="46" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                Synthesizing CDC Social Vulnerability Index (SVI) with Topeka Metro Timetables
              </text>

              {/* 141 Census Blocks Lattice Representation */}
              <g transform="translate(40, 60)">
                {Array.from({ length: 48 }).map((_, i) => {
                  const col = i % 8;
                  const row = Math.floor(i / 8);
                  const isAcute = [5, 12, 13, 20, 21, 28, 29, 36].includes(i);
                  const isModerate = [4, 11, 19, 27, 35, 43, 44].includes(i);

                  let fillColor = '#0B1E40';
                  let strokeColor = 'rgba(37, 99, 235, 0.2)';
                  if (isAcute) {
                    fillColor = desertFilter === 'shuttle' ? '#153875' : '#FF2800';
                    strokeColor = '#FF4419';
                  } else if (isModerate) {
                    fillColor = '#153875';
                    strokeColor = '#2563EB';
                  }

                  return (
                    <rect
                      key={i}
                      x={col * 62}
                      y={row * 32}
                      width="58"
                      height="28"
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="1"
                      opacity={desertFilter === 'acute' && !isAcute ? 0.2 : 0.85}
                    />
                  );
                })}

                {/* Proposed Micro-Transit Shuttle Routing Lines */}
                {(desertFilter === 'all' || desertFilter === 'shuttle') && (
                  <path
                    d="M 320 40 C 370 100, 390 120, 440 80 C 470 50, 480 140, 380 150"
                    fill="none"
                    stroke="#4CC38A"
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                    className="animate-pulse"
                  />
                )}
              </g>

              {/* Desert Metrics Summary Banner */}
              <g transform="translate(40, 245)">
                <rect width="500" height="42" fill="#03050A" stroke="#FF2800" strokeWidth="1" />
                <text x="15" y="18" fill="#FF2800" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  28 ACUTE CENSUS TRACTS IDENTIFIED
                </text>
                <text x="15" y="33" fill="#C8D2E0" fontSize="10" fontFamily="sans-serif">
                  14,200 vulnerable residents (&gt;45min transit). Micro-transit routes reduce travel time by 32.4%.
                </text>
                <text x="485" y="26" fill="#4CC38A" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="end">
                  1ST PLACE DATASET
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* TAB 3: OSRM Routing Matrix Graph SVG */}
        {activeTab === 'matrix' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
            <svg viewBox="0 0 580 300" className="w-full h-full max-h-[420px] overflow-visible">
              <text x="20" y="30" fill="#F4F6F9" fontSize="13" fontFamily="sans-serif" fontWeight="bold">
                OSRM DISTANCE &amp; DURATION MATRIX (<span className="text-[#4CC38A]">&lt; 15ms</span>)
              </text>
              <text x="20" y="46" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                Contraction Hierarchies Graph across 141 Census Centroids &amp; 3 Hospital Hubs
              </text>

              {/* Visualized Routing Graph Network */}
              <g transform="translate(30, 65)">
                {/* Network Edges */}
                <path d="M 50 40 L 160 80 L 260 50 L 370 90 L 480 40" stroke="rgba(37, 99, 235, 0.4)" strokeWidth="1.5" />
                <path d="M 50 140 L 160 80 L 260 150 L 370 90 L 480 140" stroke="rgba(37, 99, 235, 0.4)" strokeWidth="1.5" />
                <path d="M 160 80 L 260 80 L 370 90" stroke="#FF2800" strokeWidth="2" strokeDasharray="4 2" />

                {/* Network Nodes */}
                {[
                  { x: 50, y: 40, label: 'Tract 12' },
                  { x: 160, y: 80, label: 'Stormont Hub' },
                  { x: 260, y: 50, label: 'Tract 44' },
                  { x: 370, y: 90, label: 'East Clinic' },
                  { x: 480, y: 40, label: 'Tract 89' },
                  { x: 50, y: 140, label: 'VA Center' },
                  { x: 260, y: 150, label: 'Tract 105' },
                  { x: 480, y: 140, label: 'Tract 141' },
                ].map((node, i) => (
                  <g key={i}>
                    <circle cx={node.x} cy={node.y} r="7" fill={i === 1 || i === 3 || i === 5 ? '#FF2800' : '#2563EB'} />
                    <text x={node.x} y={node.y - 12} fill="#F4F6F9" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      {node.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Progress & Latency Readout Banner */}
              <g transform="translate(30, 240)">
                <rect width="520" height="42" fill="#03050A" stroke="#2563EB" strokeWidth="1" />
                <text x="15" y="18" fill="#F4F6F9" fontSize="10" fontFamily="monospace">
                  CALCULATED MATRIX CELLS: <span className="text-[#FF2800] font-bold">{matrixStep} / 141 Pairs</span>
                </text>
                <text x="15" y="32" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                  Algorithm: Contraction Hierarchies (Dijkstra) | Network: OpenStreetMap Road Graph
                </text>
                <text x="505" y="25" fill="#4CC38A" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="end">
                  14.2ms Verified
                </text>
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* ROW 3: HTML Telemetry footer (outside drawing canvas; never overlaying or clipping artwork) */}
      <div className="pt-3 border-t border-[#2563EB]/20 w-full min-w-0 text-xs font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#7E8B9B]">
          <div>
            <span className="text-[10px] block uppercase tracking-wider">Active Clinic Hub</span>
            <span className="text-sm font-bold text-[#FF2800] truncate block">{currentHub.name.split(' ')[0]} Hub</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">5-Min Catchment</span>
            <span className="text-sm font-bold text-[#F4F6F9]">{currentHub.catchment5m} Residents</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">OSRM Query Matrix</span>
            <span className="text-sm font-bold text-[#4CC38A]">&lt; 15 ms Latency</span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">Award / Honor</span>
            <span className="text-sm font-bold text-[#2563EB]">1st Place ASA DataFest</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateRouteRx;
