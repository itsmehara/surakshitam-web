"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { whatsAppHref, trackWhatsAppClick } from "@/lib/enquiry";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** Product name → pre-filled message + logged to the Sheet. Omit for the generic chat. */
  product?: string;
  /** Where the button lives, e.g. "product-page", "floating", "contact". Logged as CTA. */
  cta: string;
  children: ReactNode;
};

/**
 * Drop-in replacement for any `<a href="https://wa.me/...">`: same navigation,
 * plus a row in the "WhatsApp Clicks" tab. Not wired into pages yet.
 * Usage: <WhatsAppLink cta="product-page" product={product.name} className="…">Order on WhatsApp</WhatsAppLink>
 */
export function WhatsAppLink({ product, cta, children, onClick, ...rest }: Props) {
  return (
    <a
      href={whatsAppHref(product)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        trackWhatsAppClick({ product, cta });
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
