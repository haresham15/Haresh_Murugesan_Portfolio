import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Project, EngineeringTradeoff } from '@/content/projects';
import Header from '@/components/Header';
import ContactFooter from '@/components/ContactFooter';
import ForgedCarbonCanvas from '@/components/ForgedCarbonCanvas';
import { EvidenceBadge } from '@/components/ui/EvidenceBadge';
import { C4DiagramViewer } from './C4DiagramViewer';

const ApexisDemo = dynamic(() => import('@/setpieces/ApexisDemo').then((m) => m.ApexisDemo), { ssr: false });
const HealiosDemo = dynamic(() => import('@/setpieces/HealiosDemo').then((m) => m.HealiosDemo), { ssr: false });
const TempoDemo = dynamic(() => import('@/setpieces/TempoDemo').then((m) => m.TempoDemo), { ssr: false });
const RouteRxDemo = dynamic(() => import('@/setpieces/RouteRxDemo').then((m) => m.RouteRxDemo), { ssr: false });

interface CaseStudyLayoutProps {
  project: Project;
}

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({ project }) => {
  const { caseStudy } = project;
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopySummary = async () => {
    const summaryMarkdown = `# ${project.title}
**Role:** ${project.role} (${project.year})
**Tech Stack:** ${project.stack}

## Executive Summary
${project.caseStudy.executiveSummary}

## Key Metrics
${project.caseStudy.metrics.map((m) => `- **${m.label}:** ${m.value} (${m.detail})`).join('\n')}

Read full case study: https://hareshmurugesan.com/projects/${project.slug}`;

    try {
      await navigator.clipboard.writeText(summaryMarkdown);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    } catch {
      window.prompt('Copy Summary:', summaryMarkdown);
    }
  };

  const sections = [
    { id: 'summary', label: 'Executive Summary' },
    { id: 'problem', label: 'Problem & Constraints' },
    { id: 'architecture', label: 'System Architecture' },
    { id: 'tradeoffs', label: 'Engineering Decisions' },
    { id: 'evaluation', label: 'Evaluation & Metrics' },
    { id: 'contribution', label: 'Personal Contribution' },
    { id: 'limitations', label: 'Limitations & Next Steps' },
  ];

  const jsonLdProject = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `https://hareshmurugesan.com/projects/${project.slug}#article`,
        headline: project.title,
        description: project.caseStudy.executiveSummary,
        author: {
          '@type': 'Person',
          name: 'Haresh Murugesan',
          url: 'https://hareshmurugesan.com',
        },
        publisher: {
          '@type': 'Person',
          name: 'Haresh Murugesan',
        },
        mainEntityOfPage: `https://hareshmurugesan.com/projects/${project.slug}`,
        datePublished: `${project.year}-01-01T00:00:00Z`,
      },
      {
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        applicationCategory: 'Engineering / Software Application',
        operatingSystem: 'Cross-platform / Web',
        author: {
          '@type': 'Person',
          name: 'Haresh Murugesan',
        },
        softwareRequirements: project.stack,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://hareshmurugesan.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: 'https://hareshmurugesan.com/#projects',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `https://hareshmurugesan.com/projects/${project.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{`${project.title} | Haresh Murugesan`}</title>
        <meta name="description" content={project.caseStudy.executiveSummary} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`https://hareshmurugesan.com/projects/${project.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${project.title} | Haresh Murugesan`} />
        <meta property="og:description" content={project.caseStudy.executiveSummary} />
        <meta property="og:url" content={`https://hareshmurugesan.com/projects/${project.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://hareshmurugesan.com${project.image || '/profile.jpeg'}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.title} | Haresh Murugesan`} />
        <meta name="twitter:description" content={project.caseStudy.executiveSummary} />
        <meta name="twitter:image" content={`https://hareshmurugesan.com${project.image || '/profile.jpeg'}`} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProject) }}
        />
      </Head>

      <div className="min-h-screen bg-[#03050A] text-[#F4F6F9] selection:bg-[#FF2800] selection:text-[#03050A] relative">
        <ForgedCarbonCanvas />
        <Header />

        <main id="main-content" className="pt-24 pb-20 relative z-10">
          
          {/* CASE STUDY HEADER & BREADCRUMBS */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-xs font-mono text-[#7E8B9B] mb-6">
              <Link href="/" className="hover:text-[#FF2800] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#projects" className="hover:text-[#FF2800] transition-colors">Projects</Link>
              <span>/</span>
              <span className="text-[#FF2800] truncate">{project.slug}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-[2px] bg-[#0B1E40]/50 text-[#2563EB] border border-[#18458B]/30">
                {project.category}
              </span>
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-[2px] bg-[#060A12] border border-[#18458B]/25 text-[#FF2800]">
                {project.statusBadge}
              </span>
              <span className="text-xs font-mono text-[#7E8B9B] ml-auto">
                {project.year} • {project.role}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-raleway font-extrabold text-[#F4F6F9] tracking-tight leading-[1.1] mb-6">
              {project.title}
            </h1>

            {/* QUICK ACTIONS BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[2px] bg-[#060A12]/80 border border-[#18458B]/25 mb-8 backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-[2px] bg-[#FF2800] text-[#03050A] font-sans font-semibold text-xs hover:bg-[#C8D2E0] transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,40,0,0.3)]"
                  >
                    <span>Open Live System</span>
                    <span>↗</span>
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-[2px] bg-[#060A12] border border-[#18458B]/30 text-[#F4F6F9] font-sans font-medium text-xs hover:border-[#FF2800] transition-colors flex items-center gap-1.5"
                  >
                    <span>View Repository</span>
                    <span>↗</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/30 text-xs font-mono text-[#7E8B9B] hover:text-[#F4F6F9] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{copiedSummary ? '✓ Copied Summary' : 'Copy Recruiter Summary'}</span>
              </button>
            </div>

            {/* HERO IMAGE */}
            {project.image && (
              <div className="w-full aspect-[21/9] max-h-[460px] rounded-[2px] overflow-hidden border border-[#18458B]/30 bg-[#060A12] relative mb-12 shadow-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>

          {/* MAIN TWO-COLUMN CONTENT AREA */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* STICKY DESKTOP SECTION NAV (3 cols) */}
              <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-2 p-4 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm">
                <p className="text-xs font-mono uppercase tracking-wider text-[#7E8B9B] mb-3 px-2">
                  Sections
                </p>
                <nav className="flex flex-col space-y-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="px-3 py-2 rounded-[2px] text-xs font-mono text-[#7E8B9B] hover:text-[#FF2800] hover:bg-[#0B1E40]/30 transition-all text-left"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>
              </aside>

              {/* DETAILED CONTENT SECTIONS (9 cols) */}
              <div className="lg:col-span-9 space-y-12 sm:space-y-16">
                
                {/* 0. Executive Summary */}
                <section id="summary" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-4 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">01.</span>
                    <span>Executive Summary</span>
                  </h2>
                  <p className="text-sm sm:text-base font-sans text-[#F4F6F9]/95 leading-relaxed">
                    {caseStudy.executiveSummary}
                  </p>
                </section>

                {/* 1. Problem & Constraints */}
                <section id="problem" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-4 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">02.</span>
                    <span>Problem &amp; Constraints</span>
                  </h2>
                  <p className="text-sm sm:text-base font-sans text-[#7E8B9B] leading-relaxed">
                    {caseStudy.problem}
                  </p>
                </section>

                {/* 2. System Architecture */}
                <section id="architecture" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-4 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">03.</span>
                    <span>System Architecture</span>
                  </h2>
                  <p className="text-sm sm:text-base font-sans text-[#7E8B9B] leading-relaxed mb-6">
                    {caseStudy.architecture}
                  </p>

                  {/* Interactive Architecture Proof Set Piece */}
                  {['apexis', 'healios', 'tempo', 'routerx-careline', 'careline'].includes(project.slug) && (
                    <div className="mt-8 mb-8">
                      <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[#2563EB]">
                        <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
                        <span className="uppercase tracking-wider font-semibold">Interactive Architecture Laboratory</span>
                      </div>
                      {project.slug === 'apexis' && <ApexisDemo />}
                      {project.slug === 'healios' && <HealiosDemo />}
                      {project.slug === 'tempo' && <TempoDemo />}
                      {(project.slug === 'routerx-careline' || project.slug === 'careline') && <RouteRxDemo />}
                    </div>
                  )}

                  {/* C4 Architecture Diagram */}
                  {caseStudy.c4Diagram && (
                    <div className="mt-6">
                      <C4DiagramViewer diagram={caseStudy.c4Diagram} />
                    </div>
                  )}
                </section>

                {/* 3. Explicit Engineering Decisions & Tradeoffs */}
                <section id="tradeoffs" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-2 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">04.</span>
                    <span>Engineering Decisions &amp; Tradeoffs</span>
                  </h2>
                  <p className="text-sm font-sans text-[#7E8B9B] mb-6">
                    {caseStudy.tradeoffsSummary}
                  </p>

                  <div className="space-y-6">
                    {caseStudy.decisions && caseStudy.decisions.map((dec: EngineeringTradeoff, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 rounded-[2px] bg-[#03050A] border border-[#18458B]/20 flex flex-col gap-4"
                      >
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#F4F6F9] tracking-tight">
                          Decision {idx + 1}: {dec.title}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                          <div className="p-3.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/15">
                            <span className="text-[#10B981] font-mono font-semibold uppercase tracking-wider block mb-1">
                              Option Chosen
                            </span>
                            <p className="text-[#F4F6F9] leading-relaxed">{dec.optionChosen}</p>
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/15">
                            <span className="text-[#F87171] font-mono font-semibold uppercase tracking-wider block mb-1">
                              Alternative Rejected
                            </span>
                            <p className="text-[#7E8B9B] leading-relaxed">{dec.alternativeRejected}</p>
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/15">
                            <span className="text-[#FF2800] font-mono font-semibold uppercase tracking-wider block mb-1">
                              Cost Accepted
                            </span>
                            <p className="text-[#F4F6F9] leading-relaxed">{dec.costAccepted}</p>
                          </div>

                          <div className="p-3.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/15">
                            <span className="text-[#2563EB] font-mono font-semibold uppercase tracking-wider block mb-1">
                              Measured Impact
                            </span>
                            <p className="text-[#F4F6F9] leading-relaxed font-medium">{dec.measuredResult}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Evaluation & Methodology */}
                <section id="evaluation" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-4 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">05.</span>
                    <span>Evaluation &amp; Verified Metrics</span>
                  </h2>
                  <p className="text-sm font-sans text-[#7E8B9B] mb-6">
                    Key performance indicators and latency profiles benchmarked under explicit workload and hardware constraints.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {caseStudy.metrics.map((metric, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-4 rounded-[2px] bg-[#03050A] border border-[#18458B]/20 flex flex-col justify-between"
                      >
                        <div>
                          <p className="text-xs font-mono text-[#7E8B9B] mb-1">{metric.label}</p>
                          <p className="text-2xl font-mono font-bold text-[#FF2800] mb-2">{metric.value}</p>
                          <p className="text-xs font-sans text-[#7E8B9B] leading-relaxed">{metric.detail}</p>
                        </div>
                        {metric.evidenceId && (
                          <div className="mt-3 pt-3 border-t border-[#18458B]/15">
                            <EvidenceBadge evidenceId={metric.evidenceId} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Personal Contribution */}
                <section id="contribution" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-4 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">06.</span>
                    <span>Personal Contribution</span>
                  </h2>
                  <p className="text-sm sm:text-base font-sans text-[#F4F6F9]/95 leading-relaxed">
                    {caseStudy.personalContribution}
                  </p>
                </section>

                {/* 6. Limitations & Next Steps */}
                <section id="limitations" className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/25 backdrop-blur-sm scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F4F6F9] mb-4 tracking-tight flex items-center gap-2">
                    <span className="text-[#FF2800] font-mono text-base">07.</span>
                    <span>Limitations &amp; Next Steps</span>
                  </h2>
                  <div className="space-y-4 text-sm sm:text-base font-sans">
                    <div className="p-4 rounded-[2px] bg-[#03050A] border border-[#18458B]/20">
                      <p className="text-xs font-mono uppercase text-[#FF2800] mb-1 font-semibold">Known Limitations:</p>
                      <p className="text-[#7E8B9B] leading-relaxed">{caseStudy.limitations}</p>
                    </div>

                    <div className="p-4 rounded-[2px] bg-[#03050A] border border-[#18458B]/20">
                      <p className="text-xs font-mono uppercase text-[#2563EB] mb-1 font-semibold">Next Engineering Steps:</p>
                      <p className="text-[#F4F6F9] leading-relaxed">{caseStudy.nextSteps}</p>
                    </div>
                  </div>
                </section>

              </div>

            </div>
          </div>

        </main>

        <ContactFooter />
      </div>
    </>
  );
};

export default CaseStudyLayout;
