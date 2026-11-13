/**
 * CarbonField fragment shader. Both materials, every seam mask, one pass.
 * Mask maths mirror src/v7/materials/field.ts (seamMask); keep the two in step.
 */
export const MAX_BANDS = 6;

export const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;       // drawing buffer, device px
uniform float uDpr;
uniform float uScrollY;  // CSS px
uniform float uLight;    // light azimuth, rad
uniform float uGlint;    // 1 = full tier, 0 = lite
uniform int uCount;
uniform vec4 uBand[${MAX_BANDS}]; // top, bottom (viewport CSS px), kind, p
uniform vec2 uMat[${MAX_BANDS}];  // material a, b: 0 dark, 1 light

out vec4 outColor;

const float PI = 3.14159265;
const float SLAT = 96.0;
const float BLADES = 7.0;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

// Kajiya-Kay anisotropic highlight.
float kk(vec3 T, vec3 H) {
  float d = dot(T, H);
  return pow(sqrt(max(0.0, 1.0 - d * d)), 48.0);
}

// White-silver 2x2 twill, tow 6 CSS px.
vec3 weave(vec2 w, vec3 H) {
  vec2 cell = floor(w / 6.0);
  vec2 f = fract(w / 6.0);
  float ph = mod(cell.x + cell.y, 4.0);
  bool warp = ph < 2.0;
  float across = warp ? f.x : f.y;
  float along = ((warp ? f.y : f.x) + (warp ? ph : ph - 2.0)) * 0.5; // 0..1 along the float
  float b = across - 0.5;
  // Tangent along the tow, bulged across it (cosine) and crimped along it.
  vec3 T = warp ? vec3(0.9 * b, 1.0, 0.0) : vec3(1.0, 0.9 * b, 0.0);
  T.z = 0.55 * cos(PI * across) * sign(b) + 0.35 * cos(PI * along);
  T = normalize(T);
  float spec = kk(T, H);
  float body = smoothstep(0.0, 0.14, across) * smoothstep(1.0, 0.86, across);
  float ends = smoothstep(0.0, 0.08, along) * smoothstep(1.0, 0.92, along);
  float lit = body * ends;
  vec3 col = mix(vec3(0.9176, 0.9373, 0.9608), vec3(0.9569, 0.9647, 0.9765), lit); // #EAEFF5 -> #F4F6F9
  col = mix(col, vec3(1.0), spec * 0.45 * lit);                                        // toward #FFFFFF
  float g = uGlint * smoothstep(0.92, 1.0, spec) * lit;
  col = mix(col, vec3(0.749, 0.831, 1.0), 0.06 * g);                                  // #BFD4FF, 6% max
  return col;
}

// Dark forged carbon: Voronoi chips, each with its own fibre direction.
vec3 forged(vec2 w, vec2 sc, vec2 view, vec3 H) {
  float S = 46.0;
  vec2 g = w / S;
  vec2 gi = floor(g);
  vec2 gf = fract(g);
  float d1 = 9.0;
  float d2 = 9.0;
  vec2 id = vec2(0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 pt = o + 0.05 + 0.9 * hash22(gi + o);
      float d = length(pt - gf);
      if (d < d1) { d2 = d1; d1 = d; id = gi + o; }
      else if (d < d2) { d2 = d; }
    }
  }
  float theta = hash12(id * 1.37 + 3.1) * PI;
  float shade = hash12(id + 17.0);
  // Sparse chips on an obsidian ground, as in the original tile.
  vec3 base = shade < 0.45 ? vec3(0.0118, 0.0196, 0.0392)   // #03050A
            : shade < 0.80 ? vec3(0.0196, 0.0314, 0.0667)   // #050811
            : vec3(0.0314, 0.0549, 0.1059);                 // #080E1B
  vec2 perp = vec2(-sin(theta), cos(theta));
  float fil = abs(fract(dot(w, perp) / 2.25) - 0.5);
  base += vec3(0.784, 0.824, 0.878) * 0.022 * smoothstep(0.18, 0.0, fil);
  vec3 T = normalize(vec3(cos(theta), sin(theta), 0.0));
  float spec = kk(T, H);
  vec3 col = base
    + vec3(0.0824, 0.2196, 0.4588) * spec * 0.12 * step(0.45, shade)  // cobalt roll (#153875), chips only
    + vec3(0.902, 0.925, 0.961) * pow(spec, 3.0) * 0.04 * step(0.45, shade); // silver roll (#E6ECF5)
  col *= mix(0.75, 1.0, smoothstep(0.0, 0.05, d2 - d1));           // cut edge between chips
  // The old overlay: radial-gradient(circle at 50% 32%, cobalt 0.26 -> obsidian 0.90 at 78%).
  vec2 c = vec2(0.5, 0.32) * view;
  float far = length(max(c, view - c));
  float t = clamp(length(sc - c) / (0.78 * far), 0.0, 1.0);
  vec3 oc = mix(vec3(0.0431, 0.1176, 0.251), vec3(0.0118, 0.0196, 0.0392), t);
  return mix(col, oc, mix(0.26, 0.90, t));
}

