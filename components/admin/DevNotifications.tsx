"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getNotifications,
  getArchivedNotifications,
  archiveNotifications,
  restoreNotifications,
  type NotificationRecord,
} from "@/lib/notifications";
import { WhatsAppIcon, CheckIcon } from "@/components/icons";

type Tab = "active" | "archive";

export function DevNotifications() {
  const [tab, setTab] = useState<Tab>("active");
  const [active, setActive] = useState<NotificationRecord[]>([]);
  const [archived, setArchived] = useState<NotificationRecord[]>([]);

  const refresh = () => {
    setActive(getNotifications());
    setArchived(getArchivedNotifications());
  };
  useEffect(refresh, []);

  const items = tab === "active" ? active : archived;

  return (
    <div className="container max-w-3xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">WhatsApp notifications</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-forest sm:text-3xl">
            Outgoing messages
          </h1>
          <p className="mt-1 text-sm text-forest/60">
            Every message the system sends — to the customer&apos;s number and to the founders&apos;
            number. Demo-only: messages are recorded here, not delivered.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
          >
            Refresh
          </button>
          {tab === "active" ? (
            <button
              type="button"
              onClick={() => {
                archiveNotifications();
                refresh();
              }}
              className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Archive all
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                restoreNotifications();
                setTab("active");
                refresh();
              }}
              className="rounded-full border border-forest/20 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Restore all
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 inline-flex rounded-full border border-forest/15 bg-white/60 p-1">
        {(["active", "archive"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-forest text-cream" : "text-forest/65 hover:text-forest"
            }`}
          >
            {t} {t === "active" ? `(${active.length})` : `(${archived.length})`}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-forest/15 bg-parchment/40 p-10 text-center text-forest/60">
          {tab === "active"
            ? "No active notifications. Place an order to generate customer & admin messages."
            : "Nothing archived yet."}
          {tab === "active" && (
            <div className="mt-3">
              <Link href="/shop" className="text-sm font-medium text-moss">
                Go to shop
              </Link>
            </div>
          )}
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((n) => (
            <li key={n.id} className="overflow-hidden rounded-lg border border-forest/8 bg-white/60">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/8 bg-[#25D366]/8 px-4 py-2.5">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-forest">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <WhatsAppIcon width={14} />
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      n.audience === "admin" ? "bg-forest/10 text-forest" : "bg-clay/10 text-clay"
                    }`}
                  >
                    {n.audience === "admin" ? "To founders" : "To customer"}
                  </span>
                  {n.recipient}
                </span>
                <span className="flex items-center gap-3 text-xs text-forest/55">
                  <code className="rounded bg-parchment px-1.5 py-0.5">{n.template}</code>
                  <span className="inline-flex items-center gap-1 text-moss">
                    <CheckIcon width={12} /> {n.status}
                  </span>
                  <time>{new Date(n.createdAt).toLocaleString("en-IN")}</time>
                </span>
              </div>
              <div className="px-4 pt-2 text-xs font-medium text-forest/70">
                To WhatsApp: <span className="text-forest">{n.to}</span>
              </div>
              <pre className="whitespace-pre-wrap px-4 pb-3 pt-1 font-sans text-sm leading-relaxed text-forest/80">
                {n.message}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
