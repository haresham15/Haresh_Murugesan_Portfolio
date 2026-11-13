#!/usr/bin/env node
/**
 * V7 unboxed rule (docs/v7-blueprint.md §3 + Decisions 7):
 * inside <main>, no element wider than 200px and taller than 100px may compute
 *   - a border on two or more sides, or a single border thicker than 1px,
 *   - any box-shadow,
 *   - an opaque background colour (alpha >= 0.99).
 * A single border on one side, at most 1px, is a hairline rule and passes.
 *
 * Usage: npm run build && npm run check:unboxed [-- --widths 1440x900,1024x768,390x844] [-- --query ?tier=full]
 * Exits 1 when any violation is found.
 */
import { chromium } from '@playwright/test';
import { serveOut, ORIGIN, LAUNCH_ARGS } from './serve-out.mjs';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const widths = arg('widths', '1440x900,1024x768,390x844').split(',').map((s) => s.split('x').map(Number));
const query = arg('query', '');

function audit() {
  const out = [];
  for (const el of document.querySelectorAll('main *')) {
    const r = el.getBoundingClientRect();
    if (r.width <= 200 || r.height <= 100) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const sides = ['Top', 'Right', 'Bottom', 'Left'].filter(
      (s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none' && cs[`border${s}Style`] !== 'hidden',
    );
    const hairline = sides.length === 1 && parseFloat(cs[`border${sides[0]}Width`]) <= 1;
    const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
    const c = m ? m[1].split(',').map(Number) : [];
    const opaque = c.length === 3 || (c.length === 4 && c[3] >= 0.99);
    const reasons = [];
    if (sides.length && !hairline) reasons.push(`border ${sides.join('/')}`);
    if (cs.boxShadow !== 'none') reasons.push('box-shadow');
    if (opaque) reasons.push(`background ${cs.backgroundColor}`);
    if (!reasons.length) continue;
    const section = el.closest('[data-section]')?.getAttribute('data-section') ?? '?';
    const cls = (typeof el.className === 'string' ? el.className : el.getAttribute('class') || '').slice(0, 80);
    out.push({ section, tag: el.tagName.toLowerCase(), id: el.id, cls, size: `${Math.round(r.width)}x${Math.round(r.height)}`, reasons: reasons.join(', ') });
  }
  return out;
}

const browser = await chromium.launch({ args: LAUNCH_ARGS });
let total = 0;
for (const [w, h] of widths) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  await serveOut(context);
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/${query}`, { waitUntil: 'networkidle' });
  // Walk the page so lazy sections mount, then audit at several scroll positions
  // (sticky stages only lay out fully while pinned).
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const seen = new Map();
  for (let y = 0; y < height; y += Math.round(h * 0.75)) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await page.waitForTimeout(120);
    for (const v of await page.evaluate(audit)) seen.set(`${v.section}|${v.tag}|${v.id}|${v.cls}|${v.reasons}`, v);
  }
  const list = [...seen.values()];
  total += list.length;
  console.log(`\n${w}x${h}: ${list.length} violation(s)`);
  for (const v of list) console.log(`  [${v.section}] <${v.tag}${v.id ? `#${v.id}` : ''}> ${v.size} — ${v.reasons}\n      ${v.cls}`);
  await context.close();
}
await browser.close();
console.log(total ? `\nFAIL: ${total} boxed element(s)` : '\nPASS: nothing in a box');
process.exit(total ? 1 : 0);
