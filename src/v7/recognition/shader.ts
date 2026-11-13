/**
 * Live medallion shader. Same model as shadeTexel in shade.ts: Sobel normals from the
 * height map, Blinn-Phong, and radial brushing cos(2(phi - phi_light))^24.
 */
import { AMBIENT, BRUSH, DIFFUSE, ENAMEL_SPEC_POW, SILVER, SPEC, SPEC_POW } from './shade';

const f = (n: number) => (Number.isInteger(n) ? `${n}.0` : `${n}`);
const v3 = (c: readonly number[]) => `vec3(${c.map(f).join(', ')})`;

export const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;      // canvas px
uniform float uStep;    // Sobel step in uv
uniform float uK;       // normal scale
uniform vec3 uLight;    // normalised, y up
uniform vec3 uAz;       // planar azimuth (xy) and planarity (z)
uniform float uBoost;   // sweep band, 0..1
uniform vec3 uEnamel;
out vec4 outColor;

float H(vec2 uv) { return texture(uTex, uv).r; }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec4 tx = texture(uTex, uv);
  float cov = tx.b;
  if (cov <= 0.0) { outColor = vec4(0.0); return; }
  float d = uStep;
  float tl = H(uv + vec2(-d,  d)), t = H(uv + vec2(0.0, d)), tr = H(uv + vec2(d, d));
  float l  = H(uv + vec2(-d, 0.0)),                          r  = H(uv + vec2(d, 0.0));
  float bl = H(uv + vec2(-d, -d)), b = H(uv + vec2(0.0, -d)), br = H(uv + vec2(d, -d));
  float gx = (tr + 2.0 * r + br - (tl + 2.0 * l + bl)) * uK;
  float gyUp = (tl + 2.0 * t + tr - (bl + 2.0 * b + br)) * uK;
  vec3 n = normalize(vec3(-gx, -gyUp, 1.0));
  vec3 h = normalize(uLight + vec3(0.0, 0.0, 1.0));
  float ndl = max(dot(n, uLight), 0.0);
  float ndh = max(dot(n, h), 0.0);
  float ao = 0.5 + 0.5 * tx.r;

  vec2 p = uv - 0.5;
  vec2 dir = length(p) > 1e-5 ? normalize(p) : vec2(1.0, 0.0);
  float cd = dot(dir, uAz.xy);
  float c2 = 2.0 * cd * cd - 1.0;
  float p2 = c2 * c2; float p4 = p2 * p2; float p8 = p4 * p4;
  float brush = ${f(BRUSH)} * (1.0 + 1.4 * uBoost) * uAz.z * pow(n.z, 8.0) * p8 * p8 * p8;
  float spec = ${f(SPEC)} * (1.0 + 0.8 * uBoost) * pow(ndh, ${f(SPEC_POW)});
  float diff = (${f(AMBIENT)} + ${f(DIFFUSE)} * ndl) * ao;
  vec3 silver = ${v3(SILVER)};
  vec3 col = silver * (diff + brush) + spec * (0.7 * silver + 0.3);

  float e = tx.g;
  vec3 enamel = uEnamel * (0.2 + 0.72 * ndl) + 0.6 * pow(ndh, ${f(ENAMEL_SPEC_POW)}) * (1.0 + uBoost);
  col = mix(col, enamel, e);
  outColor = vec4(min(col, vec3(1.0)) * cov, cov);
}
`;
