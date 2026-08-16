"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import type { Reel } from "@/lib/instagram";
import { InstagramIcon, ArrowRight, CloseIcon } from "@/components/icons";

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.92)" />
      <path d="M10 8.3l6.2 3.7-6.2 3.7z" fill="#bc1888" />
    </svg>
  );
}

function ReelCard({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${reel.caption} — watch reel on Instagram`}
      className="group relative w-40 shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1 sm:w-44"
    >
      {/* thick multicolour gradient frame */}
      <span className="block overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-fuchsia-400 via-rose-400 to-amber-300 p-[6px] shadow-card">
        <span className="block rounded-[1.05rem] bg-white p-2">
          <span className="relative block aspect-[9/16] overflow-hidden rounded-[0.7rem] bg-cream">
            <Image
              src={reel.image}
              alt={reel.caption}
              fill
              sizes="(max-width: 640px) 40vw, 180px"
              className="scale-[1.12] object-cover object-[50%_50%] transition-transform duration-500 ease-smooth group-hover:scale-[1.2]"
            />
            <span className="absolute right-2 top-2 drop-shadow">
              <PlayIcon />
            </span>
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

export function InstagramFeed({ reels }: { reels: Reel[] }) {
  const [active, setActive] = useState<string | null>(null);

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

  return (
    <section className="overflow-hidden bg-gradient-to-b from-cream to-[#FBF1F4] py-16 sm:py-20">
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

      {/* Continuous marquee (pauses on hover; scrollable when motion is reduced) */}
      <div className="group relative mt-10 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-marquee gap-6 px-6 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...reels, ...reels].map((reel, i) => (
            <ReelCard key={`${reel.url}-${i}`} reel={reel} onOpen={() => setActive(reel.url)} />
          ))}
        </div>
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
