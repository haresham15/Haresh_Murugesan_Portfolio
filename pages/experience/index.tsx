import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { experiences } from '@/content/experience';
import Header from '@/components/Header';
import ContactFooter from '@/components/ContactFooter';
import ForgedCarbonCanvas from '@/components/ForgedCarbonCanvas';
import { GridCrosshair } from '@/components/ui/EditorialPrimitives';

export default function ExperienceDirectoryPage() {
  return (
    <>
      <Head>
        <title>Experience &amp; Career Directory | Haresh Murugesan</title>
        <meta
          name="description"
          content="Complete ledger of 5 engineering sectors, industry software internships, clinical digital pathology research, and technical leadership by Haresh Murugesan."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.hareshmurugesan.com/experience" />
        <meta property="og:title" content="Experience &amp; Career Directory | Haresh Murugesan" />
        <meta
          property="og:description"
          content="Complete ledger of 5 engineering sectors, industry software internships, clinical digital pathology research, and technical leadership."
        />
        <meta property="og:url" content="https://www.hareshmurugesan.com/experience" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />
      </Head>

      <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-hidden flex flex-col justify-between selection:bg-[#FF2800] selection:text-[#03050A] relative">
        <ForgedCarbonCanvas />
        <Header />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-24 relative z-10">
          
          {/* Top Breadcrumb & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 pb-6 mb-8 border-b border-[#18458B]/20 text-xs font-mono text-[#7E8B9B]">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-[#FF2800] transition-colors">Home</Link>
              <span className="text-[#C8D2E0]/25">/</span>
              <span className="text-[#FF2800] font-semibold">Experience directory</span>
            </div>

            <Link
              href="/#experience"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/30 text-xs font-mono text-[#F4F6F9] hover:border-[#FF2800] hover:text-[#FF2800] transition-colors"
            >
              <span>View interactive circuit</span>
              <span>→</span>
            </Link>
          </div>

          {/* Directory Hero */}
          <section className="p-6 sm:p-10 lg:p-12 rounded-[2px] bg-[#060A12]/85 border border-[#18458B]/30 backdrop-blur-md relative shadow-2xl mb-12">
            <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
            <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />
            <GridCrosshair className="absolute -bottom-[4.5px] -left-[4.5px]" />
            <GridCrosshair className="absolute -bottom-[4.5px] -right-[4.5px]" />

            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF2800]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2800]" />
                <span>Sector Dossier Index</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4F6F9] tracking-tight leading-[1.08]">
                Experience &amp; Research Directory
              </h1>
              <p className="text-base sm:text-lg font-sans text-[#7E8B9B] leading-relaxed">
                Comprehensive run-down across {experiences.length} career sectors spanning enterprise AI and serverless pipelines, clinical digital pathology computer vision, connected-vehicle innovation, non-profit executive leadership, and technical podcast production.
              </p>
            </div>
          </section>

          {/* Directory List of Sectors */}
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <article
                key={exp.id}
                className="p-6 sm:p-8 rounded-[2px] bg-[#060A12]/70 border border-[#18458B]/25 hover:border-[#FF2800] transition-colors group relative"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Number, Title, Company */}
                  <div className="space-y-2 lg:max-w-xl">
                    <div className="flex items-center gap-2.5 text-xs font-mono">
                      <span className="text-2xl font-serif text-[#FF2800] font-normal">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[#2563EB]">·</span>
                      <span className="text-[#C8D2E0]">{exp.period}</span>
                      <span className="text-[#7E8B9B]">·</span>
                      <span className="text-[#82B7FF]">{exp.type}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors">
                      <Link href={`/experience/${exp.id}`}>
                        {exp.company}
                      </Link>
                    </h2>

                    <p className="text-base font-sans font-medium text-[#FF4419]">
                      {exp.role}
                      {exp.teamOrDivision && (
                        <span className="text-xs font-sans text-[#7E8B9B] font-normal block sm:inline sm:ml-2">
                          · {exp.teamOrDivision}
                        </span>
                      )}
                    </p>

                    <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed pt-1 line-clamp-2">
                      {exp.executiveSummary || exp.bullets[0]}
                    </p>
                  </div>

                  {/* Right Column: Outcomes, Stack, Link */}
                  <div className="lg:text-right flex flex-col justify-between space-y-4 shrink-0">
                    {exp.outcome && (
                      <div className="text-xs font-mono text-[#4CC38A] tabular-nums font-medium">
                        {exp.outcome}
                      </div>
                    )}

                    <div className="flex flex-wrap lg:justify-end gap-1.5 text-xs font-mono text-[#C8D2E0]/70 max-w-sm">
                      {exp.skillsDemonstrated.slice(0, 4).map((tech, tIdx) => (
                        <span key={tech}>
                          {tIdx > 0 && <span className="text-[#2563EB] mr-1.5">·</span>}
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div>
                      <Link
                        href={`/experience/${exp.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FF2800] hover:text-[#FF4419] font-medium"
                      >
                        <span>View full run-down</span>
                        <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </main>

        <ContactFooter />
      </div>
    </>
  );
}
