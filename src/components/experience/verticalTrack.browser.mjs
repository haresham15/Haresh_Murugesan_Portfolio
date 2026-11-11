import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.goto(process.env.PORTFOLIO_URL || 'http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-experience-path]').waitFor({ state: 'attached' });
  for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(600);
    const geometry = await page.evaluate(() => {
      const root = document.querySelector('[data-experience-track]');
      const path = root.querySelector('[data-experience-path]');
      const length = path.getTotalLength();
      const matrix = path.getScreenCTM();
      const screenPoint = (t) => new DOMPoint(path.getPointAtLength(t * length).x, path.getPointAtLength(t * length).y).matrixTransform(matrix);
      const errors = [...root.querySelectorAll('[data-experience-apex]')].map((apex) => {
        const box = apex.getBoundingClientRect();
        const x = box.left + box.width / 2, y = box.top + box.height / 2;
        let low = 0, high = 1;
        for (let i = 0; i < 32; i++) {
          const mid = (low + high) / 2;
          if (screenPoint(mid).y < y) low = mid; else high = mid;
        }
        const point = screenPoint((low + high) / 2);
        return Math.hypot(point.x - x, point.y - y);
      });
      const boxes = [...root.querySelectorAll('h3, article > p, article ul')].map((el) => el.getBoundingClientRect());
      let collisions = 0;
      for (let i = 0; i <= 1000; i++) {
        const point = screenPoint(i / 1000);
        if (boxes.some((box) => point.x + 32 > box.left && point.x - 32 < box.right && point.y + 32 > box.top && point.y - 32 < box.bottom)) collisions++;
      }
      return { errors, collisions, right: root.getBoundingClientRect().right };
    });
    assert.ok(geometry.errors.every((error) => error < 0.5), JSON.stringify(geometry));
    assert.equal(geometry.collisions, 0, JSON.stringify(geometry));
    assert.ok(geometry.right <= width + 1);
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-experience-apex]').nth(i).click();
      await page.waitForTimeout(800);
      assert.equal(await page.locator('[data-experience-apex]').nth(i).getAttribute('aria-pressed'), 'true');
      const landingError = await page.evaluate((index) => {
        const car = document.querySelector('[data-experience-car]');
        const position = new DOMPoint(0, 0).matrixTransform(car.getScreenCTM());
        const box = document.querySelectorAll('[data-experience-apex]')[index].getBoundingClientRect();
        return Math.hypot(position.x - box.left - box.width / 2, position.y - box.top - box.height / 2);
      }, i);
      assert.ok(landingError < 0.5, 'Car missed measured apex: ' + landingError);
    }
    await page.evaluate(() => {
      window.experienceSamples = [];
      const car = document.querySelector('[data-experience-car]');
      window.experienceObserver = new MutationObserver(() => window.experienceSamples.push(Number(car.dataset.progress)));
      window.experienceObserver.observe(car, { attributes: true, attributeFilter: ['data-progress'] });
      document.querySelector('[data-experience-apex]').click();
    });
    await page.waitForTimeout(1100);
    const samples = await page.evaluate(() => { window.experienceObserver.disconnect(); return window.experienceSamples; });
    assert.ok(samples.some((t) => t < 0), 'Wrap must re-enter above the track');
    for (let i = 1; i < samples.length; i++) {
      assert.ok(samples[i] >= samples[i - 1] || (samples[i - 1] > 0.95 && samples[i] < 0), 'Car reversed on-track');
    }
    console.log(width + 'x' + height + ': apex error <0.5px; no track/text collisions; all clicks and forward wrap passed');
  }
  await page.evaluate(() => {
    window.experienceSamples = [];
    const car = document.querySelector('[data-experience-car]');
    window.experienceObserver.observe(car, { attributes: true, attributeFilter: ['data-progress'] });
    document.querySelectorAll('[data-experience-apex]')[4].click();
  });
  await page.waitForTimeout(450);
  await page.evaluate(() => document.querySelectorAll('[data-experience-apex]')[1].click());
  await page.waitForTimeout(150);
  await page.evaluate(() => document.querySelectorAll('[data-experience-apex]')[2].click());
  await page.waitForTimeout(1100);
  const interrupted = await page.evaluate(() => { window.experienceObserver.disconnect(); return window.experienceSamples; });
  for (let i = 1; i < interrupted.length; i++) {
    assert.ok(interrupted[i] >= interrupted[i - 1] || (interrupted[i - 1] > 0.95 && interrupted[i] < 0), 'Interrupted navigation reversed');
  }
  console.log('Rapid retargeting: forward-only movement preserved');
} finally {
  await browser.close();
}
