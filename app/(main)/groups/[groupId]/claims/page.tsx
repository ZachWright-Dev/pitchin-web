"use client";

import { useMemo, useState } from "react";
import Avatar from "@/app/components/Avatar";
import {
  GROUP,
  CURRENT_USER_ID,
  ReceiptItem,
  ClaimShare,
  claimedPercent,
  memberById,
  subtotal,
} from "@/lib/groupData";

type SplitMode = "solo" | "custom";

export default function ClaimsPage() {
  const [items, setItems] = useState<ReceiptItem[]>(GROUP.items);
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "");
  const [splitMode, setSplitMode] = useState<SplitMode>("custom");

  // Working draft for the currently-selected item — only applied on Confirm
  const [draftClaims, setDraftClaims] = useState<ClaimShare[]>(
    items[0]?.claims ?? []
  );

  const selected = items.find((i) => i.id === selectedId)!;

  // Switch selected item: load its claims into the draft
  const selectItem = (id: string) => {
    setSelectedId(id);
    const item = items.find((i) => i.id === id);
    setDraftClaims(item?.claims ?? []);
    setSplitMode("custom");
  };

  const draftTotal = draftClaims.reduce((s, c) => s + c.percent, 0);
  const meDraft =
    draftClaims.find((c) => c.memberId === CURRENT_USER_ID)?.percent ?? 0;

  // === Mutators on draft ===

  const setMemberPercent = (memberId: string, percent: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    const original =
      selected.claims.find((c) => c.memberId === memberId)?.percent ?? 0;
    const isMe = memberId === CURRENT_USER_ID;

    // Rule: I can decrease others, but not increase them above their original.
    let next = clamped;
    if (!isMe && next > original) next = original;

    setDraftClaims((prev) => {
      const without = prev.filter((c) => c.memberId !== memberId);
      if (next === 0) return without;
      return [...without, { memberId, percent: next }];
    });
  };

  // Solo claim: 100% to me, wipe everyone else.
  const applySoloMode = () => {
    setSplitMode("solo");
    setDraftClaims([{ memberId: CURRENT_USER_ID, percent: 100 }]);
  };

  // === Confirm: apply draft to the actual item ===

  const confirmSplit = () => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedId
          ? { ...it, claims: draftClaims.filter((c) => c.percent > 0) }
          : it
      )
    );
  };

  // === Computed financials ===

  const billSub = subtotal(items);
  const tax = billSub * GROUP.taxRate;
  const service = billSub * GROUP.serviceRate;
  const billTotal = billSub + tax + service;

  // My total liability (incl. tax + service) based on confirmed (saved) claims
  const myLiability = useMemo(() => {
    const itemTotal = items.reduce((sum, item) => {
      const share =
        item.claims.find((c) => c.memberId === CURRENT_USER_ID)?.percent ?? 0;
      return sum + (item.price * share) / 100;
    }, 0);
    return itemTotal * (1 + GROUP.taxRate + GROUP.serviceRate);
  }, [items]);

  // For the "Each pays" line on the selected item
  const splittersInDraft = draftClaims.filter((c) => c.percent > 0).length;
  const draftItemTotal = (selected.price * meDraft) / 100;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Receipt items list */}
        <section className="overflow-hidden rounded-2xl bg-[#0F1A3D] text-white shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-sm font-bold tracking-wide">Receipt items</h2>
              <p className="mt-0.5 text-xs text-white/55">
                {items.filter((i) => claimedPercent(i) === 100).length}/
                {items.length} fully claimed · tap to edit
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold">
              ${billSub.toFixed(2)}
            </span>
          </div>
          <ul className="divide-y divide-white/8">
            {items.map((item) => {
              const total = claimedPercent(item);
              const claimed = total === 100;
              const isSelected = item.id === selectedId;
              const claimers = item.claims
                .filter((c) => c.percent > 0)
                .map((c) => memberById(GROUP, c.memberId)!)
                .filter(Boolean);

              return (
                <li key={item.id}>
                  <button
                    onClick={() => selectItem(item.id)}
                    className={`flex w-full items-center gap-3 px-5 py-3 text-left transition ${
                      isSelected ? "bg-[#4F7CFF]/15" : "hover:bg-white/5"
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        claimed
                          ? "border-[#34D399] bg-[#34D399] text-[#0F1A3D]"
                          : "border-white/30 bg-transparent"
                      }`}
                    >
                      {claimed && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {claimers.slice(0, 4).map((m) => (
                          <span
                            key={m.id}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-[#0F1A3D]"
                            style={{
                              background: `linear-gradient(135deg, ${m.color}, ${m.color}CC)`,
                            }}
                          >
                            {m.initials}
                          </span>
                        ))}
                        {claimers.length > 4 && (
                          <span className="text-[10px] text-white/55">
                            +{claimers.length - 4}
                          </span>
                        )}
                        {!claimed && (
                          <span className="ml-1 rounded-full bg-[#F59E0B]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FCD34D]">
                            {total}% claimed
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Split editor */}
        <section className="overflow-hidden rounded-2xl bg-[#0F1A3D] text-white shadow-lg">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-base font-bold">{selected.name}</h2>
            <p className="mt-0.5 text-xs text-white/55">
              ${selected.price.toFixed(2)} · {draftTotal}% claimed in draft
            </p>
          </div>

          <div className="space-y-5 px-5 py-4">
            {/* Split mode */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                Split mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={applySoloMode}
                  className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    splitMode === "solo"
                      ? "bg-[#4F7CFF] text-white shadow-sm"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  Solo claim
                </button>
                <button
                  onClick={() => setSplitMode("custom")}
                  className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    splitMode === "custom"
                      ? "bg-[#4F7CFF] text-white shadow-sm"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  Custom %
                </button>
              </div>
            </div>

            {/* Member claim list */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                Who's splitting this?
              </p>
              <div className="space-y-2">
                {GROUP.members.map((m) => {
                  const draft =
                    draftClaims.find((c) => c.memberId === m.id)?.percent ?? 0;
                  const original =
                    selected.claims.find((c) => c.memberId === m.id)
                      ?.percent ?? 0;
                  const isMe = m.id === CURRENT_USER_ID;
                  const dollars = (selected.price * draft) / 100;
                  const canIncrease = isMe; // Only I can grow my own share
                  return (
                    <MemberSplitRow
                      key={m.id}
                      memberInitials={m.initials}
                      memberName={m.name}
                      memberColor={m.color}
                      isMe={isMe}
                      percent={draft}
                      originalPercent={original}
                      dollars={dollars}
                      canIncrease={canIncrease}
                      onChange={(p) => setMemberPercent(m.id, p)}
                      disabled={splitMode === "solo"}
                    />
                  );
                })}
              </div>
            </div>

            {/* Item totals */}
            <div className="space-y-1.5 rounded-xl bg-white/5 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/65">Item total</span>
                <span className="font-mono font-semibold">
                  ${selected.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/65">Splitting between</span>
                <span className="font-semibold">
                  {splittersInDraft}{" "}
                  {splittersInDraft === 1 ? "person" : "people"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2">
                <span className="text-white/65">Each pays (you)</span>
                <span
                  className={`font-mono font-bold ${
                    draftTotal === 100
                      ? "text-[#34D399]"
                      : "text-[#FCD34D]"
                  }`}
                >
                  ${draftItemTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Validation hint */}
            {draftTotal !== 100 && (
              <p className="text-center text-xs text-[#FCD34D]">
                {draftTotal < 100
                  ? `${100 - draftTotal}% unclaimed`
                  : `${draftTotal - 100}% over — please adjust`}
              </p>
            )}

            <button
              onClick={confirmSplit}
              disabled={draftTotal > 100}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0F1A3D] transition hover:bg-[#FAFBFF] disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/50"
            >
              Confirm split
            </button>
          </div>
        </section>
      </div>

      {/* Bottom totals */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur">
          <div className="space-y-1 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-[#0F1A3D]/60">Tax ({Math.round(GROUP.taxRate * 100)}%)</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#0F1A3D]/60">
                Service/Gratuity ({Math.round(GROUP.serviceRate * 100)}%)
              </span>
              <span className="font-semibold">${service.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-[#0F1A3D]/10 pt-1.5 font-bold">
              <span>Total Bill:</span>
              <span>${billTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
            Your Total Liability so far
          </p>
          <p className="mt-1 font-mono text-2xl font-extrabold text-[#0F1A3D]">
            ${myLiability.toFixed(2)}{" "}
            <span className="text-base font-medium text-[#0F1A3D]/45">
              of ${billTotal.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

function MemberSplitRow({
  memberInitials,
  memberName,
  memberColor,
  isMe,
  percent,
  originalPercent,
  dollars,
  canIncrease,
  onChange,
  disabled,
}: {
  memberInitials: string;
  memberName: string;
  memberColor: string;
  isMe: boolean;
  percent: number;
  originalPercent: number;
  dollars: number;
  canIncrease: boolean;
  onChange: (p: number) => void;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draftStr, setDraftStr] = useState(percent.toString());

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
        isMe
          ? "border-[#4F7CFF]/40 bg-[#4F7CFF]/10"
          : "border-white/10 bg-white/5"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <Avatar initials={memberInitials} color={memberColor} size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {memberName}
          {isMe && <span className="ml-1.5 text-xs text-white/50">(you)</span>}
        </p>
        {!canIncrease && (
          <p className="text-[10px] text-white/45">
            Can only decrease (max {originalPercent}%)
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {editing && !disabled ? (
          <input
            type="text"
            inputMode="numeric"
            value={draftStr}
            autoFocus
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) setDraftStr(v);
            }}
            onBlur={() => {
              setEditing(false);
              onChange(parseInt(draftStr, 10) || 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") {
                setDraftStr(percent.toString());
                setEditing(false);
              }
            }}
            className="w-20 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-right font-mono text-sm font-bold text-white focus:border-[#4F7CFF] focus:outline-none"
          />
        ) : (
          <button
            onClick={() => {
              if (disabled) return;
              setDraftStr(percent.toString());
              setEditing(true);
            }}
            disabled={disabled}
            className="rounded-md px-2 py-1 font-mono text-sm font-bold transition hover:bg-white/10 disabled:hover:bg-transparent"
          >
            {percent}%
          </button>
        )}
        <span className="w-16 text-right font-mono text-sm font-semibold text-white/85">
          ${dollars.toFixed(2)}
        </span>
      </div>
    </div>
  );
}