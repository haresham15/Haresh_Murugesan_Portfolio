import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GridCrosshair } from './ui/GridCrosshair';

export type ToolDomain = 'ai-ml' | 'frontend-3d' | 'backend-cloud' | 'systems-hardware';

export interface TechTool {
  name: string;
  tag: string;
  iconPath?: string;
  svgIcon?: React.ReactNode;
  domain: ToolDomain;
  powersProjects: string[];
  provenance: {
    project: string;
    slug: string;
    role: string;
  }[];
}

const CppSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M14 6C12 4 8 4 6 7C4 10 4 14 6 17C8 20 12 20 14 18" stroke="#70A5FF" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M16 12H20M18 10V14M21 12H23M22 11V13" stroke="#FFB86C" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ThreeJsSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M4 4L20 9L15 20L4 4Z" stroke="#70A5FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 4L14 13L15 20" stroke="#FFE9AE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FramerMotionSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M4 2H20V9H12L4 2Z" fill="#FFB86C" />
    <path d="M4 9H12L20 16H4V9Z" fill="#FF6B2B" />
    <path d="M4 16H12L4 23V16Z" fill="#C8321E" />
  </svg>
);

const SwiftSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M20 16C16 20 8 20 3 16C7 17 11 16 14 13C10 13 6 10 4 7C7 8 10 9 13 8C8 7 5 3 5 2C9 5 14 7 19 6C17 9 14 11 12 11C15 12 18 13 20 16Z" fill="#FF8547" />
  </svg>
);

const CanvasSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="0" stroke="#FFB86C" strokeWidth="1.8" />
    <path d="M7 17L11 11L15 15L17 13" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="8" r="1.5" fill="#FFE9AE" />
  </svg>
);

const NodeSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="#4CC38A" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 2V22M3.5 7L20.5 17M3.5 17L20.5 7" stroke="#4CC38A" strokeWidth="1.2" strokeOpacity="0.35" />
    <circle cx="12" cy="12" r="2.2" fill="#4CC38A" />
  </svg>
);

const LinuxSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12 2C9 2 7 5 7 9C7 11 6 13 4 14C3 15 3 17 5 18C8 19 9 20 12 20C15 20 16 19 19 18C21 17 21 15 20 14C18 13 17 11 17 9C17 5 15 2 12 2Z" stroke="#FFE9AE" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="10" cy="7" r="1.2" fill="#FFE9AE" />
    <circle cx="14" cy="7" r="1.2" fill="#FFE9AE" />
    <path d="M11 10C11.5 11 12.5 11 13 10" stroke="#FF6B2B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DaVinciSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#9BA8B8" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="2.5" fill="#C8321E" />
    <circle cx="15" cy="10" r="2.5" fill="#4C8DFF" />
    <circle cx="12" cy="15" r="2.5" fill="#FFB86C" />
  </svg>
);

const PyTorchSvg = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M13.5 3L11.5 5L13.5 7" stroke="#EE4C2C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5C7 5 4 9 4 13.5C4 18 7.5 21 12 21C16.5 21 20 18 20 13.5C20 11.5 19 9.5 17.5 8" stroke="#EE4C2C" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="15.5" cy="5" r="1" fill="#EE4C2C" />
  </svg>
);

interface TrackDefinition {
  domain: ToolDomain;
  title: string;
  philosophy: string;
  connectedProjects: { name: string; slug: string }[];
}

const tracks: TrackDefinition[] = [
  {
    domain: 'ai-ml',
    title: 'AI & Machine Learning',
    philosophy: 'Sub-10ms explainable vision, gradient saliency, morphological HSV clustering, and statistical spatial priors over black-box outputs.',
    connectedProjects: [
      { name: 'Healios V2', slug: 'healios' },
      { name: 'TamilTrove', slug: 'tamiltrove' },
      { name: 'Careline', slug: 'routerx-careline-hub' },
    ],
  },
  {
    domain: 'frontend-3d',
    title: 'Frontend, 3D & Mobile',
    philosophy: 'High-frame-rate client web systems, off-main-thread Web Workers, 60fps physics simulation, and WebGL volumetric graphics.',
    connectedProjects: [
      { name: 'Apexis', slug: 'apexis' },
      { name: 'Healios', slug: 'healios' },
      { name: 'Tempo', slug: 'tempo' },
    ],
  },
  {
    domain: 'backend-cloud',
    title: 'Backend, Cloud & Data',
    philosophy: 'Sub-second scientific metadata indexing, pgvector semantic cosine memory, and resilient serverless microservice pipelines.',
    connectedProjects: [
      { name: 'CAS Microservices', slug: 'apexis' },
      { name: 'Tempo SQLite', slug: 'tempo' },
      { name: 'NYC OS', slug: 'nyc-housing-market-ai' },
    ],
  },
  {
    domain: 'systems-hardware',
    title: 'Hardware, Media & Systems',
    philosophy: 'Strict memory management, pointer arithmetic, multi-camera color science pipelines, and verified trunk-based CI/CD testing.',
    connectedProjects: [
      { name: 'Syntinuum', slug: 'podcast' },
      { name: 'Apexis Engine', slug: 'apexis' },
      { name: 'OSU Lab Clusters', slug: 'cv-allergy-wheal' },
    ],
  },
];

