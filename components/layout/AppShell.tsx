"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OfferBanner } from "@/components/layout/OfferBanner";
import { FloatingContact } from "@/components/ui/FloatingContact";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { getSession } from "@/lib/auth";
import { isAdmin, ADMIN_BASE } from "@/lib/admin";
import { logEvent, type AuditActor } from "@/lib/audit";

/** Logs a page_view for each navigation, attributed to the current actor. */
function useActivityTracker(pathname: string) {
  useEffect(() => {
    if (!pathname) return;
    let actor: AuditActor = { kind: "guest" };
    if (pathname.startsWith(ADMIN_BASE) && isAdmin()) {
      actor = { kind: "admin", name: "Admin" };
    } else {
      const s = getSession();
      if (s) actor = { kind: "customer", id: s.id, name: s.name };
    }
    logEvent({ type: "page_view", actor, path: pathname });
  }, [pathname]);
}

/**
 * Renders customer-facing storefront chrome. Admin routes get a clean shell
 * without any storefront navigation — the admin area supplies its own header.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useActivityTracker(pathname);
  const isAdminRoute = pathname?.startsWith(ADMIN_BASE);

  if (isAdminRoute) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <OfferBanner />
      <Suspense fallback={<div className="h-[6.25rem] bg-cream lg:h-[6.75rem]" />}>
        <Header />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
      <FloatingContact />
      <CartDrawer />
      <QuickViewModal />
    </>
  );
}
