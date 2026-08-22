"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/lib/orders";
import { STORE_ORIGIN, destinationCoords, bikeEtaMinutes } from "@/lib/delivery";
import {
  getRiderPing,
  isPingFresh,
  subscribeRiderPings,
  haversineKm,
  type RiderPing,
} from "@/lib/rider-tracking";

/** Flat-earth projection — fine over the ~30 km this map ever covers. */
function project(p: { lat: number; lng: number }, lat0: number) {
  const k = Math.cos((lat0 * Math.PI) / 180);
  return { x: p.lng * k, y: -p.lat };
}

const W = 420;
const H = 240;
const PAD = 34;

/**
 * Where the parcel is, drawn on a simple schematic map.
 *
 * If the rider has shared their location (see lib/rider-tracking.ts) we plot the
 * real GPS fix. If they haven't, we plot an estimated position along the route
 * from the dispatch time and the quoted ETA — and label it as estimated, so the
 * customer is never shown a guess dressed up as a live fix.
 */
export function LiveDeliveryMap({ order }: { order: Order }) {
  const [ping, setPing] = useState<RiderPing | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const read = () => setPing(getRiderPing(order.orderNumber));
    read();
    return subscribeRiderPings(order.orderNumber, read);
  }, [order.orderNumber]);

  // Keeps the ETA countdown and the estimated position moving.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const dest = useMemo(() => destinationCoords(order.address.postalCode), [order.address.postalCode]);
  const etaMinutes = order.etaMinutes ?? bikeEtaMinutes(order.deliveryQuote?.distanceKm ?? 8);
  const dispatchedAt = order.dispatchedAt ? new Date(order.dispatchedAt).getTime() : null;
  const elapsedMin = dispatchedAt ? Math.max(0, (now - dispatchedAt) / 60000) : 0;

  const live = isPingFresh(ping, now);
  const progress = Math.min(0.97, etaMinutes > 0 ? elapsedMin / etaMinutes : 0);

  const rider = live
    ? { lat: ping!.lat, lng: ping!.lng }
    : {
        lat: STORE_ORIGIN.lat + (dest.lat - STORE_ORIGIN.lat) * progress,
        lng: STORE_ORIGIN.lng + (dest.lng - STORE_ORIGIN.lng) * progress,
      };

  const remainingKm = haversineKm(rider, dest);
  const remainingMin = order.fulfillmentStatus === "DELIVERED"
    ? 0
    : Math.max(1, Math.round(etaMinutes - elapsedMin));

  // Fit all three points into the viewBox.
  const pts = [STORE_ORIGIN, dest, rider].map((p) => project(p, STORE_ORIGIN.lat));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const spanX = Math.max(...xs) - Math.min(...xs) || 0.01;
  const spanY = Math.max(...ys) - Math.min(...ys) || 0.01;
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const toSvg = (p: { x: number; y: number }) => ({
    x: PAD + (p.x - Math.min(...xs)) * scale + (W - PAD * 2 - spanX * scale) / 2,
    y: PAD + (p.y - Math.min(...ys)) * scale + (H - PAD * 2 - spanY * scale) / 2,
  });
  const [store, target, bike] = pts.map(toSvg);

  return (
    <div className="overflow-hidden rounded-lg border border-forest/10 bg-white/70">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/8 px-4 py-2.5">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-forest">
          <span
            className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-moss" : "bg-forest/30"}`}
            aria-hidden
          />
          {live ? "Live location — rider is sharing" : "Estimated position"}
        </span>
        <span className="text-xs text-forest/55">
          {order.fulfillmentStatus === "DELIVERED"
            ? "Delivered"
            : `≈ ${remainingKm.toFixed(1)} km away · ~${remainingMin} min`}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full bg-[#EFF1E7]"
        role="img"
        aria-label={`Delivery map — rider approximately ${remainingKm.toFixed(1)} kilometres away`}
      >
        {/* Schematic street grid — texture only, not real geography. */}
        <g stroke="#D6DAC6" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={`h${i}`} x1="0" y1={(H / 5) * i} x2={W} y2={(H / 5) * i} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={`v${i}`} x1={(W / 7) * i} y1="0" x2={(W / 7) * i} y2={H} />
          ))}
        </g>

        {/* Route */}
        <path
          d={`M ${store.x} ${store.y} Q ${(store.x + target.x) / 2} ${(store.y + target.y) / 2 - 34} ${target.x} ${target.y}`}
          fill="none"
          stroke="#4F6B45"
          strokeWidth="3"
          strokeDasharray="7 6"
          opacity="0.55"
        />

        {/* Kitchen */}
        <g>
          <rect x={store.x - 7} y={store.y - 7} width="14" height="14" rx="3" fill="#2E402C" />
          <text x={store.x} y={store.y + 24} textAnchor="middle" fontSize="11" fill="#2E402C">
            Kitchen
          </text>
        </g>

        {/* Destination */}
        <g>
          <circle cx={target.x} cy={target.y} r="8" fill="#B4593C" />
          <circle cx={target.x} cy={target.y} r="3" fill="#FFF" />
          <text x={target.x} y={target.y + 25} textAnchor="middle" fontSize="11" fill="#2E402C">
            You
          </text>
        </g>

        {/* Rider */}
        <g>
          {live && <circle cx={bike.x} cy={bike.y} r="15" fill="#6B8F5A" opacity="0.25" />}
          <circle cx={bike.x} cy={bike.y} r="9" fill="#6B8F5A" stroke="#FFF" strokeWidth="2.5" />
          <text x={bike.x} y={bike.y - 15} textAnchor="middle" fontSize="11" fill="#2E402C">
            Rider
          </text>
        </g>
      </svg>

      <p className="px-4 py-2.5 text-xs leading-relaxed text-forest/50">
        {live
          ? "Position updates while the rider keeps the location link open."
          : "The rider hasn't shared live location for this trip — this is an estimate from the dispatch time and distance."}
        {!dest.exact && " Destination is approximate for this PIN code."}
      </p>
    </div>
  );
}
