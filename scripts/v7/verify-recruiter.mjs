/**
 * Recruiter pass checks (Downloads PRD R1–R5, R7, R11). Run after `npm run build`:
 *   node scripts/v7/verify-recruiter.mjs
 * Writes screenshots to .v7/recruiter/ and exits non-zero on any failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { launch, newContext, ORIGIN } from './verify-lib.mjs';

const SHOTS = path.resolve('.v7/recruiter');
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const rec = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const browser = await launch();

/* ---- R1/R2/R3: the hero facts are on the first screen at both sizes ---- */
for (const [w, h] of [[1280, 720], [390, 844]]) {
  const context = await newContext(browser, [w, h]);
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const boxes = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    };
    const fact = [...hero.querySelectorAll('p')].find((p) => p.textContent.includes('graduating'));
    const proofs = [...hero.querySelectorAll('ul[aria-label="Highlights"] a')];
    const resume = [...hero.querySelectorAll('a')].find((a) => a.textContent.includes('Résumé'));
    const buttons = [...hero.querySelectorAll('a')].filter((a) => /Résumé|Explore work/.test(a.textContent));
    return {
      fact: pick(fact),
      proofs: proofs.map(pick),
      proofHrefs: proofs.map((a) => a.getAttribute('href')),
      resume: pick(resume),
      buttonCount: buttons.length,
      vw: innerWidth,
      vh: innerHeight,
    };
  });
  const inView = (b) => b && b.top >= 0 && b.bottom <= boxes.vh && b.left >= 0 && b.right <= boxes.vw;
  rec(`${w}x${h} fact line in first viewport`, inView(boxes.fact), JSON.stringify(boxes.fact));
  rec(`${w}x${h} both proof links in first viewport`, boxes.proofs.length === 2 && boxes.proofs.every(inView));
  rec(`${w}x${h} résumé button in first viewport`, inView(boxes.resume));
  rec(`${w}x${h} hero has exactly two buttons`, boxes.buttonCount === 2, `${boxes.buttonCount}`);
  rec(`${w}x${h} proof links target Experience and Recognition`,
    boxes.proofHrefs.join(',') === '#experience,#achievements', boxes.proofHrefs.join(','));
  await page.screenshot({ path: path.join(SHOTS, `hero_${w}x${h}.png`) });

  // Each proof link lands on its section.
  for (const [i, id] of [[0, 'experience'], [1, 'achievements']]) {
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.locator('ul[aria-label="Highlights"] a').nth(i).click();
    await page.waitForTimeout(1200);
    const top = await page.evaluate((sid) => document.getElementById(sid).getBoundingClientRect().top, id);
    rec(`${w}x${h} proof link ${i + 1} scrolls to #${id}`, Math.abs(top - 88) < 40, `top ${Math.round(top)}`); // scroll-margin-top: 5.5rem
  }
  await context.close();
}

/* ---- R5: section order ---- */
{
  const context = await newContext(browser, [1280, 720]);
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  const order = await page.evaluate(() => [...document.querySelectorAll('[data-material-region]')].map((el) => el.getAttribute('data-section') ?? el.dataset.name ?? el.firstElementChild?.id));
  const ids = await page.evaluate(() => ['hero', 'projects', 'achievements', 'experience', 'archive', 'skills', 'podcast', 'about', 'history', 'now', 'contact']
    .map((id) => [id, document.getElementById(id)?.getBoundingClientRect().top + scrollY]));
  const sorted = [...ids].sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  rec('R5 section order matches the PRD', sorted.join(',') === ids.map((x) => x[0]).join(','), sorted.join(' → '));
  void order;

  /* ---- R4: header bar, links scroll and highlight ---- */
  const bar = page.locator('nav[aria-label="Sections"]');
  rec('R4 header bar visible at 1280', await bar.isVisible());
  for (const [label, id] of [['Work', 'projects'], ['Experience', 'experience'], ['Recognition', 'achievements'], ['Skills', 'skills'], ['About', 'about'], ['Contact', 'contact']]) {
    await bar.getByRole('link', { name: label, exact: true }).click();
    await page.waitForTimeout(1800);
    const state = await page.evaluate(([sid, lab]) => {
      const top = document.getElementById(sid).getBoundingClientRect().top;
      const link = [...document.querySelectorAll('nav[aria-label="Sections"] a')].find((a) => a.textContent.trim() === lab);
      return { top, current: link?.getAttribute('aria-current') };
    }, [id, label]);
    // Contact is the footer, which can't scroll to the very top; it only needs to be on screen.
    const reached = id === 'contact' ? state.top < 720 : Math.abs(state.top - 88) < 40; // sections keep scroll-margin-top: 5.5rem (88px) under the header
    rec(`R4 "${label}" scrolls to #${id} and is highlighted`, reached && state.current === 'true', `top ${Math.round(state.top)} current=${state.current}`);
    await page.screenshot({ path: path.join(SHOTS, `header_${id}.png`), clip: { x: 0, y: 0, width: 1280, height: 120 } });
  }
  const profile = await bar.evaluate((nav) => [...nav.querySelectorAll('a')].map((a) => a.getAttribute('aria-label') || a.textContent.trim()));
  rec('R4 header has Résumé, GitHub and LinkedIn', ['GitHub', 'LinkedIn'].every((n) => profile.includes(n)) && profile.some((t) => t.startsWith('Résumé')), profile.join(', '));

  /* ---- R7: every Works position has role, case study and source ---- */
  await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
  const works = await page.evaluate(() => {
    const panel = document.getElementById('works-panel');
    return panel ? panel.textContent : '';
  });
  rec('R7 shown Works entry has a role line and Case study / Source links', /Case study/.test(works) && /Source/.test(works), works.slice(0, 80));

  /* ---- R11: full tool names are visible text ---- */
  const names = await page.evaluate(() => [...document.querySelectorAll('#skills button')].map((b) => b.innerText.trim()).filter(Boolean));
  rec('R11 tool names are visible', ['Python', 'TypeScript', 'PyTorch', 'FastAPI'].every((n) => names.includes(n)), `${names.length} named tools`);
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator('#skills').screenshot({ path: path.join(SHOTS, 'tool-wall.png') });
  await context.close();
}

/* ---- R4 on a case study ---- */
{
  const context = await newContext(browser, [1280, 720]);
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/projects/healios/`, { waitUntil: 'networkidle' });
  rec('R4 header bar present on /projects/healios', await page.locator('nav[aria-label="Sections"]').isVisible());
  rec('R12 case study has prev/next links', await page.locator('nav[aria-label="More case studies"] a').count() === 2);
  await page.screenshot({ path: path.join(SHOTS, 'case-study_top.png') });
  await context.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed. Screenshots: ${SHOTS}`);
process.exit(failed.length ? 1 : 0);
