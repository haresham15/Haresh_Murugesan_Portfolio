import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Image from 'next/image';
import Link from 'next/link';

function NeuralNetwork({ count = 60 }) {
 const nodesRef = useRef();
 const linesRef = useRef();
 const { viewport, mouse } = useThree();

 const nodes = useMemo(() => {
  return Array.from({ length: count }, () => ({
   position: [
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
   ],
   velocity: [
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
   ],
  }));
 }, [count]);

 useFrame(() => {
  if (!nodesRef.current) return;

  const positions = nodesRef.current.geometry.attributes.position.array;

  nodes.forEach((node, i) => {
   // Update position
   node.position[0] += node.velocity[0];
   node.position[1] += node.velocity[1];
   node.position[2] += node.velocity[2];

   // Boundary check
   if (Math.abs(node.position[0]) > 2) node.velocity[0] *= -1;
   if (Math.abs(node.position[1]) > 2) node.velocity[1] *= -1;
   if (Math.abs(node.position[2]) > 2) node.velocity[2] *= -1;

   // Mouse interaction
   const dx = node.position[0] - mouse.x * 2;
   const dy = node.position[1] - mouse.y * 2;
   const distance = Math.sqrt(dx * dx + dy * dy);

   if (distance < 1 && distance > 0) {
    const force = (1 - distance) * 0.02;
    node.velocity[0] += (dx / distance) * force;
    node.velocity[1] += (dy / distance) * force;
   }

   // Update positions
   const i3 = i * 3;
   positions[i3] = node.position[0];
   positions[i3 + 1] = node.position[1];
   positions[i3 + 2] = node.position[2];
  });

  nodesRef.current.geometry.attributes.position.needsUpdate = true;
 });

 // Calculate connections dynamically
 const connections = useMemo(() => {
  const lines = [];
  for (let i = 0; i < nodes.length; i++) {
   for (let j = i + 1; j < nodes.length; j++) {
    const dx = nodes[i].position[0] - nodes[j].position[0];
    const dy = nodes[i].position[1] - nodes[j].position[1];
    const dz = nodes[i].position[2] - nodes[j].position[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (distance < 1.5) {
     lines.push([i, j]);
    }
   }
  }
  return lines;
 }, [nodes]);

 return (
  <>
   <points ref={nodesRef}>
    <bufferGeometry>
     <bufferAttribute
      attach="attributes-position"
      count={nodes.length}
      array={new Float32Array(nodes.flatMap((n) => n.position))}
      itemSize={3}
     />
    </bufferGeometry>
    <pointsMaterial size={0.05} color="#22d3ee" />
   </points>
   {connections.slice(0, 200).map(([i, j], idx) => (
    <line key={`line-${i}-${j}-${idx}`}>
     <bufferGeometry>
      <bufferAttribute
       attach="attributes-position"
       count={2}
       array={new Float32Array([
        ...nodes[i].position,
        ...nodes[j].position,
       ])}
       itemSize={3}
      />
     </bufferGeometry>
     <lineBasicMaterial color="#9333ea" opacity={0.3} transparent />
    </line>
   ))}
  </>
 );
}

const SkillCard = ({ skill, idx, activeCategory, onSelect, isSelected }) => {
  const cardRef = useRef(null);
  const [classes, setClasses] = useState({
    modalPosition: 'bottom-full left-full origin-bottom-left',
    linePosition: '-bottom-3 -left-3 origin-top-right -rotate-45', 
    randomOffset: { x: 0, y: 0 }
  });

  const isAWS = skill.title === 'AWS';
  const isMatch = activeCategory === 'All' || skill.categories.includes(activeCategory);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const winWidth = window.innerWidth;
    
    const isCloseToRight = rect.right > winWidth - 260;
    const isCloseToLeft = rect.left < 260;
    const isCloseToTop = rect.top < 200;

    const randX = Math.floor(Math.random() * 20) + 8;
    const randY = Math.floor(Math.random() * 20) + 8;

    let modalPos = '';
    let linePos = '';
    
    if (isCloseToTop && isCloseToLeft) {
      modalPos = 'top-full left-full origin-top-left';
      linePos = '-top-3 -left-3 origin-bottom-right -rotate-45';
    } else if (isCloseToTop && isCloseToRight) {
      modalPos = 'top-full right-full origin-top-right';
      linePos = '-top-3 -right-3 origin-bottom-left rotate-45';
    } else if (isCloseToTop) {
      const goRight = Math.random() > 0.5;
      if (goRight) {
        modalPos = 'top-full left-full origin-top-left';
        linePos = '-top-3 -left-3 origin-bottom-right -rotate-45';
      } else {
        modalPos = 'top-full right-full origin-top-right';
        linePos = '-top-3 -right-3 origin-bottom-left rotate-45';
      }
    } else if (isCloseToRight) {
      modalPos = 'bottom-full right-full origin-bottom-right';
      linePos = '-bottom-3 -right-3 origin-top-left rotate-45';
    } else if (isCloseToLeft) {
      modalPos = 'bottom-full left-full origin-bottom-left';
      linePos = '-bottom-3 -left-3 origin-top-right -rotate-45';
    } else {
      const goRight = idx % 2 === 0;
      if (goRight) {
        modalPos = 'bottom-full left-full origin-bottom-left';
        linePos = '-bottom-3 -left-3 origin-top-right -rotate-45';
      } else {
        modalPos = 'bottom-full right-full origin-bottom-right';
        linePos = '-bottom-3 -right-3 origin-top-left rotate-45';
      }
    }

    setClasses({ modalPosition: modalPos, linePosition: linePos, randomOffset: { x: randX, y: randY } });
  };

  const isTopPos = classes.modalPosition.includes('top-full');
  const isLeftPos = classes.modalPosition.includes('left-full');
  
  const marginTop = isTopPos ? `${classes.randomOffset.y}px` : `-${classes.randomOffset.y}px`;
  const marginLeft = isLeftPos ? `${classes.randomOffset.x}px` : `-${classes.randomOffset.x}px`;

  const cardContent = (
    <motion.div
      id={`skill-${skill.icon.split('.')[0]}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onClick={() => onSelect(skill)}
      className={`relative scroll-mt-32 group bg-glass-bg backdrop-blur-md border p-3 sm:p-4 transition-all duration-300 cursor-pointer z-10 hover:z-50 ${
        isMatch ? 'opacity-100' : 'opacity-30 grayscale hover:opacity-80 hover:grayscale-0'
      } ${
        isSelected ? 'ring-2 ring-cine-teal border-cine-teal' : ''
      } ${
        isAWS 
          ? 'rounded-2xl border-cine-teal/70 shadow-[0_0_15px_rgba(5,213,186,0.3)] bg-cine-teal/10 hover:bg-cine-teal/20 mx-1 sm:mx-2 hover:shadow-cine-glow-teal' 
          : 'rounded-xl border-glass-border hover:border-cine-teal hover:shadow-cine-glow-teal'
      }`}
      whileHover={{ scale: isAWS ? 1.15 : 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative flex flex-col items-center justify-center">
        <Image 
          src={`/icons/${skill.icon}`} 
          alt={skill.title} 
          width={isAWS ? 56 : 42} 
          height={isAWS ? 56 : 42} 
          className={`${isAWS ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-9 h-9 sm:w-12 sm:h-12'} relative z-10`} 
        />
        {isAWS && (
          <span className="absolute -bottom-3.5 sm:-bottom-4 bg-cine-teal text-black text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
            Explore Ecosystem
          </span>
        )}
      </div>

      {/* Floating Tooltip with Dynamic Positioning (Desktop hover) */}
      <div 
        className={`absolute ${classes.modalPosition} hidden md:flex w-52 md:w-64 p-3.5 bg-[#050505]/95 backdrop-blur-xl border border-white/10 group-hover:border-cine-teal/50 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-75 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-cine-glow-teal flex-col gap-1.5 z-50`}
        style={{ marginTop, marginLeft }}
      >
        <div 
          className={`absolute ${classes.linePosition} w-6 h-[1px] bg-cine-teal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100`}
        ></div>
        
        <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
          <h4 className="text-cine-teal font-heading font-semibold text-sm tracking-tight">
            {skill.title}
          </h4>
          <span className="text-[10px] font-mono text-light-gray/40">
            {skill.categories[0]}
          </span>
        </div>
        <p className="text-light-gray/90 text-xs font-sans leading-relaxed">
          {isAWS ? 'Engineered at CAS (Lambda, DynamoDB, S3, IAM, CloudWatch). Click to explore.' : skill.highlight}
        </p>
      </div>
    </motion.div>
  );

  if (isAWS) {
    return (
      <Link href="/skills/aws" className="z-10 hover:z-50">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

const NeuralSkills = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const categories = [
    'All',
    'AI & Computer Vision',
    'Full-Stack & Systems',
    'Cloud & DevOps',
    'Data & Analytics',
  ];

  const skills = [
    // AI & Computer Vision
    { 
      icon: 'python.svg', 
      title: 'Python', 
      categories: ['AI & Computer Vision', 'Data & Analytics', 'Full-Stack & Systems'], 
      highlight: 'Core language for CV pipelines (Grad-CAM, OpenCV), FastAPI backends, and scientific ML.' 
    },
    { 
      icon: 'tensorflow.svg', 
      title: 'TensorFlow', 
      categories: ['AI & Computer Vision'], 
      highlight: 'Deep CNN architectures, surgical incision feature extraction, and Grad-CAM heatmaps in Healios V2.' 
    },
    { 
      icon: 'opencv.svg', 
      title: 'OpenCV', 
      categories: ['AI & Computer Vision'], 
      highlight: 'HSV morphological tissue segmentation (2.00ms execution) and clinical wheal diagnostics.' 
    },
    { 
      icon: 'numpy.svg', 
      title: 'NumPy', 
      categories: ['AI & Computer Vision', 'Data & Analytics'], 
      highlight: 'Vectorized Grad-CAM mathematical transforms, HSV masking arrays, and spatial matrices.' 
    },
    { 
      icon: 'scitkitlearn.svg', 
      title: 'Scikit-Learn', 
      categories: ['AI & Computer Vision', 'Data & Analytics'], 
      highlight: 'Clinical evaluation benchmarks (Recall, False Alarms), TF-IDF RAG, and DataFest statistical models.' 
    },
    { 
      icon: 'huggingface.svg', 
      title: 'Hugging Face', 
      categories: ['AI & Computer Vision'], 
      highlight: 'Transformer embedding extraction, tokenization pipelines, and open-source model evaluation.' 
    },

    // Full-Stack & Systems
    { 
      icon: 'typescript.svg', 
      title: 'TypeScript', 
      categories: ['Full-Stack & Systems'], 
      highlight: 'Strict type safety, Zod runtime schemas with 1-turn automated self-correction in Tempo, and Next.js.' 
    },
    { 
      icon: 'nextjs.svg', 
      title: 'Next.js', 
      categories: ['Full-Stack & Systems'], 
      highlight: 'Full-stack App Router, Turbopack SSG/SSR, and high-performance routing across Healios, Apexis, & Tempo.' 
    },
    { 
      icon: 'react.svg', 
      title: 'React', 
      categories: ['Full-Stack & Systems'], 
      highlight: 'React 19 concurrent features, off-main-thread Web Worker race simulations (Apexis), and interactive UIs.' 
    },
    { 
      icon: 'fastapi.svg', 
      title: 'FastAPI', 
      categories: ['Full-Stack & Systems', 'AI & Computer Vision'], 
      highlight: 'Asynchronous Python backends, SQLModel ORM, and low-latency inference routing (<15ms p50).' 
    },
    { 
      icon: 'postgresql.svg', 
      title: 'PostgreSQL & pgvector', 
      categories: ['Full-Stack & Systems', 'Cloud & DevOps'], 
      highlight: 'Relational data modeling and high-accuracy cosine similarity vector search (0.824 similarity in Tempo).' 
    },
    { 
      icon: 'supabase.svg', 
      title: 'Supabase', 
      categories: ['Full-Stack & Systems', 'Cloud & DevOps'], 
      highlight: 'Managed PostgreSQL, pgvector embedding storage, and real-time state synchronization in Tempo.' 
    },
    { 
      icon: 'tailwind.svg', 
      title: 'Tailwind CSS', 
      categories: ['Full-Stack & Systems'], 
      highlight: 'Utility-first modern CSS architecture, design tokens, and clean responsive layouts across all devices.' 
    },
    { 
      icon: 'javascript.svg', 
      title: 'JavaScript', 
      categories: ['Full-Stack & Systems'], 
      highlight: 'Modern ES6+, DOM manipulation, event loops, Web Workers, and client-side canvas processing.' 
    },
    { 
      icon: 'docker.svg', 
      title: 'Docker', 
      categories: ['Full-Stack & Systems', 'Cloud & DevOps'], 
      highlight: 'Containerized microservices, local multi-container development, and reproducible ML environments.' 
    },

    // Cloud & DevOps
    { 
      icon: 'aws.svg', 
      title: 'AWS', 
      categories: ['Cloud & DevOps'], 
      highlight: 'Serverless architectures (Lambda, DynamoDB, S3, IAM, CloudWatch) & C4 modeling at CAS.' 
    },
    { 
      icon: 'github.svg', 
      title: 'GitHub & Actions', 
      categories: ['Cloud & DevOps'], 
      highlight: 'Trunk-based CI/CD pipelines, automated testing gates, and collaborative open-source engineering.' 
    },

    // Data & Analytics
    { 
      icon: 'pandas.svg', 
      title: 'Pandas', 
      categories: ['Data & Analytics'], 
      highlight: 'Data wrangling and feature engineering across 1,000+ connected-vehicle models at Honda/99P Labs.' 
    },
    { 
      icon: 'sql.svg', 
      title: 'SQL', 
      categories: ['Data & Analytics', 'Full-Stack & Systems'], 
      highlight: 'Relational schema design, complex joins, index optimization, and high-throughput query execution.' 
    },
    { 
      icon: 'jupyter.svg', 
      title: 'Jupyter', 
      categories: ['Data & Analytics', 'AI & Computer Vision'], 
      highlight: 'Exploratory data analysis, model evaluation benchmarking, and reproducible research notebooks.' 
    },
    { 
      icon: 'Streamlit.svg', 
      title: 'Streamlit', 
      categories: ['Data & Analytics', 'AI & Computer Vision'], 
      highlight: 'Rapid interactive data apps and internal ML analytics prototypes for spatial telemetry.' 
    },
    { 
      icon: 'r.svg', 
      title: 'R', 
      categories: ['Data & Analytics'], 
      highlight: 'Statistical hypothesis testing, exploratory modeling, and winning Ohio State DataFest analytics.' 
    },
    { 
      icon: 'matlab.svg', 
      title: 'MATLAB', 
      categories: ['Data & Analytics'], 
      highlight: 'Matrix computing, numerical linear algebra, and digital signal/image processing workflows.' 
    },
    { 
      icon: 'java.svg', 
      title: 'Java', 
      categories: ['Full-Stack & Systems'], 
      highlight: 'Object-oriented software architecture, data structures, and algorithmic foundations at Ohio State.' 
    },
  ];

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.categories.includes(activeCategory));

  return (
    <section id="skills" className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 relative">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold tracking-tight text-white mb-3">
          Skills & Tools
        </h2>
        <p className="text-light-gray/70 font-sans text-sm sm:text-base max-w-2xl mx-auto">
          Production technologies applied across real-world systems, clinical AI research, and cloud infrastructure.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10 px-2">
        {categories.map((cat) => {
          const count = cat === 'All' ? skills.length : skills.filter(s => s.categories.includes(cat)).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedSkill(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 border ${
                isActive
                  ? 'bg-cine-teal/15 border-cine-teal text-white shadow-cine-glow-teal'
                  : 'bg-black/30 border-white/10 text-light-gray/60 hover:text-white hover:border-white/20'
              }`}
            >
              {cat} <span className="text-[10px] font-mono text-light-gray/40 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 3D Neural Net Background */}
      <div className="h-[220px] sm:h-[300px] md:h-[360px] w-full mb-8 sm:mb-12 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl overflow-hidden relative">
        <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cine-teal animate-ping" />
          <span className="text-[11px] font-mono text-light-gray/50 uppercase tracking-wider">
            Interactive Neural Graph
          </span>
        </div>
        <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <NeuralNetwork count={60} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Mobile/Touch Selected Skill Card Banner */}
      {selectedSkill && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mb-6 p-4 rounded-xl bg-cine-teal/10 border border-cine-teal/40 flex items-start justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-heading font-semibold text-sm">
                {selectedSkill.title}
              </span>
              <span className="text-[10px] font-mono text-cine-teal px-1.5 py-0.5 rounded bg-cine-teal/20">
                {selectedSkill.categories[0]}
              </span>
            </div>
            <p className="text-light-gray/90 text-xs font-sans leading-relaxed">
              {selectedSkill.highlight}
            </p>
          </div>
          <button 
            onClick={() => setSelectedSkill(null)}
            className="text-light-gray/40 hover:text-white text-sm px-1"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Skills Icons Grid */}
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-6 md:gap-8">
        {skills.map((skill, idx) => (
          <SkillCard 
            key={skill.title} 
            skill={skill} 
            idx={idx} 
            activeCategory={activeCategory}
            onSelect={setSelectedSkill}
            isSelected={selectedSkill?.title === skill.title}
          />
        ))}
      </div>
    </section>
  );
};

export default NeuralSkills;
