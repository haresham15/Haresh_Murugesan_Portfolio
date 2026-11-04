import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridCrosshair } from './ui/GridCrosshair';

const MotionDiv = motion.div as any;

interface ExperienceItem {
  id: string;
  index: string;
  year: string;
  period: string;
  role: string;
  company: string;
  division?: string;
  classification: string;
  category: 'Employment' | 'Research' | 'Leadership' | 'Podcast';
  contextSentence: string;
  bullets: [string, string];
  expandedBullets?: string[];
  stack: string[];
  verifiedOutcome: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'cas',
    index: '01 / 05',
    year: '2026',
    period: 'May 2026 – Aug 2026',
    role: 'Technology Intern — Systems & Software Engineering',
    company: 'Chemical Abstracts Service (CAS)',
    division: 'DA&I Division, ACE Team',
    classification: 'INDUSTRY SOFTWARE & SYSTEMS',
    category: 'Employment',
    contextSentence: 'Engineered serverless microservices and high-throughput data pipelines for enterprise scientific research retrieval across 12 distinct data use cases.',
    bullets: [
      'Architected resilient AWS infrastructure (S3, DynamoDB, Lambda) to parse and index high-volume chemical research metadata with sub-second retrieval.',
      'Authored C4 model system architecture diagrams and standardized trunk-based CI/CD pipelines enforcing strict schema validation.',
    ],
    expandedBullets: [
      'Standardized AWS IAM least-privilege security policies and CloudWatch alarms across microservices.',
      'Partnered directly with principal data architects to map enterprise data ingestion topologies.',
    ],
    stack: ['AWS Lambda', 'DynamoDB', 'S3', 'Python', 'TypeScript', 'C4 Architecture'],
    verifiedOutcome: 'Delivered 12 serverless workflows processing scientific research datasets with sub-second retrieval.',
  },
  {
    id: 'osu-research',
    index: '02 / 05',
    year: '2026',
    period: 'June 2026 – Present',
    role: 'Undergraduate Research Assistant — Computer Vision & Digital Pathology',
    company: 'The Ohio State University',
    division: 'Digital Pathology & Clinical Diagnostics Lab',
    classification: 'ACADEMIC AI/ML RESEARCH',
    category: 'Research',
    contextSentence: 'Building computer vision segmentation pipelines and image-processing algorithms for automated histological feature extraction and clinical boundary identification.',
    bullets: [
      'Developed computer vision segmentation pipelines reducing false-positive boundary artifacts across clinical image benchmarks.',
      'Implemented custom evaluation scripts calculating Dice coefficient and intersection-over-union (IoU) metrics against board-certified pathologist ground-truth annotations.',
    ],
    expandedBullets: [
      'Evaluated measurement reproducibility across clinical image benchmarks under varying stain intensity distributions.',
    ],
    stack: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'Computer Vision'],
    verifiedOutcome: 'Automated tissue feature extraction pipelines with rigorous cross-validated benchmark evaluations.',
  },
  {
    id: 'honda-99p',
    index: '03 / 05',
    year: '2025',
    period: 'May 2025 – Present',
    role: 'Innovation Analyst Intern',
    company: 'Honda Research Institute / 99P Labs',
    division: 'Connected Mobility Data Accelerator',
    classification: 'CONNECTED VEHICLE TELEMATICS',
    category: 'Employment',
    contextSentence: 'Analyzed connected-vehicle telemetry datasets to identify fleet mobility edge cases and spatial energy consumption dynamics.',
    bullets: [
      'Built and evaluated 1,000+ data models and spatial visualizations across connected-vehicle telemetry datasets in the 99P Labs developer ecosystem.',
      'Identified fleet telematics edge cases and synthesized actionable mobility insights presented directly to senior research leadership.',
    ],
    expandedBullets: [
      'Created geospatial heatmaps analyzing urban route congestion and EV battery depletion rates under varying ambient temperatures.',
    ],
    stack: ['Python', 'Pandas', 'Spatial Telemetry', 'Data Modeling', 'Geospatial Analysis'],
    verifiedOutcome: '1,000+ telemetry models developed; strategic findings presented to Honda Research leadership.',
  },
  {
    id: 'philocracy',
    index: '04 / 05',
    year: '2024',
    period: '2024 – 2025',
    role: 'CEO & Director of Finances',
    company: 'Philocracy',
    division: 'Structured Deliberation Platform',
    classification: 'PRODUCT ARCHITECTURE & GOVERNANCE',
    category: 'Leadership',
    contextSentence: 'Led product engineering and operational roadmap for an online debate platform modeling complex philosophical arguments.',
    bullets: [
      'Directed engineering architecture for a structured debate platform utilizing nested argument-tree data schemas in TypeScript.',
      'Managed financial allocation and operational budgets while leading full-lifecycle frontend and API development using Next.js and Tailwind CSS.',
    ],
    expandedBullets: [
      'Designed cycle-free recursive graph schemas ensuring reliable argument traversal and zero circular dependencies.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Tree Schemas'],
    verifiedOutcome: 'Engineered nested argument-tree deliberation engine and directed company product roadmap.',
  },
  {
    id: 'syntinuum',
    index: '05 / 05',
    year: '2023',
    period: 'August 2023 – Present',
    role: 'Founder & Host',
    company: 'Syntinuum: Endless Evolutions Podcast',
    division: 'Engineering Conversations Series',
    classification: 'TECHNICAL JOURNALISM & SYSTEMS DIALOGUES',
    category: 'Podcast',
    contextSentence: 'Producing and hosting technical dialogues exploring architectural systems, algorithmic research, and startup engineering trade-offs.',
    bullets: [
      'Conducted 10+ long-form interviews with engineering founders, research scientists, and technology executives across healthcare, aerospace, and software.',
      'Reached 100K+ combined impressions across Spotify, Apple Podcasts, and YouTube through technical engineering journalism.',
    ],
    expandedBullets: [
      'Researched and authored technical discussion briefs dissecting distributed consensus, microservice decoupling, and biomedical regulatory requirements.',
    ],
    stack: ['Audio Engineering', 'Technical Journalism', 'Systems Research', 'Founder Dialogues'],
    verifiedOutcome: '10+ technical founder interviews produced; 100K+ impressions generated.',
  },
];

