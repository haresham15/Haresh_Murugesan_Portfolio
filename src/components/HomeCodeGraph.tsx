import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { allProjects } from '@/content/projects';
import { useCanvasStage, type CanvasStage } from '@/hooks/useCanvasStage';
import { useMotionPreference } from './MotionPreference';

// ---------------------------------------------------------------------------
// Palette, type and projection constants
// ---------------------------------------------------------------------------

const F = 900; // focal length of the 2.5D projection, in world units
const DEG = Math.PI / 180;
const TILT_MAX = 6 * DEG;
const RED = '#FF2800';
const BLUE = '#2563EB';
const SILVER = '#C8D2E0';
const CHROME = '#E6ECF5';
const TITANIUM = '#7E8B9B';
const ALABASTER = '#F4F6F9';
const MIDNIGHT = '#03050A';
const CONTOUR_COBALT = 'rgba(37, 99, 235, 0.24)';
const CONTOUR_SILVER = 'rgba(200, 210, 224, 0.10)';
const SERIF = '"Geist Serif", "Newsreader", Georgia, serif';
const MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';
const FONT_ANCHOR = `600 14px ${SERIF}`;
const FONT_PROJECT = `500 12px ${SERIF}`;
const FONT_DOMAIN = `400 10px ${MONO}`;
const FONT_SUB = `400 9.5px ${MONO}`;
const WARP_MS = 420;
const WARP_ZOOM = 16;
const CONTOUR_RADII = [75, 135, 205];
const CONTOUR_STEPS = 72;
const STAR_COUNT = 150;
const SPARK_COUNT = 72;
const MAX_RECTS = 160;
const CAND_ANGLES = [0, 0.6, -0.6, 1.2, -1.2, 1.9, -1.9, Math.PI];
const KNN_LABEL_T = [0.5, 0.4, 0.6, 0.3, 0.7, 0.5];

// ---------------------------------------------------------------------------
// Graph layout. Positions and groupings only: every fact shown comes from
// src/content/projects.ts.
// ---------------------------------------------------------------------------

type CoreId = 'core-backend' | 'core-frontend';
type Tint = 0 | 1; // 0 = red-orange bloom, 1 = cobalt bloom

interface AnchorDef {
  id: CoreId;
  label: string;
  tint: Tint;
  x: number;
  y: number;
}

interface DomainDef {
  id: string;
  coreId: CoreId;
  label: string;
  ring: string;
  tint: Tint;
  x: number;
  y: number;
}

interface PlacementDef {
  slug: string;
  domainId: string;
  angle: number;
  dist: number;
  short: string;
}

const ANCHORS: AnchorDef[] = [
  { id: 'core-backend', label: 'Backend & AI/ML', tint: 0, x: -260, y: 0 },
  { id: 'core-frontend', label: 'Frontend & Spatial UI', tint: 1, x: 260, y: 0 },
];

const DOMAINS: DomainDef[] = [
  { id: 'domain-cv-lidar', coreId: 'core-backend', label: 'Clinical computer vision', ring: RED, tint: 0, x: -375, y: -95 },
  { id: 'domain-search-nlp', coreId: 'core-backend', label: 'Hybrid search & NLP', ring: '#FF4419', tint: 0, x: -145, y: -115 },
  { id: 'domain-spatial-ml', coreId: 'core-backend', label: 'Spatial ML', ring: BLUE, tint: 1, x: -375, y: 105 },
  { id: 'domain-serverless-cloud', coreId: 'core-backend', label: 'Cloud & formal Java', ring: SILVER, tint: 1, x: -145, y: 125 },
  { id: 'domain-telemetry-ui', coreId: 'core-frontend', label: 'Telemetry & simulators', ring: RED, tint: 0, x: 155, y: -115 },
  { id: 'domain-spatial-3d', coreId: 'core-frontend', label: '3D & geospatial UI', ring: BLUE, tint: 1, x: 385, y: -95 },
  { id: 'domain-media-streaming', coreId: 'core-frontend', label: 'Media & platforms', ring: SILVER, tint: 1, x: 325, y: 135 },
];

const PLACEMENTS: PlacementDef[] = [
  { slug: 'healios', domainId: 'domain-cv-lidar', angle: -155, dist: 64, short: 'Healios V2' },
  { slug: 'cv-allergy-wheal', domainId: 'domain-cv-lidar', angle: -100, dist: 64, short: 'Allergy Wheal CV' },
  { slug: 'tamiltrove', domainId: 'domain-search-nlp', angle: -80, dist: 62, short: 'TamilTrove' },
  { slug: 'tutormatch', domainId: 'domain-search-nlp', angle: -15, dist: 62, short: 'TutorMatch' },
  { slug: 'routerx-careline', domainId: 'domain-spatial-ml', angle: 155, dist: 64, short: 'RouteRx' },
  { slug: 'cs50-ai-projects', domainId: 'domain-spatial-ml', angle: 100, dist: 64, short: 'CS50 AI' },
  { slug: 'software-2-projects', domainId: 'domain-serverless-cloud', angle: 80, dist: 62, short: 'Software 2' },
  { slug: 'software-1-projects', domainId: 'domain-serverless-cloud', angle: 15, dist: 62, short: 'Software 1' },
  { slug: 'apexis', domainId: 'domain-telemetry-ui', angle: -165, dist: 62, short: 'Apexis' },
  { slug: 'tempo', domainId: 'domain-telemetry-ui', angle: -95, dist: 62, short: 'Tempo' },
  { slug: 'nyc-housing-market-ai', domainId: 'domain-spatial-3d', angle: -80, dist: 64, short: 'NYC Housing AI' },
  { slug: 'philocracy', domainId: 'domain-spatial-3d', angle: -20, dist: 64, short: 'Philocracy' },
  { slug: 'carstomer', domainId: 'domain-spatial-3d', angle: 35, dist: 64, short: 'CarStomer' },
  { slug: 'syntinuum-podcast-website', domainId: 'domain-media-streaming', angle: -15, dist: 66, short: 'Syntinuum' },
  { slug: 'murugesan-rajaram-lab', domainId: 'domain-media-streaming', angle: 35, dist: 66, short: 'Rajaram Lab' },
  { slug: 'momwebsite', domainId: 'domain-media-streaming', angle: 85, dist: 66, short: 'Client Portal' },
  { slug: 'portfolio-website', domainId: 'domain-media-streaming', angle: 135, dist: 66, short: 'This Portfolio' },
  { slug: 'anna-birthday', domainId: 'domain-media-streaming', angle: 175, dist: 66, short: 'Birthday Site' },
];

interface FilterDef {
  id: string;
  label: string;
  domains: string[] | null;
}

const FILTERS: FilterDef[] = [
  { id: 'all', label: 'All', domains: null },
  { id: 'cv', label: 'Clinical CV & Imaging', domains: ['domain-cv-lidar'] },
  { id: 'latency', label: 'Low-Latency & Telemetry', domains: ['domain-telemetry-ui'] },
  { id: 'search', label: 'Hybrid Search & NLP', domains: ['domain-search-nlp'] },
  { id: 'spatial', label: 'Spatial ML & Cloud', domains: ['domain-spatial-ml', 'domain-serverless-cloud'] },
];

// ---------------------------------------------------------------------------
// Project records joined with canonical content
// ---------------------------------------------------------------------------

interface GraphProject {
  slug: string;
  short: string;
  name: string;
  subtitle: string;
  year: string;
  highlight: string;
  stack: string;
  summary: string;
  domainId: string;
  coreId: CoreId;
  x: number;
  y: number;
}

const PROJECTS: GraphProject[] = PLACEMENTS.flatMap((pl) => {
  const content = allProjects.find((p) => p.slug === pl.slug);
  const domain = DOMAINS.find((d) => d.id === pl.domainId);
  if (!content || !domain) return [];
  const [name, ...rest] = content.title.split(' — ');
  const rad = pl.angle * DEG;
  return [
    {
      slug: pl.slug,
      short: pl.short,
      name,
      subtitle: rest.join(' — '),
      year: content.year,
      highlight: content.highlight,
      stack: content.stack.split(/,\s*/).slice(0, 5).join(' · '),
      summary: content.description,
      domainId: domain.id,
      coreId: domain.coreId,
      x: domain.x + Math.cos(rad) * pl.dist,
      y: domain.y + Math.sin(rad) * pl.dist,
    },
  ];
});

