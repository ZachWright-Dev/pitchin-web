"use client";

import Link from "next/link";
import { useState } from "react";

// ============================================================================
// Dummy placeholder data — replace with real data from your backend.
// ============================================================================

type Balance = {
  id: string;
  name: string;
  initials: string;
  balance: number; // positive = they owe you, negative = you owe them
  color: string;
};

type Group = {
  id: string;
  name: string;
  balance: number;
  image?: string; // optional emoji/url stand-in
  accent: string;
};

const USER = {
  name: "Zach Wright",
  plan: "Pro Plan",
  initials: "ZW",
};

const SUMMARY = {
  overall: 7.54,
  owed: 60.75,
  owe: 53.21,
  groupCount: 2,
};

const PEOPLE: Balance[] = [
  { id: "1", name: "Alex K.", initials: "AK", balance: 73.42, color: "#4F7CFF" },
  { id: "2", name: "Sam M.", initials: "SM", balance: -48.2, color: "#8B7CF6" },
  { id: "3", name: "Maya C.", initials: "MC", balance: 12.55, color: "#34D399" },
  { id: "4", name: "Devon H.", initials: "DH", balance: -5.01, color: "#0F1A3D" },
];

const GROUPS: Group[] = [
  { id: "1", name: "Nobu Dinner", balance: 60.75, image: "🍣", accent: "#4F7CFF" },
  { id: "2", name: "Ski Trip", balance: -5.01, image: "⛷️", accent: "#8B7CF6" },
  { id: "3", name: "Roommates", balance: -48.2, image: "🏠", accent: "#34D399" },
];

// ============================================================================
// Page
// ============================================================================

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<NavKey>("dashboard");

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
        activeView={activeView}
        onSelect={setActiveView}
        onToggle={() => setSidebarOpen((s) => !s)}
      />

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          {/* Mobile hamburger (visible when sidebar collapsed) */}
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
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
                Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
                Hey, {USER.name.split(" ")[0]} 👋
              </h1>
            </div>
          </div>

          {/* Balance summary */}
          <BalanceSummary />

          {/* Balances by person */}
          <section className="mt-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-bold tracking-tight">
                Balances by person
              </h2>
              <span className="text-xs font-medium text-[#0F1A3D]/50">
                {PEOPLE.length} people
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
              {PEOPLE.map((person, i) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  isLast={i === PEOPLE.length - 1}
                />
              ))}
            </div>
          </section>

          {/* Groups */}
          <section className="mt-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-bold tracking-tight">Your Groups</h2>
              <Link
                href="/groups"
                className="group inline-flex items-center gap-1 text-sm font-semibold text-[#4F7CFF] transition hover:text-[#0F1A3D]"
              >
                View all Groups
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GROUPS.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Sidebar
// ============================================================================

type NavKey = "dashboard" | "activity" | "friends" | "groups";

const NAV_ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
  { key: "activity", label: "Activity", icon: <IconActivity /> },
  { key: "friends", label: "Friends", icon: <IconFriends /> },
  { key: "groups", label: "Groups", icon: <IconGroups /> },
];

function Sidebar({
  open,
  activeView,
  onSelect,
  onToggle,
}: {
  open: boolean;
  activeView: NavKey;
  onSelect: (k: NavKey) => void;
  onToggle: () => void;
}) {
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
            const active = item.key === activeView;
            return (
              <button
                key={item.key}
                onClick={() => onSelect(item.key)}
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
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-[#0F1A3D]/10 p-4">
          <button className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#0F1A3D]/5">
            <Avatar initials={USER.initials} color="#4F7CFF" size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{USER.name}</p>
              <p className="truncate text-xs text-[#0F1A3D]/55">
                {USER.plan}
              </p>
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
// Balance Summary
// ============================================================================

function BalanceSummary() {
  const positive = SUMMARY.overall >= 0;
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-3xl opacity-50 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(79,124,255,0.2), rgba(139,124,246,0.15), rgba(52,211,153,0.15))",
        }}
      />
      <div className="relative grid grid-cols-1 gap-6 rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-6 shadow-sm backdrop-blur md:grid-cols-3 md:gap-8 md:p-8">
        {/* Overall */}
        <div className="md:border-r md:border-[#0F1A3D]/10 md:pr-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
            Your overall balance
          </p>
          <div className="mt-2 flex items-baseline gap-1">
            <span
              className={`text-4xl font-extrabold tracking-tight md:text-5xl ${
                positive ? "text-[#0E9F6E]" : "text-[#E5484D]"
              }`}
            >
              {positive ? "+" : "−"}${Math.abs(SUMMARY.overall).toFixed(2)}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0F1A3D]/55">
            {positive ? "You're owed" : "You owe"} money across{" "}
            {SUMMARY.groupCount} groups
          </p>
        </div>

        {/* You're owed */}
        <div className="flex flex-col justify-center md:border-r md:border-[#0F1A3D]/10 md:pr-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
              You're owed
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0E9F6E] md:text-3xl">
            ${SUMMARY.owed.toFixed(2)}
          </p>
        </div>

        {/* You owe */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5484D]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
              You owe
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E5484D] md:text-3xl">
            ${SUMMARY.owe.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Person Row
// ============================================================================

function PersonRow({ person, isLast }: { person: Balance; isLast: boolean }) {
  const owesYou = person.balance > 0;
  return (
    <div
      className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAFBFF] ${
        isLast ? "" : "border-b border-[#0F1A3D]/8"
      }`}
    >
      <Avatar initials={person.initials} color={person.color} size={44} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{person.name}</p>
        <p className="text-xs text-[#0F1A3D]/55">
          {owesYou ? "owes you" : "you owe"}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`font-mono text-sm font-bold ${
            owesYou ? "text-[#0E9F6E]" : "text-[#E5484D]"
          }`}
        >
          {owesYou ? "+" : "−"}${Math.abs(person.balance).toFixed(2)}
        </p>
      </div>

      <button
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
          owesYou
            ? "border border-[#0F1A3D]/15 bg-white text-[#0F1A3D] hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
            : "bg-[#0F1A3D] text-white shadow-sm hover:bg-[#4F7CFF]"
        }`}
      >
        {owesYou ? "Remind" : "Pay"}
      </button>
    </div>
  );
}

// ============================================================================
// Group Card
// ============================================================================

function GroupCard({ group }: { group: Group }) {
  const positive = group.balance >= 0;
  return (
    <button className="group relative overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition hover:translate-y-[-2px] hover:border-[#0F1A3D]/20 hover:shadow-md">
      {/* Accent strip */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: group.accent }}
      />

      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{
            background: `${group.accent}18`,
          }}
        >
          {group.image ?? "👥"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{group.name}</p>
          <p className="mt-0.5 text-xs text-[#0F1A3D]/50">
            {positive ? "You're owed" : "You owe"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span
          className={`font-mono text-xl font-bold ${
            positive ? "text-[#0E9F6E]" : "text-[#E5484D]"
          }`}
        >
          {positive ? "+" : "−"}${Math.abs(group.balance).toFixed(2)}
        </span>
        <svg
          className="h-4 w-4 text-[#0F1A3D]/30 transition group-hover:translate-x-0.5 group-hover:text-[#4F7CFF]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </button>
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
      <rect
        x="29"
        y="19"
        width="8"
        height="1.5"
        rx="0.5"
        fill="#0F1A3D"
        opacity="0.15"
      />
      <rect
        x="29"
        y="22"
        width="6"
        height="1.5"
        rx="0.5"
        fill="#0F1A3D"
        opacity="0.15"
      />
    </svg>
  );
}