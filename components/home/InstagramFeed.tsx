"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import type { Reel } from "@/lib/instagram";
import { InstagramIcon, ArrowRight, CloseIcon, ChevronDown } from "@/components/icons";

/** Reel-style play badge: sits in the middle of the card, translucent so the photo still reads through it. */
function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/55 shadow-[0_2px_12px_rgba(0,0,0,0.25)] ring-1 ring-white/60 backdrop-blur-[2px] transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/75 sm:h-14 sm:w-14">
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" className="ml-1">
          <path d="M8 5.5l11 6.5-11 6.5z" fill="#bc1888" />
        </svg>
      </span>
    </span>
  );
}

/** Brand watermark on every reel — small emblem + handle, the way a creator's handle sits on a reel. */
function Watermark() {
  return (
    <span className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full bg-black/25 py-0.5 pl-0.5 pr-1 backdrop-blur-[2px] sm:pr-1.5">
      <Image
        src="/brand/logo.png"
        alt=""
        width={18}
        height={18}
        className="h-4 w-4 shrink-0 rounded-full bg-white object-contain sm:h-[18px] sm:w-[18px]"
      />
      {/* 21 chars must fit a 132px card on phones — small and tight, with an ellipsis as the last resort */}
      <span className="truncate text-[0.48rem] font-semibold text-white/90 drop-shadow sm:text-[0.56rem]">
        @{site.instagramHandle}
      </span>
    </span>
  );
}

/** Faint like / comment / share rail on the right edge — the visual shorthand for "this is a reel". */
function ActionRail() {
  const icon = "h-4 w-4 text-white/85 drop-shadow";
  return (
    <span className="pointer-events-none absolute bottom-12 right-1.5 flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={icon}>
        <path d="M12 20s-7-4.4-9.2-8.2A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 9.2 5.8C19 15.6 12 20 12 20z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" className={icon}>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.2-4.4A8 8 0 1 1 21 12z" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" className={icon}>
        <path d="M21 3L10 14M21 3l-7 18-4-7-7-4z" />
      </svg>
    </span>
  );
}

function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  return (
    <button
      type="button"
      data-reel-card
      onClick={onOpen}
      aria-label={`${reel.caption} — watch reel on Instagram`}
      className="group relative w-40 shrink-0 transition-transform duration-300 hover:-translate-y-1 sm:w-44"
    >
      {/* thick multicolour gradient frame */}
      <span className="block overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-fuchsia-400 via-rose-400 to-amber-300 p-[6px] shadow-card">
        <span className="block rounded-[1.05rem] bg-white p-2">
          <span className="relative block aspect-[9/16] overflow-hidden rounded-[0.7rem] bg-cream">
            {/* The reel stills carry a letterboxed photo inside a blurred 9:16 frame; zooming
                in fills the card with the photo itself so it reads like a real reel thumbnail. */}
            <Image
              src={reel.image}
              alt={reel.caption}
              fill
              sizes="(max-width: 640px) 40vw, 180px"
              className="scale-[1.32] object-cover object-[50%_50%] transition-transform duration-500 ease-smooth group-hover:scale-[1.4]"
            />
            <Watermark />
            <PlayBadge />
            <ActionRail />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-fuchsia-900/70 to-transparent p-2.5 pt-8">
              <span className="line-clamp-2 text-[0.72rem] font-medium text-white">
                {reel.caption}
              </span>
            </span>
          </span>
        </span>
      </span>

      {/* heart accent */}
      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-500 shadow">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 20s-7-4.4-9.2-8.2A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 9.2 5.8C19 15.6 12 20 12 20z" />
        </svg>
      </span>
    </button>
  );
}

const HOLD_MS = 3000; // wait between moves — kept at/under 4s per feedback
const MOVE_MS = 1400; // glide duration — a real slide, not an instant jump
const GAP_PX = 24; // matches gap-6 below

