import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
 return (
  <section id="about" className="w-full max-w-7xl mx-auto px-4 py-20">
   <motion.h2
    className="text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-10 text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
   >
    About Me...
   </motion.h2>
   <motion.p
    className="max-w-4xl mx-auto font-sans text-lg leading-loose text-light-gray/80 text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.05 , ease: [0.22, 1, 0.36, 1]}}
   >
    I am a Computer Science Engineering student at The Ohio State University, specializing in Artificial Intelligence, full-stack software development, and innovative system design. Driven by a passion for creating impactful technology, I leverage my technical expertise in AI and modern frameworks to engineer scalable solutions. As the CEO and Director of Finances at Philocracy—a non-profit organization—I lead cross-functional initiatives merging fashion and community support. Additionally, I host the Syntinuum: Endless Evolutions podcast, where I engage with industry leaders and entrepreneurs to explore cutting-edge innovations tackling global challenges. Always eager to embrace new technologies, I am actively seeking opportunities to drive growth and engineering excellence in a forward-thinking organization.
   </motion.p>
  </section>
 );
};

export default AboutSection;

