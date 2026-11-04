import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { skillDomains, SkillDomain } from '@/content/skills';

const SkillGraphDemo = dynamic(
  () => import('@/setpieces/SkillGraphDemo').then((m) => m.SkillGraphDemo),
  { ssr: false }
);

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-2">
            Technical Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight">
            Evidence-Linked Skills
          </h2>
        </div>
        <p className="text-sm font-sans text-[#A6ADB8] max-w-md">
          Zero arbitrary percentage bars. Every listed technology links directly to a concrete codebase, case study, or research workflow.
        </p>
      </div>

      {/* Interactive Capability Graph (Sprint 2) */}
      <div className="mb-12">
        <SkillGraphDemo />
      </div>

      {/* 5 Recruiter-Aligned Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillDomains.map((domain: SkillDomain) => (
          <div
            key={domain.id}
            className="p-6 sm:p-7 rounded-3xl bg-[#0D1118]/80 border border-white/10 shadow-token-card hover:border-[#7DD3FC]/30 hover:shadow-token-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white tracking-tight">
                  {domain.title}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#A6ADB8] border border-white/10">
                  {domain.skills.length} skills
                </span>
              </div>

              <p className="text-xs font-sans text-[#A6ADB8] mb-6 leading-relaxed">
                {domain.description}
              </p>

              {/* Skills List */}
              <div className="space-y-3">
                {domain.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-sans font-semibold text-[#E0E0E0]">
                        {skill.name}
                      </span>
                      {skill.highlight && (
                        <span className="text-[10px] font-mono text-[#7DD3FC] px-1.5 py-0.5 rounded bg-[#7DD3FC]/10 border border-[#7DD3FC]/20">
                          {skill.highlight}
                        </span>
                      )}
                    </div>

                    {/* Proof Links */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      <span className="text-[#A6ADB8]/70">Proven in:</span>
                      {skill.provenBy.map((p, idx) => (
                        <Link
                          key={idx}
                          href={p.href}
                          className="text-[#D8B4FE] hover:text-white transition-colors underline decoration-dotted"
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-right">
              <span className="text-[10px] font-mono text-[#A6ADB8]">
                Verified against repository codebases
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default SkillsSection;

