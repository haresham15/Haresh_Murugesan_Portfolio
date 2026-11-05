import React from 'react';
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
  return (
    <MotionPreferenceProvider>
      <div className="w-full min-h-screen bg-[#070B12] text-[#F3EFE7] overflow-x-clip relative selection:bg-[#FF6B35] selection:text-[#070B12]">
        {/* Subtle Background Signal Grid */}
        <SignalTraceBackground />

        {/* Tactile Antigravity Cursor Particles with Adaptive Throttle */}
        <AntigravityParticles />

        {/* 35mm Analog Film Grain Overlay */}
        <div className="film-grain-overlay" aria-hidden="true" />

        {/* Global Navigation Header (Floating Decoupled Icons) */}
        <Header />

        {/* EDITORIAL HOMEPAGE SEQUENCE (Prominent: Hero → About → Experience → Works → Syntinuum → Skills → Recognition → Milestones → Now → Contact) */}
        <main id="main-content" className="relative z-10 w-full overflow-x-clip bg-transparent">
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
