import Link from "next/link";
import { cn } from "@/lib/cn";

/** Brand lockup: the real Surakshitam Naturals emblem + wordmark. */
export function Logo({
  className,
  invert,
  href = "/",
}: {
  className?: string;
  invert?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Surakshitam Naturals — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      {/* 96px + 192px (2x) WebP — the 512px source PNG was 252 KB on every page for a 44px mark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-96.webp"
        srcSet="/brand/logo-96.webp 1x, /brand/logo-192.webp 2x"
        alt="Surakshitam Naturals"
        width={48}
        height={48}
        fetchPriority="high"
        decoding="async"
        className="h-11 w-11 object-contain sm:h-12 sm:w-12"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-xl font-semibold tracking-tight sm:text-[1.6rem]",
            invert ? "text-cream" : "text-forest",
          )}
        >
          Surakshitam
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.64rem] font-semibold uppercase tracking-[0.34em] sm:text-[0.72rem]",
            invert ? "text-sage" : "text-moss",
          )}
        >
          Naturals
        </span>
      </span>
    </Link>
  );
}
