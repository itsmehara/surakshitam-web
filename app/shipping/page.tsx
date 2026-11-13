import type { Metadata } from "next";
import { site } from "@/lib/site";
import { policy } from "@/lib/policies";
import { COURIER_BASE_UP_TO_G, FREE_DELIVERY_OVER, OUTSIDE_RATE, TELANGANA_RATE } from "@/lib/delivery";
import { PolicyLink, PolicyPage, ReachUs, type PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  alternates: { canonical: "/shipping/" },
  title: "Shipping and Delivery",
  description:
    "Where Surakshitam Naturals delivers, courier charges by weight, Rapido delivery in Hyderabad, and dispatch and delivery times.",
};

const baseKg = COURIER_BASE_UP_TO_G / 1000;
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const sections: PolicySection[] = [
  {
    heading: "Where we deliver",
    body: [
      "We deliver within India only, from Hyderabad. We do not ship to other countries at present.",
    ],
  },
  {
    heading: "Courier charges",
    body: [
      <>
        The courier charge depends on the total weight of your order and the State it goes to. It is shown at
        checkout before you pay and is added to the order total.
      </>,
      <>
        <strong className="font-semibold text-forest">Telangana (including Hyderabad):</strong>{" "}
        {rupees(TELANGANA_RATE.base)} for orders up to {baseKg} kg, then {rupees(TELANGANA_RATE.perKg)} for each
        additional kg or part of a kg.
      </>,
      <>
        <strong className="font-semibold text-forest">Rest of India:</strong> {rupees(OUTSIDE_RATE.base)} for orders
        up to {baseKg} kg, then {rupees(OUTSIDE_RATE.perKg)} for each additional kg or part of a kg.
      </>,
      <>
        <strong className="font-semibold text-forest">No courier charge</strong> on courier orders where the items
        total more than {rupees(FREE_DELIVERY_OVER)}.
      </>,
    ],
  },
  {
    heading: "Rapido delivery in Hyderabad and Secunderabad",
    body: [
      "For pincodes starting with 500 you can choose Rapido at checkout for faster local delivery. A rider is arranged once your order is packed, and you pay the Rapido fare directly to the rider on delivery. The fare is not included in your order total and is not covered by the free courier offer.",
    ],
  },
  {
    heading: "Other arrangements",
    body: [
      <>
        For pickup, bulk orders or anything else, choose “Others” at checkout or WhatsApp/call {site.phone}. We
        confirm the arrangement and any charge with you before you pay.
      </>,
    ],
  },
  {
    heading: "Dispatch and delivery times",
    body: [
      <>
        Orders are packed and handed to the courier within {policy.dispatchDays} working days after payment is
        confirmed. Some products are made fresh in small batches; if one needs longer, we tell you on WhatsApp before
        dispatch.
      </>,
      <>
        After dispatch, delivery usually takes {policy.transitTelangana} working days within Telangana and{" "}
        {policy.transitElsewhere} working days elsewhere in India. These are estimates from the courier, not
        guarantees; remote areas, weather, festivals and strikes can add time.
      </>,
      "We send you the courier name and tracking number on WhatsApp when the parcel is dispatched.",
    ],
  },
  {
    heading: "Receiving your parcel",
    body: [
      "Please make sure someone can receive the parcel and that the phone number you gave is reachable; the courier calls it. Check the parcel when it arrives.",
      <>
        If anything is damaged, leaking, wrong or missing, see our{" "}
        <PolicyLink href="/refunds">Refund and Cancellation</PolicyLink> policy for what to do and by when.
      </>,
    ],
  },
  {
    heading: "Contact",
    body: [
      <>
        Questions about a delivery: write to <ReachUs />, {site.hours}. {site.name}, {site.address.line1},{" "}
        {site.address.line2}, {site.address.city} – {site.address.postalCode}.
      </>,
    ],
  },
];

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping and Delivery"
      intro="Where we deliver, what it costs and how long it takes."
      sections={sections}
    />
  );
}
