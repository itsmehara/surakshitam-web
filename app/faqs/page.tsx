import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about Surakshitam Naturals products, orders, shipping and returns.",
};

const faqs: FaqItem[] = [
  {
    question: "Are your products really natural?",
    answer:
      "Yes. Our home-care and personal-care products are made with plant-based ingredients and natural essential oils, handcrafted in small batches. Full ingredient lists are on every product page.",
  },
  {
    question: "Are your products safe for sensitive skin?",
    answer:
      "Most customers with sensitive skin do well with our products, but everyone's skin is different. We recommend a small patch test before first use, especially if you have known sensitivities — check the ingredients list on the product page.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are typically dispatched within 2–4 business days, then delivered in 3–7 business days depending on your location. See our Shipping Policy for full details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cards, UPI, net banking and cash on delivery (COD) where available, via our checkout.",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Yes — if an item arrives damaged, incorrect or defective, contact us within 7 days of delivery. For hygiene reasons, opened personal-care items can only be returned if they arrived damaged or incorrect. See our Returns & Cancellations policy for details.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, we'll share tracking details. You can also check status any time on the Track Order page using your order number and phone number.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "We currently ship to serviceable PIN codes across India. International shipping isn't available yet.",
  },
  {
    question: "How do I use a coupon or offer code?",
    answer:
      "Enter your code at checkout in the coupon field before placing your order. Active offers are also shown in the banner at the top of the site when available.",
  },
];

export default function FaqsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Support"
        title="Frequently asked questions"
        intro="Everything you need to know about our products, orders, shipping and returns. Can't find your answer? Reach out — we're happy to help."
      />
      <div className="container max-w-2xl py-12 sm:py-16">
        <FaqAccordion items={faqs} />
        <p className="mt-8 text-sm text-forest/60">
          Still have a question?{" "}
          <a href="/contact" className="font-medium text-moss underline">
            Contact us
          </a>{" "}
          and we'll get back to you.
        </p>
      </div>
    </>
  );
}
