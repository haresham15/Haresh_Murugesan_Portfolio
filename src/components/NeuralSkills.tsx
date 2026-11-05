import React, { useState } from 'react';
import Link from 'next/link';
import { SectionContainer } from './ui/SectionContainer';
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
    title: 'Backend / Cloud / Infrastructure',
    description: 'Serverless cloud topologies, high-throughput metadata ingestion, and automated deployment pipelines.',
    items: [
      { name: 'Amazon Web Services (AWS)', proof: 'S3, DynamoDB, Lambda microservices at CAS', proofLink: '/#experience', metric: '12 pipelines' },
      { name: 'FastAPI & Asynchronous Python', proof: 'High-concurrency clinical diagnostic endpoints', proofLink: '/projects/healios' },
      { name: 'PostgreSQL & SQLite Persistence', proof: 'EHR records & encrypted local buffers', proofLink: '/projects/tempo' },
      { name: 'CI/CD & Trunk-Based Deployment', proof: 'GitHub Actions & Next.js static site export', proofLink: '/system' },
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
    <SectionContainer
      id="skills"
      variant="editorial"
      bgMode="technical"
      className="py-24 sm:py-32 lg:py-40 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Technical capabilities and systems competencies"
    >
      {/* Section Intro */}
      <div className="max-w-3xl mb-16 space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
          Technical Index
        </h2>
        <p className="text-base sm:text-lg font-sans text-[#A7B2C3] leading-relaxed">
          Five structured engineering domains backed by real production deliverables, client-side benchmarks, and collegiate research.
        </p>
      </div>

      {/* 2. Category Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 border-b border-[#F3EFE7]/[0.08] scrollbar-none">
        {skillCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer select-none rounded-[2px] ${
                isActive
                  ? 'bg-[#FF6B35] text-[#070B12] font-semibold shadow-[0_0_12px_rgba(255,107,53,0.3)]'
                  : 'bg-[#101B30] text-[#A7B2C3] hover:text-[#F3EFE7] hover:bg-[#17243A] border border-[#F3EFE7]/[0.08]'
              }`}
            >
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Active Domain Deep-Dive Table */}
      {skillCategories
        .filter((cat) => cat.id === activeCategory)
        .map((cat) => (
          <div key={cat.id} className="space-y-8">
            <div className="max-w-2xl space-y-2">
              <p className="text-[16px] font-sans text-[#F3EFE7] leading-relaxed">
                {cat.description}
              </p>
            </div>

            {/* Structured Swiss Shared-Wall Table */}
            <div className="border border-[#F3EFE7]/[0.1] divide-y divide-[#F3EFE7]/[0.08] bg-[#070B12] rounded-[2px] overflow-hidden relative shadow-[0_4px_24px_rgba(7,11,18,0.7)]">
              <GridCrosshair className="absolute top-2 left-2 opacity-30 text-[#82B7FF]" />
              <GridCrosshair className="absolute top-2 right-2 opacity-30 text-[#82B7FF]" />

              <div className="hidden sm:grid grid-cols-12 gap-4 py-3.5 px-6 text-[11px] font-mono text-[#82B7FF] uppercase tracking-wider bg-[#101B30]/60 border-b border-[#F3EFE7]/[0.08]">
                <div className="col-span-5">ENGINEERING CAPABILITY</div>
                <div className="col-span-5">VERIFIED PROOF &amp; ARTIFACT</div>
                <div className="col-span-2 text-right">BENCHMARK</div>
              </div>

              {cat.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 items-start sm:items-center hover:bg-[#0C1729] transition-colors duration-180"
                >
                  <div className="sm:col-span-5 font-serif text-[16px] text-[#F3EFE7]">
                    {item.name}
                  </div>

                  <div className="sm:col-span-5 text-xs font-mono text-[#A7B2C3]">
                    {item.proofLink ? (
                      <Link
                        href={item.proofLink}
                        className="text-[#82B7FF] hover:text-[#F5D998] transition-colors underline underline-offset-4"
                      >
                        {item.proof} ↗
                      </Link>
                    ) : (
                      <span>{item.proof}</span>
                    )}
                  </div>

                  <div className="sm:col-span-2 sm:text-right text-xs font-mono text-[#F5D998]">
                    {item.metric && <span>{item.metric}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

    </SectionContainer>
  );
};

export default NeuralSkills;
