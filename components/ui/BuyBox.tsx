"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { defaultSize, formatMrp } from "@/lib/catalog";
import { AddToCartButton } from "./AddToCartButton";
import { cn } from "@/lib/cn";

/**
 * Pack picker + price + add-to-cart, for the card and the product page
 * (PRODUCT-CATALOG-NOTES-2026-09-19 §7.4). The bigger pack is pre-selected;
 * tapping a pill switches the price and which line the Add button talks to.
 * Single-size products show no pills — nothing to choose. Pills, never a
 * <select>: one tap fewer on a phone, and they wrap.
 */
export function BuyBox({ product, variant = "card" }: { product: Product; variant?: "card" | "page" }) {
  const [sizeId, setSizeId] = useState(() => defaultSize(product).id);
  const size = product.sizes.find((s) => s.id === sizeId) ?? defaultSize(product);
  const page = variant === "page";
  const multi = product.sizes.length > 1;

  return (
    <div className={cn("relative z-10", page ? "space-y-4" : "space-y-2")}>
      {multi && (
        <div className={cn("flex flex-wrap", page ? "gap-2" : "gap-1.5")} role="group" aria-label="Pack size">
          {product.sizes.map((s) => {
            const active = s.id === size.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSizeId(s.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border font-medium transition-colors",
                  page ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-[0.7rem]",
                  active
                    ? "border-forest bg-forest text-cream"
                    : "border-forest/15 text-forest/70 hover:border-forest/40",
                )}
              >
                {s.label}
                {page && s.mrp != null && <span className={cn("ml-1.5", active ? "text-cream/70" : "text-forest/45")}>₹{s.mrp}</span>}
              </button>
            );
          })}
        </div>
      )}

      {page ? (
        <div>
          <p className="font-serif text-2xl font-semibold text-forest">
            {formatMrp(size)}
            <span className="ml-2 text-sm font-normal text-forest/55">· {size.label}</span>
          </p>
          {size.mrp != null && (
            <p className="mt-1 text-xs text-forest/50">
              MRP inclusive of all taxes. Delivery charges, if any, confirmed on WhatsApp.
            </p>
          )}
        </div>
      ) : (
        <p className="flex items-baseline justify-between gap-2">
          <span className="text-[0.7rem] text-forest/50">{size.label}</span>
          <span className={cn("text-xs font-semibold tabular-nums", size.mrp == null ? "text-forest/50" : "text-forest")}>
            {formatMrp(size)}
          </span>
        </p>
      )}

      <AddToCartButton
        productId={product.id}
        sizeId={size.id}
        name={multi ? `${product.name} (${size.label})` : product.name}
        variant={variant}
        className={page ? "w-full" : undefined}
      />
    </div>
  );
}
