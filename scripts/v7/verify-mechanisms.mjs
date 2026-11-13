#!/usr/bin/env node
/**
 * V7 verification: the five mechanisms driven by click, drag, keys and scroll, asserting ARIA state.
 * Runs each width in normal motion and with prefers-reduced-motion: reduce. In both modes it also
 * reports pinned (sticky) elements; under reduced motion it asserts none pin and CarbonField is not live.
 * Usage: npm run build && node scripts/v7/verify-mechanisms.mjs [--widths 1440x900] [--modes normal,reduce] [--only works,now]
 * Writes .v7/after/mechanisms.json. Exits 1 on any failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { OUT, ORIGIN, WIDTHS, launch, newContext, collectConsole, sleep, scrollToY, walk } from './verify-lib.mjs';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const widths = arg('widths', null)?.split(',').map((s) => s.split('x').map(Number)) ?? WIDTHS;
const modes = arg('modes', 'normal,reduce').split(',');
const only = arg('only', 'works,syntinuum,toolwall,recognition,now,pins').split(',');
const query = arg('query', '?tier=static'); // mechanisms do not depend on the WebGL field
const CHECK_TIMEOUT = Number(arg('check-timeout', 150000));

const results = [];
let ctxTag = '';
const rec = (section, check, pass, detail = '') => {
  results.push({ at: ctxTag, section, check, pass: !!pass, detail });
  console.log(`  ${pass ? 'PASS' : 'FAIL'} [${section}] ${check}${detail ? ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''}`);
};

const docTop = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().top + window.scrollY : null; }, sel);
const centerOn = async (page, sel, settle = 500) => {
  const y = await page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2 - innerHeight / 2;
  }, sel);
  await scrollToY(page, y, settle);
};
async function drag(page, from, to, { steps = 14, stepMs = 25, holdMs = 160 } = {}) {
  await page.mouse.move(from[0], from[1]);
  await page.mouse.down();
  for (let k = 1; k <= steps; k++) {
    await page.mouse.move(from[0] + ((to[0] - from[0]) * k) / steps, from[1] + ((to[1] - from[1]) * k) / steps);
    await sleep(stepMs);
  }
  await sleep(holdMs);
  await page.mouse.up();
}

/* ======================= Works ======================= */
async function works(page, w, h, reduced) {
  const state = () => page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#projects [role=tab]')];
    const sel = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const title = [...document.querySelectorAll('#works-panel h3')].find((x) => !x.closest('[aria-hidden="true"]'))?.textContent?.trim();
    return { sel, title, tab: tabs[sel]?.textContent?.trim(), n: tabs.length };
  });
  const ok = (s, i) => s.sel === i && !!s.title && s.tab?.endsWith(s.title);
  const pin = await page.evaluate(() => {
    const sec = document.querySelector('#projects');
    const r = sec.getBoundingClientRect();
    return { top: r.top + scrollY, travel: r.height - sec.firstElementChild.offsetHeight };
  });
  const toStop = (k) => scrollToY(page, pin.top + (pin.travel > 0 ? ((k + 0.5) / 4) * pin.travel : 0), 900);
  const home = async () => (pin.travel > 0 ? toStop(0) : centerOn(page, '#projects [data-cursor="rotate"]', 600));

  // A. tab click (the tablist is visually hidden; activate the real buttons)
  await home();
  const tabSeq = [];
  for (const i of [1, 2, 3, 0]) {
    await page.locator('#projects [role=tab]').nth(i).dispatchEvent('click');
    await sleep(reduced ? 400 : 900);
    const s = await state();
    tabSeq.push(ok(s, i) ? i : `want ${i} got ${s.sel}/${s.title}`);
  }
  rec('works', 'tab click lands on each of 4 projects', tabSeq.every((x) => typeof x === 'number'), tabSeq.join(','));

  // A2. click a visible sector of the wheel with the mouse
  const secSeq = [];
  for (const i of [2, 1, 3, 0]) {
    const pt = await page.evaluate(({ i, w, h }) => {
      const cands = [...document.querySelectorAll('#projects [data-sector]')].filter((g) => Number(g.dataset.sector) % 4 === i);
      for (const g of cands) {
        const r = g.querySelector('path').getBoundingClientRect();
        // sample along the sector bbox for a point that hits this sector
        for (const fx of [0.5, 0.35, 0.65, 0.2, 0.8]) for (const fy of [0.5, 0.35, 0.65, 0.2, 0.8]) {
          const x = r.left + r.width * fx, y = r.top + r.height * fy;
          if (x < 2 || y < 2 || x > w - 2 || y > h - 2) continue;
          const hit = document.elementFromPoint(x, y);
          if (hit && hit.closest('[data-sector]') === g) return [x, y];
        }
      }
      return null;
    }, { i, w, h });
    if (!pt) { secSeq.push(`no visible sector for ${i}`); continue; }
    await page.mouse.click(pt[0], pt[1]);
    await sleep(reduced ? 400 : 900);
    const s = await state();
    secSeq.push(ok(s, i) ? i : `want ${i} got ${s.sel}`);
  }
  rec('works', 'mouse click on wheel sector lands on each project', secSeq.every((x) => typeof x === 'number'), secSeq.join(','));

  // B. drag on the wheel, 45° per drag about its centre
  await home();
  const geo = await page.evaluate(() => {
    const el = document.querySelector('#projects [data-cursor="rotate"]');
    const r = el.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, R: r.width / 2, mobile: matchMedia('(max-width: 767px)').matches };
  });
  const apex = geo.mobile ? -90 : 0;
  const at = (deg, rr = 0.78) => [geo.cx + geo.R * rr * Math.cos((deg * Math.PI) / 180), geo.cy + geo.R * rr * Math.sin((deg * Math.PI) / 180)];
  const dragSeq = [];
  let prev = (await state()).sel;
  for (let k = 0; k < 4; k++) {
    await drag(page, at(apex + 22), at(apex - 24), { steps: 16, stepMs: 30, holdMs: 200 });
    await sleep(reduced ? 500 : 1100);
    const s = await state();
    dragSeq.push(s.sel);
    if (!ok(s, s.sel) || s.sel === prev) dragSeq.push('!');
    prev = s.sel;
  }
  const dragVisited = new Set(dragSeq.filter((x) => typeof x === 'number'));
  rec('works', 'pointer drag steps one project per 45° drag, visits all 4', dragVisited.size === 4 && !dragSeq.includes('!'), `start→${dragSeq.join(',')}`);

  // C. keys on the tablist
  await home();
  await page.locator('#projects [role=tab][aria-selected=true]').focus();
  const keySeq = [];
  for (let k = 0; k < 4; k++) { await page.keyboard.press('ArrowDown'); await sleep(reduced ? 300 : 700); keySeq.push((await state()).sel); }
  const keyFocusOk = await page.evaluate(() => document.activeElement?.getAttribute('aria-selected') === 'true');
  await page.keyboard.press('Home'); await sleep(reduced ? 300 : 800); const sHome = await state();
  await page.keyboard.press('End'); await sleep(reduced ? 300 : 800); const sEnd = await state();
  await page.keyboard.press('ArrowUp'); await sleep(reduced ? 300 : 800); const sUp = await state();
  rec('works', 'ArrowDown visits all 4; Home→0; End→3; ArrowUp steps back; focus follows',
    new Set(keySeq).size === 4 && ok(sHome, 0) && ok(sEnd, 3) && ok(sUp, 2) && keyFocusOk,
    `down ${keySeq.join(',')} home ${sHome.sel} end ${sEnd.sel} up ${sUp.sel} focusOnSelected ${keyFocusOk}`);

  // D. scroll through the pinned stops
  if (!reduced) {
    if (pin.travel <= 0) rec('works', 'section is pinned (four scroll stops)', false, 'no scroll travel');
    else {
      const seq = [];
      for (const k of [0, 1, 2, 3, 2, 1, 0]) { await toStop(k); const s = await state(); seq.push(ok(s, k) ? k : `want ${k} got ${s.sel}`); }
      rec('works', 'scrolling the pin lands on stops 0-3 and back', seq.every((x) => typeof x === 'number'), seq.join(','));
    }
  }
}

