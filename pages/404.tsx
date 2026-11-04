import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — System Node Not Found | Haresh Murugesan</title>
        <meta name="description" content="The requested page could not be located in this engineering architecture." />
      </Head>

      <div className="w-full min-h-screen bg-[#050505] text-[#E0E0E0] overflow-x-hidden flex flex-col justify-between">
        <SiteHeader />

        <main id="main-content" className="w-full flex-grow max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center py-32">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0D1118] border border-white/10 shadow-token-card max-w-lg w-full">
            <span className="text-xs font-mono text-[#F87171] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F87171]/10 border border-[#F87171]/20 inline-block mb-4">
              404 — Unresolved Route
            </span>

            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white tracking-tight mb-3">
              Node Not Found
            </h1>

            <p className="text-sm font-sans text-[#A6ADB8] leading-relaxed mb-8">
              The requested resource or case study does not exist in this deployment. Return to the verified system index or home architecture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7DD3FC] text-[#050505] font-sans font-semibold text-sm hover:bg-white transition-colors"
              >
                ← Return to Home
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans font-medium text-sm hover:bg-white/10 transition-colors"
              >
                Browse All Projects
              </Link>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
