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
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-8 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-mono font-bold text-light-gray mb-4">
            Haresh Murugesan.
          </h1>
          <p className="text-2xl text-light-gray/80 font-sans">
            Learning, Adapting and Innovating
          </p>
        </motion.div>

        {/* Tile B - Live Status */}
        <motion.div
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-8 flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-sm text-light-gray/60 mb-2 font-sans">LIVE STATUS</p>
          <p className="text-4xl font-mono text-neon-cyan font-bold">
            {formatTime(currentTime)}
          </p>
          <p className="text-xs text-light-gray/40 mt-2 font-sans">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* Floating Geometry Animation - Neural Network (Row 2, Full Width) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
          <FloatingGeometry />
        </div>

        {/* Tile C - Podcast */}
        <motion.div
          className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-8 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-mono font-bold text-light-gray mb-4">
            Adapt: Implementing Innovations
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
          <a
            href="https://open.spotify.com/show/5LPGObcWQdkoERNzZsdL98"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-neon-purple hover:text-neon-cyan transition-colors font-sans"
          >
            Listen on Spotify →
          </a>
        </motion.div>

        {/* Tile D - Philocracy */}
        <motion.div
          className="col-span-1 row-span-1 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-6 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-mono font-bold text-light-gray mb-2">
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
          className="col-span-1 row-span-1 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-6 flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-mono font-bold text-light-gray mb-4">
            Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'Python', 'AI/ML', 'Java'].map((tech, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-neon-purple/20 text-neon-purple rounded-full font-sans"
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

