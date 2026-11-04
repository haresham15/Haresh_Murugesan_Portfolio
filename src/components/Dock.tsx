import React, { useState, useEffect } from 'react';
import { AnimatedDock } from './ui/ReactBitsControls';

const sections = [
  { id: 'about', label: 'About', number: '01' },
  { id: 'experience', label: 'Experience', number: '02' },
  { id: 'podcast', label: 'Podcast', number: '03' },
  { id: 'projects', label: 'Systems', number: '04' },
  { id: 'skills', label: 'Atlas', number: '05' },
  { id: 'achievements', label: 'Awards', number: '06' },
  { id: 'history', label: 'Milestones', number: '07' },
  { id: 'now', label: 'Now', number: '08' },
  { id: 'contact', label: 'Contact', number: '09' },
];

export const Dock: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [showDock, setShowDock] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setShowDock(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      const heading = target.querySelector('h2, h1') as HTMLElement | null;
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        showDock
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none translate-y-6'
      }`}
    >
      <AnimatedDock
        sections={sections}
        activeSection={activeSection}
        onSectionClick={handleNavClick}
      />
    </div>
  );
};

export default Dock;
