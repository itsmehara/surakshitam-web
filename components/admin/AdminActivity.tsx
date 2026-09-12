"use client";

import { useEffect, useMemo, useState } from "react";
import { getAuditEvents, clearAudit, describeBrowser, type AuditEvent } from "@/lib/audit";
import { seedDemoActivity } from "@/lib/demo-seed";

const typeLabel: Record<AuditEvent["type"], string> = {
  page_view: "Viewed page",
  login: "Signed in",
  logout: "Signed out",
  cart_add: "Added to cart",
  cart_remove: "Removed from cart",
  order_placed: "Placed order",
  order_status_changed: "Updated order status",
  payment_failed: "Payment failed",
  profile_update: "Updated profile",
  report_export: "Exported report",
  team_update: "Updated admin team",
  ingredient_update: "Updated ingredient library",
  unauthorized_access: "Unauthorized /studio attempt",
};

function actorLabel(a: AuditEvent["actor"]): string {
  if (a.kind === "admin") return a.name || "Admin";
  if (a.kind === "customer") return a.name || a.id || "Customer";
  return "Guest";
}

/** Friendly label for a storefront/admin path — used instead of raw URLs. */
const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/shop": "Shop",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/account": "My account",
  "/login": "Sign in",
  "/search": "Search",
  "/ingredients": "Ingredients",
  "/our-story": "Our story",
  "/contact": "Contact",
  "/track-order": "Track order",
  "/studio": "Admin dashboard",
  "/studio/orders": "Admin · Orders",
  "/studio/packing": "Admin · Packing list",
  "/studio/products": "Admin · Products",
  "/studio/reports": "Admin · Reports",
  "/studio/team": "Admin · Team",
  "/studio/activity": "Admin · Activity",
};

