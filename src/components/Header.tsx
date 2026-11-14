import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { WheelNavTrigger } from './WheelNavTrigger';
import { useLockBodyScroll } from '@/lib/useLockBodyScroll';
import { Portal } from './ui/Portal';
import { profile } from '@/content/profile';
import { useMaterialAt } from '@/v7/materials/useMaterialAt';
import { track } from '@vercel/analytics';

const NAV_ID = 'site-nav';

interface NavDestination {
  num: string;
  label: string;
  href: string;
  note: string;
  external?: boolean;
}

// Each href points at a section id rendered on the home page (or a static file).
// Listed in page order.
const NAV_DESTINATIONS: NavDestination[] = [
  { num: '01', label: 'Work', href: '/#projects', note: 'Selected projects and case studies' },
  { num: '02', label: 'Recognition', href: '/#achievements', note: 'Awards' },
  { num: '03', label: 'Experience', href: '/#experience', note: 'Roles and research' },
  { num: '04', label: 'Archive', href: '/#archive', note: 'All projects, mapped as a graph' },
  { num: '05', label: 'Technical Index', href: '/#skills', note: 'Languages, frameworks and tools' },
  { num: '06', label: 'Syntinuum', href: '/#podcast', note: 'The podcast' },
  { num: '07', label: 'About', href: '/#about', note: 'Background and approach' },
  { num: '08', label: 'Résumé', href: profile.contacts.resumeUrl, note: 'PDF, opens in a new tab', external: true },
  { num: '09', label: 'Contact', href: '/#contact', note: 'Email and profiles' },
];

// The inline bar shown from lg up. Each id is a home-page section.
const BAR_LINKS = [
  { label: 'Work', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Recognition', id: 'achievements' },
  { label: 'Skills', id: 'skills' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

// Every home section, so the highlight clears while the visitor is in one the bar doesn't name.
const SECTION_IDS = ['hero', 'projects', 'achievements', 'experience', 'archive', 'skills', 'podcast', 'about', 'history', 'now', 'contact'];

const GITHUB_PATH =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

const PROFILE_LINKS = [
  { label: 'GitHub', href: profile.contacts.github, path: GITHUB_PATH, track: 'github_click' },
  { label: 'LinkedIn', href: profile.contacts.linkedin, path: LINKEDIN_PATH, track: 'linkedin_click' },
];

/** The home section crossing a band a third of the way down the viewport; null off the home page. */
function useCurrentSection(enabled: boolean): string | null {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setCurrent(null);
      return;
    }
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    // How far visitors read: each section is reported once per visit, the first time it becomes current.
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setCurrent(id);
          if (!seen.has(id)) {
            seen.add(id);
            track('section_view', { section: id });
          }
        }
      },
      { rootMargin: '-33% 0px -66% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return current;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const brandRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const brandOn = useMaterialAt(brandRef);
  const rimOn = useMaterialAt(rimRef);
  const barOn = useMaterialAt(barRef);
  const currentSection = useCurrentSection(router.pathname === '/');
  // The bar is anchored right, so a font swap would slide its left edge. It appears once fonts are in.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let live = true;
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    if (!fonts) {
      setFontsReady(true);
      return;
    }
    fonts.ready.then(() => live && setFontsReady(true));
    return () => {
      live = false;
    };
  }, []);

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
      const reduced = document.documentElement.classList.contains('reduced-motion');
      el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
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

        {/* Inline bar from lg up: section links, résumé and profiles, one click from anywhere */}
        <nav
          ref={barRef}
          aria-label="Sections"
          data-on={navOpen ? 'dark' : barOn}
          className={`hidden ${fontsReady ? 'lg:flex' : ''} fixed top-8 right-28 xl:right-32 h-8 items-center gap-x-5 xl:gap-x-6 pointer-events-auto transition-opacity duration-200 ${
            navOpen ? 'opacity-0 invisible' : 'opacity-100'
          }`}
        >
          <ul className="flex items-center gap-x-4 xl:gap-x-5">
            {BAR_LINKS.map((link) => {
              const active = currentSection === link.id;
              return (
                <li key={link.id}>
                  <Link
                    href={`/#${link.id}`}
                    scroll={router.pathname !== '/'}
                    onClick={() => handleLinkClick(`/#${link.id}`)}
                    aria-current={active ? 'true' : undefined}
                    className={`group on-material relative inline-flex min-h-8 items-center font-sans text-[13px] tracking-tight text-[var(--on-ink)] drop-shadow-[0_2px_8px_var(--on-shadow)] transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#FF2800] ${
                      active ? 'opacity-100' : 'opacity-75'
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 right-0 bottom-0.5 h-px bg-[#FF2800] origin-left transition-transform duration-300 ease-out-expo ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <a
            href={profile.contacts.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="resume_click"
            className="on-material inline-flex h-8 items-center gap-1.5 rounded-[2px] border border-[#FF2800] px-3 font-sans text-[13px] font-medium text-[var(--on-ink)] hover:bg-[#FF2800] hover:text-[#03050A] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#FF2800]"
          >
            Résumé <span aria-hidden="true">↗</span>
          </a>
          <ul className="flex items-center gap-x-1">
            {PROFILE_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track={link.track}
                  aria-label={link.label}
                  className="on-material inline-flex h-8 w-8 items-center justify-center text-[var(--on-ink)] opacity-75 hover:opacity-100 transition-opacity focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#FF2800]"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
                    <path d={link.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>

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
                        data-track={dest.href === profile.contacts.resumeUrl ? 'resume_click' : undefined}
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
              <span className="flex flex-wrap items-center gap-x-5">
                <a
                  href={`mailto:${profile.contacts.email}`}
                  className="text-[#C8D2E0] hover:text-[#FF2800] transition-colors"
                >
                  {profile.contacts.email}
                </a>
                {PROFILE_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={link.track}
                    className="inline-flex min-h-[44px] items-center gap-1 text-[#C8D2E0] hover:text-[#FF2800] transition-colors"
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </span>
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
