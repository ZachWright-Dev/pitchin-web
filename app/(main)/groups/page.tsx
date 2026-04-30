"use client";

import Link from "next/link";

type Member = {
  initials: string;
  color: string;
};

type Group = {
  id: string;
  name: string;
  emoji?: string;
  members: Member[];
  balance: number;
};

const GROUPS: Group[] = [
  {
    id: "1",
    name: "Nobu Dinner",
    emoji: "🍣",
    members: [
      { initials: "AK", color: "#4F7CFF" },
      { initials: "SM", color: "#8B7CF6" },
      { initials: "MC", color: "#34D399" },
    ],
    balance: 90,
  },
  {
    id: "2",
    name: "Ski Trip",
    emoji: "⛷️",
    members: [
      { initials: "DH", color: "#0F1A3D" },
      { initials: "AK", color: "#4F7CFF" },
      { initials: "SM", color: "#8B7CF6" },
    ],
    balance: 3,
  },
  {
    id: "3",
    name: "Roommates",
    emoji: "🏠",
    members: [
      { initials: "MC", color: "#34D399" },
      { initials: "DH", color: "#0F1A3D" },
      { initials: "AK", color: "#4F7CFF" },
    ],
    balance: -40,
  },
];

export default function GroupsPage() {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            Groups
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
            Your Groups
          </h1>
        </div>
        <Link
          href="/groups/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F1A3D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4F7CFF]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Group
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
        {GROUPS.map((group, i) => (
          <GroupRow
            key={group.id}
            group={group}
            isLast={i === GROUPS.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function GroupRow({ group, isLast }: { group: Group; isLast: boolean }) {
  const positive = group.balance >= 0;
  return (
    <Link
      href={`/groups/${group.id}`}
      className={`group flex items-center gap-5 px-6 py-5 transition hover:bg-[#FAFBFF] ${
        isLast ? "" : "border-b border-[#0F1A3D]/8"
      }`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0F1A3D]/5 text-2xl">
        {group.emoji ?? "👥"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold">{group.name}</p>
        <div className="mt-2 flex items-center">
          <AvatarStack members={group.members} />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0F1A3D]/45">
          Balance
        </p>
        <p
          className={`font-mono text-xl font-bold ${
            positive ? "text-[#0E9F6E]" : "text-[#E5484D]"
          }`}
        >
          {positive ? "+" : "−"}${Math.abs(group.balance).toFixed(0)}
        </p>
      </div>

      <svg
        className="h-4 w-4 shrink-0 text-[#0F1A3D]/25 transition group-hover:translate-x-0.5 group-hover:text-[#4F7CFF]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

function AvatarStack({ members }: { members: Member[] }) {
  const visible = members.slice(0, 4);
  const overflow = members.length - visible.length;
  return (
    <div className="flex items-center">
      {visible.map((m, i) => (
        <div
          key={i}
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white font-semibold text-white"
          style={{
            marginLeft: i === 0 ? 0 : -8,
            background: `linear-gradient(135deg, ${m.color}, ${m.color}CC)`,
            fontSize: 10,
            zIndex: visible.length - i,
          }}
        >
          {m.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#0F1A3D]/10 text-[10px] font-semibold text-[#0F1A3D]/60"
          style={{ marginLeft: -8 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
