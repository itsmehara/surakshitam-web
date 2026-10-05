"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    nscCreditBadge?: { mount: (el: HTMLElement | null) => void };
  }
}

/**
 * Nischaya Creative Soft credit badge (lotus circle, popup on hover/tap).
 * The script self-mounts every `[data-nsc-credit]` slot; the effect covers a
 * footer that mounts after the script has already run. Mounting is idempotent.
 */
export function CreditBadge() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => window.nscCreditBadge?.mount(ref.current), []);
  return (
    <>
      <div ref={ref} data-nsc-credit className="flex h-8 w-8 items-center justify-center" />
      <Script src="/nsc-credit-badge.js" strategy="afterInteractive" />
    </>
  );
}
