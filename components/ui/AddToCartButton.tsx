"use client";

import { useCartItem } from "@/lib/cart/CartContext";
import { CheckIcon, CartIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * "Add to cart" — the one control on every product (card + PDP), for the
 * pack size currently selected in <BuyBox>.
 *
 * UX: the Add pill turns into a − qty + stepper *in the same spot* once that
 * pack is in the cart (the quick-commerce pattern everyone already knows), so
 * quantity is set where the product is and the drawer is only the review
 * step. Decreasing to 0 removes the line. `card` is compact; `page` is the
 * larger PDP control with a "view cart" affordance beside the stepper.
 */
export function AddToCartButton({
  productId,
  sizeId,
  name,
  variant = "card",
  className,
}: {
  productId: string;
  sizeId: string;
  name: string;
  variant?: "card" | "page";
  className?: string;
}) {
  const { inCart, qty, add, setQty, openDrawer } = useCartItem(productId, sizeId);
  const page = variant === "page";

  if (!inCart) {
    return (
      <button
        type="button"
        onClick={() => add(1)}
        aria-label={`Add ${name} to cart`}
        className={cn(
          "relative z-10 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-forest font-medium text-cream transition-colors hover:bg-ink",
          page ? "h-12 gap-2 text-sm font-semibold shadow-soft" : "h-9 text-xs",
          className,
        )}
      >
        <CartIcon width={page ? 18 : 14} height={page ? 18 : 14} />
        Add to cart
      </button>
    );
  }

  const btn = cn(
    "flex shrink-0 items-center justify-center rounded-full font-semibold leading-none text-forest transition-colors hover:bg-forest/10 active:bg-forest/15",
    page ? "h-9 w-9 text-lg" : "h-7 w-7 text-base",
  );

  return (
    <div
      className={cn(
        "relative z-10 flex w-full items-center rounded-full border border-moss/40 bg-moss/10",
        page ? "h-12 px-1.5" : "h-9 px-1",
        className,
      )}
      role="group"
      aria-label={`${name} quantity in cart`}
    >
      <button type="button" onClick={() => setQty(qty - 1)} aria-label={qty === 1 ? `Remove ${name}` : `Decrease quantity of ${name}`} className={btn}>
        −
      </button>
      <span className={cn("flex-1 text-center tabular-nums", page ? "text-sm font-semibold" : "text-xs font-semibold")}>
        {qty}
        <span className="ml-1 font-normal text-moss">in cart</span>
      </span>
      <button type="button" onClick={() => setQty(qty + 1)} aria-label={`Increase quantity of ${name}`} className={btn}>
        +
      </button>
      {page && (
        <button
          type="button"
          onClick={openDrawer}
          className="ml-1 flex h-9 items-center gap-1 rounded-full bg-moss px-3 text-xs font-semibold text-cream transition-colors hover:bg-forest"
        >
          <CheckIcon width={14} /> View cart
        </button>
      )}
    </div>
  );
}
