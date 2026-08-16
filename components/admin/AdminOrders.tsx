"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOrders,
  getOrder,
  updateOrderStatus,
  FULFILLMENT_FLOW,
  type Order,
  type FulfillmentStatus,
} from "@/lib/orders";
import { mockNotificationProvider, customerOrderStatus } from "@/lib/notifications";
import { formatPrice } from "@/lib/format";

const label: Record<FulfillmentStatus, string> = {
  CONFIRMED: "Confirmed",
  PACKING: "Packing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(getOrders()), []);

  function setStatus(orderNumber: string, status: FulfillmentStatus) {
    updateOrderStatus(orderNumber, status);
    // Notify the customer's WhatsApp number about the status change.
    const updated = getOrder(orderNumber);
    if (updated) void mockNotificationProvider.send(customerOrderStatus(updated, status));
    setOrders(getOrders());
  }

  function advance(o: Order) {
    const i = FULFILLMENT_FLOW.indexOf(o.fulfillmentStatus);
    if (i < FULFILLMENT_FLOW.length - 1) setStatus(o.orderNumber, FULFILLMENT_FLOW[i + 1]);
  }

  return (
    <div className="container py-10">
      <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-forest/60">
        Update fulfilment status — changes reflect in the customer&apos;s tracking instantly.
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-10 text-center text-forest/60">
          No orders yet. Place an order from the storefront to manage it here.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.orderNumber} className="rounded-lg border border-forest/8 bg-white/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/studio/orders/${o.orderNumber}`}
                    className="font-serif font-semibold text-forest hover:text-moss"
                  >
                    #{o.orderNumber}
                  </Link>
                  <p className="text-xs text-forest/55">
                    {new Date(o.createdAt).toLocaleString("en-IN")} · {o.address.fullName} ·{" "}
                    {o.address.phone}
                  </p>
                  <p className="mt-1 text-xs text-forest/50">
                    {o.items.map((i) => `${i.nameSnapshot} ×${i.qty}`).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-forest">{formatPrice(o.total)}</p>
                  <p className="text-xs text-moss">Payment: {o.paymentStatus}</p>
                </div>
              </div>

              {/* status control */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-forest/8 pt-4">
                <span className="text-xs font-medium text-forest/50">Status</span>
                <select
                  value={o.fulfillmentStatus}
                  onChange={(e) => setStatus(o.orderNumber, e.target.value as FulfillmentStatus)}
                  className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-sm focus:border-moss focus:outline-none"
                >
                  {FULFILLMENT_FLOW.map((s) => (
                    <option key={s} value={s}>
                      {label[s]}
                    </option>
                  ))}
                </select>
                {o.fulfillmentStatus !== "DELIVERED" && (
                  <button
                    type="button"
                    onClick={() => advance(o)}
                    className="rounded-full bg-forest px-4 py-1.5 text-sm font-medium text-cream hover:bg-ink"
                  >
                    Advance →
                  </button>
                )}
                <Link
                  href={`/order/${o.orderNumber}`}
                  className="ml-auto text-sm font-medium text-moss hover:text-forest"
                >
                  Customer view
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
