/** Mock admin auth for the prototype (localStorage session). Replace with real
 *  role-based auth (Supabase) in production — never ship these demo credentials.
 *
 *  Admin accounts are branded per founder (not a generic "admin@…") so the audit
 *  log and greetings show who acted. The admin area also lives at a non-obvious
 *  base path (see ADMIN_BASE) rather than the easily-guessed "/admin".
 */

const KEY = "sn-admin-v1";

/** Base path for the admin/back-office area. Change here to rename the URL
 *  (also rename the matching folder under app/). */
export const ADMIN_BASE = "/studio";

export interface AdminAccount {
  username: string;
  name: string;
  password: string;
}

/** Founder accounts. In production these live in Supabase Auth with the `admin` role. */
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  { username: "srikanthnaturals", name: "Srikanth", password: "demo123" },
  { username: "supriyanaturals", name: "Supriya", password: "demo123" },
];

export interface AdminSession {
  username: string;
  name: string;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "username" in parsed) {
      return parsed as AdminSession;
    }
    // Legacy flag ("1") — treat as a signed-in generic admin.
    return { username: "admin", name: "Admin" };
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  return getAdminSession() !== null;
}

export function loginAdmin(username: string, password: string): boolean {
  const u = username.trim().toLowerCase();
  const acc = ADMIN_ACCOUNTS.find((a) => a.username.toLowerCase() === u && a.password === password);
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
