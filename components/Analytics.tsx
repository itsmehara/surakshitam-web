"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GA_ID, isLiveHost } from "@/lib/analytics";

// Google Analytics 4, consent first (DPDP Act): nothing from Google loads until the visitor
// clicks Allow. The choice is kept in this browser; the Privacy page can change it.
// Live domain only, so local dev and previews never count (and never show the banner).
const KEY = "sn-analytics";
const OPEN = "sn:analytics-choice"; // event the Privacy page fires to reopen the banner
type Choice = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
function save(c: Exclude<Choice, null>) {
  try {
    localStorage.setItem(KEY, c);
  } catch {}
}

function load() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false; // undo an earlier "No thanks"
  if (window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  window.dataLayer = window.dataLayer || [];
  // gtag must push the real `arguments` object, as Google's snippet does.
  window.gtag = function () {
    window.dataLayer!.push(arguments); // eslint-disable-line prefer-rest-params
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function stop() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  // Remove the _ga cookies set while it was allowed.
  const host = location.hostname.replace(/^www\./, "");
  document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n.startsWith("_ga_"))
    .forEach((n) => {
      for (const d of ["", `; domain=${host}`, `; domain=.${host}`]) document.cookie = `${n}=; Max-Age=0; path=/${d}`;
    });
}

export function Analytics() {
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!isLiveHost()) return;
    const c = read();
    if (c === "granted") load();
    // Deferred a tick so the banner mounts after hydration.
    const t = c === null ? window.setTimeout(() => setAsk(true), 0) : 0;
    const reopen = () => setAsk(true);
    window.addEventListener(OPEN, reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(OPEN, reopen);
    };
  }, []);

  if (!ask) return null;
  const choose = (c: Exclude<Choice, null>) => {
    save(c);
    if (c === "granted") load();
    else stop();
    setAsk(false);
  };
  return (
    <div
      role="dialog"
      aria-label="Analytics choice"
      className="fixed bottom-3 left-3 z-[60] w-[calc(100vw-24px)] max-w-[420px] rounded-2xl border border-forest/10 bg-cream/95 p-4 shadow-xl backdrop-blur sm:bottom-5 sm:left-5"
    >
      <p className="text-sm leading-relaxed text-forest/80">
        May we use Google Analytics to see which pages and products people find useful? No ads, nothing sold.{" "}
        <Link href="/privacy/" className="text-moss underline underline-offset-2 hover:text-forest">
          Privacy
        </Link>
      </p>
      <div className="mt-3 flex gap-2.5">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-full border border-forest/25 px-3 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
        >
          No thanks
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-full bg-forest px-3 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest/90"
        >
          Allow
        </button>
      </div>
    </div>
  );
}

// On the Privacy page: shows the current choice and reopens the banner to change it.
export function AnalyticsChoice() {
  const [choice, setChoice] = useState<Choice | "unknown">("unknown");
  useEffect(() => {
    const t = window.setTimeout(() => setChoice(read()), 0);
    const sync = () => window.setTimeout(() => setChoice(read()), 0);
    window.addEventListener("storage", sync);
    window.addEventListener("click", sync);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("storage", sync);
      window.removeEventListener("click", sync);
    };
  }, []);
  return (
    <span>
      Your choice on this device:{" "}
      <strong className="font-semibold text-forest">
        {choice === "granted" ? "Allowed" : choice === "denied" ? "Not allowed" : "Not chosen yet"}
      </strong>{" "}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN))}
        className="text-moss underline underline-offset-2 hover:text-forest"
      >
        Change
      </button>
    </span>
  );
}
