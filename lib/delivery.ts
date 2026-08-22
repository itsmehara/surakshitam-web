/**
 * Delivery pricing, zones and partners (prototype).
 *
 * Rules the founders asked for:
 *   1. Inside the city, orders over ₹699 ship free.
 *   2. Beyond 15 km from the kitchen, a distance charge applies — the free-
 *      delivery offer waives the base fee, not the extra distance.
 *   3. Most local orders go out on a bike (Rapido / Uber and similar), so bike
 *      delivery is the default dispatch mode and drives the tracking screens.
 *
 * Distance here is looked up from a small Hyderabad pincode table rather than a
 * maps API, so the prototype stays offline and deterministic.
 * PRODUCTION: replace `distanceFromStore()` with a Google Distance Matrix /
 * Mapbox Directions call (cached per pincode) and move the whole quote
 * server-side — a client-computed delivery fee must never be trusted at charge
 * time.
 */

import { billableWeightGrams } from "./weight";

/* ------------------------------- constants ------------------------------ */

/** Free delivery inside the city at or above this cart subtotal (paise). */
export const FREE_DELIVERY_MIN = 69900; // ₹699

/** Distance included in the flat local fee. Past this, per-km charges start. */
export const LOCAL_RADIUS_KM = 15;

/** Flat fee for a local (≤ 15 km) bike drop, before the free-delivery offer. */
export const LOCAL_DELIVERY_FEE = 4900; // ₹49

/** Charged for every kilometre beyond `LOCAL_RADIUS_KM`, rounded up. */
export const PER_KM_BEYOND_RADIUS = 800; // ₹8 / km

/** Outstation courier: base covers the first kilo, then per additional kilo. */
export const COURIER_BASE_FEE = 7900; // ₹79 up to 1 kg
export const COURIER_PER_EXTRA_KG = 4000; // ₹40 per additional kg

/** The kitchen the parcels leave from — Nagole, Hyderabad. */
export const STORE_ORIGIN = {
  label: "Surakshitam kitchen · Nagole",
  pincode: "500068",
  lat: 17.3666,
  lng: 78.5586,
} as const;

/* --------------------------------- zones -------------------------------- */

export type DeliveryZone = "local" | "city-extended" | "outstation";

interface PinEntry {
  km: number;
  area: string;
  lat: number;
  lng: number;
}

/**
 * Approximate road distance from the Nagole kitchen, by Hyderabad pincode.
 * DEMO DATA — good enough to price a bike drop, not a substitute for routing.
 */
const HYDERABAD_PINCODES: Record<string, PinEntry> = {
  "500068": { km: 1, area: "Nagole", lat: 17.3666, lng: 78.5586 },
  "500035": { km: 4, area: "L B Nagar", lat: 17.3457, lng: 78.5522 },
  "500060": { km: 5, area: "Dilsukhnagar", lat: 17.3687, lng: 78.5247 },
  "500059": { km: 5, area: "Saroornagar", lat: 17.3524, lng: 78.5308 },
  "500074": { km: 6, area: "Vanasthalipuram", lat: 17.3253, lng: 78.5852 },
  "500079": { km: 7, area: "Uppal", lat: 17.4055, lng: 78.5595 },
  "500070": { km: 9, area: "Hayathnagar", lat: 17.3283, lng: 78.6055 },
  "500036": { km: 9, area: "Malakpet", lat: 17.3752, lng: 78.5057 },
  "500005": { km: 10, area: "Charminar / Old City", lat: 17.3616, lng: 78.4747 },
  "500013": { km: 10, area: "Amberpet", lat: 17.3937, lng: 78.5124 },
  "500039": { km: 10, area: "Nacharam", lat: 17.4245, lng: 78.5535 },
  "500076": { km: 11, area: "Habsiguda", lat: 17.4009, lng: 78.5411 },
  "500007": { km: 12, area: "Tarnaka", lat: 17.4256, lng: 78.5253 },
  "500001": { km: 14, area: "Abids", lat: 17.3903, lng: 78.4761 },
  "500017": { km: 15, area: "Secunderabad", lat: 17.4399, lng: 78.4983 },
  "500003": { km: 16, area: "Secunderabad (Trimulgherry)", lat: 17.4657, lng: 78.5089 },
  "500004": { km: 16, area: "Khairatabad", lat: 17.4126, lng: 78.4602 },
  "500016": { km: 17, area: "Begumpet", lat: 17.4435, lng: 78.4645 },
  "500008": { km: 18, area: "Mehdipatnam", lat: 17.3953, lng: 78.4392 },
  "500034": { km: 18, area: "Banjara Hills", lat: 17.4126, lng: 78.4392 },
  "500073": { km: 19, area: "Ameerpet", lat: 17.4374, lng: 78.4487 },
  "500018": { km: 20, area: "S R Nagar", lat: 17.4419, lng: 78.4419 },
  "500028": { km: 20, area: "Tolichowki", lat: 17.3963, lng: 78.4165 },
  "500033": { km: 21, area: "Jubilee Hills", lat: 17.4239, lng: 78.4106 },
  "500032": { km: 25, area: "Madhapur / HITEC City", lat: 17.4483, lng: 78.3915 },
  "500081": { km: 26, area: "Gachibowli", lat: 17.4401, lng: 78.3489 },
  "500072": { km: 28, area: "KPHB", lat: 17.4849, lng: 78.3915 },
  "500084": { km: 28, area: "Kondapur", lat: 17.4615, lng: 78.3646 },
  "500085": { km: 28, area: "Kukatpally", lat: 17.4948, lng: 78.3996 },
  "500049": { km: 32, area: "Miyapur", lat: 17.4966, lng: 78.3573 },
  "500090": { km: 34, area: "Nizampet", lat: 17.5107, lng: 78.3856 },
};

