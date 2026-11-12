/**
 * The inaugural offer gear: the single place to change its wording, offer, link,
 * tooth count or to switch it off. The gear itself is components/ui/PromoWheel.tsx;
 * the hero copy is on the home page, the floating gear on every other page.
 *
 * Discount: the 10% inaugural offer. The site has no coupon engine, so the gear
 * only tells the visitor about the offer. `code` is shown only when set; until
 * founders confirm how the 10% is applied at checkout, leave it unset.
 */
export const PROMO_WHEEL = {
  enabled: true,
  eyebrow: "Inaugural offer · Limited time",
  headline: "10% off",
  detail: "On your first order. Shop before the inaugural offer closes.",
  code: undefined as string | undefined,
  cta: { label: "Shop now", href: "/shop" },
  /** Number of teeth on the gear. */
  teeth: 16,
  /** Seconds for one full turn. The gear keeps turning slowly; it never stops or waits for a tap. */
  secondsPerTurn: 40,
};
