/**
 * Enquiry form → Google Apps Script → Google Sheet "Enquiries".
 * Script source: ../surakshitam-docs/tools/apps-script/Code.gs
 *
 * NEXT_PUBLIC_ENQUIRY_URL is inlined at build time (static export), so set it
 * in .env.local for dev and in the GitHub Pages build env for production.
 */

export type EnquiryFields = {
  name: string;
  phone: string;
  email?: string;
  product?: string;
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

// ---------- WhatsApp click tracking ----------

/** Decided 14 Sep: pre-filled WhatsApp text. Generic when no product is given. */
export function whatsAppHref(product?: string): string {
  const number = "917416394594";
  const text = product
    ? `Hi Surakshitam Naturals, I'm interested in ${product}. Please share price and availability.`
    : "Hi Surakshitam Naturals, I'd like to know more about your products.";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

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
