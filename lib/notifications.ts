/**
 * Notification abstraction. The prototype uses MockNotificationProvider, which
 * "sends" WhatsApp messages by recording them locally so a dev viewer can show
 * them. Swap for a WhatsAppProvider (Meta WhatsApp Business API) in production —
 * server-side only, credentials never in client code.
 *
 * Every message records an explicit `to` phone number so it is clear which
 * WhatsApp number each message is delivered to:
 *   - customer messages  → the phone number entered at checkout
 *   - admin messages     → the founders' WhatsApp number (site.whatsapp)
 */

import { site } from "./site";
import type { Order, FulfillmentStatus } from "./orders";

export type NotificationAudience = "customer" | "admin";

export interface NotificationRecord {
  id: string;
  channel: "whatsapp";
  audience: NotificationAudience;
  /** Human-readable recipient label, e.g. "Customer · Bhavesh". */
  recipient: string;
  /** Explicit destination WhatsApp number the message is sent to. */
  to: string;
  template: string;
  message: string;
  status: "sent" | "failed";
  createdAt: string;
  /** Archived messages are kept for history but hidden from the Active view. */
  archived?: boolean;
}

export type NotificationDraft = Omit<NotificationRecord, "id" | "createdAt" | "status" | "archived">;

export interface NotificationProvider {
  send(input: NotificationDraft): Promise<NotificationRecord>;
}

const KEY = "sn-notifications-v1";

function read(): NotificationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as NotificationRecord[];
  } catch {
    return [];
  }
}

function write(list: NotificationRecord[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export const mockNotificationProvider: NotificationProvider = {
  async send(input) {
    const rec: NotificationRecord = {
      ...input,
      id: `ntf_${Math.random().toString(36).slice(2, 10)}`,
      status: "sent",
      createdAt: new Date().toISOString(),
      archived: false,
    };
    const all = read();
    all.unshift(rec);
    write(all);
    return rec;
  },
};

/** Active (non-archived) notifications, newest first. */
export function getNotifications(): NotificationRecord[] {
  return read().filter((n) => !n.archived);
}

/** Archived notifications, newest first. */
export function getArchivedNotifications(): NotificationRecord[] {
  return read().filter((n) => n.archived);
}

/**
 * "Clear" no longer deletes history — it archives the active messages so the
 * founders always keep a full audit trail. Archived messages remain visible
 * under the Archive tab.
 */
export function archiveNotifications() {
  write(read().map((n) => (n.archived ? n : { ...n, archived: true })));
}

/** Move everything back into the Active view. */
export function restoreNotifications() {
  write(read().map((n) => ({ ...n, archived: false })));
}

/* ------------------------------ templates ------------------------------ */

function rupees(paise: number) {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function itemSummary(order: Order) {
  return order.items.map((i) => `${i.nameSnapshot} × ${i.qty}`).join(", ");
}

/** Sent to the customer's WhatsApp number when their order is placed. */
export function customerOrderPlaced(order: Order): NotificationDraft {
  const message = [
    `Hi ${order.address.fullName || "there"}, thank you for ordering from Surakshitam Naturals 🌿`,
    ``,
    `Order: ${order.orderNumber}`,
    `Amount: ₹${rupees(order.total)}`,
    ``,
    `We'll notify you once your order is ready for dispatch.`,
    `Track: ${site.url}/track-order`,
  ].join("\n");
  return {
    channel: "whatsapp",
    audience: "customer",
    recipient: `Customer · ${order.address.fullName || "Guest"}`,
    to: order.address.phone || "—",
    template: "customer_order_placed",
    message,
  };
}

/** Sent to the founders' WhatsApp number so they can start preparing the order. */
export function adminNewOrder(order: Order): NotificationDraft {
  const message = [
    `🌿 New Surakshitam Naturals order`,
    ``,
    `Order: ${order.orderNumber}`,
    `Customer: ${order.address.fullName}`,
    `Phone: ${order.address.phone}`,
    `Items: ${itemSummary(order)}`,
    `Total: ₹${rupees(order.total)}`,
    `Payment: ${order.paymentStatus}`,
    `Packing status: Pending`,
    ``,
    `Open Admin: ${site.url}/studio/orders`,
  ].join("\n");
  return {
    channel: "whatsapp",
    audience: "admin",
    recipient: "Admin · Founders",
    to: site.whatsapp,
    template: "admin_new_order",
    message,
  };
}

const STATUS_COPY: Record<FulfillmentStatus, string> = {
  CONFIRMED: "Your order is confirmed.",
  PACKING: "Good news — we've started packing your order.",
  PACKED: "Your order is packed and ready for dispatch.",
  SHIPPED: "Your order has been shipped and is on its way!",
  DELIVERED: "Your order has been delivered. We hope you love it 🌿",
};

/** Sent to the customer when the admin advances the fulfillment status. */
export function customerOrderStatus(order: Order, status: FulfillmentStatus): NotificationDraft {
  const shippingLine =
    status === "SHIPPED" && order.courier && order.courier !== "Handed over to customer"
      ? [`Courier: ${order.courier}`, order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : null]
          .filter(Boolean)
          .join("\n")
      : null;
  const message = [
    `Hi ${order.address.fullName || "there"}, an update on your Surakshitam Naturals order 🌿`,
    ``,
    `Order: ${order.orderNumber}`,
    STATUS_COPY[status],
    ...(shippingLine ? ["", shippingLine] : []),
    ``,
    `Track: ${site.url}/track-order`,
  ].join("\n");
  return {
    channel: "whatsapp",
    audience: "customer",
    recipient: `Customer · ${order.address.fullName || "Guest"}`,
    to: order.address.phone || "—",
    template: `customer_status_${status.toLowerCase()}`,
    message,
  };
}
