import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <ComingSoon
      title="Your account"
      description="Login, orders, saved addresses and reorder are part of the customer account experience planned for the next build phase."
      note="Planned: login · orders · addresses · reorder"
    />
  );
}
