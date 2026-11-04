/**
 * Flagship & Archive Projects Engine for hareshmurugesan.com
 * Reconciled across technical case studies, GitHub repositories, and evidence records.
 */

export interface EngineeringTradeoff {
  title: string;
  optionChosen: string;
  alternativeRejected: string;
  costAccepted: string;
  measuredResult: string;
}

export interface C4DiagramNode {
  id: string;
  label: string;
  sublabel: string;
  type: 'client' | 'worker' | 'api' | 'storage' | 'external';
  description: string;
}

export interface C4DiagramEdge {
  from: string;
  to: string;
  label: string;
  protocol?: string;
}

export interface C4Diagram {
  title: string;
  description: string;
  nodes: C4DiagramNode[];
  edges: C4DiagramEdge[];
}

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
  evidenceId?: string;
}

export interface ProjectCaseStudy {
  executiveSummary: string;
  problem: string;
  architecture: string;
  tradeoffsSummary: string;
  decisions: EngineeringTradeoff[];
  c4Diagram?: C4Diagram;
  metrics: ProjectMetric[];
  personalContribution: string;
  limitations: string;
  nextSteps: string;
}

export interface Project {
  slug: string;
  aliases?: string[];
  title: string;
  year: string;
  category: 'AI & Vision' | 'Full-Stack Systems' | 'Research & Data' | 'Systems & Core';
  categoryFilter: 'ai-ml' | 'systems' | 'research';
  statusBadge: 'Live Demo' | 'Recorded Walkthrough' | 'Prototype' | 'Award Winner' | 'Research';
  role: string;
  highlight: string;
  stack: string;
  description: string;
  primaryEvidenceId?: string;
  icons: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured: boolean;
  caseStudy: ProjectCaseStudy;
}

