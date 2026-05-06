export function AiLoadingOverlay() {
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
