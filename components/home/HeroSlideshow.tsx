"use client";

import Image from "next/image";
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
 * Motion: crossfade every HOLD_MS with a slow Ken-Burns drift on the active
 * slide; pauses on hover / when the tab is hidden; a single static frame when
 * the visitor asks for reduced motion.
 */

interface Slide {
  src: string;
  alt: string;
  eyebrow: string;
  title: [string, string];
  body: string;
  cta: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    src: "/banners/homepage-hero-home-skin-hair-complete-product-range-responsive.webp",
    alt: "Surakshitam Naturals home, skin and hair care range on a stone slab with neem, hibiscus and lemon",
    eyebrow: "Homemade · Plant-based · Hyderabad",
    title: ["Everyday care,", "thoughtfully formulated."],
    body: "Homemade, plant-based skin, hair and home care from Hyderabad — herbal soaps and natural cleaners made with natural essential oils, in small batches.",
    cta: { label: "Shop all products", href: "/shop" },
  },
  {
    src: "/banners/skin-care-handmade-botanical-soap-collection-responsive.webp",
    alt: "Handmade botanical soaps — papaya, shea butter, neem tulasi and triple butter",
    eyebrow: "Skin care",
    title: ["Botanical care,", "made by hand."],
    body: "Cold-process soaps with shea, papaya, neem and tulasi — gentle enough for every day, with nothing you'd rather not have on your skin.",
    cta: { label: "Shop skin care", href: "/shop?category=skin-care" },
  },
  {
    src: "/banners/hair-care-herbal-shampoo-amla-reetha-responsive.webp",
    alt: "Herbal shampoo with amla and reetha",
    eyebrow: "Hair care",
    title: ["A stronger ritual", "starts at the roots."],
    body: "Amla, reetha, shikakai and hibiscus in a shampoo that cleans without stripping — for hair-fall control and a calmer scalp.",
    cta: { label: "Shop hair care", href: "/shop?category=hair-care" },
  },
  {
    src: "/banners/home-care-category-dishwash-floor-cleaner-pitambari-responsive.webp",
    alt: "Natural dishwash liquid, floor cleaner and utensil shine",
    eyebrow: "Home care",
    title: ["A naturally", "cleaner home."],
    body: "Lemon dishwash, lemongrass floor cleaner and pitambari utensil shine — tough on grease, safe for hands, drains and little ones.",
    cta: { label: "Shop home care", href: "/shop?category=home-care" },
  },
  {
    src: "/banners/ingredients-botanicals-butters-natural-cleansers-responsive.webp",
    alt: "Botanicals, butters and natural cleansers used in the range",
    eyebrow: "Ingredients",
    title: ["What we use,", "and why."],
    body: "Every formulation starts with the ingredient list — plant butters, herbs, essential oils and food-grade cleansers you can read and recognise.",
    cta: { label: "See our ingredients", href: "/ingredients" },
  },
];

const HOLD_MS = 6500; // time a slide sits before the next crossfade
const FADE_MS = 1400; // crossfade duration — long enough to feel like a dissolve, not a cut

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

  const go = useCallback((n: number) => setIndex((i) => (i + n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-advance; restarts whenever the slide changes so a manual click gets a full hold.
  useEffect(() => {
    if (reduced || paused) return;
    const tick = () => {
      if (!document.hidden) go(1);
    };
    timer.current = window.setInterval(tick, HOLD_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [index, paused, reduced, go]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-[#F1F3E6] text-forest"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Surakshitam Naturals highlights"
    >
      {/* ---- photo layer: every slide is mounted; only the active one is opaque ---- */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => {
          const active = i === index;
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
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className={cn(
                  "object-cover object-[center_right] will-change-transform",
                  // Ken-Burns: a slow push-in while the slide is showing. The class is only on
                  // the active slide so the drift restarts from 1.0 on every change.
                  active && !reduced && "sn-kenburns",
                )}
              />
            </div>
          );
        })}
      </div>

      {/* ---- readability scrim: light on the left where the copy sits, clear on the right where the products are ---- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#F4F6EA]/95 via-[#F4F6EA]/70 to-transparent lg:via-[#F4F6EA]/55 lg:to-45%"
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
      <div className="container relative flex min-h-[78svh] flex-col justify-center py-16 sm:py-20 lg:min-h-[80svh]">
        <div key={index} className="max-w-xl animate-fade-up">
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1 className="mt-4 text-hero font-semibold text-forest">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-forest/75">{slide.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LinkButton href={slide.cta.href} size="lg">
              {slide.cta.label} <ArrowRight width={18} />
            </LinkButton>
            <LinkButton href="/our-story" variant="outline" size="lg">
              Our Story
            </LinkButton>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-forest/70">
                <Icon width={18} className="text-moss" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* ---- slide controls ---- */}
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-4 sm:px-6 lg:px-8">
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
