"use client";

import { useState } from "react";
import { inputClass } from "@/components/ui/FormField";
import { cn } from "@/lib/cn";

/**
 * Rapido only: where the rider should collect or meet the customer, as a Google
 * Maps link. No map is embedded here, since an embedded picker needs a Google
 * Maps API key. The customer either shares the phone's location, or opens
 * Google Maps, drops a pin, and pastes the link back. The link goes into the
 * WhatsApp order message (lib/order.ts). Optional, so the order is never blocked.
 */
export function MapsLocation({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | undefined>();

  function useMyLocation() {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setLocError("This phone cannot share its location. Open Google Maps below and paste the link.");
      return;
    }
    setLocating(true);
    setLocError(undefined);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onChange(`https://www.google.com/maps?q=${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`);
      },
      () => {
        setLocating(false);
        setLocError("We could not get your location. Allow location for this site, or open Google Maps below and paste the link.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }

  const button =
    "inline-flex h-9 items-center justify-center rounded-full border border-forest/20 px-4 text-sm font-medium text-forest hover:border-forest/40 disabled:opacity-60";

  return (
    <section aria-labelledby="co-maps-heading" className="space-y-3 rounded-lg border border-forest/10 bg-white/70 p-3">
      <h2 id="co-maps-heading" className="text-sm font-medium text-forest">
        Where should the rider collect you?
      </h2>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={useMyLocation} disabled={locating} className={button}>
          {locating ? "Finding you…" : "Use my current location"}
        </button>
        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className={button}>
          Open Google Maps
        </a>
      </div>
      <p className="text-xs leading-relaxed text-forest/55">
        In Google Maps, press and hold your place to drop a pin, tap Share, copy the link and paste it below.
      </p>
      <div>
        <label htmlFor="co-maps" className="mb-1 block text-sm font-medium text-forest">
          Google Maps link <span className="text-xs font-normal text-forest/55">(optional)</span>
        </label>
        <input
          id="co-maps"
          name="mapsLink"
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder="https://maps.app.goo.gl/…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          className={cn(inputClass, "h-10", error && "border-clay focus:border-clay")}
        />
        {error && <p className="mt-1 text-xs text-clay">{error}</p>}
        {locError && (
          <p role="status" className="mt-1 text-xs text-clay">
            {locError}
          </p>
        )}
      </div>
    </section>
  );
}
