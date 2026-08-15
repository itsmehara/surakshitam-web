import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Background treatment. */
  tone?: "cream" | "parchment" | "forest";
};

const tones = {
  cream: "bg-cream",
  parchment: "bg-parchment",
  forest: "bg-forest text-cream",
};

export function Section({ children, className, id, tone = "cream" }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      <div className="container">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
};

export function SectionHeader({ eyebrow, title, intro, align = "left", className, invert }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", invert && "text-sage")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "mt-3 text-3xl sm:text-4xl font-semibold tracking-tight",
          invert && "text-cream",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-base leading-relaxed text-forest/70", invert && "text-cream/70")}>
          {intro}
        </p>
      )}
    </div>
  );
}
