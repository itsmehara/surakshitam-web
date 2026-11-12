"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useCart, MAX_NOTE } from "@/lib/cart/CartContext";
import {
  EMPTY_CUSTOMER,
  clearCustomer,
  loadCustomer,
  newOrderId,
  NO_PAYMENT,
  validatePayment,
  type Payment,
  orderMessage,
  orderCharges,
  rupees,
  rememberSentOrder,
  saveCustomer,
  submitOrder,
  validateCustomer,
  whatsAppOrderHref,
  type Customer,
  type CustomerErrors,
} from "@/lib/order";
import { trackWhatsAppClick } from "@/lib/enquiry";
import { FREE_DELIVERY_OVER, rapidoAvailable, type DeliveryMethod } from "@/lib/delivery";
import { OrderSummary } from "./OrderSummary";
import { UpiPayment } from "./UpiPayment";
import { PageIntro } from "@/components/ui/PageIntro";
import { Field, inputClass } from "@/components/ui/FormField";
import { INDIAN_STATES, deliveryHint, isIndianPincode, stateFromPincode } from "@/lib/india";
import { fillFromOffice, lookupPincode, pickableOffices, type PostOffice } from "@/lib/pincode";
import { WhatsAppIcon, CartIcon, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * /checkout/ — order summary, delivery details, one button ("Order on WhatsApp")
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
  const [payment, setPayment] = useState<Payment>(NO_PAYMENT);
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  // One order ID per checkout visit: the UPI payment note and the WhatsApp message share it.
  const [checkoutOrderId, setCheckoutOrderId] = useState("");
  // Post offices for the pincode, and where the lookup stands (lib/pincode.ts).
  const [offices, setOffices] = useState<PostOffice[]>([]);
  const [lookup, setLookup] = useState<"idle" | "loading" | "ok" | "not-found" | "unavailable">("idle");
  // City and State the customer typed or picked for the current pincode. A lookup never overwrites them.
  const touched = useRef({ city: false, state: false });

  useEffect(() => {
    setCheckoutOrderId(newOrderId());
    const saved = loadCustomer();
    if (saved && (saved.name || saved.phone)) {
      setCustomer(saved);
      setRemembered(true);
      // Remembered City and State count as the customer's, so this visit's lookup keeps them.
      touched.current = { city: !!saved.city, state: !!saved.state };
    }
  }, []);

  // Pincode → City, State and post office (lib/pincode.ts). A failed or slow lookup changes nothing.
  const pinNow = customer.pincode.trim();
  useEffect(() => {
    if (!isIndianPincode(pinNow)) {
      setOffices([]);
      setLookup("idle");
      return;
    }
    let live = true;
    setLookup("loading");
    lookupPincode(pinNow).then((out) => {
      if (!live) return;
      if (out.status !== "ok") {
        setOffices([]);
        setLookup(out.status);
        return;
      }
      const list = pickableOffices(out.offices);
      setOffices(list);
      setLookup("ok");
      // Keep the post office the customer picked if this pincode still has it; otherwise the first delivering one.
      setCustomer((c) => fillFromOffice(c, list.find((o) => o.name === c.postOffice) ?? list[0], touched.current));
    });
    return () => {
      live = false;
    };
  }, [pinNow]);

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    if (k === "city" || k === "state") touched.current[k] = true;
    // A new pincode starts the City and State afresh; the lookup refills them. The pincode alone pre-selects the State until then.
    if (k === "pincode" && value !== customer.pincode) touched.current = { city: false, state: false };
    setCustomer((c) => {
      const next = { ...c, [k]: value };
      if (k === "pincode" && value !== c.pincode) {
        next.city = "";
        next.state = stateFromPincode(value) ?? "";
        next.postOffice = "";
      }
      return next;
    });
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const setMethod = (m: DeliveryMethod) => setCustomer((c) => ({ ...c, deliveryMethod: m }));

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
    const payErr = validatePayment(payment);
    if (Object.keys(errs).length || payErr) {
      setErrors(errs);
      setPaymentError(payErr);
      const first = Object.keys(errs)[0] ?? "paymentRef";
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    setSending(true);

    const orderId = checkoutOrderId || newOrderId();
    const message = orderMessage(orderId, lines, customer, note, payment);
    const href = whatsAppOrderHref(message);

    // 1. WhatsApp first, inside the user gesture.
    const opened = window.open(href, "_blank", "noopener");
    trackWhatsAppClick({ cta: "order", product: orderId });

    // 2. Remember details for next time; hand the message to /order-sent/.
    saveCustomer(customer);
    rememberSentOrder({ orderId, message, href, sheet: "pending", at: Date.now(), paid: payment.paid });

    // 3. Save to the Orders tab — not awaited; the result lands in sessionStorage.
    void submitOrder({ orderId, lines, customer, note, payment, website }).then((r) => {
      rememberSentOrder({ orderId, message, href, sheet: r.ok ? "ok" : "failed", at: Date.now(), paid: payment.paid });
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

  // Delivery by courier or Rapido (lib/delivery.ts); the QR and the summary read the same numbers.
  // Rapido is offered only for a Hyderabad pincode. Anywhere else the choice is courier.
  const rapidoOk = rapidoAvailable(pinNow);
  const method: DeliveryMethod = rapidoOk ? customer.deliveryMethod : "courier";
  const freeOver = rupees(FREE_DELIVERY_OVER);
  const charges = orderCharges(lines, customer);

  return (
    <>
      <PageIntro
        eyebrow="Checkout"
        title="Where should we deliver?"
        intro={`We deliver across India by courier, and in Hyderabad and Secunderabad you can choose Rapido. Courier is charged by weight and state. Courier orders over ${freeOver} get a special delivery discount. Your order goes to us on WhatsApp with these details. We confirm availability on WhatsApp, and you pay by UPI here or on WhatsApp, then we pack and send.`}
      />
      <div className="container grid gap-8 py-8 sm:py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="lg:order-2">
          <h2 className="font-serif text-xl font-semibold text-forest">Your order</h2>
          <div className="mt-3">
            <OrderSummary lines={lines} charges={charges} />
          </div>
          <Link href="/shop" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-moss hover:text-forest">
            Add more products <ArrowRight width={14} />
          </Link>
          <UpiPayment charges={charges} orderId={checkoutOrderId} />
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

          <div className="grid gap-x-3 gap-y-3 sm:grid-cols-3">
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
            />
            <Field idPrefix="co" label="City / town" name="city" required autoComplete="address-level2" value={customer.city} onChange={set("city")} error={errors.city} />
            <div>
              <label htmlFor="co-state" className="mb-1 block text-sm font-medium text-forest">
                State <span className="text-clay">*</span>
              </label>
              <select
                id="co-state"
                name="state"
                required
                autoComplete="address-level1"
                value={customer.state}
                onChange={set("state")}
                aria-invalid={errors.state ? true : undefined}
                className={cn(inputClass, "h-10", errors.state && "border-clay focus:border-clay")}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-xs text-clay">{errors.state}</p>}
            </div>
            <p className="text-xs text-forest/55 sm:col-span-3">{deliveryHint(customer.pincode)}</p>
            {lookup === "loading" && <p role="status" className="text-xs text-forest/55 sm:col-span-3">Looking up your pincode…</p>}
            {lookup === "not-found" && (
              <p role="status" className="text-xs text-clay sm:col-span-3">
                We couldn&apos;t find this pincode. Check it, or enter city and state by hand.
              </p>
            )}
            {lookup === "unavailable" && (
              <p role="status" className="text-xs text-forest/55 sm:col-span-3">
                Pincode lookup is unavailable right now. Enter city and state by hand.
              </p>
            )}
            {lookup === "ok" && offices.length > 0 && (
              <div className="sm:col-span-3">
                <label htmlFor="co-postoffice" className="mb-1 block text-sm font-medium text-forest">
                  Post office
                </label>
                <select
                  id="co-postoffice"
                  name="postOffice"
                  value={customer.postOffice}
                  onChange={(e) => {
                    const office = offices.find((o) => o.name === e.target.value);
                    if (office) setCustomer((c) => fillFromOffice(c, office, touched.current));
                  }}
                  className={cn(inputClass, "h-10")}
                >
                  {offices.map((o) => (
                    <option key={o.name} value={o.name}>
                      {o.district ? `${o.name} (${o.district})` : o.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-forest/55">Filled from your pincode. Pick another post office if it is nearer.</p>
              </div>
            )}
          </div>

          {/* Courier, or Rapido for Hyderabad and Secunderabad pincodes (500xxx) only. */}
          <fieldset className="rounded-lg border border-forest/10 bg-white/70 p-3">
            <legend className="px-1 text-sm font-medium text-forest">How should we deliver?</legend>
            <label className="flex cursor-pointer items-start gap-2.5 py-1.5 text-sm text-forest">
              <input
                type="radio"
                name="deliveryMethod"
                value="courier"
                checked={method === "courier"}
                onChange={() => setMethod("courier")}
                className="mt-1 h-4 w-4 accent-moss"
              />
              <span>
                <span className="font-medium">Courier</span>
                <span className="block text-xs text-forest/55">
                  Charged by weight and state, added to your total. Special delivery discount on orders over {freeOver}.
                </span>
              </span>
            </label>
            {rapidoOk ? (
              <label className="flex cursor-pointer items-start gap-2.5 py-1.5 text-sm text-forest">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="rapido"
                  checked={method === "rapido"}
                  onChange={() => setMethod("rapido")}
                  className="mt-1 h-4 w-4 accent-moss"
                />
                <span>
                  <span className="font-medium">Rapido, Hyderabad and Secunderabad</span>
                  <span className="block text-xs text-forest/55">
                    You pay the Rapido fare to the rider, so it is not in your total.
                  </span>
                </span>
              </label>
            ) : (
              pinNow.length === 6 && (
                <p className="px-1 py-1.5 text-xs text-forest/55">Rapido is for Hyderabad and Secunderabad pincodes only.</p>
              )
            )}
          </fieldset>

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

          {/* Already paid? Optional — the normal flow is pay after we confirm on WhatsApp. */}
          <div className="rounded-lg border border-forest/10 bg-white/70 p-3">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-forest">
              <input
                type="checkbox"
                name="paid"
                checked={payment.paid}
                onChange={(e) => {
                  setPayment((p) => ({ ...p, paid: e.target.checked }));
                  setPaymentError(undefined);
                }}
                className="mt-0.5 h-4 w-4 accent-moss"
              />
              <span>
                <span className="font-medium">I&apos;ve already paid by UPI</span>
                <span className="block text-xs text-forest/55">
                  Paid with the UPI QR above, or another UPI payment? Paste the transaction ID so we can match it.
                  Otherwise, pay on WhatsApp once we confirm.
                </span>
              </span>
            </label>
            {payment.paid && (
              <div className="mt-3">
                <Field
                  idPrefix="co"
                  label="UPI transaction ID / UTR"
                  name="paymentRef"
                  required
                  autoComplete="off"
                  inputMode="text"
                  placeholder="e.g. 412345678901"
                  maxLength={40}
                  value={payment.ref}
                  onChange={(e) => {
                    setPayment((p) => ({ ...p, ref: e.target.value }));
                    setPaymentError(undefined);
                  }}
                  error={paymentError}
                  hint="From your UPI app's payment details. We confirm it on WhatsApp before packing."
                />
              </div>
            )}
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
            <WhatsAppIcon width={20} height={20} /> {sending ? "Opening WhatsApp…" : "Order on WhatsApp"}
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
