import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import BentoHero from './components/BentoHero';
import SignalTraceBackground from './components/SignalTraceBackground';
import AntigravityParticles from './components/AntigravityParticles';
import AboutSection from './components/AboutSection';
import ScrollyExperience from './components/ScrollyExperience';
import PodcastSection from './components/PodcastSection';
import ProjectLab from './components/ProjectLab';
import NeuralSkills from './components/NeuralSkills';
import AchievementsGallery from './components/AchievementsGallery';
import HistorySection from './components/HistorySection';
import NowSection from './components/NowSection';
import ContactFooter from './components/ContactFooter';
import { MotionPreferenceProvider } from './components/MotionPreference';

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MotionPreferenceProvider>
      <div className="w-full min-h-screen bg-canvas text-text-primary overflow-x-clip relative selection:bg-[#FF6B2B] selection:text-[#07090D]">
        {/* Subtle Background Signal Grid */}
        <SignalTraceBackground />

        {/* Tactile Antigravity Cursor Particles with Adaptive Throttle */}
        <AntigravityParticles />

        {/* 35mm Analog Film Grain Overlay */}
        <div className="film-grain-overlay" aria-hidden="true" />
        
        {/* Chronograph Sector Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-[#F4EFE6]/[0.06] pointer-events-none">
          <div
            className="h-full transition-all duration-100 ease-out shadow-[0_0_8px_#FF6B2B]"
            style={{
              width: `${scrollProgress}%`,
              background: 'linear-gradient(90deg, #C8321E 0%, #FF6B2B 60%, #FFB86C 90%, #FFE9AE 100%)',
            }}
          />
        </div>

        {/* Global Navigation Header (Permanently Available & Cleanly Responsive) */}
        <Header />

        {/* STRICT HOMEPAGE SEQUENCE (10 SECTIONS IN EXACT ORDER) */}
        <main id="main-content" className="relative z-10 w-full max-w-[1320px] mx-auto border-x border-[#F4EFE6]/10 bg-[#07090D] shadow-2xl pb-16 sm:pb-24">
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
    </MotionPreferenceProvider>
  );
}

export default App;
