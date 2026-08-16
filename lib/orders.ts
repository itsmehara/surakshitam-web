/**
 * Orders + address book. Prototype persistence is localStorage (client-only).
 * Orders keep price/name snapshots so history stays correct even if products
 * change later. Swap these helpers for API/DB calls in production.
 */

export type PaymentStatus = "PAID" | "FAILED" | "PENDING";
export type FulfillmentStatus =
  | "CONFIRMED"
  | "PACKING"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED";

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
  total: number;
  address: Address;
  paymentStatus: PaymentStatus;
  paymentId: string;
  fulfillmentStatus: FulfillmentStatus;
  /** Owning customer id (10-digit mobile). Absent = legacy/guest; matched by phone. */
  userId?: string;
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
}

/** Ordered fulfilment lifecycle (used by admin controls + customer tracking). */
export const FULFILLMENT_FLOW: FulfillmentStatus[] = [
  "CONFIRMED",
  "PACKING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
];

export function updateOrderStatus(orderNumber: string, status: FulfillmentStatus): void {
  const all = readOrders();
  const next = all.map((o) =>
    o.orderNumber === orderNumber ? { ...o, fulfillmentStatus: status } : o,
  );
  writeOrders(next);
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
