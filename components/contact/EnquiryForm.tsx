"use client";

import { useState, type FormEvent } from "react";
import { submitEnquiry } from "@/lib/enquiry";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

/**
 * Minimal enquiry form → Google Sheet. Not wired into any page yet.
 * Usage: <EnquiryForm product="Wild Forest Honey 500g" />
 */
export function EnquiryForm({ product = "" }: { product?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus({ kind: "sending" });
    const result = await submitEnquiry({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      product: String(fd.get("product") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    });
    if (result.ok) {
      form.reset();
      setStatus({ kind: "sent" });
    } else {
      setStatus({ kind: "error", message: result.error });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="rounded-lg border border-forest/8 bg-parchment/60 p-6">
        <p className="font-serif text-xl font-semibold text-forest">Thank you — we&apos;ll get back to you soon.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-3 text-sm font-medium text-moss">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
      </div>
      <Field label="Email (optional)" name="email" type="email" autoComplete="email" />
      <Field label="Product" name="product" defaultValue={product} />
      <div>
        <label htmlFor="enq-message" className="mb-1.5 block text-sm font-medium text-forest">
          Message
        </label>
        <textarea id="enq-message" name="message" rows={4} className={inputClass} />
      </div>
      {/* Honeypot — hidden from humans, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status.kind === "error" && (
        <p role="alert" className="text-sm text-clay">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink disabled:opacity-60"
      >
        {status.kind === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm text-forest focus:border-moss focus:outline-none";

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