/* ======================= Syntinuum ======================= */
async function syntinuum(page, w, h, reduced) {
  const root = '#podcast [data-cursor="hairline"]';
  await centerOn(page, root, 700);
  const state = () => page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#podcast [role=tab]')];
    const panels = [...document.querySelectorAll('#podcast [role=tabpanel]')];
    return {
      committed: tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
      shown: panels.findIndex((p) => p.getAttribute('aria-hidden') === 'false'),
      shownTitle: panels.find((p) => p.getAttribute('aria-hidden') === 'false')?.querySelector('h3')?.textContent?.trim(),
      n: tabs.length,
    };
  });
  const box = await page.locator(root).boundingBox();
  const zoneX = (i) => box.x + box.width * ((i + 0.5) / 3);
  const away = async () => { await page.mouse.move(Math.min(w - 4, box.x + box.width / 2), Math.max(4, box.y - 120)); await sleep(reduced ? 350 : 600); };
  const wait = reduced ? 350 : 600;

  const tabSeq = [];
  for (const i of [1, 2, 0]) { await page.locator('#podcast [role=tab]').nth(i).click(); await away(); const s = await state(); tabSeq.push(s.committed === i && s.shown === i ? i : JSON.stringify(s)); }
  rec('syntinuum', 'click each numeral tab commits its zone', tabSeq.every((x) => typeof x === 'number'), tabSeq.join(','));

  const wfSeq = [];
  for (const i of [2, 0, 1]) { await page.mouse.click(zoneX(i), box.y + box.height * 0.2); await sleep(wait); const s = await state(); await away(); const s2 = await state(); wfSeq.push(s.committed === i && s2.shown === i ? i : `want ${i} ${JSON.stringify(s)}`); }
  rec('syntinuum', 'click on each waveform zone commits it', wfSeq.every((x) => typeof x === 'number'), wfSeq.join(','));

  await page.locator('#podcast [role=tab]').nth(0).click(); await away();
  await page.locator('#podcast [role=tab][aria-selected=true]').focus();
  const keySeq = [];
  for (let k = 0; k < 3; k++) { await page.keyboard.press('ArrowRight'); await sleep(wait); keySeq.push((await state()).committed); }
  await page.keyboard.press('ArrowLeft'); await sleep(wait); const sl = await state();
  await page.keyboard.press('End'); await sleep(wait); const se = await state();
  await page.keyboard.press('Home'); await sleep(wait); const sh = await state();
  rec('syntinuum', 'ArrowRight cycles 1,2,0; ArrowLeft back; End→2; Home→0',
    keySeq.join(',') === '1,2,0' && sl.committed === 2 && se.committed === 2 && sh.committed === 0 && sh.shown === 0,
    `right ${keySeq.join(',')} left ${sl.committed} end ${se.committed} home ${sh.committed}`);

  // hover previews, leave returns to the committed zone
  await away();
  const y = box.y + box.height * 0.2;
  await page.mouse.move(zoneX(2), y); await sleep(wait); const p2 = await state();
  await page.mouse.move(zoneX(1), y, { steps: 6 }); await sleep(wait); const p1 = await state();
  await away(); const back = await state();
  rec('syntinuum', 'hover previews zone (committed unchanged); pointer-leave returns to committed',
    p2.committed === 0 && p2.shown === 2 && p1.shown === 1 && p1.committed === 0 && back.shown === 0 && back.committed === 0,
    `hover2 ${JSON.stringify(p2)} hover1 shown ${p1.shown} leave shown ${back.shown}`);
}

