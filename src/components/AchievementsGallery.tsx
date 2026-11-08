import React from 'react';
import MedallionCarousel from './MedallionCarousel';

export const AchievementsGallery: React.FC = () => {
  return (
    <section
      id="achievements"
      className="relative w-screen max-w-none overflow-hidden py-20 sm:py-28 select-none"
      aria-label="Distinctions, competitive victories and credentials"
    >
      <MedallionCarousel />
    </section>
  );
};

export default AchievementsGallery;
