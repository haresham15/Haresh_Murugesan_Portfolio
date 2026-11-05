import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import { ContactFooter } from '@/components/ContactFooter';
import { GridCrosshair } from '@/components/ui/EditorialPrimitives';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — System Node Not Found | Haresh Murugesan</title>
        <meta name="description" content="The requested page could not be located in this engineering architecture." />
      </Head>

      <div className="w-full min-h-screen bg-[#070B12] text-[#F3EFE7] overflow-x-hidden flex flex-col justify-between selection:bg-[#FF6B35] selection:text-[#070B12]">
        <Header />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center py-32">
          <div className="p-8 sm:p-12 rounded-[2px] bg-[#070B12] border border-[#F3EFE7]/[0.12] shadow-[0_8px_32px_rgba(7,11,18,0.8)] max-w-lg w-full relative">
            <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
            <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#82B7FF]" />
            <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-40 text-[#82B7FF]" />
            <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-40 text-[#82B7FF]" />

            <span className="text-xs font-mono text-[#F87171] uppercase tracking-widest px-3 py-1 rounded-[2px] bg-[#F87171]/10 border border-[#F87171]/20 inline-block mb-4">
              404 — Unresolved Route
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#F3EFE7] tracking-tight mb-3">
              Node Not Found
            </h1>

            <p className="text-sm font-sans text-[#A7B2C3] leading-relaxed mb-8">
              The requested resource or case study does not exist in this deployment. Return to the verified system index or home architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] bg-[#FF6B35] text-[#070B12] font-mono font-semibold text-xs transition-colors hover:bg-[#FF8547]"
              >
                ← Return to Home
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] bg-[#101B30] border border-[#F3EFE7]/15 text-[#F3EFE7] font-mono text-xs hover:bg-[#17243A] transition-colors"
              >
                Browse All Projects
              </Link>
            </div>
          </div>
        </main>

        <ContactFooter />
      </div>
    </>
  );
}
