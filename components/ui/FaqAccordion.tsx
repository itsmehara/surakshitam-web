"use client";

import { useState } from "react";
import { ChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-forest/10 border-y border-forest/10">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="font-serif text-base font-semibold text-forest sm:text-lg">
                {item.question}
              </span>
              <ChevronDown
                width={18}
                className={cn("shrink-0 text-forest/50 transition-transform duration-200", open && "rotate-180")}
              />
            </button>
            {open && (
              <p className="pb-4 pr-8 text-sm leading-relaxed text-forest/70">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
