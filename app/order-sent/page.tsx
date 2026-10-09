import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSent } from "@/components/checkout/OrderSent";

export const metadata: Metadata = {
  alternates: { canonical: "/order-sent/" },
  title: "Order sent",
  description: "Your order is on its way to Surakshitam Naturals on WhatsApp.",
  robots: { index: false },
};

export default function OrderSentPage() {
  return (
    // OrderSent reads ?id= with useSearchParams → Suspense for the static export
    <Suspense fallback={<div className="container py-16" />}>
      <OrderSent />
    </Suspense>
  );
}
