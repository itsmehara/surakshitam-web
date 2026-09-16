import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:3000';
const OUT = '/sessions/tender-clever-brown/mnt/outputs/SN-review-screenshots';
fs.mkdirSync(OUT, { recursive: true });

const ORDER = '[{"orderNumber":"SURK-2026-482913","createdAt":"2026-08-16T11:13:09.373Z","items":[{"productId":"p-shea-butter-soap","slug":"shea-butter-soap","nameSnapshot":"Shea Butter Soap","skuSnapshot":"SN-SC-SHS-100","priceSnapshot":14900,"qty":1,"image":"/products/shea-butter-soap.webp","size":"100 g"},{"productId":"p-hair-oil","slug":"hair-oil","nameSnapshot":"Hair Oil","skuSnapshot":"SN-HR-OIL-100","priceSnapshot":24900,"qty":2,"image":"/products/hair-oil.webp","size":"100 ml"}],"subtotal":64700,"shipping":0,"total":64700,"address":{"fullName":"Demo Customer","phone":"9000000001","line1":"Nagole","city":"Hyderabad","state":"Telangana","postalCode":"500068","type":"Home"},"paymentStatus":"PAID","paymentId":"pay_demo_a1b2c3d4e5","fulfillmentStatus":"PACKED"}]';
const NOTIFS = '[{"id":"ntf_1","channel":"whatsapp","recipient":"9000000001","template":"customer_order_placed","status":"sent","createdAt":"2026-08-16T11:13:09.375Z","message":"Hi Demo Customer, thank you for ordering from Surakshitam Naturals 🌿\\n\\nOrder: SURK-2026-482913\\nAmount: ₹647\\n\\nWe\'ll notify you once your order is ready for dispatch.\\nTrack: https://surakshitamnaturals.example/track-order"},{"id":"ntf_2","channel":"whatsapp","recipient":"Admin (+91 74163 94594)","template":"admin_new_order","status":"sent","createdAt":"2026-08-16T11:13:09.375Z","message":"🌿 New Surakshitam Naturals order\\n\\nOrder: SURK-2026-482913\\nCustomer: Demo Customer\\nPhone: 9000000001\\nItems: Shea Butter Soap × 1, Hair Oil × 2\\nTotal: ₹647\\nPayment: PAID\\nPacking status: Pending\\n\\nOpen Admin: https://surakshitamnaturals.example/admin/orders/SURK-2026-482913"}]';
const CART = '[{"id":"p-shea-butter-soap","qty":1},{"id":"p-hair-oil","qty":2},{"id":"p-dishwash-liquid","qty":1}]';
const ADDR = '{"fullName":"Demo Customer","phone":"9000000001","altPhone":"","line1":"Nagole","line2":"","landmark":"","city":"Hyderabad","state":"Telangana","postalCode":"500068","type":"Home"}';
const PROFILE = '{"name":"Demo Customer","mobile":"+91 98491 16181","email":"demo.customer@example.com","address":"Nagole, Hyderabad, Telangana – 500068"}';

function seedScript(withAdmin) {
  return `(function(){try{
    localStorage.setItem('sn-cart-v1', ${JSON.stringify(CART)});
    localStorage.setItem('sn-orders-v1', ${JSON.stringify(ORDER)});
    localStorage.setItem('sn-notifications-v1', ${JSON.stringify(NOTIFS)});
    localStorage.setItem('sn-address-v1', ${JSON.stringify(ADDR)});
    localStorage.setItem('sn-profile-v1', ${JSON.stringify(PROFILE)});
    ${withAdmin ? "localStorage.setItem('sn-admin-v1','1');" : "localStorage.removeItem('sn-admin-v1');"}
  }catch(e){}})();`;
}

const VIEWPORT = { width: 1440, height: 960 };

async function shoot(page, name, url, { full = true, wait = 1200 } = {}) {
  await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(wait);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, fullPage: full });
  console.log('OK', name);
}

const pages = [
  ['01-home', '/'],
  ['02-shop-all', '/shop'],
  ['03-shop-home-care', '/shop?category=home-care'],
  ['04-shop-skin-care', '/shop?category=skin-care'],
  ['05-shop-hair-care', '/shop?category=hair-care'],
  ['06-product-shea-butter-soap', '/product/shea-butter-soap'],
  ['07-product-hair-oil', '/product/hair-oil'],
  ['08-ingredients', '/ingredients'],
  ['09-learn-index', '/learn'],
  ['10-learn-article', '/learn/from-idea-to-a-finished-bar-of-soap'],
  ['11-our-story', '/our-story'],
  ['12-cart', '/cart'],
  ['13-checkout', '/checkout'],
  ['14-order-success', '/order/SURK-2026-482913'],
  ['16-account', '/account'],
  ['17-contact', '/contact'],
  ['18-policy-shipping', '/policies/shipping'],
  ['19-policy-returns', '/policies/returns'],
  ['20-policy-privacy', '/policies/privacy'],
  ['21-search', '/search?q=soap'],
  ['22-admin-dashboard', '/admin'],
  ['23-admin-orders', '/admin/orders'],
  ['24-admin-notifications-whatsapp', '/admin/dev/notifications'],
];

const run = async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  // Main context (admin logged in) for everything
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await ctx.addInitScript(seedScript(true));
  const page = await ctx.newPage();

  for (const [name, url] of pages) {
    await shoot(page, name, url);
  }

  // Track order: prefilled, click Track then capture
  await page.goto(BASE + '/track-order', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /track/i }).first().click().catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/15-track-order.png`, fullPage: true });
  console.log('OK 15-track-order');

  // Razorpay modal: drive checkout to payment, open modal, viewport shot
  try {
    await page.goto(BASE + '/checkout', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const clickText = async (re) => {
      const btns = await page.$$('button');
      for (const b of btns) {
        const t = (await b.innerText()).trim();
        if (re.test(t)) { await b.click().catch(() => {}); return true; }
      }
      return false;
    };
    // fill any empty email/tel/text inputs to satisfy validation
    await page.evaluate(() => {
      document.querySelectorAll('input').forEach((i) => {
        if (i.value) return;
        if (i.type === 'email') i.value = 'democustomer@example.com';
        else if (i.type === 'tel') i.value = '9000000001';
      });
    });
    await clickText(/continue/i); await page.waitForTimeout(600);
    await clickText(/continue to review/i); await page.waitForTimeout(600);
    await clickText(/continue to payment/i); await page.waitForTimeout(600);
    await clickText(/pay .*secur|pay ₹/i); await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/25-razorpay-modal.png`, fullPage: false });
    console.log('OK 25-razorpay-modal');
  } catch (e) { console.log('razorpay fail', e.message); }

  await ctx.close();

  // Guest context (no admin) for admin login gate
  const gctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  await gctx.addInitScript(seedScript(false));
  const gp = await gctx.newPage();
  await gp.goto(BASE + '/admin', { waitUntil: 'networkidle' }).catch(() => {});
  await gp.waitForTimeout(1000);
  await gp.screenshot({ path: `${OUT}/26-admin-login.png`, fullPage: false });
  console.log('OK 26-admin-login');
  await gctx.close();

  await browser.close();
  console.log('DONE');
};

run().catch((e) => { console.error(e); process.exit(1); });
