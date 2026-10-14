/**
 * Link-preview images for product pages (WhatsApp, Facebook, X, Threads).
 * One 1200×630 JPG per product in public/share/<slug>.jpg: the product's cover photo,
 * centred on the site's cream background. JPG because WhatsApp doesn't reliably show
 * .webp previews; small (< 300 KB) because WhatsApp skips large ones.
 *
 * Reads slug → cover from the last build (each product page's JSON-LD "image"), so:
 *   npm run build && node scripts/make-share-images.mjs && npm run build
 * Re-run after adding a product or changing a cover photo.
 */
import sharp from "sharp";
import { mkdir, readdir, readFile, stat } from "node:fs/promises";

const OUT = "public/share";
const W = 1200;
const H = 630;
const CREAM = "#FAF6EF";
const PAD = 40;

await mkdir(OUT, { recursive: true });
const slugs = await readdir("out/product");
let made = 0;
for (const slug of slugs) {
  const html = await readFile(`out/product/${slug}/index.html`, "utf8").catch(() => "");
  const m = html.match(/"@type":"Product".*?"image":"([^"]+)"/);
  if (!m) continue; // e.g. the old foot-cream redirect page
  const src = "public" + decodeURI(new URL(m[1], "https://x").pathname);
  if (!(await stat(src).catch(() => null))) {
    console.warn(`skip ${slug}: ${src} not found`);
    continue;
  }
  const photo = await sharp(src)
    .resize(H - PAD * 2, H - PAD * 2, { fit: "contain", background: CREAM })
    .flatten({ background: CREAM })
    .toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: CREAM } })
    .composite([{ input: photo, gravity: "center" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${OUT}/${slug}.jpg`);
  made++;
}
console.log(`made ${made} share images in ${OUT}/`);
