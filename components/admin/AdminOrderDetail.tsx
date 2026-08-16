"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrder, FULFILLMENT_FLOW, FULFILLMENT_LABEL, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { OrderStatusControl } from "./OrderStatusControl";

export function AdminOrderDetail({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrder(orderNumber) ?? null);
  }, [orderNumber]);

  if (order === undefined) {
    return <div className="container py-24 text-center text-forest/50">Loading…</div>;
  }

  if (order === null) {
    return (
      <div className="container py-16 text-center text-forest/60">
        Order not found.{" "}
        <Link href="/studio/orders" className="text-moss underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const currentIdx = FULFILLMENT_FLOW.indexOf(order.fulfillmentStatus);

  return (
    <div className="container max-w-3xl py-10">
      <Link href="/studio/orders" className="text-sm font-medium text-moss hover:text-forest">
        ← Orders
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
          Order #{order.orderNumber}
        </h1>
        <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-medium text-forest">
          {new Date(order.createdAt).toLocaleString("en-IN")}
        </span>
      </div>

      {/* Status timeline + control */}
      <section className="mt-6 rounded-lg border border-forest/8 bg-white/60 p-5">
        <h2 className="font-serif text-lg font-semibold text-forest">Fulfilment status</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {FULFILLMENT_FLOW.map((s, i) => (
            <span
              key={s}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                i <= currentIdx ? "bg-moss text-cream" : "bg-forest/8 text-forest/50"
              }`}
            >
              {FULFILLMENT_LABEL[s]}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-forest/8 pt-4">
          <OrderStatusControl order={order} onUpdated={setOrder} />
          <Link
            href={`/order/${order.orderNumber}`}
            className="ml-auto text-sm font-medium text-moss hover:text-forest"
          >
            Customer view
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Delivery address</h2>
          <p className="mt-2 text-sm text-forest/75">
            {order.address.fullName} · {order.address.phone}
            {order.address.altPhone ? ` / ${order.address.altPhone}` : ""}
            <br />
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
            {order.address.landmark ? ` (${order.address.landmark})` : ""}
            <br />
            {order.address.city}, {order.address.state} – {order.address.postalCode}
          </p>
        </section>
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Payment</h2>
          <p className="mt-2 text-sm text-forest/75">
            Status: <span className="font-medium text-moss">{order.paymentStatus}</span>
            <br />
            Payment ID: {order.paymentId}
          </p>
        </section>
      </div>

      {/* Items */}
      <section className="mt-6 rounded-lg border border-forest/8 bg-white/60 p-5">
        <h2 className="font-serif text-lg font-semibold text-forest">Items</h2>
        <ul className="mt-3 divide-y divide-forest/8">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div>
                <p className="font-medium text-forest">{item.nameSnapshot}</p>
                <p className="text-xs text-forest/50">
                  {item.skuSnapshot} · {item.size} · ×{item.qty}
                </p>
              </div>
              <p className="font-medium text-forest">{formatPrice(item.priceSnapshot * item.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-forest/8 pt-4 text-sm">
          <div className="flex justify-between text-forest/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-forest/70">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-semibold text-forest">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
