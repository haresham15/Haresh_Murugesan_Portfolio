import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WheelNavTrigger } from './WheelNavTrigger';

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { label: 'Experience', href: '/#experience', note: 'Clinical research, enterprise software & telematics' },
    { label: 'About', href: '/#about', note: 'Research thesis, background & engineering principles' },
    { label: 'Contact', href: '/#contact', note: 'Direct encrypted dispatch & correspondence' },
  ];

  // Secondary architectural index
  const secondaryLinks = [
    { num: '01', label: 'Archive (18 Projects)', href: '/projects' },
    { num: '02', label: 'Syntinuum Podcast', href: '/#podcast' },
    { num: '03', label: 'Technical Index', href: '/#skills' },
    { num: '04', label: 'Recognition & Distinctions', href: '/#achievements' },
    { num: '05', label: 'Formative Milestones', href: '/#history' },
    { num: '06', label: 'Field Notes / Now', href: '/#now' },
    { num: '07', label: 'Curriculum Vitae', href: '/Haresh_Murugesan_Resume.pdf', external: true },
  ];

  const handleLinkClick = () => {
    setNavOpen(false);
  };

  return (
    <>
      <a href="#about" className="skip-to-content">
        Skip to content
      </a>

      {/* Floating Top Header Bar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-[76px] sm:h-[84px] flex items-center pointer-events-none ${
          scrolled
            ? 'bg-[#070B12]/80 backdrop-blur-md border-b border-[#F3EFE7]/[0.06]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between pointer-events-auto">
          
          {/* Top-Left Minimal Identity */}
          <Link
            href="/"
            aria-label="Haresh Murugesan — Home"
            className="flex items-center gap-3.5 group focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
          >
            <span className="w-9 h-9 bg-[#101B30] border border-[#F3EFE7]/15 flex items-center justify-center font-raleway text-sm text-[#F3EFE7] font-bold group-hover:border-[#F5D998] transition-colors shrink-0 tracking-tight">
              HM
            </span>
            <span className="font-raleway font-semibold text-[15px] sm:text-[16px] text-[#F3EFE7] tracking-tight group-hover:text-[#F5D998] transition-colors whitespace-nowrap">
              Haresh Murugesan
            </span>
          </Link>

          {/* Top-Right Architectural Wheel Rim Trigger */}
          <div className="flex items-center">
            <WheelNavTrigger
              isOpen={navOpen}
              onToggle={() => setNavOpen(!navOpen)}
            />
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
          className="absolute inset-0 bg-[#070B12]/96 backdrop-blur-xl transition-opacity duration-300"
        />

        {/* Diagonal Subtle Hairline Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#F3EFE7]/40 to-transparent top-1/4 -rotate-12 transform origin-left" />
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B35]/40 to-transparent bottom-1/3 -rotate-12 transform origin-right" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 sm:pt-32 pb-12 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Navigation Grid: Primary Left, Secondary Index Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 my-auto items-start">
            
            {/* Left Column: Primary Monumental Links (Span 7) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B35] mb-4">
                <span className="w-2.5 h-px bg-[#FF6B35]" />
                <span>PRIMARY DESTINATIONS</span>
              </div>

              <nav aria-label="Main Destinations" className="space-y-3 sm:space-y-4">
                {primaryLinks.map((item, idx) => (
                  <div key={item.label} className="group">
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className="inline-flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 transition-transform duration-300 group-hover:translate-x-2"
                    >
                      <span className="font-raleway font-bold text-[2.25rem] sm:text-[3.25rem] md:text-[4rem] text-[#F3EFE7] group-hover:text-[#F5D998] leading-none transition-colors tracking-tight">
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
            <div className="lg:col-span-5 bg-[#101B30]/40 border border-[#F3EFE7]/[0.08] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[#A7B2C3] uppercase pb-3 border-b border-[#F3EFE7]/[0.08]">
                <span className="text-[#F5D998]">TECHNICAL &amp; ARCHIVE INDEX</span>
                <span>(07 RECORDS)</span>
              </div>

              <div className="space-y-2">
                {secondaryLinks.map((item) => {
                  if (item.external) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#A7B2C3] hover:text-[#F3EFE7] hover:bg-[#101B30] border-b border-[#F3EFE7]/[0.04] transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-[#FF6B35]">{item.num}</span>
                          <span>{item.label}</span>
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
                      onClick={handleLinkClick}
                      className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#A7B2C3] hover:text-[#F3EFE7] hover:bg-[#101B30] border-b border-[#F3EFE7]/[0.04] transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[#FF6B35]">{item.num}</span>
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[#7A889B] group-hover:text-[#FF6B35] transition-colors">
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Direct Quick Contact Dispatch */}
              <div className="pt-4 border-t border-[#F3EFE7]/[0.08] flex items-center justify-between text-xs font-mono text-[#7A889B]">
                <span>ENCRYPTED DISPATCH:</span>
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
          <div className="pt-8 border-t border-[#F3EFE7]/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#7A889B]">
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
