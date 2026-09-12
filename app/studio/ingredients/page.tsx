import { redirect } from "next/navigation";

/**
 * The ingredient library lives as a tab inside Products, so this bare path has
 * no screen of its own. It's still a URL people will reasonably reach for —
 * the header highlights Products for it, and both ingredient forms sit beneath
 * it — so send them to the tab rather than a 404.
 */
export default function StudioIngredientsIndex() {
  redirect("/studio/products?tab=ingredients");
}
