import { LineItem, AmountMode, num, itemTotal, computeAmount } from "@/app/(main)/groups/new/utility";

export function ReceiptItemsSummary({
  items,
  taxValue,
  taxMode,
  gratuityValue,
  gratuityMode,
  onEdit,
}: {
  items: LineItem[];
  taxValue: string;
  taxMode: AmountMode;
  gratuityValue: string;
  gratuityMode: AmountMode;
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

      {(() => {
        const subtotal = items.reduce((sum, item) => sum + itemTotal(item), 0);
        const tax = computeAmount(taxValue, taxMode, subtotal);
        const gratuity = computeAmount(gratuityValue, gratuityMode, subtotal);
        const grandTotal = subtotal + tax + gratuity;
        const rows: { label: string; value: number; bold?: boolean }[] = [
          { label: "Subtotal", value: subtotal },
          { label: "Tax", value: tax },
          { label: "Gratuity", value: gratuity },
          { label: "Total", value: grandTotal, bold: true },
        ];
        return (
          <div className="border-t border-[#0F1A3D]/10 px-6 py-4 space-y-1">
            {rows.map(({ label, value, bold }) => (
              <div key={label} className="flex justify-between">
                <span className={`text-sm ${bold ? "font-semibold" : "text-[#0F1A3D]/60"}`}>
                  {label}
                </span>
                <span className={`font-mono text-sm ${bold ? "font-semibold" : "text-[#0F1A3D]/60"}`}>
                  ${value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
