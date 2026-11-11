import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('./verticalTrackGeometry.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
const { buildTrackPath, unwrapTrackAngle, needsForwardWrap, progressAtY } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

assert.equal(buildTrackPath([{ x: 124, y: 200 }, { x: 76, y: 500 }], 100, 700),
  'M 100 0 C 100 100, 124 100, 124 200 C 124 350, 76 350, 76 500 C 76 600, 100 600, 100 700');
assert.equal(unwrapTrackAngle(179, -179), 181);
assert.equal(unwrapTrackAngle(-179, 179), -181);
assert.equal(unwrapTrackAngle(900, -179), 901);
assert.equal(needsForwardWrap(0.8, 0.2), true);
assert.equal(needsForwardWrap(0.2, 0.8), false);
assert.equal(needsForwardWrap(1.02, 0.9), true);
assert.equal(needsForwardWrap(-0.03, 0.1), false);
assert.equal(needsForwardWrap(0.5, 0.5), false);
const path = { getPointAtLength: (distance) => ({ x: 38, y: distance * distance / 1000 }) };
assert.ok(Math.abs(progressAtY(path, 1000, 250) - 0.5) < 1e-8);
console.log('Experience geometry: measured spline, tangent unwrapping, interrupted wrap decisions, and stop lookup passed.');
