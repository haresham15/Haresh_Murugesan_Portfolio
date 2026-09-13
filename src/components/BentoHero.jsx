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
    <section className="relative w-full max-w-7xl mx-auto px-4 py-20 sm:py-28 md:py-32 flex flex-col gap-10 sm:gap-16">
      {/* Top Section: Intro & Status */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-end justify-between">
        <motion.div
          className="flex-1 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <img 
              src="/profile.jpeg" 
              alt="Haresh Murugesan" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg shrink-0 border border-white/10" 
            />
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-bold tracking-tight text-white leading-tight">
              Haresh<br />Murugesan
            </h1>
          </div>
          <p className="text-base sm:text-xl md:text-2xl text-light-gray/90 font-sans font-normal leading-relaxed">
            CS & AI at Ohio State. Building <span className="text-cine-teal font-medium">explainable vision</span>, real-time simulations, and human-centered systems.
          </p>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/3 flex flex-col items-start lg:items-end text-left lg:text-right pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-mono text-light-gray/50 mb-1 sm:mb-2">Local Time</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono text-cine-lavender font-semibold mb-4 sm:mb-6 min-h-[32px] sm:min-h-[40px] tracking-tight">
            {mounted ? formatTime(currentTime) : ''}
          </h2>
          <p className="text-xs font-mono text-light-gray/50 mb-1 sm:mb-2">Featured Project</p>
          <Link 
            href="/projects/tempo" 
            className="text-sm sm:text-base md:text-lg text-white hover:text-cine-teal font-sans font-medium transition-colors underline decoration-cine-teal/30 underline-offset-4 inline-flex items-center gap-1.5"
          >
            Tempo: RSD Buffer & Regulation Suite →
          </Link>
        </motion.div>
      </div>

      {/* Floating Geometry full width divider */}
      <div className="w-full h-[220px] sm:h-[200px] relative">
        <FloatingGeometry />
      </div>

      {/* Bottom Section: Podcast & Core Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
        {/* Podcast Marquee */}
        <motion.div
          className="md:col-span-2 border-t border-white/10 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-white mb-2 tracking-tight">
            Syntinuum Podcast
          </h2>
          <div className="relative overflow-hidden h-8 mb-4">
            <div className="marquee-container absolute whitespace-nowrap flex items-center">
              {[...guestNames, ...guestNames].map((name, idx) => (
                <span key={idx} className="inline-block mr-6 sm:mr-8 text-light-gray/50 font-sans text-xs sm:text-sm">
                  {name} •
                </span>
              ))}
            </div>
          </div>
          <a 
            href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cine-lavender hover:text-white transition-colors text-xs sm:text-sm font-sans font-medium inline-block"
          >
            Listen on Spotify →
          </a>
        </motion.div>

        {/* Stack & Focus */}
        <motion.div
          className="md:col-span-1 border-t border-white/10 pt-6 flex flex-col justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs font-mono text-light-gray/50 mb-2.5 sm:mb-3">Core Stack</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {['TypeScript', 'Next.js', 'Python', 'FastAPI', 'TensorFlow', 'PostgreSQL'].map((tech, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 border border-cine-teal/30 text-cine-teal rounded-full font-sans font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-mono text-light-gray/50 mb-1">Engineering Focus</h3>
            <p className="text-white text-xs sm:text-sm font-sans">Explainable AI & High-Performance Web Systems</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BentoHero;
