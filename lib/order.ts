/**
 * WhatsApp order message — the one message the cart produces
 * (PRODUCT-CATALOG-NOTES-2026-09-19 §7.2 / §7.3). Kept free of React so the
 * drawer can preview exactly what will be sent and the checkout can reuse it.
 */

import type { CartLine } from "@/lib/cart/CartContext";

const WA_NUMBER = "917416394594";

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** `Herbal Shampoo — 500 ml × 2 — ₹1,100`, or `— price on request`. */
export function formatOrderLines(lines: CartLine[]): string {
  return lines
    .map((l, i) => {
      const amount = l.size.mrp == null ? "price on request" : rupees(l.size.mrp * l.qty);
      return `${i + 1}. ${l.product.name} — ${l.size.label} × ${l.qty} — ${amount}`;
    })
    .join("\n");
}

export function orderSubtotal(lines: CartLine[]): { subtotal: number; hasPriceOnRequest: boolean } {
  return {
    subtotal: lines.reduce((sum, l) => sum + (l.size.mrp ?? 0) * l.qty, 0),
    hasPriceOnRequest: lines.some((l) => l.size.mrp == null),
  };
}

export function formatSubtotal(lines: CartLine[]): string {
  const { subtotal, hasPriceOnRequest } = orderSubtotal(lines);
  return `Subtotal: ${rupees(subtotal)} (MRP, incl. taxes)${hasPriceOnRequest ? " + items priced on request" : ""}`;
}

/** The cart's WhatsApp message: numbered lines, subtotal, optional note. */
export function cartMessage(lines: CartLine[], note?: string): string {
  const trimmed = note?.trim();
  return (
    "Hi Surakshitam Naturals, I'd like to order:\n\n" +
    formatOrderLines(lines) +
    `\n${formatSubtotal(lines)}` +
    (trimmed ? `\n\nNote: ${trimmed}` : "") +
    "\n\nPlease confirm availability and delivery charges; I'll pay on WhatsApp."
  );
}

export function whatsAppCartHref(lines: CartLine[], note?: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(cartMessage(lines, note))}`;
}
