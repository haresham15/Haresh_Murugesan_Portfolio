import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import { ContactFooter } from '@/components/ContactFooter';
import ForgedCarbonCanvas from '@/components/ForgedCarbonCanvas';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export default function DesignSystemPage() {
  const { mode, toggleRecruiterMode, activeHeroLayer } = usePortfolioStore();

  const colorSwatches = [
    { name: 'Midnight Obsidian', token: '--bg-midnight', value: '#03050A', role: 'Primary page canvas matrix' },
    { name: 'Deep Midnight Surface', token: '--bg-obsidian', value: '#060A12', role: 'Secondary depth layer' },
    { name: 'Dark Cobalt Blue', token: '--cobalt-deep', value: '#0B1E40', role: 'Ambient structural depth' },
    { name: 'Electric Cobalt', token: '--cobalt-electric', value: '#2563EB', role: 'Blueprints, telemetry links' },
    { name: 'Sharp Reddish-Orange', token: '--accent-red-orange', value: '#FF2800', role: 'Primary focal accent (Rosso/McLaren)' },
    { name: 'Crimson Glow', token: '--accent-crimson-glow', value: '#FF4419', role: 'Secondary active glow, FIA apex curbs' },
    { name: 'Machined Metallic Silver', token: '--metal-silver', value: '#C8D2E0', role: 'Precision typography & rim highlights' },
    { name: 'Brushed Titanium', token: '--metal-titanium', value: '#7E8B9B', role: 'Secondary metadata & drafting lines' },
    { name: 'Crisp Alabaster White', token: '--text-primary', value: '#F4F6F9', role: 'Editorial serif headlines' },
  ];

  const typographyScales = [
    { label: 'Display Hero', font: 'Raleway', size: 'clamp(3.75rem, 6.8vw, 7.25rem)', weight: '700', sample: 'Curious about intelligence.' },
    { label: 'H1 Section', font: 'Newsreader', size: 'clamp(2.5rem, 4.5vw, 4rem)', weight: '400', sample: 'Obsessed with making it work.' },
    { label: 'H2 Card Title', font: 'Fraunces', size: '1.75rem (28px)', weight: '600', sample: 'Healios V2 — Multimodal Post-Op' },
    { label: 'Body Primary', font: 'IBM Plex Sans', size: '1rem (16px)', weight: '400', sample: 'Architecting high-concurrency simulation kernels and clinical explainability pipelines.' },
    { label: 'Code / Metric Mono', font: 'Geist Mono', size: '0.875rem (14px)', weight: '500', sample: 'Grad-CAM Saliency: 8.09 ms (vectorized NumPy linear Jet)' },
  ];

  return (
    <>
      <Head>
        <title>Living Design System | Haresh Murugesan</title>
        <meta
          name="description"
          content="Design token architecture, DTCG specifications, typography scale, and accessible component library for hareshmurugesan.com."
        />
        <link rel="canonical" href="https://hareshmurugesan.com/system" />
        <meta property="og:title" content="Living Design System | Haresh Murugesan" />
        <meta property="og:description" content="DTCG tokens, color swatches, typography hierarchy, and evidence primitives." />
        <meta property="og:url" content="https://hareshmurugesan.com/system" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Living Design System | Haresh Murugesan" />
        <meta name="twitter:description" content="DTCG tokens, color swatches, typography hierarchy, and evidence primitives." />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />
      </Head>

      <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-hidden flex flex-col selection:bg-[#FF2800] selection:text-[#03050A] relative">
        <ForgedCarbonCanvas />
        <Header />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24 relative z-10">
          
          {/* Header */}
          <div className="mb-12 pb-6 border-b border-[#18458B]/20 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#060A12] border border-[#FF2800]/30 text-xs font-mono text-[#FF2800] mb-4">
              <span>DTCG Three-Tier Ground Truth</span>
              <span>·</span>
              <span>V3.0 High-Contrast Motorsport System</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#F4F6F9] tracking-tight mb-3">
              Living Design System
            </h1>
            <p className="text-base font-sans text-[#7E8B9B] leading-relaxed">
              Deterministic token hierarchy, accessible contrast ratios, and evidence primitives powering <code className="text-[#FF2800]">hareshmurugesan.com</code>. Traces back to <code className="text-[#F4F6F9]">design/tokens.json</code> with zero magic numbers.
            </p>
          </div>

          {/* Current Motion & Mode Store State */}
          <section className="mb-16 p-6 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm shadow-2xl">
            <h2 className="text-lg font-raleway font-bold text-[#F4F6F9] mb-4 flex items-center justify-between">
              <span>Zustand Global State Store Status</span>
              <span className="text-xs font-mono text-[#2563EB]">src/store/usePortfolioStore.ts</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-[2px] bg-[#03050A] border border-[#18458B]/20">
                <span className="text-[#7E8B9B] block mb-1">Active Portfolio Mode:</span>
                <span className="text-[#F4F6F9] font-bold text-sm">{mode.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={toggleRecruiterMode}
                  className="mt-3 block w-full px-3 py-1.5 rounded-[2px] bg-[#060A12] hover:bg-[#0B1E40]/40 text-center text-[#FF2800] border border-[#18458B]/30 transition-colors cursor-pointer"
                >
                  Toggle Recruiter Mode
                </button>
              </div>

              <div className="p-4 rounded-[2px] bg-[#03050A] border border-[#18458B]/20">
                <span className="text-[#7E8B9B] block mb-1">Active Hero Layer:</span>
                <span className="text-[#F4F6F9] font-bold text-sm">{activeHeroLayer.toUpperCase()}</span>
                <p className="text-[11px] text-[#7E8B9B] mt-2">
                  Controls ballistic 45° ASCII Lightbulb &amp; DNA filament illumination.
                </p>
              </div>

              <div className="p-4 rounded-[2px] bg-[#03050A] border border-[#18458B]/20">
                <span className="text-[#7E8B9B] block mb-1">WebGL State &amp; Canvas Pipeline:</span>
                <span className="text-[#10B981] font-bold text-sm">GPU PROCEDURAL FORGED CARBON</span>
                <p className="text-[11px] text-[#7E8B9B] mt-2">
                  High-DPI Voronoi marbling with dynamic anisotropic glint.
                </p>
              </div>
            </div>
          </section>

          {/* Color Tokens Palette */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-[#F4F6F9] mb-2 tracking-tight">
              Color Token System
            </h2>
            <p className="text-sm font-sans text-[#7E8B9B] mb-6">
              Semantic color mapping designed for high readability, WCAG 2.2 AA contrast, and zero AI-slop neon gradients.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorSwatches.map((swatch) => (
                <div
                  key={swatch.token}
                  className="p-4 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-[2px] shrink-0 border border-[#18458B]/30 shadow-inner"
                    style={{ backgroundColor: swatch.value }}
                  />
                  <div>
                    <p className="text-sm font-raleway font-bold text-[#F4F6F9]">{swatch.name}</p>
                    <p className="text-xs font-mono text-[#2563EB]">{swatch.value}</p>
                    <p className="text-[11px] font-mono text-[#7E8B9B] mt-0.5">{swatch.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography Hierarchy */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-[#F4F6F9] mb-2 tracking-tight">
              Typography Scale &amp; Hierarchy
            </h2>
            <p className="text-sm font-sans text-[#7E8B9B] mb-6">
              Editorial typography pairing: Raleway &amp; Serif for monumental headlines, IBM Plex Sans for body readability, and Geist Mono for metrics and telemetry.
            </p>

            <div className="space-y-4">
              {typographyScales.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#7E8B9B]">
                    <span className="text-[#FF2800] font-semibold">{item.label}</span>
                    <span>{item.font} · {item.size} · Weight {item.weight}</span>
                  </div>
                  <p
                    className="text-[#F4F6F9]"
                    style={{
                      fontFamily: item.font,
                      fontSize: item.size.includes('clamp') ? '2rem' : item.size.split(' ')[0],
                      fontWeight: Number(item.weight),
                    }}
                  >
                    {item.sample}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Evidence Badge Primitives */}
          <section className="mb-16 p-6 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25">
            <h2 className="text-2xl font-serif font-bold text-[#F4F6F9] mb-2 tracking-tight">
              Evidence Badge Primitives
            </h2>
            <p className="text-sm font-sans text-[#7E8B9B] mb-6">
              Every metric badge has an interactive hover/focus tooltip that reveals test methodology, hardware environment, sample size, and verified bounds.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <EvidenceBadge evidenceId="healios-xai-saliency" />
              <EvidenceBadge evidenceId="tempo-crisis-recall" />
              <EvidenceBadge evidenceId="apexis-60fps-sim" />
              <EvidenceBadge evidenceId="routerx-careline-transit-gap" />
              <EvidenceBadge evidenceId="tamiltrove-hit5" />
            </div>
          </section>

        </main>

        <ContactFooter />
      </div>
    </>
  );
}
