import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollyExperience = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const experiences = [
    {
      year: 'May 2026 - Aug 2026',
      role: 'Technology Internship',
      company: 'CAS',
      description: 'Engineered AI workflows and internal software tools backed by AWS infrastructure (S3, DynamoDB, Lambda) to parse and process high-volume scientific datasets. Developed system architecture diagrams (C4 model) and standardized CI/CD trunk-based deployment pipelines.',
    },
    {
      year: 'June 2026 - Present',
      role: 'Undergraduate AI/ML Researcher',
      company: 'Ohio State University',
      description: 'Developing deep computer vision models (CNNs) and automated segmentation pipelines for digital pathology and clinical allergy wheal diagnostics at The Ohio State University, focusing on measurement reproducibility and low false-positive rates.',
    },
    {
      year: 'May 2025 - Present',
      role: 'Innovation Analyst Internship',
      company: 'Honda Research Institute Onramp Program',
      description: 'Collaborated with 99P Labs in a mobility data accelerator initiative. Built and analyzed 1,000+ data models and spatial visualizations across connected-vehicle telemetry, presenting strategic findings directly to senior leadership.',
    },
    {
      year: '2024 - 2025',
      role: 'CEO & Director of Finances',
      company: 'Philocracy',
      description: 'Directed product strategy, engineering architecture, and fiscal operations for the Philocracy structured debate platform. Built nested argument tree schemas, managed operational budget allocation, and directed full-lifecycle platform development using Next.js and Tailwind CSS.',
    },
    {
      year: 'August 2023 - Present',
      role: 'Founder and Interviewer',
      company: 'Syntinuum: Endless Evolutions Podcast',
      description: 'Founded and host an engineering podcast exploring system design, product-market fit, and technical trade-offs with startup founders and CEOs (100K+ combined cross-platform impressions). Built and deployed the custom Next.js web application with audio streaming.',
    },
  ];

  return (
    <section id="experience" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-8 md:mb-16 text-center">
        Experience
      </h2>

      {/* MOBILE ACCORDION VIEW (< md) */}
      <div className="md:hidden space-y-3">
        {experiences.map((exp, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-cine-lavender bg-cine-lavender/10 shadow-cine-glow-lavender'
                  : 'border-white/10 bg-black/40'
              }`}
            >
              <button
                onClick={() => setActiveIndex(isOpen ? -1 : index)}
                className="w-full text-left p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-cine-teal font-mono mb-1">{exp.year}</p>
                  <p className={`text-base font-sans font-semibold transition-colors ${isOpen ? 'text-white' : 'text-light-gray/80'}`}>
                    {exp.role}
                  </p>
                  <p className="text-xs font-sans text-light-gray/50 mt-0.5">{exp.company}</p>
                </div>
                <div className={`text-cine-teal text-sm transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-white/5">
                      <p className="text-light-gray/80 font-sans text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* DESKTOP SIDE-BY-SIDE VIEW (>= md) */}
      <div className="hidden md:flex flex-row gap-8">
        {/* Left Column - Job List */}
        <div className="md:w-1/3 md:sticky md:top-0 md:h-screen md:pt-20">
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                  activeIndex === index
                    ? 'border-cine-lavender bg-cine-lavender/10 shadow-cine-glow-lavender'
                    : 'border-white/5 bg-black/40 hover:shadow-cine-glow-lavender hover:border-cine-lavender/50'
                }`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-xs sm:text-sm text-cine-teal font-mono mb-1">{exp.year}</p>
                <p className={`text-lg font-sans font-semibold transition-colors ${activeIndex === index ? 'text-white' : 'text-light-gray/60'}`}>
                  {exp.role}
                </p>
                <p className={`text-sm font-sans transition-colors ${activeIndex === index ? 'text-white/80' : 'text-light-gray/40'}`}>
                  {exp.company}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column - Job Details */}
        <div className="md:w-2/3">
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && activeIndex < experiences.length && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="pl-8 border-l-2 border-cine-teal/30"
              >
                <p className="text-cine-teal font-mono text-xs sm:text-sm mb-2">
                  {experiences[activeIndex].year}
                </p>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight mb-2">
                  {experiences[activeIndex].role}
                </h3>
                <p className="text-xl text-light-gray/80 font-sans mb-6">
                  {experiences[activeIndex].company}
                </p>
                <p className="text-light-gray/70 font-sans leading-relaxed">
                  {experiences[activeIndex].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ScrollyExperience;
