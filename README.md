# Surakshitam Naturals

A premium, natural home-care and personal-care e-commerce storefront for **Surakshitam Naturals**,
founded by Srikanth and Supriya (Hyderabad). This is a **high-fidelity, fully clickable
prototype**: every customer and admin flow works end-to-end, but persistence is browser
**localStorage** and external services (payments, WhatsApp) are **mocked** behind clean provider
interfaces — so production is a backend swap, not a rewrite.

Design direction: **Botanical Laboratory** — warm ivory, restrained botanical green, a muted clay
accent and editorial typography. Calm, research-led and trustworthy.

> **For full project state, decisions, file map, demo credentials and remaining work, see
> [`HANDOFF.md`](./HANDOFF.md) — that is the single source of truth.** This README only covers
> local setup.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Other scripts:

```bash
npm run build              # production build
npm run start               # serve the production build
npx tsc --noEmit             # type-check (primary verification — must stay green)
npm run lint                 # next lint
SCREENSHOTS=1 npm run dev    # dev server with unoptimised images, for screenshot capture
```

### Screenshot capture scripts

With `SCREENSHOTS=1 npm run dev` running, `npm i -D playwright && npx playwright install chromium`,
run everything in one go:

```bash
node scripts/capture-all.mjs
```

This produces four separate folders under `SurakshitamNaturals-Screenshots/`:
`Desktop-Shopping-Cart/`, `Mobile-Shopping-Cart/`, `Desktop-Admin-Portal/`, `Mobile-Admin-Portal/`.
Each pass can also be run on its own if you only need to redo one folder:

```bash
node scripts/capture-storefront-desktop.mjs
node scripts/capture-storefront-mobile.mjs
node scripts/capture-admin-desktop.mjs
node scripts/capture-admin-mobile.mjs
```

Every image is numbered, framed, and watermarked (`001-<section>-<feature>.png`, ...) — the
watermark text always matches the filename. Shared logic lives in `scripts/screenshot-utils.mjs`.
The watermark is drawn as a real DOM element in the browser before each screenshot (not composited
afterwards with sharp/SVG) — some prebuilt sharp/libvips binaries silently drop SVG `<text>` when
fontconfig isn't linked in, so text is rendered by Chromium itself instead, which always works. The
outer dark border is still added afterwards with sharp (a pure image op, unaffected by that issue).
The two admin passes seed realistic sample orders + activity **before** capturing anything and wait
for the seed to actually land in localStorage (not a fixed timeout), so Packing/Orders/Dashboard show
real pending orders rather than empty states.

The two storefront passes give every page 15 seconds to settle (lazy-loaded images,
scroll-reveal animations) before the first shot, and scroll long/animated pages top-to-bottom in
even steps rather than 2-3 fixed positions: **Home** gets 12 shots, **Our Story** 7, **Ingredients**
6, Learn index/article 3+2 — everywhere else stays 1-4 shots per screen/state as appropriate.
Mobile passes use a "regular" phone-sized viewport (360×780, 1x scale) matching common Android
widths and iPhone mini/SE — not an oversized modern iPhone.

Once the four screenshot folders exist, combine each into a shareable PDF:

```bash
npm i -D pdf-lib   # one-time
node scripts/build-pdfs.mjs
```

This produces `SurakshitamNaturals-Screenshots/PDFs/Desktop-Shopping-Cart.pdf`,
`Desktop-Admin-Portal.pdf`, `Mobile-Shopping-Cart.pdf`, and `Mobile-Admin-Portal.pdf` — one PNG per
page, in filename order, each page sized to match its screenshot exactly.

## Demo credentials

- **Customer:** mobile + OTP login — any 10-digit mobile, OTP `1234` (any 4–6 digits works). Use
  `9849116181` (blank name) to load as the seeded customer Bhavesh Allapati. Password login also
  works: username `bhavesh`, password `demo123`. Customers can also set/change their own password
  from Account → Security.
- **Founders (admin):** sign in at **`/studio`** — username `srikanthnaturals` or
  `supriyanaturals`, password `demo123`. Any signed-in founder can add/edit/remove admin accounts
  from `/studio/team`.

## Tech stack

- **Next.js 14** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS** with a small, tokenised design system (`tailwind.config.ts`)
- **Server Components by default**; Client Components only where interaction requires it
- **Self-hosted fonts** via `@fontsource-variable` (Fraunces + Inter)
- Optimised **WebP** product imagery via `next/image`

