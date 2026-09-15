import type { ReactNode } from "react";
import { BotanicalBackdrop } from "./BotanicalBackdrop";

/**
 * Page heading band. `backdrop={false}` when the page wraps itself in one
 * page-long <BotanicalBackdrop> (see /contact) — otherwise two physics
 * worlds would overlap in the heading.
 */
export function PageIntro({
  eyebrow,
  title,
  intro,
  children,
  backdrop = true,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  backdrop?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-parchment">
      {backdrop && <BotanicalBackdrop />}
      <div className="container relative py-12 sm:py-16">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-4 text-base leading-relaxed text-forest/70">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
