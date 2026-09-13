import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { spotlightProjects, archiveProjects } from '../../src/data/projects';
import FractalGlassBackground from '../../src/components/FractalGlassBackground';
import Header from '../../src/components/Header';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function ProjectCaseStudy({ project }) {
  if (!project) {
    return <div className="text-white p-20 flex items-center justify-center min-h-screen font-heading text-2xl tracking-widest uppercase">Project not found</div>;
  }

  const caseStudy = project.caseStudy || {};

  const isArchive = archiveProjects.some(p => p.slug === project.slug);
  const backHref = isArchive ? "/projects" : "/";
  const backText = isArchive ? "Back to Archive" : "Back to Home";

  const hasDistinctDemo = project.demo && project.demo !== project.github;

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-[#050505]">
      <Head>
        <title>{`${project.title} | Case Study`}</title>
        {project.description && <meta name="description" content={project.description} />}
        <meta property="og:title" content={`${project.title} | Case Study`} />
        {project.description && <meta property="og:description" content={project.description} />}
        <meta property="og:image" content={project.image ? `https://hareshmurugesan.com${project.image}` : "https://hareshmurugesan.com/preview-image.jpeg"} />
        <meta property="og:url" content={`https://hareshmurugesan.com/projects/${project.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.title} | Case Study`} />
        {project.description && <meta name="twitter:description" content={project.description} />}
        <meta name="twitter:image" content={project.image ? `https://hareshmurugesan.com${project.image}` : "https://hareshmurugesan.com/preview-image.jpeg"} />
      </Head>
      
      <FractalGlassBackground />
      <Header />

      <main className="w-full pt-24 sm:pt-28 pb-32 relative z-10">
        
        {/* HERO SECTION */}
        <div className="relative w-full border-b border-white/10 mb-12 sm:mb-16">
          {project.image && (
            <div className="absolute inset-0 z-0 overflow-hidden opacity-15 filter blur-xl pointer-events-none">
              <Image 
                src={project.image} 
                alt={project.title}
                width={1200}
                height={600}
                priority
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12">
            <Link 
              href={backHref}
              className="text-light-gray/60 hover:text-cine-teal font-sans text-xs sm:text-sm font-medium mb-6 inline-flex items-center gap-2 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              {backText}
            </Link>
            
            <motion.h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.title}
            </motion.h1>

            <motion.div 
              className="flex flex-wrap items-center gap-2.5 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.stack && (
                <span className="text-cine-lavender font-mono text-xs sm:text-sm px-3.5 py-1.5 border border-cine-lavender/30 bg-cine-lavender/5 rounded-full font-medium">
                  {project.stack}
                </span>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cine-teal hover:text-white font-sans text-xs sm:text-sm font-medium border border-cine-teal/30 bg-cine-teal/10 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full transition-all hover:bg-cine-teal/20">
                  GitHub ↗
                </a>
              )}
              {hasDistinctDemo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-white hover:text-charcoal font-sans text-xs sm:text-sm font-medium border border-white bg-white/10 hover:bg-white hover:text-black px-4 py-1.5 sm:px-6 sm:py-2 rounded-full transition-all">
                  Live Demo ↗
                </a>
              )}
              {project.link && project.link !== '#' && !project.github && !hasDistinctDemo && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cine-teal hover:text-white font-sans text-xs sm:text-sm font-medium border border-cine-teal/30 bg-cine-teal/10 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full transition-all hover:bg-cine-teal/20">
                  {project.link.includes('github.com') ? 'GitHub ↗' : 'View Project ↗'}
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
          
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* High-Resolution System Interface Preview */}
            {project.image && (
              <motion.div 
                className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 group relative hover:border-cine-teal/40 transition-colors"
                {...fadeIn}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} System Interface`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>
              </motion.div>
            )}

            {caseStudy.executiveSummary && (
              <motion.section 
                className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden group"
                {...fadeIn}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cine-teal to-cine-lavender opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-4 sm:mb-6 tracking-tight">
                  Executive Summary
                </h2>
                <p className="text-light-gray/90 font-inter leading-relaxed text-sm sm:text-base md:text-lg">
                  {caseStudy.executiveSummary}
                </p>
              </motion.section>
            )}

            {/* Quantified Benchmarks & Metrics */}
            {caseStudy.metrics && caseStudy.metrics.length > 0 && (
              <motion.section 
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-8 hover:border-cine-teal/30 transition-colors relative overflow-hidden"
                {...fadeIn}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-cine-teal flex items-center gap-2 sm:gap-3 tracking-tight">
                    <span className="text-xl sm:text-2xl text-cine-teal">⚡</span> Quantified Benchmarks & Metrics
                  </h3>
                  <span className="text-xs font-mono font-medium text-cine-teal px-2.5 py-1 bg-cine-teal/10 border border-cine-teal/30 rounded-full shrink-0">
                    Grounded Metrics
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {caseStudy.metrics.map((metric, i) => (
                    <div key={i} className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cine-teal/40 transition-all flex flex-col justify-between">
                      <span className="text-xs font-mono text-light-gray/50 mb-1">{metric.label}</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight my-1">{metric.value}</span>
                      <span className="text-xs text-light-gray/60 font-sans leading-relaxed">{metric.detail}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {caseStudy.problem && (
              <motion.section 
                className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 sm:p-8 hover:border-cine-teal/30 transition-colors"
                {...fadeIn}
              >
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-cine-teal mb-3 sm:mb-4 flex items-center gap-3 tracking-tight">
                  <span className="text-2xl sm:text-3xl font-mono text-cine-teal/50">01</span> The Problem
                </h3>
                <p className="text-light-gray/80 font-inter leading-relaxed text-sm sm:text-base md:text-lg">
                  {caseStudy.problem}
                </p>
              </motion.section>
            )}

            {caseStudy.architecture && (
              <motion.section 
                className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 sm:p-8 hover:border-cine-lavender/30 transition-colors"
                {...fadeIn}
              >
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-cine-lavender mb-3 sm:mb-4 flex items-center gap-3 tracking-tight">
                  <span className="text-2xl sm:text-3xl font-mono text-cine-lavender/50">02</span> Approach & Architecture
                </h3>
                <p className="text-light-gray/80 font-inter leading-relaxed text-sm sm:text-base md:text-lg">
                  {caseStudy.architecture}
                </p>
              </motion.section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {caseStudy.tradeoffs && (
                <motion.section 
                  className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 sm:p-8 hover:border-white/20 transition-colors"
                  {...fadeIn}
                >
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-3 sm:mb-4 flex items-center gap-3 tracking-tight">
                    <span className="text-2xl sm:text-3xl font-mono text-white/30">03</span> Tradeoffs
                  </h3>
                  <p className="text-light-gray/80 font-inter leading-relaxed text-xs sm:text-sm">
                    {caseStudy.tradeoffs}
                  </p>
                </motion.section>
              )}

              {caseStudy.nextSteps && (
                <motion.section 
                  className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 sm:p-8 hover:border-cine-teal/30 transition-colors"
                  {...fadeIn}
                >
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-cine-teal mb-3 sm:mb-4 flex items-center gap-3 tracking-tight">
                    <span className="text-2xl sm:text-3xl font-mono text-cine-teal/30">04</span> Next Steps
                  </h3>
                  <p className="text-light-gray/80 font-inter leading-relaxed text-xs sm:text-sm">
                    {caseStudy.nextSteps}
                  </p>
                </motion.section>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-3xl p-5 sm:p-8 lg:sticky lg:top-32"
              {...fadeIn}
            >
              <h3 className="text-xs font-mono text-light-gray/50 mb-6 font-medium">Project Metadata</h3>
              
              {project.icons && project.icons.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-mono text-light-gray/40 mb-3">Technologies</p>
                  <div className="flex flex-wrap gap-3">
                    {project.icons.map((icon, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2">
                        <Image src={`/icons/${icon}`} alt="tech-icon" width={24} height={24} className="opacity-80" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.description && (
                <div>
                  <p className="text-xs font-mono text-light-gray/40 mb-3">Summary</p>
                  <p className="text-light-gray/70 font-inter text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  const allProjects = [...spotlightProjects, ...archiveProjects];
  
  const paths = allProjects
    .filter(p => p.slug)
    .map((p) => ({
      params: { slug: p.slug },
    }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const allProjects = [...spotlightProjects, ...archiveProjects];
  const project = allProjects.find((p) => p.slug === params.slug);
  
  return { props: { project: project || null } };
}
