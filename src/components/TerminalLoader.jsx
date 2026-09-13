import React from 'react';
import { motion } from 'framer-motion';

const CinematicLoader = () => {
 return (
  <div className="flex flex-col items-center justify-center h-full w-full opacity-80">
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: [0.4, 1, 0.6, 1] }}
     transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
     className="font-mono text-xs text-cine-teal tracking-wider mb-4"
    >
     Loading...
    </motion.div>
   <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
    <motion.div
     className="absolute top-0 left-0 h-full bg-cine-lavender w-1/3"
     animate={{ x: ['-100%', '300%'] }}
     transition={{ duration: 2, repeat: Infinity , ease: [0.22, 1, 0.36, 1]}}
    />
   </div>
  </div>
 );
};

export default CinematicLoader;
