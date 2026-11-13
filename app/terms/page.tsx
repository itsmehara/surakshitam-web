import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PolicyLink, PolicyPage, ReachUs, type PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  alternates: { canonical: "/terms/" },
  title: "Terms and Conditions",
  description: "The terms for ordering from Surakshitam Naturals: orders, prices, payment, product use and liability.",
};

const sections: PolicySection[] = [
  {
    heading: "Who we are",
    body: [
      <>
        This website is run by {site.name}, {site.address.line1}, {site.address.line2}, {site.address.city} –{" "}
        {site.address.postalCode}, {site.address.region}, India. By placing an order you agree to these terms, our{" "}
        <PolicyLink href="/shipping">Shipping and Delivery</PolicyLink> policy, our{" "}
        <PolicyLink href="/refunds">Refund and Cancellation</PolicyLink> policy and our{" "}
        <PolicyLink href="/privacy">Privacy</PolicyLink> page.
      </>,
    ],
  },
  {
    heading: "Products",
    body: [
      "Our products are made in small batches with plant-based ingredients. Colour, scent and texture can vary a little from batch to batch and from the photos on this site. Weights and volumes marked “approx.” are approximate.",
      "Our products are for everyday care. They are not medicines and are not meant to diagnose, treat or cure any condition. Please read the ingredient list before buying, do a patch test before first use on skin or hair, and stop using a product if it causes irritation. If you have a known allergy or a skin condition, ask your doctor first.",
    ],
  },
  {
    heading: "Orders",
    body: [
      "An order placed on this site is a request to buy. It is accepted when we confirm it to you on WhatsApp, by phone or by email. We may decline or cancel an order if a product is out of stock, if the price or description shown was a clear mistake, or if we cannot deliver to your address. If you have already paid for an order we cancel, we refund the full amount.",
      "Please give a correct name, phone number and delivery address. We contact you on the phone number you give if there is a question about the order.",
    ],
  },
  {
    heading: "Prices and payment",
    body: [
      "Prices are in Indian rupees. The delivery charge, if any, is shown at checkout before you pay and is added to the order total. Offers and discounts apply only for the period and on the terms shown with them.",
      "Payment is taken in full before dispatch, by the payment methods shown at checkout. Payments are processed by the UPI app, bank or payment service you choose; we do not see or store your card, bank or UPI PIN details. An order is treated as paid when we have confirmed the money has been received.",
    ],
  },
  {
    heading: "Delivery, returns and refunds",
    body: [
      <>
        Delivery areas, charges and times are set out in our{" "}
        <PolicyLink href="/shipping">Shipping and Delivery</PolicyLink> policy. Cancellations, damaged or wrong items
        and refunds are set out in our <PolicyLink href="/refunds">Refund and Cancellation</PolicyLink> policy.
      </>,
    ],
  },
  {
    heading: "Using this website",
    body: [
      "The text, photos, logo and designs on this site belong to Surakshitam Naturals or are used with permission. Please do not copy them for commercial use without asking us. Articles in the Learn section are general information, not medical advice.",
      "We try to keep the site accurate and available, but we do not promise that it will be free of errors or interruptions at all times.",
    ],
  },
  {
    heading: "Our liability",
    body: [
      "If a product is faulty or not as described, we will replace it or refund you as set out in our Refund and Cancellation policy. To the extent the law allows, our total liability for any order is limited to the amount you paid for that order. Nothing in these terms takes away rights you have under Indian consumer law.",
    ],
  },
  {
    heading: "Law and disputes",
    body: [
      "These terms are governed by the laws of India. Please contact us first so we can try to resolve any problem. Disputes that cannot be resolved are subject to the courts at Hyderabad, Telangana.",
    ],
  },
  {
    heading: "Contact and changes",
    body: [
      <>
        Questions or complaints: write to <ReachUs />, {site.hours}. We may update these terms; the version on this
        page on the day you order is the one that applies to that order.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      intro="The terms that apply when you browse this site and order from us, in plain words."
      sections={sections}
    />
  );
}
