import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { getProjectBySlug, getAllProjectSlugs, projectsByTier, projectTier, Project } from '@/content/projects';
import { CaseStudyLayout, type ProjectLink } from '@/components/case-study/CaseStudyLayout';

interface ProjectPageProps {
  project: Project | null;
  prev: ProjectLink | null;
  next: ProjectLink | null;
}

export default function ProjectPage({ project, prev, next }: ProjectPageProps) {
  if (!project) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white flex flex-col items-center justify-center p-6 text-center">
        <Head>
          <title>Project Not Found | Haresh Murugesan</title>
        </Head>
        <h1 className="text-2xl font-heading font-bold mb-2">Project Case Study Not Found</h1>
        <p className="text-sm font-sans text-text-secondary mb-6">The requested engineering case study does not exist or has been moved.</p>
        <Link href="/#projects" className="px-5 py-2.5 rounded-sm bg-brand-orange text-canvas text-sm font-sans font-semibold">
          Return to Projects
        </Link>
      </div>
    );
  }

  return <CaseStudyLayout project={project} prev={prev} next={next} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllProjectSlugs();

  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const project = getProjectBySlug(slug) || null;

  // Flagships page through each other in Works order; everything else pages through the rest by tier.
  let prev: ProjectLink | null = null;
  let next: ProjectLink | null = null;
  if (project) {
    const isFlagship = projectTier(project) === 'flagship';
    const ring = projectsByTier.filter((p) => (projectTier(p) === 'flagship') === isFlagship);
    const i = ring.findIndex((p) => p.slug === project.slug);
    const at = (k: number) => {
      const p = ring[(k + ring.length) % ring.length];
      return { slug: p.slug, title: p.title };
    };
    if (ring.length > 1) {
      prev = at(i - 1);
      next = at(i + 1);
    }
  }

  return {
    props: {
      project,
      prev,
      next,
    },
  };
};
