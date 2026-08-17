/**
 * Combo / bundle kits (prototype). A bundle is a curated set of existing catalog
 * products sold together at a special combined price. Bundles do NOT introduce a
 * separate cart line type — "Add combo to cart" simply adds each component product
 * as a normal cart line, so checkout, orders and per-component stock decrement
 * (see catalog-store.ts decrementStockForOrder) all work unchanged. The combo
 * discount is computed separately (getBundleDiscountForCart) and applied at
 * checkout alongside any coupon discount. Persistence is localStorage, same
 * pattern as offers.ts / catalog-store.ts.
 */
import { getProductById } from "@/lib/catalog";

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Product ids that make up this combo. Duplicates count as qty>1 of that product. */
  productIds: string[];
  /** Combo price in paise — what the customer pays for the full set. */
  price: number;
  enabled: boolean;
}

const KEY = "sn-bundles-v1";

function read(): Bundle[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Bundle[];
  } catch {
    return [];
  }
}

function write(bundles: Bundle[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(bundles));
  } catch {
    /* ignore */
  }
}

export function getBundles(): Bundle[] {
  return read();
}

export function getBundle(id: string): Bundle | undefined {
  return read().find((b) => b.id === id);
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return read().find((b) => b.slug === slug);
}

export function getEnabledBundles(): Bundle[] {
  return read().filter((b) => b.enabled && b.productIds.length > 0);
}

export function saveBundle(bundle: Bundle): void {
  const all = read();
  const normalised: Bundle = { ...bundle, slug: bundle.slug.trim().toLowerCase().replace(/\s+/g, "-") };
  const idx = all.findIndex((b) => b.id === bundle.id);
  if (idx >= 0) all[idx] = normalised;
  else all.unshift(normalised);
  write(all);
}

export function deleteBundle(id: string): void {
  write(read().filter((b) => b.id !== id));
}

export function blankBundle(): Bundle {
  return {
    id: `bundle_${Date.now()}`,
    slug: "",
    name: "",
    description: "",
    image: "",
    productIds: [],
    price: 0,
    enabled: true,
  };
}

/** Sum of the component products' current selling prices (paise). */
export function bundleRegularTotal(bundle: Bundle): number {
  return bundle.productIds.reduce((sum, id) => sum + (getProductById(id)?.price ?? 0), 0);
}

/** Combo savings vs buying components separately (paise, never negative). */
export function bundleSavings(bundle: Bundle): number {
  return Math.max(0, bundleRegularTotal(bundle) - bundle.price);
}

/**
 * Given the product ids currently in the cart (one entry per unit, so a qty-2 line
 * should appear twice), returns every enabled bundle whose full component set is
 * present, with its discount amount. Used to auto-apply combo pricing at checkout.
 */
export function getBundleDiscountForCart(cartProductIds: string[]): { bundle: Bundle; discount: number }[] {
  const pool = [...cartProductIds];
  const results: { bundle: Bundle; discount: number }[] = [];
  for (const bundle of getEnabledBundles()) {
    const remaining = [...pool];
    const complete = bundle.productIds.every((id) => {
      const idx = remaining.indexOf(id);
      if (idx === -1) return false;
      remaining.splice(idx, 1);
      return true;
    });
    if (complete) {
      const discount = bundleSavings(bundle);
      if (discount > 0) results.push({ bundle, discount });
    }
  }
  return results;
}
