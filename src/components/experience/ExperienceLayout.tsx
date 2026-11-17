import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ExperienceRecord, experiences } from '@/content/experience';
import { getProjectBySlug } from '@/content/projects';
import Header from '@/components/Header';
import ContactFooter from '@/components/ContactFooter';
import ForgedCarbonCanvas from '@/components/ForgedCarbonCanvas';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { GridCrosshair } from '@/components/ui/EditorialPrimitives';

export interface ExperienceNavNeighbor {
  id: string;
  company: string;
  role: string;
}

interface ExperienceLayoutProps {
  experience: ExperienceRecord;
  prev?: ExperienceNavNeighbor | null;
  next?: ExperienceNavNeighbor | null;
}

export const ExperienceLayout: React.FC<ExperienceLayoutProps> = ({ experience, prev, next }) => {
  const currentIndex = experiences.findIndex((e) => e.id === experience.id);
  const sectorNumber = String(currentIndex + 1).padStart(2, '0');
  const totalSectors = String(experiences.length).padStart(2, '0');

  const relatedProjects = (experience.projectSlugs || [])
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Role',
    roleName: experience.role,
    startDate: experience.startDate,
    endDate: experience.endDate === 'Present' ? new Date().toISOString().split('T')[0] : experience.endDate,
    description: experience.executiveSummary || experience.bullets.join(' '),
    location: {
      '@type': 'Place',
      name: experience.location,
    },
    worksFor: {
      '@type': 'Organization',
      name: experience.company,
      department: experience.teamOrDivision,
    },
    employee: {
      '@type': 'Person',
      name: 'Haresh Murugesan',
      url: 'https://www.hareshmurugesan.com',
    },
  };

  return (
    <>
      <Head>
        <title>{`${experience.role} @ ${experience.company} | Haresh Murugesan`}</title>
        <meta
          name="description"
          content={experience.executiveSummary || experience.bullets[0]}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`https://www.hareshmurugesan.com/experience/${experience.id}`} />
        <meta property="og:title" content={`${experience.role} @ ${experience.company} | Haresh Murugesan`} />
        <meta property="og:description" content={experience.executiveSummary || experience.bullets[0]} />
        <meta property="og:url" content={`https://www.hareshmurugesan.com/experience/${experience.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${experience.role} @ ${experience.company} | Haresh Murugesan`} />
        <meta name="twitter:description" content={experience.executiveSummary || experience.bullets[0]} />
        <meta name="twitter:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>

      <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-hidden flex flex-col justify-between selection:bg-[#FF2800] selection:text-[#03050A] relative">
        <ForgedCarbonCanvas />
        <Header />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-24 relative z-10">
          
          {/* 1. TOP BREADCRUMB & SECTOR QUICK JUMP BAR */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 pb-6 mb-8 border-b border-[#18458B]/20 text-xs font-mono text-[#7E8B9B]">
            <div className="flex items-center gap-2">
              <Link
                href="/#experience"
                className="inline-flex items-center gap-1.5 text-[#F4F6F9] hover:text-[#FF2800] transition-colors"
              >
                <span aria-hidden="true">←</span>
                <span>Experience circuit</span>
              </Link>
              <span className="text-[#C8D2E0]/25">/</span>
              <span className="text-[#FF2800] font-semibold">Sector {sectorNumber}</span>
              <span className="text-[#C8D2E0]/25">/</span>
              <span className="truncate max-w-[200px] sm:max-w-none text-[#C8D2E0]">{experience.shortCompany || experience.company}</span>
            </div>

            {/* Quick Sector Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-[#7E8B9B] hidden sm:inline mr-1">Sectors:</span>
              {experiences.map((exp, idx) => {
                const isCurrent = exp.id === experience.id;
                return (
                  <Link
                    key={exp.id}
                    href={`/experience/${exp.id}`}
                    className={`px-2 py-0.5 rounded-[2px] text-[11px] font-mono transition-colors ${
                      isCurrent
                        ? 'bg-[#FF2800] text-[#03050A] font-semibold'
                        : 'bg-[#060A12] border border-[#18458B]/30 text-[#7E8B9B] hover:text-[#F4F6F9] hover:border-[#18458B]/60'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 2. HERO DOSSIER HEADER (Swiss Zero-Box Blueprint) */}
          <section className="p-6 sm:p-10 lg:p-12 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/30 backdrop-blur-md relative shadow-2xl mb-12">
            <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
            <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />
            <GridCrosshair className="absolute -bottom-[4.5px] -left-[4.5px]" />
            <GridCrosshair className="absolute -bottom-[4.5px] -right-[4.5px]" />

            <div className="space-y-6">
              {/* Sector Datum Tag */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono text-[#FF2800] font-semibold">
                  Sector {sectorNumber} of {totalSectors}
                </span>
                <span className="text-[#7E8B9B]">·</span>
                <span className="px-2.5 py-0.5 text-xs font-mono text-[#2563EB] bg-[#0B1E40]/50 border border-[#18458B]/40 rounded-[2px]">
                  {experience.type}
                </span>
                {experience.outcome && (
                  <span className="px-2.5 py-0.5 text-xs font-mono text-[#4CC38A] bg-[#4CC38A]/10 border border-[#4CC38A]/30 rounded-[2px] tabular-nums">
                    {experience.outcome}
                  </span>
                )}
              </div>

              {/* Company & Role Headings */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F6F9] tracking-tight leading-[1.08]">
                  {experience.company}
                </h1>
                <p className="text-lg sm:text-2xl font-serif italic text-[#FF4419] mt-2.5 leading-snug">
                  {experience.role}
                </p>
                {experience.teamOrDivision && (
                  <p className="text-sm font-sans text-[#7E8B9B] mt-1">
                    {experience.teamOrDivision}
                  </p>
                )}
              </div>

              {/* Tenet Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#18458B]/20 divide-x divide-y sm:divide-y-0 divide-[#18458B]/20 bg-[#03050A]/60 rounded-[2px] text-xs font-mono">
                <div className="p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] text-[#7E8B9B] block">Tenure</span>
                  <span className="text-[#F4F6F9] font-medium block">{experience.period}</span>
                </div>
                <div className="p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] text-[#7E8B9B] block">Location</span>
                  <span className="text-[#F4F6F9] font-medium block">{experience.location}</span>
                </div>
                <div className="p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] text-[#7E8B9B] block">Discipline</span>
                  <span className="text-[#2563EB] font-medium block">{experience.type}</span>
                </div>
                <div className="p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] text-[#7E8B9B] block">Competencies</span>
                  <span className="text-[#C8D2E0] font-medium block">{experience.skillsDemonstrated.length} Verified</span>
                </div>
              </div>

              {/* Executive Summary */}
              {experience.executiveSummary && (
                <div className="pt-4 border-t border-[#18458B]/20">
                  <p className="text-base sm:text-lg font-sans text-[#C8D2E0] leading-relaxed max-w-4xl font-normal">
                    {experience.executiveSummary}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* 3. DETAILED TECHNICAL WORKSTREAMS */}
          {experience.keyWorkstreams && experience.keyWorkstreams.length > 0 && (
            <section className="mb-14 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#18458B]/20">
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#F4F6F9] tracking-tight">
                  Technical Workstreams &amp; Architecture
                </h2>
                <span className="text-xs font-mono text-[#7E8B9B]">
                  {experience.keyWorkstreams.length} Core Areas
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {experience.keyWorkstreams.map((ws, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-[2px] bg-[#060A12]/80 border border-[#18458B]/25 hover:border-[#18458B]/50 transition-colors flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#FF2800]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800]" />
                        <span>Workstream {idx + 1}</span>
                      </div>
                      <h3 className="text-xl font-serif text-[#F4F6F9] leading-snug">
                        {ws.title}
                      </h3>
                      <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed">
                        {ws.description}
                      </p>

                      <div className="pt-2">
                        <span className="text-[11px] font-mono text-[#C8D2E0] block mb-2 font-medium">Deliverables:</span>
                        <ul className="space-y-2 text-xs font-sans text-[#A7B2C3] leading-relaxed">
                          {ws.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-[#FF2800] select-none font-mono text-xs pt-0.5">―</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {ws.stack && (
                      <div className="pt-3 border-t border-[#18458B]/20 flex flex-wrap gap-1.5 text-[11px] font-mono text-[#2563EB]">
                        {ws.stack.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 bg-[#0B1E40]/30 border border-[#18458B]/20 rounded-[2px]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. VERIFIED DELIVERABLES & BENCHMARK OUTCOMES */}
          <section className="mb-14 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#18458B]/20">
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#F4F6F9] tracking-tight">
                Verified Deliverables &amp; Outcomes
              </h2>
              <span className="text-xs font-mono text-[#4CC38A]">Empirical Evidence</span>
            </div>

            {/* Metrics Grid */}
            {experience.verifiedOutcomes && experience.verifiedOutcomes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {experience.verifiedOutcomes.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-5 rounded-[2px] bg-[#060A12]/90 border border-[#18458B]/25 space-y-1.5"
                  >
                    <div className="text-xs font-mono text-[#7E8B9B]">{metric.label}</div>
                    <div className="text-3xl font-raleway font-bold text-[#FF2800] tabular-nums">
                      {metric.metric}
                    </div>
                    <p className="text-xs font-sans text-[#C8D2E0]/80 leading-relaxed pt-1">
                      {metric.context}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Bullet List from Core Dossier */}
            <div className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/70 border border-[#18458B]/20 space-y-3">
              <span className="text-xs font-mono text-[#7E8B9B] block mb-2">Charter Achievements:</span>
              <ul className="space-y-3">
                {experience.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base font-sans text-[#F4F6F9]/90 leading-relaxed">
                    <span className="text-[#FF2800] select-none font-mono text-sm pt-0.5">―</span>
                    <span className="max-w-4xl">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Evidence Registry Badge */}
              {experience.evidenceIds && experience.evidenceIds.length > 0 && (
                <div className="pt-4 mt-4 border-t border-[#18458B]/20 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono text-[#7E8B9B]">Ground-Truth Evidence:</span>
                  {experience.evidenceIds.map((eid) => (
                    <EvidenceBadge key={eid} evidenceId={eid} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 5. RELATED CASE STUDIES & CROSS-LINKS */}
          {relatedProjects.length > 0 && (
            <section className="mb-14 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#18458B]/20">
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#F4F6F9] tracking-tight">
                  Related Systems &amp; Case Studies
                </h2>
                <span className="text-xs font-mono text-[#2563EB]">
                  {relatedProjects.length} Architectural Deep-Dives
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedProjects.map((proj) => (
                  <Link
                    key={proj.slug}
                    href={`/projects/${proj.slug}`}
                    className="p-6 rounded-[2px] bg-[#060A12]/80 border border-[#18458B]/25 hover:border-[#FF2800] hover:bg-[#0B1E40]/20 transition-all group block space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#2563EB]">{proj.category}</span>
                      <span className="text-[#FF2800] group-hover:translate-x-1 transition-transform">
                        Case study →
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-[#7E8B9B] line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="pt-2 text-xs font-mono text-[#C8D2E0]/60">
                      {proj.stack}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 6. COMPETENCIES & METHODOLOGIES */}
          <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack */}
            <div className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/80 border border-[#18458B]/25 space-y-3">
              <h3 className="text-lg font-serif text-[#F4F6F9]">Technologies &amp; Tooling</h3>
              <p className="text-xs font-sans text-[#7E8B9B] mb-3">
                Specific tools, libraries, and frameworks leveraged during this tenure:
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {experience.skillsDemonstrated.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#03050A] border border-[#18458B]/30 text-[#C8D2E0] rounded-[2px]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Methodologies */}
            {experience.methodologies && (
              <div className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/80 border border-[#18458B]/25 space-y-3">
                <h3 className="text-lg font-serif text-[#F4F6F9]">Engineering Methodologies</h3>
                <p className="text-xs font-sans text-[#7E8B9B] mb-3">
                  Operational practices and systemic disciplines enforced:
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {experience.methodologies.map((method) => (
                    <span
                      key={method}
                      className="px-2.5 py-1 bg-[#0B1E40]/30 border border-[#2563EB]/40 text-[#82B7FF] rounded-[2px]"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 7. STRATEGIC PERSPECTIVE / REFLECTION */}
          {experience.reflection && (
            <section className="mb-14 p-6 sm:p-8 rounded-[2px] bg-[#060A12]/95 border-l-2 border-l-[#FF2800] border-y border-r border-[#18458B]/25">
              <div className="text-xs font-mono text-[#FF2800] mb-2 font-medium">
                Engineering takeaway:
              </div>
              <blockquote className="font-serif italic text-base sm:text-lg text-[#F4F6F9] leading-relaxed">
                &ldquo;{experience.reflection}&rdquo;
              </blockquote>
            </section>
          )}

          {/* 8. SECTOR PAGER NAVIGATION */}
          {(prev || next) && (
            <nav
              aria-label="Experience sector navigation"
              className="pt-8 border-t border-[#18458B]/20 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans"
            >
              {prev ? (
                <Link
                  href={`/experience/${prev.id}`}
                  className="group flex flex-col gap-1.5 p-4 rounded-[2px] bg-[#060A12] border border-[#18458B]/25 hover:border-[#FF2800] transition-colors"
                >
                  <span className="font-mono text-[#7E8B9B] text-[11px] flex items-center gap-1">
                    <span>← Previous sector</span>
                  </span>
                  <span className="font-serif text-lg text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors">
                    {prev.company}
                  </span>
                  <span className="text-xs text-[#7E8B9B]">{prev.role}</span>
                </Link>
              ) : (
                <div />
              )}

              {next && (
                <Link
                  href={`/experience/${next.id}`}
                  className="group flex flex-col gap-1.5 p-4 rounded-[2px] bg-[#060A12] border border-[#18458B]/25 hover:border-[#FF2800] transition-colors sm:items-end sm:text-right"
                >
                  <span className="font-mono text-[#7E8B9B] text-[11px] flex items-center gap-1">
                    <span>Next sector →</span>
                  </span>
                  <span className="font-serif text-lg text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors">
                    {next.company}
                  </span>
                  <span className="text-xs text-[#7E8B9B]">{next.role}</span>
                </Link>
              )}
            </nav>
          )}

        </main>

        <ContactFooter />
      </div>
    </>
  );
};

export default ExperienceLayout;
