import { DashboardResponse } from "@/lib/backend-client";

export default function BalanceSummary({
  summary,
}: {
  summary: DashboardResponse["summary"];
}) {
  const positive = summary.overall_balance >= 0;
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
              {positive ? "+" : "−"}$
              {Math.abs(summary.overall_balance).toFixed(2)}
            </span>
          </div>
          <p className="mt-2 text-xs text-[#0F1A3D]/55">
            {positive ? "You're owed" : "You owe"} money across{" "}
            {summary.num_groups_owed} groups
          </p>
        </div>
 
        <div className="flex flex-col justify-center md:border-r md:border-[#0F1A3D]/10 md:pr-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#34D399]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
              You&apos;re owed
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#0E9F6E] md:text-3xl">
            ${summary.amount_owed.toFixed(2)}
          </p>
        </div>
 
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E5484D]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
              You owe
            </p>
          </div>
          <p className="mt-2 text-2xl font-bold text-[#E5484D] md:text-3xl">
            ${summary.amount_owe.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}