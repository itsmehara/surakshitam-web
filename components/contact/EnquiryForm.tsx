"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  ENQUIRY_TYPES,
  isEnquiryType,
  submitEnquiry,
  formatEnquiryLines,
  whatsAppFormFallbackHref,
  trackWhatsAppClick,
  type EnquiryFields,
  type EnquiryType,
} from "@/lib/enquiry";
import { useEnquiryList } from "@/lib/enquiry-list/EnquiryListContext";
import { SlotPicker, formatSlot } from "./SlotPicker";
import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; type: EnquiryType }
  | { kind: "error"; message: string; fallback: string };

/**
 * One form, three jobs — product enquiry, brand partnership, consultation
 * booking (15 Sep brief). `?type=` (from the Contact submenu) pre-selects the
 * type; the type drives which extra field shows, the placeholder copy and the
 * success message. A product enquiry pre-fills the product lines from the
 * enquiry list, so the drawer's "send as a form" hands over cleanly.
 *
 * Submission goes to the Apps Script (Sheet row + email alert). If that fails
 * — or the URL isn't configured — the error state offers the same content as
 * a WhatsApp message, so a visitor is never stuck.
 */
const COPY: Record<
  EnquiryType,
  { intro: string; messageLabel: string; placeholder: string; success: string; button: string }
> = {
  product: {
    intro: "Tell us which products you're interested in and we'll reply with price, availability and delivery details.",
    messageLabel: "Anything else? (optional)",
    placeholder: "Quantity, delivery area, questions about ingredients…",
    success: "Thank you — we'll get back to you with prices and availability, usually within a working day.",
    button: "Send enquiry",
  },
  partner: {
    intro: "Make something homemade or natural? Tell us about your brand and we'll get in touch about listing it under Partner Brands.",
    messageLabel: "About your products",
    placeholder: "What you make, where you're based, how long you've been making it, and a link if you have one.",
    success: "Thank you — we'll review your brand and reply within a few working days.",
    button: "Send partnership request",
  },
  consultation: {
    intro: "Your first 30-minute consultation is free — skin, hair or home-care guidance, by phone or at our Nagole workspace. Pick a day and time and we'll confirm on WhatsApp.",
    messageLabel: "What would you like help with?",
    placeholder: "e.g. dry skin routine, hair-fall, switching to natural home cleaners…",
    success: "Thank you — we'll confirm your free 30-minute slot by phone or WhatsApp.",
    button: "Book my free slot",
  },
};