/** Assumed distance for a Hyderabad pincode we haven't mapped yet. */
const UNKNOWN_CITY_KM = 20;
/** Assumed distance for the surrounding district pincodes (501xxx / 502xxx). */
const OUTSKIRTS_KM = 30;

export interface DistanceEstimate {
  km: number;
  area?: string;
  /** Destination coordinates, when we know the area — used by the live map. */
  lat?: number;
  lng?: number;
  zone: DeliveryZone;
  /** True when the distance is a table lookup rather than a guess. */
  known: boolean;
}

/** Approximate distance from the kitchen to a delivery pincode. */
export function distanceFromStore(pincode: string): DistanceEstimate {
  const pin = (pincode || "").replace(/\D/g, "").slice(0, 6);
  const entry = HYDERABAD_PINCODES[pin];
  if (entry) {
    return {
      km: entry.km,
      area: entry.area,
      lat: entry.lat,
      lng: entry.lng,
      zone: entry.km <= LOCAL_RADIUS_KM ? "local" : "city-extended",
      known: true,
    };
  }
  if (pin.startsWith("500")) {
    return { km: UNKNOWN_CITY_KM, zone: "city-extended", known: false };
  }
  if (pin.startsWith("501") || pin.startsWith("502")) {
    return { km: OUTSKIRTS_KM, zone: "city-extended", known: false };
  }
  return { km: 0, zone: "outstation", known: pin.length === 6 };
}

/**
 * Where to draw the destination pin. Known PIN codes have real area centres;
 * for anything else we place a point at the estimated distance on a bearing
 * derived from the digits, so a given address always maps to the same spot
 * instead of jumping around between renders.
 */
export function destinationCoords(pincode: string): { lat: number; lng: number; exact: boolean } {
  const est = distanceFromStore(pincode);
  if (est.lat !== undefined && est.lng !== undefined) {
    return { lat: est.lat, lng: est.lng, exact: true };
  }
  const digits = (pincode || "").replace(/\D/g, "");
  const seed = digits ? Number(digits.slice(-3)) : 180;
  const bearing = ((seed * 137) % 360) * (Math.PI / 180);
  const km = est.km || UNKNOWN_CITY_KM;
  const dLat = (km / 111) * Math.cos(bearing);
  const dLng = (km / (111 * Math.cos((STORE_ORIGIN.lat * Math.PI) / 180))) * Math.sin(bearing);
  return { lat: STORE_ORIGIN.lat + dLat, lng: STORE_ORIGIN.lng + dLng, exact: false };
}

/* -------------------------------- partners ------------------------------- */

export type DeliveryMode = "bike" | "courier" | "handover";

/**
 * Bike-delivery partners. Rapido is first because it is the default dispatch
 * for city orders; "Own rider" covers a family member doing the drop.
 */
export const BIKE_PARTNERS = [
  "Rapido",
  "Uber",
  "Porter",
  "Dunzo",
  "Own rider",
] as const;
export type BikePartner = (typeof BIKE_PARTNERS)[number];

export const DEFAULT_BIKE_PARTNER: BikePartner = "Rapido";

/** Where a partner's own live-tracking page lives, for the "Open in app" link. */
export const PARTNER_TRACKING_HINT: Record<string, string> = {
  Rapido: "Paste the Rapido trip link from the captain's ride (rapido.bike/…).",
  Uber: "Paste the Uber trip share link (t.uber.com/…).",
  Porter: "Paste the Porter live-tracking link.",
  Dunzo: "Paste the Dunzo task tracking link.",
  "Own rider": "Optional — leave blank and use live location sharing instead.",
};

/** Riding speed used for ETA maths (Hyderabad traffic, DEMO figure). */
const BIKE_KMPH = 18;
/** Time to hand the parcel over at the pickup point. */
const PICKUP_BUFFER_MIN = 10;

