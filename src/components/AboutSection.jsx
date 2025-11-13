import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 py-20">
      <motion.h2
        className="text-6xl font-mono font-bold text-light-gray mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Me...
      </motion.h2>
      <motion.p
        className="max-w-6xl mx-auto font-sans text-lg leading-relaxed text-light-gray/80"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        I'm a CSE student at OSU focused on AI, software, and innovation. I love learning about innovations and tech every day and hope to use my technical skills to help provide meaningful contributions to society through CS and AI. I am the CEO and Director of Finances at Philocracy, a non-profit organization that aims to help people through fashion and love. I also host the Adapt: Implementing Innovations podcast, where I interview innovators and entrepreneurs about their journeys and the innovations they are implementing to solve the world's toughest challenges. In my free time, I enjoy coding, reading, and exploring new technologies.
      </motion.p>
    </section>
  );
};

export default AboutSection;

