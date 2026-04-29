"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ============================================================================
// Dummy placeholder data — replace with real data from your backend.
// ============================================================================

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

const USER = {
  name: "Zach Wright",
  plan: "Pro Plan",
  initials: "ZW",
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

// ============================================================================
// Page
// ============================================================================

export default function GroupsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex min-h-screen bg-[#FAFBFF] text-[#0F1A3D]">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-32 right-1/4 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #4F7CFF 0%, rgba(79,124,255,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #8B7CF6 0%, rgba(139,124,246,0) 70%)",
        }}
      />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((s) => !s)}
      />

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          {/* Mobile hamburger */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F1A3D]/10 bg-white shadow-sm transition hover:bg-[#FAFBFF]"
              aria-label="Open menu"
            >
              <Hamburger />
            </button>
          )}

          {/* Page header */}
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

          {/* Groups list */}
          <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
            {GROUPS.map((group, i) => (
              <GroupRow
                key={group.id}
                group={group}
                isLast={i === GROUPS.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Group Row
// ============================================================================

function GroupRow({ group, isLast }: { group: Group; isLast: boolean }) {
  const positive = group.balance >= 0;
  return (
    <Link
      href={`/groups/${group.id}`}
      className={`group flex items-center gap-5 px-6 py-5 transition hover:bg-[#FAFBFF] ${
        isLast ? "" : "border-b border-[#0F1A3D]/8"
      }`}
    >
      {/* Group image */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0F1A3D]/5 text-2xl">
        {group.emoji ?? "👥"}
      </div>

      {/* Name + members */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold">{group.name}</p>
        <div className="mt-2 flex items-center">
          <AvatarStack members={group.members} />
        </div>
      </div>

      {/* Balance */}
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

      {/* Chevron */}
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

// ============================================================================
// Avatar Stack
// ============================================================================

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

// ============================================================================
// Sidebar
// ============================================================================

const NAV_ITEMS: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
  { label: "Activity", href: "#", icon: <IconActivity /> },
  { label: "Friends", href: "#", icon: <IconFriends /> },
  { label: "Groups", href: "/groups", icon: <IconGroups /> },
];

function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  return (
    <aside
      className={`relative z-20 flex shrink-0 flex-col border-r border-[#0F1A3D]/10 bg-white/80 backdrop-blur transition-all duration-300 ${
        open ? "w-64" : "w-0 overflow-hidden border-r-0"
      }`}
    >
      <div className="flex h-full w-64 flex-col">
        {/* Brand + collapse */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#0F1A3D]">Pitch</span>
              <span className="text-[#4F7CFF]">In</span>
            </span>
          </div>
          <button
            onClick={onToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#0F1A3D]/60 transition hover:bg-[#0F1A3D]/5 hover:text-[#0F1A3D]"
            aria-label="Collapse menu"
          >
            <Hamburger />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#0F1A3D] text-white shadow-sm"
                    : "text-[#0F1A3D]/70 hover:bg-[#0F1A3D]/5 hover:text-[#0F1A3D]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center ${
                    active ? "text-white" : "text-[#0F1A3D]/60"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#34D399]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-[#0F1A3D]/10 p-4">
          <button className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#0F1A3D]/5">
            <Avatar initials={USER.initials} color="#4F7CFF" size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{USER.name}</p>
              <p className="truncate text-xs text-[#0F1A3D]/55">{USER.plan}</p>
            </div>
            <svg
              className="h-4 w-4 text-[#0F1A3D]/40 transition group-hover:text-[#0F1A3D]/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ============================================================================
// Avatar
// ============================================================================

function Avatar({
  initials,
  color,
  size = 40,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

// ============================================================================
// Icons
// ============================================================================

function Hamburger() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconFriends() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconGroups() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 8h26a18 18 0 0 1 0 36H22v12h-10V8z" fill="#1B2559" />
      <path d="M22 30h12l-3 4 3 4H22V30z" fill="#34D399" />
      <path d="M34 38h10v8H34l-3-4 3-4z" fill="#4F7CFF" />
      <path d="M44 38h8a8 8 0 0 0 0-8h-8v8z" fill="#8B7CF6" />
      <rect x="26" y="14" width="14" height="18" rx="1" fill="#FFFFFF" />
      <rect x="29" y="19" width="8" height="1.5" rx="0.5" fill="#0F1A3D" opacity="0.15" />
      <rect x="29" y="22" width="6" height="1.5" rx="0.5" fill="#0F1A3D" opacity="0.15" />
    </svg>
  );
}