/* ======================= Technical Index ======================= */
async function toolwall(page, w, h, reduced) {
  await scrollToY(page, (await docTop(page, '#skills')) - 40, 900);
  const read = () => page.evaluate(() => {
    const tools = [...document.querySelectorAll('#skills button[aria-pressed]')];
    const names = [...document.querySelectorAll('#skills ul[aria-label="Projects and roles"] a')];
    const live = document.querySelector('#skills p[aria-live]');
    return {
      tools: tools.map((t) => ({ id: t.getAttribute('aria-label'), st: t.dataset.state, op: +getComputedStyle(t).opacity, pressed: t.getAttribute('aria-pressed') })),
      names: names.map((n) => ({ name: n.textContent.trim(), st: n.dataset.state, op: +getComputedStyle(n).opacity })),
      readout: live?.textContent?.trim() ?? '',
    };
  });
  const wait = reduced ? 320 : 320;
  const init = await read();
  const T = init.tools.map((t) => t.id);
  const N = init.names.map((n) => n.name);
  rec('toolwall', 'wall renders', T.length > 0 && N.length > 0, `${T.length} tools, ${N.length} names`);

  // tool hover
  const byTool = {};
  const hoverIssues = [];
  for (let i = 0; i < T.length; i++) {
    await page.locator('#skills button[aria-pressed]').nth(i).hover();
    await sleep(wait);
    const s = await read();
    const rest = s.names.filter((n) => n.st === 'rest').map((n) => n.name);
    byTool[T[i]] = rest;
    if (s.tools[i].st !== 'on') hoverIssues.push(`${T[i]}: not on`);
    const badDim = s.names.filter((n) => n.st === 'dim' && Math.abs(n.op - 0.25) > 0.03);
    if (badDim.length) hoverIssues.push(`${T[i]}: dim opacity ${badDim.map((n) => n.op).join('/')}`);
    const badRest = s.names.filter((n) => n.st === 'rest' && n.op < 0.97);
    if (badRest.length) hoverIssues.push(`${T[i]}: user name opacity ${badRest.map((n) => n.op).join('/')}`);
    const want = rest.length ? `Used in ${rest.join(', ')}` : 'Hands-on, outside shipped work';
    // readout lists the linked names; compare as sets
    if (rest.length) {
      const listed = (s.readout.split('Used in ')[1] || '').replace(/\.$/, '').split(', ').map((x) => x.trim()).filter(Boolean);
      if (listed.sort().join('|') !== [...rest].sort().join('|')) hoverIssues.push(`${T[i]}: readout [${listed}] vs kept [${rest}]`);
    } else if (!s.readout.includes('Hands-on')) hoverIssues.push(`${T[i]}: no-link readout "${s.readout}" (want ${want})`);
  }
  const unlinked = T.filter((t) => byTool[t].length === 0);
  rec('toolwall', 'hover each tool: unrelated names → 25%, users stay 100%, readout matches', hoverIssues.length === 0,
    hoverIssues.length ? hoverIssues.slice(0, 8).join('; ') : `${T.length} tools; unlinked: ${unlinked.join(', ') || 'none'}`);

  // name hover → its tools ignite; bidirectional consistency
  const byName = {};
  const nameIssues = [];
  for (let j = 0; j < N.length; j++) {
    await page.locator('#skills ul[aria-label="Projects and roles"] a').nth(j).hover();
    await sleep(wait);
    const s = await read();
    byName[N[j]] = s.tools.filter((t) => t.st === 'on').map((t) => t.id);
    if (s.names[j].st !== 'rest') nameIssues.push(`${N[j]} dimmed itself`);
    const badDim = s.tools.filter((t) => t.st === 'dim' && Math.abs(t.op - 0.25) > 0.03);
    if (badDim.length) nameIssues.push(`${N[j]}: tool dim opacity ${badDim[0].op}`);
    if (!byName[N[j]].length) nameIssues.push(`${N[j]}: ignites no tools`);
  }
  const mismatch = [];
  for (const t of T) for (const n of N) if (byTool[t].includes(n) !== byName[n].includes(t)) mismatch.push(`${t}↔${n}`);
  rec('toolwall', 'hover each name ignites its tools; tool→name and name→tool agree', nameIssues.length === 0 && mismatch.length === 0,
    [...nameIssues.slice(0, 5), ...(mismatch.length ? [`mismatch ${mismatch.length}: ${mismatch.slice(0, 6).join(', ')}`] : [])].join('; ') || `${N.length} names`);

  // keyboard focus walks the wall
  await page.mouse.move(w - 3, 3);
  await sleep(200);
  const rows = await page.evaluate(() => [...document.querySelectorAll('#skills [role=toolbar]')].map((tb) => tb.querySelectorAll('button').length));
  const focusIssues = [];
  let visited = 0;
  for (let r = 0; r < rows.length; r++) {
    await page.locator('#skills [role=toolbar]').nth(r).locator('button').first().focus();
    await page.keyboard.press('End'); await page.keyboard.press('Home'); await sleep(wait);
    for (let i = 0; i < rows[r]; i++) {
      const s = await read();
      const id = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
      const rest = s.names.filter((n) => n.st === 'rest').map((n) => n.name);
      const anyDim = s.names.some((n) => n.st === 'dim');
      visited++;
      if (!anyDim && byTool[id]?.length !== N.length) focusIssues.push(`${id}: focus did not activate`);
      else if (rest.sort().join('|') !== [...(byTool[id] || [])].sort().join('|')) focusIssues.push(`${id}: focus kept [${rest}] hover kept [${byTool[id]}]`);
      await page.keyboard.press('ArrowRight'); await sleep(wait);
    }
  }
  rec('toolwall', 'keyboard focus (arrows) activates the same cross-highlight as hover', focusIssues.length === 0 && visited === T.length,
    focusIssues.length ? focusIssues.slice(0, 5).join('; ') : `${visited} tools focused`);

  // click pins; Esc and second click clear
  const pinTool = T.find((t) => byTool[t].length > 0 && byTool[t].length < N.length) ?? T[0];
  const idx = T.indexOf(pinTool);
  await page.locator('#skills button[aria-pressed]').nth(idx).click();
  await page.mouse.move(w - 3, 3); await sleep(wait);
  const sp = await read();
  const keptPinned = sp.names.filter((n) => n.st === 'rest').map((n) => n.name);
  const pinnedOk = sp.tools[idx].pressed === 'true' && keptPinned.sort().join('|') === [...byTool[pinTool]].sort().join('|');
  await page.locator('#skills button[aria-pressed]').nth(idx).focus();
  await page.keyboard.press('Escape'); await sleep(wait);
  const se = await read();
  await page.locator('#skills button[aria-pressed]').nth(idx).click(); await page.mouse.move(w - 3, 3); await sleep(wait);
  await page.locator('#skills button[aria-pressed]').nth(idx).click(); await page.mouse.move(w - 3, 3); await sleep(wait);
  const s2 = await read();
  rec('toolwall', 'click pins (persists after pointer leaves); Esc clears; second click unpins',
    pinnedOk && se.tools[idx].pressed === 'false' && s2.tools[idx].pressed === 'false' && s2.names.every((n) => n.st === 'rest'),
    `pin ${pinTool}: pressed ${sp.tools[idx].pressed}, kept [${keptPinned}]; after Esc ${se.tools[idx].pressed}; after 2 clicks ${s2.tools[idx].pressed}`);
}

