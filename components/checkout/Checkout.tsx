"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { RazorpayMockModal } from "./RazorpayMockModal";
import {
  createOrder,
  generateOrderNumber,
  getSavedAddress,
  saveAddress,
  type Address,
  type Order,
} from "@/lib/orders";
import { getProfile } from "@/lib/profile";
import { getSession } from "@/lib/auth";
import { logEvent } from "@/lib/audit";
import { applyOfferCode, type Offer } from "@/lib/offers";
import { getBundleDiscountForCart } from "@/lib/bundles";
import {
  mockNotificationProvider,
  customerOrderPlaced,
  adminNewOrder,
} from "@/lib/notifications";
import { LinkButton } from "@/components/ui/Button";
import { CartIcon, CheckIcon, ShieldIcon, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/cn";

const FREE_SHIP = 59900;
const SHIP_FEE = 4900;
const STEPS = ["Contact", "Address", "Review", "Payment"] as const;

const emptyAddress: Address = {
  fullName: "",
  phone: "",
  altPhone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  type: "Home",
};

export function Checkout() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [saveAddr, setSaveAddr] = useState(true);
  const [addrError, setAddrError] = useState("");
  const [failed, setFailed] = useState(false);
  const [razorOpen, setRazorOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const saved = getSavedAddress();
    if (saved) {
      setAddress(saved);
      return;
    }
    // No saved address yet — seed sensible defaults from the account profile.
    const p = getProfile();
    const parts = p.address.split(",").map((s) => s.trim());
    const pin = parts.find((s) => /^\d{6}$/.test(s)) ?? "";
    setAddress((a) => ({
      ...a,
      fullName: p.name,
      phone: p.mobile.replace(/\D/g, "").slice(-10),
      line1: parts[0] ?? "",
      city: parts[1] ?? "",
      state: parts[2] ?? "",
      postalCode: pin,
    }));
  }, []);

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-parchment text-forest/60">
          <CartIcon width={28} />
        </span>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-forest/70">Add something before checking out.</p>
        <div className="mt-8">
          <LinkButton href="/shop" size="lg">
            Start shopping
          </LinkButton>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIP ? 0 : SHIP_FEE;
  const cartProductIds = items.flatMap(({ product, qty }) => Array(qty).fill(product.id));
  const comboMatches = getBundleDiscountForCart(cartProductIds);
  const comboDiscount = comboMatches.reduce((sum, m) => sum + m.discount, 0);
  const total = Math.max(0, subtotal + shipping - discount - comboDiscount);

  const setA = (k: keyof Address, v: string) => setAddress((a) => ({ ...a, [k]: v }));

  function applyCoupon() {
    const result = applyOfferCode(couponInput, subtotal);
    if (!result.ok) {
      setCouponError(result.reason);
      setAppliedOffer(null);
      setDiscount(0);
      return;
    }
    setCouponError("");
    setAppliedOffer(result.offer);
    setDiscount(result.discount);
  }

  function removeCoupon() {
    setAppliedOffer(null);
    setDiscount(0);
    setCouponInput("");
    setCouponError("");
  }

  function verifyOtp() {
    if (otp.trim() === "123456") {
      setOtpError("");
      if (!address.phone) setA("phone", phone);
      setStep(1);
    } else {
      setOtpError("Incorrect OTP. For this demo, use 123456.");
    }
  }

  function submitAddress() {
    const req: (keyof Address)[] = ["fullName", "phone", "line1", "city", "state", "postalCode"];
    if (req.some((k) => !address[k]?.trim())) {
      setAddrError("Please fill in all required fields.");
      return;
    }
    if (!/^\d{6}$/.test(address.postalCode.trim())) {
      setAddrError("Please enter a valid 6-digit PIN code.");
      return;
    }
    setAddrError("");
    setStep(2);
  }

  function finalizeOrder(paymentId: string) {
    const orderNumber = generateOrderNumber();
    const order: Order = {
      orderNumber,
      createdAt: new Date().toISOString(),
      items: items.map(({ product, qty }) => ({
        productId: product.id,
        slug: product.slug,
        nameSnapshot: product.name,
        skuSnapshot: product.sku,
        priceSnapshot: product.price,
        qty,
        image: product.image,
        size: product.size,
      })),
      subtotal,
      shipping,
      discount: discount + comboDiscount || undefined,
      offerCode: appliedOffer?.code,
      total,
      address,
      paymentStatus: "PAID",
      paymentId,
      fulfillmentStatus: "CONFIRMED",
      // Attribute to the signed-in customer; guests are matched later by phone.
      userId: getSession()?.id ?? address.phone,
    };
    createOrder(order);
    if (saveAddr) saveAddress(address);
    // Simulate WhatsApp notifications (customer + admin).
    void mockNotificationProvider.send(customerOrderPlaced(order));
    void mockNotificationProvider.send(adminNewOrder(order));
    const s = getSession();
    logEvent({
      type: "order_placed",
      actor: s ? { kind: "customer", id: s.id, name: s.name } : { kind: "guest" },
      meta: { orderNumber, total },
    });
    setRazorOpen(false);
    clear();
    router.push(`/order/${orderNumber}`);
  }

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">Checkout</h1>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                i < step
                  ? "bg-moss text-cream"
                  : i === step
                    ? "bg-forest text-cream"
                    : "bg-forest/10 text-forest/50",
              )}
            >
              {i < step ? <CheckIcon width={14} /> : i + 1}
            </span>
            <span className={i === step ? "font-medium text-forest" : "text-forest/50"}>{label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {/* Step 1 — Contact */}
          {step === 0 && (
            <section className="rounded-lg border border-forest/8 bg-white/60 p-6">
              <h2 className="font-serif text-xl font-semibold text-forest">Contact</h2>
              <p className="mt-1 text-sm text-forest/60">
                Verify your mobile with an OTP, or continue as a guest.
              </p>
              <div className="mt-5 max-w-sm space-y-3">
                <label className="block text-sm font-medium text-forest">Mobile number</label>
                <input
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile"
                  className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm focus:border-moss focus:outline-none"
                />
                {!otpSent ? (
                  <button
                    type="button"
                    disabled={phone.length !== 10}
                    onClick={() => setOtpSent(true)}
                    className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                ) : (
                  <>
                    <label className="block pt-2 text-sm font-medium text-forest">Enter OTP</label>
                    <input
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit OTP"
                      className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm focus:border-moss focus:outline-none"
                    />
                    <p className="text-xs text-moss">Demo OTP: 123456</p>
                    {otpError && <p className="text-xs text-clay">{otpError}</p>}
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
                    >
                      Verify &amp; continue
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="block pt-2 text-sm font-medium text-forest/60 hover:text-forest"
                >
                  Continue as guest →
                </button>
              </div>
            </section>
          )}

          {/* Step 2 — Address */}
          {step === 1 && (
            <section className="rounded-lg border border-forest/8 bg-white/60 p-6">
              <h2 className="font-serif text-xl font-semibold text-forest">Delivery address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" req value={address.fullName} onChange={(v) => setA("fullName", v)} />
                <Field label="Phone" req value={address.phone} onChange={(v) => setA("phone", v.replace(/\D/g, "").slice(0, 10))} />
                <Field label="House / Flat" req value={address.line1} onChange={(v) => setA("line1", v)} />
                <Field label="Street / Area" value={address.line2 ?? ""} onChange={(v) => setA("line2", v)} />
                <Field label="Landmark" value={address.landmark ?? ""} onChange={(v) => setA("landmark", v)} />
                <Field label="City" req value={address.city} onChange={(v) => setA("city", v)} />
                <Field label="State" req value={address.state} onChange={(v) => setA("state", v)} />
                <Field label="PIN code" req value={address.postalCode} onChange={(v) => setA("postalCode", v.replace(/\D/g, "").slice(0, 6))} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex gap-2">
                  {(["Home", "Work", "Other"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setA("type", t)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm",
                        address.type === t
                          ? "border-forest bg-forest text-cream"
                          : "border-forest/15 text-forest",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-forest/70">
                  <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} />
                  Save this address
                </label>
              </div>
              {addrError && <p className="mt-3 text-sm text-clay">{addrError}</p>}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="text-sm font-medium text-forest/60 hover:text-forest">
                  Back
                </button>
                <button
                  type="button"
                  onClick={submitAddress}
                  className="ml-auto rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-ink"
                >
                  Continue to review
                </button>
              </div>
            </section>
          )}

          {/* Step 3 — Review */}
          {step === 2 && (
            <section className="space-y-5">
              <div className="rounded-lg border border-forest/8 bg-white/60 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-forest">Deliver to</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-moss">
                    Edit
                  </button>
                </div>
                <p className="mt-3 text-sm text-forest/80">
                  <span className="font-medium text-forest">{address.fullName}</span> · {address.phone}
                  <br />
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                  {address.landmark ? `, ${address.landmark}` : ""}
                  <br />
                  {address.city}, {address.state} – {address.postalCode}
                  <span className="ml-2 rounded-full bg-parchment px-2 py-0.5 text-xs">{address.type}</span>
                </p>
              </div>
              <div className="rounded-lg border border-forest/8 bg-white/60 p-6">
                <h2 className="font-serif text-xl font-semibold text-forest">Items</h2>
                <ul className="mt-3 divide-y divide-forest/8">
                  {items.map(({ product, qty }) => (
                    <li key={product.id} className="flex items-center gap-3 py-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-forest/8 bg-cream">
                        <Image src={product.image} alt={product.name} fill sizes="56px" className="scale-[1.12] object-cover object-[50%_55%]" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-forest">{product.name}</p>
                        <p className="text-forest/50">Qty {qty} · {product.size}</p>
                      </div>
                      <span className="text-sm font-semibold text-forest">{formatPrice(product.price * qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-forest/8 bg-white/60 p-6">
                <h2 className="font-serif text-xl font-semibold text-forest">Offer code</h2>
                {appliedOffer ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-moss/10 px-4 py-2.5">
                    <p className="text-sm text-moss">
                      <span className="font-semibold">{appliedOffer.code}</span> applied — you saved{" "}
                      {formatPrice(discount)}.
                    </p>
                    <button type="button" onClick={removeCoupon} className="text-sm font-medium text-forest/60 hover:text-forest">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex max-w-sm gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm uppercase focus:border-moss focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="mt-2 text-sm text-clay">{couponError}</p>}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-forest/60 hover:text-forest">
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="ml-auto rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-ink"
                >
                  Continue to payment
                </button>
              </div>
            </section>
          )}

          {/* Step 4 — Payment */}
          {step === 3 && (
            <section className="rounded-lg border border-forest/8 bg-white/60 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-forest">Payment</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-parchment px-3 py-1 text-xs font-medium text-forest/70">
                  <ShieldIcon width={14} /> Razorpay · Demo
                </span>
              </div>

              {failed ? (
                <div className="mt-5 rounded-lg border border-clay/30 bg-clay/5 p-5 text-center">
                  <p className="font-serif text-lg font-semibold text-clay">Payment unsuccessful</p>
                  <p className="mt-1 text-sm text-forest/70">No order has been confirmed.</p>
                  <div className="mt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFailed(false);
                        setRazorOpen(true);
                      }}
                      className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
                    >
                      Try again
                    </button>
                    <Link href="/cart" className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5">
                      Return to cart
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-4 rounded-lg bg-parchment/60 p-4 text-sm text-forest/70">
                    You&apos;ll pay securely via Razorpay. This is a demo gateway — no real payment is
                    taken.
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-forest/10 px-4 py-3">
                    <span className="text-sm text-forest/70">Amount payable</span>
                    <span className="text-lg font-semibold text-forest">{formatPrice(total)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRazorOpen(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream hover:bg-ink"
                  >
                    <ShieldIcon width={16} /> Pay {formatPrice(total)} securely
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="mt-4 text-sm font-medium text-forest/60 hover:text-forest">
                    Back
                  </button>
                </>
              )}
            </section>
          )}
        </div>

        <RazorpayMockModal
          open={razorOpen}
          amount={total}
          contact={address.phone}
          onClose={() => setRazorOpen(false)}
          onSuccess={(paymentId) => finalizeOrder(paymentId)}
          onFailure={() => {
            setRazorOpen(false);
            setFailed(true);
            const s = getSession();
            logEvent({
              type: "payment_failed",
              actor: s ? { kind: "customer", id: s.id, name: s.name } : { kind: "guest" },
              meta: { total },
            });
          }}
        />

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-forest/8 bg-parchment/50 p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-lg font-semibold text-forest">Order summary</h2>
          <p className="mt-1 text-sm text-forest/55">{items.length} item{items.length === 1 ? "" : "s"}</p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-forest/70">Subtotal</dt>
              <dd className="font-medium text-forest">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-forest/70">Shipping</dt>
              <dd className="font-medium text-forest">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-moss">Offer ({appliedOffer?.code})</dt>
                <dd className="font-medium text-moss">−{formatPrice(discount)}</dd>
              </div>
            )}
            {comboDiscount > 0 && (
              <div className="flex justify-between">
                <dt className="text-moss">Combo savings</dt>
                <dd className="font-medium text-moss">−{formatPrice(comboDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-forest/10 pt-3 text-base">
              <dt className="font-semibold text-forest">Total</dt>
              <dd className="font-semibold text-forest">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link href="/cart" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-moss hover:text-forest">
            Edit cart <ArrowRight width={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  req,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  req?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-forest">
        {label} {req && <span className="text-clay">*</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
      />
    </label>
  );
}
