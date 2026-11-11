import React from 'react';
import Header from './components/Header';
import BentoHero from './components/BentoHero';
import ProjectLab from './components/ProjectLab';
import HomeCodeGraph from './components/HomeCodeGraph';
import ScrollyExperience from './components/ScrollyExperience';
import PodcastSection from './components/PodcastSection';
import NeuralSkills from './components/NeuralSkills';
import AchievementsGallery from './components/AchievementsGallery';
import AboutSection from './components/AboutSection';
import HistorySection from './components/HistorySection';
import NowSection from './components/NowSection';
import ContactFooter from './components/ContactFooter';
import ForgedCarbonCanvas from './components/ForgedCarbonCanvas';
import AntigravityParticles from './components/AntigravityParticles';
import { MotionPreferenceProvider } from './components/MotionPreference';
import { ChromaticThemeProvider } from './components/ThemeSection';

function App() {
  return (
    <MotionPreferenceProvider>
      <ChromaticThemeProvider>
        <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-clip relative selection:bg-[#FF2800] selection:text-[#03050A] transition-colors duration-500">
          {/* Authentic Procedural Dark Black Forged Carbon Background Engine */}
          <ForgedCarbonCanvas />

          {/* Tactile Antigravity Cursor Particles with Adaptive Throttle */}
          <AntigravityParticles />

          {/* Global Navigation Header (Floating Decoupled Controls + Top Portal) */}
          <Header />

          {/* EDITORIAL HOMEPAGE SEQUENCE (Hero → About → Experience → Works → Syntinuum → Skills → Recognition → Milestones → Now → Contact) */}
          <main id="main-content" className="relative z-10 w-full overflow-x-clip bg-transparent">
            <BentoHero />
            <AboutSection />
            <ScrollyExperience />
            <ProjectLab />
            <HomeCodeGraph />
            <PodcastSection />
            <NeuralSkills />
            <AchievementsGallery />
            <HistorySection />
            <NowSection />
            <ContactFooter />
          </main>
        </div>
      </ChromaticThemeProvider>
    </MotionPreferenceProvider>
  );
}

export default App;
