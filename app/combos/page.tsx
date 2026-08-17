import { redirect } from "next/navigation";

// Combos now live inside the unified /offers page (Offers/Combos tab switcher) — keep this route
// alive as a redirect so any old links/bookmarks still land somewhere useful.
export default function CombosRedirect() {
  redirect("/offers?tab=combos");
}
