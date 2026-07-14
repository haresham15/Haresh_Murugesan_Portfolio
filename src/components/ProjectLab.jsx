import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { spotlightProjects, archiveProjects } from '../data/projects';

const ProjectLab = () => {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-6xl font-mono font-bold tracking-tight text-light-gray mb-16 text-center">
        Projects
      </h2>

      {/* Spotlight Section */}
      <div className="mb-20">
        <h3 className="text-3xl font-mono font-bold tracking-tight text-light-gray mb-8">
          Spotlight
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spotlightProjects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-neon-cyan/50 rounded-2xl p-6 overflow-hidden relative shadow-lg shadow-black/50 transition-all duration-300"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {hoveredProject === index && project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-neon-purple/10 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-light-gray/40 font-sans">Demo Image</p>
                </div>
              )}
              <h4 className="text-xl font-mono font-bold text-light-gray mb-2">
                {project.title}
              </h4>
              <p className="text-light-gray/70 font-sans mb-4 text-sm">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.icons.map((icon, i) => (
                  <img
                    key={i}
                    src={`/icons/${icon}`}
                    alt={icon}
                    className="w-6 h-6"
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-purple transition-colors text-sm font-sans"
                  >
                    GitHub →
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-purple transition-colors text-sm font-sans"
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Archive Section */}
      <div>
        <h3 className="text-3xl font-mono font-bold tracking-tight text-light-gray mb-8">
          Archive
        </h3>
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left p-4 text-light-gray font-mono">Year</th>
                <th className="text-left p-4 text-light-gray font-mono">Project</th>
                <th className="text-left p-4 text-light-gray font-mono">Stack</th>
                <th className="text-left p-4 text-light-gray font-mono">Link</th>
              </tr>
            </thead>
            <tbody>
              {archiveProjects.slice(0, 4).map((project, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-glass-border hover:bg-glass-bg/50 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="p-4 text-neon-cyan font-mono">{project.year}</td>
                  <td className="p-4 text-light-gray font-sans">{project.title}</td>
                  <td className="p-4 text-light-gray/70 font-sans">{project.stack}</td>
                  <td className="p-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-purple transition-colors font-sans"
                    >
                      View →
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/projects" className="group flex items-center gap-2 px-8 py-3 bg-black/40 backdrop-blur-md border border-white/10 hover:border-neon-cyan/50 text-light-gray font-mono rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/50">
            See All Archive
            <motion.span
              className="text-neon-cyan group-hover:translate-x-1 transition-transform"
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectLab;

