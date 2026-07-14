import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificationsSection = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

  // List of certifications. You can add more here later.
  // Make sure the PDFs are placed in the public/certifications/ folder.
  const certifications = [
    {
      id: 1,
      title: 'CS50 Introduction to Artificial Intelligence with Python',
      issuer: 'Harvard University',
      date: 'July 2025',
      description: 'An introductory course to AI using Python. Covered topics such as graph search algorithms, reinforcement learning, machine learning, neural networks, and natural language processing. Completed various projects implementing AI concepts to solve real-world problems.',
      pdfUrl: '/certifications/cs50.pdf' // Assuming you will add this file to public/certifications/
    },
    // Add more certifications here
    // {
    //   id: 2,
    //   title: 'Certification Title',
    //   issuer: 'Issuer Name',
    //   date: 'Month Year',
    //   description: 'Description of the certification.',
    //   pdfUrl: '/certifications/your-pdf-file.pdf'
    // }
  ];

  return (
    <section id="certifications" className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
      <h2 className="text-6xl font-mono font-bold tracking-tight text-light-gray mb-16 text-center">
        Certifications
      </h2>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-neon-cyan/50 transition-colors shadow-lg shadow-black/50 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedCert(cert)}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className="text-neon-cyan text-sm font-mono mb-2 block">{cert.date}</span>
                <h3 className="text-2xl font-sans font-bold text-light-gray mb-2 group-hover:text-neon-purple transition-colors">
                  {cert.title}
                </h3>
                <p className="text-light-gray/70 font-sans text-lg mb-4">{cert.issuer}</p>
              </div>
              <div className="text-neon-cyan font-mono text-sm uppercase tracking-wider flex items-center gap-2 mt-4">
                View Certificate <span className="text-lg">→</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for PDF and Description */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)} // Close when clicking outside
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-glass-bg border border-glass-border rounded-2xl w-full max-w-6xl h-[90vh] sm:h-[80vh] flex flex-col md:flex-row overflow-hidden relative shadow-2xl shadow-neon-purple/20"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-neon-purple text-white rounded-full flex items-center justify-center transition-colors border border-glass-border"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Left Side: PDF Viewer */}
              <div className="w-full md:w-2/3 h-[50vh] md:h-full bg-black/40 border-b md:border-b-0 md:border-r border-glass-border">
                {selectedCert.pdfUrl ? (
                  <iframe
                    src={`${selectedCert.pdfUrl}#toolbar=0`}
                    title={selectedCert.title}
                    className="w-full h-full rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                    style={{ border: 'none' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-light-gray/50 font-mono">
                    PDF not available yet.
                  </div>
                )}
              </div>

              {/* Right Side: Description */}
              <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col overflow-y-auto">
                <span className="text-neon-cyan font-mono mb-2 block">{selectedCert.date}</span>
                <h3 className="text-3xl font-bold font-sans text-light-gray mb-2">
                  {selectedCert.title}
                </h3>
                <p className="text-xl text-neon-purple/80 font-sans mb-8 border-b border-glass-border pb-4">
                  {selectedCert.issuer}
                </p>
                <div className="prose prose-invert">
                  <h4 className="text-light-gray font-mono text-lg mb-2">About this certification</h4>
                  <p className="text-light-gray/70 leading-relaxed font-sans">
                    {selectedCert.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificationsSection;
