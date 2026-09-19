/**
 * Orders — the cart's WhatsApp message, the checkout details and the Orders
 * tab in the Google Sheet (PRODUCT-CATALOG-NOTES-2026-09-19 §7.2 / §7.3).
 *
 * WhatsApp is the order channel; the Sheet is the record. The message carries
 * the full order *including delivery details*, so nothing is lost if the
 * Sheet save fails. Kept free of React so the drawer, checkout and order-sent
 * page all build the same text.
 */

import type { CartLine } from "@/lib/cart/CartContext";
import { ENQUIRY_URL } from "@/lib/enquiry";
import { isIndianPincode, isIndianState } from "@/lib/india";

const WA_NUMBER = "917416394594";
const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ---------- lines + subtotal ----------

/** `Herbal Shampoo — 500 ml × 2 — ₹1,100`, or `— price on request`. */
export function formatOrderLines(lines: CartLine[]): string {
  return lines
    .map((l, i) => {
      const amount = l.size.mrp == null ? "price on request" : rupees(l.size.mrp * l.qty);
      return `${i + 1}. ${l.product.name} — ${l.size.label} × ${l.qty} — ${amount}`;
    })
    .join("\n");
}

export function orderSubtotal(lines: CartLine[]): { subtotal: number; hasPriceOnRequest: boolean } {
  return {
    subtotal: lines.reduce((sum, l) => sum + (l.size.mrp ?? 0) * l.qty, 0),
    hasPriceOnRequest: lines.some((l) => l.size.mrp == null),
  };
}

export function formatSubtotal(lines: CartLine[]): string {
  const { subtotal, hasPriceOnRequest } = orderSubtotal(lines);
  return `Subtotal: ${rupees(subtotal)} (MRP, incl. taxes)${hasPriceOnRequest ? " + items priced on request" : ""}`;
}

// ---------- customer details ----------

export type Customer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  /** One of INDIAN_STATES (lib/india.ts) — the founders pick the courier by where it goes. */
  state: string;
  pincode: string;
  email: string;
};

export const EMPTY_CUSTOMER: Customer = { name: "", phone: "", address: "", city: "", state: "", pincode: "", email: "" };

const CUSTOMER_KEY = "sn-customer-v1";

/** Details remembered on this device for the next order (never sent anywhere else). */
export function loadCustomer(): Customer | null {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Customer>;
    const pick = (k: keyof Customer) => (typeof c[k] === "string" ? (c[k] as string) : "");
    return { name: pick("name"), phone: pick("phone"), address: pick("address"), city: pick("city"), state: pick("state"), pincode: pick("pincode"), email: pick("email") };
  } catch {
    return null;
  }
}

export function saveCustomer(c: Customer): void {
  try {
    window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c));
  } catch {
    /* private mode — fine */
  }
}

export function clearCustomer(): void {
  try {
    window.localStorage.removeItem(CUSTOMER_KEY);
  } catch {
    /* ignore */
  }
}

/** Indian mobile: 10 digits starting 6–9, with an optional +91 / 0 prefix. Returns the 10 digits or null. */
export function normalisePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export type CustomerErrors = Partial<Record<keyof Customer, string>>;

/** Field rules from the spec (§7.3). Empty object = valid. */
export function validateCustomer(c: Customer): CustomerErrors {
  const e: CustomerErrors = {};
  const name = c.name.trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 60) e.name = "Name is too long (60 characters max).";
  if (!normalisePhone(c.phone)) e.phone = "Enter a 10-digit Indian mobile number.";
  const address = c.address.trim();
  if (address.length < 8) e.address = "Please enter the full delivery address.";
  else if (address.length > 200) e.address = "Address is too long (200 characters max).";
  if (c.city.trim().length < 2) e.city = "Please enter your city or town.";
  if (!isIndianState(c.state)) e.state = "Please pick your state.";
  if (!isIndianPincode(c.pincode)) e.pincode = "Enter a valid 6-digit Indian pincode.";
  const email = c.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email doesn't look right.";
  return e;
}

// ---------- payment (optional, at order time) ----------

/**
 * Most customers pay on WhatsApp *after* the founders confirm. A repeat
 * customer who has already paid by UPI can say so and give the transaction
 * reference, so the founders can match it in the Sheet. Never auto-marks the
 * order Paid — the founders verify and change Status themselves.
 */
export type Payment = { paid: boolean; ref: string };
export const NO_PAYMENT: Payment = { paid: false, ref: "" };

