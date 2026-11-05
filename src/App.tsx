import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import BentoHero from './components/BentoHero';
import ProjectLab from './components/ProjectLab';
import ScrollyExperience from './components/ScrollyExperience';
import PodcastSection from './components/PodcastSection';
import NeuralSkills from './components/NeuralSkills';
import AchievementsGallery from './components/AchievementsGallery';
import AboutSection from './components/AboutSection';
import HistorySection from './components/HistorySection';
import NowSection from './components/NowSection';
import ContactFooter from './components/ContactFooter';
import SignalTraceBackground from './components/SignalTraceBackground';
import AntigravityParticles from './components/AntigravityParticles';
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
      <div className="w-full min-h-screen bg-[#070B12] text-[#F3EFE7] overflow-x-clip relative selection:bg-[#FF6B35] selection:text-[#070B12]">
        {/* Subtle Background Signal Grid */}
        <SignalTraceBackground />

        {/* Tactile Antigravity Cursor Particles with Adaptive Throttle */}
        <AntigravityParticles />

        {/* 35mm Analog Film Grain Overlay */}
        <div className="film-grain-overlay" aria-hidden="true" />
        
        {/* Chronograph Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-[2px] z-50 bg-[#F3EFE7]/[0.06] pointer-events-none">
          <div
            className="h-full transition-all duration-100 ease-out shadow-[0_0_8px_#FF6B35]"
            style={{
              width: `${scrollProgress}%`,
              background: 'linear-gradient(90deg, #C8321E 0%, #FF6B35 60%, #F5D998 90%, #FFE9AE 100%)',
            }}
          />
        </div>

        {/* Global Navigation Header */}
        <Header />

        {/* EDITORIAL HOMEPAGE SEQUENCE (Prominent: Hero → About → Experience → Works → Syntinuum → Skills → Recognition → Milestones → Now → Contact) */}
        <main id="main-content" className="relative z-10 w-full overflow-x-clip bg-[#070B12]">
          <BentoHero />
          <AboutSection />
          <ScrollyExperience />
          <ProjectLab />
          <PodcastSection />
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
