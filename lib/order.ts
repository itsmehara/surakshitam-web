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
import { payPrice } from "@/lib/catalog";
import { PROMO_WHEEL } from "@/lib/promo-wheel";
import { ENQUIRY_URL } from "@/lib/enquiry";
import { gaEvent } from "@/lib/analytics";
import { isIndianPincode, isIndianState } from "@/lib/india";
import { FREE_DELIVERY_OVER, OTHER_DELIVERY_PHONE, checkoutDelivery, deliveryAdded, deliveryMethodOf, formatWeight, type Delivery, type DeliveryMethod } from "@/lib/delivery";

const WA_NUMBER = "917416394594";
const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ---------- lines + subtotal ----------

/** `Herbal Shampoo — 500 ml × 2 — ₹1,100`, or `— price on request`. */
export function formatOrderLines(lines: CartLine[]): string {
  return lines
    .map((l, i) => {
      const price = payPrice(l.size);
      const amount = price == null ? "price on request" : rupees(price * l.qty);
      return `${i + 1}. ${l.product.name} — ${l.size.label} × ${l.qty} — ${amount}`;
    })
    .join("\n");
}

export function orderSubtotal(lines: CartLine[]): { subtotal: number; hasPriceOnRequest: boolean } {
  return {
    subtotal: lines.reduce((sum, l) => sum + (payPrice(l.size) ?? 0) * l.qty, 0),
    hasPriceOnRequest: lines.some((l) => payPrice(l.size) == null),
  };
}

/** Is the inaugural offer on today? (enabled, and not past `endsOn`, India time.) */
export function launchOfferActive(now: Date = new Date()): boolean {
  if (!PROMO_WHEEL.enabled || !(PROMO_WHEEL.discountPct > 0)) return false;
  if (!PROMO_WHEEL.endsOn) return true;
  const today = new Date(now.getTime() + 5.5 * 3600_000).toISOString().slice(0, 10);
  return today <= PROMO_WHEEL.endsOn;
}

/** The inaugural discount on a cart value, whole rupees, on top of pack offer rates. 0 when the offer is off. */
export function launchDiscount(cartValue: number): number {
  return launchOfferActive() ? Math.round((cartValue * PROMO_WHEEL.discountPct) / 100) : 0;
}

export function formatSubtotal(lines: CartLine[]): string {
  const { subtotal, hasPriceOnRequest } = orderSubtotal(lines);
  const d = launchDiscount(subtotal);
  return (
    `Subtotal: ${rupees(subtotal)} (incl. taxes)` +
    (d > 0 ? `\nInaugural offer ${PROMO_WHEEL.discountPct}% extra: −${rupees(d)}` : "") +
    (hasPriceOnRequest ? " + items priced on request" : "")
  );
}

export type OrderCharges = {
  /** Cart value before the inaugural discount. Delivery rules (free over ₹2,000) use this. */
  subtotal: number;
  /** Inaugural discount in rupees (0 when off). */
  discount: number;
  /** Subtotal less the inaugural discount: what the items cost. */
  payable: number;
  hasPriceOnRequest: boolean;
  /** How delivery is charged (lib/delivery.ts). The QR, the WhatsApp message and the payload all read this. */
  delivery: Delivery;
  /** Subtotal + what delivery adds. Rapido and free delivery add nothing. null while the courier charge is still to confirm. */
  total: number | null;
};

/** Subtotal, delivery and total for a cart and a customer's pincode, State and delivery method. The checkout, the WhatsApp message and the payload all use this. */
export function orderCharges(lines: CartLine[], c: Pick<Customer, "state" | "pincode" | "deliveryMethod">): OrderCharges {
  const { subtotal, hasPriceOnRequest } = orderSubtotal(lines);
  const delivery = checkoutDelivery(lines, { method: c.deliveryMethod, pincode: c.pincode, state: c.state }, subtotal);
  const added = deliveryAdded(delivery);
  const discount = launchDiscount(subtotal);
  const payable = subtotal - discount;
  return { subtotal, discount, payable, hasPriceOnRequest, delivery, total: added == null ? null : payable + added };
}

