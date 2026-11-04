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
        <title>About Haresh Murugesan | Systems & AI Engineer</title>
        <meta
          name="description"
          content="Background, engineering narrative, academic research, and collegiate leadership of Haresh Murugesan (CS & AI at The Ohio State University)."
        />
        <link rel="canonical" href="https://hareshmurugesan.com/about" />
        <meta property="og:title" content="About Haresh Murugesan | Systems & AI Engineer" />
        <meta property="og:description" content="Read Haresh's engineering journey, academic milestones, and collegiate leadership." />
        <meta property="og:url" content="https://hareshmurugesan.com/about" />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Haresh Murugesan | Systems & AI Engineer" />
        <meta name="twitter:description" content="Read Haresh's engineering journey, academic milestones, and collegiate leadership." />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>

      <div className="w-full min-h-screen bg-[#050505] text-[#E0E0E0] overflow-x-hidden flex flex-col">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
          
          {/* Header Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
            <div className="lg:col-span-8">
              <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-2">
                Engineer Profile & Narrative
              </p>
              <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight mb-4">
                About Haresh Murugesan
              </h1>
              <p className="text-base sm:text-lg font-sans text-[#E0E0E0] leading-relaxed mb-4">
                I am a Computer Science & Engineering student specializing in Artificial Intelligence at The Ohio State University (Expected May 2028). My work sits at the intersection of explainable deep learning, high-concurrency systems, and human-centered software architecture.
              </p>
              <p className="text-sm sm:text-base font-sans text-[#A6ADB8] leading-relaxed mb-6">
                Rather than treating machine learning as an opaque wrapper, I focus on building transparent, reproducible pipelines—like our 8.09ms Grad-CAM explainability engine in Healios V2, client-side Web Worker simulations in Apexis, and spatial transit optimization algorithms in RouteRx (Careline).
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/resume"
                  className="px-5 py-2.5 rounded-xl bg-[#7DD3FC] text-[#050505] font-sans font-semibold text-xs sm:text-sm hover:bg-white transition-colors"
                >
                  View Verified Résumé →
                </Link>
                <Link
                  href="/projects"
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans font-medium text-xs sm:text-sm hover:bg-white/10 transition-colors"
                >
                  Explore Systems Index
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border border-white/15 shadow-token-card">
                <Image
                  src="/profile.jpeg"
                  alt="Haresh Murugesan"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Current Focus (Now Section) */}
          <section className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-3xl bg-[#0D1118] border border-white/10 shadow-token-card">
            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-[#34D399]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
              <span className="uppercase tracking-widest font-semibold">Current Focus & Availability (Now)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-sans">
              <div>
                <p className="font-heading font-bold text-white mb-1">Internship Search</p>
                <p className="text-[#A6ADB8] leading-relaxed">
                  Actively interviewing for Summer 2027 Software Engineering, AI/ML, and Systems internships across top tech and research teams.
                </p>
              </div>
              <div>
                <p className="font-heading font-bold text-white mb-1">Academic Research</p>
                <p className="text-[#A6ADB8] leading-relaxed">
                  Investigating explainable computer vision segmentation models for digital pathology and automated allergy wheal area calibration.
                </p>
              </div>
              <div>
                <p className="font-heading font-bold text-white mb-1">Technical Deep Dives</p>
                <p className="text-[#A6ADB8] leading-relaxed">
                  Expanding Syntinuum Podcast Season 3 while exploring on-device WebGPU machine learning and zero-copy binary serialization.
                </p>
              </div>
            </div>
          </section>

          {/* The Story So Far Timeline */}
          <section className="mb-16 sm:mb-20">
            <div className="mb-8 pb-4 border-b border-white/10">
              <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-1">
                Milestone Retrospective
              </p>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white tracking-tight">
                The Story So Far (2023 – Present)
              </h2>
            </div>

            <div className="space-y-6">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0D1118]/70 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
                >
                  <div className="max-w-2xl">
                    <span className="text-xs font-mono text-[#7DD3FC] block mb-1">
                      {m.period}
                    </span>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-1.5">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-[#A6ADB8] leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Collegiate Leadership */}
          <section className="mb-16">
            <div className="mb-8 pb-4 border-b border-white/10">
              <p className="text-xs font-mono uppercase tracking-widest text-[#D8B4FE] mb-1">
                Community & Organization
              </p>
              <h2 className="text-2xl sm:text-4xl font-heading font-bold text-white tracking-tight">
                Collegiate Leadership & Impact
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {leadership.map((lead, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0D1118]/70 border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#A6ADB8] mb-2">
                      <span className="text-[#D8B4FE]">{lead.role}</span>
                      <span>{lead.period}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white mb-2">
                      {lead.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-[#A6ADB8] leading-relaxed">
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

