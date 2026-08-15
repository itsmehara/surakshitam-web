import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <ComingSoon
      title="Search"
      description="Product, category and ingredient search is coming in the next build phase. For now, browse the full catalogue."
      note="Planned: search by product, category & ingredient"
    />
  );
}
