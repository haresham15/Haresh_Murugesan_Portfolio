import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 sm:gap-12 lg:gap-16">
        <motion.div
          className="w-64 h-80 sm:w-80 sm:h-96 md:w-[380px] md:h-[460px] lg:w-[420px] lg:h-[500px] shrink-0 rounded-3xl overflow-hidden border border-white/10 hover:border-cine-teal/40 shadow-2xl shadow-black/80 relative group transform-gpu transition-colors duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-cine-teal/20 via-transparent to-cine-lavender/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <img 
            src="/profile.jpeg" 
            alt="Haresh Murugesan" 
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 absolute inset-0 will-change-transform" 
          />

          {/* Subtle Bottom Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        <div className="flex-1 max-w-3xl">
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-6 sm:mb-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-sans text-lg sm:text-xl md:text-2xl leading-relaxed text-light-gray text-center lg:text-left">
              I’m a Computer Science student at Ohio State focused on building explainable AI systems, real-time web applications, and intuitive user experiences.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cine-teal mt-1 shrink-0">✦</span>
                <span className="font-sans text-sm sm:text-base md:text-lg text-light-gray/80 leading-relaxed">
                  <strong>Software & Systems:</strong> I write clean, type-safe code across TypeScript, Next.js, and Python (FastAPI). I care deeply about latency, resilient state management, and architectures that don't crumble under real-world edge cases.
                </span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cine-teal mt-1 shrink-0">✦</span>
                <span className="font-sans text-sm sm:text-base md:text-lg text-light-gray/80 leading-relaxed">
                  <strong>Applied Machine Learning:</strong> Whether measuring crisis safety recall with custom eval benchmarks, generating Grad-CAM visual heatmaps in 8ms, or running client-side computer vision in Web Workers, I focus on AI that is explainable, verified, and practical.
                </span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cine-teal mt-1 shrink-0">✦</span>
                <span className="font-sans text-sm sm:text-base md:text-lg text-light-gray/80 leading-relaxed">
                  <strong>Interface & Craft:</strong> I treat design as a core engineering discipline. Software should be visually distinct, responsive, and tactile—not just another generic template.
                </span>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <span className="text-cine-teal mt-1 shrink-0">✦</span>
                <span className="font-sans text-sm sm:text-base md:text-lg text-light-gray/80 leading-relaxed">
                  <strong>Leadership & Inquiry:</strong> CEO of Philocracy, 2-time DataFest 1st Place Winner, and founder of the Syntinuum podcast, where I interview technical founders and engineering leaders about architectural decisions and system scaling.
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
