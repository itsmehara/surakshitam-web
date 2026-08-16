"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders, type Order } from "@/lib/orders";
import { getAdminProducts } from "@/lib/catalog-store";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ArrowRight } from "@/components/icons";

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    setOrders(getOrders());
    setProducts(getAdminProducts());
  }, []);

  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todays.reduce((n, o) => n + o.total, 0);
  const units = todays.reduce((n, o) => n + o.items.reduce((m, i) => m + i.qty, 0), 0);
  const pendingOrders = orders.filter(
    (o) => o.fulfillmentStatus === "CONFIRMED" || o.fulfillmentStatus === "PACKING",
  );
  const awaitingPacking = pendingOrders.length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);

  const packingLines = (() => {
    const map = new Map<string, { name: string; qty: number }>();
    for (const o of pendingOrders) {
      for (const item of o.items) {
        const existing = map.get(item.productId);
        if (existing) existing.qty += item.qty;
        else map.set(item.productId, { name: item.nameSnapshot, qty: item.qty });
      }
    }
    return [...map.values()].sort((a, b) => b.qty - a.qty);
  })();

  const kpis = [
    { label: "Today's orders", value: todays.length },
    { label: "Today's revenue", value: formatPrice(todayRevenue) },
    { label: "Units sold today", value: units },
    { label: "Awaiting packing", value: awaitingPacking },
    { label: "Low-stock products", value: lowStock.length },
    { label: "Total orders", value: orders.length },
  ];

  return (
    <div className="container py-10">
      <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">Good day 🌿</h1>
      <p className="mt-1 text-sm text-forest/60">Here&apos;s what needs attention today.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-forest/8 bg-white/60 p-4">
            <p className="text-xs text-forest/55">{k.label}</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-forest">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">Recent orders</h2>
            <Link href="/studio/orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-moss">
              Manage <ArrowRight width={15} />
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-forest/55">No orders yet. Place one from the storefront to see it here.</p>
          ) : (
            <ul className="mt-3 divide-y divide-forest/8">
              {orders.slice(0, 5).map((o) => (
                <li key={o.orderNumber} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <Link
                    href={`/studio/orders/${o.orderNumber}`}
                    className="font-medium text-forest hover:text-moss"
                  >
                    #{o.orderNumber}
                  </Link>
                  <span className="text-forest/55">{o.address.fullName}</span>
                  <span className="font-semibold text-forest">{formatPrice(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Packing */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">Packing list</h2>
            <Link href="/studio/packing" className="inline-flex items-center gap-1.5 text-sm font-medium text-moss">
              View all <ArrowRight width={15} />
            </Link>
          </div>
          {packingLines.length === 0 ? (
            <p className="mt-4 text-sm text-forest/55">Nothing to pack right now.</p>
          ) : (
            <ul className="mt-3 divide-y divide-forest/8">
              {packingLines.slice(0, 5).map((line) => (
                <li key={line.name} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-forest">{line.name}</span>
                  <span className="rounded-full bg-moss/10 px-2.5 py-0.5 text-xs font-semibold text-moss">
                    {line.qty} unit{line.qty === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Low stock */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">Low stock</h2>
            <Link href="/studio/products" className="inline-flex items-center gap-1.5 text-sm font-medium text-moss">
              Manage products <ArrowRight width={15} />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-forest/55">Everything is well stocked.</p>
          ) : (
            <ul className="mt-3 divide-y divide-forest/8">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-forest">{p.name}</span>
                  <span className="rounded-full bg-clay/10 px-2.5 py-0.5 text-xs font-medium text-clay">
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
