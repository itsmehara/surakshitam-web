import Link from "next/link";
import { site } from "@/lib/site";
import { policy } from "@/lib/policies";

export type PolicySection = { heading: string; body: React.ReactNode[] };

const link = "text-moss underline underline-offset-2 hover:text-forest";

/** Email and phone links, for "write to … or call …" sentences on the policy pages. */
export function ReachUs() {
  return (
    <>
      <a href={`mailto:${site.email}`} className={link}>
        {site.email}
      </a>{" "}
      or WhatsApp/call{" "}
      <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={link}>
        {site.phone}
      </a>
    </>
  );
}

export function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={link}>
      {children}
    </Link>
  );
}

/** Shared layout for /terms, /refunds and /shipping (same look as /privacy). */
export function PolicyPage({ title, intro, sections }: { title: string; intro: string; sections: PolicySection[] }) {
  return (
    <>
      <div className="border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <div className="container max-w-3xl py-12 sm:py-16">
          <h1 className="font-serif text-3xl font-semibold leading-tight text-forest sm:text-4xl">{title}</h1>
          <p className="mt-3 text-base leading-relaxed text-forest/75">{intro}</p>
        </div>
      </div>

      <article className="container max-w-3xl py-12 sm:py-16">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-xl font-semibold text-forest sm:text-2xl">{section.heading}</h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-forest/75">
                {section.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-forest/55">
          Last updated {policy.updated}.{" "}
          <Link href="/contact" className="underline underline-offset-2 hover:text-forest">
            Contact us
          </Link>
        </p>
      </article>
    </>
  );
}
