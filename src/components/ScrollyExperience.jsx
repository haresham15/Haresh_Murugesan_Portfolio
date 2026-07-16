import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollyExperience = () => {
 const [activeIndex, setActiveIndex] = useState(0);

 const experiences = [
  {
   year: 'May 2026 - Aug 2026',
   role: 'Technology Internship',
   company: 'CAS',
   description: 'Worked as an SW and AI Developer on Business and Agent-Based Applications for Product Stakeholders. Utilized AWS services like S3 and DynamoDB to deploy applications, train AI Models, and process business data. Practiced Agentic and Trunk-Based Development practices while also assisting on C2 and C4 Architecture Designs.',
  },
  {
   year: 'June 2026 - Present',
   role: 'Undergraduate AI/ML Researcher',
   company: 'Ohio State University',
   description: 'Working on technical tasks in Digital Pathology using AI/ML methodologies.',
  },
  {
   year: 'May 2025 - Present',
   role: 'Innovation Analyst Internship',
   company: 'Honda Research Institute Onramp Program',
   description: 'Collaborated with 99P Labs in a data accelerator to identify unmet customer needs by applying lean startup and market research methodologies while working with leadership on 1000+ sample data models and visualizations.',
  },
  {
   year: 'August 2023 - Present',
   role: 'Founder and Interviewer',
   company: 'Syntinuum: Endless Evolutions Podcast',
   description: 'Founded and produced a tech podcast featuring CEOs and tech pioneers, growing the audience to over 8K YouTube views, 75 watch hours, and 50K Instagram views. 1000+ Likes and 50k+ Views on TikTok. Built a custom website using NextJS and unique animations, found on SyntinuumPodcast.com.',
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
        className={`w-full text-left p-4 rounded-lg border transition-all ${activeIndex === index
         ? 'border-cine-lavender bg-cine-lavender/10'
         : 'border-white/5 bg-black/40'
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
       transition={{ duration: 1.2 }}
       className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50"
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

