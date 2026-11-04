import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneBoundary } from './SceneBoundary';
import { useMotionPreference } from './MotionPreference';
import { InteractivePillGroup } from './ui/ReactBitsControls';

interface AssemblyProps {
  exploded: boolean;
  isReduced: boolean;
  mousePos: { x: number; y: number };
}

function DimensionalSlabAssembly({ exploded, isReduced, mousePos }: AssemblyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseSlabRef = useRef<THREE.Mesh>(null);
  const centerMonolithRef = useRef<THREE.Mesh>(null);
  const upperSlabRef = useRef<THREE.Mesh>(null);
  const forwardWedgeRef = useRef<THREE.Mesh>(null);

  // Separation targets based on exploded state
  const targetBaseZ = exploded ? -0.85 : -0.4;
  const targetCenterZ = exploded ? 0.2 : 0.05;
  const targetUpperZ = exploded ? 0.95 : 0.45;
  const targetUpperY = exploded ? 0.55 : 0.28;
  const targetForwardZ = exploded ? 1.4 : 0.85;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!isReduced) {
      // 6° tilt cap (~0.104 rad)
      const targetRotX = mousePos.y * 0.104;
      const targetRotY = mousePos.x * 0.104;
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4.5, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4.5, delta);
    } else {
      groupRef.current.rotation.x = 0.04;
      groupRef.current.rotation.y = -0.06;
    }

    if (baseSlabRef.current) {
      baseSlabRef.current.position.z = THREE.MathUtils.damp(baseSlabRef.current.position.z, targetBaseZ, 4, delta);
    }
    if (centerMonolithRef.current) {
      centerMonolithRef.current.position.z = THREE.MathUtils.damp(centerMonolithRef.current.position.z, targetCenterZ, 4, delta);
    }
    if (upperSlabRef.current) {
      upperSlabRef.current.position.z = THREE.MathUtils.damp(upperSlabRef.current.position.z, targetUpperZ, 4, delta);
      upperSlabRef.current.position.y = THREE.MathUtils.damp(upperSlabRef.current.position.y, targetUpperY, 4, delta);
    }
    if (forwardWedgeRef.current) {
      forwardWedgeRef.current.position.z = THREE.MathUtils.damp(forwardWedgeRef.current.position.z, targetForwardZ, 4, delta);
    }
  });

  // Sculptural continuous orange conduit physically weaving through the slabs
  const orangeRibbonCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, -0.7, -0.5),
      new THREE.Vector3(-1.1, -0.35, -0.1),
      new THREE.Vector3(-0.1, -0.15, 0.2),
      new THREE.Vector3(0.3, 0.25, 0.5),   // Penetrates through center
      new THREE.Vector3(0.0, 0.45, 0.75),  // Wraps over upper slab
      new THREE.Vector3(0.9, 0.5, 0.95),
      new THREE.Vector3(2.5, 0.85, 1.4),   // Dramatic breakout exiting frame
    ]);
  }, []);

  return (
    <group ref={groupRef}>
      {/* 1. Deep Base Foundation Slab (#0E1623 with extruded thickness) */}
      <mesh ref={baseSlabRef} position={[-0.2, -0.2, -0.4]}>
        <boxGeometry args={[2.8, 1.7, 0.22]} />
        <meshStandardMaterial
          color="#0E1623"
          roughness={0.7}
          metalness={0.25}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.8, 1.7, 0.22)]} />
          <lineBasicMaterial color="#4C8DFF" opacity={0.3} transparent />
        </lineSegments>
      </mesh>

      {/* 2. Interlocking Center Monolith (#102C4C with beveled edges) */}
      <mesh ref={centerMonolithRef} position={[0.25, 0.05, 0.05]}>
        <boxGeometry args={[2.0, 1.35, 0.28]} />
        <meshStandardMaterial
          color="#102C4C"
          roughness={0.4}
          metalness={0.45}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.0, 1.35, 0.28)]} />
          <lineBasicMaterial color="#80B5FF" opacity={0.65} transparent />
        </lineSegments>
      </mesh>

      {/* 3. Floating Upper Structural Slab (#1A3A5F) */}
      <mesh ref={upperSlabRef} position={[-0.35, 0.28, 0.45]}>
        <boxGeometry args={[1.6, 0.95, 0.18]} />
        <meshStandardMaterial
          color="#16385C"
          roughness={0.5}
          metalness={0.35}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.6, 0.95, 0.18)]} />
          <lineBasicMaterial color="#4C8DFF" opacity={0.5} transparent />
        </lineSegments>
      </mesh>

      {/* 4. Forward Anchor Slab */}
      <mesh ref={forwardWedgeRef} position={[0.55, -0.35, 0.85]}>
        <boxGeometry args={[1.2, 0.65, 0.14]} />
        <meshStandardMaterial color="#0E1D30" roughness={0.6} metalness={0.4} />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.2, 0.65, 0.14)]} />
          <lineBasicMaterial color="#80B5FF" opacity={0.5} transparent />
        </lineSegments>
      </mesh>

      {/* Substantial Continuous Sculptural Orange Ribbon (#FF7A32) */}
      <mesh>
        <tubeGeometry args={[orangeRibbonCurve, 100, 0.052, 16, false]} />
        <meshStandardMaterial
          color="#FF7A32"
          emissive="#FF7A32"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>

      {/* Contact Nodes */}
      <mesh position={[0.3, 0.25, 0.5]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#FF7A32" emissive="#FF7A32" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.1, -0.15, 0.2]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#80B5FF" emissive="#4C8DFF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export const HeroWorkbenchScene: React.FC = () => {
  const { isReduced, isDocumentVisible } = useMotionPreference();
  const [exploded, setExploded] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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
        /* High-Contrast Dimensional Poster Fallback with Slabs & Extrusions */
        <div className="w-full h-full min-h-[340px] sm:min-h-[420px] flex items-center justify-center p-4 relative select-none">
          <svg viewBox="0 0 360 240" fill="none" className="w-full max-w-[420px] drop-shadow-2xl">
            <defs>
              <linearGradient id="slabGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1A3A5F" />
                <stop offset="100%" stopColor="#0E1623" />
              </linearGradient>
              <linearGradient id="slabGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#25558A" />
                <stop offset="100%" stopColor="#102C4C" />
              </linearGradient>
              <linearGradient id="ribbonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6A1A" />
                <stop offset="100%" stopColor="#FF9955" />
              </linearGradient>
            </defs>
            {/* Base Slab */}
            <rect x="25" y="55" width="220" height="130" rx="6" fill="url(#slabGrad1)" stroke="#4C8DFF" strokeWidth="1.5" strokeOpacity="0.4" />
            <polygon points="25,55 45,35 265,35 245,55" fill="#162D4A" opacity="0.8" />
            <polygon points="245,55 265,35 265,165 245,185" fill="#0A121D" opacity="0.9" />

            {/* Center Monolith Slab */}
            <rect x="75" y="70" width="190" height="115" rx="6" fill="url(#slabGrad2)" stroke="#80B5FF" strokeWidth="2" strokeOpacity="0.7" />
            <polygon points="75,70 95,50 285,50 265,70" fill="#2E629E" opacity="0.8" />
            <polygon points="265,70 285,50 285,165 265,185" fill="#0D233D" opacity="0.9" />

            {/* Weaving Sculptural Orange Conduit */}
            <path
              d="M 10 170 Q 70 120 135 125 T 235 90 T 350 45"
              stroke="url(#ribbonGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              className="drop-shadow-lg"
            />
            <circle cx="135" cy="125" r="7" fill="#FF7A32" />
            <circle cx="235" cy="90" r="7" fill="#FF7A32" />
          </svg>
        </div>
      }
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] relative bg-transparent overflow-visible"
      >
        {/* Subtle Accessible State Toggle */}
        <div className="absolute top-1 right-1 z-20">
          <InteractivePillGroup
            size="sm"
            items={[
              { key: 'assembled', label: 'Assembled' },
              { key: 'exploded', label: 'Exploded' },
            ]}
            activeKey={exploded ? 'exploded' : 'assembled'}
            onChange={(key) => setExploded(key === 'exploded')}
            layoutId="hero-3d-exploded-toggle"
          />
        </div>

        {/* 3D Canvas Render */}
        {isDocumentVisible && (
          <Canvas
            camera={{ position: [0, 0, 3.6], fov: 44 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
            className="!w-full !h-full"
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[6, 7, 5]} intensity={1.6} />
            <directionalLight position={[-5, -4, 3]} intensity={0.7} color="#4C8DFF" />
            <directionalLight position={[0, -5, -2]} intensity={0.3} color="#FF7A32" />
            <Suspense fallback={null}>
              <DimensionalSlabAssembly exploded={exploded} isReduced={isReduced} mousePos={mousePos} />
            </Suspense>
          </Canvas>
        )}
      </div>
    </SceneBoundary>
  );
};
