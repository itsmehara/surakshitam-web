/**
 * Surakshitam Naturals — storefront (shopping + cart + checkout) screenshots, MOBILE.
 * Produces ./SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart/<NNN>-<section>-<feature>.png
 *
 * Same feature list as capture-storefront-desktop.mjs (see that file's header comment, now incl.
 * offers/combos/wishlist/FAQs/shop-by-concern/floating-offers-modal), at
 * a "regular" phone viewport (360×780 — matches common Android widths and iPhone
 * mini/SE, not an oversized modern iPhone). Home/Our-Story/Ingredients/Learn already get
 * multiple scrolled shots via gallery(); every other single-shot screen gets 2 shots (top +
 * scrolled) via twoShotMobile() since a phone screen shows much less at once than desktop.
 *
 * Exports `run(browser)` so it can be called standalone or from capture-all.mjs.
 *
 * HOW TO RUN standalone (from surakshitam-web/, with `SCREENSHOTS=1 npm run dev` running):
 *   npm i -D playwright   (sharp is already a devDependency)
 *   npx playwright install chromium
 *   node scripts/capture-storefront-mobile.mjs
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import {
  mkdir,
  gotoAndWait,
  clickText,
  makeShotter,
  gallery,
  assertServerUp,
  twoShotMobile,
  log,
} from "./screenshot-utils.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart";
const VIEWPORT = { width: 360, height: 780 }; // "regular" phone size — common Android width, iPhone mini/SE range
const PAGE_WAIT = 15000;

const CART = [{ id: "p-shea-butter-soap", qty: 1 }, { id: "p-hair-oil", qty: 2 }, { id: "p-dishwash-liquid", qty: 1 }];
const PROFILE = { name: "Bhavesh Allapati", mobile: "+91 98491 16181", email: "srikanth.alapati@yahoo.com", address: "Nagole, Hyderabad, Telangana – 500068" };
const AUTH = { id: "9849116181", mobile: "+91 98491 16181", name: "Bhavesh Allapati", email: "srikanth.alapati@yahoo.com", method: "otp", loggedInAt: "2026-08-16T11:00:00.000Z" };
const ADDR = { fullName: "Bhavesh Allapati", phone: "9849116181", altPhone: "", line1: "Nagole", line2: "", landmark: "", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" };
const ORDER = [{ orderNumber: "SURK-2026-482913", createdAt: "2026-08-16T11:13:09.373Z", userId: "9849116181", items: [{ productId: "p-shea-butter-soap", slug: "shea-butter-soap", nameSnapshot: "Shea Butter Soap", skuSnapshot: "SN-SC-SHS-100", priceSnapshot: 14900, qty: 1, image: "/products/shea-butter-soap.webp", size: "100 g" }, { productId: "p-hair-oil", slug: "hair-oil", nameSnapshot: "Hair Oil", skuSnapshot: "SN-HR-OIL-100", priceSnapshot: 24900, qty: 2, image: "/products/hair-oil.webp", size: "100 ml" }], subtotal: 64700, shipping: 0, total: 64700, address: { fullName: "Bhavesh Allapati", phone: "9849116181", line1: "Nagole", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" }, paymentStatus: "PAID", paymentId: "pay_demo_a1b2c3d4e5", fulfillmentStatus: "PACKED", courier: "Delhivery", trackingNumber: "DL4821093765" }];
// Post-Phase-5 round 5/6 features: offers, combos, wishlist — seeded so /offers, the homepage
// promo carousel/banner/floating button, and /wishlist all show real content instead of empty states.
const OFFERS = [{ id: "off_demo1", code: "WELCOME10", description: "10% off your first order", type: "percent", value: 10, startDate: "2026-08-01", endDate: "2026-12-31", enabled: true }];
const BUNDLES = [{ id: "bundle_demo1", slug: "daily-essentials-kit", name: "Daily Essentials Kit", description: "Our shea butter soap, hair oil and dishwash liquid, together at a special price.", image: "", productIds: ["p-shea-butter-soap", "p-hair-oil", "p-dishwash-liquid"], price: 55000, enabled: true }];
const WISHLIST = ["p-rose-face-wash", "p-hair-serum"];

function seedScript({ customer = false } = {}) {
  return `try{
    localStorage.setItem('sn-cart-v1', ${JSON.stringify(JSON.stringify(CART))});
    localStorage.setItem('sn-profile-v1', ${JSON.stringify(JSON.stringify(PROFILE))});
    localStorage.setItem('sn-address-v1', ${JSON.stringify(JSON.stringify(ADDR))});
    localStorage.setItem('sn-orders-v1', ${JSON.stringify(JSON.stringify(ORDER))});
    localStorage.setItem('sn-offers-v1', ${JSON.stringify(JSON.stringify(OFFERS))});
    localStorage.setItem('sn-bundles-v1', ${JSON.stringify(JSON.stringify(BUNDLES))});
    localStorage.setItem('sn-wishlist-v1', ${JSON.stringify(JSON.stringify(WISHLIST))});
    localStorage.setItem('sn-visitor-v1', 'v_demo12ab');
    ${customer ? `localStorage.setItem('sn-auth-v1', ${JSON.stringify(JSON.stringify(AUTH))});` : `localStorage.removeItem('sn-auth-v1');`}
  }catch(e){}`;
}

export async function run(browser) {
  await assertServerUp(browser, BASE);
  mkdir(ROOT);
  const shot = makeShotter(ROOT);

  const custCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await custCtx.addInitScript(seedScript({ customer: true }));
  const cp = await custCtx.newPage();

  const guestCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await guestCtx.addInitScript(seedScript({ customer: false }));
  const gp = await guestCtx.newPage();

  log("home (12 shots, scrolled)");
  await gallery(cp, BASE, "/", shot, "home", 12, { waitAfterLoad: PAGE_WAIT });
  await cp.click('button[aria-label*="menu" i]').catch(() => {});
  await cp.waitForTimeout(300);
  await shot(cp, "home-mobile-menu");
  await cp.keyboard.press("Escape").catch(() => {});

  log("shop");
  await twoShotMobile(cp, BASE, "/shop", shot, "shop-catalogue-grid", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/shop?category=home-care", shot, "shop-category-filter", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/product/shea-butter-soap", shot, "shop-product-detail", PAGE_WAIT);

  log("skin & hair care");
  await twoShotMobile(cp, BASE, "/shop?category=skin-care", shot, "skincare-category", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/shop?category=hair-care", shot, "haircare-category", PAGE_WAIT);

  log("offers & combos");
  await twoShotMobile(cp, BASE, "/offers", shot, "offers-tab", PAGE_WAIT);
  await gotoAndWait(cp, BASE, "/offers?tab=combos", PAGE_WAIT);
  await shot(cp, "offers-combos-tab");

  log("wishlist");
  await twoShotMobile(cp, BASE, "/wishlist", shot, "wishlist-page", PAGE_WAIT);

  log("faqs");
  await twoShotMobile(cp, BASE, "/faqs", shot, "faqs-page", PAGE_WAIT);

  log("shop by concern");
  await twoShotMobile(cp, BASE, "/shop?concern=dry-skin", shot, "shop-by-concern", PAGE_WAIT);

  log("home — floating offers button");
  await gotoAndWait(cp, BASE, "/", PAGE_WAIT);
  await cp.click('button[aria-label*="See all" i]').catch(() => {});
  await cp.waitForTimeout(500);
  await shot(cp, "home-offers-fab-modal");
  await cp.keyboard.press("Escape").catch(() => {});

  log("our story (7 shots, scrolled)");
  await gallery(cp, BASE, "/our-story", shot, "story", 7, { waitAfterLoad: PAGE_WAIT });

  log("ingredients (6 shots, scrolled)");
  await gallery(cp, BASE, "/ingredients", shot, "ingredients", 6, { waitAfterLoad: PAGE_WAIT });

  log("learn");
  await gallery(cp, BASE, "/learn", shot, "learn-index", 3, { waitAfterLoad: PAGE_WAIT });
  await gallery(cp, BASE, "/learn/from-idea-to-a-finished-bar-of-soap", shot, "learn-article", 2, { waitAfterLoad: PAGE_WAIT });

  log("search");
  await twoShotMobile(cp, BASE, "/search?q=soap", shot, "search-results", PAGE_WAIT);

  log("account");
  await twoShotMobile(gp, BASE, "/login?next=/account", shot, "account-login-otp", PAGE_WAIT);
  await clickText(gp, "button", /password/i);
  await gp.waitForTimeout(500);
  await shot(gp, "account-login-password");
  await twoShotMobile(cp, BASE, "/account", shot, "account-overview", PAGE_WAIT);
  await gotoAndWait(cp, BASE, "/account", PAGE_WAIT);
  await clickText(cp, "button", /^edit$/i);
  await cp.waitForTimeout(500);
  await shot(cp, "account-edit-profile");

  log("cart & checkout");
  await twoShotMobile(cp, BASE, "/cart", shot, "cart-page", PAGE_WAIT);
  await gotoAndWait(cp, BASE, "/checkout", PAGE_WAIT);
  await shot(cp, "checkout-contact");
  await cp.evaluate(() => document.querySelectorAll("input").forEach((i) => { if (!i.value) { if (i.type === "email") i.value = "bhavesh@example.com"; else if (i.type === "tel") i.value = "9849116181"; } }));
  await clickText(cp, "button", /continue/i);
  await cp.waitForTimeout(800);
  await shot(cp, "checkout-address");
  await clickText(cp, "button", /continue to review/i);
  await cp.waitForTimeout(800);
  await shot(cp, "checkout-review");
  await clickText(cp, "button", /continue to payment/i);
  await cp.waitForTimeout(800);
  await clickText(cp, "button", /pay .*secur|pay ₹/i);
  await cp.waitForTimeout(1200);
  await shot(cp, "checkout-payment-modal");
  await twoShotMobile(cp, BASE, "/order/SURK-2026-482913", shot, "checkout-order-confirmation", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/track-order", shot, "checkout-order-tracking", PAGE_WAIT);

  log("contact");
  await twoShotMobile(cp, BASE, "/contact", shot, "contact-page", PAGE_WAIT);

  log("policies");
  await twoShotMobile(cp, BASE, "/policies/shipping", shot, "policies-shipping", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/policies/returns", shot, "policies-returns", PAGE_WAIT);

  await custCtx.close();
  await guestCtx.close();
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
