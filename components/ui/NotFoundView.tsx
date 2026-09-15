"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";
import { Logo } from "@/components/ui/Logo";

/**
 * Friendly "no such page" screen, used by the global 404 (app/not-found.tsx).
 *
 * The requested path is read from `window.location` *after* mount: GitHub
 * Pages serves one pre-rendered `404.html` for every missing URL, so the
 * server HTML cannot know the path — rendering it during hydration produced a
 * text mismatch (React #425) on every 404. First paint says "This page", then
 * the real path fills in.
 */
export function NotFoundView() {
  const [shown, setShown] = useState("");
  useEffect(() => setShown(window.location.pathname), []);

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
        {shown ? " — it" : "this page. It"} doesn&apos;t exist or isn&apos;t available.
      </p>
      <div className="mt-8">
        <LinkButton href="/">
          Back to home <ArrowRight width={16} />
        </LinkButton>
      </div>
    </div>
  );
}
