/**
 * Customer profile — a view over the signed-in customer's account record.
 *
 * Earlier this was a single per-browser profile. It now reads/writes the
 * current session's entry in the account registry (`users.ts`), so each
 * registered customer has their own name/email/address. `getProfile()` for a
 * guest returns an empty profile (nothing is pre-filled from someone else).
 */

import { getAccount, updateAccount, normalizeId } from "./users";

export interface Profile {
  /** Friendly customer-facing account number, e.g. "SN-CU-00001". Distinct from
   *  `mobile`, which is the login/order key. */
  customerId: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
}

const SESSION_KEY = "sn-auth-v1";

export const defaultProfile: Profile = {
  customerId: "",
  name: "",
  mobile: "",
  email: "",
  address: "",
};

function currentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? normalizeId((JSON.parse(raw) as { id: string }).id) : null;
  } catch {
    return null;
  }
}

export function getProfile(): Profile {
  const id = currentUserId();
  const a = id ? getAccount(id) : null;
  if (!a) return defaultProfile;
  return { customerId: a.customerId, name: a.name, mobile: a.mobile, email: a.email, address: a.address };
}

/** Saves editable fields to the signed-in account. Mobile is the id and is not changed here. */
export function saveProfile(profile: Profile): void {
  const id = currentUserId();
  if (!id) return;
  updateAccount(id, { name: profile.name, email: profile.email, address: profile.address });
}
