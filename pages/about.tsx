import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { profile } from '@/content/profile';

export default function AboutPage() {
  const milestones = [
    {
      period: 'Summer 2026 – Present',
      title: 'Digital Pathology AI/ML Research @ Ohio State',
      description: 'Applying convolutional neural networks and explainable saliency techniques (Grad-CAM) to histology tissue classification and automated allergy wheal measurement.',
    },
    {
      period: 'Summer 2026',
      title: 'Technology Intern (DA&I Division) @ CAS',
      description: 'Engineered serverless AWS pipelines across 12 internal chemical research use cases with S3, DynamoDB, Lambda, and agentic LLM integrations.',
    },
    {
      period: 'Spring 2026',
      title: '1st Place for Best Use of External Data (ASA DataFest 2026)',
      description: 'Built RouteRx (Careline), a bi-directional transit routing engine resolving healthcare transit deserts in Shawnee County, KS for Stormont Vail Health.',
    },
    {
      period: 'Feb 2026 – Present',
      title: 'Innovation Analyst @ Center for Innovation Strategies / Honda 99P Labs',
      description: 'Synthesizing spatial telemetry and connected-vehicle trip data to evaluate urban driving efficiency and battery wear trends.',
    },
    {
      period: 'Dec 2025 – Present',
      title: 'Host & Producer (Season 3) @ Syntinuum Podcast',
      description: 'Surpassed 100K+ impressions interviewing tech founders and engineering leaders on software architecture, hardware scaling, and technical tradeoffs.',
    },
    {
      period: 'Spring 2025',
      title: '1st Place for Best Use of External Data (ASA DataFest 2025)',
      description: 'Awarded first place at the American Statistical Association collegiate data hackathon at The Ohio State University.',
    },
    {
      period: 'Aug 2023 – Present',
      title: 'Undergraduate @ The Ohio State University',
      description: 'B.S. in Computer Science & Engineering with an Artificial Intelligence specialization. Expected graduation: May 2028.',
    },
  ];

  const leadership = [
    {
      title: 'Philocracy',
      role: 'Founder & Co-CEO',
      period: 'Dec 2025 – Present',
      description: 'Directed product strategy, fiscal budgeting, and social impact apparel operations, donating 100% of net proceeds to community programs.',
    },
    {
      title: 'OSU Tamil Sangam',
      role: 'Active Leadership & Cultural Organizer',
      period: '2024 – Present',
      description: 'Organizing collegiate cultural programs, student community engagement, and digital media presence for South Asian students at Ohio State.',
    },
    {
      title: 'VECTOR (Vehicle Engineering & Computing)',
      role: 'Active Systems Contributor',
      period: '2025 – Present',
      description: 'Collaborating on collegiate autonomous vehicle software systems, sensor telemetry parsing, and embedded computing architectures.',
    },
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Haresh Murugesan | Systems & AI Engineer',
    description: 'Background, engineering narrative, academic research, and collegiate leadership of Haresh Murugesan.',
    url: 'https://hareshmurugesan.com/about',
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      legalName: profile.legalName,
      url: 'https://hareshmurugesan.com',
      image: 'https://hareshmurugesan.com/profile.jpeg',
      jobTitle: 'Software & Systems Engineer',
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'The Ohio State University',
      },
      sameAs: [
        'https://github.com/haresham15',
        'https://linkedin.com/in/haresh-murugesan',
        'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
      ],
    },
  };

  return (
    <>
      <Head>
        <title>About Haresh Murugesan | Systems &amp; AI Engineer</title>
        <meta
          name="description"
          content="Background, engineering narrative, academic research, and collegiate leadership of Haresh Murugesan (CS &amp; AI at The Ohio State University)."
        />
        <link rel="canonical" href="https://hareshmurugesan.com/about" />
        <meta property="og:title" content="About Haresh Murugesan | Systems &amp; AI Engineer" />
        <meta property="og:description" content="Read Haresh's engineering journey, academic milestones, and collegiate leadership." />
        <meta property="og:url" content="https://hareshmurugesan.com/about" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Haresh Murugesan | Systems &amp; AI Engineer" />
        <meta name="twitter:description" content="Read Haresh's engineering journey, academic milestones, and collegiate leadership." />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>

      <div className="w-full min-h-screen bg-[#070B12] text-[#F3EFE7] overflow-x-hidden flex flex-col selection:bg-[#FF6B35] selection:text-[#070B12]">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-32 sm:pt-40 pb-24">
          
          {/* Header Profile Section (40% Portrait / 60% Narrative) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-20 sm:mb-28 pb-16 sm:pb-20 border-b border-[#F3EFE7]/[0.08]">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-raleway font-bold text-[#F3EFE7] tracking-tight leading-tight">
                About Haresh Murugesan
              </h1>

              <div className="max-w-[65ch] space-y-4 text-[16px] sm:text-[17px] font-sans text-[#A7B2C3] leading-[1.75]">
                <p>
                  I am a Computer Science &amp; Engineering student specializing in Artificial Intelligence at The Ohio State University (Expected May 2028). My work sits at the intersection of explainable deep learning, high-concurrency systems, and human-centered software architecture.
                </p>
                <p>
                  Rather than treating machine learning as an opaque wrapper, I focus on building transparent, reproducible pipelines—like our 8.09ms Grad-CAM explainability engine in Healios V2, client-side Web Worker simulations in Apexis, and spatial transit optimization algorithms in RouteRx (Careline).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="/Haresh_Murugesan_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-mono text-xs font-semibold transition-colors select-none inline-flex items-center gap-2"
                >
                  <span>View Verified Résumé</span>
                  <span>↗</span>
                </a>
                <Link
                  href="/projects"
                  className="px-6 py-3.5 bg-[#101B30] hover:bg-[#17243A] border border-[#F3EFE7]/15 text-[#F3EFE7] font-mono text-xs font-medium transition-colors select-none"
                >
                  Explore Systems Index
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] bg-[#101B30] border border-[#F3EFE7]/[0.1] overflow-hidden">
                <Image
                  src="/profile.jpeg"
                  alt="Haresh Murugesan"
                  fill
                  className="object-cover object-top filter contrast-[1.03]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Current Focus (Now Section) */}
          <section className="mb-20 sm:mb-28 p-8 sm:p-10 bg-[#101B30] border border-[#F3EFE7]/[0.1]">
            <div className="flex items-center gap-2.5 mb-6 text-xs font-mono text-[#A7B2C3]">
              <span className="w-2 h-2 rounded-full bg-[#4CC38A] animate-pulse" />
              <span className="uppercase tracking-widest text-[#FF6B35] font-semibold">CURRENT FOCUS &amp; AVAILABILITY (NOW)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-sans">
              <div className="space-y-2">
                <p className="font-serif text-lg text-[#F3EFE7]">Internship Search</p>
                <p className="text-[#A7B2C3] leading-relaxed">
                  Actively interviewing for Summer 2027 Software Engineering, AI/ML, and Systems internships across top tech and research teams.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-serif text-lg text-[#F3EFE7]">Academic Research</p>
                <p className="text-[#A7B2C3] leading-relaxed">
                  Investigating explainable computer vision segmentation models for digital pathology and automated allergy wheal area calibration.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-serif text-lg text-[#F3EFE7]">Technical Deep Dives</p>
                <p className="text-[#A7B2C3] leading-relaxed">
                  Expanding Syntinuum Podcast Season 3 while exploring on-device Web Workers, simulation kernels, and zero-copy binary serialization.
                </p>
              </div>
            </div>
          </section>

          {/* The Story So Far Timeline */}
          <section className="mb-20 sm:mb-28">
            <div className="mb-10 pb-4 border-b border-[#F3EFE7]/[0.08] flex items-baseline justify-between">
              <div>
                <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#F3EFE7] tracking-tight">
                  The Story So Far (2023 – Present)
                </h2>
              </div>
            </div>

            <div className="border-t border-[#F3EFE7]/[0.08] divide-y divide-[#F3EFE7]/[0.08]">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="py-6 sm:py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-4 hover:bg-[#101B30]/30 transition-colors"
                >
                  <div className="md:w-1/3">
                    <span className="text-xs font-mono text-[#F5D998] block">
                      {m.period}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif text-[#F3EFE7] mt-1">
                      {m.title}
                    </h3>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-sm font-sans text-[#A7B2C3] leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Collegiate Leadership */}
          <section className="mb-16">
            <div className="mb-10 pb-4 border-b border-[#F3EFE7]/[0.08]">
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#F3EFE7] tracking-tight">
                Collegiate Leadership &amp; Impact
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadership.map((lead, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#101B30] border border-[#F3EFE7]/[0.08] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#A7B2C3]">
                      <span className="text-[#FF6B35]">{lead.role}</span>
                      <span>{lead.period}</span>
                    </div>
                    <h3 className="text-lg font-serif text-[#F3EFE7]">
                      {lead.title}
                    </h3>
                    <p className="text-sm font-sans text-[#A7B2C3] leading-relaxed">
                      {lead.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        <SiteFooter />
      </div>
    </>
  );
}
