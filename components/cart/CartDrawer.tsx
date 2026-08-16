"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { CartIcon, CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const FREE_SHIP = 59900; // paise

export function CartDrawer() {
  const { items, count, subtotal, setQty, remove, drawerOpen, closeCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    if (drawerOpen) document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeCart]);

  const remaining = Math.max(0, FREE_SHIP - subtotal);

  return (
    <div
      className={cn("fixed inset-0 z-[70]", drawerOpen ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!drawerOpen}
    >
      <div
        onClick={closeCart}
        className={cn(
          "absolute inset-0 bg-forest/40 transition-opacity duration-300",
          drawerOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[90%] max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ease-smooth",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-forest">
            Your cart {count > 0 && <span className="text-forest/50">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest hover:bg-forest/5"
          >
            <CloseIcon width={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-parchment text-forest/50">
              <CartIcon width={26} />
            </span>
            <p className="font-serif text-lg text-forest">Your cart is empty</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-ink"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            {/* free-shipping hint */}
            <p className="bg-moss/10 px-5 py-2.5 text-center text-xs text-moss">
              {remaining > 0
                ? `Add ${formatPrice(remaining)} more for free delivery`
                : "You've unlocked free delivery 🎉"}
            </p>

            <ul className="flex-1 divide-y divide-forest/8 overflow-y-auto px-5">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 py-4">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-forest/8 bg-cream"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="scale-[1.12] object-cover object-[50%_55%]"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeCart}
                        className="font-serif text-sm font-semibold leading-snug text-forest hover:text-moss"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-forest/40 hover:text-clay"
                      >
                        <CloseIcon width={16} />
                      </button>
                    </div>
                    <p className="text-xs text-forest/50">{product.size}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-full border border-forest/15 px-1 py-1 text-forest">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-forest">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-forest/10 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-forest/70">Subtotal</span>
                <span className="font-semibold text-forest">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-forest/45">Shipping & taxes calculated at checkout.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="rounded-full bg-forest px-5 py-3 text-center text-sm font-medium text-cream hover:bg-ink"
                >
                  View cart &amp; checkout
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="text-center text-sm font-medium text-forest/60 hover:text-forest"
                >
                  Continue shopping
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
