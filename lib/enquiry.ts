/**
 * Enquiry form → Google Apps Script → Google Sheet "Enquiries".
 * Script source: ../surakshitam-docs/tools/apps-script/Code.gs
 *
 * NEXT_PUBLIC_ENQUIRY_URL is inlined at build time (static export), so set it
 * in .env.local for dev and in the GitHub Pages build env for production.
 */

/** The three things the contact form is used for (ANSWERS-2026-09-14 + 15 Sep brief). */
export type EnquiryType = "product" | "partner" | "consultation";

export const ENQUIRY_TYPES: { value: EnquiryType; label: string; short: string }[] = [
  { value: "product", label: "Product enquiry", short: "Send Enquiry" },
  { value: "partner", label: "Promote your brand / partner with us", short: "Partner With Us" },
  { value: "consultation", label: "Book a free consultation (30 min)", short: "Book a Consultation" },
];

export function isEnquiryType(v: unknown): v is EnquiryType {
  return v === "product" || v === "partner" || v === "consultation";
}

export type EnquiryFields = {
  type: EnquiryType;
  name: string;
  phone: string;
  email?: string;
  /** Product enquiry: the product(s), one per line. */
  product?: string;
  /** Partner enquiry: brand / business name. */
  business?: string;
  /** Consultation: preferred day & time, free text. */
  slot?: string;
  message?: string;
  /** Honeypot — must stay empty. Bots that fill it are silently dropped. */
  website?: string;
};

export type EnquiryResult = { ok: true } | { ok: false; error: string };

export const ENQUIRY_URL = process.env.NEXT_PUBLIC_ENQUIRY_URL ?? "";

export async function submitEnquiry(fields: EnquiryFields): Promise<EnquiryResult> {
  if (!ENQUIRY_URL) return { ok: false, error: "Enquiry form is not configured (NEXT_PUBLIC_ENQUIRY_URL)." };

  const payload = {
    ...fields,
    page: typeof window !== "undefined" ? window.location.href : "",
    ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  try {
    const res = await fetch(ENQUIRY_URL, {
      method: "POST",
      // text/plain = "simple request": no CORS preflight, which Apps Script cannot answer.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    try {
      const data = JSON.parse(text) as EnquiryResult;
      return data.ok ? { ok: true } : { ok: false, error: data.error || "Something went wrong." };
    } catch {
      return { ok: false, error: `Unexpected response: ${text.slice(0, 200)}` };
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ---------- WhatsApp message builders ----------

const WA_NUMBER = "917416394594";

function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Decided 14 Sep: pre-filled WhatsApp text. Generic when no product is given. */
export function whatsAppHref(product?: string): string {
  return waLink(
    product
      ? `Hi Surakshitam Naturals, I'm interested in ${product}. Please share price and availability.`
      : "Hi Surakshitam Naturals, I'd like to know more about your products.",
  );
}

/** One line per product for the enquiry-list message and the form's product field. */
export function formatEnquiryLines(lines: { name: string; size?: string; qty: number }[]): string {
  return lines
    .map((l, i) => `${i + 1}. ${l.name}${l.size ? ` (${l.size})` : ""} × ${l.qty}`)
    .join("\n");
}

/**
 * The single WhatsApp message for the whole enquiry list — the reason the
 * list exists. Numbered so the founders can answer line by line; the optional
 * note is the customer's own words (delivery area, questions, preferences).
 * Exposed as text so the drawer can preview exactly what will be sent.
 */
export function enquiryListMessage(
  lines: { name: string; size?: string; qty: number }[],
  note?: string,
): string {
  const trimmed = note?.trim();
  return (
    "Hi Surakshitam Naturals, I'd like to enquire about these products:\n\n" +
    formatEnquiryLines(lines) +
    (trimmed ? `\n\nNote: ${trimmed}` : "") +
    "\n\nPlease share price, availability and delivery details."
  );
}

export function whatsAppListHref(
  lines: { name: string; size?: string; qty: number }[],
  note?: string,
): string {
  return waLink(enquiryListMessage(lines, note));
}

/**
 * Fallback for the contact form when the enquiry service is unreachable or
 * not configured — the same content, sent as a WhatsApp message instead, so
 * nobody types it all out twice.
 */
export function whatsAppFormFallbackHref(f: EnquiryFields): string {
  const label = ENQUIRY_TYPES.find((t) => t.value === f.type)?.label ?? "Enquiry";
  const parts = [`Hi Surakshitam Naturals — ${label}`, `Name: ${f.name}`, `Phone: ${f.phone}`];
  if (f.email) parts.push(`Email: ${f.email}`);
  if (f.business) parts.push(`Brand / business: ${f.business}`);
  if (f.slot) parts.push(`Preferred slot: ${f.slot}`);
  if (f.product) parts.push(`Products:\n${f.product}`);
  if (f.message) parts.push(`Message: ${f.message}`);
  return waLink(parts.join("\n"));
}

// ---------- WhatsApp click tracking ----------

/**
 * Fire-and-forget: logs a WhatsApp click to the "WhatsApp Clicks" tab.
 * Uses sendBeacon so the row is sent even though the page is navigating away.
 * Call it in onClick and let the <a> navigate normally.
 */
export function trackWhatsAppClick(opts: { product?: string; cta: string }): void {
  if (!ENQUIRY_URL || typeof window === "undefined") return;
  const body = JSON.stringify({
    event: "whatsapp_click",
    product: opts.product ?? "",
    cta: opts.cta,
    page: window.location.href,
    referrer: document.referrer,
    ua: navigator.userAgent,
  });
  try {
    // text/plain Blob keeps it a simple request (no preflight), same as submitEnquiry.
    if (navigator.sendBeacon?.(ENQUIRY_URL, new Blob([body], { type: "text/plain;charset=utf-8" }))) return;
  } catch {
    /* fall through */
  }
  fetch(ENQUIRY_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body,
    keepalive: true,
  }).catch(() => {});
}
