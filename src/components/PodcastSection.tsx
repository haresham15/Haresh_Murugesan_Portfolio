import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStage } from '../hooks/useCanvasStage';
import { useMotionPreference } from './MotionPreference';
import { ThemeSection } from './ThemeSection';

const MotionDiv = motion.div as any;

type PodcastZone = 'signal' | 'dialogues' | 'architecture';

interface FeaturedDialogue {
  id: string;
  guest: string;
  role: string;
  org: string;
  focus: string;
  runtime: string;
  url: string;
}

const FEATURED_DIALOGUES: FeaturedDialogue[] = [
  {
    id: 'steve-wang',
    guest: 'Steve Wang',
    role: 'Founder & Managing Partner',
    org: 'High-Tech Venture Capital',
    focus: 'Hardware scaling, deep-tech venture development, and semiconductor / AI infrastructure.',
    runtime: '49 min',
    url: 'https://syntinuumpodcast.com',
  },
  {
    id: 'dhaval-patel',
    guest: 'Dhaval Patel',
    role: 'Founder & CEO',
    org: 'codebasics',
    focus: 'Democratizing data science, machine learning education, and scalable curriculum architecture.',
    runtime: '58 min',
    url: 'https://syntinuumpodcast.com',
  },
  {
    id: 'paul-shapiro',
    guest: 'Paul Shapiro',
    role: 'CEO & Author',
    org: 'The Better Meat Co.',
    focus: 'Bioreactor fermentation economics, food-tech scaling dilemmas, and industrial microbiology.',
    runtime: '46 min',
    url: 'https://syntinuumpodcast.com',
  },
  {
    id: 'andrea-jacobs',
    guest: 'Andrea Jacobs',
    role: 'Executive Director',
    org: 'Technology & Human Rights Initiative',
    focus: 'Algorithmic accountability, AI governance frameworks, and civil liberties in machine learning.',
    runtime: '52 min',
    url: 'https://syntinuumpodcast.com',
  },
  {
    id: 'adam-geller',
    guest: 'Adam Geller',
    role: 'Founder & CEO',
    org: 'Edthena',
    focus: 'Video-based AI coaching pipelines, classroom NLP analysis, and educational venture engineering.',
    runtime: '44 min',
    url: 'https://syntinuumpodcast.com',
  },
];

