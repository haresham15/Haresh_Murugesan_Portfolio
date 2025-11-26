import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollyExperience = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const experiences = [
    {
      year: 'May 2026',
      role: 'Incoming Technology Internship',
      company: 'CAS (Chemical American Society)',
      description: 'Incoming Technology Internship at CAS (Chemical American Society). Will be working on different machine learning and AI based scientific applications. working with one of the largest centers of data and scientific research in the United States.',
    },
    {
      year: 'May 2025',
      role: 'Innovation Analyst',
      company: 'Onramp Student Innovation Program',
      description: 'Analyzing innovative solutions and supporting student innovation initiatives. Collaborated with 99P Labs in a data accelerator to identify unmet customer needs by applying lean startup and market research methodologies while working with leadership on 1000+ sample data models and visualizations.',
    },
    {
      year: 'May 2024',
      role: 'Research Student',
      company: 'OSU Data and CS Lab',
      description: 'Engineered a signal processing algorithm using Python and MATLAB to automate the analysis of multi-channel signal data, improving data processing efficiency by 50 percent while using WIFI producing boards and sensors.',
    },
    {
      year: 'August 2023',
      role: 'Founder and Host',
      company: 'Adapt: Implementing Innovations Podcast',
      description: 'Founded and produced a tech podcast featuring CEOs and tech pioneers, growing the audience to over 8K YouTube views, 75 watch hours, and 50K Instagram views. 1000+ Likes and 50k+ Views on Tiktok. Interviewing innovators and entrepreneurs about their journeys and innovations solving world challenges.',
    },
    {
      year: 'April 2023',
      role: 'CEO and Director of Finances',
      company: 'Philocracy',
      description: 'Leading a non-profit organization that helps people through fashion and love. A 501(c)(3) nonprofit apparel company, managing a team of four and overseeing all operations and data',
    },
  ];

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 py-20 min-h-screen">
      <h2 className="text-6xl font-mono font-bold text-light-gray mb-16 text-center">
        Experience
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Job List */}
        <div className="md:w-1/3 md:sticky md:top-0 md:h-screen md:pt-20">
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${activeIndex === index
                  ? 'border-neon-purple bg-neon-purple/10'
                  : 'border-glass-border bg-glass-bg/50'
                  }`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-sm text-neon-cyan font-mono mb-1">{exp.year}</p>
                <p className={`text-lg font-sans font-semibold transition-colors ${activeIndex === index ? 'text-white' : 'text-black'}`}>
                  {exp.role}
                </p>
                <p className={`text-sm font-sans transition-colors ${activeIndex === index ? 'text-white/80' : 'text-black/60'}`}>{exp.company}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column - Job Details */}
        <div className="md:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-8"
            >
              <p className="text-neon-cyan font-mono mb-2">
                {experiences[activeIndex].year}
              </p>
              <h3 className="text-3xl font-mono font-bold text-light-gray mb-2">
                {experiences[activeIndex].role}
              </h3>
              <p className="text-xl text-light-gray/80 font-sans mb-6">
                {experiences[activeIndex].company}
              </p>
              <p className="text-light-gray/70 font-sans leading-relaxed">
                {experiences[activeIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ScrollyExperience;

