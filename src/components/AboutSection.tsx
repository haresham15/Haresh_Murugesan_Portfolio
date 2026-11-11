import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ThemeSection } from './ThemeSection';

const MotionDiv = motion.div as any;

export const AboutSection: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics for subtle ±4deg 3D tilt response
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(mouseX, { stiffness: 220, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Map to ±4deg max tilt
    mouseX.set(offsetX * 4);
    mouseY.set(-offsetY * 4);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const scrollToAnchor = (anchorId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeSection
      id="about"
      theme="obsidian"
      aria-label="About and engineering thesis"
      className="border-b border-[#18458B]/20 py-24 lg:py-36"
    >
      <div className="w-full flex flex-col justify-center my-auto space-y-28">
        {/* =====================================================================
            PRIMARY SPREAD: 40% PORTRAIT / 60% EDITORIAL NARRATIVE
            ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left 5 Columns: Asymmetric Editorial Monolith & Parallax Lens Frame */}
          <div className="lg:col-span-5 relative">
            <MotionDiv
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
              }}
              className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] aspect-[4/5] mx-auto lg:mx-0 select-none cursor-pointer group"
            >
              {/* Offset Double-Frame Shadow Contours */}
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-[#0B1E40]/30 rounded-[2px] pointer-events-none transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
                }}
              />
              <div
                className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#FF2800]/40 rounded-[2px] pointer-events-none transition-transform duration-500 group-hover:translate-x-2.5 group-hover:translate-y-2.5"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
                }}
              />

              {/* Main Chamfered Architectural Image Container */}
              <div
                className="relative w-full h-full bg-[#060A12] border border-[#18458B]/30 overflow-hidden shadow-[0_20px_50px_rgba(3,5,10,0.8)]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
                }}
              >
                <Image
                  src="/profile.jpeg"
                  alt="Haresh Murugesan — Software & Systems Engineer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                  className="object-cover object-top filter grayscale contrast-[1.08] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />

                {/* Interactive True-Color Reveal Wave Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr from-[#FF2800]/15 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Bottom Internal Optical Chamfer Rule */}
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white/50 tracking-widest pointer-events-none">
                  40.00°N · 83.03°W
                </div>
              </div>

              {/* Clean Floating Marginalia Tag (Outside Bottom-Left Edge) */}
              <div className="relative mt-4 text-[11px] font-mono text-[#7E8B9B] tracking-wider flex flex-wrap gap-y-1">
                <span className="text-[#F4F6F9] font-semibold">HARESH MURUGESAN</span>
                <span className="mx-2 text-[#FF2800]">·</span>
                <span>COLUMBUS, OH [40.0067° N, 83.0305° W]</span>
                <span className="mx-2 text-[#FF2800]">·</span>
                <span>B.S. CSE (AI), OHIO STATE</span>
              </div>
            </MotionDiv>
          </div>

          {/* Right 7 Columns: Display Headline + Concise 32-Word Statement + 3 Metric Anchors */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-10">
            
            {/* Monumental Editorial Headline */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F6F9] leading-[1.12] tracking-tight">
              I build software where{' '}
              <span className="italic text-[#FF2800]">computational speed</span> meets real-world physical and human systems.
            </h2>

            {/* Radical Copy Condensation: Exact Concise 32-Word Punchy Statement */}
            <div className="max-w-[60ch]">
              <p className="text-base sm:text-lg font-sans text-[#C8D2E0] leading-relaxed">
                Focused on the seam between deterministic data pipelines, explainable deep learning, and low-latency client architectures—eliminating bloated cloud abstractions so clinicians, analysts, and operators stay in control.
              </p>
            </div>

            {/* Clean Horizontal Strip of 3 Interactive Metric Anchors */}
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7E8B9B] mb-4">
                VERIFIED ARCHITECTURAL BENCHMARKS · SELECT TO NAVIGATE
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Metric 01 */}
                <a
                  href="#projects"
                  onClick={scrollToAnchor('projects')}
                  className="group p-4 bg-[#060A12] border border-[#18458B]/30 hover:border-[#FF2800]/50 rounded-[2px] transition-all duration-200 flex flex-col justify-between select-none cursor-pointer"
                >
                  <span className="text-[11px] font-mono text-[#7E8B9B] group-hover:text-[#FF2800] transition-colors flex items-center justify-between">
                    <span>PLATE 01</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="mt-2 text-sm sm:text-base font-mono font-bold text-[#F4F6F9] tracking-tight">
                    8.09ms Vectorized Grad-CAM
                  </div>
                  <span className="mt-1 text-[11px] font-sans text-[#7E8B9B]">
                    Healios V2 Saliency Pipeline
                  </span>
                </a>

                {/* Metric 02 */}
                <a
                  href="#experience"
                  onClick={scrollToAnchor('experience')}
                  className="group p-4 bg-[#060A12] border border-[#18458B]/30 hover:border-[#FF2800]/50 rounded-[2px] transition-all duration-200 flex flex-col justify-between select-none cursor-pointer"
                >
                  <span className="text-[11px] font-mono text-[#7E8B9B] group-hover:text-[#FF2800] transition-colors flex items-center justify-between">
                    <span>APEX 01</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="mt-2 text-sm sm:text-base font-mono font-bold text-[#F4F6F9] tracking-tight">
                    12 AWS Agentic Workflows
                  </div>
                  <span className="mt-1 text-[11px] font-sans text-[#7E8B9B]">
                    Chemical Abstracts Service (CAS)
                  </span>
                </a>

                {/* Metric 03 */}
                <a
                  href="#projects"
                  onClick={scrollToAnchor('projects')}
                  className="group p-4 bg-[#060A12] border border-[#18458B]/30 hover:border-[#FF2800]/50 rounded-[2px] transition-all duration-200 flex flex-col justify-between select-none cursor-pointer"
                >
                  <span className="text-[11px] font-mono text-[#7E8B9B] group-hover:text-[#FF2800] transition-colors flex items-center justify-between">
                    <span>PLATE 02</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="mt-2 text-sm sm:text-base font-mono font-bold text-[#F4F6F9] tracking-tight">
                    60 FPS Web Worker Telemetry
                  </div>
                  <span className="mt-1 text-[11px] font-sans text-[#7E8B9B]">
                    Apexis Motorsports Engine
                  </span>
                </a>

              </div>
            </div>

            {/* Direct Action Links */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 text-xs font-mono">
              <a
                href="#experience"
                onClick={scrollToAnchor('experience')}
                className="px-6 py-3.5 bg-[#FF2800] hover:bg-[#C8D2E0] text-[#03050A] font-semibold rounded-[2px] transition-colors inline-flex items-center justify-center gap-2 select-none shadow-[0_4px_16px_rgba(255,40,0,0.3)] text-center"
              >
                <span>Follow the Experience S-Curve</span>
                <span>↓</span>
              </a>
              <Link
                href="/about"
                className="px-6 py-3.5 bg-[#060A12] hover:bg-[#0B1E40] text-[#F4F6F9] border border-[#18458B]/30 rounded-[2px] transition-colors inline-flex items-center justify-center gap-2 select-none font-medium text-center"
              >
                <span>Full Leadership Profile</span>
                <span>→</span>
              </Link>
            </div>

          </div>

        </div>

        {/* =====================================================================
            SECONDARY SPREAD: STANDALONE UNBOXED CLINICAL CV / DIGITAL PATHOLOGY ARTIFACT PLATE
            ===================================================================== */}
        <div className="w-full pt-16 border-t border-[#18458B]/20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#FF2800] uppercase tracking-wider font-semibold">
                FIG. 01 — CLINICAL COMPUTER VISION &amp; EXPLAINABLE DIGITAL PATHOLOGY
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F6F9]">
                Gigapixel Whole Slide Image (WSI) Histology Segmentation
              </h3>
            </div>
            <div className="text-xs font-mono text-[#7E8B9B]">
              The Ohio State University · Clinical Diagnostics Lab
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-[#060A12] border border-[#18458B]/25 p-6 rounded-[2px] space-y-4">
              <div className="flex flex-wrap gap-2 items-center justify-between text-xs font-mono pb-3 border-b border-[#18458B]/20">
                <span className="text-[#C8D2E0]">Vectorized Saliency Tensor Architecture</span>
                <span className="text-[#FF2800] font-semibold">8.09ms Latency</span>
              </div>
              <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed">
                Applying deep convolutional networks and explainable Grad-CAM saliency heatmaps to gigapixel whole slide pathology images. The pipeline eliminates boundary tiling artifacts across 100,000×100,000px clinical slide tissue sections, benchmarking segmented cellular boundaries against ground-truth pathologist annotations via cross-validated Dice coefficient and Intersection-over-Union (IoU) metrics.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 sm:p-3 bg-[#03050A] border border-[#18458B]/20 rounded-[2px] text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs text-[#7E8B9B]">Inference Speed</div>
                  <div className="text-xs sm:text-sm font-bold text-[#FF2800] mt-0.5">8.09 ms</div>
                </div>
                <div className="p-2.5 sm:p-3 bg-[#03050A] border border-[#18458B]/20 rounded-[2px] text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs text-[#7E8B9B]">Boundary Overlap</div>
                  <div className="text-xs sm:text-sm font-bold text-[#C8D2E0] mt-0.5">&gt;91% IoU</div>
                </div>
                <div className="p-2.5 sm:p-3 bg-[#03050A] border border-[#18458B]/20 rounded-[2px] text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs text-[#7E8B9B]">Tiling Artifacts</div>
                  <div className="text-xs sm:text-sm font-bold text-[#2563EB] mt-0.5">0% Bleed</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 text-xs font-mono text-[#7E8B9B]">
              <div className="p-5 bg-[#060A12] border border-[#18458B]/25 rounded-[2px] space-y-2">
                <div className="text-[#C8D2E0] font-semibold uppercase">Explainable Saliency Verification</div>
                <p className="font-sans text-[13px] text-[#7E8B9B] leading-relaxed">
                  Unlike black-box classifiers, vectorized Grad-CAM backpropagation isolates the exact morphological cellular features driving tumor boundary delineations, enabling clinical pathology teams to verify algorithmic confidence in real time.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <Link
                  href="/projects/healios"
                  className="inline-flex items-center gap-2 text-[#FF2800] hover:text-[#C8D2E0] transition-colors uppercase font-semibold"
                >
                  <span>Inspect Saliency Implementation in Healios V2</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeSection>
  );
};

export default AboutSection;
