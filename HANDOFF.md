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
  username `bhavesh`, password `demo123`. Customers can also **set/change their own password** from
  Account → Security (self-service, separate from the seeded demo credential — see decision #19).
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
- `sn-profile-v1` — customer profile `{customerId, name, mobile, email, address}`. `customerId` is a
  friendly account number like `SN-CU-00001`, generated once (see decision #18).
- `sn-customer-seq-v1` — counter backing the next `customerId`.
- `sn-customer-pw-v1` — customer's self-service password (mock-obfuscated, **not a real hash** — see
  decision #19), set from Account → Security.
- `sn-address-v1` — checkout address.
- `sn-orders-v1` — orders array (each has `userId`, price snapshots, `fulfillmentStatus`).
- `sn-notifications-v1` — WhatsApp messages `{audience:'customer'|'admin', to, template, message, archived}`.
- `sn-catalog-v1` — admin catalog overlay `{overrides:{id:Product}, hidden:[id]}`.
- `sn-stock-audit-v1` — per-product stock-change history (see decision #15).
- `sn-audit-v1` — activity events; `sn-visitor-v1` — anonymous per-browser id.

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
- `auth.ts` — customer auth: `loginWithOtp`, `loginWithPassword`, session, `DEMO_OTP`;
  `updateSessionIdentity()` keeps the live session's name/email in sync after a profile edit (see
  decision #21); `hasCustomerPassword`/`setCustomerPassword`/`verifyCustomerPassword` for
  self-service password (decision #19).
- `admin.ts` — founder auth; **`ADMIN_BASE = "/studio"`**; `getAdminAccounts()` (merged seed +
  `sn-admin-team-v1` roster), `saveAdminAccount`/`removeAdminAccount` (Team page), `getAdminSession`
  (now strict — decision #17).
- `profile.ts` — customer profile incl. `customerId` (decision #18); `getProfile()` self-heals older
  profiles missing an id.
- `audit.ts` — activity log (`logEvent`, `getAuditEvents`, `describeBrowser`, visitor id). Types now
  include `cart_remove`, `order_status_changed`, `payment_failed`, `profile_update`, `report_export`,
  `team_update` alongside the original `page_view`/`login`/`logout`/`cart_add`/`order_placed` (see
  decision #23 on why the Activity page treats `page_view` differently from the rest).
- `catalog-store.ts` also now logs a **stock-change audit trail** (`sn-stock-audit-v1`) whenever
  `saveProduct`/`updateStock` change `stock` — `getStockHistory(productId)` reads it back.
- `cart/CartContext.tsx` — cart provider (logs `cart_add` and now `cart_remove`).

**components/**
- `auth/AuthProvider.tsx` — **`useAuth()` context** (user, isLoggedIn, loginOtp, loginPassword,
  signOut, ready); cross-tab sync. `auth/LoginView.tsx` — tabbed OTP/password login.
- `layout/AppShell.tsx` — renders storefront chrome for customer routes; **hides it on `/studio`**;
  logs `page_view` per navigation. `layout/Header.tsx` — shows **first name next to the account icon
  when logged in**. `layout/Footer.tsx` — address/email/socials (incl. YouTube); no admin link.
- `admin/AdminGate.tsx` — gate for `/studio/*`: founder-login / **customer→404 (NotFoundView)** /
  portal (greets by name); nav includes Packing, Reports, Team. `AdminDashboard` (KPIs + recent
  orders + packing preview + low stock + a link into full Reports), `AdminOrders` (list, links to
  detail), `AdminOrderDetail` (status timeline/control + address/payment/items, at
  `/studio/orders/[orderNumber]`), `OrderStatusControl` (shared by both — status dropdown/advance,
  and a courier + tracking-number form that appears when marking an order Shipped; see decision
  #22), `AdminPacking` (aggregated "prepare N × Product" from CONFIRMED/PACKING orders, at
  `/studio/packing`), `AdminReports` (daily sales / product sales / order status tables, each
  exportable as CSV / PDF / email, at `/studio/reports`), `AdminTeam` (add/edit/remove admin
  accounts, at `/studio/team` — any founder can manage the whole team), `AdminProducts`,
  `AdminProductForm` (now shows per-product inventory audit history), `AdminActivity` (Recent
  activity table now has column headings, friendly page/product names instead of raw URLs, and
  **hides `page_view` events by default** — see decision #23), `DevNotifications`.
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
19. **Customer self-service password lives alongside the profile, not per-account** — this
    prototype keeps **one customer profile per browser** (see `profile.ts`), so a password set in
    Account → Security is checked against whichever profile is currently active on that device, not
    a real multi-user password table. `loginWithPassword` checks the original seeded demo
    credential first, then this self-service password. Storage uses `obfuscate()` (base64), which is
    **explicitly not a real hash** — called out in code comments; production moves this entirely to
    Supabase Auth (server-side, hashed, never touches client code).
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
