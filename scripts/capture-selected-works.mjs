import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

const OUT_DIR = path.resolve('out');
const SCREENSHOTS_DIR = path.resolve('screenshots');
const SERVER_PORT = 4567;
const CHROME_PORT = 9228;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(OUT_DIR, reqPath);

    if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(SERVER_PORT, '127.0.0.1', () => {
      console.log(`Static server running at http://127.0.0.1:${SERVER_PORT}`);
      resolve(server);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const staticServer = await startStaticServer();
  const userDataDir = path.join(os.tmpdir(), `chrome-selected-${Date.now()}`);

  console.log(`Spawning headless Chrome on debugging port ${CHROME_PORT}...`);
  const chrome = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${CHROME_PORT}`,
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${userDataDir}`,
      `http://127.0.0.1:${SERVER_PORT}/`,
    ],
    { stdio: 'ignore' }
  );

  let ws;

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json`);
        targets = await res.json();
        if (targets && targets.some((t) => t.type === 'page')) break;
      } catch {
        await sleep(250);
      }
    }

    if (!targets) throw new Error('Could not connect to Chrome debugging port');
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

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

    // Viewport 1: Desktop 1920x1080
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to homepage...');
    await send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/#projects` });
    await sleep(3500);

    // Scroll to #projects section
    const scrollInfo = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          const section = document.getElementById('projects');
          if (!section) return { found: false };
          const rect = section.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 20, behavior: 'instant' });
          return {
            found: true,
            top: rect.top,
            scrollY: window.scrollY
          };
        })()
      `,
    });
    console.log('Scrolled to #projects:', scrollInfo.result?.value);
    await sleep(1500);

    // Screenshot 1: Section Header & Healios V2 Spread (Plate 01)
    const shotHeaderHealios = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'selected_works_01_healios_desktop.png'),
      Buffer.from(shotHeaderHealios.data, 'base64')
    );
    console.log('Saved selected_works_01_healios_desktop.png');

    // Click "Grad-CAM XAI" tab on Healios
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const xaiBtn = buttons.find(b => b.textContent.includes('Grad-CAM XAI'));
          if (xaiBtn) xaiBtn.click();
        })()
      `,
    });
    await sleep(600);
    const shotHealiosXai = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'selected_works_01_healios_xai_desktop.png'),
      Buffer.from(shotHealiosXai.data, 'base64')
    );
    console.log('Saved selected_works_01_healios_xai_desktop.png');

    // Scroll down to Plate 02: Apexis Telemetry Engine
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const headings = Array.from(document.querySelectorAll('h3'));
          const apexis = headings.find(h => h.textContent.includes('Apexis Telemetry Engine'));
          if (apexis) {
            const rect = apexis.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: 'instant' });
          }
        })()
      `,
    });
    await sleep(1000);
    const shotApexis = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'selected_works_02_apexis_desktop.png'),
      Buffer.from(shotApexis.data, 'base64')
    );
    console.log('Saved selected_works_02_apexis_desktop.png');

    // Scroll down to Plate 03: RouteRx / Careline
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const headings = Array.from(document.querySelectorAll('h3'));
          const routerx = headings.find(h => h.textContent.includes('RouteRx / Careline'));
          if (routerx) {
            const rect = routerx.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: 'instant' });
          }
        })()
      `,
    });
    await sleep(1000);
    const shotRouteRx = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'selected_works_03_routerx_desktop.png'),
      Buffer.from(shotRouteRx.data, 'base64')
    );
    console.log('Saved selected_works_03_routerx_desktop.png');

    // Scroll down to Plate 04: Tempo Task Suite
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const headings = Array.from(document.querySelectorAll('h3'));
          const tempo = headings.find(h => h.textContent.includes('Tempo Task Suite'));
          if (tempo) {
            const rect = tempo.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 100, behavior: 'instant' });
          }
        })()
      `,
    });
    await sleep(1000);
    const shotTempo = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'selected_works_04_tempo_desktop.png'),
      Buffer.from(shotTempo.data, 'base64')
    );
    console.log('Saved selected_works_04_tempo_desktop.png');

    // Viewport 2: Mobile 375x812 (iPhone X/12 viewport)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1000);

    // Scroll back to #projects top on mobile
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.getElementById('projects');
          if (section) {
            const rect = section.getBoundingClientRect();
            window.scrollTo({ top: window.scrollY + rect.top - 20, behavior: 'instant' });
          }
        })()
      `,
    });
    await sleep(1200);

    // Check horizontal overflow on mobile
    const overflowCheck = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          return {
            docWidth: document.documentElement.scrollWidth,
            winWidth: window.innerWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
          };
        })()
      `,
    });
    console.log('Mobile overflow check:', overflowCheck.result?.value);

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'selected_works_mobile_viewport.png'),
      Buffer.from(shotMobile.data, 'base64')
    );
    console.log('Saved selected_works_mobile_viewport.png');

    console.log('✅ Visual verification complete. All screenshots captured.');
  } finally {
    if (ws) ws.close();
    chrome.kill('SIGKILL');
    staticServer.close();
  }
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
