"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getIngredient,
  getIngredientGroups,
  saveIngredient,
  blankIngredient,
  withIngredientSlug,
  isCustomIngredient,
  slugifyIngredient,
} from "@/lib/ingredient-store";
import { getAdminProducts } from "@/lib/catalog-store";
import type { Ingredient } from "@/lib/types";

const linesToArray = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

const BACK_HREF = "/studio/products?tab=ingredients";

/**
 * Add / edit one ingredient.
 *
 * "Found in" is a picker over the real catalogue rather than a free-text field:
 * the public page matches these entries to products by name to show the little
 * product chips, so a typo would silently break the link.
 */
export function AdminIngredientForm({ slug }: { slug?: string }) {
  const router = useRouter();
  const [ing, setIng] = useState<Ingredient | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [properties, setProperties] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [error, setError] = useState("");

  const productNames = useMemo(
    () => getAdminProducts({ includeHidden: true }).map((p) => p.name).sort((a, b) => a.localeCompare(b)),
    [],
  );

  useEffect(() => {
    setGroups(getIngredientGroups({ includeHidden: true }));
    if (slug) {
      const found = getIngredient(slug);
      if (!found) {
        setNotFound(true);
        return;
      }
      setIng(found);
      setProperties(found.properties.join("\n"));
    } else {
      setIng(blankIngredient());
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="container py-16 text-center text-forest/60">
        Ingredient not found.{" "}
        <Link href={BACK_HREF} className="text-moss underline">
          Back to ingredients
        </Link>
      </div>
    );
  }
  if (!ing) return <div className="container py-16 text-center text-forest/50">Loading…</div>;

  const editingCustom = slug ? isCustomIngredient(slug) : true;
  const set = (patch: Partial<Ingredient>) => setIng((prev) => (prev ? { ...prev, ...patch } : prev));

  function toggleProduct(name: string) {
    if (!ing) return;
    const has = ing.usedIn.includes(name);
    set({ usedIn: has ? ing.usedIn.filter((n) => n !== name) : [...ing.usedIn, name] });
  }

  function addGroupInline() {
    const name = newGroup.trim();
    if (!name) return;
    setGroups((g) => (g.includes(name) ? g : [...g, name]));
    set({ group: name });
    setNewGroup("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ing) return;
    const finalIngredient = withIngredientSlug({ ...ing, properties: linesToArray(properties) });
    if (!finalIngredient.name.trim()) {
      setError("Give the ingredient a name.");
      return;
    }
    if (!finalIngredient.slug) {
      setError("Couldn't build a web address from that name — enter one manually.");
      return;
    }
    // A new ingredient must not quietly overwrite an existing one with the same slug.
    if (!slug && getIngredient(finalIngredient.slug)) {
      setError(`"${finalIngredient.slug}" already exists. Edit that entry, or choose another name.`);
      return;
    }
    saveIngredient(finalIngredient);
    router.push(BACK_HREF);
  }

  const field =
    "w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm focus:border-moss focus:outline-none";
  const labelCls = "block text-xs font-medium text-forest/60";

  return (
    <div className="container max-w-3xl py-10">
      <Link href={BACK_HREF} className="text-sm font-medium text-moss hover:text-forest">
        ← Ingredients
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-forest sm:text-3xl">
        {slug ? "Edit ingredient" : "Add ingredient"}
      </h1>
      {slug && !editingCustom && (
        <p className="mt-1 text-sm text-forest/55">
          Editing one of the original ingredients — use “Reset” on the ingredients list to put it
          back the way it shipped.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Basics */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Basics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name *</label>
              <input
                required
                value={ing.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="e.g. Neem"
                className={`mt-1 ${field}`}
              />
            </div>
            <div>
              <label className={labelCls}>Botanical name (optional)</label>
              <input
                value={ing.botanicalName ?? ""}
                onChange={(e) => set({ botanicalName: e.target.value || undefined })}
                placeholder="e.g. Azadirachta indica"
                className={`mt-1 ${field}`}
              />
            </div>
            <div>
              <label className={labelCls}>Family</label>
              <select
                value={ing.group}
                onChange={(e) => set({ group: e.target.value })}
                className={`mt-1 ${field}`}
              >
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex gap-2">
                <input
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGroupInline();
                    }
                  }}
                  placeholder="…or type a new family"
                  className={field}
                />
                <button
                  type="button"
                  onClick={addGroupInline}
                  className="shrink-0 rounded-full border border-forest/20 px-4 text-sm font-medium text-forest hover:bg-forest/5"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Web address (auto if blank)</label>
              <input
                value={ing.slug}
                onChange={(e) => set({ slug: slugifyIngredient(e.target.value) })}
                placeholder={slugifyIngredient(ing.name)}
                className={`mt-1 ${field}`}
                disabled={!!slug}
              />
              <p className="mt-1 text-xs text-forest/45">
                {slug
                  ? "Fixed once saved — changing it would break links pointing at this ingredient."
                  : "Used in the link to this ingredient, e.g. /ingredients#neem."}
              </p>
            </div>
          </div>
        </section>

        {/* Copy */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">What customers read</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls}>One-line summary</label>
              <input
                value={ing.summary}
                onChange={(e) => set({ summary: e.target.value })}
                placeholder="A time-honoured Indian botanical with a clean, green character."
                className={`mt-1 ${field}`}
              />
            </div>
            <div>
              <label className={labelCls}>Why we use it</label>
              <textarea
                rows={3}
                value={ing.why}
                onChange={(e) => set({ why: e.target.value })}
                className={`mt-1 ${field}`}
              />
              <p className="mt-1 text-xs text-forest/45">
                Keep it sensory and general. Avoid medical or curative claims — those aren&apos;t
                permitted for cosmetics and home care in India.
              </p>
            </div>
            <div>
              <label className={labelCls}>Descriptors (one per line)</label>
              <textarea
                rows={4}
                value={properties}
                onChange={(e) => setProperties(e.target.value)}
                placeholder={"Traditionally valued\nRefreshing\nGreen, herbaceous"}
                className={`mt-1 ${field}`}
              />
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Found in</h2>
          <p className="mt-1 text-sm text-forest/60">
            Tick the products that use this ingredient — each becomes a link on the Ingredients page.
          </p>
          <div className="mt-4 grid max-h-72 gap-1.5 overflow-y-auto sm:grid-cols-2">
            {productNames.map((name) => (
              <label key={name} className="flex items-center gap-2 text-sm text-forest/80">
                <input
                  type="checkbox"
                  checked={ing.usedIn.includes(name)}
                  onChange={() => toggleProduct(name)}
                />
                {name}
              </label>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-clay">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-cream hover:bg-ink"
          >
            {slug ? "Save changes" : "Add ingredient"}
          </button>
          <Link
            href={BACK_HREF}
            className="rounded-full border border-forest/20 px-6 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
