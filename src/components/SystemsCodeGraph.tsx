import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { allProjects, Project } from '@/content/projects';

// ---------------------------------------------------------------------------
// RABBIT-HOLE TAXONOMY & TOPOLOGY CONTRACTS
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
  // Backend Core Domains
  {
    id: 'domain-cv-lidar',
    coreId: 'core-backend',
    label: 'Computer Vision & Clinical Diagnostics',
    tagline: '8.09ms Grad-CAM Saliency, 3D LiDAR elevation, and histological AI',
    accentColor: '#FF2800',
    projectSlugs: ['healios', 'cv-allergy-wheal'],
  },
  {
    id: 'domain-search-nlp',
    coreId: 'core-backend',
    label: 'Vector Search & Information Retrieval',
    tagline: '94.2% Hit@5 FAISS dense embeddings and hybrid BM25 pipelines',
    accentColor: '#FF4419',
    projectSlugs: ['tamiltrove', 'tutormatch'],
  },
  {
    id: 'domain-spatial-ml',
    coreId: 'core-backend',
    label: 'Spatial Econometrics & Predictive ML',
    tagline: '<15ms OSRM transit isochrones and multi-state spatial regression',
    accentColor: '#2563EB',
    projectSlugs: ['routerx-careline', 'cs50-ai-projects', 'carstomer'],
  },
  {
    id: 'domain-serverless-cloud',
    coreId: 'core-backend',
    label: 'Serverless Cloud & Core Systems',
    tagline: 'AWS Lambda, DynamoDB microservices, and formal Java algorithms',
    accentColor: '#C8D2E0',
    projectSlugs: ['software-2-projects', 'software-1-projects'],
  },

  // Frontend Core Domains
  {
    id: 'domain-telemetry-ui',
    coreId: 'core-frontend',
    label: 'Real-Time Telemetry & Simulation',
    tagline: '60 FPS dedicated Web Workers and off-main-thread physics',
    accentColor: '#FF2800',
    projectSlugs: ['apexis', 'tempo'],
  },
  {
    id: 'domain-spatial-3d',
    coreId: 'core-frontend',
    label: '3D Spatial UI & Geospatial Runtimes',
    tagline: 'Hardware-accelerated Deck.GL 3D urban market simulations',
    accentColor: '#2563EB',
    projectSlugs: ['nyc-housing-market-ai', 'philocracy'],
  },
  {
    id: 'domain-media-streaming',
    coreId: 'core-frontend',
    label: 'Media Streaming & Design Platforms',
    tagline: 'Continuous Web Audio DSP, DTCG design tokens, and static SSG',
    accentColor: '#C8D2E0',
    projectSlugs: ['syntinuum-podcast-website', 'murugesan-rajaram-lab', 'portfolio-website', 'momwebsite', 'anna-birthday'],
  },
];

