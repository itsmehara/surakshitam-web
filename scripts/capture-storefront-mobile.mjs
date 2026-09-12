/**
 * Surakshitam Naturals — storefront (shopping + cart + checkout) screenshots, MOBILE.
 * Produces ./SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart/<NNN>-<section>-<feature>.png
 *
 * Same feature list as capture-storefront-desktop.mjs (see that file's header comment), at
 * a "regular" phone viewport (360×780 — matches common Android widths and iPhone
 * mini/SE, not an oversized modern iPhone). Home/Our-Story/Ingredients/Learn already get
 * multiple scrolled shots via gallery(); every other single-shot screen gets 2 shots (top +
 * scrolled) via twoShotMobile() since a phone screen shows much less at once than desktop.
 *
 * The menu differs from desktop and is captured accordingly: there is no hover
 * drop-down here, so the slide-out drawer is shot twice — once at the top showing
 * Shop with its category shelves listed inline, and once scrolled to the bottom
 * where the account links and Log out sit.
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
const ROOT = "./SurakshitamNaturals-Screenshots/Mobile-Shopping-Cart";
const VIEWPORT = { width: 360, height: 780 }; // "regular" phone size — common Android width, iPhone mini/SE range
const PAGE_WAIT = 15000;

export async function run(browser) {
  await assertServerUp(browser, BASE);
  mkdir(ROOT);
  const shot = makeShotter(ROOT);

  const mobileCtx = { viewport: VIEWPORT, deviceScaleFactor: 1, isMobile: true, hasTouch: true };

  const custCtx = await browser.newContext(mobileCtx);
  await custCtx.addInitScript(storefrontSeedScript({ customer: true }));
  const cp = await custCtx.newPage();

  const guestCtx = await browser.newContext(mobileCtx);
  await guestCtx.addInitScript(storefrontSeedScript({ customer: false }));
  const gp = await guestCtx.newPage();

  // Separate context for the "over ₹699" cart — the seed re-runs on every
  // navigation, so a bigger cart written mid-run would just be overwritten.
  const bigCartCtx = await browser.newContext(mobileCtx);
  await bigCartCtx.addInitScript(storefrontSeedScript({ customer: true, cart: CART_FREE_DELIVERY }));
  const bp = await bigCartCtx.newPage();

  log("menu — slide-out drawer (top + scrolled)");
  await gotoAndWait(cp, BASE, "/", PAGE_WAIT);
  await cp.click('button[aria-label*="open menu" i]').catch(() => {});
  await cp.waitForTimeout(500);
  await shot(cp, "menu-drawer-shop-shelves");
  // The drawer scrolls inside itself, not the page. On a taller phone everything
  // fits in one screen, so only take the second shot when there's actually more
  // to see — otherwise it's a duplicate image for the founder to wade through.
  const drawerScrolls = await cp.evaluate(() => {
    const drawer = document.querySelector('nav[aria-label="Mobile"]');
    if (!drawer || drawer.scrollHeight <= drawer.clientHeight + 8) return false;
    drawer.scrollTop = drawer.scrollHeight;
    return true;
  });
  if (drawerScrolls) {
    await cp.waitForTimeout(500);
    await shot(cp, "menu-drawer-scrolled");
  } else {
    log("  … drawer fits on one screen — skipping the scrolled duplicate");
  }
  await cp.keyboard.press("Escape").catch(() => {});

  log("home (12 shots, scrolled)");
  await gallery(cp, BASE, "/", shot, "home", 12, { waitAfterLoad: PAGE_WAIT });

  log("shop");
  await twoShotMobile(cp, BASE, "/shop", shot, "shop-catalogue-grid", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/shop?category=home-care", shot, "shop-category-filter", PAGE_WAIT);
  await gotoAndWait(cp, BASE, "/shop?category=home-care&shelf=bio-enzyme", PAGE_WAIT);
  await shot(cp, "shop-home-care-bio-enzyme");
  await twoShotMobile(cp, BASE, "/product/shea-butter-soap", shot, "shop-product-detail", PAGE_WAIT);

  log("skin & hair care");
  await twoShotMobile(cp, BASE, "/shop?category=skin-care", shot, "skincare-category", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/shop?category=hair-care", shot, "haircare-category", PAGE_WAIT);

  log("partner brands");
  await twoShotMobile(cp, BASE, "/shop?category=partner-brands", shot, "partner-brands-category", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/product/homemade-wheat-noodles", shot, "partner-brands-product-detail", PAGE_WAIT);

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
  await gotoAndWait(cp, BASE, "/search?q=noodles", PAGE_WAIT);
  await shot(cp, "search-partner-brand");

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
  // A PIN past the 15 km radius, so the distance charge is actually visible.
  await fillPincode(cp, "500049");
  await shot(cp, "cart-delivery-distance-charge");

  log("cart — free delivery unlocked (over ₹699)");
  await twoShotMobile(bp, BASE, "/cart", shot, "cart-free-delivery-unlocked", PAGE_WAIT);

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
  await twoShotMobile(cp, BASE, `/order/${ORDER_COURIER}`, shot, "checkout-order-confirmation", PAGE_WAIT);

  log("delivery tracking — bike, rider & live map");
  // The tracker prefills the most recent order but only renders it once the
  // form is submitted, so the shot has to click Track first.
  await gotoAndWait(cp, BASE, "/track-order", PAGE_WAIT);
  await clickText(cp, "button", /^track$/i);
  await cp.waitForTimeout(1500);
  await shot(cp, "tracking-bike-rider-card");
  await cp.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.5)));
  await cp.waitForTimeout(800);
  await shot(cp, "tracking-live-map");
  await twoShotMobile(cp, BASE, `/order/${ORDER_BIKE}`, shot, "tracking-order-with-rider", PAGE_WAIT);

  log("rider location sheet");
  await twoShotMobile(cp, BASE, `/rider/${ORDER_BIKE}`, shot, "delivery-rider-sheet", PAGE_WAIT);

  log("contact");
  await twoShotMobile(cp, BASE, "/contact", shot, "contact-page", PAGE_WAIT);

  log("policies");
  await twoShotMobile(cp, BASE, "/policies/shipping", shot, "policies-shipping", PAGE_WAIT);
  await twoShotMobile(cp, BASE, "/policies/returns", shot, "policies-returns", PAGE_WAIT);

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
