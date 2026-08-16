/** Customer profile — prototype persistence in localStorage (client-only). */

export interface Profile {
  /** Friendly customer-facing account number, e.g. "SN-CU-00001". Generated once,
   *  shown on the account page. Distinct from `mobile`, which is the login/order key. */
  customerId: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
}

const KEY = "sn-profile-v1";
const SEQ_KEY = "sn-customer-seq-v1";

export const defaultProfile: Profile = {
  customerId: "SN-CU-00001",
  name: "Bhavesh Allapati",
  mobile: "+91 98491 16181",
  email: "Srikanth.Alapati@yahoo.com",
  address: "Nagole, Hyderabad, Telangana, 500068",
};

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

export function getProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Profile>) : {};
    const merged = { ...defaultProfile, ...parsed };
    // Self-heal: any profile saved before customerId existed gets one now.
    if (!parsed.customerId) {
      merged.customerId = raw ? nextCustomerId() : defaultProfile.customerId;
      saveProfile(merged);
    }
    return merged;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}
