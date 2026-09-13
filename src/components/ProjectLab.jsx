import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { spotlightProjects } from '../data/projects';

const ProjectLab = () => {
  const router = useRouter();

  // Prefetch all spotlight case studies on mount for instant zero-latency loading
  useEffect(() => {
    spotlightProjects.forEach((project) => {
      if (project.slug) {
        router.prefetch(`/projects/${project.slug}`);
      }
    });
  }, [router]);

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-8 sm:mb-16 text-center">
        Projects
      </h2>

      {/* Spotlight Section */}
      <div className="mb-12 sm:mb-20">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-white">
            Spotlight
          </h3>
          <span className="text-xs font-mono font-medium text-cine-teal px-3 py-1 bg-cine-teal/10 border border-cine-teal/30 rounded-full">
            Featured Systems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {spotlightProjects.map((project, index) => {
            const hasDistinctDemo = project.demo && project.demo !== project.github;
            const targetUrl = project.slug ? `/projects/${project.slug}` : (project.demo || project.github || '#');

            const handleCardClick = (e) => {
              // Prevent navigating if user clicked an explicit external link or icon
              if (e.target.closest('a[target="_blank"]') || e.target.closest('a[href^="#"]')) {
                return;
              }
              if (project.slug) {
                router.push(`/projects/${project.slug}`);
              }
            };

            const handleCardKeyDown = (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(e);
              }
            };

            return (
              <motion.div
                key={index}
                role="link"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                onMouseEnter={() => {
                  if (project.slug) {
                    router.prefetch(`/projects/${project.slug}`);
                  }
                }}
                className="bg-white/[0.02] border border-white/5 hover:border-cine-teal/50 hover:bg-white/[0.04] rounded-2xl p-4 sm:p-6 overflow-hidden relative transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/40 cursor-pointer hover:shadow-cine-glow-teal hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cine-teal/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div>
                  {project.image ? (
                    <div className="w-full h-44 sm:h-52 relative overflow-hidden rounded-xl mb-4 sm:mb-5 bg-black/50 border border-white/5 group-hover:border-cine-teal/30 transition-colors">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-[11px] font-mono text-white/90 bg-black/70 px-2.5 py-1 rounded-md border border-white/20 backdrop-blur-sm">
                          Click anywhere to read Case Study →
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-44 sm:h-52 bg-cine-lavender/10 rounded-xl mb-4 sm:mb-5 flex items-center justify-center border border-white/5">
                      <p className="text-light-gray/40 font-sans text-xs sm:text-sm">Project Preview</p>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2.5 sm:mb-3 gap-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-white flex-1 tracking-tight group-hover:text-cine-teal transition-colors leading-snug flex items-center gap-2">
                      {project.title}
                      <span className="text-light-gray/30 group-hover:text-cine-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base shrink-0">
                        ↗
                      </span>
                    </h3>
                    <div className="flex gap-1.5 sm:gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {project.icons?.map((icon, i) => (
                        <a 
                          key={i} 
                          href={`#skill-${icon.split('.')[0]}`} 
                          className="hover:scale-125 transition-transform" 
                          title={icon.split('.')[0]}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Image src={`/icons/${icon}`} alt="tech-icon" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <p className="text-light-gray/70 font-sans mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3.5 sm:pt-4 border-t border-white/5 mt-auto">
                  {project.slug && (
                    <Link
                      href={`/projects/${project.slug}`}
                      prefetch={true}
                      onClick={(e) => e.stopPropagation()}
                      className="text-cine-lavender group-hover:text-white group-hover:bg-cine-teal group-hover:border-cine-teal group-hover:text-charcoal transition-all text-xs font-sans font-medium flex items-center gap-1.5 border border-cine-lavender/40 px-3 py-1.5 rounded-full bg-cine-lavender/5"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      Case Study →
                    </Link>
                  )}
                  {hasDistinctDemo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white hover:text-cine-teal transition-colors text-xs font-sans font-medium border border-white/20 hover:border-cine-teal/40 px-3 py-1.5 rounded-full bg-white/5"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-cine-teal hover:text-cine-lavender transition-colors text-xs font-sans font-medium border border-cine-teal/20 hover:border-cine-lavender/40 px-3 py-1.5 rounded-full bg-cine-teal/5"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Archive Link */}
      <div className="mt-8 sm:mt-12 flex justify-center">
        <Link
          href="/projects"
          className="group relative px-6 py-3 sm:px-10 sm:py-4 bg-black/40 backdrop-blur-md border border-white/10 hover:border-cine-teal/50 text-white font-sans font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-black/50 hover:shadow-cine-glow-teal overflow-hidden text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cine-teal/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>

          <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
            View Full Archive
            <motion.span className="text-cine-teal group-hover:translate-x-1 transition-transform">
              →
            </motion.span>
          </span>
        </Link>
      </div>
    </section>
  );
};

export default ProjectLab;
