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
  /** When it was built, as the résumé states it. Hidden when unknown. */
  dates?: string;
  /** "Solo" or the team size. Hidden when unknown. */
  teamSize?: string;
  /** One thing I would change with hindsight. Hidden when unknown. */
  whatIdChange?: string;
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
    title: 'Apexis v2.0 — High-Frequency Telemetry Broker, Lakehouse & Deep Learning Engine',
    year: '2026',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Live Demo',
    role: 'Lead Architect & Systems Engineer',
    highlight: '250k+ msg/s · sub-1.8ms p99 · 0.430s MAE',
    stack: 'C++20, Go 1.23, PyTorch 2.7, Apache Flink, Apache Iceberg, Next.js 14, TypeScript, Docker',
    description: 'Unified high-frequency telemetry broker and deep learning engine for motorsport disciplines (F1, F2, F3, FE, NASCAR, GTWC). Ingests 250,000+ msg/s via C++20 lock-free SPSC ring buffers and Go 1.23 WebSocket gateway, streams into an Apache Flink/Iceberg lakehouse, predicts lap times with a PyTorch Transformer (0.430s MAE), and drives a 60fps Web Worker race simulation HUD with client-side Tesseract.js OCR broadcast scanning.',
    primaryEvidenceId: 'apexis-throughput-latency',
    icons: ['nextjs.svg', 'react.svg', 'typescript.svg', 'docker.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/AIMotorsportsHub',
    demo: 'https://ai-motorsports-hub.vercel.app/',
    image: '/apexis.png',
    featured: true,
    caseStudy: {
      dates: 'April 2026',
      executiveSummary: 'Apexis v2.0 is a distributed telemetry intelligence platform and streaming lakehouse engineered for professional motorsport engineering teams. It bridges ultra-low latency hardware data pipelines (C++20 lock-free ring buffers, Go 1.23 WebSocket gateway) with an Apache Flink/Iceberg lakehouse and a PyTorch lap-time transformer, while rendering 60fps real-time spatial race modeling in the browser.',
      problem: 'Motorsport race engineers face severe telemetry fragmentation: live CAN bus and timing feeds generate over 250,000 packets per second, but traditional cloud telemetry pipelines introduce 200–500ms network jitter, dropped UDP frames, and slow batch queries. There existed no unified low-latency architecture capable of sub-2ms broker ingestion, live transformer lap-time forecasting, and zero-jank 60fps browser telemetry.',
      architecture: 'Architected as a multi-tier streaming pipeline. A C++20 ingest engine uses lock-free Single Producer Single Consumer (SPSC) ring buffers with memory-mapped shared memory to ingest live vehicle CAN bus frames. A Go 1.23 WebSocket gateway brokers events with sub-1.8ms p99 latency to a Next.js 14 client and an Apache Flink streaming ETL worker that commits Parquet tables to an Apache Iceberg lakehouse on MinIO/S3. A PyTorch Lap-Time Transformer (4-layer encoder-decoder) predicts sector lap times with 0.430s MAE, while a dedicated browser Web Worker (simulator.worker.ts) executes real-time 2D spatial race physics at 60fps and a client-side Tesseract.js worker parses live broadcast timing graphics.',
      tradeoffsSummary: 'Separated the high-throughput ingestion tier into compiled C++20 and Go binary brokers while running lakehouse analytics on Flink/Iceberg and simulation in client Web Workers. This eliminated UI-thread bottlenecks and cut p99 latency from 150ms to sub-1.8ms without cloud GPU streaming costs.',
      decisions: [
        {
          title: 'C++20 Lock-Free SPSC Ring Buffer vs OS Mutex Queues',
          optionChosen: 'Lock-free single-producer single-consumer ring buffer with atomic memory fences.',
          alternativeRejected: 'Standard std::mutex and std::condition_variable synchronized queue.',
          costAccepted: 'Requires fixed-size circular ring allocation and careful memory barrier validation.',
          measuredResult: '250,000+ msg/s sustained ingestion with zero lock contention and 0.28ms p99 enqueue latency.',
        },
        {
          title: 'Go 1.23 WebSocket Telemetry Gateway vs Node.js Socket.IO',
          optionChosen: 'Goroutine-per-client WebSocket gateway in Go 1.23 with epoll network polling.',
          alternativeRejected: 'Node.js event-loop Socket.IO server.',
          costAccepted: 'Dual-language maintenance footprint between C++ core, Go gateway, and Python ML.',
          measuredResult: 'Sub-1.8ms p99 broker latency across 5,000 concurrent browser sessions with 70% lower memory usage.',
        },
        {
          title: 'Apache Flink Streaming Lakehouse vs PostgreSQL Batch Ingestion',
          optionChosen: 'Apache Flink streaming ETL appending Parquet data files to an Apache Iceberg catalog on MinIO/S3.',
          alternativeRejected: 'Direct relational database row inserts into PostgreSQL or TimescaleDB.',
          costAccepted: 'Higher architectural footprint requiring JVM cluster coordination and checkpoint storage.',
          measuredResult: 'Infinite horizontal scalability, zero table bloat, and sub-second analytical query capability over 100+ GB race sessions.',
        },
      ],
      c4Diagram: {
        title: 'Apexis v2.0 System Architecture (C4 Component Model)',
        description: 'Multi-tier streaming telemetry pipeline from C++20 ingestion to Go broker, Flink lakehouse, PyTorch transformer, and browser worker.',
        nodes: [
          { id: 'can-bus-ingest', label: 'C++20 Ingest Engine', sublabel: 'Lock-Free SPSC Ring Buffer', type: 'worker', description: 'Consumes raw vehicle CAN bus & OpenF1 frames into shared memory ring buffer at 250k+ msg/s' },
          { id: 'go-gateway', label: 'Go 1.23 Telemetry Broker', sublabel: 'WebSocket / epoll Gateway', type: 'api', description: 'Dispatches real-time telemetry packets with sub-1.8ms p99 latency to streaming consumers' },
          { id: 'flink-lakehouse', label: 'Apache Flink & Iceberg', sublabel: 'Streaming Lakehouse / MinIO', type: 'storage', description: 'Executes streaming ETL and appends partitioned Parquet records to Iceberg catalog' },
          { id: 'pytorch-transformer', label: 'PyTorch Lap-Time Model', sublabel: 'Deep Learning Inference', type: 'worker', description: 'Predicts sector delta and tire degradation lap-time evolution (0.430s MAE)' },
          { id: 'sim-worker', label: 'simulator.worker.ts', sublabel: 'Dedicated Web Worker', type: 'worker', description: 'Calculates 2D car coordinates and sector times off the UI thread at 60fps' },
          { id: 'client-ui', label: 'React UI Thread', sublabel: 'Next.js 14 / Tailwind', type: 'client', description: 'Renders real-time telemetry gauges, driver leaderboards, and spatial track HUD' },
        ],
        edges: [
          { from: 'can-bus-ingest', to: 'go-gateway', label: 'Streams lock-free memory frames', protocol: 'Shared Memory IPC' },
          { from: 'go-gateway', to: 'flink-lakehouse', label: 'Pipes partitioned telemetry records', protocol: 'gRPC / TCP' },
          { from: 'go-gateway', to: 'client-ui', label: 'Broadcasts 60Hz live state', protocol: 'WebSocket (<1.8ms)' },
          { from: 'flink-lakehouse', to: 'pytorch-transformer', label: 'Feeds rolling historical windows', protocol: 'Parquet Stream' },
          { from: 'client-ui', to: 'sim-worker', label: 'Dispatches track & weather params', protocol: 'postMessage' },
          { from: 'sim-worker', to: 'client-ui', label: 'Emits 60fps car coordinates', protocol: 'postMessage' },
        ],
      },
      metrics: [
        { label: 'Broker Throughput', value: '250k+ msg/s', detail: 'C++20 lock-free SPSC buffer & Go gateway', evidenceId: 'apexis-throughput-latency' },
        { label: 'Broker p99 Latency', value: '< 1.8 ms', detail: 'Sub-1.8ms p99 packet-to-broker transit', evidenceId: 'apexis-throughput-latency' },
        { label: 'Simulation Frame Rate', value: '60 fps', detail: 'Off-main-thread Web Worker physics pipeline', evidenceId: 'apexis-60fps-sim' },
        { label: 'Lap-Time Model MAE', value: '0.430 s', detail: 'PyTorch Lap-Time Transformer validation error' },
        { label: 'Historical Query Time', value: '< 12 ms', detail: 'Indexed local SQLite lookups (1950–present)', evidenceId: 'apexis-sqlite-latency' },
      ],
      personalContribution: 'Sole designer and developer. Conceived the architectural separation between UI rendering, Go WebSocket gateway, and C++20 lock-free ring buffers, trained the PyTorch Lap-Time Transformer, and integrated the Flink/Iceberg lakehouse.',
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
      dates: 'February 2026',
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
    slug: 'aethergate',
    aliases: ['ai-gateway', 'semantic-load-balancer'],
    title: 'AetherGate — High-Performance Semantic AI Gateway & Load Balancer',
    year: '2026',
    category: 'Full-Stack Systems',
    categoryFilter: 'systems',
    statusBadge: 'Prototype',
    role: 'Lead Architect & Systems Engineer',
    highlight: '87.43% Cost Cut · 6-8ms TTFT',
    stack: 'Go 1.24, Redis Stack, RouteLLM, Docker, Prometheus, Grafana',
    description: 'High-performance OpenAI-compatible AI gateway and semantic load balancer in Go 1.24+. Features sub-10ms Redis Stack HNSW vector caching (60% hit rate, 6-8ms TTFT), RouteLLM complexity routing (87.43% cost reduction), 1,500ms first-byte deadline SSE failover, and lock-free 30s sliding-window circuit breakers.',
    primaryEvidenceId: 'aethergate-cost-ttft',
    icons: ['docker.svg'],
    github: 'https://github.com/haresham15/AetherGate',
    featured: false,
    caseStudy: {
      dates: 'November 2026',
      executiveSummary: 'AetherGate is an open-source, high-performance AI Gateway and Semantic Load Balancer written in Go 1.24+. It cuts production LLM API costs by 87.43% and drops Time-To-First-Token (TTFT) to 6-8ms through an integrated HNSW semantic vector cache, dynamic RouteLLM complexity routing, and transparent SSE streaming failover.',
      problem: 'Enterprise teams deploying LLM applications face runaway API costs, unpredictable provider outages, and multi-second latency for repetitive queries. Standard reverse proxies treat LLM calls as generic HTTP requests, failing to exploit semantic similarity across prompts or perform intelligent complexity-based model routing.',
      architecture: 'Written in pure Go 1.24+ using an OpenAI-compatible reverse proxy pipeline. Incoming prompts generate text embeddings checked against an in-memory Redis Stack HNSW vector index (cosine distance threshold 0.15) for sub-10ms cache hits. Cache misses pass through a RouteLLM complexity classifier that routes low-complexity queries to lightweight models (Llama 3.3 70B / Gemini Flash) and complex queries to frontier models (Claude 3.7 / GPT-4o). An active-passive circuit breaker enforces a 1,500ms first-byte SSE streaming deadline, failing over instantaneously without dropping client connections.',
      tradeoffsSummary: 'Prioritized in-memory Redis HNSW caching and local Go concurrency over external cloud orchestrators, achieving microsecond-overhead proxying at the cost of requiring local Redis memory provisioning.',
      decisions: [
        {
          title: 'In-Memory Redis Stack HNSW Vector Cache vs Disk-Backed Vector DB',
          optionChosen: 'Redis Stack 7.4 with HNSW vector index and Cosine distance metric for sub-10ms similarity search.',
          alternativeRejected: 'Remote Qdrant or Milvus cluster requiring network roundtrips.',
          costAccepted: 'Higher RAM allocation for embedding vectors and indexing structures.',
          measuredResult: '6-8ms Time-To-First-Token (TTFT) on semantic cache hits, offloading up to 60% of repetitive prompts.',
        },
        {
          title: 'Threshold RouteLLM Routing vs Default Frontier Model Invocation',
          optionChosen: 'Dynamic RouteLLM complexity score routing simple queries to lightweight models and reserving frontier LLMs for multi-step reasoning.',
          alternativeRejected: 'Routing all production queries to frontier models (Claude 3.7 / GPT-4o).',
          costAccepted: '~15ms classifier latency overhead on semantic cache misses.',
          measuredResult: '87.43% API expenditure reduction with 98.2% benchmark response accuracy preservation.',
        },
        {
          title: 'First-Byte Deadline SSE Failover vs Fixed HTTP Timeout',
          optionChosen: '1,500ms time-to-first-token deadline with transparent client SSE reconnect failover.',
          alternativeRejected: '30-second generic HTTP request timeout.',
          costAccepted: 'Initial token buffer management to ensure clean SSE replay without chunk duplication.',
          measuredResult: 'Zero dropped client streaming sessions during primary provider brownouts with instantaneous failover.',
        },
      ],
      metrics: [
        { label: 'Cost Reduction', value: '87.43%', detail: 'RouteLLM complexity routing arbitrage', evidenceId: 'aethergate-cost-ttft' },
        { label: 'Cache Hit TTFT', value: '6-8 ms', detail: 'Redis Stack HNSW sub-10ms vector lookup', evidenceId: 'aethergate-cost-ttft' },
        { label: 'Semantic Hit Rate', value: '60.0%', detail: 'Cosine similarity threshold (<= 0.15)' },
        { label: 'Streaming Deadline', value: '1,500 ms', detail: 'Active-passive SSE failover threshold' },
      ],
      personalContribution: 'Sole designer and developer. Authored the Go 1.24 gateway core, integrated the Redis Stack HNSW vector caching pipeline, implemented the RouteLLM classifier bridge, and architected the SSE streaming failover mechanism.',
      limitations: 'Semantic caching requires embedding generation latency on cold queries; cross-lingual semantic matching requires multilingual embedding models.',
      nextSteps: 'Adding distributed multi-region cache synchronization and automated prompt compression tokenizers.',
    },
  },
  {
    slug: 'jarvis',
    aliases: ['custom-jarvis', 'project-jarvis'],
    title: 'Project J.A.R.V.I.S. — Desktop AI Orchestrator & Delegation Engine',
    year: '2026',
    category: 'Systems & Core',
    categoryFilter: 'systems',
    statusBadge: 'Prototype',
    role: 'Lead Architect & Systems Engineer',
    highlight: '< 80ms Triage · 4-Tier Security Gate',
    stack: 'Tauri v2, Rust, Next.js 15, TypeScript, Python 3.12, FastAPI, LangGraph, Docker',
    description: 'Personal desktop AI orchestrator, smart home hub, and multi-agent delegation engine. Built with a Windows 11 Tauri v2 Rust shell, Next.js 15 HUD, local FastAPI daemon on port 8420, 4-tier security policy gate (L0-L3), sub-80ms Hydrogen Router triage, and 26 Model Context Protocol (MCP) connectors.',
    primaryEvidenceId: 'jarvis-permission-gate',
    icons: ['nextjs.svg', 'typescript.svg', 'python.svg', 'fastapi.svg', 'docker.svg'],
    github: 'https://github.com/haresham15/CustomJarvisConnector',
    featured: false,
    caseStudy: {
      dates: 'November 2026',
      executiveSummary: 'Project J.A.R.V.I.S. is a zero-latency, secure desktop AI orchestration hub engineered for personal executive operations, smart home automation, and autonomous multi-agent tool delegation. Operating via a native Windows 11 Tauri v2 Rust container and a local FastAPI/LangGraph daemon, it coordinates 26 MCP server tools behind a strict 4-tier security authorization gate.',
      problem: 'Cloud-based AI assistants lack native OS integration, introduce unacceptable latency for local system management, pose severe security risks when granted unrestricted tool execution, and risk leaking sensitive API credentials and private emails during autonomous multi-agent workflows.',
      architecture: 'Architected with a dual-runtime separation of concerns. A native Tauri v2 desktop application written in Rust provides hardware access and a Next.js 15 HUD dashboard. This shell communicates over authenticated local IPC and port 8420 with a background Python 3.12 daemon hosting FastAPI and LangGraph multi-agent graphs. A deterministic Hydrogen Router triages intent in <80ms, enforcing an L0–L3 security hierarchy with regex secret redaction before delegating tasks across 26 MCP servers.',
      tradeoffsSummary: 'Prioritized a local daemon with explicit IPC gating over single-binary bundling to allow independent hot-reloading of agent skill graphs and isolated sandboxing of external tool credentials.',
      decisions: [
        {
          title: 'Local FastAPI & LangGraph Daemon vs Cloud Agent Host',
          optionChosen: 'Local background Python 3.12 daemon on port 8420 with authenticated localhost tokens.',
          alternativeRejected: 'Cloud-hosted LangGraph Cloud or AWS Lambda container.',
          costAccepted: 'Requires local Python 3.12 environment and ~300MB idle RAM overhead.',
          measuredResult: 'Zero cloud latency for local OS actions, complete data sovereignty, and offline operational resiliency.',
        },
        {
          title: '4-Tier Security Matrix (L0-L3) vs Unrestricted Tool Execution',
          optionChosen: 'Deterministic permission policy gate: L0 (read) runs automatically, L1/L2 (workspace edits) log audit trails, L3 (system/destructive/financial) requires explicit user approval.',
          alternativeRejected: 'Autonomous agent with blanket execution privileges.',
          costAccepted: 'User confirmation prompt required for destructive filesystem or outbound communication tasks.',
          measuredResult: 'Zero unauthorized file deletions or unintended actions across 1,000+ benchmarked operational delegation cycles.',
        },
        {
          title: 'Deterministic Secret Redaction Filter vs Post-Hoc LLM Censorship',
          optionChosen: 'Pre-flight and post-flight regex pattern scanner intercepting API keys, bearer tokens, and private credentials.',
          alternativeRejected: 'Prompting the LLM to redact sensitive credentials in its responses.',
          costAccepted: 'Sub-millisecond regex processing overhead on all tool invocation inputs and outputs.',
          measuredResult: '100% interception recall on test credential injection attacks with zero credential leakage to external LLM providers.',
        },
      ],
      metrics: [
        { label: 'Intent Triage Latency', value: '< 80 ms', detail: 'Local Hydrogen Router classification', evidenceId: 'jarvis-permission-gate' },
        { label: 'Secret Redaction', value: '100.0%', detail: 'Deterministic regex credential interception', evidenceId: 'jarvis-permission-gate' },
        { label: 'MCP Tool Connectors', value: '26 Servers', detail: 'Local and cloud protocol integrations' },
        { label: 'Security Policy Tiers', value: '4 Tiers', detail: 'L0 (auto) to L3 (explicit authorization)' },
      ],
      personalContribution: 'Sole creator and lead architect. Developed the Tauri v2 Rust desktop bridge, the Next.js 15 HUD interface, the FastAPI/LangGraph daemon, the 4-tier security gate, and all 26 MCP tool integration connectors.',
      limitations: 'Requires local background daemon execution on the host machine; multi-device synchronization is currently constrained to local network LAN.',
      nextSteps: 'Adding on-device local SLM (Phi-3 / Gemma 2) fallback inference for full offline operation when internet connectivity drops.',
    },
  },
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
    highlight: 'The podcast’s own site',
    stack: 'JavaScript, React, Tailwind CSS, Next.js',
    description: 'Global audio streaming web application for the Syntinuum podcast network, delivering persistent uninterrupted audio playback, episode catalogs, and responsive interfaces.',
    icons: ['javascript.svg', 'react.svg', 'tailwind.svg'],
    github: 'https://github.com/haresham15/Syntinuum_podcast_website',
    demo: 'https://www.syntinuumpodcast.com/',
    featured: false,
    caseStudy: {
      executiveSummary: 'A fast, accessible web platform built to host, stream, and catalog podcast episodes for the Syntinuum network (100K+ views across YouTube, Instagram and TikTok).',
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
        { label: 'Combined Reach', value: '100K+ views', detail: 'YouTube, Instagram and TikTok combined' },
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
    demo: 'https://www.hareshmurugesan.com',
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

/**
 * Three tiers, so coursework and personal builds don't carry the same weight as the flagships.
 * Flagship = the four featured projects; coursework = class sets, family sites and this portfolio.
 */
export type ProjectTier = 'flagship' | 'supporting' | 'coursework';

export const TIER_ORDER: ProjectTier[] = ['flagship', 'supporting', 'coursework'];

export const TIER_LABEL: Record<ProjectTier, string> = {
  flagship: 'Flagship',
  supporting: 'Supporting',
  coursework: 'Coursework and personal',
};

const COURSEWORK_SLUGS = new Set(['software-1-projects', 'software-2-projects', 'anna-birthday', 'momwebsite', 'portfolio-website']);

export function projectTier(p: Pick<Project, 'slug' | 'featured'>): ProjectTier {
  if (p.featured) return 'flagship';
  return COURSEWORK_SLUGS.has(p.slug) ? 'coursework' : 'supporting';
}

/** The flagships in the order the home page's Works wheel shows them. */
export const FLAGSHIP_ORDER = ['healios', 'apexis', 'routerx-careline', 'tempo'];

/** All projects, flagships first (in Works order), then supporting, then coursework. */
export const projectsByTier: Project[] = TIER_ORDER.flatMap((tier) => {
  const inTier = allProjects.filter((p) => projectTier(p) === tier);
  return tier === 'flagship' ? [...inTier].sort((x, y) => FLAGSHIP_ORDER.indexOf(x.slug) - FLAGSHIP_ORDER.indexOf(y.slug)) : inTier;
});

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

