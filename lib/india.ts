/**
 * India-specific delivery helpers for checkout (Supriya/Srikanth, 19 Sep 2026):
 * Hyderabad orders go by local delivery (by hand when nearby, else Porter /
 * Uber-type services), the rest of India by courier — the founders pick the
 * service per order, by pincode. The site never names a service. So the customer picks a State, types
 * the City, and the pincode must be a real Indian one.
 */

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union territories
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi",
  "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

export const isIndianState = (v: string): v is IndianState => (INDIAN_STATES as readonly string[]).includes(v);

/** Six digits, first digit 1–9 (0 is not a postal zone). */
export const isIndianPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());

/**
 * Postal zone → state, by the first two (sometimes three) digits. Good enough
 * to pre-select the State dropdown; the customer can still change it, so a
 * boundary district that maps wrong costs one tap. Zones 90–99 are Army
 * Postal Service and map to nothing.
 */
const PREFIX_STATE: [string, IndianState][] = [
  ["11", "Delhi"], ["12", "Haryana"], ["13", "Haryana"], ["140", "Punjab"], ["141", "Punjab"], ["142", "Punjab"],
  ["143", "Punjab"], ["144", "Punjab"], ["145", "Punjab"], ["146", "Punjab"], ["147", "Punjab"], ["148", "Punjab"],
  ["149", "Punjab"], ["15", "Punjab"], ["160", "Chandigarh"], ["16", "Punjab"], ["17", "Himachal Pradesh"],
  ["18", "Jammu & Kashmir"], ["194", "Ladakh"], ["19", "Jammu & Kashmir"],
  ["20", "Uttar Pradesh"], ["21", "Uttar Pradesh"], ["22", "Uttar Pradesh"], ["23", "Uttar Pradesh"],
  ["244", "Uttar Pradesh"], ["245", "Uttar Pradesh"], ["24", "Uttarakhand"], ["25", "Uttar Pradesh"],
  ["26", "Uttar Pradesh"], ["27", "Uttar Pradesh"], ["28", "Uttar Pradesh"],
  ["30", "Rajasthan"], ["31", "Rajasthan"], ["32", "Rajasthan"], ["33", "Rajasthan"], ["34", "Rajasthan"],
  ["36", "Gujarat"], ["37", "Gujarat"], ["38", "Gujarat"], ["396", "Dadra & Nagar Haveli and Daman & Diu"], ["39", "Gujarat"],
  ["403", "Goa"], ["40", "Maharashtra"], ["41", "Maharashtra"], ["42", "Maharashtra"], ["43", "Maharashtra"], ["44", "Maharashtra"],
  ["45", "Madhya Pradesh"], ["46", "Madhya Pradesh"], ["47", "Madhya Pradesh"], ["48", "Madhya Pradesh"], ["49", "Chhattisgarh"],
  ["50", "Telangana"], ["51", "Andhra Pradesh"], ["52", "Andhra Pradesh"], ["53", "Andhra Pradesh"],
  ["56", "Karnataka"], ["57", "Karnataka"], ["58", "Karnataka"], ["59", "Karnataka"],
  ["605", "Puducherry"], ["60", "Tamil Nadu"], ["61", "Tamil Nadu"], ["62", "Tamil Nadu"], ["63", "Tamil Nadu"], ["64", "Tamil Nadu"],
  ["67", "Kerala"], ["682", "Lakshadweep"], ["68", "Kerala"], ["69", "Kerala"],
  ["744", "Andaman & Nicobar Islands"], ["70", "West Bengal"], ["71", "West Bengal"], ["72", "West Bengal"], ["73", "West Bengal"], ["74", "West Bengal"],
  ["737", "Sikkim"], ["75", "Odisha"], ["76", "Odisha"], ["77", "Odisha"], ["78", "Assam"],
  ["790", "Arunachal Pradesh"], ["791", "Arunachal Pradesh"], ["792", "Arunachal Pradesh"], ["793", "Meghalaya"], ["794", "Meghalaya"],
  ["795", "Manipur"], ["796", "Mizoram"], ["797", "Nagaland"], ["798", "Nagaland"], ["799", "Tripura"],
  ["80", "Bihar"], ["81", "Jharkhand"], ["82", "Jharkhand"], ["83", "Jharkhand"], ["84", "Bihar"], ["85", "Bihar"],
];

export function stateFromPincode(pin: string): IndianState | undefined {
  const p = pin.trim();
  if (p.length < 2) return undefined;
  // Longest prefix first so 160 (Chandigarh) beats 16 (Punjab), 403 (Goa) beats 40.
  const hit = PREFIX_STATE.filter(([pre]) => p.startsWith(pre)).sort((a, b) => b[0].length - a[0].length)[0];
  return hit?.[1];
}

export type DeliveryZone = "hyderabad" | "telangana-andhra" | "india" | "unknown";

/** Hyderabad = 500xxx (GHMC) — local delivery; 501xxx is the outskirts and goes by courier like the rest. */
export function deliveryZone(pin: string): DeliveryZone {
  const p = pin.trim();
  if (!isIndianPincode(p)) return "unknown";
  if (p.startsWith("500")) return "hyderabad";
  const st = stateFromPincode(p);
  if (st === "Telangana" || st === "Andhra Pradesh") return "telangana-andhra";
  return "india";
}

/** The one line under the Pincode field. */
export function deliveryHint(pin: string): string {
  switch (deliveryZone(pin)) {
    case "hyderabad":
      return "Hyderabad — local delivery. Charges, if any, confirmed on WhatsApp.";
    case "telangana-andhra":
      return "Telangana / Andhra — sent by courier; charges confirmed on WhatsApp.";
    case "india":
      return "Sent by courier anywhere in India; charges confirmed on WhatsApp.";
    default:
      return "We deliver across India — Hyderabad by local delivery, elsewhere by courier. Charges confirmed on WhatsApp.";
  }
}
