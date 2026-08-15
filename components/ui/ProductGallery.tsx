"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "@/components/icons";
import { cn } from "@/lib/cn";

type View = { src: string; zoom: number };

/**
 * Amazon-style product gallery: a main image with prev/next controls and a
 * thumbnail strip. When a product only has one image, a zoomed second view is
 * shown so the carousel is fully functional now — drop real images into
 * `product.images` later and they replace the placeholder views automatically.
 */
export function ProductGallery({
  images,
  name,
  discountLabel,
}: {
  images: string[];
  name: string;
  discountLabel?: string;
}) {
  const views: View[] =
    images.length > 1
      ? images.map((src) => ({ src, zoom: 1 }))
      : [
          { src: images[0], zoom: 1 },
          { src: images[0], zoom: 1.6 }, // placeholder "close-up" view
        ];

  const [index, setIndex] = useState(0);
  const active = views[index];
  const go = (delta: number) => setIndex((p) => (p + delta + views.length) % views.length);

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      {/* Main image */}
      <div className="group relative aspect-square overflow-hidden rounded-lg border border-forest/8 bg-cream">
        {discountLabel && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-cream">
            {discountLabel}
          </span>
        )}

        <Image
          key={index}
          src={active.src}
          alt={`${name} — view ${index + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover transition-transform duration-500 ease-smooth"
          style={{ transform: `scale(${active.zoom})` }}
        />

        {views.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-forest/10 bg-cream/90 text-forest shadow-soft backdrop-blur transition-colors hover:bg-cream"
            >
              <ArrowRight width={18} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-forest/10 bg-cream/90 text-forest shadow-soft backdrop-blur transition-colors hover:bg-cream"
            >
              <ArrowRight width={18} />
            </button>

            {/* dots */}
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {views.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-4 bg-forest" : "w-1.5 bg-forest/30",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {views.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {views.map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-cream transition-colors",
                i === index ? "border-forest" : "border-transparent hover:border-forest/30",
              )}
            >
              <Image
                src={v.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                style={{ transform: `scale(${v.zoom > 1 ? 1.25 : 1})` }}
              />
              {v.zoom > 1 && (
                <span className="absolute inset-x-0 bottom-0 bg-forest/70 py-0.5 text-center text-[0.55rem] font-semibold uppercase tracking-wide text-cream">
                  Close-up
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
