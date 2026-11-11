import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WheelNavTrigger } from './WheelNavTrigger';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';
import { Portal } from './ui/Portal';

export default function Header() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

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

  // 9 Preserved Destinations: Work, Archive, Experience, Syntinuum, Technical Index, Recognition, About, Résumé, Contact
  const navDestinations = [
    { num: '01', label: 'Work', href: '/#projects', note: 'Selected Works & Architecture' },
    { num: '02', label: 'Archive', href: '/projects', note: 'Linear Systems CodeGraph (18 Repositories)' },
    { num: '03', label: 'Experience', href: '/#experience', note: 'Naturally Curvy Grand Prix Circuit' },
    { num: '04', label: 'Syntinuum', href: '/#podcast', note: 'Waveform Studio & Technical Dialogues' },
    { num: '05', label: 'Technical Index', href: '/#skills', note: 'Production Stacks & Competencies' },
    { num: '06', label: 'Recognition', href: '/#achievements', note: '3D Medallion Awards Carousel' },
    { num: '07', label: 'About', href: '/#about', note: 'Engineering Thesis & Digital Pathology Artifact' },
    { num: '08', label: 'Résumé', href: '/Haresh_Murugesan_Resume.pdf', note: 'Verified CV & Background', external: true },
    { num: '09', label: 'Contact', href: '/#contact', note: 'Direct Dispatch & Correspondence' },
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

      {/* Top Navigation Bar: Minimal Fixed Elements */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        {/* Top-Left Floating Identity: [HM] badge + Haresh Murugesan (15px medium tracking) */}
        <div className="fixed top-6 left-6 md:left-12 pointer-events-auto z-50">
          <Link
            href="/"
            aria-label="Haresh Murugesan — Home"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#FF2800] select-none transition-transform duration-150 active:scale-95"
          >
            <span className="w-8 h-8 rounded-[2px] bg-[#060A12] border border-[#C8D2E0]/30 text-[#F4F6F9] flex items-center justify-center font-mono text-xs font-semibold group-hover:border-[#FF2800] group-hover:text-[#FF2800] transition-colors duration-200 shadow-[0_2px_12px_rgba(3,5,10,0.85)]">
              HM
            </span>
            <span className="font-sans font-medium text-[15px] tracking-tight text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors duration-200 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(3,5,10,0.9)]">
              Haresh Murugesan
            </span>
          </Link>
        </div>

        {/* Top-Right Floating 64px x 64px Wheel Rim Trigger */}
        <div className="fixed top-6 right-6 md:right-12 pointer-events-auto z-50">
          <WheelNavTrigger
            isOpen={navOpen}
            onToggle={() => setNavOpen(!navOpen)}
          />
        </div>
      </header>

      {/* Borderless Frosted-Obsidian Navigation Overlay (z-[100]) */}
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
          {/* Frosted Obsidian Backdrop */}
          <div
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-[#03050A]/95 backdrop-blur-2xl transition-opacity duration-300 cursor-pointer"
          />

          {/* Anisotropic Radial Depth Sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 80% 20%, rgba(21, 56, 117, 0.22) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255, 40, 0, 0.12) 0%, transparent 65%)',
            }}
          />

          {/* Content Container */}
          <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-[4vw] md:px-[6vw] xl:px-[7vw] pt-28 pb-12 flex flex-col justify-between overflow-y-auto">
            
            {/* Header / Esc Instruction */}
            <div className="flex items-center justify-between pb-6 border-b border-[#20324F]/30 text-xs font-mono text-[#7E8B9B]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF2800] animate-pulse" />
                <span className="text-[#F4F6F9] font-medium tracking-wider uppercase">ARCHITECTURAL NAVIGATION</span>
                <span>·</span>
                <span className="text-[#C8D2E0]">09 DESTINATIONS</span>
              </div>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="hover:text-[#FF2800] transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>PRESS [ESC] TO CLOSE</span>
                <span className="text-[#FF2800]">✕</span>
              </button>
            </div>

            {/* 9 Preserved Destinations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 my-auto py-8">
              {navDestinations.map((dest) => {
                if (dest.external) {
                  return (
                    <a
                      key={dest.label}
                      href={dest.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setNavOpen(false)}
                      className="group py-5 px-6 border-b border-[#20324F]/30 hover:border-[#FF2800] transition-all duration-200 flex flex-col justify-between select-none"
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-[#FF2800] font-bold">{dest.num}</span>
                        <span className="text-[#C8D2E0] group-hover:translate-x-1 transition-transform">↗</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors leading-tight">
                        {dest.label}
                      </h3>
                      <p className="text-xs font-mono text-[#7E8B9B] mt-2 group-hover:text-[#C8D2E0] transition-colors">
                        {dest.note}
                      </p>
                    </a>
                  );
                }

                return (
                  <Link
                    key={dest.label}
                    href={dest.href}
                    onClick={() => handleLinkClick(dest.href)}
                    className="group py-5 px-6 border-b border-[#20324F]/30 hover:border-[#FF2800] transition-all duration-200 flex flex-col justify-between select-none"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-[#FF2800] font-bold">{dest.num}</span>
                      <span className="text-[#C8D2E0] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors leading-tight">
                      {dest.label}
                    </h3>
                    <p className="text-xs font-mono text-[#7E8B9B] mt-2 group-hover:text-[#C8D2E0] transition-colors">
                      {dest.note}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Colophon / Direct Contact Dispatch */}
            <div className="pt-6 border-t border-[#20324F]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#7E8B9B]">
              <div className="flex items-center gap-3">
                <span className="text-[#C8D2E0]">DIRECT DISPATCH:</span>
                <a
                  href="mailto:haresh.murugesan@gmail.com"
                  className="text-[#FF2800] hover:text-[#F4F6F9] transition-colors"
                >
                  haresh.murugesan@gmail.com ↗
                </a>
              </div>
              <div className="flex items-center gap-6">
                <span>COLUMBUS, OH · THE OHIO STATE UNIVERSITY</span>
                <span>© {new Date().getFullYear()} HARESH MURUGESAN</span>
              </div>
            </div>

          </div>
        </div>
      </Portal>
    </>
  );
}
