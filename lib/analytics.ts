/**
 * Google Analytics 4 (property "Surakshitam Naturals", stream "Surakshitam Naturals – Website").
 * The tag loads only on the live domain (see <Analytics>), so local dev and previews
 * don't count as visits. Page views on client-side navigation come from GA4's enhanced
 * measurement ("page changes based on browser history events"), so no router hook is needed.
 * Never send personal data (names, phones, addresses) in event params.
 */
export const GA_ID = "G-P592VPVNKJ";

const LIVE_HOSTS = ["www.surakshitamnaturals.com", "surakshitamnaturals.com"];

export function isLiveHost(): boolean {
  return typeof window !== "undefined" && LIVE_HOSTS.includes(window.location.hostname);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire a GA4 event; a no-op off the live domain or before the tag has loaded. */
export function gaEvent(name: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
