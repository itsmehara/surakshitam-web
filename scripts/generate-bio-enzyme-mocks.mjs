/**
 * Illustrative pack images for the three bio-enzyme cleaners, used until the
 * founders send real photos (3 Oct 2026). Drawn, not photographed — the card
 * says so in small type — in the house palette, with the official logo.
 * Replace each file with the real -01 photo when it arrives.
 *
 *   node scripts/generate-bio-enzyme-mocks.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SIZE = 1254;
const LOGO = "public/brand/logo.png";

const products = [
  { slug: "bio-enzyme-floor-cleaner", lines: ["Floor", "Cleaner"], size: "1 L", liquid: "#E9B44C", accent: "#C98A1E", note: "Citrus · Lemongrass" },
  { slug: "bio-enzyme-laundry-detergent", lines: ["Laundry", "Detergent"], size: "1 L", liquid: "#9CC3B4", accent: "#4F8A74", note: "Soapnut · Citrus" },
  { slug: "bio-enzyme-toilet-cleaner", lines: ["Toilet", "Cleaner"], size: "1 L", liquid: "#B9C98A", accent: "#6E8743", note: "Soapnut · Citrus" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svg({ lines, size, liquid, accent, note }) {
  const cx = SIZE / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E9EDE3"/><stop offset="0.68" stop-color="#F3ECE0"/>
    </linearGradient>
    <linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EDE3D3"/><stop offset="1" stop-color="#E2D6C3"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="0.18" stop-color="#FFFFFF" stop-opacity="0.08"/>
      <stop offset="0.8" stop-color="#000000" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.16"/>
    </linearGradient>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${liquid}" stop-opacity="0.85"/><stop offset="1" stop-color="${accent}" stop-opacity="0.95"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.18" cy="0.12" r="0.7">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#wall)"/>
  <rect y="${SIZE * 0.7}" width="${SIZE}" height="${SIZE * 0.3}" fill="url(#table)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#sun)"/>
  <ellipse cx="${cx + 40}" cy="1078" rx="300" ry="34" fill="#3A2E1F" opacity="0.12"/>

  <!-- 1 L bottle: body, shoulders, neck, cap -->
  <path d="M${cx - 200} 1060 q-28 0 -28 -28 v-520 q0 -70 60 -104 l70 -40 q22 -13 22 -38 v-40 h152 v40 q0 25 22 38 l70 40 q60 34 60 104 v520 q0 28 -28 28 z"
        fill="url(#fill)"/>
  <path d="M${cx - 200} 1060 q-28 0 -28 -28 v-520 q0 -70 60 -104 l70 -40 q22 -13 22 -38 v-40 h152 v40 q0 25 22 38 l70 40 q60 34 60 104 v520 q0 28 -28 28 z"
        fill="url(#glass)" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="3"/>
  <rect x="${cx - 96}" y="196" width="192" height="104" rx="14" fill="#223027"/>
  <rect x="${cx - 96}" y="196" width="192" height="104" rx="14" fill="url(#glass)"/>
  ${Array.from({ length: 11 }, (_, i) => `<rect x="${cx - 84 + i * 16}" y="206" width="5" height="84" rx="2" fill="#000" opacity="0.14"/>`).join("")}

  <!-- label -->
  <rect x="${cx - 178}" y="496" width="356" height="476" rx="20" fill="#FAF6EF" stroke="${accent}" stroke-opacity="0.45" stroke-width="3"/>
  <rect x="${cx - 162}" y="512" width="324" height="444" rx="14" fill="none" stroke="#223027" stroke-opacity="0.12" stroke-width="2"/>
  <text x="${cx}" y="676" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#223027">Surakshitam Naturals</text>
  <rect x="${cx - 92}" y="696" width="184" height="38" rx="19" fill="${accent}"/>
  <text x="${cx}" y="723" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="21" font-weight="bold" letter-spacing="2.5" fill="#FAF6EF">BIO-ENZYME</text>
  <text x="${cx}" y="794" text-anchor="middle" font-family="Georgia, serif" font-size="52" font-weight="bold" fill="#223027">${esc(lines[0])}</text>
  <text x="${cx}" y="852" text-anchor="middle" font-family="Georgia, serif" font-size="52" font-weight="bold" fill="#223027">${esc(lines[1])}</text>
  <text x="${cx}" y="894" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#55694F">${esc(note)}</text>
  <line x1="${cx - 120}" y1="912" x2="${cx + 120}" y2="912" stroke="#223027" stroke-opacity="0.15" stroke-width="2"/>
  <text x="${cx}" y="944" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#223027">${esc(size)}</text>

  <!-- a citrus slice and a leaf, kept small -->
  <g transform="translate(${cx + 330} 1012)">
    <circle r="64" fill="#F2C94C"/><circle r="54" fill="#FBE7A1"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M0 0 L${(50 * Math.cos((i * Math.PI) / 4 - 0.18)).toFixed(1)} ${(50 * Math.sin((i * Math.PI) / 4 - 0.18)).toFixed(1)} A50 50 0 0 1 ${(50 * Math.cos((i * Math.PI) / 4 + 0.6)).toFixed(1)} ${(50 * Math.sin((i * Math.PI) / 4 + 0.6)).toFixed(1)} Z" fill="#F6D574"/>`).join("")}
    <circle r="6" fill="#FBE7A1"/>
  </g>
  <path d="M${cx - 420} 1050 q60 -110 170 -96 q-40 100 -170 96 z" fill="#6E8743"/>
  <path d="M${cx - 420} 1050 q80 -60 170 -96" stroke="#4E6431" stroke-width="4" fill="none"/>

  <text x="${cx}" y="1200" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="3" fill="#8A9A82">ILLUSTRATIVE PACK IMAGE</text>
</svg>`);
}

for (const p of products) {
  const dir = `public/surakshitam-product-images/${p.slug}`;
  await mkdir(dir, { recursive: true });
  const logo = await sharp(LOGO).resize(104, 104).toBuffer();
  const out = `${dir}/${p.slug}-01-listing-front-clean.webp`;
  await sharp(svg(p))
    .composite([{ input: logo, left: Math.round(SIZE / 2 - 52), top: 520 }])
    .webp({ quality: 76, effort: 6 })
    .toFile(out);
  console.log(out);
}
