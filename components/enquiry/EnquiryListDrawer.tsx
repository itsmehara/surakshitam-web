"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useEnquiryList, MAX_NOTE } from "@/lib/enquiry-list/EnquiryListContext";
import { productImage } from "@/lib/catalog";
import { enquiryListMessage, whatsAppListHref, trackWhatsAppClick } from "@/lib/enquiry";
import { ClipboardIcon, CloseIcon, WhatsAppIcon, ArrowRight, CheckIcon, ChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Slide-in panel for the enquiry list. Rows are deliberately compact (48px
 * thumbnail, one control row) so a phone shows 6–7 products without
 * scrolling. Below the list: a short optional note, a live preview of the
 * exact WhatsApp text, then send / copy / send-as-form / clear.
 */
export function EnquiryListDrawer() {
  const { lines, count, setQty, remove, clear, note, setNote, drawerOpen, closeDrawer } = useEnquiryList();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const plain = lines.map((l) => ({ name: l.product.name, size: l.product.size, qty: l.qty }));
  const message = enquiryListMessage(plain, note);
  const waHref = whatsAppListHref(plain, note);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the preview text is selectable anyway */
    }
  }

  return (
    <div
      className={cn("fixed inset-0 z-[70]", drawerOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!drawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={cn(
          "absolute inset-0 bg-forest/40 transition-opacity duration-300",
          drawerOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry list"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[92%] max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ease-smooth",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-forest/10 px-4 py-3">
          <div>
            <h2 className="font-serif text-lg font-semibold leading-tight text-forest">
              Enquiry list {count > 0 && <span className="text-forest/50">({count})</span>}
            </h2>
            <p className="text-xs text-forest/55">No payment here — we reply with price &amp; availability.</p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close enquiry list"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-forest/5"
          >
            <CloseIcon width={18} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-parchment text-forest/50">
              <ClipboardIcon width={26} />
            </span>
            <p className="font-serif text-lg text-forest">Your enquiry list is empty</p>
            <p className="text-sm text-forest/60">
              Tap <span className="font-medium text-forest">Add to enquiry</span> on any product, then send
              us everything in one message.
            </p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-ink"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            {/* ---- items: compact rows ---- */}
            <ul className="divide-y divide-forest/8 overflow-y-auto px-4">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3 py-2">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeDrawer}
                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-forest/8 bg-cream"
                  >
                    <Image
                      src={productImage(product)}
                      alt=""
                      fill
                      sizes="48px"
                      className={product.thirdParty ? "object-contain p-0.5" : "object-cover"}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeDrawer}
                      className="line-clamp-2 font-serif text-[0.9rem] font-semibold leading-tight text-forest hover:text-moss"
                    >
                      {product.name}
                    </Link>
                    <p className="text-[0.7rem] text-forest/50">{product.size}</p>
                  </div>
                  <div className="flex shrink-0 items-center rounded-full border border-forest/15 text-forest">
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty - 1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty + 1)}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-forest/40 hover:bg-clay/10 hover:text-clay"
                  >
                    <CloseIcon width={14} />
                  </button>
                </li>
              ))}
            </ul>

            {/* ---- note + preview + actions ---- */}
            <div className="mt-auto space-y-3 border-t border-forest/10 px-4 py-3">
              <div>
                <label htmlFor="enq-list-note" className="mb-1 block text-xs font-medium text-forest">
                  Add a note (optional)
                </label>
                <textarea
                  id="enq-list-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  maxLength={MAX_NOTE}
                  placeholder="Delivery area, preferred fragrance, any questions…"
                  className="w-full resize-none rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm text-forest placeholder:text-forest/35 focus:border-moss focus:outline-none"
                />
              </div>

              <details open className="group rounded-lg border border-forest/10 bg-parchment/60">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium text-forest">
                  Your WhatsApp message
                  <ChevronDown width={14} className="text-moss transition-transform group-open:rotate-180" />
                </summary>
                <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap border-t border-forest/8 px-3 py-2 font-sans text-xs leading-relaxed text-forest/75">
                  {message}
                </pre>
              </details>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    cta: "enquiry-list",
                    product: plain.map((l) => `${l.name} ×${l.qty}`).join("; "),
                  })
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.02]"
              >
                <WhatsAppIcon width={20} height={20} /> Send on WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={copyMessage}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-forest/20 text-xs font-medium text-forest transition-colors hover:border-forest/50"
                >
                  {copied ? (
                    <>
                      <CheckIcon width={14} className="text-moss" /> Copied
                    </>
                  ) : (
                    "Copy message"
                  )}
                </button>
                <Link
                  href="/contact/?type=product"
                  onClick={closeDrawer}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-forest/20 text-xs font-medium text-forest transition-colors hover:border-forest/50"
                >
                  Send as a form <ArrowRight width={14} />
                </Link>
              </div>
              <button
                type="button"
                onClick={clear}
                className="block w-full text-center text-xs text-forest/50 underline underline-offset-2 hover:text-clay"
              >
                Clear list
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
