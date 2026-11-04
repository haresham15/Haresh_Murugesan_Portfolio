import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore, HeroLayer } from '@/store/usePortfolioStore';
import { usePerformanceTier } from '@/scene/usePerformanceTier';

// Internal Layer 1: AI / Computer Vision Neural Attention Lattice
function NeuralLatticeLayer({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#D8B4FE');
    const c2 = new THREE.Color('#A855F7');

    for (let i = 0; i < count; i++) {
      // Clustered in top third of cube [y: 0.3 to 1.1]
      pos[i * 3] = (Math.random() - 0.5) * 1.6;
      pos[i * 3 + 1] = 0.3 + Math.random() * 0.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.6;

      const mixed = c1.clone().lerp(c2, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * (active ? 0.4 : 0.1);
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={active ? 0.95 : 0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Saliency Core Ring */}
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.32, 32]} />
        <meshBasicMaterial
          color="#D8B4FE"
          transparent
          opacity={active ? 0.8 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Internal Layer 2: Software Systems Concurrent Bus & Interlocking Plates
function SystemsBusLayer({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * (active ? 0.3 : 0.08);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Central Interlocking Compute Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.06, 1.5]} />
        <meshStandardMaterial
          color="#0D1118"
          roughness={0.2}
          metalness={0.8}
          wireframe={!active}
        />
      </mesh>

      {/* Glowing High-Concurrency Bus Traces */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 1.3]} />
        <meshBasicMaterial
          color="#7DD3FC"
          wireframe
          transparent
          opacity={active ? 0.85 : 0.2}
        />
      </mesh>

      {/* Concurrent Worker Micro-Nodes */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.12, 0.4 * (i - 1)]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial
            color="#7DD3FC"
            emissive="#7DD3FC"
            emissiveIntensity={active ? 0.6 : 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Internal Layer 3: Research & Geospatial Output Verification Grid
function ResearchManifoldLayer({ active }: { active: boolean }) {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Base Foundation Manifold Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.7, 8, 8]} />
        <meshStandardMaterial
          color="#141A23"
          wireframe
          roughness={0.5}
        />
      </mesh>

      {/* Geospatial Sector Bounds */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.52, 24]} />
        <meshBasicMaterial
          color="#34D399"
          transparent
          opacity={active ? 0.9 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 43 Transit-Desert Node Pins */}
      {[-0.4, 0.3, -0.2].map((x, i) => (
        <mesh key={i} position={[x, 0.1, (i - 1) * 0.35]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
      ))}
    </group>
  );
}

// Signature Open-Frame Architectural Cube with Displaced Corner
function CubeSculpture({ activeLayer }: { activeLayer: HeroLayer }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0.3, y: 0.6 });

  // Mouse Parallax (Restrained to max 6 degrees = ~0.10 rad)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotation.current = {
        x: 0.3 + ny * 0.1,
        y: 0.6 + nx * 0.1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Smooth dampening towards target rotation
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * (delta * 4);
      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * (delta * 4);
    }
  });

  const isAimActive = activeLayer === 'all' || activeLayer === 'ai-ml';
  const isSysActive = activeLayer === 'all' || activeLayer === 'systems';
  const isResActive = activeLayer === 'all' || activeLayer === 'research';

  return (
    <group ref={groupRef}>
      {/* Outer Open-Frame Architectural Wireframe Beams */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.2, 2.2, 2.2)]} />
        <lineBasicMaterial
          color="#A6ADB8"
          transparent
          opacity={0.35}
          linewidth={1.5}
        />
      </lineSegments>

      {/* Displaced Corner Accent Frame */}
      <group position={[1.1, 1.1, 1.1]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#D8B4FE" />
        </mesh>
      </group>

      {/* The 3 Internal Engineering Layers */}
      <NeuralLatticeLayer active={isAimActive} />
      <SystemsBusLayer active={isSysActive} />
      <ResearchManifoldLayer active={isResActive} />

      {/* Downward Manifesto Signal Guide Beam */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.2, 8]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export const HeroSignalCube: React.FC = () => {
  const { activeHeroLayer, mode } = usePortfolioStore();
  const tier = usePerformanceTier();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || mode === 'recruiter' || tier.tier === 'static') {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[360px] sm:min-h-[420px] relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={tier.dpr}
        gl={{
          antialias: tier.tier === 'full',
          powerPreference: 'high-performance',
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 6, 4]} color="#7DD3FC" intensity={1.5} />
        <pointLight position={[-4, -3, -4]} color="#D8B4FE" intensity={1.2} />

        <CubeSculpture activeLayer={activeHeroLayer} />
      </Canvas>
    </div>
  );
};

export default HeroSignalCube;
