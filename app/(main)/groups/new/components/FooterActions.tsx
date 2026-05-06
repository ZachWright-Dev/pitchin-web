import Link from "next/link";

export function FooterActions({
  canCreate,
  isSubmitting,
  onSubmit,
}: {
  canCreate: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const disabled = !canCreate || isSubmitting;

  return (
    <div className="flex gap-3 pt-2">
      <Link
        href="/groups"
        aria-disabled={isSubmitting}
        className={`flex-1 rounded-xl border border-[#0F1A3D]/15 bg-white px-6 py-3 text-center text-sm font-semibold transition hover:bg-[#0F1A3D]/5 ${
          isSubmitting ? "pointer-events-none opacity-50" : ""
        }`}
      >
        Cancel
      </Link>
      <button
        disabled={disabled}
        onClick={onSubmit}
        className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition ${
          disabled
            ? "cursor-not-allowed bg-[#0F1A3D]/10 text-[#0F1A3D]/30"
            : "bg-[#0F1A3D] text-white shadow-sm hover:bg-[#4F7CFF]"
        }`}
      >
        {isSubmitting ? "Creating…" : "Create Group"}
      </button>
    </div>
  );
}