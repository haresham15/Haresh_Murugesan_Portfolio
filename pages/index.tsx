import React from 'react';
import Head from 'next/head';
import App from '../src/App';
import { profile } from '@/content/profile';

export default function Home() {
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.hareshmurugesan.com/#website',
        url: 'https://www.hareshmurugesan.com',
        name: 'Haresh Murugesan — Software & Systems Architecture',
        description: 'Portfolio, engineering systems, clinical vision benchmarks, and real-time simulation engines built by Haresh Murugesan.',
        publisher: {
          '@id': 'https://www.hareshmurugesan.com/#person',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://www.hareshmurugesan.com/#profilepage',
        url: 'https://www.hareshmurugesan.com',
        name: 'Haresh Murugesan | Software & Systems Engineer',
        isPartOf: {
          '@id': 'https://www.hareshmurugesan.com/#website',
        },
        mainEntity: {
          '@id': 'https://www.hareshmurugesan.com/#person',
        },
        datePublished: '2025-01-01T00:00:00Z',
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'Person',
        '@id': 'https://www.hareshmurugesan.com/#person',
        name: profile.name,
        legalName: profile.legalName,
        url: 'https://www.hareshmurugesan.com',
        image: 'https://www.hareshmurugesan.com/preview-image.jpeg',
        jobTitle: 'Software & Systems Engineer',
        worksFor: [
          {
            '@type': 'Organization',
            name: 'The Ohio State University',
            department: 'Digital Pathology',
          },
          {
            '@type': 'Organization',
            name: 'CAS (Chemical Abstracts Service, ACS)',
          },
          {
            '@type': 'Organization',
            name: 'Honda Research Institute 99P Labs',
          },
        ],
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: profile.education.university,
          url: 'https://www.osu.edu',
        },
        award: [
          '1st Place Best Use of External Data — American Statistical Association (ASA) DataFest 2026',
          '1st Place Best Use of External Data — American Statistical Association (ASA) DataFest 2025',
          'Top Data Science Award — Hack to the Future 2026',
          'Harvard University CS50 Algorithms & Computation Certificate 2025',
        ],
        sameAs: [
          profile.contacts.github,
          profile.contacts.linkedin,
          'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98',
          'https://www.youtube.com/@syntinuum',
        ],
        knowsAbout: [
          'Software Architecture',
          'High-Performance Client Web Systems',
          'Computer Vision & Image Processing',
          'Grad-CAM Explainable AI',
          'Web Workers & Off-Screen Canvas 60fps Physics',
          'Distributed Systems & Serverless Microservices',
          'Geospatial Data Optimization & OSRM',
          'FastAPI & Python 3.11',
          'Next.js 14/15/16 & React 18/19',
          'TypeScript & Strict Data Contracts',
          'AWS (S3, DynamoDB)',
          'C/C++ Memory Management & Pointer Arithmetic',
          'PostgreSQL & pgvector IVFFlat Cosine Similarity',
          'Three.js & WebGL Shader Engineering',
        ],
      },
      {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Healios V2 — Multimodal Post-Op Wound Recovery Platform',
            url: 'https://www.hareshmurugesan.com/projects/healios',
            description: 'Post-operative surgical wound monitoring pipeline uniting 3D LiDAR elevation topography with 8.09ms explainable deep learning (Grad-CAM).',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Apexis — Motorsports Intelligence Platform',
            url: 'https://www.hareshmurugesan.com/projects/apexis',
            description: 'Deterministic 60 FPS multi-car race simulation Web Worker, client-side broadcast OCR, and sub-12ms historical SQLite lookups.',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Tempo — RSD Communication Buffer & Regulation Suite',
            url: 'https://www.hareshmurugesan.com/projects/tempo',
            description: 'Communication buffer for rejection sensitivity with pgvector emotional memory on Supabase, 100% (5/5) crisis recall, and dual-provider active-passive failover.',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Careline / RouteRx — Multi-Modal Healthcare Transit Platform',
            url: 'https://www.hareshmurugesan.com/projects/routerx-careline',
            description: 'Sub-15ms OSRM isochrone routing engine identifying patient healthcare transit deserts. 1st Place ASA DataFest Winner.',
          },
        ],
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Haresh Murugesan | Software &amp; Systems Engineer</title>
        <meta
          name="description"
          content="Haresh Murugesan, Computer Science (AI) at Ohio State, graduating May 2028. Seeking Summer 2027 software and ML internships. AI and software intern at CAS, 2× first place at ASA DataFest, and four case studies: Healios V2, Apexis, RouteRx and Tempo."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Haresh Murugesan, Software Engineer, Systems Engineer, Computer Vision, High-Performance Web, Apexis, Healios V2, Syntinuum, Ohio State University, ASA DataFest Winner, FastAPI, Next.js, TypeScript, Python, C++, Web Workers, WebGL Three.js, Distributed Systems"
        />
        <meta name="author" content="Haresh Murugesan" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://www.hareshmurugesan.com" />
        
        {/* AI Mode & LLM Discovery Links */}
        <link rel="alternate" type="text/plain" href="https://www.hareshmurugesan.com/llms.txt" title="LLM Summary Document" />
        <link rel="alternate" type="text/plain" href="https://www.hareshmurugesan.com/llms-full.txt" title="LLM Full Architecture Document" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Haresh Murugesan — Software &amp; Systems Architecture" />
        <meta property="og:title" content="Haresh Murugesan | Software &amp; Systems Engineer" />
        <meta
          property="og:description"
          content="Computer Science (AI) at Ohio State, graduating May 2028. Seeking Summer 2027 software and ML internships. Case studies, awards and experience."
        />
        <meta property="og:url" content="https://www.hareshmurugesan.com" />
        <meta property="og:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />
        <meta property="og:image:width" content="1400" />
        <meta property="og:image:height" content="1000" />
        <meta property="og:image:alt" content="Haresh Murugesan — Software &amp; Systems Architecture" />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Haresh Murugesan | Software &amp; Systems Engineer" />
        <meta
          name="twitter:description"
          content="Computer Science (AI) at Ohio State, graduating May 2028. Seeking Summer 2027 software and ML internships."
        />
        <meta name="twitter:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </Head>

      <App />
    </>
  );
}
