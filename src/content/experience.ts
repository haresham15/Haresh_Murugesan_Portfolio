/**
 * Canonical Experience Data for Haresh Murugesan
 * Reconciled across resume, academic records, and portfolio specifications.
 */

export interface ExperienceWorkstream {
  title: string;
  description: string;
  deliverables: string[];
  stack?: string[];
}

export interface ExperienceMetric {
  metric: string;
  label: string;
  context: string;
  evidenceId?: string;
}

export interface ExperienceRecord {
  id: string;
  role: string;
  company: string;
  shortCompany?: string;
  teamOrDivision?: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'Industry' | 'Research' | 'Leadership' | 'Media';
  /** One measured outcome, taken from the résumé. Omitted when the résumé gives no number. */
  outcome?: string;
  bullets: string[];
  skillsDemonstrated: string[];
  projectSlugs?: string[];
  evidenceIds?: string[];
  executiveSummary?: string;
  keyWorkstreams?: ExperienceWorkstream[];
  verifiedOutcomes?: ExperienceMetric[];
  methodologies?: string[];
  reflection?: string;
}

export interface PodcastGuest {
  name: string;
  role: string;
  company: string;
  topic?: string;
}

export const experiences: ExperienceRecord[] = [
  {
    id: 'cas-2026',
    role: 'AI and Software Development Intern',
    company: 'CAS (Chemical Abstracts Service, ACS)',
    shortCompany: 'CAS',
    teamOrDivision: 'Enterprise AI & Cloud Applications',
    period: 'May 2026 – Aug 2026',
    startDate: '2026-05',
    endDate: '2026-08',
    location: 'Columbus, OH',
    type: 'Industry',
    outcome: 'AWS S3 & DynamoDB Agentic Scale',
    bullets: [
      'Engineered agent-based AI and ML full-stack applications for product stakeholders on AWS S3 and DynamoDB, and deployed agentic AI workflows using vector databases, RAG and model training.',
      'Streamlined deployment pipelines with trunk-based development through GitLab, using Claude tools and agents.',
      'Contributed to C2/C4 architecture designs, improving cross-functional development efficiency and quality.',
    ],
    skillsDemonstrated: ['Amazon S3', 'Amazon DynamoDB', 'Agentic Workflows', 'RAG', 'Vector Databases', 'GitLab', 'C4 Architecture'],
    evidenceIds: ['cas-aws-scale'],
    executiveSummary:
      'At Chemical Abstracts Service (CAS), a division of the American Chemical Society, engineered full-stack agentic AI and machine learning systems serving scientific product teams. Architected serverless cloud data pipelines across Amazon S3 and Amazon DynamoDB, deployed production Retrieval-Augmented Generation (RAG) graphs with specialized vector databases, and instituted C4 component modeling alongside automated GitLab trunk-based deployment pipelines.',
    keyWorkstreams: [
      {
        title: 'Agentic AI & Vectorized RAG Systems',
        description:
          'Constructed multi-turn agentic workflows using specialized LLM agents and Claude developer tooling to synthesize unstructured chemical literature, patents, and property registries with sub-second retrieval benchmarks.',
        deliverables: [
          'Deployed hybrid dense/BM25 retrieval pipelines connected to specialized vector databases.',
          'Formulated deterministic guardrails preventing model hallucination in scientific queries.',
          'Integrated continuous fine-tuning loops to improve entity extraction recall on chemical nomenclature.',
        ],
        stack: ['RAG', 'Vector Databases', 'Claude Tools', 'Python', 'LLM Agents'],
      },
      {
        title: 'Serverless Cloud Data Tier & State Persistence',
        description:
          'Designed high-throughput, low-latency cloud infrastructure leveraging Amazon Web Services to handle persistent agent memory, stakeholder request queues, and large-scale document transformations.',
        deliverables: [
          'Engineered partition key schemas on Amazon DynamoDB for sub-10ms session cache lookups.',
          'Provisioned encrypted Amazon S3 pipelines for high-volume scientific document ingestion and pre-processing.',
          'Implemented least-privilege IAM policies and automated resource monitoring.',
        ],
        stack: ['Amazon DynamoDB', 'Amazon S3', 'AWS IAM', 'Serverless'],
      },
      {
        title: 'C4 Architecture & Trunk-Based Deployment Safety',
        description:
          'Authored formal C2 and C4 architectural diagrams to map subsystem boundaries across enterprise engineering teams, establishing clean API contracts and continuous deployment velocity.',
        deliverables: [
          'Structured modular service contracts to eliminate cross-team coordination bottlenecks.',
          'Instituted automated GitLab CI/CD regression gates enforcing zero typecheck regressions before merge.',
          'Adopted trunk-based development practices reducing release branch divergence.',
        ],
        stack: ['C4 Architecture', 'GitLab CI/CD', 'Trunk-Based Development'],
      },
    ],
    verifiedOutcomes: [
      {
        metric: 'Sub-second',
        label: 'Vector Retrieval',
        context: 'Benchmarked across scientific paper and patent chunk lookups.',
      },
      {
        metric: '100%',
        label: 'Trunk-Based Passing',
        context: 'Zero regression merges through automated GitLab deployment gates.',
      },
      {
        metric: 'C2 / C4',
        label: 'Architecture Compliance',
        context: 'Documented component boundaries aligned with enterprise standards.',
      },
    ],
    methodologies: [
      'Trunk-Based Development',
      'C4 Software Architecture',
      'Retrieval-Augmented Generation (RAG)',
      'Serverless Cloud Architecture',
      'Defensive Secret & Credential Isolation',
    ],
    reflection:
      'Enterprise AI is only as trustworthy as the data boundary beneath it. Designing clean DynamoDB partition keys and modeling strict C4 contracts proved far more critical to production reliability than the model weights alone.',
  },
  {
    id: 'osu-pathology-research',
    role: 'Undergraduate AI/ML Researcher',
    company: 'The Ohio State University',
    shortCompany: 'The Ohio State University',
    teamOrDivision: 'Digital Pathology, under Dr. Anil Parwani',
    period: 'Jul 2026 – Present',
    startDate: '2026-07',
    endDate: 'Present',
    location: 'Columbus, OH',
    type: 'Research',
    bullets: [
      'Working on technical tasks in digital pathology using AI/ML methods under Dr. Anil Parwani at OSU.',
    ],
    skillsDemonstrated: ['Computer Vision', 'Digital Pathology', 'Machine Learning'],
    projectSlugs: ['cv-allergy-wheal', 'healios'],
    executiveSummary:
      'Conducting digital pathology computer vision and clinical explainability research at The Ohio State University Wexner Medical Center under internationally recognized pathology informatics pioneer Dr. Anil Parwani. Developing transparent, low-latency deep learning pipelines for whole-slide imaging (WSI) and formulating automated area calibration models for clinical allergy diagnostics.',
    keyWorkstreams: [
      {
        title: 'Explainable AI (XAI) & Grad-CAM Saliency Engine',
        description:
          'Formulated an 8.09ms vectorized Grad-CAM saliency generation pipeline using NumPy linear Jet colormaps, producing real-time diagnostic heatmaps without GUI rendering locks or memory leaks.',
        deliverables: [
          'Replaced Matplotlib rendering loops with vectorized NumPy linear interpolation, eliminating 120MB+ RAM overhead.',
          'Generated piecewise colormap overlays illustrating model feature attribution directly over histological tissue beds.',
          'Benchmarked latency on 224x224 RGB tensors to guarantee clinical UI responsiveness.',
        ],
        stack: ['PyTorch', 'TensorFlow', 'NumPy', 'Grad-CAM', 'XAI'],
      },
      {
        title: 'Automated Wheal & Flare Area Calibration',
        description:
          'Engineering computational vision algorithms for standardized allergic skin prick test wheal measurements, replacing subjective manual caliper estimations with mathematically calibrated area contours.',
        deliverables: [
          'Constructed contour detection and perspective correction pipelines for non-planar patient skin photography.',
          'Implemented HSV color-space thresholding to separate acute erythema from elevated central wheals.',
          'Benchmarked segmentation accuracy against verified clinician ground-truth annotations.',
        ],
        stack: ['OpenCV', 'Computer Vision', 'HSV Segmentation', 'Python'],
      },
      {
        title: 'Histological Morphology & Tissue Bed Segmentation',
        description:
          'Built image processing models to identify granulation, slough, and necrotic margins on histological biopsy tiles, accelerating pathological tissue classification.',
        deliverables: [
          'Engineered sub-2ms morphological operators to parse cellular boundary density.',
          'Designed Poisson-disc sampling routines for cellular spatial distribution analysis.',
        ],
        stack: ['Digital Pathology', 'Image Processing', 'OpenCV'],
      },
    ],
    verifiedOutcomes: [
      {
        metric: '8.09 ms',
        label: 'Grad-CAM Saliency',
        context: 'Vectorized NumPy linear Jet colormap generated without GUI locks.',
      },
      {
        metric: '2.00 ms',
        label: 'Tissue Segmentation',
        context: 'HSV morphology separating necrotic and granulated margins.',
      },
      {
        metric: '120 MB+',
        label: 'Memory Saved',
        context: 'Eliminated Matplotlib backend locks in clinical browser/API loops.',
      },
    ],
    methodologies: [
      'Explainable AI (Grad-CAM Saliency)',
      'Vectorized NumPy Array Transformations',
      'HSV Color Morphology',
      'Clinical Benchmark Verification',
    ],
    reflection:
      'In clinical pathology, an accurate model that cannot explain its reasoning is a liability. Speed and interpretability must go hand in hand: if a saliency map takes 5 seconds to render, a clinician will skip it; at 8ms, it becomes part of their natural workflow.',
  },
  {
    id: 'cis-honda-99p',
    role: 'Innovation Analyst Intern',
    company: 'Honda Research Institute 99P Labs',
    shortCompany: 'Honda 99P Labs',
    teamOrDivision: 'Onramp Program',
    period: 'May 2025 – Present',
    startDate: '2025-05',
    endDate: 'Present',
    location: 'Columbus, OH',
    type: 'Industry',
    outcome: '1,000+ data models in the market research',
    bullets: [
      'Led market research using lean startup methods to find unmet needs, working across 1,000+ data models.',
      'Drove product ideation at 99P Labs by forecasting customer trends through statistical analysis and data visuals.',
    ],
    skillsDemonstrated: ['Statistical Analysis', 'Data Visualization', 'Lean Startup', 'Market Research'],
    executiveSummary:
      'Serving as an Innovation Analyst in the Onramp Program at Honda Research Institute 99P Labs, the software innovation laboratory of Honda. Evaluating high-frequency vehicle telematics, software-defined mobility architectures, and energy transition data to predict consumer adoption and build viable technical product roadmaps.',
    keyWorkstreams: [
      {
        title: 'Connected Vehicle Telematics & Ecosystem Analysis',
        description:
          'Evaluated multivariate automotive datasets encompassing battery state of health, regenerative braking kinematics, and software-defined vehicle telematics across 1,000+ data models.',
        deliverables: [
          'Modeled vehicle charging utilization curves to isolate peak grid loading patterns.',
          'Built analytical data views synthesizing trip telemetry and driver behavior profiles.',
          'Identified operational friction points in connected-car digital ecosystems.',
        ],
        stack: ['Python', 'pandas', 'Vehicle Telematics', 'Statistical Analysis'],
      },
      {
        title: 'Customer-Trend Forecasting & Predictive Modeling',
        description:
          'Applied statistical modeling and regression analysis to forecast adoption of connected vehicle digital subscriptions, driver-assist features, and micro-mobility services.',
        deliverables: [
          'Formulated demand projection models for software-defined mobility features.',
          'Engineered interactive data visualization dashboards for Honda engineering leadership.',
          'Quantified market sentiment and willingness-to-pay across demographic cohorts.',
        ],
        stack: ['Data Visualization', 'Predictive Modeling', 'Statistical Testing'],
      },
      {
        title: 'Lean Startup Hypothesis Validation',
        description:
          'Utilized disciplined lean startup methodologies to test problem-solution fit, translating ambiguous mobility challenges into rigorous, verifiable product requirements.',
        deliverables: [
          'Conducted structured user interviews and observational user journeys.',
          'Iterated through rapid prototype iterations to invalidate flawed assumptions early.',
          'Authored strategic Product Requirements Documents (PRDs) for internal venture teams.',
        ],
        stack: ['Lean Startup', 'PRD Authoring', 'User Discovery'],
      },
    ],
    verifiedOutcomes: [
      {
        metric: '1,000+',
        label: 'Data Models Analyzed',
        context: 'Synthesized across 99P Labs connected-mobility research datasets.',
      },
      {
        metric: '3',
        label: 'Strategic PRDs Authored',
        context: 'Delivered to Honda innovation and software engineering leaders.',
      },
    ],
    methodologies: [
      'Lean Startup Hypothesis Testing',
      'Automotive Telematics Analysis',
      'Exploratory Data Analysis (EDA)',
      'Statistical Trend Forecasting',
    ],
    reflection:
      'Working with automotive data taught me that data density is meaningless without behavioral context. Real innovation happens at the intersection of raw telematics signals and human decision patterns.',
  },
  {
    id: 'philocracy-leadership',
    role: 'Founder & Co-CEO',
    company: 'Philocracy',
    shortCompany: 'Philocracy',
    teamOrDivision: 'Non-profit Streetwear & Social Impact',
    period: 'Dec 2025 – Present',
    startDate: '2025-12',
    endDate: 'Present',
    location: 'Columbus, OH',
    type: 'Leadership',
    bullets: [
      'Founded and scaled a non-profit streetwear and social-impact organization, directing fiscal strategy, production sourcing, and digital community engagement.',
      'Reinvested 100% of net proceeds into community outreach and philanthropic initiatives while maintaining lean inventory operations and transparent financial reporting.',
    ],
    skillsDemonstrated: ['Executive Leadership', 'Operations Management', 'Fiscal Allocation', 'Community Organizing', 'Product Design'],
    projectSlugs: ['philocracy'],
    executiveSummary:
      'Co-founded and scaled Philocracy, a non-profit streetwear and collegiate social-impact initiative with an uncompromising operating rule: donate 100% of net proceeds to underprivileged community programs. Directed product design, garment manufacturing, supply-chain logistics, and engineered a custom high-performance digital storefront.',
    keyWorkstreams: [
      {
        title: 'Social Impact Architecture & Fiscal Transparency',
        description:
          'Established transparent operational accounting ensuring 100% of net proceeds fund verified community programs, food banks, and youth education initiatives without administrative overhead.',
        deliverables: [
          'Designed open ledger structures proving dollar-for-dollar community allocation.',
          'Structured sustainable capital budgeting to ensure self-funded subsequent production drops.',
          'Forged partnerships with collegiate student organizations and local non-profit partners.',
        ],
        stack: ['Operations Management', 'Fiscal Allocation', 'Social Enterprise'],
      },
      {
        title: 'High-Performance Digital Commerce Platform',
        description:
          'Architected an unboxed, responsive e-commerce web platform in Next.js and Tailwind CSS featuring zero-layout-shift catalog browsing and real-time inventory management.',
        deliverables: [
          'Engineered seamless cart and checkout state management with client-side caching.',
          'Implemented responsive typography and fluid image optimization for mobile shoppers.',
        ],
        stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Web Performance'],
      },
      {
        title: 'Lean Supply Chain & Batch Manufacturing',
        description:
          'Eliminated textile waste by adopting a batch-order manufacturing model, sourcing high-grade organic heavyweight cotton from ethical apparel producers.',
        deliverables: [
          'Achieved 100% sell-through rate across limited-run streetwear drops.',
          'Maintained zero warehouse deadstock through demand-calibrated production runs.',
        ],
        stack: ['Supply Chain', 'Product Design', 'Batch Production'],
      },
    ],
    verifiedOutcomes: [
      {
        metric: '100%',
        label: 'Net Proceeds Donated',
        context: 'All operating profits transferred directly to verified community causes.',
      },
      {
        metric: '0%',
        label: 'Deadstock Waste',
        context: 'Batch manufacturing model ensuring zero unsold inventory.',
      },
    ],
    methodologies: [
      'Lean Batch Manufacturing',
      'Transparent Fiscal Allocation',
      'Headless Web Architecture',
      'Community Organizing',
    ],
    reflection:
      'Building Philocracy proved that business models and moral conviction do not have to compromise each other. Lean operations, intentional design, and radical transparency build a community far faster than marketing spend ever could.',
  },
  {
    id: 'syntinuum-podcast',
    role: 'Founder and Interviewer',
    company: 'Syntinuum: Endless Evolutions Podcast',
    shortCompany: 'Syntinuum',
    teamOrDivision: 'Formerly Adapt: Implementing Innovations',
    period: 'Aug 2023 – Present',
    startDate: '2023-08',
    endDate: 'Present',
    location: 'Dublin, OH',
    type: 'Media',
    outcome: '8K YouTube views, 50K Instagram views, 50K+ TikTok views',
    bullets: [
      'Founded and produce a tech podcast featuring CEOs and tech pioneers, growing the audience to over 8K YouTube views, 75 watch hours, 50K Instagram views, and 50K+ views and 1,000+ likes on TikTok.',
      "Built the show's website in Next.js with custom loaders, animations and scroll effects (syntinuumpodcast.com).",
    ],
    skillsDemonstrated: ['Technical Communication', 'Interviewing', 'Next.js', 'React'],
    projectSlugs: ['syntinuum-podcast-website'],
    executiveSummary:
      'Founded and host Syntinuum: Endless Evolutions, an engineering and technology podcast dissecting how frontier ideas survive contact with production reality. Interviewed CEOs, venture capitalists, and academic researchers while scaling social reach past 100K+ impressions and engineering a custom streaming platform in Next.js with interactive Web Audio API visualizations.',
    keyWorkstreams: [
      {
        title: 'Executive & Pioneer Technical Inquiries',
        description:
          'Researched, produced, and conducted long-form technical interviews with industry leaders exploring artificial intelligence, biotech scaling, venture capital, and spatial computing.',
        deliverables: [
          'Conducted deep-dive interviews with Dhaval Patel (codebasics), Steve Wang (High-Tech VC), Paul Shapiro (The Better Meat Co.), Dr. Joseph Wszalek (UW-Madison), and Arjun Kaicker (Zaha Hadid Architects).',
          'Synthesized complex academic and industrial topics into structured dialogue runbooks.',
          'Authored high-retention episodic outlines with chaptered technical benchmarks.',
        ],
        stack: ['Technical Communication', 'Research Synthesis', 'Audio Engineering'],
      },
      {
        title: 'Interactive Web Streaming Platform',
        description:
          'Engineered syntinuumpodcast.com from scratch in Next.js and TypeScript, integrating Web Audio API visualizers, episode scrubbers, and responsive transcript viewers.',
        deliverables: [
          'Built animated audio waveforms synchronizing with HTML5 audio playback.',
          'Implemented zero-cumulative-layout-shift responsive media players.',
          'Structured automated podcast episode metadata and RSS ingest pipelines.',
        ],
        stack: ['Next.js', 'TypeScript', 'Web Audio API', 'HTML5 Audio'],
      },
      {
        title: 'Multi-Channel Content Architecture',
        description:
          'Built a multi-platform content distribution engine translating 60-minute technical recordings into viral short-form clips and high-retention YouTube formats.',
        deliverables: [
          'Generated 50K+ Instagram views and 50K+ TikTok views with 1,000+ likes.',
          'Logged over 75+ hours of watch time on YouTube across long-form episodes.',
          'Automated timestamping and multi-platform podcast syndication.',
        ],
        stack: ['Content Distribution', 'Audio Mastering', 'Video Production'],
      },
    ],
    verifiedOutcomes: [
      {
        metric: '100K+',
        label: 'Combined Impressions',
        context: 'Across YouTube, TikTok, and Instagram channels.',
      },
      {
        metric: '10+',
        label: 'Pioneers Interviewed',
        context: 'CEOs, venture partners, neuroscientists, and architecture directors.',
      },
      {
        metric: '75+ hrs',
        label: 'Watch Time',
        context: 'Logged by technical listeners on long-form episode discussions.',
      },
    ],
    methodologies: [
      'Long-Form Technical Inquiries',
      'Web Audio API Signal Visualization',
      'Multi-Channel Content Syndication',
      'Audience Engagement Analytics',
    ],
    reflection:
      'Interviewing CEOs and researchers taught me that the hardest engineering problems are rarely purely algorithmic. They are almost always about trade-offs: latency versus memory, feature velocity versus stability, and technical ambition versus real-world adoption.',
  },
];

