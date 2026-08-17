/**
 * Surakshitam Naturals — combines the screenshot folders into 4 shareable PDFs:
 *
 *   Desktop-Shopping-Cart.pdf   ← SurakshitamNaturals-Screenshots/Desktop-Shopping-Cart/*.png
 *   Desktop-Admin-Portal.pdf    ← SurakshitamNaturals-Screenshots/Desktop-Admin-Portal/*.png
 *   Mobile-Shopping-Cart.pdf    ← SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart/*.png
 *   Mobile-Admin-Portal.pdf     ← SurakshitamNaturals-Screenshots/Mobile-Admin-Portal/*.png
 *
 * One PNG per PDF page, in filename order (001-, 002-, ...), each page sized to match
 * its screenshot exactly (no stretching/cropping) — so the border + watermark added by
 * capture-all.mjs stay intact.
 *
 * Run this AFTER capture-all.mjs (or the individual capture-*.mjs scripts) have produced
 * the screenshot folders.
 *
 * HOW TO RUN (from surakshitam-web/):
 *   npm i -D pdf-lib   (one-time)
 *   node scripts/build-pdfs.mjs
 *
 * Output: ./SurakshitamNaturals-Screenshots/PDFs/*.pdf
 */
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

const ROOT = "./SurakshitamNaturals-Screenshots";
const OUT_DIR = path.join(ROOT, "PDFs");

const FOLDERS = [
  ["Desktop-Shopping-Cart", "Desktop-Shopping-Cart.pdf"],
  ["Desktop-Admin-Portal", "Desktop-Admin-Portal.pdf"],
  ["Mobile-Shopping-Cart", "Mobile-Shopping-Cart.pdf"],
  ["Mobile-Admin-Portal", "Mobile-Admin-Portal.pdf"],
];

async function buildPdf(folder, outFile) {
  const dir = path.join(ROOT, folder);
  if (!fs.existsSync(dir)) {
    console.warn(`⚠ ${dir} doesn't exist — run the matching capture script first. Skipping.`);
    return;
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort(); // filenames are zero-padded (001-, 002-, ...) so plain sort is correct order

  if (files.length === 0) {
    console.warn(`⚠ No PNGs found in ${dir} — skipping ${outFile}.`);
    return;
  }

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Surakshitam Naturals — ${folder.replace(/-/g, " ")}`);
  pdfDoc.setAuthor("Surakshitam Naturals");

  for (const file of files) {
    const bytes = fs.readFileSync(path.join(dir, file));
    const img = await pdfDoc.embedPng(bytes);
    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, outFile);
  fs.writeFileSync(outPath, await pdfDoc.save());
  console.log(`✓ ${outFile} (${files.length} pages)`);
}

const run = async () => {
  for (const [folder, outFile] of FOLDERS) {
    await buildPdf(folder, outFile);
  }
  console.log("\nDONE → " + OUT_DIR);
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
