"use client";

import { useEnquiryItem } from "@/lib/enquiry-list/EnquiryListContext";
import { CheckIcon, ClipboardIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * "Add to enquiry" — replaces the per-product WhatsApp button (v3, 15 Sep).
 * `card` is the compact full-width pill on ProductCard; `page` is the large
 * PDP control with a quantity stepper once the product is listed.
 * Clicking an already-listed product opens the drawer rather than adding a
 * duplicate line.
 */
export function AddToEnquiryButton({
  productId,
  name,
  variant = "card",
  className,
}: {
  productId: string;
  name: string;
  variant?: "card" | "page";
  className?: string;
}) {
  const { inList, qty, add, setQty, openDrawer } = useEnquiryItem(productId);

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={() => (inList ? openDrawer() : add(1))}
        aria-label={inList ? `${name} is in your enquiry list — open list` : `Add ${name} to enquiry list`}
        className={cn(
          "relative z-10 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-xs font-medium transition-colors",
          inList
            ? "bg-moss/15 text-moss hover:bg-moss/25"
            : "bg-forest text-cream hover:bg-ink",
          className,
        )}
      >
        {inList ? (
          <>
            <CheckIcon width={14} /> In enquiry list
          </>
        ) : (
          <>
            <ClipboardIcon width={14} /> Add to enquiry
          </>
        )}
      </button>
    );
  }

  if (!inList) {
    return (
      <button
        type="button"
        onClick={() => add(1)}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-cream shadow-soft transition-colors hover:bg-ink",
          className,
        )}
      >
        <ClipboardIcon width={18} height={18} /> Add to enquiry list
      </button>
    );
  }

  return (
    <div className={cn("flex h-12 items-stretch overflow-hidden rounded-full border border-moss/40 bg-moss/10", className)}>
      <div className="flex items-center gap-1 px-2 text-forest">
        <button
          type="button"
          onClick={() => setQty(qty - 1)}
          aria-label={`Decrease quantity of ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none hover:bg-forest/10"
        >
          −
        </button>
        <span className="min-w-7 text-center text-sm font-semibold tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={() => setQty(qty + 1)}
          aria-label={`Increase quantity of ${name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none hover:bg-forest/10"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={openDrawer}
        className="flex flex-1 items-center justify-center gap-1.5 border-l border-moss/30 px-4 text-sm font-semibold text-moss transition-colors hover:bg-moss/15"
      >
        <CheckIcon width={16} /> In list · view
      </button>
    </div>
  );
}
