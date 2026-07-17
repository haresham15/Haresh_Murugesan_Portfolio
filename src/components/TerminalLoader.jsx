import React from 'react';
import { motion } from 'framer-motion';

const CinematicLoader = () => {
 return (
  <div className="flex flex-col items-center justify-center h-full w-full opacity-80">
   <motion.div
    initial={{ opacity: 0, letterSpacing: '0px' }}
    animate={{ opacity: [0, 1, 0.5, 1], letterSpacing: '10px' }}
    transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' , ease: [0.22, 1, 0.36, 1]}}
    className="font-sans font-bold text-cine-teal uppercase text-sm mb-4"
   >
    Loading
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
