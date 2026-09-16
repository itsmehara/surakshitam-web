"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LinkButton } from "@/components/ui/Button";
import { FallingBotanicals } from "@/components/ui/FallingBotanicals";
import { FallingFruitPhysics } from "@/components/ui/FallingFruitPhysics";
import { ArrowRight, ChevronDown, LeafIcon, BeakerIcon, RecycleIcon } from "@/components/icons";

/**
 * v2 homepage hero — a photo-filling banner slideshow (the generated
 * `public/banners/*.webp` set) with the copy overlaid on the left, in the
 * spirit of the Green Energy Solutions hero but cycling through the range.
 *
 * Height is deliberately ~80% of the viewport, not 100%: the featured
 * products strip peeks in at the bottom so a first-time visitor sees there is
 * more to scroll. Leaves + the falling-fruit solver run over the photo, as on
 * the v1 hero.
 *
 * Motion: crossfade every HOLD_MS; every slide drifts continuously (zoom +
 * pan, `.sn-drift-*` in globals.css) so the picture is never frozen. It does
 * NOT pause when the mouse rests on the photo — that read as "stuck" — only
 * while the cursor is over the dots/arrows. Static frame under reduced motion.
 *
 * Images (16 Sep, v2): surakshitam-docs/source-assets/banner-masters-v2/ —
 * four re-framed scenes (camera pulled back, ~13% margin), the outpainted
 * hair-care banner, and two originals still awaiting a re-frame (range,
 * dishwash). Served as `-v2-{1280,2048}.webp`; the two originals only have
 * a 1280 variant at their native width. `focus.desktop` keeps caps in frame
 * on very wide viewports.
 *
 * Layout: desktop (lg+) — copy left over a horizontal scrim, photo `cover`
 * with a per-slide focal point; the drift (1.04→1.12×, ±2% pan) never eats
 * more than the new margin, so no product is ever cropped. Below lg — the
 * WHOLE image is shown (`object-contain`, top-aligned, a blurred copy of
 * itself filling the letterbox) with the copy beneath it, so nothing is
 * cropped on phones at all.
 *
 * Loading: only slide 0 is fetched eagerly; each next slide's <img> is
 * mounted one hold before it is due, so six slides cost one image up front.
 */

interface Slide {
  /** Base name in public/banners/ → `${src}-v2-{1280,2048}.webp` */
  src: string;
  alt: string;
  /**
   * CSS `object-position` for the crop — `mobile` applies below `lg`
   * (portrait crop), `desktop` from `lg` up. Defaults: "62% center" / "center right".
   */
  focus?: { mobile?: string; desktop?: string };
  eyebrow: string;
  title: [string, string];
  body: string;
  cta: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    src: "homepage-hero-home-skin-hair-complete-product-range",
    focus: { desktop: "center top" },
    alt: "Surakshitam Naturals home, skin and hair care range on a stone slab with neem, hibiscus and lemon",
    eyebrow: "Homemade · Plant-based · Hyderabad",
    title: ["Everyday care,", "thoughtfully formulated."],
    body: "Homemade, plant-based skin, hair and home care from Hyderabad — herbal soaps and natural cleaners made with natural essential oils, in small batches.",
    cta: { label: "Shop all products", href: "/shop" },
  },
  {
    src: "skin-care-handmade-botanical-soap-collection",
    focus: { desktop: "center" },
    alt: "Handmade botanical soaps — papaya, shea butter, neem tulasi and triple butter",
    eyebrow: "Skin care",
    title: ["Botanical care,", "made by hand."],
    body: "Cold-process soaps with shea, papaya, neem and tulasi — gentle enough for every day, with nothing you'd rather not have on your skin.",
    cta: { label: "Shop skin care", href: "/shop?category=skin-care" },
  },
  {
    src: "hair-care-herbal-shampoo-amla-reetha",
    focus: { desktop: "center" },
    alt: "Herbal shampoo with amla and reetha",
    eyebrow: "Hair care",
    title: ["A stronger ritual", "starts at the roots."],
    body: "Amla, reetha, shikakai and hibiscus in a shampoo that cleans without stripping — for hair-fall control and a calmer scalp.",
    cta: { label: "Shop hair care", href: "/shop?category=hair-care" },
  },
  {
    src: "home-care-category-dishwash-floor-cleaner-pitambari",
    focus: { desktop: "center" },
    alt: "Natural dishwash liquid, floor cleaner and utensil shine",
    eyebrow: "Home care",
    title: ["A naturally", "cleaner home."],
    body: "Lemon dishwash, lemongrass floor cleaner and pitambari utensil shine — tough on grease, safe for hands, drains and little ones.",
    cta: { label: "Shop home care", href: "/shop?category=home-care" },
  },
  {
    src: "ingredients-botanicals-butters-natural-cleansers",
    focus: { desktop: "center" },
    alt: "Botanicals, butters and natural cleansers used in the range",
    eyebrow: "Ingredients",
    title: ["What we use,", "and why."],
    body: "Every formulation starts with the ingredient list — plant butters, herbs, essential oils and food-grade cleansers you can read and recognise.",
    cta: { label: "See our ingredients", href: "/ingredients" },
  },
  {
    src: "natural-dishwash-liquid-lemon-product-hero",
    alt: "Natural dishwash liquid with fresh lemons",
    eyebrow: "Home care · Most loved",
    title: ["Lemon-fresh dishes,", "gentle on hands."],
    body: "Our plant-based dishwash liquid lifts grease with lemon and food-grade cleansers — no SLS, no harsh chemicals, kind to hands and drains.",
    cta: { label: "See the dishwash liquid", href: "/product/natural-dishwash-liquid" },
    focus: { desktop: "center 35%" },
  },
];

