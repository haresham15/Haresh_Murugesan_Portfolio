import React from 'react';
import { motion } from 'framer-motion';

const PodcastSection = () => {
  return (
    <section id="podcast" className="w-full max-w-7xl mx-auto px-4 py-20">
      <motion.h2
        className="text-6xl font-mono font-bold text-light-gray mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        The Adapt: Implementing Innovations
      </motion.h2>
      <motion.p
        className="text-xl font-sans text-center mb-16 text-light-gray/70"
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
        </motion.div>
        <motion.p
          className="text-lg font-sans leading-relaxed md:w-1/2 w-full text-light-gray/80"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          The Adapt: Implementing Innovations podcast is a platform where I interview innovators and
          entrepreneurs about their journeys and the innovations they are implementing to solve the
          world's toughest challenges. Each episode dives deep into the stories behind the innovations,
          the challenges faced, and the impact they aim to create. I was inspired to start this podcast
          during the Covid Era when I realized the amount of important innovations that were keeping
          humanity safe. Fusing my passion for learning and inventing, I reached out to leaders in their
          respective fields to discuss and educate the general population on the work that was helping
          the world towards a better future.
        </motion.p>
      </div>
    </section>
  );
};

export default PodcastSection;

