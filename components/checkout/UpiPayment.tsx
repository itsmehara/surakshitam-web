"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";
import { rupees } from "@/lib/order";
import { UPI_ID, UPI_PAYEE_NAME, upiPayLink } from "@/lib/upi";

/**
 * "Pay by UPI" on /checkout/: the cart total as a QR code, drawn in the browser
 * (no QR service is called), plus a button that opens the UPI app on a phone.
 * The amount is the cart subtotal only. Delivery charges are confirmed on
 * WhatsApp and are not added here yet.
 *
 * The payment note carries the order ID, the same one the WhatsApp message uses,
 * so the founders can match the bank credit to the order.
 */
export function UpiPayment({
  amount,
  orderId,
  priceOnRequest,
}: {
  amount: number;
  orderId: string;
  priceOnRequest: boolean;
}) {
  // Items priced on request are not in the subtotal, so a QR for it would ask for too little.
  const payable = !priceOnRequest && amount > 0;
  const link = useMemo(() => upiPayLink(amount, `Order ${orderId}`), [amount, orderId]);
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!payable || !orderId) return;
    let live = true;
    toDataURL(link, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 352,
      color: { dark: "#223027", light: "#FFFFFF" },
    })
      .then((url) => {
        if (live) setQr(url);
      })
      .catch(() => {
        if (live) setQr("");
      });
    return () => {
      live = false;
    };
  }, [link, payable, orderId]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the ID is printed on the page, so it can be copied by hand.
    }
  }

  // The order ID is made after the first render, so wait for it.
  if (!orderId) return null;

  return (
    <section aria-labelledby="upi-pay-heading" className="mt-6 rounded-lg border border-forest/10 bg-white/70 p-4">
      <h2 id="upi-pay-heading" className="font-serif text-xl font-semibold text-forest">
        Pay by UPI
      </h2>

      {!payable ? (
        <p className="mt-2 text-sm leading-relaxed text-forest/65">
          Some items are priced on request, so we confirm the total on WhatsApp first. You can pay by UPI once we send it.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex shrink-0 justify-center sm:justify-start">
            {qr ? (
              <Image
                src={qr}
                alt={`QR code to pay ${rupees(amount)} to ${UPI_PAYEE_NAME}`}
                width={176}
                height={176}
                unoptimized
                className="h-44 w-44 rounded-md border border-forest/10 bg-white p-1"
              />
            ) : (
              <span aria-hidden="true" className="block h-44 w-44 rounded-md bg-cream" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2.5 text-sm text-forest/80">
            <p>
              Pay <span className="font-serif text-lg font-semibold tabular-nums text-forest">{rupees(amount)}</span> to
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="break-all font-medium text-forest">{UPI_ID}</span>
              <button
                type="button"
                onClick={copyId}
                className="rounded-full border border-forest/20 px-3 py-0.5 text-xs font-medium text-forest hover:border-forest/40"
              >
                {copied ? "Copied" : "Copy UPI ID"}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-forest/55">
              Payee: {UPI_PAYEE_NAME}. Scan with GPay, PhonePe, Paytm or any UPI app. The amount and order note fill in for you.
            </p>
            <a
              href={link}
              className="inline-flex h-10 items-center justify-center rounded-full bg-forest px-5 text-sm font-medium text-cream hover:bg-ink sm:hidden"
            >
              Pay with a UPI app
            </a>
            <p className="text-xs leading-relaxed text-forest/55">
              This is the cart total. If delivery charges apply, we confirm them on WhatsApp. Order note: {orderId}.
            </p>
            <p className="text-xs leading-relaxed text-forest/55">
              Paid? Tick &ldquo;I&apos;ve already paid by UPI&rdquo; below and enter the transaction ID.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
