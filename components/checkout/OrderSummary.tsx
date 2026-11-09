"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/cart/CartContext";
import { lineKey } from "@/lib/cart/CartContext";
import { productImage } from "@/lib/catalog";
import { FREE_DELIVERY_OVER, formatWeight, type CourierBreakdown, type Delivery } from "@/lib/delivery";
import { rupees, type OrderCharges } from "@/lib/order";

/** The courier sum in words: "₹120 for the first 2 kg, plus ₹100 for 2 more kg at ₹50 a kg". */
function courierSum(b: CourierBreakdown): string {
  if (b.extraKg === 0) return `${rupees(b.base)} for up to 2 kg`;
  return `${rupees(b.base)} for the first 2 kg, plus ${rupees(b.extra)} for ${b.extraKg} more kg at ${rupees(b.perKg)} a kg`;
}

/** The Delivery figure, with the calculation under it so the customer can see how it is reached. */
function DeliveryFigure({ delivery }: { delivery: Delivery }) {
  switch (delivery.status) {
    case "free":
      return (
        <>
          <span className="block font-medium">Free</span>
          <span className="block text-xs text-forest/50">
            Special delivery discount, orders over {rupees(FREE_DELIVERY_OVER)}
          </span>
          {delivery.stateToSee && (
            <span className="block text-xs text-moss">Enter your pincode or State to see the courier charge this waives.</span>
          )}
        </>
      );
    case "rapido":
      return (
        <>
          <span className="block font-medium">Rapido</span>
          <span className="block text-xs text-forest/50">Fare paid to the rider, not in the total</span>
        </>
      );
    case "courier":
      return (
        <>
          <span className="block font-medium">{rupees(delivery.charge)}</span>
          <span className="block text-xs text-forest/50">Courier, {formatWeight(delivery.weightG)}</span>
          <span className="block text-xs text-forest/50">{courierSum(delivery.breakdown)}</span>
        </>
      );
    case "pick-state":
      return <span className="text-xs text-forest/50">Pick your state for the charge</span>;
    default:
      return <span className="text-xs text-forest/50">Confirmed on WhatsApp</span>;
  }
}

/** Read-only order lines, then subtotal, delivery and total, at the top of the checkout page. */
export function OrderSummary({ lines, charges }: { lines: CartLine[]; charges: OrderCharges }) {
  const { subtotal, hasPriceOnRequest, delivery, total } = charges;
  // Free delivery is for a subtotal above FREE_DELIVERY_OVER, so this is what the cart still needs.
  const moreForFree = FREE_DELIVERY_OVER + 1 - subtotal;
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
      <div className="flex items-baseline justify-between gap-3 border-t border-forest/10 px-4 py-2.5">
        <span className="text-sm text-forest/70">Subtotal</span>
        <span className="text-sm font-medium tabular-nums text-forest">
          {rupees(subtotal)}
          {hasPriceOnRequest && <span className="ml-1 text-xs font-normal text-forest/50">+ on request</span>}
        </span>
      </div>
      {delivery.status === "free" && delivery.waived ? (
        <>
          <div className="flex items-start justify-between gap-3 border-t border-forest/10 px-4 py-2.5">
            <span className="text-sm text-forest/70">Delivery</span>
            <span className="space-y-0.5 text-right text-sm tabular-nums text-forest">
              <s className="block text-forest/45">{rupees(delivery.waived.breakdown.total)}</s>
              <span className="block text-xs text-forest/50">Courier, {formatWeight(delivery.waived.weightG)}</span>
              <span className="block text-xs text-forest/50">{courierSum(delivery.waived.breakdown)}</span>
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-forest/10 px-4 py-2.5">
            <span className="text-sm text-moss">
              Special delivery discount <span className="text-xs text-forest/50">(orders over {rupees(FREE_DELIVERY_OVER)})</span>
            </span>
            <span className="text-sm font-medium tabular-nums text-moss">−{rupees(delivery.waived.breakdown.total)}</span>
          </div>
        </>
      ) : (
        <div className="flex items-start justify-between gap-3 border-t border-forest/10 px-4 py-2.5">
          <span className="text-sm text-forest/70">Delivery</span>
          <span className="space-y-0.5 text-right text-sm tabular-nums text-forest">
            <DeliveryFigure delivery={delivery} />
          </span>
        </div>
      )}
      {delivery.status !== "free" && delivery.status !== "rapido" && moreForFree > 0 && (
        <p className="border-t border-forest/8 px-4 py-2 text-xs text-moss">Add {rupees(moreForFree)} more for the special delivery discount.</p>
      )}
      <div className="flex items-baseline justify-between border-t border-forest/10 px-4 py-3">
        <span className="text-sm text-forest/70">Total</span>
        <span className="font-serif text-xl font-semibold tabular-nums text-forest">
          {total == null ? (
            <>
              {rupees(subtotal)}
              <span className="ml-1 text-xs font-normal text-forest/50">+ delivery</span>
            </>
          ) : (
            rupees(total)
          )}
          {delivery.status === "rapido" && <span className="ml-1 text-xs font-normal text-forest/50">+ Rapido fare</span>}
          {hasPriceOnRequest && <span className="ml-1 text-xs font-normal text-forest/50">+ on request</span>}
        </span>
      </div>
      <p className="border-t border-forest/8 px-4 py-2 text-[0.7rem] leading-snug text-forest/50">
        MRP, inclusive of all taxes. Special delivery discount on courier orders over {rupees(FREE_DELIVERY_OVER)}. Courier is charged by weight
        and state, and part of a kg counts as a full kg. We confirm your order on WhatsApp before you pay.
      </p>
    </section>
  );
}
