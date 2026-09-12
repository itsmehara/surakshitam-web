/**
 * Shared helpers for all four Surakshitam Naturals screenshot scripts:
 *   capture-storefront-desktop.mjs · capture-storefront-mobile.mjs
 *   capture-admin-desktop.mjs      · capture-admin-mobile.mjs
 *
 * Watermark note: the label is drawn as a real DOM element on the page (via
 * page.evaluate) BEFORE the screenshot is taken, not composited afterwards with
 * sharp/SVG. Sharp's SVG text rendering depends on librsvg having fontconfig/pango
 * available, which many prebuilt macOS sharp binaries lack — rects render, text
 * silently doesn't. Drawing it in the browser sidesteps that entirely: Chromium
 * always renders text. Sharp is only used afterwards to add the dark border, which
 * is a pure image op (no text) and works everywhere.
 */
import sharp from "sharp";
import fs from "fs";

export const BORDER = 14; // px, dark frame around the whole screenshot
export const BORDER_COLOR = "#1c2b1c"; // deep forest, matches the brand palette

export const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true });

const ts = () => new Date().toTimeString().slice(0, 8); // HH:MM:SS

/** Timestamped console.log — use instead of bare console.log so every line in a run shows
 * when it happened, which makes it obvious whether the script is progressing or stuck. */
export function log(...args) {
  console.log(`[${ts()}]`, ...args);
}

/**
 * Waits `ms`, printing a "still waiting" heartbeat with a timestamp every 15s instead of
 * going silent — so a long page-settle wait is visibly still running, not indistinguishable
 * from a hang.
 */
export async function heartbeatWait(page, ms, label = "settling") {
  const CHUNK = 15000;
  let remaining = ms;
  let elapsed = 0;
  while (remaining > 0) {
    const step = Math.min(CHUNK, remaining);
    await page.waitForTimeout(step);
    elapsed += step;
    remaining -= step;
    log(`  … still ${label} (${Math.round(elapsed / 1000)}s / ${Math.round(ms / 1000)}s)`);
  }
}

export async function settle(page) {
  // NOT "networkidle": Next.js dev mode keeps a persistent WebSocket open for Hot Module
  // Reload, so the network is never idle and that wait would burn its full timeout on
  // every single navigation (this used to cost ~45s per page — the actual cause of a
  // "capture-all.mjs never finishes" report). "load" fires once, fast, and our own
  // explicit waits (waitImages / the 15s storefront settle window) do the rest.
  await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  await waitImages(page);
  await page.waitForTimeout(500);
}

export async function goto(page, base, url) {
  log(`→ navigating to ${url}`);
  try {
    const response = await page.goto(base + url, { waitUntil: "domcontentloaded", timeout: 20000 });
    if (!response || !response.ok()) {
      log(`  ⚠ ${base + url} responded ${response ? response.status() : "with no response"}`);
    }
  } catch (e) {
    log(`  ✗ FAILED to load ${base + url} — ${e.message}`);
    log(`    Is "SCREENSHOTS=1 npm run dev" actually running at ${base}? Screenshots from a`);
    log(`    page that never loaded will just be blank — fix this before continuing.`);
  }
  await settle(page);
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
}

/** Fails fast with a clear message if the dev server isn't reachable at `base`, instead of
 * silently producing blank screenshots for every page. Call once at the start of a run. */
export async function assertServerUp(browser, base) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let ok = false;
  try {
    const response = await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 10000 });
    const bodyText = await page.evaluate(() => document.body.innerText || "").catch(() => "");
    ok = !!response && response.ok() && bodyText.trim().length > 20;
  } catch {
    ok = false;
  }
  await ctx.close();
  if (!ok) {
    throw new Error(
      `\nCannot reach a working site at ${base}.\n` +
        `Start the dev server first, in its own terminal, from surakshitam-web/:\n` +
        `  SCREENSHOTS=1 npm run dev\n` +
        `...then re-run this script once you see "Ready" in that terminal.\n`,
    );
  }
  log(`✓ server reachable at ${base}`);
}

