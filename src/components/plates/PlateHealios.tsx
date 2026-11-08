import React, { useState, useRef, useEffect } from 'react';

export type HealiosTab = 'elevation' | 'heatmap' | 'topology';

export const PlateHealios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HealiosTab>('elevation');
  const [sliceX, setSliceX] = useState<number>(210);
  const [isHoveringSlice, setIsHoveringSlice] = useState<boolean>(false);
  const [lensPos, setLensPos] = useState<number>(50);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // 3D Isometric LiDAR Point Cloud & 12 Elevation Rings Canvas Loop
  useEffect(() => {
    if (activeTab !== 'elevation') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 520);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 380);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 12 Concentric Elevation Contours & Point Cloud Vertices
    const ringCount = 12;
    let angle = 0;

    const render = () => {
      angle += 0.008;
      setRotationAngle(angle);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 15;
      const rx = Math.min(width * 0.38, 175);
      const ry = rx * 0.52; // Isometric 3D foreshortening

      // 1. Draw 12 Concentric Elevation Contour Rings
      for (let r = 1; r <= ringCount; r++) {
        const ringT = r / ringCount; // 0 (center crater) to 1 (outer wound margin)
        const currentRx = rx * ringT;
        const currentRy = ry * ringT;
        // Depth depression: center is -28px deep, rim is 0px
        const elevationZ = Math.pow(1 - ringT, 1.8) * -32;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + elevationZ, currentRx, currentRy, 0, 0, Math.PI * 2);

        // Color coding by depth
        const hue = 15 + ringT * 40; // 15 (orange-red deep wound) to 55 (gold margin)
        const alpha = 0.25 + ringT * 0.55;
        ctx.strokeStyle = ringT < 0.35 ? '#FF6B35' : ringT < 0.7 ? '#F5D998' : '#82B7FF';
        ctx.lineWidth = r % 3 === 0 ? 1.4 : 0.8;
        ctx.globalAlpha = alpha;
        if (r % 2 === 0) ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw 3D Rotating LiDAR Point Cloud Vertices
      const pointCount = 96;
      for (let i = 0; i < pointCount; i++) {
        const ptRing = (i % ringCount) / ringCount;
        const ptAngle = (i / pointCount) * Math.PI * 4 + angle;
        const rad = rx * Math.pow(ptRing, 0.75);

        // 3D coordinates
        const x3d = rad * Math.cos(ptAngle);
        const y3d = rad * Math.sin(ptAngle);
        const z3d = Math.pow(1 - ptRing, 1.8) * -34 + Math.sin(ptAngle * 3 + angle * 2) * 3;

        // Isometric projection
        const projX = cx + x3d;
        const projY = cy + y3d * 0.52 + z3d;

        const isDeep = ptRing < 0.4;
        ctx.fillStyle = isDeep ? '#FF6B35' : ptRing < 0.75 ? '#F5D998' : '#82B7FF';
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(projX, projY, isDeep ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Slicer Cross-Section Line & Elevation Depth Profile
      const currentSliceX = sliceX;
      ctx.save();
      ctx.strokeStyle = '#82B7FF';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(currentSliceX, 24);
      ctx.lineTo(currentSliceX, height - 24);
      ctx.stroke();
      ctx.restore();

      // Slicer probe intersection marker
      const distFromCenter = Math.abs(currentSliceX - cx);
      const normDist = Math.min(1, distFromCenter / rx);
      const measuredDepth = -(1 - normDist * normDist) * 4.25; // in mm
      const probeY = cy + measuredDepth * 8;

      ctx.save();
      ctx.fillStyle = '#82B7FF';
      ctx.beginPath();
      ctx.arc(currentSliceX, probeY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTab, sliceX]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
    setSliceX(x);
  };

  return (
    <div className="w-full h-full min-h-[440px] flex flex-col justify-between select-none">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#82B7FF]/20 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-[#82B7FF] font-semibold tracking-wider">PLATE 01 · LIDAR ELEVATION &amp; XAI</span>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#101B30] p-1 rounded-[2px] border border-[#F3EFE7]/10">
          <button
            type="button"
            onClick={() => setActiveTab('elevation')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'elevation'
                ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            3D Elevation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'heatmap'
                ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            Grad-CAM Heatmap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('topology')}
            className={`px-2.5 py-1 rounded-[2px] transition-colors ${
              activeTab === 'topology'
                ? 'bg-[#FF6B35] text-[#070B12] font-semibold'
                : 'text-[#A7B2C3] hover:text-[#F3EFE7]'
            }`}
          >
            Pipeline Topology
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Body */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        {/* TAB 1: 3D Elevation Topographical Mesh */}
        {activeTab === 'elevation' && (
          <div
            className="relative w-full h-full min-h-[360px] flex items-center justify-center cursor-ew-resize"
            onPointerMove={handlePointerMove}
            onMouseEnter={() => setIsHoveringSlice(true)}
            onMouseLeave={() => setIsHoveringSlice(false)}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Depth Probe Floating Readout Box */}
            <div className="absolute top-4 left-4 bg-[#070B12]/90 border border-[#82B7FF]/40 p-3 rounded-[2px] text-xs font-mono backdrop-blur-md pointer-events-none shadow-xl">
              <div className="text-[10px] text-[#A7B2C3] uppercase tracking-wider mb-1">
                LIDAR CROSS-SECTION SLICER
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#FF6B35]">
                  {sliceX < 180 || sliceX > 340 ? '-0.82 mm' : '-3.48 mm'}
                </span>
                <span className="text-[#82B7FF]">±0.08mm Margin</span>
              </div>
              <div className="text-[10px] text-[#4CC38A] mt-1">
                {sliceX < 180 || sliceX > 340 ? 'Marginal Epidermis' : 'Granulation Tissue Bed'}
              </div>
            </div>

            {/* Hint at Bottom */}
            <div className="absolute bottom-3 right-4 text-[11px] font-mono text-[#7A889B] pointer-events-none">
              <span>DRAG CURSOR HORIZONTALLY TO SCAN ELEVATION (12 RINGS)</span>
            </div>
          </div>
        )}

        {/* TAB 2: Grad-CAM Saliency Comparison Lens */}
        {activeTab === 'heatmap' && (
          <div className="relative w-full h-full min-h-[360px] flex items-center justify-center p-4">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-[2px] overflow-hidden border border-[#F3EFE7]/15 bg-[#090D14]">
              {/* Raw Tissue Base */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B1B] via-[#4A2020] to-[#1E1414] flex items-center justify-center">
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-70">
                  <path d="M 120 70 Q 200 150 260 230" stroke="#E57373" strokeWidth="14" strokeLinecap="round" fill="none" />
                  <path d="M 120 70 Q 200 150 260 230" stroke="#FFCDD2" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="180" cy="130" r="32" fill="#C62828" opacity="0.6" />
                  <circle cx="210" cy="160" r="38" fill="#D32F2F" opacity="0.5" />
                </svg>
              </div>

              {/* Saliency Overlay clipped by slider */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${lensPos}% 0, ${lensPos}% 100%, 0 100%)` }}
              >
                <div className="absolute inset-0 mix-blend-screen opacity-90">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <defs>
                      <radialGradient id="healiosHeatGrad" cx="50%" cy="50%" r="45%">
                        <stop offset="0%" stopColor="#FF0000" stopOpacity="0.95" />
                        <stop offset="35%" stopColor="#FF7700" stopOpacity="0.8" />
                        <stop offset="65%" stopColor="#FFFF00" stopOpacity="0.6" />
                        <stop offset="85%" stopColor="#00FFCC" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0000FF" stopOpacity="0.0" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="200" cy="150" rx="100" ry="85" fill="url(#healiosHeatGrad)" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3 bg-[#070B12]/90 border border-[#82B7FF] px-2.5 py-1 text-[10px] font-mono text-[#82B7FF]">
                  Vectorized Grad-CAM: 8.09ms
                </div>
              </div>

              {/* Divider bar */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                style={{ left: `${lensPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white text-[#070B12] flex items-center justify-center text-[9px] font-bold">
                  ↔
                </div>
              </div>

              {/* Interactive range slider */}
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

        {/* TAB 3: Pipeline Topology */}
        {activeTab === 'topology' && (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#101B30] border border-[#82B7FF]/30 rounded-[2px]">
                <div className="text-[10px] text-[#A7B2C3]">01. EDGE GATE</div>
                <div className="text-[#F3EFE7] font-bold mt-1">Laplacian Blur</div>
                <div className="text-[#4CC38A] text-[11px]">&lt; 35ms Filter</div>
              </div>
              <div className="p-3 bg-[#101B30] border border-[#82B7FF]/30 rounded-[2px]">
                <div className="text-[10px] text-[#A7B2C3]">02. MORPHOLOGY</div>
                <div className="text-[#F3EFE7] font-bold mt-1">HSV Tissue Bed</div>
                <div className="text-[#4CC38A] text-[11px]">2.00ms Vectorized</div>
              </div>
              <div className="p-3 bg-[#101B30] border border-[#82B7FF]/30 rounded-[2px]">
                <div className="text-[10px] text-[#A7B2C3]">03. CLASSIFIER</div>
                <div className="text-[#F3EFE7] font-bold mt-1">CNN Backbone</div>
                <div className="text-[#4CC38A] text-[11px]">14.2ms Tensor</div>
              </div>
              <div className="p-3 bg-[#101B30] border border-[#FF6B35]/40 rounded-[2px] bg-[#FF6B35]/5">
                <div className="text-[10px] text-[#FF6B35]">04. EXPLAINABLE</div>
                <div className="text-[#F3EFE7] font-bold mt-1">Grad-CAM Jet</div>
                <div className="text-[#FF6B35] text-[11px] font-bold">8.09ms Latency</div>
              </div>
            </div>

            <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/10 rounded-[2px] text-[#A7B2C3] leading-relaxed">
              Vectorized NumPy linear Jet colormap implementation computes pixel saliency without Matplotlib GUI locks, saving 120MB+ RAM in production.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="pt-3 border-t border-[#82B7FF]/20 flex items-center justify-between text-[11px] font-mono text-[#7A889B]">
        <span>SENSOR: 3D LiDAR + RGB Tensor</span>
        <span className="text-[#4CC38A]">8.09ms Verified Latency</span>
      </div>
    </div>
  );
};

export default PlateHealios;
