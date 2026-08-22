"use client";

import { useEffect, useRef, useState } from "react";
import { getOrder, type Order } from "@/lib/orders";
import { formatWeight } from "@/lib/weight";
import { pushRiderPing, getRiderPing, type RiderPing } from "@/lib/rider-tracking";
import { STORE_ORIGIN } from "@/lib/delivery";
import { PhoneIcon, CheckIcon } from "@/components/icons";

/**
 * Rider console — the page a delivery rider opens from the link we WhatsApp
 * them. One tap on "Share my location" starts a Geolocation watch that streams
 * fixes to the customer's tracking page for as long as this tab stays open. No
 * app to install, and nothing is shared until the rider taps the button.
 *
 * PRODUCTION: the URL must carry a short-lived signed token rather than a bare
 * order number, since it reveals the customer's address and phone; pings should
 * post to the backend instead of localStorage, and the token should expire when
 * the order is marked delivered.
 */
export default function RiderPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [sharing, setSharing] = useState(false);
  const [lastPing, setLastPing] = useState<RiderPing | null>(null);
  const [error, setError] = useState("");
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    setOrder(getOrder(params.orderNumber) ?? null);
    setLastPing(getRiderPing(params.orderNumber));
  }, [params.orderNumber]);

  // Always release the GPS watch when the rider leaves the page.
  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  function startSharing() {
    setError("");
    if (!("geolocation" in navigator)) {
      setError("This phone's browser doesn't support location sharing.");
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const ping: RiderPing = {
          orderNumber: params.orderNumber,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          at: new Date().toISOString(),
        };
        pushRiderPing(ping);
        setLastPing(ping);
        setSharing(true);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was declined. Allow location for this site and try again."
            : "Couldn't get a location fix. Check that GPS is on and try again.",
        );
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 },
    );
  }

  function stopSharing() {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setSharing(false);
  }

  if (order === undefined) {
    return <div className="container py-24 text-center text-forest/50">Loading…</div>;
  }

  if (order === null) {
    return (
      <div className="container max-w-lg py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold text-forest">Delivery not found</h1>
        <p className="mt-3 text-sm text-forest/65">
          No order matching <span className="font-medium">{params.orderNumber}</span> on this device.
          Check the link, or ask the shop to send it again.
        </p>
      </div>
    );
  }

  const a = order.address;
  const mapsHref = `https://www.google.com/maps/dir/?api=1&origin=${STORE_ORIGIN.lat},${STORE_ORIGIN.lng}&destination=${encodeURIComponent(
    `${a.line1}, ${a.line2 ?? ""} ${a.city} ${a.postalCode}`,
  )}`;

  return (
    <div className="container max-w-lg py-8">
      <p className="eyebrow">Rider delivery sheet</p>
      <h1 className="mt-1 font-serif text-2xl font-semibold text-forest">#{order.orderNumber}</h1>

      <section className="mt-5 rounded-lg border border-forest/10 bg-white/70 p-4">
        <h2 className="font-serif text-lg font-semibold text-forest">Drop at</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest/80">
          <span className="font-medium text-forest">{a.fullName}</span>
          <br />
          {a.line1}
          {a.line2 ? `, ${a.line2}` : ""}
          {a.landmark ? ` (${a.landmark})` : ""}
          <br />
          {a.city}, {a.state} – {a.postalCode}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`tel:${a.phone}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-medium text-cream hover:bg-ink"
          >
            <PhoneIcon width={15} /> Call {a.phone}
          </a>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Open in Maps
          </a>
        </div>
      </section>

      <section className="mt-4 rounded-lg border border-forest/10 bg-white/70 p-4">
        <h2 className="font-serif text-lg font-semibold text-forest">Parcel</h2>
        <p className="mt-2 text-sm text-forest/75">
          {order.items.reduce((n, i) => n + i.qty, 0)} item
          {order.items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "s"} · approx.{" "}
          {formatWeight(order.weightGrams ?? 0)}
          <br />
          <span className="text-forest/50">
            {order.paymentStatus === "PAID" ? "Prepaid — collect nothing" : "Collect payment on delivery"}
          </span>
        </p>
      </section>

      <section className="mt-4 rounded-lg border border-moss/30 bg-moss/8 p-4">
        <h2 className="font-serif text-lg font-semibold text-forest">Share your location</h2>
        <p className="mt-1 text-sm leading-relaxed text-forest/70">
          Turning this on lets the customer see where you are on their tracking page. It stops the
          moment you close this page.
        </p>
        {!sharing ? (
          <button
            type="button"
            onClick={startSharing}
            className="mt-3 w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink"
          >
            Share my location
          </button>
        ) : (
          <>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-moss">
              <CheckIcon width={15} /> Sharing live — keep this page open
            </p>
            <button
              type="button"
              onClick={stopSharing}
              className="mt-3 w-full rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Stop sharing
            </button>
          </>
        )}
        {error && <p className="mt-3 text-sm text-clay">{error}</p>}
        {lastPing && (
          <p className="mt-3 text-xs text-forest/50">
            Last fix {new Date(lastPing.at).toLocaleTimeString("en-IN")}
            {lastPing.accuracy ? ` · ±${Math.round(lastPing.accuracy)} m` : ""}
          </p>
        )}
      </section>

      <p className="mt-6 text-xs leading-relaxed text-forest/40">
        Demo build — location is kept on this device only. In production this link is single-use and
        expires when the order is marked delivered.
      </p>
    </div>
  );
}
