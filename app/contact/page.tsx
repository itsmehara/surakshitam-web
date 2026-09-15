import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/ui/PageIntro";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { site } from "@/lib/site";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, YouTubeIcon, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Order on WhatsApp or send an enquiry — phone, email, address and hours for Surakshitam Naturals, Hyderabad.",
};

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-forest/8 text-forest transition-colors hover:bg-forest/15";

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="We'd love to hear from you"
        intro="Ask about products, partner with us, or book a consultation. WhatsApp is quickest; the form below works just as well."
      />

      <div className="container grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
        <section id="enquiry" aria-labelledby="enquiry-heading">
          <h2 id="enquiry-heading" className="font-serif text-2xl font-semibold text-forest">
            Send an enquiry
          </h2>
          <p className="mt-2 text-sm text-forest/60">
            Product questions, brand partnerships or a consultation slot — one form, pick what you need.
          </p>
          <div className="mt-6">
            {/* EnquiryForm reads ?type= with useSearchParams → Suspense for the static export */}
            <Suspense fallback={<div className="h-96 rounded-lg bg-parchment/60" />}>
              <EnquiryForm />
            </Suspense>
          </div>
        </section>

        <aside className="space-y-6">
          {/* WhatsApp first — it is the primary channel for v3 */}
          <WhatsAppLink
            id="whatsapp"
            cta="contact"
            className="flex items-center gap-3 rounded-lg bg-[#25D366] p-5 text-white transition-transform duration-200 hover:scale-[1.02]"
          >
            <WhatsAppIcon width={24} />
            <div>
              <p className="font-semibold">Chat on WhatsApp</p>
              <p className="text-sm text-white/85">Fastest way to reach us · Mon–Sat, {site.hours}</p>
            </div>
          </WhatsAppLink>

          <div className="rounded-lg border border-forest/8 bg-parchment/60 p-6">
            <h2 className="font-serif text-lg font-semibold text-forest">Reach us directly</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-forest/50">Email</dt>
                <dd className="text-forest">
                  {/* Opens the form above rather than a mail app — every message lands in the Sheet. */}
                  <a href="#enquiry" className="inline-flex items-center gap-1 hover:text-moss">
                    {site.email} <ArrowRight width={13} className="text-moss" />
                  </a>
                  <span className="block text-xs text-forest/50">Use the enquiry form — we reply by email or WhatsApp.</span>
                </dd>
              </div>
              <div>
                <dt className="text-forest/50">Address</dt>
                <dd className="text-forest">
                  {site.address.line1}, {site.address.line2}, {site.address.city} –{" "}
                  {site.address.postalCode}, {site.address.region}
                </dd>
              </div>
              <div>
                <dt className="text-forest/50">Hours</dt>
                <dd className="text-forest">Mon–Sat, {site.hours} IST</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-forest/8 bg-parchment/60 p-6">
            <h2 className="font-serif text-lg font-semibold text-forest">Follow us</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-forest hover:text-moss">
                  <span className={socialClass}><YouTubeIcon width={18} /></span> YouTube · @SurakshitamNaturals
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-forest hover:text-moss">
                  <span className={socialClass}><InstagramIcon width={18} /></span> Instagram · @{site.instagramHandle}
                </a>
              </li>
              <li>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-forest hover:text-moss">
                  <span className={socialClass}><FacebookIcon width={18} /></span> Facebook · surakshitam.naturals
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
