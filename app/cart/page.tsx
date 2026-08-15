import type { Metadata } from "next";
import { CartIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your Surakshitam Naturals cart.",
};

export default function CartPage() {
  // Cart state, checkout and payment arrive in the next build phase.
  return (
    <div className="container flex min-h-[56vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-parchment text-forest/60">
        <CartIcon width={28} />
      </div>
      <h1 className="mt-6 font-serif text-3xl font-semibold text-forest">Your cart is empty</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-forest/70">
        Add a few essentials to get started. The full cart, checkout and secure payment flow are
        coming in the next build phase.
      </p>
      <div className="mt-8">
        <LinkButton href="/shop" size="lg">
          Start shopping
        </LinkButton>
      </div>
    </div>
  );
}