function friendlyPage(path?: string): string {
  if (!path) return "";
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  const product = path.match(/^\/product\/([^/?#]+)/);
  if (product) return `Product · ${product[1].replace(/-/g, " ")}`;
  const learn = path.match(/^\/learn\/([^/?#]+)/);
  if (learn) return `Learn · ${learn[1].replace(/-/g, " ")}`;
  const policy = path.match(/^\/policies\/([^/?#]+)/);
  if (policy) return `Policy · ${policy[1].replace(/-/g, " ")}`;
  const order = path.match(/^\/order\/([^/?#]+)/);
  if (order) return `Order confirmation · ${order[1]}`;
  const orderDetail = path.match(/^\/studio\/orders\/([^/?#]+)/);
  if (orderDetail) return `Admin · Order ${orderDetail[1]}`;
  const productEdit = path.match(/^\/studio\/products\/([^/?#]+)/);
  if (productEdit) return productEdit[1] === "new" ? "Admin · Add product" : "Admin · Edit product";
  return path;
}

/** One-line, human detail for an event's Detail column. */
function eventDetail(e: AuditEvent): string {
  switch (e.type) {
    case "page_view":
      return friendlyPage(e.path);
    case "cart_add":
    case "cart_remove":
      return e.qty ? `${e.productName ?? "Product"} ×${e.qty}` : e.productName ?? "";
    case "order_placed":
      return e.meta?.orderNumber ? `#${e.meta.orderNumber}` : "";
    case "order_status_changed":
      return [
        e.meta?.orderNumber ? `#${e.meta.orderNumber}` : "",
        e.meta?.from && e.meta?.to ? `${e.meta.from} → ${e.meta.to}` : "",
        e.meta?.courier,
      ]
        .filter(Boolean)
        .join(" · ");
    case "payment_failed":
      return e.meta?.total ? `Attempted total: ₹${(Number(e.meta.total) / 100).toLocaleString("en-IN")}` : "";
    case "profile_update":
      return e.meta?.field ? `Field: ${e.meta.field}` : "";
    case "report_export":
      return [e.meta?.report, e.meta?.format].filter(Boolean).join(" · ");
    case "team_update":
      return [e.meta?.action, e.meta?.target].filter(Boolean).join(" · ");
    case "ingredient_update":
      return [e.meta?.ingredient, e.meta?.action].filter(Boolean).join(" · ");
    case "unauthorized_access":
      return `Tried to open ${e.path ?? "/studio"}`;
    default:
      return "";
  }
}

const PAGE_SIZE = 15;

export function AdminActivity() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [showPageViews, setShowPageViews] = useState(false);
  const [page, setPage] = useState(1);
  const [seeding, setSeeding] = useState(false);
  const refresh = () => setEvents(getAuditEvents());
  useEffect(refresh, []);

  // "Recent activity" defaults to business events (logins, orders, exports,
  // status changes, etc.) — plain page views drown those out and read as a
  // web-traffic log rather than an activity feed. Toggle brings them back.
  const feedEvents = useMemo(
    () => (showPageViews ? events : events.filter((e) => e.type !== "page_view")),
    [events, showPageViews],
  );

  // Reset to page 1 whenever the underlying event set or filter changes.
  useEffect(() => setPage(1), [showPageViews, events.length]);

  const totalPages = Math.max(1, Math.ceil(feedEvents.length / PAGE_SIZE));
  const pageEvents = feedEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const visitors = new Set(events.map((e) => e.visitorId));
    return {
      visitors: visitors.size,
      pageViews: events.filter((e) => e.type === "page_view").length,
      cartAdds: events.filter((e) => e.type === "cart_add").length,
      orders: events.filter((e) => e.type === "order_placed").length,
      logins: events.filter((e) => e.type === "login").length,
      statusUpdates: events.filter((e) => e.type === "order_status_changed").length,
      failedPayments: events.filter((e) => e.type === "payment_failed").length,
      unauthorized: events.filter((e) => e.type === "unauthorized_access").length,
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
    { label: "Status updates", value: stats.statusUpdates },
    { label: "Sign-ins", value: stats.logins },
    { label: "Failed payments", value: stats.failedPayments },
    { label: "Unauthorized /studio tries", value: stats.unauthorized },
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={seeding}
            onClick={async () => {
              setSeeding(true);
              const { events: n, orders } = seedDemoActivity();
              refresh();
              setSeeding(false);
              alert(`Loaded ${n} sample activity events and ${orders} demo orders.`);
            }}
            className="rounded-full border border-moss/30 bg-moss/5 px-4 py-2 text-sm font-medium text-moss hover:bg-moss/10 disabled:opacity-50"
          >
            {seeding ? "Loading…" : "Load sample activity"}
          </button>
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
      </div>
      <div className="mt-4 rounded-lg border border-moss/15 bg-moss/5 px-4 py-3 text-xs text-forest/55">
        <span className="font-medium text-forest/70">&ldquo;Load sample activity&rdquo;</span> is a
        demo-only tool: it seeds realistic browsing, cart, order and admin events (spanning ~9 days)
        using the same functions the real app uses, so the resulting orders also appear in
        Orders/Packing/Reports/Dashboard.
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/8 px-5 py-3">
          <h2 className="font-serif text-lg font-semibold text-forest">Recent activity</h2>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-forest/60">
            <input
              type="checkbox"
              checked={showPageViews}
              onChange={(e) => setShowPageViews(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-forest/30 text-forest focus:ring-moss"
            />
            Show page views
          </label>
        </div>
        {feedEvents.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-forest/55">
            {showPageViews ? "No events recorded yet." : "No business activity yet — try “Show page views”."}
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/8 text-left text-xs uppercase tracking-wide text-forest/50">
                <th className="px-5 py-2.5 font-medium">Time</th>
                <th className="px-2 py-2.5 font-medium">Who</th>
                <th className="px-2 py-2.5 font-medium">Action</th>
                <th className="px-2 py-2.5 font-medium">Detail</th>
                <th className="px-5 py-2.5 text-right font-medium">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/8">
              {pageEvents.map((e) => (
                <tr key={e.id} className={e.type === "unauthorized_access" ? "bg-clay/5" : undefined}>
                  <td className="px-5 py-2.5 text-xs text-forest/50">
                    {new Date(e.ts).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-2 py-2.5 font-medium text-forest">{actorLabel(e.actor)}</td>
                  <td
                    className={`px-2 py-2.5 ${e.type === "unauthorized_access" ? "font-medium text-clay" : "text-forest/70"}`}
                  >
                    {typeLabel[e.type]}
                  </td>
                  <td className="px-2 py-2.5 capitalize text-forest/60">{eventDetail(e)}</td>
                  <td className="px-5 py-2.5 text-right text-xs text-forest/45">
                    {describeBrowser(e.userAgent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        {feedEvents.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-forest/8 px-5 py-3 text-sm">
            <span className="text-xs text-forest/50">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, feedEvents.length)} of{" "}
              {feedEvents.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((n) => Math.max(1, n - 1))}
                className="rounded-full border border-forest/15 px-3 py-1.5 text-xs font-medium text-forest hover:bg-forest/5 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-xs text-forest/60">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
                className="rounded-full border border-forest/15 px-3 py-1.5 text-xs font-medium text-forest hover:bg-forest/5 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="mt-4 text-xs text-forest/45">
        Privacy: this prototype stores anonymous, on-device activity only. In production, gate
        analytics behind cookie consent (DPDP Act / GDPR), anonymise, and honour opt-out.
      </p>
    </div>
  );
}
