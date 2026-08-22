/**
 * Live rider location (prototype).
 *
 * Three ways to answer "where is my parcel?", in the order we'd actually reach
 * for them:
 *
 *  1. **Partner trip link.** Rapido and Uber hand the sender a live trip URL.
 *     It costs us nothing, drains no battery, and the map is theirs. Captured
 *     on the order as `liveTrackingUrl` when the order is dispatched.
 *  2. **Our own rider link.** For our own rider — or a partner who didn't share
 *     a link — we WhatsApp the rider a one-off URL (`/rider/<orderNumber>`).
 *     They tap "Share my location" once and the browser's Geolocation API
 *     streams coordinates for as long as the page stays open. No app install,
 *     works on any phone. Those pings are what this module stores.
 *  3. **Neither.** The customer still gets the stage tracker, the ETA and the
 *     rider's number — never a dead end.
 *
 * PRODUCTION: pings belong on Supabase Realtime (or a small WebSocket service)
 * keyed by order number, written with a short TTL and readable only by the
 * ordering customer and staff. Here they go to localStorage, which keeps the
 * whole flow demonstrable end-to-end on one device.
 */

export interface RiderPing {
  orderNumber: string;
  lat: number;
  lng: number;
  /** GPS accuracy in metres, as reported by the browser. */
  accuracy?: number;
  /** ISO timestamp of the fix. */
  at: string;
}

const KEY = "sn-rider-track-v1";
/** Plenty for a live trail without letting localStorage grow unbounded. */
const MAX_TRAIL = 60;
/** A fix older than this is stale — we stop calling it "live". */
export const PING_FRESH_MS = 90_000;
/** Same-tab notification channel (the `storage` event only fires cross-tab). */
const LOCAL_EVENT = "sn-rider-ping";

type Trails = Record<string, RiderPing[]>;

function readAll(): Trails {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Trails;
  } catch {
    return {};
  }
}

function writeAll(trails: Trails): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(trails));
  } catch {
    /* ignore */
  }
}

/** Records one GPS fix for an order. */
export function pushRiderPing(ping: RiderPing): void {
  const all = readAll();
  const trail = [...(all[ping.orderNumber] ?? []), ping].slice(-MAX_TRAIL);
  all[ping.orderNumber] = trail;
  writeAll(all);
  try {
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT, { detail: ping.orderNumber }));
  } catch {
    /* ignore */
  }
}

export function getRiderTrail(orderNumber: string): RiderPing[] {
  return readAll()[orderNumber] ?? [];
}

/** The most recent fix, or null if the rider never shared their location. */
export function getRiderPing(orderNumber: string): RiderPing | null {
  const trail = getRiderTrail(orderNumber);
  return trail.length ? trail[trail.length - 1] : null;
}

export function isPingFresh(ping: RiderPing | null, now: number = Date.now()): boolean {
  if (!ping) return false;
  return now - new Date(ping.at).getTime() < PING_FRESH_MS;
}

/** Clears a trail — called when the drop is completed. */
export function clearRiderTrail(orderNumber: string): void {
  const all = readAll();
  delete all[orderNumber];
  writeAll(all);
}

/**
 * Calls `onChange` whenever this order's trail changes — in this tab (custom
 * event), in another tab (storage event), or on a slow poll as a safety net.
 * Returns the unsubscribe function.
 */
export function subscribeRiderPings(orderNumber: string, onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) onChange();
  };
  const onLocal = (e: Event) => {
    if ((e as CustomEvent<string>).detail === orderNumber) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_EVENT, onLocal as EventListener);
  const poll = window.setInterval(onChange, 15_000);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_EVENT, onLocal as EventListener);
    window.clearInterval(poll);
  };
}

/** Great-circle distance in km between two points. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
