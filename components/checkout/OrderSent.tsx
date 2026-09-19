"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { readSentOrder, SENT_EVENT, type SentOrder } from "@/lib/order";
import { trackWhatsAppClick } from "@/lib/enquiry";
import { PageIntro } from "@/components/ui/PageIntro";
import { WhatsAppIcon, CheckIcon, ArrowRight } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * /order-sent/?id=SN-… — "your order is on its way to us on WhatsApp", with a
 * re-open link and copy button in case WhatsApp did not open, plus a soft
 * warning if the Sheet save failed (the WhatsApp message has everything).
 */
export function OrderSent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const blocked = params.get("blocked") === "1";
  const [order, setOrder] = useState<SentOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sync = () => setOrder(readSentOrder());
    sync();
    window.addEventListener(SENT_EVENT, sync);
    return () => window.removeEventListener(SENT_EVENT, sync);
  }, []);

  const mine = order && order.orderId === id ? order : null;

  async function copy() {
    if (!mine) return;
    try {
      await navigator.clipboard.writeText(mine.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the text below is selectable */
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="Order sent"
        title={blocked ? "One more tap to send your order" : "Thank you — your order is on its way to us"}
        intro={
          id
            ? `Order ${id}. We reply on WhatsApp to confirm availability and delivery; you pay there and send us the payment screenshot. Mon–Sat, ${site.hours}.`
            : undefined
        }
      />
      <div className="container max-w-2xl py-8 sm:py-12">
        {mine ? (
          <>
            {blocked ? (
              <p className="rounded-lg border border-clay/40 bg-clay/10 p-4 text-sm text-forest/80">
                Your browser didn&apos;t open WhatsApp. Tap the button below to send the order — it is already written out for you.
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-forest/75">
                <CheckIcon width={18} className="text-moss" /> WhatsApp should have opened with your order. Didn&apos;t? Use the button below.
              </p>
            )}

            <a
              href={mine.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick({ cta: "order-resend", product: mine.orderId })}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.02]"
            >
              <WhatsAppIcon width={20} height={20} /> {blocked ? "Send order on WhatsApp" : "Open WhatsApp again"}
            </a>
            <div className="mt-2 text-center text-xs font-medium text-forest/70">
              <button type="button" onClick={copy} className="inline-flex items-center gap-1 hover:text-forest">
                {copied ? (
                  <>
                    <CheckIcon width={14} className="text-moss" /> Copied
                  </>
                ) : (
                  "Copy the order message"
                )}
              </button>
            </div>

            <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-forest/10 bg-parchment/60 px-4 py-3 font-sans text-xs leading-relaxed text-forest/75">
              {mine.message}
            </pre>

            {mine.sheet === "failed" && (
              <p className="mt-4 text-xs leading-relaxed text-forest/55">
                We couldn&apos;t save a copy of this order on our side just now — no problem, the WhatsApp message above has everything we need.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-forest/65">
            {id ? `Order ${id} was sent from this device earlier.` : "Nothing to show here."} Questions? Message us on WhatsApp any time.
          </p>
        )}

        <Link href="/shop" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-moss hover:text-forest">
          Continue shopping <ArrowRight width={14} />
        </Link>
      </div>
    </>
  );
}
