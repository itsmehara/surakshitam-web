/**
 * Customer authentication (prototype).
 *
 * Two sign-in methods, both landing on the customer's profile:
 *   1. Mobile + OTP   — the standard Indian D2C pattern (demo OTP: 1234)
 *   2. Username/email + password — demo account seeded below
 *
 * Session + a tiny demo credential store live in localStorage so the flow is
 * self-contained. PRODUCTION: replace with Supabase Auth (it supports BOTH
 * phone-OTP and email/password natively). The `getSession / login* / logout`
 * surface stays the same; only the implementation behind it changes.
 */

import { getProfile, saveProfile } from "./profile";
import { logEvent } from "./audit";

export interface CustomerSession {
  /** Stable user id — the 10-digit mobile number. Orders & profile key off this. */
  id: string;
  mobile: string;
  name: string;
  email?: string;
  method: "otp" | "password";
  loggedInAt: string;
}

const KEY = "sn-auth-v1";
export const DEMO_OTP = "1234";

/** Demo password accounts. In production these live in Supabase Auth. */
interface DemoCredential {
  usernames: string[]; // any of these + password works
  password: string;
  mobile: string;
  name: string;
  email?: string;
}
const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    usernames: ["bhavesh", "9849116181", "srikanth.alapati@yahoo.com"],
    password: "demo123",
    mobile: "9849116181",
    name: "Bhavesh Allapati",
    email: "srikanth.alapati@yahoo.com",
  },
];

/** Last 10 digits — our canonical user id form. */
export function normalizeId(mobileOrId: string): string {
  const d = mobileOrId.replace(/\D/g, "");
  return d.slice(-10) || mobileOrId.trim();
}

function prettyMobile(id: string): string {
  const d = id.replace(/\D/g, "").slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : id;
}

export function getSession(): CustomerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CustomerSession) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}

function startSession(s: CustomerSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  // Keep the editable profile in sync with the signed-in identity.
  const existing = getProfile();
  saveProfile({
    ...existing,
    name: s.name || existing.name,
    mobile: prettyMobile(s.id),
    email: s.email || existing.email,
  });
  logEvent({ type: "login", actor: { kind: "customer", id: s.id, name: s.name }, meta: { method: s.method } });
}

/* ------------------------------- OTP flow ------------------------------- */

/** "Send" an OTP. Prototype no-op that returns the demo code. */
export function requestOtp(_mobile: string): { demoOtp: string } {
  return { demoOtp: DEMO_OTP };
}

/** Verify OTP and start a session. Returns true on success. */
export function loginWithOtp(mobile: string, otp: string, name?: string): boolean {
  if (!/^\d{4,6}$/.test(otp.trim())) return false;
  const id = normalizeId(mobile);
  if (id.replace(/\D/g, "").length < 10) return false;
  const existing = getProfile();
  startSession({
    id,
    mobile: prettyMobile(id),
    name: (name?.trim() || existing.name || "").trim(),
    email: existing.email,
    method: "otp",
    loggedInAt: new Date().toISOString(),
  });
  return true;
}

/* ---------------------------- Password flow ---------------------------- */

/** Verify username/email + password against the demo credential store. */
export function loginWithPassword(username: string, password: string): boolean {
  const u = username.trim().toLowerCase();
  const match = DEMO_CREDENTIALS.find(
    (c) => c.password === password && c.usernames.some((x) => x.toLowerCase() === u),
  );
  if (!match) return false;
  startSession({
    id: normalizeId(match.mobile),
    mobile: prettyMobile(match.mobile),
    name: match.name,
    email: match.email,
    method: "password",
    loggedInAt: new Date().toISOString(),
  });
  return true;
}

export function logout(): void {
  const s = getSession();
  if (s) logEvent({ type: "logout", actor: { kind: "customer", id: s.id, name: s.name } });
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
