import React from 'react';
import { motion } from 'framer-motion';

const PodcastSection = () => {
  return (
    <section id="podcast" className="w-full max-w-7xl mx-auto px-4 py-20">
      <motion.h2
        className="text-6xl font-mono font-bold tracking-tight text-light-gray mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Syntinuum: Endless Evolutions Podcast
      </motion.h2>
      <motion.p
        className="text-xl font-sans text-center mb-16 text-light-gray/70 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Exploring innovations that solve the world's toughest challenges. Listen on Spotify, Apple, and more.
      </motion.p>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-transparent border border-neon-purple text-neon-purple hover:text-white hover:bg-neon-purple/20 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] font-mono font-bold rounded-lg transition-all"
            >
              Visit Website
            </a>
          </div>
        </motion.div>
        <motion.p
          className="text-lg font-sans leading-relaxed md:w-1/2 w-full text-light-gray/80"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Syntinuum is my podcast and creative space where I can expand on innovation. I wanted to analyze the different innovations and inventions that are in the birth form. These creations are begging to be puth through countless unit tests. Creators continously checking to see how their creation will change the world and help it adapt to the growing challenges and systemic errors. Seeing how implementing the newest innovations can spark change. Our goal here at Syntinuum is to document the progress of these creations and motivate the next generation to continue the creative and breakthrough process for meaningfull change.
        </motion.p>
      </div>
    </section>
  );
};

export default PodcastSection;

