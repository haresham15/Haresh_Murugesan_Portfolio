import React from 'react';
import MedallionCarousel from './MedallionCarousel';

export const AchievementsGallery: React.FC = () => {
  return (
    <section
      id="achievements"
      className="relative w-full max-w-none overflow-visible py-20 sm:py-28 select-none"
      aria-label="Distinctions, competitive victories and credentials"
    >
      <MedallionCarousel />
    </section>
  );
};

export default AchievementsGallery;
