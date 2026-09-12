"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminAccounts,
  ADMIN_BASE,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "@/lib/admin";
import { logEvent } from "@/lib/audit";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { NotFoundView } from "@/components/ui/NotFoundView";
import { MenuIcon, CloseIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * `alsoMatches` covers routes that belong to a nav section but don't live under
 * its path. The ingredient library is a tab inside Products, yet its add/edit
 * forms are top-level routes (`/studio/ingredients/...`) — without this, Products
 * silently un-highlights the moment you open one, and the header stops telling
 * you where you are.
 */
const NAV: { label: string; href: string; alsoMatches?: string[] }[] = [
  { label: "Dashboard", href: ADMIN_BASE },
  { label: "Orders", href: `${ADMIN_BASE}/orders` },
  { label: "Packing", href: `${ADMIN_BASE}/packing` },
  { label: "Products", href: `${ADMIN_BASE}/products`, alsoMatches: [`${ADMIN_BASE}/ingredients`] },
  { label: "Reports", href: `${ADMIN_BASE}/reports` },
  { label: "Team", href: `${ADMIN_BASE}/team` },
  { label: "Activity", href: `${ADMIN_BASE}/activity` },
  { label: "Notifications", href: `${ADMIN_BASE}/dev/notifications` },
];

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user: customer } = useAuth();

  useEffect(() => {
    const s = getAdminSession();
    setAdminName(s?.name ?? null);
    setUsername(getAdminAccounts()[0]?.username ?? "");
    setReady(true);
  }, []);

  const authed = adminName !== null;

  // A signed-in customer hitting /studio sees a plain 404 (see below), but
  // founders should still know it happened — logged once per path visited,
  // not on every render.
  useEffect(() => {
    if (ready && customer && !authed) {
      logEvent({
        type: "unauthorized_access",
        actor: { kind: "customer", id: customer.id, name: customer.name },
        path: pathname,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, customer, authed, pathname]);

  /** Which nav section the current route belongs to. */
  const isNavActive = (item: (typeof NAV)[number]) =>
    item.href === ADMIN_BASE
      ? pathname === ADMIN_BASE
      : pathname.startsWith(item.href) ||
        (item.alsoMatches ?? []).some((prefix) => pathname.startsWith(prefix));

  // Close the mobile drawer / account dropdown on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function doLogout() {
    logEvent({ type: "logout", actor: { kind: "admin", name: adminName ?? "Admin" } });
    logoutAdmin();
    setAdminName(null);
  }

  if (!ready) {
    return <div className="container py-24 text-center text-forest/50">Loading…</div>;
  }

  /* ---- Signed in as admin: render the portal ---- */
  if (authed) {
    return (
      <div className="min-h-screen bg-cream">
        <header className="sticky top-0 z-50 border-b border-forest/10 bg-white/90 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between gap-4">
            {/* Mobile: menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5 lg:hidden"
            >
              <MenuIcon />
            </button>

            {/* Stay inside the admin portal — don't switch to the storefront. */}
            <Logo href={ADMIN_BASE} />

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Admin">
              {NAV.map((n) => {
                const active = isNavActive(n);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active ? "bg-forest text-cream" : "text-forest/70 hover:bg-forest/5",
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            {/* Account icon + logout dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={`Admin account — ${adminName}`}
                aria-expanded={menuOpen}
                className="flex h-10 items-center gap-2 rounded-full px-2.5 text-forest transition-colors hover:bg-forest/5"
              >
                <UserIcon />
                <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:inline">{adminName}</span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-44 rounded-lg border border-forest/10 bg-white p-1.5 shadow-soft">
                    <p className="truncate px-3 py-1.5 text-xs text-forest/50">{adminName} · admin</p>
                    <button
                      type="button"
                      onClick={doLogout}
                      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-forest/70 hover:bg-clay/10 hover:text-clay"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Mobile drawer */}
        <div
          className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}
          aria-hidden={!mobileOpen}
        >
          <div
            onClick={() => setMobileOpen(false)}
            className={cn(
              "absolute inset-0 bg-forest/40 transition-opacity duration-300",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-cream shadow-xl transition-transform duration-300 ease-smooth",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
          >
            <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
              <Logo href={ADMIN_BASE} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-forest hover:bg-forest/5"
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col px-3 py-4" aria-label="Admin mobile">
              {NAV.map((n) => {
                const active = isNavActive(n);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-4 py-3.5 font-serif text-lg transition-colors",
                      active ? "bg-parchment font-semibold text-moss" : "text-forest hover:bg-parchment",
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-forest/10 px-5 py-5">
              <button
                type="button"
                onClick={doLogout}
                className="flex items-center gap-2 text-sm font-medium text-forest"
              >
                <UserIcon width={18} /> {adminName} · Log out
              </button>
            </div>
          </div>
        </div>

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
          {getAdminAccounts().map((a, i) => (
            <span key={a.username}>
              {i > 0 && " · "}
              <b>{a.username}</b>
            </span>
          ))}{" "}
          — password shown in Team (or <b>demo123</b> for the original founder accounts).
        </p>
      </div>
    </div>
  );
}
