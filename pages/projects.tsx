import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { allProjects, Project } from '@/content/projects';

export default function ProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync category with URL query param if present
  useEffect(() => {
    if (router.isReady && router.query.category) {
      const cat = String(router.query.category);
      if (['All', 'AI & Vision', 'Full-Stack Systems', 'Research & Data', 'Systems & Core'].includes(cat)) {
        setSelectedCategory(cat);
      }
    }
  }, [router.isReady, router.query.category]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    router.replace(
      {
        pathname: '/projects',
        query: cat === 'All' ? {} : { category: cat },
      },
      undefined,
      { shallow: true }
    );
  };

  const categories = useMemo(() => {
    const counts: Record<string, number> = { All: allProjects.length };
    allProjects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return [
      { name: 'All', count: counts.All },
      { name: 'AI & Vision', count: counts['AI & Vision'] || 0 },
      { name: 'Full-Stack Systems', count: counts['Full-Stack Systems'] || 0 },
      { name: 'Research & Data', count: counts['Research & Data'] || 0 },
      { name: 'Systems & Core', count: counts['Systems & Core'] || 0 },
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project: Project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = project.title.toLowerCase().includes(q);
      const stackMatch = project.stack.toLowerCase().includes(q);
      const descMatch = project.description.toLowerCase().includes(q);
      const highlightMatch = project.highlight.toLowerCase().includes(q);

      return titleMatch || stackMatch || descMatch || highlightMatch;
    });
  }, [selectedCategory, searchQuery]);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects & Technical Systems Index | Haresh Murugesan',
    description: 'Searchable archive of 18 software systems, AI pipelines, and research prototypes by Haresh Murugesan.',
    url: 'https://hareshmurugesan.com/projects',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Haresh Murugesan — Software & Systems Architecture',
      url: 'https://hareshmurugesan.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allProjects.length,
      itemListElement: allProjects.map((proj, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://hareshmurugesan.com/projects/${proj.slug}`,
        name: proj.title,
        description: proj.description,
      })),
    },
  };

  return (
    <>
      <Head>
        <title>Projects & Technical Systems Index | Haresh Murugesan</title>
        <meta
          name="description"
          content="Complete searchable and filterable index of software systems, AI pipelines, and research projects by Haresh Murugesan."
        />
        <link rel="canonical" href="https://hareshmurugesan.com/projects" />
        <meta property="og:title" content="Projects Index | Haresh Murugesan" />
        <meta property="og:description" content="Search all 18 engineering case studies, systems, and prototypes." />
        <meta property="og:url" content="https://hareshmurugesan.com/projects" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hareshmurugesan.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects Index | Haresh Murugesan" />
        <meta name="twitter:description" content="Search all 18 engineering case studies, systems, and prototypes." />
        <meta name="twitter:image" content="https://hareshmurugesan.com/og-image.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>

      <div className="w-full min-h-screen bg-[#050505] text-[#E0E0E0] overflow-x-hidden flex flex-col">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-24">
          
          {/* Page Heading */}
          <div className="mb-10 sm:mb-14 max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-widest text-[#7DD3FC] mb-2">
              Engineering Archive
            </p>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white tracking-tight mb-4">
              All Systems & Case Studies
            </h1>
            <p className="text-sm sm:text-base font-sans text-[#A6ADB8] leading-relaxed">
              Explore 18 verified engineering projects, prototypes, and research tools spanning explainable computer vision, high-concurrency simulation, and spatial optimization.
            </p>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <input
                id="project-search"
                name="project-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword, tech, or metric..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#0D1118] border border-white/10 text-sm font-sans text-white placeholder-[#A6ADB8]/60 focus:outline-none focus:border-[#7DD3FC] transition-colors"
                aria-label="Search projects by keyword, technology, or metric"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-[#A6ADB8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1" role="tablist">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-[#7DD3FC]/15 border-[#7DD3FC] text-[#7DD3FC]'
                        : 'bg-[#0D1118] border-white/10 text-[#A6ADB8] hover:text-white hover:border-white/20'
                    }`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <span>{cat.name}</span>
                    <span className="ml-1.5 opacity-70">({cat.count})</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Result Count Announcement for Accessibility */}
          <div aria-live="polite" className="text-xs font-mono text-[#A6ADB8] mb-6">
            Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} in {selectedCategory}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: Project) => (
                <div
                  key={project.slug}
                  className="p-6 rounded-3xl bg-[#0D1118]/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-token-card group"
                >
                  <div>
                    {/* Top Row: Year, Category, Status */}
                    <div className="flex items-center justify-between text-xs font-mono text-[#A6ADB8] mb-3">
                      <span>{project.category}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#7DD3FC]">
                        {project.statusBadge}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-heading font-bold text-white group-hover:text-[#7DD3FC] transition-colors mb-2 leading-snug">
                      <Link href={`/projects/${project.slug}`} className="focus:outline-none">
                        {project.title}
                      </Link>
                    </h2>

                    {/* Role & Highlight */}
                    <p className="text-xs font-mono text-[#D8B4FE] mb-3">
                      {project.highlight}
                    </p>

                    {/* Description */}
                    <p className="text-sm font-sans text-[#A6ADB8] line-clamp-3 leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Row: Stack & Link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#A6ADB8] line-clamp-1 max-w-[200px]">
                      {project.stack}
                    </span>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-mono font-semibold text-[#7DD3FC] hover:underline shrink-0"
                    >
                      Case Study →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#0D1118] border border-white/10 text-center">
              <p className="text-base font-heading font-semibold text-white mb-2">No projects match your filter.</p>
              <p className="text-xs font-mono text-[#A6ADB8] mb-4">Try clearing your search query or selecting &quot;All&quot;.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  handleCategoryChange('All');
                }}
                className="px-4 py-2 rounded-lg bg-white/10 text-xs font-mono text-white hover:bg-white/20"
              >
                Reset Filters
              </button>
            </div>
          )}

        </main>

        <SiteFooter />
      </div>
    </>
  );
}
