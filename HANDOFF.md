# Surakshitam Naturals — Project Handoff & State

Single source of truth for continuing this project in a fresh chat. Read this first; you rarely
need to re-read the whole codebase. Complements `../surakshitam-docs/docs/`
(`ARCHITECTURE.md`, `ADMIN_WORKFLOWS.md`, `ROADMAP.md`, `COMPLIANCE.md`).

---

## 0. v3-static — what this branch is (read this first on `v3-static`)

**Branch:** `v3-static`, cut from `v2/full-screen-hero` on 2026-09-15. Version naming
(ANSWERS-2026-09-14 §VERSION NAMING): v1 = special-screen storefront · v2 = full-screen hero +
full shopping prototype (localStorage) · **v3 = this static listing site** · v4 = real backend.
`master` and `v2/full-screen-hero` are untouched; everything below applies to `v3-static` only.

**What it is:** a plain-HTML export of the storefront (`next build` → `out/`) published by GitHub
Pages at **https://www.surakshitamnaturals.com** (GoDaddy DNS → `itsmehara.github.io`). No cart,
login, admin, prices, stock, ratings, offers, policies or FAQs. Every product CTA is
**"Order on WhatsApp"** (Business number +91 74163 94594) with the agreed pre-filled text; the
contact page carries the **enquiry form → Google Sheet** (`lib/enquiry.ts`, see
`../surakshitam-docs/docs/v3-static/ENQUIRY-SETUP.md`). Hero slideshow, animations and the
fruit physics are unchanged.

**Source of truth for content decisions:** `../surakshitam-docs/docs/v3-static/ANSWERS-2026-09-14.md`.

### Build / deploy
- `npm run build` → `out/` (static export; `next.config.mjs` sets `output:"export"`,
  `trailingSlash:true`, `images.unoptimized:true`). Zero dynamic routes: `/product/[slug]` and
  `/learn/[slug]` use `generateStaticParams`; `/shop` reads its filters client-side
  (`components/shop/ShopView.tsx` + `useSearchParams`) so one `shop/index.html` serves every
  `?category=` / `?shelf=` / `?concern=` / `?sort=` combination.
- Local check: `npx serve out` (workspace `.claude/launch.json` has a `serve-out` entry on :3456).
- `.github/workflows/pages.yml` — on push to `v3-static`: `npm ci`, `npm run build`,
  `actions/upload-pages-artifact` (`out/`), `actions/deploy-pages`. Pages source must be
  **GitHub Actions**. `NEXT_PUBLIC_ENQUIRY_URL` comes from a repository **variable** (Settings →
  Secrets and variables → Actions → Variables); empty = the form reports "not configured".
- `public/CNAME` = `www.surakshitamnaturals.com`; `public/.nojekyll` stops Pages' Jekyll pass from
  dropping `_next/`.
- `robots.ts`/`sitemap.ts` export as `robots.txt`/`sitemap.xml` with trailing-slash URLs.

### What was removed vs v2 (and where it still lives: `v2/full-screen-hero`)
- Routes: `studio/*`, `cart`, `checkout`, `login`, `register`, `account`, `order/*`, `rider/*`,
  `track-order`, `wishlist`, `offers`, `combos`, `search`, `policies/*`, `faqs`.
- Components: `account/`, `admin/`, `auth/`, `cart/`, `checkout/`, `search/`, `tracking/`,
  `contact/ContactForm`, `home/{Hero,Reviews,Newsletter,PromoCarousel}`, `layout/OfferBanner`,
  `ui/{AddToCartButton,BuyNowButton,ComboCard,ComingSoon,FaqAccordion,OffersFab,PromoCardGrid,
  PromoTile,QuickViewButton,QuickViewModal,StarRating,WishlistButton,WhatsAppFloat}`.
- lib: `admin, audit, auth, bundles, cart/, catalog-store, delivery, demo-seed, format,
  ingredient-store, notifications, offers, orders, payments, print-label, profile, promotions,
  reviews, rider-tracking, site-settings, users, weight, wishlist/`.
- Data model: `Product` lost `price`, `mrp`, `stock`, `rating`, `reviewCount`, `weightGrams`;
  `Review` type gone. Catalog dropped Face Cream, Face Pack, Millet Hakka Noodles, Roasted Ragi
  Murukku, Wood-Pressed Groundnut Oil → **33 products** (32 house + 1 partner). Partner brand
  "Amma's Kitchen" → **"Homemade Swagruha Kitchen"** (artwork regenerated via
  `scripts/generate-partner-images.mjs`, which now lists only that one item).
- `scripts/capture-*.mjs` and `screenshot-seed.mjs` still reference v2 routes/localStorage —
  they are not part of the build and were left as-is; they will not work against v3.

### What was added / changed
- `components/ui/WhatsAppLink.tsx` is now wired everywhere a WhatsApp link exists (header bar,
  header button, mobile drawer, footer, floating button, product cards, PDP, contact, home CTA);
  each has a distinct `cta` so the "WhatsApp Clicks" sheet tab can tell them apart.
- `components/ui/OrderingNote.tsx` — the "Online ordering coming soon" line on shop + PDP.
- `components/home/WhatsAppCta.tsx` replaces Reviews + Newsletter at the bottom of the home page.
- `app/contact/page.tsx` — `<EnquiryForm>`, WhatsApp card (`id="whatsapp"`, footer deep-links to
  it), phone / email / address / **Mon–Sat 10 am – 6 pm** / YouTube · Instagram · Facebook.
- `lib/site.ts` — `url` is the real domain, `hours` added, Facebook URL is the vanity
  `facebook.com/surakshitam.naturals`, nav = Shop ▾ / Our Story / Ingredients / Learn / Contact,
  footer "Reach us" column replaces "Help".
- `components/ui/NotFoundView.tsx` reads the path after mount — Pages serves one `404.html` for
  every missing URL, so rendering `usePathname()` during hydration threw React #425.
- Ingredients page: `useIngredientLibrary` returns the seed only (no admin overlay).
- Every "demo / prototype / to confirm with founders" note that was visible to customers was
  removed from the rendered pages (Our Story quote, Learn intro/outro, Ingredients intro, footer).

### Round 2 (15 Sep, evening) — enquiry list, contact types, header, hero
- **Top ribbon removed** from `Header.tsx`. Header is now `h-16` / `lg:h-[4.5rem]`; the shop's
  sticky filter bar and the AppShell Suspense fallback use those offsets. On phones the
  WhatsApp header button is icon-only so it never crowds the wordmark.
