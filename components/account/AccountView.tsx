"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProfile, saveProfile, defaultProfile, type Profile } from "@/lib/profile";
import { updateSessionIdentity, hasCustomerPassword, setCustomerPassword, verifyCustomerPassword } from "@/lib/auth";
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
  const { user, ready, refresh } = useAuth();
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Security / password
  const [hasPw, setHasPw] = useState(false);
  const [pwEditing, setPwEditing] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const p = getProfile();
      setProfile(p);
      setDraft(p);
      setOrders(getOrdersForUser(user.id));
      setHasPw(hasCustomerPassword());
    }
  }, [user]);

  function savePassword() {
    setPwError("");
    setPwSaved(false);
    if (hasPw && !verifyCustomerPassword(currentPw)) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (newPw.length < 4) {
      setPwError("New password must be at least 4 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New password and confirmation don't match.");
      return;
    }
    setCustomerPassword(newPw);
    setHasPw(true);
    setPwEditing(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwSaved(true);
  }

  function save() {
    saveProfile(draft);
    updateSessionIdentity({ name: draft.name, email: draft.email });
    refresh();
    setProfile(draft);
    setEditing(false);
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
              <p className="mt-0.5 text-xs text-forest/50">Customer ID: {profile.customerId}</p>
            </div>
          </div>
          {/* Logging out lives in the account menu behind the header's user icon
              (and in the mobile drawer) so it can't be tapped by mistake here. */}
          <p className="hidden max-w-[11rem] text-right text-xs leading-relaxed text-forest/45 sm:block">
            To sign out, open the account menu beside your name at the top right.
          </p>
        </div>
      </section>

      <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Profile + Security */}
        <div className="space-y-6">
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
              <div className="text-sm">
                <span className="mb-1 block font-medium text-forest">Mobile</span>
                <p className="rounded-lg border border-forest/10 bg-parchment/60 px-4 py-2.5 text-forest/70">{draft.mobile}</p>
                <p className="mt-1 text-xs text-forest/45">Your mobile is your login ID and can&apos;t be changed here.</p>
              </div>
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
              <Row label="Customer ID" value={profile.customerId} />
              <Row label="Name" value={profile.name} />
              <Row label="Mobile" value={profile.mobile} />
              <Row label="Email" value={profile.email} />
              <Row label="Address" value={profile.address} />
            </dl>
          )}
        </section>

        {/* Security */}
        <section className="h-fit rounded-lg border border-forest/8 bg-white/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-forest">Security</h2>
            {!pwEditing && (
              <button
                type="button"
                onClick={() => {
                  setPwError("");
                  setPwSaved(false);
                  setPwEditing(true);
                }}
                className="text-sm font-medium text-moss hover:text-forest"
              >
                {hasPw ? "Change password" : "Set a password"}
              </button>
            )}
          </div>

          {pwEditing ? (
            <div className="mt-5 space-y-4">
              {hasPw && (
                <PField
                  label="Current password"
                  value={currentPw}
                  onChange={setCurrentPw}
                  type="password"
                />
              )}
              <PField label="New password" value={newPw} onChange={setNewPw} type="password" />
              <PField
                label="Confirm new password"
                value={confirmPw}
                onChange={setConfirmPw}
                type="password"
              />
              {pwError && <p className="text-sm text-clay">{pwError}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={savePassword}
                  className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
                >
                  Save password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPwEditing(false);
                    setCurrentPw("");
                    setNewPw("");
                    setConfirmPw("");
                    setPwError("");
                  }}
                  className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-forest/65">
              {hasPw
                ? "A password is set for this account — you can sign in with mobile/email + password or mobile + OTP."
                : "You currently sign in with mobile + OTP. Set a password to also enable username/email + password sign-in."}
              {pwSaved && <span className="mt-2 block text-moss">Password saved.</span>}
            </p>
          )}
        </section>
        </div>

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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: "text" | "password";
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={type === "password" ? "new-password" : undefined}
          className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
        />
      )}
    </label>
  );
}
