import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { PageIntro } from "@/components/ui/PageIntro";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Care guides and ingredient stories from Surakshitam Naturals — practical notes on ingredients, product care and how our formulations come together.",
};

export default function LearnPage() {
  const [feature, ...rest] = articles;

  return (
    <>
      <PageIntro
        eyebrow="Learn"
        title="Care guides & ingredient stories"
        intro="Short, useful reads on ingredients, product care and how our formulations come together. Demo articles shown for the prototype."
      />

      <div className="container py-12 sm:py-16">
        {/* Featured article */}
        <Link
          href={`/learn/${feature.slug}`}
          className="group block overflow-hidden rounded-lg border border-forest/8 bg-gradient-to-br from-parchment to-cream p-8 shadow-soft transition-shadow hover:shadow-card sm:p-12"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">
            {feature.tag} · Featured
          </span>
          <h2 className="mt-3 max-w-2xl font-serif text-2xl font-semibold text-forest sm:text-3xl">
            {feature.title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-forest/70">{feature.intro}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-moss transition-colors group-hover:text-forest">
            Read the article <ArrowRight width={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Rest of the articles */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/learn/${a.slug}`}
              className="group flex flex-col rounded-lg border border-forest/8 bg-white/60 p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{a.tag}</span>
              <h3 className="mt-3 font-serif text-xl font-semibold text-forest">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-forest/70">{a.excerpt}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-forest/50">{a.readTime}</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-moss transition-colors group-hover:text-forest">
                  Read <ArrowRight width={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
