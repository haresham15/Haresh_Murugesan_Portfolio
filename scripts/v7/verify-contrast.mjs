#!/usr/bin/env node
/**
 * V7 verification: text contrast on the real rendered page.
 * For every visible text element in each section, the text colour (computed colour × alpha ×
 * ancestor opacity) is composited over the background actually behind it: the per-channel median
 * of screenshot pixels in a 3 px ring just outside the text box. A second figure uses the material
 * colour (dark #03050A; light, the worse of #F4F6F9 / #EAEFF5).
 * Threshold 4.5:1, or 3:1 for large text (≥ 24 px, or ≥ 18.66 px at weight ≥ 700).
 * Usage: npm run build && node scripts/v7/verify-contrast.mjs [--widths ...] [--query ?tier=full]
 * Writes .v7/after/contrast.json. Exits 1 on any failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { OUT, ORIGIN, WIDTHS, launch, newContext, sleep, scrollToY, walk } from './verify-lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const widths = arg('widths', null)?.split(',').map((s) => s.split('x').map(Number)) ?? WIDTHS;
const query = arg('query', '?tier=full');

/** In-page: list text elements fully inside the viewport that were not measured yet. */
function collect(seen) {
  const out = [];
  const vis = (el) => {
    let op = 1;
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      op *= parseFloat(cs.opacity);
      if (cs.clip && cs.clip !== 'auto' && /rect\(0(px)?,? 0(px)?/.test(cs.clip)) return 0;
    }
    return op;
  };
  const all = document.querySelectorAll('main *');
  all.forEach((el, idx) => {
    if (seen.includes(idx)) return;
    if (['SCRIPT', 'STYLE', 'svg', 'SVG', 'CANVAS'].includes(el.tagName) || el.closest('svg')) return;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (own.replace(/[\s·•|/→↗←]/g, '').length < 2) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    if (r.top < 4 || r.left < 0 || r.bottom > innerHeight - 4 || r.right > innerWidth) return;
    const op = vis(el);
    if (op < 0.06) return;
    const cs = getComputedStyle(el);
    if (cs.webkitTextFillColor && cs.webkitTextFillColor !== cs.color && /rgba\(0, 0, 0, 0\)/.test(cs.webkitTextFillColor)) return; // clipped gradient text
    const m = cs.color.match(/[\d.]+/g).map(Number);
    const matEl = el.closest('[data-material]');
    const cls = typeof el.className === 'string' ? el.className : el.getAttribute('class') || '';
    out.push({
      idx, tag: el.tagName.toLowerCase(), id: el.id, cls: cls.slice(0, 90), text: own.slice(0, 50),
      section: el.closest('[data-section]')?.dataset.section ?? '?', material: matEl?.dataset.material ?? '?',
      ariaHidden: !!el.closest('[aria-hidden="true"]'),
      rect: [r.left, r.top, r.width, r.height], color: [m[0], m[1], m[2], m[3] ?? 1], op,
      size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) || 400,
    });
  });
  return out;
}

/** In-page: sample the ring around each rect from a PNG data URL. */
async function sample({ url, items, dpr }) {
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height).data;
  const px = (x, y) => { x = Math.round(x * dpr); y = Math.round(y * dpr); if (x < 0 || y < 0 || x >= c.width || y >= c.height) return null; const i = (y * c.width + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
  return items.map(([l, t, w, h]) => {
    const ring = [];
    for (let d = 2; d <= 4; d++) {
      for (let x = l - d; x <= l + w + d; x += 2) { const a = px(x, t - d); const b = px(x, t + h + d); if (a) ring.push(a); if (b) ring.push(b); }
      for (let y = t - d; y <= t + h + d; y += 2) { const a = px(l - d, y); const b = px(l + w + d, y); if (a) ring.push(a); if (b) ring.push(b); }
    }
    if (!ring.length) return null;
    const med = [0, 1, 2].map((k) => { const v = ring.map((p) => p[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; });
    return med;
  });
}

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => fg.map((v, k) => v * a + bg[k] * (1 - a));
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const MAT = { dark: [hex('#03050A')], light: [hex('#F4F6F9'), hex('#EAEFF5')] };

const browser = await launch();
const report = {};
let failures = 0;
for (const [w, h] of widths) {
  const tag = `${w}x${h}`;
  const ctx = await newContext(browser, [w, h]);
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}/${query}`, { waitUntil: 'networkidle' });
  await sleep(900);
  await walk(page);
  const sections = await page.evaluate(() => [...document.querySelectorAll('[data-section]')].map((el) => { const r = el.getBoundingClientRect(); return { name: el.dataset.section, top: r.top + scrollY, height: r.height }; }));
  const seen = [];
  const rows = [];
  for (const s of sections) {
    for (let y = s.top - h * 0.1; y < s.top + s.height; y += h * 0.6) {
      await scrollToY(page, y, 900);
      const items = await page.evaluate(collect, seen);
      if (!items.length) continue;
      const shot = await page.screenshot();
      const bgs = await page.evaluate(sample, { url: `data:image/png;base64,${shot.toString('base64')}`, items: items.map((i) => i.rect), dpr: 1 });
      items.forEach((it, k) => {
        seen.push(it.idx);
        const bg = bgs[k];
        if (!bg) return;
        const a = it.color[3] * it.op;
        const fg = over(it.color.slice(0, 3), a, bg);
        const r = ratio(fg, bg);
        const mats = MAT[it.material] ?? [];
        const rMat = mats.length ? Math.min(...mats.map((mb) => ratio(over(it.color.slice(0, 3), a, mb), mb))) : null;
        const large = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
        const need = large ? 3 : 4.5;
        rows.push({ ...it, bg: bg.map(Math.round), ratio: +r.toFixed(2), ratioMaterial: rMat && +rMat.toFixed(2), large, need, pass: r >= need, passMaterial: rMat === null || rMat >= need });
      });
    }
  }
  const fails = rows.filter((r) => !r.pass || !r.passMaterial);
  failures += fails.filter((r) => !r.ariaHidden).length;
  report[tag] = { measured: rows.length, fails, all: rows };
  console.log(`\n${tag}: ${rows.length} text elements measured, ${fails.length} below threshold (${fails.filter((f) => f.ariaHidden).length} of them aria-hidden)`);
  const bySection = {};
  rows.forEach((r) => { (bySection[r.section] ??= []).push(r.ratio); });
  console.log('  min ratio per section:', Object.entries(bySection).map(([k, v]) => `${k} ${Math.min(...v).toFixed(2)} (n=${v.length})`).join(' · '));
  for (const f of fails) {
    console.log(`  FAIL [${f.section}/${f.material}] <${f.tag}${f.id ? '#' + f.id : ''}> "${f.text}" ${f.size}px/${f.weight}${f.ariaHidden ? ' aria-hidden' : ''} rgba(${f.color.map((v) => +(+v).toFixed(2))}) op ${f.op.toFixed(2)} on rgb(${f.bg}) → ${f.ratio}:1 (material ${f.ratioMaterial}:1, need ${f.need})\n        .${f.cls}`);
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'contrast.json'), JSON.stringify(report, null, 2));
console.log(failures ? `\nFAIL: ${failures} visible (non-aria-hidden) text element(s) below threshold` : '\nPASS');
process.exit(failures ? 1 : 0);
