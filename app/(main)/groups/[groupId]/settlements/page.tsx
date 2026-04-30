"use client";

import { useMemo, useState } from "react";
import Avatar from "@/app/components/Avatar";
import Modal from "@/app/components/Modal";
import {
  GROUP,
  PAID_UPFRONT,
  CURRENT_USER_ID,
  Settlement,
  computeSettlements,
  grandTotal,
  memberLiability,
  memberById,
} from "@/lib/groupData";

type PaymentType = "upfront" | "liability";

type LiabilityPaymentLog = {
  fromId: string;
  toId: string;
  amount: number;
};

export default function SettlementsPage() {
  const [paidUpfront, setPaidUpfront] = useState<Record<string, number>>({
    ...PAID_UPFRONT,
  });
  // Liability payments reduce settlement amounts when applied
  const [liabilityPayments, setLiabilityPayments] = useState<
    LiabilityPaymentLog[]
  >([]);
  const [showAddPayment, setShowAddPayment] = useState(false);

  const total = grandTotal(GROUP);
  const totalPaid = Object.values(paidUpfront).reduce((s, n) => s + n, 0);
  const outstanding = total - totalPaid;

  // Status table
  const status = GROUP.members.map((m) => {
    const paid = paidUpfront[m.id] ?? 0;
    const liab = memberLiability(GROUP, m.id);
    const liabPaymentsOut = liabilityPayments
      .filter((p) => p.fromId === m.id)
      .reduce((s, p) => s + p.amount, 0);
    const liabPaymentsIn = liabilityPayments
      .filter((p) => p.toId === m.id)
      .reduce((s, p) => s + p.amount, 0);
    const net = paid - liab; // pre-settlement net
    const currentNet = net + liabPaymentsOut - liabPaymentsIn; // after liability payments
    return { member: m, paid, liability: liab, net, currentNet };
  });

  // Optimal settlements computed from currentNet (i.e. accounting for already-made liability payments)
  const settlements = useMemo<Settlement[]>(() => {
    const creditors = status
      .filter((s) => s.currentNet > 0.01)
      .map((s) => ({ id: s.member.id, net: s.currentNet }))
      .sort((a, b) => b.net - a.net);
    const debtors = status
      .filter((s) => s.currentNet < -0.01)
      .map((s) => ({ id: s.member.id, net: s.currentNet }))
      .sort((a, b) => a.net - b.net);

    const out: Settlement[] = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i];
      const c = creditors[j];
      const amt = Math.min(-d.net, c.net);
      out.push({
        fromId: d.id,
        toId: c.id,
        amount: amt,
        status: "pending",
      });
      d.net += amt;
      c.net -= amt;
      if (Math.abs(d.net) < 0.01) i++;
      if (Math.abs(c.net) < 0.01) j++;
    }
    return out;
  }, [status]);

  const onSubmitPayment = (
    type: PaymentType,
    payload: { amount: number; toId?: string }
  ) => {
    if (type === "upfront") {
      setPaidUpfront((p) => ({
        ...p,
        [CURRENT_USER_ID]: (p[CURRENT_USER_ID] ?? 0) + payload.amount,
      }));
    } else if (type === "liability" && payload.toId) {
      setLiabilityPayments((prev) => [
        ...prev,
        { fromId: CURRENT_USER_ID, toId: payload.toId!, amount: payload.amount },
      ]);
    }
    setShowAddPayment(false);
  };

  return (
    <>
      {/* Top stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total Bill" value={`$${total.toFixed(2)}`} />
        <StatCard
          label="Outstanding"
          value={`${outstanding < 0 ? "+" : "−"}$${Math.abs(outstanding).toFixed(2)}`}
          valueClass={
            Math.abs(outstanding) < 0.01
              ? "text-[#0E9F6E]"
              : "text-[#E5484D]"
          }
        />
      </div>

      {/* Status table */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/90 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-[#0F1A3D]/8 px-5 py-4">
          <h2 className="text-sm font-bold tracking-wide">Status</h2>
          <button
            onClick={() => setShowAddPayment(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0F1A3D]/15 bg-white px-4 py-1.5 text-sm font-semibold transition hover:border-[#0F1A3D]/30 hover:bg-[#0F1A3D] hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Payment
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#0F1A3D]/8 text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/50">
                <th className="px-5 py-3 text-left">Member</th>
                <th className="px-3 py-3 text-right">Paid Upfront</th>
                <th className="px-3 py-3 text-right">Liability</th>
                <th className="px-3 py-3 text-right">Net</th>
                <th className="px-5 py-3 text-right">Current Net</th>
              </tr>
            </thead>
            <tbody>
              {status.map((row, i) => (
                <tr
                  key={row.member.id}
                  className={
                    i < status.length - 1 ? "border-b border-[#0F1A3D]/6" : ""
                  }
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={row.member.initials}
                        color={row.member.color}
                        size={32}
                      />
                      <span className="font-semibold">{row.member.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono">
                    ${row.paid.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono">
                    ${row.liability.toFixed(2)}
                  </td>
                  <td
                    className={`px-3 py-3 text-right font-mono font-semibold ${
                      row.net >= 0 ? "text-[#0E9F6E]" : "text-[#E5484D]"
                    }`}
                  >
                    {row.net >= 0 ? "+" : "−"}${Math.abs(row.net).toFixed(2)}
                  </td>
                  <td
                    className={`px-5 py-3 text-right font-mono font-bold ${
                      row.currentNet >= 0 ? "text-[#0E9F6E]" : "text-[#E5484D]"
                    }`}
                  >
                    {row.currentNet >= 0 ? "+" : "−"}$
                    {Math.abs(row.currentNet).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Optimal settlements */}
      <section className="rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-bold tracking-wide">
            Optimal Settlements
          </h2>
          <span className="text-xs text-[#0F1A3D]/50">
            {settlements.length} suggested
          </span>
        </div>
        {settlements.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#0F1A3D]/15 px-4 py-8 text-center text-sm text-[#0F1A3D]/55">
            🎉 All settled — no payments needed.
          </p>
        ) : (
          <ul className="space-y-2">
            {settlements.map((s, i) => {
              const from = memberById(GROUP, s.fromId)!;
              const to = memberById(GROUP, s.toId)!;
              return (
                <li
                  key={i}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-[#0F1A3D]/8 bg-white px-4 py-3"
                >
                  <Avatar initials={from.initials} color={from.color} size={32} />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0F1A3D"
                    strokeOpacity="0.4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <Avatar initials={to.initials} color={to.color} size={32} />
                  <p className="flex-1 text-sm">
                    <span className="font-semibold">{from.name}</span>{" "}
                    <span className="text-[#0F1A3D]/55">should pay</span>{" "}
                    <span className="font-semibold">{to.name}</span>
                  </p>
                  <span className="font-mono text-sm font-bold">
                    ${s.amount.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-[#F59E0B]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
                    Pending
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Add Payment modal */}
      <Modal
        open={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        title="Report a payment"
      >
        <AddPaymentForm
          onSubmit={onSubmitPayment}
          onCancel={() => setShowAddPayment(false)}
        />
      </Modal>
    </>
  );
}

function StatCard({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 text-center shadow-sm backdrop-blur md:p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-2xl font-extrabold tracking-tight md:text-3xl ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

function AddPaymentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (type: PaymentType, payload: { amount: number; toId?: string }) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<PaymentType>("upfront");
  const [amount, setAmount] = useState("");
  const [toId, setToId] = useState(
    GROUP.members.find((m) => m.id !== CURRENT_USER_ID)?.id ?? ""
  );

  const numericAmount = parseFloat(amount) || 0;
  const valid =
    numericAmount > 0 && (type === "upfront" || (type === "liability" && toId));

  return (
    <div className="space-y-5">
      {/* Payment type */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
          Payment type
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            onClick={() => setType("upfront")}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              type === "upfront"
                ? "border-[#4F7CFF] bg-[#4F7CFF]/5 ring-2 ring-[#4F7CFF]/20"
                : "border-[#0F1A3D]/10 bg-white hover:border-[#0F1A3D]/20"
            }`}
          >
            <p className="text-sm font-bold">Paid Upfront</p>
            <p className="mt-0.5 text-xs text-[#0F1A3D]/55">
              I paid the bill (or part of it)
            </p>
          </button>
          <button
            onClick={() => setType("liability")}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              type === "liability"
                ? "border-[#4F7CFF] bg-[#4F7CFF]/5 ring-2 ring-[#4F7CFF]/20"
                : "border-[#0F1A3D]/10 bg-white hover:border-[#0F1A3D]/20"
            }`}
          >
            <p className="text-sm font-bold">Liability Payment</p>
            <p className="mt-0.5 text-xs text-[#0F1A3D]/55">
              I paid another member back
            </p>
          </button>
        </div>
      </div>

      {/* To (only for liability) */}
      {type === "liability" && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
            Paid to
          </label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full rounded-xl border border-[#0F1A3D]/12 bg-white px-3 py-2.5 text-sm transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
          >
            {GROUP.members
              .filter((m) => m.id !== CURRENT_USER_ID)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Amount */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/55">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[#0F1A3D]/50">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            autoFocus
            className="w-full rounded-xl border border-[#0F1A3D]/12 bg-white py-2.5 pl-7 pr-3 font-mono text-sm transition focus:border-[#4F7CFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CFF]/15"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-[#0F1A3D]/8 pt-4">
        <button
          onClick={onCancel}
          className="rounded-full border border-[#0F1A3D]/15 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
        >
          Cancel
        </button>
        <button
          disabled={!valid}
          onClick={() =>
            onSubmit(type, {
              amount: numericAmount,
              toId: type === "liability" ? toId : undefined,
            })
          }
          className="rounded-full bg-[#0F1A3D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4F7CFF] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Report payment
        </button>
      </div>
    </div>
  );
}