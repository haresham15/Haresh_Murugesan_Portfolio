import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { allProjects, Project } from '@/content/projects';

// ---------------------------------------------------------------------------
// RABBIT-HOLE TAXONOMY CONTRACTS
// ---------------------------------------------------------------------------

export type CorePortalId = 'core-backend' | 'core-frontend';

export interface DomainModule {
  id: string;
  coreId: CorePortalId;
  label: string;
  tagline: string;
  accentColor: string;
  projectSlugs: string[];
}

export const DOMAIN_MODULES: DomainModule[] = [
  // Backend Core Domains (10 Systems Total)
  {
    id: 'domain-cv-lidar',
    coreId: 'core-backend',
    label: 'Computer Vision & Clinical LiDAR',
    tagline: '8.09ms Grad-CAM Saliency, 3D LiDAR topography, and histological AI',
    accentColor: '#FF2800',
    projectSlugs: ['healios', 'cv-allergy-wheal', 'digital-pathology-wsi'],
  },
  {
    id: 'domain-search-nlp',
    coreId: 'core-backend',
    label: 'Hybrid Search & NLP Retrieval',
    tagline: '94.2% Hit@5 FAISS dense embeddings and hybrid BM25 pipelines',
    accentColor: '#FF4419',
    projectSlugs: ['tamiltrove', 'tutormatch', 'vantage-ai'],
  },
  {
    id: 'domain-spatial-ml',
    coreId: 'core-backend',
    label: 'Spatial Econometrics & ML',
    tagline: '<15ms OSRM transit isochrones and multi-state spatial regression',
    accentColor: '#2563EB',
    projectSlugs: ['routerx-careline-hub', 'cs50-ai-projects'],
  },
  {
    id: 'domain-serverless-cloud',
    coreId: 'core-backend',
    label: 'Cloud & Autonomous Pipelines',
    tagline: 'AWS Lambda, DynamoDB microservices, and formal Java algorithms',
    accentColor: '#C8D2E0',
    projectSlugs: ['software-2-projects', 'software-1-projects'],
  },

  // Frontend Core Domains (8 Systems Total)
  {
    id: 'domain-spatial-3d',
    coreId: 'core-frontend',
    label: '3D Spatial & Geospatial UI',
    tagline: 'Hardware-accelerated Deck.GL 3D urban market simulations',
    accentColor: '#2563EB',
    projectSlugs: ['nyc-housing-market-ai', 'philocracy', 'carstomer'],
  },
  {
    id: 'domain-telemetry-ui',
    coreId: 'core-frontend',
    label: 'Real-Time Telemetry & Simulators',
    tagline: '60 FPS dedicated Web Workers and off-main-thread physics',
    accentColor: '#FF2800',
    projectSlugs: ['apexis', 'tempo'],
  },
  {
    id: 'domain-media-streaming',
    coreId: 'core-frontend',
    label: 'Media, Brand & Productivity Platforms',
    tagline: 'Continuous Web Audio DSP, DTCG design tokens, and static SSG',
    accentColor: '#C8D2E0',
    projectSlugs: ['syntinuum-podcast-website', 'murugesan-rajaram-lab', 'momwebsite'],
  },
];

