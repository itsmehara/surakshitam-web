# Surakshitam Naturals — Feature Overview

A quick summary of what the website and admin portal can do today.

## Storefront (customer-facing)

Home, shop with filters/sort, "shop by concern" browsing (dry skin, dandruff, hair fall, etc.
alongside the usual categories), product pages, category pages (home care / skin care / hair
care), ingredients glossary, our story, learn articles, FAQs, search, contact, and policy pages —
fully responsive on mobile, tablet, and laptop.

- **Wishlist** — heart icon on every product card, saved on the customer's device, own page at
  `/wishlist`
- **Offers & Combos page** — one page (`/offers`) with a tab switch between live discount codes
  (tap to copy) and combo kits; a floating "Offers" button (bottom-right, below the WhatsApp
  button) opens the same list from anywhere on the site
- **Combo kits** — bundles of 2+ products sold together at a special price; adding one to cart
  adds the individual products, so stock still tracks correctly per product
- **Homepage promo strip** — a compact, auto-advancing row of whatever's currently live (offers,
  combos, discounted products), plus a slim banner near the top when there's an active code
- **Real click-to-call and WhatsApp links** in the header, not just the admin notification viewer

## Cart & checkout

- Cart drawer and full cart page
- 4-step checkout: mobile OTP → address → review → payment
- Guest checkout allowed
- Offer/coupon code entry at checkout with automatic discount
- Order confirmation page
- Order tracking, including courier name and tracking number once shipped

## Customer account

- Mobile OTP or password login
- Editable profile: name, email, address, password
- A unique customer ID
- Order history
- WhatsApp-style order and status notifications (currently simulated, not sent for real yet)

## Admin portal ("Studio")

- **Dashboard** — key numbers, recent orders, packing preview, low stock alert
- **Orders** — full list with status workflow: Order received → Order in packing → Packed →
  Dispatched → Delivered, with courier + tracking number capture when marking an order Dispatched
- **Packing list** — automatically aggregates what needs preparing today across pending orders,
  plus a "print all shipping labels" button
- **Order detail page** — full breakdown per order, with its own "print shipping label" button
- **Products & inventory** — add/edit/hide products, manage stock, full stock-change history log;
  stock now reduces automatically when a customer buys (previously manual only)
- **Offers/coupons** — a tab under Products: create discount codes (percentage or flat amount),
  set a start/end date so they turn on and off automatically, optional minimum order value; a
  checkbox on this tab turns the "Offers" nav link, floating button, banner and homepage strip
  on or off site-wide (on by default)
- **Combos** — another tab under Products: bundle 2 or more products at a special price; the
  discount applies automatically at checkout once every product in the combo is in the cart
- **Reports** — daily sales, product sales, order status, now with a date filter (Today / This
  Week / This Month / Custom range) so any period can be pulled, not just daily — exportable as
  CSV, PDF, or straight to email
- **Team management** — any founder can add, edit, or remove admin logins, no code changes needed
- **Activity log** — tracks logins, orders, status changes, exports, and flags anyone trying to
  access the admin area without permission
- **Notifications viewer** — see every simulated WhatsApp message that would have been sent

## What's real vs. simulated right now

Everything above works end-to-end and is fully clickable, but two things are intentionally still
"demo mode" until ready to go live:

- **Payments** — currently a mock Razorpay flow; no real money moves
- **WhatsApp messages** — currently logged internally, not actually delivered

Turning either of these on for real just needs a Razorpay merchant account and a WhatsApp Business
API provider (Meta directly, or a provider like Gupshup/Twilio) — no rebuild required, just
plugging in real credentials.
