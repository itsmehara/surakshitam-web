/** Mock admin auth for the prototype (localStorage session). Replace with real
 *  role-based auth (Supabase) in production — never ship these demo credentials.
 *
 *  Admin accounts are branded per founder (not a generic "admin@…") so the audit
 *  log and greetings show who acted. The admin area also lives at a non-obvious
 *  base path (see ADMIN_BASE) rather than the easily-guessed "/admin".
 */

import { logEvent } from "./audit";

const KEY = "sn-admin-v1";
const TEAM_KEY = "sn-admin-team-v1";

/** Base path for the admin/back-office area. Change here to rename the URL
 *  (also rename the matching folder under app/). */
export const ADMIN_BASE = "/studio";

export interface AdminAccount {
  username: string;
  name: string;
  password: string;
}

/** Seed founder accounts. In production these live in Supabase Auth with the `admin` role. */
const SEED_ADMIN_ACCOUNTS: AdminAccount[] = [
  { username: "srikanthnaturals", name: "Srikanth", password: "demo123" },
  { username: "supriyanaturals", name: "Supriya", password: "demo123" },
];

export interface AdminSession {
  username: string;
  name: string;
}

/**
 * Editable admin roster (prototype). The seed founders above are the
 * baseline; any founder signed in to `/studio/team` can add, edit or remove
 * admin accounts on top of that seed — mirrors the `catalog-store.ts`
 * overrides/removed pattern used for products. Any signed-in founder can
 * manage the whole team (no separate "super admin" role in this prototype —
 * Srikanth and Supriya are equal co-founders).
 */
interface TeamState {
  /** Full AdminAccount objects keyed by lowercase username — edited seed accounts AND new ones. */
  overrides: Record<string, AdminAccount>;
  /** Lowercase usernames removed from the team (seed accounts are disabled, not deleted). */
  removed: string[];
}

function readTeam(): TeamState {
  if (typeof window === "undefined") return { overrides: {}, removed: [] };
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) return { overrides: {}, removed: [] };
    const parsed = JSON.parse(raw) as Partial<TeamState>;
    return { overrides: parsed.overrides ?? {}, removed: parsed.removed ?? [] };
  } catch {
    return { overrides: {}, removed: [] };
  }
}

function writeTeam(state: TeamState) {
  try {
    localStorage.setItem(TEAM_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** All active admin accounts: seed + overrides, minus removed. */
export function getAdminAccounts(): AdminAccount[] {
  const { overrides, removed } = readTeam();
  const map = new Map<string, AdminAccount>();
  for (const a of SEED_ADMIN_ACCOUNTS) map.set(a.username.toLowerCase(), a);
  for (const [key, a] of Object.entries(overrides)) map.set(key, a);
  for (const key of removed) map.delete(key);
  return [...map.values()];
}

export function isSeedAdmin(username: string): boolean {
  return SEED_ADMIN_ACCOUNTS.some((a) => a.username.toLowerCase() === username.toLowerCase());
}

/**
 * Create or update an admin account. `originalUsername` is required when
 * renaming an existing account's username (rare — usually only name/password
 * change). Returns an error message on failure, or null on success.
 */
export function saveAdminAccount(account: AdminAccount, originalUsername?: string): string | null {
  const username = account.username.trim();
  if (!username) return "Username is required.";
  if (!account.name.trim()) return "Name is required.";
  if (!account.password || account.password.length < 4) return "Password must be at least 4 characters.";

  const key = username.toLowerCase();
  const origKey = (originalUsername ?? username).toLowerCase();
  const existing = getAdminAccounts();
  const clash = existing.find((a) => a.username.toLowerCase() === key && key !== origKey);
  if (clash) return "That username is already in use.";

  const state = readTeam();
  if (origKey !== key) {
    // Renaming: drop the old override key (or mark the old seed username removed).
    delete state.overrides[origKey];
    if (isSeedAdmin(origKey) && !state.removed.includes(origKey)) state.removed.push(origKey);
  }
  state.overrides[key] = { username, name: account.name.trim(), password: account.password };
  state.removed = state.removed.filter((r) => r !== key);
  writeTeam(state);

  const actor = getAdminSession();
  logEvent({
    type: "team_update",
    actor: { kind: "admin", name: actor?.name },
    meta: { action: originalUsername ? "Edited" : "Added", target: account.name.trim() },
  });
  return null;
}

/** Remove an admin account (seed accounts are disabled, not deleted — mirrors product Hide). */
export function removeAdminAccount(username: string): string | null {
  const key = username.trim().toLowerCase();
  const accounts = getAdminAccounts();
  if (accounts.length <= 1) return "At least one admin account must remain.";
  const current = getAdminSession();
  if (current && current.username.toLowerCase() === key) {
    return "You can't remove the account you're currently signed in as.";
  }
  const target = accounts.find((a) => a.username.toLowerCase() === key);
  const state = readTeam();
  delete state.overrides[key];
  if (!state.removed.includes(key)) state.removed.push(key);
  writeTeam(state);

  const actor = getAdminSession();
  logEvent({
    type: "team_update",
    actor: { kind: "admin", name: actor?.name },
    meta: { action: "Removed", target: target?.name ?? username },
  });
  return null;
}

/**
 * Reads the admin session, verifying it against a real, currently-active
 * admin account.
 *
 * Only a `{username, name}` object whose `username` matches an entry in
 * `getAdminAccounts()` is accepted. Anything else (stale/legacy values,
 * garbage, a bare truthy flag, or an account that's since been removed) is
 * treated as NOT signed in and the bad key is cleared — previously any
 * non-empty value here granted a generic "Admin" session, which both
 * mislabelled the audit log and could let a stale localStorage value bypass
 * the customer→404 gate on `/studio`.
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "username" in parsed) {
      const { username } = parsed as AdminSession;
      const acc = getAdminAccounts().find((a) => a.username.toLowerCase() === String(username).toLowerCase());
      if (acc) return { username: acc.username, name: acc.name };
    }
    // Not a valid, matching admin session — clear it rather than trusting it.
    localStorage.removeItem(KEY);
    return null;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  return getAdminSession() !== null;
}

export function loginAdmin(username: string, password: string): boolean {
  const u = username.trim().toLowerCase();
  const acc = getAdminAccounts().find((a) => a.username.toLowerCase() === u && a.password === password);
  if (!acc) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify({ username: acc.username, name: acc.name }));
  } catch {
    /* ignore */
  }
  return true;
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
