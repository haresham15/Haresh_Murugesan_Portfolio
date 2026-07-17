import React from 'react';
import { motion } from 'framer-motion';

const NowSection = () => {
 const posts = [
  {
   date: 'July 2026',
   title: 'Debugging Hybrid Cloud Latency',
   content: 'Currently working through severe websocket stuttering in AIMotorsportsHub during high-volume telemetry spikes. Profiling showed AWS Lambda cold starts weren\'t the issue, but rather Supabase realtime limits. Researching a Redis pub/sub layer to buffer the stream before hitting the client.',
  },
  {
   date: 'June 2026',
   title: 'Optimizing SAM for Edge Devices',
   content: 'The fine-tuned Segment Anything Model for Healios is accurate but too heavy for mobile inference. I\'ve spent the last week experimenting with ONNX runtime and aggressive quantization (INT8). Managed a 3x speedup with only a ~1.2% accuracy drop.',
  }
 ];

 return (
  <section id="now" className="w-full max-w-4xl mx-auto px-4 py-20">
   <h2 className="text-4xl md:text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-12 flex items-center gap-4">
    What I'm Building Now
    <span className="relative flex h-4 w-4">
     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cine-teal opacity-75"></span>
     <span className="relative inline-flex rounded-full h-4 w-4 bg-cine-teal"></span>
    </span>
   </h2>
   
   <div className="space-y-8 pl-4 md:pl-8 border-l-2 border-white/10">
    {posts.map((post, index) => (
     <motion.div
      key={index}
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 , ease: [0.22, 1, 0.36, 1]}}
      viewport={{ once: true }}
     >
      {/* Timeline dot */}
      <div className="absolute -left-[21px] md:-left-[37px] top-2 h-3 w-3 rounded-full bg-cine-teal/50 border border-cine-teal"></div>
      
      <span className="text-cine-teal font-sans tracking-widest uppercase text-sm block mb-2">{post.date}</span>
      <h3 className="text-xl font-sans tracking-widest uppercase font-bold text-white mb-2">{post.title}</h3>
      <p className="text-light-gray/80 font-sans leading-relaxed">
       {post.content}
      </p>
     </motion.div>
    ))}
   </div>
  </section>
 );
};

export default NowSection;
