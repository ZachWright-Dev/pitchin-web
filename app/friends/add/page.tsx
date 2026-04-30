"use client";

import Link from "next/link";
import { useState } from "react";
import Avatar from "@/app/components/Avatar";
import { SEARCHABLE_USERS } from "@/lib/friendData";

type SearchResult = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export default function AddFriendPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    setLoading(true);
    // Simulate API call — replace with real fetch later.
    await new Promise((res) => setTimeout(res, 400));
    const matches = SEARCHABLE_USERS.filter((u) =>
      u.name.toLowerCase().includes(q)
    );
    setResults(matches);
    setLoading(false);
  };

  const handleAdd = (id: string) => {
    setRequested((prev) => new Set(prev).add(id));
    // TODO: API call to send friend request
  };

  return (
    <>
      {/* Back link */}
      <Link
        href="/friends"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0F1A3D]/60 transition hover:text-[#0F1A3D]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Friends
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
          People
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
          Add a Friend
        </h1>
        <p className="mt-2 text-sm text-[#0F1A3D]/60">
          Search by name to find people on PitchIn.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search by name..."
            className="w-full rounded-2xl border border-[#0F1A3D]/10 bg-white/90 py-3 pl-11 pr-4 text-sm shadow-sm backdrop-blur transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          className="rounded-2xl bg-[#0F1A3D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4F7CFF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {results === null ? (
        <div className="rounded-2xl border border-dashed border-[#0F1A3D]/15 bg-white/60 px-6 py-12 text-center">
          <p className="text-sm text-[#0F1A3D]/55">
            Enter a name above to find friends.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0F1A3D]/15 bg-white/60 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#0F1A3D]/70">
            No users found for "{query}".
          </p>
          <p className="mt-1 text-xs text-[#0F1A3D]/50">
            Try a different spelling.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/90 shadow-sm backdrop-blur">
          <div className="border-b border-[#0F1A3D]/8 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
          </div>
          <ul className="divide-y divide-[#0F1A3D]/6">
            {results.map((user) => {
              const isRequested = requested.has(user.id);
              return (
                <li
                  key={user.id}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <Avatar
                    initials={user.initials}
                    color={user.color}
                    size={40}
                  />
                  <p className="min-w-0 flex-1 truncate text-sm font-bold">
                    {user.name}
                  </p>
                  <button
                    onClick={() => handleAdd(user.id)}
                    disabled={isRequested}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      isRequested
                        ? "cursor-default border border-[#34D399]/30 bg-[#34D399]/10 text-[#0E9F6E]"
                        : "bg-[#0F1A3D] text-white hover:bg-[#4F7CFF]"
                    }`}
                  >
                    {isRequested ? "Request sent ✓" : "Add Friend"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}