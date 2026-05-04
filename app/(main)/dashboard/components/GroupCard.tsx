import { GroupWithImage } from "../types";
 

export default function GroupCard({ group }: { group: GroupWithImage }) {
  const positive = group.balance >= 0;
 
  // Determine what to show: emoji, base64 image, or fallback
  const renderGroupIcon = () => {
    if (group.groupImage && group.groupImageType) {
      return (
        <img
          src={`data:${group.groupImageType};base64,${group.groupImage}`}
          alt={group.name}
          className="h-full w-full rounded-xl object-cover"
        />
      );
    }
    return <span className="text-2xl">{group.emoji ?? "👥"}</span>;
  };
 
  return (
    <button className="group relative overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition hover:translate-y-[-2px] hover:border-[#0F1A3D]/20 hover:shadow-md">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: group.accent }}
      />
 
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-2xl"
          style={{ background: group.groupImage ? undefined : `${group.accent}18` }}
        >
          {renderGroupIcon()}
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