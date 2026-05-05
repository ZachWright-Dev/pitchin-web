"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { parseReceiptAction } from "./actions";
import {
  LineItem,
  AmountMode,
  NUMBER_INPUT_CLASS,
  newItem,
  num,
  itemTotal,
  computeAmount,
  fileToBase64
} from "@/app/(main)/groups/new/utility";

// ============================================================================
// Page
// ============================================================================

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
  const [groupPhotoUrl, setGroupPhotoUrl] = useState<string | null>(null);
  const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);
  const [receiptPhotoUrl, setReceiptPhotoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [taxValue, setTaxValue] = useState("");
  const [taxMode, setTaxMode] = useState<AmountMode>("dollar");
  const [gratuityValue, setGratuityValue] = useState("");
  const [gratuityMode, setGratuityMode] = useState<AmountMode>("dollar");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const groupPhotoRef = useRef<HTMLInputElement>(null);
  const receiptPhotoRef = useRef<HTMLInputElement>(null);

  const handleGroupPhotoChange = (file: File) => {
    setGroupPhoto(file);
    setGroupPhotoUrl(URL.createObjectURL(file));
  };

  const handleReceiptPhotoChange = (file: File) => {
    setReceiptPhoto(file);
    setReceiptPhotoUrl(URL.createObjectURL(file));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleReceiptPhotoChange(file);
  }, []);

  const handleAiParse = async () => {
    if (!receiptPhoto) return;
    setAiLoading(true);
    setAiError(null);

    try {
      const base64Image = await fileToBase64(receiptPhoto);
      const mimeType = receiptPhoto.type || "image/jpeg";
      const result = await parseReceiptAction(base64Image, mimeType);

      if (!result.success) {
        setAiError(result.error);
        return;
      }

      setLineItems(
        result.items.map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          qty: String(item.quantity),
          price: item.price.toFixed(2),
        }))
      );

      // Tax is returned as a dollar amount
      setTaxValue(result.tax.toFixed(2));
      setTaxMode("dollar");

      // Gratuity is not in the response — default to 0
      setGratuityValue("0");
      setGratuityMode("dollar");
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Failed to parse receipt"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const canCreate = lineItems.length > 0;

  return (
    <>
      <style jsx global>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="mx-auto max-w-2xl">
        <PageHeader />

        <div className="space-y-5">
          <GroupInfoCard
            groupName={groupName}
            setGroupName={setGroupName}
            groupPhoto={groupPhoto}
            groupPhotoUrl={groupPhotoUrl}
            groupPhotoRef={groupPhotoRef}
            onPickPhoto={handleGroupPhotoChange}
          />

          <ReceiptCard
            receiptPhoto={receiptPhoto}
            receiptPhotoUrl={receiptPhotoUrl}
            receiptPhotoRef={receiptPhotoRef}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            onDrop={handleDrop}
            onPickPhoto={handleReceiptPhotoChange}
            onManualEntry={() => setShowItemModal(true)}
            onAiParse={handleAiParse}
            aiError={aiError}
          />

          {lineItems.length > 0 && (
            <ReceiptItemsSummary
              items={lineItems}
              onEdit={() => setShowItemModal(true)}
            />
          )}

          <FooterActions canCreate={canCreate} />
        </div>
      </div>

      {aiLoading && <AiLoadingOverlay />}

      {showItemModal && (
        <ItemEntryModal
          initialItems={lineItems}
          initialTaxValue={taxValue}
          initialTaxMode={taxMode}
          initialGratuityValue={gratuityValue}
          initialGratuityMode={gratuityMode}
          onConfirm={(items, tv, tm, gv, gm) => {
            setLineItems(items);
            setTaxValue(tv);
            setTaxMode(tm);
            setGratuityValue(gv);
            setGratuityMode(gm);
            setShowItemModal(false);
          }}
          onCancel={() => setShowItemModal(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// Page header
// ============================================================================

function PageHeader() {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#0F1A3D]/50">
        Groups
      </p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">
        Create New Group
      </h1>
    </div>
  );
}

// ============================================================================
// Group info card
// ============================================================================

function GroupInfoCard({
  groupName,
  setGroupName,
  groupPhoto,
  groupPhotoUrl,
  groupPhotoRef,
  onPickPhoto,
}: {
  groupName: string;
  setGroupName: (v: string) => void;
  groupPhoto: File | null;
  groupPhotoUrl: string | null;
  groupPhotoRef: React.RefObject<HTMLInputElement | null>;
  onPickPhoto: (f: File) => void;
}) {
  return (
    <Card>
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold">Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. Nobu Dinner"
          className="w-full rounded-xl border border-[#0F1A3D]/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Group photo{" "}
          <span className="font-normal text-[#0F1A3D]/45">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#0F1A3D]/10 bg-[#FAFBFF]">
            {groupPhotoUrl ? (
              <img
                src={groupPhotoUrl}
                alt="Group"
                className="h-full w-full object-cover"
              />
            ) : (
              <IconPhoto />
            )}
          </div>
          {groupPhoto && (
            <span className="min-w-0 flex-1 truncate text-sm text-[#0F1A3D]/55">
              {groupPhoto.name}
            </span>
          )}
          <button
            onClick={() => groupPhotoRef.current?.click()}
            className="ml-auto shrink-0 rounded-xl border border-[#0F1A3D]/15 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
          >
            {groupPhoto ? "Replace" : "Upload"}
          </button>
          <input
            ref={groupPhotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickPhoto(f);
            }}
          />
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// Receipt card
// ============================================================================

function ReceiptCard({
  receiptPhoto,
  receiptPhotoUrl,
  receiptPhotoRef,
  isDragging,
  setIsDragging,
  onDrop,
  onPickPhoto,
  onManualEntry,
  onAiParse,
  aiError,
}: {
  receiptPhoto: File | null;
  receiptPhotoUrl: string | null;
  receiptPhotoRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onPickPhoto: (f: File) => void;
  onManualEntry: () => void;
  onAiParse: () => void;
  aiError: string | null;
}) {
  return (
    <Card>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !receiptPhoto && receiptPhotoRef.current?.click()}
        className={`relative mb-5 flex min-h-[130px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition ${
          isDragging
            ? "border-[#4F7CFF] bg-[#4F7CFF]/5"
            : "border-[#0F1A3D]/15 hover:border-[#0F1A3D]/25 hover:bg-[#FAFBFF]"
        }`}
      >
        {receiptPhoto ? (
          <div className="flex items-center gap-4 p-5">
            <img
              src={receiptPhotoUrl!}
              alt="Receipt"
              className="h-16 w-16 rounded-lg object-cover shadow-sm"
            />
            <div>
              <p className="text-sm font-semibold">{receiptPhoto.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  receiptPhotoRef.current?.click();
                }}
                className="mt-1 text-xs font-semibold text-[#4F7CFF] transition hover:text-[#0F1A3D]"
              >
                Replace photo
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="flex justify-center">
              <IconReceiptUpload />
            </div>
            <p className="mt-3 text-sm text-[#0F1A3D]/50">
              Drop Receipt photo here (optional)
            </p>
            <p className="mt-0.5 text-xs text-[#0F1A3D]/30">or click to browse</p>
          </div>
        )}
        <input
          ref={receiptPhotoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPickPhoto(f);
          }}
        />
      </div>

      {aiError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Failed to parse receipt</p>
          <p className="mt-0.5 text-xs text-red-600">{aiError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onManualEntry}
          className="flex-1 rounded-xl border border-[#0F1A3D]/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
        >
          Enter Manually
        </button>
        <button
          onClick={onAiParse}
          disabled={!receiptPhoto}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            receiptPhoto
              ? "bg-[#4F7CFF] text-white shadow-sm hover:bg-[#0F1A3D]"
              : "cursor-not-allowed bg-[#0F1A3D]/8 text-[#0F1A3D]/30"
          }`}
        >
          AI Parse
        </button>
      </div>
    </Card>
  );
}

// ============================================================================
// Receipt items summary
// ============================================================================

function ReceiptItemsSummary({
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

// ============================================================================
// Footer actions
// ============================================================================

function FooterActions({ canCreate }: { canCreate: boolean }) {
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

// ============================================================================
// AI loading overlay
// ============================================================================

function AiLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1A3D]/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4F7CFF]/20 border-t-[#4F7CFF]" />
        <p className="font-semibold text-[#0F1A3D]">Parsing receipt…</p>
        <p className="text-xs text-[#0F1A3D]/50">AI is reading your receipt</p>
      </div>
    </div>
  );
}

// ============================================================================
// Card wrapper
// ============================================================================

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#0F1A3D]/10 bg-white/80 p-6 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}

// ============================================================================
// Item Entry Modal
// ============================================================================

function ItemEntryModal({
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

// ============================================================================
// Modal sub-components
// ============================================================================

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

// ============================================================================
// Amount Mode Toggle
// ============================================================================

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

// ============================================================================
// Icons
// ============================================================================

function IconPhoto() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#0F1A3D]/30"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconReceiptUpload() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#0F1A3D]/25"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconGrip() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="3.5" cy="3" r="1" />
      <circle cx="8.5" cy="3" r="1" />
      <circle cx="3.5" cy="6" r="1" />
      <circle cx="8.5" cy="6" r="1" />
      <circle cx="3.5" cy="9" r="1" />
      <circle cx="8.5" cy="9" r="1" />
    </svg>
  );
}