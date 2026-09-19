"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart, MAX_NOTE, lineKey } from "@/lib/cart/CartContext";
import { productImage } from "@/lib/catalog";
import { trackWhatsAppClick } from "@/lib/enquiry";
import { cartMessage, whatsAppCartHref, rupees } from "@/lib/order";
import { CartIcon, CloseIcon, WhatsAppIcon, ArrowRight, CheckIcon, ChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Slide-in cart. Rows are deliberately compact (44px thumbnail, one control
 * row) so a phone shows 8+ lines without scrolling. Below the list: subtotal,
 * a one-line note that grows as you type, the exact WhatsApp text (open by
 * default on tablet+, collapsed on phones to keep the list tall), then
 * "Order on WhatsApp" / copy / enquire-instead. "Clear" lives in the header.
 */
export function CartDrawer() {
  const { lines, count, subtotal, hasPriceOnRequest, setQty, remove, clear, note, setNote, drawerOpen, closeDrawer } = useCart();
  const [copied, setCopied] = useState(false);
  // Preview starts open where there is room for it; phones get it collapsed.
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => setPreviewOpen(window.matchMedia("(min-width: 640px)").matches), []);

  // The note textarea grows with its text (1–4 lines) — also on open, for a saved note.
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = noteRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [note, drawerOpen]);

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

  const message = cartMessage(lines, note);
  const waHref = whatsAppCartHref(lines, note);

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
        aria-label="Your cart"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[92%] max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ease-smooth",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between gap-2 border-b border-forest/10 px-4 py-2.5">
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-semibold leading-tight text-forest">
              Your cart {count > 0 && <span className="text-forest/50">({count})</span>}
            </h2>
            <p className="truncate text-[0.7rem] text-forest/55">Order on WhatsApp — pay there once we confirm.</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {count > 0 && (
              <button
                type="button"
                onClick={clear}
                className="rounded-full px-2.5 py-1 text-xs text-forest/55 underline underline-offset-2 hover:text-clay"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-forest/5"
            >
              <CloseIcon width={18} />
            </button>
          </div>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-parchment text-forest/50">
              <CartIcon width={26} />
            </span>
            <p className="font-serif text-lg text-forest">Your cart is empty</p>
            <p className="text-sm text-forest/60">
              Tap <span className="font-medium text-forest">Add to cart</span> on any product, then order
              everything in one WhatsApp message.
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
              {lines.map(({ product, size, qty }) => (
                <li key={lineKey(product.id, size.id)} className="flex items-center gap-2.5 py-1.5">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeDrawer}
                    className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-forest/8 bg-cream"
                  >
                    <Image
                      src={productImage(product)}
                      alt=""
                      fill
                      sizes="44px"
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
                    <p className="text-[0.7rem] text-forest/50">
                      {size.label}
                      <span className="text-forest/30"> · </span>
                      {size.mrp == null ? "price on request" : `${rupees(size.mrp)} × ${qty} = ${rupees(size.mrp * qty)}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center rounded-full border border-forest/15 text-forest">
                    <button
                      type="button"
                      onClick={() => setQty(product.id, size.id, qty - 1)}
                      aria-label={`Decrease quantity of ${product.name} ${size.label}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(product.id, size.id, qty + 1)}
                      aria-label={`Increase quantity of ${product.name} ${size.label}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id, size.id)}
                    aria-label={`Remove ${product.name} ${size.label}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-forest/40 hover:bg-clay/10 hover:text-clay"
                  >
                    <CloseIcon width={14} />
                  </button>
                </li>
              ))}
            </ul>

            {/* ---- subtotal + note + preview + actions ---- */}
            <div className="mt-auto space-y-2 border-t border-forest/10 px-4 pb-3 pt-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-forest/70">
                  Subtotal
                  <span className="ml-1 text-[0.7rem] text-forest/45">MRP, incl. taxes</span>
                </span>
                <span className="font-serif text-lg font-semibold tabular-nums text-forest">
                  {rupees(subtotal)}
                  {hasPriceOnRequest && <span className="ml-1 text-xs font-normal text-forest/50">+ on request</span>}
                </span>
              </div>
              <textarea
                ref={noteRef}
                id="enq-list-note"
                aria-label="Add a note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={1}
                maxLength={MAX_NOTE}
                placeholder="Add a note — gift wrap, questions… (optional)"
                className="w-full resize-none rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm text-forest placeholder:text-forest/40 focus:border-moss focus:outline-none"
              />

              <details
                open={previewOpen}
                onToggle={(e) => setPreviewOpen(e.currentTarget.open)}
                className="group rounded-lg border border-forest/10 bg-parchment/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-1.5 text-xs font-medium text-forest">
                  {previewOpen ? "Your WhatsApp message" : "Preview your WhatsApp message"}
                  <ChevronDown width={14} className="text-moss transition-transform group-open:rotate-180" />
                </summary>
                <pre className="max-h-28 overflow-y-auto whitespace-pre-wrap border-t border-forest/8 px-3 py-2 font-sans text-xs leading-relaxed text-forest/75">
                  {message}
                </pre>
              </details>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    cta: "cart",
                    product: lines.map((l) => `${l.product.name} ${l.size.label} ×${l.qty}`).join("; "),
                  })
                }
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.02]"
              >
                <WhatsAppIcon width={20} height={20} /> Order on WhatsApp
              </a>
              <p className="text-center text-[0.7rem] leading-snug text-forest/55">
                Pay on WhatsApp and send us the payment screenshot — we pack and deliver.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs font-medium text-forest/70">
                <button type="button" onClick={copyMessage} className="inline-flex items-center gap-1 hover:text-forest">
                  {copied ? (
                    <>
                      <CheckIcon width={14} className="text-moss" /> Copied
                    </>
                  ) : (
                    "Copy message"
                  )}
                </button>
                <span aria-hidden="true" className="text-forest/25">·</span>
                <Link
                  href="/contact/?type=product"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-1 hover:text-forest"
                >
                  Ask a question instead <ArrowRight width={13} />
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
