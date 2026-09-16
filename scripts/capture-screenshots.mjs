/**
 * Surakshitam Naturals — full screenshot capture for the founder review.
 *
 * Produces a clearly-named, folder-organised set under ./SurakshitamNaturals-Screenshots.
 *
 * HOW TO RUN (from surakshitam-web/):
 *   1) Terminal A:   SCREENSHOTS=1 npm run dev        # images served unoptimised → render instantly
 *   2) Terminal B:   npm i -D playwright && npx playwright install chromium
 *                    node scripts/capture-screenshots.mjs
 *
 * Everything is seeded (logged-in customer, admin, cart, an order, notifications,
 * activity) so account/cart/admin screens show real content.
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots";
const VIEWPORT = { width: 1440, height: 960 };

/* ------------------------------- seed data ------------------------------- */
const CART = [{ id: "p-shea-butter-soap", qty: 1 }, { id: "p-hair-oil", qty: 2 }, { id: "p-dishwash-liquid", qty: 1 }];
const PROFILE = { name: "Demo Customer", mobile: "+91 98491 16181", email: "demo.customer@example.com", address: "Nagole, Hyderabad, Telangana – 500068" };
const AUTH = { id: "9000000001", mobile: "+91 98491 16181", name: "Demo Customer", email: "demo.customer@example.com", method: "otp", loggedInAt: "2026-08-16T11:00:00.000Z" };
const ADMIN = { username: "srikanthnaturals", name: "Srikanth" };
const ADDR = { fullName: "Demo Customer", phone: "9000000001", altPhone: "", line1: "Nagole", line2: "", landmark: "", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" };
const ORDER = [{ orderNumber: "SURK-2026-482913", createdAt: "2026-08-16T11:13:09.373Z", userId: "9000000001", items: [{ productId: "p-shea-butter-soap", slug: "shea-butter-soap", nameSnapshot: "Shea Butter Soap", skuSnapshot: "SN-SC-SHS-100", priceSnapshot: 14900, qty: 1, image: "/products/shea-butter-soap.webp", size: "100 g" }, { productId: "p-hair-oil", slug: "hair-oil", nameSnapshot: "Hair Oil", skuSnapshot: "SN-HR-OIL-100", priceSnapshot: 24900, qty: 2, image: "/products/hair-oil.webp", size: "100 ml" }], subtotal: 64700, shipping: 0, total: 64700, address: { fullName: "Demo Customer", phone: "9000000001", line1: "Nagole", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" }, paymentStatus: "PAID", paymentId: "pay_demo_a1b2c3d4e5", fulfillmentStatus: "PACKED" }];
const NOTIFS = [
  { id: "ntf_1", channel: "whatsapp", audience: "customer", recipient: "Customer · Demo Customer", to: "9000000001", template: "customer_order_placed", status: "sent", createdAt: "2026-08-16T11:13:09.375Z", archived: false, message: "Hi Demo Customer, thank you for ordering from Surakshitam Naturals 🌿\n\nOrder: SURK-2026-482913\nAmount: ₹647\n\nWe'll notify you once your order is ready for dispatch.\nTrack: https://surakshitamnaturals.example/track-order" },
  { id: "ntf_2", channel: "whatsapp", audience: "admin", recipient: "Admin · Founders", to: "+91 74163 94594", template: "admin_new_order", status: "sent", createdAt: "2026-08-16T11:13:09.375Z", archived: false, message: "🌿 New Surakshitam Naturals order\n\nOrder: SURK-2026-482913\nCustomer: Demo Customer\nPhone: 9000000001\nItems: Shea Butter Soap × 1, Hair Oil × 2\nTotal: ₹647\nPayment: PAID" },
  { id: "ntf_3", channel: "whatsapp", audience: "customer", recipient: "Customer · Demo Customer", to: "9000000001", template: "customer_status_packed", status: "sent", createdAt: "2026-08-16T09:00:00.000Z", archived: true, message: "Hi Demo Customer, an update on your order 🌿\n\nOrder: SURK-2026-482913\nYour order is packed and ready for dispatch." },
];
const AUDIT = [
  { id: "ev_1", ts: "2026-08-16T10:55:00.000Z", type: "page_view", actor: { kind: "guest" }, visitorId: "v_guest99", path: "/product/hair-oil", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile Safari" },
  { id: "ev_2", ts: "2026-08-16T10:56:00.000Z", type: "cart_add", actor: { kind: "guest" }, visitorId: "v_guest99", productId: "p-hair-oil", productName: "Hair Oil", qty: 1, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile Safari" },
  { id: "ev_3", ts: "2026-08-16T10:58:00.000Z", type: "page_view", actor: { kind: "customer", id: "9000000001", name: "Demo Customer" }, visitorId: "v_demo12ab", path: "/shop", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/120 Safari" },
];

function seedScript({ customer = false, admin = false } = {}) {
  return `try{
    localStorage.setItem('sn-cart-v1', ${JSON.stringify(JSON.stringify(CART))});
    localStorage.setItem('sn-profile-v1', ${JSON.stringify(JSON.stringify(PROFILE))});
    localStorage.setItem('sn-address-v1', ${JSON.stringify(JSON.stringify(ADDR))});
    localStorage.setItem('sn-orders-v1', ${JSON.stringify(JSON.stringify(ORDER))});
    localStorage.setItem('sn-notifications-v1', ${JSON.stringify(JSON.stringify(NOTIFS))});
    localStorage.setItem('sn-audit-v1', ${JSON.stringify(JSON.stringify(AUDIT))});
    localStorage.setItem('sn-visitor-v1', 'v_demo12ab');
    ${customer ? `localStorage.setItem('sn-auth-v1', ${JSON.stringify(JSON.stringify(AUTH))});` : `localStorage.removeItem('sn-auth-v1');`}
    ${admin ? `localStorage.setItem('sn-admin-v1', ${JSON.stringify(JSON.stringify(ADMIN))});` : `localStorage.removeItem('sn-admin-v1');`}
  }catch(e){}`;
}

/* ------------------------------- helpers ------------------------------- */
const mkdir = (d) => fs.mkdirSync(`${ROOT}/${d}`, { recursive: true });

async function newCtx(browser, opts) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await ctx.addInitScript(seedScript(opts));
  return ctx;
}
async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 45000 }).catch(() => {});
  await page.evaluate(() => Promise.all(Array.from(document.images).filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; })))).catch(() => {});
  await page.waitForTimeout(600);
}
async function shot(page, folder, name) {
  await page.screenshot({ path: `${ROOT}/${folder}/${name}.png` });
  console.log("  ✓", folder, name);
}
async function gallery(page, url, folder, prefix, count) {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await settle(page);
  const h = await page.evaluate(() => document.body.scrollHeight);
  const vh = VIEWPORT.height;
  const span = Math.max(0, h - vh);
  const step = count > 1 ? Math.floor(span / (count - 1)) : 0;
  for (let i = 0; i < count; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * step);
    await page.waitForTimeout(450);
    await shot(page, folder, `${prefix}-${String(i + 1).padStart(2, "0")}`);
  }
}
async function single(page, url, folder, name) {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await settle(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, folder, name);
}
async function clickText(page, re) {
  for (const b of await page.$$("button")) {
    if (re.test((await b.innerText()).trim())) { await b.click().catch(() => {}); return true; }
  }
  return false;
}

