import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductBySlug, getProductsByCategory, productImage } from "@/lib/catalog";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { ProductCard } from "@/components/ui/ProductCard";
import { AddToEnquiryButton } from "@/components/ui/AddToEnquiryButton";
import { OrderingNote } from "@/components/ui/OrderingNote";
import { CheckIcon, LeafIcon, ChevronDown } from "@/components/icons";
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
      images: [{ url: productImage(product) }],
    },
  };
}

const categoryLabel: Record<string, string> = {
  "home-care": "Home Care",
  "skin-care": "Skin Care",
  "hair-care": "Hair Care",
  "partner-brands": "Partner Brands",
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const isBioEnzyme = product.homeCareType === "bio-enzyme";
  // Resold stock is attributed to its own maker, never to us.
  const partnerBrand = product.thirdParty ? product.brand : undefined;
  const cover = productImage(product);
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
    image: cover,
    brand: { "@type": "Brand", name: partnerBrand ?? site.name },
    // No `offers` block: v3 lists no prices, orders go through WhatsApp.
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
            images={product.images?.length ? product.images : [cover]}
            name={product.name}
          />

          {/* Details */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                partnerBrand ? "text-forest/55" : "text-moss"
              }`}
            >
              {partnerBrand ?? categoryLabel[product.category]}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-forest sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-base text-forest/70">{product.shortDescription}</p>

            {partnerBrand && (
              <p className="mt-3 rounded-lg border border-forest/10 bg-white/70 px-3 py-2 text-xs leading-relaxed text-forest/65">
                Made by <span className="font-medium text-forest">{partnerBrand}</span> — stocked and
                delivered by {site.name}. This is a brand-partner product, not one of ours.
              </p>
            )}
            {isBioEnzyme && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-moss/12 px-3 py-1 text-xs font-medium text-moss">
                <LeafIcon width={14} /> Bio-enzyme formulation — breaks down after use
              </p>
            )}

            <p className="mt-5 text-sm text-forest/55">Pack size · {product.size}</p>

            {/* Actions — v3: collect products in the enquiry list, send one message */}
            <div className="mt-6 sm:max-w-sm">
              <AddToEnquiryButton productId={product.id} name={product.name} variant="page" className="w-full" />
            </div>
            <OrderingNote className="mt-3" />

            {/* Assurances */}
            <div className="mt-6 rounded-lg border border-forest/8 bg-parchment/60 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Assurance
                  icon={<LeafIcon width={18} />}
                  text={
                    partnerBrand
                      ? `Sourced from ${partnerBrand}, packed by us`
                      : "Plant-forward, small-batch made"
                  }
                />
                <Assurance icon={<CheckIcon width={18} />} text="Made in small batches in Hyderabad" />
              </div>
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
