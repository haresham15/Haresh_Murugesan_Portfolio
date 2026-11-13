import React, { useEffect, useRef, useState } from 'react';
import { ThemeSection, Reveal } from './ThemeSection';
import { useMotionPreference } from './MotionPreference';
import { profile } from '@/content/profile';

const SOCIAL = [
  { label: 'GitHub', href: profile.contacts.github },
  { label: 'LinkedIn', href: profile.contacts.linkedin },
  { label: 'Spotify', href: 'https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98' },
  { label: 'YouTube', href: 'https://www.youtube.com/@syntinuum' },
];

/** Clipboard API first; falls back to a hidden textarea + execCommand for older or insecure contexts. */
const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};

export const ContactFooter: React.FC = () => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<number | undefined>(undefined);
  const { isReduced } = useMotionPreference();
  const email = profile.contacts.email;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopyEmail = async () => {
    const ok = await copyText(email);
    setCopyState(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopyState('idle'), 2400);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: isReduced ? 'auto' : 'smooth' });

  return (
    <footer id="contact" className="relative w-full text-[#F4F6F9]" aria-label="Contact">
      <ThemeSection id="contact-section" theme="obsidian" className="pt-24 lg:pt-36 pb-10">
        <div className="w-full flex flex-col">
          <Reveal className="max-w-[18ch] sm:max-w-none">
            <h2 className="font-serif font-normal text-[#F4F6F9] text-[length:var(--display-size)] leading-[0.98] tracking-[-0.03em]">
              Have an interesting problem?
              <span className="block italic text-[#FF2800]">Let’s talk.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <p className="lg:col-span-6 max-w-[52ch] text-base sm:text-lg font-sans text-[#C8D2E0]/85 leading-relaxed">
              Based in {profile.education.location}. {profile.availability.status} for{' '}
              {profile.availability.targetSeason} {profile.availability.seeking.toLowerCase()}.
            </p>

            <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 font-mono text-xs">
              <a
                href={`mailto:${email}`}
                className="group min-h-[52px] bg-[#FF2800] hover:bg-[#FF4419] text-[#03050A] font-semibold px-7 rounded-[2px] inline-flex items-center justify-between sm:justify-center gap-3 transition-colors"
              >
                <span>Send Direct Email</span>
                <span aria-hidden="true" className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  →
                </span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[52px] px-6 rounded-[2px] border border-[#C8D2E0]/20 hover:border-[#C8D2E0]/50 text-[#F4F6F9] inline-flex items-center justify-between sm:justify-center gap-3 transition-colors cursor-pointer"
              >
                <span className="relative inline-grid">
                  {(['idle', 'copied', 'failed'] as const).map((state) => (
                    <span
                      key={state}
                      aria-hidden={copyState !== state}
                      style={{ gridArea: '1 / 1' }}
                      className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        copyState === state ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                      } ${state === 'copied' ? 'text-[#FF2800]' : ''}`}
                    >
                      {state === 'idle' ? 'Copy Email' : state === 'copied' ? 'Copied ✓' : 'Copy failed, address below'}
                    </span>
                  ))}
                </span>
                <span className="sr-only" aria-live="polite">
                  {copyState === 'copied' ? 'Email address copied' : copyState === 'failed' ? `Copy failed. The address is ${email}` : ''}
                </span>
              </button>
              <a
                href={profile.contacts.resumeUrl}
                download={profile.contacts.resumeDownloadName}
                className="min-h-[52px] px-6 rounded-[2px] border border-[#C8D2E0]/20 hover:border-[#C8D2E0]/50 text-[#F4F6F9] inline-flex items-center justify-between sm:justify-center gap-3 transition-colors"
              >
                <span>Résumé</span>
                <span aria-hidden="true" className="text-[#7E8B9B]">↓</span>
              </a>
            </div>
          </Reveal>

          <a
            href={`mailto:${email}`}
            className="mt-10 self-start font-mono text-xs sm:text-sm text-[#7E8B9B] hover:text-[#F4F6F9] transition-colors break-all"
          >
            {email}
          </a>

          {/* Footer */}
          <div className="mt-20 sm:mt-28 pt-6 border-t border-[#C8D2E0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono text-xs text-[#7E8B9B]">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-1 hover:text-[#F4F6F9] transition-colors"
                  >
                    {s.label} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={scrollToTop}
              className="min-h-[44px] self-start sm:self-auto inline-flex items-center gap-2 hover:text-[#FF2800] transition-colors cursor-pointer"
            >
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[12px] text-[#7E8B9B]/80">
            <span>© {new Date().getFullYear()} {profile.name}</span>
          </div>
        </div>
      </ThemeSection>
    </footer>
  );
};

export default ContactFooter;
