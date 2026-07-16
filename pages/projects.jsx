import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FractalGlassBackground from '../src/components/FractalGlassBackground';
import { archiveProjects } from '../src/data/projects';

export default function Projects() {
 return (
  <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-black">
   <Head>
    <title>Project Archive - Haresh Murugesan</title>
   </Head>
   
   <FractalGlassBackground />
   
   <main className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
    <Link 
     href="/" 
     className="inline-flex items-center gap-2 mb-12 text-cine-teal hover:text-cine-lavender transition-colors font-sans tracking-widest uppercase group"
    >
     <span className="group-hover:-translate-x-1 transition-transform">←</span>
     Back to Portfolio
    </Link>
    
    <h1 className="text-6xl font-sans tracking-widest uppercase font-bold text-light-gray mb-16 text-center tracking-tight">
     Project Archive
    </h1>

    {/* Compact Bento Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
     {archiveProjects.map((project, index) => {
      // Dynamically assign some cards to span 2 columns for the bento layout aesthetic.
      // We use modulo to create a predictable but staggered pattern.
      const isWide = index % 5 === 0 || index % 7 === 0;
      const colSpanClass = isWide ? 'sm:col-span-2' : 'col-span-1';

      const MotionLink = motion(Link);

      return (
       <MotionLink
        key={index}
        href={`/projects/${project.slug}`}
        className={`group relative bg-black/40 backdrop-blur-md border border-white/5 hover:border-cine-teal/50 rounded-2xl p-6 transition-all duration-300 shadow-lg shadow-black/50 overflow-hidden flex flex-col justify-between ${colSpanClass} hover:-translate-y-1`}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: index * 0.03 }}
       >
        {/* Neon Hover Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cine-teal/5 to-transparent -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>

        <div className="relative z-10">
         <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 bg-cine-teal/10 text-cine-teal text-xs font-sans tracking-widest uppercase rounded-full border border-cine-teal/20 group-hover:border-cine-teal/50 transition-colors">
           {project.year}
          </span>
          <div className="text-light-gray/40 group-hover:text-cine-teal transition-colors">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </div>
         </div>
         
         <h3 className={`font-bold text-white mb-2 group-hover:text-cine-lavender transition-colors ${isWide ? 'text-2xl' : 'text-xl'}`}>
          {project.title}
         </h3>
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
         <p className="text-light-gray/50 font-sans tracking-widest uppercase text-xs uppercase tracking-wider leading-relaxed">
          {project.stack}
         </p>
        </div>
       </MotionLink>
      );
     })}
    </div>
   </main>
  </div>
 );
}
