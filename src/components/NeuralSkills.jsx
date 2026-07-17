import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Image from 'next/image';

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

const SkillCard = ({ skill, idx }) => {
 const cardRef = useRef(null);
 const [classes, setClasses] = useState({
  modalPosition: 'bottom-full left-full origin-bottom-left',
  linePosition: '-bottom-3 -left-3 origin-top-right -rotate-45', 
  randomOffset: { x: 0, y: 0 }
 });

 const handleMouseEnter = () => {
  if (!cardRef.current) return;
  const rect = cardRef.current.getBoundingClientRect();
  const winWidth = window.innerWidth;
  
  // Check if modal might overflow window bounds (modal is ~224px wide, ~100px tall)
  const isCloseToRight = rect.right > winWidth - 260;
  const isCloseToLeft = rect.left < 260;
  const isCloseToTop = rect.top < 200;

  // Random distance variable (8px to 32px) for nuance
  const randX = Math.floor(Math.random() * 24) + 8;
  const randY = Math.floor(Math.random() * 24) + 8;

  let modalPos = '';
  let linePos = '';
  
  // Evaluate safe corner to prevent clipping
  if (isCloseToTop && isCloseToLeft) {
   modalPos = 'top-full left-full origin-top-left';
   linePos = '-top-3 -left-3 origin-bottom-right -rotate-45';
  } else if (isCloseToTop && isCloseToRight) {
   modalPos = 'top-full right-full origin-top-right';
   linePos = '-top-3 -right-3 origin-bottom-left rotate-45';
  } else if (isCloseToTop) {
   // Top row, center-ish -> go bottom-right or bottom-left randomly
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
   // Safe to go anywhere, alternate based on index for visual variety
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

 return (
  <motion.div
   ref={cardRef}
   onMouseEnter={handleMouseEnter}
   className="relative group bg-glass-bg backdrop-blur-md border border-glass-border rounded-xl p-4 hover:border-cine-teal transition-colors cursor-pointer z-10 hover:z-50"
   whileHover={{ scale: 1.1, y: -5 }}
   whileTap={{ scale: 0.95 }}
  >
   <Image src={`/icons/${skill.icon}`} alt={skill.title} width={48} height={48} className="w-12 h-12 relative z-10" />

   {/* Detail Modal with Dynamic CSS Positioning */}
   <div 
    className={`absolute ${classes.modalPosition} w-48 md:w-56 p-4 bg-[#050505]/95 backdrop-blur-xl border border-white/10 group-hover:border-cine-teal/50 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-75 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-2xl shadow-black/80 flex flex-col gap-1.5 z-50`}
    style={{ marginTop, marginLeft }}
   >
    {/* Angled Connecting Thin Line */}
    <div 
     className={`absolute ${classes.linePosition} w-6 h-[1px] bg-cine-teal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100`}
    ></div>
    
    <h4 className="text-cine-teal font-sans tracking-widest uppercase font-bold text-sm border-b border-white/10 pb-1 mb-1">
     {skill.title}
    </h4>
    <p className="text-light-gray/90 text-xs font-sans leading-relaxed">
     {skill.description}
    </p>
   </div>
  </motion.div>
 );
};

const NeuralSkills = () => {
 const skills = [
  { icon: 'react.svg', title: 'React', description: 'Building interactive user interfaces and web applications.' },
  { icon: 'streamlit.svg', title: 'Streamlit', description: 'Creating fast and interactive data science web apps.' },
  { icon: 'java.svg', title: 'Java', description: 'Object-oriented programming for robust backend applications.' },
  { icon: 'huggingface.svg', title: 'Hugging Face', description: 'Utilizing pre-trained models and NLP libraries for AI.' },
  { icon: 'python.svg', title: 'Python', description: 'Versatile language for data science, AI, and backend development.' },
  { icon: 'matlab.svg', title: 'MATLAB', description: 'Numerical computing, matrix manipulations, and signal processing.' },
  { icon: 'r.svg', title: 'R', description: 'Statistical computing, data analysis, and visualization.' },
  { icon: 'jupyter.svg', title: 'Jupyter', description: 'Interactive notebooks for data exploration and analysis.' },
  { icon: 'github.svg', title: 'GitHub', description: 'Version control and collaborative software development.' },
  { icon: 'numpy.svg', title: 'NumPy', description: 'Fundamental package for scientific computing and machine learning.' },
  { icon: 'tensorflow.svg', title: 'TensorFlow', description: 'Building and training deep neural networks and ML models.' },
  { icon: 'css.svg', title: 'CSS', description: 'Styling, animations, and responsive web design.' },
  { icon: 'javascript.svg', title: 'JavaScript', description: 'Dynamic scripting for interactive web features.' },
  { icon: 'pandas.svg', title: 'Pandas', description: 'Powerful data manipulation and analysis library.' },
  { icon: 'sql.svg', title: 'SQL', description: 'Relational database management and data querying.' },
  { icon: 'tailwind.svg', title: 'Tailwind CSS', description: 'Utility-first CSS framework for rapid UI development.' },
  { icon: 'scitkitlearn.svg', title: 'scikit-learn', description: 'Machine learning library for predictive data analysis.' },
  { icon: 'matplotlib.svg', title: 'Matplotlib', description: 'Comprehensive library for creating static and interactive visualizations.' },
 ];

 return (
  <section id="skills" className="w-full max-w-7xl mx-auto px-4 py-20 relative">
   <h2 className="text-6xl font-sans tracking-widest uppercase font-bold text-light-gray mb-16 text-center">
    Skills & Tools
   </h2>

   {/* 3D Neural Net Background */}
   <div className="h-[400px] w-full mb-12 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl overflow-hidden">
    <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
     <ambientLight intensity={0.5} />
     <pointLight position={[10, 10, 10]} />
     <NeuralNetwork count={60} />
     <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
   </div>

   {/* Skills Icons */}
   <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8">
    {skills.map((skill, idx) => (
     <SkillCard key={idx} skill={skill} idx={idx} />
    ))}
   </div>
  </section>
 );
};

export default NeuralSkills;
