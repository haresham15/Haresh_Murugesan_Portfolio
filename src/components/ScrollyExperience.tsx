import React, { useState, useEffect, useCallback } from 'react';
import { SectionContainer } from './ui/SectionContainer';
import { ChicaneCircuitTrack } from './experience/ChicaneCircuitTrack';
import { ExperienceDossierStage, DetailedExperienceRecord } from './experience/ExperienceDossierStage';

export interface ExperienceItem extends DetailedExperienceRecord {}

export const experiences: ExperienceItem[] = [
  {
    id: 'cas',
    year: '2026',
    period: 'Summer 2026 (May – Aug 2026)',
    role: 'Technology Intern — Systems & AI Software Development',
    company: 'Chemical Abstracts Service (CAS)',
    teamOrDivision: 'DA&I Division, ACE Team',
    location: 'Columbus, OH',
    classification: 'INDUSTRY SOFTWARE & SYSTEMS',
    leadSummary:
      'Architected serverless web applications and agentic workflow integrations across 12 distinct internal use cases, streamlining high-throughput scientific data ingestion and enterprise research retrieval.',
    bullets: [
      'Architected resilient AWS cloud infrastructure utilizing S3, DynamoDB, and Lambda microservices to process high-volume chemical research metadata with sub-second retrieval latency.',
      'Implemented serverless web applications and agentic workflow integrations across 12 internal use cases, streamlining scientific data ingestion and analysis pipelines.',
      'Authored comprehensive C4 system architecture diagrams and standardized trunk-based CI/CD deployment pipelines enforcing strict schema validation and IAM least-privilege security policies.',
    ],
    skillsDemonstrated: [
      'AWS Lambda',
      'Amazon DynamoDB',
      'Amazon S3',
      'Agentic Workflows',
      'Python',
      'TypeScript',
      'C4 Architecture',
      'Trunk-based CI/CD',
    ],
    verifiedOutcome: 'Delivered 12 serverless workflows processing scientific research datasets with sub-second retrieval.',
    evidenceIds: ['cas-aws-scale'],
  },
  {
    id: 'osu-research',
    year: '2026',
    period: 'Summer 2026 – Present (June 2026 – Present)',
    role: 'Undergraduate AI/ML Researcher',
    company: 'The Ohio State University',
    teamOrDivision: 'Digital Pathology & Clinical Diagnostics Lab',
    location: 'Columbus, OH',
    classification: 'ACADEMIC AI/ML RESEARCH',
    leadSummary:
      'Developing deep learning and computer vision architectures (CNNs, segmentation models) to automate histological tissue feature extraction and clinical boundary identification.',
    bullets: [
      'Developed computer vision segmentation pipelines reducing false-positive boundary artifacts across clinical image benchmarks.',
      'Implemented custom evaluation scripts calculating Dice coefficient and intersection-over-union (IoU) metrics against board-certified pathologist annotations under varying stain intensity distributions.',
      'Collaborating with multidisciplinary clinical research faculty to translate computational saliency maps into explainable decision-support tools for pathology workflows.',
    ],
    skillsDemonstrated: [
      'Computer Vision',
      'PyTorch',
      'TensorFlow',
      'OpenCV',
      'Digital Pathology',
      'Explainable AI',
      'Medical Image Segmentation',
    ],
    verifiedOutcome: 'Automated tissue feature extraction pipelines with rigorous cross-validated benchmark evaluations.',
    projectSlugs: ['cv-allergy-wheal', 'healios'],
    evidenceIds: ['healios-xai-saliency', 'healios-hsv-segmentation'],
  },
  {
    id: 'honda-99p',
    year: '2025–2026',
    period: 'Feb 2026 – Present',
    role: 'Innovation Analyst',
    company: 'Center for Innovation Strategies at OSU',
    teamOrDivision: 'Honda 99P Labs Connected Mobility Data Accelerator',
    location: 'Columbus, OH',
    classification: 'CONNECTED VEHICLE TELEMATICS',
    leadSummary:
      'Synthesized mobility telemetry and spatial datasets across 1,000+ vehicle trip models to uncover urban driving energy efficiency patterns and battery degradation trends.',
    bullets: [
      'Built and evaluated 1,000+ data models and spatial visualizations across connected-vehicle telemetry datasets in the 99P Labs ecosystem.',
      'Constructed geospatial data pipelines and interactive dashboards evaluating connected-vehicle sensor feeds, translating complex telemetry into clear strategic recommendations.',
      'Presented technical data architecture, mobility insights, and predictive modeling findings directly to Honda Research Institute and 99P Labs engineering leadership.',
    ],
    skillsDemonstrated: [
      'Connected Vehicle Telemetry',
      'Spatial Data Analytics',
      'Python',
      'Pandas',
      'Geospatial Visualization',
      'Stakeholder Communication',
    ],
    verifiedOutcome: '1,000+ telemetry models developed; strategic findings presented to Honda Research leadership.',
    evidenceIds: ['routerx-careline-transit-gap'],
  },
  {
    id: 'philocracy',
    year: '2024–2025',
    period: 'Dec 2025 – Present',
    role: 'Founder & Co-CEO',
    company: 'Philocracy',
    teamOrDivision: 'Structured Deliberation Platform & Social Impact',
    location: 'Columbus, OH',
    classification: 'PRODUCT ARCHITECTURE & GOVERNANCE',
    leadSummary:
      'Directing technical architecture for structured argument-tree platforms while leading fiscal strategy, production sourcing, and operations for a philanthropic social enterprise.',
    bullets: [
      'Founded and scaled a non-profit streetwear and social-impact organization, directing fiscal strategy, production sourcing, and digital community engagement.',
      'Directed engineering architecture for a structured debate platform utilizing nested argument-tree data schemas in TypeScript with zero circular dependencies.',
      'Reinvested 100% of net proceeds into community outreach and philanthropic initiatives while maintaining lean inventory operations and transparent financial reporting.',
    ],
    skillsDemonstrated: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Recursive Tree Schemas',
      'Fiscal Allocation',
      'Operations Management',
    ],
    verifiedOutcome: 'Engineered nested argument-tree deliberation engine and directed company product roadmap.',
    projectSlugs: ['philocracy'],
  },
  {
    id: 'syntinuum',
    year: '2023–2025',
    period: 'Dec 2025 – Present',
    role: 'Host & Producer (Season 3)',
    company: 'Syntinuum Podcast',
    teamOrDivision: 'Engineering Conversations Series (Formerly Adapt)',
    location: 'Columbus, OH',
    classification: 'TECHNICAL JOURNALISM & SYSTEMS DIALOGUES',
    leadSummary:
      'Engineered and produce an engineering leadership podcast exploring system architecture, scaling dilemmas, and technical tradeoffs with startup founders, researchers, and executives.',
    bullets: [
      'Conducted long-form interviews with engineering founders, research scientists, and technology executives across healthcare, aerospace, and software.',
      'Grew listenership to over 100K+ combined cross-platform impressions across Spotify, Apple Podcasts, and YouTube through technical engineering journalism.',
      'Engineered a custom audio-streaming web platform with continuous playback and episode metadata parsing to support seamless listener discovery.',
    ],
    skillsDemonstrated: [
      'Technical Communication',
      'Audio Engineering',
      'React',
      'Next.js',
      'System Architecture Interviewing',
    ],
    verifiedOutcome: '10+ technical founder interviews produced; 100K+ impressions generated.',
    projectSlugs: ['syntinuum-podcast-website'],
  },
];

