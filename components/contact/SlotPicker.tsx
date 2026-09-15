"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

/**
 * Consultation slot picker — one row: a native date input (Mon–Sat, next 30
 * days) beside a dropdown of 30-minute starts from 10:00 to 16:30, so every
 * slot ends by 5 pm. Past slots are disabled when the chosen day is today.
 * The value handed back is one readable string ("Sat 20 Sep 2026, 10:30–11:00")
 * — what the Sheet, the alert email and the WhatsApp fallback all show.
 * Slots are preferences: the founders confirm against real availability.
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

const inputClass =
  "w-full rounded-lg border border-forest/15 bg-white px-3 py-2.5 text-sm text-forest focus:border-moss focus:outline-none disabled:bg-parchment/60 disabled:text-forest/40";

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
  const timeDisabled = !date || isSunday;

  return (
    <div>
      {/* Availability notice — must be read before choosing: serif, dark amber, left accent bar */}
      <div
        role="note"
        className="mb-3 flex gap-3 rounded-lg border border-amber-400 border-l-4 border-l-amber-600 bg-amber-100 px-3.5 py-3"
      >
        <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600 font-serif text-xs font-bold text-white">
          !
        </span>
        <p className="font-serif text-[0.95rem] leading-snug text-amber-950">
          <span className="font-bold">Slots are confirmed on availability.</span> If your preferred time is
          already taken, we&apos;ll offer you the next available slot on WhatsApp.
          <span className="mt-1 block font-sans text-xs font-semibold tracking-wide text-amber-900">
            Mon–Sat, 10 am – 5 pm · 30 minutes · first consultation free
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
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
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enq-time" className="mb-1.5 block text-sm font-medium text-forest">
            Preferred time <span className="text-clay">*</span>
          </label>
          <select
            id="enq-time"
            required
            disabled={timeDisabled}
            value={minutes ?? ""}
            onChange={(e) => onChange({ date, minutes: e.target.value === "" ? null : Number(e.target.value) })}
            className={cn(inputClass, "pr-8")}
          >
            <option value="">{date ? "Choose a time" : "Pick a day first"}</option>
            {SLOTS.map((s) => {
              const past = isToday && s.minutes <= nowMinutes;
              return (
                <option key={s.minutes} value={s.minutes} disabled={past}>
                  {s.start}
                  {past ? " (passed)" : ""}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {isSunday ? (
        <p className="mt-1.5 text-xs font-medium text-clay">We&apos;re closed on Sundays — please pick another day.</p>
      ) : date && minutes !== null ? (
        <p className="mt-1.5 text-xs text-forest/60">
          Requested: <span className="font-medium text-forest">{formatSlot(date, minutes)}</span>
        </p>
      ) : null}
    </div>
  );
}