export const SystemsCodeGraph: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rabbit-Hole Navigation State
  const [activeDepth, setActiveDepth] = useState<0 | 1 | 2 | 3>(0);
  const [selectedCoreId, setSelectedCoreId] = useState<CorePortalId | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Camera Translation along World X axis
  const [camX, setCamX] = useState<number>(0);
  const targetCamX = useRef<number>(0);

  // Fast Project Lookup Map
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    allProjects.forEach((p) => map.set(p.slug, p));
    return map;
  }, []);

  // Update target camera X based on active rabbit-hole depth
  useEffect(() => {
    // Horizontal step per depth layer: 480px
    if (activeDepth === 0) targetCamX.current = 0;
    else if (activeDepth === 1) targetCamX.current = -460;
    else if (activeDepth === 2) targetCamX.current = -960;
    else if (activeDepth === 3) targetCamX.current = -1460;
  }, [activeDepth]);

  // Smooth camera interpolation RAF loop
  useEffect(() => {
    let animId: number;
    const lerpCamera = () => {
      setCamX((prev) => {
        const dx = targetCamX.current - prev;
        if (Math.abs(dx) < 0.2) return targetCamX.current;
        return prev + dx * 0.12;
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
      // Second click opens case study
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
      className="relative w-screen max-w-none min-h-[85vh] lg:min-h-[92vh] overflow-hidden select-none py-12 flex flex-col justify-between"
      style={{ background: 'transparent' }}
    >
      {/* =====================================================================
          TOP SPATIAL BREADCRUMB & RABBIT-HOLE EXPEDITION TRAIL
          ===================================================================== */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw] flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#18458B]/20">
        
        {/* Interactive Breadcrumb Path */}
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
            <span>Systems Core (18)</span>
          </button>

          {selectedCoreId && (
            <>
              <span className="text-[#18458B]">▸</span>
              <button
                type="button"
                onClick={() => handleStepBackTo(1)}
                className={`px-3 py-1.5 rounded-[2px] transition-all cursor-pointer font-medium ${
                  activeDepth === 1
                    ? 'bg-[#FF2800] text-[#03050A] font-bold'
                    : 'text-[#C8D2E0] hover:text-[#F4F6F9] hover:bg-[#060A12]'
                }`}
              >
                {selectedCoreId === 'core-backend' ? 'Backend & AI/ML' : 'Frontend & Spatial UI'}
              </button>
            </>
          )}

          {activeDomain && (
            <>
              <span className="text-[#18458B]">▸</span>
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
              <span className="text-[#18458B]">▸</span>
              <span className="px-3 py-1.5 bg-[#FF2800]/20 text-[#F4F6F9] border border-[#FF2800]/40 rounded-[2px] font-semibold">
                {activeProject.title.split('—')[0].trim()}
              </span>
            </>
          )}
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#7E8B9B]">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span>Linear World Camera Translation</span>
          <span>·</span>
          <span className="text-[#FF2800]">Click module to drill down</span>
        </div>
      </div>

      {/* =====================================================================
          INFINITE OPEN-CANVAS WORLD STAGE (Camera Translated horizontally)
          ===================================================================== */}
      <div className="relative w-full flex-1 overflow-hidden flex items-center my-auto py-8">
        
        {/* World Camera Container */}
        <div
          className="relative w-full h-[620px] transition-none"
          style={{
            transform: `translate3d(${camX}px, 0, 0)`,
            willChange: 'transform',
          }}
        >
          {/* Connecting SVG Energy Conduits */}
          <svg
            className="absolute inset-0 w-[2400px] h-full pointer-events-none overflow-visible"
            aria-hidden="true"
          >
            {/* Energy Conduits from Depth 0 to Depth 1 */}
            {selectedCoreId && (
              <path
                d={`M ${selectedCoreId === 'core-backend' ? 380 : 380} 310 C 520 310, 640 310, 840 310`}
                fill="none"
                stroke="#FF2800"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.85"
              />
            )}

            {/* Energy Conduits from Depth 1 to Depth 2 */}
            {activeDomain && (
              <path
                d="M 940 310 C 1100 310, 1220 310, 1420 310"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.85"
              />
            )}
          </svg>

          {/* ===================================================================
              DEPTH 0: ENTRY CORE PORTALS (Centered at X = 280px)
              =================================================================== */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 left-[120px] sm:left-[220px] flex flex-col gap-8 transition-opacity duration-500 ${
              activeDepth > 0 ? 'opacity-40 hover:opacity-100 scale-95 origin-left' : 'opacity-100 scale-100'
            }`}
            style={{ width: '380px' }}
          >
            <div className="space-y-1 pb-2 border-b border-[#18458B]/30 text-xs font-mono">
              <span className="text-[#FF2800]">DEPTH 00</span>
              <h3 className="font-serif text-2xl text-[#F4F6F9]">Architectural Engines</h3>
            </div>

            {/* Core Portal 01: Backend & AI/ML */}
            <div
              onClick={() => handleSelectCore('core-backend')}
              className={`p-6 rounded-[2px] border transition-all duration-300 cursor-pointer ${
                selectedCoreId === 'core-backend'
                  ? 'bg-[#060A12] border-[#FF2800] shadow-[0_0_30px_rgba(255,40,0,0.25)]'
                  : 'bg-[#03050A]/90 hover:bg-[#060A12] border-[#18458B]/30 hover:border-[#FF2800]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#FF2800] font-bold">CORE PORTAL 01</span>
                <span className="px-2 py-0.5 bg-[#FF2800]/10 text-[#FF2800] rounded-[2px]">
                  10 SYSTEMS
                </span>
              </div>
              <h4 className="text-xl font-serif text-[#F4F6F9] leading-snug">
                Backend, AI/ML &amp; Compute Engines
              </h4>
              <p className="text-xs font-sans text-[#7E8B9B] mt-2 leading-relaxed">
                PyTorch, Computer Vision Grad-CAM, FAISS vector embeddings, and AWS serverless runtimes.
              </p>
              <div className="mt-4 pt-3 border-t border-[#18458B]/20 text-[11px] font-mono text-[#FF2800] flex items-center justify-between">
                <span>Drill down into domains</span>
                <span>→</span>
              </div>
            </div>

            {/* Core Portal 02: Frontend, Spatial UI & Telemetry */}
            <div
              onClick={() => handleSelectCore('core-frontend')}
              className={`p-6 rounded-[2px] border transition-all duration-300 cursor-pointer ${
                selectedCoreId === 'core-frontend'
                  ? 'bg-[#060A12] border-[#2563EB] shadow-[0_0_30px_rgba(37,99,235,0.25)]'
                  : 'bg-[#03050A]/90 hover:bg-[#060A12] border-[#18458B]/30 hover:border-[#2563EB]/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#2563EB] font-bold">CORE PORTAL 02</span>
                <span className="px-2 py-0.5 bg-[#2563EB]/10 text-[#2563EB] rounded-[2px]">
                  8 SYSTEMS
                </span>
              </div>
              <h4 className="text-xl font-serif text-[#F4F6F9] leading-snug">
                Frontend, Spatial UI &amp; Telemetry
              </h4>
              <p className="text-xs font-sans text-[#7E8B9B] mt-2 leading-relaxed">
                60fps Web Workers, Deck.GL 3D visualizations, and zero-latency client state machines.
              </p>
              <div className="mt-4 pt-3 border-t border-[#18458B]/20 text-[11px] font-mono text-[#2563EB] flex items-center justify-between">
                <span>Drill down into domains</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* ===================================================================
              DEPTH 1: DOMAIN SUB-MODULES (Blooms at X = 740px)
              =================================================================== */}
          {selectedCoreId && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[740px] flex flex-col gap-4 transition-opacity duration-500 ${
                activeDepth > 1 ? 'opacity-40 hover:opacity-100 scale-95 origin-left' : 'opacity-100 scale-100'
              }`}
              style={{ width: '420px' }}
            >
              <div className="space-y-1 pb-2 border-b border-[#18458B]/30 text-xs font-mono">
                <span className="text-[#2563EB]">DEPTH 01</span>
                <h3 className="font-serif text-2xl text-[#F4F6F9]">
                  {selectedCoreId === 'core-backend' ? 'AI & Compute Sub-Domains' : 'Spatial & UI Sub-Domains'}
                </h3>
              </div>

              {DOMAIN_MODULES.filter((d) => d.coreId === selectedCoreId).map((domain) => {
                const isSelected = selectedDomainId === domain.id;
                return (
                  <div
                    key={domain.id}
                    onClick={() => handleSelectDomain(domain.id)}
                    className={`p-4 rounded-[2px] border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#060A12] border-[#FF2800] shadow-[0_0_24px_rgba(255,40,0,0.2)]'
                        : 'bg-[#03050A]/90 hover:bg-[#060A12] border-[#18458B]/30 hover:border-[#FF2800]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#C8D2E0] font-semibold">{domain.label}</span>
                      <span className="text-[#FF2800] text-[11px]">
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
              DEPTH 2: SPECIFIC SYSTEM NODES (Fans out at X = 1320px)
              =================================================================== */}
          {activeDomain && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[1320px] flex flex-col gap-3.5 transition-opacity duration-500 ${
                activeDepth > 2 ? 'opacity-40 hover:opacity-100 scale-95 origin-left' : 'opacity-100 scale-100'
              }`}
              style={{ width: '460px' }}
            >
              <div className="space-y-1 pb-2 border-b border-[#18458B]/30 text-xs font-mono">
                <span className="text-[#FF2800]">DEPTH 02</span>
                <h3 className="font-serif text-2xl text-[#F4F6F9]">Engineered Production Systems</h3>
              </div>

              {activeDomain.projectSlugs.map((slug) => {
                const proj = projectMap.get(slug);
                if (!proj) return null;
                const isSelected = selectedProjectSlug === slug;

                return (
                  <div
                    key={slug}
                    onClick={() => handleSelectProject(slug)}
                    className={`p-4 rounded-[2px] border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#060A12] border-[#FF2800] shadow-[0_0_24px_rgba(255,40,0,0.25)]'
                        : 'bg-[#03050A]/90 hover:bg-[#060A12] border-[#18458B]/30 hover:border-[#FF2800]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-base font-serif text-[#F4F6F9] leading-snug">
                        {proj.title}
                      </h4>
                      <span className="text-xs font-mono text-[#FF2800] shrink-0 font-bold">
                        {proj.year}
                      </span>
                    </div>

                    {/* Headline Metric Badge */}
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FF2800]/10 border border-[#FF2800]/30 rounded-[2px] text-[11px] font-mono text-[#FF2800]">
                      <span>★</span>
                      <span>{proj.highlight}</span>
                    </div>

                    <p className="text-xs font-sans text-[#7E8B9B] mt-2 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===================================================================
              DEPTH 3: UNBOXED HOLOGRAPHIC EDITORIAL SPEC (Focus at X = 1940px)
              =================================================================== */}
          {activeProject && (
            <div
              className="absolute top-1/2 -translate-y-1/2 left-[1940px] space-y-6 animate-fadeIn"
              style={{ width: '520px' }}
            >
              <div className="space-y-2 pb-3 border-b border-[#18458B]/30">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#FF2800] font-bold">{activeProject.category}</span>
                  <span className="text-[#18458B]">·</span>
                  <span className="text-[#C8D2E0]">{activeProject.year}</span>
                  <span className="text-[#18458B]">·</span>
                  <span className="text-[#2563EB]">Verified Architecture</span>
                </div>
                <h3 className="text-3xl font-serif text-[#F4F6F9] leading-tight">
                  {activeProject.title}
                </h3>
              </div>

              {/* Verified Metric Box */}
              <div className="p-4 bg-[#060A12] border border-[#FF2800]/30 rounded-[2px] space-y-1">
                <div className="text-[10px] font-mono text-[#FF2800] uppercase tracking-wider">
                  VERIFIED ARCHITECTURAL BENCHMARK:
                </div>
                <div className="text-sm font-mono text-[#F4F6F9] font-bold">
                  {activeProject.highlight}
                </div>
              </div>

              {/* Engineering Abstract */}
              <p className="text-sm font-sans text-[#C8D2E0] leading-relaxed">
                {activeProject.description}
              </p>

              {/* Stack Line */}
              <div className="space-y-1.5 pt-2 border-t border-[#18458B]/20">
                <span className="text-[10px] font-mono text-[#7E8B9B] uppercase tracking-wider block">
                  CORE TECH STACK:
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#C8D2E0]">
                  {activeProject.stack.split(',').map((tech, i, arr) => (
                    <React.Fragment key={i}>
                      <span className="text-[#F4F6F9]">{tech.trim()}</span>
                      {i < arr.length - 1 && <span className="text-[#18458B]">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Enter Case Study Button */}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  href={`/projects/${activeProject.slug}`}
                  className="px-6 py-3.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 inline-flex items-center gap-2 shadow-[0_0_24px_rgba(255,40,0,0.35)]"
                >
                  <span>Enter Full Case Study</span>
                  <span>→</span>
                </Link>

                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3.5 bg-[#060A12] hover:bg-[#0B1E40] text-[#C8D2E0] border border-[#18458B]/30 font-mono text-xs font-medium rounded-[2px] transition-colors inline-flex items-center gap-2"
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

      {/* Bottom Hint */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw] pt-4 border-t border-[#18458B]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#7E8B9B]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800]" />
          <span>Active Exploration Depth: Level 0{activeDepth}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-[#FF2800] hover:text-[#F4F6F9] transition-colors">
            View All 18 Systems in Master Ledger →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SystemsCodeGraph;