/* --------------------------------- run --------------------------------- */
const run = async () => {
  fs.rmSync(ROOT, { recursive: true, force: true });
  ["01-Home", "02-Shop", "03-Home-Care", "04-Skin-Care", "05-Hair-Care", "06-Our-Story",
    "07-Ingredients", "08-Learn", "09-Account", "10-Cart-Checkout-Payment", "11-Admin"].forEach(mkdir);

  const browser = await chromium.launch();
  const customer = await newCtx(browser, { customer: true, admin: false });
  const guest = await newCtx(browser, { customer: false, admin: false });
  const admin = await newCtx(browser, { customer: true, admin: true });
  const cp = await customer.newPage();

  console.log("01 Home"); await gallery(cp, "/", "01-Home", "home", 10);
  console.log("02 Shop");
  await gallery(cp, "/shop", "02-Shop", "shop", 2);
  await single(cp, "/product/shea-butter-soap", "02-Shop", "product-detail");
  console.log("03 Home Care");
  await gallery(cp, "/shop?category=home-care", "03-Home-Care", "home-care", 2);
  await single(cp, "/product/natural-dishwash-liquid", "03-Home-Care", "product-detail");
  console.log("04/05 Skin & Hair");
  await single(cp, "/shop?category=skin-care", "04-Skin-Care", "skin-care");
  await single(cp, "/shop?category=hair-care", "05-Hair-Care", "hair-care");
  console.log("06 Our Story"); await gallery(cp, "/our-story", "06-Our-Story", "our-story", 5);
  console.log("07 Ingredients"); await gallery(cp, "/ingredients", "07-Ingredients", "ingredients", 8);
  console.log("08 Learn");
  await gallery(cp, "/learn", "08-Learn", "learn-index", 3);
  await gallery(cp, "/learn/from-idea-to-a-finished-bar-of-soap", "08-Learn", "learn-article", 2);

  console.log("09 Account");
  const gp = await guest.newPage();
  await single(gp, "/login?next=/account", "09-Account", "01-login-otp");
  await gp.goto(BASE + "/login?next=/account", { waitUntil: "domcontentloaded" }); await settle(gp);
  await clickText(gp, /password/i); await gp.waitForTimeout(400);
  await shot(gp, "09-Account", "02-login-password");
  await single(cp, "/account", "09-Account", "03-account-overview");
  await cp.evaluate(() => window.scrollTo(0, 400)); await cp.waitForTimeout(400);
  await shot(cp, "09-Account", "04-account-orders");
  await cp.goto(BASE + "/account", { waitUntil: "domcontentloaded" }); await settle(cp);
  await clickText(cp, /^edit$/i); await cp.waitForTimeout(400);
  await shot(cp, "09-Account", "05-account-edit");

  console.log("10 Cart / Checkout / Payment");
  await single(cp, "/cart", "10-Cart-Checkout-Payment", "01-cart");
  await cp.goto(BASE + "/checkout", { waitUntil: "domcontentloaded" }); await settle(cp);
  await shot(cp, "10-Cart-Checkout-Payment", "02-checkout-contact");
  await cp.evaluate(() => document.querySelectorAll("input").forEach((i) => { if (!i.value) { if (i.type === "email") i.value = "democustomer@example.com"; else if (i.type === "tel") i.value = "9000000001"; } }));
  await clickText(cp, /continue/i); await cp.waitForTimeout(500);
  await shot(cp, "10-Cart-Checkout-Payment", "03-checkout-address");
  await clickText(cp, /continue to review/i); await cp.waitForTimeout(500);
  await shot(cp, "10-Cart-Checkout-Payment", "04-checkout-review");
  await clickText(cp, /continue to payment/i); await cp.waitForTimeout(500);
  await clickText(cp, /pay .*secur|pay ₹/i); await cp.waitForTimeout(900);
  await shot(cp, "10-Cart-Checkout-Payment", "05-razorpay-demo-modal");
  await single(cp, "/order/SURK-2026-482913", "10-Cart-Checkout-Payment", "06-order-success");

  console.log("11 Admin");
  await single(gp, "/studio", "11-Admin", "01-founder-login");
  await single(cp, "/studio", "11-Admin", "02-no-access-customer");
  const ap = await admin.newPage();
  await single(ap, "/studio", "11-Admin", "03-dashboard");
  await single(ap, "/studio/orders", "11-Admin", "04-orders");
  await single(ap, "/studio/products", "11-Admin", "05-products-inventory");
  await single(ap, "/studio/products/p-shea-butter-soap", "11-Admin", "06-product-edit");
  await single(ap, "/studio/products/new", "11-Admin", "07-product-add");
  await single(ap, "/studio/activity", "11-Admin", "08-activity-analytics");
  await single(ap, "/studio/dev/notifications", "11-Admin", "09-whatsapp-notifications-active");
  await ap.goto(BASE + "/studio/dev/notifications", { waitUntil: "domcontentloaded" }); await settle(ap);
  await clickText(ap, /archive/i); await ap.waitForTimeout(400);
  await shot(ap, "11-Admin", "10-whatsapp-notifications-archive");

  await browser.close();
  console.log("\nDONE → " + ROOT);
};
run().catch((e) => { console.error(e); process.exit(1); });
