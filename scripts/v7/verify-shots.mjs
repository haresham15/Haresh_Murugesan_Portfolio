#!/usr/bin/env node
/**
 * V7 verification: console cleanliness, section screenshots, seam screenshots, contact sheets.
 * Usage: npm run build && node scripts/v7/verify-shots.mjs [--widths 1440x900,...] [--no-shots]
 * Writes .v7/after/shots/*.png, .v7/after/sheet_*.png and .v7/after/shots.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { OUT, ORIGIN, WIDTHS, launch, newContext, collectConsole, renderer, sleep, scrollToY, walk, contactSheet } from './verify-lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const widths = arg('widths', null)?.split(',').map((s) => s.split('x').map(Number)) ?? WIDTHS;
const noShots = process.argv.includes('--no-shots');
const sheetsOnly = process.argv.includes('--sheets-only'); // rebuild contact sheets from existing shots
const SHOTS = path.join(OUT, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const report = { renderer: null, console: {}, sections: {}, seams: {} };
const browser = await launch();
if (sheetsOnly) {
  const all = fs.readdirSync(SHOTS).sort();
  for (const [w, h] of widths) {
    const tag = `${w}x${h}`;
    const sec = all.filter((f) => f.startsWith(`${tag}_s`) && !f.includes('_seam')).map((f) => path.join(SHOTS, f));
    const seam = all.filter((f) => f.startsWith(`${tag}_seam`)).map((f) => path.join(SHOTS, f));
    await contactSheet(browser, `V7 after — sections ${tag} (?tier=full)`, sec, path.join(OUT, `sheet_sections_${tag}.png`), { cols: w < 600 ? 8 : 5, thumb: w < 600 ? 180 : 320 });
    await contactSheet(browser, `V7 after — seams ${tag} at p = 0.25 / 0.5 / 0.75`, seam, path.join(OUT, `sheet_seams_${tag}.png`), { cols: w < 600 ? 9 : 6, thumb: w < 600 ? 160 : 260 });
  }
  await browser.close();
  process.exit(0);
}

for (const [w, h] of widths) {
  const tag = `${w}x${h}`;

  /* ---- 1. console on load + during a full wheel-driven scroll (real tier probe, no screenshots) ---- */
  {
    const ctx = await newContext(browser, [w, h]);
    const page = await ctx.newPage();
    const logs = [];
    collectConsole(page, logs);
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    report.renderer ??= await renderer(page);
    await sleep(1500);
    const loadCount = logs.length;
    await page.mouse.move(w / 2, h / 2);
    let last = -1;
    for (let i = 0; i < 2000; i++) {
      await page.mouse.wheel(0, 240);
      await sleep(25);
      if (i % 20 === 19) {
        const y = await page.evaluate(() => window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2 ? -2 : window.scrollY);
        if (y === -2 || y === last) break;
        last = y;
      }
    }
    await sleep(1500);
    const tier = await page.evaluate(() => ({ tier: document.documentElement.dataset.tier, live: document.documentElement.classList.contains('carbon-live') }));
    report.console[tag] = { tier, onLoad: logs.slice(0, loadCount), duringScroll: logs.slice(loadCount) };
    console.log(`${tag} console: ${loadCount} on load, ${logs.length - loadCount} during scroll; tier ${JSON.stringify(tier)}`);
    for (const l of logs) console.log(`   [${l.type}] ${l.text}`);
    await ctx.close();
  }
  if (noShots) continue;

  /* ---- 2. sections and seams at ?tier=full ---- */
  const ctx = await newContext(browser, [w, h]);
  const page = await ctx.newPage();
  const logs = [];
  collectConsole(page, logs);
  await page.goto(`${ORIGIN}/?tier=full`, { waitUntil: 'networkidle' });
  await sleep(800);
  await walk(page);

  const geo = await page.evaluate(() => {
    const sy = window.scrollY;
    const sections = [...document.querySelectorAll('[data-section]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { name: el.getAttribute('data-section'), top: r.top + sy, height: r.height };
    });
    const seams = [...document.querySelectorAll('[data-seam]')].map((el, i) => {
      const r = el.getBoundingClientRect();
      return { i, kind: el.getAttribute('data-seam'), from: el.dataset.from, to: el.dataset.to, top: r.top + sy, height: r.height };
    });
    return { sections, seams, scrollHeight: document.documentElement.scrollHeight };
  });
  report.sections[tag] = geo.sections;
  report.seams[tag] = geo.seams;
  console.log(`${tag}: page ${geo.scrollHeight}px, ${geo.sections.length} sections, ${geo.seams.length} seams`);

  const sectionFiles = [];
  for (const [si, s] of geo.sections.entries()) {
    let n = Math.max(1, Math.ceil((s.height - 4) / h));
    const ys = [];
    if (n <= 6) for (let k = 0; k < n; k++) ys.push(s.top + k * h);
    else { n = 6; for (let k = 0; k < n; k++) ys.push(s.top + (k * (s.height - h)) / (n - 1)); }
    for (const [k, y] of ys.entries()) {
      await scrollToY(page, y, 650);
      const f = path.join(SHOTS, `${tag}_s${String(si).padStart(2, '0')}_${s.name}_${k + 1}of${ys.length}.png`);
      await page.screenshot({ path: f });
      sectionFiles.push(f);
    }
  }

  const seamFiles = [];
  for (const s of geo.seams) {
    for (const p of [0.25, 0.5, 0.75]) {
      const seamTop = h - p * (h + s.height); // viewport y of the seam's top edge
      await scrollToY(page, s.top - seamTop, 450);
      const actual = await page.evaluate((i) => {
        const r = document.querySelectorAll('[data-seam]')[i].getBoundingClientRect();
        return (innerHeight - r.top) / (innerHeight + r.height);
      }, s.i);
      const f = path.join(SHOTS, `${tag}_seam${s.i}_${s.kind}_${s.from}-${s.to}_p${String(p * 100)}.png`);
      await page.screenshot({ path: f });
      seamFiles.push(f);
      if (Math.abs(actual - p) > 0.02) console.log(`   seam ${s.i} p=${p}: measured ${actual.toFixed(3)} (clamped by page end?)`);
    }
  }
  report.console[`${tag}_shotsRun`] = logs;
  await ctx.close();

  await contactSheet(browser, `V7 after — sections ${tag} (?tier=full, ${report.renderer})`, sectionFiles, path.join(OUT, `sheet_sections_${tag}.png`), { cols: w < 600 ? 8 : 5, thumb: w < 600 ? 180 : 320 });
  await contactSheet(browser, `V7 after — seams ${tag} at p = 0.25 / 0.5 / 0.75`, seamFiles, path.join(OUT, `sheet_seams_${tag}.png`), { cols: w < 600 ? 9 : 6, thumb: w < 600 ? 160 : 260 });
  console.log(`${tag}: ${sectionFiles.length} section shots, ${seamFiles.length} seam shots`);
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(report, null, 2));
console.log(`renderer: ${report.renderer}`);
