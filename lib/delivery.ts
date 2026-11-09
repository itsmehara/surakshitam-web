/**
 * Delivery for a checkout order (PENDING A5). Built 9 Nov 2026 on the courier
 * rules (A4c) and the customer's choice of Courier or Rapido. Awaiting the
 * founders' WhatsApp confirmation (E2).
 *
 * Pure functions apart from deliveryZone() in lib/india.ts, so the UPI amount,
 * the WhatsApp message and the Orders payload all get the same numbers. Pack
 * weights come from the size label ("500 ml", "1 L", "100 g"), so a new size
 * needs no change here.
 *
 * Rules:
 * - Free delivery: a subtotal above FREE_DELIVERY_OVER (more than, not equal to)
 *   is free by either method. Free beats everything else below.
 * - Courier (anywhere in India): cart weight = every pack's weight × qty, no
 *   packaging allowance. Telangana: ₹120 up to 2 kg, then +₹50 for each started
 *   kg above 2 kg. Elsewhere: ₹150 up to 2 kg, then +₹60 for each started kg.
 *   Part of a kg counts as a full kg. Added to the total.
 * - Rapido (Hyderabad and Secunderabad only, 500xxx): the customer pays the
 *   Rapido fare to the rider, so nothing is added to the total. Rapido can only
 *   be picked for a 500xxx pincode; any other pincode falls back to courier.
 *
 * One-line changes once the founders decide:
 * - Free-delivery threshold: FREE_DELIVERY_OVER.
 * - Rapido area: deliveryZone() in lib/india.ts.
 * - Courier rates: TELANGANA_RATE / OUTSIDE_RATE.
 */

import { deliveryZone } from "@/lib/india";

/** Subtotal (₹) above which delivery is free, by courier or Rapido. */
export const FREE_DELIVERY_OVER = 2000;

export type DeliveryMethod = "courier" | "rapido";

const TELANGANA_STATE = "Telangana";
const BASE_UP_TO_G = 2000;
const TELANGANA_RATE = { base: 120, perKg: 50 };
const OUTSIDE_RATE = { base: 150, perKg: 60 };

/** Rapido runs in Hyderabad and Secunderabad only: the 500xxx pincodes (lib/india.ts). */
export function rapidoAvailable(pincode: string): boolean {
  return deliveryZone(pincode) === "hyderabad";
}

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

/** The courier charge in parts, so the checkout can show how it adds up. */
export type CourierBreakdown = {
  /** ₹ for the first 2 kg. */
  base: number;
  /** ₹ per started kg above 2 kg. */
  perKg: number;
  /** Started kg above 2 kg. */
  extraKg: number;
  /** extraKg × perKg. */
  extra: number;
  /** base + extra, in whole rupees. */
  total: number;
};

/** Courier charge for a weight in grams and a State name. */
export function courierBreakdown(weightG: number, state: string): CourierBreakdown {
  const rate = state === TELANGANA_STATE ? TELANGANA_RATE : OUTSIDE_RATE;
  const extraKg = Math.max(0, Math.ceil((weightG - BASE_UP_TO_G) / 1000));
  const extra = extraKg * rate.perKg;
  return { base: rate.base, perKg: rate.perKg, extraKg, extra, total: rate.base + extra };
}

/** What the customer has picked, with the pincode and State it applies to. */
export type DeliveryChoice = { method: DeliveryMethod; pincode: string; state: string };

export type Delivery =
  /**
   * Subtotal above FREE_DELIVERY_OVER: nothing is added to the total. `waived` is the
   * courier charge the rule takes off, when it can be worked out (courier, a State
   * chosen and every pack weighed). The summary shows it struck out and discounted.
   */
  | { status: "free"; method: DeliveryMethod; waived: { weightG: number; breakdown: CourierBreakdown } | null }
  /** Rapido: the rider is paid the fare directly, so nothing is added to the total. */
  | { status: "rapido" }
  /** Courier, but no State chosen yet, so the charge cannot be worked out. */
  | { status: "pick-state" }
  /** Courier, and a pack has no readable weight, so the charge is confirmed on WhatsApp. */
  | { status: "to-confirm" }
  /** Courier: the charge is added to the total. */
  | { status: "courier"; weightG: number; charge: number; breakdown: CourierBreakdown };

export function checkoutDelivery(lines: WeighedLine[], choice: DeliveryChoice, subtotal: number): Delivery {
  const rapido = choice.method === "rapido" && rapidoAvailable(choice.pincode);
  if (subtotal > FREE_DELIVERY_OVER) {
    // The courier charge the rule waives, so the summary can show it struck out.
    const weightG = rapido || !choice.state ? null : orderWeightG(lines);
    const waived = weightG == null ? null : { weightG, breakdown: courierBreakdown(weightG, choice.state) };
    return { status: "free", method: rapido ? "rapido" : "courier", waived };
  }
  if (rapido) return { status: "rapido" };
  if (!choice.state) return { status: "pick-state" };
  const weightG = orderWeightG(lines);
  if (weightG == null) return { status: "to-confirm" };
  const breakdown = courierBreakdown(weightG, choice.state);
  return { status: "courier", weightG, charge: breakdown.total, breakdown };
}

/** Rupees this delivery adds to the total: 0 when free or Rapido, null while it is still to confirm. */
export function deliveryAdded(d: Delivery): number | null {
  if (d.status === "courier") return d.charge;
  if (d.status === "free" || d.status === "rapido") return 0;
  return null;
}

/** The method the order goes by, for the WhatsApp message and the Orders tab. */
export function deliveryMethodOf(d: Delivery): DeliveryMethod {
  if (d.status === "rapido") return "rapido";
  if (d.status === "free") return d.method;
  return "courier";
}

/** Customer-facing weight: "1.4 kg", "2 kg", "450 g". */
export function formatWeight(grams: number): string {
  return grams < 1000 ? `${grams} g` : `${Number((grams / 1000).toFixed(2))} kg`;
}
