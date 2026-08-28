import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingGeometry from './FloatingGeometry';

const BentoHero = () => {
 const [currentTime, setCurrentTime] = useState(new Date());
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
  setMounted(true);
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
  <section className="relative w-full max-w-7xl mx-auto px-4 py-32 flex flex-col gap-16">
   {/* Top Section: Intro & Status */}
   <div className="flex flex-col lg:flex-row gap-12 items-end justify-between">
    <motion.div
     className="flex-1 max-w-3xl"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
    >
     <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
      <img src="/profile.jpeg" alt="Haresh Murugesan" className="w-24 h-24 rounded-full object-cover shadow-lg shrink-0" />
      <h1 className="text-5xl md:text-7xl font-heading tracking-widest uppercase font-bold tracking-tight text-light-gray leading-tight">
       Haresh<br/>Murugesan
      </h1>
     </div>
     <p className="text-2xl md:text-3xl text-cine-teal font-heading tracking-widest uppercase">
      Learning, Adapting, Innovating.
     </p>
    </motion.div>

    <motion.div
     className="lg:w-1/3 flex flex-col items-start lg:items-end text-left lg:text-right"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.05 , ease: [0.22, 1, 0.36, 1]}}
    >
     <p className="text-sm text-light-gray/60 mb-2 font-sans tracking-widest uppercase">Local Time</p>
     <h2 className='text-3xl md:text-4xl font-heading tracking-widest uppercase text-cine-lavender font-bold mb-6 min-h-[40px]'>
      {mounted ? formatTime(currentTime) : ''}
     </h2>
     <p className="text-sm text-light-gray/60 mb-2 font-sans tracking-widest uppercase">Currently Building</p>
     <Link href="/prd/motorsports" target="_blank" rel="noopener noreferrer" className="text-lg text-white hover:text-cine-teal font-sans transition-colors underline decoration-cine-teal/30 underline-offset-4">
      Motorsports AI Management System
     </Link>
    </motion.div>
   </div>

   {/* Floating Geometry full width divider */}
   <div className="w-full h-[200px] relative">
    <FloatingGeometry />
   </div>

   {/* Bottom Section: Podcast, Philocracy, Stack */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
    {/* Podcast Marquee */}
    <motion.div
     className="md:col-span-2 border-t border-white/10 pt-6"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.1 , ease: [0.22, 1, 0.36, 1]}}
    >
     <h2 className="text-xl font-heading tracking-widest uppercase font-bold text-light-gray mb-2">
      Syntinuum Podcast
     </h2>
     <div className="relative overflow-hidden h-8 mb-4">
      <div className="marquee-container absolute whitespace-nowrap flex items-center">
       {[...guestNames, ...guestNames].map((name, idx) => (
        <span key={idx} className="inline-block mr-8 text-light-gray/50 font-sans text-sm">
         {name} •
        </span>
       ))}
      </div>
     </div>
     <a href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98" target="_blank" rel="noopener noreferrer" className="text-cine-lavender hover:text-white transition-colors text-sm font-sans tracking-widest uppercase">
      Listen on Spotify →
     </a>
    </motion.div>

    {/* Stack & Philocracy */}
    <motion.div
     className="md:col-span-1 border-t border-white/10 pt-6 flex flex-col justify-between"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.15 , ease: [0.22, 1, 0.36, 1]}}
    >
     <div className="mb-6">
      <h3 className="text-sm font-sans tracking-widest uppercase text-light-gray/60 mb-3">Core Stack</h3>
      <div className="flex flex-wrap gap-2">
       {['React', 'Python', 'AI/ML', 'Java'].map((tech, idx) => (
        <span key={idx} className="text-xs px-2 py-1 border border-cine-teal/30 text-cine-teal rounded-full font-sans">
         {tech}
        </span>
       ))}
      </div>
     </div>
     <div>
      <h3 className="text-sm font-sans tracking-widest uppercase text-light-gray/60 mb-1">Philocracy</h3>
      <p className="text-white text-sm font-sans">CEO & Director of Finances</p>
     </div>
    </motion.div>
   </div>
  </section>
 );
};

export default BentoHero;
