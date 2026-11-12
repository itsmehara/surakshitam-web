"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";
import { FREE_DELIVERY_OVER, formatWeight } from "@/lib/delivery";
import { rupees, type OrderCharges } from "@/lib/order";
import { UPI_ID, UPI_PAYEE_NAME, upiPayLink } from "@/lib/upi";

/**
 * "Pay by UPI" on /checkout/: the order total as a QR code, drawn in the browser
 * (no QR service is called), plus a button that opens the UPI app on a phone.
 * The total is the cart subtotal plus the courier charge (lib/delivery.ts). Free
 * delivery and Rapido add nothing, since the rider is paid the Rapido fare directly.
 * The QR waits until a courier State is chosen and every pack has a weight, so the amount is never short.
 *
 * The payment note carries the order ID, the same one the WhatsApp message uses,
 * so the founders can match the bank credit to the order.
 */
export function UpiPayment({ charges, orderId }: { charges: OrderCharges; orderId: string }) {
  const { subtotal, hasPriceOnRequest, delivery, total } = charges;
  // Items priced on request are not in the subtotal, and delivery is unknown until a State is chosen.
  const payable = !hasPriceOnRequest && total != null && total > 0;
  const amount = total ?? 0;
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

  const waiting = hasPriceOnRequest
    ? "Some items are priced on request, so we confirm the total on WhatsApp first. You can pay by UPI once we send it."
    : delivery.status === "pick-state"
      ? "Choose your state under Delivery details to see the total with delivery. The UPI QR appears then."
      : "Delivery for part of your order is confirmed on WhatsApp, so we send the total there first. You can pay by UPI once we send it.";

  // Shown only when payable, so the delivery status is settled here.
  const breakdown =
    delivery.status === "courier"
      ? `${rupees(subtotal)} for the cart + ${rupees(delivery.charge)} courier (${formatWeight(delivery.weightG)})`
      : delivery.status === "free"
        ? `${rupees(subtotal)} for the cart, with the special delivery discount over ${rupees(FREE_DELIVERY_OVER)}`
        : delivery.status === "rapido"
          ? `${rupees(subtotal)} for the cart. The Rapido fare is paid to the rider.`
          : null;

  return (
    <section aria-labelledby="upi-pay-heading" className="mt-6 rounded-lg border border-forest/10 bg-white/70 p-4">
      <h2 id="upi-pay-heading" className="font-serif text-xl font-semibold text-forest">
        Pay by UPI
      </h2>

      {!payable ? (
        <p className="mt-2 text-sm leading-relaxed text-forest/65">{waiting}</p>
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
            {breakdown && <p className="text-xs leading-relaxed text-forest/60">{breakdown}</p>}
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
              {delivery.status === "rapido" ? "The Rapido fare is not in this amount." : "The total includes delivery."} Order note: {orderId}.
            </p>
            <p className="text-xs leading-relaxed text-forest/55">
              Paid? Choose &ldquo;UPI — already paid&rdquo; under How will you pay and enter the transaction ID.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
