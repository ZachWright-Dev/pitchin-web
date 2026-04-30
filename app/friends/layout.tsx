"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import Avatar from "@/app/components/Avatar";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "activity", label: "Activity", href: "/activity" },
  { key: "friends", label: "Friends", href: "/friends" },
  { key: "groups", label: "Groups", href: "/groups" },
] as const;

const USER = { name: "Zach Wright", plan: "Pro Plan", initials: "ZW" };

export default function FriendsLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const activeNav = NAV_ITEMS.find((n) => pathname?.startsWith(n.href))?.key;

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

      <aside
        className={`relative z-20 flex shrink-0 flex-col border-r border-[#0F1A3D]/10 bg-white/80 backdrop-blur transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
        }`}
      >
        <div className="flex h-full w-64 flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-[#0F1A3D]">Pitch</span>
                <span className="text-[#4F7CFF]">In</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#0F1A3D]/60 transition hover:bg-[#0F1A3D]/5 hover:text-[#0F1A3D]"
              aria-label="Collapse menu"
            >
              <Hamburger />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-2">
            {NAV_ITEMS.map((item) => {
              const active = item.key === activeNav;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#0F1A3D] text-white shadow-sm"
                      : "text-[#0F1A3D]/70 hover:bg-[#0F1A3D]/5 hover:text-[#0F1A3D]"
                  }`}
                >
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

          <div className="border-t border-[#0F1A3D]/10 p-4">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <Avatar initials={USER.initials} color="#4F7CFF" size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{USER.name}</p>
                <p className="truncate text-xs text-[#0F1A3D]/55">
                  {USER.plan}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-10">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F1A3D]/10 bg-white shadow-sm transition hover:bg-[#FAFBFF]"
              aria-label="Open menu"
            >
              <Hamburger />
            </button>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

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