export function EnquiryForm({ product = "" }: { product?: string }) {
  const params = useSearchParams();
  const requested = params.get("type");
  const [type, setType] = useState<EnquiryType>(isEnquiryType(requested) ? requested : "product");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { lines, ready, note } = useEnquiryList();

  // Follow the URL if the visitor switches submenu while already on /contact.
  useEffect(() => {
    if (isEnquiryType(requested)) setType(requested);
  }, [requested]);

  // Product lines from the enquiry list (or the single product a PDP passed in).
  const listedProducts = useMemo(
    () =>
      lines.length
        ? formatEnquiryLines(lines.map((l) => ({ name: l.product.name, size: l.product.size, qty: l.qty })))
        : product,
    [lines, product],
  );
  const [products, setProducts] = useState(product);
  const [message, setMessage] = useState("");
  const [slot, setSlot] = useState<{ date: string; minutes: number | null }>({ date: "", minutes: null });
  useEffect(() => {
    if (!ready) return;
    setProducts(listedProducts);
    // The drawer's note becomes the product-enquiry message so nothing typed there is lost.
    if (type === "product" && note && lines.length) setMessage((m) => m || note);
  }, [ready, listedProducts, note, lines.length, type]);

  const copy = COPY[type];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const fields: EnquiryFields = {
      type,
      name: str("name"),
      phone: str("phone"),
      email: str("email"),
      product: type === "product" ? str("product") : "",
      business: type === "partner" ? str("business") : "",
      slot:
        type === "consultation" && slot.date && slot.minutes !== null
          ? formatSlot(slot.date, slot.minutes)
          : "",
      message: str("message"),
      website: str("website"),
    };
    if (type === "consultation" && !fields.slot) {
      setStatus({ kind: "error", message: "Please pick a day and a time slot.", fallback: whatsAppFormFallbackHref(fields) });
      return;
    }
    setStatus({ kind: "sending" });
    const result = await submitEnquiry(fields);
    if (result.ok) {
      form.reset();
      setMessage("");
      setSlot({ date: "", minutes: null });
      setStatus({ kind: "sent", type });
    } else {
      setStatus({ kind: "error", message: result.error, fallback: whatsAppFormFallbackHref(fields) });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-lg border border-moss/30 bg-moss/10 p-6">
        <p className="flex items-center gap-2 font-serif text-xl font-semibold text-forest">
          <CheckIcon width={22} className="text-moss" /> Received
        </p>
        <p className="mt-2 text-sm leading-relaxed text-forest/75">{COPY[status.type].success}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-4 text-sm font-medium text-moss underline underline-offset-2"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-busy={status.kind === "sending"}>
      {/* Type — segmented on wide screens, a native select on phones */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-forest">I&apos;d like to</legend>
        <div className="hidden gap-2 sm:flex" role="radiogroup">
          {ENQUIRY_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={type === t.value}
              onClick={() => setType(t.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                type === t.value
                  ? "border-forest bg-forest text-cream"
                  : "border-forest/15 text-forest hover:border-forest/40",
              )}
            >
              {t.short}
            </button>
          ))}
        </div>
        <select
          aria-label="Enquiry type"
          value={type}
          onChange={(e) => setType(e.target.value as EnquiryType)}
          className={cn(inputClass, "sm:hidden")}
        >
          {ENQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-forest/60">{copy.intro}</p>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="Phone / WhatsApp" name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
      </div>
      <Field label="Email (optional)" name="email" type="email" autoComplete="email" />

      {type === "product" && (
        <div>
          <label htmlFor="enq-product" className="mb-1.5 block text-sm font-medium text-forest">
            Products <span className="text-clay">*</span>
          </label>
          <textarea
            id="enq-product"
            name="product"
            rows={Math.min(6, Math.max(2, products.split("\n").length))}
            required
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            placeholder={"One per line, e.g.\nNeem & Tulsi Soap × 2\nNatural Dishwash Liquid × 1"}
            className={inputClass}
          />
          {lines.length > 0 && (
            <p className="mt-1 text-xs text-forest/50">Filled from your enquiry list — edit freely.</p>
          )}
        </div>
      )}
      {type === "partner" && (
        <Field label="Brand / business name" name="business" required autoComplete="organization" />
      )}
      {type === "consultation" && (
        <>
          <p className="flex w-fit items-center gap-2 rounded-full bg-moss/12 px-3 py-1 text-xs font-medium text-moss">
            <CheckIcon width={14} /> First consultation free · 30 minutes
          </p>
          <SlotPicker date={slot.date} minutes={slot.minutes} onChange={setSlot} />
        </>
      )}

      <div>
        <label htmlFor="enq-message" className="mb-1.5 block text-sm font-medium text-forest">
          {copy.messageLabel}
          {type !== "product" && <span className="text-clay"> *</span>}
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={4}
          required={type !== "product"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.placeholder}
          className={inputClass}
        />
      </div>

      {/* Honeypot — hidden from humans, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && (
        <div role="alert" className="rounded-lg border border-clay/40 bg-clay/10 p-4 text-sm">
          <p className="font-medium text-clay">We couldn&apos;t send that.</p>
          <p className="mt-1 text-forest/70">{status.message}</p>
          <a
            href={status.fallback}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ cta: "form-fallback" })}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
          >
            <WhatsAppIcon width={16} /> Send it on WhatsApp instead
          </a>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink disabled:opacity-60"
        >
          {status.kind === "sending" ? "Sending…" : copy.button}
        </button>
        <p className="text-xs text-forest/50">We reply by phone, WhatsApp or email. No spam, ever.</p>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm text-forest placeholder:text-forest/35 focus:border-moss focus:outline-none";

function Field({
  label,
  name,
  required,
  ...rest
}: { label: string; name: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `enq-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-forest">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <input id={id} name={name} required={required} className={inputClass} {...rest} />
    </div>
  );
}
