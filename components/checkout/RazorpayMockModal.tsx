"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { CloseIcon, CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Realistic **mock** Razorpay checkout modal. No real charge is made.
 * Swap this for the real Razorpay Checkout (razorpay-checkout.js) later —
 * keep the same onSuccess(paymentId) / onFailure() contract.
 */
const METHODS = ["UPI", "Card", "Netbanking", "Wallet"] as const;
type Method = (typeof METHODS)[number];

export function RazorpayMockModal({
  open,
  amount,
  contact,
  onSuccess,
  onFailure,
  onClose,
}: {
  open: boolean;
  amount: number;
  contact?: string;
  onSuccess: (paymentId: string) => void;
  onFailure: () => void;
  onClose: () => void;
}) {
  const [method, setMethod] = useState<Method>("UPI");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setMethod("UPI");
      setProcessing(false);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function pay() {
    setProcessing(true);
    setTimeout(() => {
      onSuccess(`pay_demo_${Math.random().toString(36).slice(2, 12)}`);
    }, 1300);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Header (Razorpay navy) */}
        <div className="relative bg-[#0b1b3f] px-5 py-4 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
          >
            <CloseIcon width={18} />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
              <Image src="/brand/logo.png" alt="" width={34} height={34} className="object-contain" />
            </span>
            <div>
              <p className="text-sm font-semibold">Surakshitam Naturals</p>
              <p className="text-xs text-white/60">{contact ? `+91 ${contact}` : "Secure payment"}</p>
            </div>
            <span className="ml-auto text-right">
              <span className="block text-[0.65rem] uppercase tracking-wide text-white/50">Amount</span>
              <span className="block text-lg font-semibold">{formatPrice(amount)}</span>
            </span>
          </div>
        </div>

        <p className="bg-amber-50 px-5 py-1.5 text-center text-[0.7rem] font-medium text-amber-700">
          Demo gateway — no real payment is taken
        </p>

        {/* Method tabs */}
        <div className="flex gap-1.5 overflow-x-auto px-5 pt-4">
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                method === m ? "bg-[#0b1b3f] text-white" : "bg-forest/5 text-forest/70",
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Method form (visual only) */}
        <div className="px-5 py-4">
          {method === "UPI" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest">UPI ID</label>
              <input placeholder="yourname@upi" className="w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-[#3395FF] focus:outline-none" />
              <p className="text-xs text-forest/45">or scan a QR in the Razorpay app</p>
            </div>
          )}
          {method === "Card" && (
            <div className="space-y-2">
              <input placeholder="Card number" className="w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-[#3395FF] focus:outline-none" />
              <div className="flex gap-2">
                <input placeholder="MM / YY" className="w-1/2 rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-[#3395FF] focus:outline-none" />
                <input placeholder="CVV" className="w-1/2 rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-[#3395FF] focus:outline-none" />
              </div>
            </div>
          )}
          {method === "Netbanking" && (
            <select className="w-full rounded-lg border border-forest/15 px-4 py-2.5 text-sm focus:border-[#3395FF] focus:outline-none">
              <option>Select your bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>State Bank of India</option>
              <option>Axis Bank</option>
            </select>
          )}
          {method === "Wallet" && (
            <div className="space-y-2 text-sm text-forest/75">
              {["Paytm", "PhonePe", "Amazon Pay"].map((w) => (
                <label key={w} className="flex items-center gap-2 rounded-lg border border-forest/15 px-4 py-2.5">
                  <input type="radio" name="wallet" /> {w}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Pay */}
        <div className="px-5 pb-5">
          <button
            type="button"
            disabled={processing}
            onClick={pay}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3395FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a7fe0] disabled:opacity-70"
          >
            {processing ? "Processing…" : `Pay ${formatPrice(amount)}`}
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={onFailure}
            className="mt-2 w-full text-center text-xs font-medium text-forest/45 hover:text-clay"
          >
            Simulate failed payment
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.7rem] text-forest/40">
            <CheckIcon width={12} className="text-moss" /> Secured by Razorpay (demo)
          </p>
        </div>
      </div>
    </div>
  );
}
