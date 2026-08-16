"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ADMIN_ACCOUNTS,
  ADMIN_BASE,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "@/lib/admin";
import { logEvent } from "@/lib/audit";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { NotFoundView } from "@/components/ui/NotFoundView";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Dashboard", href: ADMIN_BASE },
  { label: "Orders", href: `${ADMIN_BASE}/orders` },
  { label: "Packing", href: `${ADMIN_BASE}/packing` },
  { label: "Products", href: `${ADMIN_BASE}/products` },
  { label: "Reports", href: `${ADMIN_BASE}/reports` },
  { label: "Activity", href: `${ADMIN_BASE}/activity` },
  { label: "Notifications", href: `${ADMIN_BASE}/dev/notifications` },
];

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [username, setUsername] = useState(ADMIN_ACCOUNTS[0]?.username ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();
  const { user: customer } = useAuth();

  useEffect(() => {
    const s = getAdminSession();
    setAdminName(s?.name ?? null);
    setReady(true);
  }, []);

  const authed = adminName !== null;

  if (!ready) {
    return <div className="container py-24 text-center text-forest/50">Loading…</div>;
  }

  /* ---- Signed in as admin: render the portal ---- */
  if (authed) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="border-b border-forest/10 bg-white/70">
          <div className="container flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {/* Stay inside the admin portal — don't switch to the storefront. */}
              <Logo href={ADMIN_BASE} />
              <span className="hidden rounded-full bg-forest/10 px-2.5 py-1 text-xs font-medium text-forest sm:inline">
                {adminName} · admin
              </span>
            </div>
            <nav className="flex items-center gap-1">
              {NAV.map((n) => {
                const active = n.href === ADMIN_BASE ? pathname === ADMIN_BASE : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active ? "bg-forest text-cream" : "text-forest/70 hover:bg-forest/5",
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  logEvent({ type: "logout", actor: { kind: "admin", name: adminName ?? "Admin" } });
                  logoutAdmin();
                  setAdminName(null);
                }}
                className="ml-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-forest/60 hover:text-clay"
              >
                Log out
              </button>
            </nav>
          </div>
        </header>
        {children}
      </div>
    );
  }

  /* ---- A customer is signed in: the admin area must look non-existent ---- */
  if (customer) {
    return <NotFoundView path={pathname} />;
  }

  /* ---- Nobody signed in: show the founder login ---- */
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-lg border border-forest/8 bg-white/70 p-8 shadow-soft">
        <Logo />
        <h1 className="mt-6 font-serif text-2xl font-semibold text-forest">Founder sign in</h1>
        <p className="mt-1 text-sm text-forest/60">Operations portal for Surakshitam Naturals.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (loginAdmin(username, password)) {
              const s = getAdminSession();
              logEvent({ type: "login", actor: { kind: "admin", name: s?.name ?? "Admin" } });
              setAdminName(s?.name ?? "Admin");
            } else {
              setError("Incorrect username or password.");
            }
          }}
          className="mt-6 space-y-3"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-moss focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-moss focus:outline-none"
          />
          {error && <p className="text-sm text-clay">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream hover:bg-ink">
            Sign in
          </button>
        </form>
        <p className="mt-4 rounded-lg bg-parchment px-3 py-2 text-xs text-forest/60">
          Demo founder accounts:{" "}
          {ADMIN_ACCOUNTS.map((a, i) => (
            <span key={a.username}>
              {i > 0 && " · "}
              <b>{a.username}</b>
            </span>
          ))}{" "}
          — password <b>demo123</b>.
        </p>
      </div>
    </div>
  );
}