/** `Delivery: ₹170 by courier (3.4 kg)`, `Delivery: Rapido, fare paid to the rider`, or "to confirm on WhatsApp" while the courier charge is not known. */
export function formatDelivery(d: Delivery): string {
  switch (d.status) {
    case "free":
      return `Delivery: special delivery discount (order over ${rupees(FREE_DELIVERY_OVER)}, courier)`;
    case "rapido":
      return "Delivery: Rapido, fare paid to the rider";
    case "other":
      return `Delivery: Others, arranged on WhatsApp (${OTHER_DELIVERY_PHONE})`;
    case "courier":
      return `Delivery: ${rupees(d.charge)} by courier (${formatWeight(d.weightG)})`;
    default:
      return "Delivery: to confirm on WhatsApp";
  }
}

/** Short reason for the Orders tab when the delivery amount is 0 or unknown. */
function deliveryNoteOf(d: Delivery): string {
  if (d.status === "rapido") return "Rapido: customer pays the rider";
  if (d.status === "other") return "Others: arranged on WhatsApp";
  if (d.status === "free") return `Special discount: order over ${rupees(FREE_DELIVERY_OVER)}`;
  return "";
}

/** `Total: ₹1,220`, `Total: ₹1,100 + Rapido fare`, or `Total: ₹1,100 + delivery` while the courier charge is still to confirm. */
export function formatTotal(c: OrderCharges): string {
  const amount = c.total == null ? `${rupees(c.payable)} + delivery` : rupees(c.total);
  const rider = c.delivery.status === "rapido" ? " + Rapido fare (paid to the rider)" : "";
  return `Total: ${amount}${rider}${c.hasPriceOnRequest ? " + items priced on request" : ""}`;
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
  /** Post office picked from the pincode lookup (lib/pincode.ts). Optional; sent with the order. */
  postOffice: string;
  /** Courier, Rapido (Hyderabad pincodes only, checked at checkout) or Others (lib/delivery.ts). */
  deliveryMethod: DeliveryMethod;
  /** Google Maps link for the Rapido rider: shared location or pasted. Sent only with Rapido. */
  mapsLink: string;
};

const DELIVERY_METHODS: DeliveryMethod[] = ["courier", "rapido", "other"];

export const EMPTY_CUSTOMER: Customer = { name: "", phone: "", address: "", city: "", state: "", pincode: "", email: "", postOffice: "", deliveryMethod: "courier", mapsLink: "" };

const CUSTOMER_KEY = "sn-customer-v1";

/** Details remembered on this device for the next order (never sent anywhere else). */
export function loadCustomer(): Customer | null {
  try {
    const raw = window.localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Customer>;
    const pick = (k: keyof Customer) => (typeof c[k] === "string" ? (c[k] as string) : "");
    return {
      name: pick("name"),
      phone: pick("phone"),
      address: pick("address"),
      city: pick("city"),
      state: pick("state"),
      pincode: pick("pincode"),
      email: pick("email"),
      postOffice: pick("postOffice"),
      deliveryMethod: DELIVERY_METHODS.includes(c.deliveryMethod as DeliveryMethod) ? (c.deliveryMethod as DeliveryMethod) : "courier",
      mapsLink: pick("mapsLink"),
    };
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

const DRAFT_KEY = "sn-checkout-draft-v1";

/**
 * Checkout form in progress, kept for this tab only (sessionStorage). A UPI app
 * can make the phone browser reload the page on return, which would empty the
 * form (and hide the QR/Pay button until the State is chosen again) and change
 * the order ID in the UPI note.
 */
export function saveDraft(customer: Customer, orderId: string): void {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ customer, orderId }));
  } catch {
    /* private mode — fine */
  }
}

