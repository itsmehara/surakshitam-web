"use client";

import { useEffect, useState } from "react";
import { getLiveOffers, type Offer } from "@/lib/offers";
import { isOffersNavEnabled } from "@/lib/site-settings";
import { formatPrice } from "@/lib/format";
import { CloseIcon } from "@/components/icons";

const DISMISS_KEY = "sn-offer-banner-dismissed";

function offerText(offer: Offer): string {
  const savings = offer.type === "percent" ? `${offer.value}% off` : `${formatPrice(offer.value)} off`;
  return `${savings} with code ${offer.code}${offer.description ? ` — ${offer.description}` : ""}`;
}

/** Site-wide banner surfacing the best live offer, if any. Dismissible for the session
 *  (sessionStorage, not localStorage) so it reappears on the next visit. */
export function OfferBanner() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!isOffersNavEnabled()) return;
    const live = getLiveOffers();
    if (live.length === 0) return;
    setOffer(live[0]);
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === live[0].code);
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!offer || dismissed) return null;

  return (
    <div className="bg-clay text-cream">
      <div className="container flex h-9 items-center justify-center gap-3 text-xs sm:text-[0.8rem]">
        <p className="truncate text-center font-medium tracking-wide">{offerText(offer)}</p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, offer.code);
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
