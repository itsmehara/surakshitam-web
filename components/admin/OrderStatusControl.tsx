"use client";

import { useState } from "react";
import {
  getOrder,
  updateOrderStatus,
  FULFILLMENT_FLOW,
  FULFILLMENT_LABEL,
  COURIER_OPTIONS,
  type Order,
  type FulfillmentStatus,
} from "@/lib/orders";
import { mockNotificationProvider, customerOrderStatus } from "@/lib/notifications";

/**
 * Shared fulfilment-status control used by both the orders list and the
 * order-detail page. Marking an order Shipped requires picking a courier
 * (or "Handed over to customer" for self/local delivery) and, unless
 * handed-over, a tracking number — so the customer's tracking page always
 * has something real to show once an order ships.
 */
export function OrderStatusControl({
  order,
  onUpdated,
}: {
  order: Order;
  onUpdated: (updated: Order) => void;
}) {
  const [pending, setPending] = useState(false); // shipping-details form open
  const [courier, setCourier] = useState(order.courier ?? COURIER_OPTIONS[0]);
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");

  function apply(status: FulfillmentStatus, shipping?: { courier?: string; trackingNumber?: string }) {
    updateOrderStatus(order.orderNumber, status, shipping);
    const updated = getOrder(order.orderNumber);
    if (updated) {
      void mockNotificationProvider.send(customerOrderStatus(updated, status));
      onUpdated(updated);
    }
  }

  function handleSelect(status: FulfillmentStatus) {
    if (status === "SHIPPED") {
      setPending(true);
      return;
    }
    apply(status);
  }

  function confirmShip() {
    const handedOver = courier === "Handed over to customer";
    apply("SHIPPED", { courier, trackingNumber: handedOver ? undefined : tracking.trim() || undefined });
    setPending(false);
  }

  const currentIdx = FULFILLMENT_FLOW.indexOf(order.fulfillmentStatus);
  const nextStatus = FULFILLMENT_FLOW[currentIdx + 1];

  if (pending) {
    return (
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-moss/25 bg-moss/5 p-3">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium text-forest/60">Courier</span>
          <select
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-sm focus:border-moss focus:outline-none"
          >
            {COURIER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {courier !== "Handed over to customer" && (
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-forest/60">Tracking number</span>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. 14329087651"
              className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-sm focus:border-moss focus:outline-none"
            />
          </label>
        )}
        <button
          type="button"
          onClick={confirmShip}
          className="rounded-full bg-forest px-4 py-1.5 text-sm font-medium text-cream hover:bg-ink"
        >
          Confirm shipped
        </button>
        <button
          type="button"
          onClick={() => setPending(false)}
          className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest hover:bg-forest/5"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={order.fulfillmentStatus}
        onChange={(e) => handleSelect(e.target.value as FulfillmentStatus)}
        className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-sm focus:border-moss focus:outline-none"
      >
        {FULFILLMENT_FLOW.map((s) => (
          <option key={s} value={s}>
            {FULFILLMENT_LABEL[s]}
          </option>
        ))}
      </select>
      {nextStatus && (
        <button
          type="button"
          onClick={() => handleSelect(nextStatus)}
          className="rounded-full bg-forest px-4 py-1.5 text-sm font-medium text-cream hover:bg-ink"
        >
          Advance →
        </button>
      )}
      {order.courier && (
        <span className="text-xs text-forest/50">
          {order.courier}
          {order.trackingNumber ? ` · ${order.trackingNumber}` : ""}
        </span>
      )}
    </div>
  );
}
