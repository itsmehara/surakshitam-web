"use client";

import { useEffect, useState } from "react";
import { getHomePromotions, type PromoSlide } from "@/lib/promotions";
import { isOffersNavEnabled } from "@/lib/site-settings";
import { PromoCardGrid } from "@/components/ui/PromoCardGrid";
import { CloseIcon } from "@/components/icons";

/**
 * A larger button that opens every live offer, combo and discounted product in one scrollable
 * list. Rendered as the third item in FloatingContact's bottom-right stack (below WhatsApp), so
 * it inherits that stack's fixed positioning rather than positioning itself. Only renders when
 * there's at least one live promotion AND the admin hasn't switched "Offers" off (same flag
 * that hides the header nav link — this button is another entry point to the same thing, so it
 * respects the same toggle).
 */
export function OffersFab() {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [open, setOpen] = useState(false);
  const [navEnabled, setNavEnabled] = useState(true);

  useEffect(() => {
    setSlides(getHomePromotions());
    setNavEnabled(isOffersNavEnabled());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!navEnabled || slides.length === 0) return null;

  return (
    <>
      {/* Outer wrapper stays un-clipped so the count badge can poke past the pill's edge;
          the inner pill is what actually clips/expands the hover label. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`See all ${slides.length} offers`}
        className="group relative flex items-center transition-transform duration-200 hover:scale-[1.03]"
      >
        <span className="flex items-center overflow-hidden rounded-full bg-clay text-cream shadow-card">
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-smooth group-hover:max-w-[7rem] group-hover:pl-4 group-hover:opacity-100">
            See offers
          </span>
          {/* Slightly larger than the Instagram/WhatsApp buttons above it, so it still stands
              out as its own thing while sitting in the same stack. */}
          <span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5">
            <span className="text-2xl font-extrabold leading-none">%</span>
            <span className="text-[0.55rem] font-bold uppercase tracking-wide">Offers</span>
          </span>
        </span>
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-[0.65rem] font-bold text-cream shadow">
          {slides.length}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-forest/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="All offers"
        >
          {/* Capped at half the viewport height; header stays fixed (outside the scroll area)
              so the close button is always reachable no matter how far the list is scrolled. */}
          <div
            className="flex max-h-[50vh] w-full flex-col overflow-hidden rounded-t-2xl bg-cream shadow-card sm:max-w-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-forest/8 px-5 py-3.5 sm:px-6">
              <h2 className="font-serif text-lg font-semibold text-forest sm:text-xl">
                All offers ({slides.length})
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-forest hover:bg-forest/5"
              >
                <CloseIcon width={18} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <PromoCardGrid slides={slides} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