/* ======================= Recognition ======================= */
async function recognition(page, w, h, reduced) {
  const stage = '#achievements [role=tablist]';
  await centerOn(page, stage, 900);
  const state = () => page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#achievements [role=tab]')];
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const panel = document.querySelector('#recognition-panel');
    const shown = panel ? [...panel.querySelectorAll(':scope > *')].find((c) => c.getAttribute('aria-hidden') !== 'true') : null;
    return { i, n: tabs.length, label: tabs[i]?.getAttribute('aria-label'), panel: shown?.textContent?.trim().slice(0, 60) ?? panel?.textContent?.trim().slice(0, 60) };
  });
  const wait = reduced ? 450 : 1300;
  const s0 = await state();
  const n = s0.n;
  rec('recognition', 'medallion count matches awards file (3)', n === 3, `${n} tabs`);

  await page.locator(`${stage} [role=tab][aria-selected=true]`).focus();
  const seq = [s0.i];
  for (let k = 0; k < n; k++) { await page.keyboard.press('ArrowRight'); await sleep(wait); seq.push((await state()).i); }
  const steps = seq.slice(1).every((v, k) => v === (seq[k] + 1) % n);
  await page.keyboard.press('ArrowLeft'); await sleep(wait); const sl = await state();
  await page.keyboard.press('End'); await sleep(wait); const se = await state();
  await page.keyboard.press('Home'); await sleep(wait); const sh = await state();
  const panelChanges = new Set();
  for (let k = 0; k < n; k++) { await page.keyboard.press('ArrowRight'); await sleep(wait); panelChanges.add((await state()).panel); }
  rec('recognition', 'ArrowRight reaches every medallion (+1 each, wraps); ArrowLeft back; Home/End; panel text follows',
    steps && new Set(seq).size === n && sl.i === (seq[seq.length - 1] - 1 + n) % n && se.i === n - 1 && sh.i === 0 && panelChanges.size === n,
    `right ${seq.join('→')} left ${sl.i} end ${se.i} home ${sh.i}; ${panelChanges.size} distinct panel texts`);

  // drag: about 0.6 of one orbit position to the left
  await page.mouse.move(w - 3, 3);
  const b = await page.locator(stage).boundingBox();
  const D = Math.max(80, 0.6 * ((0.23 * w * 2 * Math.PI) / n));
  const cy = Math.min(h - 10, Math.max(10, b.y + b.height / 2));
  const dseq = [(await state()).i];
  for (let k = 0; k < n; k++) {
    await drag(page, [w / 2 + D / 2, cy], [w / 2 - D / 2, cy], { steps: 16, stepMs: 28, holdMs: 120 });
    await sleep(wait + 300);
    dseq.push((await state()).i);
  }
  const url = page.url();
  const dsteps = dseq.slice(1).every((v, k) => v !== dseq[k]);
  rec('recognition', 'drag left reaches every medallion (no navigation)', new Set(dseq).size === n && dsteps && !/\/projects\/|\.pdf/.test(url),
    `drag ${Math.round(D)}px: ${dseq.join('→')}; url ${url.replace(ORIGIN, '')}`);
  // drag right steps back
  await drag(page, [w / 2 - D / 2, cy], [w / 2 + D / 2, cy], { steps: 16, stepMs: 28, holdMs: 120 });
  await sleep(wait + 300);
  const back = (await state()).i;
  rec('recognition', 'drag right steps back one medallion', back === (dseq[dseq.length - 1] - 1 + n) % n, `${dseq[dseq.length - 1]}→${back}`);
}

