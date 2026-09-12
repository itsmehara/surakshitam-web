/**
 * Customer account registry (prototype).
 *
 * Replaces the earlier "one fixed demo credential + one profile per browser"
 * setup with a real (if local) multi-user store: any number of customers can
 * register, each with their own profile, password and order history. Accounts
 * are keyed by the 10-digit mobile number, which stays the login/order id
 * everywhere else in the app.
 *
 * Persistence is localStorage (`sn-users-v1`). PRODUCTION: this whole file
 * becomes Supabase Auth (`auth.users`) + a `customers` profile table; the
 * function signatures below are the swap points. Passwords here are only
 * mock-obfuscated — never store real passwords client-side.
 */

export interface CustomerAccount {
  /** Stable id — the 10-digit mobile number. */
  id: string;
  /** Friendly account number shown to the customer, e.g. "SN-CU-00007". */
  customerId: string;
  name: string;
  /** Display form, e.g. "+91 98491 16181". */
  mobile: string;
  email: string;
  address: string;
  /** Optional login alias (seeded demo account only). */
  username?: string;
  /** Mock-obfuscated password; absent until the customer sets one. */
  password?: string;
  createdAt: string;
}

export interface RegisterInput {
  name: string;
  mobile: string;
  email?: string;
  password?: string;
  address?: string;
}

export type RegisterResult = { ok: true; account: CustomerAccount } | { ok: false; error: string };

const KEY = "sn-users-v1";
const SEQ_KEY = "sn-customer-seq-v1";
// Pre-registry stores, imported once so an existing demo browser keeps working.
const LEGACY_PROFILE_KEY = "sn-profile-v1";
const LEGACY_PW_KEY = "sn-customer-pw-v1";

/** Last 10 digits — our canonical user id form. */
export function normalizeId(mobileOrId: string): string {
  const d = mobileOrId.replace(/\D/g, "");
  return d.slice(-10) || mobileOrId.trim();
}

export function prettyMobile(id: string): string {
  const d = id.replace(/\D/g, "").slice(-10);
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : id;
}

export function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizeId(mobile));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Mock-only obfuscation for the demo password store — NOT a real hash and not
 * secure. In production, passwords never touch client code; Supabase Auth
 * handles hashing/verification server-side.
 */
export function obfuscate(pw: string): string {
  try {
    return typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(pw))) : pw;
  } catch {
    return pw;
  }
}

/** The seeded demo customer — founders use this to walk through the flow. */
const DEMO_ACCOUNT: CustomerAccount = {
  id: "9849116181",
  customerId: "SN-CU-00001",
  name: "Bhavesh Allapati",
  mobile: "+91 98491 16181",
  email: "srikanth.alapati@yahoo.com",
  address: "Nagole, Hyderabad, Telangana, 500068",
  username: "bhavesh",
  password: obfuscate("demo123"),
  createdAt: "2026-08-01T00:00:00.000Z",
};

/* ------------------------------ persistence ------------------------------ */

function readAll(): CustomerAccount[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CustomerAccount[]) : null;
  } catch {
    return null;
  }
}

function writeAll(accounts: CustomerAccount[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(accounts));
  } catch {
    /* ignore */
  }
}

/** Reserves and formats the next customer number (e.g. "SN-CU-00002"). */
function nextCustomerId(): string {
  try {
    const seq = Number(localStorage.getItem(SEQ_KEY) || "1") + 1;
    localStorage.setItem(SEQ_KEY, String(seq));
    return `SN-CU-${String(seq).padStart(5, "0")}`;
  } catch {
    return `SN-CU-${Date.now().toString().slice(-5)}`;
  }
}

/**
 * First run on a browser: seed the demo account and fold in the old
 * single-profile store (and its self-service password) if one exists, so a
 * founder who already edited "their" profile doesn't lose it.
 */
