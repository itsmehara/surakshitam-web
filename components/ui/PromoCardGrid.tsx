"use client";

import Image from "next/image";
import Link from "next/link";
import { promoCardContent, PROMO_TONE_BG, PROMO_TONE_TEXT, type PromoSlide } from "@/lib/promotions";
import { cn } from "@/lib/cn";
import { ArrowRight } from "@/components/icons";

/**
 * Grid of promo cards (offer / combo / discounted-product), shared by OffersFab's "see all"
 * modal and the /offers page so both stay visually identical.
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
      {slides.map((slide) => {
        const c = promoCardContent(slide);
        return (
          <Link
            key={slide.id}
            href={c.href}
            onClick={onNavigate}
            className={cn(
              "relative flex h-28 items-stretch overflow-hidden rounded-lg border-2 shadow-soft transition-transform hover:-translate-y-0.5",
              PROMO_TONE_BG[c.tone],
            )}
          >
            <div className="relative h-full w-[42%] shrink-0 overflow-hidden bg-white/70">
              <Image src={c.image} alt="" fill sizes="160px" className="scale-[1.1] object-cover object-[50%_55%]" />
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col justify-between p-3">
              <p className={cn("text-[0.62rem] font-bold uppercase tracking-wide", PROMO_TONE_TEXT[c.tone])}>
                {c.eyebrow}
              </p>
              <p className={cn("text-xl font-extrabold leading-[1.05]", PROMO_TONE_TEXT[c.tone])}>{c.big}</p>
              <p className="line-clamp-2 pr-4 text-xs font-bold leading-snug text-forest/80">{c.title}</p>
              <ArrowRight width={13} className="absolute bottom-0 right-0 text-forest/40" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
