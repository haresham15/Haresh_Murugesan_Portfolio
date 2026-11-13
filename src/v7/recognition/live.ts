/**
 * The one live shader: lights the seated medallion from its height map. One WebGL2
 * context, one program, one texture per award (uploaded once). Throws if WebGL2 or the
 * shader is unavailable; the caller falls back to the cached bitmaps.
 */
import { FRAG, VERT } from './shader';
import { normalScale, sobelStep, type Light } from './shade';
import type { HeightMap } from './heightmap';

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error('createShader failed');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'compile failed');
  return s;
}

export interface LiveFrame {
  index: number;
  light: Light;
  boost: number;
  enamel: readonly [number, number, number];
}

export class MedalLight {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private buf: WebGLBuffer | null;
  private textures = new Map<number, { tex: WebGLTexture; res: number }>();
  private u: Record<string, WebGLUniformLocation | null>;
  lost = false;

  constructor(private canvas: HTMLCanvasElement, onLost: () => void) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'default',
    });
    if (!gl) throw new Error('no webgl2');
    this.gl = gl;
    const program = gl.createProgram();
    if (!program) throw new Error('createProgram failed');
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link failed');
    this.program = program;
    gl.useProgram(program);
    this.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    this.u = Object.fromEntries(
      ['uTex', 'uRes', 'uStep', 'uK', 'uLight', 'uAz', 'uBoost', 'uEnamel'].map((n) => [n, gl.getUniformLocation(program, n)]),
    );
    gl.uniform1i(this.u.uTex, 0);
    gl.clearColor(0, 0, 0, 0);
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.lost = true;
      onLost();
    });
  }

  upload(index: number, map: HeightMap) {
    if (this.lost || this.textures.has(index)) return;
    const gl = this.gl;
    const tex = gl.createTexture();
    if (!tex) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, map.res, map.res, 0, gl.RGBA, gl.UNSIGNED_BYTE, map.data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.textures.set(index, { tex, res: map.res });
  }

  has(index: number) {
    return this.textures.has(index);
  }

  /** Size the drawing buffer to `css` px at `dpr`. */
  resize(css: number, dpr: number) {
    const px = Math.max(1, Math.round(css * dpr));
    if (this.canvas.width !== px || this.canvas.height !== px) {
      this.canvas.width = px;
      this.canvas.height = px;
    }
  }

  draw(f: LiveFrame): boolean {
    if (this.lost) return false;
    const t = this.textures.get(f.index);
    if (!t) return false;
    const gl = this.gl;
    const w = this.canvas.width;
    gl.viewport(0, 0, w, w);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    const d = sobelStep(t.res);
    gl.uniform2f(this.u.uRes, w, w);
    gl.uniform1f(this.u.uStep, d / t.res);
    gl.uniform1f(this.u.uK, normalScale(t.res, d));
    gl.uniform3f(this.u.uLight, f.light.x, f.light.y, f.light.z);
    gl.uniform3f(this.u.uAz, f.light.ax, f.light.ay, f.light.planar);
    gl.uniform1f(this.u.uBoost, f.boost);
    gl.uniform3f(this.u.uEnamel, f.enamel[0], f.enamel[1], f.enamel[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  }

  dispose() {
    const gl = this.gl;
    for (const { tex } of this.textures.values()) gl.deleteTexture(tex);
    this.textures.clear();
    gl.deleteBuffer(this.buf);
    // No loseContext(): a remount (React strict mode) gets this same context back.
    gl.deleteProgram(this.program);
  }
}
