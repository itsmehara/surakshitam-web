"use client";

import { useEffect, useState } from "react";
import {
  getAdminAccounts,
  getAdminSession,
  saveAdminAccount,
  removeAdminAccount,
  isSeedAdmin,
  type AdminAccount,
} from "@/lib/admin";

const blank: AdminAccount = { username: "", name: "", password: "" };

export function AdminTeam() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState<string | null>(null); // null = not editing, "" = adding new
  const [draft, setDraft] = useState<AdminAccount>(blank);
  const [error, setError] = useState("");

  const refresh = () => {
    setAccounts(getAdminAccounts());
    setMe(getAdminSession()?.username ?? null);
  };
  useEffect(refresh, []);

  function startAdd() {
    setDraft(blank);
    setError("");
    setEditingUsername("");
  }

  function startEdit(a: AdminAccount) {
    setDraft(a);
    setError("");
    setEditingUsername(a.username);
  }

  function cancel() {
    setEditingUsername(null);
    setDraft(blank);
    setError("");
  }

  function save() {
    const isNew = editingUsername === "";
    const err = saveAdminAccount(draft, isNew ? undefined : (editingUsername ?? undefined));
    if (err) {
      setError(err);
      return;
    }
    cancel();
    refresh();
  }

  function remove(a: AdminAccount) {
    if (!confirm(`Remove "${a.name}" (${a.username}) from the admin team?`)) return;
    const err = removeAdminAccount(a.username);
    if (err) {
      alert(err);
      return;
    }
    refresh();
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">Team</h1>
          <p className="mt-1 text-sm text-forest/60">
            Admin accounts for the founder portal. Any signed-in founder can add, edit or remove
            accounts here — including their own name and password.
          </p>
        </div>
        {editingUsername === null && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
          >
            + Add admin
          </button>
        )}
      </div>

      {editingUsername !== null && (
        <div className="mt-6 rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">
            {editingUsername === "" ? "Add admin" : `Edit ${editingUsername}`}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Username</span>
              <input
                value={draft.username}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                autoComplete="off"
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Password</span>
              <input
                type="text"
                value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                autoComplete="off"
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-clay">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/8 text-left text-xs uppercase tracking-wide text-forest/50">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/8">
            {accounts.map((a) => (
              <tr key={a.username}>
                <td className="px-4 py-3 font-medium text-forest">
                  {a.name}
                  {a.username.toLowerCase() === me?.toLowerCase() && (
                    <span className="ml-2 rounded-full bg-moss/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-moss">
                      You
                    </span>
                  )}
                  {isSeedAdmin(a.username) && (
                    <span className="ml-2 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest/60">
                      Founder
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-forest/70">{a.username}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(a)}
                      className="text-sm font-medium text-moss hover:text-forest"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(a)}
                      className="text-sm font-medium text-clay/80 hover:text-clay"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-forest/45">
        Demo-only: passwords are stored in plain text in this browser&apos;s local storage for
        prototype purposes. In production, admin accounts move to Supabase Auth with real, hashed
        password storage — this screen would call an admin-only API instead.
      </p>
    </div>
  );
}
