"use client";

import { useEffect, useState } from "react";
import {
  getIngredients,
  getIngredientGroups,
  INGREDIENTS_CHANGED,
} from "@/lib/ingredient-store";
import type { Ingredient, IngredientGroup } from "@/lib/types";

export interface IngredientLibraryData {
  ingredients: Ingredient[];
  groups: IngredientGroup[];
}

/**
 * The ingredient library as customers should see it.
 *
 * Starts from the server-rendered seed — so the page ships real content in its
 * HTML for search engines and for the first paint — then swaps in the admin's
 * saved version on mount, and again whenever it changes (in this tab or
 * another). The seed is the fallback, never the ceiling.
 */
export function useIngredientLibrary(seed: IngredientLibraryData): IngredientLibraryData {
  const [library, setLibrary] = useState<IngredientLibraryData>(seed);

  useEffect(() => {
    const read = () =>
      setLibrary({ ingredients: getIngredients(), groups: getIngredientGroups() });
    read();
    window.addEventListener(INGREDIENTS_CHANGED, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(INGREDIENTS_CHANGED, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return library;
}