const imgSrc = (s: Slide) => `/banners/${s.src}-v2-2048.webp`;
const srcSet = (s: Slide) => `/banners/${s.src}-v2-1280.webp 1280w, /banners/${s.src}-v2-2048.webp 2048w`;

const HOLD_MS = 3800; // time a slide sits before the next crossfade — short enough that a viewer never wonders if it's stuck
const FADE_MS = 1200; // crossfade duration — long enough to feel like a dissolve, not a cut
const DRIFT = ["sn-drift-a", "sn-drift-b", "sn-drift-c"]; // rotate so neighbours move differently

const trust = [
  { icon: LeafIcon, label: "Plant-forward ingredients" },
  { icon: BeakerIcon, label: "Research-led formulations" },
  { icon: RecycleIcon, label: "Made in small batches" },
];

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<number | null>(null);
  // Which slides have their <img> mounted. Starts with the first two; every
  // change of slide mounts the one after it so it is decoded before its turn.
  const [mounted, setMounted] = useState<Set<number>>(() => new Set([0, 1]));

  const go = useCallback((n: number) => setIndex((i) => (i + n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-advance; restarts whenever the slide changes so a manual click gets a
  // full hold. No "is the tab visible" check: browsers already throttle timers
  // in background tabs, and embedded previews report hidden even when shown.
  useEffect(() => {
    if (reduced || paused) return;
    timer.current = window.setTimeout(() => go(1), HOLD_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, paused, reduced, go]);

  useEffect(() => {
    const next = (index + 1) % SLIDES.length;
    setMounted((m) => (m.has(next) ? m : new Set(m).add(next)));
  }, [index]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-[#F1F3E6] text-forest"
      aria-roledescription="carousel"
      aria-label="Surakshitam Naturals highlights"
    >
      {/* ---- photo layer: one wrapper per slide, only the active one is opaque.
              Desktop: a single cover image. Below lg: a blurred cover behind a
              contain image, so the whole banner is visible above the copy. ---- */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => {
          const active = i === index;
          const drift = !reduced && DRIFT[i % DRIFT.length];
          const focus = {
            "--focus-d": s.focus?.desktop ?? "center right",
          } as React.CSSProperties;
          if (!mounted.has(i)) return <div key={s.src} aria-hidden="true" className="absolute inset-0" />;
          return (
            <div
              key={s.src}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-opacity ease-in-out",
                active ? "opacity-100" : "opacity-0",
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc(s)}
                srcSet={srcSet(s)}
                sizes="100vw"
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                style={focus}
                className={cn(
                  // desktop: cover with focal point; below lg: this is the blurred letterbox fill
                  "absolute inset-0 h-full w-full object-cover will-change-transform",
                  "scale-110 blur-2xl brightness-105 saturate-[0.85] lg:scale-100 lg:blur-0 lg:brightness-100 lg:saturate-100 lg:object-[var(--focus-d)]",
                  drift,
                )}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc(s)}
                srcSet={srcSet(s)}
                sizes="100vw"
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full object-contain object-top origin-top will-change-transform lg:hidden",
                  drift,
                )}
              />
            </div>
          );
        })}
      </div>

      {/* ---- readability scrims ----
          phones/tablets: copy is at the bottom, so fade upward and leave the top of the photo clear;
          desktop: copy is on the left, so fade rightward and leave the products clear. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-[56.25vw] bg-gradient-to-t from-[#F4F6EA] via-[#F4F6EA]/80 via-60% to-transparent lg:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-r from-[#F4F6EA]/95 via-[#F4F6EA]/55 to-transparent to-45% lg:block"
      />
      {/* bottom fade so the slide meets the next section cleanly */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-parchment"
      />

      {/* ---- physics over the photo, under the copy ---- */}
      <FallingBotanicals />
      <FallingFruitPhysics />

      {/* ---- copy ---- */}
      <div className="container relative flex min-h-[72svh] flex-col justify-end pb-20 pt-[calc(56.25vw+0.75rem)] sm:min-h-[76svh] lg:min-h-[80svh] lg:justify-center lg:py-20">
        <div key={index} className="max-w-xl animate-fade-up">
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1 className="mt-3 text-hero font-semibold text-forest lg:mt-4">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-forest/75 sm:text-base lg:mt-4">
            {slide.body}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 lg:mt-6">
            <LinkButton href={slide.cta.href} size="lg">
              {slide.cta.label} <ArrowRight width={18} />
            </LinkButton>
            <LinkButton href="/our-story" variant="outline" size="lg">
              Our Story
            </LinkButton>
          </div>
          <ul className="mt-5 hidden flex-wrap gap-x-6 gap-y-2 sm:flex lg:mt-6">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-forest/70">
                <Icon width={18} className="text-moss" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* ---- slide controls ---- */}
        <div
          className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-4 sm:bottom-6 sm:px-6 lg:px-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${s.eyebrow} slide`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-8 bg-forest" : "w-2 bg-forest/30 hover:bg-forest/60",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 bg-cream/80 text-forest backdrop-blur transition-colors hover:bg-forest hover:text-cream"
            >
              <ChevronDown width={16} className="rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15 bg-cream/80 text-forest backdrop-blur transition-colors hover:bg-forest hover:text-cream"
            >
              <ChevronDown width={16} className="-rotate-90" />
            </button>
          </div>
        </div>

        {/* scroll hint — sits centred on the bottom fade */}
        <Link
          href="#shop-by-category"
          aria-label="Scroll to categories"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium text-forest/60 transition-colors hover:text-forest sm:flex"
        >
          Explore
          <ChevronDown width={16} className="animate-bounce" />
        </Link>
      </div>
    </section>
  );
}
