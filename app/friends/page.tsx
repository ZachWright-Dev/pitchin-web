"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Avatar from "@/app/components/Avatar";
import FriendModal, { Friend } from "@/app/components/FriendModal";
import { FRIENDS } from "@/lib/friendData";

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>(FRIENDS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Friend | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friends, query]);

  const handleRemove = (id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            People
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            Friends
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/friends/pending"
            className="inline-flex items-center gap-2 rounded-full border border-[#0F1A3D]/15 bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            View Pending Requests
          </Link>
          <Link
            href="/friends/add"
            className="inline-flex items-center gap-2 rounded-full bg-[#0F1A3D] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4F7CFF]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Friend
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F1A3D]/40"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full rounded-2xl border border-[#0F1A3D]/10 bg-white/90 py-3 pl-11 pr-4 text-sm shadow-sm backdrop-blur transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
          />
        </div>
      </div>

      {/* Friends list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0F1A3D]/15 bg-white/60 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#0F1A3D]/70">
            {query ? "No friends match your search." : "You don't have any friends yet."}
          </p>
          {!query && (
            <Link
              href="/friends/add"
              className="mt-4 inline-block text-sm font-semibold text-[#4F7CFF] underline-offset-4 hover:underline"
            >
              Add your first friend →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setSelected(friend)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-[#0F1A3D]/10 bg-white/90 px-5 py-4 text-left shadow-sm backdrop-blur transition hover:border-[#0F1A3D]/20 hover:shadow-md"
            >
              <Avatar initials={friend.initials} color={friend.color} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{friend.name}</p>
                <p className="truncate text-xs text-[#0F1A3D]/55">
                  {friend.email}
                </p>
              </div>
              <svg
                className="h-4 w-4 text-[#0F1A3D]/25 transition group-hover:translate-x-0.5 group-hover:text-[#4F7CFF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Friend modal */}
      <FriendModal
        friend={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        onRemove={handleRemove}
      />
    </>
  );
}