"use client";

import { useEffect, useState } from "react";
import { gaEvent } from "@/lib/analytics";
import { WhatsAppIcon, FacebookIcon, XIcon, ThreadsIcon, ShareIcon, LinkIcon, CheckIcon } from "@/components/icons";

type Props = {
  /** Absolute product URL (canonical, on the live domain). */
  url: string;
  name: string;
  /** Short line under the name, e.g. the product's shortDescription. */
  tagline: string;
  /** Up to three benefits, shown as ✓ lines in the WhatsApp message. */
  benefits: string[];
  /** e.g. "100 g · MRP ₹104"; omitted when the pack is sold out or has no price. */
  price?: string;
  /** Product slug, for the GA share event. */
  slug: string;
};

/**
 * Share a product on WhatsApp (pre-filled message with benefits + price), Facebook, X, Threads,
 * the phone's own share sheet (Instagram, Telegram…) or by copying the link. Plain links — no
 * third-party scripts. The link preview (photo, title, description) comes from the page's
 * Open Graph tags and public/share/<slug>.jpg.
 */
export function ShareBar({ url, name, tagline, benefits, price, slug }: Props) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && !!navigator.share), []);

  const waText = [
    `🌿 *${name}* — Surakshitam Naturals`,
    tagline,
    "",
    ...benefits.slice(0, 3).map((b) => `✓ ${b}`),
    ...(price ? ["", `💰 ${price}`] : []),
    "",
    `See it and order: ${url}`,
  ].join("\n");
  const shortText = `${name} — Surakshitam Naturals. ${tagline}`;

  const links = [
    { method: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon, href: `https://wa.me/?text=${encodeURIComponent(waText)}` },
    { method: "facebook", label: "Facebook", icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    {
      method: "x",
      label: "X",
      icon: XIcon,
      href: `https://x.com/intent/post?text=${encodeURIComponent(shortText)}&url=${encodeURIComponent(url)}`,
    },
    {
      method: "threads",
      label: "Threads",
      icon: ThreadsIcon,
      href: `https://www.threads.net/intent/post?text=${encodeURIComponent(`${shortText} ${url}`)}`,
    },
  ];

  const track = (method: string) => gaEvent("share", { method, content_type: "product", item_id: slug });

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-forest/15 bg-white/70 text-forest/75 transition-colors hover:border-forest/30 hover:bg-white hover:text-forest";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-forest/60">Share</span>
      {links.map(({ method, label, icon: Icon, href }) => (
        <a
          key={method}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          title={`Share on ${label}`}
          onClick={() => track(method)}
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
            track("native");
            navigator.share({ title: name, text: shortText, url }).catch(() => {});
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
          track("copy_link");
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
      <span aria-live="polite" className="text-xs text-moss">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}
