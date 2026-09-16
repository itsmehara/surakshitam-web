"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";

/**
 * Billboard splash: the campaign artwork rises over the page for ten seconds,
 * then slowly dissolves. Shown at most once every 15 minutes per browser — the last
 * showing is stamped in localStorage, so a visitor bouncing between pages
 * doesn't get it on every load.
 *
 * Timeline (ms): 0 → fade/scale in · HOLD → begin the dissolve · TOTAL → gone.
 * The dissolve is the long part (2.5 s) on purpose — a hard cut would read
 * like a pop-up ad, a slow melt reads like a billboard passing by.
 *
 * Renders nothing on the server and nothing until the timing check passes, so
 * there is no hydration mismatch and no flash on repeat visits. Escape, the
 * × button and a click outside all dismiss it early. Reduced-motion visitors
 * get the same timing without the scale/blur, just a plain fade.
 */

const SPLASH = {
  src: "/splash/rose-face-wash-billboard.webp",
  width: 1400,
  height: 934,
  alt: "Surakshitam Naturals — Rose Face Wash billboard",
};

const STORAGE_KEY = "sn-splash-last-shown";
const EVERY_MS = 15 * 60 * 1000; // once every 15 minutes
const ENTER_DELAY_MS = 1_200;    // let the hero paint first, then the billboard rises over it
const TOTAL_MS = 10_000;         // on screen for ten seconds, dissolve included
const DISSOLVE_MS = 2_500;
const HOLD_MS = TOTAL_MS - DISSOLVE_MS;

function dueNow(): boolean {
  // `?splash=1` forces it regardless of the 15-minute stamp — for previewing the
  // artwork or showing a client without clearing site data first.
  if (new URLSearchParams(window.location.search).get("splash") === "1") return true;
  try {
    const last = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    return !last || Date.now() - last > EVERY_MS;
  } catch {
    return true; // private mode / storage blocked — show it, nothing to remember against
  }
}

function stamp() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

// Decided once per page load. React StrictMode runs effects twice in dev, and
// the second run must not see its own stamp from the first and bail out.
let decided: boolean | null = null;
function shouldShow(): boolean {
  if (decided === null) {
    decided = dueNow();
    if (decided) stamp();
  }
  return decided;
}

// pre = mounted but still transparent, so the entrance transition has a starting state
type Phase = "hidden" | "pre" | "in" | "out";

export function SplashBillboard() {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (!shouldShow()) return;
    // mount in the pre-enter state, then flip to "in" a beat later so the transition plays.
    // Timeouts rather than requestAnimationFrame: rAF never fires in a background tab,
    // which would leave the billboard mounted but invisible until the visitor tabs back.
    const pre = setTimeout(() => setPhase("pre"), ENTER_DELAY_MS);
    const enter = setTimeout(() => setPhase("in"), ENTER_DELAY_MS + 50);
    const out = setTimeout(() => setPhase("out"), ENTER_DELAY_MS + HOLD_MS);
    const gone = setTimeout(() => setPhase("hidden"), ENTER_DELAY_MS + TOTAL_MS);
    return () => { clearTimeout(pre); clearTimeout(enter); clearTimeout(out); clearTimeout(gone); };
  }, []);

  useEffect(() => {
    if (phase === "hidden") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPhase("out");
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase]);

  // an early dismiss still dissolves rather than vanishing
  useEffect(() => {
    if (phase !== "out") return;
    const t = setTimeout(() => setPhase("hidden"), DISSOLVE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "hidden") return null;
  const visible = phase === "in";

  return (
    <div
      role="dialog"
      aria-label="Surakshitam Naturals billboard"
      onClick={() => setPhase("out")}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-forest/55 p-4 backdrop-blur-sm"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${visible ? 600 : DISSOLVE_MS}ms ease`,
      }}
    >
      {/* ~58% of the viewport on desktop; phones get most of the width or the artwork is unreadable */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[94vw] max-w-[1200px] sm:w-[78vw] lg:w-[58vw] motion-reduce:!transform-none motion-reduce:!filter-none"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
          filter: visible ? "blur(0)" : "blur(6px)",
          transition: `transform ${visible ? 600 : DISSOLVE_MS}ms cubic-bezier(0.22,1,0.36,1), filter ${visible ? 600 : DISSOLVE_MS}ms ease`,
        }}
      >
        <button
          type="button"
          onClick={() => setPhase("out")}
          aria-label="Close"
          className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-card"
        >
          <CloseIcon width={18} />
        </button>
        <Image
          src={SPLASH.src}
          alt={SPLASH.alt}
          width={SPLASH.width}
          height={SPLASH.height}
          priority
          sizes="(max-width: 640px) 94vw, (max-width: 1024px) 78vw, 58vw"
          className="h-auto w-full rounded-2xl shadow-[0_24px_60px_rgba(20,30,15,0.45)] ring-1 ring-white/20"
        />
      </div>
    </div>
  );
}
