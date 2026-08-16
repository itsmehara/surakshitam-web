/**
 * Payment abstraction. The prototype uses MockPaymentProvider (no real charge).
 * A real RazorpayPaymentProvider can implement the same interface later without
 * touching the checkout UI. Secret keys must never live in client code.
 */

export interface PaymentRequest {
  amount: number; // paise
  orderNumber: string;
}

export interface PaymentResult {
  status: "success" | "failed";
  paymentId?: string;
}

export interface PaymentProvider {
  pay(req: PaymentRequest, opts?: { succeed?: boolean }): Promise<PaymentResult>;
}

/** Simulated gateway — never performs a real charge. */
export const mockPaymentProvider: PaymentProvider = {
  async pay(_req, opts) {
    await new Promise((r) => setTimeout(r, 900)); // mimic gateway latency
    if (opts?.succeed === false) return { status: "failed" };
    return { status: "success", paymentId: `pay_demo_${Math.random().toString(36).slice(2, 12)}` };
  },
};
