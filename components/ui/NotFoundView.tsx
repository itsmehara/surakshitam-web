"use client";

import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";
import { Logo } from "@/components/ui/Logo";

/**
 * Friendly "no such page" screen. Used by the global 404 (app/not-found.tsx)
 * and by any route a signed-in customer isn't allowed to see — so restricted
 * areas simply look non-existent rather than revealing they exist.
 */
export function NotFoundView({ path }: { path?: string }) {
  const pathname = usePathname();
  const shown = path ?? pathname ?? "";

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Logo />
      <p className="mt-8 font-serif text-6xl font-semibold text-moss">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-forest sm:text-3xl">
        No such page
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-forest/70">
        We couldn&apos;t find{" "}
        {shown && <span className="font-medium text-forest">{shown}</span>}
        {shown ? " — it" : "This page"} doesn&apos;t exist or isn&apos;t available.
      </p>
      <div className="mt-8">
        <LinkButton href="/">
          Back to home <ArrowRight width={16} />
        </LinkButton>
      </div>
    </div>
  );
}