// ---------------------------------------------------------------------------
// TF-IDF vector space over real project text
// ---------------------------------------------------------------------------

type SparseVec = Map<string, number>;

const STOPWORDS = new Set(
  'a an and are as at be by for from in into is it its of on or that the this to with via using over per across than their within based built also both all can each more most our such these those through which while who will'.split(' ')
);

function stem(token: string): string {
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith('s') && !token.endsWith('ss')) return token.slice(0, -1);
  return token;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, ' ')
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

function normalize(vec: SparseVec): SparseVec {
  let norm = 0;
  vec.forEach((v) => {
    norm += v * v;
  });
  norm = Math.sqrt(norm);
  if (norm > 0) vec.forEach((v, k) => vec.set(k, v / norm));
  return vec;
}

function dot(a: SparseVec, b: SparseVec): number {
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  let sum = 0;
  small.forEach((v, k) => {
    const w = large.get(k);
    if (w) sum += v * w;
  });
  return sum;
}

const VECTOR_INDEX = (() => {
  const termFreqs: SparseVec[] = PROJECTS.map((p) => {
    const content = allProjects.find((c) => c.slug === p.slug);
    const fields: [string, number][] = [
      [`${p.short} ${content?.title ?? ''}`, 3],
      [p.highlight, 2],
      [content?.stack ?? '', 2],
      [content?.category ?? '', 1],
      [p.summary, 1],
      [content?.caseStudy.executiveSummary ?? '', 0.5],
    ];
    const tf: SparseVec = new Map();
    for (const [text, weight] of fields) {
      for (const tok of tokenize(text)) tf.set(tok, (tf.get(tok) ?? 0) + weight);
    }
    return tf;
  });

  const df = new Map<string, number>();
  termFreqs.forEach((tf) => tf.forEach((_, term) => df.set(term, (df.get(term) ?? 0) + 1)));
  const n = PROJECTS.length;
  const idf = new Map<string, number>();
  df.forEach((count, term) => idf.set(term, Math.log((n + 1) / (count + 1)) + 1));

  const vectors = termFreqs.map((tf) => {
    const vec: SparseVec = new Map();
    tf.forEach((freq, term) => vec.set(term, (1 + Math.log(freq)) * (idf.get(term) ?? 0)));
    return normalize(vec);
  });

  const neighbors = vectors.map((vec, i) =>
    vectors
      .map((other, j) => ({ index: j, sim: i === j ? -1 : dot(vec, other) }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 3)
      .map((nb) => ({ ...nb, text: `${nb.sim.toFixed(2)} SIM` }))
  );

  return { idf, vocab: Array.from(idf.keys()), vectors, neighbors };
})();

function queryVector(query: string): SparseVec {
  const vec: SparseVec = new Map();
  for (const tok of tokenize(query)) {
    const exact = VECTOR_INDEX.idf.get(tok);
    if (exact) {
      vec.set(tok, (vec.get(tok) ?? 0) + exact);
      continue;
    }
    if (tok.length < 3) continue;
    // Prefix expansion so partial typing ("lid", "retriev") already lands.
    const expansions = VECTOR_INDEX.vocab.filter((term) => term.startsWith(tok));
    for (const term of expansions) {
      vec.set(term, (vec.get(term) ?? 0) + (VECTOR_INDEX.idf.get(term) ?? 0) / expansions.length);
    }
  }
  return normalize(vec);
}

interface QueryMatch {
  index: number;
  sim: number;
}

function rankQuery(query: string): QueryMatch[] {
  if (!query.trim()) return [];
  const q = queryVector(query);
  if (q.size === 0) return [];
  const scored = VECTOR_INDEX.vectors
    .map((vec, index) => ({ index, sim: dot(q, vec) }))
    .filter((m) => m.sim > 0.04)
    .sort((a, b) => b.sim - a.sim);
  if (scored.length === 0) return [];
  const cutoff = scored[0].sim * 0.45;
  return scored.filter((m) => m.sim >= cutoff).slice(0, 6);
}

// ---------------------------------------------------------------------------
// Mutable simulation state (allocated once, mutated per frame)
// ---------------------------------------------------------------------------

interface GNode {
  kind: 0 | 1 | 2; // anchor, domain, project
  id: string;
  label: string;
  sub: string;
  r: number;
  tint: Tint;
  ring: string;
  parent: number;
  domainIndex: number;
  bx: number;
  by: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  a: number;
  tx: number;
  ty: number;
  tz: number;
  ta: number;
  sx: number;
  sy: number;
  s: number;
  depth: number;
  wantLabel: boolean;
  labelOn: boolean;
  labelVis: number;
  labelCand: number;
  labelLines: number;
  lx: number;
  ly: number;
  lw: number;
  lh: number;
  matchRank: number;
  simText: string;
  priority: number;
}

interface GEdge {
  a: number;
  b: number;
  bow: number;
  dx: number;
  dy: number;
  px: number;
  py: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  tint: Tint;
}

interface DebugLabel {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Sim {
  nodes: GNode[];
  order: number[];
  labelOrder: number[];
  edges: GEdge[];
  sparks: Spark[];
  stars: Float32Array;
  rects: Float32Array;
  rectCount: number;
  widthCache: Map<string, Map<string, number>>;
  sprites: HTMLCanvasElement[] | null;
  layoutKey: string;
  kBase: number;
  cam: { x: number; y: number; zoom: number; vx: number; vy: number; vzoom: number; tx: number; ty: number; tzoom: number };
  tilt: { rx: number; ry: number; vrx: number; vry: number };
  pointer: { x: number; y: number; px: number; py: number; inside: boolean; touch: boolean };
  physicsAcc: number;
  hoverIndex: number;
  lensSlug: string | null;
  lensSize: { slug: string | null; w: number; h: number };
  warp: { index: number; start: number; pushed: boolean } | null;
  contourAngles: number[][];
  debug: { labels: DebugLabel[]; drawMs: number[]; frame: number };
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNode(partial: Pick<GNode, 'kind' | 'id' | 'label' | 'sub' | 'r' | 'tint' | 'ring' | 'parent' | 'domainIndex' | 'bx' | 'by'>): GNode {
  return {
    ...partial,
    x: partial.bx,
    y: partial.by,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    a: 0,
    tx: partial.bx,
    ty: partial.by,
    tz: 0,
    ta: 1,
    sx: -9999,
    sy: -9999,
    s: 1,
    depth: 0,
    wantLabel: true,
    labelOn: false,
    labelVis: 0,
    labelCand: 0,
    labelLines: 1,
    lx: 0,
    ly: 0,
    lw: 0,
    lh: 0,
    matchRank: -1,
    simText: '',
    priority: 0,
  };
}


function createSim(): Sim {
  const nodes: GNode[] = [];
  ANCHORS.forEach((a) => {
    const count = PROJECTS.filter((p) => p.coreId === a.id).length;
    nodes.push(makeNode({ kind: 0, id: a.id, label: `${a.label} · ${count}`, sub: '', r: 9, tint: a.tint, ring: a.tint === 0 ? RED : BLUE, parent: -1, domainIndex: -1, bx: a.x, by: a.y }));
  });
  DOMAINS.forEach((d, i) => {
    nodes.push(makeNode({ kind: 1, id: d.id, label: d.label, sub: '', r: 6.5, tint: d.tint, ring: d.ring, parent: ANCHORS.findIndex((a) => a.id === d.coreId), domainIndex: i, bx: d.x, by: d.y }));
  });
  PROJECTS.forEach((p) => {
    const di = DOMAINS.findIndex((d) => d.id === p.domainId);
    nodes.push(makeNode({ kind: 2, id: p.slug, label: p.short, sub: '', r: 4.5, tint: DOMAINS[di].tint, ring: DOMAINS[di].ring, parent: ANCHORS.length + di, domainIndex: di, bx: p.x, by: p.y }));
  });

  const edges: GEdge[] = [];
  const rand = mulberry32(7);
  const addEdge = (a: number, b: number) => edges.push({ a, b, bow: (rand() - 0.5) * 0.16, dx: 0, dy: 0, px: 0, py: 0 });
  addEdge(0, 1);
  nodes.forEach((n, i) => {
    if (n.parent >= 0) addEdge(n.parent, i);
  });

  const stars = new Float32Array(STAR_COUNT * 4);
  for (let i = 0; i < STAR_COUNT; i++) {
    stars[i * 4] = (rand() - 0.5) * 1900;
    stars[i * 4 + 1] = (rand() - 0.5) * 1300;
    stars[i * 4 + 2] = -220 - rand() * 520;
    stars[i * 4 + 3] = 0.12 + rand() * 0.38;
  }

  const sparks: Spark[] = [];
  for (let i = 0; i < SPARK_COUNT; i++) sparks.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, tint: 0 });

  return {
    nodes,
    order: nodes.map((_, i) => i),
    labelOrder: nodes.map((_, i) => i),
    edges,
    sparks,
    stars,
    rects: new Float32Array(MAX_RECTS * 4),
    rectCount: 0,
    widthCache: new Map(),
    sprites: null,
    layoutKey: '',
    kBase: 1,
    cam: { x: 0, y: 0, zoom: 1, vx: 0, vy: 0, vzoom: 0, tx: 0, ty: 0, tzoom: 1 },
    tilt: { rx: 0, ry: 0, vrx: 0, vry: 0 },
    pointer: { x: -1e4, y: -1e4, px: -1e4, py: -1e4, inside: false, touch: false },
    physicsAcc: 0,
    hoverIndex: -1,
    lensSlug: null,
    lensSize: { slug: null, w: 320, h: 180 },
    warp: null,
    contourAngles: [[], []],
    debug: { labels: nodes.map(() => ({ text: '', x: 0, y: 0, w: 0, h: 0 })), drawMs: [], frame: 0 },
  };
}

function makeSprite(size: number, paint: (g: CanvasRenderingContext2D, c: number) => void): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext('2d');
  if (g) paint(g, size / 2);
  return canvas;
}

