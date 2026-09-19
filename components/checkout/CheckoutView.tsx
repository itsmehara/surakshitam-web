"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useCart, MAX_NOTE } from "@/lib/cart/CartContext";
import {
  EMPTY_CUSTOMER,
  clearCustomer,
  loadCustomer,
  newOrderId,
  orderMessage,
  rememberSentOrder,
  saveCustomer,
  submitOrder,
  validateCustomer,
  whatsAppOrderHref,
  type Customer,
  type CustomerErrors,
} from "@/lib/order";
import { trackWhatsAppClick } from "@/lib/enquiry";
import { OrderSummary } from "./OrderSummary";
import { PageIntro } from "@/components/ui/PageIntro";
import { Field, inputClass } from "@/components/ui/FormField";
import { WhatsAppIcon, CartIcon, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * /checkout/ — order summary, delivery details, one button
 * (PRODUCT-CATALOG-NOTES-2026-09-19 §7.3). A page rather than the drawer: an
 * address needs room on a phone.
 *
 * On submit: order ID is made here (never depends on the server); WhatsApp is
 * opened *synchronously* inside the submit handler so popup blockers let it
 * through; the Sheet POST runs alongside (keepalive) and reports into
 * /order-sent/ via sessionStorage. The cart is cleared only after WhatsApp
 * has been opened. If the Sheet save fails the order still went out on
 * WhatsApp with the full delivery details — that is the order channel.
 */
export function CheckoutView() {
  const router = useRouter();
  const { lines, ready, note, setNote, clear } = useCart();
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [remembered, setRemembered] = useState(false);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = loadCustomer();
    if (saved && (saved.name || saved.phone)) {
      setCustomer(saved);
      setRemembered(true);
    }
  }, []);

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer((c) => ({ ...c, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function forget() {
    clearCustomer();
    setCustomer(EMPTY_CUSTOMER);
    setRemembered(false);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || lines.length === 0) return;
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    const errs = validateCustomer(customer);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = Object.keys(errs)[0];
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    setSending(true);

    const orderId = newOrderId();
    const message = orderMessage(orderId, lines, customer, note);
    const href = whatsAppOrderHref(message);

    // 1. WhatsApp first, inside the user gesture.
    const opened = window.open(href, "_blank", "noopener");
    trackWhatsAppClick({ cta: "order", product: orderId });

    // 2. Remember details for next time; hand the message to /order-sent/.
    saveCustomer(customer);
    rememberSentOrder({ orderId, message, href, sheet: "pending", at: Date.now() });

    // 3. Save to the Orders tab — not awaited; the result lands in sessionStorage.
    void submitOrder({ orderId, lines, customer, note, website }).then((r) => {
      rememberSentOrder({ orderId, message, href, sheet: r.ok ? "ok" : "failed", at: Date.now() });
    });

    // 4. Cart is cleared only once WhatsApp has been opened.
    if (opened) clear();
    router.push(`/order-sent/?id=${orderId}${opened ? "" : "&blocked=1"}`);
  }

  if (!ready) return <div className="container py-16" />;

  if (lines.length === 0) {
    return (
      <>
        <PageIntro eyebrow="Checkout" title="Your cart is empty" />
        <div className="container py-10">
          <p className="text-sm text-forest/65">Add a few products first — then come back here to order them on WhatsApp.</p>
          <Link href="/shop" className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-ink">
            <CartIcon width={16} /> Browse products
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Checkout"
        title="Where should we deliver?"
        intro="Your order goes to us on WhatsApp with these details. We confirm availability and delivery, you pay on WhatsApp, we pack and deliver."
      />
      <div className="container grid gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="lg:order-2">
          <h2 className="font-serif text-xl font-semibold text-forest">Your order</h2>
          <div className="mt-3">
            <OrderSummary lines={lines} />
          </div>
          <Link href="/shop" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-moss hover:text-forest">
            Add more products <ArrowRight width={14} />
          </Link>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4 lg:order-1" aria-busy={sending}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-xl font-semibold text-forest">Delivery details</h2>
            {remembered && (
              <button type="button" onClick={forget} className="text-xs text-forest/55 underline underline-offset-2 hover:text-clay">
                Not you? Clear
              </button>
            )}
          </div>

          <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
            <Field idPrefix="co" label="Name" name="name" required autoComplete="name" value={customer.name} onChange={set("name")} error={errors.name} maxLength={60} />
            <Field
              idPrefix="co"
              label="Mobile / WhatsApp"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="10-digit mobile"
              value={customer.phone}
              onChange={set("phone")}
              error={errors.phone}
            />
          </div>

          <div>
            <label htmlFor="co-address" className="mb-1 block text-sm font-medium text-forest">
              Delivery address <span className="text-clay">*</span>
            </label>
            <textarea
              id="co-address"
              name="address"
              rows={3}
              required
              autoComplete="street-address"
              maxLength={200}
              placeholder={"House / flat, street, area\nLandmark (optional)"}
              value={customer.address}
              onChange={set("address")}
              aria-invalid={errors.address ? true : undefined}
              className={cn(inputClass, errors.address && "border-clay focus:border-clay")}
            />
            {errors.address && <p className="mt-1 text-xs text-clay">{errors.address}</p>}
          </div>

          <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
            <Field idPrefix="co" label="City" name="city" required autoComplete="address-level2" value={customer.city} onChange={set("city")} error={errors.city} />
            <Field
              idPrefix="co"
              label="Pincode"
              name="pincode"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={customer.pincode}
              onChange={set("pincode")}
              error={errors.pincode}
              hint="Delivery charges, if any, are confirmed on WhatsApp."
            />
          </div>

          <Field idPrefix="co" label="Email (optional)" name="email" type="email" autoComplete="email" value={customer.email} onChange={set("email")} error={errors.email} />

          <div>
            <label htmlFor="co-note" className="mb-1 block text-sm font-medium text-forest">
              Note (optional)
            </label>
            <textarea
              id="co-note"
              name="note"
              rows={2}
              maxLength={MAX_NOTE}
              placeholder="Gift wrap, a question, a preferred delivery time…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Honeypot — hidden from humans, filled by bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="co-website">Website</label>
            <input id="co-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            <WhatsAppIcon width={20} height={20} /> {sending ? "Opening WhatsApp…" : "Send order on WhatsApp"}
          </button>
          <p className="text-center text-xs leading-relaxed text-forest/55">
            No payment here. Pay on WhatsApp once we confirm, and send us the payment screenshot — we pack and deliver.
            <br />
            We use these details only to deliver your order.
          </p>
        </form>
      </div>
    </>
  );
}