/** Navigates and gives the page a long settle window — for storefront pages with
 * lazy-loaded images and scroll-reveal animations, a short wait isn't enough. */
export async function gotoAndWait(page, base, url, ms = 15000) {
  await goto(page, base, url);
  await heartbeatWait(page, ms, `settling on ${url}`);
  await waitImages(page);
}

/**
 * Mobile viewports show much less per screen than desktop, so a single shot of a
 * screen/list often misses everything below the fold. Takes 2 shots — top, then
 * scrolled down — for screens that are one shot on desktop. If the page is shorter than
 * the viewport, the second shot will just look the same as the first, which is fine.
 */
export async function twoShotMobile(page, base, url, shot, prefix, waitMs = 15000) {
  await gotoAndWait(page, base, url, waitMs);
  await shot(page, `${prefix}-01`);
  await page.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.55)));
  await page.waitForTimeout(700);
  await waitImages(page);
  await shot(page, `${prefix}-02`);
}

/**
 * Waits for in-viewport images to finish loading — CAPPED at `timeoutMs`. Lazy-loaded
 * images below the fold never fire onload/onerror until scrolled into view, so an
 * unbounded Promise.all here hangs forever (this was the actual cause of a "script never
 * finishes, no console output" report — it wasn't stuck in a wait we log, it was stuck
 * one level down inside this page.evaluate with no timeout at all).
 */
