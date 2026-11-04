/**
 * Canonical Experience Data for Haresh Murugesan
 * Reconciled across resume, academic records, and portfolio specifications.
 */

export interface ExperienceRecord {
  id: string;
  role: string;
  company: string;
  teamOrDivision?: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'Industry' | 'Research' | 'Leadership' | 'Media';
  bullets: string[];
  skillsDemonstrated: string[];
  projectSlugs?: string[];
  evidenceIds?: string[];
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
    role: 'Technology Intern — AI & Software Development',
    company: 'Chemical Abstracts Service (CAS)',
    teamOrDivision: 'DA&I Division, ACE Team',
    period: 'Summer 2026',
    startDate: '2026-05',
    endDate: '2026-08',
    location: 'Columbus, OH',
    type: 'Industry',
    bullets: [
      'Architected and delivered serverless web applications and agentic workflow integrations across 12 internal use cases, streamlining scientific data ingestion and analysis pipelines.',
      'Implemented resilient AWS cloud infrastructure utilizing S3, DynamoDB, and Lambda microservices to process high-volume chemical research metadata with sub-second retrieval latency.',
      'Authored comprehensive C4 system architecture diagrams and standardized CI/CD trunk-based deployment pipelines, reducing deployment friction and maintaining strict schema validation.',
    ],
    skillsDemonstrated: ['AWS Lambda', 'Amazon DynamoDB', 'Amazon S3', 'Agentic Workflows', 'Python', 'TypeScript', 'C4 Architecture', 'CI/CD'],
    evidenceIds: ['cas-aws-scale'],
  },
  {
    id: 'osu-pathology-research',
    role: 'Undergraduate AI/ML Researcher',
    company: 'The Ohio State University',
    teamOrDivision: 'Digital Pathology AI/ML Research',
    period: 'Summer 2026 – Present',
    startDate: '2026-06',
    endDate: 'Present',
    location: 'Columbus, OH',
    type: 'Research',
    bullets: [
      'Developing deep learning and computer vision architectures (CNNs, segmentation models) to automate histological tissue feature extraction and cell boundary identification.',
      'Optimizing digital pathology analysis pipelines to enhance diagnostic measurement reproducibility, establishing rigorous benchmark evaluations across annotated clinical image sets.',
      'Collaborating with multidisciplinary clinical research faculty to translate computational saliency maps into explainable decision-support tools for pathology workflows.',
    ],
    skillsDemonstrated: ['Computer Vision', 'PyTorch', 'TensorFlow', 'OpenCV', 'Digital Pathology', 'Explainable AI', 'Medical Image Segmentation'],
    projectSlugs: ['cv-allergy-wheal', 'healios'],
    evidenceIds: ['healios-xai-saliency', 'healios-hsv-segmentation'],
  },
  {
    id: 'cis-honda-99p',
    role: 'Innovation Analyst',
    company: 'Center for Innovation Strategies at OSU',
    teamOrDivision: 'Honda 99P Labs Data Accelerator / Onramp',
    period: 'Feb 2026 – Present',
    startDate: '2026-02',
    endDate: 'Present',
    location: 'Columbus, OH',
    type: 'Industry',
    bullets: [
      'Synthesized mobility telemetry and spatial datasets across 1,000+ vehicle trip models to uncover urban driving energy efficiency patterns and battery degradation trends.',
      'Constructed geospatial data pipelines and interactive dashboards evaluating connected-vehicle sensor feeds, translating complex telemetry into clear strategic recommendations.',
      'Presented technical data architecture and predictive modeling findings directly to Honda Research Institute and 99P Labs engineering leadership.',
    ],
    skillsDemonstrated: ['Spatial Data Analytics', 'Python', 'Pandas', 'Geospatial Visualization', 'Connected Vehicle Telemetry', 'Stakeholder Communication'],
    evidenceIds: ['routerx-careline-transit-gap'],
  },
  {
    id: 'philocracy-leadership',
    role: 'Founder & Co-CEO',
    company: 'Philocracy',
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
  },
  {
    id: 'syntinuum-podcast',
    role: 'Host & Producer (Season 3)',
    company: 'Syntinuum Podcast',
    teamOrDivision: 'Formerly Adapt: Implementing Innovations',
    period: 'Dec 2025 – Present',
    startDate: '2025-12',
    endDate: 'Present',
    location: 'Columbus, OH',
    type: 'Media',
    bullets: [
      'Engineered and produce an engineering leadership podcast exploring system architecture, scaling dilemmas, and technical tradeoffs with startup founders, researchers, and executives.',
      'Grew listenership to over 100K+ combined cross-platform impressions across Spotify, Apple Podcasts, and YouTube through long-form technical discussions.',
      'Engineered a custom audio-streaming web platform with continuous playback and episode metadata parsing to support seamless listener discovery.',
    ],
    skillsDemonstrated: ['Technical Communication', 'Audio Engineering', 'React', 'Next.js', 'System Architecture Interviewing'],
    projectSlugs: ['syntinuum-podcast-website'],
  },
];

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

