import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    id: 'dhaval-patel',
    guest: 'Dhaval Patel',
    role: 'Founder & CEO',
    org: 'Lotus (ex-Apple Senior Engineering Manager)',
    focus: 'Zero-touch wearable rings, firmware memory constraints, and high-volume hardware scaling.',
    runtime: '58 min',
    url: 'https://syntinuumpodcast.com',
  },
  {
    id: 'andrea-jacobs',
    guest: 'Andrea Jacobs',
    role: 'Director of AI & ML',
    org: 'Chemical Abstracts Service (CAS)',
    focus: 'CAS Newton, agentic scientific graph architectures, and fine-tuning biomedical LLMs.',
    runtime: '52 min',
    url: 'https://syntinuumpodcast.com',
  },
  {
    id: 'paul-shapiro',
    guest: 'Paul Shapiro',
    role: 'CEO & Author',
    org: 'The Better Meat Co. (Author of Clean Meat)',
    focus: 'Bioreactor fermentation economics, food-tech scaling dilemmas, and industrial microbiology.',
    runtime: '46 min',
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
  {
    id: 'steve-wang',
    guest: 'Steve Wang',
    role: 'Founder & CEO',
    org: 'Colorpik AI',
    focus: 'Sub-millimeter color sensor hardware, pump micro-dispensing, and embedded C firmware.',
    runtime: '49 min',
    url: 'https://syntinuumpodcast.com',
  },
];

