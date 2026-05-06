import { Card } from "./Card";
import { IconReceiptUpload } from "./icons";

export function ReceiptCard({
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