/** UPI transaction IDs / UTRs are 12–22 alphanumerics; allow a little slack either side. */
export function validatePayment(p: Payment): string | undefined {
  if (!p.paid) return undefined;
  const ref = p.ref.trim();
  if (ref.length < 6 || ref.length > 40 || !/^[A-Za-z0-9 -]+$/.test(ref)) return "Paste the UPI transaction ID / UTR (6–40 letters or digits).";
  return undefined;
}

export function formatPayment(p: Payment): string {
  return p.paid ? `Payment: already paid by UPI — ref ${p.ref.trim()}` : "Payment: on WhatsApp once you confirm";
}

// ---------- order ----------

/** `SN-260920-4K7Q` — date + 4 chars from an alphabet with no 0/O/1/I, generated on the device. */
export function newOrderId(now = new Date()): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 4; i++) bytes[i] = Math.floor(Math.random() * 256);
  const tail = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `SN-${yy}${mm}${dd}-${tail}`;
}

/** Deliver-to block as it appears in the WhatsApp message and the alert email. */
export function formatDeliverTo(c: Customer): string {
  const phone = normalisePhone(c.phone) ?? c.phone.trim();
  const pretty = phone.length === 10 ? `${phone.slice(0, 5)} ${phone.slice(5)}` : phone;
  return [
    `${c.name.trim()} · ${pretty}`,
    c.address.trim(),
    `${c.city.trim()}, ${c.state.trim()} — ${c.pincode.trim()}`,
    c.email.trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

/** The full order message — starts with the order ID, ends with the delivery details (§7.3). */
export function orderMessage(
  orderId: string,
  lines: CartLine[],
  customer: Customer,
  note?: string,
  payment: Payment = NO_PAYMENT,
): string {
  const trimmed = note?.trim();
  return (
    `Order ${orderId} — Surakshitam Naturals\n\n` +
    formatOrderLines(lines) +
    `\n${formatSubtotal(lines)}` +
    `\n${formatPayment(payment)}` +
    (trimmed ? `\n\nNote: ${trimmed}` : "") +
    `\n\nDeliver to:\n${formatDeliverTo(customer)}`
  );
}

export const whatsAppOrderHref = (message: string) => waLink(message);

export type OrderResult = { ok: true } | { ok: false; error: string };

/**
 * Save the order to the Orders tab (Apps Script `kind: "order"`). Same simple
 * text/plain POST as the enquiry form. `keepalive` so a client-side navigation
 * to /order-sent/ never cancels it.
 */
export async function submitOrder(input: {
  orderId: string;
  lines: CartLine[];
  customer: Customer;
  note: string;
  payment?: Payment;
  website?: string;
}): Promise<OrderResult> {
  if (!ENQUIRY_URL) return { ok: false, error: "Order service is not configured (NEXT_PUBLIC_ENQUIRY_URL)." };
  const { subtotal, hasPriceOnRequest } = orderSubtotal(input.lines);
  const c = input.customer;
  const payload = {
    kind: "order",
    orderId: input.orderId,
    name: c.name.trim(),
    phone: normalisePhone(c.phone) ?? c.phone.trim(),
    email: c.email.trim(),
    address: c.address.trim(),
    city: c.city.trim(),
    state: c.state.trim(),
    pincode: c.pincode.trim(),
    items: formatOrderLines(input.lines),
    subtotal,
    priceOnRequest: hasPriceOnRequest,
    note: input.note.trim(),
    paid: !!input.payment?.paid,
    paymentRef: input.payment?.paid ? input.payment.ref.trim() : "",
    website: input.website ?? "",
    page: typeof window !== "undefined" ? window.location.href : "",
    ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
  try {
    const res = await fetch(ENQUIRY_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      keepalive: true,
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    try {
      const data = JSON.parse(text) as OrderResult;
      return data.ok ? { ok: true } : { ok: false, error: data.error || "Something went wrong." };
    } catch {
      return { ok: false, error: `Unexpected response: ${text.slice(0, 200)}` };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------- hand-off to /order-sent/ ----------

export type SentOrder = {
  orderId: string;
  message: string;
  href: string;
  /** Sheet save: pending while the POST is in flight. */
  sheet: "pending" | "ok" | "failed";
  at: number;
};

const SENT_KEY = "sn-last-order";
export const SENT_EVENT = "sn-order-sent";

/** sessionStorage so a reload of /order-sent/ still has the message to copy or re-open. */
export function rememberSentOrder(o: SentOrder): void {
  try {
    window.sessionStorage.setItem(SENT_KEY, JSON.stringify(o));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(SENT_EVENT));
}

export function readSentOrder(): SentOrder | null {
  try {
    const raw = window.sessionStorage.getItem(SENT_KEY);
    return raw ? (JSON.parse(raw) as SentOrder) : null;
  } catch {
    return null;
  }
}
