"use client";

import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { HeartIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Small overlay heart button that toggles a product's wishlist state — sibling to
 *  QuickViewButton, placed at the opposite corner so the two never collide. */
export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const saved = has(productId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className={cn(
        "absolute right-2 bottom-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 shadow-soft backdrop-blur transition-colors hover:bg-cream",
        saved ? "text-clay" : "text-forest/60",
        className,
      )}
    >
      <HeartIcon width={16} height={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
