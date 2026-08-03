import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });

// Scroll the way a person would, then measure in a normal viewport.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 200));
  }
});
await page.waitForTimeout(1500);

const report = await page.evaluate(() => {
  const headings = [...document.querySelectorAll('h1, h2')].map((h) => {
    const rect = h.getBoundingClientRect();
    const masks = [...h.querySelectorAll('.reveal-line')].map((m) => {
      const inner = m.firstElementChild;
      const mr = m.getBoundingClientRect();
      const ir = inner.getBoundingClientRect();
      return {
        text: inner.textContent?.slice(0, 26),
        maskH: Math.round(mr.height),
        innerH: Math.round(ir.height),
        // Positive means glyphs are taller than the window that shows them.
        verticalClip: Math.round(ir.height - mr.height),
        offsetY: Math.round(ir.top - mr.top),
      };
    });
    return {
      text: h.textContent?.slice(0, 34),
      height: Math.round(rect.height),
      lineHeight: getComputedStyle(h).lineHeight,
      masks,
    };
  });
  return headings;
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