/* ======================= Now ======================= */
async function now(page, w, h, reduced) {
  const slider = '#now [role=slider]';
  const state = () => page.evaluate(() => {
    const s = document.querySelector('#now [role=slider]');
    const cur = [...document.querySelectorAll('#now button')].findIndex((b) => b.getAttribute('aria-current') === 'true');
    return { v: Number(s.getAttribute('aria-valuenow')), text: s.getAttribute('aria-valuetext'), cur };
  });
  const pin = await page.evaluate(() => {
    const sec = document.querySelector('#now');
    const r = sec.getBoundingClientRect();
    const stage = sec.querySelector('[data-cursor="focus"]');
    return { top: r.top + scrollY, runway: r.height - stage.offsetHeight };
  });
  const toStop = (k) => scrollToY(page, pin.top + ((k + 0.5) / 3) * pin.runway, 1000);
  const home = async () => (pin.runway > 1 && !reduced ? toStop(0) : centerOn(page, slider, 600));
  const wait = reduced ? 400 : 1000;
  const ok = (s, k) => s.v === k && s.cur === k;

  if (!reduced) {
    if (pin.runway <= 1) rec('now', 'section is pinned (three scroll stops)', false, 'no runway');
    else {
      const seq = [];
      for (const k of [0, 1, 2, 1, 0]) { await toStop(k); const s = await state(); seq.push(ok(s, k) ? k : `want ${k} got ${s.v}`); }
      rec('now', 'scrolling the pin lands on stops 0,1,2 and back', seq.every((x) => typeof x === 'number'), seq.join(','));
    }
  }

  // ring drag
  await home();
  const rb = await page.locator(slider).boundingBox();
  const spacing = Math.min(300, Math.max(112, rb.width * 0.24));
  const y = rb.y + rb.height * 0.6;
  const dseq = [(await state()).v];
  for (const dir of [-1, -1, 1, 1]) {
    await drag(page, [rb.x + rb.width / 2, y], [rb.x + rb.width / 2 + dir * 0.85 * spacing, y], { steps: 14, stepMs: 30, holdMs: 160 });
    await sleep(wait);
    dseq.push((await state()).v);
  }
  rec('now', 'ring drag racks 0→1→2→1→0', dseq.join(',') === '0,1,2,1,0', `${dseq.join(',')} (drag ${Math.round(0.85 * spacing)}px)`);

  // click a subject
  await home();
  const cseq = [];
  for (const k of [2, 1, 0]) {
    const btn = page.locator('#now button').nth(k);
    await btn.click({ timeout: 5000 }).catch(async (e) => { cseq.push(`click ${k} failed: ${String(e).split('\n')[0].slice(0, 80)}`); });
    await sleep(wait);
    const s = await state();
    cseq.push(ok(s, k) ? k : `want ${k} got ${s.v}/${s.cur}`);
  }
  rec('now', 'click each subject focuses it', cseq.every((x) => typeof x === 'number'), cseq.join(','));

  // keys
  await home();
  await page.locator(slider).focus();
  const kseq = [(await state()).v];
  for (const key of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'Home', 'End']) { await page.keyboard.press(key); await sleep(wait); kseq.push((await state()).v); }
  const vt = (await state()).text;
  rec('now', 'keys: Right,Right,(clamp),Left,Home,End → 1,2,2,1,0,2; valuetext set', kseq.join(',') === '0,1,2,2,1,0,2' && !!vt, `${kseq.join(',')} "${vt}"`);
}

