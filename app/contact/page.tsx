import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about products, orders or ingredients? Get in touch with Surakshitam Naturals.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="We'd love to hear from you"
        intro="Questions about a product, an order, or an ingredient? Send us a note and we'll get back to you."
      />

      <div className="container grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm />

        <aside className="space-y-6">
          <div className="rounded-lg border border-forest/8 bg-parchment/60 p-6">
            <h2 className="font-serif text-lg font-semibold text-forest">Reach us directly</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-forest/50">Phone / WhatsApp</dt>
                <dd className="text-forest">{site.phone}</dd>
              </div>
              {site.email && (
                <div>
                  <dt className="text-forest/50">Email</dt>
                  <dd className="text-forest">{site.email}</dd>
                </div>
              )}
              <div>
                <dt className="text-forest/50">Address</dt>
                <dd className="text-forest">
                  {site.address.line1}, {site.address.line2}, {site.address.city} –{" "}
                  {site.address.postalCode}, {site.address.region}
                </dd>
              </div>
              <div>
                <dt className="text-forest/50">Hours</dt>
                <dd className="text-forest">Mon–Sat, 10am–6pm IST</dd>
              </div>
            </dl>
          </div>

          <a
            href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
            className="flex items-center gap-3 rounded-lg bg-moss p-5 text-cream transition-colors hover:bg-moss/90"
          >
            <WhatsAppIcon width={22} />
            <div>
              <p className="font-medium">Chat on WhatsApp</p>
              <p className="text-sm text-cream/80">Usually the fastest way to reach us</p>
            </div>
          </a>
        </aside>
      </div>
    </>
  );
}
