import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy/" },
  title: "Privacy",
  description:
    "What Surakshitam Naturals collects when you browse, enquire or order — and how to see, correct or delete it.",
};

const updated = "9 October 2026";

const sections: { heading: string; body: React.ReactNode[] }[] = [
  {
    heading: "What we collect, and why",
    body: [
      <>
        <strong className="font-semibold text-forest">When you order.</strong> Your name, phone number, email (if
        given), delivery address, the items in your cart, any note and your payment reference (if you paid). We use
        these only to confirm, pack and deliver your order and to contact you about it. The order is sent to us on
        WhatsApp and a copy is saved in our private order sheet.
      </>,
      <>
        <strong className="font-semibold text-forest">When you send an enquiry.</strong> Your name, phone or email
        and your message (and a preferred time, for consultations), so we can reply. It is saved in the same private
        sheet and emailed to us.
      </>,
      <>
        <strong className="font-semibold text-forest">When you tap a WhatsApp button.</strong> Which button and
        product it was, the page, the page you came from and your browser type, so we know which pages help people
        reach us. No name or number is recorded at that point.
      </>,
      <>
        <strong className="font-semibold text-forest">When you browse.</strong> We use Google Analytics to count
        visits: pages viewed, roughly where visitors are (city level), device and browser, and events such as a
        WhatsApp tap or an order being sent (order number, total and item count only — never your name, phone or
        address). Google Analytics uses cookies to do this.
      </>,
    ],
  },
  {
    heading: "Kept on your own device",
    body: [
      "Your cart, cart note and delivery details (so you don't retype them next time) are stored in your browser, not on our side. Clearing your browser's site data removes them.",
    ],
  },
  {
    heading: "Who else sees it",
    body: [
      "We don't sell or rent your information, and we don't use it for advertising. It passes only through the services that make the site work: WhatsApp (Meta) for orders and chat, Google (Sheets, Gmail and Analytics) for storing orders and enquiries and counting visits, and GitHub Pages, which hosts this website. Instagram reels on our homepage load from Instagram only when you choose to play one.",
      "We share delivery details with a courier only when needed to deliver your order.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Orders and enquiries are kept as long as we need them for the order, after-sales questions and our accounts and tax records. Google Analytics data is kept for Google's standard period (up to 14 months).",
    ],
  },
  {
    heading: "Your choices",
    body: [
      <>
        You can ask us to show, correct or delete the information we hold about you, or withdraw consent, at any
        time — write to{" "}
        <a href={`mailto:${site.email}`} className="text-moss underline underline-offset-2 hover:text-forest">
          {site.email}
        </a>{" "}
        or WhatsApp/call{" "}
        <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-moss underline underline-offset-2 hover:text-forest">
          {site.phone}
        </a>
        . We'll reply within a reasonable time, as required by India's Digital Personal Data Protection Act, 2023.
      </>,
      <>
        To stop Google Analytics counting your visits, you can block cookies for this site in your browser or use
        Google's{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
          className="text-moss underline underline-offset-2 hover:text-forest"
        >
          opt-out add-on
        </a>
        . The site works the same either way.
      </>,
    ],
  },
  {
    heading: "Contact",
    body: [
      <>
        {site.name}, {site.address.line1}, {site.address.line2}, {site.address.city} – {site.address.postalCode}.
        Questions about this page: <a href={`mailto:${site.email}`} className="text-moss underline underline-offset-2 hover:text-forest">{site.email}</a>.
        If we change how we use your information, we'll update this page and the date below.
      </>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <div className="container max-w-3xl py-12 sm:py-16">
          <h1 className="font-serif text-3xl font-semibold leading-tight text-forest sm:text-4xl">Privacy</h1>
          <p className="mt-3 text-base leading-relaxed text-forest/75">
            We collect only what we need to take your order and reply to you — in plain words below.
          </p>
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
          Last updated {updated}. <Link href="/contact" className="underline underline-offset-2 hover:text-forest">Contact us</Link>
        </p>
      </article>
    </>
  );
}
