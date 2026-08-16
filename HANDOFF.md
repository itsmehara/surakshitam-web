# Surakshitam Naturals — Project Handoff & State

Single source of truth for continuing this project in a fresh chat. Read this first; you rarely
need to re-read the whole codebase. Complements `../surakshitam-docs/docs/`
(`ARCHITECTURE.md`, `ADMIN_WORKFLOWS.md`, `ROADMAP.md`, `COMPLIANCE.md`).

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
- **Customer:** mobile + OTP. Any 10-digit mobile; OTP `1234` (any 4–6 digits accepted). Use mobile
  `9849116181` (with blank name) to appear as the seeded **Bhavesh Allapati**. Also password login:
  username `bhavesh`, password `demo123`.
- **Founders (admin):** at **`/studio`** — `srikanthnaturals` or `supriyanaturals`, password `demo123`.

---

## 4. Prototype persistence model (localStorage keys)
All client-side. Each maps to a Supabase table in production.
- `sn-cart-v1` — cart lines `[{id, qty}]`.
- `sn-auth-v1` — customer session `{id(=10-digit mobile), mobile, name, email, method, loggedInAt}`.
- `sn-admin-v1` — founder session `{username, name}` (legacy "1" tolerated).
- `sn-profile-v1` — customer profile `{name, mobile, email, address}`.
- `sn-address-v1` — checkout address.
- `sn-orders-v1` — orders array (each has `userId`, price snapshots, `fulfillmentStatus`).
- `sn-notifications-v1` — WhatsApp messages `{audience:'customer'|'admin', to, template, message, archived}`.
- `sn-catalog-v1` — admin catalog overlay `{overrides:{id:Product}, hidden:[id]}`.
- `sn-audit-v1` — activity events; `sn-visitor-v1` — anonymous per-browser id.

---

## 5. Key files (where things live)
**lib/**
- `site.ts` — brand config, nav, contact. Email `surakshitamnatural@gmail.com`; socials: Instagram,
  Facebook (`profile.php?id=61580808786017`), YouTube (`@SurakshitamNaturals`).
- `catalog.ts` — seed products/categories (real packaging). `catalog-store.ts` — admin overlay
  (edit/add/hide/stock) on top of the seed.
- `types.ts` — `Product`, `Category`, `Ingredient`, `Review` (prices in **paise**).
- `orders.ts` — `Order` model, `FULFILLMENT_FLOW`, `getOrdersForUser(id)` (matches userId OR phone).
- `payments.ts` — `PaymentProvider` + `mockPaymentProvider` (Razorpay swap point).
- `notifications.ts` — WhatsApp templates + `mockNotificationProvider`; `audience`/`to` per message;
  archive (never delete); `customerOrderStatus()` for status updates.
- `auth.ts` — customer auth: `loginWithOtp`, `loginWithPassword`, session, `DEMO_OTP`.
- `admin.ts` — founder auth; **`ADMIN_BASE = "/studio"`**; `ADMIN_ACCOUNTS`; `getAdminSession`.
- `audit.ts` — activity log (`logEvent`, `getAuditEvents`, `describeBrowser`, visitor id).
- `catalog-store.ts` also now logs a **stock-change audit trail** (`sn-stock-audit-v1`) whenever
  `saveProduct`/`updateStock` change `stock` — `getStockHistory(productId)` reads it back.
- `cart/CartContext.tsx` — cart provider (logs `cart_add`).

**components/**
- `auth/AuthProvider.tsx` — **`useAuth()` context** (user, isLoggedIn, loginOtp, loginPassword,
  signOut, ready); cross-tab sync. `auth/LoginView.tsx` — tabbed OTP/password login.
- `layout/AppShell.tsx` — renders storefront chrome for customer routes; **hides it on `/studio`**;
  logs `page_view` per navigation. `layout/Header.tsx` — shows **first name next to the account icon
  when logged in**. `layout/Footer.tsx` — address/email/socials (incl. YouTube); no admin link.
- `admin/AdminGate.tsx` — gate for `/studio/*`: founder-login / **customer→404 (NotFoundView)** /
  portal (greets by name); nav now includes Packing + Reports. `AdminDashboard` (KPIs + recent
  orders + packing preview + low stock), `AdminOrders` (list, links to detail), `AdminOrderDetail`
  (status timeline/control + address/payment/items, at `/studio/orders/[orderNumber]`),
  `AdminPacking` (aggregated "prepare N × Product" from CONFIRMED/PACKING orders, at
  `/studio/packing`), `AdminReports` (daily sales / product sales / order status tables + CSV
  export, at `/studio/reports`), `AdminProducts`, `AdminProductForm` (now shows per-product
  inventory audit history), `AdminActivity`, `DevNotifications`.
- `account/AccountView.tsx` — gated by `useAuth`; profile + saved address + **their** orders + logout.
- `checkout/Checkout.tsx` (+ `RazorpayMockModal.tsx`) — 4-step checkout; fires 2 WhatsApp messages;
  logs `order_placed`.
- `ui/NotFoundView.tsx` — friendly "No such page → back home" (used by `app/not-found.tsx` and by
  AdminGate for signed-in customers).

**app/** routes: `studio/{page,orders,orders/[orderNumber],packing,products,products/new,
products/[id],reports,activity,dev/notifications}`,
`account`, `login`, `cart`, `checkout`, `order/[orderNumber]`, `track-order`, `shop`,
`product/[slug]`, `ingredients`, `learn/{page,[slug]}`, `our-story`, `contact`, `policies/[slug]`,
`search`, `not-found.tsx`. `next.config.mjs` — `images.unoptimized` gated on `SCREENSHOTS=1`.

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
  "prepare N × Product"), **reports + CSV export** (`/studio/reports` — daily sales, product sales,
  order status; client-side CSV download), product/inventory management with **inventory audit
  history** (stock-change log in `catalog-store.ts` → `sn-stock-audit-v1`, shown on the product edit
  page), low-stock, analytics/insights (Activity page).
- **Phase 6 Production hardening** ❌ — Supabase (Postgres + auth), real Razorpay + WhatsApp Business
  API (server secrets, idempotent webhooks), image uploads (Supabase Storage), Instagram Graph token,
  CMS, rate-limiting/2FA/security headers/monitoring/backups, cookie-consent banner + privacy
  (DPDP/IT-Act/GDPR — see COMPLIANCE.md), legal policies, GST/tax, shipping integration, hosting.

---

## 8. Remaining work — recommended order
**Phase 5 is complete.** Next up:

**Phase 6 to go live (backend swaps):**
Supabase (auth + tables + RLS) → point `lib/*` accessors at it; Razorpay live + server verify;
WhatsApp Business API; Supabase Storage uploads; consent banner; hosting on Vercel; then real content
(founder photos, verified copy/prices/claims, real reviews) and legal/GST/shipping.

---

## 9. Deliverables already produced
- Screenshots for founder review: `outputs/SurakshitamNaturals-Screenshots/` — 56 shots across 12
  numbered folders (01-Home … 12-Access-and-404). Regenerate via
  `surakshitam-web/scripts/capture-screenshots.mjs` (needs `SCREENSHOTS=1 npm run dev` + Playwright).

## 10. Housekeeping
- Switch dev back to plain `npm run dev` (drop `SCREENSHOTS=1`) for normal work.
- `outputs/_trash-old-loose-screenshots/` can be emptied.