export const PodcastSection: React.FC = () => {
  const [activeZone, setActiveZone] = useState<PodcastZone>('dialogues');
  const [hoveredZone, setHoveredZone] = useState<PodcastZone | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();

  const currentZone = hoveredZone || activeZone;

  // Horizontal position of the DNA-Lightbulb selector corresponding to each zone
  const selectorPositions: Record<PodcastZone, string> = {
    signal: '18%',
    dialogues: '50%',
    architecture: '82%',
  };

  // 100vw Canvas Waveform Loop with 3 Harmonic Frequency Zones
  useCanvasStage(stageRef, canvasRef, (ctx, { width, height, time }) => {
      const phase = time * 0.00144;
      ctx.clearRect(0, 0, width, height);

      const zone1End = width * 0.33;
      const zone2End = width * 0.67;

      // Draw Multi-Harmonic Sine Waves across 100vw
      const drawHarmonic = (
        ampMultiplier: number,
        freq: number,
        color: string,
        lineWidth: number,
        activeZoneWeight: number
      ) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        for (let x = 0; x < width; x += 4) {
          // Identify zone
          let zoneAmp = 1.0;
          if (x < zone1End) {
            zoneAmp = currentZone === 'signal' ? activeZoneWeight : 0.45;
          } else if (x < zone2End) {
            zoneAmp = currentZone === 'dialogues' ? activeZoneWeight : 0.45;
          } else {
            zoneAmp = currentZone === 'architecture' ? activeZoneWeight : 0.45;
          }

          const baseSine = Math.sin(x * freq + phase) * 32;
          const secondHarmonic = Math.sin(x * freq * 2.2 - phase * 1.5) * 16;
          const noiseRipple = Math.cos(x * 0.05 + phase * 2) * 6;
          const y = height / 2 + (baseSine + secondHarmonic + noiseRipple) * ampMultiplier * zoneAmp;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.restore();
      };

      // Primary Reddish-Orange Filament wave
      drawHarmonic(1.2, 0.008, '#FF2800', 2.2, 1.8);
      // Secondary Cobalt Blue wave
      drawHarmonic(0.85, 0.012, '#2563EB', 1.6, 1.6);
      // Ambient Machined Silver wave
      drawHarmonic(0.5, 0.016, 'rgba(200, 210, 224, 0.35)', 1.0, 1.2);

      // Draw Frequency Histogram Bars in Background
      const barCount = 48;
      const barWidth = width / barCount;
      ctx.save();
      for (let i = 0; i < barCount; i++) {
        const barX = i * barWidth + barWidth * 0.25;
        let barZone: PodcastZone = 'signal';
        if (barX >= zone2End) barZone = 'architecture';
        else if (barX >= zone1End) barZone = 'dialogues';

        const isBarActive = barZone === currentZone;
        const barHeight = Math.abs(Math.sin(i * 0.4 + phase * 1.8) * 45) + (isBarActive ? 25 : 8);

        ctx.fillStyle = isBarActive
          ? barZone === 'signal'
            ? 'rgba(255, 40, 0, 0.35)'
            : barZone === 'dialogues'
            ? 'rgba(37, 99, 235, 0.35)'
            : 'rgba(200, 210, 224, 0.35)'
          : 'rgba(126, 139, 155, 0.08)';

        ctx.fillRect(barX, height / 2 - barHeight / 2, barWidth * 0.5, barHeight);
      }
      ctx.restore();

      // Vertical hairline zone dividers
      ctx.save();
      ctx.strokeStyle = 'rgba(24, 69, 139, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(zone1End, 0);
      ctx.lineTo(zone1End, height);
      ctx.moveTo(zone2End, 0);
      ctx.lineTo(zone2End, height);
      ctx.stroke();
      ctx.restore();

  }, { animate: !isReduced });

  return (
    <ThemeSection
      id="podcast"
      theme="obsidian"
      aria-label="Syntinuum technical journalism podcast and audio architecture"
      className="border-b border-[#18458B]/20 flex flex-col justify-between py-24 lg:py-36"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        
        {/* Section Headline & Top Platforms Strip (Unboxed & De-Vibecoded) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#18458B]/20">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F4F6F9] leading-tight tracking-tight">
              Syntinuum: Endless Evolutions
            </h2>
            <p className="text-base sm:text-xl font-sans text-[#7E8B9B] leading-relaxed">
              Where frontier machine intelligence meets human implementation. Long-form technical dialogues dissecting how theoretical research moves into production systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <a
              href="https://syntinuumpodcast.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#FF2800] hover:bg-[#C8D2E0] text-[#03050A] font-semibold rounded-[2px] inline-flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(255,40,0,0.35)]"
            >
              <span>Explore SyntinuumPodcast.com</span>
              <span>↗</span>
            </a>
            <a
              href="https://www.youtube.com/@syntinuum"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-[#060A12] hover:bg-[#0B1E40] text-[#F4F6F9] border border-[#18458B]/30 rounded-[2px] inline-flex items-center gap-2 transition-colors"
            >
              <span>YouTube [8k+ Views]</span>
              <span className="text-[#2563EB]">↗</span>
            </a>
          </div>
        </div>

        {/* =====================================================================
            EDGE-TO-EDGE 100VW LIVING AUDIO WAVEFORM & GLIDING DNA-LIGHTBULB
            ===================================================================== */}
        <div className="w-full relative border-y border-[#F4F6F9]/10 bg-[bg-transparent] select-none">
          
          {/* Canvas Waveform Container */}
          <div ref={stageRef} className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Gliding DNA-Lightbulb Floating Selector */}
            <MotionDiv
              animate={{ left: selectorPositions[currentZone] }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="absolute top-6 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center"
            >
              {/* Stylized DNA-Lightbulb Vector Icon */}
              <div className="w-12 h-12 rounded-full bg-[#060A12] border-2 border-[#FF2800] flex items-center justify-center text-[#FF2800] shadow-[0_0_24px_rgba(255,40,0,0.6)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2v2" />
                  <path d="M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V18H9v-.8C7.21 16.16 6 14.22 6 12a6 6 0 0 1 6-6z" />
                  {/* Internal DNA Double Helix Filament */}
                  <path d="M10 10c1 1 3-1 4 0" stroke="#2563EB" strokeWidth="1.5" />
                  <path d="M10 13c1-1 3 1 4 0" stroke="#C8D2E0" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Status Indicator Label */}
              <span className="mt-2 px-2.5 py-0.5 bg-[#060A12]/90 text-[10px] font-mono text-[#FF2800] border border-[#FF2800]/30 rounded-[2px] tracking-widest whitespace-nowrap uppercase shadow-lg">
                ACTIVE ZONE
              </span>
            </MotionDiv>

            {/* 3 Interactive Clickable Zone Trigger Overlays */}
            <div className="absolute inset-0 grid grid-cols-3 z-30">
              
              {/* Zone 01: Signal */}
              <button
                type="button"
                aria-pressed={activeZone === 'signal'}
                onClick={() => setActiveZone('signal')}
                onMouseEnter={() => setHoveredZone('signal')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`min-w-0 h-full text-left p-2 sm:p-8 flex flex-col justify-end transition-colors cursor-pointer group ${
                  currentZone === 'signal' ? 'bg-[#FF2800]/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#FF2800] font-semibold tracking-wider">
                    01  The Signal
                  </span>
                  <div className="text-sm sm:text-base font-sans font-semibold text-[#F4F6F9]">
                    The Thesis &amp; Editorial Mission
                  </div>
                </div>
              </button>

              {/* Zone 02: Dialogues */}
              <button
                type="button"
                aria-pressed={activeZone === 'dialogues'}
                onClick={() => setActiveZone('dialogues')}
                onMouseEnter={() => setHoveredZone('dialogues')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`min-w-0 h-full text-left p-2 sm:p-8 flex flex-col justify-end transition-colors cursor-pointer border-x border-[#18458B]/20 group ${
                  currentZone === 'dialogues' ? 'bg-[#2563EB]/[0.06]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#2563EB] font-semibold tracking-wider">
                    02  The Dialogues
                  </span>
                  <div className="text-sm sm:text-base font-sans font-semibold text-[#F4F6F9]">
                    Founder &amp; Executive Sessions
                  </div>
                </div>
              </button>

              {/* Zone 03: Architecture */}
              <button
                type="button"
                aria-pressed={activeZone === 'architecture'}
                onClick={() => setActiveZone('architecture')}
                onMouseEnter={() => setHoveredZone('architecture')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`min-w-0 h-full text-left p-2 sm:p-8 flex flex-col justify-end transition-colors cursor-pointer group ${
                  currentZone === 'architecture' ? 'bg-[#FF2800]/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#FF2800] font-semibold tracking-wider">
                    03  The Architecture
                  </span>
                  <div className="text-sm sm:text-base font-sans font-semibold text-[#F4F6F9]">
                    Automated Discovery Pipeline
                  </div>
                </div>
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================================
            THREE INTERACTIVE NARRATIVE STAGES (Cross-Faded below Waveform)
            ===================================================================== */}
        <div className="w-full min-h-[360px]">
          <AnimatePresence mode="wait">
            
            {/* STAGE 01: THE THESIS & SIGNAL */}
            {activeZone === 'signal' && (
              <MotionDiv
                key="stage-signal"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 bg-[#060A12]/80 border border-[#18458B]/25 rounded-[2px]"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-xs font-mono text-[#FF2800] uppercase tracking-widest font-semibold">
                    FOUNDED &amp; HOSTED BY HARESH MURUGESAN · 8,000+ YOUTUBE VIEWS
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F4F6F9] leading-snug">
                    Syntinuum: Where Frontier Intelligence Meets Human Implementation.
                  </h3>
                  <p className="text-base text-[#7E8B9B] leading-relaxed">
                    Formerly <em>Adapt: Implementing Innovations</em>, Syntinuum was founded to interrogate the critical seam between theoretical computation and live operational fires. We dissect how artificial intelligence, cellular biology, and complex systems engineering translate from whitepapers into robust products that scale.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://syntinuumpodcast.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-xs font-mono text-[#FF2800] hover:text-[#F4F6F9] border-b border-[#FF2800] pb-1 transition-colors uppercase font-semibold"
                    >
                      <span>Explore Full Show Archive On SyntinuumPodcast.com</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#060A12] p-6 rounded-[2px] border border-[#18458B]/25 space-y-4">
                  <div className="text-xs font-mono text-[#2563EB] uppercase tracking-wider pb-2 border-b border-[#18458B]/25 font-semibold">
                    PUBLICATION METRICS
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-[#7E8B9B]">YouTube Views:</div>
                      <div className="text-lg font-bold text-[#F4F6F9]">8,000+</div>
                    </div>
                    <div>
                      <div className="text-[#7E8B9B]">Combined Impressions:</div>
                      <div className="text-lg font-bold text-[#FF2800]">100K+</div>
                    </div>
                    <div>
                      <div className="text-[#7E8B9B]">Platforms:</div>
                      <div className="text-[#F4F6F9]">Spotify, Apple, YT</div>
                    </div>
                    <div>
                      <div className="text-[#7E8B9B]">Editorial Focus:</div>
                      <div className="text-[#2563EB]">Systems Tradeoffs</div>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            )}

            {/* STAGE 02: EXECUTIVE & FOUNDER DIALOGUES */}
            {activeZone === 'dialogues' && (
              <MotionDiv
                key="stage-dialogues"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#F4F6F9]">
                      Unfiltered Conversations with Builders, Researchers &amp; Executives
                    </h3>
                    <p className="text-xs font-mono text-[#7E8B9B]">
                      CLICK ANY RECORD TO LISTEN ON SYNTINUUMPODCAST.COM OR YOUTUBE
                    </p>
                  </div>
                  <a
                    href="https://syntinuumpodcast.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#2563EB] hover:underline shrink-0"
                  >
                    ALL EPISODES (10+) ↗
                  </a>
                </div>

                {/* 5 Featured Dialogue Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FEATURED_DIALOGUES.map((d) => (
                    <a
                      key={d.id}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 bg-[#060A12]/80 hover:bg-[#0B1E40]/30 border border-[#18458B]/25 hover:border-[#2563EB]/50 rounded-[2px] transition-all duration-200 group flex flex-col justify-between select-none"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#2563EB] font-semibold">{d.runtime}</span>
                          <span className="text-[#7E8B9B] group-hover:text-[#F4F6F9] transition-colors">↗</span>
                        </div>
                        <h4 className="text-base font-sans font-semibold text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors">
                          {d.guest}
                        </h4>
                        <div className="text-xs font-mono text-[#FF2800]">
                          {d.role} · {d.org}
                        </div>
                        <p className="text-xs font-sans text-[#7E8B9B] leading-relaxed line-clamp-3">
                          {d.focus}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#18458B]/20 text-[10px] font-mono text-[#7E8B9B] flex items-center justify-between">
                        <span>LISTEN EPISODE</span>
                        <span className="text-[#2563EB]">syntinuumpodcast.com</span>
                      </div>
                    </a>
                  ))}
                </div>
              </MotionDiv>
            )}

            {/* STAGE 03: AUTOMATED DISCOVERY & STUDIO PIPELINE */}
            {activeZone === 'architecture' && (
              <MotionDiv
                key="stage-architecture"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 bg-[#060A12]/80 border border-[#18458B]/25 rounded-[2px]"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-xs font-mono text-[#FF2800] uppercase tracking-widest font-semibold">
                    SYSTEMS-ENGINEERED PRODUCTION WORKFLOW
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F4F6F9] leading-snug">
                    Engineered Like a Software Product.
                  </h3>
                  <p className="text-base text-[#7E8B9B] leading-relaxed">
                    Behind each episode runs a rigorous technical automation pipeline: a bespoke Python web-scraping and SMTP outreach engine for discoverability, coupled with custom audio-reactive transcription parsing and DaVinci Resolve 20 color-space managed post-production for crisp cinematic fidelity.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="https://syntinuumpodcast.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-[#FF2800] hover:bg-[#C8D2E0] text-[#03050A] font-mono text-xs font-semibold rounded-[2px] transition-colors"
                    >
                      <span>Listen on SyntinuumPodcast.com ↗</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@syntinuum"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-[#060A12] hover:bg-[#0B1E40] text-[#F4F6F9] border border-[#18458B]/30 font-mono text-xs rounded-[2px] transition-colors"
                    >
                      <span>Watch on YouTube ↗</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                  <div className="p-4 bg-[#060A12] rounded-[2px] border border-[#18458B]/25">
                    <span className="text-[#2563EB] block font-semibold mb-1">01. DISCOVERY ENGINE</span>
                    <p className="text-[#7E8B9B] font-sans">
                      Python BeautifulSoup &amp; SMTP scraper identifying top arXiv authors, serial founders, and executive architects.
                    </p>
                  </div>
                  <div className="p-4 bg-[#060A12] rounded-[2px] border border-[#18458B]/25">
                    <span className="text-[#FF2800] block font-semibold mb-1">02. AUDIO DSP &amp; DAVINCI 20</span>
                    <p className="text-[#7E8B9B] font-sans">
                      Phase-coherent multiband gating, ITU-R BS.1770-4 loudness normalization, and DaVinci YRGB Color-Managed pipeline.
                    </p>
                  </div>
                </div>
              </MotionDiv>
            )}

          </AnimatePresence>
        </div>

      </div>
    </ThemeSection>
  );
};

export default PodcastSection;
