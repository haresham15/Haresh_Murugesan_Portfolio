import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { spotlightProjects, archiveProjects } from '../data/projects';

const ProjectLab = () => {
 const [hoveredProject, setHoveredProject] = useState(null);

 return (
  <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-20">
   <h2 className="text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-16 text-center">
    Projects
   </h2>

   {/* Spotlight Section */}
   <div className="mb-20">
    <h3 className="text-3xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-8">
     Spotlight
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     {spotlightProjects.map((project, index) => (
      <motion.div
       key={index}
       className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-cine-teal/50 rounded-2xl p-6 overflow-hidden relative shadow-lg shadow-black/50 transition-all duration-300"
       onMouseEnter={() => setHoveredProject(index)}
       onMouseLeave={() => setHoveredProject(null)}
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{ duration: 1.2, delay: index * 0.1 }}
      >
       {hoveredProject === index && project.image ? (
        <img
         src={project.image}
         alt={project.title}
         className="w-full h-48 object-cover rounded-lg mb-4"
        />
       ) : (
        <div className="w-full h-48 bg-cine-lavender/10 rounded-lg mb-4 flex items-center justify-center">
         <p className="text-light-gray/40 font-sans">Demo Image</p>
        </div>
       )}
       
       <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-sans tracking-widest uppercase font-bold text-light-gray flex-1 tracking-tight">
         {project.title}
        </h3>
        <div className="flex gap-2 ml-4">
         {project.icons.map((icon, i) => (
          <img key={i} src={`/icons/${icon}`} alt="tech-icon" className="w-6 h-6 opacity-70" />
         ))}
        </div>
       </div>
       


       <p className="text-light-gray/70 font-sans mb-4 text-sm">
        {project.description}
       </p>
       
       <div className="flex gap-3">
        {project.github && (
         <a
          href={project.github}
          target="_blank" rel="noopener noreferrer"
          
          className="text-cine-teal hover:text-cine-lavender transition-colors text-sm font-sans"
         >
          GitHub →
         </a>
        )}
        {project.demo && (
         <a
          href={project.demo}
          target="_blank" rel="noopener noreferrer"
          
          className="text-cine-teal hover:text-cine-lavender transition-colors text-sm font-sans"
         >
          Live Demo →
         </a>
        )}
        {project.slug && (
         <Link
          href={`/projects/${project.slug}`}
          className="text-cine-lavender hover:text-cine-teal transition-colors text-sm font-sans tracking-widest uppercase flex items-center gap-2 border border-cine-lavender/50 px-3 py-1 rounded-full bg-cine-lavender/5 hover:bg-cine-teal/10"
         >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Read Case Study
         </Link>
        )}
       </div>
      </motion.div>
     ))}
    </div>
   </div>

   {/* Full Archive Link */}
   <div className="mt-12 flex justify-center">
    <Link href="/projects" className="group relative px-10 py-4 bg-black/40 backdrop-blur-md border border-white/10 hover:border-cine-teal/50 text-light-gray font-sans tracking-widest uppercase rounded-xl transition-all hover:scale-105 shadow-lg shadow-black/50 overflow-hidden">
     {/* Hover sweep effect */}
     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cine-teal/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
     
     <span className="relative z-10 flex items-center gap-3 text-lg">
      View Full Archive
      <motion.span
       className="text-cine-teal group-hover:translate-x-1 transition-transform"
      >
       →
      </motion.span>
     </span>
    </Link>
   </div>
  </section>
 );
};

export default ProjectLab;

