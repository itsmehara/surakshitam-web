import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/lib/articles";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <div className="container max-w-3xl py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-sm text-forest/55" aria-label="Breadcrumb">
            <Link href="/learn" className="hover:text-forest">Learn</Link>
            <span>/</span>
            <span className="text-forest">{article.tag}</span>
          </nav>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-forest sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-moss">
            {article.tag} · {article.readTime}
          </p>
        </div>
      </div>

      {/* Body */}
      <article className="container max-w-3xl py-12 sm:py-16">
        <p className="text-lg leading-relaxed text-forest">{article.intro}</p>

        <div className="mt-10 space-y-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-xl font-semibold text-forest sm:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-forest/75">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-lg bg-parchment px-5 py-4 text-xs text-forest/55">
          This is demo editorial content for the prototype. Please review with the founders before
          publishing.
        </p>

        <div className="mt-10">
          <LinkButton href="/shop">
            Shop Products <ArrowRight width={16} />
          </LinkButton>
        </div>
      </article>

      {/* More reads */}
      <section className="border-t border-forest/8 bg-parchment/50 py-14">
        <div className="container">
          <h2 className="text-2xl font-semibold tracking-tight">More to read</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {more.map((a) => (
              <Link
                key={a.slug}
                href={`/learn/${a.slug}`}
                className="group flex flex-col rounded-lg border border-forest/8 bg-white/60 p-6 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">{a.tag}</span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-forest">{a.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-forest/65">{a.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-moss transition-colors group-hover:text-forest">
                  Read <ArrowRight width={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
