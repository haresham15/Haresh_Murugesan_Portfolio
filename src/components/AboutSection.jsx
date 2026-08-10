import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
 return (
  <section id="about" className="w-full max-w-7xl mx-auto px-4 py-24">
   <div className="flex flex-col md:flex-row items-center justify-center gap-12">
    <motion.div
     className="w-56 h-56 md:w-72 md:h-72 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
     initial={{ opacity: 0, scale: 0.8 }}
     whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }}
     transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
    >
     <img src="/profile.jpeg" alt="Haresh Murugesan" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 absolute inset-0" />
    </motion.div>

    <div className="flex-1 max-w-3xl">
     <motion.h2
      className="text-5xl md:text-6xl font-heading tracking-widest uppercase font-bold tracking-tight text-light-gray mb-8 text-center md:text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
     >
      About Me...
     </motion.h2>
     <motion.p
      className="font-sans text-lg leading-loose text-light-gray/80 text-center md:text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.05 , ease: [0.22, 1, 0.36, 1]}}
     >
      I am a Computer Science Engineering student at The Ohio State University, specializing in Artificial Intelligence, full-stack software development, and innovative system design. Driven by a passion for creating impactful technology, I leverage my technical expertise in AI and modern frameworks to engineer scalable solutions. As the CEO and Director of Finances at Philocracy—a non-profit organization—I lead cross-functional initiatives merging fashion and community support. Additionally, I host the Syntinuum: Endless Evolutions podcast, where I engage with industry leaders and entrepreneurs to explore cutting-edge innovations tackling global challenges. Always eager to embrace new technologies, I am actively seeking opportunities to drive growth and engineering excellence in a forward-thinking organization.
     </motion.p>
    </div>
   </div>
  </section>
 );
};

export default AboutSection;

