# Surakshitam Naturals — Feature Overview

A quick summary of what the website and admin portal can do today.

## Storefront (customer-facing)

Home, shop with filters/sort, product pages, category pages (home care / skin care / hair care),
ingredients glossary, our story, learn articles, search, contact, and policy pages — fully
responsive on mobile, tablet, and laptop.

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
- **Offers/coupons** — new tab under Products: create discount codes (percentage or flat amount),
  set a start/end date so they turn on and off automatically, optional minimum order value
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
