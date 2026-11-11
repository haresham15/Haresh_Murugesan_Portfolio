import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMotionPreference } from './MotionPreference';

// ---------------------------------------------------------------------------
// TYPES & DATA STRUCTURES
// ---------------------------------------------------------------------------

export type CoreId = 'core-backend' | 'core-frontend';

export interface ConstellationCore {
  id: CoreId;
  label: string;
  shortLabel: string;
  color: string;
  wx: number;
  wy: number;
  wz: number;
  projectCount: number;
}

export interface ConstellationDomain {
  id: string;
  coreId: CoreId;
  label: string;
  shortLabel: string;
  tagline: string;
  color: string;
  wx: number;
  wy: number;
  wz: number;
  projectSlugs: string[];
}

export interface NearestNeighborLink {
  targetSlug: string;
  similarity: number;
  tagLabel: string;
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
  keywords: string[];
  cosineCoord: [number, number, number];
  nearestNeighbors: NearestNeighborLink[];
  wx: number;
  wy: number;
  wz: number;
  angle: number;
  color: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface EdgePhysics {
  id: string;
  fromType: 'origin' | 'core' | 'domain';
  fromId: string;
  toType: 'core' | 'domain' | 'project';
  toId: string;
  color: string;
  baseCurve: number;
  mx: number;
  my: number;
  vx: number;
  vy: number;
  restX: number;
  restY: number;
}

// ---------------------------------------------------------------------------
// CANONICAL DATA: 2 CORES, 7 DOMAINS, 18 PROJECTS WITH SEMANTIC VECTORS & k-NN
// ---------------------------------------------------------------------------

const CORES: ConstellationCore[] = [
  {
    id: 'core-backend',
    label: 'Backend, AI/ML & Compute Engines',
    shortLabel: 'Backend & AI/ML',
    color: '#FF2800',
    wx: -260,
    wy: 0,
    wz: 40,
    projectCount: 8,
  },
  {
    id: 'core-frontend',
    label: 'Frontend, Spatial UI & Interactive Systems',
    shortLabel: 'Frontend & Spatial UI',
    color: '#2563EB',
    wx: 260,
    wy: 0,
    wz: 40,
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
    wx: -375,
    wy: -95,
    wz: 60,
    projectSlugs: ['healios', 'cv-allergy-wheal'],
  },
  {
    id: 'domain-search-nlp',
    coreId: 'core-backend',
    label: 'Hybrid Search & NLP Retrieval',
    shortLabel: 'Hybrid Search & NLP',
    tagline: '94.2% Hit@5 dense and lexical search',
    color: '#FF4419',
    wx: -145,
    wy: -115,
    wz: 60,
    projectSlugs: ['tamiltrove', 'tutormatch'],
  },
  {
    id: 'domain-spatial-ml',
    coreId: 'core-backend',
    label: 'Spatial Econometrics & ML',
    shortLabel: 'Spatial Econometrics',
    tagline: '<15ms OSRM transit isochrones, ASA DataFest Winner',
    color: '#2563EB',
    wx: -375,
    wy: 105,
    wz: 60,
    projectSlugs: ['routerx-careline', 'cs50-ai-projects'],
  },
  {
    id: 'domain-serverless-cloud',
    coreId: 'core-backend',
    label: 'Cloud & Autonomous Pipelines',
    shortLabel: 'Cloud & Formal Java',
    tagline: 'Custom collections, tree invariants, and microservices',
    color: '#C8D2E0',
    wx: -145,
    wy: 125,
    wz: 60,
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
    wx: 155,
    wy: -115,
    wz: 60,
    projectSlugs: ['apexis', 'tempo'],
  },
  {
    id: 'domain-spatial-3d',
    coreId: 'core-frontend',
    label: '3D Spatial & Geospatial UI',
    shortLabel: '3D Spatial & Geospatial',
    tagline: 'Hardware-accelerated Deck.GL 3D urban simulations',
    color: '#2563EB',
    wx: 385,
    wy: -95,
    wz: 60,
    projectSlugs: ['nyc-housing-market-ai', 'philocracy', 'carstomer'],
  },
  {
    id: 'domain-media-streaming',
    coreId: 'core-frontend',
    label: 'Media, Brand & Platforms',
    shortLabel: 'Media & Platform Systems',
    tagline: 'Continuous Web Audio DSP, DTCG design tokens, and static SSG',
    color: '#C8D2E0',
    wx: 325,
    wy: 135,
    wz: 60,
    projectSlugs: [
      'syntinuum-podcast-website',
      'murugesan-rajaram-lab',
      'momwebsite',
      'portfolio-website',
      'anna-birthday',
    ],
  },
];

function buildProject(
  slug: string,
  title: string,
  domain: ConstellationDomain,
  angleDeg: number,
  dist: number,
  metric: string,
  year: string,
  stack: string,
  summary: string,
  keywords: string[],
  cosineCoord: [number, number, number],
  nearestNeighbors: NearestNeighborLink[]
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
    keywords,
    cosineCoord,
    nearestNeighbors,
    angle: angleDeg,
    wx: Math.round(domain.wx + Math.cos(rad) * dist),
    wy: Math.round(domain.wy + Math.sin(rad) * dist),
    wz: 90,
    color: domain.color,
  };
}

