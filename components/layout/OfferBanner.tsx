"use client";

import { useEffect, useState } from "react";
import { getLiveOffers, type Offer } from "@/lib/offers";
import { isOffersNavEnabled } from "@/lib/site-settings";
import { formatPrice } from "@/lib/format";
import { FREE_DELIVERY_HEADLINE } from "@/lib/delivery";
import { CloseIcon } from "@/components/icons";

const DISMISS_KEY = "sn-offer-banner-dismissed";

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
    const live = isOffersNavEnabled() ? getLiveOffers() : [];
    const best = live[0] ?? null;
    setOffer(best);
    const key = best ? best.code : "free-delivery";
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === key);
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

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
