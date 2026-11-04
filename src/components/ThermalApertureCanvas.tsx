import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMotionPreference } from './MotionPreference';

// ---------------------------------------------------------------------------
// 1. Background Domain-Warped Thermal Silk Shroud (85/12/3 Architectural Rift)
// ---------------------------------------------------------------------------
const VS_SHROUD = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FS_SHROUD = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uReducedMotion;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.58;
  mat2 rot = mat2(0.87758256, 0.47942554, -0.47942554, 0.87758256);
  for (int i = 0; i < 3; ++i) {
    v += a * snoise(p);
    p = rot * p * 1.55 + vec2(7.3, 2.9);
    a *= 0.45;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = uv * vec2(aspect, 1.0);
  float t = (uReducedMotion > 0.5) ? 1.2 : uTime * 0.045;

  // Domain-Warped Silk Shroud along -22° Diagonal Vector
  vec2 q = vec2(fbm(p * 0.75 + vec2(0.0, t * 0.07)), fbm(p * 0.75 + vec2(3.1, -t * 0.05)));
  vec2 r = vec2(fbm(p + 1.15 * q + vec2(1.4, t * 0.05)), fbm(p + 1.15 * q + vec2(4.2, -t * 0.04)));
  float silk = fbm(p + 1.25 * r);

  // 85% Deep Obsidian (#07090D) & Midnight Cobalt (#0C1729 / #102038)
  vec3 colObsidian = vec3(0.027, 0.035, 0.051);
  vec3 colMidnight = vec3(0.047, 0.090, 0.161);
  vec3 colPrussian = vec3(0.063, 0.125, 0.220);
  vec3 shroud = mix(colObsidian, colMidnight, smoothstep(-0.35, 0.85, silk));
  shroud = mix(shroud, colPrussian, smoothstep(0.15, 1.1, uv.x * 0.5 + uv.y * 0.65));

  // Precise -22° Diagonal Canyon Aperture
  vec2 canyonOrigin = vec2(0.12, 0.05);
  vec2 canyonDir = normalize(vec2(1.0, 0.65));
  vec2 toPoint = uv - canyonOrigin;
  vec2 perpDir = vec2(-canyonDir.y, canyonDir.x);
  float distCanyon = dot(toPoint, perpDir);

  float canyonWidth = 0.08 + uScroll * 0.04;
  float rimDist = abs(abs(distCanyon) - canyonWidth);
  float thermalRim = smoothstep(0.07, 0.0, rimDist);

  // 12% Deep Carmine Shadow Folds (#1E1633 to #5C191B)
  vec3 colCrease = mix(vec3(0.118, 0.086, 0.200), vec3(0.361, 0.098, 0.106), clamp(silk, 0.0, 1.0));
  // 3% Incandescent Core (#FF6B2B to #FFE9AE)
  vec3 colVermilion = vec3(0.784, 0.196, 0.118);
  vec3 colSlipstream = vec3(1.000, 0.420, 0.169);

  vec3 finalColor = mix(shroud, colCrease, smoothstep(0.12, 0.0, abs(distCanyon) - canyonWidth * 1.5) * 0.5);
  finalColor += mix(colVermilion, colSlipstream, 0.7) * thermalRim * 0.85;

  gl_FragColor = vec4(finalColor, 0.95);
}
`;

const SilkShroudBackground: React.FC<{ scrollProgress: number; isReduced: boolean }> = ({
  scrollProgress,
  isReduced,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      powerPreference: 'high-performance',
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = createShader(gl.VERTEX_SHADER, VS_SHROUD);
    const fs = createShader(gl.FRAGMENT_SHADER, FS_SHROUD);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uScroll = gl.getUniformLocation(program, 'uScroll');
    const uReducedMotion = gl.getUniformLocation(program, 'uReducedMotion');

    let animId: number;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = (now: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }
      const elapsed = (now - startTime) * 0.001;
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uScroll, scrollProgress);
      gl.uniform1f(uReducedMotion, isReduced ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!isReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
    };
  }, [isReduced, scrollProgress, isVisible]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />;
};

// ---------------------------------------------------------------------------
// 2. The Kinetic Helical Louvre Array (160 Instanced Machined Titanium Blades)
// ---------------------------------------------------------------------------
const TOTAL_BLADES = 160;

interface LamellarArrayProps {
  scrollProgress: number;
  isReduced: boolean;
  pointer: { x: number; y: number };
}

const LamellarHelicalArray: React.FC<LamellarArrayProps> = ({ scrollProgress, isReduced, pointer }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ribbonMeshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Reusable objects for matrix computation to maintain 60 FPS without garbage collection
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const tempTangent = useMemo(() => new THREE.Vector3(), []);
  const nextPos = useMemo(() => new THREE.Vector3(), []);

  // Material for the Titanium & Obsidian Lamellar Blades with Fresnel grazing highlight
  const bladeMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#091324'),
      emissive: new THREE.Color('#102444'),
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });
  }, []);

  // Center Incandescent Tungsten Light Ribbon geometry & curve
  const { ribbonCurve, ribbonGeo } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const samples = 80;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const x = (t - 0.5) * 11.5;
      const y = (t - 0.5) * 6.2 + Math.sin(t * Math.PI * 2.0) * 0.45;
      const z = Math.cos(t * Math.PI * 1.5) * 1.2;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 90, 0.045, 8, false);
    return { ribbonCurve: curve, ribbonGeo: geo };
  }, []);

  // Custom Shader Material for the incandescent core ribbon
  const ribbonMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorCore: { value: new THREE.Color('#FFE9AE') },
        uColorBody: { value: new THREE.Color('#FF6B2B') },
        uColorEdge: { value: new THREE.Color('#C8321E') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorCore;
        uniform vec3 uColorBody;
        uniform vec3 uColorEdge;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.8);
          float pulse = 0.85 + 0.15 * sin(vUv.x * 24.0 - uTime * 4.0);
          vec3 col = mix(uColorCore, uColorBody, smoothstep(0.1, 0.8, fresnel));
          col = mix(col, uColorEdge, smoothstep(0.7, 1.0, fresnel));
          gl_FragColor = vec4(col * pulse, 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = isReduced ? 0.5 : state.clock.getElapsedTime();
    ribbonMaterial.uniforms.uTime.value = time;

    // Move traveling core light along the ribbon
    if (lightRef.current) {
      const lightT = (time * 0.18) % 1.0;
      const lightP = ribbonCurve.getPointAt(lightT);
      lightRef.current.position.copy(lightP);
    }

    // Mathematical Positioning & Helical Louvre Twist for 160 Blades
    for (let i = 0; i < TOTAL_BLADES; i++) {
      const t = i / (TOTAL_BLADES - 1.0);

      // 3D S-Curve Trajectory
      const x = (t - 0.5) * 11.5;
      const y = (t - 0.5) * 6.2 + Math.sin(t * Math.PI * 2.0 + time * 0.4) * 0.45;
      const z = Math.cos(t * Math.PI * 1.5) * 1.2;
      tempPos.set(x, y, z);

      // Compute local tangent along the trajectory
      const nextT = Math.min(1.0, t + 0.01);
      const nx = (nextT - 0.5) * 11.5;
      const ny = (nextT - 0.5) * 6.2 + Math.sin(nextT * Math.PI * 2.0 + time * 0.4) * 0.45;
      const nz = Math.cos(nextT * Math.PI * 1.5) * 1.2;
      nextPos.set(nx, ny, nz);
      tempTangent.subVectors(nextPos, tempPos).normalize();

      // Helical DNA-to-Airfoil phase angle
      let theta = t * Math.PI * 4.5 - time * 0.55 + scrollProgress * Math.PI;

      // Pointer interaction: Gaussian ripple feathering the blades open
      const pWorldX = (pointer.x * 5.0);
      const pWorldY = (pointer.y * 3.0);
      const distToPointer = Math.hypot(x - pWorldX, y - pWorldY);
      const pointerRipple = Math.exp(-distToPointer * 1.8) * 0.65;
      theta += pointerRipple;

      dummy.position.copy(tempPos);
      dummy.rotation.set(0, 0, 0);

      // Align blade along trajectory tangent then rotate by helical angle
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tempTangent);
      dummy.rotateX(theta);

      // Subtle dynamic taper along the ends of the sculpture
      const scaleEdge = Math.sin(t * Math.PI) * 0.35 + 0.75;
      dummy.scale.set(1.0, 1.0, scaleEdge);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0.2, -0.2, 0]}>
      {/* 160 Machined Titanium-and-Obsidian Louvre Blades */}
      <instancedMesh
        ref={meshRef}
        args={[undefined as any, undefined as any, TOTAL_BLADES]}
        material={bladeMaterial}
      >
        <boxGeometry args={[1.8, 0.018, 0.14]} />
      </instancedMesh>

      {/* Incandescent Core Tungsten Light Ribbon Threaded Through Blades */}
      <mesh ref={ribbonMeshRef} geometry={ribbonGeo} material={ribbonMaterial} />

      {/* Dynamic Traveling Incandescent Core Point Light */}
      <pointLight ref={lightRef} color="#FF7A32" intensity={4.5} distance={4.5} decay={2} />
      <pointLight position={[-3.5, -1.8, 1.0]} color="#FFB86C" intensity={2.5} distance={3.5} decay={2} />
      <pointLight position={[3.5, 2.2, 0.5]} color="#70A5FF" intensity={2.0} distance={4.0} decay={2} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// 3. Main Scene Harness with Studio Three.js Rig
// ---------------------------------------------------------------------------
const Studio3DScene: React.FC<{ scrollProgress: number; isReduced: boolean }> = ({ scrollProgress, isReduced }) => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointer({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[-4, 6, 5]} intensity={1.2} color="#F4EFE6" />
      <directionalLight position={[5, -4, -3]} intensity={0.8} color="#162B4C" />

      <LamellarHelicalArray scrollProgress={scrollProgress} isReduced={isReduced} pointer={pointer} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 4. Exported Top-Level Canvas Component
// ---------------------------------------------------------------------------
export const ThermalApertureCanvas: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 1.5)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 2D Thermal FBM Silk Shroud Backdrop */}
      <SilkShroudBackground scrollProgress={scrollProgress} isReduced={isReduced} />

      {/* True 3D Studio-Grade WebGL Canvas with Lamellar Louvre Array */}
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 7.8], fov: 42 }}
          dpr={[1, 1.25]}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: true,
            depth: true,
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Suspense fallback={null}>
            <Studio3DScene scrollProgress={scrollProgress} isReduced={isReduced} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export const ThermalApertureFallback: React.FC = () => (
  <div
    className="absolute inset-0 w-full h-full bg-[#07090D] pointer-events-none"
    style={{
      backgroundImage: 'radial-gradient(ellipse at 80% 20%, rgba(255, 107, 43, 0.12) 0%, transparent 65%)',
    }}
  />
);

export default ThermalApertureCanvas;
