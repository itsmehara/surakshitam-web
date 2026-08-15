import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function StarRating({
  rating,
  count,
  className,
  size = 14,
}: {
  rating: number;
  count?: number;
  className?: string;
  size?: number;
}) {
  const rounded = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            width={size}
            height={size}
            className={i < rounded ? "text-clay" : "text-sand"}
          />
        ))}
      </div>
      <span className="text-xs text-forest/60">
        <span className="sr-only">Rated </span>
        {rating.toFixed(1)}
        {typeof count === "number" && ` (${count})`}
      </span>
    </div>
  );
}
