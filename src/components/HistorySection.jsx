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
   description: 'Launched the Syntinuum: Endless Evolutions podcast to explore cutting-edge innovations with industry leaders.'
  },
  {
   date: 'March 2025',
   title: '1st Place - DataFest',
   description: 'Awarded Best Use of External Data by the American Statistical Association.'
  },
  {
   date: 'May 2025',
   title: 'Honda Research Institute',
   description: 'Joined the Onramp Program as an Innovation Analyst, leveraging data models to uncover strategic insights.'
  },
  {
   date: 'March 2026',
   title: '1st Place - DataFest',
   description: 'Secured a second consecutive win for Best Use of External Data.'
  },
  {
   date: 'May 2026',
   title: 'CAS Technology Internship',
   description: 'Engineered AI solutions and scalable AWS infrastructure for complex C2 and C4 systems.'
  },
  {
   date: 'June 2026',
   title: 'AI/ML Researcher at OSU',
   description: 'Spearheaded digital pathology research applying advanced machine learning to diagnostic challenges.'
  }
 ];

 return (
  <section id="history" className="w-full max-w-4xl mx-auto px-4 py-32 relative" ref={ref}>
   <h2 className="text-4xl md:text-6xl font-heading tracking-widest uppercase font-bold tracking-tight text-light-gray mb-24 text-center">
    The Story So Far
   </h2>
   
   <div className="relative pl-8 md:pl-16">
    {/* The background line */}
    <div className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-[2px] bg-white/10" />
    
    {/* The scroll-filled line */}
    <motion.div 
     className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-[2px] bg-cine-teal origin-top" 
     style={{ scaleY }} 
    />
    
    <div className="space-y-24">
     {milestones.map((item, index) => (
      <div key={index} className="relative group">
       {/* Timeline dot */}
       <div className="absolute -left-[29px] md:-left-[57px] top-1.5 h-3 w-3 rounded-full bg-[#050505] border border-white/40 group-hover:border-cine-teal group-hover:bg-cine-teal transition-colors duration-500 z-10" />
       
       <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
       >
        <span className="text-cine-lavender font-heading tracking-widest uppercase text-sm block mb-3">
         {item.date}
        </span>
        <h3 className="text-2xl font-heading tracking-widest uppercase font-bold text-white mb-4">
         {item.title}
        </h3>
        <p className="text-light-gray/70 font-sans leading-relaxed text-lg max-w-2xl">
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
