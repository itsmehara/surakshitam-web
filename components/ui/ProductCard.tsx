import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { StarRating } from "./StarRating";
import { AddToCartButton } from "./AddToCartButton";
import { QuickViewButton } from "./QuickViewButton";

const categoryLabel: Record<Product["category"], string> = {
  "home-care": "Home Care",
  "skin-care": "Skin Care",
  "hair-care": "Hair Care",
};

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const discount = discountPercent(product.price, product.mrp);
  const lowStock = product.stock > 0 && product.stock <= 10;
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-forest/8 bg-white/60 shadow-soft transition-shadow duration-300 hover:shadow-card">
      <div className="relative">
        <Link
          href={`/product/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-cream"
        >
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-moss px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-cream">
                New
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-clay px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-cream">
                {discount}% off
              </span>
            )}
          </div>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            priority={priority}
            className="scale-[1.16] object-cover object-[50%_60%] transition-transform duration-500 ease-smooth group-hover:scale-[1.24]"
          />
        </Link>
        <QuickViewButton productId={product.id} />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-moss">
          {categoryLabel[product.category]}
        </p>
        <h3 className="mt-0.5 font-serif text-[0.95rem] font-semibold leading-snug text-forest">
          <Link href={`/product/${product.slug}`} className="after:absolute">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-forest/55">{product.shortDescription}</p>

        {product.rating && (
          <StarRating rating={product.rating} count={product.reviewCount} className="mt-1.5" size={13} />
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[0.95rem] font-semibold text-forest">{formatPrice(product.price)}</span>
          {product.mrp && (
            <span className="text-xs text-forest/40 line-through">{formatPrice(product.mrp)}</span>
          )}
          <span className="ml-auto text-[0.7rem] text-forest/50">{product.size}</span>
        </div>

        <p
          className={`mt-1 text-[0.7rem] font-medium ${
            outOfStock ? "text-forest/40" : lowStock ? "text-clay" : "text-moss"
          }`}
        >
          {outOfStock ? "Out of stock" : lowStock ? `Only ${product.stock} left` : "In stock"}
        </p>

        <div className="mt-2.5">
          <AddToCartButton productId={product.id} name={product.name} disabled={outOfStock} />
        </div>
      </div>
    </article>
  );
}
