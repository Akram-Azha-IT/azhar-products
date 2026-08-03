/**
 * Browser audit: console errors, horizontal overflow, reduced-motion behaviour,
 * and whether scroll-revealed text actually ends up visible.
 *
 * Usage: node scripts/audit.mjs [baseUrl]
 * Screenshots land in .audit/ (gitignored).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const OUT = '.audit';

// One landing document per locale — there are no other routes.
const PAGES = ['/en', '/fr'];
const WIDTHS = [375, 768, 1440];

const problems = [];
function fail(message) {
  problems.push(message);
  process.stdout.write(`  FAIL  ${message}\n`);
}
function pass(message) {
  process.stdout.write(`  ok    ${message}\n`);
}

async function newPage(browser, width, reducedMotion) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  return { context, page, errors };
}

/** Scroll the whole page so every ScrollTrigger fires, then settle. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

for (const width of WIDTHS) {
  process.stdout.write(`\n=== ${width}px ===\n`);

  for (const path of PAGES) {
    const { context, page, errors } = await newPage(browser, width, 'no-preference');
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
    await scrollThrough(page);

    // 1. Console must be clean.
    if (errors.length > 0) fail(`${path} console: ${errors.slice(0, 2).join(' | ')}`);
    else pass(`${path} console clean`);

    // 2. No horizontal overflow.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) fail(`${path} overflows horizontally by ${overflow}px`);
    else pass(`${path} no horizontal overflow`);

    // 3. Every heading must be visible and unclipped after scrolling.
    const hidden = await page.evaluate(() => {
      const bad = [];
      for (const heading of document.querySelectorAll('h1, h2, h3')) {
        const rect = heading.getBoundingClientRect();
        // A collapsed heading is a failure, not something to skip past —
        // skipping it is how an invisible section heading would slip through.
        if (rect.height === 0) {
          bad.push(`${heading.textContent?.slice(0, 30)} (zero height)`);
          continue;
        }
        const style = getComputedStyle(heading);
        if (style.opacity === '0' || style.visibility === 'hidden') {
          bad.push(heading.textContent?.slice(0, 40) ?? '?');
          continue;
        }
        // A line mask left mid-animation shows as a zero-height inner span.
        for (const inner of heading.querySelectorAll('.reveal-line > span')) {
          const t = getComputedStyle(inner).transform;
          const match = /matrix\([^)]*?,\s*([-\d.]+)\)$/.exec(t);
          if (match && Math.abs(Number(match[1])) > 4) {
            bad.push(`${heading.textContent?.slice(0, 30)} (line offset ${match[1]})`);
          }
        }
      }
      return bad;
    });
    if (hidden.length > 0) fail(`${path} headings not settled: ${hidden.join(', ')}`);
    else pass(`${path} all headings visible`);

    /*
     * 4. No text clipped sideways inside its reveal mask.
     *
     * The masks are overflow:hidden, so a line wider than its mask is silently
     * chopped rather than overflowing the page — which means the document-level
     * overflow check above cannot see it. This caught a real hero bug where a
     * `ch` cap sat on a 16px wrapper instead of the 130px heading.
     */
    const clipped = await page.evaluate(() => {
      const bad = [];
      for (const mask of document.querySelectorAll('.reveal-line')) {
        const inner = mask.firstElementChild;
        if (!inner) continue;
        const available = Math.ceil(mask.getBoundingClientRect().width);
        if (inner.scrollWidth > available + 1) {
          bad.push(`"${inner.textContent?.slice(0, 24)}" ${inner.scrollWidth}>${available}px`);
        }
      }
      return bad;
    });
    if (clipped.length > 0) fail(`${path} text clipped by mask: ${clipped.join(', ')}`);
    else pass(`${path} no text clipped by its mask`);

    /*
     * 5. Nothing in the fixed header may spill outside it.
     *
     * A `hidden` utility passed to a component whose base class already sets a
     * display value loses the specificity tie and silently stays visible — how
     * the desktop quote button ended up crowding the logo on mobile.
     */
    const headerSpill = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return null;
      const bar = header.getBoundingClientRect();
      const spills = [];
      for (const child of header.querySelectorAll('a, button, nav')) {
        const rect = child.getBoundingClientRect();
        if (rect.width === 0) continue;
        if (rect.left < bar.left - 1 || rect.right > bar.right + 1) {
          spills.push(child.textContent?.trim().slice(0, 24) || child.tagName);
        }
      }
      return spills;
    });
    if (headerSpill && headerSpill.length > 0) {
      fail(`${path} header content overflows: ${headerSpill.join(', ')}`);
    } else pass(`${path} header content contained`);

    if (path === '/en') {
      await page.screenshot({
        path: `${OUT}/home-${width}.png`,
        fullPage: width === 1440,
      });
    }

    await context.close();
  }
}

process.stdout.write('\n=== reduced motion ===\n');
for (const path of PAGES) {
  const { context, page, errors } = await newPage(browser, 1440, 'reduce');
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  if (errors.length > 0) fail(`${path} console: ${errors.slice(0, 2).join(' | ')}`);

  // GSAP must never even be requested when motion is unwelcome.
  const loadedGsap = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .some((entry) => /gsap|lenis/i.test(entry.name)),
  );
  if (loadedGsap) fail(`${path} loaded GSAP/Lenis under reduced motion`);
  else pass(`${path} no animation engine downloaded`);

  // Headings must be readable immediately, with no split applied.
  const split = await page.evaluate(
    () => document.querySelectorAll('.reveal-line').length,
  );
  if (split > 0) fail(`${path} split ${split} lines under reduced motion`);
  else pass(`${path} text left unsplit`);

  await context.close();
}

await browser.close();

process.stdout.write(
  problems.length === 0
    ? '\nAUDIT PASSED\n'
    : `\nAUDIT FAILED — ${problems.length} problem(s)\n`,
);
process.exitCode = problems.length === 0 ? 0 : 1;
