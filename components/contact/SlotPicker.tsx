"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

/**
 * Consultation slot picker — a native date input (Mon–Sat, next 30 days) plus
 * a grid of 30-minute starts from 10:00 to 16:30, so every slot ends by 5 pm.
 * Past slots are disabled when the chosen day is today. The value handed
 * back is one readable string ("Sat 20 Sep 2026, 10:30–11:00") — that is
 * what the Sheet, the alert email and the WhatsApp fallback all show.
 */
export const CONSULT_START = 10; // 10:00
export const CONSULT_END = 17; // 17:00 — last slot starts 16:30
export const SLOT_MINUTES = 30;

type Slot = { start: string; end: string; minutes: number };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function label(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h < 12 ? "am" : "pm";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${pad(m)} ${ampm}` : `${h12} ${ampm}`;
}

export const SLOTS: Slot[] = (() => {
  const out: Slot[] = [];
  for (let m = CONSULT_START * 60; m + SLOT_MINUTES <= CONSULT_END * 60; m += SLOT_MINUTES) {
    out.push({ start: label(m), end: label(m + SLOT_MINUTES), minutes: m });
  }
  return out;
})();

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatSlot(date: string, minutes: number): string {
  const d = new Date(`${date}T00:00:00`);
  const day = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  return `${day}, ${label(minutes)}–${label(minutes + SLOT_MINUTES)}`;
}

export function SlotPicker({
  date,
  minutes,
  onChange,
}: {
  date: string;
  minutes: number | null;
  onChange: (next: { date: string; minutes: number | null }) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const min = toISODate(today);
  const max = toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30));

  const chosen = date ? new Date(`${date}T00:00:00`) : null;
  const isSunday = chosen?.getDay() === 0;
  const isToday = date === min;
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="enq-date" className="mb-1.5 block text-sm font-medium text-forest">
          Preferred day <span className="text-clay">*</span>
        </label>
        <input
          id="enq-date"
          type="date"
          required
          min={min}
          max={max}
          value={date}
          onChange={(e) => onChange({ date: e.target.value, minutes: null })}
          className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm text-forest focus:border-moss focus:outline-none sm:max-w-xs"
        />
        <p className="mt-1 text-xs text-forest/50">Mon–Sat · slots between 10 am and 5 pm · 30 minutes each</p>
        {isSunday && (
          <p className="mt-1 text-xs font-medium text-clay">We&apos;re closed on Sundays — please pick another day.</p>
        )}
      </div>

      {date && !isSunday && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-forest">
            Preferred time <span className="text-clay">*</span>
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" role="radiogroup" aria-label="Time slot">
            {SLOTS.map((s) => {
              const past = isToday && s.minutes <= nowMinutes;
              const active = minutes === s.minutes;
              return (
                <button
                  key={s.minutes}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={past}
                  onClick={() => onChange({ date, minutes: s.minutes })}
                  className={cn(
                    "rounded-full border px-2 py-2 text-xs font-medium transition-colors",
                    active
                      ? "border-forest bg-forest text-cream"
                      : past
                        ? "cursor-not-allowed border-forest/8 text-forest/30 line-through"
                        : "border-forest/15 text-forest hover:border-forest/40",
                  )}
                >
                  {s.start}
                </button>
              );
            })}
          </div>
          {minutes !== null && (
            <p className="mt-2 text-xs text-forest/60">
              Selected: <span className="font-medium text-forest">{formatSlot(date, minutes)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
