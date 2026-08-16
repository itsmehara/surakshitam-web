"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { CartIcon, CloseIcon, ArrowRight } from "@/components/icons";
import { LinkButton } from "@/components/ui/Button";

const FREE_SHIP = 59900;
const SHIP_FEE = 4900;

export function CartView() {
  const { items, subtotal, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-parchment text-forest/60">
          <CartIcon width={28} />
        </span>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-forest">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-forest/70">
          Add a few essentials to get started — browse home, skin and hair care.
        </p>
        <div className="mt-8">
          <LinkButton href="/shop" size="lg">
            Start shopping
          </LinkButton>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIP ? 0 : SHIP_FEE;
  const total = subtotal + shipping;

  return (
    <div className="container py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">Your cart</h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-medium text-forest/55 hover:text-clay"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <ul className="divide-y divide-forest/8 border-y border-forest/8">
          {items.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-4 py-5">
              <Link
                href={`/product/${product.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-forest/8 bg-cream sm:h-28 sm:w-28"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="112px"
                  className="scale-[1.12] object-cover object-[50%_55%]"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif text-base font-semibold text-forest hover:text-moss"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-forest/50">{product.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-forest/40 hover:bg-forest/5 hover:text-clay"
                  >
                    <CloseIcon width={16} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2 rounded-full border border-forest/15 px-1 py-1 text-forest">
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                    >
                      −
                    </button>
                    <span className="min-w-7 text-center text-sm tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(product.id, qty + 1)}
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base leading-none hover:bg-forest/5"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-forest">{formatPrice(product.price * qty)}</p>
                    {qty > 1 && (
                      <p className="text-xs text-forest/45">{formatPrice(product.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-forest/8 bg-parchment/50 p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-lg font-semibold text-forest">Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-forest/70">Subtotal</dt>
              <dd className="font-medium text-forest">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-forest/70">Shipping</dt>
              <dd className="font-medium text-forest">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-moss">
                Add {formatPrice(FREE_SHIP - subtotal)} more for free delivery.
              </p>
            )}
            <div className="flex justify-between border-t border-forest/10 pt-3 text-base">
              <dt className="font-semibold text-forest">Total</dt>
              <dd className="font-semibold text-forest">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-xs text-forest/45">Taxes included where applicable (demo).</p>

          <Link
            href="/checkout"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink"
          >
            Proceed to checkout <ArrowRight width={16} />
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm font-medium text-forest/60 hover:text-forest"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
