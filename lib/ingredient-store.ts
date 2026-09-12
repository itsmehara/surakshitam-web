/**
 * Admin ingredient library (prototype).
 *
 * The storefront ships a seed library in `ingredients.ts` (server-rendered, so
 * the page has real content for search engines on first paint). This store lets
 * the admin manage that library on top of the seed, persisted in localStorage
 * so the demo stays self-contained:
 *
 *   - edit a seed ingredient (name, family, summary, why, properties, products)
 *   - add a brand-new ingredient
 *   - hide one without deleting it
 *   - add, rename and reorder the families ingredients are grouped under
 *
 * Same shape as `catalog-store.ts` on purpose — one pattern to learn, and one
 * pattern to port when this moves to a real database.
 *
 * PRODUCTION: maps to Supabase `ingredients` + `ingredient_groups` tables with
 * an admin-only API (see surakshitam-docs/docs/DATA_MODEL.md). The public
 * ingredients page then reads them server-side and this client store goes away.
 */

import { ingredients as seedIngredients, DEFAULT_INGREDIENT_GROUPS } from "./ingredients";
import type { Ingredient, IngredientGroup } from "./types";
import { getAdminSession } from "./admin";
import { logEvent } from "./audit";

const KEY = "sn-ingredients-v1";

interface IngredientState {
  /** Full Ingredient objects keyed by slug — edited seed entries AND new ones. */
  overrides: Record<string, Ingredient>;
  /** Slugs the admin has hidden from the storefront. */
  hidden: string[];
  /**
   * The ordered family list, once the admin has touched it. `null` means
   * "still using the shipped defaults" — kept distinct from an empty array so a
   * deliberate reset is different from never having customised it.
   */
  groups: IngredientGroup[] | null;
}

const EMPTY: IngredientState = { overrides: {}, hidden: [], groups: null };

function read(): IngredientState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<IngredientState>;
    return {
      overrides: parsed.overrides ?? {},
      hidden: parsed.hidden ?? [],
      groups: parsed.groups ?? null,
    };
  } catch {
    return EMPTY;
  }
}

function write(state: IngredientState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  // The public page and the admin list can be mounted at the same time; this
  // lets both refresh without a reload. (`storage` only fires in *other* tabs.)
  try {
    window.dispatchEvent(new Event(INGREDIENTS_CHANGED));
  } catch {
    /* ignore */
  }
}

/** Event name fired in this tab whenever the library changes. */
export const INGREDIENTS_CHANGED = "sn-ingredients-changed";

function audit(action: string, name: string): void {
  const admin = getAdminSession();
  logEvent({
    type: "ingredient_update",
    actor: { kind: "admin", name: admin?.name },
    meta: { action, ingredient: name },
  });
}

/* ------------------------------ reading ------------------------------ */

/** True if the slug is a brand-new admin ingredient (not part of the seed). */
export function isCustomIngredient(slug: string): boolean {
  return !seedIngredients.some((i) => i.slug === slug);
}

/**
 * Merged library: seed overlaid with admin edits + additions.
 * Hidden entries are excluded by default (that's the storefront view); pass
 * `{ includeHidden: true }` for the admin management table.
 */
export function getIngredients(opts?: { includeHidden?: boolean }): Ingredient[] {
  const { overrides, hidden } = read();
  const map = new Map<string, Ingredient>();
  for (const i of seedIngredients) map.set(i.slug, i);
  for (const [slug, i] of Object.entries(overrides)) map.set(slug, i);
  if (!opts?.includeHidden) for (const slug of hidden) map.delete(slug);
  return [...map.values()];
}

export function getIngredient(slug: string): Ingredient | undefined {
  return getIngredients({ includeHidden: true }).find((i) => i.slug === slug);
}

export function getHiddenIngredientSlugs(): string[] {
  return read().hidden;
}

/**
 * The families to show, in order. Any family actually used by an ingredient is
 * appended even if it isn't in the saved list — so removing a family from the
 * list can never strand the ingredients sitting in it.
 */
