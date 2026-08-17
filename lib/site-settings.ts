/**
 * Small admin-controlled site toggles that don't warrant their own settings page. Persisted to
 * localStorage like everything else in this prototype. Each flag defaults to enabled when the
 * key has never been set, so a fresh browser/demo always starts in the "on" state.
 */
const OFFERS_NAV_KEY = "sn-offers-nav-enabled-v1";

export function isOffersNavEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(OFFERS_NAV_KEY);
    return raw === null ? true : raw === "true";
  } catch {
    return true;
  }
}

export function setOffersNavEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(OFFERS_NAV_KEY, String(enabled));
  } catch {
    /* ignore */
  }
}
