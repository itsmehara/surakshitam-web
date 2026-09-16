import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FallingBotanicals } from "./FallingBotanicals";
import { FallingFruitPhysics } from "./FallingFruitPhysics";
import { moveStyle } from "@/lib/hero-motion";

/**
 * v2 page intro with a fixed photo banner — the same look as the homepage
 * slideshow hero (photo fills the section, copy on the left over a light
 * scrim, leaves + falling-fruit physics over the picture, continuous drift so
 * the image is never frozen) but a single image and shorter, so the page
 * content peeks in beneath. Used on Ingredients and Learn; `PageIntro` (the
 * v1 botanical-wash version) remains for the pages without a banner.
 */
export function BannerIntro({
  src,
  alt,
  eyebrow,
  title,
  intro,
  children,
  move = 0,
}: {
  src: string;
  alt: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  /** Index into lib/hero-motion MOVES (0 = pan right→left). Loops slowly. */
  move?: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-forest/8 bg-[#F1F3E6]">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        style={{ ...moveStyle(move, 0.5), "--mv-dur": "16s" } as React.CSSProperties}
        className={cn("object-cover object-[center_right] will-change-transform", "sn-move-loop")}
      />
      {/* readability scrim, light on the left where the copy sits */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#F4F6EA]/95 via-[#F4F6EA]/70 to-transparent lg:via-[#F4F6EA]/65 lg:to-58%"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-cream"
      />

      <FallingBotanicals />
      <FallingFruitPhysics />

      <div className="container relative flex min-h-[52svh] flex-col justify-center py-14 sm:py-16 lg:min-h-[56svh]">
        <div className="max-w-2xl animate-fade-up">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-forest sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-4 max-w-xl text-base leading-relaxed text-forest/75">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
