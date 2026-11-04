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
        '@id': 'https://hareshmurugesan.com/#website',
        url: 'https://hareshmurugesan.com',
        name: 'Haresh Murugesan — Software & Systems Architecture',
        description: 'Portfolio, engineering systems, clinical vision benchmarks, and real-time simulation engines built by Haresh Murugesan.',
        publisher: {
          '@id': 'https://hareshmurugesan.com/#person',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://hareshmurugesan.com/#profilepage',
        url: 'https://hareshmurugesan.com',
        name: 'Haresh Murugesan | Software & Systems Engineer',
        isPartOf: {
          '@id': 'https://hareshmurugesan.com/#website',
        },
        mainEntity: {
          '@id': 'https://hareshmurugesan.com/#person',
        },
        datePublished: '2025-01-01T00:00:00Z',
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'Person',
        '@id': 'https://hareshmurugesan.com/#person',
        name: profile.name,
        legalName: profile.legalName,
        url: 'https://hareshmurugesan.com',
        image: 'https://hareshmurugesan.com/profile.jpeg',
        jobTitle: 'Software & Systems Engineer',
        worksFor: [
          {
            '@type': 'Organization',
            name: 'The Ohio State University',
            department: 'Digital Pathology & Clinical Diagnostics Lab',
          },
          {
            '@type': 'Organization',
            name: 'Chemical Abstracts Service (CAS)',
            department: 'Data Analytics & Insights, ACE Team',
          },
          {
            '@type': 'Organization',
            name: 'Honda Research Institute / 99P Labs',
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
          'AWS Architecture (Lambda, DynamoDB, S3, CloudWatch)',
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
            url: 'https://hareshmurugesan.com/projects/healios',
            description: 'Post-operative surgical wound monitoring pipeline uniting 3D LiDAR elevation topography with 8.09ms explainable deep learning (Grad-CAM).',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Apexis — Motorsports Intelligence Platform',
            url: 'https://hareshmurugesan.com/projects/apexis',
            description: 'Deterministic 60 FPS multi-car race simulation Web Worker, client-side broadcast OCR, and sub-12ms historical SQLite lookups.',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Tempo — Air-Gapped Cognitive Buffer & Task Regulation Suite',
            url: 'https://hareshmurugesan.com/projects/tempo',
            description: 'Air-gapped communication buffer with pgvector emotional memory, 100% crisis recall, and dual-provider active-passive failover.',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Careline / RouteRx — Multi-Modal Healthcare Transit Platform',
            url: 'https://hareshmurugesan.com/projects/routerx-careline-hub',
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
          content="Portfolio of Haresh Murugesan — B.S. Computer Science &amp; Engineering at The Ohio State University. High-performance software systems, 60fps real-time simulation engines (Apexis), 8.09ms clinical vision pipelines (Healios V2), and 2× ASA DataFest Champion."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Haresh Murugesan, Software Engineer, Systems Engineer, Computer Vision, High-Performance Web, Apexis, Healios V2, Syntinuum, Ohio State University, ASA DataFest Winner, FastAPI, Next.js, TypeScript, Python, C++, Web Workers, WebGL Three.js, Distributed Systems"
        />
        <meta name="author" content="Haresh Murugesan" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://hareshmurugesan.com" />
        
        {/* AI Mode & LLM Discovery Links */}
        <link rel="alternate" type="text/plain" href="https://hareshmurugesan.com/llms.txt" title="LLM Summary Document" />
        <link rel="alternate" type="text/plain" href="https://hareshmurugesan.com/llms-full.txt" title="LLM Full Architecture Document" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Haresh Murugesan — Software &amp; Systems Architecture" />
        <meta property="og:title" content="Haresh Murugesan | Software &amp; Systems Engineer" />
        <meta
          property="og:description"
          content="Explore Haresh's verified engineering systems, client performance benchmarks, 60fps simulation engines, and clinical vision pipelines."
        />
        <meta property="og:url" content="https://hareshmurugesan.com" />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Haresh Murugesan — Software &amp; Systems Architecture" />
        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Haresh Murugesan | Software &amp; Systems Engineer" />
        <meta
          name="twitter:description"
          content="Portfolio of Haresh Murugesan — B.S. Computer Science &amp; Engineering at Ohio State. Building high-performance systems and real-time simulations."
        />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />

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
