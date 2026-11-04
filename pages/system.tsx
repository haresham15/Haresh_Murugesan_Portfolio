import React from 'react';
import Head from 'next/head';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { tokens } from '@/tokens/index';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export default function DesignSystemPage() {
  const { mode, toggleRecruiterMode, activeHeroLayer } = usePortfolioStore();

  const colorSwatches = [
    { name: 'Base Background', token: '--bg-base', value: '#050505', role: 'Default canvas surface' },
    { name: 'Raised Surface', token: '--bg-surface', value: '#0D1118', role: 'Card containers & navigation chrome' },
    { name: 'Raised Surface Subtle', token: '--bg-surface-raised', value: '#141A23', role: 'Active hover & elevation' },
    { name: 'Primary Ink', token: '--text-primary', value: '#E0E0E0', role: 'Headings, active copy' },
    { name: 'Muted Ink', token: '--text-muted', value: '#A6ADB8', role: 'Subtitles, metadata, captions' },
    { name: 'Signal Lavender', token: '--signal-lavender', value: '#D8B4FE', role: 'Conceptual & AI/ML telemetry' },
    { name: 'Signal Pale Blue', token: '--signal-blue', value: '#7DD3FC', role: 'Systems, actions & active focus' },
    { name: 'Signal Emerald', token: '--signal-emerald', value: '#34D399', role: 'Success, active status, research' },
    { name: 'Signal Amber', token: '--signal-amber', value: '#FBBF24', role: 'Constraints & warnings' },
  ];

  const typographyScales = [
    { label: 'Display Hero', font: 'Space Grotesk', size: 'clamp(2.25rem, 5vw, 5.5rem)', weight: '700', sample: 'Ideas, resolved into systems.' },
    { label: 'H1 Section', font: 'Space Grotesk', size: '2.5rem (40px)', weight: '700', sample: 'Selected Engineering Work' },
    { label: 'H2 Card Title', font: 'Space Grotesk', size: '1.75rem (28px)', weight: '700', sample: 'Healios V2 — Multimodal Post-Op' },
    { label: 'Body Primary', font: 'Inter', size: '1rem (16px)', weight: '400', sample: 'Postoperative surgical site infections account for up to 20% of unplanned 30-day hospital readmissions.' },
    { label: 'Code / Metric Mono', font: 'JetBrains Mono', size: '0.875rem (14px)', weight: '500', sample: 'Grad-CAM Saliency: 8.09 ms (vectorized NumPy linear Jet)' },
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
        <meta property="og:image" content="https://hareshmurugesan.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Living Design System | Haresh Murugesan" />
        <meta name="twitter:description" content="DTCG tokens, color swatches, typography hierarchy, and evidence primitives." />
        <meta name="twitter:image" content="https://hareshmurugesan.com/og-image.png" />
      </Head>

      <div className="w-full min-h-screen bg-[#050505] text-[#E0E0E0] overflow-x-hidden flex flex-col">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
          
          {/* Header */}
          <div className="mb-12 pb-6 border-b border-white/10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-xs font-mono text-[#7DD3FC] mb-4">
              <span>DTCG Three-Tier Ground Truth</span>
              <span>·</span>
              <span>Sprint 1 Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight mb-3">
              Living Design System
            </h1>
            <p className="text-base font-sans text-[#A6ADB8] leading-relaxed">
              Deterministic token hierarchy, accessible contrast ratios, and evidence primitives powering <code className="text-[#7DD3FC]">hareshmurugesan.com</code>. Traces back to <code className="text-white">design/tokens.json</code> with zero magic numbers.
            </p>
          </div>

          {/* Current Motion & Mode Store State */}
          <section className="mb-16 p-6 rounded-3xl bg-[#0D1118] border border-white/10 shadow-token-card">
            <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center justify-between">
              <span>Zustand Global State Store Status</span>
              <span className="text-xs font-mono text-[#7DD3FC]">src/store/usePortfolioStore.ts</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A6ADB8] block mb-1">Active Portfolio Mode:</span>
                <span className="text-white font-bold text-sm">{mode.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={toggleRecruiterMode}
                  className="mt-3 block w-full px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-center text-[#7DD3FC] transition-colors"
                >
                  Toggle Recruiter Mode
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A6ADB8] block mb-1">Active Hero Layer:</span>
                <span className="text-white font-bold text-sm">{activeHeroLayer.toUpperCase()}</span>
                <p className="text-[11px] text-[#A6ADB8] mt-2">
                  Controls Signal-to-System isometric cube wireframe illumination.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[#A6ADB8] block mb-1">WebGL State & Error Boundary:</span>
                <span className="text-[#34D399] font-bold text-sm">PROTECTED BY SCENEBOUNDARY</span>
                <p className="text-[11px] text-[#A6ADB8] mt-2">
                  Auto-falls back to static SVG posters on context loss.
                </p>
              </div>
            </div>
          </section>

          {/* Color Tokens Palette */}
          <section className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-white mb-2 tracking-tight">
              Color Token System
            </h2>
            <p className="text-sm font-sans text-[#A6ADB8] mb-6">
              Semantic color mapping designed for high readability, WCAG 2.2 AA contrast, and zero AI-slop neon gradients.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorSwatches.map((swatch) => (
                <div
                  key={swatch.token}
                  className="p-4 rounded-2xl bg-[#0D1118] border border-white/10 flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl shrink-0 border border-white/10 shadow-inner"
                    style={{ backgroundColor: swatch.value }}
                  />
                  <div>
                    <p className="text-sm font-heading font-bold text-white">{swatch.name}</p>
                    <p className="text-xs font-mono text-[#7DD3FC]">{swatch.value}</p>
                    <p className="text-[11px] font-mono text-[#A6ADB8] mt-0.5">{swatch.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography Hierarchy */}
          <section className="mb-16">
            <h2 className="text-2xl font-heading font-bold text-white mb-2 tracking-tight">
              Typography Scale & Hierarchy
            </h2>
            <p className="text-sm font-sans text-[#A6ADB8] mb-6">
              Three-font typographic system: Space Grotesk (headings), Inter (body readability), and JetBrains Mono (metrics and telemetry).
            </p>

            <div className="space-y-4">
              {typographyScales.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0D1118] border border-white/10 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#A6ADB8]">
                    <span className="text-[#7DD3FC] font-semibold">{item.label}</span>
                    <span>{item.font} · {item.size} · Weight {item.weight}</span>
                  </div>
                  <p
                    className="text-white"
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
          <section className="mb-16 p-6 rounded-3xl bg-[#0D1118] border border-white/10">
            <h2 className="text-2xl font-heading font-bold text-white mb-2 tracking-tight">
              Evidence Badge Primitives
            </h2>
            <p className="text-sm font-sans text-[#A6ADB8] mb-6">
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

        <SiteFooter />
      </div>
    </>
  );
}

