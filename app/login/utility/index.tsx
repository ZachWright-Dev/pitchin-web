export function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#0F1A3D]/60"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#0F1A3D]/12 bg-white px-4 py-3 text-sm text-[#0F1A3D] placeholder:text-[#0F1A3D]/35 transition focus:border-[#4F7CFF] focus:outline-none focus:ring-4 focus:ring-[#4F7CFF]/15"
      />
    </div>
  );
}

export function Eye() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOff() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a18.45 18.45 0 0 1 4.06-5.06" />
      <path d="M9.9 4.24A10.05 10.05 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 8h26a18 18 0 0 1 0 36H22v12h-10V8z" fill="#FAFBFF" />
      <path d="M22 30h12l-3 4 3 4H22V30z" fill="#34D399" />
      <path d="M34 38h10v8H34l-3-4 3-4z" fill="#4F7CFF" />
      <path d="M44 38h8a8 8 0 0 0 0-8h-8v8z" fill="#8B7CF6" />
      <rect x="26" y="14" width="14" height="18" rx="1" fill="#0F1A3D" />
      <rect x="29" y="19" width="8" height="1.5" rx="0.5" fill="#FAFBFF" opacity="0.5" />
      <rect x="29" y="22" width="6" height="1.5" rx="0.5" fill="#FAFBFF" opacity="0.5" />
    </svg>
  );
}
