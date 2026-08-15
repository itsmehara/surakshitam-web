"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";

const topics = ["Product Question", "Order Support", "Ingredients", "Wholesale", "Other"];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-start rounded-lg border border-forest/8 bg-parchment/60 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss/15 text-moss">
          <CheckIcon width={24} />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-forest">Message received</h2>
        <p className="mt-2 text-forest/70">
          Thank you for reaching out. This is a prototype form — no message was actually sent.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-medium text-moss"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Phone" name="phone" type="tel" required />
      </div>
      <Field label="Email" name="email" type="email" />
      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-forest">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm text-forest focus:border-moss focus:outline-none"
        >
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-forest">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm text-forest focus:border-moss focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink"
      >
        Send message
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-forest">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm text-forest focus:border-moss focus:outline-none"
      />
    </div>
  );
}
