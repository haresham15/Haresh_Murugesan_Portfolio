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
  /** One measured outcome, taken from the résumé. Omitted when the résumé gives no number. */
  outcome?: string;
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
    role: 'AI and Software Development Intern',
    company: 'CAS (Chemical Abstracts Service, ACS)',
    period: 'May 2026 – Aug 2026',
    startDate: '2026-05',
    endDate: '2026-08',
    location: 'Columbus, OH',
    type: 'Industry',
    bullets: [
      'Engineered agent-based AI and ML full-stack applications for product stakeholders on AWS S3 and DynamoDB, and deployed agentic AI workflows using vector databases, RAG and model training.',
      'Streamlined deployment pipelines with trunk-based development through GitLab, using Claude tools and agents.',
      'Contributed to C2/C4 architecture designs, improving cross-functional development efficiency and quality.',
    ],
    skillsDemonstrated: ['Amazon S3', 'Amazon DynamoDB', 'Agentic Workflows', 'RAG', 'Vector Databases', 'GitLab', 'C4 Architecture'],
    evidenceIds: ['cas-aws-scale'],
  },
  {
    id: 'osu-pathology-research',
    role: 'Undergraduate AI/ML Researcher',
    company: 'The Ohio State University',
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
  },
  {
    id: 'cis-honda-99p',
    role: 'Innovation Analyst Intern',
    company: 'Honda Research Institute 99P Labs',
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
    role: 'Founder and Interviewer',
    company: 'Syntinuum: Endless Evolutions Podcast',
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

