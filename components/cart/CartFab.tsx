"use client";

import { useCart } from "@/lib/cart/CartContext";
import { CartIcon } from "@/components/icons";

/**
 * Floating cart button, first item in the bottom-right `FloatingContact`
 * stack. Rendered only once something is in the cart — before that the
 * "Add to cart" buttons carry the concept on their own.
 */
export function CartFab() {
  const { count, ready, openDrawer } = useCart();
  if (!ready || count === 0) return null;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="group relative flex items-center overflow-hidden rounded-full bg-forest text-cream shadow-card transition-transform duration-200 hover:scale-[1.03]"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-smooth group-hover:max-w-[8rem] group-hover:pl-4 group-hover:opacity-100">
        Cart
      </span>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center">
        <CartIcon width={24} height={24} />
      </span>
      <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1.5 text-[0.7rem] font-semibold text-cream">
        {count}
      </span>
    </button>
  );
}
