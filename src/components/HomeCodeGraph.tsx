import React, { useState, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ---------------------------------------------------------------------------
// TYPES & DATA STRUCTURES
// ---------------------------------------------------------------------------

export type CoreId = 'core-backend' | 'core-frontend';

export interface ConstellationCore {
  id: CoreId;
  label: string;
  shortLabel: string;
  color: string;
  x: number;
  y: number;
  projectCount: number;
}

export interface ConstellationDomain {
  id: string;
  coreId: CoreId;
  label: string;
  shortLabel: string;
  tagline: string;
  color: string;
  x: number;
  y: number;
  projectSlugs: string[];
}

export interface ConstellationProject {
  slug: string;
  title: string;
  domainId: string;
  coreId: CoreId;
  metric: string;
  year: string;
  stack: string;
  summary: string;
  x: number;
  y: number;
  angle: number;
  color: string;
}

// ---------------------------------------------------------------------------
// DATA DEFINITIONS (2 CORES, 7 DOMAINS, 18 PROJECTS)
// ---------------------------------------------------------------------------

const CORES: ConstellationCore[] = [
  {
    id: 'core-backend',
    label: 'Backend, AI/ML & Compute Engines',
    shortLabel: 'Backend & AI/ML',
    color: '#FF2800',
    x: 350,
    y: 340,
    projectCount: 8,
  },
  {
    id: 'core-frontend',
    label: 'Frontend, Spatial UI & Interactive Systems',
    shortLabel: 'Frontend & Spatial UI',
    color: '#2563EB',
    x: 850,
    y: 340,
    projectCount: 10,
  },
];

const DOMAINS: ConstellationDomain[] = [
  // Backend Domains (4)
  {
    id: 'domain-cv-lidar',
    coreId: 'core-backend',
    label: 'Computer Vision & Clinical LiDAR',
    shortLabel: 'Computer Vision & LiDAR',
    tagline: '8.09ms Grad-CAM Saliency, 3D LiDAR topography',
    color: '#FF2800',
    x: 235,
    y: 245,
    projectSlugs: ['healios', 'cv-allergy-wheal'],
  },
  {
    id: 'domain-search-nlp',
    coreId: 'core-backend',
    label: 'Hybrid Search & NLP Retrieval',
    shortLabel: 'Hybrid Search & NLP',
    tagline: '94.2% Hit@5 dense and lexical search',
    color: '#FF4419',
    x: 450,
    y: 225,
    projectSlugs: ['tamiltrove', 'tutormatch'],
  },
  {
    id: 'domain-spatial-ml',
    coreId: 'core-backend',
    label: 'Spatial Econometrics & ML',
    shortLabel: 'Spatial Econometrics',
    tagline: '<15ms OSRM transit isochrones, ASA DataFest Winner',
    color: '#2563EB',
    x: 235,
    y: 435,
    projectSlugs: ['routerx-careline', 'cs50-ai-projects'],
  },
  {
    id: 'domain-serverless-cloud',
    coreId: 'core-backend',
    label: 'Cloud & Autonomous Pipelines',
    shortLabel: 'Cloud & Formal Java',
    tagline: 'Custom collections, tree invariants, and microservices',
    color: '#C8D2E0',
    x: 450,
    y: 455,
    projectSlugs: ['software-2-projects', 'software-1-projects'],
  },

  // Frontend Domains (3)
  {
    id: 'domain-telemetry-ui',
    coreId: 'core-frontend',
    label: 'Real-Time Telemetry & Simulators',
    shortLabel: 'Telemetry & Simulators',
    tagline: '60 FPS dedicated Web Workers and off-main-thread physics',
    color: '#FF2800',
    x: 755,
    y: 225,
    projectSlugs: ['apexis', 'tempo'],
  },
  {
    id: 'domain-spatial-3d',
    coreId: 'core-frontend',
    label: '3D Spatial & Geospatial UI',
    shortLabel: '3D Spatial & Geospatial',
    tagline: 'Hardware-accelerated Deck.GL 3D urban simulations',
    color: '#2563EB',
    x: 965,
    y: 245,
    projectSlugs: ['nyc-housing-market-ai', 'philocracy', 'carstomer'],
  },
  {
    id: 'domain-media-streaming',
    coreId: 'core-frontend',
    label: 'Media, Brand & Platforms',
    shortLabel: 'Media & Platform Systems',
    tagline: 'Continuous Web Audio DSP, DTCG design tokens, and static SSG',
    color: '#C8D2E0',
    x: 915,
    y: 465,
    projectSlugs: [
      'syntinuum-podcast-website',
      'murugesan-rajaram-lab',
      'momwebsite',
      'portfolio-website',
      'anna-birthday',
    ],
  },
];

// Helper to calculate project coordinate with polar outward projection
function createProject(
  slug: string,
  title: string,
  domain: ConstellationDomain,
  angleDeg: number,
  dist: number,
  metric: string,
  year: string,
  stack: string,
  summary: string
): ConstellationProject {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    slug,
    title,
    domainId: domain.id,
    coreId: domain.coreId,
    metric,
    year,
    stack,
    summary,
    angle: angleDeg,
    x: Math.round(domain.x + Math.cos(rad) * dist),
    y: Math.round(domain.y + Math.sin(rad) * dist),
    color: domain.color,
  };
}

