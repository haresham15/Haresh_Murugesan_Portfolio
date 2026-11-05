import React from 'react';
import { profile } from '@/content/profile';

export const ManifestoSection: React.FC = () => {
  const { manifesto } = profile;

  return (
    <section className="w-full bg-[#070B12]/60 border-y border-[#F3EFE7]/[0.08] py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-baseline gap-6 md:gap-10">
          
          {/* Dictionary Phonetic Block */}
          <div className="shrink-0 flex flex-col">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-[#F3EFE7] tracking-tight">
              {manifesto.word}
            </span>

            <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#A6ADB8]">
              <span>{manifesto.phonetic}</span>
              <span>·</span>
              <span className="italic">{manifesto.partOfSpeech}</span>
            </div>
          </div>

          {/* Definition & Thesis */}
          <div className="border-l-0 md:border-l border-[#F3EFE7]/10 md:pl-8 flex flex-col gap-2">
            <p className="text-sm sm:text-base font-sans text-[#E0E0E0] leading-relaxed">
              {manifesto.definition}
            </p>
            <p className="text-base sm:text-lg font-heading font-semibold text-[#7DD3FC] tracking-tight">
              &ldquo;{manifesto.thesis}&rdquo;
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
