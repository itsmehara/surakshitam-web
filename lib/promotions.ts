/**
 * Aggregates everything worth promoting on the homepage carousel: live offer codes,
 * live combo/bundle kits, and any product currently marked down (mrp > price). Offers
 * and bundles are localStorage-backed (see offers.ts / bundles.ts), so callers must be
 * client components reading this on mount, same pattern as OfferBanner.tsx.
 */
import { getLiveOffers, type Offer } from "@/lib/offers";
import { getEnabledBundles, bundleSavings, type Bundle } from "@/lib/bundles";
import { getProductById, products } from "@/lib/catalog";
import { formatPrice, discountPercent } from "@/lib/format";
import type { Product } from "@/lib/types";

export type PromoSlide =
  | { kind: "offer"; id: string; offer: Offer }
  | { kind: "combo"; id: string; bundle: Bundle }
  | { kind: "product"; id: string; product: Product };

export function getHomePromotions(): PromoSlide[] {
  const slides: PromoSlide[] = [];

  for (const offer of getLiveOffers()) {
    slides.push({ kind: "offer", id: `offer-${offer.id}`, offer });
  }

  for (const bundle of getEnabledBundles()) {
    if (bundleSavings(bundle) > 0) {
      slides.push({ kind: "combo", id: `combo-${bundle.id}`, bundle });
    }
  }

  for (const p of products) {
    if (p.mrp && p.mrp > p.price) {
      slides.push({ kind: "product", id: `product-${p.id}`, product: p });
    }
  }

  return slides;
}

/**
 * Shared card-rendering shape/logic for a PromoSlide — used by both the homepage carousel
 * (PromoCarousel.tsx) and the site-wide "see all offers" floating button (OffersFab.tsx) so the
 * two never drift out of sync with each other's copy or styling.
 */
export interface PromoCardContent {
  eyebrow: string;
  big: string; // large headline figure, e.g. "20% OFF"
  title: string;
  href: string;
  image: string;
  tone: "clay" | "moss" | "forest";
}

const FALLBACK_IMAGE = "/products/placeholder.webp";

export function promoCardContent(slide: PromoSlide): PromoCardContent {
  if (slide.kind === "offer") {
    const { offer } = slide;
    const big = offer.type === "percent" ? `${offer.value}% OFF` : `${formatPrice(offer.value)} OFF`;
    const pick = products.find((p) => p.mrp && p.mrp > p.price);
    return {
      eyebrow: "Limited Offer",
      big,
      title: `Use code ${offer.code}`,
      href: "/offers",
      image: pick?.image ?? FALLBACK_IMAGE,
      tone: "clay",
    };
  }
  if (slide.kind === "combo") {
    const { bundle } = slide;
    const firstProduct = bundle.productIds.map((id) => getProductById(id)).find(Boolean);
    return {
      eyebrow: "Combo Deal",
      big: `Save ${formatPrice(bundleSavings(bundle))}`,
      title: bundle.name,
      href: "/offers?tab=combos",
      image: firstProduct?.image ?? FALLBACK_IMAGE,
      tone: "moss",
    };
  }
  const { product } = slide;
  const pct = discountPercent(product.price, product.mrp);
  return {
    eyebrow: "On Sale",
    big: pct ? `${pct}% OFF` : "On sale",
    title: product.mrp
      ? `${formatPrice(product.price)} (was ${formatPrice(product.mrp)})`
      : product.name,
    href: `/product/${product.slug}`,
    image: product.image,
    tone: "forest",
  };
}

export const PROMO_TONE_BG: Record<PromoCardContent["tone"], string> = {
  clay: "bg-clay/25 border-cream",
  moss: "bg-moss/25 border-cream",
  forest: "bg-forest/15 border-cream",
};

export const PROMO_TONE_TEXT: Record<PromoCardContent["tone"], string> = {
  clay: "text-clay",
  moss: "text-moss",
  forest: "text-forest",
};
