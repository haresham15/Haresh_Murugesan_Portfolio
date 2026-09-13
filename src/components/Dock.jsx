import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Dock = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Auto-hide when scrolling down past 120px; re-appear when scrolling up
      if (currentScrollY > lastScrollY + 10 && currentScrollY > 120) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 100) {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Podcast', href: '#podcast' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'History', href: '#history' },
    { label: 'Now', href: '#now' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav 
      aria-label="Quick navigation"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#050505]/85 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 flex gap-1 sm:gap-2 md:gap-4 items-center overflow-x-auto no-scrollbar max-w-[94vw] sm:max-w-[90vw] md:max-w-max shadow-2xl shadow-black/80"
      initial={{ y: 0, opacity: 1, x: "-50%" }}
      animate={{ 
        y: visible ? 0 : 80, 
        opacity: visible ? 1 : 0,
        x: "-50%"
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {navItems.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          className="text-light-gray/75 hover:text-cine-teal active:text-cine-teal transition-colors text-xs sm:text-sm font-sans whitespace-nowrap shrink-0 px-2 py-1 rounded-full hover:bg-white/5 active:bg-white/10"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.label}
        </motion.a>
      ))}
    </motion.nav>
  );
};

export default Dock;
