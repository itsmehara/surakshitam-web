import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Your delivery details — then the order goes to Surakshitam Naturals on WhatsApp.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