const PROJECTS: ConstellationProject[] = [
  // 1. domain-cv-lidar (2)
  createProject(
    'healios',
    'Healios V2',
    DOMAINS[0],
    -155,
    64,
    '8.09 ms Saliency',
    '2026',
    'Swift · ARKit · Metal · FastAPI',
    'Multimodal post-op wound diagnostic engine uniting 3D LiDAR point-clouds with explainable Grad-CAM.'
  ),
  createProject(
    'cv-allergy-wheal',
    'Allergy Wheal CV',
    DOMAINS[0],
    -100,
    64,
    '±0.12 mm Precision',
    '2025',
    'Python · OpenCV · PyTorch',
    'Clinical digital pathology research pipeline for automated allergy skin-prick wheal and flare segmentation.'
  ),

  // 2. domain-search-nlp (2)
  createProject(
    'tamiltrove',
    'TamilTrove',
    DOMAINS[1],
    -80,
    62,
    '94.2% Hit@5',
    '2025',
    'Python · FAISS · BM25 · FastAPI',
    'Hybrid dense semantic and lexical search engine across ancient Sangam and classical Tamil literature.'
  ),
  createProject(
    'tutormatch',
    'TutorMatch',
    DOMAINS[1],
    -15,
    62,
    '< 20 ms Proximity',
    '2024',
    'Next.js · TypeScript · PostgreSQL',
    'Zero-shot NLP tutoring matching portal with spatial proximity indexing and schedule optimization.'
  ),

  // 3. domain-spatial-ml (2)
  createProject(
    'routerx-careline',
    'RouteRx (Careline)',
    DOMAINS[2],
    155,
    64,
    '1st Place ASA DataFest',
    '2026',
    'Python · OSRM · Folium · GeoPandas',
    'Sub-15ms OSRM transit isochrone engine identifying healthcare deserts across 141 census blocks.'
  ),
  createProject(
    'cs50-ai-projects',
    'CS50 AI Suite',
    DOMAINS[2],
    100,
    64,
    'Harvard CS50 AI Origin',
    '2025',
    'Python · Minimax · HMMs · Q-Learning',
    'Formal classical AI, constraint satisfaction, adversarial search, and probabilistic inference systems.'
  ),

  // 4. domain-serverless-cloud (2)
  createProject(
    'software-2-projects',
    'Software 2 Systems',
    DOMAINS[3],
    80,
    62,
    '100% JUnit Suite',
    '2024',
    'Java · Custom Collections · OOP',
    'Formal data structures, custom collection implementations, tree invariants, and mathematical contracts.'
  ),
  createProject(
    'software-1-projects',
    'Software 1 Foundations',
    DOMAINS[3],
    15,
    62,
    'Strict Invariants',
    '2023',
    'Java · Modular Architecture',
    'Component-based software engineering, modular design patterns, and rigorous algorithmic proofs.'
  ),

  // 5. domain-telemetry-ui (2)
  createProject(
    'apexis',
    'Apexis Telemetry',
    DOMAINS[4],
    -165,
    62,
    '60 FPS Locked',
    '2026',
    'Next.js · Web Workers · SQLite · Canvas',
    'Deterministic 60 FPS multi-car simulation Web Worker, client-side broadcast OCR, and sub-12ms SQLite lookups.'
  ),
  createProject(
    'tempo',
    'Tempo Task Suite',
    DOMAINS[4],
    -95,
    62,
    '100% Local Air-Gap',
    '2026',
    'Electron · React · TypeScript · SQLite',
    'Air-gapped cognitive buffer with pgvector emotional memory and encrypted local SQLite persistence.'
  ),

  // 6. domain-spatial-3d (3)
  createProject(
    'nyc-housing-market-ai',
    'NYC Housing OS',
    DOMAINS[5],
    -80,
    64,
    'Top Project Award',
    '2025',
    'Next.js · Deck.GL · Mapbox GL · Python',
    'Hardware-accelerated Deck.GL 3D urban housing market simulation and demographic wealth physics.'
  ),
  createProject(
    'philocracy',
    'Philocracy Platform',
    DOMAINS[5],
    -20,
    64,
    'Arbitrary N Depth',
    '2025',
    'React · TypeScript · D3.js · Canvas',
    'Structured philosophical debate schema trees, fallacies detection, and argument graph visualization.'
  ),
  createProject(
    'carstomer',
    'CarStomer',
    DOMAINS[5],
    35,
    64,
    'Random Forest Regressor',
    '2024',
    'React · Vite · Scikit-Learn',
    'Real-time automotive valuation engine with interactive market depreciation curves.'
  ),

  // 7. domain-media-streaming (5)
  createProject(
    'syntinuum-podcast-website',
    'Syntinuum Streaming',
    DOMAINS[6],
    -15,
    66,
    '100K+ Impressions',
    '2025',
    'Next.js · Web Audio API · Tailwind',
    'Live DSP audio waveform player, interactive episode scrubber, and podcast distribution platform.'
  ),
  createProject(
    'murugesan-rajaram-lab',
    'Rajaram Lab Portal',
    DOMAINS[6],
    35,
    66,
    '$0/mo Static SSG',
    '2025',
    'Next.js · Markdown · GitHub Actions',
    'Academic portal and publication index for the OSU Digital Pathology laboratory.'
  ),
  createProject(
    'momwebsite',
    'Client Services Portal',
    DOMAINS[6],
    85,
    66,
    '100/100 Core Web Vitals',
    '2024',
    'Next.js · TypeScript · Tailwind CSS',
    'Accounting and financial consulting portal with strict zero-drift typography.'
  ),
  createProject(
    'portfolio-website',
    'Portfolio V4 System',
    DOMAINS[6],
    135,
    66,
    'DTCG 3-Tier Tokens',
    '2026',
    'Next.js · Canvas · Framer Motion',
    'Personal engineering portfolio with procedural forged-carbon canvas and Swiss grid.'
  ),
  createProject(
    'anna-birthday',
    'Interactive Tribute',
    DOMAINS[6],
    175,
    66,
    '100% Delight Metric',
    '2024',
    'HTML5 · CSS Keyframes · Audio DSP',
    'Bespoke narrative web experience with audio-reactive visuals and interactive milestone timeline.'
  ),
];

