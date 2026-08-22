/**
 * Parcel weight (prototype).
 *
 * Every product carries an approximate net weight in grams. Where a product
 * doesn't declare one we derive it from its pack size ("500 ml" → ~500 g,
 * "200 g" → 200 g) so the cart can always quote a parcel weight for a courier
 * or bike booking. The figure is deliberately approximate — packaging, cartons
 * and liquid density all vary — so every screen that shows it says so.
 *
 * PRODUCTION: store a verified `weight_grams` per product plus carton
 * dimensions; couriers bill on the greater of actual and volumetric weight, so
 * keep both once a real shipping API is wired in.
 */
import type { Product } from "./types";

/** Outer box, bubble wrap, filler and invoice — added once per parcel. */
export const PACKAGING_TARE_GRAMS = 120;

/** Rough density used when a pack is measured in ml (most of our liquids are water-based). */
const ML_TO_GRAMS = 1.02;

/**
 * Turns a human pack size ("500 ml", "1 L", "200 g", "1.5 kg") into grams.
 * Returns null when the size can't be read — callers fall back to a default.
 */
export function parseSizeToGrams(size: string): number | null {
  if (!size) return null;
  const m = size.trim().toLowerCase().match(/([\d.]+)\s*(kg|g|gm|gms|grams?|ml|l|ltr|litre|liters?)/);
  if (!m) return null;
  const value = Number(m[1]);
  if (!Number.isFinite(value) || value <= 0) return null;
  const unit = m[2];
  if (unit === "kg") return Math.round(value * 1000);
  if (unit.startsWith("g")) return Math.round(value);
  if (unit === "ml") return Math.round(value * ML_TO_GRAMS);
  // litres
  return Math.round(value * 1000 * ML_TO_GRAMS);
}

/** Fallback when neither an explicit weight nor a readable pack size exists. */
const DEFAULT_ITEM_GRAMS = 250;

/**
 * Approximate weight of one unit. An explicit `weightGrams` is the packed
 * weight; a value derived from the pack size is the net contents only, so it
 * runs a little light for bottled items. Set `weightGrams` per product once the
 * founders have weighed a packed unit.
 */
export function productWeightGrams(product: Pick<Product, "weightGrams" | "size">): number {
  if (product.weightGrams && product.weightGrams > 0) return product.weightGrams;
  return parseSizeToGrams(product.size) ?? DEFAULT_ITEM_GRAMS;
}

export interface WeighedLine {
  product: Pick<Product, "weightGrams" | "size">;
  qty: number;
}

/** Net weight of the goods only (no packaging). */
export function itemsWeightGrams(lines: WeighedLine[]): number {
  return lines.reduce((sum, l) => sum + productWeightGrams(l.product) * l.qty, 0);
}

/** Total parcel weight — goods + one packaging allowance. Zero for an empty cart. */
export function parcelWeightGrams(lines: WeighedLine[]): number {
  const net = itemsWeightGrams(lines);
  return net > 0 ? net + PACKAGING_TARE_GRAMS : 0;
}

/** "850 g" / "1.35 kg" — always paired with an "approximate" note in the UI. */
export function formatWeight(grams: number): string {
  if (grams <= 0) return "0 g";
  if (grams < 1000) return `${Math.round(grams)} g`;
  return `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 2)} kg`;
}

/** Billable courier weight, rounded up to the next 500 g slab. */
export function billableWeightGrams(grams: number): number {
  return Math.ceil(grams / 500) * 500;
}