export function loadDraft(): { customer: Customer; orderId: string } | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as { customer?: Partial<Customer>; orderId?: unknown };
    const c = d.customer ?? {};
    const pick = (k: keyof Customer) => (typeof c[k] === "string" ? (c[k] as string) : "");
    if (typeof d.orderId !== "string" || !d.orderId) return null;
    return {
      orderId: d.orderId,
      customer: {
        name: pick("name"), phone: pick("phone"), address: pick("address"), city: pick("city"),
        state: pick("state"), pincode: pick("pincode"), email: pick("email"), postOffice: pick("postOffice"),
        deliveryMethod: DELIVERY_METHODS.includes(c.deliveryMethod as DeliveryMethod) ? (c.deliveryMethod as DeliveryMethod) : "courier",
        mapsLink: pick("mapsLink"),
      },
    };
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
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

/** A Google Maps link: google.com/maps…, maps.google.…, maps.app.goo.gl or goo.gl/maps. */
export const MAPS_LINK = /^https?:\/\/(?:www\.)?(?:google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i;

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
  const maps = c.mapsLink.trim();
  if (c.deliveryMethod === "rapido" && maps && !MAPS_LINK.test(maps)) e.mapsLink = "Paste a Google Maps link (use Share in Google Maps).";
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
export type PayMethod = "later" | "upi" | "cash";
/** `paid` is true only for "upi" (the one method that needs a transaction ID). */
export type Payment = { method: PayMethod; paid: boolean; ref: string };
export const NO_PAYMENT: Payment = { method: "later", paid: false, ref: "" };
/** Kept loose on purpose: UPI apps format IDs differently, so any note of 10+ characters is accepted. */
export function validatePayment(p: Payment): string | undefined {
  if (!p.paid) return undefined;
  const ref = p.ref.trim();
  if (ref.length < 10) return "Enter the UPI transaction ID / UTR, or a note (at least 10 characters).";
  return undefined;
}

export function formatPayment(p: Payment): string {
  if (p.method === "cash") return "Payment: cash";
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
    c.postOffice.trim() ? `Post office: ${c.postOffice.trim()}` : "",
    c.deliveryMethod === "rapido" && c.mapsLink.trim() ? `Map: ${c.mapsLink.trim()}` : "",
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
  const charges = orderCharges(lines, customer);
  return (
    `Order ${orderId} — Surakshitam Naturals\n\n` +
    formatOrderLines(lines) +
    `\n${formatSubtotal(lines)}` +
    `\n${formatDelivery(charges.delivery)}` +
    `\n${formatTotal(charges)}` +
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
  const charges = orderCharges(input.lines, input.customer);
  // GA4: order count and value only — no customer details. Value is the total; the subtotal while delivery is still to confirm.
  gaEvent("whatsapp_order", {
    order_id: input.orderId,
    value: charges.total ?? charges.payable,
    currency: "INR",
    items: input.lines.length,
    price_on_request: charges.hasPriceOnRequest,
    delivery_pending: charges.total == null,
  });
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
    postOffice: c.postOffice.trim(),
    items: formatOrderLines(input.lines),
    // `subtotal` is what the items cost after the inaugural discount, so the Sheet's Subtotal + Delivery = Total still holds.
    subtotal: charges.payable,
    cartValue: charges.subtotal,
    discount: charges.discount,
    delivery: deliveryAdded(charges.delivery),
    deliveryMethod: deliveryMethodOf(charges.delivery),
    deliveryNote: deliveryNoteOf(charges.delivery),
    total: charges.total,
    priceOnRequest: charges.hasPriceOnRequest,
    note: input.note.trim(),
    paid: !!input.payment?.paid,
    paymentMethod: input.payment?.method ?? "later",
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
  /** Customer ticked "already paid by UPI" at checkout. Optional, so an order stored before this field still reads. */
  paid?: boolean;
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
