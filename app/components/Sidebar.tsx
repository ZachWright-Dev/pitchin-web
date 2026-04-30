"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@/app/components/Avatar";

const NAV_ITEMS: { label: string; href: string; icon: ReactNode }[] = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
  { label: "Activity", href: "/activity", icon: <IconActivity /> },
  { label: "Friends", href: "/friends", icon: <IconFriends /> },
  { label: "Groups", href: "/groups", icon: <IconGroups /> },
];

const USER = { name: "Zach Wright", plan: "Pro Plan", initials: "ZW" };

export default function Sidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  return (
    <aside
      className={`relative z-20 flex shrink-0 flex-col border-r border-[#0F1A3D]/10 bg-white/80 backdrop-blur transition-all duration-300 ${
        open ? "w-64" : "w-0 overflow-hidden border-r-0"
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
            onClick={onToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#0F1A3D]/60 transition hover:bg-[#0F1A3D]/5 hover:text-[#0F1A3D]"
            aria-label="Collapse menu"
          >
            <Hamburger />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href) ?? false;
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