export async function waitImages(page, timeoutMs = 6000) {
  await page
    .evaluate((timeoutMs) => {
      const pending = Array.from(document.images).filter((i) => !i.complete);
      if (pending.length === 0) return;
      return Promise.race([
        Promise.all(pending.map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
        new Promise((r) => setTimeout(r, timeoutMs)),
      ]);
    }, timeoutMs)
    .catch(() => {});
}

/**
 * Scrolls a long/animated page top-to-bottom in `count` even steps, waiting for images and
 * scroll-reveal animations at each stop, and takes one numbered shot per stop
 * (`${prefix}-01`, `${prefix}-02`, ...). Use for pages with lots of sections/imagery
 * (home, our-story, ingredients) where 2-3 shots would miss most of the content.
 */
export async function gallery(page, base, url, shot, prefix, count, opts = {}) {
  const { waitAfterLoad = 15000, waitPerScroll = 1200 } = opts;
  await goto(page, base, url);
  await heartbeatWait(page, waitAfterLoad, `settling on ${url} before scrolling`);
  await waitImages(page);
  const h = await page.evaluate(() => document.body.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  const span = Math.max(0, h - vh);
  const step = count > 1 ? span / (count - 1) : 0;
  for (let i = 0; i < count; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(i * step));
    await page.waitForTimeout(waitPerScroll);
    await waitImages(page);
    await shot(page, `${prefix}-${String(i + 1).padStart(2, "0")}`);
  }
}

/**
 * Clicks "Load sample activity" on /studio/activity and actually waits for the seed to
 * finish (orders + audit events written to localStorage) instead of a fixed timeout — a
 * fixed wait was sometimes too short, leaving Packing/Orders/Dashboard looking empty.
 */
export async function seedSampleActivity(page, base) {
  await goto(page, base, "/studio/activity");
  await clickText(page, "button", /load sample activity/i);
  log("  … waiting for sample data to land in localStorage");
  await page
    .waitForFunction(
      () => {
        try {
          const orders = JSON.parse(localStorage.getItem("sn-orders-v1") || "[]");
          const audit = JSON.parse(localStorage.getItem("sn-audit-v1") || "[]");
          return orders.length > 5 && audit.length > 20;
        } catch {
          return false;
        }
      },
      { timeout: 15000 },
    )
    .catch(() => {});
  log("  ✓ sample data seeded");
  await settle(page);
}

/**
 * Opens a menu/dropdown, shoots it, then closes it again.
 *
 * Menu-open states never appear in a plain page screenshot — you only see them
 * by interacting — so they need capturing deliberately. Skips with a warning
 * rather than throwing if the trigger isn't on the page, so one missing control
 * can't abort a whole run.
 */
export async function openMenuAndShot(page, selector, shot, name, waitMs = 450) {
  const trigger = await page.$(selector);
  if (!trigger) {
    log(`  ⚠ nothing matched ${selector} — skipping "${name}"`);
    return false;
  }
  await trigger.click().catch(() => {});
  await page.waitForTimeout(waitMs);
  await shot(page, name);
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(200);
  return true;
}

/**
 * Types a PIN code into the cart's delivery check and waits for the quote to
 * re-render — used to capture both a nearby drop and one past the 15 km mark,
 * where the distance charge kicks in.
 */
export async function fillPincode(page, value) {
  const input = await page.$('input[aria-label="Delivery PIN code"]');
  if (!input) {
    log(`  ⚠ no delivery PIN field on this page — skipping PIN ${value}`);
    return false;
  }
  await input.fill(value).catch(() => {});
  await page.waitForTimeout(700);
  return true;
}

export async function clickText(page, selector, re) {
  for (const el of await page.$$(selector)) {
    const text = (await el.innerText()).trim();
    if (re.test(text)) {
      await el.click().catch(() => {});
      return true;
    }
  }
  return false;
}

/**
 * How far the label sits above the bottom edge: 12% of the viewport height plus
 * the original 20px inset.
 *
 * It used to sit flush at the bottom, where it was the first thing lost as soon
 * as the image was viewed at anything less than full size — a PDF page scaled to
 * fit, a phone gallery, a thumbnail. Since the whole point of the label is to
 * tell a non-technical reader which feature they're looking at, it has to
 * survive exactly those conditions. Lifting it clear of the bottom edge keeps it
 * inside the part of the frame people actually see.
 *
 * Bottom-LEFT is deliberate: the storefront's floating WhatsApp/Instagram/Offers
 * buttons live bottom-right, so this corner stays clear at any height.
 */
export const WATERMARK_BOTTOM = "calc(12vh + 20px)";

/** Adds/updates a fixed watermark box (bottom-left) in the live page, labelled with `name`. */
async function paintWatermark(page, name) {
  await page.evaluate(({ label, bottom }) => {
    const old = document.getElementById("__sn_watermark__");
    if (old) old.remove();
    const box = document.createElement("div");
    box.id = "__sn_watermark__";
    box.style.cssText = [
      "position:fixed", "left:20px", `bottom:${bottom}`, "z-index:2147483647",
      "background:rgba(255,255,255,0.62)", "border:2px solid #0c140c",
      "border-radius:14px", "padding:10px 16px",
      "font-family:Arial,Helvetica,sans-serif", "font-weight:900",
      "font-size:18px", "line-height:1.25", "color:#0c140c",
      "text-align:center", "white-space:pre-line",
      "box-shadow:0 2px 8px rgba(0,0,0,0.28)", "pointer-events:none",
    ].join(";");
    box.textContent = label.split("-").join("\n");
    document.body.appendChild(box);
  }, { label: name, bottom: WATERMARK_BOTTOM });
}

async function removeWatermark(page) {
  await page.evaluate(() => {
    const el = document.getElementById("__sn_watermark__");
    if (el) el.remove();
  }).catch(() => {});
}

/** Adds only the dark border (pure image op — no text — always renders correctly). */
async function addBorder(buffer, filePath) {
  await sharp(buffer)
    .extend({ top: BORDER, bottom: BORDER, left: BORDER, right: BORDER, background: BORDER_COLOR })
    .toFile(filePath);
}

/**
 * Returns a `shot(page, name)` function bound to `root`, with a shared running counter so
 * files across a whole run sort as 001-, 002-, ... (safe past 99).
 */
export function makeShotter(root) {
  let index = 0;
  return async function shot(page, name) {
    index += 1;
    const padded = String(index).padStart(3, "0");
    const numbered = `${padded}-${name}`;
    await paintWatermark(page, numbered);
    const buffer = await page.screenshot();
    await removeWatermark(page);
    await addBorder(buffer, `${root}/${numbered}.png`);
    log("  ✓", numbered);
  };
}
