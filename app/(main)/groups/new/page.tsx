"use client";

import { useState, useRef, useCallback } from "react";
import { parseReceiptAction } from "@/app/(main)/groups/new/actions";
import { LineItem, AmountMode, fileToBase64 } from "@/app/(main)/groups/new/utility";
import { PageHeader } from "@/app/(main)/groups/new/components/PageHeader";
import { GroupInfoCard } from "@/app/(main)/groups/new/components/GroupInfoCard";
import { ReceiptCard } from "@/app/(main)/groups/new/components/ReceiptCard";
import { ReceiptItemsSummary } from "@/app/(main)/groups/new/components/ReceiptItemsSummary";
import { FooterActions } from "@/app/(main)/groups/new/components/FooterActions";
import { AiLoadingOverlay } from "@/app/(main)/groups/new/components/AiLoadingOverlay";
import { ItemEntryModal } from "@/app/(main)/groups/new/components/ItemEntryModal";

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

      setTaxValue(result.tax.toFixed(2));
      setTaxMode("dollar");
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

  const canCreate: boolean = lineItems.length > 0 && groupName !== "";

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
              taxValue={taxValue}
              taxMode={taxMode}
              gratuityValue={gratuityValue}
              gratuityMode={gratuityMode}
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
