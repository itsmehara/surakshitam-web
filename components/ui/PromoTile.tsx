"use client";

import Image from "next/image";
import Link from "next/link";
import { promoCardContent, PROMO_TONE_BG, PROMO_TONE_TEXT, type PromoSlide } from "@/lib/promotions";
import { cn } from "@/lib/cn";

/**
 * One promo tile — an offer code, a combo kit, or a marked-down product.
 *
 * The single card used by both the strip on /offers and the "see all offers"
 * pop-up, so the two can't drift apart.
 *
 * **Why the image panel is square.** Every image that reaches this tile is
 * square (the product shots are 1254×1254, and both fallback placeholders are
 * 800×800). A square source in a square panel under `object-cover` fits exactly:
 * the product is shown at full size, edge to edge, with nothing cropped at all.
 *
 * The panel takes its width from the card's height (`aspect-square h-full`),
 * which is what makes that guarantee hold at any card size — no per-breakpoint
 * width caps to keep in sync. Earlier versions fixed the width as a percentage
 * and the panel silently turned landscape at some viewports, where `cover`
 * trims the *vertical* axis and slices the tops off the taller bottles.
 */
export function PromoTile({
  slide,
  heightClass,
  onNavigate,
}: {
  slide: PromoSlide;
  /** Card height. The image panel sizes itself from it. */
  heightClass: string;
  onNavigate?: () => void;
}) {
  const c = promoCardContent(slide);

  return (
    <Link
      href={c.href}
      onClick={onNavigate}
      className={cn(
        "flex items-stretch overflow-hidden rounded-lg border-2 shadow-soft transition-transform hover:-translate-y-0.5",
        heightClass,
        PROMO_TONE_BG[c.tone],
      )}
    >
      <div className="relative aspect-square h-full w-auto shrink-0 overflow-hidden bg-white/70">
        <Image
          src={c.image}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, 180px"
          className="object-cover"
        />
      </div>

      {/* Text column takes whatever the image leaves. `justify-between` spreads
          the three lines over the full height instead of clumping them at the top. */}
      <div className="relative flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-3">
        <p className={cn("truncate text-[0.58rem] font-bold uppercase tracking-wide sm:text-[0.62rem]", PROMO_TONE_TEXT[c.tone])}>
          {c.eyebrow}
        </p>
        <p className={cn("whitespace-nowrap text-xl font-extrabold leading-[1.05]", PROMO_TONE_TEXT[c.tone])}>
          {c.big}
        </p>
        <p className="line-clamp-2 text-[0.68rem] font-bold leading-snug text-forest/80 sm:text-xs">
          {c.title}
        </p>
      </div>
    </Link>
  );
}
