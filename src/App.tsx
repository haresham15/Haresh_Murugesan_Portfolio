import dynamic from 'next/dynamic';
import Header from './components/Header';
import BentoHero from './components/BentoHero';
import HomeCodeGraph from './components/HomeCodeGraph';
import ScrollyExperience from './components/ScrollyExperience';
import AboutSection from './components/AboutSection';
import HistorySection from './components/HistorySection';
import ContactFooter from './components/ContactFooter';
import WorksSection from './v7/works';
import { MotionPreferenceProvider } from './components/MotionPreference';
import { ChromaticThemeProvider } from './components/ThemeSection';
import CarbonField from './v7/carbon/CarbonField';
import CursorDot from './v7/cursor/CursorDot';
import { MaterialSection, Seam } from './v7/seams/Region';

// Below the fold: split into their own chunks (still prerendered).
const SyntinuumSection = dynamic(() => import('./v7/syntinuum'));
const ToolWallSection = dynamic(() => import('./v7/tool-wall'));
const RecognitionSection = dynamic(() => import('./v7/recognition'));
const NowSection = dynamic(() => import('./v7/now'));

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
            <MaterialSection material="light" name="works"><WorksSection /></MaterialSection>
            <Seam kind="horizon" from="light" to="dark" />
            <MaterialSection material="dark" name="constellation"><HomeCodeGraph /></MaterialSection>
            <Seam kind="turn-in" from="dark" to="light" />
            <MaterialSection material="light" name="experience"><ScrollyExperience /></MaterialSection>
            <Seam kind="turn-out" from="light" to="dark" />
            <MaterialSection material="dark" name="syntinuum"><SyntinuumSection /></MaterialSection>
            <Seam kind="baseline" from="dark" to="light" />
            <MaterialSection material="light" name="index"><ToolWallSection /></MaterialSection>
            <Seam kind="iris-open" from="light" to="dark" />
            <MaterialSection material="dark" name="recognition"><RecognitionSection /></MaterialSection>
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
