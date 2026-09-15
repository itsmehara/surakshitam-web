import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Surakshitam Naturals home care, skin care and hair care — natural, small-batch essentials for everyday homes. Order on WhatsApp.",
};

/**
 * v3-static: the export has exactly one `/shop/index.html`, so the
 * category / shelf / concern filters are read from the URL on the client
 * (`useSearchParams` inside `ShopView`) rather than from server `searchParams`.
 * Suspense is what Next requires around `useSearchParams` in a static build.
 */
export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-sm text-forest/55">Loading products…</div>}>
      <ShopView />
    </Suspense>
  );
}
