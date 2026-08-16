"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProfile, saveProfile, defaultProfile, type Profile } from "@/lib/profile";
import { useAuth } from "@/components/auth/AuthProvider";
import { getOrdersForUser, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { UserIcon, CheckIcon, ArrowRight } from "@/components/icons";

const statusLabel: Record<Order["fulfillmentStatus"], string> = {
  CONFIRMED: "Confirmed",
  PACKING: "Packing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export function AccountView() {
  const router = useRouter();
  const { user, ready, signOut: authSignOut } = useAuth();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const p = getProfile();
      setProfile(p);
      setDraft(p);
      setOrders(getOrdersForUser(user.id));
    }
  }, [user]);

  function save() {
    saveProfile(draft);
    setProfile(draft);
    setEditing(false);
  }

  function signOut() {
    authSignOut();
    router.push("/");
  }

  if (!ready) {
    return <div className="container py-24 text-center text-forest/50">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream">
          <UserIcon width={26} />
        </span>
        <h1 className="mt-5 font-serif text-2xl font-semibold text-forest">You&apos;re not signed in</h1>
        <p className="mt-2 max-w-sm text-sm text-forest/60">
          Sign in to view your profile, saved address and order history.
        </p>
        <Link
          href="/login?next=/account"
          className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream hover:bg-ink"
        >
          Sign in / Sign up
        </Link>
      </div>
    );
  }

  const firstName = profile.name.split(" ")[0] || "there";

  return (
    <>
      <section className="border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <div className="container flex items-center justify-between gap-4 py-10 sm:py-14">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream">
              <UserIcon width={26} />
            </span>
            <div>
              <p className="eyebrow">My account</p>
              <h1 className="mt-1 font-serif text-2xl font-semibold text-forest sm:text-3xl">
                Hello, {firstName}
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Log out
          </button>
        </div>
      </section>

      <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Profile */}
        <section className="h-fit rounded-lg border border-forest/8 bg-white/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">Profile details</h2>
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setEditing(true);
                }}
                className="text-sm font-medium text-moss hover:text-forest"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="mt-5 space-y-4">
              <PField label="Full name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
              <PField label="Mobile" value={draft.mobile} onChange={(v) => setDraft({ ...draft, mobile: v })} />
              <PField label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
              <PField label="Address" value={draft.address} onChange={(v) => setDraft({ ...draft, address: v })} textarea />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={save}
                  className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <dl className="mt-5 space-y-4 text-sm">
              <Row label="Name" value={profile.name} />
              <Row label="Mobile" value={profile.mobile} />
              <Row label="Email" value={profile.email} />
              <Row label="Address" value={profile.address} />
            </dl>
          )}
        </section>

        {/* Orders */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">My orders</h2>
            <span className="text-sm text-forest/50">{orders.length} total</span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-8 text-center">
              <p className="font-serif text-lg text-forest">No orders yet</p>
              <p className="mt-1 text-sm text-forest/60">Your placed orders will appear here.</p>
              <Link href="/shop" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-moss">
                Start shopping <ArrowRight width={15} />
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((o) => (
                <li key={o.orderNumber} className="rounded-lg border border-forest/8 bg-white/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <Link href={`/order/${o.orderNumber}`} className="font-serif font-semibold text-forest hover:text-moss">
                        #{o.orderNumber}
                      </Link>
                      <p className="text-xs text-forest/50">
                        {new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.items.length} item
                        {o.items.length === 1 ? "" : "s"} · {formatPrice(o.total)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/12 px-3 py-1 text-xs font-medium text-moss">
                      <CheckIcon width={13} /> {statusLabel[o.fulfillmentStatus]}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm">
                    <Link href={`/order/${o.orderNumber}`} className="font-medium text-moss hover:text-forest">
                      View details
                    </Link>
                    <Link href="/track-order" className="font-medium text-forest/60 hover:text-forest">
                      Track
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-forest/50">{label}</dt>
      <dd className="text-forest">{value}</dd>
    </div>
  );
}

function PField({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-forest">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
        />
      )}
    </label>
  );
}
