import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { site } from "@/lib/site";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, YouTubeIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Order on WhatsApp or send an enquiry — phone, email, address and hours for Surakshitam Naturals, Hyderabad.",
};

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full bg-forest/8 text-forest transition-colors hover:bg-forest/15";

export default function ContactPage() {
  const telHref = `tel:${site.phone.replace(/\s+/g, "")}`;

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="We'd love to hear from you"
        intro="The quickest way to order or ask about a product is WhatsApp. Prefer a form? Send an enquiry below and we'll reply by phone or email."
      />

      <div className="container grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="enquiry-heading">
          <h2 id="enquiry-heading" className="font-serif text-2xl font-semibold text-forest">
            Send an enquiry
          </h2>
          <p className="mt-2 text-sm text-forest/60">
            Tell us which product you&apos;re interested in and we&apos;ll get back to you with price,
            availability and delivery details.
          </p>
          <div className="mt-6">
            <EnquiryForm />
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
              <p className="text-sm text-white/85">{site.whatsapp} · usually the fastest way to reach us</p>
            </div>
          </WhatsAppLink>

          <div className="rounded-lg border border-forest/8 bg-parchment/60 p-6">
            <h2 className="font-serif text-lg font-semibold text-forest">Reach us directly</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-forest/50">Phone / WhatsApp</dt>
                <dd className="text-forest">
                  <a href={telHref} className="inline-flex items-center gap-1.5 hover:text-moss">
                    <PhoneIcon width={14} /> {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-forest/50">Email</dt>
                <dd className="text-forest">
                  <a href={`mailto:${site.email}`} className="hover:text-moss">
                    {site.email}
                  </a>
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
