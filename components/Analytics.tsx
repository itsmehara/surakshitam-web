"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_ID, isLiveHost } from "@/lib/analytics";

/** Google tag (gtag.js) for GA4 — rendered only on the live domain. */
export function Analytics() {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(isLiveHost()), []);
  if (!live) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
