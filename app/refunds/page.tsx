import type { Metadata } from "next";
import { site } from "@/lib/site";
import { policy } from "@/lib/policies";
import { PolicyPage, ReachUs, type PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  alternates: { canonical: "/refunds/" },
  title: "Refund and Cancellation",
  description:
    "How to cancel an order, what to do if an item arrives damaged or wrong, and how refunds are paid by Surakshitam Naturals.",
};

const sections: PolicySection[] = [
  {
    heading: "Cancelling an order",
    body: [
      <>
        You can cancel an order at any time before it is dispatched. WhatsApp or call {site.phone} with your order
        number (it starts with SN-). If you have already paid, we refund the full amount, including the delivery
        charge.
      </>,
      "Once the parcel has been handed to the courier or a Rapido rider, the order can no longer be cancelled.",
    ],
  },
  {
    heading: "Returns",
    body: [
      "Our products are personal care and home care items made in small batches. For hygiene and safety, we cannot take back a product because of a change of mind, or once it has been opened or used.",
      "This does not affect the cases below, where the problem is on our side.",
    ],
  },
  {
    heading: "Damaged, leaking, wrong or missing items",
    body: [
      <>
        If an item arrives damaged or leaking, is not what you ordered, or is missing from the parcel, tell us within{" "}
        {policy.reportWithinHours} hours of delivery. Send your order number and clear photos of the item, the outer
        box and the courier label to our WhatsApp number {site.phone}.
      </>,
      "After we have checked, you choose between a replacement sent at our cost or a refund for the affected item. If the whole order is affected, the refund includes the delivery charge. Please keep the item and its packaging until we confirm; we may ask for it to be returned, at our cost.",
    ],
  },
  {
    heading: "Skin or scalp reaction",
    body: [
      <>
        Plant ingredients can still cause a reaction in some people, which is why we ask you to do a patch test first.
        If a product does not suit you, stop using it and write to us with your order number at <ReachUs />. We look
        at each case and will try to put it right.
      </>,
    ],
  },
  {
    heading: "Parcels that come back to us",
    body: [
      "If a parcel is returned because the address or phone number was wrong, or nobody could receive it after the courier's attempts, we will contact you. We can send it again once the new delivery charge is paid, or refund the price of the items, less the delivery charge already spent.",
    ],
  },
  {
    heading: "How refunds are paid",
    body: [
      <>
        Approved refunds are sent to the same account or payment method you paid from, within {policy.refundDays}{" "}
        working days of our confirmation. Your bank or UPI app may take a little longer to show it. We do not give
        refunds in cash.
      </>,
    ],
  },
  {
    heading: "Contact",
    body: [
      <>
        For any cancellation or refund question, write to <ReachUs />, {site.hours}. {site.name},{" "}
        {site.address.line1}, {site.address.line2}, {site.address.city} – {site.address.postalCode}.
      </>,
    ],
  },
];

export default function RefundsPage() {
  return (
    <PolicyPage
      title="Refund and Cancellation"
      intro="When you can cancel, what we do if something arrives wrong, and how refunds are paid."
      sections={sections}
    />
  );
}
