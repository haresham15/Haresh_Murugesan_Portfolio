import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Dock from './components/Dock';
import BentoHero from './components/BentoHero';
import AboutSection from './components/AboutSection';
import ScrollyExperience from './components/ScrollyExperience';
import PodcastSection from './components/PodcastSection';
import ProjectLab from './components/ProjectLab';
import AwardsSection from './components/AwardsSection';
import ContactFooter from './components/ContactFooter';
import Spinner from './spinner';

// Dynamically import NeuralSkills with no SSR to avoid React 19 compatibility issues
const NeuralSkills = dynamic(() => import('./components/NeuralSkills'), {
  ssr: false,
  loading: () => (
    <section id="skills" className="w-full max-w-7xl mx-auto px-4 py-20 relative">
      <h2 className="text-6xl font-mono font-bold text-light-gray mb-16 text-center">
        Skills & Tools
      </h2>
      <div className="h-[600px] w-full mb-12 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl flex items-center justify-center">
        <p className="text-light-gray/60 font-sans">Loading 3D visualization...</p>
      </div>
    </section>
  ),
});

function App() {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full min-h-screen bg-charcoal text-light-gray overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-glass-bg">
        <motion.div
          className="bg-neon-cyan h-full"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>

      {/* Dock Navigation */}
      <Dock />

      {/* Main Content */}
      <main className="w-full">
        <BentoHero />
        <AboutSection />
        <ScrollyExperience />
        <PodcastSection />
        <ProjectLab />
        <AwardsSection />
        <NeuralSkills />
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;