**New to web dev / coming from Python?** `HANDOFF.md` §11 explains each piece in plain language
(with Python analogies), why this stack was chosen, and — if you'd rather rewrite parts of this in
Python (Django/FastAPI, or the Python-based Saleor commerce engine) — a comparison table with
rough hours for each path, benchmarked against the ~72 core hours already spent building this
prototype in the current stack.

## What's included

**Storefront** — home, shop (filters/sort), product detail, ingredients, our story, learn,
contact, policies, search, cart (drawer + full page), quick view, cross-sell.

**Checkout & accounts** — 4-step checkout (contact/OTP → address → review → mock Razorpay
payment), guest checkout, order confirmation, customer account dashboard (incl. a friendly
`SN-CU-#####` customer ID and self-service password), order history and tracking (incl. courier +
tracking number once shipped), mock WhatsApp order/status notifications.

**Admin ("Studio")**, at `/studio`, founder-only — responsive header (mobile drawer nav, user-icon
logout, matches the storefront header):
- Dashboard — KPIs, recent orders, packing preview, low stock, link into full Reports
- Orders — list with fulfilment-status workflow, and a per-order detail page
  (`/studio/orders/[orderNumber]`). Marking an order Shipped requires a courier (or "Handed over to
  customer") and a tracking number.
- Packing list (`/studio/packing`) — aggregates pending orders into "prepare N × Product"
- Reports (`/studio/reports`) — daily sales, product sales, order-status breakdown, each
  exportable as CSV, PDF, or email
- Team (`/studio/team`) — add/edit/remove admin accounts; any signed-in founder can manage the team
- Products — catalogue/inventory management, with a per-product stock-change audit history
- Activity — business-event-first activity log (logins, orders, status changes, exports,
  unauthorized `/studio` attempts, ...), paginated, with a "Load sample activity" demo-data button
- Notifications — viewer for simulated WhatsApp messages

All of the above — storefront, checkout, accounts, and the full admin portal — is fully responsive
and has been designed and verified on **both desktop and mobile** screen sizes, not just desktop.

**SEO & performance** — per-page metadata, OpenGraph, `sitemap.xml`, `robots.txt`,
JSON-LD (Organization + Product), semantic HTML, accessible focus states and skip link.

## Project structure

```
app/                       # routes (App Router)
  layout.tsx                # shell: fonts, metadata
  page.tsx                  # homepage
  shop/ product/[slug]/     # catalogue + product detail
  cart/ checkout/           # cart + 4-step checkout
  account/ login/           # customer auth + account dashboard
  order/[orderNumber]/      # order confirmation / tracking
  studio/                   # admin ("Studio"): dashboard, orders, orders/[orderNumber],
                             #   packing, products, products/[id], products/new, reports,
                             #   team, activity, dev/notifications
  ingredients/ our-story/ learn/ contact/ policies/[slug]/ search/ track-order/
components/
  layout/                   # AppShell, Header, Footer (hides storefront chrome on /studio)
  home/                     # homepage sections
  ui/                       # reusable primitives (Button, ProductCard, NotFoundView, ...)
  auth/ account/ cart/ checkout/ search/  # feature components
  admin/                    # AdminGate, AdminDashboard, AdminOrders, AdminOrderDetail,
                             #   OrderStatusControl, AdminPacking, AdminReports, AdminTeam,
                             #   AdminProducts, AdminProductForm, AdminActivity, DevNotifications
lib/
  catalog.ts catalog-store.ts   # seed catalogue + admin overlay (localStorage)
  orders.ts payments.ts notifications.ts   # order model, mock Razorpay, mock WhatsApp
  auth.ts admin.ts audit.ts profile.ts     # customer/admin auth, activity log
  demo-seed.ts                  # dev-only: seeds realistic Activity/order sample data
  types.ts format.ts site.ts cn.ts
public/products/ public/story/ public/reels/
```

## Important notes

- **This is a prototype.** All persistence is localStorage; payments and WhatsApp are mocked
  behind swappable provider interfaces. See `HANDOFF.md` §4 for the full localStorage key map and
  §6 for the reasoning behind each architectural decision.
- **Sandbox/agent note:** `next dev` cannot run inside the coding-agent sandbox (gets killed) —
  verify changes with `npx tsc --noEmit` and run the dev server yourself for anything visual.
- Product **names and imagery are read from the actual packaging** supplied in `Products/`.
- No exaggerated health, safety or "chemical-free" claims are made (per brand guidelines).
- See `../surakshitam-docs/docs/ARCHITECTURE.md`, `ADMIN_WORKFLOWS.md`, `ROADMAP.md` and
  `COMPLIANCE.md` for deeper detail on architecture, admin workflows, the phased roadmap and
  DPDP/GDPR compliance planning.
