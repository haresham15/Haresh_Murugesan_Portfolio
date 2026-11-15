/**
 * Canonical Identity & Profile Data for Haresh Murugesan
 * Reconciled across resume, academic records, and portfolio specifications.
 */

export interface ProofChip {
  id: string;
  label: string;
  sublabel: string;
  evidenceId: string;
  href: string;
}

export interface Profile {
  name: string;
  legalName: string;
  /** Short role shown under the name in the header wordmark. */
  title: string;
  /** Hero line under the name. */
  tagline: string;
  /** Hero focus areas, middle-dot separated. */
  focus: string;
  headline: string;
  roleLine: string;
  education: {
    university: string;
    degree: string;
    /** Short form used in the hero fact line. */
    shortDegree: string;
    specialization: string;
    expectedGraduation: string;
    location: string;
    gpa?: string;
  };
  availability: {
    status: string;
    seeking: string;
    targetSeason: string;
  };
  proofChips: ProofChip[];
  contacts: {
    email: string;
    github: string;
    linkedin: string;
    resumeUrl: string;
    resumeDownloadName: string;
  };
  manifesto: {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    definition: string;
    thesis: string;
  };
}

export const profile: Profile = {
  name: 'Haresh Murugesan',
  legalName: 'Haresh Aravind Murugesan',
  title: 'Software & Systems Engineer',
  tagline: 'Engineer and inventor.',
  focus: 'Computer vision · real-time systems · applied AI.',
  headline: 'Software engineer exploring high-performance systems, client architectures, and computational algorithms.',
  roleLine: 'Bachelor of Engineering in Computer Science (AI) at The Ohio State University · May 2028 · Seeking Summer 2027 software and ML internships',
  education: {
    university: 'The Ohio State University',
    degree: 'Bachelor of Engineering in Computer Science',
    shortDegree: 'Computer Science (AI)',
    specialization: 'Specializing in AI, Minor in Business',
    expectedGraduation: 'May 2028',
    location: 'Columbus, OH',
  },
  availability: {
    status: 'Actively Interviewing',
    /** Written in sentence case; rendered as-is after the season. */
    seeking: 'software and ML internships',
    targetSeason: 'Summer 2027',
  },
  proofChips: [
    {
      id: 'chip-datafest',
      label: '2x ASA DataFest 1st Place',
      sublabel: 'Best Use of External Data, 2025 & 2026',
      evidenceId: 'routerx-careline-transit-gap',
      href: '/projects/routerx-careline',
    },
    {
      id: 'chip-cas',
      label: 'AI and Software Development Intern @ CAS',
      sublabel: 'Agentic AI workflows · RAG · AWS S3 · DynamoDB',
      evidenceId: 'cas-aws-scale',
      href: '/#experience',
    },
    {
      id: 'chip-healios',
      label: '8.09ms Clinical Image Saliency',
      sublabel: 'Healios V2 vision pipeline · Benchmarked NumPy pipeline',
      evidenceId: 'healios-xai-saliency',
      href: '/projects/healios',
    },
  ],
  contacts: {
    email: 'haresham2006@gmail.com',
    github: 'https://github.com/haresham15',
    linkedin: 'https://www.linkedin.com/in/haresh-murugesan-4173412a1/',
    resumeUrl: '/Haresh_Murugesan_Resume.pdf',
    resumeDownloadName: 'Haresh_Murugesan_Resume.pdf',
  },
  manifesto: {
    word: 'in·no·va·tion',
    phonetic: '/ˌinəˈvāSH(ə)n/',
    partOfSpeech: 'noun',
    definition: 'The action or process of translating an idea or invention into a system that creates measurable utility.',
    thesis: 'Ideas, resolved into systems.',
  },
};

