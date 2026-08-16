"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrder, type Order } from "@/lib/orders";
import { getProfile } from "@/lib/profile";
import { formatPrice } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import { CheckIcon, ArrowRight, WhatsAppIcon } from "@/components/icons";

const NEXT_STEPS = ["Order received", "Packing", "Packed", "Shipped", "Delivered"];

export default function OrderPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrder(params.orderNumber) ?? null);
  }, [params.orderNumber]);

  if (order === undefined) {
    return <div className="container py-24 text-center text-forest/60">Loading your order…</div>;
  }

  if (order === null) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="font-serif text-3xl font-semibold text-forest">Order not found</h1>
        <p className="mt-3 max-w-md text-forest/70">
          We couldn&apos;t find order <span className="font-medium">{params.orderNumber}</span> in this
          browser. Orders in this demo are saved locally on the device used to place them.
        </p>
        <div className="mt-8">
          <LinkButton href="/shop">Continue shopping</LinkButton>
        </div>
      </div>
    );
  }

  const rawName = order.address.fullName.trim();
  const orderFirst = rawName && !/^\d/.test(rawName) ? rawName.split(/\s+/)[0] : "";
  const firstName = orderFirst || getProfile().name.trim().split(/\s+/)[0] || "";

  return (
    <div className="container max-w-3xl py-12 sm:py-16">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-moss/15 text-moss">
          <CheckIcon width={30} />
        </span>
        <h1 className="mt-5 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          {firstName ? `Thank you, ${firstName}!` : "Thank you for your order!"}
        </h1>
        <p className="mt-2 text-forest/70">Your order has been placed successfully.</p>
        <p className="mt-4 rounded-full bg-parchment px-4 py-1.5 text-sm font-medium text-forest">
          Order #{order.orderNumber}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#128C4B]">
          <WhatsAppIcon width={16} /> A WhatsApp confirmation was sent to {order.address.phone} (demo)
        </p>
        <Link href="/studio/dev/notifications" className="mt-1 text-xs text-forest/40 underline">
          View simulated notifications
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Delivery address</h2>
          <p className="mt-2 text-sm text-forest/75">
            {order.address.fullName} · {order.address.phone}
            <br />
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
            <br />
            {order.address.city}, {order.address.state} – {order.address.postalCode}
          </p>
        </div>
        <div className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Payment</h2>
          <p className="mt-2 text-sm text-forest/75">
            <span className="inline-flex items-center gap-1.5 font-medium text-moss">
              <CheckIcon width={15} /> Paid · {formatPrice(order.total)}
            </span>
            <br />
            Razorpay — Demo
            <br />
            <span className="text-forest/50">Payment ID: {order.paymentId}</span>
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-5 rounded-lg border border-forest/8 bg-white/60 p-5">
        <h2 className="font-serif text-lg font-semibold text-forest">Your items</h2>
        <ul className="mt-3 divide-y divide-forest/8">
          {order.items.map((it) => (
            <li key={it.productId} className="flex items-center gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-forest/8 bg-cream">
                <Image src={it.image} alt={it.nameSnapshot} fill sizes="56px" className="scale-[1.12] object-cover object-[50%_55%]" />
              </div>
              <div className="flex-1 text-sm">
                <Link href={`/product/${it.slug}`} className="font-medium text-forest hover:text-moss">
                  {it.nameSnapshot}
                </Link>
                <p className="text-forest/50">Qty {it.qty} · {it.size}</p>
              </div>
              <span className="text-sm font-semibold text-forest">
                {formatPrice(it.priceSnapshot * it.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-sm">
          <span className="text-forest/70">Total (incl. {formatPrice(order.shipping)} shipping)</span>
          <span className="font-semibold text-forest">{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* What happens next */}
      <div className="mt-5 rounded-lg border border-forest/8 bg-parchment/50 p-5">
        <h2 className="font-serif text-lg font-semibold text-forest">What happens next</h2>
        <ol className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
          {NEXT_STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-semibold ${
                  i === 0 ? "bg-moss text-cream" : "bg-forest/10 text-forest/50"
                }`}
              >
                {i === 0 ? <CheckIcon width={12} /> : i + 1}
              </span>
              <span className={i === 0 ? "font-medium text-forest" : "text-forest/55"}>{s}</span>
              {i < NEXT_STEPS.length - 1 && <span className="text-forest/25">→</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/track-order">
          Track order <ArrowRight width={16} />
        </LinkButton>
        <LinkButton href="/shop" variant="outline">
          Continue shopping
        </LinkButton>
      </div>
      <p className="mt-8 text-center text-xs text-forest/40">
        Demo order — no real payment was taken and nothing will be dispatched.
      </p>
    </div>
  );
}
