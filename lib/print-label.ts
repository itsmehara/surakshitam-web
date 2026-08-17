/**
 * Printable shipping label for an order — opens a print-formatted window and
 * triggers the browser print dialog (same no-backend approach as the Reports
 * PDF export). Used from Order Detail and Packing so admins can print an
 * address label without a shipping-API integration.
 */
import { site } from "./site";
import type { Order } from "./orders";
import { formatPrice } from "./format";

function escapeHtml(v: string | number): string {
  return String(v).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
}

/** Opens a print window with one shipping label per order (2-up on A4 if multiple). */
export function printShippingLabels(orders: Order[]): void {
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win || orders.length === 0) return;

  const from = `${site.name}<br/>${site.address.line1}, ${site.address.line2}<br/>${site.address.city}, ${site.address.region} – ${site.address.postalCode}<br/>${site.phone}`;

  const labels = orders
    .map((o) => {
      const a = o.address;
      const codOrPaid = o.paymentStatus === "PAID" ? "PREPAID" : "COD / UNPAID";
      const itemsLine = o.items.map((i) => `${i.nameSnapshot} × ${i.qty}`).join(", ");
      return `
    <div class="label">
      <div class="row between">
        <span class="badge">${escapeHtml(codOrPaid)}</span>
        <span class="order-no">#${escapeHtml(o.orderNumber)}</span>
      </div>
      <div class="section">
        <p class="eyebrow">From</p>
        <p class="from">${from}</p>
      </div>
      <div class="section to">
        <p class="eyebrow">Ship to</p>
        <p class="name">${escapeHtml(a.fullName)}</p>
        <p class="addr">
          ${escapeHtml(a.line1)}${a.line2 ? `, ${escapeHtml(a.line2)}` : ""}${a.landmark ? ` (${escapeHtml(a.landmark)})` : ""}<br/>
          ${escapeHtml(a.city)}, ${escapeHtml(a.state)} – ${escapeHtml(a.postalCode)}
        </p>
        <p class="phone">Ph: ${escapeHtml(a.phone)}${a.altPhone ? ` / ${escapeHtml(a.altPhone)}` : ""}</p>
      </div>
      <div class="section">
        <p class="eyebrow">Items</p>
        <p class="items">${escapeHtml(itemsLine)}</p>
        <p class="total">Order total: ${escapeHtml(formatPrice(o.total))}</p>
      </div>
      ${
        o.courier
          ? `<div class="section"><p class="eyebrow">Courier</p><p class="items">${escapeHtml(o.courier)}${o.trackingNumber ? ` · ${escapeHtml(o.trackingNumber)}` : ""}</p></div>`
          : ""
      }
    </div>`;
    })
    .join("");

  win.document.write(`<!DOCTYPE html>
<html><head><title>Shipping labels — Surakshitam Naturals</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 20px; color: #1f2a1f; }
  .label {
    width: 380px; border: 2px solid #1f2a1f; border-radius: 8px; padding: 16px 18px;
    margin: 0 0 20px; page-break-inside: avoid;
  }
  .row.between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .badge { background: #1f2a1f; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; letter-spacing: 0.04em; }
  .order-no { font-size: 12px; color: #667; font-weight: 600; }
  .section { border-top: 1px dashed #ccc; padding: 10px 0; }
  .section:first-of-type { border-top: none; padding-top: 0; }
  .eyebrow { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #789; margin: 0 0 3px; }
  .from { font-size: 12px; color: #445; margin: 0; line-height: 1.5; }
  .to .name { font-size: 17px; font-weight: 700; margin: 0 0 4px; }
  .addr { font-size: 13px; margin: 0 0 4px; line-height: 1.5; }
  .phone { font-size: 13px; margin: 0; font-weight: 600; }
  .items { font-size: 12px; margin: 0 0 4px; color: #445; }
  .total { font-size: 12px; margin: 0; font-weight: 700; }
</style></head><body>
  ${labels}
</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}
