"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/cart/CartContext";
import { lineKey } from "@/lib/cart/CartContext";
import { productImage } from "@/lib/catalog";
import { orderSubtotal, rupees } from "@/lib/order";

/** Read-only order lines + subtotal, at the top of the checkout page. */
export function OrderSummary({ lines }: { lines: CartLine[] }) {
  const { subtotal, hasPriceOnRequest } = orderSubtotal(lines);
  return (
    <section aria-label="Order summary" className="rounded-lg border border-forest/10 bg-white/70">
      <ul className="divide-y divide-forest/8 px-4">
        {lines.map(({ product, size, qty }) => (
          <li key={lineKey(product.id, size.id)} className="flex items-center gap-3 py-2.5">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-forest/8 bg-cream">
              <Image
                src={productImage(product)}
                alt=""
                fill
                sizes="44px"
                className={product.thirdParty ? "object-contain p-0.5" : "object-cover"}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-serif text-[0.95rem] font-semibold leading-tight text-forest">
                {product.name}
              </span>
              <span className="block text-xs text-forest/55">
                {size.label} × {qty}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-forest">
              {size.mrp == null ? <span className="text-xs font-normal text-forest/50">on request</span> : rupees(size.mrp * qty)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between border-t border-forest/10 px-4 py-3">
        <span className="text-sm text-forest/70">Subtotal</span>
        <span className="font-serif text-xl font-semibold tabular-nums text-forest">
          {rupees(subtotal)}
          {hasPriceOnRequest && <span className="ml-1 text-xs font-normal text-forest/50">+ on request</span>}
        </span>
      </div>
      <p className="border-t border-forest/8 px-4 py-2 text-[0.7rem] leading-snug text-forest/50">
        MRP, inclusive of all taxes. Delivery charges, if any, are confirmed on WhatsApp before you pay.
      </p>
    </section>
  );
}
