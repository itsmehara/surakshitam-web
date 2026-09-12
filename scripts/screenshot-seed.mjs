/**
 * Shared demo data for the two storefront screenshot passes.
 *
 * Both passes used to carry their own copy of this (cart, profile, orders,
 * offers, bundles, wishlist). Keeping two copies in sync by hand is how the
 * desktop and mobile sets quietly drift apart, so it lives here once.
 *
 * A note on timestamps: the live-delivery screens are time-sensitive. The ETA
 * counts down from `dispatchedAt`, and a rider location only reads as "live"
 * while its ping is under 90s old (see lib/rider-tracking.ts). Both are
 * therefore computed at seed time, not hard-coded — and because
 * `addInitScript` re-runs on every navigation, they stay fresh for the whole
 * run rather than going stale after the first page.
 */

/** The order used for the confirmation screen — packed, going by courier. */
export const ORDER_COURIER = "SURK-2026-482913";
/** The order used for live tracking — dispatched on a bike, with a rider. */
export const ORDER_BIKE = "SURK-2026-517044";

const CART = [
  { id: "p-shea-butter-soap", qty: 1 },
  { id: "p-hair-oil", qty: 2 },
  { id: "p-dishwash-liquid", qty: 1 },
];

/** A cart over ₹699, so the free-delivery offer is shown as unlocked. */
export const CART_FREE_DELIVERY = [
  { id: "p-groundnut-oil", qty: 2 },
  { id: "p-hair-serum", qty: 1 },
];

const PROFILE = {
  name: "Bhavesh Allapati",
  mobile: "+91 98491 16181",
  email: "srikanth.alapati@yahoo.com",
  address: "Nagole, Hyderabad, Telangana – 500068",
};

const AUTH = {
  id: "9849116181",
  mobile: "+91 98491 16181",
  name: "Bhavesh Allapati",
  email: "srikanth.alapati@yahoo.com",
  method: "otp",
  loggedInAt: "2026-08-16T11:00:00.000Z",
};

const ADDR = {
  fullName: "Bhavesh Allapati",
  phone: "9849116181",
  altPhone: "",
  line1: "Nagole",
  line2: "",
  landmark: "",
  city: "Hyderabad",
  state: "Telangana",
  postalCode: "500068",
  type: "Home",
};

const ORDERS = [
  {
    orderNumber: ORDER_BIKE,
    createdAt: "2026-08-22T06:40:00.000Z",
    userId: "9849116181",
    items: [
      { productId: "p-dishwash-liquid", slug: "natural-dishwash-liquid", nameSnapshot: "Natural Dishwash Liquid", skuSnapshot: "SN-HC-DWL-500", priceSnapshot: 19900, qty: 1, image: "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-01-listing-front-clean.webp", size: "500 ml" },
      { productId: "p-floor-cleaner", slug: "natural-floor-cleaner", nameSnapshot: "Natural Floor Cleaner", skuSnapshot: "SN-HC-FLC-500", priceSnapshot: 21900, qty: 1, image: "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-01-listing-front-clean.webp", size: "500 ml" },
      { productId: "p-wheat-noodles", slug: "homemade-wheat-noodles", nameSnapshot: "Homemade Wheat Noodles", skuSnapshot: "AK-PN-WNL-250", priceSnapshot: 9900, qty: 1, image: "/products/partners/wheat-noodles.webp", size: "250 g" },
    ],
    subtotal: 51700,
    shipping: 4900,
    total: 56600,
    weightGrams: 1400,
    deliveryQuote: { zone: "local", distanceKm: 5, area: "Dilsukhnagar", baseFee: 4900, distanceSurcharge: 0, freeApplied: false },
    address: { fullName: "Bhavesh Allapati", phone: "9849116181", line1: "Flat 301, Sai Residency", line2: "Road No 13", city: "Hyderabad", state: "Telangana", postalCode: "500060", type: "Home" },
    paymentStatus: "PAID",
    paymentId: "pay_demo_b7c2e1f9d3",
    fulfillmentStatus: "SHIPPED",
    deliveryMode: "bike",
    courier: "Rapido",
    rider: { name: "Ramesh K", phone: "9701234567", vehicleNumber: "TS09 EK 4412" },
    etaMinutes: 35,
    // dispatchedAt is filled in at seed time — see the note at the top.
  },
  {
    orderNumber: ORDER_COURIER,
    createdAt: "2026-08-16T11:13:09.373Z",
    userId: "9849116181",
    items: [
      { productId: "p-shea-butter-soap", slug: "shea-butter-soap", nameSnapshot: "Shea Butter Soap", skuSnapshot: "SN-SC-SHS-100", priceSnapshot: 14900, qty: 1, image: "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-01-listing-front-clean.webp", size: "100 g" },
      { productId: "p-hair-oil", slug: "hair-oil", nameSnapshot: "Hair Oil", skuSnapshot: "SN-HR-OIL-100", priceSnapshot: 24900, qty: 2, image: "/surakshitam-product-images/hair-oil/hair-oil-01-listing-front-clean.webp", size: "100 ml" },
    ],
    subtotal: 64700,
    shipping: 0,
    total: 64700,
    weightGrams: 424,
    deliveryQuote: { zone: "local", distanceKm: 1, area: "Nagole", baseFee: 0, distanceSurcharge: 0, freeApplied: true },
    address: { fullName: "Bhavesh Allapati", phone: "9849116181", line1: "Nagole", city: "Hyderabad", state: "Telangana", postalCode: "500068", type: "Home" },
    paymentStatus: "PAID",
    paymentId: "pay_demo_a1b2c3d4e5",
    fulfillmentStatus: "PACKED",
    deliveryMode: "courier",
    courier: "Delhivery",
    trackingNumber: "DL4821093765",
  },
];