export const flagshipProjects: Project[] = [
  {
    slug: 'apexis',
    aliases: ['apexis-telemetry', 'ai-motorsports-hub'],
    title: 'Apexis — Centralized Motorsports Intelligence Platform',
    year: '2026',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Lead Architect & Systems Engineer',
    highlight: '60fps Race Sim & In-Browser OCR',
    stack: 'Next.js 14, React, TypeScript, TensorFlow.js, Tesseract.js, SQLite',
    description: 'Unified telemetry and predictive strategy platform for motorsport disciplines (F1, F2, F3, FE, NASCAR, GTWC). Features a multi-threaded 2D live race simulation Web Worker, client-side Tesseract.js OCR broadcast scanning, and a TensorFlow.js tire degradation model.',
    primaryEvidenceId: 'apexis-60fps-sim',
    icons: ['nextjs.svg', 'react.svg', 'typescript.svg', 'tensorflow.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/AIMotorsportsHub',
    demo: 'https://ai-motorsports-hub.vercel.app/',
    image: '/apexis.png',
    featured: true,
    caseStudy: {
      executiveSummary: 'Apexis unifies fragmented multi-series motorsport telemetry into a singular browser-based intelligence hub. By executing 2D physics simulations and live broadcast OCR off the main JavaScript thread via Web Workers, it delivers real-time spatial race modeling with zero cloud computing overhead.',
      problem: 'Motorsport followers are forced to jump between disjointed timing websites, static classification PDFs, and ungrounded social commentary during race weekends. There existed no centralized system combining live spatial car tracking with contextual machine learning to explain tire degradation cliffs, pit stop windows, and undercut deltas dynamically.',
      architecture: 'Architected on Next.js with React and strict TypeScript. Compute-intensive tasks are offloaded to isolated Web Workers: simulator.worker.ts executes real-time position calculations against OpenF1 track coordinate schemas, while a client-side Tesseract.js worker parses broadcast timing graphics directly in-browser. An embedded SQLite database powers sub-12ms historical lookups dating back to 1950.',
      tradeoffsSummary: 'Migrating simulation math and OCR completely into client Web Workers eliminated cloud GPU infrastructure costs and streaming latency, at the cost of requiring modern client hardware capable of running parallel worker threads.',
      decisions: [
        {
          title: 'Off-Main-Thread Web Worker Simulation Engine',
          optionChosen: 'Custom TypeScript 2D physics simulation running in a dedicated Web Worker (simulator.worker.ts).',
          alternativeRejected: 'Server-side headless simulation streaming coordinates via WebSockets.',
          costAccepted: 'Increased initial client bundle size by ~45KB and client-side CPU usage during multi-car simulation.',
          measuredResult: 'Zero cloud server costs, zero WebSocket reconnection failures, and rock-solid 60fps rendering without UI thread jank.',
        },
        {
          title: 'Client-Side Tesseract.js OCR vs Cloud Vision API',
          optionChosen: 'In-browser Tesseract.js worker extracting broadcast standings from screenshots.',
          alternativeRejected: 'Cloud Vision API / AWS Rekognition streaming endpoint.',
          costAccepted: 'OCR processing takes 1.2–2.0s per frame on client rather than 300ms cloud inference.',
          measuredResult: 'Eliminated per-frame API billing and privacy concerns with 100% offline-capable image recognition.',
        },
      ],
      c4Diagram: {
        title: 'Apexis System Architecture (C4 Component Model)',
        description: 'Client-side worker segregation isolating physics calculations and OCR from React DOM tree.',
        nodes: [
          { id: 'client-ui', label: 'React UI Thread', sublabel: 'Next.js 14 / Tailwind', type: 'client', description: 'Renders telemetry graphs, driver leaderboard, and pit delta HUD' },
          { id: 'sim-worker', label: 'simulator.worker.ts', sublabel: 'Dedicated Web Worker', type: 'worker', description: 'Calculates 2D car coordinates and sector times at 60fps' },
          { id: 'ocr-worker', label: 'Tesseract OCR Worker', sublabel: 'Client-side WASM', type: 'worker', description: 'Parses live TV broadcast frame captures to update driver standings' },
          { id: 'tfjs-engine', label: 'TensorFlow.js Model', sublabel: 'Client Neural Network', type: 'worker', description: 'Predicts tire degradation curve penalties based on track temp' },
          { id: 'local-sqlite', label: 'Historical SQLite DB', sublabel: 'better-sqlite3 / IndexedDB', type: 'storage', description: 'Sub-12ms queries across 70+ years of Formula 1 telemetry' },
          { id: 'openf1-api', label: 'OpenF1 Telemetry API', sublabel: 'External Live Feed', type: 'external', description: 'Ingests real-time car telemetry, throttle, brake, and gear data' },
        ],
        edges: [
          { from: 'client-ui', to: 'sim-worker', label: 'Dispatches track & weather params', protocol: 'postMessage' },
          { from: 'sim-worker', to: 'client-ui', label: 'Emits 60fps car coordinates', protocol: 'postMessage' },
          { from: 'client-ui', to: 'ocr-worker', label: 'Sends video canvas snapshot', protocol: 'postMessage' },
          { from: 'client-ui', to: 'local-sqlite', label: 'Queries historical head-to-head', protocol: 'SQL (<12ms)' },
          { from: 'client-ui', to: 'openf1-api', label: 'Polls live session timing', protocol: 'REST HTTPS' },
        ],
      },
      metrics: [
        { label: 'Simulation Frame Rate', value: '60 fps', detail: 'Off-main-thread Web Worker physics pipeline', evidenceId: 'apexis-60fps-sim' },
        { label: 'Broadcast OCR Engine', value: '100% Client', detail: 'Zero-cloud-cost in-browser image parsing' },
        { label: 'Historical Query Time', value: '< 12 ms', detail: 'Indexed local SQLite lookups (1950–present)', evidenceId: 'apexis-sqlite-latency' },
        { label: 'Telemetry Ingestion', value: '< 150 ms', detail: 'Serverless OpenF1 telemetry ingestion' },
      ],
      personalContribution: 'Sole designer and developer. Conceived the architectural separation between UI rendering and Web Worker physics, authored the simulation math, and integrated OpenF1 telemetry schemas.',
      limitations: 'Simulation fidelity is constrained to 2D track path projections and does not model 3D aero-wake turbulence between closely following cars.',
      nextSteps: 'Implementing live team-radio speech-to-text audio transcription and an automated safety-car probability model based on sector yellow-flag clustering.',
    },
  },
  {
    slug: 'healios',
    aliases: ['healios-v2', 'healios-irb'],
    title: 'Healios V2 — Multimodal Post-Op Recovery Platform',
    year: '2026',
    category: 'AI & Vision',
    categoryFilter: 'ai-ml',
    statusBadge: 'Live Demo',
    role: 'AI & Full-Stack Systems Architect',
    highlight: '8.09ms Grad-CAM XAI & Edge Quality Gate',
    stack: 'Next.js, TypeScript, Python 3.11, FastAPI, TensorFlow/Keras, OpenCV',
    description: 'Clinical recovery monitoring ecosystem integrating Explainable AI (Grad-CAM in 8.09ms), tissue morphology HSV segmentation (2.00ms), edge HTML5 Canvas Laplacian blur gatekeeping (<35ms), and an EHR-integrated clinical recovery agent grounded in ERAS protocols.',
    primaryEvidenceId: 'healios-xai-saliency',
    icons: ['nextjs.svg', 'python.svg', 'fastapi.svg', 'tensorflow.svg', 'typescript.svg'],
    github: 'https://github.com/haresham15/HealiosPostSurgery',
    demo: 'https://healiosaisurgeryassistant.vercel.app/patient/dashboard',
    image: '/healios.png',
    featured: true,
    caseStudy: {
      executiveSummary: 'Healios V2 is a full-stack post-surgical wound monitoring intelligence platform that solves the clinical trust deficit in healthcare AI. By coupling deep convolutional classifications with sub-10ms Grad-CAM saliency heatmaps, HSV tissue bed segmentation, and edge blur rejection, surgeons inspect transparent diagnostic rationale rather than black-box scores.',
      problem: 'Postoperative surgical site infections (SSIs) drive up to 20% of unplanned 30-day hospital readmissions. Remote monitoring apps fail because surgeons reject unexplained probability outputs, blurry patient phone photos waste cloud compute, and generic LLM chatbots hallucinate non-standard medical advice rather than conforming to established ERAS guidelines.',
      architecture: 'Structured as a Next.js 14 TypeScript client communicating with a high-throughput Python 3.11 FastAPI backend. Pre-flight edge inspection on the client Canvas rejects out-of-focus captures in <35ms. On the server, a custom Grad-CAM implementation generates saliency overlays via vectorized NumPy piecewise linear interpolation in 8.09ms, while an embedded hybrid BM25/TF-IDF retriever injects verified ERAS surgical protocols into the diagnostic tool loop.',
      tradeoffsSummary: 'Prioritized pure NumPy array interpolation over standard matplotlib image rendering to eliminate heavy C-extensions and server thread-locks, cutting memory footprint by 120MB+ while driving colormap synthesis under 10ms.',
      decisions: [
        {
          title: 'Vectorized NumPy Piecewise Jet Colormap vs Matplotlib',
          optionChosen: 'Authored vectorized linear interpolation directly on raw float saliency arrays.',
          alternativeRejected: 'Importing matplotlib.pyplot / cm and saving intermediate PNG buffers.',
          costAccepted: 'Required manual implementation of color look-up tables and RGB normalization math.',
          measuredResult: '8.09ms end-to-end saliency generation, 120MB+ RAM saved per container, and zero GUI backend locks.',
        },
        {
          title: 'Edge Canvas Laplacian Blur Check vs Server Rejection',
          optionChosen: 'In-browser HTML5 Canvas 3x3 Laplacian convolution kernel before image upload.',
          alternativeRejected: 'Uploading full 8MB phone captures to FastAPI backend for server-side quality validation.',
          costAccepted: 'Variations in mobile client browser JS execution speed across low-end mobile devices.',
          measuredResult: '<35ms immediate feedback to patient to retake photo before wasting cloud bandwidth and compute.',
        },
        {
          title: 'Embedded In-Memory Protocol RAG vs External Vector DB',
          optionChosen: 'In-memory BM25 + TF-IDF hybrid index for ERAS surgical guidelines.',
          alternativeRejected: 'Remote Pinecone / pgvector cluster requiring external API roundtrips.',
          costAccepted: 'Knowledge base size limited to verified surgical recovery handbooks (~50 documents).',
          measuredResult: '0.14ms guideline retrieval latency with zero external database downtime vulnerability.',
        },
      ],
      c4Diagram: {
        title: 'Healios V2 System Architecture (C4 Model)',
        description: 'End-to-end dataflow from client edge quality filter to explainable AI and clinical tool execution.',
        nodes: [
          { id: 'patient-client', label: 'Patient Web App', sublabel: 'Next.js 14 / TypeScript', type: 'client', description: 'Runs in-browser Canvas Laplacian blur gate (<35ms) before upload' },
          { id: 'fastapi-gw', label: 'FastAPI Gateway', sublabel: 'Python 3.11 / Uvicorn', type: 'api', description: 'Validates multipart image payloads and enforces JWT clinician auth' },
          { id: 'xai-engine', label: 'Grad-CAM XAI Engine', sublabel: 'TensorFlow / NumPy', type: 'worker', description: 'Computes gradient heatmaps & piecewise Jet colormap in 8.09ms' },
          { id: 'hsv-segmenter', label: 'Tissue Morphology Analyzer', sublabel: 'OpenCV / NumPy', type: 'worker', description: 'Segments granulation, slough, and necrotic tissue beds in 2.00ms' },
          { id: 'protocol-rag', label: 'ERAS Protocol RAG', sublabel: 'In-Memory BM25+TF-IDF', type: 'storage', description: 'Retrieves verified clinical post-op instructions in 0.14ms' },
          { id: 'ehr-db', label: 'Clinical EHR Persistence', sublabel: 'SQLModel / SQLite / Postgres', type: 'storage', description: 'Stores patient recovery timeline, vitals history, and audit logs' },
        ],
        edges: [
          { from: 'patient-client', to: 'fastapi-gw', label: 'Transmits validated image & survey', protocol: 'HTTPS REST' },
          { from: 'fastapi-gw', to: 'xai-engine', label: 'Dispatches 224x224 normalized tensor', protocol: 'In-Process' },
          { from: 'fastapi-gw', to: 'hsv-segmenter', label: 'Passes ROI wound coordinates', protocol: 'In-Process' },
          { from: 'fastapi-gw', to: 'protocol-rag', label: 'Queries postoperative symptoms', protocol: 'In-Memory (<1ms)' },
          { from: 'fastapi-gw', to: 'ehr-db', label: 'Persists encounter classification', protocol: 'SQL' },
        ],
      },
      metrics: [
        { label: 'Grad-CAM Saliency', value: '8.09 ms', detail: 'End-to-end generation latency (224x224 input)', evidenceId: 'healios-xai-saliency' },
        { label: 'Tissue Morphology', value: '2.00 ms', detail: 'Vectorized HSV bed segmentation (128x128)', evidenceId: 'healios-hsv-segmentation' },
        { label: 'Edge Pre-Flight Gate', value: '< 35 ms', detail: 'In-browser Canvas Laplacian blur check', evidenceId: 'healios-edge-blur-gate' },
        { label: 'Protocol RAG Lookup', value: '0.14 ms', detail: 'In-memory BM25 + TF-IDF query latency' },
      ],
      personalContribution: 'Led end-to-end architecture. Implemented the vectorized Grad-CAM synthesis pipeline, the client-side Canvas Laplacian blur check, and the FastAPI service layer with ERAS protocol tooling.',
      limitations: 'The classification and saliency weights were trained on open dermatological and postoperative incision datasets; clinical deployment requires multi-center IRB-governed validation.',
      nextSteps: 'Extending segmentation architecture to incorporate 3D stereo depth camera feeds on mobile devices for volumetric wound cavity healing measurement.',
    },
  },
  {
    slug: 'tempo',
    aliases: ['tempo-spatial-audio', 'tempo-adhd-assist'],
    title: 'Tempo — RSD Communication Buffer & Regulation Suite',
    year: '2026',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Prototype',
    role: 'Creator & Systems Engineer',
    highlight: '100% Crisis Recall & Zero-Destination Buffer',
    stack: 'Next.js 15, React 19, TypeScript, PostgreSQL (pgvector), Supabase',
    description: 'Tactical emotional buffer and executive regulation suite designed for Rejection Sensitive Dysphoria (RSD) and ADHD task freeze. Features PostgreSQL pgvector IVFFlat Cosine RAG, 100% crisis recall deterministic safety, dual-provider failover, and Spatial Task Chunker CV.',
    primaryEvidenceId: 'tempo-crisis-recall',
    icons: ['nextjs.svg', 'react.svg', 'typescript.svg', 'sql.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/TempoADHDAssist',
    demo: 'https://github.com/haresham15/TempoADHDAssist',
    image: '/tempo.png',
    featured: true,
    caseStudy: {
      executiveSummary: 'Tempo serves as an intentional cognitive circuit breaker for neurodivergent individuals experiencing rejection sensitivity spirals. It combines an air-gapped, zero-destination communication buffer with PostgreSQL pgvector semantic emotional memory, deterministic crisis interception, and spatial vision task chunking.',
      problem: 'For people with ADHD and RSD, ambiguous communications (a terse Slack from a boss or dry text from a partner) trigger instantaneous autonomic fight-or-flight panic. In acute distress, executive functioning degrades, causing impulsive defensive emails, task paralysis, and shame spirals that damage careers and relationships.',
      architecture: 'Constructed on Next.js 15 with React 19, strict TypeScript, and Supabase PostgreSQL with Row Level Security. Leverages pgvector IVFFlat Cosine Similarity (768-dim embeddings) to surface how the user successfully resolved similar emotional triggers in the past. Employs a deterministic 0.2ms regex circuit breaker before any model call to guarantee 100% crisis interception, backed by an active-passive LLM failover state machine.',
      tradeoffsSummary: 'Deliberately omitted all direct third-party communication integrations (Slack, Gmail, SMS). While this requires manual copy-pasting, it creates an absolute zero-destination barrier ensuring un-regulated drafts can never be sent impulsively.',
      decisions: [
        {
          title: 'Zero-Destination Architecture vs Send Integrations',
          optionChosen: 'Strict standalone sandbox requiring explicit manual copy-paste to send any message.',
          alternativeRejected: 'Building a Chrome extension or Slack app that replaces the "Send" button.',
          costAccepted: 'Extra friction for everyday composing; cannot automate dispatch directly.',
          measuredResult: 'Guaranteed prevention of catastrophic impulsive transmissions under severe autonomic distress.',
        },
        {
          title: 'Deterministic Regex Circuit Breaker vs Model Safety Prompts',
          optionChosen: 'Hardcoded deterministic regex & token pattern interceptor executing in 0.2ms before model dispatch.',
          alternativeRejected: 'Relying solely on LLM system prompt guardrails to detect crisis language.',
          costAccepted: 'Requires maintaining regex pattern dictionaries for self-harm and crisis phrases.',
          measuredResult: '100% recall (5/5 crisis cases caught) with 0.0% false-alarm on colloquial distress in benchmark test.',
        },
        {
          title: 'Active-Passive Model Failover with Zod Self-Correction',
          optionChosen: 'Primary DeepSeek V3 with automatic 1-turn Zod schema self-correction falling back to Gemini 3.5 Flash Lite.',
          alternativeRejected: 'Single-provider dependency without fallback.',
          costAccepted: 'Dual SDK integration and maintaining unified structured output contracts.',
          measuredResult: '100% valid JSON parse rate across test benchmark with zero runtime crashes.',
        },
      ],
      c4Diagram: {
        title: 'Tempo System Architecture (C4 Model)',
        description: 'Zero-destination communication buffer with multi-tiered deterministic safety gates and semantic RAG.',
        nodes: [
          { id: 'buffer-ui', label: 'Zero-Destination Buffer', sublabel: 'React 19 / WCAG AAA', type: 'client', description: 'Air-gapped drafting space with sensory regulation audio engine' },
          { id: 'safety-gate', label: 'Deterministic Safety Gate', sublabel: '0.2ms Regex Interceptor', type: 'api', description: 'Catches self-harm and crisis language before any external network call' },
          { id: 'pgvector-db', label: 'Supabase pgvector', sublabel: 'PostgreSQL 16 / IVFFlat', type: 'storage', description: '768-dim embeddings retrieving past resolved emotional spirals' },
          { id: 'primary-llm', label: 'Primary LLM (DeepSeek V3)', sublabel: 'Structured JSON / Zod', type: 'worker', description: 'Analyzes cognitive distortions and generates objective reframing options' },
          { id: 'fallback-llm', label: 'Fallback LLM (Gemini 3.5)', sublabel: 'Low-Latency Fallback', type: 'worker', description: 'Automatic failover target if primary provider latency exceeds 1,200ms' },
          { id: 'vision-chunker', label: 'Spatial Task Chunker', sublabel: 'Multimodal Vision', type: 'worker', description: 'Identifies one micro-action from cluttered workspace photograph' },
        ],
        edges: [
          { from: 'buffer-ui', to: 'safety-gate', label: 'Submits draft for reframing', protocol: 'In-Memory (<1ms)' },
          { from: 'safety-gate', to: 'pgvector-db', label: 'Retrieves historical reflections', protocol: 'pgvector Cosine Sim' },
          { from: 'safety-gate', to: 'primary-llm', label: 'Dispatches structured prompt', protocol: 'HTTPS REST' },
          { from: 'primary-llm', to: 'fallback-llm', label: 'Failover on timeout or schema error', protocol: 'State Machine' },
          { from: 'buffer-ui', to: 'vision-chunker', label: 'Uploads workspace photo', protocol: 'HTTPS REST' },
        ],
      },
      metrics: [
        { label: 'Crisis Recall', value: '100.0% (5/5)', detail: '0 false negatives on 30-case benchmark', evidenceId: 'tempo-crisis-recall' },
        { label: 'Colloquial False-Alarm', value: '0.0% (0/5)', detail: 'Zero false alarms on colloquial idioms' },
        { label: 'Semantic RAG Sim', value: '0.824 Cosine', detail: 'Surfacing historically resolved spirals', evidenceId: 'tempo-pgvector-rag' },
        { label: 'Safety Gate Latency', value: '0.20 ms', detail: 'Pre-flight deterministic regex interception' },
      ],
      personalContribution: 'Conceived and engineered the complete system. Formulated the zero-destination interaction pattern, built the deterministic crisis interception engine, and implemented the pgvector RAG memory layer.',
      limitations: 'Strictly evaluated on a 30-case benchmark dataset. Designed as a personal executive functioning aid; does not provide clinical psychiatric therapy or professional crisis intervention.',
      nextSteps: 'Developing an on-device quantized small language model (Gemma 2 2B via WebGPU / ONNX) to enable 100% offline air-gapped emotional reframing on mobile browsers.',
    },
  },
  {
    slug: 'routerx-careline',
    aliases: ['routerx', 'careline', 'routerx-careline-hub'],
    title: 'RouteRx (Careline) — Bi-Directional Transit Hub',
    year: '2026',
    category: 'Research & Data',
    categoryFilter: 'research',
    statusBadge: 'Award Winner',
    role: 'Lead Data Scientist & Spatial Systems Engineer',
    highlight: '1st Place ASA DataFest 2026',
    stack: 'RStudio, Python, Tigercensus, OpenStreetMap, GTFS, OSRM, React',
    description: 'Predictive logistics engine solving healthcare transit barriers through bi-directional shuttle optimization for Stormont Vail Health. Awarded 1st Place for Best Use of External Data at ASA DataFest 2026.',
    primaryEvidenceId: 'routerx-careline-transit-gap',
    icons: ['react.svg', 'python.svg', 'javascript.svg', 'pandas.svg'],
    github: 'https://github.com/haresham15/Careline',
    demo: 'https://data-fest2026.vercel.app/',
    image: '/careline.png',
    featured: true,
    caseStudy: {
      executiveSummary: 'RouteRx (Careline) is a spatial logistics engine designed for Stormont Vail Health in Topeka, KS. By unifying preventative patient pick-up routes with discharge return trips on a single bi-directional shuttle fleet, it eliminates healthcare transit deserts while clearing acute hospital bed bottlenecks.',
      problem: 'Patients in transit-isolated census blocks miss preventative appointments and escalate into preventable ER emergencies. Simultaneously, medically discharged inpatients are trapped occupying acute hospital beds because public transit stops are inaccessible. In Topeka, 43 of 141 census blocks had zero bus stops within an 800m walking radius.',
      architecture: 'Engineered a spatial analytics workflow combining Tigercensus demographic data, OpenStreetMap road networks, and GTFS transit schedules in RStudio and Python. Formulated a Transit Vulnerability Index (TVI) and applied DBSCAN density clustering to identify patient pickup zones, routing shuttles through Open Source Routing Machine (OSRM) turn-by-turn geometry.',
      tradeoffsSummary: 'Aggregated million-coordinate spatial geometries into regional bounding boxes and discrete shuttle stop clusters, trading micro-level coordinate fidelity for real-time routing calculation speeds.',
      decisions: [
        {
          title: 'Bi-Directional Fleet Utilization vs Separate Fleets',
          optionChosen: 'Unified shuttle manifest pairing morning preventative pickups with afternoon discharge returns.',
          alternativeRejected: 'Commissioning two dedicated independent shuttle fleets.',
          costAccepted: 'More complex routing optimization and dynamic manifest rescheduling.',
          measuredResult: 'Cut simulated transportation costs by ~40% while freeing acute hospital inpatient capacity.',
        },
        {
          title: 'DBSCAN Spatial Clustering vs Fixed Administrative Zones',
          optionChosen: 'Density-based spatial clustering of vulnerable patient centroids.',
          alternativeRejected: 'Grouping by standard ZIP code or municipal neighborhood boundaries.',
          costAccepted: 'Clusters do not strictly align with existing municipal district boundaries.',
          measuredResult: 'Revealed contiguous transit-starved micro-clusters that cross ZIP code boundaries.',
        },
      ],
      c4Diagram: {
        title: 'RouteRx (Careline) Spatial Data Pipeline (C4 Model)',
        description: 'Multi-source geospatial data fusion pipeline driving bi-directional routing manifests.',
        nodes: [
          { id: 'data-sources', label: 'External Geodata', sublabel: 'Tigercensus / OSM / GTFS', type: 'external', description: 'Pulls census demographics, bus stop coordinates, and road network edges' },
          { id: 'tvi-engine', label: 'TVI Calculator', sublabel: 'RStudio / Tigercensus', type: 'worker', description: 'Calculates Transit Vulnerability Index for all 141 Shawnee County blocks' },
          { id: 'dbscan-clusterer', label: 'DBSCAN Spatial Clusterer', sublabel: 'Python / Scikit-Learn', type: 'worker', description: 'Groups high-vulnerability residential blocks into optimal pickup nodes' },
          { id: 'osrm-router', label: 'OSRM Routing Machine', sublabel: 'Open Source Routing Engine', type: 'api', description: 'Generates turn-by-turn driving paths and arrival ETA manifests' },
          { id: 'dispatch-dashboard', label: 'Hospital Dispatch UI', sublabel: 'React / Mapbox GL', type: 'client', description: 'Visualizes transit deserts and generates daily driver passenger manifests' },
        ],
        edges: [
          { from: 'data-sources', to: 'tvi-engine', label: 'Ingests boundary & transit shapefiles', protocol: 'Batch ETL' },
          { from: 'tvi-engine', to: 'dbscan-clusterer', label: 'Feeds vulnerability scores', protocol: 'GeoDataframe' },
          { from: 'dbscan-clusterer', to: 'osrm-router', label: 'Passes pickup cluster coordinates', protocol: 'REST GeoJSON' },
          { from: 'osrm-router', to: 'dispatch-dashboard', label: 'Streams optimized routes & ETAs', protocol: 'JSON API' },
        ],
      },
      metrics: [
        { label: 'Award', value: '1st Place', detail: 'Best Use of External Data (ASA DataFest 2026)', evidenceId: 'datafest-2025-first-place' },
        { label: 'Transit Deserts', value: '43 of 141 Blocks', detail: 'Blocks with 0 bus stops within 800m', evidenceId: 'routerx-careline-transit-gap' },
        { label: 'Routing Engine', value: 'OSRM Optimized', detail: 'Bi-directional patient pickup & discharge routing' },
        { label: 'Fleet Optimization', value: '~40% Cost Cut', detail: 'Simulated savings from dual-use shuttle fleet' },
      ],
      personalContribution: 'Co-led spatial modeling with Samay Patel, Harsha Kalivarapu, and Sudhish Gopalakrishnan. Authored the Transit Vulnerability Index formulas, performed GTFS transit accessibility buffer analysis, and structured the React dispatch dashboard.',
      limitations: 'Assumes normal road weather conditions and standard walking capabilities; does not account for temporary winter snow closures or steep topographical barriers.',
      nextSteps: 'Integrating real-time vehicle GPS tracking and wheelchair-accessibility constraint filters into the active OSRM dispatcher.',
    },
  },
];

export const archiveProjects: Project[] = [
  {
    slug: 'tamiltrove',
    aliases: ['fluidic-ml', 'tamil-trove'],
    title: 'TamilTrove — Hybrid Lexical & Dense Literature Search',
    year: '2026',
    category: 'AI & Vision',
    categoryFilter: 'ai-ml',
    statusBadge: 'Prototype',
    role: 'Creator & NLP Engineer',
    highlight: '94.2% Hit@5 Hybrid Retrieval',
    stack: 'Python 3.11, FAISS, BM25, Next.js, TypeScript',
    description: 'High-precision search platform for classical and modern Tamil literature (Thirukkural, Sangam poetry). Combines BM25 morphological tokenization with dense multilingual vector embeddings to achieve 94.2% Hit@5 retrieval accuracy.',
    primaryEvidenceId: 'tamiltrove-hit5',
    icons: ['python.svg', 'nextjs.svg', 'typescript.svg'],
    github: 'https://github.com/haresham15/TamilTrove',
    demo: 'https://tamiltrove.vercel.app/',
    featured: false,
    caseStudy: {
      executiveSummary: 'TamilTrove is a hybrid search engine built to navigate complex classical Tamil poetry and modern literature. By fusing BM25 morphological tokenization with dense vector embeddings via Reciprocal Rank Fusion, it achieves 94.2% Hit@5 retrieval accuracy across a 120-query expert benchmark.',
      problem: 'Classical Tamil features extensive agglutination, sandhi compound transformations, and rich metaphorical idioms. Pure keyword search fails on poetic metaphors, while purely dense multilingual embeddings miss exact literary references and ancient terminology.',
      architecture: 'Engineered a two-stage hybrid retrieval architecture. A custom Python morphological tokenizer splits Sandhi compounds into root morphemes for BM25 lexical indexing, while dense semantic embeddings are indexed in FAISS. Results are fused using Reciprocal Rank Fusion (RRF) and presented via a Next.js interface.',
      tradeoffsSummary: 'Chose a hybrid sparse-dense pipeline over heavy generative rerankers to maintain sub-50ms query latencies without requiring dedicated cloud GPU instances.',
      decisions: [
        {
          title: 'Reciprocal Rank Fusion vs Heavy Cross-Encoder Reranking',
          optionChosen: 'Rank-based score aggregation (RRF k=60) combining BM25 and FAISS results.',
          alternativeRejected: 'Deploying a 500MB cross-encoder model on GPU.',
          costAccepted: 'Minor loss in nuanced second-order contextual ranking on long passages.',
          measuredResult: 'Sub-50ms search latency on CPU with 94.2% Hit@5 on annotated test set.',
        },
      ],
      metrics: [
        { label: 'Retrieval Hit@5', value: '94.2%', detail: '120-query benchmark dataset', evidenceId: 'tamiltrove-hit5' },
        { label: 'Query Latency', value: '< 45 ms', detail: 'CPU hybrid search execution' },
      ],
      personalContribution: 'Authored the custom morphological segmentation rules, built the hybrid BM25/FAISS retrieval pipeline, and developed the Next.js frontend.',
      limitations: 'Performance degrades on rare medieval palm-leaf manuscript spellings without standard unicode normalization.',
      nextSteps: 'Incorporating OCR post-correction for archival manuscript scans.',
    },
  },
  {
    slug: 'nyc-housing-market-ai',
    aliases: ['nyc-os'],
    title: 'NYC Housing Market AI/ML Analysis (NYC OS)',
    year: '2026',
    category: 'Research & Data',
    categoryFilter: 'research',
    statusBadge: 'Award Winner',
    role: 'ML & Spatial Systems Engineer',
    highlight: 'K-Means Wealth Physics & Spatial Gravity',
    stack: 'React, Python, Scikit-Learn, K-Means, Deck.GL',
    description: 'Interactive spatial physics and ML visualization engine analyzing housing valuation concentration, wealth gravity, and gentrification vectors across NYC. Awarded at Hack To The Future.',
    icons: ['react.svg', 'python.svg', 'scitkitlearn.svg', 'javascript.svg'],
    github: 'https://github.com/haresham15/DataIO',
    featured: false,
    caseStudy: {
      executiveSummary: 'Award-winning project from Hack To The Future. An interactive spatial data visualization engine leveraging machine learning clustering and spatial gravity physics to model how capital density pulls market valuations across NYC boroughs.',
      problem: 'Traditional real estate analysis treats housing prices as static tabular data, obscuring the geographic momentum and spatial pull that high-value developments exert on surrounding neighborhoods.',
      architecture: 'Parsed millions of NYC housing transaction records, feeding property attributes (age, square footage, sale price, proximity to transit) into K-Means clustering and vector field simulation models visualized with Deck.GL.',
      tradeoffsSummary: 'Precomputed spatial cluster centroids for smooth 60fps browser rendering rather than running real-time clustering iterations on every map zoom change.',
      decisions: [
        {
          title: 'Spatial Physics Vector Field vs Static Heatmap',
          optionChosen: 'Dynamic vector field simulating economic capital attraction forces.',
          alternativeRejected: 'Standard 2D Gaussian density heatmap.',
          costAccepted: 'Required custom WebGL shader logic for arrow field rendering.',
          measuredResult: 'Clear intuitive visual representation of market displacement momentum.',
        },
      ],
      metrics: [
        { label: 'Hackathon Award', value: 'Top Project', detail: 'Hack To The Future Data Science Track' },
        { label: 'Dataset Processed', value: '1M+ Records', detail: 'NYC Department of Finance sales history' },
      ],
      personalContribution: 'Implemented K-Means clustering pipeline in Python and developed the interactive spatial map rendering in React.',
      limitations: 'Relies on historical transaction records; real-time predictive modeling requires live MLS feed integration.',
      nextSteps: 'Connecting real-time mortgage interest rate APIs to simulate macroeconomic rate elasticity.',
    },
  },
  {
    slug: 'cv-allergy-wheal',
    title: 'Digital Pathology & Allergy Wheal CV Research',
    year: '2026',
    category: 'AI & Vision',
    categoryFilter: 'ai-ml',
    statusBadge: 'Research',
    role: 'Undergraduate AI/ML Researcher',
    highlight: 'Ohio State Research Pipeline',
    stack: 'Python, OpenCV, TensorFlow, Scikit-Image',
    description: 'Automated computer vision image-processing pipeline quantifying allergy skin prick test (SPT) wheal and flare areas, replacing subjective millimeter calipers with standardized clinical imaging metrics.',
    icons: ['python.svg', 'tensorflow.svg', 'scitkitlearn.svg'],
    github: 'https://github.com/haresham15/cv_allergy_wheal',
    featured: false,
    caseStudy: {
      executiveSummary: 'Computer vision research developed at The Ohio State University to automate allergy skin prick test (SPT) wheal and flare quantification, replacing manual millimeter calipers with reproducible pixel-calibrated metrics.',
      problem: 'Manual millimeter ruler measurements of skin prick test wheals exhibit high inter-observer variability in clinical settings, resulting in inconsistent diagnostic grading for environmental and food allergens.',
      architecture: 'Engineered an image-processing pipeline combining spatial color thresholding, convex hull edge contouring, and elliptical fitting to calculate major/minor axis lengths and total surface area against reference calibration markers.',
      tradeoffsSummary: 'Prioritized deterministic geometric contouring over deep convolutional segmentation networks to ensure transparent, reproducible measurements that clinical researchers could audit directly without black-box opacity.',
      decisions: [
        {
          title: 'Deterministic Geometric Contouring vs Deep Segmentation',
          optionChosen: 'Convex hull & Otsu color thresholding with reference marker scaling.',
          alternativeRejected: 'U-Net deep segmentation network.',
          costAccepted: 'Requires clean lighting and clearly visible skin calibration marker.',
          measuredResult: '100% explainable metric extraction with zero training data hallucination.',
        },
      ],
      metrics: [
        { label: 'Measurement Metric', value: 'Calibrated mm²', detail: 'Area calculation against physical marker' },
        { label: 'Processing Speed', value: '< 80 ms', detail: 'Deterministic OpenCV pipeline per photograph' },
      ],
      personalContribution: 'Authored OpenCV image segmentation scripts, calibrated measurement calculations, and conducted clinical test comparisons.',
      limitations: 'Requires consistent flash lighting to prevent specular skin highlights from distorting contour boundaries.',
      nextSteps: 'Validating across diverse patient Fitzpatrick skin phototypes and varying erythema intensities.',
    },
  },
  {
    slug: 'syntinuum-podcast-website',
    title: 'Syntinuum Podcast Streaming Platform',
    year: '2026',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Full-Stack Developer',
    highlight: '100K+ Impressions Streaming Engine',
    stack: 'JavaScript, React, Tailwind CSS, Next.js',
    description: 'Global audio streaming web application for the Syntinuum podcast network, delivering persistent uninterrupted audio playback, episode catalogs, and responsive interfaces.',
    icons: ['javascript.svg', 'react.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/Syntinuum_podcast_website',
    demo: 'https://www.syntinuumpodcast.com/',
    featured: false,
    caseStudy: {
      executiveSummary: 'A fast, accessible web platform built to host, stream, and catalog podcast episodes for the Syntinuum network (100K+ combined cross-platform impressions).',
      problem: 'Third-party podcast landing pages lacked custom design control, persistent playback across page navigations, and direct episode show-note indexing.',
      architecture: 'Bespoke frontend built with React and Tailwind CSS, utilizing HTML5 audio APIs and global audio state for continuous background playback during route transitions.',
      tradeoffsSummary: 'Selected static JSON schemas to maximize page load speeds and SEO indexing without database query latency.',
      decisions: [
        {
          title: 'Persistent Audio Context vs Embedded Iframes',
          optionChosen: 'Custom HTML5 audio engine managed via React state.',
          alternativeRejected: 'Fragmented individual iframes on every episode page.',
          costAccepted: 'More state management logic to handle audio playback and scrubber buffering.',
          measuredResult: 'Continuous playback without interruption when users explore guest notes.',
        },
      ],
      metrics: [
        { label: 'Combined Reach', value: '100K+ Impr.', detail: 'Cross-platform audience engagement' },
        { label: 'Playback Uptime', value: '99.9%', detail: 'Global CDN static audio distribution' },
      ],
      personalContribution: 'Designed and built the full web application, deployed to production, and configured Spotify episode integration.',
      limitations: 'Episode show-notes are currently compiled at build time rather than fetched from a live CMS.',
      nextSteps: 'Adding real-time automated transcript synchronization with interactive word-level audio seeking.',
    },
  },
  {
    slug: 'philocracy',
    title: 'Philocracy Platform',
    year: '2025',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Prototype',
    role: 'Founder & Full-Stack Engineer',
    highlight: 'Structured Argument Schema Trees',
    stack: 'Next.js, Tailwind CSS, React, TypeScript',
    description: 'Structured philosophical debate platform enforcing logical argumentation schemas, claim citations, and nested premise trees to combat online discourse polarization.',
    icons: ['nextjs.svg', 'tailwind.svg', 'react.svg'],
    github: 'https://github.com/haresham15/Philocracy',
    featured: false,
    caseStudy: {
      executiveSummary: 'A platform designed to elevate online debate by structuring discussions into logical premise trees with required claim verification rather than ungrounded emotional comment threads.',
      problem: 'Online discussion forums reward rage bait and ad hominem attacks, lacking tools to isolate specific fallacies or trace deductive conclusions.',
      architecture: 'Engineered nested argument tree data structures rendered with recursive React components, enforcing typed claim categories (premise, counter-premise, evidence, rebuttal).',
      tradeoffsSummary: 'Prioritized argument hierarchy visualization and reading clarity over open unrestricted comment formatting.',
      decisions: [
        {
          title: 'Recursive Tree Hierarchy vs Flat Comment Streams',
          optionChosen: 'Strict node-and-edge argument tree structure.',
          alternativeRejected: 'Linear chronological comment thread.',
          costAccepted: 'Higher cognitive effort for initial post creation.',
          measuredResult: 'Direct isolation of premise validity without ad hominem derailment.',
        },
      ],
      metrics: [
        { label: 'Argument Depth', value: 'Arbitrary N', detail: 'Recursive nested premise and rebuttal trees' },
      ],
      personalContribution: 'Formulated the structured debate schemas, built recursive component trees, and directed product development.',
      limitations: 'Currently operates in client-side demonstration mode prior to multi-tenant database integration.',
      nextSteps: 'Integrating Supabase auth and community peer-review voting on formal fallacy tags.',
    },
  },
  {
    slug: 'tutormatch',
    title: 'TutorMatch — AI-Powered Tutoring Matching Portal',
    year: '2025',
    category: 'AI & Vision',
    categoryFilter: 'ai-ml',
    statusBadge: 'Prototype',
    role: 'Creator & ML Engineer',
    highlight: 'Zero-Shot NLP & Proximity Search',
    stack: 'Python, Streamlit, Hugging Face, PyPDF2',
    description: 'Algorithmic matching portal pairing students with verified tutors based on course requirements, Haversine geospatial proximity, and Hugging Face zero-shot resume validation.',
    icons: ['python.svg', 'streamlit.svg', 'huggingface.svg'],
    github: 'https://github.com/haresham15/TutorMatch_WebApp',
    featured: false,
    caseStudy: {
      executiveSummary: 'A web portal matching students with qualified tutors based on academic requirements, geographic proximity via Haversine distance, and NLP resume validation.',
      problem: 'Students face difficulty vetting tutor subject expertise, while manual credential verification is slow and error-prone.',
      architecture: 'Built on Streamlit with custom matching math. Hugging Face zero-shot classification pipelines analyze uploaded resumes to verify stated course credentials.',
      tradeoffsSummary: 'Employed Streamlit for rapid iteration of the NLP classification pipeline before investing in a full custom design system.',
      decisions: [
        {
          title: 'Zero-Shot Resume Classification vs Keyword Match',
          optionChosen: 'Hugging Face zero-shot cross-encoder classification.',
          alternativeRejected: 'Simple keyword string matching on resume PDF text.',
          costAccepted: 'Higher inference latency during document upload.',
          measuredResult: 'Resilient identification of subject proficiency across varied resume phrasing.',
        },
      ],
      metrics: [
        { label: 'Proximity Engine', value: 'Haversine', detail: 'Accurate geographic distance matching' },
      ],
      personalContribution: 'Authored the Python matching algorithms, integrated Hugging Face models, and built the interactive portal.',
      limitations: 'Evaluation was conducted on synthetic student-tutor profiles.',
      nextSteps: 'Migrating to Next.js and exposing the NLP pipeline as a serverless FastAPI microservice.',
    },
  },
  {
    slug: 'cs50-ai-projects',
    title: 'Classical AI & Probabilistic Reasoning Suite',
    year: '2025',
    category: 'AI & Vision',
    categoryFilter: 'ai-ml',
    statusBadge: 'Research',
    role: 'Systems Implementer',
    highlight: 'Harvard CS50 AI Algorithms',
    stack: 'Python, TensorFlow, NumPy',
    description: 'Implementations of classical AI and probabilistic reasoning algorithms: Minimax with Alpha-Beta pruning, Hidden Markov Models, k-NN, and feed-forward neural networks from mathematical first principles.',
    icons: ['python.svg', 'tensorflow.svg', 'numpy.svg'],
    github: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
    featured: false,
    caseStudy: {
      executiveSummary: 'A suite of foundational artificial intelligence implementations covering classical search, probabilistic inference, Markov models, and neural network training.',
      problem: 'Deeply understanding modern AI architectures requires building algorithms from mathematical first principles rather than treating libraries as black boxes.',
      architecture: 'Implemented Minimax with Alpha-Beta pruning, Hidden Markov Models, k-Nearest Neighbors, and feed-forward neural networks using Python and NumPy.',
      tradeoffsSummary: 'Prioritized mathematical transparency and algorithmic proof of correctness over low-level compiled C speed.',
      decisions: [
        {
          title: 'First-Principles Implementation vs Prebuilt Library Calls',
          optionChosen: 'Writing matrix math and search algorithms from scratch.',
          alternativeRejected: 'Importing high-level scikit-learn / keras wrappers.',
          costAccepted: 'More verbose mathematical code.',
          measuredResult: 'Complete mastery of search tree invariants and gradient backpropagation mechanics.',
        },
      ],
      metrics: [
        { label: 'Course Origin', value: 'Harvard CS50 AI', detail: 'Completed all foundational algorithm projects' },
      ],
      personalContribution: 'Authored all Python algorithmic implementations and invariant tests.',
      limitations: 'Focuses on educational algorithmic benchmarks rather than production distributed datasets.',
      nextSteps: 'Packaging implementations into an interactive algorithmic educational visualization CLI.',
    },
  },
  {
    slug: 'carstomer',
    title: 'CarStomer — Automotive Valuation Engine',
    year: '2025',
    category: 'Research & Data',
    categoryFilter: 'research',
    statusBadge: 'Prototype',
    role: 'Data Science Engineer',
    highlight: 'Random Forest Valuation Regressor',
    stack: 'Python, Streamlit, Scikit-Learn, Pandas',
    description: 'Predictive automotive valuation engine using Random Forest regression over historical sales data to forecast used car fair-market value based on mileage, trim, and regional trends.',
    icons: ['python.svg', 'streamlit.svg', 'scitkitlearn.svg'],
    github: 'https://github.com/haresham15/CarStomerCarAnalysis',
    featured: false,
    caseStudy: {
      executiveSummary: 'A predictive machine learning tool estimating fair market prices for used vehicles based on mileage degradation curves and market parameters.',
      problem: 'Used car valuations fluctuate widely across regional dealerships, making it challenging for consumers to evaluate fair transaction pricing.',
      architecture: 'Trained Random Forest regressors on parsed automotive sales records with hyperparameter tuning, wrapped in an interactive Streamlit exploration UI.',
      tradeoffsSummary: 'Constrained feature inputs to commuter models with high volume to preserve high statistical confidence.',
      decisions: [
        {
          title: 'Random Forest Regressor vs Linear Ridge Regression',
          optionChosen: 'Ensemble Random Forest capturing non-linear mileage degradation cliffs.',
          alternativeRejected: 'Simple linear regression.',
          costAccepted: 'Slightly higher training compute.',
          measuredResult: 'Accurately modeled steep initial depreciation drops followed by plateau curves.',
        },
      ],
      metrics: [
        { label: 'Model', value: 'Random Forest', detail: 'Non-linear depreciation curve modeling' },
      ],
      personalContribution: 'Cleaned sales dataset, trained Scikit-Learn models, and designed the interactive dashboard.',
      limitations: 'Does not account for individual vehicle cosmetic condition or accident repair history.',
      nextSteps: 'Integrating localized dealership inventory scrapers for real-time regional supply tracking.',
    },
  },
  {
    slug: 'momwebsite',
    title: 'Professional Services Client Portal',
    year: '2025',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Frontend Architect',
    highlight: 'Strict TypeScript & High Core Web Vitals',
    stack: 'Next.js, TypeScript, React, Tailwind CSS',
    description: 'High-conversion business portal and booking interface built with strict TypeScript types, server-side rendering, and responsive mobile architecture deployed on Vercel.',
    icons: ['nextjs.svg', 'typescript.svg', 'react.svg'],
    github: 'https://github.com/haresham15/MomWebsite',
    featured: false,
    caseStudy: {
      executiveSummary: 'A responsive commercial web portal engineered for a professional practice, optimized for fast loading and mobile client conversion.',
      problem: 'The practice had an unmaintained, non-responsive site with slow load times that hindered mobile client onboarding.',
      architecture: 'Built using Next.js with strict TypeScript and Tailwind CSS, leveraging static export and semantic HTML for perfect Lighthouse scores.',
      tradeoffsSummary: 'Built custom code rather than a generic CMS builder to guarantee zero bloat and sub-second load times.',
      decisions: [
        {
          title: 'Custom Next.js SSG vs Commercial Website Builder',
          optionChosen: 'Bespoke Next.js application hosted on Vercel.',
          alternativeRejected: 'Wix / Squarespace template.',
          costAccepted: 'Manual code updates required for structural changes.',
          measuredResult: '100% Core Web Vitals performance and instant page navigation.',
        },
      ],
      metrics: [
        { label: 'Performance', value: '100/100', detail: 'Google Lighthouse Performance & SEO Score' },
      ],
      personalContribution: 'Architected and deployed the complete website, conducted client interviews, and wrote all copy.',
      limitations: 'Appointment bookings currently route via email form rather than live calendar syncing.',
      nextSteps: 'Integrating Cal.com or Google Calendar API for automated client scheduling.',
    },
  },
  {
    slug: 'murugesan-rajaram-lab',
    title: 'Murugesan Rajaram Lab Academic Portal',
    year: '2025',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Full-Stack Developer',
    highlight: 'Biomedical Publications Archive',
    stack: 'Next.js, TypeScript, React, Tailwind CSS',
    description: 'Academic research lab portal cataloging peer-reviewed biomedical publications, grant awards, and researcher profiles, engineered with schema-driven React components.',
    icons: ['nextjs.svg', 'typescript.svg', 'react.svg'],
    github: 'https://github.com/haresham15/murugesan_rajaram_lab_website',
    featured: false,
    caseStudy: {
      executiveSummary: 'An academic research portal built to showcase biomedical publications, NIH grant awards, and laboratory personnel.',
      problem: 'Academic laboratory websites often languish with outdated layouts that make publications difficult for researchers and grant committees to navigate.',
      architecture: 'Structured with schema-driven JSON data feeding modular React components, ensuring zero maintenance hosting overhead on static infrastructure.',
      tradeoffsSummary: 'Selected static JSON over dynamic database backend to ensure zero server maintenance requirements for lab personnel.',
      decisions: [
        {
          title: 'Static JSON Schema vs Database CMS',
          optionChosen: 'Validated JSON data files with build-time schema checks.',
          alternativeRejected: 'Self-hosted WordPress or headless CMS.',
          costAccepted: 'Updates require pushing a commit to GitHub repository.',
          measuredResult: 'Zero database vulnerabilities, zero hosting fees, and instant global delivery.',
        },
      ],
      metrics: [
        { label: 'Hosting Cost', value: '$0 / mo', detail: 'Zero-maintenance static infrastructure' },
      ],
      personalContribution: 'Designed and built the academic portal and structured the publication schemas.',
      limitations: 'Requires git commit to add newly published research papers.',
      nextSteps: 'Connecting directly to PubMed API to automatically pull and index new lab publications on acceptance.',
    },
  },
  {
    slug: 'software-2-projects',
    title: 'Software 2: Data Structures & Invariants',
    year: '2024',
    category: 'Systems & Core',
    categoryFilter: 'systems',
    statusBadge: 'Research',
    role: 'Software Engineer',
    highlight: 'Java Custom Collections & Tree Invariants',
    stack: 'Java, JUnit',
    description: 'Advanced software engineering implementations covering fundamental data structures, memory management, pointer manipulation, and recursive tree invariants in Java with JUnit.',
    icons: ['java.svg'],
    github: 'https://github.com/haresham15/Haresh-s-Software-2-Projects',
    featured: false,
    caseStudy: {
      executiveSummary: 'Advanced software engineering implementations focusing on fundamental data structure invariants, pointer manipulation, and mathematical complexity proofs.',
      problem: 'Building robust, bug-free systems demands an uncompromising foundation in class representation invariants, recursion, and Big-O efficiency.',
      architecture: 'Implemented custom collections, binary search trees, sorting routines, and graph traversal algorithms in Java adhering strictly to formal unit-tested invariants.',
      tradeoffsSummary: 'Focused entirely on representation invariants and unit testing completeness rather than building graphical user interfaces.',
      decisions: [
        {
          title: 'Strict Formal Invariant Testing vs Pragmatic Shortcuts',
          optionChosen: 'Formal convention and correspondence checks on every method call.',
          alternativeRejected: 'Informal spot-checking.',
          costAccepted: 'More verbose test assertions.',
          measuredResult: 'Zero invariant violations across hundreds of edge-case test runs.',
        },
      ],
      metrics: [
        { label: 'Test Suite', value: '100% JUnit', detail: 'Exhaustive edge-case representation invariant coverage' },
      ],
      personalContribution: 'Authored all Java data structure implementations and JUnit test suites.',
      limitations: 'Academic implementations designed for algorithmic clarity over low-level hardware SIMD instructions.',
      nextSteps: 'Benchmarking multithreaded lock contention across concurrent Java data structures.',
    },
  },
  {
    slug: 'software-1-projects',
    title: 'Software 1: Java OOP & Formal Contracts',
    year: '2024',
    category: 'Systems & Core',
    categoryFilter: 'systems',
    statusBadge: 'Research',
    role: 'Software Engineer',
    highlight: 'Modular Design Patterns & Contracts',
    stack: 'Java',
    description: 'Foundational object-oriented design implementations emphasizing encapsulation, clean class contracts, defensive programming, and modular design patterns in Java.',
    icons: ['java.svg'],
    github: 'https://github.com/haresham15/Software-Project-Java-Collection-',
    featured: false,
    caseStudy: {
      executiveSummary: 'Foundational software engineering projects emphasizing object-oriented contracts, encapsulation, and defensive programming in Java.',
      problem: 'High-quality software engineering requires strict adherence to preconditions, postconditions, and modular interface boundaries.',
      architecture: 'Constructed standalone modular Java applications emphasizing DRY principles, defensive programming, and clear technical documentation.',
      tradeoffsSummary: 'Prioritized single-responsibility class contracts over rapid scripting.',
      decisions: [
        {
          title: 'Interface-Based Design vs Concrete Class Couplings',
          optionChosen: 'Strict separation of Java interface contracts from implementation classes.',
          alternativeRejected: 'Direct concrete class instantiation throughout application code.',
          costAccepted: 'More initial files and boilerplate.',
          measuredResult: 'Seamless modularity and straightforward unit test mocking.',
        },
      ],
      metrics: [
        { label: 'Language', value: 'Java', detail: 'Formal contracts and defensive programming' },
      ],
      personalContribution: 'Implemented all modular Java applications and documentation.',
      limitations: 'Covers foundational single-threaded algorithms.',
      nextSteps: 'Refactoring older imperative loops into functional Java Stream pipelines.',
    },
  },
  {
    slug: 'portfolio-website',
    title: 'Personal Portfolio & Living Design System',
    year: '2024',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Architect & Designer',
    highlight: 'DTCG Design Tokens & SSG Static Architecture',
    stack: 'Next.js, TypeScript, Tailwind CSS, Zustand, Framer Motion',
    description: 'The portfolio website and design system you are currently viewing. Features complete static HTML export, DTCG three-tier token architecture, Recruiter Mode, and qualified evidence registers.',
    icons: ['nextjs.svg', 'react.svg', 'tailwind.svg', 'typescript.svg'],
    github: 'https://github.com/haresham15/Haresh_Murugesan_Portfolio',
    demo: 'https://hareshmurugesan.com',
    featured: false,
    caseStudy: {
      executiveSummary: 'The portfolio website and living design system you are currently viewing. Engineered to deliver instant recruiter scannability, deterministic evidence attribution, and zero-compromise static export performance.',
      problem: 'Standard developer portfolios often rely on heavy client-side JavaScript, display unverified metrics without hardware or methodology context, and crash on restricted WebGL contexts.',
      architecture: 'Crafted with Next.js Pages router in full static export mode (output: export). Features a DTCG three-tier token architecture, a Zustand motion and accessibility state store, and an Evidence Register backing every quantified claim.',
      tradeoffsSummary: 'Preserved Next.js static export over dynamic server rendering to guarantee 100% crawlability, zero server cold starts, and instant edge distribution.',
      decisions: [
        {
          title: 'Static HTML Export vs SSR Server Runtime',
          optionChosen: 'Next.js output: "export" with 100% pre-rendered HTML on all routes.',
          alternativeRejected: 'Server-side rendering requiring Node.js runtime.',
          costAccepted: 'Dynamic server functions cannot be executed; state is managed client-side.',
          measuredResult: '100% text visible to web crawlers and JS-disabled users with zero hosting cost.',
        },
        {
          title: 'Recruiter Mode 1-Click Scan vs Mandatory Visual Effects',
          optionChosen: 'Instant Recruiter Mode toggle disabling decorative canvas and expanding summaries.',
          alternativeRejected: 'Forcing recruiters through linear cinematic scroll animations.',
          costAccepted: 'Maintaining dual presentation states in the layout architecture.',
          measuredResult: 'Enables 10-second candidate scannability while preserving cinematic depth for deep dives.',
        },
      ],
      metrics: [
        { label: 'Architecture', value: 'Next.js SSG', detail: 'Zero Loading placeholders, complete static HTML' },
        { label: 'Tokens', value: 'DTCG 3-Tier', detail: 'Deterministic tokens in design/tokens.json' },
      ],
      personalContribution: 'Sole designer and developer. Crafted the design tokens, engineered the content and evidence registers, and implemented all accessible responsive components.',
      limitations: 'Static export requires rebuilding on content updates; streamlined via automated CI/CD pipeline.',
      nextSteps: 'Sprint 2 interactive 3D WebGL set-pieces with hardware-adaptive level-of-detail degradation.',
    },
  },
  {
    slug: 'anna-birthday',
    title: 'A Birthday Celebration Web Experience',
    year: '2024',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Creative Developer',
    highlight: 'Custom CSS Keyframes & Interactive Timeline',
    stack: 'React, Tailwind CSS, JavaScript',
    description: 'Personalized single-page web experience showcasing custom CSS keyframe animations, interactive memory timeline states, and responsive component design.',
    icons: ['react.svg', 'tailwind.svg', 'javascript.svg'],
    github: 'https://github.com/haresham15/AnnaBirthdayWebsite',
    featured: false,
    caseStudy: {
      executiveSummary: 'A personalized interactive single-page web experience built as a digital gift, showcasing custom CSS animations and responsive component design.',
      problem: 'Creating a memorable digital celebration requires thoughtful interaction design, fluid motion, and polished responsive styling across screen sizes.',
      architecture: 'Constructed with React and Tailwind CSS, featuring custom timeline animation states and micro-interactions.',
      tradeoffsSummary: 'Optimized purely for emotional delight and visual impact for family rather than generalized configurability.',
      decisions: [
        {
          title: 'Lightweight React vs Heavy Animation Libraries',
          optionChosen: 'Pure CSS keyframe animations with lightweight React state triggers.',
          alternativeRejected: 'Heavy 3D Canvas scenes.',
          costAccepted: 'More handwritten CSS keyframe rules.',
          measuredResult: 'Instant mobile loading and 60fps animation on all mobile phones.',
        },
      ],
      metrics: [
        { label: 'Satisfaction', value: '100%', detail: 'Cherished family milestone celebration' },
      ],
      personalContribution: 'Designed and built the celebration website.',
      limitations: 'Tailored for personal use.',
      nextSteps: 'Extracting the interactive memory timeline into an open-source template component.',
    },
  },
];

export const allProjects: Project[] = [...flagshipProjects, ...archiveProjects];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug || (p.aliases && p.aliases.includes(slug)));
}

export function getAllProjectSlugs(): string[] {
  const slugs: string[] = [];
  allProjects.forEach((p) => {
    slugs.push(p.slug);
    if (p.aliases) {
      p.aliases.forEach((alias) => slugs.push(alias));
    }
  });
  return slugs;
}

