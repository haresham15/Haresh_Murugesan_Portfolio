import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeSection } from './ThemeSection';
import { GridCrosshair } from './ui/EditorialPrimitives';

export interface SkillCategory {
  id: string;
  number: string;
  title: string;
  description: string;
  items: {
    name: string;
    proof: string;
    proofLink?: string;
    metric?: string;
  }[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages-core',
    number: '01',
    title: 'Languages & Core Engineering',
    description: 'Foundations in algorithmic complexity, pointer arithmetic, object-oriented contracts, and strict type-level invariants.',
    items: [
      { name: 'Python (Async / Scientific)', proof: 'FastAPI XAI tensor pipelines & OpenCV', proofLink: '/projects/healios', metric: '8.09ms Grad-CAM' },
      { name: 'TypeScript / JavaScript', proof: 'Deterministic multi-car race simulation', proofLink: '/projects/apexis', metric: '60 FPS Web Workers' },
      { name: 'C / C++ Foundations', proof: 'Memory management & CS50 computation', proofLink: '/projects/cs50-ai-projects' },
      { name: 'Java (OOP & Invariants)', proof: 'Software 2 data structure contracts & testing', proofLink: '/projects/software-2-projects' },
      { name: 'R Statistical Analysis', proof: 'ASA DataFest demographic regression & spatial analysis', proofLink: '/projects/routerx-careline-hub' },
    ],
  },
  {
    id: 'ai-ml-vision',
    number: '02',
    title: 'AI / Machine Learning / Computer Vision',
    description: 'Explainable AI saliency, medical image segmentation, stereoscopic point-clouds, and spatial heuristic models.',
    items: [
      { name: 'Grad-CAM Explainable Vision (XAI)', proof: 'NumPy vectorized saliency heatmaps', proofLink: '/projects/healios', metric: '8.09ms latency' },
      { name: 'PyTorch & TensorFlow', proof: 'Histology tissue classification & clinical CV', proofLink: '/projects/cv-allergy-wheal' },
      { name: 'OpenCV & Color Morphology', proof: 'HSV wound bed granulation & edge filters', proofLink: '/projects/healios', metric: '2.00ms execution' },
      { name: 'Vector Search & pgvector RAG', proof: 'Air-gapped semantic emotional memory', proofLink: '/projects/tempo', metric: '100% offline' },
      { name: 'Browser ML (Tesseract / TF.js)', proof: 'In-browser broadcast OCR worker', proofLink: '/projects/apexis', metric: 'Zero server lag' },
    ],
  },
  {
    id: 'systems-performance',
    number: '03',
    title: 'Systems & Performance',
    description: 'Concurrent background execution, frame-budgeted client runtimes, and resilient system boundaries.',
    items: [
      { name: 'Web Workers & Multithreading', proof: 'Dedicated simulator.worker.ts compute loop', proofLink: '/projects/apexis', metric: '16.6ms budget' },
      { name: 'HTML5 Canvas & Offscreen Contexts', proof: 'Client-side Laplacian blur rejection gate', proofLink: '/projects/healios', metric: '<35ms preflight' },
      { name: 'C4 Architecture System Modeling', proof: 'Enterprise data ingestion topologies at CAS', proofLink: '/#experience' },
      { name: 'State Machines & Crash Journaling', proof: 'Tempo IPC queue & deterministic triage', proofLink: '/projects/tempo' },
    ],
  },
  {
    id: 'backend-cloud',
    number: '04',
    title: 'Distributed Cloud & Microservices',
    description: 'Trunk-based CI/CD deployment, serverless AWS architectures, and sub-millisecond retrieval.',
    items: [
      { name: 'AWS Lambda, DynamoDB & S3', proof: '12 serverless research ingestion pipelines at CAS', proofLink: '/#experience', metric: '<1s query speed' },
      { name: 'FastAPI & Pydantic Contracts', proof: 'Strict type validation & Swagger schemas', proofLink: '/projects/healios' },
      { name: 'PostgreSQL & pgvector', proof: 'IVFFlat cosine similarity vector queries', proofLink: '/projects/tamiltrove', metric: '94.2% Hit@5' },
      { name: 'Next.js & React Server Components', proof: 'Production portfolio & client state machines', proofLink: '/' },
    ],
  },
  {
    id: 'data-engineering',
    number: '05',
    title: 'Data Engineering & Visualization',
    description: 'Geospatial transit optimization, connected-vehicle telematics, and interactive 3D telemetry rendering.',
    items: [
      { name: 'Geospatial OSRM & GTFS Routing', proof: 'RouteRx healthcare transit desert engine', proofLink: '/projects/routerx-careline-hub', metric: '<15ms matrix' },
      { name: 'Pandas, NumPy & Scikit-Learn', proof: 'Honda 99P Labs telematics & NYC housing AI', proofLink: '/projects/nyc-housing-market-ai', metric: '1,000+ models' },
      { name: 'Three.js & WebGL Shaders', proof: 'LiDAR elevation mesh & volumetric aperture', proofLink: '/#hero' },
      { name: 'Spatial Isochrone Buffering', proof: '1st Place ASA DataFest 2026 external data model', proofLink: '/projects/routerx-careline-hub' },
    ],
  },
];

