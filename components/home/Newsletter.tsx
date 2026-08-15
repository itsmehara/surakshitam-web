"use client";

import { useState } from "react";
import { CheckIcon, ArrowRight } from "@/components/icons";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Prototype only — no data is sent. Wire to an email provider later.
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section className="bg-cream pb-20 pt-4 sm:pb-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-lg bg-moss px-6 py-12 text-cream sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cream/10 blur-2xl"
          />
          <div className="relative mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">
              Join the Surakshitam Circle
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-cream sm:text-3xl">
              Care guides, new products &amp; restock alerts
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Occasional, useful emails — product launches, simple care guides and restock
              notices. No noise.
            </p>

            {submitted ? (
              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream/15 px-5 py-3 text-sm font-medium text-cream">
                <CheckIcon width={18} /> You&apos;re on the list. Thank you!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-cream/20 bg-cream/10 px-5 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-cream focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-parchment"
                >
                  Subscribe <ArrowRight width={16} />
                </button>
              </form>
            )}
            <p className="mt-4 text-xs text-cream/60">Prototype form — no email is actually sent.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
