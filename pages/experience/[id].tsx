import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import {
  experiences,
  getExperienceById,
  getAllExperienceIds,
  ExperienceRecord,
} from '@/content/experience';
import { ExperienceLayout, ExperienceNavNeighbor } from '@/components/experience/ExperienceLayout';

interface ExperiencePageProps {
  experience: ExperienceRecord | null;
  prev: ExperienceNavNeighbor | null;
  next: ExperienceNavNeighbor | null;
}

export default function ExperienceDetailPage({ experience, prev, next }: ExperiencePageProps) {
  if (!experience) {
    return (
      <div className="min-h-screen bg-[#03050A] text-[#F4F6F9] flex flex-col items-center justify-center p-6 text-center">
        <Head>
          <title>Experience Not Found | Haresh Murugesan</title>
        </Head>
        <h1 className="text-2xl font-serif font-bold mb-2">Experience Record Not Found</h1>
        <p className="text-sm font-sans text-[#7E8B9B] mb-6">
          The requested career experience or research tenure could not be located.
        </p>
        <Link
          href="/#experience"
          className="px-5 py-2.5 rounded-[2px] bg-[#FF2800] text-[#03050A] text-sm font-sans font-medium hover:bg-[#C8D2E0] transition-colors"
        >
          Return to Experience Circuit
        </Link>
      </div>
    );
  }

  return <ExperienceLayout experience={experience} prev={prev} next={next} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = getAllExperienceIds();
  const paths = ids.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const experience = getExperienceById(id) || null;

  let prev: ExperienceNavNeighbor | null = null;
  let next: ExperienceNavNeighbor | null = null;

  if (experience) {
    const idx = experiences.findIndex((e) => e.id === experience.id);
    const total = experiences.length;

    if (total > 1) {
      const prevExp = experiences[(idx - 1 + total) % total];
      const nextExp = experiences[(idx + 1) % total];

      prev = {
        id: prevExp.id,
        company: prevExp.company,
        role: prevExp.role,
      };

      next = {
        id: nextExp.id,
        company: nextExp.company,
        role: nextExp.role,
      };
    }
  }

  return {
    props: {
      experience,
      prev,
      next,
    },
  };
};
