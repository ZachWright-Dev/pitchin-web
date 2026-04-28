export function Row({
  name,
  amount,
  color,
}: {
  name: string;
  amount: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: color }}
        />
        <span className="font-medium text-[#0F1A3D]">{name}</span>
      </div>
      <span className="font-mono text-[#0F1A3D]/70">{amount}</span>
    </div>
  );
}

export function LogoMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 8h26a18 18 0 0 1 0 36H22v12h-10V8z"
        fill="#1B2559"
      />
      <path d="M22 30h12l-3 4 3 4H22V30z" fill="#34D399" />
      <path d="M34 38h10v8H34l-3-4 3-4z" fill="#4F7CFF" />
      <path d="M44 38h8a8 8 0 0 0 0-8h-8v8z" fill="#8B7CF6" />
      <rect x="26" y="14" width="14" height="18" rx="1" fill="#FFFFFF" />
      <rect x="29" y="19" width="8" height="1.5" rx="0.5" fill="#0F1A3D" opacity="0.15" />
      <rect x="29" y="22" width="6" height="1.5" rx="0.5" fill="#0F1A3D" opacity="0.15" />
    </svg>
  );
}