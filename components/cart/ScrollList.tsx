"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A scrolling <ul> with a scrollbar that is always drawn when the list overflows.
 * Phones hide the built-in scrollbar, so a long cart looked complete with rows cut
 * off (14 Nov 2026). The built-in bar is hidden (.sn-cart-scroll) and this one is
 * drawn instead, on every screen size. `watch` re-measures when the rows change.
 */
export function ScrollList({
  className,
  watch,
  children,
}: {
  className?: string;
  watch?: unknown;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight <= clientHeight + 1) return setBar(null);
      const height = Math.max(15, (clientHeight / scrollHeight) * 100);
      const top = (scrollTop / (scrollHeight - clientHeight)) * (100 - height);
      setBar({ top, height });
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [watch]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <ul ref={ref} className={cn("sn-cart-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}>
        {children}
      </ul>
      {bar && (
        <div aria-hidden className="pointer-events-none absolute bottom-1.5 right-1 top-1.5 w-1.5 rounded-full bg-forest/10">
          <div
            className="absolute left-0 w-full rounded-full bg-forest/60"
            style={{ top: `${bar.top}%`, height: `${bar.height}%` }}
          />
        </div>
      )}
    </div>
  );
}