function bootstrap(): CustomerAccount[] {
  const accounts: CustomerAccount[] = [{ ...DEMO_ACCOUNT }];
  try {
    const rawProfile = localStorage.getItem(LEGACY_PROFILE_KEY);
    const legacyPw = localStorage.getItem(LEGACY_PW_KEY) || undefined;
    if (rawProfile) {
      const p = JSON.parse(rawProfile) as Partial<CustomerAccount>;
      const id = normalizeId(p.mobile || "");
      if (id === DEMO_ACCOUNT.id) {
        Object.assign(accounts[0], {
          name: p.name || accounts[0].name,
          email: p.email || accounts[0].email,
          address: p.address || accounts[0].address,
          password: legacyPw || accounts[0].password,
        });
      } else if (id.length === 10) {
        accounts.push({
          id,
          customerId: p.customerId || nextCustomerId(),
          name: p.name || "",
          mobile: prettyMobile(id),
          email: p.email || "",
          address: p.address || "",
          password: legacyPw,
          createdAt: new Date().toISOString(),
        });
      }
    }
    localStorage.removeItem(LEGACY_PROFILE_KEY);
    localStorage.removeItem(LEGACY_PW_KEY);
  } catch {
    /* ignore — fall through with just the demo account */
  }
  writeAll(accounts);
  return accounts;
}

/** All registered customers (seeds the store on first call). */
export function getAccounts(): CustomerAccount[] {
  if (typeof window === "undefined") return [DEMO_ACCOUNT];
  return readAll() ?? bootstrap();
}

/** Look up by mobile (any format), email or username — case-insensitive. */
export function findAccount(identifier: string): CustomerAccount | null {
  const raw = identifier.trim().toLowerCase();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  const asId = digits.length >= 10 ? digits.slice(-10) : "";
  return (
    getAccounts().find(
      (a) =>
        (asId && a.id === asId) ||
        a.email.toLowerCase() === raw ||
        (a.username && a.username.toLowerCase() === raw),
    ) ?? null
  );
}

export function getAccount(id: string): CustomerAccount | null {
  const nid = normalizeId(id);
  return getAccounts().find((a) => a.id === nid) ?? null;
}

/** Creates a new account. Validates and enforces unique mobile/email. */
export function registerAccount(input: RegisterInput): RegisterResult {
  const name = input.name.trim();
  const id = normalizeId(input.mobile);
  const email = (input.email || "").trim().toLowerCase();
  const password = input.password ?? "";

  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!isValidMobile(id)) return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
  if (email && !isValidEmail(email)) return { ok: false, error: "That email address doesn't look right." };
  if (password && password.length < 4) return { ok: false, error: "Password must be at least 4 characters." };

  const accounts = getAccounts();
  if (accounts.some((a) => a.id === id)) {
    return { ok: false, error: "An account with this mobile number already exists — please sign in." };
  }
  if (email && accounts.some((a) => a.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with this email already exists — please sign in." };
  }

  const account: CustomerAccount = {
    id,
    customerId: nextCustomerId(),
    name,
    mobile: prettyMobile(id),
    email,
    address: (input.address || "").trim(),
    password: password ? obfuscate(password) : undefined,
    createdAt: new Date().toISOString(),
  };
  writeAll([...accounts, account]);
  return { ok: true, account };
}

/** Partial update of profile fields. Mobile (the id) is immutable. */
export function updateAccount(
  id: string,
  patch: Partial<Pick<CustomerAccount, "name" | "email" | "address">>,
): CustomerAccount | null {
  const nid = normalizeId(id);
  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.id === nid);
  if (idx === -1) return null;
  const next: CustomerAccount = {
    ...accounts[idx],
    ...(patch.name !== undefined && { name: patch.name.trim() }),
    ...(patch.email !== undefined && { email: patch.email.trim().toLowerCase() }),
    ...(patch.address !== undefined && { address: patch.address.trim() }),
  };
  accounts[idx] = next;
  writeAll(accounts);
  return next;
}

export function hasPassword(id: string): boolean {
  return !!getAccount(id)?.password;
}

export function setPassword(id: string, newPassword: string): boolean {
  const nid = normalizeId(id);
  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.id === nid);
  if (idx === -1) return false;
  accounts[idx] = { ...accounts[idx], password: obfuscate(newPassword) };
  writeAll(accounts);
  return true;
}

export function verifyPassword(account: CustomerAccount, password: string): boolean {
  return !!account.password && account.password === obfuscate(password);
}
