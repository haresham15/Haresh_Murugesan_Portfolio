import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
const SCREENSHOTS_DIR = path.resolve('screenshots');
const MOBILE_DIR = path.join(SCREENSHOTS_DIR, 'mobile');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveBaseUrl() {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  // Test 3001 first (active Next.js port), then 3000
  for (const port of [3001, 3000]) {
    try {
      const res = await fetch(`http://localhost:${port}/`);
      if (res.ok) {
        const text = await res.text();
        if (text.includes('Haresh Murugesan')) {
          return `http://localhost:${port}`;
        }
      }
    } catch {}
  }
  return 'http://localhost:3001';
}

const SECTIONS = [
  { id: 'hero', name: '01_hero.png', selector: '#hero' },
  { id: 'about', name: '02_about.png', selector: '#about' },
  { id: 'experience', name: '03_experience.png', selector: '#experience' },
  { id: 'podcast', name: '04_syntinuum_podcast.png', selector: '#podcast' },
  { id: 'projects', name: '05_selected_projects.png', selector: '#projects' },
  { id: 'skills', name: '06_capability_atlas.png', selector: '#skills' },
  { id: 'achievements', name: '07_distinctions_achievements.png', selector: '#achievements' },
  { id: 'history', name: '08_formative_milestones.png', selector: '#history' },
  { id: 'now', name: '09_now_field_notes.png', selector: '#now' },
  { id: 'contact', name: '10_contact_footer.png', selector: '#contact' },
];

const SUBPAGES = [
  { path: '/projects/', name: '11_projects_index.png' },
  { path: '/about/', name: '12_about_page.png' },
  { path: '/resume/', name: '13_resume_page.png' },
  { path: '/projects/healios/', name: '14_healios_case_study.png' },
  { path: '/system/', name: '15_system_spec.png' },
];

async function capture() {
  const BASE_URL = await resolveBaseUrl();
  console.log(`🌐 Verified Next.js Base URL: ${BASE_URL}`);

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(MOBILE_DIR)) {
    fs.mkdirSync(MOBILE_DIR, { recursive: true });
  }

  const userDataDir = path.join(os.tmpdir(), `chrome-audit-${Date.now()}`);
  console.log('🚀 Spawning Chrome with remote debugging on port', PORT);
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
    console.log(`🔗 Connecting to WebSocket for page: ${pageTarget.url}`);
    ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let msgId = 1;
    const pendingPromises = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingPromises.has(data.id)) {
        const { resolve, reject } = pendingPromises.get(data.id);
        pendingPromises.delete(data.id);
        if (data.error) {
          reject(new Error(data.error.message));
        } else {
          resolve(data.result);
        }
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

    // =============================================================
    // 1. DESKTOP VIEWPORT CAPTURES (1920x1080)
    // =============================================================
    console.log('\n🖥️ --- DESKTOP VIEWPORT CAPTURES (1920x1080) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to homepage:', `${BASE_URL}/`);
    await send('Page.navigate', { url: `${BASE_URL}/` });
    await sleep(4000); // Allow full hydration & background canvas to initialize

    for (const sec of SECTIONS) {
      console.log(`📸 Capturing Desktop Section: ${sec.name} (${sec.selector})`);
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.querySelector('${sec.selector}');
            if (el) {
              el.scrollIntoView({ behavior: 'instant', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
          })()
        `,
      });
      await sleep(1000); // Allow framer-motion stagger and state changes to settle

      const shotRes = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      const filePath = path.join(SCREENSHOTS_DIR, sec.name);
      fs.writeFileSync(filePath, Buffer.from(shotRes.data, 'base64'));
      console.log(`   Saved: ${filePath} (${Math.round(shotRes.data.length * 0.75 / 1024)} KB)`);
    }

    // Capture extra pages desktop
    for (const page of SUBPAGES) {
      console.log(`📸 Capturing Desktop Page: ${page.name} (${page.path})`);
      await send('Page.navigate', { url: `${BASE_URL}${page.path}` });
      await sleep(2500);

      const shotRes = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      const filePath = path.join(SCREENSHOTS_DIR, page.name);
      fs.writeFileSync(filePath, Buffer.from(shotRes.data, 'base64'));
      console.log(`   Saved: ${filePath} (${Math.round(shotRes.data.length * 0.75 / 1024)} KB)`);
    }

    // =============================================================
    // 2. MOBILE PHONE CAPTURES (390x844 - iPhone Viewport @2x)
    // =============================================================
    console.log('\n📱 --- MOBILE VIEWPORT CAPTURES (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true,
    });

    console.log('Navigating to homepage:', `${BASE_URL}/`);
    await send('Page.navigate', { url: `${BASE_URL}/` });
    await sleep(3500);

    for (const sec of SECTIONS) {
      const mobileName = sec.name.replace('.png', '_mobile.png');
      console.log(`📸 Capturing Mobile Section: ${mobileName} (${sec.selector})`);
      await send('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.querySelector('${sec.selector}');
            if (el) {
              el.scrollIntoView({ behavior: 'instant', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
          })()
        `,
      });
      await sleep(1000);

      const shotRes = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      const filePath = path.join(MOBILE_DIR, mobileName);
      fs.writeFileSync(filePath, Buffer.from(shotRes.data, 'base64'));
      console.log(`   Saved: ${filePath} (${Math.round(shotRes.data.length * 0.75 / 1024)} KB)`);
    }

    // Capture extra pages mobile
    for (const page of SUBPAGES) {
      const mobileName = page.name.replace('.png', '_mobile.png');
      console.log(`📸 Capturing Mobile Page: ${mobileName} (${page.path})`);
      await send('Page.navigate', { url: `${BASE_URL}${page.path}` });
      await sleep(2500);

      const shotRes = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      const filePath = path.join(MOBILE_DIR, mobileName);
      fs.writeFileSync(filePath, Buffer.from(shotRes.data, 'base64'));
      console.log(`   Saved: ${filePath} (${Math.round(shotRes.data.length * 0.75 / 1024)} KB)`);
    }

    console.log('\n✅ All screenshots successfully captured and stored in screenshots/');

  } finally {
    if (ws) {
      try { ws.close(); } catch {}
    }
    chrome.kill();
    console.log('🛑 Chrome process terminated.');
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

capture().catch((err) => {
  console.error('❌ Capture error:', err);
  process.exit(1);
});
