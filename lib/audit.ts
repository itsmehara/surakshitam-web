/**
 * Activity / audit log (prototype).
 *
 * Records a lightweight, privacy-conscious event stream in localStorage so the
 * admin can see who is active, which pages are viewed, and what guests are
 * interested in. A random, non-identifying `visitorId` groups anonymous
 * activity per browser.
 *
 * PRODUCTION: send these events to a real analytics/audit sink (PostHog, GA4,
 * or a Supabase `audit_log` table) behind cookie consent (DPDP Act / GDPR).
 * Never store PII you don't need; anonymise IPs; honour opt-out.
 */

export type AuditType =
  | "page_view"
  | "login"
  | "logout"
  | "cart_add"
  | "cart_remove"
  | "order_placed"
  | "order_status_changed"
  | "payment_failed"
  | "profile_update"
  | "report_export"
  | "team_update"
  | "unauthorized_access";

export interface AuditActor {
  kind: "customer" | "admin" | "guest";
  id?: string; // mobile / username — omitted for guests
  name?: string;
}

export interface AuditEvent {
  id: string;
  ts: string;
  type: AuditType;
  actor: AuditActor;
  visitorId: string;
  path?: string;
  productId?: string;
  productName?: string;
  qty?: number;
  meta?: Record<string, string | number>;
  userAgent: string;
}

const KEY = "sn-audit-v1";
const VKEY = "sn-visitor-v1";
const CAP = 1000;

/** Stable anonymous id for this browser (not tied to identity). */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let v = localStorage.getItem(VKEY);
    if (!v) {
      v = `v_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
      localStorage.setItem(VKEY, v);
    }
    return v;
  } catch {
    return "unknown";
  }
}

function read(): AuditEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as AuditEvent[];
  } catch {
    return [];
  }
}

function write(list: AuditEvent[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, CAP)));
  } catch {
    /* ignore */
  }
}

export function logEvent(
  input: Omit<AuditEvent, "id" | "ts" | "visitorId" | "userAgent">,
): void {
  if (typeof window === "undefined") return;
  const evt: AuditEvent = {
    ...input,
    id: `ev_${Math.random().toString(36).slice(2, 10)}`,
    ts: new Date().toISOString(),
    visitorId: getVisitorId(),
    userAgent: navigator.userAgent,
  };
  const all = read();
  all.unshift(evt);
  write(all);
}

export function getAuditEvents(): AuditEvent[] {
  return read();
}

export function clearAudit(): void {
  write([]);
}

/**
 * Low-level bulk insert used only by the demo activity seeder (see
 * `lib/demo-seed.ts`) — lets it write fully-formed events (own timestamp,
 * visitorId, actor) to simulate multiple visitors/days, which `logEvent()`
 * can't do since it always stamps "now" and the current browser's visitor id.
 * Merges with existing events and re-sorts newest-first.
 */
export function seedEvents(events: AuditEvent[]): void {
  const all = [...events, ...read()].sort((a, b) => (a.ts < b.ts ? 1 : -1));
  write(all);
}

/* --------------------------- browser helper --------------------------- */

/** Very small UA → friendly browser/OS label (no fingerprinting). */
export function describeBrowser(ua: string): string {
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Safari\//.test(ua)
        ? "Safari"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : "Browser";
  const os = /iPhone|iPad|iOS/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Mac OS X/.test(ua)
        ? "macOS"
        : /Windows/.test(ua)
          ? "Windows"
          : /Linux/.test(ua)
            ? "Linux"
            : "";
  const mobile = /Mobile|Android|iPhone/.test(ua) ? " · mobile" : " · desktop";
  return `${browser}${os ? " / " + os : ""}${mobile}`;
}