- **Enquiry list** (`lib/enquiry-list/EnquiryListContext.tsx`, localStorage `sn-enquiry-list-v1`)
  replaces the per-product WhatsApp buttons. `AddToEnquiryButton` on cards (pill → "In enquiry
  list") and on the PDP (stepper once listed). `components/enquiry/EnquiryListFab.tsx` sits at the
  top of the `FloatingContact` stack with a count badge, only when the list has items;
  `EnquiryListDrawer.tsx` has qty −/+, remove, clear, **"Send enquiry on WhatsApp"** (ONE numbered
  message via `whatsAppListHref`, click logged with cta `enquiry-list`) and **"Send as a form
  instead"** (→ `/contact?type=product`, form pre-filled with the same lines). It is an enquiry
  list, not a checkout — no prices anywhere. Instagram FAB is `hidden sm:flex` (three stacked
  buttons crowded a phone).
- **Contact submenu** (`lib/site.ts`): Send Enquiry / Promote Your Brand · Partner With Us / Book
  a Consultation Slot → `/contact?type=product|partner|consultation`. `Header.isActive` now
  compares query params generically (`NAV_PARAMS = ["category","type"]`).
- **EnquiryForm** handles the three types: segmented control (desktop) / select (phones), `?type=`
  pre-selects, type-specific extra field (products textarea / business name / preferred slot),
  copy and success text per type. On error it shows the message **and** a "Send it on WhatsApp
  instead" link built from the same fields (`whatsAppFormFallbackHref`) — also what a visitor
  sees while `NEXT_PUBLIC_ENQUIRY_URL` is unset. Payload adds `type`, `business`, `slot`;
  **`Code.gs` updated** (3 new columns appended, typed alert subject, per-type validation) —
  redeploy the script and, if the Sheet already has the 8-column header, add I1:K1 by hand
  (ENQUIRY-SETUP.md §8).
- **Shop** (`ShopView.tsx`): category chips scroll sideways with no scrollbar (`.sn-scroll-x`),
  sort is a native `<select>` (router.push), bio-enzyme blurb hidden on phones. Five Shop submenu
  items unchanged.
- **Hero** (`HeroSlideshow.tsx`): below `lg` the copy sits at the bottom over a vertical scrim so
  the photo shows through the top; `lg+` unchanged (copy left, photo right). Each slide accepts
  `focus: { mobile, desktop }` (CSS object-position; defaults "62% center" / "center right") —
  **when the new banner images arrive, swap `SLIDES[].src` and tune `focus` per slide; no layout
  change needed.** Trust line hidden on phones. Physics/leaves untouched.

- **Consultation booking** (`components/contact/SlotPicker.tsx`): date input (Mon–Sat, next 30
  days) + 30-minute slot grid 10:00–16:30 (`CONSULT_START/END`, `SLOT_MINUTES` — change there),
  past slots disabled on today; "first consultation free · 30 min" is stated in the form, nav and
  type label. `slot` is sent as one readable string, so the Sheet column is unchanged.
- **Drawer space pass**: 44px rows, note auto-grows from one line, preview collapsed on phones /
  open from `sm`, Clear in the header, Copy + Send-as-form as one text row.

- **Round 3 (15 Sep, late)**: phone number shown only in the footer (PDP Call button, mobile
  drawer row and contact-page number removed); Contact submenu = Product Enquiry / Partner With
  Us / Book a Consultation; `SlotPicker` is date + slot dropdown on one row under an amber
  "confirmed on availability" notice; contact-page email link jumps to `#enquiry`; **quantity is
  set on the product card itself** (`AddToEnquiryButton` turns into a − n + stepper in place;
  0 removes); `/contact` runs one page-long `BotanicalBackdrop` (`PageIntro backdrop={false}`).

- **Physics sprites are photos (16 Sep)**: `public/physics/{reetha-single,reetha-pair,
  reetha-cluster,amla,lemon-half}.webp`, generated cut-outs (masters in
  `surakshitam-docs/source-assets/physics/`). `FallingFruitPhysics.SPECS` = `spec(sprite,
  height, rScale)`; width follows the image's trimmed aspect in `SPRITES`. To re-export after
  replacing a master: trim → resize long side 160 → webp q84 (one-liner in the 16 Sep chat log,
  or just ask). The hand-drawn fruit and the 3D lemon flip are gone; leaves remain CSS/SVG.
- **Ground line**: physics floor = section bottom edge (`GROUND_FRACTION = 1`), sprites rest
  their drawn bottom on it.

- **Hero images v2 (16 Sep)**: the five originals + the dishwash product hero were *outpainted*
  (not regenerated) to 2560×1440 via the brand-guard skill — labels untouched except the
  shampoo's "SURAKASHITAM" → "SURAKSHITAM" fix. Masters `surakshitam-docs/source-assets/hero-v2/`;
  served `public/banners/<name>-extended-{1280,2048}.webp`. Slideshow: 6 slides, plain `<img>`
  + srcset, slide 0 eager and each next slide mounted one hold ahead; drift 1.04→1.12× / ±2%;
  below `lg` the whole image shows (`object-contain`, top) over a blurred copy with the copy
  beneath. Full brief + prompt: `surakshitam-docs/docs/v3-static/HERO-IMAGE-PROMPT.md`.
  The raw outpaints showed a texture/tone step at the join ("image placed on image"), so
  `scripts/blend-hero.mjs` keeps the original sharp and lets the outer band fall out of focus
  with a 200px feather (`<name>-blended.png` are what is exported). Re-run it after any
  re-outpaint: `node scripts/blend-hero.mjs in.png out.png 7 200`.
  Old `*-responsive.webp` files in `public/banners/` are now unused except `our-story-…`
  (Learn header) — safe to delete the rest.

- **Hero v2 final (16 Sep)**: images from `surakshitam-docs/source-assets/banner-masters-v2/`
  (5 re-framed via the brand-guard skill + hair-care outpaint; README there has provenance),
  served as `public/banners/<name>-v2-{1280,2048}.webp`. Motion = `lib/hero-motion.ts`: six
  drone-style camera moves, one per slide, restarted on each visit, 6.8 s ease-out, amplitude
  budgeted to the banners' margin; mobile 60% / blurred fill 40%. Hold 5 s, fade 1.4 s. Page
  headers (`BannerIntro move={n}`) loop the same glide. Open image item: dish-wash tub logo on
  the home-care banner (single-label prompt in the 16 Sep log).

### Still open for v3 (also logged in `../REGISTRY.md` → "v3-static pending")
1. Enquiry Sheet + Apps Script deployment (ENQUIRY-SETUP.md steps 1–5), then set the
   `NEXT_PUBLIC_ENQUIRY_URL` repo variable and re-run the workflow. Redeploy `Code.gs` (new
   columns) first.
2. GitHub Pages settings + GoDaddy DNS (records in the WhatsApp message to Supriya, 15 Sep).
3. `public/products/partners/{millet-noodles,ragi-murukku,groundnut-oil}.webp` and
   `public/category-groups/partner-brands-4-product-card-group.webp` still show the dropped
   products — orphaned / stale artwork, delete or re-shoot.
4. Content the founders have not yet confirmed (§8 below still applies minus prices): "plant-based"
   wording vs honey/goat-milk/beeswax, bio-enzyme badge, packaging-concept photos, ingredient lists.
5. Analytics — deferred (ANSWERS §F30).

---

## 1. What this is
Premium natural home/skin/hair-care e-commerce site for **Surakshitam Naturals** (founders
**Srikanth & Supriya**, Hyderabad). It is a **high-fidelity, fully clickable PROTOTYPE**: all
flows work, but persistence is **browser localStorage** and external services are **mocked** behind
clean interfaces. Everything is structured so production = swapping mocks for real services, not a
rewrite.

**Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind v3. Server Components by default;
Client Components only where interactive. Self-hosted fonts (`@fontsource-variable`, Fraunces +
Inter). `next/image`. Design system "Botanical Laboratory": cream/forest/moss/clay palette in
`tailwind.config.ts`.

**Repos/dirs:**
- `surakshitam-web/` — the Next.js app (this folder).
- `surakshitam-docs/docs/` — architecture, admin workflows, roadmap, compliance.
- `surakshitam-backend/supabase/` — empty scaffolding for the intended Supabase backend.

---

## 2. How to run & verify
- **Run:** `cd surakshitam-web && npm run dev` → http://localhost:3000
- **Screenshots run only:** `SCREENSHOTS=1 npm run dev` → serves images unoptimised so they render
  instantly (the dev AVIF optimiser stalls under load). Normal runs/prod are unaffected.
- **Type-check (primary verification):** `npx tsc --noEmit` — must stay green.
- ⚠️ **Sandbox/agent note:** the agent environment **cannot run `next dev`** (the server is
  SIGKILLed and writes roll back). Verify code with `tsc` on a local copy; ask the user to run the
  dev server for anything visual/screenshots. The mounted repo also **blocks file deletes** (`rm`);
  use `mv` to relocate instead.

---

## 3. Demo credentials
- **Customer:** customers **self-register** (12 Sep 2026 — decision #42). Three entry points:
  `/login` is one card with three tabs — **Mobile OTP / Password / Register new**:
  - **Register new** — name + mobile (+ optional email/password), then OTP `1234` to confirm the
    number. `/register` opens the same card on this tab (so is `/login?method=register`).
  - **Mobile OTP** — a registered mobile signs straight in; an unknown mobile registers on the spot
    if a name is given (otherwise it points you to add a name / use the Register new tab).
  - **Password** — mobile, email or username + password.
  Seeded demo customer: mobile `9000000001` / username `democustomer` / password `demo123` (**Bhavesh
  Allapati**, `SN-CU-00001`). Every new customer gets the next `SN-CU-xxxxx`. Duplicate mobile/email is
  refused. Customers set/change their own password from Account → Security (per account now).
- **Founders (admin):** at **`/studio`** — `srikanthnaturals` or `supriyanaturals`, password `demo123`.
  Any signed-in founder can add/edit/remove admin accounts from **`/studio/team`** (see decision #20).

---

## 4. Prototype persistence model (localStorage keys)
All client-side. Each maps to a Supabase table in production.
- `sn-cart-v1` — cart lines `[{id, qty}]`.
- `sn-auth-v1` — customer session `{id(=10-digit mobile), mobile, name, email, method, loggedInAt}`.
- `sn-admin-v1` — founder session `{username, name}`, **now strictly validated against the live
  admin roster** (see decision #17 — no more "any truthy value" fallback).
- `sn-admin-team-v1` — admin roster overlay `{overrides:{username:AdminAccount}, removed:[username]}`
  on top of the two seed founder accounts (mirrors `sn-catalog-v1`'s pattern). Managed at
  `/studio/team`.
- `sn-users-v1` — **customer account registry** `[{id(=mobile), customerId, name, mobile, email,
  address, username?, password?, createdAt}]` (decision #42). Seeded with Bhavesh on first use; the
  old `sn-profile-v1` / `sn-customer-pw-v1` stores are imported once and removed. `password` is
  mock-obfuscated, **not a real hash** (decision #19).
- `sn-customer-seq-v1` — counter backing the next `customerId`.
- `sn-address-v1` — checkout address.
- `sn-orders-v1` — orders array (each has `userId`, price snapshots, `fulfillmentStatus`).
- `sn-notifications-v1` — WhatsApp messages `{audience:'customer'|'admin', to, template, message, archived}`.
- `sn-catalog-v1` — admin catalog overlay `{overrides:{id:Product}, hidden:[id]}`.
- `sn-stock-audit-v1` — per-product stock-change history (see decision #15).
- `sn-audit-v1` — activity events; `sn-visitor-v1` — anonymous per-browser id.
- `sn-offers-v1` — offer/coupon codes `[{id, code, description, type:'percent'|'flat', value,
  startDate, endDate, enabled, minOrderValue?}]` (decision #32).
- `sn-wishlist-v1` — wishlist product ids `string[]` (decision #33).
- `sn-bundles-v1` — combo/bundle kits `[{id, slug, name, description, image, productIds, price,
  enabled}]` (decision #35).
- `sn-offer-banner-dismissed` (**sessionStorage**, not localStorage) — dismissed-offer-code memory
  so the active-offer banner reappears on the next visit (decision #34).
- `sn-offers-nav-enabled-v1` — whether the "Offers" header/footer nav link is shown; absence of
  the key (fresh browser) means **enabled**, admin-toggleable from the Offers tab (decision #41).
- `sn-ingredients-v1` — admin ingredient-library overlay `{overrides:{slug:Ingredient}, hidden:[slug],
  custom:[Ingredient], groups:[string]}`, mirroring `sn-catalog-v1`'s pattern. Managed at Studio →
  Products → Ingredients. A matching `sn-ingredients-changed` window event lets open pages re-read it.
- `sn-rider-track-v1` / `sn-rider-ping` — last known rider position per order `{lat, lng, at}`,
  written by the rider's own browser from `/rider/[orderNumber]`. A ping older than 90s is treated as
  stale and the UI falls back to an estimated position.

---

## 5. Key files (where things live)
**lib/**
- `site.ts` — brand config, nav, contact. Email `surakshitamnatural@gmail.com`; socials: Instagram,
  Facebook (`profile.php?id=61580808786017`), YouTube (`@SurakshitamNaturals`).
- `catalog.ts` — seed products/categories (real packaging). `catalog-store.ts` — admin overlay
  (edit/add/hide/stock) on top of the seed.
- `types.ts` — `Product`, `Category`, `Ingredient`, `Review` (prices in **paise**).
- `orders.ts` — `Order` model (now incl. `courier`/`trackingNumber`, decision #22), `FULFILLMENT_FLOW`,
  `FULFILLMENT_LABEL` (shared status labels), `COURIER_OPTIONS`, `getOrdersForUser(id)` (matches
  userId OR phone). `updateOrderStatus()` now also logs `order_status_changed` centrally (see
  `admin.ts`/`audit.ts` note below) and accepts optional `{courier, trackingNumber}`.
- `payments.ts` — `PaymentProvider` + `mockPaymentProvider` (Razorpay swap point).
- `notifications.ts` — WhatsApp templates + `mockNotificationProvider`; `audience`/`to` per message;
  archive (never delete); `customerOrderStatus()` for status updates.
- `users.ts` — **customer account registry** (decision #42): `getAccounts`, `findAccount` (mobile /
  email / username), `registerAccount` (validation + uniqueness), `updateAccount`, `hasPassword` /
  `setPassword` / `verifyPassword`. This file *is* the Supabase Auth swap point.
- `auth.ts` — customer auth on top of `users.ts`: `register`, `loginWithOtp` (auto-registers an unknown
  mobile when a name is given), `loginWithPassword`, `isRegisteredMobile`, session, `DEMO_OTP`. All
  login/register calls return `AuthResult = {ok} | {ok:false, error}` so the UI shows the real reason.
  `updateSessionIdentity()` keeps the live session's name/email in sync after a profile edit (see
  decision #21); `hasCustomerPassword`/`setCustomerPassword`/`verifyCustomerPassword` act on the
  signed-in account (decision #19).
- `profile.ts` — now a thin view over the signed-in account in `users.ts` (`getProfile`/`saveProfile`
  keep their signatures; mobile is immutable because it is the id). Guests get an empty profile.
- `admin.ts` — founder auth; **`ADMIN_BASE = "/studio"`**; `getAdminAccounts()` (merged seed +
  `sn-admin-team-v1` roster), `saveAdminAccount`/`removeAdminAccount` (Team page), `getAdminSession`
  (now strict — decision #17).
- `profile.ts` — customer profile incl. `customerId` (decision #18); `getProfile()` self-heals older
  profiles missing an id.
- `audit.ts` — activity log (`logEvent`, `getAuditEvents`, `describeBrowser`, visitor id). Types now
  include `cart_remove`, `order_status_changed`, `payment_failed`, `profile_update`, `report_export`,
  `team_update`, `unauthorized_access` alongside the original
  `page_view`/`login`/`logout`/`cart_add`/`order_placed` (see decision #23 on why the Activity page
  treats `page_view` differently from the rest). `seedEvents()` — low-level bulk-insert used only by
  `demo-seed.ts` (decision #26).
- `demo-seed.ts` — **dev/demo-only** `seedDemoActivity()`, triggered by the "Load sample activity"
  button on `/studio/activity`. Populates ~9 days of realistic activity (named customer journeys,
  guest browsing, real orders via `createOrder`/`updateOrderStatus`, admin actions) using the same
  functions the real app uses — see decision #26. Never runs automatically.
- `catalog-store.ts` also now logs a **stock-change audit trail** (`sn-stock-audit-v1`) whenever
  `saveProduct`/`updateStock` change `stock` — `getStockHistory(productId)` reads it back.
  `decrementStockForOrder(items)` reduces stock for a placed order's line items, logged with actor
  "Order placed" instead of an admin name (decision #29).
- `cart/CartContext.tsx` — cart provider (logs `cart_add` and now `cart_remove`).
- `offers.ts` — offer/coupon CRUD (`getOffers`, `saveOffer`, `deleteOffer`, `blankOffer`), plus
  `isOfferLive(offer)` (enabled + within date range) and `applyOfferCode(code, subtotal)` →
  `{ok:true, offer, discount}` or `{ok:false, reason}` (decision #32).
- `promotions.ts` — `getHomePromotions()` aggregates live offers + live combos + any discounted
  product (mrp>price) into a single `PromoSlide[]` for the homepage carousel (decision #37).
- `print-label.ts` — `printShippingLabels(orders)`, opens a print window with one address label per
  order (same `window.open` + `window.print()` pattern as the Reports PDF export — no shipping-API
  integration needed; decision #31).
- `wishlist/WishlistContext.tsx` — wishlist provider, same reducer+localStorage-hydration shape as
  `cart/CartContext.tsx` but simpler (just an id set, no qty). `useWishlist()` → `{ids, items, count,
  has, toggle}` (decision #33).
- `bundles.ts` — combo/bundle CRUD (`getBundles`, `saveBundle`, `deleteBundle`, `blankBundle`,
  `getEnabledBundles`, `bundleRegularTotal`, `bundleSavings`) plus `getBundleDiscountForCart
  (cartProductIds)` which auto-detects when every component of a bundle is present in the cart and
  returns the discount to apply. **Bundles are not a separate cart-line type** — "Add combo to cart"
  just adds each component as a normal product line, so `decrementStockForOrder` and the rest of
  checkout/orders work unchanged; only the discount calculation is bundle-aware (decision #35).

**components/**
- `layout/OfferBanner.tsx` — site-wide banner surfacing the best live offer (`getLiveOffers()`),
  dismissible for the session via `sessionStorage` (decision #34). Mounted above `<Header>` in
  `AppShell.tsx`.
- `ui/WishlistButton.tsx` — heart-icon overlay button on `ProductCard`, bottom-right (opposite corner
  from `QuickViewButton`'s top-right) to avoid collision. `app/wishlist/page.tsx` lists saved items.
- `ui/ComboCard.tsx` / `app/combos/page.tsx` — storefront combo listing; "Add combo to cart" adds all
  component products, and `Checkout.tsx` auto-applies the bundle discount (on top of any coupon)
  once every component is in the cart.
- `admin/AdminCombos.tsx` — combo CRUD (name, description, price, enabled, multi-select product
  picker), nested as a third tab (Catalog / Offers / Combos) inside `AdminProducts.tsx` — same
  "avoid a new admin nav item" pattern as Offers (decision #35).
- `ui/FaqAccordion.tsx` / `app/faqs/page.tsx` — simple accordion FAQ page, linked from the footer
  Help section (decision #36).
- `home/PromoCarousel.tsx` — homepage section, mounted above `<Hero>` in `app/page.tsx`. Capped at
  `max-h-[20vh]` so it can never dominate the hero. Shows a **sliding window** of `PromoSlide`s
  (from `lib/promotions.ts`) — 1 on phones / 2 on small tablets / 3 on desktop / 4 on wide screens,
  responsive via a resize-listening hook — advancing by one every 5s (so with 10 offers: 1-2-3, then
  2-3-4, then 3-4-5, …). Left/right arrow buttons step manually; small clay-coloured dots (one per
  offer, inside the section) jump directly and double as a progress indicator; a pause/play toggle
  sits next to them. An `IntersectionObserver` stops the auto-advance timer once the section
  scrolls out of view, so it never runs invisibly. Each card leads with a large bold figure (the
  offer %/amount, combo savings, or product discount %) — that number is the point of the card, so
  it's the biggest text in it. Returns `null` entirely if there's nothing to promote (decision #37,
  redesigned 2026-08-18 — see #38).
- `home/InstagramFeed.tsx` — glides one reel left every ~3s (own `HOLD_MS`/`MOVE_MS` constants),
  using the same transform-track wrap technique as `PromoCarousel` rather than `scrollTo` — see
  decision #40. **Trade-off:** manual swipe/drag-scroll was removed to get the smooth glide; only
  auto-advance + click-to-open remain. Still pauses on hover and off-screen.
- `ui/OffersFab.tsx` — a larger floating button rendered as the **third item inside
  `FloatingContact.tsx`'s bottom-right stack** (below WhatsApp — not a separately-positioned
  button; see decision #40b). Opens a modal listing **every** live offer/combo/discounted
  product (not just the carousel's current window). Only renders when there's at least one
  promotion.
- `ui/PromoCardGrid.tsx` — the actual card grid, extracted out of `OffersFab` once the `/offers`
  page needed the identical grid too. Both consumers pass a `PromoSlide[]`; card copy/styling
  comes from `lib/promotions.ts`'s `promoCardContent`/`PROMO_TONE_BG`/`PROMO_TONE_TEXT` (decision
  #40), so `PromoCarousel`, `OffersFab`, and `/offers` never drift out of sync with each other.
- `lib/site-settings.ts` — `isOffersNavEnabled()`/`setOffersNavEnabled()`, a tiny localStorage
  toggle (default **on**) controlling whether "Offers" shows in the header/footer nav. Admin
  control lives at the top of the Offers tab (`AdminOffers.tsx`) as a checkbox (decision #41).
  `Header.tsx` reads it client-side on mount and filters `primaryNav` accordingly (both the
  desktop nav and the mobile drawer use the same filtered `nav` array).
- `app/offers/page.tsx` — unified Offers/Combos page (client component, tab switcher, `?tab=`
  query param sets the initial tab so e.g. a combo card can deep-link straight to the Combos
  tab). Offers tab lists every `getLiveOffers()` result as a card with a tap-to-copy code;
  Combos tab reuses `ComboCard`/`getEnabledBundles()` from the old `/combos` page. **`/combos` now
  redirects to `/offers?tab=combos`** rather than being deleted, so old links/bookmarks still
  resolve (decision #41).

**components/**
- `auth/AuthProvider.tsx` — **`useAuth()` context** (user, isLoggedIn, loginOtp, loginPassword,
  register, signOut, ready); cross-tab sync. `auth/LoginView.tsx` — one card, three tabs (Mobile OTP /
  Password / Register new; `initialMethod` prop or `?method=` pre-selects). `auth/RegisterForm.tsx` —
  the Register tab's form (details → OTP → account), embedded in the card, not a separate page design.
- `layout/AppShell.tsx` — renders storefront chrome for customer routes; **hides it on `/studio`**;
  logs `page_view` per navigation. `layout/Header.tsx` — shows **first name next to the account icon
  when logged in**. `layout/Footer.tsx` — address/email/socials (incl. YouTube); no admin link.
- `admin/AdminGate.tsx` — gate for `/studio/*`: founder-login / **customer→404 (NotFoundView)** /
  portal. Portal header now **mirrors the storefront** (decision #27): mobile hamburger + slide-out
  nav drawer, user icon showing the founder's name with a "Log out" dropdown (no more plain-text
  "Log out" nav item). Also logs `unauthorized_access` once per path when a signed-in customer hits
  `/studio` (decision #25). `AdminDashboard` (KPIs + recent orders + packing preview + low stock + a
  link into full Reports), `AdminOrders` (list, links to detail), `AdminOrderDetail` (status
  timeline/control + address/payment/items, at `/studio/orders/[orderNumber]`),
  `OrderStatusControl` (shared by both — status dropdown/advance, and a courier + tracking-number
  form that appears when marking an order Shipped; see decision #22), `AdminPacking` (aggregated
  "prepare N × Product" from CONFIRMED/PACKING orders, at `/studio/packing`), `AdminReports` (daily
  sales / product sales / order status tables, each exportable as CSV / PDF / email, at
  `/studio/reports`, now with a **date-range picker** — All time/Today/This week/This month/Custom —
  that filters all three tables, replacing separate daily/monthly report screens; decision #30),
  `AdminTeam` (add/edit/remove admin accounts, at `/studio/team` — any founder can manage the whole
  team), `AdminProducts` (now has **Catalog / Offers tabs** — Offers is `AdminOffers.tsx`, admin CRUD
  for coupon codes with a start/end duration, nested here instead of a new top-level nav item;
  decision #32), `AdminProductForm` (now shows per-product inventory audit history), `AdminActivity` (Recent activity table has column headings, friendly page/product
  names instead of raw URLs, **hides `page_view` events by default** — decision #23 — is now
  **paginated** (15/page), and has a **"Load sample activity"** demo-seeding button — decision #26),
  `DevNotifications`. All admin tables (Products/Team/Activity/Packing) now scroll horizontally on
  mobile instead of clipping — decision #28.
- `account/AccountView.tsx` — gated by `useAuth`; profile (incl. `customerId`) + a **Security**
  section (set/change password) + saved address + **their** orders + logout. Saving the profile now
  also calls `updateSessionIdentity()` so the header name updates immediately (decision #21).
- `checkout/Checkout.tsx` (+ `RazorpayMockModal.tsx`) — 4-step checkout; fires 2 WhatsApp messages;
  logs `order_placed`.
- `ui/NotFoundView.tsx` — friendly "No such page → back home" (used by `app/not-found.tsx` and by
  AdminGate for signed-in customers).

**app/** routes: `studio/{page,orders,orders/[orderNumber],packing,products,products/new,
products/[id],reports,team,activity,dev/notifications}`,
`account`, `login`, `cart`, `checkout`, `order/[orderNumber]`, `track-order`, `shop`,
`product/[slug]`, `ingredients`, `learn/{page,[slug]}`, `our-story`, `contact`, `policies/[slug]`,
`search`, `wishlist`, `offers`, `combos` (redirects), `faqs`, `rider/[orderNumber]`,
`studio/ingredients` (redirects into Products), `studio/ingredients/{new,[slug]}`, `not-found.tsx`.
`next.config.mjs` — `images.unoptimized` gated on `SCREENSHOTS=1`.

**Added in round 6** (see §7):
- `lib/weight.ts` — `parseSizeToGrams`, `productWeightGrams`, `parcelWeightGrams` (adds a 120 g
  packaging tare), `formatWeight`, `billableWeightGrams`. Weight is derived from the pack size when
  a product has no explicit `weightGrams`, so it degrades gracefully.
- `lib/delivery.ts` — `quoteDelivery()` plus the constants that encode the founders' rules
  (`FREE_DELIVERY_MIN` ₹699, `LOCAL_RADIUS_KM` 15, `LOCAL_DELIVERY_FEE` ₹49, `PER_KM_BEYOND_RADIUS`
  ₹8), `STORE_ORIGIN` (Nagole), a Hyderabad PIN table, and `BIKE_PARTNERS`. **An incomplete PIN
  quotes the local best case, not outstation** — quoting the worst case while someone is still
  typing reads as a price rise.
- `lib/rider-tracking.ts` — `pushRiderPing`, `getRiderPing`, `isPingFresh` (90 s), `subscribeRiderPings`,
  `haversineKm`.
- `lib/ingredient-store.ts` — admin overlay for the ingredient glossary, mirroring `catalog-store.ts`.
  `renameIngredientGroup` cascades across entries so a rename can't orphan anything.
- `components/ui/PromoTile.tsx` — the single promo card shared by the carousel and the offers pop-up,
  so the two cannot drift apart.
- `components/home/CategoryCards.tsx` — the four shelf cards in the hero.
- `components/ui/FallingBotanicals.tsx` — CSS-only botanicals; `components/ui/FallingFruitPhysics.tsx`
  — the 8-body solver. Both `aria-hidden`, `pointer-events-none`, off-screen-paused, and silenced by
  the global `prefers-reduced-motion` rule.
- `scripts/screenshot-seed.mjs` — the shared storefront seed used by both capture passes.

---

## 6. Key decisions & WHY (the reasoning to preserve)
1. **Mock provider interfaces** (`PaymentProvider`, `NotificationProvider`) + localStorage stores →
   the UI never changes when swapping to Razorpay / WhatsApp API / Supabase. Prototype stays
   self-contained and clickable with no backend.
2. **Storefront is server-rendered from the static `catalog.ts`** (SEO). Admin catalog edits live in
   localStorage and reflect on **admin screens only**; storefront reflection arrives with Supabase.
   This is the documented prototype boundary (SSR/SEO vs. on-device edits).
3. **`/admin` renamed to `/studio`** (constant `ADMIN_BASE`, folder `app/studio`, no public footer
   link) — reduces automated scanning. Explicitly noted: **obscurity ≠ security**; real protection is
   auth + (prod) rate-limiting/2FA/RBAC.
4. **Branded founder logins** (`srikanthnaturals`/`supriyanaturals`, not a generic `admin@`) so the
   audit log/greeting shows *who* acted.
5. **Signed-in customer visiting `/studio` gets a 404 "No such page"** (not "No access") — hides the
   admin area's existence from customers; consistent with the generic bad-URL 404. Any unknown URL
   (`/abc`) shows the same friendly screen with Back-to-home.
6. **`AuthProvider`/`useAuth` context** — fixed the bug where the header didn't "remember" login;
   state is shared app-wide, updates instantly, and syncs across tabs (storage event).
7. **Two login methods (mobile-OTP + username/password)** — OTP is the Indian D2C norm; password
   included per founder request. Supabase Auth supports both natively.
8. **Per-user orders** (`Order.userId` + phone match) — order history survives logout→login on the
   device, and guest orders show after signing in with the same number.
9. **Product Hide is a toggle** (not delete): seed products can only be hidden (always restorable),
   custom products can be deleted. Hidden stay in admin (Hidden filter), removed from storefront.
10. **Audit/analytics** — anonymous per-browser `visitorId`; tracks page views, cart adds (incl.
    guests), sign-ins/outs, orders. Privacy-conscious (no PII/precise location). Prod → PostHog/GA4/
    Supabase `audit_log` behind cookie consent (DPDP/GDPR).
11. **WhatsApp = two messages** per order: to the customer's number and to the founders' number
    (`site.whatsapp`); status changes send the customer an update; "Clear" **archives** (never deletes).
12. **Header shows the signed-in first name** next to the account icon (site-wide).
13. **Our Story hero collage enlarged** — tiles `aspect-[15/26]`, hero grid `lg:grid-cols-[2fr_3fr]`
    (≈+20% each dimension) per founder feedback.
14. **`images.unoptimized` behind `SCREENSHOTS=1`** — the dev image optimiser (AVIF) stalls under
    load, leaving blank images; the flag makes capture runs render instantly without touching
    normal/prod behaviour.
15. **Stock-audit log is a separate localStorage key (`sn-stock-audit-v1`), not folded into the
    general `sn-audit-v1` activity log** — inventory history needs to be queried per-product
    cheaply and kept even if the general activity log is cleared; `saveProduct`/`updateStock` in
    `catalog-store.ts` write to it whenever `stock` actually changes.
16. **Reports export as CSV, PDF, and email** — CSV via a client-built Blob download; PDF via a
    print-formatted popup window + `window.print()` (person saves as PDF — no PDF library needed,
    works offline); "Email report" opens a `mailto:` link addressed to `site.email` with the table
    as plain text. All three are genuinely functional with zero backend, matching the "mock
    provider" philosophy — production would likely keep CSV/PDF as-is and add a real transactional
    email send for "Email report".
17. **Fixed a real security hole in `lib/admin.ts` `getAdminSession()`** (2026-08-17): the old
    "legacy flag" fallback treated *any* non-empty, non-matching value under `sn-admin-v1` as a
    valid, generic `{username:"admin", name:"Admin"}` session — so stale/garbage localStorage data
    could grant full `/studio` access (bypassing the customer→404 gate) and always logged actions
    as "Admin" instead of the real founder. Fixed by requiring the stored `username` to match a
    real `ADMIN_ACCOUNTS` entry; anything else is now cleared and treated as signed-out. **If you
    saw `/studio` open under a customer login, or "Admin" instead of a founder name in Activity,
    clear `localStorage` (or just the `sn-admin-v1` key) in that browser** — old bad values won't
    self-heal, but no new ones can be created.
18. **Customer ID is a separate, friendly account number (`SN-CU-00001`), not the mobile number** —
    mobile stays the login/order-matching key (unchanged, keeps orders/tracking working), but
    customers wanted something that reads like a "real" account number. Generated once via a
    localStorage counter (`sn-customer-seq-v1`) and shown read-only on the account page; not
    editable.
19. **Customer self-service password** — set from Account → Security. Originally stored per-browser
    alongside a single profile; since decision #42 it is stored **per account** in `sn-users-v1`.
    Storage uses `obfuscate()` (base64), which is **explicitly not a real hash** — called out in code
    comments; production moves this entirely to Supabase Auth (server-side, hashed, never touches
    client code).
20. **No separate "Super Admin" role — any signed-in founder manages the whole team** from
    `/studio/team`, including adding new admins, and editing/removing others (can't remove yourself
    or the last remaining account). Matches reality: Srikanth and Supriya are equal co-founders
    today. `ADMIN_ACCOUNTS` (was a hardcoded array) became `getAdminAccounts()`, merging the two
    seed founders with a `sn-admin-team-v1` overlay — same overrides/removed pattern as
    `catalog-store.ts`, for consistency and reuse of the same mental model.
21. **`updateSessionIdentity()` fixes a real bug**: editing your name on the account page previously
    saved the profile store but never touched the live `sn-auth-v1` session, so the header (which
    reads the session, not the profile) kept showing the old name until next login. Account page
    saves now update both.
22. **Marking an order Shipped requires a courier (or "Handed over to customer") and, unless
    handed-over, a tracking number** — built as a shared `OrderStatusControl` component used by
    both `AdminOrders` (list) and `AdminOrderDetail`, so the two screens can't drift out of sync and
    the courier-capture step can't be skipped from either place. Courier/tracking are stored on the
    `Order` itself and surfaced to the customer on `/order/[orderNumber]`, `/track-order`, and in the
    WhatsApp "Shipped" message — a tracking number the customer never sees isn't worth capturing.
    `updateOrderStatus()` now also centrally logs `order_status_changed` (with from/to/courier) so
    every status change is captured regardless of which screen triggered it, instead of each screen
    remembering to call `logEvent` itself.
23. **Activity feed treats `page_view` as background noise, not the headline** — the founders
    reported the page felt like "viewing" rather than "activity." Business events (logins, cart
    adds/removes, orders, status changes, exports, profile/team edits) are the default view in
    "Recent activity"; a "Show page views" checkbox brings raw navigation back for when it's
    actually useful (e.g. debugging a confused visitor). Page-view-derived widgets (Sessions, Most
    viewed products, Guest cart interest) are unaffected — they're intentionally page-view-based and
    stay that way.
24. **Packing, Orders, Dashboard and Reports stay as four separate screens (not merged)** — each
    answers a different question an admin actually asks, at a different frequency:
    - **Dashboard** = "what needs attention *right now*" (glanced at every login; today-only KPIs).
    - **Orders** = "manage this specific order" (order-centric: address, payment, items, status).
    - **Packing** = "what do I physically need to prepare today" (product-centric aggregation across
      *all* pending orders — a warehouse/kitchen tool, not an order list).
    - **Reports** = "give me history/export for accounting or analysis" (date-range, CSV/PDF/email —
      a periodic, not daily, need).
    Merging any pair would force one mental model onto a task it doesn't fit (e.g. an order list
    can't answer "how many bottles of X do I need today" without the same aggregation Packing
    already does). Kept them separate but added light cross-links (Dashboard → Reports, Packing row
    → order detail) so navigation between them stays cheap.
25. **`unauthorized_access` is logged when a signed-in customer hits `/studio`** — decision #5 makes
    that path show a plain 404 to the customer (no "access denied" tell), but the founders still
    want to know it happened. Logged once per path visited (a `useEffect` keyed on
    `ready`/`customer`/`authed`/`pathname`, not on every render) so repeat visits to the same page
    don't spam the log.
26. **"Load sample activity" seeds data via the real app functions, not fake fixture JSON** —
    `demo-seed.ts` calls `createOrder`, `updateOrderStatus`, `saveAdminAccount`, and a new low-level
    `seedEvents()` bulk-insert (needed because `logEvent()` always stamps "now" + the current
    browser's visitor id, which can't simulate multiple visitors/days). This exists because the
    agent sandbox that built this feature **cannot run `next dev`** or drive a real browser, so
    there was no way to "click through" a demo login/checkout/admin flow directly — the seed button
    is the repeatable substitute, and it's genuinely useful for founder demos going forward. It
    creates real orders (so Orders/Packing/Reports/Dashboard populate too) and includes a named
    unauthorized-`/studio`-attempt example. Dev/demo-only; never runs automatically.
27. **Admin portal header rebuilt to mirror the storefront header** — it was a plain inline nav that
    didn't collapse on mobile (nav items just wrapped awkwardly) and logout was a text link sitting
    among nav items. Now: hamburger + slide-out drawer below `lg`, and a user icon (matching the
    storefront account icon) showing the founder's name that opens a small "Log out" dropdown,
    instead of a permanent text nav item. Reuses the exact same drawer/overlay pattern as
    `layout/Header.tsx` for consistency.
28. **Admin tables scroll on mobile instead of clipping; `ml-auto`-in-a-wrapping-row replaced with a
    bordered second row** — two related mobile bugs. (a) Products/Team/Activity/Packing tables sat
    directly inside an `overflow-hidden` rounded-border wrapper with no inner scroll container, so
    columns got squeezed/cut off on narrow screens instead of scrolling; fixed with an inner
    `overflow-x-auto` div. (b) The "Customer view" link in `AdminOrders`/`AdminOrderDetail` used
    `ml-auto` inside a `flex-wrap` row shared with the status control — when that row wrapped on
    mobile, `ml-auto` still pinned the link to the far right of its own line, leaving a large empty
    gap. Replaced with a second row under a thin `border-t` divider (stacked, not far-right-pinned).
29. **Stock decrements automatically on purchase, attributed to "Order placed" not an admin** —
    `createOrder()` now calls `decrementStockForOrder()` right after writing the order. Previously
    stock only changed via a manual admin edit, so a real sale didn't reduce inventory — a founder
    request (Srikanth, via friend feedback shared 2026-08-17). Logged to the existing stock-audit
    trail with a distinct actor label so it's visually distinguishable from a manual correction.
30. **Reports gets one date-range picker instead of separate daily/monthly report screens** —
    Today/This week/This month/Custom range filters all three existing tables (daily sales, product
    sales, order status) in place. Chosen over adding "Monthly report" and "Product-wise monthly
    report" as new pages/tabs specifically to avoid growing the admin nav — same request flagged
    "too many menus" as a concern, so existing screens got smarter instead of the menu getting longer.
31. **Shipping-label printing reuses the Reports PDF pattern (`window.open` + `window.print()`)**,
    not a shipping-carrier API — `lib/print-label.ts`'s `printShippingLabels(orders)` is shared by a
    single "Print label" button on Order Detail and a bulk "Print all labels" button on Packing.
    Kept as a lib function (not a component) since it has no UI of its own, only a side effect.
32. **Offers/coupons nested as a tab inside the existing Products page, not a new nav item** —
    same "too many menus" reasoning as #30. `AdminProducts.tsx` gained a Catalog/Offers tab switcher;
    `AdminOffers.tsx` is a self-contained CRUD list+form (mirrors `AdminTeam.tsx`'s pattern) for
    percent/flat discount codes with a start/end duration. Checkout gained a code field in the Review
    step (`lib/offers.ts`'s `applyOfferCode(code, subtotal)`); the resulting discount is stored on the
    order (`Order.discount`, `Order.offerCode`) so it survives in reports/order-detail even if the
    offer is later deleted. Prototype-only validation — production must re-check the code
    server-side before charging, never trust a client-computed discount.
33. **Wishlist gets its own context, not folded into cart** — `lib/wishlist/WishlistContext.tsx`
    mirrors `CartContext.tsx`'s reducer + localStorage-hydration shape but is deliberately simpler
    (an id set, no qty, no price math). Kept separate because a wishlist item isn't a purchase
    intent the way a cart line is — merging them would have forced qty/price fields onto something
    that doesn't need them.
34. **Active-offer banner dismissal uses `sessionStorage`, not `localStorage`** — so a customer who
    dismisses it still sees it again on their next visit (localStorage would hide it forever once
    dismissed, which defeats the point of a promo banner).
35. **Combos don't get a new cart-line type — they expand into normal product lines at add-to-cart
    time** — `lib/bundles.ts`'s `getBundleDiscountForCart(cartProductIds)` detects when every
    component of an enabled bundle is present in the cart and returns the discount to apply. This
    keeps `CartContext`, `Order.items`, and `decrementStockForOrder` completely unchanged — a combo
    purchase decrements each component's stock exactly like buying them separately would. The
    tradeoff: the discount only "activates" once literally all components are in the cart (by
    design — that's what makes it a combo rather than a blanket discount). Admin CRUD
    (`AdminCombos.tsx`) is nested as a third tab inside Products, same "avoid a new nav item"
    reasoning as #30/#32.
36. **"Founder's favourites" reuses the existing `featured` field instead of adding a new one** —
    the round-4 catalog already had `Product.featured` wired end-to-end (admin toggle, homepage
    section, shop sort, cross-sell). Baskin Nature's "founder favourites" section is functionally
    the same thing (a curated, admin-picked homepage row), so `components/home/FeaturedProducts.tsx`
    was relabeled rather than duplicating the schema — avoids two near-identical merchandising
    fields drifting out of sync.
37. **Homepage promo carousel and the Instagram strip both use a discrete "step every 10s" motion,
    not a continuous marquee** — user specifically wanted right-to-left movement that pauses
    between steps rather than scrolling continuously. `PromoCarousel.tsx` is new (built for this);
    `InstagramFeed.tsx`'s old `animate-marquee` CSS scroll was replaced with the same
    `setInterval`-driven `scrollTo` step so both carousels feel consistent. Both pause on hover.
    The promo carousel is populated by `lib/promotions.ts`, which folds together live offers, live
    combos, and any product currently on sale (mrp > price) into one slide list — and the whole
    section renders nothing if that list is empty, so it never shows an empty/dead carousel.
38. **Promo carousel redesigned from one-big-slide to a height-capped sliding window** — first
    version (#37) was a single large slide; follow-up feedback wanted it capped at ~20% viewport
    height so it can't compete with the Hero headline, with 3-4 compact cards visible at once
    (fewer on mobile), the offer figure in large type, manual arrows, and a pause control alongside
    the dots. Implemented as a modulo-indexed sliding window (`index, index+1, index+2, …`) rather
    than a true infinite-scroll transform track — simpler to reason about and sized this small, the
    difference is not visually detectable. Auto-advance is gated on both a manual pause toggle and
    an `IntersectionObserver` (`inView`), so scrolling the carousel off-screen stops the timer.
39. **Promo carousel moves with a real glide (1.8s), not an instant swap, then holds 8s** —
    follow-up feedback: the initial version replaced the visible cards outright each step, which
    read as an instant jump. Rebuilt as a genuine `translateX`-animated track holding **3 back-to-
    back copies** of the slide list (`tripled`), starting in the middle copy; stepping forward or
    back glides smoothly, and once the track has glided a full copy past either edge it snaps back
    to the equivalent spot in the middle copy with the CSS transition switched off for one frame
    (invisible, since it's the same content) — the standard "infinite carousel" trick, needed in
    both directions here since manual prev/next stepping is supported alongside autoplay. `1800ms`
    glide / `8000ms` hold, both easy to retune via the `MOVE_MS`/`HOLD_MS` constants at the top of
    `PromoCarousel.tsx`. Each card also gained a **product image on the left 40%** of the card
    (combos borrow their first component's photo, offer codes borrow any currently-discounted
    product's photo, falls back to `/products/placeholder.webp`), and the big discount figure was
    bumped to `text-2xl`/`text-3xl` extrabold so it's the clear focal point.
40. **Card-rendering logic (copy, tone colours) extracted into `lib/promotions.ts` so the carousel
    and the new "see all offers" floating button never drift apart** — `promoCardContent()`,
    `PROMO_TONE_BG`, `PROMO_TONE_TEXT` were pulled out of `PromoCarousel.tsx` (previously
    private to it) once a second consumer (`OffersFab.tsx`) needed identical card styling/copy.
    The Instagram strip was also converted from `scrollTo`-based "smooth" scrolling to the same
    transform-track glide technique as the promo carousel, per feedback that native smooth-scroll
    still read as an instant jump — this cost manual swipe-scrolling on the Instagram strip (now
    fully automated, same as the promo carousel), which is a known trade-off, not an oversight.
41. **Combos and Offers merged into one `/offers` page with a tab switcher, admin-toggleable nav
    link, default on.** Follow-up feedback: (a) `/combos` was only discoverable via the footer or
    a currently-live promo card — no header entry point, so it was invisible whenever nothing was
    live; (b) there was no page listing offer codes themselves, only the checkout coupon field;
    (c) wanted the header link itself to be admin-controllable. Resolved by replacing the header's
    "Combos" link with "Offers" → `/offers`, a new page with an Offers/Combos tab switcher
    (`?tab=combos` deep-links straight to the Combos tab, used by combo promo cards); the old
    `/combos` route now redirects there rather than being deleted, so no link breaks. Visibility
    of the "Offers" nav item is a new localStorage toggle (`lib/site-settings.ts`,
    `sn-offers-nav-enabled-v1`, **default true** — absence of the key means on), with the control
    living at the top of the Offers admin tab; `Header.tsx` filters `primaryNav` client-side based
    on it, applied identically to the desktop nav and mobile drawer. Deliberately did **not** make
    this a broader "site settings" page — one checkbox didn't warrant new IA.

42. **Customers self-register; accounts are a real multi-user registry (12 Sep 2026).** The
    prototype previously had one hard-coded demo credential and one profile per browser, so a
    second person on the same device overwrote the first. `lib/users.ts` now holds any number of
    accounts keyed by mobile (`sn-users-v1`), with `/register` (name + mobile, optional email and
    password, OTP confirmation), OTP login that auto-registers an unknown number when a name is
    supplied, and password login by mobile/email/username. Mobile is immutable (it is the id and
    the order-matching key); duplicate mobile/email is refused; the seeded Bhavesh account still
    works unchanged and existing per-browser profiles/passwords are migrated on first load. This
    was done so the founders can verify a real sign-up flow before the v2 (backend) build, where
    `users.ts` maps 1:1 onto Supabase Auth + a `customers` table. Registration is the third tab of
    the sign-in card rather than a separate page — one place to look, and the tab order (OTP /
    Password / Register new) reads as "existing customer first".

43. **Falling-fruit physics also runs behind the Shop shelf (12 Sep 2026).** `app/shop/page.tsx`
    wraps the product grid in a `relative overflow-hidden` section with `<BotanicalBackdrop />`
    behind it — the same leaves + reetha/amla/lemon solver as the homepage hero. It sits *behind*
    the cards, so the fruit is seen in the side margins and card gaps and piles up at 82% of the
    grid height, exactly as on the hero; the shop header stays compact (products still near the top).
    Zero cost when off-screen or with reduced motion — the solver already guards both.

44. **v2 homepage: full-bleed banner slideshow hero (branch `v2/full-screen-hero`, 12 Sep 2026).**
    `components/home/HeroSlideshow.tsx` replaces `Hero` on `app/page.tsx` (v1 `Hero.tsx` is kept
    untouched for side-by-side demos). Five banners from `public/banners/` (homepage range → skin →
    hair → home → ingredients; 1672×941 webp, ~1.3 MB total, `masters/` PNGs deliberately NOT
    copied in) crossfade every 3.8 s; every slide drifts continuously (zoom + pan, infinite-alternate `.sn-drift-a/b/c` in globals.css — no one-shot Ken-Burns that ends and freezes),
    dots + prev/next, pauses only while the cursor is over the controls — a whole-hero hover pause read as "stuck" (no hidden-tab guard — embedded previews report hidden even when shown), static frame under
    reduced-motion. Copy sits on the left over a light left→right scrim (the banners are bright
    cream, so the Green Energy Solutions dark scrim would fight them); headline/CTA change per slide
    using the lines from the banner pack README. Height is ~80 svh, **not** 100 — the featured
    strip peeks in so visitors know to scroll, plus an "Explore" hint. Leaves + the falling-fruit
    solver run over the photo (`FallingBotanicals` + `FallingFruitPhysics` directly, without the
    `BotanicalBackdrop` tile/washes, which would muddy a photo). The four shelf cards moved out of
    the hero into `components/home/CategoryStrip.tsx`, a one-row strip directly beneath it.
    Mobile note from the pack: subjects are centre-right, so `object-position: center right`.
    **Ingredients and Learn** use the same look with a single fixed banner via
    `components/ui/BannerIntro.tsx` (~55 svh, drift + physics + scrim; Ingredients → the ingredients
    banner, Learn → the Hyderabad workspace banner). `PageIntro` (v1 botanical wash) stays on the
    other pages. Remaining unused banners: our-story, personal-care, and the three product heroes.

---

## 7. Status by phase (see ROADMAP.md)
- **Phase 1 Foundation & storefront** ✅ — home (11 sections), shop (filter/sort), product, categories,
  ingredients, our-story, learn, contact, policies, search, SEO, a11y, images.
- **Phase 2 Discovery & cart** ✅ — cart store + drawer + full cart, search, quick view, cross-sell.
- **Phase 3 Checkout & payments** ✅ — 4-step checkout (contact/OTP → address → review → payment),
  mock Razorpay modal (success/failure), order success, order model w/ snapshots, guest checkout.
- **Phase 4 Accounts & post-purchase** ✅ — auth (OTP + password), account dashboard, my orders,
  order tracking, mock WhatsApp customer/admin messages + dev viewer.
- **Phase 5 Admin & operations** ✅ **100%** — `/studio` gated access, dashboard (KPIs + recent
  orders + packing preview + low stock), orders list + status workflow, **admin order-detail page**
  (`/studio/orders/[orderNumber]`, status timeline/control, address/payment/items), **daily packing
  list** (`/studio/packing` + dashboard widget — aggregates CONFIRMED/PACKING order items into
  "prepare N × Product"), **reports export as CSV/PDF/email** (`/studio/reports` — daily sales,
  product sales, order status; see decision #16), product/inventory management with **inventory
  audit history** (stock-change log in `catalog-store.ts` → `sn-stock-audit-v1`, shown on the
  product edit page), low-stock, analytics/insights (Activity page — now with column headings and
  friendly page/product names instead of raw URLs).
- **Post-Phase-5 hardening & self-service (2026-08-17)** ✅ — fixed a real security hole where a
  stale `sn-admin-v1` value could grant `/studio` access under a customer login and mislabel Activity
  as generic "Admin" (decision #17); **admin team management** at `/studio/team` — any founder can
  add/edit/remove admin accounts (decision #20); **customer self-service**: friendly `customerId`
  (decision #18), Account → Security password set/change (decision #19), and a fix so editing your
  name on the account page now updates the header immediately (decision #21).
- **Post-Phase-5 round 2: shipping + activity taxonomy (2026-08-17)** ✅ — **courier + tracking
  number** captured when marking an order Shipped, shown to the customer on order/tracking pages and
  in the WhatsApp update (decision #22); **Activity feed now leads with business events**
  (logins, cart adds/removes, orders, status changes, exports, profile/team edits) instead of raw
  page views, which are now opt-in via a checkbox (decision #23); **Dashboard/Orders/Packing/Reports
  deliberately kept as four separate screens** with light cross-links rather than merged (decision
  #24).
- **Post-Phase-5 round 3: unauthorized-access tracking, demo seeding, mobile polish (2026-08-17)**
  ✅ — `unauthorized_access` events for signed-in customers hitting `/studio` (decision #25);
  **"Load sample activity"** demo-data button + paginated (15/page) Recent Activity table (decision
  #26); **admin portal header rebuilt to mirror the storefront** — mobile drawer + user-icon logout
  dropdown (decision #27); **mobile table/list fixes** — horizontal-scrolling tables instead of
  clipping, and a bordered second row instead of `ml-auto` gaps in order cards (decision #28).
- **Post-Phase-5 round 4: founder-feedback build (2026-08-17)** ✅ — triaged a feature-request list
  a friend of Srikanth's sent after reviewing screenshots; implemented the four items that don't
  require a new external account (see decisions #29-32): **automatic stock decrement on purchase**,
  a **Reports date-range picker** (replacing separate daily/monthly report ideas), **shipping-label
  printing** (Order Detail + bulk from Packing), and **offers/coupon codes** (admin CRUD nested under
  Products, applied at checkout). Two other requested items — real payment gateway and real WhatsApp
  Business API — remain intentionally mocked; both need Srikanth to set up real third-party accounts
  first (Razorpay merchant account; a WhatsApp Business API provider like Meta direct or
  Gupshup/Twilio) before "real" integration is even possible.
- **Post-Phase-5 round 5: storefront features benchmarked against baskinnature.in (2026-08-18)** ✅
  — all 7 items implemented (see decisions #33-36; award/press badges intentionally excluded, no
  awards yet): real **click-to-call + click-to-WhatsApp header links**; **wishlist** (heart icon on
  product cards, `/wishlist` page, header icon+count); **active-offer banner** (auto-shows the best
  live offer, session-dismissible); **FAQs page**; **"Founder's favourites" relabel** of the existing
  admin-toggleable Featured homepage section (no schema duplication — `featured` already did this
  job); **combos/bundle kits** (`/combos` page, admin CRUD nested under Products, auto-applied
  discount at checkout, no cart/order schema changes needed); **shop-by-concern navigation**
  (`concerns` tag array on `Product`, admin-editable, `/shop?concern=X` filter alongside the
  existing category chips).
- **Post-Phase-5 round 6: founder change requests + brand look (2026-08-22 → 2026-09-04)** ✅ —
  a long batch driven by Srikanth's feedback and by the arrival of real product photography.
  **Storefront logic:** category-aware "shop by concern" (Home Care no longer showed skin/hair tags);
  automatic **parcel weight** on every cart change (`lib/weight.ts`, always labelled approximate);
  **delivery pricing rules** (`lib/delivery.ts` — free over ₹699 in-city, ₹49 below, ₹8/km beyond
  15 km from the Nagole kitchen, weight-based courier outstation, distance from a Hyderabad PIN
  table); an always-on **free-delivery offer**; **bike delivery as the default dispatch mode** with
  rider name/mobile/vehicle/ETA captured at dispatch and three tracking paths (partner trip link,
  our own rider link using browser Geolocation with no app install, or an estimate from dispatch
  time — labelled as such); **sign-out moved into the header user-icon menu**; Home Care split into
  **Bio-Enzyme / General** shelves; a **Partner Brands** shelf for resold goods (renamed from
  `pantry`) that deliberately shows the partner's brand and never ours.
  **Catalog & content:** all Surakshitam product imagery replaced from
  `public/surakshitam-product-images/` driven by `product-image-manifest.json`; the **9 photographed
  but unlisted reel-set products** added (catalog now 42 — 38 own-brand + 4 partner); the
  **ingredient library grown 16 → 34** by auditing every `keyIngredients` string, and made
  **admin-editable** (`lib/ingredient-store.ts`, Studio → Products → Ingredients).
  **Look & feel:** the offers carousel **moved off the homepage to `/offers`**; carousel and pop-up
  unified onto **one shared card** (`components/ui/PromoTile.tsx`) whose square image panel gives
  0% crop at every breakpoint; the top offer strip **switched off entirely** (`SHOW_OFFER_BANNER`
  / `SHOW_COUPON_BANNER` — kept as a future feature, not deleted); **falling botanicals** — a
  CSS-only wind-drift layer (1.5 KB gzipped, 0 KB JS) plus a hand-written 8-body physics layer for
  reetha/amla/lemon halves; and the homepage hero rebuilt as **copy left, four shelf cards right in
  a staggered 2×2**, which absorbed and deleted the old `Categories.tsx` section.
  **Housekeeping:** three image `masters/` folders (168 MB) moved out of `public/` into
  `surakshitam-docs/source-assets/` — inside the web root they would have shipped to production and
  been publicly downloadable; `public/` went 46 MB → 19 MB.

- **Phase 6 Production hardening** ❌ — Supabase (Postgres + auth), real Razorpay + WhatsApp Business
  API (server secrets, idempotent webhooks), image uploads (Supabase Storage), Instagram Graph token,
  CMS, rate-limiting/2FA/security headers/monitoring/backups, cookie-consent banner + privacy
  (DPDP/IT-Act/GDPR — see COMPLIANCE.md), legal policies, GST/tax, shipping integration, hosting.

---

## 8. Open decisions — these need Srikanth & Supriya, not code
Nothing below is a bug. Each is a **claim, a price or a photograph that only the founders can
confirm**, and each is currently sitting in the codebase as a marked placeholder. Collected here so
a fresh session doesn't have to rediscover them.

| # | What needs deciding | Where it lives |
|---|---|---|
| 0 | **Hosting / backend platform** — narrowed 2026-09-14 to serverless on AWS / Azure / Google (11 numbered options; VPS, Supabase, Vercel, Cloudflare dropped). Database family and cold-start tolerance still open. Decision pending with Hara + founders before Phase 6. | `surakshitam-docs/docs/hosting/SERVERLESS-SHORTLIST.md`; full record `HOSTING-RESEARCH-2026-09-12.md` §15 |
| 1 | **Every price** is demo. | `lib/catalog.ts` — comment at line ~38 |
| 2 | **8 products show `referenceStatus: packaging-concept`** — the pack in the photo is a concept, not the real pack. Either shoot the real pack or accept the concept. | `product-image-manifest.json` |
| 3 | The **9 reel-set products** (aloe/charcoal/coffee/goat-milk/honey/manjista/red-wine/sandal soaps + henna) carry demo price, size, copy **and ingredient lists**. | `lib/catalog.ts` |
| 4 | **Which home-care SKUs are genuinely bio-enzyme** — 3 are tagged, and the badge is a product claim. | `lib/catalog.ts#BIO_ENZYME_PRODUCTS` |
| 5 | **Partner-brand names and prices are invented placeholders**, with unbranded sample artwork. Real brands need real permission. | `lib/catalog.ts` category `partner-brands` |
| 6 | **"Plant-based" is used in 28 places, but honey, goat milk and beeswax are animal-derived.** Either the wording changes or those products do. | site-wide copy |
| 7 | Reviews, editorial articles, the Our Story quote and policy timelines are all **flagged demo content**. | `lib/reviews.ts`, `lib/articles.ts`, `app/our-story/page.tsx:176`, `app/policies/` |
| 8 | **Category card photography** — the current square group shots get their sides trimmed by the 4:5 hero crop. Purpose-made 4:5 images (products in the upper ~70%, calm lower third for the text overlay) were agreed but not yet generated. | `public/category-groups/` |

## 9. Known risks carried knowingly
- **Rider mobile numbers are shown in full** on the customer's tracking page, and the rider link
  carries **no expiry or signature** — anyone with the URL can post a position. Both need a signed,
  expiring token before go-live.
- **Admin and customer passwords sit in localStorage in plain or mock-obfuscated form.** Demo-only,
  flagged in code; replaced wholesale by Supabase auth in Phase 6.
- Distance is a **PIN-code lookup table**, not a maps API, so delivery pricing is approximate
  outside the PINs listed.

## 10. Remaining work — recommended order

> **Hosting direction changed 2026-09-12:** Phase 6 is **not Supabase**. Two candidate directions, decision pending: (a) own backend on a VPS — Hostinger KVM 2 Mumbai, ₹9,051/yr with coupon; (b) **serverless go-live** — Cloudflare Workers + D1 (₹524/mo flat) or Azure Container Apps + Cosmos (₹31 → ₹520/mo) or AWS Lambda + DynamoDB (₹114/mo now); **Update 2026-09-14:** shortlist narrowed to AWS / Azure / Google serverless only — VPS, Supabase, Vercel and Cloudflare removed; see `surakshitam-docs/docs/hosting/SERVERLESS-SHORTLIST.md` (11 numbered options). Database: Postgres not mandatory — SQLite family via Drizzle behind a repository layer recommended. **Full record: `surakshitam-docs/docs/hosting/HOSTING-RESEARCH-2026-09-12.md`** (+ two HTML comparison pages beside it). Backup scripts (Postgres flavour) in `surakshitam-backend/ops/`.
**Phases 1–5 and post-Phase-5 rounds 1–6 are complete** (see §7). Next up:

1. **Founder sign-off on §8** — cheapest possible step, and it unblocks real content everywhere.
2. **Fresh category-card images** (§8 #8), then the slide/background image set.
3. **Phase 6 backend swaps:** Supabase (auth + tables + RLS) → point `lib/*` accessors at it;
   Razorpay live + server-side verification; WhatsApp Business API; Supabase Storage for image
   uploads; signed rider tokens; cookie-consent banner; hosting on Vercel.
4. **Legal/GST/shipping** and the COMPLIANCE.md checklist.

Razorpay and WhatsApp both need **Srikanth to open real third-party accounts first** — they cannot
be "really" integrated before that exists.

## 11. Deliverables already produced
- Screenshots for founder review: `outputs/SurakshitamNaturals-Screenshots/`, one folder each for
  Desktop-Shopping-Cart / Desktop-Admin-Portal / Mobile-Shopping-Cart / Mobile-Admin-Portal.
  Regenerate all four via `node scripts/capture-all.mjs` (needs `SCREENSHOTS=1 npm run dev` +
  Playwright), or run one script standalone, e.g. `node scripts/capture-storefront-desktop.mjs`.
  Shared seed data for both storefront passes lives in `scripts/screenshot-seed.mjs`; the burnt-in
  label is positioned by `WATERMARK_BOTTOM` in `scripts/screenshot-utils.mjs`.
  **The screenshots are stale** — they predate round 6, so none of the new delivery, tracking,
  ingredient-admin, partner-brand or hero work appears in them. The user runs these, not Claude.
- `status.html` + `REGISTRY.md` in the parent folder — the founder-facing status page and the
  developer lookup table. Regenerate both together after a round of changes.

## 12. Housekeeping
- Switch dev back to plain `npm run dev` (drop `SCREENSHOTS=1`) for normal work.
- `outputs/_trash-old-loose-screenshots/` can be emptied.
- `scripts/capture-screenshots.mjs` is the **superseded** single-script capture (56 shots / 12
  folders), replaced by the 4-script setup. Dead — safe to delete.
- **5 `scripts/*.mjs.bak` files** are edit leftovers. Safe to delete.
- **24 files in `public/products/*.webp` (1.8 MB) are the old pre-photography renders** and are no
  longer referenced. Awaiting a delete decision.
- `surakshitam-backend/` and `surakshitam-docs/` are **still not git repositories** — only
  `surakshitam-web/` is initialised, and it currently has ~92 uncommitted files.

---

## 13. Tech stack — plain-language guide, alternatives & switch cost (written for a Python reader)

You don't need to become a web developer to make decisions about this project. Here's what it's
built on, why, and what your other options are — with honest time estimates.

**What each piece does, in Python terms:**
- **Next.js** — the web framework running the whole thing. Rough analogue: Django's routing +
  templates + production server + build tooling, bundled together, but for JavaScript.
- **React** — the UI library Next.js sits on. You write "components": functions that return
  markup, similar to a Python function returning an HTML string — except React re-runs a
  component automatically when its data changes and updates *only* the part of the page that
  changed, no full reload. That's what makes the cart drawer, quick view, and status dropdowns
  feel instant.
- **TypeScript** — JavaScript with type hints that are *enforced*, not just suggested. Similar
  spirit to Python type hints + mypy, except stricter and non-optional here — `tsc` (see earlier
  note) is the main way changes get verified without a live browser.
- **Tailwind CSS** — instead of separate `.css` files with invented class names, small pre-defined
  utility classes go directly in the markup (`text-sm font-semibold text-forest`). Faster and more
  consistent once familiar; looks noisy at first glance.
- **localStorage** (today's "database") — a small key-value store built into the browser, scoped
  to one device. Everything (orders, cart, admin accounts) lives here today — this is *why* it's a
  prototype. A real launch needs a real database (Phase 6).

**Why this specific stack:** it's the dominant choice for e-commerce UIs right now — the reference
implementations most people copy from (Vercel Commerce, Shopify Hydrogen, Medusa's storefront) use
this exact combination — it has the deepest AI-assistance/tutorial coverage of any web stack
(fastest to build and fix with AI help), and it deploys to Vercel with production-grade performance
with near-zero configuration.

**Effort spent so far:** roughly **96 productive core hours** of focused build time went into
everything described in this document — every storefront page, checkout, accounts, and the full
admin operations suite (Phases 1–5 plus the post-Phase-5 rounds above). That number matters for the
comparison below: it's mostly *decision-making* time (what should "packing list" aggregate? what
happens when you mark something Shipped? what should the activity log actually show?), not typing
time — and any rewrite, in any language, inherits those decisions for free. What it does *not*
inherit is the working code itself.

**If you wanted to switch stacks — options and rough hours from here:**

| Path | What changes | Rough hours | Best if... |
|---|---|---|---|
| **Stay here, do Phase 6** (recommended) | Swap localStorage → Supabase (Postgres), Razorpay live, WhatsApp Business API, real hosting | ~40–70 hrs | You want the fastest path to an actual launch; someone is willing to touch JS/TS for backend wiring only |
| **Hybrid: keep this frontend, Python backend** (Django or FastAPI + Postgres, instead of Supabase) | Same UI/UX customers and founders already tested; the API/database layer becomes Python you can read and maintain yourself | ~55–90 hrs | You want to personally own and extend the backend long-term, without losing this UI |
| **Full rewrite, Python-only** (Django + HTMX/Alpine, server-rendered) | Every page rebuilt as Django views/templates; JS interactivity (cart drawer, quick view, live status updates) becomes optional "sprinkles" via HTMX instead of built-in | ~100–160 hrs | You want zero JavaScript/React in the codebase and are OK with a slightly more page-refresh-y feel (HTMX narrows this a lot, but doesn't erase it) |
| **Adopt Saleor** (open-source, Python/Django/GraphQL commerce engine) | Don't build commerce logic from scratch — install Saleor, then rebuild *this project's specific admin workflow* (packing list, courier tracking, team management, activity log) on top of it, since Saleor's own admin doesn't have these | ~60–100 hrs, but you inherit a production-grade, actively-maintained core (security, scaling) for free going forward | You want a serious commerce backend and don't mind Saleor's opinions about how orders/inventory work |

All estimates assume someone reasonably comfortable in the target stack already — roughly double
them if learning that stack from scratch while building. None of these numbers include real
content work (final copy, product photography, legal/GST setup, courier account setup) — that
effort is roughly the same regardless of which stack you pick.

**Honest recommendation:** given 96 hours are already invested in a stack that works end-to-end
and matches what most production e-commerce sites run on, the fastest, lowest-risk path to an
actual launch is Phase 6 on the current stack (top row) — most of that remaining work is
configuration and integration (payment keys, WhatsApp API tokens, hosting setup), not deep coding,
even if you personally never touch the JS/TS. The Python-backend hybrid (second row) is the more
attractive option if your real goal is long-term personal maintainability rather than fastest
launch — you'd treat the frontend as "done" and only need to read/write Python afterward. A full
Python-only rewrite (third row) or adopting Saleor (fourth row) make sense mainly if owning 100% of
the code in a language you already know outweighs time-to-launch as a priority.
