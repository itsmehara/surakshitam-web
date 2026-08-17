"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist/WishlistContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeartIcon } from "@/components/icons";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <>
      <section className="border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <div className="container max-w-2xl py-12 sm:py-16">
          <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">Wishlist</h1>
          <p className="mt-2 text-sm text-forest/60">
            Products you&rsquo;ve saved for later. Saved on this device only.
          </p>
        </div>
      </section>

      <div className="container py-10">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <HeartIcon width={40} height={40} className="mx-auto text-forest/25" />
            <p className="mt-4 font-serif text-xl text-forest">Your wishlist is empty</p>
            <p className="mt-2 text-sm text-forest/60">
              Tap the heart on any product to save it here.
            </p>
            <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-moss">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
