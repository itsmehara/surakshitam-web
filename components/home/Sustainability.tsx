import { RecycleIcon, LeafIcon, TruckIcon } from "@/components/icons";

const commitments = [
  {
    icon: RecycleIcon,
    stat: "Small batches",
    title: "Made to order, not to waste",
    body: "Preparing in small batches helps us reduce waste and keep every product fresh.",
  },
  {
    icon: LeafIcon,
    stat: "Plant-forward",
    title: "Ingredients chosen with care",
    body: "We lean on plant-forward ingredients and keep formulations as simple as they can be.",
  },
  {
    icon: TruckIcon,
    stat: "Mindful packing",
    title: "Thoughtful, practical packaging",
    body: "We aim for packaging that protects the product and keeps unnecessary material out.",
  },
];

export function Sustainability() {
  return (
    <section className="bg-parchment py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="max-w-md">
            <p className="eyebrow">Our commitment</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Care that extends beyond the home
            </h2>
            <p className="mt-4 text-base leading-relaxed text-forest/70">
              We&apos;re a small, founder-led business making practical choices where we can. These
              are the commitments we hold ourselves to as we grow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {commitments.map(({ icon: Icon, stat, title, body }) => (
              <div
                key={title}
                className="flex flex-col rounded-lg border border-forest/8 bg-cream p-6 shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-moss/10 text-moss">
                  <Icon width={20} />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                  {stat}
                </p>
                <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug text-forest">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
