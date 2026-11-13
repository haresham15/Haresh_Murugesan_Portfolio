#!/usr/bin/env node
/**
 * V7 verification: performance.
 *  1. 1440x900, ?tier=full, 4x CPU throttle (CDP): a full top-to-bottom rAF-driven scroll while a
 *     rAF interval sampler and a longtask observer run, plus a Chromium trace used to attribute
 *     every main-thread task over 50 ms.
 *  2. Gzipped size of the JS chunks that carry each V7 section, and of the home page's JS.
 *  3. Optional Lighthouse (mobile + desktop): --lighthouse <path to lighthouse bin> --serve <path to serve.mjs>
 *     The static server is started and stopped inside this script.
 * Usage: npm run build && node scripts/v7/verify-perf.mjs [--speed 1500] [--lighthouse ... --serve ...]
 * Writes .v7/after/perf.json, .v7/after/perf-trace.json, .v7/after/lh-*.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { spawn, spawnSync } from 'node:child_process';
import { OUT, ORIGIN, launch, newContext, renderer, sleep, walk } from './verify-lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const SPEED = Number(arg('speed', 1500)); // px per second
const RATE = Number(arg('rate', 4));
const report = {};

/* ---------------- 1. throttled scroll ---------------- */
{
  const browser = await launch();
  const ctx = await newContext(browser, [1440, 900]);
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}/?tier=full`, { waitUntil: 'networkidle' });
  report.renderer = await renderer(page);
  await sleep(1500);
  // Mount lazy sections first (a returning visitor's state), then start at the top.
  await walk(page, 900, 50);
  await sleep(1000);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
  const tracePath = path.join(OUT, 'perf-trace.json');
  await browser.startTracing(page, { path: tracePath, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'toplevel', 'v8.execute', 'blink.user_timing'] });
  const run = await page.evaluate(async (speed) => {
    const longtasks = [];
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) longtasks.push({ start: e.startTime, dur: e.duration, y: scrollY, attr: (e.attribution || []).map((a) => `${a.containerType}:${a.containerSrc || a.containerName || ''}`).join(' ') });
    });
    po.observe({ type: 'longtask' });
    const frames = [];
    const max = document.documentElement.scrollHeight - innerHeight;
    performance.mark('scroll-start');
    await new Promise((resolve) => {
      let last = 0;
      let t0 = 0;
      const tick = (now) => {
        if (!t0) t0 = now;
        if (last) frames.push({ t: now, dt: now - last, y: scrollY });
        last = now;
        const y = Math.min(max, ((now - t0) / 1000) * speed);
        window.scrollTo(0, y);
        if (y >= max) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await new Promise((r) => setTimeout(r, 1000));
    performance.mark('scroll-end');
    po.disconnect();
    const sections = [...document.querySelectorAll('[data-section],[data-seam]')].map((el) => { const r = el.getBoundingClientRect(); return { name: el.dataset.section ?? `seam:${el.dataset.seam}`, top: r.top + scrollY, bottom: r.bottom + scrollY }; });
    return { frames, longtasks, max, sections, origin: performance.timeOrigin };
  }, SPEED);
  await browser.stopTracing();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await ctx.close();
  await browser.close();

  const at = (y) => run.sections.find((s) => y + 450 >= s.top && y + 450 < s.bottom)?.name ?? '?';
  const dts = run.frames.map((f) => f.dt);
  const dropped = run.frames.filter((f) => f.dt > 16.7 * 1.5);
  const worst = run.frames.reduce((a, b) => (b.dt > a.dt ? b : a), { dt: 0 });
  const sorted = [...dts].sort((a, b) => a - b);
  const droppedBySection = {};
  dropped.forEach((f) => { const s = at(f.y); droppedBySection[s] = (droppedBySection[s] || 0) + 1; });

  // attribute >50 ms tasks from the trace
  const trace = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
  const events = trace.traceEvents ?? trace;
  const names = new Map();
  events.filter((e) => e.name === 'thread_name').forEach((e) => names.set(`${e.pid}:${e.tid}`, e.args.name));
  const mainKeys = [...names.entries()].filter(([, n]) => n === 'CrRendererMain').map(([k]) => k);
  const startMark = events.find((e) => e.name === 'scroll-start');
  const endMark = events.find((e) => e.name === 'scroll-end');
  const tasks = [];
  for (const key of mainKeys) {
    const evs = events.filter((e) => `${e.pid}:${e.tid}` === key && e.ph === 'X');
    const big = evs.filter((e) => (e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask') && e.dur > 50000 && (!startMark || e.ts >= startMark.ts - 1e5) && (!endMark || e.ts <= endMark.ts));
    for (const t of big) {
      const inner = evs.filter((e) => e !== t && e.ts >= t.ts && e.ts + (e.dur || 0) <= t.ts + t.dur && e.dur > 3000);
      const kinds = {};
      for (const e of inner) {
        let label = e.name;
        const d = e.args?.data ?? {};
        if (e.name === 'FunctionCall') label = `FunctionCall ${d.functionName || '(anon)'} ${path.basename(d.url || '')}:${d.lineNumber ?? ''}`;
        else if (e.name === 'EventDispatch') label = `EventDispatch ${d.type}`;
        else if (e.name === 'EvaluateScript' || e.name === 'v8.compile' || e.name === 'CompileScript') label = `${e.name} ${path.basename(d.url || e.args?.fileName || '')}`;
        else if (e.name === 'TimerFire' || e.name === 'FireAnimationFrame' || e.name === 'Layout' || e.name === 'UpdateLayoutTree' || e.name === 'Paint' || e.name === 'PrePaint' || e.name === 'Layerize' || /GC/.test(e.name) || e.name === 'ParseHTML' || e.name === 'HitTest' || e.name === 'ScheduleStyleRecalculation' || e.name === 'Commit' || e.name === 'v8.run' || e.name === 'FunctionCall') label = e.name;
        else continue;
        kinds[label] = Math.max(kinds[label] || 0, e.dur / 1000);
      }
      const top = Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v.toFixed(0)}ms`);
      // scroll position at that moment, from the frame sampler (trace ts is µs since an arbitrary base)
      const rel = startMark ? (t.ts - startMark.ts) / 1000 : null;
      const f0 = run.frames[0]?.t ?? 0;
      const fr = rel !== null ? run.frames.find((f) => f.t - f0 >= rel) : null;
      tasks.push({ ms: +(t.dur / 1000).toFixed(1), atMs: rel && +rel.toFixed(0), section: fr ? at(fr.y) : '?', top });
    }
  }
  report.scroll = {
    cpuThrottle: RATE, speedPxPerS: SPEED, frames: run.frames.length, scrollPx: run.max,
    droppedOver25ms: dropped.length, droppedPct: +((dropped.length / run.frames.length) * 100).toFixed(1),
    worstFrameMs: +worst.dt.toFixed(1), worstAt: at(worst.y ?? 0),
    p50: +sorted[Math.floor(sorted.length * 0.5)].toFixed(1), p95: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1), p99: +sorted[Math.floor(sorted.length * 0.99)].toFixed(1),
    droppedBySection,
    longtasksObserved: run.longtasks.map((l) => ({ ms: +l.dur.toFixed(0), section: at(l.y), attr: l.attr })),
    tasksOver50msFromTrace: tasks.sort((a, b) => (a.atMs ?? 0) - (b.atMs ?? 0)),
  };
  console.log('renderer:', report.renderer);
  console.log('scroll:', JSON.stringify({ ...report.scroll, longtasksObserved: report.scroll.longtasksObserved.length, tasksOver50msFromTrace: tasks.length }, null, 1));
  for (const t of report.scroll.tasksOver50msFromTrace) console.log(`  task ${t.ms}ms @${t.atMs}ms [${t.section}] ${t.top.join(' | ')}`);
  for (const l of report.scroll.longtasksObserved) console.log(`  longtask ${l.ms}ms [${l.section}] ${l.attr}`);
}