export const toolsRegistry: TechTool[] = [
  // AI & ML
  {
    name: 'Python',
    tag: 'Python 3.11',
    iconPath: '/icons/python.svg',
    domain: 'ai-ml',
    powersProjects: ['healios', 'tamiltrove', 'cv-allergy-wheal'],
    provenance: [{ project: 'Healios V2', slug: 'healios', role: '8.09ms NumPy Grad-CAM & HSV Saliency' }],
  },
  {
    name: 'PyTorch',
    tag: 'Torch 2.x',
    svgIcon: <PyTorchSvg />,
    domain: 'ai-ml',
    powersProjects: ['healios', 'cv-allergy-wheal'],
    provenance: [{ project: 'OSU Digital Pathology', slug: 'cv-allergy-wheal', role: 'Tissue Contour Fitting' }],
  },
  {
    name: 'OpenCV',
    tag: 'OpenCV 4.x',
    iconPath: '/icons/opencv.svg',
    domain: 'ai-ml',
    powersProjects: ['healios', 'cv-allergy-wheal'],
    provenance: [{ project: 'Healios V2', slug: 'healios', role: 'HSV Color-Space Saliency' }],
  },
  {
    name: 'NumPy & Pandas',
    tag: 'Vectorized Math',
    iconPath: '/icons/numpy.svg',
    domain: 'ai-ml',
    powersProjects: ['healios', 'routerx-careline-hub', 'nyc-housing-market-ai'],
    provenance: [{ project: 'Healios V2', slug: 'healios', role: '8.09ms Vectorized Matrix Operations' }],
  },
  {
    name: 'R & RStudio',
    tag: 'CRAN / RStudio',
    iconPath: '/icons/r.svg',
    domain: 'ai-ml',
    powersProjects: ['routerx-careline-hub'],
    provenance: [{ project: 'Careline / RouteRx', slug: 'routerx-careline-hub', role: 'Transit Gap Vulnerability Index Math' }],
  },
  {
    name: 'Jupyter',
    tag: 'Interactive Math',
    iconPath: '/icons/jupyter.svg',
    domain: 'ai-ml',
    powersProjects: ['nyc-housing-market-ai'],
    provenance: [{ project: 'NYC Housing Engine', slug: 'nyc-housing-market-ai', role: 'Statistical Capital Flow Modeling' }],
  },

  // Frontend, 3D & Mobile
  {
    name: 'TypeScript',
    tag: 'TS 5.9',
    iconPath: '/icons/typescript.svg',
    domain: 'frontend-3d',
    powersProjects: ['apexis', 'tempo', 'philocracy'],
    provenance: [{ project: 'Apexis Telemetry', slug: 'apexis', role: 'Worker Schemas & Physics Invariants' }],
  },
  {
    name: 'React',
    tag: 'React 18 / 19',
    iconPath: '/icons/react.svg',
    domain: 'frontend-3d',
    powersProjects: ['apexis', 'tempo', 'healios'],
    provenance: [{ project: 'Apexis', slug: 'apexis', role: 'Real-Time 60fps Telemetry HUD' }],
  },
  {
    name: 'Next.js',
    tag: 'Next.js 14 / 15',
    iconPath: '/icons/nextjs.svg',
    domain: 'frontend-3d',
    powersProjects: ['healios', 'apexis', 'portfolio-website'],
    provenance: [{ project: 'Healios V2', slug: 'healios', role: 'Static Page Routing' }],
  },
  {
    name: 'Three.js / WebGL',
    tag: 'three / r3f',
    svgIcon: <ThreeJsSvg />,
    domain: 'frontend-3d',
    powersProjects: ['portfolio-website', 'nyc-housing-market-ai'],
    provenance: [{ project: 'Portfolio 3D Hero', slug: 'portfolio-website', role: '160-Blade Lamellar Louvre Sculpture' }],
  },
  {
    name: 'Tailwind CSS',
    tag: 'Tailwind v3 / v4',
    iconPath: '/icons/tailwind.svg',
    domain: 'frontend-3d',
    powersProjects: ['portfolio-website', 'healios', 'apexis'],
    provenance: [{ project: 'Portfolio V5', slug: 'portfolio-website', role: 'Swiss 0px Blueprint System' }],
  },
  {
    name: 'Framer Motion',
    tag: 'framer-motion',
    svgIcon: <FramerMotionSvg />,
    domain: 'frontend-3d',
    powersProjects: ['syntinuum-podcast-website', 'apexis'],
    provenance: [{ project: 'Syntinuum', slug: 'syntinuum-podcast-website', role: 'Interactive Waveform Deck' }],
  },
  {
    name: 'Swift & iOS',
    tag: 'Swift 6 / ARKit',
    svgIcon: <SwiftSvg />,
    domain: 'frontend-3d',
    powersProjects: ['healios'],
    provenance: [{ project: 'Healios V2 Mobile', slug: 'healios', role: 'iOS TrueDepth LiDAR Mesh' }],
  },
  {
    name: 'HTML5 Canvas',
    tag: 'Offscreen API',
    svgIcon: <CanvasSvg />,
    domain: 'frontend-3d',
    powersProjects: ['apexis', 'healios'],
    provenance: [{ project: 'Apexis', slug: 'apexis', role: '60fps Track Rendering Worker' }],
  },

  // Backend & Cloud
  {
    name: 'FastAPI',
    tag: 'FastAPI / ASGI',
    iconPath: '/icons/fastapi.svg',
    domain: 'backend-cloud',
    powersProjects: ['healios', 'cas'],
    provenance: [{ project: 'Healios V2', slug: 'healios', role: '8.09ms Clinical Vision Gateway' }],
  },
  {
    name: 'AWS Architecture',
    tag: 'Lambda / S3 / DDB',
    iconPath: '/icons/aws.svg',
    domain: 'backend-cloud',
    powersProjects: ['cas', 'syntinuum-podcast-website'],
    provenance: [{ project: 'CAS Technology Intern', slug: 'apexis', role: '12 Serverless Asynchronous Workflows' }],
  },
  {
    name: 'PostgreSQL & pgvector',
    tag: 'PostgreSQL 16',
    iconPath: '/icons/postgresql.svg',
    domain: 'backend-cloud',
    powersProjects: ['tempo', 'routerx-careline-hub'],
    provenance: [{ project: 'Tempo', slug: 'tempo', role: 'pgvector Cosine Memory' }],
  },
  {
    name: 'Supabase',
    tag: 'Supabase / RLS',
    iconPath: '/icons/supabase.svg',
    domain: 'backend-cloud',
    powersProjects: ['tempo'],
    provenance: [{ project: 'Tempo', slug: 'tempo', role: 'Row-Level Security' }],
  },
  {
    name: 'Docker',
    tag: 'Docker Compose',
    iconPath: '/icons/docker.svg',
    domain: 'backend-cloud',
    powersProjects: ['cas', 'healios'],
    provenance: [{ project: 'CAS Microservices', slug: 'apexis', role: 'Containerized CI/CD Deployment' }],
  },
  {
    name: 'Node.js',
    tag: 'Node 20+ LTS',
    svgIcon: <NodeSvg />,
    domain: 'backend-cloud',
    powersProjects: ['apexis', 'portfolio-website'],
    provenance: [{ project: 'Apexis Engine', slug: 'apexis', role: 'Multi-Threaded Worker Execution' }],
  },

  // Systems & Hardware
  {
    name: 'C / C++',
    tag: 'C++17 Pointer Math',
    svgIcon: <CppSvg />,
    domain: 'systems-hardware',
    powersProjects: ['software-2-projects'],
    provenance: [{ project: 'OSU CSE Systems', slug: 'software-2-projects', role: 'Direct Memory Allocation & Trees' }],
  },
  {
    name: 'Linux & Bash',
    tag: 'Ubuntu / Shell',
    svgIcon: <LinuxSvg />,
    domain: 'systems-hardware',
    powersProjects: ['cv-allergy-wheal'],
    provenance: [{ project: 'OSU Lab Clusters', slug: 'cv-allergy-wheal', role: 'Slurm Batch Compute Scheduling' }],
  },
  {
    name: 'DaVinci Resolve 20',
    tag: 'Color Science',
    svgIcon: <DaVinciSvg />,
    domain: 'systems-hardware',
    powersProjects: ['syntinuum-podcast-website'],
    provenance: [{ project: 'Syntinuum Podcast', slug: 'syntinuum-podcast-website', role: '35mm Film Emulation' }],
  },
  {
    name: 'Git & GitHub',
    tag: 'Trunk-Based CI',
    iconPath: '/icons/github.svg',
    domain: 'systems-hardware',
    powersProjects: ['all'],
    provenance: [{ project: 'All 18 Repositories', slug: 'portfolio-website', role: 'Trunk-Based PRs' }],
  },
];

