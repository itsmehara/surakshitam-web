/**
 * Customer authentication (prototype).
 *
 * Accounts live in the registry in `users.ts` — any number of customers can
 * register. Three entry points, all landing on the customer's profile:
 *   1. Register        — name + mobile (+ optional email/password)
 *   2. Mobile + OTP    — the standard Indian D2C pattern (demo OTP: 1234).
 *                        An unknown mobile registers on the spot if a name is given.
 *   3. Mobile/email + password — for customers who set one
 *
 * The session lives in localStorage. PRODUCTION: replace with Supabase Auth
 * (phone-OTP and email/password natively). The `getSession / login* /
 * register / logout` surface stays the same; only the implementation changes.
 */

import { logEvent } from "./audit";
import {
  findAccount,
  getAccount,
  registerAccount,
  hasPassword,
  setPassword,
  verifyPassword,
  normalizeId,
  prettyMobile,
  type CustomerAccount,
  type RegisterInput,
} from "./users";

export { normalizeId } from "./users";

export interface CustomerSession {
  /** Stable user id — the 10-digit mobile number. Orders & profile key off this. */
  id: string;
  mobile: string;
  name: string;
  email?: string;
  method: "otp" | "password" | "register";
  loggedInAt: string;
}

export type AuthResult = { ok: true } | { ok: false; error: string };

const KEY = "sn-auth-v1";
export const DEMO_OTP = "1234";

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

function startSession(a: CustomerAccount, method: CustomerSession["method"]) {
  const s: CustomerSession = {
    id: a.id,
    mobile: a.mobile,
    name: a.name,
    email: a.email || undefined,
    method,
    loggedInAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  logEvent({
    type: method === "register" ? "register" : "login",
    actor: { kind: "customer", id: s.id, name: s.name },
    meta: { method },
  });
}

/* ------------------------------ Registration ----------------------------- */

/** Creates the account and signs the new customer in. */
export function register(input: RegisterInput): AuthResult {
  const r = registerAccount(input);
  if (!r.ok) return r;
  startSession(r.account, "register");
  return { ok: true };
}

/* ------------------------------- OTP flow ------------------------------- */

/** "Send" an OTP. Prototype no-op that returns the demo code. */
export function requestOtp(_mobile: string): { demoOtp: string } {
  return { demoOtp: DEMO_OTP };
}

/** True if this mobile already has an account (used to decide whether to ask for a name). */
export function isRegisteredMobile(mobile: string): boolean {
  return getAccount(normalizeId(mobile)) !== null;
}

/**
 * Verify OTP and start a session. A mobile that isn't registered yet is
 * registered on the spot when a name is supplied — the usual D2C behaviour.
 */
export function loginWithOtp(mobile: string, otp: string, name?: string): AuthResult {
  if (!/^\d{4,6}$/.test(otp.trim())) return { ok: false, error: "Enter the 4–6 digit code." };
  const id = normalizeId(mobile);
  const existing = getAccount(id);
  if (existing) {
    startSession(existing, "otp");
    return { ok: true };
  }
  if (!name?.trim()) {
    return { ok: false, error: "This number isn't registered yet — go back and add your name to create an account." };
  }
  const r = registerAccount({ name, mobile: id });
  if (!r.ok) return r;
  startSession(r.account, "register");
  return { ok: true };
}

/* ---------------------------- Password flow ---------------------------- */

/** Verify mobile/email/username + password against the account registry. */
export function loginWithPassword(username: string, password: string): AuthResult {
  const account = findAccount(username);
  if (!account) return { ok: false, error: "No account found for that mobile, email or username." };
  if (!account.password) {
    return { ok: false, error: `No password set for ${prettyMobile(account.id)} — sign in with OTP, then set one under Account › Security.` };
  }
  if (!verifyPassword(account, password)) return { ok: false, error: "Incorrect password." };
  startSession(account, "password");
  return { ok: true };
}

/** True once the signed-in customer has a password. */
export function hasCustomerPassword(): boolean {
  const s = getSession();
  return !!s && hasPassword(s.id);
}

/** Sets (or changes) the signed-in customer's password. */
export function setCustomerPassword(newPassword: string): void {
  const s = getSession();
  if (!s) return;
  setPassword(s.id, newPassword);
  logEvent({
    type: "profile_update",
    actor: { kind: "customer", id: s.id, name: s.name },
    meta: { field: "password" },
  });
}

export function verifyCustomerPassword(password: string): boolean {
  const s = getSession();
  const a = s ? getAccount(s.id) : null;
  return !!a && verifyPassword(a, password);
}

/**
 * Updates the live session's identity fields (name/email) after a profile
 * edit, so the header and anywhere else reading `useAuth().user` reflect the
 * change immediately.
 */
export function updateSessionIdentity(patch: { name?: string; email?: string }): void {
  const s = getSession();
  if (!s) return;
  const next: CustomerSession = {
    ...s,
    name: patch.name?.trim() || s.name,
    email: patch.email?.trim() || s.email,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
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
