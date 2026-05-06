export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#0F1A3D]/10 bg-white/80 p-6 shadow-sm backdrop-blur">
      {children}
    </div>
  );
}
