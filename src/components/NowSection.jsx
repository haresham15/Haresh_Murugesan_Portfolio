import React from 'react';
import { motion } from 'framer-motion';

const NowSection = () => {
  const posts = [
    {
      date: 'September 2026',
      title: 'GenAI Crisis Safety & Failover in Tempo',
      content: 'Built an automated 30-case benchmark evaluation harness to test crisis interception recall and colloquial false alarms. Structured a dual-provider active-passive failover state machine (DeepSeek V3 structured JSON → Google Gemini 3.5 Flash Lite) with 1-turn Zod self-correction, achieving 100% crisis recall and p50 latency under 650ms.',
    },
    {
      date: 'September 2026',
      title: 'Vectorized Grad-CAM & Edge CV in Healios V2',
      content: 'Eliminated heavy server-side Matplotlib dependencies by implementing a vectorized NumPy piecewise linear Jet colormap in Python, cutting Grad-CAM saliency generation down to 8.09ms. Also deployed a client-side HTML5 Canvas Laplacian blur filter to validate photograph focus in <35ms before network upload.',
    },
    {
      date: 'August 2026',
      title: 'Off-Main-Thread Simulation & In-Browser OCR in Apexis',
      content: 'Offloaded 2D race telemetry calculations to a dedicated Web Worker pipeline to sustain a locked 60fps across multi-car endurance sessions, while integrating Tesseract.js OCR in a background worker to extract live broadcast standings directly in-browser with zero backend compute overhead.',
    }
  ];

  return (
    <section id="now" className="w-full max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-white mb-8 sm:mb-12 flex flex-wrap items-center gap-2.5 sm:gap-4">
        What I'm Building Now
        <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cine-teal opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-cine-teal"></span>
        </span>
      </h2>
      
      <div className="space-y-6 sm:space-y-8 pl-4 sm:pl-6 md:pl-8 border-l-2 border-white/10">
        {posts.map((post, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Timeline dot */}
            <div className="absolute -left-[21px] sm:-left-[29px] md:-left-[37px] top-1.5 sm:top-2 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-cine-teal/50 border border-cine-teal"></div>
            
            <span className="text-cine-teal font-mono text-xs block mb-1 sm:mb-2">{post.date}</span>
            <h3 className="text-base sm:text-lg md:text-xl font-heading font-semibold text-white mb-1.5 sm:mb-2 leading-snug tracking-tight">{post.title}</h3>
            <p className="text-light-gray/80 font-sans leading-relaxed text-xs sm:text-sm md:text-base">
              {post.content}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NowSection;
