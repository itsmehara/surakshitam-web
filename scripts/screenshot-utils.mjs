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

export async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});
  await page
    .evaluate(() =>
      Promise.all(
        Array.from(document.images)
          .filter((i) => !i.complete)
          .map((i) => new Promise((r) => { i.onload = i.onerror = r; })),
      ),
    )
    .catch(() => {});
  await page.waitForTimeout(500);
}

export async function goto(page, base, url) {
  await page.goto(base + url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await settle(page);
  await page.evaluate(() => window.scrollTo(0, 0));
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

/** Adds/updates a fixed watermark box (bottom-right) in the live page, labelled with `name`. */
async function paintWatermark(page, name) {
  await page.evaluate((label) => {
    const old = document.getElementById("__sn_watermark__");
    if (old) old.remove();
    const box = document.createElement("div");
    box.id = "__sn_watermark__";
    box.style.cssText = [
      "position:fixed", "right:20px", "bottom:20px", "z-index:2147483647",
      "background:rgba(255,255,255,0.62)", "border:2px solid #0c140c",
      "border-radius:14px", "padding:10px 16px",
      "font-family:Arial,Helvetica,sans-serif", "font-weight:900",
      "font-size:18px", "line-height:1.25", "color:#0c140c",
      "text-align:center", "white-space:pre-line",
      "box-shadow:0 2px 8px rgba(0,0,0,0.28)", "pointer-events:none",
    ].join(";");
    box.textContent = label.split("-").join("\n");
    document.body.appendChild(box);
  }, name);
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
    console.log("  ✓", numbered);
  };
}
