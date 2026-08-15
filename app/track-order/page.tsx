import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Track Order" };

export default function TrackOrderPage() {
  return (
    <ComingSoon
      title="Track your order"
      description="Order tracking connects to checkout and the order system, planned for the next build phase."
      note="Planned: track by order ID & phone"
    />
  );
}
