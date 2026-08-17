"use client";

import { getProductById } from "@/lib/catalog";
import { bundleRegularTotal, bundleSavings, type Bundle } from "@/lib/bundles";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart/CartContext";
import { CartIcon } from "@/components/icons";

export function ComboCard({ bundle }: { bundle: Bundle }) {
  const { add } = useCart();
  const products = bundle.productIds.map((id) => getProductById(id)).filter(Boolean);
  const regularTotal = bundleRegularTotal(bundle);
  const savings = bundleSavings(bundle);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-forest/8 bg-white/60 shadow-soft transition-shadow duration-300 hover:shadow-card">
      <div className="grid grid-cols-3 gap-0.5 bg-cream p-1">
        {products.slice(0, 3).map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p!.id}
            src={p!.image}
            alt={p!.name}
            className="aspect-square w-full rounded-md object-cover"
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-semibold text-forest">{bundle.name}</h3>
        {bundle.description && (
          <p className="mt-1 text-sm text-forest/60">{bundle.description}</p>
        )}
        <p className="mt-2 text-xs text-forest/50">
          {products.map((p) => p!.name).join(" · ")}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-forest">{formatPrice(bundle.price)}</span>
          {savings > 0 && (
            <span className="text-sm text-forest/40 line-through">{formatPrice(regularTotal)}</span>
          )}
          {savings > 0 && (
            <span className="ml-auto rounded-full bg-clay/10 px-2.5 py-1 text-[0.7rem] font-semibold text-clay">
              Save {formatPrice(savings)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => bundle.productIds.forEach((id) => add(id, 1))}
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
        >
          <CartIcon width={16} /> Add combo to cart
        </button>
      </div>
    </article>
  );
}