export function getIngredientGroups(opts?: { includeHidden?: boolean }): IngredientGroup[] {
  const { groups } = read();
  const ordered = groups ?? [...DEFAULT_INGREDIENT_GROUPS];
  const seen = new Set(ordered);
  for (const ing of getIngredients(opts)) {
    if (ing.group && !seen.has(ing.group)) {
      ordered.push(ing.group);
      seen.add(ing.group);
    }
  }
  return ordered;
}

export function getIngredientsByGroup(
  group: IngredientGroup,
  opts?: { includeHidden?: boolean },
): Ingredient[] {
  return getIngredients(opts).filter((i) => i.group === group);
}

/* ------------------------------ writing ------------------------------ */

/** Create or update an ingredient (keyed by slug). */
export function saveIngredient(ingredient: Ingredient): void {
  const existed = !!getIngredient(ingredient.slug);
  const state = read();
  state.overrides[ingredient.slug] = ingredient;
  state.hidden = state.hidden.filter((h) => h !== ingredient.slug);
  write(state);
  audit(existed ? "edited" : "added", ingredient.name);
}

/** Show/hide an ingredient on the storefront (works for seed and custom). */
export function setIngredientHidden(slug: string, hidden: boolean): void {
  const state = read();
  const has = state.hidden.includes(slug);
  if (hidden && !has) state.hidden.push(slug);
  if (!hidden && has) state.hidden = state.hidden.filter((h) => h !== slug);
  write(state);
  audit(hidden ? "hidden" : "shown", getIngredient(slug)?.name ?? slug);
}

/** Permanently remove a custom ingredient. Seed entries can only be hidden. */
export function deleteIngredient(slug: string): void {
  if (!isCustomIngredient(slug)) return;
  const name = getIngredient(slug)?.name ?? slug;
  const state = read();
  delete state.overrides[slug];
  state.hidden = state.hidden.filter((h) => h !== slug);
  write(state);
  audit("deleted", name);
}

/** Revert a seed ingredient to its shipped values / un-hide it. */
export function resetIngredient(slug: string): void {
  const state = read();
  delete state.overrides[slug];
  state.hidden = state.hidden.filter((h) => h !== slug);
  write(state);
  audit("reset", getIngredient(slug)?.name ?? slug);
}

/** Replace the family list (order matters — it's the order shown on the page). */
export function saveIngredientGroups(groups: IngredientGroup[]): void {
  const cleaned = groups.map((g) => g.trim()).filter(Boolean);
  const state = read();
  state.groups = [...new Set(cleaned)];
  write(state);
  audit("families updated", `${state.groups.length} families`);
}

/**
 * Renames a family everywhere: in the ordered list AND on every ingredient
 * currently filed under it, so nothing is orphaned by the rename.
 */
export function renameIngredientGroup(from: IngredientGroup, to: IngredientGroup): void {
  const next = to.trim();
  if (!next || next === from) return;
  const state = read();
  const current = state.groups ?? [...DEFAULT_INGREDIENT_GROUPS];
  state.groups = [...new Set(current.map((g) => (g === from ? next : g)))];
  for (const ing of getIngredients({ includeHidden: true })) {
    if (ing.group === from) state.overrides[ing.slug] = { ...ing, group: next };
  }
  write(state);
  audit("family renamed", `${from} → ${next}`);
}

/** Reset the whole library back to the shipped seed. */
export function resetIngredientLibrary(): void {
  write({ ...EMPTY });
  audit("library reset", "all ingredients");
}

/* ------------------------------ helpers ------------------------------ */

export const slugifyIngredient = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** A blank ingredient scaffold for the "add ingredient" form. */
export function blankIngredient(): Ingredient {
  return {
    slug: "",
    name: "",
    botanicalName: "",
    group: DEFAULT_INGREDIENT_GROUPS[0],
    summary: "",
    why: "",
    properties: [],
    usedIn: [],
  };
}

/** Ensure an ingredient has a slug (derived from its name if left empty). */
export function withIngredientSlug(ingredient: Ingredient): Ingredient {
  return { ...ingredient, slug: ingredient.slug?.trim() || slugifyIngredient(ingredient.name) };
}
