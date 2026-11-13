/**
 * Numbers used on the policy pages (/terms, /refunds, /shipping). Drafted 13 Nov 2026
 * for the payment gateway's website review (workspace PENDING A4f).
 *
 * DRAFT VALUES: the founders have not confirmed these yet. Each is a one-line change.
 * Courier rates and the free-delivery threshold are not here; the shipping page reads
 * them from lib/delivery.ts so the page and the checkout can never disagree.
 */
export const policy = {
  /** Date shown as "Last updated" on all three pages. */
  updated: "13 November 2026",
  /** Working days from confirmed payment to handing the parcel to the courier. */
  dispatchDays: "1 to 3",
  /** Working days in transit, after dispatch. */
  transitTelangana: "2 to 4",
  transitElsewhere: "4 to 8",
  /** How long after delivery a customer may report a damaged, wrong or missing item. */
  reportWithinHours: 48,
  /** Working days for an approved refund to reach the customer. */
  refundDays: "5 to 7",
} as const;
