/**
 * Surakshitam Naturals — admin ("Studio") portal screenshots, MOBILE.
 * Produces ./SurakshitamNaturals-Screenshots/Mobile-Admin-Portal/<NNN>-<section>-<feature>.png
 *
 * Same flow as capture-admin-desktop.mjs, at a "regular" Android/iPhone-sized viewport
 * (360×780 — matches common Android widths and iPhone mini/SE, not an oversized modern
 * iPhone). List/detail screens get 2 shots (top + scrolled) since mobile shows much less
 * per screen than desktop and a single shot misses content below the fold.
 * Exports `run(browser)` so it can be called standalone or from capture-all.mjs.
 *
 * HOW TO RUN standalone (from surakshitam-web/, with `SCREENSHOTS=1 npm run dev` running):
 *   npm i -D playwright   (sharp is already a devDependency)
 *   npx playwright install chromium
 *   node scripts/capture-admin-mobile.mjs
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import {
  mkdir,
  settle,
  goto,
  clickText,
  makeShotter,
  seedSampleActivity,
  assertServerUp,
  twoShotMobile,
  log,
} from "./screenshot-utils.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots/Mobile-Admin-Portal";
const VIEWPORT = { width: 360, height: 780 }; // "regular" phone size — common Android width, iPhone mini/SE range

const NOTIFS = [
  { id: "ntf_1", channel: "whatsapp", audience: "customer", recipient: "Customer · Bhavesh Allapati", to: "9849116181", template: "customer_order_placed", status: "sent", createdAt: "2026-08-16T11:13:09.375Z", archived: false, message: "Hi Bhavesh Allapati, thank you for ordering from Surakshitam Naturals 🌿\n\nOrder: SURK-2026-482913\nAmount: ₹647\n\nWe'll notify you once your order is ready for dispatch.\nTrack: https://surakshitamnaturals.example/track-order" },
  { id: "ntf_2", channel: "whatsapp", audience: "admin", recipient: "Admin · Founders", to: "+91 74163 94594", template: "admin_new_order", status: "sent", createdAt: "2026-08-16T11:13:09.375Z", archived: false, message: "🌿 New Surakshitam Naturals order\n\nOrder: SURK-2026-482913\nCustomer: Bhavesh Allapati\nPhone: 9849116181\nItems: Shea Butter Soap × 1, Hair Oil × 2\nTotal: ₹647\nPayment: PAID" },
  { id: "ntf_3", channel: "whatsapp", audience: "customer", recipient: "Customer · Bhavesh Allapati", to: "9849116181", template: "customer_status_packed", status: "sent", createdAt: "2026-08-16T09:00:00.000Z", archived: true, message: "Hi Bhavesh Allapati, an update on your order 🌿\n\nOrder: SURK-2026-482913\nYour order is packed and ready for dispatch." },
];
const ADMIN = { username: "srikanthnaturals", name: "Srikanth" };
// Post-Phase-5 round 5/6 features: seeded so Products → Offers/Combos tabs show populated
// tables instead of the "no offers/combos yet" empty state.
const OFFERS = [{ id: "off_demo1", code: "WELCOME10", description: "10% off your first order", type: "percent", value: 10, startDate: "2026-08-01", endDate: "2026-12-31", enabled: true }];
const BUNDLES = [{ id: "bundle_demo1", slug: "daily-essentials-kit", name: "Daily Essentials Kit", description: "Our shea butter soap, hair oil and dishwash liquid, together at a special price.", image: "", productIds: ["p-shea-butter-soap", "p-hair-oil", "p-dishwash-liquid"], price: 55000, enabled: true }];

function seedScript() {
  // addInitScript re-runs on EVERY navigation in this context, not just the first load —
  // so clearing sn-orders-v1/sn-audit-v1 unconditionally here would wipe out the sample
  // data right after "Load sample activity" seeds it, the moment the next page loads.
  // Guard with a one-time flag so the reset only happens on the very first page load.
  return `try{
    if (!localStorage.getItem('__sn_screenshot_init__')) {
      localStorage.setItem('sn-notifications-v1', ${JSON.stringify(JSON.stringify(NOTIFS))});
      localStorage.setItem('sn-visitor-v1', 'v_demo12ab');
      localStorage.setItem('sn-admin-v1', ${JSON.stringify(JSON.stringify(ADMIN))});
      localStorage.setItem('sn-offers-v1', ${JSON.stringify(JSON.stringify(OFFERS))});
      localStorage.setItem('sn-bundles-v1', ${JSON.stringify(JSON.stringify(BUNDLES))});
      localStorage.removeItem('sn-auth-v1');
      localStorage.removeItem('sn-orders-v1');
      localStorage.removeItem('sn-audit-v1');
      localStorage.setItem('__sn_screenshot_init__', '1');
    }
  }catch(e){}`;
}

export async function run(browser) {
  await assertServerUp(browser, BASE);
  mkdir(ROOT);
  const shot = makeShotter(ROOT);
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await ctx.addInitScript(seedScript());
  const page = await ctx.newPage();
  page.on("dialog", (d) => d.accept());

  log("signin");
  await goto(page, BASE, "/studio");
  await shot(page, "signin-login");

  await goto(page, BASE, "/studio");
  await page.fill('input[placeholder="Username"]', "srikanthnaturals").catch(() => {});
  await page.fill('input[placeholder="Password"]', "demo123").catch(() => {});
  await clickText(page, "button", /^sign in$/i);
  await settle(page);

  log("seeding sample activity (orders + audit log)…");
  await seedSampleActivity(page, BASE);

  log("mobile menu — hamburger drawer");
  await goto(page, BASE, "/studio");
  await page.click('button[aria-label*="menu" i]').catch(() => {});
  await page.waitForTimeout(300);
  await shot(page, "header-mobile-drawer");
  await page.keyboard.press("Escape").catch(() => {});

  log("header — account menu");
  await goto(page, BASE, "/studio");
  await page.click('button[aria-label^="Admin account"]').catch(() => {});
  await page.waitForTimeout(300);
  await shot(page, "header-account-menu");
  await page.keyboard.press("Escape").catch(() => {});

  log("dashboard");
  await twoShotMobile(page, BASE, "/studio", shot, "dashboard-overview", 5000);

  log("orders");
  await twoShotMobile(page, BASE, "/studio/orders", shot, "orders-list", 5000);
  const shipSelect = await page.$("select");
  if (shipSelect) {
    await shipSelect.selectOption("SHIPPED").catch(() => {});
    await page.waitForTimeout(300);
    await shot(page, "orders-courier-form");
  }

  log("order detail");
  await goto(page, BASE, "/studio/orders");
  const firstOrderLink = await page.$('a[href^="/studio/orders/SURK-"]');
  const orderNumber = firstOrderLink
    ? (await firstOrderLink.getAttribute("href")).split("/").pop()
    : null;
  if (orderNumber) {
    await twoShotMobile(page, BASE, `/studio/orders/${orderNumber}`, shot, "order-detail-view", 5000);
  }

  log("packing");
  await twoShotMobile(page, BASE, "/studio/packing", shot, "packing-list", 5000);

  log("products");
  await twoShotMobile(page, BASE, "/studio/products", shot, "products-list", 5000);
  await clickText(page, "button", /^hidden/i);
  await page.waitForTimeout(300);
  await shot(page, "products-hidden-filter");

  log("product forms");
  await twoShotMobile(page, BASE, "/studio/products/p-shea-butter-soap", shot, "product-edit-form", 5000);
  await twoShotMobile(page, BASE, "/studio/products/new", shot, "product-add-form", 5000);

  log("products — offers tab");
  await goto(page, BASE, "/studio/products");
  await clickText(page, "button", /^offers$/i);
  await page.waitForTimeout(300);
  await shot(page, "products-offers-tab");

  log("products — combos tab");
  await clickText(page, "button", /^combos$/i);
  await page.waitForTimeout(300);
  await shot(page, "products-combos-tab");

  log("reports");
  await twoShotMobile(page, BASE, "/studio/reports", shot, "reports-tables", 5000);

  log("team");
  await twoShotMobile(page, BASE, "/studio/team", shot, "team-list", 5000);
  await clickText(page, "button", /add admin/i);
  await page.waitForTimeout(300);
  await shot(page, "team-add-form");

  log("activity");
  await twoShotMobile(page, BASE, "/studio/activity", shot, "activity-overview", 5000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await shot(page, "activity-table");

  log("notifications");
  await twoShotMobile(page, BASE, "/studio/dev/notifications", shot, "notifications-active", 5000);
  await clickText(page, "button", /^archive/i);
  await page.waitForTimeout(300);
  await shot(page, "notifications-archive");

  await ctx.close();
  log("DONE → " + ROOT);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  (async () => {
    const browser = await chromium.launch();
    await run(browser);
    await browser.close();
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
