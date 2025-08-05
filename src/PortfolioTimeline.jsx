import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import titleAnimation from './assets/title.json'; // ✅ FIXED PATH
import { motion } from 'framer-motion';
import Spinner from './spinner'; // path must be correct (case-sensitive)
import './index.css'; // Ensure this file contains your Tailwind CSS setup
import { Mail, Linkedin} from "lucide-react";


export default function PortfolioTimeline() {
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  const certs = [
  {
    title:"CS50 Introduction to Artificial Intelligence with Python",
    issuer:"Harvard University",
    date:"July 2025",
  },
  {
    title:"1st Place - Best Use of External Data",
    issuer:"ASA",
    date:"March 2025",
  },
  ];

  const projectData = [
    {
      title:"CS50 Intro to AI with Python",
      description: "Completed a series of AI-focused projects as part of Harvard’s CS50 Introduction to Artificial Intelligence with Python. These projects span search algorithms, logic puzzles, probabilistic reasoning, optimization, machine learning, neural networks, and natural language processing. Each implementation demonstrates practical understanding of AI principles and Python-based system design.",
      icons: ["python.svg", "tensorflow.svg", "numpy.svg"],
      github: "https://github.com/haresham15/Haresh-s-CS50-Intro-to-AI-with-Python-Projects"
    },
    {
      title: "Software 2 Engineering Projects",
      description: "This repository contains my Software 2 Engineering Projects that I have worked on in my Software 2 class at OSU. The projects include a variety of software engineering topics such as JUnit testing, Implemnting Kernel Methods, and BL Compiling",
      icons: ["java.svg"],
      github: "https://github.com/haresham15/Haresh-s-Software-2-Projects",
    },
    {
      title: "CarStomer: Car Value Analysis and Classification",
      description: "Developed a data-driven machine learning model to analyze customer demographics and vehicle preferences using Python and scikit-learn. Explored correlations between age groups and car selections to generate actionable business insights for automotive sales strategy. The project includes exploratory data analysis, feature engineering, and model evaluation to support decision-making.",
      icons: ["streamlit.svg", "jupyter.svg", "python.svg"],
      github: "https://github.com/haresham15/CarStomerCarAnalysis",
      demo: "https://carstomeranalysisharesh.streamlit.app/"
    },
    {
      title: "TutorMatch: AI-Powered Tutoring Platform",
      description: "Developed a full-stack web application that facilitates tutor-student matching based on subject expertise, availability, and preferences. The platform allows users to register, browse profiles, and initiate tutoring sessions through an intuitive interface.",
      icons: ["streamlit.svg", "python.svg", "huggingface.svg" ,"jupyter.svg"],
      github: "https://github.com/haresham15/TutorMatch_WebApp",
      demo: "https://finaltutormatch.streamlit.app/"
    },
    {
      title: "Software 1 Engineering Projects",
      description: "These are my Software 1 Engineering Projects that I have worked on in my Software 1 class at OSU. These Projects helped teach me the basics of Software Engineering and the complexities of Java Programming.",
      icons: ["java.svg"],
      github: "https://github.com/haresham15/Software-Project-Java-Collection-",
    },
    {
      title: "Portfolio Website",
      description: "This is my personal portfolio website built with React and Tailwind CSS. This project helped me learn and develop my skills in Frontend Development and UI/UX Design.",
      icons: ["javascript.svg", "react.svg", "tailwind.svg", "github.svg","css.svg"],
      github: "https://github.com/haresham15/Haresh_Murugesan_Portfolio",
      demo: "https://haresh-murugesan-portfolio.onrender.com/"
    },
    {
      title: "A Birthday Website for my Brother!",
      description: "This is a birthday website I made for my brother's birthday. This project helped me dip my toes in CSS and JavaScript while still making a meaningfull project to celebrate my Brother's birthday. I was able to learn a lot about 3d-Objects, animations and scrolls.",
      icons: ["javascript.svg", "react.svg", "tailwind.svg", "github.svg", "css.svg"],
      github: "https://github.com/haresham15/AnnaBirthdayWebsite",
      demo: "https://annabirthday-blacktheme-fixed.onrender.com/"
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
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white font-raleway rounded-full px-6 py-2 shadow-lg flex gap-4 text-sm">
        <a href="#experience" className="hover:underline">Experience</a>
        <a href="#podcast" className="hover:underline">Podcast</a>
        <a href="#projects" className="hover:underline">Projects</a>
        <a href="#Awards and Certifications" className="hover:underline">Awards and Certifications</a>
        <a href="#skills" className="hover:underline">Skills</a>
        <a href="https://github.com/haresham15" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>

      {/* Add IDs to Sections for Nav Links */}
      <motion.div id="experience" className="mt-10 text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <h1 className="text-8xl font-raleway font-bold mb-9 mt-10">Haresh Murugesan.</h1>
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
        <h2 className="text-8xl font-bold font-raleway mb-10">About Me...</h2>
          <p className="max-w-6xl mx-auto font-raleway text-lg leading-relaxed">
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
        <p className="text-sm font-raleway text-blue-400">{item.year}</p>
        <h3 className="font-semibold">{item.role}, <span className="text-gray-400">{item.company}</span></h3>
      </div>
    ))}
  </div>
