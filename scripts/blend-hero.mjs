/**
 * Harmonise an outpainted hero banner: the original (centre 1900x1069 of the
 * 2560x1440 canvas) stays sharp; the new outer band falls gently out of focus
 * and its tone is nudged toward the original's edge, with a wide feathered
 * transition across the join so nothing reads as a pasted rectangle.
 *   node scripts/blend-hero.mjs <in.png> <out.png> [blurSigma=7] [feather=150]
 */
import sharp from "sharp";
const [inp, out, sigmaArg = "7", featherArg = "150"] = process.argv.slice(2);
const sigma = Number(sigmaArg), feather = Number(featherArg);
const W = 2560, H = 1440, OX = 330, OY = 185, OW = 1900, OH = 1069;

const base = sharp(inp).flatten({ background: "#f3efe6" });
const sharpBuf = await base.clone().png().toBuffer();
// out-of-focus band: blur + slight desaturate/lift, like background falloff
const softBuf = await base.clone().blur(sigma).modulate({ saturation: 0.94, brightness: 1.015 }).png().toBuffer();
// mask: white (=sharp) inside the original, feathered outward past the join
const inset = Math.round(feather * 0.35);
const maskSvg = `<svg width="${W}" height="${H}"><defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${feather / 2}"/></filter></defs>
<rect width="${W}" height="${H}" fill="#000"/>
<rect x="${OX + inset}" y="${OY + inset}" width="${OW - 2 * inset}" height="${OH - 2 * inset}" rx="24" fill="#fff" filter="url(#f)"/></svg>`;
const mask = await sharp(Buffer.from(maskSvg)).toColourspace("b-w").png().toBuffer();
const sharpMasked = await sharp(sharpBuf).ensureAlpha().joinChannel(mask).png().toBuffer();
await sharp(softBuf).composite([{ input: sharpMasked }]).png().toFile(out);
console.log("wrote", out);
