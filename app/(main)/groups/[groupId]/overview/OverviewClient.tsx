"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@/app/components/Modal";
import type { GroupMember } from "@/lib/types/types";

// ────────────────────────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────────────────────────

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

interface ReceiptData {
  id: string;
  items: ReceiptItem[];
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  grandTotal: number;
}

interface OverviewClientProps {
  groupId: string;
  groupName: string;
  members: GroupMember[];
  memberImageMap: Record<string, string | null>;
  receiptData: ReceiptData;
  receiptImageSrc: string | null;
  groupEmoji: string | null;
  groupImageSrc: string | null;
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Derive initials from a member name, e.g. "Jamie D." → "JD" */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

/** Deterministic colour based on member id */
const AVATAR_COLORS = ["#4F7CFF", "#8B7CF6", "#34D399", "#F59E0B", "#EC4899", "#06B6D4"];
function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function OverviewClient({
  groupId,
  groupName,
  members,
  memberImageMap,
  receiptData,
  receiptImageSrc,
  groupEmoji,
  groupImageSrc,
}: OverviewClientProps) {
  const [viewReceipt, setViewReceipt] = useState(false);
  const [editReceipt, setEditReceipt] = useState(false);

  // TODO: Replace with actual group creation date from the API when available
  const createdAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const { items, subtotal, taxAmount, tipAmount, grandTotal } = receiptData;

  // Compute tax & tip as percentages of subtotal for display
  const taxPercent = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
  const tipPercent = subtotal > 0 ? (tipAmount / subtotal) * 100 : 0;

  return (
    <>
      {/* ── Group header card ──────────────────────────────────────────── */}
      <section className="mb-6 flex items-center justify-between rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="flex items-center gap-4">
          {/* Group avatar: emoji, uploaded image, or fallback icon */}
          <div
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl text-3xl"
            style={{ background: "rgba(79,124,255,0.12)" }}
          >
            {groupEmoji ? (
              groupEmoji
            ) : groupImageSrc ? (
              <Image
                src={groupImageSrc}
                alt="Group"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              /* Fallback icon when no emoji or image is set */
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F7CFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            )}
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
              {/* TODO: group name should come from the API — currently not returned
                   by getReceiptData or getGroupMembers. Using groupId as a fallback. */}
              Group {groupName}
            </h1>
            <p className="mt-0.5 text-xs text-[#0F1A3D]/55">
              Created {createdAt} · {members.length} members
            </p>
          </div>
        </div>
        <button
          onClick={() => setViewReceipt(true)}
          className="rounded-full border border-[#0F1A3D]/15 bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
        >
          View Receipt
        </button>
      </section>

      {/* ── Invite ─────────────────────────────────────────────────────── */}
      <section className="mb-6 rounded-2xl border border-dashed border-[#0F1A3D]/20 bg-white/60 p-6 text-center backdrop-blur">
        <p className="text-sm font-semibold">Invite people to split the bill</p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button className="inline-flex items-center gap-2 rounded-full border border-[#0F1A3D]/15 bg-white px-4 py-2 text-sm font-medium transition hover:border-[#0F1A3D]/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Add from friends
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#0F1A3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4F7CFF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Share Invite Link
          </button>
        </div>
      </section>

      {/* ── Receipt summary ────────────────────────────────────────────── */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-[#0F1A3D] text-white shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-sm font-bold tracking-wide">Receipt summary</h2>
          <span className="text-xs text-white/60">
            {items.length} items
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 px-6 py-5 md:grid-cols-2">
          {items.map((item) => {
            const lineTotal = item.unitPrice * item.quantity;
            return (
              <div
                key={item.id}
                className="flex items-baseline justify-between border-b border-white/8 py-2 text-sm"
              >
                <span className="text-white/85">
                  {item.name}
                  {item.quantity > 1 && (
                    <span className="ml-1 text-white/50">×{item.quantity}</span>
                  )}
                </span>
                <span className="font-mono font-semibold">
                  ${lineTotal.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tax / Tip / Subtotal breakdown */}
        <div className="space-y-1.5 border-t border-white/10 px-6 py-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/65">Subtotal</span>
            <span className="font-mono font-semibold">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/65">
              Tax
              {taxPercent > 0 && (
                <span className="ml-1">
                  ({taxPercent.toFixed(2).replace(/\.?0+$/, "")}%)
                </span>
              )}
            </span>
            <span className="font-mono font-semibold">
              ${taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/65">
              Tip
              {tipPercent > 0 && (
                <span className="ml-1">
                  ({tipPercent.toFixed(2).replace(/\.?0+$/, "")}%)
                </span>
              )}
            </span>
            <span className="font-mono font-semibold">
              ${tipAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/15 bg-white/5 px-6 py-4">
          <span className="text-sm font-bold">Grand total</span>
          <span className="font-mono text-lg font-bold">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </section>

      {/* Edit receipt button — TODO: wire up edit receipt flow later */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setEditReceipt(true)}
          className="rounded-full border border-[#0F1A3D]/15 bg-white px-6 py-2 text-sm font-semibold transition hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
        >
          Edit Receipt
        </button>
      </div>

      {/* ── Members ────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-bold tracking-wide">Group members</h2>
          <span className="text-xs text-[#0F1A3D]/50">
            {members.length} total
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {members.map((member) => {
            const imageSrc = memberImageMap[member.id];
            const initials = getInitials(member.name);
            const color = colorForId(member.id);

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-[#0F1A3D]/8 bg-white px-3 py-2.5"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={member.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {initials}
                  </div>
                )}
                <span className="text-sm font-semibold">{member.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── View Receipt modal ─────────────────────────────────────────── */}
      <Modal
        open={viewReceipt}
        onClose={() => setViewReceipt(false)}
        title="Receipt photo"
      >
        <div className="space-y-3">
          {receiptImageSrc ? (
            <div className="relative w-full overflow-hidden rounded-xl">
              {/**TODO: Update the base64String prefix with the actual image mime type */}
              <Image
                unoptimized
                src={`data:image/jpeg;base64,${receiptImageSrc}`}
                alt="Receipt"
                width={600}
                height={800}
                className="h-auto w-full rounded-xl"
              />
            </div>
          ) : (
            <>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#0F1A3D]/8 to-[#4F7CFF]/8">
                {/* Placeholder receipt SVG */}
                <svg
                  viewBox="0 0 300 400"
                  className="h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="300" height="400" fill="#FAFBFF" />
                  <rect x="40" y="30" width="220" height="340" rx="6" fill="#FFFFFF" stroke="#0F1A3D" strokeOpacity="0.1" />
                  <rect x="60" y="60" width="180" height="14" rx="2" fill="#0F1A3D" opacity="0.7" />
                  <rect x="60" y="84" width="120" height="8" rx="2" fill="#0F1A3D" opacity="0.3" />
                  <line x1="60" y1="110" x2="240" y2="110" stroke="#0F1A3D" strokeOpacity="0.15" strokeDasharray="3 3" />
                  {[130, 152, 174, 196, 218, 240, 262].map((y, i) => (
                    <g key={i}>
                      <rect x="60" y={y} width="100" height="8" rx="2" fill="#0F1A3D" opacity="0.5" />
                      <rect x="200" y={y} width="40" height="8" rx="2" fill="#0F1A3D" opacity="0.5" />
                    </g>
                  ))}
                  <line x1="60" y1="290" x2="240" y2="290" stroke="#0F1A3D" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <rect x="60" y="305" width="60" height="10" rx="2" fill="#0F1A3D" opacity="0.8" />
                  <rect x="180" y="305" width="60" height="10" rx="2" fill="#0F1A3D" opacity="0.8" />
                  <path d="M 60 350 L 80 340 L 100 350 L 120 340 L 140 350 L 160 340 L 180 350 L 200 340 L 220 350 L 240 340" stroke="#0F1A3D" strokeOpacity="0.2" fill="none" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="text-center text-xs text-[#0F1A3D]/55">
                No receipt image available for this group.
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* ── Edit Receipt modal — TODO: implement full edit flow later ─── */}
      <Modal
        open={editReceipt}
        onClose={() => setEditReceipt(false)}
        title="Edit receipt items"
        maxWidth="max-w-xl"
      >
        <div className="py-8 text-center text-sm text-[#0F1A3D]/55">
          <p>Receipt editing will be available soon.</p>
          <button
            onClick={() => setEditReceipt(false)}
            className="mt-4 rounded-full border border-[#0F1A3D]/15 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}