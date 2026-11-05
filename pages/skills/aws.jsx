import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '../../src/components/Header';
import ContactFooter from '../../src/components/ContactFooter';
import FractalGlassBackground from '../../src/components/FractalGlassBackground';

const AWSSkills = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Compute & Serverless', 'Storage & Database', 'AI & Intelligence', 'Security & Networking', 'Observability & Messaging'];

  const awsSkills = [
    {
      title: 'AWS Lambda',
      category: 'Compute & Serverless',
      icon: 'aws-lambda.svg',
      color: '#FF9900',
      badge: 'Core Serverless',
      description: 'Engineered event-driven microservices at CAS to parse and process high-volume scientific datasets asynchronously. Optimized memory allocation to minimize cold starts and implemented sub-second execution handlers for webhook ingress and data transformation pipelines.'
    },
    {
      title: 'Amazon DynamoDB',
      category: 'Storage & Database',
      icon: 'amazon-dynamodb.svg',
      color: '#4053D6',
      badge: 'Sub-10ms Latency',
      description: 'Designed single-digit millisecond latency key-value schemas for session tracking, query caching, and entity metadata. Applied single-table design principles with composite partition/sort keys to maintain sub-10ms p99 read latencies under scale.'
    },
    {
      title: 'Amazon S3',
      category: 'Storage & Database',
      icon: 'amazon-s3.svg',
      color: '#569A31',
      badge: 'Object Storage',
      description: 'Configured secure, high-durability object storage for multi-gigabyte scientific records, digital pathology image datasets, and ML model checkpoint artifacts. Integrated lifecycle rules, server-side encryption (SSE-S3), and signed URL access for controlled file transfers.'
    },
    {
      title: 'Amazon Bedrock',
      category: 'AI & Intelligence',
      icon: 'amazon-bedrock.png',
      color: '#00A4A6',
      badge: 'Enterprise GenAI',
      description: 'Orchestrated managed foundation models (Claude, Titan) via Bedrock APIs at CAS for automated scientific document synthesis and enterprise knowledge extraction. Designed prompt guardrails and zero-data-retention security protocols for sensitive intellectual property.'
    },
    {
      title: 'Amazon API Gateway',
      category: 'Security & Networking',
      icon: 'amazon-api-gateway.svg',
      color: '#FF4F8B',
      badge: 'API Management',
      description: 'Architected RESTful and HTTP APIs with JWT authorizers, CORS controls, and usage plans with throttling to protect downstream serverless Lambda functions from traffic spikes and unauthorized invocation.'
    },
    {
      title: 'AWS IAM',
      category: 'Security & Networking',
      icon: 'aws-iam.svg',
      color: '#DD344C',
      badge: 'Least Privilege',
      description: 'Enforced strict Principle of Least Privilege across enterprise services. Crafted fine-grained IAM roles, resource-scoped execution policies, and cross-account access controls to ensure multi-tenant security isolation.'
    },
    {
      title: 'Amazon CloudWatch',
      category: 'Observability & Messaging',
      icon: 'amazon-cloudwatch.svg',
      color: '#FF4F8B',
      badge: 'Observability',
      description: 'Implemented centralized structured JSON logging, custom metric alarms, and invocation latency monitoring dashboards across distributed Lambda executions to maintain strict SLA visibility and rapid incident response.'
    },
    {
      title: 'Amazon SQS',
      category: 'Observability & Messaging',
      icon: 'amazon-sqs.svg',
      color: '#FF4F8B',
      badge: 'Async Decoupling',
      description: 'Decoupled asynchronous scientific processing pipelines using standard and FIFO message queues, smoothing traffic bursts and handling dead-letter queues (DLQ) for automated retry handling and failed payload inspection.'
    },
    {
      title: 'Amazon CloudFront',
      category: 'Security & Networking',
      icon: 'amazon-cloudfront.png',
      color: '#8C4FFF',
      badge: 'Global Edge CDN',
      description: 'Deployed global edge distribution with custom caching behaviors, SSL/TLS certificate termination via ACM, and low-latency asset delivery for client-facing web applications.'
    },
    {
      title: 'Amazon Route 53',
      category: 'Security & Networking',
      icon: 'amazon-route53.svg',
      color: '#F58536',
      badge: 'DNS & Failover',
      description: 'Managed highly available DNS routing, latency-based resolution, and health-check failover configs for custom domains and subdomains with automated DNS validation.'
    },
    {
      title: 'Amazon Cognito',
      category: 'Security & Networking',
      icon: 'amazon-cognito.png',
      color: '#DD344C',
      badge: 'Identity & Auth',
      description: 'Configured user pools and identity federation for secure web client authentication, token-based session refresh, and fine-grained role mapping for internal administrative portals.'
    },
    {
      title: 'Amazon EC2',
      category: 'Compute & Serverless',
      icon: 'amazon-ec2.svg',
      color: '#FF9900',
      badge: 'GPU & Batch Compute',
      description: 'Provisioned and configured GPU-accelerated and compute-optimized Linux instances for training deep vision models, running batch evaluations, and executing containerized Docker workloads.'
    }
  ];

  const filteredSkills = activeCategory === 'All'
    ? awsSkills
    : awsSkills.filter(s => s.category === activeCategory);

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-charcoal">
      <Head>
        <title>AWS Cloud Architecture & Ecosystem | Haresh Murugesan</title>
        <meta
          name="description"
          content="Cloud infrastructure, serverless pipelines, and foundation model orchestration engineered during technology work at CAS and across distributed AI systems."
        />
      </Head>
      <FractalGlassBackground />
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 py-24 sm:py-32 relative z-10">
        {/* Navigation & Header */}
        <div className="mb-12 sm:mb-16">
          <Link 
            href="/#skills" 
            className="inline-flex items-center gap-2 text-cine-lavender hover:text-cine-teal transition-colors font-sans text-sm mb-6 sm:mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Skills & Tools
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cine-teal/15 text-cine-teal border border-cine-teal/30">
                Enterprise Cloud Architecture
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cine-lavender/15 text-cine-lavender border border-cine-lavender/30">
                CAS (Chemical Abstracts Service) Work
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 text-light-gray/60 border border-[#F3EFE7]/10">
                C4 Model
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-6">
              AWS Ecosystem & Cloud Architecture
            </h1>
            <p className="text-lg sm:text-xl text-light-gray/80 font-sans max-w-3xl leading-relaxed">
              A deep dive into the serverless infrastructure, C4 architecture modeling, and foundation model pipelines I engineered at <strong className="text-white font-medium">CAS</strong> and across distributed AI systems.
            </p>
          </motion.div>
        </div>

        {/* C4 Architecture Blueprint Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-[2px] bg-[#101B30]/50 backdrop-blur-xl border border-[#F3EFE7]/10 relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F3EFE7]/10 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cine-teal uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-cine-teal" />
                C4 Architecture Highlight (Level 2: Containers)
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-white tracking-tight">
                Enterprise Scientific AI & Data Ingestion Pipeline
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-mono text-light-gray/70 bg-white/5 border border-[#F3EFE7]/10">
                Trunk-Based CI/CD
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono text-light-gray/70 bg-white/5 border border-[#F3EFE7]/10">
                Least Privilege IAM
              </span>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            <div className="p-4 rounded-[2px] bg-white/[0.03] border border-[#F3EFE7]/10 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-cine-lavender mb-2">01 Ingress & Auth</span>
              <h4 className="text-white font-heading font-semibold text-sm mb-1">API Gateway + IAM</h4>
              <p className="text-light-gray/60 text-xs font-sans">JWT token validation, CORS control, and usage rate limits.</p>
            </div>

            <div className="p-4 rounded-[2px] bg-white/[0.03] border border-[#F3EFE7]/10 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-cine-teal mb-2">02 Compute & Buffering</span>
              <h4 className="text-white font-heading font-semibold text-sm mb-1">Lambda + SQS</h4>
              <p className="text-light-gray/60 text-xs font-sans">Event-driven asynchronous compute with queue burst smoothing.</p>
            </div>

            <div className="p-4 rounded-[2px] bg-white/[0.03] border border-[#F3EFE7]/10 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-cine-teal mb-2">03 Foundation AI</span>
              <h4 className="text-white font-heading font-semibold text-sm mb-1">Amazon Bedrock</h4>
              <p className="text-light-gray/60 text-xs font-sans">Managed LLMs for scientific synthesis and semantic extraction.</p>
            </div>

            <div className="p-4 rounded-[2px] bg-white/[0.03] border border-[#F3EFE7]/10 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-cine-lavender mb-2">04 Persistence</span>
              <h4 className="text-white font-heading font-semibold text-sm mb-1">DynamoDB & S3</h4>
              <p className="text-light-gray/60 text-xs font-sans">Sub-10ms metadata indexing + high-durability multi-GB object storage.</p>
            </div>

            <div className="p-4 rounded-[2px] bg-white/[0.03] border border-[#F3EFE7]/10 flex flex-col justify-between">
              <span className="text-[11px] font-mono text-cine-teal mb-2">05 Observability</span>
              <h4 className="text-white font-heading font-semibold text-sm mb-1">CloudWatch Alarms</h4>
              <p className="text-light-gray/60 text-xs font-sans">Structured JSON logging, error rate tracking, and SLA alerts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#F3EFE7]/10 text-xs font-sans text-light-gray/70">
            <div className="flex items-start gap-2">
              <span className="text-cine-teal font-mono">✓</span>
              <span><strong>Zero Idle Cost:</strong> Serverless pay-per-execution model eliminated idle cluster operational overhead.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cine-teal font-mono">✓</span>
              <span><strong>C4 Rigor:</strong> Clear separation between System Context, Container boundaries, and Component contracts.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cine-teal font-mono">✓</span>
              <span><strong>Security-First:</strong> Multi-tenant isolation with resource-scoped IAM execution policies.</span>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => {
            const count = cat === 'All' ? awsSkills.length : awsSkills.filter(s => s.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 border ${
                  isActive
                    ? 'bg-cine-teal/15 border-cine-teal text-white shadow-cine-glow-teal'
                    : 'bg-[#101B30]/30 border-[#F3EFE7]/10 text-light-gray/60 hover:text-white hover:border-white/20'
                }`}
              >
                {cat} <span className="text-[10px] font-mono text-light-gray/40 ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* AWS Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredSkills.map((skill, idx) => (
            <motion.div 
              key={skill.title}
              className="bg-[#101B30]/40 backdrop-blur-md border border-[#F3EFE7]/10 rounded-[2px] p-6 sm:p-7 hover:border-cine-teal transition-all duration-300 flex flex-col justify-between group hover:shadow-cine-glow-teal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="w-12 h-12 rounded-[2px] flex items-center justify-center bg-white/5 border border-[#F3EFE7]/10 group-hover:border-cine-teal/40 transition-colors p-2.5">
                    <img 
                      src={`/icons/${skill.icon}`} 
                      alt={skill.title}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-white/5 border border-[#F3EFE7]/10 text-light-gray/70">
                    {skill.badge}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-cine-lavender uppercase tracking-wider mb-1">
                  {skill.category}
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-3 tracking-tight group-hover:text-cine-teal transition-colors">
                  {skill.title}
                </h3>
                <p className="text-light-gray/75 font-sans text-xs sm:text-sm leading-relaxed mb-4">
                  {skill.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-light-gray/40">
                <span>Production Architecture</span>
                <span className="text-cine-teal">Verified CAS/Project</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Architecture Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-[2px] bg-[#101B30]/30 border border-[#F3EFE7]/10 mb-16">
          <div>
            <div className="w-8 h-8 rounded-lg bg-cine-teal/10 border border-cine-teal/30 flex items-center justify-center text-cine-teal font-mono text-sm mb-3">
              01
            </div>
            <h4 className="text-white font-heading font-semibold text-base mb-2">Least-Privilege Security</h4>
            <p className="text-light-gray/70 text-xs font-sans leading-relaxed">
              Every serverless Lambda execution role and API authorizer is restricted to specific resource ARNs with strict zero-trust permission boundaries.
            </p>
          </div>

          <div>
            <div className="w-8 h-8 rounded-lg bg-cine-lavender/10 border border-cine-lavender/30 flex items-center justify-center text-cine-lavender font-mono text-sm mb-3">
              02
            </div>
            <h4 className="text-white font-heading font-semibold text-base mb-2">Asynchronous Decoupling</h4>
            <p className="text-light-gray/70 text-xs font-sans leading-relaxed">
              Ingress requests are buffered via SQS and processed asynchronously to prevent throttling and guarantee resilience against sudden traffic spikes.
            </p>
          </div>

          <div>
            <div className="w-8 h-8 rounded-lg bg-cine-teal/10 border border-cine-teal/30 flex items-center justify-center text-cine-teal font-mono text-sm mb-3">
              03
            </div>
            <h4 className="text-white font-heading font-semibold text-base mb-2">End-to-End Observability</h4>
            <p className="text-light-gray/70 text-xs font-sans leading-relaxed">
              Structured JSON logging with correlation IDs enables real-time CloudWatch metrics, sub-second error tracing, and actionable performance alerts.
            </p>
          </div>
        </div>
      </main>

      <ContactFooter />
    </div>
  );
};

export default AWSSkills;
