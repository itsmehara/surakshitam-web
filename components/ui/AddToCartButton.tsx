"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Prototype Add-to-Cart control. Demonstrates the "Add → − 1 +" stepper
 * microinteraction with local state only. Wire to a real cart store when
 * the cart/checkout flow is built (see docs/DATA_MODEL.md → Cart).
 */
export function AddToCartButton({
  productName,
  disabled,
  className,
}: {
  productName: string;
  disabled?: boolean;
  className?: string;
}) {
  const [qty, setQty] = useState(0);

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
        onClick={() => setQty(1)}
        aria-label={`Add ${productName} to cart`}
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
        onClick={() => setQty((q) => Math.max(0, q - 1))}
        aria-label={`Decrease ${productName} quantity`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-cream/15"
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty((q) => q + 1)}
        aria-label={`Increase ${productName} quantity`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-cream/15"
      >
        +
      </button>
    </div>
  );
}
