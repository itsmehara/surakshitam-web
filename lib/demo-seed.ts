/**
 * Demo activity seeder (prototype/dev tool only).
 *
 * Populates realistic Activity-log + order data by calling the SAME functions
 * the real app uses (`createOrder`, `updateOrderStatus`, `seedEvents`, ...)
 * rather than faking a UI walkthrough — so the resulting orders genuinely show
 * up in Orders/Packing/Reports/Dashboard, not just the Activity page.
 *
 * Triggered from a button on `/studio/activity` ("Load sample activity").
 * Never runs automatically and is not part of any production data path.
 */

import { products } from "./catalog";
import {
  createOrder,
  updateOrderStatus,
  generateOrderNumber,
  COURIER_OPTIONS,
  type Order,
  type Address,
  type FulfillmentStatus,
} from "./orders";
import { seedEvents, type AuditEvent } from "./audit";
import { saveAdminAccount } from "./admin";

/** name, phone, city, state, postal code — enough variety for realistic, distinct orders. */
const CUSTOMER_POOL: [string, string, string, string, string][] = [
  ["Ananya Reddy", "9845012345", "Bengaluru", "Karnataka", "560034"],
  ["Rahul Verma", "9871234567", "Delhi", "Delhi", "110019"],
  ["Meera Iyer", "9944556677", "Chennai", "Tamil Nadu", "600028"],
  ["Vikram Nair", "9820098200", "Mumbai", "Maharashtra", "400050"],
  ["Divya Krishnan", "9600112233", "Coimbatore", "Tamil Nadu", "641002"],
  ["Arjun Malhotra", "9811223344", "Gurugram", "Haryana", "122001"],
  ["Sneha Kulkarni", "9765432109", "Pune", "Maharashtra", "411038"],
  ["Kiran Rao", "9440011223", "Hyderabad", "Telangana", "500034"],
  ["Ritu Sharma", "9899001122", "Jaipur", "Rajasthan", "302015"],
  ["Farhan Sheikh", "9930011225", "Mumbai", "Maharashtra", "400102"],
  ["Lakshmi Pillai", "9847001122", "Kochi", "Kerala", "682020"],
  ["Ovais Ahmed", "9686001122", "Hyderabad", "Telangana", "500016"],
  ["Priyanka Das", "9831001122", "Kolkata", "West Bengal", "700019"],
  ["Suresh Babu", "9963001122", "Vijayawada", "Andhra Pradesh", "520010"],
  ["Anita George", "9447001122", "Kochi", "Kerala", "682016"],
  ["Naveen Kumar", "9880001122", "Bengaluru", "Karnataka", "560078"],
  ["Pooja Agarwal", "9711001122", "Delhi", "Delhi", "110034"],
  ["Rohit Shetty", "9769001122", "Mumbai", "Maharashtra", "400071"],
  ["Deepa Menon", "9895001122", "Thiruvananthapuram", "Kerala", "695001"],
  ["Imran Qureshi", "9908001122", "Hyderabad", "Telangana", "500008"],
];

const DAY = 24 * 60 * 60 * 1000;

