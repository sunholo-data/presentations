#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// export-pdf.mjs — faithful PDF export of any deck folder in this repo.
//
// Why this exists (and why it isn't @media print): each deck stacks its slides
// absolutely with only .active visible, reveals content via CSS animations that
// start at opacity:0, and some decks build a slide up over several JS
// `data-steps` reveals. None of that survives a static print. So instead we
// drive the *real* decks in headless Chrome — exactly what the room sees —
// walk every slide to its final revealed step, screenshot at 16:9, and assemble
// one landscape page per slide into a single PDF.
//
// Deck order is read from the PLAYLIST in that folder's presenter.html (the
// source of truth), so this never drifts from the live deck order.
//
// Usage:
//   cd scripts && npm install                     # one-time (downloads a Chromium)
//   node export-pdf.mjs ai-slaves-human-masters-ida
//   node export-pdf.mjs analytics-for-ai-agents --density=guide   # include .detail prose
//   node export-pdf.mjs multivac --only=00-multivac-platform.html # subset (debug)
//   node export-pdf.mjs multivac --scale=1 --out=/tmp/deck.pdf    # smaller / custom
//
// Then point the presenter at it: set `const PDF = 'your-file.pdf'` near the
// PLAYLIST in that folder's presenter.html and the download button appears.
// ─────────────────────────────────────────────────────────────────────────────

import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join, basename } from 'node:path';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// ── Stage geometry: the decks are authored for a 16:9 stage. ──────────────────
const W = 1920, H = 1080;

// ── Pacing: give entrance animations / step reveals time to settle. ───────────
const STEP_MS = 650;   // between step reveals within a slide
const SLIDE_MS = 700;  // after advancing to the next slide
const SHOT_MS = 850;   // extra settle right before a screenshot
const GOTO_TIMEOUT = 30000;

// ── CLI args ─────────────────────────────────────────────────────────────────
const positional = [];
const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) { positional.push(a); return []; }
    return [[m[1], m[2] ?? true]];
  })
);

const FOLDER = positional[0];
if (!FOLDER) {
  console.error('Usage: node export-pdf.mjs <deck-folder> [--density=stage|guide] [--scale=N] [--only=a.html,b.html] [--out=path.pdf]');
  process.exit(1);
}
const DECK_DIR = resolve(REPO_ROOT, FOLDER);
const SCALE = Number(args.scale ?? 2);
const DENSITY = args.density === 'guide' ? 'guide' : 'stage';
const OUT = args.out ? resolve(String(args.out)) : join(DECK_DIR, `${basename(DECK_DIR)}.pdf`);
const ONLY = args.only ? String(args.only).split(',').map((s) => s.trim()) : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Read deck order straight from presenter.html's PLAYLIST ───────────────────
async function readPlaylist() {
  const html = await readFile(join(DECK_DIR, 'presenter.html'), 'utf8');
  const start = html.indexOf('const PLAYLIST');
  const end = html.indexOf('];', start);
  if (start === -1 || end === -1) throw new Error(`No PLAYLIST in ${FOLDER}/presenter.html`);
  const block = html.slice(start, end);
  const decks = [];
  const re = /src:\s*'([^']+)'[^}]*?label:\s*(?:'([^']*)'|"([^"]*)")/g;
  let m;
  while ((m = re.exec(block))) decks.push({ src: m[1], label: m[2] ?? m[3] });
  if (!decks.length) throw new Error('Could not parse PLAYLIST from presenter.html');
  return decks;
}

// Read slide count, per-slide step count, and current active index from a deck.
async function readDeckInfo(page) {
  return page.evaluate(() => {
    let slides = [...document.querySelectorAll('.slides-stage .slide')];
    if (!slides.length) slides = [...document.querySelectorAll('.slide')];
    return {
      count: slides.length,
      steps: slides.map((s) => {
        const n = parseInt(s.getAttribute('data-steps') || '1', 10);
        return Number.isFinite(n) && n > 0 ? n : 1;
      }),
      active: slides.findIndex((s) => s.classList.contains('active')),
    };
  });
}

