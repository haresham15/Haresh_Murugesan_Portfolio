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
  headline: string;
  roleLine: string;
  education: {
    university: string;
    degree: string;
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
  headline: 'Software engineer exploring high-performance systems, client architectures, and computational algorithms.',
  roleLine: 'B.S. Computer Science & Engineering at The Ohio State University · Expected May 2028 · Seeking Summer 2027 Software Engineering & Systems Internships',
  education: {
    university: 'The Ohio State University',
    degree: 'B.S. Computer Science & Engineering',
    specialization: 'Software Systems & Real-Time Computing',
    expectedGraduation: 'May 2028',
    location: 'Columbus, OH',
  },
  availability: {
    status: 'Actively Interviewing',
    seeking: 'Software Engineering & Systems Internships',
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
      label: 'AWS & Serverless Pipelines @ CAS',
      sublabel: '12 internal use cases · S3 · DynamoDB · Lambda',
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
    email: 'haresham15@gmail.com',
    github: 'https://github.com/haresham15',
    linkedin: 'https://www.linkedin.com/in/haresh-murugesan-4173412a1/',
    resumeUrl: '/resume.pdf',
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

