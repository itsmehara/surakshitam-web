import { LinkButton } from "./Button";
import { ArrowRight, BeakerIcon } from "@/components/icons";

/** Consistent placeholder for screens planned in later build phases. */
export function ComingSoon({
  title,
  description,
  note,
}: {
  title: string;
  description: string;
  note?: string;
}) {
  return (
    <div className="container flex min-h-[52vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss/10 text-moss">
        <BeakerIcon width={26} />
      </div>
      <h1 className="mt-6 font-serif text-3xl font-semibold text-forest sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-forest/70">{description}</p>
      {note && (
        <p className="mt-3 rounded-full bg-parchment px-4 py-1.5 text-xs font-medium text-forest/60">
          {note}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/shop">
          Browse Products <ArrowRight width={16} />
        </LinkButton>
        <LinkButton href="/" variant="outline">
          Back to Home
        </LinkButton>
      </div>
    </div>
  );
}