async function activeIndex(page) {
  return page.evaluate(() => {
    let slides = [...document.querySelectorAll('.slides-stage .slide')];
    if (!slides.length) slides = [...document.querySelectorAll('.slide')];
    return slides.findIndex((s) => s.classList.contains('active'));
  });
}

async function captureDeck(page, deck) {
  const url = pathToFileURL(join(DECK_DIR, deck.src)).href;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: GOTO_TIMEOUT }).catch(() => {});
  // Fonts + first entrance animation.
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null)).catch(() => {});
  // Present it as the room sees it: stage only, no presenter chrome.
  await page.addStyleTag({
    content: `.top-bar,.bottom-bar{display:none!important} .slides-viewport{flex:1 1 auto!important}`,
  });
  await page.evaluate(() => document.body.classList.add('in-iframe')).catch(() => {});
  // Decks default to guide when loaded standalone; pin the requested density.
  await page.evaluate((d) => document.documentElement.setAttribute('data-density', d), DENSITY).catch(() => {});
  await sleep(SHOT_MS);

  const info = await readDeckInfo(page);
  const count = Math.max(1, info.count);

  // Fresh load should sit on slide 0; nudge back if a deck starts elsewhere.
  if (info.active > 0) {
    for (let k = 0; k < info.steps.reduce((a, b) => a + b, count) + 5; k++) {
      await page.keyboard.press('ArrowLeft');
      await sleep(60);
      if ((await activeIndex(page)) === 0) break;
    }
    await sleep(SHOT_MS);
  }

  const shots = [];
  for (let i = 0; i < count; i++) {
    // Advance to this slide's final revealed step.
    const steps = info.steps[i] ?? 1;
    for (let s = 0; s < steps - 1; s++) {
      await page.keyboard.press('ArrowRight');
      await sleep(STEP_MS);
    }
    await sleep(SHOT_MS);
    shots.push(await page.screenshot({ type: 'png' }));
    process.stdout.write(`    · slide ${i + 1}/${count}${steps > 1 ? ` (${steps} steps)` : ''}\n`);

    // Move on to the next slide (from the last step, one Right rolls over).
    if (i < count - 1) {
      await page.keyboard.press('ArrowRight');
      await sleep(SLIDE_MS);
      let guard = 0;
      while ((await activeIndex(page)) <= i && guard < 4) {
        await page.keyboard.press('ArrowRight');
        await sleep(SLIDE_MS);
        guard++;
      }
    }
  }
  return shots;
}

async function assemblePdf(browser, shots) {
  // puppeteer's screenshot() returns a Uint8Array — Buffer.from() first, or
  // .toString('base64') yields comma-joined bytes (blank/broken images).
  const imgs = shots
    .map((b) => `<img src="data:image/png;base64,${Buffer.from(b).toString('base64')}">`)
    .join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page{size:${W}px ${H}px;margin:0}
    html,body{margin:0;padding:0;background:#fff}
    img{display:block;width:${W}px;height:${H}px;object-fit:contain;background:#fff;page-break-after:always;break-after:page}
    img:last-child{page-break-after:auto;break-after:auto}
  </style></head><body>${imgs}</body></html>`;
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  // Ensure every embedded frame has decoded before we print.
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
  await page.pdf({
    path: OUT,
    width: `${W}px`,
    height: `${H}px`,
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.close();
}

async function main() {
  let decks = await readPlaylist();
  if (ONLY) decks = decks.filter((d) => ONLY.some((o) => d.src.endsWith(o) || d.label === o));
  console.log(`Exporting ${decks.length} deck(s) from ${FOLDER} → ${OUT}\n(scale ${SCALE}×, ${W}×${H} stage, ${DENSITY} density)\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });

    const allShots = [];
    for (const deck of decks) {
      console.log(`▸ ${deck.label}  (${deck.src})`);
      const shots = await captureDeck(page, deck);
      allShots.push(...shots);
    }
    await page.close();

    console.log(`\nAssembling ${allShots.length} pages…`);
    await assemblePdf(browser, allShots);
    console.log(`✓ Wrote ${OUT}  (${allShots.length} pages)`);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
