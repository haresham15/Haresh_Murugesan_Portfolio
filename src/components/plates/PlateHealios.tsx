import React, { useState, useRef } from 'react';
import { useCanvasStage } from '../../hooks/useCanvasStage';
import { useMotionPreference } from '../MotionPreference';

export type HealiosTab = 'elevation' | 'saliency' | 'topology';

export const PlateHealios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HealiosTab>('elevation');
  const [sliceX, setSliceX] = useState<number>(50);
  const [lensPos, setLensPos] = useState<number>(50);
  const [activeStage, setActiveStage] = useState<number>(4); // 1: Edge, 2: Morphology, 3: CNN, 4: Grad-CAM
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();

  // Calculate slice depth metric from sliceX
  const normDist = Math.abs((sliceX - 50) / 40);
  const calculatedSliceDepth = normDist <= 1.0 ? Math.pow(Math.max(0, 1 - normDist), 1.8) * -34 : 0;
  const sliceDzMm = (calculatedSliceDepth * 0.08).toFixed(2);

  // 3D Isometric LiDAR Point Cloud & 12 Elevation Rings Canvas Loop
  useCanvasStage(
    stageRef,
    canvasRef,
    (ctx, { width, height, time }) => {
      const ringCount = 12;
      const angle = isReduced ? 0 : time * 0.00042;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 10;
      const rx = Math.min(width * 0.38, 220);
      const ry = rx * 0.52; // 3D Isometric foreshortening

      // 1. Draw 12 Concentric Elevation Contour Rings
      for (let r = 1; r <= ringCount; r++) {
        const ringT = r / ringCount; // 0 (center crater) to 1 (outer wound margin)
        const currentRx = rx * ringT;
        const currentRy = ry * ringT;
        // Depth depression: center is -34px deep, rim is 0px
        const elevationZ = Math.pow(1 - ringT, 1.8) * -34;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + elevationZ, currentRx, currentRy, 0, 0, Math.PI * 2);

        // Color coding by elevation depth: Red-orange for deep crater, Silver for margin, Cobalt for outer rim
        ctx.strokeStyle = ringT < 0.35 ? '#FF2800' : ringT < 0.7 ? '#C8D2E0' : '#2563EB';
        ctx.lineWidth = r % 3 === 0 ? 1.5 : 0.8;
        ctx.globalAlpha = 0.25 + ringT * 0.55;
        if (r % 2 === 0) ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw 3D Rotating LiDAR Point Cloud Vertices (96 points)
      const pointCount = 96;
      for (let i = 0; i < pointCount; i++) {
        const ptRing = (i % ringCount) / ringCount;
        const ptAngle = (i / pointCount) * Math.PI * 4 + angle;
        const rad = rx * Math.pow(ptRing, 0.75);

        const x3d = rad * Math.cos(ptAngle);
        const y3d = rad * Math.sin(ptAngle);
        const z3d = Math.pow(1 - ptRing, 1.8) * -36 + Math.sin(ptAngle * 3 + angle * 2) * 3;

        const projX = cx + x3d;
        const projY = cy + y3d * 0.52 + z3d;

        const isDeep = ptRing < 0.38;
        ctx.fillStyle = isDeep ? '#FF2800' : ptRing < 0.75 ? '#C8D2E0' : '#2563EB';
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(projX, projY, isDeep ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Interactive Slicer Cross-Section Line & Real-Time Depth Profile
      const currentSliceX = Math.max(cx - rx, Math.min(cx + rx, (width * sliceX) / 100));
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(currentSliceX, 24);
      ctx.lineTo(currentSliceX, height - 24);
      ctx.stroke();

      // Intersection node on active slice
      const normD = Math.abs((currentSliceX - cx) / rx);
      if (normD <= 1.0) {
        const sliceDepth = Math.pow(Math.max(0, 1 - normD), 1.8) * -34;
        ctx.fillStyle = '#FF2800';
        ctx.beginPath();
        ctx.arc(currentSliceX, cy + sliceDepth, 4, 0, Math.PI * 2);
        ctx.fill();

        // Elevation readout
        ctx.font = '11px "Geist Mono", monospace';
        ctx.fillStyle = '#F4F6F9';
        ctx.fillText(`Δz: ${(sliceDepth * 0.08).toFixed(2)}mm`, currentSliceX + 8, cy + sliceDepth - 8);
      }
      ctx.restore();
    },
    { enabled: activeTab === 'elevation', animate: !isReduced }
  );

  return (
    <div className="w-full flex flex-col justify-between select-none">
      {/* ROW 1: HTML Controls (clean underline mode tabs, toggles) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2563EB]/20 text-xs font-mono">
        {/* Left: Mode Underline Tabs */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {(
            [
              { id: 'elevation', label: '3D Elevation' },
              { id: 'saliency', label: 'Grad-CAM Saliency' },
              { id: 'topology', label: 'Pipeline Topology' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`pb-1 transition-colors cursor-pointer text-xs font-mono tracking-wider min-h-[36px] flex items-center ${
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
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {activeTab === 'elevation' && (
            <label className="flex items-center gap-2 text-[#7E8B9B]">
              <span>Slice:</span>
              <span className="text-[#F4F6F9] font-bold w-9">{sliceX}%</span>
              <input
                type="range"
                min="10"
                max="90"
                value={sliceX}
                onChange={(e) => setSliceX(Number(e.target.value))}
                aria-label="Elevation Cross-Section Slicer"
                className="w-24 sm:w-32 accent-[#FF2800] cursor-ew-resize"
              />
            </label>
          )}

          {activeTab === 'saliency' && (
            <div className="flex items-center gap-2 text-[#7E8B9B]">
              <span>Lens:</span>
              <button
                type="button"
                onClick={() => setLensPos(0)}
                className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                  lensPos === 0 ? 'bg-[#FF2800] text-[#F4F6F9]' : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                }`}
              >
                100% Saliency
              </button>
              <button
                type="button"
                onClick={() => setLensPos(50)}
                className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                  lensPos === 50 ? 'bg-[#2563EB] text-[#F4F6F9]' : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                }`}
              >
                50/50 Split
              </button>
              <button
                type="button"
                onClick={() => setLensPos(100)}
                className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                  lensPos === 100 ? 'bg-[#C8D2E0] text-[#03050A]' : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                }`}
              >
                100% RGB
              </button>
            </div>
          )}

          {activeTab === 'topology' && (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[#7E8B9B] mr-1">Stage:</span>
              {[
                { num: 1, name: 'Laplacian' },
                { num: 2, name: 'HSV' },
                { num: 3, name: 'CNN' },
                { num: 4, name: 'Grad-CAM' },
              ].map((s) => (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setActiveStage(s.num)}
                  className={`px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer ${
                    activeStage === s.num
                      ? 'bg-[#FF2800] text-[#F4F6F9] font-bold'
                      : 'bg-[#0B1E40]/60 text-[#7E8B9B] hover:text-[#F4F6F9]'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Flexible canvas/drawing container (min-height: 0, height ~460px on desktop, ~280px on mobile) */}
      <div className="relative w-full min-h-0 h-[280px] sm:h-[360px] lg:h-[460px] flex items-center justify-center my-3 overflow-hidden bg-[#03050A]/80 border border-[#2563EB]/15">
        {/* TAB 1: 3D Isometric Elevation & LiDAR Point Cloud Canvas */}
        {activeTab === 'elevation' && (
          <div ref={stageRef} className="relative w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full block"
              aria-label="LiDAR elevation mesh"
              role="img"
            />
            {/* Elevation Depth Scale Legend */}
            <div className="absolute top-4 left-4 p-2 bg-[#03050A]/85 border border-[#2563EB]/20 text-[10px] font-mono space-y-1 pointer-events-none">
              <div className="text-[#7E8B9B] uppercase tracking-wider font-semibold">Elevation Scale</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2 bg-[#FF2800] inline-block" />
                <span className="text-[#C8D2E0]">-2.72mm (Ulcer Crater)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2 bg-[#C8D2E0] inline-block" />
                <span className="text-[#C8D2E0]">-1.20mm (Epithelial Margin)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2 bg-[#2563EB] inline-block" />
                <span className="text-[#C8D2E0]">0.00mm (Healthy Periwound)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Vectorized Grad-CAM Saliency Comparison Lens */}
        {activeTab === 'saliency' && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-[560px] aspect-[4/3] max-h-[420px] overflow-hidden select-none border border-[#2563EB]/30 bg-[#060A12]">
              {/* Left Underlay: Clinical Surface RGB */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <rect width="400" height="300" fill="#0B1220" />
                  {/* Subtle skin texture and tissue bed */}
                  <ellipse cx="200" cy="150" rx="130" ry="100" fill="#201111" />
                  <ellipse cx="200" cy="150" rx="100" ry="75" fill="#301616" stroke="#4A1E1E" strokeWidth="2" />
                  {/* Granulation tissue centers */}
                  <circle cx="185" cy="140" r="25" fill="#421A1A" opacity="0.8" />
                  <circle cx="215" cy="160" r="20" fill="#3A1717" opacity="0.8" />
                  {/* Margin wound incision path */}
                  <path
                    d="M 130 110 Q 180 160 220 185 T 270 190"
                    stroke="#FF4419"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />
                  <path
                    d="M 130 110 Q 180 160 220 185 T 270 190"
                    stroke="#FF2800"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* RGB Lens Annotation */}
                  <text x="20" y="30" fill="#7E8B9B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    CLINICAL RGB (PERIWOUND)
                  </text>
                </svg>
              </div>

              {/* Right Overlay: Vectorized Grad-CAM Saliency Reveal (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${lensPos}%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <defs>
                      <radialGradient id="healiosHeatPrimary" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF2800" stopOpacity="0.95" />
                        <stop offset="30%" stopColor="#FF4419" stopOpacity="0.80" />
                        <stop offset="55%" stopColor="#2563EB" stopOpacity="0.60" />
                        <stop offset="80%" stopColor="#153875" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="#0B1220" stopOpacity="0.0" />
                      </radialGradient>
                      <radialGradient id="healiosHeatSecondary" cx="42%" cy="45%" r="35%">
                        <stop offset="0%" stopColor="#FF2800" stopOpacity="0.90" />
                        <stop offset="40%" stopColor="#FF4419" stopOpacity="0.65" />
                        <stop offset="85%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0.0" />
                      </radialGradient>
                    </defs>
                    <rect width="400" height="300" fill="#060A12" />
                    {/* Primary Saliency Hotspot */}
                    <ellipse cx="200" cy="150" rx="125" ry="95" fill="url(#healiosHeatPrimary)" />
                    <circle cx="185" cy="140" r="45" fill="url(#healiosHeatSecondary)" />

                    {/* Saliency Isocontours */}
                    <ellipse cx="200" cy="150" rx="100" ry="75" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <ellipse cx="195" cy="145" rx="60" ry="45" fill="none" stroke="#FF4419" strokeWidth="1.2" opacity="0.8" />
                    <circle cx="188" cy="140" r="22" fill="none" stroke="#FF2800" strokeWidth="1.5" />

                    {/* Peak Activation Crosshair */}
                    <line x1="183" y1="140" x2="193" y2="140" stroke="#F4F6F9" strokeWidth="1.5" />
                    <line x1="188" y1="135" x2="188" y2="145" stroke="#F4F6F9" strokeWidth="1.5" />
                    <text x="196" y="137" fill="#F4F6F9" fontSize="9" fontFamily="monospace">0.942 PEAK</text>

                    {/* Grad-CAM Label */}
                    <text x="380" y="30" fill="#FF2800" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="end">
                      GRAD-CAM JET SALIENCY
                    </text>
                  </svg>
                </div>
              </div>

              {/* Specular Hairline Divider */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#F4F6F9] pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                style={{ left: `${lensPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#03050A] border border-[#FF2800] text-[#FF2800] flex items-center justify-center text-[10px] font-mono shadow-[0_0_10px_rgba(255,40,0,0.5)]">
                  ↔
                </div>
              </div>

              {/* Interactive Range Slider (Scrubbing Surface) */}
              <input
                type="range"
                min="0"
                max="100"
                value={lensPos}
                onChange={(e) => setLensPos(Number(e.target.value))}
                aria-label="Grad-CAM Saliency Lens Split Slider"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Pipeline Topology (Interactive SVG Architectural DAG Graph) */}
        {activeTab === 'topology' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <svg viewBox="0 0 680 340" className="w-full h-full max-h-[420px] overflow-visible">
              <defs>
                <linearGradient id="pipeGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#FF2800" />
                </linearGradient>
              </defs>

              {/* Connecting Spline Paths */}
              {/* Path 1 -> 2 */}
              <path
                d="M 150 140 C 190 140, 190 140, 230 140"
                fill="none"
                stroke={activeStage >= 2 ? '#2563EB' : 'rgba(37, 99, 235, 0.2)'}
                strokeWidth="2"
                strokeDasharray={activeStage >= 2 ? 'none' : '4 4'}
              />
              {/* Path 2 -> 3 */}
              <path
                d="M 330 140 C 370 140, 370 140, 410 140"
                fill="none"
                stroke={activeStage >= 3 ? '#2563EB' : 'rgba(37, 99, 235, 0.2)'}
                strokeWidth="2"
                strokeDasharray={activeStage >= 3 ? 'none' : '4 4'}
              />
              {/* Path 3 -> 4 */}
              <path
                d="M 510 140 C 540 140, 540 140, 570 140"
                fill="none"
                stroke={activeStage >= 4 ? '#FF2800' : 'rgba(37, 99, 235, 0.2)'}
                strokeWidth="2.5"
              />

              {/* Animated Data Packets / Pulses along paths */}
              <circle cx={activeStage >= 2 ? 190 : 150} cy="140" r="3.5" fill="#2563EB" className="animate-ping" />
              <circle cx={activeStage >= 3 ? 370 : 330} cy="140" r="3.5" fill="#2563EB" />
              <circle cx={activeStage >= 4 ? 540 : 510} cy="140" r="4" fill="#FF2800" className="animate-pulse" />

              {/* NODE 1: Edge Gate (Laplacian) */}
              <g
                role="button"
                tabIndex={0}
                onClick={() => setActiveStage(1)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage(1); } }}
                className="cursor-pointer"
              >
                <rect
                  x="50"
                  y="90"
                  width="100"
                  height="100"
                  fill="#060A12"
                  stroke={activeStage === 1 ? '#FF2800' : '#2563EB'}
                  strokeWidth={activeStage === 1 ? '2' : '1'}
                />
                <text x="100" y="112" fill="#7E8B9B" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  01. EDGE GATE
                </text>
                <text x="100" y="132" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  Laplacian
                </text>
                <text x="100" y="152" fill="#4CC38A" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  &lt; 35ms Filter
                </text>
                <text x="100" y="172" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  [1, 1, 512, 512]
                </text>
              </g>

              {/* NODE 2: Morphology (HSV Tissue Bed) */}
              <g
                role="button"
                tabIndex={0}
                onClick={() => setActiveStage(2)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage(2); } }}
                className="cursor-pointer"
              >
                <rect
                  x="230"
                  y="90"
                  width="100"
                  height="100"
                  fill="#060A12"
                  stroke={activeStage === 2 ? '#FF2800' : '#2563EB'}
                  strokeWidth={activeStage === 2 ? '2' : '1'}
                />
                <text x="280" y="112" fill="#7E8B9B" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  02. MORPHOLOGY
                </text>
                <text x="280" y="132" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  HSV Tissue Bed
                </text>
                <text x="280" y="152" fill="#4CC38A" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  2.00ms Vector
                </text>
                <text x="280" y="172" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  [1, 3, 512, 512]
                </text>
              </g>

              {/* NODE 3: Classifier (CNN Tensor) */}
              <g
                role="button"
                tabIndex={0}
                onClick={() => setActiveStage(3)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage(3); } }}
                className="cursor-pointer"
              >
                <rect
                  x="410"
                  y="90"
                  width="100"
                  height="100"
                  fill="#060A12"
                  stroke={activeStage === 3 ? '#FF2800' : '#2563EB'}
                  strokeWidth={activeStage === 3 ? '2' : '1'}
                />
                <text x="460" y="112" fill="#7E8B9B" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  03. CLASSIFIER
                </text>
                <text x="460" y="132" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  CNN Tensor
                </text>
                <text x="460" y="152" fill="#4CC38A" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  14.2ms Backbone
                </text>
                <text x="460" y="172" fill="#7E8B9B" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  [1, 512, 16, 16]
                </text>
              </g>

              {/* NODE 4: Explainable (Grad-CAM Saliency) */}
              <g
                role="button"
                tabIndex={0}
                onClick={() => setActiveStage(4)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveStage(4); } }}
                className="cursor-pointer"
              >
                <rect
                  x="570"
                  y="90"
                  width="100"
                  height="100"
                  fill="#0B1E40"
                  stroke={activeStage === 4 ? '#FF2800' : '#FF4419'}
                  strokeWidth={activeStage === 4 ? '2.5' : '1.5'}
                />
                <text x="620" y="112" fill="#FF2800" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  04. EXPLAINABLE
                </text>
                <text x="620" y="132" fill="#F4F6F9" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  Grad-CAM Jet
                </text>
                <text x="620" y="152" fill="#FF2800" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  8.09ms Latency
                </text>
                <text x="620" y="172" fill="#C8D2E0" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  [1, 1, 512, 512]
                </text>
              </g>

              {/* Bottom Architectural Callout Bar in SVG */}
              <line x1="50" y1="225" x2="670" y2="225" stroke="rgba(37, 99, 235, 0.25)" />
              <text x="50" y="255" fill="#C8D2E0" fontSize="11" fontFamily="sans-serif">
                {activeStage === 1 && 'Stage 1: In-browser Laplacian edge gate rejects blurred or unaligned camera frames before inference.'}
                {activeStage === 2 && 'Stage 2: Vectorized NumPy HSV color segmentation extracts the granulation tissue bed in 2.00ms.'}
                {activeStage === 3 && 'Stage 3: Deep CNN extracts feature maps [1, 512, 16, 16] across 14.2ms of local CPU/GPU runtime.'}
                {activeStage === 4 && 'Stage 4: Vectorized linear Jet colormapping synthesizes full 512x512 explainability saliency in 8.09ms with zero Matplotlib thread locks.'}
              </text>
              <text x="50" y="278" fill="#7E8B9B" fontSize="9" fontFamily="monospace">
                MEMORY FOOTPRINT: 0.0 MB Matplotlib Lock | HARDWARE: Client-Side CPU/GPU WebGL
              </text>
            </svg>
          </div>
        )}
      </div>

      {/* ROW 3: HTML Telemetry footer (outside drawing canvas; never overlaying or clipping artwork) */}
      <div className="pt-3 border-t border-[#2563EB]/20 w-full min-w-0 text-xs font-mono">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[#7E8B9B]">
          <div>
            <span className="text-[10px] block uppercase tracking-wider">
              {activeTab === 'elevation' ? 'Slice Elevation Δz' : activeTab === 'saliency' ? 'Peak Saliency' : 'End-to-End Latency'}
            </span>
            <span className="text-sm font-bold text-[#FF2800]">
              {activeTab === 'elevation' ? `${sliceDzMm} mm` : activeTab === 'saliency' ? '0.942 Intensity' : '59.29 ms Total'}
            </span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">
              {activeTab === 'elevation' ? 'LiDAR Margin' : activeTab === 'saliency' ? 'Vectorized Latency' : 'Grad-CAM Step'}
            </span>
            <span className="text-sm font-bold text-[#F4F6F9]">
              {activeTab === 'elevation' ? '±0.08 mm Accuracy' : '8.09 ms Verified'}
            </span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">
              {activeTab === 'elevation' ? 'Point Density' : activeTab === 'saliency' ? 'GUI Overhead' : 'Memory Profile'}
            </span>
            <span className="text-sm font-bold text-[#4CC38A]">
              {activeTab === 'elevation' ? '96 LiDAR Vertices' : activeTab === 'saliency' ? '0 MB GUI Lock' : '< 42 MB In-Memory'}
            </span>
          </div>

          <div>
            <span className="text-[10px] block uppercase tracking-wider">Hardware Target</span>
            <span className="text-sm font-bold text-[#2563EB]">Zero Cloud GPU</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateHealios;
