import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WheelNavTrigger } from './WheelNavTrigger';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';
import { Portal } from './ui/Portal';
import { useActiveTheme, THEME_PALETTES } from './ThemeSection';

export default function Header() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const { activeTheme } = useActiveTheme();

  // Close navigation when route changes
  useEffect(() => {
    setNavOpen(false);
  }, [router.asPath]);

  // Deterministic scroll lock with scrollbar width compensation
  useLockBodyScroll(navOpen);

  // Keyboard navigation: Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navOpen) {
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navOpen]);

  // Primary destinations
  const primaryLinks = [
    { label: 'Work', href: '/#projects', note: 'Deterministic Systems CodeGraph & Architecture' },
    { label: 'Experience', href: '/#experience', note: 'Top-to-Bottom Grand Prix Circuit' },
    { label: 'About', href: '/#about', note: 'Engineering Thesis & Academic Research' },
    { label: 'Syntinuum', href: '/#podcast', note: 'Waveform Studio & Research Synthesis' },
    { label: 'Recognition', href: '/#achievements', note: '3D Medallion Awards Carousel' },
  ];

  // Secondary architectural index
  const secondaryLinks = [
    { num: '01', label: 'Selected Works', href: '/#projects', note: 'Flagship systems & deep inspection' },
    { num: '02', label: 'Syntinuum Podcast', href: '/#podcast', note: 'Episodes & studio pipeline' },
    { num: '03', label: 'Technical Index', href: '/#skills', note: 'Core competencies & stacks' },
    { num: '04', label: 'Distinctions', href: '/#achievements', note: '2× 1st ASA DataFest & medals' },
    { num: '05', label: 'Trajectory', href: '/#history', note: 'Winding chronology 2023–2026' },
    { num: '06', label: 'Field Notes', href: '/#now', note: 'Active research inquiries' },
    { num: '07', label: 'Contact', href: '/#contact', note: 'Direct correspondence & inquiries' },
    { num: '08', label: 'Curriculum Vitae', href: '/Haresh_Murugesan_Resume.pdf', external: true },
  ];

  const handleLinkClick = (href: string) => {
    setNavOpen(false);
    if (href.startsWith('/#')) {
      const anchorId = href.replace('/#', '');
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isLight = THEME_PALETTES[activeTheme]?.isLight;

  return (
    <>
      <a href="#about" className="skip-to-content">
        Skip to content
      </a>

      {/* Floating De-Coupled Corner Controls (Zero Full-Width Spanning Bar) */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4 sm:p-6 lg:p-8">
        <div className="w-full flex items-center justify-between">
          
          {/* Top-Left Floating Identity: Initials Logo + Frameless Hovering Name */}
          <Link
            href="/"
            aria-label="Haresh Murugesan — Home"
            className="pointer-events-auto flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#FF2800] select-none transition-transform duration-150 active:scale-95"
          >
            {/* Initials Logo Badge */}
            <span
              className={`w-8 h-8 sm:w-9 sm:h-9 border rounded-[2px] flex items-center justify-center font-raleway text-xs sm:text-sm font-bold transition-all duration-300 shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.35)] ${
                isLight
                  ? 'bg-[#0B0B0E] text-[#F4F6F9] border-[#0B0B0E]/30 group-hover:border-[#FF2800]'
                  : 'bg-[#060A12] text-[#F4F6F9] border-[#18458B]/30 group-hover:border-[#FF2800] group-hover:text-[#FF2800]'
              }`}
            >
              HM
            </span>

            {/* Name hovering freely over background */}
            <span
              className={`font-raleway font-semibold text-[15px] sm:text-[16px] tracking-tight transition-colors duration-300 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${
                isLight
                  ? 'text-[#0B0B0E] group-hover:text-[#FF2800]'
                  : 'text-[#F4F6F9] group-hover:text-[#FF2800]'
              }`}
            >
              Haresh Murugesan
            </span>
          </Link>

          {/* Top-Right Floating Wheel Rim Trigger */}
          <div className="pointer-events-auto group relative flex items-center">
            <WheelNavTrigger
              isOpen={navOpen}
              onToggle={() => setNavOpen(!navOpen)}
            />

            {/* Precision Architectural Tooltip */}
            <span className="absolute right-0 top-full mt-2.5 px-2 py-1 bg-[#060A12]/95 border border-[#18458B]/30 text-[10px] font-mono uppercase tracking-widest text-[#F4F6F9] opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap shadow-xl rounded-[2px] translate-y-1 group-hover:translate-y-0">
              {navOpen ? 'CLOSE' : 'INDEX'}
            </span>
          </div>

        </div>
      </header>

      {/* Top-level portal for site navigation drawer (z-[100] guarantee) */}
      <Portal>
        <div
          ref={navContainerRef}
          className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            navOpen
              ? 'opacity-100 pointer-events-auto visible'
              : 'opacity-0 pointer-events-none invisible'
          }`}
          aria-hidden={!navOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
        >
          {/* Backdrop Tint & Blur */}
          <div
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-[#03050A]/96 backdrop-blur-xl transition-opacity duration-300 cursor-pointer"
          />

          {/* Diagonal Subtle Hairline Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8D2E0]/40 to-transparent top-1/4 -rotate-12 transform origin-left" />
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF2800]/40 to-transparent bottom-1/3 -rotate-12 transform origin-right" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full h-full max-w-none px-[4vw] md:px-[6vw] xl:px-[7vw] pt-24 sm:pt-28 pb-10 flex flex-col justify-between overflow-y-auto">
            
            {/* Top Navigation Grid: Primary Left, Secondary Index Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-auto items-start">
              
              {/* Left Column: Primary Monumental Links (Span 7) */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FF2800] mb-3">
                  <span className="w-2.5 h-px bg-[#FF2800]" />
                  <span>PRIMARY DESTINATIONS</span>
                </div>

                <nav aria-label="Main Destinations" className="space-y-3 sm:space-y-4">
                  {primaryLinks.map((item) => (
                    <div key={item.label} className="group">
                      <Link
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="inline-flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 transition-transform duration-300 group-hover:translate-x-2"
                      >
                        <span className="font-raleway font-bold text-[2rem] sm:text-[3rem] md:text-[3.5rem] text-[#F4F6F9] group-hover:text-[#C8D2E0] leading-none transition-colors tracking-tight">
                          {item.label}
                        </span>
                        <span className="text-xs sm:text-sm font-mono text-[#7E8B9B] group-hover:text-[#C8D2E0] transition-colors">
                          / {item.note}
                        </span>
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Right Column: Architectural Secondary Index (Span 5) */}
              <div className="lg:col-span-5 bg-[#060A12]/80 border border-[#18458B]/25 p-6 sm:p-7 space-y-5 rounded-[2px] backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#7E8B9B] uppercase pb-2.5 border-b border-[#18458B]/20">
                  <span className="text-[#C8D2E0]">SECTIONS &amp; ARCHITECTURAL INDEX</span>
                  <span>(08 RECORDS)</span>
                </div>

                <div className="space-y-1.5">
                  {secondaryLinks.map((item) => {
                    if (item.external) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setNavOpen(false)}
                          className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#7E8B9B] hover:text-[#F4F6F9] hover:bg-[#0B1E40]/30 border-b border-[#18458B]/10 transition-colors group rounded-[2px]"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-[#FF2800]">{item.num}</span>
                            <span className="font-medium text-[#F4F6F9]">{item.label}</span>
                          </span>
                          <span className="text-xs text-[#C8D2E0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                            ↗
                          </span>
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#7E8B9B] hover:text-[#F4F6F9] hover:bg-[#0B1E40]/30 border-b border-[#18458B]/10 transition-colors group rounded-[2px]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-[#FF2800]">{item.num}</span>
                          <span className="font-medium text-[#F4F6F9]">{item.label}</span>
                        </span>
                        <span className="text-[#7E8B9B] group-hover:text-[#FF2800] transition-colors">
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Direct Quick Contact Dispatch */}
                <div className="pt-3 border-t border-[#18458B]/20 flex items-center justify-between text-xs font-mono text-[#7E8B9B]">
                  <span>DIRECT DISPATCH:</span>
                  <a
                    href="mailto:haresh.murugesan@gmail.com"
                    className="text-[#FF2800] hover:text-[#C8D2E0] transition-colors"
                  >
                    haresh.murugesan@gmail.com ↗
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Colophon / Status Bar */}
            <div className="pt-6 border-t border-[#18458B]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#7E8B9B]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
                <span>COLUMBUS, OH · THE OHIO STATE UNIVERSITY</span>
              </div>
              <div className="flex items-center gap-6">
                <span>PRESS [ESC] TO CLOSE</span>
                <span>© {new Date().getFullYear()} HARESH MURUGESAN</span>
              </div>
            </div>

          </div>
        </div>
      </Portal>
    </>
  );
}
