import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingGeometry from './FloatingGeometry';

const BentoHero = () => {
 const [currentTime, setCurrentTime] = useState(new Date());

 useEffect(() => {
  const timer = setInterval(() => {
   setCurrentTime(new Date());
  }, 1000);
  return () => clearInterval(timer);
 }, []);

 const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
   hour12: true,
  });
 };

 const guestNames = [
  'Mr. Arjun Kaicker',
  'Mrs. Alisha McFetridge',
  'Mr. Marc Tuiner',
  'Mr. Kevin Hykes',
  'Mr. Chris Martin',
  'Dr. Joesph Wszalek',
 ];

 return (
  <section className="relative w-full max-w-7xl mx-auto px-4 py-20">
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Tile A - Intro */}
    <motion.div
     className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-center"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
    >
     <h1 className="text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-4">
      Hi, I'm Haresh Murugesan.
     </h1>
     <p className="text-2xl text-light-gray/80 font-sans">
      Learning, Adapting and Innovating
     </p>
    </motion.div>

    {/* Tile B - Live Status */}
    <motion.div
     className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-center"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.05 , ease: [0.22, 1, 0.36, 1]}}
    >
     <p className="text-sm text-light-gray/60 mb-2 font-sans">LIVE STATUS</p>
     <h1 className='text-4xl font-sans tracking-widest uppercase text-cine-lavender font-bold'>
      {formatTime(currentTime)}
     </h1>
     <h3 className="text-2xl text-cine-teal/60 mb-2 font-sans text-center font-bold">Current Projects</h3>
     <a href="/prd/motorsports" target="_blank" rel="noopener noreferrer" className="text-xl text-light-gray/60 hover:text-cine-teal mb-2 font-sans transition-colors underline decoration-cine-teal/30 underline-offset-4 cursor-pointer text-center">
      Motorsports AI Management System and Web Application (PRD)
     </a>
     <h2 className="text-xs text-light-gray/40 mt-2 font-sans">
      {currentTime.toLocaleDateString('en-US', {
       weekday: 'long',
       year: 'numeric',
       month: 'long',
       day: 'numeric',
      })}
     </h2>
    </motion.div>

    {/* Floating Geometry Animation - Neural Network (Row 2, Full Width) */}
    <div className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
     <FloatingGeometry />
    </div>

    {/* Tile C - Podcast */}
    <motion.div
     className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 overflow-hidden relative"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.1 , ease: [0.22, 1, 0.36, 1]}}
    >
     <h2 className="text-2xl font-sans tracking-widest uppercase font-bold text-light-gray mb-4">
      Syntinuum: Endless Evolutions Podcast
     </h2>
     <p className="text-sm text-light-gray/70 mb-4 font-sans">
      Exploring innovations that solve the world's toughest challenges
     </p>
     <div className="relative overflow-hidden h-8">
      <div className="marquee-container absolute whitespace-nowrap">
       {[...guestNames, ...guestNames].map((name, idx) => (
        <span key={idx} className="inline-block mr-8 text-light-gray/60 font-sans">
         {name} •
        </span>
       ))}
      </div>
     </div>
     <div className="mt-4 flex gap-4">
      <a
       href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98"
       target="_blank" rel="noopener noreferrer"
       
       className="inline-block text-cine-lavender hover:text-cine-teal transition-colors font-sans"
      >
       Listen on Spotify →
      </a>
      <a
       href="https://www.syntinuumpodcast.com/"
       target="_blank" rel="noopener noreferrer"
       
       className="inline-block text-cine-lavender hover:text-cine-teal transition-colors font-sans"
      >
       Visit Website →
      </a>
     </div>
    </motion.div>

    {/* Tile D - Philocracy */}
    <motion.div
     className="col-span-1 row-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.15 , ease: [0.22, 1, 0.36, 1]}}
    >
     <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-light-gray mb-2">
      Philocracy
     </h3>
     <p className="text-sm text-light-gray/70 font-sans">
      CEO & Director of Finances
     </p>
     <p className="text-xs text-light-gray/50 mt-2 font-sans">
      Non-profit organization helping people through fashion and love
     </p>
    </motion.div>

    {/* Tile E - Stack */}
    <motion.div
     className="col-span-1 row-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.2 , ease: [0.22, 1, 0.36, 1]}}
    >
     <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-light-gray mb-4">
      Stack
     </h3>
     <div className="flex flex-wrap gap-2">
      {['React', 'Python', 'AI/ML', 'Java'].map((tech, idx) => (
       <span
        key={idx}
        className="text-xs px-2 py-1 bg-cine-lavender/20 text-cine-lavender rounded-full font-sans"
       >
        {tech}
       </span>
      ))}
     </div>
    </motion.div>
   </div>
  </section>
 );
};

export default BentoHero;