function at(daysAgo: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const UA_MOBILE = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36";
const UA_DESKTOP = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";
const UA_IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1";

let seq = 0;
function evt(partial: Omit<AuditEvent, "id" | "userAgent"> & { userAgent?: string }): AuditEvent {
  seq += 1;
  return {
    id: `seed_${seq}_${Math.random().toString(36).slice(2, 8)}`,
    userAgent: UA_DESKTOP,
    ...partial,
  };
}

const p = (idx: number) => products[idx];

function makeOrder(opts: {
  daysAgo: number;
  hour: number;
  address: Address;
  userId?: string;
  items: { product: (typeof products)[number]; qty: number }[];
}): Order {
  const subtotal = opts.items.reduce((n, i) => n + i.product.price * i.qty, 0);
  const shipping = subtotal >= 59900 ? 0 : 4900;
  return {
    orderNumber: generateOrderNumber(),
    createdAt: at(opts.daysAgo, opts.hour, 10),
    items: opts.items.map((i) => ({
      productId: i.product.id,
      slug: i.product.slug,
      nameSnapshot: i.product.name,
      skuSnapshot: i.product.sku,
      priceSnapshot: i.product.price,
      qty: i.qty,
      image: i.product.image,
      size: i.product.size,
    })),
    subtotal,
    shipping,
    total: subtotal + shipping,
    address: opts.address,
    paymentStatus: "PAID",
    paymentId: `pay_demo_${Math.random().toString(36).slice(2, 10)}`,
    fulfillmentStatus: "CONFIRMED",
    userId: opts.userId,
  };
}

/**
 * Seeds ~9 days of realistic activity: Bhavesh's full shop→cart→checkout→
 * delivered journey, a second customer "Hara" who browses then tries the
 * admin URL directly (logged as `unauthorized_access`), guest browsing
 * across several anonymous visitors, and a handful of admin-side actions
 * (status updates, report exports, a team addition). Also creates real
 * orders so Orders/Packing/Reports/Dashboard have data to show.
 */
export function seedDemoActivity(): { events: number; orders: number } {
  const events: AuditEvent[] = [];
  let orderCount = 0;

  const bhaveshId = "9849116181";
  const bhaveshAddr: Address = {
    fullName: "Bhavesh Allapati",
    phone: bhaveshId,
    line1: "Flat 302, Sri Sai Residency",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500068",
    type: "Home",
  };
  const bvVisitor = "v_seed_bhavesh1";

  const haraId = "9986780850";
  const haraAddr: Address = {
    fullName: "Hara",
    phone: haraId,
    line1: "12-3, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560038",
    type: "Home",
  };
  const haraVisitor = "v_seed_hara1";

  const guestVisitors = ["v_seed_guestA", "v_seed_guestB", "v_seed_guestC", "v_seed_guestD"];

  /* ---------------- Day 9: Bhavesh discovers the site ---------------- */
  events.push(
    evt({ type: "page_view", ts: at(9, 10, 2), actor: { kind: "guest" }, visitorId: bvVisitor, path: "/", userAgent: UA_MOBILE }),
    evt({ type: "page_view", ts: at(9, 10, 4), actor: { kind: "guest" }, visitorId: bvVisitor, path: "/shop", userAgent: UA_MOBILE }),
    evt({
      type: "page_view",
      ts: at(9, 10, 6),
      actor: { kind: "guest" },
      visitorId: bvVisitor,
      path: `/product/${p(0).slug}`,
      userAgent: UA_MOBILE,
    }),
    evt({
      type: "cart_add",
      ts: at(9, 10, 7),
      actor: { kind: "guest" },
      visitorId: bvVisitor,
      productId: p(0).id,
      productName: p(0).name,
      qty: 1,
      userAgent: UA_MOBILE,
    }),
  );

  /* ---------------- Day 8: Bhavesh signs in, buys ---------------- */
  events.push(
    evt({
      type: "login",
      ts: at(8, 18, 30),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      meta: { method: "otp" },
      userAgent: UA_MOBILE,
    }),
    evt({
      type: "page_view",
      ts: at(8, 18, 31),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      path: `/product/${p(2).slug}`,
      userAgent: UA_MOBILE,
    }),
    evt({
      type: "cart_add",
      ts: at(8, 18, 33),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      productId: p(2).id,
      productName: p(2).name,
      qty: 2,
      userAgent: UA_MOBILE,
    }),
    evt({
      type: "cart_remove",
      ts: at(8, 18, 40),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      productId: p(0).id,
      productName: p(0).name,
      userAgent: UA_MOBILE,
    }),
  );
  const order1 = makeOrder({
    daysAgo: 8,
    hour: 18,
    address: bhaveshAddr,
    userId: bhaveshId,
    items: [{ product: p(2), qty: 2 }],
  });
  createOrder(order1);
  orderCount += 1;
  events.push(
    evt({
      type: "order_placed",
      ts: order1.createdAt,
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      meta: { orderNumber: order1.orderNumber, total: order1.total },
      userAgent: UA_MOBILE,
    }),
  );
  updateOrderStatus(order1.orderNumber, "PACKING");
  updateOrderStatus(order1.orderNumber, "PACKED");
  updateOrderStatus(order1.orderNumber, "SHIPPED", { courier: "Delhivery", trackingNumber: "DL487213560IN" });
  updateOrderStatus(order1.orderNumber, "DELIVERED");
  events.push(
    evt({
      type: "logout",
      ts: at(8, 19, 0),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      userAgent: UA_MOBILE,
    }),
  );

  /* ---------------- Day 6: Bhavesh reorders ---------------- */
  events.push(
    evt({
      type: "login",
      ts: at(6, 9, 15),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      meta: { method: "password" },
      userAgent: UA_DESKTOP,
    }),
    evt({
      type: "cart_add",
      ts: at(6, 9, 17),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      productId: p(1).id,
      productName: p(1).name,
      qty: 3,
      userAgent: UA_DESKTOP,
    }),
    evt({
      type: "cart_add",
      ts: at(6, 9, 18),
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      productId: p(3).id,
      productName: p(3).name,
      qty: 1,
      userAgent: UA_DESKTOP,
    }),
  );
  const order2 = makeOrder({
    daysAgo: 6,
    hour: 9,
    address: bhaveshAddr,
    userId: bhaveshId,
    items: [
      { product: p(1), qty: 3 },
      { product: p(3), qty: 1 },
    ],
  });
  createOrder(order2);
  orderCount += 1;
  events.push(
    evt({
      type: "order_placed",
      ts: order2.createdAt,
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      meta: { orderNumber: order2.orderNumber, total: order2.total },
      userAgent: UA_DESKTOP,
    }),
  );
  updateOrderStatus(order2.orderNumber, "PACKING");
  updateOrderStatus(order2.orderNumber, "PACKED");

  /* ---------------- Day 5: Hara browses, then pokes at /studio ---------------- */
  events.push(
    evt({ type: "page_view", ts: at(5, 21, 0), actor: { kind: "guest" }, visitorId: haraVisitor, path: "/", userAgent: UA_IOS }),
    evt({
      type: "login",
      ts: at(5, 21, 2),
      actor: { kind: "customer", id: haraId, name: "Hara" },
      visitorId: haraVisitor,
      meta: { method: "otp" },
      userAgent: UA_IOS,
    }),
    evt({
      type: "page_view",
      ts: at(5, 21, 3),
      actor: { kind: "customer", id: haraId, name: "Hara" },
      visitorId: haraVisitor,
      path: `/product/${p(4).slug}`,
      userAgent: UA_IOS,
    }),
    evt({
      type: "cart_add",
      ts: at(5, 21, 4),
      actor: { kind: "customer", id: haraId, name: "Hara" },
      visitorId: haraVisitor,
      productId: p(4).id,
      productName: p(4).name,
      qty: 1,
      userAgent: UA_IOS,
    }),
    evt({
      type: "unauthorized_access",
      ts: at(5, 21, 6),
      actor: { kind: "customer", id: haraId, name: "Hara" },
      visitorId: haraVisitor,
      path: "/studio",
      userAgent: UA_IOS,
    }),
    evt({
      type: "profile_update",
      ts: at(5, 21, 10),
      actor: { kind: "customer", id: haraId, name: "Hara" },
      visitorId: haraVisitor,
      meta: { field: "password" },
      userAgent: UA_IOS,
    }),
    evt({
      type: "logout",
      ts: at(5, 21, 12),
      actor: { kind: "customer", id: haraId, name: "Hara" },
      visitorId: haraVisitor,
      userAgent: UA_IOS,
    }),
  );

  /* ---------------- Day 4: a failed payment attempt (guest) ---------------- */
  events.push(
    evt({ type: "page_view", ts: at(4, 12, 0), actor: { kind: "guest" }, visitorId: guestVisitors[0], path: "/shop", userAgent: UA_MOBILE }),
    evt({
      type: "cart_add",
      ts: at(4, 12, 2),
      actor: { kind: "guest" },
      visitorId: guestVisitors[0],
      productId: p(5).id,
      productName: p(5).name,
      qty: 1,
      userAgent: UA_MOBILE,
    }),
    evt({
      type: "payment_failed",
      ts: at(4, 12, 6),
      actor: { kind: "guest" },
      visitorId: guestVisitors[0],
      meta: { total: p(5).price },
      userAgent: UA_MOBILE,
    }),
  );

  /* ---------------- Day 3: guest checkout order ---------------- */
  const guestAddr: Address = {
    fullName: "Priya Narayanan",
    phone: "9741122334",
    line1: "7, Lakeview Apartments",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600020",
    type: "Home",
  };
  events.push(
    evt({ type: "page_view", ts: at(3, 15, 0), actor: { kind: "guest" }, visitorId: guestVisitors[1], path: "/shop", userAgent: UA_DESKTOP }),
    evt({
      type: "cart_add",
      ts: at(3, 15, 3),
      actor: { kind: "guest" },
      visitorId: guestVisitors[1],
      productId: p(0).id,
      productName: p(0).name,
      qty: 2,
      userAgent: UA_DESKTOP,
    }),
  );
  const order3 = makeOrder({ daysAgo: 3, hour: 15, address: guestAddr, items: [{ product: p(0), qty: 2 }] });
  createOrder(order3);
  orderCount += 1;
  events.push(
    evt({
      type: "order_placed",
      ts: order3.createdAt,
      actor: { kind: "guest" },
      visitorId: guestVisitors[1],
      meta: { orderNumber: order3.orderNumber, total: order3.total },
      userAgent: UA_DESKTOP,
    }),
  );

  /* ---------------- Day 2–1: more guest browsing (fills out the feed) ---------------- */
  const browsePaths = ["/", "/shop", "/ingredients", "/our-story", "/learn", "/contact", "/search"];
  guestVisitors.forEach((v, vi) => {
    for (let i = 0; i < 6; i++) {
      const daysAgo = 2 - (i % 2);
      events.push(
        evt({
          type: "page_view",
          ts: at(daysAgo, 8 + i, (vi * 7 + i * 3) % 60),
          actor: { kind: "guest" },
          visitorId: v,
          path:
            i % 3 === 0
              ? `/product/${p((vi + i) % products.length).slug}`
              : browsePaths[(vi + i) % browsePaths.length],
          userAgent: [UA_MOBILE, UA_DESKTOP, UA_IOS][vi % 3],
        }),
      );
    }
  });

  /* ---------------- Today: admin-side activity ---------------- */
  events.push(
    evt({
      type: "login",
      ts: at(0, 9, 0),
      actor: { kind: "admin", name: "Srikanth" },
      visitorId: "v_seed_admin",
      userAgent: UA_DESKTOP,
    }),
    evt({
      type: "report_export",
      ts: at(0, 9, 5),
      actor: { kind: "admin", name: "Srikanth" },
      visitorId: "v_seed_admin",
      meta: { report: "Daily sales", format: "CSV" },
      userAgent: UA_DESKTOP,
    }),
    evt({
      type: "report_export",
      ts: at(0, 9, 6),
      actor: { kind: "admin", name: "Srikanth" },
      visitorId: "v_seed_admin",
      meta: { report: "Order status", format: "PDF" },
      userAgent: UA_DESKTOP,
    }),
    evt({
      type: "login",
      ts: at(0, 11, 0),
      actor: { kind: "admin", name: "Supriya" },
      visitorId: "v_seed_admin2",
      userAgent: UA_MOBILE,
    }),
  );

  // A real 4th order, placed today, still moving through fulfilment.
  const order4 = makeOrder({
    daysAgo: 0,
    hour: 10,
    address: { ...bhaveshAddr, fullName: "Bhavesh Allapati" },
    userId: bhaveshId,
    items: [{ product: p(6 % products.length), qty: 1 }],
  });
  createOrder(order4);
  orderCount += 1;
  events.push(
    evt({
      type: "order_placed",
      ts: order4.createdAt,
      actor: { kind: "customer", id: bhaveshId, name: "Bhavesh Allapati" },
      visitorId: bvVisitor,
      meta: { orderNumber: order4.orderNumber, total: order4.total },
      userAgent: UA_MOBILE,
    }),
  );
  updateOrderStatus(order4.orderNumber, "PACKING");

  // Srikanth adds a demo ops team member (exercises Team management for real).
  saveAdminAccount({ username: "opsteam", name: "Ops Team", password: "demo123" });

  /* ---------------- Bulk: 20 more customers, spread across 9 days ----------------
   * Gives the founders enough volume to see this as a real, paginated activity
   * feed (not just a handful of rows) and puts a healthy spread of orders at
   * every fulfilment stage into Orders/Packing/Reports/Dashboard. */
  const FLOW: FulfillmentStatus[] = ["PACKING", "PACKED", "SHIPPED", "DELIVERED"];
  CUSTOMER_POOL.forEach(([name, phone, city, state, pin], idx) => {
    const visitor = `v_seed_cust_${idx}`;
    const daysAgo = idx % 9;
    const hour = 9 + (idx % 11);
    const ua = [UA_MOBILE, UA_DESKTOP, UA_IOS][idx % 3];
    const addr: Address = {
      fullName: name,
      phone,
      line1: `${idx + 1}, Green Park Road`,
      city,
      state,
      postalCode: pin,
      type: "Home",
    };

    events.push(
      evt({
        type: "login",
        ts: at(daysAgo, hour, 0),
        actor: { kind: "customer", id: phone, name },
        visitorId: visitor,
        meta: { method: idx % 2 === 0 ? "otp" : "password" },
        userAgent: ua,
      }),
    );

    const viewCount = 2 + (idx % 3);
    for (let v = 0; v < viewCount; v++) {
      const prod = p((idx + v) % products.length);
      events.push(
        evt({
          type: "page_view",
          ts: at(daysAgo, hour, 2 + v * 2),
          actor: { kind: "customer", id: phone, name },
          visitorId: visitor,
          path: `/product/${prod.slug}`,
          userAgent: ua,
        }),
      );
    }

    const cartItems: { product: (typeof products)[number]; qty: number }[] = [];
    const itemCount = 1 + (idx % 2);
    for (let c = 0; c < itemCount; c++) {
      const prod = p((idx + c + 1) % products.length);
      const qty = 1 + (idx % 3);
      cartItems.push({ product: prod, qty });
      events.push(
        evt({
          type: "cart_add",
          ts: at(daysAgo, hour, 6 + c * 2),
          actor: { kind: "customer", id: phone, name },
          visitorId: visitor,
          productId: prod.id,
          productName: prod.name,
          qty,
          userAgent: ua,
        }),
      );
    }
    if (idx % 3 === 0 && cartItems.length > 1) {
      const removed = cartItems.shift()!;
      events.push(
        evt({
          type: "cart_remove",
          ts: at(daysAgo, hour, 11),
          actor: { kind: "customer", id: phone, name },
          visitorId: visitor,
          productId: removed.product.id,
          productName: removed.product.name,
          userAgent: ua,
        }),
      );
    }

    const order = makeOrder({ daysAgo, hour, address: addr, userId: phone, items: cartItems });
    createOrder(order);
    orderCount += 1;
    events.push(
      evt({
        type: "order_placed",
        ts: order.createdAt,
        actor: { kind: "customer", id: phone, name },
        visitorId: visitor,
        meta: { orderNumber: order.orderNumber, total: order.total },
        userAgent: ua,
      }),
    );

    const steps = idx % (FLOW.length + 1); // 0..4 progressions, so stages vary realistically
    for (let s = 0; s < steps; s++) {
      const status = FLOW[s];
      if (status === "SHIPPED") {
        updateOrderStatus(order.orderNumber, status, {
          courier: COURIER_OPTIONS[(idx + s) % COURIER_OPTIONS.length],
          trackingNumber: `TRK${1000000 + idx * 37 + s}`,
        });
      } else {
        updateOrderStatus(order.orderNumber, status);
      }
    }

    events.push(
      evt({
        type: "logout",
        ts: at(daysAgo, hour, 20),
        actor: { kind: "customer", id: phone, name },
        visitorId: visitor,
        userAgent: ua,
      }),
    );
  });

  /* ---------------- Bulk: extra anonymous guest browsing ---------------- */
  for (let g = 0; g < 10; g++) {
    const visitor = `v_seed_extraguest_${g}`;
    const daysAgo = g % 9;
    const hour = 8 + (g % 12);
    const ua = [UA_MOBILE, UA_DESKTOP, UA_IOS][g % 3];
    const viewCount = 3 + (g % 3);
    for (let v = 0; v < viewCount; v++) {
      const paths = ["/", "/shop", "/ingredients", "/our-story", "/learn", "/contact"];
      events.push(
        evt({
          type: "page_view",
          ts: at(daysAgo, hour, v * 3),
          actor: { kind: "guest" },
          visitorId: visitor,
          path: v % 2 === 0 ? `/product/${p((g + v) % products.length).slug}` : paths[(g + v) % paths.length],
          userAgent: ua,
        }),
      );
    }
    if (g % 2 === 0) {
      const prod = p((g + 2) % products.length);
      events.push(
        evt({
          type: "cart_add",
          ts: at(daysAgo, hour, 30),
          actor: { kind: "guest" },
          visitorId: visitor,
          productId: prod.id,
          productName: prod.name,
          qty: 1,
          userAgent: ua,
        }),
      );
    }
  }

  seedEvents(events);
  return { events: events.length, orders: orderCount };
}
