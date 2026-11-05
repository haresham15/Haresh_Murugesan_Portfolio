import React from 'react';
import Link from 'next/link';
import { archiveProjects } from '@/content/projects';

export const ArchivePreview: React.FC = () => {
  // Highlight TamilTrove, NYC OS, and other notable projects
  const previewList = archiveProjects.slice(0, 4);

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="p-6 sm:p-10 rounded-[2px] bg-[#070B12]/50 border border-[#F3EFE7]/[0.08]">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#F3EFE7]/[0.08] gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#D8B4FE] mb-1">
              Secondary Systems & Prototypes
            </p>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#F3EFE7] tracking-tight">
              Systems Archive Preview
            </h3>
          </div>
          <Link
            href="/projects"
            className="text-xs sm:text-sm font-sans font-semibold text-[#7DD3FC] hover:text-[#F3EFE7] transition-colors inline-flex items-center gap-1.5"
          >
            <span>View all 18 projects in index</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewList.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="p-5 rounded-[2px] bg-white/[0.02] hover:bg-white/[0.05] border border-[#F3EFE7]/[0.08] hover:border-[#F3EFE7]/15 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A6ADB8] mb-2">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h4 className="text-base font-heading font-semibold text-[#F3EFE7] group-hover:text-[#7DD3FC] transition-colors mb-2 leading-snug">
                  {project.title}
                </h4>
                <p className="text-xs font-sans text-[#A6ADB8] line-clamp-3 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F3EFE7]/[0.08] flex items-center justify-between text-[11px] font-mono text-[#7DD3FC]">
                <span>{project.highlight}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ArchivePreview;

