import { cn } from "@/lib/cn";

// A toothed circle: 18 points alternating between an outer and an inner radius.
// Rounded to 2 places so server and client render the same string.
const TEETH = 18;
const BURST = Array.from({ length: TEETH * 2 }, (_, i) => {
  const r = i % 2 === 0 ? 49 : 43.5;
  const a = (Math.PI * i) / TEETH;
  return `${(50 + r * Math.sin(a)).toFixed(2)},${(50 - r * Math.cos(a)).toFixed(2)}`;
}).join(" ");

/**
 * Round toothed "Launch offer" sticker, shown wherever a pack's offer price is
 * below its MRP (the caller decides — see hasOffer in lib/catalog). The words
 * are drawn inside the SVG so they scale with it; size it with h-/w- classes.
 */
export function LaunchOfferBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Launch offer"
      className={cn("-rotate-12 drop-shadow-sm", className)}
    >
      <polygon points={BURST} className="fill-clayDark" />
      <circle cx="50" cy="50" r="38.5" className="fill-none stroke-cream/45" strokeWidth="1" strokeDasharray="2 2.5" />
      <text
        textAnchor="middle"
        className="fill-cream font-sans font-bold uppercase"
        fontSize="16.5"
        letterSpacing="0.6"
      >
        <tspan x="50" y="47">Launch</tspan>
        <tspan x="50" y="65">offer</tspan>
      </text>
    </svg>
  );
}