const OFFERS = [
  { id: "off_demo1", code: "WELCOME10", description: "10% off your first order", type: "percent", value: 10, startDate: "2026-08-01", endDate: "2026-12-31", enabled: true },
];

const BUNDLES = [
  { id: "bundle_demo1", slug: "daily-essentials-kit", name: "Daily Essentials Kit", description: "Our shea butter soap, hair oil and dishwash liquid, together at a special price.", image: "", productIds: ["p-shea-butter-soap", "p-hair-oil", "p-dishwash-liquid"], price: 55000, enabled: true },
];

const WISHLIST = ["p-rose-face-wash", "p-hair-serum"];

/** Roughly halfway between the kitchen and the Dilsukhnagar drop address. */
const RIDER_POSITION = { lat: 17.3676, lng: 78.542, accuracy: 12 };

const j = (value) => JSON.stringify(JSON.stringify(value));

/**
 * Builds the init script for a storefront context.
 *
 * @param {object}  opts
 * @param {boolean} opts.customer  signed in (true) or browsing as a guest (false)
 * @param {Array}   opts.cart      cart lines; defaults to the standard 3-item cart
 * @param {boolean} opts.riderLive seed a fresh rider ping so tracking reads as live
 */
export function storefrontSeedScript({ customer = false, cart = CART, riderLive = true } = {}) {
  return `try{
    localStorage.setItem('sn-cart-v1', ${j(cart)});
    localStorage.setItem('sn-profile-v1', ${j(PROFILE)});
    localStorage.setItem('sn-address-v1', ${j(ADDR)});
    localStorage.setItem('sn-offers-v1', ${j(OFFERS)});
    localStorage.setItem('sn-bundles-v1', ${j(BUNDLES)});
    localStorage.setItem('sn-wishlist-v1', ${j(WISHLIST)});
    localStorage.setItem('sn-visitor-v1', 'v_demo12ab');

    var orders = ${j(ORDERS)};
    orders = JSON.parse(orders);
    // Dispatched 10 minutes ago against a 35-minute ETA — far enough along the
    // route to be visibly moving, far enough out to still show time remaining.
    orders[0].dispatchedAt = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    localStorage.setItem('sn-orders-v1', JSON.stringify(orders));

    ${
      riderLive
        ? `localStorage.setItem('sn-rider-track-v1', JSON.stringify({
             ${JSON.stringify(ORDER_BIKE)}: [{
               orderNumber: ${JSON.stringify(ORDER_BIKE)},
               lat: ${RIDER_POSITION.lat}, lng: ${RIDER_POSITION.lng},
               accuracy: ${RIDER_POSITION.accuracy},
               at: new Date().toISOString()
             }]
           }));`
        : `localStorage.removeItem('sn-rider-track-v1');`
    }

    ${customer ? `localStorage.setItem('sn-auth-v1', ${j(AUTH)});` : `localStorage.removeItem('sn-auth-v1');`}
  }catch(e){}`;
}
