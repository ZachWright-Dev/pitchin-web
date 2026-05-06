import { LineItem, num, itemTotal } from "@/app/(main)/groups/new/utility";

export function ReceiptItemsSummary({
  items,
  onEdit,
}: {
  items: LineItem[];
  onEdit: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#0F1A3D]/10 bg-white/80 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between border-b border-[#0F1A3D]/8 px-6 py-4">
        <div>
          <p className="font-semibold">Receipt Items</p>
          <p className="text-xs text-[#0F1A3D]/50">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="text-sm font-semibold text-[#4F7CFF] transition hover:text-[#0F1A3D]"
        >
          Edit
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`flex items-center gap-4 px-6 py-3 ${
            i < items.length - 1 ? "border-b border-[#0F1A3D]/5" : ""
          }`}
        >
          <span className="flex-1 text-sm">
            {item.name || (
              <span className="text-[#0F1A3D]/30">Unnamed item</span>
            )}
          </span>
          <span className="text-sm text-[#0F1A3D]/50">
            ×{num(item.qty) || 1}
          </span>
          <span className="font-mono text-sm font-semibold">
            ${itemTotal(item).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
