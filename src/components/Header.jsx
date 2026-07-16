import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
 return (
  <header className="fixed top-0 left-0 w-full z-40 bg-black/40 backdrop-blur-md border-b border-white/10 py-3 px-6 flex justify-between items-center">
   <div className="font-sans tracking-widest uppercase font-bold text-light-gray text-xl tracking-tight">
    HM.
   </div>
   <nav className="flex gap-4 md:gap-6 items-center">
    <motion.a
     href="mailto:haresham2006@gmail.com"
     className="text-light-gray hover:text-cine-teal transition-colors text-sm font-sans hidden sm:block"
     whileHover={{ y: -2 }}
     whileTap={{ scale: 0.95 }}
    >
     Email
    </motion.a>
    <motion.a
     href="https://www.linkedin.com/in/haresh-murugesan-4173412a1/?skipRedirect=true"
     target="_blank" rel="noopener noreferrer"
     
     className="text-light-gray hover:text-cine-teal transition-colors text-sm font-sans hidden sm:block"
     whileHover={{ y: -2 }}
     whileTap={{ scale: 0.95 }}
    >
     LinkedIn
    </motion.a>
    <motion.a
     href="https://github.com/haresham15"
     target="_blank" rel="noopener noreferrer"
     
     className="text-light-gray hover:text-cine-teal transition-colors text-sm font-sans hidden sm:block"
     whileHover={{ y: -2 }}
     whileTap={{ scale: 0.95 }}
    >
     GitHub
    </motion.a>
    <motion.a
     href="/resume.pdf"
     target="_blank" rel="noopener noreferrer"
     
     className="px-4 py-2 bg-transparent border border-cine-teal text-cine-teal hover:text-black hover:bg-cine-teal font-sans tracking-widest uppercase text-sm font-bold rounded-lg transition-all"
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
