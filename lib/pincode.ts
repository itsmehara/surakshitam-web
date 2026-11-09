/**
 * Pincode lookup at checkout (PENDING A4d): when the customer types a six-digit
 * pincode, City, State and the post office fill in. The source is India Post's
 * public API (api.postalpincode.in, which allows browser requests). Only the
 * six digits are sent: no name, phone or address. If the lookup fails or is
 * slow, nothing is filled and the customer types City and picks State as before.
 */

import { INDIAN_STATES, type IndianState } from "@/lib/india";

export type PostOffice = {
  name: string;
  district: string;
  /** Matched to an entry of INDIAN_STATES; undefined if the API's state name is not recognised. */
  state: IndianState | undefined;
  /** India Post's DeliveryStatus is "Delivery" (not "Non-Delivery"). */
  delivers: boolean;
};

export type PincodeOutcome =
  | { status: "ok"; offices: PostOffice[] }
  | { status: "not-found" }
  | { status: "unavailable" };

const API = "https://api.postalpincode.in/pincode/";
const TIMEOUT_MS = 5000;

/** Names compare loosely: case, "&" against "and", and punctuation do not matter. */
const norm = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
const STATE_BY_NAME = new Map<string, IndianState>(INDIAN_STATES.map((s): [string, IndianState] => [norm(s), s]));
/** Older names India Post still uses for some states and territories. */
const OLD_NAMES = new Map<string, IndianState>([
  ["orissa", "Odisha"],
  ["pondicherry", "Puducherry"],
  ["uttaranchal", "Uttarakhand"],
  ["nctofdelhi", "Delhi"],
]);

export function matchState(name: string): IndianState | undefined {
  const key = norm(name);
  return STATE_BY_NAME.get(key) ?? OLD_NAMES.get(key);
}

/** India Post answers with an array holding one object: `{ Status, PostOffice: [...] }`. */
export function parsePincodeResponse(json: unknown): PincodeOutcome {
  const first: unknown = Array.isArray(json) ? json[0] : undefined;
  if (!first || typeof first !== "object") return { status: "not-found" };
  const { Status, PostOffice } = first as { Status?: unknown; PostOffice?: unknown };
  if (Status !== "Success" || !Array.isArray(PostOffice)) return { status: "not-found" };
  const offices: PostOffice[] = [];
  for (const raw of PostOffice as unknown[]) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const name = typeof o.Name === "string" ? o.Name.trim() : "";
    if (!name) continue;
    offices.push({
      name,
      district: typeof o.District === "string" ? o.District.trim() : "",
      state: typeof o.State === "string" ? matchState(o.State) : undefined,
      delivers: o.DeliveryStatus === "Delivery",
    });
  }
  return offices.length ? { status: "ok", offices } : { status: "not-found" };
}

/** The offices to offer: those that deliver, or all of them when none does. The first one is the default. */
export function pickableOffices(offices: PostOffice[]): PostOffice[] {
  const delivering = offices.filter((o) => o.delivers);
  return delivering.length ? delivering : offices;
}

/**
 * Fill City, State and the post office from one office. City and State are only
 * replaced while the customer has not typed their own (`edited`).
 */
export function fillFromOffice<T extends { city: string; state: string; postOffice: string }>(
  c: T,
  office: PostOffice,
  edited: { city: boolean; state: boolean },
): T {
  return {
    ...c,
    postOffice: office.name,
    city: !edited.city && office.district ? office.district : c.city,
    state: !edited.state && office.state ? office.state : c.state,
  };
}

/** Results for the page visit. Failures are not kept, so a later try can succeed. */
const cache = new Map<string, PincodeOutcome>();

/** Looks up a six-digit pincode. Never throws: a network error, a timeout or a bad reply is "unavailable". */
export async function lookupPincode(pin: string): Promise<PincodeOutcome> {
  const known = cache.get(pin);
  if (known) return known;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(API + pin, { signal: controller.signal });
    if (!res.ok) return { status: "unavailable" };
    const outcome = parsePincodeResponse(await res.json());
    cache.set(pin, outcome);
    return outcome;
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}
