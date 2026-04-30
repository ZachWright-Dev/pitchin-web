"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/app/components/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex min-h-screen bg-[#FAFBFF] text-[#0F1A3D]">
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

      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} />

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