/** Rough door-to-door ETA in minutes for a bike drop. */
export function bikeEtaMinutes(km: number): number {
  return Math.max(15, Math.round((km / BIKE_KMPH) * 60) + PICKUP_BUFFER_MIN);
}

/* --------------------------------- quote --------------------------------- */

export interface DeliveryQuote {
  zone: DeliveryZone;
  mode: DeliveryMode;
  distanceKm: number;
  area?: string;
  /** Total delivery charge in paise. */
  fee: number;
  /** Base fee before the free-delivery offer (0 for outstation). */
  baseFee: number;
  /** Extra charged for distance past `LOCAL_RADIUS_KM`. */
  distanceSurcharge: number;
  /** True when the ₹699 city offer removed the base fee. */
  freeApplied: boolean;
  /** How much more the customer must add to unlock the offer (paise, 0 if met). */
  amountToFree: number;
  /** Parcel weight the quote was built from. */
  weightGrams: number;
  etaText: string;
  /** Short customer-facing lines explaining the charge. */
  notes: string[];
}

export interface QuoteInput {
  subtotal: number;
  weightGrams: number;
  pincode?: string;
}

/**
 * Prices a delivery. Safe to call with an empty pincode — you get the local
 * (best-case) quote, which is what the cart shows before an address is entered.
 */
export function quoteDelivery({ subtotal, weightGrams, pincode }: QuoteInput): DeliveryQuote {
  const pin = (pincode ?? "").replace(/\D/g, "");
  // Before a full PIN code is known, quote the local best case rather than
  // guessing outstation — the cart shouldn't show a courier fee to a customer
  // who simply hasn't typed their PIN yet.
  const est: DistanceEstimate =
    pin.length === 6 ? distanceFromStore(pin) : { km: 0, zone: "local", known: false };
  const notes: string[] = [];
  const amountToFree = Math.max(0, FREE_DELIVERY_MIN - subtotal);

  if (est.zone === "outstation") {
    const kg = Math.max(1, Math.ceil(billableWeightGrams(weightGrams) / 1000));
    const fee = COURIER_BASE_FEE + (kg - 1) * COURIER_PER_EXTRA_KG;
    notes.push("Outside Hyderabad — sent by courier, charged on parcel weight.");
    notes.push(`Free delivery over ₹${FREE_DELIVERY_MIN / 100} applies within the city only.`);
    return {
      zone: "outstation",
      mode: "courier",
      distanceKm: 0,
      fee,
      baseFee: fee,
      distanceSurcharge: 0,
      freeApplied: false,
      amountToFree,
      weightGrams,
      etaText: "3–6 working days",
      notes,
    };
  }

  const extraKm = Math.max(0, Math.ceil(est.km - LOCAL_RADIUS_KM));
  const distanceSurcharge = extraKm * PER_KM_BEYOND_RADIUS;
  const freeApplied = subtotal >= FREE_DELIVERY_MIN;
  const baseFee = freeApplied ? 0 : LOCAL_DELIVERY_FEE;
  const fee = baseFee + distanceSurcharge;

  if (freeApplied && extraKm > 0) {
    notes.push(
      `Free delivery applied — only the distance beyond ${LOCAL_RADIUS_KM} km is charged.`,
    );
  } else if (freeApplied) {
    notes.push(`Free delivery unlocked — orders over ₹${FREE_DELIVERY_MIN / 100} inside the city.`);
  } else {
    notes.push(
      `Add ₹${Math.ceil(amountToFree / 100)} more for free delivery inside the city.`,
    );
  }
  if (extraKm > 0) {
    notes.push(
      `${est.km} km from our kitchen — ₹${PER_KM_BEYOND_RADIUS / 100}/km applies beyond ${LOCAL_RADIUS_KM} km (${extraKm} km extra).`,
    );
  }
  if (pin.length !== 6) {
    notes.push("Enter your PIN code for the exact delivery charge.");
  } else if (!est.known) {
    notes.push("Distance estimated for this PIN code — we'll confirm before dispatch.");
  }

  return {
    zone: est.zone,
    mode: "bike",
    distanceKm: est.km,
    area: est.area,
    fee,
    baseFee,
    distanceSurcharge,
    freeApplied,
    amountToFree,
    weightGrams,
    etaText: `${bikeEtaMinutes(est.km)} min (same-day bike delivery)`,
    notes,
  };
}

/** One-line headline for banners and the offers page. */
export const FREE_DELIVERY_HEADLINE = `Free delivery on orders over ₹${FREE_DELIVERY_MIN / 100} within Hyderabad`;
export const FREE_DELIVERY_SUBLINE = `Beyond ${LOCAL_RADIUS_KM} km from our kitchen a small distance charge of ₹${PER_KM_BEYOND_RADIUS / 100}/km applies.`;
