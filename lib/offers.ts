/**
 * Offers / coupon codes (prototype). Admin-managed discount codes with a start/end
 * duration, applied by the customer at checkout. Persistence is localStorage, same
 * pattern as catalog-store.ts / admin.ts. PRODUCTION: maps to a Supabase `offers`
 * table with server-side validation at order-creation time (never trust a
 * client-computed discount for a real charge).
 */

export type OfferType = "percent" | "flat";

export interface Offer {
  id: string;
  code: string; // stored uppercase, matched case-insensitively
  description: string;
  type: OfferType;
  /** percent: 0-100. flat: paise (matches Product.price units). */
  value: number;
  /** yyyy-mm-dd, inclusive on both ends. */
  startDate: string;
  endDate: string;
  enabled: boolean;
  /** Optional minimum cart subtotal (paise) required to use this code. */
  minOrderValue?: number;
}

const KEY = "sn-offers-v1";

function read(): Offer[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Offer[];
  } catch {
    return [];
  }
}

function write(offers: Offer[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(offers));
  } catch {
    /* ignore */
  }
}

export function getOffers(): Offer[] {
  return read();
}

export function getOffer(id: string): Offer | undefined {
  return read().find((o) => o.id === id);
}

/** Create or update by id. Code is normalised to uppercase/trimmed. */
export function saveOffer(offer: Offer): void {
  const all = read();
  const normalised: Offer = { ...offer, code: offer.code.trim().toUpperCase() };
  const idx = all.findIndex((o) => o.id === offer.id);
  if (idx >= 0) all[idx] = normalised;
  else all.unshift(normalised);
  write(all);
}

export function deleteOffer(id: string): void {
  write(read().filter((o) => o.id !== id));
}

export function blankOffer(): Offer {
  const today = new Date().toISOString().slice(0, 10);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  return {
    id: `off_${Date.now()}`,
    code: "",
    description: "",
    type: "percent",
    value: 10,
    startDate: today,
    endDate: endDate.toISOString().slice(0, 10),
    enabled: true,
  };
}

/** True if `offer` is enabled and today falls within [startDate, endDate] inclusive. */
export function isOfferLive(offer: Offer, now: Date = new Date()): boolean {
  if (!offer.enabled) return false;
  const today = now.toISOString().slice(0, 10);
  return today >= offer.startDate && today <= offer.endDate;
}

export function getLiveOffers(): Offer[] {
  return read().filter((o) => isOfferLive(o));
}

export type OfferResult =
  | { ok: true; offer: Offer; discount: number }
  | { ok: false; reason: string };

/**
 * Validates a code against `subtotal` (paise) and returns the discount amount
 * (paise, never more than the subtotal) if valid. Called from checkout — this is a
 * prototype convenience check; production must re-validate server-side before charging.
 */
export function applyOfferCode(code: string, subtotal: number): OfferResult {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { ok: false, reason: "Enter a code." };
  const offer = read().find((o) => o.code === trimmed);
  if (!offer) return { ok: false, reason: "That code isn't valid." };
  if (!isOfferLive(offer)) return { ok: false, reason: "That code has expired or isn't active yet." };
  if (offer.minOrderValue && subtotal < offer.minOrderValue) {
    return {
      ok: false,
      reason: `This code needs a minimum order of ₹${(offer.minOrderValue / 100).toFixed(0)}.`,
    };
  }
  const raw = offer.type === "percent" ? Math.round((subtotal * offer.value) / 100) : offer.value;
  const discount = Math.min(raw, subtotal);
  return { ok: true, offer, discount };
}
