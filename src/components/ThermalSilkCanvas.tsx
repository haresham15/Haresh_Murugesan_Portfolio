import React, { useRef, useEffect, useState } from 'react';
import { useMotionPreference } from './MotionPreference';

// Vertex Shader for Full-Screen Quad
const VS_SOURCE = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Fragment Shader: 2-Level Domain-Warped Thermal Silk / Dune Wave + 5-Stop Color Ramp + 35mm Grain
const FS_SOURCE = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uReducedMotion;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
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
  float a = 0.65;
  mat2 rot = mat2(0.87758256, 0.47942554, -0.47942554, 0.87758256);
  for (int i = 0; i < 3; ++i) {
    v += a * snoise(p);
    p = rot * p * 1.45 + vec2(12.34, 5.67);
    a *= 0.38;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  // Broad, majestic spatial scale for cinematic silk dunes
  vec2 p = uv * vec2(0.85, 0.7);

  // Stately slow cinematic breathing
  float t = (uReducedMotion > 0.5) ? 1.6 : uTime * 0.055;

  // First warp layer (grand undulating silk dunes)
  vec2 q = vec2(
    fbm(p * 0.75 + vec2(0.0, 0.0) + t * 0.15),
    fbm(p * 0.75 + vec2(4.2, 2.3) - t * 0.12)
  );

  // Subtle damped pointer influence
  float mouseDist = length(uv - uMouse);
  q += (uv - uMouse) * exp(-mouseDist * 3.0) * 0.08;

  // Second warp layer (flowing silk creases)
  vec2 r = vec2(
    fbm(p + 1.05 * q + vec2(1.4, 3.2) + t * 0.1),
    fbm(p + 1.05 * q + vec2(5.1, 1.8) - t * 0.09)
  );

  // Cinematic field: diagonal sweep with luminous upper-right & central radiant horizon
  float diagonalGrad = smoothstep(0.0, 1.25, uv.x * 0.55 + uv.y * 0.65);
  float field = clamp(diagonalGrad + (fbm(p + 1.15 * r) - 0.5) * 0.48, 0.0, 1.0);

  // Soft specular crest highlight from finite difference normal
  float eps = 0.02;
  float f_dx = (fbm(p + vec2(eps, 0.0) + 1.15 * r) - fbm(p - vec2(eps, 0.0) + 1.15 * r)) / (2.0 * eps);
  float f_dy = (fbm(p + vec2(0.0, eps) + 1.15 * r) - fbm(p - vec2(0.0, eps) + 1.15 * r)) / (2.0 * eps);
  float crest = clamp(abs(f_dx * 0.5 + f_dy * 0.7), 0.0, 1.0);

  // Calibrated 5-Stop Color Ramp
  // Stop 1: Deep Trough Obsidian (#07090D) to Indigo (#12152E)
  vec3 c1_obsidian = vec3(7.0, 9.0, 13.0) / 255.0;
  vec3 c1_indigo   = vec3(18.0, 21.0, 46.0) / 255.0;

  // Stop 2: Midnight Crimson-Indigo Crease (#2B1838 to #7A1C1D)
  vec3 c2_crease   = vec3(43.0, 24.0, 56.0) / 255.0;
  vec3 c2_carmine  = vec3(122.0, 28.0, 29.0) / 255.0;

  // Stop 3: Core Vermilion & Terracotta Fold (#C8321E to #F05423)
  vec3 c3_terra    = vec3(200.0, 50.0, 30.0) / 255.0;
  vec3 c3_vermil   = vec3(240.0, 84.0, 35.0) / 255.0;

  // Stop 4: Incandescent Coral-Amber Crest (#FF7A32 to #FFA652)
  vec3 c4_amber    = vec3(255.0, 122.0, 50.0) / 255.0;
  vec3 c4_peach    = vec3(255.0, 166.0, 82.0) / 255.0;

  // Stop 5: Sunlit Golden-Cream Sky (#FFD685 to #FFE9AE)
  vec3 c5_gold     = vec3(255.0, 214.0, 133.0) / 255.0;
  vec3 c5_cream    = vec3(255.0, 233.0, 174.0) / 255.0;

  vec3 col;
  if (field < 0.18) {
    float f = smoothstep(0.0, 0.18, field);
    col = mix(c1_obsidian, c1_indigo, f);
  } else if (field < 0.38) {
    float f = smoothstep(0.18, 0.38, field);
    col = mix(c2_crease, c2_carmine, f);
  } else if (field < 0.62) {
    float f = smoothstep(0.38, 0.62, field);
    col = mix(c3_terra, c3_vermil, f);
  } else if (field < 0.82) {
    float f = smoothstep(0.62, 0.82, field);
    col = mix(c4_amber, c4_peach, f);
  } else {
    float f = smoothstep(0.82, 1.0, field);
    col = mix(c5_gold, c5_cream, f);
  }

  // Velvety warm rim highlight along central crests
  col += c4_peach * pow(crest, 2.2) * 0.22;

  // 35mm Analog Stipple Film Grain
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.055;

  // Bottom Page Transition (vertical fade across bottom 18% into #07090D canvas)
  float bottomFade = smoothstep(0.0, 0.18, uv.y);
  col = mix(c1_obsidian, col, bottomFade);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const ThermalSilkFallback: React.FC = () => (
  <div
    className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-[#07090D]"
    role="img"
    aria-label="Thermal Silk Canvas - Static Poster"
  >
    <div
      className="absolute inset-0 opacity-90"
      style={{
        background: `radial-gradient(ellipse at 85% 15%, #FFE9AE 0%, #FFD685 22%, #FFA652 40%, #F05423 60%, #7A1C1D 75%, #07090D 100%)`,
      }}
    />
    <div
      className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-[#07090D]/40 to-transparent"
    />
  </div>
);

export const ThermalSilkCanvas: React.FC = () => {
  const { isReduced } = useMotionPreference();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Mouse coordinates normalized [0, 1]
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const currentMouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight, // Invert Y for WebGL
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // IntersectionObserver to pause RAF when out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' }) ||
      canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });

    if (!gl) return;

    // Helper: compile shader
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full-screen Quad Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uReducedMotionLoc = gl.getUniformLocation(program, 'uReducedMotion');

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      if (!isVisible) return;

      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      // Smooth mouse lerp
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.04;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.04;

      gl.useProgram(program);

      if (uTimeLoc) gl.uniform1f(uTimeLoc, elapsed);
      if (uResolutionLoc) gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      if (uMouseLoc) gl.uniform2f(uMouseLoc, currentMouse.current.x, currentMouse.current.y);
      if (uReducedMotionLoc) gl.uniform1f(uReducedMotionLoc, isReduced ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [isVisible, isReduced]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ThermalSilkCanvas;