export const ScrollyExperience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const totalCount = experiences.length;

  const handleSelectIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  }, [totalCount]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  }, [totalCount]);

  // Keyboard navigation when user is on the section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const activeRecord = experiences[activeIndex] || experiences[0];

  return (
    <SectionContainer
      id="experience"
      variant="full"
      bgMode="clean"
      className="py-16 sm:py-20 lg:py-24 border-b border-[#F3EFE7]/[0.08]"
      aria-label="Experience & Proven Systems"
    >
      {/* 1. SECTION INTRO (Editorial Headline & Subtext) */}
      <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
        <div className="max-w-2xl space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#F3EFE7] leading-tight tracking-tight">
            Experience
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#A7B2C3] leading-relaxed">
            Autonomous software engineering, deep learning research, and mobility telematics delivered across enterprise workflows, collegiate diagnostics, and venture roadmaps.
          </p>
        </div>
      </div>

      {/* 2. HORIZONTAL CHICANE RACE TRACK (100vw Full-Bleed Spline & Top-Down DNA Aero Prototype) */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 mb-6 sm:mb-8">
        <ChicaneCircuitTrack
          items={experiences.map((exp) => ({
            id: exp.id,
            role: exp.role,
            company: exp.company,
            period: exp.period,
            year: exp.year,
          }))}
          activeIndex={activeIndex}
          onSelectIndex={handleSelectIndex}
        />
      </div>

      {/* 3. SYNCHRONIZED EXPERIENCE DOSSIER STAGE (Compact Swiss Architectural Stage) */}
      <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6">
        <ExperienceDossierStage
          record={activeRecord}
          currentIndex={activeIndex}
          totalCount={totalCount}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* 4. EDITORIAL TRANSITION INTO SELECTED WORKS */}
      <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 sm:pt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F3EFE7]/[0.08] mt-12">
        <div className="text-xs font-mono text-[#7A889B] uppercase tracking-wider">
          Verified Systems &amp; Benchmark Evidence
        </div>
        <a
          href="#projects"
          className="text-[#FF6B35] hover:text-[#F5D998] transition-colors inline-flex items-center gap-2 text-xs font-mono uppercase font-semibold"
        >
          <span>Explore Selected Engineering Case Studies</span>
          <span>↓</span>
        </a>
      </div>
    </SectionContainer>
  );
};

export default ScrollyExperience;
