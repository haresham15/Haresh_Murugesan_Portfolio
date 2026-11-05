import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SectionContainer } from './ui/SectionContainer';
import { ResearchArtifact, GridCrosshair } from './ui/EditorialPrimitives';
import { ScrollReveal } from './ui/ReactBitsControls';

export const AboutSection: React.FC = () => {
  return (
    <SectionContainer
      id="about"
      variant="editorial"
      bgMode="clean"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="About and engineering thesis"
    >
      {/* Primary Composition: 40% Portrait / 60% Narrative Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left 40% Column: Architectural Blueprint Framed Portrait */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative w-full aspect-[4/5] bg-[#070B12] border border-[#F3EFE7]/[0.12] rounded-[2px] overflow-hidden group shadow-[0_4px_24px_rgba(7,11,18,0.7)]">
            {/* Precision Blueprint Corner Fiducials */}
            <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
            <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#82B7FF]" />
            <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
            <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-40 text-[#82B7FF]" />

            {/* Corner CAD Ticks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#82B7FF]/40 z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#82B7FF]/40 z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#82B7FF]/40 z-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#82B7FF]/40 z-20 pointer-events-none" />

            <Image
              src="/profile.jpeg"
              alt="Haresh Murugesan in Columbus, OH"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              priority
              className="object-cover object-top filter contrast-[1.04] grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            
            {/* Ambient vignette */}
            <div className="pointer-events-none absolute inset-0 opacity-30 bg-gradient-to-t from-[#070B12] via-transparent to-transparent z-10" />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#A7B2C3] border-t border-[#F3EFE7]/[0.06] pt-4">
            <span className="text-[#F3EFE7] font-medium tracking-wide">HARESH MURUGESAN</span>
            <span className="text-[#F5D998]">B.S. CSE · THE OHIO STATE UNIVERSITY</span>
          </div>
        </div>

        {/* Right 60% Column: Statement + Single Readable Prose Column (55–70ch) */}
        <div className="lg:col-span-7 space-y-8 lg:pl-4">
          {/* Focal Lead Statement with Hero-style Raleway + Serif Italic Accent */}
          <ScrollReveal>
            <h2 className="text-[2.25rem] sm:text-[2.85rem] lg:text-[3.35rem] text-[#F3EFE7] leading-[1.08] tracking-[-0.025em]">
              <span className="font-raleway font-bold">I build software where computational speed meets real-world </span>
              <span className="font-serif italic font-normal text-[#F5D998]">physical and human systems.</span>
            </h2>
          </ScrollReveal>

          {/* Single Readable Prose Column (Never split into narrow text) */}
          <div className="max-w-[65ch] space-y-6 text-[16px] sm:text-[17px] font-sans text-[#A7B2C3] leading-[1.75]">
            <p>
              I focus on the engineering seam between complex data pipelines and high-reliability systems. Too much modern software relies on bloated cloud abstractions and unverified assumptions. My approach centers on performance, deterministic verification, and client-side architectures that keep latency low and operators in control.
            </p>
            <p>
              When I tackle an unfamiliar problem, I start by isolating where the feedback loop breaks. In post-operative surgical monitoring (<Link href="/projects/healios" className="text-[#FF6B35] hover:text-[#F5D998] underline underline-offset-4 transition-colors font-medium">Healios V2</Link>), clinicians needed transparent diagnostics rather than opaque scores. I vectorized a NumPy image-processing pipeline to compute visual gradient saliency maps in 8.09ms, and built an in-browser HTML5 Canvas Laplacian filter to catch blurred photographs in under 35ms before upload.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono">
            <Link
              href="#experience"
              className="px-5 py-3 bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-semibold rounded-[2px] transition-colors inline-flex items-center gap-2 select-none shadow-[0_0_15px_rgba(255,107,53,0.25)]"
            >
              <span>Explore Verified Experience</span>
              <span>↓</span>
            </Link>
            <Link
              href="/about"
              className="px-5 py-3 bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] transition-colors inline-flex items-center gap-2 select-none"
            >
              <span>Full Leadership Profile</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>

      {/* 3. Separate Dedicated Research Artifact Module (96px–144px Below) */}
      <div className="mt-24 sm:mt-32 lg:mt-36">
        <ResearchArtifact
          title="Clinical Saliency &amp; LiDAR Mesh Calibration"
          figureNumber="RESEARCH FIG 01.1"
          metricLabel="Saliency Latency"
          metricValue="8.09ms"
          caption="Healios V2 clinical computer vision plate"
          explanation="Stereoscopic point-cloud filtered with bilateral mesh smoothing and NumPy vectorized Grad-CAM heatmaps, delivering ±0.08mm verified elevation margin."
          imageSrc="/healios.png"
          imageAlt="Healios V2 3D mesh calibration and Grad-CAM saliency map"
          projectHref="/projects/healios"
        />
      </div>
    </SectionContainer>
  );
};

export default AboutSection;
