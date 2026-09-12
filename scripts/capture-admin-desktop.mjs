/**
 * Surakshitam Naturals — admin ("Studio") portal screenshots, DESKTOP.
 * Produces ./SurakshitamNaturals-Screenshots/Desktop-Admin-Portal/<NNN>-<section>-<feature>.png
 *
 * Covers: sign-in, the account menu, dashboard, orders (incl. the dispatch form in both
 * bike and courier modes, with rider name/mobile/vehicle), order detail, packing,
 * products (list, hidden filter, edit/add forms, the home-care type selector and the
 * brand-partner toggle), the Offers/Combos/Ingredients tabs, the ingredient library and
 * its family manager, ingredient edit/add forms, reports, team, activity, notifications.
 *
 * Exports `run(browser)` so it can be called standalone or from capture-all.mjs.
 *
 * HOW TO RUN standalone (from surakshitam-web/, with `SCREENSHOTS=1 npm run dev` running):
 *   npm i -D playwright   (sharp is already a devDependency)
 *   npx playwright install chromium
 *   node scripts/capture-admin-desktop.mjs
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import { mkdir, settle, goto, clickText, makeShotter, seedSampleActivity, assertServerUp, log } from "./screenshot-utils.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots/Desktop-Admin-Portal";
const VIEWPORT = { width: 1440, height: 960 };

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
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
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

  // Seed BEFORE any data screens are captured, and actually wait for it to land —
  // this is what makes Packing/Orders/Dashboard show real pending orders, not empty states.
  log("seeding sample activity (orders + audit log)…");
  await seedSampleActivity(page, BASE);

  log("header");
  await goto(page, BASE, "/studio");
  await page.click('button[aria-label^="Admin account"]').catch(() => {});
  await page.waitForTimeout(300);
  await shot(page, "header-account-menu");
  await page.keyboard.press("Escape").catch(() => {});

  log("dashboard");
  await goto(page, BASE, "/studio");
  await shot(page, "dashboard-overview");

  log("orders");
  await goto(page, BASE, "/studio/orders");
  await shot(page, "orders-list");
  // Choosing "Dispatched" opens the dispatch form. Bike is the default mode, so
  // the first shot shows the rider fields; the second shows the courier branch.
  const shipSelect = await page.$("select");
  if (shipSelect) {
    await shipSelect.selectOption("SHIPPED").catch(() => {});
    await page.waitForTimeout(400);
    await shot(page, "orders-dispatch-bike-rider");
    await clickText(page, "button", /courier parcel/i);
    await page.waitForTimeout(300);
    await shot(page, "orders-dispatch-courier");
  }

  log("order detail");
  await goto(page, BASE, "/studio/orders");
  const firstOrderLink = await page.$('a[href^="/studio/orders/SURK-"]');
  const orderNumber = firstOrderLink
    ? (await firstOrderLink.getAttribute("href")).split("/").pop()
    : null;
  if (orderNumber) {
    await goto(page, BASE, `/studio/orders/${orderNumber}`);
    await shot(page, "order-detail-view");
  }

  log("packing");
  await goto(page, BASE, "/studio/packing");
  await shot(page, "packing-list");

  log("products");
  await goto(page, BASE, "/studio/products");
  await shot(page, "products-list");
  await clickText(page, "button", /^hidden/i);
  await page.waitForTimeout(300);
  await shot(page, "products-hidden-filter");

  log("product forms");
  await goto(page, BASE, "/studio/products/p-shea-butter-soap");
  await shot(page, "product-edit-form");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await shot(page, "product-audit-history");
  await goto(page, BASE, "/studio/products/new");
  await shot(page, "product-add-form");
  // A home-care product shows the bio-enzyme / general selector...
  await goto(page, BASE, "/studio/products/p-dishwash-liquid");
  await shot(page, "product-edit-home-care-type");
  // ...and a resold product shows the brand-partner toggle and brand name.
  await goto(page, BASE, "/studio/products/p-wheat-noodles");
  await shot(page, "product-edit-partner-brand");

  log("products — offers tab");
  await goto(page, BASE, "/studio/products");
  await clickText(page, "button", /^offers$/i);
  await page.waitForTimeout(300);
  await shot(page, "products-offers-tab");

  log("products — combos tab");
  await clickText(page, "button", /^combos$/i);
  await page.waitForTimeout(300);
  await shot(page, "products-combos-tab");

  log("products — ingredients tab");
  await goto(page, BASE, "/studio/products?tab=ingredients");
  await shot(page, "ingredients-library");
  await clickText(page, "button", /manage families/i);
  await page.waitForTimeout(400);
  await shot(page, "ingredients-families-manager");

  log("ingredient forms");
  await goto(page, BASE, "/studio/ingredients/neem");
  await shot(page, "ingredient-edit-form");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await shot(page, "ingredient-found-in-picker");
  await goto(page, BASE, "/studio/ingredients/new");
  await shot(page, "ingredient-add-form");

  log("reports");
  await goto(page, BASE, "/studio/reports");
  await shot(page, "reports-tables");

  log("team");
  await goto(page, BASE, "/studio/team");
  await shot(page, "team-list");
  await clickText(page, "button", /add admin/i);
  await page.waitForTimeout(300);
  await shot(page, "team-add-form");

  log("activity");
  await goto(page, BASE, "/studio/activity");
  await shot(page, "activity-overview");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await shot(page, "activity-table");

  log("notifications");
  await goto(page, BASE, "/studio/dev/notifications");
  await shot(page, "notifications-active");
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
