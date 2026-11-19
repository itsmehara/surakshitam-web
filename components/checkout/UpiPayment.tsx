"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";
import { FREE_DELIVERY_OVER, formatWeight } from "@/lib/delivery";
import { rupees, type OrderCharges } from "@/lib/order";
import { UPI_ID, UPI_PAYEE_NAME, upiPayLink } from "@/lib/upi";

/**
 * "Pay by UPI" on /checkout/: the order total as a QR code, drawn in the browser
 * (no QR service is called). There is no "open UPI app" button: PhonePe rejected the upi:// link for this payee ID (12 Nov 2026), so customers scan the QR or copy the ID.
 * The total is the cart subtotal plus the courier charge (lib/delivery.ts). Free
 * delivery and Rapido add nothing, since the rider is paid the Rapido fare directly.
 * The QR waits until a courier State is chosen and every pack has a weight, so the amount is never short.
 *
 * The payment note carries the order ID, the same one the WhatsApp message uses,
 * so the founders can match the bank credit to the order.
 */
export function UpiPayment({ charges, orderId }: { charges: OrderCharges; orderId: string }) {
  const { payable: subtotal, hasPriceOnRequest, delivery, total } = charges;
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

  /**
   * "Save QR Code": draws a clean card (payee, amount, QR, UPI ID) to a canvas and saves it as a PNG.
   * Phones with a share sheet get it (Save Image / Save to Photos, so the QR can be scanned from the gallery);
   * everything else downloads the file. The amount is the cart total at this moment.
   */
  async function saveQr() {
    try {
      const qrUrl = await toDataURL(link, { errorCorrectionLevel: "M", margin: 1, width: 480, color: { dark: "#223027", light: "#FFFFFF" } });
      const img = new window.Image();
      img.src = qrUrl;
      await img.decode();
      const W = 560;
      const H = 690;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#223027";
      ctx.textAlign = "center";
      ctx.font = "600 30px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(UPI_PAYEE_NAME, W / 2, 52);
      ctx.font = "700 44px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(rupees(amount), W / 2, 112);
      ctx.drawImage(img, 40, 140, 480, 480);
      ctx.font = "500 24px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(`UPI ID: ${UPI_ID}`, W / 2, 655);
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], `Surakshitam-UPI-QR-Rs${amount}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Surakshitam Naturals UPI QR" });
          return;
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") return; // customer closed the share sheet
        }
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch {
      // Saving is a convenience: the QR and the UPI ID stay on the page.
    }
  }

  // The order ID is made after the first render, so wait for it.
  if (!orderId) return null;

  // Why the QR is hidden, said loudly so the customer knows what to do next (founders, 15 Nov 2026).
  const needsState = !hasPriceOnRequest && delivery.status === "pick-state";
  const waiting = hasPriceOnRequest
    ? "We will send your total on WhatsApp. Some items are priced on request, so you can pay after that."
    : needsState
      ? "Choose your state to see the amount and the UPI QR"
      : "We will confirm delivery and send your total on WhatsApp. You can pay after that.";

  function goToState() {
    const el = document.getElementById("co-state");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }

  // Shown only when payable, so the delivery status is settled here.
  const breakdown =
    delivery.status === "courier"
      ? `${rupees(subtotal)} for the cart + ${rupees(delivery.charge)} courier (${formatWeight(delivery.weightG)})`
      : delivery.status === "free"
        ? `${rupees(subtotal)} for the cart, with the special delivery discount over ${rupees(FREE_DELIVERY_OVER)}`
        : delivery.status === "rapido"
          ? `${rupees(subtotal)} for the cart. The Rapido fare is paid to the rider.`
          : null;

  // The UPI ID never changes, so it and its Copy button show even before the amount is known.
  const idRow = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="break-all font-medium text-forest">{UPI_ID}</span>
      <button
        type="button"
        onClick={copyId}
        className="rounded-full bg-forest px-4 py-1.5 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-moss"
      >
        {copied ? "Copied" : "Copy UPI ID"}
      </button>
    </div>
  );

  return (
    <section aria-labelledby="upi-pay-heading" className="mt-6 rounded-lg border border-forest/10 bg-white/70 p-4">
      <h2 id="upi-pay-heading" className="font-serif text-xl font-semibold text-forest">
        Pay by UPI
      </h2>

      {!payable ? (
        <div className="mt-3 space-y-3 text-sm text-forest/80">
          {needsState ? (
            <button
              type="button"
              onClick={goToState}
              className="sn-nudge block w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold text-forest"
            >
              {waiting} <span aria-hidden="true">↑</span>
            </button>
          ) : (
            <p role="status" className="rounded-md bg-[#FBE3A6] px-3 py-2.5 text-sm font-semibold text-forest">
              {waiting}
            </p>
          )}
          {idRow}
          <p className="text-xs leading-relaxed text-forest/55">
            Payee: {UPI_PAYEE_NAME}. {needsState ? "The amount to pay shows here once your state is chosen." : "You can pay as soon as we send the amount."}
          </p>
        </div>
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
              Pay <span className="font-serif text-lg font-semibold tabular-nums text-forest">{rupees(amount)}</span> to {UPI_PAYEE_NAME}
            </p>
            {breakdown && <p className="text-xs leading-relaxed text-forest/60">{breakdown}</p>}
            {idRow}
            {qr && (
              <button
                type="button"
                onClick={saveQr}
                className="rounded-full border border-forest/25 bg-white px-4 py-1.5 text-sm font-semibold text-forest transition-colors hover:border-forest/50"
              >
                Save QR Code
              </button>
            )}
            <p className="text-xs leading-relaxed text-forest/70">Scan the QR with any UPI app, save it, or copy the UPI ID.</p>
            <p className="text-xs leading-relaxed text-forest/70">
              {delivery.status === "rapido" ? "The Rapido fare is not in this amount." : "The total includes delivery."}
            </p>
            {/* The step-by-step help is folded away so the box stays short (founders, 15 Nov 2026). Tap to open: works on phones, unlike a hover tooltip. */}
            <details className="text-xs leading-relaxed text-forest/70">
              <summary className="cursor-pointer select-none font-semibold text-forest underline decoration-forest/30 underline-offset-2">
                <span aria-hidden="true">ⓘ</span> How to pay
              </summary>
              <ul className="mt-2 list-disc space-y-1.5 pl-4">
                <li>
                  <strong>On a computer:</strong> scan the QR with your phone&apos;s UPI app.
                </li>
                <li>
                  <strong>On this phone:</strong> take a screenshot of the QR, open your UPI app, choose Scan, and pick the screenshot. Or copy the UPI ID and pay.
                </li>
                <li>Enter the amount shown above.</li>
                <li>After paying, choose &ldquo;Pay Now by UPI&rdquo; below, place the order, and share the payment screenshot on WhatsApp.</li>
                <li>Order note: {orderId}.</li>
              </ul>
            </details>
          </div>
        </div>
      )}
    </section>
  );
}
