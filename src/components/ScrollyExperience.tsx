import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useScroll } from 'framer-motion';
import { ThemeSection } from './ThemeSection';
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
    company: 'Syntinuum Podcast & VECTOR Syndicate',
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Keyboard navigation when user is focused on the section
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

  // Scroll tracking to guide car across chicanes as user scrolls through section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.7', 'end 0.3'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const targetIndex = Math.min(
        totalCount - 1,
        Math.max(0, Math.floor(latest * totalCount))
      );
      setActiveIndex(targetIndex);
    });
  }, [scrollYProgress, totalCount]);

  const activeRecord = experiences[activeIndex] || experiences[0];

  return (
    <ThemeSection
      id="experience"
      theme="telemetry-slate"
      carbonType="woven"
      carbonOpacity={0.25}
      aria-label="Experience & Proven Systems Horizontal Grand Prix Chicane"
      className="border-b border-[#F1F5F9]/10 flex flex-col justify-between"
    >
      <div ref={containerRef} className="w-full flex flex-col my-auto space-y-8 sm:space-y-12">
        
        {/* 1. SECTION INTRO (Editorial Headline & Subtext) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#10B981]">
              <span className="w-6 h-px bg-[#10B981]" />
              <span>02  Experience &amp; Autonomous Systems</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F1F5F9] leading-tight tracking-tight">
              Horizontal Chicane Circuit
            </h2>
            <p className="text-base sm:text-lg font-sans text-[#64748B] leading-relaxed">
              Steer through 5 engineering sectors across enterprise serverless, digital pathology AI, and connected-vehicle mobility telematics.
            </p>
          </div>

          {/* Pit-Wall Status Tag */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#A7B2C3] shrink-0">
            <span className="px-3 py-1.5 bg-[#0C121E] border border-[#10B981]/30 rounded-[2px] text-[#10B981] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>LIVE TELEMETRY TRACK [5 SECTORS]</span>
            </span>
          </div>
        </div>

        {/* 2. FULL-BLEED HORIZONTAL CHICANE RACE TRACK WITH AERO PROTOTYPE CAR */}
        <div className="w-screen -ml-[4vw] md:-ml-[6vw] xl:-ml-[7vw] relative border-y border-[#F1F5F9]/10 bg-[#060A10]/95 shadow-2xl overflow-hidden">
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

        {/* 3. SYNCHRONIZED PIT-WALL EXPERIENCE DOSSIER STAGE */}
        <div className="w-full">
          <ExperienceDossierStage
            record={activeRecord}
            currentIndex={activeIndex}
            totalCount={totalCount}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        {/* 4. EDITORIAL TRANSITION INTO SELECTED WORKS */}
        <div className="w-full pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#F1F5F9]/10 text-xs font-mono">
          <div className="text-[#64748B] uppercase tracking-wider">
            Verified Systems &amp; Benchmark Evidence
          </div>
          <Link
            href="#projects"
            className="text-[#10B981] hover:text-[#38BDF8] transition-colors inline-flex items-center gap-2 uppercase font-semibold"
          >
            <span>Explore 18-System Engineering Field</span>
            <span>↓</span>
          </Link>
        </div>

      </div>
    </ThemeSection>
  );
};

export default ScrollyExperience;
