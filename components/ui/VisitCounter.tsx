"use client";

import { useEffect, useState } from "react";
import { ENQUIRY_URL } from "@/lib/enquiry";

// Footer visit counter, kept by the same Apps Script as orders and enquiries
// (surakshitam-docs/tools/apps-script/Code.gs, "Visits" tab). One visit per browser tab
// session, so reloads and page changes don't inflate it. No cookies. Renders nothing until
// a count is known (fresh or remembered) — so it stays hidden if the script isn't redeployed.
const SEEN = "sn-visit-counted";
// Google's script can take 5–15 s to wake up on a quiet site, so a returning visitor sees the
// last count they were shown straight away; it updates when the script answers.
const LAST = "sn-visits-last";

export function VisitCounter() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    if (!ENQUIRY_URL) return;
    let last = 0;
    try {
      last = Number(localStorage.getItem(LAST)) || 0;
    } catch {}
    const early = last > 0 ? window.setTimeout(() => setVisits((v) => v ?? last), 0) : 0; // after hydration
    let counted = false;
    try {
      counted = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    const ctl = new AbortController();
    fetch(`${ENQUIRY_URL}?action=${counted ? "count" : "visit"}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: { ok?: boolean; visits?: unknown }) => {
        if (!j.ok || typeof j.visits !== "number") return;
        try {
          sessionStorage.setItem(SEEN, "1");
          localStorage.setItem(LAST, String(j.visits));
        } catch {}
        setVisits(j.visits);
      })
      .catch(() => {});
    return () => {
      window.clearTimeout(early);
      ctl.abort();
    };
  }, []);

  if (visits === null) return null;
  return (
    <>
      <span aria-hidden className="text-cream/30">|</span>
      <span>
        {visits.toLocaleString("en-IN")} {visits === 1 ? "visit" : "visits"}
      </span>
    </>
  );
}
