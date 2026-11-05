import React, { useState } from 'react';
import { SectionContainer } from './ui/SectionContainer';

export const ContactFooter: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const email = 'haresh.murugesan@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt('Copy email address:', email);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="relative w-full bg-[#070B12] text-[#F3EFE7]" aria-label="Contact and colophon">
      <SectionContainer
        variant="editorial"
        bgMode="clean"
        className="pt-24 sm:pt-36 pb-20 sm:pb-28"
      >
        {/* 7.20 EXPANSIVE STATEMENT COMPOSITION: Generous Negative Space & Expressive Typography */}
        <div className="max-w-4xl space-y-8 mb-16 sm:mb-24">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl text-[#F3EFE7] leading-[1.05] tracking-tight">
            <span className="font-raleway font-bold block sm:inline">Have an interesting problem? </span>
            <span className="font-serif italic font-normal text-[#F5D998] block sm:inline">
              Let’s talk about how I could help.
            </span>
          </h2>

          <p className="text-lg sm:text-xl font-sans text-[#A7B2C3] max-w-2xl leading-relaxed">
            Based in Columbus, OH — actively interviewing for Summer 2027 Software Engineering, AI/ML, and Systems roles. Open to hybrid or relocation opportunities.
          </p>
        </div>

        {/* 7.21 STRICT 3-TIER ACTION HIERARCHY WITH MACHINED 2PX BEVELS */}
        <div className="space-y-10 border-t border-[#F3EFE7]/[0.08] pt-12 sm:pt-16">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-2xl">
            {/* Primary Action: Direct Email */}
            <a
              href={`mailto:${email}`}
              className="bg-[#FF6B35] hover:bg-[#FF8547] text-[#070B12] font-mono text-xs font-semibold px-8 py-5 rounded-[2px] flex items-center justify-between sm:justify-center gap-3 transition-colors select-none group shadow-[0_0_20px_rgba(255,107,53,0.3)]"
            >
              <span>Send Direct Email</span>
              <span className="text-base group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </a>

            {/* Secondary Action: Copy Email */}
            <button
              onClick={handleCopyEmail}
              type="button"
              className="bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] font-mono text-xs px-6 py-5 flex items-center justify-between sm:justify-center gap-3 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${copied ? 'bg-[#4CC38A]' : 'bg-[#FF6B35]'}`} />
                <span>{copied ? 'Copied to Clipboard' : 'Copy Email Address'}</span>
              </div>
              <span className="text-[#A7B2C3]">{copied ? '✓' : '⧉'}</span>
            </button>

            {/* Tertiary Action: Résumé */}
            <a
              href="/Haresh_Murugesan_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#101B30] hover:bg-[#17243A] text-[#F3EFE7] border border-[#F3EFE7]/15 rounded-[2px] font-mono text-xs px-6 py-5 flex items-center justify-between sm:justify-center gap-2 transition-colors select-none font-medium"
            >
              <span>Download Résumé</span>
              <span className="text-[#F5D998]">↗</span>
            </a>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 text-xs font-mono text-[#A7B2C3]">
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/haresham15"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F3EFE7] transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/haresh-murugesan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F3EFE7] transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F3EFE7] transition-colors"
              >
                Spotify ↗
              </a>
              <a
                href="https://www.youtube.com/@syntinuum"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F3EFE7] transition-colors"
              >
                YouTube ↗
              </a>
            </div>

            <button
              onClick={scrollToTop}
              type="button"
              className="hover:text-[#F5D998] transition-colors cursor-pointer select-none inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Back to Top</span>
              <span>↑</span>
            </button>
          </div>

        </div>

      </SectionContainer>

      {/* 7.22 Restrained Minimal Colophon Footer */}
      <div className="w-full border-t border-[#F3EFE7]/[0.08] py-6 px-6 sm:px-10 lg:px-16 max-w-[1520px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#7A889B]">
        <span>© 2026 HARESH MURUGESAN · ALL RIGHTS RESERVED</span>
        <span>THE OHIO STATE UNIVERSITY · B.S. CSE (ARTIFICIAL INTELLIGENCE)</span>
      </div>
    </footer>
  );
};

export default ContactFooter;
