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
  type ShippingDetails,
} from "@/lib/orders";
import {
  BIKE_PARTNERS,
  DEFAULT_BIKE_PARTNER,
  PARTNER_TRACKING_HINT,
  bikeEtaMinutes,
  type DeliveryMode,
} from "@/lib/delivery";
import { mockNotificationProvider, customerOrderStatus } from "@/lib/notifications";

const HANDOVER_LABEL = "Handed over to customer";
/** Courier list minus the handover entry — that's its own dispatch mode now. */
const PARCEL_COURIERS = COURIER_OPTIONS.filter((c) => c !== HANDOVER_LABEL);

const MODE_LABEL: Record<DeliveryMode, string> = {
  bike: "Bike delivery",
  courier: "Courier parcel",
  handover: "Handed over directly",
};

/**
 * Shared fulfilment-status control used by both the orders list and the
 * order-detail page.
 *
 * Marking an order Shipped asks how it's going out. Bike delivery is the
 * default because that's how most city orders travel (Rapido / Uber and
 * similar) — capturing the rider's name and number there is what gives the
 * customer someone to call, and the rider link is what gives them a live map.
 */
export function OrderStatusControl({
  order,
  onUpdated,
}: {
  order: Order;
  onUpdated: (updated: Order) => void;
}) {
  const [pending, setPending] = useState(false); // dispatch-details form open
  const [mode, setMode] = useState<DeliveryMode>(order.deliveryMode ?? "bike");
  const [partner, setPartner] = useState<string>(
    order.deliveryMode === "bike" ? order.courier ?? DEFAULT_BIKE_PARTNER : DEFAULT_BIKE_PARTNER,
  );
  const [courier, setCourier] = useState<string>(
    order.deliveryMode === "courier" ? order.courier ?? PARCEL_COURIERS[0] : PARCEL_COURIERS[0],
  );
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [riderName, setRiderName] = useState(order.rider?.name ?? "");
  const [riderPhone, setRiderPhone] = useState(order.rider?.phone ?? "");
  const [vehicle, setVehicle] = useState(order.rider?.vehicleNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.liveTrackingUrl ?? "");
  const [eta, setEta] = useState(
    String(order.etaMinutes ?? bikeEtaMinutes(order.deliveryQuote?.distanceKm ?? 8)),
  );
  const [copied, setCopied] = useState(false);

  function apply(status: FulfillmentStatus, shipping?: ShippingDetails) {
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
    if (mode === "bike") {
      apply("SHIPPED", {
        deliveryMode: "bike",
        courier: partner,
        trackingNumber: undefined,
        rider: riderName.trim()
          ? {
              name: riderName.trim(),
              phone: riderPhone.replace(/\D/g, "").slice(-10),
              vehicleNumber: vehicle.trim() || undefined,
            }
          : undefined,
        liveTrackingUrl: trackingUrl.trim() || undefined,
        etaMinutes: Number(eta) > 0 ? Number(eta) : undefined,
      });
    } else if (mode === "courier") {
      apply("SHIPPED", {
        deliveryMode: "courier",
        courier,
        trackingNumber: tracking.trim() || undefined,
      });
    } else {
      apply("SHIPPED", { deliveryMode: "handover", courier: HANDOVER_LABEL });
    }
    setPending(false);
  }

  function copyRiderLink() {
    const url = `${window.location.origin}/rider/${order.orderNumber}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const currentIdx = FULFILLMENT_FLOW.indexOf(order.fulfillmentStatus);
  const nextStatus = FULFILLMENT_FLOW[currentIdx + 1];
  const inputCls =
    "rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-sm focus:border-moss focus:outline-none";

  if (pending) {
    return (
      <div className="space-y-3 rounded-lg border border-moss/25 bg-moss/5 p-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Dispatch method">
          {(Object.keys(MODE_LABEL) as DeliveryMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                mode === m
                  ? "border-forest bg-forest text-cream"
                  : "border-forest/15 text-forest hover:border-forest/40"
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>

        {mode === "bike" && (
          <>
            <div className="flex flex-wrap items-end gap-3">
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-forest/60">Partner</span>
                <select value={partner} onChange={(e) => setPartner(e.target.value)} className={inputCls}>
                  {BIKE_PARTNERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-forest/60">Rider name</span>
                <input
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  placeholder="e.g. Ramesh"
                  className={inputCls}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-forest/60">Rider mobile</span>
                <input
                  inputMode="numeric"
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit"
                  className={inputCls}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-forest/60">Vehicle no.</span>
                <input
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value.toUpperCase())}
                  placeholder="TS09 AB 1234"
                  className={`${inputCls} w-36`}
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-xs font-medium text-forest/60">ETA (min)</span>
                <input
                  inputMode="numeric"
                  value={eta}
                  onChange={(e) => setEta(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  className={`${inputCls} w-20`}
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-forest/60">
                Live tracking link (optional)
              </span>
              <input
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://…"
                className={`${inputCls} w-full`}
              />
              <span className="mt-1 block text-xs text-forest/45">
                {PARTNER_TRACKING_HINT[partner] ?? "Paste the partner's live trip link if they gave one."}
                {" "}No link? Send the rider the rider-link below instead — they share location from their phone.
              </span>
            </label>
          </>
        )}

        {mode === "courier" && (
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-forest/60">Courier</span>
              <select value={courier} onChange={(e) => setCourier(e.target.value)} className={inputCls}>
                {PARCEL_COURIERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-forest/60">Tracking number</span>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. 14329087651"
                className={inputCls}
              />
            </label>
          </div>
        )}

        {mode === "handover" && (
          <p className="text-sm text-forest/65">
            No tracking is recorded — the parcel goes straight to the customer.
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={confirmShip}
            className="rounded-full bg-forest px-4 py-1.5 text-sm font-medium text-cream hover:bg-ink"
          >
            Confirm dispatched
          </button>
          <button
            type="button"
            onClick={() => setPending(false)}
            className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={order.fulfillmentStatus}
        onChange={(e) => handleSelect(e.target.value as FulfillmentStatus)}
        className={inputCls}
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
          {order.rider?.name ? ` · ${order.rider.name}` : ""}
          {order.trackingNumber ? ` · ${order.trackingNumber}` : ""}
        </span>
      )}
      {order.deliveryMode === "bike" && (
        <button
          type="button"
          onClick={copyRiderLink}
          title="Send this to the rider so the customer can see them on a live map"
          className="rounded-full border border-forest/20 px-3 py-1 text-xs font-medium text-forest hover:bg-forest/5"
        >
          {copied ? "Rider link copied" : "Copy rider link"}
        </button>
      )}
    </div>
  );
}