const PROJECTS: ConstellationProject[] = [
  // 1. domain-cv-lidar
  buildProject(
    'healios',
    'Healios V2',
    DOMAINS[0],
    -155,
    64,
    '8.09 ms Saliency',
    '2026',
    'Swift · ARKit · Metal · FastAPI',
    'Multimodal post-op wound diagnostic engine uniting 3D LiDAR point-clouds with explainable Grad-CAM.',
    ['clinical', 'computer', 'vision', '3d', 'lidar', 'grad-cam', 'saliency', 'swift', 'arkit', 'metal', 'fastapi', 'numpy', 'sub-10ms', 'wound', 'point-cloud'],
    [0.91, -0.24, 0.88],
    [
      { targetSlug: 'cv-allergy-wheal', similarity: 0.94, tagLabel: 'CLINICAL CV / HISTOLOGY' },
      { targetSlug: 'routerx-careline', similarity: 0.87, tagLabel: 'HEALTHCARE / SPATIAL' },
      { targetSlug: 'apexis', similarity: 0.84, tagLabel: 'REAL-TIME / 3D LIDAR' },
    ]
  ),
  buildProject(
    'cv-allergy-wheal',
    'Allergy Wheal CV',
    DOMAINS[0],
    -100,
    64,
    '±0.12 mm Precision',
    '2025',
    'Python · OpenCV · PyTorch',
    'Clinical digital pathology research pipeline for automated allergy skin-prick wheal and flare segmentation.',
    ['pathology', 'computer', 'vision', 'clinical', 'digital', 'histology', 'wheal', 'segmentation', 'opencv', 'pytorch', 'biomedical', 'precision'],
    [0.87, -0.31, 0.79],
    [
      { targetSlug: 'healios', similarity: 0.94, tagLabel: 'CLINICAL CV / DIGITAL PATHOLOGY' },
      { targetSlug: 'murugesan-rajaram-lab', similarity: 0.88, tagLabel: 'OSU PATHOLOGY / BIOMEDICAL' },
      { targetSlug: 'routerx-careline', similarity: 0.83, tagLabel: 'HEALTHCARE / SPATIAL' },
    ]
  ),

  // 2. domain-search-nlp
  buildProject(
    'tamiltrove',
    'TamilTrove',
    DOMAINS[1],
    -80,
    62,
    '94.2% Hit@5',
    '2025',
    'Python · FAISS · BM25 · FastAPI',
    'Hybrid dense semantic and lexical search engine across ancient Sangam and classical Tamil literature.',
    ['nlp', 'hybrid', 'search', 'dense', 'embeddings', 'faiss', 'bm25', 'fastapi', 'huggingface', 'literature', 'lexical', 'vector', 'retrieval', 'semantic'],
    [0.42, 0.88, 0.74],
    [
      { targetSlug: 'tutormatch', similarity: 0.92, tagLabel: 'DENSE NLP / VECTOR RETRIEVAL' },
      { targetSlug: 'philocracy', similarity: 0.86, tagLabel: 'SEMANTIC SCHEMA / TEXT GRAPH' },
      { targetSlug: 'cs50-ai-projects', similarity: 0.84, tagLabel: 'SEARCH ALGORITHMS / AI' },
    ]
  ),
  buildProject(
    'tutormatch',
    'TutorMatch',
    DOMAINS[1],
    -15,
    62,
    '< 20 ms Proximity',
    '2024',
    'Next.js · TypeScript · PostgreSQL',
    'Zero-shot NLP tutoring matching portal with spatial proximity indexing and schedule optimization.',
    ['nlp', 'zero-shot', 'matching', 'proximity', 'spatial', 'postgresql', 'pgvector', 'education', 'schedule', 'optimization'],
    [0.51, 0.78, 0.65],
    [
      { targetSlug: 'tamiltrove', similarity: 0.92, tagLabel: 'NLP RETRIEVAL / VECTOR SEARCH' },
      { targetSlug: 'routerx-careline', similarity: 0.88, tagLabel: 'SPATIAL PROXIMITY / OPTIMIZATION' },
      { targetSlug: 'tempo', similarity: 0.84, tagLabel: 'LOCAL PGVECTOR / COGNITIVE' },
    ]
  ),

  // 3. domain-spatial-ml
  buildProject(
    'routerx-careline',
    'RouteRx (Careline)',
    DOMAINS[2],
    155,
    64,
    '1st Place ASA DataFest',
    '2026',
    'Python · OSRM · Folium · GeoPandas',
    'Sub-15ms OSRM transit isochrone engine identifying healthcare deserts across 141 census blocks.',
    ['spatial', 'isochrone', 'osrm', 'routing', 'transit', 'desert', 'folium', 'geopandas', 'python', 'datafest', 'award', 'sub-15ms', 'accessibility', 'matrix'],
    [-0.32, 0.74, 0.93],
    [
      { targetSlug: 'nyc-housing-market-ai', similarity: 0.90, tagLabel: 'SPATIAL / GEO-ANALYTICS' },
      { targetSlug: 'tutormatch', similarity: 0.88, tagLabel: 'PROXIMITY ENGINE / ROUTING' },
      { targetSlug: 'healios', similarity: 0.87, tagLabel: 'HEALTHCARE / HIGH-RELIABILITY' },
    ]
  ),
  buildProject(
    'cs50-ai-projects',
    'CS50 AI Suite',
    DOMAINS[2],
    100,
    64,
    'Harvard CS50 AI Origin',
    '2025',
    'Python · Minimax · HMMs · Q-Learning',
    'Formal classical AI, constraint satisfaction, adversarial search, and probabilistic inference systems.',
    ['ai', 'classical', 'minimax', 'q-learning', 'hmm', 'markov', 'probabilistic', 'reasoning', 'python', 'harvard', 'algorithms', 'adversarial'],
    [0.24, 0.62, 0.85],
    [
      { targetSlug: 'philocracy', similarity: 0.89, tagLabel: 'FORMAL LOGIC / GRAPH SEARCH' },
      { targetSlug: 'tamiltrove', similarity: 0.84, tagLabel: 'SEARCH ALGORITHMS / HEURISTICS' },
      { targetSlug: 'carstomer', similarity: 0.82, tagLabel: 'ML REGRESSION / MODELING' },
    ]
  ),

  // 4. domain-serverless-cloud
  buildProject(
    'software-2-projects',
    'Software 2 Systems',
    DOMAINS[3],
    80,
    62,
    '100% JUnit Suite',
    '2024',
    'Java · Custom Collections · OOP',
    'Formal data structures, custom collection implementations, tree invariants, and mathematical contracts.',
    ['java', 'data', 'structures', 'binary', 'trees', 'hashing', 'invariants', 'junit', 'formal', 'algorithms', 'contracts'],
    [-0.64, -0.45, 0.72],
    [
      { targetSlug: 'software-1-projects', similarity: 0.96, tagLabel: 'FORMAL JAVA / INVARIANTS' },
      { targetSlug: 'cs50-ai-projects', similarity: 0.85, tagLabel: 'DATA STRUCTURES / ALGORITHMS' },
      { targetSlug: 'philocracy', similarity: 0.81, tagLabel: 'RECURSIVE TREES / SCHEMAS' },
    ]
  ),
  buildProject(
    'software-1-projects',
    'Software 1 Foundations',
    DOMAINS[3],
    15,
    62,
    'Strict Invariants',
    '2023',
    'Java · Modular Architecture',
    'Component-based software engineering, modular design patterns, and rigorous algorithmic proofs.',
    ['java', 'oop', 'modular', 'design', 'patterns', 'invariants', 'formal', 'contracts', 'algorithms'],
    [-0.68, -0.52, 0.68],
    [
      { targetSlug: 'software-2-projects', similarity: 0.96, tagLabel: 'MODULAR DESIGN / CONTRACTS' },
      { targetSlug: 'cs50-ai-projects', similarity: 0.83, tagLabel: 'ALGORITHMIC PROOFS / DATA' },
      { targetSlug: 'portfolio-website', similarity: 0.80, tagLabel: 'STRICT TYPING / ARCHITECTURE' },
    ]
  ),

  // 5. domain-telemetry-ui
  buildProject(
    'apexis',
    'Apexis Telemetry',
    DOMAINS[4],
    -165,
    62,
    '60 FPS Locked',
    '2026',
    'Next.js · Web Workers · SQLite · Canvas',
    'Deterministic 60 FPS multi-car simulation Web Worker, client-side broadcast OCR, and sub-12ms SQLite lookups.',
    ['motorsport', 'f1', 'telemetry', 'simulation', '60fps', 'web', 'workers', 'sqlite', 'canvas', 'tesseract', 'ocr', 'low-latency', 'c++', 'physics', 'race', 'real-time'],
    [0.94, -0.45, 0.92],
    [
      { targetSlug: 'tempo', similarity: 0.93, tagLabel: 'DEDICATED WORKERS / SQLITE ENGINE' },
      { targetSlug: 'healios', similarity: 0.85, tagLabel: '60 FPS CANVAS / LOW-LATENCY' },
      { targetSlug: 'carstomer', similarity: 0.85, tagLabel: 'AUTOMOTIVE / TELEMETRY' },
    ]
  ),
  buildProject(
    'tempo',
    'Tempo Task Suite',
    DOMAINS[4],
    -95,
    62,
    '100% Local Air-Gap',
    '2026',
    'Electron · React · TypeScript · SQLite',
    'Air-gapped cognitive buffer with pgvector emotional memory and encrypted local SQLite persistence.',
    ['air-gap', 'local-first', 'state', 'machine', 'sqlite', 'electron', 'react', 'typescript', 'pgvector', 'cognitive', 'privacy', 'security', 'deterministic', 'buffer'],
    [0.82, 0.38, 0.77],
    [
      { targetSlug: 'apexis', similarity: 0.93, tagLabel: 'SQLITE RUNTIME / DETERMINISTIC' },
      { targetSlug: 'tutormatch', similarity: 0.84, tagLabel: 'PGVECTOR MEMORY / EMOTIONAL BUFFER' },
      { targetSlug: 'syntinuum-podcast-website', similarity: 0.81, tagLabel: 'AUDIO DSP / LOCAL BUFFER' },
    ]
  ),

  // 6. domain-spatial-3d
  buildProject(
    'nyc-housing-market-ai',
    'NYC Housing OS',
    DOMAINS[5],
    -80,
    64,
    'Top Project Award',
    '2025',
    'Next.js · Deck.GL · Mapbox GL · Python',
    'Hardware-accelerated Deck.GL 3D urban housing market simulation and demographic wealth physics.',
    ['3d', 'spatial', 'geospatial', 'deck.gl', 'mapbox', 'urban', 'housing', 'market', 'clustering', 'k-means', 'python', 'scikit-learn', 'visualization'],
    [-0.28, 0.82, 0.89],
    [
      { targetSlug: 'routerx-careline', similarity: 0.90, tagLabel: '3D GEOSPATIAL / URBAN DATA' },
      { targetSlug: 'carstomer', similarity: 0.87, tagLabel: 'VALUATION REGRESSION / SCIKIT-LEARN' },
      { targetSlug: 'philocracy', similarity: 0.84, tagLabel: 'INTERACTIVE CANVAS / D3.JS' },
    ]
  ),
  buildProject(
    'philocracy',
    'Philocracy Platform',
    DOMAINS[5],
    -20,
    64,
    'Arbitrary N Depth',
    '2025',
    'React · TypeScript · D3.js · Canvas',
    'Structured philosophical debate schema trees, fallacies detection, and argument graph visualization.',
    ['argument', 'graph', 'debate', 'tree', 'd3', 'canvas', 'react', 'typescript', 'philosophy', 'schema', 'fallacy', 'spatial', 'interactive'],
    [0.35, 0.71, 0.76],
    [
      { targetSlug: 'cs50-ai-projects', similarity: 0.89, tagLabel: 'SCHEMA TREES / LOGIC' },
      { targetSlug: 'tamiltrove', similarity: 0.86, tagLabel: 'TEXT GRAPH / SEMANTICS' },
      { targetSlug: 'nyc-housing-market-ai', similarity: 0.84, tagLabel: 'INTERACTIVE CANVAS / VISUALIZATION' },
    ]
  ),
  buildProject(
    'carstomer',
    'CarStomer',
    DOMAINS[5],
    35,
    64,
    'Random Forest Regressor',
    '2024',
    'React · Vite · Scikit-Learn',
    'Real-time automotive valuation engine with interactive market depreciation curves.',
    ['automotive', 'valuation', 'random', 'forest', 'regressor', 'scikit-learn', 'chart.js', 'machine', 'learning', 'pricing'],
    [0.65, -0.42, 0.81],
    [
      { targetSlug: 'nyc-housing-market-ai', similarity: 0.87, tagLabel: 'MARKET VALUATION / ML' },
      { targetSlug: 'apexis', similarity: 0.85, tagLabel: 'AUTOMOTIVE TELEMETRY / KINETICS' },
      { targetSlug: 'cs50-ai-projects', similarity: 0.82, tagLabel: 'REGRESSION / PREDICTIVE AI' },
    ]
  ),

  // 7. domain-media-streaming
  buildProject(
    'syntinuum-podcast-website',
    'Syntinuum Streaming',
    DOMAINS[6],
    -15,
    66,
    '100K+ Impressions',
    '2025',
    'Next.js · Web Audio API · Tailwind',
    'Live DSP audio waveform player, interactive episode scrubber, and podcast distribution platform.',
    ['audio', 'dsp', 'waveform', 'streaming', 'web', 'audio', 'api', 'next.js', 'tailwind', 'media', 'podcast', 'platform', 'spotify'],
    [0.18, -0.74, 0.85],
    [
      { targetSlug: 'anna-birthday', similarity: 0.89, tagLabel: 'WEB AUDIO DSP / AUDIO-REACTIVE' },
      { targetSlug: 'portfolio-website', similarity: 0.88, tagLabel: 'NEXT.JS / LIVING DESIGN TOKENS' },
      { targetSlug: 'tempo', similarity: 0.81, tagLabel: 'REAL-TIME DSP / STATE MACHINE' },
    ]
  ),
  buildProject(
    'murugesan-rajaram-lab',
    'Rajaram Lab Portal',
    DOMAINS[6],
    35,
    66,
    '$0/mo Static SSG',
    '2025',
    'Next.js · Markdown · GitHub Actions',
    'Academic portal and publication index for the OSU Digital Pathology laboratory.',
    ['academic', 'portal', 'pathology', 'biomedical', 'research', 'publications', 'markdown', 'ssg', 'static', 'next.js'],
    [-0.45, -0.68, 0.72],
    [
      { targetSlug: 'cv-allergy-wheal', similarity: 0.88, tagLabel: 'OSU PATHOLOGY / BIOMEDICAL' },
      { targetSlug: 'momwebsite', similarity: 0.87, tagLabel: 'ZERO-DRIFT TYPOGRAPHY / STATIC SSG' },
      { targetSlug: 'portfolio-website', similarity: 0.85, tagLabel: 'HIGH PERFORMANCE / NEXT.JS' },
    ]
  ),
  buildProject(
    'momwebsite',
    'Client Services Portal',
    DOMAINS[6],
    85,
    66,
    '100/100 Core Web Vitals',
    '2024',
    'Next.js · TypeScript · Tailwind CSS',
    'Accounting and financial consulting portal with strict zero-drift typography.',
    ['client', 'portal', 'accounting', 'core', 'web', 'vitals', 'next.js', 'typescript', 'tailwind', 'performance'],
    [-0.32, -0.81, 0.65],
    [
      { targetSlug: 'murugesan-rajaram-lab', similarity: 0.87, tagLabel: 'STATIC SSG / 100 CWV' },
      { targetSlug: 'portfolio-website', similarity: 0.86, tagLabel: 'TYPOGRAPHIC RIGOR / TAILWIND' },
      { targetSlug: 'tutormatch', similarity: 0.80, tagLabel: 'CLIENT PORTAL / FULL-STACK' },
    ]
  ),
  buildProject(
    'portfolio-website',
    'Portfolio V4 System',
    DOMAINS[6],
    135,
    66,
    'DTCG 3-Tier Tokens',
    '2026',
    'Next.js · Canvas · Framer Motion',
    'Personal engineering portfolio with procedural forged-carbon canvas and Swiss grid.',
    ['dtcg', 'design', 'tokens', 'next.js', 'pages', 'router', 'canvas', 'shaders', 'framer', 'motion', 'carbon', 'ssg'],
    [0.12, -0.85, 0.89],
    [
      { targetSlug: 'syntinuum-podcast-website', similarity: 0.88, tagLabel: 'PROCEDURAL CANVAS / DESIGN TOKENS' },
      { targetSlug: 'momwebsite', similarity: 0.86, tagLabel: 'SWISS BLUEPRINT / RESPONSIVE' },
      { targetSlug: 'murugesan-rajaram-lab', similarity: 0.85, tagLabel: 'STATIC SSG ARCHITECTURE' },
    ]
  ),
  buildProject(
    'anna-birthday',
    'Interactive Tribute',
    DOMAINS[6],
    175,
    66,
    '100% Delight Metric',
    '2024',
    'HTML5 · CSS Keyframes · Audio DSP',
    'Bespoke narrative web experience with audio-reactive visuals and interactive milestone timeline.',
    ['creative', 'audio', 'reactive', 'interactive', 'timeline', 'css', 'keyframes', 'celebration', 'canvas'],
    [0.22, -0.68, 0.74],
    [
      { targetSlug: 'syntinuum-podcast-website', similarity: 0.89, tagLabel: 'AUDIO DSP / CANVAS VISUALS' },
      { targetSlug: 'portfolio-website', similarity: 0.83, tagLabel: 'INTERACTIVE STORYTELLING' },
      { targetSlug: 'philocracy', similarity: 0.80, tagLabel: 'ANIMATED CANVAS / PHYSICS' },
    ]
  ),
];

