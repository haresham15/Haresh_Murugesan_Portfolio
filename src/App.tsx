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
import { MotionPreferenceProvider } from './components/MotionPreference';
import { ChromaticThemeProvider } from './components/ThemeSection';
import CarbonField from './v7/carbon/CarbonField';
import CursorDot from './v7/cursor/CursorDot';
import { MaterialSection, Seam } from './v7/seams/Region';

function App() {
  return (
    <MotionPreferenceProvider>
      <ChromaticThemeProvider>
        <div className="w-full min-h-screen bg-[#03050A] text-[#F4F6F9] overflow-x-clip relative selection:bg-[#FF2800] selection:text-[#03050A]">
          {/* Both materials and every seam, in one fixed WebGL2 canvas */}
          <CarbonField />
          <CursorDot />
          <Header />

          {/* Hero, Works, Constellation, Experience, Syntinuum, Index, Recognition, About, Milestones, Now, Contact */}
          <main id="main-content" className="relative z-10 w-full overflow-x-clip bg-transparent">
            <MaterialSection material="dark" name="hero"><BentoHero /></MaterialSection>
            <Seam kind="shutter" from="dark" to="light" />
            <MaterialSection material="light" name="works"><ProjectLab /></MaterialSection>
            <Seam kind="horizon" from="light" to="dark" />
            <MaterialSection material="dark" name="constellation"><HomeCodeGraph /></MaterialSection>
            <Seam kind="turn-in" from="dark" to="light" />
            <MaterialSection material="light" name="experience"><ScrollyExperience /></MaterialSection>
            <Seam kind="turn-out" from="light" to="dark" />
            <MaterialSection material="dark" name="syntinuum"><PodcastSection /></MaterialSection>
            <Seam kind="baseline" from="dark" to="light" />
            <MaterialSection material="light" name="index"><NeuralSkills /></MaterialSection>
            <Seam kind="iris-open" from="light" to="dark" />
            <MaterialSection material="dark" name="recognition"><AchievementsGallery /></MaterialSection>
            <Seam kind="horizon" from="dark" to="light" />
            <MaterialSection material="light" name="about"><AboutSection /></MaterialSection>
            <MaterialSection material="light" name="milestones"><HistorySection /></MaterialSection>
            <Seam kind="iris-close" from="light" to="dark" />
            <MaterialSection material="dark" name="now"><NowSection /></MaterialSection>
            <Seam kind="exposure" from="dark" to="light" />
            <MaterialSection material="light" name="contact"><ContactFooter /></MaterialSection>
          </main>
        </div>
      </ChromaticThemeProvider>
    </MotionPreferenceProvider>
  );
}

export default App;
