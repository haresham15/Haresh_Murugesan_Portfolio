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
        <title>Résumé | Haresh Murugesan — Software & Systems Engineer</title>
        <meta
          name="description"
          content="Verified résumé of Haresh Murugesan — B.S. Computer Science & Engineering at The Ohio State University. Seeking Summer 2027 Software Engineering & Systems Internships."
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

      <div className="w-full min-h-screen bg-[#050505] text-[#E0E0E0] overflow-x-hidden flex flex-col">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[960px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-1">
                Verified Curriculum Vitae
              </p>
              <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white tracking-tight">
                Haresh Murugesan
              </h1>
              <p className="text-xs font-mono text-[#A6ADB8] mt-1">
                Last verified: October 29, 2026 · Columbus, OH
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={profile.contacts.resumeUrl}
                download={profile.contacts.resumeDownloadName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7DD3FC] text-[#050505] font-sans font-semibold text-xs sm:text-sm hover:bg-white transition-colors shadow-lg"
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
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans font-medium text-xs sm:text-sm hover:bg-white/10 transition-colors"
              >
                Print / Save
              </button>
            </div>
          </div>

          {/* RÉSUMÉ SHEET (Accessible HTML Sheet) */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0D1118] border border-white/10 shadow-token-card space-y-10">
            
            {/* Header info */}
            <div className="border-b border-white/10 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                    {profile.name}
                  </h2>
                  <p className="text-sm font-sans text-[#7DD3FC] mt-0.5 font-medium">
                    {profile.roleLine}
                  </p>
                </div>
                <div className="text-xs font-mono text-[#A6ADB8] space-y-0.5 text-left sm:text-right">
                  <p><a href={`mailto:${profile.contacts.email}`} className="hover:text-white underline">{profile.contacts.email}</a></p>
                  <p><a href={profile.contacts.github} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">github.com/haresham15</a></p>
                  <p><a href={profile.contacts.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white underline">linkedin.com/in/haresh-murugesan</a></p>
                </div>
              </div>
            </div>

            {/* EDUCATION */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#7DD3FC] font-bold pb-2 mb-4 border-b border-white/10">
                Education
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <p className="text-base font-heading font-bold text-white">
                    {profile.education.university}
                  </p>
                  <p className="text-sm font-sans text-[#E0E0E0]">
                    {profile.education.degree} ({profile.education.specialization})
                  </p>
                </div>
                <div className="text-xs font-mono text-[#A6ADB8] text-left sm:text-right">
                  <p>{profile.education.location}</p>
                  <p>Expected {profile.education.expectedGraduation}</p>
                </div>
              </div>
            </div>

            {/* EXPERIENCE */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#7DD3FC] font-bold pb-2 mb-4 border-b border-white/10">
                Work & Research Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <p className="text-base font-heading font-bold text-white">
                          {exp.role}
                        </p>
                        <p className="text-sm font-sans text-[#7DD3FC]">
                          {exp.company} {exp.teamOrDivision && <span className="text-[#A6ADB8]">· {exp.teamOrDivision}</span>}
                        </p>
                      </div>
                      <div className="text-xs font-mono text-[#A6ADB8] text-left sm:text-right">
                        <p>{exp.period}</p>
                        <p>{exp.location}</p>
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm font-sans text-[#E0E0E0]/90 leading-relaxed">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="pl-1">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECTED FLAGSHIP PROJECTS */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#7DD3FC] font-bold pb-2 mb-4 border-b border-white/10">
                Selected Engineering Projects
              </h3>
              <div className="space-y-6">
                {flagshipProjects.map((proj) => (
                  <div key={proj.slug} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <p className="text-base font-heading font-bold text-white">
                        {proj.title}
                      </p>
                      <span className="text-xs font-mono text-[#7DD3FC]">
                        {proj.highlight}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#A6ADB8]">
                      Tools: {proj.stack}
                    </p>
                    <p className="text-xs sm:text-sm font-sans text-[#E0E0E0]/90 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TECHNICAL SKILLS */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#7DD3FC] font-bold pb-2 mb-4 border-b border-white/10">
                Technical Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="font-mono text-[#D8B4FE] font-bold mb-1">Languages:</p>
                  <p className="text-[#E0E0E0]">Python, TypeScript, JavaScript, Java, R, SQL, HTML5, CSS3</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="font-mono text-[#7DD3FC] font-bold mb-1">Frameworks & Libraries:</p>
                  <p className="text-[#E0E0E0]">Next.js, React, FastAPI, PyTorch, TensorFlow, OpenCV, Tailwind CSS, Framer Motion, Zustand</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="font-mono text-[#34D399] font-bold mb-1">Cloud & Infrastructure:</p>
                  <p className="text-[#E0E0E0]">AWS (S3, DynamoDB, Lambda, Bedrock), PostgreSQL (pgvector), Supabase, Docker, Git, CI/CD</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="font-mono text-[#FBBF24] font-bold mb-1">Concepts & Systems:</p>
                  <p className="text-[#E0E0E0]">Explainable AI (Grad-CAM), Web Workers, C4 Modeling, DBSCAN Spatial Clustering, OSRM Routing</p>
                </div>
              </div>
            </div>

            {/* HONORS & AWARDS */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#7DD3FC] font-bold pb-2 mb-4 border-b border-white/10">
                Honors & Achievements
              </h3>
              <div className="space-y-3 text-xs sm:text-sm font-sans">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <p className="font-heading font-semibold text-white">
                    1st Place — Best Use of External Data | ASA DataFest 2026
                  </p>
                  <span className="font-mono text-[#A6ADB8] text-xs">Spring 2026</span>
                </div>
                <p className="text-xs text-[#A6ADB8]">
                  Stormont Vail Health public transit accessibility & bi-directional shuttle optimization in Topeka, KS.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-2">
                  <p className="font-heading font-semibold text-white">
                    1st Place — Best Use of External Data | ASA DataFest 2025
                  </p>
                  <span className="font-mono text-[#A6ADB8] text-xs">Spring 2025</span>
                </div>
                <p className="text-xs text-[#A6ADB8]">
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

