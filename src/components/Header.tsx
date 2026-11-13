import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WheelNavTrigger } from './WheelNavTrigger';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';
import { Portal } from './ui/Portal';
import { profile } from '@/content/profile';
import { useMaterialAt } from '@/v7/materials/useMaterialAt';

const NAV_ID = 'site-nav';

interface NavDestination {
  num: string;
  label: string;
  href: string;
  note: string;
  external?: boolean;
}

// Each href points at a section id rendered on the home page (or a static file).
const NAV_DESTINATIONS: NavDestination[] = [
  { num: '01', label: 'Work', href: '/#projects', note: 'Selected projects and case studies' },
  { num: '02', label: 'Archive', href: '/#archive', note: 'Systems and repositories, mapped as a graph' },
  { num: '03', label: 'Experience', href: '/#experience', note: 'Roles and research' },
  { num: '04', label: 'Syntinuum', href: '/#podcast', note: 'The podcast' },
  { num: '05', label: 'Technical Index', href: '/#skills', note: 'Languages, frameworks and tools' },
  { num: '06', label: 'Recognition', href: '/#achievements', note: 'Awards and certificates' },
  { num: '07', label: 'About', href: '/#about', note: 'Background and approach' },
  { num: '08', label: 'Résumé', href: profile.contacts.resumeUrl, note: 'PDF, opens in a new tab', external: true },
  { num: '09', label: 'Contact', href: '/#contact', note: 'Email and profiles' },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const brandRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const brandOn = useMaterialAt(brandRef);
  const rimOn = useMaterialAt(rimRef);

  const closeNav = useCallback(() => setNavOpen(false), []);

  // Close navigation when route changes
  useEffect(() => {
    setNavOpen(false);
  }, [router.asPath]);

  useLockBodyScroll(navOpen);

  // Focus: move into the dialog on open, hand back to the wheel on close.
  useEffect(() => {
    if (navOpen) {
      wasOpen.current = true;
      const id = window.setTimeout(() => {
        navContainerRef.current?.querySelector<HTMLElement>('[data-nav-link]')?.focus({ preventScroll: true });
      }, 60);
      return () => window.clearTimeout(id);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [navOpen]);

  // Esc closes; Tab cycles through the dialog plus the wheel (which stays above the overlay).
  useEffect(() => {
    if (!navOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setNavOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const inDialog = Array.from(navContainerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      const ring = triggerRef.current ? [triggerRef.current, ...inDialog] : inDialog;
      if (ring.length === 0) return;
      const index = ring.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      const next = index === -1
        ? 0
        : (index + (e.shiftKey ? -1 : 1) + ring.length) % ring.length;
      ring[next].focus();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navOpen]);

  const handleLinkClick = (href: string) => {
    setNavOpen(false);
    if (href.startsWith('/#') && router.pathname === '/') {
      const el = document.getElementById(href.slice(2));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Lifted above the overlay while it is open, so the wheel doubles as the close control */}
      <header className={`fixed top-0 left-0 w-full pointer-events-none ${navOpen ? 'z-[110]' : 'z-50'}`}>
        {/* Monogram and wheel share a vertical centre line: 40px on phones, 48px from sm up */}
        <div ref={brandRef} data-on={navOpen ? 'dark' : brandOn} className="fixed top-6 left-4 sm:top-8 sm:left-6 md:left-12 pointer-events-auto">
          <Link
            href="/"
            aria-label={`${profile.name}, home`}
            className="flex items-center gap-2.5 sm:gap-3 group select-none transition-transform duration-150 ease-out-expo active:scale-95"
          >
            <span className="on-material w-8 h-8 rounded-[2px] bg-[var(--on-surface)] border border-[var(--on-ink-soft)] text-[var(--on-ink)] flex items-center justify-center font-mono text-xs font-semibold group-hover:border-[#FF2800] group-hover:text-[#FF2800] shadow-[0_2px_12px_var(--on-shadow)]">
              HM
            </span>
            <span className="on-material font-sans font-medium text-[15px] tracking-tight text-[var(--on-ink)] group-hover:text-[#FF2800] whitespace-nowrap drop-shadow-[0_2px_8px_var(--on-shadow)]">
              {profile.name}
            </span>
          </Link>
        </div>

        <div ref={rimRef} data-rim="" data-on={navOpen ? 'dark' : rimOn} className="fixed top-2 right-3 sm:top-4 sm:right-6 md:right-12 pointer-events-auto">
          <WheelNavTrigger
            isOpen={navOpen}
            onToggle={() => setNavOpen((open) => !open)}
            buttonRef={triggerRef}
            controls={NAV_ID}
          />
        </div>
      </header>

      <Portal>
        <div
          id={NAV_ID}
          ref={navContainerRef}
          className={`fixed inset-0 z-[100] transition-[opacity,visibility] duration-[420ms] ease-out-expo ${
            navOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
          }`}
          aria-hidden={!navOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          {/* Frosted obsidian */}
          <div
            onClick={closeNav}
            className="absolute inset-0 bg-[#03050A]/90 backdrop-blur-2xl backdrop-saturate-150 cursor-pointer"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 82% 12%, rgba(21, 56, 117, 0.24) 0%, transparent 58%), radial-gradient(ellipse at 14% 92%, rgba(255, 40, 0, 0.08) 0%, transparent 62%)',
            }}
          />

          <nav
            aria-label="Primary"
            className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-4 sm:px-[6vw] xl:px-[7vw] pt-24 sm:pt-28 pb-8 sm:pb-12 flex flex-col justify-between overflow-y-auto pointer-events-none"
          >
            <div className="flex items-center justify-end pb-4 sm:pb-6 border-b border-[#C8D2E0]/10 pointer-events-auto">
              <button
                type="button"
                onClick={closeNav}
                className="group flex items-center gap-3 py-2 font-sans text-[13px] text-[#C8D2E0] hover:text-[#F4F6F9] transition-colors cursor-pointer"
              >
                Close
                <kbd className="font-mono text-[11px] text-[#7E8B9B] border border-[#C8D2E0]/20 rounded-[2px] px-1.5 py-0.5 group-hover:border-[#FF2800] group-hover:text-[#FF2800] transition-colors">
                  Esc
                </kbd>
              </button>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 my-auto py-4 sm:py-8 pointer-events-auto">
              {NAV_DESTINATIONS.map((dest, i) => {
                const motion = {
                  transitionDelay: navOpen ? `${80 + i * 35}ms` : '0ms',
                };
                const itemClass = `block transition-[opacity,transform] duration-[640ms] ease-out-expo ${
                  navOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`;
                const linkClass =
                  'group flex flex-col py-3 sm:py-5 px-1 sm:px-2 border-b border-[#C8D2E0]/10 hover:border-[#FF2800] focus-visible:border-[#FF2800] transition-colors duration-200 select-none';
                const body = (
                  <>
                    <span className="flex items-center justify-between font-mono text-xs mb-1 sm:mb-2">
                      <span className="text-[#FF2800] tabular-nums">{dest.num}</span>
                      <span
                        aria-hidden="true"
                        className="text-[#7E8B9B] group-hover:text-[#FF2800] group-hover:translate-x-1 transition-[color,transform] duration-300 ease-out-expo"
                      >
                        {dest.external ? '↗' : '→'}
                      </span>
                    </span>
                    <span className="font-serif text-2xl lg:text-3xl text-[#F4F6F9] group-hover:text-[#FF2800] transition-colors leading-tight">
                      {dest.label}
                    </span>
                    <span className="font-sans text-[13px] text-[#7E8B9B] mt-1 group-hover:text-[#C8D2E0] transition-colors">
                      {dest.note}
                    </span>
                  </>
                );
                return (
                  <li key={dest.label} className={itemClass} style={motion}>
                    {dest.external ? (
                      <a
                        data-nav-link
                        href={dest.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeNav}
                        className={linkClass}
                      >
                        {body}
                      </a>
                    ) : (
                      <Link
                        data-nav-link
                        href={dest.href}
                        scroll={router.pathname !== '/'}
                        onClick={() => handleLinkClick(dest.href)}
                        className={linkClass}
                      >
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="pt-6 border-t border-[#C8D2E0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans text-[13px] text-[#7E8B9B] pointer-events-auto">
              <a
                href={`mailto:${profile.contacts.email}`}
                className="text-[#C8D2E0] hover:text-[#FF2800] transition-colors"
              >
                {profile.contacts.email}
              </a>
              <span>
                {profile.education.location} · {profile.education.university}
              </span>
            </div>
          </nav>
        </div>
      </Portal>
    </>
  );
}
