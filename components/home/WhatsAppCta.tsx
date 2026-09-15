import Link from "next/link";
import { site } from "@/lib/site";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon, ArrowRight } from "@/components/icons";

/**
 * Homepage closer for v3: the one thing a visitor can do is start a chat.
 * Takes the slot the newsletter form used to have (same moss panel styling).
 */
export function WhatsAppCta() {
  return (
    <section className="bg-cream pb-20 pt-4 sm:pb-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-lg bg-moss px-6 py-12 text-cream sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cream/10 blur-2xl"
          />
          <div className="relative mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">
              Order on WhatsApp
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-cream sm:text-3xl">
              Found something you&rsquo;d like to try?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Message us with the product name and we&rsquo;ll reply with price, availability and
              delivery details. Mon–Sat, {site.hours}. Online ordering is coming soon.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppLink
                cta="home-cta"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:scale-[1.03]"
              >
                <WhatsAppIcon width={18} height={18} /> Chat on WhatsApp
              </WhatsAppLink>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-parchment"
              >
                Send an enquiry <ArrowRight width={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
