/**
 * Evidence Register for hareshmurugesan.com
 * Every metric displayed across the portfolio traces back to an EvidenceRecord.
 * Last Verified: October 29, 2026
 */

export interface EvidenceRecord {
  id: string;
  claim: string;
  value: string;
  metricLabel: string;
  methodology: string;
  hardwareOrEnv: string;
  sampleSize: string;
  limitations: string;
  lastVerified: '2026-10-29';
}

export const evidenceRegistry: Record<string, EvidenceRecord> = {
  'healios-xai-saliency': {
    id: 'healios-xai-saliency',
    claim: 'Grad-CAM saliency map & colormap pipeline latency in Healios V2',
    value: '8.09 ms',
    metricLabel: 'Grad-CAM Saliency',
    methodology: 'Vectorized NumPy piecewise linear Jet colormap interpolation; timing isolates saliency extraction and colormap synthesis after backward pass, without matplotlib overhead.',
    hardwareOrEnv: 'Apple Silicon M-series & Ubuntu x86-64 testbench, Python 3.11, FastAPI, 224x224 RGB image input.',
    sampleSize: '500 continuous image passes benchmarked across post-surgical incision test images.',
    limitations: 'Measures saliency compute and colormap generation only; does not include full network transit time or initial image decompression.',
    lastVerified: '2026-10-29',
  },
  'healios-hsv-segmentation': {
    id: 'healios-hsv-segmentation',
    claim: 'HSV color-space tissue bed morphology segmentation latency',
    value: '2.00 ms',
    metricLabel: 'Tissue Morphology',
    methodology: 'Vectorized OpenCV/NumPy HSV thresholding classifying granulation (red/pink), slough (yellow/tan), and necrosis (avascular eschar).',
    hardwareOrEnv: 'Local Python 3.11 runtime, 128x128 resolution ROI masks.',
    sampleSize: '250 synthetic and de-identified wound ROI samples.',
    limitations: 'Performs geometric surface color segmentation; not a substitute for histological biopsy or clinical laboratory pathology.',
    lastVerified: '2026-10-29',
  },
  'healios-edge-blur-gate': {
    id: 'healios-edge-blur-gate',
    claim: 'In-browser HTML5 Canvas Laplacian blur and luminance pre-flight gatekeeper',
    value: '< 35 ms',
    metricLabel: 'Edge Pre-Flight Gate',
    methodology: 'Client-side 3x3 Laplacian convolution kernel evaluated on raw ImageData array before payload dispatch.',
    hardwareOrEnv: 'Modern desktop and mobile browsers (Chromium V8, WebKit).',
    sampleSize: '100 test images with synthetic Gaussian blur and varying exposure levels.',
    limitations: 'Calculates overall variance of Laplacian; localized focal blur in peripheral margins may not trigger rejection.',
    lastVerified: '2026-10-29',
  },
  'tempo-crisis-recall': {
    id: 'tempo-crisis-recall',
    claim: 'Deterministic crisis pattern interception recall in communication buffer',
    value: '100.0% (5/5)',
    metricLabel: 'Crisis Recall',
    methodology: 'Pre-model deterministic regex & token analysis circuit breaker executing in 0.2ms before LLM dispatch; evaluated against an evaluation set of distress inputs.',
    hardwareOrEnv: 'Node.js runtime, Supabase Edge Functions.',
    sampleSize: '30-case benchmark dataset (5 explicit crisis cases, 5 colloquial idioms, 20 high-arousal emotional texts).',
    limitations: 'Strictly evaluated on a 30-case benchmark dataset. Designed as a personal cognitive buffer; does NOT claim universal clinical safety or psychiatric diagnostic efficacy.',
    lastVerified: '2026-10-29',
  },
  'tempo-pgvector-rag': {
    id: 'tempo-pgvector-rag',
    claim: 'PostgreSQL pgvector IVFFlat Cosine Similarity past spiral retrieval accuracy',
    value: '0.824 Cosine Sim',
    metricLabel: 'Semantic RAG Accuracy',
    methodology: '768-dimensional text embeddings matched against historically resolved spirals with Cosine similarity thresholding.',
    hardwareOrEnv: 'PostgreSQL 16 with pgvector extension on Supabase.',
    sampleSize: '40 categorized emotional reflection logs.',
    limitations: 'Requires user to have previously logged and tagged resolution reflections to populate the retrieval vector space.',
    lastVerified: '2026-10-29',
  },
  'apexis-60fps-sim': {
    id: 'apexis-60fps-sim',
    claim: 'Off-main-thread 2D physics simulation rendering frame rate',
    value: '60 fps',
    metricLabel: 'Simulation Frame Rate',
    methodology: 'Dedicated Web Worker (simulator.worker.ts) calculating driver track positions, delta times, and sector splits off the UI thread.',
    hardwareOrEnv: 'Chromium 124+ / macOS & Windows 11, evaluated over 10-minute continuous race sessions with 20 active cars.',
    sampleSize: '10 continuous 10-minute simulation sessions across OpenF1 track layouts.',
    limitations: 'Sustained 60fps requires client hardware with Web Worker support; low-power mobile devices may drop to 30fps under battery-saver throttling.',
    lastVerified: '2026-10-29',
  },
  'apexis-sqlite-latency': {
    id: 'apexis-sqlite-latency',
    claim: 'Historical motorsport head-to-head database query latency',
    value: '< 12 ms',
    metricLabel: 'Historical Query Time',
    methodology: 'Indexed local SQLite lookups across historical motorsport race results dating from 1950 to present.',
    hardwareOrEnv: 'Node.js serverless execution environment.',
    sampleSize: '1,000 randomized driver and constructor comparison queries.',
    limitations: 'Static archival dataset updated between race weekends; real-time live telemetry is ingested via OpenF1 API separately.',
    lastVerified: '2026-10-29',
  },
  'routerx-careline-transit-gap': {
    id: 'routerx-careline-transit-gap',
    claim: 'Transit-isolated census blocks identified in Topeka, KS for healthcare routing',
    value: '43 of 141 Blocks',
    metricLabel: 'Transit Gap Identified',
    methodology: 'Spatial analysis combining Tigercensus, OpenStreetMap, GTFS bus stop buffers (800m walking radius), and Stormont Vail Health clinical data.',
    hardwareOrEnv: 'RStudio, OSRM routing engine, Python spatial libraries.',
    sampleSize: '141 Census Blocks in Shawnee County / Topeka, KS.',
    limitations: 'Assumes straight-line or network walking paths under normal weather; does not account for temporary road construction or sidewalk closures.',
    lastVerified: '2026-10-29',
  },
  'tamiltrove-hit5': {
    id: 'tamiltrove-hit5',
    claim: 'Top-5 retrieval accuracy across hybrid sparse/dense Tamil literature search',
    value: '94.2% Hit@5',
    metricLabel: 'Hybrid Retrieval Hit@5',
    methodology: 'Evaluated against an expert-annotated 120-query Tamil literature test set pairing BM25 lexical tokenization with dense multilingual vector embeddings.',
    hardwareOrEnv: 'Python 3.11, FAISS, custom Tamil morphological tokenizer.',
    sampleSize: '120 test queries across 1,330 Thirukkural couplets and Sangam literature verses.',
    limitations: 'Performance drops on rare archaic Tamil sandhi agglutinations without morphological pre-segmentation.',
    lastVerified: '2026-10-29',
  },
  'cas-aws-scale': {
    id: 'cas-aws-scale',
    claim: 'Agent-based AI and ML full-stack applications built for product stakeholders at CAS',
    value: 'Agentic AI on AWS',
    metricLabel: 'AI and Software Development Intern',
    methodology: 'Full-stack applications on AWS S3 and DynamoDB; agentic AI workflows using vector databases, RAG and model training; trunk-based deployment through GitLab; contributed to C2/C4 architecture designs.',
    hardwareOrEnv: 'AWS S3, DynamoDB, GitLab, vector databases.',
    sampleSize: 'Summer internship, May to August 2026.',
    limitations: 'Internal enterprise tooling; proprietary chemistry workflows and internal data schemas remain confidential.',
    lastVerified: '2026-10-29',
  },
  'apexis-throughput-latency': {
    id: 'apexis-throughput-latency',
    claim: 'C++20 SPSC ring buffer & Go 1.23 WebSocket telemetry broker throughput and p99 latency in Apexis v2.0',
    value: '250k+ msg/s · sub-1.8ms p99',
    metricLabel: 'Broker Throughput & Latency',
    methodology: 'High-frequency synthetic CAN bus and OpenF1 telemetry replay load tested with k6 and custom C++ harness measuring p99 message transit from producer to Lakehouse/UI.',
    hardwareOrEnv: 'Bare-metal Ubuntu 24.04 LTS & Windows 11 testbench, Go 1.23, C++20 Clang 18, 10GbE loopback.',
    sampleSize: '10,000,000 telemetry packets streamed over continuous 30-minute race sessions.',
    limitations: 'Sub-1.8ms p99 measured on local loopback network; WAN latency over public internet introduces additional 15–40ms jitter depending on ISP route.',
    lastVerified: '2026-10-29',
  },
  'aethergate-cost-ttft': {
    id: 'aethergate-cost-ttft',
    claim: 'RouteLLM complexity cost reduction and Redis Stack HNSW cache hit TTFT in AetherGate',
    value: '87.43% Cost Cut · 6-8ms TTFT',
    metricLabel: 'Cost Cut & Cache TTFT',
    methodology: 'Dual evaluation measuring RouteLLM cost arbitrage across 2,500 diverse prompts and sub-10ms Redis HNSW Cosine vector similarity lookups.',
    hardwareOrEnv: 'Go 1.24 runtime, Redis Stack 7.4 with HNSW vector index, AWS c6i.2xlarge benchmarking node.',
    sampleSize: '2,500 mixed-complexity evaluation prompts across Chatbot Arena and technical programming datasets.',
    limitations: 'Cost savings depend on traffic distribution between simple and complex tasks; cache hit TTFT requires pre-warmed embeddings in Redis memory.',
    lastVerified: '2026-10-29',
  },
  'jarvis-permission-gate': {
    id: 'jarvis-permission-gate',
    claim: 'Hydrogen Router multi-agent triage latency and secret redaction recall in Project J.A.R.V.I.S.',
    value: '< 80ms Triage · 100% Redaction',
    metricLabel: 'Triage Latency & Redaction',
    methodology: 'FastAPI/Rust IPC router measuring classification latency across 1,000 synthetic intent prompts and deterministic regex redaction over API keys, OAuth tokens, and system credentials.',
    hardwareOrEnv: 'Windows 11 desktop, Python 3.12, FastAPI, Tauri v2 Rust core, AMD Ryzen 9 7950X.',
    sampleSize: '1,000 intent classification queries and 200 security leak test payloads.',
    limitations: 'Evaluated against local rule-based intent router; LLM fallback routing adds 150–300ms if query cannot be deterministically resolved.',
    lastVerified: '2026-10-29',
  },
  'datafest-2025-first-place': {
    id: 'datafest-2025-first-place',
    claim: '1st Place for Best Use of External Data (ASA DataFest 2025)',
    value: '1st Place',
    metricLabel: 'ASA DataFest 2025',
    methodology: 'Multi-institutional 48-hour data hackathon judged by American Statistical Association faculty and industry data scientists.',
    hardwareOrEnv: 'The Ohio State University, College of Arts & Sciences.',
    sampleSize: '40+ competing collegiate engineering and statistics teams.',
    limitations: 'Evaluated on hackathon judging rubric for statistical rigor, external data integration, and presentation clarity.',
    lastVerified: '2026-10-29',
  },
};

export function getEvidence(id: string): EvidenceRecord | undefined {
  return evidenceRegistry[id];
}

