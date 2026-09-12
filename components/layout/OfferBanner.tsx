"use client";

import { useEffect, useState } from "react";
import { getLiveOffers, type Offer } from "@/lib/offers";
import { isOffersNavEnabled } from "@/lib/site-settings";
import { formatPrice } from "@/lib/format";
import { FREE_DELIVERY_HEADLINE } from "@/lib/delivery";
import { CloseIcon } from "@/components/icons";

const DISMISS_KEY = "sn-offer-banner-dismissed";

/**
 * Discount-code banner — PARKED, not shown to customers.
 *
 * The founders asked for the "N% off with code X" strip to be switched off for
 * now; the coupon feature may go live later. Flip this to `true` to bring it
 * back — nothing else needs changing, and the admin Offers screens keep working
 * in the meantime.
 *
 * The free-delivery line below is a standing shipping policy, not a coupon, so
 * it stays.
 */
const SHOW_COUPON_BANNER = false;

/**
 * The whole top strip is off — coupon line and free-delivery line both.
 * Set to `true` to bring the bar back.
 *
 * The free-delivery promise itself is NOT lost: it still shows on every product
 * page, in the cart as the "add ₹X more" progress line, and as the pinned card
 * on /offers. Only this banner is gone.
 */
const SHOW_OFFER_BANNER = false;

function offerText(offer: Offer): string {
  const savings = offer.type === "percent" ? `${offer.value}% off` : `${formatPrice(offer.value)} off`;
  return `${savings} with code ${offer.code}${offer.description ? ` — ${offer.description}` : ""}`;
}

/**
 * Site-wide banner. Shows the best live coupon when there is one, and otherwise
 * falls back to the standing free-delivery offer — a permanent shipping promise
 * rather than an admin-managed code, so it isn't tied to the offers toggle.
 * Dismissible for the session (sessionStorage) so it reappears on the next visit.
 */
export function OfferBanner() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const live = SHOW_COUPON_BANNER && isOffersNavEnabled() ? getLiveOffers() : [];
    const best = live[0] ?? null;
    setOffer(best);
    const key = best ? best.code : "free-delivery";
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === key);
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!SHOW_OFFER_BANNER || dismissed) return null;

  const message = offer ? offerText(offer) : `🛵 ${FREE_DELIVERY_HEADLINE}`;
  const dismissKey = offer ? offer.code : "free-delivery";

  return (
    <div className={offer ? "bg-clay text-cream" : "bg-moss text-cream"}>
      <div className="container flex h-9 items-center justify-center gap-3 text-xs sm:text-[0.8rem]">
        <p className="truncate text-center font-medium tracking-wide">{message}</p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, dismissKey);
            } catch {
              /* ignore */
            }
          }}
          aria-label="Dismiss offer"
          className="shrink-0 text-cream/80 hover:text-cream"
        >
          <CloseIcon width={14} height={14} />
        </button>
      </div>
    </div>
  );
}
