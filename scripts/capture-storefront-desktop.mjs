/**
 * Surakshitam Naturals — storefront (shopping + cart + checkout) screenshots, DESKTOP.
 * Produces ./SurakshitamNaturals-Screenshots/Desktop-Shopping-Cart/<NNN>-<section>-<feature>.png
 *
 * Feature list captured:
 *   Menus           — the Shop drop-down open (all category shelves), and the account
 *                      drop-down open (where Log out now lives). Both are states you only
 *                      see by interacting, so they need deliberate shots.
 *   Home            — 12 shots, scrolled top-to-bottom (hero, featured, story teaser,
 *                      ingredients teaser, testimonials, footer, ...) — home has a lot of
 *                      scroll-reveal sections, a couple of shots would miss most of it.
 *   Shop            — catalogue grid, category filter (home-care), bio-enzyme shelf,
 *                      product detail, ingredients/usage detail
 *   Skin/Hair care  — category views
 *   Partner Brands  — the other-brands shelf, plus one partner product page (brand shown
 *                      instead of ours, neutral pack image)
 *   Offers/Combos   — /offers page, both tabs (incl. the always-on free-delivery card);
 *                      wishlist page; FAQs; shop-by-concern filter; the floating "Offers"
 *                      button's "see all" modal on the homepage
 *   Our story       — 7 shots, scrolled top-to-bottom
 *   Ingredients     — 6 shots, scrolled top-to-bottom
 *   Learn           — article index (3, scrolled), single article (2, scrolled)
 *   Search          — product search, and a search that hits a partner brand
 *   Contact         — contact page
 *   Account         — login (OTP), login (password), account overview, order history,
 *                     edit-profile form
 *   Cart & checkout — cart with parcel weight, the PIN-code delivery check (near and far,
 *                     so the 15 km distance charge is visible), a cart over ₹699 with free
 *                     delivery unlocked, checkout contact/address/review, mock payment
 *                     modal, order confirmation with the delivery breakdown
 *   Delivery        — order tracking for a bike delivery: rider details, call button and
 *                     the live map; plus the rider's own location-sharing sheet
 *   Policies        — shipping policy, returns policy
 *
 * Every page gets a long settle window (15s + image-load wait) before its first
 * screenshot — the storefront uses lazy-loaded images and scroll-reveal animations that
 * need real time to finish, not just network-idle.
 *
 * Exports `run(browser)` so it can be called standalone or from capture-all.mjs.
 *
 * HOW TO RUN standalone (from surakshitam-web/, with `SCREENSHOTS=1 npm run dev` running):
 *   npm i -D playwright   (sharp is already a devDependency)
 *   npx playwright install chromium
 *   node scripts/capture-storefront-desktop.mjs
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
  openMenuAndShot,
  fillPincode,
  log,
} from "./screenshot-utils.mjs";
import {
  storefrontSeedScript,
  CART_FREE_DELIVERY,
  ORDER_BIKE,
  ORDER_COURIER,
} from "./screenshot-seed.mjs";

const BASE = process.env.BASE || "http://localhost:3000";
const ROOT = "./SurakshitamNaturals-Screenshots/Desktop-Shopping-Cart";
const VIEWPORT = { width: 1440, height: 960 };
const PAGE_WAIT = 15000; // every storefront page gets this long to settle before its first shot

export async function run(browser) {
  await assertServerUp(browser, BASE);
  mkdir(ROOT);
  const shot = makeShotter(ROOT);

  const custCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await custCtx.addInitScript(storefrontSeedScript({ customer: true }));
  const cp = await custCtx.newPage();

  const guestCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await guestCtx.addInitScript(storefrontSeedScript({ customer: false }));
  const gp = await guestCtx.newPage();

  // A third context purely for the "over ₹699" cart. The seed re-runs on every
  // navigation, so a bigger cart can't just be written mid-run — it would be
  // overwritten by the next page load.
  const bigCartCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await bigCartCtx.addInitScript(storefrontSeedScript({ customer: true, cart: CART_FREE_DELIVERY }));
  const bp = await bigCartCtx.newPage();

  log("menus — shop & account drop-downs");
  await gotoAndWait(cp, BASE, "/", PAGE_WAIT);
  await openMenuAndShot(cp, 'nav[aria-label="Primary"] button[aria-haspopup="menu"]', shot, "menu-shop-dropdown");
  await openMenuAndShot(cp, 'button[aria-label^="Account menu"]', shot, "menu-account-dropdown");

  log("home (12 shots, scrolled)");
  await gallery(cp, BASE, "/", shot, "home", 12, { waitAfterLoad: PAGE_WAIT });

  log("shop");
  await gotoAndWait(cp, BASE, "/shop", PAGE_WAIT);
  await shot(cp, "shop-catalogue-grid");
  await gotoAndWait(cp, BASE, "/shop?category=home-care", PAGE_WAIT);
  await shot(cp, "shop-category-filter");
  await gotoAndWait(cp, BASE, "/shop?category=home-care&shelf=bio-enzyme", PAGE_WAIT);
  await shot(cp, "shop-home-care-bio-enzyme");
  await gotoAndWait(cp, BASE, "/product/shea-butter-soap", PAGE_WAIT);
  await shot(cp, "shop-product-detail");
  await cp.evaluate(() => window.scrollTo(0, 900));
  await cp.waitForTimeout(800);
  await shot(cp, "shop-product-ingredients-usage");

  log("skin & hair care");
  await gotoAndWait(cp, BASE, "/shop?category=skin-care", PAGE_WAIT);
  await shot(cp, "skincare-category");
  await gotoAndWait(cp, BASE, "/shop?category=hair-care", PAGE_WAIT);
  await shot(cp, "haircare-category");

  log("partner brands");
  await gotoAndWait(cp, BASE, "/shop?category=partner-brands", PAGE_WAIT);
  await shot(cp, "partner-brands-category");
  await gotoAndWait(cp, BASE, "/product/homemade-wheat-noodles", PAGE_WAIT);
  await shot(cp, "partner-brands-product-detail");

  log("offers & combos");
  await gotoAndWait(cp, BASE, "/offers", PAGE_WAIT);
  await shot(cp, "offers-tab");
  await clickText(cp, "button", /^combos/i);
  await cp.waitForTimeout(500);
  await shot(cp, "offers-combos-tab");

  log("wishlist");
  await gotoAndWait(cp, BASE, "/wishlist", PAGE_WAIT);
  await shot(cp, "wishlist-page");

  log("faqs");
  await gotoAndWait(cp, BASE, "/faqs", PAGE_WAIT);
  await shot(cp, "faqs-page");

  log("shop by concern");
  await gotoAndWait(cp, BASE, "/shop?concern=dry-skin", PAGE_WAIT);
  await shot(cp, "shop-by-concern");

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
  await gotoAndWait(cp, BASE, "/search?q=soap", PAGE_WAIT);
  await shot(cp, "search-results");
  await gotoAndWait(cp, BASE, "/search?q=noodles", PAGE_WAIT);
  await shot(cp, "search-partner-brand");

  log("account");
  await gotoAndWait(gp, BASE, "/login?next=/account", PAGE_WAIT);
  await shot(gp, "account-login-otp");
  await clickText(gp, "button", /password/i);
  await gp.waitForTimeout(500);
  await shot(gp, "account-login-password");
  await gotoAndWait(cp, BASE, "/account", PAGE_WAIT);
  await shot(cp, "account-overview");
  await cp.evaluate(() => window.scrollTo(0, 500));
  await cp.waitForTimeout(500);
  await shot(cp, "account-order-history");
  await gotoAndWait(cp, BASE, "/account", PAGE_WAIT);
  await clickText(cp, "button", /^edit$/i);
  await cp.waitForTimeout(500);
  await shot(cp, "account-edit-profile");

  log("cart & checkout");
  await gotoAndWait(cp, BASE, "/cart", PAGE_WAIT);
  await shot(cp, "cart-page");
  // A PIN past the 15 km radius, so the distance charge is actually visible.
  await fillPincode(cp, "500049");
  await shot(cp, "cart-delivery-distance-charge");

  log("cart — free delivery unlocked (over ₹699)");
  await gotoAndWait(bp, BASE, "/cart", PAGE_WAIT);
  await shot(bp, "cart-free-delivery-unlocked");
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
  await gotoAndWait(cp, BASE, `/order/${ORDER_COURIER}`, PAGE_WAIT);
  await shot(cp, "checkout-order-confirmation");
  await cp.evaluate(() => window.scrollTo(0, 620));
  await cp.waitForTimeout(600);
  await shot(cp, "checkout-order-delivery-breakdown");

  log("delivery tracking — bike, rider & live map");
  // The tracker prefills the most recent order but only renders it after the
  // form is submitted, so the shot has to click Track first.
  await gotoAndWait(cp, BASE, "/track-order", PAGE_WAIT);
  await clickText(cp, "button", /^track$/i);
  await cp.waitForTimeout(1500);
  await shot(cp, "tracking-bike-rider-card");
  await cp.evaluate(() => window.scrollTo(0, 760));
  await cp.waitForTimeout(800);
  await shot(cp, "tracking-live-map");
  await gotoAndWait(cp, BASE, `/order/${ORDER_BIKE}`, PAGE_WAIT);
  await shot(cp, "tracking-order-with-rider");

  log("rider location sheet");
  await gotoAndWait(cp, BASE, `/rider/${ORDER_BIKE}`, PAGE_WAIT);
  await shot(cp, "delivery-rider-sheet");

  log("contact");
  await gotoAndWait(cp, BASE, "/contact", PAGE_WAIT);
  await shot(cp, "contact-page");

  log("policies");
  await gotoAndWait(cp, BASE, "/policies/shipping", PAGE_WAIT);
  await shot(cp, "policies-shipping");
  await gotoAndWait(cp, BASE, "/policies/returns", PAGE_WAIT);
  await shot(cp, "policies-returns");

  await custCtx.close();
  await guestCtx.close();
  await bigCartCtx.close();
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
