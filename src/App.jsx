import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Dock from './components/Dock';
import Header from './components/Header';
import BentoHero from './components/BentoHero';
import SignalTraceBackground from './components/SignalTraceBackground';
import AboutSection from './components/AboutSection';
import ScrollyExperience from './components/ScrollyExperience';
import HistorySection from './components/HistorySection';
import ContactFooter from './components/ContactFooter';
import TerminalLoader from './components/TerminalLoader';

// Dynamically import below-the-fold components to improve initial load performance
const PodcastSection = dynamic(() => import('./components/PodcastSection'), { ssr: true });
const ProjectLab = dynamic(() => import('./components/ProjectLab'), { ssr: true });
const NowSection = dynamic(() => import('./components/NowSection'), { ssr: true });
const AchievementsGallery = dynamic(() => import('./components/AchievementsGallery'), { ssr: true });

// Dynamically import NeuralSkills with no SSR to avoid Three.js / React 19 SSR issues
const NeuralSkills = dynamic(() => import('./components/NeuralSkills'), {
  ssr: false,
  loading: () => (
    <section id="skills" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading tracking-wider md:tracking-widest uppercase font-bold text-light-gray mb-8 sm:mb-16 text-center">
        Skills & Tools
      </h2>
      <div className="h-[260px] sm:h-[340px] md:h-[400px] w-full mb-8 sm:mb-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center p-4 sm:p-8">
        <TerminalLoader />
      </div>
    </section>
  ),
});

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen text-light-gray overflow-x-clip relative">
      <SignalTraceBackground />
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-glass-bg">
        <motion.div
          className="bg-cine-teal h-full"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Dock Navigation */}
      <Dock />

      {/* Main Content */}
      <main className="w-full pb-16 sm:pb-24">
        <BentoHero />
        <AboutSection />
        <ScrollyExperience />
        <PodcastSection />
        <ProjectLab />
        <NeuralSkills />
        <AchievementsGallery />
        <HistorySection />
        <NowSection />
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;
