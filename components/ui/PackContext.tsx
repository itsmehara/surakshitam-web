"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { defaultSize, getSize, productImage } from "@/lib/catalog";
import { ProductGallery } from "./ProductGallery";

type Pack = { sizeId: string; setSizeId: (id: string) => void };

const PackContext = createContext<Pack | null>(null);

/**
 * Product page only: the pack picked in the pills is shared with the gallery, so each
 * pack shows its own photos. Listing cards have no provider and keep their own pills.
 */
export function PackProvider({ product, children }: { product: Product; children: ReactNode }) {
  const [sizeId, setSizeId] = useState(() => defaultSize(product).id);
  return <PackContext.Provider value={{ sizeId, setSizeId }}>{children}</PackContext.Provider>;
}

export function usePack(): Pack | null {
  return useContext(PackContext);
}

/** The gallery for whichever pack is picked. A pack with no photos of its own shows the product's. */
export function PackGallery({ product }: { product: Product }) {
  const pack = usePack();
  const size = (pack && getSize(product, pack.sizeId)) || defaultSize(product);
  const images = size.images?.length
    ? size.images
    : product.images?.length
      ? product.images
      : [productImage(product)];
  // The key remounts the gallery, so each pack opens on its own 01.
  return <ProductGallery key={size.id} images={images} name={product.name} />;
}
