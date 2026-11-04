import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal } from './ui/ReactBitsControls';
import { GridCrosshair } from './ui/GridCrosshair';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="About and engineering thesis"
    >
      {/* 12-Column Flush Swiss Blueprint Spread (Zero Outer Cards, Zero Rounded Radii) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Precision Crosshair Fiducial at Top Left */}
        <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" />
        <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

        {/* Columns 1–5: Large Unboxed Portrait with 0px Crop & Gutter Index */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Structural Gutter Index */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
              <span className="text-[#FFB86C] font-semibold">01 // THESIS &amp; IDENTITY</span>
              <span>INDEX // 02.1</span>
            </div>

            {/* Unboxed Sharp 0px Portrait Container */}
            <div className="relative w-full aspect-[4/5] bg-[#0C1729] border border-[#F4EFE6]/10 overflow-hidden group">
              <Image
                src="/profile.jpeg"
                alt="Haresh Murugesan in Columbus, OH"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
                className="object-cover object-top filter contrast-[1.04] grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="pointer-events-none absolute inset-0 opacity-20 bg-gradient-to-t from-[#07090D] via-transparent to-transparent" />
            </div>
          </div>

          {/* Tabular Caption & Credential Row */}
          <div className="pt-4 border-t border-[#F4EFE6]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#9BA8B8]">
            <span className="text-[#F4EFE6] font-medium">HARESH MURUGESAN</span>
            <span className="text-[#FFB86C]">B.S. CSE · THE OHIO STATE UNIVERSITY</span>
          </div>
        </div>

        {/* Columns 6–12: Monumental Lead Thesis, Narrative Columns & Flush Specimen Plate */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 flex flex-col justify-between space-y-10">
          
          <div className="space-y-8">
            {/* Section Heading */}
            <div className="text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
              <span>PERSPECTIVE // SYSTEMS PHILOSOPHY</span>
            </div>

            {/* Monumental Lead Statement in Geist Serif Triangle */}
            <ScrollReveal>
              <h2 className="text-[2.25rem] sm:text-[2.85rem] lg:text-[3.35rem] font-serif font-normal text-[#F4EFE6] leading-[1.05] tracking-[-0.025em]">
                I build software where computational speed meets real-world physical and human systems.
              </h2>
            </ScrollReveal>

            {/* 2 Narrative Columns with 0px Architectural Breathing Room */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[16px] sm:text-[17px] font-sans text-[#B0BCCB] leading-[1.72]">
              <p>
                I focus on the engineering seam between complex data pipelines and high-reliability systems. Too much modern software relies on bloated cloud abstractions and unverified assumptions. My approach centers on performance, deterministic verification, and client-side architectures that keep latency low and operators in control.
              </p>
              <p>
                When I tackle an unfamiliar problem, I start by isolating where the feedback loop breaks. In post-operative surgical monitoring (<Link href="/projects/healios" className="text-[#FFB86C] hover:text-[#FF6B2B] underline underline-offset-4 transition-colors">Healios V2</Link>), clinicians needed transparent diagnostics rather than opaque scores. I vectorized a NumPy image-processing pipeline to compute visual gradient saliency maps in 8.09ms, and built an in-browser HTML5 Canvas Laplacian filter to catch blurred photographs in under 35ms before upload.
              </p>
            </div>
          </div>

          {/* Flush Bottom Architectural Bay: Healios LiDAR Depth Calibration Specimen Plate */}
          <div className="pt-8 border-t border-[#F4EFE6]/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
              <span>SPECIMEN FIG 01.1 — SUB-MILLIMETER LIDAR MESH CALIBRATION</span>
              <span className="text-[#FFB86C] tabular-nums">LATENCY 8.09ms</span>
            </div>

            <div className="relative w-full aspect-[21/9] bg-[#0C1729] border border-[#F4EFE6]/10 overflow-hidden">
              <Image
                src="/healios.png"
                alt="Healios V2 Clinical CV & LiDAR Depth Mesh Architecture"
                fill
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover object-center filter contrast-105"
              />
              <div className="absolute top-3 right-3 bg-[#07090D]/90 px-3 py-1 text-[11px] font-mono text-[#FFE9AE] border border-[#F4EFE6]/15">
                <span>Vectorized Saliency: 8.09ms</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#8A99AD] pt-1">
              <span>Stereoscopic point-cloud filtered with bilateral mesh smoothing.</span>
              <span className="text-[#FFB86C] font-semibold">±0.08mm verified elevation margin</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
