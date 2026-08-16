"use client";

import { useCart } from "@/lib/cart/CartContext";
import { cn } from "@/lib/cn";

/** Add-to-Cart control backed by the cart store. Turns into a −/qty/+ stepper. */
export function AddToCartButton({
  productId,
  name,
  disabled,
  className,
}: {
  productId: string;
  name: string;
  disabled?: boolean;
  className?: string;
}) {
  const { qtyOf, add, setQty } = useCart();
  const qty = qtyOf(productId);

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "w-full rounded-full border border-forest/15 px-4 py-2.5 text-sm font-medium text-forest/40",
          className,
        )}
      >
        Out of stock
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(productId, 1)}
        aria-label={`Add ${name} to cart`}
        className={cn(
          "w-full rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-cream transition-colors duration-200 hover:bg-ink",
          className,
        )}
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-full bg-forest px-1.5 py-1.5 text-cream",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setQty(productId, qty - 1)}
        aria-label={`Decrease ${name} quantity`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-cream/15"
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty(productId, qty + 1)}
        aria-label={`Increase ${name} quantity`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-cream/15"
      >
        +
      </button>
    </div>
  );
}
