import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productImage } from "@/lib/catalog";
import { WhatsAppLink } from "./WhatsAppLink";
import { WhatsAppIcon } from "@/components/icons";

const categoryLabel: Record<Product["category"], string> = {
  "home-care": "Home Care",
  "skin-care": "Skin Care",
  "hair-care": "Hair Care",
  "partner-brands": "Partner Brands",
};

/**
 * Listing card. v3-static shows no price, stock or rating — the card leads to
 * the product page and offers a direct "Order on WhatsApp" link instead.
 */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const isBioEnzyme = product.homeCareType === "bio-enzyme";
  // Other companies' stock is never shown in our own house styling: the brand
  // replaces the category eyebrow, and the pack sits on a plain, uncropped tile.
  const partnerBrand = product.thirdParty ? product.brand : undefined;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-forest/8 bg-white/60 shadow-soft transition-shadow duration-300 hover:shadow-card">
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
          {isBioEnzyme && (
            <span className="rounded-full bg-moss/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-cream">
              Bio-Enzyme
            </span>
          )}
        </div>
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          priority={priority}
          className={
            partnerBrand
              ? "object-contain p-2 transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
              : "object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.06]"
          }
        />
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p
          className={`text-[0.66rem] font-semibold uppercase tracking-[0.12em] ${
            partnerBrand ? "text-forest/55" : "text-moss"
          }`}
        >
          {partnerBrand ?? categoryLabel[product.category]}
        </p>
        <h3 className="mt-0.5 font-serif text-[0.95rem] font-semibold leading-snug text-forest">
          <Link href={`/product/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-forest/55">{product.shortDescription}</p>
        {partnerBrand && (
          <p className="mt-0.5 text-[0.65rem] text-forest/40">Brand partner · sold by us</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-[0.7rem] text-forest/50">{product.size}</span>
          {/* Sits above the card-wide overlay link so the tap goes to WhatsApp, not the PDP. */}
          <WhatsAppLink
            cta="product-card"
            product={product.name}
            className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/12 px-2.5 py-1 text-[0.7rem] font-medium text-forest transition-colors hover:bg-[#25D366]/25"
          >
            <WhatsAppIcon width={13} height={13} /> Order on WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}