export const NeuralSkills: React.FC = () => {
  const [hoveredTool, setHoveredTool] = useState<TechTool | null>(null);

  return (
    <section
      id="skills"
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="Technical Index and Capability Matrix"
    >
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* SECTION HEADER BAR */}
      <div className="border-b border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
            <span className="text-[#FFB86C] font-semibold">05 // TECHNICAL INDEX</span>
            <span>CAPABILITY MATRIX // 06.1</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F4EFE6] leading-none tracking-tight">
            Technical Index
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#B0BCCB] max-w-2xl leading-relaxed">
            4-row architectural matrix mapping verified engineering stacks directly into production systems without card wrappers.
          </p>
        </div>

        {hoveredTool && (
          <div className="text-xs font-mono text-[#FFB86C] flex items-center gap-2">
            <span>ACTIVE // {hoveredTool.name.toUpperCase()}</span>
            <span className="text-[#8A99AD]">({hoveredTool.tag})</span>
          </div>
        )}
      </div>

      {/* 4 FLUSH HORIZONTAL MATRIX ROWS */}
      <div className="divide-y divide-[#F4EFE6]/10">
        {tracks.map((track) => {
          const trackTools = toolsRegistry.filter((t) => t.domain === track.domain);

          return (
            <div
              key={track.domain}
              className="p-6 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start hover:bg-[#0C1729]/30 transition-colors"
            >
              {/* Cols 1–3: Domain Title & Philosophy */}
              <div className="lg:col-span-3 space-y-2">
                <h3 className="text-2xl font-serif text-[#F4EFE6] tracking-tight">
                  {track.title}
                </h3>
                <p className="text-xs font-sans text-[#8A99AD] leading-relaxed">
                  {track.philosophy}
                </p>
              </div>

              {/* Cols 4–9: Frameless Inline Vector Tool Nodes (ZERO BOX CARDS!) */}
              <div className="lg:col-span-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                {trackTools.map((tool) => {
                  const isHovered = hoveredTool?.name === tool.name;

                  return (
                    <div
                      key={tool.name}
                      onMouseEnter={() => setHoveredTool(tool)}
                      onMouseLeave={() => setHoveredTool(null)}
                      className={`inline-flex items-center gap-2.5 cursor-pointer py-1 select-none border-b transition-all ${
                        isHovered ? 'border-[#FF6B2B] text-[#FFE9AE]' : 'border-transparent text-[#F4EFE6] hover:text-[#FFB86C]'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {tool.iconPath ? (
                          <Image
                            src={tool.iconPath}
                            alt={tool.name}
                            width={20}
                            height={20}
                            className="object-contain filter max-w-[20px] max-h-[20px]"
                          />
                        ) : (
                          tool.svgIcon
                        )}
                      </div>
                      <span className="text-sm font-sans font-medium">{tool.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Cols 10–12: Connected Projects Output */}
              <div className="lg:col-span-3 space-y-1.5 lg:border-l lg:border-[#F4EFE6]/10 lg:pl-6 text-xs font-mono">
                <span className="text-[#FFB86C] uppercase block text-[10px] tracking-wider">
                  SYSTEM PROVENANCE //
                </span>
                <div className="flex flex-col gap-1 text-[#8A99AD]">
                  {track.connectedProjects.map((proj, pIdx) => (
                    <Link
                      key={pIdx}
                      href={`/projects/${proj.slug}`}
                      className="hover:text-[#F4EFE6] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span className="text-[#FF6B2B]">→</span>
                      <span>{proj.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NeuralSkills;