</motion.div>

      <motion.div id="podcast" className="mt-20 max-w-6xl text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
        <h2 className="text-6xl font-raleway font-bold mb-8 col-span-full text-center">The Adapt: Implementing Innovations</h2>
        <p className="text-xl font-raleway text-center mb-16">
          Exploring innovations that solve the world's toughest challenges, Listen on Spotify, Apple, and more.
        </p>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Spotify Embed on Left */}
          <iframe style={{ borderRadius: '24px' }} src="https://open.spotify.com/embed/show/5LPGObcWQdkoERNzZsdL98/video?utm_source=generator&theme=0" width="100%" height="351" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="md:w-1/2 w-full"/>
          {/* Description Text on Right */}
          <p className="text-lg font-raleway leading-relaxed md:w-1/2 w-full">
      The Adapt: Implementing Innovations podcast is a platform where I interview innovators and
      entrepreneurs about their journeys and the innovations they are implementing to solve the
      world's toughest challenges. Each episode dives deep into the stories behind the innovations,
      the challenges faced, and the impact they aim to create. I was inspired to start this podcast
      during the Covid Era when I realized the amount of important innovations that were keeping
      humanity safe. Fusing my passion for learning and inventing, I reached out to leaders in their
      respective fields to discuss and educate the general population on the work that was helping
      the world towards a better future.
          </p>
        </div> 
      </motion.div>

      <motion.div id="projects" className="mt-20 mb-15 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-6" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}>
        <h2 className="text-6xl font-raleway font-bold mb-4 col-span-full text-center">Projects</h2>
        <p className="text-xl font-raleway mt-2 mb-6 col-span-full text-center">Here are some of my recent projects that showcase my skills. My Projects range topics and skill dealing with AI, Machine Learning, Software Engineering and UI/Frontend Development. I enjoy exploring different topics in Computer Science and growing my scope to learn and grow.</p>
        {projectData.map((proj, idx) => (
          <div key={idx} onClick={() => setActiveProject(proj)} className="bg-[#112240] p-4 rounded-lg shadow-md border border-blue-400 hover:scale-105 transition-transform cursor-pointer">
            <h3 className="text-white font-semibold mb-2">{proj.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{proj.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {proj.icons.map((icon, i) => (
                <img key={i} src={`/icons/${icon}`} alt={icon} className="w-5 h-5" />
              ))}
            </div>
            <div className="flex gap-3 text-xs"> {proj.github && (
                <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline"> GitHub </a>)}
              {proj.demo && (
                <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline"> Live Demo </a>)}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div id = "Awards and Certifications"className="mt-20 w-full max-w-4xl text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
        <h1 className="text-6xl font-semibold mb-10">Awards and Certifications</h1>
            <ul className="space-y-6 list-none">
              {certs.map((cert, index) => (
              <li key={index} className="flex items-start gap-4">
              <span className="text-blue-400 text-xl mt-1">✓</span>
            <div>
              <h3 className="text-white text-lg font-semibold">{cert.title}</h3>
              <p className="text-gray-400 text-sm"> {cert.issuer} — {cert.date} {cert.link && (<a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-2" > View Certificate
              </a>)}
          </p>
        </div>
      </li>
    ))}
  </ul>   
      </motion.div>

      <motion.div id="skills" className="mt-20 w-full max-w-4xl text-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
        <h2 className="text-6xl font-semibold mb-10">Skills & Tools</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["react.svg", "streamlit.svg", "java.svg", "huggingface.svg", "python.svg","matlab.svg","r.svg","jupyter.svg","github.svg", "numpy.svg", "tensorflow.svg", "css.svg", "javascript.svg" , "pandas.svg", "sql.svg", "tailwind.svg"].map((icon, idx) => (
            <img key={idx} src={`/icons/${icon}`} alt={icon} className="w-12 h-12" />
          ))}
        </div>
      </motion.div>

      <motion.div id="contact" className="mt-12 w-full bg-gray-900 text-white py-20 px-4" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-6xl font-bold mb-8">Let's Connect</h2>
    <p className="text-3xl text-gray-400 mb-8">
      Whether you have a question, a project idea, or just want to say hi.
    </p>
    <div className="flex justify-center gap-6 mb-10">
      <a href="mailto:haresham2006@gmail.com" className="hover:text-teal-400 transition" aria-label="Email">
        <Mail size={35} />
      </a>
      <a href="https://www.linkedin.com/in/haresh-murugesan-4173412a1/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-teal-400 transition"
        aria-label="LinkedIn"
      >
        <Linkedin size={35} />
      </a>
    </div>
  </div>
</motion.div>

      {/* Footer */}
      <motion.div className="mt-5 text-[12px] text-gray-400" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
        © 2025 All Rights Reserved Haresh Murugesan
      </motion.div>
    </div>
  );
}
