import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9228;
const SCREENSHOTS_DIR = path.resolve('screenshots');

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  const userDataDir = path.join(os.tmpdir(), `chrome-graph-${Date.now()}`);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:3001/',
  ]);

  let targets = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      targets = await res.json();
      if (targets && targets.some((t) => t.type === 'page')) break;
    } catch {
      await sleep(250);
    }
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const pendingPromises = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pendingPromises.has(data.id)) {
      const { resolve, reject } = pendingPromises.get(data.id);
      pendingPromises.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = msgId++;
      pendingPromises.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');

  // Desktop Viewport (1920x1080)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Navigating to http://localhost:3001/...');
  await send('Page.navigate', { url: 'http://localhost:3001/' });
  await sleep(4000);

  // Scroll to Systems Archive header
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Engineering Systems Archive'));
        if (h3) {
          const rect = h3.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 90, behavior: 'instant' });
        }
      })()
    `,
  });

  await sleep(1500);

  // Desktop Constellation & Integrated Inspector
  const screenshot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'archive_native_desktop_constellation.png'), Buffer.from(screenshot1.data, 'base64'));
  console.log('Saved archive_native_desktop_constellation.png');

  // Switch to Hierarchy Drill-Down View
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const hierBtn = btns.find(b => b.textContent.includes('Hierarchy'));
        if (hierBtn) hierBtn.click();
      })()
    `,
  });

  await sleep(1500);

  const screenshot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'archive_native_desktop_hierarchy.png'), Buffer.from(screenshot2.data, 'base64'));
  console.log('Saved archive_native_desktop_hierarchy.png');

  // Click on a project node (TamilTrove) to test inspector update
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const nodes = Array.from(document.querySelectorAll('g[role="button"]'));
        const tamil = nodes.find(n => n.textContent.includes('TamilTrove'));
        if (tamil) tamil.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      })()
    `,
  });

  await sleep(1200);

  const screenshot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'archive_native_desktop_inspected.png'), Buffer.from(screenshot3.data, 'base64'));
  console.log('Saved archive_native_desktop_inspected.png');

  // Mobile Viewport (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await send('Page.navigate', { url: 'http://localhost:3001/#archive' });
  await sleep(2500);

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Engineering Systems Archive'));
        if (h3) {
          const rect = h3.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'instant' });
        }
      })()
    `,
  });

  await sleep(1500);

  const screenshotMobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'archive_native_mobile.png'), Buffer.from(screenshotMobile.data, 'base64'));
  console.log('Saved archive_native_mobile.png');

  // Navigate to /projects on Desktop (1920x1080)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Navigating to http://localhost:3001/projects...');
  await send('Page.navigate', { url: 'http://localhost:3001/projects' });
  await sleep(3000);

  const screenshotProjects1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'projects_page_topology.png'), Buffer.from(screenshotProjects1.data, 'base64'));
  console.log('Saved projects_page_topology.png');

  // Click on Timing Sheet Ledger button
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const ledgerBtn = btns.find(b => b.textContent.includes('Timing Sheet Ledger'));
        if (ledgerBtn) ledgerBtn.click();
      })()
    `,
  });

  await sleep(1500);

  const screenshotProjects2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'projects_page_ledger.png'), Buffer.from(screenshotProjects2.data, 'base64'));
  console.log('Saved projects_page_ledger.png');

  ws.close();
  chrome.kill();
  console.log('Done!');
}

capture().catch(console.error);
