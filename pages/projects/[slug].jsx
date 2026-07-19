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
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default function ProjectCaseStudy({ project }) {
  if (!project) {
    return <div className="text-white p-20 flex items-center justify-center min-h-screen font-sans text-2xl tracking-widest uppercase">Project not found</div>;
  }

  const caseStudy = project.caseStudy || {};

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-[#050505]">
      <Head>
        <title>{project.title} | Case Study</title>
      </Head>
      
      <FractalGlassBackground />
      <Header />

      <main className="w-full pb-32 relative z-10">
        
        {/* HERO SECTION */}
        <div className="relative w-full h-[60vh] min-h-[400px] flex items-end justify-center mb-16 overflow-hidden">
          {project.image && (
            <div className="absolute inset-0 z-0">
              <Image 
                src={project.image} 
                alt={project.title} 
                layout="fill" 
                objectFit="cover" 
                className="opacity-40 object-top"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            </div>
          )}
          
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-12">
            <Link 
              href="/projects"
              className="text-light-gray/60 hover:text-cine-teal font-sans tracking-widest uppercase text-sm mb-6 inline-flex items-center gap-2 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Archive
            </Link>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-sans tracking-widest uppercase font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.title}
            </motion.h1>

            <motion.div 
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.stack && (
                <span className="text-cine-lavender font-sans tracking-widest uppercase px-4 py-2 text-sm border border-cine-lavender/30 bg-cine-lavender/5 rounded-full">
                  {project.stack}
                </span>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cine-teal hover:text-white font-sans tracking-widest uppercase text-sm border border-cine-teal/30 bg-cine-teal/10 px-6 py-2 rounded-full transition-all hover:bg-cine-teal/20">
                  GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-white hover:text-charcoal font-sans tracking-widest uppercase text-sm border border-white bg-white/10 hover:bg-white px-6 py-2 rounded-full transition-all">
                  Live Demo
                </a>
              )}
              {project.link && project.link !== '#' && !project.github && !project.demo && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cine-teal hover:text-white font-sans tracking-widest uppercase text-sm border border-cine-teal/30 bg-cine-teal/10 px-6 py-2 rounded-full transition-all hover:bg-cine-teal/20">
                  {project.link.includes('github.com') ? 'GitHub' : 'View Project'}
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
          
          {/* Main Body */}
          <div className="lg:col-span-8 space-y-8">
            
            {caseStudy.executiveSummary && (
              <motion.section 
                className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
                {...fadeIn}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cine-teal to-cine-lavender opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-light-gray/60 mb-6">
                  Executive Summary
                </h2>
                <p className="text-light-gray/90 font-inter leading-relaxed text-lg">
                  {caseStudy.executiveSummary}
                </p>
              </motion.section>
            )}

            {caseStudy.problem && (
              <motion.section 
                className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-cine-teal/30 transition-colors"
                {...fadeIn}
              >
                <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4 flex items-center gap-3">
                  <span className="text-3xl font-light text-cine-teal/50">01</span> The Problem
                </h3>
                <p className="text-light-gray/80 font-inter leading-relaxed text-lg">
                  {caseStudy.problem}
                </p>
              </motion.section>
            )}

            {caseStudy.architecture && (
              <motion.section 
                className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-cine-lavender/30 transition-colors"
                {...fadeIn}
              >
                <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-lavender mb-4 flex items-center gap-3">
                  <span className="text-3xl font-light text-cine-lavender/50">02</span> Approach & Architecture
                </h3>
                <p className="text-light-gray/80 font-inter leading-relaxed text-lg">
                  {caseStudy.architecture}
                </p>
              </motion.section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudy.tradeoffs && (
                <motion.section 
                  className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors"
                  {...fadeIn}
                >
                  <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-3xl font-light text-white/30">03</span> Tradeoffs
                  </h3>
                  <p className="text-light-gray/80 font-inter leading-relaxed">
                    {caseStudy.tradeoffs}
                  </p>
                </motion.section>
              )}

              {caseStudy.nextSteps && (
                <motion.section 
                  className="bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-cine-teal/30 transition-colors"
                  {...fadeIn}
                >
                  <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4 flex items-center gap-3">
                    <span className="text-3xl font-light text-cine-teal/30">04</span> Next Steps
                  </h3>
                  <p className="text-light-gray/80 font-inter leading-relaxed">
                    {caseStudy.nextSteps}
                  </p>
                </motion.section>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-3xl p-8 sticky top-32"
              {...fadeIn}
            >
              <h3 className="text-sm font-sans tracking-widest uppercase font-bold text-light-gray/50 mb-6">Project Metadata</h3>
              
              {project.icons && project.icons.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-sans tracking-widest uppercase text-light-gray/40 mb-3">Technologies</p>
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
                  <p className="text-xs font-sans tracking-widest uppercase text-light-gray/40 mb-3">TL;DR</p>
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