export function InstagramFeed({ reels }: { reels: Reel[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [cardStep, setCardStep] = useState(184); // re-measured on mount/resize
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(reels.length);
  const [transitionOn, setTransitionOn] = useState(true);
  // bumped on every manual arrow press so the auto-advance timer restarts from that moment
  const [manualNudge, setManualNudge] = useState(0);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  // Card width (incl. its Tailwind breakpoint) can only be known from the rendered DOM.
  useEffect(() => {
    const measure = () => {
      const card = trackRef.current?.querySelector<HTMLElement>("[data-reel-card]");
      if (card) setCardStep(card.offsetWidth + GAP_PX);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reels.length]);

  // Only auto-advance while the strip is actually on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const canSlide = reels.length > 1;

  // Glide one reel left, then hold — same cadence/mechanism as the homepage promo carousel.
  useEffect(() => {
    if (!canSlide || paused || !inView) return;
    const id = setInterval(() => setIndex((i) => i + 1), HOLD_MS + MOVE_MS);
    return () => clearInterval(id);
  }, [canSlide, paused, inView, manualNudge]);

  // Arrow buttons: step one reel either way. The wrap-around effect below already
  // handles both directions, so going left from the first copy is safe.
  const go = (dir: 1 | -1) => {
    // clamp to the tripled track so a burst of clicks can't outrun the wrap and show empty space
    setIndex((i) => Math.max(0, Math.min(reels.length * 3 - 1, i + dir)));
    setManualNudge((n) => n + 1);
  };

  // Wrap around a 3x-duplicated track without a visible jump (transition off for one frame).
  useEffect(() => {
    if (!canSlide) return;
    const count = reels.length;
    if (index >= count * 2 || index < count) {
      const t = setTimeout(() => {
        setTransitionOn(false);
        setIndex((i) => (i >= count * 2 ? i - count : i + count));
      }, MOVE_MS);
      return () => clearTimeout(t);
    }
  }, [index, reels.length, canSlide]);

  useEffect(() => {
    if (transitionOn) return;
    const raf = requestAnimationFrame(() => setTransitionOn(true));
    return () => cancelAnimationFrame(raf);
  }, [transitionOn]);

  const tripled = [...reels, ...reels, ...reels];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-gradient-to-b from-cream to-[#FBF1F4] py-16 sm:py-20"
    >
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow inline-flex items-center gap-2 text-rose-500">
              <InstagramIcon width={16} /> Instagram
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Follow @{site.instagramHandle}
            </h2>
            <p className="mt-3 text-sm text-forest/60">
              Peeks behind our small-batch process, care tips and new launches. Tap a reel to watch.
            </p>
          </div>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.03]"
            style={{ background: "linear-gradient(45deg,#f09433 0%,#dc2743 50%,#bc1888 100%)" }}
          >
            <InstagramIcon width={18} /> Follow
          </a>
        </div>
      </div>

      {/* Glides one reel left, holds ~3s, glides again — pauses on hover/off-screen.
          Arrow buttons on either edge let the visitor step through by hand. */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative mt-10"
      >
        <div className="overflow-hidden px-6">
          <div
            ref={trackRef}
            className="flex gap-6"
            style={{
              transform: `translateX(-${index * cardStep}px)`,
              transition: transitionOn ? `transform ${MOVE_MS}ms cubic-bezier(0.65,0,0.35,1)` : "none",
            }}
          >
            {tripled.map((reel, i) => (
              <ReelCard key={`${reel.url}-${i}`} reel={reel} onOpen={() => setActive(reel.url)} />
            ))}
          </div>
        </div>

        {canSlide && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous reels"
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-forest/15 bg-cream/90 text-forest shadow-card backdrop-blur transition-colors hover:bg-forest hover:text-cream sm:left-4"
            >
              <ChevronDown width={16} className="rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next reels"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-forest/15 bg-cream/90 text-forest shadow-card backdrop-blur transition-colors hover:bg-forest hover:text-cream sm:right-4"
            >
              <ChevronDown width={16} className="-rotate-90" />
            </button>
          </>
        )}
      </div>

      <div className="container mt-6">
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-sm"
        >
          See more on Instagram <ArrowRight width={16} />
        </a>
      </div>

      {/* Reel modal — loads the real Instagram embed */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Instagram reel"
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-card"
            >
              <CloseIcon width={18} />
            </button>
            <iframe
              src={`${active}embed`}
              title="Instagram reel"
              className="h-[78vh] max-h-[680px] w-[92vw] max-w-[400px] rounded-xl border-0 bg-white"
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </div>
      )}
    </section>
  );
}
