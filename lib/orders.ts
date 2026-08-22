/**
 * Orders + address book. Prototype persistence is localStorage (client-only).
 * Orders keep price/name snapshots so history stays correct even if products
 * change later. Swap these helpers for API/DB calls in production.
 */

import { getAdminSession } from "./admin";
import { logEvent } from "./audit";
import { decrementStockForOrder } from "./catalog-store";
import type { DeliveryMode, DeliveryZone } from "./delivery";

export type PaymentStatus = "PAID" | "FAILED" | "PENDING";
export type FulfillmentStatus =
  | "CONFIRMED"
  | "PACKING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED";

/** Shared, friendly labels for each fulfilment stage — used by admin screens
 *  and customer tracking so the wording stays consistent in one place. */
export const FULFILLMENT_LABEL: Record<FulfillmentStatus, string> = {
  CONFIRMED: "Order received",
  PACKING: "Order in packing",
  PACKED: "Packed",
  SHIPPED: "Dispatched",
  DELIVERED: "Delivered",
};

/** Courier options offered when an order ships by parcel service rather than by
 *  bike. "Handed over to customer" covers a doorstep handover with no tracking. */
export const COURIER_OPTIONS = [
  "Handed over to customer",
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "India Post (Speed Post)",
  "Ekart",
  "Other",
] as const;

export interface Address {
  fullName: string;
  phone: string;
  altPhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  type: "Home" | "Work" | "Other";
}

export interface OrderItem {
  productId: string;
  slug: string;
  nameSnapshot: string;
  skuSnapshot: string;
  priceSnapshot: number; // paise
  qty: number;
  image: string;
  size: string;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  /** Discount applied via an offer code, in paise (0 if none). */
  discount?: number;
  /** The offer code used, if any — kept for reporting/audit even if the offer is later deleted. */
  offerCode?: string;
  total: number;
  address: Address;
  paymentStatus: PaymentStatus;
  paymentId: string;
  fulfillmentStatus: FulfillmentStatus;
  /** Owning customer id (10-digit mobile). Absent = legacy/guest; matched by phone. */
  userId?: string;
  /** Set when marked Shipped — which courier/partner, and their tracking number. */
  courier?: string;
  trackingNumber?: string;

  /** Approximate parcel weight at order time, in grams (see lib/weight.ts). */
  weightGrams?: number;
  /** How delivery was priced — kept so the charge can be explained later. */
  deliveryQuote?: {
    zone: DeliveryZone;
    distanceKm: number;
    area?: string;
    baseFee: number;
    distanceSurcharge: number;
    freeApplied: boolean;
  };
  /** How the parcel actually went out. Most city orders go by bike. */
  deliveryMode?: DeliveryMode;
  /**
   * The person carrying the parcel. Their number is shown to the customer so
   * they can call about the drop. PRODUCTION: route this through a masked-number
   * service (Exotel/Knowlarity) rather than exposing a personal mobile.
   */
  rider?: { name: string; phone: string; vehicleNumber?: string };
  /** The partner's own live-tracking page (Rapido/Uber trip link), if provided. */
  liveTrackingUrl?: string;
  /** Set when the rider picks the parcel up — the clock the ETA counts from. */
  dispatchedAt?: string;
  /** ETA in minutes quoted at dispatch. */
  etaMinutes?: number;
}

/** Everything captured when an order is marked Shipped. */
export interface ShippingDetails {
  courier?: string;
  trackingNumber?: string;
  deliveryMode?: DeliveryMode;
  rider?: { name: string; phone: string; vehicleNumber?: string };
  liveTrackingUrl?: string;
  etaMinutes?: number;
}

/** Last-10-digits form used to match a customer to their orders. */
function phoneId(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}

const ORDERS_KEY = "sn-orders-v1";
const ADDRESS_KEY = "sn-address-v1";

export function generateOrderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 899999);
  return `SURK-${new Date().getFullYear()}-${n}`;
}

function readOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]") as Order[];
  } catch {
    return [];
  }
}

function writeOrders(all: Order[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function createOrder(order: Order): void {
  const all = readOrders();
  all.unshift(order);
  writeOrders(all);
  // Inventory should reflect sales automatically — admins shouldn't have to manually
  // subtract every purchase. Runs after the order write so the order itself is never
  // blocked by a stock-side issue.
  decrementStockForOrder(order.items.map((i) => ({ productId: i.productId, qty: i.qty })));
}

/** Ordered fulfilment lifecycle (used by admin controls + customer tracking). */
export const FULFILLMENT_FLOW: FulfillmentStatus[] = [
  "CONFIRMED",
  "PACKING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

/**
 * Advances/sets an order's fulfilment status. When marking Shipped, pass
 * `shipping` to record the courier + tracking number in the same write.
 * Logs a `order_status_changed` activity event here (rather than in each
 * admin screen) so every status change is captured no matter which screen
 * triggered it.
 */
export function updateOrderStatus(
  orderNumber: string,
  status: FulfillmentStatus,
  shipping?: ShippingDetails,
): void {
  const all = readOrders();
  let from: FulfillmentStatus | undefined;
  const next = all.map((o) => {
    if (o.orderNumber !== orderNumber) return o;
    from = o.fulfillmentStatus;
    return {
      ...o,
      fulfillmentStatus: status,
      ...(shipping?.courier !== undefined ? { courier: shipping.courier } : {}),
      ...(shipping?.trackingNumber !== undefined ? { trackingNumber: shipping.trackingNumber } : {}),
      ...(shipping?.deliveryMode !== undefined ? { deliveryMode: shipping.deliveryMode } : {}),
      ...(shipping?.rider !== undefined ? { rider: shipping.rider } : {}),
      ...(shipping?.liveTrackingUrl !== undefined ? { liveTrackingUrl: shipping.liveTrackingUrl } : {}),
      ...(shipping?.etaMinutes !== undefined ? { etaMinutes: shipping.etaMinutes } : {}),
      // The dispatch clock starts once, when the parcel actually leaves.
      ...(status === "SHIPPED" && !o.dispatchedAt ? { dispatchedAt: new Date().toISOString() } : {}),
    };
  });
  writeOrders(next);

  const admin = getAdminSession();
  logEvent({
    type: "order_status_changed",
    actor: { kind: "admin", name: admin?.name },
    meta: {
      orderNumber,
      from: from ?? "",
      to: status,
      ...(shipping?.courier ? { courier: shipping.courier } : {}),
    },
  });
}

export function getOrder(orderNumber: string): Order | undefined {
  return readOrders().find((o) => o.orderNumber === orderNumber);
}

export function getOrders(): Order[] {
  return readOrders();
}

/**
 * Orders belonging to a signed-in customer. Matches on the stored `userId` and,
 * for older/guest orders, on the delivery phone number — so a customer who
 * checked out as a guest still sees those orders after signing in with the same
 * number, and history survives logout → login on the same device.
 */
export function getOrdersForUser(userId: string): Order[] {
  const id = phoneId(userId);
  if (!id) return [];
  return readOrders().filter(
    (o) => (o.userId && phoneId(o.userId) === id) || phoneId(o.address.phone) === id,
  );
}

export function getSavedAddress(): Address | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    return raw ? (JSON.parse(raw) as Address) : null;
  } catch {
    return null;
  }
}

export function saveAddress(address: Address): void {
  try {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
  } catch {
    /* ignore */
  }
}
