import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';
import { track } from '@vercel/analytics';
import '../src/index.css';
import '../src/v7/materials/materials.css';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { MotionPreferenceProvider } from '@/components/MotionPreference';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { FilmGrain } from '@/components/ui/FilmGrain';

export default function App({ Component, pageProps }: AppProps) {
  const { commandPaletteOpen, setCommandPaletteOpen } = usePortfolioStore();

  // Global Keyboard Navigation (Cmd+K / / for search, T for top)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      // [T] Key: Scroll back to top
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // [/] or Cmd+K: Open Global Command Palette
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  // Résumé, GitHub and LinkedIn links carry data-track="<event>"; one listener reports every click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      const name = el?.dataset.track;
      if (!el || !name) return;
      const from = el.closest('[id]')?.id || 'page';
      track(name, { from, path: window.location.pathname });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return (
    <MotionPreferenceProvider>
      <Head>
        <title>Haresh Murugesan | Software & Systems Engineer</title>
        <meta
          name="description"
          content="Haresh Murugesan, Computer Science (AI) at Ohio State, graduating May 2028. Seeking Summer 2027 software and ML internships."
        />
        <meta
          name="keywords"
          content="Haresh Murugesan, portfolio, software engineer, systems engineer, computer vision, nextjs, react, python, fastapi, typescript, ohio state"
        />
        <meta name="author" content="Haresh Murugesan" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph */}
        <meta property="og:site_name" content="Haresh Murugesan — Software &amp; Systems Architecture" />
        <meta property="og:title" content="Haresh Murugesan | Software &amp; Systems Engineer" />
        <meta
          property="og:description"
          content="Haresh Murugesan, Computer Science (AI) at Ohio State, graduating May 2028. Seeking Summer 2027 software and ML internships."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.hareshmurugesan.com" />
        <meta property="og:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />
        <meta property="og:image:width" content="1400" />
        <meta property="og:image:height" content="1000" />
        <meta property="og:locale" content="en_US" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Haresh Murugesan | Software &amp; Systems Engineer" />
        <meta
          name="twitter:description"
          content="Haresh Murugesan, Computer Science (AI) at Ohio State. Seeking Summer 2027 software and ML internships."
        />
        <meta name="twitter:image" content="https://www.hareshmurugesan.com/preview-image.jpeg" />
      </Head>

      {/* Global Command & Navigation Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Procedural 35mm Film Grain Overlay */}
      <FilmGrain />

      <Component {...pageProps} />
      <Analytics />
    </MotionPreferenceProvider>
  );
}
