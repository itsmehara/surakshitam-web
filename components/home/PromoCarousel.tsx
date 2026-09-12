"use client";

import { useEffect, useRef, useState } from "react";
import { getHomePromotions, type PromoSlide } from "@/lib/promotions";
import { isOffersNavEnabled } from "@/lib/site-settings";
import { PromoTile } from "@/components/ui/PromoTile";
import { cn } from "@/lib/cn";
import { ChevronDown, PauseIcon, PlayIconSolid } from "@/components/icons";

const HOLD_MS = 4000; // pause between moves
const MOVE_MS = 1800; // how long the slide itself takes to glide across

/**
 * Responsive count of cards shown at once: 1 on phones, 2 on small tablets, 3 on desktop,
 * 4 on wide screens. Recomputed on resize.
 */
function useVisibleCount(): number {
  const [n, setN] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 560) setN(1);
      else if (w < 900) setN(2);
      else if (w < 1280) setN(3);
      else setN(4);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return n;
}

export function PromoCarousel() {
  const [slides, setSlides] = useState<PromoSlide[] | null>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const visibleCount = useVisibleCount();
  const count = slides?.length ?? 0;

  // `index` is a position on a track that contains 3 back-to-back copies of the slide list
  // (see `tripled` below), starting in the middle copy. That gives room to glide one card
  // past either edge before we need to snap back — the snap happens with the CSS transition
  // switched off for one frame, so it's invisible, and both forward and backward stepping
  // stay smooth.
  const [index, setIndex] = useState(count);
  const [transitionOn, setTransitionOn] = useState(true);

  useEffect(() => {
    // Respect the same "Offers" on/off toggle as the header nav link and the floating button —
    // when the admin has switched it off, this section shouldn't show anything either.
    const promos = isOffersNavEnabled() ? getHomePromotions() : [];
    setSlides(promos);
    setIndex(promos.length);
  }, []);

  // Only auto-advance while the carousel is actually on screen — no point animating
  // (or spending the timer) once the user has scrolled past it.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const canSlide = count > visibleCount;

  // One glide + hold cycle: move one card, then sit still for HOLD_MS before the next move.
  useEffect(() => {
    if (!canSlide || paused || !inView) return;
    const id = setInterval(() => setIndex((i) => i + 1), HOLD_MS + MOVE_MS);
    return () => clearInterval(id);
  }, [canSlide, paused, inView]);

  // Once the track has glided past a full copy of the list, snap back to the equivalent
  // position in the middle copy without animating — invisible to the eye since it's the
  // same visual content.
  useEffect(() => {
    if (!canSlide) return;
    if (index >= count * 2 || index < count) {
      const t = setTimeout(() => {
        setTransitionOn(false);
        setIndex((i) => (i >= count * 2 ? i - count : i + count));
      }, MOVE_MS);
      return () => clearTimeout(t);
    }
  }, [index, count, canSlide]);

  useEffect(() => {
    if (transitionOn) return;
    const raf = requestAnimationFrame(() => setTransitionOn(true));
    return () => cancelAnimationFrame(raf);
  }, [transitionOn]);

  if (!slides || slides.length === 0) return null;

  const tripled = [...slides, ...slides, ...slides];
  // Percentage shift is relative to the *track's* own width (CSS translateX % semantics), so
  // one card-width is 100 / tripled.length of the track, not of the visible viewport.
  const cardPercentOfTrack = 100 / tripled.length;

  function step(dir: 1 | -1) {
    setIndex((i) => i + dir);
  }

  function goTo(i: number) {
    setIndex(count + i);
  }

  const activeDot = ((index % count) + count) % count;

  return (
    <section
      ref={sectionRef}
      className="max-h-[24vh] min-h-[10rem] overflow-hidden border-b border-forest/8 bg-cream py-3 sm:py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container relative flex h-full flex-col justify-center">
        <div className="relative flex items-stretch gap-2 sm:gap-3">
          {canSlide && (
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous offer"
              className="hidden h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-forest/15 bg-white/80 text-forest transition-colors hover:bg-white sm:flex"
            >
              <ChevronDown width={16} className="rotate-90" />
            </button>
          )}

          <div className="flex-1 overflow-hidden">
            <div
              className="flex"
              style={{
                width: `${(tripled.length / visibleCount) * 100}%`,
                transform: `translateX(-${index * cardPercentOfTrack}%)`,
                transition: transitionOn ? `transform ${MOVE_MS}ms cubic-bezier(0.65,0,0.35,1)` : "none",
              }}
            >
              {tripled.map((slide, i) => (
                <div
                  key={`${slide.id}-${i}`}
                  className="shrink-0 px-1 sm:px-1.5"
                  style={{ width: `${100 / tripled.length}%` }}
                >
                  <PromoTile slide={slide} heightClass="h-44 sm:h-36" />
                </div>
              ))}
            </div>
          </div>

          {canSlide && (
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next offer"
              className="hidden h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-forest/15 bg-white/80 text-forest transition-colors hover:bg-white sm:flex"
            >
              <ChevronDown width={16} className="-rotate-90" />
            </button>
          )}
        </div>

        {canSlide && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Resume auto-scroll" : "Pause auto-scroll"}
              className="flex h-5 w-5 items-center justify-center rounded-full text-clay/70 hover:text-clay"
            >
              {paused ? <PlayIconSolid width={12} height={12} /> : <PauseIcon width={12} height={12} />}
            </button>
            <div className="flex gap-1.5 overflow-x-auto">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show offer ${i + 1}`}
                  aria-current={i === activeDot}
                  className={cn(
                    "h-1.5 shrink-0 rounded-full transition-all",
                    i === activeDot ? "w-5 bg-clay" : "w-1.5 bg-clay/25",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
