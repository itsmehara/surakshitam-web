"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getSession,
  loginWithOtp,
  loginWithPassword,
  register as doRegister,
  logout as doLogout,
  type CustomerSession,
  type AuthResult,
} from "@/lib/auth";
import type { RegisterInput } from "@/lib/users";

interface AuthValue {
  user: CustomerSession | null;
  isLoggedIn: boolean;
  ready: boolean;
  loginOtp: (mobile: string, otp: string, name?: string) => AuthResult;
  loginPassword: (username: string, password: string) => AuthResult;
  register: (input: RegisterInput) => AuthResult;
  signOut: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerSession | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setUser(getSession()), []);

  useEffect(() => {
    refresh();
    setReady(true);
    // Keep tabs in sync (login/logout in another tab).
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sn-auth-v1") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const loginOtp = useCallback(
    (mobile: string, otp: string, name?: string) => {
      const r = loginWithOtp(mobile, otp, name);
      if (r.ok) refresh();
      return r;
    },
    [refresh],
  );

  const loginPassword = useCallback(
    (username: string, password: string) => {
      const r = loginWithPassword(username, password);
      if (r.ok) refresh();
      return r;
    },
    [refresh],
  );

  const register = useCallback(
    (input: RegisterInput) => {
      const r = doRegister(input);
      if (r.ok) refresh();
      return r;
    },
    [refresh],
  );

  const signOut = useCallback(() => {
    doLogout();
    refresh();
  }, [refresh]);

  const value = useMemo<AuthValue>(
    () => ({ user, isLoggedIn: user !== null, ready, loginOtp, loginPassword, register, signOut, refresh }),
    [user, ready, loginOtp, loginPassword, register, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
