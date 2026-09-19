"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";

/**
 * Billboard splash: one of the campaign artworks rises over the page for ten
 * seconds, then slowly dissolves. Which one is picked at random on each showing
 * (never the same as the previous showing, so a repeat visitor sees the set
 * rotate). Shown at most once every 15 minutes per browser — the last
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

type Splash = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Cut-out on a transparent background: no card frame, the pack floats over the dimmed page. */
  transparent?: boolean;
  /** Set on artworks not yet approved for the random rotation — reachable only via ?splash=N. */
  previewOnly?: boolean;
};

/**
 * The set. Masters + hand-off notes live in
 * surakshitam-docs/source-assets/splash-masters/. Portrait artworks (the two
 * hair-oil "museum" pieces, 19 Sep) are sized by height so the whole bottle
 * and pedestal stay in view; the landscape one is sized by width as before.
 * The three "3d transparent" cut-outs (20 Sep) float frameless over the dimmed
 * page. All six rotate (approved by Hara, 20 Sep).
 */
const SPLASHES: Splash[] = [
  {
    src: "/splash/rose-face-wash-billboard.webp",
    width: 1400,
    height: 934,
    alt: "Surakshitam Naturals — Rose Face Wash billboard",
  },
  {
    src: "/splash/herbal-hair-oil-museum-gold-splash.webp",
    width: 1122,
    height: 1402,
    alt: "Surakshitam Naturals Herbal Hair Oil with a gold cap on a botanical museum pedestal",
  },
  {
    src: "/splash/herbal-hair-oil-museum-marble-splash.webp",
    width: 1122,
    height: 1402,
    alt: "Surakshitam Naturals Herbal Hair Oil as a marble botanical museum sculpture",
  },
  {
    src: "/splash/dishwash-liquid-3d-transparent-splash.webp",
    width: 1024,
    height: 1536,
    alt: "Surakshitam Naturals Dish Washing Liquid bottle",
    transparent: true,
  },
  {
    src: "/splash/floor-cleaner-3d-transparent-splash.webp",
    width: 1024,
    height: 1536,
    alt: "Surakshitam Naturals Floor Cleaner bottle",
    transparent: true,
  },
  {
    src: "/splash/herbal-shampoo-3d-transparent-splash.webp",
    width: 1024,
    height: 1536,
    alt: "Surakshitam Naturals Herbal Shampoo bottle",
    transparent: true,
  },
];

const LAST_INDEX_KEY = "sn-splash-last-index";

/** Random pick that avoids the previous showing's artwork. `?splash=N` forces index N (preview). */
function pickSplash(): Splash {
  const forced = Number(new URLSearchParams(window.location.search).get("splash"));
  if (forced >= 1 && forced <= SPLASHES.length) return SPLASHES[forced - 1];
  let last = -1;
  try {
    last = Number(localStorage.getItem(LAST_INDEX_KEY) ?? -1);
  } catch {
    /* ignore */
  }
  const candidates = SPLASHES.map((_, i) => i).filter((i) => i !== last && !SPLASHES[i].previewOnly);
  const idx = candidates[Math.floor(Math.random() * candidates.length)];
  try {
    localStorage.setItem(LAST_INDEX_KEY, String(idx));
  } catch {
    /* ignore */
  }
  return SPLASHES[idx];
}

const STORAGE_KEY = "sn-splash-last-shown";
const EVERY_MS = 15 * 60 * 1000; // once every 15 minutes
const ENTER_DELAY_MS = 1_200;    // let the hero paint first, then the billboard rises over it
const TOTAL_MS = 10_000;         // on screen for ten seconds, dissolve included
const DISSOLVE_MS = 2_500;
const HOLD_MS = TOTAL_MS - DISSOLVE_MS;

function dueNow(): boolean {
  // `?splash=1` (or 2, 3 …) forces it regardless of the 15-minute stamp — for
  // previewing an artwork or showing a client without clearing site data first.
  if (new URLSearchParams(window.location.search).get("splash")) return true;
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

// Decided (and picked) once per page load. React StrictMode runs effects twice
// in dev: the second run must not see its own stamp from the first and bail
// out, nor re-roll the artwork and land back on the previous showing's.
let decided: boolean | null = null;
let picked: Splash | null = null;
function shouldShow(): boolean {
  if (decided === null) {
    decided = dueNow();
    if (decided) {
      stamp();
      picked = pickSplash();
    }
  }
  return decided;
}

// pre = mounted but still transparent, so the entrance transition has a starting state
type Phase = "hidden" | "pre" | "in" | "out";

export function SplashBillboard() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [splash, setSplash] = useState<Splash | null>(null);

  useEffect(() => {
    if (!shouldShow()) return;
    setSplash(picked);
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

  if (phase === "hidden" || !splash) return null;
  const visible = phase === "in";
  const portrait = splash.height > splash.width;

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
      {/* Landscape: ~58% of the viewport on desktop, most of the width on phones.
          Portrait: capped by height (84svh) so bottle + pedestal are never cropped. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          portrait
            ? "relative motion-reduce:!transform-none motion-reduce:!filter-none"
            : "relative w-[94vw] max-w-[1200px] sm:w-[78vw] lg:w-[58vw] motion-reduce:!transform-none motion-reduce:!filter-none"
        }
        style={{
          width: portrait ? `min(90vw, calc(84svh * ${splash.width} / ${splash.height}), 680px)` : undefined,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(10px)",
          filter: visible ? "blur(0)" : "blur(6px)",
          transition: `transform ${visible ? 600 : DISSOLVE_MS}ms cubic-bezier(0.22,1,0.36,1), filter ${visible ? 600 : DISSOLVE_MS}ms ease`,
        }}
      >
        <button
          type="button"
          onClick={() => setPhase("out")}
          aria-label="Close"
          className={
            splash.transparent
              ? "absolute right-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-card"
              : "absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest shadow-card"
          }
        >
          <CloseIcon width={18} />
        </button>
        <Image
          src={splash.src}
          alt={splash.alt}
          width={splash.width}
          height={splash.height}
          priority
          sizes={portrait ? "(max-width: 640px) 90vw, 680px" : "(max-width: 640px) 94vw, (max-width: 1024px) 78vw, 58vw"}
          className={
            splash.transparent
              ? "h-auto w-full drop-shadow-[0_30px_40px_rgba(20,30,15,0.55)]"
              : "h-auto w-full rounded-2xl shadow-[0_24px_60px_rgba(20,30,15,0.45)] ring-1 ring-white/20"
          }
        />
      </div>
    </div>
  );
}
