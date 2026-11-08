import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ContactFooter from '@/components/ContactFooter';
import ForgedCarbonCanvas from '@/components/ForgedCarbonCanvas';
import { MotionPreferenceProvider } from '@/components/MotionPreference';
import { GridCrosshair } from '@/components/ui/GridCrosshair';
import { allProjects, Project } from '@/content/projects';
import SystemsCodeGraph from '@/components/SystemsCodeGraph';

export default function ProjectsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'AI & Vision' | 'Full-Stack Systems' | 'Research & Data' | 'Systems & Core'>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'flagship' | 'title'>('latest');
  const [viewFormat, setViewFormat] = useState<'topology' | 'table'>('topology');

  // Sync category & view format with URL query params if present
  useEffect(() => {
    if (router.isReady) {
      if (router.query.view && (router.query.view === 'topology' || router.query.view === 'table')) {
        setViewFormat(router.query.view as any);
      }
      if (router.query.category) {
        const cat = String(router.query.category);
        if (['All', 'AI & Vision', 'Full-Stack Systems', 'Research & Data', 'Systems & Core'].includes(cat)) {
          setSelectedCategory(cat as any);
        }
      }
      if (router.query.q) {
        setSearchQuery(String(router.query.q));
      }
    }
  }, [router.isReady, router.query]);

  const handleCategoryChange = (cat: 'All' | 'AI & Vision' | 'Full-Stack Systems' | 'Research & Data' | 'Systems & Core') => {
    setSelectedCategory(cat);
    const newQuery: Record<string, string> = {};
    if (cat !== 'All') newQuery.category = cat;
    if (searchQuery.trim()) newQuery.q = searchQuery;
    router.replace(
      {
        pathname: '/projects',
        query: newQuery,
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
      { name: 'All' as const, label: 'All Systems', count: counts.All },
      { name: 'AI & Vision' as const, label: 'AI & Vision', count: counts['AI & Vision'] || 0 },
      { name: 'Full-Stack Systems' as const, label: 'Full-Stack', count: counts['Full-Stack Systems'] || 0 },
      { name: 'Research & Data' as const, label: 'Research & Spatial', count: counts['Research & Data'] || 0 },
      { name: 'Systems & Core' as const, label: 'Systems & Core', count: counts['Systems & Core'] || 0 },
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    let result = allProjects.filter((project: Project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = project.title.toLowerCase().includes(q);
      const stackMatch = project.stack.toLowerCase().includes(q);
      const descMatch = project.description.toLowerCase().includes(q);
      const highlightMatch = project.highlight.toLowerCase().includes(q);
      const roleMatch = project.role.toLowerCase().includes(q);

      return titleMatch || stackMatch || descMatch || highlightMatch || roleMatch;
    });

    if (sortBy === 'latest') {
      result = [...result].sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10));
    } else if (sortBy === 'flagship') {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sortBy === 'title') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Engineering Systems Archive | Haresh Murugesan',
    description: 'Complete searchable telemetry sheet and repository index of 18 software systems, AI pipelines, and research prototypes by Haresh Murugesan.',
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
    <MotionPreferenceProvider>
      <Head>
        <title>Engineering Systems Archive | Haresh Murugesan</title>
        <meta
          name="description"
          content="Complete searchable ledger and timing sheet of 18 software systems, real-time simulation engines, clinical computer vision pipelines, and spatial models by Haresh Murugesan."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://hareshmurugesan.com/projects" />
        <meta property="og:title" content="Engineering Systems Archive | Haresh Murugesan" />
        <meta
          property="og:description"
          content="Searchable telemetry ledger indexing 18 software systems, AI pipelines, and research prototypes."
        />
        <meta property="og:url" content="https://hareshmurugesan.com/projects" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Engineering Systems Archive | Haresh Murugesan" />
        <meta
          name="twitter:description"
          content="Searchable telemetry ledger indexing 18 software systems, AI pipelines, and research prototypes."
        />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>

      <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-clip relative selection:bg-[#FF2800] selection:text-[#03050A]">
        {/* Procedural Dark Black Forged Carbon Background */}
        <ForgedCarbonCanvas />

        {/* Global Navigation Header */}
        <Header />

        <main id="main-content" className="relative z-10 w-full max-w-[1320px] mx-auto border-x border-[#18458B]/20 bg-[#03050A]/90 backdrop-blur-md shadow-2xl pt-24 sm:pt-28 pb-16 sm:pb-24">
          
          {/* 1. TOP ARCHITECTURAL DATUM STRIP */}
          <div className="w-full border-b border-[#18458B]/20 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#7E8B9B] bg-[#060A12]/95">
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:text-[#FF2800] transition-colors">HOME</Link>
              <span className="text-[#C8D2E0]/25">/</span>
              <span className="text-[#FF2800] font-semibold">PROJECT ARCHIVE</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="hidden sm:inline text-[#C8D2E0]">18 VERIFIED REPOSITORIES</span>
              <span className="text-[#10B981]">● STATIC EXPORT RUNTIME</span>
            </div>
          </div>

          {/* 2. PAGE HERO & TELEMETRY SUMMARY */}
          <section className="relative p-6 sm:p-10 lg:p-14 border-b border-[#18458B]/20 bg-[#060A12]/40">
            <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
            <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

            <div className="max-w-4xl space-y-5">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#FF2800]">
                <span className="w-6 h-px bg-[#FF2800]" />
                <span>ARCHITECTURAL REPOSITORY &amp; TELEMETRY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-raleway font-bold text-[#F4F6F9] tracking-tight leading-[1.05]">
                Engineering Systems Archive
              </h1>
              <p className="text-base sm:text-lg font-sans text-[#7E8B9B] max-w-3xl leading-[1.7] font-normal">
                Searchable telemetry ledger indexing 18 software systems, real-time simulation engines, clinical computer vision pipelines, and spatial transit models authored and maintained by Haresh Murugesan.
              </p>
            </div>

            {/* Architectural Telemetry Metric Gutter (Shared Hairlines) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#18458B]/20 divide-x divide-y lg:divide-y-0 divide-[#18458B]/20 mt-10 bg-[#0B1E40]/20 rounded-[2px] overflow-hidden">
              <div className="p-5 sm:p-6 space-y-1">
                <span className="text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider block">TOTAL SYSTEMS</span>
                <div className="text-3xl sm:text-4xl font-raleway font-bold text-[#FF2800] tabular-nums">18</div>
                <span className="text-xs font-sans text-[#7E8B9B] block">Documented codebases</span>
              </div>
              <div className="p-5 sm:p-6 space-y-1">
                <span className="text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider block">FLAGSHIP DEEP-DIVES</span>
                <div className="text-3xl sm:text-4xl font-raleway font-bold text-[#F4F6F9] tabular-nums">04</div>
                <span className="text-xs font-sans text-[#7E8B9B] block">Interactive case studies</span>
              </div>
              <div className="p-5 sm:p-6 space-y-1">
                <span className="text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider block">EDGE DISTRIBUTION</span>
                <div className="text-3xl sm:text-4xl font-raleway font-bold text-[#10B981] tabular-nums">100%</div>
                <span className="text-xs font-sans text-[#7E8B9B] block">Pre-rendered SSG export</span>
              </div>
              <div className="p-5 sm:p-6 space-y-1">
                <span className="text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider block">ACADEMIC RECOGNITION</span>
                <div className="text-3xl sm:text-4xl font-raleway font-bold text-[#C8D2E0] tabular-nums">2×</div>
                <span className="text-xs font-sans text-[#7E8B9B] block">ASA DataFest 1st Place</span>
              </div>
            </div>
          </section>

          {/* PRIMARY VIEW SWITCHER: Systems Topology vs Timing Sheet Ledger */}
          <section className="px-6 sm:px-8 lg:px-10 py-4 bg-[#060A12]/80 border-b border-[#18458B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="font-mono text-[#7E8B9B] uppercase tracking-wider text-[11px]">Exploration Mode:</span>
            </div>
            <div className="flex items-center border border-[#18458B]/30 bg-[#03050A] rounded-[2px] overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setViewFormat('topology')}
                className={`px-4 py-2 font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                  viewFormat === 'topology'
                    ? 'bg-[#FF2800] text-[#03050A] font-semibold'
                    : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                <span>Interactive Vector Topology</span>
                <span className="font-mono text-[11px] opacity-80">(18)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewFormat('table')}
                className={`px-4 py-2 font-medium transition-colors cursor-pointer flex items-center gap-2 border-l border-[#18458B]/30 ${
                  viewFormat === 'table'
                    ? 'bg-[#2563EB] text-[#F4F6F9] font-semibold'
                    : 'text-[#7E8B9B] hover:text-[#F4F6F9]'
                }`}
              >
                <span>Timing Sheet Ledger</span>
              </button>
            </div>
          </section>

          {/* 3. CONDITIONAL VIEW: TOPOLOGY GRAPH OR LEDGER */}
          {viewFormat === 'topology' ? (
            <section className="bg-transparent border-b border-[#18458B]/20">
              <SystemsCodeGraph />
            </section>
          ) : (
            <>
              {/* 3. INTERACTIVE CONTROL PANEL (0px Hairlines) */}
              <section className="p-6 sm:p-8 lg:p-10 border-b border-[#18458B]/20 bg-[#060A12]/40 relative space-y-6">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      id="archive-search"
                      name="archive-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by system, keyword, or tech stack..."
                      className="w-full px-4 py-3 pl-10 bg-[#060A12] border border-[#18458B]/30 rounded-[2px] text-xs font-mono text-[#F4F6F9] placeholder-[#7E8B9B] focus:outline-none focus:border-[#FF2800] transition-colors"
                      aria-label="Search systems by title, technology, or description"
                    />
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 text-[#7E8B9B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#7E8B9B] hover:text-[#F4F6F9] p-1 cursor-pointer"
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#7E8B9B] uppercase tracking-wider hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-3 bg-[#060A12] border border-[#18458B]/30 rounded-[2px] text-xs font-mono text-[#F4F6F9] focus:outline-none focus:border-[#FF2800] cursor-pointer"
                      aria-label="Sort projects"
                    >
                      <option value="latest">Latest First (2026 → 2023)</option>
                      <option value="flagship">Flagship Case Studies First</option>
                      <option value="title">Alphabetical (A → Z)</option>
                    </select>
                  </div>
                </div>

                {/* Category Filter Tabs (Zero-Radius 0px Hairline Group) */}
                <div className="flex flex-wrap items-center border border-[#18458B]/25 divide-x divide-[#18458B]/25 rounded-[2px] overflow-hidden text-xs font-mono" role="tablist">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => handleCategoryChange(cat.name)}
                        className={`px-4 py-2.5 transition-colors cursor-pointer select-none ${
                          isActive
                            ? 'bg-[#FF2800] text-[#03050A] font-semibold'
                            : 'bg-[#060A12] text-[#7E8B9B] hover:text-[#F4F6F9] hover:bg-[#0B1E40]/30'
                        }`}
                        role="tab"
                        aria-selected={isActive}
                      >
                        <span>{cat.label}</span>
                        <span className="ml-1.5 opacity-75 tabular-nums">({cat.count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Telemetry Results Badge */}
                <div className="flex items-center justify-between text-xs font-mono text-[#7E8B9B] pt-2 border-t border-[#18458B]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF2800]" />
                    <span>
                      Showing {filteredProjects.length} of {allProjects.length} systems
                      {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
                      {searchQuery.trim() && ` matching "${searchQuery}"`}
                    </span>
                  </div>
                  {(selectedCategory !== 'All' || searchQuery.trim()) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        handleCategoryChange('All');
                      }}
                      className="text-xs font-mono text-[#FF2800] hover:underline cursor-pointer"
                    >
                      Reset Filters ↺
                    </button>
                  )}
                </div>
              </section>

              {/* 4. COMPLETE F1 TIMING SHEET LEDGER (0px Continuous Hairlines) */}
              <section className="bg-transparent">
                <div className="border-b border-[#18458B]/20">
                  
                  {/* Desktop Table Headers */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 py-3.5 px-6 sm:px-8 text-[11px] font-mono text-[#7E8B9B] uppercase tracking-wider bg-[#060A12]/90 border-b border-[#18458B]/20">
                    <div className="col-span-1">INDEX</div>
                    <div className="col-span-4">SYSTEM / REPOSITORY</div>
                    <div className="col-span-4">DOMAIN &amp; TECHNICAL STACK</div>
                    <div className="col-span-1">VERIFIED BENCHMARK</div>
                    <div className="col-span-2 text-right">ACTION</div>
                  </div>

                  {/* Rows */}
                  {filteredProjects.length > 0 ? (
                    <div className="divide-y divide-[#18458B]/15">
                      {filteredProjects.map((proj, idx) => (
                        <article
                          key={proj.slug}
                          className="py-5 px-6 sm:px-8 hover:bg-[#0B1E40]/25 transition-colors group flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-start lg:items-center relative"
                        >
                          {/* Top Hairline Accent on hover */}
                          <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF2800]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Col 1: Monospace Index & Year */}
                          <div className="lg:col-span-1 text-xs font-mono text-[#FF2800] flex items-center gap-1.5 tabular-nums">
                            <span className="font-semibold">{(idx + 1).toString().padStart(2, '0')}</span>
                            <span className="text-[#7E8B9B] text-[10px]">/{proj.year}</span>
                          </div>

                          {/* Col 2: Title, Description, and Badges */}
                          <div className="lg:col-span-4 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                href={`/projects/${proj.slug}`}
                                className="text-lg font-serif text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors leading-snug font-normal"
                              >
                                {proj.title}
                              </Link>
                              {proj.featured && (
                                <span className="px-1.5 py-0.5 bg-[#FF2800]/20 border border-[#FF2800]/40 text-[#FF2800] text-[10px] font-mono uppercase tracking-wider rounded-[2px]">
                                  Flagship
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-sans text-[#7E8B9B] line-clamp-2 leading-relaxed">
                              {proj.description}
                            </p>
                            <div className="text-[11px] font-mono text-[#7E8B9B]">
                              <span>{proj.role}</span>
                            </div>
                          </div>

                          {/* Col 3: Stack & Domain */}
                          <div className="lg:col-span-4 space-y-1">
                            <div className="text-xs font-mono text-[#2563EB] leading-relaxed">
                              {proj.stack}
                            </div>
                            <div className="text-[11px] font-mono text-[#7E8B9B]">
                              <span className="text-[#C8D2E0]/40 uppercase text-[10px]">Category:</span> {proj.category}
                            </div>
                          </div>

                          {/* Col 4: Verified Benchmark / Status */}
                          <div className="lg:col-span-1 text-xs font-mono text-[#C8D2E0] tabular-nums font-medium">
                            <span className="lg:hidden text-[#7E8B9B] text-[10px] uppercase block">Benchmark:</span>
                            {proj.highlight || proj.statusBadge}
                          </div>

                          {/* Col 5: Actions (Case Study, Source, Demo) */}
                          <div className="lg:col-span-2 w-full lg:w-auto flex flex-wrap lg:justify-end items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#18458B]/15 text-xs font-mono">
                            <Link
                              href={`/projects/${proj.slug}`}
                              className="px-3 py-1.5 bg-[#060A12] hover:bg-[#0B1E40] text-[#F4F6F9] hover:text-[#FF2800] border border-[#18458B]/30 hover:border-[#FF2800] rounded-[2px] transition-colors inline-flex items-center gap-1 font-medium"
                            >
                              <span>Case Study</span>
                              <span>→</span>
                            </Link>
                            {proj.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 hover:bg-[#0B1E40] text-[#7E8B9B] hover:text-[#F4F6F9] border border-[#18458B]/20 rounded-[2px] transition-colors inline-flex items-center gap-1"
                                title="View GitHub Repository"
                              >
                                <span>Source</span>
                                <span className="text-[#FF2800]">↗</span>
                              </a>
                            )}
                            {proj.demo && (
                              <a
                                href={proj.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 hover:bg-[#0B1E40] text-[#7E8B9B] hover:text-[#F4F6F9] border border-[#18458B]/20 rounded-[2px] transition-colors inline-flex items-center gap-1"
                                title="Open Live Demonstration"
                              >
                                <span>Demo</span>
                                <span className="text-[#10B981]">↗</span>
                              </a>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 sm:p-16 text-center space-y-4 bg-[#060A12]/40">
                      <div className="text-2xl font-serif text-[#F4F6F9]">No systems match your filter criteria.</div>
                      <p className="text-xs font-mono text-[#7E8B9B] max-w-md mx-auto">
                        No repositories matched query &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          handleCategoryChange('All');
                        }}
                        className="px-4 py-2 bg-[#FF2800] text-[#03050A] font-mono text-xs font-semibold hover:bg-[#C8D2E0] transition-colors cursor-pointer rounded-[2px]"
                      >
                        Reset Filter Parameters
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* 5. AUTHORITY CLOSING & CONTACT (Rendered Once) */}
          <ContactFooter />
        </main>
      </div>
    </MotionPreferenceProvider>
  );
}
