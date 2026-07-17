import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementsGallery = () => {
 const [filter, setFilter] = useState('all');
 const [selectedItem, setSelectedItem] = useState(null);

 // Disable body scroll when modal is open
 useEffect(() => {
  if (selectedItem) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = 'unset';
  }
  return () => {
   document.body.style.overflow = 'unset';
  };
 }, [selectedItem]);

 const achievements = [
  {
   id: 'a1',
   type: 'award',
   title: '1st Place - Best Use of External Data',
   issuer: 'DataFest / American Statistical Association',
   date: 'March 2026',
   pdfUrl: '/datafest-2026.pdf',
   colSpan: 'md:col-span-2', // Makes this item wider in the bento grid
  },
  {
   id: 'c1',
   type: 'certification',
   title: 'CS50 Intro to AI with Python',
   issuer: 'Harvard University',
   date: 'July 2025',
   description: 'An introductory course to AI using Python. Covered graph search algorithms, reinforcement learning, and neural networks.',
   pdfUrl: '/cs50.pdf',
   colSpan: 'md:col-span-1',
  },
  {
   id: 'a2',
   type: 'award',
   title: '1st Place - Best Use of External Data',
   issuer: 'DataFest / American Statistical Association',
   date: 'March 2025',
   pdfUrl: '/datafest-2025.pdf',
   colSpan: 'md:col-span-1',
  },
  {
   id: 'c2',
   type: 'certification',
   title: 'Anthropic Academy: Claude Fundamentals',
   issuer: 'Anthropic',
   date: '2026',
   description: 'Completion of the Anthropic Academy course covering the fundamentals of prompting, fine-tuning, and working with Claude models.',
   pdfUrl: '/anthropic-claude-1.pdf',
   colSpan: 'md:col-span-1',
  },
  {
   id: 'c3',
   type: 'certification',
   title: 'Anthropic Academy: Advanced Claude Development',
   issuer: 'Anthropic',
   date: '2026',
   description: 'Advanced certification from Anthropic Academy focusing on complex system design, tool use, and enterprise-grade deployment of Claude applications.',
   pdfUrl: '/anthropic-claude-2.pdf',
   colSpan: 'md:col-span-2',
  }
 ];

 const filteredAchievements = achievements.filter(
  item => filter === 'all' || item.type === filter
 );

 return (
  <section id="achievements" className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
   <h2 className="text-6xl font-sans tracking-widest uppercase font-bold tracking-tight text-light-gray mb-8 text-center">
    Achievements
   </h2>
   
   {/* Filtering Tabs */}
   <div className="flex justify-center gap-4 mb-12">
    {['all', 'award', 'certification'].map((tab) => (
     <button
      key={tab}
      onClick={() => setFilter(tab)}
      className={`px-6 py-2 rounded-full font-sans tracking-widest uppercase text-sm transition-all border ${
       filter === tab
        ? 'bg-cine-teal/20 border-cine-teal text-cine-teal shadow-2xl'
        : 'bg-black/40 border-white/10 text-light-gray/60 hover:text-light-gray hover:border-white/30'
      }`}
     >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}s
     </button>
    ))}
   </div>

   {/* Bento Grid Gallery */}
   <motion.div 
    layout
    className="grid grid-cols-1 md:grid-cols-3 gap-6"
   >
    <AnimatePresence mode="popLayout">
     {filteredAchievements.map((item, index) => (
      <motion.div
       layout
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       exit={{ opacity: 0, scale: 0.9 }}
       transition={{ duration: 0.8, delay: index * 0.05 , ease: [0.22, 1, 0.36, 1]}}
       key={item.id}
       className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-cine-lavender/50 transition-colors shadow-lg shadow-black/50 group flex flex-col justify-between cursor-pointer ${item.colSpan}`}
       onClick={() => setSelectedItem(item)}
      >
       <div>
        <div className="flex justify-between items-start mb-4">
         <span className={`text-xs font-sans tracking-widest uppercase px-3 py-1 rounded-full border ${
          item.type === 'award' ? 'border-cine-teal text-cine-teal bg-cine-teal/10' : 'border-cine-lavender text-cine-lavender bg-cine-lavender/10'
         }`}>
          {item.type === 'award' ? 'Award' : 'Certification'}
         </span>
         <span className="text-light-gray/40 font-sans tracking-widest uppercase text-sm">{item.date}</span>
        </div>
        <h3 className="text-2xl font-sans font-bold text-light-gray mb-2 group-hover:text-white transition-colors">
         {item.title}
        </h3>
        <p className="text-light-gray/70 font-sans mb-4">{item.issuer}</p>
        {item.description && (
         <p className="text-light-gray/50 text-sm font-sans line-clamp-3">
          {item.description}
         </p>
        )}
       </div>
       
       <div className="mt-6 flex items-center gap-2 text-cine-teal group-hover:text-cine-lavender transition-colors font-sans tracking-widest uppercase text-sm uppercase tracking-wider">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        View Document <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
       </div>
      </motion.div>
     ))}
    </AnimatePresence>
   </motion.div>

   {/* Modal for PDF and Description */}
   <AnimatePresence>
    {selectedItem && (
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
      onClick={() => setSelectedItem(null)} // Close when clicking outside
     >
      <motion.div
       initial={{ scale: 0.9, y: 20 }}
       animate={{ scale: 1, y: 0 }}
       exit={{ scale: 0.9, y: 20 }}
       className="bg-glass-bg border border-glass-border rounded-2xl w-full max-w-6xl h-[90vh] sm:h-[80vh] flex flex-col md:flex-row overflow-hidden relative shadow-2xl shadow-cine-lavender/20"
       onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
       {/* Close Button */}
       <button
        onClick={() => setSelectedItem(null)}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-cine-lavender text-white rounded-full flex items-center justify-center transition-colors border border-glass-border"
        aria-label="Close modal"
       >
        ✕
       </button>

       {/* Left Side: PDF Viewer */}
       <div className={`w-full ${selectedItem.description ? 'md:w-2/3 h-[50vh] md:h-full border-b md:border-b-0 md:border-r' : 'h-[90vh] sm:h-[80vh]'} bg-black/40 border-glass-border`}>
        {selectedItem.pdfUrl ? (
         <iframe
          src={`${selectedItem.pdfUrl}#toolbar=0&view=FitH`}
          title={selectedItem.title}
          className={`w-full h-full ${selectedItem.description ? 'rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none' : 'rounded-2xl'}`}
          style={{ border: 'none' }}
         />
        ) : (
         <div className="w-full h-full flex items-center justify-center text-light-gray/50 font-sans tracking-widest uppercase">
          PDF not available yet.
         </div>
        )}
       </div>

       {/* Right Side: Description (Only if description exists) */}
       {selectedItem.description && (
        <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col overflow-y-auto">
         <span className={`text-xs font-sans tracking-widest uppercase px-3 py-1 rounded-full border w-fit mb-4 ${
          selectedItem.type === 'award' ? 'border-cine-teal text-cine-teal bg-cine-teal/10' : 'border-cine-lavender text-cine-lavender bg-cine-lavender/10'
         }`}>
          {selectedItem.type === 'award' ? 'Award' : 'Certification'}
         </span>
         
         <span className="text-light-gray/40 font-sans tracking-widest uppercase mb-2 block">{selectedItem.date}</span>
         <h3 className="text-3xl font-bold font-sans text-light-gray mb-2">
          {selectedItem.title}
         </h3>
         <p className="text-xl text-cine-lavender/80 font-sans mb-8 border-b border-glass-border pb-4">
          {selectedItem.issuer}
         </p>
         <div className="prose prose-invert">
          <h4 className="text-light-gray font-sans tracking-widest uppercase text-lg mb-2">About this achievement</h4>
          <p className="text-light-gray/70 leading-relaxed font-sans">
           {selectedItem.description}
          </p>
         </div>
        </div>
       )}
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>
  </section>
 );
};

export default AchievementsGallery;
