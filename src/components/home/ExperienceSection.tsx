import React, { useState } from 'react';
import Link from 'next/link';
import { experiences, ExperienceRecord } from '@/content/experience';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export const ExperienceSection: React.FC = () => {
  const { mode } = usePortfolioStore();
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const isRecruiter = mode === 'recruiter';

  const toggleExpand = (id: string) => {
    if (isRecruiter) return; // Always keep all expanded in Recruiter Mode
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="experience" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-2">
            Professional Track Record
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
            Work & Research Experience
          </h2>
        </div>
        <p className="text-sm font-sans text-[#A6ADB8] max-w-md">
          Hands-on software engineering, deep learning research, and technical leadership backed by measurable outcomes.
        </p>
      </div>

      {/* Chronological Timeline */}
      <div className="relative border-l border-white/10 ml-2 sm:ml-4 pl-6 sm:pl-8 space-y-10 sm:space-y-12">
        {experiences.map((exp: ExperienceRecord) => {
          const isOpen = isRecruiter || expandedId === exp.id;

          return (
            <div key={exp.id} className="relative group">
              
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${
                  isOpen
                    ? 'border-[#7DD3FC] bg-[#050505] shadow-[0_0_10px_rgba(125,211,252,0.5)]'
                    : 'border-white/20 bg-[#050505] group-hover:border-white/40'
                }`}
              />

              {/* Experience Card */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                  isOpen
                    ? 'bg-[#0D1118] border-[#7DD3FC]/40 shadow-token-card-hover'
                    : 'bg-[#0D1118]/60 border-white/5 hover:border-white/20 hover:bg-[#0D1118]/80'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(exp.id)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isRecruiter ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[#7DD3FC] font-semibold">
                        {exp.period}
                      </span>
                      <span className="text-xs font-mono text-[#A6ADB8]">·</span>
                      <span className="text-xs font-mono text-[#A6ADB8]">{exp.location}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#E0E0E0] border border-white/10">
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="text-sm sm:text-base font-sans text-[#E0E0E0]/90 font-medium">
                      {exp.company}
                      {exp.teamOrDivision && (
                        <span className="text-[#A6ADB8] font-normal"> — {exp.teamOrDivision}</span>
                      )}
                    </p>
                  </div>

                  {!isRecruiter && (
                    <button
                      type="button"
                      aria-label={isOpen ? 'Collapse role details' : 'Expand role details'}
                      className="self-start sm:self-center text-xs font-mono text-[#7DD3FC] px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0"
                    >
                      {isOpen ? 'Close' : 'Details →'}
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in duration-200">
                    {/* Outcome Bullets */}
                    <ul className="space-y-3 mb-6">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base font-sans text-[#E0E0E0] leading-relaxed">
                          <span className="text-[#7DD3FC] font-mono text-base select-none shrink-0 mt-0.5">▹</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Skills & Verified Project Cross-Links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-mono text-[#A6ADB8] mr-2">Skills:</span>
                        {exp.skillsDemonstrated.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[#E0E0E0]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {exp.projectSlugs && exp.projectSlugs.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[#A6ADB8]">Related:</span>
                          {exp.projectSlugs.map((slug) => (
                            <Link
                              key={slug}
                              href={`/projects/${slug}`}
                              className="text-xs font-mono text-[#7DD3FC] hover:underline"
                            >
                              /{slug}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default ExperienceSection;

