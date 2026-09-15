import { cn } from "@/lib/cn";

/**
 * The small "online ordering coming soon" line agreed for v3 (ANSWERS §G33).
 * Shown on the shop and product pages next to the WhatsApp CTA so nobody
 * looks for a cart that isn't there.
 */
export function OrderingNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-forest/55", className)}>
      Online ordering coming soon — for now, message us on WhatsApp and we&apos;ll confirm
      price, availability and delivery.
    </p>
  );
}
