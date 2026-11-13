/**
 * Tool-wall map checks. Run from the repo root:
 *   node --experimental-strip-types src/v7/tool-wall/toolMap.test.ts
 *
 * The app imports content files without extensions (bundler resolution). A tiny resolve
 * hook appends ".ts" for Node so the same files load unchanged.
 */
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const hook = `export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); } catch (err) {
    if (specifier.startsWith('.') && !/\\.[cm]?[jt]sx?$/.test(specifier)) return next(specifier + '.ts', context);
    throw err;
  }
}`;
register(`data:text/javascript,${encodeURIComponent(hook)}`);

const load = (path: string) => import(new URL(path, import.meta.url).href);
const map = (await load('./toolMap.ts')) as typeof import('./toolMap');
const { TOOL_ICONS } = (await load('./icons.generated.ts')) as typeof import('./icons.generated');
const { allProjects } = (await load('../../content/projects.ts')) as typeof import('../../content/projects');
const { skillDomains } = (await load('../../content/skills.ts')) as typeof import('../../content/skills');
const extractor = (await load('./extract-icons.mjs')) as {
  SOURCES: Record<string, string | { monogram: string }>;
  pathNumbers: (d: string) => number[];
  sourceFile: (src: string) => string;
};

const { toolWall, TOOL_SPECS, EXPERIENCE_ONLY_TOOLS } = map;
const tools = toolWall.rows.flatMap((r) => r.tools);
const slugs = new Set(allProjects.map((p) => p.slug));

test('five rows, one per skills.ts domain, in order', () => {
  assert.deepEqual(
    toolWall.rows.map((r) => r.id),
    skillDomains.map((d) => d.id),
  );
  for (const r of toolWall.rows) assert.ok(r.tools.length > 0, `${r.id} is empty`);
});

test('no tool listed twice', () => {
  const ids = tools.map((t) => t.id);
  const names = tools.map((t) => t.name.toLowerCase());
  assert.equal(new Set(ids).size, ids.length, 'duplicate tool id');
  assert.equal(new Set(names).size, names.length, 'duplicate tool name');
  assert.equal(tools.length, TOOL_SPECS.length, 'a spec is missing from the rows');
});

test('every tool has an icon, and every icon belongs to a tool', () => {
  for (const t of tools) assert.ok(TOOL_ICONS[t.id], `no icon for ${t.id}`);
  const ids = new Set(tools.map((t) => t.id));
  for (const id of Object.keys(TOOL_ICONS)) assert.ok(ids.has(id), `orphan icon ${id}`);
  assert.deepEqual(Object.keys(extractor.SOURCES).sort(), [...ids].sort(), 'extractor SOURCES out of sync');
});

test('generated paths match their source SVGs within rounding', () => {
  for (const [id, src] of Object.entries(extractor.SOURCES)) {
    const icon = TOOL_ICONS[id];
    if (typeof src !== 'string') {
      assert.equal(icon.kind, 'monogram', id);
      continue;
    }
    assert.equal(icon.kind, 'path', id);
    if (icon.kind !== 'path') continue;
    const svg = readFileSync(extractor.sourceFile(src), 'utf8');
    const original = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)].flatMap((m) => extractor.pathNumbers(m[1]));
    const generated = extractor.pathNumbers(icon.d);
    assert.equal(generated.length, original.length, `${id}: number count differs`);
    const tol = Number(icon.viewBox.split(/\s+/)[2]) <= 32 ? 0.0051 : 0.051;
    original.forEach((n, i) => assert.ok(Math.abs(n - generated[i]) <= tol, `${id}[${i}]: ${n} vs ${generated[i]}`));
  }
});

test('every project link points at a real case study; roles go to /#experience', () => {
  for (const t of tools) {
    for (const l of t.links) {
      if (l.kind === 'project') {
        const slug = l.key.slice('project:'.length);
        assert.ok(slugs.has(slug), `${t.id} -> unknown slug ${slug}`);
        assert.equal(l.href, `/projects/${slug}`);
      } else {
        assert.equal(l.href, '/#experience');
      }
    }
  }
});

test('experience-only tools link nothing; every other tool links something', () => {
  const only = new Set<string>(EXPERIENCE_ONLY_TOOLS);
  for (const t of tools) {
    if (only.has(t.id)) assert.equal(t.links.length, 0, `${t.id} now has links; drop it from EXPERIENCE_ONLY_TOOLS`);
    else assert.ok(t.links.length > 0, `${t.id} has no project or role; add data or list it as experience-only`);
  }
});

test('names column and tool links agree both ways', () => {
  const byKey = new Map(toolWall.names.map((n) => [n.key, n]));
  assert.equal(byKey.size, toolWall.names.length, 'duplicate name');
  for (const t of tools) for (const l of t.links) assert.ok(byKey.get(l.key)?.toolIds.includes(t.id), `${t.id} <-> ${l.key}`);
  for (const n of toolWall.names) {
    for (const id of n.toolIds) assert.ok(tools.find((t) => t.id === id)?.links.some((l) => l.key === n.key), `${n.key} <-> ${id}`);
  }
});

// The table, for the report.
console.log('\nTool -> projects / roles   (* = from skills.ts only, not named in the project data)');
for (const r of toolWall.rows) {
  console.log(`\n[${r.title}]`);
  for (const t of r.tools) {
    const links = t.links.map((l) => `${l.name}${l.source === 'skills' ? '*' : ''}`).join(' · ');
    console.log(`  ${t.name.padEnd(16)} ${links || '(experience only)'}`);
  }
}
console.log('\nConcept skills (no tool):', toolWall.conceptSkills.join(' | '));
console.log('Unresolved provenBy:', toolWall.unresolvedProvenBy.join(' | ') || 'none');
console.log(`Names column: ${toolWall.names.length} entries\n`);
