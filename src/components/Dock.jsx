import React from 'react';
import { motion } from 'framer-motion';

const Dock = () => {
  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Podcast', href: '#podcast' },
    { label: 'Projects', href: '#projects' },
    { label: 'Awards', href: '#awards' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
    { label: 'GitHub', href: 'https://github.com/haresham15', external: true },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-glass-bg backdrop-blur-md border border-glass-border rounded-full px-4 md:px-6 py-2 md:py-3 flex gap-2 md:gap-4 items-center overflow-x-auto max-w-[95vw]">
      {navItems.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          className="text-light-gray hover:text-neon-cyan transition-colors text-sm font-sans"
          whileHover={{ scale: 1.2, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.label}
        </motion.a>
      ))}
    </nav>
  );
};

export default Dock;

