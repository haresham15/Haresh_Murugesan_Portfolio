#!/usr/bin/env node
/**
 * Writes icons.generated.ts: one path per tool, so the bundle carries only the marks the
 * wall uses and never imports simple-icons or devicon at runtime.
 *
 *   node src/v7/tool-wall/extract-icons.mjs
 *
 * Sources and licences
 *  - simple-icons (CC0-1.0 for the SVG data). The marks remain trademarks of their owners;
 *    simple-icons asks users to follow each brand's guidelines. The wall draws every mark
 *    in one titanium/cobalt ink, never brand colours.
 *  - devicon (MIT, (c) konpa and contributors) for brands simple-icons lacks or has removed:
 *    Java, MATLAB, AWS, Motion (Framer Motion). Same trademark caveat.
 *  - Monograms: tools with no official mark are set as mono letters at the same weight.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const mods = join(root, 'node_modules');

/** tool id -> source. Keys must match TOOL_SPECS ids in toolMap.ts (the test checks). */
export const SOURCES = {
  pytorch: 'si:pytorch',
  tensorflow: 'si:tensorflow',
  keras: 'si:keras',
  opencv: 'si:opencv',
  tesseract: { monogram: 'Tess' },
  huggingface: 'si:huggingface',
  pgvector: { monogram: 'pgv' },
  faiss: { monogram: 'FAISS' },

  fastapi: 'si:fastapi',
  nodejs: 'si:nodedotjs',
  webworkers: { monogram: 'WW' },
  postgresql: 'si:postgresql',
  sqlmodel: { monogram: 'SQLM' },
  sqlite: 'si:sqlite',
  supabase: 'si:supabase',
  zod: 'si:zod',

  nextjs: 'si:nextdotjs',
  react: 'si:react',
  tailwind: 'si:tailwindcss',
  framermotion: 'dev:motion/motion-original',
  canvas: 'si:html5',
  webgl: 'si:webgl',
  threejs: 'si:threedotjs',
  deckgl: { monogram: 'deck' },
  webaudio: { monogram: 'WAA' },

  aws: 'dev:amazonwebservices/amazonwebservices-plain',
  docker: 'si:docker',
  githubactions: 'si:githubactions',
  pandas: 'si:pandas',
  numpy: 'si:numpy',
  scikitlearn: 'si:scikitlearn',
  streamlit: 'si:streamlit',
  openstreetmap: 'si:openstreetmap',
  osrm: { monogram: 'OSRM' },

  python: 'si:python',
  typescript: 'si:typescript',
  javascript: 'si:javascript',
  java: 'dev:java/java-plain',
  junit: 'si:junit5',
  r: 'si:r',
  cpp: 'si:cplusplus',
  go: 'si:go',
  swift: 'si:swift',
  matlab: 'dev:matlab/matlab-plain',
};

/** Parameters per path command; arcs carry two single-digit flags that may be packed ("011"). */
const ARITY = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
const NUM = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;

/**
 * Re-serialises a path with coordinates rounded to `decimals`. At 40 px, 0.01 of a 24-unit
 * box is 0.017 px, so nothing visible changes while the payload shrinks by about a third.
 */
export function compactPath(d, decimals, sink = null) {
  const out = [];
  let i = 0;
  let cmd = '';
  let prev = ''; // last emitted token, to decide whether a separator is needed
  const emit = (tok) => {
    const needsSep = /[\d.]$/.test(prev) && (/^\d/.test(tok) || (tok.startsWith('.') && /\.\d*$/.test(prev) === false));
    out.push(needsSep ? ` ${tok}` : tok);
    prev = tok;
  };
  const fmt = (n) => {
    let s = String(Number(n.toFixed(decimals)));
    if (s === '-0') s = '0';
    return s.replace(/^(-?)0\./, '$1.');
  };
  while (i < d.length) {
    const ch = d[i];
    if (/[\s,]/.test(ch)) { i++; continue; }
    if (/[a-zA-Z]/.test(ch)) {
      cmd = ch;
      emit(ch);
      i++;
      if (ARITY[ch.toLowerCase()] === undefined) throw new Error(`Unknown path command ${ch}`);
      continue;
    }
    const arity = ARITY[cmd.toLowerCase()];
    if (!arity) throw new Error(`Number after ${cmd || 'nothing'} at ${i}`);
    for (let k = 0; k < arity; k++) {
      while (i < d.length && /[\s,]/.test(d[i])) i++;
      const isFlag = cmd.toLowerCase() === 'a' && (k === 3 || k === 4);
      if (isFlag) {
        if (d[i] !== '0' && d[i] !== '1') throw new Error(`Bad arc flag at ${i} in path`);
        sink?.push(Number(d[i]));
        emit(d[i]);
        i++;
        continue;
      }
      const m = d.slice(i).match(NUM);
      if (!m) throw new Error(`Bad number at ${i} in path`);
      sink?.push(Number(m[0]));
      emit(fmt(Number(m[0])));
      i += m[0].length;
    }
    // Implicit repeats of the same command fall through to the next loop pass.
  }
  return out.join('').replace(/ -/g, '-');
}

/** Every number and arc flag in a path, in order; used by the test to round-trip the output. */
export function pathNumbers(d) {
  const nums = [];
  compactPath(d, 12, nums);
  return nums;
}

export function sourceFile(src) {
  const [lib, name] = src.split(':');
  return lib === 'si' ? join(mods, 'simple-icons/icons', `${name}.svg`) : join(mods, 'devicon/icons', `${name}.svg`);
}

export function readSvg(file) {
  const svg = readFileSync(file, 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
  if (!viewBox || paths.length === 0) throw new Error(`No viewBox or path in ${file}`);
  if (/<(circle|rect|polygon|ellipse|g)\b|transform=/.test(svg)) {
    throw new Error(`${file} has shapes or transforms; extend the extractor before using it`);
  }
  const size = Number(viewBox.split(/\s+/)[2]);
  const decimals = size <= 32 ? 2 : 1;
  return { viewBox, d: paths.map((p) => compactPath(p, decimals)).join('') };
}

function main() {
const out = {};
for (const [id, src] of Object.entries(SOURCES)) {
  if (typeof src === 'object') {
    out[id] = { kind: 'monogram', viewBox: '0 0 24 24', text: src.monogram, source: 'monogram' };
    continue;
  }
  const [lib, name] = src.split(':');
  const { viewBox, d } = readSvg(sourceFile(src));
  out[id] = { kind: 'path', viewBox, d, source: lib === 'si' ? `simple-icons/${name}` : `devicon/${name}` };
}

const header = `// GENERATED by src/v7/tool-wall/extract-icons.mjs. Do not edit by hand.
// simple-icons ${JSON.parse(readFileSync(join(mods, 'simple-icons/package.json'), 'utf8')).version} (CC0-1.0 data) and devicon ${
  JSON.parse(readFileSync(join(mods, 'devicon/package.json'), 'utf8')).version
} (MIT).
// Marks are trademarks of their owners; drawn in the site's ink, never brand colours.

export type ToolIcon =
  | { kind: 'path'; viewBox: string; d: string; source: string }
  | { kind: 'monogram'; viewBox: string; text: string; source: string };

export const TOOL_ICONS: Record<string, ToolIcon> = `;

writeFileSync(join(here, 'icons.generated.ts'), `${header}${JSON.stringify(out, null, 2)};\n`);
console.log(`icons.generated.ts: ${Object.keys(out).length} icons`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
