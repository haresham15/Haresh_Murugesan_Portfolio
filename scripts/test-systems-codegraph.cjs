// Run against a local server: NODE_PATH=<Playwright install>/node_modules node scripts/test-systems-codegraph.cjs
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = process.env.GRAPH_TEST_URL || 'http://127.0.0.1:3100';
    const links = new Set();
    for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${base}/projects`, { waitUntil: 'networkidle' });
      const graph = page.getByRole('region', { name: 'Systems CodeGraph', exact: true });
      const stage = graph.locator('[data-depth]');
      const checkBounds = async () => {
        const result = await graph.evaluate(root => {
          const nodes = [...root.querySelectorAll('[data-graph-node]')];
          const bounds = nodes.map(node => ({ id: node.dataset.graphNode, rect: node.getBoundingClientRect() }));
          return {
            clipped: bounds.filter(({ rect }) => rect.left < -1 || rect.right > innerWidth + 1).map(n => n.id),
            overlaps: bounds.flatMap((a, i) => bounds.slice(i + 1).filter(b =>
              Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left) > 1 &&
              Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top) > 1
            ).map(b => `${a.id}/${b.id}`)),
          };
        });
        assert.deepEqual(result, { clipped: [], overlaps: [] }, `${width}px: node bounds`);
      };
      await checkBounds();
      for (const core of ['core-backend', 'core-frontend']) {
        await stage.locator(`[data-graph-node="${core}"]`).focus();
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => document.querySelector('[data-depth="1"]'));
        await checkBounds();
        const domains = await stage.locator('.cluster [data-graph-node]').evaluateAll(nodes => nodes.map(n => n.dataset.graphNode));
        for (const domain of domains) {
          await stage.locator(`[data-graph-node="${domain}"]`).click();
          await page.waitForFunction(() => document.querySelector('[data-depth="2"]'));
          await checkBounds();
          const projects = await stage.locator('.cluster [data-graph-node]').evaluateAll(nodes => nodes.map(n => n.dataset.graphNode));
          for (const project of projects) {
            await stage.locator(`[data-graph-node="${project}"]`).click();
            await page.waitForFunction(() => document.querySelector('[data-depth="3"]'));
            await checkBounds();
            assert.equal(await graph.locator('.stage-heading').evaluate(el => el === document.activeElement), true);
            const href = await graph.getByRole('link', { name: 'Enter Full Case Study' }).getAttribute('href');
            assert.equal(href.replace(/\/$/, ''), `/projects/${project}`);
            links.add(href);
            await graph.getByRole('button', { name: 'Step Back' }).click();
          }
          await stage.locator('[data-graph-node="core"]').click();
        }
        await stage.locator('[data-graph-node="origin"]').click();
      }
      await graph.getByRole('button', { name: 'All systems', exact: true }).click();
      assert.equal(await graph.locator('.all-systems article').count(), 18);
      await graph.getByRole('button', { name: 'Explore graph', exact: true }).click();
      await checkBounds();
      console.log(`PASS ${width}x${height}: all domains/projects, bounds, parents, keyboard, dossier links`);
    }
    assert.equal(links.size, 18);
    for (const link of links) {
      const response = await page.request.get(`${base}${link}`);
      assert.equal(response.ok(), true, link);
    }
    assert.deepEqual(errors, [], 'browser runtime errors');
    console.log('PASS 18 canonical case routes and zero browser runtime errors');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