vec3 material(float m, vec2 w, vec2 sc, vec2 view, vec3 H) {
  return m > 0.5 ? weave(w, H) : forged(w, sc, view, H);
}

void main() {
  vec2 view = uRes / uDpr;
  vec2 sc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr; // CSS px, top-left origin
  vec2 w = sc + vec2(0.0, uScrollY);                             // document space: the weave scrolls with the page
  vec3 L = normalize(vec3(cos(uLight), sin(uLight), 0.35));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

  float kind = 0.0;
  float p = 0.0;
  float top = 0.0;
  float bot = view.y;
  float ma = 0.0;
  float mb = 0.0;
  for (int k = 0; k < ${MAX_BANDS}; k++) {
    if (k >= uCount) break;
    vec4 b = uBand[k];
    if (sc.y >= b.x && sc.y < b.y) {
      top = b.x; bot = b.y; kind = b.z; p = b.w;
      ma = uMat[k].x; mb = uMat[k].y;
      break;
    }
  }

  float h = bot - top;
  float yb = sc.y - top;
  float up = h - yb;
  float m = 0.0;            // weight of material b
  vec3 edgeCol = vec3(0.0);
  float edgeA = 0.0;

  if (kind < 0.5) {
    m = 0.0;
  } else if (kind < 1.5) { // shutter
    float u = sc.x + up;
    float i = floor(u / SLAT);
    float f = u / SLAT - i;
    float iMax = floor((view.x + h) / SLAT);
    float gain = max(2.2, 1.0 + 0.06 * iMax);
    float open = smoothstep(0.0, 1.0, gain * p - 0.06 * i);
    m = f < open ? 1.0 : 0.0;
    if (open > 0.0 && open < 1.0 && abs(f - open) * SLAT * 0.7071 < 0.6) { edgeCol = vec3(1.0, 0.157, 0.0); edgeA = 1.0; }
  } else if (kind < 3.5) { // iris open (2) / close (3)
    bool opening = kind < 2.5;
    // Opening grows up from the next section (bottom edge); closing shrinks into the previous one (top edge).
    vec2 d = vec2(sc.x - view.x * 0.5, yb - (opening ? h : 0.0));
    float Rmax = length(vec2(view.x * 0.5, h)) / cos(PI / BLADES) * 1.02;
    float R = (opening ? p : 1.0 - p) * Rmax;
    float seg = 2.0 * PI / BLADES;
    float th = atan(d.y, d.x) + 0.4 * p;
    float r = R * cos(PI / BLADES) / cos(mod(th, seg) - PI / BLADES);
    bool inside = length(d) < r;
    m = opening ? (inside ? 1.0 : 0.0) : (inside ? 0.0 : 1.0);
  } else if (kind < 4.5) { // horizon bleed
    float band = 0.3 * view.y;
    m = smoothstep(0.0, 1.0, (yb - (h - band) * 0.5) / band);
    if (abs(yb - h * 0.5) < 0.5) { edgeCol = vec3(0.784, 0.824, 0.878); edgeA = 0.55; }
  } else if (kind < 6.5) { // 90-degree turn, in (5) pivots bottom-left, out (6) bottom-right
    float px = kind < 5.5 ? sc.x : view.x - sc.x;
    float ang = atan(up, px);
    float sweep = smoothstep(0.1, 0.9, p) * (PI * 0.5) * 1.001;
    m = ang <= sweep ? 1.0 : 0.0;
    if (sweep > 0.0 && sweep < PI * 0.5 && abs(px * sin(sweep) - up * cos(sweep)) < 0.6) { edgeCol = vec3(0.784, 0.824, 0.878); edgeA = 0.5; }
  } else if (kind < 7.5) { // baseline
    m = yb >= h * 0.5 ? 1.0 : 0.0;
    if (abs(yb - h * 0.5) < 0.5) { edgeCol = vec3(0.494, 0.545, 0.608); edgeA = 0.8; }
  } else { // exposure blow-out
    float t = yb / h;
    m = smoothstep(0.15, 0.85, t + (p - 0.5) * 0.6);
  }

  vec3 col;
  if (m <= 0.0) col = material(ma, w, sc, view, H);
  else if (m >= 1.0) col = material(mb, w, sc, view, H);
  else col = mix(material(ma, w, sc, view, H), material(mb, w, sc, view, H), m);

  if (kind > 7.5) {
    float t = yb / h;
    float bloom = exp(-pow((t - 0.62) / 0.16, 2.0)) * smoothstep(0.25, 0.6, p) * (1.0 - smoothstep(0.85, 1.0, p));
    col = mix(col, vec3(1.0), 0.9 * bloom);
  }
  col = mix(col, edgeCol, edgeA);
  outColor = vec4(col, 1.0);
}
`;
