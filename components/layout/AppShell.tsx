"use client";

import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/ui/FloatingContact";

/**
 * Storefront chrome around every page. v3-static has no admin area, cart
 * drawer or quick-view modal — just header, content, footer and the floating
 * WhatsApp/Instagram buttons. The Header reads `useSearchParams` (active shop
 * category), which is why it sits inside a Suspense boundary for the export.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-[6.25rem] bg-cream lg:h-[6.75rem]" />}>
        <Header />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
      <FloatingContact />
    </>
  );
}
