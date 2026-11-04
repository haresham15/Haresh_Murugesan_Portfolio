import React, { useState } from 'react';
import { GridCrosshair } from './ui/GridCrosshair';

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
    <footer
      id="contact"
      className="relative w-full bg-[#07090D] border-b border-[#F4EFE6]/10"
      aria-label="Contact and availability"
    >
      <GridCrosshair className="absolute -top-[4.5px] -left-[4.5px]" active />
      <GridCrosshair className="absolute -top-[4.5px] -right-[4.5px]" />

      {/* 12-Column Blueprint Closing Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#F4EFE6]/10">
        
        {/* Cols 1–7: Authority Closing Statement (Rendered Once) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8A99AD] uppercase tracking-wider">
              <span className="text-[#FFB86C] font-semibold">09 // INQUIRY &amp; DISPATCH</span>
              <span>INDEX // 10.1</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F4EFE6] leading-[1.04] tracking-tight">
              <span>Have an interesting problem? </span>
              <span className="italic text-[#FFE9AE] block sm:inline">
                Let’s talk about how I could help.
              </span>
            </h2>

            <p className="text-[16px] sm:text-[18px] font-sans text-[#B0BCCB] max-w-xl leading-[1.7]">
              Based in Columbus, OH — actively interviewing for Summer 2027 Software Engineering, AI/ML, and Systems roles. Open to hybrid or relocation opportunities.
            </p>
          </div>

          <div className="pt-8 border-t border-[#F4EFE6]/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#8A99AD]">
            <span>EMAIL // {email}</span>
            <span>LOCATION // COLUMBUS, OH</span>
          </div>
        </div>

        {/* Cols 8–12: Flush 0px Architectural Action Grid */}
        <div className="lg:col-span-5 p-6 sm:p-10 lg:p-14 flex flex-col justify-between space-y-8 bg-[#0C1729]/30">
          <div className="space-y-4">
            <span className="text-xs font-mono text-[#8A99AD] uppercase tracking-wider block">
              ACTIONS // DIRECT DISPATCH
            </span>

            {/* Flush Architectural Action Cells */}
            <div className="border border-[#F4EFE6]/15 divide-y divide-[#F4EFE6]/15 text-xs font-mono">
              <a
                href={`mailto:${email}`}
                className="w-full bg-[#FF6B2B] hover:bg-[#FF8147] text-[#07090D] font-semibold px-6 py-5 flex items-center justify-between transition-colors select-none group"
              >
                <span>Send Direct Email</span>
                <span className="text-base group-hover:translate-x-0.5 transition-transform">→</span>
              </a>

              <button
                onClick={handleCopyEmail}
                type="button"
                className="w-full bg-[#0C1729] hover:bg-[#132542] text-[#F4EFE6] px-6 py-4 flex items-center justify-between transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 ${copied ? 'bg-[#4CC38A]' : 'bg-[#FF6B2B]'}`} />
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Email Address'}</span>
                </div>
                <span className="text-[#8A99AD]">{copied ? '✓' : '⧉'}</span>
              </button>

              <a
                href="/Haresh_Murugesan_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0C1729] hover:bg-[#132542] text-[#F4EFE6] px-6 py-4 flex items-center justify-between transition-colors select-none font-medium"
              >
                <span>Download Résumé (PDF)</span>
                <span className="text-[#FFB86C]">↗</span>
              </a>
            </div>
          </div>

          {/* Social Links & Back to Top */}
          <div className="pt-6 border-t border-[#F4EFE6]/10 flex items-center justify-between text-xs font-mono text-[#8A99AD]">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/haresham15"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F4EFE6] transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/haresh-murugesan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F4EFE6] transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F4EFE6] transition-colors"
              >
                Spotify ↗
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="hover:text-[#FFB86C] transition-colors cursor-pointer select-none"
            >
              Top ↑
            </button>
          </div>
        </div>

      </div>

      {/* Colophon Datum Bar */}
      <div className="w-full h-11 border-t border-[#F4EFE6]/10 px-6 sm:px-8 flex items-center justify-between text-xs font-mono text-[#8A99AD] bg-[#07090D]">
        <span>© 2026 HARESH MURUGESAN</span>
        <span>THE OHIO STATE UNIVERSITY · B.S. CSE (AI)</span>
      </div>
    </footer>
  );
};

export default ContactFooter;
