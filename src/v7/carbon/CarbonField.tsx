import React, { useEffect, useRef } from 'react';
import { register } from '../runtime/scheduler';
import { getPointer, subscribePointer } from '../runtime/pointer';
import { useQualityTier } from '../runtime/tier';
import { readField, invalidateLayout, onLayoutChange, KIND_ID } from '../materials/field';
import { VERT, FRAG, MAX_BANDS } from './shader';

/**
 * One fixed, full-viewport WebGL2 canvas behind all content. Draws both materials and
 * every seam mask. Redraws only when scroll, pointer or layout changes; never loops.
 *
 * While it is not live (static tier, no WebGL2, before the probe), `html` lacks the
 * `carbon-live` class and the CSS fallback in src/v7/materials/materials.css paints
 * the materials instead.
 */
export const DPR_CAP = 1.5;
export const LIGHT_BASE = Math.PI / 8;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error('createShader failed');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader compile failed');
  return s;
}

const setLive = (live: boolean) => document.documentElement.classList.toggle('carbon-live', live);

export const CarbonField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tier = useQualityTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || (tier !== 'full' && tier !== 'lite')) {
      setLive(false);
      return;
    }
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'default' });
    if (!gl) {
      setLive(false);
      return;
    }

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link failed');
    } catch (err) {
      console.warn('[CarbonField] shader unavailable, using CSS materials', err);
      setLive(false);
      return;
    }
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, 'uRes'),
      dpr: gl.getUniformLocation(program, 'uDpr'),
      scroll: gl.getUniformLocation(program, 'uScrollY'),
      light: gl.getUniformLocation(program, 'uLight'),
      glint: gl.getUniformLocation(program, 'uGlint'),
      count: gl.getUniformLocation(program, 'uCount'),
      band: gl.getUniformLocation(program, 'uBand'),
      mat: gl.getUniformLocation(program, 'uMat'),
    };
    const bandData = new Float32Array(MAX_BANDS * 4);
    const matData = new Float32Array(MAX_BANDS * 2);
    const dprCap = tier === 'full' ? DPR_CAP : 1;
    let dpr = 1;
    let lost = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let first = true;
    const draw = () => {
      if (lost) return false;
      const f = readField();
      const ptr = getPointer();
      const n = Math.min(f.bands.length, MAX_BANDS);
      bandData.fill(0);
      matData.fill(0);
      for (let i = 0; i < n; i++) {
        const b = f.bands[i];
        bandData.set([b.top, b.bottom, KIND_ID[b.kind], b.p], i * 4);
        matData.set([b.a === 'light' ? 1 : 0, b.b === 'light' ? 1 : 0], i * 2);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.dpr, canvas.width / Math.max(1, canvas.clientWidth));
      gl.uniform1f(u.scroll, f.scrollY);
      gl.uniform1f(u.light, LIGHT_BASE + 0.5 * Math.PI * f.lightProgress + 0.2 * ptr.nx);
      gl.uniform1f(u.glint, tier === 'full' ? 1 : 0);
      gl.uniform1i(u.count, n);
      gl.uniform4fv(u.band, bandData);
      gl.uniform2fv(u.mat, matData);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) {
        first = false;
        setLive(true);
      }
      return false;
    };

    const task = register(draw, { budgeted: false, wakeOnVisible: false });
    const wake = () => task.wake();
    const onResize = () => {
      resize();
      invalidateLayout();
      wake();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      setLive(false);
    };

    resize();
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    window.addEventListener('scroll', wake, { passive: true });
    const offPointer = subscribePointer(wake);
    const offLayout = onLayoutChange(wake);
    canvas.addEventListener('webglcontextlost', onLost);
    wake();

    return () => {
      task.dispose();
      ro.disconnect();
      window.removeEventListener('scroll', wake);
      offPointer();
      offLayout();
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      setLive(false);
    };
  }, [tier]);

  return (
    <div data-carbon-field="" aria-hidden="true" className="fixed inset-x-0 top-0 h-[100lvh] -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default CarbonField;
