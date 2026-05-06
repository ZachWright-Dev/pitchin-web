"use client";

import { useState } from "react";
import {
  LineItem,
  AmountMode,
  NUMBER_INPUT_CLASS,
  newItem,
  itemTotal,
  computeAmount,
} from "@/app/(main)/groups/new/utility";
import { IconGrip, IconTrash } from "./icons";

export function ItemEntryModal({
  initialItems,
  initialTaxValue,
  initialTaxMode,
  initialGratuityValue,
  initialGratuityMode,
  onConfirm,
  onCancel,
}: {
  initialItems: LineItem[];
  initialTaxValue: string;
  initialTaxMode: AmountMode;
  initialGratuityValue: string;
  initialGratuityMode: AmountMode;
  onConfirm: (
    items: LineItem[],
    taxValue: string,
    taxMode: AmountMode,
    gratuityValue: string,
    gratuityMode: AmountMode
  ) => void;
  onCancel: () => void;
}) {
  const [items, setItems] = useState<LineItem[]>(
    initialItems.length > 0 ? initialItems : [newItem()]
  );
  const [taxValue, setTaxValue] = useState(initialTaxValue);
  const [taxMode, setTaxMode] = useState<AmountMode>(initialTaxMode);
  const [gratuityValue, setGratuityValue] = useState(initialGratuityValue);
  const [gratuityMode, setGratuityMode] =
    useState<AmountMode>(initialGratuityMode);

  const subtotal = items.reduce((sum, item) => sum + itemTotal(item), 0);
  const taxAmount = computeAmount(taxValue, taxMode, subtotal);
  const gratuityAmount = computeAmount(gratuityValue, gratuityMode, subtotal);
  const grandTotal = subtotal + taxAmount + gratuityAmount;

  const updateItem = (id: string, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const addItem = () => setItems((prev) => [...prev, newItem()]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-2xl bg-[#0F1A3D] text-white shadow-2xl">
          <ModalHeader itemCount={items.length} subtotal={subtotal} />
          <ModalColumnHeaders />

          <div className="max-h-52 overflow-y-auto">
            {items.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                onChange={(field, value) => updateItem(item.id, field, value)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>

          <div className="border-b border-white/10 px-6 py-3">
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#4F7CFF] transition hover:text-[#8B7CF6]"
            >
              <span className="text-base leading-none">+</span>
              Add Item
            </button>
          </div>

          <TotalsSection
            subtotal={subtotal}
            taxValue={taxValue}
            taxMode={taxMode}
            onTaxValueChange={setTaxValue}
            onTaxModeChange={setTaxMode}
            gratuityValue={gratuityValue}
            gratuityMode={gratuityMode}
            onGratuityValueChange={setGratuityValue}
            onGratuityModeChange={setGratuityMode}
            grandTotal={grandTotal}
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[#0F1A3D]/15 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(items, taxValue, taxMode, gratuityValue, gratuityMode)
            }
            className="flex-1 rounded-xl bg-[#0F1A3D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4F7CFF]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalHeader({
  itemCount,
  subtotal,
}: {
  itemCount: number;
  subtotal: number;
}) {
  return (
    <div className="flex items-start justify-between px-6 pb-3 pt-5">
      <div>
        <h2 className="text-base font-bold">Line Items</h2>
        <p className="mt-0.5 text-xs text-white/50">
          Tap any field to edit. Add as many items as you need.
        </p>
      </div>
      <p className="shrink-0 text-xs text-white/50">
        {itemCount} {itemCount === 1 ? "item" : "items"} · subtotal $
        {subtotal.toFixed(2)}
      </p>
    </div>
  );
}

function ModalColumnHeaders() {
  return (
    <div className="grid grid-cols-[1.5rem_1fr_4.5rem_5.5rem_1.75rem] items-center gap-2 border-b border-white/10 px-6 py-2">
      <span />
      <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
        Item
      </span>
      <span className="text-center text-xs font-semibold uppercase tracking-wide text-white/40">
        Qty
      </span>
      <span className="text-right text-xs font-semibold uppercase tracking-wide text-white/40">
        Price
      </span>
      <span />
    </div>
  );
}

function LineItemRow({
  item,
  onChange,
  onRemove,
}: {
  item: LineItem;
  onChange: (field: keyof LineItem, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr_4.5rem_5.5rem_1.75rem] items-center gap-2 border-b border-white/5 px-6 py-2.5">
      <span className="cursor-grab select-none text-center text-white/25">
        <IconGrip />
      </span>
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
        placeholder="Item name"
      />
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={item.qty}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9]/g, "");
          onChange("qty", v);
        }}
        className={`${NUMBER_INPUT_CLASS} w-full rounded-lg bg-white/10 px-2 py-1.5 text-center text-sm text-white outline-none focus:bg-white/15`}
        placeholder="1"
      />
      <input
        type="text"
        inputMode="decimal"
        value={item.price}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9.]/g, "");
          const parts = v.split(".");
          const cleaned =
            parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v;
          onChange("price", cleaned);
        }}
        className={`${NUMBER_INPUT_CLASS} w-full rounded-lg bg-white/10 py-1.5 pr-2 text-right text-sm text-white outline-none focus:bg-white/15`}
        placeholder="0.00"
      />
      <button
        onClick={onRemove}
        className="flex items-center justify-center text-white/30 transition hover:text-[#E5484D]"
        aria-label="Remove item"
      >
        <IconTrash />
      </button>
    </div>
  );
}

