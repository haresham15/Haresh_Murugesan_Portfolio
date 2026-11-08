import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import { ContactFooter } from '@/components/ContactFooter';
import ForgedCarbonCanvas from '@/components/ForgedCarbonCanvas';
import { GridCrosshair } from '@/components/ui/EditorialPrimitives';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — System Node Not Found | Haresh Murugesan</title>
        <meta name="description" content="The requested page could not be located in this engineering architecture." />
      </Head>

      <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-hidden flex flex-col justify-between selection:bg-[#FF2800] selection:text-[#03050A] relative">
        <ForgedCarbonCanvas />
        <Header />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center py-32 relative z-10">
          <div className="p-8 sm:p-12 rounded-[2px] bg-[#060A12]/90 border border-[#18458B]/30 backdrop-blur-md shadow-2xl max-w-lg w-full relative">
            <GridCrosshair className="absolute top-2 left-2 z-20 opacity-40 text-[#2563EB]" />
            <GridCrosshair className="absolute top-2 right-2 z-20 opacity-40 text-[#2563EB]" />
            <GridCrosshair className="absolute bottom-2 left-2 z-20 opacity-40 text-[#2563EB]" />
            <GridCrosshair className="absolute bottom-2 right-2 z-20 opacity-40 text-[#2563EB]" />

            <span className="text-xs font-mono text-[#FF2800] uppercase tracking-widest px-3 py-1 rounded-[2px] bg-[#FF2800]/10 border border-[#FF2800]/25 inline-block mb-4">
              404 — Unresolved Route
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif text-[#F4F6F9] tracking-tight mb-3">
              Node Not Found
            </h1>

            <p className="text-sm font-sans text-[#7E8B9B] leading-relaxed mb-8">
              The requested resource or case study does not exist in this deployment. Return to the verified system index or home architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] bg-[#FF2800] text-[#03050A] font-mono font-semibold text-xs transition-colors hover:bg-[#C8D2E0] shadow-[0_0_12px_rgba(255,40,0,0.3)]"
              >
                ← Return to Home
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto px-5 py-2.5 rounded-[2px] bg-[#060A12] border border-[#18458B]/30 text-[#F4F6F9] font-mono text-xs hover:bg-[#0B1E40]/40 transition-colors"
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
