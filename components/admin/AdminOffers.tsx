"use client";

import { useEffect, useState } from "react";
import {
  getOffers,
  saveOffer,
  deleteOffer,
  blankOffer,
  isOfferLive,
  type Offer,
} from "@/lib/offers";
import { isOffersNavEnabled, setOffersNavEnabled } from "@/lib/site-settings";
import { formatPrice } from "@/lib/format";

export function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); // null = not editing
  const [draft, setDraft] = useState<Offer>(blankOffer());
  const [error, setError] = useState("");
  const [navEnabled, setNavEnabled] = useState(true);

  const refresh = () => setOffers(getOffers());
  useEffect(refresh, []);
  useEffect(() => setNavEnabled(isOffersNavEnabled()), []);

  function toggleNav(enabled: boolean) {
    setNavEnabled(enabled);
    setOffersNavEnabled(enabled);
  }

  function startAdd() {
    setDraft(blankOffer());
    setError("");
    setEditingId("new");
  }

  function startEdit(o: Offer) {
    setDraft(o);
    setError("");
    setEditingId(o.id);
  }

  function cancel() {
    setEditingId(null);
    setError("");
  }

  function save() {
    if (!draft.code.trim()) {
      setError("Enter a code (e.g. WELCOME10).");
      return;
    }
    if (draft.type === "percent" && (draft.value <= 0 || draft.value > 100)) {
      setError("Percent discount must be between 1 and 100.");
      return;
    }
    if (draft.type === "flat" && draft.value <= 0) {
      setError("Flat discount must be a positive amount.");
      return;
    }
    if (draft.startDate > draft.endDate) {
      setError("Start date must be on or before the end date.");
      return;
    }
    const codeUpper = draft.code.trim().toUpperCase();
    const clash = offers.some((o) => o.id !== draft.id && o.code === codeUpper);
    if (clash) {
      setError(`Code "${codeUpper}" is already in use.`);
      return;
    }
    saveOffer(draft);
    cancel();
    refresh();
  }

  function remove(o: Offer) {
    if (!confirm(`Delete the "${o.code}" offer? This can't be undone.`)) return;
    deleteOffer(o.id);
    refresh();
  }

  return (
    <div>
      <label className="flex items-center gap-2 rounded-lg border border-forest/8 bg-white/60 px-4 py-3 text-sm text-forest/80">
        <input
          type="checkbox"
          checked={navEnabled}
          onChange={(e) => toggleNav(e.target.checked)}
          className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-moss"
        />
        Show offers on the site (menu link, floating button, homepage banner &amp; carousel — default on)
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-forest/60">
          Discount codes customers enter at checkout — set a start/end duration and they switch
          on and off automatically.
        </p>
        {editingId === null && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
          >
            + Add offer
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="mt-5 rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">
            {editingId === "new" ? "Add offer" : `Edit ${draft.code || "offer"}`}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Code</span>
              <input
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
                placeholder="WELCOME10"
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 uppercase focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm sm:col-span-2 lg:col-span-1">
              <span className="mb-1 block font-medium text-forest">Description</span>
              <input
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="10% off first order"
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Discount type</span>
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as Offer["type"] })}
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              >
                <option value="percent">Percent off</option>
                <option value="flat">Flat amount off</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">
                Value {draft.type === "percent" ? "(%)" : "(₹)"}
              </span>
              <input
                type="number"
                min={1}
                value={draft.type === "percent" ? draft.value : draft.value / 100}
                onChange={(e) => {
                  const raw = Number(e.target.value);
                  setDraft({ ...draft, value: draft.type === "percent" ? raw : Math.round(raw * 100) });
                }}
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Minimum order (₹, optional)</span>
              <input
                type="number"
                min={0}
                value={draft.minOrderValue ? draft.minOrderValue / 100 : ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  setDraft({ ...draft, minOrderValue: raw ? Math.round(Number(raw) * 100) : undefined });
                }}
                placeholder="No minimum"
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Starts</span>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Ends</span>
              <input
                type="date"
                value={draft.endDate}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm text-forest/75">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
              />
              Enabled
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-clay">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/8 text-left text-xs uppercase tracking-wide text-forest/50">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/8">
              {offers.map((o) => {
                const live = isOfferLive(o);
                return (
                  <tr key={o.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-forest">{o.code}</p>
                      {o.description && <p className="text-xs text-forest/50">{o.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-forest/80">
                      {o.type === "percent" ? `${o.value}% off` : `${formatPrice(o.value)} off`}
                      {o.minOrderValue ? (
                        <span className="block text-xs text-forest/45">
                          Min. order {formatPrice(o.minOrderValue)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-forest/70">
                      {new Date(o.startDate).toLocaleDateString("en-IN")} –{" "}
                      {new Date(o.endDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          live ? "bg-moss/10 text-moss" : "bg-forest/8 text-forest/50"
                        }`}
                      >
                        {live ? "Live" : o.enabled ? "Scheduled / expired" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(o)}
                          className="text-sm font-medium text-moss hover:text-forest"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(o)}
                          className="text-sm font-medium text-clay/80 hover:text-clay"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {offers.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-forest/55">
              No offers yet — add one to give customers a code at checkout.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
