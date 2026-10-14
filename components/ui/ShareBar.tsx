"use client";

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { gaEvent } from "@/lib/analytics";
import { site } from "@/lib/site";
import type { Product } from "@/lib/types";
import { WhatsAppIcon, FacebookIcon, XIcon, ThreadsIcon, ShareIcon, LinkIcon, CheckIcon } from "@/components/icons";

/**
 * Share a product on WhatsApp (pre-filled message with benefits; no price on purpose — the reader
 * taps through to the site or asks, Hara 14 Oct), Facebook, X, Threads, the phone's own share sheet
 * (Instagram, Telegram…) or by copying the link. Plain links — no third-party scripts. The link
 * preview (photo, title, description) comes from the page's Open Graph tags and
 * public/share/<slug>.jpg.
 *
 * <ShareBar>  — the full row of buttons, on the product page.
 * <ShareMenu> — one share icon that pops the same buttons, on listing cards.
 */

type ShareProduct = Pick<Product, "slug" | "name" | "shortDescription" | "benefits">;
type Target = { method: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; href: string };

function shareData(p: ShareProduct) {
  const url = `${site.url}/product/${p.slug}/`;
  const waText = [
    `🌿 *${p.name}* — Surakshitam Naturals`,
    p.shortDescription,
    "",
    ...p.benefits.slice(0, 3).map((b) => `✓ ${b}`),
    "",
    `Price & order 👉 ${url}`,
  ].join("\n");
  const shortText = `${p.name} — Surakshitam Naturals. ${p.shortDescription}`;
  const targets: Target[] = [
    { method: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon, href: `https://wa.me/?text=${encodeURIComponent(waText)}` },
    { method: "facebook", label: "Facebook", icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { method: "x", label: "X", icon: XIcon, href: `https://x.com/intent/post?text=${encodeURIComponent(shortText)}&url=${encodeURIComponent(url)}` },
    { method: "threads", label: "Threads", icon: ThreadsIcon, href: `https://www.threads.net/intent/post?text=${encodeURIComponent(`${shortText} ${url}`)}` },
  ];
  return { url, shortText, targets };
}

const track = (method: string, slug: string) => gaEvent("share", { method, content_type: "product", item_id: slug });

const btn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-forest/20 bg-forest/10 text-forest transition-colors hover:border-forest/35 hover:bg-forest/20";

/** The buttons themselves; shared by the bar and the pop-up menu. */
function ShareButtons({ product, onDone }: { product: ShareProduct; onDone?: () => void }) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && !!navigator.share), []);
  const { url, shortText, targets } = shareData(product);

  return (
    <>
      {targets.map(({ method, label, icon: Icon, href }) => (
        <a
          key={method}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          title={`Share on ${label}`}
          onClick={() => {
            track(method, product.slug);
            onDone?.();
          }}
          className={btn}
        >
          <Icon width={17} height={17} />
        </a>
      ))}
      {canShare && (
        <button
          type="button"
          aria-label="More ways to share (Instagram, Telegram…)"
          title="More ways to share"
          className={btn}
          onClick={() => {
            track("native", product.slug);
            navigator.share({ title: product.name, text: shortText, url }).catch(() => {});
            onDone?.();
          }}
        >
          <ShareIcon width={17} height={17} />
        </button>
      )}
      <button
        type="button"
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className={btn}
        onClick={() => {
          track("copy_link", product.slug);
          navigator.clipboard?.writeText(url).then(
            () => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            },
            () => {},
          );
        }}
      >
        {copied ? <CheckIcon width={17} height={17} className="text-moss" /> : <LinkIcon width={17} height={17} />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </>
  );
}

export function ShareBar({ product }: { product: ShareProduct }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-forest/60">Share</span>
      <ShareButtons product={product} />
    </div>
  );
}

/**
 * One share icon for listing cards. The pop-up is position: fixed (cards clip their overflow),
 * placed from the icon's position; it closes on outside tap, Esc, scroll or resize.
 */
export function ShareMenu({ product, className = "" }: { product: ShareProduct; className?: string }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const POP_W = 168; // 3 buttons a row

  useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!popRef.current?.contains(t) && !btnRef.current?.contains(t)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return setPos(null);
    const r = btnRef.current!.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.right - POP_W), window.innerWidth - POP_W - 8);
    setPos({ top: r.bottom + 6, left });
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`Share ${product.name}`}
        aria-expanded={!!pos}
        title="Share"
        onClick={toggle}
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-forest/75 text-cream shadow-sm backdrop-blur transition-colors hover:bg-forest ${className}`}
      >
        <ShareIcon width={15} height={15} />
      </button>
      {pos && (
        <div
          ref={popRef}
          role="dialog"
          aria-label={`Share ${product.name}`}
          style={{ top: pos.top, left: pos.left, width: POP_W }}
          className="fixed z-[65] flex flex-wrap gap-2 rounded-2xl border border-forest/10 bg-cream p-3 shadow-xl"
        >
          <ShareButtons product={product} onDone={() => setPos(null)} />
        </div>
      )}
    </>
  );
}
