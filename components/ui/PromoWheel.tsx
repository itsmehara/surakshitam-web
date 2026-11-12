"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { PROMO_WHEEL } from "@/lib/promo-wheel";

const CX = 50;
const ROOT_R = 40;
const TIP_R = 47;

/** Gear outline: `teeth` trapezoid teeth around a root circle, as one closed path. */
function gearPath(teeth: number): string {
  const step = 360 / teeth;
  const pt = (deg: number, rad: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(CX + rad * Math.sin(a)).toFixed(2)},${(CX - rad * Math.cos(a)).toFixed(2)}`;
  };
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    points.push(
      pt(a, ROOT_R),
      pt(a + step * 0.2, TIP_R),
      pt(a + step * 0.45, TIP_R),
      pt(a + step * 0.6, ROOT_R),
    );
  }
  return `M${points.join(" L")} Z`;
}

/**
 * Slowly turning toothed gear carrying the inaugural offer.
 *
 * - `variant="hero"`: sits in the home hero's copy column, beside the offer text.
 *   It is never placed over the product photo.
 * - `variant="floating"`: a small gear bottom-left on every other page. It links
 *   to the shop and can be hidden with ×. It opens nothing over the page.
 *
 * The gear turns with a CSS animation on its own layer, so the page layout never
 * moves. Visitors who ask for reduced motion see it still.
 */
export function PromoWheel({ variant }: { variant: "hero" | "floating" }) {
  const [hidden, setHidden] = useState(false);
  if (!PROMO_WHEEL.enabled || hidden) return null;

  const gear = (
    <div className="relative aspect-square w-full">
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="sn-gear-turn h-full w-full drop-shadow-sm will-change-transform"
        style={{ "--gear-spin": `${PROMO_WHEEL.secondsPerTurn}s` } as React.CSSProperties}
      >
        <path d={gearPath(PROMO_WHEEL.teeth)} className="fill-clay" />
        <circle cx={CX} cy={CX} r="33" className="fill-forest" />
        <circle cx={CX} cy={CX} r="29" className="fill-none stroke-cream/35" strokeWidth="0.8" strokeDasharray="1.5 2" />
      </svg>
      {/* the words stay upright: they sit on a layer above the turning gear */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-cream">
        <span className="font-serif text-[1.35em] font-semibold leading-none" style={{ fontSize: "clamp(0.95rem, 4.5vw, 1.6rem)" }}>
          10%
        </span>
        <span className="mt-[0.2em] font-sans font-bold uppercase tracking-[0.12em]" style={{ fontSize: "clamp(0.4rem, 1.6vw, 0.6rem)" }}>
          Off
        </span>
      </div>
    </div>
  );

  if (variant === "hero") {
    return (
      <div className="mt-6 flex items-center gap-4 lg:mt-7">
        <div className="w-24 shrink-0 sm:w-28">{gear}</div>
        <div className="max-w-xs">
          <p className="eyebrow">{PROMO_WHEEL.eyebrow}</p>
          <p className="mt-1 font-serif text-xl font-semibold text-forest">{PROMO_WHEEL.headline}</p>
          <p className="mt-1 text-sm text-forest/70">{PROMO_WHEEL.detail}</p>
          {PROMO_WHEEL.code && (
            <p className="mt-1 text-sm text-forest">
              Code <strong className="tracking-wider">{PROMO_WHEEL.code}</strong>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-20 z-40 w-16 sm:left-6 sm:w-20 lg:top-24">
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Hide the offer"
        className="absolute -right-2 -top-2 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[11px] leading-none text-cream shadow-soft"
      >
        ×
      </button>
      <Link
        href={PROMO_WHEEL.cta.href}
        aria-label={`${PROMO_WHEEL.headline}: ${PROMO_WHEEL.cta.label}`}
        className={cn("block rounded-full transition-transform duration-200 ease-smooth hover:scale-[1.04]")}
      >
        {gear}
      </Link>
    </div>
  );
}
