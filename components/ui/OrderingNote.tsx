import { cn } from "@/lib/cn";

/**
 * The small "online ordering coming soon" line agreed for v3 (ANSWERS §G33),
 * updated 15 Sep for the enquiry list. Shown on the shop and product pages so
 * nobody looks for a cart that isn't there.
 */
export function OrderingNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-forest/55", className)}>
      Online ordering coming soon — add products to your enquiry list and send us one WhatsApp
      message; we&apos;ll confirm price, availability and delivery.
    </p>
  );
}
