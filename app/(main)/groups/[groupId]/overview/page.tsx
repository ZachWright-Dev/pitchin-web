"use client";

import { useState } from "react";
import Avatar from "@/app/components/Avatar";
import Modal from "@/app/components/Modal";
import {
  GROUP,
  ReceiptItem,
  subtotal,
  grandTotal,
} from "@/lib/groupData";

export default function OverviewPage() {
  const [group, setGroup] = useState(GROUP);
  const [viewReceipt, setViewReceipt] = useState(false);
  const [editReceipt, setEditReceipt] = useState(false);

  return (
    <>
      {/* Group header card */}
      <section className="mb-6 flex items-center justify-between rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            style={{ background: "rgba(79,124,255,0.12)" }}
          >
            {group.photoEmoji}
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">
              {group.name}
            </h1>
            <p className="mt-0.5 text-xs text-[#0F1A3D]/55">
              Created {group.createdAt} · {group.members.length} members
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

      {/* Invite */}
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

      {/* Receipt summary */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-[#0F1A3D] text-white shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-sm font-bold tracking-wide">Receipt summary</h2>
          <span className="text-xs text-white/60">
            {group.items.length} items · entered manually
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 px-6 py-5 md:grid-cols-2">
          {group.items.map((item) => (
            <div
              key={item.id}
              className="flex items-baseline justify-between border-b border-white/8 py-2 text-sm"
            >
              <span className="text-white/85">{item.name}</span>
              <span className="font-mono font-semibold">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        {/* Tax / Gratuity / Subtotal breakdown */}
        <div className="space-y-1.5 border-t border-white/10 px-6 py-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/65">Subtotal</span>
            <span className="font-mono font-semibold">
              ${subtotal(group.items).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/65">
              Tax ({(group.taxRate * 100).toFixed(2).replace(/\.?0+$/, "")}%)
            </span>
            <span className="font-mono font-semibold">
              ${(subtotal(group.items) * group.taxRate).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/65">
              Gratuity ({(group.serviceRate * 100).toFixed(2).replace(/\.?0+$/, "")}%)
            </span>
            <span className="font-mono font-semibold">
              ${(subtotal(group.items) * group.serviceRate).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/15 bg-white/5 px-6 py-4">
          <span className="text-sm font-bold">Grand total</span>
          <span className="font-mono text-lg font-bold">
            ${grandTotal(group).toFixed(2)}
          </span>
        </div>
      </section>

      <div className="mb-6 flex justify-center">
        <button
          onClick={() => setEditReceipt(true)}
          className="rounded-full border border-[#0F1A3D]/15 bg-white px-6 py-2 text-sm font-semibold transition hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
        >
          Edit Receipt
        </button>
      </div>

      {/* Members */}
      <section className="rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-bold tracking-wide">Group members</h2>
          <span className="text-xs text-[#0F1A3D]/50">
            {group.members.length} total
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-[#0F1A3D]/8 bg-white px-3 py-2.5"
            >
              <Avatar
                initials={member.initials}
                color={member.color}
                size={36}
              />
              <span className="text-sm font-semibold">{member.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* View Receipt modal */}
      <Modal
        open={viewReceipt}
        onClose={() => setViewReceipt(false)}
        title="Receipt photo"
      >
        <div className="space-y-3">
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
            Placeholder image — the actual receipt photo will be loaded from the
            API once available.
          </p>
        </div>
      </Modal>

      {/* Edit Receipt modal */}
      <Modal
        open={editReceipt}
        onClose={() => setEditReceipt(false)}
        title="Edit receipt items"
        maxWidth="max-w-xl"
      >
        <EditReceiptForm
          items={group.items}
          taxRate={group.taxRate}
          serviceRate={group.serviceRate}
          onSave={({ items, taxRate, serviceRate }) => {
            setGroup({ ...group, items, taxRate, serviceRate });
            setEditReceipt(false);
          }}
          onCancel={() => setEditReceipt(false)}
        />
      </Modal>
    </>
  );
}

function EditReceiptForm({
  items,
  taxRate,
  serviceRate,
  onSave,
  onCancel,
}: {
  items: ReceiptItem[];
  taxRate: number;
  serviceRate: number;
  onSave: (payload: {
    items: ReceiptItem[];
    taxRate: number;
    serviceRate: number;
  }) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(items);
  // Store rates as the string the user types (in %) so they can clear/edit freely
  const [taxStr, setTaxStr] = useState((taxRate * 100).toString());
  const [serviceStr, setServiceStr] = useState((serviceRate * 100).toString());
  // Prices are also stored as strings while editing
  const [priceStrs, setPriceStrs] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.id, i.price.toFixed(2)]))
  );

  const updateName = (id: string, value: string) => {
    setDraft((d) => d.map((it) => (it.id === id ? { ...it, name: value } : it)));
  };

  const updatePriceStr = (id: string, value: string) => {
    // Allow only digits and a single dot
    if (!/^\d*\.?\d*$/.test(value)) return;
    setPriceStrs((p) => ({ ...p, [id]: value }));
    setDraft((d) =>
      d.map((it) =>
        it.id === id ? { ...it, price: parseFloat(value) || 0 } : it
      )
    );
  };

  const updateRateStr = (
    setter: (s: string) => void,
    value: string
  ) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    setter(value);
  };

  const remove = (id: string) => {
    setDraft((d) => d.filter((it) => it.id !== id));
    setPriceStrs((p) => {
      const { [id]: _, ...rest } = p;
      return rest;
    });
  };

  const addRow = () => {
    const id = `new-${Date.now()}`;
    setDraft((d) => [...d, { id, name: "", price: 0, claims: [] }]);
    setPriceStrs((p) => ({ ...p, [id]: "" }));
  };

  const handleSave = () => {
    onSave({
      items: draft,
      taxRate: (parseFloat(taxStr) || 0) / 100,
      serviceRate: (parseFloat(serviceStr) || 0) / 100,
    });
  };

  return (
    <div className="space-y-5">
      {/* Items */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
          Items
        </p>
        <div className="space-y-2">
          {draft.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateName(item.id, e.target.value)}
                placeholder="Item name"
                className="flex-1 rounded-lg border border-[#0F1A3D]/12 bg-white px-3 py-2 text-sm transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
              />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#0F1A3D]/50">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={priceStrs[item.id] ?? ""}
                  onChange={(e) => updatePriceStr(item.id, e.target.value)}
                  placeholder="0.00"
                  className="w-24 rounded-lg border border-[#0F1A3D]/12 bg-white py-2 pl-6 pr-2 text-right font-mono text-sm transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
                />
              </div>
              <button
                onClick={() => remove(item.id)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#0F1A3D]/50 transition hover:bg-[#E5484D]/10 hover:text-[#E5484D]"
                aria-label="Remove item"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addRow}
          className="mt-2 w-full rounded-lg border border-dashed border-[#0F1A3D]/20 px-3 py-2 text-sm font-medium text-[#0F1A3D]/60 transition hover:border-[#4F7CFF] hover:text-[#4F7CFF]"
        >
          + Add item
        </button>
      </div>

      {/* Tax & Gratuity */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
          Tax & Gratuity
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#0F1A3D]/60">
              Tax
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={taxStr}
                onChange={(e) => updateRateStr(setTaxStr, e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-[#0F1A3D]/12 bg-white py-2 pl-3 pr-7 text-right font-mono text-sm transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#0F1A3D]/50">
                %
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#0F1A3D]/60">
              Gratuity
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={serviceStr}
                onChange={(e) => updateRateStr(setServiceStr, e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-[#0F1A3D]/12 bg-white py-2 pl-3 pr-7 text-right font-mono text-sm transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#0F1A3D]/50">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <PreviewTotals
        items={draft}
        taxStr={taxStr}
        serviceStr={serviceStr}
      />

      <div className="flex justify-end gap-2 border-t border-[#0F1A3D]/8 pt-4">
        <button
          onClick={onCancel}
          className="rounded-full border border-[#0F1A3D]/15 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="rounded-full bg-[#0F1A3D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4F7CFF]"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function PreviewTotals({
  items,
  taxStr,
  serviceStr,
}: {
  items: ReceiptItem[];
  taxStr: string;
  serviceStr: string;
}) {
  const sub = items.reduce((s, i) => s + i.price, 0);
  const taxRate = (parseFloat(taxStr) || 0) / 100;
  const serviceRate = (parseFloat(serviceStr) || 0) / 100;
  const total = sub * (1 + taxRate + serviceRate);

  return (
    <div className="rounded-xl bg-[#0F1A3D]/5 p-4 text-sm">
      <div className="space-y-1 font-mono">
        <div className="flex justify-between">
          <span className="text-[#0F1A3D]/60">Subtotal</span>
          <span className="font-semibold">${sub.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#0F1A3D]/60">Tax</span>
          <span className="font-semibold">${(sub * taxRate).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#0F1A3D]/60">Gratuity</span>
          <span className="font-semibold">
            ${(sub * serviceRate).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-t border-[#0F1A3D]/10 pt-1.5 font-bold">
          <span>Grand total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}