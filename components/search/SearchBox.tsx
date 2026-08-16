"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
      className="relative"
    >
      <SearchIcon
        width={20}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest/40"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
        aria-label="Search products and ingredients"
        placeholder="Search products, categories or ingredients…"
        className="w-full rounded-full border border-forest/15 bg-white py-3.5 pl-12 pr-28 text-sm text-forest shadow-soft focus:border-moss focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-forest px-5 py-2 text-sm font-medium text-cream hover:bg-ink"
      >
        Search
      </button>
    </form>
  );
}
