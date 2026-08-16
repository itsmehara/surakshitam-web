import Link from "next/link";
import { site, footerNav } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, YouTubeIcon, ArrowRight } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-forest text-cream">
      <div className="container py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand + newsletter cue */}
          <div className="max-w-sm">
            <Logo invert />
            <p className="mt-5 text-sm leading-relaxed text-cream/70">
              Homemade, plant-based home care, skin care and hair care from Hyderabad — made with
              natural essential oils.
            </p>
            <address className="mt-4 space-y-1 text-sm not-italic text-cream/70">
              <p>
                {site.address.line1}, {site.address.line2}
                <br />
                {site.address.city} – {site.address.postalCode}
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-cream">
                  {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-cream">
                  {site.email}
                </a>
              </p>
            </address>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`}
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
              >
                <WhatsAppIcon width={18} />
              </a>
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
              >
                <InstagramIcon width={18} />
              </a>
              <a
                href={site.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
              >
                <FacebookIcon width={18} />
              </a>
              <a
                href={site.social.youtube}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
              >
                <YouTubeIcon width={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-cream/75 transition-colors hover:text-cream"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream/15 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Demo prototype — content and pricing are
            placeholder data.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/policies/privacy" className="transition-colors hover:text-cream">
              Privacy
            </Link>
            <Link href="/policies/terms" className="transition-colors hover:text-cream">
              Terms
            </Link>
            <Link href="/policies/shipping" className="transition-colors hover:text-cream">
              Shipping
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-1 transition-colors hover:text-cream">
              Contact <ArrowRight width={13} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