function TotalsSection({
  subtotal,
  taxValue,
  taxMode,
  onTaxValueChange,
  onTaxModeChange,
  gratuityValue,
  gratuityMode,
  onGratuityValueChange,
  onGratuityModeChange,
  grandTotal,
}: {
  subtotal: number;
  taxValue: string;
  taxMode: AmountMode;
  onTaxValueChange: (v: string) => void;
  onTaxModeChange: (m: AmountMode) => void;
  gratuityValue: string;
  gratuityMode: AmountMode;
  onGratuityValueChange: (v: string) => void;
  onGratuityModeChange: (m: AmountMode) => void;
  grandTotal: number;
}) {
  return (
    <div className="space-y-3 px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Subtotal (auto)</span>
        <span className="font-mono text-sm font-semibold">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <AdjustmentRow
        label="Tax"
        value={taxValue}
        mode={taxMode}
        onValueChange={onTaxValueChange}
        onModeChange={onTaxModeChange}
      />

      <AdjustmentRow
        label="Gratuity"
        value={gratuityValue}
        mode={gratuityMode}
        onValueChange={onGratuityValueChange}
        onModeChange={onGratuityModeChange}
      />

      <div className="flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-sm font-bold">Grand total</span>
        <span className="font-mono text-base font-bold text-[#34D399]">
          ${grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function AdjustmentRow({
  label,
  value,
  mode,
  onValueChange,
  onModeChange,
}: {
  label: string;
  value: string;
  mode: AmountMode;
  onValueChange: (v: string) => void;
  onModeChange: (m: AmountMode) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex-1 text-sm text-white/60">{label}</span>
      <AmountModeToggle mode={mode} onChange={onModeChange} />
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9.]/g, "");
          const parts = v.split(".");
          const cleaned =
            parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : v;
          onValueChange(cleaned);
        }}
        className={`${NUMBER_INPUT_CLASS} w-20 rounded-lg bg-white/10 px-2 py-1.5 text-right text-sm text-white outline-none focus:bg-white/15`}
        placeholder="0"
      />
    </div>
  );
}

function AmountModeToggle({
  mode,
  onChange,
}: {
  mode: AmountMode;
  onChange: (m: AmountMode) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-white/15">
      <button
        onClick={() => onChange("percent")}
        className={`px-2.5 py-1 text-xs font-semibold transition ${
          mode === "percent"
            ? "bg-white/20 text-white"
            : "text-white/40 hover:bg-white/10"
        }`}
      >
        %
      </button>
      <button
        onClick={() => onChange("dollar")}
        className={`px-2.5 py-1 text-xs font-semibold transition ${
          mode === "dollar"
            ? "bg-white/20 text-white"
            : "text-white/40 hover:bg-white/10"
        }`}
      >
        $
      </button>
    </div>
  );
}
