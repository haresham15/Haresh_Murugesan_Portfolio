import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const HistorySection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const milestones = [
    {
      date: 'August 2023',
      title: 'Founded Syntinuum',
      description: 'Launched the Syntinuum podcast to interview technology founders and leaders, exploring system architecture and product development.'
    },
    {
      date: 'March 2025',
      title: '1st Place — DataFest 2025',
      description: 'Awarded Best Use of External Data by the American Statistical Association.'
    },
    {
      date: 'May 2025',
      title: 'Honda Research Institute Onramp',
      description: 'Joined as an Innovation Analyst, modeling connected vehicle telemetry and presenting spatial insights to leadership.'
    },
    {
      date: 'March 2026',
      title: '1st Place — DataFest 2026',
      description: 'Won Best Use of External Data for Careline, an OSRM-based bi-directional healthcare transit optimization platform.'
    },
    {
      date: 'May 2026',
      title: 'CAS Technology Internship',
      description: 'Engineered AWS data workflows, automated extraction pipelines, and structured C4 system architecture diagrams.'
    },
    {
      date: 'June 2026',
      title: 'AI/ML Researcher at Ohio State',
      description: 'Developed computer vision segmentation workflows and CNN classifiers for digital pathology and allergy diagnostics.'
    },
    {
      date: 'Late 2026',
      title: 'Built Healios V2, Apexis & Tempo',
      description: 'Shipped full-stack systems spanning Explainable AI (Grad-CAM), real-time Web Worker simulation engines, and pgvector RAG emotional buffering.'
    }
  ];

  return (
    <section id="history" className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24 md:py-32 relative" ref={ref}>
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-12 sm:mb-20 md:mb-24 text-center">
        The Story So Far
      </h2>
      
      <div className="relative pl-6 sm:pl-10 md:pl-16">
        {/* The background line */}
        <div className="absolute left-[5px] sm:left-[8px] md:left-[11px] top-2 bottom-2 w-[2px] bg-white/10" />
        
        {/* The scroll-filled line */}
        <motion.div 
          className="absolute left-[5px] sm:left-[8px] md:left-[11px] top-2 bottom-2 w-[2px] bg-cine-teal origin-top" 
          style={{ scaleY }} 
        />
        
        <div className="space-y-10 sm:space-y-16 md:space-y-24">
          {milestones.map((item, index) => (
            <div key={index} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[24px] sm:-left-[37px] md:-left-[58px] top-1.5 h-3 w-3 rounded-full bg-[#050505] border border-white/40 group-hover:border-cine-teal group-hover:bg-cine-teal transition-colors duration-500 z-10" />
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-cine-lavender font-mono text-xs sm:text-sm block mb-1.5 sm:mb-2">
                  {item.date}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-white mb-2 sm:mb-3 leading-snug tracking-tight">
                  {item.title}
                </h3>
                <p className="text-light-gray/70 font-sans leading-relaxed text-xs sm:text-base md:text-lg max-w-2xl">
                  {item.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
