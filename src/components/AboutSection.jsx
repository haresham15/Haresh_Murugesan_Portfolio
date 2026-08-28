import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
 return (
  <section id="about" className="w-full max-w-7xl mx-auto px-4 py-24">
   <div className="flex flex-col md:flex-row items-center justify-center gap-12">
    <motion.div
     className="w-56 h-56 md:w-72 md:h-72 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative transform-gpu"
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
     transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
    >
     <img src="/profile.jpeg" alt="Haresh Murugesan" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 absolute inset-0 will-change-transform" />
    </motion.div>

    <div className="flex-1 max-w-3xl">
     <motion.h2
      className="text-5xl md:text-6xl font-heading tracking-widest uppercase font-bold tracking-tight text-light-gray mb-8 text-center md:text-left"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
     >
      About Me
     </motion.h2>
     <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: 0.05 , ease: [0.22, 1, 0.36, 1]}}
     >
      <p className="font-sans text-2xl leading-relaxed text-light-gray md:text-left">
       I build AI-driven applications and full-stack systems that solve complex, data-heavy problems.
      </p>
      
      <ul className="space-y-4">
       <li className="flex items-start gap-4">
        <span className="text-cine-teal mt-1">✦</span>
        <span className="font-sans text-lg text-light-gray/80">
         <strong>Engineering:</strong> CS student at Ohio State University, specializing in AI and scalable software architecture.
        </span>
       </li>
       <li className="flex items-start gap-4">
        <span className="text-cine-teal mt-1">✦</span>
        <span className="font-sans text-lg text-light-gray/80">
         <strong>Creative Execution:</strong> I blend technical rigor with deep design thinking. It's what sets my work apart—ensuring products aren't just functionally robust, but visually striking, dynamic, and intuitive to use.
        </span>
       </li>
       <li className="flex items-start gap-4">
        <span className="text-cine-teal mt-1">✦</span>
        <span className="font-sans text-lg text-light-gray/80">
         <strong>Leadership:</strong> CEO of Philocracy (non-profit) and Founder/Host of the Syntinuum podcast.
        </span>
       </li>
       <li className="flex items-start gap-4">
        <span className="text-cine-teal mt-1">✦</span>
        <span className="font-sans text-lg text-light-gray/80">
         <strong>Focus:</strong> Bridging the gap between cutting-edge AI research and production-ready applications.
        </span>
       </li>
      </ul>
     </motion.div>
    </div>
   </div>
  </section>
 );
};

export default AboutSection;

