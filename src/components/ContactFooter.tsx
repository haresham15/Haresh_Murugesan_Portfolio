import React, { useState } from 'react';
import { ThemeSection } from './ThemeSection';

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
    <footer id="contact" className="relative w-screen max-w-none text-[#F4F1EA]" aria-label="Contact and colophon">
      <ThemeSection
        id="contact-section"
        theme="obsidian"
        className="flex flex-col justify-between"
      >
        <div className="w-full flex flex-col my-auto space-y-16 sm:space-y-24">
          
          {/* Expansive Statement Composition */}
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-[#E85D04]">
              <span className="w-6 h-px bg-[#E85D04]" />
              <span>07 // DIRECT DISPATCH &amp; CORRESPONDENCE</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl text-[#F4F1EA] leading-[1.05] tracking-tight">
              <span className="font-raleway font-bold block sm:inline">Have an interesting problem? </span>
              <span className="font-serif italic font-normal text-[#F4A261] block sm:inline">
                Let’s talk about how I can help.
              </span>
            </h2>

            <p className="text-lg sm:text-xl font-sans text-[#8E8D94] max-w-2xl leading-relaxed">
              Based in Columbus, OH — actively interviewing for Summer 2027 Software Engineering, AI/ML, and High-Performance Systems roles. Open to hybrid or relocation opportunities.
            </p>
          </div>

          {/* 3-Tier Action Hierarchy */}
          <div className="space-y-10 border-t border-[#F4F1EA]/10 pt-12 sm:pt-16">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-3xl">
              {/* Primary Action: Direct Email */}
              <a
                href={`mailto:${email}`}
                className="bg-[#E85D04] hover:bg-[#F4A261] text-[#060608] font-mono text-xs font-semibold px-8 py-5 rounded-[2px] flex items-center justify-between sm:justify-center gap-3 transition-colors select-none group shadow-[0_0_24px_rgba(232,93,4,0.35)]"
              >
                <span>Send Direct Email</span>
                <span className="text-base group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </a>

              {/* Secondary Action: Copy Email */}
              <button
                onClick={handleCopyEmail}
                type="button"
                className="bg-[#0C0F17] hover:bg-[#151B28] text-[#F4F1EA] border border-[#F4F1EA]/15 rounded-[2px] font-mono text-xs px-6 py-5 flex items-center justify-between sm:justify-center gap-3 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${copied ? 'bg-[#10B981]' : 'bg-[#E85D04]'}`} />
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Email Address'}</span>
                </div>
                <span className="text-[#8E8D94]">{copied ? '✓' : '⧉'}</span>
              </button>

              {/* Tertiary Action: Résumé */}
              <a
                href="/Haresh_Murugesan_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0C0F17] hover:bg-[#151B28] text-[#F4F1EA] border border-[#F4F1EA]/15 rounded-[2px] font-mono text-xs px-6 py-5 flex items-center justify-between sm:justify-center gap-2 transition-colors select-none font-medium"
              >
                <span>Download Résumé</span>
                <span className="text-[#F4A261]">↗</span>
              </a>
            </div>

            {/* Social Links & Back to Top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 text-xs font-mono text-[#8E8D94] border-t border-[#F4F1EA]/[0.06]">
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/haresham15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F4F1EA] transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://linkedin.com/in/haresh-murugesan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F4F1EA] transition-colors"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F4F1EA] transition-colors"
                >
                  Spotify ↗
                </a>
                <a
                  href="https://www.youtube.com/@syntinuum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F4F1EA] transition-colors"
                >
                  YouTube ↗
                </a>
              </div>

              <button
                onClick={scrollToTop}
                type="button"
                className="hover:text-[#E85D04] transition-colors flex items-center gap-2 text-left sm:text-right cursor-pointer"
              >
                <span>Return to Summit [TOP]</span>
                <span>↑</span>
              </button>
            </div>

            {/* Minimalist Colophon */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#64748B] pt-4">
              <span>© {new Date().getFullYear()} HARESH MURUGESAN · ALL RIGHTS RESERVED</span>
              <span>DESIGNED &amp; BUILT IN COLUMBUS, OH · NEXT.JS &amp; THREE.JS</span>
            </div>

          </div>

        </div>
      </ThemeSection>
    </footer>
  );
};

export default ContactFooter;