// ---------------------------------------------------------------------------
// HOME CODE GRAPH COMPONENT
// ---------------------------------------------------------------------------

export const HomeCodeGraph: React.FC = () => {
  const router = useRouter();
  const [activeCore, setActiveCore] = useState<CoreId | 'all'>('all');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ConstellationProject | null>(null);
  const [shockwaveSlug, setShockwaveSlug] = useState<string | null>(null);
  const [mobileSelectedProject, setMobileSelectedProject] = useState<ConstellationProject | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Compute camera view transform
  const cameraTransform = useMemo(() => {
    if (activeDomain) {
      const dom = DOMAINS.find((d) => d.id === activeDomain);
      if (dom) {
        // Zoom 1.7x centered on domain
        const scale = 1.7;
        const tx = 600 - dom.x * scale;
        const ty = 340 - dom.y * scale;
        return `matrix(${scale}, 0, 0, ${scale}, ${tx}, ${ty})`;
      }
    }
    if (activeCore === 'core-backend') {
      const scale = 1.35;
      const tx = 600 - 350 * scale;
      const ty = 340 - 340 * scale;
      return `matrix(${scale}, 0, 0, ${scale}, ${tx}, ${ty})`;
    }
    if (activeCore === 'core-frontend') {
      const scale = 1.35;
      const tx = 600 - 850 * scale;
      const ty = 340 - 340 * scale;
      return `matrix(${scale}, 0, 0, ${scale}, ${tx}, ${ty})`;
    }
    // Root Overview
    return 'matrix(1, 0, 0, 1, 0, 0)';
  }, [activeCore, activeDomain]);

  // Handle direct navigation to project case study on click
  const handleProjectClick = useCallback(
    (project: ConstellationProject) => {
      setShockwaveSlug(project.slug);
      setMobileSelectedProject(project);

      // Execute smooth shockwave ripple before routing
      setTimeout(() => {
        router.push(`/projects/${project.slug}`);
      }, 180);
    },
    [router]
  );

  // Active breadcrumbs
  const currentDomainObj = DOMAINS.find((d) => d.id === activeDomain);
  const currentCoreObj = CORES.find((c) => c.id === activeCore);

  return (
    <section
      id="archive"
      className="relative w-full py-16 sm:py-24 select-none bg-transparent overflow-hidden"
      aria-label="Systems Constellation & Archive CodeGraph"
    >
      {/* Seamless Ambient Cobalt Glow in Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(21, 56, 117, 0.20) 0%, rgba(11, 30, 64, 0.08) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Floating Top Header Overlay */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C8D2E0]/10">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#F4F6F9] leading-tight tracking-tight">
              Systems Constellation.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#7E8B9B] tracking-wider uppercase">
              18 Production Repositories · 2 Architectural Cores · 6 Technical Domains
            </p>

            {/* Clickable Breadcrumb Trail */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveCore('all');
                  setActiveDomain(null);
                }}
                className={`transition-colors cursor-pointer ${
                  activeCore === 'all' && !activeDomain
                    ? 'text-[#F4F6F9] font-bold'
                    : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                }`}
              >
                SYSTEMS CORE
              </button>

              {currentCoreObj && (
                <>
                  <span className="text-[#C8D2E0]/40">/</span>
                  <button
                    type="button"
                    onClick={() => setActiveDomain(null)}
                    className={`transition-colors cursor-pointer uppercase ${
                      !activeDomain ? 'text-[#FF2800] font-bold' : 'text-[#7E8B9B] hover:text-[#C8D2E0]'
                    }`}
                  >
                    {currentCoreObj.shortLabel}
                  </button>
                </>
              )}

              {currentDomainObj && (
                <>
                  <span className="text-[#C8D2E0]/40">/</span>
                  <span className="text-[#F4F6F9] font-semibold uppercase">
                    {currentDomainObj.shortLabel}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Filter Buttons & Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0">
            <div className="flex items-center gap-1.5 p-1 bg-[#060A12] border border-[#C8D2E0]/15 rounded-[2px]">
              <button
                type="button"
                onClick={() => {
                  setActiveCore('all');
                  setActiveDomain(null);
                }}
                className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                  activeCore === 'all' && !activeDomain
                    ? 'bg-[#FF2800] text-[#F4F6F9] font-semibold'
                    : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                All (18)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCore('core-backend');
                  setActiveDomain(null);
                }}
                className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                  activeCore === 'core-backend' && !activeDomain
                    ? 'bg-[#FF2800] text-[#F4F6F9] font-semibold'
                    : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                Backend (8)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCore('core-frontend');
                  setActiveDomain(null);
                }}
                className={`px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer ${
                  activeCore === 'core-frontend' && !activeDomain
                    ? 'bg-[#2563EB] text-[#F4F6F9] font-semibold'
                    : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                Frontend (10)
              </button>
            </div>

            <Link
              href="/projects"
              className="px-4 py-2 bg-transparent hover:bg-[#0B1E40]/40 text-[#C8D2E0] hover:text-[#F4F6F9] border border-[#2563EB]/30 rounded-[2px] transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
            >
              <span>Open Fullscreen Graph</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* MAIN CONSTELLATION STAGE (Zero borders, seamless background fusion) */}
        <div
          ref={stageRef}
          className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] max-h-[720px] overflow-hidden select-none"
        >
          {/* Subtle Stage Background Reticle Rings */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] border border-[#2563EB]/10 rounded-full animate-spin [animation-duration:90s]" />
            <div className="absolute w-[560px] h-[560px] sm:w-[780px] sm:h-[780px] border border-[#C8D2E0]/5 rounded-full" />
          </div>

          {/* SVG Vector Constellation Engine */}
          <svg
            viewBox="0 0 1200 680"
            className="w-full h-full relative z-10 overflow-visible"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              {/* Glow Filter for Hovered Nodes */}
              <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FF2800" floodOpacity="0.8" />
              </filter>
              <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2563EB" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Camera Glide Group (Smooth Spring / Ease Matrix) */}
            <g
              transform={cameraTransform}
              style={{
                transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                transformOrigin: '600px 340px',
              }}
            >
              {/* SYNAPTIC THREADS (EDGES) */}

              {/* 1. Origin -> Cores */}
              {CORES.map((core) => (
                <line
                  key={`edge-origin-${core.id}`}
                  x1={600}
                  y1={340}
                  x2={core.x}
                  y2={core.y}
                  stroke={core.color}
                  strokeWidth={activeCore === core.id || activeCore === 'all' ? 1.4 : 0.6}
                  strokeDasharray="4 4"
                  strokeOpacity={activeCore === core.id ? 0.7 : 0.35}
                />
              ))}

              {/* 2. Cores -> Domains */}
              {DOMAINS.map((domain) => {
                const parentCore = CORES.find((c) => c.id === domain.coreId);
                if (!parentCore) return null;
                const isDomainActive = activeDomain === domain.id;
                const isCoreActive = activeCore === 'all' || activeCore === domain.coreId;

                return (
                  <path
                    key={`edge-core-${domain.id}`}
                    d={`M ${parentCore.x} ${parentCore.y} Q ${(parentCore.x + domain.x) / 2} ${
                      (parentCore.y + domain.y) / 2 - 12
                    } ${domain.x} ${domain.y}`}
                    fill="none"
                    stroke={domain.color}
                    strokeWidth={isDomainActive ? 1.8 : isCoreActive ? 1.0 : 0.5}
                    strokeOpacity={isDomainActive ? 0.9 : isCoreActive ? 0.45 : 0.15}
                  />
                );
              })}

              {/* 3. Domains -> Projects */}
              {PROJECTS.map((proj) => {
                const parentDomain = DOMAINS.find((d) => d.id === proj.domainId);
                if (!parentDomain) return null;
                const isHovered = hoveredProject?.slug === proj.slug;
                const isDomainActive = activeDomain === null || activeDomain === proj.domainId;
                const isCoreActive = activeCore === 'all' || activeCore === proj.coreId;

                return (
                  <line
                    key={`edge-proj-${proj.slug}`}
                    x1={parentDomain.x}
                    y1={parentDomain.y}
                    x2={proj.x}
                    y2={proj.y}
                    stroke={isHovered ? '#FF2800' : proj.color}
                    strokeWidth={isHovered ? 1.6 : 0.8}
                    strokeOpacity={isHovered ? 0.95 : isDomainActive && isCoreActive ? 0.35 : 0.1}
                  />
                );
              })}

              {/* TIER 0: CENTRAL ORIGIN RETICLE & DOT */}
              <g className="cursor-pointer" onClick={() => { setActiveCore('all'); setActiveDomain(null); }}>
                {/* 32px dashed reticle ring */}
                <circle
                  cx={600}
                  cy={340}
                  r={18}
                  fill="none"
                  stroke="#C8D2E0"
                  strokeWidth="0.9"
                  strokeDasharray="3 3"
                  strokeOpacity="0.45"
                />
                {/* 6px machined silver core */}
                <circle cx={600} cy={340} r={4.5} fill="#C8D2E0" />
                {/* Crosshair fiducial lines */}
                <line x1={592} y1={340} x2={608} y2={340} stroke="#C8D2E0" strokeWidth="0.8" strokeOpacity="0.6" />
                <line x1={600} y1={332} x2={600} y2={348} stroke="#C8D2E0" strokeWidth="0.8" strokeOpacity="0.6" />
                <text
                  x={600}
                  y={372}
                  textAnchor="middle"
                  fill="#7E8B9B"
                  fontSize="9"
                  fontFamily="monospace"
                  letterSpacing="0.1em"
                >
                  SYSTEMS CORE
                </text>
              </g>

              {/* TIER 1: PRIMARY SUPER-DOTS (CORES) */}
              {CORES.map((core) => {
                const isCoreActive = activeCore === core.id;
                return (
                  <g
                    key={core.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setActiveCore(isCoreActive ? 'all' : core.id);
                      setActiveDomain(null);
                    }}
                  >
                    {/* 26px orbital ring */}
                    <circle
                      cx={core.x}
                      cy={core.y}
                      r={15}
                      fill="none"
                      stroke={core.color}
                      strokeWidth={isCoreActive ? '1.8' : '1.0'}
                      strokeOpacity={isCoreActive ? '0.9' : '0.4'}
                      strokeDasharray={isCoreActive ? 'none' : '4 3'}
                    />
                    {/* 10px Core Dot */}
                    <circle
                      cx={core.x}
                      cy={core.y}
                      r={6}
                      fill={core.color}
                      className="transition-transform group-hover:scale-125"
                    />
                    {/* Core Labels */}
                    <text
                      x={core.x}
                      y={core.y - 24}
                      textAnchor="middle"
                      fill="#F4F6F9"
                      fontSize="13"
                      fontFamily="serif"
                      fontWeight="600"
                      className="select-none"
                    >
                      {core.shortLabel}{' '}
                      <tspan fill={core.color} fontSize="11" fontFamily="monospace">
                        [{core.projectCount}]
                      </tspan>
                    </text>
                  </g>
                );
              })}

              {/* TIER 2: DOMAIN SUB-CLUSTER DOTS */}
              {DOMAINS.map((domain) => {
                const isDomainActive = activeDomain === domain.id;
                const isCoreActive = activeCore === 'all' || activeCore === domain.coreId;

                return (
                  <g
                    key={domain.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setActiveDomain(isDomainActive ? null : domain.id);
                      setActiveCore(domain.coreId);
                    }}
                  >
                    {/* 16px Hairline Ring */}
                    <circle
                      cx={domain.x}
                      cy={domain.y}
                      r={10}
                      fill="none"
                      stroke={domain.color}
                      strokeWidth={isDomainActive ? '1.6' : '0.9'}
                      strokeOpacity={isDomainActive ? '0.9' : isCoreActive ? '0.5' : '0.2'}
                    />
                    {/* 6.5px Core Dot */}
                    <circle
                      cx={domain.x}
                      cy={domain.y}
                      r={4}
                      fill={domain.color}
                      opacity={isCoreActive ? 1 : 0.4}
                    />
                    {/* Domain Label */}
                    <text
                      x={domain.x}
                      y={domain.y < 340 ? domain.y - 15 : domain.y + 22}
                      textAnchor="middle"
                      fill={isDomainActive ? '#F4F6F9' : '#C8D2E0'}
                      fontSize="9.5"
                      fontFamily="monospace"
                      letterSpacing="0.06em"
                      className="uppercase select-none font-semibold"
                      style={{
                        paintOrder: 'stroke fill',
                        stroke: '#03050A',
                        strokeWidth: '2.5px',
                      }}
                    >
                      {domain.shortLabel}
                    </text>
                  </g>
                );
              })}

              {/* TIER 3: ALL 18 PROJECT DOTS & LABELS */}
              {PROJECTS.map((proj) => {
                const isHovered = hoveredProject?.slug === proj.slug;
                const isShockwave = shockwaveSlug === proj.slug;
                const isDomainActive = activeDomain === null || activeDomain === proj.domainId;
                const isCoreActive = activeCore === 'all' || activeCore === proj.coreId;
                const labelOnRight = Math.cos((proj.angle * Math.PI) / 180) >= 0;

                return (
                  <g
                    key={proj.slug}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredProject(proj)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => handleProjectClick(proj)}
                  >
                    {/* Touch / Click Hit Target (36px transparent hit area) */}
                    <circle cx={proj.x} cy={proj.y} r={18} fill="transparent" />

                    {/* Expanding Shockwave Ring on Click */}
                    {isShockwave && (
                      <circle
                        cx={proj.x}
                        cy={proj.y}
                        r={8}
                        fill="none"
                        stroke="#FF2800"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}

                    {/* Hover Halo Ring */}
                    {isHovered && (
                      <circle
                        cx={proj.x}
                        cy={proj.y}
                        r={9}
                        fill="none"
                        stroke={proj.color}
                        strokeWidth="1.2"
                        strokeOpacity="0.8"
                        className="animate-pulse"
                      />
                    )}

                    {/* 4.5px Luminous Vector Dot */}
                    <circle
                      cx={proj.x}
                      cy={proj.y}
                      r={isHovered ? 4 : 3}
                      fill={isHovered ? '#FF2800' : '#F4F6F9'}
                      stroke={proj.color}
                      strokeWidth={isHovered ? '2' : '1.2'}
                      opacity={isDomainActive && isCoreActive ? 1 : 0.3}
                      filter={isHovered ? (proj.color === '#FF2800' ? 'url(#glow-red)' : 'url(#glow-blue)') : undefined}
                    />

                    {/* Non-Colliding Micro-Labels */}
                    <g
                      transform={`translate(${proj.x + (labelOnRight ? 8 : -8)}, ${proj.y + 3})`}
                      opacity={isDomainActive && isCoreActive ? (isHovered ? 1 : 0.85) : 0.25}
                    >
                      <text
                        x={0}
                        y={0}
                        textAnchor={labelOnRight ? 'start' : 'end'}
                        fill={isHovered ? '#FFFFFF' : '#F4F6F9'}
                        fontSize="11"
                        fontFamily="serif"
                        fontWeight="500"
                        className="select-none"
                        style={{
                          paintOrder: 'stroke fill',
                          stroke: '#03050A',
                          strokeWidth: '3px',
                        }}
                      >
                        {proj.title}
                      </text>
                      <text
                        x={0}
                        y={11}
                        textAnchor={labelOnRight ? 'start' : 'end'}
                        fill={isHovered ? '#FF2800' : '#7E8B9B'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        className="select-none font-semibold uppercase"
                        style={{
                          paintOrder: 'stroke fill',
                          stroke: '#03050A',
                          strokeWidth: '2.5px',
                        }}
                      >
                        {proj.metric}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* FLOATING WHISPER CALLOUT HUD (Appears on Dot Hover) */}
          {hoveredProject && (
            <div
              className="absolute pointer-events-none z-30 transition-opacity duration-150"
              style={{
                left: `${Math.min(74, Math.max(12, (hoveredProject.x / 1200) * 100))}%`,
                top: `${Math.min(72, Math.max(12, (hoveredProject.y / 680) * 100))}%`,
                transform:
                  hoveredProject.x > 720
                    ? 'translate(-105%, -50%)'
                    : 'translate(12px, -50%)',
              }}
            >
              <div className="w-[280px] p-3.5 bg-[#03050A]/95 backdrop-blur-md border-l-2 border-[#FF2800] border-y border-r border-[#C8D2E0]/15 rounded-[2px] shadow-[0_12px_40px_rgba(0,0,0,0.9)] space-y-2">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-serif text-[15px] font-semibold text-[#F4F6F9] leading-tight truncate">
                    {hoveredProject.title}
                  </div>
                  <div className="font-mono text-[10px] text-[#7E8B9B] shrink-0">
                    {hoveredProject.year}
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-[#FF2800]">
                  {hoveredProject.metric}
                </div>

                <p className="text-[11.5px] font-sans text-[#C8D2E0]/90 leading-snug">
                  {hoveredProject.summary}
                </p>

                <div className="text-[10px] font-mono text-[#2563EB] tracking-wide pt-1 border-t border-[#C8D2E0]/10 truncate">
                  {hoveredProject.stack}
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#FF2800] font-semibold">
                  <span>Click dot to open Case Study</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE INSPECTION DRAWER (When a dot is tapped on mobile/touch) */}
        {mobileSelectedProject && (
          <div className="lg:hidden p-4 bg-[#060A12] border border-[#2563EB]/30 rounded-[2px] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#FF2800] uppercase font-semibold">
                  ACTIVE SELECTION
                </span>
                <h4 className="text-lg font-serif text-[#F4F6F9]">
                  {mobileSelectedProject.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setMobileSelectedProject(null)}
                className="text-[#7E8B9B] hover:text-[#F4F6F9] font-mono text-sm px-2 py-1"
                aria-label="Close Project Preview"
              >
                ✕
              </button>
            </div>
            <div className="font-mono text-xs font-bold text-[#4CC38A]">
              {mobileSelectedProject.metric}
            </div>
            <p className="text-xs font-sans text-[#7E8B9B] leading-relaxed">
              {mobileSelectedProject.summary}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href={`/projects/${mobileSelectedProject.slug}`}
                className="flex-1 py-2.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-mono text-xs font-semibold rounded-[2px] text-center inline-flex items-center justify-center gap-2"
              >
                <span>Open Full Case Study</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Architectural Verification String */}
        <div className="pt-4 border-t border-[#C8D2E0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-[#7E8B9B]">
          <div className="flex items-center gap-2">
            <span className="text-[#FF2800]">●</span>
            <span>POLAR VECTOR PROJECTION · ZERO CONTAINER BOXES · SEAMLESS CARBON FUSION</span>
          </div>
          <div className="text-[#C8D2E0]/60">
            TOTAL 18 CASE STUDIES · DYNAMIC SSG ROUTES
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCodeGraph;
