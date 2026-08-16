"use client";

import { useEffect, useMemo, useState } from "react";
import { getAuditEvents, clearAudit, describeBrowser, type AuditEvent } from "@/lib/audit";

const typeLabel: Record<AuditEvent["type"], string> = {
  page_view: "Viewed page",
  login: "Signed in",
  logout: "Signed out",
  cart_add: "Added to cart",
  order_placed: "Placed order",
};

function actorLabel(a: AuditEvent["actor"]): string {
  if (a.kind === "admin") return "Admin";
  if (a.kind === "customer") return a.name || a.id || "Customer";
  return "Guest";
}

export function AdminActivity() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const refresh = () => setEvents(getAuditEvents());
  useEffect(refresh, []);

  const stats = useMemo(() => {
    const visitors = new Set(events.map((e) => e.visitorId));
    return {
      visitors: visitors.size,
      pageViews: events.filter((e) => e.type === "page_view").length,
      cartAdds: events.filter((e) => e.type === "cart_add").length,
      orders: events.filter((e) => e.type === "order_placed").length,
      logins: events.filter((e) => e.type === "login").length,
    };
  }, [events]);

  // Group into per-visitor sessions.
  const sessions = useMemo(() => {
    const map = new Map<
      string,
      { visitorId: string; identity: string; loggedIn: boolean; browser: string; views: number; last: string }
    >();
    for (const e of events) {
      const cur = map.get(e.visitorId) ?? {
        visitorId: e.visitorId,
        identity: "Guest",
        loggedIn: false,
        browser: describeBrowser(e.userAgent),
        views: 0,
        last: e.ts,
      };
      if (e.type === "page_view") cur.views += 1;
      if (e.actor.kind === "customer") {
        cur.identity = e.actor.name || e.actor.id || "Customer";
        cur.loggedIn = true;
      } else if (e.actor.kind === "admin" && cur.identity === "Guest") {
        cur.identity = "Admin";
      }
      if (e.ts > cur.last) cur.last = e.ts;
      map.set(e.visitorId, cur);
    }
    return [...map.values()].sort((a, b) => (a.last < b.last ? 1 : -1));
  }, [events]);

  // Product interest from /product/<slug> page views.
  const topProducts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) {
      if (e.type === "page_view" && e.path?.startsWith("/product/")) {
        const slug = e.path.split("/product/")[1]?.split(/[?#]/)[0];
        if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [events]);

  // What guests (not signed in) added to cart.
  const guestCart = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) {
      if (e.type === "cart_add" && e.actor.kind === "guest") {
        const name = e.productName || e.productId || "Unknown";
        counts.set(name, (counts.get(name) ?? 0) + (e.qty ?? 1));
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [events]);

  const pretty = (slug: string) => slug.replace(/-/g, " ");

  const cards = [
    { label: "Visitors (this device)", value: stats.visitors },
    { label: "Page views", value: stats.pageViews },
    { label: "Cart adds", value: stats.cartAdds },
    { label: "Orders", value: stats.orders },
    { label: "Sign-ins", value: stats.logins },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">Activity &amp; analytics</h1>
          <p className="mt-1 text-sm text-forest/60">
            Sessions, page views and interest — including signed-out visitors. Demo data is recorded
            on this device only.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear the activity log?")) {
              clearAudit();
              refresh();
            }
          }}
          className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
        >
          Clear log
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-forest/8 bg-white/60 p-4">
            <p className="text-xs text-forest/55">{c.label}</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-forest">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Sessions */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Sessions</h2>
          {sessions.length === 0 ? (
            <p className="mt-3 text-sm text-forest/55">No activity yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-forest/8 text-sm">
              {sessions.map((s) => (
                <li key={s.visitorId} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${s.loggedIn ? "bg-moss" : "bg-forest/25"}`}
                      title={s.loggedIn ? "Signed in" : "Guest"}
                    />
                    <span className="font-medium text-forest">{s.identity}</span>
                    <span className="text-xs text-forest/50">{s.browser}</span>
                  </span>
                  <span className="text-xs text-forest/50">
                    {s.views} views · {new Date(s.last).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Product interest + guest cart */}
        <section className="space-y-6">
          <div className="rounded-lg border border-forest/8 bg-white/60 p-5">
            <h2 className="font-serif text-lg font-semibold text-forest">Most viewed products</h2>
            {topProducts.length === 0 ? (
              <p className="mt-3 text-sm text-forest/55">No product views yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-forest/8 text-sm capitalize">
                {topProducts.map(([slug, n]) => (
                  <li key={slug} className="flex items-center justify-between py-2">
                    <span className="text-forest">{pretty(slug)}</span>
                    <span className="text-forest/55">{n} views</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-forest/8 bg-white/60 p-5">
            <h2 className="font-serif text-lg font-semibold text-forest">Guest cart interest</h2>
            <p className="mt-0.5 text-xs text-forest/50">Added to cart by signed-out visitors.</p>
            {guestCart.length === 0 ? (
              <p className="mt-3 text-sm text-forest/55">Nothing yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-forest/8 text-sm">
                {guestCart.map(([name, n]) => (
                  <li key={name} className="flex items-center justify-between py-2">
                    <span className="text-forest">{name}</span>
                    <span className="text-forest/55">×{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Recent events */}
      <section className="mt-8 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
        <h2 className="border-b border-forest/8 px-5 py-3 font-serif text-lg font-semibold text-forest">
          Recent activity
        </h2>
        {events.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-forest/55">No events recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-forest/8">
              {events.slice(0, 40).map((e) => (
                <tr key={e.id}>
                  <td className="px-5 py-2.5 text-xs text-forest/50">
                    {new Date(e.ts).toLocaleTimeString("en-IN")}
                  </td>
                  <td className="px-2 py-2.5 font-medium text-forest">{actorLabel(e.actor)}</td>
                  <td className="px-2 py-2.5 text-forest/70">{typeLabel[e.type]}</td>
                  <td className="px-2 py-2.5 text-forest/60">
                    {e.type === "page_view"
                      ? e.path
                      : e.type === "cart_add"
                        ? e.productName
                        : e.type === "order_placed"
                          ? String(e.meta?.orderNumber ?? "")
                          : ""}
                  </td>
                  <td className="px-5 py-2.5 text-right text-xs text-forest/45">
                    {describeBrowser(e.userAgent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="mt-4 text-xs text-forest/45">
        Privacy: this prototype stores anonymous, on-device activity only. In production, gate
        analytics behind cookie consent (DPDP Act / GDPR), anonymise, and honour opt-out.
      </p>
    </div>
  );
}
