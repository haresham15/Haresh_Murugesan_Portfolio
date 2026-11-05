import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WheelNavTrigger } from './WheelNavTrigger';

export default function Header() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close navigation when route changes
  useEffect(() => {
    setNavOpen(false);
  }, [router.asPath]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

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
    { label: 'Work', href: '/#projects', note: 'Featured computational systems & case studies' },
    { label: 'Archive', href: '/#archive', note: 'Vector CodeGraph indexing all 18 systems' },
    { label: 'Experience', href: '/#experience', note: 'Clinical research, enterprise software & telematics' },
    { label: 'About', href: '/#about', note: 'Research thesis, background & engineering principles' },
  ];

  // Secondary architectural index
  const secondaryLinks = [
    { num: '01', label: 'Syntinuum', href: '/#podcast', note: 'Systems Dialogues Podcast' },
    { num: '02', label: 'Technical Index', href: '/#skills', note: 'Core competencies & stacks' },
    { num: '03', label: 'Recognition', href: '/#achievements', note: '2× 1st ASA DataFest & awards' },
    { num: '04', label: 'Contact', href: '/#contact', note: 'Direct correspondence & inquiries' },
    { num: '05', label: 'Formative Milestones', href: '/#history', note: 'Chronology 2023–2026' },
    { num: '06', label: 'Field Notes / Now', href: '/#now', note: 'Active research inquiries' },
    { num: '07', label: 'Curriculum Vitae', href: '/Haresh_Murugesan_Resume.pdf', external: true },
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

  return (
    <>
      <a href="#about" className="skip-to-content">
        Skip to content
      </a>

      {/* Floating De-Coupled Corner Controls (Zero Full-Width Spanning Bar) */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[1520px] mx-auto flex items-center justify-between">
          
          {/* Top-Left Floating Identity: Initials Logo + Frameless Hovering Name */}
          <Link
            href="/"
            aria-label="Haresh Murugesan — Home"
            className="pointer-events-auto flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#FF6B35] select-none transition-transform duration-150 active:scale-95"
          >
            {/* Initials Logo Badge */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 bg-[#101B30] border border-[#F3EFE7]/20 rounded-[2px] flex items-center justify-center font-raleway text-xs sm:text-sm font-bold text-[#F3EFE7] group-hover:border-[#FF6B35] group-hover:text-[#FF6B35] transition-colors shrink-0 shadow-[0_2px_8px_rgba(7,11,18,0.6)]">
              HM
            </span>

            {/* Name hovering freely over background */}
            <span className="font-raleway font-semibold text-[15px] sm:text-[16px] text-[#F3EFE7] tracking-tight group-hover:text-[#FF6B35] transition-colors whitespace-nowrap drop-shadow-[0_2px_8px_rgba(7,11,18,0.8)]">
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
            <span className="absolute right-0 top-full mt-2.5 px-2 py-1 bg-[#070B12]/95 border border-[#F3EFE7]/15 text-[10px] font-mono uppercase tracking-widest text-[#F3EFE7] opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap shadow-xl rounded-[2px] translate-y-1 group-hover:translate-y-0">
              {navOpen ? 'CLOSE' : 'INDEX'}
            </span>
          </div>

        </div>
      </header>

      {/* Full Architectural Editorial Navigation Overlay / Drawer */}
      <div
        ref={navContainerRef}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          navOpen
            ? 'opacity-100 pointer-events-auto visible'
            : 'opacity-0 pointer-events-none invisible'
        }`}
        aria-hidden={!navOpen}
        role="dialog"
        aria-label="Site Navigation"
      >
        {/* Backdrop Tint & Blur */}
        <div
          onClick={() => setNavOpen(false)}
          className="absolute inset-0 bg-[#070B12]/96 backdrop-blur-xl transition-opacity duration-300 cursor-pointer"
        />

        {/* Diagonal Subtle Hairline Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#F3EFE7]/40 to-transparent top-1/4 -rotate-12 transform origin-left" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B35]/40 to-transparent bottom-1/3 -rotate-12 transform origin-right" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 pb-10 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Navigation Grid: Primary Left, Secondary Index Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-auto items-start">
            
            {/* Left Column: Primary Monumental Links (Span 7) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B35] mb-3">
                <span className="w-2.5 h-px bg-[#FF6B35]" />
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
                      <span className="font-raleway font-bold text-[2rem] sm:text-[3rem] md:text-[3.5rem] text-[#F3EFE7] group-hover:text-[#F5D998] leading-none transition-colors tracking-tight">
                        {item.label}
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-[#7A889B] group-hover:text-[#A7B2C3] transition-colors">
                        / {item.note}
                      </span>
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Column: Architectural Secondary Index (Span 5) */}
            <div className="lg:col-span-5 bg-[#101B30]/40 border border-[#F3EFE7]/[0.08] p-6 sm:p-7 space-y-5 rounded-[2px]">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#A7B2C3] uppercase pb-2.5 border-b border-[#F3EFE7]/[0.08]">
                <span className="text-[#F5D998]">SECTIONS &amp; ARCHITECTURAL INDEX</span>
                <span>(07 RECORDS)</span>
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
                        className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#A7B2C3] hover:text-[#F3EFE7] hover:bg-[#101B30] border-b border-[#F3EFE7]/[0.04] transition-colors group rounded-[2px]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-[#FF6B35]">{item.num}</span>
                          <span className="font-medium text-[#F3EFE7]">{item.label}</span>
                        </span>
                        <span className="text-xs text-[#F5D998] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
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
                      className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#A7B2C3] hover:text-[#F3EFE7] hover:bg-[#101B30] border-b border-[#F3EFE7]/[0.04] transition-colors group rounded-[2px]"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[#FF6B35]">{item.num}</span>
                        <span className="font-medium text-[#F3EFE7]">{item.label}</span>
                      </span>
                      <span className="text-[#7A889B] group-hover:text-[#FF6B35] transition-colors">
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Direct Quick Contact Dispatch */}
              <div className="pt-3 border-t border-[#F3EFE7]/[0.08] flex items-center justify-between text-xs font-mono text-[#7A889B]">
                <span>DIRECT DISPATCH:</span>
                <a
                  href="mailto:murugesan.32@osu.edu"
                  className="text-[#FF6B35] hover:text-[#F5D998] transition-colors"
                >
                  murugesan.32@osu.edu ↗
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Colophon / Status Bar */}
          <div className="pt-6 border-t border-[#F3EFE7]/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#7A889B]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
              <span>COLUMBUS, OH · THE OHIO STATE UNIVERSITY</span>
            </div>
            <div className="flex items-center gap-6">
              <span>PRESS [ESC] TO CLOSE</span>
              <span>© {new Date().getFullYear()} HARESH MURUGESAN</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
