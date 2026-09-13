import React from 'react';
import { motion } from 'framer-motion';

const ContactFooter = () => {
  return (
    <section id="contact" className="w-full flex flex-col justify-center items-center px-4 pt-16 sm:pt-24 pb-28 sm:pb-36 bg-charcoal">
      <motion.h2
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold text-white mb-6 sm:mb-10 text-center tracking-tight leading-none"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Let's build.
      </motion.h2>

      <motion.p
        className="text-base sm:text-xl md:text-2xl text-light-gray/70 mb-8 sm:mb-12 text-center font-sans max-w-2xl px-2 leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        Whether you have a question, a project idea, or just want to say hi.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none px-4 justify-center">
        <motion.a
          href="mailto:haresham2006@gmail.com"
          className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-light-gray font-sans font-medium text-xs sm:text-sm md:text-base hover:border-cine-teal hover:text-cine-teal transition-all text-center"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Email Me
        </motion.a>

        <motion.a
          href="https://www.linkedin.com/in/haresh-murugesan-4173412a1/?skipRedirect=true"
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-light-gray font-sans font-medium text-xs sm:text-sm md:text-base hover:border-cine-lavender hover:text-cine-lavender transition-all text-center"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Connect on LinkedIn
        </motion.a>

        <motion.a
          href="/resume.pdf"
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-cine-teal/10 backdrop-blur-md border border-cine-teal/30 rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-cine-teal font-sans font-medium text-xs sm:text-sm md:text-base hover:bg-cine-teal hover:text-black transition-all text-center"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          Download Resume
        </motion.a>
      </div>

      <motion.div
        className="mt-12 sm:mt-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-light-gray/40 text-xs sm:text-sm font-sans">
          © 2026 All Rights Reserved<br />
          Haresh Murugesan
        </p>
      </motion.div>
    </section>
  );
};

export default ContactFooter;
