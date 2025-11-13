import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

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

const NeuralSkills = () => {
  const skills = [
    'react.svg',
    'streamlit.svg',
    'java.svg',
    'huggingface.svg',
    'python.svg',
    'matlab.svg',
    'r.svg',
    'jupyter.svg',
    'github.svg',
    'numpy.svg',
    'tensorflow.svg',
    'css.svg',
    'javascript.svg',
    'pandas.svg',
    'sql.svg',
    'tailwind.svg',
  ];

  return (
    <section id="skills" className="w-full max-w-7xl mx-auto px-4 py-20 relative">
      <h2 className="text-6xl font-mono font-bold text-light-gray mb-16 text-center">
        Skills & Tools
      </h2>

      {/* 3D Neural Net Background */}
      <div className="h-[600px] w-full mb-12 bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl overflow-hidden">
        <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <NeuralNetwork count={60} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Skills Icons */}
      <div className="flex flex-wrap justify-center gap-6">
        {skills.map((icon, idx) => (
          <motion.div
            key={idx}
            className="bg-glass-bg backdrop-blur-md border border-glass-border rounded-xl p-4 hover:border-neon-cyan transition-colors"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={`/icons/${icon}`} alt={icon} className="w-12 h-12" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default NeuralSkills;
