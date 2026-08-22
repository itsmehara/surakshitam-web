"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders, type Order } from "@/lib/orders";
import { printShippingLabels } from "@/lib/print-label";
import { formatWeight } from "@/lib/weight";

interface PackingLine {
  productId: string;
  name: string;
  sku: string;
  image: string;
  size: string;
  qty: number;
  orderNumbers: string[];
}

/** Aggregates line items from CONFIRMED/PACKING orders into "prepare N × Product". */
function buildPackingList(orders: Order[]): PackingLine[] {
  const pending = orders.filter(
    (o) => o.fulfillmentStatus === "CONFIRMED" || o.fulfillmentStatus === "PACKING",
  );
  const map = new Map<string, PackingLine>();
  for (const o of pending) {
    for (const item of o.items) {
      const existing = map.get(item.productId);
      if (existing) {
        existing.qty += item.qty;
        if (!existing.orderNumbers.includes(o.orderNumber)) existing.orderNumbers.push(o.orderNumber);
      } else {
        map.set(item.productId, {
          productId: item.productId,
          name: item.nameSnapshot,
          sku: item.skuSnapshot,
          image: item.image,
          size: item.size,
          qty: item.qty,
          orderNumbers: [o.orderNumber],
        });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.qty - a.qty);
}

export function AdminPacking() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(getOrders()), []);

  const lines = buildPackingList(orders);
  const pendingOrders = orders.filter(
    (o) => o.fulfillmentStatus === "CONFIRMED" || o.fulfillmentStatus === "PACKING",
  );
  // Total weight waiting to go out — what you'd quote a bike partner for the run.
  const totalWeight = pendingOrders.reduce((sum, o) => sum + (o.weightGrams ?? 0), 0);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">Packing list</h1>
          <p className="mt-1 text-sm text-forest/60">
            Units to prepare today, aggregated across {pendingOrders.length} order
            {pendingOrders.length === 1 ? "" : "s"} awaiting packing
            {totalWeight > 0 ? ` · approx. ${formatWeight(totalWeight)} to dispatch` : ""}.
          </p>
        </div>
        {pendingOrders.length > 0 && (
          <button
            type="button"
            onClick={() => printShippingLabels(pendingOrders)}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Print all labels ({pendingOrders.length})
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-10 text-center text-forest/60">
          Nothing to pack right now — all orders are packed or beyond.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-forest/8 bg-parchment/40 text-left text-xs font-medium text-forest/55">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Prepare</th>
                <th className="px-5 py-3">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/8">
              {lines.map((line) => (
                <tr key={line.productId}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-forest">{line.name}</p>
                    <p className="text-xs text-forest/50">{line.size}</p>
                  </td>
                  <td className="px-5 py-3 text-forest/60">{line.sku}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-xs font-semibold text-moss">
                      {line.qty} unit{line.qty === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {line.orderNumbers.map((n) => (
                        <Link
                          key={n}
                          href={`/studio/orders/${n}`}
                          className="rounded-full bg-forest/5 px-2 py-0.5 text-xs text-forest/70 hover:bg-forest/10"
                        >
                          #{n}
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