export const PodcastSection: React.FC = () => {
  const [activeZone, setActiveZone] = useState<PodcastZone>('dialogues');
  const [hoveredZone, setHoveredZone] = useState<PodcastZone | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentZone = hoveredZone || activeZone;

  // Horizontal position of the DNA-Lightbulb selector corresponding to each zone
  const selectorPositions: Record<PodcastZone, string> = {
    signal: '18%',
    dialogues: '50%',
    architecture: '82%',
  };

  // 100vw Canvas Waveform Loop with 3 Harmonic Frequency Zones
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let phase = 0;

    const render = () => {
      phase += 0.024;
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

      // Primary Gold Filament wave
      drawHarmonic(1.2, 0.008, '#FF6B35', 2.2, 1.8);
      // Secondary Bio-Luminescent Cyan wave
      drawHarmonic(0.85, 0.012, '#82B7FF', 1.6, 1.6);
      // Ambient Muted Navy/Silver wave
      drawHarmonic(0.5, 0.016, 'rgba(115, 138, 156, 0.35)', 1.0, 1.2);

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
            ? 'rgba(245, 158, 11, 0.35)'
            : barZone === 'dialogues'
            ? 'rgba(56, 189, 248, 0.35)'
            : 'rgba(245, 158, 11, 0.35)'
          : 'rgba(115, 138, 156, 0.08)';

        ctx.fillRect(barX, height / 2 - barHeight / 2, barWidth * 0.5, barHeight);
      }
      ctx.restore();

      // Vertical hairline zone dividers
      ctx.save();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(zone1End, 0);
      ctx.lineTo(zone1End, height);
      ctx.moveTo(zone2End, 0);
      ctx.lineTo(zone2End, height);
      ctx.stroke();
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentZone]);

  return (
    <ThemeSection
      id="podcast"
      theme="studio-midnight"
      aria-label="Syntinuum technical journalism podcast and audio architecture"
      className="border-b border-[#F8FAFC]/10 flex flex-col justify-between py-24 lg:py-36"
    >
      <div className="w-full flex flex-col my-auto space-y-12 sm:space-y-16">
        
        {/* Section Headline & Top Platforms Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#82B7FF]">
              <span className="w-6 h-px bg-[#82B7FF]" />
              <span>03  Frontier Intelligence &amp; Production Reality</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F8FAFC] leading-tight tracking-tight">
              Syntinuum
            </h2>
            <p className="text-base sm:text-lg font-sans text-[#738A9C] leading-relaxed">
              Where frontier machine intelligence meets human implementation. Long-form technical dialogues dissecting how theoretical research moves into production systems.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
            <a
              href="https://syntinuumpodcast.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#FF6B35] hover:bg-[#FF8547] text-[#05070E] font-semibold rounded-[2px] inline-flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <span>Explore SyntinuumPodcast.com</span>
              <span>↗</span>
            </a>
            <a
              href="https://www.youtube.com/@syntinuum"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-[#0E1526] hover:bg-[#16213B] text-[#F8FAFC] border border-[#F8FAFC]/15 rounded-[2px] inline-flex items-center gap-2 transition-colors"
            >
              <span>YouTube [8k+ Views]</span>
              <span className="text-[#82B7FF]">↗</span>
            </a>
          </div>
        </div>

        {/* =====================================================================
            EDGE-TO-EDGE 100VW LIVING AUDIO WAVEFORM & GLIDING DNA-LIGHTBULB
            ===================================================================== */}
        <div className="w-screen -ml-[4vw] md:-ml-[6vw] xl:-ml-[7vw] relative border-y border-[#F8FAFC]/10 bg-[#04060C] select-none">
          
          {/* Canvas Waveform Container */}
          <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Gliding DNA-Lightbulb Floating Selector */}
            <MotionDiv
              animate={{ left: selectorPositions[currentZone] }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="absolute top-6 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center"
            >
              {/* Stylized DNA-Lightbulb Vector Icon */}
              <div className="w-12 h-12 rounded-full bg-[#05070E] border-2 border-[#FF6B35] flex items-center justify-center text-[#FF6B35] shadow-[0_0_24px_rgba(245,158,11,0.6)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2v2" />
                  <path d="M12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V18H9v-.8C7.21 16.16 6 14.22 6 12a6 6 0 0 1 6-6z" />
                  {/* Internal DNA Double Helix Filament */}
                  <path d="M10 10c1 1 3-1 4 0" stroke="#82B7FF" strokeWidth="1.5" />
                  <path d="M10 13c1-1 3 1 4 0" stroke="#82B7FF" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Status Indicator Label */}
              <span className="mt-2 px-2.5 py-0.5 bg-[#05070E]/90 text-[10px] font-mono text-[#FF6B35] border border-[#FF6B35]/30 rounded-[2px] tracking-widest whitespace-nowrap uppercase shadow-lg">
                ACTIVE ZONE
              </span>
            </MotionDiv>

            {/* 3 Interactive Clickable Zone Trigger Overlays */}
            <div className="absolute inset-0 grid grid-cols-3 z-30">
              
              {/* Zone 01: Signal */}
              <button
                type="button"
                onClick={() => setActiveZone('signal')}
                onMouseEnter={() => setHoveredZone('signal')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`h-full text-left p-6 sm:p-8 flex flex-col justify-end transition-colors cursor-pointer group ${
                  currentZone === 'signal' ? 'bg-[#FF6B35]/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#FF6B35] font-semibold tracking-wider">
                    01  The Signal
                  </span>
                  <div className="text-sm sm:text-base font-sans font-semibold text-[#F8FAFC]">
                    The Thesis &amp; Editorial Mission
                  </div>
                </div>
              </button>

              {/* Zone 02: Dialogues */}
              <button
                type="button"
                onClick={() => setActiveZone('dialogues')}
                onMouseEnter={() => setHoveredZone('dialogues')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`h-full text-left p-6 sm:p-8 flex flex-col justify-end transition-colors cursor-pointer border-x border-[#F8FAFC]/10 group ${
                  currentZone === 'dialogues' ? 'bg-[#82B7FF]/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#82B7FF] font-semibold tracking-wider">
                    02  The Dialogues
                  </span>
                  <div className="text-sm sm:text-base font-sans font-semibold text-[#F8FAFC]">
                    Founder &amp; Executive Sessions
                  </div>
                </div>
              </button>

              {/* Zone 03: Architecture */}
              <button
                type="button"
                onClick={() => setActiveZone('architecture')}
                onMouseEnter={() => setHoveredZone('architecture')}
                onMouseLeave={() => setHoveredZone(null)}
                className={`h-full text-left p-6 sm:p-8 flex flex-col justify-end transition-colors cursor-pointer group ${
                  currentZone === 'architecture' ? 'bg-[#FF6B35]/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-[#FF6B35] font-semibold tracking-wider">
                    03  The Architecture
                  </span>
                  <div className="text-sm sm:text-base font-sans font-semibold text-[#F8FAFC]">
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 bg-[#090D18] border border-[#F8FAFC]/10 rounded-[2px]"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-xs font-mono text-[#FF6B35] uppercase tracking-widest">
                    FOUNDED &amp; HOSTED BY HARESH MURUGESAN · 8,000+ YOUTUBE VIEWS
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8FAFC] leading-snug">
                    Syntinuum: Where Frontier Intelligence Meets Human Implementation.
                  </h3>
                  <p className="text-base text-[#738A9C] leading-relaxed">
                    Formerly <em>Adapt: Implementing Innovations</em>, Syntinuum was founded to interrogate the critical seam between theoretical computation and live operational fires. We dissect how artificial intelligence, cellular biology, and complex systems engineering translate from whitepapers into robust products that scale.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://syntinuumpodcast.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-xs font-mono text-[#FF6B35] hover:text-[#F8FAFC] border-b border-[#FF6B35] pb-1 transition-colors uppercase font-semibold"
                    >
                      <span>Explore Full Show Archive On SyntinuumPodcast.com</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#05070E] p-6 rounded-[2px] border border-[#F8FAFC]/10 space-y-4">
                  <div className="text-xs font-mono text-[#82B7FF] uppercase tracking-wider pb-2 border-b border-[#F8FAFC]/10">
                    PUBLICATION METRICS
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-[#738A9C]">YouTube Views:</div>
                      <div className="text-lg font-bold text-[#F8FAFC]">8,000+</div>
                    </div>
                    <div>
                      <div className="text-[#738A9C]">Combined Impressions:</div>
                      <div className="text-lg font-bold text-[#FF6B35]">100K+</div>
                    </div>
                    <div>
                      <div className="text-[#738A9C]">Platforms:</div>
                      <div className="text-[#F8FAFC]">Spotify, Apple, YT</div>
                    </div>
                    <div>
                      <div className="text-[#738A9C]">Editorial Focus:</div>
                      <div className="text-[#82B7FF]">Systems Tradeoffs</div>
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
                    <h3 className="text-xl sm:text-2xl font-serif text-[#F8FAFC]">
                      Unfiltered Conversations with Builders, Researchers &amp; Executives
                    </h3>
                    <p className="text-xs font-mono text-[#738A9C]">
                      CLICK ANY RECORD TO LISTEN ON SYNTINUUMPODCAST.COM OR YOUTUBE
                    </p>
                  </div>
                  <a
                    href="https://syntinuumpodcast.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-[#82B7FF] hover:underline shrink-0"
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
                      className="p-5 bg-[#090D18] hover:bg-[#10172A] border border-[#F8FAFC]/10 hover:border-[#82B7FF]/40 rounded-[2px] transition-all duration-200 group flex flex-col justify-between select-none"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#82B7FF] font-semibold">{d.runtime}</span>
                          <span className="text-[#738A9C] group-hover:text-[#F8FAFC] transition-colors">↗</span>
                        </div>
                        <h4 className="text-base font-sans font-semibold text-[#F8FAFC] group-hover:text-[#FF6B35] transition-colors">
                          {d.guest}
                        </h4>
                        <div className="text-xs font-mono text-[#FF6B35]">
                          {d.role} · {d.org}
                        </div>
                        <p className="text-xs font-sans text-[#738A9C] leading-relaxed line-clamp-3">
                          {d.focus}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#F8FAFC]/[0.08] text-[10px] font-mono text-[#738A9C] flex items-center justify-between">
                        <span>LISTEN EPISODE</span>
                        <span className="text-[#82B7FF]">syntinuumpodcast.com</span>
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
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 bg-[#090D18] border border-[#F8FAFC]/10 rounded-[2px]"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="text-xs font-mono text-[#FF6B35] uppercase tracking-widest">
                    SYSTEMS-ENGINEERED PRODUCTION WORKFLOW
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F8FAFC] leading-snug">
                    Engineered Like a Software Product.
                  </h3>
                  <p className="text-base text-[#738A9C] leading-relaxed">
                    Behind each episode runs a rigorous technical automation pipeline: a bespoke Python web-scraping and SMTP outreach engine for discoverability, coupled with custom audio-reactive transcription parsing and DaVinci Resolve 20 color-space managed post-production for crisp cinematic fidelity.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="https://syntinuumpodcast.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-[#FF6B35] hover:bg-[#FF8547] text-[#05070E] font-mono text-xs font-semibold rounded-[2px] transition-colors"
                    >
                      <span>Listen on SyntinuumPodcast.com ↗</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@syntinuum"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-[#05070E] hover:bg-[#10172A] text-[#F8FAFC] border border-[#F8FAFC]/20 font-mono text-xs rounded-[2px] transition-colors"
                    >
                      <span>Watch on YouTube ↗</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                  <div className="p-4 bg-[#05070E] rounded-[2px] border border-[#F8FAFC]/10">
                    <span className="text-[#82B7FF] block font-semibold mb-1">01. DISCOVERY ENGINE</span>
                    <p className="text-[#738A9C] font-sans">
                      Python BeautifulSoup &amp; SMTP scraper identifying top arXiv authors, serial founders, and executive architects.
                    </p>
                  </div>
                  <div className="p-4 bg-[#05070E] rounded-[2px] border border-[#F8FAFC]/10">
                    <span className="text-[#FF6B35] block font-semibold mb-1">02. AUDIO DSP &amp; DAVINCI 20</span>
                    <p className="text-[#738A9C] font-sans">
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
