/**
 * Recruiter-Aligned Skills & Evidence-Linked Capabilities
 * Zero percentage bars. Every skill links directly to the project(s) or role(s) that prove it.
 */

export interface SkillItem {
  name: string;
  category: 'ai-ml' | 'systems' | 'frontend' | 'cloud-data' | 'core-cs';
  provenBy: {
    title: string;
    slug?: string;
    href: string;
    type: 'project' | 'experience';
  }[];
  highlight?: string;
}

export interface SkillDomain {
  id: 'ai-ml' | 'systems' | 'frontend' | 'cloud-data' | 'core-cs';
  title: string;
  description: string;
  skills: SkillItem[];
}

export const skillDomains: SkillDomain[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Computer vision, explainable AI, vector retrieval, and multimodal deep learning pipelines.',
    skills: [
      {
        name: 'Grad-CAM & Explainability (XAI)',
        category: 'ai-ml',
        highlight: '8.09ms pipeline',
        provenBy: [{ title: 'Healios V2', slug: 'healios', href: '/projects/healios', type: 'project' }],
      },
      {
        name: 'PyTorch & TensorFlow',
        category: 'ai-ml',
        provenBy: [
          { title: 'Healios V2', slug: 'healios', href: '/projects/healios', type: 'project' },
          { title: 'OSU Digital Pathology Research', href: '/#experience', type: 'experience' },
        ],
      },
      {
        name: 'Vector Search & pgvector RAG',
        category: 'ai-ml',
        highlight: 'Cosine IVFFlat',
        provenBy: [{ title: 'Tempo', slug: 'tempo', href: '/projects/tempo', type: 'project' }],
      },
      {
        name: 'OpenCV & Computer Vision',
        category: 'ai-ml',
        provenBy: [
          { title: 'Digital Pathology CV Research', slug: 'cv-allergy-wheal', href: '/projects/cv-allergy-wheal', type: 'project' },
          { title: 'Healios V2 (HSV Morphology)', slug: 'healios', href: '/projects/healios', type: 'project' },
        ],
      },
      {
        name: 'Browser ML (TensorFlow.js / Tesseract)',
        category: 'ai-ml',
        highlight: 'Client-side inference',
        provenBy: [{ title: 'Apexis', slug: 'apexis', href: '/projects/apexis', type: 'project' }],
      },
      {
        name: 'Multimodal Vision & LLM Orchestration',
        category: 'ai-ml',
        provenBy: [
          { title: 'Tempo (Spatial Chunker)', slug: 'tempo', href: '/projects/tempo', type: 'project' },
          { title: 'CAS Agentic Pipelines', href: '/#experience', type: 'experience' },
        ],
      },
    ],
  },
  {
    id: 'systems',
    title: 'Software Systems & Backend',
    description: 'Microservice design, high-throughput asynchronous APIs, and real-time computation.',
    skills: [
      {
        name: 'FastAPI & Python Async',
        category: 'systems',
        highlight: 'High concurrency',
        provenBy: [
          { title: 'Healios V2 Backend', slug: 'healios', href: '/projects/healios', type: 'project' },
          { title: 'NYC OS Market Engine', slug: 'nyc-housing-market-ai', href: '/projects/nyc-housing-market-ai', type: 'project' },
        ],
      },
      {
        name: 'Web Workers & Multithreading',
        category: 'systems',
        highlight: '60fps simulation',
        provenBy: [{ title: 'Apexis (simulator.worker.ts)', slug: 'apexis', href: '/projects/apexis', type: 'project' }],
      },
      {
        name: 'PostgreSQL & SQLModel',
        category: 'systems',
        provenBy: [
          { title: 'Tempo (Supabase pgvector)', slug: 'tempo', href: '/projects/tempo', type: 'project' },
          { title: 'Healios V2 EHR Persistence', slug: 'healios', href: '/projects/healios', type: 'project' },
        ],
      },
      {
        name: 'C4 Architecture & System Modeling',
        category: 'systems',
        provenBy: [
          { title: 'CAS ACE Architecture', href: '/#experience', type: 'experience' },
          { title: 'Healios V2 Architecture', slug: 'healios', href: '/projects/healios', type: 'project' },
        ],
      },
      {
        name: 'RESTful API Engineering & Zod Schemas',
        category: 'systems',
        provenBy: [
          { title: 'Tempo Active Failover', slug: 'tempo', href: '/projects/tempo', type: 'project' },
          { title: 'Apexis OpenF1 Telemetry Ingestion', slug: 'apexis', href: '/projects/apexis', type: 'project' },
        ],
      },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend & Interactive Graphics',
    description: 'Next.js static site generation, accessible UI architecture, and high-performance Canvas.',
    skills: [
      {
        name: 'Next.js (SSG / Static Export) & React',
        category: 'frontend',
        provenBy: [
          { title: 'hareshmurugesan.com (Portfolio)', slug: 'portfolio-website', href: '/system', type: 'project' },
          { title: 'Apexis Motorsports Hub', slug: 'apexis', href: '/projects/apexis', type: 'project' },
          { title: 'Healios V2 Frontend', slug: 'healios', href: '/projects/healios', type: 'project' },
        ],
      },
      {
        name: 'TypeScript (Strict Type-Level Safety)',
        category: 'frontend',
        provenBy: [
          { title: 'Tempo RSD Buffer', slug: 'tempo', href: '/projects/tempo', type: 'project' },
          { title: 'Apexis Telemetry Types', slug: 'apexis', href: '/projects/apexis', type: 'project' },
        ],
      },
      {
        name: 'Tailwind CSS & DTCG Token Systems',
        category: 'frontend',
        highlight: 'CSS-first tokens',
        provenBy: [{ title: 'Portfolio Design System', slug: 'portfolio-website', href: '/system', type: 'project' }],
      },
      {
        name: 'HTML5 Canvas & Edge Image Processing',
        category: 'frontend',
        highlight: '<35ms Laplacian kernel',
        provenBy: [{ title: 'Healios V2 Edge Gatekeeper', slug: 'healios', href: '/projects/healios', type: 'project' }],
      },
      {
        name: 'Framer Motion & Hardware Acceleration',
        category: 'frontend',
        provenBy: [
          { title: 'hareshmurugesan.com', slug: 'portfolio-website', href: '/', type: 'project' },
          { title: 'Syntinuum Web Player', slug: 'syntinuum-podcast-website', href: '/projects/syntinuum-podcast-website', type: 'project' },
        ],
      },
      {
        name: 'Web Audio API & Sonic Grounding',
        category: 'frontend',
        provenBy: [{ title: 'Tempo (Brownian Noise Engine)', slug: 'tempo', href: '/projects/tempo', type: 'project' }],
      },
    ],
  },
  {
    id: 'cloud-data',
    title: 'Data & Cloud Infrastructure',
    description: 'Serverless AWS architectures, geospatial data routing, and statistical analysis.',
    skills: [
      {
        name: 'Amazon Web Services (AWS)',
        category: 'cloud-data',
        highlight: 'S3, DynamoDB, Lambda',
        provenBy: [{ title: 'Chemical Abstracts Service (CAS)', href: '/#experience', type: 'experience' }],
      },
      {
        name: 'Geospatial Optimization (OSRM, GTFS, GIS)',
        category: 'cloud-data',
        highlight: '1st Place DataFest 2026',
        provenBy: [{ title: 'RouteRx (Careline)', slug: 'routerx-careline', href: '/projects/routerx-careline', type: 'project' }],
      },
      {
        name: 'Pandas, NumPy & Scikit-Learn',
        category: 'cloud-data',
        provenBy: [
          { title: 'RouteRx (Careline)', slug: 'routerx-careline', href: '/projects/routerx-careline', type: 'project' },
          { title: 'NYC Housing Market Analysis', slug: 'nyc-housing-market-ai', href: '/projects/nyc-housing-market-ai', type: 'project' },
          { title: 'Honda 99P Labs Accelerator', href: '/#experience', type: 'experience' },
        ],
      },
      {
        name: 'CI/CD Pipelines & GitHub Actions',
        category: 'cloud-data',
        provenBy: [
          { title: 'CAS Trunk-based Deployment', href: '/#experience', type: 'experience' },
          { title: 'Portfolio Static Automated Export', href: '/system', type: 'project' },
        ],
      },
    ],
  },
  {
    id: 'core-cs',
    title: 'Languages & Core CS',
    description: 'Strong foundations in data structure invariants, algorithmic complexity, and typed programming.',
    skills: [
      {
        name: 'Python',
        category: 'core-cs',
        provenBy: [
          { title: 'Healios V2 (FastAPI / XAI)', slug: 'healios', href: '/projects/healios', type: 'project' },
          { title: 'Digital Pathology CV Research', slug: 'cv-allergy-wheal', href: '/projects/cv-allergy-wheal', type: 'project' },
          { title: 'CS50 AI Algorithms', slug: 'cs50-ai-projects', href: '/projects/cs50-ai-projects', type: 'project' },
        ],
      },
      {
        name: 'TypeScript & JavaScript',
        category: 'core-cs',
        provenBy: [
          { title: 'Apexis Motorsports Platform', slug: 'apexis', href: '/projects/apexis', type: 'project' },
          { title: 'Tempo RSD Buffer', slug: 'tempo', href: '/projects/tempo', type: 'project' },
        ],
      },
      {
        name: 'Java (OOP, Invariants, JUnit)',
        category: 'core-cs',
        provenBy: [
          { title: 'Software 2 (Data Structures & Invariants)', slug: 'software-2-projects', href: '/projects/software-2-projects', type: 'project' },
          { title: 'Software 1 (Java OOP & Contracts)', slug: 'software-1-projects', href: '/projects/software-1-projects', type: 'project' },
        ],
      },
      {
        name: 'R (Statistical Analysis & Tigercensus)',
        category: 'core-cs',
        provenBy: [{ title: 'RouteRx (Careline) DataFest 2026', slug: 'routerx-careline', href: '/projects/routerx-careline', type: 'project' }],
      },
      {
        name: 'Data Structures & Algorithmic Complexity',
        category: 'core-cs',
        provenBy: [
          { title: 'Software 2 Engineering Projects', slug: 'software-2-projects', href: '/projects/software-2-projects', type: 'project' },
          { title: 'CS50 AI Classical Algorithms', slug: 'cs50-ai-projects', href: '/projects/cs50-ai-projects', type: 'project' },
        ],
      },
    ],
  },
];

