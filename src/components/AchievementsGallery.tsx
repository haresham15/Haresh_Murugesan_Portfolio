import React from 'react';
import MedallionCarousel from './MedallionCarousel';

export const AchievementsGallery: React.FC = () => {
  return (
    <section
      id="achievements"
      className="relative w-full max-w-none overflow-x-clip py-24 lg:py-36 border-b border-[#18458B]/20"
      aria-label="Recognition and distinctions"
    >
      <MedallionCarousel />
    </section>
  );
};

export default AchievementsGallery;
