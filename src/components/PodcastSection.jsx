import React from 'react';
import { motion } from 'framer-motion';

const PodcastSection = () => {
 return (
  <section id="podcast" className="w-full max-w-7xl mx-auto px-4 py-20">
   <motion.h2
    className="text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-8 text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
   >
    Syntinuum: Endless Evolutions Podcast
   </motion.h2>
   <motion.p
    className="text-xl font-sans text-center mb-16 text-light-gray/70 max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.05 , ease: [0.22, 1, 0.36, 1]}}
   >
    Exploring innovations that solve the world's toughest challenges. Listen on Spotify, Apple, and more.
   </motion.p>
   <div className="flex flex-col md:flex-row gap-8 items-start">
    <motion.div
     className="w-full md:w-1/2"
     initial={{ opacity: 0, x: -20 }}
     whileInView={{ opacity: 1, x: 0 }}
     transition={{ duration: 0.8, delay: 0.1 , ease: [0.22, 1, 0.36, 1]}}
    >
     <iframe
      data-testid="embed-iframe"
      style={{ borderRadius: '12px', zIndex: 10, position: 'relative' }}
      src="https://open.spotify.com/embed/show/5LPGObcWQdkoERNzZsdL98/video?utm_source=generator"
      width="100%"
      height="351"
      frameBorder="0"
      allowFullScreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
     ></iframe>
     <div className="mt-6 flex justify-center w-full">
      <a
       href="https://www.syntinuumpodcast.com/"
       target="_blank" rel="noopener noreferrer"
       
       className="inline-block px-8 py-3 bg-transparent border border-cine-lavender text-cine-lavender hover:text-white hover:bg-cine-lavender/20 hover:shadow-2xl font-sans tracking-widest uppercase font-bold rounded-lg transition-all"
      >
       Visit Website
      </a>
     </div>
    </motion.div>
    <motion.div
     className="text-lg font-sans leading-relaxed md:w-1/2 w-full text-light-gray/80 space-y-4"
     initial={{ opacity: 0, x: 20 }}
     whileInView={{ opacity: 1, x: 0 }}
     transition={{ duration: 0.8, delay: 0.15 , ease: [0.22, 1, 0.36, 1]}}
    >
     <p>
      Syntinuum is where I reverse-engineer the journeys of technical founders, CEOs, and innovators. Rather than just discussing high-level vision, we dive deep into the messy realities of building scalable systems and finding product-market fit.
     </p>
     <p>
      Interviewing these pioneers gives me a front-row seat to system-design decisions and engineering trade-offs that don't make it into textbooks. From parsing through their early architectural pivots to understanding how they manage technical debt while scaling, Syntinuum is an active extension of my engineering education.
     </p>
    </motion.div>
   </div>
  </section>
 );
};

export default PodcastSection;

