/**
 * Courier charge for a checkout order (PENDING A4c). Rules drafted 9 Nov 2026,
 * awaiting the founders' WhatsApp confirmation.
 *
 * Pure functions with no imports, so the UPI amount, the WhatsApp message and
 * the Orders payload all get the same number. Pack weights come from the size
 * label ("500 ml", "1 L", "100 g"), so a new size needs no change here.
 *
 * Rules:
 * - Cart weight = every pack's weight × qty. No packaging allowance (removed 9 Nov 2026 at a founder's request).
 * - Telangana: ₹120 up to 2 kg, then +₹50 for each started kg above 2 kg.
 *   Hyderabad is a Telangana address, so it takes this rate too.
 * - Elsewhere in India: ₹150 up to 2 kg, then +₹60 for each started kg above 2 kg.
 * - Part of a kg counts as a full kg.
 *
 * Open with the founders (A4c). Each is a one-line change:
 * - Free delivery: set FREE_DELIVERY_FROM to a subtotal in rupees (null = off).
 * - Hyderabad local rule: change the Telangana branch in deliveryCharge().
 */

/** Subtotal (₹) at or above which delivery is free. null = no free-delivery rule (open question). */
export const FREE_DELIVERY_FROM: number | null = null;

const TELANGANA_STATE = "Telangana";
const BASE_UP_TO_G = 2000;
const TELANGANA_RATE = { base: 120, perKg: 50 };
const OUTSIDE_RATE = { base: 150, perKg: 60 };

/**
 * Grams in one pack from its size label: "500 ml" = 500 g, "1 L" = 1000 g,
 * "100 g" = 100 g (1 ml = 1 g). "approx. 100 g" (bar soaps) counts as 100 g.
 * Null when the label has no weight ("Round box", "Stick" on the lip balms).
 */
export function packWeightG(label: string): number | null {
  const m = /^(?:approx\.\s*)?(\d+(?:\.\d+)?)\s*(ml|l|g)$/i.exec(label.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return m[2].toLowerCase() === "l" ? Math.round(n * 1000) : n;
}

export type WeighedLine = { size: { label: string }; qty: number };

/** Whole-order grams, or null when any pack has no readable weight. */
export function orderWeightG(lines: WeighedLine[]): number | null {
  let grams = 0;
  for (const l of lines) {
    const w = packWeightG(l.size.label);
    if (w == null) return null;
    grams += w * l.qty;
  }
  return grams;
}

/** Courier charge in whole rupees for a weight in grams and a State name. */
export function deliveryCharge(weightG: number, state: string): number {
  const rate = state === TELANGANA_STATE ? TELANGANA_RATE : OUTSIDE_RATE;
  const startedKgAbove = Math.max(0, Math.ceil((weightG - BASE_UP_TO_G) / 1000));
  return rate.base + startedKgAbove * rate.perKg;
}

export type Delivery =
  /** No State chosen yet, so the charge cannot be worked out. */
  | { status: "pick-state" }
  /** A pack has no readable weight, so the charge is confirmed on WhatsApp. */
  | { status: "to-confirm" }
  | { status: "ok"; weightG: number; charge: number };

export function checkoutDelivery(lines: WeighedLine[], state: string, subtotal: number): Delivery {
  if (!state) return { status: "pick-state" };
  const weightG = orderWeightG(lines);
  if (weightG == null) return { status: "to-confirm" };
  const free = FREE_DELIVERY_FROM != null && subtotal >= FREE_DELIVERY_FROM;
  return { status: "ok", weightG, charge: free ? 0 : deliveryCharge(weightG, state) };
}

/** Customer-facing weight: "1.4 kg", "2 kg", "450 g". */
export function formatWeight(grams: number): string {
  return grams < 1000 ? `${grams} g` : `${Number((grams / 1000).toFixed(2))} kg`;
}
