/**
 * Surakshitam Naturals — storefront (shopping + cart + checkout) screenshots, MOBILE.
 * Produces ./SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart/<NNN>-<section>-<feature>.png
 *
 * Same feature list as capture-storefront-desktop.mjs (see that file's header comment),
 * captured at an iPhone-sized viewport instead.
 *
 * HOW TO RUN (from surakshitam-web/, with `SCREENSHOTS=1 npm run dev` already running):
 *   npm i -D playwright   (sharp is already a devDependency)
 *   npx playwright install chromium
 *   node scripts/capture-storefront-mobile.mjs
 */
import { chromium } from "playwright";
import { mkdir, settle, goto, clickText, makeShotter } from "./screenshot-utils.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart";
const VIEWPORT = { width: 390, height: 844 }; // iPhone 14-ish

const CART = [{ id: "p-shea-butter-soap", qty: 1 }, { id: "p-hair-oil", qty: 2 }, { id: "p-dishwash-liquid", qty: 1 }];
const PROFILE = { name: "Bhavesh Allapati", mobile: "+91 98491 16181", email: "srikanth.alapati@yahoo.com", address: "Nagole, Hyderabad, Telangana – 500068" };
const AUTH = { id: "9849116181", mobile: "+91 98491 16181", name: "Bhavesh Allapati", email: "srikanth.alapati@yahoo.com", method: "otp", loggedInAt: "2026-08-16T11:00:00.000Z" };
const ADDR = { fullName: "Bhavesh Allapati", phone: "9849116181", altPhone: "", line1: "Nagole", line2: "", landmark: "", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" };
const ORDER = [{ orderNumber: "SURK-2026-482913", createdAt: "2026-08-16T11:13:09.373Z", userId: "9849116181", items: [{ productId: "p-shea-butter-soap", slug: "shea-butter-soap", nameSnapshot: "Shea Butter Soap", skuSnapshot: "SN-SC-SHS-100", priceSnapshot: 14900, qty: 1, image: "/products/shea-butter-soap.webp", size: "100 g" }, { productId: "p-hair-oil", slug: "hair-oil", nameSnapshot: "Hair Oil", skuSnapshot: "SN-HR-OIL-100", priceSnapshot: 24900, qty: 2, image: "/products/hair-oil.webp", size: "100 ml" }], subtotal: 64700, shipping: 0, total: 64700, address: { fullName: "Bhavesh Allapati", phone: "9849116181", line1: "Nagole", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" }, paymentStatus: "PAID", paymentId: "pay_demo_a1b2c3d4e5", fulfillmentStatus: "PACKED", courier: "Delhivery", trackingNumber: "DL4821093765" }];

function seedScript({ customer = false } = {}) {
  return `try{
    localStorage.setItem('sn-cart-v1', ${JSON.stringify(JSON.stringify(CART))});
    localStorage.setItem('sn-profile-v1', ${JSON.stringify(JSON.stringify(PROFILE))});
    localStorage.setItem('sn-address-v1', ${JSON.stringify(JSON.stringify(ADDR))});
    localStorage.setItem('sn-orders-v1', ${JSON.stringify(JSON.stringify(ORDER))});
    localStorage.setItem('sn-visitor-v1', 'v_demo12ab');
    ${customer ? `localStorage.setItem('sn-auth-v1', ${JSON.stringify(JSON.stringify(AUTH))});` : `localStorage.removeItem('sn-auth-v1');`}
  }catch(e){}`;
}

const run = async () => {
  mkdir(ROOT);
  const shot = makeShotter(ROOT);
  const browser = await chromium.launch();

  const custCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await custCtx.addInitScript(seedScript({ customer: true }));
  const cp = await custCtx.newPage();

  const guestCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await guestCtx.addInitScript(seedScript({ customer: false }));
  const gp = await guestCtx.newPage();

  console.log("home");
  await goto(cp, BASE, "/");
  await shot(cp, "home-hero");
  await cp.click('button[aria-label*="menu" i]').catch(() => {});
  await cp.waitForTimeout(300);
  await shot(cp, "home-mobile-menu");
  await cp.keyboard.press("Escape").catch(() => {});
  await cp.evaluate(() => window.scrollTo(0, 900));
  await cp.waitForTimeout(400);
  await shot(cp, "home-featured-products");

  console.log("shop");
  await goto(cp, BASE, "/shop");
  await shot(cp, "shop-catalogue-grid");
  await goto(cp, BASE, "/shop?category=home-care");
  await shot(cp, "shop-category-filter");
  await goto(cp, BASE, "/product/shea-butter-soap");
  await shot(cp, "shop-product-detail");
  await cp.evaluate(() => window.scrollTo(0, 900));
  await cp.waitForTimeout(400);
  await shot(cp, "shop-product-ingredients-usage");

  console.log("skin & hair care");
  await goto(cp, BASE, "/shop?category=skin-care");
  await shot(cp, "skincare-category");
  await goto(cp, BASE, "/shop?category=hair-care");
  await shot(cp, "haircare-category");

  console.log("our story");
  await goto(cp, BASE, "/our-story");
  await shot(cp, "story-brand-page");

  console.log("ingredients");
  await goto(cp, BASE, "/ingredients");
  await shot(cp, "ingredients-glossary");

  console.log("learn");
  await goto(cp, BASE, "/learn");
  await shot(cp, "learn-article-index");
  await goto(cp, BASE, "/learn/from-idea-to-a-finished-bar-of-soap");
  await shot(cp, "learn-article-detail");

  console.log("search");
  await goto(cp, BASE, "/search?q=soap");
  await shot(cp, "search-results");

  console.log("account");
  await goto(gp, BASE, "/login?next=/account");
  await shot(gp, "account-login-otp");
  await clickText(gp, "button", /password/i);
  await gp.waitForTimeout(400);
  await shot(gp, "account-login-password");
  await goto(cp, BASE, "/account");
  await shot(cp, "account-overview");
  await cp.evaluate(() => window.scrollTo(0, 500));
  await cp.waitForTimeout(400);
  await shot(cp, "account-order-history");
  await goto(cp, BASE, "/account");
  await clickText(cp, "button", /^edit$/i);
  await cp.waitForTimeout(400);
  await shot(cp, "account-edit-profile");

  console.log("cart & checkout");
  await goto(cp, BASE, "/cart");
  await shot(cp, "cart-page");
  await goto(cp, BASE, "/checkout");
  await shot(cp, "checkout-contact");
  await cp.evaluate(() => document.querySelectorAll("input").forEach((i) => { if (!i.value) { if (i.type === "email") i.value = "bhavesh@example.com"; else if (i.type === "tel") i.value = "9849116181"; } }));
  await clickText(cp, "button", /continue/i);
  await cp.waitForTimeout(500);
  await shot(cp, "checkout-address");
  await clickText(cp, "button", /continue to review/i);
  await cp.waitForTimeout(500);
  await shot(cp, "checkout-review");
  await clickText(cp, "button", /continue to payment/i);
  await cp.waitForTimeout(500);
  await clickText(cp, "button", /pay .*secur|pay ₹/i);
  await cp.waitForTimeout(900);
  await shot(cp, "checkout-payment-modal");
  await goto(cp, BASE, "/order/SURK-2026-482913");
  await shot(cp, "checkout-order-confirmation");
  await goto(cp, BASE, "/track-order");
  await shot(cp, "checkout-order-tracking");

  console.log("policies");
  await goto(cp, BASE, "/policies/shipping");
  await shot(cp, "policies-shipping");
  await goto(cp, BASE, "/policies/returns");
  await shot(cp, "policies-returns");

  await browser.close();
  console.log("\nDONE → " + ROOT);
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
