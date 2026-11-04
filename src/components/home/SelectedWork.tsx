import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { flagshipProjects } from '@/content/projects';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { usePortfolioStore } from '@/store/usePortfolioStore';

const ApexisDemo = dynamic(() => import('@/setpieces/ApexisDemo').then((m) => m.ApexisDemo), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs font-mono text-[#A6ADB8]">Loading Apexis Simulator...</div>,
});

const HealiosDemo = dynamic(() => import('@/setpieces/HealiosDemo').then((m) => m.HealiosDemo), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs font-mono text-[#A6ADB8]">Loading Healios Lens...</div>,
});

const TempoDemo = dynamic(() => import('@/setpieces/TempoDemo').then((m) => m.TempoDemo), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs font-mono text-[#A6ADB8]">Loading Tempo Space...</div>,
});

const RouteRxDemo = dynamic(() => import('@/setpieces/RouteRxDemo').then((m) => m.RouteRxDemo), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-xs font-mono text-[#A6ADB8]">Loading RouteRx Optimizer...</div>,
});

export const SelectedWork: React.FC = () => {
  const { mode } = usePortfolioStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const [viewModes, setViewModes] = useState<Record<string, 'interactive' | 'static'>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleView = (slug: string, target: 'interactive' | 'static') => {
    setViewModes((prev) => ({ ...prev, [slug]: target }));
  };

  const renderInteractiveDemo = (slug: string) => {
    switch (slug) {
      case 'apexis':
        return <ApexisDemo />;
      case 'healios':
        return <HealiosDemo />;
      case 'tempo':
        return <TempoDemo />;
      case 'routerx-careline':
        return <RouteRxDemo />;
      default:
        return null;
    }
  };
  return (
    <section id="projects" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-2">
            Flagship Engineering Systems
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
            Selected Work
          </h2>
        </div>
        <p className="text-sm font-sans text-[#A6ADB8] max-w-md">
          Four production-grade systems spanning explainable computer vision, high-concurrency simulation, emotional safety buffers, and geospatial transit optimization.
        </p>
      </div>

      {/* Alternating Flagship Cards */}
      <div className="space-y-12 sm:space-y-20">
        {flagshipProjects.map((project, idx) => {
          const isEven = idx % 2 === 0;
          const coreTech = project.stack.split(',').slice(0, 3).map((s) => s.trim());

          return (
            <article
              key={project.slug}
              className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0D1118]/90 border border-white/10 shadow-token-card hover:border-[#7DD3FC]/40 hover:shadow-token-card-hover transition-all duration-300 relative overflow-hidden group/card"
            >
              {/* Subtle Ambient Card Glow (godly / getlayers aesthetic) */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#7DD3FC]/[0.03] rounded-full blur-3xl pointer-events-none group-hover/card:bg-[#7DD3FC]/[0.08] transition-all duration-500" />
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                
                {/* TEXT CONTENT (Desktop: 6 cols, Mobile: First) */}
                <div className={`lg:col-span-6 flex flex-col justify-center ${isEven ? '' : 'lg:col-start-7'}`}>
                  
                  {/* Category & Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#A6ADB8]">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#7DD3FC]/10 border border-[#7DD3FC]/30 text-[#7DD3FC] font-medium">
                      {project.statusBadge}
                    </span>
                    <span className="text-xs font-mono text-[#A6ADB8] ml-auto">
                      {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 tracking-tight">
                    {project.title}
                  </h3>

                  {/* Role Subheading */}
                  <p className="text-xs font-mono text-[#D8B4FE] mb-4">
                    Role: {project.role}
                  </p>

                  {/* 1-Sentence Problem Statement */}
                  <p className="text-sm sm:text-base font-sans text-[#E0E0E0] leading-relaxed mb-6">
                    {project.caseStudy.problem}
                  </p>

                  {/* Core Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {coreTech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[#A6ADB8]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Evidence Metric Badge & Case Study Link */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                    {project.primaryEvidenceId && (
                      <EvidenceBadge evidenceId={project.primaryEvidenceId} />
                    )}

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold text-[#7DD3FC] hover:text-white transition-colors ml-auto"
                    >
                      <span>Read Case Study</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </Link>
                  </div>

                </div>

                {/* SPRINT 2 ARCHITECTURAL SET-PIECE / INTERACTIVE PROOF (Desktop: 6 cols) */}
                <div className={`lg:col-span-6 w-full ${isEven ? '' : 'lg:col-start-1'}`}>
                  {(() => {
                    const isInteractive = mounted && mode !== 'recruiter' && (viewModes[project.slug] ?? 'interactive') === 'interactive';
                    const hasInteractiveDemo = ['apexis', 'healios', 'tempo', 'routerx-careline'].includes(project.slug);

                    if (isInteractive && hasInteractiveDemo) {
                      return (
                        <div className="w-full flex flex-col gap-2">
                          <div className="flex items-center justify-between px-2 text-xs font-mono text-[#A6ADB8]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                              <span className="text-white font-medium">Live Architecture Telemetry</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleView(project.slug, 'static')}
                              className="text-[11px] text-[#A6ADB8] hover:text-[#7DD3FC] underline transition-colors"
                            >
                              Switch to Static View
                            </button>
                          </div>
                          {renderInteractiveDemo(project.slug)}
                        </div>
                      );
                    }

                    return (
                      <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#050505] p-4 sm:p-6 relative group">
                        {/* Architectural Preview Header */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-mono text-[#A6ADB8]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                            <span className="text-[#E0E0E0]">Architecture Preview</span>
                          </div>
                          {hasInteractiveDemo && mode !== 'recruiter' && (
                            <button
                              type="button"
                              onClick={() => toggleView(project.slug, 'interactive')}
                              className="text-[11px] text-[#7DD3FC] hover:text-white underline font-semibold transition-colors"
                            >
                              Run Live Simulation →
                            </button>
                          )}
                        </div>

                        {/* Screenshot / C4 Preview Slot */}
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={project.title}
                              width={800}
                              height={500}
                              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center text-[#A6ADB8]">
                              <span className="font-mono text-xs uppercase mb-1">C4 Architectural Node</span>
                              <span className="text-sm font-sans">{project.caseStudy.executiveSummary}</span>
                            </div>
                          )}

                          {/* Hover Overlay with Action Links */}
                          <div className="absolute inset-0 bg-[#050505]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                            {project.demo && (
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-[#7DD3FC] text-[#050505] text-xs font-sans font-semibold hover:bg-white transition-colors"
                              >
                                Live Demo ↗
                              </a>
                            )}
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-sans font-medium hover:bg-white/20 border border-white/10 transition-colors"
                              >
                                GitHub ↗
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Footer Highlights */}
                        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#A6ADB8]">
                          <span>{project.highlight}</span>
                          <span className="text-[#34D399]">Deterministic Evidence Verified</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </article>
          );
        })}
      </div>

    </section>
  );
};

export default SelectedWork;

