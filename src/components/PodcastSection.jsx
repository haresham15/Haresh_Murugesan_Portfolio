import React from 'react';
import { motion } from 'framer-motion';

const PodcastSection = () => {
  return (
    <section id="podcast" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <motion.h2
        className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-4 sm:mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Syntinuum Podcast
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base md:text-xl font-sans text-center mb-8 sm:mb-16 text-light-gray/70 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        Conversations with technical founders, CEOs, and engineers on architecture, hard trade-offs, and scaling systems.
      </motion.p>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px', zIndex: 10, position: 'relative' }}
            src="https://open.spotify.com/embed/show/5LPGObcWQdkoERNzZsdL98/video?utm_source=generator"
            width="100%"
            height="320"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full h-[280px] sm:h-[340px]"
          ></iframe>
          <div className="mt-5 sm:mt-6 flex justify-center w-full">
            <a
              href="https://www.syntinuumpodcast.com/"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 bg-transparent border border-cine-lavender/40 text-cine-lavender hover:text-white hover:bg-cine-lavender/20 font-sans font-medium text-xs sm:text-sm rounded-lg transition-all"
            >
              Visit Website ↗
            </a>
          </div>
        </motion.div>
        
        <motion.div
          className="text-sm sm:text-base md:text-lg font-sans leading-relaxed md:w-1/2 w-full text-light-gray/80 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
