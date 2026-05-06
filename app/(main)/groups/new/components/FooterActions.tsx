import Link from "next/link";

export function FooterActions({ canCreate }: { canCreate: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <Link
        href="/groups"
        className="flex-1 rounded-xl border border-[#0F1A3D]/15 bg-white px-6 py-3 text-center text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
      >
        Cancel
      </Link>
      <button
        disabled={!canCreate}
        className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition ${
          canCreate
            ? "bg-[#0F1A3D] text-white shadow-sm hover:bg-[#4F7CFF]"
            : "cursor-not-allowed bg-[#0F1A3D]/10 text-[#0F1A3D]/30"
        }`}
      >
        Create Group
      </button>
    </div>
  );
}