/* ---------------- 2. chunk sizes ---------------- */
{
  const root = path.resolve('out');
  const chunksDir = path.join(root, '_next/static');
  const files = [];
  const walkDir = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) walkDir(p); else if (p.endsWith('.js')) files.push(p); });
  walkDir(chunksDir);
  const gz = (buf) => zlib.gzipSync(buf, { level: 9 }).length;
  const markers = {
    works: ['works-heading', 'Selected works'], syntinuum: ['syntinuum-title', 'Syntinuum pillars'], toolWall: ['tool-wall-title', 'Projects and roles'],
    recognition: ['recognition-title', 'recognition-hint'], now: ['Focus distance', 'now-hint'], carbonField: ['carbon-live'], runtime: ['MAX_ANIMATING', 'wakeOnVisible'],
  };
  const sizes = {};
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    for (const [k, ms] of Object.entries(markers)) if (ms.some((m) => s.includes(m))) (sizes[k] ??= []).push({ file: path.relative(root, f).replace(/\\/g, '/'), raw: s.length, gzip: gz(Buffer.from(s)) });
  }
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const initial = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]);
  const initialSizes = initial.map((src) => { const p = path.join(root, src.replace(/^\//, '')); return fs.existsSync(p) ? { src, gzip: gz(fs.readFileSync(p)) } : { src, gzip: null }; });
  report.chunks = { sectionChunks: sizes, initialScripts: initialSizes, initialGzipTotal: initialSizes.reduce((a, b) => a + (b.gzip || 0), 0) };
  console.log('\nsection chunks (gzip -9):');
  for (const [k, v] of Object.entries(sizes)) for (const c of v) console.log(`  ${k}: ${c.file} ${(c.gzip / 1024).toFixed(1)} KB gz (${(c.raw / 1024).toFixed(1)} KB raw)`);
  console.log(`initial <script> total: ${(report.chunks.initialGzipTotal / 1024).toFixed(1)} KB gz over ${initial.length} files`);
}

/* ---------------- 3. Lighthouse ---------------- */
const lhBin = arg('lighthouse', null);
const serveMjs = arg('serve', null);
if (lhBin && serveMjs) {
  const port = Number(arg('port', 4329));
  const server = spawn(process.execPath, [serveMjs, path.resolve('out'), String(port)], { stdio: 'ignore' });
  try {
    await sleep(1200);
    report.lighthouse = {};
    for (const preset of ['mobile', 'desktop']) {
      const out = path.join(OUT, `lh-${preset}.json`);
      const args = [`http://localhost:${port}/`, '--only-categories=performance', '--output=json', `--output-path=${out}`, '--quiet', '--chrome-flags=--headless=new'];
      if (preset === 'desktop') args.push('--preset=desktop');
      const r = spawnSync(lhBin, args, { shell: true, env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' }, encoding: 'utf8', timeout: 240000 });
      if (!fs.existsSync(out)) { console.log(`lighthouse ${preset} failed: ${r.stderr?.slice(-400)}`); continue; }
      const j = JSON.parse(fs.readFileSync(out, 'utf8'));
      const a = j.audits;
      const items = a['network-requests']?.details?.items ?? [];
      const js = items.filter((i) => i.resourceType === 'Script');
      const v = {
        score: Math.round(j.categories.performance.score * 100), lcpS: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(2),
        cls: +a['cumulative-layout-shift'].numericValue.toFixed(3), tbtMs: Math.round(a['total-blocking-time'].numericValue),
        fcpS: +(a['first-contentful-paint'].numericValue / 1000).toFixed(2), jsTransferKB: +(js.reduce((s, i) => s + (i.transferSize || 0), 0) / 1024).toFixed(1), jsFiles: js.length,
        lcpElement: a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 160),
        longTasks: (a['long-tasks']?.details?.items ?? []).slice(0, 6).map((t) => `${path.basename(String(t.url)).slice(0, 40)} ${Math.round(t.duration)}ms`),
      };
      report.lighthouse[preset] = v;
      console.log(`lighthouse ${preset}:`, JSON.stringify(v));
    }
  } finally {
    server.kill();
  }
}

fs.writeFileSync(path.join(OUT, 'perf.json'), JSON.stringify(report, null, 2));
