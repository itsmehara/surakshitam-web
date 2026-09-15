import type { Ingredient, IngredientGroup } from "@/lib/types";

export interface IngredientLibraryData {
  ingredients: Ingredient[];
  groups: IngredientGroup[];
}

/**
 * The ingredient library as customers see it. v3-static has no admin overlay
 * (that lived in lib/ingredient-store.ts on the v2 branch), so this is simply
 * the server-rendered seed passed straight through. Kept as a hook so
 * `IngredientLibrary` doesn't change shape when the backend version restores
 * live editing.
 */
export function useIngredientLibrary(seed: IngredientLibraryData): IngredientLibraryData {
  return seed;
}
