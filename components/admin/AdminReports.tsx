"use client";

import { useEffect, useState } from "react";
import { getOrders, FULFILLMENT_FLOW, FULFILLMENT_LABEL, type Order, type FulfillmentStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { getAdminSession } from "@/lib/admin";
import { logEvent } from "@/lib/audit";

const statusLabel = FULFILLMENT_LABEL;

/** Builds a CSV string from rows of string/number cells and triggers a browser download. */
function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-formatted window for the report and triggers the browser's
 * print dialog — the person picks "Save as PDF". No PDF library needed, and
 * it works offline; production could swap this for a server-rendered PDF.
 */
function exportPdf(title: string, headers: string[], rows: (string | number)[][]) {
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) return;
  const escapeHtml = (v: string | number) =>
    String(v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
  win.document.write(`<!DOCTYPE html>
<html><head><title>${escapeHtml(title)} — Surakshitam Naturals</title>
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 32px; color: #1f2a1f; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  p.meta { color: #667; font-size: 12px; margin: 0 0 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #ddd; }
  th { color: #556; font-weight: 600; }
</style></head><body>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">Surakshitam Naturals · Generated ${new Date().toLocaleString("en-IN")}</p>
  <table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>
</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

/**
 * Opens the person's default mail client with the report as a plain-text
 * table, addressed to the store's own contact email. Prototype-friendly (no
 * backend/email provider needed); production would send via a real service.
 */
function emailReport(title: string, headers: string[], rows: (string | number)[][]) {
  const lines = [headers.join("\t"), ...rows.map((r) => r.join("\t"))];
  const body = `${title} — Surakshitam Naturals\nGenerated ${new Date().toLocaleString("en-IN")}\n\n${lines.join("\n")}`;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`${title} — Surakshitam Naturals`)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

function logExport(report: string, format: "CSV" | "PDF" | "Email") {
  const admin = getAdminSession();
  logEvent({
    type: "report_export",
    actor: { kind: "admin", name: admin?.name },
    meta: { report, format },
  });
}

function ExportButtons({
  title,
  filename,
  headers,
  rows,
}: {
  title: string;
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  const btn = "rounded-full border border-forest/15 px-3.5 py-1.5 text-xs font-medium text-forest hover:bg-forest/5";
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => {
          downloadCsv(filename, headers, rows);
          logExport(title, "CSV");
        }}
        className={btn}
      >
        Export CSV
      </button>
      <button
        type="button"
        onClick={() => {
          exportPdf(title, headers, rows);
          logExport(title, "PDF");
        }}
        className={btn}
      >
        Export PDF
      </button>
      <button
        type="button"
        onClick={() => {
          emailReport(title, headers, rows);
          logExport(title, "Email");
        }}
        className={btn}
      >
        Email report
      </button>
    </div>
  );
}

interface DailyRow {
  date: string;
  orders: number;
  units: number;
  revenue: number;
}

interface ProductRow {
  name: string;
  sku: string;
  units: number;
  revenue: number;
}

function buildDaily(orders: Order[]): DailyRow[] {
  const map = new Map<string, DailyRow>();
  for (const o of orders) {
    const date = new Date(o.createdAt).toLocaleDateString("en-IN");
    const units = o.items.reduce((n, i) => n + i.qty, 0);
    const existing = map.get(date);
    if (existing) {
      existing.orders += 1;
      existing.units += units;
      existing.revenue += o.total;
    } else {
      map.set(date, { date, orders: 1, units, revenue: o.total });
    }
  }
  return [...map.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function buildProducts(orders: Order[]): ProductRow[] {
  const map = new Map<string, ProductRow>();
  for (const o of orders) {
    for (const item of o.items) {
      const key = item.productId;
      const existing = map.get(key);
      const revenue = item.priceSnapshot * item.qty;
      if (existing) {
        existing.units += item.qty;
        existing.revenue += revenue;
      } else {
        map.set(key, { name: item.nameSnapshot, sku: item.skuSnapshot, units: item.qty, revenue });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

function buildStatus(orders: Order[]): { status: FulfillmentStatus; count: number }[] {
  return FULFILLMENT_FLOW.map((status) => ({
    status,
    count: orders.filter((o) => o.fulfillmentStatus === status).length,
  }));
}

/** Range presets replace separate "daily report" / "monthly report" pages — one
 *  filter drives all three tables below (daily sales, product sales, order status),
 *  so "monthly" or "this product this month" is just a range selection, not a
 *  different screen. */
type RangeOption = "all" | "today" | "week" | "month" | "custom";
const RANGE_LABEL: Record<RangeOption, string> = {
  all: "All time",
  today: "Today",
  week: "This week",
  month: "This month",
  custom: "Custom range",
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Returns [from, toExclusive) for the selected range, or null for "all time". */
function rangeBounds(
  range: RangeOption,
  customFrom: string,
  customTo: string,
): [Date, Date] | null {
  const now = new Date();
  const tomorrow = new Date(startOfDay(now));
  tomorrow.setDate(tomorrow.getDate() + 1);
  switch (range) {
    case "today":
      return [startOfDay(now), tomorrow];
    case "week":
      return [startOfWeek(now), tomorrow];
    case "month":
      return [startOfMonth(now), tomorrow];
    case "custom": {
      if (!customFrom || !customTo) return null;
      const from = startOfDay(new Date(customFrom));
      const to = startOfDay(new Date(customTo));
      to.setDate(to.getDate() + 1); // inclusive of the end date
      return [from, to];
    }
    default:
      return null;
  }
}

function filterOrdersByRange(orders: Order[], bounds: [Date, Date] | null): Order[] {
  if (!bounds) return orders;
  const [from, to] = bounds;
  return orders.filter((o) => {
    const t = new Date(o.createdAt);
    return t >= from && t < to;
  });
}

function RangePicker({
  range,
  setRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}: {
  range: RangeOption;
  setRange: (r: RangeOption) => void;
  customFrom: string;
  setCustomFrom: (v: string) => void;
  customTo: string;
  setCustomTo: (v: string) => void;
}) {
  const options: RangeOption[] = ["all", "today", "week", "month", "custom"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex flex-wrap rounded-full border border-forest/15 bg-white/60 p-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setRange(opt)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              range === opt ? "bg-forest text-cream" : "text-forest/65 hover:text-forest"
            }`}
          >
            {RANGE_LABEL[opt]}
          </button>
        ))}
      </div>
      {range === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-lg border border-forest/15 px-2.5 py-1.5 text-xs text-forest focus:border-moss focus:outline-none"
          />
          <span className="text-xs text-forest/50">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-lg border border-forest/15 px-2.5 py-1.5 text-xs text-forest focus:border-moss focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

export function AdminReports() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [range, setRange] = useState<RangeOption>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  useEffect(() => setOrders(getOrders()), []);

  const bounds = rangeBounds(range, customFrom, customTo);
  const scoped = filterOrdersByRange(orders, bounds);
  const rangeLabel = range === "custom" && !bounds ? "Custom range (pick both dates)" : RANGE_LABEL[range];

  const daily = buildDaily(scoped);
  const productRows = buildProducts(scoped);
  const statusRows = buildStatus(scoped);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">Reports</h1>
          <p className="mt-1 text-sm text-forest/60">
            Sales and fulfilment summaries — export as CSV, PDF, or email them to yourself.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <RangePicker
          range={range}
          setRange={setRange}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
        />
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-10 text-center text-forest/60">
          No orders yet — reports will populate once orders come in.
        </div>
      ) : range === "custom" && !bounds ? (
        <div className="mt-8 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-10 text-center text-forest/60">
          Pick both a start and end date to see the custom range.
        </div>
      ) : scoped.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-10 text-center text-forest/60">
          No orders in this range — try a wider range.
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {/* Daily sales */}
          <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-forest">Daily sales</h2>
                <p className="text-xs text-forest/50">{rangeLabel}</p>
              </div>
              <ExportButtons
                title={`Daily sales — ${rangeLabel}`}
                filename="daily-sales.csv"
                headers={["Date", "Orders", "Units", "Revenue (₹)"]}
                rows={daily.map((d) => [d.date, d.orders, d.units, d.revenue / 100])}
              />
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-medium text-forest/55">
                  <tr>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Orders</th>
                    <th className="py-2 pr-4">Units</th>
                    <th className="py-2 pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/8">
                  {daily.map((d) => (
                    <tr key={d.date}>
                      <td className="py-2 pr-4 text-forest">{d.date}</td>
                      <td className="py-2 pr-4 text-forest/70">{d.orders}</td>
                      <td className="py-2 pr-4 text-forest/70">{d.units}</td>
                      <td className="py-2 pr-4 font-medium text-forest">{formatPrice(d.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Product sales */}
          <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-forest">Product sales</h2>
                <p className="text-xs text-forest/50">{rangeLabel}</p>
              </div>
              <ExportButtons
                title={`Product sales — ${rangeLabel}`}
                filename="product-sales.csv"
                headers={["Product", "SKU", "Units", "Revenue (₹)"]}
                rows={productRows.map((p) => [p.name, p.sku, p.units, p.revenue / 100])}
              />
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs font-medium text-forest/55">
                  <tr>
                    <th className="py-2 pr-4">Product</th>
                    <th className="py-2 pr-4">SKU</th>
                    <th className="py-2 pr-4">Units</th>
                    <th className="py-2 pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/8">
                  {productRows.map((p) => (
                    <tr key={p.sku}>
                      <td className="py-2 pr-4 text-forest">{p.name}</td>
                      <td className="py-2 pr-4 text-forest/70">{p.sku}</td>
                      <td className="py-2 pr-4 text-forest/70">{p.units}</td>
                      <td className="py-2 pr-4 font-medium text-forest">{formatPrice(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Order status */}
          <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg font-semibold text-forest">Order status</h2>
                <p className="text-xs text-forest/50">{rangeLabel}</p>
              </div>
              <ExportButtons
                title={`Order status — ${rangeLabel}`}
                filename="order-status.csv"
                headers={["Status", "Orders"]}
                rows={statusRows.map((s) => [statusLabel[s.status], s.count])}
              />
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {statusRows.map((s) => (
                <li key={s.status} className="rounded-lg border border-forest/8 bg-parchment/40 p-3 text-center">
                  <p className="text-xs text-forest/55">{statusLabel[s.status]}</p>
                  <p className="mt-1 font-serif text-xl font-semibold text-forest">{s.count}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
