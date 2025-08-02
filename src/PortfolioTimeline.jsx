import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import titleAnimation from './assets/title.json'; // ✅ FIXED PATH
import { motion } from 'framer-motion';
import Spinner from './spinner'; // path must be correct (case-sensitive)
import './index.css'; // Ensure this file contains your Tailwind CSS setup

export default function PortfolioTimeline() {
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  const projectData = [
    {
      title: "CarStomer: Car Value Analysis and Classification",
      description: "A Machine learning web app for car value analysis and classification.",
      icons: ["streamlit.svg", "jupyter.svg", "python.svg"],
      github: "https://github.com/haresham15/CarStomerCarAnalysis",
      demo: "https://carstomeranalysisharesh.streamlit.app/"
    },
    {
      title: "TutorMatch: AI-Powered Tutoring Platform",
      description: "A platform for connecting students and tutors to learn in real life using AI.",
      icons: ["streamlit.svg", "python.svg", "huggingface.svg" ,"jupyter.svg"],
      github: "https://github.com/haresham15/TutorMatch_WebApp",
      demo: "https://finaltutormatch.streamlit.app/"
    },
    {
      title: "Software Engineering Projects",
      description: "A productivity web app focused on minimal distraction design.",
      icons: ["java.svg"],
      github: "https://github.com/yourusername/grey-matter",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  if (loading) {
    return <Spinner/>;
  }

  return (

    <div className={`grain-bg w-full overflow-x-hidden text-white min-h-screen px-4 py-8 font-sans flex flex-col items-center`}>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div className="bg-blue-500 h-full" style={{ width: `${(window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%` }}></div>
      </div>

      {/* Floating NavBar */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white rounded-full px-6 py-2 shadow-lg flex gap-4 text-sm">
        <a href="#experience" className="hover:underline">Experience</a>
        <a href="#podcast" className="hover:underline">Podcast</a>
        <a href="#projects" className="hover:underline">Projects</a>
        <a href="#skills" className="hover:underline">Skills</a>
        <a href="https://github.com/haresham15" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>

      {/* Add IDs to Sections for Nav Links */}
      <motion.div id="experience" className="mt-10 text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <h1 className="text-8xl font-raleway font-bold mb-9">Haresh Murugesan.</h1>
        <p className="text-5xl font-inter text-gray-300 mt-2">Learning, Adapting and Innovating</p>
      </motion.div>

      <div className="w-full h-[80vh] flex items-center justify-center">
  <Lottie
    animationData={titleAnimation}
    loop
    autoplay
    className="w-[90vw] max-w-4xl"
  />
</div>

      {/* Other sections with IDs: #podcast, #projects, #skills */}

      <motion.div id="experience" className="mt-20 text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <h2 className="text-6xl font-bold font-raleway mb-4">About Me...</h2>
          <p className="max-w-3xl mx-auto font-raleway text-lg leading-relaxed">
            I'm a CSE student at OSU focused on AI, software, and innovation. I love learning about innovations and tech every day and hope to use my technical skills to help provide meaningful contributions to society through CS and AI. I am the CEO and Director of Finances at Philocracy, a non-profit organization that aims to help people through fashion and love. I also host the Adapt: Implementing Innovations podcast, where I interview innovators and entrepreneurs about their journeys and the innovations they are implementing to solve the world's toughest challenges. In my free time, I enjoy coding, reading, and exploring new technologies.
          </p>
      </motion.div>

      <motion.div
  id="experience"
  className="mt-20 w-full max-w-3xl"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  <h2 className="text-6xl font-bold font-raleway mb-9 text-center">Experience Timeline</h2>
  <div className="relative border-l-2 border-blue-400 pl-6">
    {[
      { year: "April 2023", role: "CEO and Director of Finances", company: "Philocracy" },
      { year: "August 2023", role: "Founder and Host", company: "Adapt: Implementing Innovations Podcast" },
      { year: "Feburary 2024", role: "Math Tutor", company: "Mathnasium" },
      { year: "May 2024", role: "Research Student", company: "OSU Data and CS Lab" },
      { year: "May 2025", role: "Innovation Analyst", company: "Onramp Student Innovation Program" },
    ].map((item, i) => (
      <div key={i} className="mb-10">
        <div className="absolute w-3 h-3 bg-blue-500 rounded-full left-[-8px] top-[5px]"></div>
        <p className="text-sm text-blue-400">{item.year}</p>
        <h3 className="font-semibold">{item.role}, <span className="text-gray-400">{item.company}</span></h3>
      </div>
    ))}
  </div>
</motion.div>

      <motion.div id="podcast" className="mt-20 max-w-xl text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
        <h2 className="text-5xl font-bold font-raleway mb-10">The Adapt: Implementing Innovations</h2>
        <p className="text-gray-300 font-raleway mt-2 mb-10">Exploring innovations that solve the world's toughest challenges, hosted by Haresh Murugesan. Listen on Spotify, Apple, and more.</p>
        <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/show/5LPGObcWQdkoERNzZsdL98/video?utm_source=generator&theme=0" width="624" height="351" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"/>
      </motion.div>

      <motion.div id="projects" className="mt-20 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}>
        <h2 className="text-5xl font-raleway font-bold mb-6 col-span-full text-center">Projects</h2>
        <p className="text-gray-300 font-raleway mt-2 mb-6 col-span-full text-center">Here are some of my recent projects that showcase my skills. My Projects range topics and skill dealing with AI, Machine Learning, Software Engineering and UI/Frontend Development. I enjoy exploring different topics in Computer Science and growing my scope to learn and grow.</p>
        {projectData.map((proj, idx) => (
          <div key={idx} onClick={() => setActiveProject(proj)} className="bg-[#112240] p-4 rounded-lg shadow-md border border-blue-400 hover:scale-105 transition-transform cursor-pointer">
            <h3 className="text-white font-semibold mb-2">{proj.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{proj.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {proj.icons.map((icon, i) => (
                <img key={i} src={`/icons/${icon}`} alt={icon} className="w-5 h-5" />
              ))}
            </div>
            <div className="flex gap-3 text-xs">
              <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">GitHub</a>
              <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Live Demo</a>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div id="skills" className="mt-20 w-full max-w-4xl text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
        <h2 className="text-xl font-semibold mb-10">🛠️ Skills & Tools</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["react.svg", "streamlit.svg", "java.svg", "huggingface.svg", "python.svg","matlab.svg","r.svg"].map((icon, idx) => (
            <img key={idx} src={`/icons/${icon}`} alt={icon} className="w-12 h-12" />
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div className="mt-20 text-[10px] text-gray-400" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
        © 2020–2025 <br /> All Rights Reserved Haresh Murugesan
      </motion.div>
    </div>
  );
}
