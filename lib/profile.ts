/** Customer profile — prototype persistence in localStorage (client-only). */

export interface Profile {
  name: string;
  mobile: string;
  email: string;
  address: string;
}

const KEY = "sn-profile-v1";

export const defaultProfile: Profile = {
  name: "Bhavesh Allapati",
  mobile: "+91 98491 16181",
  email: "Srikanth.Alapati@yahoo.com",
  address: "Nagole, Hyderabad, Telangana, 500068",
};

export function getProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultProfile, ...(JSON.parse(raw) as Partial<Profile>) } : defaultProfile;
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
