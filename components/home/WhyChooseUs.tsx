import { BeakerIcon, LeafIcon, HeartIcon, ShieldIcon } from "@/components/icons";

const principles = [
  {
    icon: BeakerIcon,
    title: "Thoughtful Formulation",
    body: "Each product begins with research into ingredients and everyday needs, then careful refinement.",
  },
  {
    icon: LeafIcon,
    title: "Ingredient Transparency",
    body: "We list the ingredients that matter and keep our language honest — no exaggerated claims.",
  },
  {
    icon: HeartIcon,
    title: "Made with Care",
    body: "Prepared in small batches, the way we'd make them for our own family and home.",
  },
  {
    icon: ShieldIcon,
    title: "Everyday Practicality",
    body: "Products designed to fit real routines — for kitchens, floors, skin and hair.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="eyebrow">What guides us</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            A calmer way to care for your home
          </h2>
          <p className="mt-4 text-base leading-relaxed text-forest/70">
            Surakshitam Naturals began with Supriya researching better ways to make everyday
            household and personal-care products. These principles guide everything we formulate.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss/10 text-moss">
                <Icon width={22} />
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-forest">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-forest/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
