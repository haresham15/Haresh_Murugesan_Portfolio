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
      theme="alabaster"
      aria-label="About and engineering thesis"
      className="border-b border-[#0B0B0E]/10"
    >
      <div className="w-full flex flex-col justify-center my-auto">
        {/* Editorial Section Index / Marginalia Header */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#C83E2B] mb-12 sm:mb-16">
          <span className="w-6 h-px bg-[#C83E2B]" />
          <span>01 // THESIS &amp; ARCHITECTURAL DIRECTIVE</span>
        </div>

        {/* 12-Column Fluid Grid: 5 Cols Portrait Monolith / 7 Cols Concise Narrative Spread */}
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
              className="relative w-full aspect-[4/5] max-w-[480px] mx-auto lg:mx-0 select-none cursor-pointer group"
            >
              {/* Offset Double-Frame Shadow Contours */}
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-[#0B0B0E]/10 rounded-[2px] pointer-events-none transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
                }}
              />
              <div
                className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-[#C83E2B]/40 rounded-[2px] pointer-events-none transition-transform duration-500 group-hover:translate-x-2.5 group-hover:translate-y-2.5"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
                }}
              />

              {/* Main Chamfered Architectural Image Container */}
              <div
                className="relative w-full h-full bg-[#0B0B0E] border border-[#0B0B0E]/20 overflow-hidden shadow-[0_20px_50px_rgba(11,11,14,0.18)]"
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
                  className={`absolute inset-0 bg-gradient-to-tr from-[#C83E2B]/15 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Bottom Internal Optical Chamfer Rule */}
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white/50 tracking-widest pointer-events-none">
                  SEC // 40.00°N
                </div>
              </div>

              {/* Clean Floating Marginalia Tag (Outside Bottom-Left Edge) */}
              <div className="absolute -bottom-8 left-0 text-[11px] font-mono text-[#525156] tracking-wider whitespace-nowrap hidden sm:block">
                <span className="text-[#0B0B0E] font-semibold">HARESH MURUGESAN</span>
                <span className="mx-2 text-[#C83E2B]">·</span>
                <span>COLUMBUS, OH [40.0067° N, 83.0305° W]</span>
                <span className="mx-2 text-[#C83E2B]">·</span>
                <span>B.S. CSE (AI), OHIO STATE</span>
              </div>
            </MotionDiv>
          </div>

          {/* Right 7 Columns: Display Headline + Concise 32-Word Statement + 3 Metric Anchors */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-10">
            
            {/* Monumental Editorial Headline */}
            <h2 className="text-[2.35rem] sm:text-[3.25rem] lg:text-[3.85rem] text-[#0B0B0E] leading-[1.08] tracking-[-0.03em]">
              <span className="font-raleway font-bold block">I build software where</span>
              <span className="font-serif italic font-normal text-[#C83E2B] block">
                computational speed meets real-world
              </span>
              <span className="font-raleway font-bold block">physical and human systems.</span>
            </h2>

            {/* Radical Copy Condensation: Exact Concise 32-Word Punchy Statement */}
            <div className="max-w-[58ch]">
              <p className="text-[18px] sm:text-[20px] font-sans text-[#2B2B30] leading-[1.65] font-normal">
                Focused on the seam between deterministic data pipelines, explainable deep learning, and low-latency client architectures—eliminating bloated cloud abstractions so clinicians, analysts, and operators stay in control.
              </p>
            </div>

            {/* Clean Horizontal Strip of 3 Interactive Metric Anchors */}
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#525156] mb-4">
                VERIFIED ARCHITECTURAL BENCHMARKS // CLICK TO JUMP
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Metric 01 */}
                <a
                  href="#projects"
                  onClick={scrollToAnchor('projects')}
                  className="group p-4 bg-[#EDE8DE] hover:bg-[#E3DDCF] border border-[#0B0B0E]/10 rounded-[2px] transition-all duration-200 flex flex-col justify-between select-none"
                >
                  <span className="text-[11px] font-mono text-[#525156] group-hover:text-[#C83E2B] transition-colors flex items-center justify-between">
                    <span>PLATE 01</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="mt-2 text-sm sm:text-base font-mono font-bold text-[#0B0B0E] tracking-tight">
                    8.09ms Vectorized Grad-CAM
                  </div>
                  <span className="mt-1 text-[11px] font-sans text-[#525156]">
                    Healios V2 Saliency Pipeline
                  </span>
                </a>

                {/* Metric 02 */}
                <a
                  href="#experience"
                  onClick={scrollToAnchor('experience')}
                  className="group p-4 bg-[#EDE8DE] hover:bg-[#E3DDCF] border border-[#0B0B0E]/10 rounded-[2px] transition-all duration-200 flex flex-col justify-between select-none"
                >
                  <span className="text-[11px] font-mono text-[#525156] group-hover:text-[#C83E2B] transition-colors flex items-center justify-between">
                    <span>APEX 01</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="mt-2 text-sm sm:text-base font-mono font-bold text-[#0B0B0E] tracking-tight">
                    12 AWS Agentic Workflows
                  </div>
                  <span className="mt-1 text-[11px] font-sans text-[#525156]">
                    Chemical Abstracts Service (CAS)
                  </span>
                </a>

                {/* Metric 03 */}
                <a
                  href="#projects"
                  onClick={scrollToAnchor('projects')}
                  className="group p-4 bg-[#EDE8DE] hover:bg-[#E3DDCF] border border-[#0B0B0E]/10 rounded-[2px] transition-all duration-200 flex flex-col justify-between select-none"
                >
                  <span className="text-[11px] font-mono text-[#525156] group-hover:text-[#C83E2B] transition-colors flex items-center justify-between">
                    <span>PLATE 02</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="mt-2 text-sm sm:text-base font-mono font-bold text-[#0B0B0E] tracking-tight">
                    60 FPS Web Worker Telemetry
                  </div>
                  <span className="mt-1 text-[11px] font-sans text-[#525156]">
                    Apexis Motorsports Engine
                  </span>
                </a>

              </div>
            </div>

            {/* Direct Action Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <a
                href="#experience"
                onClick={scrollToAnchor('experience')}
                className="px-6 py-3.5 bg-[#0B0B0E] hover:bg-[#C83E2B] text-[#F5F3EF] font-semibold rounded-[2px] transition-colors inline-flex items-center gap-2 select-none shadow-[0_4px_16px_rgba(11,11,14,0.18)]"
              >
                <span>Follow the Experience S-Curve</span>
                <span>↓</span>
              </a>
              <Link
                href="/about"
                className="px-6 py-3.5 bg-transparent hover:bg-[#0B0B0E]/5 text-[#0B0B0E] border border-[#0B0B0E]/20 rounded-[2px] transition-colors inline-flex items-center gap-2 select-none font-medium"
              >
                <span>Full Leadership Profile</span>
                <span>→</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </ThemeSection>
  );
};

export default AboutSection;
