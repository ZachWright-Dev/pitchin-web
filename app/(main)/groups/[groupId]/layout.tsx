"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ReactNode } from "react";

export default function GroupLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ groupId: string }>();
  const groupId = params?.groupId ?? "1";

  const TABS = [
    { key: "overview", label: "Overview", href: `/groups/${groupId}/overview` },
    { key: "claims", label: "Claim Items", href: `/groups/${groupId}/claims` },
    {
      key: "settlements",
      label: "Settlements",
      href: `/groups/${groupId}/settlements`,
    },
    { key: "activity", label: "Activity", href: `/groups/${groupId}/activity` },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-[#0F1A3D]/10 bg-white/80 p-1.5 shadow-sm backdrop-blur">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
                active
                  ? "bg-[#4F7CFF] text-white shadow-sm"
                  : "text-[#0F1A3D]/70 hover:bg-[#0F1A3D]/5 hover:text-[#0F1A3D]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      {children}
    </>
  );
}
