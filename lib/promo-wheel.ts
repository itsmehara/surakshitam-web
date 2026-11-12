/**
 * The inaugural offer gear: the single place to change its wording, offer, link,
 * tooth count or to switch it off. The gear itself is components/ui/PromoWheel.tsx;
 * the hero copy is on the home page, the floating gear on every other page.
 *
 * Discount: the 10% inaugural offer, applied in lib/catalog.ts (payPrice) so prices, cart,
 * UPI QR, WhatsApp text and Orders all agree. No coupon code; never stacked on a pack's own offer rate. `code` is shown only when set; until
 * founders confirm how the 10% is applied at checkout, leave it unset.
 */
export const PROMO_WHEEL = {
  enabled: true,
  eyebrow: "Website inauguration offer",
  /** Percent off MRP on every pack. Packs whose own offer rate is already lower keep it; the two never stack. */
  discountPct: 10,
  headline: "10% off on all products",
  detail: "Celebrate our launch: 10% off every skin, hair and home care product. Not combined with other offers."
  ,caption: "On all products",
  code: undefined as string | undefined,
  cta: { label: "Shop now", href: "/shop" },
  /** Number of teeth on the gear. */
  teeth: 16,
  /** Seconds for one full turn. The gear keeps turning slowly; it never stops or waits for a tap. */
  secondsPerTurn: 40,
};