export const ScrollyExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleScroll = () => {
      const rows = document.querySelectorAll('.experience-bay');
      const viewportCenter = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDiff = Infinity;

      rows.forEach((row, idx) => {
        const rect = row.getBoundingClientRect();
        const diff = Math.abs(rect.top - viewportCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeItem = experiences[activeIndex] || experiences[0];

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full border-b border-[#F4EFE6]/10 bg-[#07090D]"
      aria-label="Experience and verified research engineering history"
    >
      {/* Precision Corner Crosshair */}
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* 12-Column Split-Screen Vernier Blueprint Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* LEFT STICKY VERNIER RAIL (Cols 1–4, Desktop) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#F4EFE6]/10 p-6 sm:p-8 lg:p-12 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#07090D]/95 z-10">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
              <span className="text-[#FFB86C] font-semibold">02 // VERIFIED TELEMETRY</span>
              <span className="tabular-nums">{activeItem.index}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F4EFE6] leading-none tracking-tight">
              Experience
            </h2>

            <p className="text-sm font-sans text-[#9BA8B8] leading-relaxed pt-2">
              Engineering internships, collegiate artificial intelligence research, and executive product leadership grounded in verified deliverables.
            </p>
          </div>

          {/* Live Mechanical Vernier Scale & Dynamic Focal Readout */}
          <div className="space-y-6 pt-8 border-t border-[#F4EFE6]/10">
            {/* Monumental Year Display */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#8A99AD] uppercase block tracking-wider">
                CHRONO DATUM //
              </span>
              <div className="text-5xl lg:text-6xl font-serif text-[#FFB86C] tabular-nums font-normal">
                {activeItem.year}
              </div>
              <div className="text-xs font-mono text-[#F4EFE6] tracking-wider uppercase pt-1">
                {activeItem.classification}
              </div>
            </div>

            {/* Vernier Millimeter Tick Track */}
            <div className="w-full flex items-center justify-between gap-1 pt-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const isSelected = Math.floor((i / 24) * experiences.length) === activeIndex;
                const isMajor = i % 6 === 0;
                return (
                  <div
                    key={i}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'w-[2px] h-7 bg-[#FF6B2B] shadow-[0_0_8px_#FF6B2B]'
                        : isMajor
                        ? 'w-[1.5px] h-5 bg-[#F4EFE6]/40'
                        : 'w-[1px] h-3 bg-[#F4EFE6]/15'
                    }`}
                  />
                );
              })}
            </div>

            <div className="text-[11px] font-mono text-[#8A99AD] flex justify-between pt-1">
              <span>00 START (2023)</span>
              <span className="text-[#FFB86C]">ACTIVE (2026)</span>
            </div>
          </div>

        </div>

        {/* RIGHT SCRUBBED EVIDENCE STREAM (Cols 5–12) */}
        <div className="lg:col-span-8 divide-y divide-[#F4EFE6]/10">
          {experiences.map((exp, idx) => {
            const isCurrentFocus = activeIndex === idx;
            const isExpanded = expandedId === exp.id;

            return (
              <div
                key={exp.id}
                className={`experience-bay py-12 lg:py-16 px-6 sm:px-10 lg:px-14 transition-colors duration-300 relative ${
                  isCurrentFocus ? 'bg-[#0C1729]/35' : 'hover:bg-[#0C1729]/20'
                }`}
              >
                {/* 1px Specular Catchlight when focused */}
                {isCurrentFocus && (
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB86C] to-transparent pointer-events-none" />
                )}

                <div className="space-y-6">
                  {/* Top Gutter: Company & Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F4EFE6]/10 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#F4EFE6] tracking-tight">
                        {exp.company}
                      </h3>
                      {exp.division && (
                        <div className="text-xs font-mono text-[#8A99AD]">
                          {exp.division}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-mono text-[#FFB86C] tabular-nums sm:text-right shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  {/* Role Title */}
                  <div className="text-sm sm:text-base font-mono text-[#70A5FF]">
                    {exp.role}
                  </div>

                  {/* Bold Context Sentence */}
                  <p className="text-[17px] sm:text-[18px] font-sans text-[#F4EFE6] leading-[1.65]">
                    {exp.contextSentence}
                  </p>

                  {/* Concrete Evidence Bullets */}
                  <ul className="space-y-3 text-[15px] sm:text-[16px] font-sans text-[#9BA8B8] leading-[1.7]">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <span className="text-[#FF6B2B] text-sm select-none font-mono mt-0.5">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Architecture & Outcomes Expandable Drawer */}
                  {exp.expandedBullets && exp.expandedBullets.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleExpand(exp.id)}
                        className="text-xs font-mono text-[#FFB86C] hover:text-[#FFE9AE] inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none py-1"
                        aria-expanded={isExpanded}
                      >
                        <span>{isExpanded ? '[ − CLOSE ARCHITECTURAL SPECIFICATION ]' : '[ + INSPECT ARCHITECTURE & OUTCOMES ]'}</span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <MotionDiv
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden pt-4 space-y-2.5 text-[14px] font-sans text-[#C4CDD8] pl-4 border-l border-[#FF6B2B]/40 my-3"
                          >
                            {exp.expandedBullets.map((eb, ebIdx) => (
                              <div key={ebIdx}>
                                <span>{eb}</span>
                              </div>
                            ))}
                            <div className="text-xs font-mono text-[#FFB86C] pt-2">
                              VERIFIED BENCHMARK: {exp.verifiedOutcome}
                            </div>
                          </MotionDiv>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Inline Middle-Dot Tech Stack (BAN Cramped Pills) */}
                  <div className="pt-3 border-t border-[#F4EFE6]/10 text-xs font-mono text-[#8A99AD] flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="text-[#FF6B2B] font-semibold uppercase tracking-wider text-[11px]">STACK //</span>
                    {exp.stack.map((tech, tIdx) => (
                      <React.Fragment key={tIdx}>
                        <span className="hover:text-[#F4EFE6] transition-colors">{tech}</span>
                        {tIdx < exp.stack.length - 1 && <span className="text-[#F4EFE6]/25 select-none">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ScrollyExperience;
