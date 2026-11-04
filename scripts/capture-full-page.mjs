import { spawn } from 'child_process';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
const TARGET_URL = 'http://localhost:3000';
const OUTPUT_FILE = path.resolve('public', 'portfolio_full_page.png');
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Launching headless Chrome...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--window-size=${VIEWPORT_WIDTH},${VIEWPORT_HEIGHT}`,
    '--hide-scrollbars',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    'about:blank',
  ], { stdio: 'ignore' });

  let ws;

  try {
    // Wait for Chrome remote debugging port to be ready
    let targets = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json`);
        targets = await res.json();
        if (targets && targets.length > 0) break;
      } catch {
        await sleep(250);
      }
    }

    if (!targets || targets.length === 0) {
      throw new Error('Could not connect to Chrome debugging endpoint');
    }

    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    console.log('🔗 Connecting to page debugger via WebSocket...');
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

    console.log('🌐 Navigating to', TARGET_URL);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: TARGET_URL });

    // Wait for navigation and initial rendering
    await sleep(3500);

    // Get total scroll height
    const evalRes = await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollHeight',
      returnByValue: true,
    });
    const totalHeight = evalRes.result?.value || 18000;
    console.log(`📐 Document dimensions: ${VIEWPORT_WIDTH}x${totalHeight}px`);

    const slices = [];
    let currentY = 0;

    console.log('📸 Capturing viewport slices...');
    while (currentY < totalHeight) {
      // Scroll to current position
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${currentY}, behavior: 'instant' })`,
      });
      // Small pause for any scroll-triggered elements / RAF frames
      await sleep(180);

      const shotRes = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });

      const buffer = Buffer.from(shotRes.data, 'base64');
      const sliceHeight = Math.min(VIEWPORT_HEIGHT, totalHeight - currentY);

      slices.push({
        buffer,
        top: currentY,
        sliceHeight,
      });

      console.log(`   Captured slice at Y=${currentY} (${Math.round((currentY / totalHeight) * 100)}%)`);
      currentY += VIEWPORT_HEIGHT;
    }

    console.log(`🎨 Stitching ${slices.length} slices into full page image with sharp...`);
    
    // Crop any overflow on the last slice if necessary
    const compositeList = [];
    for (const slice of slices) {
      if (slice.sliceHeight < VIEWPORT_HEIGHT) {
        const cropped = await sharp(slice.buffer)
          .extract({ left: 0, top: 0, width: VIEWPORT_WIDTH, height: slice.sliceHeight })
          .toBuffer();
        compositeList.push({
          input: cropped,
          top: slice.top,
          left: 0,
        });
      } else {
        compositeList.push({
          input: slice.buffer,
          top: slice.top,
          left: 0,
        });
      }
    }

    await sharp({
      create: {
        width: VIEWPORT_WIDTH,
        height: totalHeight,
        channels: 4,
        background: { r: 7, g: 9, b: 13, alpha: 1 },
      },
    })
      .composite(compositeList)
      .png({ compressionLevel: 8 })
      .toFile(OUTPUT_FILE);

    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`✅ Full page screenshot saved successfully: ${OUTPUT_FILE} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);

  } catch (err) {
    console.error('❌ Capture failed:', err);
  } finally {
    if (ws) {
      try { ws.close(); } catch {}
    }
    chrome.kill();
    // Clean up temporary script if needed
    if (fs.existsSync('scripts/test-cdp.mjs')) {
      fs.unlinkSync('scripts/test-cdp.mjs');
    }
    process.exit(0);
  }
}

main();

