import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-black/50 backdrop-blur-md border-b border-white/10 py-2.5 sm:py-3 px-4 sm:px-6 flex justify-between items-center">
      <div className="font-heading font-bold text-white text-base sm:text-lg tracking-tight flex items-center gap-2.5 sm:gap-3">
        <img src="/profile.jpeg" alt="Haresh Murugesan" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20" />
        HM.
      </div>
      <nav className="flex gap-3 sm:gap-4 md:gap-6 items-center">
        <motion.a
          href="mailto:haresham2006@gmail.com"
          className="text-light-gray/70 hover:text-cine-teal transition-colors text-xs sm:text-sm font-sans hidden sm:block"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Email
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/haresh-murugesan-4173412a1/?skipRedirect=true"
          target="_blank" rel="noopener noreferrer"
          className="text-light-gray/70 hover:text-cine-teal transition-colors text-xs sm:text-sm font-sans hidden sm:block"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          LinkedIn
        </motion.a>
        <motion.a
          href="https://github.com/haresham15"
          target="_blank" rel="noopener noreferrer"
          className="text-light-gray/70 hover:text-cine-teal transition-colors text-xs sm:text-sm font-sans hidden sm:block"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          GitHub
        </motion.a>
        <motion.a
          href="/resume.pdf"
          target="_blank" rel="noopener noreferrer"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-transparent border border-cine-teal/40 text-cine-teal hover:text-black hover:bg-cine-teal font-sans text-xs sm:text-sm font-medium rounded-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Resume
        </motion.a>
      </nav>
    </header>
  );
};

export default Header;
