import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneBoundary } from './SceneBoundary';
import { useMotionPreference } from './MotionPreference';

interface MonolithThresholdProps {
  isReduced: boolean;
  mousePos: { x: number; y: number };
  scrollProgress: number;
}

function MonolithSceneContent({ isReduced, mousePos, scrollProgress }: MonolithThresholdProps) {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const leftCanyonRef = useRef<THREE.Group>(null);
  const rightCanyonRef = useRef<THREE.Group>(null);
  const lightCoreRef = useRef<THREE.Mesh>(null);
  const mistPointsRef = useRef<THREE.Points>(null);

  // Atmospheric mist particles
  const particleCount = 140;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 3.5 - 1.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const clampedScroll = Math.min(Math.max(scrollProgress, 0), 1);

    // Dynamic camera glide: camera moves closer into canyon threshold on scroll
    if (!isReduced) {
      const targetCamZ = 5.8 - clampedScroll * 2.2;
      const targetCamY = 0.2 + clampedScroll * 0.35;
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamZ, 4.0, delta);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 4.0, delta);
      state.camera.lookAt(0, 0.4, -4);

      // Low-inertia cursor parallax (max 4° / ~0.07 rad)
      if (sceneGroupRef.current) {
        const targetRotX = mousePos.y * 0.055;
        const targetRotY = mousePos.x * 0.068;
        sceneGroupRef.current.rotation.x = THREE.MathUtils.damp(sceneGroupRef.current.rotation.x, targetRotX, 3.5, delta);
        sceneGroupRef.current.rotation.y = THREE.MathUtils.damp(sceneGroupRef.current.rotation.y, targetRotY, 3.5, delta);
      }
    } else {
      state.camera.position.set(0, 0.2, 5.2);
      state.camera.lookAt(0, 0.4, -4);
    }

    // Monolith canyon parting subtly with scroll
    const partOffset = clampedScroll * 0.45;
    if (leftCanyonRef.current) {
      leftCanyonRef.current.position.x = THREE.MathUtils.damp(leftCanyonRef.current.position.x, -partOffset, 3.5, delta);
    }
    if (rightCanyonRef.current) {
      rightCanyonRef.current.position.x = THREE.MathUtils.damp(rightCanyonRef.current.position.x, partOffset, 3.5, delta);
    }

    // Sunrise core pulse & intensity
    if (lightCoreRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * 1.5) * 0.08;
      const scale = (1 + clampedScroll * 0.5) * pulse;
      lightCoreRef.current.scale.set(scale, scale, scale);
    }

    // Subtle drifting mist
    if (mistPointsRef.current && !isReduced) {
      mistPointsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* 1. Reflective Mirror Horizon Ground Plane (Water horizon fading into #07090D) */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 36]} />
        <meshStandardMaterial
          color="#07090D"
          roughness={0.12}
          metalness={0.88}
        />
      </mesh>

      {/* Subtle Horizon Ground Line Grid */}
      <mesh position={[0, -1.58, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 12]} />
        <meshBasicMaterial
          color="#102C4C"
          transparent
          opacity={0.18}
          wireframe
        />
      </mesh>

      {/* 2. Left Stepped Obsidian Monolith Canyon Formation */}
      <group ref={leftCanyonRef}>
        {/* Inner Tower Monolith (closest to canyon light gap) */}
        <mesh position={[-1.4, 0.8, -1.2]}>
          <boxGeometry args={[1.1, 5.2, 1.8]} />
          <meshStandardMaterial
            color="#07090D"
            roughness={0.45}
            metalness={0.55}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.1, 5.2, 1.8)]} />
            <lineBasicMaterial color="#FF7A32" opacity={0.85} transparent />
          </lineSegments>
        </mesh>

        {/* Stepped Mid Monolith */}
        <mesh position={[-2.3, 0.3, -0.6]}>
          <boxGeometry args={[1.3, 4.2, 2.0]} />
          <meshStandardMaterial
            color="#0B131F"
            roughness={0.6}
            metalness={0.4}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.3, 4.2, 2.0)]} />
            <lineBasicMaterial color="#4C8DFF" opacity={0.65} transparent />
          </lineSegments>
        </mesh>

        {/* Outer Flanking Monolith */}
        <mesh position={[-3.4, -0.1, 0.2]}>
          <boxGeometry args={[1.6, 3.4, 2.4]} />
          <meshStandardMaterial
            color="#102C4C"
            roughness={0.7}
            metalness={0.3}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.6, 3.4, 2.4)]} />
            <lineBasicMaterial color="#4C8DFF" opacity={0.4} transparent />
          </lineSegments>
        </mesh>

        {/* Background Silhouette Slab */}
        <mesh position={[-2.8, 1.6, -3.2]}>
          <boxGeometry args={[2.0, 6.8, 1.5]} />
          <meshStandardMaterial
            color="#05080E"
            roughness={0.8}
            metalness={0.2}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(2.0, 6.8, 1.5)]} />
            <lineBasicMaterial color="#80B5FF" opacity={0.35} transparent />
          </lineSegments>
        </mesh>
      </group>

      {/* 3. Right Stepped Obsidian Monolith Canyon Formation */}
      <group ref={rightCanyonRef}>
        {/* Inner Tower Monolith (closest to canyon light gap) */}
        <mesh position={[1.4, 0.95, -1.1]}>
          <boxGeometry args={[1.1, 5.5, 1.8]} />
          <meshStandardMaterial
            color="#07090D"
            roughness={0.45}
            metalness={0.55}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.1, 5.5, 1.8)]} />
            <lineBasicMaterial color="#FF7A32" opacity={0.85} transparent />
          </lineSegments>
        </mesh>

        {/* Stepped Mid Monolith */}
        <mesh position={[2.3, 0.45, -0.4]}>
          <boxGeometry args={[1.3, 4.4, 2.2]} />
          <meshStandardMaterial
            color="#0B131F"
            roughness={0.6}
            metalness={0.4}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.3, 4.4, 2.2)]} />
            <lineBasicMaterial color="#4C8DFF" opacity={0.65} transparent />
          </lineSegments>
        </mesh>

        {/* Outer Flanking Monolith */}
        <mesh position={[3.5, 0.0, 0.3]}>
          <boxGeometry args={[1.7, 3.6, 2.5]} />
          <meshStandardMaterial
            color="#102C4C"
            roughness={0.7}
            metalness={0.3}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.7, 3.6, 2.5)]} />
            <lineBasicMaterial color="#4C8DFF" opacity={0.4} transparent />
          </lineSegments>
        </mesh>

        {/* Background Silhouette Slab */}
        <mesh position={[2.9, 1.8, -3.0]}>
          <boxGeometry args={[2.0, 7.0, 1.5]} />
          <meshStandardMaterial
            color="#05080E"
            roughness={0.8}
            metalness={0.2}
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(2.0, 7.0, 1.5)]} />
            <lineBasicMaterial color="#80B5FF" opacity={0.35} transparent />
          </lineSegments>
        </mesh>
      </group>

      {/* 4. Radiant Sunrise Core at Horizon Threshold */}
      <mesh ref={lightCoreRef} position={[0, 0.35, -5.8]}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#FF7A32" />
      </mesh>

      {/* Volumetric Aurora / Light Shaft Fans Emanating Through Gap */}
      <mesh position={[0, 0.5, -4.8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.8, 7.5]} />
        <meshBasicMaterial
          color="#FF9955"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.5, -4.5]} rotation={[0, 0, Math.PI / 16]}>
        <planeGeometry args={[2.4, 8.0]} />
        <meshBasicMaterial
          color="#FF7A32"
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.5, -4.5]} rotation={[0, 0, -Math.PI / 16]}>
        <planeGeometry args={[2.4, 8.0]} />
        <meshBasicMaterial
          color="#FF7A32"
          transparent
          opacity={0.24}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmospheric Mist Points */}
      <points ref={mistPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#FFB380"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export const MonolithThresholdScene: React.FC = () => {
  const { isReduced, isDocumentVisible } = useMotionPreference();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <SceneBoundary
      fallback={
        /* High-Impact Multi-Layer Silhouette SVG Poster Fallback */
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#07090D] overflow-hidden select-none pointer-events-none">
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full opacity-90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="horizonGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#07090D" />
                <stop offset="48%" stopColor="#102C4C" stopOpacity="0.4" />
                <stop offset="55%" stopColor="#FF7A32" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#07090D" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="sunBurst" cx="50%" cy="52%" r="40%">
                <stop offset="0%" stopColor="#FF9955" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#FF7A32" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#102C4C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#07090D" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="monolithLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0B131F" />
                <stop offset="90%" stopColor="#07090D" />
                <stop offset="100%" stopColor="#FF7A32" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="monolithRight" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0B131F" />
                <stop offset="90%" stopColor="#07090D" />
                <stop offset="100%" stopColor="#FF7A32" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Dark Sky Canvas with Horizon Glow */}
            <rect width="1440" height="900" fill="#07090D" />
            <rect y="200" width="1440" height="500" fill="url(#horizonGlow)" />
            <circle cx="720" cy="460" r="280" fill="url(#sunBurst)" />

            {/* Central Vertical Amber Light Column */}
            <polygon points="695,0 745,0 760,900 680,900" fill="#FF7A32" opacity="0.28" />

            {/* Water Reflection Lines */}
            <line x1="300" y1="520" x2="1140" y2="520" stroke="#FF7A32" strokeWidth="2" opacity="0.4" />
            <line x1="420" y1="550" x2="1020" y2="550" stroke="#FF7A32" strokeWidth="1.5" opacity="0.3" />
            <line x1="500" y1="590" x2="940" y2="590" stroke="#4C8DFF" strokeWidth="1" opacity="0.25" />
            <line x1="580" y1="640" x2="860" y2="640" stroke="#4C8DFF" strokeWidth="1" opacity="0.15" />

            {/* Towering Left Monolith Slabs */}
            <polygon points="0,0 480,120 480,510 0,550" fill="url(#monolithLeft)" stroke="#4C8DFF" strokeWidth="1.5" strokeOpacity="0.5" />
            <polygon points="480,120 540,160 540,500 480,510" fill="#07090D" stroke="#FF7A32" strokeWidth="2.5" />
            <polygon points="540,240 600,280 600,485 540,500" fill="#07090D" stroke="#FF7A32" strokeWidth="2.5" />

            {/* Towering Right Monolith Slabs */}
            <polygon points="1440,0 960,120 960,510 1440,550" fill="url(#monolithRight)" stroke="#4C8DFF" strokeWidth="1.5" strokeOpacity="0.5" />
            <polygon points="960,120 900,160 900,500 960,510" fill="#07090D" stroke="#FF7A32" strokeWidth="2.5" />
            <polygon points="900,240 840,280 840,485 900,500" fill="#07090D" stroke="#FF7A32" strokeWidth="2.5" />

            {/* Bottom Horizon Ground Base */}
            <rect y="490" width="1440" height="410" fill="#07090D" opacity="0.92" />
          </svg>
        </div>
      }
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none sm:pointer-events-auto"
        aria-hidden="true"
      >
        {isDocumentVisible && (
          <Canvas
            camera={{ position: [0, 0.2, 5.8], fov: 46 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            className="!w-full !h-full"
          >
            <ambientLight intensity={0.5} />
            {/* Sunrise Core Directional Light */}
            <directionalLight position={[0, 1.5, -5]} intensity={2.6} color="#FF8C42" />
            {/* Cool Structural Blue Edge Rim Light */}
            <directionalLight position={[-6, 4, 3]} intensity={1.1} color="#4C8DFF" />
            <directionalLight position={[6, 4, 3]} intensity={1.1} color="#4C8DFF" />
            <Suspense fallback={null}>
              <MonolithSceneContent
                isReduced={isReduced}
                mousePos={mousePos}
                scrollProgress={scrollProgress}
              />
            </Suspense>
          </Canvas>
        )}
      </div>
    </SceneBoundary>
  );
};

export default MonolithThresholdScene;

