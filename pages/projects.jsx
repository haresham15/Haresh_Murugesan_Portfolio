import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FractalGlassBackground from '../src/components/FractalGlassBackground';
import { archiveProjects, spotlightProjects } from '../src/data/projects';

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-black">
      <Head>
        <title>All Projects - Haresh Murugesan</title>
      </Head>
      
      <FractalGlassBackground />
      
      <main className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-12 text-neon-cyan hover:text-neon-purple transition-colors font-mono group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Portfolio
        </Link>
        
        <h1 className="text-6xl font-mono font-bold text-light-gray mb-16 text-center tracking-tight">
          All Projects
        </h1>
        
        {/* Spotlight Projects Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-mono font-bold text-neon-cyan mb-8 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-neon-cyan"></span>
            Spotlight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spotlightProjects.map((project, index) => (
              <motion.div
                key={index}
                className="bg-glass-bg backdrop-blur-xl border border-glass-border hover:border-neon-cyan/50 rounded-2xl p-8 overflow-hidden relative shadow-2xl shadow-black/80 transition-all duration-300 hover:-translate-y-2 group"
                onMouseEnter={() => setHoveredProject(index)}
                onMouseLeave={() => setHoveredProject(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {hoveredProject === index && project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 object-cover rounded-xl mb-6"
                  />
                ) : (
                  <div className="w-full h-56 bg-gradient-to-br from-neon-purple/5 to-neon-cyan/5 border border-white/5 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                    {/* Abstract decorative element */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-cyan/20 via-transparent to-transparent group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-light-gray/30 font-mono text-sm tracking-widest uppercase z-10">System Architecture</p>
                  </div>
                )}
                <h4 className="text-2xl font-bold text-white mb-3">
                  {project.title}
                </h4>
                <p className="text-light-gray/70 font-sans leading-relaxed mb-6 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.icons.map((icon, i) => (
                    <img
                      key={i}
                      src={`/icons/${icon}`}
                      alt={icon.replace('.svg', '')}
                      className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-purple transition-colors text-sm font-mono flex items-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      Repository
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-purple transition-colors text-sm font-mono flex items-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Project Archive Section */}
        <div>
          <h2 className="text-3xl font-mono font-bold text-light-gray mb-8 flex items-center gap-3 opacity-80">
            <span className="w-8 h-[1px] bg-light-gray"></span>
            Archive Log
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {archiveProjects.map((project, index) => (
              <motion.a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-black/40 backdrop-blur-md border border-white/5 hover:bg-black/60 hover:border-neon-cyan/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/50 block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + (index * 0.05) }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-neon-cyan font-mono text-sm">{project.year}</div>
                  <div className="text-light-gray/40 group-hover:text-neon-purple transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
                  {project.title}
                </h3>
                <p className="text-light-gray/60 font-sans text-sm mt-auto pt-4 border-t border-white/5">
                  {project.stack}
                </p>
              </motion.a>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
