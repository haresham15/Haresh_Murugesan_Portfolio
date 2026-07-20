import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollyExperience = () => {
 const [activeIndex, setActiveIndex] = useState(0);

 const experiences = [
  {
   year: 'May 2026 - Aug 2026',
   role: 'Technology Internship',
   company: 'CAS',
   description: 'Engineered robust software and AI solutions for business and agent-based applications. Leveraged AWS infrastructure (S3, DynamoDB) to deploy scalable applications, train machine learning models, and process high-volume business data. Championed trunk-based and agentic development methodologies, while contributing significantly to complex C2 and C4 system architecture designs.',
  },
  {
   year: 'June 2026 - Present',
   role: 'Undergraduate AI/ML Researcher',
   company: 'Ohio State University',
   description: 'Spearheading advanced research in Digital Pathology by implementing cutting-edge AI and Machine Learning methodologies to solve complex, data-driven diagnostic challenges.',
  },
  {
   year: 'May 2025 - Present',
   role: 'Innovation Analyst Internship',
   company: 'Honda Research Institute Onramp Program',
   description: 'Partnered with 99P Labs in a data accelerator initiative, applying lean startup methodologies to uncover unmet market needs. Developed and analyzed 1,000+ data models and visualizations, presenting actionable strategic insights directly to senior leadership.',
  },
  {
   year: 'August 2023 - Present',
   role: 'Founder and Interviewer',
   company: 'Syntinuum: Endless Evolutions Podcast',
   description: 'Founded and grew a technology podcast interviewing industry-leading CEOs and pioneers, achieving over 100K+ combined cross-platform impressions. Architected and deployed a highly interactive, custom front-end platform using Next.js and complex animations to host content and drive engagement.',
  },
 ];

 return (
  <section id="experience" className="w-full max-w-7xl mx-auto px-4 py-20 min-h-screen">
   <h2 className="text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-16 text-center">
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
        className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${activeIndex === index
         ? 'border-cine-lavender bg-cine-lavender/10 shadow-cine-glow-lavender'
         : 'border-white/5 bg-black/40 hover:shadow-cine-glow-lavender hover:border-cine-lavender/50'
         }`}
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
       >
        <p className="text-sm text-cine-teal font-sans tracking-widest uppercase mb-1">{exp.year}</p>
        <p className={`text-lg font-sans font-semibold transition-colors ${activeIndex === index ? 'text-white' : 'text-light-gray/60'}`}>
         {exp.role}
        </p>
        <p className={`text-sm font-sans transition-colors ${activeIndex === index ? 'text-white/80' : 'text-light-gray/40'}`}>{exp.company}</p>
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
       transition={{ duration: 0.8 , ease: [0.22, 1, 0.36, 1]}}
       className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-cine-glow-lavender animate-pulse-glow"
      >
       <p className="text-cine-teal font-sans tracking-widest uppercase mb-2">
        {experiences[activeIndex].year}
       </p>
       <h3 className="text-3xl font-sans tracking-widest uppercase font-bold text-light-gray mb-2">
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