/* ======================= Pins (sticky that stays put > 1 viewport) ======================= */
async function pins(page, w, h, reduced) {
  const list = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('main *').forEach((el, idx) => {
      const p = getComputedStyle(el).position;
      if (p !== 'sticky' && p !== 'fixed') return;
      const par = el.parentElement.getBoundingClientRect();
      out.push({ idx, pos: p, section: el.closest('[data-section]')?.dataset.section, top: par.top + scrollY, bottom: par.bottom + scrollY, cls: String(el.className).slice(0, 50) });
    });
    return out;
  });
  const pinned = [];
  for (const s of list) {
    const step = h / 4;
    let run = 0, best = 0, last = null;
    for (let y = Math.max(0, s.top - h / 2); y <= s.bottom; y += step) {
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
      await sleep(30);
      const t = await page.evaluate((i) => document.querySelectorAll('main *')[i].getBoundingClientRect().top, s.idx);
      if (last !== null && Math.abs(t - last) < 2) { run += step; best = Math.max(best, run); } else run = 0;
      last = t;
    }
    if (best > h) pinned.push(`${s.section}(${s.pos}, ${(best / h).toFixed(1)}vh)`);
  }
  const live = await page.evaluate(() => ({ live: document.documentElement.classList.contains('carbon-live'), rm: document.documentElement.classList.contains('reduced-motion'), tier: document.documentElement.dataset.tier }));
  if (reduced) {
    rec('pins', 'no section pinned under reduced motion', pinned.length === 0, pinned.join(', ') || `${list.length} sticky/fixed candidates, none pinned`);
    rec('pins', 'CarbonField not live (html lacks carbon-live) with ?tier=full', !live.live && live.rm, JSON.stringify(live));
  } else {
    rec('pins', 'pinned sections ≤ 3 (expect works, experience, now)', pinned.length <= 3 && pinned.length > 0, pinned.join(', '));
    rec('pins', 'CarbonField live at ?tier=full', live.live, JSON.stringify(live));
  }
}

