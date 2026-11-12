/**
 * The inaugural offer gear: the single place to change its wording, offer, link,
 * tooth count or to switch it off. The gear itself is components/ui/PromoWheel.tsx;
 * the hero copy is on the home page, the floating gear on every other page.
 *
 * Discount: the 10% inaugural offer, taken off the cart value at checkout (lib/order.ts,
 * orderCharges) on top of pack offer rates. No coupon code. Cart, checkout, UPI QR, WhatsApp
 * text and Orders all read orderCharges, so they agree. `code` is shown only when set; until
 * founders confirm how the 10% is applied at checkout, leave it unset.
 */
export const PROMO_WHEEL = {
  enabled: true,
  eyebrow: "Website inauguration offer",
  /** Percent off the whole cart, on top of any pack offer rates (they stack). Delivery is not discounted. */
  discountPct: 10,
  /** Last day of the offer, "YYYY-MM-DD" (inclusive, India time). Not fixed yet: leave undefined and set enabled false to end it. */
  endsOn: undefined as string | undefined,
  headline: "Extra 10% off your cart",
  detail: "Celebrate our launch: an extra 10% off your whole cart, on top of our launch prices. For a few days only."
  ,caption: "Extra on your cart",
  code: undefined as string | undefined,
  cta: { label: "Shop now", href: "/shop" },
  /** Number of teeth on the gear. */
  teeth: 16,
  /** Seconds for one full turn. The gear keeps turning slowly; it never stops or waits for a tap. */
  secondsPerTurn: 40,
};
