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
      colSpan: 'md:col-span-2',
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
    <section id="achievements" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-6 sm:mb-8 text-center">
        Achievements
      </h2>
      
      {/* Responsive Filtering Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
        {['all', 'award', 'certification'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-sans text-xs sm:text-sm font-medium transition-all border ${
              filter === tab
                ? 'bg-cine-teal/20 border-cine-teal text-cine-teal shadow-lg'
                : 'bg-black/40 border-white/10 text-light-gray/60 hover:text-light-gray hover:border-white/30'
            }`}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Bento Grid Gallery */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              key={item.id}
              className={`bg-cine-lavender/5 border border-cine-lavender/20 rounded-xl p-4 sm:p-6 hover:bg-cine-lavender/10 transition-all duration-300 shadow-none group flex flex-col justify-between cursor-pointer ${item.colSpan}`}
              onClick={() => setSelectedItem(item)}
            >
              <div>
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                  <span className={`text-[10px] sm:text-xs font-mono font-medium px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${
                    item.type === 'award' ? 'border-cine-teal text-cine-teal bg-cine-teal/10' : 'border-cine-lavender text-cine-lavender bg-cine-lavender/10'
                  }`}>
                    {item.type === 'award' ? 'Award' : 'Certification'}
                  </span>
                  <span className="text-light-gray/50 font-mono text-xs sm:text-sm">{item.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-cine-teal transition-colors leading-snug tracking-tight">
                  {item.title}
                </h3>
                <p className="text-light-gray/70 font-sans text-xs sm:text-sm mb-3 sm:mb-4">{item.issuer}</p>
                {item.description && (
                  <p className="text-light-gray/50 text-xs sm:text-sm font-sans line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              
              <div className="mt-4 sm:mt-6 flex items-center gap-2 text-cine-teal group-hover:text-cine-lavender transition-colors font-sans font-medium text-xs sm:text-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                View Document <span className="text-sm sm:text-base leading-none transform group-hover:translate-x-1 transition-transform">→</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-glass-bg border border-glass-border rounded-2xl w-full max-w-6xl max-h-[88vh] flex flex-col md:flex-row overflow-y-auto relative shadow-cine-glow-lavender"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/70 hover:bg-cine-lavender text-white rounded-full flex items-center justify-center transition-colors border border-glass-border text-xs sm:text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Left Side: PDF Viewer */}
              <div className={`w-full ${selectedItem.description ? 'md:w-2/3 border-b md:border-b-0 md:border-r' : ''} aspect-[1.3] sm:aspect-[1.414] border-glass-border shrink-0`}>
                {selectedItem.pdfUrl ? (
                  <iframe
                    src={`${selectedItem.pdfUrl}#toolbar=0&view=FitH`}
                    title={selectedItem.title}
                    className={`w-full h-full ${selectedItem.description ? 'rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none' : 'rounded-2xl'}`}
                    style={{ border: 'none' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-light-gray/50 font-sans bg-black/40 text-xs sm:text-sm">
                    PDF not available yet.
                  </div>
                )}
              </div>

              {/* Right Side: Description */}
              {selectedItem.description && (
                <div className="w-full md:w-1/3 p-4 sm:p-6 md:p-8 flex flex-col overflow-y-auto">
                  <span className={`text-[10px] sm:text-xs font-mono font-medium px-3 py-1 rounded-full border w-fit mb-3 sm:mb-4 ${
                    selectedItem.type === 'award' ? 'border-cine-teal text-cine-teal bg-cine-teal/10' : 'border-cine-lavender text-cine-lavender bg-cine-lavender/10'
                  }`}>
                    {selectedItem.type === 'award' ? 'Award' : 'Certification'}
                  </span>
                  
                  <span className="text-light-gray/50 font-mono text-xs sm:text-sm mb-1 sm:mb-2 block">{selectedItem.date}</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-white mb-2 tracking-tight">
                    {selectedItem.title}
                  </h3>
                  <p className="text-base sm:text-xl text-cine-lavender/80 font-sans mb-4 sm:mb-6 border-b border-glass-border pb-3 sm:pb-4">
                    {selectedItem.issuer}
                  </p>
                  <div>
                    <h4 className="text-white font-heading font-semibold text-sm sm:text-base mb-2 tracking-tight">About this achievement</h4>
                    <p className="text-light-gray/70 leading-relaxed font-sans text-xs sm:text-sm">
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