// Helper to compute semantic match cosine score against a query string
function computeCosineSimilarity(query: string, project: ConstellationProject): number {
  if (!query.trim()) return 0;
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return 0;

  let hits = 0;
  const searchable = `${project.title} ${project.stack} ${project.summary} ${project.keywords.join(' ')}`.toLowerCase();

  for (const term of terms) {
    if (searchable.includes(term)) {
      hits += 1;
    }
  }

  if (hits === 0) return 0.15;
  const rawScore = 0.55 + (hits / terms.length) * 0.42;
  return Math.min(0.99, Math.round(rawScore * 100) / 100);
}

// ---------------------------------------------------------------------------
// AWWWARDS-CALIBER V6.0 VECTOR CODEGRAPH ENGINE
// ---------------------------------------------------------------------------

export const HomeCodeGraph: React.FC = () => {
  const router = useRouter();
  const { isReduced } = useMotionPreference();

  // Navigation State
  const [activeCore, setActiveCore] = useState<CoreId | 'all'>('all');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ConstellationProject | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<ConstellationDomain | null>(null);
  const [hoveredCore, setHoveredCore] = useState<ConstellationCore | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileSelectedProject, setMobileSelectedProject] = useState<ConstellationProject | null>(null);

  // Singularity Warp State
  const [warpProject, setWarpProject] = useState<ConstellationProject | null>(null);
  const warpStartRef = useRef<number | null>(null);

  // Canvas & Physics References
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, cursorScreenX: -1000, cursorScreenY: -1000 });
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Spark Particle Pool (40 particles)
  const particlesRef = useRef<SparkParticle[]>([]);

  // Elastic Edge Physics State Pool
  const edgesPhysicsRef = useRef<EdgePhysics[]>([]);

  // Initialize Elastic Edges
  useEffect(() => {
    const list: EdgePhysics[] = [];

    // Origin -> Cores (2)
    CORES.forEach((core) => {
      list.push({
        id: `origin-${core.id}`,
        fromType: 'origin',
        fromId: 'origin',
        toType: 'core',
        toId: core.id,
        color: core.color,
        baseCurve: 0,
        mx: core.wx * 0.5,
        my: core.wy * 0.5,
        vx: 0,
        vy: 0,
        restX: core.wx * 0.5,
        restY: core.wy * 0.5,
      });
    });

    // Cores -> Domains (7)
    DOMAINS.forEach((domain) => {
      const parentCore = CORES.find((c) => c.id === domain.coreId);
      const cx = parentCore ? parentCore.wx : 0;
      const cy = parentCore ? parentCore.wy : 0;
      const midX = (cx + domain.wx) * 0.5;
      const midY = (cy + domain.wy) * 0.5 - 12;

      list.push({
        id: `core-${domain.id}`,
        fromType: 'core',
        fromId: domain.coreId,
        toType: 'domain',
        toId: domain.id,
        color: domain.color,
        baseCurve: -12,
        mx: midX,
        my: midY,
        vx: 0,
        vy: 0,
        restX: midX,
        restY: midY,
      });
    });

    // Domains -> Projects (18)
    PROJECTS.forEach((proj) => {
      const parentDomain = DOMAINS.find((d) => d.id === proj.domainId);
      const dx = parentDomain ? parentDomain.wx : 0;
      const dy = parentDomain ? parentDomain.wy : 0;
      const midX = (dx + proj.wx) * 0.5;
      const midY = (dy + proj.wy) * 0.5;

      list.push({
        id: `domain-${proj.slug}`,
        fromType: 'domain',
        fromId: proj.domainId,
        toType: 'project',
        toId: proj.slug,
        color: proj.color,
        baseCurve: 0,
        mx: midX,
        my: midY,
        vx: 0,
        vy: 0,
        restX: midX,
        restY: midY,
      });
    });

    edgesPhysicsRef.current = list;
  }, []);

  // Compute live similarity map for all projects
  const similarityScores = useMemo(() => {
    const map = new Map<string, number>();
    PROJECTS.forEach((p) => {
      map.set(p.slug, computeCosineSimilarity(searchQuery, p));
    });
    return map;
  }, [searchQuery]);

  // Handle Singularity Dive transition to Case Study
  const triggerSingularityDive = useCallback(
    (project: ConstellationProject) => {
      if (isReduced) {
        router.push(`/projects/${project.slug}`);
        return;
      }
      setWarpProject(project);
      warpStartRef.current = performance.now();
    },
    [isReduced, router]
  );

  // Mouse Move & Interaction Handling on Stage
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    const normX = (curX / rect.width) * 2 - 1;
    const normY = (curY / rect.height) * 2 - 1;

    const m = mouseRef.current;
    m.vx = curX - m.lastX;
    m.vy = curY - m.lastY;
    m.lastX = curX;
    m.lastY = curY;
    m.cursorScreenX = curX;
    m.cursorScreenY = curY;

    // Smoothed target normalized coords
    m.x = normX;
    m.y = normY;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const m = mouseRef.current;
    m.cursorScreenX = -1000;
    m.cursorScreenY = -1000;
    m.x = 0;
    m.y = 0;
    setHoveredProject(null);
    setHoveredDomain(null);
    setHoveredCore(null);
  }, []);

  // Click handling on Canvas
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // If already hovering a project, direct click triggers Singularity Dive immediately
      if (hoveredProject) {
        triggerSingularityDive(hoveredProject);
        setMobileSelectedProject(hoveredProject);
        return;
      }

      // Project hit testing against screen positions computed in last render
      // Check projects first (highest z-index / smallest targets)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const F = 900;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      let clickedProj: ConstellationProject | null = null;
      PROJECTS.forEach((p) => {
        const isCoreActive = activeCore === 'all' || activeCore === p.coreId;
        const targetWz = isCoreActive ? 140 : -100;
        const scale = F / (F - targetWz);
        const rotX = p.wx + mx * 28 * (targetWz / 150);
        const rotY = p.wy + my * 20 * (targetWz / 150);
        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;

        const dist = Math.hypot(sx - clickX, sy - clickY);
        if (dist <= 22) {
          clickedProj = p;
        }
      });

      if (clickedProj) {
        triggerSingularityDive(clickedProj);
        setMobileSelectedProject(clickedProj);
        return;
      }

      // Check Domains
      let clickedDom: ConstellationDomain | null = null;
      DOMAINS.forEach((d) => {
        const isCoreActive = activeCore === 'all' || activeCore === d.coreId;
        const targetWz = isCoreActive ? 75 : -80;
        const scale = F / (F - targetWz);
        const rotX = d.wx + mx * 28 * (targetWz / 150);
        const rotY = d.wy + my * 20 * (targetWz / 150);
        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;

        const dist = Math.hypot(sx - clickX, sy - clickY);
        if (dist <= 20) {
          clickedDom = d;
        }
      });

      if (clickedDom) {
        setActiveDomain((prev) => (prev === (clickedDom as ConstellationDomain).id ? null : (clickedDom as ConstellationDomain).id));
        setActiveCore((clickedDom as ConstellationDomain).coreId);
        return;
      }

      // Check Cores
      CORES.forEach((c) => {
        const targetWz = activeCore === c.id ? 80 : 20;
        const scale = F / (F - targetWz);
        const rotX = c.wx + mx * 28 * (targetWz / 150);
        const rotY = c.wy + my * 20 * (targetWz / 150);
        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;

        const dist = Math.hypot(sx - clickX, sy - clickY);
        if (dist <= 24) {
          setActiveCore((prev) => (prev === c.id ? 'all' : c.id));
          setActiveDomain(null);
        }
      });
    },
    [activeCore, triggerSingularityDive]
  );

  // IntersectionObserver to pause rendering when offscreen
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Main 60 FPS Canvas Physics & Optical Bloom Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let smoothMx = 0;
    let smoothMy = 0;
    const F = 900;

    const renderLoop = (time: number) => {
      animFrameRef.current = requestAnimationFrame(renderLoop);
      if (!isVisibleRef.current) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth mouse parallax interpolation
      const mouse = mouseRef.current;
      smoothMx += (mouse.x - smoothMx) * 0.06;
      smoothMy += (mouse.y - smoothMy) * 0.06;

      // -------------------------------------------------------------------
      // SINGULARITY WARP CAMERA EXPONENTIAL ZOOM DIVE
      // -------------------------------------------------------------------
      let warpT = 0;
      let warpEase = 0;
      let warpFocusX = centerX;
      let warpFocusY = centerY;

      if (warpProject && warpStartRef.current) {
        warpT = Math.min(1.0, (time - warpStartRef.current) / 420);
        // Exponential zoom ease curve
        warpEase = Math.pow(warpT, 3.2);

        // Target screen coordinate of the clicked dot
        const targetWz = 160;
        const scale = F / (F - targetWz);
        warpFocusX = centerX + (warpProject.wx + smoothMx * 28 * (targetWz / 150)) * scale;
        warpFocusY = centerY + (warpProject.wy + smoothMy * 20 * (targetWz / 150)) * scale;

        // Apply camera zoom transform centered on clicked dot
        const cameraZoom = 1.0 + warpEase * 16.0;
        ctx.translate(warpFocusX, warpFocusY);
        ctx.scale(cameraZoom, cameraZoom);
        ctx.translate(-warpFocusX, -warpFocusY);

        // Once warp reaches 95%, navigate to the Case Study
        if (warpT >= 0.95) {
          router.push(`/projects/${warpProject.slug}`);
          setWarpProject(null);
          warpStartRef.current = null;
        }
      }

      // -------------------------------------------------------------------
      // PASS 1: UMAP TOPOGRAPHICAL DENSITY CONTOURS (GRAVITATIONAL WELLS)
      // -------------------------------------------------------------------
      ctx.save();
      const drawContourWell = (cx: number, cy: number, baseRadius: number, accentColor: string, count: number) => {
        for (let ring = 1; ring <= count; ring++) {
          const rBase = baseRadius * (ring / count);
          ctx.beginPath();
          for (let step = 0; step <= 64; step++) {
            const theta = (step / 64) * Math.PI * 2;
            const wave = isReduced ? 0 : 8 * Math.sin(3 * theta + time * 0.0007) + 5 * Math.cos(5 * theta - time * 0.0005);
            const r = rBase + wave;
            const px = cx + Math.cos(theta) * r;
            const py = cy + Math.sin(theta) * r;
            if (step === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          ctx.strokeStyle = ring === count ? accentColor : 'rgba(21, 56, 117, 0.24)';
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = ring === count ? 0.35 : 0.15;
          ctx.stroke();

          // Small elevation gradient tick
          if (ring === 2 && !isReduced) {
            const tickAngle = (time * 0.0002) % (Math.PI * 2);
            const tx = cx + Math.cos(tickAngle) * rBase;
            const ty = cy + Math.sin(tickAngle) * rBase;
            ctx.fillStyle = '#C8D2E0';
            ctx.font = '8px monospace';
            ctx.globalAlpha = 0.45;
            ctx.fillText(`∇ 0.${70 - ring * 15}`, tx + 4, ty - 2);
          }
        }
      };

      // Draw density wells behind Backend and Frontend Cores
      const bCoreScale = F / (F - 40);
      const bCoreX = centerX + (-260 + smoothMx * 28 * (40 / 150)) * bCoreScale;
      const bCoreY = centerY + (0 + smoothMy * 20 * (40 / 150)) * bCoreScale;
      drawContourWell(bCoreX, bCoreY, 195, 'rgba(255, 40, 0, 0.28)', 3);

      const fCoreScale = F / (F - 40);
      const fCoreX = centerX + (260 + smoothMx * 28 * (40 / 150)) * fCoreScale;
      const fCoreY = centerY + (0 + smoothMy * 20 * (40 / 150)) * fCoreScale;
      drawContourWell(fCoreX, fCoreY, 195, 'rgba(37, 99, 235, 0.28)', 3);

      ctx.restore();

      // -------------------------------------------------------------------
      // PASS 2: 2.5D PERSPECTIVE NODE PROJECTION & DEPTH MAP
      // -------------------------------------------------------------------
      const projectedNodes = new Map<string, { sx: number; sy: number; scale: number; alpha: number; wz: number }>();

      // Origin
      const originScale = F / F;
      projectedNodes.set('origin', {
        sx: centerX,
        sy: centerY,
        scale: originScale,
        alpha: 0.85,
        wz: 0,
      });

      // Cores
      CORES.forEach((core) => {
        const isCoreActive = activeCore === 'all' || activeCore === core.id;
        const targetWz = isCoreActive ? (activeCore === core.id ? 90 : 40) : -80;
        const scale = F / (F - targetWz);
        const rotX = core.wx + smoothMx * 28 * (targetWz / 150);
        const rotY = core.wy + smoothMy * 20 * (targetWz / 150);
        projectedNodes.set(core.id, {
          sx: centerX + rotX * scale,
          sy: centerY + rotY * scale,
          scale,
          alpha: isCoreActive ? 1.0 : 0.28,
          wz: targetWz,
        });
      });

      // Domains
      DOMAINS.forEach((domain) => {
        const isCoreActive = activeCore === 'all' || activeCore === domain.coreId;
        const isDomainActive = activeDomain === null || activeDomain === domain.id;
        const targetWz = isCoreActive && isDomainActive ? 75 : -110;
        const scale = F / (F - targetWz);
        const rotX = domain.wx + smoothMx * 28 * (targetWz / 150);
        const rotY = domain.wy + smoothMy * 20 * (targetWz / 150);
        projectedNodes.set(domain.id, {
          sx: centerX + rotX * scale,
          sy: centerY + rotY * scale,
          scale,
          alpha: isCoreActive && isDomainActive ? 0.95 : 0.22,
          wz: targetWz,
        });
      });

      // Projects (with semantic query pull toward center)
      let hoveredCandidate: ConstellationProject | null = null;
      PROJECTS.forEach((proj) => {
        const isCoreActive = activeCore === 'all' || activeCore === proj.coreId;
        const isDomainActive = activeDomain === null || activeDomain === proj.domainId;
        const sim = similarityScores.get(proj.slug) || 0;

        // Semantic Gravity Re-Projection:
        // High similarity pulls toward center focal orbit; low similarity pushes outward
        let targetWx = proj.wx;
        let targetWy = proj.wy;
        if (searchQuery.trim() && sim > 0) {
          if (sim > 0.65) {
            targetWx = proj.wx * (1 - sim * 0.42);
            targetWy = proj.wy * (1 - sim * 0.42);
          } else {
            targetWx = proj.wx * 1.15;
            targetWy = proj.wy * 1.15;
          }
        }

        const targetWz = isCoreActive && isDomainActive ? (sim > 0.65 ? 175 : 125) : -130;
        const scale = F / (F - targetWz);
        const rotX = targetWx + smoothMx * 28 * (targetWz / 150);
        const rotY = targetWy + smoothMy * 20 * (targetWz / 150);
        const sx = centerX + rotX * scale;
        const sy = centerY + rotY * scale;

        const effectiveAlpha = searchQuery.trim()
          ? sim > 0.65
            ? 1.0
            : 0.18
          : isCoreActive && isDomainActive
          ? 0.95
          : 0.22;

        projectedNodes.set(proj.slug, {
          sx,
          sy,
          scale,
          alpha: effectiveAlpha,
          wz: targetWz,
        });

        // Hit testing for hover
        const distToMouse = Math.hypot(sx - mouse.cursorScreenX, sy - mouse.cursorScreenY);
        if (distToMouse <= 18 && !warpProject) {
          hoveredCandidate = proj;
        }
      });

      // Update hovered project state
      if (hoveredCandidate !== hoveredProject) {
        setHoveredProject(hoveredCandidate);
      }

      // Update canvas cursor style
      canvas.style.cursor = hoveredCandidate ? 'pointer' : 'default';

      // -------------------------------------------------------------------
      // PASS 3: ELASTIC VERLET STRING PHYSICS ON CONNECTING THREADS
      // -------------------------------------------------------------------
      const edges = edgesPhysicsRef.current;
      edges.forEach((edge) => {
        const fromNode = projectedNodes.get(edge.fromId);
        const toNode = projectedNodes.get(edge.toId);
        if (!fromNode || !toNode) return;

        // Base geometric midpoint with natural curvature
        const naturalMidX = (fromNode.sx + toNode.sx) * 0.5;
        const naturalMidY = (fromNode.sy + toNode.sy) * 0.5 + edge.baseCurve;

        edge.restX = naturalMidX;
        edge.restY = naturalMidY;

        // Spring restoration toward rest position
        let fx = (edge.restX - edge.mx) * 0.14;
        let fy = (edge.restY - edge.my) * 0.14;

        // Magnetic cursor deflection / plucking within 95px radius
        const dist = Math.hypot(edge.mx - mouse.cursorScreenX, edge.my - mouse.cursorScreenY);
        if (dist < 95 && dist > 1 && !isReduced) {
          const force = Math.pow(1 - dist / 95, 2);
          fx += ((edge.mx - mouse.cursorScreenX) / dist) * force * 4.5 + mouse.vx * force * 0.18;
          fy += ((edge.my - mouse.cursorScreenY) / dist) * force * 4.5 + mouse.vy * force * 0.18;

          // Spawn spark particles along vibrating thread
          if (Math.hypot(edge.vx, edge.vy) > 0.6 && particlesRef.current.length < 35 && Math.random() < 0.25) {
            particlesRef.current.push({
              x: edge.mx,
              y: edge.my,
              vx: (Math.random() - 0.5) * 1.8,
              vy: (Math.random() - 0.5) * 1.8,
              life: 1.0,
              maxLife: 24 + Math.random() * 16,
              color: edge.color,
            });
          }
        }

        // Damped harmonic oscillation
        edge.vx = (edge.vx + fx) * 0.82;
        edge.vy = (edge.vy + fy) * 0.82;
        edge.mx += edge.vx;
        edge.my += edge.vy;

        // Draw elastic Bézier string
        ctx.beginPath();
        ctx.moveTo(fromNode.sx, fromNode.sy);
        ctx.quadraticCurveTo(edge.mx, edge.my, toNode.sx, toNode.sy);

        const isEdgePlucked = Math.hypot(edge.vx, edge.vy) > 0.4;
        const isHoveredLineage =
          hoveredProject && (edge.toId === hoveredProject.slug || edge.fromId === hoveredProject.domainId);

        ctx.strokeStyle = isHoveredLineage ? '#FF2800' : isEdgePlucked ? '#E6ECF5' : edge.color;
        ctx.lineWidth = isHoveredLineage ? 1.8 : isEdgePlucked ? 1.5 : 0.8;
        ctx.globalAlpha = isHoveredLineage
          ? 0.95
          : isEdgePlucked
          ? 0.85
          : Math.min(fromNode.alpha, toNode.alpha) * 0.4;
        ctx.stroke();
      });

      // Update and render spark particles along strings
      const activeParticles = particlesRef.current;
      for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;

        if (p.life <= 0) {
          activeParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.9;
        ctx.fill();
      }

      // -------------------------------------------------------------------
      // PASS 4: k-NN NEAREST-NEIGHBOR CROSS-LINKS ON HOVER
      // -------------------------------------------------------------------
      if (hoveredProject && !warpProject) {
        const originProjNode = projectedNodes.get(hoveredProject.slug);
        if (originProjNode) {
          hoveredProject.nearestNeighbors.forEach((link) => {
            const targetProjNode = projectedNodes.get(link.targetSlug);
            if (!targetProjNode) return;

            // Draw glowing dashed k-NN bridge
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(originProjNode.sx, originProjNode.sy);
            ctx.lineTo(targetProjNode.sx, targetProjNode.sy);
            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 1.4;
            ctx.globalAlpha = 0.85;
            ctx.stroke();

            // Draw midpoint similarity pill
            const midX = (originProjNode.sx + targetProjNode.sx) * 0.5;
            const midY = (originProjNode.sy + targetProjNode.sy) * 0.5;

            const pillText = `${link.similarity.toFixed(2)} SIM · ${link.tagLabel}`;
            ctx.font = '8.5px monospace';
            const textWidth = ctx.measureText(pillText).width;

            ctx.fillStyle = '#03050A';
            ctx.fillRect(midX - textWidth / 2 - 5, midY - 7, textWidth + 10, 14);

            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(midX - textWidth / 2 - 5, midY - 7, textWidth + 10, 14);

            ctx.fillStyle = '#C8D2E0';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pillText, midX, midY);
            ctx.restore();
          });
        }
      }

      // -------------------------------------------------------------------
      // PASS 5: MULTI-PASS OPTICAL BLOOM & PRECISION RETICLES
      // -------------------------------------------------------------------

      // Pass 5A: Additive Optical Bloom (globalCompositeOperation = 'lighter')
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      PROJECTS.forEach((proj) => {
        const node = projectedNodes.get(proj.slug);
        if (!node || node.alpha < 0.25) return;

        const isHovered = hoveredProject?.slug === proj.slug;
        const sim = similarityScores.get(proj.slug) || 0;
        const bloomRadius = (isHovered ? 34 : sim > 0.65 ? 26 : 14) * node.scale;

        const radGrad = ctx.createRadialGradient(node.sx, node.sy, 0, node.sx, node.sy, bloomRadius);
        radGrad.addColorStop(0, proj.color === '#FF2800' ? 'rgba(255, 40, 0, 0.55)' : 'rgba(37, 99, 235, 0.55)');
        radGrad.addColorStop(0.5, proj.color === '#FF2800' ? 'rgba(255, 40, 0, 0.18)' : 'rgba(37, 99, 235, 0.18)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, bloomRadius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Pass 5B: Segmented Machined Reticles & Solid Cores (source-over)
      // Tier 0: Origin Reticle
      const originNode = projectedNodes.get('origin');
      if (originNode) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(originNode.sx, originNode.sy, 16 * originNode.scale, 0, Math.PI * 2);
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#C8D2E0';
        ctx.lineWidth = 0.9;
        ctx.globalAlpha = 0.45;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(originNode.sx, originNode.sy, 4.5 * originNode.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#C8D2E0';
        ctx.fill();

        ctx.font = '8.5px monospace';
        ctx.fillStyle = '#7E8B9B';
        ctx.textAlign = 'center';
        ctx.fillText('SYSTEMS CORE', originNode.sx, originNode.sy + 28);
        ctx.restore();
      }

      // Tier 1: Cores
      CORES.forEach((core) => {
        const node = projectedNodes.get(core.id);
        if (!node) return;

        ctx.save();
        // Rotating segmented orbital ring
        const rot = isReduced ? 0 : (time * 0.0004) % (Math.PI * 2);
        ctx.translate(node.sx, node.sy);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.arc(0, 0, 16 * node.scale, 0, Math.PI * 2);
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = core.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = node.alpha * 0.8;
        ctx.stroke();
        ctx.rotate(-rot);

        // Core dot
        ctx.beginPath();
        ctx.arc(0, 0, 6 * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = core.color;
        ctx.fill();

        // Incandescent pinpoint core
        ctx.beginPath();
        ctx.arc(0, 0, 2.5 * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#F4F6F9';
        ctx.fill();

        // Label
        ctx.font = 'bold 12px serif';
        ctx.fillStyle = '#F4F6F9';
        ctx.textAlign = 'center';
        ctx.globalAlpha = node.alpha;
        ctx.fillText(`${core.shortLabel} [${core.projectCount}]`, 0, -22 * node.scale);
        ctx.restore();
      });

      // Tier 2: Domains
      DOMAINS.forEach((domain) => {
        const node = projectedNodes.get(domain.id);
        if (!node) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, 10 * node.scale, 0, Math.PI * 2);
        ctx.strokeStyle = domain.color;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = node.alpha * 0.7;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.sx, node.sy, 4 * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = domain.color;
        ctx.globalAlpha = node.alpha;
        ctx.fill();

        ctx.font = '9px monospace';
        ctx.fillStyle = '#C8D2E0';
        ctx.textAlign = 'center';
        ctx.fillText(domain.shortLabel, node.sx, node.sy + 18 * node.scale);
        ctx.restore();
      });

      // Tier 3: Projects (Pinpoint Incandescent Cores & Non-Colliding Labels)
      PROJECTS.forEach((proj) => {
        const node = projectedNodes.get(proj.slug);
        if (!node) return;

        const isHovered = hoveredProject?.slug === proj.slug;
        const sim = similarityScores.get(proj.slug) || 0;
        const labelOnRight = Math.cos((proj.angle * Math.PI) / 180) >= 0;

        ctx.save();
        ctx.globalAlpha = node.alpha;

        // Rotating reticle ring on hovered dot
        if (isHovered && !isReduced) {
          const retRot = (time * 0.0012) % (Math.PI * 2);
          ctx.translate(node.sx, node.sy);
          ctx.rotate(retRot);
          ctx.beginPath();
          ctx.arc(0, 0, 11 * node.scale, 0, Math.PI * 2);
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#C8D2E0';
          ctx.lineWidth = 1.0;
          ctx.stroke();
          ctx.rotate(-retRot);
          ctx.translate(-node.sx, -node.sy);
        }

        // Project Core
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, (isHovered ? 5.5 : 4.0) * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#FF2800' : proj.color;
        ctx.fill();

        // Incandescent Pinpoint Alabaster Core
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, 2.0 * node.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#F4F6F9';
        ctx.fill();

        // Micro-Labels (Title + Metric or Live Similarity Score)
        const textAnchorX = node.sx + (labelOnRight ? 9 : -9) * node.scale;
        const textAnchorY = node.sy + 3;

        ctx.font = '500 11px serif';
        ctx.fillStyle = isHovered ? '#FFFFFF' : '#F4F6F9';
        ctx.textAlign = labelOnRight ? 'start' : 'end';
        ctx.fillText(proj.title, textAnchorX, textAnchorY);

        // Sub-Metric / Live Cosine Similarity Badge
        ctx.font = 'bold 8.5px monospace';
        if (searchQuery.trim() && sim > 0) {
          ctx.fillStyle = sim > 0.65 ? '#FF2800' : '#7E8B9B';
          ctx.fillText(`cos θ = ${sim.toFixed(2)}`, textAnchorX, textAnchorY + 11);
        } else {
          ctx.fillStyle = isHovered ? '#FF2800' : '#7E8B9B';
          ctx.fillText(proj.metric, textAnchorX, textAnchorY + 11);
        }

        ctx.restore();
      });

      // -------------------------------------------------------------------
      // PASS 6: SINGULARITY RADIAL WARP STREAKS
      // -------------------------------------------------------------------
      if (warpProject && warpEase > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let s = 0; s < 45; s++) {
          const ang = (s / 45) * Math.PI * 2;
          const streakDist = 40 + s * 14;
          const sx = warpFocusX + Math.cos(ang) * (streakDist + warpEase * 320);
          const sy = warpFocusY + Math.sin(ang) * (streakDist + warpEase * 320);
          const ex = sx + Math.cos(ang) * (warpEase * 120);
          const ey = sy + Math.sin(ang) * (warpEase * 120);

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = s % 2 === 0 ? '#FF2800' : '#2563EB';
          ctx.lineWidth = 1.2 * warpEase;
          ctx.globalAlpha = Math.min(1.0, warpEase * 1.5);
          ctx.stroke();
        }

        // Expanding Singularity Core
        const coreExpandR = Math.pow(warpEase, 2.8) * 1200;
        const singGrad = ctx.createRadialGradient(warpFocusX, warpFocusY, 0, warpFocusX, warpFocusY, coreExpandR);
        singGrad.addColorStop(0, '#FF2800');
        singGrad.addColorStop(0.35, '#0B1E40');
        singGrad.addColorStop(1, '#03050A');

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = singGrad;
        ctx.beginPath();
        ctx.arc(warpFocusX, warpFocusY, coreExpandR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    activeCore,
    activeDomain,
    hoveredProject,
    isReduced,
    router,
    searchQuery,
    similarityScores,
    warpProject,
  ]);

  // Current Breadcrumb labels
  const currentDomainObj = DOMAINS.find((d) => d.id === activeDomain);
  const currentCoreObj = CORES.find((c) => c.id === activeCore);

  return (
    <section
      id="archive"
      className="relative w-full py-16 sm:py-24 select-none bg-transparent overflow-hidden"
      aria-label="Systems Constellation & Awwwards Vector CodeGraph"
    >
      {/* Seamless Ambient Cobalt Glow in Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(21, 56, 117, 0.22) 0%, rgba(11, 30, 64, 0.08) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Floating Top Controls Header Overlay */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#C8D2E0]/10">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#F4F6F9] leading-tight tracking-tight">
              Systems Constellation.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[#7E8B9B] tracking-wider uppercase">
              18 Vector Repositories · 2.5D Optical Bloom · Elastic Verlet Splines
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

          {/* UPGRADE 4: LIVE SEMANTIC VECTOR QUERY BAR & QUICK PROMPTS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Borderless Vector Query Input */}
            <div className="relative flex items-center min-w-[280px] sm:min-w-[340px] border-b border-[#C8D2E0]/20 focus-within:border-[#FF2800] transition-colors pb-1">
              <span className="font-mono text-xs text-[#FF2800] mr-2">cos θ &gt;</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query vector space (e.g. computer vision, 60fps)..."
                className="w-full bg-transparent font-mono text-xs text-[#F4F6F9] placeholder-[#7E8B9B] focus:outline-none"
                aria-label="Semantic Latent Vector Query"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#7E8B9B] hover:text-[#F4F6F9] font-mono text-xs ml-2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setSearchQuery('low-latency 60fps web workers')}
                className="px-2.5 py-1 bg-[#060A12] hover:bg-[#0B1E40] text-[#C8D2E0] border border-[#2563EB]/25 rounded-[2px] transition-colors cursor-pointer"
              >
                [Low-Latency 60FPS]
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('clinical computer vision 3d lidar')}
                className="px-2.5 py-1 bg-[#060A12] hover:bg-[#0B1E40] text-[#C8D2E0] border border-[#FF2800]/25 rounded-[2px] transition-colors cursor-pointer"
              >
                [Clinical CV &amp; LiDAR]
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery('spatial isochrone nlp vector search')}
                className="px-2.5 py-1 bg-[#060A12] hover:bg-[#0B1E40] text-[#C8D2E0] border border-[#C8D2E0]/20 rounded-[2px] transition-colors cursor-pointer"
              >
                [Spatial ML]
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2 py-1 text-[#FF2800] hover:underline cursor-pointer"
                >
                  [Reset]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN INTERACTIVE 2.5D CANVAS STAGE */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] max-h-[760px] overflow-hidden select-none"
        >
          {/* Subtle Background 3D Reticle Rings */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] border border-[#2563EB]/10 rounded-full animate-spin [animation-duration:90s]" />
            <div className="absolute w-[600px] h-[600px] sm:w-[840px] sm:h-[840px] border border-[#C8D2E0]/5 rounded-full" />
          </div>

          {/* Precision Physics & Optical Bloom Canvas */}
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full relative z-10 block"
            style={{ touchAction: 'none' }}
          />

          {/* UPGRADE 5: HOLOGRAPHIC SPEC LENS CALLOUT (ANCHORED BESIDE HOVERED NODE) */}
          {hoveredProject && !warpProject && (
            <div
              className="absolute pointer-events-none z-30 transition-all duration-150"
              style={{
                left: `${Math.min(72, Math.max(8, ((hoveredProject.wx + 600) / 1200) * 100))}%`,
                top: `${Math.min(70, Math.max(12, ((hoveredProject.wy + 340) / 680) * 100))}%`,
                transform: hoveredProject.wx > 100 ? 'translate(-108%, -50%)' : 'translate(18px, -50%)',
              }}
            >
              <div className="w-[320px] bg-[#03050A]/92 backdrop-blur-xl border-l-2 border-[#FF2800] border-y border-r border-[#C8D2E0]/20 rounded-[2px] shadow-[0_16px_50px_rgba(0,0,0,0.95)] p-4 space-y-3">
                {/* Micro-Architecture Live Signature Strip */}
                <div className="relative h-[48px] w-full bg-[#060A12]/80 border border-[#2563EB]/25 rounded-[2px] overflow-hidden flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800] animate-ping" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#C8D2E0]">
                      VECTOR SIGNATURE
                    </span>
                  </div>
                  {/* Floating Cosine 3D Coordinate Badge */}
                  <div className="font-mono text-[9.5px] text-[#4CC38A]">
                    [{hoveredProject.cosineCoord.map((n) => (n >= 0 ? `+${n}` : `${n}`)).join(', ')}]
                  </div>
                </div>

                {/* System Title & Year */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-[17px] font-semibold text-[#F4F6F9] leading-tight">
                      {hoveredProject.title}
                    </h3>
                    <span className="font-mono text-xs text-[#7E8B9B] shrink-0">
                      {hoveredProject.year}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#FF2800]">
                    {hoveredProject.metric}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs font-sans text-[#C8D2E0]/90 leading-relaxed">
                  {hoveredProject.summary}
                </p>

                {/* Tech Stack */}
                <div className="text-[10px] font-mono text-[#2563EB] tracking-wide pt-1 border-t border-[#C8D2E0]/10 truncate">
                  {hoveredProject.stack}
                </div>

                {/* Action CTA Bar */}
                <button
                  type="button"
                  onClick={() => triggerSingularityDive(hoveredProject)}
                  className="w-full pt-1 flex items-center justify-between text-[10px] font-mono text-[#FF2800] hover:text-[#FF4419] font-semibold pointer-events-auto cursor-pointer transition-colors focus:outline-none"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800] animate-pulse" />
                    CLICK NODE TO ENTER CASE STUDY
                  </span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE TOUCH PREVIEW CARD (When a dot is selected on mobile/touch) */}
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
              <button
                type="button"
                onClick={() => triggerSingularityDive(mobileSelectedProject)}
                className="flex-1 py-2.5 bg-[#FF2800] hover:bg-[#FF4419] text-[#F4F6F9] font-mono text-xs font-semibold rounded-[2px] text-center inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Case Study (Warp Transition)</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Architectural Verification String */}
        <div className="pt-4 border-t border-[#C8D2E0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-[#7E8B9B]">
          <div className="flex items-center gap-2">
            <span className="text-[#FF2800]">●</span>
            <span>VERLET SPRING PHYSICS · UMAP TOPOGRAPHICAL CONTOURS · OPTICAL ADDITIVE BLOOM</span>
          </div>
          <div className="text-[#C8D2E0]/60">
            FOCAL LENGTH F=900 · 60 FPS DETERMINISTIC CANVAS
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCodeGraph;
