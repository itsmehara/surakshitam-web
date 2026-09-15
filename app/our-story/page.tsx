import type { Metadata } from "next";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
import {
  ArrowRight,
  BeakerIcon,
  LeafIcon,
  HeartIcon,
  ShieldIcon,
  SproutIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Surakshitam Naturals began — a home experiment in Hyderabad, years of Supriya's research, and Srikanth's push to share homemade, plant-based care with more homes.",
};

const chapters = [
  {
    step: "01",
    title: "A question at home",
    body: "In our own kitchen in Hyderabad, we began asking whether everyday products could be made more thoughtfully — with ingredients we could understand and explain.",
  },
  {
    step: "02",
    title: "Years of patient research",
    body: "Supriya spent years studying plant-based ingredients, essential oils and methods, learning what actually worked for real, daily routines.",
  },
  {
    step: "03",
    title: "Made, tested, refined",
    body: "Formulations were prepared in small batches and adjusted again and again — until each one felt genuinely good to use at home.",
  },
  {
    step: "04",
    title: "Shared beyond our home",
    body: "What worked for our family felt worth sharing. Srikanth helped shape it into Surakshitam Naturals, made for more homes across the city and beyond.",
  },
  {
    step: "05",
    title: "Where we are today",
    body: "A small, founder-led studio crafting homemade, plant-based care — still made in considered batches, still honest about what goes inside.",
  },
];

const founders = [
  {
    initial: "S",
    name: "Supriya",
    role: "Formulation & research",
    bio: "The curiosity and the years of patient testing behind every product. Supriya develops and refines each formulation.",
  },
  {
    initial: "S",
    name: "Srikanth",
    role: "Operations & everyday care",
    bio: "Turning careful formulations into a business that can reach — and look after — more homes.",
  },
];

const philosophy = [
  {
    icon: BeakerIcon,
    title: "Understand before formulating",
    body: "We start with the everyday need, not the trend — then research our way to a formulation.",
  },
  {
    icon: LeafIcon,
    title: "Choose ingredients purposefully",
    body: "Every ingredient earns its place for a reason we can explain in plain words.",
  },
  {
    icon: ShieldIcon,
    title: "Keep you informed",
    body: "We share what's inside and keep our claims honest, never overstated.",
  },
  {
    icon: HeartIcon,
    title: "Design for everyday use",
    body: "Products should fit real routines — simple, practical and made to be used daily.",
  },
];

const story = [
  { src: "/story/founder-kitchen.webp", alt: "In the founder's kitchen", caption: "Founder Kitchen" },
  { src: "/story/handcrafted-packaging.webp", alt: "Handcrafted packaging", caption: "Handcrafted Packaging" },
  { src: "/story/botanical-workspace.webp", alt: "Botanical workspace", caption: "Botanical Workspace" },
];

function StoryTile({ img, className }: { img: (typeof story)[number]; className?: string }) {
  return (
    <figure
      /* Taller portrait tiles (~30% more height than the old 3:4 → 15:26). */
      className={`group relative aspect-[15/26] overflow-hidden rounded-lg border border-forest/8 bg-white shadow-soft ${className ?? ""}`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 1024px) 32vw, 240px"
        className="object-cover object-center transition-transform duration-500 ease-smooth group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/80 to-transparent p-2.5 pt-8 text-[0.68rem] font-medium text-cream">
        {img.caption}
      </figcaption>
    </figure>
  );
}

export default function OurStoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <BotanicalBackdrop />
        <div className="container relative grid items-center gap-10 py-14 lg:grid-cols-[2fr_3fr] lg:gap-14 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow">Our story · Hyderabad</p>
            <h1 className="mt-4 text-hero font-semibold text-forest">
              A home experiment that became a promise
            </h1>
            <p className="mt-5 text-base leading-relaxed text-forest/70 sm:text-lg">
              It started the way many good things do — with a simple question asked at home. Could
              the everyday products a family reaches for be made more thoughtfully, from ingredients
              you can actually understand?
            </p>
            <p className="mt-6 text-sm font-medium text-moss">— Srikanth &amp; Supriya, founders</p>
          </div>

          {/* founder image collage */}
          <div className="relative">
            <div className="mx-auto grid max-w-[33rem] grid-cols-3 gap-4 lg:max-w-none">
              <StoryTile img={story[0]} />
              <StoryTile img={story[1]} className="translate-y-6" />
              <StoryTile img={story[2]} />
            </div>
          </div>
        </div>
      </section>

      {/* Narrative + pull quote */}
      <section className="container py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="space-y-5 text-base leading-relaxed text-forest/80">
            <p className="text-lg text-forest">
              For Supriya, that question turned into years of patient research. She read, she tested,
              she kept notes.
            </p>
            <p>
              Kitchen counters became a small workshop. Batches were made, tried, adjusted and made
              again — until a formulation felt genuinely good to live with: gentle enough for daily
              use, and honest about what went into it.
            </p>
            <p>
              What began as care for her own family slowly grew into something worth sharing. Srikanth
              saw how much thought had gone into each recipe, and together they decided to bring these
              homemade, plant-based formulations to more homes.
            </p>
            <p>
              That is how Surakshitam Naturals came to be — a small, founder-led business making
              home care, skin care and hair care the way you would make them for the people you
              love: carefully, and without shortcuts.
            </p>
          </div>

          <figure className="relative flex flex-col justify-center rounded-lg bg-parchment p-8">
            <SproutIcon width={28} className="text-moss" />
            <blockquote className="mt-4 font-serif text-xl font-medium leading-snug text-forest">
              &ldquo;I wanted products I&rsquo;d feel completely comfortable using around my own
              family — every single day.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-forest/60">
              Supriya, co-founder
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-parchment/60 py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The journey</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              How it came together
            </h2>
          </div>
          <ol className="relative mx-auto mt-12 max-w-2xl space-y-8 border-l border-forest/15 pl-10">
            {chapters.map((c) => (
              <li key={c.step} className="relative">
                <span className="absolute -left-[3.15rem] flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream bg-forest text-xs font-semibold text-cream shadow-soft">
                  {c.step}
                </span>
                <h3 className="font-serif text-xl font-semibold text-forest">{c.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-forest/70">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Founders */}
      <section className="container py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">The people behind it</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Made by a family, for families
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {founders.map((f) => (
            <div
              key={f.name}
              className="flex items-start gap-5 rounded-lg border border-forest/8 bg-white/60 p-6 shadow-soft"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-moss/12 font-serif text-2xl font-semibold text-moss">
                {f.initial}
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-forest">{f.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{f.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-forest/70">{f.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-forest/40">Founder photographs to be added.</p>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="scroll-mt-24 bg-forest py-16 text-cream sm:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow text-sage">Our philosophy</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              The principles behind every formulation
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {philosophy.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-lg border border-cream/12 bg-cream/5 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/10 text-sage">
                  <Icon width={20} />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-cream">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream/75">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="container py-16 text-center sm:py-20">
        <h2 className="mx-auto max-w-xl font-serif text-2xl font-semibold text-forest sm:text-3xl">
          Care that begins at home, made for yours
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/shop" size="lg">
            Shop Products <ArrowRight width={18} />
          </LinkButton>
          <LinkButton href="/ingredients" variant="outline" size="lg">
            Explore Ingredients
          </LinkButton>
        </div>
      </section>
    </>
  );
}