/* ======================= run ======================= */
const browser = await launch();
const fns = { works, syntinuum, toolwall, recognition, now, pins };
const consoleByRun = {};
for (const [w, h] of widths) {
  for (const mode of modes) {
    const reduced = mode === 'reduce';
    ctxTag = `${w}x${h}/${mode}`;
    console.log(`\n== ${ctxTag}`);
    const ctx = await newContext(browser, [w, h], reduced ? { reducedMotion: 'reduce' } : {});
    for (const name of only) {
      const page = await ctx.newPage();
      page.setDefaultTimeout(8000);
      page.setDefaultNavigationTimeout(15000);
      console.log(`-- ${ctxTag} ${name} (${new Date().toISOString().slice(11, 19)})`);
      const logs = [];
      collectConsole(page, logs);
      await page.goto(`${ORIGIN}/?tier=full`, { waitUntil: 'networkidle' });
      await sleep(900);
      await walk(page, 700, 40);
      try { await fns[name](page, w, h, reduced); } catch (e) { rec(name, 'ran without exception', false, String(e).split('\n')[0].slice(0, 200)); }
      const bad = logs.filter((l) => l.type !== 'log' && l.type !== 'info' && l.type !== 'debug');
      if (bad.length) consoleByRun[`${ctxTag}/${name}`] = bad;
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
const suffix = `${widths.map((x) => x.join('x')).join('_')}_${modes.join('-')}`;
fs.writeFileSync(path.join(OUT, `mechanisms_${suffix}.json`), JSON.stringify({ results, consoleByRun }, null, 2));
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} passed`);
if (Object.keys(consoleByRun).length) console.log('console during mechanism runs:', JSON.stringify(consoleByRun, null, 1).slice(0, 3000));
process.exit(fails.length ? 1 : 0);
