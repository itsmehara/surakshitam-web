"use client";

import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { EnquiryListDrawer } from "@/components/enquiry/EnquiryListDrawer";
import { SplashBillboard } from "@/components/ui/SplashBillboard";

/**
 * Storefront chrome around every page. v3-static has no admin area or cart —
 * header, content, footer, the floating Instagram/WhatsApp/enquiry-list stack
 * and the enquiry-list drawer, plus the billboard splash (once per 15 min). The Header
 * reads `useSearchParams` (active shop category), which is why it sits inside
 * a Suspense boundary for the export.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-cream lg:h-[4.5rem]" />}>
        <Header />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
      <FloatingContact />
      <EnquiryListDrawer />
      <SplashBillboard />
    </>
  );
}
