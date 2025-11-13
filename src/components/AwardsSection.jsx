import React from 'react';
import { motion } from 'framer-motion';

const AwardsSection = () => {
  const certs = [
    {
      title: 'CS50 Introduction to Artificial Intelligence with Python',
      issuer: 'Harvard University',
      date: 'July 2025',
    },
    {
      title: '1st Place - Best Use of External Data',
      issuer: 'ASA',
      date: 'March 2025',
    },
  ];

  return (
    <section id="awards" className="w-full max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-6xl font-mono font-bold text-light-gray mb-16 text-center">
        Awards and Certifications
      </h2>
      <div className="space-y-6">
        {certs.map((cert, index) => (
          <motion.div
            key={index}
            className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-6 flex items-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <span className="text-neon-cyan text-2xl mt-1">✓</span>
            <div>
              <h3 className="text-xl font-mono font-semibold text-light-gray mb-1">
                {cert.title}
              </h3>
              <p className="text-light-gray/60 font-sans">
                {cert.issuer} — {cert.date}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;

