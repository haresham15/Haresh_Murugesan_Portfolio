import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BlurText } from './ui/ReactBitsControls';
import { ThermalApertureFallback } from './ThermalApertureCanvas';
import { GridCrosshair } from './ui/GridCrosshair';

const ThermalApertureCanvas = dynamic(
  () => import('./ThermalApertureCanvas').then((mod) => mod.ThermalApertureCanvas),
  {
    ssr: false,
    loading: () => <ThermalApertureFallback />,
  }
);

export const BentoHero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#07090D] border-b border-[#F4EFE6]/10"
      aria-label="Architectural Stage and Introduction"
    >
      {/* 1. Volumetric 3D Stage & WebGL Lamellar Louvre Array */}
      <ThermalApertureCanvas />

      {/* 2. Top Architectural Header Bar (Flush 1px Swiss Hairline System) */}
      <div className="relative z-20 w-full border-b border-[#F4EFE6]/10 h-16 px-6 sm:px-8 flex items-center justify-between bg-[#07090D]/90 backdrop-blur-md">
        <div className="flex items-center gap-4 text-xs font-mono tracking-[0.16em] uppercase text-[#F4EFE6]">
          <span className="font-semibold text-[#FFB86C]">HARESH MURUGESAN</span>
          <span className="text-[#F4EFE6]/30">{'//'}</span>
          <span className="text-[#8A99AD] hidden sm:inline">COLUMBUS, OH · MAY 2028</span>
        </div>

        {/* Flush Architectural Grid Links with 1px Hairlines */}
        <nav className="h-full hidden md:flex items-center text-xs font-mono tracking-wider">
          <Link
            href="#projects"
            className="h-full px-6 flex items-center border-l border-[#F4EFE6]/10 text-[#C4CDD8] hover:text-[#FFB86C] hover:bg-[#0C1729] transition-colors"
          >
            Works
          </Link>
          <Link
            href="#experience"
            className="h-full px-6 flex items-center border-l border-[#F4EFE6]/10 text-[#C4CDD8] hover:text-[#FFB86C] hover:bg-[#0C1729] transition-colors"
          >
            Experience
          </Link>
          <Link
            href="#podcast"
            className="h-full px-6 flex items-center border-l border-[#F4EFE6]/10 text-[#C4CDD8] hover:text-[#FFB86C] hover:bg-[#0C1729] transition-colors"
          >
            Syntinuum
          </Link>
          <Link
            href="#skills"
            className="h-full px-6 flex items-center border-l border-[#F4EFE6]/10 text-[#C4CDD8] hover:text-[#FFB86C] hover:bg-[#0C1729] transition-colors"
          >
            Technical Index
          </Link>
          <a
            href="/Haresh_Murugesan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="h-full px-6 flex items-center border-l border-[#F4EFE6]/10 text-[#FFB86C] hover:text-[#FFE9AE] hover:bg-[#0C1729] transition-colors font-medium"
          >
            Résumé ↗
          </a>
        </nav>

        {/* Precision Crosshair Fiducial at Top-Right */}
        <GridCrosshair className="absolute -bottom-[4.5px] right-6 sm:right-8" />
      </div>

      {/* 3. Hero Main Blueprint Grid: Upper-Left Diagonal Title + Lower-Right Spec Sheet */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 my-auto">
        
        {/* UPPER-LEFT: Authoritative Diagonal Title Stage (-8deg Desktop, 0deg Mobile) */}
        <div className="max-w-4xl pt-6 sm:pt-10">
          <div className="origin-left transform transition-transform duration-500 rotate-0 md:-rotate-[8deg]">
            {/* Super-Header Telemetry Rail */}
            <div className="inline-flex items-center gap-3 text-xs font-mono tracking-[0.18em] uppercase text-[#FFB86C] mb-6">
              <span className="w-2.5 h-[1.5px] bg-[#FF6B2B] shrink-0" />
              <span>00 // RESEARCH &amp; SYSTEMS ARCHITECTURE</span>
            </div>

            {/* Monumental Display Headline in Geist Serif Triangle */}
            <h1 className="font-serif font-normal text-[#F4EFE6] text-[3.2rem] sm:text-[4.75rem] lg:text-[6.2rem] leading-[0.95] tracking-[-0.03em] drop-shadow-[0_16px_40px_rgba(7,9,13,0.95)]">
              <span className="block text-[#F4EFE6]">
                <BlurText text="Curious about intelligence." />
              </span>
              <span className="block italic text-[#FFE9AE] mt-3 sm:mt-5 pl-0 sm:pl-8 md:pl-16 font-serif">
                <BlurText text="Obsessed with making it work." delay={0.06} />
              </span>
            </h1>
          </div>
        </div>

        {/* LOWER-RIGHT ARCHITECTURAL SPEC SHEET & FLUSH ACTION CELLS */}
        <div className="w-full flex justify-end mt-12 sm:mt-16">
          <div className="w-full max-w-[560px] bg-[#07090D]/90 backdrop-blur-md border-t border-l border-[#F4EFE6]/12 relative">
            {/* Corner Crosshair Fiducials */}
            <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
            <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

            {/* Editorial Positioning Cell */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A99AD] uppercase tracking-wider">
                <span>SPEC // 00.1 POSITIONING</span>
                <span className="text-[#FFB86C]">OHIO STATE (AI SPEC)</span>
              </div>
              <p className="text-[16px] sm:text-[17px] text-[#C4CDD8] font-sans leading-[1.65] font-normal">
                Computer Science &amp; Engineering researcher and builder at The Ohio State University architecting 3D clinical vision pipelines, deterministic simulation engines, and spatial telemetry architectures.
              </p>
            </div>

            {/* Flush Architectural CTA Bar (Zero-Radius 0px Cells with Shared 1px Hairline) */}
            <div className="flex items-stretch border-t border-[#F4EFE6]/12 text-xs font-mono">
              <Link
                href="#projects"
                className="flex-1 bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold px-6 sm:px-8 py-5 flex items-center justify-between transition-colors select-none group"
              >
                <span>Explore Selected Works</span>
                <span className="text-base group-hover:translate-y-0.5 transition-transform">↓</span>
              </Link>
              <a
                href="/Haresh_Murugesan_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#0C1729] hover:bg-[#132542] text-[#F4EFE6] border-l border-[#F4EFE6]/15 px-6 sm:px-8 py-5 flex items-center justify-between transition-colors select-none font-medium group"
              >
                <span>Curriculum Vitae (PDF)</span>
                <span className="text-sm text-[#FFB86C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Architectural Datum Line */}
      <div className="relative z-10 w-full h-11 border-t border-[#F4EFE6]/10 px-6 sm:px-8 flex items-center justify-between text-xs font-mono text-[#8A99AD] bg-[#07090D]/95">
        <div className="flex items-center gap-3">
          <span className="text-[#FFB86C]">00</span>
          <span>LATENCY // DETERMINISM // VERIFIABLE BENCHMARKS</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>SCROLL PROGRESS 00%</span>
          <span className="text-[#FF6B2B]">● VERIFIED CLIENT RUNTIME</span>
        </div>
      </div>
    </section>
  );
};

export default BentoHero;
