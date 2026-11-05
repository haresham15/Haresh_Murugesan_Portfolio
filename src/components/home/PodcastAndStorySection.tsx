import React, { useState } from 'react';
import { podcastGuests, PodcastGuest } from '@/content/experience';

export const PodcastAndStorySection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  return (
    <section id="podcast" className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#F3EFE7]/10 gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#D8B4FE] mb-2">
            Conversations with Systems Builders
          </p>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-[#F3EFE7] tracking-tight">
            Syntinuum Podcast
          </h2>
        </div>
        <p className="text-sm font-sans text-[#A6ADB8] max-w-md">
          100K+ combined cross-platform impressions interviewing technical founders, CEOs, and engineers on architecture, hard trade-offs, and scaling systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
        
        {/* LEFT: Click-to-Load Video Player (6 cols) */}
        <div className="lg:col-span-6 w-full">
          <div className="rounded-[2px] overflow-hidden border border-[#F3EFE7]/10 bg-[#070B12] p-4 sm:p-6 ">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F3EFE7]/10 text-xs font-mono text-[#A6ADB8]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                <span className="text-[#F3EFE7]">Spotify Video Integration</span>
              </div>
              <span>Season 3</span>
            </div>

            {isPlaying ? (
              <div className="w-full aspect-video rounded-[2px] overflow-hidden bg-black">
                <iframe
                  title="Syntinuum Podcast Episode Player"
                  src="https://open.spotify.com/embed/show/5LPGObcWQdkoERNzZsdL98/video?utm_source=generator"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="w-full aspect-video rounded-[2px] overflow-hidden bg-gradient-to-br from-[#141A23] to-[#050505] border border-[#F3EFE7]/10 flex flex-col items-center justify-center p-6 text-center cursor-pointer group hover:border-[#7DD3FC]/50 transition-all relative"
              >
                <div className="w-16 h-16 rounded-full bg-[#1DB954] text-[#050505] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 translate-x-0.5">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <p className="text-sm font-sans font-semibold text-[#F3EFE7] mb-1">
                  Click to Load Latest Video Episode
                </p>
                <p className="text-xs font-mono text-[#A6ADB8]">
                  Zero tracking cookies or iframe load until clicked
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F3EFE7]/[0.08]">
              <a
                href="https://www.syntinuumpodcast.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#7DD3FC] hover:text-[#F3EFE7] transition-colors"
              >
                Visit syntinuumpodcast.com ↗
              </a>
              <span className="text-xs font-mono text-[#A6ADB8]">
                Persistent Audio Architecture
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT: Editorial Thesis (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4 text-sm sm:text-base font-sans text-[#E0E0E0] leading-relaxed">
          <p>
            Syntinuum is where I reverse-engineer the journeys of technical founders, CEOs, and innovators. Rather than just discussing high-level vision, we dive deep into the messy realities of building scalable systems, finding product-market fit, and managing technical debt.
          </p>
          <p>
            Interviewing these pioneers gives me a front-row seat to system-design decisions and engineering trade-offs that don&apos;t make it into textbooks. From parsing through their early architectural pivots to understanding how they manage latency, concurrency, and team culture while scaling, Syntinuum is an active extension of my engineering education.
          </p>
          <div className="mt-2 p-4 rounded-[2px] bg-white/[0.02] border border-[#F3EFE7]/[0.08] text-xs font-mono text-[#A6ADB8]">
            <p className="text-[#D8B4FE] font-semibold mb-1">Core Technical Focus Areas:</p>
            <p>Distributed Systems · Explainable Machine Learning · Hardware Scaling · Clinical AI Governance · Sustainable Infrastructure</p>
          </div>
        </div>

      </div>

      {/* Verified Guest Marquee with Pause Control */}
      <div className="rounded-[2px] bg-[#070B12]/60 border border-[#F3EFE7]/[0.08] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#F3EFE7]/[0.08]">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-heading font-semibold text-[#F3EFE7] tracking-tight">
              Verified Guest Roster
            </h3>
            <span className="text-xs font-mono text-[#A6ADB8]">
              ({podcastGuests.length} engineering leaders)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMarqueePaused(!isMarqueePaused)}
            className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#A6ADB8] border border-[#F3EFE7]/10 transition-colors"
            aria-label={isMarqueePaused ? 'Resume Guest Marquee' : 'Pause Guest Marquee'}
          >
            {isMarqueePaused ? 'Resume Scroll ▶' : 'Pause Scroll ⏸'}
          </button>
        </div>

        {/* Marquee Container */}
        <div className="overflow-hidden relative">
          <div
            className={`flex gap-4 w-max ${
              isMarqueePaused ? '' : 'marquee-container'
            }`}
          >
            {[...podcastGuests, ...podcastGuests].map((guest: PodcastGuest, idx: number) => (
              <div
                key={idx}
                className="w-64 sm:w-72 p-4 rounded-[2px] bg-white/[0.02] border border-[#F3EFE7]/[0.08] flex flex-col justify-between shrink-0"
              >
                <div>
                  <p className="text-sm font-sans font-bold text-[#F3EFE7] mb-0.5">
                    {guest.name}
                  </p>
                  <p className="text-xs font-sans text-[#7DD3FC]">
                    {guest.role} · {guest.company}
                  </p>
                </div>
                {guest.topic && (
                  <p className="text-[11px] font-mono text-[#A6ADB8] mt-3 pt-2 border-t border-[#F3EFE7]/[0.08]">
                    Topic: {guest.topic}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default PodcastAndStorySection;

