import React, { useState, useRef, useEffect } from 'react';

export type HealiosTab = 'elevation' | 'saliency' | 'topology';

export const PlateHealios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HealiosTab>('elevation');
  const [sliceX, setSliceX] = useState<number>(240);
  const [lensPos, setLensPos] = useState<number>(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Isometric LiDAR Point Cloud & 12 Elevation Rings Canvas Loop
  useEffect(() => {
    if (activeTab !== 'elevation') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 560);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const ringCount = 12;
    let angle = 0;

    const render = () => {
      angle += 0.007;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 10;
      const rx = Math.min(width * 0.40, 200);
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
      const currentSliceX = Math.max(cx - rx, Math.min(cx + rx, sliceX));
      ctx.save();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(currentSliceX, 24);
      ctx.lineTo(currentSliceX, height - 24);
      ctx.stroke();

      // Intersection node on active slice
      const normDist = Math.abs((currentSliceX - cx) / rx);
      if (normDist <= 1.0) {
        const sliceDepth = Math.pow(Math.max(0, 1 - normDist), 1.8) * -34;
        ctx.fillStyle = '#FF2800';
        ctx.beginPath();
        ctx.arc(currentSliceX, cy + sliceDepth, 4, 0, Math.PI * 2);
        ctx.fill();

        // Elevation readout
        ctx.font = '10px "Geist Mono", monospace';
        ctx.fillStyle = '#F4F6F9';
        ctx.fillText(`Δz: ${(sliceDepth * 0.08).toFixed(2)}mm`, currentSliceX + 8, cy + sliceDepth - 6);
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeTab, sliceX]);

  return (
    <div className="w-full h-full min-h-[460px] flex flex-col justify-between select-none">
      {/* Clean Underline Mode Tabs Header (Zero Nested Boxes) */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-[#2563EB]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
          <span className="text-[#C8D2E0] font-semibold tracking-wider">
            3D ISOMETRIC ELEVATION &amp; POINT-CLOUD MESH
          </span>
        </div>

        {/* Clean Underline Tabs */}
        <div className="flex items-center gap-6 pt-2 sm:pt-0">
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

      {/* Main Interactive Stage Body (Height 460px) */}
      <div className="relative flex-1 w-full min-h-[400px] flex items-center justify-center p-2">
        {/* TAB 1: 3D Elevation & Point-Cloud Canvas */}
        {activeTab === 'elevation' && (
          <div className="relative w-full h-full min-h-[390px] flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Interactive Horizontal Slicer Range Input (Zero nested boxes) */}
            <input
              type="range"
              min="100"
              max="460"
              value={sliceX}
              onChange={(e) => setSliceX(Number(e.target.value))}
              aria-label="Elevation Cross-Section Slicer"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        )}

        {/* TAB 2: Grad-CAM Saliency Comparison Lens */}
        {activeTab === 'saliency' && (
          <div className="relative w-full h-full min-h-[390px] flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] overflow-hidden select-none">
              {/* Left Side: Clinical RGB Surface */}
              <div className="absolute inset-0 bg-[#060A12] flex items-center justify-center">
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-60">
                  <ellipse cx="200" cy="150" rx="110" ry="90" fill="#2D1B1B" />
                  <path
                    d="M 140 90 Q 200 150 250 210"
                    stroke="#FF4419"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                  <path
                    d="M 140 90 Q 200 150 250 210"
                    stroke="#FF2800"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Right Side: Vectorized Grad-CAM Heatmap Reveal */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${lensPos}%)` }}
              >
                <div className="absolute inset-0 bg-[#060A12] flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <defs>
                      <radialGradient id="gradcamHeat" cx="50%" cy="50%" r="48%">
                        <stop offset="0%" stopColor="#FF2800" stopOpacity="0.95" />
                        <stop offset="35%" stopColor="#FF4419" stopOpacity="0.75" />
                        <stop offset="65%" stopColor="#2563EB" stopOpacity="0.55" />
                        <stop offset="90%" stopColor="#153875" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#03050A" stopOpacity="0.0" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="200" cy="150" rx="110" ry="90" fill="url(#gradcamHeat)" />
                  </svg>
                </div>
              </div>

              {/* Dividing Specular Hairline */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#F4F6F9] pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                style={{ left: `${lensPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#03050A] border border-[#FF2800] text-[#FF2800] flex items-center justify-center text-[10px] font-mono">
                  ↔
                </div>
              </div>

              {/* Interactive Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={lensPos}
                onChange={(e) => setLensPos(Number(e.target.value))}
                aria-label="Grad-CAM Saliency Lens Slider"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Pipeline Topology (Unboxed Flow) */}
        {activeTab === 'topology' && (
          <div className="w-full h-full flex flex-col justify-center space-y-6 text-xs font-mono py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="pb-3 border-b border-[#2563EB]/30">
                <div className="text-[10px] text-[#7E8B9B]">01. EDGE GATE</div>
                <div className="text-[#F4F6F9] font-bold mt-1 text-sm">Laplacian Filter</div>
                <div className="text-[#4CC38A] text-[11px] mt-0.5">&lt; 35ms In-Browser</div>
              </div>
              <div className="pb-3 border-b border-[#2563EB]/30">
                <div className="text-[10px] text-[#7E8B9B]">02. MORPHOLOGY</div>
                <div className="text-[#F4F6F9] font-bold mt-1 text-sm">HSV Tissue Bed</div>
                <div className="text-[#4CC38A] text-[11px] mt-0.5">2.00ms Vectorized</div>
              </div>
              <div className="pb-3 border-b border-[#2563EB]/30">
                <div className="text-[10px] text-[#7E8B9B]">03. CLASSIFIER</div>
                <div className="text-[#F4F6F9] font-bold mt-1 text-sm">CNN Tensor</div>
                <div className="text-[#4CC38A] text-[11px] mt-0.5">14.2ms Backbone</div>
              </div>
              <div className="pb-3 border-b border-[#FF2800]">
                <div className="text-[10px] text-[#FF2800]">04. EXPLAINABLE</div>
                <div className="text-[#F4F6F9] font-bold mt-1 text-sm">Grad-CAM Jet</div>
                <div className="text-[#FF2800] text-[11px] mt-0.5 font-bold">8.09ms Latency</div>
              </div>
            </div>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed max-w-xl">
              Vectorized NumPy linear Jet colormap implementation computes pixel saliency without Matplotlib GUI locks, saving 120MB+ RAM and eliminating thread pauses in production clinical workflows.
            </p>
          </div>
        )}
      </div>

      {/* Clean Bottom Status Line */}
      <div className="pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-[11px] font-mono text-[#7E8B9B]">
        <span>SENSOR: 3D LiDAR + Multi-Channel RGB Tensor</span>
        <span className="text-[#4CC38A]">8.09ms Saliency Verified</span>
      </div>
    </div>
  );
};

export default PlateHealios;
