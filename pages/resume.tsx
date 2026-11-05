import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { profile } from '@/content/profile';
import { experiences } from '@/content/experience';
import { flagshipProjects } from '@/content/projects';

export default function ResumePage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Résumé | Haresh Murugesan — Software & Systems Engineer',
    description: 'Verified résumé, technical proficiencies, research experience, and awards of Haresh Murugesan.',
    url: 'https://hareshmurugesan.com/resume',
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      legalName: profile.legalName,
      url: 'https://hareshmurugesan.com',
      jobTitle: 'Software & Systems Engineer',
      knowsAbout: [
        'Artificial Intelligence',
        'Computer Vision',
        'High-Concurrency Systems',
        'Web Workers',
        'TypeScript',
        'Python',
        'Spatial Telemetry',
      ],
    },
  };

  return (
    <>
      <Head>
        <title>Résumé | Haresh Murugesan — Software &amp; Systems Engineer</title>
        <meta
          name="description"
          content="Verified résumé of Haresh Murugesan — B.S. Computer Science &amp; Engineering at The Ohio State University. Seeking Summer 2027 Software Engineering &amp; Systems Internships."
        />
        <link rel="canonical" href="https://hareshmurugesan.com/resume" />
        <meta property="og:title" content="Résumé | Haresh Murugesan" />
        <meta property="og:description" content="Technical background, industry experience, and verified project milestones." />
        <meta property="og:url" content="https://hareshmurugesan.com/resume" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Résumé | Haresh Murugesan" />
        <meta name="twitter:description" content="Technical background, industry experience, and verified project milestones." />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>

      <div className="w-full min-h-screen bg-[#070B12] text-[#F3EFE7] overflow-x-hidden flex flex-col selection:bg-[#FF6B35] selection:text-[#070B12]">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[1040px] mx-auto px-6 sm:px-8 pt-32 sm:pt-40 pb-24">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-[#F3EFE7]/[0.08] gap-6">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-[#FF6B35]">
                VERIFIED CURRICULUM VITAE
              </p>
              <h1 className="text-3xl sm:text-5xl font-raleway font-bold text-[#F3EFE7] tracking-tight">
                Haresh Murugesan
              </h1>
              <p className="text-xs font-mono text-[#7A889B]">
                Last verified: October 2026 · Columbus, OH
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={profile.contacts.resumeUrl}
                download={profile.contacts.resumeDownloadName}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-mono font-semibold text-xs transition-colors select-none"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download PDF (Direct)</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 bg-[#101B30] hover:bg-[#17243A] border border-[#F3EFE7]/15 text-[#F3EFE7] font-mono text-xs transition-colors cursor-pointer select-none"
              >
                Print / Save
              </button>
            </div>
          </div>

          {/* RÉSUMÉ SHEET (Accessible Editorial Sheet) */}
          <div className="p-8 sm:p-12 bg-[#101B30] border border-[#F3EFE7]/[0.1] space-y-10">
            
            {/* Header info */}
            <div className="border-b border-[#F3EFE7]/[0.08] pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#F3EFE7]">
                    {profile.name}
                  </h2>
                  <p className="text-sm font-sans text-[#F5D998] mt-1 font-medium">
                    {profile.roleLine}
                  </p>
                </div>
                <div className="text-xs font-mono text-[#A7B2C3] space-y-1 text-left sm:text-right">
                  <p><a href={`mailto:${profile.contacts.email}`} className="hover:text-[#F3EFE7] underline">{profile.contacts.email}</a></p>
                  <p><a href={profile.contacts.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#F3EFE7] underline">github.com/haresham15</a></p>
                  <p><a href={profile.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#F3EFE7] underline">linkedin.com/in/haresh-murugesan</a></p>
                </div>
              </div>
            </div>

            {/* EDUCATION */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold pb-3 mb-6 border-b border-[#F3EFE7]/[0.08]">
                Education
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-lg font-serif text-[#F3EFE7]">
                    {profile.education.university}
                  </p>
                  <p className="text-sm font-sans text-[#A7B2C3]">
                    {profile.education.degree} ({profile.education.specialization})
                  </p>
                </div>
                <div className="text-xs font-mono text-[#7A889B] text-left sm:text-right">
                  <p>{profile.education.location}</p>
                  <p>Expected {profile.education.expectedGraduation}</p>
                </div>
              </div>
            </div>

            {/* EXPERIENCE */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold pb-3 mb-6 border-b border-[#F3EFE7]/[0.08]">
                Work &amp; Research Experience
              </h3>
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <p className="text-base sm:text-lg font-serif text-[#F3EFE7]">
                          {exp.role}
                        </p>
                        <p className="text-sm font-sans text-[#F5D998]">
                          {exp.company} {exp.teamOrDivision && <span className="text-[#A7B2C3]">· {exp.teamOrDivision}</span>}
                        </p>
                      </div>
                      <div className="text-xs font-mono text-[#7A889B] text-left sm:text-right">
                        <p>{exp.period}</p>
                        <p>{exp.location}</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm font-sans text-[#A7B2C3] leading-relaxed">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#FF6B35] select-none font-mono text-xs">―</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECTED FLAGSHIP PROJECTS */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold pb-3 mb-6 border-b border-[#F3EFE7]/[0.08]">
                Selected Engineering Projects
              </h3>
              <div className="space-y-6">
                {flagshipProjects.map((proj) => (
                  <div key={proj.slug} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <p className="text-base sm:text-lg font-serif text-[#F3EFE7]">
                        {proj.title}
                      </p>
                      <span className="text-xs font-mono text-[#F5D998]">
                        {proj.highlight}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#82B7FF]">
                      Tools: {proj.stack}
                    </p>
                    <p className="text-xs sm:text-sm font-sans text-[#A7B2C3] leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TECHNICAL SKILLS */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold pb-3 mb-6 border-b border-[#F3EFE7]/[0.08]">
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/[0.08]">
                  <p className="font-mono text-[#F5D998] font-bold mb-1">Languages:</p>
                  <p className="text-[#A7B2C3]">Python, TypeScript, JavaScript, Java, R, SQL, C/C++, HTML5, CSS3</p>
                </div>
                <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/[0.08]">
                  <p className="font-mono text-[#82B7FF] font-bold mb-1">Frameworks &amp; Libraries:</p>
                  <p className="text-[#A7B2C3]">Next.js, React, FastAPI, PyTorch, TensorFlow, OpenCV, Tailwind CSS, Framer Motion, Zustand</p>
                </div>
                <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/[0.08]">
                  <p className="font-mono text-[#4CC38A] font-bold mb-1">Cloud &amp; Infrastructure:</p>
                  <p className="text-[#A7B2C3]">AWS (S3, DynamoDB, Lambda), PostgreSQL (pgvector), SQLite, Docker, Git, CI/CD</p>
                </div>
                <div className="p-4 bg-[#070B12] border border-[#F3EFE7]/[0.08]">
                  <p className="font-mono text-[#FF6B35] font-bold mb-1">Concepts &amp; Systems:</p>
                  <p className="text-[#A7B2C3]">Explainable AI (Grad-CAM), Web Workers, C4 Modeling, Spatial Isochrones, OSRM Routing</p>
                </div>
              </div>
            </div>

            {/* HONORS & AWARDS */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#FF6B35] font-semibold pb-3 mb-6 border-b border-[#F3EFE7]/[0.08]">
                Honors &amp; Achievements
              </h3>
              <div className="space-y-4 text-xs sm:text-sm font-sans">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <p className="font-serif text-base text-[#F3EFE7]">
                    1st Place — Best Use of External Data | ASA DataFest 2026
                  </p>
                  <span className="font-mono text-[#7A889B] text-xs">Spring 2026</span>
                </div>
                <p className="text-xs text-[#A7B2C3]">
                  Stormont Vail Health public transit accessibility &amp; bi-directional shuttle optimization in Topeka, KS.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-3 border-t border-[#F3EFE7]/[0.06]">
                  <p className="font-serif text-base text-[#F3EFE7]">
                    1st Place — Best Use of External Data | ASA DataFest 2025
                  </p>
                  <span className="font-mono text-[#7A889B] text-xs">Spring 2025</span>
                </div>
                <p className="text-xs text-[#A7B2C3]">
                  Awarded by American Statistical Association faculty and industry data scientists.
                </p>
              </div>
            </div>

          </div>

        </main>

        <SiteFooter />
      </div>
    </>
  );
}
