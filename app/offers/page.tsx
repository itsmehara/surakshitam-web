"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getLiveOffers, type Offer } from "@/lib/offers";
import { getEnabledBundles, type Bundle } from "@/lib/bundles";
import { formatPrice } from "@/lib/format";
import { ComboCard } from "@/components/ui/ComboCard";
import { PageIntro } from "@/components/ui/PageIntro";
import { cn } from "@/lib/cn";

type Tab = "offers" | "combos";

function OfferCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false);
  const savings = offer.type === "percent" ? `${offer.value}% off` : `${formatPrice(offer.value)} off`;

  function copy() {
    navigator.clipboard?.writeText(offer.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex flex-col justify-between rounded-lg border-2 border-cream bg-clay/25 p-5 shadow-soft">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-clay">Limited offer</p>
        <p className="mt-1 text-2xl font-extrabold leading-tight text-clay">{savings}</p>
        {offer.description && <p className="mt-1 text-sm text-forest/70">{offer.description}</p>}
        {offer.minOrderValue ? (
          <p className="mt-1 text-xs text-forest/50">Min. order {formatPrice(offer.minOrderValue)}</p>
        ) : null}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="flex-1 rounded-full border-2 border-dashed border-clay/50 bg-white/70 px-4 py-2 text-center font-mono text-sm font-bold tracking-wide text-clay"
        >
          {copied ? "Copied!" : offer.code}
        </button>
        <Link
          href="/shop"
          className="rounded-full bg-forest px-4 py-2 text-sm font-medium text-cream hover:bg-ink"
        >
          Shop
        </Link>
      </div>
    </div>
  );
}

export default function OffersPage() {
  return (
    <Suspense fallback={null}>
      <OffersPageInner />
    </Suspense>
  );
}

function OffersPageInner() {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "combos" ? "combos" : "offers";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    setOffers(getLiveOffers());
    setBundles(getEnabledBundles());
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Offers"
        title="Offers & combos"
        intro="Every live discount code and combo kit, all in one place."
      />
      <div className="container py-10 sm:py-14">
        <div className="inline-flex rounded-full border border-forest/15 bg-white/60 p-1">
          {(["offers", "combos"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors",
                tab === t ? "bg-forest text-cream" : "text-forest/65 hover:text-forest",
              )}
            >
              {t === "offers" ? `Offers (${offers.length})` : `Combos (${bundles.length})`}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "offers" ? (
            offers.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-xl text-forest">No offers live right now</p>
                <p className="mt-2 text-sm text-forest/60">Check back soon for a discount code.</p>
                <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-moss">
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {offers.map((o) => (
                  <OfferCard key={o.id} offer={o} />
                ))}
              </div>
            )
          ) : bundles.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-xl text-forest">No combos live right now</p>
              <p className="mt-2 text-sm text-forest/60">Check back soon, or browse products individually.</p>
              <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-moss">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bundles.map((b) => (
                <ComboCard key={b.id} bundle={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
