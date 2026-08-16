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

## Demo credentials

- **Customer:** mobile + OTP login — any 10-digit mobile, OTP `1234` (any 4–6 digits works). Use
  `9849116181` (blank name) to load as the seeded customer Bhavesh Allapati. Password login also
  works: username `bhavesh`, password `demo123`.
- **Founders (admin):** sign in at **`/studio`** — username `srikanthnaturals` or
  `supriyanaturals`, password `demo123`.

## Tech stack

- **Next.js 14** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS** with a small, tokenised design system (`tailwind.config.ts`)
- **Server Components by default**; Client Components only where interaction requires it
- **Self-hosted fonts** via `@fontsource-variable` (Fraunces + Inter)
- Optimised **WebP** product imagery via `next/image`

## What's included

**Storefront** — home, shop (filters/sort), product detail, ingredients, our story, learn,
contact, policies, search, cart (drawer + full page), quick view, cross-sell.

**Checkout & accounts** — 4-step checkout (contact/OTP → address → review → mock Razorpay
payment), guest checkout, order confirmation, customer account dashboard, order history and
tracking, mock WhatsApp order/status notifications.

**Admin ("Studio")**, at `/studio`, founder-only:
- Dashboard — KPIs, recent orders, packing preview, low stock
- Orders — list with fulfilment-status workflow, and a per-order detail page
  (`/studio/orders/[orderNumber]`)
- Packing list (`/studio/packing`) — aggregates pending orders into "prepare N × Product"
- Reports (`/studio/reports`) — daily sales, product sales, order-status breakdown, each
  exportable as CSV
- Products — catalogue/inventory management, with a per-product stock-change audit history
- Activity — anonymised visitor/admin activity log
- Notifications — viewer for simulated WhatsApp messages

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
                             #   activity, dev/notifications
  ingredients/ our-story/ learn/ contact/ policies/[slug]/ search/ track-order/
components/
  layout/                   # AppShell, Header, Footer (hides storefront chrome on /studio)
  home/                     # homepage sections
  ui/                       # reusable primitives (Button, ProductCard, NotFoundView, ...)
  auth/ account/ cart/ checkout/ search/  # feature components
  admin/                    # AdminGate, AdminDashboard, AdminOrders, AdminOrderDetail,
                             #   AdminPacking, AdminReports, AdminProducts, AdminProductForm,
                             #   AdminActivity, DevNotifications
lib/
  catalog.ts catalog-store.ts   # seed catalogue + admin overlay (localStorage)
  orders.ts payments.ts notifications.ts   # order model, mock Razorpay, mock WhatsApp
  auth.ts admin.ts audit.ts profile.ts     # customer/admin auth, activity log
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
