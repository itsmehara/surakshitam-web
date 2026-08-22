/**
 * Generates the placeholder artwork for third-party ("brand partner") stock —
 * the food and pantry goods Surakshitam resells rather than makes.
 *
 * These deliberately use a neutral, unbranded look: no Surakshitam wordmark,
 * logo, cream/forest palette or leaf motifs, so nothing on a partner product
 * suggests it came out of our kitchen. Replace each file with the supplier's
 * real pack photo when it arrives.
 *
 *   node scripts/generate-partner-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/products/partners";
const SIZE = 800;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Neutral, brandless card: a plain pack silhouette + a label band. */
function packSvg({ brand, name, size, tint, shape }) {
  const body =
    shape === "bottle"
      ? `<path d="M355 250 h90 v40 q0 18 14 30 l16 14 q20 17 20 44 v292 q0 30 -30 30 h-130 q-30 0 -30 -30 v-292 q0 -27 20 -44 l16 -14 q14 -12 14 -30 z"
             fill="${tint}" stroke="#8B8578" stroke-width="3"/>
         <rect x="368" y="216" width="64" height="40" rx="6" fill="#6F6A60"/>`
      : `<path d="M262 236 h276 q16 0 16 16 v396 q0 16 -16 16 h-276 q-16 0 -16 -16 v-396 q0 -16 16 -16 z"
             fill="${tint}" stroke="#8B8578" stroke-width="3"/>
         <path d="M262 236 l40 -34 h196 l40 34 z" fill="#CFC8BC" stroke="#8B8578" stroke-width="3"/>`;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F6F5F2"/>
      <stop offset="100%" stop-color="#E8E5DE"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <ellipse cx="400" cy="672" rx="210" ry="26" fill="#000" opacity="0.06"/>
  ${body}
  <rect x="288" y="372" width="224" height="150" rx="8" fill="#FFFFFF" opacity="0.94" stroke="#B9B2A6" stroke-width="2"/>
  <text x="400" y="406" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="17" letter-spacing="2.4" fill="#8B8578">${esc(brand.toUpperCase())}</text>
  <line x1="318" y1="418" x2="482" y2="418" stroke="#D8D2C7" stroke-width="2"/>
  <text x="400" y="452" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="24" font-weight="bold" fill="#3A362F">${esc(name)}</text>
  <text x="400" y="492" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="18" fill="#6F6A60">${esc(size)}</text>
  <text x="400" y="742" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="15" letter-spacing="1.6" fill="#9A9488">BRAND PARTNER PRODUCT · SAMPLE PACK IMAGE</text>
</svg>`);
}

/** The fallback used when a partner product has no photo at all. */
function genericPlaceholderSvg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#F1F0ED"/>
  <rect x="250" y="250" width="300" height="300" rx="14" fill="none" stroke="#B4AEA3" stroke-width="4" stroke-dasharray="14 12"/>
  <path d="M300 470 l70 -80 l55 60 l40 -44 l55 64 z" fill="#CFC8BC"/>
  <circle cx="345" cy="342" r="26" fill="#CFC8BC"/>
  <text x="400" y="602" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="20" fill="#8B8578">Product image coming soon</text>
  <text x="400" y="632" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="15" letter-spacing="1.4" fill="#A8A296">BRAND PARTNER PRODUCT</text>
</svg>`);
}

const ITEMS = [
  { file: "wheat-noodles.webp", brand: "Amma's Kitchen", name: "Wheat Noodles", size: "250 g", tint: "#E4C98F", shape: "pouch" },
  { file: "millet-noodles.webp", brand: "Millet Mitra", name: "Millet Noodles", size: "200 g", tint: "#D9C6A6", shape: "pouch" },
  { file: "ragi-murukku.webp", brand: "Amma's Kitchen", name: "Ragi Murukku", size: "200 g", tint: "#D8B98C", shape: "pouch" },
  { file: "groundnut-oil.webp", brand: "Ghani Fresh", name: "Groundnut Oil", size: "1 L", tint: "#EBD79A", shape: "bottle" },
];

await mkdir(OUT, { recursive: true });
for (const item of ITEMS) {
  await sharp(packSvg(item)).webp({ quality: 88 }).toFile(`${OUT}/${item.file}`);
  console.log("wrote", `${OUT}/${item.file}`);
}
await sharp(genericPlaceholderSvg()).webp({ quality: 88 }).toFile(`${OUT}/placeholder.webp`);
console.log("wrote", `${OUT}/placeholder.webp`);
