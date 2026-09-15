"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useEnquiryList } from "@/lib/enquiry-list/EnquiryListContext";
import { productImage } from "@/lib/catalog";
import { whatsAppListHref, trackWhatsAppClick } from "@/lib/enquiry";
import { ClipboardIcon, CloseIcon, WhatsAppIcon, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Slide-in panel listing everything in the enquiry list: quantity −/+,
 * remove, clear, and the two ways to send it — one WhatsApp message or the
 * contact form (which pre-fills the same product lines).
 */
export function EnquiryListDrawer() {
  const { lines, count, setQty, remove, clear, drawerOpen, closeDrawer } = useEnquiryList();

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

  const waHref = whatsAppListHref(lines.map((l) => ({ name: l.product.name, size: l.product.size, qty: l.qty })));

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
        <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-forest">
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
            <ul className="flex-1 divide-y divide-forest/8 overflow-y-auto px-5">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 py-4">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeDrawer}
                    className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-forest/8 bg-cream"
                  >
                    <Image
                      src={productImage(product)}
                      alt={product.name}
                      fill
                      sizes="72px"
                      className={product.thirdParty ? "object-contain p-1" : "object-cover"}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeDrawer}
                        className="font-serif text-sm font-semibold leading-snug text-forest hover:text-moss"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="shrink-0 text-forest/40 hover:text-clay"
                      >
                        <CloseIcon width={16} />
                      </button>
                    </div>
                    <p className="text-xs text-forest/50">{product.size}</p>
                    <div className="mt-auto flex items-center pt-2">
                      <div className="flex items-center gap-1 rounded-full border border-forest/15 p-1 text-forest">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-3 border-t border-forest/10 px-5 py-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    cta: "enquiry-list",
                    product: lines.map((l) => `${l.product.name} ×${l.qty}`).join("; "),
                  })
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.02]"
              >
                <WhatsAppIcon width={20} height={20} /> Send enquiry on WhatsApp
              </a>
              <Link
                href="/contact/?type=product"
                onClick={closeDrawer}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-forest/20 text-sm font-medium text-forest transition-colors hover:border-forest/50"
              >
                Send as a form instead <ArrowRight width={16} />
              </Link>
              <button
                type="button"
                onClick={clear}
                className="block w-full text-center text-xs text-forest/50 underline underline-offset-2 hover:text-clay"
              >
                Clear list
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