function buildSprites(): HTMLCanvasElement[] {
  const bloom = (rgb: string) =>
    makeSprite(128, (g, c) => {
      const grad = g.createRadialGradient(c, c, 0, c, c, c);
      grad.addColorStop(0, `rgba(${rgb}, 0.62)`);
      grad.addColorStop(0.22, `rgba(${rgb}, 0.30)`);
      grad.addColorStop(0.55, `rgba(${rgb}, 0.08)`);
      grad.addColorStop(1, `rgba(${rgb}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, c * 2, c * 2);
    });
  // Machined chrome bead: offset specular highlight over a titanium falloff.
  const chrome = makeSprite(64, (g, c) => {
    const grad = g.createRadialGradient(c * 0.72, c * 0.66, 0, c, c, c);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, CHROME);
    grad.addColorStop(0.72, SILVER);
    grad.addColorStop(0.92, TITANIUM);
    grad.addColorStop(1, 'rgba(126, 139, 155, 0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(c, c, c, 0, Math.PI * 2);
    g.fill();
  });
  return [bloom('255, 40, 0'), bloom('37, 99, 235'), chrome];
}

// Scratch output of project(), reused every call.
const P = { sx: 0, sy: 0, s: 1, depth: 0 };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface FocusState {
  ids: string[];
  core: CoreId | null;
  domain: string | null;
}

export const HomeCodeGraph: React.FC = () => {
  const router = useRouter();
  const { isReduced } = useMotionPreference();

  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState<FocusState | null>(null);
  const [lensSlug, setLensSlug] = useState<string | null>(null);
  const [touchSlug, setTouchSlug] = useState<string | null>(null);
  const [keyboardSlug, setKeyboardSlug] = useState<string | null>(null);
  const [warping, setWarping] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<Sim | null>(null);
  if (simRef.current === null) simRef.current = createSim();

  const matches = useMemo(() => rankQuery(query), [query]);

  const uiRef = useRef({
    reduced: false,
    focusIds: null as Set<string> | null,
    focusKey: 'all',
    matches: [] as QueryMatch[],
    matchKey: '',
    touchSlug: null as string | null,
    keyboardSlug: null as string | null,
  });
  const routerRef = useRef(router);
  routerRef.current = router;
  const prefetched = useRef(new Set<string>());

  useEffect(() => {
    const ui = uiRef.current;
    ui.reduced = isReduced;
    ui.focusIds = focus ? new Set(focus.ids) : null;
    ui.focusKey = focus ? focus.ids.join(',') : 'all';
    ui.matches = matches;
    ui.matchKey = matches.map((m) => `${m.index}:${m.sim.toFixed(2)}`).join(',');
    ui.touchSlug = touchSlug;
    ui.keyboardSlug = keyboardSlug;
    const sim = simRef.current;
    if (sim) {
      sim.nodes.forEach((n) => {
        n.matchRank = -1;
        n.simText = '';
      });
      matches.forEach((m, rank) => {
        const node = sim.nodes[ANCHORS.length + DOMAINS.length + m.index];
        node.matchRank = rank;
        node.simText = `${m.sim.toFixed(2)} SIM`;
      });
    }
  }, [isReduced, focus, matches, touchSlug, keyboardSlug]);

  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.sprites = buildSprites();
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    const clear = () => sim.widthCache.clear();
    fonts?.ready.then(clear).catch(() => {});
    fonts?.addEventListener?.('loadingdone', clear);
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __codegraph?: Sim['debug'] }).__codegraph = sim.debug;
    }
    return () => fonts?.removeEventListener?.('loadingdone', clear);
  }, []);

  const prefetch = useCallback((slug: string) => {
    if (prefetched.current.has(slug)) return;
    prefetched.current.add(slug);
    routerRef.current.prefetch(`/projects/${slug}`).catch(() => {});
  }, []);

  const startDive = useCallback(
    (slug: string) => {
      const sim = simRef.current;
      const index = PROJECTS.findIndex((p) => p.slug === slug);
      if (!sim || index < 0 || sim.warp) return;
      if (uiRef.current.reduced) {
        routerRef.current.push(`/projects/${slug}`);
        return;
      }
      prefetch(slug);
      sim.warp = { index: ANCHORS.length + DOMAINS.length + index, start: -1, pushed: false };
      setWarping(true);
    },
    [prefetch]
  );

  const focusDomains = useCallback((next: FocusState | null) => {
    setFocus(next);
    if (next) setQuery('');
    setTouchSlug(null);
  }, []);

  const focusDomain = useCallback(
    (domainId: string) => {
      const domain = DOMAINS.find((d) => d.id === domainId);
      if (!domain) return;
      focusDomains({ ids: [domainId], core: domain.coreId, domain: domainId });
    },
    [focusDomains]
  );

  const focusCore = useCallback(
    (coreId: CoreId) => {
      focusDomains({ ids: DOMAINS.filter((d) => d.coreId === coreId).map((d) => d.id), core: coreId, domain: null });
    },
    [focusDomains]
  );

  // Escape zooms back out of a focused branch.
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocus(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus]);

  // ---------------------------------------------------------------------
  // Pointer input
  // ---------------------------------------------------------------------

  const localPoint = (e: React.PointerEvent | React.MouseEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    return rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: -1e4, y: -1e4 };
  };

  const hitTest = useCallback((x: number, y: number, touch: boolean): number => {
    const sim = simRef.current;
    if (!sim) return -1;
    let best = -1;
    let bestD = Infinity;
    for (let i = 0; i < sim.nodes.length; i++) {
      const n = sim.nodes[i];
      if (n.a < 0.12) continue;
      const reach = Math.max(touch ? 22 : 12, n.r * n.s + (touch ? 12 : 7));
      const d = Math.hypot(n.sx - x, n.sy - y);
      // Projects win ties so small dots stay clickable beside larger ones.
      const weighted = d - (n.kind === 2 ? 4 : 0);
      if (d <= reach && weighted < bestD) {
        best = i;
        bestD = weighted;
      }
    }
    return best;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const sim = simRef.current;
    if (!sim) return;
    const p = localPoint(e);
    sim.pointer.x = p.x;
    sim.pointer.y = p.y;
    sim.pointer.inside = true;
    sim.pointer.touch = e.pointerType !== 'mouse';
  }, []);

  const onPointerLeave = useCallback(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.pointer.inside = false;
    sim.pointer.x = -1e4;
    sim.pointer.y = -1e4;
  }, []);

  const onStageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const sim = simRef.current;
      if (!sim || sim.warp) return;
      if ((e.target as HTMLElement).closest('a,button,input')) return;
      const p = localPoint(e);
      const touch = sim.pointer.touch;
      const index = hitTest(p.x, p.y, touch);
      if (index < 0) {
        if (touchSlug) setTouchSlug(null);
        else if (focus) setFocus(null);
        return;
      }
      const node = sim.nodes[index];
      if (node.kind === 2) {
        if (touch && touchSlug !== node.id) {
          setTouchSlug(node.id);
          prefetch(node.id);
          return;
        }
        startDive(node.id);
      } else if (node.kind === 1) {
        if (focus?.domain === node.id) setFocus(null);
        else focusDomain(node.id);
      } else {
        const coreId = node.id as CoreId;
        if (focus?.core === coreId && !focus.domain) setFocus(null);
        else focusCore(coreId);
      }
    },
    [focus, focusCore, focusDomain, hitTest, prefetch, startDive, touchSlug]
  );

  // ---------------------------------------------------------------------
  // Frame
  // ---------------------------------------------------------------------

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, stage: CanvasStage) => {
      const sim = simRef.current;
      if (!sim) return;
      const t0 = performance.now();
      const ui = uiRef.current;
      const reduced = ui.reduced;
      const W = stage.width;
      const H = stage.height;
      const dt = Math.min(stage.deltaTime, 50) / 1000;
      const time = reduced ? 0 : stage.time;
      const nodes = sim.nodes;
      const nAnchors = ANCHORS.length;
      const nFixed = ANCHORS.length + DOMAINS.length;
      const compact = W < 640;
      const portrait = W / H < 0.85;
      const queryActive = ui.matches.length > 0;
      ctx.clearRect(0, 0, W, H);

      // --- 1. Targets: recomputed only when layout inputs change ---------
      const layoutKey = `${Math.round(W)}x${Math.round(H)}|${ui.focusKey}|${ui.matchKey}|${portrait}`;
      if (layoutKey !== sim.layoutKey) {
        sim.layoutKey = layoutKey;
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        let fMinX = Infinity;
        let fMaxX = -Infinity;
        let fMinY = Infinity;
        let fMaxY = -Infinity;
        const focusIds = ui.focusIds;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const wx = portrait ? n.by : n.bx;
          const wy = portrait ? n.bx : n.by;
          n.tx = wx;
          n.ty = wy;
          minX = Math.min(minX, wx);
          maxX = Math.max(maxX, wx);
          minY = Math.min(minY, wy);
          maxY = Math.max(maxY, wy);
          const domainId = n.kind === 1 ? n.id : n.kind === 2 ? DOMAINS[n.domainIndex].id : '';
          const inFocus = !focusIds || (n.kind === 0 ? DOMAINS.some((d) => d.coreId === n.id && focusIds.has(d.id)) : focusIds.has(domainId));
          if (focusIds && inFocus && n.kind > 0) {
            fMinX = Math.min(fMinX, wx);
            fMaxX = Math.max(fMaxX, wx);
            fMinY = Math.min(fMinY, wy);
            fMaxY = Math.max(fMaxY, wy);
          }
          if (n.kind === 0) {
            n.tz = 30;
            n.ta = inFocus ? 1 : 0.35;
          } else if (n.kind === 1) {
            n.tz = inFocus ? 60 : -40;
            n.ta = inFocus ? (queryActive ? 0.5 : 1) : 0.2;
          } else {
            n.tz = inFocus ? 95 : -60;
            n.ta = inFocus ? 1 : 0.16;
            if (queryActive) {
              if (n.matchRank >= 0) {
                // Matches are pulled onto a focal orbit around the origin,
                // best match at twelve o'clock, radius widening with rank.
                const count = ui.matches.length;
                const theta = -Math.PI / 2 + (n.matchRank / count) * Math.PI * 2;
                const radius = 96 + n.matchRank * 6;
                n.tx = Math.cos(theta) * radius * (portrait ? 0.8 : 1.25);
                n.ty = Math.sin(theta) * radius * (portrait ? 1.25 : 0.8);
                n.tz = 170;
                n.ta = 1;
              } else {
                n.tx = wx * 1.08;
                n.ty = wy * 1.08;
                n.tz = -40;
                n.ta = 0.16;
              }
            }
          }
        }
        const padX = compact ? 54 : 150;
        const padY = compact ? 44 : 64;
        const bw = maxX - minX;
        const bh = maxY - minY;
        sim.kBase = Math.min(1.7, Math.min((W - padX * 2) / bw, (H - padY * 2) / bh));
        if (focusIds && fMinX < Infinity) {
          const fw = Math.max(fMaxX - fMinX, 120);
          const fh = Math.max(fMaxY - fMinY, 120);
          const kFocus = Math.min((W - padX * 2) / fw, (H - padY * 2) / fh);
          sim.cam.tx = (fMinX + fMaxX) / 2;
          sim.cam.ty = (fMinY + fMaxY) / 2;
          sim.cam.tzoom = Math.max(1, Math.min(2.1, kFocus / sim.kBase));
        } else {
          sim.cam.tx = (minX + maxX) / 2;
          sim.cam.ty = (minY + maxY) / 2;
          sim.cam.tzoom = 1;
        }
        // Angles from each anchor to its domains shape the contour wells.
        for (let c = 0; c < nAnchors; c++) {
          const angles: number[] = [];
          for (let d = 0; d < DOMAINS.length; d++) {
            const dn = nodes[nAnchors + d];
            if (dn.parent === c) angles.push(Math.atan2(dn.ty - nodes[c].ty, dn.tx - nodes[c].tx));
          }
          sim.contourAngles[c] = angles;
        }
      }

      // --- 2. Springs: nodes, camera, tilt ---------------------------------
      const springK = 140;
      const springC = 2 * 0.8 * Math.sqrt(springK);
      const alphaBlend = 1 - Math.exp(-dt * 9);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (reduced || n.a === 0) {
          n.x = n.tx;
          n.y = n.ty;
          n.z = n.tz;
          n.vx = n.vy = n.vz = 0;
          n.a = reduced ? n.ta : n.a + (n.ta - n.a) * alphaBlend;
          continue;
        }
        n.vx += (springK * (n.tx - n.x) - springC * n.vx) * dt;
        n.vy += (springK * (n.ty - n.y) - springC * n.vy) * dt;
        n.vz += (springK * (n.tz - n.z) - springC * n.vz) * dt;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        n.z += n.vz * dt;
        n.a += (n.ta - n.a) * alphaBlend;
      }
      const cam = sim.cam;
      if (reduced) {
        cam.x = cam.tx;
        cam.y = cam.ty;
        cam.zoom = cam.tzoom;
      } else {
        const ck = 70;
        const cc = 2 * 0.92 * Math.sqrt(ck);
        cam.vx += (ck * (cam.tx - cam.x) - cc * cam.vx) * dt;
        cam.vy += (ck * (cam.ty - cam.y) - cc * cam.vy) * dt;
        cam.vzoom += (ck * (cam.tzoom - cam.zoom) - cc * cam.vzoom) * dt;
        cam.x += cam.vx * dt;
        cam.y += cam.vy * dt;
        cam.zoom += cam.vzoom * dt;
      }
      const pointer = sim.pointer;
      const tilt = sim.tilt;
      const targetRy = !reduced && pointer.inside && !pointer.touch ? ((pointer.x / W) * 2 - 1) * TILT_MAX : 0;
      const targetRx = !reduced && pointer.inside && !pointer.touch ? -((pointer.y / H) * 2 - 1) * TILT_MAX : 0;
      const tk = 38;
      const tc = 2 * 0.9 * Math.sqrt(tk);
      tilt.vry += (tk * (targetRy - tilt.ry) - tc * tilt.vry) * dt;
      tilt.vrx += (tk * (targetRx - tilt.rx) - tc * tilt.vrx) * dt;
      tilt.ry += tilt.vry * dt;
      tilt.rx += tilt.vrx * dt;

      const k = sim.kBase * cam.zoom;
      const cosY = Math.cos(tilt.ry);
      const sinY = Math.sin(tilt.ry);
      const cosX = Math.cos(tilt.rx);
      const sinX = Math.sin(tilt.rx);
      const cx = W / 2;
      const cy = H / 2;
      const project = (x: number, y: number, z: number, parallax: number) => {
        const px = (x - cam.x * parallax);
        const py = (y - cam.y * parallax);
        const x1 = px * cosY + z * sinY;
        const z1 = -px * sinY + z * cosY;
        const y1 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;
        const s = F / Math.max(80, F - z2);
        P.sx = cx + x1 * s * k;
        P.sy = cy + y1 * s * k;
        P.s = s;
        P.depth = z2;
      };

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        project(n.x, n.y, n.z, 1);
        n.sx = P.sx;
        n.sy = P.sy;
        n.s = P.s * Math.min(1.1, Math.max(0.85, k));
        n.depth = P.depth;
      }

      // Back-to-front depth sort (insertion sort on a persistent index array:
      // order barely changes frame to frame, so this is ~linear).
      const order = sim.order;
      for (let i = 1; i < order.length; i++) {
        const v = order[i];
        const d = nodes[v].depth;
        let j = i - 1;
        while (j >= 0 && nodes[order[j]].depth > d) {
          order[j + 1] = order[j];
          j--;
        }
        order[j + 1] = v;
      }

      // --- 3. Hover -------------------------------------------------------
      let hover = -1;
      if (!sim.warp && pointer.inside && !pointer.touch) hover = hitTest(pointer.x, pointer.y, false);
      if (hover !== sim.hoverIndex) {
        sim.hoverIndex = hover;
        if (hover >= 0 && nodes[hover].kind === 2) prefetch(nodes[hover].id);
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const cursor = hover >= 0 ? 'pointer' : 'default';
        if (canvas.style.cursor !== cursor) canvas.style.cursor = cursor;
      }
      let lensIndex = -1;
      if (!sim.warp) {
        if (hover >= 0 && nodes[hover].kind === 2) lensIndex = hover;
        else {
          const slug = ui.touchSlug ?? ui.keyboardSlug;
          if (slug) lensIndex = nodes.findIndex((n) => n.id === slug);
        }
      }
      const lensSlugNow = lensIndex >= 0 ? nodes[lensIndex].id : null;
      if (lensSlugNow !== sim.lensSlug) {
        sim.lensSlug = lensSlugNow;
        setLensSlug(lensSlugNow);
      }
      const activeProject = lensIndex;

      // --- 4. Warp camera ---------------------------------------------------
      let warpT = 0;
      let warpZoom = 1;
      let warpFx = 0;
      let warpFy = 0;
      if (sim.warp) {
        if (sim.warp.start < 0) sim.warp.start = stage.time;
        warpT = Math.min(1, (stage.time - sim.warp.start) / WARP_MS);
        const target = nodes[sim.warp.index];
        warpFx = target.sx;
        warpFy = target.sy;
        // Exponential dolly: zoom = 16^(t^2), so each frame multiplies scale.
        warpZoom = Math.pow(WARP_ZOOM, warpT * warpT);
        ctx.save();
        ctx.translate(warpFx, warpFy);
        ctx.scale(warpZoom, warpZoom);
        ctx.translate(-warpFx, -warpFy);
      }

      // --- 5. Starfield ------------------------------------------------------
      const stars = sim.stars;
      ctx.fillStyle = SILVER;
      if (sim.warp) {
        ctx.strokeStyle = CHROME;
        ctx.lineCap = 'round';
      }
      for (let i = 0; i < STAR_COUNT; i++) {
        project(stars[i * 4], stars[i * 4 + 1], stars[i * 4 + 2], 0.35);
        if (P.sx < -20 || P.sx > W + 20 || P.sy < -20 || P.sy > H + 20) continue;
        const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(time * 0.0011 + i * 1.7);
        ctx.globalAlpha = stars[i * 4 + 3] * twinkle;
        if (sim.warp && warpT > 0) {
          const streak = warpT * warpT * 1.4;
          ctx.lineWidth = (1 + warpT * 1.5) / warpZoom;
          ctx.beginPath();
          ctx.moveTo(P.sx, P.sy);
          ctx.lineTo(P.sx + (P.sx - warpFx) * streak, P.sy + (P.sy - warpFy) * streak);
          ctx.stroke();
        } else {
          ctx.fillRect(P.sx, P.sy, 1, 1);
        }
      }

      // --- 6. UMAP-like contour wells (3 breathing rings per cluster) -------
      ctx.lineWidth = 1;
      for (let c = 0; c < nAnchors; c++) {
        const anchor = nodes[c];
        const angles = sim.contourAngles[c];
        for (let ring = 0; ring < CONTOUR_RADII.length; ring++) {
          const R = CONTOUR_RADII[ring];
          const phase = c * 2.1 + ring * 1.3;
          const breathe = 1 + 0.018 * Math.sin(time * 0.0009 + phase);
          const lobe = ring === 0 ? 0.1 : 0.2;
          ctx.beginPath();
          for (let s = 0; s <= CONTOUR_STEPS; s++) {
            const theta = (s / CONTOUR_STEPS) * Math.PI * 2;
            // Density bumps toward each domain, plus two slow harmonics.
            let bump = 0;
            for (let d = 0; d < angles.length; d++) {
              let diff = theta - angles[d];
              diff = Math.atan2(Math.sin(diff), Math.cos(diff));
              bump += Math.exp(-(diff * diff) / 0.24);
            }
            const r =
              R *
              breathe *
              (1 +
                lobe * bump -
                lobe * 0.45 +
                0.022 * Math.sin(3 * theta + phase + time * 0.00035) +
                0.016 * Math.sin(5 * theta - phase - time * 0.00027));
            project(anchor.x + Math.cos(theta) * r, anchor.y + Math.sin(theta) * r, anchor.z - 25, 1);
            if (s === 0) ctx.moveTo(P.sx, P.sy);
            else ctx.lineTo(P.sx, P.sy);
          }
          ctx.globalAlpha = 0.55 + 0.45 * anchor.a;
          ctx.strokeStyle = ring === 1 ? CONTOUR_SILVER : CONTOUR_COBALT;
          ctx.stroke();
        }
      }

      // Focal orbit for query matches.
      if (queryActive) {
        ctx.beginPath();
        for (let s = 0; s <= 64; s++) {
          const theta = (s / 64) * Math.PI * 2;
          project(Math.cos(theta) * 96 * (portrait ? 0.8 : 1.25), Math.sin(theta) * 96 * (portrait ? 1.25 : 0.8), 170, 1);
          if (s === 0) ctx.moveTo(P.sx, P.sy);
          else ctx.lineTo(P.sx, P.sy);
        }
        ctx.setLineDash([2, 5]);
        ctx.lineDashOffset = -time * 0.01;
        ctx.strokeStyle = RED;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // --- 7. Verlet strings -------------------------------------------------
      const edges = sim.edges;
      const sparks = sim.sparks;
      const pluck = !reduced && !sim.warp && pointer.inside && !pointer.touch && pointer.px > -1e3;
      const mvx = pointer.x - pointer.px;
      const mvy = pointer.y - pointer.py;
      const omega = 2 * Math.PI * 2.4;
      const zeta = 0.06;
      const step = 1 / 120;
      sim.physicsAcc = Math.min(sim.physicsAcc + dt, step * 8);
      let substeps = 0;
      while (sim.physicsAcc >= step) {
        sim.physicsAcc -= step;
        substeps++;
      }
      const lineage1 = activeProject >= 0 ? nodes[activeProject].parent : -2;
      const lineage0 = lineage1 >= 0 ? nodes[lineage1].parent : -2;
      for (let e = 0; e < edges.length; e++) {
        const edge = edges[e];
        const A = nodes[edge.a];
        const B = nodes[edge.b];
        const ex = B.sx - A.sx;
        const ey = B.sy - A.sy;
        const len = Math.hypot(ex, ey) || 1;
        const nx = -ey / len;
        const ny = ex / len;
        const restCx = (A.sx + B.sx) / 2 + nx * edge.bow * len;
        const restCy = (A.sy + B.sy) / 2 + ny * edge.bow * len;

        if (pluck && (mvx !== 0 || mvy !== 0)) {
          // Segment intersection between the cursor's path this frame and the
          // string's chord. The pluck impulse is the cursor speed across the
          // string, scaled by sin(pi t) so endpoints stay pinned.
          const qx = pointer.px;
          const qy = pointer.py;
          const den = mvx * ey - mvy * ex;
          if (Math.abs(den) > 1e-6) {
            const t = ((A.sx - qx) * mvy - (A.sy - qy) * mvx) / den;
            const u = ((A.sx - qx) * ey - (A.sy - qy) * ex) / den;
            if (t > 0.04 && t < 0.96 && u >= 0 && u <= 1) {
              const across = mvx * nx + mvy * ny;
              // Per-substep velocity; peak amplitude is roughly impulse * 120 / omega px.
              const impulse = Math.max(-2.2, Math.min(2.2, across * 0.09)) * Math.sin(Math.PI * t);
              edge.px = edge.dx - nx * impulse;
              edge.py = edge.dy - ny * impulse;
              const hx = A.sx + ex * t;
              const hy = A.sy + ey * t;
              const burst = Math.min(7, 2 + Math.round(Math.abs(across) / 6));
              for (let s = 0, spawned = 0; s < sparks.length && spawned < burst; s++) {
                const sp = sparks[s];
                if (sp.life > 0) continue;
                const spread = (Math.random() - 0.5) * 1.6;
                const sign = across >= 0 ? 1 : -1;
                const speed = 60 + Math.random() * 120;
                sp.x = hx;
                sp.y = hy;
                sp.vx = (nx * sign + (ex / len) * spread) * speed;
                sp.vy = (ny * sign + (ey / len) * spread) * speed;
                sp.max = 0.35 + Math.random() * 0.4;
                sp.life = sp.max;
                sp.tint = B.tint;
                spawned++;
              }
            }
          }
        }

        // Damped position-Verlet on the midpoint displacement.
        for (let s = 0; s < substeps; s++) {
          const vx = (edge.dx - edge.px) * (1 - 2 * zeta * omega * step);
          const vy = (edge.dy - edge.py) * (1 - 2 * zeta * omega * step);
          edge.px = edge.dx;
          edge.py = edge.dy;
          edge.dx += vx - omega * omega * edge.dx * step * step;
          edge.dy += vy - omega * omega * edge.dy * step * step;
        }
        const disp = Math.hypot(edge.dx, edge.dy);
        if (disp > 28) {
          edge.dx *= 28 / disp;
          edge.dy *= 28 / disp;
        }

        const energy = Math.min(1, disp / 14);
        const isLineage = activeProject >= 0 && ((edge.b === activeProject && edge.a === lineage1) || (edge.b === lineage1 && edge.a === lineage0));
        const baseAlpha = Math.min(A.a, B.a) * 0.34;
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        // Control offset is twice the midpoint displacement so the curve's
        // midpoint lands exactly on the simulated string point.
        ctx.quadraticCurveTo(restCx + edge.dx * 2, restCy + edge.dy * 2, B.sx, B.sy);
        if (isLineage) {
          ctx.strokeStyle = RED;
          ctx.globalAlpha = 0.9;
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = energy > 0.12 ? CHROME : edge.a === 0 && edge.b === 1 ? SILVER : B.ring;
          ctx.globalAlpha = Math.min(1, baseAlpha + energy * 0.55);
          ctx.lineWidth = 1 + energy * 0.4;
        }
        ctx.stroke();
      }
      pointer.px = pointer.inside ? pointer.x : -1e4;
      pointer.py = pointer.inside ? pointer.y : -1e4;

      // --- 8. k-NN bridges ----------------------------------------------------
      const rects = sim.rects;
      sim.rectCount = 0;
      const addRect = (x: number, y: number, w: number, h: number) => {
        if (sim.rectCount >= MAX_RECTS) return;
        const o = sim.rectCount * 4;
        rects[o] = x;
        rects[o + 1] = y;
        rects[o + 2] = w;
        rects[o + 3] = h;
        sim.rectCount++;
      };
      const overlaps = (x: number, y: number, w: number, h: number) => {
        if (x < 4 || y < 4 || x + w > W - 4 || y + h > H - 4) return true;
        for (let i = 0; i < sim.rectCount; i++) {
          const o = i * 4;
          if (x < rects[o] + rects[o + 2] && x + w > rects[o] && y < rects[o + 1] + rects[o + 3] && y + h > rects[o + 1]) return true;
        }
        return false;
      };
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.a < 0.3) continue;
        const R = n.r * n.s + 3;
        addRect(n.sx - R, n.sy - R, R * 2, R * 2);
      }

      const measure = (font: string, text: string) => {
        let byText = sim.widthCache.get(font);
        if (!byText) {
          byText = new Map();
          sim.widthCache.set(font, byText);
        }
        let w = byText.get(text);
        if (w === undefined) {
          ctx.font = font;
          w = ctx.measureText(text).width;
          byText.set(text, w);
        }
        return w;
      };

      if (activeProject >= 0 && !sim.warp) {
        const src = nodes[activeProject];
        const neighbors = VECTOR_INDEX.neighbors[activeProject - nFixed];
        ctx.setLineDash([3, 4]);
        ctx.lineDashOffset = -time * 0.012;
        ctx.lineWidth = 1;
        ctx.font = FONT_SUB;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        for (let i = 0; i < neighbors.length; i++) {
          const dst = nodes[nFixed + neighbors[i].index];
          ctx.beginPath();
          ctx.moveTo(src.sx, src.sy);
          ctx.lineTo(dst.sx, dst.sy);
          ctx.strokeStyle = BLUE;
          ctx.globalAlpha = 0.8;
          ctx.stroke();
          const text = neighbors[i].text;
          const tw = measure(FONT_SUB, text) + 4;
          const th = 12;
          const lx = dst.sx - src.sx;
          const ly = dst.sy - src.sy;
          const ll = Math.hypot(lx, ly) || 1;
          for (let c = 0; c < 6; c++) {
            const t = KNN_LABEL_T[c];
            const side = c === 5 ? -1 : 1;
            const ox = src.sx + lx * t + (-ly / ll) * 9 * side - tw / 2;
            const oy = src.sy + ly * t + (lx / ll) * 9 * side - th / 2;
            if (!overlaps(ox, oy, tw, th)) {
              addRect(ox, oy, tw, th);
              ctx.globalAlpha = 1;
              ctx.lineWidth = 3;
              ctx.strokeStyle = MIDNIGHT;
              ctx.setLineDash([]);
              ctx.strokeText(text, ox + 2, oy + 1);
              ctx.fillStyle = SILVER;
              ctx.fillText(text, ox + 2, oy + 1);
              ctx.setLineDash([3, 4]);
              ctx.lineWidth = 1;
              break;
            }
          }
        }
        ctx.setLineDash([]);
      }

      // --- 9. Additive bloom, depth sorted ---------------------------------
      const sprites = sim.sprites;
      if (sprites) {
        ctx.globalCompositeOperation = 'lighter';
        for (let o = 0; o < order.length; o++) {
          const i = order[o];
          const n = nodes[i];
          const isActive = i === activeProject || i === hover;
          const matched = n.matchRank >= 0;
          const base = n.kind === 0 ? 34 : n.kind === 1 ? 20 : isActive ? 30 : matched ? 26 : 15;
          const intensity = n.a * (isActive || matched ? 1 : n.kind === 2 ? 0.7 : 0.85);
          if (intensity < 0.04) continue;
          const R = base * n.s;
          ctx.globalAlpha = Math.min(1, intensity);
          ctx.drawImage(sprites[matched || isActive ? 0 : n.tint], n.sx - R, n.sy - R, R * 2, R * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      // --- 10. Chrome dot modules, depth sorted ----------------------------
      const focusIds = ui.focusIds;
      for (let o = 0; o < order.length; o++) {
        const i = order[o];
        const n = nodes[i];
        if (n.a < 0.02) continue;
        const isActive = i === activeProject || i === hover || (n.kind === 1 && focusIds?.size === 1 && focusIds.has(n.id));
        const R = n.r * n.s * (i === activeProject ? 1.18 : 1);
        ctx.globalAlpha = n.a;
        if (sprites) ctx.drawImage(sprites[2], n.sx - R, n.sy - R, R * 2, R * 2);
        if (n.kind === 1) {
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, R + 3, 0, Math.PI * 2);
          ctx.strokeStyle = n.ring;
          ctx.lineWidth = 1;
          ctx.globalAlpha = n.a * 0.8;
          ctx.stroke();
        } else if (n.kind === 0) {
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, R + 6, 0, Math.PI * 2);
          ctx.setLineDash([4, 3]);
          ctx.lineDashOffset = -time * 0.006;
          ctx.strokeStyle = n.ring;
          ctx.lineWidth = 1;
          ctx.globalAlpha = n.a * 0.85;
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (n.matchRank >= 0) {
          ctx.beginPath();
          ctx.arc(n.sx, n.sy, R + 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = RED;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (isActive) {
          // Counter-rotating reticle: segmented inner ring clockwise, tick
          // ring counter-clockwise.
          const r1 = R + 7;
          const r2 = R + 12;
          const spin = time * 0.0016;
          ctx.strokeStyle = SILVER;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.9;
          for (let q = 0; q < 4; q++) {
            const a0 = spin + (q * Math.PI) / 2;
            ctx.beginPath();
            ctx.arc(n.sx, n.sy, r1, a0, a0 + 0.9);
            ctx.stroke();
          }
          ctx.beginPath();
          for (let q = 0; q < 8; q++) {
            const a0 = -spin * 0.7 + (q * Math.PI) / 4;
            const ca = Math.cos(a0);
            const sa = Math.sin(a0);
            ctx.moveTo(n.sx + ca * r2, n.sy + sa * r2);
            ctx.lineTo(n.sx + ca * (r2 + 3), n.sy + sa * (r2 + 3));
          }
          ctx.stroke();
          addRect(n.sx - r2 - 3, n.sy - r2 - 3, (r2 + 3) * 2, (r2 + 3) * 2);
        }
      }

      // --- 11. Labels with collision avoidance -----------------------------
      const labelOrder = sim.labelOrder;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.wantLabel = !sim.warp && n.ta >= 0.3 && !(queryActive && n.kind === 1);
        n.priority =
          i === activeProject ? 0 : n.matchRank >= 0 ? 1 + n.matchRank * 0.01 : n.kind === 0 ? 2 : n.kind === 2 ? 3 : 4;
      }
      for (let i = 1; i < labelOrder.length; i++) {
        const v = labelOrder[i];
        const p = nodes[v].priority;
        let j = i - 1;
        while (j >= 0 && nodes[labelOrder[j]].priority > p) {
          labelOrder[j + 1] = labelOrder[j];
          j--;
        }
        labelOrder[j + 1] = v;
      }

      const blend = 1 - Math.exp(-dt * 12);
      for (let o = 0; o < labelOrder.length; o++) {
        const i = labelOrder[o];
        const n = nodes[i];
        n.labelOn = false;
        if (n.wantLabel && n.a > 0.25) {
          const titleFont = n.kind === 0 ? FONT_ANCHOR : n.kind === 1 ? FONT_DOMAIN : FONT_PROJECT;
          const titleH = n.kind === 0 ? 17 : n.kind === 1 ? 13 : 15;
          const subText = n.kind !== 2 ? '' : n.simText || (compact ? '' : n.sub);
          const titleW = measure(titleFont, n.label);
          const subW = subText ? measure(FONT_SUB, subText) : 0;
          // Outward direction: away from the parent, or straight up for anchors.
          let dx = 0;
          let dy = -1;
          if (n.parent >= 0) {
            const pn = nodes[n.parent];
            const vx = n.sx - pn.sx;
            const vy = n.sy - pn.sy;
            const vl = Math.hypot(vx, vy);
            if (vl > 1) {
              dx = vx / vl;
              dy = vy / vl;
            }
          }
          const R = n.r * n.s;
          for (let pass = subText ? 0 : 1; pass < 2 && !n.labelOn; pass++) {
            const lines = pass === 0 ? 2 : 1;
            const w = Math.max(titleW, pass === 0 ? subW : 0) + 2;
            const h = lines === 2 ? titleH + 12 : titleH;
            const total = CAND_ANGLES.length * 2;
            const startCand = n.labelLines === lines ? n.labelCand : 0;
            for (let c = 0; c < total; c++) {
              const cand = (startCand + c) % total;
              const ang = CAND_ANGLES[cand % CAND_ANGLES.length];
              const dist = R + (cand < CAND_ANGLES.length ? 7 : 20);
              const ca = Math.cos(ang);
              const sa = Math.sin(ang);
              const ux = dx * ca - dy * sa;
              const uy = dx * sa + dy * ca;
              const ax = n.sx + ux * dist;
              const ay = n.sy + uy * dist;
              const x = ax + (ux * 0.5 - 0.5) * w;
              const y = ay + (uy * 0.5 - 0.5) * h;
              if (!overlaps(x, y, w, h)) {
                addRect(x - 2, y - 1, w + 4, h + 2);
                n.labelOn = true;
                n.labelCand = cand;
                n.labelLines = lines;
                n.lx = x;
                n.ly = y;
                n.lw = w;
                n.lh = h;
                break;
              }
            }
          }
        }
        n.labelVis = reduced ? (n.labelOn ? 1 : 0) : n.labelVis + ((n.labelOn ? 1 : 0) - n.labelVis) * blend;
      }

      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      ctx.lineJoin = 'round';
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.labelVis < 0.02 || !n.labelOn) continue;
        const alpha = n.labelVis * Math.min(1, n.a * 1.2);
        const titleFont = n.kind === 0 ? FONT_ANCHOR : n.kind === 1 ? FONT_DOMAIN : FONT_PROJECT;
        const titleH = n.kind === 0 ? 17 : n.kind === 1 ? 13 : 15;
        ctx.globalAlpha = alpha;
        ctx.font = titleFont;
        ctx.lineWidth = 3;
        ctx.strokeStyle = MIDNIGHT;
        ctx.strokeText(n.label, n.lx + 1, n.ly + 1);
        ctx.fillStyle = i === activeProject ? '#FFFFFF' : n.kind === 1 ? SILVER : ALABASTER;
        if (n.kind === 1) ctx.globalAlpha = alpha * 0.8;
        ctx.fillText(n.label, n.lx + 1, n.ly + 1);
        if (n.labelLines === 2) {
          const subText = n.simText || n.sub;
          ctx.globalAlpha = alpha;
          ctx.font = FONT_SUB;
          ctx.strokeText(subText, n.lx + 1, n.ly + titleH);
          ctx.fillStyle = n.simText ? RED : i === activeProject ? RED : TITANIUM;
          ctx.fillText(subText, n.lx + 1, n.ly + titleH);
        }
      }

      // --- 12. Sparks --------------------------------------------------------
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.2;
      const drag = Math.exp(-dt * 4);
      for (let s = 0; s < sparks.length; s++) {
        const sp = sparks[s];
        if (sp.life <= 0) continue;
        sp.life -= dt;
        sp.vx *= drag;
        sp.vy *= drag;
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        const lifeT = Math.max(0, sp.life / sp.max);
        ctx.globalAlpha = lifeT * 0.95;
        ctx.strokeStyle = sp.tint === 0 ? '#FF4419' : '#5B8CFF';
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x - sp.vx * 0.03, sp.y - sp.vy * 0.03);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';

      // --- 13. Warp finish ---------------------------------------------------
      if (sim.warp) {
        ctx.restore();
        const veil = Math.max(0, Math.min(1, (warpT - 0.55) / 0.45));
        if (veil > 0) {
          ctx.globalAlpha = veil * veil * (3 - 2 * veil);
          ctx.fillStyle = MIDNIGHT;
          ctx.fillRect(0, 0, W, H);
        }
        if (warpT >= 1 && !sim.warp.pushed) {
          sim.warp.pushed = true;
          const slug = nodes[sim.warp.index].id;
          routerRef.current.push(`/projects/${slug}`).catch(() => {
            sim.warp = null;
            setWarping(false);
          });
        }
      }
      ctx.globalAlpha = 1;

      // --- 14. Lens callout, clamped to the stage --------------------------
      const lens = lensRef.current;
      if (lens && lensIndex >= 0) {
        // Transform writes never dirty layout, so this read is cheap; it
        // tracks the lens as React swaps its content.
        if (lens.offsetHeight > 0) {
          sim.lensSize.w = lens.offsetWidth;
          sim.lensSize.h = lens.offsetHeight;
        }
        const n = nodes[lensIndex];
        const lw = sim.lensSize.w;
        const lh = sim.lensSize.h;
        const gap = 22;
        let lx = n.sx + gap;
        if (lx + lw > W - 12) lx = n.sx - gap - lw;
        lx = Math.max(12, Math.min(W - lw - 12, lx));
        let ly = n.sy - lh / 2;
        if (compact) ly = n.sy + gap > H - lh - 12 ? n.sy - gap - lh : n.sy + gap;
        ly = Math.max(12, Math.min(H - lh - 12, ly));
        lens.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
      }

      // --- Debug probes (dev only) ----------------------------------------
      if (process.env.NODE_ENV !== 'production') {
        const dbg = sim.debug;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const l = dbg.labels[i];
          l.text = n.labelOn ? n.label : '';
          l.x = n.lx;
          l.y = n.ly;
          l.w = n.lw;
          l.h = n.lh;
        }
        dbg.frame++;
        if (dbg.drawMs.length >= 240) dbg.drawMs.shift();
        dbg.drawMs.push(performance.now() - t0);
      }
    },
    [hitTest, prefetch]
  );

  useCanvasStage(stageRef, canvasRef, draw);

  // ---------------------------------------------------------------------
  // Markup
  // ---------------------------------------------------------------------

  const lensProject = lensSlug ? PROJECTS.find((p) => p.slug === lensSlug) ?? null : null;
  const lensMatch = lensProject ? matches.find((m) => PROJECTS[m.index].slug === lensProject.slug) : undefined;
  const activeFilter = FILTERS.find((f) => (f.domains ? focus?.ids.join(',') === f.domains.join(',') : !focus))?.id;
  const focusCoreDef = focus?.core ? ANCHORS.find((a) => a.id === focus.core) : null;
  const focusDomainDef = focus?.domain ? DOMAINS.find((d) => d.id === focus.domain) : null;
  const focusFilterDef = focus && !focus.domain && !focusCoreDef ? FILTERS.find((f) => f.id === activeFilter) : null;
  const hasQuery = query.trim().length > 0;

  return (
    <section id="archive" className="relative w-full py-16 sm:py-24 bg-transparent" aria-labelledby="codegraph-title">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10 pb-6 border-b border-[#C8D2E0]/10">
          <div className="space-y-3 max-w-[560px]">
            <h2 id="codegraph-title" className="text-[length:var(--display-size)] font-serif text-[#F4F6F9] leading-tight tracking-tight">
              Systems Constellation.
            </h2>
            <p className="text-sm sm:text-[15px] font-sans text-[#C8D2E0]/75 leading-relaxed">
              All {PROJECTS.length} projects, placed by what they share. Search by idea, filter by domain, or hover a
              node to see its three nearest neighbors by text similarity.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[420px] lg:max-w-[520px]">
            <label className="relative flex items-center gap-2 border-b border-[#C8D2E0]/20 focus-within:border-[#FF2800] transition-colors pb-1.5">
              <span className="sr-only">Search projects by idea</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (focus) setFocus(null);
                }}
                placeholder="Search by idea: retrieval, Grad-CAM, web workers"
                className="w-full min-h-[32px] bg-transparent font-mono text-[13px] text-[#F4F6F9] placeholder:text-[#7E8B9B] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="shrink-0 font-mono text-xs text-[#7E8B9B] hover:text-[#F4F6F9] px-1.5 min-h-[32px] cursor-pointer"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </label>

            <div role="group" aria-label="Filter by domain" className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[12px]">
              {FILTERS.map((f, i) => {
                const active = activeFilter === f.id && !hasQuery;
                return (
                  <React.Fragment key={f.id}>
                    {i > 0 && (
                      <span aria-hidden="true" className="text-[#7E8B9B]/60">
                        ·
                      </span>
                    )}
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        if (f.domains?.length === 1) focusDomain(f.domains[0]);
                        else if (f.domains) focusDomains({ ids: f.domains, core: null, domain: null });
                        else {
                          setFocus(null);
                          setQuery('');
                        }
                      }}
                      className={`min-h-[32px] px-1 cursor-pointer transition-colors underline-offset-4 decoration-1 ${
                        active ? 'text-[#FF2800] underline' : 'text-[#C8D2E0]/75 hover:text-[#F4F6F9]'
                      }`}
                    >
                      {f.label}
                      {f.id === 'all' ? ` ${PROJECTS.length}` : ''}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 pt-4 font-mono text-xs min-h-[36px]">
          <nav aria-label="Graph position" className="flex flex-wrap items-center gap-2 text-[#7E8B9B]">
            <button
              type="button"
              onClick={() => setFocus(null)}
              className={`cursor-pointer transition-colors ${focus ? 'hover:text-[#F4F6F9]' : 'text-[#F4F6F9]'}`}
              aria-current={focus ? undefined : 'location'}
            >
              {focus ? '← All projects' : 'All projects'}
            </button>
            {focusCoreDef && (
              <>
                <span aria-hidden="true">/</span>
                <button
                  type="button"
                  onClick={() => focusCore(focusCoreDef.id)}
                  className={`cursor-pointer transition-colors ${focusDomainDef ? 'hover:text-[#F4F6F9]' : 'text-[#F4F6F9]'}`}
                >
                  {focusCoreDef.label}
                </button>
              </>
            )}
            {(focusDomainDef || focusFilterDef) && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#F4F6F9]" aria-current="location">
                  {focusDomainDef ? focusDomainDef.label : focusFilterDef?.label}
                </span>
              </>
            )}
          </nav>
          <p className="text-[#7E8B9B]" aria-live="polite">
            {hasQuery
              ? matches.length > 0
                ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}, ranked by TF-IDF cosine`
                : 'No close match. Try retrieval, java, or tokens.'
              : ''}
          </p>
        </div>
      </div>

      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={onStageClick}
        className="relative w-full h-[82dvh] min-h-[680px] overflow-hidden select-none"
        style={{ touchAction: 'pan-y' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          role="img"
          aria-label={`Constellation graph of ${PROJECTS.length} projects grouped into ${DOMAINS.length} domains. Use the project links that follow to open each case study.`}
        />

        <div
          ref={lensRef}
          aria-hidden={lensProject ? undefined : true}
          className={`absolute left-0 top-0 z-20 w-[min(320px,calc(100%-24px))] transition-opacity duration-150 ${
            lensProject && !warping ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${touchSlug ? '' : 'pointer-events-none'}`}
          style={{ transform: 'translate3d(-9999px, 0, 0)' }}
        >
          {lensProject && (
            <div className="rounded-[2px] border border-[#C8D2E0]/15 bg-[#03050A]/90 backdrop-blur-md px-4 py-3.5 shadow-[0_18px_48px_rgba(0,0,0,0.55)]">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-[17px] leading-tight text-[#F4F6F9]">{lensProject.name}</h3>
                <span className="font-mono text-[12px] text-[#7E8B9B] shrink-0">
                  {lensMatch ? <span className="text-[#FF2800]">{lensMatch.sim.toFixed(2)} SIM</span> : lensProject.year}
                </span>
              </div>
              {lensProject.subtitle && (
                <p className="mt-0.5 font-sans text-[11.5px] leading-snug text-[#C8D2E0]/65">{lensProject.subtitle}</p>
              )}
              <p className="mt-1.5 font-sans text-[12.5px] leading-snug text-[#C8D2E0]/90 line-clamp-2">{lensProject.summary}</p>
              <p className="mt-2 font-mono text-[12px] text-[#7E8B9B] truncate">{lensProject.stack}</p>
              {touchSlug === lensProject.slug ? (
                <button
                  type="button"
                  onClick={() => startDive(lensProject.slug)}
                  className="mt-3 w-full min-h-[40px] inline-flex items-center justify-between font-mono text-[12px] text-[#F4F6F9] border-t border-[#C8D2E0]/10 pt-2 cursor-pointer"
                >
                  <span>Open case study</span>
                  <span className="text-[#FF2800]" aria-hidden="true">
                    ↗
                  </span>
                </button>
              ) : (
                <p className="mt-2.5 font-mono text-[12px] text-[#F4F6F9]">
                  Click to open case study <span className="text-[#FF2800]">↗</span>
                </p>
              )}
            </div>
          )}
        </div>

        <nav aria-label="Projects in the constellation">
          <ul>
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  onFocus={() => setKeyboardSlug(p.slug)}
                  onBlur={() => setKeyboardSlug((cur) => (cur === p.slug ? null : cur))}
                  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:bottom-4 focus:z-30 focus:px-3 focus:py-2 focus:rounded-[2px] focus:bg-[#03050A] focus:text-[#F4F6F9] focus:font-mono focus:text-xs focus:outline focus:outline-1 focus:outline-[#FF2800]"
                >
                  {p.name}, {p.highlight}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Interaction hints are for assistive tech only (V7: no visible how-to text). */}
      <p className="sr-only-v7">
        Sweep across a line to pluck it. Click a domain to zoom in; Escape zooms out. Tab walks every project.
        On touch, tap a node to preview it, then open the case study.
      </p>
    </section>
  );
};

export default HomeCodeGraph;