export const NeuralSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('languages-core');

  return (
    <ThemeSection
      id="skills"
      theme="obsidian"
      aria-label="Technical capabilities and systems competencies"
      className="border-b border-[#F4F1EA]/10 flex flex-col justify-between"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        {/* Section Intro */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#E85D04]">
            <span className="w-6 h-px bg-[#E85D04]" />
            <span>04 // TECHNICAL INDEX &amp; COMPETENCIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F1EA] leading-tight tracking-tight">
            Technical Index
          </h2>
          <p className="text-base sm:text-lg font-sans text-[#8E8D94] leading-relaxed">
            Five structured engineering domains backed by real production deliverables, client-side benchmarks, and collegiate research.
          </p>
        </div>

        {/* Category Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#F4F1EA]/10 scrollbar-none">
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer select-none rounded-[2px] ${
                  isActive
                    ? 'bg-[#E85D04] text-[#060608] font-semibold shadow-[0_0_12px_rgba(232,93,4,0.35)]'
                    : 'bg-[#0C0F17] text-[#8E8D94] hover:text-[#F4F1EA] hover:bg-[#151B28] border border-[#F4F1EA]/10'
                }`}
              >
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Domain Deep-Dive Table */}
        {skillCategories
          .filter((cat) => cat.id === activeCategory)
          .map((cat) => (
            <div key={cat.id} className="space-y-8">
              <div className="max-w-2xl space-y-2">
                <p className="text-[16px] font-sans text-[#F4F1EA] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Structured Swiss Shared-Wall Table */}
              <div className="border border-[#F4F1EA]/10 divide-y divide-[#F4F1EA]/[0.08] bg-[#0C0F17] rounded-[2px] overflow-hidden relative shadow-2xl">
                <GridCrosshair className="absolute top-2 left-2 opacity-30 text-[#82B7FF]" />
                <GridCrosshair className="absolute top-2 right-2 opacity-30 text-[#82B7FF]" />

                <div className="hidden sm:grid grid-cols-12 gap-4 py-3.5 px-6 text-[11px] font-mono text-[#F4A261] uppercase tracking-wider bg-[#10141F] border-b border-[#F4F1EA]/10">
                  <div className="col-span-5">ENGINEERING CAPABILITY</div>
                  <div className="col-span-5">VERIFIED PROOF &amp; ARTIFACT</div>
                  <div className="col-span-2 text-right">BENCHMARK</div>
                </div>

                {cat.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center hover:bg-[#151B28] transition-colors duration-180"
                  >
                    <div className="sm:col-span-5 font-serif text-[16px] text-[#F4F1EA]">
                      {item.name}
                    </div>

                    <div className="sm:col-span-5 text-xs font-mono text-[#8E8D94]">
                      {item.proofLink ? (
                        <Link
                          href={item.proofLink}
                          className="text-[#82B7FF] hover:text-[#F4A261] transition-colors underline underline-offset-4"
                        >
                          {item.proof} ↗
                        </Link>
                      ) : (
                        <span>{item.proof}</span>
                      )}
                    </div>

                    <div className="sm:col-span-2 sm:text-right text-xs font-mono text-[#F4A261]">
                      {item.metric && <span>{item.metric}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </ThemeSection>
  );
};

export default NeuralSkills;