export const SystemsCodeGraph: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // View Mode: 'rabbit-hole' vs 'constellation'
  const [viewMode, setViewMode] = useState<'rabbit-hole' | 'constellation'>('rabbit-hole');

  // Rabbit-Hole Navigation State: activePath = [tier1, tier2, tier3]
  const [activeDepth, setActiveDepth] = useState<0 | 1 | 2 | 3>(0);
  const [selectedCoreId, setSelectedCoreId] = useState<CorePortalId | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  // Camera Translation
  const [camX, setCamX] = useState<number>(0);
  const targetCamX = useRef<number>(0);

  // Fast Project Map
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    allProjects.forEach((p) => {
      map.set(p.slug, p);
      if (p.aliases) {
        p.aliases.forEach((alias) => map.set(alias, p));
      }
    });
    return map;
  }, []);

  // Update target camera X based on active rabbit-hole depth
  useEffect(() => {
    if (activeDepth === 0) targetCamX.current = 0;
    else if (activeDepth === 1) targetCamX.current = -420;
    else if (activeDepth === 2) targetCamX.current = -880;
    else if (activeDepth === 3) targetCamX.current = -1240;
  }, [activeDepth]);

  // Smooth camera interpolation RAF loop (duration: 650ms easing)
  useEffect(() => {
    let animId: number;
    const lerpCamera = () => {
      setCamX((prev) => {
        const dx = targetCamX.current - prev;
        if (Math.abs(dx) < 0.25) return targetCamX.current;
        return prev + dx * 0.10;
      });
      animId = requestAnimationFrame(lerpCamera);
    };
    animId = requestAnimationFrame(lerpCamera);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Step-Down Handlers
  const handleSelectCore = (coreId: CorePortalId) => {
    setSelectedCoreId(coreId);
    setSelectedDomainId(null);
    setSelectedProjectSlug(null);
    setActiveDepth(1);
  };

  const handleSelectDomain = (domainId: string) => {
    setSelectedDomainId(domainId);
    setSelectedProjectSlug(null);
    setActiveDepth(2);
  };

  const handleSelectProject = (slug: string) => {
    if (selectedProjectSlug === slug) {
      router.push(`/projects/${slug}`);
      return;
    }
    setSelectedProjectSlug(slug);
    setActiveDepth(3);
  };

  // Step-Back Navigation
  const handleStepBackTo = (depth: 0 | 1 | 2) => {
    if (depth === 0) {
      setSelectedCoreId(null);
      setSelectedDomainId(null);
      setSelectedProjectSlug(null);
      setActiveDepth(0);
    } else if (depth === 1) {
      setSelectedDomainId(null);
      setSelectedProjectSlug(null);
      setActiveDepth(1);
    } else if (depth === 2) {
      setSelectedProjectSlug(null);
      setActiveDepth(2);
    }
  };

  const activeProject = useMemo(() => {
    if (selectedProjectSlug) return projectMap.get(selectedProjectSlug) || null;
    return null;
  }, [selectedProjectSlug, projectMap]);

  const activeDomain = useMemo(() => {
    if (selectedDomainId) return DOMAIN_MODULES.find((d) => d.id === selectedDomainId) || null;
    return null;
  }, [selectedDomainId]);

  return (
    <div
      ref={containerRef}
      className="relative w-screen max-w-none min-h-[88vh] overflow-hidden select-none py-10 flex flex-col justify-between bg-transparent"
      aria-label="Linear Rabbit-Hole Systems CodeGraph"
    >
      {/* =====================================================================
          TOP FLOATING RABBIT-HOLE PATH TRAIL & MODE TOGGLE
          ===================================================================== */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw] flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#2563EB]/20">
        
        {/* Floating Top-Left Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleStepBackTo(0)}
            className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer font-medium flex items-center gap-2 ${
              activeDepth === 0
                ? 'bg-[#FF2800] text-[#03050A] font-bold'
                : 'text-[#C8D2E0] hover:text-[#F4F6F9] hover:bg-[#060A12]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4F6F9]" />
            <span>All Systems (18)</span>
          </button>

          {selectedCoreId && (
            <>
              <span className="text-[#2563EB]">▸</span>
              <button
                type="button"
                onClick={() => handleStepBackTo(1)}
                className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer font-medium ${
                  activeDepth === 1
                    ? 'bg-[#FF2800] text-[#03050A] font-bold'
                    : 'text-[#C8D2E0] hover:text-[#F4F6F9] hover:bg-[#060A12]'
                }`}
              >
                {selectedCoreId === 'core-backend' ? 'Backend & AI' : 'Frontend & Spatial'}
              </button>
            </>
          )}

          {activeDomain && (
            <>
              <span className="text-[#2563EB]">▸</span>
              <button
                type="button"
                onClick={() => handleStepBackTo(2)}
                className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer font-medium ${
                  activeDepth === 2
                    ? 'bg-[#FF2800] text-[#03050A] font-bold'
                    : 'text-[#C8D2E0] hover:text-[#F4F6F9] hover:bg-[#060A12]'
                }`}
              >
                {activeDomain.label}
              </button>
            </>
          )}

          {activeProject && (
            <>
              <span className="text-[#2563EB]">▸</span>
              <span className="px-3 py-1.5 bg-[#FF2800]/20 text-[#F4F6F9] border border-[#FF2800]/40 rounded-[2px] font-semibold">
                {activeProject.title.split('—')[0].trim()}
              </span>
            </>
          )}
        </div>

        {/* Top-Right Toggle: [Rabbit-Hole Mode] / [Full 18-Node Constellation Map] */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('rabbit-hole')}
            className={`px-3 py-1.5 rounded-[2px] cursor-pointer transition-colors ${
              viewMode === 'rabbit-hole'
                ? 'bg-[#FF2800] text-[#03050A] font-bold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Rabbit-Hole Mode
          </button>
          <span className="text-[#2563EB]">|</span>
          <button
            type="button"
            onClick={() => setViewMode('constellation')}
            className={`px-3 py-1.5 rounded-[2px] cursor-pointer transition-colors ${
              viewMode === 'constellation'
                ? 'bg-[#2563EB] text-[#F4F6F9] font-bold'
                : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
            }`}
          >
            Full 18-Node Constellation Map
          </button>
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: LINEAR RABBIT-HOLE CAMERA ENGINE (Integrated Open-Page)
          ===================================================================== */}
      {viewMode === 'rabbit-hole' ? (
        <div className="relative w-full flex-1 overflow-hidden flex items-center my-auto py-10">
          
          {/* World Camera Container */}
          <div
            className="relative w-full h-[640px] transition-none"
            style={{
              transform: `translate3d(${camX}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            {/* Connecting SVG Energy Conduits */}
            <svg
              className="absolute inset-0 w-[2800px] h-full pointer-events-none overflow-visible"
              aria-hidden="true"
            >
              {/* Spline from Depth 0 to Depth 1 */}
              {selectedCoreId && (
                <path
                  d={`M 360 ${selectedCoreId === 'core-backend' ? 240 : 420} C 500 ${
                    selectedCoreId === 'core-backend' ? 240 : 420
                  }, 620 320, 780 320`}
                  fill="none"
                  stroke={selectedCoreId === 'core-backend' ? '#FF2800' : '#2563EB'}
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              )}

              {/* Spline from Depth 1 to Depth 2 */}
              {activeDomain && (
                <path
                  d="M 940 320 C 1100 320, 1180 320, 1340 320"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              )}

              {/* Spline from Depth 2 to Depth 3 */}
              {activeProject && (
                <path
                  d="M 1520 320 C 1650 320, 1720 320, 1860 320"
                  fill="none"
                  stroke="#FF2800"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              )}
            </svg>

            {/* ===================================================================
                DEPTH 0: ENTRY PRIMARY ARCHITECTURE PORTALS (worldX ≈ 180px)
                =================================================================== */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[140px] flex flex-col gap-8 transition-all duration-500 ${
                activeDepth > 0 ? 'opacity-35 hover:opacity-100 scale-95 origin-left' : 'opacity-100 scale-100'
              }`}
              style={{ width: '380px' }}
            >
              <div className="space-y-1 pb-2 border-b border-[#2563EB]/30 text-xs font-mono">
                <span className="text-[#FF2800]">DEPTH 00 · CORE ARCHITECTURES</span>
                <h3 className="font-serif text-2xl text-[#F4F6F9]">Primary Portals</h3>
              </div>

              {/* Portal A: Backend, AI/ML & Compute Engines (10 Systems) */}
              <div
                onClick={() => handleSelectCore('core-backend')}
                className={`p-6 transition-all duration-300 cursor-pointer border-b ${
                  selectedCoreId === 'core-backend'
                    ? 'border-[#FF2800] bg-[#060A12]/80'
                    : 'border-[#2563EB]/30 hover:border-[#FF2800]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF2800] shadow-[0_0_10px_#FF2800]" />
                    <span className="text-[#FF2800] font-bold">PORTAL A</span>
                  </div>
                  <span className="text-[#C8D2E0] font-mono text-[11px]">10 SYSTEMS</span>
                </div>
                <h4 className="text-2xl font-serif text-[#F4F6F9] leading-snug">
                  Backend, AI/ML &amp; Compute Engines
                </h4>
                <p className="text-xs font-sans text-[#7E8B9B] mt-2 leading-relaxed">
                  PyTorch, Computer Vision Grad-CAM, 3D LiDAR point-clouds, and FAISS vector indices.
                </p>
                <div className="mt-4 pt-2 text-[11px] font-mono text-[#FF2800] flex items-center justify-between">
                  <span>Translate Camera Into Modules</span>
                  <span>→</span>
                </div>
              </div>

              {/* Portal B: Frontend, Spatial UI & Interactive Systems (8 Systems) */}
              <div
                onClick={() => handleSelectCore('core-frontend')}
                className={`p-6 transition-all duration-300 cursor-pointer border-b ${
                  selectedCoreId === 'core-frontend'
                    ? 'border-[#2563EB] bg-[#060A12]/80'
                    : 'border-[#2563EB]/30 hover:border-[#2563EB]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_10px_#2563EB]" />
                    <span className="text-[#2563EB] font-bold">PORTAL B</span>
                  </div>
                  <span className="text-[#C8D2E0] font-mono text-[11px]">8 SYSTEMS</span>
                </div>
                <h4 className="text-2xl font-serif text-[#F4F6F9] leading-snug">
                  Frontend, Spatial UI &amp; Interactive Systems
                </h4>
                <p className="text-xs font-sans text-[#7E8B9B] mt-2 leading-relaxed">
                  60 FPS dedicated Web Workers, Deck.GL 3D runtimes, and local state machines.
                </p>
                <div className="mt-4 pt-2 text-[11px] font-mono text-[#2563EB] flex items-center justify-between">
                  <span>Translate Camera Into Modules</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* ===================================================================
                DEPTH 1: DOMAIN SUB-MODULES (Blooms at worldX ≈ 760px)
                =================================================================== */}
            {selectedCoreId && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-[760px] flex flex-col gap-5 transition-all duration-500 ${
                  activeDepth > 1 ? 'opacity-35 hover:opacity-100 scale-95 origin-left' : 'opacity-100 scale-100'
                }`}
                style={{ width: '420px' }}
              >
                <div className="space-y-1 pb-2 border-b border-[#2563EB]/30 text-xs font-mono">
                  <span className="text-[#2563EB]">DEPTH 01 · DOMAIN SUB-MODULES</span>
                  <h3 className="font-serif text-2xl text-[#F4F6F9]">
                    {selectedCoreId === 'core-backend' ? 'AI/ML & Compute Modules' : 'Spatial & UI Modules'}
                  </h3>
                </div>

                {DOMAIN_MODULES.filter((d) => d.coreId === selectedCoreId).map((domain) => {
                  const isSelected = selectedDomainId === domain.id;
                  return (
                    <div
                      key={domain.id}
                      onClick={() => handleSelectDomain(domain.id)}
                      className={`py-4 px-5 transition-all duration-300 cursor-pointer border-b ${
                        isSelected
                          ? 'border-[#FF2800] bg-[#060A12]/80'
                          : 'border-[#2563EB]/30 hover:border-[#FF2800]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#F4F6F9] font-medium text-sm">{domain.label}</span>
                        <span className="text-[#FF2800] text-[11px] font-bold">
                          {domain.projectSlugs.length} Systems →
                        </span>
                      </div>
                      <p className="text-xs font-sans text-[#7E8B9B] mt-1.5 leading-relaxed">
                        {domain.tagline}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===================================================================
                DEPTH 2: SPECIFIC SYSTEM NODES (72px spacing at worldX ≈ 1340px)
                =================================================================== */}
            {activeDomain && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-[1340px] flex flex-col gap-6 transition-all duration-500 ${
                  activeDepth > 2 ? 'opacity-35 hover:opacity-100 scale-95 origin-left' : 'opacity-100 scale-100'
                }`}
                style={{ width: '460px' }}
              >
                <div className="space-y-1 pb-2 border-b border-[#2563EB]/30 text-xs font-mono">
                  <span className="text-[#FF2800]">DEPTH 02 · PRODUCTION SYSTEMS</span>
                  <h3 className="font-serif text-2xl text-[#F4F6F9]">Architectural Codebases</h3>
                </div>

                {activeDomain.projectSlugs.map((slug) => {
                  const proj = projectMap.get(slug);
                  if (!proj) return null;
                  const isSelected = selectedProjectSlug === slug;

                  return (
                    <div
                      key={slug}
                      onClick={() => handleSelectProject(slug)}
                      className={`py-4 px-5 transition-all duration-300 cursor-pointer border-b ${
                        isSelected
                          ? 'border-[#FF2800] bg-[#060A12]/80'
                          : 'border-[#2563EB]/30 hover:border-[#FF2800]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-lg font-serif text-[#F4F6F9] leading-snug">
                          {proj.title}
                        </h4>
                        <span className="text-xs font-mono text-[#FF2800] shrink-0 font-bold">
                          {proj.year}
                        </span>
                      </div>

                      <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-[#C8D2E0]">
                        <span className="text-[#FF2800]">★</span>
                        <span>{proj.highlight}</span>
                      </div>

                      <p className="text-xs font-sans text-[#7E8B9B] mt-1.5 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===================================================================
                DEPTH 3: UNBOXED HOLOGRAPHIC EDITORIAL SPEC (worldX ≈ 1920px)
                =================================================================== */}
            {activeProject && (
              <div
                className="absolute top-1/2 -translate-y-1/2 left-[1920px] space-y-6 animate-fadeIn"
                style={{ width: '540px' }}
              >
                <div className="space-y-2 pb-3 border-b border-[#2563EB]/30">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#FF2800] font-bold">{activeProject.category}</span>
                    <span className="text-[#2563EB]">·</span>
                    <span className="text-[#C8D2E0]">{activeProject.year}</span>
                    <span className="text-[#2563EB]">·</span>
                    <span className="text-[#2563EB]">Verified Architecture</span>
                  </div>
                  <h3 className="text-3xl font-serif text-[#F4F6F9] leading-tight">
                    {activeProject.title}
                  </h3>
                </div>

                {/* Oversized Benchmark Callout */}
                <div className="py-4 border-y border-[#FF2800]/30 space-y-1">
                  <div className="text-[10px] font-mono text-[#FF2800] uppercase tracking-wider">
                    VERIFIED ARCHITECTURAL BENCHMARK:
                  </div>
                  <div className="text-xl font-mono text-[#F4F6F9] font-bold">
                    {activeProject.highlight}
                  </div>
                </div>

                {/* Architecture Breakdown Prose */}
                <p className="text-sm font-sans text-[#C8D2E0] leading-relaxed">
                  {activeProject.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="space-y-2 pt-2 border-t border-[#2563EB]/20">
                  <span className="text-[10px] font-mono text-[#7E8B9B] uppercase tracking-wider block">
                    TECH STACK:
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#C8D2E0]">
                    {activeProject.stack.split(',').map((tech, i, arr) => (
                      <span key={i} className="text-[#F4F6F9]">
                        {tech.trim()}
                        {i < arr.length - 1 && <span className="ml-2 text-[#2563EB]">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Enter Full Case Study & Source Code */}
                <div className="pt-4 flex items-center gap-4 text-xs font-mono">
                  <Link
                    href={`/projects/${activeProject.slug}`}
                    className="px-6 py-3.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-bold uppercase tracking-wider rounded-[2px] transition-all inline-flex items-center gap-2 shadow-[0_0_24px_rgba(255,40,0,0.35)]"
                  >
                    <span>Enter Full Case Study</span>
                    <span>→</span>
                  </Link>

                  {activeProject.github && (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-transparent hover:bg-[#0B1E40]/40 text-[#C8D2E0] border border-[#2563EB]/30 font-medium rounded-[2px] transition-colors inline-flex items-center gap-2"
                    >
                      <span>Source Repository</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* =====================================================================
            VIEW 2: FULL 18-NODE CONSTELLATION MAP
            ===================================================================== */
        <div className="w-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw] py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {allProjects.map((p) => (
            <div
              key={p.slug}
              className="py-5 px-6 border-b border-[#2563EB]/30 hover:border-[#FF2800] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#FF2800] font-semibold">{p.category}</span>
                  <span className="text-[#7E8B9B]">{p.year}</span>
                </div>
                <h4 className="text-xl font-serif text-[#F4F6F9] leading-snug">
                  {p.title}
                </h4>
                <p className="text-xs font-sans text-[#7E8B9B] line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2563EB]/20 flex items-center justify-between text-xs font-mono">
                <span className="text-[#C8D2E0] text-[11px] truncate max-w-[200px]">
                  {p.highlight}
                </span>
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-[#FF2800] hover:text-[#F4F6F9] font-bold"
                >
                  Inspect →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Exploration Summary */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw] pt-4 border-t border-[#2563EB]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#7E8B9B]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800]" />
          <span>Active Exploration Depth: Level 0{activeDepth}</span>
          <span>·</span>
          <span>18 Architectural Repositories Indexed</span>
        </div>
        <Link href="/projects" className="text-[#FF2800] hover:text-[#F4F6F9] transition-colors">
          View Master Telemetry Timing Sheet Ledger →
        </Link>
      </div>
    </div>
  );
};

export default SystemsCodeGraph;
