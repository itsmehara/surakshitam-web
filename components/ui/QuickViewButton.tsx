"use client";

import { useCart } from "@/lib/cart/CartContext";

/** Small overlay button that opens the quick-view modal for a product. */
export function QuickViewButton({ productId }: { productId: string }) {
  const { openQuickView } = useCart();
  return (
    <button
      type="button"
      onClick={() => openQuickView(productId)}
      aria-label="Quick view"
      className="absolute right-2 top-2 z-20 rounded-full bg-cream/90 px-3 py-1.5 text-[0.7rem] font-medium text-forest opacity-0 shadow-soft backdrop-blur transition-opacity duration-200 hover:bg-cream focus-visible:opacity-100 group-hover:opacity-100"
    >
      Quick view
    </button>
  );
}
