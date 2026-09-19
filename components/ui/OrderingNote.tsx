import { cn } from "@/lib/cn";

/**
 * The one-line "how ordering works" note (v4: cart → WhatsApp → pay on
 * WhatsApp). Shown on the shop and product pages so nobody looks for a
 * card-payment step that isn't there.
 */
export function OrderingNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-forest/55", className)}>
      Add to cart, then order on WhatsApp — we confirm availability and delivery, you pay on
      WhatsApp, we pack and deliver.
    </p>
  );
}
