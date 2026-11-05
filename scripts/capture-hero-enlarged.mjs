import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;
const BASE_URL = process.env.BASE_URL || 'http://localhost:53313';
const SCREENSHOTS_DIR = path.resolve('screenshots');
const MOBILE_DIR = path.join(SCREENSHOTS_DIR, 'mobile');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  if (!fs.existsSync(MOBILE_DIR)) fs.mkdirSync(MOBILE_DIR, { recursive: true });

  const userDataDir = path.join(os.tmpdir(), `chrome-hero-${Date.now()}`);
  console.log(`🚀 Spawning headless Chrome on port ${PORT}...`);
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-extensions',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    `--user-data-dir=${userDataDir}`,
    `${BASE_URL}/`,
  ], { stdio: 'ignore' });

  let ws;

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json`);
        targets = await res.json();
        if (targets && targets.some(t => t.type === 'page' && !t.url.startsWith('chrome-extension://'))) break;
      } catch {
        await sleep(250);
      }
    }

    if (!targets || targets.length === 0) {
      throw new Error('Could not connect to Chrome debugging endpoint');
    }

    const pageTarget = targets.find((t) => t.type === 'page' && !t.url.startsWith('chrome-extension://')) || targets[0];
    console.log(`🔗 Connecting to: ${pageTarget.url}`);
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

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. DESKTOP VIEWPORT (1920x1080)
    console.log('🖥️ Capturing Desktop Hero (1920x1080)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: `${BASE_URL}/` });
    await sleep(4000); // Wait for ballistic launch and hover oscillation

    const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, '01_hero.png'), Buffer.from(shotDesktop.data, 'base64'));
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'hero_enlarged_desktop.png'), Buffer.from(shotDesktop.data, 'base64'));
    console.log('✅ Desktop Hero captured and saved.');

    // 2. MOBILE VIEWPORT (390x844)
    console.log('📱 Capturing Mobile Hero (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });

    await send('Page.navigate', { url: `${BASE_URL}/` });
    await sleep(3500);

    const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(MOBILE_DIR, '01_hero_mobile.png'), Buffer.from(shotMobile.data, 'base64'));
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'hero_enlarged_mobile.png'), Buffer.from(shotMobile.data, 'base64'));
    console.log('✅ Mobile Hero captured and saved.');

    ws.close();
    chrome.kill('SIGTERM');
    console.log('🎉 Verification captures completed successfully!');
  } catch (err) {
    console.error('❌ Error during capture:', err);
    if (ws) ws.close();
    chrome.kill('SIGTERM');
    process.exit(1);
  }
}

run();
