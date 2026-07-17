import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { spotlightProjects, archiveProjects } from '../../src/data/projects';
import FractalGlassBackground from '../../src/components/FractalGlassBackground';
import Header from '../../src/components/Header';

export default function ProjectCaseStudy({ project }) {
 if (!project) {
  return <div className="text-white p-20">Project not found</div>;
 }

 // Fallbacks if the project doesn't have a case study object yet (failsafe)
 const caseStudy = project.caseStudy || {};

 return (
  <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-[#050505]">
   <Head>
    <title>{project.title} | Case Study</title>
   </Head>
   
   <FractalGlassBackground />
   <Header />

   <main className="w-full max-w-4xl mx-auto px-4 py-32 relative z-10">
    <Link 
     href="/projects"
     className="text-light-gray/60 hover:text-cine-teal font-sans tracking-widest uppercase text-sm mb-8 inline-block transition-colors"
    >
     ← Back to Archive
    </Link>

    <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
    >
     <h1 className="text-4xl md:text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-white mb-6">
      {project.title}
     </h1>
     
     <div className="flex flex-wrap gap-4 mb-12">
      {project.github && (
       <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cine-teal hover:text-white font-sans tracking-widest uppercase border border-cine-teal/30 bg-cine-teal/10 px-4 py-2 rounded-full transition-colors">
        GitHub Repository
       </a>
      )}
      {project.demo && (
       <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-cine-lavender hover:text-white font-sans tracking-widest uppercase border border-cine-lavender/30 bg-cine-lavender/10 px-4 py-2 rounded-full transition-colors">
        Live Demo
       </a>
      )}
      {/* If it's an archive project, it might just have 'link' */}
      {project.link && project.link !== '#' && !project.github && !project.demo && (
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cine-teal hover:text-white font-sans tracking-widest uppercase border border-cine-teal/30 bg-cine-teal/10 px-4 py-2 rounded-full transition-colors">
         {project.link.includes('github.com') ? 'GitHub Repository' : 'View Project'}
        </a>
      )}
      
      {project.stack && (
       <span className="text-light-gray/60 font-sans tracking-widest uppercase px-4 py-2 flex items-center border border-white/5 rounded-full">
        Stack: {project.stack}
       </span>
      )}
     </div>

     {caseStudy.executiveSummary && (
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-12 shadow-lg shadow-black/50">
       <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-white mb-4">Executive Summary</h2>
       <p className="text-light-gray/80 font-sans leading-relaxed text-lg">
        {caseStudy.executiveSummary}
       </p>
      </div>
     )}

     <div className="space-y-12">
      {/* The Problem */}
      {caseStudy.problem && (
       <section>
        <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4 flex items-center gap-2">
         <span className="text-2xl">01.</span> The Problem
        </h3>
        <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10">
         {caseStudy.problem}
        </p>
       </section>
      )}

      {/* Architecture */}
      {caseStudy.architecture && (
       <section>
        <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4 flex items-center gap-2">
         <span className="text-2xl">02.</span> The Approach & Architecture
        </h3>
        <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10 mb-6">
         {caseStudy.architecture}
        </p>
       </section>
      )}

      {/* Tradeoffs */}
      {caseStudy.tradeoffs && (
       <section>
        <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4 flex items-center gap-2">
         <span className="text-2xl">03.</span> Tradeoffs
        </h3>
        <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10">
         {caseStudy.tradeoffs}
        </p>
       </section>
      )}

      {/* Next Steps */}
      {caseStudy.nextSteps && (
       <section>
        <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-cine-teal mb-4 flex items-center gap-2">
         <span className="text-2xl">04.</span> Next Steps
        </h3>
        <p className="text-light-gray/80 font-sans leading-relaxed pl-8 border-l border-white/10">
         {caseStudy.nextSteps}
        </p>
       </section>
      )}
     </div>
    </motion.div>
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
