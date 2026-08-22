import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/ui/PageIntro";

interface Section {
  heading: string;
  paragraphs: string[];
}
interface Policy {
  title: string;
  intro: string;
  sections: Section[];
}

const policies: Record<string, Policy> = {
  shipping: {
    title: "Shipping Policy",
    intro:
      "How and when your Surakshitam Naturals order reaches you. Timelines and charges below are current demo estimates — to be confirmed before launch.",
    sections: [
      {
        heading: "Dispatch time",
        paragraphs: [
          "Our products are made in small, considered batches. Orders are typically prepared and dispatched within 2–4 business days of a successful payment.",
          "During new launches, festivals or high demand, dispatch may take a little longer — we'll keep you posted.",
        ],
      },
      {
        heading: "Delivery time",
        paragraphs: [
          "Once dispatched, delivery usually takes 3–7 business days across India, depending on your location. Metro cities are generally quicker; remote PIN codes may take longer.",
          "Monsoon, festival rushes and courier delays can occasionally add time. These estimates are not guarantees.",
        ],
      },
      {
        heading: "Delivery charges",
        paragraphs: [
          "Inside Hyderabad, orders of ₹699 and above are delivered free. Below that, a flat ₹49 delivery charge applies.",
          "Our kitchen is in Nagole. Addresses more than 15 km away carry a distance charge of ₹8 per kilometre beyond that 15 km, whether or not the free-delivery offer applies — the offer waives the base fee, not the extra distance.",
          "Outside Hyderabad, parcels go by courier and are charged on weight: ₹79 up to 1 kg, then ₹40 per additional kilogram. The free-delivery offer applies within the city only.",
          "Any applicable taxes are shown at checkout.",
        ],
      },
      {
        heading: "How your order travels",
        paragraphs: [
          "Most city orders go out on a bike with a delivery partner such as Rapido or Uber, usually the same day. Once dispatched you'll see the rider's name and number on the Track Order page, along with a live map when the rider shares their location.",
          "Parcel weights shown in the cart and on your order are approximate — they're an estimate used to book the delivery, not a billed measurement.",
        ],
      },
      {
        heading: "Coverage & tracking",
        paragraphs: [
          "We currently ship across serviceable PIN codes in India. International shipping isn't available yet.",
          "Once your order ships, we'll share tracking details (via WhatsApp / email), and you can follow progress on the Track Order page.",
        ],
      },
      {
        heading: "Delays, address issues & undelivered parcels",
        paragraphs: [
          "Please double-check your delivery address and phone number at checkout — incorrect details are the most common cause of delays.",
          "If a parcel is returned to us undelivered, we'll reach out to arrange a re-attempt or a refund per our Returns policy.",
        ],
      },
    ],
  },
  returns: {
    title: "Returns & Cancellations",
    intro: "How returns, replacements and cancellations work. Draft policy for the prototype.",
    sections: [
      {
        heading: "Damaged, wrong or defective items",
        paragraphs: [
          "If your order arrives damaged, incorrect, or defective, contact us within 7 days of delivery with your order number and a photo. We'll arrange a replacement or refund.",
          "For hygiene reasons, personal-care items can only be returned if unopened and unused, unless they arrived damaged or incorrect.",
        ],
      },
      {
        heading: "Refunds",
        paragraphs: [
          "Approved refunds are issued to your original payment method, typically within 5–7 business days of us receiving the returned item or confirming the issue.",
        ],
      },
      {
        heading: "Cancellations",
        paragraphs: [
          "You can cancel an order any time before it is dispatched — contact us as soon as possible. Once dispatched, an order can't be cancelled but may be eligible for return as above.",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "How we handle your information. Draft policy — to be finalised with legal review.",
    sections: [
      {
        heading: "What we collect",
        paragraphs: [
          "To process orders we collect your name, phone number, delivery address, and (optionally) email. Payments are handled by our payment provider — we don't store card details.",
        ],
      },
      {
        heading: "How we use it",
        paragraphs: [
          "We use your information only to fulfil and support your orders, and to keep you informed about them. We do not sell your personal data.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "You can ask us to access, correct or delete your information, or to stop non-essential messaging, by contacting us. A full policy covering analytics and consent will be published before launch (India's DPDP Act; GDPR for any EU visitors).",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "The terms for using this site and buying our products. Draft for the prototype.",
    sections: [
      {
        heading: "Using this site",
        paragraphs: [
          "By using this site and placing an order, you agree to provide accurate information and to use the site lawfully.",
        ],
      },
      {
        heading: "Products & pricing",
        paragraphs: [
          "We aim to describe products and prices accurately. In this prototype, product content and pricing are demo/placeholder data. Final prices, taxes and availability will apply at launch.",
        ],
      },
      {
        heading: "Orders",
        paragraphs: [
          "An order is confirmed once payment succeeds. We may cancel and refund an order if an item is unavailable or a pricing error occurs.",
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const policy = policies[params.slug];
  return { title: policy?.title ?? "Policy" };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = policies[params.slug];
  if (!policy) notFound();

  return (
    <>
      <PageIntro eyebrow="Policies" title={policy.title} intro={policy.intro} />
      <div className="container max-w-prose py-12 sm:py-16">
        <div className="space-y-10">
          {policy.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-xl font-semibold text-forest sm:text-2xl">{s.heading}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-forest/75">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 rounded-lg bg-parchment px-5 py-4 text-xs text-forest/55">
          Draft policy for the prototype — to be finalised with the founders and legal review before
          launch. Questions?{" "}
          <a href="/contact" className="font-medium text-moss underline">
            Contact us
          </a>
          .
        </p>
      </div>
    </>
  );
}
