/**
 * Surakshitam Naturals — admin ("Studio") portal screenshots, MOBILE.
 * Produces ./SurakshitamNaturals-Screenshots/Mobile-Admin-Portal/<NNN>-<section>-<feature>.png
 *
 * Same flow as capture-admin-desktop.mjs, at an iPhone-sized viewport, with the mobile
 * hamburger drawer captured instead of the desktop header account-menu.
 *
 * HOW TO RUN (from surakshitam-web/, with `SCREENSHOTS=1 npm run dev` already running):
 *   npm i -D playwright   (sharp is already a devDependency)
 *   npx playwright install chromium
 *   node scripts/capture-admin-mobile.mjs
 */
import { chromium } from "playwright";
import { mkdir, settle, goto, clickText, makeShotter } from "./screenshot-utils.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots/Mobile-Admin-Portal";
const VIEWPORT = { width: 390, height: 844 }; // iPhone 14-ish

const NOTIFS = [
  { id: "ntf_1", channel: "whatsapp", audience: "customer", recipient: "Customer · Bhavesh Allapati", to: "9849116181", template: "customer_order_placed", status: "sent", createdAt: "2026-08-16T11:13:09.375Z", archived: false, message: "Hi Bhavesh Allapati, thank you for ordering from Surakshitam Naturals 🌿\n\nOrder: SURK-2026-482913\nAmount: ₹647\n\nWe'll notify you once your order is ready for dispatch.\nTrack: https://surakshitamnaturals.example/track-order" },
  { id: "ntf_2", channel: "whatsapp", audience: "admin", recipient: "Admin · Founders", to: "+91 74163 94594", template: "admin_new_order", status: "sent", createdAt: "2026-08-16T11:13:09.375Z", archived: false, message: "🌿 New Surakshitam Naturals order\n\nOrder: SURK-2026-482913\nCustomer: Bhavesh Allapati\nPhone: 9849116181\nItems: Shea Butter Soap × 1, Hair Oil × 2\nTotal: ₹647\nPayment: PAID" },
  { id: "ntf_3", channel: "whatsapp", audience: "customer", recipient: "Customer · Bhavesh Allapati", to: "9849116181", template: "customer_status_packed", status: "sent", createdAt: "2026-08-16T09:00:00.000Z", archived: true, message: "Hi Bhavesh Allapati, an update on your order 🌿\n\nOrder: SURK-2026-482913\nYour order is packed and ready for dispatch." },
];
const ORDER = [{ orderNumber: "SURK-2026-482913", createdAt: "2026-08-16T11:13:09.373Z", userId: "9849116181", items: [{ productId: "p-shea-butter-soap", slug: "shea-butter-soap", nameSnapshot: "Shea Butter Soap", skuSnapshot: "SN-SC-SHS-100", priceSnapshot: 14900, qty: 1, image: "/products/shea-butter-soap.webp", size: "100 g" }, { productId: "p-hair-oil", slug: "hair-oil", nameSnapshot: "Hair Oil", skuSnapshot: "SN-HR-OIL-100", priceSnapshot: 24900, qty: 2, image: "/products/hair-oil.webp", size: "100 ml" }], subtotal: 64700, shipping: 0, total: 64700, address: { fullName: "Bhavesh Allapati", phone: "9849116181", line1: "Nagole", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" }, paymentStatus: "PAID", paymentId: "pay_demo_a1b2c3d4e5", fulfillmentStatus: "PACKED" }];
const ADMIN = { username: "srikanthnaturals", name: "Srikanth" };

function seedScript() {
  return `try{
    localStorage.setItem('sn-orders-v1', ${JSON.stringify(JSON.stringify(ORDER))});
    localStorage.setItem('sn-notifications-v1', ${JSON.stringify(JSON.stringify(NOTIFS))});
    localStorage.setItem('sn-visitor-v1', 'v_demo12ab');
    localStorage.setItem('sn-admin-v1', ${JSON.stringify(JSON.stringify(ADMIN))});
    localStorage.removeItem('sn-auth-v1');
  }catch(e){}`;
}

const run = async () => {
  mkdir(ROOT);
  const shot = makeShotter(ROOT);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(seedScript());
  const page = await ctx.newPage();
  page.on("dialog", (d) => d.accept());

  console.log("signin");
  await goto(page, BASE, "/studio");
  await shot(page, "signin-login");

  await goto(page, BASE, "/studio");
  await page.fill('input[placeholder="Username"]', "srikanthnaturals").catch(() => {});
  await page.fill('input[placeholder="Password"]', "demo123").catch(() => {});
  await clickText(page, "button", /^sign in$/i);
  await settle(page);

  console.log("seeding sample activity…");
  await goto(page, BASE, "/studio/activity");
  await clickText(page, "button", /load sample activity/i);
  await page.waitForTimeout(1500);
  await settle(page);

  console.log("mobile menu — hamburger drawer");
  await goto(page, BASE, "/studio");
  await page.click('button[aria-label*="menu" i]').catch(() => {});
  await page.waitForTimeout(300);
  await shot(page, "header-mobile-drawer");
  await page.keyboard.press("Escape").catch(() => {});

  console.log("header — account menu");
  await goto(page, BASE, "/studio");
  await page.click('button[aria-label^="Admin account"]').catch(() => {});
  await page.waitForTimeout(300);
  await shot(page, "header-account-menu");
  await page.keyboard.press("Escape").catch(() => {});

  console.log("dashboard");
  await goto(page, BASE, "/studio");
  await shot(page, "dashboard-overview");

  console.log("orders");
  await goto(page, BASE, "/studio/orders");
  await shot(page, "orders-list");
  const shipSelect = await page.$("select");
  if (shipSelect) {
    await shipSelect.selectOption("SHIPPED").catch(() => {});
    await page.waitForTimeout(300);
    await shot(page, "orders-courier-form");
  }

  console.log("order detail");
  await goto(page, BASE, "/studio/orders/SURK-2026-482913");
  await shot(page, "order-detail-view");

  console.log("packing");
  await goto(page, BASE, "/studio/packing");
  await shot(page, "packing-list");

  console.log("products");
  await goto(page, BASE, "/studio/products");
  await shot(page, "products-list");
  await clickText(page, "button", /^hidden/i);
  await page.waitForTimeout(300);
  await shot(page, "products-hidden-filter");

  console.log("product forms");
  await goto(page, BASE, "/studio/products/p-shea-butter-soap");
  await shot(page, "product-edit-form");
  await goto(page, BASE, "/studio/products/new");
  await shot(page, "product-add-form");

  console.log("reports");
  await goto(page, BASE, "/studio/reports");
  await shot(page, "reports-tables");

  console.log("team");
  await goto(page, BASE, "/studio/team");
  await shot(page, "team-list");
  await clickText(page, "button", /add admin/i);
  await page.waitForTimeout(300);
  await shot(page, "team-add-form");

  console.log("activity");
  await goto(page, BASE, "/studio/activity");
  await shot(page, "activity-overview");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await shot(page, "activity-table");

  console.log("notifications");
  await goto(page, BASE, "/studio/dev/notifications");
  await shot(page, "notifications-active");
  await clickText(page, "button", /^archive/i);
  await page.waitForTimeout(300);
  await shot(page, "notifications-archive");

  await browser.close();
  console.log("\nDONE → " + ROOT);
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
