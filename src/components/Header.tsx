import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GridCrosshair } from './ui/GridCrosshair';

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Work', href: '/#projects' },
    { label: 'Archive', href: '/projects' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Syntinuum', href: '/#podcast' },
    { label: 'Technical Index', href: '/#skills' },
    { label: 'Recognition', href: '/#achievements' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <a href="#about" className="skip-to-content">
        Skip to content
      </a>

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#07090D]/95 backdrop-blur-xl border-b border-[#F4EFE6]/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 sm:px-8 flex items-center justify-between relative">
          
          {/* Identity & Status */}
          <Link
            href="/"
            aria-label="Haresh Murugesan — Home"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <span className="w-8 h-8 bg-[#0C1729] border border-[#F4EFE6]/15 flex items-center justify-center font-serif text-sm text-[#F4EFE6] font-medium group-hover:border-[#FFB86C] transition-colors shrink-0">
              HM
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-[15px] text-[#F4EFE6] tracking-tight group-hover:text-[#FFB86C] transition-colors whitespace-nowrap">
                Haresh Murugesan
              </span>
              <span className="text-[11px] font-mono text-[#8A99AD] flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-[#FF6B2B]" />
                <span>AI/ML &amp; SYSTEMS ARCHITECTURE</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — 0px Swiss Hairlines */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center border border-[#F4EFE6]/10 divide-x divide-[#F4EFE6]/10 bg-[#07090D]/80 text-xs font-mono"
          >
            {navLinks.map((link) => {
              const isActive =
                router.pathname === link.href ||
                (link.href !== '/' && router.asPath.startsWith(link.href) && !link.href.includes('#'));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 transition-colors select-none ${
                    isActive
                      ? 'text-[#FFB86C] bg-[#0C1729]'
                      : 'text-[#C4CDD8] hover:text-[#FFB86C] hover:bg-[#0C1729]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Résumé & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="/Haresh_Murugesan_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#0C1729] hover:bg-[#132542] border border-[#F4EFE6]/15 text-[#F4EFE6] text-xs font-mono transition-colors whitespace-nowrap font-medium"
            >
              <span>Résumé</span>
              <span className="text-[#FFB86C]">↗</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 bg-[#0C1729] border border-white/10 text-[#F4EFE6] flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          <GridCrosshair className="absolute -bottom-[4.5px] left-6 sm:left-8" />
          <GridCrosshair className="absolute -bottom-[4.5px] right-6 sm:right-8" />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[56px] bg-[#07090D]/98 border-b border-[#F4EFE6]/15 backdrop-blur-2xl p-6 shadow-2xl flex flex-col space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-serif text-[#F4EFE6] hover:text-[#FFB86C] py-2.5 border-b border-white/[0.06] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-[#FFB86C]">→</span>
                </Link>
              ))}
              <a
                href="/Haresh_Murugesan_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 text-center py-3 bg-[#0C1729] text-[#F4EFE6] border border-[#FFB86C]/40 text-xs font-mono block"
              >
                View Full Résumé ↗
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
