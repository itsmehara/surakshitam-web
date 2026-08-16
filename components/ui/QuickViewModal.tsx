"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { getProductById } from "@/lib/catalog";
import { formatPrice, discountPercent } from "@/lib/format";
import { StarRating } from "./StarRating";
import { AddToCartButton } from "./AddToCartButton";
import { CloseIcon, CheckIcon, ArrowRight } from "@/components/icons";

export function QuickViewModal() {
  const { quickViewId, closeQuickView } = useCart();
  const product = quickViewId ? getProductById(quickViewId) : undefined;

  useEffect(() => {
    if (!quickViewId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuickView();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [quickViewId, closeQuickView]);

  if (!product) return null;
  const discount = discountPercent(product.price, product.mrp);
  const outOfStock = product.stock <= 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-forest/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={closeQuickView}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl bg-cream shadow-card sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-forest shadow-soft hover:bg-cream"
        >
          <CloseIcon width={18} />
        </button>

        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-square bg-white">
            {discount && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-clay px-2.5 py-1 text-[0.65rem] font-semibold text-cream">
                {discount}% off
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="scale-[1.1] object-cover object-[50%_55%]"
            />
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-moss">
              {product.category.replace("-", " ")}
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-forest">{product.name}</h2>
            <p className="mt-1 text-sm text-forest/65">{product.shortDescription}</p>
            {product.rating && (
              <StarRating rating={product.rating} count={product.reviewCount} className="mt-2" size={14} />
            )}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-semibold text-forest">{formatPrice(product.price)}</span>
              {product.mrp && (
                <span className="text-sm text-forest/40 line-through">{formatPrice(product.mrp)}</span>
              )}
              <span className="ml-auto text-xs text-forest/50">{product.size}</span>
            </div>

            <ul className="mt-3 space-y-1.5">
              {product.benefits.slice(0, 3).map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-forest/75">
                  <CheckIcon width={15} className="mt-0.5 shrink-0 text-moss" /> {b}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-5">
              <AddToCartButton productId={product.id} name={product.name} disabled={outOfStock} />
              <Link
                href={`/product/${product.slug}`}
                onClick={closeQuickView}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-moss hover:text-forest"
              >
                View full details <ArrowRight width={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
