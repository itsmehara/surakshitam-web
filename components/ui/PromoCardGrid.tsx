"use client";

import { type PromoSlide } from "@/lib/promotions";
import { PromoTile } from "@/components/ui/PromoTile";

/**
 * Grid of promo tiles, used by OffersFab's "see all offers" pop-up. Renders the
 * same `PromoTile` as the strip on /offers, so the two always match.
 */
export function PromoCardGrid({
  slides,
  onNavigate,
}: {
  slides: PromoSlide[];
  onNavigate?: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {slides.map((slide) => (
        <PromoTile key={slide.id} slide={slide} heightClass="h-28" onNavigate={onNavigate} />
      ))}
    </div>
  );
}
