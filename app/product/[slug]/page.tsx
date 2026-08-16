import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getProductsByCategory } from "@/lib/catalog";
import { formatPrice, discountPercent } from "@/lib/format";
import { StarRating } from "@/components/ui/StarRating";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { BuyNowButton } from "@/components/ui/BuyNowButton";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { ProductCard } from "@/components/ui/ProductCard";
import { CheckIcon, TruckIcon, LeafIcon, ChevronDown } from "@/components/icons";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} · ${site.name}`,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

const categoryLabel: Record<string, string> = {
  "home-care": "Home Care",
  "skin-care": "Skin Care",
  "hair-care": "Hair Care",
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const discount = discountPercent(product.price, product.mrp);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  // Cross-sell: popular items from the other ranges to "complete the routine".
  const crossSell = products
    .filter((p) => p.category !== product.category && (p.featured || p.bestSeller))
    .slice(0, 4);

  const details: { title: string; body: React.ReactNode }[] = [
    {
      title: "Why you'll like it",
      body: (
        <ul className="space-y-2">
          {product.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <CheckIcon width={16} className="mt-0.5 shrink-0 text-moss" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ),
    },
    { title: "Ingredients", body: <p>{product.keyIngredients.join(", ")}.</p> },
    { title: "How to use", body: <p>{product.usage}</p> },
    {
      title: "Storage & care",
      body: <p>Store in a cool, dry place away from direct sunlight. Keep out of reach of children.</p>,
    },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    image: product.image,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.price / 100).toFixed(2),
      availability: outOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-forest/8 bg-cream">
        <nav className="container flex items-center gap-2 py-4 text-sm text-forest/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-forest">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-forest">
            {categoryLabel[product.category]}
          </Link>
          <span>/</span>
          <span className="text-forest">{product.name}</span>
        </nav>
      </div>

      <div className="container py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <ProductGallery
            images={product.images?.length ? product.images : [product.image]}
            name={product.name}
            discountLabel={discount ? `${discount}% off` : undefined}
          />

          {/* Details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">
              {categoryLabel[product.category]}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-forest sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-forest/70">{product.shortDescription}</p>

            {product.rating && (
              <div className="mt-4">
                <StarRating rating={product.rating} count={product.reviewCount} size={16} />
              </div>
            )}

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-forest">{formatPrice(product.price)}</span>
              {product.mrp && (
                <span className="text-base text-forest/40 line-through">{formatPrice(product.mrp)}</span>
              )}
              <span className="text-sm text-forest/55">· {product.size}</span>
            </div>
            <p className="mt-1 text-xs text-forest/45">Demo price — inclusive of all taxes (placeholder)</p>

            {/* Stock */}
            <div className="mt-5">
              {outOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-clay">
                  Currently out of stock
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-clay">
                  Only {product.stock} left — made in small batches
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-moss">
                  <CheckIcon width={16} /> In stock
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="sm:max-w-[220px] sm:flex-1">
                <AddToCartButton productId={product.id} name={product.name} disabled={outOfStock} />
              </div>
              <BuyNowButton productId={product.id} disabled={outOfStock} className="sm:flex-1" />
            </div>

            {/* Assurances */}
            <div className="mt-6 grid gap-3 rounded-lg border border-forest/8 bg-parchment/60 p-4 sm:grid-cols-2">
              <Assurance icon={<TruckIcon width={18} />} text="Delivery in 2–5 business days (demo)" />
              <Assurance icon={<LeafIcon width={18} />} text="Plant-forward, small-batch made" />
            </div>

            {/* Accordions */}
            <div className="mt-8 divide-y divide-forest/10 border-y border-forest/10">
              {details.map((d) => (
                <details key={d.title} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg font-medium text-forest">
                    {d.title}
                    <ChevronDown className="text-moss transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed text-forest/75">{d.body}</div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">You may also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Cross-sell */}
        {crossSell.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Complete your routine</h2>
            <p className="mt-2 text-sm text-forest/60">Loved across our home, skin and hair ranges.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {crossSell.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}

function Assurance({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-forest/75">
      <span className="text-moss">{icon}</span>
      {text}
    </div>
  );
}
