"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getIngredients,
  getIngredientGroups,
  getHiddenIngredientSlugs,
  setIngredientHidden,
  deleteIngredient,
  resetIngredient,
  isCustomIngredient,
  saveIngredientGroups,
  renameIngredientGroup,
  resetIngredientLibrary,
} from "@/lib/ingredient-store";
import type { Ingredient, IngredientGroup } from "@/lib/types";

type Filter = "all" | "live" | "hidden";

/**
 * Ingredient library manager.
 *
 * Everything the Ingredients page shows a customer is editable here: the
 * entries themselves, and the families they're grouped under. Seed ingredients
 * can be edited, hidden and reset but never deleted — so a mistake is always
 * recoverable; only ingredients the admin added themselves can be removed.
 */
export function AdminIngredients() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [groups, setGroups] = useState<IngredientGroup[]>([]);
  const [hiddenSlugs, setHiddenSlugs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [managingGroups, setManagingGroups] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  const refresh = () => {
    setItems(getIngredients({ includeHidden: true }));
    setGroups(getIngredientGroups({ includeHidden: true }));
    setHiddenSlugs(getHiddenIngredientSlugs());
  };
  useEffect(refresh, []);

  const isHidden = (slug: string) => hiddenSlugs.includes(slug);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter === "live" && hiddenSlugs.includes(i.slug)) return false;
      if (filter === "hidden" && !hiddenSlugs.includes(i.slug)) return false;
      if (groupFilter && i.group !== groupFilter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        (i.botanicalName ?? "").toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.usedIn.join(" ").toLowerCase().includes(q)
      );
    });
  }, [items, hiddenSlugs, query, filter, groupFilter]);

  const live = items.filter((i) => !hiddenSlugs.includes(i.slug));
  const stats = [
    { label: "Live ingredients", value: live.length },
    { label: "Hidden", value: hiddenSlugs.length },
    { label: "Families", value: groups.length },
    { label: "Added by you", value: items.filter((i) => isCustomIngredient(i.slug)).length },
  ];

  function addGroup() {
    const name = newGroup.trim();
    if (!name) return;
    saveIngredientGroups([...groups, name]);
    setNewGroup("");
    refresh();
  }

  function moveGroup(index: number, delta: number) {
    const next = [...groups];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    saveIngredientGroups(next);
    refresh();
  }

  function removeGroup(group: IngredientGroup) {
    const inUse = items.filter((i) => i.group === group).length;
    if (inUse > 0) {
      window.alert(
        `"${group}" still has ${inUse} ingredient${inUse === 1 ? "" : "s"} in it. Move them to another family first — removing the family would leave them without a home.`,
      );
      return;
    }
    saveIngredientGroups(groups.filter((g) => g !== group));
    refresh();
  }

  function rename(group: IngredientGroup) {
    const next = window.prompt(`Rename "${group}" to:`, group);
    if (!next) return;
    renameIngredientGroup(group, next);
    refresh();
  }

  const inputCls =
    "rounded-full border border-forest/15 bg-white px-4 py-2 text-sm focus:border-moss focus:outline-none";

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-forest/8 bg-white/60 px-4 py-3">
            <p className="text-xs text-forest/55">{s.label}</p>
            <p className="mt-0.5 font-serif text-xl font-semibold text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Families */}
      <section className="mt-6 rounded-lg border border-forest/8 bg-white/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-semibold text-forest">Families</h2>
            <p className="mt-0.5 text-sm text-forest/60">
              The headings ingredients are grouped under on the Ingredients page, in this order.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setManagingGroups((v) => !v)}
            className="rounded-full border border-forest/20 px-4 py-1.5 text-sm font-medium text-forest hover:bg-forest/5"
          >
            {managingGroups ? "Done" : "Manage families"}
          </button>
        </div>

        {managingGroups ? (
          <>
            <ul className="mt-4 divide-y divide-forest/8">
              {groups.map((g, idx) => {
                const count = items.filter((i) => i.group === g).length;
                return (
                  <li key={g} className="flex flex-wrap items-center gap-3 py-2.5">
                    <span className="flex-1 text-sm font-medium text-forest">
                      {g} <span className="font-normal text-forest/45">({count})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => moveGroup(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Move ${g} up`}
                      className="rounded-full border border-forest/15 px-2.5 py-1 text-xs text-forest hover:bg-forest/5 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGroup(idx, 1)}
                      disabled={idx === groups.length - 1}
                      aria-label={`Move ${g} down`}
                      className="rounded-full border border-forest/15 px-2.5 py-1 text-xs text-forest hover:bg-forest/5 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => rename(g)}
                      className="text-xs font-medium text-moss hover:text-forest"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGroup(g)}
                      className="text-xs font-medium text-forest/50 hover:text-clay"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGroup()}
                placeholder="New family name"
                className={`${inputCls} min-w-[16rem] flex-1`}
              />
              <button
                type="button"
                onClick={addGroup}
                className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-cream hover:bg-ink"
              >
                Add family
              </button>
            </div>
            <p className="mt-2 text-xs text-forest/45">
              Renaming a family also moves every ingredient in it, so nothing is left behind.
            </p>
          </>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {groups.map((g) => (
              <span
                key={g}
                className="rounded-full bg-parchment px-3 py-1 text-xs font-medium text-forest/70"
              >
                {g} · {items.filter((i) => i.group === g).length}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, family or product…"
          className={`${inputCls} min-w-[15rem] flex-1`}
        />
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          aria-label="Filter by family"
          className={inputCls}
        >
          <option value="">All families</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="inline-flex rounded-full border border-forest/15 bg-white/60 p-1">
          {(["all", "live", "hidden"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1 text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-forest text-cream" : "text-forest/65 hover:text-forest"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-forest/8 bg-parchment/40 text-left text-xs font-medium text-forest/55">
              <tr>
                <th className="px-4 py-3">Ingredient</th>
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">Found in</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/8">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-forest/55">
                    No ingredients match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((ing) => {
                const hidden = isHidden(ing.slug);
                const custom = isCustomIngredient(ing.slug);
                return (
                  <tr key={ing.slug} className={hidden ? "opacity-60" : undefined}>
                    <td className="px-4 py-3">
                      <Link
                        href={`/studio/ingredients/${ing.slug}`}
                        className="font-medium text-forest hover:text-moss"
                      >
                        {ing.name}
                      </Link>
                      {ing.botanicalName && (
                        <p className="text-xs italic text-forest/45">{ing.botanicalName}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-forest/70">{ing.group}</td>
                    <td className="px-4 py-3 text-forest/60">
                      {ing.usedIn.length ? ing.usedIn.join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          hidden ? "bg-forest/8 text-forest/55" : "bg-moss/12 text-moss"
                        }`}
                      >
                        {hidden ? "Hidden" : "Live"}
                      </span>
                      {custom && (
                        <span className="ml-1.5 rounded-full bg-clay/12 px-2 py-0.5 text-[0.65rem] font-medium text-clay">
                          Added
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-3">
                        <Link
                          href={`/studio/ingredients/${ing.slug}`}
                          className="text-xs font-medium text-moss hover:text-forest"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setIngredientHidden(ing.slug, !hidden);
                            refresh();
                          }}
                          className="text-xs font-medium text-forest/60 hover:text-forest"
                        >
                          {hidden ? "Show" : "Hide"}
                        </button>
                        {custom ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (!window.confirm(`Delete "${ing.name}" permanently?`)) return;
                              deleteIngredient(ing.slug);
                              refresh();
                            }}
                            className="text-xs font-medium text-forest/50 hover:text-clay"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              resetIngredient(ing.slug);
                              refresh();
                            }}
                            className="text-xs font-medium text-forest/50 hover:text-forest"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-forest/45">
          Changes appear on the public Ingredients page straight away.
        </p>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm("Reset the whole ingredient library back to the original set? Your edits and added ingredients will be lost.")) return;
            resetIngredientLibrary();
            refresh();
          }}
          className="text-xs font-medium text-forest/50 hover:text-clay"
        >
          Reset entire library
        </button>
      </div>
    </div>
  );
}
