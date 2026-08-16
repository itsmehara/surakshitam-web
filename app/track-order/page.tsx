"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrder, getOrders, type Order, type FulfillmentStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { PageIntro } from "@/components/ui/PageIntro";
import { CheckIcon } from "@/components/icons";

const STEPS = ["Order placed", "Preparing", "Packed", "Shipped", "Delivered"];
const STATUS_INDEX: Record<FulfillmentStatus, number> = {
  CONFIRMED: 1,
  PACKING: 1,
  PACKED: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

export default function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState("");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);

  // Prefill with the most recent demo order for convenience.
  useEffect(() => {
    const latest = getOrders()[0];
    if (latest) setOrderNo(latest.orderNumber);
  }, []);

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    setOrder(getOrder(orderNo.trim()) ?? null);
    setSearched(true);
  }

  const current = order ? STATUS_INDEX[order.fulfillmentStatus] : 0;

  return (
    <>
      <PageIntro
        eyebrow="Track order"
        title="Where's my order?"
        intro="Enter your order number to see its progress. In this demo, orders are stored on the device used to place them."
      />
      <div className="container max-w-2xl py-10">
        <form onSubmit={lookup} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="e.g. SURK-2026-000123"
            aria-label="Order number"
            className="flex-1 rounded-full border border-forest/15 bg-white px-5 py-3 text-sm focus:border-moss focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream hover:bg-ink">
            Track
          </button>
        </form>

        {searched && order === null && (
          <p className="mt-6 text-sm text-clay">
            No order found for that number on this device. Check the number and try again.
          </p>
        )}

        {order && (
          <div className="mt-8 rounded-lg border border-forest/8 bg-white/60 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold text-forest">#{order.orderNumber}</h2>
              <span className="text-sm text-forest/55">
                Placed {new Date(order.createdAt).toLocaleDateString("en-IN")} · {formatPrice(order.total)}
              </span>
            </div>

            {/* Tracker */}
            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => {
                const done = i <= current;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        done ? "bg-moss text-cream" : "bg-forest/10 text-forest/40"
                      }`}
                    >
                      {done ? <CheckIcon width={14} /> : i + 1}
                    </span>
                    <span className={done ? "font-medium text-forest" : "text-forest/45"}>{s}</span>
                    {i === current && <span className="text-xs text-moss">In progress</span>}
                  </li>
                );
              })}
            </ol>

            <p className="mt-6 text-xs text-forest/45">
              Demo tracking — status updates would be driven by the admin/operations system.
            </p>
            <Link href={`/order/${order.orderNumber}`} className="mt-3 inline-block text-sm font-medium text-moss">
              View order details
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
