# Surakshitam Naturals

A premium, natural home-care and personal-care storefront for **Surakshitam Naturals**,
founded by Srikanth and Supriya. This is the **production foundation + clickable homepage**
built for a founder demo — the first phase of a larger e-commerce build.

Design direction: **Botanical Laboratory** — warm ivory, restrained botanical green, a muted clay
accent and editorial typography. Calm, research-led and trustworthy.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```

## Tech stack

- **Next.js 14** (App Router) with **React 18** and **TypeScript**
- **Tailwind CSS** with a small, tokenised design system (`tailwind.config.ts`)
- **Server Components by default**; Client Components only where interaction requires it
  (header drawer, add-to-cart stepper, newsletter and contact forms)
- **Self-hosted fonts** via `@fontsource-variable` (Fraunces + Inter) — no external requests,
  works offline for the demo
- Optimised **WebP** product imagery via `next/image`

## What's included

**Homepage** — Header, Hero, Categories, Featured Products, Why Choose Us,
Ingredient Benefits, Best Sellers, Sustainability, Reviews, Newsletter, Footer.

**Navigable pages for the demo** — Shop (with working category filters + sorting),
Product detail (dynamic, with schema.org data), Ingredients, Our Story, Learn, Contact,
Cart (empty state), plus lightweight placeholders for Search, Account, Track Order and Policies.

**SEO & performance** — per-page metadata, OpenGraph, `sitemap.xml`, `robots.txt`,
JSON-LD (Organization + Product), semantic HTML, accessible focus states and skip link.

## Project structure

```
app/                 # routes (App Router)
  layout.tsx         # shell: fonts, metadata, header/footer
  page.tsx           # homepage
  shop/              # catalogue with filter + sort
  product/[slug]/    # product detail
  ...                # ingredients, our-story, learn, contact, cart, policies, etc.
  sitemap.ts robots.ts
components/
  layout/            # Header, Footer
  home/              # homepage sections
  ui/                # reusable primitives (Button, ProductCard, Section, ...)
  contact/           # contact form
lib/
  catalog.ts         # products + categories (single source of truth)
  ingredients.ts reviews.ts site.ts types.ts format.ts cn.ts
public/products/     # optimised product images
docs/                # architecture & roadmap
```

## Important notes

- **All content is demo/placeholder.** Prices, ratings, stock, reviews and copy are
  fictional and clearly marked for replacement. See `lib/catalog.ts` (`DEMO PRICE — REPLACE`).
- Product **names are read from the actual packaging** supplied in `Products/`.
- No exaggerated health, safety or "chemical-free" claims are made (per brand guidelines).
- See `docs/ARCHITECTURE.md` for the scalability plan (cart, checkout, accounts, admin, CMS)
  and `docs/ROADMAP.md` for what comes next.
```
