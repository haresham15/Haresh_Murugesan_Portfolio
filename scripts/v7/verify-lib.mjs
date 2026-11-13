// Shared helpers for the V7 verification scripts (verify-*.mjs). Outputs go to .v7/after/.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { serveOut, ORIGIN } from './serve-out.mjs';

export { ORIGIN };
export const OUT = path.resolve('.v7/after');
fs.mkdirSync(OUT, { recursive: true });

export const WIDTHS = [[1440, 900], [1024, 768], [390, 844]];

// Real-GPU flags first; VERIFY_GPU=swiftshader forces the software path.
export const GPU_ARGS = process.env.VERIFY_GPU === 'swiftshader'
  ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
  : ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'];

export async function launch() {
  return chromium.launch({ headless: process.env.HEADFUL ? false : true, args: GPU_ARGS });
}

export async function newContext(browser, [w, h], opts = {}) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...opts });
  await serveOut(context);
  return context;
}

/** Console + page errors, minus the GL ReadPixels stall lines that screenshots cause. */
export function collectConsole(page, sink) {
  const ignore = (t) => /GL Driver Message .*GPU stall due to ReadPixels/i.test(t);
  page.on('console', (m) => {
    const t = m.text();
    if (ignore(t)) return;
    if (['error', 'warning', 'warn', 'assert'].includes(m.type()) || /error|warn/i.test(t)) sink.push({ type: m.type(), text: t.slice(0, 400) });
    else sink.push({ type: m.type(), text: t.slice(0, 400) });
  });
  page.on('pageerror', (e) => sink.push({ type: 'pageerror', text: String(e).slice(0, 400) }));
  page.on('requestfailed', (r) => sink.push({ type: 'requestfailed', text: `${r.url()} ${r.failure()?.errorText}` }));
  page.on('response', (r) => { if (r.status() >= 400) sink.push({ type: `http${r.status()}`, text: r.url() }); });
}

export async function renderer(page) {
  return page.evaluate(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'no-webgl';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function scrollToY(page, y, settle = 350) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), Math.max(0, Math.round(y)));
  await sleep(settle);
}

/** Walk the whole page so lazy/dynamic sections mount and settle their height. */
export async function walk(page, step = 600, pause = 60) {
  let y = 0;
  for (let i = 0; i < 400; i++) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y > h) break;
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await sleep(pause);
    y += step;
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(300);
}

/** Write a simple HTML contact sheet and render it to PNG. */
export async function contactSheet(browser, title, files, outPng, { cols = 4, thumb = 340 } = {}) {
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:16px;background:#888;font:12px/1.3 system-ui,sans-serif;color:#000}
    h1{font-size:16px;margin:0 0 12px}
    .g{display:grid;grid-template-columns:repeat(${cols},${thumb}px);gap:10px}
    figure{margin:0;background:#fff;padding:4px} img{width:100%;display:block}
    figcaption{padding-top:3px;word-break:break-all}
  </style><h1>${title}</h1><div class="g">${files
    .map((f) => `<figure><img src="${path.relative(path.dirname(outPng), f).split(path.sep).join('/')}"><figcaption>${path.basename(f, '.png')}</figcaption></figure>`)
    .join('')}</div>`;
  const htmlPath = outPng.replace(/\.png$/, '.html');
  fs.writeFileSync(htmlPath, html);
  const ctx = await browser.newContext({ viewport: { width: cols * (thumb + 10) + 32, height: 600 } });
  const p = await ctx.newPage();
  await p.goto('file:///' + htmlPath.replace(/\\/g, '/'));
  await p.waitForLoadState('load');
  await p.screenshot({ path: outPng, fullPage: true });
  await ctx.close();
}
