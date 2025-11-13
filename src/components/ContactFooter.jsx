import React from 'react';
import { motion } from 'framer-motion';

const ContactFooter = () => {
  return (
    <section id="contact" className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-20 bg-charcoal">
      <motion.h2
        className="text-8xl md:text-9xl font-mono font-bold text-light-gray mb-16 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        LET'S BUILD.
      </motion.h2>

      <motion.p
        className="text-2xl text-light-gray/70 mb-12 text-center font-sans max-w-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Whether you have a question, a project idea, or just want to say hi.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-6">
        <motion.a
          href="mailto:haresham2006@gmail.com"
          className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-full px-8 py-4 text-light-gray font-mono text-lg hover:border-neon-cyan hover:text-neon-cyan transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Email Me
        </motion.a>

        <motion.a
          href="https://www.linkedin.com/in/haresh-murugesan-4173412a1/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-full px-8 py-4 text-light-gray font-mono text-lg hover:border-neon-purple hover:text-neon-purple transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Connect on LinkedIn
        </motion.a>
      </div>

      <motion.div
        className="mt-20 text-sm text-light-gray/40 font-sans"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        © 2025 All Rights Reserved Haresh Murugesan
      </motion.div>
    </section>
  );
};

export default ContactFooter;