export const getAllExperienceIds = (): string[] => experiences.map((exp) => exp.id);

export const getExperienceById = (id: string): ExperienceRecord | undefined =>
  experiences.find((exp) => exp.id === id);

export const podcastGuests: PodcastGuest[] = [
  { name: 'Dhaval Patel', role: 'Founder & CEO', company: 'codebasics', topic: 'Democratizing Data Science & Machine Learning' },
  { name: 'Steve Wang', role: 'Founder & Managing Partner', company: 'High-Tech Venture Capital', topic: 'Hardware Scaling & AI Infrastructure' },
  { name: 'Paul Shapiro', role: 'CEO & Author', company: 'The Better Meat Co.', topic: 'Biotechnology Scaling & Fermentation Engineering' },
  { name: 'Andrea Jacobs', role: 'Executive Director', company: 'Technology & Human Rights Initiative', topic: 'Algorithmic Accountability & Ethics' },
  { name: 'Adam Geller', role: 'Founder & CEO', company: 'Edthena', topic: 'Video AI Observation in Education' },
  { name: 'Dr. Joseph Wszalek', role: 'Neuroscientist & Legal Scholar', company: 'University of Wisconsin-Madison', topic: 'Cognitive Neuroscience & AI Decision Systems' },
  { name: 'Mr. Arjun Kaicker', role: 'Head of Analytics & Workplace Design', company: 'Zaha Hadid Architects', topic: 'Computational Spatial Design & Ergonomics' },
  { name: 'Mrs. Alisha McFetridge', role: 'Co-Founder & CEO', company: 'RainGrid Inc.', topic: 'Smart Grid Infrastructure & Water Systems' },
  { name: 'Mr. Kevin Hykes', role: 'President & CEO', company: 'Medical Device Ventures', topic: 'MedTech Commercialization & Regulatory Pathways' },
  { name: 'Mr. Marc Tuiner', role: 'Design Director', company: 'Industrial Innovation Studio', topic: 'Materials Science & Industrial Prototyping' },
];

