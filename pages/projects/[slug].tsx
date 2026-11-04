import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { allProjects, getProjectBySlug, getAllProjectSlugs, Project } from '@/content/projects';
import { CaseStudyLayout } from '@/components/case-study/CaseStudyLayout';

interface ProjectPageProps {
  project: Project | null;
}

export default function ProjectPage({ project }: ProjectPageProps) {
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

  return <CaseStudyLayout project={project} />;
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

  return {
    props: {
      project,
    },
  };
};
