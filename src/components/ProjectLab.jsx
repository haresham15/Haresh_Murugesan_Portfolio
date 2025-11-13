import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectLab = () => {
  const [hoveredProject, setHoveredProject] = useState(null);

  const spotlightProjects = [
    {
      title: 'CS50 Intro to AI with Python',
      description:
        'Completed a series of AI-focused projects spanning search algorithms, logic puzzles, probabilistic reasoning, optimization, machine learning, neural networks, and natural language processing.',
      icons: ['python.svg', 'tensorflow.svg', 'numpy.svg'],
      github: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
      video: null, // Placeholder for video demo
    },
    {
      title: 'TutorMatch: AI-Powered Tutoring Platform',
      description:
        'Developed a full-stack web application that facilitates tutor-student matching based on subject expertise, availability, and preferences.',
      icons: ['streamlit.svg', 'python.svg', 'huggingface.svg', 'jupyter.svg'],
      github: 'https://github.com/haresham15/TutorMatch_WebApp',
      demo: 'https://finaltutormatch.streamlit.app/',
      video: null, // Placeholder for video demo
    },
    {
      title: 'CarStomer: Car Value Analysis and Classification',
      description:
        'Developed a data-driven machine learning model to analyze customer demographics and vehicle preferences using Python and scikit-learn.',
      icons: ['streamlit.svg', 'jupyter.svg', 'python.svg'],
      github: 'https://github.com/haresham15/CarStomerCarAnalysis',
      demo: 'https://carstomeranalysisharesh.streamlit.app/',
      video: null, // Placeholder for video demo
    },
  ];

  const archiveProjects = [
    {
      year: '2025',
      title: 'CS50 Intro to AI with Python',
      stack: 'Python, TensorFlow, NumPy',
      link: 'https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects',
    },
    {
      year: '2024',
      title: 'Software 2 Engineering Projects',
      stack: 'Java',
      link: 'https://github.com/haresham15/Haresh-s-Software-2-Projects',
    },
    {
      year: '2024',
      title: 'CarStomer: Car Value Analysis',
      stack: 'Python, Streamlit, Jupyter',
      link: 'https://github.com/haresham15/CarStomerCarAnalysis',
    },
    {
      year: '2024',
      title: 'TutorMatch: AI-Powered Tutoring Platform',
      stack: 'Python, Streamlit, HuggingFace',
      link: 'https://github.com/haresham15/TutorMatch_WebApp',
    },
    {
      year: '2024',
      title: 'Software 1 Engineering Projects',
      stack: 'Java',
      link: 'https://github.com/haresham15/Software-Project-Java-Collection-',
    },
    {
      year: '2024',
      title: 'Portfolio Website',
      stack: 'React, Tailwind CSS, JavaScript',
      link: 'https://github.com/haresham15/Haresh_Murugesan_Portfolio',
    },
    {
      year: '2024',
      title: 'A Birthday Website for my Brother!',
      stack: 'React, Tailwind CSS, JavaScript',
      link: 'https://github.com/haresham15/AnnaBirthdayWebsite',
    },
  ];

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-6xl font-mono font-bold text-light-gray mb-16 text-center">
        Projects
      </h2>

      {/* Spotlight Section */}
      <div className="mb-20">
        <h3 className="text-3xl font-mono font-bold text-light-gray mb-8">
          Spotlight
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spotlightProjects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl p-6 overflow-hidden relative"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {hoveredProject === index && project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-neon-purple/10 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-light-gray/40 font-sans">Demo Video</p>
                </div>
              )}
              <h4 className="text-xl font-mono font-bold text-light-gray mb-2">
                {project.title}
              </h4>
              <p className="text-light-gray/70 font-sans mb-4 text-sm">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.icons.map((icon, i) => (
                  <img
                    key={i}
                    src={`/icons/${icon}`}
                    alt={icon}
                    className="w-6 h-6"
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-purple transition-colors text-sm font-sans"
                  >
                    GitHub →
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-purple transition-colors text-sm font-sans"
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Archive Section */}
      <div>
        <h3 className="text-3xl font-mono font-bold text-light-gray mb-8">
          Archive
        </h3>
        <div className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left p-4 text-light-gray font-mono">Year</th>
                <th className="text-left p-4 text-light-gray font-mono">Project</th>
                <th className="text-left p-4 text-light-gray font-mono">Stack</th>
                <th className="text-left p-4 text-light-gray font-mono">Link</th>
              </tr>
            </thead>
            <tbody>
              {archiveProjects.map((project, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-glass-border hover:bg-glass-bg/50 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="p-4 text-neon-cyan font-mono">{project.year}</td>
                  <td className="p-4 text-light-gray font-sans">{project.title}</td>
                  <td className="p-4 text-light-gray/70 font-sans">{project.stack}</td>
                  <td className="p-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:text-neon-purple transition-colors font-sans"
                    >
                      View →
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ProjectLab;

