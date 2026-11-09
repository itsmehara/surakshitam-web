/**
 * UPI payment for the cart total: a standard `upi://pay` link, drawn as a QR
 * code in the browser (see components/checkout/UpiPayment.tsx). No gateway and
 * no third-party service: the money goes straight to the bank account, and the
 * site never learns that a payment happened. The founders match the UTR /
 * bank credit against the order. Roadmap: "Interim: UPI QR without a gateway".
 */

/** Merchant UPI ID (ICICI). Shown to customers, so keep it public-safe. */
export const UPI_ID = "mohanasupriya@okicici";
export const UPI_PAYEE_NAME = "Surakshitam Naturals";

/**
 * `pa` payee UPI ID, `pn` payee name, `am` amount (2 dp), `cu` currency, `tn`
 * note shown in the payer's app. Values are percent-encoded with %20 for spaces,
 * not "+", because some UPI apps show a literal "+". The UPI ID is plain
 * letters/digits/@/. so it is left as-is.
 */
export function upiPayLink(amount: number, note: string): string {
  return (
    `upi://pay?pa=${UPI_ID}` +
    `&pn=${encodeURIComponent(UPI_PAYEE_NAME)}` +
    `&am=${encodeURIComponent(amount.toFixed(2))}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(note)}`
  );
}
