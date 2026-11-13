import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../src/index.css';
import '../src/v7/materials/materials.css';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { MotionPreferenceProvider } from '@/components/MotionPreference';
import { CommandPalette } from '@/components/ui/CommandPalette';

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

  return (
    <MotionPreferenceProvider>
      <Head>
        <title>Haresh Murugesan | Software & Systems Engineer</title>
        <meta
          name="description"
          content="Portfolio of Haresh Murugesan — B.S. Computer Science & Engineering at Ohio State. Building high-performance systems, real-time simulation engines, and clinical computer vision architectures."
        />
        <meta
          name="keywords"
          content="Haresh Murugesan, portfolio, software engineer, systems engineer, computer vision, nextjs, react, python, fastapi, typescript, ohio state"
        />
        <meta name="author" content="Haresh Murugesan" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hareshmurugesan.com" />

        {/* Open Graph */}
        <meta property="og:title" content="Haresh Murugesan | Software & Systems Engineer" />
        <meta
          property="og:description"
          content="Explore Haresh's engineering systems, performance benchmarks, and verified technical case studies."
        />
        <meta property="og:image" content="https://hareshmurugesan.com/profile.jpeg" />
        <meta property="og:url" content="https://hareshmurugesan.com" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Haresh Murugesan | Software & Systems Engineer" />
        <meta
          name="twitter:description"
          content="Portfolio of Haresh Murugesan — Computer Science & Engineering at Ohio State. Featured systems: Apexis, Healios V2, Tempo, Careline."
        />
        <meta name="twitter:image" content="https://hareshmurugesan.com/profile.jpeg" />
      </Head>

      {/* Global Command & Navigation Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <Component {...pageProps} />
    </MotionPreferenceProvider>
  );
}
