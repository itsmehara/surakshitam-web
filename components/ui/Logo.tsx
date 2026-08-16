import Image from "next/image";
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
      <Image
        src="/brand/logo.png"
        alt="Surakshitam Naturals"
        width={48}
        height={48}
        priority
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
