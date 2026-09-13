import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import FractalGlassBackground from '../src/components/FractalGlassBackground';
import AntigravityParticles from '../src/components/AntigravityParticles';
import Header from '../src/components/Header';
import { spotlightProjects, archiveProjects } from '../src/data/projects';

export default function Projects() {
  const router = useRouter();
  const allProjects = useMemo(() => [...spotlightProjects, ...archiveProjects], []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Prefetch first batch of case studies on mount for instant clicks
  useEffect(() => {
    allProjects.slice(0, 8).forEach((p) => {
      if (p.slug) {
        router.prefetch(`/projects/${p.slug}`);
      }
    });
  }, [allProjects, router]);

  const categories = useMemo(() => {
    const counts = { All: allProjects.length };
    allProjects.forEach(p => {
      const cat = p.category || 'Full-Stack Systems';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return [
      { name: 'All', count: counts.All },
      { name: 'AI & Vision', count: counts['AI & Vision'] || 0 },
      { name: 'Full-Stack Systems', count: counts['Full-Stack Systems'] || 0 },
      { name: 'Research & Data', count: counts['Research & Data'] || 0 },
      { name: 'Systems & Core', count: counts['Systems & Core'] || 0 },
    ];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter(project => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = project.title?.toLowerCase().includes(q);
      const stackMatch = project.stack?.toLowerCase().includes(q);
      const descMatch = project.description?.toLowerCase().includes(q);
      const highlightMatch = project.highlight?.toLowerCase().includes(q);

      return titleMatch || stackMatch || descMatch || highlightMatch;
    });
  }, [allProjects, selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-hidden relative bg-[#050505]">
      <Head>
        <title>Project Archive | Haresh Murugesan</title>
        <meta name="description" content="Comprehensive engineering archive of 17 AI systems, computer vision models, and full-stack web applications built by Haresh Murugesan." />
        <meta property="og:title" content="Project Archive | Haresh Murugesan" />
        <meta property="og:description" content="Explore 17 software engineering systems, explainable AI pipelines, and data-driven platforms." />
        <meta property="og:url" content="https://hareshmurugesan.com/projects" />
      </Head>
      
      {/* Background Visual Layer */}
      <FractalGlassBackground />
      <AntigravityParticles />

      {/* Global Header */}
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 pt-24 sm:pt-28 pb-24 sm:pb-32 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-cine-teal hover:text-cine-lavender transition-colors font-sans text-xs sm:text-sm font-medium group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-3 sm:mb-4 tracking-tight">
            Project Archive
          </h1>
          <p className="text-light-gray/60 font-sans text-xs sm:text-base leading-relaxed px-4">
            A comprehensive catalog of {allProjects.length} engineering systems, computer vision pipelines, and full-stack architectures.
          </p>
        </div>

        {/* Controls: Search Bar & Filter Tabs */}
        <div className="flex flex-col gap-5 sm:gap-6 mb-10 sm:mb-12">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-light-gray/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, technology (Python, Next.js, OpenCV), or metric..."
              className="w-full bg-black/50 border border-white/10 focus:border-cine-teal/70 rounded-full pl-11 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-light-gray/40 font-sans focus:outline-none backdrop-blur-md transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-light-gray/40 hover:text-white transition-colors text-sm"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;

              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full font-sans text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-cine-teal/15 border-cine-teal text-cine-teal shadow-[0_0_15px_rgba(5,213,186,0.2)]'
                      : 'bg-black/40 border-white/10 text-light-gray/60 hover:text-light-gray hover:border-white/30'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-cine-teal/30 text-white' : 'bg-white/10 text-light-gray/40'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <span className="text-xs font-mono text-light-gray/50">
            Showing {filteredProjects.length} of {allProjects.length} projects
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-cine-teal hover:underline font-sans tracking-wide"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Bento Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 auto-rows-fr"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const isSpotlight = spotlightProjects.some(sp => sp.slug === project.slug);
                const hasCaseStudy = Boolean(project.slug);
                const hasDemo = Boolean(project.demo && project.demo !== project.github);
                const hasGithub = Boolean(project.github || (project.link && project.link.includes('github.com')));
                const repoUrl = project.github || project.link;

                const handleCardClick = (e) => {
                  if (e.target.closest('a[target="_blank"]') || e.target.closest('button')) {
                    return;
                  }
                  if (hasCaseStudy) {
                    router.push(`/projects/${project.slug}`);
                  } else if (project.demo) {
                    window.open(project.demo, '_blank', 'noopener,noreferrer');
                  } else if (repoUrl) {
                    window.open(repoUrl, '_blank', 'noopener,noreferrer');
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
                    layout
                    key={project.slug || index}
                    role="link"
                    tabIndex={0}
                    onClick={handleCardClick}
                    onKeyDown={handleCardKeyDown}
                    onMouseEnter={() => {
                      if (hasCaseStudy) {
                        router.prefetch(`/projects/${project.slug}`);
                      }
                    }}
                    className="group relative bg-[#090d16]/70 backdrop-blur-md border border-white/10 hover:border-cine-teal/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-xl shadow-black/60 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-cine-glow-teal cursor-pointer focus:outline-none focus:ring-2 focus:ring-cine-teal/50"
                    initial={{ opacity: 0, scale: 0.96, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                  >
                    {/* Ambient Glow Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cine-teal/5 to-transparent -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out pointer-events-none"></div>

                    <div className="relative z-10">
                      {/* Top Meta Bar */}
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-cine-teal/10 text-cine-teal text-[11px] font-mono font-medium rounded-full border border-cine-teal/20">
                            {project.year || '2026'}
                          </span>
                          {project.highlight && (
                            <span className="px-2.5 py-0.5 bg-cine-lavender/10 text-cine-lavender text-[10px] font-mono font-medium rounded-full border border-cine-lavender/30">
                              {project.highlight}
                            </span>
                          )}
                          {isSpotlight && (
                            <span className="px-2 py-0.5 bg-white/10 text-white text-[9px] font-mono font-medium rounded-full border border-white/20">
                              Spotlight
                            </span>
                          )}
                        </div>

                        {hasCaseStudy && (
                          <div 
                            className="text-light-gray/40 group-hover:text-cine-teal transition-colors p-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            title="Read Case Study"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Project Title */}
                      <h3 className="text-lg sm:text-xl font-heading font-semibold text-white mb-2 group-hover:text-cine-teal transition-colors leading-snug tracking-tight flex items-center justify-between">
                        <span>{project.title}</span>
                      </h3>

                      {/* Description Snippet */}
                      <p className="text-light-gray/70 font-sans text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description || project.caseStudy?.executiveSummary}
                      </p>
                    </div>

                    {/* Bottom Metadata & Links */}
                    <div className="relative z-10 mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                      {/* Tech Stack & Icons */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-light-gray/50 font-mono text-[10px] sm:text-xs truncate">
                          {project.stack}
                        </p>
                        <div className="flex gap-1.5 shrink-0">
                          {project.icons?.slice(0, 4).map((icon, i) => (
                            <span key={i} className="opacity-70 group-hover:opacity-100 transition-opacity">
                              <Image src={`/icons/${icon}`} alt="tech-icon" width={16} height={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Links Bar */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {hasCaseStudy && (
                          <span
                            className="text-cine-lavender group-hover:text-white group-hover:bg-cine-teal group-hover:border-cine-teal group-hover:text-charcoal transition-all text-[11px] sm:text-xs font-sans font-medium border border-cine-lavender/30 px-2.5 py-1 rounded-full bg-cine-lavender/5"
                          >
                            Case Study →
                          </span>
                        )}
                        {hasDemo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white hover:text-cine-teal transition-colors text-[11px] sm:text-xs font-sans font-medium border border-white/20 hover:border-cine-teal/40 px-2.5 py-1 rounded-full bg-white/5"
                          >
                            Demo ↗
                          </a>
                        )}
                        {repoUrl && (
                          <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cine-teal hover:text-cine-lavender transition-colors text-[11px] sm:text-xs font-sans font-medium border border-cine-teal/20 hover:border-cine-lavender/40 px-2.5 py-1 rounded-full bg-cine-teal/5"
                          >
                            Code ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-black/30 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
            <p className="text-white font-heading font-semibold text-lg mb-2 tracking-tight">No projects found</p>
            <p className="text-light-gray/60 font-sans text-xs sm:text-sm mb-6">
              No projects match "{searchQuery}". Try searching for another keyword like "Python", "React", "Next.js", or "AI".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-6 py-2 bg-cine-teal/20 border border-cine-teal text-cine-teal rounded-full font-sans text-xs font-medium hover:bg-cine-teal hover:text-black transition-all"
            >
              Clear Search & Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
